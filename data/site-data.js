/* ============================================================================
   SmileCare Dental Studio — SITE DATA
   ----------------------------------------------------------------------------
   ▶ THIS IS THE ONLY FILE YOU NEED TO EDIT TO UPDATE THE WEBSITE.
     Everything on every page (text, images, services, doctors, prices,
     gallery, testimonials, contact details, even the colour theme) is read
     from the JSON object below at page load.

   ▶ It is a .js file (instead of a raw .json file) on purpose: browsers block
     fetch() of local .json files when you open a page with file://, but a
     <script> file loads fine. The payload is still plain JSON.

   ▶ HOW TO EDIT
     1. Change any value between the quotes. Keep the commas and quotes.
     2. To add a service / doctor / gallery photo / testimonial, copy an
        existing { ... } block, paste it below it and edit. Order = display order.
     3. Do not rename the top-level keys (clinic, services, gallery, ...).
     4. Refresh the browser. Done.

   ▶ COLOURS: change `theme` below and the whole site re-skins itself.
   ========================================================================== */

window.SITE_DATA = {

  /* ---------------------------------------------------------------- THEME */
  theme: {
    brand:      "#0b8278",  // primary teal (#0b8278 keeps white text at AA 4.7:1)
    brandDark:  "#0f766e",  // hover / headings
    brandDeep:  "#134e4a",  // footer, dark bands
    accent:     "#22d3ee",  // highlights (cyan)
    accent2:    "#d97706",  // stars / badges (amber, AA 3.2:1 on white)
    ink:        "#0f172a",  // main text
    muted:      "#5b7386",  // secondary text
    bg:         "#ffffff",
    bgSoft:     "#f2fbfa",  // soft section background
    radius:     "22px"
  },

  /* --------------------------------------------------------------- CLINIC */
  clinic: {
    name:     "SmileCare Dental Studio",
    short:    "SmileCare",
    tagline:  "Gentle care. Confident smiles.",
    logoText: "SmileCare",
    phone:    "+91 98765 43210",
    phoneRaw: "+919876543210",
    whatsapp: "+919876543210",
    email:    "hello@smilecaredental.in",
    address:  "2nd Floor, Sunrise Plaza, Hotgi Road, Solapur, Maharashtra 413003",
    addressShort: "Hotgi Road, Solapur",
    mapLink:  "https://maps.google.com/?q=Hotgi+Road+Solapur",
    rating:   "4.9",
    reviewCount: "860",
    hours: [
      { day: "Monday – Friday", time: "9:30 AM – 8:30 PM" },
      { day: "Saturday",        time: "9:30 AM – 6:00 PM" },
      { day: "Sunday",          time: "10:00 AM – 2:00 PM (by appointment)" },
      { day: "Emergency",       time: "24 × 7 on call" }
    ],
    social: {
      facebook:  "https://facebook.com/",
      instagram: "https://instagram.com/",
      youtube:   "https://youtube.com/",
      linkedin:  "https://linkedin.com/"
    }
  },

  /* ------------------------------------------------------------------ NAV */
  nav: [
    { label: "Home",     href: "index.html",    page: "home",     icon: "home" },
    { label: "About",    href: "about.html",    page: "about",    icon: "users" },
    { label: "Services", href: "services.html", page: "services", icon: "tooth" },
    { label: "Gallery",  href: "gallery.html",  page: "gallery",  icon: "images" },
    { label: "Contact",  href: "contact.html",  page: "contact",  icon: "phone" }
  ],
  headerCta: { label: "Book Appointment", href: "contact.html#book" },

  /* ------------------------------------------------------- MOBILE DRAWER */
  /* The slide-in menu on phones/tablets. Its nav items use `nav[].icon`. */
  drawer: {
    menuTitle: "Menu",
    quickTitle: "Popular treatments",
    quick: [
      { label: "Dental Implants", href: "services.html#implants" },
      { label: "Root Canal",      href: "services.html#rootcanal" },
      { label: "Braces & Aligners", href: "services.html#braces" },
      { label: "Teeth Whitening", href: "services.html#whitening" }
    ],
    hoursTitle: "Clinic hours",
    hoursNote: "Open 7 days · emergency on call"
  },

  /* --------------------------------------------------------------- TOPBAR */
  topbar: {
    text: "Now accepting new patients — same-day emergency slots available",
    links: [
      { label: "Call us",   icon: "phone", href: "tel:+919876543210" },
      { label: "WhatsApp",  icon: "whatsapp", href: "https://wa.me/919876543210" }
    ]
  },

  /* ------------------------------------------------------------ SEO / META */
  seo: {
    home:     { title: "SmileCare Dental Studio — Best Dental Clinic in Solapur", description: "Gentle, modern dentistry in Solapur: implants, braces, root canals, whitening and kids' dentistry with digital diagnostics and painless care." },
    about:    { title: "About Us — SmileCare Dental Studio, Solapur", description: "Meet the team, our story and the technology behind 12,500+ confident smiles in Solapur." },
    services: { title: "Dental Services & Prices — SmileCare Dental Studio", description: "Explore our full range of dental treatments with transparent starting prices: implants, aligners, root canal, whitening, kids dentistry and more." },
    gallery:  { title: "Clinic & Smile Gallery — SmileCare Dental Studio", description: "Take a look inside our clinic, our technology and the smiles we have transformed." },
    contact:  { title: "Book an Appointment — SmileCare Dental Studio, Solapur", description: "Book a dental appointment in Solapur. Call, WhatsApp or fill the form — we reply within 30 minutes during clinic hours." }
  },

  /* -------------------------------------------------------- PAGE HEROES */
  /* Heading block shown at the top of every inner page. */
  pageHeroes: {
    about: {
      eyebrow: "About the clinic",
      title: "Specialists, technology and a lot of patience",
      subtitle: "We are a family dental practice in Solapur that grew up around one idea: dentistry should be comfortable, honest and easy to understand.",
      crumb: "About"
    },
    services: {
      eyebrow: "Treatments & pricing",
      title: "Everything your teeth need, in one place",
      subtitle: "From a routine cleaning to full-mouth rehabilitation — every treatment below shows a starting price so there are no surprises later.",
      crumb: "Services"
    },
    gallery: {
      eyebrow: "Gallery",
      title: "A look inside SmileCare",
      subtitle: "Real photos of our clinic, our equipment and the smiles we get to work on every day.",
      crumb: "Gallery"
    },
    contact: {
      eyebrow: "Contact & booking",
      title: "Let's get you booked in",
      subtitle: "Call, WhatsApp, email or use the form below. Appointments are usually confirmed within 30 minutes during clinic hours.",
      crumb: "Contact"
    }
  },

  /* --------------------------------------------------------- HOME: HERO */
  hero: {
    badge:    "Rated 4.9/5 by 860+ patients in Solapur",
    titleTop: "Your best smile",
    titleAccent: "starts right here",
    subtitle: "Advanced digital dentistry delivered with a gentle touch — from painless root canals and implants to invisible aligners, all under one roof.",
    primaryCta:   { label: "Book Free Consultation", href: "contact.html#book" },
    secondaryCta: { label: "Explore Services", href: "services.html" },
    image:        "assets/img/hero-dentist.jpg",
    imageAlt:     "Dentist consulting a smiling patient at SmileCare Dental Studio",
    points: ["Painless treatments", "Sterilised, single-use kits", "0% EMI on smile makeovers"],
    floatCards: [
      { icon: "calendar", title: "Open Today", text: "9:30 AM – 8:30 PM", accent: true },
      { icon: "shield",   title: "Sterilised", text: "Class-B autoclave" }
    ],
    stats: [
      { value: 12500, suffix: "+", label: "Happy patients" },
      { value: 15,    suffix: "+", label: "Years of care" },
      { value: 14800, suffix: "+", label: "Treatments done" },
      { value: 25,    suffix: " min", label: "Avg. wait time" }
    ]
  },

  /* ---------------------------------------------------- TRUST MARQUEE BAR */
  marquee: [
    "Digital X-ray & OPG",
    "Class-B Sterilisation",
    "Painless Anaesthesia",
    "Invisible Aligners",
    "Same-Day Crowns",
    "0% EMI Available",
    "Kids Friendly",
    "24×7 Emergency"
  ],

  /* ---------------------------------------------------- HOME: WHY CHOOSE US */
  whyUs: {
    eyebrow: "Why SmileCare",
    title: "Dentistry that feels calm, not clinical",
    subtitle: "We built our clinic around the two things patients fear most — pain and uncertainty. So we removed both.",
    items: [
      { icon: "heart",   title: "Truly painless", text: "Topical numbing, ultra-fine needles and gentle techniques mean most patients feel nothing at all." },
      { icon: "scan",    title: "Digital diagnostics", text: "Intra-oral scans and low-radiation digital X-rays let you see exactly what we see, on screen." },
      { icon: "shield",  title: "Hospital-grade hygiene", text: "Every instrument is autoclaved, pouched and opened in front of you. Single-use where it matters." },
      { icon: "clock",   title: "On-time appointments", text: "Average waiting time of 25 minutes — because your day matters as much as your teeth." },
      { icon: "award",   title: "Specialist team", text: "Implantologist, orthodontist, endodontist and paediatric dentist under one roof. No running around." },
      { icon: "wallet",  title: "Clear, fair pricing", text: "Written estimates before treatment starts, insurance help and 0% EMI on treatments above ₹15,000." }
    ]
  },

  /* --------------------------------------------------------------- SERVICES */
  serviceIntro: {
    eyebrow: "Our Services",
    title: "Complete dental care, one roof",
    subtitle: "Preventive, cosmetic and surgical dentistry for every age — with transparent starting prices."
  },
  serviceCategories: ["All", "General", "Cosmetic", "Orthodontics", "Surgical", "Kids", "Emergency"],
  services: [
    {
      id: "checkup", icon: "tooth", category: "General",
      title: "Dental Check-up & Cleaning",
      short: "Full oral examination, scaling and polishing to keep gums healthy and breath fresh.",
      price: "₹500", duration: "30 min", popular: true,
      details: "A thorough examination of teeth, gums and soft tissue followed by ultrasonic scaling, stain removal and polishing. Includes an oral-hygiene plan for the next six months.",
      features: ["Digital X-ray if needed", "Ultrasonic scaling", "Fluoride polish", "Oral-hygiene plan"]
    },
    {
      id: "whitening", icon: "sparkle", category: "Cosmetic",
      title: "Teeth Whitening",
      short: "In-clinic bleaching that lifts 4–6 shades in a single 60-minute sitting.",
      price: "₹6,000", duration: "60 min", popular: true,
      details: "Professional-strength whitening gel activated in a controlled way, with gum protection and desensitising treatment afterwards. Safe for enamel and long-lasting.",
      features: ["4–6 shades lighter", "Enamel-safe gel", "Gum protection", "Take-home top-up kit"]
    },
    {
      id: "fillings", icon: "shield", category: "General",
      title: "Cavity Treatment & Fillings",
      short: "Tooth-coloured composite fillings that blend in and seal decay for good.",
      price: "₹1,200", duration: "40 min",
      details: "Decay is removed conservatively and rebuilt with layered composite resin that matches your natural shade — no silver, no visible metal.",
      features: ["Tooth-coloured", "Minimally invasive", "Same-day finish", "Bite-balanced"]
    },
    {
      id: "rootcanal", icon: "activity", category: "General",
      title: "Root Canal Treatment",
      short: "Save an infected tooth painlessly — often finished in a single visit.",
      price: "₹4,500", duration: "60–90 min", popular: true,
      details: "Using rotary endodontics and apex locators, we clean and seal the root canal system precisely. Single-visit RCT is available for most non-infected cases.",
      features: ["Single-visit option", "Rotary endodontics", "Virtually painless", "Crown-ready"]
    },
    {
      id: "implants", icon: "implant", category: "Surgical",
      title: "Dental Implants",
      short: "Replace missing teeth with titanium implants that look and bite like the real thing.",
      price: "₹25,000", duration: "2–3 visits",
      details: "Guided implant placement with CBCT planning, premium implant systems and a lifetime of chewing comfort. Painless replacement where a bridge is not ideal.",
      features: ["CBCT-guided planning", "Premium implant brands", "Zirconia crown", "Warranty on fixture"]
    },
    {
      id: "braces", icon: "braces", category: "Orthodontics",
      title: "Braces & Invisible Aligners",
      short: "Straighten teeth discreetly with clear aligners or metal/ceramic braces.",
      price: "₹35,000", duration: "9–24 months",
      details: "Digital smile simulation shows your result before you begin. Choose self-ligating braces, ceramic brackets or fully removable clear aligners.",
      features: ["3D smile simulation", "Clear aligner option", "Monthly adjustments", "Retainers included"]
    },
    {
      id: "veneers", icon: "smile", category: "Cosmetic",
      title: "Smile Design & Veneers",
      short: "Reshape chipped, gapped or stained front teeth into a camera-ready smile.",
      price: "₹8,000", duration: "2–3 visits", popular: true,
      details: "A combination of digital mock-ups, minimal-prep veneers, edge bonding and gum contouring — designed around your face, not a template.",
      features: ["Digital mock-up first", "Minimal tooth reduction", "Stain-resistant", "Trial smile preview"]
    },
    {
      id: "kids", icon: "baby", category: "Kids",
      title: "Kids Dentistry",
      short: "Playful, fear-free visits for children — first tooth to teen years.",
      price: "₹800", duration: "30 min",
      details: "Tell-show-do technique, fluoride application, pit & fissure sealants and habit-breaking appliances, all in a child-friendly room with cartoons and stickers.",
      features: ["Tell–show–do method", "Fluoride & sealants", "Habit correction", "No-fear first visit"]
    },
    {
      id: "extraction", icon: "extract", category: "Surgical",
      title: "Wisdom Tooth Surgery",
      short: "Safe, planned removal of impacted wisdom teeth with quick recovery.",
      price: "₹3,500", duration: "45 min",
      details: "Pre-surgical X-ray assessment, local anaesthesia, atraumatic surgical extraction and a clear aftercare protocol with medication.",
      features: ["X-ray guided", "Atraumatic technique", "Sutures if needed", "Aftercare kit"]
    },
    {
      id: "crowns", icon: "crown", category: "General",
      title: "Crowns & Bridges",
      short: "Zirconia and ceramic crowns that restore strength and natural looks.",
      price: "₹7,000", duration: "2 visits",
      details: "Digitally scanned impressions and computer-milled zirconia crowns with precise margins — comfortable fit, no gooey impression trays needed for most cases.",
      features: ["Zirconia / E-max", "Digital scanning", "Shade matched", "5-year warranty"]
    },
    {
      id: "xray", icon: "scan", category: "General",
      title: "Digital X-ray & OPG",
      short: "Instant, low-radiation imaging to see the full picture before treatment.",
      price: "₹400", duration: "10 min",
      details: "Intra-oral digital X-rays and full-mouth panoramic (OPG) imaging with up to 80% less radiation than film, displayed on a screen you can see.",
      features: ["Instant on-screen result", "Up to 80% less radiation", "Full-mouth OPG", "Digital records"]
    },
    {
      id: "emergency", icon: "emergency", category: "Emergency",
      title: "Emergency Dental Care",
      short: "Severe pain, broken tooth or swelling? We keep same-day slots open.",
      price: "₹1,000", duration: "Same day", popular: true,
      details: "Acute pain relief, drainage of abscesses, temporary or permanent repair of fractured teeth and management of dental trauma after an accident.",
      features: ["Same-day slots", "24×7 on-call advice", "Immediate pain relief", "Trauma care"]
    }
  ],

  /* ------------------------------------------------ HOME/ABOUT: PROCESS */
  process: {
    eyebrow: "How it works",
    title: "Four easy steps to a healthier smile",
    subtitle: "No confusion, no surprise bills — just a clear path from first call to final polish.",
    steps: [
      { title: "Book in seconds",      text: "Call, WhatsApp or use the online form. We confirm your slot within 30 minutes during clinic hours.", icon: "calendar" },
      { title: "Diagnosis & plan",     text: "Examination, digital X-rays and a written treatment plan with prices before anything begins.", icon: "scan" },
      { title: "Gentle treatment",     text: "Treatment is done in comfort-controlled, painless sessions — often finished in one visit.", icon: "heart" },
      { title: "Follow-up & aftercare", text: "We call to check on you, then keep reminders for your next preventive visit.", icon: "check" }
    ]
  },

  /* ------------------------------------------------------------------ ABOUT */
  about: {
    eyebrow: "About SmileCare",
    title: "Family dentistry in Solapur since 2012",
    subtitle: "A modern clinic run by specialists who genuinely enjoy making nervous patients comfortable.",
    paragraph1: "SmileCare Dental Studio began in 2012 as a two-chair clinic on Hotgi Road with one simple belief — that good dentistry should never hurt, and should never surprise you with the bill. Fifteen years, 12,500 patients and four expansions later, that belief is still the whole business plan.",
    paragraph2: "Today we are a full digital practice: intra-oral scanners, CBCT imaging, in-house milling and a team of specialists across implants, orthodontics, cosmetic and paediatric dentistry. Whether it is a child's first check-up or a full-mouth rehabilitation, you get the same unhurried attention.",
    image: "assets/img/clinic-interior.jpg",
    imageAlt: "SmileCare Dental Studio reception area in Solapur",
    since: "2012",
    points: [
      "4 modern treatment chairs with digital workflow",
      "Specialists in every discipline, in-house",
      "Class-B autoclave sterilisation for every instrument",
      "Transparent written estimates and insurance help",
      "Wheelchair-friendly, ground-floor entry access",
      "Priority slots for children and senior citizens"
    ],
    signature: { name: "Dr. Rohan Deshmukh", role: "Founder & Chief Dental Surgeon" }
  },

  /* -------------------------------------------------- MISSION / VISION / VALUES */
  values: [
    { icon: "heart",  title: "Our Mission", text: "To make high-quality, painless dentistry affordable and accessible to every family in Solapur." },
    { icon: "eye",    title: "Our Vision",  text: "A city where nobody delays dental care out of fear — of the chair or of the cost." },
    { icon: "shield", title: "Our Promise", text: "Honest diagnosis, written prices, and only the treatment you actually need." }
  ],
  principles: [
    { title: "Explain everything", text: "You see your X-rays and scans on screen and understand every option before deciding." },
    { title: "Never oversell",     text: "If a tooth can be saved, we save it. If it can wait six months, we tell you that too." },
    { title: "Comfort first",      text: "Numbing before injections, breaks when you need them, and a stop signal you control." },
    { title: "Keep it sterile",    text: "Sterilisation protocols that we would want for our own families. Non-negotiable." }
  ],

  /* --------------------------------------------------------------- TIMELINE */
  timeline: [
    { year: "2012", title: "The first chair",   text: "SmileCare opens as a two-chair clinic on Hotgi Road with Dr. Rohan Deshmukh and one assistant." },
    { year: "2016", title: "Specialist expansion", text: "Paediatric and orthodontic departments added; the team grows to nine members." },
    { year: "2019", title: "Going fully digital",  text: "Intra-oral scanners, digital X-ray and CBCT imaging replace trays and film across the clinic." },
    { year: "2022", title: "Implant & smile centre", text: "Dedicated surgical suite for guided implants and smile-design cases." },
    { year: "2025", title: "12,500 smiles",     text: "Fourth expansion completed — four chairs, six specialists and a dedicated kids' room." }
  ],

  /* ----------------------------------------------------------------- STATS */
  stats: [
    { value: 12500, suffix: "+", label: "Patients treated",  icon: "users" },
    { value: 15,    suffix: "+", label: "Years of practice", icon: "calendar" },
    { value: 6,     suffix: "",  label: "Specialist doctors", icon: "award" },
    { value: 4.9,   suffix: "/5", label: "Google rating", decimals: 1, icon: "star" }
  ],

  /* ----------------------------------------------------------------- DOCTORS */
  doctors: [
    {
      name: "Dr. Rohan Deshmukh", role: "Founder & Chief Dental Surgeon",
      qualification: "BDS, MDS – Oral Implantology", experience: "15+ years",
      image: "assets/img/doctor-1.jpg", specialties: ["Dental Implants", "Full-mouth rehab", "Oral surgery"],
      bio: "Dr. Rohan has placed over 3,000 implants and is known for surgeries so gentle that patients often ask if the procedure has started. He founded SmileCare in 2012."
    },
    {
      name: "Dr. Anjali Rao", role: "Cosmetic & Paediatric Dentist",
      qualification: "BDS, MDS – Pedodontics", experience: "11+ years",
      image: "assets/img/doctor-2.jpg", specialties: ["Smile design", "Veneers", "Kids dentistry"],
      bio: "The person children in Solapur ask for by name. Dr. Anjali blends smile design artistry for adults with endless patience for little ones — and their parents."
    },
    {
      name: "Dr. Kabir Sheikh", role: "Orthodontist & Aligner Specialist",
      qualification: "BDS, MDS – Orthodontics", experience: "9+ years",
      image: "assets/img/doctor-3.jpg", specialties: ["Clear aligners", "Self-ligating braces", "Growth guidance"],
      bio: "A certified clear-aligner provider who has planned 900+ orthodontic cases. Dr. Kabir shows you your future smile digitally before you commit to anything."
    }
  ],

  /* ------------------------------------------------------------------ GALLERY */
  galleryIntro: {
    eyebrow: "Gallery",
    title: "Inside SmileCare & the smiles we build",
    subtitle: "Real photographs from our clinic in Solapur — the rooms, the technology and the people."
  },
  galleryCategories: ["All", "Clinic", "Treatments", "Technology", "Smiles", "Kids"],
  gallery: [
    { id: "g1", src: "assets/img/gallery-treatment-room.jpg", title: "Digital operatory",     category: "Clinic",     tall: false },
    { id: "g2", src: "assets/img/gallery-smile.jpg",          title: "Whitening result",      category: "Smiles",     tall: true },
    { id: "g3", src: "assets/img/clinic-interior.jpg",        title: "Reception & waiting area", category: "Clinic",  tall: false },
    { id: "g4", src: "assets/img/gallery-implants.jpg",       title: "Implant systems",       category: "Technology", tall: false },
    { id: "g5", src: "assets/img/gallery-kids.jpg",           title: "Kids' room",            category: "Kids",       tall: false },
    { id: "g6", src: "assets/img/gallery-sterilization.jpg",  title: "Sterilisation bay",     category: "Treatment",  tall: false },
    { id: "g7", src: "assets/img/hero-dentist.jpg",           title: "Chairside consult",     category: "Treatments", tall: false },
    { id: "g8", src: "assets/img/doctor-2.jpg",               title: "Our care team",         category: "Clinic",     tall: true },
    { id: "g9", src: "assets/img/gallery-treatment-room.jpg", title: "Surgical suite",        category: "Technology", tall: false }
  ],
  /* Before / after slider (drag the handle). Replace `before` with real
     pre-treatment photos when you have them. */
  beforeAfter: {
    title: "Before / After",
    subtitle: "Drag the handle to see the difference — 60 minutes of in-clinic whitening.",
    before: "assets/img/gallery-smile.jpg",
    after:  "assets/img/gallery-smile.jpg",
    beforeLabel: "Before",
    afterLabel: "After",
    note: "* Demo images. Swap in your own patient photos in data/site-data.js → beforeAfter."
  },

  /* ------------------------------------------------------------- TESTIMONIALS */
  testimonialsIntro: {
    eyebrow: "Patient stories",
    title: "12,500 smiles and counting",
    subtitle: "Verified reviews from patients across Solapur, Pune and beyond."
  },
  testimonials: [
    { name: "Priya Kulkarni", city: "Solapur", rating: 5, treatment: "Root canal",
      text: "I postponed my root canal for two years out of fear. It was over in one sitting and I genuinely did not feel a thing. Dr. Rohan explained every step on the screen first." },
    { name: "Amit Khandelwal", city: "Hotgi Road", rating: 5, treatment: "Dental implants",
      text: "Got two implants done over three months. The final teeth match perfectly and I can eat whatever I want again. Pricing was exactly what was quoted on day one." },
    { name: "Sneha Patil", city: "Pune", rating: 5, treatment: "Clear aligners",
      text: "Travelled from Pune for the aligners because of the digital simulation. Fourteen months later my front teeth are straight and nobody ever noticed I was wearing them." },
    { name: "Dr. Farhan Shaikh", city: "Solapur", rating: 5, treatment: "Family dentistry",
      text: "I send my own patients here for specialist work. What stands out is the sterilisation discipline and the honesty. They never push a treatment that isn't needed." },
    { name: "Meera Joshi", city: "Vijapur Road", rating: 5, treatment: "Kids dentistry",
      text: "My six-year-old used to cry at the sight of a clinic. Now she asks when we are going back. The kids' room with cartoons and the stickers did the trick." },
    { name: "Rahul Mane", city: "Akkalkot Road", rating: 5, treatment: "Smile design",
      text: "Wedding in three weeks and a badly chipped front tooth. They did a veneer in two visits and it completely disappeared into my smile. Photos came out perfect." }
  ],

  /* --------------------------------------------------------------------- FAQ */
  faqIntro: {
    eyebrow: "Questions",
    title: "Everything patients ask us",
    subtitle: "Still unsure about something? Call us — we answer honestly, even when the answer is 'you don't need it'."
  },
  faqs: [
    { q: "Is the treatment really painless?", a: "For the vast majority of cases, yes. We use topical numbing gel before every injection, ultra-fine short-bevelled needles and gentle rotary techniques. Most patients report feeling pressure or vibration but no sharp pain. If you are highly anxious, tell us at booking — we also offer sedation options." },
    { q: "How much does a dental implant cost in Solapur?", a: "At SmileCare, single implants start at ₹25,000 including the abutment and a zirconia crown. The final price depends on the implant brand, bone quality and whether grafting is needed. You always get a written estimate before treatment starts, and 0% EMI is available above ₹15,000." },
    { q: "Do you accept insurance and cashless claims?", a: "Yes. We are empanelled with most major insurers and TPAs and can help with pre-authorisation paperwork for planned procedures. For corporate dental insurance, bring your policy card and we will verify coverage during your first visit." },
    { q: "How long does a root canal take?", a: "A straightforward root canal is usually completed in a single 60–90 minute sitting. Infected or curved canals may need two visits a week apart. You will get a crown recommendation afterwards to protect the tooth." },
    { q: "At what age should my child first see a dentist?", a: "First visit by age one, or within six months of the first tooth appearing. Early visits are quick, friendly and mostly preventive — they build comfort so that later treatments are easy." },
    { q: "Do you treat patients in an emergency?", a: "Yes — we keep same-day slots for acute pain, swelling, knocked-out or fractured teeth. Call or WhatsApp us and we will fit you in. Outside clinic hours there is a dentist on call for advice." },
    { q: "How do you sterilise your instruments?", a: "Every instrument is cleaned in an ultrasonic bath, sealed in an indicator pouch and processed in a Class-B vacuum autoclave. Pouches are opened in front of you at the chair. Needles, gloves, suction tips and bibs are single-use." },
    { q: "Can I get braces that nobody notices?", a: "Absolutely. We offer ceramic brackets, lingual options and clear aligners. Aligner treatment starts at ₹35,000 with a 3D simulation so you can see the expected result before starting." }
  ],

  /* ---------------------------------------------------------------- CONTACT */
  contact: {
    eyebrow: "Get in touch",
    title: "Book your appointment",
    subtitle: "Call, WhatsApp or send the form — we reply within 30 minutes during clinic hours.",
    formTitle: "Request an appointment",
    formNote: "This is a static site: the form validates and prepares a WhatsApp / email message for you (no server needed). To store enquiries in a database, plug in a form service like Formspree or your own endpoint — see README.md.",
    successMessage: "Thank you! Your request is ready — we have opened WhatsApp/email so you can send it in one tap.",
    reasons: ["Dental check-up", "Tooth pain / emergency", "Root canal", "Dental implants", "Braces / aligners", "Teeth whitening", "Kids dentistry", "Other"],
    times: ["Morning (9:30 AM – 12 PM)", "Afternoon (12 PM – 4 PM)", "Evening (4 PM – 8:30 PM)", "As soon as possible"],
    cards: [
      { icon: "phone", title: "Call the clinic", lines: ["+91 98765 43210", "24×7 emergency on call"], href: "tel:+919876543210" },
      { icon: "whatsapp", title: "WhatsApp us", lines: ["+91 98765 43210", "Send reports & photos"], href: "https://wa.me/919876543210" },
      { icon: "mail", title: "Email", lines: ["hello@smilecaredental.in", "Replies within 1 working day"], href: "mailto:hello@smilecaredental.in" },
      { icon: "pin", title: "Visit us", lines: ["Sunrise Plaza, Hotgi Road", "Solapur, Maharashtra 413003"], href: "https://maps.google.com/?q=Hotgi+Road+Solapur" }
    ],
    mapNote: "Free parking in front of the building · Wheelchair accessible entry"
  },

  /* ------------------------------------------------------------ CTA BANNER */
  cta: {
    title: "Ready for a healthier smile?",
    text: "Book a free first consultation — examination, digital X-ray review and a written treatment plan.",
    primary:   { label: "Book Appointment", href: "contact.html#book" },
    secondary: { label: "Call +91 98765 43210", href: "tel:+919876543210" },
    bullets: ["No consultation fee", "Written price estimate", "Same-day emergency slots"]
  },

  /* ------------------------------------------------------------------ FOOTER */
  footer: {
    about: "A modern, fully digital dental clinic in Solapur offering painless, transparent and affordable care for the whole family since 2012.",
    columns: [
      { title: "Quick Links", links: [
        { label: "Home", href: "index.html" },
        { label: "About Us", href: "about.html" },
        { label: "Contact", href: "contact.html" },
        { label: "Gallery", href: "gallery.html" }
      ]},
      { title: "Popular Treatments", links: [
        { label: "Dental Implants", href: "services.html#implants" },
        { label: "Braces & Aligners", href: "services.html#braces" },
        { label: "Root Canal", href: "services.html#rootcanal" },
        { label: "Teeth Whitening", href: "services.html#whitening" }
      ]}
    ],
    badges: ["DCI Registered", "ISO-grade sterilisation", "0% EMI available"],
    copyright: "© 2026 SmileCare Dental Studio. All rights reserved.",
    credit: "Website crafted with care · Demo content — replace in data/site-data.js"
  },

  /* --------------------------------------------------------------- UI TEXT */
  ui: {
    readMore: "Read more",
    bookNow: "Book now",
    viewAll: "View all services",
    seeAll: "See all photos",
    from: "From",
    quickBook: "Book appointment",
    lightboxHint: "Use ← → keys, Esc to close",
    formRequired: "Please fill in the highlighted fields correctly."
  }
};
