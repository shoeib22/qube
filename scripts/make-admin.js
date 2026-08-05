const { createClient } = require('@supabase/supabase-js');
const { PrismaClient } = require('@prisma/client');

/**
 * Script to promote a user to admin role
 * Usage: npm run make-admin <email>
 */

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);
const prisma = new PrismaClient();

async function promoteToAdmin(email) {
    try {
        console.log(`Looking for user with email: ${email}`);

        // Get user by email (service-role admin API, matches Firebase's getUserByEmail)
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
        if (listError) throw listError;
        const userRecord = users.find((u) => u.email === email);
        if (!userRecord) throw new Error(`No user found with email ${email}`);
        console.log(`Found user: ${userRecord.id}`);

        // Set app_metadata.role (Supabase's equivalent of Firebase custom claims)
        const { error: updateError } = await supabase.auth.admin.updateUserById(userRecord.id, {
            app_metadata: { role: 'admin' },
        });
        if (updateError) throw updateError;
        console.log(`Set app_metadata: role=admin`);

        // Update the profile table
        await prisma.xerovoltProfile.update({
            where: { id: userRecord.id },
            data: { role: 'admin' },
        });
        console.log(`Updated xerovolt_profiles row`);

        console.log(`\nSuccessfully promoted ${email} to admin!`);
        console.log(`User must log out and log back in for changes to take effect.\n`);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

// Get email from command line
const email = process.argv[2];

if (!email) {
    console.error('Please provide an email address');
    console.log('Usage: npm run make-admin <email>');
    process.exit(1);
}

promoteToAdmin(email);
