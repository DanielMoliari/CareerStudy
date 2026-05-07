'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { StateMachineExplorer } from '@/components/visuals/StateMachineExplorer'
import type { SMState, SMTransition } from '@/components/visuals/StateMachineExplorer'
import { DecisionTree } from '@/components/visuals/DecisionTree'
import type { DTNode } from '@/components/visuals/DecisionTree'
import { CommandPalette } from '@/components/visuals/CommandPalette'
import type { CLICommand } from '@/components/visuals/CommandPalette'

// ── Paleta Grafana ────────────────────────────────────────────────────────────
const C      = '#F46800'   // Grafana orange
const C2     = '#c35200'   // secondary
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
// VISUAL 1 — Painel: qual usar? (ComparisonTable)
// ═══════════════════════════════════════════════════════════════════════════════

const PANEL_OPTIONS: ComparisonOption[] = [
  { id: 'timeseries', label: 'Time Series', sublabel: 'Linha temporal', color: C },
  { id: 'stat',       label: 'Stat',        sublabel: 'Valor único agora', color: GRN },
  { id: 'gauge',      label: 'Gauge',       sublabel: 'Valor vs threshold', color: AMB },
  { id: 'heatmap',    label: 'Heatmap',     sublabel: 'Distribuição no tempo', color: PRP },
  { id: 'logs',       label: 'Logs',        sublabel: 'Stream de logs', color: YLW },
  { id: 'table',      label: 'Table',       sublabel: 'Linhas tabulares', color: SKY },
]

const PANEL_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'main', label: 'Caso de uso principal', category: 'Quando usar',
    values: {
      timeseries: { rating: 'excellent', note: 'Métrica ao longo do tempo (rate, p99, error rate)' },
      stat:       { rating: 'excellent', note: 'Valor único: availability 30d, requests/s atuais' },
      gauge:      { rating: 'excellent', note: 'Error budget restante, % de SLO consumido' },
      heatmap:    { rating: 'excellent', note: 'histogram_quantile por bucket no tempo' },
      logs:       { rating: 'excellent', note: 'Stream do Loki com regex highlight' },
      table:      { rating: 'excellent', note: 'Top N (endpoints por error rate, slow queries)' },
    },
  },
  {
    id: 'data', label: 'Tipo de query ideal', category: 'Dado',
    values: {
      timeseries: { rating: 'excellent', note: 'rate(metric[5m]) — vetor temporal' },
      stat:       { rating: 'excellent', note: 'Reducer (last, mean, max) sobre série' },
      gauge:      { rating: 'good',      note: 'Valor entre 0-1 ou 0-100% com thresholds' },
      heatmap:    { rating: 'excellent', note: 'sum by (le) (rate(...bucket[5m]))' },
      logs:       { rating: 'excellent', note: 'LogQL — {service="api"} |= "ERROR"' },
      table:      { rating: 'good',      note: 'topk() ou query SQL com transformations' },
    },
  },
  {
    id: 'thresh', label: 'Thresholds visuais', category: 'Visual',
    values: {
      timeseries: { rating: 'good',      note: 'Linha horizontal opcional' },
      stat:       { rating: 'excellent', note: 'Cor do número muda por threshold' },
      gauge:      { rating: 'excellent', note: 'Semáforo nativo: vermelho/amarelo/verde' },
      heatmap:    { rating: 'fair',      note: 'Cor por intensidade — não threshold' },
      logs:       { rating: 'na',        note: 'Não aplicável' },
      table:      { rating: 'good',      note: 'Cell coloring por valor' },
    },
  },
  {
    id: 'pitfall', label: 'Armadilha mais comum', category: 'Cuidado',
    values: {
      timeseries: { rating: 'good',      note: 'Esquecer unit (s vs percentunit) — eixo vira nonsense' },
      stat:       { rating: 'fair',      note: 'Reducer errado — last em vez de mean num pico' },
      gauge:      { rating: 'fair',      note: 'Min/max errados — barra sempre cheia ou vazia' },
      heatmap:    { rating: 'poor',      note: 'Confundir com Time Series — heatmap precisa _bucket' },
      logs:       { rating: 'good',      note: 'Sem dedup — duplicatas inflam o painel' },
      table:      { rating: 'fair',      note: 'Faltou Transformation Reduce — N linhas em vez de 1' },
    },
  },
  {
    id: 'avoid', label: 'NUNCA use para...', category: 'Anti-uso',
    values: {
      timeseries: { rating: 'poor',      note: 'Snapshot atual (use Stat). Categórico (use Bar Chart).' },
      stat:       { rating: 'poor',      note: 'Tendência (use Time Series). Comparação (use Table).' },
      gauge:      { rating: 'poor',      note: 'Histórico. Múltiplos valores (use Bar Gauge).' },
      heatmap:    { rating: 'poor',      note: 'Métricas não-bucket. Latência média (use Time Series).' },
      logs:       { rating: 'poor',      note: 'Métricas. Use Time Series com rate() do log.' },
      table:      { rating: 'poor',      note: 'Séries temporais. Tendência (use Time Series).' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Alert State Machine
// ═══════════════════════════════════════════════════════════════════════════════

const ALERT_STATES: SMState[] = [
  { id: 'normal',  label: 'Normal',  description: 'Query OK, condição falsa. Estado padrão. Nenhum alerta sendo avaliado positivamente.', color: GRN, isInitial: true },
  { id: 'pending', label: 'Pending', description: 'Condição true, mas ainda dentro do período "for". Evita flapping em spikes curtos. Não dispara notificação.', color: AMB },
  { id: 'firing',  label: 'Firing',  description: 'Condição true por tempo >= for. Notificação enviada via notification policy. Aparece em alertas ativos.', color: RED },
  { id: 'nodata',  label: 'NoData',  description: 'Query não retornou pontos. Configurável: pode virar Firing (alerta) ou OK (sem dado = sem problema).', color: FGMUTE },
  { id: 'error',   label: 'Error',   description: 'Query falhou (datasource down, sintaxe inválida). Sinal de problema infra, não de SLI ruim.', color: PRP },
]

const ALERT_TRANSITIONS: SMTransition[] = [
  { from: 'normal',  to: 'pending', event: 'condição vira true', code: 'expr > threshold' },
  { from: 'pending', to: 'firing',  event: 'persistiu por "for"', code: 'for: 2m' },
  { from: 'pending', to: 'normal',  event: 'condição volta false', code: 'spike resolvido' },
  { from: 'firing',  to: 'normal',  event: 'condição volta false', code: 'incidente mitigado', guard: 'Resolved notification' },
  { from: 'normal',  to: 'nodata',  event: 'sem datapoints',      code: 'série some' },
  { from: 'nodata',  to: 'normal',  event: 'datapoints voltam' },
  { from: 'normal',  to: 'error',   event: 'query falhou',        code: 'datasource 5xx' },
  { from: 'error',   to: 'normal',  event: 'query OK',            code: 'datasource volta' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Variable Templating (componente custom)
// Mostra o chaining $env -> $service -> $pod e o impacto em PromQL
// ═══════════════════════════════════════════════════════════════════════════════

const ENV_OPTIONS = ['prod', 'staging', 'dev']
const SERVICE_BY_ENV: Record<string, string[]> = {
  prod:    ['checkout', 'payment', 'auth', 'inventory'],
  staging: ['checkout', 'payment', 'auth'],
  dev:     ['checkout', 'auth'],
}
const PODS_BY_SERVICE: Record<string, string[]> = {
  checkout:  ['checkout-7f8d-abc', 'checkout-7f8d-def', 'checkout-7f8d-ghi'],
  payment:   ['payment-9c2e-x', 'payment-9c2e-y'],
  auth:      ['auth-3a1b-1', 'auth-3a1b-2'],
  inventory: ['inventory-5d4-a'],
}

function VariableTemplatingVisual() {
  const [env, setEnv] = useState('prod')
  const [service, setService] = useState('checkout')
  const [pod, setPod] = useState<string | null>(null)

  const services = SERVICE_BY_ENV[env] ?? []
  const pods = PODS_BY_SERVICE[service] ?? []

  // garante que service ainda é válido para o env atual
  if (!services.includes(service) && services.length > 0) {
    setService(services[0])
  }

  const promql = `sum by (status) (
  rate(http_requests_total{
    env="${env}",
    service=${pod ? `"${service}"` : `~"${service}"`},${pod ? `\n    pod="${pod}",` : ''}
  }[5m])
)`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Toolbar de variables (top do dashboard) */}
      <div style={{
        background: CARD, borderRadius: 10, padding: 14, border: `1px solid ${LINE}`,
        display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
      }}>
        <div style={{ fontSize: 9, color: FGMUTE, letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 600 }}>
          Dashboard variables
        </div>

        {/* $env */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 9, color: C, fontFamily: "'JetBrains Mono', monospace" }}>$env</span>
          <select value={env} onChange={e => { setEnv(e.target.value); setPod(null) }}
            style={{
              background: BG, color: C, border: `1px solid ${C}66`, borderRadius: 6,
              padding: '6px 10px', fontSize: 12, fontFamily: "'JetBrains Mono', monospace", cursor: 'pointer',
            }}>
            {ENV_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <span style={{ fontSize: 9, color: FGMUTE }}>Custom: prod, staging, dev</span>
        </div>

        <span style={{ color: LINE, fontSize: 18 }}>{'>'}</span>

        {/* $service (depende de $env) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 9, color: C, fontFamily: "'JetBrains Mono', monospace" }}>$service</span>
          <select value={service} onChange={e => { setService(e.target.value); setPod(null) }}
            style={{
              background: BG, color: C, border: `1px solid ${C}66`, borderRadius: 6,
              padding: '6px 10px', fontSize: 12, fontFamily: "'JetBrains Mono', monospace", cursor: 'pointer',
            }}>
            {services.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <span style={{ fontSize: 9, color: FGMUTE }}>Query: label_values(up{'{'}env=&quot;$env&quot;{'}'}, service)</span>
        </div>

        <span style={{ color: LINE, fontSize: 18 }}>{'>'}</span>

        {/* $pod (depende de $service) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 9, color: C, fontFamily: "'JetBrains Mono', monospace" }}>$pod (multi)</span>
          <select value={pod ?? '__all__'}
            onChange={e => setPod(e.target.value === '__all__' ? null : e.target.value)}
            style={{
              background: BG, color: pod ? C : FGMUTE, border: `1px solid ${pod ? C : LINE}`, borderRadius: 6,
              padding: '6px 10px', fontSize: 12, fontFamily: "'JetBrains Mono', monospace", cursor: 'pointer', minWidth: 180,
            }}>
            <option value="__all__">All ({pods.length})</option>
            {pods.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <span style={{ fontSize: 9, color: FGMUTE }}>Query: label_values(...{'{'}service=&quot;$service&quot;{'}'}, pod)</span>
        </div>
      </div>

      {/* Resultado: PromQL gerado */}
      <div style={{
        background: CARD2, borderRadius: 10, padding: 16, border: `1px solid ${C}33`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C, letterSpacing: '.08em', textTransform: 'uppercase' }}>
            PromQL gerado pelo painel
          </div>
          <div style={{ fontSize: 10, color: FGMUTE }}>
            {pod
              ? <>filtro exato: <code style={{ color: GRN }}>pod=&quot;{pod}&quot;</code></>
              : <>regex match: <code style={{ color: AMB }}>service=~&quot;$service&quot;</code> (multi-value safe)</>}
          </div>
        </div>
        <pre style={{
          margin: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: FG,
          lineHeight: 1.7, whiteSpace: 'pre-wrap',
        }}>{promql}</pre>
      </div>

      {/* Chaining explanation */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ background: CARD, borderRadius: 10, padding: 14, border: `1px solid ${LINE}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: GRN, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 8 }}>
            Variable chaining
          </div>
          <div style={{ fontSize: 12, color: FG, lineHeight: 1.7 }}>
            Mudou <code style={{ color: C }}>$env</code> de prod para staging {'->'} a lista de <code style={{ color: C }}>$service</code> recalcula
            via <code style={{ color: SKY }}>label_values(up{'{'}env=&quot;$env&quot;{'}'}, service)</code>. Isso é <strong>chaining</strong> — variáveis dependem umas das outras.
          </div>
        </div>
        <div style={{ background: CARD, borderRadius: 10, padding: 14, border: `1px solid ${LINE}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: AMB, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 8 }}>
            Multi-value: regex obrigatório
          </div>
          <div style={{ fontSize: 12, color: FG, lineHeight: 1.7 }}>
            Quando $service permite multi-select, a query precisa de <code style={{ color: AMB }}>service=~&quot;$service&quot;</code> (regex match)
            em vez de <code style={{ color: RED }}>service=&quot;$service&quot;</code> (exact). Senão Grafana injeta &quot;a|b|c&quot; literalmente.
          </div>
        </div>
      </div>

      {/* Tipos de variable */}
      <div style={{ background: CARD, borderRadius: 10, padding: 16, border: `1px solid ${LINE}` }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: FGMUTE, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 10 }}>
          Tipos de variable disponíveis
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            { name: 'Query',    desc: 'Popula via PromQL/LogQL — label_values()', color: C },
            { name: 'Custom',   desc: 'Lista fixa: prod,staging,dev', color: GRN },
            { name: 'Constant', desc: 'Valor fixo invisível (provisioning)', color: FGMUTE },
            { name: 'Datasource', desc: 'Troca a fonte do dashboard inteiro', color: PRP },
            { name: 'Interval', desc: 'Janela: 1m,5m,1h — usado em rate([$interval])', color: AMB },
            { name: 'Ad hoc filters', desc: 'Filtros aplicados a TODAS as queries automaticamente', color: SKY },
          ].map(t => (
            <div key={t.name} style={{ background: BG, borderRadius: 6, padding: 10, border: `1px solid ${LINE}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: t.color, marginBottom: 4 }}>{t.name}</div>
              <div style={{ fontSize: 10, color: FGMUTE, lineHeight: 1.5 }}>{t.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Investigation Workflow (componente custom)
// Sequencial: alerta -> dashboard -> exemplar -> trace -> log -> rollback
// ═══════════════════════════════════════════════════════════════════════════════

const WORKFLOW_STEPS = [
  {
    id: 0, time: '14:32:12', actor: 'Slack #platform-oncall', color: RED,
    title: 'Alerta dispara',
    desc: 'Notification policy roteou por labels (team=platform, severity=critical) para o contact_point Slack.',
    detail: 'expr: burn_rate_1h > 14 AND burn_rate_6h > 14\nfor: 2m\nlabels: severity=critical, team=platform',
    link: 'Notification Policies do Grafana Alerting',
  },
  {
    id: 1, time: '14:32:45', actor: 'Dashboard SLO', color: C,
    title: 'Spike de p99 + drop de availability',
    desc: 'Availability caiu de 99.95% para 97.8%. P99 saltou de 280ms para 4.2s. Annotation marca deploy v2.4.1 às 14:28.',
    detail: 'annotation: deploy checkout v2.4.1 (4 min antes do alerta)',
    link: 'Annotations via webhook do CI',
  },
  {
    id: 2, time: '14:33:20', actor: 'Tempo (via exemplar)', color: SKY,
    title: 'Exemplar -> trace específico',
    desc: 'Diamante amarelo no painel de p99 às 14:32:08. Clique abre o trace 4bf92f...4736 no Tempo.',
    detail: 'trace_id: 4bf92f...4736 (4.1s total)\n  POST /pay (4.1s)\n    stripe.charge (3.8s) ERROR 503',
    link: 'exemplarTraceIdDestinations no datasource Prometheus',
  },
  {
    id: 3, time: '14:34:05', actor: 'Loki (via tracesToLogsV2)', color: YLW,
    title: 'Trace -> logs filtrados',
    desc: 'Botão "View logs" no span abre Loki com filtro pelo trace_id.',
    detail: '{service="checkout"} | json | trace_id="4bf92f..."\n  ERR stripe API 503 (attempt 8/8)\n  WARN retry stripe.charge after 503',
    link: 'tracesToLogsV2 no datasource Tempo',
  },
  {
    id: 4, time: '14:35:00', actor: 'Diagnóstico cross-source', color: PRP,
    title: 'Causa identificada',
    desc: 'Stripe outage regional + circuit breaker desativado no v2.4.1. Status page externo confirma.',
    detail: 'Combinação: outage + retries cascateados saturam pool de conexões',
    link: 'Status page integration via annotations',
  },
  {
    id: 5, time: '14:38:30', actor: 'Mitigação', color: GRN,
    title: 'Rollback v2.4.1 -> v2.4.0',
    desc: 'Error rate volta a 0.3% em 90s. Annotation de rollback no dashboard. Postmortem agendado.',
    detail: 'availability 30d: 99.93% (SLO 99.9% OK)\nerror budget restante: 9%',
    link: 'Tempo total: ~6 min (alerta -> rollback)',
  },
]

function InvestigationWorkflowVisual() {
  const [active, setActive] = useState(0)
  const step = WORKFLOW_STEPS[active]

  return (
    <div style={{ display: 'flex', gap: 16, minHeight: 540 }}>
      {/* Timeline esquerda */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: 240, flexShrink: 0 }}>
        <div style={{ fontSize: 10, color: FGMUTE, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 6, paddingLeft: 4, fontWeight: 600 }}>
          Linha do tempo do incidente
        </div>
        {WORKFLOW_STEPS.map((s, i) => {
          const isActive = active === i
          return (
            <button key={s.id} onClick={() => setActive(i)}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px',
                borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                background: isActive ? `${s.color}20` : CARD,
                border: `1.5px solid ${isActive ? s.color : LINE}`,
                transition: 'all 0.15s',
              }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%',
                background: BG, border: `1.5px solid ${s.color}`,
                color: s.color, fontWeight: 700, fontSize: 11,
                fontFamily: "'JetBrains Mono', monospace",
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>{i + 1}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 9, color: FGMUTE, fontFamily: "'JetBrains Mono', monospace" }}>{s.time}</div>
                <div style={{ fontSize: 11, color: isActive ? s.color : FG, fontWeight: 600, marginTop: 2, lineHeight: 1.3 }}>{s.title}</div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Painel direito */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ background: CARD, borderRadius: 12, padding: 18, border: `1.5px solid ${step.color}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{
              fontSize: 10, fontWeight: 700, color: step.color, fontFamily: "'JetBrains Mono', monospace",
              padding: '4px 10px', background: `${step.color}20`, borderRadius: 6,
              border: `1px solid ${step.color}40`,
            }}>{step.time}</div>
            <div style={{ fontSize: 11, color: FGMUTE }}>em <strong style={{ color: FG }}>{step.actor}</strong></div>
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: step.color, marginBottom: 8 }}>{step.title}</div>
          <div style={{ fontSize: 13, color: FG, lineHeight: 1.7, marginBottom: 12 }}>{step.desc}</div>
          <pre style={{
            margin: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: FGMUTE,
            background: BG, padding: 10, borderRadius: 6, border: `1px solid ${LINE}`,
            lineHeight: 1.6, whiteSpace: 'pre-wrap',
          }}>{step.detail}</pre>
        </div>

        <div style={{ background: CARD2, borderRadius: 8, padding: 12, border: `1px solid ${LINE}` }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: step.color, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 6 }}>
            Configuração do Grafana que torna isso possível
          </div>
          <div style={{ fontSize: 12, color: FG, lineHeight: 1.55 }}>{step.link}</div>
        </div>

        {/* Insight final só no último step */}
        {active === WORKFLOW_STEPS.length - 1 && (
          <div style={{ background: `${C}10`, borderRadius: 8, padding: 14, border: `1.5px solid ${C}44` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C, marginBottom: 6 }}>
              Por que esse workflow só funciona com LGTM correlacionado
            </div>
            <div style={{ fontSize: 12, color: FG, lineHeight: 1.7 }}>
              Sem exemplars, tracesToLogsV2 e derivedFields, você abriria 3 sistemas separados, copiaria timestamps na mão e
              faria grep em logs por chute. <strong style={{ color: C }}>Os 3 saltos correlacionados</strong> (métrica {'>'} trace {'>'} log) fazem o
              MTTR cair de horas para minutos.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — PromQL/LogQL/TraceQL Command Palette
// ═══════════════════════════════════════════════════════════════════════════════

const QUERY_COMMANDS: CLICommand[] = [
  // PromQL
  {
    command: 'rate(http_requests_total[5m])',
    description: 'Taxa de counter por segundo na janela de 5min — base de qualquer SLI de tráfego',
    output: '{job="api", status="200"}  142.3\n{job="api", status="500"}    0.8\n{job="api", status="404"}    3.1',
    outputType: 'text',
    category: 'PromQL — Métricas',
    flags: [
      { flag: 'janela', description: '[5m] curto = reativo, [1h] longo = suave' },
      { flag: 'antipattern', description: 'NUNCA aplique rate() em gauge — só counter' },
    ],
  },
  {
    command: 'histogram_quantile(0.99, sum by (le) (rate(http_request_duration_bucket[5m])))',
    description: 'P99 de latência — sempre com sum BY le ANTES de quantile, agrega entre instâncias',
    output: '{service="checkout"}  4.2\n{service="auth"}      0.085\n{service="payment"}   0.230',
    outputType: 'text',
    category: 'PromQL — Métricas',
    flags: [
      { flag: 'le', description: 'Label "less or equal" — define os buckets do histogram' },
      { flag: 'pegadinha', description: 'Sem sum BY le, Grafana mostra p99 por instância (ruim)' },
    ],
  },
  {
    command: 'sum by (status) (rate(http_requests_total[5m]))',
    description: 'Agrega por dimensão mantendo a label status — base para gráfico de RED metrics',
    output: '{status="200"}  234.5\n{status="500"}    1.2\n{status="404"}    8.4',
    outputType: 'text',
    category: 'PromQL — Métricas',
    flags: [
      { flag: 'sum by', description: 'Mantém a label especificada, descarta o resto' },
      { flag: 'sum without', description: 'Inverso: mantém todas exceto a especificada' },
    ],
  },
  {
    command: 'increase(errors_total[1h])',
    description: 'Total absoluto de incremento na janela — para alertas tipo "X erros em Y minutos"',
    output: '{job="api"}  142  (últimas 1h)',
    outputType: 'text',
    category: 'PromQL — Métricas',
    flags: [
      { flag: 'use', description: 'Alerta: increase(errors[5m]) > 100' },
      { flag: 'rate', description: 'Para taxa por segundo, prefira rate()' },
    ],
  },
  // LogQL
  {
    command: '{service="api", env="prod", level="error"}',
    description: 'Stream selector — filtra por LABELS indexadas (rápido, baixo custo no Loki)',
    output: '2024-05-06T14:32:08 ERR payment timeout (trace_id=4bf92f...)\n2024-05-06T14:32:09 ERR stripe 5xx (trace_id=4bf92f...)',
    outputType: 'text',
    category: 'LogQL — Logs',
    flags: [
      { flag: 'rule', description: 'Labels: service, env, level. NUNCA user_id, request_id' },
      { flag: 'cardinality', description: 'Labels com cardinalidade alta explodem custo' },
    ],
  },
  {
    command: '{service="api"} |= "ERROR" != "health-check"',
    description: 'Line filter — busca textual no conteúdo do log (após o stream selector)',
    output: '|=  contém\n!=  não contém\n|~  regex match\n!~  regex non-match',
    outputType: 'text',
    category: 'LogQL — Logs',
    flags: [
      { flag: 'ordem', description: 'Stream selector PRIMEIRO, line filters DEPOIS' },
      { flag: 'caso', description: '|= é case-sensitive — use |~ "(?i)error" para insensitive' },
    ],
  },
  {
    command: '{service="api"} | json | status_code >= 500',
    description: 'Parser json + filtro de label extraído — converte campo JSON em label queryable',
    output: 'extracted: status_code=503, latency_ms=4200, trace_id=4bf...\nfilter: status_code >= 500 -> 12 logs',
    outputType: 'text',
    category: 'LogQL — Logs',
    flags: [
      { flag: 'parsers', description: 'json, logfmt, pattern, regexp' },
      { flag: 'cuidado', description: 'unwrap field só funciona em campo numérico' },
    ],
  },
  {
    command: 'rate({service="api"} |= "ERROR" [5m])',
    description: 'Métrica derivada de log — conta linhas/segundo, igual rate() de counter',
    output: '{service="api", env="prod"}  0.42 errors/s',
    outputType: 'text',
    category: 'LogQL — Logs',
    flags: [
      { flag: 'use', description: 'SLI quando não tem métrica equivalente' },
      { flag: 'custo', description: 'Mais lento que PromQL — escaneia chunks no S3' },
    ],
  },
  // TraceQL
  {
    command: '{ trace:id = "4bf92f3577b34da6" }',
    description: 'Lookup direto por trace_id — instantâneo (chunk lookup no S3, sem índice)',
    output: 'trace_id=4bf92f...4736  duration=4.1s\n  POST /pay        4.1s\n    stripe.charge  3.8s ERROR',
    outputType: 'text',
    category: 'TraceQL — Traces',
    flags: [
      { flag: 'origem', description: 'trace_id vem de logs ou exemplars' },
      { flag: 'velocidade', description: 'Único caso onde Tempo é mais rápido que Jaeger' },
    ],
  },
  {
    command: '{ resource.service.name = "checkout" && status = error }',
    description: 'Spans de erro num serviço — mais lento que trace:id (escaneia blocos)',
    output: '47 traces match\n  trace_id=4bf...  status=error\n  trace_id=8a2...  status=error',
    outputType: 'text',
    category: 'TraceQL — Traces',
    flags: [
      { flag: 'atributos', description: 'Semantic Conventions: resource.*, span.*, status' },
      { flag: 'AND', description: '&& combina filtros no MESMO span' },
    ],
  },
  {
    command: '{ duration > 1s && span.http.method = "POST" }',
    description: 'Spans HTTP POST mais lentos que 1s — encontra outliers de latência',
    output: '12 spans match\n  POST /pay     4.1s\n  POST /order   1.8s\n  POST /cart    1.2s',
    outputType: 'text',
    category: 'TraceQL — Traces',
    flags: [
      { flag: 'duration', description: 'Aceita 1ms, 1s, 1m — sintaxe humana' },
      { flag: 'combinar', description: 'Combine com service.name para focar' },
    ],
  },
  {
    command: '{ status = error } && { span.db.system = "postgresql" && duration > 500ms }',
    description: 'Trace com erro E span de DB lento — multi-span query (Tempo 2.x)',
    output: '4 traces match — todos com erro de timeout no app\nE query lenta no Postgres no mesmo trace',
    outputType: 'text',
    category: 'TraceQL — Traces',
    flags: [
      { flag: 'multi-span', description: '&& entre {} = spans diferentes do mesmo trace' },
      { flag: 'use', description: 'Encontrar correlações entre erro e causa' },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — Decision Tree: Cloud vs Self-hosted LGTM
// ═══════════════════════════════════════════════════════════════════════════════

const STACK_ROOT: DTNode = {
  id: 'start',
  question: 'Quantos engenheiros tem o time hoje?',
  children: [
    { label: 'Menos de 20', nodeId: 'small-team', color: GRN },
    { label: '20 a 50',     nodeId: 'medium-team', color: AMB },
    { label: 'Mais de 50',  nodeId: 'large-team',  color: PRP },
  ],
}

const STACK_NODES: Record<string, DTNode> = {
  'small-team': {
    id: 'small-team',
    question: 'Volume de telemetria estimado: cabe no free tier do Grafana Cloud (10k séries / 50GB logs)?',
    children: [
      { label: 'Sim — caberia', nodeId: 'cloud-free', color: GRN },
      { label: 'Não — vai estourar', nodeId: 'check-budget-small', color: AMB },
    ],
  },
  'cloud-free': {
    id: 'cloud-free',
    recommendation: 'Grafana Cloud (Free tier)',
    detail: 'Time pequeno + volume baixo: zero operação, free tier cobre tudo. Em até 6 meses você sabe se vai estourar e pode migrar com calma. Não invente complexidade que ainda não precisa.',
    color: GRN,
    icon: 'cloud',
  },
  'check-budget-small': {
    id: 'check-budget-small',
    question: 'Tem ~USD 500-2k/mês de orçamento para observabilidade?',
    children: [
      { label: 'Sim',  nodeId: 'cloud-paid',     color: GRN },
      { label: 'Não',  nodeId: 'self-host-cheap', color: AMB },
    ],
  },
  'cloud-paid': {
    id: 'cloud-paid',
    recommendation: 'Grafana Cloud (Pro tier)',
    detail: 'Time pequeno não tem capacidade para operar LGTM em produção. USD 500-2k/mês é mais barato que ter 1 SRE dedicado a isso. Foque em construir produto.',
    color: GRN,
    icon: 'cash',
  },
  'self-host-cheap': {
    id: 'self-host-cheap',
    recommendation: 'Self-host MINIMAL (Prometheus + Loki + Grafana, sem Tempo/Mimir)',
    detail: 'Sem budget e volume estourando: pule Tempo e Mimir inicialmente. Prometheus + Loki + Grafana num k8s pequeno cobre 80% dos casos. Adicione tracing depois com OTel + Jaeger se precisar.',
    color: AMB,
    icon: 'budget',
  },
  'medium-team': {
    id: 'medium-team',
    question: 'Já tem Kubernetes em produção e algum SRE/Platform engineer?',
    children: [
      { label: 'Sim — temos K8s + SRE', nodeId: 'self-host-full', color: GRN },
      { label: 'Não — sem K8s ou sem SRE', nodeId: 'cloud-paid', color: SKY },
    ],
  },
  'self-host-full': {
    id: 'self-host-full',
    recommendation: 'Self-hosted LGTM completo (kube-prometheus-stack + Loki + Tempo + Mimir)',
    detail: 'Time médio com K8s e SRE: self-host LGTM via kube-prometheus-stack + Loki + Tempo + Mimir é 5-10x mais barato que Cloud em volume médio. Operação é viável com 1-2 engenheiros parciais. Use object storage (S3) para reter longos períodos.',
    color: GRN,
    icon: 'stack',
  },
  'large-team': {
    id: 'large-team',
    question: 'Tem requisitos de compliance (dados não saem da região, SOC2, multi-tenant)?',
    children: [
      { label: 'Sim — compliance estrito', nodeId: 'self-host-mimir', color: PRP },
      { label: 'Não — flexível', nodeId: 'hybrid', color: SKY },
    ],
  },
  'self-host-mimir': {
    id: 'self-host-mimir',
    recommendation: 'Self-hosted LGTM com Mimir multi-tenant + RBAC enterprise',
    detail: 'Empresa grande com compliance: self-host obrigatório. Mimir multi-tenant via X-Scope-OrgID isola dados por BU/cliente. Grafana Enterprise para RBAC granular e SSO SAML. Reverse proxy com mTLS. Custo de operação justifica-se pela escala.',
    color: PRP,
    icon: 'lock',
  },
  'hybrid': {
    id: 'hybrid',
    recommendation: 'Híbrido: self-host produção + Grafana Cloud para staging/dev',
    detail: 'Empresa grande sem compliance estrito: rode produção self-hosted (controle de custo em volume alto) e use Grafana Cloud free tier para staging/dev (zero operação para ambientes não-críticos). Equipes de produto têm acesso instantâneo sem ticket de SRE.',
    color: SKY,
    icon: 'hybrid',
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 7 — Datasources Comparison (LGTM vs alternativas)
// ═══════════════════════════════════════════════════════════════════════════════

const DS_OPTIONS: ComparisonOption[] = [
  { id: 'loki',     label: 'Loki',          sublabel: 'Logs (LGTM)', color: YLW },
  { id: 'es',       label: 'Elasticsearch', sublabel: 'Logs',        color: '#fec514' },
  { id: 'tempo',    label: 'Tempo',         sublabel: 'Traces (LGTM)', color: SKY },
  { id: 'jaeger',   label: 'Jaeger',        sublabel: 'Traces',       color: '#66cfdc' },
  { id: 'mimir',    label: 'Mimir',         sublabel: 'Métricas (LGTM)', color: '#e6522c' },
  { id: 'prom',     label: 'Prometheus',    sublabel: 'Métricas',     color: '#e6522c' },
]

const DS_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'tipo', label: 'Tipo de telemetria', category: 'Identidade',
    values: {
      loki:   { rating: 'excellent', note: 'Logs estruturados/não-estruturados' },
      es:     { rating: 'excellent', note: 'Logs + busca textual rica' },
      tempo:  { rating: 'excellent', note: 'Distributed tracing' },
      jaeger: { rating: 'excellent', note: 'Distributed tracing' },
      mimir:  { rating: 'excellent', note: 'Métricas (compatível Prometheus)' },
      prom:   { rating: 'excellent', note: 'Métricas time-series' },
    },
  },
  {
    id: 'storage', label: 'Backend de storage', category: 'Arquitetura',
    values: {
      loki:   { rating: 'excellent', note: 'S3/GCS — só labels indexados, conteúdo em chunks' },
      es:     { rating: 'fair',      note: 'Cluster próprio com índice invertido completo' },
      tempo:  { rating: 'excellent', note: 'S3/GCS — sem índice de atributos' },
      jaeger: { rating: 'fair',      note: 'Cassandra ou Elasticsearch' },
      mimir:  { rating: 'excellent', note: 'S3/GCS multi-tenant — retenção em anos' },
      prom:   { rating: 'fair',      note: 'TSDB local — limite de retenção/escala' },
    },
  },
  {
    id: 'cost', label: 'Custo (mesmo volume)', category: 'Operação',
    values: {
      loki:   { rating: 'excellent', note: '~10x mais barato que ES (só labels indexados)' },
      es:     { rating: 'poor',      note: 'Caro de operar — RAM e disk hungry' },
      tempo:  { rating: 'excellent', note: '~10x mais barato que Jaeger+ES' },
      jaeger: { rating: 'fair',      note: 'Caro com ES backend, médio com Cassandra' },
      mimir:  { rating: 'good',      note: 'Mais caro que Prom mas escala horizontal' },
      prom:   { rating: 'excellent', note: 'Operação simples, retenção curta sai barato' },
    },
  },
  {
    id: 'query', label: 'Query language', category: 'API',
    values: {
      loki:   { rating: 'good',      note: 'LogQL — PromQL-like, +parsers (json, logfmt)' },
      es:     { rating: 'excellent', note: 'Lucene + KQL — busca textual rica, fuzzy, facets' },
      tempo:  { rating: 'good',      note: 'TraceQL — busca por atributo + duration + status' },
      jaeger: { rating: 'fair',      note: 'UI-driven — query simples por service+operation+tag' },
      mimir:  { rating: 'excellent', note: 'PromQL 100% compatível' },
      prom:   { rating: 'excellent', note: 'PromQL — padrão da indústria' },
    },
  },
  {
    id: 'best', label: 'Melhor caso de uso', category: 'Quando usar',
    values: {
      loki:   { rating: 'excellent', note: 'Times com OTel + Prometheus, busca por service/env' },
      es:     { rating: 'excellent', note: 'SIEM, security analytics, busca textual frequente' },
      tempo:  { rating: 'excellent', note: 'Workflow já tem trace_id (logs/exemplars)' },
      jaeger: { rating: 'good',      note: 'Discovery exploratório de spans sem trace_id' },
      mimir:  { rating: 'excellent', note: 'Multi-tenant, retenção longa, multi-cluster federation' },
      prom:   { rating: 'excellent', note: 'Cluster único, retenção 15-30d' },
    },
  },
  {
    id: 'integration', label: 'Integra com Grafana', category: 'Ecossistema',
    values: {
      loki:   { rating: 'excellent', note: 'Native + tracesToLogsV2 + derivedFields' },
      es:     { rating: 'good',      note: 'Plugin oficial — funcional, sem correlação OTel' },
      tempo:  { rating: 'excellent', note: 'Native + exemplars + tracesToMetrics + serviceMap' },
      jaeger: { rating: 'good',      note: 'Plugin oficial — sem exemplars nativos' },
      mimir:  { rating: 'excellent', note: 'API Prometheus — drop-in replacement' },
      prom:   { rating: 'excellent', note: 'Padrão de fato do Grafana' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// Componente principal
// ═══════════════════════════════════════════════════════════════════════════════

export default function GrafanaVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'panel-types',
      title: 'Tipos de painel — qual usar?',
      subtitle: 'Time series, stat, gauge, heatmap, logs, table — o que cada um faz e a armadilha mais comum',
      accent: C,
      component: (
        <ComparisonTable
          options={PANEL_OPTIONS}
          criteria={PANEL_CRITERIA}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'alert-states',
      title: 'Estados de um alerta',
      subtitle: 'Normal -> Pending -> Firing — e por que o "for" existe para evitar flapping',
      accent: C,
      component: (
        <StateMachineExplorer
          states={ALERT_STATES}
          transitions={ALERT_TRANSITIONS}
          initialState="normal"
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'variables',
      title: 'Variables e templating',
      subtitle: 'Como $env -> $service -> $pod fazem chaining e o impacto direto no PromQL final',
      accent: C,
      component: <VariableTemplatingVisual />,
    },
    {
      id: 'workflow',
      title: 'Workflow de investigação — alerta ao rollback',
      subtitle: 'O caminho real numa sexta-feira 14h32: Slack -> dashboard -> exemplar -> trace -> log -> rollback em 6 min',
      accent: C,
      component: <InvestigationWorkflowVisual />,
    },
    {
      id: 'queries',
      title: 'PromQL, LogQL e TraceQL — terminal interativo',
      subtitle: 'As queries mais usadas em dashboards Grafana — busca, filtre por categoria, leia a saída',
      accent: C,
      component: (
        <CommandPalette
          commands={QUERY_COMMANDS}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          title="Queries Grafana"
          description="Digite 'rate', 'histogram', 'json' ou 'trace' para filtrar"
          placeholder="rate, histogram_quantile, |= ERROR, trace:id ..."
        />
      ),
    },
    {
      id: 'stack',
      title: 'Cloud vs Self-hosted LGTM — árvore de decisão',
      subtitle: 'Tamanho do time, volume e compliance: a recomendação muda em cada cenário',
      accent: C,
      component: (
        <DecisionTree
          root={STACK_ROOT}
          nodes={STACK_NODES}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'datasources',
      title: 'Loki vs ES, Tempo vs Jaeger, Mimir vs Prometheus',
      subtitle: 'O LGTM stack contra alternativas: storage, custo, query language e melhor caso de uso',
      accent: C,
      component: (
        <ComparisonTable
          options={DS_OPTIONS}
          criteria={DS_CRITERIA}
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
