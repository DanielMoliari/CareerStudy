import type { SkillContent } from "@/types"

const comunicacao: SkillContent = {
    tagline: "Comunicação técnica eficaz para audiências diferentes — a habilidade que multiplica todo o restante.",
    why: "Senior mal comunicado tem impacto limitado ao próprio trabalho. Senior que comunica bem multiplica o impacto do time inteiro — clarifica o problema certo, alinha antes de implementar, comunica riscos antes de virarem incidentes, e traduz tecnologia para negócio. É a diferença entre um desenvolvedor de código e um engenheiro com influência.",
    summary: "Comunicação em engenharia tem dois eixos: audiência (técnico, produto, negócio, management) e canal (assíncrono escrito, síncrono reunião, apresentação formal). A habilidade central é calibrar a mensagem para a audiência — o que ela precisa entender para tomar a decisão certa, não o que você quer demonstrar que sabe. Comunicação assíncrona bem feita elimina a maioria das reuniões desnecessárias e escala melhor. Feedback técnico eficaz é específico, acionável e separa pessoa da ideia. Comunicação ascendente (para management) foca em impacto de negócio e riscos, não em detalhes de implementação.",
    keypoints: [
      {
        title: "Audiência primeiro — sempre",
        body: "Antes de escrever ou falar, responda: quem é essa pessoa? O que ela precisa entender? Qual é a decisão que ela vai tomar com essa informação? Um junior que precisa implementar precisa de clareza técnica e passo a passo. Um manager que precisa alocar recursos precisa de impacto em negócio e risco. Um cliente técnico precisa de evidência, não de promessa. A mensagem que serve a todos geralmente não serve bem a ninguém.",
      },
      {
        title: "Assíncrono por padrão",
        body: "Escreva para async primeiro: documenta, preserva histórico, escala, permite que a outra pessoa leia no melhor momento dela. Reserve reunião para o que genuinamente precisa de sincronia: debate complexo com múltiplas perspectivas, alinhamento emocional, decisão urgente que precisa de input imediato. 'Podemos resolver isso por texto?' deve ser a primeira pergunta antes de marcar qualquer reunião.",
      },
      {
        title: "Precisão: números e exemplos concretos",
        body: "'O sistema está lento' é comunicação ruim. 'A latência p99 do endpoint de checkout subiu de 180ms para 1.2s entre 14h e 16h de ontem, afetando ~3% das transações' é comunicação precisa. Quantifique impacto, especifique tempo e contexto, use exemplos reais. Abstração genérica protege quem fala mas não serve quem ouve.",
      },
      {
        title: "Feedback técnico eficaz",
        body: "Critique o código, não o autor. Seja específico e acionável: 'este trecho não tem tratamento de erro para quando o serviço externo retorna 503 — em produção isso causaria cascata de falha' é útil. 'Este código é ruim' não é. Explique o porquê — a pessoa precisa aprender, não só corrigir. Reconheça o que está bom — feedback 100% crítico desincentiva.",
      },
      {
        title: "Comunicação ascendente — o que management precisa",
        body: "Manager precisa de: status do que impacta o negócio, riscos antecipados com severidade e probabilidade, dependências externas que podem atrasar, o que você precisa de apoio. Não precisa de: detalhes de implementação, débito técnico sem impacto de negócio claro, problemas sem proposta de solução. Traduza: 'o ORM não suporta transações distribuídas' → 'migrar para múltiplos bancos vai exigir 4–6 semanas de refatoração ou teremos inconsistências de dados'.",
      },
    ],
    interview: [
      {
        q: "Como você se comunica de forma diferente com um engenheiro e com um stakeholder de negócio?",
        a: "Com o engenheiro: foco em causa raiz, tradeoffs técnicos, comportamento do sistema, decisões de implementação — posso usar jargão porque ele conhece o contexto. Com o stakeholder: foco em impacto de negócio (usuários afetados, receita impactada, prazo, risco), eliminando jargão técnico ou traduzindo quando necessário. 'Nossa instância RDS está com CPU a 95%' → 'o banco de dados está próximo do limite de capacidade — se o tráfego crescer 20% sem upgrade, teremos degradação de performance que afeta o checkout'. A mesma informação, enquadramentos completamente diferentes.",
        tip: "Pergunta clássica que separa devs que só falam com devs de engenheiros que influenciam toda a organização.",
        level: "pleno",
      },
      {
        q: "Como você dá feedback construtivo em code review sem criar atrito com o colega?",
        a: "Três princípios: critique o código, não a pessoa (use 'este bloco' em vez de 'você fez'); seja específico e explique o porquê (não só 'está errado', mas 'pode causar race condition quando duas requisições chegam simultaneamente porque o lock não cobre este trecho'); e sinalize claramente o que é blocker vs sugestão ('Blocker:', 'Sugestão:', 'Nitpick:'). Também reconheço quando vejo algo bem feito — review 100% crítico cria defensividade.",
        tip: "Demonstra maturidade de colaboração. Times seniores têm culture de review que eleva o nível sem criar atrito.",
        level: "pleno",
      },
      {
        q: "Como você comunicaria um risco técnico importante para um produto que está prestes a ser lançado?",
        a: "Direto e cedo — não espero o lançamento para revelar o risco. Formulo em termos de impacto e probabilidade: 'identificamos que o sistema de checkout não tem retry em caso de timeout no pagamento externo — probabilidade de falha silenciosa em ~2% das transações sob carga de lançamento'. Apresento junto com opções: 'podemos atrasar 2 dias para implementar o retry, ou lançar com monitoring intenso e rollback rápido se a taxa de falha superar X%'. A decisão é da liderança, mas com informação completa.",
        tip: "Senior comunica riscos cedo com opções, não esconde riscos com medo de ser o portador de más notícias.",
        level: "pleno",
      },
      {
        q: "Quando você prefere comunicação assíncrona versus uma reunião?",
        a: "Assíncrona por padrão para: atualizações de status, decisões com contexto que precisa ser lido cuidadosamente, propostas técnicas onde o time precisa de tempo para processar, e qualquer coisa que pode esperar até o fim do dia. Reunião quando genuinamente necessário: débate técnico complexo onde a conversa em tempo real resolve mais rápido que trocas de texto, alinhamento em situação de conflito ou tensão, e decisão urgente que precisa de input simultâneo. Minha regra: 'se consigo escrever isso num parágrafo claro, não precisa de reunião'.",
        tip: "Em times remotos, habilidade de comunicar bem assincronamente é o que diferencia produtividade real de ruído de reuniões.",
        level: "senior",
      },
    ],
    gotchas: [
      "Usar jargão técnico com audiência não técnica — impede entendimento e cria distância em vez de confiança.",
      "Marcar reunião para informação que deveria ser texto — interrompe flow, não escala, não preserva histórico.",
      "Feedback sem especificidade — 'esse código é ruim' não ensina e gera defensividade.",
      "Omitir riscos por medo de parecer negativo — senior comunica riscos cedo com opções, não esconde.",
    ],
    resources: [
      { title: "Nonviolent Communication (Rosenberg)", url: "https://www.nonviolentcommunication.com/", kind: "livro" },
      { title: "Pyramid Principle (Minto)", url: "https://www.amazon.com/Minto-Pyramid-Principle-Writing-Thinking/dp/0960191038", kind: "livro" },
      { title: "No Hello — guia de comunicação async", url: "https://nohello.net/", kind: "artigo" },
    ],
  }

export default comunicacao
