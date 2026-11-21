// Datos que no dependen del idioma. Los textos viven en src/i18n/{es,en}.ts.
import type { ImageMetadata } from 'astro';
import miquarto from '../assets/projects/miquarto-neon.webp';
import imagenes from '../assets/projects/imagenes-y-especialistas-neon.webp';
import aktiva from '../assets/projects/aktiva-experience-neon.webp';
import raiz from '../assets/projects/raiz-y-alma-neon.webp';
import smoke from '../assets/projects/smoke-master-neon.webp';
import market from '../assets/projects/market-cerdo-neon.webp';
import casamayor from '../assets/projects/casa-mayor-realtor-neon.webp';
import adastra from '../assets/projects/ad-astra-heritage-neon.webp';

export const site = {
  name: 'Perceptia',
  url: 'https://perceptiastudio.com',
  // TODO: confirmar número e Instagram de Perceptia (vienen de inoxa.online)
  whatsappNumber: '573187057176',
  whatsappDisplay: '+57 318 705 7176',
  instagram: 'https://www.instagram.com/inoxa.online/',
};

export const whatsappUrl = (text: string) => `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(text)}`;

export const tech = [
  'Astro', 'React', 'TypeScript', 'Next.js', 'Node.js', 'PostgreSQL',
  'Supabase', 'Tailwind CSS', 'Cloudflare', 'Figma', 'Stripe', 'OpenAI',
  'AWS',
];

export type ShaderSpec = { mode: string; variant?: string; scale?: string; px?: string; lens?: string };

export type ServiceId = 'websites' | 'mvps' | 'custom' | 'automation';
export type Service = { id: ServiceId; n: string; shader: ShaderSpec };

export const services: Service[] = [
  { id: 'websites', n: '01', shader: { mode: 'chrome', variant: '0.2', scale: '0.5' } },
  { id: 'mvps', n: '02', shader: { mode: 'dither', variant: '1.3', px: '4' } },
  { id: 'custom', n: '03', shader: { mode: 'lens', lens: '0,0,0.3,0.15', variant: '4', scale: '0.5' } },
  { id: 'automation', n: '04', shader: { mode: 'chrome', variant: '1.7', scale: '0.5' } },
];

export type ProjectId = 'miquarto' | 'imagenes' | 'aktiva' | 'raiz' | 'smoke' | 'market' | 'casamayor' | 'adastra';
/** Sector y lugar del cliente (tomados de cada sitio) viven en i18n: `projects.meta[id]`. */
export type Project = { id: ProjectId; name: string; kind: 'web' | 'app'; url: string; image: ImageMetadata };

export const projects: Project[] = [
  { id: 'miquarto', name: 'MiQuarto', kind: 'app', url: 'https://miquarto.co/', image: miquarto },
  { id: 'imagenes', name: 'Imágenes y especialistas', kind: 'web', url: 'https://imagenesyespecialistas.com/', image: imagenes },
  { id: 'aktiva', name: 'Aktiva Experience', kind: 'web', url: 'https://aktivaexperience.com.co/', image: aktiva },
  { id: 'raiz', name: 'Raíz & Alma', kind: 'web', url: 'https://raizyalma.com.co/es', image: raiz },
  { id: 'smoke', name: 'Smoke Master', kind: 'web', url: 'https://smokemasterlamudapr.com/', image: smoke },
  { id: 'market', name: 'Market Cerdo', kind: 'web', url: 'https://marketcerdo.com/', image: market },
  { id: 'casamayor', name: 'Casa Mayor Realtor', kind: 'web', url: 'https://casamayorrealtor.com/', image: casamayor },
  { id: 'adastra', name: 'Ad Astra Heritage', kind: 'web', url: 'https://adastraheritage.site/', image: adastra },
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
