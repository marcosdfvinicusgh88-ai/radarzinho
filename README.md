# Daniel Radar 70.000 — Site da Campanha

Site oficial da campanha de Daniel Radar a deputado distrital (AVANTE, 70.000)
pelo Distrito Federal — Eleições 2026.

**Site estático (HTML, CSS e JavaScript puro).** Não precisa de build nem de
instalar nada para rodar. Os formulários usam o **Netlify Forms**, então
funcionam automaticamente assim que o site é publicado no Netlify — sem
precisar de backend.

---

## 🚀 Publicar (GitHub → Netlify)

### 1. Suba este projeto para o GitHub
```bash
cd radar70000-site
git init
git add .
git commit -m "Site da campanha Daniel Radar 70.000"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
git push -u origin main
```
(Ou, se preferir sem terminal: crie um repositório novo em
[github.com/new](https://github.com/new) e arraste todos os arquivos desta
pasta pela interface web do GitHub, em "Add file → Upload files".)

### 2. Conecte o repositório ao Netlify
1. Acesse [app.netlify.com](https://app.netlify.com) e entre com sua conta.
2. Clique em **Add new site → Import an existing project**.
3. Escolha **GitHub** e autorize o acesso, depois selecione este repositório.
4. Configurações de build — deixe como está, elas já vêm prontas do arquivo
   `netlify.toml` deste projeto:
   - **Build command:** (vazio)
   - **Publish directory:** `.`
5. Clique em **Deploy site**. Em menos de um minuto o site já está no ar,
   com uma URL do tipo `nome-aleatorio.netlify.app`.

### 3. Ative os formulários (1 clique)
O Netlify detecta os formulários (`voluntario` e `contato`) automaticamente
no primeiro deploy, mas a **notificação por e-mail** precisa ser ligada uma
vez:
1. No painel do site, vá em **Forms**.
2. Você já deve ver os formulários `voluntario` e `contato` listados —
   clique em cada um → **Settings and usage → Add notification → Email
   notification** e coloque o e-mail da coordenação da campanha.

Pronto — a partir daí, toda vez que alguém preencher os formulários do
site, a resposta aparece em **Site → Forms** no painel do Netlify, e a
coordenação recebe um e-mail avisando.

### 4. (Opcional) Domínio próprio
Em **Domain settings → Add a domain**, adicione o domínio da campanha (ex:
`danielradar70000.com.br`) e siga as instruções de DNS mostradas na tela.

### 5. Próximos deploys
A partir daqui, qualquer alteração que você enviar para o GitHub (`git push`)
publica automaticamente uma nova versão do site no Netlify — não precisa
repetir os passos acima.

---

## Estrutura do projeto

```
index.html               → página inicial (quem sou, bandeiras, compromissos,
                            notícias, participe, formulários, redes sociais)
agenda.html               → agenda de eventos (próximos / já realizados)
imprensa.html             → kit de imprensa, ficha técnica e cobertura na mídia
doacoes.html               → informações sobre doação (redireciona ao canal oficial)
fotos.html                 → "Encontre sua foto" — álbuns de eventos por data/local
figurinhas.html             → pacote de figurinhas oficiais para WhatsApp
moldura.html                → moldura de apoio para foto de perfil
privacidade.html            → política de privacidade da moldura
404.html                    → página de erro personalizada

data/content.js             → TODO o conteúdo de texto do site (edite aqui)
data/moldura-config.js      → as molduras oficiais disponíveis na ferramenta

assets/css/style.css         → visual geral do site
assets/css/moldura-tool.css  → visual só da ferramenta de moldura
assets/js/main.js            → lê content.js e injeta nas páginas
assets/js/api.js             → envio dos formulários (Netlify Forms)
assets/js/moldura-tool.js    → lógica da ferramenta de moldura (canvas)
assets/js/lightbox.js        → visualizador de foto em tela cheia

assets/img/molduras/      → artes oficiais de moldura (PNG 1254×1254)
assets/img/figurinhas/    → figurinhas oficiais (PNG 512×512, fundo transparente)
assets/img/fotos/         → álbuns de fotos de eventos (uma subpasta por evento)
assets/img/perfil/        → fotos oficiais usadas no hero e em "Quem sou"

downloads/                → arquivos .zip para download (figurinhas, kit de imprensa)

server/                   → backend leve OPCIONAL — só necessário se vocês
                            quiserem um backend próprio no lugar do Netlify
                            Forms (ver server/README.md)

netlify.toml, .gitignore  → configuração de deploy e do Git
robots.txt, sitemap.xml   → arquivos padrão para mecanismos de busca
```

## Como atualizar o conteúdo

Não existe painel administrativo. Para mudar qualquer texto, número,
proposta, link de rede social, telefone, notícia, evento da agenda ou item
do kit de imprensa, edite os valores dentro de `data/content.js`, salve e
suba (`git push`) — o Netlify publica a nova versão automaticamente.

### Formulários (voluntário e contato)
Já funcionam assim que o site é publicado no Netlify — ver passo 3 acima.
As respostas ficam em **Site → Forms** no painel do Netlify. Se quiser
migrar para um backend próprio depois, veja `server/README.md`.

### Molduras de apoio
As molduras oficiais ficam em `assets/img/molduras/` e são listadas em
`data/moldura-config.js`. Para adicionar uma nova opção, salve o PNG
1254×1254 (com o miolo transparente) nessa pasta e acrescente um item no
array `molduras`.

### Figurinhas
As figurinhas oficiais ficam em `assets/img/figurinhas/` (PNG 512×512,
fundo transparente) e são listadas no array `figurinhas` de
`data/content.js`. Para trocar o pacote completo (.zip) disponível para
download em `downloads/`, gere um novo .zip com as imagens atuais dessa
pasta e substitua o arquivo — o nome/link fica em `pacoteFigurinhasZip`.

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

### Agenda de eventos
Array `agenda` em `data/content.js`. Use `status: "proximo"` ou
`status: "realizado"` em cada item.

### Kit de imprensa
Textos em `kitImprensa` (`data/content.js`). O arquivo `.zip` baixável fica
em `downloads/kit-imprensa-daniel-radar-70000.zip` — para atualizá-lo, gere
um novo zip com as fotos/textos atuais e substitua o arquivo.

### Doações
Link oficial e textos em `doacao` (`data/content.js`). **Importante:** o
site não processa pagamentos — só direciona ao canal oficial de arrecadação
da campanha, exigido pela legislação eleitoral. Configure `linkOficial` com
a URL real desse canal.

## Como testar localmente

Como o site não usa módulos ES, basta abrir `index.html` diretamente no
navegador (duplo clique). Os formulários não vão enviar de verdade fora do
Netlify (isso é esperado — o Netlify Forms só funciona depois do deploy),
mas o restante do site funciona normalmente, inclusive offline.

Se quiser simular um servidor local:
```bash
python3 -m http.server 8080
# depois abra http://localhost:8080
```
