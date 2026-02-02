const admin = require('firebase-admin');
const { Firestore } = require('@google-cloud/firestore');
const serviceAccount = require('../firebase-admin-key.json');

console.log('🔍 Firebase Connection Tester\n');
console.log('Service Account Info:');
console.log(`  Project ID: ${serviceAccount.project_id}`);
console.log(`  Client Email: ${serviceAccount.client_email}\n`);

// Test different database configurations
async function testConnections() {
  const configs = [
    { name: 'Default (no databaseId)', databaseId: undefined },
    { name: 'qube-tech', databaseId: 'qube-tech' },
    { name: '(default)', databaseId: '(default)' },
    { name: 'cube-tech', databaseId: 'cube-tech' },
  ];

  for (const config of configs) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Testing: ${config.name}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    try {
      const options = {
        projectId: serviceAccount.project_id,
        credentials: serviceAccount,
      };
      
      if (config.databaseId) {
        options.databaseId = config.databaseId;
      }
      
      const db = new Firestore(options);
      const snapshot = await db.collection('products').limit(1).get();
      
      console.log(`✅ SUCCESS! Found ${snapshot.size} documents`);
      
      if (snapshot.size > 0) {
        const doc = snapshot.docs[0];
        console.log(`   Sample doc ID: ${doc.id}`);
        const data = doc.data();
        if (data.image) {
          console.log(`   Sample image path: ${data.image}`);
        }
      }
      
      console.log(`\n💡 USE THIS CONFIGURATION:`);
      if (config.databaseId) {
        console.log(`   databaseId: '${config.databaseId}'`);
      } else {
        console.log(`   No databaseId needed (use default)`);
      }
      console.log('\n');
      
      // Found working config, stop here
      return { success: true, config };
      
    } catch (error) {
      console.log(`❌ Failed: ${error.message}`);
      console.log('');
    }
  }
  
  return { success: false };
}

testConnections()
  .then((result) => {
    if (!result.success) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('❌ None of the configurations worked!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\n🔍 Troubleshooting steps:');
      console.log('1. Verify your service account has Firestore permissions');
      console.log('2. Check the database name in Firebase Console');
      console.log('3. Make sure the database is in the same project');
      console.log('4. Try accessing Firestore from the Firebase Console to confirm it works\n');
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });