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
- `src/pages/` — `/`, `/servicios`, `/proyectos`, `/proceso`, `/contacto`, `/terminos`, `/tratamiento-de-datos`, `404` (y sus equivalentes en `/en/`).
- `src/data/legal.ts` — textos de términos y de la política de tratamiento de datos (Ley 1581 de 2012). Completar razón social y NIT en `site.legal` (`src/data/site.ts`).

## Pendiente

- Confirmar WhatsApp e Instagram en `src/data/site.ts` (hoy vienen de inoxa.online).
- Agregar `public/og.png` (1200×630) y volver a poner `og:image` en `src/layouts/Base.astro`.

## Solicitudes (Supabase)

La solicitud de llamada de `/proceso` y el formulario de `/contacto` guardan cada solicitud en la tabla `leads` de Supabase
(`kind = 'call'` o `'quote'`, `status = 'new'`). El equipo las revisa en el panel y contacta al cliente.

1. En Supabase, abrir **SQL Editor** y ejecutar `supabase/migrations/20261121000000_leads.sql`
   y después `supabase/migrations/20261121010000_leads_consent.sql` (o `supabase db push` con la CLI).
   Crea la tabla con RLS (el sitio solo puede insertar, no leer) y guarda la autorización de datos de cada
   solicitud (`consent_at`, `consent_version`); sin ella el insert se rechaza.
2. Copiar `.env.example` a `.env` con la URL del proyecto y la clave pública (anon/publishable).
3. En Cloudflare Pages, poner las mismas dos variables en *Settings → Environment variables* y volver a desplegar.

Para seguimiento, cambiar `status` (`contacted`, `scheduled`, `won`, `lost`, `spam`) y usar `notes` desde el panel.

## Despliegue en Cloudflare Pages

Build command `npm run build`, output `dist`. O desde la terminal: `npx wrangler pages deploy dist`. Después, conectar el dominio `perceptiastudio.com` al proyecto en Pages.
