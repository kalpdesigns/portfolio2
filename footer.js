/* ==========================================================================
   footer.js — the footer bits shared by every page: the heading text, and the
   credits line on either side of the bottom bar
   ("© 2026 Kalpesh Bhavsar" · "Designed with (Figma), built with (Claude Code)").
   The typewriter itself is typewriter.js.
   ========================================================================== */
(function () {
  const C = window.CONTENT;
  if (!C) return;
  const footer = document.getElementById("contact");
  if (!footer) return;
  footer.querySelectorAll("[data-content]").forEach((node) => {
    const value = node.dataset.content.split(".").reduce((o, k) => o && o[k], C);
    if (value != null && !node.textContent) node.textContent = value;
  });

  /* ---------- Footer: "Designed with (Figma), built with (Claude Code)" ---------- */
  const LOGOS = {
    figma: '<svg class="footer__logo" viewBox="0 0 38 57" role="img" aria-label="Figma"><title>Figma</title><path fill="#1abcfe" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0Z"/><path fill="#0acf83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0Z"/><path fill="#ff7262" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19Z"/><path fill="#f24e1e" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5Z"/><path fill="#a259ff" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5Z"/></svg>',
    claude: '<svg class="footer__logo" viewBox="-12 -12 24 24" role="img" aria-label="Claude Code"><title>Claude Code</title><g fill="#d97757">' +
      Array.from({ length: 12 }, (_, i) => `<rect x="-1.1" y="-11" width="2.2" height="${i % 2 ? 8.5 : 10.5}" rx="1.1" transform="rotate(${i * 30})"/>`).join("") +
      '<circle r="3"/></g></svg>'
  };
  // Phones get a simple footer for now (the typewriter is hidden there): email, LinkedIn, Resume
  const simple = document.createElement("div");
  simple.className = "footer__simple";
  const mail = document.createElement("a");
  mail.className = "footer__simple-mail"; mail.href = "mailto:" + C.footer.email; mail.textContent = C.footer.email;
  const links = document.createElement("div");
  links.className = "footer__simple-links";
  (C.footer.links || []).forEach((l) => {
    const a = document.createElement("a");
    a.textContent = l.label; a.href = l.url;
    if (/\.pdf$/i.test(l.url) && window.openAndDownload) window.openAndDownload(a, l.url);
    else { a.target = "_blank"; a.rel = "noopener"; }
    links.appendChild(a);
  });
  simple.append(mail, links);
  const tw = document.getElementById("typewriter");
  if (tw) tw.after(simple);

  const made = document.getElementById("footer-made");
  if (made && C.footer.madeWith) made.innerHTML = C.footer.madeWith.replace(/[<&]/g, "").replace(/\{(\w+)\}/g, (_, k) => LOGOS[k] || "");

})();
