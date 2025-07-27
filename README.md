# X-Pay SDK Vue 3 Example

This project demonstrates how to integrate the X-Pay cryptocurrency payment gateway SDK into a Vue 3 application.

## Features

- Initialize the X-Pay SDK with your API credentials
- Create cryptocurrency collection orders
- Display payment QR codes for customers
- Check payment status
- Get supported cryptocurrencies and chains
- Verify webhook signatures

## Prerequisites

- Node.js 14.x or higher
- npm or yarn

## Installation

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

## Configuration

To use this example with your X-Pay account, you'll need to:

1. Sign up for an X-Pay account at [x-pay.fun](https://x-pay.fun)
2. Obtain your API key and secret from the dashboard
3. Configure your credentials using one of these methods:
   - Create a `.env` file with the following variables:
     ```
     VITE_XPAY_API_KEY=your-api-key
     VITE_XPAY_API_SECRET=your-api-secret
     VITE_XPAY_BASE_URL=https://api.x-pay.fun
     ```
   - Or enter your credentials directly in the Configuration section of the demo

## Running the Example

Start the development server:

```bash
npm run dev
```

Then open your browser to http://localhost:3000

## Project Structure

- `src/views/Home.vue` - Landing page with SDK information
- `src/views/PaymentDemo.vue` - Main demo page with SDK integration examples
- `src/components/PaymentQRCode.vue` - Component for displaying payment QR codes
- `src/components/WebhookHandler.vue` - Component for webhook verification demo

## SDK Integration Steps

### 1. Install the SDK

```bash
npm install x-pay-sdk-official
```

### 2. Import and Initialize

```javascript
import { XPay } from 'x-pay-sdk-official';

const xpay = new XPay({
  apiKey: 'your-api-key',
  apiSecret: 'your-api-secret',
  baseUrl: 'https://api.x-pay.fun'
});
```

### 3. Create a Collection Order

```javascript
const response = await xpay.createCollection({
  amount: 100,
  symbol: 'USDT',
  chain: 'TRON',
  orderId: 'order-123456',
  callbackUrl: 'https://your-callback-url.com/webhook'
});

// The response contains the payment address and other details
console.log(response.paymentAddress);
```

### 4. Check Order Status

```javascript
const status = await xpay.getOrderStatus('order-123456');
console.log(status);
```

### 5. Verify Webhooks

```javascript
// In your webhook handler
const isValid = xpay.verifyWebhook(
  JSON.stringify(webhookBody),
  signature,
  timestamp
);

if (isValid) {
  // Process the webhook
  const event = xpay.parseWebhook(JSON.stringify(webhookBody));
  console.log(event.notifyType, event.data);
}
```

## Environment Variables

This example uses environment variables to securely store API credentials. In a Vite project, environment variables that should be exposed to the client must be prefixed with `VITE_`.

Create a `.env` file in the root directory with the following variables:

```
VITE_XPAY_API_KEY=your-api-key
VITE_XPAY_API_SECRET=your-api-secret
VITE_XPAY_BASE_URL=https://api.x-pay.fun
```

These variables are accessed in the code using `import.meta.env.VITE_VARIABLE_NAME`.

## Production Considerations

When deploying to production:

1. Never expose your API secret in client-side code
   - For production applications, handle sensitive operations like signature generation on the server side
   - Use environment variables for configuration, but be aware that client-side environment variables are still visible in the browser
2. Implement proper error handling and retry mechanisms
3. Set up webhook verification to securely receive payment notifications
4. Consider implementing a server-side component for sensitive operations

## License

This example project is MIT licensed.