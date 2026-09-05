# Agenda — como editar você mesmo, pelo site

Dá para adicionar, editar e remover eventos da agenda direto pelo
navegador, sem precisar mexer em código nem pedir para um desenvolvedor.
Isso é feito por um pequeno script PHP (`api/agenda.php`) que guarda os
eventos em um arquivo (`data/agenda-eventos.json`) dentro da própria
hospedagem HostGator — não precisa de banco de dados nem de nenhum
serviço externo.

## 1. A senha de administrador já vem configurada

A senha (token) que protege a edição da agenda já vem pronta neste
pacote, no arquivo `api/config.php`:

```
agendadoradar2026
```

É essa senha que você vai digitar para entrar em `admin-agenda.html`.
Guarde-a em lugar seguro e compartilhe só com quem realmente precisa
editar a agenda.

**Quer trocar a senha?** Abra `api/config.php` pelo Gerenciador de
Arquivos da HostGator (botão **Edit**/Editar), troque o texto entre
aspas simples na linha abaixo e salve:

```php
define('ADMIN_TOKEN', 'agendadoradar2026');
```

A alteração já vale na hora — não precisa reiniciar nada nem esperar
deploy. A senha antiga para de funcionar assim que você salvar a nova.

## 2. Ajuste as permissões da pasta `data/` (só na primeira vez)

Para o PHP conseguir gravar as alterações da agenda, a pasta `data/`
precisa de permissão de escrita:

1. No Gerenciador de Arquivos da HostGator, clique com o botão direito
   na pasta `data/` → **Permissions** (Permissões).
2. Defina **755**. Se ao tentar salvar um evento aparecer erro de
   "não foi possível salvar", tente **775** em vez de 755 (alguns
   servidores exigem isso).
3. Repita para o arquivo `data/agenda-eventos.json`, se necessário
   (permissão **644** ou **664**).

## 3. Acessar a página de edição

Acesse, no navegador:

```
https://SEU-DOMINIO.com.br/admin-agenda.html
```

(troque `SEU-DOMINIO.com.br` pelo domínio real do site)

Digite a senha `agendadoradar2026` (ou a que você tiver configurado) e
clique em **Entrar**. Essa página não aparece em nenhum menu do site
(só quem tem o link consegue chegar nela), e também não é indexada
pelo Google (`noindex, nofollow`).

## 4. Adicionar, editar e remover eventos

- **Adicionar**: preencha o formulário no topo da página e clique em
  "Adicionar evento".
- **Editar**: clique em "Editar" no evento desejado, o formulário é
  preenchido automaticamente — altere o que quiser e clique em "Salvar
  alterações".
- **Remover**: clique em "Excluir" no evento desejado (pede confirmação).

Qualquer mudança aparece em `agenda.html` do site em poucos segundos —
não precisa reenviar nenhum arquivo nem esperar deploy.

## Como funciona por trás dos panos

- Os eventos ficam salvos em `data/agenda-eventos.json`, um arquivo
  de texto simples dentro da própria hospedagem.
- `agenda.html` busca a lista atual chamando `/api/agenda.php` por
  `GET` (rota pública, só leitura).
- `admin-agenda.html` chama a mesma API, mas para criar/editar/excluir
  ela exige o cabeçalho `X-Admin-Token` com a senha certa — por isso
  a senha do passo 1 é obrigatória.
- O arquivo `data/.htaccess` impede que qualquer pessoa abra
  `agenda-eventos.json` direto pelo navegador; só o `api/agenda.php`
  (rodando no servidor) consegue lê-lo e gravá-lo. O `api/.htaccess`
  faz o mesmo com `api/config.php`, onde fica a senha.

## Problemas comuns

- **"Token inválido" mesmo com a senha certa**: confira se você
  copiou a senha exatamente como está em `api/config.php` (sem
  espaços extras antes/depois) e se está usando maiúsculas/minúsculas
  certinho — a senha diferencia maiúsculas de minúsculas.
- **"Não foi possível salvar" ao adicionar/editar/excluir um evento**:
  quase sempre é permissão de pasta — revise o passo 2 acima (a pasta
  `data/` e o arquivo `agenda-eventos.json` precisam ter permissão de
  escrita para o PHP).
- **A agenda não carrega no site**: confira se a pasta `api/` (com
  `agenda.php` e `config.php`) e a pasta `data/` (com
  `agenda-eventos.json`) foram realmente enviadas para dentro de
  `public_html` na HostGator — sem elas a API não existe e a página
  mostra "não foi possível carregar".
- **Perdi a senha**: basta editar `api/config.php` pelo Gerenciador de
  Arquivos e colocar uma senha nova na linha `define('ADMIN_TOKEN',
  ...)` — a senha antiga para de funcionar assim que você salvar.
