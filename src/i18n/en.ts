import type { Dict } from './index';

/** English copy. Must match the shape of `es.ts` (enforced by the `Dict` type). */
export const en: Dict = {
  htmlLang: 'en',
  ogLocale: 'en_US',
  short: 'EN',
  name: 'English',

  meta: {
    tagline: 'Engineering you can perceive.',
    description:
      'Perceptia is a software studio building websites, landing pages, MVPs, custom software and automations that make sense at first glance.',
  },

  ids: { services: 'services', projects: 'projects', process: 'process' },

  a11y: {
    skip: 'Skip to content',
    home: 'Perceptia, home',
    mainNav: 'Main',
    mobileNav: 'Mobile',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    language: 'Language',
    switchTo: 'View in {lang}',
  },

  nav: {
    services: 'Services',
    projects: 'Projects',
    process: 'Process',
    contact: 'Contact',
    cta: 'Get a quote',
  },

  hero: {
    label: 'Home',
    title: ['Engineering you can ', 'perceive.'],
    lead: 'We build',
    words: [
      ['software', 'tailored to you'],
      ['landing pages', 'that convert'],
      ['MVPs', 'ready to validate'],
    ],
    log: [
      'initializing project',
      'resolving architecture',
      'compiling · <b data-count="12">12</b>/12 modules',
      'tests · <b data-count="148">148</b> passed',
      'deployed to production',
    ],
    cue: 'Scroll to focus',
    primary: 'Get a quote →',
    secondary: 'See projects',
  },

  marquee: 'Technologies we work with',

  studio: {
    eyebrow: '01 · Studio',
    bright: "We're a software studio. We design and build websites, MVPs and custom systems",
    dim: 'that make sense at first glance and keep working just as well on day one thousand.',
  },

  homeServices: {
    eyebrow: '02 · Services',
    title: ['What we ', 'build'],
    link: 'All services',
  },

  featured: {
    eyebrow: '03 · Featured project',
    sub: 'Web app · design, development and launch',
    aria: 'View MiQuarto live',
    alt: 'MiQuarto platform mockup on laptop and phone',
  },

  homeProjects: {
    eyebrow: '04 · Projects',
    title: ['', 'Live', ' projects'],
  },

  projects: {
    filterLabel: 'Filter projects',
    all: 'All',
    kinds: { web: 'Website', app: 'Web app' },
    filters: { web: 'Websites', app: 'Web apps' },
    alt: '{name} mockup on laptop and phone',
    visit: 'Visit site ↗',
    meta: {
      miquarto: { sector: 'Proptech · furnished rentals', place: 'Colombia' },
      imagenes: { sector: 'Healthcare · dental imaging', place: 'Antioquia, CO' },
      aktiva: { sector: 'B2B corporate events', place: 'Colombia' },
      raiz: { sector: 'Travel · retreats', place: 'Bahía Solano, CO' },
      smoke: { sector: 'Restaurant · BBQ', place: 'Guaynabo, PR' },
      market: { sector: 'Food · online store', place: 'Colombia' },
      casamayor: { sector: 'Real estate', place: 'Miami, FL' },
      adastra: { sector: 'Culture · funding', place: 'Spain' },
    },
    inFocus: 'In focus',
    focusing: 'Focusing',
    index: 'Project index',
    viewer: 'Viewer',
  },

  process: {
    eyebrow: '05 · Process',
    title: ['How we ', 'work'],
    steps: [
      { t: 'Understand', d: 'A discovery session to map goals, users and business constraints.' },
      { t: 'Define', d: 'Scope, architecture and a clickable prototype before any code is written.' },
      { t: 'Build & validate', d: 'Weekly releases and a staging environment that is always available.' },
      { t: 'Launch & evolve', d: 'Deployment, metrics and continuous improvement after launch.' },
    ],
  },

  reach: {
    eyebrow: '06 · Reach',
    title: ['Remote, ', 'borderless'],
    body: 'Clients in Colombia, Puerto Rico, the United States and Spain. Calls, deliveries and support in your time zone.',
    places: [
      { id: 'co', name: 'Colombia', city: 'Medellín', tz: 'UTC−5' },
      { id: 'pr', name: 'Puerto Rico', city: 'San Juan', tz: 'UTC−4' },
      { id: 'us', name: 'United States', city: 'Miami', tz: 'UTC−5 to −8' },
      { id: 'es', name: 'Spain', city: 'Madrid', tz: 'UTC+1' },
    ],
    hint: 'Drag the globe · pick a country to focus it',
    localTime: 'Local time in {city}',
  },

  cta: {
    line1: 'What do you want',
    title: ['people to ', 'perceive', '?'],
    body: "Tell us about your project and we'll send you a proposal.",
    primary: 'Get a quote →',
  },

  footer: { site: 'Site', contact: 'Contact', legal: 'Legal' },

  pricing: { from: 'From', proposal: 'Proposal', request: 'Request a proposal', quote: 'Get a quote →' },

  services: {
    websites: {
      slug: 'websites',
      title: 'Websites & landing pages',
      form: 'Website / landing',
      short: 'Fast, measurable, easy-to-edit sites designed to turn visitors into customers.',
      long: 'A clear, fast digital presence designed to turn attention into opportunities. Custom-designed, never templated.',
      includes: ['Custom visual design', 'Responsive experience', 'Contact form or direct line', 'Initial SEO', 'Delivered ready to run'],
    },
    mvps: {
      slug: 'mvps',
      title: 'MVPs',
      form: 'MVP',
      price: '',
      short: 'From idea to a usable product in weeks, ready to validate with real users.',
      long: 'The essential version of your product, built to validate an opportunity with real users without overbuilding.',
      includes: ['Scope definition', 'Prototype and core experience', 'Essential features', 'Testing', 'Launch preparation'],
    },
    custom: {
      slug: 'custom-software',
      title: 'Custom software',
      form: 'Custom software',
      price: '',
      short: 'Platforms, dashboards and internal systems built around the way you operate.',
      long: "Software built around your company's processes, integrations and goals, on an architecture ready to grow.",
      includes: ['Platforms and portals', 'Internal tools', 'Integrations', 'Automations', 'Architecture built to evolve'],
    },
    automation: {
      slug: 'automation',
      title: 'Automation',
      form: 'Automation',
      price: '',
      short: 'We connect your tools and remove repetitive work with reliable workflows.',
      long: 'Workflows that move data between your tools, keep your team in the loop and take care of repetitive work, with monitoring so nothing slips through.',
      includes: ['Process mapping', 'Tool and API integrations', 'AI-powered flows where they add value', 'Alerts and monitoring', 'Documentation and handoff'],
    },
  },

  servicesPage: {
    title: 'Services',
    description:
      'Websites and landing pages, MVPs, custom software and automation. Software design and development for Colombia, Puerto Rico and the United States.',
    eyebrow: 'Services',
    h1: ['What we ', 'build', ' with you'],
    lead: 'Four ways to work together. They all start the same way: understanding your business before writing a single line of code.',
  },

  projectsPage: {
    title: 'Projects',
    description:
      'Websites and web apps already out in the world: MiQuarto, Aktiva Experience, Raíz & Alma, Casa Mayor Realtor and more.',
    eyebrow: 'Projects',
    h1: ['', 'Live', ' work'],
    lead: 'Products and experiences built for businesses across industries. All in production: click through and see them live.',
  },

  contactPage: {
    title: 'Get a quote',
    description: "Tell us about your project and we'll send you a proposal: websites, MVPs, custom software and automation.",
    eyebrow: 'Contact',
    h1: ['Start your ', 'project'],
    lead: "Tell us what you want people to perceive. We'll send you scope, timelines and a clear proposal.",
    hours: 'Hours',
    hoursValue: 'Mon–Fri · UTC−5',
  },

  form: {
    serviceParam: 'service',
    name: 'Name *',
    namePh: 'Your name',
    email: 'Email *',
    emailPh: 'you@company.com',
    company: 'Company',
    companyPh: 'Optional',
    need: 'What do you need? *',
    other: 'Other',
    budget: 'Estimated budget',
    budgets: ['< COP 2M', 'COP 2M – 8M', 'COP 8M – 20M', 'COP 20M+', 'Not sure yet'],
    message: 'Tell us about the project *',
    messagePh: 'Goals, timeline, references…',
    note: 'We reply within 24 business hours.',
    submit: 'Send request →',
    sending: 'Sending…',
    errors: {
      name: 'Please tell us your name.',
      email: 'Please check your email.',
      types: 'Pick at least one project type.',
      message: 'Give us a little more context.',
    },
    sent: {
      title: ['Thanks! Message ', 'perceived', '.'],
      body: "We'll get back to you within 24 business hours with next steps. If you'd rather talk now, message us on WhatsApp.",
      cta: 'Continue on WhatsApp →',
    },
    wa: {
      hello: "Hi Perceptia, I'm {name}",
      company: ' from {company}',
      want: ". I'd like a quote for: {labels}.",
      budget: ' Budget: {budget}.',
    },
  },

  whatsapp: "Hi Perceptia, I'd like a quote for a project.",

  notFound: {
    title: 'Page not found',
    eyebrow: 'Error 404',
    h1: ['Nothing to ', 'perceive', ' here.'],
    body: "The page you're looking for doesn't exist or has moved.",
    back: 'Back to home →',
  },
};
