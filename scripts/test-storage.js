const admin = require('firebase-admin');
const serviceAccount = require('../firebase-admin-key.json');

if (!admin.apps.length) {
  admin.initializeApp({ 
    credential: admin.credential.cert(serviceAccount),
    // ADD THIS LINE (Replace with your actual project ID from the console)
    storageBucket: 'cube-8c773.firebasestorage.app' 
  });
}

async function testStorage() {
  try {
    // Now bucket() will use the storageBucket defined above
    const bucket = admin.storage().bucket();
    
    const [url] = await bucket.file('test.png').getSignedUrl({
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000,
    });
    
    console.log('✅ Success! Signed URL generated:', url);
  } catch (error) {
    console.error('❌ Storage Test Failed:', error.message);
  }
}

testStorage();