# SmileCare Dental Studio — static website

A 5‑page dental clinic website (Home · About · Services · Gallery · Contact) built with
**plain HTML + CSS + JavaScript — no build step, no framework, no dependencies.**

**Every word, price, photo, doctor, review and FAQ on the site is stored as JSON in one file:
`data/site-data.js`.** Edit that file, refresh the browser, and the whole site updates —
no HTML editing required.

---

## 1. Quick start

**Option A — just open it (works with zero setup):**

Double‑click `index.html`, or drag it into a browser. Done.

> The site is deliberately built so that `file://` works. That is why the data lives in
> `data/site-data.js` (a `<script>` file) instead of a raw `data.json` — browsers block
> `fetch()` of local `.json` files, but script files load fine. The payload is still plain JSON.

**Option B — run a tiny local server (recommended while developing):**

```bash
cd this-folder
python3 -m http.server 5173
# then open http://localhost:5173
```

---

## 2. File structure

```
├── index.html              ← Home
├── about.html              ← About
├── services.html           ← Services (with category filter)
├── gallery.html            ← Gallery (filter + lightbox + before/after slider)
├── contact.html            ← Contact (form, map, hours, quick FAQ)
├── data/
│   └── site-data.js        ★ THE ONLY FILE YOU EDIT TO UPDATE CONTENT (JSON)
├── assets/
│   ├── css/styles.css      ← design system + all animations + responsive rules
│   ├── js/main.js          ← the render engine (never needs editing)
│   └── img/                ← all photographs
├── tools_build_preview.py  ← bundles everything into ONE self-contained HTML file
└── preview-all-in-one.html ← the built single-file preview (2.5 MB, offline-ready)
```

### The single-file preview

`preview-all-in-one.html` is a **self-contained copy of the whole site** — CSS, JSON data,
JavaScript and all ten photographs are inlined, so it opens correctly even with no other
files present and no internet (useful for WhatsApp, email, USB sticks and sandboxed iframes).

Rebuild it after any content change:

```bash
python3 tools_build_preview.py
```

---

## 3. How the JSON drives the site

Each page contains empty placeholders like this:

```html
<section class="section section--soft" id="services">
  <div data-section="services" data-limit="6"></div>
</section>
```

On page load, `assets/js/main.js` finds every `data-section="…"` element and renders the
matching block **from `site-data.js`** into it.

### Placeholder → data → where it appears

| `data-section`  | Reads from JSON                          | Appears on                        |
|-----------------|------------------------------------------|-----------------------------------|
| `page-hero`     | `pageHeroes.<page>`                      | About, Services, Gallery, Contact |
| `hero`          | `hero`, `clinic`                         | Home                              |
| `marquee`       | `marquee`                                | Home                              |
| `why-us`        | `whyUs`                                  | Home                              |
| `services`      | `services`, `serviceIntro`               | Home (`data-limit="6"`), Services (`data-filter="1"`) |
| `about`         | `about`                                  | Home, About                       |
| `values`        | `values`, `principles`                   | About                             |
| `process`       | `process`                                | Home, Services                    |
| `timeline`      | `timeline`                               | About                             |
| `stats`         | `stats`                                  | Home, About                       |
| `doctors`       | `doctors`                                | Home, About, Gallery              |
| `gallery`       | `gallery`, `galleryCategories`, `galleryIntro` | Home (`data-limit="6"`), Gallery (`data-filter="1"`) |
| `before-after`  | `beforeAfter`                            | Gallery                           |
| `testimonials`  | `testimonials`, `testimonialsIntro`      | Home                              |
| `faq`           | `faqs`, `faqIntro`                       | Home (`data-limit="5"`), Services, Contact (`data-limit="4"`) |
| `cta`           | `cta`                                    | every page                        |
| `contact-cards` | `contact.cards`                          | Contact                           |
| `contact-form`  | `contact`, `ui`                          | Contact                           |
| `map`           | `clinic.address`, `clinic.mapLink`       | Contact                           |
| `hours`         | `clinic.hours`                           | Contact                           |

Useful attributes on a placeholder:

* `data-limit="6"` — show only the first N items (with a “view all” button).
* `data-filter="1"` — show category filter buttons.
* `data-head="0"` — hide the section heading.
* `data-cta="1"` — add a trailing button (used by `doctors`).

The **header, nav, mobile drawer, footer, WhatsApp button and toast** are rendered from
`nav`, `topbar`, `clinic`, `headerCta`, `footer` and `ui`.

---

## 4. Common edits (copy/paste recipes)

### Change the clinic details

```js
clinic: {
  name:     "Your Clinic Name",
  phone:    "+91 90000 00000",
  phoneRaw: "+919000000000",      // used for tel: links — digits only
  whatsapp: "+919000000000",      // used for wa.me links — digits only
  email:    "care@yourclinic.in",
  address:  "Shop 4, Main Road, Your City, State 413001",
  ...
}
```

> Update **`phone`, `phoneRaw` and `whatsapp` together** — `phone` is what visitors read,
> `phoneRaw`/`whatsapp` are what the buttons dial.

### Add a service

Copy any `{ … }` block inside `services: [ … ]` and edit it:

```js
{
  id: "laser-gum",                 // used for the #anchor link, keep it unique
  icon: "activity",                // tooth, sparkle, shield, activity, implant, braces,
                                   // smile, baby, extract, crown, scan, emergency
  category: "Surgical",            // must be one of serviceCategories
  title: "Laser Gum Treatment",
  short: "One-line summary shown on the card.",
  price: "₹9,000",                 // shown as "From ₹9,000"
  duration: "45 min",
  popular: true,                   // adds the orange "Popular" badge (optional)
  details: "The longer paragraph that appears under the chips.",
  features: ["A", "B", "C", "D"]   // up to 4 tick points
}
```

### Available icon names

Used by `nav[].icon`, `services[].icon`, `whyUs.items[].icon`, `values[].icon`,
`process.steps[].icon`, `stats[].icon`, `clinic.hours`/contact cards, `floatCards[].icon`:

```
home  users  images  phone  mail  pin  clock  calendar  check  checkCircle
tooth  sparkle  shield  activity  heart  eye  award  wallet  target  leaf
implant  braces  smile  baby  extract  crown  scan  emergency  drag  quote  sms
facebook  instagram  youtube  linkedin  whatsapp
```

`tooth` is used as the fallback if a name isn't recognised.

### Customise the mobile drawer

The slide-in menu on phones/tablets is driven by `drawer` in the JSON:

```js
drawer: {
  menuTitle: "Menu",
  quickTitle: "Popular treatments",
  quick: [                                  // ← shortcut links (optional)
    { label: "Dental Implants", href: "services.html#implants" },
    { label: "Root Canal",      href: "services.html#rootcanal" }
  ],
  hoursTitle: "Clinic hours",
  hoursNote: "Open 7 days · emergency on call"   // first 2 rows of clinic.hours are shown
}
```

The **menu items themselves come from `nav`** — add an entry there and it appears in both
the desktop header and the drawer, complete with its icon. Delete `quick` or set it to `[]`
to hide that section; the drawer then simply ends with the booking button and contact details.

### Add a doctor / gallery photo / testimonial / FAQ

Same pattern — copy an existing `{ … }` block in `doctors`, `gallery`, `testimonials`
or `faqs` and edit the values. Order in the array = order on the page.

### Gallery photos: the `tall` flag

Gallery tiles are two shapes, and `tall` must match the photo's shape or the photo gets cropped:

| Photo shape | `tall` | Recommended pixels |
|---|---|---|
| Landscape / wide | `false` | 1100 × 600 |
| Portrait / upright | `true`  | 800 × 1430 |

### Change colours (re‑skins the entire site)

```js
theme: {
  brand:     "#0b8278",   // primary — buttons, links, icons (white text stays AA)
  brandDark: "#0f766e",
  brandDeep: "#134e4a",   // dark bands + footer
  accent:    "#22d3ee",   // highlights
  accent2:   "#d97706",   // stars / badges (AA-safe amber)
  ink:       "#0f172a",   // text
  muted:     "#5b7386",   // secondary text
  bgSoft:    "#f2fbfa",   // soft section background
  radius:    "22px"       // corner rounding
}
```

> **One colour really does re-skin everything.** Every soft tint, hover wash, glow and shadow in
> the stylesheet is derived from these values at runtime, so changing `brand` alone updates
> buttons, icon tints, focus rings, blobs and shadows together — no other file to touch.
> Verify with the [contrast note](#6-things-that-are-already-handled) if you pick your own values.

> ⚠️ Keep the contrast in mind when choosing colours: `brand` is used behind white button text
> (aim for 4.5:1) and `accent2` behind the rating stars on white (aim for 3:1). The shipped
> defaults are checked and pass.

### Change the price list, FAQ, opening hours

`services[].price` · `faqs` · `clinic.hours` — plain text, edit freely.

---

## 5. Replacing the demo photographs

Everything in `assets/img/` is demo material. Replace a file with your own **keeping the
same filename** and the site updates instantly — or point the JSON at a new file:

```js
hero:    { image: "assets/img/my-clinic.jpg" },
gallery: [ { src: "assets/img/my-photo.jpg", … } ]
```

Recommended sizes: hero 1400 × 900 · doctors 800 × 1000 (portrait) · gallery 1100 × 600
(landscape) or 800 × 1430 (portrait) · clinic interior 1400 × 900.
If an image is missing, a teal “photo placeholder” graphic is shown instead of a broken icon.

---

## 6. Things that are already handled

* **Responsive** — verified with no horizontal overflow at 1440 / 1280 / 820 / 390 / 320 px.
* **Contrast** — all body copy meets WCAG AA against its background (the soft sections use a
  light teal tint with darkened text, not grey-on-grey).
* **Animations** — scroll reveals, counters, hero blobs, morphing hero shape, marquee,
  card hovers, lightbox zoom, animated before/after slider, sticky-header progress bar.
  All of them are disabled automatically for visitors with *reduce motion* enabled.
* **Nav** — sticky blurred header with the current page highlighted. On phones and tablets an
  icon-led slide-in drawer with quick treatment links, clinic hours, the booking CTA and contact
  details. The menu button is a single crisp SVG that morphs hamburger ⇄ close (equal bars, even
  spacing); the drawer traps Tab, closes on Esc, restores focus and is announced with `aria-modal`.
* **Gallery** — balanced masonry (no holes), category filter, keyboard-friendly lightbox (← → Esc).
* **Contact form** — validates name / 10‑digit mobile / email, then composes a pre-filled
  WhatsApp message (no server needed). If pop-ups are blocked it shows a manual send button.
* **SEO** — per-page titles & descriptions come from `seo` in the JSON; Open Graph tags included.
* **Accessibility** — visible focus rings for keyboard users (they never distort an element's
  shape), 46 px minimum hit areas on the menu button and sliders, aria labels on every icon-only
  button, `alt` text taken from the JSON, keyboard support in the slider / FAQ / lightbox / drawer,
  and a labelled breadcrumb on every inner page.

---

## 7. Hooking the form up to a real backend (optional)

The form is intentionally server-less. To store enquiries, either

**a) use a form service** — create a form at Formspree/Getform/Web3Forms and add `action` + `method`:

```html
<form class="form-card" id="appointment-form" action="https://formspree.io/f/XXXXXXX" method="POST">
```

then in `assets/js/main.js`, inside the submit handler, replace the WhatsApp block with
`form.submit()`. (Or keep both: post to the service *and* open WhatsApp.)

**b) or post it yourself** — the validated values are read straight from the form:

```js
fetch("/api/enquiries", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(Object.fromEntries(new FormData(form)))
});
```

---

## 8. Deploying

Drag the whole folder onto Netlify Drop, or push it to GitHub and enable GitHub Pages,
or upload it to any shared host — there is nothing to compile. `index.html` is the entry point.

A `404.html` is not required, but if your host is Apache/nginx you can keep clean URLs by
setting it to serve `index.html` for the root only.

---

## 9. Notes & credits

* Fonts (Poppins + Sora) load from Google Fonts with a system-font fallback. For a fully
  offline build, download the woff2 files and swap the `<link>` for local `@font-face` rules.
* All names, prices, reviews, phone numbers and photographs are **placeholder demo content** —
  replace them before going live. When using real patient photos, get written consent.
* Licence: use it freely for your own clinic. Attribution appreciated, not required.
