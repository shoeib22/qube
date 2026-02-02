const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('../firebase-admin-key.json');

console.log('🚀 Starting Firebase Image Path Migration Script\n');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'cube-8c773.firebasestorage.app'
  });
  console.log('✅ Firebase Admin initialized');
}

async function migrateImagePaths() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔄 Starting image path migration...');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    // Correct way to target the 'qube-tech' database
    const db = getFirestore('qube-tech');

    console.log('📦 Fetching products from Firestore (qube-tech)...');
    
    const productsRef = db.collection('products');
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

      if (!oldPath || typeof oldPath !== 'string') {
        console.log(`   ⚠️  No valid image path found, skipping`);
        skipped++;
        continue;
      }

      console.log(`   Current path: "${oldPath}"`);

      // 1. Skip if already correct Storage path format
      if (oldPath.startsWith('products/') && !oldPath.includes('/images/')) {
        console.log(`   ✅ Already using correct Storage path`);
        skipped++;
        continue;
      }

      // 2. Skip if it's a full gs:// URL
      if (oldPath.startsWith('gs://')) {
        console.log(`   ✅ Already using Storage URL`);
        skipped++;
        continue;
      }

      // 3. Transformation logic:
      let filename = oldPath.replace(/^\/+/, '').replace(/^images\//, '');
      const newPath = filename.startsWith('products/') ? filename : `products/${filename}`;

      if (oldPath === newPath) {
        console.log(`   ✅ Path already matches target format`);
        skipped++;
        continue;
      }

      console.log(`   🔄 Converting to: "${newPath}"`);

      try {
        await doc.ref.update({
          image: newPath,
          imageMigratedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log(`   ✅ Successfully updated!`);
        updated++;
      } catch (error) {
        console.log(`   ❌ Failed to update doc ${doc.id}: ${error.message}`);
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

  } catch (error) {
    console.error('\n❌ Migration failed with error:');
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Execute the function
migrateImagePaths()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });