/* ============================================
   Reward FX — star burst celebration
   Call celebrate(x, y) at a screen coordinate.
   ============================================ */

function ensureFxLayer() {
  let layer = document.querySelector('.fx-layer');
  if (!layer) {
    layer = document.createElement('div');
    layer.className = 'fx-layer';
    document.body.appendChild(layer);
  }
  return layer;
}

function celebrate(x, y) {
  const layer = ensureFxLayer();
  const colors = ['#FFD166', '#FF8A65', '#6EC6E8', '#8BC34A'];
  const count = 14;

  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    const isStar = Math.random() > 0.35;
    const color = colors[i % colors.length];
    star.innerHTML = isStar ? '★' : '●';
    star.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      font-size: ${isStar ? '2.4rem' : '1rem'};
      color: ${color};
      transform: translate(-50%, -50%);
      will-change: transform, opacity;
    `;
    layer.appendChild(star);

    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
    const dist = 90 + Math.random() * 110;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist - 40;

    gsap.timeline({ onComplete: () => star.remove() })
      .to(star, { x: dx, y: dy, rotation: Math.random() * 360, scale: 1.2, duration: 0.55, ease: 'power2.out' })
      .to(star, { y: dy + 70, opacity: 0, duration: 0.5, ease: 'power1.in' }, '-=0.1');
  }
}

/* Big full-screen success moment, used sparingly (e.g. completing a whole island) */
function celebrateBig() {
  const cx = window.innerWidth / 2;
  celebrate(cx - 120, window.innerHeight / 2);
  celebrate(cx + 120, window.innerHeight / 2);
  setTimeout(() => celebrate(cx, window.innerHeight / 2 - 60), 150);
}
