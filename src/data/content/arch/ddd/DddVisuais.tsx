'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'
import { TreeExplorer } from '@/components/visuals/TreeExplorer'
import type { TreeNode, TreeNodeTypeMeta } from '@/components/visuals/TreeExplorer'
import { DiffViewer } from '@/components/visuals/DiffViewer'
import type { DiffExample } from '@/components/visuals/DiffViewer'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'
import { DecisionTree } from '@/components/visuals/DecisionTree'
import type { DTNode } from '@/components/visuals/DecisionTree'

// ── Paleta DDD ────────────────────────────────────────────────────────────────
const C      = '#E91E63'   // rosa — domínio/negócio
const C2     = '#c2185b'   // secondary
const BG     = '#0f172a'
const CARD   = '#1e293b'
const CARD2  = '#243044'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#4ade80'
const RED    = '#ef4444'
const AMB    = '#f59e0b'
const SKY    = '#38bdf8'
const PRP    = '#a78bfa'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Camadas DDD
// ═══════════════════════════════════════════════════════════════════════════════

const DDD_LAYERS: Layer[] = [
  {
    id: 'presentation',
    label: 'Presentation',
    sublabel: 'Interface com o mundo externo',
    description:
      'Controllers REST, resolvers GraphQL, handlers de eventos de mensageria. ' +
      'Converte input externo em Commands/Queries e resultado em DTOs. ' +
      'Não contém regra de negócio — apenas tradução de protocolo.',
    code: 'class OrderController {\n  constructor(private uc: PlaceOrderUseCase) {}\n  @Post()\n  async place(@Body() dto: PlaceOrderDto) {\n    return this.uc.execute(dto)\n  }\n}',
    color: FGMUTE,
    examples: ['REST controllers', 'GraphQL resolvers', 'CLI commands', 'Event consumers'],
  },
  {
    id: 'application',
    label: 'Application',
    sublabel: 'Casos de uso — orquestração sem regra de negócio',
    description:
      'Application Services (Use Cases) orquestram o fluxo: carregam aggregates via Repository, ' +
      'invocam comportamento do domínio, publicam Domain Events, fazem commit. ' +
      'Não contém IF de negócio — toda decisão fica no Domínio.',
    code: 'class PlaceOrderUseCase {\n  async execute(cmd: PlaceOrderCommand) {\n    const customer = await this.customerRepo.findById(cmd.customerId)\n    const order = Order.create(customer)\n    order.addItem(cmd.sku, cmd.qty, cmd.price)\n    const event = order.confirm()   // regra no Domínio\n    await this.orderRepo.save(order)\n    await this.outbox.publish(event) // desacoplado\n  }\n}',
    color: SKY,
    examples: ['Use Cases', 'Application Services', 'Command/Query Handlers', 'Sagas'],
  },
  {
    id: 'domain',
    label: 'Domain',
    sublabel: 'Coração — entities, aggregates, value objects, domain services',
    description:
      'A camada mais importante. Contém toda a lógica de negócio: invariantes nos Aggregates, ' +
      'comportamento nas Entities, imutabilidade nos Value Objects, lógica cross-aggregate nos Domain Services. ' +
      'Não depende de nenhuma outra camada — puro TypeScript sem imports de infra.',
    code: 'export class Order {\n  confirm(): OrderConfirmed {\n    if (this.items.length === 0)\n      throw new EmptyOrderError()   // invariante\n    if (this.status !== "pending")\n      throw new InvalidStatusError()\n    this.status = "confirmed"\n    return new OrderConfirmed(this.id, this.total())\n  }\n}',
    color: C,
    examples: ['Entities', 'Aggregates', 'Value Objects', 'Domain Events', 'Domain Services', 'Interfaces de Repository'],
  },
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    sublabel: 'Adapters — implementações de I/O',
    description:
      'Implementa as interfaces definidas no Domínio: PrismaOrderRepository, SmtpMailer, ' +
      'StripeGateway, RedisCache. A direção de dependência é invertida — Infra depende de Domain, ' +
      'não o contrário. Trocar Postgres por Mongo: só a implementação muda, Domínio intacto.',
    code: 'class PrismaOrderRepository implements IOrderRepository {\n  async save(order: Order): Promise<void> {\n    const data = OrderMapper.toPersistence(order)\n    await this.prisma.order.upsert({ ... })\n  }\n}',
    color: AMB,
    examples: ['Repositories (Prisma, TypeORM)', 'Mailers (SMTP, SES)', 'Payment gateways', 'Cache adapters', 'Message brokers'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Building Blocks (TreeExplorer)
// ═══════════════════════════════════════════════════════════════════════════════

const DDD_TREE: TreeNode = {
  id: 'ddd-root',
  name: 'DDD Tático',
  type: 'root',
  tooltip: 'Conjunto de blocos de construção para modelar o domínio de negócio em código',
  children: [
    {
      id: 'aggregate',
      name: 'Aggregate',
      type: 'aggregate',
      tooltip: 'Cluster de entidades tratadas como unidade transacional. Root é a única porta de entrada.',
      tip: 'Regra: 1 transação = 1 aggregate. Design pequeno — Vernon.',
      children: [
        {
          id: 'aggregate-root',
          name: 'Aggregate Root',
          type: 'entity',
          tooltip: 'Entidade raiz que garante invariantes do aggregate. Nenhum código externo acessa entidades filhas diretamente.',
          tip: 'Ex: Order. Expõe métodos como confirm(), addItem(), cancel().',
          props: ['Garante invariantes', 'Emite Domain Events', 'Única porta de entrada'],
        },
        {
          id: 'child-entity',
          name: 'Entity filha',
          type: 'entity',
          tooltip: 'Entity interna ao aggregate, acessível apenas via Root. Tem identidade, mas não é aggregate root.',
          tip: 'Ex: OrderItem dentro de Order. Não exposta externamente.',
          props: ['Identidade própria', 'Acesso somente via Root', 'Mutável'],
        },
        {
          id: 'value-object',
          name: 'Value Object',
          type: 'vo',
          tooltip: 'Imutável, definido por seus valores, sem identidade. Operações retornam novo VO.',
          tip: 'Ex: Money(100, BRL). Equals por valor. Sem ID.',
          props: ['Imutável', 'Igualdade por valor', 'Sem ID'],
        },
      ],
    },
    {
      id: 'domain-event',
      name: 'Domain Event',
      type: 'event',
      tooltip: 'Fato imutável que ocorreu no domínio. No passado. Desacopla reação entre aggregates e bounded contexts.',
      tip: 'Ex: OrderConfirmed, PaymentApproved. Diferente de Command (intenção).',
      props: ['Imutável', 'Nome no passado', 'Desacoplamento'],
    },
    {
      id: 'domain-service',
      name: 'Domain Service',
      type: 'service',
      tooltip: 'Lógica de negócio que naturalmente cruza múltiplas entidades e não pertence a nenhuma delas.',
      tip: 'Ex: PricingService calcula desconto com Customer + Product. Se cabe em um aggregate, coloque lá.',
      props: ['Regra cross-aggregate', 'Sem estado próprio', 'Stateless'],
    },
    {
      id: 'repository',
      name: 'Repository',
      type: 'repo',
      tooltip: 'Interface definida no Domínio para abstrair persistência de um aggregate. Implementação fica na Infra.',
      tip: 'Interface: IOrderRepository. Implementação: PrismaOrderRepository. Não é DAO — trabalha com aggregates.',
      props: ['Interface no Domínio', 'Implementação na Infra', 'Por aggregate root'],
    },
    {
      id: 'factory',
      name: 'Factory',
      type: 'factory',
      tooltip: 'Encapsula lógica complexa de criação de aggregates ou objetos de domínio.',
      tip: 'Quando construtor de Aggregate fica complexo demais. Ex: OrderFactory.fromCart(cart, customer).',
      props: ['Criação complexa', 'Encapsula invariantes de criação'],
    },
  ],
}

const DDD_TYPE_MAP: Record<string, TreeNodeTypeMeta> = {
  root:      { color: C,      label: 'DDD',            icon: '🏛',  desc: 'Raiz do modelo tático DDD' },
  aggregate: { color: C,      label: 'Aggregate',       icon: '📦',  desc: 'Cluster transacional com root que garante invariantes' },
  entity:    { color: SKY,    label: 'Entity',           icon: '🆔',  desc: 'Tem identidade única. Igualdade por ID.' },
  vo:        { color: GRN,    label: 'Value Object',     icon: '💎',  desc: 'Imutável, igualdade por valor, sem ID' },
  event:     { color: AMB,    label: 'Domain Event',     icon: '📣',  desc: 'Fato imutável do domínio no passado' },
  service:   { color: PRP,    label: 'Domain Service',   icon: '⚙️',  desc: 'Lógica cross-aggregate sem estado' },
  repo:      { color: FGMUTE, label: 'Repository',       icon: '🗄',  desc: 'Interface de persistência por aggregate' },
  factory:   { color: RED,    label: 'Factory',          icon: '🏭',  desc: 'Criação complexa de aggregates' },
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Anemia de domínio vs Modelo Rico (DiffViewer)
// ═══════════════════════════════════════════════════════════════════════════════

const DIFF_EXAMPLES: DiffExample[] = [
  {
    id: 'anemia',
    label: 'Modelo anêmico vs modelo rico',
    description: 'O anti-pattern mais comum: entidade sem comportamento (só getters/setters), com toda a lógica no Service.',
    beforeLabel: 'Modelo anêmico (anti-pattern)',
    afterLabel: 'Modelo rico (DDD)',
    before: `// Entidade anêmica — só dados, sem comportamento
class Order {
  id: string
  items: OrderItem[]
  status: string
  total: number
  // getters e setters apenas
}

// Toda lógica no Service — errado
class OrderService {
  confirm(order: Order): void {
    if (order.items.length === 0)
      throw new Error('sem itens')
    if (order.status !== 'pending')
      throw new Error('status inválido')
    order.status = 'confirmed'
    order.total = order.items
      .reduce((s, i) => s + i.price * i.qty, 0)
    // lógica espalhada: quem mais confirma?
    // 3 services fazem a mesma validação
  }
}`,
    after: `// Modelo rico — comportamento encapsulado
class Order {
  private constructor(
    public readonly id: string,
    private items: OrderItem[],
    private status: 'pending' | 'confirmed' | 'cancelled',
  ) {}

  // Comportamento + invariante + evento — tudo junto
  confirm(): OrderConfirmed {
    if (this.items.length === 0)
      throw new EmptyOrderError()
    if (this.status !== 'pending')
      throw new InvalidStatusError()
    this.status = 'confirmed'
    return new OrderConfirmed(this.id, this.total())
  }

  // Invariante protegida pela entidade
  addItem(sku: string, qty: number, price: Money): void {
    if (this.status !== 'pending')
      throw new OrderAlreadyClosedError()
    this.items.push(new OrderItem(sku, qty, price))
  }

  total(): Money {
    return this.items.reduce(
      (sum, i) => sum.add(i.subtotal()),
      Money.zero('BRL')
    )
  }
}`,
    explanation: 'No modelo anêmico, "Order" é só uma struct — a lógica de negócio fica espalhada em Services, duplicada e difícil de rastrear. No modelo rico, a entidade protege seus próprios invariantes: nenhum código externo pode confirmar um pedido vazio ou adicionar item a pedido fechado.',
    tags: ['anemia', 'invariantes', 'encapsulamento'],
  },
  {
    id: 'ubiquitous-language',
    label: 'Linguagem genérica vs linguagem ubíqua',
    description: 'O código deve usar o vocabulário do negócio — não termos técnicos genéricos que ninguém do domínio reconhece.',
    beforeLabel: 'Código sem linguagem ubíqua',
    afterLabel: 'Com linguagem ubíqua',
    before: `// Vocabulário técnico genérico — ninguém de negócio reconhece
class DataProcessor {
  processRecord(record: DataRecord): void {
    if (record.type === 'A') {
      record.flag = true
      record.amount = record.amount * 0.85
    }
  }
}

class RecordManager {
  updateStatus(id: string, code: number): void {
    // o que é "code 2"? o que é "status 3"?
    if (code === 2 && this.getStatus(id) === 1) {
      this.setStatus(id, 3)
    }
  }
}`,
    after: `// Vocabulário do negócio — especialista reconhece
class OrderDiscountPolicy {
  applyPremiumDiscount(order: Order): Money {
    // o financeiro sabe o que é "desconto premium"
    if (order.customer.isPremium()) {
      return order.subtotal().multiply(0.15)
    }
    return Money.zero('BRL')
  }
}

class ShipmentWorkflow {
  dispatch(shipment: Shipment): ShipmentDispatched {
    // "dispatch" é o termo que a equipe de logística usa
    if (shipment.status !== 'ready_to_dispatch')
      throw new CannotDispatchError(shipment.id)
    shipment.markAsDispatched()
    return new ShipmentDispatched(shipment.id, shipment.carrier)
  }
}`,
    explanation: 'Linguagem ubíqua significa que dev e negócio compartilham o mesmo vocabulário. Quando o especialista de logística diz "despacho", o código deve ter "dispatch" — não "updateStatus(id, 2)". O objetivo é que o especialista possa ler o código e reconhecer o domínio.',
    tags: ['ubiquitous-language', 'nomenclatura', 'domínio'],
  },
  {
    id: 'repository-vs-dao',
    label: 'DAO genérico vs Repository focado',
    description: 'Repository não é DAO. Repository abstrai persistência de um aggregate específico, com métodos que fazem sentido para o domínio.',
    beforeLabel: 'DAO genérico (anti-pattern)',
    afterLabel: 'Repository focado (DDD)',
    before: `// DAO genérico — todas as queries possíveis
class OrderDao {
  findById(id: string): OrderRow { ... }
  findAll(): OrderRow[] { ... }
  findByStatus(status: string): OrderRow[] { ... }
  findByCustomerId(id: string): OrderRow[] { ... }
  findByProductSku(sku: string): OrderRow[] { ... }
  findByDateRange(from: Date, to: Date): OrderRow[] { ... }
  findByTotalGt(amount: number): OrderRow[] { ... }
  countByMonth(month: number): number { ... }
  save(row: OrderRow): void { ... }
  delete(id: string): void { ... }
  // 40 métodos depois: findByStatusAndCustomer...
  // lógica de query espalhada em quem chama
}`,
    after: `// Interface no Domínio — só o que o domínio precisa
export interface IOrderRepository {
  findById(id: OrderId): Promise<Order | null>
  findByCustomerId(customerId: CustomerId): Promise<Order[]>
  save(order: Order): Promise<void>
  // queries complexas vão pro Read Model (CQRS)
  // não tem findByStatus, findByDate, countByMonth
}

// Implementação na Infra — detalhe escondido
class PrismaOrderRepository implements IOrderRepository {
  async findById(id: OrderId): Promise<Order | null> {
    const row = await this.prisma.order.findUnique(...)
    if (!row) return null
    return OrderMapper.toDomain(row)  // raw -> domain entity
  }
  async save(order: Order): Promise<void> {
    const data = OrderMapper.toPersistence(order)
    await this.prisma.order.upsert(...)
  }
}`,
    explanation: 'Repository no DDD é focado em um aggregate e só expõe o que o domínio precisa. Queries analíticas (relatórios, filtros complexos) vão para Read Models no padrão CQRS — não no Repository. Isso mantém o Repository limpo e o domínio sem vazamento de preocupações de persistência.',
    tags: ['repository', 'CQRS', 'persistência'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Context Map: padrões de integração (ComparisonTable)
// ═══════════════════════════════════════════════════════════════════════════════

const CONTEXT_MAP_OPTIONS: ComparisonOption[] = [
  { id: 'acl',      label: 'Anti-Corruption Layer', sublabel: 'ACL',               color: C },
  { id: 'cs',       label: 'Customer-Supplier',      sublabel: 'Upstream/Downstream', color: SKY },
  { id: 'conf',     label: 'Conformist',             sublabel: 'Segue o upstream',  color: AMB },
  { id: 'sk',       label: 'Shared Kernel',          sublabel: 'Modelo compartilhado', color: PRP },
  { id: 'ohs',      label: 'Open Host Service',      sublabel: 'API pública',       color: GRN },
]

const CONTEXT_MAP_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'isolation',
    label: 'Isolamento de modelo',
    category: 'Proteção',
    description: 'Quanto o downstream fica protegido de mudanças no upstream',
    values: {
      acl:  { rating: 'excellent', note: 'Camada de tradução absorve mudanças upstream' },
      cs:   { rating: 'good',      note: 'Upstream não muda sem avisar downstream' },
      conf: { rating: 'poor',      note: 'Downstream adota modelo do upstream — acoplado' },
      sk:   { rating: 'fair',      note: 'Modelo compartilhado requer coordenação constante' },
      ohs:  { rating: 'good',      note: 'API pública versionada protege clientes' },
    },
  },
  {
    id: 'cost',
    label: 'Custo de implementação',
    category: 'Custo',
    description: 'Esforço de desenvolvimento e manutenção',
    values: {
      acl:  { rating: 'fair',      note: 'ACL exige mappers, testes, manutenção contínua' },
      cs:   { rating: 'good',      note: 'Protocolo acordado, menor overhead que ACL' },
      conf: { rating: 'excellent', note: 'Adota modelo pronto — custo mínimo de integração' },
      sk:   { rating: 'fair',      note: 'Coordenação entre times é cara no longo prazo' },
      ohs:  { rating: 'good',      note: 'Custo de publicar e versionar API pública' },
    },
  },
  {
    id: 'autonomy',
    label: 'Autonomia de times',
    category: 'Organização',
    description: 'Quanto cada time pode evoluir independentemente',
    values: {
      acl:  { rating: 'excellent', note: 'Downstream evolui sem depender de upstream' },
      cs:   { rating: 'good',      note: 'Upstream negocia — downstream tem voz' },
      conf: { rating: 'poor',      note: 'Downstream segue ritmo do upstream' },
      sk:   { rating: 'poor',      note: 'Times precisam sincronizar toda mudança' },
      ohs:  { rating: 'excellent', note: 'Clientes consomem API estável, upstream livre' },
    },
  },
  {
    id: 'use-case',
    label: 'Cenário ideal',
    category: 'Uso',
    description: 'Quando usar cada padrão',
    values: {
      acl:  { rating: 'excellent', note: 'Integrar sistema legado ou terceiro sem controle' },
      cs:   { rating: 'good',      note: 'Dois times internos com dependência clara' },
      conf: { rating: 'fair',      note: 'Upstream é padrão de mercado que não pode ser mudado' },
      sk:   { rating: 'fair',      note: 'Times pequenos com modelo estável e colaborativo' },
      ohs:  { rating: 'excellent', note: 'Contexto expõe API para vários consumers externos' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — Anti-patterns DDD (AntiPatternsGallery)
// ═══════════════════════════════════════════════════════════════════════════════

const DDD_ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'Aggregate gordo — tudo dentro do mesmo aggregate',
    wrong: [
      [{ text: '// Aggregate com 15 entidades filhas — viagem ao banco inteira', color: FGMUTE }],
      [{ text: 'class Order {', color: FG }],
      [{ text: '  items: OrderItem[]            // ok', color: GRN }],
      [{ text: '  customer: Customer            // ❌ outro aggregate!', color: RED }],
      [{ text: '  payment: Payment              // ❌ outro aggregate!', color: RED }],
      [{ text: '  shipment: Shipment            // ❌ outro aggregate!', color: RED }],
      [{ text: '  invoice: Invoice              // ❌ outro aggregate!', color: RED }],
      [{ text: '  notifications: Notification[] // ❌ nem é domínio de Order', color: RED }],
      [{ text: '}', color: FG }],
      [{ text: '// Toda transação carrega tudo — lenta, propensa a conflito', color: FGMUTE }],
    ],
    right: [
      [{ text: '// Aggregates pequenos, referência por ID entre eles', color: FGMUTE }],
      [{ text: 'class Order {', color: FG }],
      [{ text: '  id: OrderId', color: FG }],
      [{ text: '  customerId: CustomerId    // ✅ referência, não objeto', color: GRN }],
      [{ text: '  items: OrderItem[]        // ✅ dentro do limite do Order', color: GRN }],
      [{ text: '}', color: FG }],
      [{ text: '', color: FG }],
      [{ text: '// Cada aggregate vive em sua própria transação', color: FGMUTE }],
      [{ text: '// Customer, Payment, Shipment são aggregates separados', color: FGMUTE }],
      [{ text: '// Comunicação via Domain Events (desacoplado)', color: FGMUTE }],
    ],
    why: 'Aggregate gordo gera transações longas (lock contention), carrega dados desnecessários, aumenta risco de conflito em sistemas concorrentes e torna testes pesados. Regra de Vernon: prefira aggregates de 1-3 entidades. Referência por ID, não por objeto.',
  },
  {
    title: 'Lógica de negócio no Application Service',
    wrong: [
      [{ text: '// Application Service com IF de negócio — errado', color: FGMUTE }],
      [{ text: 'class ApproveOrderUseCase {', color: FG }],
      [{ text: '  async execute(orderId: string) {', color: FG }],
      [{ text: '    const order = await this.repo.findById(orderId)', color: FG }],
      [{ text: '    if (order.total.amount > 10000) {   // ❌ regra de negócio aqui', color: RED }],
      [{ text: '      order.status = "requires_review"  // ❌ mutação direta', color: RED }],
      [{ text: '    } else {', color: FG }],
      [{ text: '      order.status = "approved"         // ❌ invariante violável', color: RED }],
      [{ text: '    }', color: FG }],
      [{ text: '    await this.repo.save(order)', color: FG }],
      [{ text: '  }', color: FG }],
      [{ text: '}', color: FG }],
    ],
    right: [
      [{ text: '// Regra de negócio NO aggregate — Application Service orquestra', color: FGMUTE }],
      [{ text: 'class Order {', color: FG }],
      [{ text: '  approve(): OrderApproved {', color: FG }],
      [{ text: '    if (this.total.amount > 10000)    // ✅ regra no domínio', color: GRN }],
      [{ text: '      this.status = "requires_review"', color: FG }],
      [{ text: '    else', color: FG }],
      [{ text: '      this.status = "approved"', color: FG }],
      [{ text: '    return new OrderApproved(this.id, this.status)', color: FG }],
      [{ text: '  }', color: FG }],
      [{ text: '}', color: FG }],
      [{ text: 'class ApproveOrderUseCase {', color: FG }],
      [{ text: '  async execute(orderId: string) {', color: FG }],
      [{ text: '    const order = await this.repo.findById(orderId)', color: FG }],
      [{ text: '    const event = order.approve()     // ✅ só orquestra', color: GRN }],
      [{ text: '    await this.repo.save(order)', color: FG }],
      [{ text: '    await this.outbox.publish(event)', color: FG }],
      [{ text: '  }', color: FG }],
      [{ text: '}', color: FG }],
    ],
    why: 'Application Service que contém IFs de negócio é modelo anêmico com nome diferente. Toda regra de negócio vive no Domínio (aggregate, domain service). Application Service só orquestra: carrega, invoca, persiste, publica. Se o Application Service crescer com lógica, é sinal que a entidade perdeu o comportamento.',
  },
  {
    title: 'Repository com 40 métodos de query',
    wrong: [
      [{ text: 'interface IOrderRepository {', color: FG }],
      [{ text: '  findByStatus(s: string): Order[]           // ❌ query analítica', color: RED }],
      [{ text: '  findByDateRange(f: Date, t: Date): Order[] // ❌ query analítica', color: RED }],
      [{ text: '  countByMonth(m: number): number            // ❌ relatório', color: RED }],
      [{ text: '  findByProductSku(sku: string): Order[]     // ❌ join implícito', color: RED }],
      [{ text: '  getTopCustomers(n: number): Customer[]     // ❌ cruza aggregate!', color: RED }],
      [{ text: '  findPendingOlderThan(days: number): Order[] // ...', color: RED }],
      [{ text: '  // 35 métodos depois:', color: FGMUTE }],
      [{ text: '  findByStatusAndCustomerAndDate(...): Order[] // ❌', color: RED }],
      [{ text: '}', color: FG }],
    ],
    right: [
      [{ text: 'interface IOrderRepository {', color: FG }],
      [{ text: '  findById(id: OrderId): Promise<Order | null> // ✅', color: GRN }],
      [{ text: '  findByCustomerId(cId: CustomerId): Promise<Order[]> // ✅', color: GRN }],
      [{ text: '  save(order: Order): Promise<void>           // ✅', color: GRN }],
      [{ text: '}', color: FG }],
      [{ text: '', color: FG }],
      [{ text: '// Queries complexas vão pro Read Model (CQRS):', color: FGMUTE }],
      [{ text: 'class OrderQueryService {   // ✅ separado, otimizado', color: GRN }],
      [{ text: '  async findByStatus(s: string, page: Pagination) { ... }', color: FG }],
      [{ text: '  async getMonthlyReport(month: Date) { ... }', color: FG }],
      [{ text: '  async getTopCustomers(n: number) { ... }', color: FG }],
      [{ text: '}', color: FG }],
    ],
    why: 'Repository com muitos métodos vira DAO disfarçado. Queries complexas de leitura devem ir para Read Models (CQRS): SQL otimizado, views materializadas, Elasticsearch. O Repository de escrita fica limpo — só o que o aggregate precisa para garantir invariantes.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — Domain Event Flow (componente custom inline)
// ═══════════════════════════════════════════════════════════════════════════════

type EventStep = {
  id: number
  actor: string
  action: string
  detail: string
  type: 'command' | 'aggregate' | 'event' | 'handler' | 'infra'
  color: string
}

const EVENT_STEPS: EventStep[] = [
  { id: 1, actor: 'HTTP Controller',    action: 'ConfirmOrderCommand',         detail: 'Controller recebe POST /orders/:id/confirm e cria o Command',                                    type: 'command',   color: FGMUTE },
  { id: 2, actor: 'Application Service', action: 'Carrega Order via Repository', detail: 'UseCase chama orderRepo.findById(cmd.orderId) — Repository reconstrói o aggregate do banco', type: 'infra',     color: SKY },
  { id: 3, actor: 'Order (Aggregate)',   action: 'order.confirm()',              detail: 'Aggregate valida invariantes: tem itens? status é pending? Se não, lança DomainError',         type: 'aggregate', color: C },
  { id: 4, actor: 'Order (Aggregate)',   action: 'Emite OrderConfirmed',         detail: 'Aggregate retorna Domain Event: OrderConfirmed { orderId, total, customerId, confirmedAt }',  type: 'event',     color: AMB },
  { id: 5, actor: 'Application Service', action: 'Persiste + publica via Outbox', detail: 'repo.save(order) + outbox.publish(event) na mesma transação — garantia at-least-once',      type: 'infra',     color: SKY },
  { id: 6, actor: 'PaymentHandler',      action: 'Cobra pagamento',              detail: 'Handler no contexto de Payments reage ao evento — sem acoplamento direto com Orders',         type: 'handler',   color: GRN },
  { id: 7, actor: 'InventoryHandler',    action: 'Reserva estoque',              detail: 'Handler no contexto de Inventory — cada handler reage no seu bounded context',                type: 'handler',   color: GRN },
  { id: 8, actor: 'NotificationHandler', action: 'Envia email de confirmação',   detail: 'Handler no contexto de Notifications — não sabe nada sobre Order, só recebe o evento',       type: 'handler',   color: GRN },
]

const TYPE_COLORS: Record<string, string> = {
  command:   FGMUTE,
  aggregate: C,
  event:     AMB,
  handler:   GRN,
  infra:     SKY,
}

const TYPE_LABELS: Record<string, string> = {
  command:   'Command',
  aggregate: 'Aggregate',
  event:     'Domain Event',
  handler:   'Event Handler',
  infra:     'Infra',
}

function DomainEventFlowVisual() {
  const [activeStep, setActiveStep] = useState<number | null>(null)

  const activeData = activeStep !== null ? EVENT_STEPS[activeStep] : null

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, height: '100%' }}>
      {/* Fluxo */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: FGMUTE, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
          Clique em um passo para ver detalhes
        </div>
        {EVENT_STEPS.map((step, idx) => {
          const isActive = activeStep === idx
          const stepColor = step.color
          return (
            <div key={step.id} style={{ display: 'flex', gap: 12, alignItems: 'stretch', cursor: 'pointer' }}
              onClick={() => setActiveStep(isActive ? null : idx)}>
              {/* linha vertical */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 32, flexShrink: 0 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  background: isActive ? stepColor : `${stepColor}30`,
                  border: `2px solid ${stepColor}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: isActive ? '#000' : stepColor,
                  fontFamily: "'JetBrains Mono', monospace",
                  transition: 'all .2s',
                }}>
                  {step.id}
                </div>
                {idx < EVENT_STEPS.length - 1 && (
                  <div style={{ width: 2, flex: 1, minHeight: 8, background: `${stepColor}30`, marginTop: 2 }} />
                )}
              </div>
              {/* conteúdo */}
              <div style={{
                flex: 1, padding: '8px 14px', borderRadius: 8,
                background: isActive ? `${stepColor}18` : `${CARD}cc`,
                border: `1px solid ${isActive ? stepColor : LINE}`,
                transition: 'all .2s',
                marginBottom: idx < EVENT_STEPS.length - 1 ? 0 : 0,
              }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{
                    padding: '1px 7px', borderRadius: 4, fontSize: 10,
                    fontFamily: "'JetBrains Mono', monospace",
                    background: `${stepColor}25`, color: stepColor,
                    textTransform: 'uppercase', letterSpacing: 0.5,
                  }}>
                    {TYPE_LABELS[step.type]}
                  </span>
                  <span style={{ fontSize: 11, color: FGMUTE, fontFamily: "'JetBrains Mono', monospace" }}>{step.actor}</span>
                </div>
                <div style={{ fontSize: 13, color: FG, fontWeight: 600, marginTop: 4 }}>{step.action}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Painel lateral */}
      <div style={{
        background: CARD, borderRadius: 12, padding: 20,
        border: `1px solid ${activeData ? TYPE_COLORS[activeData.type] : LINE}`,
        transition: 'border-color .2s',
        display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        {activeData ? (
          <>
            <div>
              <div style={{ fontSize: 10, color: TYPE_COLORS[activeData.type], fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                Passo {activeData.id} — {TYPE_LABELS[activeData.type]}
              </div>
              <div style={{ fontSize: 15, color: FG, fontWeight: 700 }}>{activeData.action}</div>
              <div style={{ fontSize: 11, color: FGMUTE, marginTop: 2 }}>{activeData.actor}</div>
            </div>
            <div style={{ fontSize: 13, color: FG, lineHeight: 1.7 }}>{activeData.detail}</div>
            <div style={{ marginTop: 'auto', padding: '10px 14px', background: `${TYPE_COLORS[activeData.type]}12`, borderRadius: 8, border: `1px solid ${TYPE_COLORS[activeData.type]}30` }}>
              <div style={{ fontSize: 11, color: TYPE_COLORS[activeData.type], fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>POR QUÊ IMPORTA</div>
              <div style={{ fontSize: 12, color: FG, lineHeight: 1.6 }}>
                {activeData.type === 'aggregate' && 'O aggregate é a única fonte de verdade. Invariantes vivem aqui — nunca no Service.'}
                {activeData.type === 'event' && 'Domain Event é imutável e no passado. Permite reação desacoplada — handlers não sabem de cada outros.'}
                {activeData.type === 'handler' && 'Cada handler opera no seu bounded context. Nenhum acopla diretamente com Orders.'}
                {activeData.type === 'infra' && 'Infra serve o domínio, não o contrário. Repository e Outbox são detalhes de implementação.'}
                {activeData.type === 'command' && 'Command é intenção. Event é fato. A distinção evita confusão entre o que queremos e o que aconteceu.'}
              </div>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 32 }}>📣</div>
            <div style={{ fontSize: 14, color: FG, fontWeight: 600 }}>Fluxo de Domain Event</div>
            <div style={{ fontSize: 12, color: FGMUTE, lineHeight: 1.6 }}>
              Clique em qualquer passo para ver detalhes sobre o papel de cada ator no fluxo Command → Aggregate → Event → Handlers
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: 8 }}>
              {Object.entries(TYPE_LABELS).map(([type, label]) => (
                <span key={type} style={{
                  padding: '2px 8px', borderRadius: 4, fontSize: 10,
                  background: `${TYPE_COLORS[type]}20`, color: TYPE_COLORS[type],
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  {label}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 7 — "Devo usar DDD?" (DecisionTree)
// ═══════════════════════════════════════════════════════════════════════════════

const DDD_DECISION_ROOT: DTNode = {
  id: 'root',
  question: 'O domínio tem regras de negócio complexas e/ou mutáveis?',
  color: C,
  children: [
    { label: 'Sim', nodeId: 'complex', color: GRN },
    { label: 'Não', nodeId: 'simple', color: RED },
  ],
}

const DDD_DECISION_NODES: Record<string, DTNode> = {
  complex: {
    id: 'complex',
    question: 'O sistema vai durar anos e/ou é crítico para o negócio?',
    color: C2,
    children: [
      { label: 'Sim', nodeId: 'long-lived', color: GRN },
      { label: 'Não', nodeId: 'short-lived', color: AMB },
    ],
  },
  simple: {
    id: 'simple',
    question: 'É predominantemente CRUD (criar, listar, editar, deletar)?',
    color: AMB,
    children: [
      { label: 'Sim', nodeId: 'crud', color: RED },
      { label: 'Não', nodeId: 'maybe', color: AMB },
    ],
  },
  'long-lived': {
    id: 'long-lived',
    question: 'Você tem ou vai ter especialistas de domínio disponíveis?',
    color: C2,
    children: [
      { label: 'Sim', nodeId: 'use-ddd', color: GRN },
      { label: 'Não', nodeId: 'tactical-only', color: AMB },
    ],
  },
  'short-lived': {
    id: 'short-lived',
    recommendation: 'DDD Tático pode ajudar',
    detail: 'Sistema novo e temporário: use só os building blocks táticos (Entity, VO, Aggregate) sem o overhead estratégico completo. Isso traz benefícios de design sem o custo de Event Storming, Context Maps etc.',
    color: AMB,
    icon: '⚡',
  },
  crud: {
    id: 'crud',
    recommendation: 'Não use DDD — use CRUD simples',
    detail: 'CRUD puro (getters/setters, formulários, telas administrativas) não tem domínio rico para modelar. DDD seria theater arquitetural caro. Use um ORM direto, REST simples e foco em UX. DDD aqui gera boilerplate sem benefício.',
    color: RED,
    icon: '🚫',
  },
  maybe: {
    id: 'maybe',
    recommendation: 'Avalie o DDD Tático',
    detail: 'Sistema sem CRUD puro mas sem grande complexidade: comece com DDD Tático (Entities, VOs, Aggregates) sem Strategic DDD completo. Se a complexidade crescer, migre naturalmente para bounded contexts.',
    color: AMB,
    icon: '🤔',
  },
  'use-ddd': {
    id: 'use-ddd',
    recommendation: 'Use DDD completo (Strategic + Tático)',
    detail: 'Domínio complexo + sistema de longa vida + especialistas disponíveis: DDD completo é o investimento certo. Event Storming com o negócio, Context Map explícito, building blocks táticos em cada bounded context. O investimento paga no longo prazo.',
    color: GRN,
    icon: '✅',
  },
  'tactical-only': {
    id: 'tactical-only',
    recommendation: 'Use DDD Tático sem Strategic completo',
    detail: 'Sem especialistas de domínio, Strategic DDD perde metade do valor (Event Storming, Context Map e Ubiquitous Language precisam de colaboração). Use os building blocks táticos (Aggregate, VO, Repository, Domain Events) — já traz coesão e testabilidade sem o overhead estratégico.',
    color: SKY,
    icon: '🔧',
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export default function DddVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'layers',
      title: 'Camadas DDD',
      subtitle: 'Domain → Application → Infrastructure → Presentation',
      accent: C,
      component: (
        <LayerStack
          layers={DDD_LAYERS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'building-blocks',
      title: 'Building Blocks Táticos',
      subtitle: 'Aggregate, Entity, Value Object, Domain Service, Repository, Factory',
      accent: C,
      component: (
        <TreeExplorer
          tree={DDD_TREE}
          typeMap={DDD_TYPE_MAP}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          card2Color={CARD2}
        />
      ),
    },
    {
      id: 'domain-event-flow',
      title: 'Fluxo de Domain Event',
      subtitle: 'Command → Aggregate → Event → Handlers (desacoplados)',
      accent: AMB,
      component: <DomainEventFlowVisual />,
    },
    {
      id: 'anemia-vs-rico',
      title: 'Modelo Anêmico vs Modelo Rico',
      subtitle: 'O anti-pattern mais caro de DDD — e como evitar',
      accent: C,
      component: (
        <DiffViewer
          examples={DIFF_EXAMPLES}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'context-map',
      title: 'Context Map — Padrões de Integração',
      subtitle: 'ACL vs Customer-Supplier vs Conformist vs Shared Kernel vs Open Host',
      accent: C,
      component: (
        <ComparisonTable
          options={CONTEXT_MAP_OPTIONS}
          criteria={CONTEXT_MAP_CRITERIA}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'antipatterns',
      title: 'Anti-patterns DDD',
      subtitle: 'Aggregate gordo, lógica no AppService, Repository com 40 métodos',
      accent: RED,
      component: (
        <AntiPatternsGallery
          patterns={DDD_ANTIPATTERNS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'quando-usar',
      title: 'Devo usar DDD?',
      subtitle: 'Árvore de decisão para saber quando DDD vale o investimento',
      accent: C,
      component: (
        <DecisionTree
          root={DDD_DECISION_ROOT}
          nodes={DDD_DECISION_NODES}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
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
