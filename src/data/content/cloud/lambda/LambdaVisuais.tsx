'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { StateMachineExplorer } from '@/components/visuals/StateMachineExplorer'
import type { SMState, SMTransition } from '@/components/visuals/StateMachineExplorer'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { DecisionTree } from '@/components/visuals/DecisionTree'
import type { DTNode } from '@/components/visuals/DecisionTree'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'

// ── Paleta Lambda (AWS) ───────────────────────────────────────────────────────
const C      = '#FF9900'
const SEC    = '#cc7a00'
const BG     = '#0f172a'
const CARD   = '#1e293b'
const CARD2  = '#243044'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#4ade80'
const RED    = '#ef4444'
const SKY    = '#38bdf8'
const PRP    = '#a78bfa'
const AMB    = '#f59e0b'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Cold Start Anatomy (custom phases visualization)
// Justificativa: cold start é o conceito mais cobrado e mal compreendido em
// Lambda. Ver as 3 fases (Init/Invoke/Shutdown) com tempos relativos e o que
// roda em cada uma é radicalmente mais didático que descrição linear.
// ═══════════════════════════════════════════════════════════════════════════════

type ColdStartPhase = {
  id: string
  emoji: string
  name: string
  shortLabel: string
  duration: string
  durationPct: number
  color: string
  steps: Array<{ title: string; detail: string }>
  optimization: string
  occursOn: 'cold' | 'always'
}

const COLD_START_PHASES: ColdStartPhase[] = [
  {
    id: 'init',
    emoji: '①',
    name: 'INIT PHASE',
    shortLabel: 'Init',
    duration: '100 ms – 5 s+',
    durationPct: 65,
    color: AMB,
    occursOn: 'cold',
    steps: [
      { title: 'Download do código', detail: 'AWS baixa o ZIP ou container image. Pacote maior = download mais lento. Container de 1 GB pode levar 1-2 s só nessa etapa.' },
      { title: 'Inicialização do runtime', detail: 'JVM (Java) ou CLR (.NET): pesado, 1-3 s. Node.js / Python: leve, 50-150 ms. Vai (compilado): muito leve, &lt;50 ms.' },
      { title: 'Execução do código global', detail: 'Tudo fora do handler: imports, instanciação de SDK, conexão de DB, leitura de Secrets. É aqui que Spring Boot leva 5-10 s — frameworks pesados.' },
    ],
    optimization: 'Use bundler (esbuild) para minimizar pacote. Inicialize SDKs e conexões aqui — são reutilizados em invocações warm.',
  },
  {
    id: 'invoke',
    emoji: '②',
    name: 'INVOKE PHASE',
    shortLabel: 'Invoke',
    duration: 'seu código',
    durationPct: 30,
    color: GRN,
    occursOn: 'always',
    steps: [
      { title: 'Handler executa', detail: 'O handler(event, context) recebe o evento e processa. Acessa recursos inicializados no init (DB pool, SDK clients, cache).' },
      { title: 'Retorna resposta', detail: 'Síncrono retorna ao chamador. Assíncrono apenas confirma execução. SQS marca mensagem como deletada se sem erro.' },
    ],
    optimization: 'Mantenha o handler enxuto — toda lógica de inicialização cara deve estar no Init Phase para reutilização.',
  },
  {
    id: 'shutdown',
    emoji: '③',
    name: 'SHUTDOWN PHASE',
    shortLabel: 'Shutdown',
    duration: 'até 500 ms',
    durationPct: 5,
    color: PRP,
    occursOn: 'cold',
    steps: [
      { title: 'Extensions têm tempo extra', detail: 'Lambda Extensions (Datadog, New Relic, observabilidade) têm até 2 s para enviar dados de telemetria após o handler retornar.' },
      { title: 'Container congelado ou destruído', detail: 'Se a função recebeu invocações recentes, container é congelado para reuso (warm). Sem invocações por ~5-15 min, container é destruído.' },
    ],
    optimization: 'Use Lambda Extensions para enviar logs sem bloquear o handler. Telemetria não impacta latência percebida pelo cliente.',
  },
]

function ColdStartAnatomyVisual() {
  const [sel, setSel] = useState<string>('init')
  const active = COLD_START_PHASES.find(p => p.id === sel)!

  return (
    <div style={{ background: BG, border: `1px solid ${LINE}`, borderRadius: 14, padding: 24, fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ marginBottom: 18 }}>
        <h3 style={{ color: FG, margin: 0, fontSize: 16, fontWeight: 800 }}>Anatomia do Cold Start Lambda</h3>
        <p style={{ color: FGMUTE, fontSize: 12, margin: '4px 0 0' }}>O que acontece antes do seu código rodar — clique nas fases para detalhes.</p>
      </div>

      {/* Barra com fases proporcionais */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', height: 56, borderRadius: 10, overflow: 'hidden', border: `1px solid ${LINE}`, marginBottom: 10 }}>
          {COLD_START_PHASES.map(p => {
            const isSel = p.id === sel
            return (
              <button
                key={p.id}
                onClick={() => setSel(p.id)}
                style={{
                  flex: p.durationPct,
                  background: isSel ? `${p.color}30` : `${p.color}10`,
                  border: 'none',
                  borderRight: `1px solid ${LINE}`,
                  cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'inherit',
                  transition: 'all .2s',
                  position: 'relative',
                }}
              >
                <div style={{ color: p.color, fontSize: 11, fontWeight: 800, letterSpacing: '.05em' }}>{p.emoji} {p.name}</div>
                <div style={{ color: FGMUTE, fontSize: 10, marginTop: 2 }}>{p.duration}</div>
                {isSel && (
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
                    background: p.color,
                  }} />
                )}
              </button>
            )
          })}
        </div>

        <div style={{ display: 'flex', gap: 14, fontSize: 10, color: FGMUTE, alignItems: 'center', justifyContent: 'flex-end' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 12, height: 8, background: AMB, borderRadius: 2 }} />
            apenas no cold start
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 12, height: 8, background: GRN, borderRadius: 2 }} />
            sempre executa
          </span>
        </div>
      </div>

      {/* Detalhe da fase */}
      <div style={{
        background: CARD,
        border: `2px solid ${active.color}50`,
        borderRadius: 12,
        padding: 20,
        boxShadow: `0 0 30px ${active.color}10`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <span style={{ color: active.color, fontSize: 24, fontWeight: 900 }}>{active.emoji}</span>
          <div>
            <div style={{ color: active.color, fontSize: 14, fontWeight: 800 }}>{active.name}</div>
            <div style={{ color: FGMUTE, fontSize: 11 }}>Duração típica: {active.duration} {active.occursOn === 'cold' ? '· apenas em cold start' : '· em toda invocação'}</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          {active.steps.map((step, i) => (
            <div key={i} style={{
              background: BG,
              borderLeft: `3px solid ${active.color}`,
              borderRadius: 6,
              padding: '10px 14px',
            }}>
              <div style={{ color: active.color, fontSize: 11, fontWeight: 700, marginBottom: 4, letterSpacing: '.03em' }}>
                {String.fromCharCode(97 + i)}) {step.title}
              </div>
              <div style={{ color: FGMUTE, fontSize: 11, lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: step.detail }} />
            </div>
          ))}
        </div>

        <div style={{
          background: `${GRN}10`,
          border: `1px solid ${GRN}40`,
          borderLeft: `3px solid ${GRN}`,
          borderRadius: 6,
          padding: '10px 14px',
          fontSize: 11,
          color: FG,
          lineHeight: 1.6,
        }}>
          <span style={{ color: GRN, fontWeight: 700, letterSpacing: '.05em', marginRight: 8 }}>OTIMIZACAO</span>
          <span style={{ color: FGMUTE }}>{active.optimization}</span>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Execution Environment Lifecycle (StateMachineExplorer)
// Justificativa: o ciclo cold/warm/frozen/destroyed do execution environment é
// confuso em texto. Ver os estados como nós e clicar nas transições "boot",
// "invocação", "freeze", "timeout" fixa o modelo mental.
// ═══════════════════════════════════════════════════════════════════════════════

const EXEC_STATES: SMState[] = [
  { id: 'cold',      label: 'cold',      description: 'Container não existe. Próxima invocação requer Init Phase completa: download de código, runtime, código global. Cold start latência adicionada.', color: AMB, isInitial: true },
  { id: 'init',      label: 'init',      description: 'Init Phase em execução: AWS está provisionando o ambiente. Toma 100 ms a 5 s+ dependendo de runtime e tamanho do pacote. Acontece apenas em cold start.', color: SKY },
  { id: 'invoking',  label: 'invoking',  description: 'Handler executando. Recebe event e context, processa, retorna response. Acesso a variáveis globais inicializadas no Init.', color: GRN },
  { id: 'frozen',    label: 'frozen',    description: 'Container pausado entre invocações. Memória preservada — variáveis globais persistem. Pronto para próxima invocação sem cold start.', color: PRP },
  { id: 'destroyed', label: 'destroyed', description: 'Container removido após inatividade (~5-15 min sem invocações). Próxima invocação será cold. AWS recicla recursos.', color: RED, isFinal: true },
]

const EXEC_TRANSITIONS: SMTransition[] = [
  { from: 'cold',      to: 'init',      event: 'invocação chega',     code: '// download + runtime + global code' },
  { from: 'init',      to: 'invoking',  event: 'init OK',              code: '// handler() é chamado' },
  { from: 'invoking',  to: 'frozen',    event: 'response retornada',  code: '// container preserved (warm)' },
  { from: 'frozen',    to: 'invoking',  event: 'invocação warm',       code: '// pula init — &lt;1 ms latency' },
  { from: 'frozen',    to: 'destroyed', event: 'idle ~15 min',         code: '// AWS recicla container' },
  { from: 'invoking',  to: 'destroyed', event: 'timeout / erro fatal', code: '// container terminado' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Event Sources Comparison (ComparisonTable)
// Justificativa: 8 fontes de evento × comportamento de retry, DLQ, ordenação e
// batching. Decisão crítica em arquitetura serverless. Tabela comparativa torna
// óbvias as diferenças que texto não consegue mostrar lado a lado.
// ═══════════════════════════════════════════════════════════════════════════════

const SOURCE_OPTIONS: ComparisonOption[] = [
  { id: 'apigw',  label: 'API Gateway', sublabel: 'Síncrono',  color: SKY },
  { id: 's3',     label: 'S3 Events',   sublabel: 'Assíncrono', color: GRN },
  { id: 'sns',    label: 'SNS',          sublabel: 'Assíncrono', color: AMB },
  { id: 'sqs',    label: 'SQS',          sublabel: 'Polling',    color: PRP },
  { id: 'kinesis',label: 'Kinesis',      sublabel: 'Stream',     color: RED },
  { id: 'ddb',    label: 'DynamoDB Streams', sublabel: 'Stream', color: '#60a5fa' },
]

const SOURCE_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'invocation', label: 'Tipo de invocação', category: 'Modelo',
    description: 'Como Lambda recebe o evento',
    values: {
      apigw:   { rating: 'good',      note: 'Síncrono. Cliente HTTP aguarda resposta da Lambda.' },
      s3:      { rating: 'good',      note: 'Assíncrono. S3 chama Lambda, não espera retorno.' },
      sns:     { rating: 'good',      note: 'Assíncrono. SNS faz fan-out para múltiplas Lambdas.' },
      sqs:     { rating: 'good',      note: 'Polling. Lambda faz long-poll na fila e processa batches.' },
      kinesis: { rating: 'good',      note: 'Stream. Lambda processa shards em ordem.' },
      ddb:     { rating: 'good',      note: 'Stream. Cada mudança em item dispara Lambda em ordem.' },
    },
  },
  {
    id: 'retry', label: 'Comportamento de retry', category: 'Confiabilidade',
    description: 'O que acontece se a invocação falhar',
    values: {
      apigw:   { rating: 'fair',      note: 'Sem retry — cliente decide. Lambda erro = HTTP 502.' },
      s3:      { rating: 'good',      note: 'Retry 2× com backoff. Após esgotar: DLQ ou Destinations.' },
      sns:     { rating: 'good',      note: 'Retry 3× com backoff exponencial. Fallback DLQ.' },
      sqs:     { rating: 'excellent', note: 'Retry até maxReceiveCount. ReportBatchItemFailures granular.' },
      kinesis: { rating: 'excellent', note: 'Retry até expirar (24h padrão). Bisect on error.' },
      ddb:     { rating: 'excellent', note: 'Retry até expirar (24h). Bloqueia shard se erro persistir.' },
    },
  },
  {
    id: 'order', label: 'Ordenação', category: 'Garantias',
    description: 'Garante ordem de processamento',
    values: {
      apigw:   { rating: 'na',        note: 'Não aplicável — cada request é independente.' },
      s3:      { rating: 'poor',      note: 'Sem garantia de ordem — eventos chegam paralelos.' },
      sns:     { rating: 'poor',      note: 'Sem garantia. Use SNS FIFO se ordem importa.' },
      sqs:     { rating: 'fair',      note: 'Standard: best-effort. FIFO: ordem por MessageGroupId.' },
      kinesis: { rating: 'excellent', note: 'Ordem garantida por shard (partition key).' },
      ddb:     { rating: 'excellent', note: 'Ordem garantida por shard (chave primária).' },
    },
  },
  {
    id: 'batch', label: 'Batch', category: 'Performance',
    description: 'Quantos eventos por invocação',
    values: {
      apigw:   { rating: 'na',        note: 'Não aplicável — 1 request por invocação.' },
      s3:      { rating: 'fair',      note: '1 invocação por evento (sem batch nativo).' },
      sns:     { rating: 'fair',      note: '1 invocação por mensagem.' },
      sqs:     { rating: 'excellent', note: 'Batch de 1-10.000 (Standard) ou 1-10 (FIFO).' },
      kinesis: { rating: 'excellent', note: 'Batch de até 10.000 records ou MaximumBatchingWindow.' },
      ddb:     { rating: 'excellent', note: 'Batch de até 10.000 records por invocação.' },
    },
  },
  {
    id: 'concurrency', label: 'Concorrência', category: 'Escalabilidade',
    description: 'Como Lambda escala instâncias',
    values: {
      apigw:   { rating: 'excellent', note: '1 instância por requisição simultânea. Burst 3.000.' },
      s3:      { rating: 'excellent', note: '1 instância por evento — escala linearmente.' },
      sns:     { rating: 'excellent', note: '1 instância por mensagem — fan-out paralelo.' },
      sqs:     { rating: 'good',      note: '60 instâncias/min iniciais, depois +60/min.' },
      kinesis: { rating: 'fair',      note: '1 instância por shard (parallelization factor 1-10).' },
      ddb:     { rating: 'fair',      note: '1 instância por shard. Limita escala da Lambda.' },
    },
  },
  {
    id: 'use', label: 'Caso de uso ideal', category: 'Decisão',
    description: 'Quando escolher cada source',
    values: {
      apigw:   { rating: 'good', note: 'REST/HTTP APIs públicas. Auth, rate limit, validação na borda.' },
      s3:      { rating: 'good', note: 'Processamento de upload (thumbnails, parsing, indexing).' },
      sns:     { rating: 'good', note: 'Fan-out — 1 evento dispara N consumidores independentes.' },
      sqs:     { rating: 'good', note: 'Worker queue, throttle de carga, desacoplamento entre serviços.' },
      kinesis: { rating: 'good', note: 'Streams contínuos: clickstream, IoT, logs em alto volume.' },
      ddb:     { rating: 'good', note: 'Reagir a mudanças no DB: invalidação de cache, audit log.' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Concurrency Model (custom interactive)
// Justificativa: Reserved x Provisioned x Default Pool é o conceito mais
// confundido em Lambda. Ver os pools como áreas com instâncias quentes/frias
// e simular invocações é radicalmente mais didático que descrição em texto.
// ═══════════════════════════════════════════════════════════════════════════════

type ConcurrencyMode = {
  id: string
  name: string
  color: string
  description: string
  pros: string[]
  cons: string[]
  cost: string
  warmInstances: number
  reservedSlots: number
  showsCold: boolean
}

const CONCURRENCY_MODES: ConcurrencyMode[] = [
  {
    id: 'default',
    name: 'Default (sem config)',
    color: SKY,
    description: 'Função compartilha o pool de 1.000 invocações simultâneas da conta. Toda invocação faz cold start na primeira instância. Sem garantia de capacidade, sem proteção.',
    pros: ['Custo zero adicional', 'Escala automática até 1.000 (default)', 'Nada a configurar'],
    cons: ['Cold start em toda nova instância', 'Compete por capacidade com outras funções da conta', 'Sem proteção de DB de sobrecarga'],
    cost: 'Apenas pelas invocações',
    warmInstances: 0,
    reservedSlots: 0,
    showsCold: true,
  },
  {
    id: 'reserved',
    name: 'Reserved Concurrency',
    color: PRP,
    description: 'Define teto máximo de instâncias simultâneas. Acima do limite, invocações síncronas recebem 429 e assíncronas vão para retry. Protege banco de dados de sobrecarga.',
    pros: ['Reserva capacidade exclusiva — não compete com outras funções', 'Protege banco de dados de avalanche de conexões', 'Custo zero adicional'],
    cons: ['Cold start permanece nas novas instâncias', 'Throttle se ultrapassar o limite', 'Reserved=0 desabilita a função (cuidado)'],
    cost: 'Apenas pelas invocações',
    warmInstances: 0,
    reservedSlots: 50,
    showsCold: true,
  },
  {
    id: 'provisioned',
    name: 'Provisioned Concurrency',
    color: GRN,
    description: 'Mantém N instâncias sempre inicializadas e prontas. Sem cold start até o limite provisionado. Acima do limite, novas instâncias fazem cold start normal.',
    pros: ['Zero cold start nas instâncias provisionadas', 'Latência consistente para APIs críticas', 'Pode combinar com Reserved Concurrency'],
    cons: ['Custo fixo por hora — paga mesmo sem invocações', 'Precisa estimar carga corretamente', 'Não escala instantaneamente acima do provisionado'],
    cost: '$0.000004/GB-s adicional por instância quente',
    warmInstances: 10,
    reservedSlots: 0,
    showsCold: false,
  },
]

function ConcurrencyVisual() {
  const [sel, setSel] = useState<string>('default')
  const active = CONCURRENCY_MODES.find(m => m.id === sel)!

  return (
    <div style={{ background: BG, border: `1px solid ${LINE}`, borderRadius: 14, padding: 24, fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ marginBottom: 18 }}>
        <h3 style={{ color: FG, margin: 0, fontSize: 16, fontWeight: 800 }}>Modelo de Concorrência Lambda</h3>
        <p style={{ color: FGMUTE, fontSize: 12, margin: '4px 0 0' }}>Default vs Reserved vs Provisioned — três conceitos opostos frequentemente confundidos.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
        {CONCURRENCY_MODES.map(m => {
          const isSel = m.id === sel
          return (
            <button
              key={m.id}
              onClick={() => setSel(m.id)}
              style={{
                background: isSel ? `${m.color}25` : CARD,
                border: `2px solid ${isSel ? m.color : LINE}`,
                borderRadius: 10,
                padding: '14px 16px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all .2s',
                fontFamily: 'inherit',
              }}
            >
              <div style={{ color: isSel ? m.color : FG, fontSize: 13, fontWeight: 800, marginBottom: 4 }}>{m.name}</div>
              <div style={{ color: FGMUTE, fontSize: 10, lineHeight: 1.5 }}>{m.cost}</div>
            </button>
          )
        })}
      </div>

      <div style={{
        background: CARD,
        border: `2px solid ${active.color}50`,
        borderRadius: 12,
        padding: 20,
        marginBottom: 14,
      }}>
        <div style={{ color: FGMUTE, fontSize: 12, lineHeight: 1.7, marginBottom: 16 }}>{active.description}</div>

        {/* Visualização de pool */}
        <div style={{
          background: BG,
          border: `1px solid ${LINE}`,
          borderRadius: 10,
          padding: 16,
          marginBottom: 16,
        }}>
          <div style={{ color: active.color, fontSize: 9, fontWeight: 700, letterSpacing: '.15em', marginBottom: 10 }}>POOL DE INSTANCIAS</div>

          {active.id === 'provisioned' && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ color: GRN, fontSize: 10, fontWeight: 700, marginBottom: 6 }}>Provisioned (sempre quentes)</div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {[...Array(active.warmInstances)].map((_, i) => (
                  <div key={i} style={{
                    width: 36, height: 36,
                    background: `${GRN}30`,
                    border: `1.5px solid ${GRN}`,
                    borderRadius: 6,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: GRN,
                    fontSize: 10,
                    fontWeight: 700,
                  }}>λ</div>
                ))}
              </div>
            </div>
          )}

          {active.id === 'reserved' && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ color: PRP, fontSize: 10, fontWeight: 700, marginBottom: 6 }}>Reserved (teto: {active.reservedSlots})</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 3 }}>
                {[...Array(active.reservedSlots)].map((_, i) => (
                  <div key={i} style={{
                    height: 18,
                    background: i < 30 ? `${PRP}30` : 'transparent',
                    border: `1px ${i < 30 ? 'solid' : 'dashed'} ${PRP}80`,
                    borderRadius: 3,
                    fontSize: 8,
                    color: PRP,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{i < 30 ? 'λ' : ''}</div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 14, fontSize: 10, color: FGMUTE, marginTop: 6 }}>
                <span><span style={{ color: PRP, fontWeight: 700 }}>30</span> ativas</span>
                <span><span style={{ color: FGMUTE }}>20</span> slots disponíveis</span>
                <span style={{ color: RED }}>· acima de 50 = throttle 429</span>
              </div>
            </div>
          )}

          {active.id === 'default' && (
            <div>
              <div style={{ color: SKY, fontSize: 10, fontWeight: 700, marginBottom: 6 }}>Default Pool da conta (1.000 compartilhado)</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(20, 1fr)', gap: 2 }}>
                {[...Array(60)].map((_, i) => (
                  <div key={i} style={{
                    height: 12,
                    background: i < 25 ? `${SKY}30` : 'transparent',
                    border: `1px ${i < 25 ? 'solid' : 'dashed'} ${SKY}40`,
                    borderRadius: 2,
                  }} />
                ))}
              </div>
              <div style={{ display: 'flex', gap: 14, fontSize: 10, color: FGMUTE, marginTop: 6 }}>
                <span><span style={{ color: SKY, fontWeight: 700 }}>25</span> em uso</span>
                <span>compartilhado com outras funções da conta</span>
              </div>
            </div>
          )}

          {active.showsCold && (
            <div style={{
              marginTop: 10,
              background: `${AMB}10`,
              border: `1px solid ${AMB}40`,
              borderRadius: 6,
              padding: '8px 12px',
              fontSize: 10,
              color: AMB,
            }}>
              <span style={{ fontWeight: 700, marginRight: 8 }}>!</span>
              Novas instâncias fazem cold start. Latência adicional de 100 ms a 5 s.
            </div>
          )}

          {!active.showsCold && (
            <div style={{
              marginTop: 10,
              background: `${GRN}10`,
              border: `1px solid ${GRN}40`,
              borderRadius: 6,
              padding: '8px 12px',
              fontSize: 10,
              color: GRN,
            }}>
              <span style={{ fontWeight: 700, marginRight: 8 }}>✓</span>
              Zero cold start nas instâncias provisionadas — latência consistente sub-50 ms.
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <div style={{ color: GRN, fontSize: 9, letterSpacing: '.15em', fontWeight: 700, marginBottom: 8 }}>VANTAGENS</div>
            {active.pros.map((p, i) => (
              <div key={i} style={{
                color: FG, fontSize: 11, lineHeight: 1.6,
                padding: '4px 0',
                display: 'flex', gap: 8,
              }}>
                <span style={{ color: GRN, fontWeight: 700 }}>+</span>
                {p}
              </div>
            ))}
          </div>
          <div>
            <div style={{ color: RED, fontSize: 9, letterSpacing: '.15em', fontWeight: 700, marginBottom: 8 }}>DESVANTAGENS</div>
            {active.cons.map((c, i) => (
              <div key={i} style={{
                color: FG, fontSize: 11, lineHeight: 1.6,
                padding: '4px 0',
                display: 'flex', gap: 8,
              }}>
                <span style={{ color: RED, fontWeight: 700 }}>-</span>
                {c}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — Memory vs Performance (custom interactive slider)
// Justificativa: relação memória x CPU x custo é contraintuitiva. Aumentar
// memória pode reduzir custo se a função terminar mais rápido. Slider
// interativo com cálculo de custo torna óbvio o sweet spot.
// ═══════════════════════════════════════════════════════════════════════════════

type MemoryConfig = {
  memoryMB: number
  vCPUs: number
  durationMs: number
  costPerInvocation: string
  performanceLabel: string
}

const MEMORY_CONFIGS: MemoryConfig[] = [
  { memoryMB: 128,   vCPUs: 0.07, durationMs: 8000,  costPerInvocation: '0.00001664', performanceLabel: 'Lento — CPU mínimo' },
  { memoryMB: 256,   vCPUs: 0.14, durationMs: 4500,  costPerInvocation: '0.00001872', performanceLabel: 'Lento — CPU básico' },
  { memoryMB: 512,   vCPUs: 0.29, durationMs: 2200,  costPerInvocation: '0.00001830', performanceLabel: 'Razoável' },
  { memoryMB: 1024,  vCPUs: 0.58, durationMs: 1100,  costPerInvocation: '0.00001829', performanceLabel: 'Bom — 1 vCPU' },
  { memoryMB: 1769,  vCPUs: 1.00, durationMs: 700,   costPerInvocation: '0.00002016', performanceLabel: 'Sweet spot — 1 vCPU completo' },
  { memoryMB: 2048,  vCPUs: 1.16, durationMs: 600,   costPerInvocation: '0.00002000', performanceLabel: 'Otimo' },
  { memoryMB: 3008,  vCPUs: 1.71, durationMs: 480,   costPerInvocation: '0.00002351', performanceLabel: 'Otimo — 2 vCPU' },
  { memoryMB: 5120,  vCPUs: 2.91, durationMs: 350,   costPerInvocation: '0.00002921', performanceLabel: 'Excelente — 3 vCPU' },
  { memoryMB: 10240, vCPUs: 5.81, durationMs: 280,   costPerInvocation: '0.00004667', performanceLabel: 'Excelente — 6 vCPU' },
]

function MemoryTuningVisual() {
  const [idx, setIdx] = useState<number>(3)
  const config = MEMORY_CONFIGS[idx]
  const minCost = Math.min(...MEMORY_CONFIGS.map(c => parseFloat(c.costPerInvocation)))
  const isOptimal = parseFloat(config.costPerInvocation) === minCost

  return (
    <div style={{ background: BG, border: `1px solid ${LINE}`, borderRadius: 14, padding: 24, fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ marginBottom: 18 }}>
        <h3 style={{ color: FG, margin: 0, fontSize: 16, fontWeight: 800 }}>Memória vs CPU vs Custo</h3>
        <p style={{ color: FGMUTE, fontSize: 12, margin: '4px 0 0' }}>Mais memória = mais CPU proporcional. Pode ser mais barato se a função terminar mais rápido.</p>
      </div>

      {/* Slider */}
      <div style={{
        background: CARD,
        border: `1px solid ${LINE}`,
        borderRadius: 12,
        padding: 20,
        marginBottom: 14,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={{ color: C, fontSize: 11, fontWeight: 700, letterSpacing: '.1em' }}>MEMORIA CONFIGURADA</span>
          <span style={{ color: FG, fontSize: 24, fontWeight: 900 }}>{config.memoryMB} MB</span>
        </div>

        <input
          type="range"
          min={0}
          max={MEMORY_CONFIGS.length - 1}
          value={idx}
          onChange={e => setIdx(parseInt(e.target.value))}
          style={{
            width: '100%',
            height: 6,
            background: `linear-gradient(to right, ${C} 0%, ${C} ${(idx / (MEMORY_CONFIGS.length - 1)) * 100}%, ${LINE} ${(idx / (MEMORY_CONFIGS.length - 1)) * 100}%, ${LINE} 100%)`,
            borderRadius: 3,
            outline: 'none',
            appearance: 'none',
            cursor: 'pointer',
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 9, color: FGMUTE }}>
          {[128, 512, 1769, 5120, 10240].map(m => (
            <span key={m}>{m} MB</span>
          ))}
        </div>
      </div>

      {/* Métricas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
        <div style={{
          background: CARD,
          border: `2px solid ${SKY}40`,
          borderRadius: 10,
          padding: '14px 16px',
        }}>
          <div style={{ color: SKY, fontSize: 9, letterSpacing: '.1em', fontWeight: 700, marginBottom: 4 }}>vCPUs DISPONIVEIS</div>
          <div style={{ color: FG, fontSize: 22, fontWeight: 900 }}>{config.vCPUs.toFixed(2)}</div>
          <div style={{ color: FGMUTE, fontSize: 10, marginTop: 2 }}>1 vCPU completo @ 1769 MB</div>
        </div>
        <div style={{
          background: CARD,
          border: `2px solid ${PRP}40`,
          borderRadius: 10,
          padding: '14px 16px',
        }}>
          <div style={{ color: PRP, fontSize: 9, letterSpacing: '.1em', fontWeight: 700, marginBottom: 4 }}>DURACAO TIPICA</div>
          <div style={{ color: FG, fontSize: 22, fontWeight: 900 }}>{config.durationMs} <span style={{ fontSize: 12, color: FGMUTE }}>ms</span></div>
          <div style={{ color: FGMUTE, fontSize: 10, marginTop: 2 }}>{config.performanceLabel}</div>
        </div>
        <div style={{
          background: CARD,
          border: `2px solid ${isOptimal ? GRN : C}40`,
          borderRadius: 10,
          padding: '14px 16px',
        }}>
          <div style={{ color: isOptimal ? GRN : C, fontSize: 9, letterSpacing: '.1em', fontWeight: 700, marginBottom: 4 }}>
            CUSTO POR INVOCACAO {isOptimal && '★'}
          </div>
          <div style={{ color: FG, fontSize: 22, fontWeight: 900 }}>${parseFloat(config.costPerInvocation).toFixed(8)}</div>
          <div style={{ color: FGMUTE, fontSize: 10, marginTop: 2 }}>{isOptimal ? 'Sweet spot — mais barato' : 'Aumente memória — pode reduzir custo'}</div>
        </div>
      </div>

      {/* Curva de custo */}
      <div style={{
        background: CARD2,
        border: `1px solid ${LINE}`,
        borderRadius: 10,
        padding: 16,
        marginBottom: 12,
      }}>
        <div style={{ color: FG, fontSize: 9, letterSpacing: '.15em', fontWeight: 700, marginBottom: 10 }}>CURVA DE CUSTO POR MEMORIA</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 90 }}>
          {MEMORY_CONFIGS.map((c, i) => {
            const cost = parseFloat(c.costPerInvocation)
            const heightPct = (cost / parseFloat(MEMORY_CONFIGS[8].costPerInvocation)) * 100
            const isOpt = cost === minCost
            const isSel = i === idx
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: '100%',
                  height: `${heightPct}%`,
                  background: isSel ? C : (isOpt ? GRN : `${C}30`),
                  border: `1px solid ${isSel ? C : (isOpt ? GRN : `${C}50`)}`,
                  borderRadius: '3px 3px 0 0',
                  transition: 'all .25s',
                }} />
                <div style={{ fontSize: 8, color: isSel ? C : FGMUTE, fontWeight: isSel ? 700 : 400 }}>{c.memoryMB}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{
        background: CARD,
        border: `1px solid ${C}30`,
        borderLeft: `3px solid ${C}`,
        borderRadius: 6,
        padding: '10px 14px',
        fontSize: 11,
        color: FGMUTE,
        lineHeight: 1.6,
      }}>
        <span style={{ color: C, fontWeight: 700, marginRight: 8 }}>Lambda Power Tuning</span>
        ferramenta open source da AWS (Step Functions) que executa sua função real em todas as configurações e gera gráfico custo × velocidade. É como você descobre o sweet spot real para sua função em vez de adivinhar.
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — DecisionTree: Lambda vs ECS Fargate vs EC2
// Justificativa: "quando Lambda perde para ECS?" é pergunta clássica de
// entrevista. Árvore de decisão ensina a estrutura mental para defender
// a escolha em design system interview.
// ═══════════════════════════════════════════════════════════════════════════════

const COMPUTE_ROOT: DTNode = {
  id: 'root',
  question: 'Lambda é a escolha certa para esta workload?',
  children: [
    { label: 'Execução é event-driven e curta?', nodeId: 'short-q', color: C },
    { label: 'Workload é contínuo e estável?', nodeId: 'continuous-q', color: PRP },
    { label: 'Precisa de containers (>10 GB)?', nodeId: 'container-q', color: SKY },
    { label: 'Precisa de GPU ou hardware especializado?', nodeId: 'gpu', color: AMB },
  ],
}

const COMPUTE_NODES: Record<string, DTNode> = {
  'short-q': {
    id: 'short-q',
    question: 'A execução dura menos de 15 minutos?',
    children: [
      { label: 'Sim, é curta (segundos a minutos)', nodeId: 'lambda-yes', color: C },
      { label: 'Não, processo demora mais que 15 min', nodeId: 'fargate-batch', color: PRP },
    ],
  },
  'lambda-yes': {
    id: 'lambda-yes',
    recommendation: 'AWS Lambda',
    detail: 'Pague por invocação e duração (granularidade de 1 ms). Escala automática de 0 a milhares. Free tier 1M req/mês. Use Provisioned Concurrency se latência for crítica. Cuidado com cold start em VPC e em runtimes pesados (Java, .NET) — considere SnapStart para Java.',
    color: C,
    icon: 'L',
  },
  'fargate-batch': {
    id: 'fargate-batch',
    recommendation: 'ECS Fargate ou AWS Batch',
    detail: 'Para jobs longos sem limite de 15 min: AWS Batch provisiona Spot Instances automaticamente (até 90% off). ECS Fargate para containers de longa duração. Step Functions para orquestrar pipeline com Lambda + Batch.',
    color: PRP,
    icon: 'B',
  },
  'continuous-q': {
    id: 'continuous-q',
    question: 'Volume constante de mais de 1M req/dia?',
    children: [
      { label: 'Sim, alto volume previsível', nodeId: 'fargate-cont', color: PRP },
      { label: 'Não, volume é menor', nodeId: 'lambda-cont', color: C },
    ],
  },
  'fargate-cont': {
    id: 'fargate-cont',
    recommendation: 'ECS Fargate (talvez EC2)',
    detail: 'Acima de 1M req/dia constantes, ECS pode ficar mais barato que Lambda. Sem cold start, conexão DB persistente (sem reconnect a cada invocação), latência consistente. Combine com Savings Plans para mais 30-50% de desconto.',
    color: PRP,
    icon: 'F',
  },
  'lambda-cont': {
    id: 'lambda-cont',
    recommendation: 'Lambda com Provisioned Concurrency',
    detail: 'Volume médio: Lambda continua sendo mais simples. Use Provisioned Concurrency para eliminar cold start em horário de pico. Lambda Power Tuning para otimizar memória/duração/custo.',
    color: C,
    icon: 'L',
  },
  'container-q': {
    id: 'container-q',
    question: 'Container precisa de mais de 10 GB?',
    children: [
      { label: 'Sim, imagem grande (ML, libs nativas)', nodeId: 'fargate-large', color: SKY },
      { label: 'Não, cabe em 10 GB', nodeId: 'lambda-container', color: C },
    ],
  },
  'fargate-large': {
    id: 'fargate-large',
    recommendation: 'ECS Fargate ou EKS',
    detail: 'Lambda container image limita em 10 GB. Para imagens maiores (modelos ML, libs especializadas, runtimes customizados), use ECS Fargate ou EKS. Considere SageMaker Inference para modelos ML grandes.',
    color: SKY,
    icon: 'X',
  },
  'lambda-container': {
    id: 'lambda-container',
    recommendation: 'Lambda Container Image',
    detail: 'Lambda suporta imagens OCI até 10 GB. Útil para empacotar libs nativas (sharp, ffmpeg) ou runtimes customizados. Cold start é um pouco maior que ZIP — considere Provisioned Concurrency se latência crítica.',
    color: C,
    icon: 'C',
  },
  gpu: {
    id: 'gpu',
    recommendation: 'EC2 ou SageMaker',
    detail: 'Lambda não tem GPU. Para inferência ML em GPU, use SageMaker Inference Endpoints (g4dn) ou EC2 GPU (g5/p4) com ECS. Para workloads com hardware especializado (NVMe local, instâncias bare-metal), Lambda também não é opção.',
    color: AMB,
    icon: 'G',
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 7 — Lambda VPC Penalty (custom comparison)
// Justificativa: "Lambda em VPC tem cold start adicional?" é pergunta sênior.
// Antes de 2019 era um problema enorme. Hoje é tratado mas tem gotchas
// (NAT Gateway, VPC Endpoints). Visualização do antes/depois fixa o conceito.
// ═══════════════════════════════════════════════════════════════════════════════

type VpcScenario = {
  id: string
  name: string
  color: string
  coldStartMs: number
  description: string
  network: string
  cost: string
  recommendation: string
}

const VPC_SCENARIOS: VpcScenario[] = [
  {
    id: 'no-vpc',
    name: 'Sem VPC',
    color: GRN,
    coldStartMs: 250,
    description: 'Lambda sem VPC executa diretamente na rede AWS. Acesso a APIs públicas (Stripe, SendGrid), serviços AWS via internet (S3, DynamoDB) e CloudFront sem nenhuma configuração de rede.',
    network: 'Internet → Lambda diretamente',
    cost: 'Sem custo de rede adicional',
    recommendation: 'Use sempre que possível. Padrão para Lambdas que só falam com serviços públicos AWS.',
  },
  {
    id: 'vpc-old',
    name: 'VPC pré-2019 (legado)',
    color: RED,
    coldStartMs: 11000,
    description: 'Antes de Setembro 2019: cada Lambda em VPC criava uma ENI dedicada no início. Cold start adicional de 8-15 segundos. Era o motivo principal de não usar Lambda em VPC.',
    network: 'Lambda → cria ENI → VPC → recurso',
    cost: 'ENIs custavam recursos AWS',
    recommendation: 'Não relevante hoje — AWS migrou todos os clientes para o novo modelo. Mencionar em entrevista mostra histórico.',
  },
  {
    id: 'vpc-new',
    name: 'VPC pós-2019 (atual)',
    color: SKY,
    coldStartMs: 350,
    description: 'AWS Hyperplane: ENIs são compartilhadas entre Lambdas. Cold start adicional caiu para menos de 100 ms. Lambda em VPC virou viável para acessar RDS, ElastiCache, recursos privados.',
    network: 'Lambda → ENI compartilhada → VPC → recurso',
    cost: 'Sem custo extra de ENI',
    recommendation: 'Use quando precisar acessar RDS, ElastiCache ou recursos privados. Sem necessidade de NAT Gateway se só acessar VPC interna.',
  },
  {
    id: 'vpc-nat',
    name: 'VPC + NAT Gateway',
    color: AMB,
    coldStartMs: 350,
    description: 'Lambda em subnet privada precisa de NAT Gateway para acessar internet. Custo: $0.045/hora ($32/mês) + $0.045/GB transferido. Para serviços AWS, prefira VPC Endpoints (mais barato).',
    network: 'Lambda → ENI → NAT Gateway → Internet',
    cost: '$32/mês + $0.045/GB',
    recommendation: 'Apenas se precisar acessar APIs externas (Stripe, etc.) DE DENTRO da VPC. Para serviços AWS, use VPC Endpoints.',
  },
  {
    id: 'vpc-endpoint',
    name: 'VPC + VPC Endpoints',
    color: PRP,
    coldStartMs: 350,
    description: 'VPC Endpoints permitem acesso a serviços AWS (S3, DynamoDB, SQS, SSM, Secrets Manager) sem passar pela internet. S3 e DynamoDB Gateway Endpoints são gratuitos. Interface Endpoints custam $0.01/h cada.',
    network: 'Lambda → ENI → VPC Endpoint → Serviço AWS',
    cost: 'Gateway: grátis · Interface: $0.01/h',
    recommendation: 'Padrão para Lambdas em VPC que acessam serviços AWS. S3 e DynamoDB Gateway Endpoints são essenciais — gratuitos e mais rápidos.',
  },
]

function VpcPenaltyVisual() {
  const [sel, setSel] = useState<string>('vpc-new')
  const active = VPC_SCENARIOS.find(s => s.id === sel)!
  const maxCold = Math.max(...VPC_SCENARIOS.map(s => s.coldStartMs))

  return (
    <div style={{ background: BG, border: `1px solid ${LINE}`, borderRadius: 14, padding: 24, fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ marginBottom: 18 }}>
        <h3 style={{ color: FG, margin: 0, fontSize: 16, fontWeight: 800 }}>Lambda em VPC — penalidade e configuração de rede</h3>
        <p style={{ color: FGMUTE, fontSize: 12, margin: '4px 0 0' }}>O cold start adicional varia drasticamente por configuração. NAT Gateway vs VPC Endpoints muda custo.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 16 }}>
        {VPC_SCENARIOS.map(s => {
          const isSel = s.id === sel
          return (
            <button
              key={s.id}
              onClick={() => setSel(s.id)}
              style={{
                background: isSel ? `${s.color}25` : CARD,
                border: `2px solid ${isSel ? s.color : LINE}`,
                borderRadius: 10,
                padding: '12px 10px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all .2s',
                fontFamily: 'inherit',
              }}
            >
              <div style={{ color: isSel ? s.color : FG, fontSize: 11, fontWeight: 800, marginBottom: 4 }}>{s.name}</div>
              <div style={{ color: FGMUTE, fontSize: 9, lineHeight: 1.4 }}>+{s.coldStartMs} ms</div>
            </button>
          )
        })}
      </div>

      <div style={{
        background: CARD,
        border: `2px solid ${active.color}50`,
        borderRadius: 12,
        padding: 20,
      }}>
        <div style={{ color: FGMUTE, fontSize: 12, lineHeight: 1.7, marginBottom: 16 }}>{active.description}</div>

        {/* Bar de cold start */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ color: active.color, fontSize: 9, fontWeight: 700, letterSpacing: '.1em' }}>COLD START ADICIONAL</span>
            <span style={{ color: FG, fontSize: 18, fontWeight: 800 }}>{active.coldStartMs} ms</span>
          </div>
          <div style={{
            background: BG,
            border: `1px solid ${LINE}`,
            borderRadius: 6,
            height: 16,
            overflow: 'hidden',
          }}>
            <div style={{
              background: `linear-gradient(90deg, ${active.color}, ${active.color}80)`,
              height: '100%',
              width: `${(active.coldStartMs / maxCold) * 100}%`,
              transition: 'width .4s',
              borderRadius: 6,
            }} />
          </div>
        </div>

        {/* Path da rede */}
        <div style={{
          background: BG,
          border: `1px solid ${LINE}`,
          borderRadius: 8,
          padding: '12px 14px',
          marginBottom: 12,
          fontSize: 11,
          color: FGMUTE,
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          <span style={{ color: active.color, fontSize: 9, letterSpacing: '.15em', fontWeight: 700, marginRight: 12 }}>PATH DA REDE</span>
          <span style={{ color: FG }}>{active.network}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{
            background: BG,
            border: `1px solid ${LINE}`,
            borderRadius: 8,
            padding: '10px 14px',
          }}>
            <div style={{ color: AMB, fontSize: 9, letterSpacing: '.15em', fontWeight: 700, marginBottom: 6 }}>CUSTO DE REDE</div>
            <div style={{ color: FG, fontSize: 12 }}>{active.cost}</div>
          </div>
          <div style={{
            background: BG,
            border: `1px solid ${active.color}40`,
            borderLeft: `3px solid ${active.color}`,
            borderRadius: 8,
            padding: '10px 14px',
          }}>
            <div style={{ color: active.color, fontSize: 9, letterSpacing: '.15em', fontWeight: 700, marginBottom: 6 }}>RECOMENDACAO</div>
            <div style={{ color: FGMUTE, fontSize: 11, lineHeight: 1.6 }}>{active.recommendation}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 8 — Anti-patterns
// Justificativa: erros mais comuns em Lambda — conexão DB no handler, sem DLQ,
// timeout x visibility timeout, pacote grande, sensitive data em env vars.
// ═══════════════════════════════════════════════════════════════════════════════

const LAMBDA_ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'Conexão DB inicializada DENTRO do handler',
    wrong: [
      [{ text: '// Cada invocacao abre nova conexao — esgota o RDS', color: RED }],
      [{ text: 'export async function handler(event) {', color: FG }],
      [{ text: '  const pool = new Pool({ host: ... })   // !!! aqui dentro', color: RED }],
      [{ text: '  const result = await pool.query(...)', color: FG }],
      [{ text: '  return result', color: FG }],
      [{ text: '}', color: FG }],
    ],
    right: [
      [{ text: '// Inicializa FORA do handler — reutilizado em warm', color: GRN }],
      [{ text: 'const pool = new Pool({ host: ... })   // top-level', color: GRN }],
      [{ text: '', color: FG }],
      [{ text: 'export async function handler(event) {', color: FG }],
      [{ text: '  const result = await pool.query(...)', color: FG }],
      [{ text: '  return result', color: FG }],
      [{ text: '}', color: FG }],
    ],
    why: 'Codigo fora do handler executa apenas no Init Phase (cold start). Em invocacoes warm, o container e reutilizado — a conexao ja esta aberta. Inicializar dentro do handler abre nova conexao a cada request, consumindo conexoes do RDS rapidamente. Em escala (1000 invocacoes simultaneas), isso esgota o RDS em segundos.',
  },
  {
    title: 'Lambda assíncrona sem DLQ ou Destinations',
    wrong: [
      [{ text: '# Sem dead-letter — falhas perdidas silenciosamente', color: RED }],
      [{ text: 'resource "aws_lambda_function" "bad" {', color: FG }],
      [{ text: '  function_name = "process-events"', color: FG }],
      [{ text: '  # sem dead_letter_config', color: RED }],
      [{ text: '  # sem destinations on_failure', color: RED }],
      [{ text: '}', color: FG }],
    ],
    right: [
      [{ text: '# Destinations on_failure capturam contexto completo', color: GRN }],
      [{ text: 'resource "aws_lambda_function_event_invoke_config" "ok" {', color: FG }],
      [{ text: '  function_name = aws_lambda_function.app.function_name', color: FG }],
      [{ text: '  destination_config {', color: GRN }],
      [{ text: '    on_failure {', color: GRN }],
      [{ text: '      destination = aws_sqs_queue.dlq.arn', color: GRN }],
      [{ text: '    }', color: GRN }],
      [{ text: '  }', color: GRN }],
      [{ text: '  maximum_retry_attempts = 2', color: GRN }],
      [{ text: '}', color: FG }],
    ],
    why: 'Em invocacoes assincronas (S3 Events, SNS, EventBridge), Lambda faz retry 2× automaticamente. Apos retries esgotados, sem DLQ ou Destinations a invocacao e descartada silenciosamente. Voce nunca sabe que a falha aconteceu. Destinations e mais rico que DLQ legacy — entrega o evento original + resposta de erro + contexto de execucao.',
  },
  {
    title: 'SQS Visibility Timeout menor que Lambda Timeout',
    wrong: [
      [{ text: '# Visibility 30s + Lambda 60s = mensagem reprocessada', color: RED }],
      [{ text: 'resource "aws_sqs_queue" "bad" {', color: FG }],
      [{ text: '  visibility_timeout_seconds = 30   # menor que Lambda', color: RED }],
      [{ text: '}', color: FG }],
      [{ text: '', color: FG }],
      [{ text: 'resource "aws_lambda_function" "bad" {', color: FG }],
      [{ text: '  timeout = 60   # processa por 60s', color: RED }],
      [{ text: '}', color: FG }],
    ],
    right: [
      [{ text: '# Visibility >= 6 × Lambda timeout', color: GRN }],
      [{ text: 'resource "aws_sqs_queue" "ok" {', color: FG }],
      [{ text: '  visibility_timeout_seconds = 360   # 6× Lambda', color: GRN }],
      [{ text: '}', color: FG }],
      [{ text: '', color: FG }],
      [{ text: 'resource "aws_lambda_function" "ok" {', color: FG }],
      [{ text: '  timeout = 60', color: FG }],
      [{ text: '  # ReportBatchItemFailures ativado:', color: GRN }],
      [{ text: '  function_response_types = ["ReportBatchItemFailures"]', color: GRN }],
      [{ text: '}', color: FG }],
    ],
    why: 'Quando Lambda recebe mensagem SQS, ela fica invisivel pelo Visibility Timeout. Se Lambda demorar mais que esse tempo, a mensagem volta a ser visivel — outra Lambda processa a MESMA mensagem em paralelo. Resultado: processamento duplicado. Regra: Visibility >= 6 × Lambda timeout. Ative ReportBatchItemFailures para que apenas mensagens com erro voltem para a fila.',
  },
  {
    title: 'Pacote Lambda gigante — cold start lento',
    wrong: [
      [{ text: '# Inclui devDependencies, source maps, testes — 80 MB', color: RED }],
      [{ text: 'package.json:', color: FG }],
      [{ text: '  "dependencies": { ...prod }', color: FG }],
      [{ text: '  "devDependencies": { ...dev }   // !! incluido', color: RED }],
      [{ text: '', color: FG }],
      [{ text: '# Deploy:', color: FG }],
      [{ text: 'zip -r function.zip node_modules/ src/   # tudo!', color: RED }],
    ],
    right: [
      [{ text: '# esbuild bundle: 2 MB com tree shaking', color: GRN }],
      [{ text: '# scripts/build.js', color: GRN }],
      [{ text: 'await esbuild.build({', color: FG }],
      [{ text: '  entryPoints: ["src/index.ts"],', color: FG }],
      [{ text: '  bundle: true,', color: GRN }],
      [{ text: '  minify: true,', color: GRN }],
      [{ text: '  platform: "node",', color: FG }],
      [{ text: '  external: ["@aws-sdk/*"],   // disponivel no runtime', color: GRN }],
      [{ text: '  outfile: "dist/index.js"', color: FG }],
      [{ text: '})', color: FG }],
    ],
    why: 'Pacote grande aumenta o Init Phase: AWS demora mais para baixar do S3 e descompactar. Para Node.js, esbuild com tree shaking reduz bundle de 80 MB para ~2 MB. AWS SDK v3 ja vem instalado no runtime — adicione "@aws-sdk/*" como external para nao bundlar. Para Python, use Lambda Layers para libs pesadas (numpy, pandas).',
  },
  {
    title: 'Secrets em variáveis de ambiente plaintext',
    wrong: [
      [{ text: '# Senha do DB visivel em DescribeFunction', color: RED }],
      [{ text: 'resource "aws_lambda_function" "bad" {', color: FG }],
      [{ text: '  environment {', color: FG }],
      [{ text: '    variables = {', color: FG }],
      [{ text: '      DB_PASSWORD = "MinhaSenh@123!"   # !!! plaintext', color: RED }],
      [{ text: '      JWT_SECRET  = "secret-xyz"', color: RED }],
      [{ text: '    }', color: FG }],
      [{ text: '  }', color: FG }],
      [{ text: '}', color: FG }],
    ],
    right: [
      [{ text: '# Secrets Manager + IAM permission', color: GRN }],
      [{ text: 'resource "aws_lambda_function" "ok" {', color: FG }],
      [{ text: '  environment {', color: FG }],
      [{ text: '    variables = {', color: FG }],
      [{ text: '      DB_SECRET_ARN = aws_secretsmanager_secret.db.arn', color: GRN }],
      [{ text: '    }', color: FG }],
      [{ text: '  }', color: FG }],
      [{ text: '}', color: FG }],
      [{ text: '', color: FG }],
      [{ text: '// No handler:', color: GRN }],
      [{ text: 'const secret = await secretsManager.getSecretValue({', color: FG }],
      [{ text: '  SecretId: process.env.DB_SECRET_ARN', color: FG }],
      [{ text: '})', color: FG }],
    ],
    why: 'Variaveis de ambiente Lambda sao visiveis em DescribeFunction — qualquer pessoa com permissao de leitura na funcao ve as senhas. Tambem aparecem em logs de CloudFormation/Terraform e em backups. Use Secrets Manager (com rotacao automatica) ou Parameter Store (gratis para SecureString basico). Cache o secret no init phase para nao chamar a cada invocacao.',
  },
  {
    title: 'Sem idempotência em Lambda assíncrona',
    wrong: [
      [{ text: '// Retry duplica side-effects', color: RED }],
      [{ text: 'export async function handler(event) {', color: FG }],
      [{ text: '  const order = JSON.parse(event.body)', color: FG }],
      [{ text: '  await chargeCustomer(order)   // !!! cobra 2 vezes em retry', color: RED }],
      [{ text: '  await sendEmail(order)         // !!! envia 2 emails', color: RED }],
      [{ text: '}', color: FG }],
    ],
    right: [
      [{ text: '// Lambda Powertools Idempotency', color: GRN }],
      [{ text: 'import { idempotent } from "@aws-lambda-powertools/idempotency"', color: GRN }],
      [{ text: '', color: FG }],
      [{ text: 'const persistenceStore = new DynamoDBPersistenceLayer({', color: GRN }],
      [{ text: '  tableName: "idempotency"', color: GRN }],
      [{ text: '})', color: GRN }],
      [{ text: '', color: FG }],
      [{ text: 'export const handler = idempotent({', color: GRN }],
      [{ text: '  persistenceStore,', color: GRN }],
      [{ text: '})(async (event) => {', color: FG }],
      [{ text: '  await chargeCustomer(JSON.parse(event.body))', color: FG }],
      [{ text: '  // executado APENAS UMA VEZ por idempotency key', color: GRN }],
      [{ text: '})', color: FG }],
    ],
    why: 'Lambda assincrona faz retry automatico em erro (S3, SNS, EventBridge: 2× retry). SQS faz at-least-once delivery. Se sua funcao tem side-effects (cobranca, email, escrita externa), retry causa duplicacao. AWS Lambda Powertools Idempotency armazena resultado em DynamoDB com idempotency key — em retry, retorna o resultado cached em vez de reexecutar.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 9 — Destinations Flow (custom routing visualization)
// Justificativa: Destinations é um conceito que texto NÃO carrega bem. O fluxo
// de "se sucesso → A; se falha após retries → B" envolvendo SQS/SNS/EventBridge/
// Lambda como destinos é radicalmente mais claro com diagrama visual interativo.
// ═══════════════════════════════════════════════════════════════════════════════

type DestinationTarget = {
  id: string
  name: string
  icon: string
  color: string
  desc: string
  useCase: string
}

const DEST_TARGETS: DestinationTarget[] = [
  { id: 'sqs', name: 'SQS Queue', icon: 'Q', color: PRP, desc: 'Fila durável para processar de forma desacoplada', useCase: 'Processar falhas em batch posteriormente, retry manual com novo consumer.' },
  { id: 'sns', name: 'SNS Topic', icon: 'T', color: AMB, desc: 'Pub/sub para fan-out a múltiplos subscribers', useCase: 'Notificar múltiplos sistemas em paralelo (alerta + logging + dashboard).' },
  { id: 'eb',  name: 'EventBridge', icon: 'E', color: SKY, desc: 'Bus com regras de roteamento por padrão', useCase: 'Roteamento condicional baseado no payload — "se erro contém X, vai para alarme".' },
  { id: 'lam', name: 'Lambda',     icon: 'λ', color: GRN, desc: 'Outra Lambda processa o resultado', useCase: 'Pipeline de processamento — pós-sucesso aciona próxima etapa.' },
]

type DestScenario = {
  id: string
  label: string
  title: string
  invocationType: string
  flow: Array<{ step: string; status: 'normal' | 'success' | 'fail' | 'retry'; detail: string }>
}

const DEST_SCENARIOS: DestScenario[] = [
  {
    id: 'success',
    label: 'Sucesso',
    title: 'Lambda completa com sucesso → Destination on_success',
    invocationType: 'Assíncrono (S3, SNS, EventBridge, SDK Event)',
    flow: [
      { step: '1. Evento chega', status: 'normal', detail: 'S3 PutObject, SNS publish, EventBridge rule, ou SDK invoke com InvocationType=Event' },
      { step: '2. Lambda invocada', status: 'normal', detail: 'AWS coloca evento em fila interna, Lambda inicia execução assíncrona' },
      { step: '3. Handler executa OK', status: 'success', detail: 'Handler retorna sem exceção. Resultado capturado pelo runtime.' },
      { step: '4. on_success Destination', status: 'success', detail: 'Payload enviado ao destino: { event_original, result, timestamp, requestId }. Inclui input + output + contexto.' },
    ],
  },
  {
    id: 'failure',
    label: 'Falha após retries',
    title: 'Lambda falha → 2 retries → Destination on_failure',
    invocationType: 'Assíncrono (S3, SNS, EventBridge, SDK Event)',
    flow: [
      { step: '1. Evento chega', status: 'normal', detail: 'Mesma origem assíncrona — S3, SNS, EventBridge ou SDK Event' },
      { step: '2. Lambda invocada (1ª tentativa)', status: 'normal', detail: 'Handler executa e levanta exceção (timeout, erro de tool, throttling)' },
      { step: '3. Retry 1 (~1 min depois)', status: 'retry', detail: 'AWS espera ~1 min com backoff exponencial e tenta novamente' },
      { step: '4. Retry 2 (~2 min depois)', status: 'retry', detail: 'Última tentativa automática. Total: 3 invocações (1 inicial + 2 retries)' },
      { step: '5. Todos os retries falharam', status: 'fail', detail: 'Após 3 falhas, AWS desiste das tentativas automáticas' },
      { step: '6. on_failure Destination', status: 'fail', detail: 'Payload completo enviado: { event_original, errorMessage, errorType, stackTrace, requestId }. Sem isso: invocação descartada silenciosamente!' },
    ],
  },
  {
    id: 'dlq-vs-dest',
    label: 'DLQ vs Destinations',
    title: 'DLQ legado vs Destinations moderno — diferença prática',
    invocationType: 'Comparativo',
    flow: [
      { step: 'DLQ (legado)', status: 'normal', detail: 'Apenas SQS ou SNS. Apenas falha. Payload contém SOMENTE o evento original. Sem contexto de erro.' },
      { step: 'Destinations (recomendado)', status: 'normal', detail: 'SQS, SNS, EventBridge OU Lambda. Sucesso E falha. Payload tem evento + resposta + contexto completo (errorMessage, requestId, condition).' },
      { step: 'Quando usar DLQ', status: 'normal', detail: 'Apenas em sistemas legados. Para todo código novo: Destinations.' },
      { step: 'Quando usar Destinations', status: 'success', detail: 'Sempre. Mais rico, mais flexível, suporta orquestração (Lambda → Lambda).' },
    ],
  },
]

function DestinationsFlowVisual() {
  const [selScenario, setSelScenario] = useState<string>('success')
  const [selTarget, setSelTarget] = useState<string>('eb')
  const scenario = DEST_SCENARIOS.find(s => s.id === selScenario)!
  const target = DEST_TARGETS.find(t => t.id === selTarget)!

  return (
    <div style={{ background: BG, border: `1px solid ${LINE}`, borderRadius: 14, padding: 24, fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ marginBottom: 18 }}>
        <h3 style={{ color: FG, margin: 0, fontSize: 16, fontWeight: 800 }}>Lambda Destinations — roteamento de resultados</h3>
        <p style={{ color: FGMUTE, fontSize: 12, margin: '4px 0 0' }}>Para invocações assíncronas: sucesso e falha podem ser roteados para SQS/SNS/EventBridge/Lambda. Substitui a DLQ legada.</p>
      </div>

      {/* Cenários */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
        {DEST_SCENARIOS.map(s => {
          const isSel = s.id === selScenario
          const color = s.id === 'success' ? GRN : s.id === 'failure' ? RED : SKY
          return (
            <button
              key={s.id}
              onClick={() => setSelScenario(s.id)}
              style={{
                background: isSel ? `${color}25` : CARD,
                border: `2px solid ${isSel ? color : LINE}`,
                borderRadius: 10,
                padding: '12px 14px',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'inherit',
                transition: 'all .2s',
              }}
            >
              <div style={{ color: isSel ? color : FG, fontSize: 13, fontWeight: 800, marginBottom: 4 }}>{s.label}</div>
              <div style={{ color: FGMUTE, fontSize: 10, lineHeight: 1.4 }}>{s.invocationType}</div>
            </button>
          )
        })}
      </div>

      {/* Fluxo do cenário */}
      <div style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 12, padding: 18, marginBottom: 14 }}>
        <div style={{ color: C, fontSize: 11, fontWeight: 700, letterSpacing: '.1em', marginBottom: 10 }}>
          {scenario.title}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {scenario.flow.map((step, i) => {
            const stepColor =
              step.status === 'success' ? GRN :
              step.status === 'fail' ? RED :
              step.status === 'retry' ? AMB : FGMUTE
            return (
              <div key={i} style={{
                background: BG,
                borderLeft: `3px solid ${stepColor}`,
                borderRadius: 6,
                padding: '8px 12px',
                display: 'flex',
                gap: 12,
                alignItems: 'flex-start',
              }}>
                <div style={{ color: stepColor, fontSize: 11, fontWeight: 700, minWidth: 200 }}>{step.step}</div>
                <div style={{ color: FGMUTE, fontSize: 11, lineHeight: 1.6, flex: 1 }}>{step.detail}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Destinos disponíveis */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ color: C, fontSize: 11, fontWeight: 700, letterSpacing: '.1em', marginBottom: 10 }}>DESTINOS DISPONIVEIS</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 12 }}>
          {DEST_TARGETS.map(t => {
            const isSel = t.id === selTarget
            return (
              <button
                key={t.id}
                onClick={() => setSelTarget(t.id)}
                style={{
                  background: isSel ? `${t.color}25` : CARD,
                  border: `2px solid ${isSel ? t.color : LINE}`,
                  borderRadius: 10,
                  padding: '12px 10px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  fontFamily: 'inherit',
                  transition: 'all .2s',
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: `${t.color}20`,
                  border: `1.5px solid ${t.color}`,
                  color: t.color,
                  fontSize: 16, fontWeight: 900,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 6px',
                }}>{t.icon}</div>
                <div style={{ color: isSel ? t.color : FG, fontSize: 11, fontWeight: 700 }}>{t.name}</div>
              </button>
            )
          })}
        </div>

        <div style={{
          background: CARD,
          border: `1px solid ${target.color}40`,
          borderLeft: `3px solid ${target.color}`,
          borderRadius: 8,
          padding: '12px 14px',
        }}>
          <div style={{ color: target.color, fontSize: 12, fontWeight: 700, marginBottom: 6 }}>{target.name}</div>
          <div style={{ color: FG, fontSize: 11, lineHeight: 1.6, marginBottom: 8 }}>{target.desc}</div>
          <div style={{
            background: BG,
            borderRadius: 6,
            padding: '8px 12px',
            fontSize: 10,
            color: FGMUTE,
            lineHeight: 1.6,
          }}>
            <span style={{ color: target.color, fontWeight: 700, marginRight: 6 }}>USO TIPICO:</span>
            {target.useCase}
          </div>
        </div>
      </div>

      <div style={{
        background: CARD,
        border: `1px solid ${C}30`,
        borderLeft: `3px solid ${C}`,
        borderRadius: 6,
        padding: '10px 14px',
        fontSize: 11,
        color: FGMUTE,
        lineHeight: 1.6,
      }}>
        <span style={{ color: C, fontWeight: 700, marginRight: 8 }}>Importante</span>
        Destinations só funcionam em invocação <strong style={{ color: FG }}>assíncrona</strong>. Para SQS polling, configure DLQ na fila SQS (não na Lambda). Para Kinesis/DynamoDB Streams, use destinationConfig.onFailure no Event Source Mapping.
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 10 — Lambda Billing Calculator (custom interactive)
// Justificativa: o modelo de cobrança Lambda (requests + GB-seconds com
// granularidade de 1ms + free tier) é abstrato em texto. Calcular em tempo real
// com sliders e ver o consumo do free tier sendo "comido" é radicalmente mais
// didático. Foco em entender custo, não otimizar (já temos Memory Tuning).
// ═══════════════════════════════════════════════════════════════════════════════

const LAMBDA_REQ_PRICE = 0.0000002      // $ por requisição (após free tier)
const LAMBDA_GBS_PRICE = 0.0000166667    // $ por GB-segundo (após free tier)
const FREE_REQUESTS    = 1_000_000        // 1 M req/mês grátis
const FREE_GBS         = 400_000          // 400.000 GB-s/mês grátis

function LambdaBillingVisual() {
  const [memoryMB, setMemoryMB] = useState<number>(512)
  const [durationMs, setDurationMs] = useState<number>(200)
  const [requestsPerMonth, setRequestsPerMonth] = useState<number>(5_000_000)

  const memoryGB = memoryMB / 1024
  const durationS = durationMs / 1000
  const totalGBs = memoryGB * durationS * requestsPerMonth

  // Custo bruto (sem free tier)
  const requestCostGross = requestsPerMonth * LAMBDA_REQ_PRICE
  const computeCostGross = totalGBs * LAMBDA_GBS_PRICE
  const totalGross = requestCostGross + computeCostGross

  // Free tier
  const freeReqUsed = Math.min(requestsPerMonth, FREE_REQUESTS)
  const freeGbsUsed = Math.min(totalGBs, FREE_GBS)
  const freeTierSavings = freeReqUsed * LAMBDA_REQ_PRICE + freeGbsUsed * LAMBDA_GBS_PRICE

  // Custo líquido
  const billableRequests = Math.max(0, requestsPerMonth - FREE_REQUESTS)
  const billableGBs = Math.max(0, totalGBs - FREE_GBS)
  const requestCostNet = billableRequests * LAMBDA_REQ_PRICE
  const computeCostNet = billableGBs * LAMBDA_GBS_PRICE
  const totalNet = requestCostNet + computeCostNet

  const reqFreePct = Math.min(100, (freeReqUsed / FREE_REQUESTS) * 100)
  const gbsFreePct = Math.min(100, (freeGbsUsed / FREE_GBS) * 100)

  const formatUSD = (v: number): string => {
    if (v < 0.01 && v > 0) return `$${v.toFixed(6)}`
    return `$${v.toFixed(2)}`
  }
  const formatNum = (v: number): string => {
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)} M`
    if (v >= 1_000) return `${(v / 1_000).toFixed(1)} K`
    return v.toFixed(0)
  }

  const Slider = ({
    label, value, onChange, min, max, step, suffix, hint,
  }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number; step: number; suffix: string; hint: string }) => {
    const pct = ((value - min) / (max - min)) * 100
    return (
      <div style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 10, padding: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ color: C, fontSize: 10, letterSpacing: '.1em', fontWeight: 700 }}>{label}</span>
          <span style={{ color: FG, fontSize: 18, fontWeight: 900 }}>{value >= 1000 ? formatNum(value) : value}<span style={{ color: FGMUTE, fontSize: 11, marginLeft: 4 }}>{suffix}</span></span>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(parseInt(e.target.value))}
          style={{
            width: '100%',
            height: 5,
            background: `linear-gradient(to right, ${C} 0%, ${C} ${pct}%, ${LINE} ${pct}%, ${LINE} 100%)`,
            borderRadius: 3,
            outline: 'none',
            appearance: 'none',
            cursor: 'pointer',
          }}
        />
        <div style={{ color: FGMUTE, fontSize: 9, marginTop: 6, lineHeight: 1.4 }}>{hint}</div>
      </div>
    )
  }

  return (
    <div style={{ background: BG, border: `1px solid ${LINE}`, borderRadius: 14, padding: 24, fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ marginBottom: 18 }}>
        <h3 style={{ color: FG, margin: 0, fontSize: 16, fontWeight: 800 }}>Calculadora de Custo Lambda</h3>
        <p style={{ color: FGMUTE, fontSize: 12, margin: '4px 0 0' }}>Ajuste memória, duração e volume — veja como o free tier é consumido e o custo final é calculado em tempo real.</p>
      </div>

      {/* Sliders */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
        <Slider
          label="MEMORIA"
          value={memoryMB}
          onChange={setMemoryMB}
          min={128}
          max={10240}
          step={64}
          suffix="MB"
          hint={`${memoryGB.toFixed(2)} GB · CPU proporcional (1 vCPU @ 1769 MB)`}
        />
        <Slider
          label="DURACAO POR INVOCACAO"
          value={durationMs}
          onChange={setDurationMs}
          min={10}
          max={15000}
          step={10}
          suffix="ms"
          hint={`${durationS.toFixed(3)} s · cobrado por ms (granularidade fina)`}
        />
        <Slider
          label="REQUISICOES POR MES"
          value={requestsPerMonth}
          onChange={setRequestsPerMonth}
          min={100_000}
          max={100_000_000}
          step={100_000}
          suffix=""
          hint={`${formatNum(requestsPerMonth)} invocações/mês`}
        />
      </div>

      {/* Free tier consumption */}
      <div style={{
        background: CARD,
        border: `1px solid ${LINE}`,
        borderRadius: 12,
        padding: 16,
        marginBottom: 14,
      }}>
        <div style={{ color: GRN, fontSize: 10, letterSpacing: '.15em', fontWeight: 700, marginBottom: 12 }}>FREE TIER (sempre grátis — não expira)</div>

        <div style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: FGMUTE, marginBottom: 4 }}>
            <span>Requisições — {formatNum(freeReqUsed)} de {formatNum(FREE_REQUESTS)} usadas</span>
            <span style={{ color: reqFreePct >= 100 ? RED : GRN, fontWeight: 700 }}>{reqFreePct.toFixed(1)}%</span>
          </div>
          <div style={{ background: BG, height: 12, borderRadius: 6, overflow: 'hidden', border: `1px solid ${LINE}` }}>
            <div style={{
              background: `linear-gradient(90deg, ${GRN}, ${reqFreePct >= 100 ? RED : GRN})`,
              height: '100%',
              width: `${reqFreePct}%`,
              transition: 'width .3s',
            }} />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: FGMUTE, marginBottom: 4 }}>
            <span>Compute (GB-s) — {formatNum(freeGbsUsed)} de {formatNum(FREE_GBS)} usados</span>
            <span style={{ color: gbsFreePct >= 100 ? RED : GRN, fontWeight: 700 }}>{gbsFreePct.toFixed(1)}%</span>
          </div>
          <div style={{ background: BG, height: 12, borderRadius: 6, overflow: 'hidden', border: `1px solid ${LINE}` }}>
            <div style={{
              background: `linear-gradient(90deg, ${GRN}, ${gbsFreePct >= 100 ? RED : GRN})`,
              height: '100%',
              width: `${gbsFreePct}%`,
              transition: 'width .3s',
            }} />
          </div>
        </div>

        <div style={{ marginTop: 10, fontSize: 10, color: FGMUTE, lineHeight: 1.6 }}>
          Você consume {formatNum(totalGBs)} GB-s/mês neste workload — {gbsFreePct >= 100 ? 'free tier ESGOTADO de compute, paga pelo excedente' : 'ainda dentro do free tier'}.
        </div>
      </div>

      {/* Cálculo */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        <div style={{ background: CARD, border: `2px solid ${SKY}40`, borderRadius: 10, padding: '14px 16px' }}>
          <div style={{ color: SKY, fontSize: 10, letterSpacing: '.1em', fontWeight: 700, marginBottom: 8 }}>CUSTO POR REQUEST</div>
          <div style={{ fontSize: 11, color: FGMUTE, lineHeight: 1.7, fontFamily: "'JetBrains Mono', monospace" }}>
            <div>Bruto: {formatNum(requestsPerMonth)} × $0.0000002 = <span style={{ color: FG }}>{formatUSD(requestCostGross)}</span></div>
            <div style={{ color: GRN }}>− Free: {formatNum(freeReqUsed)} grátis</div>
            <div style={{ borderTop: `1px solid ${LINE}`, marginTop: 4, paddingTop: 4 }}>
              <strong style={{ color: SKY }}>= {formatUSD(requestCostNet)}</strong>
            </div>
          </div>
        </div>

        <div style={{ background: CARD, border: `2px solid ${PRP}40`, borderRadius: 10, padding: '14px 16px' }}>
          <div style={{ color: PRP, fontSize: 10, letterSpacing: '.1em', fontWeight: 700, marginBottom: 8 }}>CUSTO DE COMPUTE (GB-s)</div>
          <div style={{ fontSize: 11, color: FGMUTE, lineHeight: 1.7, fontFamily: "'JetBrains Mono', monospace" }}>
            <div>Bruto: {formatNum(totalGBs)} × $0.0000167 = <span style={{ color: FG }}>{formatUSD(computeCostGross)}</span></div>
            <div style={{ color: GRN }}>− Free: {formatNum(freeGbsUsed)} GB-s grátis</div>
            <div style={{ borderTop: `1px solid ${LINE}`, marginTop: 4, paddingTop: 4 }}>
              <strong style={{ color: PRP }}>= {formatUSD(computeCostNet)}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Total final */}
      <div style={{
        background: `linear-gradient(135deg, ${C}15, ${C}05)`,
        border: `2px solid ${C}`,
        borderRadius: 12,
        padding: '18px 20px',
        marginBottom: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ color: C, fontSize: 10, letterSpacing: '.15em', fontWeight: 700, marginBottom: 4 }}>CUSTO MENSAL TOTAL</div>
          <div style={{ color: FGMUTE, fontSize: 11 }}>
            {totalNet === 0 ? 'Você está dentro do free tier — custo zero!' : `Você economizou ${formatUSD(freeTierSavings)} via free tier`}
          </div>
        </div>
        <div style={{ color: FG, fontSize: 32, fontWeight: 900, fontFamily: "'JetBrains Mono', monospace" }}>
          {formatUSD(totalNet)}
        </div>
      </div>

      {/* Fórmula */}
      <div style={{
        background: CARD,
        border: `1px solid ${C}30`,
        borderLeft: `3px solid ${C}`,
        borderRadius: 6,
        padding: '10px 14px',
        fontSize: 10,
        color: FGMUTE,
        lineHeight: 1.7,
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        <div style={{ color: C, fontWeight: 700, marginBottom: 4, letterSpacing: '.1em' }}>FORMULA</div>
        custo = max(0, requests − 1M) × $0.0000002 + max(0, GB-s − 400K) × $0.0000167<br/>
        onde GB-s = (memória_MB / 1024) × (duração_ms / 1000) × requests
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export default function LambdaVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'cold-start',
      title: 'Anatomia do Cold Start',
      subtitle: 'As 3 fases — Init, Invoke, Shutdown — e o que executa em cada uma',
      accent: C,
      component: <ColdStartAnatomyVisual />,
    },
    {
      id: 'lifecycle',
      title: 'Execution Environment',
      subtitle: 'Estados cold → init → invoking → frozen → destroyed com transições',
      accent: C,
      component: (
        <StateMachineExplorer
          states={EXEC_STATES}
          transitions={EXEC_TRANSITIONS}
          initialState="cold"
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          title="Ciclo de vida do execution environment"
          description="Container e reutilizado entre invocacoes (warm). Sem invocacoes por ~15 min, container e destruido."
        />
      ),
    },
    {
      id: 'sources',
      title: 'Event Sources',
      subtitle: 'API Gateway, S3, SNS, SQS, Kinesis, DynamoDB Streams — retry e ordenação',
      accent: C,
      component: (
        <ComparisonTable
          options={SOURCE_OPTIONS}
          criteria={SOURCE_CRITERIA}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          title="Fontes de evento — comportamento de retry, ordem e batching"
          description="Cada fonte tem semântica diferente. Confundir polling (SQS) com assíncrono (SNS) leva a bugs sutis."
        />
      ),
    },
    {
      id: 'concurrency',
      title: 'Concorrência',
      subtitle: 'Default vs Reserved vs Provisioned — três conceitos opostos',
      accent: C,
      component: <ConcurrencyVisual />,
    },
    {
      id: 'memory',
      title: 'Memória vs CPU',
      subtitle: 'Slider interativo: como memória afeta CPU, duração e custo',
      accent: C,
      component: <MemoryTuningVisual />,
    },
    {
      id: 'compute',
      title: 'Lambda vs ECS vs EC2',
      subtitle: 'Árvore de decisão: quando Lambda perde para ECS Fargate ou EC2',
      accent: C,
      component: (
        <DecisionTree
          root={COMPUTE_ROOT}
          nodes={COMPUTE_NODES}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          title="Lambda é a escolha certa?"
          description="Lambda brilha em event-driven curto. Para workload contínuo de alto volume, ECS Fargate é mais barato."
        />
      ),
    },
    {
      id: 'vpc',
      title: 'Lambda em VPC',
      subtitle: 'Penalidade de cold start, NAT Gateway vs VPC Endpoints',
      accent: C,
      component: <VpcPenaltyVisual />,
    },
    {
      id: 'antipatterns',
      title: 'Anti-patterns',
      subtitle: 'Os 6 erros que mais derrubam Lambda em produção',
      accent: C,
      component: (
        <AntiPatternsGallery
          patterns={LAMBDA_ANTIPATTERNS}
          accentColor={C}
          bgColor={BG}
          label="Lambda — armadilhas comuns"
          heading="Os 6 erros que mais derrubam Lambda em produção"
          description="Cada anti-pattern com diff de Terraform/TypeScript e explicação técnica."
          whyLabel="POR QUE ISSO QUEBRA"
        />
      ),
    },
    {
      id: 'destinations',
      title: 'Destinations Flow',
      subtitle: 'Roteamento on_success / on_failure para SQS / SNS / EventBridge / Lambda',
      accent: C,
      component: <DestinationsFlowVisual />,
    },
    {
      id: 'billing',
      title: 'Calculadora de Custo',
      subtitle: 'Ajuste memória, duração e volume — veja o cálculo de GB-s e free tier em tempo real',
      accent: C,
      component: <LambdaBillingVisual />,
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
