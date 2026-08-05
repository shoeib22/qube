import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getPhonePeConfig, encodePayload, generateChecksum } from "@/lib/phonepe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { amount, customerInfo, items, userId } = body;

        console.log("Payment Init Request:", { amount, customerInfo });

        if (amount === undefined || amount === null || !customerInfo) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const { merchantId, saltKey, saltIndex, hostUrl, callbackUrl } = getPhonePeConfig();

        // 1. Create Unique Transaction ID
        const merchantTransactionId = `TXN_${Date.now()}_${uuidv4().substring(0, 8)}`;
        const merchantUserId = userId || `USER_${uuidv4().substring(0, 8)}`;

        // 2. Prepare Payload (PhonePe expects PAISES)
        const amountInPaisa = Math.round(amount * 100);
        const origin = req.headers.get("origin") || "https://xerovolt.in";
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

        // 3. Create Order in Postgres BEFORE initiating payment
        try {
            await prisma.xerovoltOrder.create({
                data: {
                    orderId: merchantTransactionId,
                    transactionId: merchantTransactionId,
                    userId: merchantUserId,
                    amount,
                    items,
                    customerInfo,
                    status: 'PENDING',
                    paymentMethod: 'phonepe',
                },
            });
            console.log(`Created pending order: ${merchantTransactionId}`);
        } catch (error) {
            console.error("Order creation failed:", error);
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
            body: JSON.stringify({ request: base64Payload }),
        });

        const data = await response.json();

        if (data.success) {
            return NextResponse.json({
                redirectUrl: data.data.instrumentResponse.redirectInfo.url,
                transactionId: merchantTransactionId,
            });
        } else {
            console.error("PhonePe Init Error:", data);
            return NextResponse.json({ error: data.message || "Payment initiation failed" }, { status: 500 });
        }

    } catch (error: any) {
        console.error("Payment Initiation Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
