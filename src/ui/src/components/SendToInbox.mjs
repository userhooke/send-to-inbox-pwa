import { api } from '../modules/utils.mjs';

export default class SendToInbox extends HTMLElement {
  constructor() {
    super();

    const style = document.createElement('style');
    style.innerHTML = getStyle();
    this.appendChild(style);

    const div = document.createElement('div');
    div.setAttribute('class', 'send-to-inbox-form');
    div.innerHTML = getTemplate();
    this.appendChild(div);
  }

  // https://medium.com/@WebReflection/dom-handleevent-a-cross-platform-standard-since-year-2000-5bf17287fd38
  connectedCallback() {
    this.querySelector('button').addEventListener('click', this);
    this.addEventListener('replyFromAPI', this);
    this.addEventListener('loading', this);

    const textarea = this.querySelector('textarea');
    let incommingMessage = '';
    if (localStorage.getItem('backup')) {
      incommingMessage = incommingMessage.concat(
        JSON.parse(localStorage.getItem('backup')),
        '\n',
      );
    }

    if (this.getAttribute('data-shared')) {
      incommingMessage = incommingMessage.concat(
        this.getAttribute('data-shared'),
      );
    }

    textarea.value = incommingMessage;
    localStorage.setItem('backup', JSON.stringify(textarea.value));

    setInterval(() => {
      localStorage.setItem('backup', JSON.stringify(textarea.value));
    }, 10000);
  }

  handleEvent(e) {
    this['on' + e.type](e);
  }

  async onclick(e) {
    const textarea = this.querySelector('textarea');
    if (!textarea.value) return;
    this.dispatchEvent(
      new CustomEvent('loading', {
        bubbles: true,
        detail: { inProgress: true },
      }),
    );

    try {
      const result = await api('POST', 'send', {
        email: localStorage.getItem('email'),
        message: textarea.value,
      });
      console.log(result);
      this.dispatchEvent(
        new CustomEvent('replyFromAPI', {
          bubbles: true,
          detail: { success: true },
        }),
      );
    } catch (e) {
      console.error(e);
      this.dispatchEvent(
        new CustomEvent('replyFromAPI', {
          bubbles: true,
          detail: { success: false },
        }),
      );
    }
  }

  onloading(e) {
    const btn = this.querySelector('button');
    if (e.detail.inProgress) {
      btn.innerText = '🤔';
      btn.disabled = true;
    } else {
      btn.innerText = 'Submit';
      btn.disabled = false;
    }
  }

  onreplyFromAPI(e) {
    const textarea = this.querySelector('textarea');
    this.dispatchEvent(
      new CustomEvent('loading', {
        bubbles: true,
        detail: { inProgress: false },
      }),
    );
    if (e.detail.success) {
      localStorage.removeItem('backup');
      textarea.value = '';
      this.showStatus('success', 'Message sent! 🚀');
    } else {
      this.showStatus('error', 'Error! 😔');
    }
  }

  showStatus(status, message) {
    const el = document.querySelector('.status-message');
    el.innerText = message;
    el.classList.add(status);
    setTimeout(() => {
      el.classList.remove(status);
    }, 5000);
  }
}

customElements.define('send-to-inbox', SendToInbox);

function getTemplate() {
  return /*html*/ `
    <div class="status-message"></div>
    <button type="submit" >Submit</button>
    <textarea aria-label="textarea" autofocus></textarea>
  `;
}

function getStyle() {
  return /*css*/ `
    .send-to-inbox-form {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .send-to-inbox-form button {
      height: 30px;
      flex-shrink: 0;
      width: 100px;
      align-self: flex-end;
      margin-bottom: 15px;
    }

    .send-to-inbox-form .status-message {
      padding: 5px;
      display: none;
      position: absolute;
    }

    .send-to-inbox-form .status-message.success {
      display: block;
      background-color: var(--status-success);
    }
    .send-to-inbox-form .status-message.error {
      display: block;
      background-color: var(--status-error);
    }
    .send-to-inbox-form textarea {
      resize: vertical;
      height: 100%;
      background-color: var(--textarea-color);
      border: none;
      padding: 5px;
      outline-color: lightgray;
      outline-style: dashed;
    }
  `;
}
