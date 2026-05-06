'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'
import { DecisionTree } from '@/components/visuals/DecisionTree'
import type { DTNode } from '@/components/visuals/DecisionTree'
import { DiffViewer } from '@/components/visuals/DiffViewer'
import type { DiffExample } from '@/components/visuals/DiffViewer'
import { CodeStepper } from '@/components/visuals/CodeStepper'
import type { CodeStepperScenario } from '@/components/visuals/CodeStepper'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'

// ── Paleta Clean Architecture ─────────────────────────────────────────────────
const C      = '#455A64'   // blue-grey
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#4ade80'
const RED    = '#ef4444'
const AMB    = '#f59e0b'
const SKY    = '#38bdf8'
const IND    = '#6366f1'   // camada Entities (indigo)
const TEAL   = '#14b8a6'   // camada Use Cases
const ORG    = '#fb923c'   // camada Interface Adapters
const SLT    = '#64748b'   // camada Frameworks

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Camadas concêntricas interativas (custom)
// Justificativa: a visualização concêntrica é o símbolo central de Clean Arch.
// Ver as camadas e clicar em cada uma para explorar exemplos concretos é
// exatamente o que o diagrama estático do livro não oferece.
// ═══════════════════════════════════════════════════════════════════════════════

const LAYERS_DATA = [
  {
    id: 'entities',
    name: 'Entities',
    subtitle: 'Regra de negócio empresarial',
    color: IND,
    size: '46%',
    zIndex: 4,
    examples: ['Order', 'User', 'Money (VO)', 'CPF (VO)', 'OrderItem'],
    desc: 'Objetos de domínio puros. Calculam, validam invariantes, não sabem de banco, HTTP ou framework. Importam zero dependência externa. Sobrevivem a qualquer mudança de tecnologia.',
    rule: 'Nenhum import de framework, ORM, HTTP ou serviço externo.',
    badge: 'Camada 1 — Centro',
  },
  {
    id: 'usecases',
    name: 'Use Cases',
    subtitle: 'Regra de negócio de aplicação',
    color: TEAL,
    size: '62%',
    zIndex: 3,
    examples: ['CreateOrderUseCase', 'ApprovePayment', 'IOrderRepository (interface)', 'IPaymentGateway (interface)'],
    desc: 'Orquestram entities. Definem as interfaces (ports) que a camada de infra deve implementar. Não conhecem Prisma, Express ou AWS SDK — só as interfaces que eles mesmos definiram.',
    rule: 'Pode importar Entities. Nunca pode importar Infra ou Frameworks.',
    badge: 'Camada 2',
  },
  {
    id: 'adapters',
    name: 'Interface Adapters',
    subtitle: 'Tradutores entre domínio e mundo',
    color: ORG,
    size: '78%',
    zIndex: 2,
    examples: ['HttpOrderController', 'PrismaOrderRepository', 'StripePaymentGateway', 'OrderPresenter', 'OrderMapper'],
    desc: 'Implementam as interfaces definidas pelos Use Cases. Controllers traduzem HTTP para chamadas de use case. Repositories traduzem domínio para SQL/ORM. Se Prisma mudar para TypeORM, só esta camada muda.',
    rule: 'Pode importar Use Cases e Entities. Pode importar frameworks como ferramenta.',
    badge: 'Camada 3',
  },
  {
    id: 'frameworks',
    name: 'Frameworks & Drivers',
    subtitle: 'Detalhes — Express, Postgres, React, AWS',
    color: SLT,
    size: '94%',
    zIndex: 1,
    examples: ['Express app', 'NestJS Module', 'Prisma Client', 'pg driver', 'AWS SDK', 'React components'],
    desc: 'A borda do sistema. Puro detalhe — plugável. O código de negócio não sabe que eles existem. Trocar Express por Fastify, Postgres por MongoDB, ou AWS por GCP não toca as camadas internas.',
    rule: 'Pode importar qualquer coisa. O resto do sistema não importa esta camada diretamente.',
    badge: 'Camada 4 — Borda',
  },
]

function ConcentricLayersVisual() {
  const [sel, setSel] = useState<string>('entities')
  const active = LAYERS_DATA.find(l => l.id === sel)!

  return (
    <div style={{ display: 'flex', gap: 24, height: '100%', minHeight: 400 }}>
      {/* círculos */}
      <div style={{ position: 'relative', width: 320, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {[...LAYERS_DATA].reverse().map(layer => (
          <div
            key={layer.id}
            onClick={() => setSel(layer.id)}
            style={{
              position: 'absolute',
              width: layer.size,
              height: layer.size,
              borderRadius: '50%',
              border: `2px solid ${layer.color}${sel === layer.id ? 'ff' : '60'}`,
              background: `${layer.color}${sel === layer.id ? '20' : '08'}`,
              cursor: 'pointer',
              transition: 'all .25s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: layer.zIndex,
              boxShadow: sel === layer.id ? `0 0 20px ${layer.color}40` : 'none',
            }}
          />
        ))}
        {/* Labels */}
        {LAYERS_DATA.map((layer, i) => {
          const offsets = [
            { top: '8%', left: '50%', transform: 'translateX(-50%)' },
            { top: '20%', left: '50%', transform: 'translateX(-50%)' },
            { top: '32%', left: '50%', transform: 'translateX(-50%)' },
            { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
          ]
          return (
            <div
              key={layer.id}
              onClick={() => setSel(layer.id)}
              style={{
                position: 'absolute',
                ...offsets[i],
                fontSize: i === 3 ? 13 : 10,
                fontWeight: 700,
                color: layer.color,
                cursor: 'pointer',
                textAlign: 'center',
                zIndex: 10,
                whiteSpace: 'nowrap',
                textShadow: '0 1px 4px #000',
              }}
            >
              {layer.name}
            </div>
          )
        })}
        {/* seta de dependência */}
        <div style={{ position: 'absolute', bottom: '4%', left: '50%', transform: 'translateX(-50%)', fontSize: 11, color: FGMUTE, whiteSpace: 'nowrap' }}>
          ← dependência sempre aponta para dentro →
        </div>
      </div>

      {/* painel de detalhes */}
      <div style={{ flex: 1, background: CARD, borderRadius: 12, padding: 24, border: `1.5px solid ${active.color}50` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: 11, background: `${active.color}25`, color: active.color, padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>
            {active.badge}
          </span>
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: active.color, marginBottom: 4 }}>{active.name}</div>
        <div style={{ fontSize: 13, color: FGMUTE, marginBottom: 16 }}>{active.subtitle}</div>
        <p style={{ fontSize: 13, color: FG, lineHeight: 1.7, marginBottom: 16 }}>{active.desc}</p>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: active.color, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>
            Exemplos
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {active.examples.map((ex, i) => (
              <code key={i} style={{
                background: `${active.color}15`,
                border: `1px solid ${active.color}35`,
                borderRadius: 6,
                padding: '3px 10px',
                fontSize: 11,
                color: active.color,
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                {ex}
              </code>
            ))}
          </div>
        </div>

        <div style={{
          padding: '10px 14px',
          background: sel === 'entities' ? `${GRN}10` : `${AMB}10`,
          border: `1px solid ${sel === 'entities' ? GRN : AMB}30`,
          borderLeft: `3px solid ${sel === 'entities' ? GRN : AMB}`,
          borderRadius: 8,
          fontSize: 11,
          color: FGMUTE,
          lineHeight: 1.6,
        }}>
          <strong style={{ color: sel === 'entities' ? GRN : AMB }}>Regra de importação: </strong>
          {active.rule}
        </div>

        {/* navegação entre camadas */}
        <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
          {LAYERS_DATA.map(l => (
            <button
              key={l.id}
              onClick={() => setSel(l.id)}
              style={{
                background: sel === l.id ? `${l.color}25` : 'transparent',
                border: `1px solid ${sel === l.id ? l.color : LINE}`,
                borderRadius: 8,
                padding: '5px 12px',
                fontSize: 11,
                color: sel === l.id ? l.color : FGMUTE,
                cursor: 'pointer',
                fontWeight: sel === l.id ? 700 : 400,
              }}
            >
              {l.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — DiffViewer: antes (acoplado) vs depois (clean)
// Justificativa: ver código real transformado lado a lado é a maneira mais
// rápida de internalizar DI, lean controller, entidade rica e testes unitários.
// 4 exemplos cobrem os 4 conceitos mais cobrados em entrevista.
// ═══════════════════════════════════════════════════════════════════════════════

const DIFF_EXAMPLES: DiffExample[] = [
  {
    id: 'di-basic',
    label: 'Inversão de Dependência — básico',
    description: 'Use Case acoplado ao Prisma vs desacoplado via interface',
    beforeLabel: 'Sem DI — acoplado ao Prisma',
    afterLabel: 'Com DI — depende de interface',
    before: `// CreateOrderUseCase conhece Prisma
import { PrismaClient } from '@prisma/client'

class CreateOrderUseCase {
  private prisma = new PrismaClient()   // <- dependência direta

  async execute(input: CreateOrderInput) {
    // Precisa de Prisma para funcionar.
    // Teste exige banco de dados real.
    // Trocar ORM = reescrever este arquivo.
    const order = await this.prisma.order.create({
      data: { userId: input.userId, total: input.total }
    })
    return order
  }
}`,
    after: `// CreateOrderUseCase depende de interface (port)
interface IOrderRepository {
  save(order: Order): Promise<void>
}

class CreateOrderUseCase {
  constructor(
    private readonly orderRepo: IOrderRepository  // <- interface
  ) {}

  async execute(input: CreateOrderInput) {
    // Não sabe se é Prisma, TypeORM ou in-memory.
    // Teste usa FakeOrderRepository em memória.
    // Trocar ORM = só mudar o adapter concreto.
    const order = new Order(input.userId, input.total)
    await this.orderRepo.save(order)
    return order
  }
}`,
    explanation: 'O use case define a interface (IOrderRepository). A infra implementa. A dependência vai de fora para dentro — a camada interna define o contrato, a externa obedece.',
    tags: ['DIP', 'Ports & Adapters', 'Testabilidade'],
  },
  {
    id: 'controller-lean',
    label: 'Controller Lean vs Controller Gordo',
    description: 'Lógica de negócio no controller vs delegada ao use case',
    beforeLabel: 'Controller gordo — anti-pattern',
    afterLabel: 'Controller lean — Clean Arch',
    before: `// Lógica de negócio no controller
@Post('/orders')
async createOrder(@Body() body: CreateOrderDto) {
  // Validação de negócio no controller
  if (body.total <= 0) throw new BadRequestException('Total inválido')

  // Cálculo de desconto no controller
  const discount = body.total > 1000 ? 0.1 : 0
  const finalTotal = body.total * (1 - discount)

  // Acesso direto ao banco no controller
  const order = await this.prisma.order.create({
    data: { userId: body.userId, total: finalTotal }
  })

  return { id: order.id, total: finalTotal }
}`,
    after: `// Controller lean — só traduz HTTP para use case
@Post('/orders')
async createOrder(@Body() body: CreateOrderDto) {
  // Controller traduz: HTTP request -> use case input
  const input: CreateOrderInput = {
    userId: body.userId,
    total: body.total,
  }

  // Toda lógica fica no use case
  const output = await this.createOrderUseCase.execute(input)

  // Controller traduz: use case output -> HTTP response
  return { id: output.orderId, total: output.finalTotal }
}`,
    explanation: 'Controller tem um papel único: traduzir HTTP para o domínio e de volta. Regras de negócio (descontos, validações) vivem no use case — testáveis sem subir HTTP.',
    tags: ['SRP', 'Thin Controller', 'Testabilidade'],
  },
  {
    id: 'entity-rich',
    label: 'Entity Anêmica vs Entity Rica',
    description: 'Dados sem comportamento vs objeto de domínio real',
    beforeLabel: 'Entity anêmica — só dados',
    afterLabel: 'Entity rica — comportamento real',
    before: `// Entity anêmica — só getters e setters
class Order {
  public id: string
  public userId: string
  public total: number
  public status: string
  public items: OrderItem[]
  // Sem comportamento de negócio.
  // Lógica espalhada em services/controllers.
}

// Lógica de negócio fora da entity — ruim
class OrderService {
  approvePayment(order: Order) {
    if (order.status !== 'pending') throw new Error('...')
    order.status = 'approved'  // mutação direta
  }
}`,
    after: `// Entity rica — comportamento encapsulado
class Order {
  private constructor(
    readonly id: string,
    readonly userId: string,
    private _status: OrderStatus,
    private _items: OrderItem[],
  ) {}

  get total(): Money {
    return this._items.reduce((sum, i) => sum.add(i.total), Money.ZERO)
  }

  approvePayment(): void {
    if (this._status !== OrderStatus.Pending) {
      throw new OrderNotPendingError(this.id)
    }
    this._status = OrderStatus.Approved
  }

  addItem(item: OrderItem): void {
    if (this._status !== OrderStatus.Draft) {
      throw new OrderAlreadySubmittedError(this.id)
    }
    this._items = [...this._items, item]
  }
}`,
    explanation: 'Entity rica mantém invariantes de negócio encapsulados. Você não pode colocar um item em pedido aprovado — a entity impede isso. Com entity anêmica, qualquer código pode violar o invariante.',
    tags: ['DDD', 'Invariantes', 'Encapsulamento'],
  },
  {
    id: 'test-pyramid',
    label: 'Teste acoplado a framework vs teste de use case puro',
    description: 'O ganho real da Clean Arch: testes rápidos sem subir servidor',
    beforeLabel: 'Teste E2E — lento e frágil',
    afterLabel: 'Teste unitário puro — rápido',
    before: `// Teste que sobe servidor HTTP + banco real
describe('POST /orders', () => {
  let app: INestApplication
  let prisma: PrismaClient

  beforeAll(async () => {
    // Sobe servidor NestJS inteiro — lento
    const module = await Test.createTestingModule({...}).compile()
    app = module.createNestApplication()
    await app.init()  // ~5-10 segundos
    prisma = new PrismaClient()
    await prisma.$connect()
  })

  it('cria pedido', async () => {
    return request(app.getHttpServer())
      .post('/orders')
      .send({ userId: '123', total: 100 })
      .expect(201)
  })
})`,
    after: `// Teste do use case em memória — milissegundos
class FakeOrderRepository implements IOrderRepository {
  private orders: Order[] = []
  async save(order: Order) { this.orders.push(order) }
  async findById(id: string) {
    return this.orders.find(o => o.id === id) ?? null
  }
}

describe('CreateOrderUseCase', () => {
  let useCase: CreateOrderUseCase
  let repo: FakeOrderRepository

  beforeEach(() => {
    repo = new FakeOrderRepository()
    useCase = new CreateOrderUseCase(repo)  // injeção direta
  })

  it('cria pedido com total correto', async () => {
    const output = await useCase.execute({
      userId: '123', total: 100
    })
    expect(output.finalTotal).toBe(100)
    // Roda em menos de 5ms sem banco, sem HTTP
  })
})`,
    explanation: 'A inversão de dependência é o que torna testes unitários possíveis. FakeOrderRepository implementa a mesma interface do Prisma — o use case não percebe a diferença.',
    tags: ['Testabilidade', 'TDD', 'Velocidade'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — ComparisonTable: Clean vs MVC vs Hexagonal vs Layered
// Justificativa: "por que Clean Arch vs MVC?" é pergunta garantida em entrevista
// sênior. Comparar 4 arquiteturas em 6 critérios simultaneamente torna
// impossível de contestar — cada célula é um argumento defensável.
// ═══════════════════════════════════════════════════════════════════════════════

const ARCH_OPTIONS: ComparisonOption[] = [
  { id: 'clean',     label: 'Clean Architecture', sublabel: 'Robert Martin', color: C },
  { id: 'mvc',       label: 'MVC',                sublabel: 'Model-View-Controller', color: SKY },
  { id: 'hexagonal', label: 'Hexagonal',           sublabel: 'Ports & Adapters', color: '#a78bfa' },
  { id: 'layered',   label: 'Layered',             sublabel: 'N-tier tradicional', color: AMB },
]

const ARCH_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'domain-isolation', label: 'Isolamento do domínio', category: 'Arquitetura',
    description: 'Grau de separação da lógica de negócio de detalhes técnicos',
    values: {
      clean:     { rating: 'excellent', note: 'Camadas concêntricas com dependency rule absoluta' },
      mvc:       { rating: 'fair',      note: 'Model mistura dados e regras; Controller frequentemente gorda' },
      hexagonal: { rating: 'excellent', note: 'Core isolado por ports; adapters implementam externamente' },
      layered:   { rating: 'poor',      note: 'Dependências vão de cima para baixo — UI conhece DB facilmente' },
    },
  },
  {
    id: 'testability', label: 'Testabilidade', category: 'Qualidade',
    description: 'Facilidade de escrever testes unitários rápidos sem dependências externas',
    values: {
      clean:     { rating: 'excellent', note: 'Use cases testáveis com fakes — milissegundos sem banco' },
      mvc:       { rating: 'fair',      note: 'Depende do framework; frequentemente exige servidor mockado' },
      hexagonal: { rating: 'excellent', note: 'Mesmo ganho que Clean — fakes implementam ports' },
      layered:   { rating: 'poor',      note: 'Camada de dados acoplada complica testes unitários' },
    },
  },
  {
    id: 'boilerplate', label: 'Boilerplate', category: 'Produtividade',
    description: 'Quantidade de código cerimônia necessária para implementar uma feature',
    values: {
      clean:     { rating: 'poor',      note: 'Entity + UseCase + Interface + Adapter + Controller + DTO + Mapper' },
      mvc:       { rating: 'excellent', note: 'Model + View + Controller — mínimo de arquivos' },
      hexagonal: { rating: 'fair',      note: 'Port + Adapter + Core — menos que Clean, mais que MVC' },
      layered:   { rating: 'good',      note: 'Service + Repository + Controller — menos cerimônia' },
    },
  },
  {
    id: 'longevity', label: 'Longevidade', category: 'Estratégia',
    description: 'Custo de manutenção e mudança tecnológica ao longo de anos',
    values: {
      clean:     { rating: 'excellent', note: 'Troca de framework/banco sem tocar domínio — custo O(1)' },
      mvc:       { rating: 'fair',      note: 'Framework lock-in frequente; refactor caro em sistemas grandes' },
      hexagonal: { rating: 'excellent', note: 'Mesma longevidade que Clean — core é agnóstico de tecnologia' },
      layered:   { rating: 'poor',      note: 'Acoplamento vertical cresce com o sistema — refactor exponencial' },
    },
  },
  {
    id: 'learning-curve', label: 'Curva de Aprendizado', category: 'Time',
    description: 'Tempo para um dev médio entender e aplicar corretamente',
    values: {
      clean:     { rating: 'poor',      note: 'Alto: dependency rule, ports, mappers, DI — 2-4 semanas' },
      mvc:       { rating: 'excellent', note: 'Baixíssimo: todo dev web conhece MVC em dias' },
      hexagonal: { rating: 'fair',      note: 'Médio: ports e adapters são intuitivos mas precisam de prática' },
      layered:   { rating: 'good',      note: 'Baixo: fácil de entender, difícil de manter grande' },
    },
  },
  {
    id: 'use-case', label: 'Quando usar', category: 'Decisão',
    description: 'Contexto ideal de aplicação',
    values: {
      clean:     { rating: 'good', note: 'Sistema com vida útil 5+ anos, regra de negócio rica, time grande' },
      mvc:       { rating: 'good', note: 'CRUD simples, MVP, landing pages, sistemas com baixa complexidade' },
      hexagonal: { rating: 'good', note: 'Múltiplas integrações externas, necessidade de trocar adaptadores' },
      layered:   { rating: 'fair', note: 'Sistemas legados, times iniciantes, projetos de curto prazo' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — CodeStepper: fluxo de um use case passo a passo
// Justificativa: o fluxo Controller → Use Case → Entity → Repository → Adapter
// é abstrato para quem não aplicou. Ver cada linha se iluminar com callstack
// e memória torna o fluxo concreto e memorável.
// ═══════════════════════════════════════════════════════════════════════════════

const USE_CASE_FLOW: CodeStepperScenario[] = [
  {
    id: 'create-order',
    label: 'CreateOrder — fluxo completo',
    language: 'typescript',
    code: `// HTTP Controller (Interface Adapter)
const input = mapper.toInput(req.body)      // linha 2
const output = await useCase.execute(input) // linha 3
return presenter.toHttp(output)             // linha 4

// Use Case (Application Layer)
async execute(input: CreateOrderInput) {
  const user = await userRepo.findById(input.userId) // linha 8
  if (!user) throw new UserNotFoundError()            // linha 9
  const order = Order.create(user, input.items)       // linha 10
  order.calculateTotal()                              // linha 11
  await orderRepo.save(order)                         // linha 12
  await eventBus.publish(new OrderCreated(order))     // linha 13
  return { orderId: order.id, total: order.total }    // linha 14
}

// Prisma Repository (Infrastructure)
async save(order: Order): Promise<void> {
  await prisma.order.create({ data: mapper.toPrisma(order) }) // linha 18
}`,
    steps: [
      {
        lineStart: 2,
        title: 'Controller traduz Request → Input',
        explanation: 'O controller não executa lógica — apenas mapeia o body HTTP para o formato esperado pelo use case (DTO de entrada). Validação de sintaxe pode acontecer aqui.',
        callStack: ['HttpOrderController.createOrder()'],
      },
      {
        lineStart: 3,
        title: 'Delegação ao Use Case',
        explanation: 'Controller invoca o use case com o input mapeado. A partir daqui, o código não sabe mais que existe HTTP — o use case trabalha com tipos de domínio.',
        callStack: ['HttpOrderController.createOrder()', 'CreateOrderUseCase.execute()'],
      },
      {
        lineStart: 8,
        title: 'Use Case busca via Port',
        explanation: 'O use case chama userRepo.findById() — mas userRepo é uma interface (IUserRepository). Pode ser Prisma, TypeORM ou fake em teste. O use case não sabe qual.',
        callStack: ['CreateOrderUseCase.execute()', 'IUserRepository.findById()'],
        memory: { 'userRepo': 'IUserRepository (interface)', 'user': 'undefined (carregando)' },
      },
      {
        lineStart: 10,
        title: 'Entity criada com factory method',
        explanation: 'Order.create() valida invariantes: usuário ativo? items não vazios? Erro aqui é de negócio — não de banco, não de HTTP. Domain Exception.',
        callStack: ['CreateOrderUseCase.execute()', 'Order.create()'],
        memory: { 'user': 'User { id, email }', 'order': 'Order { id, items, status: DRAFT }' },
      },
      {
        lineStart: 11,
        lineEnd: 12,
        title: 'Cálculo e persistência',
        explanation: 'calculateTotal() é comportamento da entity — soma items com desconto se aplicável. orderRepo.save() delega para o adapter concreto (Prisma). Use case não importa pg, não importa SQL.',
        callStack: ['CreateOrderUseCase.execute()', 'Order.calculateTotal()', 'IOrderRepository.save()'],
        memory: { 'order.total': 'Money { amount: 250.00, currency: BRL }' },
      },
      {
        lineStart: 13,
        title: 'Domain Event publicado',
        explanation: 'OrderCreated é um evento de domínio. EventBus também é uma interface — pode ser EventBridge, RabbitMQ ou sync in-memory. Outros bounded contexts reagem sem acoplamento direto.',
        callStack: ['CreateOrderUseCase.execute()', 'IEventBus.publish(OrderCreated)'],
      },
      {
        lineStart: 4,
        title: 'Controller serializa Output → HTTP Response',
        explanation: 'presenter.toHttp() transforma o output do use case em JSON com os campos esperados pela API. Formato de response é responsabilidade do presenter, não do use case.',
        callStack: ['HttpOrderController.createOrder()', 'OrderPresenter.toHttp()'],
        output: '201 Created { orderId: "ord_abc", total: 250.00 }',
      },
      {
        lineStart: 18,
        title: 'Adapter executa: domínio → Prisma',
        explanation: 'PrismaOrderRepository implementa IOrderRepository. O mapper converte o objeto de domínio Order para o formato do Prisma (plain object). Lógica de mapeamento fica aqui — não polui o use case.',
        callStack: ['PrismaOrderRepository.save()', 'PrismaClient.order.create()'],
        output: 'INSERT INTO orders ...',
      },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — AntiPatternsGallery
// Justificativa: 2 anti-patterns que o DiffViewer NÃO cobre:
// - God Use Case (SRP): cenário muito comum, sem exemplo equivalente no DiffViewer
// - Repository leaking ORM type: subtil, difícil de perceber sem exemplo de código
// Os outros 4 (DI, lean controller, rich entity, testes) estão no DiffViewer
// com mais espaço e contexto — não duplicar aqui.
// ═══════════════════════════════════════════════════════════════════════════════

const CA_ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'God Use Case — faz tudo',
    wrong: [
      [{ text: '// ProcessOrderUseCase com 200+ linhas — viola SRP', color: RED }],
      [{ text: 'class ProcessOrderUseCase {', color: FG }],
      [{ text: '  async execute(input: any) {', color: FG }],
      [{ text: '    // valida usuário, verifica estoque,', color: RED }],
      [{ text: '    // processa pagamento, envia email,', color: RED }],
      [{ text: '    // gera fatura, atualiza histórico...', color: RED }],
      [{ text: '    // 200+ linhas misturando tudo', color: RED }],
      [{ text: '  }', color: FG }],
      [{ text: '}', color: FG }],
    ],
    right: [
      [{ text: '// Cada use case com uma responsabilidade', color: GRN }],
      [{ text: 'class CreateOrderUseCase { ... }    // SRP', color: GRN }],
      [{ text: 'class ReserveStockUseCase { ... }   // separado', color: GRN }],
      [{ text: 'class ProcessPaymentUseCase { ... } // separado', color: GRN }],
      [{ text: 'class SendOrderEmailUseCase { ... } // separado', color: GRN }],
      [{ text: '// Orquestração via Saga ou Step Functions', color: GRN }],
      [{ text: '// Cada use case testável individualmente', color: GRN }],
    ],
    why: 'God Use Case viola SRP — impossível testar cada responsabilidade em isolamento. Separe por responsabilidade. Para fluxos que exigem múltiplos use cases, use Saga Pattern ou orquestração via Step Functions.',
  },
  {
    title: 'Repository retornando tipo do ORM',
    wrong: [
      [{ text: '// Port retorna PrismaOrder — vazamento de infra', color: RED }],
      [{ text: 'interface IOrderRepository {', color: FG }],
      [{ text: '  findById(id: string): Promise<PrismaOrder>', color: RED }],
      [{ text: '}', color: FG }],
      [{ text: '// Use case recebe PrismaOrder — sabe de Prisma!', color: RED }],
      [{ text: 'const order = await this.repo.findById(id)', color: FG }],
      [{ text: 'order.createdAt  // campo do Prisma, não do domínio', color: RED }],
    ],
    right: [
      [{ text: '// Port retorna domain entity — use case agnóstico', color: GRN }],
      [{ text: 'interface IOrderRepository {', color: FG }],
      [{ text: '  findById(id: string): Promise<Order | null>', color: GRN }],
      [{ text: '}', color: FG }],
      [{ text: '// Adapter faz o mapping internamente', color: GRN }],
      [{ text: 'class PrismaOrderRepository implements IOrderRepository {', color: FG }],
      [{ text: '  async findById(id: string) {', color: FG }],
      [{ text: '    const row = await prisma.order.findUnique(...)', color: FG }],
      [{ text: '    return row ? mapper.toDomain(row) : null', color: GRN }],
      [{ text: '  }', color: FG }],
      [{ text: '}', color: FG }],
    ],
    why: 'Repository com tipo de ORM no contrato faz o use case conhecer Prisma indiretamente — viola a Dependency Rule de forma sutil. O port deve sempre retornar entity de domínio. O adapter faz o mapping.',
  },
  {
    title: 'Framework importado na camada de domínio',
    wrong: [
      [{ text: '// Entity conhece TypeORM — viola Dependency Rule', color: RED }],
      [{ text: 'import { Entity, Column } from "typeorm"', color: RED }],
      [{ text: 'import { IsEmail } from "class-validator"', color: RED }],
      [{ text: '', color: FG }],
      [{ text: '@Entity()  // decorator de ORM na entity de domínio!', color: RED }],
      [{ text: 'class User {', color: FG }],
      [{ text: '  @Column() @IsEmail()', color: RED }],
      [{ text: '  email: string', color: FG }],
      [{ text: '}', color: FG }],
    ],
    right: [
      [{ text: '// Entity de domínio pura — sem decorator', color: GRN }],
      [{ text: 'class User {  // zero imports externos', color: GRN }],
      [{ text: '  constructor(readonly email: Email) {}', color: FG }],
      [{ text: '}', color: FG }],
      [{ text: '', color: FG }],
      [{ text: '// Entity de persistência separada — na infra', color: GRN }],
      [{ text: 'import { Entity, Column } from "typeorm"', color: FG }],
      [{ text: '@Entity() class UserOrmEntity {', color: FG }],
      [{ text: '  @Column() email: string  // só na camada de infra', color: GRN }],
      [{ text: '}', color: FG }],
    ],
    why: 'Decorator de ORM na entity de domínio cria acoplamento duro ao TypeORM. Se trocar para Prisma, tem que editar entities de domínio. Separe: entity de domínio (pura) + entity de ORM (na infra).',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — DecisionTree: onde colocar esse código?
// Justificativa: a dúvida mais prática de quem está aprendendo Clean Arch é
// "onde fica esse código?". A árvore de decisão torna o processo explícito
// e memorizável — melhor que qualquer regra textual.
// ═══════════════════════════════════════════════════════════════════════════════

const DT_ROOT: DTNode = {
  id: 'root',
  question: 'Onde colocar esse código em Clean Arch?',
  children: [
    { label: 'É regra de negócio pura?', nodeId: 'is-business-rule', color: IND },
    { label: 'É orquestração de regras?', nodeId: 'is-orchestration', color: TEAL },
    { label: 'É tradução entre camadas?', nodeId: 'is-translation', color: ORG },
    { label: 'É framework ou lib externa?', nodeId: 'is-framework', color: SLT },
  ],
}

const DT_NODES: Record<string, DTNode> = {
  'is-business-rule': {
    id: 'is-business-rule',
    question: 'A regra existe independentemente de qualquer tecnologia?',
    children: [
      { label: 'Sim — regra de negócio', nodeId: 'entity-layer', color: IND },
      { label: 'Não — tem dependência', nodeId: 'is-orchestration', color: TEAL },
    ],
  },
  'entity-layer': {
    id: 'entity-layer',
    recommendation: 'Entities (Domain Layer)',
    detail: 'Coloque na entity ou value object. Exemplos: Order.calculateTotal(), Money.add(), CPF.validate(), Order.approve() (com invariante). Sem imports externos — pura lógica de domínio.',
    color: IND,
    icon: '⬤',
  },
  'is-orchestration': {
    id: 'is-orchestration',
    question: 'O código coordena múltiplas entities ou serviços externos via interface?',
    children: [
      { label: 'Sim — orquestra fluxo', nodeId: 'usecase-layer', color: TEAL },
      { label: 'Não — outro tipo', nodeId: 'is-translation', color: ORG },
    ],
  },
  'usecase-layer': {
    id: 'usecase-layer',
    recommendation: 'Use Cases (Application Layer)',
    detail: 'Coloque no use case. Exemplos: CreateOrderUseCase, ApprovePaymentUseCase. Define interfaces (ports) para tudo que precisa de fora: IOrderRepository, IEmailService. Importa só entities e suas próprias interfaces.',
    color: TEAL,
    icon: '◎',
  },
  'is-translation': {
    id: 'is-translation',
    question: 'É conversão de dados entre formatos (HTTP vs domínio, ORM vs domínio)?',
    children: [
      { label: 'Sim — traduz dados', nodeId: 'adapter-layer', color: ORG },
      { label: 'Não — é configuração/boot', nodeId: 'is-framework', color: SLT },
    ],
  },
  'adapter-layer': {
    id: 'adapter-layer',
    recommendation: 'Interface Adapters',
    detail: 'Coloque no controller, presenter, repository ou gateway. Exemplos: HttpOrderController (HTTP → use case), PrismaOrderRepository (implements IOrderRepository), OrderPresenter (use case output → JSON), OrderMapper (domain vs ORM).',
    color: ORG,
    icon: '◑',
  },
  'is-framework': {
    id: 'is-framework',
    question: 'É config de framework, driver de banco ou lib de terceiro?',
    children: [
      { label: 'Sim — config/lib externa', nodeId: 'framework-layer', color: SLT },
      { label: 'Não sei ainda', nodeId: 'ask-heuristic', color: FGMUTE },
    ],
  },
  'framework-layer': {
    id: 'framework-layer',
    recommendation: 'Frameworks & Drivers',
    detail: 'Coloque na camada mais externa. Exemplos: NestJS Module (DI setup), Express app.listen(), PrismaClient config, AWS SDK setup, React components de página. O domínio nunca importa daqui.',
    color: SLT,
    icon: '○',
  },
  'ask-heuristic': {
    id: 'ask-heuristic',
    recommendation: 'Use a heurística: "faria sentido sem a tecnologia X?"',
    detail: '"Esse código faria sentido num sistema sem banco de dados? Sem HTTP? Sem framework?" Se SIM → Entity ou Use Case. Se NÃO → Adapter ou Framework. A dependency rule é o árbitro final: nunca importe camada mais externa de dentro de camada mais interna.',
    color: C,
    icon: '?',
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 7 — LayerStack: mapa de arquivos por camada
// Justificativa: substitui o ProgressionMap. Clean Arch não tem progressão
// linear — tem profundidade. O que faz sentido é um mapa de referência mostrando
// quais arquivos concretos vivem em cada camada, com exemplos reais de NestJS.
// Este é o visual que dev consulta durante a implementação.
// ═══════════════════════════════════════════════════════════════════════════════

const CA_LAYERS: Layer[] = [
  {
    id: 'entities',
    label: 'Entities & Value Objects',
    sublabel: 'Camada 1 — Domain (núcleo)',
    description: 'Lógica de negócio pura. Sem imports externos. Testável sem banco, sem HTTP, sem framework. Sobrevive a qualquer refactor tecnológico.',
    code: 'order.entity.ts | money.vo.ts | cpf.vo.ts | order-created.event.ts',
    color: IND,
    icon: '⬤',
    examples: [
      'order.entity.ts',
      'user.entity.ts',
      'money.vo.ts',
      'cpf.vo.ts',
      'order-item.entity.ts',
      'order-created.event.ts',
    ],
  },
  {
    id: 'usecases',
    label: 'Use Cases & Ports',
    sublabel: 'Camada 2 — Application',
    description: 'Orquestra entities. Define interfaces (ports) que a infra implementa. Nunca importa Prisma, Express ou AWS SDK — só suas próprias interfaces.',
    code: 'create-order.usecase.ts | order-repository.port.ts | create-order.input.ts',
    color: TEAL,
    icon: '◎',
    examples: [
      'create-order.usecase.ts',
      'approve-payment.usecase.ts',
      'order-repository.port.ts',
      'email-service.port.ts',
      'create-order.input.ts',
      'create-order.output.ts',
    ],
  },
  {
    id: 'adapters',
    label: 'Interface Adapters',
    sublabel: 'Camada 3 — tradutores',
    description: 'Implementam os ports. Controllers traduzem HTTP → use case. Repositories traduzem domínio → ORM. Se Prisma mudar para TypeORM, só esta camada muda.',
    code: 'order.controller.ts | prisma-order.repository.ts | order-prisma.mapper.ts',
    color: ORG,
    icon: '◑',
    examples: [
      'order.controller.ts',
      'order.presenter.ts',
      'prisma-order.repository.ts',
      'stripe-payment.gateway.ts',
      'order-prisma.mapper.ts',
      'user-orm.entity.ts',
    ],
  },
  {
    id: 'frameworks',
    label: 'Frameworks & Drivers',
    sublabel: 'Camada 4 — Borda (detalhe plugável)',
    description: 'Configuração de frameworks e drivers. O domínio não sabe que eles existem. Trocar NestJS por Express, Postgres por MongoDB, ou AWS por GCP não toca as camadas internas.',
    code: 'order.module.ts | prisma.service.ts | app.module.ts | main.ts',
    color: SLT,
    icon: '○',
    examples: [
      'order.module.ts',
      'app.module.ts',
      'main.ts',
      'prisma.service.ts',
      'typeorm.config.ts',
      'swagger.setup.ts',
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// Componente principal
// ═══════════════════════════════════════════════════════════════════════════════

export default function CleanArchitectureVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'concentric-layers',
      title: 'As 4 Camadas Concêntricas',
      subtitle: 'Entities → Use Cases → Interface Adapters → Frameworks — clique para explorar',
      accent: C,
      component: <ConcentricLayersVisual />,
    },
    {
      id: 'di-diff',
      title: 'Dependency Inversion na Prática',
      subtitle: 'DI, lean controller, entity rica, testes sem banco — código real antes e depois',
      accent: C,
      component: (
        <DiffViewer
          examples={DIFF_EXAMPLES}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'arch-comparison',
      title: 'Clean vs MVC vs Hexagonal vs Layered',
      subtitle: 'Comparação por isolamento, testabilidade, boilerplate e longevidade',
      accent: C,
      component: (
        <ComparisonTable
          options={ARCH_OPTIONS}
          criteria={ARCH_CRITERIA}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'use-case-flow',
      title: 'Fluxo de um Use Case — passo a passo',
      subtitle: 'CreateOrder: Controller → Use Case → Entity → Repository → Adapter',
      accent: C,
      component: (
        <CodeStepper
          scenarios={USE_CASE_FLOW}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'antipatterns',
      title: 'Anti-patterns — o que não fazer',
      subtitle: 'God Use Case, repository vazando ORM, decorator de framework no domínio',
      accent: C,
      component: (
        <AntiPatternsGallery
          patterns={CA_ANTIPATTERNS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'where-code',
      title: 'Onde colocar esse código?',
      subtitle: 'Árvore de decisão: Entity, Use Case, Adapter ou Framework?',
      accent: C,
      component: (
        <DecisionTree
          root={DT_ROOT}
          nodes={DT_NODES}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'layer-files',
      title: 'Mapa de Arquivos por Camada',
      subtitle: 'Quais arquivos NestJS ficam em cada camada — referência para implementação',
      accent: C,
      component: (
        <LayerStack
          layers={CA_LAYERS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
  ]

  return (
    <VisuaisShell
      visuals={visuals}
      active={active}
      onChange={setActive}
    />
  )
}
