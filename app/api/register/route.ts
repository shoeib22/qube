import { NextResponse } from 'next/server';
import { auth } from '../../../lib/firebaseAdmin';

export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName } = await request.json();

    // Create user in Firebase Authentication
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    });

    // Assign a default 'customer' role
    await auth.setCustomUserClaims(userRecord.uid, { role: 'customer' });

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