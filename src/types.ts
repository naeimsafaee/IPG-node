// src/types.ts
export interface PaymentRequest {
    amount: number;          // rial
    callbackUrl: string;
    orderId?: string;        // optional merchant reference
    [k: string]: any;
}

export interface PaymentResponse {
    success: boolean;
    paymentUrl?: string;
    raw?: any;               // raw API payload
}

export interface VerificationResponse {
    success: boolean;
    traceNo?: string;
    raw?: any;
}
