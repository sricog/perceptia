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
    // Campo de palabras que las lentes «escanean» y absorben: humanas a la izquierda, de máquina a la derecha.
    field: {
      human: ['ver', 'entender', 'sentir', 'intuir', 'diseñar', 'escuchar', 'empatía', 'criterio', 'detalle', 'mirada', 'contexto', 'claridad'],
      machine: ['datos', 'modelos', 'agentes', 'automatizar', 'predecir', 'aprender', 'código', 'APIs', 'escalar', 'vectores', 'tokens', 'flujos'],
    },
    // De cada lente sobrevive una mitad del nombre: PERCEPT(ible) + I(nteligencia) A(rtificial).
    left: ['Percept', 'ible'],
    right: [['I', 'nteligencia'], ['A', 'rtificial']],
    cue: 'Desliza para enfocar',
    primary: 'Cotizar proyecto →',
    secondary: 'Ver proyectos',
  },

  marquee: 'Tecnologías con las que trabajamos',

  studio: {
    cta: 'Ver cómo trabajamos',
    bright: 'Somos un estudio de software. Diseñamos y programamos websites, MVPs y sistemas a la medida',
    dim: 'que se entienden al primer vistazo y siguen funcionando igual de bien el día mil.',
  },

  homeServices: {
    title: ['Lo que ', 'construimos'],
    link: 'Todos los servicios',
  },

  homeProjects: {
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
    title: ['Cómo ', 'trabajamos'],
    lead: 'Un proceso corto y transparente: sabes qué pasa en cada etapa, qué recibes y cuándo.',
    more: 'Ver el proceso completo',
    steps: [
      {
        t: 'Entendemos',
        tag: 'Llamada de descubrimiento',
        d: 'Sesión de descubrimiento: objetivos, usuarios y restricciones del negocio.',
        items: ['Qué quieres lograr y para quién', 'Cómo vamos a medir el éxito', 'Restricciones técnicas, tiempos y presupuesto'],
      },
      {
        t: 'Definimos',
        tag: 'Propuesta y prototipo',
        d: 'Alcance, arquitectura y un prototipo navegable antes de escribir código.',
        items: ['Propuesta con alcance y precio', 'Arquitectura y tecnologías recomendadas', 'Prototipo navegable para validar el flujo'],
      },
      {
        t: 'Construimos y validamos',
        tag: 'Ciclos semanales',
        d: 'Entregas semanales y un entorno de pruebas siempre disponible.',
        items: ['Demo de avances cada semana', 'Entorno de pruebas con la versión más reciente', 'Ajustes con tu feedback en cada ciclo'],
      },
      {
        t: 'Lanzamos y evolucionamos',
        tag: 'Lanzamiento',
        d: 'Despliegue, métricas y mejoras continuas después del lanzamiento.',
        items: ['Despliegue, dominio y analítica', 'Capacitación para tu equipo', 'Soporte y mejoras continuas'],
      },
    ],
    principlesTitle: ['Lo que ', 'siempre', ' recibes'],
    principles: [
      { t: 'Contacto directo', d: 'Hablas con quienes diseñan y programan tu proyecto, sin intermediarios.' },
      { t: 'Avances cada semana', d: 'Ves el producto crecer en un entorno real, no en presentaciones.' },
      { t: 'Todo a tu nombre', d: 'Repositorio, dominio y cuentas quedan a nombre de tu empresa.' },
      { t: 'Decisiones con datos', d: 'Definimos métricas antes de lanzar para saber qué funciona.' },
    ],
    book: {
      title: ['Conócenos y ', 'cotiza tu proyecto'],
      body: '30 minutos para entender tu proyecto y decirte cómo lo haríamos. Sin costo y sin compromiso.',
      cta: 'Cotizar proyecto →',
    },
  },

  reach: {
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

  footer: { site: 'Sitio', contact: 'Contacto', legal: 'Legal', terms: 'Términos y condiciones', privacy: 'Tratamiento de datos' },

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

  processPage: {
    title: 'Proceso',
    description: 'Cómo trabajamos en Perceptia: descubrimiento, propuesta, ciclos semanales y lanzamiento. Transparencia y entregas claras en cada etapa.',
    eyebrow: 'Proceso',
    h1: ['Del primer café al ', 'lanzamiento'],
    lead: 'Así convertimos una idea en un producto en producción, paso a paso y sin sorpresas.',
  },

  booking: {
    id: 'agendar',
    title: ['Conócenos y ', 'cotiza tu proyecto'],
    lead: 'Déjanos tu correo o WhatsApp y cuéntanos en pocas líneas qué quieres construir. Te escribimos para coordinar la llamada.',
    facts: ['30 minutos', 'Videollamada o WhatsApp', 'Sin costo'],
    name: 'Nombre *',
    namePh: 'Tu nombre',
    contact: 'Correo o WhatsApp *',
    contactPh: 'tu@empresa.com o tu número',
    about: '¿Qué quieres construir? *',
    aboutPh: 'Cuéntanos en pocas líneas tu idea o el problema que quieres resolver.',
    submit: 'Quiero que me contacten',
    note: 'Te respondemos por el medio que nos dejes.',
    errors: {
      name: 'Escribe tu nombre.',
      contact: 'Escribe un correo o un número válido.',
      about: 'Cuéntanos un poco más (mínimo 10 caracteres).',
    },
    sending: 'Enviando…',
    sent: {
      title: '¡Listo, {name}!',
      body: 'Recibimos tu solicitud. Te escribimos pronto por correo o WhatsApp para coordinar la llamada.',
      whatsapp: 'Escríbenos por WhatsApp',
      again: 'Enviar otra solicitud',
    },
    failed: 'No pudimos guardar tu solicitud. Inténtalo de nuevo o escríbenos por WhatsApp.',
    wa: 'Hola Perceptia, soy {name}. Acabo de dejarles mis datos en la web para hablar de un proyecto.',
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
    failed: 'No pudimos enviar tu solicitud. Inténtalo de nuevo o escríbenos por WhatsApp.',
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

  consent: {
    pre: 'Acepto los ',
    terms: 'Términos y condiciones',
    mid: ' y autorizo el ',
    privacy: 'tratamiento de mis datos personales',
    post: '.',
    error: 'Para enviar la solicitud debes aceptar los términos y autorizar el tratamiento de tus datos.',
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
