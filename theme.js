/* ==========================================================================
   theme.js — the site colour.

   BUTTON is used as is on buttons and highlights. The landing wall is a lighter,
   softer version of WALL_BASE, lit by a sunbeam (see leaf-shadows.js).
   Text on top switches between dark and white so it always stays readable.
   To change the colours or the sunlight, edit BUTTON, WALL_BASE and LOOK below.

   Loaded in <head> so the colours are in place before the page shows.
   ========================================================================== */
(function () {
  const BUTTON = "#2f55d4";      // buttons, pills, highlights: a deep cobalt
  const WALL_BASE = "#2492b0";   // the wall is made from this (lightened by LOOK.soft)
  // soft = how far the wall is lifted towards a pale warm white (0 = same as the buttons),
  // beam / glow / haze = sunlight on the wall (0–1), shade = how dark the branch shadows are
  const LOOK = { soft: .3, beam: .9, glow: 0, haze: 0, shade: .8 };
  const INK = "#1c1c17", WHITE = "#ffffff", PAGE = "#fbfbf9";

  /* ---------- Colour maths ---------- */
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const toRgb = (hex) => { const n = parseInt(hex.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
  const toHex = (rgb) => "#" + rgb.map((v) => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, "0")).join("");
  const lum = (hex) => {
    const [r, g, b] = toRgb(hex).map((v) => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); });
    return .2126 * r + .7152 * g + .0722 * b;
  };
  const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
  const mix = (a, b, t) => { const A = toRgb(a), B = toRgb(b); return toHex(A.map((v, i) => v + (B[i] - v) * t)); };
  function hsvToHex(h, s, v) {
    const f = (n) => { const k = (n + h / 60) % 6; return v - v * s * Math.max(0, Math.min(k, 4 - k, 1)); };
    return toHex([f(5), f(3), f(1)].map((x) => x * 255));
  }
  function hexToHsv(hex) {
    const [r, g, b] = toRgb(hex).map((v) => v / 255);
    const max = Math.max(r, g, b), d = max - Math.min(r, g, b);
    let h = 0;
    if (d) h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return [(h * 60 + 360) % 360, max ? d / max : 0, max];
  }
  function normalise(text) {
    let t = String(text || "").trim().replace(/^#/, "").toLowerCase();
    if (/^[0-9a-f]{3}$/.test(t)) t = t.split("").map((c) => c + c).join("");
    return /^[0-9a-f]{6}$/.test(t) ? "#" + t : null;
  }
  // Darker version of a colour for thin lines and hover, so it shows on the off-white page
  function deepen(hex) {
    let c = hex;
    for (let i = 0; i < 20 && contrast(c, PAGE) < 3.6; i++) c = mix(c, INK, .08);
    return c;
  }
  const readableOn = (bg) => (contrast(bg, INK) >= contrast(bg, WHITE) ? INK : WHITE);

  /* ---------- Apply ---------- */
  let look = Object.assign({}, LOOK);
  const WALL_WHITE = "#f6f3ec";
  const wallOf = (hex) => mix(hex, WALL_WHITE, look.soft);
  let current = BUTTON;
  const listeners = [];
  function apply(hex) {
    const deep = deepen(hex), wall = wallOf(WALL_BASE);
    const s = document.documentElement.style;
    s.setProperty("--accent", hex);
    s.setProperty("--wall", wall);
    s.setProperty("--on-accent", WHITE);                     // button text: always white (your choice)
    s.setProperty("--accent-deep", deep);
    s.setProperty("--on-accent-deep", WHITE);
    s.setProperty("--accent-soft", mix(PAGE, hex, .16));
    // big landing text stays white unless the wall is so pale white would wash out
    // (sunlight brightens parts of the wall, so it asks for a bit more contrast)
    const sunny = look.glow + look.beam + look.haze > 0;
    s.setProperty("--on-wall", contrast(wall, WHITE) >= (sunny ? 2.4 : 2.2) ? WHITE : INK);
  }
  function set(hex) {
    hex = normalise(hex); if (!hex) return;
    current = hex; apply(hex);
    listeners.forEach((fn) => fn(wallOf(WALL_BASE), look));
  }
  apply(current);

  window.Theme = {
    get: () => current,                 // the colour used on buttons
    wall: () => wallOf(WALL_BASE),      // the colour the wall is painted
    look: () => look,
    setLook: (l) => { look = Object.assign({ soft: 0, glow: 0, beam: 0, haze: 0, shade: 1 }, l); set(current); },
    try: (hex) => set(hex),             // for the explore pages
    set: (hex) => set(hex),
    onChange: (fn) => listeners.push(fn),   // fn(wallHex, look)
    DEFAULT: BUTTON,
  };
})();
