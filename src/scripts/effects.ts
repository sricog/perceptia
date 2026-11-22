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

/** Animaciones ligadas al scroll: texto que se ilumina, línea de proceso. */
function scrubbers() {
  const words = [...document.querySelectorAll<HTMLElement>('[data-scrub-words]')].map((el) => ({
    el,
    spans: [...el.querySelectorAll<HTMLElement>('span[data-w]')],
  }));
  const progress = [...document.querySelectorAll<HTMLElement>('[data-progress]')];
  if (!words.length && !progress.length) return;
  words.forEach((w) => (w.el.dataset.armed = ''));

  if (reduce()) {
    words.forEach((w) => w.spans.forEach((s) => s.classList.add('lit')));
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
type LensShader = HTMLElement & { state?: LensState; redraw?: () => void; _m?: number[] };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Progreso local de `e` dentro del tramo [a, b]. */
const seg = (e: number, a: number, b: number) => clamp01((e - a) / (b - a));
const inOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const outExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const GLYPHS = '01<>/#%*+=$&{}[]∆';

/**
 * Hero «PERCEPT·IA». Coordenadas del shader: unidades del alto del viewport, origen al centro, y hacia arriba.
 * Tramos del progreso de scroll `e`:
 *   0  – .62  las lentes se acercan (escanean el campo de palabras: nítido solo dentro del vidrio)
 *  .08 – .46  cada palabra del campo gira hacia el centro de su lente y se apaga
 *  .22 – .44  aparece la palabra de cada lente: «Perceptible» enfoca, «Inteligencia Artificial» se decodifica
 *  .46 – .62  se destila: cae «ible»; de la IA solo sobreviven la I y la A
 *  .58 – .74  PERCEPT + IA salen de las lentes y se unen bajo el isotipo (K en .6 – .78); barrido de luz en .7 – .8
 *  .80 – .94  la palabra se encoge hasta el sello del titular; el titular y los CTA entran en .84 – .98
 */
function hero() {
  const host = document.querySelector<HTMLElement>('[data-hero]');
  const stage = host?.querySelector<HTMLElement>('[data-hero-stage]');
  const shader = host?.querySelector<LensShader>('pc-shader');
  if (!host || !stage || !shader) return;
  const cue = host.querySelector<HTMLElement>('.hero-cue')!;
  const fin = host.querySelector<HTMLElement>('.hero-final')!;
  const field = host.querySelector<HTMLElement>('[data-hero-field]')!;
  const wordBox = host.querySelector<HTMLElement>('[data-hero-word]')!;
  const seal = host.querySelector<HTMLElement>('[data-hero-seal]')!;
  const gL = wordBox.querySelector<HTMLElement>('[data-g="l"]')!;
  const gR = wordBox.querySelector<HTMLElement>('[data-g="r"]')!;
  const sweep = wordBox.querySelector<HTMLElement>('.hw-sweep')!;
  const note = wordBox.querySelector<HTMLElement>('.hw-note')!;

  const lens = () => {
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
  let g = lens();
  const finalState = (): LensState => ({ x: 0, y: g.y1, r: g.r1, s: g.r1 / 2, k: 1 });

  if (reduce()) {
    shader.state = finalState();
    shader.redraw?.();
    const onResize = () => { g = lens(); shader.state = finalState(); shader.redraw?.(); };
    on(window, 'resize', onResize);
    disposers.push(() => delete shader.state);
    return;
  }

  host.dataset.armed = '';
  const px = (x: number) => g.w / 2 + x * g.h;
  const py = (y: number) => g.h / 2 - y * g.h;

  // Campo: cada palabra tiene una copia desenfocada y otra nítida (la que se ve a través del vidrio).
  type Fw = { els: HTMLElement[]; base: number[]; h: boolean; fx: number; fy: number; d: number; ph: number };
  const fws: Fw[] = [];
  field.querySelectorAll<HTMLElement>('[data-fw]').forEach((el) => {
    const i = Number(el.dataset.i);
    const wd = (fws[i] ||= {
      els: [], base: [],
      h: el.dataset.side === 'h',
      fx: Number(el.dataset.x) / 100,
      fy: Number(el.dataset.y) / 100,
      d: Number(el.dataset.d),
      ph: i * 1.7,
    });
    wd.els.push(el);
    wd.base.push(el.closest('.hf-blur') ? 0.5 : 1);
  });

  // Letras de las dos palabras. `keep` = sobreviven y forman PERCEPT·IA.
  type Ch = { el: HTMLElement; keep: boolean; c: string; shown: string; ox: number; oy: number; w: number; fw: number; order: number; rnd: number; cum: number; word: boolean };
  const letters = (grp: HTMLElement) =>
    [...grp.querySelectorAll<HTMLElement>('[data-ch]')].map((el, order) => ({
      el, order,
      keep: el.hasAttribute('data-keep'),
      c: el.textContent ?? '',
      shown: el.textContent ?? '',
      ox: 0, oy: 0, w: 0, fw: 0, cum: 0, word: false,
      rnd: Math.random(),
    }));
  const L: Ch[] = letters(gL);
  const R: Ch[] = letters(gR);
  const kept = [...L.filter((c) => c.keep), ...R.filter((c) => c.keep)];
  const dropL = L.filter((c) => !c.keep);

  // Medidas tipográficas: dependen del tamaño de la lente y de que la fuente esté cargada.
  let m = { F: 64, total: 1, scM: 1, scS: 0.4, sealCx: 0, sealTop: 0, lw: 0, lh: 0, rw: 0, rh: 0 };
  const measure = () => {
    R.forEach((c) => (c.el.style.width = ''));
    [...L, ...R].forEach((c) => { c.el.textContent = c.shown = c.c; });
    wordBox.style.setProperty('--F', '100px');
    const widest = Math.max(gL.offsetWidth, gR.offsetWidth) || 1;
    const F = Math.max(14, Math.min(110, (1.62 * g.r0 * g.h * 100) / widest));
    wordBox.style.setProperty('--F', `${F.toFixed(2)}px`);
    for (const c of [...L, ...R]) {
      c.ox = c.el.offsetLeft;
      c.oy = c.el.offsetTop;
      c.w = c.el.offsetWidth;
    }
    // Ancho fijo para que los glifos de la decodificación no muevan la línea.
    // Ancho de cada letra ya dentro del nombre (la I y la A de la IA quedan en minúscula: «Perceptia»).
    for (const c of kept) {
      c.fw = c.w;
      if (L.includes(c)) continue;
      c.el.textContent = c.c.toLowerCase();
      c.fw = c.el.offsetWidth;
      c.el.textContent = c.c;
      c.word = false;
      c.el.classList.remove('is-word');
    }
    R.forEach((c) => (c.el.style.width = `${c.w}px`));
    let cum = 0;
    for (const c of kept) { c.cum = cum; cum += c.fw; }
    const total = cum || 1;
    const sealF = parseFloat(getComputedStyle(seal).fontSize) || 28;
    m = {
      F, total,
      scM: Math.min(130 / F, (g.w * 0.84) / total, (g.h * 0.15) / F),
      scS: sealF / F,
      sealCx: fin.offsetLeft + seal.offsetLeft + seal.offsetWidth / 2,
      sealTop: fin.offsetTop + seal.offsetTop,
      lw: gL.offsetWidth, lh: gL.offsetHeight,
      rw: gR.offsetWidth, rh: gR.offsetHeight,
    };
  };
  measure();

  const tf = (el: HTMLElement, x: number, y: number, s = 1) =>
    (el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)${s !== 1 ? ` scale(${s.toFixed(4)})` : ''}`);
  const blur = (el: HTMLElement, b: number) => (el.style.filter = b > 0.05 ? `blur(${b.toFixed(2)}px)` : '');
  const glyph = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];
  const show = (c: Ch, txt: string, isGlyph: boolean) => {
    if (c.shown === txt) return;
    c.shown = txt;
    c.el.textContent = txt;
    c.el.classList.toggle('glyph', isGlyph);
  };
  let lastSwap = 0;

  const apply = (e: number, intro: number, now: number) => {
    // ── Lentes
    // Dos tiempos: primero se acercan hasta casi tocarse (y se quedan así mientras aparecen las
    // palabras); después se cruzan hasta la proporción del isotipo (separación = radio).
    const r = lerp(g.r0, g.r1, inOut(seg(e, 0.45, 0.8)));
    const sStart = g.s0 + (1 - intro) * g.half * 0.55;
    const sNear = Math.min(sStart, g.r0 * 1.06);
    const s = lerp(lerp(sStart, sNear, inOut(seg(e, 0, 0.34))), r / 2, inOut(seg(e, 0.5, 0.68)));
    const y = lerp(g.y0, g.y1, inOut(seg(e, 0.5, 0.85)));
    shader.state = { x: 0, y, r, s, k: inOut(seg(e, 0.6, 0.78)) };

    // Mismo paralaje del cursor que aplica el shader a las lentes.
    const mm = shader._m ?? [0.5, 0.5];
    const cxU = ((mm[0] - 0.5) * (g.w / g.h)) * 0.06;
    const cyU = y + (mm[1] - 0.5 - y) * 0.06;
    const c1x = px(cxU - s), c2x = px(cxU + s), cy = py(cyU), rp = r * g.h;
    host.style.setProperty('--c1x', `${c1x.toFixed(1)}px`);
    host.style.setProperty('--c2x', `${c2x.toFixed(1)}px`);
    host.style.setProperty('--cy', `${cy.toFixed(1)}px`);
    host.style.setProperty('--rp', `${rp.toFixed(1)}px`);

    // ── Campo: las lentes lo escanean y lo absorben en espiral
    const fieldOn = e < 0.5;
    field.style.visibility = fieldOn ? '' : 'hidden';
    if (fieldOn) {
      field.style.setProperty('--fo', intro.toFixed(3));
      const t = now / 1000;
      for (const wd of fws) {
        const a = inOut(seg(e, 0.08 + wd.d * 0.16, 0.3 + wd.d * 0.16));
        const hx = wd.fx * g.w, hy = wd.fy * g.h;
        const x0 = hx + Math.sin(t * 0.4 + wd.ph) * 8, y0 = hy + Math.cos(t * 0.33 + wd.ph) * 6;
        const cx = wd.h ? c1x : c2x;
        const th = a * 1.2 * (wd.h ? -1 : 1);
        const vx = (x0 - cx) * (1 - a), vy = (y0 - cy) * (1 - a);
        const X = cx + vx * Math.cos(th) - vy * Math.sin(th);
        const Y = cy + vx * Math.sin(th) + vy * Math.cos(th);
        const op = 1 - seg(a, 0.55, 1);
        wd.els.forEach((el, k) => {
          tf(el, X - hx, Y - hy, 1 - 0.7 * a);
          el.style.opacity = (op * wd.base[k]).toFixed(3);
        });
      }
    }

    // ── Las dos palabras, centradas en su lente
    const showL = inOut(seg(e, 0.22, 0.38));
    const showR = seg(e, 0.24, 0.3);
    tf(gL, c1x - m.lw / 2, cy - m.lh / 2, 1.14 - 0.14 * showL);
    tf(gR, c2x - m.rw / 2, cy - m.rh / 2);
    gL.style.opacity = showL.toFixed(3);
    gR.style.opacity = showR.toFixed(3);
    blur(gL, (1 - showL) * 16); // lado humano: entra con un cambio de foco
    gR.style.setProperty('--glow', seg(e, 0.46, 0.56).toFixed(3));

    // Destino común de las letras que sobreviven: bajo el isotipo y, al final, el sello del titular.
    const merge = inOut(seg(e, 0.58, 0.74));
    const q = inOut(seg(e, 0.8, 0.94));
    const baseY = cy + rp + Math.max(18, g.h * 0.035);
    const wM = m.total * m.scM;
    const sc = lerp(m.scM, m.scS, q);
    const ox = lerp(g.w / 2 - wM / 2, m.sealCx - (m.total * m.scS) / 2, q);
    const oy = lerp(baseY, m.sealTop, q);
    const flight = Math.sin(Math.PI * merge) * 5;

    const land = (c: Ch, nx: number, ny: number) => {
      if (merge <= 0) return false;
      tf(c.el, (ox + c.cum * sc - nx) * merge, (oy - ny) * merge, lerp(1, sc, merge));
      blur(c.el, flight);
      return true;
    };

    // Lado humano: «ible» se desenfoca y cae.
    const lx = c1x - m.lw / 2, ly = cy - m.lh / 2;
    for (const c of L) {
      if (c.keep) {
        if (!land(c, lx + c.ox, ly + c.oy)) { c.el.style.transform = ''; blur(c.el, 0); }
      }
    }
    dropL.forEach((c, i) => {
      const p = seg(e, 0.46 + i * 0.025, 0.56 + i * 0.025);
      tf(c.el, 0, p * 0.5 * m.F);
      blur(c.el, p * 14);
      c.el.style.opacity = (1 - p).toFixed(3);
    });

    // Lado IA: se decodifica letra por letra; luego todo vuelve a ruido y solo quedan la I y la A.
    const swap = now - lastSwap > 55;
    if (swap) lastSwap = now;
    const dp = seg(e, 0.26, 0.44);
    const rx = c2x - m.rw / 2, ry = cy - m.rh / 2;
    for (const c of R) {
      const resolved = dp >= (c.order + 1) / (R.length + 1);
      if (c.keep) {
        const word = merge > 0.12;
        if (word !== c.word) {
          c.word = word;
          c.el.classList.toggle('is-word', word);
          c.el.style.width = `${word ? c.fw : c.w}px`;
        }
        if (word) show(c, c.c.toLowerCase(), false);
        else if (resolved) show(c, c.c, false);
        else if (swap) show(c, glyph(), true);
        if (!land(c, rx + c.ox, ry + c.oy)) { c.el.style.transform = ''; blur(c.el, 0); }
        continue;
      }
      const fp = seg(e, 0.46 + c.rnd * 0.08, 0.53 + c.rnd * 0.08);
      const noisy = !resolved || (fp > 0 && fp < 1);
      if (noisy) { if (swap) show(c, glyph(), true); }
      else show(c, c.c, false);
      c.el.style.opacity = (1 - fp).toFixed(3);
      tf(c.el, 0, -fp * 0.25 * m.F);
      blur(c.el, fp * 4);
    }

    // Barrido de luz y nota «perceptible + inteligencia artificial».
    const sw = seg(e, 0.7, 0.8);
    const hM = m.F * m.scM;
    tf(sweep, g.w / 2 - wM / 2 + sw * wM, baseY - hM * 0.15);
    sweep.style.height = `${(hM * 1.3).toFixed(1)}px`;
    sweep.style.opacity = (Math.sin(Math.PI * sw) * (1 - q)).toFixed(3);
    tf(note, g.w / 2, baseY + hM + 22);
    note.style.opacity = (seg(e, 0.68, 0.75) * (1 - seg(e, 0.79, 0.84))).toFixed(3);

    cue.style.setProperty('--o', ((1 - seg(e, 0, 0.06)) * intro).toFixed(3));

    const f = inOut(seg(e, 0.84, 0.98));
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
  let alive = true;
  const tick = (now: number) => {
    raf = 0;
    const t = target();
    e += (t - e) * 0.14;
    if (Math.abs(t - e) < 0.0005) e = t;
    apply(e, outExpo(clamp01((now - t0) / 1800)), now);
    if (visible) raf = requestAnimationFrame(tick);
  };
  fin.inert = true;
  raf = requestAnimationFrame(tick);

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !raf) raf = requestAnimationFrame(tick);
  });
  io.observe(host);
  on(window, 'resize', () => { g = lens(); measure(); });
  document.fonts?.ready.then(() => alive && measure());

  disposers.push(() => {
    alive = false;
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

/** Grilla de logos: cada pocos segundos una celda cambia su logo por uno de la reserva (con desenfoque). */
function logoGrids() {
  if (reduce()) return;
  document.querySelectorAll<HTMLElement>('[data-logo-grid]').forEach((grid) => {
    const pool = grid.querySelector<HTMLElement>('[data-logo-pool]');
    const cells = [...grid.querySelectorAll<HTMLElement>('.cell')];
    if (!pool || !pool.children.length || !cells.length) return;
    let last = -1, visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(grid);
    const swap = () => {
      if (!visible || document.hidden) return;
      let i = Math.floor(Math.random() * cells.length);
      if (i === last) i = (i + 1) % cells.length;
      last = i;
      const cell = cells[i];
      const out = cell.querySelector<HTMLElement>('.logo');
      const next = pool.firstElementChild as HTMLElement | null;
      if (!out || !next || cell.matches(':hover')) return;
      out.classList.add('is-out');
      window.setTimeout(() => {
        out.classList.remove('is-out', 'is-in');
        pool.append(out);
        next.classList.remove('is-in');
        cell.append(next);
        void next.offsetWidth;
        next.classList.add('is-in');
      }, 420);
    };
    const id = window.setInterval(swap, 2200);
    disposers.push(() => {
      clearInterval(id);
      io.disconnect();
    });
  });
}

export function initPage() {
  hero();
  reveals();
  rotators();
  scrubbers();
  filters();
  logoGrids();
  showcases(disposers);
  loupes(disposers);
  if (document.querySelector('[data-globe]')) import('./globe').then((m) => m.globes(disposers));
}

document.addEventListener('astro:before-swap', () => {
  disposers.forEach((d) => d());
  disposers = [];
});
