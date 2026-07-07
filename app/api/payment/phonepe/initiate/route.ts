import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getPhonePeConfig, encodePayload, generateChecksum } from "@/lib/phonepe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { amount, customerInfo, items, userId } = body;

        console.log("🚀 Payment Init Request:", { amount, customerInfo });

        if (amount === undefined || amount === null || !customerInfo) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const { merchantId, saltKey, saltIndex, hostUrl, callbackUrl } = getPhonePeConfig();

        // 1. Create Unique Transaction ID
        const merchantTransactionId = `TXN_${Date.now()}_${uuidv4().substring(0, 8)}`;
        const merchantUserId = userId || `USER_${uuidv4().substring(0, 8)}`;
        // orders.user_id is a FK to auth.users — only store it when it's really
        // a logged-in user's uuid; guest checkouts keep the generated id in
        // customer_info instead of forcing it through the FK.
        const authUserId = typeof userId === 'string' && UUID_RE.test(userId) ? userId : null;

        // 2. Prepare Payload (PhonePe expects PAISE)
        const amountInPaisa = Math.round(amount * 100);
        const origin = req.headers.get("origin") || "https://xerovolt.tech";
        const redirectUrl = `${origin}/payment/success?id=${merchantTransactionId}`;

        const payload = {
            merchantId,
            merchantTransactionId,
            merchantUserId,
            amount: amountInPaisa,
            redirectUrl,
            redirectMode: "REDIRECT",
            callbackUrl,
            mobileNumber: customerInfo.phone || "9999999999",
            paymentInstrument: { type: "PAY_PAGE" },
        };

        const base64Payload = encodePayload(payload);
        const apiEndpoint = "/pg/v1/pay";
        const checksum = generateChecksum(base64Payload, apiEndpoint, saltKey, saltIndex);

        // 3. Create Order BEFORE initiating payment
        const { error: insertError } = await supabaseAdmin.from('orders').insert({
            transaction_id: merchantTransactionId,
            user_id: authUserId,
            amount,
            items,
            customer_info: { ...customerInfo, merchantUserId },
            status: 'PENDING',
            payment_method: 'phonepe',
        });

        if (insertError) {
            console.error("❌ Order creation failed:", insertError);
            return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
        }
        console.log(`📝 Created pending order: ${merchantTransactionId}`);

        // 4. Call PhonePe API
        const response = await fetch(`${hostUrl}${apiEndpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-VERIFY": checksum,
                Accept: "application/json",
            },
            body: JSON.stringify({ request: base64Payload }),
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
