/**
 * i18n mínimo: español en la raíz, inglés bajo /en/. El idioma se deduce de la URL,
 * así cada vista sirve para los dos idiomas sin recibir props.
 */
import { es } from './es';
import { en } from './en';

export type Dict = typeof es;
export const langs = ['es', 'en'] as const;
export type Lang = (typeof langs)[number];
export const defaultLang: Lang = 'es';

const dicts: Record<Lang, Dict> = { es, en };

/** Rutas equivalentes en cada idioma; el selector de idioma y hreflang salen de aquí. */
export const routes = {
  home: { es: '/', en: '/en/' },
  services: { es: '/servicios', en: '/en/services' },
  projects: { es: '/proyectos', en: '/en/projects' },
  contact: { es: '/contacto', en: '/en/contact' },
} satisfies Record<string, Record<Lang, string>>;
export type RouteKey = keyof typeof routes;

export const getLang = (url: URL): Lang => (/^\/en(\/|$)/.test(url.pathname) ? 'en' : 'es');

/** Reemplaza {clave} en una plantilla. */
export const fill = (tpl: string, vars: Record<string, string | number>) =>
  tpl.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));

export function useI18n(url: URL) {
  const lang = getLang(url);
  const t = dicts[lang];
  const href = (key: RouteKey, hash?: string) => routes[key][lang] + (hash ? `#${hash}` : '');
  return { lang, t, href };
}

export const dict = (lang: Lang) => dicts[lang];
