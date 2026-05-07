'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'
import { buildAntipatternsPdf } from '@/components/pdfs/AntipatternsPdf'
import type { AntiPatternItem } from '@/components/pdfs/AntipatternsPdf'
import { buildQuickRefPdf } from '@/components/pdfs/QuickRefPdf'
import type { QuickRefColumn } from '@/components/pdfs/QuickRefPdf'

// ── Paleta DI ────────────────────────────────────────────────────────────────
const C = '#22c55e'  // green — NUNCA omitir

// ── Metadados dos PDFs ────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas sobre DI em entrevista',
    type: 'qa',
    pages: 10,
    description: 'Recuperação ativa: IoC vs DI, constructor vs setter vs field, Service Locator anti-pattern, scopes (singleton/transient/request), data leak de scope, DI manual vs container, multi-tenancy, DI + Clean Architecture, e tudo que entrevistadores sênior realmente perguntam.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'quick-ref',
    title: 'Quick Ref',
    subtitle: 'Tipos de injeção, scopes e regras críticas num cartão',
    type: 'quick-ref',
    pages: 2,
    description: 'Cartão de bolso: tipos de injeção (constructor/setter/field) com pros/cons, scopes (singleton/transient/request) com casos de uso, regras críticas e o checklist de "new is glue".',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'Os 5 truques que grudam DI na memória',
    type: 'mnemonics',
    pages: 2,
    description: '"New is glue", IoC=Princípio DI=Técnica, Scopes S-D T-I R-P, Composition Root como Zona de New, e DI + Clean Architecture setas para dentro.',
    icon: '03',
    goal: 'Memória de longo prazo',
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns',
    subtitle: 'Os 4 erros críticos de DI em código de produção',
    type: 'antipatterns',
    pages: 3,
    description: 'Service Locator disfarçado, request-scoped em singleton (data leak), new concreto no domínio, e construtor com 15 parâmetros (SRP violado).',
    icon: '04',
    goal: 'Reconhecimento de padrão',
  },
]

// ── Dados: Q&A ────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'Por que DI ajuda em teste?',
    a: 'Sem DI: new concreto interno = impossível substituir sem banco real. Com DI: interface no construtor = você injeta fake em testes. new OrderService(fakeRepo, fakeEmail) → testa lógica em milissegundos sem infraestrutura.',
    tip: 'O argumento central: testabilidade arquitetural — o design habilita o teste, não o contrário.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre IoC e DI?',
    a: 'IoC é o princípio geral: controle de criação sai da classe. DI é uma técnica de IoC: você passa as dependências para dentro. Outras técnicas de IoC: Service Locator, callbacks, event handlers. IoC = Hollywood Principle ("don\'t call us, we\'ll call you").',
    tip: 'A distinção IoC vs DI demonstra rigor conceitual. DI é uma das formas de implementar IoC, não sinônimo.',
  },
  {
    level: 'Pleno',
    q: 'Tradeoff: DI manual vs container?',
    a: 'Manual: type-safe, sem magic, debugável, zero deps extras. Escala até ~100 classes. Container: auto-wire, scope declarativo, plugins. Escala bem em projeto grande. Custo: erros em runtime, curva, debug difícil. Corte: ~50-100 classes.',
    tip: 'Mencione o "composition root" — o ponto único onde tudo é instanciado. Saber o nome demonstra que você entende a arquitetura.',
  },
  {
    level: 'Pleno',
    q: 'O que é Service Locator e por que é anti-pattern?',
    a: 'Registry global onde você pede dependência container.get("X") dentro da classe. Parece DI, mas esconde dependência — assinatura não revela o que a classe precisa. Compilador não pega erros. Teste precisa configurar o locator inteiro. Mark Seemann: "Service Locator is an anti-pattern".',
    tip: 'Argumento decisivo: constructor injection = compilador garante. Service Locator = erro em runtime. Type safety vs descoberta tardia.',
  },
  {
    level: 'Pleno',
    q: 'Quando DI vira overkill?',
    a: 'Script pequeno, CLI simples, protótipo — instanciar direto é mais legível. Dependência pura sem efeito colateral (Math.round) não precisa ser injetada. Express handler trivial sem lógica de domínio. YAGNI antes de DI.',
    tip: 'A resposta madura menciona YAGNI. DI resolve um problema real — se o problema não existe no contexto, a solução é overhead.',
  },
  {
    level: 'Senior',
    q: 'Como scopes de lifecycle funcionam?',
    a: 'Singleton: uma instância por container — stateless services, pools. Transient: nova a cada injeção — objetos com estado. Request-Scoped: uma por request — UserContext, TenantContext. Bug crítico: singleton que injeta request-scoped fica preso na instância do primeiro request = data leak entre usuários.',
    tip: 'O data leak de request-scoped em singleton é o bug de segurança mais cobrado em NestJS/Spring. Usuário B vê dados do usuário A.',
  },
  {
    level: 'Senior',
    q: 'Como evitar ciclo de dependência?',
    a: 'Primeiro: ciclo é cheiro de design ruim. Investiga se há terceiro conceito escondido. Técnicas: extrair interface comum, usar evento (A publica, B consome), setter injection como último recurso. Container (Nest, Spring) detecta ciclo em startup — facilita refactor.',
    tip: 'A resposta sênior propõe refatoração como primeira opção. Circular dependency é sintoma de acoplamento — o fix é eliminar, não contornar.',
  },
  {
    level: 'Senior',
    q: 'Como DI se relaciona com DIP (SOLID)?',
    a: 'DIP: módulos de alto nível não dependem de baixo nível — ambos dependem de abstrações. DI é a técnica que implementa DIP: injete IOrderRepository, não PrismaOrderRepository. A implementação concreta é decidida no composition root. DIP = o quê (dependa de abstração). DI = o como (injete a abstração).',
    tip: 'Conectar DIP + DI demonstra que você entende a motivação por trás da técnica, não só a sintaxe.',
  },
  {
    level: 'Senior',
    q: 'Como você testa código com DI sem over-mocking?',
    a: 'Mock dependências externas (banco, email, API). Use objetos reais para dependências internas sem side effect (PriceCalculator puro). Use in-memory implementations para repositórios — mais realista que mock, mais rápido que banco. Over-mocking = teste frágil: qualquer refactor interno quebra o teste.',
    tip: 'Mencionar fake (in-memory implementation) vs mock (substituto programável) demonstra sofisticação em teste.',
  },
  {
    level: 'Senior',
    q: 'Como implementar DI em TypeScript sem framework?',
    a: 'Composition root no main.ts: instancie tudo manualmente. Infraestrutura primeiro (banco, email) → repositórios (dependem de infra) → services (dependem de repo) → controllers (dependem de service). Type-safe, debugável, sem reflection. Escala até ~100 classes.',
    tip: 'Demonstrar DI manual mostra que você entende o princípio, não só o framework. Entrevistadores NestJS ainda querem saber se você entende o porquê.',
  },
  {
    level: 'Senior',
    q: 'Como decorators TypeScript funcionam com DI containers?',
    a: '@injectable() + reflect-metadata: container usa Reflect.getMetadata("design:paramtypes", target) para descobrir tipos de construtor. @inject(TOKEN) especifica o token quando o tipo não é suficiente. Requer emitDecoratorMetadata: true no tsconfig. NestJS usa o mesmo mecanismo com @Injectable().',
    tip: 'Mencionar reflect-metadata e emitDecoratorMetadata demonstra que você entende o mecanismo por baixo do NestJS/Inversify.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre constructor, setter e field injection?',
    a: 'Constructor: deps obrigatórias, imutáveis, visíveis, compilador valida. Preferida. Setter: deps opcionais ou ciclos — risco de uso antes de set. Field: @Autowired/@Inject em campo — conveniente mas esconde deps, dificulta construção manual em teste. Evitar field injection sempre que possível.',
    tip: 'Field injection é o mais usado por preguiça, o mais problemático para teste. Constructor injection é mais verboso mas garante invariante de que o objeto está sempre pronto.',
  },
  {
    level: 'Senior',
    q: 'O que é composition root e por que é importante?',
    a: 'Único lugar onde new concreto é permitido. Aqui você instancia tudo e monta o grafo de dependências. Em apps web: main.ts, bootstrap. Importância: centraliza "qual implementação concreta", resto do código depende de abstrações, permite ver o grafo completo em um lugar. Violação: new espalhado pelo domínio.',
    tip: '"New is glue" — toda vez que você escreve new ConcreteClass() no domínio, você está colando. Composition root é onde você pode usar cola livremente.',
  },
  {
    level: 'Senior',
    q: 'Como DI se relaciona com Clean Architecture?',
    a: 'Clean Architecture: dependências apontam para o domínio (para dentro). DI é o mecanismo: domínio declara interface (IOrderRepository), infra implementa, container injeta de fora. Sem DI, a regra de dependência de Clean Architecture é teórica — sempre há um new escapando para o domínio.',
    tip: 'Frase chave: DI é o mecanismo operacional da regra de dependência de Clean Architecture. Sem DI, o conceito existe mas não funciona na prática.',
  },
  {
    level: 'Senior',
    q: 'Como containers resolvem configuração de ambiente (dev/test/prod)?',
    a: 'Módulos condicionais: registra implementação diferente por NODE_ENV. useFactory + ConfigService: criação assíncrona baseada em variáveis de ambiente. NestJS Test: overrideProvider().useValue(mockImpl). Em DI manual: if (isTest) { bind(IEmail).to(FakeEmail) } else { bind(IEmail).to(SendGrid) }.',
    tip: 'Swap de implementação por ambiente sem tocar no código de negócio é a prova prática de que DIP + DI funcionam.',
  },
  {
    level: 'Senior',
    q: 'Como implementar multi-tenancy com DI?',
    a: 'Request-scoped TenantContext extraído do JWT via middleware. Repositórios também request-scoped — filtram por tenant automaticamente. Armadilha: singleton com TenantContext injeto fica preso no primeiro tenant = data leak. Alternativa: tenantId como parâmetro de método (mais explícito, evita o scope problem).',
    tip: 'Multi-tenancy + DI combina scopes, Strategy e data leak. Consciência do risco de singleton + tenant state é a resposta sênior.',
  },
  {
    level: 'Senior',
    q: 'Como migrar código legado (sem DI) para testável (com DI)?',
    a: 'Processo incremental: (1) Identifique seams — new concreto dentro de métodos. (2) Extraia interface mínima (ISP). (3) Adicione parâmetro ao construtor com default: constructor(private db: IDB = new DB()) — backward compatible, override em teste. (4) Migre gradualmente para injeção obrigatória. Nunca migre tudo de uma vez.',
    tip: 'Parâmetro com default value como estratégia de migração incremental é o insight prático. Demonstra experiência com código legado, não só design greenfield.',
  },
  {
    level: 'Pleno',
    q: 'O que são fake implementations e quando preferir a mock?',
    a: 'Fake: implementação simplificada que funciona (InMemoryUserRepository — Map em vez de banco). Mock: substituto programável que verifica chamadas. Fake preferível quando: você quer testar comportamento complexo do colaborador, ou quando mock seria muito configuração. Mock para: verificar que método foi chamado, simular erros específicos.',
    tip: 'In-memory repository como fake é o padrão mais poderoso para teste de domínio. Mais realista que mock, mais rápido que banco real.',
  },
  {
    level: 'Senior',
    q: 'Quais são as limitações de DI containers?',
    a: 'Dependências de runtime (qual implementação depende de dados em runtime): factory que recebe dados = complexidade extra. Objetos de domínio (Order, User) não são providers. Performance: reflection tem overhead vs instanciação manual (negligível, mas real em hot paths). Debugging: "quem injetou isto?" requer ferramentas específicas.',
    tip: 'Limitação de objetos de domínio (você não injeta uma Order) é frequentemente esquecida. Demonstra que você sabe onde DI se aplica e onde não.',
  },
  {
    level: 'Senior',
    q: 'Como DI se aplica em arquiteturas serverless (Lambda)?',
    a: 'Container no bootstrap da função (fora do handler) — reutilizado entre invocações quentes. Singletons por instância de container, não por servidor. Cold start: container com reflection tem overhead — InversifyJS leve vs Spring pesado. DI manual em funções simples (1 responsabilidade). Warm instances reutilizam singletons.',
    tip: 'Cold start é o detalhe que demonstra experiência com produção serverless. Quarkus/Micronaut existem parcialmente por isso.',
  },
  {
    level: 'Senior',
    q: 'Como você documenta e mantém o grafo de dependências?',
    a: 'Composition root legível = documentação viva. Diagrama de camadas (controller → service → repo → db, sem seta para cima). NestJS DevTools visualiza o grafo. dependency-cruiser valida regras em CI — viola a regra de camada = build falha. Teste de arquitetura como invariante.',
    tip: 'Testes de arquitetura (dependency-cruiser, ArchUnit) demonstram maturidade. O grafo de dependências como invariante que o CI protege.',
  },
]

// ── Dados: Quick Ref ──────────────────────────────────────────────────────────

const QUICK_REF_COLUMNS: QuickRefColumn[] = [
  {
    sections: [
      {
        title: 'Tipos de Injeção',
        entries: [
          { key: 'Constructor', value: 'PREFERIDO — deps obrigatórias, imutáveis, compilador valida, testável com new' },
          { key: 'Setter', value: 'Deps opcionais ou ciclos — risco de uso antes de set' },
          { key: 'Field', value: 'EVITAR — esconde deps, dificulta construção manual em testes' },
        ],
      },
      {
        title: 'Scopes de Lifecycle',
        entries: [
          { key: 'Singleton', value: 'Uma instância por container — stateless services, conexões, config' },
          { key: 'Transient', value: 'Nova instância a cada injeção — objetos com estado' },
          { key: 'Request-Scoped', value: 'Uma por HTTP request — UserContext, TenantContext' },
          { key: 'Scope Leak', value: 'Singleton injeta request-scoped = data leak entre usuários', badge: '⚠️', badgeColor: '#ef4444' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Regras Críticas',
        entries: [
          { key: 'New is glue', value: 'new ConcreteClass() no domínio = cola permanente. Use só no composition root.' },
          { key: 'Composition Root', value: 'Único lugar onde new concreto é permitido. main.ts / bootstrap.' },
          { key: 'DIP', value: 'Injete IOrderRepository, não PrismaOrderRepository.' },
          { key: 'Service Locator', value: 'Anti-pattern: container.get() dentro da classe esconde deps.' },
          { key: 'Manual vs Container', value: 'Até ~100 classes: manual. Acima: container compensa.' },
        ],
      },
      {
        title: 'Checklist de Saúde',
        entries: [
          { key: '✓', value: 'Construtor lista todas as dependências?' },
          { key: '✓', value: 'Nenhum new concreto fora do composition root?' },
          { key: '✓', value: 'Dependências são interfaces, não implementações?' },
          { key: '✓', value: 'Scopes corretos (singleton stateless, request para contexto)?' },
          { key: '✓', value: 'Ciclos de dependência ausentes?' },
          { key: '✓', value: 'Possível criar o objeto em teste sem framework?' },
        ],
      },
    ],
  },
]

// ── Dados: Mnemônicos ─────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: '"New is glue" — new concreto = cola permanente',
    trick: 'NEW = COLA',
    expansion: [
      ['new ConcreteClass()', 'Cola aquela dependência para sempre no código'],
      ['Composition Root', 'A única zona onde você pode usar cola livremente'],
      ['Domínio/Services', 'Zona livre de cola — injete abstrações'],
    ],
    explanation: 'Toda vez que você escreve new ConcreteClass() dentro de outra classe, você está "colando" aquela dependência. Não dá para descolar sem mexer no código. DI = não use cola no domínio, concentre no composition root.',
    example: 'new PostgresDB() dentro de OrderService = impossível testar sem banco. IOrderRepository no construtor = new OrderService(fakeRepo) no teste.',
    why: '"New is glue" é a frase mais memorável de DI. Se você a citar com contexto, o entrevistador sabe que você entende o princípio.',
  },
  {
    label: 'IoC é o princípio, DI é a técnica',
    trick: 'I-P T-T (IoC=Princípio, DI=Técnica)',
    expansion: [
      ['IoC', 'Inversão de Controle — princípio. "Não me chame, eu te chamarei."'],
      ['DI', 'Dependency Injection — técnica de IoC. Você passa a dependência para dentro.'],
      ['Outras técnicas IoC', 'Service Locator (anti-pattern), callbacks, event handlers'],
    ],
    explanation: 'Hollywood Principle é IoC. DI é uma das formas de implementar IoC. Service Locator também é IoC mas não é DI — e é um anti-pattern. A distinção importa em entrevistas arquiteturais.',
    example: 'Express: você não chama o framework, ele chama sua função. DI: você não busca deps, o container entrega para você.',
    why: 'Confundir IoC e DI é sinal de que você só conhece o framework, não o princípio. A distinção demonstra rigor conceitual.',
  },
  {
    label: 'Scopes: "Singleton Divide, Transient Isola, Request Protege"',
    trick: 'S-D T-I R-P',
    expansion: [
      ['S-D Singleton Divide', 'Uma instância compartilhada por todos — divide o objeto'],
      ['T-I Transient Isola', 'Nova instância a cada injeção — isola cada uso'],
      ['R-P Request Protege', 'Uma por request — protege dados entre usuários'],
    ],
    explanation: 'A escolha de scope errada causa bugs silenciosos ou data leaks. Singleton = stateless. Transient = stateful isolado. Request = contexto de usuário isolado.',
    example: 'Singleton com UserContext request-scoped injetado = bug: UserContext do primeiro request para sempre. Todos os usuários veem dados do usuário 1.',
    why: 'Data leak de scope é o bug de segurança mais cobrado em NestJS/Spring. Saber a causa pela mecânica de scopes é a resposta sênior.',
  },
  {
    label: 'Composition Root: "Só ali use new livremente"',
    trick: 'COMPOSITION ROOT = ZONA DE NEW',
    expansion: [
      ['Composition Root', 'main.ts / app.module.ts / bootstrap — único new concreto'],
      ['Domínio', 'Zona livre de new — depende de abstrações'],
      ['Infraestrutura', 'Implementa as abstrações — está no composition root'],
    ],
    explanation: 'O composition root é a zona franca do new. É onde você instancia tudo e monta o grafo. Fora dali, new concreto é suspeito de violar DIP.',
    example: 'main.ts: const db = new PrismaDB(); const repo = new UserRepo(db); const service = new UserService(repo). Nenhum new em UserService.',
    why: 'Saber nomear e definir o composition root demonstra que você entende DI como arquitetura, não só como anotação de framework.',
  },
  {
    label: 'DI + Clean Architecture: "Setas para dentro, implementação de fora"',
    trick: 'SETAS PARA DENTRO. IMPL DE FORA.',
    expansion: [
      ['Clean Arch', 'Regra de dependência: setas apontam para o domínio'],
      ['DI', 'Mecanismo: domínio declara interface, infra implementa, container injeta'],
      ['Resultado', 'Domínio testável sem infra. Infra trocável sem tocar no domínio.'],
    ],
    explanation: 'Clean Architecture define a regra (setas para dentro). DI é o mecanismo que a implementa. Sem DI, a regra é teórica — sempre há um new escapando para o domínio.',
    example: 'OrderService depende de IOrderRepository (seta para dentro = domínio). PrismaOrderRepository implementa IOrderRepository (infra aponta para domínio). Container injeta PrismaOrderRepository no construtor.',
    why: 'A frase conecta o porquê (Clean Architecture) com o como (DI). É o argumento que justifica a adoção de DI além de "facilita teste".',
  },
]

// ── Dados: Anti-patterns ──────────────────────────────────────────────────────

const ANTIPATTERNS: AntiPatternItem[] = [
  {
    title: 'Service Locator — dependência escondida',
    badDesc: 'Injetar o container e buscar deps internamente — assinatura do construtor mente',
    badCode: [
      { t: 'class OrderService {\n', c: '#ef4444' },
      { t: '  constructor(\n', c: '#e2e8f0' },
      { t: '    private container: Container // ❌ container injetado\n', c: '#ef4444' },
      { t: '  ) {}\n\n', c: '#e2e8f0' },
      { t: '  async create(dto) {\n', c: '#e2e8f0' },
      { t: '    // Deps escondidas — compilador não valida\n', c: '#64748b' },
      { t: '    const repo = this.container.get(\'OrderRepo\')\n', c: '#ef4444' },
      { t: '    const email = this.container.get(\'EmailSender\')\n', c: '#ef4444' },
      { t: '  }\n}', c: '#e2e8f0' },
    ],
    goodDesc: 'Constructor injection explícito — deps visíveis, type-safe, testável',
    goodCode: [
      { t: 'class OrderService {\n', c: '#4ade80' },
      { t: '  constructor(\n', c: '#e2e8f0' },
      { t: '    private repo: IOrderRepository,  // ✅\n', c: '#4ade80' },
      { t: '    private email: IEmailSender,     // ✅\n', c: '#4ade80' },
      { t: '  ) {}\n\n', c: '#e2e8f0' },
      { t: '  // Teste: new OrderService(fakeRepo, fakeEmail)\n', c: '#94a3b8' },
      { t: '  // Compilador garante que deps estão presentes\n', c: '#94a3b8' },
      { t: '}', c: '#e2e8f0' },
    ],
    why: 'Service Locator é IoC mas não é DI — esconde dependências. Compilador não valida. Teste precisa configurar locator inteiro. DI por construtor: compilador garante tudo na criação do objeto.',
  },
  {
    title: 'Request-scoped em singleton — data leak crítico',
    badDesc: 'Singleton que injeta dependência request-scoped fica preso na instância do primeiro request',
    badCode: [
      { t: '// TenantContext: uma instância por request\n', c: '#64748b' },
      { t: '@Injectable({ scope: Scope.REQUEST })\n', c: '#94a3b8' },
      { t: 'class TenantContext { tenantId: string }\n\n', c: '#94a3b8' },
      { t: '// ❌ Singleton injeta request-scoped\n', c: '#ef4444' },
      { t: '@Injectable() // scope DEFAULT = singleton\n', c: '#ef4444' },
      { t: 'class ProductService {\n', c: '#ef4444' },
      { t: '  constructor(private tenant: TenantContext) {}\n', c: '#ef4444' },
      { t: '  // tenant.tenantId = sempre o do 1º request!\n}', c: '#ef4444' },
    ],
    goodCode: [
      { t: '// ✅ ProductService também request-scoped\n', c: '#4ade80' },
      { t: '@Injectable({ scope: Scope.REQUEST })\n', c: '#4ade80' },
      { t: 'class ProductService {\n', c: '#4ade80' },
      { t: '  constructor(private tenant: TenantContext) {}\n', c: '#4ade80' },
      { t: '  // Nova instância por request — isolado\n', c: '#64748b' },
      { t: '}\n\n', c: '#e2e8f0' },
      { t: '// OU: receba tenantId como parâmetro de método\n', c: '#4ade80' },
      { t: '@Injectable() // Singleton OK se sem estado de request\n', c: '#4ade80' },
      { t: 'class ProductService {\n', c: '#4ade80' },
      { t: '  findAll(tenantId: string) { ... }\n}', c: '#4ade80' },
    ],
    goodDesc: 'Service também request-scoped, ou tenantId como parâmetro de método',
    why: 'Singleton é criado uma vez. Request-scoped injetado nele fica preso na instância do primeiro request. Usuário B vê dados do usuário A. Bug de segurança crítico e silencioso.',
  },
  {
    title: 'New concreto no domínio — viola DIP',
    badDesc: '"New is glue" — new concreto no service cola aquela dependência permanentemente',
    badCode: [
      { t: 'class OrderService {\n', c: '#ef4444' },
      { t: '  // ❌ Dependências concretas coladas\n', c: '#ef4444' },
      { t: '  private repo = new PrismaOrderRepository()\n', c: '#ef4444' },
      { t: '  private email = new SendGridEmailSender(\n', c: '#ef4444' },
      { t: '    process.env.SENDGRID_KEY!\n', c: '#ef4444' },
      { t: '  )\n\n', c: '#e2e8f0' },
      { t: '  // Teste sem Prisma + SendGrid? Impossível.\n', c: '#64748b' },
      { t: '}', c: '#e2e8f0' },
    ],
    goodCode: [
      { t: 'class OrderService {\n', c: '#4ade80' },
      { t: '  constructor(\n', c: '#e2e8f0' },
      { t: '    private repo: IOrderRepository,\n', c: '#4ade80' },
      { t: '    private email: IEmailSender,\n', c: '#4ade80' },
      { t: '  ) {}\n', c: '#e2e8f0' },
      { t: '  // Teste: new OrderService(fakeRepo, fakeEmail)\n', c: '#64748b' },
      { t: '  // Prod: composition root injeta implementações reais\n}\n', c: '#64748b' },
      { t: '// main.ts:\n', c: '#94a3b8' },
      { t: 'const repo = new PrismaOrderRepository(prisma)\n', c: '#4ade80' },
      { t: 'const email = new SendGridEmailSender(key)\n', c: '#4ade80' },
      { t: 'const svc = new OrderService(repo, email)', c: '#4ade80' },
    ],
    goodDesc: 'Interfaces no construtor, implementações concretas só no composition root',
    why: 'DIP + DI: dependa de abstrações (IOrderRepository), o container/composition root injeta a implementação correta. Domínio não sabe se está falando com Prisma ou in-memory fake.',
  },
  {
    title: 'Construtor com 15 dependências — SRP violado',
    badDesc: 'DI revelou o problema: classe que precisa de 15 deps está fazendo coisas demais',
    badCode: [
      { t: '@Injectable()\n', c: '#ef4444' },
      { t: 'class OrderService {\n', c: '#ef4444' },
      { t: '  constructor(\n', c: '#e2e8f0' },
      { t: '    private orderRepo: IOrderRepository,\n', c: '#ef4444' },
      { t: '    private productRepo: IProductRepository,\n', c: '#ef4444' },
      { t: '    private userRepo: IUserRepository,\n', c: '#ef4444' },
      { t: '    private email: IEmailSender,\n', c: '#ef4444' },
      { t: '    private sms: ISMSSender,\n', c: '#ef4444' },
      { t: '    private inventory: IInventoryService,\n', c: '#ef4444' },
      { t: '    private payment: IPaymentGateway,\n', c: '#ef4444' },
      { t: '    private pricing: IPricingService,\n', c: '#ef4444' },
      { t: '    private audit: IAuditLogger,\n', c: '#ef4444' },
      { t: '    // ... mais 6 deps\n  ) {}\n}', c: '#ef4444' },
    ],
    goodCode: [
      { t: '// ✅ Divida em services coesos\n', c: '#4ade80' },
      { t: 'class OrderCreationService {\n', c: '#4ade80' },
      { t: '  constructor(\n', c: '#e2e8f0' },
      { t: '    private orderRepo: IOrderRepository,\n', c: '#4ade80' },
      { t: '    private payment: IPaymentGateway,\n', c: '#4ade80' },
      { t: '    private notifier: IOrderNotifier, // Facade\n', c: '#4ade80' },
      { t: '  ) {}\n}\n', c: '#e2e8f0' },
      { t: 'class OrderNotifier implements IOrderNotifier {\n', c: '#4ade80' },
      { t: '  constructor(private email, private sms) {}\n}', c: '#4ade80' },
    ],
    goodDesc: 'Divida em classes coesas com 3-5 dependências — use Facade para agrupar',
    why: 'DI não causou o problema — revelou ele. Classe com 15 deps viola SRP. A solução é refatorar: dividir em classes menores, usar Facade para agrupar deps relacionadas.',
  },
]

// ── Builders ──────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'Dependency Injection',
    stackLabel: 'Arquitetura · IoC',
  }),
  'quick-ref': () => buildQuickRefPdf({
    columns: QUICK_REF_COLUMNS,
    accentColor: C,
    skillName: 'Dependency Injection',
    stackLabel: 'Arquitetura · IoC',
    tagline: 'Tipos de injeção, scopes e regras críticas',
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'Dependency Injection',
    stackLabel: 'Arquitetura · IoC',
  }),
  antipatterns: () => buildAntipatternsPdf({
    antipatterns: ANTIPATTERNS,
    accentColor: C,
    skillName: 'Dependency Injection',
    stackLabel: 'Arquitetura · IoC',
  }),
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function DependencyInjectionPdfs() {
  const [open, setOpen] = useState<PdfCard | null>(null)
  const hero = PDF_CARDS[0]
  const rest = PDF_CARDS.slice(1)

  return (
    <>
      <HeroCard card={hero} accent={C} onOpen={() => setOpen(hero)} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 16 }}>
        {rest.map(c => (
          <CollectionCard key={c.id} card={c} accent={C} onOpen={() => setOpen(c)} />
        ))}
      </div>
      {open && <PdfModal card={open} onClose={() => setOpen(null)} builders={PDF_BUILDERS} />}
    </>
  )
}
