/* ============================================================
   MOLDURA APP — lógica interativa (canvas + compartilhamento)
   Lê window.MOLDURA_CONFIG (data/moldura-config.js). 100% local:
   a foto do usuário nunca sai do navegador.
   ============================================================ */
(function () {
  const CONFIG = window.MOLDURA_CONFIG || { molduras: [] };

  const canvas = document.getElementById('canvas');
  if (!canvas) return; // página sem a ferramenta de moldura
  const ctx = canvas.getContext('2d');
  const quadro = document.getElementById('quadro');
  const placeholderVazio = document.getElementById('placeholderVazio');
  const carregandoOverlay = document.getElementById('carregandoOverlay');
  const inputArquivo = document.getElementById('inputArquivo');
  const uploadBox = document.getElementById('uploadBox');
  const btnEscolher = document.getElementById('btnEscolher');
  const btnBaixar = document.getElementById('btnBaixar');
  const btnWhatsapp = document.getElementById('btnWhatsapp');
  const btnTrocar = document.getElementById('btnTrocar');
  const zoomSlider = document.getElementById('zoom');
  const zoomValor = document.getElementById('zoomValor');
  const zoomMenos = document.getElementById('zoomMenos');
  const zoomMais = document.getElementById('zoomMais');
  const rotacaoValor = document.getElementById('rotacaoValor');
  const girarMenos = document.getElementById('girarMenos');
  const girarMais = document.getElementById('girarMais');
  const btnEspelhar = document.getElementById('btnEspelhar');
  const btnCentralizarRosto = document.getElementById('btnCentralizarRosto');
  const btnRestaurar = document.getElementById('btnRestaurar');
  const mensagemFeedback = document.getElementById('mensagemFeedback');
  const avisoConfig = document.getElementById('avisoConfig');
  const inputNome = document.getElementById('inputNome');
  const checkConsentimento = document.getElementById('checkConsentimento');
  const legendaTexto = document.getElementById('legendaTexto');
  const btnCopiarLegenda = document.getElementById('btnCopiarLegenda');
  const seletorMolduraOpcoes = document.getElementById('seletorMolduraOpcoes');
  const bannerBoasVindas = document.getElementById('bannerBoasVindas');
  const bannerBoasVindasTexto = document.getElementById('bannerBoasVindasTexto');
  const bannerBoasVindasFechar = document.getElementById('bannerBoasVindasFechar');
  const btnAltoContraste = document.getElementById('btnAltoContraste');
  const contadorEleicao = document.getElementById('contadorEleicao');
  const contadorEleicaoNumeros = document.getElementById('contadorEleicaoNumeros');
  const contadorDownloads = document.getElementById('contadorDownloads');
  const telaSucesso = document.getElementById('telaSucesso');
  const btnFecharSucesso = document.getElementById('btnFecharSucesso');
  const confeteCanvas = document.getElementById('confeteCanvas');

  const SIZE = CONFIG.tamanhoExportacao || 1254;
  canvas.width = SIZE;
  canvas.height = SIZE;

  const listaMolduras = (CONFIG.molduras && CONFIG.molduras.length) ? CONFIG.molduras : [];
  let molduraAtual = listaMolduras[0];

  let foto = null;
  let escala = 1;
  let rotacao = 0;
  let offsetX = 0, offsetY = 0;
  let espelhado = false;
  let arrastando = false;
  let ultimoX = 0, ultimoY = 0;

  function mostrarMensagem(texto, tipo) {
    mensagemFeedback.textContent = texto;
    mensagemFeedback.className = 'mensagem visivel ' + tipo;
  }
  function esconderMensagem() {
    mensagemFeedback.className = 'mensagem';
    mensagemFeedback.textContent = '';
  }
  function atualizarControlesTexto() {
    zoomValor.textContent = escala.toFixed(2) + 'x';
    rotacaoValor.textContent = Math.round(rotacao) + '°';
  }
  function atualizarBotoes() {
    const liberado = !!foto && checkConsentimento.checked;
    btnBaixar.disabled = !liberado;
    btnWhatsapp.style.display = foto ? 'flex' : 'none';
    btnWhatsapp.disabled = !liberado;
    btnWhatsapp.style.opacity = liberado ? '1' : '0.5';
    btnWhatsapp.style.pointerEvents = liberado ? 'auto' : 'none';
  }
  function atualizarLegenda() {
    legendaTexto.textContent = montarLegenda();
  }

  /* ---------- molduras: pré-carregamento + seletor com prévia ---------- */
  const framesCache = {};
  const miniCanvases = {};

  function precarregarMolduras() {
    listaMolduras.forEach((opcao) => {
      const img = new Image();
      img.onload = () => { framesCache[opcao.id] = img; desenharTudo(); };
      img.onerror = () => {
        avisoConfig.innerHTML = '<strong>Aviso:</strong> não foi possível carregar a moldura (<code>' + opcao.arquivo + '</code>).';
        avisoConfig.style.display = 'block';
      };
      img.src = opcao.arquivo;
    });
  }

  function montarSeletorMoldura() {
    if (!seletorMolduraOpcoes) return;
    seletorMolduraOpcoes.innerHTML = '';
    listaMolduras.forEach((opcao) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'opcao-moldura' + (opcao.id === molduraAtual.id ? ' selecionada' : '');
      item.setAttribute('aria-pressed', opcao.id === molduraAtual.id ? 'true' : 'false');

      const miniatura = document.createElement('span');
      miniatura.className = 'opcao-moldura-miniatura';
      const miniCanvas = document.createElement('canvas');
      miniCanvas.width = 220; miniCanvas.height = 220;
      miniatura.appendChild(miniCanvas);
      miniCanvases[opcao.id] = { canvas: miniCanvas, ctx: miniCanvas.getContext('2d') };

      const rotulo = document.createElement('span');
      rotulo.className = 'opcao-moldura-rotulo';
      rotulo.textContent = opcao.rotulo;

      item.appendChild(miniatura);
      item.appendChild(rotulo);
      item.addEventListener('click', () => {
        if (opcao.id === molduraAtual.id) return;
        molduraAtual = opcao;
        montarSeletorMoldura();
        desenharTudo();
        atualizarLegenda();
      });
      seletorMolduraOpcoes.appendChild(item);
    });
    desenharPreviasMolduras();
  }

  if (listaMolduras.length) {
    precarregarMolduras();
    montarSeletorMoldura();
  } else {
    avisoConfig.innerHTML = '<strong>Aviso de configuração:</strong> defina ao menos uma moldura em data/moldura-config.js.';
    avisoConfig.style.display = 'block';
  }

  /* ---------- desenho no canvas principal + miniaturas ---------- */
  function desenharFotoEmContexto(contexto, tamanho) {
    if (!foto) return;
    const escalaBase = Math.max(tamanho / foto.width, tamanho / foto.height);
    const escalaFinal = escalaBase * escala;
    const w = foto.width * escalaFinal;
    const h = foto.height * escalaFinal;
    const fator = tamanho / SIZE;
    const x = (tamanho - w) / 2 + offsetX * fator;
    const y = (tamanho - h) / 2 + offsetY * fator;

    contexto.save();
    contexto.translate(tamanho / 2, tamanho / 2);
    contexto.rotate(rotacao * Math.PI / 180);
    if (espelhado) contexto.scale(-1, 1);
    contexto.translate(-tamanho / 2, -tamanho / 2);
    contexto.drawImage(foto, x, y, w, h);
    contexto.restore();
  }
  function desenhar() {
    ctx.clearRect(0, 0, SIZE, SIZE);
    desenharFotoEmContexto(ctx, SIZE);
    const frameAtual = framesCache[molduraAtual.id];
    if (frameAtual) ctx.drawImage(frameAtual, 0, 0, SIZE, SIZE);
  }
  function desenharPreviasMolduras() {
    listaMolduras.forEach((opcao) => {
      const alvo = miniCanvases[opcao.id];
      if (!alvo) return;
      const MSIZE = alvo.canvas.width;
      alvo.ctx.clearRect(0, 0, MSIZE, MSIZE);
      desenharFotoEmContexto(alvo.ctx, MSIZE);
      const frameImg = framesCache[opcao.id];
      if (frameImg) alvo.ctx.drawImage(frameImg, 0, 0, MSIZE, MSIZE);
    });
  }
  function desenharTudo() { desenhar(); desenharPreviasMolduras(); }

  function limitarOffset() {
    if (!foto) return;
    const escalaBase = Math.max(SIZE / foto.width, SIZE / foto.height);
    const escalaFinal = escalaBase * escala;
    const w = foto.width * escalaFinal;
    const h = foto.height * escalaFinal;
    const maxX = Math.max(0, (w - SIZE) / 2);
    const maxY = Math.max(0, (h - SIZE) / 2);
    offsetX = Math.min(maxX, Math.max(-maxX, offsetX));
    offsetY = Math.min(maxY, Math.max(-maxY, offsetY));
  }

  function redimensionarSeNecessario(img) {
    const maiorLado = Math.max(img.width, img.height);
    const maxDim = CONFIG.maxDimensaoUpload || 1800;
    if (maiorLado <= maxDim) return img;
    const fator = maxDim / maiorLado;
    const c = document.createElement('canvas');
    c.width = Math.round(img.width * fator);
    c.height = Math.round(img.height * fator);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    return c;
  }

  /* ---------- upload de foto ---------- */
  function carregarArquivo(arquivo) {
    if (!arquivo) return;
    if (!arquivo.type.startsWith('image/')) {
      mostrarMensagem('Esse arquivo não é uma imagem. Envie uma foto em JPG, PNG ou WEBP.', 'erro');
      return;
    }
    carregandoOverlay.style.display = 'flex';
    const leitor = new FileReader();
    leitor.onerror = () => {
      carregandoOverlay.style.display = 'none';
      mostrarMensagem('Não foi possível ler essa foto. Tente novamente.', 'erro');
    };
    leitor.onload = (e) => {
      const img = new Image();
      img.onerror = () => {
        carregandoOverlay.style.display = 'none';
        mostrarMensagem('Não foi possível abrir essa imagem. Tente outro arquivo.', 'erro');
      };
      img.onload = () => {
        const menorLado = Math.min(img.width, img.height);
        foto = redimensionarSeNecessario(img);
        escala = 1; rotacao = 0; offsetX = 0; offsetY = 0; espelhado = false;
        zoomSlider.value = 100;
        btnEspelhar.classList.remove('ativo');
        atualizarControlesTexto();
        placeholderVazio.style.display = 'none';
        btnTrocar.style.display = 'block';
        quadro.classList.add('tem-foto');
        atualizarBotoes();
        if ('FaceDetector' in window) btnCentralizarRosto.style.display = 'inline-block';
        if (menorLado < (CONFIG.resolucaoMinimaAlerta || 700)) {
          mostrarMensagem('Essa foto está com resolução baixa — o resultado pode sair um pouco borrado. Se puder, use uma imagem maior.', 'aviso');
        } else {
          esconderMensagem();
        }
        carregandoOverlay.style.display = 'none';
        desenharTudo();
      };
      img.src = e.target.result;
    };
    leitor.readAsDataURL(arquivo);
  }

  btnEscolher.addEventListener('click', () => inputArquivo.click());
  btnTrocar.addEventListener('click', () => inputArquivo.click());
  inputArquivo.addEventListener('change', (e) => carregarArquivo(e.target.files[0]));
  uploadBox.addEventListener('dragover', (e) => { e.preventDefault(); uploadBox.classList.add('arrastando-arquivo'); });
  uploadBox.addEventListener('dragleave', () => uploadBox.classList.remove('arrastando-arquivo'));
  uploadBox.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadBox.classList.remove('arrastando-arquivo');
    carregarArquivo(e.dataTransfer.files[0]);
  });

  /* ---------- zoom e rotação ---------- */
  function definirZoom(novoValor) {
    const clamp = Math.min(300, Math.max(100, novoValor));
    zoomSlider.value = clamp;
    escala = clamp / 100;
    atualizarControlesTexto();
    limitarOffset(); desenharTudo();
  }
  function definirRotacao(novoValor) {
    let clamp = novoValor;
    if (clamp > 180) clamp -= 360;
    if (clamp < -180) clamp += 360;
    rotacao = clamp;
    atualizarControlesTexto();
    desenharTudo();
  }
  zoomSlider.addEventListener('input', () => definirZoom(parseInt(zoomSlider.value, 10)));
  zoomMenos.addEventListener('click', () => definirZoom(parseInt(zoomSlider.value, 10) - 10));
  zoomMais.addEventListener('click', () => definirZoom(parseInt(zoomSlider.value, 10) + 10));
  girarMenos.addEventListener('click', () => definirRotacao(rotacao - 15));
  girarMais.addEventListener('click', () => definirRotacao(rotacao + 15));

  btnEspelhar.addEventListener('click', () => {
    if (!foto) return;
    espelhado = !espelhado;
    btnEspelhar.classList.toggle('ativo', espelhado);
    desenharTudo();
  });

  btnCentralizarRosto.addEventListener('click', async () => {
    if (!foto || !('FaceDetector' in window)) return;
    try {
      const detector = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 1 });
      const rostos = await detector.detect(foto);
      if (!rostos.length) {
        mostrarMensagem('Não encontramos um rosto nessa foto. Ajuste manualmente arrastando a imagem.', 'aviso');
        return;
      }
      const caixa = rostos[0].boundingBox;
      const fx = caixa.x + caixa.width / 2;
      const fy = caixa.y + caixa.height / 2;
      const escalaBase = Math.max(SIZE / foto.width, SIZE / foto.height);
      const escalaFinal = escalaBase * escala;
      const w = foto.width * escalaFinal;
      const h = foto.height * escalaFinal;
      rotacao = 0;
      const fxFinal = espelhado ? (foto.width - fx) : fx;
      offsetX = SIZE / 2 - (SIZE - w) / 2 - fxFinal * escalaFinal;
      offsetY = SIZE / 2 - (SIZE - h) / 2 - fy * escalaFinal;
      limitarOffset();
      atualizarControlesTexto();
      desenharTudo();
      mostrarMensagem('Rosto centralizado automaticamente!', 'sucesso');
    } catch (erro) {
      mostrarMensagem('Não foi possível detectar o rosto automaticamente neste navegador.', 'erro');
    }
  });

  btnRestaurar.addEventListener('click', () => {
    offsetX = 0; offsetY = 0;
    espelhado = false;
    btnEspelhar.classList.remove('ativo');
    definirZoom(100);
    definirRotacao(0);
  });

  checkConsentimento.addEventListener('change', atualizarBotoes);
  inputNome.addEventListener('input', atualizarLegenda);

  /* ---------- arrastar a foto: mouse, toque e teclado ---------- */
  quadro.addEventListener('mousedown', (e) => {
    if (!foto) return;
    arrastando = true;
    quadro.classList.add('arrastando');
    ultimoX = e.clientX; ultimoY = e.clientY;
  });
  window.addEventListener('mousemove', (e) => {
    if (!arrastando) return;
    const fatorEscala = SIZE / quadro.getBoundingClientRect().width;
    offsetX += (e.clientX - ultimoX) * fatorEscala;
    offsetY += (e.clientY - ultimoY) * fatorEscala;
    ultimoX = e.clientX; ultimoY = e.clientY;
    limitarOffset(); desenharTudo();
  });
  window.addEventListener('mouseup', () => { arrastando = false; quadro.classList.remove('arrastando'); });

  quadro.addEventListener('touchstart', (e) => {
    if (!foto || e.touches.length !== 1) return;
    arrastando = true;
    quadro.classList.add('arrastando');
    ultimoX = e.touches[0].clientX; ultimoY = e.touches[0].clientY;
  }, { passive: true });
  quadro.addEventListener('touchmove', (e) => {
    if (!arrastando || e.touches.length !== 1) return;
    e.preventDefault();
    const fatorEscala = SIZE / quadro.getBoundingClientRect().width;
    offsetX += (e.touches[0].clientX - ultimoX) * fatorEscala;
    offsetY += (e.touches[0].clientY - ultimoY) * fatorEscala;
    ultimoX = e.touches[0].clientX; ultimoY = e.touches[0].clientY;
    limitarOffset(); desenharTudo();
  }, { passive: false });
  quadro.addEventListener('touchend', () => { arrastando = false; quadro.classList.remove('arrastando'); });
  quadro.addEventListener('touchcancel', () => { arrastando = false; quadro.classList.remove('arrastando'); });

  quadro.addEventListener('keydown', (e) => {
    if (!foto) return;
    const passo = 20;
    switch (e.key) {
      case 'ArrowUp': offsetY -= passo; break;
      case 'ArrowDown': offsetY += passo; break;
      case 'ArrowLeft': offsetX -= passo; break;
      case 'ArrowRight': offsetX += passo; break;
      case '+': case '=': e.preventDefault(); definirZoom(parseInt(zoomSlider.value, 10) + 10); return;
      case '-': case '_': e.preventDefault(); definirZoom(parseInt(zoomSlider.value, 10) - 10); return;
      default: return;
    }
    e.preventDefault();
    limitarOffset();
    desenharTudo();
  });

  /* ---------- legenda sugerida ---------- */
  function montarLegenda() {
    const nome = inputNome.value.trim();
    let legenda = (molduraAtual && molduraAtual.legenda) ? molduraAtual.legenda : CONFIG.legendaCompartilhamento;
    if (nome) legenda += ' (via ' + nome + ')';
    return legenda;
  }
  btnCopiarLegenda.addEventListener('click', async () => {
    const texto = legendaTexto.textContent;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(texto);
      } else {
        const area = document.createElement('textarea');
        area.value = texto;
        area.style.position = 'fixed'; area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        document.execCommand('copy');
        document.body.removeChild(area);
      }
      const original = btnCopiarLegenda.textContent;
      btnCopiarLegenda.textContent = 'Legenda copiada!';
      btnCopiarLegenda.classList.add('copiado');
      setTimeout(() => {
        btnCopiarLegenda.textContent = original;
        btnCopiarLegenda.classList.remove('copiado');
      }, 2000);
    } catch (erro) {
      mostrarMensagem('Não foi possível copiar automaticamente. Selecione o texto da legenda manualmente.', 'erro');
    }
  });

  /* ---------- contador de downloads local ---------- */
  const CHAVE_CONTADOR = 'radar70000_downloads_moldura';
  function lerContadorDownloads() {
    try { return parseInt(window.localStorage.getItem(CHAVE_CONTADOR), 10) || 0; }
    catch (erro) { return 0; }
  }
  function registrarDownload() {
    try {
      const total = lerContadorDownloads() + 1;
      window.localStorage.setItem(CHAVE_CONTADOR, String(total));
      atualizarContadorDownloadsTexto(total);
    } catch (erro) { /* localStorage indisponível — sem problema */ }
    if (typeof radarTrackEvent === 'function') {
      radarTrackEvent('moldura_gerada', { estilo: (molduraAtual && molduraAtual.id) || null });
    }
  }
  function atualizarContadorDownloadsTexto(total) {
    if (!contadorDownloads) return;
    if (total <= 0) { contadorDownloads.style.display = 'none'; return; }
    contadorDownloads.style.display = 'block';
    contadorDownloads.innerHTML = 'Você já baixou a moldura <strong>' + total + '</strong> ' + (total === 1 ? 'vez' : 'vezes') + ' neste aparelho';
  }
  atualizarContadorDownloadsTexto(lerContadorDownloads());

  /* ---------- tela comemorativa com confete ---------- */
  const confeteCtx = confeteCanvas.getContext('2d');
  let particulasConfete = [];
  let animacaoConfeteId = null;
  const CORES_CONFETE = ['#159A2E', '#F0C33E', '#CFEA1E', '#ffffff', '#0B6E12'];

  function redimensionarConfeteCanvas() {
    confeteCanvas.width = window.innerWidth;
    confeteCanvas.height = window.innerHeight;
  }
  function criarParticulasConfete() {
    const quantidade = 140;
    particulasConfete = [];
    for (let i = 0; i < quantidade; i++) {
      particulasConfete.push({
        x: Math.random() * confeteCanvas.width,
        y: -20 - Math.random() * confeteCanvas.height * 0.5,
        largura: 6 + Math.random() * 6,
        altura: 8 + Math.random() * 8,
        cor: CORES_CONFETE[Math.floor(Math.random() * CORES_CONFETE.length)],
        velocidadeY: 2 + Math.random() * 3,
        velocidadeX: (Math.random() - 0.5) * 2,
        rotacao: Math.random() * 360,
        velocidadeRotacao: (Math.random() - 0.5) * 10
      });
    }
  }
  function animarConfete() {
    confeteCtx.clearRect(0, 0, confeteCanvas.width, confeteCanvas.height);
    let algumaAtiva = false;
    particulasConfete.forEach((p) => {
      p.x += p.velocidadeX; p.y += p.velocidadeY; p.rotacao += p.velocidadeRotacao;
      if (p.y < confeteCanvas.height + 20) algumaAtiva = true;
      confeteCtx.save();
      confeteCtx.translate(p.x, p.y);
      confeteCtx.rotate(p.rotacao * Math.PI / 180);
      confeteCtx.fillStyle = p.cor;
      confeteCtx.fillRect(-p.largura / 2, -p.altura / 2, p.largura, p.altura);
      confeteCtx.restore();
    });
    if (algumaAtiva) animacaoConfeteId = requestAnimationFrame(animarConfete);
    else confeteCtx.clearRect(0, 0, confeteCanvas.width, confeteCanvas.height);
  }
  function mostrarTelaSucesso() {
    redimensionarConfeteCanvas();
    criarParticulasConfete();
    if (animacaoConfeteId) cancelAnimationFrame(animacaoConfeteId);
    animarConfete();
    telaSucesso.style.display = 'flex';
    requestAnimationFrame(() => telaSucesso.classList.add('visivel'));
  }
  function esconderTelaSucesso() {
    telaSucesso.classList.remove('visivel');
    telaSucesso.style.display = 'none';
    if (animacaoConfeteId) cancelAnimationFrame(animacaoConfeteId);
    confeteCtx.clearRect(0, 0, confeteCanvas.width, confeteCanvas.height);
  }
  btnFecharSucesso.addEventListener('click', esconderTelaSucesso);
  telaSucesso.addEventListener('click', (e) => { if (e.target === telaSucesso) esconderTelaSucesso(); });
  window.addEventListener('resize', () => { if (telaSucesso.classList.contains('visivel')) redimensionarConfeteCanvas(); });

  /* ---------- download e compartilhamento ---------- */
  function nomeArquivoAtual() { return (molduraAtual && molduraAtual.nomeArquivo) || 'moldura.png'; }

  btnBaixar.addEventListener('click', () => {
    if (!foto || !checkConsentimento.checked) return;
    const linkTemp = document.createElement('a');
    linkTemp.download = nomeArquivoAtual();
    linkTemp.href = canvas.toDataURL('image/png');
    linkTemp.click();
    registrarDownload();
    mostrarTelaSucesso();
  });

  btnWhatsapp.addEventListener('click', () => {
    if (!foto || !checkConsentimento.checked) return;
    canvas.toBlob(async (blob) => {
      const arquivo = new File([blob], nomeArquivoAtual(), { type: 'image/png' });
      const texto = montarLegenda();
      if (navigator.canShare && navigator.canShare({ files: [arquivo] })) {
        try { await navigator.share({ files: [arquivo], text: texto }); registrarDownload(); return; }
        catch (erro) { /* usuário cancelou o compartilhamento nativo */ }
      }
      const url = 'https://wa.me/?text=' + encodeURIComponent(texto);
      window.open(url, '_blank');
      const linkTemp = document.createElement('a');
      linkTemp.download = nomeArquivoAtual();
      linkTemp.href = canvas.toDataURL('image/png');
      linkTemp.click();
      registrarDownload();
    }, 'image/png');
  });

  /* ---------- banner de boas-vindas ---------- */
  function iniciarBannerBoasVindas() {
    if (!CONFIG.mensagemBoasVindas || !bannerBoasVindas) return;
    bannerBoasVindasTexto.textContent = CONFIG.mensagemBoasVindas;
    bannerBoasVindas.classList.add('visivel');
    const esconder = () => {
      bannerBoasVindas.classList.add('saindo');
      setTimeout(() => bannerBoasVindas.classList.remove('visivel', 'saindo'), 500);
    };
    const timerAutomatico = setTimeout(esconder, 6000);
    bannerBoasVindasFechar.addEventListener('click', () => { clearTimeout(timerAutomatico); esconder(); });
  }
  iniciarBannerBoasVindas();

  /* ---------- alto contraste ---------- */
  if (btnAltoContraste) {
    btnAltoContraste.addEventListener('click', () => {
      const ativo = document.body.classList.toggle('alto-contraste');
      btnAltoContraste.setAttribute('aria-pressed', ativo ? 'true' : 'false');
    });
  }

  /* ---------- contagem regressiva até a eleição ---------- */
  function iniciarContadorEleicao() {
    if (!CONFIG.dataEleicao || !contadorEleicao) return;
    const dataAlvo = new Date(CONFIG.dataEleicao).getTime();
    if (isNaN(dataAlvo)) return;
    function criarItemContador(valor, rotulo) {
      return '<div class="ma-contador-item"><strong>' + String(valor).padStart(2, '0') + '</strong><span>' + rotulo + '</span></div>';
    }
    function atualizar() {
      const diferenca = dataAlvo - Date.now();
      if (diferenca <= 0) { contadorEleicao.style.display = 'none'; clearInterval(intervalo); return; }
      contadorEleicao.style.display = 'flex';
      const dias = Math.floor(diferenca / 86400000);
      const horas = Math.floor((diferenca / 3600000) % 24);
      const minutos = Math.floor((diferenca / 60000) % 60);
      const segundos = Math.floor((diferenca / 1000) % 60);
      contadorEleicaoNumeros.innerHTML =
        criarItemContador(dias, 'dias') + criarItemContador(horas, 'h') +
        criarItemContador(minutos, 'min') + criarItemContador(segundos, 'seg');
    }
    atualizar();
    const intervalo = setInterval(atualizar, 1000);
  }
  iniciarContadorEleicao();

  /* ---------- inicialização ---------- */
  atualizarControlesTexto();
  atualizarLegenda();
  atualizarBotoes();
  desenharTudo();
})();
