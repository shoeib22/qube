import crypto from 'crypto';

// Types
export interface PaymentInitiateRequest {
    merchantId: string;
    merchantTransactionId: string;
    merchantUserId: string;
    amount: number; // in paise
    redirectUrl: string;
    redirectMode: 'REDIRECT' | 'POST';
    callbackUrl: string;
    mobileNumber?: string;
    paymentInstrument: {
        type: string;
    };
}

export interface PaymentVerifyResponse {
    success: boolean;
    code: string;
    message: string;
    data: {
        merchantId: string;
        merchantTransactionId: string;
        transactionId: string;
        amount: number;
        state: string;
        responseCode: string;
        paymentInstrument: any;
    };
}

// Constants
const PHONEPE_HOST_URL = {
    sandbox: "https://api-preprod.phonepe.com/apis/pg-sandbox",
    production: "https://api.phonepe.com/apis/hermes"
};

/**
 * Get PhonePe configuration from environment variables
 */
export const getPhonePeConfig = () => {
    const env = process.env.PHONEPE_ENVIRONMENT || 'sandbox';
    return {
        merchantId: process.env.PHONEPE_MERCHANT_ID || '',
        saltKey: process.env.PHONEPE_SALT_KEY || '',
        saltIndex: process.env.PHONEPE_SALT_INDEX || '1',
        env: env as 'sandbox' | 'production',
        hostUrl: env === 'production' ? PHONEPE_HOST_URL.production : PHONEPE_HOST_URL.sandbox,
        callbackUrl: process.env.PHONEPE_CALLBACK_URL || 'http://localhost:3000/api/payment/phonepe/callback'
    };
};

/**
 * Generate X-VERIFY checksum for PhonePe API calls
 * Format: SHA256(base64Payload + apiEndpoint + saltKey) + ### + saltIndex
 */
export const generateChecksum = (base64Payload: string, apiEndpoint: string, saltKey: string, saltIndex: string): string => {
    const stringToHash = base64Payload + apiEndpoint + saltKey;
    const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
    return `${sha256}###${saltIndex}`;
};

/**
 * Generate X-VERIFY checksum for simple status check (no payload)
 * Format: SHA256(apiEndpoint + saltKey) + ### + saltIndex
 */
export const generateStatusChecksum = (apiEndpoint: string, saltKey: string, saltIndex: string): string => {
    const stringToHash = apiEndpoint + saltKey;
    const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
    return `${sha256}###${saltIndex}`;
};

/**
 * Encode payload to Base64
 */
export const encodePayload = (payload: any): string => {
    return Buffer.from(JSON.stringify(payload)).toString('base64');
};
