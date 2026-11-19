// Efectos de página. Se reinician en cada navegación (astro:page-load) y se limpian antes del swap.
const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let disposers: Array<() => void> = [];

const on = <K extends keyof WindowEventMap>(t: Window, ev: K, fn: (e: WindowEventMap[K]) => void) => {
  t.addEventListener(ev, fn as EventListener, { passive: true });
  disposers.push(() => t.removeEventListener(ev, fn as EventListener));
};

function reveals() {
  const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (reduce()) return els.forEach((el) => el.classList.add('is-in'));
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      }),
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  els.forEach((el) => io.observe(el));
  disposers.push(() => io.disconnect());
}

/** "Hacemos software a la medida" → rota frases con blur. */
function rotators() {
  document.querySelectorAll<HTMLElement>('[data-rotator]').forEach((host) => {
    const items = [...host.querySelectorAll<HTMLElement>('[data-word]')];
    if (items.length < 2 || reduce()) return;
    let i = 0;
    const ms = Number(host.dataset.interval ?? 2600);
    const id = window.setInterval(() => {
      const prev = items[i];
      i = (i + 1) % items.length;
      const next = items[i];
      prev.style.animation = 'pcWordOut .45s cubic-bezier(.16,1,.3,1) both';
      next.hidden = false;
      next.style.animation = 'pcWord .8s cubic-bezier(.16,1,.3,1) .15s both';
      window.setTimeout(() => (prev.hidden = true), 450);
    }, ms);
    disposers.push(() => clearInterval(id));
  });
}

/** Animaciones ligadas al scroll: texto que se ilumina, tablet que se endereza, línea de proceso. */
function scrubbers() {
  const words = [...document.querySelectorAll<HTMLElement>('[data-scrub-words]')].map((el) => ({
    el,
    spans: [...el.querySelectorAll<HTMLElement>('span[data-w]')],
  }));
  const tilts = [...document.querySelectorAll<HTMLElement>('[data-tilt]')];
  const progress = [...document.querySelectorAll<HTMLElement>('[data-progress]')];
  if (!words.length && !tilts.length && !progress.length) return;
  words.forEach((w) => (w.el.dataset.armed = ''));

  if (reduce()) {
    words.forEach((w) => w.spans.forEach((s) => s.classList.add('lit')));
    tilts.forEach((t) => (t.style.transform = 'none'));
    progress.forEach((p) => p.style.setProperty('--p', '1'));
    return;
  }

  const vh = () => window.innerHeight;
  const ratio = (el: Element, start: number, end: number) => {
    const r = el.getBoundingClientRect();
    // 0 cuando el borde superior está en `start` (fracción del viewport), 1 cuando llega a `end`.
    const v = (vh() * start - r.top) / (vh() * (start - end));
    return Math.min(1, Math.max(0, v));
  };

  let raf = 0;
  const update = () => {
    raf = 0;
    for (const w of words) {
      const p = ratio(w.el, 0.85, 0.3);
      const lit = Math.round(p * w.spans.length);
      w.spans.forEach((s, i) => s.classList.toggle('lit', i < lit));
    }
    for (const t of tilts) {
      const p = ratio(t, 1, 0.35);
      const rx = 24 * (1 - p);
      const sc = 0.95 + 0.05 * p;
      t.style.transform = `rotateX(${rx}deg) scale(${sc})`;
    }
    for (const el of progress) {
      el.style.setProperty('--p', String(ratio(el, 0.8, 0.35)));
    }
  };
  const req = () => (raf ||= requestAnimationFrame(update));
  on(window, 'scroll', req);
  on(window, 'resize', req);
  update();
  disposers.push(() => cancelAnimationFrame(raf));
}

/** Pastilla "Ver sitio ↗" que sigue al cursor sobre la grilla de proyectos. */
function cursorPills() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.querySelectorAll<HTMLElement>('[data-cursor-area]').forEach((area) => {
    const pill = area.querySelector<HTMLElement>('[data-cursor-pill]');
    if (!pill) return;
    let x = 0, y = 0, tx = 0, ty = 0, raf = 0, active = false;
    const loop = () => {
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      pill.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = active || Math.hypot(tx - x, ty - y) > 0.5 ? requestAnimationFrame(loop) : 0;
    };
    const move = (e: PointerEvent) => {
      const r = area.getBoundingClientRect();
      tx = e.clientX - r.left + 14;
      ty = e.clientY - r.top + 14;
      const overCard = (e.target as HTMLElement).closest('[data-project]');
      pill.classList.toggle('is-on', !!overCard);
      if (!active) {
        active = true;
        if (!raf) { x = tx; y = ty; raf = requestAnimationFrame(loop); }
      }
    };
    const leave = () => { active = false; pill.classList.remove('is-on'); };
    area.addEventListener('pointermove', move);
    area.addEventListener('pointerleave', leave);
    disposers.push(() => {
      area.removeEventListener('pointermove', move);
      area.removeEventListener('pointerleave', leave);
      cancelAnimationFrame(raf);
    });
  });
}

/** Filtro Todos / Websites / Apps web. */
function filters() {
  document.querySelectorAll<HTMLElement>('[data-filter-group]').forEach((group) => {
    const target = document.getElementById(group.dataset.filterGroup!);
    if (!target) return;
    const buttons = [...group.querySelectorAll<HTMLButtonElement>('button[data-filter]')];
    const cards = [...target.querySelectorAll<HTMLElement>('[data-type]')];
    const apply = (f: string) => {
      buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === f)));
      cards.forEach((c) => {
        const show = f === 'all' || c.dataset.type === f;
        c.hidden = !show;
        if (show && !reduce()) c.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }], { duration: 500, easing: 'cubic-bezier(.16,1,.3,1)' });
      });
    };
    buttons.forEach((b) => b.addEventListener('click', () => apply(b.dataset.filter!)));
  });
}

export function initPage() {
  reveals();
  rotators();
  scrubbers();
  cursorPills();
  filters();
}

document.addEventListener('astro:before-swap', () => {
  disposers.forEach((d) => d());
  disposers = [];
});
