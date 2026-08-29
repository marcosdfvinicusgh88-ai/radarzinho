# Daniel Radar 70.000 — Site da Campanha

Site oficial da campanha de Daniel Radar a deputado distrital (AVANTE, 70.000)
pelo Distrito Federal — Eleições 2026.

**100% HTML, CSS e JavaScript puro.** Sem backend, sem build, sem Firebase,
sem painel administrativo. Todo o conteúdo do site vive em arquivos de dados
dentro de `data/` e as páginas leem esses arquivos diretamente.

## Como está organizado

```
index.html              → página inicial (quem sou, bandeiras, compromissos,
                           notícias, participe, redes sociais)
fotos.html               → "Encontre sua foto" — álbuns de eventos por data/local
figurinhas.html          → pacote de figurinhas oficiais para WhatsApp
moldura.html             → moldura de apoio para foto de perfil (3 opções)
privacidade.html         → política de privacidade da moldura

data/content.js          → TODO o conteúdo de texto do site (edite aqui)
data/moldura-config.js   → as 3 molduras oficiais disponíveis na ferramenta

assets/css/style.css        → visual geral do site
assets/css/moldura-tool.css → visual só da ferramenta de moldura
assets/js/main.js           → lê content.js e injeta nas páginas
assets/js/moldura-tool.js   → lógica da ferramenta de moldura (canvas)
assets/js/lightbox.js       → visualizador de foto em tela cheia

assets/img/molduras/     → as 3 artes oficiais de moldura (PNG 1254×1254)
assets/img/figurinhas/   → as figurinhas oficiais (PNG 512×512, fundo transparente)
assets/img/fotos/        → onde entram os álbuns de fotos de eventos (crie uma
                            subpasta por evento)
downloads/               → arquivos .zip prontos para download (ex.: pacote
                            completo de figurinhas)

robots.txt, sitemap.xml  → arquivos padrão para mecanismos de busca
```

## Como atualizar o conteúdo

Não existe painel administrativo. Para mudar qualquer texto, número,
proposta, link de rede social, telefone ou notícia do site, edite os
valores dentro de `data/content.js` e salve o arquivo. Nenhum build é
necessário.

### Molduras de apoio
As 3 molduras oficiais ficam em `assets/img/molduras/` e são listadas em
`data/moldura-config.js`. Para adicionar uma nova opção, salve o PNG
1254×1254 (com o miolo transparente) nessa pasta e acrescente um item no
array `molduras`.

### Figurinhas
As figurinhas oficiais ficam em `assets/img/figurinhas/` (PNG 512×512,
fundo transparente) e são listadas no array `figurinhas` de
`data/content.js`. Para trocar o pacote completo (.zip) disponível para
download em `downloads/`, gere um novo .zip com as imagens atuais dessa
pasta e substitua o arquivo — o nome/link fica em `pacoteFigurinhasZip`.
Como não existe integração oficial de "1 clique" com o WhatsApp (a Meta
não permite isso para sites comuns), a página ensina o visitante a
importar as figurinhas baixadas usando um app gratuito de terceiros
("Sticker Maker", disponível na Play Store e na App Store).

### Encontre sua foto (álbuns de eventos)
Cada evento vira um "álbum" no array `albunsFotos` de `data/content.js`:

```js
{
  id: "caminhada-santa-maria-2026-09-01",
  titulo: "Caminhada em Santa Maria",
  local: "Santa Maria - DF",
  data: "01/09/2026",
  capa: "assets/img/fotos/caminhada-santa-maria-2026-09-01/capa.jpg",
  fotos: [
    { src: "assets/img/fotos/caminhada-santa-maria-2026-09-01/001.jpg", legenda: "" },
    { src: "assets/img/fotos/caminhada-santa-maria-2026-09-01/002.jpg", legenda: "" }
  ]
}
```

Crie uma subpasta em `assets/img/fotos/` com as fotos daquele dia, adicione
o objeto do álbum acima e ele aparece automaticamente na página — com
busca por nome do evento, data ou cidade, e um botão de download em cada
foto.

## Como testar localmente

Como o site não usa módulos ES nem `fetch`, basta abrir `index.html`
diretamente no navegador (duplo clique) — funciona até offline, sem
precisar de nenhum servidor local.

## Como publicar

Qualquer hospedagem de arquivos estáticos serve: Netlify, Vercel, GitHub
Pages, Cloudflare Pages etc. Basta enviar a pasta inteira — não há passo
de build.

**Netlify (arrastar e soltar):**
1. Acesse [app.netlify.com](https://app.netlify.com) e crie uma conta gratuita.
2. Arraste a pasta inteira do projeto para a área de deploy.
3. Em **Site settings → Change site name**, escolha o endereço desejado.
