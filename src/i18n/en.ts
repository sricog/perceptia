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
    home: 'Home',
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
    field: {
      human: ['see', 'understand', 'feel', 'intuition', 'design', 'listen', 'empathy', 'judgment', 'detail', 'taste', 'context', 'clarity'],
      machine: ['data', 'models', 'agents', 'automate', 'predict', 'learn', 'code', 'APIs', 'scale', 'vectors', 'tokens', 'workflows'],
    },
    left: ['Percept', 'ion'],
    right: [['I', 'ntelligent'], ['A', 'utomation']],
    note: 'perception + intelligent automation',
    cue: 'Scroll to focus',
    primary: 'Get a quote →',
    secondary: 'See projects',
  },

  marquee: 'Technologies we work with',

  studio: {
    cta: 'See how we work',
    bright: "We're a software studio. We design and build websites, MVPs and custom systems",
    dim: 'that make sense at first glance and keep working just as well on day one thousand.',
  },

  homeServices: {
    title: ['What we ', 'build'],
    link: 'All services',
  },

  homeProjects: {
    title: ['', 'Live', ' projects'],
    link: 'See all projects',
  },

  projects: {
    filterLabel: 'Filter projects',
    all: 'All',
    kinds: { web: 'Website', app: 'Web app' },
    filters: { web: 'Websites', app: 'Web apps' },
    shotAlt: 'Screenshot of the {name} website',
    prev: 'Previous project',
    next: 'Next project',
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
    index: 'Projects',
  },

  process: {
    title: ['How we ', 'work'],
    lead: 'A short, transparent process: you know what happens at each stage, what you get and when.',
    more: 'See the full process',
    get: 'What you get',
    stage: 'At this stage',
    steps: [
      {
        t: 'Understand',
        tag: 'Discovery call',
        d: 'One call to understand your business, your users and your limits.',
        items: ['Clear goals', 'Success metrics', 'Timing and budget'],
        long: 'We start with a discovery session to map your goals, your users and your business constraints.',
        details: ['What you want to achieve and for whom', 'How we will measure success', 'Technical constraints, timing and budget'],
      },
      {
        t: 'Define',
        tag: 'Proposal & prototype',
        d: 'You see a clickable prototype before we write any code.',
        items: ['Scope and price', 'Architecture', 'Clickable prototype'],
        long: 'We define scope and architecture, and show you a clickable prototype before any code is written.',
        details: ['A proposal with scope and price', 'Recommended architecture and stack', 'A clickable prototype to validate the flow'],
      },
      {
        t: 'Build & validate',
        tag: 'Weekly cycles',
        d: 'Every week you try a new version and tell us what to adjust.',
        items: ['Weekly demo', 'Staging environment', 'Changes from your feedback'],
        long: 'We work in weekly cycles: every week there is a release, and a staging environment is always available.',
        details: ['A demo of progress every week', 'Staging with the latest version', 'Adjustments from your feedback each cycle'],
      },
      {
        t: 'Launch & evolve',
        tag: 'Launch',
        d: 'We ship, measure and keep improving with you.',
        items: ['Deployment and analytics', 'Training', 'Ongoing support'],
        long: 'We deploy, measure and keep improving the product after launch.',
        details: ['Deployment, domain and analytics', 'Training for your team', 'Support and continuous improvement'],
      },
    ],
    principlesTitle: ['What you ', 'always', ' get'],
    principles: [
      { t: 'Direct contact', d: 'You talk to the people who design and build your project, no middlemen.' },
      { t: 'Progress every week', d: 'You see the product grow in a real environment, not in slide decks.' },
      { t: 'Everything in your name', d: 'Repository, domain and accounts belong to your company.' },
      { t: 'Data-driven decisions', d: 'We define metrics before launch so we know what works.' },
    ],
    book: {
      title: ['Book a ', 'call'],
      body: "30 minutes to understand your project and tell you how we'd build it. Free, no strings attached.",
      cta: 'Book a call',
    },
  },

  reach: {
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

  footer: { site: 'Site', contact: 'Contact', legal: 'Legal', terms: 'Terms and conditions', privacy: 'Privacy policy' },

  pricing: { from: 'From', proposal: 'Proposal', request: 'Request a proposal', quote: 'Get a quote →' },

  servicesViz: { url: 'yourbrand.com', lead: 'New lead', leadSub: 'Website form', idea: 'Idea', product: 'Product' },

  services: {
    websites: {
      slug: 'websites',
      title: 'Websites & landing pages',
      form: 'Website / landing',
      short: 'Fast, measurable sites that turn visitors into customers.',
      long: 'A clear, fast digital presence designed to turn attention into opportunities. Custom-designed, never templated.',
      includes: ['Custom visual design', 'Responsive experience', 'Contact form or direct line', 'Initial SEO', 'Delivered ready to run'],
    },
    mvps: {
      slug: 'mvps',
      title: 'MVPs',
      form: 'MVP',
      price: '',
      short: 'From idea to a usable product in weeks.',
      long: 'The essential version of your product, built to validate an opportunity with real users without overbuilding.',
      includes: ['Scope definition', 'Prototype and core experience', 'Essential features', 'Testing', 'Launch preparation'],
    },
    custom: {
      slug: 'custom-software',
      title: 'Custom software',
      form: 'Custom software',
      price: '',
      short: 'Platforms and dashboards built around the way you operate.',
      long: "Software built around your company's processes, integrations and goals, on an architecture ready to grow.",
      includes: ['Platforms and portals', 'Internal tools', 'Integrations', 'Automations', 'Architecture built to evolve'],
    },
    automation: {
      slug: 'automation',
      title: 'Automation',
      form: 'Automation',
      price: '',
      short: 'We connect your tools and remove the repetitive work.',
      long: 'Workflows that move data between your tools, keep your team in the loop and take care of repetitive work, with monitoring so nothing slips through.',
      includes: ['Process mapping', 'Tool and API integrations', 'AI-powered flows where they add value', 'Alerts and monitoring', 'Documentation and handoff'],
    },
  },

  processPage: {
    title: 'Process',
    description: 'How we work at Perceptia: discovery, proposal, weekly cycles and launch. Book a 30-minute call.',
    eyebrow: 'Process',
    h1: ['From first coffee to ', 'launch'],
    lead: 'How we turn an idea into a product in production, step by step and with no surprises.',
  },

  booking: {
    id: 'book',
    title: ['Book your ', 'call'],
    lead: "Leave your email or WhatsApp and tell us in a few lines what you want to build. We'll reach out to set up the call.",
    facts: ['30 minutes', 'Video call or WhatsApp', 'Free'],
    name: 'Name *',
    namePh: 'Your name',
    contact: 'Email or WhatsApp *',
    contactPh: 'you@company.com or your number',
    about: 'What do you want to build? *',
    aboutPh: 'Tell us in a few lines about your idea or the problem you want to solve.',
    submit: 'Get in touch with me',
    note: "We'll reply through whichever channel you leave us.",
    errors: {
      name: 'Enter your name.',
      contact: 'Enter a valid email or phone number.',
      about: 'Tell us a bit more (at least 10 characters).',
    },
    sending: 'Sending…',
    sent: {
      title: "You're all set, {name}!",
      body: "We got your request. We'll reach out soon by email or WhatsApp to set up the call.",
      whatsapp: 'Message us on WhatsApp',
      again: 'Send another request',
    },
    failed: "We couldn't save your request. Try again or message us on WhatsApp.",
    wa: 'Hi Perceptia, this is {name}. I just left my details on your website to talk about a project.',
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
    failed: "We couldn't send your request. Try again or message us on WhatsApp.",
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

  consent: {
    pre: 'I accept the ',
    terms: 'Terms and conditions',
    mid: ' and authorize the ',
    privacy: 'processing of my personal data',
    post: '.',
    error: 'To send your request you need to accept the terms and authorize the processing of your data.',
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
