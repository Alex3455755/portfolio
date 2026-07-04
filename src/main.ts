import { createApp } from 'vue';
import App from './App.vue';
import './index.css';

// Prevent benign ResizeObserver loop limit errors from triggering runtime overlays or console noise
if (typeof window !== 'undefined') {
  window.addEventListener('error', (e) => {
    if (e.message && e.message.includes('ResizeObserver loop completed with undelivered notifications')) {
      e.stopImmediatePropagation();
    }
  });
  window.addEventListener('unhandledrejection', (e) => {
    if (e.reason && e.reason.message && e.reason.message.includes('ResizeObserver loop completed with undelivered notifications')) {
      e.stopImmediatePropagation();
    }
  });
}

const app = createApp(App);
app.mount('#app');

