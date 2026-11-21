// Proyectos: visor del home (índice + cambio de foco) y lupa binocular.
type Dispose = () => void;
const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/**
 * Índice + visor. La fila en foco cambia con el scroll (la que cruza el centro del viewport)
 * o al pasar el cursor por ella. Al filtrar se enfoca la primera fila visible.
 */
export function showcases(disposers: Dispose[]) {
  document.querySelectorAll<HTMLElement>('[data-showcase]').forEach((root) => {
    const rows = [...root.querySelectorAll<HTMLElement>('[data-row]')];
    const shots = [...root.querySelectorAll<HTMLElement>('[data-shot]')];
    const visor = root.querySelector<HTMLAnchorElement>('[data-visor-link]');
    if (!visor || !rows.length) return;
    const q = <T extends HTMLElement>(s: string) => root.querySelector<T>(s)!;
    const ui = {
      state: q('[data-visor-state]'),
      n: q('[data-visor-n]'),
      name: q('[data-visor-name]'),
      meta: q('[data-visor-meta]'),
      domain: q('[data-visor-domain]'),
    };
    let current = 0;
    let hovering = false;
    let timer = 0;

    const focus = (i: number) => {
      if (i === current || !shots[i]) return;
      current = i;
      rows.forEach((r, k) => r.classList.toggle('is-active', k === i));
      shots.forEach((s, k) => s.classList.toggle('is-active', k === i));
      const s = shots[i].dataset;
      visor.href = s.url!;
      visor.dataset.loupeSrc = s.src;
      visor.setAttribute('aria-label', `${s.name} · ${visor.dataset.visit}`);
      visor.dispatchEvent(new CustomEvent('pc:loupe-src'));
      ui.n.textContent = String(i + 1).padStart(2, '0');
      ui.name.textContent = s.name!;
      ui.meta.textContent = s.meta!;
      ui.domain.textContent = s.domain!;
      if (reduce()) return;
      // Reinicia la animación de convergencia.
      visor.classList.remove('is-focusing');
      void visor.offsetWidth;
      visor.classList.add('is-focusing');
      ui.state.textContent = ui.state.dataset.focusing!;
      clearTimeout(timer);
      timer = window.setTimeout(() => (ui.state.textContent = ui.state.dataset.focus!), 650);
    };

    const list = rows[0].parentElement!;
    const onEnter = (e: Event) => {
      hovering = true;
      focus(Number((e.currentTarget as HTMLElement).dataset.row));
    };
    const onLeave = () => (hovering = false);
    const onFocusIn = (e: Event) => focus(Number((e.currentTarget as HTMLElement).dataset.row));
    if (finePointer()) rows.forEach((r) => r.addEventListener('pointerenter', onEnter));
    list.addEventListener('pointerleave', onLeave);
    rows.forEach((r) => r.addEventListener('focusin', onFocusIn));

    // La fila que cruza la línea central del viewport queda en foco (solo con el visor visible).
    let raf = 0;
    const onScroll = () =>
      (raf ||= requestAnimationFrame(() => {
        raf = 0;
        if (hovering || !visor.offsetParent) return;
        const mid = window.innerHeight / 2;
        const hit = rows.find((r) => {
          if (r.hidden) return false;
          const b = r.getBoundingClientRect();
          return b.top <= mid && b.bottom > mid;
        });
        if (hit) focus(Number(hit.dataset.row));
      }));
    window.addEventListener('scroll', onScroll, { passive: true });

    const onFilter = () => {
      const first = rows.find((r) => !r.hidden);
      if (first) focus(Number(first.dataset.row));
    };
    root.addEventListener('pc:filter', onFilter);

    disposers.push(() => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      rows.forEach((r) => {
        r.removeEventListener('pointerenter', onEnter);
        r.removeEventListener('focusin', onFocusIn);
      });
      list.removeEventListener('pointerleave', onLeave);
      root.removeEventListener('pc:filter', onFilter);
    });
  });
}

/** Lupa binocular que sigue el cursor dentro de cada `[data-loupe-area]` y amplía su captura. */
export function loupes(disposers: Dispose[]) {
  if (!finePointer()) return;
  const ZOOM = 2.2;
  document.querySelectorAll<HTMLElement>('[data-loupe-area]').forEach((area) => {
    const lens = area.querySelector<HTMLElement>('[data-loupe]');
    const view = lens?.querySelector<HTMLElement>('[data-loupe-view]');
    if (!lens || !view) return;
    let x = 0, y = 0, tx = 0, ty = 0, raf = 0, inside = false;
    const ease = reduce() ? 1 : 0.22;

    const setSrc = () => (view.style.backgroundImage = `url("${area.dataset.loupeSrc}")`);
    const draw = () => {
      x += (tx - x) * ease;
      y += (ty - y) * ease;
      const W = area.clientWidth, H = area.clientHeight;
      const lw = lens.offsetWidth, lh = lens.offsetHeight;
      lens.style.transform = `translate3d(${x - lw / 2}px, ${y - lh / 2}px, 0)`;
      view.style.backgroundSize = `${W * ZOOM}px ${H * ZOOM}px`;
      view.style.backgroundPosition = `${lw / 2 - x * ZOOM}px ${lh / 2 - y * ZOOM}px`;
      raf = inside || Math.hypot(tx - x, ty - y) > 0.3 ? requestAnimationFrame(draw) : 0;
    };
    const move = (e: PointerEvent) => {
      const r = area.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      if (!inside) {
        inside = true;
        x = tx;
        y = ty;
        setSrc();
        lens.classList.add('is-on');
      }
      raf ||= requestAnimationFrame(draw);
    };
    const leave = () => {
      inside = false;
      lens.classList.remove('is-on');
    };
    area.addEventListener('pointermove', move);
    area.addEventListener('pointerleave', leave);
    area.addEventListener('pc:loupe-src', setSrc);
    disposers.push(() => {
      cancelAnimationFrame(raf);
      area.removeEventListener('pointermove', move);
      area.removeEventListener('pointerleave', leave);
      area.removeEventListener('pc:loupe-src', setSrc);
    });
  });
}
