<?php
/**
 * Configuração da API da Agenda — Daniel Radar 70.000
 * ------------------------------------------------------------
 * Este arquivo guarda a senha (token) que protege a edição da agenda
 * em admin-agenda.html. Esta pasta (api/) já vem bloqueada para acesso
 * direto pelo navegador (ver .htaccess), então só o próprio agenda.php
 * consegue ler este arquivo — mesmo assim, evite compartilhar o conteúdo
 * dele com qualquer pessoa fora da equipe da campanha.
 *
 * Para trocar a senha no futuro, basta editar o valor abaixo e salvar.
 * Não precisa reiniciar nada — a alteração já vale na próxima tentativa
 * de login em admin-agenda.html.
 */

define('ADMIN_TOKEN', 'agendadoradar2026');
