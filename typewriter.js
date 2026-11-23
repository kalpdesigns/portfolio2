/* ==========================================================================
   typewriter.js — the footer's contact form: a realistic 2D typewriter.

   The machine is a still picture (images/tw-body.jpg), rendered once from a
   detailed 3D model in soft daylight, so it sits perfectly still like a real
   one. Only what really moves on a typewriter moves here:
   - the carriage (images/tw-carriage.png in front of the sheet, and its rear
     rail, images/tw-carriage-back.png, behind it) slides along as you type
     and returns at the end of a line,
   - the key you type goes down, and a typebar flicks up to the paper,
   - the sheet rises out of the roller one line at a time.

   The paper is real text, large enough to read. At its top is a memo header:
   "To: Kalpesh / From: [your email]" and a Send button.
   Send pulls the sheet out, folds it into a paper plane and flies it away;
   a fresh sheet feeds in and the machine types a thank-you note.

   Messages go through Web3Forms (free, no database): content.js →
   footer.typewriter.accessKey. Until it's set, Send opens the visitor's
   email app with the note filled in.
   ========================================================================== */
(function () {
  const root = document.getElementById("typewriter");
  if (!root || !window.CONTENT) return;
  const C = window.CONTENT.footer;
  const T = Object.assign({
    accessKey: "",
    greeting: "Dear Kalpesh,",
    placeholder: "Click here and start typing…",
    send: "Send",
    thanks: "Thank you! Your note is on its way. I'll write back to {email} soon.",
    mailApp: "Almost there: your email app has opened with this note. Press send there and it's on its way.",
    error: "Hmm, the plane got lost on the way. Please email me at {to} instead.",
    another: "Write another",
  }, C.typewriter || {});
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Where things are in the picture (1700 × 1140 pixels) ---------- */
  const F = { w: 1700, h: 1140 };
  const PAPER = { left: 425, right: 1275, foot: 420 };        // the sheet's sides, and where it goes into the roller
  const STRIKE_X = 850, TYPE_LINE = 342;                      // where letters land, just above the roller
  const CARRIAGE = { top: 260, height: 600 };                 // the strip images/tw-carriage.png covers
  const BASKET = { cx: 850, cy: 516, rx: 364, ry: 77 };
  const KEYS = {"0":[1074,668,58,63],"1":[404,668,60,63],"2":[479,668,59,63],"3":[553,668,58,63],"4":[628,668,57,63],"5":[703,668,56,63],"6":[778,668,55,63],"7":[853,668,55,63],"8":[927,668,56,63],"9":[1000,668,57,63],"-":[1148,668,59,63],"⌫":[1222,668,60,63],"Q":[467,735,59,63],"W":[542,735,58,63],"E":[617,735,57,63],"R":[691,735,56,63],"T":[766,735,55,63],"Y":[841,735,55,63],"U":[915,735,56,63],"I":[988,735,57,63],"O":[1062,735,58,63],"P":[1136,735,59,63],"@":[1210,735,60,63],"LOCK":[412,802,60,63],"A":[487,802,59,63],"S":[562,802,58,63],"D":[636,802,57,63],"F":[711,802,56,63],"G":[785,802,55,63],"H":[860,802,55,63],"J":[933,802,56,63],"K":[1007,802,57,63],"L":[1081,802,58,63],";":[1154,802,59,63],"'":[1228,802,60,63],"SHIFT-L":[428,868,59,62],"Z":[502,868,58,62],"X":[577,868,57,62],"C":[651,868,56,62],"V":[726,868,55,62],"B":[800,868,54,62],"N":[874,868,55,62],"M":[948,868,56,62],",":[1021,868,57,62],".":[1095,868,58,62],"?":[1168,868,59,62],"SHIFT-R":[1242,868,60,62]," ":[579,932,543,45]};
  const MARGIN = 44;                                          // the sheet's side margins
  const TEXT_W = PAPER.right - PAPER.left - MARGIN * 2;
  let MAX_SHEET = 540;                                        // the tallest the sheet stands before older lines roll back (taller on phones)
  const pct = (v, of) => (v / of * 100).toFixed(3) + "%";

  const keyHTML = Object.entries(KEYS).map(([id, [x, y, w, h]]) =>
    `<span class="tw2__key" data-key="${id}" style="left:${pct(x, F.w)};top:${pct(y, F.h)};width:${pct(w, F.w)};height:${pct(h, F.h)}"></span>`).join("");

  root.innerHTML = `
    <form class="tw2" novalidate>
      <div class="tw2__machine">
        <img class="tw2__body" src="images/tw-body.jpg?v=12" alt="" width="1700" height="1420" decoding="async">
        <div class="tw2__keys" aria-hidden="true">${keyHTML}</div>
        <svg class="tw2__strike" viewBox="0 0 ${F.w} ${F.h}" aria-hidden="true"><line x1="${BASKET.cx}" y1="${BASKET.cy}" x2="${STRIKE_X}" y2="${TYPE_LINE + 30}"/></svg>
        <div class="tw2__carriage">
          <img class="tw2__rail" src="images/tw-carriage-back.png?v=12" alt="" width="1700" height="600" decoding="async" style="top:${pct(CARRIAGE.top, F.h)};height:${pct(CARRIAGE.height, F.h)}">
          <div class="tw2__paper" style="left:${pct(PAPER.left, F.w)};width:${pct(PAPER.right - PAPER.left, F.w)};bottom:${pct(F.h - PAPER.foot, F.h)}">
            <div class="tw2__memo">
              <p class="tw2__row tw2__row--to"><span class="tw2__k">To:</span> Kalpesh Bhavsar</p>
              <p class="tw2__row tw2__row--from"><label class="tw2__k" for="tw-email">From:</label><input class="tw2__email" id="tw-email" name="email" type="email" autocomplete="email" placeholder="your@email.com" spellcheck="false"><button class="tw2__send" type="submit"><span class="tw2__send-label">${T.send}</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 21 4l-6.5 17-3.2-6.8L3 11.5Z"/><path d="m11.3 14.2 4-4"/></svg></button></p>
            </div>
            <div class="tw2__text"><div class="tw2__lines" aria-hidden="true"></div></div>
          </div>
          <img class="tw2__roller" src="images/tw-carriage.png?v=12" alt="" width="1700" height="600" decoding="async" style="top:${pct(CARRIAGE.top, F.h)};height:${pct(CARRIAGE.height, F.h)}">
        </div>
        <label class="sr-only" for="tw-message">Your message</label>
        <textarea class="tw2__input" id="tw-message" name="message" autocomplete="off" autocapitalize="sentences" spellcheck="false"></textarea>
      </div>
      <input type="checkbox" name="botcheck" class="tw__trap" tabindex="-1" autocomplete="off" aria-hidden="true">
      <p class="tw__status" role="status" aria-live="polite"></p>
    </form>`;

  const form = root.querySelector("form");
  const machine = root.querySelector(".tw2__machine");
  const carriageEl = root.querySelector(".tw2__carriage");
  const paper = root.querySelector(".tw2__paper");
  const memo = root.querySelector(".tw2__memo");
  const textBox = root.querySelector(".tw2__text");
  const linesEl = root.querySelector(".tw2__lines");
  const input = root.querySelector(".tw2__input");
  const emailIn = root.querySelector(".tw2__email");
  const sendBtn = root.querySelector(".tw2__send");
  const sendLabel = root.querySelector(".tw2__send-label");
  const status = root.querySelector(".tw__status");
  const strikeLine = root.querySelector(".tw2__strike line");
  const keyEls = {};
  root.querySelectorAll(".tw2__key").forEach((k) => { keyEls[k.dataset.key] = k; });

  /* ---------- Sizes: everything scales with the picture ---------- */
  let K = 0.4, COLS = 32, CW = TEXT_W / 32, LH = 24;          // K = screen px per picture px
  function measure() {
    K = machine.clientWidth / F.w;
    // phones have room to spare above the machine, so the sheet can stand taller there
    MAX_SHEET = innerWidth <= 820 ? 780 : 540;
    // headroom for the sheet at its tallest, plus a little air below the heading
    machine.style.marginTop = `calc(${((MAX_SHEET - PAPER.foot) / F.w * 100).toFixed(2)}% + 16px)`;
    machine.style.setProperty("--k", K);
    COLS = Math.max(20, Math.min(40, Math.floor((TEXT_W * K) / 9.2)));   // keep letters at least ~15px
    CW = TEXT_W / COLS;
    const font = (CW * K) / 0.6;                               // Courier: each letter is 0.6em wide
    LH = font * 1.6;
    machine.style.setProperty("--tw-font", font.toFixed(2) + "px");
    render(false);
  }

  /* ---------- The text: wrapped by the machine, a fixed number of letters a line ---------- */
  let body = "", shown = "", mode = "write";                  // mode: "write" or "reply" (the machine types back)
  function wrap(text) {
    const out = [];
    text.split("\n").forEach((para) => {
      let line = "";
      para.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) { line += part.replace(/\t/g, " "); if (line.length > COLS) { out.push(line.slice(0, COLS)); line = ""; } return; }
        while (part.length > COLS) { if (line) { out.push(line); line = ""; } out.push(part.slice(0, COLS)); part = part.slice(COLS); }
        if ((line + part).length > COLS) { out.push(line.replace(/\s+$/, "")); line = part; } else line += part;
      });
      out.push(line);
    });
    return out;
  }
  const inkOf = (i, ch) => { const h = Math.sin(i * 12.9898 + ch.charCodeAt(0) * 78.233) * 43758.5453; return h - Math.floor(h); };
  const esc = (c) => c.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  let lines = [], lastCount = 0;
  function render(animate) {
    lines = mode === "write" ? [T.greeting, "", ...wrap(body)] : wrap(shown);
    linesEl.innerHTML = lines.map((line, li) => {
      let s = "";
      for (let i = 0; i < line.length; i++) {
        const ch = line[i], r = inkOf(li * 97 + i, ch);
        s += ch === " " ? " " : `<span style="opacity:${(0.74 + r * 0.26).toFixed(2)};top:${((r - 0.5) * 0.06).toFixed(3)}em">${esc(ch)}</span>`;
      }
      if (li === lines.length - 1) s += `<i class="tw2__caret"></i>${mode === "write" && !body ? `<span class="tw2__hint">${T.placeholder}</span>` : ""}`;
      return `<div class="tw2__line">${s}</div>`;
    }).join("");
    // the next letter's spot sits under the strike point
    const col = mode === "write" && !body && !root.classList.contains("is-typing") ? COLS / 2 : (lines[lines.length - 1] || "").length;
    target.x = STRIKE_X - (PAPER.left + MARGIN + (col + 0.5) * CW);
    feed.target = lines.length;
    if (!animate || !lastCount) { feed.n = lines.length; feed.v = 0; }
    lastCount = lines.length;
    kick();
  }

  /* ---------- Motion: the carriage, and the sheet rising a line at a time ---------- */
  const target = { x: 0 }, car = { x: 0, v: 0 }, feed = { n: 0, v: 0, target: 0 };
  let raf = 0, lastT = 0;
  function kick() { if (!raf) { lastT = performance.now(); raf = requestAnimationFrame(tick); } }
  function placeSheet() {
    const memoH = memo.offsetHeight;
    const pad = 22 * K, foot = (PAPER.foot - TYPE_LINE) * K;  // gap above the memo; text sits just above the roller
    const full = pad + memoH + feed.n * LH + foot;
    const max = MAX_SHEET * K;
    const h = Math.min(full, max);
    paper.style.height = h.toFixed(1) + "px";
    textBox.style.height = Math.max(0, h - pad - memoH - foot + LH * 0.2).toFixed(1) + "px";
    linesEl.style.transform = `translateY(${(-(Math.max(0, full - max))).toFixed(1)}px)`;   // past the top, older lines roll back
  }
  function tick(now) {
    const dt = Math.min(0.033, (now - lastT) / 1000); lastT = now;
    if (still) { car.x = target.x; car.v = 0; feed.n = feed.target; feed.v = 0; }
    else {
      const acc = 520 * (target.x - car.x) - 36 * car.v;        // the carriage clicks into place
      car.v += acc * dt; car.x += car.v * dt;
      feed.v += (240 * (feed.target - feed.n) - 22 * feed.v) * dt; feed.n += feed.v * dt;   // the sheet settles with a soft bounce
    }
    // on phones the machine is wider than the screen, so the carriage travels less to keep the sheet in view
    const travel = innerWidth <= 820 ? 0.35 : 1;
    carriageEl.style.transform = `translateX(${(car.x * K * travel).toFixed(2)}px)`;
    placeSheet();
    const moving = Math.abs(target.x - car.x) > 0.1 || Math.abs(car.v) > 0.1 || Math.abs(feed.target - feed.n) > 0.002 || Math.abs(feed.v) > 0.01;
    raf = moving ? requestAnimationFrame(tick) : 0;
  }

  /* ---------- Keys: the one you type goes down; Shift too for capitals ---------- */
  const SHIFTED = { "!": "1", '"': "'", "#": "3", "$": "4", "%": "5", "&": "7", "(": "9", ")": "0", "_": "-", ":": ";", "*": "8", "/": "?", "<": ",", ">": "." };
  function keyFor(ch) {
    if (ch === "\b") return ["⌫", false];
    if (ch === " ") return [" ", false];
    if (/[a-z]/.test(ch)) return [ch.toUpperCase(), false];
    if (/[A-Z]/.test(ch)) return [ch, true];
    if (/[0-9]/.test(ch)) return [ch, false];
    if ("-;',.?@".includes(ch)) return [ch, ch === "?" || ch === "@"];
    if (SHIFTED[ch]) return [SHIFTED[ch], true];
    return [null, false];
  }
  function down(id) {
    const k = keyEls[id]; if (!k) return;
    k.classList.remove("is-down"); void k.offsetWidth; k.classList.add("is-down");
    clearTimeout(k._t); k._t = setTimeout(() => k.classList.remove("is-down"), 130);
  }
  function press(ch) {
    const [id, shift] = keyFor(ch);
    if (shift) down("SHIFT-L");
    if (id) down(id);
    if (id && id !== " " && id !== "⌫" && KEYS[id]) {
      // a typebar flicks up from the matching side of the basket
      const kx = KEYS[id][0] + KEYS[id][2] / 2;
      const a = Math.PI * (0.08 + 0.84 * Math.min(1, Math.max(0, (kx - 404) / 878)));
      strikeLine.setAttribute("x1", (BASKET.cx - Math.cos(a) * BASKET.rx * 0.9).toFixed(0));
      strikeLine.setAttribute("y1", (BASKET.cy + Math.sin(a) * BASKET.ry * 0.9).toFixed(0));
      strikeLine.parentNode.classList.remove("is-striking"); void strikeLine.parentNode.getBBox(); strikeLine.parentNode.classList.add("is-striking");
    }
  }

  /* ---------- Typing: a hidden text box over the sheet takes the keyboard (phones too) ---------- */
  machine.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".tw2__memo")) return;                 // the email field and Send button work as normal
    if (mode === "write") { e.preventDefault(); input.focus({ preventScroll: true }); }
  });
  input.addEventListener("focus", () => { root.classList.add("is-typing"); render(false); });
  input.addEventListener("blur", () => { root.classList.remove("is-typing"); render(false); });
  input.addEventListener("input", (e) => {
    if (mode !== "write") { input.value = body; return; }
    const before = body;
    body = input.value.replace(/\r/g, "");
    input.setSelectionRange(body.length, body.length);
    if (body.length < before.length) press("\b"); else if (e.data) press(e.data.slice(-1));
    render(true);
  });
  input.addEventListener("keydown", (e) => { if (/^Arrow|Home|End/.test(e.key)) e.preventDefault(); });
  // typing your email presses the keys too
  emailIn.addEventListener("input", (e) => { if (e.data) press(e.data.slice(-1)); else if (/delete/.test(e.inputType || "")) press("\b"); });
  addEventListener("resize", measure);
  if (document.fonts) document.fonts.ready.then(measure);
  measure();
  car.x = target.x;

  /* ---------- Sending ---------- */
  const say = (msg) => { status.textContent = msg; };
  const shake = (node) => { node.classList.remove("is-shaking"); void node.offsetWidth; node.classList.add("is-shaking"); };
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

  async function deliver(email, message) {
    if (!T.accessKey) return "mailapp";
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: T.accessKey, subject: "A note from your portfolio", from_name: "Portfolio typewriter",
          email, replyto: email, message, botcheck: form.botcheck.checked,
        }),
      });
      return (await res.json()).success ? "sent" : "error";
    } catch (err) { return "error"; }
  }

  // 1. the sheet is pulled up out of the roller; 2. it folds into a dart; 3. it becomes a paper plane and flies off
  async function flyAway() {
    const r = paper.getBoundingClientRect();
    const fly = paper.cloneNode(true);
    fly.classList.add("tw-fly", "tw2__paper--fly");
    fly.querySelectorAll("input, button").forEach((n) => n.setAttribute("tabindex", "-1"));
    fly.querySelector(".tw2__email").value = emailIn.value;
    Object.assign(fly.style, { left: r.left + "px", top: r.top + "px", width: r.width + "px", height: r.height + "px", bottom: "auto", transform: "none" });
    fly.style.setProperty("--tw-font", getComputedStyle(machine).getPropertyValue("--tw-font"));
    fly.style.setProperty("--k", K);
    document.body.appendChild(fly);
    paper.classList.add("is-empty");
    if (still) { await fly.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: "forwards" }).finished; fly.remove(); return; }
    const lift = `translateY(${-r.height * 0.3}px)`;
    await fly.animate([{ transform: "translateY(0)" }, { transform: lift }], { duration: 560, easing: "cubic-bezier(.3,.7,.3,1)", fill: "forwards" }).finished;
    await fly.animate([
      { clipPath: "polygon(0% 0%, 50% 0%, 100% 0%, 100% 100%, 50% 100%, 0% 100%)", transform: `${lift} scale(1)` },
      { clipPath: "polygon(0% 30%, 50% 0%, 100% 30%, 100% 100%, 50% 100%, 0% 100%)", transform: `${lift} scale(.9)`, offset: .35 },
      { clipPath: "polygon(20% 56%, 50% 0%, 80% 56%, 64% 100%, 50% 92%, 36% 100%)", transform: `${lift} scale(.72)`, offset: .7 },
      { clipPath: "polygon(38% 72%, 50% 0%, 62% 72%, 55% 100%, 50% 95%, 45% 100%)", transform: `${lift} scale(.56) rotate(8deg)` },
    ], { duration: 950, easing: "ease-in-out", fill: "forwards" }).finished;
    const fr = fly.getBoundingClientRect();
    const plane = document.createElement("div");
    plane.className = "tw-plane";
    plane.innerHTML = `<svg viewBox="0 0 120 72" aria-hidden="true">
      <path d="M4 40 L116 6 L48 47 Z" fill="#fffefb"/><path d="M48 47 L116 6 L60 68 Z" fill="#e7e5de"/>
      <path d="M48 47 L116 6 L54 55 Z" fill="#cfccc3"/>
      <path d="M4 40 L116 6 L60 68 L54 55 L48 47 Z" fill="none" stroke="rgba(28,28,23,.18)" stroke-width="1.2" stroke-linejoin="round"/></svg>`;
    const pw = Math.max(80, Math.min(140, fr.width * 1.3));
    Object.assign(plane.style, { width: pw + "px", left: fr.left + fr.width / 2 - pw / 2 + "px", top: fr.top + fr.height / 2 - pw * .3 + "px" });
    document.body.appendChild(plane);
    fly.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, fill: "forwards" });
    await plane.animate([{ opacity: 0, transform: "scale(.7) rotate(-30deg)" }, { opacity: 1, transform: "scale(1) rotate(-8deg)" }],
      { duration: 260, easing: "ease-out", fill: "forwards" }).finished;
    fly.remove();
    const pr = plane.getBoundingClientRect();
    const dx = innerWidth - pr.left + 40, dy = -(pr.top + 160);
    await plane.animate([
      { transform: "scale(1) rotate(-8deg)", opacity: 1 },
      { transform: `translate(${dx * .12}px, 40px) scale(1) rotate(6deg)`, offset: .18 },
      { transform: `translate(${dx * .38}px, ${dy * .2}px) scale(.9) rotate(-16deg)`, offset: .45 },
      { transform: `translate(${dx * .68}px, ${dy * .62}px) scale(.72) rotate(-10deg)`, opacity: 1, offset: .78 },
      { transform: `translate(${dx}px, ${dy}px) scale(.55) rotate(-6deg)`, opacity: 0 },
    ], { duration: 1900, easing: "cubic-bezier(.4,.05,.5,.95)", fill: "forwards" }).finished;
    plane.remove();
  }

  // a fresh sheet feeds in and the machine types back, key by key
  async function typeBack(line) {
    mode = "reply"; shown = "";
    root.classList.add("is-reply");
    render(false);
    feed.n = -3; feed.v = 0; kick();                          // starts below the roller, then rises
    paper.classList.remove("is-empty");
    await wait(still ? 0 : 600);
    for (const ch of line) {
      shown += ch; press(ch); render(true);
      if (!still) await wait(ch === " " ? 70 : 45 + Math.random() * 45);
    }
  }

  function reset() {                                          // "Write another"
    form.classList.remove("is-done");
    root.classList.remove("is-reply");
    sendLabel.textContent = T.send;
    mode = "write"; body = ""; input.value = ""; say("");
    render(false);
    feed.n = feed.target - 3; feed.v = 0; kick();
    input.focus({ preventScroll: true });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form.classList.contains("is-done")) return reset();
    if (form.classList.contains("is-busy")) return;
    const message = body.trim(), email = emailIn.value.trim();
    if (!message) { say("Type a note on the paper first."); shake(machine); input.focus({ preventScroll: true }); return; }
    if (!validEmail(email)) { say("Add your email after “From:” so I can write back."); shake(emailIn); emailIn.focus({ preventScroll: true }); return; }
    form.classList.add("is-busy");
    sendBtn.disabled = true;
    say("Sending…");
    input.blur(); emailIn.blur();
    const sending = deliver(email, message);
    await flyAway();
    const result = await sending;
    if (result === "mailapp") {
      location.href = `mailto:${C.email}?subject=${encodeURIComponent("A note from your portfolio")}&body=${encodeURIComponent(message + "\n\n— " + email)}`;
    }
    const line = result === "sent" ? T.thanks.replace("{email}", email) : result === "mailapp" ? T.mailApp : T.error.replace("{to}", C.email);
    say(result === "sent" ? "Sent." : result === "mailapp" ? "Opening your email app." : "Couldn't send. Please email me instead.");
    await typeBack(line);
    sendBtn.disabled = false;
    sendLabel.textContent = T.another;
    form.classList.remove("is-busy");
    form.classList.add("is-done");
  });
})();
