// Globo de «Alcance» con cobe: mapa real en puntos, arcos desde Colombia hacia cada país
// con clientes, etiquetas con la hora local y enfoque al elegir un país de la lista.
import createGlobe, { type Marker, type Arc } from 'cobe';

type Dispose = () => void;
type Loc = [number, number];
type Place = { id: string; loc: Loc; zone: string };
type Config = { hub: string; places: Place[]; minor: Loc[]; lang: string };

const TAU = Math.PI * 2;
const rgb = (hex: string): [number, number, number] => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};
const AQUA = rgb('#14E0A5');
const SALVIA = rgb('#8FB0A5');

/** Ángulos de cobe que dejan `loc` en el centro del disco. */
const anglesFor = ([lat, lng]: Loc): [number, number] => [(3 * Math.PI) / 2 - (lng * Math.PI) / 180, (lat * Math.PI) / 180];
/** Diferencia angular más corta (para no dar la vuelta completa al enfocar). */
const wrap = (a: number) => ((((a + Math.PI) % TAU) + TAU) % TAU) - Math.PI;

export function globes(disposers: Dispose[]) {
  document.querySelectorAll<HTMLElement>('[data-globe]').forEach((root) => {
    if (!root.isConnected || root.dataset.ready) return;
    root.dataset.ready = '';
    const cfg: Config = JSON.parse(root.dataset.globe!);
    const canvas = root.querySelector<HTMLCanvasElement>('canvas')!;
    const section = root.closest('section') ?? document;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hub = cfg.places.find((p) => p.id === cfg.hub)!;

    // Vista de reposo: el punto medio entre todos los países, para que se vean a la vez.
    const lats = cfg.places.map((p) => p.loc[0]), lngs = cfg.places.map((p) => p.loc[1]);
    const rest = anglesFor([(Math.min(...lats) + Math.max(...lats)) / 2 - 4, (Math.min(...lngs) + Math.max(...lngs)) / 2]);

    const markers: Marker[] = [
      ...cfg.places.map((p) => ({ id: p.id, location: p.loc, size: p.id === cfg.hub ? 0.07 : 0.05 })),
      ...cfg.minor.map((loc) => ({ location: loc, size: 0.028, color: SALVIA })),
    ];
    const arcs: Arc[] = cfg.places.filter((p) => p !== hub).map((p) => ({ from: hub.loc, to: p.loc }));

    let width = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width: 1,
      height: 1,
      phi: rest[0],
      theta: rest[1],
      dark: 1,
      diffuse: 1.4,
      mapSamples: 22000,
      mapBrightness: 7,
      mapBaseBrightness: 0.02,
      baseColor: [0.2, 0.36, 0.31],
      markerColor: AQUA,
      glowColor: [0.05, 0.28, 0.21],
      arcColor: AQUA,
      arcWidth: 0.7,
      arcHeight: 0.28,
      markerElevation: 0.015,
      markers,
      arcs,
      opacity: 0.92,
    });

    // Estado de la cámara: `phi/theta` actuales se acercan a `target` + arrastre.
    let phi = rest[0], theta = rest[1];
    let target = rest, focusUntil = 0, t0 = performance.now();
    let drag: { x: number; y: number; phi: number; theta: number } | null = null;
    let dragPhi = 0, dragTheta = 0;
    let visible = false, raf = 0;

    const resize = () => {
      width = canvas.offsetWidth;
      globe.update({ width: width * dpr, height: width * dpr });
      render();
    };

    const render = () => {
      globe.update({ phi: phi + dragPhi, theta: Math.max(-0.6, Math.min(0.9, theta + dragTheta)) });
    };

    // Movimiento en reposo: un balanceo suave alrededor de la vista de reposo.
    const frame = (now: number) => {
      raf = 0;
      const idle = !drag && now > focusUntil;
      const goal: [number, number] = idle ? [rest[0] + Math.sin((now - t0) / 5200) * 0.42, rest[1]] : target;
      if (idle) {
        // Al soltar, el arrastre vuelve poco a poco a la vista de reposo.
        dragPhi *= 0.985;
        dragTheta *= 0.96;
      }
      phi += wrap(goal[0] - phi) * 0.06;
      theta += (goal[1] - theta) * 0.06;
      render();
      if (visible && !reduce) raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (!raf && !reduce) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
    }, { rootMargin: '100px' });
    io.observe(root);
    const ro = new ResizeObserver(resize);
    requestAnimationFrame(() => root.classList.add('is-ready'));

    // Etiquetas: cobe envuelve el canvas y crea ahí un ancla por marcador con `id`, en orden.
    const labels = new Map([...root.querySelectorAll<HTMLElement>('[data-label]')].map((el) => [el.dataset.label!, el]));
    const attach = () => {
      const host = canvas.parentElement!;
      const created = [...host.children].filter((c) => c !== canvas && !(c as HTMLElement).dataset.label) as HTMLElement[];
      cfg.places.forEach((p, i) => {
        const a = created[i], label = labels.get(p.id);
        if (a && label && label.parentElement !== a) a.append(label);
      });
    };
    resize();
    ro.observe(canvas);
    attach();

    // Hora local en etiquetas y lista.
    const fmt = new Map<string, Intl.DateTimeFormat>();
    const tick = () =>
      section.querySelectorAll<HTMLElement>('[data-clock]').forEach((el) => {
        const zone = el.dataset.clock!;
        if (!fmt.has(zone)) fmt.set(zone, new Intl.DateTimeFormat(cfg.lang, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: zone }));
        el.textContent = fmt.get(zone)!.format(new Date());
      });
    tick();
    const clock = window.setInterval(tick, 15000);

    // Elegir un país lo lleva al centro del globo.
    const buttons = [...section.querySelectorAll<HTMLButtonElement>('[data-place]')];
    const focusPlace = (id: string, hold = 7000) => {
      const p = cfg.places.find((x) => x.id === id);
      if (!p) return;
      target = anglesFor([p.loc[0] - 6, p.loc[1]]);
      focusUntil = performance.now() + hold;
      dragPhi = dragTheta = 0;
      buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.place === id)));
      labels.forEach((el, k) => el.classList.toggle('is-focus', k === id));
      if (reduce) {
        [phi, theta] = target;
        render();
      } else start();
    };
    const release = (e: Event) => {
      // En táctil, pointerleave llega justo después del toque: el país queda enfocado.
      if (e.type === 'pointerleave' && (e as PointerEvent).pointerType === 'touch') return;
      focusUntil = performance.now() + 1200;
      buttons.forEach((b) => b.setAttribute('aria-pressed', 'false'));
      labels.forEach((el) => el.classList.remove('is-focus'));
    };
    const onBtn = (e: Event) => {
      if (e.type === 'pointerenter' && (e as PointerEvent).pointerType === 'touch') return;
      focusPlace((e.currentTarget as HTMLElement).dataset.place!, e.type === 'click' ? 9000 : 6000);
    };
    buttons.forEach((b) => {
      b.addEventListener('click', onBtn);
      b.addEventListener('pointerenter', onBtn);
      b.addEventListener('focus', onBtn);
      b.addEventListener('pointerleave', release);
      b.addEventListener('blur', release);
    });

    // Arrastrar para girar.
    const down = (e: PointerEvent) => {
      drag = { x: e.clientX, y: e.clientY, phi: dragPhi, theta: dragTheta };
      canvas.setPointerCapture(e.pointerId);
      root.classList.add('is-dragging');
      start();
    };
    const move = (e: PointerEvent) => {
      if (!drag) return;
      dragPhi = drag.phi + ((e.clientX - drag.x) / width) * Math.PI;
      dragTheta = drag.theta + ((e.clientY - drag.y) / width) * 1.2;
      if (reduce) render();
    };
    const up = () => {
      if (!drag) return;
      drag = null;
      focusUntil = performance.now() + 2500;
      target = [phi, theta];
      root.classList.remove('is-dragging');
    };
    canvas.addEventListener('pointerdown', down);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);

    disposers.push(() => {
      cancelAnimationFrame(raf);
      clearInterval(clock);
      io.disconnect();
      ro.disconnect();
      buttons.forEach((b) => {
        b.removeEventListener('click', onBtn);
        b.removeEventListener('pointerenter', onBtn);
        b.removeEventListener('focus', onBtn);
        b.removeEventListener('pointerleave', release);
        b.removeEventListener('blur', release);
      });
      // Las etiquetas vuelven al contenedor antes de que cobe borre sus anclas.
      labels.forEach((el) => root.append(el));
      globe.destroy();
      delete root.dataset.ready;
    });
  });
}
