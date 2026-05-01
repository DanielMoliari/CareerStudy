'use client'
import Link from 'next/link'
import Nav from '@/components/Nav'
import ProgressBar from '@/components/ProgressBar'
import { CATEGORIES, ALL_SKILLS, DEPENDENCIES, iconUrl } from '@/data/skills'
import { useProgress } from '@/hooks/useProgress'
import type { SkillStats } from '@/types'

const QUICK_ACTIONS = [
  {
    href: '/skills',
    ico: '◇',
    title: 'Mapa de skills',
    desc: 'Lista completa por categoria com filtros, progresso por skill e busca.',
  },
  {
    href: '/graph',
    ico: '○',
    title: 'Grafo de dependências',
    desc: 'Pre-requisitos visuais — o que estudar antes do que. Ordem natural de aprendizado.',
  },
  {
    href: '/concepts',
    ico: '◐',
    title: 'Conceitos visuais',
    desc: 'Diagramas didaticos: event loop, CAP, MVCC, RAG, system design tradeoffs e mais.',
  },
  {
    href: '/routine',
    ico: '◑',
    title: 'Rotina de estudo',
    desc: 'Cadencia semanal realista priorizando P1 com cobertura balanceada das 11 areas.',
  },
]

const ZERO_STATS: SkillStats = {
  total: 0, done: 0, active: 0, pct: 0,
  counts: { pendente: 0, lendo: 0, praticando: 0, domino: 0, revisar: 0 },
}

export default function DashboardPage() {
  const progress = useProgress(ALL_SKILLS)
  const { mounted } = progress

  const globalStats = mounted ? progress.stats() : ZERO_STATS

  return (
    <>
      <Nav />
      <div className="shell">
        {/* Hero */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(239,68,68,.06), rgba(168,85,247,.04))',
          border: '1px solid rgba(239,68,68,.15)',
          borderRadius: 16,
          padding: 36,
          marginBottom: 36,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Radial glow */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 80% 20%, rgba(239,68,68,.15), transparent 50%)',
            pointerEvents: 'none',
          }} />

          <p className="hdr-label"><span className="ln" />careerstudy</p>
          <h1>De pleno a <em>senior</em> — sem decoreba.</h1>
          <p className="desc" style={{ marginBottom: 0 }}>
            Mapa de estudo cruzado de CVs, LinkedIn e gaps de mercado 2025-2026.
            Foco em teoria que cai em entrevista técnica: fundamentos, arquitetura, system design e AI moderno.
          </p>

          {/* Stat cards */}
          <div style={{
            display: 'grid',
            gap: 14,
            gridTemplateColumns: 'repeat(4, 1fr)',
            marginTop: 28,
          }}>
            <StatCard color="scarlet" num={mounted ? globalStats.total : '—'} label="skills total" />
            <StatCard color="amber"   num={mounted ? globalStats.active : '—'} label="em estudo" />
            <StatCard color="green"   num={mounted ? globalStats.done : '—'}   label="com domino" />
            <StatCard color="blue"    num={mounted ? `${globalStats.pct}%` : '—'} label="% concluido" />
          </div>

          <ProgressBar counts={globalStats.counts} height={8} style={{ marginTop: 18 }} />
        </div>

        {/* Quick actions */}
        <section>
          <p className="hdr-label"><span className="ln" /> rotas rápidas</p>
          <div style={{
            display: 'grid',
            gap: 14,
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            marginBottom: 36,
          }}>
            {QUICK_ACTIONS.map(qa => (
              <Link key={qa.href} href={qa.href} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--line)',
                borderRadius: 12,
                padding: 22,
                display: 'block',
                color: 'inherit',
                transition: 'all .2s',
              }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.borderColor = 'var(--scarlet)'
                  el.style.transform = 'translateY(-2px)'
                  el.style.boxShadow = '0 8px 24px rgba(0,0,0,.4)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.borderColor = 'var(--line)'
                  el.style.transform = ''
                  el.style.boxShadow = ''
                }}
              >
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 24,
                  color: 'var(--scarlet)',
                  marginBottom: 14,
                }}>{qa.ico}</div>
                <h3 style={{ marginBottom: 6 }}>{qa.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--fg-dim)', lineHeight: 1.55 }}>{qa.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Category progress */}
        <section>
          <p className="hdr-label"><span className="ln" /> progresso por categoria</p>
          <div className="card-grid" style={{ marginBottom: 32 }}>
            {CATEGORIES.map(cat => {
              const catSkills = cat.skills.map(([name]) => {
                const slug = name.toLowerCase()
                  .normalize('NFD').replace(/[̀-ͯ]/g, '')
                  .replace(/[^a-z0-9]+/g, '-')
                  .replace(/^-|-$/g, '')
                return ALL_SKILLS.find(s => s.slug === slug)!
              }).filter(Boolean)

              const s = mounted ? progress.stats(catSkills) : ZERO_STATS

              return (
                <Link key={cat.key} href="/skills" style={{ textDecoration: 'none', display: 'block' }}>
                  <div className="card">
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
                      <h3 style={{ margin: 0 }}>{cat.label}</h3>
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 11,
                        color: 'var(--fg-dim)',
                      }}>{s.done}/{s.total}</span>
                    </div>
                    <ProgressBar counts={s.counts} height={6} style={{ marginTop: 8 }} />
                    <div style={{
                      marginTop: 10,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 10,
                      color: 'var(--fg-dim)',
                      letterSpacing: '.06em',
                    }}>
                      {s.pct}% concluido — {s.active} em estudo
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Focus list: next 8 P1 pending */}
        <section>
          <p className="hdr-label"><span className="ln" /> próximas 8 P1 a estudar</p>
          <p style={{ fontSize: 13, color: 'var(--fg-dim)', marginBottom: 20 }}>
            Selecionadas pelas dependências resolvidas e prioridade. Clique para abrir o detalhe.
          </p>
          <FocusList progress={progress} mounted={mounted} />
        </section>
      </div>
    </>
  )
}

function StatCard({
  color,
  num,
  label,
}: {
  color: 'scarlet' | 'amber' | 'green' | 'blue'
  num: number | string
  label: string
}) {
  const colorMap = {
    scarlet: 'var(--scarlet)',
    amber:   'var(--amber)',
    green:   'var(--green)',
    blue:    'var(--blue)',
  }
  return (
    <div style={{
      background: 'rgba(0,0,0,.25)',
      border: '1px solid var(--line)',
      borderRadius: 10,
      padding: 16,
    }}>
      <div style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 32,
        fontWeight: 800,
        letterSpacing: '-.02em',
        color: colorMap[color],
      }}>{num}</div>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10,
        color: 'var(--fg-dim)',
        letterSpacing: '.12em',
        textTransform: 'uppercase',
        marginTop: 4,
      }}>{label}</div>
    </div>
  )
}

function FocusList({
  progress,
  mounted,
}: {
  progress: ReturnType<typeof useProgress>
  mounted: boolean
}) {
  if (!mounted) {
    return <div style={{ height: 200, background: 'var(--bg-card)', borderRadius: 10, opacity: 0.4 }} />
  }

  const candidates = ALL_SKILLS.filter(
    s => s.p === 1 && progress.getState(s.slug) === 'pendente'
  )
  const ranked = candidates.map(s => {
    const deps = DEPENDENCIES[s.slug] ?? []
    const depsDone = deps.filter(d => progress.getState(d) === 'domino').length
    return { ...s, depsDone, depsTotal: deps.length }
  }).sort((a, b) => {
    const ra = a.depsTotal === 0 ? 1 : a.depsDone / a.depsTotal
    const rb = b.depsTotal === 0 ? 1 : b.depsDone / b.depsTotal
    return rb - ra
  }).slice(0, 8)

  if (ranked.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', color: 'var(--fg-dim)', padding: 32 }}>
        Todas as P1 já foram tocadas.{' '}
        <Link href="/skills" style={{ color: 'var(--scarlet)' }}>Bora pras P2 →</Link>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {ranked.map(s => {
        const url = iconUrl(s.name)
        return (
          <Link key={s.slug} href={`/skill/${s.slug}`} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '14px 18px',
            background: 'var(--bg-card)',
            border: '1px solid var(--line)',
            borderRadius: 10,
            transition: 'border-color .15s',
            color: 'inherit',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(239,68,68,.15)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--line)' }}
          >
            {url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={url} alt="" width={16} height={16} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
            )}
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13,
              flex: 1,
            }}>{s.name}</span>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              color: 'var(--fg-dim)',
            }}>{s.catLabel}</span>
            {s.depsTotal > 0 && (
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                color: 'var(--fg-dim)',
                opacity: 0.6,
              }}>{s.depsDone}/{s.depsTotal} deps</span>
            )}
            <span className="tag p1">P1</span>
          </Link>
        )
      })}
    </div>
  )
}
