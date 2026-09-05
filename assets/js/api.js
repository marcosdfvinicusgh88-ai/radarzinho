/**
 * Tracking leve e opcional de eventos (ex: "moldura gerada", "figurinha
 * baixada"). O site não tem formulários — todo contato é feito por
 * redirecionamento direto (WhatsApp/e-mail), então este arquivo só cuida
 * dessa telemetria simples.
 * ------------------------------------------------------------
 * Por padrão RADAR_API_BASE_URL é null e a função não faz nada (não
 * quebra o site). Se um dia vocês publicarem o backend opcional que fica
 * em /server, basta colocar a URL dele aqui para os eventos passarem a
 * ser registrados.
 * ------------------------------------------------------------
 */
const RADAR_API_BASE_URL = null;

function radarTrackEvent(tipo, meta) {
  if (!RADAR_API_BASE_URL) return;
  fetch(`${RADAR_API_BASE_URL}/api/eventos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tipo, meta }),
  }).catch(() => { /* tracking é best-effort, nunca deve quebrar a página */ });
}
