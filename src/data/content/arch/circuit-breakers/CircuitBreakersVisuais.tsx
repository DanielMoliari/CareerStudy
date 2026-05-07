'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { StateMachineExplorer } from '@/components/visuals/StateMachineExplorer'
import type { SMState, SMTransition } from '@/components/visuals/StateMachineExplorer'
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

// ── Paleta Circuit Breakers ──────────────────────────────────────────────────
const C      = '#f97316'  // orange — failure/alert
const BG     = '#0f172a'
const CARD   = '#1e293b'
const GRN    = '#22c55e'
const RED    = '#ef4444'
const AMB    = '#f59e0b'
const PRP    = '#a78bfa'
const SKY    = '#38bdf8'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Máquina de Estados do Circuit Breaker (StateMachineExplorer)
// ═══════════════════════════════════════════════════════════════════════════════

const CB_STATES: SMState[] = [
  {
    id: 'CLOSED',
    label: 'CLOSED',
    description: 'Estado normal. Chamadas passam para a dependência. Breaker monitora taxa de erros e latência em janela deslizante. Se taxa cruzar o limiar, transita para OPEN.',
    color: GRN,
    isInitial: true,
  },
  {
    id: 'OPEN',
    label: 'OPEN',
    description: 'Chamadas são rejeitadas imediatamente (fail-fast) sem tocar na dependência. Evita thread exhaustion e cascading failure. Após resetTimeout, transita para HALF_OPEN.',
    color: RED,
  },
  {
    id: 'HALF_OPEN',
    label: 'HALF\nOPEN',
    description: 'Permite N chamadas de teste (probe calls). Se passarem, retorna para CLOSED (serviço recuperado). Se falharem, volta para OPEN (ainda degradado).',
    color: AMB,
  },
]

const CB_TRANSITIONS: SMTransition[] = [
  {
    from: 'CLOSED',
    to: 'OPEN',
    event: 'failureRate > 50%',
    guard: 'minimumCalls >= 20',
    code: `// Resilience4j
CircuitBreakerConfig.custom()
  .failureRateThreshold(50f)
  .minimumNumberOfCalls(20)
  .build()`,
  },
  {
    from: 'OPEN',
    to: 'HALF_OPEN',
    event: 'resetTimeout elapsed',
    guard: 'waitDuration = 30s',
    code: `// Após 30s em OPEN
// breaker tenta HALF_OPEN
.waitDurationInOpenState(
  Duration.ofSeconds(30)
)`,
  },
  {
    from: 'HALF_OPEN',
    to: 'CLOSED',
    event: 'probe calls succeed',
    guard: 'permittedCalls = 5',
    code: `// 5 probes OK → fecha
.permittedNumberOfCallsInHalfOpenState(5)
// Todas devem passar`,
  },
  {
    from: 'HALF_OPEN',
    to: 'OPEN',
    event: 'probe call fails',
    code: `// Qualquer probe falhar
// → volta para OPEN
// com backoff opcional`,
  },
  {
    from: 'CLOSED',
    to: 'OPEN',
    event: 'slowCallRate > 80%',
    guard: 'slowCallDuration > 2s',
    code: `// Trip wire por latência
.slowCallRateThreshold(80f)
.slowCallDurationThreshold(
  Duration.ofSeconds(2)
)`,
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Sequence: Cascading Failure Prevention
// ═══════════════════════════════════════════════════════════════════════════════

const SEQ_ACTORS: SeqActor[] = [
  { id: 'client', label: 'Cliente', color: SKY },
  { id: 'svcA', label: 'Serviço A', color: C },
  { id: 'cb', label: 'Circuit Breaker', color: AMB },
  { id: 'svcB', label: 'Serviço B (lento)', color: RED },
]

const SEQ_MESSAGES: SeqMessage[] = [
  { from: 'client', to: 'svcA', label: 'request', type: 'sync' },
  { from: 'svcA', to: 'cb', label: 'call()', type: 'sync' },
  // CLOSED: passa normalmente
  { from: 'cb', to: 'svcB', label: 'forward (CLOSED)', type: 'sync', note: 'breaker CLOSED — passa' },
  { from: 'svcB', to: 'cb', label: '⏱ timeout 30s', type: 'return', note: 'B está lento' },
  { from: 'cb', to: 'svcA', label: 'error (conta na janela)', type: 'return' },
  // Após N falhas — OPEN
  { from: 'svcA', to: 'cb', label: 'call()', type: 'sync' },
  { from: 'cb', to: 'svcA', label: '⚡ CallNotPermitted (OPEN)', type: 'return', note: 'fail-fast — zero latência' },
  { from: 'svcA', to: 'svcA', label: 'fallback()', note: 'cache stale / default' },
  { from: 'svcA', to: 'client', label: '200 OK (degradado)', type: 'return', note: 'cliente recebe resposta rápida' },
]

const SEQ_GROUPS: SeqGroup[] = [
  { label: 'CLOSED — monitora falhas', kind: 'loop', fromMsg: 0, toMsg: 4, color: GRN },
  { label: 'OPEN — fail-fast', kind: 'alt', fromMsg: 5, toMsg: 8, color: RED },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Comparison: Resilience4j vs Polly vs opossum vs Istio
// ═══════════════════════════════════════════════════════════════════════════════

const COMP_OPTIONS: ComparisonOption[] = [
  { id: 'r4j', label: 'Resilience4j', sublabel: 'Java / Kotlin', color: '#f59e0b' },
  { id: 'polly', label: 'Polly', sublabel: '.NET / C#', color: '#a78bfa' },
  { id: 'opossum', label: 'opossum', sublabel: 'Node.js', color: GRN },
  { id: 'istio', label: 'Istio', sublabel: 'Service Mesh', color: '#38bdf8' },
]

const COMP_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'sliding-window',
    label: 'Janela deslizante',
    category: 'Configuração',
    description: 'Suporte a window por tempo e por contagem',
    values: {
      r4j: { rating: 'excellent', note: 'TIME_BASED e COUNT_BASED nativos' },
      polly: { rating: 'good', note: 'CircuitBreakerPolicy com duração' },
      opossum: { rating: 'fair', note: 'rollingCountTimeout (ms)' },
      istio: { rating: 'poor', note: 'consecutive errors only (outlier detection)' },
    },
  },
  {
    id: 'slow-call',
    label: 'Trip wire por latência',
    category: 'Configuração',
    description: 'Abre o circuito por chamadas lentas, não só por erros',
    values: {
      r4j: { rating: 'excellent', note: 'slowCallRateThreshold + slowCallDuration' },
      polly: { rating: 'fair', note: 'timeout policy separado' },
      opossum: { rating: 'fair', note: 'timeout: Nms conta como erro' },
      istio: { rating: 'poor', note: 'não suporta diretamente' },
    },
  },
  {
    id: 'fallback',
    label: 'Fallback integrado',
    category: 'Resiliência',
    description: 'API nativa para definir resposta de fallback',
    values: {
      r4j: { rating: 'excellent', note: '.withFallback() via Decorators' },
      polly: { rating: 'excellent', note: 'FallbackPolicy encadeável' },
      opossum: { rating: 'excellent', note: 'breaker.fallback(() => ...)' },
      istio: { rating: 'poor', note: 'sem fallback — só rejeita' },
    },
  },
  {
    id: 'observability',
    label: 'Observabilidade',
    category: 'Produção',
    description: 'Métricas Prometheus, eventos, dashboard',
    values: {
      r4j: { rating: 'excellent', note: 'Micrometer nativo → Prometheus/Grafana' },
      polly: { rating: 'good', note: 'eventos via callbacks + métricas custom' },
      opossum: { rating: 'good', note: 'breaker.stats + eventos on("open")' },
      istio: { rating: 'excellent', note: 'Prometheus nativo via Envoy/Kiali' },
    },
  },
  {
    id: 'bulkhead',
    label: 'Bulkhead integrado',
    category: 'Resiliência',
    description: 'Isolamento de thread pool / semáforo por dependência',
    values: {
      r4j: { rating: 'excellent', note: 'ThreadPoolBulkhead e SemaphoreBulkhead' },
      polly: { rating: 'good', note: 'BulkheadPolicy separado' },
      opossum: { rating: 'poor', note: 'sem bulkhead nativo' },
      istio: { rating: 'fair', note: 'connection pool limits no DestinationRule' },
    },
  },
  {
    id: 'no-code',
    label: 'Zero mudança de código',
    category: 'Integração',
    description: 'Funciona sem modificar o serviço',
    values: {
      r4j: { rating: 'poor', note: 'requer biblioteca no código' },
      polly: { rating: 'poor', note: 'requer biblioteca no código' },
      opossum: { rating: 'poor', note: 'requer biblioteca no código' },
      istio: { rating: 'excellent', note: 'sidecar proxy — zero código' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — ConceptCarousel: Resiliência em Camadas
// ═══════════════════════════════════════════════════════════════════════════════

const RESILIENCE_SLIDES: Slide[] = [
  {
    title: 'Timeout — primeira linha de defesa',
    paragraphs: [
      'Todo request para dependência externa DEVE ter timeout. Sem timeout, thread fica presa indefinidamente aguardando resposta que nunca vem.',
      'Sem timeout → thread leak → thread pool exhaustion → serviço indisponível. O timeout por chamada é o guard mais básico — sem ele, nem retry nem breaker funcionam corretamente.',
      'Configure: HTTP timeout (connection + read), DB query timeout, timeout de pool de conexão. Use P99 da latência normal × 5-10 como ponto de partida.',
    ],
    gradient: [SKY, '#1e3a5f'],
    illustration: (
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#e2e8f0' }}>
        <div style={{ background: '#1e2233', borderRadius: 8, padding: 12 }}>
          <div style={{ color: SKY, fontWeight: 700, marginBottom: 8 }}>Timeout por chamada</div>
          <div style={{ color: '#94a3b8' }}>P99 normal: 200ms</div>
          <div style={{ color: '#94a3b8' }}>Timeout configurado: 1-2s</div>
          <div style={{ marginTop: 8, padding: '4px 8px', background: '#052e16', borderRadius: 4, color: '#86efac' }}>
            HTTP_TIMEOUT = P99 × 5-10
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Retry com Backoff Exponencial + Jitter',
    paragraphs: [
      'Retry resolve falhas transientes: network blip, deploy momentâneo, instabilidade pontual da dependência. A dependência está OK — só teve instabilidade pontual.',
      'Backoff exponencial: espera 100ms, 200ms, 400ms... entre tentativas. Jitter (randomização) evita thundering herd — todos os clientes tentando ao mesmo tempo depois de uma falha simultânea.',
      'Retry sem breaker é perigoso: dependência lenta + retry = amplifica carga exponencialmente (retry storm). Sempre combine retry com breaker.',
    ],
    gradient: [AMB, '#2d1a00'],
    illustration: (
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#e2e8f0' }}>
        <div style={{ background: '#1e2233', borderRadius: 8, padding: 12 }}>
          <div style={{ color: AMB, fontWeight: 700, marginBottom: 8 }}>Backoff + Jitter</div>
          {[
            { attempt: 1, wait: '100ms ± 30ms' },
            { attempt: 2, wait: '200ms ± 60ms' },
            { attempt: 3, wait: '400ms ± 120ms' },
          ].map(r => (
            <div key={r.attempt} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '1px solid #334155' }}>
              <span style={{ color: '#94a3b8' }}>Tentativa {r.attempt}</span>
              <span style={{ color: AMB }}>{r.wait}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: 'Circuit Breaker — proteção sistêmica',
    paragraphs: [
      'Quando retry não resolve (falha sustentada), o circuit breaker para de tentar. Rejeita imediatamente (fail-fast) sem consumir threads, sem esperar timeout.',
      'Três estados: CLOSED (normal), OPEN (fail-fast), HALF_OPEN (testando recovery). A janela deslizante com volume mínimo evita abertura por amostra pequena.',
      'O breaker é o mais externo dos decorators: decide se vale tentar antes de retry e timeout serem invocados. Ordem: breaker → retry → timeout → chamada.',
    ],
    gradient: [C, '#2d0a00'],
    illustration: (
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#e2e8f0' }}>
        <div style={{ background: '#1e2233', borderRadius: 8, padding: 12 }}>
          <div style={{ color: C, fontWeight: 700, marginBottom: 8 }}>Ordem dos Decorators</div>
          {[
            { label: 'Circuit Breaker (mais externo)', color: C },
            { label: 'Retry + Backoff', color: AMB },
            { label: 'Timeout (mais interno)', color: SKY },
            { label: 'HTTP Call', color: '#64748b' },
          ].map((d, i) => (
            <div key={i} style={{ padding: '4px 8px', marginBottom: 4, borderRadius: 4, background: '#0f1117', borderLeft: `3px solid ${d.color}`, fontSize: 10 }}>
              {d.label}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: 'Bulkhead — isolamento de recursos',
    paragraphs: [
      'Bulkhead isola pools de thread ou semáforos por dependência. Falha em serviço A consome no máximo N threads do pool A — o pool do serviço B permanece disponível.',
      'Complementa o breaker: o breaker evita chamadas quando a dependência está ruim, mas antes do breaker abrir, threads ainda são consumidas. Bulkhead limita o raio de impacto.',
      'ThreadPoolBulkhead (Resilience4j): thread pool separado por dependência, execução assíncrona. SemaphoreBulkhead: limita chamadas simultâneas sem thread separada — mais leve.',
    ],
    gradient: [PRP, '#1a0a2e'],
    illustration: (
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#e2e8f0' }}>
        <div style={{ background: '#1e2233', borderRadius: 8, padding: 12 }}>
          <div style={{ color: PRP, fontWeight: 700, marginBottom: 8 }}>Pool por Dependência</div>
          {[
            { name: 'Pool A → Payments (10t)', fill: 10, busy: 10, color: RED },
            { name: 'Pool B → Catalog (10t)', fill: 10, busy: 3, color: GRN },
          ].map(p => (
            <div key={p.name} style={{ marginBottom: 8 }}>
              <div style={{ color: '#94a3b8', fontSize: 9, marginBottom: 4 }}>{p.name}</div>
              <div style={{ display: 'flex', gap: 2 }}>
                {Array.from({ length: p.fill }, (_, i) => (
                  <div key={i} style={{ width: 14, height: 14, borderRadius: 2, background: i < p.busy ? p.color : '#334155' }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — LayerStack: Fallback Progressivo
// ═══════════════════════════════════════════════════════════════════════════════

const FALLBACK_LAYERS: Layer[] = [
  {
    id: 'cache-hot',
    label: 'Cache Quente (Redis)',
    sublabel: 'Melhor UX — dado recente, latência ~1ms',
    color: GRN,
    description: 'Primeiro fallback: dado fresco do Redis/memória. Pode estar levemente desatualizado (segundos/minutos), mas é a experiência mais próxima do normal.',
    examples: ['Redis com TTL configurado', 'Dado de segundos/minutos atrás', 'Transparente para o usuário', 'Cache-aside ou write-through'],
  },
  {
    id: 'cache-cold',
    label: 'Cache Frio',
    sublabel: 'Dado de horas/dias — ainda útil para muitos casos',
    color: AMB,
    description: 'Dado mais antigo do cache persistente (S3, DynamoDB, disco). Ainda funcional para leitura em muitos cenários de negócio.',
    examples: ['S3 com snapshot do dia anterior', 'CDN cache com TTL longo', 'Dados de referência (catálogo, preços)'],
  },
  {
    id: 'default',
    label: 'Resposta Default Estática',
    sublabel: 'Valor padrão do negócio — preço médio, lista vazia',
    color: C,
    description: 'Resposta de última instância calculada sem dependência. O negócio define o que é um "default aceitável" para cada endpoint.',
    examples: ['Preço médio dos últimos 30 dias', 'Lista vazia com mensagem clara', 'Score de crédito conservador'],
  },
  {
    id: 'queue',
    label: 'Queue Assíncrona',
    sublabel: 'Registra ação para processar quando serviço voltar',
    color: PRP,
    description: 'Para operações de escrita: coloca na fila e processa quando a dependência se recuperar. Requer idempotência e comunicação ao usuário.',
    examples: ['SQS para processar depois', 'DynamoDB stream + replay', 'Polling de status pelo cliente'],
  },
  {
    id: 'error',
    label: 'Erro Explícito Amigável',
    sublabel: 'Última opção — informa usuário com contexto e ETA',
    color: RED,
    description: 'Se nenhum fallback for aceitável, retorne erro claro com: o que aconteceu, quando deve resolver, o que o usuário pode fazer.',
    examples: ['HTTP 503 com Retry-After header', 'Mensagem com ETA estimado', 'Link para status page'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — Anti-patterns do Circuit Breaker
// ═══════════════════════════════════════════════════════════════════════════════

const CB_ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'Breaker sem fallback útil',
    wrong: [
      [{ text: '// ❌ Breaker abre mas não tem fallback\n', color: RED }],
      [{ text: 'const breaker = new CircuitBreaker(callService, {\n' }],
      [{ text: '  errorThresholdPercentage: 50,\n' }],
      [{ text: '  resetTimeout: 30000\n' }],
      [{ text: '})\n' }],
      [{ text: '// Quando OPEN → lança OpenCircuitError\n', color: RED }],
      [{ text: '// Usuário vê 500 Internal Server Error\n', color: RED }],
    ],
    right: [
      [{ text: '// ✅ Fallback progressivo\n', color: GRN }],
      [{ text: 'breaker.fallback(async () => {\n' }],
      [{ text: '  const cached = await redis.get(\'last_response\')\n', color: GRN }],
      [{ text: '  if (cached) return JSON.parse(cached)\n', color: GRN }],
      [{ text: '  return { status: \'degraded\', data: DEFAULT }\n', color: AMB }],
      [{ text: '})\n' }],
    ],
    why: 'Breaker sem fallback só falha mais rápido — não melhora UX. O ponto do breaker é permitir graceful degradation, não apenas fail-fast.',
  },
  {
    title: 'Limiar muito sensível — breaker oscilando',
    wrong: [
      [{ text: '// ❌ 1 falha já abre o circuito\n', color: RED }],
      [{ text: 'CircuitBreakerConfig.custom()\n' }],
      [{ text: '  .minimumNumberOfCalls(1)  // ❌ muito baixo\n', color: RED }],
      [{ text: '  .failureRateThreshold(10f) // ❌ muito sensível\n', color: RED }],
      [{ text: '  .waitDurationInOpenState(Duration.ofSeconds(1)) // ❌ muito curto\n', color: RED }],
    ],
    right: [
      [{ text: '// ✅ Baseado em baseline de produção\n', color: GRN }],
      [{ text: 'CircuitBreakerConfig.custom()\n' }],
      [{ text: '  .minimumNumberOfCalls(20)   // ✅ amostra mínima\n', color: GRN }],
      [{ text: '  .failureRateThreshold(50f)  // ✅ 10x acima da baseline\n', color: GRN }],
      [{ text: '  .waitDurationInOpenState(Duration.ofSeconds(30)) // ✅\n', color: GRN }],
    ],
    why: 'Threshold muito baixo → breaker oscila (abre e fecha rapidamente). Calibre com base em 2 semanas de baseline de produção: taxa normal de erro × 10x.',
  },
  {
    title: 'Request HTTP sem timeout configurado',
    wrong: [
      [{ text: '// ❌ HTTP client sem timeout — thread presa\n', color: RED }],
      [{ text: 'const res = await axios.get(\'http://slow-service/api\')\n', color: RED }],
      [{ text: '// Se slow-service travar, request fica pendurado\n', color: RED }],
      [{ text: '// Breaker nunca contabiliza como falha!\n', color: RED }],
    ],
    right: [
      [{ text: '// ✅ Timeout no cliente HTTP E no breaker\n', color: GRN }],
      [{ text: 'const res = await axios.get(\'http://slow-service/api\', {\n' }],
      [{ text: '  timeout: 3000  // 3s — timeout por chamada\n', color: GRN }],
      [{ text: '})\n' }],
      [{ text: '// Breaker também tem timeout como camada extra\n', color: GRN }],
      [{ text: '// { timeout: 3000 } no config do opossum\n', color: GRN }],
    ],
    why: 'Sem timeout na chamada subjacente, o breaker nunca vê o erro — o request fica pendurado. O breaker precisa que a chamada termine (com erro ou timeout) para contar na janela.',
  },
  {
    title: 'Estado do breaker em memória com múltiplas instâncias',
    wrong: [
      [{ text: '// ❌ 100 instâncias, cada uma com estado\n', color: RED }],
      [{ text: '// próprio. Algumas OPEN, outras CLOSED.\n', color: RED }],
      [{ text: '// Não há decisão global coordinada.\n', color: RED }],
      [{ text: 'const breaker = new CircuitBreaker(fn, options)\n', color: '#94a3b8' }],
      [{ text: '// Decisão baseada apenas no tráfego\n', color: RED }],
      [{ text: '// que chegou nesta instância específica\n', color: RED }],
    ],
    right: [
      [{ text: '// ✅ Para decisão global: use service mesh\n', color: GRN }],
      [{ text: '// Istio DestinationRule — centralizado no proxy\n', color: GRN }],
      [{ text: 'outlierDetection:\n' }],
      [{ text: '  consecutiveGatewayErrors: 5\n', color: GRN }],
      [{ text: '  interval: 10s\n', color: GRN }],
      [{ text: '  baseEjectionTime: 30s\n', color: GRN }],
      [{ text: '# Todos os pods veem a mesma decisão\n', color: GRN }],
    ],
    why: 'Em N instâncias, cada breaker em memória decide independente. Para 95% dos casos, isso é OK (convergência natural). Para decisão coordenada global, use Istio ou Redis centralizado.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSIÇÃO DE VISUAIS
// ═══════════════════════════════════════════════════════════════════════════════

export default function CircuitBreakersVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'state-machine',
      title: 'Máquina de Estados',
      subtitle: 'CLOSED → OPEN → HALF_OPEN — interaja com as transições',
      accent: C,
      component: (
        <StateMachineExplorer
          states={CB_STATES}
          transitions={CB_TRANSITIONS}
          initialState="CLOSED"
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          title="Circuit Breaker — Máquina de Estados Interativa"
          description="Clique nos estados ou nas transições disponíveis para simular o comportamento. Cada transição mostra o código de configuração correspondente."
        />
      ),
    },
    {
      id: 'sequence',
      title: 'Cascading Failure',
      subtitle: 'Como o breaker previne propagação de falha em cadeia',
      accent: RED,
      component: (
        <SequenceDiagram
          actors={SEQ_ACTORS}
          messages={SEQ_MESSAGES}
          groups={SEQ_GROUPS}
          accentColor={C}
          bgColor={BG}
          title="Circuit Breaker em Ação — Prevenção de Cascading Failure"
          description="Sem breaker: thread presa aguardando B lento → thread pool exhaustion → cascata. Com breaker: rejeição imediata → fallback → cliente recebe resposta rápida degradada."
        />
      ),
    },
    {
      id: 'comparison',
      title: 'Bibliotecas',
      subtitle: 'Resilience4j vs Polly vs opossum vs Istio — quando usar cada um',
      accent: AMB,
      component: (
        <ComparisonTable
          options={COMP_OPTIONS}
          criteria={COMP_CRITERIA}
          accentColor={C}
          bgColor={BG}
          title="Circuit Breaker — Comparativo de Implementações"
          description="Escolha baseada na linguagem, necessidade de fallback e observabilidade. Istio elimina código mas não suporta fallback complexo."
          highlightBest
        />
      ),
    },
    {
      id: 'resilience-chain',
      title: 'Cadeia de Resiliência',
      subtitle: 'Timeout → Retry → Circuit Breaker → Bulkhead — em sequência',
      accent: C,
      component: (
        <ConceptCarousel
          slides={RESILIENCE_SLIDES}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          label="PADRÕES COMPLEMENTARES"
          heading="A Cadeia Completa de Resiliência"
          description="Quatro padrões que se complementam — cada um resolve um problema diferente. Breaker é o mais externo; timeout é o mais interno."
        />
      ),
    },
    {
      id: 'fallback',
      title: 'Fallback Progressivo',
      subtitle: 'Camadas do melhor para o pior — graceful degradation',
      accent: GRN,
      component: (
        <LayerStack
          layers={FALLBACK_LAYERS}
          accentColor={C}
          bgColor={BG}
          title="Fallback Progressivo — Graceful Degradation"
          description="Quando o breaker abre, percorra as camadas do melhor para o pior. A camada mais alta que funcionar é a resposta. Sem fallback, breaker só falha mais rápido."
        />
      ),
    },
    {
      id: 'antipatterns',
      title: 'Anti-patterns',
      subtitle: 'Os 4 erros que arruínam circuit breakers em produção',
      accent: RED,
      component: (
        <AntiPatternsGallery
          patterns={CB_ANTIPATTERNS}
          accentColor={C}
          bgColor={BG}
          label="ERROS CRÍTICOS"
          heading="Anti-patterns do Circuit Breaker"
          description="Os erros mais frequentes que eliminam candidatos sênior e causam incidentes em produção."
          wrongLabel="Implementação incorreta"
          rightLabel="Implementação correta"
          whyLabel="Por que importa"
        />
      ),
    },
  ]

  return <VisuaisShell visuals={visuals} active={active} onChange={setActive} />
}
