'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import { CATEGORIES, slugify, iconUrl } from '@/data/skills'
import { SKILL_CONTENT } from '@/data/content'
import type { SkillContent } from '@/types'

type CoverageLevel = 'vazio' | 'minimo' | 'medio' | 'profundo'

const LEVEL_LABEL: Record<CoverageLevel, string> = {
  vazio:    'sem conteúdo',
  minimo:   'mínimo',
  medio:    'médio',
  profundo: 'profundo',
}

const LEVEL_COLOR: Record<CoverageLevel, string> = {
  vazio:    '#475569',
  minimo:   '#f59e0b',
  medio:    '#3b82f6',
  profundo: '#10b981',
}

function classify(c: SkillContent | null | undefined): CoverageLevel {
  if (!c) return 'vazio'
  const hasBasic   = !!(c.tagline || c.why)
  const hasGotchas = (c.gotchas?.length ?? 0) >= 2
  const hasSummary = !!c.summary
  const kpCount    = c.keypoints?.length ?? 0
  const qaCount    = c.interview?.length ?? 0
  const diagCount  = c.diagrams?.length ?? 0
  const hasCheat   = !!c.cheatsheet
  const hasMnemos  = (c.mnemonics?.length ?? 0) >= 1

  // Profundo (P1 React-level): summary + 5+ keypoints + 6+ Q&As + 1+ diagrama + cheatsheet/mnemonics
  if (hasSummary && kpCount >= 5 && qaCount >= 6 && diagCount >= 1 && (hasCheat || hasMnemos)) {
    return 'profundo'
  }
  // Médio (P2 floor): summary + 3+ keypoints + 4+ Q&As
  if (hasSummary && kpCount >= 3 && qaCount >= 4) {
    return 'medio'
  }
  // Mínimo (P3 floor): tagline + why + 2+ gotchas
  if (hasBasic && hasGotchas) {
    return 'minimo'
  }
  // Tem alguma coisa mas não bate piso
  if (c.tagline || c.why || kpCount > 0 || qaCount > 0) {
    return 'minimo'
  }
  return 'vazio'
}

function metrics(c: SkillContent | null | undefined) {
  if (!c) return { kp: 0, qa: 0, dg: 0, gt: 0, ch: false, mn: 0, ex: 0 }
  return {
    kp: c.keypoints?.length ?? 0,
    qa: c.interview?.length ?? 0,
    dg: c.diagrams?.length ?? 0,
    gt: c.gotchas?.length ?? 0,
    ch: !!c.cheatsheet,
    mn: c.mnemonics?.length ?? 0,
    ex: c.exercises?.length ?? 0,
  }
}

export default function CoveragePage() {
  const [filter, setFilter] = useState<'all' | CoverageLevel | 'p1' | 'p2' | 'p3'>('all')
  const [query, setQuery]   = useState('')

  const allRows = useMemo(() => {
    const rows: { name: string; slug: string; p: number; cat: string; catLabel: string; level: CoverageLevel; m: ReturnType<typeof metrics> }[] = []
    for (const cat of CATEGORIES) {
      for (const [name, p] of cat.skills) {
        const slug = slugify(name)
        const content = SKILL_CONTENT[slug]
        rows.push({
          name, slug, p, cat: cat.key, catLabel: cat.label,
          level: classify(content),
          m: metrics(content),
        })
      }
    }
    return rows
  }, [])

  const stats = useMemo(() => {
    const out = { vazio: 0, minimo: 0, medio: 0, profundo: 0, total: allRows.length }
    for (const r of allRows) out[r.level]++
    return out
  }, [allRows])

  const statsByPriority = useMemo(() => {
    const out = {
      1: { vazio: 0, minimo: 0, medio: 0, profundo: 0, total: 0 },
      2: { vazio: 0, minimo: 0, medio: 0, profundo: 0, total: 0 },
      3: { vazio: 0, minimo: 0, medio: 0, profundo: 0, total: 0 },
    } as Record<number, { vazio: number; minimo: number; medio: number; profundo: number; total: number }>
    for (const r of allRows) {
      out[r.p][r.level]++
      out[r.p].total++
    }
    return out
  }, [allRows])

  function isVisible(r: typeof allRows[0]): boolean {
    const q = query.toLowerCase().trim()
    if (q && !r.name.toLowerCase().includes(q) && !r.slug.includes(q)) return false
    if (filter === 'all') return true
    if (filter === 'p1') return r.p === 1
    if (filter === 'p2') return r.p === 2
    if (filter === 'p3') return r.p === 3
    return r.level === filter
  }

  const FILTERS: { key: typeof filter; label: string }[] = [
    { key: 'all',      label: 'todas' },
    { key: 'profundo', label: 'profundo' },
    { key: 'medio',    label: 'médio' },
    { key: 'minimo',   label: 'mínimo' },
    { key: 'vazio',    label: 'vazio' },
    { key: 'p1',       label: 'p1' },
    { key: 'p2',       label: 'p2' },
    { key: 'p3',       label: 'p3' },
  ]

  return (
    <>
      <Nav />
      <div className="shell">
        <p className="hdr-label"><span className="ln" /> diagnóstico provisório</p>
        <h1>Cobertura de <em>conteúdo</em></h1>
        <p className="desc">
          Status do conteúdo de cada skill. <strong style={{ color: 'var(--fg)' }}>Profundo</strong> = nível React (diagramas + keypoints + cheatsheet + Q&As).{' '}
          <strong style={{ color: 'var(--fg)' }}>Médio</strong> = piso P2 (summary + 3+ kp + 4+ Q&A).{' '}
          <strong style={{ color: 'var(--fg)' }}>Mínimo</strong> = piso P3 (tagline + why + gotchas).{' '}
          <strong style={{ color: 'var(--fg)' }}>Vazio</strong> = sem conteúdo.
        </p>

        {/* Stats overview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 12,
          margin: '24px 0',
        }}>
          {(['profundo', 'medio', 'minimo', 'vazio'] as CoverageLevel[]).map(level => {
            const count = stats[level]
            const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0
            return (
              <div key={level} style={{
                padding: '16px 18px',
                background: 'var(--card)',
                border: '1px solid var(--line)',
                borderLeft: `3px solid ${LEVEL_COLOR[level]}`,
                borderRadius: 8,
              }}>
                <div style={{ fontSize: 11, color: 'var(--fg-dim)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>
                  {LEVEL_LABEL[level]}
                </div>
                <div style={{ fontSize: 28, fontWeight: 700, color: LEVEL_COLOR[level], fontFamily: "'JetBrains Mono', monospace" }}>
                  {count}
                </div>
                <div style={{ fontSize: 12, color: 'var(--fg-dim)', marginTop: 4 }}>
                  {pct}% do total
                </div>
              </div>
            )
          })}
        </div>

        {/* Stats por prioridade */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
          marginBottom: 28,
        }}>
          {[1, 2, 3].map(p => {
            const s = statsByPriority[p]
            return (
              <div key={p} style={{
                padding: '14px 16px',
                background: 'var(--card)',
                border: '1px solid var(--line)',
                borderRadius: 8,
              }}>
                <div style={{ fontSize: 11, color: 'var(--fg-dim)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>
                  P{p} — {s.total} skills
                </div>
                <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', background: '#1e293b', marginBottom: 8 }}>
                  {(['profundo', 'medio', 'minimo', 'vazio'] as CoverageLevel[]).map(level => {
                    const w = s.total > 0 ? (s[level] / s.total) * 100 : 0
                    if (w === 0) return null
                    return (
                      <div key={level} title={`${LEVEL_LABEL[level]}: ${s[level]}`}
                        style={{ width: `${w}%`, background: LEVEL_COLOR[level] }}
                      />
                    )
                  })}
                </div>
                <div style={{ fontSize: 11, color: 'var(--fg-dim)', display: 'flex', gap: 10, fontFamily: "'JetBrains Mono', monospace" }}>
                  <span style={{ color: LEVEL_COLOR.profundo }}>● {s.profundo}</span>
                  <span style={{ color: LEVEL_COLOR.medio }}>● {s.medio}</span>
                  <span style={{ color: LEVEL_COLOR.minimo }}>● {s.minimo}</span>
                  <span style={{ color: LEVEL_COLOR.vazio }}>● {s.vazio}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Filtros */}
        <div className="filterbar">
          <input
            type="text"
            className="search"
            placeholder="buscar — ex: react, postgres, kafka"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {FILTERS.map(f => (
            <span
              key={f.key}
              className={`pill${filter === f.key ? ' active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </span>
          ))}
        </div>

        {/* Tabela por categoria */}
        {CATEGORIES.map(cat => {
          const rows = allRows.filter(r => r.cat === cat.key && isVisible(r))
          if (rows.length === 0) return null
          const catTotal = allRows.filter(r => r.cat === cat.key).length

          return (
            <div key={cat.key} className="tier">
              <div className="tier-hd">
                <span className="tier-lbl">{cat.label}</span>
                <span className="tier-ln" />
                <span className="tier-ct">{rows.length}/{catTotal}</span>
              </div>

              <div style={{ overflowX: 'auto', marginBottom: 8 }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: 12,
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--line)', color: 'var(--fg-dim)' }}>
                      <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 500 }}>skill</th>
                      <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 500, width: 50 }}>P</th>
                      <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 500, width: 110 }}>nível</th>
                      <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 500, width: 50 }} title="keypoints">kp</th>
                      <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 500, width: 50 }} title="interview Q&As">q&a</th>
                      <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 500, width: 50 }} title="diagrams">dg</th>
                      <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 500, width: 50 }} title="gotchas">gt</th>
                      <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 500, width: 40 }} title="cheatsheet">ch</th>
                      <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 500, width: 50 }} title="mnemonics">mn</th>
                      <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 500, width: 50 }} title="exercises">ex</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(r => {
                      const url = iconUrl(r.name)
                      return (
                        <tr key={r.slug} style={{ borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                          <td style={{ padding: '8px 10px' }}>
                            <Link href={`/skill/${r.slug}`} style={{ color: 'var(--fg)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                              {url && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={url} alt="" width={14} height={14} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                              )}
                              {r.name}
                            </Link>
                          </td>
                          <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                            <span className={`dot p${r.p}`} style={{ display: 'inline-block' }} />
                          </td>
                          <td style={{ padding: '8px 10px' }}>
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: 4,
                              fontSize: 10,
                              background: `${LEVEL_COLOR[r.level]}22`,
                              color: LEVEL_COLOR[r.level],
                              border: `1px solid ${LEVEL_COLOR[r.level]}55`,
                            }}>
                              {LEVEL_LABEL[r.level]}
                            </span>
                          </td>
                          <td style={{ padding: '8px 10px', textAlign: 'center', color: r.m.kp > 0 ? 'var(--fg)' : 'var(--fg-dim)' }}>{r.m.kp || '—'}</td>
                          <td style={{ padding: '8px 10px', textAlign: 'center', color: r.m.qa > 0 ? 'var(--fg)' : 'var(--fg-dim)' }}>{r.m.qa || '—'}</td>
                          <td style={{ padding: '8px 10px', textAlign: 'center', color: r.m.dg > 0 ? 'var(--fg)' : 'var(--fg-dim)' }}>{r.m.dg || '—'}</td>
                          <td style={{ padding: '8px 10px', textAlign: 'center', color: r.m.gt > 0 ? 'var(--fg)' : 'var(--fg-dim)' }}>{r.m.gt || '—'}</td>
                          <td style={{ padding: '8px 10px', textAlign: 'center', color: r.m.ch ? '#10b981' : 'var(--fg-dim)' }}>{r.m.ch ? '✓' : '—'}</td>
                          <td style={{ padding: '8px 10px', textAlign: 'center', color: r.m.mn > 0 ? 'var(--fg)' : 'var(--fg-dim)' }}>{r.m.mn || '—'}</td>
                          <td style={{ padding: '8px 10px', textAlign: 'center', color: r.m.ex > 0 ? 'var(--fg)' : 'var(--fg-dim)' }}>{r.m.ex || '—'}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )
        })}

        <div style={{
          marginTop: 32,
          paddingTop: 16,
          borderTop: '1px solid var(--line)',
          fontSize: 11,
          color: 'var(--fg-dim)',
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          tab provisória · {stats.total} skills · {stats.profundo} profundo + {stats.medio} médio + {stats.minimo} mínimo + {stats.vazio} vazio
        </div>
      </div>
    </>
  )
}
