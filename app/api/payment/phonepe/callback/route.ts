import { NextRequest, NextResponse } from "next/server";
import { getPhonePeConfig } from "@/lib/phonepe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    try {
        const { saltKey, saltIndex } = getPhonePeConfig();

        // 2. Get PhonePe verification header and body
        const xVerify = req.headers.get("x-verify");
        const body = await req.json();
        const { response } = body; // Base64 encoded JSON string from PhonePe

        if (!xVerify || !response) {
            return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
        }

        // 3. Security Check: Verify the Checksum
        // Verification: SHA256(Base64Response + saltKey) + "###" + saltIndex
        const stringToHash = response + saltKey;
        const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
        const expectedVerify = `${sha256}###${saltIndex}`;

        if (xVerify !== expectedVerify) {
            console.error("❌ Invalid Checksum detected! Potential spoofing attempt.");
            return NextResponse.json({ error: "Checksum mismatch" }, { status: 401 });
        }

        // 4. Decode the data
        const decodedResponse = JSON.parse(Buffer.from(response, "base64").toString("utf-8"));
        console.log("🔔 Verified PhonePe Callback:", JSON.stringify(decodedResponse, null, 2));

        // 5. Update Order Status
        if (decodedResponse.success && decodedResponse.code === 'PAYMENT_SUCCESS') {
            const merchantTransactionId = decodedResponse.data.merchantTransactionId;

            try {
                const { data: order, error: fetchError } = await supabaseAdmin
                    .from('orders')
                    .select('id')
                    .eq('transaction_id', merchantTransactionId)
                    .single();

                if (!fetchError && order) {
                    await supabaseAdmin
                        .from('orders')
                        .update({
                            status: 'SUCCESS',
                            payment_details: {
                                provider: 'PhonePe',
                                transactionId: decodedResponse.data.transactionId,
                                amount: decodedResponse.data.amount / 100, // PhonePe works in paise
                                state: decodedResponse.data.state
                            },
                            updated_at: new Date().toISOString(),
                        })
                        .eq('id', order.id);
                    console.log(`✅ Order ${order.id} processed successfully`);
                } else {
                    console.warn(`⚠️ Order not found for ID: ${merchantTransactionId}`);
                }
            } catch (dbError) {
                console.error("❌ Order update failed:", dbError);
            }
        }

        // PhonePe expects a 200 OK to stop retrying the callback
        return NextResponse.json({ status: "SUCCESS" });

    } catch (error) {
        console.error("❌ PhonePe Callback Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
