/* ==========================================================================
   mtw.js — the footer's typewriter on phones.

   A sheet of paper comes out of the typewriter's roller at the bottom of the
   screen. Above the roller, the little carriage pointer slides along as you
   type, following the letter you're on; it taps the paper with each key.
   Tapping the paper opens the keyboard, and the bottom bar steps aside while
   you type (like any messaging app), then comes back.

   Send works like the desktop typewriter: Web3Forms if content.js has an
   access key, otherwise the visitor's email app opens with the note filled in.
   ========================================================================== */
(function () {
  const host = document.getElementById("typewriter");
  if (!host || !window.CONTENT) return;
  const C = window.CONTENT.footer;
  const T = Object.assign({
    accessKey: "", greeting: "Dear Kalpesh,", placeholder: "Tap here and start typing…", send: "Send",
    thanks: "Thank you! Your note is on its way. I'll write back to {email} soon.",
    mailApp: "Almost there: your email app has opened with this note. Press send there and it's on its way.",
    error: "Hmm, the plane got lost on the way. Please email me at {to} instead.", another: "Write another",
  }, C.typewriter || {});
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const wrap = document.createElement("form");
  wrap.className = "mtw";
  wrap.noValidate = true;
  wrap.innerHTML = `
    <p class="mtw__status" role="status" aria-live="polite"></p>
    <div class="mtw__machine">
      <div class="mtw__paper">
        <div class="mtw__memo">
          <p class="mtw__row"><span class="mtw__k">To:</span> Kalpesh Bhavsar</p>
          <p class="mtw__row mtw__row--from">
            <label class="mtw__k" for="mtw-email">From:</label>
            <input class="mtw__email" id="mtw-email" name="email" type="email" autocomplete="email" inputmode="email" placeholder="your@email.com" spellcheck="false">
            <button class="mtw__send" type="submit"><span class="mtw__send-label">${T.send}</span><svg class="mtw__plane" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 21 4l-6.5 17-3.2-6.8L3 11.5Z"/><path d="m11.3 14.2 4-4"/></svg><svg class="mtw__again" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button>
          </p>
        </div>
        <div class="mtw__body">
          <p class="mtw__greet">${T.greeting}</p>
          <label class="sr-only" for="mtw-message">Your message</label>
          <textarea class="mtw__text" id="mtw-message" name="message" rows="1" placeholder="Tap here to start typing…" autocapitalize="sentences"></textarea>
        </div>
      </div>
      <div class="mtw__bar" aria-hidden="true">
        <span class="mtw__rod"></span>
        <span class="mtw__cap mtw__cap--l"></span><span class="mtw__cap mtw__cap--r"></span>
        <span class="mtw__pointer"><span class="mtw__guide"></span><span class="mtw__unit"><i></i><i></i><i></i></span></span>
      </div>
      <div class="mtw__base" aria-hidden="true"></div>
    </div>
    <input type="checkbox" name="botcheck" class="tw__trap" tabindex="-1" autocomplete="off" aria-hidden="true">`;
  host.after(wrap);

  const credits = document.querySelector("#contact .footer__credits");
  if (credits) {
    const c = credits.cloneNode(true);
    c.className = "mtw__credits";
    c.querySelectorAll("[id]").forEach((n) => n.removeAttribute("id"));
    c.setAttribute("aria-hidden", "true");   // the original is still read out by screen readers
    wrap.querySelector(".mtw__base").appendChild(c);
  }
  const paper = wrap.querySelector(".mtw__paper");
  const text = wrap.querySelector(".mtw__text");
  const body = wrap.querySelector(".mtw__body");
  const email = wrap.querySelector(".mtw__email");
  const send = wrap.querySelector(".mtw__send");
  const sendLabel = wrap.querySelector(".mtw__send-label");
  const status = wrap.querySelector(".mtw__status");
  const pointer = wrap.querySelector(".mtw__pointer");
  const machine = wrap.querySelector(".mtw__machine");

  /* ---------- The paper feeds upward a line at a time as you type ----------
     The sheet always shows its newest line just above the roller; once it's taller
     than the room above, its top (the memo, older lines) slides up out of sight,
     the way paper climbs out of a typewriter. */
  function grow() {
    text.style.height = "auto";
    text.style.height = text.scrollHeight + "px";
    dock();
    body.scrollTop = body.scrollHeight;   // keep the line being typed in view
  }

  /* ---------- The pointer follows the letter you're on ---------- */
  // a hidden copy of the text box tells us where the cursor sits on its line
  const mirror = document.createElement("div");
  mirror.className = "mtw__mirror";
  mirror.setAttribute("aria-hidden", "true");
  paper.appendChild(mirror);
  function caretX(field) {
    const cs = getComputedStyle(field);
    ["font", "letterSpacing", "paddingLeft", "paddingRight", "width", "lineHeight", "whiteSpace", "wordBreak", "overflowWrap"].forEach((k) => (mirror.style[k] = cs[k]));
    mirror.style.whiteSpace = field.tagName === "TEXTAREA" ? "pre-wrap" : "pre";
    const upto = field.value.slice(0, field.selectionEnd == null ? field.value.length : field.selectionEnd);
    mirror.textContent = upto;
    const mark = document.createElement("span");
    mark.textContent = "​";
    mirror.appendChild(mark);
    const fr = field.getBoundingClientRect(), mr = machine.getBoundingClientRect();
    return fr.left - mr.left + mark.offsetLeft - (field.scrollLeft || 0);
  }
  let rest = 0;
  function placePointer(field) {
    const x = field ? caretX(field) : rest;
    pointer.style.transform = `translateX(${x.toFixed(1)}px)`;
  }
  function strike() {
    if (still) return;
    pointer.classList.remove("is-striking"); void pointer.offsetWidth; pointer.classList.add("is-striking");
  }
  const restSpot = () => { const mr = machine.getBoundingClientRect(); rest = mr.width / 2; placePointer(null); };

  text.addEventListener("input", () => { grow(); placePointer(text); strike(); });
  email.addEventListener("input", () => { placePointer(email); strike(); });
  ["keyup", "click", "select"].forEach((ev) => {
    text.addEventListener(ev, () => placePointer(text));
    email.addEventListener(ev, () => placePointer(email));
  });
  // tapping anywhere on the paper starts typing
  paper.addEventListener("click", (e) => { if (!e.target.closest("input, button, textarea")) text.focus(); });

  /* ---------- While typing: the roller sits right on top of the keyboard ----------
     The keyboard covers the bottom of the screen, so while it's up the machine is
     pinned to the visible area's bottom edge (measured with visualViewport), the
     bottom bar and credits step aside, and the paper rises from the roller. */
  const vv = window.visualViewport;
  let docked = false;
  // while typing, the footer heading is shown at the top of what's visible, on the page colour
  const stage = document.createElement("div");
  stage.className = "mtw__stage";
  stage.setAttribute("aria-hidden", "true");
  const heading = document.querySelector("#contact .footer__heading");
  if (heading) {
    const h2 = heading.cloneNode(true);
    h2.querySelectorAll("[data-reveal]").forEach((n) => n.removeAttribute("data-reveal"));   // always fully shown
    stage.appendChild(h2);
  }
  document.body.appendChild(stage);
  function dock() {
    if (!docked) return;
    const h = vv ? vv.height : innerHeight, top = vv ? vv.offsetTop : 0;
    stage.style.top = top + "px"; stage.style.height = h + "px";
    const headBottom = stage.firstChild ? stage.firstChild.getBoundingClientRect().bottom - stage.getBoundingClientRect().top : 0;
    // the sheet may rise from the roller up to a little below the heading, then it scrolls inside
    machine.style.setProperty("--paper-max", Math.max(140, h - headBottom - 20 - 34) + "px");
    machine.style.top = (top + h - machine.offsetHeight).toFixed(1) + "px";
  }
  function startTyping() {
    if (docked) return;
    wrap.style.height = wrap.offsetHeight + "px";     // keep the footer's shape while the machine lifts out
    docked = true;
    wrap.classList.add("is-docked");
    stage.classList.add("is-on");
    document.documentElement.classList.add("is-keyboard");
    dock();
  }
  function stopTyping() {
    docked = false;
    wrap.classList.remove("is-docked");
    stage.classList.remove("is-on");
    document.documentElement.classList.remove("is-keyboard");
    machine.style.top = ""; machine.style.removeProperty("--paper-max"); wrap.style.height = "";
    restSpot();
  }
  if (vv) { vv.addEventListener("resize", dock); vv.addEventListener("scroll", dock); }
  let blurT;
  wrap.addEventListener("focusin", (e) => {
    clearTimeout(blurT);
    if (e.target === text || e.target === email) {
      startTyping();
      placePointer(e.target);
      // the browser may try to scroll the box into view; the machine follows the visible area instead
      setTimeout(dock, 60); setTimeout(dock, 350);
    }
  });
  wrap.addEventListener("focusout", () => {
    blurT = setTimeout(() => { if (!wrap.contains(document.activeElement)) stopTyping(); }, 150);
  });

  addEventListener("resize", () => { grow(); if (!docked) restSpot(); });
  requestAnimationFrame(() => { grow(); restSpot(); });

  /* ---------- Sending ---------- */
  const say = (m) => { status.textContent = m; };
  const valid = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  async function deliver(addr, message) {
    if (!T.accessKey) return "mailapp";
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ access_key: T.accessKey, subject: "A note from your portfolio", from_name: "Portfolio typewriter",
          email: addr, replyto: addr, message, botcheck: wrap.botcheck.checked }),
      });
      return (await res.json()).success ? "sent" : "error";
    } catch (err) { return "error"; }
  }
  // typed back onto a fresh sheet, letter by letter, with the pointer following
  async function typeBack(line) {
    text.value = ""; text.readOnly = true; grow();
    for (const ch of line) {
      text.value += ch; grow();
      const mr = machine.getBoundingClientRect();
      pointer.style.transform = `translateX(${(caretX(text)).toFixed(1)}px)`;
      strike();
      if (!still) await wait(ch === " " ? 60 : 38 + Math.random() * 40);
    }
  }
  wrap.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (wrap.classList.contains("is-done")) {
      wrap.classList.remove("is-done"); text.readOnly = false; text.value = ""; grow(); sendLabel.textContent = T.send; say(""); text.focus(); return;
    }
    const message = text.value.trim(), addr = email.value.trim();
    if (!message) { say("Type a note on the paper first."); text.focus(); return; }
    if (!valid(addr)) { say("Add your email after “From:” so I can write back."); email.focus(); return; }
    send.disabled = true; say("Sending…");
    text.blur(); email.blur();
    const sending = deliver(addr, message);
    // the sheet is pulled up out of the roller and away; a fresh one feeds in
    if (!still) await paper.animate([{ transform: "none", opacity: 1 }, { transform: "translateY(-120%) rotate(-3deg)", opacity: 0 }], { duration: 650, easing: "cubic-bezier(.5,0,.7,.4)" }).finished;
    const result = await sending;
    if (result === "mailapp") location.href = `mailto:${C.email}?subject=${encodeURIComponent("A note from your portfolio")}&body=${encodeURIComponent(message + "\n\n— " + addr)}`;
    if (!still) paper.animate([{ transform: "translateY(40%)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 450, easing: "cubic-bezier(.2,.7,.3,1)" });
    say(result === "sent" ? "Sent." : result === "mailapp" ? "Opening your email app." : "Couldn't send. Please email me instead.");
    await typeBack(result === "sent" ? T.thanks.replace("{email}", addr) : result === "mailapp" ? T.mailApp : T.error.replace("{to}", C.email));
    send.disabled = false; sendLabel.textContent = T.another; wrap.classList.add("is-done");
  });
})();
