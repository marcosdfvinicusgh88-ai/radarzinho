// ============================================================
// DANIEL RADAR 70.000 — main.js
// Site 100% estático: lê o conteúdo direto de data/content.js
// (variável global window.RADAR_CONTENT) e injeta nas páginas.
// Não há mais backend, painel administrativo ou Firebase — para
// atualizar qualquer texto, edite data/content.js.
// ============================================================

function loadContent() {
  if (window.RADAR_CONTENT) return window.RADAR_CONTENT;
  console.error('Não foi possível carregar o conteúdo do site: data/content.js não foi encontrado ou não carregou antes de main.js.');
  return null;
}

// ---------------------------------------------------------
// Escapa HTML antes de injetar texto, evitando que qualquer
// campo de texto vire script executável na página.
// ---------------------------------------------------------
function esc(str) {
  return String(str ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function bindLinks(content) {
  document.querySelectorAll('[data-download]').forEach((el) => {
    const key = el.getAttribute('data-download');
    if (content.links[key]) {
      el.setAttribute('href', content.links[key]);
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
      if (key === 'propostasPdf') {
        el.addEventListener('click', () => {
          if (typeof radarTrackEvent === 'function') radarTrackEvent('propostas_baixadas', {});
        });
      }
    }
  });
  document.querySelectorAll('[data-href]').forEach((el) => {
    const key = el.getAttribute('data-href');
    if (content.links[key]) el.setAttribute('href', content.links[key]);
  });
}

function renderFlags(content) {
  const grid = document.getElementById('flagsGrid');
  if (!grid) return;
  const bandeiras = content.bandeiras || [];
  grid.innerHTML = bandeiras.map((b, i) => `
    <div class="flag-card reveal" data-num="${String(i + 1).padStart(2, '0')}">
      <span class="flag-num">${String(i + 1).padStart(2, '0')}</span>
      <h3>${esc(b.titulo)}</h3>
      <p>${esc(b.texto)}</p>
    </div>
  `).join('');
}

function renderSignalLog(content) {
  const log = document.getElementById('signalLog');
  if (!log) return;
  const items = content.compromissos || [];
  const LIMITE_INICIAL = 10;
  const iniciais = items.slice(0, LIMITE_INICIAL);
  const restantes = items.slice(LIMITE_INICIAL);

  function linha(c) {
    return `
    <details class="signal-row reveal">
      <summary>
        <span class="idx">${esc(String(c.numero).padStart(2, '0'))}</span>
        <h4>${esc(c.titulo)}</h4>
        <span class="tag">${esc(c.categoria)}</span>
        <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
      </summary>
      <div class="body">${esc(c.texto)}</div>
    </details>`;
  }

  log.innerHTML = iniciais.map(linha).join('');

  const oldBtn = document.getElementById('signalLogMore');
  if (oldBtn) oldBtn.remove();

  if (restantes.length) {
    const wrap = document.createElement('div');
    wrap.className = 'signal-log-more';
    wrap.id = 'signalLogMore';
    wrap.innerHTML = `<button type="button" class="btn btn-outline on-light">Ver todos os ${items.length} compromissos</button>`;
    log.insertAdjacentElement('afterend', wrap);
    wrap.querySelector('button').addEventListener('click', () => {
      log.insertAdjacentHTML('beforeend', restantes.map(linha).join(''));
      wrap.remove();
      if (typeof setupReveal === 'function') setupReveal();
    });
  }
}

function renderNoticias(content) {
  const grid = document.getElementById('noticiasGrid');
  if (!grid) return;
  const items = content.noticias || [];
  if (!items.length) { grid.innerHTML = ''; return; }
  grid.innerHTML = items.map((n) => `
    <a class="news-card reveal" href="${esc(n.url)}" target="_blank" rel="noopener">
      <div class="news-card-thumb" aria-hidden="true">
        ${n.imagem ? `<img src="${esc(n.imagem)}" alt="" loading="lazy" decoding="async">` : ''}
      </div>
      <div class="news-card-meta">
        <span class="news-source">${esc(n.fonte)}</span>
        <span class="news-date">${esc(n.data)}</span>
      </div>
      <h3>${esc(n.titulo)}</h3>
      <p>${esc(n.resumo)}</p>
      <span class="news-link">Ler matéria completa
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M17 7H9M17 7v8"/></svg>
      </span>
    </a>
  `).join('');
}

function renderFicha(content) {
  const box = document.getElementById('fichaBox');
  const qs = content.quemSou || {};
  const ficha = qs.ficha;
  if (!box || !ficha) return;
  box.innerHTML = `
    <h4>${esc(ficha.titulo || 'Ficha da candidatura')}</h4>
    <dl>
      ${(ficha.itens || []).map((i) => `<div class="ficha-item"><dt>${esc(i.label)}</dt><dd>${esc(i.valor)}</dd></div>`).join('')}
    </dl>
    ${ficha.fonte ? `<p class="ficha-fonte">${ficha.fonteUrl ? `<a href="${esc(ficha.fonteUrl)}" target="_blank" rel="noopener">${esc(ficha.fonte)}</a>` : esc(ficha.fonte)}</p>` : ''}
  `;
}

function renderSocial(content) {
  const list = document.getElementById('socialList');
  if (!list) return;
  const nets = [
    { name: 'Instagram', href: content.links.instagram, handle: content.links.instagramHandle },
    { name: 'TikTok', href: content.links.tiktok, handle: content.links.tiktokHandle },
    { name: 'Kwai', href: content.links.kwai, handle: content.links.kwaiHandle },
  ];
  list.innerHTML = nets.map((n) => `
    <a class="social-card" href="${esc(n.href)}" target="_blank" rel="noopener">
      <span>
        <span class="name">${esc(n.name)}</span>
        <span class="handle">${esc(n.handle)}</span>
      </span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M17 7H9M17 7v8"/></svg>
    </a>
  `).join('');
}

function renderFooter(content) {
  const foneCoord = document.getElementById('foneCoord');
  const foneImprensa = document.getElementById('foneImprensa');
  const comite = document.getElementById('comiteCentral');
  const cnpj = document.getElementById('cnpj');
  const legal = document.getElementById('footerLegal');
  if (foneCoord) foneCoord.textContent = content.contato.coordenacaoGeral;
  if (foneImprensa) foneImprensa.textContent = content.contato.imprensa;
  if (comite) comite.textContent = content.contato.comite;
  if (cnpj) cnpj.textContent = content.contato.cnpj;
  if (legal) legal.textContent = content.contato.rodape;
}

function renderHeroAndAbout(content) {
  const c = content.candidato;
  const heroPhoto = document.getElementById('heroPhoto');
  const aboutPhoto = document.getElementById('aboutPhoto');
  if (heroPhoto && c.fotoHero) heroPhoto.src = c.fotoHero;
  if (aboutPhoto && c.fotoQuemSou) aboutPhoto.src = c.fotoQuemSou;

  // cabeçalho: nome + número
  const brandName = document.getElementById('brandName');
  const brandNumber = document.getElementById('brandNumber');
  if (brandName && c.nome) brandName.textContent = c.nome;
  if (brandNumber && c.numeroFormatado) brandNumber.textContent = c.numeroFormatado;

  // hero
  const tag = document.getElementById('candidateTag');
  const title = document.getElementById('heroTitle');
  const sub = document.getElementById('heroSub');
  const digits = document.getElementById('ballotDigits');
  const party = document.getElementById('ballotParty');
  if (tag && c.cargo) tag.textContent = `Candidato a ${c.cargo} · DF · Eleição 2026`;
  if (title && c.slogan) title.textContent = c.slogan;
  if (sub && c.subSlogan) sub.textContent = c.subSlogan;
  if (digits && c.numero) {
    digits.setAttribute('aria-label', c.numero);
    digits.innerHTML = String(c.numero).split('').map((d) => `<span>${esc(d)}</span>`).join('');
  }
  if (party && (c.partido || c.partidoNumero)) party.textContent = `${c.partido || ''} ${c.partidoNumero || ''}`.trim();

  const heroTagNome = document.getElementById('heroTagNome');
  const heroTagCargo = document.getElementById('heroTagCargo');
  if (heroTagNome && c.nome) heroTagNome.textContent = c.nome;
  if (heroTagCargo && (c.cargo || c.numeroFormatado)) heroTagCargo.textContent = `${c.cargo || ''} · ${c.numeroFormatado || ''}`.trim();

  // quem sou
  const qsTitle = document.getElementById('quemSouTitle');
  const aboutText = document.getElementById('aboutText');
  if (qsTitle && content.quemSou.titulo) qsTitle.textContent = content.quemSou.titulo;
  if (aboutText && content.quemSou.texto) {
    aboutText.innerHTML = content.quemSou.texto
      .split(/\n\s*\n/)
      .map((p) => `<p>${esc(p.trim())}</p>`)
      .join('');
  }

  // linha do tempo
  const timeline = document.getElementById('timeline');
  if (timeline && Array.isArray(content.quemSou.linhaDoTempo)) {
    timeline.innerHTML = content.quemSou.linhaDoTempo.map((item) => `
      <div class="timeline-item">
        <div class="year">${esc(item.ano || '')}</div>
        <h4>${esc(item.titulo || '')}</h4>
        <p>${esc(item.texto || '')}</p>
      </div>
    `).join('');
  }

  renderFicha(content);
}

function setupHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const toggle = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
}

function setupNav() {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('mainNav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

function renderStats(content) {
  const grid = document.getElementById('statsGrid');
  if (!grid) return;
  const nums = grid.querySelectorAll('.stat-num');
  if (!nums.length) return;

  // recalcula os alvos com base no conteúdo real de data/content.js
  const bandeiras = (content.bandeiras || []).length;
  const compromissos = (content.compromissos || []).length;
  const timeline = content.quemSou.linhaDoTempo || [];
  const anoInicio = timeline.length ? parseInt(timeline[0].ano, 10) : null;
  const anosAtuacao = anoInicio && !Number.isNaN(anoInicio) ? (new Date().getFullYear() - anoInicio) : null;
  const votosItem = timeline.find((t) => /voto/i.test(t.titulo || ''));
  const votos = votosItem ? parseInt(String(votosItem.titulo).replace(/[^\d]/g, ''), 10) : null;

  const overrides = [anosAtuacao, votos, compromissos, bandeiras];
  nums.forEach((el, i) => {
    if (overrides[i] != null && !Number.isNaN(overrides[i]) && overrides[i] > 0) {
      el.setAttribute('data-target', overrides[i]);
    }
  });

  animateStatsOnView(grid, nums);
}

function animateStatsOnView(grid, nums) {
  const run = () => {
    nums.forEach((el) => {
      const target = parseInt(el.getAttribute('data-target'), 10) || 0;
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1400;
      const start = performance.now();
      const startVal = 0;
      function tick(now) {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = Math.round(startVal + (target - startVal) * eased);
        el.textContent = val.toLocaleString('pt-BR') + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  };

  if (!('IntersectionObserver' in window)) { run(); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { run(); io.disconnect(); }
    });
  }, { threshold: 0.4 });
  io.observe(grid);
}

function setupHeroParallax() {
  const photo = document.querySelector('.hero-photo');
  const hero = document.querySelector('.hero');
  if (!photo || !hero) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(max-width: 700px)').matches) return; // evita jank em telas pequenas

  let ticking = false;
  function update() {
    ticking = false;
    const rect = hero.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, -rect.top / (rect.height || 1)));
    photo.style.transform = `translateY(${progress * 34}px)`;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
}

function setupHeaderProgressiveOpacity() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  let ticking = false;
  function update() {
    ticking = false;
    const y = window.scrollY || 0;
    const p = Math.min(1, y / 240);
    header.style.setProperty('--scroll', p.toFixed(3));
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
}

function setupScrollSpy() {
  const navLinks = Array.from(document.querySelectorAll('.nav a[href^="#"]'));
  if (!navLinks.length) return;
  const targets = navLinks
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);
  if (!targets.length || !('IntersectionObserver' in window)) return;

  const linkFor = (id) => navLinks.find((a) => a.getAttribute('href') === `#${id}`);
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const link = linkFor(entry.target.id);
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach((a) => a.classList.remove('is-active'));
        link.classList.add('is-active');
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });
  targets.forEach((t) => io.observe(t));
}

function setupHeroSpotlight() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    hero.style.setProperty('--mx', `${x}%`);
    hero.style.setProperty('--my', `${y}%`);
  });
}

/* função de cursor customizado removida — visual padrão do navegador */

function setupPageTransitions() {
  document.body.classList.add('page-transition');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('a[href]').forEach((a) => {
    const href = a.getAttribute('href') || '';
    const isInternalPage = /\.html(#.*)?$/.test(href) && !href.startsWith('http') && a.target !== '_blank';
    if (!isInternalPage) return;
    a.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return; // respeita abrir em nova aba
      e.preventDefault();
      document.body.classList.add('page-leaving');
      setTimeout(() => { window.location.href = href; }, 200);
    });
  });
}

function setupBallotCountUp() {
  const digits = document.getElementById('ballotDigits');
  if (!digits) return;
  const spans = digits.querySelectorAll('span');
  if (!spans.length) return;
  spans.forEach((s, i) => {
    s.style.opacity = '0';
    s.style.transform = 'translateY(10px)';
    s.style.transition = `opacity .4s var(--ease) ${i * 90}ms, transform .4s var(--ease) ${i * 90}ms`;
  });
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      spans.forEach((s) => { s.style.opacity = '1'; s.style.transform = 'none'; });
    });
  });
}

function setupNavDropdown() {
  const dropdown = document.getElementById('navParticipe');
  if (!dropdown) return;
  const btn = dropdown.querySelector('button');
  if (!btn) return;

  function close() {
    dropdown.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
  }
  function toggle() {
    const open = dropdown.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggle();
  });
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}

function setupReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  // atraso escalonado: elementos irmãos dentro do mesmo container revelam em cascata
  const groups = new Map();
  els.forEach((el) => {
    const parent = el.parentElement;
    const idx = groups.get(parent) || 0;
    el.style.setProperty('--reveal-delay', Math.min(idx, 6) * 70 + 'ms');
    groups.set(parent, idx + 1);
  });

  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  els.forEach((el) => io.observe(el));

  // rede de segurança: se por algum motivo o navegador não disparar o
  // IntersectionObserver a tempo, revela tudo mesmo assim depois de um instante
  setTimeout(() => {
    els.forEach((el) => el.classList.add('is-visible'));
  }, 2500);
}

function applyTheme(content) {
  const t = content.tema;
  if (!t) return;
  const root = document.documentElement.style;
  if (t.corSinal) { root.setProperty('--signal', t.corSinal); root.setProperty('--signal-dim', hexToRgba(t.corSinal, 0.18)); }
  if (t.corVerdeInstitucional) root.setProperty('--green-deep', t.corVerdeInstitucional);
  if (t.corVerdeMedio) root.setProperty('--green-mid', t.corVerdeMedio);
  if (t.corDestaque) root.setProperty('--amber', t.corDestaque);
  if (t.corFundo) { root.setProperty('--ink', t.corFundo); }
}
function hexToRgba(hex, alpha) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return hex;
  const [r, g, b] = [1, 2, 3].map((i) => parseInt(m[i], 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function applyVisibility(content) {
  const v = content.visibilidade || {};
  const map = {
    stats: '.stats-section',
    bandeiras: '#bandeiras',
    compromissos: '#compromissos',
    noticias: '#noticias',
  };
  Object.entries(map).forEach(([key, sel]) => {
    if (v[key] === false) {
      const el = document.querySelector(sel);
      if (el) el.style.display = 'none';
    }
  });
  const navMap = {
    navFotos: 'fotos.html',
    navFigurinhas: 'figurinhas.html',
    navMoldura: 'moldura.html',
    navAgenda: 'agenda.html',
    navImprensa: 'imprensa.html',
    navDoacoes: 'doacoes.html',
  };
  Object.entries(navMap).forEach(([key, href]) => {
    if (v[key] === false) {
      document.querySelectorAll(`a[href="${href}"]`).forEach((a) => {
        const li = a.closest('li') || a;
        li.style.display = 'none';
      });
    }
  });
}

function init() {
  setupNav();
  setupNavDropdown();
  setupHeaderScroll();
  setupHeaderProgressiveOpacity();
  setupHeroParallax();
  setupHeroSpotlight();
  setupPageTransitions();
  const content = loadContent();
  if (!content) { setupReveal(); setupScrollSpy(); return; }
  applyTheme(content);
  bindLinks(content);
  renderHeroAndAbout(content);
  setupBallotCountUp();
  renderFlags(content);
  renderSignalLog(content);
  renderNoticias(content);
  renderSocial(content);
  renderFooter(content);
  renderStats(content);
  applyVisibility(content);
  setupReveal();
  setupScrollSpy();
  document.dispatchEvent(new CustomEvent('radar:content-ready', { detail: content }));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
