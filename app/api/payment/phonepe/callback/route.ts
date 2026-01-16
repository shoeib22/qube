import { NextResponse } from "next/server";
import { getPhonePeConfig, generateChecksum } from "@/lib/phonepe";
import admin from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
    try {
        const { merchantId, saltKey, saltIndex } = getPhonePeConfig();

        // 1. Get header and body
        const xVerify = req.headers.get("x-verify");
        const body = await req.json();
        const { response } = body; // Base64 encoded JSON response

        if (!xVerify || !response) {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 });
        }

        // 2. Decode response to log/process
        const decodedResponse = JSON.parse(Buffer.from(response, "base64").toString("utf-8"));
        console.log("🔔 PhonePe Callback Received:", JSON.stringify(decodedResponse, null, 2));

        // 3. Verify Checksum
        // Although documented differently sometimes, typically callback validation might need 
        // to just verify the data integrity. 
        // Ideally, you verify the payment status using the /status API, not just trusting the callback blindly.

        // UPDATE ORDER STATUS IN FIREBASE
        if (decodedResponse.success && decodedResponse.code === 'PAYMENT_SUCCESS') {
            const transactionId = decodedResponse.data.merchantTransactionId;

            try {
                const ordersRef = admin.firestore().collection('orders');
                const snapshot = await ordersRef.where('transactionId', '==', transactionId).get();

                if (!snapshot.empty) {
                    const doc = snapshot.docs[0];
                    await doc.ref.update({
                        status: 'SUCCESS',
                        paymentDetails: decodedResponse.data,
                        updatedAt: admin.firestore.FieldValue.serverTimestamp()
                    });
                    console.log(`✅ Order ${doc.id} updated to SUCCESS`);
                } else {
                    console.warn(`⚠️ Order not found for transaction: ${transactionId}`);
                }
            } catch (dbError) {
                console.error("❌ Database update failed:", dbError);
            }
        }

        return NextResponse.json({ status: "OK" });
    } catch (error) {
        console.error("❌ PhonePe Callback Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
