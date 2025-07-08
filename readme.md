# @naeimsafaee/ipg-node

A lightweight, pluggable driver framework for integrating Iranian payment gateways (e.g. Zibal, IdPay, …) into your Node.js or TypeScript projects.

---

## Features

* **Modular drivers** — isolate each gateway’s API in its own class
* **Uniform API** — same `.pay(...)` and `.verify(...)` calls for every gateway
* **TypeScript support** — full type definitions included
* **Easy to extend** — drop in new drivers as they become available

---

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)

    * [TypeScript Example](#typescript-example)
    * [JavaScript (CommonJS) Example](#javascript-commonjs-example)
3. [API Reference](#api-reference)
4. [Contributing](#contributing)
5. [License](#license)

---

## Installation

### From npm registry

```bash
npm install @naeimsafaee/ipg-node
# or
yarn add @naeimsafaee/ipg-node
```

## Usage

### TypeScript Example

```ts
const { PaymentGateway , ZibalDriver } = require('ipg-node');

const gateway = new PaymentGateway({
   drivers: [new ZibalDriver("")],
   config: {
      callbackUrlOverride: paymentCallbackUrl,
      sandbox: true
   }
});

async function checkout() {
  // 1. Create payment
  const { success, paymentUrl, raw } = await gateway.pay('zibal', {
    amount:      250000,
     // If no callbackUrl was provided in the PaymentRequest, fall back to callbackUrlOverride from the gateway config
     //callbackUrl: 'https://yourapp.com/callback',  
    orderId:     'order_1234'
  })

  if (success && paymentUrl) {
    // redirect user
    console.log('Go pay at:', paymentUrl)
  } else {
    console.error('Error requesting payment:', raw)
  }
}

// 2. In your callback handler
import express from 'express'
const app = express()

app.get('/callback', async (req, res) => {
  const result = await gateway.verify('zibal', req.query)
  if (result.success) {
    console.log('Paid! TraceNo:', result.traceNo)
    res.send('Payment successful!')
  } else {
    console.warn('Verification failed:', result.raw)
    res.status(400).send('Payment verification failed.')
  }
})
```

### JavaScript (CommonJS) Example

```js
const { PaymentGateway , ZibalDriver } = require('ipg-node');

const gateway = new PaymentGateway([
  new ZibalDriver(process.env.ZIBAL_API_KEY)
])

// Create payment
gateway.pay('zibal', {
  amount:      250000,
  callbackUrl: 'https://yourapp.com/callback',
  orderId:     'order_1234'
})
.then(({ success, paymentUrl, raw }) => {
  if (success) {
    console.log('Redirect to:', paymentUrl)
  } else {
    console.error('Payment error:', raw)
  }
})

// Verify callback (e.g. in Express)
app.get('/callback', (req, res) => {
  gateway.verify('zibal', req.query)
    .then(result => {
      if (result.success) {
        res.send('OK')
      } else {
        res.sendStatus(400)
      }
    })
})
```

---

## API Reference

### `new PaymentGateway(drivers?: PaymentDriver[])`

* **drivers** — optional array of pre-registered `PaymentDriver` instances

### `gateway.register(driver: PaymentDriver): void`

Register a new driver at runtime. Must have a unique `driver.driverName`.

### `gateway.pay(driverName: string, req: PaymentRequest): Promise<PaymentResponse>`

* **driverName** — `'zibal'`, `'idpay'`, etc.
* **req** — `{ amount: number; callbackUrl: string; orderId?: string; [k: string]: any }`
* **returns** — `{ success: boolean; paymentUrl?: string; raw: any }`

### `gateway.verify(driverName: string, data: any): Promise<VerificationResponse>`

* **data** — callback payload from the gateway
* **returns** — `{ success: boolean; traceNo?: string; raw: any }`

---

## Contributing

Contributions, issues, and feature requests are welcome!
Please open an issue or pull request on [GitHub](https://github.com/naeimsafaee/IPG-node).

---

## License

MIT © \[Naeim Safaee] - [https://github.com/naeimsafaee](https://github.com/naeimsafaee)
