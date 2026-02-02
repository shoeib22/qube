import admin from '../lib/firebaseAdmin';
// 1. Import modular service getters
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

/**
 * Script to promote a user to admin role
 * Usage: npx ts-node scripts/make-admin.ts <email>
 */

async function promoteToAdmin(email: string) {
    try {
        console.log(`🔍 Looking for user with email: ${email}`);

        // 2. Access Auth modularly
        const auth = getAuth(admin);
        const userRecord = await auth.getUserByEmail(email);
        console.log(`✅ Found user: ${userRecord.uid}`);

        // 3. Set custom claims for RBAC
        await auth.setCustomUserClaims(userRecord.uid, { role: 'admin' });
        console.log(`✅ Set custom claims: role=admin`);

        // 4. Update Firestore doc in 'qube-tech' instance
        const db = getFirestore(admin, 'qube-tech');
        await db.collection('users')
            .doc(userRecord.uid)
            .update({
                role: 'admin',
                updatedAt: FieldValue.serverTimestamp()
            });
        console.log(`✅ Updated Firestore document in qube-tech`);

        console.log(`\n🎉 Successfully promoted ${email} to admin!`);
        console.log(`⚠️  User must log out and log back in for changes to take effect.\n`);

        process.exit(0);
    } catch (error: any) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

const email = process.argv[2];
if (!email) {
    console.error('❌ Please provide an email address');
    console.log('Usage: npx ts-node scripts/make-admin.ts <email>');
    process.exit(1);
}

promoteToAdmin(email);