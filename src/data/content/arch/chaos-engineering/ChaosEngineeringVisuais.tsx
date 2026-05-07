'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { ProgressionMap } from '@/components/visuals/ProgressionMap'
import type { ProgressionLevel } from '@/components/visuals/ProgressionMap'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'

// ── Paleta Chaos Engineering ──────────────────────────────────────────────────
const C      = '#f97316'   // orange — failure/alert
const BG     = '#0f172a'
const CARD   = '#1e293b'
const CARD2  = '#243044'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#4ade80'
const RED    = '#ef4444'
const AMB    = '#f59e0b'
const PRP    = '#a78bfa'
const SKY    = '#38bdf8'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Experiment Flow (custom interactive)
// Justificativa: o fluxo de 5 etapas tem abort conditions e estados de decisão
// ("hipótese refutada → corrija e re-teste") que um fluxograma interativo ensina
// melhor que texto. Ver o estado mudar ao clicar no passo é diferente de ler.
// ═══════════════════════════════════════════════════════════════════════════════

type Step = {
  id: number
  label: string
  subtitle: string
  color: string
  detail: string
  example: string
  abortIf?: string
}

const EXPERIMENT_STEPS: Step[] = [
  {
    id: 1,
    label: 'Definir Steady State',
    subtitle: 'Métrica mensurável de sistema saudável',
    color: SKY,
    detail: 'Defina o que "saudável" significa em termos de métrica quantitativa. Deve ser observável em tempo real. Exemplos: P99 < 300ms, error rate < 0.1%, throughput > 1000 req/s. Sem steady state, você não saberá se a falha injetada causou degradação.',
    example: 'rate(http_requests_total{status="5xx"}[5m]) < 0.001',
    abortIf: 'Steady state não for mensurável → não continue. Resolva observability primeiro.',
  },
  {
    id: 2,
    label: 'Formular Hipótese',
    subtitle: 'Afirmação testável sobre resiliência',
    color: GRN,
    detail: 'Escreva a hipótese de forma explícita: "Esperamos que o sistema mantenha steady state quando [evento adverso] acontecer." A hipótese guia o design do experimento e torna o aprendizado estruturado. Sem hipótese, chaos é sabotagem.',
    example: '"Sistema mantém P99 < 300ms quando 1 instância do serviço API é terminada."',
  },
  {
    id: 3,
    label: 'Definir Blast Radius',
    subtitle: 'Escopo mínimo possível',
    color: AMB,
    detail: 'Determine o menor escopo possível para o experimento: 1 instância, 1% de tráfego, 1 AZ. Configure abort conditions: se steady state degradar além de N%, experimento para automaticamente e rollback é executado. Defina duração máxima (TTL).',
    example: 'targets: 1 instância; abort if: P99 > 500ms; TTL: 15 minutos',
    abortIf: 'Blast radius não tiver abort condition automático → risco alto. Configure kill switch.',
  },
  {
    id: 4,
    label: 'Injetar Falha',
    subtitle: 'Executar o experimento controlado',
    color: RED,
    detail: 'Execute o experimento com equipe disponível (horário comercial), monitorando steady state em tempo real. Kill switch manual disponível. Mantenha o blast radius mínimo até validar a hipótese. Documente métricas a cada minuto.',
    example: 'aws fis start-experiment --experiment-template-id $TEMPLATE_ID',
    abortIf: 'Steady state degradar além do limite → abortar imediatamente. Não espere para ver o que acontece.',
  },
  {
    id: 5,
    label: 'Observar e Aprender',
    subtitle: 'Confirmar ou refutar a hipótese',
    color: PRP,
    detail: 'Hipótese confirmada? Sistema é resiliente a esse cenário. Hipótese refutada? Fraqueza encontrada — documente, corrija, e re-teste. A fraqueza encontrada é o valor do programa. Registre hipótese, método, resultado e ações corretivas na wiki.',
    example: 'POST /chaos-experiments { hypothesis, method, result, findings, actions }',
  },
]

function ExperimentFlowVisual() {
  const [active, setActive] = useState(0)
  const step = EXPERIMENT_STEPS[active]

  return (
    <div style={{ display: 'flex', gap: 24, height: '100%', minHeight: 420 }}>
      {/* Steps nav */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 200, flexShrink: 0 }}>
        {EXPERIMENT_STEPS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setActive(i)}
            style={{
              background: active === i ? CARD2 : CARD,
              border: `2px solid ${active === i ? s.color : LINE}`,
              borderRadius: 10,
              padding: '10px 14px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all .2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%',
                background: active === i ? s.color : '#334155',
                color: active === i ? '#0f172a' : FGMUTE,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, flexShrink: 0,
              }}>
                {s.id}
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: active === i ? s.color : FG }}>
                {s.label}
              </span>
            </div>
            <div style={{ fontSize: 10, color: FGMUTE, paddingLeft: 32 }}>
              {s.subtitle}
            </div>
          </button>
        ))}
      </div>

      {/* Detail panel */}
      <div style={{ flex: 1, background: CARD, borderRadius: 12, padding: 24, border: `2px solid ${step.color}`, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: step.color, color: '#0f172a',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 700, flexShrink: 0,
            }}>
              {step.id}
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: step.color }}>{step.label}</div>
              <div style={{ fontSize: 12, color: FGMUTE }}>{step.subtitle}</div>
            </div>
          </div>
          <p style={{ fontSize: 13, color: FG, lineHeight: 1.65, margin: 0 }}>{step.detail}</p>
        </div>

        <div style={{ background: BG, borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: FGMUTE, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 6 }}>Exemplo</div>
          <code style={{ fontSize: 12, color: SKY, fontFamily: 'JetBrains Mono, monospace' }}>{step.example}</code>
        </div>

        {step.abortIf && (
          <div style={{ background: '#1f0a0a', border: `1px solid ${RED}`, borderRadius: 8, padding: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: RED, letterSpacing: '.08em', marginBottom: 4 }}>ABORT CONDITION</div>
            <div style={{ fontSize: 12, color: '#fca5a5' }}>{step.abortIf}</div>
          </div>
        )}

        {/* Progress dots */}
        <div style={{ marginTop: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          {EXPERIMENT_STEPS.map((s, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                width: i === active ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: i === active ? step.color : LINE,
                border: 'none', cursor: 'pointer',
                transition: 'all .2s',
                padding: 0,
              }}
            />
          ))}
          <span style={{ marginLeft: 8, fontSize: 11, color: FGMUTE }}>{active + 1} / {EXPERIMENT_STEPS.length}</span>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Maturidade do Programa (ProgressionMap)
// Justificativa: a jornada de maturidade de chaos tem níveis com conceitos
// específicos por nível. ProgressionMap mostra claramente a sequência sem pular
// etapas — algo que tabelas ou parágrafos não transmitem tão bem.
// ═══════════════════════════════════════════════════════════════════════════════

const MATURITY_LEVELS: ProgressionLevel[] = [
  {
    id: 'nivel-0',
    name: 'Nível 0',
    label: 'Sem Chaos',
    emoji: '🔴',
    concepts: [
      { name: 'Sem observability', tip: 'Você não sabe o que está rodando. Métricas básicas são o primeiro passo.' },
      { name: 'Sem runbook', tip: 'Quando incidente acontece, improviso. O time não sabe o que fazer.' },
      { name: 'On-call informal', tip: 'Quem responde a incidente é o dev que ainda está acordado.' },
    ],
  },
  {
    id: 'nivel-1',
    name: 'Nível 1',
    label: 'Game Day',
    emoji: '🟡',
    concepts: [
      { name: 'Observability básica', tip: 'Prometheus + Grafana rodando. Você consegue ver P99 e error rate.' },
      { name: 'Primeiro game day em staging', tip: 'Equipe reunida, cenário combinado, nenhum risco real. Aprenda os gaps.' },
      { name: 'Runbook escrito e testado', tip: 'O game day revela gaps no runbook. Corrija antes de ir para prod.' },
      { name: 'Hipótese e steady state definidos', tip: 'Game day sem hipótese é teatro. Defina o critério de sucesso antes.' },
    ],
  },
  {
    id: 'nivel-2',
    name: 'Nível 2',
    label: 'Chaos Manual em Prod',
    emoji: '🟠',
    concepts: [
      { name: 'Blast radius 1% controlado', tip: '1 instância, 1% tráfego. Kill switch manual disponível e testado.' },
      { name: 'Abort conditions configuradas', tip: 'Se P99 > threshold → pare automaticamente. Não confie só em humano.' },
      { name: 'Comunicação prévia a stakeholders', tip: 'Anuncie data, horário, escopo. Nenhuma surpresa para gerência.' },
      { name: 'Post-experiment review', tip: 'Documente resultado na wiki: hipótese, método, resultado, ações.' },
    ],
  },
  {
    id: 'nivel-3',
    name: 'Nível 3',
    label: 'Chaos Automatizado',
    emoji: '🔵',
    concepts: [
      { name: 'Chaos integrado ao CI/CD', tip: 'Experimentos rodam automaticamente após deploy. Gate de qualidade.' },
      { name: 'Cobertura por serviço monitorada', tip: 'Dashboard mostra quais serviços foram testados recentemente.' },
      { name: 'Regressão automática', tip: 'Fraqueza corrigida → experimento que a descobriu vira teste de regressão.' },
      { name: 'Ferramentas: LitmusChaos / Chaos Mesh', tip: 'CRDs Kubernetes declarativos. Experimentos versionados no git.' },
    ],
  },
  {
    id: 'nivel-4',
    name: 'Nível 4',
    label: 'Chaos Contínuo',
    emoji: '🟢',
    concepts: [
      { name: 'Chaos Monkey em horário comercial', tip: 'Instâncias terminadas diariamente. O time nem percebe mais — é o estado normal.' },
      { name: 'Error budget para chaos', tip: 'SLO-driven: quanto budget gastar em chaos vs risco de incidente real.' },
      { name: 'Game day para cenários complexos', tip: 'Automação cobre cotidiano; game day cobre queda de datacenter, DDoS.' },
      { name: 'Cultura blameless consolidada', tip: 'Falha em experimento não gera punição. Toda fraqueza é oportunidade.' },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Ferramentas por Dimensão (ComparisonTable)
// Justificativa: 6 ferramentas em 5 dimensões simultâneas (ambiente alvo,
// managed vs OSS, tipo de falha, complexidade, custo) é impossível de comparar
// mentalmente em texto. A tabela interativa deixa ver qual vence por critério.
// ═══════════════════════════════════════════════════════════════════════════════

const TOOLS_OPTIONS: ComparisonOption[] = [
  { id: 'monkey', label: 'Chaos Monkey', sublabel: 'Netflix OSS', color: C },
  { id: 'fis',    label: 'AWS FIS',      sublabel: 'Managed AWS', color: AMB },
  { id: 'litmus', label: 'LitmusChaos',  sublabel: 'CNCF OSS',    color: SKY },
  { id: 'mesh',   label: 'Chaos Mesh',   sublabel: 'CNCF OSS',    color: PRP },
  { id: 'gremlin',label: 'Gremlin',      sublabel: 'SaaS Pago',   color: GRN },
  { id: 'toxi',   label: 'Toxiproxy',    sublabel: 'Dev/Test',    color: '#94a3b8' },
]

const TOOLS_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'env',
    label: 'Ambiente Alvo',
    description: 'Onde o caos é injetado',
    values: {
      monkey:  { rating: 'fair',      note: 'Apenas EC2 AWS' },
      fis:     { rating: 'excellent', note: 'EC2, ECS, EKS, RDS, ASG' },
      litmus:  { rating: 'good',      note: 'Kubernetes-native' },
      mesh:    { rating: 'good',      note: 'Kubernetes-native' },
      gremlin: { rating: 'excellent', note: 'AWS, GCP, Azure, K8s, bare-metal' },
      toxi:    { rating: 'fair',      note: 'Apenas rede local (proxy TCP)' },
    },
  },
  {
    id: 'types',
    label: 'Tipos de Falha',
    description: 'Variedade de ataques disponíveis',
    values: {
      monkey:  { rating: 'poor',      note: 'Só terminar instância EC2' },
      fis:     { rating: 'good',      note: 'Instância, rede, CPU, RDS failover' },
      litmus:  { rating: 'good',      note: 'PodChaos, NetworkChaos, IOChaos, CPUStress' },
      mesh:    { rating: 'excellent', note: 'Pod, rede, I/O, kernel, HTTP fault injection' },
      gremlin: { rating: 'excellent', note: 'CPU, memória, disco, rede, processo, DNS, relógio' },
      toxi:    { rating: 'fair',      note: 'Latência, bandwidth, slow close, timeout' },
    },
  },
  {
    id: 'setup',
    label: 'Facilidade de Setup',
    description: 'Curva de aprendizado inicial',
    values: {
      monkey:  { rating: 'fair',  note: 'Config básica mas limitada' },
      fis:     { rating: 'good',  note: 'Console AWS, IAM necessário' },
      litmus:  { rating: 'fair',  note: 'CRDs Kubernetes, Argo opcional' },
      mesh:    { rating: 'fair',  note: 'CRDs Kubernetes, web UI disponível' },
      gremlin: { rating: 'excellent', note: 'SaaS, UI visual, onboarding rápido' },
      toxi:    { rating: 'excellent', note: 'npm install, API REST simples' },
    },
  },
  {
    id: 'cost',
    label: 'Custo',
    description: 'Investimento financeiro',
    values: {
      monkey:  { rating: 'excellent', note: 'Open-source, gratuito' },
      fis:     { rating: 'good',      note: 'Pay-per-use AWS, baixo custo' },
      litmus:  { rating: 'excellent', note: 'Open-source, gratuito' },
      mesh:    { rating: 'excellent', note: 'Open-source, gratuito' },
      gremlin: { rating: 'poor',      note: 'SaaS pago, caro para equipes pequenas' },
      toxi:    { rating: 'excellent', note: 'Open-source, gratuito' },
    },
  },
  {
    id: 'maturity',
    label: 'Maturidade / Produção',
    description: 'Confiança para uso em produção',
    values: {
      monkey:  { rating: 'good',      note: 'Netflix usa em prod há 10+ anos' },
      fis:     { rating: 'excellent', note: 'AWS gerenciado, SLA de produto' },
      litmus:  { rating: 'good',      note: 'CNCF incubating, adoção crescente' },
      mesh:    { rating: 'good',      note: 'CNCF incubating, interface web madura' },
      gremlin: { rating: 'excellent', note: 'Fundada por ex-Netflix/Amazon, battle-tested' },
      toxi:    { rating: 'fair',      note: 'Excelente para dev, não recomendado em prod' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Pré-requisitos como LayerStack
// Justificativa: os pré-requisitos de chaos têm ordem de dependência real —
// você não pode ter on-call sem observability, não pode ter chaos sem on-call.
// LayerStack mostra essa hierarquia de fundação de forma visualmente clara.
// ═══════════════════════════════════════════════════════════════════════════════

const PREREQ_LAYERS: Layer[] = [
  {
    id: 'chaos-auto',
    label: 'Chaos Automático',
    sublabel: 'Topo — maturidade máxima',
    description: 'Chaos Monkey, LitmusChaos, Chaos Mesh rodando continuamente. Experimentos como gates de PR. Cobertura de 100% dos serviços críticos.',
    code: 'litmus.run({ schedule: "0 10 * * 1-5", blast: "1%" })',
    color: C,
    examples: ['Chaos Monkey diário', 'LitmusChaos CI gate', 'Error budget tracking'],
  },
  {
    id: 'chaos-manual',
    label: 'Chaos Manual em Prod',
    sublabel: 'Blast radius 1%, hipótese explícita',
    description: 'Primeiros experimentos em produção com blast radius mínimo. Kill switch manual disponível. Comunicação prévia a stakeholders. Abort conditions configuradas.',
    code: 'aws fis start-experiment --template $ID --tags blast=1pct',
    color: AMB,
    examples: ['AWS FIS com abort', 'Toxiproxy em staging real', 'Comunicação prévia'],
  },
  {
    id: 'game-day',
    label: 'Game Day em Staging',
    sublabel: 'Exercício coordenado, sem risco real',
    description: 'Primeiro contato com chaos. Time reunido, cenário combinado, sem risco de produção. Identifica gaps de runbook e observability antes de ir para prod.',
    code: '// game-day.yaml: scenario, participants, hypothesis, abort-plan',
    color: GRN,
    examples: ['Staging isolado', 'Todo o time presente', 'Runbook testado ao vivo'],
  },
  {
    id: 'rollback',
    label: 'Rollback Confiável',
    sublabel: 'Kill switch + feature flags + deploy rápido',
    description: 'Sem rollback confiável, você não tem coragem de injetar falha. Feature flags, kill switches automáticos e deploy em < 5 minutos são obrigatórios.',
    code: 'launchDarkly.kill("chaos-experiment")',
    color: SKY,
    examples: ['Feature flags', 'Blue/green deploy', 'Rollback < 5 min'],
  },
  {
    id: 'oncall',
    label: 'On-Call Funcional',
    sublabel: 'Rotação, runbook, SLA de resposta',
    description: 'Chaos em sistema sem on-call gera incidente que ninguém sabe responder. Runbooks escritos, rotação ativa, SLA de resposta definido (ex: 15 minutos).',
    code: '// runbook/api-down.md: steps, escalation, rollback',
    color: PRP,
    examples: ['PagerDuty configurado', 'Runbook versionado', 'Rotação semanal'],
  },
  {
    id: 'observability',
    label: 'Observability',
    sublabel: 'Fundação — sem isso, não comece',
    description: 'Sem métricas, logs e traces, você não vê o impacto do experimento. Dashboards Grafana, alertas Prometheus e correlação de traces são o piso mínimo.',
    code: 'rate(http_requests_total{status="5xx"}[5m]) // steady state',
    color: '#94a3b8',
    examples: ['Prometheus + Grafana', 'Jaeger/Tempo (traces)', 'Alertmanager'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export default function ChaosEngineeringVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'experiment-flow',
      title: 'Fluxo do Experimento',
      subtitle: '5 passos do método científico aplicado a sistemas distribuídos',
      accent: C,
      component: <ExperimentFlowVisual />,
    },
    {
      id: 'maturity-map',
      title: 'Jornada de Maturidade',
      subtitle: 'Do zero ao chaos contínuo — sem pular etapas',
      accent: C,
      component: (
        <ProgressionMap
          levels={MATURITY_LEVELS}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'tools-comparison',
      title: 'Ferramentas Comparadas',
      subtitle: 'Qual ferramenta usar para cada contexto — 5 dimensões',
      accent: C,
      component: (
        <ComparisonTable
          options={TOOLS_OPTIONS}
          criteria={TOOLS_CRITERIA}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'prereq-layers',
      title: 'Pré-requisitos em Camadas',
      subtitle: 'Hierarquia de fundação — cada camada depende da anterior',
      accent: C,
      component: (
        <LayerStack
          layers={PREREQ_LAYERS}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          direction="bottom-up"
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
