import type { ImageMetadata } from 'astro';
import miquarto from '../assets/projects/miquarto.webp';
import imagenes from '../assets/projects/imagenes-y-especialistas.webp';
import aktiva from '../assets/projects/aktiva-experience.webp';
import raiz from '../assets/projects/raiz-y-alma.webp';
import smoke from '../assets/projects/smoke-master.webp';
import market from '../assets/projects/market-cerdo.webp';
import casamayor from '../assets/projects/casa-mayor-realtor.webp';
import adastra from '../assets/projects/ad-astra-heritage.webp';

export const site = {
  name: 'Perceptia',
  tagline: 'Ingeniería que se percibe.',
  url: 'https://perceptiastudio.com',
  description:
    'Perceptia es un estudio de software: websites, landing pages, MVPs, desarrollo a la medida y automatizaciones que se entienden al primer vistazo.',
  // TODO: confirmar número e Instagram de Perceptia (vienen de inoxa.online)
  whatsappNumber: '573187057176',
  whatsappDisplay: '+57 318 705 7176',
  instagram: 'https://www.instagram.com/inoxa.online/',
};

export const whatsappUrl = (text = 'Hola Perceptia, quiero cotizar un proyecto.') =>
  `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(text)}`;

export const nav = [
  { label: 'Servicios', href: '/servicios' },
  { label: 'Proyectos', href: '/proyectos' },
  { label: 'Proceso', href: '/#proceso' },
  { label: 'Contacto', href: '/contacto' },
];

export const words: [string, string][] = [
  ['software', 'a la medida'],
  ['landing pages', 'que convierten'],
  ['MVPs', 'listos para validar'],
];

export const tech = [
  'Astro', 'React', 'TypeScript', 'Next.js', 'Node.js', 'PostgreSQL',
  'Supabase', 'Tailwind CSS', 'Cloudflare', 'Figma', 'Stripe', 'OpenAI',
];

export type ShaderSpec = { mode: string; variant?: string; scale?: string; px?: string; lens?: string };

export type Service = {
  n: string;
  slug: string;
  title: string;
  short: string;
  price?: string;
  shader: ShaderSpec;
  long: string;
  includes: string[];
};

export const services: Service[] = [
  {
    n: '01',
    slug: 'websites',
    title: 'Websites y landing pages',
    short: 'Sitios rápidos, medibles y fáciles de editar, pensados para convertir visitas en clientes.',
    price: '$700.000',
    shader: { mode: 'chrome', variant: '0.2', scale: '0.5' },
    long: 'Una presencia digital clara, rápida y diseñada para convertir atención en oportunidades. Diseño propio, nada de plantillas.',
    includes: ['Diseño visual personalizado', 'Experiencia responsive', 'Formulario o contacto directo', 'SEO inicial', 'Entrega lista para operar'],
  },
  {
    n: '02',
    slug: 'mvps',
    title: 'MVPs',
    short: 'De la idea a un producto usable en semanas, listo para validar con usuarios reales.',
    shader: { mode: 'dither', variant: '1.3', px: '4' },
    long: 'La versión esencial de tu producto para validar una oportunidad con usuarios reales, sin construir de más.',
    includes: ['Definición de alcance', 'Prototipo y experiencia principal', 'Funcionalidades esenciales', 'Pruebas', 'Preparación de lanzamiento'],
  },
  {
    n: '03',
    slug: 'a-la-medida',
    title: 'Desarrollo a la medida',
    short: 'Plataformas, paneles y sistemas internos construidos alrededor de tu operación.',
    shader: { mode: 'lens', lens: '0,0,0.3,0.15', variant: '4', scale: '0.5' },
    long: 'Software construido alrededor de los procesos, integraciones y objetivos de tu empresa, con una arquitectura preparada para crecer.',
    includes: ['Plataformas y portales', 'Herramientas internas', 'Integraciones', 'Automatizaciones', 'Arquitectura preparada para evolucionar'],
  },
  {
    n: '04',
    slug: 'automatizaciones',
    title: 'Automatizaciones',
    short: 'Conectamos tus herramientas y eliminamos tareas repetitivas con flujos confiables.',
    shader: { mode: 'chrome', variant: '1.7', scale: '0.5' },
    long: 'Flujos que mueven datos entre tus herramientas, notifican a tu equipo y se encargan del trabajo repetitivo, con monitoreo para que nada se pierda.',
    includes: ['Mapeo de procesos', 'Integración entre herramientas y APIs', 'Flujos con IA cuando suman', 'Alertas y monitoreo', 'Documentación y traspaso'],
  },
];

export type Project = { name: string; type: 'Website' | 'App web'; url: string; image: ImageMetadata };

export const projects: Project[] = [
  { name: 'MiQuarto', type: 'App web', url: 'https://miquarto.co/', image: miquarto },
  { name: 'Imágenes y especialistas', type: 'Website', url: 'https://imagenesyespecialistas.com/', image: imagenes },
  { name: 'Aktiva Experience', type: 'Website', url: 'https://aktivaexperience.com.co/', image: aktiva },
  { name: 'Raíz & Alma', type: 'Website', url: 'https://raizyalma.com.co/es', image: raiz },
  { name: 'Smoke Master', type: 'Website', url: 'https://smokemasterlamudapr.com/', image: smoke },
  { name: 'Market Cerdo', type: 'Website', url: 'https://marketcerdo.com/', image: market },
  { name: 'Casa Mayor Realtor', type: 'Website', url: 'https://casamayorrealtor.com/', image: casamayor },
  { name: 'Ad Astra Heritage', type: 'Website', url: 'https://adastraheritage.site/', image: adastra },
];

export const steps = [
  { n: '01', t: 'Entendemos', d: 'Sesión de descubrimiento: objetivos, usuarios y restricciones del negocio.' },
  { n: '02', t: 'Definimos', d: 'Alcance, arquitectura y un prototipo navegable antes de escribir código.' },
  { n: '03', t: 'Construimos y validamos', d: 'Entregas semanales y un entorno de pruebas siempre disponible.' },
  { n: '04', t: 'Lanzamos y evolucionamos', d: 'Despliegue, métricas y mejoras continuas después del lanzamiento.' },
];
