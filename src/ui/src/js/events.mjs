/**
 * Events are for communication between application elements
 */

export const loadingEvent = new CustomEvent('loading');
export const successEvent = new CustomEvent('success');
export const errorEvent = new CustomEvent('error');
export const visitorEvent = new CustomEvent('visitor');
export const authorizedEvent = new CustomEvent('authorized');
export const notAuthorizedEvent = new CustomEvent('notAuthorized');
