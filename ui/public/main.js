// if (localStorage.getItem('token') || localStorage.getItem('email')) {
//   app.form.init();
//   setInterval(() => {
//     const backup = app.form.getFormData();
//     if (!backup) return;
//     app.form.setBackup(backup);
//   }, 5000);
// } else {
//   app.auth.requestAuthorization();
// }

const root = document.querySelector('#root');
const app = new App(root);
