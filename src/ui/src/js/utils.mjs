/**
 * Utils are for helpers and tools
 */

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

/**
 *
 */
export function showStatus(status, message) {
  const el = document.querySelector('.status-message');
  el.innerText = message;
  el.classList.add(status);
  setTimeout(() => {
    el.classList.remove(status);
  }, 5000);
}

/**
 *
 */
export function showLoading(flag) {
  const btn = document.querySelector('#submitFormBtn');
  if (flag) {
    btn.innerText = 'Loading...';
    btn.disabled = true;
  } else {
    btn.innerText = 'Submit';
    btn.disabled = false;
  }
}

/**
 *
 */
export async function api(method, endpoint, data = {}) {
  let url =
    localStorage.getItem('API_URL') ||
    'https://264yww7hy3.execute-api.eu-west-1.amazonaws.com/prod/api';

  if (url.slice(-1) !== '/') {
    url = url.concat('/');
  }

  const response = await fetch(url + endpoint, {
    method, // *GET, POST, PUT, DELETE, etc.
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
