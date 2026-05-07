'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Nav from '@/components/Nav'
import { CATEGORIES, ALL_SKILLS, SKILL_BY_SLUG, DEPENDENCIES, iconUrl } from '@/data/skills'
import { useProgress, STATE_COLORS } from '@/hooks/useProgress'

const COL_W = 220
const ROW_H = 44
const NODE_W = 188
const NODE_H = 34
const PAD_X = 60
const PAD_Y = 60
const BAND_GAP = 24
const CAT_ORDER = CATEGORIES.map(c => c.key)

// Build adjacency once at module level
const fwd: Record<string, string[]> = {}
const bwd: Record<string, string[]> = {}
for (const s of ALL_SKILLS) { fwd[s.slug] = []; bwd[s.slug] = [] }
for (const [dep, prereqs] of Object.entries(DEPENDENCIES)) {
  if (!SKILL_BY_SLUG[dep]) continue
  for (const pr of prereqs) {
    if (!SKILL_BY_SLUG[pr]) continue
    if (!fwd[pr]) fwd[pr] = []
    if (!bwd[dep]) bwd[dep] = []
    fwd[pr].push(dep)
    bwd[dep].push(pr)
  }
}

function computeLevels() {
  const level: Record<string, number> = {}
  function calc(slug: string, stack: Set<string>): number {
    if (level[slug] !== undefined) return level[slug]
    if (stack.has(slug)) return 0
    stack.add(slug)
    const prereqs = bwd[slug] || []
    let lv = 0
    for (const p of prereqs) lv = Math.max(lv, calc(p, stack) + 1)
    stack.delete(slug)
    level[slug] = lv
    return lv
  }
  for (const s of ALL_SKILLS) calc(s.slug, new Set())
  return level
}
const LEVELS = computeLevels()

function collectAncestors(slug: string): Set<string> {
  const out = new Set<string>()
  const stack = [...(bwd[slug] || [])]
  while (stack.length) {
    const s = stack.pop()!
    if (out.has(s)) continue
    out.add(s)
    for (const p of (bwd[s] || [])) stack.push(p)
  }
  return out
}
function collectDescendants(slug: string): Set<string> {
  const out = new Set<string>()
  const stack = [...(fwd[slug] || [])]
  while (stack.length) {
    const s = stack.pop()!
    if (out.has(s)) continue
    out.add(s)
    for (const p of (fwd[s] || [])) stack.push(p)
  }
  return out
}

interface NodePos { x: number; y: number; lv: number }
interface LayoutResult {
  positions: Record<string, NodePos>
  byLevel: Record<number, string[]>
  maxLevel: number
  width: number
  height: number
}

function layoutNodes(slugs: Set<string>): LayoutResult {
  const byLevel: Record<number, string[]> = {}
  let maxLevel = 0
  for (const slug of slugs) {
    const lv = LEVELS[slug] ?? 0
    maxLevel = Math.max(maxLevel, lv)
    if (!byLevel[lv]) byLevel[lv] = []
    byLevel[lv].push(slug)
  }
  for (const lv of Object.keys(byLevel)) {
    byLevel[+lv].sort((a, b) => {
      const sa = SKILL_BY_SLUG[a], sb = SKILL_BY_SLUG[b]
      const ca = CAT_ORDER.indexOf(sa?.cat ?? ''), cb = CAT_ORDER.indexOf(sb?.cat ?? '')
      if (ca !== cb) return ca - cb
      return (sa?.name ?? '').localeCompare(sb?.name ?? '')
    })
  }
  const positions: Record<string, NodePos> = {}
  for (let lv = 0; lv <= maxLevel; lv++) {
    const col = byLevel[lv] || []
    col.forEach((slug, i) => {
      positions[slug] = { x: PAD_X + lv * COL_W, y: PAD_Y + i * ROW_H, lv }
    })
  }
  const cols = Array.from({ length: maxLevel + 1 }, (_, i) => (byLevel[i] || []).length)
  const maxRows = Math.max(1, ...cols)
  return {
    positions, byLevel, maxLevel,
    width: PAD_X * 2 + (maxLevel + 1) * COL_W,
    height: PAD_Y * 2 + maxRows * ROW_H,
  }
}

export default function GraphPage() {
  const router = useRouter()
  const { getState, mounted } = useProgress(ALL_SKILLS)
  const svgContainerRef = useRef<HTMLDivElement>(null)

  const [pFilter, setPFilter] = useState<string>('todas-p')
  const [cFilter, setCFilter] = useState<string>('todas')
  const [q, setQ] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [showLabels, setShowLabels] = useState(true)
  const [hoverSlug, setHoverSlug] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const svgRef = useRef<SVGSVGElement>(null)
  const gRef = useRef<SVGGElement>(null)
  const panRef = useRef({ x: 0, y: 0 })
  const zoomRef = useRef(1)
  const dragging = useRef(false)
  const lastMouse = useRef({ x: 0, y: 0 })

  const applyTransform = () => {
    gRef.current?.setAttribute('transform', `translate(${panRef.current.x} ${panRef.current.y}) scale(${zoomRef.current})`)
  }

  // Re-apply after every React render so hover/filter re-renders don't reset the transform
  useLayoutEffect(() => { applyTransform() })

  // Build visible set
  const visibleSet = useMemo(() => {
    const out = new Set<string>()
    for (const s of ALL_SKILLS) {
      const hasEdge = (fwd[s.slug]?.length ?? 0) + (bwd[s.slug]?.length ?? 0) > 0
      if (!showAll && !hasEdge) continue
      if (pFilter === 'p1' && s.p !== 1) continue
      if (pFilter === 'p2' && s.p !== 2) continue
      if (pFilter === 'p3' && s.p !== 3) continue
      if (cFilter !== 'todas' && s.cat !== cFilter) continue
      if (q && !s.name.toLowerCase().includes(q)) continue
      out.add(s.slug)
    }
    return out
  }, [pFilter, cFilter, q, showAll])

  const layout = useMemo(() => layoutNodes(visibleSet), [visibleSet])
  const { positions, byLevel, maxLevel, width, height } = layout

  // Stats
  const edgeCount = useMemo(() => {
    let count = 0
    for (const slug of visibleSet) {
      for (const pr of (bwd[slug] || [])) if (visibleSet.has(pr)) count++
    }
    return count
  }, [visibleSet])

  const rootCount = useMemo(() => {
    let count = 0
    for (const slug of visibleSet) {
      if ((bwd[slug] || []).filter(p => visibleSet.has(p)).length === 0) count++
    }
    return count
  }, [visibleSet])

  const depth = useMemo(() => {
    let d = 0
    for (const slug of visibleSet) d = Math.max(d, (LEVELS[slug] ?? 0) + 1)
    return d
  }, [visibleSet])

  const topBlockers = useMemo(() =>
    ALL_SKILLS
      .map(s => ({ s, count: (fwd[s.slug] || []).length }))
      .filter(x => x.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5),
    []
  )

  // Highlight chain
  const highlightInfo = useMemo(() => {
    if (!hoverSlug) return null
    const anc = collectAncestors(hoverSlug)
    const dec = collectDescendants(hoverSlug)
    const all = new Set([hoverSlug, ...anc, ...dec])
    return { all, anc, dec }
  }, [hoverSlug])

  // All pan/zoom event listeners — same pattern as the original HTML version
  useEffect(() => {
    const el = svgContainerRef.current
    const svg = svgRef.current
    if (!el || !svg) return

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const delta = -e.deltaY * 0.0015
      const newZoom = Math.max(0.3, Math.min(3, zoomRef.current * (1 + delta)))
      const rect = el.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      const ratio = newZoom / zoomRef.current
      panRef.current = { x: mx - (mx - panRef.current.x) * ratio, y: my - (my - panRef.current.y) * ratio }
      zoomRef.current = newZoom
      applyTransform()
    }

    const onDown = (e: MouseEvent) => {
      if (e.button !== 0) return
      if ((e.target as Element).closest('[data-node]')) return
      e.preventDefault()
      dragging.current = true
      setIsDragging(true)
      lastMouse.current = { x: e.clientX, y: e.clientY }
    }

    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return
      panRef.current = {
        x: panRef.current.x + e.clientX - lastMouse.current.x,
        y: panRef.current.y + e.clientY - lastMouse.current.y,
      }
      lastMouse.current = { x: e.clientX, y: e.clientY }
      applyTransform()
    }

    const onUp = () => {
      if (!dragging.current) return
      dragging.current = false
      setIsDragging(false)
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    svg.addEventListener('mousedown', onDown)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      el.removeEventListener('wheel', onWheel)
      svg.removeEventListener('mousedown', onDown)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getNodeColor = (slug: string) => {
    const state = getState(slug)
    return STATE_COLORS[state]
  }

  const getNodeBg = (slug: string) => {
    const state = getState(slug)
    if (state === 'domino') return 'rgba(34,197,94,.12)'
    if (state === 'praticando') return 'rgba(59,130,246,.10)'
    if (state === 'lendo') return 'rgba(234,179,8,.10)'
    if (state === 'revisar') return 'rgba(168,85,247,.10)'
    return 'var(--bg-elev)'
  }

  return (
    <>
      <Nav />
      <div className="shell-wide">

      <p className="hdr-label"><span className="ln" /> grafo de pré-requisitos</p>
      <h1>Ordem natural de <em>aprendizado</em></h1>
      <p className="desc">
        Cada nó é uma skill. As setas vão do <strong style={{ color: 'var(--fg)' }}>pré-requisito</strong> para o <strong style={{ color: 'var(--fg)' }}>dependente</strong> — siga as flechas para descobrir o que estudar antes do que.
        Cores indicam progresso. <strong style={{ color: 'var(--fg)' }}>Hover</strong> destaca a cadeia, <strong style={{ color: 'var(--fg)' }}>clique</strong> abre o detalhe da skill.
      </p>

      {/* Priority filter */}
      <div className="filterbar compact" style={{ marginBottom: 12 }}>
        {[['todas-p','todas'],['p1','p1'],['p2','p2'],['p3','p3']].map(([v,l]) => (
          <span key={v} className={`pill${pFilter === v ? ' active' : ''}`} onClick={() => setPFilter(v)}>{l}</span>
        ))}
      </div>

      {/* Category filter */}
      <div className="filterbar compact" style={{ marginBottom: 12 }}>
        <span className={`pill${cFilter === 'todas' ? ' active' : ''}`} onClick={() => setCFilter('todas')}>todas categorias</span>
        {CATEGORIES.map(c => (
          <span key={c.key} className={`pill${cFilter === c.key ? ' active' : ''}`} onClick={() => setCFilter(c.key)}>{c.label.toLowerCase()}</span>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 14 }}>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 9, fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--fg-mute)', cursor: 'pointer', userSelect: 'none' }}>
          <input type="checkbox" checked={showAll} onChange={e => setShowAll(e.target.checked)} style={{ accentColor: 'var(--scarlet)' }} />
          mostrar skills sem dependências
        </label>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 9, fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--fg-mute)', cursor: 'pointer', userSelect: 'none' }}>
          <input type="checkbox" checked={showLabels} onChange={e => setShowLabels(e.target.checked)} style={{ accentColor: 'var(--scarlet)' }} />
          mostrar nomes
        </label>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'inline-flex', gap: 4 }}>
          <button className="btn" onClick={() => { zoomRef.current = Math.min(3, zoomRef.current * 1.2); applyTransform() }}>+</button>
          <button className="btn" onClick={() => { zoomRef.current = Math.max(0.3, zoomRef.current / 1.2); applyTransform() }}>−</button>
          <button className="btn ghost" onClick={() => { panRef.current = { x: 0, y: 0 }; zoomRef.current = 1; applyTransform() }}>reset</button>
        </div>
      </div>

      {/* Main layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>

        {/* Graph */}
        <div
          ref={svgContainerRef}
          style={{ background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 14, overflow: 'hidden', position: 'relative', height: 720, cursor: isDragging ? 'grabbing' : 'grab', backgroundImage: 'radial-gradient(circle at 20% 10%, rgba(239,68,68,.04), transparent 40%), radial-gradient(circle at 80% 90%, rgba(168,85,247,.04), transparent 50%)' }}
        >
          <svg
            ref={svgRef}
            xmlns="http://www.w3.org/2000/svg"
            width={Math.max(width, 800)}
            height={Math.max(height, 600)}
            style={{ display: 'block', userSelect: 'none' }}
          >
            {/* transparent hit area so empty space triggers drag */}
            <rect x={0} y={0} width={Math.max(width, 800)} height={Math.max(height, 600)} fill="transparent" />
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(148,163,184,0.45)" />
              </marker>
              <marker id="arrow-hi" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
              </marker>
            </defs>

            {/* Bands + edges + nodes in one transform group */}
            <g ref={gRef}>
              {/* Level bands */}
              {Array.from({ length: maxLevel + 1 }, (_, lv) => {
                const cx = PAD_X + lv * COL_W + NODE_W / 2
                return (
                  <g key={lv}>
                    <line
                      x1={cx} y1={PAD_Y - BAND_GAP}
                      x2={cx} y2={Math.max(height, 600) - PAD_Y + BAND_GAP}
                      stroke="var(--line)" strokeDasharray="2 6"
                    />
                    <text
                      x={cx} y={PAD_Y - BAND_GAP - 4}
                      textAnchor="middle"
                      style={{ fill: 'var(--fg-dim)', fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', opacity: .5, pointerEvents: 'none' }}
                    >
                      {lv === 0 ? 'nível 0 — base' : `nível ${lv}`}
                    </text>
                  </g>
                )
              })}

              {/* Edges */}
              {[...visibleSet].map(slug => {
                const a = positions[slug]
                if (!a) return null
                return (bwd[slug] || []).filter(pr => visibleSet.has(pr)).map(pr => {
                  const b = positions[pr]
                  if (!b) return null
                  const x1 = b.x + NODE_W, y1 = b.y + NODE_H / 2
                  const x2 = a.x,         y2 = a.y + NODE_H / 2
                  const mx = (x1 + x2) / 2
                  const isHi = highlightInfo?.all.has(slug) && highlightInfo?.all.has(pr)
                  const isDim = highlightInfo && !isHi
                  return (
                    <path
                      key={`${pr}-${slug}`}
                      d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
                      fill="none"
                      stroke={isHi ? 'var(--scarlet)' : 'rgba(148,163,184,0.18)'}
                      strokeWidth={isHi ? 2 : 1.2}
                      opacity={isDim ? 0.15 : 1}
                      style={{ transition: 'stroke .2s, stroke-width .2s, opacity .2s' }}
                      markerEnd={isHi ? 'url(#arrow-hi)' : 'url(#arrow)'}
                    />
                  )
                })
              })}

              {/* Nodes */}
              {[...visibleSet].map(slug => {
                const sk = SKILL_BY_SLUG[slug]
                if (!sk) return null
                const pos = positions[slug]
                if (!pos) return null
                const color = getNodeColor(slug)
                const bg = getNodeBg(slug)
                const url = iconUrl(sk.name)
                const labelTxt = sk.name.length > 20 ? sk.name.slice(0, 19) + '…' : sk.name
                const isHi = highlightInfo?.all.has(slug)
                const isDim = highlightInfo && !isHi

                return (
                  <g
                    key={slug}
                    data-node="1"
                    transform={`translate(${pos.x},${pos.y})`}
                    style={{ cursor: 'pointer', opacity: isDim ? 0.18 : 1, transition: 'opacity .2s' }}
                    onMouseEnter={() => setHoverSlug(slug)}
                    onMouseLeave={() => setHoverSlug(null)}
                    onClick={() => router.push('/skill/' + slug)}
                  >
                    <rect
                      x={0} y={0} width={NODE_W} height={NODE_H} rx={8} ry={8}
                      fill={bg}
                      stroke={color === '#64748b' ? 'rgba(255,255,255,0.10)' : color}
                      strokeWidth={isHi ? 2.2 : 1.4}
                      style={{ transition: 'stroke .2s, stroke-width .2s, fill .2s' }}
                    />
                    <circle
                      cx={10} cy={NODE_H / 2} r={3}
                      fill={sk.p === 1 ? 'var(--scarlet)' : sk.p === 2 ? 'var(--amber)' : 'var(--slate)'}
                    />
                    {url && (
                      <foreignObject x={20} y={(NODE_H - 16) / 2} width={16} height={16}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="" width={16} height={16} style={{ display: 'block' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                      </foreignObject>
                    )}
                    {showLabels && (
                      <text
                        x={url ? 44 : 24} y={NODE_H / 2 + 1}
                        dominantBaseline="middle"
                        style={{ fill: 'var(--fg)', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, pointerEvents: 'none' }}
                      >
                        {labelTxt}
                      </text>
                    )}
                  </g>
                )
              })}
            </g>
          </svg>

        </div>

        {/* Sidebar */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'sticky', top: 80, alignSelf: 'start' }}>

          {/* Legend */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 12, padding: '16px 18px' }}>
            <h4 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--scarlet)', letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 12 }}>Estado de progresso</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(['pendente','lendo','praticando','domino','revisar'] as const).map(st => (
                <div key={st} style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--fg-mute)' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: STATE_COLORS[st], flexShrink: 0, display: 'inline-block' }} />
                  <span style={{ color: 'var(--fg)' }}>{st}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 12, padding: '16px 18px' }}>
            <h4 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--scarlet)', letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 12 }}>Estatisticas</h4>
            <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr' }}>
              {[
                { num: visibleSet.size, lbl: 'nós', color: 'var(--scarlet)' },
                { num: edgeCount, lbl: 'arestas', color: 'var(--blue)' },
                { num: depth, lbl: 'profundidade', color: 'var(--amber)' },
                { num: rootCount, lbl: 'raizes', color: 'var(--green)' },
              ].map(({ num, lbl, color }) => (
                <div key={lbl} style={{ background: 'var(--bg-card-2)', border: '1px solid var(--line)', borderRadius: 8, padding: '10px 12px' }}>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 22, fontWeight: 800, color, letterSpacing: '-.02em' }}>{num}</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'var(--fg-dim)', letterSpacing: '.12em', textTransform: 'uppercase', marginTop: 2 }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Top blockers */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 12, padding: '16px 18px' }}>
            <h4 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--scarlet)', letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 8 }}>Top 5 skills bloqueantes</h4>
            <p style={{ fontSize: 11, color: 'var(--fg-dim)', marginBottom: 10, lineHeight: 1.55 }}>Skills que destrancam o maior número de outras.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {topBlockers.map((r, i) => {
                const url = iconUrl(r.s.name)
                return (
                  <a
                    key={r.s.slug}
                    href={'/skill/' + r.s.slug}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: 'var(--bg-card-2)', border: '1px solid var(--line)', borderRadius: 7, fontFamily: 'JetBrains Mono, monospace', fontSize: 11, textDecoration: 'none', color: 'inherit', transition: 'border-color .15s' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--scarlet)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--line)')}
                  >
                    <span style={{ color: 'var(--fg-dim)', fontSize: 10, width: 18, textAlign: 'right' }}>{i + 1}</span>
                    {url && <img src={url} alt="" style={{ width: 14, height: 14 }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />}
                    <span style={{ flex: 1, color: 'var(--fg)' }}>{r.s.name}</span>
                    <span style={{ color: 'var(--scarlet)', fontSize: 10, background: 'rgba(239,68,68,.1)', padding: '2px 6px', borderRadius: 4 }}>{r.count} deps</span>
                  </a>
                )
              })}
            </div>
          </div>

        </aside>
      </div>
    </div>
    </>
  )
}
