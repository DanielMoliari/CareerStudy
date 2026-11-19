'use client'
import { useMemo, useState } from 'react'
import Nav from '@/components/Nav'
import { ATTEMPTS } from '@/data/log/attempts'
import type { Attempt, AttemptOutcome, AttemptTrack } from '@/types'

/* ─── Meta ─── */

const TRACK_META: Record<AttemptTrack, { label: string; color: string; ico: string }> = {
  dsa: { label: 'DSA', color: '#22c55e', ico: '⌨️' },
  sysdesign: { label: 'System Design', color: 'var(--scarlet)', ico: '🏗' },
}

const SOURCE_LABEL: Record<Attempt['source'], string> = {
  'js-basico': 'JS básico',
  leetcode: 'LeetCode',
  'system-design': 'System Design',
}

const OUTCOME_META: Record<AttemptOutcome, { label: string; color: string }> = {
  resolvido: { label: 'resolvido', color: '#22c55e' },
  'resolvido-com-ajuda': { label: 'resolvido c/ ajuda', color: '#3b82f6' },
  parcial: { label: 'parcial', color: '#f59e0b' },
  travou: { label: 'travou', color: 'var(--scarlet)' },
  estudo: { label: 'estudo', color: '#a78bfa' },
}

const LEVEL_LABEL: Record<NonNullable<Attempt['level']>, string> = {
  facil: 'fácil', medio: 'médio', dificil: 'difícil',
}

/* ─── Stats ─── */

function computeStats(items: Attempt[]) {
  const total = items.length
  const byTrack: Record<AttemptTrack, number> = { dsa: 0, sysdesign: 0 }
  const gapCount: Record<string, number> = {}
  let resolved = 0

  for (const a of items) {
    byTrack[a.track]++
    if (a.outcome === 'resolvido' || a.outcome === 'resolvido-com-ajuda') resolved++
    for (const g of a.gaps) gapCount[g.categoria] = (gapCount[g.categoria] ?? 0) + 1
  }

  const topGaps = Object.entries(gapCount).sort((a, b) => b[1] - a[1]).slice(0, 5)
  return { total, byTrack, resolved, topGaps }
}

/* ─── Components ─── */

function AttemptCard({ a }: { a: Attempt }) {
  const [open, setOpen] = useState(false)
  const tm = TRACK_META[a.track]
  const om = OUTCOME_META[a.outcome]

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', borderLeft: `3px solid ${tm.color}` }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', textAlign: 'left', padding: '16px 20px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 8 }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--fg-dim)' }}>{a.date}</span>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: '.06em', textTransform: 'uppercase', color: tm.color, background: tm.color + '22', padding: '2px 7px', borderRadius: 4 }}>{tm.label}</span>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: 'var(--fg-dim)', background: 'var(--bg-elev)', padding: '2px 7px', borderRadius: 4 }}>{SOURCE_LABEL[a.source]}</span>
          {a.level && <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: 'var(--fg-dim)' }}>{LEVEL_LABEL[a.level]}</span>}
          {a.timeSpent && <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: 'var(--fg-dim)', marginLeft: 'auto' }}>{a.timeSpent}</span>}
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: '.06em', textTransform: 'uppercase', color: om.color, background: om.color + '1a', padding: '2px 7px', borderRadius: 4 }}>{om.label}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, fontWeight: 700, color: 'var(--fg)', flex: 1 }}>{a.title}</span>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--fg-dim)', transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .2s' }}>▶</span>
        </div>
      </button>

      {open && (
        <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 16, borderTop: '1px solid var(--line)' }}>
          <div style={{ paddingTop: 16 }}>
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--fg-dim)', marginBottom: 8 }}>como foi</p>
            <p style={{ fontSize: 13, color: 'var(--fg-mute)', lineHeight: 1.7, margin: 0 }}>{a.narrative}</p>
          </div>

          {a.submission && (
            <div>
              <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--fg-dim)', marginBottom: 8 }}>submissão</p>
              <pre style={{ background: 'var(--bg-elev)', border: '1px solid var(--line)', borderRadius: 8, padding: '14px 16px', overflowX: 'auto', margin: 0 }}>
                <code style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: 'var(--fg)', whiteSpace: 'pre' }}>{a.submission}</code>
              </pre>
            </div>
          )}

          {a.studyTopics && a.studyTopics.length > 0 && (
            <div>
              <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--fg-dim)', marginBottom: 10 }}>tópicos estudados</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {a.studyTopics.map((t, i) => (
                  <div key={i} style={{ background: 'var(--bg-elev)', border: '1px solid var(--line)', borderRadius: 8, padding: '12px 16px' }}>
                    <h4 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, fontWeight: 700, margin: '0 0 6px', color: 'var(--fg)' }}>{t.titulo}</h4>
                    <p style={{ fontSize: 12.5, color: 'var(--fg-mute)', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>{t.corpo}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {a.gaps.length > 0 && (
            <div>
              <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--fg-dim)', marginBottom: 8 }}>gaps identificados</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {a.gaps.map((g, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, fontSize: 12.5 }}>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--scarlet)', background: 'var(--scarlet-soft)', padding: '2px 7px', borderRadius: 4, flexShrink: 0, height: 'fit-content' }}>{g.categoria}</span>
                    <span style={{ color: 'var(--fg-mute)', lineHeight: 1.6 }}>{g.descricao}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--fg-dim)', marginBottom: 8 }}>análise</p>
            <p style={{ fontSize: 13, color: 'var(--fg-mute)', lineHeight: 1.7, margin: 0 }}>{a.analysis}</p>
          </div>

          {a.nextStep && (
            <div style={{ background: 'rgba(59,130,246,.08)', border: '1px solid rgba(59,130,246,.25)', borderRadius: 8, padding: '12px 16px' }}>
              <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: '.05em', textTransform: 'uppercase', color: '#3b82f6', margin: '0 0 4px' }}>próximo passo</p>
              <p style={{ fontSize: 12.5, color: 'var(--fg-mute)', lineHeight: 1.6, margin: 0 }}>{a.nextStep}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ─── Page ─── */

export default function LogPage() {
  const [filter, setFilter] = useState<'all' | AttemptTrack>('all')
  const stats = useMemo(() => computeStats(ATTEMPTS), [])
  const items = useMemo(() => {
    const sorted = [...ATTEMPTS].sort((a, b) => b.date.localeCompare(a.date))
    return filter === 'all' ? sorted : sorted.filter(a => a.track === filter)
  }, [filter])

  return (
    <>
      <Nav />
      <div className="shell">

        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg,rgba(239,68,68,.06),rgba(168,85,247,.04))', border: '1px solid var(--scarlet-soft)', borderRadius: 16, padding: '26px 30px', marginBottom: 28, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 90% 10%,rgba(239,68,68,.14),transparent 55%)', pointerEvents: 'none' }} />
          <p className="hdr-label"><span className="ln" /> histórico de tentativas</p>
          <h1>Cada tentativa é <em>dado</em>.</h1>
          <p className="desc" style={{ marginBottom: 0, maxWidth: 680 }}>
            Registro cronológico de problemas de DSA (JS básico → LeetCode) e desenhos de System Design, com análise de gap por trás de cada trava. Alimenta os checkpoints do <a href="/gap" style={{ color: 'var(--scarlet)' }}>plano técnico</a>.
          </p>
        </div>

        {/* Stats */}
        {stats.total > 0 && (
          <section style={{ marginBottom: 28 }}>
            <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))' }}>
              <div className="card" style={{ padding: '16px 18px' }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--fg-dim)', marginBottom: 6 }}>total</div>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 26, fontWeight: 700 }}>{stats.total}</div>
              </div>
              <div className="card" style={{ padding: '16px 18px' }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--fg-dim)', marginBottom: 6 }}>DSA</div>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 26, fontWeight: 700, color: TRACK_META.dsa.color }}>{stats.byTrack.dsa}</div>
              </div>
              <div className="card" style={{ padding: '16px 18px' }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--fg-dim)', marginBottom: 6 }}>system design</div>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 26, fontWeight: 700, color: TRACK_META.sysdesign.color }}>{stats.byTrack.sysdesign}</div>
              </div>
              <div className="card" style={{ padding: '16px 18px' }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--fg-dim)', marginBottom: 6 }}>resolvidos</div>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 26, fontWeight: 700 }}>{stats.resolved}<span style={{ fontSize: 14, color: 'var(--fg-dim)' }}>/{stats.total}</span></div>
              </div>
            </div>

            {stats.topGaps.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--fg-dim)', marginBottom: 8 }}>gaps mais recorrentes</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {stats.topGaps.map(([cat, count]) => (
                    <span key={cat} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: 'var(--fg)', background: 'var(--bg-card)', border: '1px solid var(--line)', padding: '5px 10px', borderRadius: 6 }}>
                      {cat} <span style={{ color: 'var(--scarlet)', fontWeight: 700 }}>×{count}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Filter */}
        <div style={{ display: 'flex', gap: 6, background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 12, padding: 5, marginBottom: 20, width: 'fit-content' }}>
          {(['all', 'dsa', 'sysdesign'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '9px 16px', border: 'none', borderRadius: 8,
                fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: '.04em', cursor: 'pointer', transition: 'all .15s',
                background: filter === f ? 'var(--scarlet)' : 'transparent',
                color: filter === f ? '#fff' : 'var(--fg-mute)',
              }}
            >
              {f === 'all' ? 'tudo' : TRACK_META[f].label}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <section style={{ marginBottom: 40 }}>
          {items.length === 0 ? (
            <div style={{ background: 'var(--bg-card)', border: '1px dashed var(--line)', borderRadius: 12, padding: 40, textAlign: 'center', color: 'var(--fg-dim)', fontSize: 13 }}>
              <p style={{ marginBottom: 6 }}><strong style={{ color: 'var(--fg)' }}>Nenhuma tentativa registrada ainda.</strong></p>
              <p style={{ fontSize: 12 }}>Manda o código/desenho + como foi no chat — cada entrada vira um registro aqui, com análise de gap.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {items.map(a => <AttemptCard key={a.id} a={a} />)}
            </div>
          )}
        </section>

      </div>
    </>
  )
}
