import { NextRequest, NextResponse } from 'next/server';
import admin from '@/lib/firebaseAdmin';
// 1. Import modular service getters
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

/**
 * POST /api/auth/register
 * PUBLIC: Creates a new user record and Firestore profile.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName } = body;

    // 2. Initialize modular services
    const auth = getAuth(admin);
    const db = getFirestore(admin, 'qube-tech'); // Specifically target your DB instance

    // 3. Create user in Firebase Authentication
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    });

    // 4. Assign default 'customer' role via Custom Claims
    await auth.setCustomUserClaims(userRecord.uid, { role: 'customer' });

    // 5. Create user document in 'qube-tech' Firestore
    await db.collection('users').doc(userRecord.uid).set({
      firstName,
      lastName,
      email,
      role: 'customer',
      // Use modular FieldValue syntax
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });

    console.log(`✅ Successfully created Xerovolt account: ${userRecord.uid}`);

    return NextResponse.json({
      success: true,
      uid: userRecord.uid
    }, { status: 201 });

  } catch (error: any) {
    console.error("Registration Error:", error.message);
    
    // Handle specific Firebase errors (e.g., email already in use)
    const status = error.code === 'auth/email-already-exists' ? 400 : 500;
    return NextResponse.json({
      error: error.message || 'Internal Server Error'
    }, { status });
  }
}