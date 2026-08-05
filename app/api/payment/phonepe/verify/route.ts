import { NextRequest, NextResponse } from "next/server";
import { getPhonePeConfig, generateStatusChecksum } from "@/lib/phonepe";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/payments/status
 * VERIFY: Checks transaction status with PhonePe and updates the order in Postgres.
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
        console.log("PhonePe Status Response:", JSON.stringify(data, null, 2));

        let finalStatus = 'PENDING';
        if (data.success && data.code === "PAYMENT_SUCCESS") {
            finalStatus = 'SUCCESS';
        } else if (data.code === "PAYMENT_ERROR" || data.code === "PAYMENT_DECLINED") {
            finalStatus = 'FAILED';
        }

        // 3. Update Order in Postgres
        try {
            const order = await prisma.xerovoltOrder.findUnique({ where: { transactionId } });

            if (!order) {
                return NextResponse.json({ error: "Order not found" }, { status: 404 });
            }

            // Safeguard: Don't overwrite SUCCESS status with a PENDING check
            if (order.status !== 'SUCCESS') {
                await prisma.xerovoltOrder.update({
                    where: { transactionId },
                    data: {
                        status: finalStatus,
                        paymentDetails: data.data || {},
                    },
                });
            }

            return NextResponse.json({
                success: finalStatus === 'SUCCESS',
                status: finalStatus,
                orderId: order.id
            });
        } catch (dbError) {
            console.error("Database update failed:", dbError);
            return NextResponse.json({
                success: finalStatus === 'SUCCESS',
                status: finalStatus,
                warning: "Database sync failed"
            });
        }

    } catch (error: any) {
        console.error("Payment Verify Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
