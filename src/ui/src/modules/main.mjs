import { visitorListener, viewListener } from './listeners.mjs';

window.CONFIG = Object.freeze({
  API_URL: 'https://264yww7hy3.execute-api.eu-west-1.amazonaws.com/prod/api',
});

/**
 * Setup listeners
 */
document.addEventListener('visitor', visitorListener);
document.addEventListener('authorized', viewListener);
document.addEventListener('notAuthorized', viewListener);

/**
 * Fire init events
 */
document.dispatchEvent(new Event('visitor'));

// navigator.serviceWorker
//   .register('/sw.js')
//   .then((registration) => {
//     console.log('SW registered! Scope is: ', registration.scope);
//   })
//   .catch((e) => {
//     console.error(e);
//   });
