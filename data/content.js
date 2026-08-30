/* ============================================================
   DANIEL RADAR 70.000 — conteúdo do site (100% estático)
   ============================================================
   Este arquivo substitui o antigo par Firestore + content.json.
   Não há mais painel administrativo: para atualizar qualquer
   texto, link, número ou notícia do site, edite os valores
   abaixo diretamente e salve o arquivo — nenhuma build ou
   servidor é necessário.
   Ele é carregado como um <script> comum (não um módulo) antes
   de assets/js/main.js, então a variável global window.RADAR_CONTENT
   já está disponível quando main.js roda — inclusive abrindo o
   index.html direto do computador (file://), sem precisar de
   nenhum servidor.
   ============================================================ */

window.RADAR_CONTENT = {

  candidato: {
    nome: "Daniel Radar",
    numero: "70000",
    numeroFormatado: "70.000",
    partido: "AVANTE",
    partidoNumero: "70",
    cargo: "Deputado Distrital",
    slogan: "Um de nós, representando a nossa voz.",
    subSlogan: "Há mais de 15 anos dando voz às comunidades, fiscalizando os serviços públicos, denunciando problemas e cobrando soluções para a população. Agora, com essa mesma força, sigo lutando por um DF mais justo.",
    fotoHero: "assets/img/perfil/daniel-radar-retrato.png",
    fotoQuemSou: "assets/img/perfil/daniel-radar-punho.png"
  },

  links: {
    propostasPdf: "https://drive.google.com/uc?export=download&id=10hWNj1F_2WoN9oggNmk8rJdod0qFZwhL",
    jingle: "https://drive.google.com/uc?export=download&id=1aQA8bK10TBF-SPEbQrO9UX8hOkePquYP",
    grupoVoluntariosWhatsapp: "https://chat.whatsapp.com/CRKZCE1Ohu8IKVH03riKcP?s=sw&p=i&mlu=4",
    instagram: "https://www.instagram.com/danielradardf/",
    instagramHandle: "@danielradardf",
    tiktok: "https://www.tiktok.com/@danielradar",
    tiktokHandle: "@DanielRadar",
    kwai: "https://www.kwai.com/@danielradar",
    kwaiHandle: "@DanielRadar"
  },

  quemSou: {
    titulo: "Uma história de lutas e resultados",
    texto: "Sou Daniel Radar, tenho 43 anos, gestor público, jornalista e estudante de Direito. Sou cristão, casado e pai de 3 filhas. Moro na região Sul do DF e, há mais de 15 anos, estou à frente de um projeto que dá voz às comunidades, fiscaliza os serviços públicos, denuncia problemas e cobra soluções para a população.\n\nComo cidadão, e sem mandato parlamentar, construí essa trajetória com muito trabalho, coragem e compromisso com as pessoas. Morador de Santa Maria há mais de 30 anos, filho da dona Mônica, salgadeira, e do saudoso Seu Francisco, porteiro.\n\nTudo começou em 2011, quando a indignação com os problemas da cidade virou ação: o Radar Santa Maria nasceu para fiscalizar a prestação de serviços públicos e dar voz a quem o poder público insistia em não ouvir. De lá para cá, foram centenas de denúncias e cobranças que viraram solução concreta para a população — de UBS sem médico a ônibus sem horário, de escritura não entregue a poste sem luz.",
    linhaDoTempo: [
      {
        ano: "2011",
        titulo: "Início do Radar Santa Maria e Gama",
        texto: "Projeto comunitário de fiscalização e voz às comunidades, cobrando soluções direto dos órgãos públicos."
      },
      {
        ano: "2022",
        titulo: "11.739 votos",
        texto: "Primeiro suplente — a 146 votos de ser eleito para a Câmara Legislativa do DF."
      },
      {
        ano: "2026",
        titulo: "Candidatura oficializada",
        texto: "Confirmado candidato a deputado distrital pelo Avante em convenção partidária com mais de 14 mil participantes."
      }
    ],
    ficha: {
      titulo: "Ficha da candidatura",
      itens: [
        { label: "Nome de urna", valor: "Daniel Radar" },
        { label: "Nome completo", valor: "Daniel de Sousa Oliveira" },
        { label: "Naturalidade", valor: "Brasília (DF)" },
        { label: "Estado civil", valor: "Casado" },
        { label: "Partido", valor: "AVANTE" },
        { label: "Número", valor: "70.000" }
      ],
      fonte: "Fonte: TSE, via O TEMPO Eleições 2026",
      fonteUrl: "https://www.otempo.com.br/eleicoes/2026/candidatos/distrito-federal/deputado-distrital/daniel-radar-70000"
    }
  },

  bandeiras: [
    {
      id: "saude",
      titulo: "Saúde Pública",
      texto: "Ser o deputado que mais investe na saúde. 50% das emendas para mais profissionais, UBSs, UPAs, hospitais e redução das filas."
    },
    {
      id: "transporte",
      titulo: "Transporte",
      texto: "Expansão do Metrô e BRT, mais linhas e horários de ônibus e implantação de circulares gratuitos nas cidades."
    },
    {
      id: "educacao",
      titulo: "Educação",
      texto: "Mais creches, escolas em tempo integral, melhores estruturas, valorização dos profissionais e inclusão dos estudantes com deficiência."
    },
    {
      id: "emprego",
      titulo: "Emprego",
      texto: "Fortalecer polos de desenvolvimento, atrair empresas e criar condições para gerar emprego e renda nas próprias cidades."
    },
    {
      id: "regularizacao",
      titulo: "Regularização",
      texto: "Acelerar a regularização fundiária e a entrega das escrituras, garantindo segurança jurídica e dignidade às famílias."
    },
    {
      id: "seguranca",
      titulo: "Segurança",
      texto: "Mais efetivo policial, novas viaturas e equipamentos, tecnologia e câmeras de monitoramento para todas as cidades."
    }
  ],

  compromissos: [
    { numero: 1, categoria: "Saúde", titulo: "Prioridade Total na Saúde Pública", texto: "Destinar 50% das emendas ao Orçamento para mais profissionais, UBSs, UPAs, estrutura nos hospitais, exames, cirurgias e redução das filas." },
    { numero: 2, categoria: "Transporte", titulo: "Transporte Público que Funcione", texto: "Defender a expansão do Metrô e do BRT, mais linhas e horários de ônibus e a implantação de circulares gratuitos nas cidades." },
    { numero: 3, categoria: "Educação", titulo: "Educação Pública de Qualidade e Inclusiva", texto: "Defender mais creches, escolas em tempo integral, melhores estruturas, valorização dos profissionais e inclusão e suporte aos estudantes com deficiência." },
    { numero: 4, categoria: "Emprego", titulo: "Emprego Perto de Casa", texto: "Fortalecer os polos de desenvolvimento, atrair empresas e criar condições para gerar mais emprego e renda nas próprias cidades." },
    { numero: 5, categoria: "Regularização", titulo: "Regularização e Escritura", texto: "Acelerar a regularização fundiária e a entrega das escrituras, garantindo segurança jurídica e dignidade às famílias." },
    { numero: 6, categoria: "Segurança", titulo: "Mais Segurança nas Cidades", texto: "Defender mais efetivo policial, valorização dos profissionais, novas viaturas e equipamentos, além de tecnologia e câmeras de monitoramento." },
    { numero: 7, categoria: "Qualificação", titulo: "Qualificação e Ensino Profissionalizante", texto: "Ampliar cursos e oportunidades de capacitação para jovens, mulheres, trabalhadores e pessoas 60+, aproximando a formação das oportunidades de emprego." },
    { numero: 8, categoria: "Serviços", titulo: "Serviços Públicos Mais Perto", texto: "Levar o modelo Na Hora para as Administrações Regionais, facilitando o acesso da população aos serviços públicos sem precisar atravessar a cidade." },
    { numero: 9, categoria: "Fiscalização", titulo: "Fiscalização de Verdade", texto: "Continuar fiscalizando saúde, educação, transporte, obras e demais serviços públicos. Agora, da porta para dentro do sistema." },
    { numero: 10, categoria: "Presença", titulo: "Mandato nas Cidades", texto: "Criar o Gabinete Móvel, levando o mandato às comunidades para ouvir a população, fiscalizar os serviços e cobrar soluções onde os problemas acontecem." },
    { numero: 11, categoria: "Esporte", titulo: "Esporte e Lazer para Todos", texto: "Fortalecer o esporte amador, de base, feminino e paralímpico, apoiar projetos sociais e investir em campos, quadras, parques, PECs e equipamentos esportivos." },
    { numero: 12, categoria: "Inclusão", titulo: "Respeito às Famílias Atípicas", texto: "Defender uma rede integrada de saúde, educação e assistência, com mais atendimento, terapias, inclusão, acolhimento e suporte às famílias e cuidadores." },
    { numero: 13, categoria: "Mulher", titulo: "Mulher Protegida e com Mais Oportunidades", texto: "Fortalecer a rede de proteção e o combate à violência contra a mulher, além de ampliar capacitação, autonomia financeira, oportunidades de emprego e apoio às mães." },
    { numero: 14, categoria: "Empreendedorismo", titulo: "Apoio a Quem Empreende", texto: "Reduzir a burocracia e fortalecer MEIs, pequenos empresários, comerciantes e feirantes, valorizando quem trabalha, investe e movimenta a economia das cidades." },
    { numero: 15, categoria: "Trabalhadores", titulo: "Dignidade para Quem Trabalha nas Ruas", texto: "Fiscalizar e cobrar a implantação de pontos de apoio para motoboys e motoristas de aplicativo, com banheiros, descanso, alimentação, internet e recarga de celular." },
    { numero: 16, categoria: "Terceiro Setor", titulo: "Terceiro Setor Mais Forte", texto: "Apoiar e capacitar associações, institutos e projetos sociais, reduzindo burocracia e criando condições para que mais recursos cheguem a quem transforma vidas nas comunidades." },
    { numero: 17, categoria: "DF + Entorno", titulo: "DF e Entorno Trabalhando Juntos", texto: "Defender a integração entre DF, Goiás e União para buscar soluções conjuntas para transporte, saúde, segurança, desenvolvimento econômico e infraestrutura." },
    { numero: 18, categoria: "Infraestrutura", titulo: "Cidades Limpas, Iluminadas e Bem Cuidadas", texto: "Cobrar iluminação, limpeza, pavimentação, drenagem, calçadas, acessibilidade e manutenção permanente de praças, parques e espaços públicos." },
    { numero: 19, categoria: "Acessibilidade", titulo: "Dignidade, Acessibilidade e Inclusão", texto: "Defender políticas que garantam mais autonomia, acessibilidade, mobilidade e atendimento digno às pessoas com deficiência e pessoas idosas." },
    { numero: 20, categoria: "Cultura", titulo: "Cultura e Tradições Valorizadas", texto: "Fortalecer artistas locais, quadrilhas, forró, eventos populares e demais manifestações culturais, garantindo que os investimentos em cultura também cheguem às cidades." }
  ],

  // Cobertura de imprensa real sobre a candidatura — os resumos abaixo
  // são reescritos com nossas próprias palavras; o link de cada card
  // leva à matéria original na fonte.
  noticias: [
    {
      fonte: "Agência Satélite",
      data: "1 de agosto de 2026",
      titulo: "Candidatura oficializada em convenção com mais de 14 mil participantes",
      resumo: "A convenção do Avante confirmou a candidatura de Daniel Radar a deputado distrital e homologou também a candidatura de José Roberto Arruda ao governo do DF. Radar destacou os mais de 15 anos de atuação comunitária que embasam seu projeto político.",
      url: "https://www.satelitenoticias.com.br/2026/08/eleicoes-df-2026-daniel-radar-tem.html",
      imagem: "assets/img/fotos/convencao-bastidores-2026/07-daniel-radar-arruda.png"
    },
    {
      fonte: "O TEMPO — Eleições 2026",
      data: "Atualizado em 21 de agosto de 2026",
      titulo: "Perfil oficial do candidato: dados do TSE, biografia e propostas",
      resumo: "Levantamento com dados oficiais do TSE traz a ficha completa da candidatura de Daniel Radar (Avante, 70.000): naturalidade, escolaridade, ocupação e situação da candidatura no Distrito Federal.",
      url: "https://www.otempo.com.br/eleicoes/2026/candidatos/distrito-federal/deputado-distrital/daniel-radar-70000",
      imagem: "assets/img/perfil/daniel-radar-retrato.png"
    },
    {
      fonte: "Brasília Notícias",
      data: "Entrevista de trajetória",
      titulo: "Quem é Daniel Radar: a origem do projeto Radar Santa Maria",
      resumo: "Entrevista que reconstitui o início do projeto Radar Santa Maria em 2011 e a motivação de Daniel Radar para fiscalizar os serviços públicos e levar essa luta à Câmara Legislativa.",
      url: "https://brasilianoticias.com.br/sem-categoria/quem-e-daniel-radar/",
      imagem: "assets/img/perfil/daniel-radar-punho.png"
    }
  ],

  contato: {
    coordenacaoGeral: "(61) 99674-2616",
    imprensa: "(61) 99165-0178",
    comite: "Comitê Central: Santa Maria - DF",
    cnpj: "68.504.295/0001-77",
    rodape: "ELEIÇÃO 2026 DANIEL RADAR - DEPUTADO DISTRITAL • CNPJ 68.504.295/0001-77 • AVANTE 70 • Distrito Federal • Todos os direitos reservados."
  },

  // Agenda de eventos públicos da campanha. "status" pode ser "proximo" ou
  // "realizado" — eventos passados ficam visíveis como registro, mas em
  // uma aba separada. Adicione um novo objeto sempre que marcar um evento.
  agenda: [
    {
      id: "caminhada-santa-maria",
      status: "proximo",
      titulo: "Caminhada em Santa Maria",
      data: "6 de setembro de 2026",
      horario: "08h00",
      local: "Praça Central de Santa Maria",
      endereco: "Santa Maria, Brasília - DF",
      descricao: "Caminhada pelas quadras centrais com conversa direta com moradores e lideranças comunitárias.",
      mapaUrl: "https://www.google.com/maps/search/?api=1&query=Pra%C3%A7a+Central+de+Santa+Maria+DF"
    },
    {
      id: "carreata-gama",
      status: "proximo",
      titulo: "Carreata no Gama",
      data: "13 de setembro de 2026",
      horario: "15h00",
      local: "Setor Central do Gama",
      endereco: "Gama, Brasília - DF",
      descricao: "Concentração de carros e motos com saída do Setor Central, reforçando o apoio à candidatura 70.000.",
      mapaUrl: "https://www.google.com/maps/search/?api=1&query=Setor+Central+do+Gama+DF"
    },
    {
      id: "roda-conversa-recanto",
      status: "proximo",
      titulo: "Roda de conversa — saúde e mobilidade",
      data: "20 de setembro de 2026",
      horario: "19h30",
      local: "Associação de Moradores do Recanto das Emas",
      endereco: "Recanto das Emas, Brasília - DF",
      descricao: "Encontro aberto para ouvir demandas de saúde e transporte público direto dos moradores da região.",
      mapaUrl: "https://www.google.com/maps/search/?api=1&query=Recanto+das+Emas+DF"
    },
    {
      id: "convencao-avante",
      status: "realizado",
      titulo: "Convenção do Avante — candidatura oficializada",
      data: "1 de agosto de 2026",
      horario: "10h00",
      local: "Convenção partidária",
      endereco: "Distrito Federal",
      descricao: "Homologação da candidatura de Daniel Radar a deputado distrital, com mais de 14 mil participantes.",
      mapaUrl: ""
    }
  ],

  // Kit de imprensa: material de apoio para jornalistas e veículos de
  // comunicação. O zip pode ser regerado sempre que houver fotos/textos novos.
  kitImprensa: {
    zip: "downloads/kit-imprensa-daniel-radar-70000.zip",
    bioResumo: "Daniel Radar, 43 anos, é gestor público, jornalista e estudante de Direito. Morador de Santa Maria (DF) há mais de 30 anos, fundou em 2011 o projeto Radar Santa Maria, iniciativa comunitária de fiscalização de serviços públicos. Em 2022, foi o primeiro suplente a deputado distrital, a 146 votos de distância da eleição. Em 2026, concorre pelo Avante (70.000) ao cargo de deputado distrital do Distrito Federal.",
    fichaTecnica: [
      { label: "Nome completo de urna", valor: "Daniel Radar" },
      { label: "Número", valor: "70.000" },
      { label: "Partido", valor: "AVANTE (70)" },
      { label: "Cargo pretendido", valor: "Deputado Distrital" },
      { label: "Naturalidade", valor: "Distrito Federal" },
      { label: "Ocupação", valor: "Gestor público, jornalista e estudante de Direito" }
    ]
  },

  // Doações — o site não processa pagamentos diretamente; o botão de doar
  // redireciona para o canal oficial homologado pela campanha, conforme a
  // legislação eleitoral (doações identificadas, com CPF do doador).
  doacao: {
    linkOficial: "https://www.doeaqui.asaas.com/danielradar70000",
    limiteInformativo: "Pessoas físicas podem doar até 10% dos seus rendimentos brutos do ano anterior, conforme a legislação eleitoral (Lei nº 9.504/1997).",
    textoIntro: "Sua doação ajuda a custear material de campanha, deslocamento e ações de rua da candidatura 70.000. Toda doação é identificada e registrada na prestação de contas oficial à Justiça Eleitoral."
  },

  tema: {
    // Visual minimalista em preto e branco — sem cor de destaque.
    // Deixe null para usar exatamente os tons definidos em assets/css/style.css.
    corSinal: null,
    corVerdeInstitucional: null,
    corVerdeMedio: null,
    corDestaque: null,
    corFundo: null
  },

  // Chaves em "false" escondem a seção/link correspondente — útil para
  // quem mantém o site sem precisar apagar HTML.
  visibilidade: {
    stats: true,
    bandeiras: true,
    compromissos: true,
    noticias: true,
    navFotos: true,
    navFigurinhas: true,
    navMoldura: true,
    navAgenda: true,
    navImprensa: true,
    navDoacoes: true
  },

  // Pacote oficial de figurinhas para WhatsApp — imagens em
  // assets/img/figurinhas/. Para adicionar uma nova figurinha, salve o
  // PNG (fundo transparente, 512x512) nessa pasta e acrescente um item
  // aqui embaixo.
  figurinhas: [
    { id: "radar-70000", nome: "Radar 70.000", src: "assets/img/figurinhas/figurinha-radar-70000.png" },
    { id: "vote-70000", nome: "Vote 70.000", src: "assets/img/figurinhas/figurinha-vote-70000.png" },
    { id: "eu-apoio", nome: "Eu apoio", src: "assets/img/figurinhas/figurinha-eu-apoio.png" },
    { id: "slogan", nome: "Daqui. De dentro. De verdade.", src: "assets/img/figurinhas/figurinha-slogan.png" },
    { id: "fiscalizando", nome: "Fiscalizando", src: "assets/img/figurinhas/figurinha-fiscalizando.png" },
    { id: "obrigado", nome: "Obrigado", src: "assets/img/figurinhas/figurinha-obrigado.png" }
  ],
  pacoteFigurinhasZip: "downloads/figurinhas-daniel-radar-70000.zip",

  // Álbuns de eventos — fotos tiradas pelo fotógrafo oficial da
  // campanha, organizadas por dia/evento, para quem esteve lá conseguir
  // encontrar e baixar a própria foto. Adicione um novo objeto de álbum
  // sempre que houver fotos de um novo evento.
  albunsFotos: [
    {
      id: "convencao-bastidores-2026",
      titulo: "Convenção e Bastidores da Campanha",
      local: "Distrito Federal",
      data: "Agosto de 2026",
      capa: "assets/img/fotos/convencao-bastidores-2026/00-capa-punho.png",
      fotos: [
        { src: "assets/img/fotos/convencao-bastidores-2026/00-capa-punho.png", legenda: "Daniel Radar em ato de campanha" },
        { src: "assets/img/fotos/convencao-bastidores-2026/04-daniel-radar-deputado-distrital.png", legenda: "Daniel Radar 70.000 — Deputado Distrital" },
        { src: "assets/img/fotos/convencao-bastidores-2026/03-arte-verde.png", legenda: "Daqui. De dentro. De verdade." },
        { src: "assets/img/fotos/convencao-bastidores-2026/02-e-radar-70000.png", legenda: "É Radar 70.000" },
        { src: "assets/img/fotos/convencao-bastidores-2026/05-abraco-apoiador.png", legenda: "Com apoiadores da campanha" },
        { src: "assets/img/fotos/convencao-bastidores-2026/06-estamos-juntos-rafael-prudente.png", legenda: "Ao lado de Rafael Prudente, candidato a deputado federal" },
        { src: "assets/img/fotos/convencao-bastidores-2026/07-daniel-radar-arruda.png", legenda: "Ao lado de Arruda, candidato ao governo do DF" },
        { src: "assets/img/fotos/convencao-bastidores-2026/01-badge-70000.png", legenda: "Daniel Radar 70.000" }
      ]
    }
  ]
};
