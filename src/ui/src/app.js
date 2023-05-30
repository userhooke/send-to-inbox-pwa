const app = {};

app.render = (selector, template) => {
  const root = document.querySelector(selector);
  root.innerHTML = template;
};

app.CONFIG = Object.freeze({
  API_URL: 'https://264yww7hy3.execute-api.eu-west-1.amazonaws.com/prod/api',
});

app.api = async (method, endpoint, data = {}) => {
  let url = localStorage.getItem('API_URL') || app.CONFIG.API_URL;

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

  return response.json(); // parses JSON response into native JavaScript objects
};
