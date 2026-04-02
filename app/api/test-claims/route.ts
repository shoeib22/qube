import { NextRequest, NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebaseAdmin';

export async function GET(request: NextRequest) {
  const uid = "5qFb2VeeWCgaEmYZ1Z6IiNVj9tC3"; // Your verified UID

  try {
    if (!auth || !db) throw new Error("Firebase Admin not initialized");

    // 1. Fetch from Firebase Auth (The Identity)
    const userAuth = await auth.getUser(uid);

    // 2. Fetch from 'qube-tech' Firestore (The Profile)
    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      return NextResponse.json({
        success: false,
        message: "Auth exists, but Firestore document is missing!",
        authRole: userAuth.customClaims?.role
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      authData: {
        uid: userAuth.uid,
        email: userAuth.email,
        customClaims: userAuth.customClaims
      },
      firestoreData: {
        ...userDoc.data(),
        id: userDoc.id
      }
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}