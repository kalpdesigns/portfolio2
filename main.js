/* ==========================================================================
   main.js — fills the page with text from content.js and adds interactions.
   You shouldn't need to edit this file to change words or images.
   ========================================================================== */
(function () {
  const C = window.CONTENT;

  // Soft gradients used wherever an image hasn't been added yet
  const GRADIENTS = [
    "linear-gradient(135deg, #f6d3c4 0%, #e9a8a0 50%, #8f6a9e 100%)",
    "linear-gradient(160deg, #cfe3f2 0%, #7fb0d8 55%, #3f6fa3 100%)",
    "linear-gradient(135deg, #fbe7b5 0%, #f2b872 50%, #d9774e 100%)",
    "linear-gradient(145deg, #e6eadf 0%, #b9c9b0 50%, #6f8f78 100%)",
    "linear-gradient(135deg, #e7def3 0%, #b8a3dc 50%, #6d5aa6 100%)",
    "linear-gradient(150deg, #f4e6dc 0%, #d9b8a2 50%, #9b7563 100%)",
    "linear-gradient(135deg, #dcefee 0%, #93cdc8 50%, #3f8b8a 100%)"
  ];
  const gradient = (i) => GRADIENTS[i % GRADIENTS.length];

  // Creates an <img>, or a gradient block if no image path is given
  function picture(src, alt, className, i) {
    if (src) {
      const img = document.createElement("img");
      img.src = src;
      img.alt = alt || "";
      img.loading = "lazy";
      img.decoding = "async";
      img.className = className;
      return img;
    }
    const div = document.createElement("div");
    div.className = className + " placeholder";
    div.style.setProperty("--grad", gradient(i));
    div.setAttribute("role", "img");
    div.setAttribute("aria-label", alt || "Image placeholder");
    return div;
  }

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  };

  /* ---------- Simple text: any element with data-content="path.to.text" ---------- */
  document.title = C.pageTitle;
  document.querySelector('meta[name="description"]').content = C.pageDescription;
  document.querySelectorAll("[data-content]").forEach((node) => {
    const value = node.dataset.content.split(".").reduce((obj, key) => obj && obj[key], C);
    if (value != null) node.textContent = value;
  });

  document.querySelector('meta[property="og:title"]').content = C.pageTitle;
  document.querySelector('meta[property="og:description"]').content = C.pageDescription;

  /* ---------- Landing: headline, and the three ideas on highlighter strokes ---------- */
  const headline = document.getElementById("landing-headline");
  // each line of the headline (\n in content.js) is its own line on screen
  C.landing.headline.split("\n").forEach((line, li) => {
    const row = el("span", "landing__line");
    line.split(/(\*[^*]+\*)/).forEach((part) => {
      if (!part) return;
      if (/^\*.*\*$/.test(part)) row.appendChild(el("em", null, part.slice(1, -1)));
      else row.appendChild(document.createTextNode(part));
    });
    headline.appendChild(row);
  });
  (function pillars() {
    const holder = document.getElementById("landing-pillars"), more = document.getElementById("landing-more");
    const list = C.landing.pillars || [];
    const tilts = [-1.2, .8, -.6];
    const marks = list.map((p, i) => {
      const b = el("button", "hl", p.text);
      b.type = "button";
      b.style.setProperty("--hl", p.color);
      b.style.setProperty("--i", i);
      b.style.setProperty("--tilt", tilts[i % tilts.length] + "deg");
      b.setAttribute("aria-describedby", "landing-more");
      return b;
    });
    // "Context first, System underneath & Craft on top."
    marks.forEach((m, i) => {
      holder.appendChild(m);
      if (i < marks.length - 2) holder.appendChild(el("span", "hl-sep", ","));
      else if (i === marks.length - 2) holder.appendChild(el("span", "hl-sep hl-sep--and", "&"));
    });
    holder.appendChild(el("span", "hl-sep hl-sep--end", "."));
    const show = (i) => {
      marks.forEach((m, j) => m.classList.toggle("is-on", j === i));
      if (i >= 0) more.textContent = list[i].more;
      more.classList.toggle("is-on", i >= 0);
    };
    marks.forEach((m, i) => {
      m.addEventListener("pointerenter", () => show(i));
      m.addEventListener("pointerleave", () => show(-1));
      m.addEventListener("focus", () => show(i));
      m.addEventListener("blur", () => show(-1));
      m.addEventListener("click", () => show(m.classList.contains("is-on") ? -1 : i));
    });
  })();

  /* ---------- Landing: pixel sky ----------
     Dithered blue clouds drift slowly around the edges; the middle stays clear for
     the words. Moving the pointer wipes pixels away and they slowly fill back in.
     Towards the bottom of the landing, and more and more as you scroll down, the
     pixels drop out one by one (dithered), so the sky dissolves rather than ending in a line. */
  (function pixelSky() {
    const cv = document.getElementById("landing-sky");
    if (!cv) return;
    const g = cv.getContext("2d");
    const sec = document.getElementById("home");
    const still = !document.documentElement.classList.contains("motion-ok");
    const CELL = 10;
    const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);
    const COLS = ["#e3f1fd", "#a9d6fb", "#5fb4fb", "#209dfc"];
    const hash = (x, y) => { const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return h - Math.floor(h); };
    const noise = (x, y) => {
      const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
      return hash(xi, yi) * (1 - u) * (1 - v) + hash(xi + 1, yi) * u * (1 - v) + hash(xi, yi + 1) * (1 - u) * v + hash(xi + 1, yi + 1) * u * v;
    };
    let W = 0, H = 0, cols = 0, rows = 0, clear = new Float32Array(0), drop = new Float32Array(0);
    function size() {
      W = cv.clientWidth; H = cv.clientHeight; cv.width = W; cv.height = H;
      cols = Math.ceil(W / CELL); rows = Math.ceil(H / CELL);
      clear = new Float32Array(cols * rows);
      // each pixel's own moment to drop out as the sky dissolves
      drop = new Float32Array(cols * rows).map((_, i) => hash(i % cols + 0.5, Math.floor(i / cols) + 0.5));
    }
    size();
    let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(size, 150); });
    sec.addEventListener("pointermove", (e) => {
      const r = cv.getBoundingClientRect(), cx = (e.clientX - r.left) / CELL, cy = (e.clientY - r.top) / CELL;
      for (let y = Math.max(0, cy - 7 | 0); y < Math.min(rows, cy + 7); y++) for (let x = Math.max(0, cx - 7 | 0); x < Math.min(cols, cx + 7); x++) {
        const d = Math.hypot(x - cx, y - cy);
        if (d < 6) clear[y * cols + x] = Math.max(clear[y * cols + x], 1 - d / 6);
      }
    });
    let onScreen = true;
    new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; }).observe(sec);
    let t = 0, last = 0, lastScroll = -1;
    function draw() {
      g.clearRect(0, 0, W, H);
      // how far the landing has scrolled away: 0 at the top, 1 once it's mostly gone
      const gone = Math.min(1, Math.max(0, scrollY / (H * 1.1)));   // slow: fully gone only once the landing has scrolled away
      for (let y = 0; y < rows; y++) {
        // near the bottom edge the pixels thin out, so the sky never ends in a hard line
        const fy = y / rows, bottom = fy > 0.7 ? (fy - 0.7) / 0.3 : 0;
        const thin = Math.min(1, bottom * bottom + gone * 1.05);
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          if (drop[i] < thin) continue;
          const nx = x / 26 + t, ny = y / 18;
          let v = noise(nx, ny) * 0.6 + noise(nx * 2.3 + 7, ny * 2.3) * 0.3 + noise(nx * 5, ny * 5 + 3) * 0.1;
          const dx = (x / cols - 0.5) / 0.62, dy = (fy - 0.45) / 0.55, center = Math.max(0, 1 - Math.hypot(dx, dy) ** 2);
          v = v * 1.15 - center * 2.4 - 0.16;
          clear[i] *= 0.985; v -= clear[i] * 1.2;
          if (v <= 0) continue;
          const level = Math.min(3, v * 5.2 + BAYER[(y % 4) * 4 + (x % 4)] - 0.5);
          if (level < 0) continue;
          g.fillStyle = COLS[Math.floor(level)];
          g.fillRect(x * CELL, y * CELL, CELL - 1, CELL - 1);
        }
      }
    }
    (function frame(now) {
      requestAnimationFrame(frame);
      if (!onScreen || document.hidden) return;
      const scrolled = scrollY !== lastScroll;
      if (!scrolled && (still || now - last < 70)) return;   // about 14 frames a second is plenty for drifting clouds
      if (!scrolled || now - last >= 70) { if (!still) t += 0.035; }
      last = now; lastScroll = scrollY;
      draw();
    })(0);
  })();

  /* ---------- Landing: Contact and Resume, which fly down into the bottom bar as you scroll ---------- */
  (function ctas() {
    const wrap = document.getElementById("landing-ctas");
    const nav = document.querySelector("nav.nav");
    if (!wrap || !nav) return;
    const navMail = nav.querySelector(".nav__item--mail");
    const navResume = nav.querySelector(".nav__item--resume");
    const ico = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
    const MAIL = ico('<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="m3.2 6.8 8.8 5.9 8.8-5.9"/>');
    const DOC = ico('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5M12 11.5v6M9.5 15l2.5 2.5 2.5-2.5"/>');
    wrap.innerHTML = `<span class="cta-wrap"><button class="cta" type="button" data-cta="contact" aria-label="Copy email address ${C.footer.email}">${MAIL}<span>${C.landing.contact}</span></button><span class="cta__tip" aria-live="polite">${C.footer.email}</span></span>
      <span class="cta-wrap"><a class="cta" data-cta="resume" href="${navResume ? navResume.getAttribute("href") : "#"}" target="_blank" rel="noopener">${DOC}<span>${C.landing.resume}</span></a></span>`;
    const contact = wrap.querySelector('[data-cta="contact"]'), resumeBtn = wrap.querySelector('[data-cta="resume"]');
    // they do exactly what the bar's buttons do
    contact.addEventListener("click", () => {
      navMail && navMail.click();
      const w = contact.parentNode, tip = w.querySelector(".cta__tip");
      tip.textContent = "Copied!"; w.classList.add("is-tip");
      clearTimeout(w._t); w._t = setTimeout(() => { w.classList.remove("is-tip"); setTimeout(() => (tip.textContent = C.footer.email), 200); }, 1600);
    });
    if (window.openAndDownload) window.openAndDownload(resumeBtn, C.nav.resumeFile);
    // Scrolling: each button flies to its place in the bar, shrinking to the bar's size,
    // while the bar (with Home and Work) fades in around them. Scrolling back up reverses it.
    const pairs = [[contact, navMail], [resumeBtn, navResume]].filter(([, n]) => n);
    const ghosts = pairs.map(([b]) => { const g = b.cloneNode(true); g.className = "cta cta--ghost"; g.removeAttribute("href"); g.setAttribute("aria-hidden", "true"); g.tabIndex = -1; g.style.opacity = 0; document.body.appendChild(g); return g; });
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    document.documentElement.classList.add("nav-docking");
    let ticking = false;
    function frame() {
      ticking = false;
      const t = clampN(scrollY / (innerHeight * 0.45));
      const k = ease(t), docked = t >= 1, home = t <= 0;
      document.documentElement.classList.toggle("is-docked", docked);
      nav.style.opacity = docked ? "" : Math.max(0, (k - 0.35) / 0.65).toFixed(3);
      pairs.forEach(([b, n], i) => {
        const g = ghosts[i];
        n.style.opacity = docked ? "" : 0;
        b.style.visibility = home ? "" : "hidden";
        if (home || docked) { g.style.opacity = 0; return; }
        const a = b.getBoundingClientRect(), z = n.getBoundingClientRect();
        Object.assign(g.style, {
          left: a.left + (z.left - a.left) * k + "px", top: a.top + (z.top - a.top) * k + "px",
          width: a.width + (z.width - a.width) * k + "px", height: a.height + (z.height - a.height) * k + "px",
          padding: `0 ${(15 * (1 - k)).toFixed(1)}px`, fontSize: (14 * (1 - k)).toFixed(2) + "px", opacity: 1,
        });
      });
    }
    const clampN = (v) => Math.min(1, Math.max(0, v));
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }, { passive: true });
    addEventListener("resize", frame);
    frame();
  })();

  /* ---------- About: polaroids for the depth carousel (positions set by the About motion below) ---------- */
  const pile = document.getElementById("polaroids");
  const photos = C.about.polaroids;
  const mainIndex = Math.max(0, photos.findIndex((p) => p.main));
  // The carousel needs plenty of cards to fill both sides, so photos repeat if there are few
  const CARD_COUNT = Math.max(photos.length, 16);
  const cards = [];
  for (let i = 0; i < CARD_COUNT; i++) {
    const p = photos[i % photos.length];
    const card = el("figure", "polaroid dcard");
    if (i >= photos.length) card.setAttribute("aria-hidden", "true");
    const photo = el("span", "polaroid__photo");
    photo.appendChild(picture(p.image, p.caption, "polaroid__img", i % photos.length));
    card.appendChild(photo);
    pile.appendChild(card);
    cards.push(card);
  }

  /* ---------- Work: project list + large image ---------- */
  const list = document.getElementById("work-list");
  const media = document.getElementById("work-media");

  C.work.projects.forEach((project, i) => {
    const item = el("li", "project");
    const toggle = el("button", "project__toggle");
    toggle.type = "button";

    const tags = el("ul", "project__tags");
    project.tags.forEach((t) => tags.appendChild(el("li", null, t)));
    const tagsWrap = el("div", "project__tags-wrap");   // lets the tags slide open smoothly
    tagsWrap.appendChild(tags);
    toggle.appendChild(tagsWrap);
    toggle.appendChild(el("h3", "project__title", project.title));

    const details = el("div", "project__details");
    const inner = el("div", "project__details-inner");
    details.appendChild(inner);
    inner.appendChild(picture(project.image, project.title, "project__mobile-img", i + 2));
    inner.appendChild(el("p", "project__desc", project.description));

    const metrics = el("div", "project__metrics");
    project.metrics.forEach((m) => {
      const box = el("div");
      box.appendChild(el("div", "project__metric-value", m.value));
      box.appendChild(el("div", "project__metric-label", m.label));
      metrics.appendChild(box);
    });
    inner.appendChild(metrics);

    // On desktop this link is hidden (the cursor label replaces it); it stays
    // for keyboard users and shows on phones, where there's no hover
    const link = el("a", "project__link", C.work.viewLabel + " →");
    link.href = caseUrl(project);
    inner.appendChild(link);

    item.append(toggle, details);
    list.appendChild(item);

    media.appendChild(picture(project.image, project.title, "work__media-item", i + 2));

    // Open project: clicking its text opens the case study. Closed project: opens it in the list.
    item.addEventListener("click", (e) => {
      if (e.target.closest("a")) return;
      if (i === activeIndex) location.href = caseUrl(project);
      else if (e.target.closest(".project__toggle")) goToProject(i);
    });
  });
  media.addEventListener("click", () => { location.href = caseUrl(C.work.projects[activeIndex]); });

  function caseUrl(project) { return "project.html?p=" + encodeURIComponent(project.id); }

  /* ---------- "View case study" label that follows the cursor ---------- */
  const cursorLabel = el("div", "cursor-label");
  cursorLabel.appendChild(el("span", null, C.work.viewLabel));
  cursorLabel.setAttribute("aria-hidden", "true");
  document.body.appendChild(cursorLabel);
  let refreshCursorLabel = () => {};   // re-checks the label after the open project changes
  if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
    // A frosted-glass label that sits right on the pointer
    let cx = 0, cy = 0, labelFrame = null;
    const place = () => { labelFrame = null; cursorLabel.style.transform = `translate(${cx}px, ${cy}px)`; };
    document.querySelector(".work").addEventListener("pointermove", (e) => {
      cx = e.clientX; cy = e.clientY;
      const over = e.target.closest(".project.is-active, .work__media");
      cursorLabel.classList.toggle("is-visible", !!over);
      if (!labelFrame) labelFrame = requestAnimationFrame(place);
    });
    document.querySelector(".work").addEventListener("pointerleave", () => cursorLabel.classList.remove("is-visible"));
    // Scrolling can swap which project is open under a still cursor
    refreshCursorLabel = () => {
      const over = document.elementFromPoint(cx, cy);
      cursorLabel.classList.toggle("is-visible", !!(over && over.closest(".project.is-active, .work__media")));
    };
    window.addEventListener("scroll", refreshCursorLabel, { passive: true });
  }

  /* Opening and closing. Every project's open state is made exactly the same
     height (shorter ones get a little extra space at the bottom), so the list,
     and the image beside it, never change size. The closing and opening parts
     move by the same amount at the same speed, so the total stays constant. */
  const projectEls = [...list.querySelectorAll(".project")];
  let openSize = [];   // per project: [tags height, details height] when open

  function measureProjects() {
    // Measure the contents themselves (not the panels, which may hold extra space)
    const natural = projectEls.map((p) => [
      p.querySelector(".project__tags").offsetHeight,
      p.querySelector(".project__details-inner").offsetHeight
    ]);
    const tallest = Math.max(...natural.map(([t, d]) => t + d));
    openSize = natural.map(([t, d]) => [t, d + (tallest - t - d)]);
  }

  // Glide a panel from wherever it is now to its target height
  function slide(panel, target, animate) {
    if (!animate) { panel.style.transition = "none"; panel.style.height = target + "px"; panel.offsetHeight; panel.style.transition = ""; return; }
    panel.style.height = target + "px";
  }

  let activeIndex = -1;
  function setActive(index, animate = true) {
    if (index === activeIndex && animate) return;
    activeIndex = index;
    projectEls.forEach((p, i) => {
      const open = i === index;
      p.classList.toggle("is-active", open);
      p.querySelector(".project__toggle").setAttribute("aria-expanded", open);
      slide(p.querySelector(".project__tags-wrap"), open ? openSize[i][0] : 0, animate);
      slide(p.querySelector(".project__details"), open ? openSize[i][1] : 0, animate);
    });
    media.querySelectorAll(".work__media-item").forEach((m, i) => m.classList.toggle("is-active", i === index));
    refreshCursorLabel();
    // Check again once the switch has finished moving things under the cursor
    clearTimeout(setActive.recheck);
    setActive.recheck = setTimeout(refreshCursorLabel, 850);
  }
  function remeasureProjects() { measureProjects(); setActive(activeIndex, false); }

  measureProjects();
  setActive(0, false);

  /* ---------- Logo strip (items doubled so the loop is seamless) ---------- */
  const track = document.getElementById("logo-track");
  [0, 1].forEach((copy) => {
    C.logos.items.forEach((logo) => {
      const item = el("div", "logo");
      if (copy) item.setAttribute("aria-hidden", "true");
      if (logo.logo) {
        const img = document.createElement("img");
        img.src = logo.logo;
        img.alt = copy ? "" : logo.name;
        img.loading = "lazy";
        // Wide logos sit lower, square ones taller, so every logo looks about the same size
        img.onload = () => {
          const ratio = img.naturalWidth / img.naturalHeight;
          img.style.height = Math.round(Math.min(34, Math.max(14, Math.sqrt(1700 / ratio))) * (logo.scale || 1)) + "px";
        };
        item.appendChild(img);
      } else {
        item.textContent = logo.name;
      }
      track.appendChild(item);
    });
  });

  let resizeTimer;
  document.fonts && document.fonts.ready.then(() => { remeasureProjects(); });

  /* ==========================================================================
     Scroll motion. Everything below only moves things with transform and
     opacity (cheap for the browser), and only runs while it's on screen.
     ========================================================================== */
  const motionOK = document.documentElement.classList.contains("motion-ok");
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const smooth = (v) => { v = clamp(v, 0, 1); return v * v * (3 - 2 * v); };
  const mix = (a, b, t) => a + (b - a) * t;

  // How far (0 → 1) we've scrolled through a tall, pinned section
  function progress(section) {
    const r = section.getBoundingClientRect();
    const distance = r.height - window.innerHeight;
    return distance > 0 ? clamp(-r.top / distance, 0, 1) : 1;
  }

  /* ---------- About: depth carousel + text that steps on with each scroll ---------- */
  // The stage stays pinned while you scroll through the (tall) section.
  // 0–25%: the opening sentence · then each quarter brings in the next item.
  // The polaroids drift slowly on their own, and scrolling pushes them along too.
  const about = document.getElementById("about");
  const stage = about.querySelector(".about__stage");
  const stepsEl = document.getElementById("about-steps");
  const dotsEl = document.getElementById("about-dots");
  const STEPS = C.about.steps || [];
  const stepEls = STEPS.map((t) => stepsEl.appendChild(el("span", "about__step", t)));
  const dotEls = STEPS.map(() => dotsEl.appendChild(el("i")));
  let step = -1;
  function showStep(n) {
    if (n === step) return;
    step = n;
    stepEls.forEach((s, i) => { s.classList.toggle("is-on", i === n); s.classList.toggle("is-past", i < n); });
    dotEls.forEach((d, i) => d.classList.toggle("is-on", i <= n));
  }
  const DRIFT = 0.2;            // cards per second when left alone
  const SCRUB = 4;              // cards the carousel travels across the whole section
  let drift = 0, aboutVisible = false, aboutFrame = null, lastTime = 0;

  // Depth carousel, laid out like the reference: the middle photo faces you; each step out
  // sits 0.64 of a card further along, 200px deeper and turned another 35° (up to 90°),
  // so the far ones stack up edge-on. The container's perspective scales with the card.
  function renderAbout(p) {
    showStep(Math.min(STEPS.length - 1, Math.floor(p * (STEPS.length + 1)) - 1));
    const n = cards.length;
    const W = cards[0].offsetWidth, k = W / 450;
    pile.style.perspective = (550 * k).toFixed(0) + "px";
    const offset = mainIndex + drift + p * SCRUB;
    cards.forEach((card, i) => {
      let d = (i - offset) % n;
      if (d > n / 2) d -= n;
      if (d < -n / 2) d += n;
      const a = Math.abs(d), sgn = Math.sign(d);
      // spaced out a little more than the reference, so the prints have room
      const x = sgn * (Math.min(a, 1) * 520 + Math.max(0, a - 1) * 360) * k;
      const z = -200 * a * k;
      const rot = sgn * Math.min(a * 35, 90);
      // the ones wrapping round from one end to the other fade out on the way
      const fade = a > n / 2 - 1 ? Math.max(0, n / 2 - a) : 1;
      card.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(1)}px, 0, ${z.toFixed(1)}px) rotateY(${rot.toFixed(2)}deg)`;
      card.style.opacity = fade.toFixed(3);
      card.style.zIndex = 1000 - Math.round(a * 10);
    });
  }

  function aboutTick(time) {
    const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
    lastTime = time;
    if (motionOK) drift += DRIFT * dt;
    renderAbout(progress(about));
    aboutFrame = aboutVisible ? requestAnimationFrame(aboutTick) : null;
  }
  function measureAbout() {}
  const entered = () => progress(about);

  renderAbout(progress(about));
  new IntersectionObserver(([entry]) => {
    aboutVisible = entry.isIntersecting;
    if (aboutVisible && !aboutFrame) { lastTime = 0; aboutFrame = requestAnimationFrame(aboutTick); }
  }).observe(about);

  /* ---------- Work: on desktop, scrolling steps through the projects ---------- */
  const work = document.getElementById("work");
  const count = C.work.projects.length;
  const desktop = matchMedia("(min-width: 821px)");
  work.style.setProperty("--count", count);
  const workPinned = () => motionOK && desktop.matches;

  // While a click is scrolling the page to a project, ignore the projects it passes
  let clickLock = false, unlockTimer;
  function releaseSoon(delay) {
    clearTimeout(unlockTimer);
    unlockTimer = setTimeout(() => { clickLock = false; onWorkScroll(); }, delay);
  }

  function onWorkScroll() {
    if (!workPinned()) return;
    if (clickLock) return releaseSoon(160); // still scrolling: wait until it stops
    setActive(Math.min(count - 1, Math.floor(progress(work) * count)));
  }

  // Clicking a title opens it straight away, then scrolls to its spot so scroll and clicks agree
  function goToProject(index) {
    setActive(index);
    if (!workPinned()) return;
    const distance = work.offsetHeight - window.innerHeight;
    const top = work.getBoundingClientRect().top + window.scrollY + distance * (index + 0.5) / count;
    clickLock = true;
    releaseSoon(400);
    window.scrollTo({ top, behavior: "smooth" });
  }

  let scrollQueued = false;
  window.addEventListener("scroll", () => {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(() => { scrollQueued = false; onWorkScroll(); });
  }, { passive: true });

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { measureAbout(); renderAbout(progress(about)); remeasureProjects(); onWorkScroll(); }, 150);
  });
  onWorkScroll();

  /* ---------- Gentle fade-up for anything marked data-reveal ---------- */
  if (motionOK) {
    const revealer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); revealer.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll("[data-reveal]").forEach((node) => revealer.observe(node));
  }
})();
