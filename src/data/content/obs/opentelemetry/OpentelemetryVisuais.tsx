'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { TreeExplorer } from '@/components/visuals/TreeExplorer'
import type { TreeNode, TreeNodeTypeMeta } from '@/components/visuals/TreeExplorer'
import { DecisionTree } from '@/components/visuals/DecisionTree'
import type { DTNode } from '@/components/visuals/DecisionTree'
import { CommandPalette } from '@/components/visuals/CommandPalette'
import type { CLICommand } from '@/components/visuals/CommandPalette'
import { CardCarousel } from '@/components/visuals/CardCarousel'
import type { CarouselCard } from '@/components/visuals/CardCarousel'
import { StateMachineExplorer } from '@/components/visuals/StateMachineExplorer'
import type { SMState, SMTransition } from '@/components/visuals/StateMachineExplorer'

// ── Paleta OpenTelemetry ──────────────────────────────────────────────────────
const C      = '#F5A800'   // OTel amber/gold
const C2     = '#cc8a00'   // secondary
const BG     = '#0f172a'
const CARD   = '#1e293b'
const CARD2  = '#243044'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const RED    = '#ef4444'
const AMB    = '#f59e0b'
const SKY    = '#38bdf8'
const PRP    = '#a78bfa'
const GRN    = '#4ade80'
const YLW    = '#facc15'
const CYN    = '#22d3ee'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Three Pillars + Correlation (componente custom)
// Mostra como trace_id liga traces, metrics e logs
// ═══════════════════════════════════════════════════════════════════════════════

const PILLARS = [
  {
    id: 'traces', label: 'Traces', icon: 'T', color: SKY,
    question: 'Onde foi lento e por quê?',
    desc: 'Árvore de spans de uma requisição distribuída — latência por serviço, atributos, eventos.',
    detail: 'Span = unidade de trabalho com nome, duração, atributos, status. Span tem TraceID (igual em toda a requisição) + SpanID (único do span) + ParentSpanID (árvore). Traceparent header propaga entre serviços.',
    example: 'POST /pay 4.1s\n  stripe.charge 3.8s ERROR 503\n  db.query 50ms\n  redis.set 5ms',
    answers: ['Latência por serviço', 'Cadeia de chamadas', 'Span com erro raiz'],
  },
  {
    id: 'metrics', label: 'Metrics', icon: 'M', color: C,
    question: 'O sistema está saudável agora?',
    desc: 'Dados numéricos agregados ao longo do tempo: contadores, gauges, histogramas.',
    detail: 'Counter (só sobe — req/s, erros), UpDownCounter (gauge dinâmico — conexões ativas), Histogram (distribui em buckets — latência), ObservableGauge (callback — tamanho de queue).',
    example: 'http_requests_total{status="500"}  rate=1.2/s\nhttp_request_duration p99=4.2s\nactive_connections=243',
    answers: ['SLI atual', 'Tendência ao longo do tempo', 'Alertas baseados em threshold'],
  },
  {
    id: 'logs', label: 'Logs', icon: 'L', color: YLW,
    question: 'O que exatamente aconteceu?',
    desc: 'Eventos discretos com contexto estruturado, correlacionados via trace_id e span_id.',
    detail: 'Logs viram úteis quando estruturados (JSON) e correlacionados. OTel SDK injeta automaticamente trace_id/span_id em cada log via log bridge — Pino, slf4j, Python logging.',
    example: '{"ts":"14:32:08","level":"err",\n "msg":"stripe API 503",\n "trace_id":"4bf92f...","span_id":"abc"}',
    answers: ['Stack trace exato', 'Detalhes contextuais', 'Auditoria de eventos'],
  },
]

function ThreePillarsVisual() {
  const [selected, setSelected] = useState(0)
  const pillar = PILLARS[selected]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Pillars row */}
      <div style={{ display: 'flex', gap: 12 }}>
        {PILLARS.map((p, i) => {
          const isActive = selected === i
          return (
            <button key={p.id} onClick={() => setSelected(i)}
              style={{
                flex: 1, padding: '16px 12px', borderRadius: 10, cursor: 'pointer',
                background: isActive ? `${p.color}20` : CARD,
                border: `1.5px solid ${isActive ? p.color : LINE}`,
                textAlign: 'center', transition: 'all 0.15s',
              }}>
              <div style={{
                width: 44, height: 44, margin: '0 auto 10px',
                borderRadius: '50%', background: BG, border: `2px solid ${p.color}`,
                color: p.color, fontWeight: 800, fontSize: 22,
                fontFamily: "'JetBrains Mono', monospace",
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{p.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: isActive ? p.color : FG, marginBottom: 4 }}>{p.label}</div>
              <div style={{ fontSize: 11, color: FGMUTE, lineHeight: 1.4 }}>&quot;{p.question}&quot;</div>
            </button>
          )
        })}
      </div>

      {/* Detail panel */}
      <div style={{ background: CARD, borderRadius: 12, padding: 18, border: `1.5px solid ${pillar.color}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: pillar.color }}>{pillar.label}</div>
          <div style={{ fontSize: 11, color: FGMUTE }}>responde:</div>
          <div style={{ fontSize: 13, color: FG, fontStyle: 'italic' }}>&quot;{pillar.question}&quot;</div>
        </div>
        <div style={{ fontSize: 13, color: FG, lineHeight: 1.7, marginBottom: 12 }}>{pillar.desc}</div>
        <div style={{ fontSize: 12, color: FGMUTE, lineHeight: 1.6, marginBottom: 12 }}>{pillar.detail}</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <div style={{ fontSize: 9, color: pillar.color, letterSpacing: '.08em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>
              Exemplo (formato real)
            </div>
            <pre style={{
              margin: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: FG,
              background: BG, padding: 10, borderRadius: 6, border: `1px solid ${LINE}`,
              lineHeight: 1.6, whiteSpace: 'pre-wrap',
            }}>{pillar.example}</pre>
          </div>
          <div>
            <div style={{ fontSize: 9, color: pillar.color, letterSpacing: '.08em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>
              Para que serve
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {pillar.answers.map(a => (
                <div key={a} style={{
                  fontSize: 12, color: FG, padding: '8px 12px',
                  background: BG, borderRadius: 6, border: `1px solid ${LINE}`,
                  borderLeft: `3px solid ${pillar.color}`,
                }}>{a}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Correlation insight */}
      <div style={{ background: `${C}10`, borderRadius: 10, padding: 16, border: `1.5px solid ${C}55` }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C, marginBottom: 8, letterSpacing: '.08em', textTransform: 'uppercase' }}>
          A unificação que OTel traz: o mesmo trace_id em todos os 3 pilares
        </div>
        <div style={{ fontSize: 13, color: FG, lineHeight: 1.7 }}>
          O <strong style={{ color: C }}>trace_id</strong> aparece automaticamente nas métricas (como <strong>exemplar</strong>) e nos logs (via SDK log bridge).
          O fluxo de debugging vira linear: <strong style={{ color: C }}>alerta</strong> em métrica → clique no exemplar →
          <strong style={{ color: SKY }}> trace</strong> mostra qual serviço quebrou → botão &quot;view logs&quot; →
          <strong style={{ color: YLW }}> log</strong> com stack trace exato. Os 3 pilares isolados são ilhas; correlacionados, viram mapa.
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Trace Tree Explorer (TreeExplorer)
// ═══════════════════════════════════════════════════════════════════════════════

const TRACE_TREE: TreeNode = {
  id: 'gateway',
  name: 'gateway.route',
  type: 'root',
  tooltip: 'Span raiz (root span) — gera trace_id e o primeiro span_id. Propaga traceparent para todos os serviços downstream.',
  tip: 'TraceID 4bf92f... · SpanID abc123 · ParentSpanID null',
  children: [
    {
      id: 'auth',
      name: 'auth.validate',
      type: 'service',
      tooltip: 'Span filho do gateway. Recebe traceparent header, extrai trace_id + parent_id, cria novo span_id.',
      tip: 'service.name=auth-service · http.method=POST · 30ms',
      children: [
        {
          id: 'auth-redis',
          name: 'redis.get',
          type: 'cache',
          tooltip: 'Auto-instrumentação do redis client cria esse span automaticamente. db.system=redis.',
          tip: 'db.system=redis · operation=GET · key=session:abc · 2ms',
        },
      ],
    },
    {
      id: 'order',
      name: 'order.process',
      type: 'service',
      tooltip: 'Span filho do gateway. Processa o pedido — cria spans filhos para cada operação interna.',
      tip: 'service.name=order-service · pedido.id=p_8420 · 140ms',
      children: [
        {
          id: 'order-db',
          name: 'db.query',
          type: 'db',
          tooltip: 'Span de query SQL — auto-instrumentação do pg/mysql2/typeorm. db.statement com SQL completa (cuidado com PII).',
          tip: 'db.system=postgresql · db.statement=SELECT * FROM pedidos · 50ms',
        },
        {
          id: 'inventory',
          name: 'inventory.check',
          type: 'service',
          tooltip: 'Chamada HTTP síncrona para inventory-service. Traceparent é injetado automaticamente no header.',
          tip: 'http.method=GET · http.url=/check · http.status_code=200 · 70ms',
          children: [
            {
              id: 'inv-db',
              name: 'db.query',
              type: 'db',
              tooltip: 'Query no Postgres do inventory. Mesmo trace_id, span_id diferente.',
              tip: 'db.system=postgresql · 25ms',
            },
          ],
        },
        {
          id: 'order-pub',
          name: 'kafka.publish',
          type: 'queue',
          tooltip: 'Publica evento. Traceparent injetado nos headers do Kafka via opentelemetry-instrumentation-kafkajs.',
          tip: 'messaging.system=kafka · topic=order.created · 8ms',
        },
      ],
    },
  ],
}

const TRACE_TYPE_MAP: Record<string, TreeNodeTypeMeta> = {
  root:    { color: '#F5A800', label: 'Root span',  icon: 'R', desc: 'Span raiz que iniciou o trace. ParentSpanID é null.' },
  service: { color: '#38bdf8', label: 'Service',    icon: 'S', desc: 'Span de um serviço — geralmente HTTP server ou consumer de fila.' },
  db:      { color: '#a78bfa', label: 'DB query',   icon: 'D', desc: 'Span de query de banco. Auto-instrumentado por pg/mysql2/typeorm/prisma.' },
  cache:   { color: '#4ade80', label: 'Cache',      icon: 'C', desc: 'Span de cache (redis, memcached). Auto-instrumentado.' },
  queue:   { color: '#fbbf24', label: 'Queue',      icon: 'Q', desc: 'Publish/consume de fila. Propagar traceparent via message attributes.' },
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Sampling Decision Tree
// ═══════════════════════════════════════════════════════════════════════════════

const SAMPLING_ROOT: DTNode = {
  id: 'start',
  question: 'Qual o volume de traces por segundo (estimado)?',
  children: [
    { label: 'Baixo (< 100/s)',         nodeId: 'low-volume',  color: GRN },
    { label: 'Médio (100-10k/s)',       nodeId: 'med-volume',  color: AMB },
    { label: 'Alto (> 10k/s)',          nodeId: 'high-volume', color: RED },
  ],
}

const SAMPLING_NODES: Record<string, DTNode> = {
  'low-volume': {
    id: 'low-volume',
    recommendation: 'AlwaysOn — colete 100% dos traces',
    detail: 'Volume baixo, custo de storage gerenciável. Capture tudo: erros raros não escapam, debugging é completo. Configure com sampler: AlwaysOn no SDK. Em desenvolvimento sempre use AlwaysOn — nunca debugar com 1% de traces.',
    color: GRN,
    icon: 'all',
  },
  'med-volume': {
    id: 'med-volume',
    question: 'Os erros são frequentes (> 1% das requisições) ou raros (< 0.1%)?',
    children: [
      { label: 'Frequentes (> 1%)', nodeId: 'med-head', color: GRN },
      { label: 'Raros (< 0.1%)',   nodeId: 'med-tail', color: AMB },
    ],
  },
  'med-head': {
    id: 'med-head',
    recommendation: 'Head sampling — TraceIdRatioBased(0.1) (10%)',
    detail: 'Volume médio com erros frequentes: head sampling estateless (decisão na entrada da requisição) é simples e barato. Como erros são frequentes, 10% ainda capta amostragem representativa de erros. Use ParentBased: trace iniciado fora respeita decisão upstream.',
    color: GRN,
    icon: 'head',
  },
  'med-tail': {
    id: 'med-tail',
    recommendation: 'Tail sampling no Collector — capture 100% dos erros + 5% do resto',
    detail: 'Erros raros + head sampling = você perde quase todos os traces de erro. Tail sampling guarda spans em memória durante decision_wait (10s) e decide ao final: 100% se ERROR, 100% se latência > 1s, 5% do resto. Custo: estado em memória no Collector. Em multi-Collector use loadbalancingexporter com consistent hashing por trace_id.',
    color: AMB,
    icon: 'tail',
  },
  'high-volume': {
    id: 'high-volume',
    question: 'Existe budget para storage de traces (GB/dia)?',
    children: [
      { label: 'Limitado',  nodeId: 'high-aggressive', color: RED },
      { label: 'Generoso', nodeId: 'high-tail-rich', color: PRP },
    ],
  },
  'high-aggressive': {
    id: 'high-aggressive',
    recommendation: 'Tail sampling agressivo — 100% erros + latency > 99p + 1% do resto',
    detail: 'Volume alto + budget limitado: foque no que importa. Policies: status_code=ERROR (100%), latency > p99 esperado (100%), probabilistic 1% do resto. Adicione policy de "always sample" para rotas críticas via attribute (route="/checkout" -> 100%). decision_wait alto (15-30s) para traces longos não serem cortados.',
    color: RED,
    icon: 'cut',
  },
  'high-tail-rich': {
    id: 'high-tail-rich',
    recommendation: 'Tail sampling stateful + storage hot/cold tiering',
    detail: 'Volume alto + budget OK: tail sampling rich (10-20% do tráfego normal + 100% de erros e slow). Implemente storage tiering: traces dos últimos 7 dias em hot storage (Tempo + S3 standard); traces antigos em cold storage (S3 Glacier). Service Graph metrics gerados a partir de traces no Collector — você ganha dashboards de RED metrics sem instrumentar manualmente.',
    color: PRP,
    icon: 'rich',
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Semantic Conventions Palette
// ═══════════════════════════════════════════════════════════════════════════════

const SEMCONV_COMMANDS: CLICommand[] = [
  // HTTP
  {
    command: 'http.request.method',
    description: 'Método HTTP — GET, POST, PUT, DELETE. Substituiu http.method na spec 1.20+',
    output: 'http.request.method = "POST"\nhttp.response.status_code = 200',
    outputType: 'text',
    category: 'HTTP',
    flags: [
      { flag: 'antigo', description: 'http.method, http.status_code (deprecado)' },
      { flag: 'novo', description: 'http.request.method, http.response.status_code' },
    ],
  },
  {
    command: 'http.route',
    description: 'Padrão de rota normalizado — /user/{id} em vez de /user/12345 (evita explosão de cardinalidade)',
    output: 'http.route = "/users/{id}"   ✓\nhttp.route = "/users/12345" ✗ (cardinalidade)',
    outputType: 'text',
    category: 'HTTP',
    flags: [
      { flag: 'porque', description: 'Sem normalização, cada user_id vira span name único' },
      { flag: 'auto', description: 'Frameworks com router (Express, FastAPI) extraem automático' },
    ],
  },
  {
    command: 'http.request.body.size',
    description: 'Tamanho do body em bytes — para alertas de payloads anômalos',
    output: 'http.request.body.size = 1024\nhttp.response.body.size = 5120',
    outputType: 'text',
    category: 'HTTP',
  },
  {
    command: 'url.full / url.path',
    description: 'URL completa OU só o path. NUNCA inclua query string com PII',
    output: 'url.path = "/api/orders/{id}"\nurl.full = "https://api.com/orders/123" ✗ (com PII)',
    outputType: 'text',
    category: 'HTTP',
    flags: [
      { flag: 'PII', description: 'Query strings com email/cpf/token vazam telemetria' },
      { flag: 'redact', description: 'Use attributes processor no Collector para sanitizar' },
    ],
  },
  // DB
  {
    command: 'db.system',
    description: 'Sistema de banco — postgresql, mysql, mongodb, redis, elasticsearch',
    output: 'db.system = "postgresql"\ndb.system = "redis"\ndb.system = "mongodb"',
    outputType: 'text',
    category: 'Database',
    flags: [
      { flag: 'valores', description: 'Lista enum oficial — não invente nomes' },
      { flag: 'use', description: 'Filtro principal em queries TraceQL' },
    ],
  },
  {
    command: 'db.statement',
    description: 'SQL completo da query — CUIDADO com PII (WHERE email=...)',
    output: 'db.statement = "SELECT * FROM users WHERE id = $1"\n                          ↑ ok, parametrizado',
    outputType: 'text',
    category: 'Database',
    flags: [
      { flag: 'PII', description: 'Queries com WHERE email = "x@y.com" vazam dados sensíveis' },
      { flag: 'sanitized', description: 'Use db.statement.sanitized ou substituir valores antes' },
    ],
  },
  {
    command: 'db.operation',
    description: 'Tipo da operação — SELECT, INSERT, UPDATE, DELETE. Mais útil que db.statement para agregar',
    output: 'db.operation = "SELECT"\ndb.operation = "INSERT"',
    outputType: 'text',
    category: 'Database',
  },
  {
    command: 'db.connection_string',
    description: 'String de conexão SEM credenciais — host, port, dbname',
    output: 'db.connection_string = "postgres://prod-db:5432/orders"\n                                ↑ sem user:pass',
    outputType: 'text',
    category: 'Database',
  },
  // Messaging
  {
    command: 'messaging.system',
    description: 'Sistema de mensageria — kafka, rabbitmq, sqs, sns, gcp_pubsub',
    output: 'messaging.system = "kafka"\nmessaging.operation = "publish"',
    outputType: 'text',
    category: 'Messaging',
  },
  {
    command: 'messaging.destination.name',
    description: 'Nome do tópico/fila/exchange',
    output: 'messaging.destination.name = "order.created"\nmessaging.destination.kind = "topic"',
    outputType: 'text',
    category: 'Messaging',
  },
  {
    command: 'messaging.kafka.message.key',
    description: 'Chave da mensagem Kafka — útil para correlação por entidade',
    output: 'messaging.kafka.message.key = "order_8420"',
    outputType: 'text',
    category: 'Messaging',
  },
  // RPC
  {
    command: 'rpc.system',
    description: 'Sistema RPC — grpc, java_rmi, dotnet_wcf',
    output: 'rpc.system = "grpc"\nrpc.service = "OrderService"\nrpc.method = "CreateOrder"',
    outputType: 'text',
    category: 'RPC',
  },
  {
    command: 'rpc.grpc.status_code',
    description: 'Status gRPC — 0=OK, 4=DEADLINE_EXCEEDED, 14=UNAVAILABLE',
    output: 'rpc.grpc.status_code = 0   (OK)\nrpc.grpc.status_code = 14  (UNAVAILABLE)',
    outputType: 'text',
    category: 'RPC',
  },
  // Resource
  {
    command: 'service.name',
    description: 'OBRIGATÓRIO — nome do serviço em todos os spans. Aparece em todos os filtros.',
    output: 'service.name = "order-service"\nservice.version = "1.4.2"\nservice.namespace = "production"',
    outputType: 'text',
    category: 'Resource',
    flags: [
      { flag: 'obrigatorio', description: 'Sem service.name, telemetria vai pra "unknown_service"' },
      { flag: 'k8s', description: 'Use K8s resource detector para preencher k8s.* automaticamente' },
    ],
  },
  {
    command: 'deployment.environment',
    description: 'Ambiente — production, staging, development',
    output: 'deployment.environment = "production"',
    outputType: 'text',
    category: 'Resource',
  },
  {
    command: 'host.name / k8s.pod.name',
    description: 'Identificadores de host/pod — preenchidos por resource detectors',
    output: 'host.name = "ip-10-0-1-23"\nk8s.pod.name = "order-7f8d-abc123"\nk8s.namespace.name = "production"',
    outputType: 'text',
    category: 'Resource',
  },
  // Exception
  {
    command: 'exception.type / .message',
    description: 'Atributos de exceção — gravados via span.recordException(err)',
    output: 'exception.type = "TimeoutError"\nexception.message = "Stripe API timeout after 5s"\nexception.stacktrace = "Error: ..."',
    outputType: 'text',
    category: 'Exception',
    flags: [
      { flag: 'api', description: 'span.recordException(error) preenche tudo automaticamente' },
      { flag: 'status', description: 'Combine com span.setStatus({code: ERROR})' },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — SDK Setup por Linguagem (CardCarousel)
// ═══════════════════════════════════════════════════════════════════════════════

const SDK_CARDS: CarouselCard[] = [
  {
    name: 'Node.js — auto-instrumentação',
    signature: '@opentelemetry/sdk-node + @opentelemetry/auto-instrumentations-node',
    emoji: 'JS',
    color: '#68A063',
    use: [
      'Express, Fastify, NestJS — auto-instr funciona out of the box',
      'http, axios, pg, mysql2, redis, mongodb, ioredis, prisma — todos auto-instrumentados',
      'Bootstrap MUITO antes de qualquer outro require — use --require ./instrument.js',
      'Resource attributes via Resource() — service.name, service.version, deployment.environment',
    ],
    dontUse: 'Ambientes ESM puros sem --import flag (Node 20+ tem suporte experimental)',
    difficulty: 1,
  },
  {
    name: 'Python — distro + bootstrap',
    signature: 'opentelemetry-distro + opentelemetry-bootstrap -a install',
    emoji: 'Py',
    color: '#3776AB',
    use: [
      'FastAPI, Django, Flask — auto-instr completo',
      'SQLAlchemy, psycopg2, pymongo, redis-py — instrumentors prontos',
      'opentelemetry-bootstrap detecta pacotes instalados e adiciona instrumentors',
      'Para FastAPI async: use opentelemetry-instrumentation-fastapi explicitamente',
    ],
    dontUse: 'Aplicações com gevent/eventlet sem monkey-patch correto (context propagation quebra)',
    difficulty: 1,
  },
  {
    name: 'Go — manual (sem auto-instr completa)',
    signature: 'go.opentelemetry.io/otel + otel/sdk + otel/exporters/otlp/otlptrace',
    emoji: 'Go',
    color: '#00ADD8',
    use: [
      'net/http handlers — wrap com otelhttp.NewHandler',
      'database/sql — wrap connection com otelsql',
      'gRPC — interceptors via otelgrpc.UnaryServerInterceptor',
      'Spans manuais com tracer.Start(ctx, "name") — go é manual-first',
    ],
    dontUse: 'Esperar auto-instr "mágica" como Node/Python — Go exige wrapping explícito',
    difficulty: 2,
  },
  {
    name: 'Java — Java Agent (zero código)',
    signature: '-javaagent:opentelemetry-javaagent.jar',
    emoji: 'JV',
    color: '#f89820',
    use: [
      'Spring Boot, Quarkus, Micronaut — instrumentação completa via bytecode',
      'JDBC, Kafka, RabbitMQ, gRPC, OkHttp — todos auto-instrumentados',
      'Configuração via env vars: OTEL_SERVICE_NAME, OTEL_EXPORTER_OTLP_ENDPOINT',
      'Java agent é o jeito recomendado — sem mexer em código',
    ],
    dontUse: 'Apps GraalVM native-image (use anotações + SDK manual)',
    difficulty: 1,
  },
  {
    name: '.NET — OpenTelemetry.AutoInstrumentation',
    signature: 'dotnet add OpenTelemetry.Extensions.Hosting',
    emoji: 'NT',
    color: '#512BD4',
    use: [
      'ASP.NET Core — AddOpenTelemetry().WithTracing() no Program.cs',
      'Entity Framework, HttpClient, Sql Client — instrumentadores prontos',
      'Source Generators para spans manuais com baixíssimo overhead',
      '.NET Auto-Instrumentation (separado) faz instrumentação sem mudar código',
    ],
    dontUse: '.NET Framework 4.x antigo (use SDK clássico Microsoft.ApplicationInsights)',
    difficulty: 1,
  },
  {
    name: 'Rust — manual com tracing crate',
    signature: 'opentelemetry + opentelemetry_otlp + tracing-opentelemetry',
    emoji: 'Rs',
    color: '#CE422B',
    use: [
      'tracing crate como API; tracing-opentelemetry como bridge',
      'Spans via #[tracing::instrument] em funções',
      'Exporter OTLP via tonic (gRPC) ou reqwest (HTTP)',
      'Macros tracing::info!, tracing::error! viram OTel logs com trace_id',
    ],
    dontUse: 'Esperar auto-instrumentação — Rust é totalmente manual via tracing',
    difficulty: 3,
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — Span Lifecycle State Machine
// ═══════════════════════════════════════════════════════════════════════════════

const SPAN_STATES: SMState[] = [
  { id: 'unset',    label: 'Unset',    description: 'Estado inicial após startSpan(). Atributos podem ser adicionados, eventos registrados, status mudado. Span ainda não tem duração final.', color: FGMUTE, isInitial: true },
  { id: 'recording', label: 'Recording', description: 'Span ativo no contexto via startActiveSpan() — todos os spans criados dentro são automaticamente filhos. Attributes/events sendo gravados.', color: SKY },
  { id: 'ended',    label: 'Ended',    description: 'span.end() chamado — duração calculada (endTime - startTime). Atributos não podem mais ser modificados. Aguarda exporter.', color: AMB },
  { id: 'exported', label: 'Exported', description: 'Enviado via OTLP exporter ao Collector. SimpleSpanProcessor: imediato. BatchSpanProcessor: em batch (recomendado em prod).', color: GRN },
  { id: 'sampled-out', label: 'Sampled Out', description: 'Sampler decidiu NÃO coletar este span. Atributos ainda podem ser setados (não-oprestricted) mas span não vai pro exporter.', color: PRP, isFinal: true },
  { id: 'dropped',  label: 'Dropped',  description: 'Span perdido — limite de buffer do BatchSpanProcessor estourado, ou Collector com memory_limiter dropping. Métrica otel_sdk_processor_dropped_spans.', color: RED, isFinal: true },
]

const SPAN_TRANSITIONS: SMTransition[] = [
  { from: 'unset',     to: 'recording', event: 'tracer.startActiveSpan()', code: 'tracer.startActiveSpan("op", span => {...})' },
  { from: 'unset',     to: 'sampled-out', event: 'sampler decidiu drop', guard: 'TraceIdRatioBased(0.1) — 90%' },
  { from: 'recording', to: 'recording', event: 'span.setAttribute()', code: 'span.setAttribute("user.id", id)' },
  { from: 'recording', to: 'recording', event: 'span.addEvent()', code: 'span.addEvent("cache.miss")' },
  { from: 'recording', to: 'recording', event: 'span.recordException()', code: 'span.recordException(err)' },
  { from: 'recording', to: 'ended',     event: 'span.end()', code: 'span.end() // SEMPRE no finally', guard: 'duration = endTime - startTime' },
  { from: 'ended',     to: 'exported',  event: 'BatchSpanProcessor flush', guard: 'A cada 5s ou batch=512' },
  { from: 'ended',     to: 'dropped',   event: 'buffer cheio — backpressure', guard: 'memory_limiter ou sdk queue full' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// Componente principal
// ═══════════════════════════════════════════════════════════════════════════════

export default function OpentelemetryVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'three-pillars',
      title: 'Os 3 Pilares e a correlação por trace_id',
      subtitle: 'Traces, Metrics, Logs — o que cada um responde e como OTel unifica os três numa API',
      accent: C,
      component: <ThreePillarsVisual />,
    },
    {
      id: 'trace-tree',
      title: 'Anatomia de um trace — árvore de spans',
      subtitle: 'Clique em cada span: TraceID, SpanID, ParentSpanID, atributos e Semantic Conventions',
      accent: C,
      component: (
        <TreeExplorer
          tree={TRACE_TREE}
          typeMap={TRACE_TYPE_MAP}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          card2Color={CARD2}
          defaultSelected="gateway"
        />
      ),
    },
    {
      id: 'sampling',
      title: 'Sampling — Head vs Tail, qual escolher?',
      subtitle: 'Volume, frequência de erros e budget definem a estratégia. Árvore de decisão para chegar à recomendação',
      accent: C,
      component: (
        <DecisionTree
          root={SAMPLING_ROOT}
          nodes={SAMPLING_NODES}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'semconv',
      title: 'Semantic Conventions — palette interativa',
      subtitle: 'Os atributos padronizados que todo backend OTel entende — HTTP, DB, Messaging, RPC, Resource, Exception',
      accent: C,
      component: (
        <CommandPalette
          commands={SEMCONV_COMMANDS}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          title="Semantic Conventions"
          description="Filtre por categoria ou busque por nome (http, db, messaging, rpc, service)"
          placeholder="http.request.method, db.system, service.name ..."
        />
      ),
    },
    {
      id: 'sdk-setup',
      title: 'SDK setup por linguagem — auto-instr vs manual',
      subtitle: 'Node.js, Python, Go, Java, .NET, Rust — como bootstrap em cada uma e o nível de auto-instrumentação',
      accent: C,
      component: (
        <CardCarousel
          cards={SDK_CARDS}
          accentColor={C}
          bgColor={BG}
          useLabel="Use para"
          dontUseLabel="Não use quando"
        />
      ),
    },
    {
      id: 'span-lifecycle',
      title: 'Ciclo de vida de um Span',
      subtitle: 'Unset -> Recording -> Ended -> Exported. E os caminhos para Sampled Out e Dropped',
      accent: C,
      component: (
        <StateMachineExplorer
          states={SPAN_STATES}
          transitions={SPAN_TRANSITIONS}
          initialState="unset"
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
