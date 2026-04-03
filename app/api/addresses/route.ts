// app/api/addresses/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    success: true, 
    addresses: [
      {
        id: '1',
        label: 'Home',
        addressLine1: '123 Xerovolt St',
        city: 'Hyderabad',
        state: 'Telangana',
        postalCode: '500075',
        country: 'India',
        phone: '+91 9876543210',
        isDefault: true
      }
    ] 
  });
}