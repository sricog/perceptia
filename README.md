# Perceptia · perceptiastudio.com

Sitio de Perceptia (estudio de software). Astro 7 + Tailwind v4 + React (solo el formulario), basado en el diseño **Perceptia Home** de Claude Design y el branding book *Binocular · Paleta 13 Aqua*.

## Desarrollo

Se usa [Bun](https://bun.sh) como gestor de paquetes (`bun.lock`). No usar `npm install`: crearía un `package-lock.json` que se desincroniza.

```bash
bun install       # volver a correrlo tras cada git pull que cambie package.json
bun dev           # http://localhost:4321
bun run build     # genera dist/ (estático)
bunx astro check  # tipos
```

## Estructura

- `src/data/site.ts` — todo el contenido editable: servicios, proyectos, pasos, tecnologías, WhatsApp e Instagram.
- `src/scripts/pc-shader.js` — fondos WebGL en vivo (`<pc-shader mode="lens|chrome|dither|globe">`), portados del diseño.
- `src/scripts/effects.ts` — revelados, palabras rotativas, texto que se ilumina con scroll, filtro de proyectos, cursor "Ver sitio".
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
3. En Cloudflare, poner las mismas dos variables como variables de build del Worker `perceptia` y volver a desplegar
   (se leen al construir el sitio, no en tiempo de ejecución).

Para seguimiento, cambiar `status` (`contacted`, `scheduled`, `won`, `lost`, `spam`) y usar `notes` desde el panel.

### Aviso por correo (Resend)

Cada solicitud nueva llega por correo a perceptiastudio@gmail.com. Después de cada insert en `leads`, el trigger
`leads_notify` llama a la Edge Function `notify-lead` (`supabase/functions/notify-lead`), que envía el correo con
Resend desde `formulario@perceptiastudio.com`. El botón «Responder» le contesta directo al cliente cuando dejó un correo.
Los formularios del sitio no cambian, y si el correo falla la solicitud igual queda guardada.

Puesta en marcha (una vez, con la [CLI de Supabase](https://supabase.com/docs/guides/cli)):

1. Generar un secreto compartido: `openssl rand -hex 32`.
2. Crear una API key en Resend (permiso *Sending access*, dominio perceptiastudio.com) y guardar los secretos de la función:
   ```bash
   supabase secrets set --remote=<ref> RESEND_API_KEY=re_... NOTIFY_LEAD_SECRET=<secreto>
   # Opcionales: LEADS_TO="a@x.com,b@y.com"  LEADS_FROM="Perceptia <formulario@perceptiastudio.com>"
   ```
3. Desplegar la función (sin verificación de JWT: la protege el secreto):
   ```bash
   supabase functions deploy notify-lead --remote=<ref> --no-verify-jwt
   ```
4. En el SQL Editor, guardar la URL y el mismo secreto en Vault, y ejecutar
   `supabase/migrations/20261126000000_notify_lead.sql`:
   ```sql
   select vault.create_secret('https://<ref>.supabase.co/functions/v1/notify-lead', 'notify_lead_url');
   select vault.create_secret('<secreto>', 'notify_lead_secret');
   ```

Después, ejecutar `supabase/migrations/20261126010000_harden_pg_net.sql` (deja pg_net en el esquema `extensions`).
Seguridad: en Settings → API → Exposed schemas deben quedar solo `public` y `graphql_public`; nunca exponer `net` ni `vault`.

Si no llega un correo: revisar los logs de la función (Edge Functions → notify-lead → Logs), las respuestas de
pg_net (`select * from net._http_response order by created desc limit 10;`) y la sección Emails de Resend.

## Despliegue en Cloudflare Workers

El sitio se sirve como un Worker de solo assets (`cloudflare.config.ts`, Worker `perceptia`, dominios `perceptiastudio.com` y `www.perceptiastudio.com`).
Workers Builds lo construye automáticamente al hacer push. Para desplegar a mano desde la terminal:

```bash
bun run deploy    # astro build && cf deploy ./dist
```
