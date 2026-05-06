'use client'
import { useState, useRef, useEffect, useCallback } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────────

export type WebNode = {
  id: string
  label: string
  description?: string
  color?: string
  size?: 'sm' | 'md' | 'lg'
  category?: string
}

export type WebEdge = {
  from: string
  to: string
  relation: string
  bidirectional?: boolean
  color?: string
  strength?: 'weak' | 'normal' | 'strong'
}

interface ConceptWebProps {
  nodes: WebNode[]
  edges: WebEdge[]
  accentColor?: string
  bgColor?: string
  title?: string
  description?: string
  filterByCategory?: boolean
}

// ── Palette ──────────────────────────────────────────────────────────────────────

const BG_DEFAULT     = '#0f172a'
const CARD_DEFAULT   = '#1e293b'
const LINE_DEFAULT   = '#334155'
const FG_DEFAULT     = '#e2e8f0'
const FGMUTE_DEFAULT = '#94a3b8'
const MONO           = "'JetBrains Mono', monospace"

// ── Helpers ───────────────────────────────────────────────────────────────────────

function initialPositions(nodes: WebNode[], W: number, H: number) {
  const cols = Math.ceil(Math.sqrt(nodes.length))
  return Object.fromEntries(
    nodes.map((n, i) => {
      const col = i % cols
      const row = Math.floor(i / cols)
      const gapX = W / (cols + 1)
      const gapY = H / (Math.ceil(nodes.length / cols) + 1)
      return [n.id, { x: gapX * (col + 1), y: gapY * (row + 1) }]
    }),
  )
}

function nodeRadius(size?: WebNode['size']) {
  if (size === 'lg') return 36
  if (size === 'sm') return 20
  return 28
}

// ── Component ────────────────────────────────────────────────────────────────────

export function ConceptWeb({
  nodes,
  edges,
  accentColor = '#ef4444',
  bgColor = BG_DEFAULT,
  title,
  description,
  filterByCategory = true,
}: ConceptWebProps) {
  const W = 640
  const H = 480

  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>(() =>
    initialPositions(nodes, W, H),
  )
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<{ node: WebNode; px: number; py: number } | null>(null)

  const draggingNode = useRef<string | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const categories = filterByCategory
    ? Array.from(new Set(nodes.map(n => n.category).filter(Boolean))) as string[]
    : []

  const visibleNodes = activeCategory
    ? nodes.filter(n => n.category === activeCategory)
    : nodes

  const visibleIds = new Set(visibleNodes.map(n => n.id))

  const visibleEdges = edges.filter(e => visibleIds.has(e.from) && visibleIds.has(e.to))

  const connectedTo = (id: string) =>
    new Set(
      visibleEdges.flatMap(e => {
        if (e.from === id) return [e.to]
        if (e.to === id) return [e.from]
        return []
      }),
    )

  const onMouseDown = useCallback((e: React.MouseEvent, id: string) => {
    e.preventDefault()
    draggingNode.current = id

    const onMove = (ev: MouseEvent) => {
      if (!draggingNode.current || !svgRef.current) return
      const rect = svgRef.current.getBoundingClientRect()
      const scaleX = W / rect.width
      const scaleY = H / rect.height
      setPositions(prev => ({
        ...prev,
        [draggingNode.current!]: {
          x: Math.max(40, Math.min(W - 40, (ev.clientX - rect.left) * scaleX)),
          y: Math.max(40, Math.min(H - 40, (ev.clientY - rect.top) * scaleY)),
        },
      }))
    }
    const onUp = () => { draggingNode.current = null; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [W, H])

  const edgeStroke = (e: WebEdge) => {
    if (e.strength === 'weak') return '1'
    if (e.strength === 'strong') return '3'
    return '2'
  }

  const edgeDash = (e: WebEdge) => {
    if (e.strength === 'weak') return '4 4'
    return 'none'
  }

  const colorFor = (n: WebNode) => n.color ?? accentColor

  return (
    <div style={{ fontFamily: MONO }}>
      {(title || description) && (
        <div style={{ marginBottom: 16 }}>
          {title && <h3 style={{ color: FG_DEFAULT, fontSize: 20, fontWeight: 800, margin: '0 0 6px' }}>{title}</h3>}
          {description && <p style={{ color: FGMUTE_DEFAULT, fontSize: 12, margin: 0 }}>{description}</p>}
        </div>
      )}

      {filterByCategory && categories.length > 1 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          <button
            onClick={() => setActiveCategory(null)}
            style={{
              padding: '4px 12px', borderRadius: 20, border: `1px solid ${LINE_DEFAULT}`,
              background: activeCategory === null ? accentColor : 'transparent',
              color: activeCategory === null ? '#fff' : FGMUTE_DEFAULT,
              fontSize: 11, cursor: 'pointer', fontFamily: MONO,
            }}
          >
            Todas
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
              style={{
                padding: '4px 12px', borderRadius: 20, border: `1px solid ${LINE_DEFAULT}`,
                background: activeCategory === cat ? accentColor : 'transparent',
                color: activeCategory === cat ? '#fff' : FGMUTE_DEFAULT,
                fontSize: 11, cursor: 'pointer', fontFamily: MONO,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div style={{ position: 'relative', background: bgColor, borderRadius: 14, border: `1px solid ${LINE_DEFAULT}`, overflow: 'hidden' }}>
        <svg
          ref={svgRef}
          width="100%"
          viewBox={`0 0 ${W} ${H}`}
          style={{ display: 'block', userSelect: 'none' }}
        >
          <defs>
            <marker id="cw-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill={FGMUTE_DEFAULT} />
            </marker>
          </defs>

          {/* edges */}
          {visibleEdges.map((e, i) => {
            const from = positions[e.from]
            const to = positions[e.to]
            if (!from || !to) return null
            const mx = (from.x + to.x) / 2
            const my = (from.y + to.y) / 2 - 20
            const isHighlighted = hoveredId && (e.from === hoveredId || e.to === hoveredId)
            const edgeCol = e.color ?? (isHighlighted ? accentColor : LINE_DEFAULT)
            return (
              <g key={i}>
                <path
                  d={`M${from.x},${from.y} Q${mx},${my} ${to.x},${to.y}`}
                  fill="none"
                  stroke={edgeCol}
                  strokeWidth={edgeStroke(e)}
                  strokeDasharray={edgeDash(e)}
                  markerEnd="url(#cw-arrow)"
                  opacity={hoveredId && !isHighlighted ? 0.2 : 1}
                />
                <text
                  x={mx}
                  y={my - 6}
                  textAnchor="middle"
                  fontSize={9}
                  fill={isHighlighted ? FG_DEFAULT : FGMUTE_DEFAULT}
                  opacity={hoveredId && !isHighlighted ? 0.2 : 1}
                >
                  {e.relation}
                </text>
              </g>
            )
          })}

          {/* nodes */}
          {visibleNodes.map(n => {
            const pos = positions[n.id]
            if (!pos) return null
            const r = nodeRadius(n.size)
            const col = colorFor(n)
            const connected = hoveredId ? connectedTo(hoveredId) : null
            const dimmed = hoveredId && hoveredId !== n.id && !connected?.has(n.id)
            return (
              <g
                key={n.id}
                transform={`translate(${pos.x},${pos.y})`}
                style={{ cursor: 'grab' }}
                onMouseDown={ev => onMouseDown(ev, n.id)}
                onMouseEnter={e => {
                  setHoveredId(n.id)
                  if (n.description) {
                    const rect = svgRef.current!.getBoundingClientRect()
                    setTooltip({ node: n, px: e.clientX - rect.left, py: e.clientY - rect.top })
                  }
                }}
                onMouseLeave={() => { setHoveredId(null); setTooltip(null) }}
              >
                <circle r={r} fill={CARD_DEFAULT} stroke={col} strokeWidth={2} opacity={dimmed ? 0.25 : 1} />
                <circle r={r} fill={col + '20'} stroke="none" opacity={dimmed ? 0.25 : 1} />
                <foreignObject x={-r + 2} y={-r + 2} width={(r - 2) * 2} height={(r - 2) * 2} style={{ opacity: dimmed ? 0.25 : 1 }}>
                  <div style={{
                    width: '100%', height: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    textAlign: 'center', fontSize: 9, fontWeight: 700,
                    color: FG_DEFAULT, lineHeight: 1.2, padding: 2,
                    wordBreak: 'break-word', fontFamily: MONO,
                  }}>
                    {n.label}
                  </div>
                </foreignObject>
              </g>
            )
          })}
        </svg>

        {tooltip && (
          <div style={{
            position: 'absolute', left: tooltip.px + 12, top: tooltip.py - 8,
            background: CARD_DEFAULT, border: `1px solid ${LINE_DEFAULT}`,
            borderRadius: 8, padding: '8px 12px', maxWidth: 220, pointerEvents: 'none', zIndex: 10,
          }}>
            <div style={{ color: colorFor(tooltip.node), fontSize: 11, fontWeight: 700, marginBottom: 4 }}>{tooltip.node.label}</div>
            {tooltip.node.category && <div style={{ color: accentColor, fontSize: 9, marginBottom: 4 }}>{tooltip.node.category}</div>}
            <div style={{ color: FGMUTE_DEFAULT, fontSize: 11, lineHeight: 1.5 }}>{tooltip.node.description}</div>
          </div>
        )}

        <div style={{ position: 'absolute', bottom: 8, right: 12, color: FGMUTE_DEFAULT, fontSize: 10 }}>
          arraste nós para reposicionar
        </div>
      </div>
    </div>
  )
}
