import { div, fieldset, h1, label, input, button, updateInner } from "./html.mjs";
import { authenticate } from "./api.mjs";

export function auth({ userLoggedIn }) {
  const email = input({
    class: "input",
    type: "email",
    id: "email",
    placeholder: "Email",
  });

  const key = input({
    class: "input",
    type: "password",
    id: "key",
    placeholder: "Key",
  });

  const feedbackButtonHolder = fieldset({}, activeButon());

  function activeButon() {
    return button({ type: "submit", onclick: () => tryToLogin() }, "Login");
  }

  function errorButon(msg) {
    return button({ style: "color: red;" }, msg);
  }

  function loadingButton() {
    return button("🤔");
  }

  function showError(msg) {
    updateInner(feedbackButtonHolder, errorButon(msg));
    setTimeout(() => {
      updateInner(feedbackButtonHolder, activeButon());
    }, 5000);
  }

  function showLoading() {
    updateInner(feedbackButtonHolder, loadingButton());
  }

  async function tryToLogin() {
    if (!email.value || !key.value) {
      showError("Email or key is not specified.");
      return;
    }
    showLoading();
    try {
      const { token } = await authenticate({
        email: email.value,
        key: key.value,
      });
      if (!token) {
        showError("Wrong key.");
        return;
      }
      localStorage.setItem("email", email.value);
      localStorage.setItem("token", token);
      userLoggedIn();
    } catch (e) {
      showError(e);
    }
  }

  return div(
    { id: "auth" },
    [
      fieldset(h1("Please login")),
      fieldset(label({ for: "email" }, email)),
      fieldset(label({ for: "key" }, key)),
      feedbackButtonHolder,
      fieldset(APP_VERSION || "")
    ]
  );
}

