import { NextResponse } from 'next/server';
import admin, { auth } from '../../../lib/firebaseAdmin';

export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName } = await request.json();

    // Check if auth is properly initialized
    if (!auth || typeof auth.createUser !== 'function') {
      console.error("Firebase Admin Auth is not initialized. Missing FIREBASE_PRIVATE_KEY?");
      return NextResponse.json({
        error: 'Server misconfiguration: Firebase Admin Authentication is not initialized. Please check FIREBASE_PRIVATE_KEY in .env.local.'
      }, { status: 500 });
    }

    // 1. Create user in Firebase Authentication
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    });

    // 2. Assign a default 'customer' role in Authentication (Custom Claims)
    await auth.setCustomUserClaims(userRecord.uid, { role: 'customer' });

    // 3. Create user document in Firestore (for profile data + backup role)
    // We use admin.firestore() here since we are in a server environment
    const db = admin.firestore();
    await db.collection('users').doc(userRecord.uid).set({
      firstName,
      lastName,
      email,
      role: 'customer',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`Successfully created user: ${userRecord.uid}`);

    return NextResponse.json({
      success: true,
      uid: userRecord.uid
    }, { status: 201 });

  } catch (error: any) {
    console.error("Registration API Error:", error.message);

    // Always return JSON so the frontend doesn't crash with "Unexpected token <"
    return NextResponse.json({
      error: error.message || 'Internal Server Error'
    }, { status: 500 });
  }
}
