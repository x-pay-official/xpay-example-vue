<template>
  <div class="qr-code-container">
    <h3>{{ getTitle }}</h3>
    <div v-if="paymentData" class="payment-info">
      <div class="qr-wrapper" v-if="paymentData.orderType !== 'PAYOUT' && !paymentData.isPayout">
        <canvas ref="qrCanvas" class="qr-code"></canvas>
      </div>
      <div v-else class="payout-icon">
        <div class="payout-circle">
          <i class="payout-arrow">→</i>
        </div>
        <div class="payout-label">Merchant to User</div>
      </div>
      <div class="payment-details">
        <div class="detail-item">
          <span class="label">Amount:</span>
          <span class="value">{{ paymentData.amount }} {{ paymentData.symbol }}</span>
        </div>
        <div class="detail-item">
          <span class="label">{{ (paymentData.orderType === 'PAYOUT' || paymentData.isPayout) ? 'To:' : 'Address:' }}</span>
          <span class="value address">{{ paymentData.address }}</span>
          <button @click="copyToClipboard(paymentData.address)" class="copy-btn">Copy</button>
        </div>
        <div class="detail-item">
          <span class="label">Network:</span>
          <span class="value">{{ paymentData.chain }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Status:</span>
          <span class="value status" :class="statusClass">{{ displayStatus }}</span>
        </div>
        <div class="detail-item" v-if="paymentData.txid">
          <span class="label">TX ID:</span>
          <span class="value address">{{ truncateTxid(paymentData.txid) }}</span>
          <button @click="copyToClipboard(paymentData.txid)" class="copy-btn">Copy</button>
        </div>
        <div class="timer" v-if="timeRemaining > 0">
          <span>Expires in: {{ formatTime(timeRemaining) }}</span>
        </div>
      </div>
    </div>
    <div v-else class="no-data">
      No payment data available
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcode';

export default {
  name: 'PaymentQRCode',
  props: {
    paymentData: {
      type: Object,
      required: false,
      default: null
    }
  },
  data() {
    return {
      timeRemaining: 0,
      timer: null
    };
  },
  computed: {
    qrCodeContent() {
      if (!this.paymentData || !this.paymentData.address) {
        return '';
      }
      
      // For crypto payments, include the full payment information
      if (this.paymentData.chain === 'TRON') {
        // TRON TRC20 format
        return `tron:${this.paymentData.address}?token=${this.paymentData.symbol}&amount=${this.paymentData.amount}`;
      } else if (this.paymentData.chain === 'ETH') {
        // Ethereum format
        return `ethereum:${this.paymentData.address}@1?value=${this.paymentData.amount}&symbol=${this.paymentData.symbol}`;
      } else if (this.paymentData.chain === 'BSC') {
        // BSC format
        return `binance:${this.paymentData.address}?amount=${this.paymentData.amount}&token=${this.paymentData.symbol}`;
      } else {
        // Generic format
        return `${this.paymentData.address}`;
      }
    },
    statusClass() {
      if (!this.paymentData) return '';
      
      const status = this.paymentData.status;
      
      if (['PENDING', 'PENDING_CONFIRMATION'].includes(status)) {
        return 'status-pending';
      } else if (status === 'SUCCESS') {
        return 'status-success';
      } else if (['EXPIRED', 'FAILED'].includes(status)) {
        return 'status-failed';
      } else {
        return '';
      }
    },
    getTitle() {
      if (!this.paymentData) return 'Payment Details';
      
      const orderType = this.paymentData.orderType || (this.paymentData.isPayout ? 'PAYOUT' : 'COLLECTION');
      
      if (orderType === 'PAYOUT') {
        return 'Merchant Payout Details';
      } else {
        return 'Scan to Pay';
      }
    },
    displayStatus() {
      if (!this.paymentData) return '';
      
      const status = this.paymentData.status;
      const txStatus = this.paymentData.txStatus;
      const orderType = this.paymentData.orderType || (this.paymentData.isPayout ? 'PAYOUT' : 'COLLECTION');
      const isPayout = orderType === 'PAYOUT';
      
      if (status === 'PENDING') {
        return isPayout ? 'Processing Payout' : 'Awaiting Payment';
      } else if (status === 'PENDING_CONFIRMATION') {
        return isPayout ? 'Confirming Payout' : 'Confirming Payment';
      } else if (status === 'SUCCESS') {
        return isPayout ? 'Funds Sent Successfully' : 'Payment Successful';
      } else if (status === 'EXPIRED') {
        return isPayout ? 'Payout Request Expired' : 'Payment Window Expired';
      } else if (status === 'FAILED') {
        return isPayout ? 'Payout Failed' : 'Payment Failed';
      } else {
        return status || 'Unknown';
      }
    }
  },
  watch: {
    paymentData: {
      immediate: true,
      handler(newVal) {
        if (newVal && newVal.expiryTime) {
          this.startTimer(newVal.expiryTime);
        } else {
          this.stopTimer();
        }
        
        // Generate QR code when payment data changes
        this.$nextTick(() => {
          this.generateQRCode();
        });
      }
    }
  },
  methods: {
    generateQRCode() {
      // Don't generate QR code for payout orders
      if (this.paymentData && (this.paymentData.orderType === 'PAYOUT' || this.paymentData.isPayout)) {
        return;
      }
      
      if (this.qrCodeContent && this.$refs.qrCanvas) {
        QRCode.toCanvas(this.$refs.qrCanvas, this.qrCodeContent, {
          width: 200,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        }).catch(err => {
          console.error('Error generating QR code:', err);
        });
      }
    },
    copyToClipboard(text) {
      navigator.clipboard.writeText(text)
        .then(() => {
          alert('Address copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    },
    startTimer(expiryTime) {
      
      this.stopTimer();
      
      const updateTimer = () => {
        const now = Date.now();
        // Handle both Date object and timestamp
        const expiry = expiryTime instanceof Date ? expiryTime.getTime() : expiryTime;
        this.timeRemaining = Math.max(0, Math.floor((expiry - now) / 1000));
        
        if (this.timeRemaining <= 0) {
          this.stopTimer();
          this.$emit('expired');
        }
      };
      
      updateTimer();
      this.timer = setInterval(updateTimer, 1000);
    },
    stopTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    formatTime(totalSeconds) {
      const days = Math.floor(totalSeconds / (24 * 3600));
      const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      
      let timeString = '';
      
      if (days > 0) {
        timeString += `${days}d `;
      }
      
      if (days > 0 || hours > 0) {
        timeString += `${hours.toString().padStart(2, '0')}h `;
      }
      
      timeString += `${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
      
      return timeString;
    },
    truncateTxid(txid) {
      if (!txid) return '';
      if (txid.length <= 16) return txid;
      return txid.substring(0, 8) + '...' + txid.substring(txid.length - 8);
    }
  },
  mounted() {
    // Generate QR code when component is mounted
    this.$nextTick(() => {
      this.generateQRCode();
    });
  },
  beforeUnmount() {
    this.stopTimer();
  }
};
</script>

<style scoped>
.qr-code-container {
  background-color: #f8f8f8;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
}

h3 {
  margin-top: 0;
  color: #2c3e50;
  text-align: center;
}

.payment-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

@media (min-width: 768px) {
  .payment-info {
    flex-direction: row;
    align-items: flex-start;
  }
}

.qr-wrapper {
  background-color: white;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

@media (min-width: 768px) {
  .qr-wrapper {
    margin-right: 20px;
    margin-bottom: 0;
  }
}

.qr-code {
  display: block;
  width: 200px;
  height: 200px;
}

.payout-icon {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 200px;
  margin-bottom: 20px;
}

.payout-label {
  margin-top: 10px;
  font-weight: bold;
  color: #2c3e50;
}

.payout-circle {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #42b983;
  color: white;
}

.payout-arrow {
  font-size: 60px;
  font-style: normal;
}

.payment-details {
  flex: 1;
}

.detail-item {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.label {
  font-weight: bold;
  width: 80px;
  color: #666;
}

.value {
  flex: 1;
  word-break: break-all;
}

.address {
  font-family: monospace;
  background-color: #eee;
  padding: 5px;
  border-radius: 4px;
  font-size: 0.9em;
}

.copy-btn {
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  margin-left: 10px;
  cursor: pointer;
  font-size: 0.8em;
}

.copy-btn:hover {
  background-color: #1a2530;
}

.status {
  font-weight: bold;
}

.status-pending {
  color: #f39c12;
}

.status-success {
  color: #2ecc71;
}

.status-failed {
  color: #e74c3c;
}

.timer {
  margin-top: 15px;
  text-align: center;
  font-weight: bold;
  color: #e74c3c;
}

.no-data {
  text-align: center;
  color: #666;
  padding: 20px;
}
</style>