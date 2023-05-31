class Auth {
  #root;
  #email;
  #key;
  #feedbackButtonHolder;
  #userLoggedIn;

  constructor(root) {
    this.#root = root;
    this.#showForm();
  }

  static isLoggedIn() {
    return localStorage.getItem('token') && localStorage.getItem('email');
  }

  onUserLoggedIn(clb) {
    this.#userLoggedIn = clb;
  }

  #showForm() {
    this.#root.replaceChildren();
    this.#root.appendChild(this.#form());
  }

  // #template(button) {
  //   return /* html */ `
  //     <div id="auth">
  //       <fieldset>
  //         <h1>Please login.</h1>
  //       </fieldset>
  //       <fieldset>
  //         <label for="email">Email</label>
  //         <input
  //           class="input"
  //           type="email"
  //           name="email"
  //           id="email"
  //           placeholder="Email"
  //         />
  //       </fieldset>
  //       <fieldset>
  //         <label for="key">Key</label>
  //         <input
  //           class="input"
  //           type="password"
  //           name="key"
  //           id="key"
  //           placeholder="Key"
  //         />
  //       </fieldset>
  //       <fieldset class="button">
  //         ${button}
  //       </fieldset>
  //     </div>
  //   `;
  // }

  #activeButon() {
    return Dom.button(
      { type: 'submit', onclick: () => this.tryToLogin() },
      'Login',
    );
  }

  #errorButon(msg) {
    return Dom.button({ style: 'color: red;' }, msg);
  }

  #loadingButton() {
    return Dom.button({}, '🤔');
  }

  #form() {
    const { div, fieldset, h1, label, input } = Dom;

    this.#email = input({
      class: 'input',
      type: 'email',
      id: 'email',
      placeholder: 'Email',
    });

    this.#key = input({
      class: 'input',
      type: 'password',
      id: 'key',
      placeholder: 'Key',
    });

    this.#feedbackButtonHolder = fieldset({}, this.#activeButon());

    return div(
      { id: 'auth' },
      fieldset({}, h1({}, 'Please login')),
      fieldset({}, label({ for: 'email' }, this.#email)),
      fieldset({}, label({ for: 'key' }, this.#key)),
      this.#feedbackButtonHolder,
    );
  }

  async tryToLogin() {
    const email = this.#email.value;
    const key = this.#key.value;

    if (!email || !key) {
      this.showError('Email or key is not specified.');
      return;
    }

    this.showLoading();

    try {
      const { token } = await Api.authenticate({
        email,
        key,
      });

      if (!token) {
        this.showError('Wrong key.');
        return;
      }

      localStorage.setItem('email', email);
      localStorage.setItem('token', token);

      this.#userLoggedIn();
    } catch (e) {
      console.error(e);
    }
  }

  showError(msg) {
    this.#feedbackButtonHolder.replaceChildren();
    this.#feedbackButtonHolder.appendChild(this.#errorButon(msg));
    setTimeout(() => {
      this.#feedbackButtonHolder.replaceChildren();
      this.#feedbackButtonHolder.appendChild(this.#activeButon());
    }, 5000);
  }

  showLoading() {
    this.#feedbackButtonHolder.replaceChildren();
    this.#feedbackButtonHolder.appendChild(this.#loadingButton());
  }
}
