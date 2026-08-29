// ============================================================
// Lightbox — Daniel Radar 70.000
// Modal simples e leve para navegar pelas fotos em tela cheia,
// com teclado (← → Esc), botões e clique fora para fechar.
// Uso: initLightbox(containerSelector, itemSelector)
// O item precisa ter href (ou data-full) para a imagem grande
// e pode ter data-caption para a legenda.
// ============================================================

function initLightbox(containerSelector, itemSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  let items = [];
  let current = 0;
  let overlay = null;

  function collectItems() {
    items = Array.from(container.querySelectorAll(itemSelector));
  }

  function buildOverlay() {
    overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `
      <span class="lightbox-counter" id="lbCounter"></span>
      <button class="lightbox-close" aria-label="Fechar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
      <button class="lightbox-nav lightbox-prev" aria-label="Foto anterior">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <figure class="lightbox-figure">
        <img id="lbImg" alt="">
        <figcaption class="lightbox-caption" id="lbCaption"></figcaption>
      </figure>
      <button class="lightbox-nav lightbox-next" aria-label="Próxima foto">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
      </button>
    `;
    document.body.appendChild(overlay);
    overlay.querySelector('.lightbox-close').addEventListener('click', close);
    overlay.querySelector('.lightbox-prev').addEventListener('click', () => nav(-1));
    overlay.querySelector('.lightbox-next').addEventListener('click', () => nav(1));
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  }

  function open(index) {
    if (!overlay) buildOverlay();
    current = index;
    render();
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
  }

  function close() {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);
  }

  function nav(dir) {
    current = (current + dir + items.length) % items.length;
    render();
  }

  function render() {
    const el = items[current];
    const full = el.getAttribute('data-full') || el.getAttribute('href') || el.querySelector('img')?.src;
    const caption = el.getAttribute('data-caption') || '';
    const img = overlay.querySelector('#lbImg');
    img.src = full;
    img.alt = caption;
    overlay.querySelector('#lbCaption').textContent = caption;
    overlay.querySelector('#lbCounter').textContent = `${current + 1} / ${items.length}`;
    const multi = items.length > 1;
    overlay.querySelector('.lightbox-prev').style.display = multi ? '' : 'none';
    overlay.querySelector('.lightbox-next').style.display = multi ? '' : 'none';
  }

  function onKey(e) {
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') nav(-1);
    if (e.key === 'ArrowRight') nav(1);
  }

  function bind() {
    collectItems();
    items.forEach((el, i) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        open(i);
      });
    });
  }

  bind();
  return { refresh: bind };
}
