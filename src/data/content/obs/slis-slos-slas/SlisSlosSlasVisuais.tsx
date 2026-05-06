'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { DecisionTree } from '@/components/visuals/DecisionTree'
import type { DTNode } from '@/components/visuals/DecisionTree'

// ── Paleta SLIs/SLOs/SLAs ──────────────────────────────────────────────────────
const C      = '#10B981'   // verde confiabilidade/SRE
const C2     = '#059669'   // secondary
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
const ORG    = '#f97316'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Hierarquia SLI → SLO → SLA → Error Budget (LayerStack)
// ═══════════════════════════════════════════════════════════════════════════════

const HIERARCHY_LAYERS: Layer[] = [
  {
    id: 'sla',
    label: 'SLA — Service Level Agreement',
    sublabel: 'Contrato externo com o cliente',
    description: 'Contrato legal com penalidades (créditos, reembolso). Sempre mais frouxo que o SLO interno — precisa de margem de segurança. Violação de SLA = processo legal + reputação. Você só assina SLA de 99,9% se seu SLO interno é 99,95% ou mais.',
    color: PRP,
    icon: '📄',
    examples: ['99,9% uptime mensal (contrato com cliente)', 'Crédito de 10% por cada hora de downtime acima do SLA', 'SLA mais frouxo que SLO: margem de proteção'],
  },
  {
    id: 'slo',
    label: 'SLO — Service Level Objective',
    sublabel: 'Meta interna da equipe',
    description: 'Meta quantitativa para o SLI em janela de tempo. Define quanto do error budget você tem disponível. Mais apertado = menos espaço para mudanças. Comece conservador (99,5%), meça o histórico real, aperte gradualmente. SLO deve ser mais rigoroso que o SLA.',
    color: C,
    icon: '🎯',
    examples: ['99,95% de requests com sucesso nos últimos 30 dias', 'p95 de latência ≤ 500ms', 'Taxa de erros ≤ 0,05% na janela rolling'],
  },
  {
    id: 'sli',
    label: 'SLI — Service Level Indicator',
    sublabel: 'A métrica que mede confiabilidade',
    description: 'Proporção de bons eventos sobre total. Sempre uma razão, não um valor absoluto. SLIs ruins: CPU usage, memory (métricas de recurso, não de experiência). SLI deve refletir o que o usuário sente.',
    color: SKY,
    icon: '📊',
    examples: ['(requests 2xx) / (total requests)', '(requests < 200ms) / (total requests)', '(minutos com uptime) / (total minutos)'],
  },
  {
    id: 'budget',
    label: 'Error Budget',
    sublabel: 'Recurso para inovação e velocidade',
    description: '100% − SLO target. Com SLO de 99,9% em 30 dias = ~43 minutos de downtime tolerado. Budget é consumido por incidentes, deploys com problema, manutenção. Budget restante = licença para velocity. Budget zerado = feature freeze + sprint de reliability.',
    color: AMB,
    icon: '💰',
    examples: ['SLO 99,9% → 43 min de downtime/mês', 'SLO 99,99% → 4,3 min de downtime/mês', 'Budget zerado = feature freeze obrigatório'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Cálculo de disponibilidade interativo (componente custom)
// Mostra o impacto real de cada "nove" em minutos por mês e por ano
// ═══════════════════════════════════════════════════════════════════════════════

const AVAILABILITY_TIERS = [
  { slo: '90%',     nines: 1, monthly: 4320, yearly: 52560, color: RED,   badge: 'Não aceitável para produção', burnRate: 10    },
  { slo: '95%',     nines: 1.3, monthly: 2160, yearly: 26280, color: ORG,  badge: 'Sistemas internos não críticos', burnRate: 20   },
  { slo: '99%',     nines: 2, monthly: 432,  yearly: 5256,  color: AMB,   badge: 'Aceitável para serviços não críticos', burnRate: 100  },
  { slo: '99,5%',   nines: 2.5, monthly: 216, yearly: 2628, color: '#d97706', badge: 'Ponto de partida recomendado', burnRate: 200  },
  { slo: '99,9%',   nines: 3, monthly: 43.2, yearly: 526,  color: C,     badge: 'Padrão de mercado (3 noves)', burnRate: 1000  },
  { slo: '99,95%',  nines: 3.5, monthly: 21.6, yearly: 263, color: '#34d399', badge: 'APIs críticas de negócio', burnRate: 2000  },
  { slo: '99,99%',  nines: 4, monthly: 4.3,  yearly: 52.6, color: '#6ee7b7', badge: 'Serviços de pagamento/saúde', burnRate: 10000 },
  { slo: '99,999%', nines: 5, monthly: 0.43, yearly: 5.26, color: '#a7f3d0', badge: 'Infraestrutura crítica (caríssimo)', burnRate: 100000 },
]

function AvailabilityVisual() {
  const [selected, setSelected] = useState<number>(4) // 99,9% selecionado por default
  const sel = AVAILABILITY_TIERS[selected]
  const maxMonthly = AVAILABILITY_TIERS[0].monthly

  function fmtMinutes(m: number): string {
    if (m >= 60) {
      const h = Math.floor(m / 60)
      const min = Math.round(m % 60)
      return min > 0 ? `${h}h ${min}min` : `${h}h`
    }
    if (m >= 1) return `${m.toFixed(1)} min`
    return `${(m * 60).toFixed(0)} seg`
  }

  return (
    <div style={{ display: 'flex', gap: 20, height: '100%', minHeight: 520 }}>
      {/* Lista de tiers */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: 200, flexShrink: 0 }}>
        <div style={{ fontSize: 10, color: FGMUTE, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 }}>
          Selecione o SLO
        </div>
        {AVAILABILITY_TIERS.map((tier, i) => (
          <button
            key={tier.slo}
            onClick={() => setSelected(i)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
              borderRadius: 8, cursor: 'pointer', textAlign: 'left',
              background: selected === i ? `${tier.color}20` : CARD,
              border: `1.5px solid ${selected === i ? tier.color : LINE}`,
              transition: 'all 0.15s',
            }}
          >
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700,
              color: tier.color, flexShrink: 0, minWidth: 60,
            }}>{tier.slo}</span>
            <span style={{ fontSize: 10, color: FGMUTE, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {tier.nines} nove{tier.nines !== 1 ? 's' : ''}
            </span>
          </button>
        ))}
      </div>

      {/* Painel de detalhes */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Header */}
        <div style={{ background: CARD, borderRadius: 12, padding: 20, border: `1.5px solid ${sel.color}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
            <div style={{
              fontSize: 32, fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 800, color: sel.color,
            }}>{sel.slo}</div>
            <div>
              <div style={{ fontSize: 12, color: FGMUTE }}>{sel.nines} {sel.nines === 1 ? 'nove' : 'noves'} de disponibilidade</div>
              <div style={{
                display: 'inline-block', marginTop: 4, fontSize: 10, fontWeight: 700,
                padding: '2px 8px', borderRadius: 5, background: `${sel.color}20`,
                color: sel.color, border: `1px solid ${sel.color}40`,
              }}>{sel.badge}</div>
            </div>
          </div>

          {/* Barra de downtime */}
          <div style={{ marginBottom: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 10, color: FGMUTE, textTransform: 'uppercase', letterSpacing: '.06em' }}>Downtime permitido por mês</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: FG, fontFamily: "'JetBrains Mono', monospace" }}>{fmtMinutes(sel.monthly)}</span>
            </div>
            <div style={{ height: 10, background: LINE, borderRadius: 5, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 5, background: sel.color,
                width: `${Math.min(100, (sel.monthly / maxMonthly) * 100)}%`,
                transition: 'width 0.4s',
              }} />
            </div>
          </div>
        </div>

        {/* Métricas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { label: 'Downtime / mês', value: fmtMinutes(sel.monthly), color: sel.color },
            { label: 'Downtime / ano', value: fmtMinutes(sel.yearly), color: sel.color },
            { label: 'Error budget /mês', value: `${((sel.monthly / (30 * 24 * 60)) * 100).toFixed(3)}%`, color: AMB },
            { label: 'Burn rate crítico', value: `${sel.burnRate}× mais rápido`, color: RED },
          ].map(m => (
            <div key={m.label} style={{ background: CARD, borderRadius: 10, padding: 16, border: `1px solid ${LINE}` }}>
              <div style={{ fontSize: 10, color: FGMUTE, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.06em' }}>{m.label}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: m.color, fontFamily: "'JetBrains Mono', monospace" }}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* Insight */}
        <div style={{ background: CARD, borderRadius: 10, padding: 16, border: `1px solid ${LINE}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: FGMUTE, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.06em' }}>Por que cada nove custa exponencialmente mais</div>
          <div style={{ fontSize: 13, color: FG, lineHeight: 1.7 }}>
            De 99% para 99,9%: o downtime mensal cai de <span style={{ color: AMB, fontWeight: 700 }}>432min</span> para <span style={{ color: C, fontWeight: 700 }}>43min</span> — melhoria 10×.
            Mas a infra necessária para chegar de 99,9% para 99,99% (de 43min para 4,3min) exige
            redundância ativa-ativa, chaos engineering contínuo e SRE dedicado — custo 10–100× maior.
            <strong style={{ color: C }}> O ponto de inflexão está em 99,9%</strong> — é onde a maioria das empresas consegue
            bom equilíbrio entre custo e confiabilidade.
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Error Budget como estado (componente custom)
// Mostra o ciclo de vida do budget: cheio → consumo → ações → reset
// ═══════════════════════════════════════════════════════════════════════════════

const BUDGET_STATES = [
  {
    id: 'full', label: 'Budget intacto', emoji: '🟢', color: C,
    budget: 100, canDeploy: true,
    desc: 'Error budget cheio no início do período (30 dias). A equipe tem total liberdade para deploys, experimentos e refatorações arriscadas. Velocity máxima.',
    actions: ['Deploys frequentes', 'Experimentos de infraestrutura', 'Refatorações arriscadas', 'Lançamento de features'],
  },
  {
    id: 'depleting', label: 'Budget em consumo', emoji: '🟡', color: AMB,
    budget: 55, canDeploy: true,
    desc: 'Incidentes e deploys consumiram 45% do budget. Ainda dentro da zona segura, mas time começa a monitorar mais de perto. Momento de revisar práticas de deploy.',
    actions: ['Revisar processos de deploy', 'Aumentar cobertura de testes', 'Alertas mais sensíveis', 'Post-mortem dos incidentes'],
  },
  {
    id: 'critical', label: 'Budget crítico', emoji: '🔴', color: ORG,
    budget: 15, canDeploy: false,
    desc: '85% do budget consumido. Feature freeze entra em vigor. A equipe para de lançar features e foca em confiabilidade. Cada deploy precisa de aprovação explícita de SRE.',
    actions: ['Feature freeze', 'Foco em reliability', 'Revisão de SLO (muito apertado?)', 'Reduzir frequência de deploys'],
  },
  {
    id: 'exhausted', label: 'Budget esgotado', emoji: '⛔', color: RED,
    budget: 0, canDeploy: false,
    desc: 'Error budget zerado — o SLO foi violado. Sprint obrigatório de reliability: nenhuma feature nova até que o sistema recupere confiabilidade. Revisão de SLO se impossível de manter.',
    actions: ['Sprint de reliability obrigatório', 'Zero features novas', 'Revisão de SLO target', 'Escalation para liderança'],
  },
]

function ErrorBudgetVisual() {
  const [selected, setSelected] = useState(0)
  const state = BUDGET_STATES[selected]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 4 }}>
      {/* Seletores de estado */}
      <div style={{ display: 'flex', gap: 8 }}>
        {BUDGET_STATES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setSelected(i)}
            style={{
              flex: 1, padding: '10px 4px', borderRadius: 8, cursor: 'pointer',
              background: selected === i ? `${s.color}20` : CARD,
              border: `1.5px solid ${selected === i ? s.color : LINE}`,
              color: FG, fontSize: 11, fontWeight: selected === i ? 700 : 400,
              textAlign: 'center', transition: 'all 0.15s',
            }}
          >
            <div style={{ fontSize: 20, marginBottom: 4 }}>{s.emoji}</div>
            <div style={{ color: selected === i ? s.color : FGMUTE, lineHeight: 1.3 }}>{s.label}</div>
          </button>
        ))}
      </div>

      {/* Barra de budget */}
      <div style={{ background: CARD, borderRadius: 12, padding: 20, border: `1.5px solid ${state.color}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: FG }}>Error Budget restante</div>
          <div style={{
            fontSize: 28, fontWeight: 800, color: state.color,
            fontFamily: "'JetBrains Mono', monospace",
          }}>{state.budget}%</div>
        </div>
        <div style={{ height: 16, background: LINE, borderRadius: 8, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 8, background: `linear-gradient(90deg, ${state.color}, ${state.color}99)`,
            width: `${state.budget}%`, transition: 'width 0.5s, background 0.5s',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ fontSize: 10, color: FGMUTE }}>0% — budget esgotado</span>
          <span style={{ fontSize: 10, color: FGMUTE }}>100% — budget cheio</span>
        </div>
      </div>

      {/* Descrição e ações */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ background: CARD, borderRadius: 10, padding: 16, border: `1px solid ${LINE}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: FGMUTE, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.06em' }}>Situação</div>
          <div style={{ fontSize: 13, color: FG, lineHeight: 1.7 }}>{state.desc}</div>
          <div style={{
            marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 10px', borderRadius: 6,
            background: state.canDeploy ? `${C}20` : `${RED}20`,
            border: `1px solid ${state.canDeploy ? C : RED}40`,
          }}>
            <span style={{ fontSize: 12 }}>{state.canDeploy ? '✅' : '🚫'}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: state.canDeploy ? C : RED }}>
              {state.canDeploy ? 'Deploy autorizado' : 'Feature freeze'}
            </span>
          </div>
        </div>
        <div style={{ background: CARD, borderRadius: 10, padding: 16, border: `1px solid ${LINE}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: FGMUTE, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.06em' }}>Ações da equipe</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {state.actions.map(a => (
              <div key={a} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span style={{ color: state.color, fontSize: 14, flexShrink: 0, marginTop: 1 }}>→</span>
                <span style={{ fontSize: 12, color: FG, lineHeight: 1.5 }}>{a}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Burn Rate e Multi-window alerting (componente custom)
// ═══════════════════════════════════════════════════════════════════════════════

const BURN_SCENARIOS = [
  {
    id: 'normal', label: 'Normal',
    burnRate: 0.5, window1h: 0.5, window6h: 0.4,
    color: C, alert: 'Nenhum alerta', alertColor: C,
    desc: 'Consumindo metade da velocidade esperada. Budget está acumulando. Sistema muito confiável.',
    depletes: 'Nunca (budget acumula)',
  },
  {
    id: 'steady', label: 'Degradação lenta',
    burnRate: 3, window1h: 2.8, window6h: 3.1,
    color: AMB, alert: 'Ticket — urgente (burn rate 3×)', alertColor: AMB,
    desc: 'Burn rate de 3× — o budget mensal esgota em ~10 dias. Detectável apenas na janela longa (6h). Alerta de ticket urgente.',
    depletes: '~10 dias (burn rate 3×)',
  },
  {
    id: 'fast', label: 'Incidente grave',
    burnRate: 14, window1h: 14.2, window6h: 13.8,
    color: ORG, alert: 'Page — crítico (burn rate 14×)', alertColor: RED,
    desc: 'Burn rate de 14× — o budget mensal esgota em ~2 dias. Detectado tanto na janela curta (1h) quanto na longa (6h). Page imediato.',
    depletes: '~2 dias (burn rate 14×)',
  },
  {
    id: 'spike', label: 'Spike temporário',
    burnRate: 30, window1h: 30, window6h: 1.2,
    color: SKY, alert: 'Nenhum alerta (spike curto)', alertColor: FGMUTE,
    desc: 'Burn rate de 30× por apenas 15 minutos. Janela longa (6h) = 1.2× — abaixo do threshold. Multi-window evita falso positivo de alerta.',
    depletes: 'N/A — spike curto, sem impacto real',
  },
]

function BurnRateVisual() {
  const [selected, setSelected] = useState(2)
  const sc = BURN_SCENARIOS[selected]

  const ALERTS = [
    { label: 'Page — rápido', threshold: 14, window: '1h + 5min', depletes: '2 dias', severity: 'critical', color: RED },
    { label: 'Page — lento',  threshold: 6,  window: '6h + 30min', depletes: '5 dias', severity: 'critical', color: ORG },
    { label: 'Ticket urgente', threshold: 3, window: '1d + 2h',  depletes: '10 dias', severity: 'warning',  color: AMB },
    { label: 'Ticket longo',   threshold: 1, window: '3d + 6h',  depletes: '30 dias', severity: 'info',     color: C },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Cenários */}
      <div style={{ display: 'flex', gap: 8 }}>
        {BURN_SCENARIOS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setSelected(i)}
            style={{
              flex: 1, padding: '8px 6px', borderRadius: 8, cursor: 'pointer',
              background: selected === i ? `${s.color}20` : CARD,
              border: `1.5px solid ${selected === i ? s.color : LINE}`,
              color: selected === i ? s.color : FGMUTE, fontSize: 11, fontWeight: 600,
              textAlign: 'center', transition: 'all 0.15s',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Métricas do cenário */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        {[
          { label: 'Burn rate', value: `${sc.burnRate}×`, color: sc.alertColor },
          { label: 'Janela 1h', value: `${sc.window1h}×`, color: sc.window1h >= 14 ? RED : sc.window1h >= 6 ? ORG : sc.window1h >= 3 ? AMB : C },
          { label: 'Janela 6h', value: `${sc.window6h}×`, color: sc.window6h >= 14 ? RED : sc.window6h >= 6 ? ORG : sc.window6h >= 3 ? AMB : C },
        ].map(m => (
          <div key={m.label} style={{ background: CARD, borderRadius: 10, padding: 14, border: `1px solid ${LINE}`, textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: FGMUTE, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.06em' }}>{m.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: m.color, fontFamily: "'JetBrains Mono', monospace" }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Resultado */}
      <div style={{
        background: `${sc.alertColor}10`, borderRadius: 10, padding: 16,
        border: `1.5px solid ${sc.alertColor}40`,
      }}>
        <div style={{ fontWeight: 700, color: sc.alertColor, marginBottom: 8, fontSize: 13 }}>{sc.alert}</div>
        <div style={{ fontSize: 13, color: FG, lineHeight: 1.7, marginBottom: 8 }}>{sc.desc}</div>
        <div style={{ fontSize: 11, color: FGMUTE }}>Budget esgota em: <strong style={{ color: FG }}>{sc.depletes}</strong></div>
      </div>

      {/* Tabela dos 4 alertas */}
      <div style={{ background: CARD, borderRadius: 10, padding: 16, border: `1px solid ${LINE}` }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: FGMUTE, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.06em' }}>Os 4 Alertas do SRE Workbook — 14·6·3·1</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {ALERTS.map(a => (
            <div key={a.label} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px',
              borderRadius: 7, background: BG, border: `1px solid ${LINE}`,
            }}>
              <div style={{
                fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
                background: `${a.color}20`, color: a.color, flexShrink: 0, minWidth: 60, textAlign: 'center',
              }}>{a.severity.toUpperCase()}</div>
              <div style={{ flex: 1, fontSize: 12, color: FG }}>{a.label}</div>
              <div style={{ fontSize: 11, color: a.color, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, flexShrink: 0 }}>
                ≥{a.threshold}×
              </div>
              <div style={{ fontSize: 10, color: FGMUTE, flexShrink: 0, textAlign: 'right' }}>
                {a.window}
              </div>
              <div style={{ fontSize: 10, color: FGMUTE, flexShrink: 0, minWidth: 50, textAlign: 'right' }}>
                {a.depletes}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — Tipos de SLI — ComparisonTable
// ═══════════════════════════════════════════════════════════════════════════════

const SLI_OPTIONS: ComparisonOption[] = [
  { id: 'avail',    label: 'Disponibilidade', sublabel: 'O serviço está respondendo?', color: C },
  { id: 'latency',  label: 'Latência',         sublabel: 'Responde dentro do tempo?', color: SKY },
  { id: 'throughput', label: 'Throughput',     sublabel: 'Quantas requisições/s?',    color: PRP },
  { id: 'error',    label: 'Taxa de Erro',      sublabel: 'Proporção de erros?',       color: RED },
]

const SLI_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'formula', label: 'Fórmula SLI', category: 'Definição',
    values: {
      avail:    { rating: 'excellent', note: '(req 2xx+3xx) / total_req' },
      latency:  { rating: 'excellent', note: '(req < 500ms) / total_req' },
      throughput: { rating: 'good', note: 'req_sucesso / segundo (absoluto, não proporção)' },
      error:    { rating: 'excellent', note: '(req 5xx) / total_req' },
    },
  },
  {
    id: 'usuario', label: 'Reflete experiência do usuário', category: 'Qualidade',
    values: {
      avail:    { rating: 'good',      note: 'Sim — mas não detecta lentidão' },
      latency:  { rating: 'excellent', note: 'Sim — usuário sente o tempo de resposta' },
      throughput: { rating: 'fair',    note: 'Parcialmente — mais sobre capacidade que experiência' },
      error:    { rating: 'excellent', note: 'Sim — erros são visíveis ao usuário' },
    },
  },
  {
    id: 'quando', label: 'Mais importante quando', category: 'Uso',
    values: {
      avail:    { rating: 'good',      note: 'Serviços de presença: APIs, websites, microserviços' },
      latency:  { rating: 'excellent', note: 'E-commerce, checkout, APIs com UX crítica' },
      throughput: { rating: 'fair',    note: 'Pipelines de dados, processamento em batch' },
      error:    { rating: 'good',      note: 'Sistemas de pagamento, integrações críticas' },
    },
  },
  {
    id: 'armadilha', label: 'Armadilha comum', category: 'Cuidados',
    values: {
      avail:    { rating: 'fair',      note: 'Usar uptime absoluto (minutos) em vez de proporção' },
      latency:  { rating: 'fair',      note: 'Usar média ou p99 bruto — deve ser proporção de req rápidas' },
      throughput: { rating: 'poor',   note: 'Não é proporção — mais difícil de usar como SLI de confiabilidade' },
      error:    { rating: 'good',      note: 'Excluir erros esperados (404 por input inválido) do denominador' },
    },
  },
  {
    id: 'promql', label: 'PromQL de exemplo', category: 'Implementação',
    values: {
      avail:    { rating: 'excellent', note: 'rate(http_requests_total{status!~"5.."}[5m]) / rate(http_requests_total[5m])' },
      latency:  { rating: 'excellent', note: 'rate(http_duration_seconds_bucket{le="0.5"}[5m]) / rate(http_duration_seconds_count[5m])' },
      throughput: { rating: 'good',   note: 'rate(http_requests_total{status!~"5.."}[5m])' },
      error:    { rating: 'excellent', note: 'rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m])' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — Árvore de decisão: definindo bons SLOs
// ═══════════════════════════════════════════════════════════════════════════════

const SLO_ROOT: DTNode = {
  id: 'start',
  question: 'Você tem dados históricos de confiabilidade do serviço?',
  children: [
    { label: 'Não (serviço novo)', nodeId: 'no-history', color: AMB },
    { label: 'Sim', nodeId: 'has-history', color: C },
  ],
}

const SLO_NODES: Record<string, DTNode> = {
  'no-history': {
    id: 'no-history',
    question: 'O serviço é crítico para o negócio (pagamentos, saúde, financeiro)?',
    children: [
      { label: 'Sim — crítico', nodeId: 'start-conservative-high', color: AMB },
      { label: 'Não — serviço padrão', nodeId: 'start-conservative', color: C },
    ],
  },
  'start-conservative': {
    id: 'start-conservative',
    recommendation: 'Comece com SLO de 99,5% e meça o real por 30 dias',
    detail: 'Sem histórico, começar muito apertado (99,9%) vai gerar budget zero imediatamente e bloquear deploys. Comece conservador, meça o que seu sistema realmente entrega, depois aperte gradualmente.',
    color: C,
    icon: '🎯',
  },
  'start-conservative-high': {
    id: 'start-conservative-high',
    recommendation: 'Comece com SLO de 99,9% e implemente redundância antes do lançamento',
    detail: 'Para serviços críticos sem histórico: implemente multi-az, circuit breakers e failover automático antes de definir SLOs agressivos. Valide com chaos engineering antes de abrir para clientes.',
    color: AMB,
    icon: '🔒',
  },
  'has-history': {
    id: 'has-history',
    question: 'Sua taxa de sucesso histórica está acima de 99,5%?',
    children: [
      { label: 'Não — abaixo de 99,5%', nodeId: 'reliability-work', color: RED },
      { label: 'Sim — acima de 99,5%', nodeId: 'check-user', color: C },
    ],
  },
  'reliability-work': {
    id: 'reliability-work',
    recommendation: 'Faça trabalho de confiabilidade antes de definir SLOs',
    detail: 'Definir SLO em cima de um sistema que já falha muito frequentemente vai resultar em violações imediatas e budget sempre zerado. Primeiro: identifique e corrija as causas raiz dos incidentes mais frequentes.',
    color: RED,
    icon: '🛠',
  },
  'check-user': {
    id: 'check-user',
    question: 'Você tem dados de satisfação ou comportamento do usuário?',
    children: [
      { label: 'Não', nodeId: 'set-slo-historical', color: AMB },
      { label: 'Sim', nodeId: 'align-user', color: C },
    ],
  },
  'set-slo-historical': {
    id: 'set-slo-historical',
    recommendation: 'Use disponibilidade histórica − 10% como SLO inicial',
    detail: 'Se seu serviço entregou 99,95% no histórico, comece com SLO de 99,9% — a margem evita que variações normais violem o SLO. Revise a cada trimestre e aperte conforme ganha confiança.',
    color: AMB,
    icon: '📊',
  },
  'align-user': {
    id: 'align-user',
    question: 'Usuários reclamam de lentidão mesmo quando a disponibilidade está OK?',
    children: [
      { label: 'Sim', nodeId: 'add-latency-slo', color: SKY },
      { label: 'Não', nodeId: 'set-slo-good', color: C },
    ],
  },
  'add-latency-slo': {
    id: 'add-latency-slo',
    recommendation: 'Adicione SLO de latência além do SLO de disponibilidade',
    detail: 'Disponibilidade 99,9% com p95 de 3 segundos pode parecer "OK" nas métricas mas causa abandono. Adicione SLO de latência: ex: 95% das requisições em ≤500ms. Isso captura degradação que o SLO de disponibilidade não detecta.',
    color: SKY,
    icon: '⏱',
  },
  'set-slo-good': {
    id: 'set-slo-good',
    recommendation: 'SLO bem calibrado — defina margem de segurança acima do SLA',
    detail: 'Com dados de usuário indicando satisfação e disponibilidade histórica boa: defina SLO = histórico − 5% e SLA = SLO − 5%. A margem dupla garante que você detecta violações do SLO antes que o SLA seja violado.',
    color: C,
    icon: '✅',
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// Componente principal
// ═══════════════════════════════════════════════════════════════════════════════

export default function SlisSlosSlasVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'hierarchy',
      title: 'A Hierarquia SLI → SLO → SLA → Error Budget',
      subtitle: 'O que cada conceito é, como se relacionam e como fluem da métrica ao contrato',
      accent: C,
      component: (
        <LayerStack
          layers={HIERARCHY_LAYERS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'availability-calc',
      title: 'Calculadora de Disponibilidade',
      subtitle: 'Selecione um SLO e veja o downtime real em minutos — e por que cada "nove" custa 10× mais',
      accent: C,
      component: <AvailabilityVisual />,
    },
    {
      id: 'error-budget',
      title: 'Ciclo de Vida do Error Budget',
      subtitle: 'Como o budget é consumido, quais ações cada estado dispara, e quando o feature freeze entra em vigor',
      accent: C,
      component: <ErrorBudgetVisual />,
    },
    {
      id: 'burn-rate',
      title: 'Burn Rate e Multi-window Alerting',
      subtitle: 'Os 4 alertas do SRE Workbook — 14·6·3·1 — e como multi-window elimina falsos positivos',
      accent: C,
      component: <BurnRateVisual />,
    },
    {
      id: 'sli-types',
      title: 'Tipos de SLI — Disponibilidade, Latência, Throughput, Erro',
      subtitle: 'Fórmulas, quando usar e as armadilhas de cada tipo de indicador',
      accent: C,
      component: (
        <ComparisonTable
          options={SLI_OPTIONS}
          criteria={SLI_CRITERIA}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'slo-definition',
      title: 'Definindo Bons SLOs — Árvore de Decisão',
      subtitle: 'Guia interativo para definir SLOs calibrados: histórico, criticidade e dados de usuário',
      accent: C,
      component: (
        <DecisionTree
          root={SLO_ROOT}
          nodes={SLO_NODES}
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
