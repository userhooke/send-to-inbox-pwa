const HTML = {
  createElement(name, attrs, ...children) {
    const element = document.createElement(name);
    for (const child of children) {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    }

    for (const [name, value] of Object.entries(attrs)) {
      switch (name) {
        case 'onclick':
          element.addEventListener('click', value);
          break;
        case 'oninput':
          element.addEventListener('input', value);
          break;
        default:
          element.setAttribute(name, value);
      }
    }

    return element;
  },

  updateNode(root) {
    return (newElement) => {
      root.replaceChildren();
      root.appendChild(newElement);
    };
  },
};

['div', 'button', 'fieldset', 'h1', 'input', 'label'].forEach((tagName) => {
  HTML[tagName] = (attrs, ...children) =>
    HTML.createElement(tagName, attrs, ...children);
});
