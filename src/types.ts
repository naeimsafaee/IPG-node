// src/types.ts
import {PaymentDriver} from "./drivers/abstract";

export interface PaymentRequest {
    amount: number;          // rial
    callbackUrl?: string;
    orderId?: string;        // optional merchant reference
    [k: string]: any;
}

export interface PaymentResponse {
    success: boolean;
    paymentUrl?: string;
    trackId?: string
    raw?: any;               // raw API payload
}

export interface VerificationResponse {
    success: boolean;
    traceNo?: string;
    raw?: any;
}

export interface DriverConfig {
    isAmountInRial?: boolean;
    callbackUrlOverride?: String;
    sandbox?: boolean;
}

export interface PaymentGatewayOptions {
    drivers?: PaymentDriver[];
    config?: DriverConfig;
}