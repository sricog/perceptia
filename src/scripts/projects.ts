// Proyectos: carril horizontal del home.
type Dispose = () => void;
const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Carril de proyectos del home. El scroll es nativo; aquí solo se reflejan su avance (`--p`),
 * el número de la tarjeta alineada al inicio y los botones anterior / siguiente.
 */
export function rails(disposers: Dispose[]) {
  document.querySelectorAll<HTMLElement>('[data-rail]').forEach((root) => {
    const track = root.querySelector<HTMLElement>('[data-rail-track]');
    const cards = track ? ([...track.children] as HTMLElement[]) : [];
    const prev = root.querySelector<HTMLButtonElement>('[data-rail-prev]');
    const next = root.querySelector<HTMLButtonElement>('[data-rail-next]');
    const n = root.querySelector<HTMLElement>('[data-rail-n]');
    if (!track || cards.length < 2) return;

    // Tarjeta cuyo borde izquierdo está más cerca del inicio del carril.
    const index = () => {
      const x = track.scrollLeft;
      let best = 0;
      cards.forEach((c, i) => {
        if (Math.abs(c.offsetLeft - cards[0].offsetLeft - x) < Math.abs(cards[best].offsetLeft - cards[0].offsetLeft - x)) best = i;
      });
      return best;
    };
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = track.scrollWidth - track.clientWidth;
      const p = max > 0 ? Math.min(1, Math.max(0, track.scrollLeft / max)) : 1;
      // La barra arranca con el ancho de «una tarjeta de n» para que nunca se vea vacía.
      const min = 1 / cards.length;
      root.style.setProperty('--p', (min + (1 - min) * p).toFixed(3));
      if (n) n.textContent = String((p > 0.995 ? cards.length - 1 : index()) + 1).padStart(2, '0');
      if (prev) prev.disabled = p < 0.005;
      if (next) next.disabled = p > 0.995;
    };
    const req = () => (raf ||= requestAnimationFrame(update));
    const go = (dir: number) => {
      const i = Math.min(cards.length - 1, Math.max(0, index() + dir));
      track.scrollTo({ left: cards[i].offsetLeft - cards[0].offsetLeft, behavior: reduce() ? 'auto' : 'smooth' });
    };
    const onPrev = () => go(-1);
    const onNext = () => go(1);
    track.addEventListener('scroll', req, { passive: true });
    window.addEventListener('resize', req, { passive: true });
    prev?.addEventListener('click', onPrev);
    next?.addEventListener('click', onNext);
    update();
    disposers.push(() => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', req);
    });
  });
}
