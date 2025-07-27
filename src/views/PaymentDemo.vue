<template>
  <div class="payment-demo">
    <h2>X-Pay Payment Integration Demo</h2>
    
    <div v-if="sdkInitialized" class="sdk-status success">
      SDK initialized successfully with API credentials from environment variables
    </div>
    <div v-else class="sdk-status error">
      Failed to initialize SDK. Please check your environment variables.
    </div>
    
    <payment-q-r-code 
      v-if="paymentData" 
      :payment-data="paymentData"
      @expired="handlePaymentExpired"
    />
    
    <div class="tabs">
      <button 
        @click="activeTab = 'payment'" 
        :class="{ active: activeTab === 'payment' }"
        class="tab-btn"
      >
        Payment Demo
      </button>
      <button 
        @click="activeTab = 'webhook'" 
        :class="{ active: activeTab === 'webhook' }"
        class="tab-btn"
      >
        Webhook Demo
      </button>
    </div>
    
    <div v-if="activeTab === 'payment'">
      <div class="tabs inner-tabs">
        <button 
          @click="orderTab = 'collection'" 
          :class="{ active: orderTab === 'collection' }"
          class="tab-btn"
        >
          Collection Order
        </button>
        <button 
          @click="orderTab = 'payout'" 
          :class="{ active: orderTab === 'payout' }"
          class="tab-btn"
        >
          Payout Order
        </button>
      </div>

      <div v-if="orderTab === 'collection'" class="demo-section" :class="{ disabled: !sdkInitialized }">
        <h3>Create Collection Order</h3>
        <div class="form-group">
          <label for="amount">Amount:</label>
          <input type="number" id="amount" v-model="collectionOrder.amount" placeholder="Amount" />
        </div>
        <div class="form-group">
          <label for="symbol">Symbol:</label>
          <select id="symbol" v-model="collectionOrder.symbol">
            <option value="USDT">USDT</option>
            <option value="ETH">ETH</option>
            <option value="TRX">TRX</option>
          </select>
        </div>
        <div class="form-group">
          <label for="chain">Chain:</label>
          <select id="chain" v-model="collectionOrder.chain">
            <option value="TRON">TRON</option>
            <option value="ETH">Ethereum</option>
            <option value="BSC">Binance Smart Chain</option>
          </select>
        </div>
        <div class="form-group">
          <label for="uid">User ID:</label>
          <input type="text" id="uid" v-model="collectionOrder.uid" placeholder="User ID (required)" />
        </div>
        <div class="form-group">
          <label for="orderId">Order ID:</label>
          <input type="text" id="orderId" v-model="collectionOrder.orderId" placeholder="Order ID (optional)" />
          <button @click="generateOrderId" class="btn-small">Generate</button>
        </div>
        <button @click="createCollectionOrder" class="btn" :disabled="!sdkInitialized">Create Collection Order</button>
      </div>

      <div v-if="orderTab === 'payout'" class="demo-section" :class="{ disabled: !sdkInitialized }">
        <h3>Create Payout Order (Merchant to User)</h3>
        <div class="info-box">
          <p>Payout orders transfer funds from merchant to user's wallet address.</p>
        </div>
        <div class="form-group">
          <label for="payoutAmount">Amount:</label>
          <input type="number" id="payoutAmount" v-model="payoutOrder.amount" placeholder="Amount" />
        </div>
        <div class="form-group">
          <label for="payoutSymbol">Symbol:</label>
          <select id="payoutSymbol" v-model="payoutOrder.symbol">
            <option value="USDT">USDT</option>
            <option value="ETH">ETH</option>
            <option value="TRX">TRX</option>
          </select>
        </div>
        <div class="form-group">
          <label for="payoutChain">Chain:</label>
          <select id="payoutChain" v-model="payoutOrder.chain">
            <option value="TRON">TRON</option>
            <option value="ETH">Ethereum</option>
            <option value="BSC">Binance Smart Chain</option>
          </select>
        </div>
        <div class="form-group">
          <label for="payoutUid">User ID:</label>
          <input type="text" id="payoutUid" v-model="payoutOrder.uid" placeholder="User ID (required)" />
        </div>
        <div class="form-group">
          <label for="receiveAddress">Receive Address:</label>
          <input type="text" id="receiveAddress" v-model="payoutOrder.receiveAddress" placeholder="Blockchain Address" />
        </div>
        <div class="form-group">
          <label for="payoutOrderId">Order ID:</label>
          <input type="text" id="payoutOrderId" v-model="payoutOrder.orderId" placeholder="Order ID (optional)" />
          <button @click="generatePayoutOrderId" class="btn-small">Generate</button>
        </div>
        <button @click="createPayoutOrder" class="btn" :disabled="!sdkInitialized">Create Payout Order</button>
      </div>
      
      <div class="demo-section" :class="{ disabled: !sdkInitialized }">
        <h3>Check Order Status</h3>
        <div class="form-group">
          <label for="checkOrderId">Order ID:</label>
          <input type="text" id="checkOrderId" v-model="checkOrderId" placeholder="Order ID to check" />
        </div>
        <button @click="checkOrderStatus" class="btn" :disabled="!sdkInitialized">Check Status</button>
      </div>
      
      <div class="demo-section" :class="{ disabled: !sdkInitialized }">
        <h3>Get Supported Symbols</h3>
        <div class="form-group">
          <label for="symbolFilter">Symbol Filter (optional):</label>
          <input type="text" id="symbolFilter" v-model="symbolFilter" placeholder="Filter by symbol" />
        </div>
        <div class="form-group">
          <label for="chainFilter">Chain Filter (optional):</label>
          <input type="text" id="chainFilter" v-model="chainFilter" placeholder="Filter by chain" />
        </div>
        <button @click="getSupportedSymbols" class="btn" :disabled="!sdkInitialized">Get Symbols</button>
      </div>
    </div>
    
    <div v-if="activeTab === 'webhook'">
      <webhook-handler 
        :xpay="xpay" 
        :sdk-initialized="sdkInitialized"
      />
    </div>
    
    <div v-if="result" class="result-section">
      <h3>Result</h3>
      <pre><code>{{ JSON.stringify(result, null, 2) }}</code></pre>
    </div>
    
    <div v-if="error" class="error-section">
      <h3>Error</h3>
      <pre><code>{{ error }}</code></pre>
    </div>
  </div>
</template>

<script>
import XPayService from '../services/XPayService';
import PaymentQRCode from '../components/PaymentQRCode.vue';
import WebhookHandler from '../components/WebhookHandler.vue';

export default {
  name: 'PaymentDemo',
  components: {
    PaymentQRCode,
    WebhookHandler
  },
  data() {
    return {
      xpay: null,
      sdkInitialized: false,
      activeTab: 'payment',
      orderTab: 'collection',
      collectionOrder: {
        amount: 100,
        symbol: 'USDT',
        chain: 'TRON',
        uid: 'user123',
        orderId: ''
      },
      payoutOrder: {
        amount: 100,
        symbol: 'USDT',
        chain: 'TRON',
        uid: 'user123',
        receiveAddress: '',
        orderId: ''
      },
      checkOrderId: '',
      symbolFilter: '',
      chainFilter: '',
      result: null,
      error: null,
      paymentData: null,
      statusCheckInterval: null
    };
  },
  mounted() {
    // Initialize SDK with environment variables
    this.initializeSDK();
  },
  methods: {
    initializeSDK() {
      try {
        const apiKey = import.meta.env.VITE_XPAY_API_KEY;
        const apiSecret = import.meta.env.VITE_XPAY_API_SECRET;
        const baseUrl = import.meta.env.VITE_XPAY_BASE_URL || 'https://api.x-pay.fun';
        
        if (!apiKey || !apiSecret) {
          throw new Error('API key or secret not found in environment variables');
        }
        
        this.xpay = new XPayService({
          apiKey,
          apiSecret,
          baseUrl
        });
        
        this.sdkInitialized = true;
        this.error = null;
      } catch (err) {
        this.error = `Failed to initialize SDK: ${err.message}`;
        this.sdkInitialized = false;
      }
    },
    
    generateOrderId() {
      this.collectionOrder.orderId = `order-${Date.now()}`;
    },
    
    generatePayoutOrderId() {
      this.payoutOrder.orderId = `payout-${Date.now()}`;
    },
    
    async createCollectionOrder() {
      if (!this.sdkInitialized) {
        this.error = 'SDK not initialized. Please check your environment variables.';
        return;
      }
      
      if (!this.collectionOrder.uid) {
        this.error = 'User ID is required for collection orders.';
        return;
      }
      
      try {
        this.error = null;
        this.result = null;
        this.paymentData = null;
        this.stopStatusCheck();
        
        const response = await this.xpay.createCollection({
          amount: this.collectionOrder.amount,
          symbol: this.collectionOrder.symbol,
          chain: this.collectionOrder.chain,
          uid: this.collectionOrder.uid,
          orderId: this.collectionOrder.orderId || ''
        });
        
        this.result = response;
        this.checkOrderId = this.collectionOrder.orderId || (response.data && response.data.orderId);
        
        // Create payment data for QR code
        if (response && response.code === 200 && response.data && response.data.address) {
          this.paymentData = {
            amount: response.data.amount || this.collectionOrder.amount,
            symbol: response.data.symbol || this.collectionOrder.symbol,
            chain: response.data.chain || this.collectionOrder.chain,
            address: response.data.address,
            status: 'PENDING', // Use uppercase status to match the API format
            expiryTime: response.data.expiredTime ? new Date(response.data.expiredTime * 1000) : null,
            orderId: response.data.orderId,
            orderType: response.data.orderType || 'COLLECTION',
            isPayout: false
          };
          
          console.log('Payment data created:', this.paymentData);
          
          // Start checking status periodically
          this.startStatusCheck();
        }
      } catch (err) {
        this.error = `Failed to create collection order: ${err.message}`;
      }
    },
    
    async createPayoutOrder() {
      if (!this.sdkInitialized) {
        this.error = 'SDK not initialized. Please check your environment variables.';
        return;
      }
      
      if (!this.payoutOrder.uid) {
        this.error = 'User ID is required for payout orders.';
        return;
      }
      
      if (!this.payoutOrder.receiveAddress) {
        this.error = 'Receive address is required for payout orders.';
        return;
      }
      
      try {
        this.error = null;
        this.result = null;
        this.paymentData = null;
        this.stopStatusCheck();
        
        const response = await this.xpay.createPayout({
          amount: this.payoutOrder.amount,
          symbol: this.payoutOrder.symbol,
          chain: this.payoutOrder.chain,
          uid: this.payoutOrder.uid,
          receiveAddress: this.payoutOrder.receiveAddress,
          orderId: this.payoutOrder.orderId || ''
        });
        
        this.result = response;
        this.checkOrderId = this.payoutOrder.orderId || (response.data && response.data.orderId);
        
        // Create payment data for QR code (for payout visualization)
        if (response && response.code === 200 && response.data) {
          this.paymentData = {
            amount: response.data.amount || this.payoutOrder.amount,
            symbol: response.data.symbol || this.payoutOrder.symbol,
            chain: response.data.chain || this.payoutOrder.chain,
            address: response.data.address || this.payoutOrder.receiveAddress,
            status: 'PENDING', // Use uppercase status to match the API format
            expiryTime: response.data.expiredTime ? new Date(response.data.expiredTime * 1000) : null,
            orderId: response.data.orderId,
            orderType: response.data.orderType || 'PAYOUT',
            isPayout: true // Flag to indicate this is a payout order
          };
          
          console.log('Payout data created:', this.paymentData);
          
          // Start checking status periodically
          this.startStatusCheck();
        }
      } catch (err) {
        this.error = `Failed to create payout order: ${err.message}`;
      }
    },
    
    async checkOrderStatus() {
      if (!this.sdkInitialized) {
        this.error = 'SDK not initialized. Please check your environment variables.';
        return;
      }
      
      if (!this.checkOrderId) {
        this.error = 'Please enter an Order ID to check.';
        return;
      }
      
      try {
        this.error = null;
        this.result = null;
        
        const response = await this.xpay.getOrderStatus(this.checkOrderId);
        this.result = response;
        
        // If we have payment data for this order, update it with the latest status
        if (this.paymentData && response.code === 200 && response.data) {
          if (response.data.orderId === this.checkOrderId) {
            this.paymentData.status = response.data.status;
            
            if (response.data.transaction) {
              this.paymentData.txStatus = response.data.transaction.status;
              this.paymentData.txid = response.data.transaction.txid;
            }
          }
        }
      } catch (err) {
        this.error = `Failed to check order status: ${err.message}`;
      }
    },
    
    async getSupportedSymbols() {
      if (!this.sdkInitialized) {
        this.error = 'SDK not initialized. Please check your environment variables.';
        return;
      }
      
      try {
        this.error = null;
        this.result = null;
        
        const response = await this.xpay.getSupportedSymbols(
          this.chainFilter || undefined,
          this.symbolFilter || undefined
        );
        this.result = response;
      } catch (err) {
        this.error = `Failed to get supported symbols: ${err.message}`;
      }
    },
    
    startStatusCheck() {
      this.stopStatusCheck();
      
      // Check status every 10 seconds
      this.statusCheckInterval = setInterval(async () => {
        if (this.checkOrderId) {
          try {
            const status = await this.xpay.getOrderStatus(this.checkOrderId);
            
            // Update payment data with new status
            if (this.paymentData && status && status.code === 200 && status.data) {
              // Order status is in data.status
              const orderStatus = status.data.status;
              this.paymentData.status = orderStatus || this.paymentData.status;
              
              // Update order type if available
              if (status.data.orderType) {
                this.paymentData.orderType = status.data.orderType;
                this.paymentData.isPayout = status.data.orderType === 'PAYOUT';
              }
              
              // Transaction status is in data.transaction.status if available
              if (status.data.transaction) {
                this.paymentData.txStatus = status.data.transaction.status;
                this.paymentData.txid = status.data.transaction.txid;
              }
              
              // If payment is completed or failed, stop checking
              if (['SUCCESS', 'EXPIRED', 'FAILED'].includes(orderStatus)) {
                this.stopStatusCheck();
              }
            }
          } catch (err) {
            console.error('Error checking status:', err);
          }
        }
      }, 10000);
    },
    
    stopStatusCheck() {
      if (this.statusCheckInterval) {
        clearInterval(this.statusCheckInterval);
        this.statusCheckInterval = null;
      }
    },
    
    handlePaymentExpired() {
      if (this.paymentData) {
        this.paymentData.status = 'Expired';
      }
      this.stopStatusCheck();
    }
  },
  
  beforeUnmount() {
    this.stopStatusCheck();
  }
};
</script>

<style scoped>
.payment-demo {
  padding: 20px;
}

h2, h3 {
  color: #2c3e50;
}

.sdk-status {
  padding: 10px 15px;
  margin-bottom: 20px;
  border-radius: 4px;
  font-weight: bold;
}

.sdk-status.success {
  background-color: #d4edda;
  color: #155724;
}

.sdk-status.error {
  background-color: #f8d7da;
  color: #721c24;
}

.tabs {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
}

.inner-tabs {
  margin-top: 10px;
  margin-bottom: 15px;
  border-bottom: 1px dashed #ddd;
}

.tab-btn {
  padding: 10px 20px;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: bold;
  color: #666;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
}

.tab-btn:hover {
  color: #42b983;
}

.tab-btn.active {
  color: #42b983;
  border-bottom-color: #42b983;
}

.demo-section {
  background-color: #f8f8f8;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.demo-section.disabled {
  opacity: 0.6;
  pointer-events: none;
}

.info-box {
  background-color: #e3f2fd;
  border-left: 4px solid #2196f3;
  padding: 10px 15px;
  margin-bottom: 15px;
  border-radius: 4px;
  font-size: 0.9em;
}

.form-group {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

label {
  width: 120px;
  font-weight: bold;
}

input, select {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.btn {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 10px;
}

.btn:hover:not(:disabled) {
  background-color: #3aa876;
}

.btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.btn-small {
  background-color: #2c3e50;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
}

.success-message {
  color: #42b983;
  margin-top: 10px;
  font-weight: bold;
}

.result-section, .error-section {
  margin-top: 30px;
}

.result-section pre {
  background-color: #2c3e50;
  color: #fff;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
}

.error-section pre {
  background-color: #e74c3c;
  color: #fff;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
}
</style>