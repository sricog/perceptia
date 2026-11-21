/**
 * Términos y condiciones y Política de tratamiento de datos personales (Ley 1581 de 2012 y
 * Decreto 1074 de 2015, Colombia). Texto base redactado para el sitio: conviene que un abogado
 * lo revise y completar `site.legal` (razón social / NIT / dirección) cuando estén definidos.
 *
 * Marcado mínimo dentro de los párrafos:
 *   [texto](terms) · [texto](privacy) → enlace a la otra página legal
 *   {email} · {whatsapp} · {owner} · {city} · {site} → datos de `site`
 */
import type { Lang } from '../i18n';

export type LegalSection = { id: string; h: string; p?: string[]; list?: string[]; after?: string[] };
export type LegalDoc = {
  title: string;
  description: string;
  eyebrow: string;
  h1: string[];
  updated: string;
  intro: string[];
  sections: LegalSection[];
};

// Al cambiar estos textos, actualiza también LEGAL_VERSION en lib/leads.ts (se guarda con cada autorización).

const termsEs: LegalDoc = {
  title: 'Términos y condiciones',
  description: 'Condiciones de uso del sitio perceptiastudio.com y de las solicitudes que se envían desde él.',
  eyebrow: 'Legal',
  h1: ['Términos y ', 'condiciones'],
  updated: 'Última actualización: 21 de noviembre de 2026',
  intro: [
    'Estos términos regulan el uso del sitio {site} y de los formularios para solicitar una llamada o una cotización. Al navegar el sitio o enviar un formulario aceptas estas condiciones. Si no estás de acuerdo, por favor no uses el sitio.',
  ],
  sections: [
    {
      id: 'quienes-somos',
      h: 'Quiénes somos',
      p: [
        '{owner} es un estudio de diseño y desarrollo de software con sede en {city}. Puedes escribirnos a {email} o por WhatsApp al {whatsapp}.',
      ],
    },
    {
      id: 'uso',
      h: 'Uso del sitio',
      p: ['Puedes usar el sitio para conocer nuestros servicios y proyectos y para contactarnos. Al usarlo te comprometes a:'],
      list: [
        'Entregar información veraz en los formularios y no suplantar a otras personas.',
        'No enviar contenido ilícito, ofensivo, publicidad no solicitada ni código malicioso.',
        'No intentar acceder sin autorización a la infraestructura del sitio ni afectar su funcionamiento.',
      ],
    },
    {
      id: 'solicitudes',
      h: 'Solicitudes de llamada y cotización',
      p: [
        'Enviar un formulario no crea una relación contractual ni nos obliga a prestar un servicio. Es una solicitud para que te contactemos por el medio que nos dejaste (correo o WhatsApp).',
        'Las cotizaciones, propuestas y cronogramas que te enviemos son informativos hasta que ambas partes firmen una propuesta o contrato, que es el documento que define el alcance, los precios, los plazos y las condiciones de cada proyecto.',
      ],
    },
    {
      id: 'precios',
      h: 'Precios y contenido del sitio',
      p: [
        'Los precios publicados («desde») son valores de referencia y pueden cambiar sin previo aviso. El valor final depende del alcance de cada proyecto y se confirma en la propuesta.',
        'Procuramos que la información del sitio sea correcta y esté al día, pero puede contener errores u omisiones. No constituye una oferta vinculante.',
      ],
    },
    {
      id: 'propiedad',
      h: 'Propiedad intelectual',
      p: [
        'La marca Perceptia, el logo, los textos, el diseño y el código del sitio pertenecen a {owner} o se usan con autorización. No puedes copiarlos, modificarlos ni usarlos con fines comerciales sin nuestro permiso por escrito.',
        'Los proyectos del portafolio pertenecen a sus respectivos clientes; los mostramos únicamente como muestra de nuestro trabajo. Las marcas de tecnologías y herramientas que aparecen en el sitio pertenecen a sus dueños.',
        'La propiedad del software que desarrollemos para ti se define en el contrato de cada proyecto.',
      ],
    },
    {
      id: 'terceros',
      h: 'Enlaces y servicios de terceros',
      p: [
        'El sitio enlaza a servicios de terceros como WhatsApp, Instagram y los sitios de nuestros clientes. No controlamos su contenido ni sus políticas, y su uso se rige por sus propios términos.',
      ],
    },
    {
      id: 'responsabilidad',
      h: 'Responsabilidad',
      p: [
        'El sitio se ofrece «tal como está». Hacemos lo posible para que esté disponible y seguro, pero no garantizamos que funcione sin interrupciones ni errores. En la medida que lo permita la ley, {owner} no responde por daños derivados del uso del sitio o de la imposibilidad de usarlo.',
      ],
    },
    {
      id: 'datos',
      h: 'Datos personales',
      p: [
        'Los datos que nos dejas en los formularios se tratan según nuestra [Política de tratamiento de datos personales](privacy). Para enviar un formulario es necesario que la aceptes.',
      ],
    },
    {
      id: 'cambios',
      h: 'Cambios a estos términos',
      p: [
        'Podemos actualizar estos términos. La versión vigente es la publicada en esta página, con su fecha de actualización. Los cambios no afectan las solicitudes ni los contratos anteriores.',
      ],
    },
    {
      id: 'ley',
      h: 'Ley aplicable',
      p: [
        'Estos términos se rigen por las leyes de la República de Colombia. Cualquier diferencia se intentará resolver primero de forma directa; si no es posible, será competencia de los jueces de {city}.',
      ],
    },
    {
      id: 'contacto',
      h: 'Contacto',
      p: ['Para cualquier pregunta sobre estos términos escríbenos a {email}.'],
    },
  ],
};

const privacyEs: LegalDoc = {
  title: 'Política de tratamiento de datos personales',
  description: 'Cómo Perceptia recolecta, usa y protege los datos personales que recibe a través de perceptiastudio.com.',
  eyebrow: 'Legal',
  h1: ['Tratamiento de ', 'datos', ' personales'],
  updated: 'Última actualización: 21 de noviembre de 2026',
  intro: [
    'En cumplimiento de la Ley 1581 de 2012, el Decreto 1074 de 2015 y demás normas colombianas de protección de datos (habeas data), esta política explica qué datos recolectamos en {site}, para qué los usamos y cómo puedes ejercer tus derechos.',
  ],
  sections: [
    {
      id: 'responsable',
      h: 'Responsable del tratamiento',
      p: ['{owner}{taxid}, con sede en {city}.'],
      list: ['Correo: {email}', 'WhatsApp: {whatsapp}', 'Sitio web: {site}'],
    },
    {
      id: 'datos',
      h: 'Datos que recolectamos',
      p: ['Solo recolectamos los datos que tú nos entregas en los formularios del sitio:'],
      list: [
        'Solicitud de llamada: nombre, correo o número de WhatsApp y la descripción de lo que quieres construir.',
        'Solicitud de cotización: nombre, correo, empresa (opcional), tipo de proyecto, presupuesto estimado y el mensaje.',
        'Datos de la solicitud: fecha, idioma, la página desde la que la enviaste y la fecha y versión de la autorización que nos diste.',
      ],
      after: [
        'No pedimos datos sensibles (salud, origen étnico, orientación política o religiosa, biométricos, etc.) y te pedimos no incluirlos en los mensajes. El sitio no está dirigido a menores de edad.',
        'El sitio no usa cookies de publicidad ni herramientas de seguimiento. Nuestro proveedor de alojamiento puede registrar datos técnicos (como la dirección IP) por seguridad y funcionamiento del servicio.',
      ],
    },
    {
      id: 'finalidades',
      h: 'Para qué usamos tus datos',
      list: [
        'Contactarte por el medio que nos dejaste para responder tu solicitud y coordinar una llamada.',
        'Preparar y enviarte cotizaciones, propuestas y la información que nos pediste.',
        'Hacer seguimiento comercial a tu solicitud y, si trabajamos juntos, gestionar la relación del proyecto.',
        'Llevar un registro interno de solicitudes y mejorar nuestros servicios.',
        'Cumplir obligaciones legales y atender requerimientos de autoridades.',
      ],
      after: ['No vendemos ni cedemos tus datos a terceros, y no los usamos para enviar publicidad masiva.'],
    },
    {
      id: 'autorizacion',
      h: 'Autorización',
      p: [
        'Al marcar la casilla de autorización y enviar un formulario, nos autorizas de manera previa, expresa e informada a tratar tus datos para las finalidades de esta política. Guardamos la fecha y la versión de la política que aceptaste como prueba de esa autorización.',
      ],
    },
    {
      id: 'encargados',
      h: 'Proveedores y transferencia internacional',
      p: [
        'Para operar usamos proveedores tecnológicos que actúan como encargados del tratamiento y que pueden almacenar la información fuera de Colombia (por ejemplo, en Estados Unidos o la Unión Europea):',
      ],
      list: [
        'Supabase: base de datos donde se guardan las solicitudes.',
        'Cloudflare: alojamiento y seguridad del sitio.',
        'Google (Gmail) y WhatsApp (Meta): canales con los que te respondemos.',
      ],
      after: [
        'Al aceptar esta política autorizas esa transferencia o transmisión. Elegimos proveedores con medidas de seguridad reconocidas y les entregamos solo lo necesario.',
      ],
    },
    {
      id: 'derechos',
      h: 'Tus derechos',
      p: ['Como titular de los datos tienes derecho a:'],
      list: [
        'Conocer, actualizar y rectificar tus datos.',
        'Pedir prueba de la autorización que nos diste.',
        'Ser informado sobre el uso que les hemos dado.',
        'Revocar la autorización o pedir que eliminemos tus datos, cuando no exista un deber legal o contractual de conservarlos.',
        'Consultar gratuitamente tus datos.',
        'Presentar quejas ante la Superintendencia de Industria y Comercio (SIC), después de haber agotado el trámite con nosotros.',
      ],
    },
    {
      id: 'procedimiento',
      h: 'Cómo ejercer tus derechos',
      p: [
        'Escríbenos a {email} con el asunto «Datos personales», tu nombre, el correo o número que usaste en el formulario y lo que necesitas.',
        'Respondemos las consultas en máximo diez (10) días hábiles y los reclamos (corrección, actualización, supresión o revocatoria) en máximo quince (15) días hábiles, contados desde que los recibimos. Si no podemos cumplir ese plazo, te diremos el motivo y la nueva fecha, conforme a la ley.',
      ],
    },
    {
      id: 'conservacion',
      h: 'Conservación y seguridad',
      p: [
        'Guardamos tus datos mientras sean necesarios para atender tu solicitud y la relación comercial que surja de ella. Si no llegamos a trabajar juntos, los eliminamos a más tardar 24 meses después del último contacto, o antes si nos lo pides, salvo que la ley exija conservarlos.',
        'Las solicitudes se guardan en una base de datos con acceso restringido: desde el sitio solo se pueden crear, no leer ni modificar, y solo el equipo de {owner} puede consultarlas.',
      ],
    },
    {
      id: 'fuera-de-colombia',
      h: 'Si nos escribes desde fuera de Colombia',
      p: [
        'Atendemos clientes en otros países. Si vives en la Unión Europea, también tienes los derechos del Reglamento General de Protección de Datos (RGPD), incluida la portabilidad y la oposición, y puedes ejercerlos por el mismo canal. La base para tratar tus datos es tu consentimiento y la gestión de tu solicitud antes de un posible contrato.',
      ],
    },
    {
      id: 'vigencia',
      h: 'Vigencia y cambios',
      p: [
        'Esta política rige desde el 21 de noviembre de 2026. Si hacemos cambios importantes, los publicaremos en esta página con su nueva fecha. También puedes consultar nuestros [Términos y condiciones](terms).',
      ],
    },
  ],
};

const termsEn: LegalDoc = {
  title: 'Terms and conditions',
  description: 'Terms of use for perceptiastudio.com and for the requests sent through it.',
  eyebrow: 'Legal',
  h1: ['Terms and ', 'conditions'],
  updated: 'Last updated: November 21, 2026',
  intro: [
    'These terms govern your use of {site} and of the forms to request a call or a quote. By browsing the site or submitting a form you accept these terms. If you do not agree, please do not use the site.',
  ],
  sections: [
    { id: 'who-we-are', h: 'Who we are', p: ['{owner} is a software design and development studio based in {city}. You can reach us at {email} or on WhatsApp at {whatsapp}.'] },
    {
      id: 'use',
      h: 'Use of the site',
      p: ['You may use the site to learn about our services and projects and to contact us. When using it you agree to:'],
      list: [
        'Provide truthful information in the forms and not impersonate anyone.',
        'Not send unlawful or offensive content, unsolicited advertising or malicious code.',
        'Not attempt unauthorized access to the site’s infrastructure or disrupt its operation.',
      ],
    },
    {
      id: 'requests',
      h: 'Call and quote requests',
      p: [
        'Submitting a form does not create a contract or oblige us to provide a service. It is a request for us to contact you through the channel you gave us (email or WhatsApp).',
        'Quotes, proposals and timelines we send you are informational until both parties sign a proposal or contract, which defines the scope, prices, deadlines and conditions of each project.',
      ],
    },
    {
      id: 'prices',
      h: 'Prices and site content',
      p: [
        'Published prices (“from”) are reference values and may change without notice. The final price depends on each project’s scope and is confirmed in the proposal.',
        'We try to keep the site accurate and up to date, but it may contain errors or omissions. It is not a binding offer.',
      ],
    },
    {
      id: 'ip',
      h: 'Intellectual property',
      p: [
        'The Perceptia brand, logo, copy, design and code of the site belong to {owner} or are used with permission. You may not copy, modify or use them commercially without our written consent.',
        'Portfolio projects belong to their respective clients; we show them only as samples of our work. Technology and tool brands shown on the site belong to their owners.',
        'Ownership of the software we build for you is defined in each project’s contract.',
      ],
    },
    { id: 'third-parties', h: 'Third-party links and services', p: ['The site links to third-party services such as WhatsApp, Instagram and our clients’ websites. We do not control their content or policies, and their use is governed by their own terms.'] },
    {
      id: 'liability',
      h: 'Liability',
      p: ['The site is provided “as is”. We do our best to keep it available and secure, but we do not guarantee it will work without interruptions or errors. To the extent permitted by law, {owner} is not liable for damages arising from the use of, or inability to use, the site.'],
    },
    { id: 'data', h: 'Personal data', p: ['The data you leave in our forms is handled according to our [Privacy policy](privacy). You must accept it to submit a form.'] },
    { id: 'changes', h: 'Changes to these terms', p: ['We may update these terms. The version in force is the one published on this page, with its update date. Changes do not affect earlier requests or contracts.'] },
    { id: 'law', h: 'Governing law', p: ['These terms are governed by the laws of the Republic of Colombia. We will first try to resolve any dispute directly; otherwise, the courts of {city} will have jurisdiction.'] },
    { id: 'contact', h: 'Contact', p: ['For any question about these terms, write to {email}.'] },
  ],
};

const privacyEn: LegalDoc = {
  title: 'Privacy policy',
  description: 'How Perceptia collects, uses and protects the personal data it receives through perceptiastudio.com.',
  eyebrow: 'Legal',
  h1: ['Privacy ', 'policy'],
  updated: 'Last updated: November 21, 2026',
  intro: [
    'In accordance with Colombian data protection law (Law 1581 of 2012 and Decree 1074 of 2015), this policy explains what data we collect on {site}, what we use it for and how you can exercise your rights.',
  ],
  sections: [
    { id: 'controller', h: 'Data controller', p: ['{owner}{taxid}, based in {city}.'], list: ['Email: {email}', 'WhatsApp: {whatsapp}', 'Website: {site}'] },
    {
      id: 'data',
      h: 'Data we collect',
      p: ['We only collect the data you give us in the site’s forms:'],
      list: [
        'Call request: name, email or WhatsApp number, and a description of what you want to build.',
        'Quote request: name, email, company (optional), project type, estimated budget and your message.',
        'Request data: date, language, the page you sent it from, and the date and version of the consent you gave us.',
      ],
      after: [
        'We do not ask for sensitive data (health, ethnic origin, political or religious views, biometrics, etc.) and ask you not to include it in your messages. The site is not intended for minors.',
        'The site does not use advertising cookies or tracking tools. Our hosting provider may log technical data (such as your IP address) for security and service operation.',
      ],
    },
    {
      id: 'purposes',
      h: 'How we use your data',
      list: [
        'To contact you through the channel you gave us, answer your request and set up a call.',
        'To prepare and send you quotes, proposals and the information you asked for.',
        'To follow up on your request and, if we work together, manage the project relationship.',
        'To keep an internal record of requests and improve our services.',
        'To comply with legal obligations and requests from authorities.',
      ],
      after: ['We do not sell or share your data with third parties, and we do not use it for mass advertising.'],
    },
    {
      id: 'consent',
      h: 'Consent',
      p: ['By ticking the consent box and submitting a form, you give us prior, express and informed authorization to process your data for the purposes in this policy. We store the date and the policy version you accepted as proof of that consent.'],
    },
    {
      id: 'processors',
      h: 'Service providers and international transfers',
      p: ['We rely on technology providers that act as data processors and may store information outside Colombia (for example, in the United States or the European Union):'],
      list: ['Supabase: the database where requests are stored.', 'Cloudflare: hosting and security of the site.', 'Google (Gmail) and WhatsApp (Meta): the channels we use to reply to you.'],
      after: ['By accepting this policy you authorize that transfer. We choose providers with recognized security measures and share only what is necessary.'],
    },
    {
      id: 'rights',
      h: 'Your rights',
      p: ['As the data subject you have the right to:'],
      list: [
        'Access, update and correct your data.',
        'Request proof of the consent you gave us.',
        'Be informed about how we have used it.',
        'Withdraw your consent or ask us to delete your data, when there is no legal or contractual duty to keep it.',
        'Access your data free of charge.',
        'File complaints with Colombia’s Superintendence of Industry and Commerce (SIC) after first raising them with us.',
      ],
    },
    {
      id: 'how',
      h: 'How to exercise your rights',
      p: [
        'Write to {email} with the subject “Personal data”, your name, the email or number you used in the form and what you need.',
        'We answer inquiries within ten (10) business days and claims (correction, update, deletion or withdrawal) within fifteen (15) business days from receipt. If we cannot meet that deadline, we will tell you why and give you a new date, as the law requires.',
      ],
    },
    {
      id: 'retention',
      h: 'Retention and security',
      p: [
        'We keep your data while it is needed to handle your request and any business relationship that follows. If we do not end up working together, we delete it no later than 24 months after our last contact, or sooner if you ask, unless the law requires us to keep it.',
        'Requests are stored in a database with restricted access: the site can only create them, not read or change them, and only the {owner} team can view them.',
      ],
    },
    {
      id: 'outside-colombia',
      h: 'If you write to us from outside Colombia',
      p: [
        'We work with clients in other countries. If you live in the European Union, you also have the rights granted by the General Data Protection Regulation (GDPR), including portability and objection, which you can exercise through the same channel. The legal basis for processing is your consent and handling your request before a possible contract.',
      ],
    },
    {
      id: 'validity',
      h: 'Effective date and changes',
      p: ['This policy is effective as of November 21, 2026. If we make significant changes, we will publish them on this page with the new date. You can also read our [Terms and conditions](terms).'],
    },
  ],
};

export const legal: Record<Lang, { terms: LegalDoc; privacy: LegalDoc }> = {
  es: { terms: termsEs, privacy: privacyEs },
  en: { terms: termsEn, privacy: privacyEn },
};
