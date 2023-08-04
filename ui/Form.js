function Form({ backupFormData, getBackupData }) {
  const { div, button, h2, textarea } = HTML;

  const feedbackArea = div({ class: "send" }, defaultButton());

  const form = div({ id: "form" }, viewForm(getBackupData() || FORM_TYPES[0]));

  async function handleSubmit() {
    const data = getFormData();
    if (!data.entries.find((e) => e.answer.length > 0)) {
      return;
    }
    feedbackArea.update(loadingButton());

    let letter = "";
    for (const entry of data.entries) {
      if (!!letter.length) letter += "\n\n";
      if (!!entry.question.length) {
        letter += entry.question;
        letter += "\n";
      }
      if (!!entry.answer.length) letter += entry.answer;
    }

    try {
      await Api.sendMail({
        email: localStorage.getItem("email"),
        message: letter,
      });

      localStorage.removeItem("backup");
      form.update(viewForm(FORM_TYPES[0]));
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

  function viewEntries(entries) {
    return entries.map((e) => viewEntry(e.question, e.answer));
  }

  function viewEntry(question, answer) {
    return div(
      { class: "entry", "data-entry": "" },
      question
        ? h2({ class: "question", "data-question": "" }, question)
        : null,
      textarea(
        {
          class: "answer",
          "aria-label": "textarea",
          autofocus: "",
          "data-answer": "",
        },
        answer ?? "",
      ),
    );
  }

  function viewForm(type) {
    return div(
      { "data-form-type": type.type, class: "container" },
      div(
        { class: "controls" },
        button(
          {
            class: "form-selector-button",
            onclick: () => showTemplateSelector(),
          },
          "?",
        ),
        feedbackArea,
      ),
      div({ class: "entries" }, ...viewEntries(type.entries)),
    );
  }

  function selectForm(type) {
    const selectedForm = FORM_TYPES.find((t) => t.type === type);
    form.update(viewForm(selectedForm));
  }

  function showTemplateSelector() {
    form.update(
      ...FORM_TYPES.map((t) => button({ onclick: () => selectForm(t.type) }, t.type)),
      div({id: "version"}, APP_VERSION || "")
    );
  }

  function getFormData() {
    const formType = form.querySelector("[data-form-type]")?.dataset.formType;
    const entries = form.querySelectorAll("[data-entry]");
    if (!formType) return null;
    let data = {
      type: formType,
      entries: [],
    };
    for (const e of entries) {
      const question = e.querySelector("[data-question]")?.innerText || "";
      const answer = e.querySelector("[data-answer]").value;
      data.entries.push({ question, answer });
    }
    return data;
  }

  setInterval(() => {
    const backup = getFormData();
    if (!backup) return;
    backupFormData(backup);
  }, 5000);

  return form;
}
