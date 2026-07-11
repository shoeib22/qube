import { NextRequest, NextResponse } from "next/server";
import { getPhonePeConfig, generateStatusChecksum } from "@/lib/phonepe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

/**
 * POST /api/payment/phonepe/verify
 * VERIFY: Checks transaction status with PhonePe and updates the order.
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

        // 3. Update Order
        try {
            const { data: order, error: fetchError } = await supabaseAdmin
                .from('orders')
                .select('id, status, amount')
                .eq('transaction_id', transactionId)
                .single();

            if (fetchError || !order) {
                return NextResponse.json({ error: "Order not found" }, { status: 404 });
            }

            // 🛡️ Safeguard: Don't overwrite SUCCESS status with a PENDING check
            if (order.status !== 'SUCCESS') {
                await supabaseAdmin
                    .from('orders')
                    .update({
                        status: finalStatus,
                        payment_details: data.data || {},
                        updated_at: new Date().toISOString(),
                    })
                    .eq('id', order.id);
            }

            return NextResponse.json({
                success: finalStatus === 'SUCCESS',
                status: finalStatus,
                orderId: order.id,
                orderDetails: { amount: Number(order.amount) || 0 }
            });
        } catch (dbError) {
            console.error("❌ Database update failed:", dbError);
            return NextResponse.json({
                success: finalStatus === 'SUCCESS',
                status: finalStatus,
                warning: "Database sync failed"
            });
        }

    } catch (error) {
        console.error("❌ Payment Verify Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
