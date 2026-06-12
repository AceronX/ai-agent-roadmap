(function () {
  function initializeMermaid() {
    if (!window.mermaid || typeof window.mermaid.initialize !== "function") {
      return;
    }

    window.mermaid.initialize({
      startOnLoad: false,
      securityLevel: "loose",
      theme: document.documentElement.getAttribute("data-md-color-scheme") === "slate" ? "dark" : "default",
    });
  }

  async function renderMermaidDiagrams() {
    if (!window.mermaid || typeof window.mermaid.run !== "function") {
      return;
    }

    const diagrams = document.querySelectorAll(".md-typeset .mermaid");
    if (!diagrams.length) {
      return;
    }

    diagrams.forEach(function (diagram) {
      if (diagram.dataset.mermaidRendered === "true") {
        return;
      }

      diagram.removeAttribute("data-processed");
      diagram.dataset.mermaidRendered = "true";
    });

    try {
      await window.mermaid.run({
        querySelector: ".md-typeset .mermaid:not([data-processed])",
      });
    } catch (error) {
      console.error("Mermaid render failed:", error);
    }
  }

  function setupMermaid() {
    initializeMermaid();
    renderMermaidDiagrams();
  }

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(setupMermaid);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupMermaid);
  } else {
    setupMermaid();
  }
})();
