/**
 * Motor Analítico de Inteligência Artificial para "O Dilema do Presidente".
 * Avalia as decisões do jogador e gera o relatório final de governança.
 */
class AIEngine {
  /**
   * Calcula as afinidades do jogador com os 7 perfis de governança (0 a 100).
   * @param {Array} historicoDecisoes - Lista de decisões tomadas no jogo.
   * @param {Object} finalStats - Indicadores finais do país.
   * @returns {Object} Pontuações de cada perfil.
   */
  static calcularPerfis(historicoDecisoes, finalStats) {
    let perfis = {
      fiscal: 50,       // Responsabilidade Fiscal
      assistencial: 50, // Assistencialismo Social
      desenvolvimento: 50, // Desenvolvimento Econômico
      ambiental: 50,    // Sustentabilidade Ambiental
      tecnocratico: 50, // Gestão Tecnocrática
      populista: 50,    // Populismo de Curto Prazo
      equilibrio: 50    // Equilíbrio Estratégico
    };

    let totalDecisoes = historicoDecisoes.length;
    if (totalDecisoes === 0) return perfis;

    // 1. ANÁLISE BASEADA NAS DECISÕES INDIVIDUAIS
    historicoDecisoes.forEach(dec => {
      const pasta = dec.pasta;
      const opcaoId = dec.opcao.id;
      const custo = dec.opcao.custo;

      // Classifica opções baseada em custos e setores
      if (custo >= 30) {
        perfis.assistencial += 8;
        perfis.fiscal -= 6;
      } else if (custo === 0) {
        perfis.fiscal += 8;
        perfis.assistencial -= 5;
      } else {
        perfis.tecnocratico += 4;
      }

      // Correlação com setores específicos
      if (pasta === "economia") {
        if (opcaoId === "A") { // Energias limpas / Desmatamento Zero
          perfis.ambiental += 15;
          perfis.desenvolvimento -= 5;
        } else if (opcaoId === "B") { // Termelétricas / Crédito de carbono
          perfis.tecnocratico += 8;
          perfis.desenvolvimento += 5;
        } else if (opcaoId === "C") { // Racionamento / Agrobusiness livre
          if (dec.rodada === 3) { // Amazônia livre
            perfis.desenvolvimento += 15;
            perfis.ambiental -= 15;
          } else if (dec.rodada === 1) { // Tarifa extra
            perfis.populista -= 10;
            perfis.fiscal += 10;
          } else { // Juros Selic
            perfis.tecnocratico += 12;
            perfis.populista -= 8;
          }
        }
      }

      if (pasta === "saude") {
        if (opcaoId === "A") { // Lockdown / Saneamento
          perfis.assistencial += 8;
          perfis.populista += 4;
        } else if (opcaoId === "B") { // Testagem / Tendas
          perfis.tecnocratico += 8;
        } else if (opcaoId === "C") { // Livre mercado / Repelentes
          perfis.desenvolvimento += 10;
          perfis.assistencial -= 8;
        }
      }

      if (pasta === "educacao") {
        if (opcaoId === "A") { // Reconstrução / Ensino integral
          perfis.assistencial += 10;
          perfis.tecnocratico += 5;
        } else if (opcaoId === "B") { // Reformas básicas / Poupança
          perfis.populista += 6;
        } else if (opcaoId === "C") { // Parcerias / EAD
          perfis.desenvolvimento += 12;
          perfis.fiscal += 8;
        }
      }

      if (pasta === "seguranca") {
        if (opcaoId === "A") { // Intervenção / Presídios max
          perfis.populista += 6;
          perfis.tecnocratico += 4;
        } else if (opcaoId === "B") { // Inteligência / Tornozeleiras
          perfis.tecnocratico += 10;
          perfis.populista -= 5;
        } else if (opcaoId === "C") { // Armas lib / Privatizar presídios
          perfis.desenvolvimento += 8;
          perfis.fiscal += 6;
        }
      }
    });

    // 2. AJUSTE COM BASE NOS INDICADORES FINAIS
    // Responsabilidade Fiscal: Reflete orçamento alto
    perfis.fiscal += (finalStats.orcamento - 50) * 0.4;
    // Assistencialismo: Reflete saúde e educação altas a custo de orçamento
    perfis.assistencial += ((finalStats.saude + finalStats.educacao)/2 - 50) * 0.3;
    // Desenvolvimento: Reflete economia alta
    perfis.desenvolvimento += (finalStats.economia - 50) * 0.4;
    // Ambiental: Reflete meio ambiente alto
    perfis.ambiental += (finalStats.meioambiente - 50) * 0.5;
    // Populista: Reflete satisfação popular alta e orçamento baixo
    perfis.populista += (finalStats.satisfacao - 50) * 0.4 - (finalStats.orcamento - 50) * 0.2;
    // Tecnocrático: Reflete infraestrutura e segurança altas
    perfis.tecnocratico += ((finalStats.infraestrutura + finalStats.seguranca)/2 - 50) * 0.3;

    // Equilíbrio Estratégico: Quanto menor o desvio padrão dos indicadores, maior o equilíbrio
    let valores = Object.values(finalStats);
    let media = valores.reduce((a, b) => a + b, 0) / valores.length;
    let variancia = valores.reduce((a, b) => a + Math.pow(b - media, 2), 0) / valores.length;
    let desvioPadrao = Math.sqrt(variancia);
    
    // Se o desvio padrão for baixo (ex: < 15), o equilíbrio é alto. Se for alto (ex: > 30), o equilíbrio é baixo.
    perfis.equilibrio = Math.max(10, Math.min(100, 100 - (desvioPadrao * 2.5) + (media - 50) * 0.5));

    // Normaliza todas as pontuações entre 10 e 100
    Object.keys(perfis).forEach(k => {
      perfis[k] = Math.round(Math.max(10, Math.min(100, perfis[k])));
    });

    return perfis;
  }

  /**
   * Identifica o perfil dominante do jogador.
   * @param {Object} perfis - Pontuações de perfis.
   * @returns {string} ID do perfil dominante.
   */
  static obterPerfilDominante(perfis) {
    let maiorPerfil = "equilibrio";
    let maiorPontuacao = -1;

    Object.keys(perfis).forEach(p => {
      if (perfis[p] > maiorPontuacao) {
        maiorPontuacao = perfis[p];
        maiorPerfil = p;
      }
    });

    return maiorPerfil;
  }

  /**
   * Dicionário de metadados para tradução e descrição dos perfis.
   */
  static get PERFIS_METADATA() {
    return {
      fiscal: {
        nome: "Responsabilidade Fiscal",
        subtitulo: "O Guardião das Contas Públicas",
        descricao: "Você priorizou o equilíbrio do caixa federal, evitando gastos desnecessários e resistindo a pressões populares. Entende que a estabilidade econômica de longo prazo depende de contas públicas limpas e atração de investimentos.",
        icon: "dollar-sign",
        cor: "#10b981", // Verde
        positivo: "Evitou a inflação galopante, manteve a confiança dos investidores internacionais estável e garantiu que o país não entrasse em insolvência ou risco de calote de dívida pública.",
        negativo: "O corte drástico de investimentos diretos gerou precarização imediata nos serviços públicos de saúde, educação e segurança, penalizando as classes sociais mais vulneráveis do país."
      },
      assistencial: {
        nome: "Assistencialismo Social",
        subtitulo: "O Protetor dos Vulneráveis",
        descricao: "Seu governo foi focado no amparo social direto, subsídios e distribuição de renda. Para você, o sucesso de uma nação é medido pela qualidade de vida de seus cidadãos mais pobres, mesmo que isso custe o endividamento do Estado.",
        icon: "heart",
        cor: "#ec4899", // Rosa/Pink
        positivo: "Reduziu drasticamente a miséria, a fome e a mortalidade nos picos de crise sanitária, garantindo dignidade básica e segurança alimentar para as periferias e minorias do país.",
        negativo: "O alto endividamento e estouro constante da verba limitaram a capacidade do país de investir em infraestrutura de longo prazo, gerando inflação cambial e juros altos."
      },
      desenvolvimento: {
        nome: "Desenvolvimento Econômico",
        subtitulo: "O Motor do Mercado",
        descricao: "Seu foco foi o crescimento industrial, a desregulamentação, a atração de capital privado e a produtividade. Você acredita que a melhor política social é a geração de emprego e renda através da liberdade de mercado.",
        icon: "trending-up",
        cor: "#f59e0b", // Amber/Laranja
        positivo: "Aceleração do PIB, modernização das indústrias e forte geração de emprego formal. O comércio e o agronegócio alcançaram recordes de exportação sob sua gestão.",
        negativo: "Flexibilizações regulatórias geraram degradação ambiental profunda e aumentaram a desigualdade de renda, gerando críticas e tensões com minorias e ativistas."
      },
      ambiental: {
        nome: "Sustentabilidade Ambiental",
        subtitulo: "O Defensor do Futuro",
        descricao: "Você governou sob a ótica ecológica, entendendo que o desenvolvimento sem conservação é autodestrutivo. Priorizou a preservação florestal e a transição para energias renováveis frente aos lobbies econômicos tradicionais.",
        icon: "leaf",
        cor: "#06b6d4", // Cyan/Teal
        positivo: "Preservação histórica da Amazônia, transição rápida para matriz energética limpa e alta credibilidade internacional, abrindo portas para créditos ambientais e investimentos verdes globais.",
        negativo: "A fiscalização rígida e a negação de licenças de exploração geraram atritos fortes com o agronegócio e a indústria mineral, reduzindo o crescimento imediato do PIB em alguns setores."
      },
      tecnocratico: {
        nome: "Gestão Tecnocrática",
        subtitulo: "O Administrador Racional",
        descricao: "Suas decisões foram tomadas com base em dados de inteligência, planejamento científico e eficiência técnica. Você buscou soluções estruturais modernas, evitando ideologias partidárias ou apelo popular fácil.",
        icon: "cpu",
        cor: "#6366f1", // Indigo
        positivo: "Criação de defesas cibernéticas eficazes, modernização digital dos serviços de governo, combate técnico à lavagem de dinheiro e otimização dos recursos através de inteligência operacional.",
        negativo: "Sua postura analítica e focada em processos foi percebida como fria e distante pela população comum, que sentiu falta de acolhimento social direto nos momentos de crise humanitária."
      },
      populista: {
        nome: "Populismo de Curto Prazo",
        subtitulo: "O Amigo do Povo",
        descricao: "Você focou em manter a aprovação popular alta a qualquer custo, preferindo adiar reformas fiscais impopulares ou tomar medidas imediatistas (como congelamento de preços e subsídios rápidos) para acalmar a opinião pública.",
        icon: "users",
        cor: "#ef4444", // Vermelho
        positivo: "Manteve o apoio popular e evitou revoltas sociais diretas ou greves políticas de grandes proporções durante períodos severos de tensão social.",
        negativo: "Acumulou uma bomba-relógio econômica ao mascarar problemas estruturais com tarifas artificiais, culminando em perda de investimento e inflação futura inevitável."
      },
      equilibrio: {
        nome: "Equilíbrio Estratégico",
        subtitulo: "O Articulador Moderado",
        descricao: "Você buscou o caminho do meio. Não cedeu a extremos, distribuindo a verba de forma equitativa e buscando conciliar o rigor fiscal com o amparo social e a preservação com a produção comercial.",
        icon: "scale",
        cor: "#8b5cf6", // Violeta
        positivo: "Estabilidade social e institucional duradoura. Conseguiu evitar que qualquer indicador desabasse totalmente, mantendo o país funcionando de maneira harmônica.",
        negativo: "Por tentar agradar a todos os grupos simultaneamente, seu governo foi rotulado como 'morno' ou hesitante, sem reformas profundas em nenhuma das áreas."
      }
    };
  }

  /**
   * Gera um relatório estruturado local baseado em regras heurísticas.
   * @param {Array} historicoDecisoes - Histórico do jogo.
   * @param {Object} finalStats - Indicadores finais.
   * @param {Object} perfis - Pontuações de perfis.
   * @returns {string} Relatório em formato Markdown.
   */
  static gerarRelatorioLocal(historicoDecisoes, finalStats, perfis) {
    const dominanteId = this.obterPerfilDominante(perfis);
    const meta = this.PERFIS_METADATA[dominanteId];

    let md = `## 📊 RELATÓRIO OFICIAL DE GOVERNANÇA\n\n`;
    md += `### Perfil Dominante: **${meta.nome}**\n`;
    md += `*${meta.subtitulo}*\n\n`;
    md += `> **Análise Geral**: ${meta.descricao}\n\n`;

    md += `#### 🟢 Pontos Positivos da sua Gestão:\n`;
    md += `- ${meta.positivo}\n`;
    // Adiciona outro ponto positivo dinâmico baseado em estatísticas
    if (finalStats.meioambiente > 60) md += `- **Excelência Ambiental**: A preservação dos ecossistemas protegeu a biodiversidade e garantiu prestígio verde ao país.\n`;
    if (finalStats.economia > 60) md += `- **Solidez Comercial**: O fortalecimento do mercado de trabalho manteve o desemprego sob controle.\n`;
    if (finalStats.orcamento > 60) md += `- **Saúde Financeira**: A reserva de caixa preservada permite ao país resistir a choques externos futuros.\n`;
    if (finalStats.saude > 60) md += `- **Proteção da Vida**: Seus investimentos em saúde pública mantiveram a mortalidade em taxas mínimas.\n`;
    md += `\n`;

    md += `#### 🔴 Consequências e Efeitos Colaterais:\n`;
    md += `- ${meta.negativo}\n`;
    if (finalStats.orcamento < 30) md += `- **Risco Fiscal Elevado**: O caixa público esgotado limita a margem de manobra do próximo governo, gerando desconfiança de credores.\n`;
    if (finalStats.satisfacao < 35) md += `- **Instabilidade Política**: A insatisfação popular crítica acende alertas de greves, manifestações e fragilidade democrática.\n`;
    if (finalStats.meioambiente < 30) md += `- **Devastação Ecológica**: A destruição da cobertura vegetal gerou microclimas áridos, secas severas e cancelamento de acordos externos.\n`;
    if (finalStats.seguranca < 30) md += `- **Crise de Ordem Pública**: A perda de controle de territórios para facções afeta diretamente o cotidiano e a vida das famílias.\n`;
    md += `\n`;

    md += `#### 📈 Avaliação Setorial Finais:\n`;
    md += `| Setor | Indicador Final | Status |\n`;
    md += `| :--- | :---: | :---: |\n`;
    Object.keys(finalStats).forEach(s => {
      let val = finalStats[s];
      let status = "⚠️ Alerta";
      if (val >= 65) status = "🟢 Excelente";
      else if (val >= 40) status = "🟡 Moderado";
      else status = "🔴 Crítico";

      // Traduz os nomes das chaves
      const traducao = {
        economia: "Economia",
        saude: "Saúde",
        educacao: "Educação",
        seguranca: "Segurança",
        meioambiente: "Meio Ambiente",
        infraestrutura: "Infraestrutura",
        satisfacao: "Aprovação Popular",
        orcamento: "Orçamento Público"
      };

      md += `| ${traducao[s] || s} | **${val}%** | ${status} |\n`;
    });
    md += `\n`;

    md += `#### 🧠 Reflexão Científico-Administrativa:\n`;
    md += `Este simulador demonstra que **governar é a arte de gerenciar recursos escassos sob pressões conflitantes**. Não há escolhas mágicas: ao priorizar um setor, outro inevitavelmente perde recursos. A Inteligência Artificial atuou aqui como um **Sistema de Apoio à Decisão (DSS)**, mapeando os desdobramentos de suas escolhas e categorizando sua visão política com base na ciência de dados. A reflexão final que fica é: *quais trade-offs você está disposto a aceitar para construir a nação ideal?*\n`;

    return md;
  }

  /**
   * Envia os dados para a API do Gemini e retorna o relatório personalizado gerado pela IA.
   * @param {string} apiKey - Chave da API do Gemini.
   * @param {Array} historicoDecisoes - Histórico de jogo.
   * @param {Object} finalStats - Estatísticas finais.
   * @param {Object} perfis - Pontuações de perfis.
   * @returns {Promise<string>} Relatório gerado pela IA em Markdown.
   */
  static async gerarRelatorioGemini(apiKey, historicoDecisoes, finalStats, perfis) {
    const dominante = this.obterPerfilDominante(perfis);
    const metaDominante = this.PERFIS_METADATA[dominante];

    const prompt = `
Você é uma Inteligência Artificial analítica especialista em Ciência Política, Administração Pública e Economia, atuando como um Sistema de Apoio à Decisão para o Presidente da República.

O jogador acabou de concluir uma simulação de 3 anos de mandato presidencial. Analise a performance dele e escreva um relatório de governança personalizado, realista, educativo e profundo.

DADOS DA PARTIDA:
- Perfil Dominante Calculado: ${metaDominante.nome} (${metaDominante.subtitulo})
- Indicadores Finais do País (0-100%):
  * Economia: ${finalStats.economia}%
  * Saúde: ${finalStats.saude}%
  * Educação: ${finalStats.educacao}%
  * Segurança: ${finalStats.seguranca}%
  * Meio Ambiente: ${finalStats.meioambiente}%
  * Infraestrutura: ${finalStats.infraestrutura}%
  * Aprovação Popular: ${finalStats.satisfacao}%
  * Orçamento Público: ${finalStats.orcamento}%

- Pontuação Geral dos Perfis de Governança (0-100):
  * Responsabilidade Fiscal: ${perfis.fiscal}
  * Assistencialismo Social: ${perfis.assistencial}
  * Desenvolvimento Econômico: ${perfis.desenvolvimento}
  * Sustentabilidade Ambiental: ${perfis.ambiental}
  * Gestão Tecnocrática: ${perfis.tecnocratico}
  * Populismo de Curto Prazo: ${perfis.populista}
  * Equilíbrio Estratégico: ${perfis.equilibrio}

- Histórico de Decisões do Presidente:
${historicoDecisoes.map(d => `* Ano ${d.rodada} | Pasta: ${d.pasta} | Opção Escolhida: ${d.opcao.texto} (Custo: $${d.opcao.custo} Bilhões). Impacto: ${d.opcao.consequencia}`).join('\n')}

INSTRUÇÕES DE FORMATAÇÃO:
1. Responda em Português do Brasil com linguagem formal, analítica e de assessoria presidencial.
2. Divida o relatório em seções claras:
   - **Análise do Estilo de Liderança**: Justifique a classificação de perfil dominante com base nas decisões de verba e trade-offs.
   - **Impactos Estruturais e Sociais**: Discuta as consequências reais das escolhas na vida da população e no caixa do Estado. Destaque quais setores foram sacrificados.
   - **Análise dos Indicadores Críticos e de Sucesso**: Avalie os indicadores que terminaram muito baixos (<35%) ou muito altos (>65%).
   - **Reflexão Ética e Tomada de Decisão**: Aborde os dilemas morais enfrentados pelo jogador ao priorizar certas causas em detrimento de outras devido à verba limitada.
3. Não use jargões partidários reais (como PT, PL, etc.), foque no dilema científico da priorização de recursos.
4. Mantenha o formato final estritamente em Markdown limpo.
`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const requestBody = {
      contents: [{
        parts: [{ text: prompt }]
      }]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Erro desconhecido na API do Gemini.');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }
}
window.AIEngine = AIEngine;
