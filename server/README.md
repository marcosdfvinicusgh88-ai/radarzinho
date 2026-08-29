# Backend — Daniel Radar 70.000 (opcional)

⚠️ **Este backend é opcional.** Por padrão, o site usa o **Netlify Forms**
(recurso nativo do Netlify) para os formulários de voluntário e contato —
não precisa de nada nesta pasta para o site funcionar. Veja o `README.md`
na raiz do projeto para o passo a passo de publicação.

Use este backend só se quiser algo que o Netlify Forms não oferece, como
integração automática com WhatsApp/planilhas, ou um painel próprio de
estatísticas de eventos (`/api/eventos`, ex: quantas molduras foram
geradas).

Backend **leve**: um único arquivo Express (`server.js`), sem banco de dados
externo. Os dados ficam salvos em JSON dentro de `server/data/`.

## Como ativar (depois de publicado)

1. Publique esta pasta em algum serviço que rode Node (Railway, Render, um
   VPS...) — veja "Colocando no ar" mais abaixo.
2. Abra `assets/js/api.js` na raiz do site e troque:
   ```js
   const RADAR_API_BASE_URL = null;
   ```
   por:
   ```js
   const RADAR_API_BASE_URL = "https://seu-backend.up.railway.app";
   ```
3. Suba essa alteração pro GitHub — o Netlify publica a versão nova e os
   formulários passam a usar o seu backend em vez do Netlify Forms.

## Por que assim?

O site continua 100% estático (`index.html`, `fotos.html` etc. podem ser
hospedados de graça em qualquer lugar — Vercel, Netlify, GitHub Pages). Esse
backend só existe para as poucas coisas que um site estático não consegue
fazer sozinho:

- Guardar quem se cadastrou como voluntário
- Guardar mensagens de contato
- Contar eventos simples (ex: quantas molduras foram geradas)
- Um painel `/admin` bem simples para a equipe ver esses dados

Se um dia o volume crescer muito ou vocês quiserem relatórios mais robustos,
dá para trocar os arquivos JSON por um banco de verdade (Postgres, SQLite
etc.) sem mudar as rotas — é só trocar as funções `readJSON`/`writeJSON`.

## Rodando localmente

```bash
cd server
cp .env.example .env      # depois edite o ADMIN_TOKEN dentro do .env
npm install
npm start                 # sobe em http://localhost:3001
```

Teste rápido:

```bash
curl http://localhost:3001/api/health
```

## Rotas

| Método | Rota                | O que faz                                             |
|--------|----------------------|--------------------------------------------------------|
| GET    | `/api/health`        | Verifica se o servidor está no ar                       |
| POST   | `/api/voluntarios`   | Cadastra um voluntário (`nome`, `telefone`, `email`, `bairro`, `mensagem`) |
| POST   | `/api/contato`       | Envia uma mensagem de contato (`nome`, `email`, `assunto`, `mensagem`) |
| POST   | `/api/eventos`       | Registra um evento anônimo (`tipo`, `meta`)             |
| GET    | `/api/stats`         | Contadores públicos (sem dados pessoais)                |
| GET    | `/admin?token=...`   | Painel de leitura, protegido pelo `ADMIN_TOKEN`         |

Todas as rotas de formulário têm limite de 20 requisições a cada 15 minutos
por IP, e um campo-armadilha (`website`) para descartar bots silenciosamente.

## Colocando no ar (deploy)

Qualquer serviço que rode Node funciona. Sugestões simples:

- **Railway / Render**: aponte para a pasta `server/`, comando de start
  `npm start`, configure as variáveis de ambiente do `.env.example` no painel
  do serviço (nunca suba o `.env` para o Git).
- **VPS próprio**: rode com `pm2 start server.js --name radar-backend` para
  manter o processo vivo.

⚠️ Depois do deploy, atualize `FRONTEND_ORIGIN` no `.env` com o domínio real
do site, e troque a URL da API no arquivo `assets/js/api.js` do site.

## Backup dos dados

Os arquivos em `server/data/*.json` **são** o banco de dados. Faça backup
periódico dessa pasta (ex: um cron simples copiando para outro lugar, ou
sincronizando com o Google Drive/S3).
