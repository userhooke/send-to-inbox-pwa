function createElement(name, attrs, children) {
  const element = document.createElement(name);

  if (
    Array.isArray(attrs) ||
    typeof attrs === "string" ||
    typeof attrs === "number" ||
    attrs instanceof HTMLElement
  ) {
    children = attrs;
    attrs = {};
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

  processChildren(element, children);

  element.update = (newChildren) => {
    element.replaceChildren();
    processChildren(element, newChildren);
  }

  return element;
}

function processChildren(element, children) {
  if (Array.isArray(children)) {
    return children.map(child => processChildren(element, child));
  }

  if (typeof children === "string" || typeof children === "number") {
    element.appendChild(document.createTextNode(children));
  } else if (children instanceof HTMLElement) {
    element.appendChild(children);
  } else if (children) {
    throw new Error(`Unsupported child: ${children}`);
  }
}

export const div = (attrs, children) => createElement("div", attrs, children);
export const button = (attrs, children) => createElement("button", attrs, children);
export const fieldset = (attrs, children) => createElement("fieldset", attrs, children);
export const h1 = (attrs, children) => createElement("h1", attrs, children);
export const input = (attrs, children) => createElement("input", attrs, children);
export const textarea = (attrs, children) => createElement("textarea", attrs, children);
export const label = (attrs, children) => createElement("label", attrs, children);
export const h2 = (attrs, children) => createElement("h2", attrs, children);
export const p = (attrs, children) => createElement("p", attrs, children);

