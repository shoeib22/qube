const admin = require('firebase-admin');
const serviceAccount = require('../firebase-admin-key.json');

console.log('🚀 Starting Firebase Image Path Migration Script\n');
console.log('✅ Loaded service account credentials');
console.log(`📋 Project ID: ${serviceAccount.project_id}\n`);

// Initialize Firebase Admin with the specific database
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'qube-8c773.firebasestorage.app'
  });
}

// Get Firestore instance for the specific database
// For named databases, we need to use the database path
const db = admin.firestore();

// Set the database ID for named database
// Use this format for named databases (not default)
const databasePath = `projects/${serviceAccount.project_id}/databases/qube-tech`;

console.log('✅ Firebase Admin initialized');
console.log(`🗄️  Using database: qube-tech\n`);

async function migrateImagePaths() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔄 Starting image path migration...');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    // For named databases, we need to manually construct the request
    // Let's try using the Google Cloud Firestore client directly
    const { Firestore } = require('@google-cloud/firestore');
    
    const firestoreClient = new Firestore({
      projectId: serviceAccount.project_id,
      credentials: serviceAccount,
      databaseId: 'qube-tech'  // Specify the named database
    });

    console.log('📦 Fetching products from Firestore...');
    
    const productsRef = firestoreClient.collection('products');
    const snapshot = await productsRef.get();
    
    console.log(`✅ Found ${snapshot.size} products\n`);

    if (snapshot.empty) {
      console.log('⚠️  No products found in database');
      return;
    }

    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const oldPath = data.image;

      console.log(`\n📄 Processing: ${doc.id}`);

      if (!oldPath) {
        console.log(`   ⚠️  No image path found, skipping`);
        skipped++;
        continue;
      }

      console.log(`   Current path: "${oldPath}"`);

      // Check if already using Firebase Storage path format
      if (oldPath.startsWith('products/') || oldPath.startsWith('gs://')) {
        console.log(`   ✅ Already using correct Storage path`);
        skipped++;
        continue;
      }

      // Convert old path to new Storage path
      // Handle paths like "/images/products2 Touch-Acrylic.png"
      let filename = oldPath;
      
      // Remove /images/ or /images/products prefix
      filename = filename.replace(/^\/?(images\/)?(products)?/, '');
      
      // Ensure it starts with products/
      const newPath = filename.startsWith('products/') ? filename : `products/${filename}`;

      console.log(`   🔄 Converting to: "${newPath}"`);

      try {
        await doc.ref.update({
          image: newPath,
          imageMigratedAt: Firestore.FieldValue.serverTimestamp()
        });

        console.log(`   ✅ Successfully updated!`);
        updated++;
      } catch (error) {
        console.log(`   ❌ Failed to update: ${error.message}`);
        errors++;
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Migration complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📊 Summary:`);
    console.log(`   ✅ Updated:  ${updated} products`);
    console.log(`   ⏭️  Skipped:  ${skipped} products`);
    console.log(`   ❌ Errors:   ${errors} products`);
    console.log(`   📦 Total:    ${snapshot.size} products`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (updated > 0) {
      console.log('🎉 Image paths have been updated successfully!');
      console.log('📝 Next steps:');
      console.log('   1. Update your lib/firebase.ts to use databaseId: "qube-tech"');
      console.log('   2. Test your API: http://localhost:3000/api/products');
      console.log('   3. Verify images display correctly on your products page\n');
    }

  } catch (error) {
    console.error('\n❌ Migration failed with error:');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

migrateImagePaths()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Unexpected error:', error);
    process.exit(1);
  });