/**
 * XPayService - A browser-compatible wrapper for the X-Pay SDK
 * This service handles the crypto operations in a way that works in the browser
 */
import { XPay } from 'x-pay-sdk-official';

class XPayService {
  constructor(config) {
    try {
      this.xpay = new XPay(config);
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize XPay SDK:', error);
      this.initialized = false;
      throw error;
    }
  }

  async createCollection(params) {
    if (!this.initialized) {
      throw new Error('XPay SDK not initialized');
    }
    
    try {
      return await this.xpay.createCollection(params);
    } catch (error) {
      console.error('Error creating collection:', error);
      throw error;
    }
  }

  async createPayout(params) {
    if (!this.initialized) {
      throw new Error('XPay SDK not initialized');
    }
    
    try {
      return await this.xpay.createPayout(params);
    } catch (error) {
      console.error('Error creating payout:', error);
      throw error;
    }
  }

  async getOrderStatus(orderId) {
    if (!this.initialized) {
      throw new Error('XPay SDK not initialized');
    }
    
    try {
      return await this.xpay.getOrderStatus(orderId);
    } catch (error) {
      console.error('Error getting order status:', error);
      throw error;
    }
  }

  async getSupportedSymbols(chain, symbol) {
    if (!this.initialized) {
      throw new Error('XPay SDK not initialized');
    }
    
    try {
      return await this.xpay.getSupportedSymbols(chain, symbol);
    } catch (error) {
      console.error('Error getting supported symbols:', error);
      throw error;
    }
  }

  verifyWebhook(body, signature, timestamp) {
    if (!this.initialized) {
      throw new Error('XPay SDK not initialized');
    }
    
    try {
      return this.xpay.verifyWebhook(body, signature, timestamp);
    } catch (error) {
      console.error('Error verifying webhook:', error);
      throw error;
    }
  }

  parseWebhook(body, signature, timestamp) {
    if (!this.initialized) {
      throw new Error('XPay SDK not initialized');
    }
    
    try {
      return this.xpay.parseWebhook(body, signature, timestamp);
    } catch (error) {
      console.error('Error parsing webhook:', error);
      throw error;
    }
  }
}

export default XPayService;