// Franja infinita de proyectos del home: avanza sola y se puede arrastrar (mouse o dedo).
type Dispose = () => void;

/** Velocidad del avance automático, en px/s (hacia la izquierda). */
const SPEED = { base: 55, md: 76 };
/** Qué tan rápido vuelve la velocidad al avance automático tras soltar (1/s). */
const EASE = 2.5;
/** Desplazamiento mínimo para que un gesto cuente como arrastre y no como clic. */
const THRESHOLD = 6;
/** Tope del impulso al soltar, en px/s. */
const MAX_FLING = 4000;

/**
 * La pista lleva la lista dos veces; el desplazamiento se mantiene en [-W, 0), con W el ancho de
 * una copia, así que al cruzar el borde se salta exactamente una copia y no se nota.
 *
 * - Sin arrastre, la velocidad tiende al avance automático; al soltar parte de la velocidad del
 *   gesto, así que la franja sigue con impulso y luego retoma su ritmo.
 * - Con «reducir movimiento» no hay avance automático, pero se puede arrastrar igual.
 * - Quien navega con teclado la detiene mientras tiene una tarjeta enfocada.
 * - Sin JS queda la animación CSS de respaldo (`.marquee:not([data-ready])`).
 */
export function marquees(disposers: Dispose[]) {
  document.querySelectorAll<HTMLElement>('[data-marquee]').forEach((root) => {
    const track = root.querySelector<HTMLElement>('.marquee-track');
    const list = root.querySelector<HTMLElement>('.marquee-list');
    if (!track || !list) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const md = window.matchMedia('(min-width: 48rem)');
    const auto = () => (reduce.matches ? 0 : -(md.matches ? SPEED.md : SPEED.base));

    // Arranca donde iba la animación CSS de respaldo para que no salte.
    let x = new DOMMatrix(getComputedStyle(track).transform).m41;
    root.dataset.ready = '';
    let w = list.offsetWidth;
    let v = auto();
    const wrap = () => {
      if (w > 0) x = ((x % w) - w) % w;
    };
    const paint = () => {
      wrap();
      track.style.transform = `translate3d(${x}px,0,0)`;
    };

    // --- Arrastre ---
    let pointer: number | null = null;
    let dragging = false;
    let startX = 0;
    let startOffset = 0;
    let samples: { t: number; x: number }[] = [];
    let suppressClick = false;

    const onDown = (e: PointerEvent) => {
      if (pointer !== null || (e.pointerType === 'mouse' && e.button !== 0)) return;
      pointer = e.pointerId;
      dragging = false;
      startX = e.clientX;
      samples = [{ t: e.timeStamp, x: e.clientX }];
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerId !== pointer) return;
      const dx = e.clientX - startX;
      if (!dragging) {
        if (Math.abs(dx) < THRESHOLD) return;
        // Recién aquí se captura el puntero: capturarlo al presionar mandaría el clic a la pista
        // y no al enlace de la tarjeta.
        // El origen se fija para que la franja siga al dedo desde donde está, sin saltar.
        dragging = true;
        startOffset = x - dx;
        try {
          root.setPointerCapture(e.pointerId);
        } catch {
          // El puntero ya no está activo (p. ej. el navegador tomó el gesto): se sigue sin captura.
        }
        root.dataset.dragging = '';
      }
      x = startOffset + dx;
      samples.push({ t: e.timeStamp, x: e.clientX });
      const cutoff = e.timeStamp - 100;
      while (samples.length > 2 && samples[0].t < cutoff) samples.shift();
      paint();
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerId !== pointer) return;
      pointer = null;
      if (!dragging) return;
      dragging = false;
      delete root.dataset.dragging;
      suppressClick = true;
      // Velocidad del gesto en los últimos ~100 ms.
      const first = samples[0];
      const last = samples[samples.length - 1];
      const dt = (last.t - first.t) / 1000;
      const fling = e.type === 'pointerup' && dt > 0 ? (last.x - first.x) / dt : 0;
      v = Math.max(-MAX_FLING, Math.min(MAX_FLING, fling));
    };
    // Tras arrastrar, el clic que dispara el navegador al soltar no debe abrir la tarjeta.
    const onClick = (e: MouseEvent) => {
      if (!suppressClick) return;
      suppressClick = false;
      e.preventDefault();
      e.stopPropagation();
    };
    const onPointerDownReset = () => (suppressClick = false);

    root.addEventListener('pointerdown', onPointerDownReset, { capture: true });
    root.addEventListener('pointerdown', onDown);
    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerup', onUp);
    root.addEventListener('pointercancel', onUp);
    root.addEventListener('click', onClick, { capture: true });
    // Evita el arrastre nativo de imágenes y enlaces, que cancelaría el gesto.
    root.addEventListener('dragstart', (e) => e.preventDefault());

    // --- Bucle ---
    let visible = false;
    let raf = 0;
    let last = 0;
    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min(0.05, (t - last) / 1000) : 0;
      last = t;
      if (pointer !== null && dragging) return;
      const target = root.matches(':has(:focus-visible)') ? 0 : auto();
      v += (target - v) * (1 - Math.exp(-EASE * dt));
      x += v * dt;
      paint();
    };
    const start = () => {
      if (raf || !visible) return;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(root);
    const ro = new ResizeObserver(() => {
      w = list.offsetWidth;
      paint();
    });
    ro.observe(list);

    paint();
    disposers.push(() => {
      stop();
      io.disconnect();
      ro.disconnect();
    });
  });
}
