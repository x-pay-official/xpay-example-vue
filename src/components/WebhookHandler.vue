<template>
  <div class="webhook-handler">
    <h3>Webhook Handling Example</h3>
    
    <div class="form-section">
      <div class="form-group">
        <label for="webhookBody">Webhook Body (JSON):</label>
        <textarea 
          id="webhookBody" 
          v-model="webhookBody" 
          placeholder="Paste webhook JSON here"
          rows="8"
        ></textarea>
      </div>
      
      <div class="form-group">
        <label for="signature">X-Signature:</label>
        <input type="text" id="signature" v-model="signature" placeholder="Webhook signature" />
      </div>
      
      <div class="form-group">
        <label for="timestamp">X-Timestamp:</label>
        <input type="text" id="timestamp" v-model="timestamp" placeholder="Webhook timestamp" />
      </div>
      
      <button @click="verifyWebhook" class="btn" :disabled="!sdkInitialized">Verify Webhook</button>
    </div>
    
    <div v-if="webhookResult !== null" class="result" :class="{ 'valid': webhookResult, 'invalid': !webhookResult }">
      <p>Webhook signature is {{ webhookResult ? 'VALID' : 'INVALID' }}</p>
    </div>
    
    <div v-if="webhookData" class="webhook-data">
      <h4>Parsed Webhook Data</h4>
      <pre><code>{{ JSON.stringify(webhookData, null, 2) }}</code></pre>
    </div>
    
    <div class="info-section">
      <h4>How to Handle Webhooks</h4>
      <ol>
        <li>Set up an endpoint on your server to receive webhook notifications</li>
        <li>When a webhook is received, extract the signature and timestamp from headers</li>
        <li>Verify the webhook signature using the XPay SDK</li>
        <li>Process the webhook data based on the notification type</li>
      </ol>
      
      <div class="code-example">
        <h5>Example Server Code (Node.js/Express)</h5>
        <pre><code>const express = require('express');
const { XPay } = require('x-pay-sdk-official');
const app = express();

app.use(express.json());

const xpay = new XPay({
  apiKey: process.env.XPAY_API_KEY,
  apiSecret: process.env.XPAY_API_SECRET,
  baseUrl: process.env.XPAY_BASE_URL || 'https://api.x-pay.fun'
});

app.post('/webhook', (req, res) => {
  const signature = req.headers['x-signature'];
  const timestamp = req.headers['x-timestamp'];
  const body = JSON.stringify(req.body);
  
  // Verify webhook signature
  const isValid = xpay.verifyWebhook(body, signature, timestamp);
  
  if (isValid) {
    // Process webhook based on notification type
    const event = xpay.parseWebhook(body, signature, timestamp);
    
    switch(event.notifyType) {
      case 'PAYMENT_SUCCESS':
        // Handle successful payment
        break;
      case 'PAYMENT_FAILED':
        // Handle failed payment
        break;
      // Handle other notification types
    }
    
    res.status(200).send('Webhook received');
  } else {
    res.status(400).send('Invalid webhook signature');
  }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});</code></pre>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WebhookHandler',
  props: {
    xpay: {
      type: Object,
      required: true
    },
    sdkInitialized: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      webhookBody: JSON.stringify({
        sign: 'example-signature',
        timestamp: Math.floor(Date.now() / 1000),
        nonce: 'random-nonce',
        notifyType: 'PAYMENT_SUCCESS',
        data: {
          orderId: 'order-123456',
          amount: 100,
          symbol: 'USDT',
          status: 'SUCCESS'
        }
      }, null, 2),
      signature: '',
      timestamp: '',
      webhookResult: null,
      webhookData: null
    };
  },
  methods: {
    verifyWebhook() {
      if (!this.sdkInitialized || !this.xpay) {
        alert('SDK not initialized');
        return;
      }
      
      try {
        const body = this.webhookBody.trim();
        const signature = this.signature.trim() || JSON.parse(body).sign;
        const timestamp = this.timestamp.trim() || JSON.parse(body).timestamp;
        
        // Verify webhook signature
        this.webhookResult = this.xpay.verifyWebhook(body, signature, timestamp);
        
        // Parse webhook data if signature is valid
        if (this.webhookResult) {
          this.webhookData = this.xpay.parseWebhook(body, signature, timestamp);
        } else {
          this.webhookData = null;
        }
      } catch (err) {
        console.error('Error verifying webhook:', err);
        this.webhookResult = false;
        this.webhookData = null;
      }
    }
  }
};
</script>

<style scoped>
.webhook-handler {
  margin-top: 30px;
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 8px;
}

h3, h4, h5 {
  color: #2c3e50;
  margin-top: 0;
}

.form-section {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

textarea, input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: monospace;
}

.btn {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.btn:hover:not(:disabled) {
  background-color: #3aa876;
}

.btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.result {
  padding: 10px;
  border-radius: 4px;
  margin: 15px 0;
  font-weight: bold;
  text-align: center;
}

.valid {
  background-color: #d4edda;
  color: #155724;
}

.invalid {
  background-color: #f8d7da;
  color: #721c24;
}

.webhook-data {
  margin-top: 20px;
}

pre {
  background-color: #2c3e50;
  color: #fff;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  margin: 10px 0;
}

code {
  font-family: 'Courier New', Courier, monospace;
}

.info-section {
  margin-top: 30px;
  border-top: 1px solid #ddd;
  padding-top: 20px;
}

ol {
  padding-left: 20px;
}

li {
  margin-bottom: 8px;
}

.code-example {
  margin-top: 20px;
}
</style>