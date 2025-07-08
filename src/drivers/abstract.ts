// src/drivers/abstract.ts
import {DriverConfig, PaymentRequest, PaymentResponse, VerificationResponse} from '../types';

export interface PaymentDriver {
    /** Initiate a payment: returns URL or payment token */
    createPayment(req: PaymentRequest , config:DriverConfig): Promise<PaymentResponse>;

    /** After callback, verify the transaction */
    verifyPayment(data: any): Promise<VerificationResponse>;

    /** A unique name for look-ups (“zibal”, “idpay”, etc.) */
    driverName: string;
}
