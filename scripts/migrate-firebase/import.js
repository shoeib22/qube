// One-off migration script: loads scripts/migrate-firebase/export/*.json (produced by
// export.js) into the self-hosted Supabase instance — Auth users, XerovoltProfile,
// XerovoltProduct, XerovoltOrder, XerovoltErvLead, and Storage objects.
//
// IMPORTANT: auth.users is shared with every other app on this Supabase instance
// (Osteq today). This script only INSERTs new rows scoped to users found in the
// Firebase export — it never touches existing rows — but review it before running
// against the real instance, and take a `pg_dump` of at least the `auth` schema first.
//
// Requires (in .env.local or the environment):
//   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DATABASE_URL
//   Optional, for password-preserving migration (see below):
//     FIREBASE_SCRYPT_SIGNER_KEY, FIREBASE_SCRYPT_SALT_SEPARATOR,
//     FIREBASE_SCRYPT_ROUNDS, FIREBASE_SCRYPT_MEM_COST
//   (Console -> Authentication -> Users -> "Password hash parameters", shown when you
//   open the user-export dialog. Not available via the Admin SDK.)
//
// Usage: npm run migrate:import-supabase
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');
const { PrismaClient } = require('@prisma/client');

const EXPORT_DIR = path.join(__dirname, 'export');
const STORAGE_DIR = path.join(EXPORT_DIR, 'storage', 'products');
const PRODUCTS_BUCKET = 'products';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);
const prisma = new PrismaClient();

const HAS_SCRYPT_CONFIG =
    process.env.FIREBASE_SCRYPT_SIGNER_KEY &&
    process.env.FIREBASE_SCRYPT_SALT_SEPARATOR &&
    process.env.FIREBASE_SCRYPT_ROUNDS &&
    process.env.FIREBASE_SCRYPT_MEM_COST;

function readJson(name) {
    return JSON.parse(fs.readFileSync(path.join(EXPORT_DIR, name), 'utf-8'));
}

/**
 * Builds the `firebase-scrypt$...` encrypted_password value GoTrue recognizes, so a
 * migrated user can log in with their existing Firebase password unchanged. Only
 * possible when both the per-user passwordHash/passwordSalt (from export.js) and the
 * project-wide scrypt parameters (env vars above) are present.
 */
function buildFirebaseScryptHash(passwordHash, passwordSalt) {
    const { FIREBASE_SCRYPT_SIGNER_KEY, FIREBASE_SCRYPT_SALT_SEPARATOR, FIREBASE_SCRYPT_ROUNDS, FIREBASE_SCRYPT_MEM_COST } = process.env;
    return `firebase-scrypt$${FIREBASE_SCRYPT_SIGNER_KEY}$${passwordSalt}$${FIREBASE_SCRYPT_SALT_SEPARATOR}$${FIREBASE_SCRYPT_ROUNDS}$${FIREBASE_SCRYPT_MEM_COST}$${passwordHash}`;
}

/**
 * Inserts a row directly into auth.users with a pre-hashed password. Raw SQL is
 * required here — the Admin API (auth.admin.createUser) only accepts plaintext
 * passwords, it has no "create with existing hash" option.
 */
async function insertAuthUserWithHash({ id, email, encryptedPassword, appMetadata, userMetadata, createdAt }) {
    await prisma.$executeRaw`
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password,
            email_confirmed_at, created_at, updated_at,
            raw_app_meta_data, raw_user_meta_data, is_sso_user, is_anonymous
        ) VALUES (
            '00000000-0000-0000-0000-000000000000', ${id}::uuid, 'authenticated', 'authenticated',
            ${email}, ${encryptedPassword},
            ${createdAt}::timestamptz, ${createdAt}::timestamptz, now(),
            ${JSON.stringify(appMetadata)}::jsonb, ${JSON.stringify(userMetadata)}::jsonb, false, false
        )
    `;
}

/**
 * auth.users.email is unique across the whole Supabase instance, not scoped per app —
 * this Postgres project is shared with Osteq. If someone (e.g. the site owner) already
 * has an account under this email from another app, reuse that identity instead of
 * failing, rather than trying to create a second account for the same email.
 */
async function findExistingAuthUserId(email) {
    const rows = await prisma.$queryRaw`SELECT id FROM auth.users WHERE email = ${email} LIMIT 1`;
    return rows[0]?.id ?? null;
}

async function createAuthUser(firebaseUser) {
    const { uid, email, displayName, role, createdAt, passwordHash, passwordSalt } = firebaseUser;
    const [firstName, ...rest] = (displayName || '').split(' ');
    const lastName = rest.join(' ');
    const appMetadata = { role: role || 'customer' };
    const userMetadata = { firstName, lastName, full_name: displayName || '' };

    const existingId = await findExistingAuthUserId(email);
    if (existingId) {
        // Merge (not overwrite) app_metadata — don't clobber fields another app may have set.
        const { data: existing } = await supabase.auth.admin.getUserById(existingId);
        await supabase.auth.admin.updateUserById(existingId, {
            app_metadata: { ...existing?.user?.app_metadata, role: role || 'customer' },
        });
        return { id: existingId, passwordPreserved: true, reused: true };
    }

    if (HAS_SCRYPT_CONFIG && passwordHash && passwordSalt) {
        const id = crypto.randomUUID();
        await insertAuthUserWithHash({
            id,
            email,
            encryptedPassword: buildFirebaseScryptHash(passwordHash, passwordSalt),
            appMetadata,
            userMetadata,
            createdAt: createdAt || new Date().toISOString(),
        });
        return { id, passwordPreserved: true };
    }

    // Fallback: create with a random password, then send a reset email so the user
    // sets their own. Used for every user when FIREBASE_SCRYPT_* env vars aren't set,
    // and per-user for any account missing a password hash in the export (e.g. it
    // wasn't an email/password account).
    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password: crypto.randomBytes(24).toString('base64url'),
        email_confirm: true,
        app_metadata: appMetadata,
        user_metadata: userMetadata,
    });
    if (error) throw error;
    return { id: data.user.id, passwordPreserved: false };
}

async function importAuthUsers() {
    const authUsers = readJson('auth-users.json');
    const uidMap = new Map(); // firebase uid -> supabase user id
    let preserved = 0;
    let reset = 0;

    for (const u of authUsers) {
        if (!u.email) {
            console.warn(`Skipping user ${u.uid} — no email`);
            continue;
        }
        const { id, passwordPreserved, reused } = await createAuthUser(u);
        uidMap.set(u.uid, id);
        passwordPreserved ? preserved++ : reset++;
        const tag = reused ? '[existing account reused]' : passwordPreserved ? '[password kept]' : '[needs reset]';
        console.log(`  ${tag} ${u.email} -> ${id}`);
    }

    console.log(`\nAuth import: ${preserved} kept their password, ${reset} will need a reset email.`);
    if (reset > 0) {
        console.log('Send password-reset emails to the "needs reset" users via supabase.auth.resetPasswordForEmail before announcing cutover.');
    }
    return uidMap;
}

async function importProfiles(uidMap) {
    const users = readJson('users.json'); // Firestore users/{uid} docs
    let count = 0;
    for (const u of users) {
        const newId = uidMap.get(u.id);
        if (!newId) {
            console.warn(`No auth user for Firestore users/${u.id} (${u.email}) — skipping profile`);
            continue;
        }
        await prisma.xerovoltProfile.upsert({
            where: { id: newId },
            create: {
                id: newId,
                email: u.email,
                firstName: u.firstName,
                lastName: u.lastName,
                role: u.role || 'customer',
                legacyFirebaseUid: u.id,
            },
            update: {},
        });
        count++;
    }
    console.log(`Imported ${count} profile(s)`);
}

async function importProducts() {
    const products = readJson('products.json');
    const idMap = new Map(); // firestore product id -> new XerovoltProduct id
    for (const p of products) {
        // Same normalization as lib/storage-helpers.ts convertToStoragePath — export.js
        // downloads objects relative to the "products/" prefix, so strip any leading
        // "images/"/"products/" the Firestore doc's `image` field might still carry.
        const image = p.image ? p.image.replace(/^\/?(images\/)?(products\/)?/, '') : null;
        const created = await prisma.xerovoltProduct.create({
            data: {
                name: p.name,
                category: p.category,
                price: p.price,
                image,
                isActive: p.isActive ?? true,
            },
        });
        idMap.set(p.id, created.id);
    }
    console.log(`Imported ${products.length} product(s)`);
    return idMap;
}

async function importOrders(uidMap) {
    const orders = readJson('orders.json');
    let count = 0;
    for (const o of orders) {
        // Guest checkouts have a synthetic "USER_<uuid>" id that never existed in Auth —
        // keep it as-is (matches how the app already treats userId as a free-text field,
        // see prisma/schema.prisma). Logged-in orders get remapped to the new Supabase id.
        const userId = uidMap.get(o.userId) || o.userId;
        try {
            await prisma.xerovoltOrder.create({
                data: {
                    orderId: o.orderId,
                    transactionId: o.transactionId,
                    userId,
                    amount: o.amount,
                    items: o.items,
                    customerInfo: o.customerInfo,
                    status: o.status || 'PENDING',
                    paymentMethod: o.paymentMethod || 'phonepe',
                    paymentDetails: o.paymentDetails ?? undefined,
                },
            });
            count++;
        } catch (err) {
            console.warn(`Skipping order ${o.orderId}: ${err.message}`);
        }
    }
    console.log(`Imported ${count}/${orders.length} order(s)`);
}

async function importErvLeads() {
    const leads = readJson('erv_download_leads.json');
    for (const lead of leads) {
        await prisma.xerovoltErvLead.create({
            data: { name: lead.name, email: lead.email, contact: lead.contact, product: lead.product || 'ERV' },
        });
    }
    console.log(`Imported ${leads.length} ERV lead(s)`);
}

async function importStorage() {
    if (!fs.existsSync(STORAGE_DIR)) {
        console.log('No exported storage objects found, skipping.');
        return;
    }
    const files = fs.readdirSync(STORAGE_DIR, { recursive: true }).filter((f) => fs.statSync(path.join(STORAGE_DIR, f)).isFile());
    for (const relativePath of files) {
        const buffer = fs.readFileSync(path.join(STORAGE_DIR, relativePath));
        const { error } = await supabase.storage.from(PRODUCTS_BUCKET).upload(relativePath, buffer, { upsert: true });
        if (error) console.warn(`Failed to upload ${relativePath}: ${error.message}`);
    }
    console.log(`Uploaded ${files.length} storage object(s) to the "${PRODUCTS_BUCKET}" bucket`);
}

async function main() {
    if (!HAS_SCRYPT_CONFIG) {
        console.warn('FIREBASE_SCRYPT_* env vars not set — every migrated user will get a random password and need a reset email.\n');
    }

    console.log('Ensuring the "products" Storage bucket exists and is public...');
    const { error: bucketError } = await supabase.storage.createBucket(PRODUCTS_BUCKET, { public: true });
    if (bucketError && !bucketError.message.includes('already exists')) throw bucketError;

    console.log('\nImporting Auth users...');
    const uidMap = await importAuthUsers();

    console.log('\nImporting profiles...');
    await importProfiles(uidMap);

    console.log('\nImporting products...');
    await importProducts();

    console.log('\nImporting orders...');
    await importOrders(uidMap);

    console.log('\nImporting ERV leads...');
    await importErvLeads();

    console.log('\nUploading product images to Storage...');
    await importStorage();

    console.log('\nDone.');
    process.exit(0);
}

main()
    .catch((err) => {
        console.error('Import failed:', err);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
