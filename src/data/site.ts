// Datos que no dependen del idioma. Los textos viven en src/i18n/{es,en}.ts.
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

export type Project = { name: string; kind: 'web' | 'app'; url: string; image: ImageMetadata };

export const projects: Project[] = [
  { name: 'MiQuarto', kind: 'app', url: 'https://miquarto.co/', image: miquarto },
  { name: 'Imágenes y especialistas', kind: 'web', url: 'https://imagenesyespecialistas.com/', image: imagenes },
  { name: 'Aktiva Experience', kind: 'web', url: 'https://aktivaexperience.com.co/', image: aktiva },
  { name: 'Raíz & Alma', kind: 'web', url: 'https://raizyalma.com.co/es', image: raiz },
  { name: 'Smoke Master', kind: 'web', url: 'https://smokemasterlamudapr.com/', image: smoke },
  { name: 'Market Cerdo', kind: 'web', url: 'https://marketcerdo.com/', image: market },
  { name: 'Casa Mayor Realtor', kind: 'web', url: 'https://casamayorrealtor.com/', image: casamayor },
  { name: 'Ad Astra Heritage', kind: 'web', url: 'https://adastraheritage.site/', image: adastra },
];
