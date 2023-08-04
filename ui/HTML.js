const HTML = {
  createElement(name, attrs, ...children) {
    const element = document.createElement(name);
    for (const child of children) {
      if (typeof child === "string") {
        element.appendChild(document.createTextNode(child));
      } else if (child === null) {
        continue;
      } else {
        element.appendChild(child);
      }
    }

    for (const [name, value] of Object.entries(attrs)) {
      switch (name) {
        case "onclick":
          element.addEventListener("click", value);
          break;
        case "oninput":
          element.addEventListener("input", value);
          break;
        default:
          element.setAttribute(name, value);
      }
    }

    element.update = (...newChildren) => {
      element.replaceChildren();
      for (const newChild of newChildren) {
        if (typeof newChild === "string") {
          element.appendChild(document.createTextNode(newChild));
        } else if (newChild === null) {
          continue;
        } else {
          element.appendChild(newChild);
        }
      }
    }

    return element;
  },
};

[
  "div",
  "button",
  "fieldset",
  "h1",
  "input",
  "textarea",
  "label",
  "h2",
  "p",
].forEach((tagName) => {
  HTML[tagName] = (attrs, ...children) =>
    HTML.createElement(tagName, attrs, ...children);
});
