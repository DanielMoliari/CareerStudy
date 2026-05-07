'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'

// ── Paleta Inglês ─────────────────────────────────────────────────────────────
const C      = '#22c55e'   // verde — identidade soft skill / inglês
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#22c55e'
const AMB    = '#f59e0b'
const RED    = '#ef4444'
const SKY    = '#06b6d4'
const ORG    = '#f97316'
const VIO    = '#a855f7'

// ─────────────────────────────────────────────────────────────────────────────
// Visual 1: Quatro dimensões do inglês técnico
// ─────────────────────────────────────────────────────────────────────────────

const DIMS = [
  {
    id: 'leitura',
    order: 1,
    label: 'Leitura',
    sub: 'Base de tudo',
    color: GRN,
    avgBR: 75,
    target: 90,
    detail: 'Docs oficiais, RFC, Hacker News, blogs de engenharia. O vocabulário técnico passivo acumulado na leitura alimenta todas as outras dimensões. Nunca leia docs traduzidas quando existe a versão original em inglês.',
    practice: 'Leia 1 artigo técnico em inglês por dia. Use dicionário inline no browser — aprende no contexto, sem sair da página.',
    quickWin: 'Troque o idioma do navegador e apps para inglês hoje.',
  },
  {
    id: 'escrita',
    order: 2,
    label: 'Escrita',
    sub: 'Diário em times remotos',
    color: SKY,
    avgBR: 55,
    target: 85,
    detail: 'PRs, commits, ADRs, Slack, e-mail técnico. A escrita ativa o vocabulário passivo da leitura. Em times remotos internacionais, sua escrita é sua presença — é como as pessoas te conhecem.',
    practice: 'Escreva todos os commits em inglês a partir de hoje. Use Grammarly para revisar PRs antes de abrir.',
    quickWin: 'Próximo PR: use a estrutura What / Why / How to test.',
  },
  {
    id: 'audicao',
    order: 3,
    label: 'Audição',
    sub: 'Reuniões e talks',
    color: AMB,
    avgBR: 45,
    target: 80,
    detail: 'Talks do YouTube, reuniões com sotaques variados, podcasts tech. Mais difícil que leitura porque não há pausa — você processa em tempo real sem dicionário.',
    practice: 'Assista Software Engineering Daily com legendas em inglês. Progrida para 1.25x sem legenda ao longo de 2-3 meses.',
    quickWin: 'Habilite subtítulos em inglês em todos os vídeos técnicos que assistir.',
  },
  {
    id: 'fala',
    order: 4,
    label: 'Fala',
    sub: 'Entrevistas e pair programming',
    color: ORG,
    avgBR: 30,
    target: 70,
    detail: 'O maior gap da maioria dos devs brasileiros. Não é sobre perfeição — C1 funcional com sotaque brasileiro é completamente aceito. É sobre clareza e capacidade de articular raciocínio técnico.',
    practice: 'Fale sobre seus projetos em inglês em voz alta por 5 minutos por dia. Grave e ouça sem julgar.',
    quickWin: 'Faça uma mock interview gratuita no Pramp esta semana.',
  },
]

function DimensionsVisual() {
  const [active, setActive] = useState<string>('leitura')

  const current = DIMS.find(d => d.id === active) ?? DIMS[0]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 12, color: FGMUTE, textAlign: 'center' }}>
        As quatro dimensões — desenvolva nessa ordem. Cada uma alimenta a próxima.
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
        {DIMS.map((d) => (
          <button
            key={d.id}
            onClick={() => setActive(d.id)}
            style={{
              padding: '12px 16px',
              borderRadius: 10,
              border: `2px solid ${active === d.id ? d.color : LINE}`,
              background: active === d.id ? `${d.color}15` : CARD,
              cursor: 'pointer',
              fontFamily: 'inherit',
              textAlign: 'left',
              transition: 'all .2s',
              minWidth: 140,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <div style={{
                width: 22, height: 22, borderRadius: 6,
                background: `${d.color}20`,
                border: `1.5px solid ${d.color}50`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 800, color: d.color, flexShrink: 0,
              }}>{d.order}</div>
              <span style={{ fontSize: 12, fontWeight: 700, color: active === d.id ? d.color : FG }}>{d.label}</span>
            </div>
            <div style={{ fontSize: 10, color: FGMUTE, marginBottom: 8 }}>{d.sub}</div>
            <div style={{ fontSize: 9, color: FGMUTE, marginBottom: 4 }}>Média BR</div>
            <div style={{ background: LINE, borderRadius: 3, height: 4, marginBottom: 4 }}>
              <div style={{
                width: `${d.avgBR}%`, height: '100%', borderRadius: 3,
                background: d.color, transition: 'width .4s',
              }} />
            </div>
            <div style={{ fontSize: 9, color: FGMUTE, textAlign: 'right' }}>{d.avgBR}%</div>
          </button>
        ))}
      </div>

      <div style={{
        padding: '16px 20px', borderRadius: 10,
        background: `${current.color}10`,
        border: `2px solid ${current.color}40`,
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: current.color }}>
          {current.order}. {current.label} — {current.sub}
        </div>
        <div style={{ fontSize: 12, color: FG, lineHeight: 1.7 }}>{current.detail}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ padding: '10px 12px', borderRadius: 8, background: CARD, border: `1px solid ${LINE}` }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: current.color, marginBottom: 4 }}>PRÁTICA DIÁRIA</div>
            <div style={{ fontSize: 11, color: FG, lineHeight: 1.6 }}>{current.practice}</div>
          </div>
          <div style={{ padding: '10px 12px', borderRadius: 8, background: CARD, border: `1px solid ${LINE}` }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: GRN, marginBottom: 4 }}>QUICK WIN HOJE</div>
            <div style={{ fontSize: 11, color: FG, lineHeight: 1.6 }}>{current.quickWin}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: FGMUTE, marginBottom: 4 }}>Média devs BR: {current.avgBR}%</div>
            <div style={{ background: LINE, borderRadius: 4, height: 6 }}>
              <div style={{ width: `${current.avgBR}%`, height: '100%', borderRadius: 4, background: current.color }} />
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: FGMUTE, marginBottom: 4 }}>Meta C1 funcional: {current.target}%</div>
            <div style={{ background: LINE, borderRadius: 4, height: 6 }}>
              <div style={{ width: `${current.target}%`, height: '100%', borderRadius: 4, background: GRN, opacity: 0.6 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Visual 2: Code Review — do tóxico ao construtivo
// ─────────────────────────────────────────────────────────────────────────────

const REVIEW_PAIRS = [
  {
    bad: 'This is wrong.',
    good: 'Blocker: this will cause a null pointer exception when user.address is undefined. We need a guard here.',
    why: 'Específico sobre o que está errado e por que importa. Sem especificidade, o autor não sabe como corrigir.',
  },
  {
    bad: 'Why did you do this?',
    good: 'Question: could you help me understand the reasoning here? I want to make sure I\'m not missing context before suggesting a change.',
    why: '"Why did you do this?" soa acusatório. A Question frame demonstra curiosidade genuína, não julgamento.',
  },
  {
    bad: 'You should have used X.',
    good: 'Suggestion: consider using X here — it would make the retry logic easier to test in isolation.',
    why: 'Suggestion + razão concreta. O "you should have" implica que o autor errou; Suggestion implica alternativa.',
  },
  {
    bad: 'This is bad code.',
    good: 'nit: this function is doing three things. Extracting the validation into its own function would improve readability.',
    why: 'nit marca como detalhe menor. A frase descreve o problema concreto, não julga o autor.',
  },
  {
    bad: 'This doesn\'t make sense.',
    good: 'I\'m having trouble following the flow here — could you add a comment explaining why we need the double negation?',
    why: 'Reformulado como problema de compreensão do revisor, não como falha do código. Mais colaborativo.',
  },
]

function CodeReviewVisual() {
  const [selected, setSelected] = useState<number>(0)
  const pair = REVIEW_PAIRS[selected]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 12, color: FGMUTE, textAlign: 'center' }}>
        Code review em inglês — do tóxico ao construtivo. Em times internacionais, sua escrita de review define sua reputação.
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
        {REVIEW_PAIRS.map((_, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: `1.5px solid ${selected === i ? C : LINE}`,
              background: selected === i ? `${C}15` : CARD,
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 11,
              color: selected === i ? C : FGMUTE,
              transition: 'all .15s',
            }}
          >
            Exemplo {i + 1}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ padding: '14px 16px', borderRadius: 10, background: `${RED}10`, border: `1.5px solid ${RED}30` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: RED, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.06em' }}>Evitar</div>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
            color: RED, background: BG, padding: '10px 12px', borderRadius: 6,
            lineHeight: 1.6,
          }}>
            "{pair.bad}"
          </div>
        </div>
        <div style={{ padding: '14px 16px', borderRadius: 10, background: `${C}10`, border: `1.5px solid ${C}30` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.06em' }}>Preferir</div>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
            color: GRN, background: BG, padding: '10px 12px', borderRadius: 6,
            lineHeight: 1.7,
          }}>
            "{pair.good}"
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 16px', borderRadius: 8, background: CARD, border: `1px solid ${LINE}`, fontSize: 11, color: FG, lineHeight: 1.6 }}>
        <strong style={{ color: AMB }}>Por que funciona melhor: </strong>{pair.why}
      </div>

      <div style={{ padding: '12px 16px', borderRadius: 8, background: CARD, border: `1px solid ${LINE}` }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: FGMUTE, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.06em' }}>Prefixos padrão de code review</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { prefix: 'Blocker:', color: RED, desc: 'Deve mudar antes do merge' },
            { prefix: 'Suggestion:', color: SKY, desc: 'Opcional mas valioso' },
            { prefix: 'nit:', color: FGMUTE, desc: 'Detalhe menor de estilo' },
            { prefix: 'Question:', color: AMB, desc: 'Pergunta sem agenda' },
            { prefix: 'FYI:', color: VIO, desc: 'Informativo, sem ação' },
          ].map(item => (
            <div key={item.prefix} style={{
              padding: '6px 10px', borderRadius: 6, background: BG,
              border: `1px solid ${item.color}30`,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: item.color, fontFamily: 'JetBrains Mono, monospace' }}>{item.prefix}</div>
              <div style={{ fontSize: 10, color: FGMUTE, marginTop: 2 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Visual 3: Vocabulário técnico por nível de uso
// ─────────────────────────────────────────────────────────────────────────────

const VOC_CATEGORIES = [
  {
    label: 'Performance e Sistemas',
    color: SKY,
    terms: [
      { en: 'trade-off', use: 'Toda conversa de arquitetura' },
      { en: 'bottleneck', use: 'Performance discussions' },
      { en: 'throughput', use: 'Capacidade do sistema' },
      { en: 'latency', use: 'Medições de tempo' },
      { en: 'backpressure', use: 'Sistemas de fila/streaming' },
      { en: 'graceful degradation', use: 'Resiliência' },
    ],
  },
  {
    label: 'Confiabilidade',
    color: AMB,
    terms: [
      { en: 'idempotent', use: 'APIs e operações' },
      { en: 'fault tolerance', use: 'Sistemas distribuídos' },
      { en: 'eventual consistency', use: 'Bancos e replicação' },
      { en: 'race condition', use: 'Concorrência' },
      { en: 'deadlock', use: 'Threads e locks' },
      { en: 'circuit breaker', use: 'Resiliência de serviço' },
    ],
  },
  {
    label: 'Design e Arquitetura',
    color: VIO,
    terms: [
      { en: 'separation of concerns', use: 'Design de módulos' },
      { en: 'single source of truth', use: 'Estado e dados' },
      { en: 'tight coupling', use: 'Qualidade de código' },
      { en: 'abstraction layer', use: 'Design de APIs' },
      { en: 'technical debt', use: 'Refactoring discussions' },
      { en: 'dependency injection', use: 'Código testável' },
    ],
  },
]

function VocabularyVisual() {
  const [activecat, setActivecat] = useState<string>('Performance e Sistemas')
  const [activeTerm, setActiveTerm] = useState<string | null>(null)

  const cat = VOC_CATEGORIES.find(c => c.label === activecat) ?? VOC_CATEGORIES[0]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 12, color: FGMUTE, textAlign: 'center' }}>
        Vocabulário técnico que aparece em toda entrevista ou reunião internacional — aprenda o termo em inglês direto, sem traduzir.
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        {VOC_CATEGORIES.map(c => (
          <button
            key={c.label}
            onClick={() => { setActivecat(c.label); setActiveTerm(null) }}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: `1.5px solid ${activecat === c.label ? c.color : LINE}`,
              background: activecat === c.label ? `${c.color}15` : CARD,
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 11,
              fontWeight: activecat === c.label ? 700 : 400,
              color: activecat === c.label ? c.color : FGMUTE,
              transition: 'all .15s',
              whiteSpace: 'nowrap',
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {cat.terms.map(term => (
          <button
            key={term.en}
            onClick={() => setActiveTerm(activeTerm === term.en ? null : term.en)}
            style={{
              padding: '12px 14px',
              borderRadius: 8,
              border: `1.5px solid ${activeTerm === term.en ? cat.color : LINE}`,
              background: activeTerm === term.en ? `${cat.color}12` : CARD,
              cursor: 'pointer',
              fontFamily: 'inherit',
              textAlign: 'left',
              transition: 'all .15s',
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: cat.color, fontFamily: 'JetBrains Mono, monospace', marginBottom: 4 }}>
              {term.en}
            </div>
            <div style={{ fontSize: 10, color: FGMUTE }}>Uso: {term.use}</div>
            {activeTerm === term.en && (
              <div style={{
                marginTop: 8, padding: '8px 10px', borderRadius: 6,
                background: BG, border: `1px solid ${cat.color}30`,
                fontSize: 11, color: FG, lineHeight: 1.6,
              }}>
                Pratique usando em frases: "The main bottleneck here is the database" — não traduza mentalmente, use direto.
              </div>
            )}
          </button>
        ))}
      </div>

      <div style={{ padding: '10px 14px', borderRadius: 8, background: CARD, border: `1px solid ${LINE}`, fontSize: 11, color: FGMUTE, lineHeight: 1.6 }}>
        <strong style={{ color: C }}>Regra de ouro:</strong> aprenda cada termo com uma frase de exemplo — não apenas a tradução. O objetivo é acessar o termo diretamente em inglês, sem o passo intermediário de tradução.
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Visual 4: Formality levels — Slack, PR, email, standup
// ─────────────────────────────────────────────────────────────────────────────

const CONTEXTS = [
  {
    id: 'standup',
    label: 'Daily Standup',
    formality: 'Informal',
    color: GRN,
    examples: [
      'Yesterday: finished the auth PR, got feedback, will address today.',
      "Today: PR revisions + starting the logging refactor.",
      'Blocker: waiting on @alice to unblock the API design question.',
    ],
    tips: 'Frases curtas, sem introdução. Ninguém quer ouvir "Good morning everyone! So yesterday I was working on...". Vai direto ao ponto.',
  },
  {
    id: 'slack',
    label: 'Slack Message',
    formality: 'Informal → Semi-formal',
    color: SKY,
    examples: [
      'Quick question: should we rate-limit the webhook endpoint? I\'m seeing some hammering in staging.',
      'FYI: the deploy failed because of a missing env var (REDIS_URL). Fixing now, ETA 15min.',
      'Action needed: @john — can you review PR #234 before 17:00? It\'s blocking staging.',
    ],
    tips: 'BLUF (Bottom Line Up Front) — conclusão ou pedido primeiro, contexto depois. Marque quem precisa agir.',
  },
  {
    id: 'pr',
    label: 'PR Description',
    formality: 'Semi-formal',
    color: AMB,
    examples: [
      'What: Added exponential backoff with jitter to the payment client.',
      'Why: 2% of transactions were failing due to transient 503s from the payment API.',
      'How to test: Run npm test -- --grep "payment retry", then run the load test.',
    ],
    tips: 'Estrutura What / Why / How to test. Proativamente mencione o que você já considerou e rejeitou para poupar o tempo dos revisores.',
  },
  {
    id: 'email',
    label: 'Email Técnico',
    formality: 'Formal',
    color: VIO,
    examples: [
      'Subject: [Action Required] Database migration scheduled for Saturday 02:00 UTC',
      'Hi team, I\'m writing to inform you of a planned migration for the users table...',
      'Please confirm you have no objections by replying to this thread by Thursday EOD.',
    ],
    tips: 'E-mail técnico é mais formal. Subject line deve ser específico e marcar [Action Required] ou [FYI] quando relevante. Confirme timezone.',
  },
]

function FormalityVisual() {
  const [active, setActive] = useState<string>('slack')

  const ctx = CONTEXTS.find(c => c.id === active) ?? CONTEXTS[0]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 12, color: FGMUTE, textAlign: 'center' }}>
        Nível de formalidade por contexto — escrever ao nível certo de formalidade demonstra inteligência situacional
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
        {CONTEXTS.map(c => (
          <button
            key={c.id}
            onClick={() => setActive(c.id)}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              border: `1.5px solid ${active === c.id ? c.color : LINE}`,
              background: active === c.id ? `${c.color}15` : CARD,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all .15s',
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: active === c.id ? c.color : FG }}>{c.label}</div>
            <div style={{ fontSize: 10, color: FGMUTE, marginTop: 2 }}>{c.formality}</div>
          </button>
        ))}
      </div>

      <div style={{
        padding: '16px 18px', borderRadius: 10,
        background: `${ctx.color}10`,
        border: `2px solid ${ctx.color}40`,
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: ctx.color }}>{ctx.label} — Nível: {ctx.formality}</div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: FGMUTE, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.06em' }}>Exemplos reais</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {ctx.examples.map((ex, i) => (
              <div key={i} style={{
                padding: '8px 12px', borderRadius: 6,
                background: BG, border: `1px solid ${LINE}`,
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 11, color: ctx.color, lineHeight: 1.6,
              }}>
                {ex}
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: '10px 12px', borderRadius: 8, background: CARD, border: `1px solid ${LINE}`, fontSize: 11, color: FG, lineHeight: 1.6 }}>
          <strong style={{ color: AMB }}>Dica: </strong>{ctx.tips}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────────────────────────────────────

export default function InglesVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'dimensions',
      title: '4 Dimensões',
      subtitle: 'Leitura → Escrita → Audição → Fala — desenvolva nessa ordem com prática diária concreta',
      accent: C,
      component: <DimensionsVisual />,
    },
    {
      id: 'review',
      title: 'Code Review',
      subtitle: 'Do tóxico ao construtivo — prefixos BSN e exemplos antes/depois em inglês técnico',
      accent: GRN,
      component: <CodeReviewVisual />,
    },
    {
      id: 'vocabulary',
      title: 'Vocabulário Técnico',
      subtitle: 'Performance, confiabilidade e arquitetura — termos que aparecem em toda entrevista internacional',
      accent: SKY,
      component: <VocabularyVisual />,
    },
    {
      id: 'formality',
      title: 'Formalidade por Contexto',
      subtitle: 'Standup vs Slack vs PR vs Email — nível certo de formalidade em cada situação',
      accent: AMB,
      component: <FormalityVisual />,
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
