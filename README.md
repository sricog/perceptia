# Perceptia · perceptiastudio.com

Sitio de Perceptia (estudio de software). Astro 7 + Tailwind v4 + React (solo el formulario), basado en el diseño **Perceptia Home** de Claude Design y el branding book *Binocular · Paleta 13 Aqua*.

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera dist/ (estático)
npx astro check  # tipos
```

## Estructura

- `src/data/site.ts` — todo el contenido editable: servicios, proyectos, pasos, tecnologías, WhatsApp e Instagram.
- `src/scripts/pc-shader.js` — fondos WebGL en vivo (`<pc-shader mode="lens|chrome|dither|globe">`), portados del diseño.
- `src/scripts/effects.ts` — revelados, palabras rotativas, texto que se ilumina con scroll, tablet que se endereza, filtro de proyectos, cursor "Ver sitio".
- `src/components/` — marca (`BinocularMark`), navegación, footer, secciones.
- `src/pages/` — `/`, `/servicios`, `/proyectos`, `/contacto`, `404`.

## Pendiente

- El formulario de `/contacto` es solo UI (ver `TODO` en `src/components/ContactForm.tsx`).
- Confirmar WhatsApp e Instagram en `src/data/site.ts` (hoy vienen de inoxa.online).
- Agregar `public/og.png` (1200×630) y volver a poner `og:image` en `src/layouts/Base.astro`.

## Despliegue en Cloudflare Pages

Build command `npm run build`, output `dist`. O desde la terminal: `npx wrangler pages deploy dist`. Después, conectar el dominio `perceptiastudio.com` al proyecto en Pages.
