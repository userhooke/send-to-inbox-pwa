import { loadingEvent, successEvent, errorEvent } from './events.mjs'
import { post, showStatus, showLoading } from './utils.mjs'

/**
 *
 */
export async function handleAuth(authNode) {
  const email = authNode.querySelector('#email');
  const key = authNode.querySelector('#key');
  const button = authNode.querySelector('button');

  button.addEventListener('click', async () => {
    if (!email.value || !key.value) return;

    try {
      const { token } = await post('https://264yww7hy3.execute-api.eu-west-1.amazonaws.com/prod/api/authenticate', {
        email: email.value,
        key: key.value,
      });
      if (!token) return; // TODO add wrong password message
      localStorage.setItem('email', email.value);
      localStorage.setItem('token', token);
      location.reload();
    } catch (e) {
      console.error(e);
    }
  });
}

/**
 *
 */
export async function handleForm(formNode) {
  const textarea = formNode.querySelector('textarea');
  const button = formNode.querySelector('button');

  button.addEventListener('click', async () => {
    if (!textarea.value) return;
    formNode.dispatchEvent(loadingEvent)

    try {
      const result = await post('https://264yww7hy3.execute-api.eu-west-1.amazonaws.com/prod/api/send', {
        email: localStorage.getItem('email'),
        message: textarea.value,
      });
      formNode.dispatchEvent(successEvent)
      console.log(result);
      textarea.value = '';
    } catch (e) {
      formNode.dispatchEvent(errorEvent)
      console.error(e);
    }
  });
}

/**
 *
 */
export function handleLoading(event) {
  showLoading(true);
}

/**
 *
 */
export function handleSuccess(event) {
  showLoading(false);
  showStatus('success', 'Message sent! 🚀');
}

/**
 *
 */
export function handleError(event) {
  showLoading(false);
  showStatus('error', 'Error! 😔');
}
