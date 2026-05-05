import type { SkillContent } from "@/types"

const lideranca: SkillContent = {
    tagline: "Liderança técnica sem autoridade formal — de sênior a tech lead que multiplica o time.",
    why: "A transição de sênior para staff ou tech lead é principalmente sobre liderança técnica. Entregar código excelente individualmente chega a um plateau — o próximo nível é multiplicar o output do time, clarificar direção técnica, elevar a qualidade via mentoria e review, e traduzir tecnologia para negócio. Habilidade que determina se você avança na carreira ou fica como individual contributor sênior.",
    summary: "Liderança técnica não é título — é comportamento. Um tech lead eficaz faz cinco coisas: clarifica a direção técnica do time (visão, padrões, decisões) para que todos trabalhem coerentemente; eleva a qualidade do time via code review, pair programming e mentoria — não só conserta o código mas ensina como pensar; faz tradeoffs explícitos com contexto completo em vez de decidir autoritariamente; comunica tecnologia para negócio traduzindo constraints técnicos em impacto e risco; e cria condições para o time entregar sem dependência de uma única pessoa. Tech lead que faz tudo sozinho é um individual contributor com título — o que multiplica é criar condições para que outros também deliveriem bem.",
    keypoints: [
      {
        title: "Liderança sem hierarquia — influência por expertise",
        body: "Você lidera sendo a referência técnica, documentando bem, fazendo reviews de alta qualidade, e propondo soluções claras — não por ter um título. Influência por autoridade é frágil e resistida; influência por expertise é respeitada e seguida organicamente. 'O que você faria aqui?' é a pergunta que você quer que o time faça naturalmente.",
      },
      {
        title: "Decisões técnicas: facilitar, não impor",
        body: "Tech lead eficaz clarifica constraints e contexto, propõe opções com tradeoffs explícitos, e facilita a decisão do time em vez de decidir sozinho. Quando a decisão é sua, explique o raciocínio completo — o time que entende o porquê implementa melhor e questiona quando o contexto muda. ADRs são a ferramenta que torna isso escalável.",
      },
      {
        title: "Mentoria técnica que eleva o time",
        body: "Code review com ensinamento, não só apontando erros — explique o princípio por trás da correção. Pair programming intencional em partes complexas do sistema onde o conhecimento precisa ser transferido. 1:1 técnico para entender onde a pessoa quer crescer e criar oportunidades alinhadas. O objetivo é que o time inteiro possa tomar boas decisões técnicas sem depender de você em cada uma.",
      },
      {
        title: "Visibilidade de riscos — ponte com o negócio",
        body: "Identifica e comunica dívida técnica, single points of failure, dependências críticas e riscos arquiteturais com impacto de negócio traduzido. Não 'temos débito técnico no módulo de pagamento' mas 'o módulo de pagamento tem lógica duplicada em três lugares — risco de inconsistência que pode causar cobranças incorretas, estimo 2 semanas para resolver antes de escalarmos para novos mercados'.",
      },
      {
        title: "Redução de bus factor — documentação e onboarding",
        body: "Tech lead bom reduz o bus factor do time. Documenta decisões arquiteturais (ADRs), escreve runbooks para operações críticas, cria guias de onboarding que permitem que um novo dev contribua em dias em vez de semanas. Quando você é o único que sabe como algo funciona, isso é um risco para o time — não um sinal de valor.",
      },
      {
        title: "O que tech lead NÃO é",
        body: "Tech lead não é gerente de pessoas — isso é papel do engineering manager. Não é o único que pode fazer code review — é quem eleva a qualidade geral do processo. Não é arquiteto que decide tudo sozinho — é facilitador de decisões técnicas. E definitivamente não é quem faz tudo sozinho para garantir que saia certo — isso cria dependência, esgota, e não escala.",
      },
    ],
    interview: [
      {
        q: "Como você lideraria tecnicamente sem ter autoridade formal?",
        a: "Através de expertise e consistência. Quando faço reviews de qualidade que ensinam em vez de só corrigir, o time passa a valorizar meu input naturalmente. Quando proponho soluções com tradeoffs explícitos em vez de apenas criticar, crio credibilidade. Quando documento decisões e raciocínio de forma que qualquer um possa entender, os outros passam a buscar minha perspectiva. Liderança técnica que precisa de autoridade formal para funcionar não é liderança — é gestão.",
        tip: "Resposta que demonstra modelo mental maduro sobre influência em engenharia.",
        level: "pleno",
      },
      {
        q: "Como você comunicaria débito técnico para um stakeholder de negócio que quer priorizar novas features?",
        a: "Traduzo para impacto de negócio e risco concreto. Não 'temos débito técnico no módulo de pagamentos' — mas 'o módulo de pagamentos tem lógica crítica sem cobertura de testes e duplicada em três lugares. Hoje isso significa que qualquer nova feature de pagamento leva 3x mais tempo e tem risco de regressão em produção. Estimativa: 3 semanas de refatoração agora reduzem o custo de cada feature de pagamento futura em ~50% e eliminam o risco de incidente de cobrança incorreta'. Apresento junto com opções e deixo a decisão com quem tem contexto de negócio.",
        tip: "Habilidade crítica de tech lead — transformar problema técnico em decisão de negócio informada.",
        level: "pleno",
      },
      {
        q: "Como você faria o onboarding de um novo engenheiro no time?",
        a: "Começo mapeando o que ele precisa saber nas primeiras duas semanas para ser autônomo nas tarefas básicas — não tudo de uma vez. Setup do ambiente com documentação atualizada (se não existe ou está desatualizada, esse é o primeiro sinal de um problema a resolver). Pair programming nas primeiras tasks para que ele veja como o time trabalha na prática. Apresentação das pessoas e seus papéis. Indicação dos documentos mais importantes: ADRs principais, runbooks, guia de arquitetura. E check-in no final da primeira semana para ver onde estão os bloqueios.",
        tip: "Onboarding eficaz é sinal de maturidade do time. Resposta que mostra que você pensa em documentação e autonomia, não em dependência.",
        level: "pleno",
      },
      {
        q: "Como você lidaria com um conflito técnico persistente no time?",
        a: "Primeiro separo o que é diferença de preferência (onde qualquer solução razoável serve) de diferença de princípio com impacto real. Para preferências: decisão rápida, seguimos em frente, ninguém morre. Para diferenças com impacto real: peço que os dois lados escrevam suas posições com tradeoffs explícitos — isso geralmente clarifica onde a discordância real está. Se ainda não há consenso, identifico quem tem mais contexto sobre o caso de uso e dou mais peso à perspectiva dessa pessoa. Se sou eu quem decide: explico o raciocínio completo, registro no ADR e garantimos que quem discordou entende por que essa foi a escolha.",
        tip: "Conflito técnico mal gerenciado cria rancor. A chave é tornar a discordância explícita e racional, não emocional.",
        level: "senior",
      },
      {
        q: "O que você faz diferente como tech lead para não se tornar um gargalo do time?",
        a: "Três princípios: evito ser o único ponto de aprovação para qualquer coisa (delegue autoridade de review, não só responsabilidade), invisto ativamente em distribuir conhecimento (pair programming, documentação, ADRs — para que o time possa tomar decisões sem mim), e crio critérios claros em vez de responder cada caso individualmente ('quando usar async messaging vs REST? quando o produtor e o consumidor têm ciclos de vida independentes ou carga diferente — aqui está o critério, decidam sem precisar me perguntar'). Tech lead que é gargalo falhou na missão principal.",
        tip: "A resposta que entrevistadores de staff level adoram ouvir — você pensa em escalabilidade do time, não só em execução.",
        level: "senior",
      },
    ],
    gotchas: [
      "Tech lead que faz tudo sozinho por não confiar no time — cria dependência, esgota e não escala.",
      "Decisão técnica sem explicar o raciocínio — resistência na implementação e o time repete os mesmos erros.",
      "Foco 100% em código, zero em comunicação e alinhamento — impacto limitado ao próprio trabalho.",
      "Evitar conflito técnico a todo custo — consenso falso é pior que decisão embasada com discordância documentada.",
      "Confundir tech lead com engineering manager — tech lead tem foco técnico e de qualidade, EM tem foco em pessoas e entregas.",
    ],
    resources: [
      { title: "The Staff Engineer's Path (Reilly)", url: "https://www.oreilly.com/library/view/the-staff-engineers/9781098118723/", kind: "livro" },
      { title: "Will Larson — Staff Engineer", url: "https://staffeng.com/", kind: "artigo" },
      { title: "Camille Fournier — The Manager's Path", url: "https://www.oreilly.com/library/view/the-managers-path/9781491973882/", kind: "livro" },
      { title: "Tanya Reilly — Being Glue", url: "https://noidea.dog/glue", kind: "artigo" },
    ],
  }

export default lideranca
