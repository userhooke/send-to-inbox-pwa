/**
 * Listeners are for reacting to events
 */

import {
  formElement,
  textareaElement,
  emailInputElement,
  keyInputElement,
  viewContainerElement,
} from './elements.mjs';
import { showStatus, showLoading, getShareToData } from './utils.mjs';
import {
  authorizedEvent,
  notAuthorizedEvent,
  loadingEvent,
  successEvent,
  errorEvent,
} from './events.mjs';
import { api, render } from './utils.mjs';

/**
 *
 */
export function visitorListener(event) {
  if (!localStorage.getItem('token') || !localStorage.getItem('email')) {
    document.dispatchEvent(notAuthorizedEvent);
  } else {
    document.dispatchEvent(authorizedEvent);
  }
}

/**
 *
 */
export function viewListener(event) {
  event.type === 'authorized'
    ? render(viewContainerElement, ['form'])
    : render(viewContainerElement, ['auth']);
}

/**
 *
 */
export function formListener(event) {
  let incommingMessage = '';

  if (localStorage.getItem('backup')) {
    incommingMessage = incommingMessage.concat(
      JSON.parse(localStorage.getItem('backup')),
    );
  }

  // Android native "Share to"
  if (location.search) {
    incommingMessage = incommingMessage.concat('\n\n', getShareToData());
  }

  textareaElement.value = incommingMessage;
  localStorage.setItem('backup', JSON.stringify(textareaElement.value));

  setInterval(() => {
    localStorage.setItem('backup', JSON.stringify(textareaElement.value));
  }, 10000);
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
  localStorage.removeItem('backup');
  textareaElement.value = '';
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
    const { token } = await api('POST', 'authenticate', {
      email: emailInputElement.value,
      key: keyInputElement.value,
    });
    if (!token) return; // TODO add wrong password message
    localStorage.setItem('email', emailInputElement.value);
    localStorage.setItem('token', token);
    // location.reload();
    document.dispatchEvent(authorizedEvent);
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
    const result = await api('POST', 'send', {
      email: localStorage.getItem('email'),
      message: textareaElement.value,
    });
    formElement.dispatchEvent(successEvent);
    console.log(result);
  } catch (e) {
    formElement.dispatchEvent(errorEvent);
    console.error(e);
  }
}
