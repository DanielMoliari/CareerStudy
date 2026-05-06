'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { StateMachineExplorer } from '@/components/visuals/StateMachineExplorer'
import type { SMState, SMTransition } from '@/components/visuals/StateMachineExplorer'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { DecisionTree } from '@/components/visuals/DecisionTree'
import type { DTNode } from '@/components/visuals/DecisionTree'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'
import { SequenceDiagram } from '@/components/visuals/SequenceDiagram'
import type { SeqActor, SeqMessage, SeqGroup } from '@/components/visuals/SequenceDiagram'
import { ProConMatrix } from '@/components/visuals/ProConMatrix'
import type { ProConOption } from '@/components/visuals/ProConMatrix'
import { ProgressionMap } from '@/components/visuals/ProgressionMap'
import type { ProgressionLevel } from '@/components/visuals/ProgressionMap'

// ── Paleta Microservices ──────────────────────────────────────────────────────
const C      = '#7E57C2'   // roxo — microservices
const C2     = '#5e3da0'   // roxo escuro
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#4ade80'
const RED    = '#ef4444'
const AMB    = '#f59e0b'
const SKY    = '#38bdf8'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Monolito vs Microservices vs Modulith: comparação multidimensional
// ═══════════════════════════════════════════════════════════════════════════════

const ARCH_OPTIONS: ComparisonOption[] = [
  { id: 'mono',    label: 'Monolito',   sublabel: 'uma aplicação, um banco',    color: FGMUTE },
  { id: 'modulith',label: 'Modulith',   sublabel: 'monolito bem modularizado',  color: AMB },
  { id: 'micro',   label: 'Microservices', sublabel: 'serviços independentes', color: C },
]

const ARCH_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'simplicity', label: 'Simplicidade operacional', category: 'Operação',
    description: 'Facilidade de operar, monitorar e fazer deploy.',
    values: {
      mono:     { rating: 'excellent', note: 'Um processo, um deploy, um log — simples' },
      modulith: { rating: 'good',      note: 'Ainda um deploy mas com fronteiras de módulo claras' },
      micro:    { rating: 'poor',      note: 'N serviços, N deployments, N logs — complexidade brutal' },
    },
  },
  {
    id: 'scale', label: 'Escala independente', category: 'Capacidade',
    description: 'Capacidade de escalar partes específicas do sistema.',
    values: {
      mono:     { rating: 'fair',      note: 'Escala vertical ou horizontal da app inteira' },
      modulith: { rating: 'fair',      note: 'Ainda escala o todo, mas módulos isolam ponto de pressão' },
      micro:    { rating: 'excellent', note: 'Escala apenas o serviço com gargalo — eficiente' },
    },
  },
  {
    id: 'autonomy', label: 'Autonomia de times', category: 'Organização',
    description: 'Capacidade de times trabalharem de forma independente.',
    values: {
      mono:     { rating: 'poor',      note: 'Merge conflicts, coordenação de deploy, acoplamento' },
      modulith: { rating: 'good',      note: 'Módulos separados reduzem conflito; deploy ainda compartilhado' },
      micro:    { rating: 'excellent', note: 'Time é dono do serviço — deploy, banco, stack independentes' },
    },
  },
  {
    id: 'transaction', label: 'Transações de dados', category: 'Capacidade',
    description: 'Facilidade de manter consistência transacional entre dados.',
    values: {
      mono:     { rating: 'excellent', note: 'ACID local com uma única conexão de banco' },
      modulith: { rating: 'excellent', note: 'ACID local — banco compartilhado com schemas separados' },
      micro:    { rating: 'poor',      note: 'Sem 2PC — precisa de Saga com compensating transactions' },
    },
  },
  {
    id: 'debugging', label: 'Depuração', category: 'Desenvolvimento',
    description: 'Facilidade de rastrear bugs e debugar em desenvolvimento.',
    values: {
      mono:     { rating: 'excellent', note: 'Stack trace completo, um processo, um log' },
      modulith: { rating: 'good',      note: 'Stack trace completo com módulos bem nomeados' },
      micro:    { rating: 'poor',      note: 'Trace distribuído obrigatório — correlation-id por serviço' },
    },
  },
  {
    id: 'team', label: 'Tamanho de time ideal', category: 'Organização',
    description: 'Para qual tamanho de time a arquitetura é mais adequada.',
    values: {
      mono:     { rating: 'excellent', note: '1-15 pessoas — overhead zero' },
      modulith: { rating: 'good',      note: '10-50 pessoas — fronteiras ajudam sem overhead de infra' },
      micro:    { rating: 'fair',      note: '50+ pessoas — overhead de operar N serviços é real' },
    },
  },
  {
    id: 'devspeed', label: 'Velocidade inicial', category: 'Desenvolvimento',
    description: 'Tempo para entregar a primeira versão funcional do produto.',
    values: {
      mono:     { rating: 'excellent', note: 'Start rápido — sem infra, sem network, sem discovery' },
      modulith: { rating: 'excellent', note: 'Igualmente rápido no início com módulos bem definidos' },
      micro:    { rating: 'poor',      note: 'Lento — infra, service discovery, observability tudo antes' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Saga Pattern: máquina de estados
// ═══════════════════════════════════════════════════════════════════════════════

const SAGA_STATES: SMState[] = [
  { id: 'start',     label: 'Pedido Criado',      description: 'Order Service cria pedido com status "pending". Outbox Pattern: evento order.created inserido na mesma transação.', color: AMB, isInitial: true },
  { id: 'payment',   label: 'Processando Pagamento', description: 'Payment Service consome order.created. Tenta cobrar o cliente. Resultado publica payment.processed ou payment.failed.', color: C },
  { id: 'stock',     label: 'Reservando Estoque', description: 'Inventory Service consome payment.processed. Reserva itens do estoque. Publica stock.reserved ou stock.failed.', color: SKY },
  { id: 'shipping',  label: 'Despachando',        description: 'Shipping Service consome stock.reserved. Cria etiqueta e agenda coleta. Publica shipping.dispatched.', color: GRN },
  { id: 'done',      label: 'Concluído',           description: 'Saga completa. Pedido status "confirmed". Notificação enviada ao cliente.', color: GRN, isFinal: true },
  { id: 'pay-fail',  label: 'Pagamento Falhou',   description: 'Payment.failed recebido. Compensação: Order Service atualiza status para "cancelled". Notifica cliente.', color: RED, isFinal: true },
  { id: 'stock-fail',label: 'Estoque Falhou',      description: 'Stock.failed recebido. Compensação: Payment.refund emitido. Order Service atualiza para "cancelled".', color: RED, isFinal: true },
]

const SAGA_TRANSITIONS: SMTransition[] = [
  { from: 'start',     to: 'payment',   event: 'order.created publicado',     code: 'outbox.insert({ eventType: "order.created", payload })' },
  { from: 'payment',   to: 'stock',     event: 'payment.processed',           code: 'kafka.publish("payment.processed", { orderId, paymentId })' },
  { from: 'payment',   to: 'pay-fail',  event: 'payment.failed',              guard: 'charge() lança erro ou recusa', code: 'kafka.publish("payment.failed", { orderId, reason })' },
  { from: 'stock',     to: 'shipping',  event: 'stock.reserved',              code: 'inventory.reserve(items) → kafka.publish("stock.reserved")' },
  { from: 'stock',     to: 'stock-fail',event: 'stock.failed',                guard: 'itens insuficientes', code: 'kafka.publish("stock.failed") → compensação: payment.refund' },
  { from: 'shipping',  to: 'done',      event: 'shipping.dispatched',         code: 'carrier.schedule() → kafka.publish("shipping.dispatched")' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Circuit Breaker: máquina de estados
// ═══════════════════════════════════════════════════════════════════════════════

const CB_STATES: SMState[] = [
  { id: 'closed',    label: 'CLOSED',     description: 'Estado normal. Chamadas passam livremente. Breaker monitora taxa de falha em janela deslizante (ex: 20 calls, 60s). Se taxa de erro > threshold, abre.', color: GRN, isInitial: true },
  { id: 'open',      label: 'OPEN',       description: 'Breaker aberto. Rejeita chamadas imediatamente (fail-fast) sem tentar chegar ao serviço. Retorna fallback (cache, erro amigável). Aguarda waitDuration antes de tentar HALF_OPEN.', color: RED },
  { id: 'half_open', label: 'HALF_OPEN',  description: 'Período de teste. Deixa passar permittedNumberOfCalls chamadas de prova. Se passarem: fecha. Se falharem: abre novamente com backoff maior.', color: AMB },
]

const CB_TRANSITIONS: SMTransition[] = [
  { from: 'closed',    to: 'open',      event: 'taxa de erro > threshold',    guard: 'failureRate > 50% em 20+ calls', code: 'breaker.open() → rejeitar chamadas' },
  { from: 'open',      to: 'half_open', event: 'waitDuration expirou',        guard: 'após 30s em OPEN', code: 'breaker.halfOpen() → permitir N calls de teste' },
  { from: 'half_open', to: 'closed',    event: 'calls de teste passaram',     guard: 'N calls de teste com sucesso', code: 'breaker.close() → retomar operação normal' },
  { from: 'half_open', to: 'open',      event: 'calls de teste falharam',     guard: 'falha nas calls de prova', code: 'breaker.open(backoff) → aguardar mais tempo' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — API Gateway + Serviços: Sequence Diagram de um request
// ═══════════════════════════════════════════════════════════════════════════════

const GW_ACTORS: SeqActor[] = [
  { id: 'client',   label: 'Cliente (app)',     color: FGMUTE },
  { id: 'gateway',  label: 'API Gateway',       color: C },
  { id: 'auth',     label: 'Auth Service',      color: AMB },
  { id: 'orders',   label: 'Orders Service',    color: SKY },
  { id: 'inventory',label: 'Inventory Service', color: GRN },
]

const GW_MESSAGES: SeqMessage[] = [
  { from: 'client',    to: 'gateway',   label: 'GET /orders/123',                     type: 'sync',   note: 'Authorization: Bearer <jwt>' },
  { from: 'gateway',   to: 'auth',      label: 'validateToken(jwt)',                   type: 'sync',   note: 'Rate limit verificado antes desta chamada' },
  { from: 'auth',      to: 'gateway',   label: '{ userId, roles }',                   type: 'return', note: 'Token válido — 401 se inválido' },
  { from: 'gateway',   to: 'orders',    label: 'GET /orders/123 + X-User-Id: userId', type: 'sync',   note: 'Gateway injeta userId no header — serviço não valida JWT' },
  { from: 'orders',    to: 'inventory', label: 'GET /inventory/items?ids=A,B',        type: 'sync',   note: 'Chamada síncrona interna — service discovery via DNS K8s' },
  { from: 'inventory', to: 'orders',    label: '{ items: [{id: A, stock: 5}, ...] }', type: 'return' },
  { from: 'orders',    to: 'gateway',   label: '{ orderId, status, items }',           type: 'return' },
  { from: 'gateway',   to: 'client',    label: '200 OK + response body',              type: 'return', note: 'Gateway pode transformar/agregar antes de retornar' },
]

const GW_GROUPS: SeqGroup[] = [
  { label: 'Autenticação centralizada no Gateway', kind: 'opt', fromMsg: 1, toMsg: 2, color: `${AMB}22` },
  { label: 'Chamada interna entre serviços — sem JWT', kind: 'ref', fromMsg: 4, toMsg: 5, color: `${C}22` },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — Camadas de resiliência: Bulkhead, Retry, CB, Timeout
// ═══════════════════════════════════════════════════════════════════════════════

const RESILIENCE_LAYERS: Layer[] = [
  {
    id: 'timeout',
    label: 'Timeout',
    sublabel: 'camada mais externa',
    description: 'Todo request a serviço remoto DEVE ter timeout configurado. Sem timeout, uma chamada lenta pode bloquear threads indefinidamente. Configure em milissegundos — não minutos. Default do HTTP client geralmente é alto demais (30s+). Use 1-3s para APIs sincronas.',
    code: 'axios.get(url, { timeout: 2000 }) // 2s — não o default',
    color: AMB,
    examples: ['axios timeout', 'fetch AbortController', 'gRPC deadline', 'Resilience4j TimeLimiter'],
  },
  {
    id: 'retry',
    label: 'Retry com Backoff + Jitter',
    sublabel: 'para falhas transitórias',
    description: 'Retry em falhas transitórias (timeout, 503) com backoff exponencial + jitter. Backoff evita thundering herd; jitter randomiza para espalhar os retries. Não faça retry em falhas permanentes (400, 404, 401).',
    code: 'wait = min(2^attempt * 1000, MAX_WAIT) + random(0, 300) // ms',
    color: SKY,
    examples: ['Retry em timeout de rede', 'Retry em 503 Service Unavailable', 'NÃO retry em 400 Bad Request', 'NÃO retry em 401 Unauthorized'],
  },
  {
    id: 'circuitbreaker',
    label: 'Circuit Breaker',
    sublabel: 'para falhas persistentes',
    description: 'Quando um serviço tem falha persistente (não transitória), o Circuit Breaker abre e rejeita chamadas imediatamente (fail-fast) sem esperar timeout. Protege o sistema de cascata de falhas e dá ao serviço destino tempo para se recuperar.',
    code: 'CLOSED → (taxa erro > 50%) → OPEN → (30s) → HALF_OPEN → CLOSED',
    color: C,
    examples: ['Resilience4j (Java/Spring)', 'opossum (Node.js)', 'Polly (.NET)', 'Istio (service mesh)'],
  },
  {
    id: 'bulkhead',
    label: 'Bulkhead',
    sublabel: 'isolamento de pool de recursos',
    description: 'Bulkhead isola threads/conexões por serviço downstream. Sem bulkhead, um serviço lento consome todas as threads disponíveis e derrruba o serviço inteiro. Com bulkhead, máximo N threads vão para o serviço A — o resto do sistema continua operando.',
    code: 'maxConcurrentCalls: 20, maxWaitDuration: 500ms // por serviço',
    color: RED,
    examples: ['Thread pool isolation (Hystrix)', 'Semáforo com maxConcurrentCalls', 'Connection pool por upstream', 'Resilience4j Bulkhead'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — Anti-patterns: erros clássicos em microservices
// ═══════════════════════════════════════════════════════════════════════════════

const MS_ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'Banco de dados compartilhado entre serviços',
    wrong: [
      [{ text: '-- Orders Service e Inventory compartilham banco', color: RED }],
      [{ text: 'SELECT o.*, i.stock FROM orders o' }],
      [{ text: '  JOIN inventory i ON o.product_id = i.id', color: RED }],
      [{ text: '-- Migration de inventory afeta orders direto', color: RED }],
      [{ text: '-- Deploy coordenado obrigatório — não é microservice', color: RED }],
    ],
    right: [
      [{ text: '// Cada serviço tem banco próprio — integra via API', color: GRN }],
      [{ text: '// Orders Service:' }],
      [{ text: 'const order = await ordersDB.findOrder(orderId)' }],
      [{ text: 'const stock = await inventoryClient.getStock(order.productId)', color: C }],
      [{ text: '// Inventory Service (banco próprio):' }],
      [{ text: 'router.get("/stock/:productId", (req, res) => {' }],
      [{ text: '  res.json(await inventoryDB.getStock(req.params.productId))', color: C }],
      [{ text: '})' }],
    ],
    why: 'Banco compartilhado quebra a autonomia fundamental de microservices. Qualquer migration afeta todos os serviços, deploy precisa ser coordenado e a fronteira de domínio desaparece — você tem um distributed monolith.',
  },
  {
    title: 'Cadeia de chamadas síncronas (chatty services)',
    wrong: [
      [{ text: '// Request para /checkout chama 5 serviços em cadeia', color: RED }],
      [{ text: 'const user = await userSvc.get(userId)        // +20ms', color: RED }],
      [{ text: 'const cart = await cartSvc.get(userId)        // +20ms', color: RED }],
      [{ text: 'const stock = await inventorySvc.check(cart)  // +20ms', color: RED }],
      [{ text: 'const tax = await taxSvc.calculate(cart)      // +20ms', color: RED }],
      [{ text: '// Total: 80ms+ de latência de rede só para montar a página', color: RED }],
    ],
    right: [
      [{ text: '// Paralelizar chamadas independentes', color: GRN }],
      [{ text: 'const [user, cart] = await Promise.all([', color: GRN }],
      [{ text: '  userSvc.get(userId),' }],
      [{ text: '  cartSvc.get(userId),' }],
      [{ text: '])' }],
      [{ text: '// Chamadas dependentes em seguida', color: GRN }],
      [{ text: 'const [stock, tax] = await Promise.all([' }],
      [{ text: '  inventorySvc.check(cart), taxSvc.calculate(cart)' }],
      [{ text: '])' }],
      [{ text: '// Total: 40ms em vez de 80ms', color: GRN }],
    ],
    why: 'Chamadas síncronas em série multiplicam latência — N serviços × latência média = UX horrível. Paralelize chamadas independentes e use async (eventos) para fluxos não-interativos.',
  },
  {
    title: 'Saga sem idempotência no handler',
    wrong: [
      [{ text: '// Handler de evento sem verificação de duplicata', color: RED }],
      [{ text: '@KafkaConsumer("payment.processed")', color: RED }],
      [{ text: 'async handlePayment(event) {', color: '#e2e8f0' }],
      [{ text: '  await inventory.reserve(event.items) // pode rodar 2×!', color: RED }],
      [{ text: '  // Kafka at-least-once → evento pode chegar 2×', color: RED }],
      [{ text: '}', color: '#e2e8f0' }],
    ],
    right: [
      [{ text: '// Sempre verificar eventId antes de processar', color: GRN }],
      [{ text: 'async handlePayment(event) {', color: '#e2e8f0' }],
      [{ text: '  const processed = await idempotency.exists(event.id)', color: GRN }],
      [{ text: '  if (processed) return // ack sem reprocessar' }],
      [{ text: '  await db.transaction(async tx => {', color: '#e2e8f0' }],
      [{ text: '    await inventory.reserve(event.items, tx)', color: C }],
      [{ text: '    await idempotency.insert(event.id, tx) // mesma tx!', color: GRN }],
      [{ text: '  })', color: '#e2e8f0' }],
      [{ text: '}', color: '#e2e8f0' }],
    ],
    why: 'Kafka e outros brokers garantem at-least-once delivery — o mesmo evento pode chegar mais de uma vez. Sem idempotência, você processa a mesma operação duas vezes e corrompe dados.',
  },
  {
    title: 'Deploy coordenado — o sinal do distributed monolith',
    wrong: [
      [{ text: '// Para fazer deploy de Orders, precisa coordenar:', color: RED }],
      [{ text: '// 1. Avisar time de Inventory (compartilham DB)', color: RED }],
      [{ text: '// 2. Avisar time de Payment (API mudou sem versionar)', color: RED }],
      [{ text: '// 3. Janela de manutenção de 2h às 2am', color: RED }],
      [{ text: '// Você tem microservices no nome apenas', color: RED }],
    ],
    right: [
      [{ text: '// Critério de independência: Orders deploya sozinho?', color: GRN }],
      [{ text: '// ✓ Banco próprio (sem migration coordenada)', color: GRN }],
      [{ text: '// ✓ API versionada (/v1/orders vs /v2/orders)', color: GRN }],
      [{ text: '// ✓ Backward compatible (adiciona campos, não remove)', color: GRN }],
      [{ text: '// ✓ Contract tests (Pact) garantem que consumers OK', color: GRN }],
      [{ text: '// Se não conseguir isso, o problema está na fronteira', color: C }],
    ],
    why: 'Se dois serviços precisam ser deployados juntos para qualquer feature, a fronteira entre eles está errada. Junte em um serviço ou redesenhe a integração. Deploy independente é o critério definitivo de microservices.',
  },
  {
    title: 'Serviço por entidade (anemic microservices)',
    wrong: [
      [{ text: '// Serviços criados por tabela, não por domínio', color: RED }],
      [{ text: 'GET /user-service/users/123', color: RED }],
      [{ text: 'GET /product-service/products/456', color: RED }],
      [{ text: 'GET /order-service/orders/789', color: RED }],
      [{ text: '// Cada feature precisa chamar 5 "serviços"', color: RED }],
      [{ text: '// É um monolito distribuído — pior dos dois mundos', color: RED }],
    ],
    right: [
      [{ text: '// Serviço por Bounded Context — regra de negócio coesa', color: GRN }],
      [{ text: '// Order Context: Orders + Cart + Pricing + Promotions', color: GRN }],
      [{ text: 'POST /order-service/orders                 // cria pedido' }],
      [{ text: 'GET  /order-service/orders/:id/summary     // detalhes' }],
      [{ text: '// Inventory Context: Warehouse + Stock + Reservations', color: GRN }],
      [{ text: 'POST /inventory-service/reservations       // reserva' }],
      [{ text: '// Uma feature → um serviço → um deploy', color: GRN }],
    ],
    why: 'Serviço por entidade (UserService, ProductService) faz cada feature cruzar N serviços com N chamadas de rede. Bounded Context coloca junto o que muda junto — coesão de domínio determina a fronteira certa.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 7 — Decisão: "Quando usar microservices?"
// ═══════════════════════════════════════════════════════════════════════════════

const MS_DECISION_ROOT: DTNode = {
  id: 'root',
  question: 'O sistema tem times grandes (10+ devs) pisando no pé um do outro?',
  children: [
    { label: 'Sim — conflitos frequentes', nodeId: 'large-team', color: C },
    { label: 'Não — time pequeno', nodeId: 'small-team', color: FGMUTE },
  ],
}

const MS_DECISION_NODES: Record<string, DTNode> = {
  'large-team': {
    id: 'large-team',
    question: 'Os domínios têm fronteiras claras (Bounded Contexts definidos)?',
    children: [
      { label: 'Sim — fronteiras claras', nodeId: 'clear-boundary', color: GRN },
      { label: 'Não — domínio ainda evoluindo', nodeId: 'modulith', color: AMB },
    ],
  },
  'small-team': {
    id: 'small-team',
    question: 'O monolito já tem gargalo real (escala, deploy, performance)?',
    children: [
      { label: 'Sim — gargalo comprovado', nodeId: 'real-pain', color: C },
      { label: 'Não — funciona bem', nodeId: 'monolith', color: FGMUTE },
    ],
  },
  'clear-boundary': {
    id: 'clear-boundary',
    question: 'O time tem maturidade de DevOps (K8s, CI/CD, observability)?',
    children: [
      { label: 'Sim — infra madura', nodeId: 'use-micro', color: GRN },
      { label: 'Não — infra básica', nodeId: 'modulith', color: AMB },
    ],
  },
  'real-pain': {
    id: 'real-pain',
    recommendation: 'Modulith → Strangler Fig',
    detail: 'Modularize o monolito primeiro. Extraia o Bounded Context com mais dor (escala, acoplamento) usando Strangler Fig — um serviço por vez, nunca big bang. Prove que a fronteira está certa antes de extrair o próximo.',
    color: AMB,
    icon: '🔀',
  },
  monolith: {
    id: 'monolith',
    recommendation: 'Monolito (mantenha e modularize)',
    detail: 'Monolito modular com boas fronteiras de módulo (DDD, hexagonal) entrega 90% dos benefícios de microservices sem o custo operacional. Não mude por antecipação — espere a dor aparecer. Sam Newman: "don\'t do microservices" é o conselho padrão.',
    color: FGMUTE,
    icon: '🏗️',
  },
  modulith: {
    id: 'modulith',
    recommendation: 'Modulith (melhor dos dois mundos)',
    detail: 'Monolito bem modularizado com APIs internas entre módulos. Deploy único, banco único (schemas separados), mas fronteiras claras que facilitam extração futura. Ideal quando o domínio ainda está sendo descoberto ou o time não tem DevOps maduro.',
    color: AMB,
    icon: '📦',
  },
  'use-micro': {
    id: 'use-micro',
    recommendation: 'Microservices (justified)',
    detail: 'Você tem os pré-requisitos: time grande, fronteiras claras, infra madura. Comece com Strangler Fig — extraia 1 Bounded Context de cada vez, mais desacoplado primeiro. Database per service é não negociável. Observability (logs, metrics, traces) antes de qualquer coisa.',
    color: C,
    icon: '⚡',
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 8 — CQRS + Event Sourcing em microservices: camadas
// ═══════════════════════════════════════════════════════════════════════════════

const CQRS_LAYERS: Layer[] = [
  {
    id: 'commands',
    label: 'Command Side (Write)',
    sublabel: 'mutações de estado',
    description: 'Commands representam intenção de mudança: CreateOrder, CancelPayment. São processados por Command Handlers que validam regras de negócio e persistem no estado. Em Event Sourcing, cada comando gera um evento de domínio — não um UPDATE, mas um "o que aconteceu".',
    code: 'CreateOrderCommand → OrderCreatedEvent → eventStore.append(event)',
    color: C,
    examples: ['CreateOrderCommand', 'ProcessPaymentCommand', 'CancelOrderCommand', 'ReserveStockCommand'],
  },
  {
    id: 'events',
    label: 'Event Store',
    sublabel: 'log imutável de eventos',
    description: 'Em Event Sourcing, o estado não é armazenado direto — o event store é o source of truth. O estado atual é reconstituído replaying todos os eventos de um aggregate. Benefício: auditoria total, time-travel, reconstrução de qualquer estado passado.',
    code: 'events = store.getEvents(orderId)\norder = Order.replay(events) // reconstitui estado atual',
    color: AMB,
    examples: ['OrderCreated', 'PaymentProcessed', 'StockReserved', 'OrderCancelled'],
  },
  {
    id: 'projections',
    label: 'Projections / Read Models',
    sublabel: 'visões otimizadas para leitura',
    description: 'Event handlers constroem Read Models (projeções) otimizados para queries específicas. Um evento pode alimentar múltiplas projeções: OrderListView, OrderDetailsView, OrderAnalyticsView. Cada projeção é desnormalizada para a query específica — sem JOINs.',
    code: 'on(OrderCreated, updateOrderListView)\non(OrderCreated, updateOrderAnalytics)',
    color: SKY,
    examples: ['OrderListView (para dashboard)', 'OrderDetailsView (para detalhes)', 'RevenueByDayView (para analytics)', 'CustomerOrdersView (para perfil)'],
  },
  {
    id: 'queries',
    label: 'Query Side (Read)',
    sublabel: 'leitura de read models',
    description: 'Queries leem diretamente das projeções — banco separado, schema otimizado para a query. Sem regra de negócio, sem validação. Pode usar banco diferente: PostgreSQL para escrita, Elasticsearch para busca, Redis para cache de listagem.',
    code: 'GET /orders?status=pending → orderListView.findByStatus("pending")',
    color: GRN,
    examples: ['getOrderById → OrderDetailsView', 'searchOrders → Elasticsearch', 'listCustomerOrders → Redis cache', 'revenueReport → OLAP projeção'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 9 — Comunicação: sync vs async — ProConMatrix
// ═══════════════════════════════════════════════════════════════════════════════

const COMM_OPTIONS: ProConOption[] = [
  {
    id: 'sync',
    label: 'Síncrono (REST/gRPC)',
    sublabel: 'response imediato',
    color: SKY,
    pros: [
      { text: 'Simples — request/response intuitivo', weight: 'high' },
      { text: 'Debugging linear — stack trace completo', weight: 'high' },
      { text: 'Response imediato — ideal para UI interativa', weight: 'medium' },
      { text: 'Contrato forte (Protobuf/OpenAPI)', weight: 'medium' },
    ],
    cons: [
      { text: 'Acopla disponibilidade — se B caiu, A cai', weight: 'high', context: ['Cascata de falhas em cadeia', 'Circuit Breaker obrigatório'] },
      { text: 'Latência se multiplica em cadeia de serviços', weight: 'high' },
      { text: 'Fanout difícil de escalar (1 request → N chamadas)', weight: 'medium' },
    ],
    bestFor: ['Leitura interativa com resposta imediata', 'Chamadas com retry rápido', 'APIs públicas (REST)', 'Comunicação interna de alta performance (gRPC)'],
    avoidWhen: ['Fluxos longos com múltiplos steps', 'Integrações com sistemas legados lentos', 'Operações que podem demorar > 5s'],
  },
  {
    id: 'async',
    label: 'Assíncrono (Kafka/RabbitMQ)',
    sublabel: 'eventos de domínio',
    color: AMB,
    pros: [
      { text: 'Desacopla disponibilidade — producer não depende de consumer', weight: 'high' },
      { text: 'Absorve picos — broker faz buffering', weight: 'high' },
      { text: 'Escala naturalmente — adiciona consumers', weight: 'medium' },
      { text: 'Auditoria natural — eventos são log imutável', weight: 'medium' },
    ],
    cons: [
      { text: 'Eventual consistency — dados não imediatamente consistentes', weight: 'high', context: ['Usuário pode ver estado desatualizado', 'Precisa de UX para status pendente'] },
      { text: 'Idempotência obrigatória — at-least-once delivery', weight: 'high' },
      { text: 'Debugging mais difícil — fluxo não-linear', weight: 'medium' },
      { text: 'Ordenação de eventos é complexa', weight: 'medium' },
    ],
    bestFor: ['Reação a evento de negócio (pagamento → notificação)', 'Integração entre times e domínios', 'Saga e transações distribuídas', 'Ingestão de dados e analytics'],
    avoidWhen: ['Response imediato obrigatório para o usuário', 'Fluxos simples com 1 produtor e 1 consumer'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 10 — Progressão: do iniciante ao especialista em microservices
// ═══════════════════════════════════════════════════════════════════════════════

const MS_LEVELS: ProgressionLevel[] = [
  {
    id: 'junior',
    name: 'Iniciante',
    label: 'Iniciante',
    emoji: '🌱',
    concepts: [
      { name: 'O que é microservice', tip: 'Serviço independente com banco próprio e deploy próprio — não é só serviço pequeno em LOC' },
      { name: 'Quando NÃO usar', tip: 'Time pequeno (<10), pré-PMF, sem DevOps maduro — monolito ganha na maioria dos casos' },
      { name: 'Database per service', tip: 'Cada serviço tem seu banco — compartilhar banco mata a autonomia' },
      { name: 'REST vs gRPC', tip: 'REST para APIs externas/públicas; gRPC para comunicação interna de alta performance' },
    ],
  },
  {
    id: 'pleno',
    name: 'Pleno',
    label: 'Pleno',
    emoji: '⚙️',
    concepts: [
      { name: 'Bounded Context (DDD)', tip: 'Fronteira onde o modelo e a linguagem de negócio são consistentes — base do particionamento correto' },
      { name: 'API Gateway + BFF', tip: 'Ponto de entrada único: auth, rate limit, routing. BFF = gateway especializado por tipo de cliente' },
      { name: 'Service Discovery em K8s', tip: 'DNS nativo via Service + kube-dns. readinessProbe garante que pod só entra no pool quando pronto' },
      { name: 'Saga Pattern básico', tip: 'Sequência de transações locais com compensating transactions — não 2PC' },
      { name: 'Observabilidade LMT', tip: 'Logs (JSON + correlation-id), Metrics (Prometheus + Grafana), Traces (OpenTelemetry + Jaeger)' },
    ],
  },
  {
    id: 'senior',
    name: 'Sênior',
    label: 'Sênior',
    emoji: '🚀',
    concepts: [
      { name: 'Saga: coreografia vs orquestração', tip: 'Choreo: desacoplado, difícil de visualizar. Orch: explícito, rastreável, coordenador é ponto central' },
      { name: 'Outbox Pattern', tip: 'Insere evento na mesma transação do banco — garante que evento nunca se perde mesmo com crash' },
      { name: 'Circuit Breaker (CLOSED/OPEN/HALF_OPEN)', tip: 'Falha rápida quando serviço downstream está com problema — evita cascata e dá tempo para recuperar' },
      { name: 'Idempotência em handlers', tip: 'at-least-once delivery: tabela de idempotência + mesma transação do efeito colateral' },
      { name: 'Contract Testing (Pact)', tip: 'Consumer-driven contracts garantem que mudança em A não quebra B em CI antes de produção' },
    ],
  },
  {
    id: 'especialista',
    name: 'Especialista',
    label: 'Especialista',
    emoji: '🎯',
    concepts: [
      { name: 'Strangler Fig Pattern', tip: 'Extração incremental do monolito: 1 BC por vez, Proxy Layer, Feature Flags, schema → DB separation' },
      { name: 'CQRS + Event Sourcing', tip: 'Command side usa event store; query side usa projeções otimizadas — separação total de leitura/escrita' },
      { name: 'Service Mesh (Istio/Linkerd)', tip: 'mTLS automático, circuit breaking no sidecar, canary deployment — quando cluster > 20 serviços' },
      { name: 'Chaos Engineering', tip: 'Injetar falhas sistematicamente (Chaos Monkey) para validar resiliência antes de incidente real' },
      { name: 'Zero-downtime deployment', tip: 'Rolling + expand-contract pattern + feature flags + backward compatibility obrigatória' },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// Componente principal
// ═══════════════════════════════════════════════════════════════════════════════

export default function MicroservicesVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'arch-comparison',
      title: 'Monolito vs Modulith vs Microservices',
      subtitle: 'Comparação multidimensional — quando cada arquitetura faz sentido',
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
      id: 'saga',
      title: 'Saga Pattern — Máquina de Estados',
      subtitle: 'Fluxo de coreografia: estados, transições e compensating transactions',
      accent: C,
      component: (
        <StateMachineExplorer
          states={SAGA_STATES}
          transitions={SAGA_TRANSITIONS}
          initialState="ORDER_CREATED"
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'circuit-breaker',
      title: 'Circuit Breaker — Estados e Transições',
      subtitle: 'CLOSED → OPEN → HALF_OPEN: como o breaker protege o sistema',
      accent: C,
      component: (
        <StateMachineExplorer
          states={CB_STATES}
          transitions={CB_TRANSITIONS}
          initialState="CLOSED"
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'api-gateway-flow',
      title: 'API Gateway: Fluxo de Request',
      subtitle: 'Do cliente ao serviço — autenticação, routing e chamadas internas',
      accent: C,
      component: (
        <SequenceDiagram
          actors={GW_ACTORS}
          messages={GW_MESSAGES}
          groups={GW_GROUPS}
          accentColor={C}
          bgColor={BG}
          title="API Gateway → Auth → Orders → Inventory"
          description="Fluxo completo de um request autenticado via API Gateway, com validação de token centralizada e chamada interna entre serviços."
        />
      ),
    },
    {
      id: 'resilience-layers',
      title: 'Padrões de Resiliência (CBRT)',
      subtitle: 'Timeout → Retry → Circuit Breaker → Bulkhead: camadas de defesa',
      accent: C,
      component: (
        <LayerStack
          layers={RESILIENCE_LAYERS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'antipatterns',
      title: 'Anti-patterns Clássicos',
      subtitle: 'Os erros que transformam microservices em distributed monolith',
      accent: C,
      component: (
        <AntiPatternsGallery
          patterns={MS_ANTIPATTERNS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'decision-tree',
      title: 'Quando Usar Microservices?',
      subtitle: 'Árvore de decisão: microservices vs modulith vs monolito',
      accent: C,
      component: (
        <DecisionTree
          root={MS_DECISION_ROOT}
          nodes={MS_DECISION_NODES}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'cqrs-layers',
      title: 'CQRS + Event Sourcing',
      subtitle: 'Command Side → Event Store → Projections → Query Side: as 4 camadas',
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
      id: 'comm-procon',
      title: 'Sync vs Async: Prós e Contras',
      subtitle: 'REST/gRPC síncrono vs Kafka/RabbitMQ assíncrono — quando usar cada um',
      accent: C,
      component: (
        <ProConMatrix
          options={COMM_OPTIONS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'progression',
      title: 'Progressão: Iniciante → Especialista',
      subtitle: 'Roadmap de conceitos de microservices em ordem de aprendizado',
      accent: C,
      component: (
        <ProgressionMap
          levels={MS_LEVELS}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
  ]

  // Supress unused variable warnings for palette colors defined for reference
  void C2; void LINE; void FG; void FGMUTE

  return (
    <VisuaisShell
      visuals={visuals}
      active={active}
      onChange={setActive}
    />
  )
}
