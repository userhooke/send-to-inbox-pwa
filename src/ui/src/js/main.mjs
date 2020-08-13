import { handleAuth, handleForm, handleLoading, handleError, handleSuccess } from './handlers.mjs';
import { getShareToData } from './utils.mjs'

const form = document.querySelector('#form');
const auth = document.querySelector('#auth');

/**
 * Android native "Share to" handler
 */
if (location.search) {
  form.querySelector('textarea').value = getShareToData();
}

/**
 * Setup listeners
 */
form.addEventListener('loading', handleLoading)
form.addEventListener('error', handleError)
form.addEventListener('success', handleSuccess)

/**
 * Setup handlers
 */
if (!localStorage.getItem('token') || !localStorage.getItem('email')) {
  form.remove();
  handleAuth(auth);
} else {
  auth.remove();
  handleForm(form);
}
