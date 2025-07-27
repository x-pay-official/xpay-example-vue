import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import Home from './views/Home.vue';
import PaymentDemo from './views/PaymentDemo.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/payment-demo', component: PaymentDemo }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

const app = createApp(App);
app.use(router);
app.mount('#app');