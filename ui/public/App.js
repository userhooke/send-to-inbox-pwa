class App {
  #root;

  constructor(root) {
    this.#root = root;
    this.updateScene();
  }

  updateScene() {
    if (Auth.isLoggedIn()) {
      alert('logged in!');
    } else {
      const auth = new Auth(this.#root);
      auth.onUserLoggedIn(() => this.updateScene());
    }
  }
}
