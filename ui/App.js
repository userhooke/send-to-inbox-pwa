function App() {
  const root = HTML.div({ id: "root" }, view());
  const updateView = HTML.updateNode(root);

  function isLoggedIn() {
    return localStorage.getItem("token") && localStorage.getItem("email");
  }

  function updateScene() {
    updateView(view());
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
      return Form({
        backupFormData: (backup) => backupFormData(backup),
        getBackupData,
      });
    } else {
      return Auth({ userLoggedIn: updateScene });
    }
  }

  return root;
}
