/**
 * Textos en español (idioma por defecto). Define la forma del diccionario:
 * `en.ts` debe tener exactamente las mismas claves (lo verifica TypeScript).
 *
 * Convención para títulos con palabra de acento: [antes, acento, después?].
 * Plantillas con {variable} se completan con `fill()` de i18n/index.ts.
 */
export const es = {
  htmlLang: 'es',
  ogLocale: 'es_CO',
  short: 'ES',
  name: 'Español',

  meta: {
    tagline: 'Ingeniería que se percibe.',
    description:
      'Perceptia es un estudio de software: websites, landing pages, MVPs, desarrollo a la medida y automatizaciones que se entienden al primer vistazo.',
  },

  // Anclas de secciones (cambian por idioma para que las URLs se lean bien).
  ids: { services: 'servicios', projects: 'proyectos', process: 'proceso' },

  a11y: {
    skip: 'Saltar al contenido',
    home: 'Perceptia, inicio',
    mainNav: 'Principal',
    mobileNav: 'Móvil',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    language: 'Idioma',
    switchTo: 'Ver en {lang}',
  },

  nav: {
    services: 'Servicios',
    projects: 'Proyectos',
    process: 'Proceso',
    contact: 'Contacto',
    cta: 'Cotizar proyecto',
  },

  hero: {
    label: 'Inicio',
    title: ['Ingeniería que se ', 'percibe.'],
    lead: 'Hacemos',
    words: [
      ['software', 'a la medida'],
      ['landing pages', 'que convierten'],
      ['MVPs', 'listos para validar'],
    ],
    // `<b data-count>` lo anima el script durante su paso (0 → valor final).
    log: [
      'inicializando proyecto',
      'resolviendo arquitectura',
      'compilando · <b data-count="12">12</b>/12 módulos',
      'pruebas · <b data-count="148">148</b> pasadas',
      'desplegado en producción',
    ],
    cue: 'Desliza para enfocar',
    primary: 'Cotizar proyecto →',
    secondary: 'Ver proyectos',
  },

  marquee: 'Tecnologías con las que trabajamos',

  studio: {
    eyebrow: '01 · Estudio',
    bright: 'Somos un estudio de software. Diseñamos y programamos websites, MVPs y sistemas a la medida',
    dim: 'que se entienden al primer vistazo y siguen funcionando igual de bien el día mil.',
  },

  homeServices: {
    eyebrow: '02 · Servicios',
    title: ['Lo que ', 'construimos'],
    link: 'Todos los servicios',
  },

  featured: {
    eyebrow: '03 · Proyecto destacado',
    sub: 'App web · diseño, desarrollo y lanzamiento',
    aria: 'Ver MiQuarto en vivo',
    alt: 'Mockup de la plataforma MiQuarto en laptop y móvil',
  },

  homeProjects: {
    eyebrow: '04 · Proyectos',
    title: ['Proyectos ', 'en vivo'],
  },

  projects: {
    filterLabel: 'Filtrar proyectos',
    all: 'Todos',
    kinds: { web: 'Website', app: 'App web' },
    filters: { web: 'Websites', app: 'Apps web' },
    alt: 'Mockup de {name} en laptop y móvil',
    visit: 'Ver sitio ↗',
    meta: {
      miquarto: { sector: 'Proptech · arriendos amoblados', place: 'Colombia' },
      imagenes: { sector: 'Salud · imagenología oral', place: 'Antioquia, CO' },
      aktiva: { sector: 'Eventos corporativos B2B', place: 'Colombia' },
      raiz: { sector: 'Turismo · retiros', place: 'Bahía Solano, CO' },
      smoke: { sector: 'Restaurante · BBQ', place: 'Guaynabo, PR' },
      market: { sector: 'Alimentos · tienda en línea', place: 'Colombia' },
      casamayor: { sector: 'Bienes raíces', place: 'Miami, FL' },
      adastra: { sector: 'Cultura · financiación', place: 'España' },
    },
    inFocus: 'En foco',
    focusing: 'Enfocando',
    index: 'Índice de proyectos',
    viewer: 'Visor',
  },

  process: {
    eyebrow: '05 · Proceso',
    title: ['Cómo ', 'trabajamos'],
    steps: [
      { t: 'Entendemos', d: 'Sesión de descubrimiento: objetivos, usuarios y restricciones del negocio.' },
      { t: 'Definimos', d: 'Alcance, arquitectura y un prototipo navegable antes de escribir código.' },
      { t: 'Construimos y validamos', d: 'Entregas semanales y un entorno de pruebas siempre disponible.' },
      { t: 'Lanzamos y evolucionamos', d: 'Despliegue, métricas y mejoras continuas después del lanzamiento.' },
    ],
  },

  reach: {
    eyebrow: '06 · Alcance',
    title: ['Remoto, ', 'sin fronteras'],
    body: 'Clientes en Colombia, Puerto Rico, Estados Unidos y España. Llamadas, entregas y soporte en tu zona horaria.',
    places: [
      { id: 'co', name: 'Colombia', city: 'Medellín', tz: 'UTC−5' },
      { id: 'pr', name: 'Puerto Rico', city: 'San Juan', tz: 'UTC−4' },
      { id: 'us', name: 'Estados Unidos', city: 'Miami', tz: 'UTC−5 a −8' },
      { id: 'es', name: 'España', city: 'Madrid', tz: 'UTC+1' },
    ],
    localTime: 'Hora local en {city}',
  },

  cta: {
    line1: '¿Qué quieres que',
    title: ['la gente ', 'perciba', '?'],
    body: 'Cuéntanos tu proyecto y te enviamos una propuesta.',
    primary: 'Cotizar proyecto →',
  },

  footer: { site: 'Sitio', contact: 'Contacto', legal: 'Legal' },

  pricing: { from: 'Desde', proposal: 'Propuesta', request: 'Solicitar propuesta', quote: 'Cotizar →' },

  // Por id interno de servicio (ver `services` en data/site.ts).
  services: {
    websites: {
      slug: 'websites',
      title: 'Websites y landing pages',
      form: 'Website / landing',
      short: 'Sitios rápidos, medibles y fáciles de editar, pensados para convertir visitas en clientes.',
      long: 'Una presencia digital clara, rápida y diseñada para convertir atención en oportunidades. Diseño propio, nada de plantillas.',
      includes: ['Diseño visual personalizado', 'Experiencia responsive', 'Formulario o contacto directo', 'SEO inicial', 'Entrega lista para operar'],
    },
    mvps: {
      slug: 'mvps',
      title: 'MVPs',
      form: 'MVP',
      price: '',
      short: 'De la idea a un producto usable en semanas, listo para validar con usuarios reales.',
      long: 'La versión esencial de tu producto para validar una oportunidad con usuarios reales, sin construir de más.',
      includes: ['Definición de alcance', 'Prototipo y experiencia principal', 'Funcionalidades esenciales', 'Pruebas', 'Preparación de lanzamiento'],
    },
    custom: {
      slug: 'a-la-medida',
      title: 'Desarrollo a la medida',
      form: 'Software a la medida',
      price: '',
      short: 'Plataformas, paneles y sistemas internos construidos alrededor de tu operación.',
      long: 'Software construido alrededor de los procesos, integraciones y objetivos de tu empresa, con una arquitectura preparada para crecer.',
      includes: ['Plataformas y portales', 'Herramientas internas', 'Integraciones', 'Automatizaciones', 'Arquitectura preparada para evolucionar'],
    },
    automation: {
      slug: 'automatizaciones',
      title: 'Automatizaciones',
      form: 'Automatización',
      price: '',
      short: 'Conectamos tus herramientas y eliminamos tareas repetitivas con flujos confiables.',
      long: 'Flujos que mueven datos entre tus herramientas, notifican a tu equipo y se encargan del trabajo repetitivo, con monitoreo para que nada se pierda.',
      includes: ['Mapeo de procesos', 'Integración entre herramientas y APIs', 'Flujos con IA cuando suman', 'Alertas y monitoreo', 'Documentación y traspaso'],
    },
  },

  servicesPage: {
    title: 'Servicios',
    description:
      'Websites y landing pages, MVPs, desarrollo a la medida y automatizaciones. Diseño y desarrollo de software en Colombia, Puerto Rico y Estados Unidos.',
    eyebrow: 'Servicios',
    h1: ['Lo que ', 'construimos', ' contigo'],
    lead: 'Cuatro formas de trabajar juntos. Todas empiezan igual: entendiendo tu negocio antes de escribir una línea de código.',
  },

  projectsPage: {
    title: 'Proyectos',
    description:
      'Websites y apps web que ya están en el mundo: MiQuarto, Aktiva Experience, Raíz & Alma, Casa Mayor Realtor y más.',
    eyebrow: 'Proyectos',
    h1: ['Trabajo ', 'en vivo'],
    lead: 'Productos y experiencias construidas para negocios de distintas industrias. Todos en producción: haz clic y visítalos.',
  },

  contactPage: {
    title: 'Cotizar proyecto',
    description: 'Cuéntanos tu proyecto y te enviamos una propuesta: websites, MVPs, software a la medida y automatizaciones.',
    eyebrow: 'Contacto',
    h1: ['Cotiza tu ', 'proyecto'],
    lead: 'Cuéntanos qué quieres que la gente perciba. Te enviamos alcance, tiempos y una propuesta clara.',
    hours: 'Horario',
    hoursValue: 'Lun–Vie · UTC−5',
  },

  // Se pasa entero al formulario (React), así que solo contiene texto serializable.
  form: {
    serviceParam: 'servicio',
    name: 'Nombre *',
    namePh: 'Tu nombre',
    email: 'Correo *',
    emailPh: 'tu@empresa.com',
    company: 'Empresa',
    companyPh: 'Opcional',
    need: '¿Qué necesitas? *',
    other: 'Otro',
    budget: 'Presupuesto estimado',
    budgets: ['< $2M COP', '$2M – $8M', '$8M – $20M', '+ $20M', 'Aún no sé'],
    message: 'Cuéntanos del proyecto *',
    messagePh: 'Objetivo, fechas, referencias…',
    note: 'Respondemos en menos de 24 h hábiles.',
    submit: 'Enviar solicitud →',
    sending: 'Enviando…',
    errors: {
      name: 'Cuéntanos tu nombre.',
      email: 'Revisa el correo.',
      types: 'Elige al menos un tipo de proyecto.',
      message: 'Danos un poco más de contexto.',
    },
    sent: {
      title: ['¡Gracias! Ya lo ', 'percibimos', '.'],
      body: 'Te responderemos en menos de 24 horas hábiles con los siguientes pasos. Si prefieres hablar ya, escríbenos por WhatsApp.',
      cta: 'Continuar por WhatsApp →',
    },
    wa: {
      hello: 'Hola Perceptia, soy {name}',
      company: ' de {company}',
      want: '. Quiero cotizar: {labels}.',
      budget: ' Presupuesto: {budget}.',
    },
  },

  whatsapp: 'Hola Perceptia, quiero cotizar un proyecto.',

  notFound: {
    title: 'Página no encontrada',
    eyebrow: 'Error 404',
    h1: ['Esto no se ', 'percibe', '.'],
    body: 'La página que buscas no existe o cambió de lugar.',
    back: 'Volver al inicio →',
  },
};
