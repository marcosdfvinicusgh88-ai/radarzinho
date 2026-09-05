<?php
/**
 * API da Agenda — Daniel Radar 70.000 (versão HostGator / PHP)
 * ------------------------------------------------------------
 * Substitui a antiga função serverless do Netlify. Guarda os eventos
 * em um arquivo JSON simples (data/agenda-eventos.json) — não precisa
 * de banco de dados, funciona em qualquer hospedagem PHP comum como a
 * HostGator.
 *
 * Rotas (todas em /api/agenda.php):
 *   GET     -> lista todos os eventos (público, usado pelo site)
 *   POST    -> cria um evento novo               (precisa do token)
 *   PUT     -> edita um evento existente (por id) (precisa do token)
 *   DELETE  -> remove um evento (por id)          (precisa do token)
 *
 * A senha de administrador fica em api/config.php — troque lá se
 * precisar. Veja README-AGENDA.md para o passo a passo completo.
 * ------------------------------------------------------------
 */

require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');

$METODO = $_SERVER['REQUEST_METHOD'];
$ARQUIVO_DADOS = __DIR__ . '/../data/agenda-eventos.json';

// Eventos que já existiam no site antes dessa API existir — usados só
// para "semear" o arquivo na primeiríssima vez que a API roda.
$SEED_INICIAL = [
  [
    'id' => 'caminhada-santa-maria',
    'status' => 'proximo',
    'titulo' => 'Caminhada em Santa Maria',
    'data' => '6 de setembro de 2026',
    'horario' => '08h00',
    'local' => 'Praça Central de Santa Maria',
    'endereco' => 'Santa Maria, Brasília - DF',
    'descricao' => 'Caminhada pelas quadras centrais com conversa direta com moradores e lideranças comunitárias.',
    'mapaUrl' => 'https://www.google.com/maps/search/?api=1&query=Pra%C3%A7a+Central+de+Santa+Maria+DF',
  ],
  [
    'id' => 'carreata-gama',
    'status' => 'proximo',
    'titulo' => 'Carreata no Gama',
    'data' => '13 de setembro de 2026',
    'horario' => '15h00',
    'local' => 'Setor Central do Gama',
    'endereco' => 'Gama, Brasília - DF',
    'descricao' => 'Concentração de carros e motos com saída do Setor Central, reforçando o apoio à candidatura 70.000.',
    'mapaUrl' => 'https://www.google.com/maps/search/?api=1&query=Setor+Central+do+Gama+DF',
  ],
  [
    'id' => 'roda-conversa-recanto',
    'status' => 'proximo',
    'titulo' => 'Roda de conversa — saúde e mobilidade',
    'data' => '20 de setembro de 2026',
    'horario' => '19h30',
    'local' => 'Associação de Moradores do Recanto das Emas',
    'endereco' => 'Recanto das Emas, Brasília - DF',
    'descricao' => 'Encontro aberto para ouvir demandas de saúde e transporte público direto dos moradores da região.',
    'mapaUrl' => 'https://www.google.com/maps/search/?api=1&query=Recanto+das+Emas+DF',
  ],
  [
    'id' => 'convencao-avante',
    'status' => 'realizado',
    'titulo' => 'Convenção do Avante — candidatura oficializada',
    'data' => '1 de agosto de 2026',
    'horario' => '10h00',
    'local' => 'Convenção partidária',
    'endereco' => 'Distrito Federal',
    'descricao' => 'Homologação da candidatura de Daniel Radar a deputado distrital, com mais de 14 mil participantes.',
    'mapaUrl' => '',
  ],
];

function resposta($statusCode, $corpo) {
  http_response_code($statusCode);
  echo json_encode($corpo, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  exit;
}

function autorizado() {
  $headers = function_exists('getallheaders') ? getallheaders() : [];
  $token = null;
  foreach ($headers as $k => $v) {
    if (strtolower($k) === 'x-admin-token') { $token = $v; break; }
  }
  if ($token === null && isset($_SERVER['HTTP_X_ADMIN_TOKEN'])) {
    $token = $_SERVER['HTTP_X_ADMIN_TOKEN'];
  }
  return $token !== null && hash_equals(ADMIN_TOKEN, (string) $token);
}

function lerEventos($arquivo, $seed) {
  if (!file_exists($arquivo)) {
    salvarEventos($arquivo, $seed);
    return $seed;
  }
  $conteudo = @file_get_contents($arquivo);
  $dados = json_decode($conteudo, true);
  if (!is_array($dados)) {
    salvarEventos($arquivo, $seed);
    return $seed;
  }
  return $dados;
}

function salvarEventos($arquivo, $eventos) {
  $pasta = dirname($arquivo);
  if (!is_dir($pasta)) { @mkdir($pasta, 0755, true); }
  file_put_contents($arquivo, json_encode($eventos, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT), LOCK_EX);
}

function corpoRequisicao() {
  $raw = file_get_contents('php://input');
  $dados = json_decode($raw, true);
  return is_array($dados) ? $dados : [];
}

function slug($texto) {
  $texto = mb_strtolower($texto ?: 'evento', 'UTF-8');
  $texto = strtr($texto, [
    'á' => 'a', 'à' => 'a', 'ã' => 'a', 'â' => 'a', 'ä' => 'a',
    'é' => 'e', 'ê' => 'e', 'è' => 'e', 'ë' => 'e',
    'í' => 'i', 'ì' => 'i', 'î' => 'i', 'ï' => 'i',
    'ó' => 'o', 'ò' => 'o', 'õ' => 'o', 'ô' => 'o', 'ö' => 'o',
    'ú' => 'u', 'ù' => 'u', 'û' => 'u', 'ü' => 'u',
    'ç' => 'c', 'ñ' => 'n',
  ]);
  $texto = preg_replace('/[^a-z0-9]+/', '-', $texto);
  $texto = trim($texto, '-');
  return ($texto ?: 'evento') . '-' . base_convert((string) round(microtime(true) * 1000), 10, 36);
}

if ($METODO === 'OPTIONS') { resposta(204, (object) []); }

if ($METODO === 'GET') {
  $eventos = lerEventos($ARQUIVO_DADOS, $SEED_INICIAL);
  resposta(200, ['ok' => true, 'eventos' => array_values($eventos)]);
}

// POST, PUT e DELETE exigem o token de administrador
if (!autorizado()) {
  resposta(401, ['ok' => false, 'erro' => 'Token inválido ou ausente.']);
}

$body = corpoRequisicao();
$atuais = lerEventos($ARQUIVO_DADOS, $SEED_INICIAL);

if ($METODO === 'POST') {
  $novo = [
    'id' => slug($body['titulo'] ?? ''),
    'status' => (($body['status'] ?? '') === 'realizado') ? 'realizado' : 'proximo',
    'titulo' => mb_substr((string) ($body['titulo'] ?? ''), 0, 160, 'UTF-8'),
    'data' => mb_substr((string) ($body['data'] ?? ''), 0, 60, 'UTF-8'),
    'horario' => mb_substr((string) ($body['horario'] ?? ''), 0, 30, 'UTF-8'),
    'local' => mb_substr((string) ($body['local'] ?? ''), 0, 160, 'UTF-8'),
    'endereco' => mb_substr((string) ($body['endereco'] ?? ''), 0, 200, 'UTF-8'),
    'descricao' => mb_substr((string) ($body['descricao'] ?? ''), 0, 600, 'UTF-8'),
    'mapaUrl' => mb_substr((string) ($body['mapaUrl'] ?? ''), 0, 500, 'UTF-8'),
  ];
  if ($novo['titulo'] === '') {
    resposta(400, ['ok' => false, 'erro' => 'Informe ao menos o título do evento.']);
  }
  $atuais[] = $novo;
  salvarEventos($ARQUIVO_DADOS, $atuais);
  resposta(201, ['ok' => true, 'evento' => $novo]);
}

if ($METODO === 'PUT') {
  $id = $body['id'] ?? null;
  if (!$id) { resposta(400, ['ok' => false, 'erro' => 'Informe o id do evento.']); }
  $idx = null;
  foreach ($atuais as $i => $e) { if ($e['id'] === $id) { $idx = $i; break; } }
  if ($idx === null) { resposta(404, ['ok' => false, 'erro' => 'Evento não encontrado.']); }
  unset($body['id']);
  $atuais[$idx] = array_merge($atuais[$idx], $body);
  salvarEventos($ARQUIVO_DADOS, $atuais);
  resposta(200, ['ok' => true, 'evento' => $atuais[$idx]]);
}

if ($METODO === 'DELETE') {
  $id = $body['id'] ?? ($_GET['id'] ?? null);
  if (!$id) { resposta(400, ['ok' => false, 'erro' => 'Informe o id do evento.']); }
  $restantes = array_values(array_filter($atuais, fn($e) => $e['id'] !== $id));
  salvarEventos($ARQUIVO_DADOS, $restantes);
  resposta(200, ['ok' => true]);
}

resposta(405, ['ok' => false, 'erro' => 'Método não suportado.']);
