/* ============================================================================
   SmileCare Dental Studio — main.js
   ----------------------------------------------------------------------------
   A tiny dependency-free render engine. Every section on every page is built
   from `window.SITE_DATA` (data/site-data.js) at load time, so updating the
   website means editing that one JSON file — never this one.

   HOW IT WORKS
   ------------
   Each placeholder in the HTML looks like:
       <div data-section="services" data-limit="6"></div>
   On boot, main.js finds every [data-section] element and renders the matching
   builder from the `SECTIONS` map below into it.

   Available data-section values (see README.md for the full table):
     page-hero · hero · hero-stats · marquee · stats · why-us · services
     about · values · principles · process · timeline · doctors · gallery
     before-after · testimonials · faq · cta · contact-cards · contact-form
     map · hours
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------ DATA */
  var D = window.SITE_DATA || {};
  if (!D.clinic) {
    console.error("SITE_DATA missing — check that data/site-data.js is loaded before main.js.");
    return;
  }

  /* ------------------------------------------------------------------ UTIL */
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var money = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ","); };
  var attr = function (o) {
    return Object.keys(o).map(function (k) { return k + '="' + esc(o[k]) + '"'; }).join(" ");
  };
  var deep = function (path, fallback) {
    var out = path.split(".").reduce(function (a, k) { return a && a[k] != null ? a[k] : null; }, D);
    return out == null ? fallback : out;
  };
  var hasIO = "IntersectionObserver" in window;
  /* shared registry for the gallery grid + lightbox */
  var GALLERY = { tiles: [], visible: [], layout: null, currentFilter: "All" };
  var debounce = function (fn, ms) {
    var t;
    return function () { var a = arguments, self = this; clearTimeout(t); t = setTimeout(function () { fn.apply(self, a); }, ms || 150); };
  };

  /* ----------------------------------------------------------------- ICONS */
  /* Line icons (stroke) — 24×24 grid, currentColor */
  var L = {
    tooth:      "M12 5.4C10.4 3.9 8.9 3.2 7.4 3.2 5.2 3.2 3.6 4.9 3.6 7.5c0 2 .6 3.4 1.2 5.2.5 1.5.8 3.1 1 4.7.2 1.4.6 2.8 1.7 2.8 1.3 0 1.6-1.8 1.9-3.6.3-1.7.6-3.2 2.6-3.2s2.3 1.5 2.6 3.2c.3 1.8.6 3.6 1.9 3.6 1.1 0 1.5-1.4 1.7-2.8.2-1.6.5-3.2 1-4.7.6-1.8 1.2-3.2 1.2-5.2 0-2.6-1.6-4.3-3.8-4.3-1.5 0-3 .7-4.6 2.2Z",
    shield:     "M12 3 5 6v5.6c0 4.2 2.9 7.7 7 8.6 4.1-.9 7-4.4 7-8.6V6l-7-3Zm-2.2 8.9 1.9 1.9 3.9-3.9",
    clock:      "M12 3.2a8.8 8.8 0 1 0 0 17.6 8.8 8.8 0 0 0 0-17.6ZM12 7.6V12l3.1 2",
    phone:      "M15.6 20.8A13.4 13.4 0 0 1 3.2 8.4 3.4 3.4 0 0 1 6.6 5h1.2c.6 0 1.1.4 1.3 1l.9 2.5c.2.5 0 1-.3 1.4l-1.2 1a11.2 11.2 0 0 0 4.6 4.6l1-1.2c.4-.4.9-.5 1.4-.3l2.5.9c.6.2 1 .7 1 1.3v1.2a3.4 3.4 0 0 1-3.4 3.4Z",
    mail:       "M4 5.5h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1Zm-.4 1.2 8.4 6 8.4-6",
    pin:        "M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11Z|M12 7.4a2.6 2.6 0 1 0 0 5.2 2.6 2.6 0 0 0 0-5.2Z",
    check:      "m5 12.6 4.4 4.4L19 7.4",
    checkCircle:"M12 3.2a8.8 8.8 0 1 0 0 17.6 8.8 8.8 0 0 0 0-17.6Zm-3.2 8.9 2.2 2.2 4.3-4.3",
    chevronDown:"m6 9.5 6 6 6-6",
    chevronLeft:"m14.5 6.2-5.8 5.8 5.8 5.8",
    chevronRight:"m9.5 6.2 5.8 5.8-5.8 5.8",
    arrowRight: "M4.5 12h15m-6-6 6 6-6 6",
    arrowUp:    "M12 19.5V4.8m-6 6 6-6 6 6",
    close:      "M6.2 6.2 17.8 17.8M17.8 6.2 6.2 17.8",
    sparkle:    "M12 3.4l1.7 4.8 4.8 1.7-4.8 1.7L12 16.4l-1.7-4.8L5.5 9.9l4.8-1.7L12 3.4Z|M18.6 15.4l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7.7-1.9Z",
    activity:   "M3 12.4h3.3l2-5.6 3.3 10.8 2.4-5.2H21",
    heart:      "M12 20.3s-7.4-4.5-7.4-9.6a4.3 4.3 0 0 1 7.4-2.8 4.3 4.3 0 0 1 7.4 2.8c0 5.1-7.4 9.6-7.4 9.6Z",
    users:      "M9 11.4a3.4 3.4 0 1 0 0-6.8 3.4 3.4 0 0 0 0 6.8ZM2.8 19.6c0-3.1 2.8-5.6 6.2-5.6s6.2 2.5 6.2 5.6|M16.4 5.3a3.4 3.4 0 0 1 0 6.6M17.5 14.5c2.2.5 3.7 2.3 3.7 4.4",
    scan:       "M4 8.6V6.2A2.2 2.2 0 0 1 6.2 4h2.4M4 15.4v2.4A2.2 2.2 0 0 0 6.2 20h2.4m7.2-16h2.4A2.2 2.2 0 0 1 20 6.2v2.4m0 6.8v2.4A2.2 2.2 0 0 1 17.8 20h-2.4M3.2 12h17.6",
    award:      "M12 4a4.8 4.8 0 1 0 0 9.6A4.8 4.8 0 0 0 12 4Zm-3.1 8.9L7.5 20.4 12 18l4.5 2.4-1.4-7.5",
    wallet:     "M4 7.4A2.4 2.4 0 0 1 6.4 5h11.2A2.4 2.4 0 0 1 20 7.4v9.2a2.4 2.4 0 0 1-2.4 2.4H6.4A2.4 2.4 0 0 1 4 16.6V7.4Zm12.6 3.4h1.6M4 9.6h16",
    crown:      "M4 16.6 5.6 7.4l4.1 4L12 6l2.3 5.4 4.1-4L20 16.6H4Zm.4 3.2h15.2",
    implant:    "M12 4.2a3.5 3.5 0 0 1 3.5 3.5c0 1.9-1.6 3.5-3.5 3.5S8.5 9.6 8.5 7.7A3.5 3.5 0 0 1 12 4.2Z|M10.2 11.6h3.6M10.4 14h3.2M10.8 16.4h2.4M11.2 18.8h1.6M12 11.6v8.4",
    braces:     "M4 12h16M7.4 9v6M12 9v6M16.6 9v6",
    extract:    "M12 5.4C10.4 3.9 8.9 3.2 7.4 3.2 5.2 3.2 3.6 4.9 3.6 7.5c0 2 .6 3.4 1.2 5.2.5 1.5.8 3.1 1 4.7.2 1.4.6 2.8 1.7 2.8 1.3 0 1.6-1.8 1.9-3.6.3-1.7.6-3.2 2.6-3.2s2.3 1.5 2.6 3.2c.3 1.8.6 3.6 1.9 3.6 1.1 0 1.5-1.4 1.7-2.8.2-1.6.5-3.2 1-4.7.6-1.8 1.2-3.2 1.2-5.2 0-2.6-1.6-4.3-3.8-4.3-1.5 0-3 .7-4.6 2.2Z|M17.6 15.6l3 3m0-3-3 3",
    emergency:  "M12 3.2a8.8 8.8 0 1 0 0 17.6 8.8 8.8 0 0 0 0-17.6ZM12 8.2v7.6M8.2 12h7.6",
    eye:        "M12 5.4c-4.6 0-8.2 4.1-8.2 6.6s3.6 6.6 8.2 6.6 8.2-4.1 8.2-6.6-3.6-6.6-8.2-6.6Zm0 3.6a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z",
    expand:     "M9 4.5H5.6a1 1 0 0 0-1 1V9m10-4.5h3.4a1 1 0 0 1 1 1V9m-14.4 6v3.4a1 1 0 0 0 1 1H9m10-4.4v3.4a1 1 0 0 1-1 1h-3.4",
    calendar:   "M4.5 6.6A1.6 1.6 0 0 1 6 5h12a1.6 1.6 0 0 1 1.6 1.6v11.8A1.6 1.6 0 0 1 18 20H6a1.6 1.6 0 0 1-1.6-1.6V6.6ZM8 3.4V6.5m8-3.1V6.5M4.5 10h15",
    drag:       "M9.5 7.5 5.6 12l3.9 4.5M14.5 7.5 18.4 12l-3.9 4.5",
    quote:      "M9.6 6C6.9 7.2 5.2 9.7 5.2 13v5h5.4v-6.4H8.2c.2-1.6 1.2-3 3-3.8L9.6 6Zm9 0c-2.7 1.2-4.4 3.7-4.4 7v5h5.4v-6.4h-2.4c.2-1.6 1.2-3 3-3.8L18.6 6Z",
    leaf:       "M19.5 4.5C11 4.5 5.5 8.3 5.5 14a5.7 5.7 0 0 0 5.7 5.7c5.7 0 8.3-5.5 8.3-15.2ZM5 20c1.5-4 4.5-7.4 8.5-9.6",
    target:     "M12 3.4a8.6 8.6 0 1 0 0 17.2 8.6 8.6 0 0 0 0-17.2Zm0 4.4a4.2 4.2 0 1 0 0 8.4 4.2 4.2 0 0 0 0-8.4Zm0 4.2h0",
    sms:        "M4.5 6.6A1.6 1.6 0 0 1 6 5h12a1.6 1.6 0 0 1 1.6 1.6v7.2A1.6 1.6 0 0 1 18 15.4H9.4L5.6 19v-3.6A1.6 1.6 0 0 1 4.5 14V6.6Z",
    home:       "M3.6 10.6 12 4l8.4 6.6V19a1.4 1.4 0 0 1-1.4 1.4h-3.6v-6h-6.8v6H5A1.4 1.4 0 0 1 3.6 19v-8.4Z",
    smile:      "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z|M9.2 9.4v1.5|M14.8 9.4v1.5|M8.3 14c.9 1.5 2.2 2.2 3.7 2.2s2.8-.7 3.7-2.2",
    baby:       "M10.6 7.3V5.8a1.4 1.4 0 0 1 2.8 0v1.5|M5.7 7.3h12.6v2.6c0 3-2.9 5.2-6.3 5.2s-6.3-2.2-6.3-5.2V7.3Z|M12 15.1a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 0 0 0-5.4Z",
    images:     "M4.4 6.6h15.2a1.4 1.4 0 0 1 1.4 1.4v9.6a1.4 1.4 0 0 1-1.4 1.4H4.4A1.4 1.4 0 0 1 3 17.6V8a1.4 1.4 0 0 1 1.4-1.4ZM8.6 9.4a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8Zm10.2 7.6-4.3-4.6-5.2 5.6"
  };
  /* Filled icons (brand marks, stars) */
  var F = {
    star:      "M12 3.3l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17.2l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3.3Z",
    whatsapp:  "M12 2.1A9.8 9.8 0 0 0 3.6 17L2.2 22l5.1-1.4A9.8 9.8 0 1 0 12 2.1Zm5.7 13.9c-.2.7-1.4 1.3-1.9 1.3-.5.1-1 .2-3.4-.7-2.9-1.2-4.7-4.2-4.9-4.4-.1-.2-1.1-1.5-1.1-2.9s.7-2.1 1-2.4c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5.2.5.8 1.9.8 2 .1.2.1.3 0 .5-.1.2-.1.3-.3.5l-.4.5c-.2.2-.3.3-.1.6.2.3.7 1.2 1.6 2 1.1.9 2 1.2 2.3 1.4.3.1.4.1.6-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.6-.1.2.1 1.6.8 1.9.9.3.1.5.2.5.3.1.1.1.7-.1 1.4Z",
    facebook:  "M13.9 9.6h2.6l.4-3h-3V4.9c0-.9.2-1.5 1.5-1.5h1.6V.7A21 21 0 0 0 14.6.6c-2.4 0-4 1.4-4 4.1v1.9H8v3h2.6v9.3h3.3V9.6Z",
    instagram: "M12 2.4c-2.6 0-2.9 0-3.9.1-1 .1-1.7.2-2.3.5a4.6 4.6 0 0 0-1.7 1.1 4.6 4.6 0 0 0-1.1 1.7c-.3.6-.4 1.3-.5 2.3 0 1-.1 1.3-.1 3.9s0 2.9.1 3.9c.1 1 .2 1.7.5 2.3.3.6.6 1.2 1.1 1.7.5.5 1 .8 1.7 1.1.6.3 1.3.4 2.3.5 1 0 1.3.1 3.9.1s2.9 0 3.9-.1c1-.1 1.7-.2 2.3-.5a4.9 4.9 0 0 0 2.8-2.8c.3-.6.4-1.3.5-2.3 0-1 .1-1.3.1-3.9s0-2.9-.1-3.9c-.1-1-.2-1.7-.5-2.3a4.6 4.6 0 0 0-1.1-1.7 4.6 4.6 0 0 0-1.7-1.1c-.6-.3-1.3-.4-2.3-.5-1 0-1.3-.1-3.9-.1Zm0 1.8c2.5 0 2.8 0 3.8.1.9 0 1.4.2 1.7.3.4.2.7.4 1 .7.3.3.5.6.7 1 .1.3.2.8.3 1.7 0 1 .1 1.3.1 3.8s0 2.8-.1 3.8c0 .9-.2 1.4-.3 1.7-.2.4-.4.7-.7 1-.3.3-.6.5-1 .7-.3.1-.8.2-1.7.3-1 0-1.3.1-3.8.1s-2.8 0-3.8-.1c-.9 0-1.4-.2-1.7-.3-.4-.2-.7-.4-1-.7a2.7 2.7 0 0 1-.7-1c-.1-.3-.2-.8-.3-1.7 0-1-.1-1.3-.1-3.8s0-2.8.1-3.8c0-.9.2-1.4.3-1.7.2-.4.4-.7.7-1 .3-.3.6-.5 1-.7.3-.1.8-.2 1.7-.3 1 0 1.3-.1 3.8-.1Zm0 3.1a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4Zm0 7.8a3 3 0 1 1 0-6.1 3 3 0 0 1 0 6.1Zm6-8a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0Z",
    youtube:   "M21.6 7.2s-.2-1.4-.8-2c-.8-.8-1.7-.8-2.1-.9C16.9 4.1 12 4.1 12 4.1h0s-4.9 0-6.7.2c-.4.1-1.3.1-2.1.9-.6.6-.8 2-.8 2S2.2 8.8 2.2 10.4v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.8.8 1.8.8 2.2.9 1.6.1 6.6.2 6.6.2s4.9 0 6.7-.2c.4-.1 1.3-.1 2.1-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5c0-1.6-.2-3.2-.2-3.2ZM9.9 14.2V8.6l5.7 2.8-5.7 2.8Z",
    linkedin:  "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6.5 0h3.8v1.7h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.4 4.7 5.6V21h-4v-5.9c0-1.4 0-3.2-2-3.2s-2.3 1.5-2.3 3.1V21h-4V9Z"
  };
  function icon(name, cls) {
    if (F[name]) {
      return '<svg viewBox="0 0 24 24" fill="currentColor" class="' + (cls || "") + '" aria-hidden="true"><path d="' + F[name] + '"/></svg>';
    }
    var d = L[name] || L.tooth;
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" class="' +
      (cls || "") + '" aria-hidden="true">' + d.split("|").map(function (p) { return '<path d="' + p + '"/>'; }).join("") + "</svg>";
  }
  window.scIcon = icon; // expose for small inline uses

  /* --------------------------------------------------------- IMAGE FALLBACK */
  var PLACEHOLDER = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 440">' +
    '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="#e7f7f5"/><stop offset="1" stop-color="#ccf1f7"/></linearGradient></defs>' +
    '<rect width="640" height="440" fill="url(#g)"/>' +
    '<g fill="none" stroke="#0d9488" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity=".55" transform="translate(272 165) scale(4)">' +
    '<path d="M12 5.4C10.4 3.9 8.9 3.2 7.4 3.2 5.2 3.2 3.6 4.9 3.6 7.5c0 2 .6 3.4 1.2 5.2.5 1.5.8 3.1 1 4.7.2 1.4.6 2.8 1.7 2.8 1.3 0 1.6-1.8 1.9-3.6.3-1.7.6-3.2 2.6-3.2s2.3 1.5 2.6 3.2c.3 1.8.6 3.6 1.9 3.6 1.1 0 1.5-1.4 1.7-2.8.2-1.6.5-3.2 1-4.7.6-1.8 1.2-3.2 1.2-5.2 0-2.6-1.6-4.3-3.8-4.3-1.5 0-3 .7-4.6 2.2Z"/></g>' +
    '<text x="320" y="330" text-anchor="middle" font-family="Poppins,Arial,sans-serif" font-size="20" fill="#0f766e" opacity=".7">' +
    "Photo placeholder — add your image in data/site-data.js</text></svg>"
  );
  function img(src, alt, extra) {
    var o = Object.assign({
      src: src || PLACEHOLDER, alt: alt || "", loading: "lazy", decoding: "async",
      onerror: "this.onerror=null;this.classList.add('img-broken');this.src='" + PLACEHOLDER + "'"
    }, extra || {});
    return "<img " + attr(o) + ">";
  }

  /* --------------------------------------------------------------- THEME */
  /* "#0b8278" | "#0b8" -> "11,130,120" (for rgba(var(--brand-rgb), .12) tints) */
  function hexToRgb(hex) {
    var h = String(hex || "").trim().replace("#", "");
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    if (!/^[0-9a-f]{6}$/i.test(h)) return null;
    return parseInt(h.slice(0, 2), 16) + "," + parseInt(h.slice(2, 4), 16) + "," + parseInt(h.slice(4, 6), 16);
  }

  function applyTheme() {
    var t = D.theme || {}, r = document.documentElement.style;
    var map = { "--brand": t.brand, "--brand-dark": t.brandDark, "--brand-deep": t.brandDeep, "--accent": t.accent, "--accent2": t.accent2, "--ink": t.ink, "--muted": t.muted, "--bg": t.bg, "--bg-soft": t.bgSoft, "--radius": t.radius };
    Object.keys(map).forEach(function (k) { if (map[k]) r.setProperty(k, map[k]); });
    /* every soft tint / glow / shadow in the stylesheet is built from these
       triplets, so changing one colour above re-skins the whole site —
       including the translucent hover states and glows */
    var rgbs = { "--brand-rgb": t.brand, "--brand-dark-rgb": t.brandDark, "--brand-deep-rgb": t.brandDeep, "--accent-rgb": t.accent, "--accent2-rgb": t.accent2, "--ink-rgb": t.ink };
    Object.keys(rgbs).forEach(function (k) {
      var v = hexToRgb(rgbs[k]);
      if (v) r.setProperty(k, v);
    });
    var meta = $('meta[name="theme-color"]');
    if (meta && t.brand) meta.setAttribute("content", t.brand);
  }

  /* -------------------------------------------------------------- FONTS */
  /* The <link> in each page handles normal browsing. Inside sandboxed
     previews external stylesheets can be blocked, so we also try a runtime
     injector and silently fall back to the system font stack if it fails.
     Tip: for a fully offline build, download Poppins + Sora and point the
     @font-face rules at local files. */
  function initFonts() {
    /* the <link> in each page normally does the job — only inject when the
       page is being viewed without it (e.g. a fragment copied elsewhere) */
    var hasLink = $$('link[rel="stylesheet"]').some(function (l) {
      return /fonts\.googleapis\.com/.test(l.getAttribute("href") || "");
    });
    if (hasLink || $("link[data-fonts]")) return;
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.setAttribute("data-fonts", "1");
    l.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap";
    l.onerror = function () { /* offline or blocked — system fonts take over */ };
    document.head.appendChild(l);
  }

  /* ------------------------------------------------------------- SEO / META */
  function applySeo() {
    var page = document.body.getAttribute("data-page") || "home";
    var s = (D.seo || {})[page];
    if (!s) return;
    document.title = s.title;
    var m = $('meta[name="description"]');
    if (m) m.setAttribute("content", s.description);
  }

  /* ------------------------------------------------------------ SHARED BITS */
  function brandMarkup() {
    var c = D.clinic, parts = String(c.logoText || c.short || c.name).split(" ");
    var styled = parts.length > 1 ? esc(parts[0]) + "<span>" + esc(parts.slice(1).join(" ")) + "</span>" : "<span>" + esc(parts[0]) + "</span>";
    return '<a class="brand" href="index.html" aria-label="' + esc(c.name) + ' home">' +
      '<span class="brand-mark">' + icon("tooth") + "</span>" +
      '<span><span class="brand-name">' + styled + "</span>" +
      (c.tagline ? '<span class="brand-sub">' + esc(c.tagline) + "</span>" : "") + "</span></a>";
  }

  function sectionHead(o) {
    if (!o || !o.title) return "";
    return '<div class="section-head' + (o.center === false ? "" : " center") + ' reveal">' +
      (o.eyebrow ? '<span class="eyebrow">' + esc(o.eyebrow) + "</span>" : "") +
      "<h2>" + esc(o.title) + "</h2>" +
      (o.subtitle ? "<p>" + esc(o.subtitle) + "</p>" : "") + "</div>";
  }
  function delay(i) { return ' style="--d:' + (i * 70) + 'ms"'; }
  function stars(n) {
    var out = "";
    for (var i = 0; i < (n || 5); i++) out += icon("star");
    return '<span class="stars" aria-label="' + (n || 5) + ' out of 5">' + out + "</span>";
  }
  function initials(name) {
    return String(name || "").replace(/^(Dr\.?|Mr\.?|Ms\.?|Mrs\.?)\s*/i, "").trim().split(/\s+/).slice(0, 2)
      .map(function (w) { return w.charAt(0); }).join("").toUpperCase();
  }
  function tel() { return "tel:" + (D.clinic.phoneRaw || "").replace(/\s/g, ""); }
  function mailto(addr) { return "mailto:" + String(addr || "").trim(); }
  function waLink(text) {
    return "https://wa.me/" + String(D.clinic.whatsapp || "").replace(/[^\d]/g, "") +
      (text ? "?text=" + encodeURIComponent(text) : "");
  }

  /* =====================================================================
     SECTION BUILDERS
     ===================================================================== */

  var SECTIONS = {

    /* -------------------------------------------------------- PAGE HERO */
    "page-hero": function (host) {
      var page = document.body.getAttribute("data-page");
      var p = deep("pageHeroes." + page, {}) || {};
      var c = D.clinic;
      host.innerHTML =
        '<div class="hero-bg"><span class="blob b1"></span><span class="blob b2"></span></div>' +
        '<div class="container"><div class="page-hero-inner">' +
          (p.eyebrow ? '<span class="eyebrow">' + esc(p.eyebrow) + "</span>" : "") +
          "<h1>" + esc(p.title || c.name) + "</h1>" +
          (p.subtitle ? "<p>" + esc(p.subtitle) + "</p>" : "") +
          '<nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a>' + icon("chevronRight") +
              "<span>" + esc(p.crumb || p.title || page) + "</span></nav>" +
        "</div></div>" +
        '<div class="page-hero-wave"><svg viewBox="0 0 1440 60" preserveAspectRatio="none">' +
          '<path d="M0 34c180 26 360 26 540 8s360-30 540-14 260 30 360 24v8H0z" fill="#ffffff"/></svg></div>';
    },

    /* ------------------------------------------------------------- HERO */
    hero: function (host) {
      var h = D.hero, c = D.clinic;
      var stats = (h.stats || []).map(function (s, i) {
        return '<div class="hero-stat reveal" data-reveal' + delay(i) + '><div class="num"><span class="counter" data-to="' +
          s.value + '" data-decimals="' + (s.decimals || 0) + '">0</span><span>' + esc(s.suffix || "") +
          "</span></div><small>" + esc(s.label) + "</small></div>";
      }).join("");
      var points = (h.points || []).map(function (p) { return "<li>" + icon("checkCircle") + "<span>" + esc(p) + "</span></li>"; }).join("");
      var floats = (h.floatCards || []).map(function (f, i) {
        return '<div class="float-card c' + (i + 1) + '"><span class="fc-icon">' + icon(f.icon) + "</span><span><strong>" +
          esc(f.title) + "</strong><span>" + esc(f.text) + "</span></span></div>";
      }).join("");

      host.innerHTML =
        '<div class="hero-bg"><span class="blob b1"></span><span class="blob b2"></span><span class="blob b3"></span></div>' +
        '<div class="container">' +
          '<div class="hero-inner">' +
            '<div class="hero-copy">' +
              (h.badge ? '<span class="eyebrow">' + esc(h.badge) + "</span>" : "") +
              "<h1><span class=\"line\">" + esc(h.titleTop) + "</span><span class=\"line gradient-text\">" + esc(h.titleAccent) + "</span></h1>" +
              '<p class="hero-lede">' + esc(h.subtitle) + "</p>" +
              '<div class="hero-actions">' +
                '<a class="btn btn--lg btn-pulse" href="' + esc(h.primaryCta.href) + '">' + esc(h.primaryCta.label) + icon("arrowRight") + "</a>" +
                '<a class="btn btn--ghost btn--lg" href="' + esc(h.secondaryCta.href) + '">' + esc(h.secondaryCta.label) + "</a>" +
              "</div>" +
              '<ul class="hero-points">' + points + "</ul>" +
            "</div>" +
            '<div class="hero-visual">' +
              '<div class="hero-frame">' + img(h.image, h.imageAlt, { loading: "eager", fetchpriority: "high" }) + "</div>" +
              '<span class="hero-ring"></span>' + floats +
              '<div class="hero-rating">' + stars(5) +
                "<span><strong>" + esc(c.rating) + "/5</strong><small>" + esc(c.reviewCount) + "+ Google reviews</small></span>" +
              "</div>" +
            "</div>" +
          "</div>" +
          '<div class="hero-stats"><div class="hero-stats-inner">' + stats + "</div></div>" +
        "</div>";
    },

    /* ---------------------------------------------------------- MARQUEE */
    marquee: function (host) {
      var items = (D.marquee || []).map(function (t) { return '<span class="marquee-item">' + icon("sparkle") + esc(t) + "</span>"; }).join("");
      host.innerHTML = '<div class="container"><div class="marquee-track">' + items + items + "</div></div>";
    },

    /* ------------------------------------------------------------ STATS */
    stats: function (host) {
      var items = (D.stats || []).map(function (s, i) {
        return '<div class="stat-card reveal" data-reveal' + delay(i) + '><span class="stat-icon">' + icon(s.icon || "award") + "</span>" +
          '<div class="stat-num"><span class="counter" data-to="' + s.value + '" data-decimals="' + (s.decimals || 0) + '">0</span><span>' +
          esc(s.suffix || "") + "</span></div><small>" + esc(s.label) + "</small></div>";
      }).join("");
      host.innerHTML = '<div class="container"><div class="stats-band">' + items + "</div></div>";
    },

    /* ----------------------------------------------------------- WHY US */
    "why-us": function (host) {
      var w = D.whyUs;
      var cards = (w.items || []).map(function (it, i) {
        return '<article class="card reveal" data-reveal' + delay(i) + '><span class="card-icon">' + icon(it.icon) + "</span>" +
          "<h3>" + esc(it.title) + "</h3><p>" + esc(it.text) + "</p></article>";
      }).join("");
      host.innerHTML = '<div class="container">' + sectionHead(w) + '<div class="grid g-3">' + cards + "</div></div>";
    },

    /* -------------------------------------------------------- SERVICES */
    services: function (host) {
      var limit = parseInt(host.getAttribute("data-limit") || "0", 10);
      var filtering = host.getAttribute("data-filter") === "1";
      var items = D.services || [];
      var shown = limit ? items.slice(0, limit) : items;

      var cards = shown.map(function (s, i) { return serviceCard(s, i); }).join("");

      var filters = "";
      if (filtering) {
        filters = '<div class="filters reveal">' + (D.serviceCategories || []).map(function (c, i) {
          return '<button type="button" class="filter-btn' + (i === 0 ? " active" : "") + '" data-filter="' + esc(c) + '">' + esc(c) + "</button>";
        }).join("") + "</div>";
      }

      var head = host.getAttribute("data-head") === "0" ? "" : sectionHead(D.serviceIntro);
      var more = "";
      if (limit && items.length > limit) {
        more = '<div class="center reveal" style="margin-top:2.6rem"><a class="btn" href="services.html">' +
          esc(D.ui.viewAll) + icon("arrowRight") + "</a></div>";
      }

      host.innerHTML = '<div class="container">' + head + filters + '<div class="grid g-3" id="services-grid">' + cards + "</div>" + more + "</div>";

      if (filtering) {
        $$(".filter-btn", host).forEach(function (btn) {
          btn.addEventListener("click", function () {
            var f = btn.getAttribute("data-filter");
            $$(".filter-btn", host).forEach(function (b) { b.classList.toggle("active", b === btn); });
            $$(".service-card", host).forEach(function (card) {
              var match = f === "All" || card.getAttribute("data-category") === f;
              card.classList.toggle("hidden", !match);
              if (match) { card.classList.remove("pop"); void card.offsetWidth; card.classList.add("pop"); }
            });
            toast("Showing: " + f);
          });
        });
      }
    },

    /* ------------------------------------------------------------ ABOUT */
    about: function (host) {
      var a = D.about;
      var points = (a.points || []).map(function (p) { return "<li><span class=\"tick\">" + icon("check") + "</span><span>" + esc(p) + "</span></li>"; }).join("");
      var sig = a.signature || {};
      host.innerHTML = '<div class="container"><div class="split">' +
        '<div class="reveal-l">' +
          (a.eyebrow ? '<span class="eyebrow">' + esc(a.eyebrow) + "</span>" : "") +
          "<h2 style=\"margin:1rem 0 .9rem\">" + esc(a.title) + "</h2>" +
          "<p>" + esc(a.paragraph1) + "</p>" +
          '<p style="margin-top:.9rem">' + esc(a.paragraph2) + "</p>" +
          '<ul class="check-list">' + points + "</ul>" +
          '<div class="signature">' +
            img("assets/img/doctor-1.jpg", sig.name || "Doctor", { "class": "avatar" }) +
            "<span><strong>" + esc(sig.name || "") + "</strong><small>" + esc(sig.role || "") + "</small></span>" +
            '<a class="link-arrow" style="margin-left:auto" href="about.html">About us' + icon("arrowRight") + "</a>" +
          "</div>" +
        "</div>" +
        '<div class="media-frame media-frame--tall reveal-r">' + img(a.image, a.imageAlt) +
          '<div class="media-badge"><span class="big">' + esc(a.since) + '</span><span><small>Serving Solapur</small><small>since</small></span></div>' +
        "</div>" +
      "</div></div>";
    },

    /* ----------------------------------------------------------- VALUES */
    values: function (host) {
      var v = (D.values || []).map(function (it, i) {
        return '<article class="card value-card reveal" data-reveal' + delay(i) + '><span class="card-icon">' + icon(it.icon) + "</span>" +
          "<h3>" + esc(it.title) + "</h3><p>" + esc(it.text) + "</p></article>";
      }).join("");
      var p = (D.principles || []).map(function (it, i) {
        return '<div class="tl-item reveal" data-reveal' + delay(i) + '><h3>' + esc(it.title) + "</h3><p>" + esc(it.text) + "</p></div>";
      }).join("");
      host.innerHTML = '<div class="container">' +
        '<div class="grid g-3">' + v + "</div>" +
        '<div class="split" style="margin-top:3.6rem"><div><span class="eyebrow">How we practise</span>' +
          "<h2 style=\"margin:1rem 0 1.6rem\">Four rules we never bend</h2>" +
          '<div class="timeline">' + p + "</div></div>" +
          '<div class="media-frame reveal-r">' + img(D.about.image, "SmileCare clinic interior") + "</div>" +
        "</div></div>";
    },

    /* ---------------------------------------------------------- PROCESS */
    process: function (host) {
      var p = D.process;
      var steps = (p.steps || []).map(function (s, i) {
        return '<article class="step reveal" data-reveal' + delay(i) + '><span class="step-num">' + (i + 1) + "</span>" +
          '<span class="step-icon">' + icon(s.icon) + "</span><h3>" + esc(s.title) + "</h3><p>" + esc(s.text) + "</p></article>";
      }).join("");
      host.innerHTML = '<div class="container">' + sectionHead(p) + '<div class="steps">' + steps + "</div></div>";
    },

    /* --------------------------------------------------------- TIMELINE */
    timeline: function (host) {
      var t = (D.timeline || []).map(function (it, i) {
        return '<div class="tl-item reveal" data-reveal' + delay(i) + '><span class="tl-year">' + esc(it.year) + "</span>" +
          "<h3>" + esc(it.title) + "</h3><p>" + esc(it.text) + "</p></div>";
      }).join("");
      host.innerHTML = '<div class="container"><div class="split">' +
        '<div><span class="eyebrow">Our journey</span><h2 style="margin:1rem 0 1.8rem">Fifteen years of steady growth</h2>' +
        '<div class="timeline">' + t + "</div></div>" +
        '<div class="media-frame reveal-r">' + img("assets/img/gallery-treatment-room.jpg", "Treatment room") + "</div>" +
      "</div></div>";
    },

    /* ---------------------------------------------------------- DOCTORS */
    doctors: function (host) {
      var limit = parseInt(host.getAttribute("data-limit") || "0", 10);
      var list = D.doctors || [];
      if (limit) list = list.slice(0, limit);
      var cards = list.map(function (d, i) {
        var tags = (d.specialties || []).map(function (s) { return '<span class="chip">' + esc(s) + "</span>"; }).join("");
        var socials = Object.keys(D.clinic.social || {}).map(function (k) {
          return '<a href="' + esc(D.clinic.social[k]) + '" target="_blank" rel="noopener" aria-label="' + esc(k) + '">' + icon(k) + "</a>";
        }).join("");
        return '<article class="card doctor-card reveal" data-reveal' + delay(i) + '>' +
          '<div class="doctor-photo">' + img(d.image, d.name) + '<div class="doctor-socials">' + socials + "</div></div>" +
          '<div class="doctor-body"><h3>' + esc(d.name) + "</h3>" +
            '<div class="doctor-role">' + esc(d.role) + "</div>" +
            '<div class="doctor-qual">' + esc(d.qualification) + " · " + esc(d.experience) + "</div>" +
            '<p class="bio">' + esc(d.bio) + "</p>" +
            '<div class="doctor-tags">' + tags + "</div>" +
          "</div></article>";
      }).join("");
      var head = host.getAttribute("data-head") === "0" ? "" :
        sectionHead({ eyebrow: "Meet the team", title: "Specialists who actually listen", subtitle: "Fourteen hands-on years of combined experience, all under one roof." });
      var cta = host.getAttribute("data-cta") === "1" ?
        '<div class="center reveal" style="margin-top:2.4rem"><a class="btn btn--ghost" href="about.html">More about our team' + icon("arrowRight") + "</a></div>" : "";
      host.innerHTML = '<div class="container">' + head + '<div class="grid g-3">' + cards + "</div>" + cta + "</div>";
    },

    /* -------------------------------------------------- BEFORE / AFTER */
    "before-after": function (host) {
      var b = D.beforeAfter || {};
      host.innerHTML = '<div class="container">' +
        sectionHead({ eyebrow: "Results", title: b.title, subtitle: b.subtitle }) +
        '<div class="ba-wrap reveal-s" id="ba-slider" tabindex="0" role="slider" aria-label="Before and after comparison" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50">' +
          '<div class="ba-before">' + img(b.before, b.beforeLabel + " treatment photo") + "</div>" +
          img(b.after, b.afterLabel + " treatment photo") +
          '<span class="ba-label before">' + esc(b.beforeLabel || "Before") + "</span>" +
          '<span class="ba-label after">' + esc(b.afterLabel || "After") + "</span>" +
          '<div class="ba-handle"><span class="ba-knob">' + icon("drag") + "</span></div>" +
        "</div>" +
        (b.note ? '<p class="center" style="margin-top:1rem;font-size:.82rem">' + esc(b.note) + "</p>" : "") +
      "</div>";
    },

    /* ----------------------------------------------------------- GALLERY */
    gallery: function (host) {
      var limit = parseInt(host.getAttribute("data-limit") || "0", 10);
      var filtering = host.getAttribute("data-filter") === "1";
      var items = D.gallery || [];
      var shown = limit ? items.slice(0, limit) : items;

      var cats = D.galleryCategories || [];
      var filters = filtering ? '<div class="filters reveal">' + cats.map(function (c, i) {
        return '<button type="button" class="filter-btn' + (i === 0 ? " active" : "") + '" data-filter="' + esc(c) + '">' + esc(c) + "</button>";
      }).join("") + "</div>" : "";

      var head = host.getAttribute("data-head") === "0" ? "" : sectionHead(D.galleryIntro);
      var cta = limit ? '<div class="center reveal" style="margin-top:2.4rem"><a class="btn btn--ghost" href="gallery.html">' +
        esc(D.ui.seeAll) + icon("arrowRight") + "</a></div>" : "";

      host.innerHTML = '<div class="container">' + head + filters + '<div class="masonry" id="gallery-grid"></div>' + cta + "</div>";

      /* build the tiles once, then lay them out in balanced columns
         (a JS masonry keeps rows aligned — CSS columns would leave gaps) */
      var grid = $("#gallery-grid", host);
      var tiles = shown.map(function (g, i) {
        var fig = document.createElement("figure");
        fig.className = "g-item reveal-s";
        fig.setAttribute("data-category", g.category);
        fig.setAttribute("data-tall", g.tall ? "1" : "0");
        fig.style.setProperty("--d", (i % 6) * 70 + "ms");
        fig.innerHTML = img(g.src, g.title) +
          '<span class="g-zoom">' + icon("expand") + "</span>" +
          '<figcaption class="g-overlay"><strong>' + esc(g.title) + "</strong><small>" + esc(g.category) + "</small></figcaption>";
        return fig;
      });

      GALLERY.tiles = tiles;

      function layout(filter) {
        filter = filter || "All";
        var visible = tiles.filter(function (t) { return filter === "All" || t.getAttribute("data-category") === filter; });
        GALLERY.visible = visible;
        var cols = window.innerWidth < 700 ? 1 : (window.innerWidth < 1050 ? 2 : 3);
        if (visible.length < 3) cols = Math.min(cols, 2);
        grid.innerHTML = "";
        grid.classList.add("is-masonry");
        var colEls = [];
        for (var c = 0; c < cols; c++) {
          var col = document.createElement("div");
          col.className = "m-col";
          grid.appendChild(col);
          colEls.push(col);
        }
        /* Classic masonry packing, tallest tile first. Because every column is
           the same width, a tile's height is proportional to its aspect ratio —
           so a real aspect ratio (once the image has loaded) or the `tall`
           flag from the JSON is an exact weight for the shortest-column rule.
           This keeps the bottom edge of the grid tight instead of ragged. */
        var queued = visible.slice().sort(function (a, b) {
          var wa = weightOf(b), wb = weightOf(a);
          if (wa !== wb) return wa - wb;
          return visible.indexOf(a) - visible.indexOf(b);
        });
        queued.forEach(function (t) {
          var shortest = colEls.reduce(function (a, b) { return b.offsetHeight < a.offsetHeight ? b : a; }, colEls[0]);
          shortest.appendChild(t);
        });
        visible.forEach(function (t) { void t.offsetWidth; t.classList.add("pop"); });
      }

      /* tile height ÷ tile width — matches the CSS aspect ratios above */
      function weightOf(tile) { return tile.getAttribute("data-tall") === "1" ? 1.79 : 0.545; }

      layout("All");
      GALLERY.layout = layout;

      /* column count changes with the viewport → re-pack */
      window.addEventListener("resize", debounce(function () {
        layout(GALLERY.currentFilter || "All");
      }, 180));

      if (filtering) {
        $$(".filter-btn", host).forEach(function (btn) {
          btn.addEventListener("click", function () {
            var f = btn.getAttribute("data-filter");
            $$(".filter-btn", host).forEach(function (b) { b.classList.toggle("active", b === btn); });
            GALLERY.currentFilter = f;
            layout(f);
          });
        });
      }
    },

    /* ------------------------------------------------------ TESTIMONIALS */
    testimonials: function (host) {
      var t = D.testimonialsIntro || {};
      var slides = (D.testimonials || []).map(function (r) {
        return '<div class="slide"><div class="slide-inner">' +
          '<span class="quote-mark">' + icon("quote") + "</span>" +
          stars(r.rating) +
          '<p class="slide-text">“' + esc(r.text) + '”</p>' +
          '<div class="slide-person"><span class="avatar-initials">' + esc(initials(r.name)) + "</span>" +
            "<span><strong>" + esc(r.name) + "</strong><small>" + esc(r.city) + " · " + esc(r.treatment) + "</small></span></div>" +
        "</div></div>";
      }).join("");
      var dots = (D.testimonials || []).map(function (_, i) {
        return '<button type="button" class="dot' + (i === 0 ? " active" : "") + '" data-dot="' + i + '" aria-label="Review ' + (i + 1) + '"></button>';
      }).join("");
      host.innerHTML = '<div class="container">' + sectionHead(t) +
        '<div class="slider reveal" id="testimonial-slider">' +
          '<div class="slider-track">' + slides + "</div>" +
        "</div>" +
        '<div class="slider-nav">' +
          '<button type="button" class="slider-btn" data-prev aria-label="Previous review">' + icon("chevronLeft") + "</button>" +
          '<div class="slider-dots">' + dots + "</div>" +
          '<button type="button" class="slider-btn" data-next aria-label="Next review">' + icon("chevronRight") + "</button>" +
        "</div></div>";
    },

    /* --------------------------------------------------------------- FAQ */
    faq: function (host) {
      var limit = parseInt(host.getAttribute("data-limit") || "0", 10);
      var list = D.faqs || [];
      var shown = limit ? list.slice(0, limit) : list;
      var items = shown.map(function (f, i) {
        return '<div class="faq-item reveal" data-reveal' + delay(i) + '>' +
          '<button type="button" class="faq-q" aria-expanded="false"><span>' + esc(f.q) + "</span>" +
            '<span class="faq-sign">' + icon("chevronDown") + "</span></button>" +
          '<div class="faq-a"><div class="faq-a-inner">' + esc(f.a) + "</div></div>" +
        "</div>";
      }).join("");
      var head = host.getAttribute("data-head") === "0" ? "" : sectionHead(limit ? {
        eyebrow: "Questions", title: "Quick answers", subtitle: "The five things patients ask before booking."
      } : D.faqIntro);
      host.innerHTML = '<div class="container-narrow">' + head + '<div class="faq-list">' + items + "</div></div>";
    },

    /* --------------------------------------------------------------- CTA */
    cta: function (host) {
      var c = D.cta;
      var bullets = (c.bullets || []).map(function (b) { return "<li>" + icon("checkCircle") + esc(b) + "</li>"; }).join("");
      host.innerHTML = '<div class="container"><div class="cta-band reveal-s"><div class="inner">' +
        "<div><h2>" + esc(c.title) + "</h2><p>" + esc(c.text) + '</p><ul class="cta-bullets">' + bullets + "</ul></div>" +
        '<div class="cta-actions"><a class="btn btn--light btn--lg" href="' + esc(c.primary.href) + '">' + esc(c.primary.label) + icon("arrowRight") + "</a>" +
        '<a class="btn btn--outline-light btn--lg" href="' + esc(c.secondary.href) + '">' + icon("phone") + esc(c.secondary.label) + "</a></div>" +
      "</div></div></div>";
    },

    /* ---------------------------------------------------- CONTACT CARDS */
    "contact-cards": function (host) {
      var cards = (D.contact.cards || []).map(function (c, i) {
        var lines = (c.lines || []).map(function (l, k) { return '<p class="' + (k === 0 ? "first-line" : "") + '">' + esc(l) + "</p>"; }).join("");
        return '<a class="card contact-card reveal" data-reveal' + delay(i) + ' href="' + esc(c.href) + '"' +
          (/^https?:/.test(c.href) ? ' target="_blank" rel="noopener"' : "") + ">" +
          '<span class="card-icon">' + icon(c.icon) + "</span><h3>" + esc(c.title) + "</h3>" + lines +
          '<span class="link-arrow" style="margin-top:.9rem">Open' + icon("arrowRight") + "</span></a>";
      }).join("");
      host.innerHTML = '<div class="container"><div class="contact-cards">' + cards + "</div></div>";
    },

    /* ----------------------------------------------------- CONTACT FORM */
    "contact-form": function (host) {
      var c = D.contact;
      var reasons = (c.reasons || []).map(function (r) { return "<option>" + esc(r) + "</option>"; }).join("");
      var times = (c.times || []).map(function (r) { return "<option>" + esc(r) + "</option>"; }).join("");
      host.innerHTML = '<form class="form-card reveal-l" id="appointment-form" novalidate>' +
        '<div class="form-success" id="form-success">' + icon("checkCircle") + "<span>" + esc(c.successMessage) + "</span></div>" +
        "<h3 style=\"margin-bottom:.4rem\">" + esc(c.formTitle) + "</h3>" +
        '<p style="font-size:.9rem;margin-bottom:1.4rem">Fields marked <span class="req">*</span> are required.</p>' +
        '<div class="form-row">' +
          field("name", "Full name", "text", "e.g. Priya Kulkarni", true) +
          field("phone", "Mobile number", "tel", "10-digit mobile number", true, ' inputmode="numeric" autocomplete="tel"') +
        "</div>" +
        '<div class="form-row">' +
          field("email", "Email (optional)", "email", "you@example.com", false, ' autocomplete="email"') +
          '<div class="field"><label for="f-reason">Reason for visit</label><select id="f-reason" name="reason">' + reasons + "</select></div>" +
        "</div>" +
        '<div class="form-row">' +
          field("date", "Preferred date", "date", "", false) +
          '<div class="field"><label for="f-time">Preferred time</label><select id="f-time" name="time">' + times + "</select></div>" +
        "</div>" +
        '<div class="field"><label for="f-msg">Describe your problem (optional)</label>' +
          '<textarea id="f-msg" name="message" placeholder="Pain in lower right molar since 3 days…"></textarea></div>' +
        '<button type="submit" class="btn btn--lg btn--block">' + esc(D.ui.quickBook) + icon("arrowRight") + "</button>" +
        '<p class="form-note">' + esc(c.formNote) + "</p>" +
      "</form>";

      function field(name, label, type, ph, required, extra) {
        return '<div class="field" data-field="' + name + '"><label for="f-' + name + '">' + esc(label) +
          (required ? ' <span class="req">*</span>' : "") + "</label>" +
          '<input id="f-' + name + '" name="' + name + '" type="' + type + '" placeholder="' + esc(ph) + '"' +
          (extra || "") + "><span class=\"msg\"></span></div>";
      }

      var form = $("#appointment-form", host);
      var success = $("#form-success", host);

      /* the date picker cannot offer a past day */
      var dateEl = $("#f-date", form);
      if (dateEl) dateEl.min = new Date().toISOString().split("T")[0];

      function setErr(name, msg) {
        var wrap = $('[data-field="' + name + '"]', form);
        if (!wrap) return;
        wrap.classList.toggle("error", !!msg);
        $(".msg", wrap).textContent = msg || "";
      }

      function validate() {
        var ok = true;
        var name = form.name.value.trim();
        if (name.length < 3) { setErr("name", "Please enter your full name."); ok = false; } else setErr("name");
        var digits = form.phone.value.replace(/\D/g, "");
        if (digits.length < 10) { setErr("phone", "Enter a valid 10-digit mobile number."); ok = false; } else setErr("phone");
        var mail = form.email.value.trim();
        if (mail && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)) { setErr("email", "That email doesn't look right."); ok = false; } else setErr("email");
        return ok;
      }

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!validate()) { toast(D.ui.formRequired, true); return; }
        var v = form;
        var text = "New appointment request — " + D.clinic.name + "\n" +
          "Name: " + v.name.value.trim() + "\n" +
          "Mobile: " + v.phone.value.trim() + "\n" +
          (v.email.value.trim() ? "Email: " + v.email.value.trim() + "\n" : "") +
          "Reason: " + v.reason.value + "\n" +
          "Preferred: " + (v.date.value || "any day") + ", " + v.time.value + "\n" +
          (v.message.value.trim() ? "Notes: " + v.message.value.trim() : "");
        var url = waLink(text);
        success.classList.add("show");
        toast("Request ready — sending you to WhatsApp…");
        var win = window.open(url, "_blank", "noopener");
        // If the pop-up is blocked (common in sandboxes), offer a manual link.
        setTimeout(function () {
          if (!win) {
            var a = document.createElement("a");
            a.className = "btn btn--sm";
            a.href = url; a.target = "_blank"; a.rel = "noopener";
            a.style.marginTop = ".9rem";
            a.innerHTML = icon("whatsapp") + "Open WhatsApp to send";
            success.appendChild(a);
          }
        }, 550);
        form.reset();
      });
      form.addEventListener("input", function (e) { if (e.target.name) setErr(e.target.name); });
    },

    /* ---------------------------------------------------------------- MAP */
    map: function (host) {
      var c = D.clinic;
      host.innerHTML = '<div class="map-card reveal-r">' +
        '<div class="map-canvas">' +
          '<svg class="map-roads" viewBox="0 0 600 400" preserveAspectRatio="none" aria-hidden="true">' +
            '<g stroke="#9fd8d5" stroke-width="14" fill="none" opacity=".85">' +
              '<path d="M-20 250 C120 240 200 150 320 150 S520 220 640 200"/>' +
              '<path d="M120 -20 C140 120 220 210 210 420"/>' +
              '<path d="M420 -20 C410 120 470 220 470 420"/>' +
            "</g>" +
            '<g stroke="#ffffff" stroke-width="4" fill="none" opacity=".9">' +
              '<path d="M-20 250 C120 240 200 150 320 150 S520 220 640 200"/>' +
              '<path d="M120 -20 C140 120 220 210 210 420"/>' +
              '<path d="M420 -20 C410 120 470 220 470 420"/>' +
            "</g>" +
            '<g fill="#bfe9e5" opacity=".7"><rect x="40" y="60" width="60" height="50" rx="6"/><rect x="250" y="260" width="80" height="60" rx="6"/><rect x="500" y="90" width="70" height="55" rx="6"/><rect x="330" y="40" width="55" height="45" rx="6"/></g>' +
            '<text x="300" y="235" font-family="Poppins,Arial" font-size="13" fill="#0f766e" opacity=".75">Hotgi Road</text>' +
          "</svg>" +
          '<span class="map-pin-dot"></span><span class="map-pin">' + icon("pin") + "</span>" +
        "</div>" +
        '<div class="map-foot"><span><strong>' + esc(c.address) + "</strong><small>" + esc(D.contact.mapNote) + "</small></span>" +
          '<a class="btn btn--sm" href="' + esc(c.mapLink) + '" target="_blank" rel="noopener">Open in Maps' + icon("arrowRight") + "</a></div>" +
      "</div>";
    },

    /* -------------------------------------------------------------- HOURS */
    hours: function (host) {
      var rows = (D.clinic.hours || []).map(function (h) {
        var emerg = /emergency/i.test(h.day);
        return '<div class="hours-row' + (emerg ? " is-emergency" : "") + '"><span>' + esc(h.day) + "</span><span>" + esc(h.time) + "</span></div>";
      }).join("");
      host.innerHTML = '<div class="map-card reveal-r" style="padding:1.5rem 1.5rem .6rem">' +
        "<h3 style=\"margin-bottom:.9rem\">Clinic hours</h3><div class=\"hours-table\">" + rows + "</div></div>";
    }
  };

  /* Service card markup (shared by home + services page) */
  function serviceCard(s, i) {
    var feats = (s.features || []).map(function (f) { return "<li>" + icon("check") + "<span>" + esc(f) + "</span></li>"; }).join("");
    return '<article class="card service-card reveal" data-reveal' + delay(i) + ' data-category="' + esc(s.category) + '" id="' + esc(s.id) + '">' +
      (s.popular ? '<span class="badge-pop">Popular</span>' : "") +
      '<span class="card-icon">' + icon(s.icon) + "</span>" +
      "<h3>" + esc(s.title) + "</h3>" +
      "<p>" + esc(s.short) + "</p>" +
      '<div class="service-meta"><span class="chip">' + icon("clock") + esc(s.duration) + "</span>" +
        '<span class="chip">' + icon("leaf") + esc(s.category) + "</span></div>" +
      '<p class="service-details">' + esc(s.details) + "</p>" +
      '<ul class="features">' + feats + "</ul>" +
      '<div class="card-actions"><span class="card-num">' + esc(D.ui.from) + " " + esc(s.price) +
        "<small>transparent pricing</small></span>" +
        '<a class="btn btn--sm" href="contact.html#book">' + esc(D.ui.bookNow) + icon("arrowRight") + "</a></div>" +
    "</article>";
  }

  /* =====================================================================
     HEADER · DRAWER · FOOTER · FLOATING UI
     ===================================================================== */
  function renderChrome() {
    var page = document.body.getAttribute("data-page") || "home";
    var c = D.clinic;

    /* topbar */
    var tb = $("[data-topbar]");
    if (tb && D.topbar) {
      tb.innerHTML = '<div class="container"><div class="inner">' +
        '<div class="topbar-text"><span class="dot-live"></span><span>' + esc(D.topbar.text) + "</span></div>" +
        '<div class="topbar-links">' + (D.topbar.links || []).map(function (l) {
          return '<a href="' + esc(l.href) + '">' + icon(l.icon) + esc(l.label) + "</a>";
        }).join("") + "</div></div></div>";
    }

    /* header */
    var hd = $("[data-header]");
    if (hd) {
      hd.innerHTML = '<div class="container"><div class="header-inner">' + brandMarkup() +
        '<nav class="nav" aria-label="Main">' + (D.nav || []).map(function (n) {
          return '<a href="' + esc(n.href) + '"' + (n.page === page ? ' class="active" aria-current="page"' : "") + ">" + esc(n.label) + "</a>";
        }).join("") + "</nav>" +
        '<div class="header-cta">' +
          '<a class="header-phone" href="' + tel() + '">' + icon("phone") + esc(c.phone) + "</a>" +
          '<a class="btn btn--sm" href="' + esc(D.headerCta.href) + '">' + esc(D.headerCta.label) + "</a>" +
          '<button class="burger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-drawer">' +
            '<svg class="burger-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
              '<path class="l1" d="M3.2 7h17.6"/>' +
              '<path class="l2" d="M3.2 12h17.6"/>' +
              '<path class="l3" d="M3.2 17h17.6"/>' +
            "</svg></button>" +
        "</div></div></div>";
    }

    /* drawer */
    var dr = $("[data-drawer]");
    var dcfg = D.drawer || {};
    if (dr) {
      var dLinks = (D.nav || []).map(function (n) {
        return '<a class="d-link' + (n.page === page ? " active" : "") + '" href="' + esc(n.href) + '"' +
          (n.page === page ? ' aria-current="page"' : "") + ">" +
            '<span class="d-ico">' + icon(n.icon || "chevronRight") + "</span>" +
            '<span class="d-label">' + esc(n.label) + "</span>" +
            '<span class="d-arrow">' + icon("chevronRight") + "</span>" +
        "</a>";
      }).join("");

      var dQuick = (dcfg.quick || []).length ?
        '<div class="drawer-sec reveal-none">' +
          '<h4 class="drawer-sec-title">' + esc(dcfg.quickTitle || "Quick links") + "</h4>" +
          '<div class="drawer-quick">' + (dcfg.quick || []).map(function (q) {
            return '<a href="' + esc(q.href) + '">' + icon("arrowRight") + esc(q.label) + "</a>";
          }).join("") + "</div></div>" : "";

      var dHours = (c.hours || []).length ?
        '<div class="drawer-sec">' +
          '<h4 class="drawer-sec-title">' + esc(dcfg.hoursTitle || "Clinic hours") + "</h4>" +
          '<div class="drawer-hours">' + c.hours.slice(0, 2).map(function (h) {
            return '<div class="hours-row"><span>' + esc(h.day) + "</span><span>" + esc(h.time) + "</span></div>";
          }).join("") + "</div>" +
          (dcfg.hoursNote ? '<p class="drawer-note">' + icon("clock") + esc(dcfg.hoursNote) + "</p>" : "") +
        "</div>" : "";

      dr.innerHTML = '<div class="drawer-scrim" data-close></div>' +
        '<aside class="drawer-panel" id="mobile-drawer" role="dialog" aria-modal="true" aria-label="Main menu">' +
          '<div class="drawer-head">' + brandMarkup() +
            '<button class="drawer-close" type="button" data-close aria-label="Close menu">' + icon("close") + "</button></div>" +
          '<nav class="drawer-nav" aria-label="Mobile">' + dLinks + "</nav>" +
          dQuick + dHours +
          '<div class="drawer-foot">' +
            '<a class="btn btn--block" href="' + esc(D.headerCta.href) + '">' + esc(D.headerCta.label) + icon("arrowRight") + "</a>" +
            '<div class="drawer-contact">' +
              '<a href="' + tel() + '">' + icon("phone") + esc(c.phone) + "</a>" +
              '<a href="' + mailto(c.email) + '">' + icon("mail") + esc(c.email) + "</a>" +
            "</div>" +
            '<div class="footer-socials">' + Object.keys(c.social || {}).map(function (k) {
              return '<a href="' + esc(c.social[k]) + '" target="_blank" rel="noopener" aria-label="' + esc(k) + '">' + icon(k) + "</a>";
            }).join("") + "</div>" +
          "</div>" +
        "</aside>";

      $$("[data-close]", dr).forEach(function (b) { b.addEventListener("click", closeDrawer); });
      $$(".drawer-panel a", dr).forEach(function (a) { a.addEventListener("click", closeDrawer); });
    }

    var burger = $(".burger");
    if (burger) burger.addEventListener("click", function () {
      var open = dr.classList.contains("open");
      open ? closeDrawer() : openDrawer();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeDrawer(); });

    var lastFocused = null;
    function focusables() {
      return $$('a[href], button:not([disabled])', dr).filter(function (el) { return el.offsetParent !== null; });
    }
    function openDrawer() {
      lastFocused = document.activeElement;
      dr.classList.add("open");
      dr.removeAttribute("aria-hidden");
      if (burger) { burger.classList.add("open"); burger.setAttribute("aria-expanded", "true"); burger.setAttribute("aria-label", "Close menu"); }
      document.body.style.overflow = "hidden";
      /* land keyboard focus on the first menu item, not the logo */
      var firstLink = $(".drawer-nav .d-link", dr) || focusables()[0];
      if (firstLink) setTimeout(function () { firstLink.focus(); }, 260);
    }
    function closeDrawer() {
      if (!dr.classList.contains("open")) return;
      dr.classList.remove("open");
      dr.setAttribute("aria-hidden", "true");
      if (burger) { burger.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); burger.setAttribute("aria-label", "Open menu"); }
      document.body.style.overflow = "";
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }
    /* keyboard: Esc closes (handled below), Tab is kept inside the panel */
    dr.setAttribute("aria-hidden", "true");
    dr.addEventListener("keydown", function (e) {
      if (e.key !== "Tab" || !dr.classList.contains("open")) return;
      var f = focusables();
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    /* footer */
    var ft = $("[data-footer]");
    if (ft && D.footer) {
      var f = D.footer;
      var cols = (f.columns || []).map(function (col) {
        return "<div><h4>" + esc(col.title) + "</h4><div class=\"footer-links\">" + (col.links || []).map(function (l) {
          return '<a href="' + esc(l.href) + '">' + icon("chevronRight") + esc(l.label) + "</a>";
        }).join("") + "</div></div>";
      }).join("");
      ft.innerHTML =
        '<div class="container"><div class="footer-grid">' +
          "<div>" + brandMarkup() + '<p style="font-size:.9rem">' + esc(f.about) + "</p>" +
            '<div class="footer-socials">' + Object.keys(c.social || {}).map(function (k) {
              return '<a href="' + esc(c.social[k]) + '" target="_blank" rel="noopener" aria-label="' + esc(k) + '">' + icon(k) + "</a>";
            }).join("") + "</div>" +
            '<div class="footer-badges">' + (f.badges || []).map(function (b) { return "<span>" + esc(b) + "</span>"; }).join("") + "</div>" +
          "</div>" +
          cols +
          "<div><h4>Reach us</h4><ul class=\"footer-contact\">" +
            "<li>" + icon("pin") + "<span>" + esc(c.address) + "</span></li>" +
            "<li>" + icon("phone") + '<span><a href="' + tel() + '">' + esc(c.phone) + "</a></span></li>" +
            "<li>" + icon("whatsapp") + '<span><a href="' + waLink() + '" target="_blank" rel="noopener">WhatsApp us</a></span></li>' +
            "<li>" + icon("mail") + '<span><a href="mailto:' + esc(c.email) + '">' + esc(c.email) + "</a></span></li>" +
            "<li>" + icon("clock") + "<span>" + esc(c.hours[0].day) + " · " + esc(c.hours[0].time) + "</span></li>" +
          "</ul></div>" +
        "</div>" +
        '<div class="footer-bottom"><span>' + esc(f.copyright) + "</span>" +
          '<span>' + esc(f.credit) + "</span>" +
          '<a class="link-arrow" style="color:#fff" href="#top">Back to top' + icon("arrowUp") + "</a></div></div>";
    }

    /* floating buttons */
    var fl = $("[data-floating]");
    if (fl) {
      fl.innerHTML = '<a class="wa-float" href="' + waLink("Hi " + c.name + ", I would like to book a dental appointment.") +
        '" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">' + icon("whatsapp") + "<span>Chat with us</span></a>" +
        '<button class="to-top" type="button" aria-label="Back to top">' + icon("arrowUp") + "</button>" +
        '<div class="toast" role="status" aria-live="polite"></div>';
      $(".to-top", fl).addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }

  /* ------------------------------------------------------------- TOAST */
  var toastTimer;
  function toast(msg, isError) {
    var t = $(".toast");
    if (!t) return;
    t.innerHTML = (isError ? "" : icon("checkCircle")) + "<span>" + esc(msg) + "</span>";
    t.classList.toggle("err", !!isError);
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 4200);
  }

  /* =====================================================================
     BEHAVIOUR
     ===================================================================== */
  function initScrollUI() {
    var bar = document.createElement("div");
    bar.id = "scroll-progress";
    bar.innerHTML = "<span></span>";
    document.body.appendChild(bar);
    var span = bar.firstChild;

    function onScroll() {
      var y = window.scrollY || document.documentElement.scrollTop;
      document.body.classList.toggle("scrolled", y > 40);
      var h = document.documentElement.scrollHeight - window.innerHeight;
      span.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
      var t = $(".to-top");
      if (t) t.classList.toggle("show", y > 600);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function initReveal() {
    var els = $$(".reveal, .reveal-l, .reveal-r, .reveal-s");
    if (!hasIO) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: .12, rootMargin: "0px 0px -60px 0px" });
    els.forEach(function (e) { io.observe(e); });
  }

  function initCounters() {
    var nodes = $$(".counter");
    if (!nodes.length) return;
    if (!hasIO) {
      nodes.forEach(function (el) {
        var dec = parseInt(el.getAttribute("data-decimals") || "0", 10);
        var to = parseFloat(el.getAttribute("data-to")) || 0;
        el.textContent = dec ? to.toFixed(dec) : money(Math.round(to));
      });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        io.unobserve(el);
        var to = parseFloat(el.getAttribute("data-to")) || 0;
        var dec = parseInt(el.getAttribute("data-decimals") || "0", 10);
        var start = performance.now(), dur = 1500;
        (function step(now) {
          var p = Math.min((now - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          var val = to * eased;
          el.textContent = dec ? val.toFixed(dec) : money(Math.round(val));
          if (p < 1) requestAnimationFrame(step);
        })(start);
      });
    }, { threshold: .5 });
    nodes.forEach(function (n) { io.observe(n); });
  }

  function initSlider() {
    var root = $("#testimonial-slider");
    if (!root) return;
    var track = $(".slider-track", root);
    var slides = $$(".slide", root);
    var dots = $$(".dot");
    var i = 0, timer = null;
    if (!slides.length) return;

    function go(n) {
      i = (n + slides.length) % slides.length;
      track.style.transform = "translateX(" + (-i * 100) + "%)";
      dots.forEach(function (d, k) { d.classList.toggle("active", k === i); });
    }
    function auto() { timer = setInterval(function () { go(i + 1); }, 6200); }
    function stop() { clearInterval(timer); }

    $$("[data-next]").forEach(function (b) { b.addEventListener("click", function () { go(i + 1); }); });
    $$("[data-prev]").forEach(function (b) { b.addEventListener("click", function () { go(i - 1); }); });
    dots.forEach(function (d) { d.addEventListener("click", function () { go(parseInt(d.getAttribute("data-dot"), 10)); }); });

    var x0 = null;
    root.addEventListener("pointerdown", function (e) { x0 = e.clientX; });
    root.addEventListener("pointerup", function (e) {
      if (x0 === null) return;
      var dx = e.clientX - x0;
      if (Math.abs(dx) > 45) go(i + (dx < 0 ? 1 : -1));
      x0 = null;
    });
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", auto);
    document.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft" && !$(".lightbox.open")) go(i - 1);
      if (e.key === "ArrowRight" && !$(".lightbox.open")) go(i + 1);
    });
    go(0); auto();
  }

  function initFaq() {
    $$(".faq-item").forEach(function (item) {
      var q = $(".faq-q", item), a = $(".faq-a", item);
      q.addEventListener("click", function () {
        var isOpen = item.classList.contains("open");
        $$(".faq-item").forEach(function (o) {
          o.classList.remove("open");
          $(".faq-q", o).setAttribute("aria-expanded", "false");
          $(".faq-a", o).style.maxHeight = "0px";
        });
        if (!isOpen) {
          item.classList.add("open");
          q.setAttribute("aria-expanded", "true");
          a.style.maxHeight = a.scrollHeight + 40 + "px";
        }
      });
    });
  }

  function initLightbox() {
    var grid = $("#gallery-grid");
    if (!grid) return;
    var box = document.createElement("div");
    box.className = "lightbox";
    box.innerHTML =
      '<button class="lb-close" type="button" aria-label="Close gallery">' + icon("close") + "</button>" +
      '<button class="lb-btn lb-prev" type="button" aria-label="Previous photo">' + icon("chevronLeft") + "</button>" +
      '<figure class="lb-figure"><img alt=""><figcaption class="lb-cap"></figcaption></figure>' +
      '<button class="lb-btn lb-next" type="button" aria-label="Next photo">' + icon("chevronRight") + "</button>" +
      '<span class="lb-hint">' + esc(D.ui.lightboxHint) + "</span>";
    document.body.appendChild(box);

    var imgEl = $("img", box), cap = $(".lb-cap", box), idx = 0;

    function visible() {
      var list = GALLERY.visible && GALLERY.visible.length ? GALLERY.visible : $$(".g-item", grid);
      return list.filter(function (el) { return el.parentNode; });
    }
    function show(n) {
      var list = visible();
      if (!list.length) return;
      idx = (n + list.length) % list.length;
      var item = list[idx];
      var src = $("img", item).getAttribute("src");
      imgEl.src = src;
      imgEl.alt = $("img", item).getAttribute("alt") || "";
      cap.innerHTML = esc($(".g-overlay strong", item).textContent) + "<small>" +
        esc($(".g-overlay small", item).textContent) + " · " + (idx + 1) + " / " + list.length + "</small>";
    }
    function open(n) { box.classList.add("open"); document.body.style.overflow = "hidden"; show(n); }
    function close() { box.classList.remove("open"); document.body.style.overflow = ""; }

    grid.addEventListener("click", function (e) {
      var item = e.target.closest(".g-item");
      if (!item) return;
      open(visible().indexOf(item));
    });
    $(".lb-close", box).addEventListener("click", close);
    $(".lb-next", box).addEventListener("click", function () { show(idx + 1); });
    $(".lb-prev", box).addEventListener("click", function () { show(idx - 1); });
    box.addEventListener("click", function (e) { if (e.target === box) close(); });
    document.addEventListener("keydown", function (e) {
      if (!box.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") show(idx + 1);
      if (e.key === "ArrowLeft") show(idx - 1);
    });
  }

  function initBeforeAfter() {
    var wrap = $("#ba-slider");
    if (!wrap) return;
    var before = $(".ba-before", wrap), handle = $(".ba-handle", wrap);
    function set(p) {
      p = Math.max(2, Math.min(98, p));
      before.style.clipPath = "inset(0 " + (100 - p) + "% 0 0)";
      handle.style.left = p + "%";
      wrap.setAttribute("aria-valuenow", Math.round(p));
    }
    function fromEvent(e) {
      var r = wrap.getBoundingClientRect();
      set(((e.clientX - r.left) / r.width) * 100);
    }
    var dragging = false;
    wrap.addEventListener("pointerdown", function (e) { dragging = true; wrap.setPointerCapture(e.pointerId); fromEvent(e); });
    wrap.addEventListener("pointermove", function (e) { if (dragging) fromEvent(e); });
    wrap.addEventListener("pointerup", function () { dragging = false; });
    wrap.addEventListener("pointercancel", function () { dragging = false; });
    wrap.addEventListener("keydown", function (e) {
      var cur = parseFloat(wrap.getAttribute("aria-valuenow")) || 50;
      if (e.key === "ArrowLeft") { set(cur - 3); e.preventDefault(); }
      if (e.key === "ArrowRight") { set(cur + 3); e.preventDefault(); }
    });
    /* gentle auto teaser the first time it scrolls into view */
    if (hasIO && !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) {
      var io = new IntersectionObserver(function (en) {
        if (!en[0].isIntersecting) return;
        io.disconnect();
        var t0 = performance.now();
        (function tease(now) {
          var p = (now - t0) / 1600;
          if (p >= 1) { set(50); return; }
          set(50 + Math.sin(p * Math.PI * 2) * 18);
          requestAnimationFrame(tease);
        })(t0);
      }, { threshold: .4 });
      io.observe(wrap);
    } else set(50);
  }

  /* Smooth-scroll to an element and then correct once: the sticky header
     appearing and the top bar collapsing shift the layout mid-scroll, so a
     single pass can land a few dozen pixels off. */
  function scrollToEl(el, instant) {
    if (!el) return;
    var OFFSET = 96;
    function target() { return el.getBoundingClientRect().top + window.scrollY - OFFSET; }
    if (instant) { window.scrollTo({ top: target(), behavior: "auto" }); return; }
    window.scrollTo({ top: target(), behavior: "smooth" });
    /* The sticky header appearing and the top bar collapsing change the
       layout while the animation runs, so a single pass can land short.
       Wait for the scroll to settle, then correct in one instant step —
       an instant scroll only lands cleanly once nothing else is animating. */
    var last = -1, stable = 0, ticks = 0;
    var iv = setInterval(function () {
      var y = window.scrollY;
      if (Math.abs(y - last) < 1) stable++; else stable = 0;
      last = y;
      if (stable >= 3 || ++ticks > 80) {
        clearInterval(iv);
        var delta = el.getBoundingClientRect().top - OFFSET;
        if (Math.abs(delta) > 8) window.scrollTo({ top: y + delta, behavior: "auto" });
      }
    }, 50);
  }

  function initAnchorScroll() {
    var here = location.pathname.replace(/[^/]*$/, "");

    document.addEventListener("click", function (e) {
      var a = e.target.closest("a[href]");
      if (!a) return;
      var href = a.getAttribute("href") || "";
      var hash = href.indexOf("#");
      if (hash === -1) return;
      var id = href.slice(hash + 1);
      if (!id) return;
      /* only intercept links that stay on this document: "#id" or
         "current-page.html#id". Links to other pages navigate normally. */
      var path = href.slice(0, hash);
      if (path && (here + path.split("/").pop()) !== here + location.pathname.split("/").pop()) return;
      var target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      scrollToEl(target);
      if (history.replaceState) history.replaceState(null, "", "#" + id);
    });

    /* catches native hash jumps too: back/forward, typed URLs, etc. */
    window.addEventListener("hashchange", function () {
      var id = location.hash.slice(1);
      if (id) scrollToEl(document.getElementById(id), true);
    });
    /* deep link (e.g. services.html#rootcanal) — instant jumps are used here
       because the browser's own hash jump already happened at parse time and
       fonts/images can still shift the layout for a moment afterwards */
    if (location.hash.length > 1) {
      var t = document.getElementById(location.hash.slice(1));
      if (t) {
        scrollToEl(t, true);
        [250, 700, 1400].forEach(function (d) { setTimeout(function () { scrollToEl(t, true); }, d); });
        window.addEventListener("load", function () { scrollToEl(t, true); });
      }
    }
  }

  /* =====================================================================
     BOOT
     ===================================================================== */
  function boot() {
    applyTheme();
    applySeo();
    initFonts();
    renderChrome();

    /* render every placeholder, in DOM order */
    $$("[data-section]").forEach(function (host) {
      var name = host.getAttribute("data-section");
      var fn = SECTIONS[name];
      if (!fn) return;
      try { fn(host); } catch (err) { console.error('Section "' + name + '" failed:', err); }
    });

    [initScrollUI, initReveal, initCounters, initSlider, initFaq, initLightbox, initBeforeAfter, initAnchorScroll]
      .forEach(function (fn) {
        try { fn(); } catch (err) { console.error(fn.name + "() failed:", err); }
      });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
