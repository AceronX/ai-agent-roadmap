(function () {
  const diagramSelector = ".md-typeset .mermaid";
  const wrapperClass = "diagram-viewer";
  const sourceCache = new Map();
  let modal;
  let observer;
  let renderCount = 0;

  function ensureModal() {
    if (modal) {
      return modal;
    }

    modal = document.createElement("div");
    modal.className = "diagram-modal";
    modal.setAttribute("hidden", "");
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Expanded diagram");
    modal.innerHTML = [
      '<div class="diagram-modal__backdrop" data-diagram-close></div>',
      '<div class="diagram-modal__panel">',
      '<div class="diagram-modal__bar">',
      '<strong class="diagram-modal__title">Diagram</strong>',
      '<button class="diagram-modal__close" type="button" data-diagram-close aria-label="Close expanded diagram">Close</button>',
      "</div>",
      '<div class="diagram-modal__body"></div>',
      "</div>",
    ].join("");

    modal.addEventListener("click", function (event) {
      if (event.target.closest("[data-diagram-close]")) {
        closeModal();
      }
    });

    document.body.appendChild(modal);
    return modal;
  }

  function currentPageUrl() {
    const url = new URL(window.location.href);
    url.hash = "";
    return url.toString();
  }

  async function getPageDiagramSources() {
    const url = currentPageUrl();
    if (sourceCache.has(url)) {
      return sourceCache.get(url);
    }

    const response = await fetch(url, { credentials: "same-origin" });
    const html = await response.text();
    const page = new DOMParser().parseFromString(html, "text/html");
    const sources = Array.from(page.querySelectorAll(diagramSelector)).map(function (diagram) {
      return diagram.textContent.trim();
    });

    sourceCache.set(url, sources);
    return sources;
  }

  async function renderDiagramSource(source) {
    if (!source) {
      return '<p class="diagram-modal__empty">Diagram source was not found.</p>';
    }

    if (!window.mermaid || typeof window.mermaid.render !== "function") {
      return '<pre class="diagram-modal__source"><code></code></pre>';
    }

    const id = "diagram_modal_" + Date.now() + "_" + renderCount++;
    const result = await window.mermaid.render(id, source);
    return result.svg;
  }

  async function openModal(diagram) {
    const modalElement = ensureModal();
    const body = modalElement.querySelector(".diagram-modal__body");
    const index = Number(diagram.closest("." + wrapperClass).dataset.diagramIndex || 0);

    body.innerHTML = '<div class="diagram-modal__loading">Loading diagram...</div>';
    modalElement.removeAttribute("hidden");
    document.documentElement.classList.add("diagram-modal-open");

    const closeButton = modalElement.querySelector(".diagram-modal__close");
    if (closeButton) {
      closeButton.focus();
    }

    try {
      const sources = await getPageDiagramSources();
      const source = sources[index] || "";
      const html = await renderDiagramSource(source);
      body.innerHTML = '<div class="diagram-modal__diagram">' + html + "</div>";

      const sourceFallback = body.querySelector(".diagram-modal__source code");
      if (sourceFallback) {
        sourceFallback.textContent = source;
      }
    } catch (error) {
      body.innerHTML = '<p class="diagram-modal__empty">Diagram could not be expanded. Please reload the page and try again.</p>';
      console.error("Diagram viewer failed:", error);
    }
  }

  function closeModal() {
    if (!modal) {
      return;
    }

    modal.setAttribute("hidden", "");
    document.documentElement.classList.remove("diagram-modal-open");
    const body = modal.querySelector(".diagram-modal__body");
    if (body) {
      body.replaceChildren();
    }
  }

  function enhanceDiagram(diagram, index) {
    if (diagram.closest(".diagram-modal")) {
      return;
    }

    if (diagram.parentElement && diagram.parentElement.classList.contains(wrapperClass)) {
      diagram.parentElement.dataset.diagramIndex = String(index);
      return;
    }

    const wrapper = document.createElement("div");
    wrapper.className = wrapperClass;
    wrapper.dataset.diagramIndex = String(index);
    diagram.parentNode.insertBefore(wrapper, diagram);
    wrapper.appendChild(diagram);

    const button = document.createElement("button");
    button.className = "diagram-viewer__button";
    button.type = "button";
    button.setAttribute("aria-label", "Maximize diagram");
    button.setAttribute("title", "Maximize diagram");
    button.innerHTML = [
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">',
      '<path d="M5 5h6v2H8.41l3.3 3.29-1.42 1.42L7 8.41V11H5V5Zm8 0h6v6h-2V8.41l-3.29 3.3-1.42-1.42L15.59 7H13V5ZM10.29 12.29l1.42 1.42L8.41 17H11v2H5v-6h2v2.59l3.29-3.3ZM17 15.59V13h2v6h-6v-2h2.59l-3.3-3.29 1.42-1.42 3.29 3.3Z"></path>',
      "</svg>",
    ].join("");
    button.addEventListener("click", function () {
      const currentDiagram = wrapper.querySelector(".mermaid");
      if (currentDiagram) {
        openModal(currentDiagram);
      }
    });

    wrapper.appendChild(button);
  }

  function enhanceAllDiagrams() {
    document.querySelectorAll(diagramSelector).forEach(enhanceDiagram);
  }

  function observeRenderedDiagrams() {
    if (observer) {
      observer.disconnect();
    }

    const root = document.querySelector(".md-content") || document.body;
    observer = new MutationObserver(function () {
      enhanceAllDiagrams();
    });
    observer.observe(root, { childList: true, subtree: true });
  }

  function scheduleEnhancement() {
    enhanceAllDiagrams();
    observeRenderedDiagrams();
    window.setTimeout(enhanceAllDiagrams, 250);
    window.setTimeout(enhanceAllDiagrams, 800);
    window.setTimeout(enhanceAllDiagrams, 1600);
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeModal();
    }
  });

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(scheduleEnhancement);
    scheduleEnhancement();
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleEnhancement);
  } else {
    scheduleEnhancement();
  }
})();
