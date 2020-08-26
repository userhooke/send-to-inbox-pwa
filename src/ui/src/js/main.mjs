import {
  visitorListener,
  authListener,
  loadingListener,
  errorListener,
  successListener,
  formListener,
  authSubmitListener,
  formSubmitListener,
  viewListener,
} from './listeners.mjs';
import { visitorEvent } from './events.mjs';
import {
  formElement,
  formSubmitElement,
  authSubmitElement,
} from './elements.mjs';

/**
 * Setup listeners
 */
document.addEventListener('visitor', visitorListener);
document.addEventListener('authorized', viewListener);
document.addEventListener('notAuthorized', viewListener);
document.addEventListener('notAuthorized', authListener);
document.addEventListener('authorized', formListener);
formElement.addEventListener('loading', loadingListener);
formElement.addEventListener('error', errorListener);
formElement.addEventListener('success', successListener);
formSubmitElement.addEventListener('click', formSubmitListener);
authSubmitElement.addEventListener('click', authSubmitListener);

/**
 * Fire init events
 */
document.dispatchEvent(visitorEvent);

// navigator.serviceWorker
//   .register('/sw.js')
//   .then((registration) => {
//     console.log('SW registered! Scope is: ', registration.scope);
//   })
//   .catch((e) => {
//     console.error(e);
//   });
