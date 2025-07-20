import { start } from '@umijs/plugin-qiankun/es/master';

// Initialize qiankun when the main app is ready
export function initQiankun() {
  start({
    prefetch: false, // Disable prefetch for now
    sandbox: {
      strictStyleIsolation: true,
      experimentalStyleIsolation: true,
    },
    getTemplate: (tpl) => `<div id="qiankun-container">${tpl}</div>`,
  });
  
  console.log('Qiankun micro-frontend framework initialized');
}

// Call this after the main app is mounted
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    initQiankun();
  });
}