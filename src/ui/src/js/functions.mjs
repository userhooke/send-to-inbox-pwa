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

export async function handleForm(formNode) {
  const textarea = formNode.querySelector('textarea');
  const button = formNode.querySelector('button');

  button.addEventListener('click', async () => {
    if (!textarea.value) return;

    try {
      const result = await post('https://264yww7hy3.execute-api.eu-west-1.amazonaws.com/prod/api/send', {
        email: localStorage.getItem('email'),
        message: textarea.value,
      });
      showStatus('success', 'Message sent! 🚀');
      console.log(result);
      textarea.value = '';
    } catch (e) {
      showStatus('error', 'Error! 😔');
      console.error(e);
    }
  });
}

/**
 * Androind native "Share to" handler
 */
export function getShareToData() {
  const parsedUrl = new URL(window.location.toString());
  let providedData = '';
  parsedUrl.searchParams.forEach((value) => {
    providedData = providedData + value + '\n';
  });
  return providedData;
}

function showStatus(status, message) {
  const el = document.querySelector('.status-message');
  el.innerText = message;
  el.classList.add(status)
  setTimeout(() => {
    el.classList.remove(status)
  }, 5000)
}

async function post(url, data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + localStorage.getItem('token'),
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json(); // parses JSON response into native JavaScript objects
}
