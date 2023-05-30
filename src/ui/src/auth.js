app.auth = {};
app.auth.template = {};

app.auth.template.login = () => /*html*/ `
  <div id="auth">
    <fieldset>
      <p>Please login.</p>
    </fieldset>
    <fieldset>
      <label for="email">Email</label>
      <input
        class="input"
        type="email"
        name="email"
        id="email"
        placeholder="Email"
      />
    </fieldset>
    <fieldset>
      <label for="key">Key</label>
      <input
        class="input"
        type="password"
        name="key"
        id="key"
        placeholder="Key"
      />
    </fieldset>
    <fieldset class="button">
      ${app.auth.template.activeButton()}
    </fieldset>
  </div>
`;

app.auth.template.activeButton = () => /* html */ `
  <button type="submit" onclick="app.auth.tryToLogin()">Login</button>
`;

app.auth.template.loadingButton = () => /* html */ `
  <button type="submit" disabled>🤔</button>
`;

app.auth.template.errorButton = (msg) => /* html */ `
  <style>
    #auth button {
      color: tomato;
    }
  </style>
  <button type="submit" >${msg}</button>
`;

app.auth.showActiveState = () =>
  app.render('#auth .button', app.auth.template.activeButton());

app.auth.showError = (msg) => {
  app.render('#auth .button', app.auth.template.errorButton(msg));
  setTimeout(app.auth.showActiveState, 5000);
};

app.auth.showLoading = () =>
  app.render('#auth .button', app.auth.template.loadingButton());

app.auth.requestAuthorization = () =>
  app.render('#root', app.auth.template.login());

app.auth.tryToLogin = async () => {
  let email = document.querySelector('#auth #email').value;
  let key = document.querySelector('#auth #key').value;

  if (!email || !key) {
    app.auth.showError('Email or key is not specified.');
    return;
  }

  app.auth.showLoading();

  try {
    const { token } = await app.api('POST', 'authenticate', {
      email,
      key,
    });

    if (!token) {
      app.auth.showError('Wrong key.');
      return;
    }

    localStorage.setItem('email', email);
    localStorage.setItem('token', token);

    app.form.init();
  } catch (e) {
    console.error(e);
  }
};
