import { NextResponse } from "next/server";
import { getPhonePeConfig, generateStatusChecksum } from "@/lib/phonepe";
import admin from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
    try {
        const { transactionId } = await req.json();

        if (!transactionId) {
            return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 });
        }

        const { merchantId, saltKey, saltIndex, hostUrl } = getPhonePeConfig();

        // 1. Prepare Checksum for Status API
        // GET /pg/v1/status/{merchantId}/{merchantTransactionId}
        const apiEndpoint = `/pg/v1/status/${merchantId}/${transactionId}`;
        const checksum = generateStatusChecksum(apiEndpoint, saltKey, saltIndex);

        // 2. Call PhonePe Status API
        const response = await fetch(`${hostUrl}${apiEndpoint}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-VERIFY": checksum,
                "X-MERCHANT-ID": merchantId,
            },
        });

        const data = await response.json();
        console.log("🔍 Payment Verify Response:", JSON.stringify(data, null, 2));

        let status = 'PENDING';
        if (data.success && data.code === "PAYMENT_SUCCESS") {
            status = 'SUCCESS';
        } else if (data.code === "PAYMENT_ERROR" || data.code === "PAYMENT_DECLINED") {
            status = 'FAILED';
        }

        // 3. Update Order in Firestore
        try {
            const ordersRef = admin.firestore().collection('orders');
            const snapshot = await ordersRef.where('transactionId', '==', transactionId).get();

            if (!snapshot.empty) {
                const doc = snapshot.docs[0];
                // Only update if not already success to avoid overwrites
                const currentData = doc.data();
                if (currentData.status !== 'SUCCESS') {
                    await doc.ref.update({
                        status: status,
                        paymentDetails: data.data || {},
                        updatedAt: admin.firestore.FieldValue.serverTimestamp()
                    });
                }

                return NextResponse.json({
                    success: status === 'SUCCESS',
                    status,
                    orderDetails: { id: doc.id, ...doc.data(), status } // Return updated status
                });
            } else {
                return NextResponse.json({ error: "Order not found" }, { status: 404 });
            }
        } catch (dbError) {
            console.error("❌ Database update failed:", dbError);
            // Return the phonepe status even if db update fails so UI can show success/fail
            return NextResponse.json({
                success: status === 'SUCCESS',
                status,
                warning: "Database update failed"
            });
        }

    } catch (error) {
        console.error("error verifying payment:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
