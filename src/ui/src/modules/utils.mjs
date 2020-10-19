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
export async function api(method, endpoint, data = {}) {
  // throw new Error('fuck!');
  // return data;

  let url = localStorage.getItem('API_URL') || window.CONFIG.API_URL;

  if (url.slice(-1) !== '/') {
    url = url.concat('/');
  }

  const response = await fetch(url + endpoint, {
    method,
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + localStorage.getItem('token'),
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json(); // parses JSON response into native JavaScript objects
}

/**
 * Spefify which elements should be displayed.
 * Example of a ui-components: `<section class="ui-component" data-name="form"></section>`
 * @param {HTMLElement} root - Only direct children of a root element will be modified
 * @param {Array} names - Array of `data-name`'s of elements to display
 */
export function render(root, names) {
  for (let comp of root.children) {
    names.forEach((el) => {
      comp.dataset.name === el
        ? comp.setAttribute('style', 'display: unset')
        : comp.removeAttribute('style');
    });
  }
}
