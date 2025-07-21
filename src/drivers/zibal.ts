// src/drivers/zibal.ts
import axios from 'axios';
import { PaymentDriver } from './abstract';
import {DriverConfig, PaymentRequest, PaymentResponse, VerificationResponse} from '../types';

export class ZibalDriver implements PaymentDriver {
    public readonly driverName = 'zibal';
    private readonly apiKey: string;
    private readonly baseUrl = 'https://gateway.zibal.ir';

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async createPayment(req: PaymentRequest , config?: DriverConfig): Promise<PaymentResponse> {

        const amount = config?.isAmountInRial ? req.amount : req.amount * 10;
        const callback = req.callbackUrl ?? config?.callbackUrlOverride;

        const { data } = await axios.post(
            `${this.baseUrl}/v1/request`,
            {
                merchant: config?.sandbox ? "zibal" : this.apiKey,
                amount: amount,
                callbackUrl: callback,
                orderId: req.orderId,
            }
        );

        if (data.result === 100) {
            return {
                success: true,
                paymentUrl: `${this.baseUrl}/start/${data.trackId}`,
                trackId: data.trackId,
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
