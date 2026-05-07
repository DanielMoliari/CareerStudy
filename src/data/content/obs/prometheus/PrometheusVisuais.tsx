'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'
import { SequenceDiagram } from '@/components/visuals/SequenceDiagram'
import type { SeqActor, SeqMessage, SeqGroup } from '@/components/visuals/SequenceDiagram'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'

// ── Paleta Prometheus ─────────────────────────────────────────────────────────
const C      = '#E6522C'   // Prometheus orange
const C2     = '#c04120'   // dark orange
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
const SKY    = '#38bdf8'
const MUTE   = '#475569'

void C2; void CARD2; void MUTE

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Histogram Bucket Mechanics (custom)
// Como buckets cumulativos viram percentil via histogram_quantile
// ═══════════════════════════════════════════════════════════════════════════════

type BucketSnapshot = {
  id: string
  label: string
  desc: string
  buckets: { le: number; count: number }[]
  totalCount: number
  totalSum: number
  highlight?: number   // qual quantile destacar
}

const BUCKET_SCENARIOS: BucketSnapshot[] = [
  {
    id: 'healthy',
    label: 'Servico saudavel',
    desc: 'p99 = ~190ms. A maioria das requisicoes esta abaixo do bucket de 250ms — boa folga em relacao ao SLO de 500ms.',
    buckets: [
      { le: 0.05, count: 8200 },
      { le: 0.10, count: 9100 },
      { le: 0.25, count: 9700 },
      { le: 0.50, count: 9920 },
      { le: 1.00, count: 9980 },
      { le: 2.50, count: 9998 },
      { le: Infinity, count: 10000 },
    ],
    totalCount: 10000,
    totalSum: 920,
    highlight: 0.99,
  },
  {
    id: 'degrading',
    label: 'Latencia degradando',
    desc: 'p99 cai dentro do bucket de 1s — significa que o p99 real esta entre 500ms e 1s. Sem o bucket de 1s, voce nao saberia disso.',
    buckets: [
      { le: 0.05, count: 4500 },
      { le: 0.10, count: 6800 },
      { le: 0.25, count: 8500 },
      { le: 0.50, count: 9300 },
      { le: 1.00, count: 9920 },
      { le: 2.50, count: 9990 },
      { le: Infinity, count: 10000 },
    ],
    totalCount: 10000,
    totalSum: 2400,
    highlight: 0.99,
  },
  {
    id: 'wrong-buckets',
    label: 'Buckets errados (SLO 500ms)',
    desc: 'p99 cai no bucket de +Inf — o servico esta totalmente fora do SLO mas voce so sabe que e "muito ruim". Sempre inclua um bucket logo acima do SLO.',
    buckets: [
      { le: 0.01, count: 50 },
      { le: 0.05, count: 2000 },
      { le: 0.10, count: 5500 },
      { le: 0.25, count: 8800 },
      { le: Infinity, count: 10000 },
    ],
    totalCount: 10000,
    totalSum: 4200,
    highlight: 0.99,
  },
]

function HistogramBucketsVisual() {
  const [scenarioIdx, setScenarioIdx] = useState(0)
  const [quantile, setQuantile] = useState(0.99)

  const sc = BUCKET_SCENARIOS[scenarioIdx]
  const max = sc.totalCount
  const targetCount = quantile * max

  // Encontra o bucket no qual o quantile cai
  let qBucketIdx = sc.buckets.length - 1
  for (let i = 0; i < sc.buckets.length; i++) {
    if (sc.buckets[i].count >= targetCount) {
      qBucketIdx = i
      break
    }
  }
  const qBucket = sc.buckets[qBucketIdx]
  const prevBucket = qBucketIdx > 0 ? sc.buckets[qBucketIdx - 1] : { le: 0, count: 0 }

  // Interpolacao linear dentro do bucket (e como o histogram_quantile funciona)
  const fraction = (targetCount - prevBucket.count) / (qBucket.count - prevBucket.count)
  const estimatedLatency = qBucket.le === Infinity
    ? -1
    : prevBucket.le + fraction * (qBucket.le - prevBucket.le)

  const formatLe = (le: number) => le === Infinity ? '+Inf' : le < 1 ? `${(le * 1000).toFixed(0)}ms` : `${le}s`

  return (
    <div style={{ background: BG, borderRadius: 12, padding: 22, fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Cenarios */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {BUCKET_SCENARIOS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setScenarioIdx(i)}
            style={{
              flex: 1, padding: '10px 8px', borderRadius: 8, cursor: 'pointer',
              background: scenarioIdx === i ? `${C}20` : CARD,
              border: `1.5px solid ${scenarioIdx === i ? C : LINE}`,
              color: scenarioIdx === i ? C : FGMUTE, fontSize: 11, fontWeight: 600,
              textAlign: 'center', transition: 'all .15s', fontFamily: 'inherit',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Slider de quantile */}
      <div style={{ background: CARD, borderRadius: 10, padding: 16, marginBottom: 14, border: `1px solid ${LINE}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 11, color: FGMUTE, textTransform: 'uppercase', letterSpacing: '.06em' }}>
            histogram_quantile(<span style={{ color: C, fontWeight: 700 }}>{quantile.toFixed(2)}</span>, ...)
          </span>
          <span style={{ fontSize: 12, color: FG, fontFamily: "'JetBrains Mono', monospace" }}>
            target: <strong style={{ color: C }}>{(quantile * 100).toFixed(0)}%</strong> das requisicoes
          </span>
        </div>
        <input
          type="range" min={0.5} max={0.999} step={0.005}
          value={quantile}
          onChange={(e) => setQuantile(parseFloat(e.target.value))}
          style={{ width: '100%', accentColor: C }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 9, color: MUTE }}>
          <span>p50</span><span>p75</span><span>p90</span><span>p95</span><span>p99</span>
        </div>
      </div>

      {/* Buckets visuais */}
      <div style={{ background: CARD, borderRadius: 10, padding: 18, marginBottom: 14, border: `1px solid ${LINE}` }}>
        <div style={{ fontSize: 10, color: FGMUTE, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '.06em' }}>
          Buckets cumulativos do histogram_request_duration_seconds_bucket
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {sc.buckets.map((b, i) => {
            const widthPct = (b.count / max) * 100
            const isHighlighted = i === qBucketIdx
            const bg = isHighlighted ? `${C}40` : `${SKY}20`
            const border = isHighlighted ? C : SKY
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                  color: isHighlighted ? C : FGMUTE, width: 90, textAlign: 'right', fontWeight: isHighlighted ? 700 : 400,
                }}>
                  le={'"'}{formatLe(b.le)}{'"'}
                </div>
                <div style={{ flex: 1, height: 22, background: BG, borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${widthPct}%`,
                    background: bg, border: `1.5px solid ${border}`, borderRadius: 4,
                    transition: 'all .25s',
                  }} />
                  <span style={{
                    position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                    fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
                    color: isHighlighted ? C : FG, fontWeight: isHighlighted ? 700 : 400,
                  }}>
                    {b.count.toLocaleString()}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Resultado */}
      <div style={{ background: CARD, borderRadius: 10, padding: 16, border: `1.5px solid ${C}40` }}>
        <div style={{ fontSize: 10, color: C, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 700 }}>
          Resultado do histogram_quantile({quantile.toFixed(2)})
        </div>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center', marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: estimatedLatency < 0 ? RED : C, fontFamily: "'JetBrains Mono', monospace" }}>
              {estimatedLatency < 0 ? 'extrapolado' : estimatedLatency < 1 ? `${(estimatedLatency * 1000).toFixed(0)}ms` : `${estimatedLatency.toFixed(2)}s`}
            </div>
            <div style={{ fontSize: 10, color: FGMUTE, marginTop: 2 }}>latencia estimada</div>
          </div>
          <div style={{ flex: 1, fontSize: 12, color: FG, lineHeight: 1.7 }}>
            Bucket destacado: <strong style={{ color: C }}>le={formatLe(qBucket.le)}</strong>.
            O quantile cai entre <strong>{formatLe(prevBucket.le)}</strong> e <strong>{formatLe(qBucket.le)}</strong>;
            a interpolacao linear estima o valor exato.
          </div>
        </div>
        <div style={{ background: BG, borderRadius: 6, padding: 10, fontSize: 11, color: FG, lineHeight: 1.7 }}>
          {sc.desc}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Pull Model & Service Discovery (SequenceDiagram)
// ═══════════════════════════════════════════════════════════════════════════════

const SCRAPE_ACTORS: SeqActor[] = [
  { id: 'k8s',   label: 'Kubernetes API',  color: SKY },
  { id: 'prom',  label: 'Prometheus',      color: C },
  { id: 'svc',   label: 'Service /metrics', color: GRN },
  { id: 'tsdb',  label: 'TSDB',            color: AMB },
]

const SCRAPE_MESSAGES: SeqMessage[] = [
  { from: 'prom', to: 'k8s', label: 'list endpoints (kubernetes_sd_config)', note: 'Service discovery: descobre alvos dinamicamente. Annotation prometheus.io/scrape="true" ativa o scrape no pod.' },
  { from: 'k8s',  to: 'prom', label: 'targets descobertos (IPs + meta)',     note: 'Retorna lista atualizada com labels de pod, namespace, service. relabel_configs transforma esses metadados em labels finais.', type: 'return' },
  { from: 'prom', to: 'prom', label: 'aplica relabel_configs',                note: 'Filtra (action: drop), renomeia (replace) ou descarta labels de alta cardinalidade antes do scrape. Roda no Prometheus, nao no servico.' },
  { from: 'prom', to: 'svc', label: 'GET /metrics (a cada 15s)',              note: 'Pull model: o Prometheus inicia. Vantagem: detecta servico down (scrape falha = inacessivel). Desvantagem: jobs curtos morrem sem ser scrapeados.' },
  { from: 'svc',  to: 'prom', label: 'texto OpenMetrics (counter, gauge...)', note: 'Formato texto plano: # HELP, # TYPE, metric_name{labels} value timestamp. Padrao OpenMetrics e cross-language.', type: 'return' },
  { from: 'prom', to: 'tsdb', label: 'append samples (LSN, head chunk)',     note: 'Cada serie temporal indexada por nome+labels. Head chunks ficam em RAM ate compactacao em blocos de 2h gravados em disco.' },
  { from: 'prom', to: 'prom', label: 'avalia recording rules + alerting rules', note: 'A cada evaluation_interval (default 1min): roda PromQL, materializa recording rules como novas series, dispara alerting rules.' },
]

const SCRAPE_GROUPS: SeqGroup[] = [
  { label: 'Service Discovery', kind: 'loop', fromMsg: 0, toMsg: 2, color: SKY },
  { label: 'Scrape periodico (a cada 15s)', kind: 'loop', fromMsg: 3, toMsg: 6, color: C },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — RED vs USE Frameworks (ComparisonTable)
// ═══════════════════════════════════════════════════════════════════════════════

const FRAMEWORK_OPTIONS: ComparisonOption[] = [
  { id: 'red', label: 'RED', sublabel: 'Servicos HTTP/gRPC',         color: C },
  { id: 'use', label: 'USE', sublabel: 'Recursos de infraestrutura', color: SKY },
]

const FRAMEWORK_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'foco', label: 'Foco principal', category: 'Definicao',
    values: {
      red: { rating: 'excellent', note: 'Sintomas — o que o usuario sente (taxa, erro, latencia)' },
      use: { rating: 'excellent', note: 'Recursos — o que pode causar problema (CPU, disco, fila)' },
    },
  },
  {
    id: 'sigla', label: 'Significado da sigla', category: 'Definicao',
    values: {
      red: { rating: 'excellent', note: 'Rate (req/s) | Errors (% de erro) | Duration (latencia)' },
      use: { rating: 'excellent', note: 'Utilization (% uso) | Saturation (fila) | Errors (falhas hw)' },
    },
  },
  {
    id: 'when', label: 'Quando usar', category: 'Aplicacao',
    values: {
      red: { rating: 'excellent', note: 'Todo servico que recebe requests — APIs, gRPC, web servers' },
      use: { rating: 'excellent', note: 'Recursos compartilhados — CPU, memoria, disco, rede, threads' },
    },
  },
  {
    id: 'alerting', label: 'Bom para alertar?', category: 'Estrategia',
    values: {
      red: { rating: 'excellent', note: 'SIM — alertar em sintomas que o usuario sente diretamente' },
      use: { rating: 'fair',      note: 'NAO sozinho — usar para investigar causa raiz de alertas RED' },
    },
  },
  {
    id: 'example', label: 'Exemplo concreto', category: 'PromQL',
    values: {
      red: { rating: 'excellent', note: 'sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) > 0.01' },
      use: { rating: 'excellent', note: '1 - avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) by (instance) > 0.85' },
    },
  },
  {
    id: 'pitfall', label: 'Armadilha', category: 'Riscos',
    values: {
      red: { rating: 'good', note: 'Latencia como p99 bruto — deve ser proporcao de requests rapidas' },
      use: { rating: 'fair', note: 'Acordar SRE as 3h por CPU 90% sem evidencia de impacto no usuario' },
    },
  },
  {
    id: 'four-golden', label: 'Encaixe nos Four Golden Signals', category: 'Mapeamento',
    values: {
      red: { rating: 'excellent', note: 'Latencia + Trafego + Erros = 3 dos 4 sinais de ouro' },
      use: { rating: 'good',      note: 'Saturacao = o 4o sinal (utilization e saturation cobrem isso)' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Multi-window Burn Rate (custom)
// ═══════════════════════════════════════════════════════════════════════════════

type BurnScenario = {
  id: string
  label: string
  shortBurn: number  // burn rate na janela curta (1h)
  longBurn: number   // burn rate na janela longa (6h)
  desc: string
  alertSingleShort: boolean   // dispararia se so olhasse 1h
  alertSingleLong: boolean    // dispararia se so olhasse 6h
  alertMultiAnd: boolean      // dispara com AND multi-window
  threshold: number
  outcome: string
  color: string
}

const BURN_SCENARIOS: BurnScenario[] = [
  {
    id: 'real-incident',
    label: 'Incidente real grave',
    shortBurn: 18, longBurn: 16, threshold: 14,
    desc: 'Burn rate alto e sustentado em ambas as janelas. SLO 99.9% sendo violado severamente — error budget mensal vai esgotar em horas.',
    alertSingleShort: true, alertSingleLong: true, alertMultiAnd: true,
    outcome: 'PAGE imediato — incidente confirmado.', color: RED,
  },
  {
    id: 'spike',
    label: 'Spike de 5min (deploy ruim)',
    shortBurn: 25, longBurn: 2.8, threshold: 14,
    desc: 'Spike curto: 1h captura o pico (25x), mas a janela de 6h dilui (2.8x). Provavelmente um rollback ja resolveu.',
    alertSingleShort: true, alertSingleLong: false, alertMultiAnd: false,
    outcome: 'Sem alerta — multi-window evita falso positivo.', color: GRN,
  },
  {
    id: 'slow-degradation',
    label: 'Degradacao lenta',
    shortBurn: 6, longBurn: 8, threshold: 6,
    desc: 'Erro acumulando devagar: 1h ja ve, 6h confirma. Menos urgente que incidente grave mas precisa investigacao.',
    alertSingleShort: true, alertSingleLong: true, alertMultiAnd: true,
    outcome: 'Ticket urgente — investigar antes do budget acabar.', color: AMB,
  },
  {
    id: 'flaky',
    label: 'Sistema instavel ("flapping")',
    shortBurn: 16, longBurn: 4, threshold: 14,
    desc: 'Picos frequentes de erro mas curtos: 1h pega o ultimo pico, 6h dilui. Precisa de investigacao mas nao acordar SRE.',
    alertSingleShort: true, alertSingleLong: false, alertMultiAnd: false,
    outcome: 'Sem PAGE — ticket de baixa prioridade via outra regra.', color: SKY,
  },
]

function MultiWindowBurnVisual() {
  const [idx, setIdx] = useState(0)
  const sc = BURN_SCENARIOS[idx]

  const meterColor = (v: number) => v >= sc.threshold ? RED : v >= sc.threshold * 0.7 ? AMB : GRN

  return (
    <div style={{ background: BG, borderRadius: 12, padding: 22, fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Cenarios */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        {BURN_SCENARIOS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setIdx(i)}
            style={{
              flex: 1, padding: '10px 8px', borderRadius: 8, cursor: 'pointer',
              background: idx === i ? `${s.color}25` : CARD,
              border: `1.5px solid ${idx === i ? s.color : LINE}`,
              color: idx === i ? s.color : FGMUTE, fontSize: 11, fontWeight: 600,
              textAlign: 'center', transition: 'all .15s', fontFamily: 'inherit',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Janelas */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        {[
          { label: 'Janela curta (1h)', burn: sc.shortBurn, fires: sc.alertSingleShort },
          { label: 'Janela longa (6h)', burn: sc.longBurn,  fires: sc.alertSingleLong  },
        ].map((w) => {
          const c = meterColor(w.burn)
          const widthPct = Math.min(100, (w.burn / (sc.threshold * 1.8)) * 100)
          return (
            <div key={w.label} style={{ background: CARD, borderRadius: 10, padding: 16, border: `1px solid ${LINE}` }}>
              <div style={{ fontSize: 10, color: FGMUTE, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.06em' }}>{w.label}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: c, fontFamily: "'JetBrains Mono', monospace" }}>{w.burn.toFixed(1)}x</span>
                <span style={{ fontSize: 10, color: FGMUTE }}>burn rate atual</span>
              </div>
              <div style={{ height: 10, background: BG, borderRadius: 5, position: 'relative', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${widthPct}%`, background: c, borderRadius: 5, transition: 'all .25s' }} />
                <div style={{
                  position: 'absolute', top: -2, bottom: -2,
                  left: `${(sc.threshold / (sc.threshold * 1.8)) * 100}%`,
                  width: 2, background: AMB,
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 9, color: MUTE }}>
                <span>0</span>
                <span style={{ color: AMB }}>threshold {sc.threshold}x</span>
                <span>{(sc.threshold * 1.8).toFixed(0)}x+</span>
              </div>
              <div style={{
                marginTop: 10, fontSize: 11, fontWeight: 700,
                color: w.fires ? RED : GRN,
              }}>
                {w.fires ? '🔥 dispararia se sozinha' : '✓ silenciosa'}
              </div>
            </div>
          )
        })}
      </div>

      {/* AND gate */}
      <div style={{ background: CARD, borderRadius: 10, padding: 16, marginBottom: 14, border: `1.5px solid ${sc.alertMultiAnd ? RED : GRN}40` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <div style={{
            background: sc.alertSingleShort ? RED : MUTE, color: '#fff', borderRadius: 6,
            padding: '6px 12px', fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
          }}>
            1h&nbsp;{sc.alertSingleShort ? '✓' : '×'}
          </div>
          <div style={{ fontSize: 14, color: FGMUTE, fontWeight: 700 }}>AND</div>
          <div style={{
            background: sc.alertSingleLong ? RED : MUTE, color: '#fff', borderRadius: 6,
            padding: '6px 12px', fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
          }}>
            6h&nbsp;{sc.alertSingleLong ? '✓' : '×'}
          </div>
          <span style={{ fontSize: 18, color: FGMUTE }}>{'->'}</span>
          <div style={{
            background: sc.alertMultiAnd ? RED : GRN, color: '#fff', borderRadius: 6,
            padding: '8px 14px', fontSize: 13, fontWeight: 800,
          }}>
            {sc.alertMultiAnd ? '🚨 PAGE' : '✓ sem alerta'}
          </div>
        </div>
        <div style={{ fontSize: 12, color: FG, lineHeight: 1.7 }}>
          <strong style={{ color: sc.alertMultiAnd ? RED : GRN }}>{sc.outcome}</strong>
        </div>
      </div>

      {/* Detalhes */}
      <div style={{ background: CARD, borderRadius: 10, padding: 14, border: `1px solid ${LINE}`, fontSize: 12, color: FG, lineHeight: 1.7 }}>
        {sc.desc}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — Cardinality Explosion (custom)
// ═══════════════════════════════════════════════════════════════════════════════

type CardLabel = {
  id: string
  name: string
  example: string
  values: number
  color: string
  forbidden?: boolean
}

const CARDINALITY_LABELS: CardLabel[] = [
  { id: 'service', name: 'service',     example: 'api, worker, web',                   values: 50,        color: GRN },
  { id: 'method',  name: 'method',      example: 'GET, POST, PUT, DELETE',             values: 5,         color: GRN },
  { id: 'status',  name: 'status_code', example: '200, 404, 500',                       values: 20,        color: GRN },
  { id: 'env',     name: 'environment', example: 'prod, staging, dev',                  values: 3,         color: GRN },
  { id: 'route',   name: 'route',       example: '/api/users, /api/orders (template)', values: 200,       color: AMB },
  { id: 'pod',     name: 'pod',         example: 'api-7d4f-abc, api-7d4f-xyz',          values: 100,       color: AMB },
  { id: 'user',    name: 'user_id',     example: '42, 4321, 9876543...',                values: 1_000_000, color: RED, forbidden: true },
  { id: 'reqid',   name: 'request_id',  example: 'uuid-v4 unico por request',           values: 100_000_000, color: RED, forbidden: true },
  { id: 'url',     name: 'url',         example: '/api/users/42?token=xyz...',          values: 10_000_000, color: RED, forbidden: true },
]

function CardinalityVisual() {
  const [selected, setSelected] = useState<Set<string>>(new Set(['service', 'method', 'status']))

  const toggle = (id: string) => {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id); else next.add(id)
    setSelected(next)
  }

  const labels = CARDINALITY_LABELS.filter(l => selected.has(l.id))
  const product = labels.reduce((acc, l) => acc * l.values, 1)
  const memMb = (product * 3000) / 1024 / 1024  // estimativa: ~3KB por serie em head chunks
  const danger = product > 1_000_000

  const fmt = (n: number) => {
    if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`
    if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`
    if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`
    return n.toFixed(0)
  }

  return (
    <div style={{ background: BG, borderRadius: 12, padding: 22, fontFamily: "'Space Grotesk', sans-serif" }}>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, color: FG, fontWeight: 700, marginBottom: 4 }}>
          Selecione labels para uma metrica como http_requests_total
        </div>
        <div style={{ fontSize: 11, color: FGMUTE }}>
          Cardinalidade total = produto dos valores unicos de cada label. Cada combinacao = 1 serie no TSDB (~3KB de RAM).
        </div>
      </div>

      {/* Labels grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
        {CARDINALITY_LABELS.map(l => {
          const isSel = selected.has(l.id)
          return (
            <button
              key={l.id}
              onClick={() => toggle(l.id)}
              style={{
                padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
                background: isSel ? `${l.color}25` : CARD,
                border: `1.5px solid ${isSel ? l.color : LINE}`,
                textAlign: 'left', transition: 'all .15s', fontFamily: 'inherit',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: l.color, fontWeight: 700 }}>
                  {l.name}
                </span>
                {l.forbidden && <span style={{ fontSize: 9, color: RED, fontWeight: 700 }}>PROIBIDO</span>}
              </div>
              <div style={{ fontSize: 9, color: FGMUTE, marginBottom: 4, lineHeight: 1.4 }}>{l.example}</div>
              <div style={{ fontSize: 10, color: l.color, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                {fmt(l.values)} valores
              </div>
            </button>
          )
        })}
      </div>

      {/* Multiplicacao */}
      <div style={{ background: CARD, borderRadius: 10, padding: 16, marginBottom: 12, border: `1.5px solid ${danger ? RED : GRN}40` }}>
        <div style={{ fontSize: 10, color: FGMUTE, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.06em' }}>
          Cardinalidade total
        </div>

        {labels.length > 0 ? (
          <>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: FG, marginBottom: 10, lineHeight: 1.8 }}>
              {labels.map((l, i) => (
                <span key={l.id}>
                  <span style={{ color: l.color }}>{fmt(l.values)}</span>
                  {i < labels.length - 1 && <span style={{ color: FGMUTE }}> {'×'} </span>}
                </span>
              ))}
              <span style={{ color: FGMUTE }}> = </span>
              <span style={{ color: danger ? RED : GRN, fontWeight: 800, fontSize: 22 }}>
                {fmt(product)}
              </span>
              <span style={{ color: FGMUTE, fontSize: 11 }}> series</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              <div style={{ background: BG, borderRadius: 6, padding: 10 }}>
                <div style={{ fontSize: 9, color: FGMUTE, textTransform: 'uppercase', letterSpacing: '.06em' }}>RAM (head chunks)</div>
                <div style={{ fontSize: 16, color: danger ? RED : GRN, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
                  {memMb < 1 ? `${(memMb * 1024).toFixed(0)} KB` : memMb < 1024 ? `${memMb.toFixed(0)} MB` : `${(memMb / 1024).toFixed(1)} GB`}
                </div>
              </div>
              <div style={{ background: BG, borderRadius: 6, padding: 10 }}>
                <div style={{ fontSize: 9, color: FGMUTE, textTransform: 'uppercase', letterSpacing: '.06em' }}>Status</div>
                <div style={{ fontSize: 13, color: danger ? RED : GRN, fontWeight: 700 }}>
                  {danger ? 'EXPLOSAO' : product > 100_000 ? 'investigar' : 'saudavel'}
                </div>
              </div>
              <div style={{ background: BG, borderRadius: 6, padding: 10 }}>
                <div style={{ fontSize: 9, color: FGMUTE, textTransform: 'uppercase', letterSpacing: '.06em' }}>Recomendacao</div>
                <div style={{ fontSize: 11, color: FG, lineHeight: 1.4 }}>
                  {danger ? 'Remova labels PROIBIDAS' : product > 100_000 ? 'Cuidado com adicoes' : '< 1000 ideal por label'}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div style={{ fontSize: 12, color: FGMUTE, textAlign: 'center', padding: 20 }}>
            Selecione ao menos um label
          </div>
        )}
      </div>

      <div style={{ background: CARD, borderRadius: 10, padding: 14, border: `1px solid ${LINE}`, fontSize: 11, color: FG, lineHeight: 1.7 }}>
        <strong style={{ color: C }}>Regra de ouro:</strong> menos que 1000 valores unicos por label.
        IDs (user_id, request_id, session_id), URLs com parametros e IPs sao proibicoes absolutas — destroem o TSDB.
        Use <code style={{ color: SKY }}>relabel_configs</code> com <code style={{ color: SKY }}>action: drop</code> para remover labels problematicas no scrape.
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — Long-term Storage Architecture (LayerStack)
// ═══════════════════════════════════════════════════════════════════════════════

const STORAGE_LAYERS: Layer[] = [
  {
    id: 'local',
    label: 'Prometheus local',
    sublabel: 'Single-cluster, retencao 15 dias (default)',
    description: 'TSDB local em disco. Blocos de 2h sao compactados em blocos maiores. Sem replicacao, sem multi-cluster, sem long-term storage. Bom o suficiente para dev e clusters pequenos. Failover manual.',
    color: C,
    icon: '①',
    examples: ['retention.time = 15d default', 'storage.tsdb.path = /prometheus', 'WAL + head chunks + blocks de 2h'],
  },
  {
    id: 'remote',
    label: 'remote_write',
    sublabel: 'Push para storage compativel',
    description: 'Prometheus envia samples a um endpoint compativel (Mimir, Thanos Receive, VictoriaMetrics). Desacopla ingestion de storage. Permite alta disponibilidade — multiplos Prometheus escrevem para o mesmo backend.',
    color: SKY,
    icon: '②',
    examples: ['remote_write.url = https://mimir.example/api/v1/push', 'Throughput limitado pela rede', 'Backpressure via WAL local em caso de queda'],
  },
  {
    id: 'thanos',
    label: 'Thanos',
    sublabel: 'Sidecar + object storage + query federado',
    description: 'Sidecar por Prometheus envia blocos antigos para object storage (S3/GCS). Thanos Query agrega multiplos clusters e deduplica replicas. Compactor opcional otimiza retencao longa. Padrao para multi-cluster com retencao infinita.',
    color: AMB,
    icon: '③',
    examples: ['Sidecar: upload blocos S3', 'Query: PromQL federado entre clusters', 'Store Gateway: serve historico de S3', 'Compactor: down-sampling 5m / 1h'],
  },
  {
    id: 'mimir',
    label: 'Grafana Mimir',
    sublabel: 'Horizontalmente escalavel, multi-tenant',
    description: 'Compativel com remote_write Prometheus. Multi-tenant nativo (separa series por tenant_id). Distribuidor + ingester + querier + store-gateway + compactor. Fork open-source do Cortex pela Grafana Labs. Para grandes operacoes (centenas de milhoes de series ativas).',
    color: GRN,
    icon: '④',
    examples: ['Distributor recebe remote_write', 'Ingester escreve em object storage apos 2h', 'Querier le live (ingester) + historico (S3)', 'Multi-tenant com X-Scope-OrgID'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 7 — Anti-patterns (AntiPatternsGallery)
// ═══════════════════════════════════════════════════════════════════════════════

const PROM_ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'Summary em vez de Histogram para latencia',
    wrong: [
      [{ text: '// Summary calcula percentil no cliente', color: '#64748b' }],
      [{ text: 'const latency = new Summary({', color: '#e2e8f0' }],
      [{ text: '  name: "http_duration_seconds",', color: '#ef4444' }],
      [{ text: '  percentiles: [0.5, 0.95, 0.99],', color: '#ef4444' }],
      [{ text: '})', color: '#e2e8f0' }],
      [{ text: '// p99 nao agrega entre instancias!', color: '#64748b' }],
    ],
    right: [
      [{ text: '// Histogram permite agregacao server-side', color: '#64748b' }],
      [{ text: 'const latency = new Histogram({', color: '#e2e8f0' }],
      [{ text: '  name: "http_duration_seconds",', color: '#4ade80' }],
      [{ text: '  buckets: [0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],', color: '#4ade80' }],
      [{ text: '})', color: '#e2e8f0' }],
      [{ text: '// histogram_quantile agrega entre pods', color: '#64748b' }],
    ],
    why: 'Summary calcula percentil no processo cliente — voce nao consegue fazer sum() de p99 entre 5 pods e obter o p99 global. Histogram tem buckets cumulativos que sim podem ser agregados, e histogram_quantile() calcula o percentil correto sobre o conjunto.',
  },
  {
    title: 'Alerta sem clausula for',
    wrong: [
      [{ text: '- alert: ErrorRateAlto', color: '#ef4444' }],
      [{ text: '  expr: rate(errors_total[5m]) > 0.01', color: '#e2e8f0' }],
      [{ text: '  # SEM for: ! Dispara em qualquer spike', color: '#64748b' }],
      [{ text: '  labels: { severity: critical }', color: '#e2e8f0' }],
    ],
    right: [
      [{ text: '- alert: ErrorRateAlto', color: '#4ade80' }],
      [{ text: '  expr: rate(errors_total[5m]) > 0.01', color: '#e2e8f0' }],
      [{ text: '  for: 5m   # condicao precisa persistir 5 min', color: '#4ade80' }],
      [{ text: '  labels: { severity: critical }', color: '#e2e8f0' }],
    ],
    why: 'Sem for, o alerta dispara na primeira avaliacao (geralmente 1min) em qualquer spike momentaneo. Resultado: alert fatigue em menos de uma semana. Use for de 2-10min dependendo da urgencia. Multi-window burn rate eh ainda melhor para SLOs.',
  },
  {
    title: 'rate() com janela curta demais',
    wrong: [
      [{ text: '# scrape_interval = 15s', color: '#64748b' }],
      [{ text: 'rate(http_requests_total[30s])', color: '#ef4444' }],
      [{ text: '# 30s / 15s = 2 pontos -> NaN ou instavel', color: '#64748b' }],
    ],
    right: [
      [{ text: '# Regra: range >= 4x scrape_interval', color: '#64748b' }],
      [{ text: 'rate(http_requests_total[1m])', color: '#4ade80' }],
      [{ text: '# 1m / 15s = 4 pontos = minimo seguro', color: '#64748b' }],
      [{ text: 'rate(http_requests_total[5m])  # ideal', color: '#4ade80' }],
    ],
    why: 'rate() precisa de pelo menos 4 pontos para calcular taxa estavel. Com scrape_interval de 15s, a janela minima eh 60s (4x). Janelas menores produzem NaN ou taxas instaveis pois o Prometheus nao consegue interpolar com confianca.',
  },
  {
    title: 'Counter que decrementa',
    wrong: [
      [{ text: '// "contador" de sessoes ativas', color: '#64748b' }],
      [{ text: 'const sessions = new Counter({', color: '#ef4444' }],
      [{ text: '  name: "active_sessions",', color: '#ef4444' }],
      [{ text: '})', color: '#e2e8f0' }],
      [{ text: 'sessions.inc()  // login', color: '#e2e8f0' }],
      [{ text: 'sessions.dec()  // ERRO: Counter nao decrementa', color: '#ef4444' }],
    ],
    right: [
      [{ text: '// Sessoes ativas = estado atual = Gauge', color: '#64748b' }],
      [{ text: 'const sessions = new Gauge({', color: '#4ade80' }],
      [{ text: '  name: "active_sessions",', color: '#4ade80' }],
      [{ text: '})', color: '#e2e8f0' }],
      [{ text: 'sessions.inc()  // login', color: '#e2e8f0' }],
      [{ text: 'sessions.dec()  // logout (Gauge sobe e desce)', color: '#4ade80' }],
    ],
    why: 'Counter so cresce em runtime (so reseta no restart). Decrementar quebra a semantica e faz rate() produzir valores negativos. Se a metrica pode diminuir naturalmente (sessoes ativas, conexoes, fila), eh um Gauge — nao Counter.',
  },
  {
    title: 'Alta cardinalidade com user_id como label',
    wrong: [
      [{ text: '// 10M usuarios = 10M series temporais!', color: '#64748b' }],
      [{ text: 'http_requests.inc({', color: '#e2e8f0' }],
      [{ text: '  method: req.method,', color: '#e2e8f0' }],
      [{ text: '  user_id: req.user.id,  // PROIBIDO', color: '#ef4444' }],
      [{ text: '  request_id: req.id,    // PROIBIDO', color: '#ef4444' }],
      [{ text: '})', color: '#e2e8f0' }],
    ],
    right: [
      [{ text: '// Labels com baixa cardinalidade (< 1000 valores)', color: '#64748b' }],
      [{ text: 'http_requests.inc({', color: '#e2e8f0' }],
      [{ text: '  method: req.method,', color: '#4ade80' }],
      [{ text: '  status: String(res.statusCode),', color: '#4ade80' }],
      [{ text: '  route: req.route.path,  // template, nao path real', color: '#4ade80' }],
      [{ text: '})', color: '#e2e8f0' }],
      [{ text: '// user_id, request_id -> logs/traces, nao metricas', color: '#64748b' }],
    ],
    why: 'Cada combinacao unica de labels eh uma serie no TSDB (~3KB de RAM). user_id com 10M valores = 10M series por metrica. O Prometheus degrada exponencialmente. Para identificadores unicos, use logs estruturados ou traces — eles sao otimizados para alta cardinalidade.',
  },
  {
    title: 'Alertar em CPU em vez de sintoma',
    wrong: [
      [{ text: '- alert: CPUAlta', color: '#ef4444' }],
      [{ text: '  expr: cpu_usage > 0.9', color: '#e2e8f0' }],
      [{ text: '  for: 5m', color: '#e2e8f0' }],
      [{ text: '  # Acorda SRE as 3h por CPU alta', color: '#64748b' }],
      [{ text: '  # — sem evidencia de impacto no usuario', color: '#64748b' }],
    ],
    right: [
      [{ text: '- alert: SLOBurnRateCritico  # SINTOMA', color: '#4ade80' }],
      [{ text: '  expr: |', color: '#e2e8f0' }],
      [{ text: '    sli:availability:rate1h < (1 - 14 * 0.001) and', color: '#4ade80' }],
      [{ text: '    sli:availability:rate6h < (1 - 14 * 0.001)', color: '#4ade80' }],
      [{ text: '  for: 2m', color: '#e2e8f0' }],
      [{ text: '  # Use CPU/memoria APENAS para investigar causa', color: '#64748b' }],
    ],
    why: 'CPU 90% pode ser comportamento normal de um sistema bem otimizado. Alerte em sintomas (error rate, latencia, burn rate de SLO) — o que o usuario sente. Use metricas USE (CPU, memoria, disco) para diagnostico apos o alerta de RED disparar. Nunca acorde alguem pelo USE sem RED correlato.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// Componente principal
// ═══════════════════════════════════════════════════════════════════════════════

export default function PrometheusVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'histogram-buckets',
      title: 'Histogram Buckets',
      subtitle: 'Como histogram_quantile interpola percentil de buckets cumulativos',
      accent: C,
      component: <HistogramBucketsVisual />,
    },
    {
      id: 'pull-model',
      title: 'Pull Model & Service Discovery',
      subtitle: 'Kubernetes API descobre alvos -> scrape periodico -> TSDB -> alerting',
      accent: C,
      component: (
        <SequenceDiagram
          actors={SCRAPE_ACTORS}
          messages={SCRAPE_MESSAGES}
          groups={SCRAPE_GROUPS}
          accentColor={C}
          bgColor={BG}
          title="Pull Model — do Service Discovery ao Alerting"
          description="Como o Prometheus descobre, coleta e processa metricas em Kubernetes"
        />
      ),
    },
    {
      id: 'red-vs-use',
      title: 'RED vs USE',
      subtitle: 'Frameworks complementares: RED para servicos (sintoma), USE para recursos (causa)',
      accent: C,
      component: (
        <ComparisonTable
          options={FRAMEWORK_OPTIONS}
          criteria={FRAMEWORK_CRITERIA}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'multi-window-burn',
      title: 'Multi-window Burn Rate',
      subtitle: 'Como AND de janela curta E longa elimina falsos positivos sem atrasar alertas reais',
      accent: C,
      component: <MultiWindowBurnVisual />,
    },
    {
      id: 'cardinality',
      title: 'Cardinality Explosion',
      subtitle: 'Selecione labels e veja a explosao multiplicativa de series temporais no TSDB',
      accent: C,
      component: <CardinalityVisual />,
    },
    {
      id: 'long-term-storage',
      title: 'Long-term Storage',
      subtitle: 'Prometheus local -> remote_write -> Thanos / Grafana Mimir (multi-cluster)',
      accent: C,
      component: (
        <LayerStack
          layers={STORAGE_LAYERS}
          accentColor={C}
          bgColor={BG}
          direction="top-down"
        />
      ),
    },
    {
      id: 'antipatterns',
      title: 'Anti-patterns',
      subtitle: 'Summary, alerta sem for, rate window curta, Counter decrementando, cardinalidade, alerta em CPU',
      accent: RED,
      component: (
        <AntiPatternsGallery
          patterns={PROM_ANTIPATTERNS}
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
