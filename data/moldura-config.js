/* ============================================================
   CONFIGURAÇÃO DA FERRAMENTA DE MOLDURA — 3 opções oficiais
   Edite só este arquivo para trocar molduras, legendas ou a
   data da eleição. Nenhuma outra alteração de código é necessária.
   ============================================================ */
window.MOLDURA_CONFIG = {
  molduras: [
    {
      id: "radar",
      rotulo: "Somente Daniel Radar",
      arquivo: "assets/img/molduras/moldura-radar.png",
      nomeArquivo: "eu-sou-daniel-radar-70000.png",
      legenda: "Eu sou Daniel Radar, Deputado Distrital 70.000! Daqui. De Dentro. De Verdade. Coloque sua foto também:"
    },
    {
      id: "radar-arruda",
      rotulo: "Daniel Radar + Arruda",
      arquivo: "assets/img/molduras/moldura-arruda.png",
      nomeArquivo: "eu-sou-daniel-radar-arruda.png",
      legenda: "Eu sou Daniel Radar 70.000 + Jose Roberto Arruda 55! Daqui. De Dentro. De Verdade. Coloque sua foto também:"
    },
    {
      id: "radar-prudente",
      rotulo: "Daniel Radar + Prudente",
      arquivo: "assets/img/molduras/moldura-prudente.png",
      nomeArquivo: "eu-sou-daniel-radar-prudente.png",
      legenda: "Eu sou Daniel Radar 70.000 + Rafael Prudente 1515! Daqui. De Dentro. De Verdade. Coloque sua foto também:"
    }
  ],

  tamanhoExportacao: 1254,
  legendaCompartilhamento: "Eu sou Daniel Radar, Deputado Distrital 70.000! Daqui. De Dentro. De Verdade. Coloque sua foto também:",
  mensagemBoasVindas: "Bem-vindo! Escolha sua moldura, envie uma foto e mostre seu apoio 🤝",

  // Data da eleição para a contagem regressiva. Deixe "" para esconder.
  dataEleicao: "2026-10-04T08:00:00",

  // Abaixo desse tamanho (menor lado, em pixels), a foto recebe um aviso de baixa resolução
  resolucaoMinimaAlerta: 700,
  // Fotos maiores que isso (maior lado) são reduzidas automaticamente antes de processar
  maxDimensaoUpload: 1800
};
