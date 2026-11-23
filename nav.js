/* ==========================================================================
   nav.js — the bottom bar, on every page: Home · Work · Mail · Resume.
   When you reach the footer it opens up: each button shows its name, and
   LinkedIn slides in at the end.

   - Hover any button for a small black label above it.
   - Mail: the label shows the email address and the icon turns into "copy".
     Clicking copies the address (then shows "Copied").
   - Resume: opens the resume in a new tab and downloads it at the same time.
   ========================================================================== */
(function () {
  const nav = document.querySelector("nav.nav");
  if (!nav || !window.CONTENT) return;
  const C = window.CONTENT;
  const onCase = document.body.classList.contains("case-page");
  const home = onCase ? "index.html#home" : "#home";
  const work = onCase ? "index.html#work" : "#work";
  const email = C.footer.email;
  const resume = C.nav.resumeFile;

  const icon = (paths, cls) => `<svg class="${cls || ""}" viewBox="0 0 24 24" aria-hidden="true">${paths}</svg>`;
  const ICONS = {
    home: icon('<path d="M3 10.2a2 2 0 0 1 .71-1.53l7-5.96a2 2 0 0 1 2.58 0l7 5.96A2 2 0 0 1 21 10.2V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M9.5 21v-6.4a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1V21"/>'),
    work: icon('<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8.5 7V5.5a1.5 1.5 0 0 1 1.5-1.5h4a1.5 1.5 0 0 1 1.5 1.5V7M3 12.5h18"/>'),
    mail: icon('<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="m3.2 6.8 8.8 5.9 8.8-5.9"/>', "nav__icon nav__icon--mail"),
    copy: icon('<rect x="9" y="9" width="12.5" height="12.5" rx="2.5"/><path d="M5 15H4.5A2 2 0 0 1 2.5 13V4.5a2 2 0 0 1 2-2H13a2 2 0 0 1 2 2V5"/>', "nav__icon nav__icon--copy"),
    check: icon('<path d="m5 12.5 4.5 4.5L19 7.5"/>', "nav__icon nav__icon--check"),
    linkedin: icon('<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10.5V16M8 7.6v.1M11.5 16v-3.2a2.3 2.3 0 0 1 4.6 0V16M11.5 10.5V16"/>'),
    resume: icon('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5M12 11.5v6M9.5 15l2.5 2.5 2.5-2.5"/>'),
  };

  const linkedin = C.nav.linkedin || ((C.footer.links || []).find((l) => /linkedin/i.test(l.label)) || {}).url;
  const item = (cls, attrs, ico, label, tip) =>
    `<${attrs.href ? "a" : "button"} class="nav__item ${cls}" ${attrs.href ? `href="${attrs.href}"` : 'type="button"'} ${attrs.extra || ""}>` +
    `<span class="nav__ico">${ico}</span><span class="nav__label">${label}</span><span class="nav__tip"${tip.live ? ' aria-live="polite"' : ""}>${tip.text}</span>` +
    `</${attrs.href ? "a" : "button"}>`;
  nav.innerHTML =
    item("", { href: home, extra: `aria-label="${C.nav.home}"` }, ICONS.home, C.nav.home, { text: C.nav.home }) +
    `<span class="nav__sep" aria-hidden="true"></span>` +
    item("", { href: work, extra: `aria-label="${C.nav.work}"` }, ICONS.work, C.nav.work, { text: C.nav.work }) +
    item("nav__item--mail", { extra: `aria-label="Copy email address ${email}"` }, ICONS.mail + ICONS.copy + ICONS.check, "Email", { text: email, live: true }) +
    item("nav__item--resume", { href: resume, extra: `target="_blank" rel="noopener" aria-label="${C.nav.resume} (opens in a new tab and downloads)"` }, ICONS.resume, C.nav.resume, { text: C.nav.resume }) +
    (linkedin ? item("nav__item--extra", { href: linkedin, extra: 'target="_blank" rel="noopener" aria-label="LinkedIn (opens in a new tab)"' }, ICONS.linkedin, "LinkedIn", { text: "LinkedIn" }) : "");

  /* ---------- Links to parts of the page scroll there without changing the address ----------
     (so a copied link always opens at the top, not halfway down the page) */
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const id = a.getAttribute("href").slice(1);
    const target = id ? document.getElementById(id) : null;
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  });
  // arriving from a case study (index.html#work): the browser scrolls there; then the #work is taken out of the address
  if (location.hash && !onCase) addEventListener("load", () => setTimeout(() => history.replaceState(null, "", location.pathname + location.search), 50));

  /* ---------- A blue pill glides to the button you point at ---------- */
  const pill = document.createElement("span");
  pill.className = "nav__pill";
  pill.setAttribute("aria-hidden", "true");
  nav.prepend(pill);
  const items = [...nav.querySelectorAll(".nav__item")];
  let hot = null;
  const movePill = () => {
    if (!hot) return;
    pill.style.width = hot.offsetWidth + "px";
    pill.style.transform = `translateX(${hot.offsetLeft}px)`;
  };
  items.forEach((it) => {
    const on = () => {
      if (hot) hot.classList.remove("is-hot");
      hot = it; it.classList.add("is-hot");
      if (!pill.classList.contains("is-on")) { pill.style.transition = "none"; movePill(); void pill.offsetWidth; pill.style.transition = ""; }
      movePill(); pill.classList.add("is-on");
    };
    it.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") on(); });
    it.addEventListener("focus", on);
  });
  const off = () => { if (hot) hot.classList.remove("is-hot"); hot = null; pill.classList.remove("is-on"); };
  nav.addEventListener("pointerleave", off);
  nav.addEventListener("focusout", (e) => { if (!nav.contains(e.relatedTarget)) off(); });
  // the bar changes width when it opens up at the footer, so keep the pill on its button
  nav.addEventListener("transitionend", movePill);

  /* ---------- A small dot marks the section you're in ---------- */
  const homeItem = items[0], workItem = items[1];
  const workSection = document.getElementById("work");
  if (!onCase && workSection && "IntersectionObserver" in window) {
    const mark = (inWork) => { homeItem.classList.toggle("is-current", !inWork); workItem.classList.toggle("is-current", inWork); };
    mark(false);
    new IntersectionObserver((entries) => mark(entries[0].isIntersecting), { rootMargin: "-45% 0px -45% 0px" }).observe(workSection);
  } else if (onCase) workItem.classList.add("is-current");

  /* ---------- At the footer the bar opens up: labels, plus LinkedIn ---------- */
  const footer = document.querySelector("footer.footer");
  if (footer && "IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      nav.classList.toggle("is-expanded", entries[0].isIntersecting);
    }, { rootMargin: "0px 0px -30% 0px" }).observe(footer);
  }

  /* ---------- Mail: copy the address ---------- */
  const mail = nav.querySelector(".nav__item--mail");
  const mailTip = mail.querySelector(".nav__tip");
  let resetT;
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch (e) {
      // older browsers / plain file links
      const t = document.createElement("textarea");
      t.value = text; t.setAttribute("readonly", ""); t.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(t); t.select();
      const ok = document.execCommand("copy"); t.remove(); return ok;
    }
  }
  mail.addEventListener("click", async () => {
    const ok = await copy(email);
    mailTip.textContent = ok ? "Copied!" : email;
    mail.classList.add("is-copied", "is-tip");
    clearTimeout(resetT);
    resetT = setTimeout(() => {
      mail.classList.remove("is-copied", "is-tip");
      setTimeout(() => { mailTip.textContent = email; }, 200);
    }, 1600);
  });

  /* ---------- Resume: downloads straight away, and opens in a new tab ---------- */
  const resumeLink = nav.querySelector(".nav__item--resume");
  const fileName = (url) => decodeURIComponent(url.split("/").pop().split("?")[0]) || "resume.pdf";
  function downloadUrl(url) {
    const drive = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
    return drive ? `https://drive.google.com/uc?export=download&id=${drive[1]}` : url;
  }
  async function startDownload(url) {
    if (!url || url === "#") return;
    const dl = downloadUrl(url);
    const save = (href) => {
      const a = document.createElement("a");
      a.href = href; a.download = fileName(dl); a.style.display = "none";
      document.body.appendChild(a); a.click(); a.remove();
    };
    if (/^https?:/.test(dl) && !dl.startsWith(location.origin)) {
      // another site's file: a hidden frame fetches it so the browser downloads it
      const f = document.createElement("iframe");
      f.style.display = "none"; f.src = dl;
      document.body.appendChild(f);
      setTimeout(() => f.remove(), 60000);
      return;
    }
    // our own file: fetch it and hand it over as a download, so it always saves rather than opening
    try {
      const res = await fetch(dl);
      if (!res.ok) throw new Error(res.status);
      const blob = await res.blob();
      const href = URL.createObjectURL(blob);
      save(href);
      setTimeout(() => URL.revokeObjectURL(href), 30000);
    } catch (e) { save(dl); }
  }

  // The resume opens in a new tab, in a viewer page laid out like a Google Drive preview (resume.html)
  const prefix = resume.startsWith("../") ? "../" : "";
  const viewer = prefix + "resume.html";

  // shared with the footer's and case pages' Resume links (main.js, case.js)
  window.openAndDownload = (link, url) => {
    link.href = viewer; link.target = "_blank"; link.rel = "noopener";
    link.addEventListener("click", () => startDownload(url));   // the new tab opens as normal; the file downloads too
  };
  window.openAndDownload(resumeLink, resume);
})();
