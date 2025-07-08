// src/drivers/zibal.ts
import axios from 'axios';
import { PaymentDriver } from './abstract';
import { PaymentRequest, PaymentResponse, VerificationResponse } from '../types';

export class ZibalDriver implements PaymentDriver {
    public readonly driverName = 'zibal';
    private readonly apiKey: string;
    private readonly baseUrl = 'https://gateway.zibal.ir';

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async createPayment(req: PaymentRequest): Promise<PaymentResponse> {
        const { data } = await axios.post(
            `${this.baseUrl}/v1/request`,
            {
                merchant: this.apiKey,
                amount: req.amount,
                callbackUrl: req.callbackUrl,
                orderId: req.orderId,
            }
        );

        if (data.result === 100) {
            return {
                success: true,
                paymentUrl: `${this.baseUrl}/start/${data.trackId}`,
                raw: data,
            };
        }
        return { success: false, raw: data };
    }

    async verifyPayment(data: any): Promise<VerificationResponse> {
        const { trackId } = data; // e.g. from query string
        const { data: res } = await axios.post(
            `${this.baseUrl}/v1/verify`,
            { merchant: this.apiKey, trackId }
        );
        return {
            success: res.result === 100,
            traceNo: res.refNumber,
            raw: res,
        };
    }
}
