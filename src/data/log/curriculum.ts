import type { CurriculumBlock, CurriculumTrack } from '@/types'

/**
 * Currículo por blocos (Iniciante → Intermediário → Avançado), uma trilha por assunto.
 * Lista fechada de propósito: só o que realmente aparece em entrevista sênior fullstack
 * gringa remota. Sem tópico de aprofundamento infinito.
 *
 * Mecânica: dentro do bloco, os tópicos podem ser estudados em qualquer ordem. Quando
 * todos estiverem cobertos, avisa que terminou — a prova (bilíngue, resposta em inglês)
 * decide se libera o próximo bloco ou se volta em algum conceito específico.
 */

export const SYSDESIGN_BLOCKS: CurriculumBlock[] = [
  {
    level: 'iniciante',
    title: 'Vocabulário e trade-offs básicos',
    goal: 'Sair de "zero teoria" para conseguir participar de uma conversa de design sem travar no vocabulário — ainda sem desenhar sistema nenhum sozinho.',
    paceRef: 'ideal cobrir até final de setembro/2026',
    topics: [
      {
        slug: 'hld-lld', title: 'HLD vs. LLD e "altitude" da resposta',
        why: 'Erro nº1 de entrevista é responder na altitude errada — cai sempre.',
        subtopics: ['O que muda de um HLD pra um LLD na prática (blueprint vs. função específica)', 'Como declarar a altitude assim que a pergunta chega ("vou responder em HLD...")', 'Exemplos de enunciado por altitude: "Design Instagram" (HLD) vs. "Design the Like Feature" (LLD)'],
      },
      {
        slug: 'functional-nonfunctional', title: 'Functional vs. Non-functional requirements',
        why: 'Base de toda pergunta de clarificação que o entrevistador espera ouvir.',
        subtopics: ['Diferença entre "o que faz" e "quão bem faz"', 'Por que non-functional requirements competem entre si (rápido custa caro)', 'Exemplo prático: Family App vs. Instagram com as mesmas features'],
      },
      {
        slug: 'clarifying-questions', title: 'As 5 perguntas antes de desenhar',
        why: 'É o que diferencia quem "desenha de cabeça" de quem interpreta requisito — sinal mais observado no início da entrevista.',
        subtopics: ['Quantos usuários e taxa de crescimento', 'Read-heavy vs. write-heavy (e por que otimiza o read path na maioria dos casos)', 'Que dado nunca pode ser perdido vs. que dado pode', 'Quanto de latência é tolerável (feed instantâneo vs. upload tolera espera)', 'Qual o custo aceitável — por que "mais componentes" não é "melhor design"'],
      },
      {
        slug: 'vertical-horizontal-scaling', title: 'Vertical vs. Horizontal scaling',
        why: 'Primeira decisão de qualquer sistema que cresce — aparece em praticamente todo design.',
        subtopics: ['Teto de capacidade e custo exponencial do vertical scaling', 'Single point of failure do vertical scaling', 'Por que horizontal scaling exige load balancer e storage compartilhado', 'Setups mistos (vertical + horizontal) na prática'],
      },
      {
        slug: 'load-balancer', title: 'Load balancer: mecanismo interno e papel na arquitetura',
        why: 'Componente citado em quase toda resposta de HLD — precisa saber o mecanismo, não só o nome.',
        subtopics: ['Health checks periódicos e detecção de servidor "dead"/"overloaded"', 'Algoritmo least-connections', 'Distribuição por peso (weighted routing) em setups mistos', 'Load balancer como reverse proxy', 'Por que precisa de redundância (dois load balancers)', 'Ferramentas reais: Nginx, HAProxy, AWS Elastic LB'],
      },
      {
        slug: 'stateless-stateful', title: 'Stateless vs. stateful',
        why: 'Teste clássico de entrevistador: "o que acontece se este servidor morrer agora?"',
        subtopics: ['Handle → Answer → Forget como definição prática de stateless', 'Por que sticky sessions parecem resolver mas reintroduzem o problema original', 'Teste "inside vs. outside do servidor" pra saber se um design é stateful', 'Shared storage para sessions e logs'],
      },
      {
        slug: 'dns-http-request-lifecycle', title: 'Ciclo de vida de uma request',
        why: 'Fundamento que sustenta qualquer diagrama depois — sem isso o resto não se sustenta.',
        subtopics: ['Resolução de nome via DNS (nome → IP)', 'HTTP vs. HTTPS e onde entra TLS', 'Diferença entre "request" e "network" como termos'],
      },
      {
        slug: 'latency-vs-bandwidth', title: 'Latência vs. bandwidth',
        why: 'Pergunta de clarificação que sinaliza rigor técnico, não achismo.',
        subtopics: ['Latência = tempo de ida e volta de uma request', 'Bandwidth = quanto dado cabe numa única request', 'Quando otimizar uma vs. a outra'],
      },
      {
        slug: 'caching-basics', title: 'Cache para "hot data"',
        why: 'Resolve um dos 3 cenários clássicos de falha (database overload) — cai sempre.',
        subtopics: ['O que torna um dado "hot" (muito acessado)', 'Redis como exemplo canônico', 'Quando cache não resolve (dado muda rápido demais, consistência crítica)'],
      },
      {
        slug: 'single-point-of-failure', title: 'Single point of failure e réplicas de banco de dados',
        why: 'Terceiro cenário clássico de falha — junto com scaling e cache, fecha o "tripé" básico.',
        subtopics: ['Réplicas de leitura vs. réplica primária', 'Armazenamento redundante (ex: S3) como mitigação'],
      },
      {
        slug: 'monolith-vs-microservices', title: 'Monolito vs. microsserviços',
        why: 'Pergunta certeira pra separar quem decide por requisito de quem decide por buzzword.',
        subtopics: ['Escalonamento independente (dedicar servidores por serviço vs. escalar tudo junto)', 'Tamanho de time como driver real de decisão', 'Custos de microsserviços: dependência de rede, debugging fragmentado', 'Monolito com satélites como meio-termo mais usado na prática', 'Armadilha de adotar microsserviços por modismo em time pequeno'],
      },
    ],
  },
  {
    level: 'intermediario',
    title: 'Primeiro desenho do zero',
    goal: 'Sair da teoria pura e conseguir desenhar um sistema simples sozinho, do zero, dentro do tempo de uma entrevista real — com framework repetível.',
    paceRef: 'ideal cobrir até meados de novembro/2026',
    topics: [
      {
        slug: 'design-framework', title: 'Framework fixo de sessão',
        why: 'É o roteiro que evita "branco" na primeira pergunta da entrevista.',
        subtopics: ['Requisitos → estimativas → API → dados → arquitetura → gargalos', 'Como estimar números (usuários, QPS, storage) sem dado exato', 'Quando parar de detalhar e seguir pro próximo passo do framework'],
      },
      {
        slug: 'caching-patterns', title: 'Cache-aside, write-through, write-back',
        why: 'Aprofunda o cache do bloco iniciante com o nível de detalhe que entrevistador sênior cobra.',
        subtopics: ['Cache-aside: aplicação gerencia o cache manualmente', 'Write-through: escreve no cache e no banco ao mesmo tempo', 'Write-back: escreve só no cache, sincroniza depois (risco de perda)', 'Quando cada padrão se justifica pelo requisito, não por hype'],
      },
      {
        slug: 'sql-vs-nosql', title: 'Banco relacional vs. NoSQL',
        why: 'Pergunta quase garantida em qualquer design com persistência.',
        subtopics: ['Quando relacional vence (consistência, relações complexas)', 'Quando NoSQL vence (escala horizontal, schema flexível)', 'Exemplos de banco por categoria (document, key-value, wide-column)'],
      },
      {
        slug: 'cap-theorem', title: 'CAP theorem',
        why: 'Vocabulário que sinaliza profundidade teórica sem precisar de matemática pesada.',
        subtopics: ['Consistência, disponibilidade, tolerância a partição — o trade-off real', 'Por que "escolher 2 de 3" é uma simplificação, mas ainda útil de citar', 'Exemplo de sistema que prioriza disponibilidade sobre consistência'],
      },
      {
        slug: 'message-queues', title: 'Filas de mensagem e processamento assíncrono',
        why: 'Resolve desacoplamento e picos de carga — aparece em qualquer sistema write-heavy.',
        subtopics: ['Por que desacoplar produtor e consumidor', 'Exemplo de uso: processar upload de foto sem travar a resposta ao usuário', 'Ferramentas reais: SQS, Kafka, RabbitMQ (nomes, não profundidade de implementação)'],
      },
      {
        slug: 'rate-limiting', title: 'Rate limiting — por que e como',
        why: 'Componente non-functional clássico, fácil de justificar com requisito real.',
        subtopics: ['Proteção contra abuso/spam e contra sobrecarga acidental', 'Onde o rate limiter fica na arquitetura (perto do load balancer/API gateway)'],
      },
      {
        slug: 'design-url-shortener', title: 'Prática: desenhar um encurtador de URL do zero',
        why: 'Sistema clássico de entrevista júnior-pleno — serve de calibração antes de subir a régua.',
        subtopics: ['45min cronometrado, sem IA', 'Aplicar o framework fixo do início ao fim', 'Comparar depois com uma solução de referência (vídeo/artigo)'],
      },
      {
        slug: 'design-like-system', title: 'Prática: desenhar um sistema de likes/contadores do zero (LLD)',
        why: 'Testa a transição HLD→LLD: da arquitetura geral para uma função específica.',
        subtopics: ['Como contabilizar likes sem gargalo de escrita', 'Consistência eventual aceitável (lembrar do "45 vs. 41 likes" do dia 1)'],
      },
    ],
  },
  {
    level: 'avancado',
    title: 'Sistemas com múltiplos componentes',
    goal: 'Desenhar sistemas com várias partes interagindo, no nível que uma entrevista de pleno-sênior realmente cobra — sem viés de "quanto mais complexo, melhor".',
    paceRef: 'ideal cobrir até dezembro/2026',
    topics: [
      {
        slug: 'design-news-feed', title: 'Design de feed de notícias/timeline',
        why: 'Um dos designs mais cobrados em entrevista sênior de produto social.',
        subtopics: ['Fan-out on write vs. fan-out on read — trade-off de cada um', 'Quando cada abordagem se justifica (número de seguidores, frequência de post)'],
      },
      {
        slug: 'design-chat-system', title: 'Design de chat em tempo real',
        why: 'Cobre requisitos de real-time, categoria própria de pergunta.',
        subtopics: ['WebSockets vs. polling', 'Presença online/offline', 'Garantia de entrega de mensagem (at-least-once vs. exactly-once)'],
      },
      {
        slug: 'design-rate-limiter-distributed', title: 'Rate limiter distribuído',
        why: 'Versão avançada do rate limiting do bloco intermediário — nível LLD com concorrência real.',
        subtopics: ['Token bucket', 'Sliding window', 'Coordenação entre múltiplas instâncias do rate limiter (estado compartilhado)'],
      },
      {
        slug: 'consistent-hashing', title: 'Consistent hashing',
        why: 'Separa quem só decorou "sharding" de quem entende o mecanismo por trás.',
        subtopics: ['Problema que resolve: redistribuição mínima ao adicionar/remover nó', 'Onde aparece na prática: cache distribuído, sharding de banco'],
      },
      {
        slug: 'circuit-breakers', title: 'Circuit breakers e tolerância a falha entre serviços',
        why: 'Cai sempre que a resposta envolve microsserviços — mostra maturidade de produção.',
        subtopics: ['Estados: closed, open, half-open', 'Por que evita falha em cascata entre serviços dependentes'],
      },
      {
        slug: 'tradeoff-defense', title: 'Defender trade-offs sob perguntas de follow-up',
        why: 'A habilidade real sendo testada em qualquer entrevista sênior — não o desenho em si.',
        subtopics: ['Responder "por que não X ao invés de Y" sem se contradizer', 'Admitir limitação da própria solução sem parecer inseguro'],
      },
      {
        slug: 'mock-interview-sysdesign', title: 'Mock interview completo de System Design',
        why: 'Único jeito de validar que o conjunto funciona sob pressão real, não só em teoria.',
        subtopics: ['45-60min, com feedback estruturado', 'Plataformas: Pramp, Interviewing.io, ou par'],
      },
    ],
  },
]

export const LIVECODING_BLOCKS: CurriculumBlock[] = [
  {
    level: 'iniciante',
    title: 'Fluência de sintaxe do zero',
    goal: 'Conseguir escrever um arquivo JS do zero, sem colar nada, sem travar em sintaxe básica — antes de qualquer problema de lógica/algoritmo.',
    paceRef: 'ideal cobrir até final de setembro/2026',
    topics: [
      {
        slug: 'variaveis-tipos', title: 'Variáveis, tipos primitivos, let/const/var',
        why: 'Base motora — sem isso automatizado, todo o resto vira esforço consciente extra.',
        subtopics: ['Diferença de escopo entre let/const/var', 'Tipos primitivos vs. referência', 'Coerção de tipo implícita — onde costuma confundir'],
      },
      {
        slug: 'operadores-condicionais', title: 'Operadores, comparação (==/===), condicionais',
        why: 'Erro comum relatado: travar até em lógica básica — este é o ponto exato disso.',
        subtopics: ['== vs. === e por que preferir sempre ===', 'if/else vs. switch — quando cada um é mais legível', 'Operadores lógicos e short-circuit (&&, ||, ??)'],
      },
      {
        slug: 'loops', title: 'for, while, for...of, for...in',
        why: 'Ferramenta mais usada em qualquer solução de DSA — precisa sair sem pensar.',
        subtopics: ['Quando usar for clássico vs. for...of vs. for...in', 'break e continue', 'Loop aninhado — armadilha de complexidade O(n²) sem perceber'],
      },
      {
        slug: 'funcoes', title: 'Função declarada vs. arrow function',
        why: 'Diferença de comportamento do this é pegadinha clássica e também uso prático diário.',
        subtopics: ['Hoisting de function declaration vs. function expression', 'Comportamento do this em cada tipo', 'Parâmetros default e rest/spread'],
      },
      {
        slug: 'arrays-metodos', title: 'Arrays nativos: map, filter, reduce, find, forEach',
        why: 'É a ferramenta mais usada em soluções de LeetCode fácil/médio em JS.',
        subtopics: ['Diferença prática entre map (transforma) e forEach (só itera)', 'reduce como ferramenta genérica — quando vale a pena usar', 'Encadear métodos (map().filter()) sem perder legibilidade'],
      },
      {
        slug: 'objetos-strings', title: 'Manipulação de objetos e strings',
        why: 'Aparece em quase todo problema de parsing/transformação de texto.',
        subtopics: ['split, slice, substring — diferenças', 'Template literals', 'Destructuring de objeto e array'],
      },
      {
        slug: 'escrever-do-zero', title: 'Prática: escrever uma função pequena do zero, sem apoio, cronometrado',
        why: 'É o teste real do bloco — não é reconhecer, é produzir sob página em branco.',
        subtopics: ['Editor vazio, sem colar nada', 'Sem IA/autocomplete', 'Anotar exatamente onde travou, se travar'],
      },
    ],
  },
  {
    level: 'intermediario',
    title: 'Decompor problema novo (LeetCode Easy)',
    goal: 'Sair de "sei a sintaxe" para "consigo quebrar um problema que nunca vi em passos, sozinho, dentro do tempo de entrevista".',
    paceRef: 'ideal cobrir até meados de outubro/2026',
    topics: [
      {
        slug: 'big-o-pratico', title: 'Big-O na prática',
        why: 'Entrevistador quer ouvir "isso é O(n) porque...", não a definição do quadro-negro.',
        subtopics: ['Justificar complexidade em voz alta durante a resolução', 'Reconhecer O(n²) escondido em loop aninhado', 'Big-O de tempo vs. de espaço'],
      },
      {
        slug: 'two-sum-hashmap', title: 'Hash map para lookup — padrão two-sum',
        why: 'Provavelmente o padrão mais repetido em entrevista de qualquer nível.',
        subtopics: ['Trade-off O(n²) força bruta vs. O(n) com hash map', 'Variações do padrão (three sum, pares com soma específica)'],
      },
      {
        slug: 'string-array-manipulation', title: 'Problemas clássicos de array/string',
        why: 'Cobre a categoria de pergunta "aquecimento" que abre praticamente toda entrevista técnica.',
        subtopics: ['Inverter string/array', 'Detectar duplicata', 'Agrupar itens (anagrama, contagem de frequência)'],
      },
      {
        slug: 'two-pointers', title: 'Two pointers',
        why: 'Padrão de altíssima frequência em problemas de array/string com O(n).',
        subtopics: ['Ponteiros nas extremidades (array ordenado)', 'Ponteiros na mesma direção (remover duplicata in-place)'],
      },
      {
        slug: 'sliding-window', title: 'Sliding window',
        why: 'Segundo padrão mais frequente depois de two pointers — cobre subarray/substring.',
        subtopics: ['Janela de tamanho fixo vs. variável', 'Quando sliding window substitui um loop aninhado O(n²)'],
      },
      {
        slug: 'recursao-simples', title: 'Recursão simples (sem DP ainda)',
        why: 'Base necessária antes de qualquer programação dinâmica.',
        subtopics: ['Caso base e caso recursivo', 'Call stack e risco de estouro em recursão profunda'],
      },
      {
        slug: 'narrar-resolucao', title: 'Prática: narrar em voz alta enquanto resolve',
        why: 'Comunicar raciocínio durante a resolução é parte avaliada — não só o código final.',
        subtopics: ['Verbalizar o plano antes de escrever código', 'Narrar em português primeiro, depois tentar em inglês'],
      },
    ],
  },
  {
    level: 'avancado',
    title: 'LeetCode Medium e simulação de entrevista',
    goal: 'Nível que efetivamente aparece em entrevista de pleno-sênior — sem entrar em Hard/nível competitivo, que não agrega ao objetivo.',
    paceRef: 'ideal cobrir até dezembro/2026',
    topics: [
      {
        slug: 'arvores-bfs-dfs', title: 'Árvores — BFS/DFS',
        why: 'Estrutura de dados mais cobrada depois de array/hash map em entrevista sênior.',
        subtopics: ['Travessia em largura (BFS) vs. profundidade (DFS)', 'Árvore binária de busca — invariante e operações básicas'],
      },
      {
        slug: 'grafos-basicos', title: 'Grafos básicos',
        why: 'Aparece em problemas de "conexão"/"caminho" — categoria recorrente em Medium.',
        subtopics: ['Representação por lista de adjacência', 'BFS/DFS aplicado a grafo (não só árvore)'],
      },
      {
        slug: 'dynamic-programming-intro', title: 'Programação dinâmica introdutória',
        why: 'É o tópico que mais gera "trava" relatada por candidatos — merece bloco próprio, sem exagero de profundidade.',
        subtopics: ['Memoização como otimização de recursão', 'Reconhecer quando um problema tem subestrutura ótima', 'Casos clássicos: Fibonacci memoizado, subida de escada'],
      },
      {
        slug: 'set-map-avancado', title: 'Set/Map em cenários combinados',
        why: 'Combina estruturas já vistas em problemas de nível Medium real.',
        subtopics: ['Set para checagem de existência O(1)', 'Map para contagem/agrupamento em problemas de duas passadas'],
      },
      {
        slug: 'mock-interview-livecoding', title: 'Mock interview completo de live coding',
        why: 'Valida sob pressão e cronômetro real, igual à sessão de System Design avançado.',
        subtopics: ['30-45min, com feedback', 'Praticar narrar em inglês, não só resolver'],
      },
    ],
  },
]

export const NARRATIVA_BLOCKS: CurriculumBlock[] = [
  {
    level: 'iniciante',
    title: 'Estrutura de resposta e vocabulário técnico base',
    goal: 'Sair do "sei explicar mas fica improvisado" para ter uma estrutura repetível de resposta, em português primeiro, com o vocabulário técnico em inglês já emparelhado.',
    paceRef: 'ideal cobrir em paralelo com as duas trilhas técnicas, sem prazo fixo próprio',
    topics: [
      {
        slug: 'star-method', title: 'Método STAR (Situation, Task, Action, Result)',
        why: 'É a estrutura padrão que recrutador espera ouvir — sem ela, a resposta soa improvisada mesmo com bom conteúdo técnico.',
      },
      {
        slug: 'vocabulario-tecnico-base', title: 'Vocabulário técnico-narrativo em inglês (bug, root cause, tradeoff, rollback, refactor, legacy code, tech debt)',
        why: 'Palavras que aparecem em quase toda pergunta técnica narrada — precisa sair automático, não traduzido na hora.',
      },
      {
        slug: 'traduzir-experiencia-propria', title: 'Traduzir uma experiência real sua (não genérica) para inglês, frase por frase',
        why: 'O travamento reportado é justamente na tradução ao vivo — praticar com o próprio caso reduz a carga cognitiva na hora da entrevista real.',
      },
    ],
    practiceQuestions: [
      {
        q_pt: 'Me conta sobre um bug difícil que você resolveu.',
        q_en: 'Tell me about a difficult bug you fixed.',
        hint: 'Situação (o que quebrou, impacto), Tarefa (o que precisava resolver), Ação (como investigou — logs, hipóteses, ferramentas), Resultado (o que corrigiu e o que aprendeu).',
      },
      {
        q_pt: 'Descreva uma vez que você discordou de uma decisão técnica do time.',
        q_en: 'Describe a time you disagreed with a technical decision on your team.',
        hint: 'Focar em como comunicou a discordância (dados, não emoção) e o desfecho — não em quem "ganhou" a discussão.',
      },
      {
        q_pt: 'Me fale sobre um projeto do qual você tem orgulho.',
        q_en: 'Tell me about a project you are proud of.',
        hint: 'Escolher um caso com decisão técnica própria, não só execução — e conseguir explicar o "porquê" da escolha.',
      },
    ],
  },
  {
    level: 'intermediario',
    title: 'Perguntas técnicas específicas por stack',
    goal: 'Responder perguntas que citam tecnologia específica (Node.js, React, bancos de dados) com profundidade real, não resposta genérica que serviria pra qualquer stack.',
    paceRef: 'ideal cobrir em paralelo com o avanço nas trilhas técnicas',
    topics: [
      {
        slug: 'desafios-nodejs-backend', title: 'Desafios específicos de Node.js/backend (concorrência, memory leak, escalar API)',
        why: 'Pergunta quase garantida dado seu perfil fullstack com forte peso em backend.',
      },
      {
        slug: 'desafios-react-frontend', title: 'Desafios específicos de React/frontend (performance, state management, bug de re-render)',
        why: 'Complementa o lado backend — entrevistador sênior costuma perguntar dos dois lados da stack.',
      },
      {
        slug: 'follow-up-tecnico', title: 'Responder perguntas de follow-up sem se contradizer ("por que não fez X?")',
        why: 'É onde resposta decorada quebra — follow-up exige entender o próprio caso, não só recitar.',
      },
    ],
    practiceQuestions: [
      {
        q_pt: 'Me explica o maior desafio que você já passou na sua carreira desenvolvendo em Node.js no backend.',
        q_en: 'Tell me about the biggest challenge you faced developing in Node.js on the backend.',
        hint: 'Escolher um caso técnico concreto (ex: race condition, memory leak, gargalo de performance) — evitar resposta genérica tipo "prazo apertado".',
      },
      {
        q_pt: 'Conte sobre uma vez que uma aplicação sua teve problema de performance. Como você identificou e resolveu?',
        q_en: 'Tell me about a time an application of yours had a performance issue. How did you identify and fix it?',
        hint: 'Mencionar ferramenta usada pra diagnosticar (profiler, logs, métricas) antes de ir direto pra solução.',
      },
      {
        q_pt: 'Como você lidaria com um bug em produção que só acontece às vezes (intermitente)?',
        q_en: 'How would you handle a bug in production that only happens sometimes (intermittent)?',
        hint: 'Estrutura de investigação: reproduzir, isolar variável, hipótese, logs adicionais — não "eu ficaria tentando até achar".',
      },
    ],
  },
  {
    level: 'avancado',
    title: 'Simulação completa de entrevista comportamental',
    goal: 'Responder qualquer pergunta narrativa/comportamental com fluência natural em inglês, sob pressão de tempo real, sem soar decorado nem improvisado.',
    paceRef: 'ideal cobrir na reta final, junto da fase de mock interviews das trilhas técnicas',
    topics: [
      {
        slug: 'perguntas-lideranca-conflito', title: 'Perguntas de liderança e conflito de time',
        why: 'Categoria recorrente em entrevista de pleno-sênior, cobra maturidade além do código.',
      },
      {
        slug: 'perguntas-decisao-arquitetura', title: 'Perguntas sobre decisão de arquitetura sob restrição (tempo, orçamento)',
        why: 'Conecta diretamente com a trilha de System Design — testa se você defende trade-off também falando, não só desenhando.',
      },
      {
        slug: 'mock-comportamental-completo', title: 'Mock de entrevista comportamental completa, cronometrado, em inglês',
        why: 'Valida sob pressão real — o objetivo final da trilha inteira.',
      },
    ],
    practiceQuestions: [
      {
        q_pt: 'Conte sobre uma vez que você teve que tomar uma decisão de arquitetura com prazo apertado e informação incompleta.',
        q_en: 'Tell me about a time you had to make an architecture decision under a tight deadline with incomplete information.',
        hint: 'Explicar o trade-off consciente que fez (não fingir que tinha certeza total) e o que faria diferente hoje.',
      },
      {
        q_pt: 'Descreva uma situação de conflito com um colega de time sobre uma abordagem técnica.',
        q_en: 'Describe a situation of conflict with a teammate over a technical approach.',
        hint: 'Foco em processo de resolução (dados, prototipagem, conversa) — nunca colocar o colega em posição ruim na narrativa.',
      },
      {
        q_pt: 'Qual foi o maior erro técnico que você já cometeu, e o que você aprendeu?',
        q_en: 'What was the biggest technical mistake you have made, and what did you learn from it?',
        hint: 'Escolher um erro real com consequência concreta, mas terminar em aprendizado aplicado depois — não em "não tenho nenhum".',
      },
    ],
  },
]

export function blocksFor(track: CurriculumTrack): CurriculumBlock[] {
  if (track === 'sysdesign') return SYSDESIGN_BLOCKS
  if (track === 'livecoding') return LIVECODING_BLOCKS
  return NARRATIVA_BLOCKS
}
