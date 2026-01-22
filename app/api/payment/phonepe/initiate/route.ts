import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getPhonePeConfig, encodePayload, generateChecksum } from "@/lib/phonepe";
import admin from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
    try {
        const { amount, customerInfo, items } = await req.json();

        console.log("🚀 Payment Init Request:", { amount, customerInfo });

        if (amount === undefined || amount === null || !customerInfo) {
            console.error("❌ Missing fields:", { amount, customerInfoPresent: !!customerInfo });
            return NextResponse.json({ error: "Missing required fields (amount or customerInfo)" }, { status: 400 });
        }

        if (amount <= 0) {
            console.error("❌ Invalid amount:", amount);
            return NextResponse.json({ error: "Payment amount must be greater than 0" }, { status: 400 });
        }
        const { merchantId, saltKey, saltIndex, hostUrl, callbackUrl } = getPhonePeConfig();

        // 1. Create Unique Transaction ID
        const merchantTransactionId = `TXN_${Date.now()}_${uuidv4().substring(0, 8)}`;
        const merchantUserId = `USER_${uuidv4().substring(0, 8)}`; // Ideally use actual user ID

        // 2. Prepare Payload
        // PhonePe expects amount in PAISES (multiply by 100)
        const amountInPaisa = Math.round(amount * 100);

        // Redirect to success page on frontend, let that page verify status
        // Note: In production, use your actual domain
        const origin = req.headers.get("origin") || "http://localhost:3000";
        const redirectUrl = `${origin}/payment/success?id=${merchantTransactionId}`;

        const payload = {
            merchantId: merchantId,
            merchantTransactionId: merchantTransactionId,
            merchantUserId: merchantUserId,
            amount: amountInPaisa,
            redirectUrl: redirectUrl,
            redirectMode: "REDIRECT",
            callbackUrl: callbackUrl,
            mobileNumber: customerInfo.phone || "9999999999",
            paymentInstrument: {
                type: "PAY_PAGE",
            },
        };

        const base64Payload = encodePayload(payload);
        const apiEndpoint = "/pg/v1/pay";
        const checksum = generateChecksum(base64Payload, apiEndpoint, saltKey, saltIndex);

        // 3. Create Order in Firestore BEFORE initiating payment
        // We create it as PENDING.
        try {
            const orderRef = admin.firestore().collection('orders').doc(); // Auto-ID
            await orderRef.set({
                orderId: merchantTransactionId, // Use txn ID as order ID for simplicity
                transactionId: merchantTransactionId,
                amount: amount,
                items: items,
                customerInfo: customerInfo,
                status: 'PENDING',
                paymentMethod: 'phonepe',
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log(`📝 Created pending order: ${orderRef.id}`);
        } catch (error) {
            console.error("❌ Failed to create order in Firestore:", error);
            return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
        }

        // 4. Call PhonePe API
        const response = await fetch(`${hostUrl}${apiEndpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-VERIFY": checksum,
                Accept: "application/json",
            },
            body: JSON.stringify({
                request: base64Payload,
            }),
        });

        const data = await response.json();

        if (data.success) {
            return NextResponse.json({
                redirectUrl: data.data.instrumentResponse.redirectInfo.url,
                transactionId: merchantTransactionId,
            });
        } else {
            console.error("❌ PhonePe Init Error:", data);
            return NextResponse.json({ error: data.message || "Payment initiation failed" }, { status: 500 });
        }

    } catch (error) {
        console.error("❌ Payment Initiation Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
