/**
 * Catálogo de componentes genéricos de CareerStudy.
 *
 * Cada entrada descreve um componente reutilizável (visual ou PDF),
 * seus props principais e quais skills já o utilizam.
 *
 * Use este arquivo como índice de descoberta — importe os componentes
 * diretamente de seus módulos (não deste arquivo).
 */

// ── Tipos de catálogo ─────────────────────────────────────────────────────────

export type CatalogEntry = {
  /** Caminho relativo a src/components/ */
  module: string
  /** Descrição de uso e quando escolher este componente */
  description: string
  /** Props mínimos necessários (sem defaults) */
  props: string[]
  /** Slugs das skills que já instanciam este componente */
  usedBy: string[]
}

// ── Visuais ───────────────────────────────────────────────────────────────────

export const VISUAL_CATALOG: Record<string, CatalogEntry> = {
  VisuaisShell: {
    module: 'visuals/VisuaisShell',
    description:
      'Shell container que renderiza a barra de navegação lateral e o painel ativo. ' +
      'Todo arquivo *Visuais.tsx deve retornar este componente com um array de VisualDef.',
    props: [
      'visuals: VisualDef[]',
      'active: number',
      'onChange: (i: number) => void',
    ],
    usedBy: ['react', 'typescript', 'css', 'html', 'typeorm', 'node-js', 'nestjs', 'docker', 'vue', 'react-query', 'tailwind-css', 'terraform', 'playwright', 'agentic-workflows', 'microservices', 'ddd', 'solid', 'algoritmos-ds', 'dynamic-programming', 'owasp-api-top-10', 'slis-slos-slas', 'system-design', 'cqrs'],
  },

  ConceptCarousel: {
    module: 'visuals/ConceptCarousel',
    description:
      'Carrossel de slides com ilustração ReactNode à direita e texto estruturado à esquerda. ' +
      'Ideal para introduzir fundamentos e conceitos encadeados com progressão visual.',
    props: [
      'slides: Slide[]',
      'accentColor: string',
      'bgColor: string',
      'cardColor: string',
    ],
    usedBy: ['react', 'typescript', 'css', 'html', 'typeorm', 'node-js', 'nestjs'],
  },

  TreeExplorer: {
    module: 'visuals/TreeExplorer',
    description:
      'Explorador de árvore interativa com seleção de nó, painel de detalhes e mapa de tipos. ' +
      'Use para visualizar hierarquias como a Fiber tree do React ou árvores DOM/AST.',
    props: [
      'tree: TreeNode',
      'typeMap: Record<string, TreeNodeTypeMeta>',
      'accentColor: string',
      'bgColor: string',
      'cardColor: string',
      'card2Color: string',
    ],
    usedBy: ['react', 'ddd'],
  },

  ReRenderSimulator: {
    module: 'visuals/ReRenderSimulator',
    description:
      'Simulador de re-renders: seleciona cenário, clica para disparar, anima quais nós re-renderizam. ' +
      'Útil para demonstrar diferenças entre memo/useMemo/useCallback e prop drilling.',
    props: [
      'nodes: RRNode[]',
      'scenarios: Scenario[]',
      'accentColor: string',
      'fireColor: string',
      'safeColor: string',
      'bgColor: string',
      'card2Color: string',
    ],
    usedBy: ['react'],
  },

  HookTimeline: {
    module: 'visuals/HookTimeline',
    description:
      'Timeline horizontal de fases do ciclo de vida com código de exemplo por fase. ' +
      'Ideal para hooks lifecycle, pipeline de execução ou fases de build.',
    props: [
      'phases: TimelinePhase[]',
      'accentColor: string',
      'bgColor: string',
    ],
    usedBy: ['react', 'typeorm', 'nestjs', 'vue', 'terraform'],
  },

  CardCarousel: {
    module: 'visuals/CardCarousel',
    description:
      'Carrossel de cards com nome, assinatura, emoji, casos de uso e quando não usar. ' +
      'Ideal para comparar APIs similares (hooks, adapters, drivers) lado a lado.',
    props: [
      'cards: CarouselCard[]',
      'accentColor: string',
      'bgColor: string',
      'cardColor: string',
    ],
    usedBy: ['react', 'typescript', 'html', 'typeorm', 'tailwind-css', 'vue', 'playwright'],
  },

  AntiPatternsGallery: {
    module: 'visuals/AntiPatternsGallery',
    description:
      'Galeria de anti-patterns com diff visual (errado x correto) e explicação técnica. ' +
      'Use para content de code review, boas práticas e armadilhas conhecidas.',
    props: [
      'patterns: AntiPattern[]',
      'accentColor: string',
      'bgColor: string',
      'cardColor: string',
    ],
    usedBy: ['react', 'typescript', 'css', 'html', 'typeorm', 'docker', 'vue', 'react-query', 'tailwind-css', 'aws', 'clean-architecture', 'terraform', 'playwright', 'agentic-workflows', 'microservices', 'ddd', 'solid', 'owasp-api-top-10', 'system-design', 'cqrs'],
  },

  PriorityPanel: {
    module: 'visuals/PriorityPanel',
    description:
      'Painel de prioridades com lista de conceitos agrupados por nível (essencial/importante/bônus). ' +
      'Use para planos de estudo, guias de foco pré-entrevista ou roadmaps.',
    props: [
      'priorities: Record<string, PriorityInfo>',
      'priorityOrder: string[]',
      'accentColor: string',
      'bgColor: string',
      'cardColor: string',
    ],
    usedBy: ['react'],
  },

  ProgressionMap: {
    module: 'visuals/ProgressionMap',
    description:
      'Mapa de progressão em 5 níveis (junior → especialista) com conceitos por nível e tooltip. ' +
      'Ideal para mostrar a jornada de domínio de uma tecnologia.',
    props: [
      'levels: ProgressionLevel[]',
      'accentColor: string',
      'bgColor: string',
    ],
    usedBy: ['react', 'docker', 'agentic-workflows', 'microservices', 'solid', 'algoritmos-ds', 'dynamic-programming', 'system-design', 'cqrs'],
  },

  FeaturesCarousel: {
    module: 'visuals/FeaturesCarousel',
    description:
      'Carrossel de features com diff before/after e descrição. ' +
      'Use para destacar novidades de versão, migrações ou comparações de API.',
    props: [
      'features: Feature[]',
      'accentColor: string',
      'bgColor: string',
      'cardColor: string',
    ],
    usedBy: ['react', 'css', 'vue', 'tailwind-css', 'dynamic-programming'],
  },

  // ── Novos visuais genéricos ────────────────────────────────────────────────

  FlowDiagram: {
    module: 'visuals/FlowDiagram',
    description:
      'Diagrama de fluxo interativo com nós e arestas clicáveis. ' +
      'Ideal para processos, pipelines e sequências de decisão.',
    props: [
      'nodes: FlowNode[]',
      'edges: FlowEdge[]',
      'accentColor: string',
      'bgColor: string',
    ],
    usedBy: [],
  },

  LayerStack: {
    module: 'visuals/LayerStack',
    description:
      'Visualização de camadas empilhadas (ex: OSI, arquitetura em camadas, stack de tecnologias). ' +
      'Cada camada tem cor, título, subtítulo e exemplos.',
    props: [
      'layers: Layer[]',
      'accentColor: string',
      'bgColor: string',
    ],
    usedBy: ['typescript', 'css', 'docker', 'vue', 'tailwind-css', 'aws', 'clean-architecture', 'terraform', 'playwright', 'agentic-workflows', 'microservices', 'ddd', 'owasp-api-top-10', 'slis-slos-slas', 'system-design', 'cqrs'],
  },

  RequestResponseFlow: {
    module: 'visuals/RequestResponseFlow',
    description:
      'Animação de request/response entre cliente e servidor com passos intermediários. ' +
      'Ideal para HTTP, REST, GraphQL e protocolos de comunicação.',
    props: [
      'steps: RequestStep[]',
      'accentColor: string',
      'bgColor: string',
    ],
    usedBy: [],
  },

  StateMachineExplorer: {
    module: 'visuals/StateMachineExplorer',
    description:
      'Explorador interativo de máquina de estados com transições animadas e painel de detalhes. ' +
      'Use para lifecycle de componentes, estados de conexão ou fluxos de autenticação.',
    props: [
      'states: MachineState[]',
      'transitions: Transition[]',
      'accentColor: string',
      'bgColor: string',
    ],
    usedBy: ['typescript', 'css', 'docker', 'vue', 'react-query', 'agentic-workflows', 'microservices', 'cqrs'],
  },

  ArchitectureDiagram: {
    module: 'visuals/ArchitectureDiagram',
    description:
      'Diagrama de arquitetura com blocos, conexões e legendas. ' +
      'Ideal para microservices, monolitos, sistemas distribuídos e arquiteturas cloud.',
    props: [
      'blocks: ArchBlock[]',
      'connections: ArchConnection[]',
      'accentColor: string',
      'bgColor: string',
    ],
    usedBy: [],
  },

  ComparisonTable: {
    module: 'visuals/ComparisonTable',
    description:
      'Tabela comparativa interativa com destaque de vencedor por linha e filtro por categoria. ' +
      'Use para X vs Y, feature matrix ou análise de trade-offs.',
    props: [
      'options: CompOption[]',
      'criteria: CompCriterion[]',
      'accentColor: string',
      'bgColor: string',
    ],
    usedBy: ['css', 'typeorm', 'docker', 'react-query', 'aws', 'clean-architecture', 'terraform', 'playwright', 'agentic-workflows', 'microservices', 'ddd', 'solid', 'algoritmos-ds', 'dynamic-programming', 'owasp-api-top-10', 'slis-slos-slas', 'system-design', 'cqrs'],
  },

  DecisionTree: {
    module: 'visuals/DecisionTree',
    description:
      'Árvore de decisão interativa com perguntas sim/não que leva a uma recomendação final. ' +
      'Ideal para guias de escolha de tecnologia ou estratégia de debugging.',
    props: [
      'root: DecisionNode',
      'accentColor: string',
      'bgColor: string',
    ],
    usedBy: ['typescript', 'html', 'vue', 'react-query', 'tailwind-css', 'aws', 'clean-architecture', 'agentic-workflows', 'microservices', 'ddd', 'solid', 'algoritmos-ds', 'dynamic-programming', 'owasp-api-top-10', 'slis-slos-slas', 'system-design', 'cqrs'],
  },

  ProConMatrix: {
    module: 'visuals/ProConMatrix',
    description:
      'Matriz de prós e contras com peso relativo e pontuação final por opção. ' +
      'Use para tomada de decisão técnica estruturada.',
    props: [
      'options: ProConOption[]',
      'accentColor: string',
      'bgColor: string',
    ],
    usedBy: ['css', 'microservices', 'system-design'],
  },

  Speedometer: {
    module: 'visuals/Speedometer',
    description:
      'Velocímetro animado para visualizar métricas de performance (ex: latência, throughput, score). ' +
      'Ideal para comparar benchmarks ou mostrar limites de SLOs.',
    props: [
      'value: number',
      'min: number',
      'max: number',
      'label: string',
      'accentColor: string',
      'bgColor: string',
    ],
    usedBy: [],
  },

  DataFlowSankey: {
    module: 'visuals/DataFlowSankey',
    description:
      'Diagrama Sankey de fluxo de dados com volume proporcional entre nós. ' +
      'Ideal para mostrar transformações de dados, ETL e pipelines de processamento.',
    props: [
      'nodes: SankeyNode[]',
      'links: SankeyLink[]',
      'accentColor: string',
      'bgColor: string',
    ],
    usedBy: [],
  },

  CodeStepper: {
    module: 'visuals/CodeStepper',
    description:
      'Execução passo a passo de um trecho de código com estado de variáveis e stack. ' +
      'Ideal para event loop, closures, async/await e algoritmos.',
    props: [
      'steps: CodeStep[]',
      'accentColor: string',
      'bgColor: string',
    ],
    usedBy: ['typescript', 'docker', 'vue', 'react-query', 'tailwind-css', 'clean-architecture', 'terraform', 'playwright', 'algoritmos-ds', 'dynamic-programming'],
  },

  QueryVisualizer: {
    module: 'visuals/QueryVisualizer',
    description:
      'Visualizador de plano de execução de query SQL/NoSQL com custo por nó. ' +
      'Ideal para otimização de queries, índices e JOIN strategies.',
    props: [
      'plan: QueryPlan',
      'accentColor: string',
      'bgColor: string',
    ],
    usedBy: [],
  },

  CommandPalette: {
    module: 'visuals/CommandPalette',
    description:
      'Paleta de comandos interativa com busca e categorias — estilo VS Code. ' +
      'Use para referência de CLI, atalhos de teclado ou APIs de comando.',
    props: [
      'commands: PaletteCommand[]',
      'accentColor: string',
      'bgColor: string',
    ],
    usedBy: [],
  },

  DiffViewer: {
    module: 'visuals/DiffViewer',
    description:
      'Visualizador de diff lado a lado com highlight de linhas adicionadas/removidas. ' +
      'Ideal para mostrar antes/depois, migrações de API e refactoring.',
    props: [
      'before: string',
      'after: string',
      'language: string',
      'accentColor: string',
      'bgColor: string',
    ],
    usedBy: ['typeorm', 'clean-architecture', 'tailwind-css', 'ddd', 'solid', 'cqrs'],
  },

  RegexPlayground: {
    module: 'visuals/RegexPlayground',
    description:
      'Playground interativo de expressões regulares com highlight de matches em tempo real. ' +
      'Use para regex, parsing e validação de padrões.',
    props: [
      'defaultPattern: string',
      'defaultInput: string',
      'accentColor: string',
      'bgColor: string',
    ],
    usedBy: [],
  },

  GanttTimeline: {
    module: 'visuals/GanttTimeline',
    description:
      'Timeline estilo Gantt para planos de projeto, releases ou roteiros de estudo. ' +
      'Cada tarefa tem duração, dependências e responsável.',
    props: [
      'tasks: GanttTask[]',
      'accentColor: string',
      'bgColor: string',
    ],
    usedBy: [],
  },

  EventTimeline: {
    module: 'visuals/EventTimeline',
    description:
      'Timeline de eventos cronológicos com cards de detalhes. ' +
      'Ideal para histórico de versões, incidentes ou evolução de uma tecnologia.',
    props: [
      'events: TimelineEvent[]',
      'accentColor: string',
      'bgColor: string',
    ],
    usedBy: [],
  },

  VersionTimeline: {
    module: 'visuals/VersionTimeline',
    description:
      'Timeline de versões de uma tecnologia com principais mudanças por release. ' +
      'Ideal para React versions, Node.js releases, breaking changes.',
    props: [
      'versions: VersionEntry[]',
      'accentColor: string',
      'bgColor: string',
    ],
    usedBy: ['typescript'],
  },

  MemoryDiagram: {
    module: 'visuals/MemoryDiagram',
    description:
      'Diagrama animado de heap e stack com alocações e referências de ponteiros. ' +
      'Ideal para garbage collection, closures e gerenciamento de memória.',
    props: [
      'frames: MemoryFrame[]',
      'accentColor: string',
      'bgColor: string',
    ],
    usedBy: [],
  },

  DataStructureAnimator: {
    module: 'visuals/DataStructureAnimator',
    description:
      'Animador interativo de estruturas de dados (array, linked list, stack, queue, tree, graph). ' +
      'Operações de insert/delete/search com animação passo a passo.',
    props: [
      'structure: StructureType',
      'initialData: unknown[]',
      'accentColor: string',
      'bgColor: string',
    ],
    usedBy: ['algoritmos-ds'],
  },

  BigOChart: {
    module: 'visuals/BigOChart',
    description:
      'Gráfico de complexidade Big-O com curvas para O(1), O(log n), O(n), O(n log n), O(n²). ' +
      'Marca complexidades de algoritmos selecionados pelo usuário.',
    props: [
      'algorithms: AlgorithmEntry[]',
      'accentColor: string',
      'bgColor: string',
    ],
    usedBy: ['algoritmos-ds'],
  },

  MindMap: {
    module: 'visuals/MindMap',
    description:
      'Mind map interativo com nós expansíveis e pan/zoom. ' +
      'Ideal para visão panorâmica de um ecossistema ou domínio de conhecimento.',
    props: [
      'root: MindMapNode',
      'accentColor: string',
      'bgColor: string',
    ],
    usedBy: [],
  },

  ConceptWeb: {
    module: 'visuals/ConceptWeb',
    description:
      'Grafo de conceitos com força (force-directed) e clique para expandir relacionamentos. ' +
      'Use para mostrar dependências entre conceitos e termos de um domínio.',
    props: [
      'nodes: ConceptNode[]',
      'edges: ConceptEdge[]',
      'accentColor: string',
      'bgColor: string',
    ],
    usedBy: [],
  },

  WordCloud: {
    module: 'visuals/WordCloud',
    description:
      'Nuvem de palavras com tamanho proporcional à frequência/importância. ' +
      'Ideal para termos-chave de uma skill, buzzwords de entrevista ou glossário visual.',
    props: [
      'words: WordEntry[]',
      'accentColor: string',
      'bgColor: string',
    ],
    usedBy: [],
  },

  AttackVectorDiagram: {
    module: 'visuals/AttackVectorDiagram',
    description:
      'Diagrama de vetores de ataque com severidade, CVSS e fluxo de exploração. ' +
      'Use para threat modeling, OWASP Top 10 e análise de vulnerabilidades.',
    props: [
      'vectors: AttackVector[]',
      'accentColor: string',
      'bgColor: string',
    ],
    usedBy: [],
  },

  AuthFlowAnimator: {
    module: 'visuals/AuthFlowAnimator',
    description:
      'Animador de fluxos de autenticação/autorização (OAuth2, JWT, SAML, OIDC). ' +
      'Cada passo do fluxo é destacado com payload e participantes.',
    props: [
      'steps: AuthStep[]',
      'accentColor: string',
      'bgColor: string',
    ],
    usedBy: [],
  },

  NetworkTopology: {
    module: 'visuals/NetworkTopology',
    description:
      'Diagrama de topologia de rede com nós, links, protocolos e zonas de segurança. ' +
      'Ideal para infraestrutura, VPCs, firewalls e balanceadores.',
    props: [
      'nodes: NetworkNode[]',
      'links: NetworkLink[]',
      'accentColor: string',
      'bgColor: string',
    ],
    usedBy: [],
  },

  CloudArchitecture: {
    module: 'visuals/CloudArchitecture',
    description:
      'Diagrama de arquitetura cloud com serviços AWS/GCP/Azure, regiões e zonas de disponibilidade. ' +
      'Ícones dos serviços e linhas de comunicação com latências.',
    props: [
      'services: CloudService[]',
      'connections: CloudConnection[]',
      'accentColor: string',
      'bgColor: string',
    ],
    usedBy: [],
  },

  ScalingSimulator: {
    module: 'visuals/ScalingSimulator',
    description:
      'Simulador de escalonamento horizontal vs vertical com gráficos de carga e custo. ' +
      'Ideal para demonstrar auto-scaling, HPA, VPA e limites de capacidade.',
    props: [
      'scenarios: ScalingScenario[]',
      'accentColor: string',
      'bgColor: string',
    ],
    usedBy: [],
  },

  PipelineVisualizer: {
    module: 'visuals/PipelineVisualizer',
    description:
      'Visualizador de pipeline CI/CD com estágios, jobs, artefatos e tempo de execução. ' +
      'Ideal para GitHub Actions, GitLab CI, Jenkins e ArgoCD.',
    props: [
      'stages: PipelineStage[]',
      'accentColor: string',
      'bgColor: string',
    ],
    usedBy: [],
  },

  ContainerDiagram: {
    module: 'visuals/ContainerDiagram',
    description:
      'Diagrama de containers e pods com volumes, redes, portas e health checks. ' +
      'Use para Docker Compose, Kubernetes manifests e arquiteturas de containers.',
    props: [
      'containers: ContainerNode[]',
      'networks: ContainerNetwork[]',
      'accentColor: string',
      'bgColor: string',
    ],
    usedBy: [],
  },

  IndexExplorer: {
    module: 'visuals/IndexExplorer',
    description:
      'Explorador interativo de índices de banco de dados com B-tree e busca animada. ' +
      'Ideal para PostgreSQL, MongoDB, Redis e estratégias de indexação.',
    props: [
      'indexType: IndexType',
      'data: IndexEntry[]',
      'accentColor: string',
      'bgColor: string',
    ],
    usedBy: [],
  },

  BurndownChart: {
    module: 'visuals/BurndownChart',
    description:
      'Gráfico burndown de progresso de estudo com linha ideal vs real. ' +
      'Ideal para acompanhar planos de estudo e metas de sprint.',
    props: [
      'data: BurndownPoint[]',
      'accentColor: string',
      'bgColor: string',
    ],
    usedBy: [],
  },

  SequenceDiagram: {
    module: 'visuals/SequenceDiagram',
    description:
      'Diagrama de sequência UML com atores, lifelines, activation bars e mensagens tipadas ' +
      '(sync, async, return, create, destroy). Suporta grupos (loop, alt, opt, par, ref) e ' +
      'seleção interativa de mensagem com painel de detalhes. ' +
      'Ideal para GraphQL, WebSocket, autenticação OAuth, TCP/TLS, NestJS middleware.',
    props: [
      'actors: SeqActor[]',
      'messages: SeqMessage[]',
      'groups?: SeqGroup[]',
      'accentColor: string',
      'bgColor: string',
      'title?: string',
      'description?: string',
    ],
    usedBy: ['docker', 'aws', 'react-query', 'playwright', 'agentic-workflows', 'microservices', 'owasp-api-top-10', 'system-design', 'cqrs'],
  },

  HeatMap: {
    module: 'visuals/HeatMap',
    description:
      'Grid interativo onde cor = intensidade de valor. Interpolação linear entre lowColor e highColor. ' +
      'Suporta hover (tooltip), click (painel de detalhes), células destacadas, rowGroups e legenda de gradiente. ' +
      'Ideal para complexidade por operação (algoritmos), custo de query (PostgreSQL/explain-analyze), ' +
      'distribuição de métricas (Prometheus/Grafana).',
    props: [
      'rows: string[]',
      'cols: string[]',
      'data: HeatCell[][]',
      'accentColor: string',
      'bgColor: string',
      'lowColor?: string',
      'highColor?: string',
      'highlighted?: { row: number; col: number }[]',
      'rowGroups?: HeatRowGroup[]',
      'valueFormatter?: (v: number) => string',
    ],
    usedBy: ['aws', 'algoritmos-ds', 'dynamic-programming'],
  },
}

// ── PDFs ──────────────────────────────────────────────────────────────────────

export const PDF_CATALOG: Record<string, CatalogEntry> = {
  QAReviewPdf: {
    module: 'pdfs/QAReviewPdf',
    description:
      'PDF de Q&A para recuperação ativa. Cada pergunta tem nível (pleno/sênior), ' +
      'resposta em HTML rico, bullets opcionais e dica. Gera capa + páginas de perguntas.',
    props: [
      'qa: QAItem[]',
      'accentColor: string',
      'skillName: string',
      'stackLabel: string',
    ],
    usedBy: ['react', 'typescript', 'css', 'html', 'typeorm', 'docker', 'vue', 'aws', 'clean-architecture', 'ddd', 'solid', 'owasp-api-top-10', 'slis-slos-slas', 'system-design', 'cqrs'],
  },

  CheatsheetPdf: {
    module: 'pdfs/CheatsheetPdf',
    description:
      'PDF de cheatsheet denso com seções: hooks, dependency array, regras, patterns, ' +
      'performance tips e mental models. Estruturado para referência rápida pré-entrevista.',
    props: [
      'skillName: string',
      'accentColor: string',
      'stackLabel: string',
      'sections: { hooks, depRows, rules, performanceTips, patterns, mentalModels }',
    ],
    usedBy: ['react', 'typescript', 'css', 'html', 'typeorm', 'docker', 'vue', 'aws', 'clean-architecture', 'owasp-api-top-10', 'slis-slos-slas', 'system-design', 'cqrs'],
  },

  MnemonicsPdf: {
    module: 'pdfs/MnemonicsPdf',
    description:
      'PDF de mnemônicos com cartões de memorização: sigla/truque verbal, expansão letra-a-letra, ' +
      'exemplo prático e âncora cognitiva. Ideal para regras com muitas variáveis.',
    props: [
      'mnemonics: MnemonicItem[]',
      'accentColor: string',
      'skillName: string',
      'stackLabel: string',
    ],
    usedBy: ['react', 'typescript', 'css', 'html', 'typeorm', 'docker', 'vue', 'clean-architecture', 'ddd', 'solid', 'owasp-api-top-10', 'slis-slos-slas'],
  },

  AntipatternsPdf: {
    module: 'pdfs/AntipatternsPdf',
    description:
      'PDF de anti-patterns com código errado x correto (tokens coloridos) e explicação técnica. ' +
      'Usa o formato CodeToken[] para highlight sem dependência de syntax highlighter.',
    props: [
      'antipatterns: AntiPatternItem[]',
      'accentColor: string',
      'skillName: string',
      'stackLabel: string',
    ],
    usedBy: ['react', 'typescript', 'css', 'html', 'typeorm', 'docker', 'vue', 'clean-architecture', 'ddd', 'solid', 'owasp-api-top-10', 'slis-slos-slas', 'system-design', 'cqrs'],
  },

  MindmapPdf: {
    module: 'pdfs/MindmapPdf',
    description:
      'PDF de mind map com página de categorias (tags essencial/avançado/normal) e página de checklist. ' +
      'Visão panorâmica do ecossistema da skill para identificar gaps antes de entrevista.',
    props: [
      'categories: MindmapCategory[]',
      'checklist: string[]',
      'accentColor: string',
      'skillName: string',
      'stackLabel: string',
    ],
    usedBy: ['react', 'css', 'html', 'typeorm', 'aws', 'clean-architecture', 'system-design', 'cqrs'],
  },

  CommandRefPdf: {
    module: 'pdfs/CommandRefPdf',
    description:
      'PDF de referência de comandos CLI organizados por categoria com flags e exemplos. ' +
      'Comandos destrutivos destacados com borda vermelha. Ideal para shells, ORMs e CLIs.',
    props: [
      'commands: CommandEntry[]',
      'skillName: string',
      'accentColor: string',
      'stackLabel: string',
    ],
    usedBy: ['typescript', 'typeorm'],
  },

  RecipeBookPdf: {
    module: 'pdfs/RecipeBookPdf',
    description:
      'PDF estilo cookbook com receitas prontas para casos de uso comuns. ' +
      'Cada receita tem ingredientes, passos numerados com código, variações e armadilhas.',
    props: [
      'recipes: Recipe[]',
      'skillName: string',
      'accentColor: string',
      'stackLabel: string',
    ],
    usedBy: ['css', 'typeorm'],
  },

  GlossaryPdf: {
    module: 'pdfs/GlossaryPdf',
    description:
      'PDF de glossário técnico ordenado alfabeticamente com separadores por letra. ' +
      'Cada termo tem pronúncia, definição, exemplo de uso e termos relacionados.',
    props: [
      'terms: GlossaryTerm[]',
      'skillName: string',
      'accentColor: string',
      'stackLabel: string',
    ],
    usedBy: [],
  },

  InterviewSimPdf: {
    module: 'pdfs/InterviewSimPdf',
    description:
      'PDF de simulado de entrevista com perguntas sem resposta visível e espaço para escrita à mão. ' +
      'Badges de nível (Pleno/Sênior), dicas discretas e separadores por categoria.',
    props: [
      'questions: InterviewQuestion[]',
      'skillName: string',
      'accentColor: string',
      'stackLabel: string',
    ],
    usedBy: [],
  },

  StudyPlanPdf: {
    module: 'pdfs/StudyPlanPdf',
    description:
      'PDF de plano de estudos com visão geral, semanas numeradas e recursos tipados por semana. ' +
      'Checkpoints de validação, metas como checklist e ícone por tipo de recurso.',
    props: [
      'weeks: StudyWeek[]',
      'skillName: string',
      'accentColor: string',
      'stackLabel: string',
    ],
    usedBy: [],
  },

  ErrorRefPdf: {
    module: 'pdfs/ErrorRefPdf',
    description:
      'PDF de referência de erros comuns com mensagem literal, causa, solução e diff errado/correto. ' +
      'Erros agrupados por categoria com badge de severidade (crítico/atenção/info).',
    props: [
      'errors: ErrorEntry[]',
      'skillName: string',
      'accentColor: string',
      'stackLabel: string',
    ],
    usedBy: ['typescript'],
  },

  PatternsPdf: {
    module: 'pdfs/PatternsPdf',
    description:
      'PDF de catálogo de design patterns com índice por categoria, intent, quando usar/evitar, ' +
      'participantes como badges e código de implementação.',
    props: [
      'patterns: DesignPattern[]',
      'skillName: string',
      'accentColor: string',
      'stackLabel: string',
    ],
    usedBy: ['typescript', 'ddd'],
  },

  ComparativeRefPdf: {
    module: 'pdfs/ComparativeRefPdf',
    description:
      'PDF de tabela comparativa entre N opções com critérios objetivos, destaque de vencedor ' +
      'por linha e seção de cenários recomendados. Ideal para X vs Y.',
    props: [
      'options: CompOption[]',
      'criteria: CompCriterion[]',
      'skillName: string',
      'accentColor: string',
      'stackLabel: string',
    ],
    usedBy: ['typescript', 'aws', 'vue', 'react-query', 'tailwind-css', 'ddd', 'solid', 'slis-slos-slas', 'system-design', 'cqrs'],
  },

  SecurityChecklistPdf: {
    module: 'pdfs/SecurityChecklistPdf',
    description:
      'PDF de checklist de segurança com resumo por severidade, checks agrupados por categoria ' +
      'e checkboxes para marcar à mão. Suporta CWE, OWASP e flag de testabilidade.',
    props: [
      'checks: SecurityCheck[]',
      'skillName: string',
      'accentColor: string',
      'stackLabel: string',
    ],
    usedBy: ['aws', 'owasp-api-top-10'],
  },

  QuickRefPdf: {
    module: 'pdfs/QuickRefPdf',
    description:
      'Cartão de referência ultra-compacto em A4 landscape com 2–3 colunas densas. ' +
      'Cada coluna tem seções com entradas key/value em monospace, badge opcional por entrada ' +
      '(ex: "⚠ destrutivo", "★ essencial") e footer com nome da skill. ' +
      'Ideal para skills de ferramenta/CLI: terraform, docker, git, kubectl.',
    props: [
      'columns: QuickRefColumn[]',
      'skillName: string',
      'accentColor: string',
      'stackLabel: string',
      'tagline?: string',
      'version?: string',
    ],
    usedBy: ['docker', 'tailwind-css', 'aws'],
  },
}

// ── Re-exports seletivos (tipos apenas) ───────────────────────────────────────
// Não re-exportamos builders/componentes para evitar bundle desnecessário.
// Importe diretamente do módulo de cada componente.

export type { VisualDef } from './visuals/VisuaisNav'
export type { Slide } from './visuals/ConceptCarousel'
export type { TreeNode, TreeNodeTypeMeta } from './visuals/TreeExplorer'
export type { RRNode, Scenario } from './visuals/ReRenderSimulator'
export type { TimelinePhase } from './visuals/HookTimeline'
export type { CarouselCard } from './visuals/CardCarousel'
export type { AntiPattern } from './visuals/AntiPatternsGallery'
export type { PriorityInfo } from './visuals/PriorityPanel'
export type { ProgressionLevel } from './visuals/ProgressionMap'
export type { Feature } from './visuals/FeaturesCarousel'
export type { QAItem } from './pdfs/QAReviewPdf'
export type { HookItem, PatternItem, DepRow, RuleItem } from './pdfs/CheatsheetPdf'
export type { MnemonicItem } from './pdfs/MnemonicsPdf'
export type { AntiPatternItem, CodeToken } from './pdfs/AntipatternsPdf'
export type { MindmapCategory, MindmapCategoryItem } from './pdfs/MindmapPdf'

// ── Re-exports dos novos PDFs ─────────────────────────────────────────────────
export type { CommandEntry, CommandRefPdfOpts } from './pdfs/CommandRefPdf'
export type { Recipe, RecipeBookPdfOpts } from './pdfs/RecipeBookPdf'
export type { GlossaryTerm, GlossaryPdfOpts } from './pdfs/GlossaryPdf'
export type { InterviewQuestion, InterviewSimPdfOpts } from './pdfs/InterviewSimPdf'
export type { StudyWeek, StudyPlanPdfOpts } from './pdfs/StudyPlanPdf'
export type { ErrorEntry, ErrorRefPdfOpts } from './pdfs/ErrorRefPdf'
export type { DesignPattern, PatternsPdfOpts } from './pdfs/PatternsPdf'
export type { CompOption, CompCriterion, CompScenario, ComparativeRefPdfOpts } from './pdfs/ComparativeRefPdf'
export type { SecurityCheck, SecurityChecklistPdfOpts } from './pdfs/SecurityChecklistPdf'

// ── Re-exports dos novos visuais genéricos ────────────────────────────────────
export type { FlowNode, FlowEdge, FlowGroup } from './visuals/FlowDiagram'
export type { Layer } from './visuals/LayerStack'
export type { FlowStep, FlowScenario } from './visuals/RequestResponseFlow'
export type { SMState, SMTransition } from './visuals/StateMachineExplorer'
export type { ArchBlock, ArchConnection, ArchZone } from './visuals/ArchitectureDiagram'
export type { ComparisonOption, ComparisonCriterion } from './visuals/ComparisonTable'
export type { DTNode } from './visuals/DecisionTree'
export type { ProConItem, ProConOption } from './visuals/ProConMatrix'
export type { SpeedometerDimension, SpeedometerOption } from './visuals/Speedometer'
export type { SankeyNode, SankeyFlow } from './visuals/DataFlowSankey'
export type { CodeStep, CodeStepperScenario } from './visuals/CodeStepper'
export type { QueryExample } from './visuals/QueryVisualizer'
export type { CLICommand } from './visuals/CommandPalette'
export type { DiffLine, DiffExample } from './visuals/DiffViewer'
export type { RegexExample } from './visuals/RegexPlayground'
export type { GanttTrack, GanttTask, GanttPhase } from './visuals/GanttTimeline'
export type { TimelineEvent, EventGroup } from './visuals/EventTimeline'
export type { VersionMilestone } from './visuals/VersionTimeline'
export type { MemoryRegion, MemorySlot, MemoryScenario } from './visuals/MemoryDiagram'
export type { DSOperation, DSExample } from './visuals/DataStructureAnimator'
export type { ComplexityClass, AlgorithmEntry } from './visuals/BigOChart'
export type { MindMapNode } from './visuals/MindMap'
export type { WebNode, WebEdge } from './visuals/ConceptWeb'
export type { WordItem } from './visuals/WordCloud'
export type { AttackVector } from './visuals/AttackVectorDiagram'
export type { AuthActor, AuthStep, AuthFlow } from './visuals/AuthFlowAnimator'
export type { NetworkNode, NetworkLink, NetworkZone } from './visuals/NetworkTopology'
export type { CloudService, CloudConnection, CloudRegion } from './visuals/CloudArchitecture'
export type { ScalingStrategy } from './visuals/ScalingSimulator'
export type { PipelineStage, Pipeline } from './visuals/PipelineVisualizer'
export type { Container, ContainerNetwork, ContainerVolume } from './visuals/ContainerDiagram'
export type { IndexNode, IndexExample } from './visuals/IndexExplorer'
export type { BurndownSeries, BurndownAnnotation } from './visuals/BurndownChart'
export type { SeqActor, SeqMessage, SeqGroup } from './visuals/SequenceDiagram'
export type { HeatCell, HeatRowGroup } from './visuals/HeatMap'
export type { QuickRefEntry, QuickRefSection, QuickRefColumn, QuickRefPdfOpts } from './pdfs/QuickRefPdf'
