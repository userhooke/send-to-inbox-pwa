const FORM_TYPES = [
  {
    type: "Default",
    entries: [
      {
        question: "",
      },
    ],
  },
  {
    type: "Digging deeper",
    entries: [
      {
        question: "What's the matter?",
      },
      {
        question: "Why is that?",
      },
      {
        question: "Why is that?",
      },
      {
        question: "Why is that?",
      },
      {
        question: "Why is that?",
      },
      {
        question: "Why is that?",
      },
    ],
  },
  {
    type: "Daily journal",
    entries: [
      {
        question: "",
        answer: formatDate(new Date()),
      },
      {
        question: "What happened today?",
      },
      {
        question: "Joy or Anger or?",
      },
      {
        question: "What thought occupies my attention? How long? Why? Do I want this?",
      },
      {
        question: "With whom am I having dialogues in my head? How long?",
      },
      {
        question: "What are you grateful for today?",
      },
      {
        question: "What have you achieved today?",
      },
      {
        question: "Any fails today?",
      },
      {
        question: "Any complaints?",
      },
      {
        question: "What did you learn today?",
      },
    ],
  },
];

function formatDate(date) {
  const year = date.getFullYear();
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${day} ${month} ${year} ${hours}:${minutes}`;
}

function Form({ backupFormData, getBackupData }) {
  const { div, button, h2, textarea, updateNode } = HTML;

  const feedbackArea = div({ class: "send" }, defaultButton());
  const updatefeedbackArea = updateNode(feedbackArea);

  const form = div({ id: "form" }, viewForm(getBackupData() || FORM_TYPES[0]));
  const updateForm = updateNode(form);

  async function handleSubmit() {
    const data = getFormData();
    if (!data.entries.find((e) => e.answer.length > 0)) {
      return;
    }
    updatefeedbackArea(loadingButton());

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
      updateForm(viewForm(FORM_TYPES[0]));
      showSuccess();
    } catch (e) {
      console.error(e);
      showError(e);
    }
  }

  function showError(msg) {
    updatefeedbackArea(errorButton(msg));
    setTimeout(() => {
      updatefeedbackArea(defaultButton());
    }, 5000);
  }

  function showSuccess() {
    updatefeedbackArea(successButton());
    setTimeout(() => {
      updatefeedbackArea(defaultButton());
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
    updateForm(viewForm(selectedForm));
  }

  function showTemplateSelector() {
    updateForm(
      ...FORM_TYPES.map((t) => button({ onclick: () => selectForm(t.type) }, t.type)),
      div({id: "version"}, window.APP_VERSION || "")
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
