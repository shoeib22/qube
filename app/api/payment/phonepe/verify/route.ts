import { NextRequest, NextResponse } from "next/server";
import { getPhonePeConfig, generateStatusChecksum } from "@/lib/phonepe";
import admin from "@/lib/firebaseAdmin";
// 1. Import modular Firestore services
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

/**
 * POST /api/payments/status
 * VERIFY: Checks transaction status with PhonePe and updates 'qube-tech' DB.
 */
export async function POST(req: NextRequest) {
    try {
        const { transactionId } = await req.json();

        if (!transactionId) {
            return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 });
        }

        const { merchantId, saltKey, saltIndex, hostUrl } = getPhonePeConfig();

        // 1. Prepare Checksum for Status API
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
        console.log("🔍 PhonePe Status Response:", JSON.stringify(data, null, 2));

        let finalStatus = 'PENDING';
        if (data.success && data.code === "PAYMENT_SUCCESS") {
            finalStatus = 'SUCCESS';
        } else if (data.code === "PAYMENT_ERROR" || data.code === "PAYMENT_DECLINED") {
            finalStatus = 'FAILED';
        }

        // 3. Update Order in 'qube-tech' DB
        try {
            // Use modular syntax and target qube-tech
            const db = getFirestore(admin, 'qube-tech');
            const ordersRef = db.collection('orders');
            const snapshot = await ordersRef.where('transactionId', '==', transactionId).get();

            if (!snapshot.empty) {
                const orderDoc = snapshot.docs[0];
                const currentData = orderDoc.data();

                // 🛡️ Safeguard: Don't overwrite SUCCESS status with a PENDING check
                if (currentData.status !== 'SUCCESS') {
                    await orderDoc.ref.update({
                        status: finalStatus,
                        paymentDetails: data.data || {},
                        // Use modular FieldValue syntax
                        updatedAt: FieldValue.serverTimestamp()
                    });
                }

                return NextResponse.json({
                    success: finalStatus === 'SUCCESS',
                    status: finalStatus,
                    orderId: orderDoc.id
                });
            } else {
                return NextResponse.json({ error: "Order not found" }, { status: 404 });
            }
        } catch (dbError) {
            console.error("❌ Database update failed:", dbError);
            return NextResponse.json({
                success: finalStatus === 'SUCCESS',
                status: finalStatus,
                warning: "Database sync failed"
            });
        }

    } catch (error: any) {
        console.error("❌ Payment Verify Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}