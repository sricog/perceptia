// Efectos de página. Se reinician en cada navegación (astro:page-load) y se limpian antes del swap.
import { showcases, loupes } from './projects';

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

type LensState = { x: number; y: number; r: number; s: number; k: number };
type LensShader = HTMLElement & { state?: LensState; redraw?: () => void };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Progreso local de `e` dentro del tramo [a, b]. */
const seg = (e: number, a: number, b: number) => clamp01((e - a) / (b - a));
const inOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const outExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Hero «Convergencia». Coordenadas del shader: unidades del alto del viewport, origen al centro, y hacia arriba.
 * Tramos del progreso de scroll `e`:
 *   0 – .68  las lentes se acercan hasta la proporción del isotipo (separación = radio)
 *   0 – .70  el registro de compilación avanza paso a paso (LOG_STEPS) bajo las lentes
 *  .62 – .88 las lentes se vuelven el isotipo (K); el registro se desvanece en .76 – .86
 *  .72 – .97 entra el titular con los CTA
 */
/** Inicio de cada paso del registro; el último se marca completo en LOG_DONE. */
const LOG_STEPS = [0, 0.14, 0.28, 0.46, 0.62];
const LOG_DONE = 0.7;

function hero() {
  const host = document.querySelector<HTMLElement>('[data-hero]');
  const stage = host?.querySelector<HTMLElement>('[data-hero-stage]');
  const shader = host?.querySelector<LensShader>('pc-shader');
  if (!host || !stage || !shader) return;
  const log = host.querySelector<HTMLElement>('.hero-log')!;
  const steps = [...log.querySelectorAll<HTMLElement>('[data-step]')].map((el) => {
    const counter = el.querySelector<HTMLElement>('[data-count]');
    return { el, counter, total: Number(counter?.dataset.count ?? 0), state: '', shown: -1 };
  });
  const cue = host.querySelector<HTMLElement>('.hero-cue')!;
  const fin = host.querySelector<HTMLElement>('.hero-final')!;

  const geo = () => {
    const w = stage.clientWidth, h = stage.clientHeight;
    const half = w / h / 2;
    const portrait = w < h * 0.9;
    const r0 = Math.min(0.25, half * 0.42);
    return {
      w, h, half,
      r0,
      s0: Math.min(r0 * 1.6, half - r0 * 1.18),
      r1: portrait ? r0 * 0.95 : r0 * 0.76,
      y0: portrait ? 0.06 : 0.03,
      y1: portrait ? 0.2 : 0.17,
    };
  };
  let g = geo();

  const finalState = (): LensState => ({ x: 0, y: g.y1, r: g.r1, s: g.r1 / 2, k: 1 });

  if (reduce()) {
    shader.state = finalState();
    shader.redraw?.();
    const onResize = () => { g = geo(); shader.state = finalState(); shader.redraw?.(); };
    on(window, 'resize', onResize);
    disposers.push(() => delete shader.state);
    return;
  }

  host.dataset.armed = '';
  const px = (x: number) => g.w / 2 + x * g.h;
  const py = (y: number) => g.h / 2 - y * g.h;
  const set = (el: HTMLElement, o: number, x?: number, y?: number) => {
    el.style.setProperty('--o', o.toFixed(3));
    if (x !== undefined) el.style.setProperty('--x', `${x.toFixed(1)}px`);
    if (y !== undefined) el.style.setProperty('--y', `${y.toFixed(1)}px`);
  };

  const apply = (e: number, intro: number) => {
    const conv = inOut(seg(e, 0, 0.68));
    const r = lerp(g.r0, g.r1, inOut(seg(e, 0.35, 0.9)));
    // Al cargar, las lentes entran desde más afuera.
    const sStart = g.s0 + (1 - intro) * g.half * 0.55;
    const s = lerp(sStart, r / 2, conv);
    const y = lerp(g.y0, g.y1, inOut(seg(e, 0.4, 0.95)));
    const k = inOut(seg(e, 0.62, 0.88));
    shader.state = { x: 0, y, r, s, k };

    set(log, (1 - seg(e, 0.76, 0.86)) * intro, px(0), py(y - r) + 32);
    steps.forEach((st, i) => {
      const start = LOG_STEPS[i];
      const end = LOG_STEPS[i + 1] ?? LOG_DONE;
      const state = e >= end ? 'done' : e >= start ? 'active' : '';
      if (state !== st.state) {
        st.state = state;
        if (state) st.el.dataset.state = state;
        else delete st.el.dataset.state;
      }
      if (st.counter) {
        const n = Math.round(st.total * seg(e, start, end));
        if (n !== st.shown) st.counter.textContent = String((st.shown = n));
      }
    });
    set(cue, (1 - seg(e, 0, 0.08)) * intro);

    const f = inOut(seg(e, 0.72, 0.97));
    host.style.setProperty('--f', f.toFixed(3));
    const isFinal = f > 0.6;
    if (isFinal !== host.hasAttribute('data-final')) {
      host.toggleAttribute('data-final', isFinal);
      fin.inert = !isFinal;
    }
  };

  const target = () => {
    const r = host.getBoundingClientRect();
    const total = r.height - window.innerHeight;
    return total > 0 ? clamp01(-r.top / total) : 1;
  };

  let e = target();
  const t0 = performance.now();
  let raf = 0;
  let visible = true;
  const tick = (now: number) => {
    raf = 0;
    const t = target();
    e += (t - e) * 0.14;
    if (Math.abs(t - e) < 0.0005) e = t;
    apply(e, outExpo(clamp01((now - t0) / 1800)));
    if (visible) raf = requestAnimationFrame(tick);
  };
  fin.inert = true;
  raf = requestAnimationFrame(tick);

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !raf) raf = requestAnimationFrame(tick);
  });
  io.observe(host);
  on(window, 'resize', () => (g = geo()));

  disposers.push(() => {
    cancelAnimationFrame(raf);
    io.disconnect();
    delete shader.state;
  });
}

/** Pastilla "Ver sitio ↗" que sigue al cursor sobre la grilla de proyectos. */
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
    buttons.forEach((b) =>
      b.addEventListener('click', () => {
        apply(b.dataset.filter!);
        target.dispatchEvent(new CustomEvent('pc:filter'));
      }),
    );
  });
}

export function initPage() {
  hero();
  reveals();
  rotators();
  scrubbers();
  filters();
  showcases(disposers);
  loupes(disposers);
  if (document.querySelector('[data-globe]')) import('./globe').then((m) => m.globes(disposers));
}

document.addEventListener('astro:before-swap', () => {
  disposers.forEach((d) => d());
  disposers = [];
});
