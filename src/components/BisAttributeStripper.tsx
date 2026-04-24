"use client";

if (typeof window !== "undefined") {
  const attributeName = "bis_skin_checked";

  const stripAttribute = (root: Element | Document) => {
    if (!(root instanceof Element || root instanceof Document)) {
      return;
    }

    if (root instanceof Element && root.hasAttribute(attributeName)) {
      root.removeAttribute(attributeName);
    }

    root
      .querySelectorAll?.(`[${attributeName}]`)
      .forEach((element) => element.removeAttribute(attributeName));
  };

  stripAttribute(document);

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "attributes" && mutation.target instanceof Element) {
        if (mutation.target.hasAttribute(attributeName)) {
          mutation.target.removeAttribute(attributeName);
        }
      }

      for (const node of mutation.addedNodes) {
        if (node instanceof Element || node instanceof Document) {
          stripAttribute(node);
        }
      }
    }
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: [attributeName],
    childList: true,
    subtree: true,
  });

  window.addEventListener("load", () => observer.disconnect(), { once: true });
}

export default function BisAttributeStripper() {
  return null;
}
