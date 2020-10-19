import { api } from '../modules/utils.mjs';

export default class AuthForm extends HTMLElement {
  constructor() {
    super();

    const style = document.createElement('style');
    style.innerHTML = this.style();
    this.appendChild(style);

    const div = document.createElement('div');
    div.setAttribute('class', 'auth-form');
    div.innerHTML = this.template();
    this.appendChild(div);
  }

  // https://medium.com/@WebReflection/dom-handleevent-a-cross-platform-standard-since-year-2000-5bf17287fd38
  handleEvent(e) {
    this['on' + e.type](e);
  }

  connectedCallback() {
    this.querySelector('button').addEventListener('click', this);
  }

  template() {
    return /*html*/ `
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
        <fieldset>
          <button type="submit">Login</button>
        </fieldset>
    `;
  }

  style() {
    return /*css*/ `
      fieldset {
        border: none;
      }
    `;
  }

  async onclick(e) {
    let emailInputElement = this.querySelector('#email');
    let keyInputElement = this.querySelector('#key');

    if (!emailInputElement.value || !keyInputElement.value) return;
    try {
      const { token } = await api('POST', 'authenticate', {
        email: emailInputElement.value,
        key: keyInputElement.value,
      });
      if (!token) return; // TODO add wrong password message
      localStorage.setItem('email', emailInputElement.value);
      localStorage.setItem('token', token);
      this.dispatchEvent(new Event('authorized', { bubbles: true }));
    } catch (e) {
      console.error(e);
    }
  }
}

customElements.define('auth-form', AuthForm);
