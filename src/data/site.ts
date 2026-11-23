// Datos que no dependen del idioma. Los textos viven en src/i18n/{es,en}.ts.
import type { ImageMetadata } from 'astro';
// Capturas reales de cada sitio: escritorio (1440×900) y móvil (500×1082).
import miquartoShot from '../assets/projects/miquarto-site.webp';
import miquartoMobile from '../assets/projects/miquarto-site-mobile.webp';
import imagenesShot from '../assets/projects/imagenes-y-especialistas-site.webp';
import imagenesMobile from '../assets/projects/imagenes-y-especialistas-site-mobile.webp';
import aktivaShot from '../assets/projects/aktiva-experience-site.webp';
import aktivaMobile from '../assets/projects/aktiva-experience-site-mobile.webp';
import raizShot from '../assets/projects/raiz-y-alma-site.webp';
import raizMobile from '../assets/projects/raiz-y-alma-site-mobile.webp';
import smokeShot from '../assets/projects/smoke-master-site.webp';
import smokeMobile from '../assets/projects/smoke-master-site-mobile.webp';
import marketShot from '../assets/projects/market-cerdo-site.webp';
import marketMobile from '../assets/projects/market-cerdo-site-mobile.webp';
import casamayorShot from '../assets/projects/casa-mayor-realtor-site.webp';
import casamayorMobile from '../assets/projects/casa-mayor-realtor-site-mobile.webp';
import adastraShot from '../assets/projects/ad-astra-heritage-site.webp';
import adastraMobile from '../assets/projects/ad-astra-heritage-site-mobile.webp';

export const site = {
  name: 'Perceptia',
  url: 'https://perceptiastudio.com',
  email: 'perceptiastudio@gmail.com',
  whatsappNumber: '573187057176',
  whatsappDisplay: '+57 318 705 7176',
  instagram: 'https://www.instagram.com/perceptia_/',
  /** Datos del responsable para las páginas legales. Completar razón social y NIT cuando existan. */
  legal: {
    owner: 'Perceptia',
    taxId: '', // NIT; si queda vacío no se muestra
    city: 'Medellín, Colombia',
  },
};

export const whatsappUrl = (text: string) => `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(text)}`;

/** Tecnologías de la grilla de logos (nombres de export de `simple-icons`). */
export const stack = [
  'siAstro', 'siReact', 'siNextdotjs', 'siSupabase', 'siStripe', 'siCursor',
  'siClaude', 'siFigma', 'siTailwindcss', 'siCloudflare', 'siN8n', 'siTypescript',
] as const;

export type ServiceId = 'websites' | 'mvps' | 'custom' | 'automation';
/** La ilustración de cada servicio sale de su id (components/ServiceViz.astro). */
export type Service = { id: ServiceId };

/** El orden de esta lista es el orden en que se muestran en el home, /servicios y contacto. */
export const services: Service[] = [{ id: 'custom' }, { id: 'automation' }, { id: 'mvps' }, { id: 'websites' }];

export type ProjectId = 'miquarto' | 'imagenes' | 'aktiva' | 'raiz' | 'smoke' | 'market' | 'casamayor' | 'adastra';
/** Sector y lugar del cliente (tomados de cada sitio) viven en i18n: `projects.meta[id]`. */
export type Project = { id: ProjectId; name: string; kind: 'web' | 'app'; url: string; shot: ImageMetadata; shotMobile: ImageMetadata };

export const projects: Project[] = [
  { id: 'miquarto', name: 'MiQuarto', kind: 'app', url: 'https://miquarto.co/', shot: miquartoShot, shotMobile: miquartoMobile },
  { id: 'imagenes', name: 'Imágenes y especialistas', kind: 'web', url: 'https://imagenesyespecialistas.com/', shot: imagenesShot, shotMobile: imagenesMobile },
  { id: 'aktiva', name: 'Aktiva Experience', kind: 'web', url: 'https://aktivaexperience.com.co/', shot: aktivaShot, shotMobile: aktivaMobile },
  { id: 'raiz', name: 'Raíz & Alma', kind: 'web', url: 'https://raizyalma.com.co/es', shot: raizShot, shotMobile: raizMobile },
  { id: 'smoke', name: 'Smoke Master', kind: 'web', url: 'https://smokemasterlamudapr.com/', shot: smokeShot, shotMobile: smokeMobile },
  { id: 'market', name: 'Market Cerdo', kind: 'web', url: 'https://marketcerdo.com/', shot: marketShot, shotMobile: marketMobile },
  { id: 'casamayor', name: 'Casa Mayor Realtor', kind: 'web', url: 'https://casamayorrealtor.com/', shot: casamayorShot, shotMobile: casamayorMobile },
  { id: 'adastra', name: 'Ad Astra Heritage', kind: 'web', url: 'https://adastraheritage.site/', shot: adastraShot, shotMobile: adastraMobile },
];

/** Dominio legible para etiquetas: https://raizyalma.com.co/es → raizyalma.com.co */
export const domainOf = (url: string) => new URL(url).hostname.replace(/^www\./, '');

export type PlaceId = 'co' | 'pr' | 'us' | 'es';
/**
 * Alcance: un punto por país con clientes, la ciudad de referencia para la hora local
 * y su zona IANA. Los textos (nombre, ciudad, UTC) viven en i18n (`reach.places`).
 */
export const places: Record<PlaceId, { loc: [number, number]; zone: string }> = {
  co: { loc: [4.71, -74.07], zone: 'America/Bogota' },
  pr: { loc: [18.4, -66.1], zone: 'America/Puerto_Rico' },
  us: { loc: [25.76, -80.19], zone: 'America/New_York' },
  es: { loc: [40.42, -3.7], zone: 'Europe/Madrid' },
};
/** Puntos menores en el globo: otros proyectos en vivo dentro de Colombia (Medellín, Bahía Solano). */
export const minorPoints: [number, number][] = [
  [6.24, -75.58],
  [6.22, -77.4],
];
