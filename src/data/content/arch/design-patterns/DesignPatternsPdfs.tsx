'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'
import { buildPatternsPdf } from '@/components/pdfs/PatternsPdf'
import type { DesignPattern } from '@/components/pdfs/PatternsPdf'
import { buildAntipatternsPdf } from '@/components/pdfs/AntipatternsPdf'
import type { AntiPatternItem } from '@/components/pdfs/AntipatternsPdf'

// ── Paleta Design Patterns ────────────────────────────────────────────────────
const C = '#0ea5e9'  // sky blue — NUNCA omitir

// ── Metadados dos PDFs ────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas sobre Design Patterns em entrevista',
    type: 'qa',
    pages: 10,
    description: 'Recuperação ativa: quando usar Strategy vs if/else, por que Singleton é anti-pattern, Decorator vs herança, Command + CQRS, Observer vs Pub/Sub, como testar patterns sem acoplar ao teste, e tudo que entrevistadores sênior realmente perguntam.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'patterns',
    title: 'Catálogo de Patterns',
    subtitle: 'Os 12 patterns mais usados com intent, quando usar e código',
    type: 'patterns',
    pages: 6,
    description: 'Catálogo rápido dos patterns de alto valor: Strategy, Observer, Command, Decorator, Adapter, Facade, Proxy, Factory, Builder, Repository, State, Chain of Responsibility. Intent, quando usar, exemplo TypeScript.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'Os 5 truques que grudam patterns na memória',
    type: 'mnemonics',
    pages: 2,
    description: 'GoF C-E-C (Criacional/Estrutural/Comportamental), estruturais A-D-F-P, Strategy vs State, YAGNI antes de GoF, e o mnemônico de Decorator vs herança.',
    icon: '03',
    goal: 'Memória de longo prazo',
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns',
    subtitle: 'Os 4 erros mais comuns ao usar design patterns',
    type: 'antipatterns',
    pages: 3,
    description: 'Strategy com uma estratégia só (YAGNI), Singleton como global state, Pattern Stacking em cascata, e Anemic Domain Model disfarçado de pattern.',
    icon: '04',
    goal: 'Reconhecimento de padrão',
  },
]

// ── Dados: Q&A ────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'Quando usar Strategy vs simples if/else?',
    a: 'if/else quando: ramos são 2-3, raramente mudam, sem comportamento complexo. Strategy quando: 5+ algoritmos, adicionados frequentemente, ou cada um tem complexidade própria. Red flag: Strategy com 1 implementação = overkill especulativo.',
    tip: 'Mencione OCP como motivador — adicionar nova estratégia sem modificar o contexto. Dê exemplo real: Pix/Cartão/Boleto como estratégias.',
  },
  {
    level: 'Pleno',
    q: 'Singleton é anti-pattern? Por quê?',
    a: 'Quase sempre em código de aplicação: esconde dependência, dificulta mock em teste, causa bug em concorrência, é global state mascarado. DI container gerencia scope singleton de forma testável. Exceções legítimas: config readonly, logger global.',
    tip: 'Explique por que DI container é superior — cria uma instância, injeta onde precisa, mantém testável. Entrevistador quer saber que você entende o problema real.',
  },
  {
    level: 'Pleno',
    q: 'Como Decorator se compara a herança?',
    a: 'Herança: estático em compile-time, gera explosão de subclasses para combinar features. Decorator: adiciona em runtime via composição — logging(caching(retry(handler))). Cada decorator = 1 responsabilidade. Express middleware é Decorator clássico.',
    tip: 'Use o exemplo de 3 comportamentos: herança = 7 subclasses, Decorator = 3 classes + composição livre.',
  },
  {
    level: 'Senior',
    q: 'Como Command se relaciona com CQRS e Event Sourcing?',
    a: 'Command GoF: ação como objeto — permite undo, fila. Em CQRS: Command é o objeto imutável de escrita, despachado para handler. Em Event Sourcing: Command gera Event persistido — estado é reconstruído reproduzindo eventos. Cadeia: Command → Handler → Event → Store.',
    tip: 'Conectar os três conceitos demonstra visão arquitetural. A cadeia Command → Event é o ponto que entrevistadores sênior verificam.',
  },
  {
    level: 'Senior',
    q: 'Observer vs Pub/Sub — qual a diferença real?',
    a: 'Observer: subject conhece observers, acoplamento direto, síncrono, in-process. Pub/Sub: publisher e subscriber não se conhecem, comunicam via broker, assíncrono, distribuível. Observer para state local (store → componentes), Pub/Sub para comunicação entre serviços.',
    tip: 'O detalhe que diferencia: Pub/Sub introduz latência e infra de broker, Observer é mais simples mas cria acoplamento direto. Trade-off real.',
  },
  {
    level: 'Senior',
    q: 'Como o Adapter funciona como Anti-Corruption Layer em DDD?',
    a: 'ACL em DDD é um Adapter que traduz entre modelo do domínio e modelo externo. Sem ACL: terminologia externa contamina o domínio. Com ACL: interface de porta no domínio (IOrderGateway), implementação no adapter com HTTP/ORM do sistema externo. Inversão de dependência + Adapter.',
    tip: '"Corruption" não é palavra aleatória — sem o layer, o modelo do domínio fica corrompido por estrutura externa.',
  },
  {
    level: 'Senior',
    q: 'Proxy pattern — onde você usa na prática?',
    a: 'Lazy loading (ORM cria proxy de entidade para carregar relações só quando acessadas), cache proxy (verifica cache antes de chamar o real), logging/monitoring (transparente), access control por objeto. Diferença de Decorator: Proxy controla acesso, Decorator adiciona comportamento.',
    tip: 'A distinção Proxy vs Decorator em intenção é o que entrevistadores GoF verificam. Proxy = controle de acesso; Decorator = adição de comportamento.',
  },
  {
    level: 'Senior',
    q: 'Como você testa código com patterns sem acoplar o teste à implementação?',
    a: 'Teste o contrato (interface), não a implementação. Strategy: teste cada estratégia isolada + contexto com estratégia fake — não teste se a estratégia foi chamada, teste o resultado. Observer: teste que o evento foi emitido. Decorator: teste o comportamento composto. Regra: mock dependências externas, use objeto real para internas.',
    tip: 'Over-mocking cria testes frágeis: qualquer refactor interno quebra o teste mesmo sem bug. Teste o comportamento observável externamente.',
  },
  {
    level: 'Pleno',
    q: 'Facade vs Adapter — qual a diferença?',
    a: 'Adapter: traduz uma interface para outra (um-para-um, compatibilidade). Facade: simplifica subsistema complexo atrás de interface única (muitos-para-um, conveniência). Adapter = traduz; Facade = esconde complexidade.',
    tip: 'GoF: Adapter = compatibilidade de interface; Facade = simplificação de subsistema. Ambos são wrappers, mas com intenções diferentes.',
  },
  {
    level: 'Pleno',
    q: 'Quando Builder se justifica vs construtor com parâmetros opcionais?',
    a: 'Builder quando: muitos campos opcionais (8+), validação de combinações necessária, imutável após construção. Muito usado em testes (Test Data Builder). Alternativa moderna: objeto de configuração com Partial<Config> + defaults. Builder é overkill para objetos simples.',
    tip: 'O Test Data Builder é o caso de uso mais prático e o que demonstra experiência real. new UserBuilder().withEmail().withRole("admin").build().',
  },
  {
    level: 'Senior',
    q: 'Template Method vs Strategy — quando cada um?',
    a: 'Template Method (herança): esqueleto fixo + slots para partes variáveis. Invariante importa mais que variante. Strategy (composição): algoritmo todo é substituível via injeção. Mais flexível, mais testável. Tendência moderna: Strategy como função de primeira classe.',
    tip: 'Mencionar funções de primeira classe como "Strategy sem cerimônia" demonstra que você entende que patterns resolvem problemas de linguagem — em JS/TS, muitos GoF patterns se simplificam.',
  },
  {
    level: 'Pleno',
    q: 'O que é o Null Object pattern?',
    a: 'Null Object implementa a interface com comportamento neutro. Em vez de if (logger !== null) logger.log() em todo lugar, você injeta NullLogger que não faz nada. Usos: logger opcional, feature flag desabilitada, permissão negada. Risco: pode mascarar erros de configuração.',
    tip: 'O risco de mascarar bugs é o que separa a resposta sênior: Null Object é útil para comportamento opcional intencional, não para esconder erros.',
  },
  {
    level: 'Senior',
    q: 'State pattern vs XState — quando usar cada um?',
    a: 'State pattern (GoF): implementação OO de máquina de estados — objeto delega comportamento ao estado atual. Para estados simples (3-5), switch pode ser mais legível. Para estados complexos com guards, ações e transições aninhadas, XState ou State pattern formal escalam melhor.',
    tip: 'Mencionar XState como alternativa moderna demonstra que você conhece o espaço além do GoF clássico.',
  },
  {
    level: 'Senior',
    q: 'Como decidir se um problema pede pattern ou solução simples?',
    a: 'Processo: (1) O problema existe agora? Se não, YAGNI. (2) O código está difícil de modificar/testar? Se não, está simples o suficiente. (3) A indireção paga a dívida? Cada pattern adiciona camada que precisa ser justificada. (4) A equipe conhece o pattern? Pattern desconhecido é complexidade.',
    tip: 'A resposta mais sênior: o melhor pattern é o mais simples que resolve o problema. Use patterns como ferramenta, não como demonstração de conhecimento.',
  },
  {
    level: 'Senior',
    q: 'Como patterns criacionais mudam com DI Container?',
    a: 'Com container: Singleton resolvido pelo container (scope padrão). Factory = useFactory no container para criação condicional. Abstract Factory raramente necessário — tokens de injeção resolvem. Builder ainda útil para Value Objects e fixtures de teste. Regra: em app com container, prefira tokens e providers à instância manual.',
    tip: 'Conectar GoF com frameworks modernos demonstra experiência prática — não é sobre decorar, é sobre resolver o problema com a ferramenta certa.',
  },
  {
    level: 'Pleno',
    q: 'O que é Anemic Domain Model e como patterns ajudam?',
    a: 'Anemic Domain Model: entidades com só getters/setters, sem comportamento. Toda a lógica no service. Parece OO, é procedural. Solução: mover comportamento para o domínio — Order.cancel(), Order.approve(). Repository para persistência, Specification para regras de negócio compostas.',
    tip: 'Anemic Domain Model é o anti-pattern mais cobrado em contexto de DDD. Prepare exemplo: OrderService com 200 linhas que deveria estar na entidade Order.',
  },
  {
    level: 'Senior',
    q: 'Que pattern você considera overrated?',
    a: 'Singleton (anti-pattern na maioria dos casos) e Visitor (raramente legível, substituído por pattern matching). Abstract Factory frequentemente vira complexidade desnecessária — trocar implementação em runtime raramente acontece. DI container + closure resolvem sem cerimônia na maioria dos casos.',
    tip: 'Demonstrar maturidade: não é sobre saber todos os patterns, é sobre saber quando NÃO usar. Citar a linguagem como contexto (JS vs Java) mostra consciência arquitetural.',
  },
  {
    level: 'Pleno',
    q: 'Como Chain of Responsibility difere de uma série de if/else?',
    a: 'Chain of Responsibility preferível quando: cada handler tem lógica não-trivial, handlers são configurados/ordenados dinamicamente, novos handlers são adicionados sem mudar o fluxo principal. Exemplo: Express middleware (cada middleware decide passar ou responder). if/else para 3-4 condições simples.',
    tip: 'Express middleware é o exemplo mais convincente: app.use(cors(), helmet(), rateLimit(), auth, handler) — cada middleware é um handler na chain.',
  },
  {
    level: 'Pleno',
    q: 'Como Iterator pattern é usado em JavaScript moderno?',
    a: 'JS tem protocolo nativo (Symbol.iterator, Symbol.asyncIterator). Funciona com for...of, spread, Array.from(). Generators como iterators lazy. Async iterators para paginação de API, streams, Kafka. Pattern GoF virou protocolo de linguagem no JS — você o usa todo dia com for...of.',
    tip: 'Async iterators para paginação é o exemplo mais prático e moderno. Demonstra que você conhece além do GoF clássico.',
  },
  {
    level: 'Senior',
    q: 'Memento pattern — quando e como aplicar para undo/redo?',
    a: 'Memento captura estado interno sem violar encapsulamento. originator.save() → Memento; originator.restore(memento). Stack de mementos no Caretaker para undo/redo. Usos: editor de texto, transação local, git stash no nível de domínio. Custo: memória. Alternativa: event sourcing para objetos grandes.',
    tip: 'Trade-off de memória vs imutabilidade é a resposta sênior. Event Sourcing como alternativa demonstra visão ampla.',
  },
]

// ── Dados: Catálogo de Patterns ───────────────────────────────────────────────

const PATTERNS: DesignPattern[] = [
  {
    name: 'Strategy',
    category: 'Comportamental',
    intent: 'Define família de algoritmos intercambiáveis — encapsula cada um e torna-os intercambiáveis.',
    whenToUse: ['Múltiplas variações de um algoritmo (3+)', 'Algoritmos adicionados frequentemente', 'Cada variação tem complexidade própria e merece arquivo próprio'],
    whenToAvoid: ['Só existe 1 implementação — YAGNI', 'Em JS, uma função de primeira classe já serve'],
    code: `interface PriceStrategy {
  calculate(price: number): number
}
class PremiumStrategy implements PriceStrategy {
  calculate(p: number) { return p * 0.8 }
}
class OrderCheckout {
  constructor(private strategy: PriceStrategy) {}
  total(p: number) { return this.strategy.calculate(p) }
}`,
  },
  {
    name: 'Observer',
    category: 'Comportamental',
    intent: 'Define dependência um-para-muitos — quando um objeto muda, todos os dependentes são notificados.',
    whenToUse: ['Event-driven, UI reativa, hooks', 'Múltiplos objetos precisam reagir a mudança de estado', 'Desacoplamento entre produtor e consumidor de eventos'],
    whenToAvoid: ['Observe memory leak — sempre remova observers', 'Para cross-process, prefira Pub/Sub com broker'],
    code: `type Observer<T> = (value: T) => void
class Store<T> {
  private observers = new Set<Observer<T>>()
  subscribe(obs: Observer<T>) {
    this.observers.add(obs)
    return () => this.observers.delete(obs)
  }
  notify(val: T) { this.observers.forEach(o => o(val)) }
}`,
  },
  {
    name: 'Command',
    category: 'Comportamental',
    intent: 'Encapsula uma requisição como objeto, permitindo filas, undo e log de auditoria.',
    whenToUse: ['Undo/redo necessário', 'Filas de execução ou agendamento', 'Log de auditoria de ações', 'CQRS — cada escrita é um Command'],
    code: `interface Command {
  execute(): void; undo(): void
}
class InsertText implements Command {
  constructor(private doc: Doc, private text: string) {}
  execute() { this.doc.insert(this.text) }
  undo()    { this.doc.remove(this.text.length) }
}`,
  },
  {
    name: 'Decorator',
    category: 'Estrutural',
    intent: 'Adiciona responsabilidades a um objeto dinamicamente via composição — alternativa a herança.',
    whenToUse: ['Logging, cache, retry, auth — comportamentos combináveis', 'Evitar explosão de subclasses para combinações de features', 'Express middleware, NestJS interceptors'],
    realWorldExample: '3 behaviors via herança = 7 subclasses. 3 decorators = composição livre.',
    code: `class LoggingDecorator implements Handler {
  constructor(private inner: Handler) {}
  handle(req: Request) {
    console.log(req.url)
    return this.inner.handle(req)
  }
}
// logging(caching(retry(handler)))`,
  },
  {
    name: 'Adapter',
    category: 'Estrutural',
    intent: 'Converte a interface de uma classe em outra que o cliente espera — compatibilidade.',
    whenToUse: ['Integrar lib legada ou API externa com interface diferente', 'Anti-Corruption Layer em DDD', 'Isolar o domínio de terminologia externa'],
    code: `interface IOrderGateway {
  findOrder(id: string): Promise<Order>
}
class LegacyOrderAdapter implements IOrderGateway {
  constructor(private legacy: LegacyOrderAPI) {}
  async findOrder(id: string) {
    const raw = await this.legacy.get_order_by_id(id)
    return { id: raw.order_id, total: raw.ord_ttl }
  }
}`,
  },
  {
    name: 'Repository',
    category: 'Enterprise',
    intent: 'Abstrai a camada de persistência — expõe interface de coleção de aggregates.',
    whenToUse: ['DDD e Clean Architecture', 'Necessidade de trocar ORM sem tocar no domínio', 'Testes de domínio sem banco real'],
    whenToAvoid: ['CRUD simples — ORM direto é mais rápido', 'Repository com 50 métodos custom vira DAO glorificado'],
    code: `interface IUserRepository {
  findById(id: string): Promise<User | null>
  save(user: User): Promise<User>
}
class PrismaUserRepository implements IUserRepository {
  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } })
  }
}`,
  },
  {
    name: 'Builder',
    category: 'Criacional',
    intent: 'Constrói objetos complexos passo a passo — separa construção da representação.',
    whenToUse: ['Objetos com muitos parâmetros opcionais (8+)', 'Validação antes de criar o objeto final', 'Fixtures de teste — Test Data Builder'],
    realWorldExample: 'new UserBuilder().withEmail("x").asAdmin().build()',
    code: `class UserBuilder {
  private data: Partial<User> = {}
  withEmail(e: string) { this.data.email = e; return this }
  asAdmin() { this.data.role = 'admin'; return this }
  build(): User {
    if (!this.data.email) throw new Error('email required')
    return new User(this.data as UserData)
  }
}`,
  },
  {
    name: 'Facade',
    category: 'Estrutural',
    intent: 'Fornece interface simplificada para um subsistema complexo.',
    whenToUse: ['Biblioteca com muitas classes internas', 'SDK de terceiro com API complexa', 'Esconder detalhes de 80% dos casos de uso'],
    whenToAvoid: ['Não confundir com Adapter — Facade simplifica, não traduz'],
    code: `class EmailService {
  async send(to: string, subject: string, body: string) {
    // Orquestra SendGridClient, TemplateEngine,
    // AttachmentProcessor, DeliveryTracker
    // internamente — cliente não precisa saber
  }
}`,
  },
  {
    name: 'Proxy',
    category: 'Estrutural',
    intent: 'Fornece substituto para outro objeto — controla acesso a ele.',
    whenToUse: ['Lazy loading de relações (ORM)', 'Cache transparente', 'Access control por objeto', 'Logging de chamadas sem modificar o real'],
    realWorldExample: 'TypeORM usa Proxy para carregar relações lazy sob demanda.',
    code: `class CacheProxy implements UserRepository {
  private cache = new Map<string, User>()
  constructor(private real: UserRepository) {}
  async findById(id: string) {
    if (this.cache.has(id)) return this.cache.get(id)!
    const user = await this.real.findById(id)
    if (user) this.cache.set(id, user)
    return user
  }
}`,
  },
  {
    name: 'State',
    category: 'Comportamental',
    intent: 'Permite que um objeto altere seu comportamento quando seu estado interno muda.',
    whenToUse: ['Máquinas de estado com 4+ estados', 'Cada estado tem comportamento complexo e diferente', 'Eliminar if/else gigante baseado em status'],
    realWorldExample: 'Pedido: Pendente → Pago → Enviado — comportamento diferente por estado.',
    code: `class PaidState implements OrderState {
  cancel(o: Order) { o.setState(new CancelledState()) }
  ship(o: Order)   { o.setState(new ShippedState()) }
}
class PendingState implements OrderState {
  cancel(o: Order) { o.setState(new CancelledState()) }
  ship(o: Order)   { throw new Error('Not paid yet') }
}`,
  },
  {
    name: 'Factory Method',
    category: 'Criacional',
    intent: 'Define interface para criar objetos — subclasse decide qual classe concreta instanciar.',
    whenToUse: ['Criação depende de subclasse ou contexto', 'Evitar new concreto no código cliente', 'Variante da criação por herança'],
    code: `abstract class Notifier {
  abstract createMessage(event: Event): Message
  async notify(event: Event) {
    const msg = this.createMessage(event)
    await this.send(msg)
  }
}
class EmailNotifier extends Notifier {
  createMessage(e: Event) { return new EmailMessage(e) }
}`,
  },
  {
    name: 'Chain of Responsibility',
    category: 'Comportamental',
    intent: 'Passa requisição ao longo de uma cadeia de handlers — cada um decide processar ou passar.',
    whenToUse: ['Pipeline de middleware', 'Validações encadeadas com lógica não-trivial', 'Handlers adicionados dinamicamente sem mudar o fluxo'],
    realWorldExample: 'Express: app.use(cors(), helmet(), rateLimit(), auth, handler)',
    code: `type Handler = (req: Request, next: () => void) => void

const auth: Handler = (req, next) => {
  if (!req.token) throw new Error('Unauthorized')
  next()
}
const logger: Handler = (req, next) => {
  console.log(req.url); next()
}`,
  },
]

// ── Dados: Mnemônicos ─────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'GoF grupos: "Cria Estrutura e se Comporta"',
    trick: 'C-E-C',
    expansion: [
      ['C', 'Criacionais — como criar objetos (Factory, Builder, Singleton)'],
      ['E', 'Estruturais — como compor objetos (Adapter, Decorator, Facade, Proxy)'],
      ['C', 'Comportamentais — como comunicam (Strategy, Observer, Command, State)'],
    ],
    explanation: 'Toda vez que ouvir um pattern, classifique: é sobre criação, composição ou comunicação? Isso ajuda a identificar o problema que o pattern resolve antes de decorar a implementação.',
    example: 'Strategy = Comportamental (algoritmo intercambiável). Decorator = Estrutural (adiciona comportamento). Factory = Criacional (encapsula criação).',
    why: 'Sem saber a categoria, você confunde os patterns. A categoria revela a intenção — e a intenção é o que entrevistadores testam.',
  },
  {
    label: 'Estruturais: "A Deca Faz Proxy"',
    trick: 'A-D-F-P (Adapter, Decorator, Facade, Proxy)',
    expansion: [
      ['A = Adapter', 'Traduz interface incompatível — conecta sistemas diferentes'],
      ['D = Decorator', 'Adiciona comportamento — logging, cache, retry'],
      ['F = Facade', 'Simplifica subsistema — esconde complexidade interna'],
      ['P = Proxy', 'Controla acesso — lazy load, cache, autorização por objeto'],
    ],
    explanation: 'Os 4 estruturais de alto valor em entrevista. Todos são wrappers — a diferença está na intenção. Adapter = compatibilidade, Decorator = adição, Facade = simplificação, Proxy = controle.',
    example: 'Express middleware = Decorator (adiciona logging/auth). TypeORM entity = Proxy (lazy loading). EmailService = Facade (esconde SendGrid). LegacyAdapter = Adapter (traduz API legada).',
    why: 'Saber distinguir os quatro estruturais em exemplos reais é o que o entrevistador testa — não a definição GoF, mas o reconhecimento prático.',
  },
  {
    label: 'YAGNI antes de GoF',
    trick: 'YAGNI = You Ain\'t Gonna Need It',
    expansion: [
      ['Existe o problema agora?', 'Se não, YAGNI — não antecipe'],
      ['O código está difícil de modificar?', 'Se não, está simples o suficiente'],
      ['A indireção paga a dívida?', 'Cada camada precisa ser justificada'],
      ['A equipe conhece?', 'Pattern desconhecido é complexidade'],
    ],
    explanation: 'O principal critério de senioridade em design patterns não é saber todos os 23 GoF — é saber quando NÃO usar. Pattern sem problema real é complexidade prematura.',
    example: 'Strategy com 1 implementação "antecipando o futuro" = YAGNI. Adicione quando existir a segunda variação concreta.',
    why: 'A pergunta mais frequente sobre patterns em entrevistas sênior é "quando você NÃO usaria X?". YAGNI é a resposta correta na maioria dos casos.',
  },
  {
    label: 'Decorator vs Herança: "N features = 2^N vs N"',
    trick: 'Herança = COMBINATÓRIO. Composição = LINEAR.',
    expansion: [
      ['Herança', '3 comportamentos = 7 subclasses (todas combinações possíveis)'],
      ['Decorator', '3 decorators = qualquer combinação, sem subclasses extras'],
      ['Regra', 'Quando quiser combinar comportamentos, Decorator sempre vence'],
    ],
    explanation: 'Com herança, para cada combinação de N comportamentos você precisa de 2^N - 1 subclasses. Com Decorator, N classes bastam para todas as combinações.',
    example: 'logging + caching + retry: herança exige LoggingHandler, CachingHandler, RetryHandler, LoggingCachingHandler, LoggingRetryHandler, CachingRetryHandler, LoggingCachingRetryHandler. Decorator: 3 classes.',
    why: 'Demonstrar o raciocínio combinatório mostra que você entende o problema que Decorator resolve, não só como implementar.',
  },
  {
    label: 'Strategy vs State: "Strategy troca O QUÊ, State muda COMO"',
    trick: 'Strategy = O QUÊ. State = COMO.',
    expansion: [
      ['Strategy', 'Algoritmo é injetado de fora — você escolhe o que fazer'],
      ['State', 'Comportamento muda com estado interno — o objeto decide como agir'],
    ],
    explanation: 'Strategy: você passa a estratégia (de fora para dentro). State: o comportamento muda automaticamente conforme o estado interno do objeto muda (de dentro).',
    example: 'Strategy: orderCheckout.setStrategy(new PixStrategy()). State: order.pay() → muda estado para PaidState → order.ship() agora funciona.',
    why: 'A confusão Strategy vs State é frequente em entrevistas. A diferença é direção do controle: Strategy é injeção externa, State é automação interna.',
  },
]

// ── Dados: Anti-patterns ──────────────────────────────────────────────────────

const ANTIPATTERNS: AntiPatternItem[] = [
  {
    title: 'Strategy com uma estratégia só (YAGNI)',
    badDesc: 'Criar abstração de Strategy antes de ter mais de uma implementação real',
    badCode: [
      { t: 'interface PriceCalculator {\n', c: C },
      { t: '  calculate(price: number): number\n', c: '#e2e8f0' },
      { t: '}\n// Só existe uma implementação\n', c: '#64748b' },
      { t: 'class StandardPriceCalc implements PriceCalculator {\n', c: '#ef4444' },
      { t: '  calculate(p: number) { return p }\n}\n', c: '#ef4444' },
      { t: '// "Vou precisar de mais depois..." = YAGNI', c: '#ef4444' },
    ],
    goodDesc: 'Função simples até ter variações reais — então extraia Strategy',
    goodCode: [
      { t: '// Simples até ter 2+ variações reais\n', c: '#4ade80' },
      { t: 'function calculatePrice(p: number) { return p }\n\n', c: '#4ade80' },
      { t: '// Depois, com variações reais:\n', c: '#94a3b8' },
      { t: 'type PriceStrategy = (price: number) => number\n', c: '#4ade80' },
      { t: 'const standard: PriceStrategy = p => p\n', c: '#4ade80' },
      { t: 'const premium: PriceStrategy = p => p * 0.8', c: '#4ade80' },
    ],
    why: 'Pattern sem problema real é complexidade gratuita. Espere até ter 2-3 variações concretas. Em JS/TS moderno, uma função de primeira classe já é uma estratégia — sem interface formal.',
  },
  {
    title: 'Singleton — global state mascarado',
    badDesc: 'Singleton clássico esconde dependência, dificulta teste, causa bugs de concorrência',
    badCode: [
      { t: 'class Config {\n', c: '#ef4444' },
      { t: '  private static instance: Config\n', c: '#ef4444' },
      { t: '  private data = loadFromEnv()\n\n', c: '#e2e8f0' },
      { t: '  static getInstance(): Config {\n', c: '#ef4444' },
      { t: '    return this.instance ??= new Config()\n', c: '#ef4444' },
      { t: '  }\n}\n', c: '#e2e8f0' },
      { t: '// Dependência escondida, impossível de mockar', c: '#ef4444' },
    ],
    goodDesc: 'DI container gerencia o scope singleton — testável, explícito',
    goodCode: [
      { t: 'class Config {\n', c: '#4ade80' },
      { t: '  constructor(private env = process.env) {}\n}\n\n', c: '#4ade80' },
      { t: '// Container gerencia scope singleton:\n', c: '#94a3b8' },
      { t: '@Injectable() // NestJS: singleton por módulo\n', c: '#4ade80' },
      { t: 'class ConfigService {}\n\n', c: '#4ade80' },
      { t: '// Teste: new Config(mockEnv)\n', c: '#94a3b8' },
      { t: '// Prod: container injeta uma instância', c: '#4ade80' },
    ],
    why: 'DI container faz o trabalho melhor: cria uma instância, injeta onde precisa, mantém testável. Singleton clássico é global state com nome elegante.',
  },
  {
    title: 'Pattern Stacking em cascata',
    badDesc: 'Empilhar 5 patterns numa classe sem necessidade — indireção sem benefício',
    badCode: [
      { t: 'class OrderProcessorFacadeBuilderFactory {\n', c: '#ef4444' },
      { t: '  // Factory retorna Builder\n', c: '#64748b' },
      { t: '  // Builder cria Command\n', c: '#64748b' },
      { t: '  // Command usa Strategy\n', c: '#64748b' },
      { t: '  // Strategy via Abstract Factory\n', c: '#64748b' },
      { t: '  // Ninguém entende mais nada\n', c: '#ef4444' },
      { t: '}', c: '#e2e8f0' },
    ],
    goodDesc: 'Cada pattern resolve um problema concreto e identificável',
    goodCode: [
      { t: 'class OrderService {\n', c: '#4ade80' },
      { t: '  constructor(\n', c: '#e2e8f0' },
      { t: '    private pricing: PricingStrategy, // 1 pattern\n', c: '#4ade80' },
      { t: '    private repo: IOrderRepository,   // DIP\n', c: '#4ade80' },
      { t: '  ) {}\n\n', c: '#e2e8f0' },
      { t: '  create(dto: CreateOrderDto) {\n', c: '#e2e8f0' },
      { t: '    const total = this.pricing.calculate(dto)\n', c: '#4ade80' },
      { t: '    return this.repo.save({ ...dto, total })\n  }\n}', c: '#e2e8f0' },
    ],
    why: 'Cada camada de indireção precisa ser justificada pelo problema que resolve. Combinar patterns em cascata sem necessidade cria código que ninguém consegue manter.',
  },
  {
    title: 'Anemic Domain Model disfarçado',
    badDesc: 'Entidade com só getters/setters, toda lógica no service — parece OO, é procedural',
    badCode: [
      { t: 'class Order {\n', c: '#ef4444' },
      { t: '  id: string; status: string; total: number\n', c: '#ef4444' },
      { t: '  // Só getters/setters — sem comportamento\n', c: '#64748b' },
      { t: '}\n\n', c: '#e2e8f0' },
      { t: '// Service com 200 linhas de lógica de domínio\n', c: '#ef4444' },
      { t: 'class OrderService {\n', c: '#ef4444' },
      { t: '  cancel(order: Order) { order.status = "cancelled" }\n', c: '#ef4444' },
      { t: '  ship(order: Order) { order.status = "shipped" }\n}', c: '#ef4444' },
    ],
    goodDesc: 'Entidade com comportamento rico — lógica de domínio dentro do objeto',
    goodCode: [
      { t: 'class Order {\n', c: '#4ade80' },
      { t: '  private status: OrderStatus\n\n', c: '#4ade80' },
      { t: '  cancel(): void {\n', c: '#4ade80' },
      { t: '    if (this.status === "shipped") throw ...\n', c: '#4ade80' },
      { t: '    this.status = OrderStatus.Cancelled\n  }\n\n', c: '#4ade80' },
      { t: '  ship(): void {\n', c: '#4ade80' },
      { t: '    if (this.status !== "paid") throw ...\n', c: '#4ade80' },
      { t: '    this.status = OrderStatus.Shipped\n  }\n}', c: '#4ade80' },
    ],
    why: 'Anemic Domain Model viola OO — entidade sem comportamento é uma struct glorificada. Mova a lógica de negócio para dentro do objeto. State pattern pode organizar as transições.',
  },
]

// ── Builders ──────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'Design Patterns',
    stackLabel: 'Arquitetura · GoF',
  }),
  patterns: () => buildPatternsPdf({
    patterns: PATTERNS,
    accentColor: C,
    skillName: 'Design Patterns',
    stackLabel: 'Arquitetura · GoF',
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'Design Patterns',
    stackLabel: 'Arquitetura · GoF',
  }),
  antipatterns: () => buildAntipatternsPdf({
    antipatterns: ANTIPATTERNS,
    accentColor: C,
    skillName: 'Design Patterns',
    stackLabel: 'Arquitetura · GoF',
  }),
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function DesignPatternsPdfs() {
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
