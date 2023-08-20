import { div } from "./html.mjs";
import { auth } from "./auth.mjs";
import { form } from "./form.mjs";

export function app() {
  const root = div({ id: "root" }, view());

  function isLoggedIn() {
    return localStorage.getItem("token") && localStorage.getItem("email");
  }

  function updateScene() {
    root.update(view());
  }

  function backupFormData(backup) {
    localStorage.setItem("backup", JSON.stringify(backup));
  }

  function getBackupData() {
    let result = null;

    const backupedData = localStorage.getItem("backup");
    if (backupedData?.length > 0) {
      try {
        result = JSON.parse(backupedData);
      } catch (e) {
        console.error(e);
      }
    }

    return result;
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

  return root;
}
