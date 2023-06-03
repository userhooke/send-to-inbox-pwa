/**
 * @todo
 * setInterval(() => {
 *   const backup = app.form.getFormData();
 *   if (!backup) return;
 *   app.form.setBackup(backup);
 * }, 5000);
 */
function App() {
  const root = HTML.div({}, view());
  const updateView = HTML.updateNode(root);

  function isLoggedIn() {
    return localStorage.getItem('token') && localStorage.getItem('email');
  }

  function updateScene() {
    updateView(view());
  }

  function view() {
    if (isLoggedIn()) {
      return Form();
    } else {
      return Auth({ userLoggedIn: updateScene });
    }
  }

  return root;
}
