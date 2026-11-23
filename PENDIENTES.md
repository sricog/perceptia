# Pendientes

## Página por proyecto (casos)

**Estado:** pendiente, sin empezar. Anotado el 2026-11-23.

**Qué es:** una página propia para cada uno de los 8 proyectos (`/proyectos/<slug>` y `/en/projects/<slug>`), en vez de enlazar solo al sitio del cliente.

**Para qué:** SEO. Cada página puede posicionar búsquedas concretas (por ejemplo «página web para restaurante en Puerto Rico» o «desarrollo web para inmobiliaria en Miami») que el inicio no alcanza. Solo sirve si cada página tiene contenido propio, unas 150–300 palabras; páginas casi vacías no ayudan.

**Información que falta por proyecto** (no se puede sacar del sitio del cliente):

1. Qué problema tenía el cliente (una frase).
2. Qué se construyó (3–4 cosas: reservas, pagos, panel, blog…).
3. Tecnologías usadas.
4. Un resultado o dato, si lo hay (visitas, ventas, tiempo de entrega). Si no hay, se omite.
5. Si el cliente autoriza aparecer como caso, y una frase suya si existe.

**Cómo hacerlo cuando se retome:**

- Armar un borrador de cada página visitando el sitio en vivo y corregirlo con los datos de arriba.
- Guardar los textos en `src/i18n/es.ts` y `en.ts` (o en una colección de contenido de Astro) y los datos fijos en `projects` de `src/data/site.ts`.
- En el carrusel del inicio (`src/components/ProjectsShowcase.astro`) y en la galería de `/proyectos` (`src/components/ProjectsGrid.astro`): añadir una línea de «qué construimos» y enlazar a la página del caso; el enlace al sitio del cliente pasa a estar dentro del caso.
- Añadir las páginas nuevas a `routes` en `src/i18n/index.ts` para que salgan en el sitemap y en `hreflang`.

## Relacionado

- Las capturas de proyectos (`src/assets/projects/*-site.webp` de escritorio y `*-site-mobile.webp` de móvil) son fotos tomadas el 2026-11-23. Hay que repetirlas cuando un sitio cambie (la de Raíz & Alma muestra fechas de un retiro).
- Los mockups anteriores de laptop + teléfono (`src/assets/projects/*-neon.webp`) ya no se usan en ninguna página; siguen en el repositorio por si se quieren conservar.
