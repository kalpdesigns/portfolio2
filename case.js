/* ==========================================================================
   case.js — builds a case study page from content.js.
   The page address says which project to show, e.g. project.html?p=india-art-fair
   You shouldn't need to edit this file to change words or images.
   ========================================================================== */
(function () {
  const C = window.CONTENT;
  const CS = C.caseStudy;
  const projects = C.work.projects;
  const id = new URLSearchParams(location.search).get("p");
  const index = Math.max(0, projects.findIndex((p) => p.id === id));
  const project = projects[index];
  const study = CS.studies[project.id];

  const GRADIENTS = [
    "linear-gradient(135deg, #fbe7b5 0%, #f2b872 50%, #d9774e 100%)",
    "linear-gradient(145deg, #e6eadf 0%, #b9c9b0 50%, #6f8f78 100%)",
    "linear-gradient(135deg, #e7def3 0%, #b8a3dc 50%, #6d5aa6 100%)",
    "linear-gradient(160deg, #cfe3f2 0%, #7fb0d8 55%, #3f6fa3 100%)",
    "linear-gradient(135deg, #f6d3c4 0%, #e9a8a0 50%, #8f6a9e 100%)",
    "linear-gradient(135deg, #dcefee 0%, #93cdc8 50%, #3f8b8a 100%)"
  ];
  let imageCount = index;

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  };

  // Turns *italic*, **bold** and ***bold italic*** into real formatting (safely, no HTML)
  function rich(tag, className, text) {
    const node = el(tag, className);
    text.split(/(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*)/).forEach((part) => {
      if (!part) return;
      if (part.startsWith("***")) {
        const b = el("strong"); b.appendChild(el("em", null, part.slice(3, -3))); node.appendChild(b);
      } else if (part.startsWith("**")) node.appendChild(el("strong", null, part.slice(2, -2)));
      else if (part.startsWith("*")) node.appendChild(el("em", null, part.slice(1, -1)));
      else node.appendChild(document.createTextNode(part));
    });
    return node;
  }

  // Clips (.mp4) play like GIFs: silent, looping, and only while on screen, so they
  // cost nothing until someone scrolls to them. "controls: true" adds play/sound buttons.
  const clipWatcher = "IntersectionObserver" in window && new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const v = e.target;
      if (e.isIntersecting) { if (v.preload !== "auto") v.preload = "auto"; if (!v.dataset.paused) v.play().catch(() => {}); }
      else if (!v.paused) v.pause();
    });
  }, { rootMargin: "200px 0px" });

  function clip(src, caption, eager, controls, className) {
    const v = document.createElement("video");
    v.src = src;
    v.muted = true; v.loop = true; v.playsInline = true;
    v.setAttribute("muted", ""); v.setAttribute("playsinline", "");
    v.preload = eager ? "auto" : "metadata";
    // hold a 16:9 space until the clip says its real shape, so the page doesn't jump
    v.style.aspectRatio = className && className.includes("portrait") ? "9 / 16" : "16 / 9";
    v.addEventListener("loadedmetadata", () => { if (v.videoWidth) v.style.aspectRatio = v.videoWidth + " / " + v.videoHeight; }, { once: true });
    if (controls) {
      v.controls = true;
      // if the visitor pauses it, don't restart it when it scrolls back into view
      v.addEventListener("pause", () => { if (document.visibilityState === "visible" && v.getBoundingClientRect().bottom > 0 && v.getBoundingClientRect().top < innerHeight) v.dataset.paused = "1"; });
      v.addEventListener("play", () => { delete v.dataset.paused; });
    }
    v.setAttribute("aria-label", caption || "Video");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { v.controls = true; v.preload = "metadata"; return v; }
    if (clipWatcher) clipWatcher.observe(v); else { v.autoplay = true; }
    return v;
  }

  // Shows the image or clip; if the file isn't there yet (or no path is given), a soft gradient instead
  function figure(src, caption, className, eager, controls) {
    const fig = el("figure", "cs-figure " + (className || ""));
    const placeholder = () => {
      const ph = el("div", "cs-figure__ph placeholder");
      ph.style.setProperty("--grad", GRADIENTS[imageCount++ % GRADIENTS.length]);
      return ph;
    };
    if (src && /\.(mp4|webm|mov)$/i.test(src)) {
      const v = clip(src, caption, eager, controls, className);
      v.addEventListener("error", () => v.replaceWith(placeholder()), { once: true });
      fig.appendChild(v);
    } else if (src) {
      const img = document.createElement("img");
      img.src = src;
      img.alt = caption || "";
      img.loading = eager ? "eager" : "lazy";
      img.decoding = "async";
      img.addEventListener("error", () => img.replaceWith(placeholder()), { once: true });
      fig.appendChild(img);
    } else {
      fig.appendChild(placeholder());
    }
    if (caption) fig.appendChild(el("figcaption", null, caption));
    return fig;
  }

  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  /* ---------- Shared bits: titles, back links, footer, nav bar ---------- */
  document.title = project.title + " — " + C.pageTitle;
  document.getElementById("back").textContent = "← " + CS.backLabel;
  document.getElementById("back-mobile").textContent = "← " + CS.backLabel;
  document.getElementById("sections-label").textContent = CS.sectionsLabel;


  /* ---------- Header ---------- */
  const title = document.getElementById("title");
  title.replaceWith(rich("h1", "case__title", study ? study.title : project.title));
  if (study && study.subtitle) document.querySelector(".case__title").after(rich("p", "case__subtitle", study.subtitle));
  const tags = document.getElementById("tags");
  ((study && study.tags) || project.tags).forEach((t) => tags.appendChild(el("li", null, t)));

  const client = document.getElementById("client");
  if (study && study.client) {
    client.appendChild(el("span", "case__client-label", CS.clientLabel));
    client.appendChild(document.createTextNode(study.client));
  } else client.remove();

  // Info strip, e.g. Role and Collaboration
  if (study && study.info) {
    const strip = el("dl", "case__info");
    study.info.forEach((item) => {
      const box = el("div", "case__info-item");
      box.appendChild(el("dt", null, item.label));
      const dd = el("dd");
      if (item.text) dd.appendChild(rich("p", null, item.text));
      if (item.items) {
        const ul = el("ul");
        item.items.forEach((t) => ul.appendChild(rich("li", null, t)));
        dd.appendChild(ul);
      }
      box.appendChild(dd);
      strip.appendChild(box);
    });
    document.querySelector(".case__header").appendChild(strip);
  }

  document.getElementById("hero").appendChild(figure(study ? study.heroImage : project.image, "", "cs-figure--hero", true));

  /* ---------- Next case study ---------- */
  const next = projects[(index + 1) % projects.length];
  const nextLink = document.getElementById("next");
  if (next !== project) {
    nextLink.href = "project.html?p=" + encodeURIComponent(next.id);
    nextLink.appendChild(el("span", "case__next-label", CS.nextLabel));
    nextLink.appendChild(el("span", "case__next-title", next.title + " →"));
  } else nextLink.remove();

  const sectionsEl = document.getElementById("sections");
  const linksEl = document.getElementById("section-links");

  /* ---------- No case study written yet: simple summary page ---------- */
  if (!study) {
    document.body.classList.add("case-page--simple");
    sectionsEl.appendChild(el("p", "cs-text", project.description));
    const metrics = el("div", "project__metrics");
    project.metrics.forEach((m) => {
      const box = el("div");
      box.appendChild(el("div", "project__metric-value", m.value));
      box.appendChild(el("div", "project__metric-label", m.label));
      metrics.appendChild(box);
    });
    sectionsEl.appendChild(metrics);
    sectionsEl.appendChild(el("p", "case__soon", CS.comingSoon));
    return;
  }

  /* ---------- Sections and their blocks ---------- */
  const ARROW = '<svg viewBox="0 0 120 28" aria-hidden="true"><path d="M2 20c26-14 66-18 106-6"/><path d="M98 6l11 8-12 6"/></svg>';

  const SWOOSH = '<svg viewBox="0 0 90 14" aria-hidden="true"><path d="M3 9c18-6 44-8 70-3 6 1 10 3 14 1"/></svg>';

  // Small icons for link buttons: icon: "apple", "googleplay" or "web"
  const ICONS = {
    apple: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.37 12.6c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.56-2.73-1.77-3.32-1.8-1.41-.14-2.76.83-3.48.83-.72 0-1.82-.81-3-.79-1.54.02-2.97.9-3.76 2.28-1.61 2.79-.41 6.91 1.15 9.17.77 1.1 1.68 2.34 2.87 2.3 1.15-.05 1.59-.74 2.98-.74 1.39 0 1.78.74 3 .72 1.24-.02 2.02-1.12 2.78-2.23.88-1.28 1.24-2.52 1.26-2.59-.03-.01-2.41-.93-2.44-3.69zM14.1 5.86c.63-.77 1.06-1.83.94-2.9-.91.04-2.02.61-2.67 1.37-.58.67-1.1 1.76-.96 2.8 1.02.08 2.05-.52 2.69-1.27z"/></svg>',
    googleplay: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.6 2.3c-.24.25-.38.64-.38 1.14v17.12c0 .5.14.89.38 1.14l.06.06L13.25 12v-.22L3.66 2.24l-.06.06zM16.45 15.2l-3.2-3.2v-.22l3.2-3.2.07.04 3.79 2.15c1.08.62 1.08 1.62 0 2.24l-3.79 2.15-.07.04zM16.52 15.16 13.25 11.9 3.6 21.56c.36.38.95.43 1.62.05l11.3-6.45M16.52 8.62 5.22 2.18c-.67-.38-1.26-.33-1.62.05l9.65 9.66 3.27-3.27z"/></svg>',
    web: '<svg viewBox="0 0 24 24" aria-hidden="true" class="cs-link__stroke"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/></svg>'
  };

  const builders = {
    heading: (b) => rich("h2", "cs-heading", b.text),
    subheading: (b) => rich("h3", "cs-subheading", b.text),
    text: (b) => rich("p", "cs-text", b.text),
    lead: (b) => rich("p", "cs-lead", b.text),
    list: (b) => {
      const ul = el("ul", "cs-list");
      b.items.forEach((item) => ul.appendChild(rich("li", null, item)));
      return ul;
    },
    image: (b) => figure(b.image, b.caption, b.vertical ? "cs-figure--portrait" : "", false, b.controls),
    note: (b) => {
      const p = el("p", "cs-note");
      p.appendChild(el("span", null, b.text));
      p.insertAdjacentHTML("beforeend", ARROW); // fixed drawing, not content
      return p;
    },
    tldr: (b) => {
      const wrap = el("div", "cs-tldr-wrap");
      const label = el("p", "cs-tldr__label");
      label.appendChild(el("span", null, b.label || "TL;DR"));
      label.insertAdjacentHTML("beforeend", SWOOSH); // fixed drawing, not content
      wrap.appendChild(label);
      const card = el("div", "cs-tldr");
      wrap.appendChild(card);
      const left = el("div");
      left.appendChild(el("h3", "cs-tldr__title", "Challenge"));
      left.appendChild(rich("p", "cs-text", b.challenge));
      if (b.challengeList) left.appendChild(builders.list({ items: b.challengeList }));
      const right = el("div");
      right.appendChild(el("h3", "cs-tldr__title", "Solution"));
      // Solution can be one paragraph (text) or bullet points (a list)
      if (Array.isArray(b.solution)) right.appendChild(builders.list({ items: b.solution }));
      else right.appendChild(rich("p", "cs-text", b.solution));
      card.append(left, right);
      return wrap;
    },
    callout: (b) => {
      const box = el("aside", "cs-callout");
      if (b.title) box.appendChild(el("h3", "cs-callout__title", b.title));
      box.appendChild(rich("p", "cs-text", b.text));
      return box;
    },
    tiles: (b) => {
      const grid = el("ul", "cs-tiles");
      b.items.forEach((t, i) => {
        const li = el("li", "cs-tile");
        if (t.icon) {
          const img = document.createElement("img");
          img.src = t.icon;
          img.alt = "";
          img.loading = "lazy";
          li.appendChild(img);
        } else {
          const ph = el("span", "cs-tile__icon placeholder");
          ph.style.setProperty("--grad", GRADIENTS[i % GRADIENTS.length]);
          li.appendChild(ph);
        }
        li.appendChild(el("span", "cs-tile__label", t.label));
        grid.appendChild(li);
      });
      return grid;
    },
    links: (b) => {
      const row = el("div", "cs-links");
      b.items.forEach((l) => {
        const a = el("a", "cs-link");
        if (ICONS[l.icon]) a.insertAdjacentHTML("beforeend", ICONS[l.icon]); // fixed drawing, not content
        a.appendChild(el("span", null, ICONS[l.icon] ? l.label : l.label + " ↗"));
        a.href = l.url;
        a.target = "_blank";
        a.rel = "noopener";
        row.appendChild(a);
      });
      return row;
    },
    // Several images in one frame: swipe, use the arrows or dots, or let it slide on by itself
    carousel: (b) => {
      const wrap = el("div", "cs-carousel");
      const track = el("div", "cs-carousel__track");
      const slides = b.images.map((src) => {
        const f = figure(src, "", "cs-carousel__slide");
        track.appendChild(f);
        return f;
      });
      wrap.appendChild(track);
      if (slides.length < 2) return wrap;

      const dots = el("div", "cs-carousel__dots");
      const dotEls = slides.map((_, i) => {
        const d = el("button", "cs-carousel__dot");
        d.type = "button";
        d.setAttribute("aria-label", "Show image " + (i + 1));
        d.addEventListener("click", () => { stop(); go(i); });
        dots.appendChild(d);
        return d;
      });
      const arrow = (dir, label) => {
        const a = el("button", "cs-carousel__arrow cs-carousel__arrow--" + (dir < 0 ? "prev" : "next"));
        a.type = "button";
        a.setAttribute("aria-label", label);
        a.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + (dir < 0 ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7") + '"/></svg>';
        a.addEventListener("click", () => { stop(); go(current + dir); });
        wrap.appendChild(a);
      };
      arrow(-1, "Previous image");
      arrow(1, "Next image");
      wrap.appendChild(dots);

      let current = 0, timer = null, inView = false;
      const go = (i) => {
        current = (i + slides.length) % slides.length;
        track.scrollTo({ left: slides[current].offsetLeft, behavior: "smooth" });
      };
      const mark = () => dotEls.forEach((d, i) => d.classList.toggle("is-active", i === current));
      // keep the dots in step when someone swipes
      track.addEventListener("scroll", () => {
        const i = Math.round(track.scrollLeft / track.clientWidth);
        if (i !== current) current = i;
        mark();
      }, { passive: true });
      mark();

      // slides on by itself every few seconds while on screen, until someone takes over
      const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
      let stopped = calm;
      const stop = () => { stopped = true; clearInterval(timer); };
      const tick = () => { if (!stopped && inView && !wrap.matches(":hover") && !document.hidden) go(current + 1); };
      track.addEventListener("pointerdown", stop);
      track.addEventListener("touchstart", stop, { passive: true });
      if (!calm && "IntersectionObserver" in window) {
        new IntersectionObserver((e) => { inView = e[0].isIntersecting; }, { threshold: .5 }).observe(wrap);
        timer = setInterval(tick, 4000);
      }
      return wrap;
    },
    // Shows a still image first; the YouTube player only loads when someone presses play
    video: (b) => {
      const box = el("button", "cs-video" + (b.vertical ? " cs-video--vertical" : ""));
      box.type = "button";
      if (b.ratio) box.style.aspectRatio = b.ratio;   // e.g. "4 / 3" for tablet recordings
      box.setAttribute("aria-label", "Play video");
      const thumb = document.createElement("img");
      // vertical videos (Shorts) have their own tall preview frame; fall back to the standard one
      const still = "https://i.ytimg.com/vi/" + encodeURIComponent(b.youtube) + "/";
      thumb.src = still + (b.vertical ? "oar2.jpg" : "hqdefault.jpg");
      if (b.vertical) thumb.addEventListener("error", () => { thumb.src = still + "hqdefault.jpg"; }, { once: true });
      thumb.alt = "";
      thumb.loading = "lazy";
      box.appendChild(thumb);
      box.appendChild(el("span", "cs-video__play"));
      const load = (silent) => {
        const frame = document.createElement("iframe");
        const id = encodeURIComponent(b.youtube);
        // autoplaying videos start muted (browsers only allow that) and loop; visitors can unmute
        frame.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0&playsinline=1" +
          (silent ? "&mute=1&loop=1&playlist=" + id : "");
        frame.title = "Video";
        frame.allow = "autoplay; encrypted-media; picture-in-picture";
        frame.allowFullscreen = true;
        const wrap = el("div", box.className);
        wrap.style.aspectRatio = box.style.aspectRatio;
        wrap.appendChild(frame);
        box.replaceWith(wrap);
      };
      box.addEventListener("click", () => load(false));
      // "autoplay: true" starts the video by itself once it's nearly on screen
      if (b.autoplay && "IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const io = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) { io.disconnect(); load(true); }
        }, { rootMargin: "200px 0px" });
        io.observe(box);
      }
      return box;
    }
  };

  study.sections.forEach((section) => {
    const sid = slug(section.nav) || "section";
    const sec = el("section", "cs-section");
    sec.id = sid;
    section.blocks.forEach((b) => { if (builders[b.type]) sec.appendChild(builders[b.type](b)); });
    sectionsEl.appendChild(sec);

    const li = el("li");
    const a = el("a", null, section.nav);
    a.href = "#" + sid;
    li.appendChild(a);
    linksEl.appendChild(li);
  });

  /* ---------- Sidebar: highlight the section you're reading ---------- */
  const navLinks = [...linksEl.querySelectorAll("a")];
  const sectionEls = [...sectionsEl.querySelectorAll(".cs-section")];
  const progressBar = document.getElementById("read-progress");
  let queued = false;

  function update() {
    queued = false;
    // The current section is the last one whose top has passed 35% down the screen
    const line = window.innerHeight * 0.35;
    let current = 0;
    sectionEls.forEach((s, i) => { if (s.getBoundingClientRect().top <= line) current = i; });
    navLinks.forEach((a, i) => {
      const on = i === current;
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
    // Keep the active chip in view on phones, where the section list scrolls sideways
    const active = navLinks[current];
    const list = linksEl;
    if (list.scrollWidth > list.clientWidth) {
      const target = active.offsetLeft - list.clientWidth / 2 + active.offsetWidth / 2;
      if (Math.abs(list.scrollLeft - target) > 4) list.scrollTo({ left: target, behavior: "smooth" });
    }
    // Reading progress, measured over the case study itself (not the footer)
    const main = document.querySelector(".case").getBoundingClientRect();
    const read = Math.min(1, Math.max(0, -main.top / (main.height - window.innerHeight)));
    progressBar.style.transform = "scaleX(" + read.toFixed(4) + ")";
  }
  window.addEventListener("scroll", () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener("resize", update);
  update();
})();
