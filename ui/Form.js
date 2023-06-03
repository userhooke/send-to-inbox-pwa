// app.form.template.shell = (template) => /* html */ `

//   <div id="form" data-type="${template.type}">
//     <div class="controls">
//       <button class="form-selector-button" onclick="app.form.showTemplateSelector()">?</button>
//       <div class="send">
//         ${app.form.template.defaultButton()}
//       </div>
//     </div>
//     <div class="entries">
//       ${template.entries.map(app.form.template.entry).join('')}
//     </div>
//   </div>
//   `;

// app.form.template.entry = ({ question, answer }) => /* html */ `
//   <div class="entry">
//     ${question && `<p class="question">${question}</p>`}
//     <textarea class="answer" aria-label="textarea" autofocus>${answer}</textarea>
//   </div>
// `;

// app.form.template.errorButton = (msg) => /* html */ `
//   <style>
//     #form .send button {
//     color: red;
//     }
//   </style>
//   <button>${msg}</button>
// `;

// app.form.template.successButton = () => /* html */ `
//   <style>
//     #form .send button {
//       color: green;
//     }
//   </style>
//   <button>Success!</button>
// `;

// app.form.template.defaultButton = () => /* html */ `
// <button type="submit" onclick="app.form.handleSubmit()">Submit</button>
// `;

// app.form.init = () => {
//   if (app.form.isBackup()) {
//     app.form.renderForm(app.form.getBackup());
//     return;
//   }
//   const sharedMessage = app.form.getShareToData();
//   if (sharedMessage) {
//     app.form.renderForm({
//       type: 'Default',
//       entries: [
//         {
//           question: '',
//           answer: sharedMessage,
//         },
//       ],
//     });
//     return;
//   }

//   app.form.renderEmptyForm('Default');
// };

// app.form.renderEmptyForm = (type) => {
//   const formTemplate = app.form.types.find((f) => f.type === type);
//   app.form.renderForm(formTemplate);
// };

// app.form.renderForm = (template) => {
//   app.render('#root', app.form.template.shell(template));
// };

// app.form.getFormData = () => {
//   const formType = document.querySelector('#form')?.dataset.type;
//   const entries = document.querySelectorAll('#form .entry');

//   if (!formType) return null;

//   let backup = {
//     type: formType,
//     entries: [],
//   };

//   for (const e of entries) {
//     const question = e.querySelector('.question')?.innerText || '';
//     const answer = e.querySelector('.answer').value;
//     backup.entries.push({ question, answer });
//   }

//   return backup;
// };

// app.form.isBackup = () => localStorage.getItem('backup')?.length > 0;

// app.form.getBackup = () => JSON.parse(localStorage.getItem('backup'));

// app.form.setBackup = (data) =>
//   localStorage.setItem('backup', JSON.stringify(data));

// /**
//  * Androind native "Share to" handler
//  */
// app.form.getShareToData = () => {
//   const parsedUrl = new URL(window.location.toString());
//   let providedData = '';
//   parsedUrl.searchParams.forEach((value) => {
//     providedData = providedData + value + '\n';
//   });
//   return providedData;
// };

// app.form.template.templateSelector = () => /* html */ `
//   ${app.form.types
//     .map(
//       (t) => `
//     <button onclick="app.form.renderEmptyForm('${t.type}')">${t.type}</button>
//   `,
//     )
//     .join('')}
// `;

// app.form.showTemplateSelector = () => {
//   app.render('#root', app.form.template.templateSelector());
// };

// app.form.handleSubmit = async () => {
//   const data = app.form.getFormData();
//   if (!data.entries.find((e) => e.answer.length > 0)) {
//     return;
//   }
//   app.form.showLoading();

//   let letter = '';
//   for (const entry of data.entries) {
//     if (!!letter.length) letter += '\n\n';
//     if (!!entry.question.length) {
//       letter += entry.question;
//       letter += '\n';
//     }
//     if (!!entry.answer.length) letter += entry.answer;
//   }

//   try {
//     await app.api('POST', 'send', {
//       email: localStorage.getItem('email'),
//       message: letter,
//     });
//     await app.form.showSuccess();
//     localStorage.removeItem('backup');
//     app.form.init();
//   } catch (e) {
//     console.error(e);
//     app.form.showError(e);
//   }
// };

// app.form.showLoading = () =>
//   app.render('#form .send', app.form.template.loadingButton());

// app.form.showError = (msg) => {
//   app.render('#form .send', app.form.template.errorButton(msg));
//   setTimeout(() => {
//     app.render('#form .send', app.form.template.defaultButton());
//   }, 5000);
// };

// app.form.showSuccess = () => {
//   return new Promise((res) => {
//     app.render('#form .send', app.form.template.successButton());
//     setTimeout(res, 2000);
//   });
// };

const FORM_TYPES = [
  {
    type: 'Default',
    entries: [
      {
        question: '',
      },
    ],
  },
  {
    type: 'Finding the root cause',
    entries: [
      {
        question: 'What is the matter?',
      },
      {
        question: 'What caused that?',
      },
      {
        question: 'What caused that?',
      },
      {
        question: 'What caused that?',
      },
      {
        question: 'What caused that?',
      },
      {
        question: 'What caused that?',
      },
    ],
  },
];

/**
 * @todo
 * - load from backup
 * - store to backup
 * - send data
 * - clear form before showing success feedback
 */
function Form() {
  const { div, button, h2, textarea, updateNode } = HTML;

  const feedbackArea = div({ class: 'send' }, defaultButton());
  const updatefeedbackArea = updateNode(feedbackArea);

  const form = div({ id: 'form' }, viewForm(FORM_TYPES[0]));
  const updateForm = updateNode(form);

  function handleSubmit() {
    updatefeedbackArea(loadingButton());
  }

  function defaultButton() {
    return button({ type: 'submit', onclick: () => handleSubmit() }, 'Submit');
  }

  function loadingButton() {
    return button({ disabled: '' }, '🤔');
  }

  function viewEntries(entries) {
    return entries.map((e) => viewEntry(e.question, e.answer));
  }

  function viewEntry(question, answer) {
    return div(
      { class: 'entry' },
      question ? h2({ class: 'question' }, question) : null,
      textarea(
        { class: 'answer', 'aria-label': 'textarea', autofocus: '' },
        answer ?? '',
      ),
    );
  }

  function viewForm(type) {
    return div(
      {},
      div(
        { class: 'controls' },
        button(
          {
            class: 'form-selector-button',
            onclick: () => showTemplateSelector(),
          },
          '?',
        ),
        feedbackArea,
      ),
      div({ class: 'entries' }, ...viewEntries(type.entries)),
    );
  }

  function selectForm(type) {
    const selectedForm = FORM_TYPES.find((t) => t.type === type);
    updateForm(viewForm(selectedForm));
  }

  function showTemplateSelector() {
    updateForm(
      ...FORM_TYPES.map((t) =>
        button({ onclick: () => selectForm(t.type) }, t.type),
      ),
    );
  }

  function getFormData() {
    //   const formType = document.querySelector('#form')?.dataset.type;
    //   const entries = document.querySelectorAll('#form .entry');
    //   if (!formType) return null;
    //   let backup = {
    //     type: formType,
    //     entries: [],
    //   };
    //   for (const e of entries) {
    //     const question = e.querySelector('.question')?.innerText || '';
    //     const answer = e.querySelector('.answer').value;
    //     backup.entries.push({ question, answer });
    //   }
    //   return backup;
  }

  return form;
}
