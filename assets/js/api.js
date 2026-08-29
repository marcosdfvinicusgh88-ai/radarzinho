/**
 * Envio dos formulários do site.
 * ------------------------------------------------------------
 * Por padrão, os formulários (voluntário e contato) são enviados pelo
 * Netlify Forms — um recurso nativo do Netlify que não exige nenhum
 * backend: basta fazer o deploy do site (GitHub → Netlify) que as
 * respostas já aparecem no painel do Netlify, em Site → Forms.
 *
 * Se um dia vocês quiserem um backend próprio (ex: para automações,
 * WhatsApp API, planilha etc.), a pasta /server tem um backend leve
 * pronto — é só publicá-lo em algum serviço (Railway, Render...) e
 * colocar a URL dele em RADAR_API_BASE_URL abaixo. Com isso configurado,
 * os formulários passam a usar esse backend em vez do Netlify Forms.
 * ------------------------------------------------------------
 */

// Deixe null para usar o Netlify Forms (padrão, não exige nada extra).
// Ou troque por uma URL real (ex: "https://seu-backend.up.railway.app")
// depois de publicar a pasta /server em algum serviço.
const RADAR_API_BASE_URL = null;

async function radarApiPost(path, payload) {
  const res = await fetch(`${RADAR_API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  let data = {};
  try { data = await res.json(); } catch { /* resposta sem corpo JSON */ }
  if (!res.ok || data.ok === false) {
    throw new Error(data.erro || 'Não foi possível enviar agora.');
  }
  return data;
}

/** Envio nativo via Netlify Forms — funciona automaticamente após o deploy no Netlify. */
async function netlifyFormPost(formName, data) {
  const body = new URLSearchParams({ 'form-name': formName, ...data }).toString();
  const res = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) throw new Error('Não foi possível enviar agora.');
}

/**
 * Dispara um evento anônimo de uso (ex: moldura gerada). Só funciona se um
 * backend próprio estiver configurado em RADAR_API_BASE_URL — o Netlify
 * Forms não serve para esse tipo de evento avulso, então sem backend
 * configurado essa função simplesmente não faz nada (não quebra o site).
 */
function radarTrackEvent(tipo, meta) {
  if (!RADAR_API_BASE_URL) return;
  radarApiPost('/api/eventos', { tipo, meta }).catch(() => { /* tracking é best-effort */ });
}

function formToObject(form) {
  const obj = {};
  new FormData(form).forEach((v, k) => {
    if (k === 'form-name') return; // campo interno do Netlify, não faz parte dos dados
    obj[k] = v;
  });
  return obj;
}

function setFormStatus(el, message, kind) {
  if (!el) return;
  el.textContent = message;
  el.classList.remove('is-success', 'is-error');
  if (kind) el.classList.add(kind === 'success' ? 'is-success' : 'is-error');
}

/**
 * Conecta um <form> ao envio (backend próprio, se configurado; senão
 * Netlify Forms). Em caso de erro/indisponibilidade, usa fallbackHref
 * (ex: link de WhatsApp) como alternativa pro usuário não ficar sem saída.
 */
function wireForm({ formId, statusId, endpoint, successMessage, fallbackHref, fallbackLabel }) {
  const form = document.getElementById(formId);
  const status = document.getElementById(statusId);
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const data = formToObject(form);

    // honeypot: se o campo-armadilha veio preenchido, finge sucesso e não envia nada
    if (data.website) {
      setFormStatus(status, successMessage, 'success');
      form.reset();
      return;
    }

    if (btn) btn.disabled = true;
    setFormStatus(status, 'Enviando...', null);

    try {
      if (RADAR_API_BASE_URL) {
        await radarApiPost(endpoint, data);
      } else {
        await netlifyFormPost(form.getAttribute('name') || formId, data);
      }
      setFormStatus(status, successMessage, 'success');
      form.reset();
    } catch (err) {
      const linkHtml = fallbackHref
        ? ` Tente pelo <a href="${fallbackHref}" target="_blank" rel="noopener">${fallbackLabel || 'WhatsApp'}</a>.`
        : '';
      if (status) {
        status.innerHTML = `Não conseguimos enviar agora.${linkHtml}`;
        status.classList.remove('is-success');
        status.classList.add('is-error');
      }
    } finally {
      if (btn) btn.disabled = false;
    }
  });
}

document.addEventListener('radar:content-ready', (e) => {
  const links = (e.detail && e.detail.links) || {};
  wireForm({
    formId: 'formVoluntario',
    statusId: 'volStatus',
    endpoint: '/api/voluntarios',
    successMessage: 'Recebemos seus dados! Em breve a coordenação entra em contato. 🙌',
    fallbackHref: links.grupoVoluntariosWhatsapp,
    fallbackLabel: 'grupo do WhatsApp',
  });
  wireForm({
    formId: 'formContato',
    statusId: 'ctStatus',
    endpoint: '/api/contato',
    successMessage: 'Mensagem enviada! Vamos responder o quanto antes.',
    fallbackHref: links.grupoVoluntariosWhatsapp,
    fallbackLabel: 'nosso WhatsApp',
  });
});
