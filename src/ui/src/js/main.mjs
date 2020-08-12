import { handleAuth, handleForm, getShareToData } from './functions.mjs';

const form = document.querySelector('#form');
const auth = document.querySelector('#auth');

/**
 * Android native "Share to" handler
 */
if (location.search) {
  form.querySelector('textarea').value = getShareToData();
}

/**
 * Auth handlers
 */
if (!localStorage.getItem('token') || !localStorage.getItem('email')) {
  form.remove();
  handleAuth(auth);
} else {
  auth.remove();
  handleForm(form);
}
