import { div, button, textarea } from "./html.mjs";
import { sendMail } from "./api.mjs";

export function form({ backupFormData, getBackupData }) {

  const formInput = textarea(
    {
      class: "answer",
      "aria-label": "textarea",
      autofocus: "",
    }
  )
  const feedbackArea = div({ class: "send" }, defaultButton());
  const root = div({ id: "form" }, viewForm());

  async function handleSubmit() {
    const message = formInput.value;
    if (!message.length) return;
    
    feedbackArea.update(loadingButton());

    try {
      await sendMail({
        email: localStorage.getItem("email"),
        message,
      });

      localStorage.removeItem("backup");
      formInput.value = "";
      root.update(viewForm());
      formInput.focus();
      showSuccess();
    } catch (e) {
      console.error(e);
      showError(e);
    }
  }

  function showError(msg) {
    feedbackArea.update(errorButton(msg));
    setTimeout(() => {
      feedbackArea.update(defaultButton());
    }, 5000);
  }

  function showSuccess() {
    feedbackArea.update(successButton());
    setTimeout(() => {
      feedbackArea.update(defaultButton());
    }, 2000);
  }

  function defaultButton() {
    return button({ type: "submit", onclick: () => handleSubmit() }, "Submit");
  }

  function loadingButton() {
    return button({ disabled: "" }, "🤔");
  }

  function successButton() {
    return button({ disabled: "", style: "color: green" }, "Success!");
  }

  function errorButton(msg) {
    return button({ disabled: "", style: "color: red" }, msg);
  }

  function viewForm() {
    return div(
      { class: "container" },
      [
        div(
          { class: "controls" },
          [
            button(
              {
                class: "form-selector-button",
                onclick: () => showTemplateSelector(),
              },
              "?",
            ),
            feedbackArea,
          ]
        ),
        formInput,
      ]
    );
  }

  function fillForm(template) {
    formInput.value = template;
    root.update(viewForm());
  }

  async function showTemplateSelector() {
    const templates = await fetch("/templates.json").then((r) => r.json());
    root.update([
      templates.map((t) => button({ onclick: () => fillForm(t.content) }, t.name)),
      div({id: "version"}, APP_VERSION || "")
    ]);
  }

  setInterval(() => {
    const backup = formInput.value
    backupFormData(backup);
  }, 5000);

  if (getBackupData()) {
    formInput.value = getBackupData();
  }
  formInput.focus();

  return root;
}

