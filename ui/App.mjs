import { div, updateInner } from "./html.mjs";
import { auth } from "./auth.mjs";
import { form } from "./form.mjs";

export function app() {
  const root = div({ id: "root" }, view());

  function isLoggedIn() {
    return localStorage.getItem("token") && localStorage.getItem("email");
  }

  function updateScene() {
    updateInner(root, view());
  }

  function backupFormData(backup) {
    localStorage.setItem("backup", backup);
  }

  function getBackupData() {
    return localStorage.getItem("backup");
  }

  function view() {
    if (isLoggedIn()) {
      return form({
        backupFormData: (backup) => backupFormData(backup),
        getBackupData,
      });
    } else {
      return auth({ userLoggedIn: updateScene });
    }
  }

  const hour = new Date().getHours();
  if (hour >= 17 || hour <= 6) {
    document.documentElement.style.setProperty('--main-bg-color', '#000');
    document.documentElement.style.setProperty('--textarea-color', '#000');
    document.documentElement.style.setProperty('--font-color', 'green');
    document.documentElement.style.setProperty('--button-color', 'darkgray');
  }

  return root;
}
