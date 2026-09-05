# Daniel Radar 70.000 — Site da Campanha

Site oficial da campanha de Daniel Radar a deputado distrital (AVANTE, 70.000)
pelo Distrito Federal — Eleições 2026.

**Site estático (HTML, CSS e JavaScript puro), hospedado na HostGator.**
Não precisa de build nem de instalar nada para o site em si funcionar.
O contato do site é feito por redirecionamento direto (WhatsApp/e-mail) —
não há formulários. A única parte "dinâmica" é a agenda de eventos, que
vocês mesmos editam pelo navegador (ver passo 3), usando um pequeno
script PHP incluído neste pacote (`api/agenda.php`) — a HostGator já
roda PHP por padrão, não precisa configurar nada extra para isso.

---

## 🚀 Publicar na HostGator

### 1. Envie os arquivos pelo cPanel (Gerenciador de Arquivos) ou FTP

1. Acesse o **cPanel** da sua hospedagem HostGator.
2. Abra o **Gerenciador de Arquivos** (File Manager) e entre na pasta
   `public_html` (ou a subpasta do domínio, se for um addon domain).
3. Envie **todo o conteúdo desta pasta** (`radar70000-site/`, sem a pasta
   em si — os arquivos e pastas soltos: `index.html`, `assets/`, `api/`,
   `data/` etc.) direto para dentro de `public_html`.
   - Se preferir, envie o `.zip` completo pelo próprio Gerenciador de
     Arquivos e use a opção **Extract** (extrair) depois de enviado —
     é mais rápido que enviar arquivo por arquivo.
   - Também funciona por FTP (FileZilla, Cyberduck etc.) com os dados
     de acesso que a HostGator te enviou por e-mail.

### 2. Ajuste as permissões da pasta `data/`

A agenda de eventos precisa que o PHP consiga **gravar** um arquivo
dentro da pasta `data/`. Pelo Gerenciador de Arquivos da HostGator:

1. Clique com o botão direito na pasta `data/` → **Permissions**
   (Permissões).
2. Defina como **755** (ou **775**, se 755 não funcionar — depende da
   configuração do servidor). Marque para aplicar às subpastas se a
   opção aparecer.
3. Faça o mesmo, se necessário, no arquivo `data/agenda-eventos.json`
   (permissão **644** ou **664**).

Sem isso, a agenda funciona normalmente para leitura, mas adicionar,
editar ou remover eventos pode dar erro de "não foi possível salvar".

### 3. Configure a senha da Agenda (já vem pronta, mas pode trocar)

A página `admin-agenda.html` permite adicionar/editar/remover eventos
da agenda direto pelo navegador. A senha (token) já vem configurada
neste pacote:

```
agendadoradar2026
```

Para trocar essa senha no futuro, edite o arquivo `api/config.php`
(pelo Gerenciador de Arquivos da HostGator, botão **Edit**) e troque o
valor entre aspas na linha `define('ADMIN_TOKEN', '...');`. Salve — a
alteração já vale na hora, sem precisar reiniciar nada.

Passo a passo completo e como usar a página de edição:
**[`README-AGENDA.md`](./README-AGENDA.md)**.

### 4. Confirme o domínio

Se o domínio da campanha for outro (diferente de
`danielradar70000.com.br`), atualize as poucas menções a ele em
`sitemap.xml`, `robots.txt` e nas tags `canonical`/`og:url` de cada
página HTML (busque por `danielradar70000.com.br` no Gerenciador de
Arquivos ou em qualquer editor de texto).

### 5. Próximas atualizações

Diferente do Netlify (que publicava sozinho a cada `git push`), na
HostGator qualquer alteração precisa ser reenviada manualmente: edite
o arquivo localmente, depois suba o arquivo alterado pelo Gerenciador
de Arquivos ou FTP, substituindo o antigo. Não precisa reenviar o site
inteiro — só o(s) arquivo(s) que mudou(aram).

---

## Estrutura do projeto

```
index.html               → página inicial (quem sou, bandeiras, compromissos,
                            notícias, participe, formulários, redes sociais)
agenda.html               → agenda de eventos (próximos / já realizados)
admin-agenda.html         → painel para você adicionar/editar/remover eventos
                            da agenda (ver README-AGENDA.md)
imprensa.html             → kit de imprensa, ficha técnica e cobertura na mídia
doacoes.html               → informações sobre doação (redireciona ao canal oficial)
fotos.html                 → "Encontre sua foto" — álbuns de eventos por data/local
figurinhas.html             → pacote de figurinhas oficiais para WhatsApp
moldura.html                → moldura de apoio para foto de perfil
privacidade.html            → política de privacidade da moldura
404.html                    → página de erro personalizada

data/content.js             → TODO o conteúdo de texto do site (edite aqui)
data/moldura-config.js      → as molduras oficiais disponíveis na ferramenta
data/agenda-eventos.json    → dados da agenda (gerido pela API, ver abaixo)

assets/css/style.css         → visual geral do site
assets/css/moldura-tool.css  → visual só da ferramenta de moldura
assets/js/main.js            → lê content.js e injeta nas páginas
assets/js/api.js             → tracking leve e opcional de eventos (downloads)
assets/js/moldura-tool.js    → lógica da ferramenta de moldura (canvas)
assets/js/lightbox.js        → visualizador de foto em tela cheia

assets/img/molduras/      → artes oficiais de moldura (PNG 1254×1254)
assets/img/figurinhas/    → figurinhas oficiais (PNG 512×512, fundo transparente)
assets/img/fotos/         → álbuns de fotos de eventos (uma subpasta por evento)
assets/img/perfil/        → fotos oficiais usadas no hero e em "Quem sou"

downloads/                → arquivos .zip para download (figurinhas, kit de imprensa)

api/agenda.php            → API PHP da agenda (lê/grava data/agenda-eventos.json)
api/config.php             → senha de administrador da agenda (ADMIN_TOKEN)
api/.htaccess               → bloqueia acesso direto ao config.php

robots.txt, sitemap.xml  → arquivos padrão para mecanismos de busca
```

## Como atualizar o conteúdo

Não existe painel administrativo para o conteúdo geral. Para mudar
qualquer texto, número, proposta, link de rede social, telefone,
notícia ou item do kit de imprensa, edite os valores dentro de
`data/content.js` (pelo Gerenciador de Arquivos → Edit, ou baixando,
editando localmente e reenviando) e salve — a alteração aparece assim
que o arquivo for atualizado no servidor.

### Contato (WhatsApp / e-mail)
O site não tem formulários — o card "Fale com a gente" e o botão "Entrar
no grupo de voluntários" são redirecionamentos diretos. Números e e-mail
ficam em `contato` (`data/content.js`).

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
A agenda **não é editada em `content.js`** — vocês mesmos adicionam,
editam e removem eventos direto pelo navegador, em `admin-agenda.html`.
Veja o passo a passo completo (incluindo a senha de administrador) em
**`README-AGENDA.md`**.

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
navegador (duplo clique). A agenda (`agenda.html` e `admin-agenda.html`)
depende do PHP (`api/agenda.php`), então só funciona de verdade com um
servidor PHP rodando — localmente ela vai mostrar "não foi possível
carregar". O restante do site funciona normalmente, inclusive offline.

Se quiser simular um servidor local com PHP (necessário para testar a
agenda antes de publicar):

```bash
php -S localhost:8080
# depois abra http://localhost:8080
```

(Sem PHP instalado, `python3 -m http.server 8080` também funciona, mas
aí a agenda não vai carregar — só o restante do site.)
