'use client'
import { useState, useRef, useEffect, useCallback } from 'react'

// ── Paleta padrão ─────────────────────────────────────────────────────────────

const BG_DEFAULT     = '#0f172a'
const CARD_DEFAULT   = '#1e293b'
const LINE_DEFAULT   = '#334155'
const FG_DEFAULT     = '#e2e8f0'
const FGMUTE_DEFAULT = '#94a3b8'
const MONO           = "'JetBrains Mono', monospace"

// ── Types ─────────────────────────────────────────────────────────────────────

export type FlowNode = {
  id: string
  label: string
  sublabel?: string
  icon?: string
  color?: string
  shape?: 'rect' | 'circle' | 'diamond' | 'cylinder'
  tooltip?: string
}

export type FlowEdge = {
  from: string
  to: string
  label?: string
  style?: 'solid' | 'dashed' | 'dotted'
  color?: string
}

export type FlowGroup = {
  id: string
  label: string
  nodeIds: string[]
  color?: string
}

interface FlowDiagramProps {
  nodes: FlowNode[]
  edges: FlowEdge[]
  groups?: FlowGroup[]
  accentColor?: string
  bgColor?: string
  cardColor?: string
  lineColor?: string
  title?: string
  description?: string
  layout?: 'LR' | 'TB'
}

// ── Constantes de layout ───────────────────────────────────────────────────────

const NODE_W  = 130
const NODE_H  = 60
const GAP_X   = 80
const GAP_Y   = 70
const PAD     = 60

// ── Helpers ───────────────────────────────────────────────────────────────────

function computePositions(
  nodes: FlowNode[],
  edges: FlowEdge[],
  layout: 'LR' | 'TB',
): Map<string, { x: number; y: number; col: number; row: number }> {
  // Topological sort para estimar colunas/linhas
  const inDeg = new Map<string, number>()
  const adj   = new Map<string, string[]>()
  for (const n of nodes) { inDeg.set(n.id, 0); adj.set(n.id, []) }
  for (const e of edges) {
    adj.get(e.from)?.push(e.to)
    inDeg.set(e.to, (inDeg.get(e.to) ?? 0) + 1)
  }

  const colOf = new Map<string, number>()
  const queue = nodes.filter(n => (inDeg.get(n.id) ?? 0) === 0).map(n => n.id)
  let col = 0
  const visited = new Set<string>()
  while (queue.length > 0) {
    const next: string[] = []
    for (const id of queue) {
      if (visited.has(id)) continue
      visited.add(id)
      colOf.set(id, col)
      for (const nb of (adj.get(id) ?? [])) next.push(nb)
    }
    queue.length = 0
    queue.push(...next)
    col++
  }
  // nodes sem posição definida
  for (const n of nodes) if (!colOf.has(n.id)) colOf.set(n.id, col++)

  // Agrupa nós por coluna
  const byCol = new Map<number, string[]>()
  for (const [id, c] of colOf) {
    if (!byCol.has(c)) byCol.set(c, [])
    byCol.get(c)!.push(id)
  }

  const pos = new Map<string, { x: number; y: number; col: number; row: number }>()
  for (const [c, ids] of byCol) {
    ids.forEach((id, row) => {
      if (layout === 'LR') {
        pos.set(id, {
          x: PAD + c * (NODE_W + GAP_X),
          y: PAD + row * (NODE_H + GAP_Y),
          col: c, row,
        })
      } else {
        pos.set(id, {
          x: PAD + row * (NODE_W + GAP_X),
          y: PAD + c * (NODE_H + GAP_Y),
          col: c, row,
        })
      }
    })
  }
  return pos
}

function nodeCenter(p: { x: number; y: number }) {
  return { cx: p.x + NODE_W / 2, cy: p.y + NODE_H / 2 }
}

function edgePath(
  from: { x: number; y: number },
  to:   { x: number; y: number },
  layout: 'LR' | 'TB',
): string {
  const { cx: x1, cy: y1 } = nodeCenter(from)
  const { cx: x2, cy: y2 } = nodeCenter(to)
  if (layout === 'LR') {
    const mx = (x1 + x2) / 2
    return `M${x1 + NODE_W / 2},${y1} C${mx},${y1} ${mx},${y2} ${x2 - NODE_W / 2},${y2}`
  } else {
    const my = (y1 + y2) / 2
    return `M${x1},${y1 + NODE_H / 2} C${x1},${my} ${x2},${my} ${x2},${y2 - NODE_H / 2}`
  }
}

type Tooltip = { x: number; y: number; text: string } | null

// ── Componente ────────────────────────────────────────────────────────────────

export function FlowDiagram({
  nodes,
  edges,
  groups,
  accentColor = '#ef4444',
  bgColor     = BG_DEFAULT,
  cardColor   = CARD_DEFAULT,
  lineColor   = LINE_DEFAULT,
  title,
  description,
  layout      = 'LR',
}: FlowDiagramProps) {
  const svgRef   = useRef<SVGSVGElement>(null)
  const gRef     = useRef<SVGGElement>(null)
  const panRef   = useRef({ x: 0, y: 0 })
  const zoomRef  = useRef(1)
  const dragging = useRef(false)
  const lastPt   = useRef({ x: 0, y: 0 })

  const [tooltip, setTooltip] = useState<Tooltip>(null)

  const pos = computePositions(nodes, edges, layout)

  const maxX = Math.max(...Array.from(pos.values()).map(p => p.x)) + NODE_W + PAD
  const maxY = Math.max(...Array.from(pos.values()).map(p => p.y)) + NODE_H + PAD
  const svgW = Math.max(maxX, 400)
  const svgH = Math.max(maxY, 260)

  const applyTransform = useCallback(() => {
    gRef.current?.setAttribute(
      'transform',
      `translate(${panRef.current.x},${panRef.current.y}) scale(${zoomRef.current})`,
    )
  }, [])

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const factor = e.deltaY < 0 ? 1.1 : 0.9
      zoomRef.current = Math.min(3, Math.max(0.3, zoomRef.current * factor))
      applyTransform()
    }
    const onMouseDown = (e: MouseEvent) => {
      if ((e.target as Element).closest('[data-node]')) return
      dragging.current = true
      lastPt.current = { x: e.clientX, y: e.clientY }
      svg.style.cursor = 'grabbing'
    }
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return
      panRef.current.x += e.clientX - lastPt.current.x
      panRef.current.y += e.clientY - lastPt.current.y
      lastPt.current = { x: e.clientX, y: e.clientY }
      applyTransform()
    }
    const onMouseUp = () => { dragging.current = false; svg.style.cursor = 'grab' }

    svg.addEventListener('wheel', onWheel, { passive: false })
    svg.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    svg.style.cursor = 'grab'

    return () => {
      svg.removeEventListener('wheel', onWheel)
      svg.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [applyTransform])

  function renderNodeShape(n: FlowNode, p: { x: number; y: number }) {
    const color = n.color ?? accentColor
    const shape = n.shape ?? 'rect'
    const cx = p.x + NODE_W / 2
    const cy = p.y + NODE_H / 2

    if (shape === 'circle') {
      const r = Math.min(NODE_W, NODE_H) / 2
      return (
        <ellipse
          cx={cx} cy={cy} rx={r} ry={r}
          fill={`${color}20`} stroke={color} strokeWidth={1.5}
        />
      )
    }
    if (shape === 'diamond') {
      const pts = `${cx},${p.y} ${p.x + NODE_W},${cy} ${cx},${p.y + NODE_H} ${p.x},${cy}`
      return <polygon points={pts} fill={`${color}20`} stroke={color} strokeWidth={1.5} />
    }
    if (shape === 'cylinder') {
      const rx = NODE_W / 2, ry = 10
      return (
        <g>
          <rect x={p.x} y={p.y + ry} width={NODE_W} height={NODE_H - ry}
            fill={`${color}20`} stroke={color} strokeWidth={1.5} />
          <ellipse cx={cx} cy={p.y + ry} rx={rx} ry={ry}
            fill={`${color}30`} stroke={color} strokeWidth={1.5} />
          <ellipse cx={cx} cy={p.y + NODE_H} rx={rx} ry={ry}
            fill={`${color}20`} stroke={color} strokeWidth={1.5} />
        </g>
      )
    }
    // rect (default)
    return (
      <rect x={p.x} y={p.y} width={NODE_W} height={NODE_H} rx={8}
        fill={`${color}20`} stroke={color} strokeWidth={1.5} />
    )
  }

  function dashArray(style?: 'solid' | 'dashed' | 'dotted') {
    if (style === 'dashed') return '6 3'
    if (style === 'dotted') return '2 3'
    return undefined
  }

  return (
    <div style={{ fontFamily: MONO }}>
      {(title || description) && (
        <div style={{ marginBottom: 16 }}>
          {title && (
            <h3 style={{ color: FG_DEFAULT, fontSize: 18, fontWeight: 800, margin: '0 0 6px' }}>
              {title}
            </h3>
          )}
          {description && (
            <p style={{ color: FGMUTE_DEFAULT, fontSize: 12, margin: 0 }}>{description}</p>
          )}
        </div>
      )}

      <div style={{
        background: bgColor,
        border: `1px solid ${lineColor}`,
        borderRadius: 14,
        overflow: 'hidden',
        position: 'relative',
      }}>
        <svg
          ref={svgRef}
          width="100%"
          viewBox={`0 0 ${svgW} ${svgH}`}
          style={{ display: 'block', minHeight: 260 }}
        >
          <defs>
            <marker id="fd-arrow" markerWidth="8" markerHeight="8"
              refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill={lineColor} />
            </marker>
            {nodes.map(n => (
              <marker key={`arr-${n.id}`}
                id={`fd-arrow-${n.id}`} markerWidth="8" markerHeight="8"
                refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill={n.color ?? accentColor} />
              </marker>
            ))}
          </defs>

          <g ref={gRef}>
            {/* Grupos */}
            {groups?.map(g => {
              const gNodes = g.nodeIds.map(id => pos.get(id)).filter(Boolean) as { x: number; y: number }[]
              if (gNodes.length === 0) return null
              const minX = Math.min(...gNodes.map(p => p.x)) - 12
              const minY = Math.min(...gNodes.map(p => p.y)) - 24
              const maxGX = Math.max(...gNodes.map(p => p.x)) + NODE_W + 12
              const maxGY = Math.max(...gNodes.map(p => p.y)) + NODE_H + 12
              const gc = g.color ?? accentColor
              return (
                <g key={g.id}>
                  <rect x={minX} y={minY} width={maxGX - minX} height={maxGY - minY}
                    rx={12} fill={`${gc}08`} stroke={`${gc}40`} strokeWidth={1}
                    strokeDasharray="6 3" />
                  <text x={minX + 10} y={minY + 16} fill={gc}
                    fontSize={10} fontWeight={700} fontFamily={MONO}>
                    {g.label}
                  </text>
                </g>
              )
            })}

            {/* Arestas */}
            {edges.map((e, i) => {
              const fp = pos.get(e.from)
              const tp = pos.get(e.to)
              if (!fp || !tp) return null
              const color = e.color ?? lineColor
              const d = edgePath(fp, tp, layout)
              const edgeNode = nodes.find(n => n.id === e.to)
              const arrowId = edgeNode?.color
                ? `fd-arrow-${e.to}`
                : 'fd-arrow'
              return (
                <g key={i}>
                  <path d={d} fill="none" stroke={color} strokeWidth={1.5}
                    strokeDasharray={dashArray(e.style)}
                    markerEnd={`url(#${arrowId})`} />
                  {e.label && (() => {
                    const { cx: x1, cy: y1 } = nodeCenter(fp)
                    const { cx: x2, cy: y2 } = nodeCenter(tp)
                    return (
                      <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 6}
                        fill={FGMUTE_DEFAULT} fontSize={9} textAnchor="middle"
                        fontFamily={MONO}>
                        {e.label}
                      </text>
                    )
                  })()}
                </g>
              )
            })}

            {/* Nós */}
            {nodes.map(n => {
              const p = pos.get(n.id)
              if (!p) return null
              const cx = p.x + NODE_W / 2
              const cy = p.y + NODE_H / 2
              return (
                <g key={n.id} data-node="1"
                  style={{ cursor: n.tooltip ? 'pointer' : 'default' }}
                  onMouseEnter={n.tooltip ? (ev) => setTooltip({ x: ev.clientX, y: ev.clientY, text: n.tooltip! }) : undefined}
                  onMouseMove={n.tooltip ? (ev) => setTooltip(t => t ? { ...t, x: ev.clientX, y: ev.clientY } : null) : undefined}
                  onMouseLeave={n.tooltip ? () => setTooltip(null) : undefined}
                >
                  {renderNodeShape(n, p)}
                  {n.icon && (
                    <text x={p.x + 14} y={cy + 5} fontSize={16} textAnchor="middle"
                      dominantBaseline="middle" fontFamily={MONO}>
                      {n.icon}
                    </text>
                  )}
                  <text x={cx} y={n.sublabel ? cy - 7 : cy + 1}
                    fill={FG_DEFAULT} fontSize={11} fontWeight={700}
                    textAnchor="middle" dominantBaseline="middle" fontFamily={MONO}>
                    {n.label}
                  </text>
                  {n.sublabel && (
                    <text x={cx} y={cy + 11}
                      fill={FGMUTE_DEFAULT} fontSize={9}
                      textAnchor="middle" dominantBaseline="middle" fontFamily={MONO}>
                      {n.sublabel}
                    </text>
                  )}
                </g>
              )
            })}
          </g>
        </svg>
      </div>

      {tooltip && (
        <div style={{
          position: 'fixed',
          left: tooltip.x + 14,
          top: tooltip.y - 10,
          background: CARD_DEFAULT,
          border: `1px solid ${lineColor}`,
          borderRadius: 8,
          padding: '8px 12px',
          fontSize: 11,
          color: FG_DEFAULT,
          fontFamily: MONO,
          maxWidth: 240,
          zIndex: 9999,
          pointerEvents: 'none',
          boxShadow: '0 8px 24px #00000060',
          lineHeight: 1.6,
        }}>
          {tooltip.text}
        </div>
      )}
    </div>
  )
}
