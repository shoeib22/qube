import admin from '../lib/firebaseAdmin';

/**
 * Script to promote a user to admin role
 * Usage: node scripts/make-admin.js <email>
 */

async function promoteToAdmin(email: string) {
    try {
        console.log(`🔍 Looking for user with email: ${email}`);

        // Get user by email
        const userRecord = await admin.auth().getUserByEmail(email);
        console.log(`✅ Found user: ${userRecord.uid}`);

        // Set custom claims
        await admin.auth().setCustomUserClaims(userRecord.uid, { role: 'admin' });
        console.log(`✅ Set custom claims: role=admin`);

        // Update Firestore document
        await admin.firestore()
            .collection('users')
            .doc(userRecord.uid)
            .update({
                role: 'admin',
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
        console.log(`✅ Updated Firestore document`);

        console.log(`\n🎉 Successfully promoted ${email} to admin!`);
        console.log(`⚠️  User must log out and log back in for changes to take effect.\n`);

        process.exit(0);
    } catch (error: any) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// Get email from command line
const email = process.argv[2];

if (!email) {
    console.error('❌ Please provide an email address');
    console.log('Usage: npm run make-admin <email>');
    process.exit(1);
}

promoteToAdmin(email);
