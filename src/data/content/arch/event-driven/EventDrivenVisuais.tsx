'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { SequenceDiagram } from '@/components/visuals/SequenceDiagram'
import type { SeqActor, SeqMessage, SeqGroup } from '@/components/visuals/SequenceDiagram'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { ConceptCarousel } from '@/components/visuals/ConceptCarousel'
import type { Slide } from '@/components/visuals/ConceptCarousel'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'
import { StateMachineExplorer } from '@/components/visuals/StateMachineExplorer'
import type { SMState, SMTransition } from '@/components/visuals/StateMachineExplorer'

// ── Paleta Event-Driven ───────────────────────────────────────────────────────
const C      = '#8b5cf6'   // purple — async/events
const BG     = '#0f172a'
const CARD   = '#1e293b'
const GRN    = '#22c55e'
const RED    = '#ef4444'
const AMB    = '#f59e0b'
const SKY    = '#38bdf8'
const PNK    = '#f472b6'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Sequence: Outbox Pattern em ação
// ═══════════════════════════════════════════════════════════════════════════════

const OUTBOX_ACTORS: SeqActor[] = [
  { id: 'api', label: 'API Handler', color: SKY },
  { id: 'db', label: 'PostgreSQL', color: AMB },
  { id: 'relay', label: 'Outbox Relay', color: C },
  { id: 'kafka', label: 'Kafka', color: GRN },
  { id: 'consumer', label: 'Consumer', color: PNK },
]

const OUTBOX_MESSAGES: SeqMessage[] = [
  { from: 'api', to: 'db', label: 'BEGIN TRANSACTION', type: 'sync' },
  { from: 'api', to: 'db', label: 'INSERT INTO orders', type: 'sync' },
  { from: 'api', to: 'db', label: 'INSERT INTO outbox (event)', type: 'sync', note: 'mesma transação!' },
  { from: 'db', to: 'api', label: 'COMMIT (ambos atômicos)', type: 'return' },
  { from: 'relay', to: 'db', label: 'SELECT unpublished events', type: 'sync' },
  { from: 'db', to: 'relay', label: '[{ type: OrderPlaced, ... }]', type: 'return' },
  { from: 'relay', to: 'kafka', label: 'produce(OrderPlaced)', type: 'async', note: 'at-least-once' },
  { from: 'relay', to: 'db', label: 'UPDATE outbox SET published=true', type: 'sync' },
  { from: 'kafka', to: 'consumer', label: 'consume(OrderPlaced)', type: 'async' },
  { from: 'consumer', to: 'consumer', label: 'check idempotency(eventId)', note: 'processa só se não visto antes' },
]

const OUTBOX_GROUPS: SeqGroup[] = [
  { label: 'Transação atômica — tudo ou nada', kind: 'loop', fromMsg: 0, toMsg: 3, color: AMB },
  { label: 'Relay CDC / polling', kind: 'loop', fromMsg: 4, toMsg: 7, color: C },
  { label: 'Consumo com idempotência', kind: 'opt', fromMsg: 8, toMsg: 9, color: GRN },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Saga States: Choreography via eventos
// ═══════════════════════════════════════════════════════════════════════════════

const SAGA_STATES: SMState[] = [
  {
    id: 'pending',
    label: 'PENDING',
    description: 'Pedido recebido. OrderPlaced publicado no broker. Aguardando pagamento.',
    color: AMB,
    isInitial: true,
  },
  {
    id: 'paid',
    label: 'PAID',
    description: 'Pagamento aprovado. PaymentProcessed consumido. Aguardando reserva de estoque.',
    color: SKY,
  },
  {
    id: 'reserved',
    label: 'RESERVED',
    description: 'Estoque reservado. StockReserved consumido. Aguardando envio.',
    color: C,
  },
  {
    id: 'shipped',
    label: 'SHIPPED',
    description: 'Pedido enviado. OrderShipped publicado. Saga concluída com sucesso.',
    color: GRN,
    isFinal: true,
  },
  {
    id: 'cancelled',
    label: 'CANCELLED',
    description: 'Saga cancelada. Compensação executada (estorno de pagamento, liberação de estoque).',
    color: RED,
    isFinal: true,
  },
]

const SAGA_TRANSITIONS: SMTransition[] = [
  {
    from: 'pending',
    to: 'paid',
    event: 'PaymentProcessed',
    code: `// Payment Service reage a OrderPlaced
on("OrderPlaced", async (evt) => {
  await chargeCard(evt.customerId, evt.total)
  await publish("PaymentProcessed", { orderId: evt.orderId })
})`,
  },
  {
    from: 'paid',
    to: 'reserved',
    event: 'StockReserved',
    code: `// Inventory Service reage a PaymentProcessed
on("PaymentProcessed", async (evt) => {
  await reserveItems(evt.orderId)
  await publish("StockReserved", { orderId: evt.orderId })
})`,
  },
  {
    from: 'reserved',
    to: 'shipped',
    event: 'OrderShipped',
    code: `// Shipping Service reage a StockReserved
on("StockReserved", async (evt) => {
  await scheduleShipment(evt.orderId)
  await publish("OrderShipped", { orderId: evt.orderId })
})`,
  },
  {
    from: 'paid',
    to: 'cancelled',
    event: 'StockUnavailable',
    code: `// Compensação: estorna pagamento
on("StockUnavailable", async (evt) => {
  await refundPayment(evt.orderId)
  await publish("OrderCancelled", { reason: "stock" })
})`,
  },
  {
    from: 'pending',
    to: 'cancelled',
    event: 'PaymentFailed',
    code: `// Pagamento recusado — cancela direto
on("PaymentFailed", async (evt) => {
  await publish("OrderCancelled", { reason: "payment" })
})`,
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Comparison: Kafka vs SQS vs EventBridge vs RabbitMQ
// ═══════════════════════════════════════════════════════════════════════════════

const BROKER_OPTIONS: ComparisonOption[] = [
  { id: 'kafka', label: 'Kafka', sublabel: 'Event Streaming', color: '#f59e0b' },
  { id: 'sqs', label: 'SQS', sublabel: 'AWS Managed Queue', color: SKY },
  { id: 'eventbridge', label: 'EventBridge', sublabel: 'AWS Event Bus', color: '#22c55e' },
  { id: 'rabbit', label: 'RabbitMQ', sublabel: 'AMQP Broker', color: '#f472b6' },
]

const BROKER_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'throughput',
    label: 'Throughput',
    category: 'Performance',
    description: 'Volume de mensagens por segundo suportado',
    values: {
      kafka: { rating: 'excellent', note: 'Milhões/s com múltiplas partições' },
      sqs: { rating: 'good', note: '3.000/s Standard; 300/s FIFO por fila' },
      eventbridge: { rating: 'fair', note: '10.000/s por event bus' },
      rabbit: { rating: 'good', note: '50k-100k/s por nó' },
    },
  },
  {
    id: 'replay',
    label: 'Replay de eventos',
    category: 'EDA',
    description: 'Capacidade de reprocessar eventos históricos',
    values: {
      kafka: { rating: 'excellent', note: 'Replay desde qualquer offset por days/years' },
      sqs: { rating: 'poor', note: 'Sem replay nativo — mensagem deletada após consumo' },
      eventbridge: { rating: 'poor', note: 'Archive + Replay (24h-365d), limitado' },
      rabbit: { rating: 'poor', note: 'Sem replay — mensagem consumida é removida' },
    },
  },
  {
    id: 'ordering',
    label: 'Ordering',
    category: 'Garantias',
    description: 'Garantia de ordem de entrega das mensagens',
    values: {
      kafka: { rating: 'good', note: 'Garantido dentro de uma partição' },
      sqs: { rating: 'fair', note: 'Standard: sem ordering. FIFO: ordering garantida' },
      eventbridge: { rating: 'poor', note: 'Sem ordering garantida' },
      rabbit: { rating: 'good', note: 'Por fila (round-robin entre consumers)' },
    },
  },
  {
    id: 'ops',
    label: 'Facilidade operacional',
    category: 'Operação',
    description: 'Complexidade de configurar e manter em produção',
    values: {
      kafka: { rating: 'poor', note: 'Alto: cluster, ZK/KRaft, Schema Registry, monitoring' },
      sqs: { rating: 'excellent', note: 'Zero operação — totalmente gerenciado pela AWS' },
      eventbridge: { rating: 'excellent', note: 'Zero operação — totalmente gerenciado pela AWS' },
      rabbit: { rating: 'fair', note: 'Médio: cluster, HA config, monitoring' },
    },
  },
  {
    id: 'dlq',
    label: 'Dead Letter Queue',
    category: 'Garantias',
    description: 'Suporte nativo para DLQ e mensagens com falha',
    values: {
      kafka: { rating: 'fair', note: 'Custom (retry topic pattern) — não nativo' },
      sqs: { rating: 'excellent', note: 'DLQ nativo com maxReceiveCount configurável' },
      eventbridge: { rating: 'good', note: 'DLQ por rule, com archive integrado' },
      rabbit: { rating: 'excellent', note: 'Dead letter exchange (DLX) nativo' },
    },
  },
  {
    id: 'filtering',
    label: 'Roteamento / Filtros',
    category: 'EDA',
    description: 'Roteamento de mensagens por conteúdo ou atributos',
    values: {
      kafka: { rating: 'fair', note: 'Por tópico — consumer filtra no código' },
      sqs: { rating: 'fair', note: 'SNS filter policies para routing fan-out' },
      eventbridge: { rating: 'excellent', note: 'Filtros JSON ricos por conteúdo de evento' },
      rabbit: { rating: 'excellent', note: 'Topic exchange, fanout, headers exchange' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — ConceptCarousel: Garantias de entrega e idempotência
// ═══════════════════════════════════════════════════════════════════════════════

const DELIVERY_SLIDES: Slide[] = [
  {
    title: 'At-most-once — pode perder mensagens',
    paragraphs: [
      'A mensagem é entregue no máximo uma vez. Se o consumer falhar antes de processar, a mensagem é perdida sem retentativa. O broker não garante que você vai receber.',
      'Quando usar: métricas de telemetria, logs de diagnóstico onde perda é aceitável. Prioriza latência mínima sobre confiabilidade.',
      'Exemplo prático: UDP. Em sistemas de pagamento ou pedidos, NUNCA use at-most-once — perda de mensagem = perda de transação.',
    ],
    gradient: [RED, '#2d0000'],
    illustration: (
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#e2e8f0' }}>
        <div style={{ background: '#1e2233', borderRadius: 8, padding: 12 }}>
          <div style={{ color: RED, fontWeight: 700, marginBottom: 8 }}>At-most-once</div>
          <div style={{ color: '#94a3b8', marginBottom: 4 }}>Producer envia → Consumer falha</div>
          <div style={{ padding: '6px 8px', background: '#2d0000', borderRadius: 4, color: '#fca5a5', marginBottom: 4 }}>
            Mensagem PERDIDA — sem retry
          </div>
          <div style={{ color: '#64748b', fontSize: 9 }}>✓ Baixa latência — ✗ Sem garantia</div>
        </div>
      </div>
    ),
  },
  {
    title: 'At-least-once — pode duplicar mensagens',
    paragraphs: [
      'A mensagem é entregue pelo menos uma vez. Se o consumer falhar após processar mas antes de confirmar (ACK), o broker reenvia. O mesmo evento chega mais de uma vez.',
      'Padrão em Kafka (commit manual), SQS (visibility timeout + delete), RabbitMQ (manual ACK). O consumer DEVE ser idempotente para lidar com duplicatas.',
      'At-least-once é o modelo correto para a maioria dos sistemas distribuídos. Aceite a duplicata e projete idempotência — isso é mais confiável que tentar exactly-once.',
    ],
    gradient: [AMB, '#1a1500'],
    illustration: (
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#e2e8f0' }}>
        <div style={{ background: '#1e2233', borderRadius: 8, padding: 12 }}>
          <div style={{ color: AMB, fontWeight: 700, marginBottom: 8 }}>At-least-once</div>
          {[
            { msg: 'Entrega 1: processada ✓', color: GRN },
            { msg: 'Consumer falha antes do ACK', color: RED },
            { msg: 'Entrega 2 (reenvio) → idempotência ignora', color: AMB },
          ].map((r, i) => (
            <div key={i} style={{ padding: '4px 8px', marginBottom: 3, borderRadius: 3, background: '#0f1117', color: r.color, fontSize: 10 }}>
              {r.msg}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: 'Exactly-once — efeito via idempotência',
    paragraphs: [
      'Exactly-once end-to-end não existe sem 2PC, que é impraticável. O que existe é at-least-once + idempotência = efeito de exactly-once para o negócio.',
      'Kafka tem exactly-once dentro do cluster (enable.idempotence=true no producer + transações). Mas o consumer ainda precisa de idempotência lógica para efeitos externos (DB, API).',
      'Padrão de implementação: armazene o eventId antes de qualquer efeito colateral. Se já foi processado, retorne sem fazer nada. Unique constraint ou Redis com TTL.',
    ],
    gradient: [GRN, '#052e16'],
    illustration: (
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#e2e8f0' }}>
        <div style={{ background: '#1e2233', borderRadius: 8, padding: 12 }}>
          <div style={{ color: GRN, fontWeight: 700, marginBottom: 8 }}>Efeito Exactly-once</div>
          <div style={{ fontSize: 9, color: '#94a3b8', marginBottom: 6 }}>at-least-once + idempotência</div>
          <div style={{ padding: '4px 6px', background: '#052e16', borderRadius: 3, marginBottom: 4, color: GRN }}>
            if (seen(eventId)) return // ignora duplicata
          </div>
          <div style={{ padding: '4px 6px', background: '#1e2233', borderRadius: 3, color: '#e2e8f0', fontSize: 9 }}>
            processEvent() → markSeen(eventId)
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Dead Letter Queue — falhas isoladas',
    paragraphs: [
      'Mensagens que falham após N tentativas vão para a DLQ. Permite análise do problema sem bloquear o pipeline principal. Consumer continua processando outras mensagens.',
      'Sem DLQ: mensagem com bug trava o consumer para sempre (em FIFO/ordering) ou é descartada silenciosamente (sem retentativa). Você descobre o bug semanas depois.',
      'Operação: inspecionar DLQ, corrigir bug, re-enfileirar para reprocessamento. SEMPRE configure alarme quando DLQ cresce — é sintoma de bug ou breaking change de schema.',
    ],
    gradient: [PNK, '#2d0a2e'],
    illustration: (
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#e2e8f0' }}>
        <div style={{ background: '#1e2233', borderRadius: 8, padding: 12 }}>
          <div style={{ color: PNK, fontWeight: 700, marginBottom: 8 }}>Dead Letter Queue</div>
          {[
            { label: 'Tentativa 1', status: '❌ falha', color: RED },
            { label: 'Tentativa 2', status: '❌ falha', color: RED },
            { label: 'Tentativa 3', status: '❌ falha', color: RED },
            { label: '→ DLQ', status: '✓ isolada', color: PNK },
          ].map((r, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '1px solid #334155' }}>
              <span style={{ color: '#94a3b8' }}>{r.label}</span>
              <span style={{ color: r.color }}>{r.status}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — LayerStack: Tipos de Event-Driven (pub/sub → streaming → sourcing)
// ═══════════════════════════════════════════════════════════════════════════════

const EDA_LAYERS: Layer[] = [
  {
    id: 'pubsub',
    label: 'Pub/Sub Simples',
    sublabel: 'Notificação — producer publica, consumers reagem',
    color: SKY,
    description: 'O sabor mais simples. Producer publica evento e consumidores reagem de forma assíncrona. Sem replay, sem persistência longa. Ideal para notificações e desacoplamento básico.',
    examples: ['SNS + SQS fan-out', 'EventBridge rules', 'WebSockets broadcast', 'Email/push notifications'],
  },
  {
    id: 'streaming',
    label: 'Event Streaming',
    sublabel: 'Log persistente — replay, analytics, múltiplos consumer groups',
    color: C,
    description: 'O broker é um log imutável e persistente. Consumidores podem ler desde qualquer ponto (replay). Múltiplos consumer groups independentes. Habilita analytics, auditoria e CQRS.',
    examples: ['Kafka com retenção de 30 dias', 'Consumer group A: pagamentos', 'Consumer group B: analytics', 'Replay para debug de incidente'],
  },
  {
    id: 'sourcing',
    label: 'Event Sourcing',
    sublabel: 'Eventos como source of truth — estado calculado via replay',
    color: AMB,
    description: 'O banco de dados é o log de eventos. Estado atual é derivado replaying todos os eventos. Audit log perfeito, time travel, CQRS nativo. Custo: complexidade de schema evolution.',
    examples: ['Aggregate BankAccount', 'AccountOpened → MoneyDeposited → MoneyWithdrawn', 'Estado = replay de todos os eventos', 'Snapshot a cada 100 eventos'],
  },
  {
    id: 'cqrs',
    label: 'CQRS + Event Sourcing',
    sublabel: 'Write model separado do read model — projeções otimizadas',
    color: GRN,
    description: 'Command model (escreve eventos no store) separado do Query model (lê read models projetados). Projeções otimizadas por use case: Elasticsearch para busca, Redis para cache, tabela desnormalizada para relatório.',
    examples: ['Event store → Projector → Read model', 'Search: Elasticsearch projection', 'Dashboard: desnormalizado em Postgres', 'Eventual consistency entre store e read model'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — Anti-patterns de Event-Driven
// ═══════════════════════════════════════════════════════════════════════════════

const EDA_ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'Consumer não idempotente',
    wrong: [
      [{ text: '// ❌ Sem verificação de duplicata\n', color: RED }],
      [{ text: 'async function handleOrderPlaced(event) {\n' }],
      [{ text: '  // Se este evento chegar 2x:\n', color: RED }],
      [{ text: '  await chargeCard(event.customerId, event.total)\n', color: RED }],
      [{ text: '  // → cobrança dupla no cartão!\n', color: RED }],
      [{ text: '}\n' }],
    ],
    right: [
      [{ text: '// ✅ Idempotência com eventId\n', color: GRN }],
      [{ text: 'async function handleOrderPlaced(event) {\n' }],
      [{ text: '  const seen = await redis.get(`idem:${event.eventId}`)\n', color: GRN }],
      [{ text: '  if (seen) return // duplicata ignorada\n', color: GRN }],
      [{ text: '  await chargeCard(event.customerId, event.total)\n' }],
      [{ text: '  await redis.set(`idem:${event.eventId}`, 1, "EX", 86400)\n', color: GRN }],
      [{ text: '}\n' }],
    ],
    why: 'At-least-once delivery garante duplicatas. Sem idempotência: cobrança dupla, e-mail duplicado, saldo errado. Cheque eventId ANTES de qualquer efeito colateral.',
  },
  {
    title: 'Evento como comando disfarçado',
    wrong: [
      [{ text: '// ❌ Naming imperativo = comando disfarçado\n', color: RED }],
      [{ text: 'await publish("UserShouldReceiveEmail", {\n', color: RED }],
      [{ text: '  to: "user@email.com",\n', color: RED }],
      [{ text: '  template: "welcome",\n', color: RED }],
      [{ text: '  // Producer sabe o que consumer deve fazer\n', color: RED }],
      [{ text: '  // = acoplamento oculto\n', color: RED }],
      [{ text: '})\n' }],
    ],
    right: [
      [{ text: '// ✅ Evento descreve fato — consumer decide ação\n', color: GRN }],
      [{ text: 'await publish("UserRegistered", {\n', color: GRN }],
      [{ text: '  userId: "u-123",\n' }],
      [{ text: '  email: "user@email.com",\n' }],
      [{ text: '  registeredAt: new Date().toISOString()\n' }],
      [{ text: '  // Email Service decide enviar welcome\n', color: GRN }],
      [{ text: '})\n' }],
    ],
    why: 'Evento no imperativo cria acoplamento semântico. O producer está controlando o consumer — isso é um comando, não um evento. Naming no passado indica fato independente.',
  },
  {
    title: 'Schema breaking change sem coordenação',
    wrong: [
      [{ text: '// v1 — producer atual\n', color: '#94a3b8' }],
      [{ text: '{ orderId: "123", amount: 99.90 }\n\n' }],
      [{ text: '// ❌ v2 — renomeia campo sem avisar\n', color: RED }],
      [{ text: '{ orderId: "123", totalValue: 99.90 }\n', color: RED }],
      [{ text: '// Consumer v1 lê "amount" = undefined\n', color: RED }],
      [{ text: '// Falha silenciosa — dado incorreto\n', color: RED }],
    ],
    right: [
      [{ text: '// ✅ Backward-compatible: adiciona campo novo\n', color: GRN }],
      [{ text: '// v2 com ambos os campos (deprecation period)\n', color: GRN }],
      [{ text: '{ orderId: "123",\n' }],
      [{ text: '  amount: 99.90,       // mantém backward compat\n', color: GRN }],
      [{ text: '  totalValue: 99.90 }  // novo campo adicionado\n', color: GRN }],
      [{ text: '// Consumer v1 lê "amount" normalmente ✓\n', color: GRN }],
    ],
    why: 'Consumers em diferentes versões podem coexistir. Renomear campo quebra todos os consumers que dependem do nome antigo. Adicionar campo opcional é sempre backward-compatible.',
  },
  {
    title: 'Sem correlation ID — debug impossível',
    wrong: [
      [{ text: '// ❌ Evento sem identificação de contexto\n', color: RED }],
      [{ text: 'await publish("OrderPlaced", {\n' }],
      [{ text: '  orderId: "abc123",\n' }],
      [{ text: '  // sem traceId, sem correlationId\n', color: RED }],
      [{ text: '})\n\n' }],
      [{ text: '// 8 serviços processam o evento\n', color: RED }],
      [{ text: '// Erro no 6º — impossível rastrear\n', color: RED }],
    ],
    right: [
      [{ text: '// ✅ Correlation ID propagado em todo evento\n', color: GRN }],
      [{ text: 'await publish("OrderPlaced", {\n' }],
      [{ text: '  orderId: "abc123",\n' }],
      [{ text: '  correlationId: requestCtx.correlationId, // do request HTTP\n', color: GRN }],
      [{ text: '  traceparent: otelCtx.traceparent, // W3C TraceContext\n', color: GRN }],
      [{ text: '  eventId: crypto.randomUUID(),\n', color: GRN }],
      [{ text: '})\n' }],
    ],
    why: 'Sem correlation ID, rastrear um pedido através de 8 serviços é impossível. Um correlation ID por request de origem + W3C traceparent habilita tracing distribuído completo.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSIÇÃO DE VISUAIS
// ═══════════════════════════════════════════════════════════════════════════════

export default function EventDrivenVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'outbox',
      title: 'Outbox Pattern',
      subtitle: 'Garantia transacional de publicação — producer + relay + consumer',
      accent: AMB,
      component: (
        <SequenceDiagram
          actors={OUTBOX_ACTORS}
          messages={OUTBOX_MESSAGES}
          groups={OUTBOX_GROUPS}
          accentColor={C}
          bgColor={BG}
          title="Outbox Pattern — Garantia Transacional de Publicação"
          description="Problema: após COMMIT no banco, publicação no broker pode falhar — evento perdido. Solução: gravar evento na tabela outbox na mesma transação. Relay lê e publica com retry."
        />
      ),
    },
    {
      id: 'saga',
      title: 'Saga Choreography',
      subtitle: 'Estados da saga orientada a eventos — interaja com as transições',
      accent: C,
      component: (
        <StateMachineExplorer
          states={SAGA_STATES}
          transitions={SAGA_TRANSITIONS}
          initialState="pending"
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          title="Saga OrderFlow — Choreography via Eventos"
          description="Cada serviço reage ao evento publicado pelo anterior. Sem orquestrador central. Clique nas transições disponíveis para ver o código de cada reação."
        />
      ),
    },
    {
      id: 'brokers',
      title: 'Brokers',
      subtitle: 'Kafka vs SQS vs EventBridge vs RabbitMQ — critérios de decisão',
      accent: GRN,
      component: (
        <ComparisonTable
          options={BROKER_OPTIONS}
          criteria={BROKER_CRITERIA}
          accentColor={C}
          bgColor={BG}
          title="Brokers de Mensagem — Comparativo de Critérios"
          description="Escolha baseada em throughput, necessidade de replay e complexidade operacional. Kafka para event streaming sério; SQS para task queue simples."
          highlightBest
        />
      ),
    },
    {
      id: 'delivery',
      title: 'Garantias de Entrega',
      subtitle: 'At-most-once, at-least-once, exactly-once e DLQ — como cada garante funciona',
      accent: C,
      component: (
        <ConceptCarousel
          slides={DELIVERY_SLIDES}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          label="SEMÂNTICAS DE ENTREGA"
          heading="Garantias de Entrega em Event-Driven"
          description="Cada semântica tem um tradeoff diferente. At-least-once + idempotência é o padrão correto para a maioria dos sistemas."
        />
      ),
    },
    {
      id: 'types',
      title: 'Tipos de EDA',
      subtitle: 'Pub/Sub → Streaming → Event Sourcing → CQRS — do simples ao complexo',
      accent: AMB,
      component: (
        <LayerStack
          layers={EDA_LAYERS}
          accentColor={C}
          bgColor={BG}
          title="Espectro de Event-Driven — Do Pub/Sub ao CQRS"
          description="Quatro sabores de EDA com complexidade crescente. Escolha o mais simples que atende seu caso de uso — CQRS+Event Sourcing é overengineering para CRUD simples."
        />
      ),
    },
    {
      id: 'antipatterns',
      title: 'Anti-patterns',
      subtitle: 'Os 4 erros que causam bugs em produção em sistemas event-driven',
      accent: RED,
      component: (
        <AntiPatternsGallery
          patterns={EDA_ANTIPATTERNS}
          accentColor={C}
          bgColor={BG}
          label="ERROS CRÍTICOS"
          heading="Anti-patterns de Event-Driven Architecture"
          description="Os erros mais frequentes em sistemas EDA — e como evitá-los antes que causem incidentes."
          wrongLabel="Implementação incorreta"
          rightLabel="Implementação correta"
          whyLabel="Por que importa"
        />
      ),
    },
  ]

  return <VisuaisShell visuals={visuals} active={active} onChange={setActive} />
}
