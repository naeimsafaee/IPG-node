// src/index.ts
import { PaymentDriver } from './drivers/abstract';
import {ZibalDriver} from './drivers/zibal';
import {DriverConfig, PaymentGatewayOptions} from "./types";

class PaymentGateway {
    private drivers = new Map<string, PaymentDriver>();
    private readonly config?: DriverConfig;

    /** Register one or more drivers up-front */
    constructor(options: PaymentGatewayOptions = {}) {
        const { drivers = [], config } = options;
        this.config = config;
        drivers.forEach(d => this.register(d));
    }

    /** Add a driver at any time */
    register(driver: PaymentDriver) {
        if (this.drivers.has(driver.driverName)) {
            throw new Error(`Driver “${driver.driverName}” already registered.`);
        }
        this.drivers.set(driver.driverName, driver);
    }

    /** Get a driver by name */
    driver(name: string): PaymentDriver {
        const d = this.drivers.get(name);
        if (!d) throw new Error(`No driver registered under “${name}”.`);
        return d;
    }

    /** Shorthand: create a payment via a named driver */
    async pay(
        driverName: string,
        req: Parameters<PaymentDriver['createPayment']>[0]
    ) {
        return this.driver(driverName).createPayment(req , this.config);
    }

    /** Shorthand: verify via a named driver */
    async verify(
        driverName: string,
        data: Parameters<PaymentDriver['verifyPayment']>[0]
    ) {
        return this.driver(driverName).verifyPayment(data, this.config);
    }
}

export { PaymentGateway , ZibalDriver }
