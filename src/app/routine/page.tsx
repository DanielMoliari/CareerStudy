'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import { ALL_SKILLS, SKILL_BY_NAME, SKILL_BY_SLUG, iconUrl } from '@/data/skills'
import { useProgress, STATE_COLORS } from '@/hooks/useProgress'
import type { ProgressState } from '@/types'

/* ─── Philosophy ─── */
const PRINCIPIOS = [
  {
    n: '01', h: 'Pequeno e diario',
    p: 'Sessao de 60-90min consistente bate maratona de 4h sabado. A curva de esquecimento (Ebbinghaus) preda quem estuda em rajadas.',
  },
  {
    n: '02', h: 'Teoria → exemplo → defender',
    p: 'Cada P1 passa por tres camadas: leu o conceito, escreveu um exemplo próprio, conseguiu explicar em voz alta sem consultar.',
  },
  {
    n: '03', h: 'Spaced repetition',
    p: 'Revisita o que estudou em 3 dias, 1 semana e 1 mes. O sistema sugere automaticamente baseado no updatedAt.',
  },
  {
    n: '04', h: 'System design 1x/semana',
    p: 'Sabado de manha, 1h, 1 problema. Trace requisitos, calcule capacity, desenhe, justifique tradeoffs em texto.',
  },
  {
    n: '05', h: 'Pomodoro 25/5 ou Flowtime 50/10',
    p: 'Pomodoro pro foco protegido. Flowtime quando o tema pede imersao mais longa (system design, debug de conceito).',
  },
  {
    n: '06', h: 'Feynman test',
    p: 'Sempre escrever resumo próprio depois de estudar. Se não consegue explicar simples, não entendeu — volta pra fonte.',
  },
]

/* ─── Category colors / labels ─── */
const CAT_COLORS: Record<string, string> = {
  frontend: '#60a5fa', backend: '#34d399', database: '#fbbf24',
  cloud: '#f97316',    devops: '#a78bfa',  obs: '#22d3ee',
  ai: '#ef4444',       arch: '#f472b6',    cs: '#38bdf8',
  sec: '#facc15',      soft: '#94a3b8',
}
const CAT_LABEL: Record<string, string> = {
  frontend: 'frontend', backend: 'backend', database: 'database',
  cloud: 'cloud',       devops: 'devops',   obs: 'observabilidade',
  ai: 'ai & llm',       arch: 'arquitetura', cs: 'fundamentos cs',
  sec: 'segurança',     soft: 'soft skills',
}

/* ─── Weekly plan ─── */
type Block = { time: string; type: string; cat: string; skills: string[] }
type Day   = { day: string; blocks: Block[] }

const WEEK: Day[] = [
  {
    day: 'Segunda',
    blocks: [
      { time: '07:00 — 08:00', type: 'teoria',  cat: 'cs',       skills: ['Algoritmos & DS', 'Big-O'] },
      { time: '20:00 — 21:30', type: 'teoria',  cat: 'frontend', skills: ['Server Components (RSC)', 'React Query'] },
    ],
  },
  {
    day: 'Terca',
    blocks: [
      { time: '07:00 — 08:00', type: 'teoria',  cat: 'backend',  skills: ['NestJS', 'Concurrency'] },
      { time: '20:00 — 21:00', type: 'pratica', cat: 'backend',  skills: ['Caching Strategies'] },
    ],
  },
  {
    day: 'Quarta',
    blocks: [
      { time: '07:00 — 08:00', type: 'teoria',  cat: 'database', skills: ['MVCC', 'EXPLAIN ANALYZE'] },
      { time: '20:30 — 21:30', type: 'pratica', cat: 'database', skills: ['PostgreSQL'] },
    ],
  },
  {
    day: 'Quinta',
    blocks: [
      { time: '07:00 — 08:00', type: 'teoria',  cat: 'cloud',    skills: ['IAM', 'VPC'] },
      { time: '20:00 — 21:00', type: 'teoria',  cat: 'cloud',    skills: ['AWS', 'Lambda'] },
    ],
  },
  {
    day: 'Sexta',
    blocks: [
      { time: '07:00 — 08:00', type: 'teoria',  cat: 'ai',       skills: ['RAG', 'Function Calling'] },
      { time: '20:00 — 20:45', type: 'leitura', cat: 'ai',       skills: ['Agentic Workflows', 'MCP'] },
    ],
  },
  {
    day: 'Sabado',
    blocks: [
      { time: '09:00 — 10:00', type: 'system',  cat: 'arch',     skills: ['System Design', 'Tradeoff Analysis'] },
      { time: '10:30 — 11:30', type: 'teoria',  cat: 'arch',     skills: ['Clean Architecture', 'SOLID'] },
      { time: '15:00 — 16:00', type: 'revisao', cat: 'mix',      skills: ['(skills marcadas como revisar)'] },
    ],
  },
  {
    day: 'Domingo',
    blocks: [
      { time: '10:00 — 10:45', type: 'leitura', cat: 'cs',       skills: ['TLS / HTTPS', 'TCP/IP & DNS'] },
      { time: '11:00 — 11:30', type: 'leitura', cat: 'sec',      skills: ['OWASP Top 10'] },
    ],
  },
]

/* ─── Daily ritual ─── */
type RitualItem = { time: string; title: string; body: string }
const RITUAL: RitualItem[] = [
  {
    time: '5min',
    title: 'Preview',
    body: 'Abre a skill no painel, le o tagline e os tres primeiros bullets de "conceitos-chave". Define em uma frase: "hoje vou entender X". Sem isso, você vagueia.',
  },
  {
    time: '60min',
    title: 'Teoria com fonte boa',
    body: 'Hierarquia de fonte: docs oficiais primeiro, artigos técnicos (Hussein Nasser, Marc Brooker, AWS Builder Library), video apenas se conceito for visual (event loop, MVCC), livro pra deep dive de fim de semana.',
  },
  {
    time: '10min',
    title: 'Resumo próprio (Feynman)',
    body: 'Escreve nas Notas da skill como se estivesse explicando pra um junior. Sem copiar da fonte. Se travar, voltou faltando entendimento — anota a duvida.',
  },
  {
    time: '5min',
    title: 'Marca duvida e próximo passo',
    body: 'Lista 1-3 perguntas que ficaram. Marca o estado da skill (lendo / praticando / domino). Se for revisar, agenda mentalmente pra dali 3 dias.',
  },
]

/* ─── Interview weeks ─── */
type IVWeek = { n: string; title: string; focus: string; desc: string; skills: string[] }
const IV_WEEKS: IVWeek[] = [
  {
    n: '01', title: 'Fundamentos & contrato HTTP',
    focus: 'pq cai em 9 de 10 entrevistas',
    desc: 'Sem fundamentos solidos a entrevista vira chute. Saber explicar como um pacote sai do navegador até o banco e meio caminho pra qualquer pergunta de senior.',
    skills: ['Algoritmos & DS', 'Big-O', 'Dynamic Programming', 'TCP/IP & DNS', 'TLS / HTTPS', 'HTTP/2 & HTTP/3', 'REST APIs', 'System Design', 'Tradeoff Analysis'],
  },
  {
    n: '02', title: 'Persistencia, cache e concorrência',
    focus: 'separa pleno de senior',
    desc: 'PostgreSQL profundo, padrões de cache (cache-aside, write-through), event loop e concorrência em Node. São os tópicos que mais geram pergunta de follow-up.',
    skills: ['PostgreSQL', 'MVCC', 'B-tree & LSM-tree', 'EXPLAIN ANALYZE', 'Caching Strategies', 'Redis', 'Concurrency', 'Event Loop', 'CAP Theorem'],
  },
  {
    n: '03', title: 'Arquitetura, mensageria e patterns',
    focus: 'pergunta de design tomando cafe',
    desc: 'Como você defenderia essa arquitetura? SOLID, Clean, DDD, CQRS, microservices, eventos, kafka. Tem que conseguir desenhar e justificar tradeoffs.',
    skills: ['SOLID', 'Clean Architecture', 'DDD', 'CQRS', 'Microservices', 'Event-Driven', 'Apache Kafka', 'Circuit Breakers', 'Rate Limiting', 'Design Patterns'],
  },
  {
    n: '04', title: 'Cloud, observabilidade, security e AI',
    focus: 'fechar tudo + temas quentes 2026',
    desc: 'AWS core (IAM/VPC/S3/Lambda), pilares de observabilidade, OWASP e os tópicos hot de AI moderno (RAG, MCP, Agentic). Assunto que cai e poucos sabem direito.',
    skills: ['AWS', 'IAM', 'VPC', 'S3', 'Lambda', 'OpenTelemetry', 'Prometheus', 'SLIs / SLOs / SLAs', 'OWASP Top 10', 'OWASP API Top 10', 'RAG', 'Function Calling', 'Agentic Workflows', 'MCP'],
  },
]

/* ─── Helpers ─── */
const DAY_MS = 24 * 60 * 60 * 1000
const STORAGE_KEY = 'careerstudy.progress.v1'

type StoreEntry = { state: ProgressState; updatedAt: number; notes?: string }
type Store = Record<string, StoreEntry>

function loadStore(): Store {
  if (typeof window === 'undefined') return {}
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } catch { return {} }
}

function parseRange(t: string): number {
  const m = t.match(/(\d{1,2}):(\d{2})\s*[—\-]\s*(\d{1,2}):(\d{2})/)
  if (!m) return 0
  const a = parseInt(m[1]) * 60 + parseInt(m[2])
  const b = parseInt(m[3]) * 60 + parseInt(m[4])
  return Math.max(0, b - a)
}

function ageHuman(ageMs: number): string {
  const d = Math.floor(ageMs / DAY_MS)
  if (d < 1) return 'hoje'
  if (d === 1) return '1 dia atras'
  if (d < 7) return `${d} dias atras`
  const w = Math.floor(d / 7)
  if (w === 1) return '1 semana atras'
  if (d < 30) return `${w} semanas atras`
  const mo = Math.floor(d / 30)
  if (mo === 1) return '1 mes atras'
  return `${mo} meses atras`
}

type Suggestion = { tag: 'praticar' | 'revisar'; text: string }

function suggestionFor(state: ProgressState, ageDays: number): Suggestion | null {
  if (state === 'lendo'      && ageDays >= 3)  return { tag: 'praticar', text: 'tempo de praticar' }
  if (state === 'praticando' && ageDays >= 7)  return { tag: 'revisar',  text: 'revisitar pra fixar' }
  if (state === 'domino'     && ageDays >= 30) return { tag: 'revisar',  text: 'revisao de manutenção' }
  if (state === 'revisar')                     return { tag: 'revisar',  text: 'na fila de revisao' }
  return null
}

/* ─── Sub-components ─── */
function SkillLink({ name }: { name: string }) {
  if (name.startsWith('(')) {
    return <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: 'var(--fg-dim)', fontStyle: 'italic' }}>{name}</span>
  }
  const s = SKILL_BY_NAME[name]
  if (!s) return <span style={{ color: 'var(--fg-dim)', fontFamily: "'JetBrains Mono',monospace", fontSize: 11 }}>{name}</span>
  const url = iconUrl(s.name)
  return (
    <Link href={`/skill/${s.slug}`} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: 'var(--fg)', display: 'inline-flex', alignItems: 'center', gap: 6, lineHeight: 1.3, transition: 'color .15s' }}
      onMouseEnter={e => (e.currentTarget.style.color = 'var(--scarlet)')}
      onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg)')}
    >
      {url && <img src={url} alt="" style={{ width: 11, height: 11 }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />}
      {s.name}
    </Link>
  )
}

function RitualAccordion({ item }: { item: RitualItem }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{
      background: 'var(--bg-card)', border: `1px solid ${open ? 'var(--scarlet)' : 'var(--line)'}`,
      borderRadius: 10, overflow: 'hidden', transition: 'border-color .15s',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', cursor: 'pointer', padding: '16px 20px',
          background: 'transparent', border: 'none',
          fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 14, color: 'var(--fg)',
          transition: 'background .15s', textAlign: 'left',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-card-2)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        <span style={{
          fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: 'var(--scarlet)',
          background: 'var(--scarlet-soft)', padding: '4px 10px', borderRadius: 6,
          letterSpacing: '.08em', flexShrink: 0,
        }}>{item.time}</span>
        {item.title}
        <span style={{
          marginLeft: 'auto', color: open ? 'var(--scarlet)' : 'var(--fg-dim)',
          fontFamily: "'JetBrains Mono',monospace", fontSize: 11,
          transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .2s, color .2s',
        }}>▶</span>
      </button>
      {open && (
        <div style={{
          padding: '14px 20px 18px', fontSize: 13.5, color: 'var(--fg-mute)',
          lineHeight: 1.7, borderTop: '1px solid var(--line)',
        }}>
          {item.body}
        </div>
      )}
    </div>
  )
}

/* ─── Main page ─── */
export default function RoutinePage() {
  const [mode, setModeState] = useState<'routine' | 'interview'>('routine')
  const [reviewItems, setReviewItems] = useState<Array<{
    slug: string; name: string; state: ProgressState; ageMs: number; sugg: Suggestion
  }>>([])
  const { mounted } = useProgress(ALL_SKILLS)
  const today = typeof window !== 'undefined' ? new Date().getDay() : -1
  // getDay(): 0=Sun,1=Mon,...,6=Sat → WEEK: Mon=0,...,Sun=6
  const todayIdx = today === 0 ? 6 : today - 1

  useEffect(() => {
    const saved = localStorage.getItem('careerstudy.routine.mode')
    if (saved === 'interview') setModeState('interview')
  }, [])

  function setMode(m: 'routine' | 'interview') {
    setModeState(m)
    try { localStorage.setItem('careerstudy.routine.mode', m) } catch {}
  }

  useEffect(() => {
    function compute() {
      const store = loadStore()
      const now = Date.now()
      const stateRank: Record<string, number> = { revisar: 0, praticando: 1, lendo: 2, domino: 3 }
      const items: typeof reviewItems = []
      for (const [slug, data] of Object.entries(store)) {
        const skill = SKILL_BY_SLUG[slug]
        if (!skill) continue
        const ageMs = now - (data.updatedAt || now)
        const ageDays = Math.floor(ageMs / DAY_MS)
        const sugg = suggestionFor(data.state, ageDays)
        if (!sugg) continue
        items.push({ slug, name: skill.name, state: data.state, ageMs, sugg })
      }
      items.sort((a, b) => {
        const r = (stateRank[a.state] ?? 9) - (stateRank[b.state] ?? 9)
        return r !== 0 ? r : b.ageMs - a.ageMs
      })
      setReviewItems(items)
    }
    if (mounted) compute()
    const handler = () => { if (mounted) compute() }
    window.addEventListener('progress-change', handler)
    return () => window.removeEventListener('progress-change', handler)
  }, [mounted])

  // used cats for legend
  const usedCats = new Set<string>()
  for (const d of WEEK) for (const b of d.blocks) if (b.cat !== 'mix') usedCats.add(b.cat)

  return (
    <>
      <Nav />
      <div className="shell">

        {/* Hero */}
        <div style={{
          background: 'linear-gradient(135deg,rgba(239,68,68,.06),rgba(168,85,247,.04))',
          border: '1px solid var(--scarlet-soft)', borderRadius: 16,
          padding: 36, marginBottom: 32, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(circle at 90% 10%,rgba(239,68,68,.14),transparent 55%)',
            pointerEvents: 'none',
          }} />
          <p className="hdr-label"><span className="ln" /> rotina de estudo</p>
          <h1>Cadencia <em style={{ color: 'var(--scarlet)', fontStyle: 'normal' }}>realista</em>.</h1>
          <p className="desc" style={{ marginBottom: 0, maxWidth: 720 }}>
            60-90min/dia bem usados batem 4h no fim de semana — a curva de esquecimento não perdoa
            acumulo. Foco em P1 primeiro, mas com rotação por categoria pra defender qualquer área
            em entrevista. Teoria curta, exemplo escrito, defesa em voz alta.
          </p>
        </div>

        {/* Mode toggle */}
        <div style={{
          display: 'flex', gap: 6, background: 'var(--bg-card)',
          border: '1px solid var(--line)', borderRadius: 12, padding: 6,
          marginBottom: 36, position: 'sticky', top: 80, zIndex: 30,
          backdropFilter: 'blur(8px)',
        }}>
          {(['routine', 'interview'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, padding: '12px 16px', border: 'none', borderRadius: 8,
              fontFamily: "'JetBrains Mono',monospace", fontSize: 12, letterSpacing: '.04em',
              cursor: 'pointer', transition: 'all .15s',
              background: mode === m ? 'var(--scarlet)' : 'transparent',
              color: mode === m ? '#fff' : 'var(--fg-mute)',
              boxShadow: mode === m ? '0 4px 14px rgba(239,68,68,.25)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}>
              {m === 'routine' ? (
                <>Manutencao semanal<span style={{ fontSize: 9, opacity: .8, letterSpacing: '.12em', textTransform: 'uppercase' }}>cadencia continua</span></>
              ) : (
                <>Modo entrevista — 4 semanas<span style={{ fontSize: 9, opacity: .8, letterSpacing: '.12em', textTransform: 'uppercase' }}>trilha intensiva</span></>
              )}
            </button>
          ))}
        </div>

        {/* ── ROUTINE MODE ── */}
        {mode === 'routine' && (
          <>
            {/* Philosophy */}
            <section style={{ marginBottom: 48 }}>
              <p className="hdr-label"><span className="ln" /> filosofia</p>
              <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))' }}>
                {PRINCIPIOS.map(p => (
                  <div key={p.n} style={{
                    background: 'var(--bg-card)', border: '1px solid var(--line)',
                    borderRadius: 12, padding: '20px 22px',
                    transition: 'border-color .2s,transform .2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--line-2)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line)';   e.currentTarget.style.transform = 'none' }}
                  >
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--scarlet)', letterSpacing: '.12em', marginBottom: 8 }}>{p.n}</div>
                    <h4 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>{p.h}</h4>
                    <p style={{ fontSize: 13, color: 'var(--fg-mute)', lineHeight: 1.6, margin: 0 }}>{p.p}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Weekly plan */}
            <section style={{ marginBottom: 48 }}>
              <p className="hdr-label"><span className="ln" /> semana modelo · timeblocked</p>
              <p className="desc" style={{ marginBottom: 20, maxWidth: 740 }}>
                Distribuição realista — 12 a 16 skills por semana com rotação das 11 áreas.
                Clique em qualquer skill para ver o detalhe.
              </p>

              {/* Category legend */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 18, fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--fg-dim)' }}>
                {[...usedCats].map(c => (
                  <span key={c} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '4px 10px', background: 'var(--bg-card)',
                    border: '1px solid var(--line)', borderRadius: 6, letterSpacing: '.04em',
                  }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: CAT_COLORS[c] ?? '#666', flexShrink: 0 }} />
                    {CAT_LABEL[c] ?? c}
                  </span>
                ))}
              </div>

              {/* Week grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 10 }}>
                {WEEK.map((d, di) => {
                  const totalMin = d.blocks.reduce((acc, b) => acc + parseRange(b.time), 0)
                  const totalH = (totalMin / 60).toFixed(1).replace('.0', '')
                  const isToday = di === todayIdx
                  return (
                    <div key={d.day} style={{
                      background: 'var(--bg-card)',
                      border: `1px solid ${isToday ? 'var(--scarlet)' : 'var(--line)'}`,
                      borderRadius: 12, padding: 14,
                      display: 'flex', flexDirection: 'column', gap: 10, minHeight: 280,
                    }}>
                      <div style={{ borderBottom: '1px solid var(--line)', paddingBottom: 10, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                        <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 13, color: isToday ? 'var(--scarlet)' : 'var(--fg)', letterSpacing: '-.01em' }}>{d.day}</span>
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: 'var(--fg-dim)', letterSpacing: '.08em' }}>{totalH}h</span>
                      </div>
                      {d.blocks.map((b, bi) => {
                        const borderColor = b.cat === 'mix' ? undefined : (CAT_COLORS[b.cat] ?? 'var(--slate)')
                        const typeColors: Record<string, { color: string; bg: string }> = {
                          teoria:  { color: 'var(--amber)',   bg: 'rgba(234,179,8,.1)' },
                          prática: { color: 'var(--blue)',    bg: 'rgba(59,130,246,.1)' },
                          revisao: { color: 'var(--violet)',  bg: 'rgba(168,85,247,.1)' },
                          system:  { color: 'var(--scarlet)', bg: 'rgba(239,68,68,.1)' },
                          leitura: { color: 'var(--green)',   bg: 'rgba(34,197,94,.1)' },
                        }
                        const tc = typeColors[b.type]
                        return (
                          <div key={bi} style={{
                            background: 'var(--bg-card-2)',
                            border: '1px solid var(--line)',
                            borderLeft: b.cat === 'mix'
                              ? '3px solid'
                              : `3px solid ${borderColor ?? 'var(--slate)'}`,
                            borderRadius: 8, padding: '10px 12px',
                            transition: 'all .15s',
                          }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--line-2)'; e.currentTarget.style.background = 'var(--bg-elev)' }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.background = 'var(--bg-card-2)' }}
                          >
                            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: 'var(--fg-dim)', letterSpacing: '.08em', marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span>{b.time}</span>
                              {tc && (
                                <span style={{ padding: '1px 6px', borderRadius: 4, fontSize: 8, letterSpacing: '.1em', textTransform: 'uppercase', color: tc.color, background: tc.bg }}>{b.type}</span>
                              )}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                              {b.skills.map(name => <SkillLink key={name} name={name} />)}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </section>

            {/* Daily ritual */}
            <section style={{ marginBottom: 48 }}>
              <p className="hdr-label"><span className="ln" /> ritual de 80min · expandir cada etapa</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {RITUAL.map(r => <RitualAccordion key={r.title} item={r} />)}
              </div>
            </section>

            {/* Spaced repetition */}
            <section style={{ marginBottom: 48 }}>
              <p className="hdr-label"><span className="ln" /> spaced repetition · sugestões de revisao</p>
              <p className="desc" style={{ marginBottom: 18, maxWidth: 720 }}>
                Baseado no <code style={{ background: 'var(--bg-elev)', padding: '2px 6px', borderRadius: 4, fontFamily: "'JetBrains Mono',monospace", fontSize: '.9em', color: 'var(--scarlet)' }}>updatedAt</code> de cada skill no progresso. Revisitar 3 dias / 1 semana / 1 mes mantem o conhecimento vivo.
              </p>
              {!mounted ? (
                <div style={{ background: 'var(--bg-card)', border: '1px dashed var(--line)', borderRadius: 12, padding: 36, textAlign: 'center', color: 'var(--fg-dim)', fontSize: 14 }}>
                  Carregando...
                </div>
              ) : reviewItems.length === 0 ? (
                <div style={{ background: 'var(--bg-card)', border: '1px dashed var(--line)', borderRadius: 12, padding: 36, textAlign: 'center', color: 'var(--fg-dim)', fontSize: 14 }}>
                  <p style={{ marginBottom: 8 }}><strong style={{ color: 'var(--fg)' }}>Nada pra revisar agora.</strong></p>
                  <p style={{ fontSize: 13 }}>
                    Marca skills como <code style={{ background: 'var(--bg-elev)', padding: '2px 6px', borderRadius: 4, color: 'var(--amber)', fontFamily: "'JetBrains Mono',monospace" }}>lendo</code> ou{' '}
                    <code style={{ background: 'var(--bg-elev)', padding: '2px 6px', borderRadius: 4, color: 'var(--blue)', fontFamily: "'JetBrains Mono',monospace" }}>praticando</code> no painel da skill — quando passarem do limite (3d / 7d / 30d) elas aparecem aqui.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {reviewItems.map(it => {
                    const url = iconUrl(it.name)
                    const stColor = STATE_COLORS[it.state]
                    const isRev = it.sugg.tag === 'revisar'
                    return (
                      <Link key={it.slug} href={`/skill/${it.slug}`} style={{
                        display: 'flex', alignItems: 'center', gap: 14,
                        padding: '14px 18px', background: 'var(--bg-card)',
                        border: '1px solid var(--line)', borderRadius: 10,
                        transition: 'border-color .15s', textDecoration: 'none',
                      }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--scarlet-soft)')}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--line)')}
                      >
                        {url && <img src={url} alt="" style={{ width: 18, height: 18, flexShrink: 0 }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />}
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, flex: 1, color: 'var(--fg)' }}>{it.name}</span>
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, padding: '3px 8px', borderRadius: 4, letterSpacing: '.08em', textTransform: 'uppercase', background: stColor + '22', color: stColor }}>{it.state}</span>
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--fg-dim)', letterSpacing: '.04em', minWidth: 80, textAlign: 'right' }}>{ageHuman(it.ageMs)}</span>
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: '.06em', textTransform: 'uppercase', color: isRev ? 'var(--violet)' : 'var(--blue)' }}>→ {it.sugg.text}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </section>
          </>
        )}

        {/* ── INTERVIEW MODE ── */}
        {mode === 'interview' && (
          <>
            {/* Banner */}
            <div style={{
              background: 'linear-gradient(135deg,rgba(239,68,68,.10),rgba(168,85,247,.06))',
              border: '1px solid var(--scarlet)', borderRadius: 14,
              padding: '22px 26px', marginBottom: 24,
              display: 'flex', alignItems: 'center', gap: 18,
            }}>
              <span style={{
                width: 12, height: 12, borderRadius: '50%',
                background: 'var(--scarlet)', flexShrink: 0,
                boxShadow: '0 0 0 0 rgba(239,68,68,.6)',
                animation: 'pulse 1.8s infinite',
              }} />
              <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, color: 'var(--fg)', lineHeight: 1.5, margin: 0 }}>
                <strong style={{ color: 'var(--scarlet)' }}>Trilha pra entrevista em 4 semanas.</strong> Densa, focada nos tópicos que mais caem. Pos isso, volta pro modo manutenção pra não esquecer.
              </p>
            </div>

            {/* 4-week track */}
            <section style={{ marginBottom: 48 }}>
              <p className="hdr-label"><span className="ln" /> 4 semanas · 8 horas/semana mínimo</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {IV_WEEKS.map(w => (
                  <div key={w.n} style={{
                    background: 'var(--bg-card)', border: '1px solid var(--line)',
                    borderRadius: 12, padding: '22px 26px',
                    transition: 'border-color .2s', position: 'relative',
                    borderLeft: '4px solid var(--scarlet)',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--scarlet-soft)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--line)')}
                  >
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6, flexWrap: 'wrap', gap: 10 }}>
                      <h3 style={{ marginBottom: 0, fontSize: 17 }}>
                        <em style={{ color: 'var(--scarlet)', fontStyle: 'normal', fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: '.14em', marginRight: 10 }}>Semana {w.n}</em>
                        {w.title}
                      </h3>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--fg-dim)', letterSpacing: '.1em', textTransform: 'uppercase' }}>{w.focus}</span>
                    </div>
                    <p style={{ fontSize: 13.5, color: 'var(--fg-mute)', lineHeight: 1.6, marginBottom: 14 }}>{w.desc}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {w.skills.map(name => {
                        const s = SKILL_BY_NAME[name]
                        if (!s) return (
                          <span key={name} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 11px', background: 'var(--bg-card-2)', border: '1px solid var(--line)', borderRadius: 7, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: 'var(--fg-dim)', opacity: .5 }}>{name}</span>
                        )
                        const url = iconUrl(s.name)
                        return (
                          <Link key={name} href={`/skill/${s.slug}`} style={{
                            display: 'inline-flex', alignItems: 'center', gap: 7,
                            padding: '6px 11px', background: 'var(--bg-card-2)',
                            border: '1px solid var(--line)', borderRadius: 7,
                            fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: 'var(--fg)',
                            transition: 'all .15s', textDecoration: 'none',
                          }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--scarlet)'; e.currentTarget.style.color = 'var(--scarlet)'; e.currentTarget.style.background = 'var(--scarlet-soft)' }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.color = 'var(--fg)'; e.currentTarget.style.background = 'var(--bg-card-2)' }}
                          >
                            {url && <img src={url} alt="" style={{ width: 12, height: 12 }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />}
                            {s.name}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Daily ritual in interview mode */}
            <section style={{ marginBottom: 48 }}>
              <p className="hdr-label"><span className="ln" /> ritmo diario sugerido</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {RITUAL.map(r => <RitualAccordion key={r.title} item={r} />)}
              </div>
            </section>
          </>
        )}

      </div>

      <style>{`
        @keyframes pulse {
          0%   { box-shadow: 0 0 0 0 rgba(239,68,68,.6); }
          70%  { box-shadow: 0 0 0 12px rgba(239,68,68,0); }
          100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
        }
        @media (max-width: 980px) {
          .week-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 540px) {
          .week-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
