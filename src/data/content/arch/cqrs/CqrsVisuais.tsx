'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { SequenceDiagram } from '@/components/visuals/SequenceDiagram'
import type { SeqActor, SeqMessage, SeqGroup } from '@/components/visuals/SequenceDiagram'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'
import { DiffViewer } from '@/components/visuals/DiffViewer'
import type { DiffExample } from '@/components/visuals/DiffViewer'
import { StateMachineExplorer } from '@/components/visuals/StateMachineExplorer'
import type { SMState, SMTransition } from '@/components/visuals/StateMachineExplorer'
import { DecisionTree } from '@/components/visuals/DecisionTree'
import type { DTNode } from '@/components/visuals/DecisionTree'
import { ProgressionMap } from '@/components/visuals/ProgressionMap'
import type { ProgressionLevel } from '@/components/visuals/ProgressionMap'

// ── Paleta CQRS ───────────────────────────────────────────────────────────────
const C      = '#1565C0'   // blue-800
const C2     = '#0e4d99'
const BG     = '#0f172a'
const CARD   = '#1e293b'
const CARD2  = '#243044'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const RED    = '#ef4444'
const GRN    = '#22c55e'
const AMB    = '#f59e0b'
const PRP    = '#a78bfa'
const TEAL   = '#2dd4bf'
const ORG    = '#fb923c'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Fluxo CQRS básico (SequenceDiagram)
// ═══════════════════════════════════════════════════════════════════════════════

const CQRS_ACTORS: SeqActor[] = [
  { id: 'client',  label: 'Client',          color: FG,    icon: '🌐' },
  { id: 'cmdbus',  label: 'Command Bus',      color: RED,   icon: '📨' },
  { id: 'handler', label: 'Command Handler',  color: RED,   icon: '⚙️' },
  { id: 'wdb',     label: 'Write DB',         color: '#4479A1', icon: '🗄️' },
  { id: 'event',   label: 'Event Bus',        color: AMB,   icon: '📡' },
  { id: 'proj',    label: 'Projector',        color: PRP,   icon: '🔨' },
  { id: 'rdb',     label: 'Read DB (Redis)',   color: '#DC382D', icon: '⚡' },
  { id: 'qbus',    label: 'Query Bus',         color: GRN,   icon: '🔍' },
  { id: 'qhandler',label: 'Query Handler',     color: GRN,   icon: '📖' },
]

const CQRS_MESSAGES: SeqMessage[] = [
  // Command side
  { from: 'client',   to: 'cmdbus',   label: 'dispatch(CreateOrderCommand)',       type: 'sync',   note: 'Command é um objeto imutável com intenção de mudança. Tem nome no imperativo.' },
  { from: 'cmdbus',   to: 'handler',  label: 'route → CreateOrderCommandHandler',  type: 'sync',   note: '1 command → 1 handler. Relação 1:1.' },
  { from: 'handler',  to: 'handler',  label: 'validate + apply domain rules',      type: 'sync',   note: 'Handler conhece o Aggregate. Valida invariantes de negócio.' },
  { from: 'handler',  to: 'wdb',      label: 'save Order aggregate',               type: 'sync',   note: 'Persiste no write DB — normalizado, ACID, com restrições.' },
  { from: 'wdb',      to: 'handler',  label: 'OK (id: 42)',                        type: 'return' },
  { from: 'handler',  to: 'event',    label: 'publish OrderCreatedEvent',          type: 'async',  note: 'Após persistir, publica evento. Outros sistemas reagem assincronamente.' },
  { from: 'handler',  to: 'client',   label: '202 Accepted {orderId: 42}',         type: 'return', note: 'Resposta ao client. Command não retorna dados de negócio — só confirmação.' },
  // Projection
  { from: 'event',    to: 'proj',     label: 'OrderCreatedEvent consumed',         type: 'async',  note: 'Projector constrói o read model a partir do evento.' },
  { from: 'proj',     to: 'rdb',      label: 'UPSERT order_summary_view',          type: 'sync',   note: 'Read model denormalizado, otimizado para a query específica.' },
  // Query side
  { from: 'client',   to: 'qbus',     label: 'query(GetOrdersByUser{userId:5})',   type: 'sync',   note: 'Query é somente leitura — sem efeito colateral.' },
  { from: 'qbus',     to: 'qhandler', label: 'route → GetOrdersByUserHandler',     type: 'sync' },
  { from: 'qhandler', to: 'rdb',      label: 'SELECT * FROM order_summary_view WHERE user_id=5', type: 'sync', note: 'Lê direto do read model — sem JOIN, sem cálculo, ultra-rápido.' },
  { from: 'rdb',      to: 'qhandler', label: 'orders[]',                           type: 'return' },
  { from: 'qhandler', to: 'client',   label: '200 {orders: [...]}',                type: 'return' },
]

const CQRS_GROUPS: SeqGroup[] = [
  { label: 'Command Side (Write)', kind: 'ref', fromMsg: 0, toMsg: 6, color: `${RED}10` },
  { label: 'Projeção Assíncrona', kind: 'par', fromMsg: 7, toMsg: 8, color: `${AMB}10` },
  { label: 'Query Side (Read)', kind: 'ref', fromMsg: 9, toMsg: 13, color: `${GRN}10` },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — CQRS + Event Sourcing (SequenceDiagram)
// ═══════════════════════════════════════════════════════════════════════════════

const ES_ACTORS: SeqActor[] = [
  { id: 'client',   label: 'Client',          color: FG,    icon: '🌐' },
  { id: 'handler',  label: 'Command Handler', color: RED,   icon: '⚙️' },
  { id: 'store',    label: 'Event Store',     color: AMB,   icon: '📚' },
  { id: 'bus',      label: 'Event Bus',       color: PRP,   icon: '📡' },
  { id: 'proj1',    label: 'Projector Orders',color: GRN,   icon: '📋' },
  { id: 'proj2',    label: 'Projector Search',color: TEAL,  icon: '🔍' },
  { id: 'redis',    label: 'Redis (orders)',  color: '#DC382D', icon: '⚡' },
  { id: 'elastic',  label: 'ElasticSearch',  color: '#FEC514', icon: '🔎' },
]

const ES_MESSAGES: SeqMessage[] = [
  { from: 'client',  to: 'handler', label: 'PlaceOrderCommand',                    type: 'sync' },
  { from: 'handler', to: 'store',   label: 'loadEvents(aggregateId)',              type: 'sync',   note: 'Reconstrói estado do Aggregate replay de eventos passados.' },
  { from: 'store',   to: 'handler', label: 'events[] (OrderCreated, ItemAdded...)', type: 'return', note: 'Estado atual = apply(events). Nunca mutação direta.' },
  { from: 'handler', to: 'handler', label: 'apply business rules on current state', type: 'sync' },
  { from: 'handler', to: 'store',   label: 'append(OrderPlacedEvent)',             type: 'sync',   note: 'Event Store é append-only — nunca deleta, nunca atualiza.' },
  { from: 'store',   to: 'handler', label: 'OK (version: 4)',                      type: 'return' },
  { from: 'handler', to: 'client',  label: '202 Accepted',                         type: 'return' },
  { from: 'store',   to: 'bus',     label: 'publish OrderPlacedEvent',             type: 'async',  note: 'Fanout para todos os projectors interessados.' },
  { from: 'bus',     to: 'proj1',   label: 'consume OrderPlacedEvent',             type: 'async' },
  { from: 'bus',     to: 'proj2',   label: 'consume OrderPlacedEvent',             type: 'async',  note: 'Projeção paralela — cada projector atualiza seu read model.' },
  { from: 'proj1',   to: 'redis',   label: 'UPSERT orders:42 {status, items...}',  type: 'sync' },
  { from: 'proj2',   to: 'elastic', label: 'index order document',                 type: 'sync',   note: 'Read model denormalizado para full-text search.' },
]

const ES_GROUPS: SeqGroup[] = [
  { label: 'Reconstituição do Aggregate', kind: 'ref', fromMsg: 1, toMsg: 2, color: `${AMB}10` },
  { label: 'Projeções paralelas', kind: 'par', fromMsg: 8, toMsg: 11, color: `${GRN}10` },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Eventual Consistency: write → projeção → leitura (State Machine)
// ═══════════════════════════════════════════════════════════════════════════════

const EC_STATES: SMState[] = [
  { id: 'write',    label: 'Write Persistido',   description: 'Dado salvo no write DB. Command handler retornou 202.', color: RED,   isInitial: true },
  { id: 'event',    label: 'Evento Publicado',   description: 'OrderCreatedEvent no broker. Ainda não processado pelos projectors.', color: AMB },
  { id: 'queued',   label: 'Na Fila do Projector', description: 'Evento aguardando ser consumido. Consumer pode estar ocupado.', color: ORG },
  { id: 'projecting', label: 'Projetando',       description: 'Projector processando o evento e atualizando o read model.', color: PRP },
  { id: 'consistent', label: 'Consistente',      description: 'Read model atualizado. Query agora retorna dado correto.', color: GRN, isFinal: true },
  { id: 'failed',   label: 'Falha na Projeção',  description: 'Erro no projector. Dado vai para DLQ para retry ou análise manual.', color: '#64748b' },
  { id: 'rebuilt',  label: 'Read Model Reconstruído', description: 'Replay completo de todos os eventos para reconstruir o read model do zero.', color: TEAL },
]

const EC_TRANSITIONS: SMTransition[] = [
  { from: 'write',    to: 'event',      event: 'handler publica evento',   code: 'eventBus.publish(OrderCreatedEvent)' },
  { from: 'event',    to: 'queued',     event: 'broker recebe',            code: 'kafka.send(topic, event)' },
  { from: 'queued',   to: 'projecting', event: 'projector consome',        code: 'consumer.consume(OrderCreatedEvent)' },
  { from: 'projecting', to: 'consistent', event: 'projeção bem-sucedida',  code: 'redis.upsert(readModel)' },
  { from: 'projecting', to: 'failed',   event: 'erro no projector',        code: 'throw Error / DLQ' },
  { from: 'failed',   to: 'queued',     event: 'retry após backoff',       code: 'dlq.retry(event, delay)' },
  { from: 'failed',   to: 'rebuilt',    event: 'reconstrução manual',      code: 'projector.rebuild(allEvents)' },
  { from: 'rebuilt',  to: 'consistent', event: 'replay completo',          code: 'redis.rebuild(events)' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Projeções múltiplas: mesmo evento, read models diferentes (custom)
// ═══════════════════════════════════════════════════════════════════════════════

type Projection = {
  id: string
  name: string
  color: string
  db: string
  schema: string
  query: string
  useCase: string
}

const PROJECTIONS: Projection[] = [
  {
    id: 'orders-list',
    name: 'OrdersListProjector',
    color: GRN,
    db: 'Redis Hash',
    schema: 'orders:{userId} → [{id, status, total, date}]',
    query: 'GET orders:{userId}',
    useCase: 'Listagem de pedidos do usuário na tela de conta',
  },
  {
    id: 'order-detail',
    name: 'OrderDetailProjector',
    color: C,
    db: 'PostgreSQL (read)',
    schema: 'order_details_view: id, items[], addresses, payment, history',
    query: 'SELECT * FROM order_details_view WHERE id = ?',
    useCase: 'Página de detalhe de pedido com histórico completo',
  },
  {
    id: 'search',
    name: 'OrderSearchProjector',
    color: '#FEC514',
    db: 'ElasticSearch',
    schema: '{ orderId, customerName, productNames[], status, createdAt }',
    query: 'GET /orders/_search?q=tênis+corrida',
    useCase: 'Busca full-text por produto, cliente ou número de pedido',
  },
  {
    id: 'analytics',
    name: 'RevenueAnalyticsProjector',
    color: AMB,
    db: 'ClickHouse (OLAP)',
    schema: 'orders_fact: date, product_id, region, revenue, quantity',
    query: 'SELECT SUM(revenue) GROUP BY date, product_id',
    useCase: 'Dashboard de BI com revenue por produto e região',
  },
  {
    id: 'shipping',
    name: 'ShippingProjector',
    color: ORG,
    db: 'MongoDB',
    schema: '{ orderId, shippingAddress, items[], weight, carrier }',
    query: 'db.shipments.findOne({ orderId })',
    useCase: 'Serviço de logística que calcula frete e rastreio',
  },
]

function MultipleProjectionsVisual() {
  const [selected, setSelected] = useState<string | null>(null)
  const proj = PROJECTIONS.find(p => p.id === selected)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Evento central */}
      <div style={{
        padding: '12px 20px',
        borderRadius: 10,
        background: `${AMB}15`,
        border: `2px solid ${AMB}50`,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 13, color: AMB, fontWeight: 700, marginBottom: 4 }}>OrderPlacedEvent</div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: FGMUTE }}>
          {'{ orderId, userId, items[], total, timestamp }'}
        </div>
        <div style={{ fontSize: 11, color: FGMUTE, marginTop: 4 }}>
          Um único evento → múltiplos read models independentes
        </div>
      </div>

      {/* Setas de fan-out */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 3, opacity: 0.5 }}>
        {PROJECTIONS.map((p, i) => (
          <div key={p.id} style={{
            width: 1,
            height: 24,
            background: p.color,
            transform: `rotate(${(i - 2) * 18}deg)`,
            transformOrigin: 'top center',
          }} />
        ))}
      </div>

      {/* Projectors */}
      <div style={{ display: 'flex', gap: 8 }}>
        {PROJECTIONS.map(p => (
          <button
            key={p.id}
            onClick={() => setSelected(selected === p.id ? null : p.id)}
            style={{
              flex: 1,
              padding: '10px 8px',
              borderRadius: 8,
              border: `2px solid ${selected === p.id ? p.color : LINE}`,
              background: selected === p.id ? `${p.color}15` : CARD,
              color: selected === p.id ? p.color : FGMUTE,
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 10,
              fontWeight: selected === p.id ? 700 : 400,
              textAlign: 'center',
              transition: 'all .2s',
            }}
          >
            <div style={{ fontSize: 16, marginBottom: 4 }}>🔨</div>
            <div>{p.name.replace('Projector', '').replace('Analytics', 'Analytics ')}</div>
            <div style={{ fontSize: 9, color: selected === p.id ? p.color : '#475569', marginTop: 2 }}>→ {p.db.split(' ')[0]}</div>
          </button>
        ))}
      </div>

      {/* Painel de detalhe */}
      {proj ? (
        <div style={{
          padding: '14px 16px',
          borderRadius: 10,
          background: `${proj.color}08`,
          border: `2px solid ${proj.color}30`,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
        }}>
          <div>
            <div style={{ fontSize: 11, color: FGMUTE, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.5px' }}>Read Model</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: FG, background: CARD2, padding: '8px 10px', borderRadius: 6 }}>
              {proj.schema}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: FGMUTE, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.5px' }}>Banco de dados</div>
            <div style={{ fontSize: 13, color: proj.color, fontWeight: 700, marginBottom: 6 }}>{proj.db}</div>
            <div style={{ fontSize: 11, color: FGMUTE, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.5px' }}>Query típica</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: FG, background: CARD2, padding: '6px 10px', borderRadius: 6 }}>
              {proj.query}
            </div>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{ fontSize: 11, color: FGMUTE, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.5px' }}>Caso de uso</div>
            <div style={{ fontSize: 13, color: FG }}>{proj.useCase}</div>
          </div>
        </div>
      ) : (
        <div style={{ padding: '12px 16px', borderRadius: 8, background: CARD, border: `1px solid ${LINE}`, fontSize: 13, color: FGMUTE, textAlign: 'center' }}>
          Clique em um projector para ver o read model que ele constrói
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — CQRS vs CRUD vs Event Sourcing (ComparisonTable)
// ═══════════════════════════════════════════════════════════════════════════════

const ARCH_OPTIONS: ComparisonOption[] = [
  { id: 'crud',  label: 'CRUD Simples',    sublabel: 'REST direto no DB',        color: FGMUTE },
  { id: 'cqrs',  label: 'CQRS',           sublabel: 'Command/Query separados',  color: C },
  { id: 'cqrses',label: 'CQRS + Event Sourcing', sublabel: 'Event Store como truth', color: AMB },
]

const ARCH_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'complexity',
    label: 'Complexidade de implementação',
    category: 'Custo',
    values: {
      crud:   { rating: 'excellent', note: 'Controller → Service → Repository. Simples e direto.' },
      cqrs:   { rating: 'fair',      note: 'Command bus, handlers, projetores, read model separado.' },
      cqrses: { rating: 'poor',      note: 'Event Store, replay, projetores, snapshot, versionamento.' },
    },
  },
  {
    id: 'scale',
    label: 'Escala de leitura independente',
    category: 'Performance',
    values: {
      crud:   { rating: 'fair', note: 'Read replica, mas mesmo schema para read e write.' },
      cqrs:   { rating: 'excellent', note: 'Read model otimizado por query. Redis, Elastic, etc.' },
      cqrses: { rating: 'excellent', note: 'Múltiplos read models, cada um com storage ideal.' },
    },
  },
  {
    id: 'audit',
    label: 'Histórico / Audit Log',
    category: 'Rastreabilidade',
    values: {
      crud:   { rating: 'poor', note: 'Sem histórico nativo — dado é sobrescrito.' },
      cqrs:   { rating: 'fair', note: 'Depende de implementação de audit log separado.' },
      cqrses: { rating: 'excellent', note: 'Event Store É o audit log. Todo estado é derivado de eventos.' },
    },
  },
  {
    id: 'debug',
    label: 'Debugging e rastreabilidade',
    category: 'Manutenibilidade',
    values: {
      crud:   { rating: 'excellent', note: 'Fácil — o banco tem o estado atual direto.' },
      cqrs:   { rating: 'fair',      note: 'Dois bancos = confusão de onde está o dado correto.' },
      cqrses: { rating: 'poor',      note: 'Replay de eventos pode ser demorado para debugar.' },
    },
  },
  {
    id: 'consistency',
    label: 'Consistência de leitura',
    category: 'Dados',
    values: {
      crud:   { rating: 'excellent', note: 'Sempre forte — mesma transação ACID.' },
      cqrs:   { rating: 'fair',      note: 'Eventual — lag entre write e projeção (ms a s).' },
      cqrses: { rating: 'fair',      note: 'Eventual — depende do tempo de projeção dos eventos.' },
    },
  },
  {
    id: 'usecase',
    label: 'Quando usar',
    category: 'Decisão',
    values: {
      crud:   { rating: 'excellent', note: 'Apps com carga moderada e requisitos simples (maioria dos casos).' },
      cqrs:   { rating: 'good',      note: 'Leitura muito mais pesada que escrita, read models divergentes.' },
      cqrses: { rating: 'good',      note: 'Audit log crítico, temporal queries, business events como first-class.' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — DiffViewer: CQRS vs serviço anêmico
// ═══════════════════════════════════════════════════════════════════════════════

const CQRS_DIFFS: DiffExample[] = [
  {
    id: 'command-handler',
    label: 'Command Handler vs Service Anêmico',
    description: 'CQRS com handler explícito vs service genérico que mistura read e write',
    beforeLabel: 'Service Anêmico (sem CQRS)',
    afterLabel: 'Command Handler (CQRS)',
    before: `// ❌ OrderService mistura leitura e escrita
class OrderService {
  async createOrder(data: CreateOrderDto) {
    const user = await this.userRepo.findById(data.userId)
    const order = new Order(data)
    await this.orderRepo.save(order)
    return order
  }

  async getOrders(userId: string) {
    // mesma classe, mesma instância
    return this.orderRepo.findByUserId(userId)
  }

  async cancelOrder(id: string) {
    const order = await this.orderRepo.findById(id)
    order.status = 'cancelled'
    await this.orderRepo.save(order)
  }
}`,
    after: `// ✅ Comando separado de consulta
class CreateOrderCommandHandler {
  async handle(cmd: CreateOrderCommand): Promise<void> {
    const order = Order.create(cmd.userId, cmd.items)
    await this.writeRepo.save(order)
    await this.eventBus.publish(new OrderCreatedEvent(order))
    // retorna void — não retorna dado de leitura
  }
}

// Query completamente separada
class GetOrdersByUserQueryHandler {
  async handle(q: GetOrdersByUserQuery) {
    // lê do read model otimizado, não do write DB
    return this.redis.get(\`orders:\${q.userId}\`)
  }
}`,
    explanation: 'Command Handler retorna void — apenas muda estado. Query Handler apenas lê — sem efeito colateral. A separação força cada classe a ter responsabilidade única.',
    tags: ['command', 'query', 'separation', 'srp'],
  },
  {
    id: 'aggregate',
    label: 'Aggregate com Domain Events vs entidade passiva',
    description: 'Aggregate rico que emite eventos vs entidade que apenas guarda dados',
    beforeLabel: 'Entidade Passiva',
    afterLabel: 'Aggregate com Domain Events',
    before: `// ❌ Entidade anêmica — só dados, sem comportamento
class Order {
  id: string
  status: string
  items: OrderItem[]
  // sem métodos de domínio
  // sem eventos
}

// Service faz tudo
class OrderService {
  async place(order: Order) {
    order.status = 'placed'  // mutação direta
    await this.repo.save(order)
    // fácil de esquecer de publicar evento
    await this.kafka.send('order-placed', order)
  }
}`,
    after: `// ✅ Aggregate rico — comportamento + eventos
class Order {
  private _events: DomainEvent[] = []

  static create(userId: string, items: OrderItem[]): Order {
    const order = new Order(userId, items)
    order._events.push(new OrderCreatedEvent(order))
    return order
  }

  place(): void {
    if (this.status !== 'pending') throw new Error('...')
    this.status = 'placed'
    this._events.push(new OrderPlacedEvent(this))
  }

  pullEvents(): DomainEvent[] {
    const events = [...this._events]
    this._events = []
    return events
  }
}`,
    explanation: 'Aggregate emite seus próprios eventos — impossível esquecer. Invariantes de negócio protegidas dentro do aggregate. Handler apenas orquestra.',
    tags: ['aggregate', 'domain-events', 'rich-domain'],
  },
  {
    id: 'projection',
    label: 'Projector: event → read model',
    description: 'Como construir um read model denormalizado a partir de eventos',
    beforeLabel: 'CRUD com JOIN na query',
    afterLabel: 'Read Model pré-computado (CQRS)',
    before: `// ❌ Query com múltiplos JOINs em tempo real
// Executada milhares de vezes por segundo
SELECT
  o.id, o.status, o.created_at,
  u.name as customer_name,
  p.name as product_name,
  oi.quantity, oi.price
FROM orders o
JOIN users u ON u.id = o.user_id
JOIN order_items oi ON oi.order_id = o.id
JOIN products p ON p.id = oi.product_id
WHERE o.user_id = $1
ORDER BY o.created_at DESC`,
    after: `// ✅ Projector constrói read model denormalizado
// Executado apenas quando evento chega
class OrderListProjector {
  async on(event: OrderCreatedEvent) {
    const summary = {
      id: event.orderId,
      status: 'pending',
      customerName: event.customerName, // já desnormalizado
      items: event.items.map(i => ({
        name: i.productName, // sem JOIN
        qty: i.quantity,
        price: i.price,
      })),
      total: event.total,
      createdAt: event.timestamp,
    }
    // Query é trivial: 1 leitura Redis
    await redis.hset(\`orders:\${event.userId}\`, summary)
  }
}`,
    explanation: 'O custo do JOIN é pago uma vez na projeção, não em cada query. Read model pré-computado permite O(1) de leitura independente do volume de dados.',
    tags: ['projection', 'read-model', 'denormalization', 'performance'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 7 — Anti-patterns de CQRS
// ═══════════════════════════════════════════════════════════════════════════════

const CQRS_ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'CQRS para CRUD simples (over-engineering)',
    wrong: [
      [{ text: '// App de blog com 100 usuários', color: '#64748b' }],
      [{ text: 'class CreatePostCommandHandler { ... }', color: RED }],
      [{ text: 'class PostCreatedEventProjector { ... }', color: RED }],
      [{ text: 'class GetPostsQueryHandler { ... }', color: RED }],
      [{ text: '// 5x mais código para a mesma funcionalidade', color: RED }],
    ],
    right: [
      [{ text: '// CRUD direto — adequado para essa escala', color: '#64748b' }],
      [{ text: 'class PostController {', color: GRN }],
      [{ text: '  async create(dto: CreatePostDto) {', color: GRN }],
      [{ text: '    return this.postService.create(dto)', color: GRN }],
      [{ text: '  }', color: GRN }],
      [{ text: '  async findAll() { return this.postService.findAll() }', color: GRN }],
      [{ text: '}', color: GRN }],
    ],
    why: 'CQRS resolve problemas de escala e complexidade que CRUD simples não tem. Introduzi-lo prematuramente é over-engineering que custa caro em manutenção.',
  },
  {
    title: 'Command retornando dados de negócio',
    wrong: [
      [{ text: '// ❌ Command retorna o recurso criado', color: RED }],
      [{ text: 'class CreateOrderHandler {', color: RED }],
      [{ text: '  async handle(cmd): Promise<Order> {', color: RED }],
      [{ text: '    const order = await this.repo.save(cmd)', color: '#64748b' }],
      [{ text: '    return order  // ❌ viola CQRS', color: RED }],
      [{ text: '  }', color: RED }],
      [{ text: '}', color: RED }],
    ],
    right: [
      [{ text: '// ✅ Command retorna void ou apenas o ID', color: GRN }],
      [{ text: 'class CreateOrderHandler {', color: GRN }],
      [{ text: '  async handle(cmd): Promise<void> {', color: GRN }],
      [{ text: '    await this.repo.save(cmd)', color: '#64748b' }],
      [{ text: '    await this.eventBus.publish(new OrderCreatedEvent(...))', color: GRN }],
      [{ text: '    // Client usa query separada para buscar o resultado', color: GRN }],
      [{ text: '  }', color: GRN }],
      [{ text: '}', color: GRN }],
    ],
    why: 'Command misturado com Query quebra o princípio CQS. Client deve usar Query separada para ler o resultado — isso é o fundamento do CQRS.',
  },
  {
    title: 'Query Handler fazendo write (efeito colateral)',
    wrong: [
      [{ text: '// ❌ Query handler atualiza "last_seen_at"', color: RED }],
      [{ text: 'class GetUserQueryHandler {', color: RED }],
      [{ text: '  async handle(q: GetUserQuery) {', color: RED }],
      [{ text: '    const user = await this.rdb.find(q.id)', color: '#64748b' }],
      [{ text: '    user.lastSeenAt = new Date()  // ❌ WRITE em Query!', color: RED }],
      [{ text: '    await this.wdb.save(user)', color: RED }],
      [{ text: '    return user', color: '#64748b' }],
      [{ text: '  }', color: RED }],
      [{ text: '}', color: RED }],
    ],
    right: [
      [{ text: '// ✅ Query apenas lê — efeito colateral via evento', color: GRN }],
      [{ text: 'class GetUserQueryHandler {', color: GRN }],
      [{ text: '  async handle(q: GetUserQuery) {', color: GRN }],
      [{ text: '    return this.rdb.find(q.id) // só leitura', color: GRN }],
      [{ text: '  }', color: GRN }],
      [{ text: '}', color: GRN }],
      [{ text: '// lastSeenAt atualizado via UserViewedEvent (assíncrono)', color: '#64748b' }],
    ],
    why: 'Query com efeito colateral viola CQS e quebra o contrato de read model. Leitura deve ser idempotente — chamar N vezes tem o mesmo resultado que 1 vez.',
  },
  {
    title: 'Projeção síncrona bloqueando a response',
    wrong: [
      [{ text: '// ❌ Handler aguarda projeção antes de responder', color: RED }],
      [{ text: 'async handle(cmd: CreateOrderCommand) {', color: RED }],
      [{ text: '  await this.repo.save(order)  // write DB', color: '#64748b' }],
      [{ text: '  await this.projector.project(order)  // SINCRONO ❌', color: RED }],
      [{ text: '  await this.searchProjector.index(order) // SINCRONO ❌', color: RED }],
      [{ text: '  return response  // latência acumulada', color: RED }],
      [{ text: '}', color: RED }],
    ],
    right: [
      [{ text: '// ✅ Handler persiste e publica evento — projeção é assíncrona', color: GRN }],
      [{ text: 'async handle(cmd: CreateOrderCommand) {', color: GRN }],
      [{ text: '  await this.repo.save(order)', color: '#64748b' }],
      [{ text: '  await this.eventBus.publish(new OrderCreatedEvent(order))', color: GRN }],
      [{ text: '  return { orderId: order.id }  // resposta imediata', color: GRN }],
      [{ text: '}', color: GRN }],
      [{ text: '// Projectors consomem o evento independentemente', color: '#64748b' }],
    ],
    why: 'Projeção síncrona anula o benefício do CQRS. O ponto é que o write side não precisa esperar o read model estar pronto.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 8 — Quando usar CQRS? (DecisionTree)
// ═══════════════════════════════════════════════════════════════════════════════

const CQRS_DT_ROOT: DTNode = {
  id: 'root',
  question: 'Por que você está considerando CQRS?',
  color: C,
  children: [
    { label: 'Leitura muito mais pesada que escrita', nodeId: 'read-heavy',   color: GRN },
    { label: 'Modelos de read e write divergem',      nodeId: 'divergent',    color: C   },
    { label: 'Preciso de audit log completo',         nodeId: 'audit',        color: AMB },
    { label: 'Time de tech sugeriu CQRS',             nodeId: 'hype',         color: RED },
  ],
}

const CQRS_DT_NODES: Record<string, DTNode> = {
  'read-heavy': {
    id: 'read-heavy',
    question: 'Leitura é 10× mais pesada que escrita?',
    color: GRN,
    children: [
      { label: 'Sim — diferença muito grande',    nodeId: 'use-cqrs',    color: GRN },
      { label: 'Não — ratio razoável (~3:1)',     nodeId: 'use-replica', color: FGMUTE },
    ],
  },
  divergent: {
    id: 'divergent',
    question: 'Seu modelo de leitura precisa ser muito diferente do de escrita?',
    color: C,
    children: [
      { label: 'Sim — JOINs pesados, denormalização necessária', nodeId: 'use-cqrs',   color: C    },
      { label: 'Não — mesma estrutura serve para ambos',         nodeId: 'use-crud',   color: FGMUTE },
    ],
  },
  audit: {
    id: 'audit',
    question: 'Precisa de histórico completo e replay de estados?',
    color: AMB,
    children: [
      { label: 'Sim — audit trail é requisito crítico',    nodeId: 'use-es',    color: AMB },
      { label: 'Não — apenas log de ação basta',           nodeId: 'use-cqrs',  color: C   },
    ],
  },
  hype: {
    id: 'hype',
    recommendation: 'Não use CQRS agora',
    detail: 'CQRS não é "melhor arquitetura" — é solução para problemas específicos. Se o problema não é leitura vs escrita desbalanceada ou modelos divergentes, o custo de complexidade não se justifica.',
    color: RED,
    icon: '🚫',
  },
  'use-cqrs': {
    id: 'use-cqrs',
    recommendation: 'Use CQRS sem Event Sourcing',
    detail: 'Command/Query separados com write DB (Postgres) + read model otimizado (Redis/Elastic). Projectors assíncronos. Eventual consistency no read.',
    color: C,
    icon: '✅',
  },
  'use-es': {
    id: 'use-es',
    recommendation: 'Use CQRS + Event Sourcing',
    detail: 'Event Store como fonte da verdade. Estado derivado de replay de eventos. Múltiplos read models reconstruíveis. Maior complexidade operacional — justificado para domínios críticos.',
    color: AMB,
    icon: '📚',
  },
  'use-replica': {
    id: 'use-replica',
    recommendation: 'Read Replica é suficiente',
    detail: 'Read Replica do Postgres com mesmo schema é mais simples e resolve a maioria dos casos de ratio 3:1 a 5:1. CQRS seria over-engineering aqui.',
    color: FGMUTE,
    icon: '🗄️',
  },
  'use-crud': {
    id: 'use-crud',
    recommendation: 'CRUD é a escolha certa',
    detail: 'Se o modelo de read e write são similares e a escala é moderada, CRUD simples tem muito menos overhead. Refatore para CQRS apenas quando sentir a dor real.',
    color: FGMUTE,
    icon: '👍',
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 9 — Arquitetura em camadas CQRS (LayerStack)
// ═══════════════════════════════════════════════════════════════════════════════

const CQRS_LAYERS: Layer[] = [
  {
    id: 'api',
    label: 'API Layer (Controller)',
    sublabel: 'Entrada de Commands e Queries',
    description: 'Recebe HTTP requests. Cria Command ou Query objects. Despacha para o bus correspondente. Não contém lógica de negócio.',
    color: FG,
    code: 'commandBus.dispatch(new CreateOrderCommand(dto))',
    examples: ['POST /orders → CreateOrderCommand', 'GET /orders → GetOrdersQuery'],
  },
  {
    id: 'bus',
    label: 'Command Bus / Query Bus',
    sublabel: 'Roteamento e middleware',
    description: 'Roteia Command para seu handler e Query para seu handler. Pode ter middleware: logging, validação, auth, transaction. Mediator pattern.',
    color: C,
    code: 'register(CreateOrderCommand, CreateOrderCommandHandler)',
    examples: ['MediatR (.NET)', 'NestJS CQRS module', 'CommandBus custom'],
  },
  {
    id: 'handler',
    label: 'Command Handler / Query Handler',
    sublabel: '1 command = 1 handler | 1 query = 1 handler',
    description: 'Command Handler: valida, carrega Aggregate, aplica regras, persiste, publica evento. Query Handler: lê do read model, sem regra de negócio.',
    color: RED,
    code: 'handle(cmd: CreateOrderCommand): Promise<void>',
    examples: ['CreateOrderCommandHandler', 'GetOrdersByUserQueryHandler'],
  },
  {
    id: 'domain',
    label: 'Domain Model (Aggregates)',
    sublabel: 'Lógica de negócio encapsulada',
    description: 'Aggregates com comportamento rico. Emitem Domain Events ao mudar estado. Protegem invariantes. Não dependem de infra.',
    color: AMB,
    code: 'order.place() // → emite OrderPlacedEvent',
    examples: ['Order.create()', 'Order.cancel()', 'Order.addItem()'],
  },
  {
    id: 'projection',
    label: 'Event Handler / Projector',
    sublabel: 'Constrói o Read Model',
    description: 'Consome eventos do Domain e atualiza o read model. Assíncrono — desacoplado do write path. Pode ser reconstruído do zero via replay.',
    color: PRP,
    code: 'on(OrderCreatedEvent): upsert(readModel)',
    examples: ['OrderListProjector', 'RevenueAnalyticsProjector', 'SearchIndexProjector'],
  },
  {
    id: 'storage',
    label: 'Storages Especializados',
    sublabel: 'Write DB + Read DBs otimizados',
    description: 'Write DB normalizado (Postgres) para consistência. Read DBs escolhidos por query: Redis (O(1)), ElasticSearch (full-text), ClickHouse (analytics).',
    color: TEAL,
    examples: ['Write: PostgreSQL ACID', 'Read list: Redis Hash', 'Read search: ElasticSearch', 'Read analytics: ClickHouse'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 10 — Progressão de domínio em CQRS
// ═══════════════════════════════════════════════════════════════════════════════

const CQRS_PROGRESSION: ProgressionLevel[] = [
  {
    id: 'iniciante',
    name: 'Iniciante',
    label: 'Iniciante',
    emoji: '🌱',
    concepts: [
      { name: 'CQS (Bertrand Meyer)', tip: 'Método ou muda estado OU retorna valor — nunca os dois' },
      { name: 'CRUD tradicional', tip: 'Controller → Service → Repository — baseline de comparação' },
      { name: 'O problema que CQRS resolve', tip: 'Read e write com requisitos muito diferentes' },
      { name: 'Eventual consistency', tip: 'Diferença entre read model e write DB pode ser de ms a s' },
    ],
  },
  {
    id: 'pleno',
    name: 'Pleno',
    label: 'Pleno',
    emoji: '⚙️',
    concepts: [
      { name: 'Command e Command Handler', tip: 'Command = intenção de mudança, Handler = executa, retorna void' },
      { name: 'Query e Query Handler', tip: 'Query = intenção de leitura, sem efeito colateral' },
      { name: 'Event Bus / Projectors', tip: 'Evento publicado → projetores atualizam read models' },
      { name: 'Read Model denormalizado', tip: 'Schema otimizado para a query específica, sem JOIN' },
      { name: 'Quando NÃO usar CQRS', tip: 'Apps simples, CRUD, escala moderada — over-engineering' },
    ],
  },
  {
    id: 'senior',
    name: 'Sênior',
    label: 'Sênior',
    emoji: '🚀',
    concepts: [
      { name: 'Domain Events e Aggregates', tip: 'Aggregate emite seus próprios eventos ao mudar estado' },
      { name: 'Reconstrução de Read Model', tip: 'Replay de todos os eventos via Kafka/EventStore' },
      { name: 'Idempotência nos projectors', tip: 'At-least-once delivery → projector deve ser idempotente' },
      { name: 'Múltiplos read models por evento', tip: 'OrderCreatedEvent → Redis + Elastic + ClickHouse' },
      { name: 'Eventual consistency UX', tip: 'Como lidar na UI: polling, WebSocket, optimistic update' },
    ],
  },
  {
    id: 'staff',
    name: 'Staff',
    label: 'Staff',
    emoji: '🏗️',
    concepts: [
      { name: 'Event Sourcing completo', tip: 'Event Store como fonte da verdade, snapshot pattern' },
      { name: 'Saga Pattern', tip: 'Transação distribuída via compensating events' },
      { name: 'Schema evolution de eventos', tip: 'Versionar eventos, upcasters, backward compatibility' },
      { name: 'CQRS + DDD tático', tip: 'Bounded contexts, aggregate design, context maps' },
      { name: 'Estratégia de migração', tip: 'Migrar CRUD para CQRS incrementalmente sem big bang' },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export default function CqrsVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'cqrs-flow',
      title: 'Fluxo CQRS Completo',
      subtitle: 'Command side → Event → Projector → Query side — a separação em ação',
      accent: C,
      component: (
        <SequenceDiagram
          actors={CQRS_ACTORS}
          messages={CQRS_MESSAGES}
          groups={CQRS_GROUPS}
          accentColor={C}
          bgColor={BG}
          title="CQRS — Command Side + Query Side"
          description="Clique em uma mensagem para ver detalhes"
        />
      ),
    },
    {
      id: 'event-sourcing',
      title: 'CQRS + Event Sourcing',
      subtitle: 'Event Store como fonte da verdade — state = replay(events)',
      accent: AMB,
      component: (
        <SequenceDiagram
          actors={ES_ACTORS}
          messages={ES_MESSAGES}
          groups={ES_GROUPS}
          accentColor={AMB}
          bgColor={BG}
          title="CQRS + Event Sourcing — Aggregate via Replay"
          description="Clique em uma mensagem para ver detalhes"
        />
      ),
    },
    {
      id: 'eventual-consistency',
      title: 'Eventual Consistency',
      subtitle: 'Do write ao read model — estados e transições da projeção assíncrona',
      accent: C,
      component: (
        <StateMachineExplorer
          states={EC_STATES}
          transitions={EC_TRANSITIONS}
          initialState="write"
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'projections',
      title: 'Projeções Múltiplas',
      subtitle: 'Um evento → 5 read models otimizados para 5 casos de uso diferentes',
      accent: PRP,
      component: <MultipleProjectionsVisual />,
    },
    {
      id: 'comparison',
      title: 'CQRS vs CRUD vs Event Sourcing',
      subtitle: 'Complexidade, escala e trade-offs — quando cada abordagem faz sentido',
      accent: C2,
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
      id: 'diff',
      title: 'CQRS vs Serviço Anêmico',
      subtitle: 'Diffs concretos: Command Handler, Aggregate com Events e Projector',
      accent: GRN,
      component: (
        <DiffViewer
          examples={CQRS_DIFFS}
          accentColor={GRN}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'antipatterns',
      title: 'Anti-patterns',
      subtitle: 'CQRS para CRUD, command com retorno, query com write, projeção síncrona',
      accent: RED,
      component: (
        <AntiPatternsGallery
          patterns={CQRS_ANTIPATTERNS}
          accentColor={RED}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'decision',
      title: 'Quando usar CQRS?',
      subtitle: 'Árvore de decisão interativa — do problema à solução certa',
      accent: C,
      component: (
        <DecisionTree
          root={CQRS_DT_ROOT}
          nodes={CQRS_DT_NODES}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'layers',
      title: 'Arquitetura em Camadas',
      subtitle: 'API → Bus → Handler → Domain → Projector → Storage — cada camada e sua responsabilidade',
      accent: C,
      component: (
        <LayerStack
          layers={CQRS_LAYERS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'progression',
      title: 'Jornada de Domínio',
      subtitle: 'Do iniciante ao staff — o que aprender em cada nível',
      accent: C,
      component: (
        <ProgressionMap
          levels={CQRS_PROGRESSION}
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
