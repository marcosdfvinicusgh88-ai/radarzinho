/**
 * Backend leve — Daniel Radar 70.000
 * ------------------------------------------------------------
 * Um servidor Express simples, sem banco de dados externo:
 * os dados ficam em arquivos JSON dentro de /server/data.
 *
 * Rotas:
 *   POST /api/voluntarios   -> cadastro de voluntário
 *   POST /api/contato       -> mensagem de contato
 *   POST /api/eventos       -> evento genérico (ex: moldura_gerada)
 *   GET  /api/stats         -> contadores públicos (sem dados pessoais)
 *   GET  /admin?token=...   -> painel simples de leitura (protegido)
 *
 * Para rodar:
 *   cd server
 *   cp .env.example .env   (edite o ADMIN_TOKEN)
 *   npm install
 *   npm start
 * ------------------------------------------------------------
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const PORT = process.env.PORT || 3001;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';
const FRONTEND_ORIGIN = (process.env.FRONTEND_ORIGIN || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const DATA_DIR = path.join(__dirname, 'data');
const FILES = {
  voluntarios: path.join(DATA_DIR, 'voluntarios.json'),
  contatos: path.join(DATA_DIR, 'contatos.json'),
  eventos: path.join(DATA_DIR, 'eventos.json'),
};

// ---------- storage helpers (arquivo JSON simples, com escrita segura) ----------
function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  Object.values(FILES).forEach((f) => {
    if (!fs.existsSync(f)) fs.writeFileSync(f, '[]', 'utf8');
  });
}

function readJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return [];
  }
}

// escrita atômica: grava em arquivo temporário e renomeia, evita corromper o JSON
function writeJSON(file, data) {
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tmp, file);
}

function appendRecord(file, record) {
  const list = readJSON(file);
  const withId = { id: crypto.randomUUID(), criadoEm: new Date().toISOString(), ...record };
  list.push(withId);
  writeJSON(file, list);
  return withId;
}

ensureDataFiles();

// ---------- app ----------
const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '100kb' }));

app.use(
  cors({
    origin(origin, cb) {
      // permite chamadas sem "Origin" (ex: curl/health checks) e as origens configuradas
      if (!origin || FRONTEND_ORIGIN.length === 0 || FRONTEND_ORIGIN.includes(origin)) {
        return cb(null, true);
      }
      return cb(new Error('Origem não permitida'));
    },
  })
);

// limite de requisições: protege os formulários contra spam/bots
const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, erro: 'Muitas tentativas. Tente novamente em alguns minutos.' },
});

// ---------- validação simples ----------
function isEmail(v) {
  return typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}
function clean(v, max = 500) {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

// honeypot: campo invisível no formulário; se vier preenchido, é bot -> descarta silenciosamente
function isBot(body) {
  return Boolean(body && body.website);
}

// ---------- rotas públicas ----------
app.get('/api/health', (req, res) => res.json({ ok: true, servico: 'radar70000-backend' }));

app.post('/api/voluntarios', formLimiter, (req, res) => {
  const body = req.body || {};
  if (isBot(body)) return res.json({ ok: true }); // finge sucesso pro bot, mas não salva

  const nome = clean(body.nome, 120);
  const telefone = clean(body.telefone, 40);
  const email = clean(body.email, 160);
  const bairro = clean(body.bairro, 120);
  const mensagem = clean(body.mensagem, 1000);

  if (!nome || (!telefone && !email)) {
    return res.status(400).json({ ok: false, erro: 'Informe seu nome e telefone ou e-mail.' });
  }
  if (email && !isEmail(email)) {
    return res.status(400).json({ ok: false, erro: 'E-mail inválido.' });
  }

  const registro = appendRecord(FILES.voluntarios, { nome, telefone, email, bairro, mensagem });
  return res.status(201).json({ ok: true, id: registro.id });
});

app.post('/api/contato', formLimiter, (req, res) => {
  const body = req.body || {};
  if (isBot(body)) return res.json({ ok: true });

  const nome = clean(body.nome, 120);
  const email = clean(body.email, 160);
  const assunto = clean(body.assunto, 160);
  const mensagem = clean(body.mensagem, 2000);

  if (!nome || !isEmail(email) || !mensagem) {
    return res.status(400).json({ ok: false, erro: 'Preencha nome, e-mail válido e mensagem.' });
  }

  const registro = appendRecord(FILES.contatos, { nome, email, assunto, mensagem });
  return res.status(201).json({ ok: true, id: registro.id });
});

// evento genérico e anônimo, usado por exemplo pela ferramenta de moldura
// (ex: { tipo: "moldura_gerada", meta: { estilo: "circulo" } })
const TIPOS_EVENTO_PERMITIDOS = new Set([
  'moldura_gerada',
  'figurinha_baixada',
  'foto_baixada',
  'propostas_baixadas',
]);

app.post('/api/eventos', formLimiter, (req, res) => {
  const body = req.body || {};
  const tipo = clean(body.tipo, 60);
  if (!TIPOS_EVENTO_PERMITIDOS.has(tipo)) {
    return res.status(400).json({ ok: false, erro: 'Tipo de evento inválido.' });
  }
  const meta = body.meta && typeof body.meta === 'object' ? body.meta : {};
  appendRecord(FILES.eventos, { tipo, meta });
  return res.status(201).json({ ok: true });
});

// contadores públicos — sem nomes/e-mails, só números, seguro para expor no site
app.get('/api/stats', (req, res) => {
  const voluntarios = readJSON(FILES.voluntarios).length;
  const contatos = readJSON(FILES.contatos).length;
  const eventos = readJSON(FILES.eventos);
  const eventosPorTipo = {};
  eventos.forEach((e) => {
    eventosPorTipo[e.tipo] = (eventosPorTipo[e.tipo] || 0) + 1;
  });
  res.json({ ok: true, voluntarios, contatos, eventos: eventosPorTipo });
});

// ---------- painel simples (protegido por token) ----------
function checkAdminToken(req, res, next) {
  if (!ADMIN_TOKEN) {
    return res.status(503).send('ADMIN_TOKEN não configurado no servidor (.env).');
  }
  const token = req.query.token || req.headers['x-admin-token'];
  if (token !== ADMIN_TOKEN) {
    return res.status(401).send('Token inválido. Acesse /admin?token=SEU_TOKEN');
  }
  next();
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

function renderTable(titulo, rows, colunas) {
  if (!rows.length) return `<h2>${titulo}</h2><p class="empty">Nenhum registro ainda.</p>`;
  const head = colunas.map((c) => `<th>${escapeHtml(c)}</th>`).join('');
  const body = rows
    .slice()
    .reverse()
    .map((r) => `<tr>${colunas.map((c) => `<td>${escapeHtml(r[c] ?? '')}</td>`).join('')}</tr>`)
    .join('');
  return `<h2>${titulo} <span class="count">${rows.length}</span></h2>
    <div class="table-wrap"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
}

app.get('/admin', checkAdminToken, (req, res) => {
  const voluntarios = readJSON(FILES.voluntarios);
  const contatos = readJSON(FILES.contatos);
  const eventos = readJSON(FILES.eventos);
  const eventosPorTipo = {};
  eventos.forEach((e) => { eventosPorTipo[e.tipo] = (eventosPorTipo[e.tipo] || 0) + 1; });

  res.set('Content-Type', 'text/html; charset=utf-8').send(`<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><title>Painel — Daniel Radar 70.000</title>
<meta name="robots" content="noindex,nofollow">
<style>
  :root{ --ink:#0B120E; --paper:#F7F5EC; --green:#0B6E12; --signal:#CFEA1E; }
  *{ box-sizing:border-box; }
  body{ font-family: system-ui, sans-serif; margin:0; background:var(--paper); color:var(--ink); }
  header{ background:var(--ink); color:#fff; padding:20px 24px; }
  header h1{ margin:0; font-size:18px; }
  main{ padding:24px; max-width:1100px; margin:0 auto; }
  .cards{ display:flex; gap:14px; flex-wrap:wrap; margin-bottom:28px; }
  .card{ background:#fff; border:1px solid rgba(0,0,0,.08); border-radius:12px; padding:16px 20px; min-width:140px; }
  .card strong{ display:block; font-size:26px; color:var(--green); }
  .card span{ font-size:12px; text-transform:uppercase; letter-spacing:.05em; color:#666; }
  h2{ font-size:16px; margin:28px 0 10px; display:flex; align-items:center; gap:8px; }
  .count{ background:var(--signal); color:var(--ink); font-size:11px; padding:2px 8px; border-radius:999px; }
  .table-wrap{ overflow-x:auto; background:#fff; border-radius:12px; border:1px solid rgba(0,0,0,.08); }
  table{ border-collapse:collapse; width:100%; font-size:13px; }
  th, td{ text-align:left; padding:9px 12px; border-bottom:1px solid rgba(0,0,0,.06); white-space:nowrap; max-width:280px; overflow:hidden; text-overflow:ellipsis; }
  th{ background:#f0f0f0; position:sticky; top:0; }
  .empty{ color:#888; font-size:13px; }
</style></head>
<body>
<header><h1>Painel — Daniel Radar 70.000</h1></header>
<main>
  <div class="cards">
    <div class="card"><strong>${voluntarios.length}</strong><span>Voluntários</span></div>
    <div class="card"><strong>${contatos.length}</strong><span>Mensagens de contato</span></div>
    ${Object.entries(eventosPorTipo).map(([t, n]) => `<div class="card"><strong>${n}</strong><span>${escapeHtml(t.replace(/_/g, ' '))}</span></div>`).join('')}
  </div>
  ${renderTable('Voluntários', voluntarios, ['criadoEm', 'nome', 'telefone', 'email', 'bairro', 'mensagem'])}
  ${renderTable('Contato', contatos, ['criadoEm', 'nome', 'email', 'assunto', 'mensagem'])}
</main>
</body></html>`);
});

app.use((req, res) => res.status(404).json({ ok: false, erro: 'Rota não encontrada.' }));
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ ok: false, erro: 'Erro interno.' });
});

app.listen(PORT, () => {
  console.log(`radar70000-backend rodando em http://localhost:${PORT}`);
  if (!ADMIN_TOKEN) console.warn('Aviso: defina ADMIN_TOKEN no .env para acessar /admin.');
});
