/**
 * Listeners are for reacting to events
 */

import {
  formElement,
  authElement,
  textareaElement,
  emailInputElement,
  keyInputElement,
} from './elements.mjs';
import { showStatus, showLoading, getShareToData } from './utils.mjs';
import {
  authorizedEvent,
  loadingEvent,
  successEvent,
  errorEvent,
} from './events.mjs';
import { post } from './utils.mjs';

/**
 *
 */
export function visitorListener(event) {
  if (!localStorage.getItem('token') || !localStorage.getItem('email')) {
    document.dispatchEvent(authorizedEvent(false));
  } else {
    document.dispatchEvent(authorizedEvent(true));
  }
}

/**
 *
 */
export function viewListener(event) {
  if (event.detail.authorized) {
    authElement.setAttribute('style', 'display: none');
    formElement.removeAttribute('style');
  } else {
    formElement.setAttribute('style', 'display: none');
    authElement.removeAttribute('style');
  }
}

/**
 *
 */
export function formListener(event) {
  // Android native "Share to"
  if (location.search) {
    textareaElement.value = getShareToData();
  }
}

/**
 *
 */
export function authListener(event) {}

/**
 *
 */
export function loadingListener(event) {
  showLoading(true);
}

/**
 *
 */
export function successListener(event) {
  showLoading(false);
  showStatus('success', 'Message sent! 🚀');
}

/**
 *
 */
export function errorListener(event) {
  showLoading(false);
  showStatus('error', 'Error! 😔');
}

/**
 *
 */
export async function authSubmitListener(event) {
  if (!emailInputElement.value || !keyInputElement.value) return;

  try {
    const { token } = await post(
      'https://264yww7hy3.execute-api.eu-west-1.amazonaws.com/prod/api/authenticate',
      {
        email: emailInputElement.value,
        key: keyInputElement.value,
      },
    );
    if (!token) return; // TODO add wrong password message
    localStorage.setItem('email', emailInputElement.value);
    localStorage.setItem('token', token);
    // location.reload();
    document.dispatchEvent(authorizedEvent(true));
  } catch (e) {
    console.error(e);
  }
}

/**
 *
 */
export async function formSubmitListener(event) {
  if (!textareaElement.value) return;
  formElement.dispatchEvent(loadingEvent);

  try {
    const result = await post(
      'https://264yww7hy3.execute-api.eu-west-1.amazonaws.com/prod/api/send',
      {
        email: localStorage.getItem('email'),
        message: textareaElement.value,
      },
    );
    formElement.dispatchEvent(successEvent);
    console.log(result);
    textareaElement.value = '';
  } catch (e) {
    formElement.dispatchEvent(errorEvent);
    console.error(e);
  }
}
