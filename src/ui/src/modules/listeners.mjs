/**
 * Listeners are for reacting to events
 */

import { render, getShareToData } from './utils.mjs';

const viewContainerElement = document.querySelector('.main-view');
const authorizedEvent = new CustomEvent('authorized');
const notAuthorizedEvent = new CustomEvent('notAuthorized');

/**
 *
 */
export function visitorListener(event) {
  if (!localStorage.getItem('token') || !localStorage.getItem('email')) {
    document.dispatchEvent(notAuthorizedEvent);
  } else {
    document.dispatchEvent(authorizedEvent);
  }

  // Android native "Share to"
  if (location.search) {
    // incommingMessage = incommingMessage.concat('\n\n', getShareToData());
    document.querySelector('send-to-inbox').dataset.shared = getShareToData();
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
