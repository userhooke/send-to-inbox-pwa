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
document.addEventListener('authorized', authListener);
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
