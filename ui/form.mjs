import { div, button, textarea, updateInner } from "./html.mjs";
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
    
    updateInner(feedbackArea, loadingButton());

    try {
      await sendMail({
        email: localStorage.getItem("email"),
        message,
      });

      localStorage.removeItem("backup");
      formInput.value = "";
      updateInner(root, viewForm());
      formInput.focus();
      showSuccess();
    } catch (e) {
      console.error(e);
      showError(e.message);
    }
  }

  function showError(msg) {
    updateInner(feedbackArea, errorButton(msg));
    setTimeout(() => {
      updateInner(feedbackArea, defaultButton());
    }, 5000);
  }

  function showSuccess() {
    updateInner(feedbackArea, successButton());
    setTimeout(() => {
      updateInner(feedbackArea, defaultButton());
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
    updateInner(root, viewForm());
  }

  async function showTemplateSelector() {
    const templates = await fetch("/templates.json").then((r) => r.json());
    updateInner(root, [
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

