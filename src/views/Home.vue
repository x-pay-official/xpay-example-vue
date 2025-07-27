<template>
  <div class="home">
    <h2>Welcome to X-Pay SDK Demo</h2>
    <div class="intro">
      <p>This demo showcases how to integrate the X-Pay cryptocurrency payment gateway into your Vue.js application.</p>
      <p>The X-Pay SDK allows you to:</p>
      <ul>
        <li>Create cryptocurrency payment orders</li>
        <li>Process cryptocurrency collections</li>
        <li>Check payment status</li>
        <li>Verify webhook signatures</li>
      </ul>
      <div class="cta">
        <router-link to="/payment-demo" class="btn">Try Payment Demo</router-link>
      </div>
    </div>
    <div class="sdk-info">
      <h3>SDK Installation</h3>
      <pre><code>npm install x-pay-sdk-official</code></pre>
      <h3>Basic Usage</h3>
      <pre><code>import { XPay } from 'x-pay-sdk-official';

const xpay = new XPay({
  apiKey: 'your-api-key',
  apiSecret: 'your-api-secret',
  baseUrl: 'https://api.x-pay.com'
});</code></pre>
    </div>
  </div>
</template>

<style scoped>
.home {
  padding: 20px;
}

h2 {
  color: #2c3e50;
  margin-bottom: 20px;
}

.intro {
  margin-bottom: 30px;
}

ul {
  margin: 20px 0;
  padding-left: 20px;
}

li {
  margin-bottom: 10px;
}

.cta {
  margin: 30px 0;
  text-align: center;
}

.btn {
  display: inline-block;
  background-color: #42b983;
  color: white;
  padding: 12px 24px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #3aa876;
}

.sdk-info {
  background-color: #f8f8f8;
  padding: 20px;
  border-radius: 8px;
  margin-top: 30px;
}

h3 {
  margin-top: 0;
  color: #2c3e50;
}

pre {
  background-color: #2c3e50;
  color: #fff;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  margin: 15px 0;
}

code {
  font-family: 'Courier New', Courier, monospace;
}
</style>