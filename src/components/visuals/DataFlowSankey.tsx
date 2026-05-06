'use client'
import { useState, useMemo } from 'react'

// ── Paleta padrão ────────────────────────────────────────────────────────────

const BG_DEFAULT     = '#0f172a'
const CARD_DEFAULT   = '#1e293b'
const LINE_DEFAULT   = '#334155'
const FG_DEFAULT     = '#e2e8f0'
const FGMUTE_DEFAULT = '#94a3b8'
const MONO           = "'JetBrains Mono', monospace"

const TYPE_COLOR: Record<string, string> = {
  source:    '#3b82f6',
  transform: '#a855f7',
  sink:      '#22c55e',
  store:     '#f59e0b',
}

const TYPE_LABEL: Record<string, string> = {
  source:    'Fonte',
  transform: 'Transformação',
  sink:      'Destino',
  store:     'Armazenamento',
}

// ── Tipos ────────────────────────────────────────────────────────────────────

export type SankeyNode = {
  id: string
  label: string
  sublabel?: string
  color?: string
  description?: string
  type?: 'source' | 'transform' | 'sink' | 'store'
}

export type SankeyFlow = {
  from: string
  to: string
  value: number
  label?: string
  color?: string
  description?: string
}

interface DataFlowSankeyProps {
  nodes: SankeyNode[]
  flows: SankeyFlow[]
  accentColor?: string
  bgColor?: string
  cardColor?: string
  title?: string
  description?: string
}

// ── Layout ───────────────────────────────────────────────────────────────────

type LayoutNode = SankeyNode & {
  col: number
  row: number
  x: number
  y: number
  width: number
  height: number
}

function buildLayout(
  nodes: SankeyNode[],
  flows: SankeyFlow[],
  svgW: number,
  svgH: number,
): LayoutNode[] {
  // Determinar coluna de cada nó por tipo
  const typeOrder: Record<string, number> = {
    source:    0,
    transform: 1,
    store:     1,
    sink:      2,
  }

  // Fallback: inferir colunas por fluxo (topological layer)
  const layerMap: Record<string, number> = {}
  function getLayer(id: string): number {
    if (layerMap[id] !== undefined) return layerMap[id]
    const node = nodes.find(n => n.id === id)
    const typeLayer = node?.type ? typeOrder[node.type] ?? 0 : undefined
    if (typeLayer !== undefined) { layerMap[id] = typeLayer; return typeLayer }
    const incoming = flows.filter(f => f.to === id)
    if (incoming.length === 0) { layerMap[id] = 0; return 0 }
    const maxLayer = Math.max(...incoming.map(f => getLayer(f.from)))
    layerMap[id] = maxLayer + 1
    return maxLayer + 1
  }
  nodes.forEach(n => getLayer(n.id))

  const numCols = Math.max(...Object.values(layerMap)) + 1
  const cols: Record<number, string[]> = {}
  for (const [id, col] of Object.entries(layerMap)) {
    if (!cols[col]) cols[col] = []
    cols[col].push(id)
  }

  const PAD_X    = 40
  const PAD_Y    = 30
  const NODE_W   = 110
  const NODE_H   = 44
  const COL_W    = (svgW - PAD_X * 2) / numCols

  const layout: LayoutNode[] = []

  for (let col = 0; col < numCols; col++) {
    const colNodes = cols[col] ?? []
    const totalH   = colNodes.length * NODE_H + (colNodes.length - 1) * 20
    const startY   = PAD_Y + (svgH - PAD_Y * 2 - totalH) / 2

    colNodes.forEach((id, row) => {
      const node = nodes.find(n => n.id === id)!
      const x = PAD_X + col * COL_W + (COL_W - NODE_W) / 2
      const y = startY + row * (NODE_H + 20)
      layout.push({ ...node, col, row, x, y, width: NODE_W, height: NODE_H })
    })
  }

  return layout
}

// ── Componente ───────────────────────────────────────────────────────────────

export function DataFlowSankey({
  nodes,
  flows,
  accentColor = '#ef4444',
  bgColor = BG_DEFAULT,
  cardColor = CARD_DEFAULT,
  title,
  description,
}: DataFlowSankeyProps) {
  const [hoveredFlow, setHoveredFlow]   = useState<number | null>(null)
  const [hoveredNode, setHoveredNode]   = useState<string | null>(null)

  const SVG_W = 600
  const SVG_H = Math.max(260, nodes.length * 64 + 60)

  const layout = useMemo(
    () => buildLayout(nodes, flows, SVG_W, SVG_H),
    [nodes, flows, SVG_W, SVG_H],
  )

  const nodeMap = useMemo(() => {
    const m: Record<string, LayoutNode> = {}
    layout.forEach(n => { m[n.id] = n })
    return m
  }, [layout])

  // Escala de espessura
  const maxVal = Math.max(...flows.map(f => f.value), 1)
  function thickness(val: number) { return 3 + (val / maxVal) * 22 }

  // Verificar se um fluxo está relacionado ao nó hovered
  function flowRelated(fi: number): boolean {
    if (hoveredNode === null && hoveredFlow === null) return true
    if (hoveredFlow === fi) return true
    if (hoveredNode !== null) {
      const f = flows[fi]
      return f.from === hoveredNode || f.to === hoveredNode
    }
    return false
  }

  // Path bezier entre dois nós
  function bezierPath(from: LayoutNode, to: LayoutNode, fi: number): string {
    const x1 = from.x + from.width
    const y1 = from.y + from.height / 2
    const x2 = to.x
    const y2 = to.y + to.height / 2
    const cp = (x2 - x1) * 0.5
    return `M ${x1} ${y1} C ${x1 + cp} ${y1}, ${x2 - cp} ${y2}, ${x2} ${y2}`
  }

  return (
    <div style={{ fontFamily: MONO, color: FG_DEFAULT }}>
      {(title || description) && (
        <div style={{ marginBottom: 20 }}>
          {title && (
            <h3 style={{ fontSize: 18, fontWeight: 800, color: FG_DEFAULT, margin: '0 0 6px' }}>
              {title}
            </h3>
          )}
          {description && (
            <p style={{ fontSize: 12, color: FGMUTE_DEFAULT, margin: 0 }}>{description}</p>
          )}
        </div>
      )}

      {/* Legenda de tipos */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 14 }}>
        {(Object.keys(TYPE_LABEL) as Array<keyof typeof TYPE_LABEL>).map(t => (
          <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: TYPE_COLOR[t], flexShrink: 0 }} />
            <span style={{ fontSize: 10, color: FGMUTE_DEFAULT }}>{TYPE_LABEL[t]}</span>
          </div>
        ))}
      </div>

      {/* SVG principal */}
      <div style={{
        background: bgColor,
        border: `1px solid ${LINE_DEFAULT}`,
        borderRadius: 14,
        overflow: 'hidden',
        position: 'relative',
      }}>
        <svg
          width="100%"
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          style={{ display: 'block' }}
          onMouseLeave={() => { setHoveredFlow(null); setHoveredNode(null) }}
        >
          {/* Fluxos */}
          {flows.map((flow, fi) => {
            const from = nodeMap[flow.from]
            const to   = nodeMap[flow.to]
            if (!from || !to) return null
            const th      = thickness(flow.value)
            const related = flowRelated(fi)
            const color   = flow.color ?? accentColor
            return (
              <path
                key={fi}
                d={bezierPath(from, to, fi)}
                fill="none"
                stroke={color}
                strokeWidth={th}
                strokeOpacity={related ? (hoveredFlow === fi ? 0.9 : 0.45) : 0.08}
                style={{ cursor: 'pointer', transition: 'stroke-opacity .2s' }}
                onMouseEnter={() => { setHoveredFlow(fi); setHoveredNode(null) }}
                onMouseLeave={() => setHoveredFlow(null)}
              />
            )
          })}

          {/* Nós */}
          {layout.map(node => {
            const typeColor = node.type ? TYPE_COLOR[node.type] : node.color ?? accentColor
            const isHov = hoveredNode === node.id
            return (
              <g
                key={node.id}
                onMouseEnter={() => { setHoveredNode(node.id); setHoveredFlow(null) }}
                onMouseLeave={() => setHoveredNode(null)}
                style={{ cursor: 'default' }}
              >
                <rect
                  x={node.x}
                  y={node.y}
                  width={node.width}
                  height={node.height}
                  rx={8}
                  fill={cardColor}
                  stroke={isHov ? typeColor : `${typeColor}50`}
                  strokeWidth={isHov ? 2 : 1}
                  style={{ transition: 'stroke .2s' }}
                />
                {/* Barra de tipo */}
                <rect
                  x={node.x}
                  y={node.y}
                  width={4}
                  height={node.height}
                  rx={3}
                  fill={typeColor}
                />
                <text
                  x={node.x + 14}
                  y={node.y + (node.sublabel ? 16 : node.height / 2 + 5)}
                  fontSize={11}
                  fontWeight={800}
                  fill={FG_DEFAULT}
                  fontFamily={MONO}
                >
                  {node.label}
                </text>
                {node.sublabel && (
                  <text
                    x={node.x + 14}
                    y={node.y + 30}
                    fontSize={9}
                    fill={FGMUTE_DEFAULT}
                    fontFamily={MONO}
                  >
                    {node.sublabel}
                  </text>
                )}
              </g>
            )
          })}
        </svg>

        {/* Tooltip do fluxo hovered */}
        {hoveredFlow !== null && (() => {
          const flow = flows[hoveredFlow]
          if (!flow) return null
          return (
            <div style={{
              position: 'absolute',
              bottom: 12,
              left: '50%',
              transform: 'translateX(-50%)',
              background: cardColor,
              border: `1px solid ${flow.color ?? accentColor}50`,
              borderRadius: 10,
              padding: '8px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              maxWidth: 320,
              pointerEvents: 'none',
            }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: flow.color ?? accentColor }}>
                {flow.from} → {flow.to}
                {flow.label && <span style={{ color: FGMUTE_DEFAULT, fontWeight: 400, marginLeft: 6 }}>{flow.label}</span>}
              </div>
              <div style={{ fontSize: 10, color: FGMUTE_DEFAULT }}>Volume relativo: <strong style={{ color: FG_DEFAULT }}>{flow.value}</strong></div>
              {flow.description && (
                <div style={{ fontSize: 10, color: FGMUTE_DEFAULT, marginTop: 2 }}>{flow.description}</div>
              )}
            </div>
          )
        })()}

        {/* Tooltip do nó hovered */}
        {hoveredNode !== null && hoveredFlow === null && (() => {
          const node = nodeMap[hoveredNode]
          if (!node) return null
          const incoming = flows.filter(f => f.to === node.id)
          const outgoing = flows.filter(f => f.from === node.id)
          return (
            <div style={{
              position: 'absolute',
              bottom: 12,
              left: '50%',
              transform: 'translateX(-50%)',
              background: cardColor,
              border: `1px solid ${node.type ? TYPE_COLOR[node.type] : accentColor}50`,
              borderRadius: 10,
              padding: '8px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              maxWidth: 340,
              pointerEvents: 'none',
            }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: node.type ? TYPE_COLOR[node.type] : accentColor }}>
                {node.label}
                {node.type && (
                  <span style={{ fontSize: 9, color: FGMUTE_DEFAULT, fontWeight: 400, marginLeft: 8 }}>
                    {TYPE_LABEL[node.type]}
                  </span>
                )}
              </div>
              {node.description && (
                <div style={{ fontSize: 10, color: FGMUTE_DEFAULT }}>{node.description}</div>
              )}
              <div style={{ display: 'flex', gap: 12, marginTop: 2 }}>
                {incoming.length > 0 && (
                  <div>
                    <div style={{ fontSize: 9, color: FGMUTE_DEFAULT, fontWeight: 700, marginBottom: 2 }}>ENTRADA</div>
                    {incoming.map((f, i) => (
                      <div key={i} style={{ fontSize: 10, color: FG_DEFAULT }}>← {f.from}</div>
                    ))}
                  </div>
                )}
                {outgoing.length > 0 && (
                  <div>
                    <div style={{ fontSize: 9, color: FGMUTE_DEFAULT, fontWeight: 700, marginBottom: 2 }}>SAÍDA</div>
                    {outgoing.map((f, i) => (
                      <div key={i} style={{ fontSize: 10, color: FG_DEFAULT }}>→ {f.to}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}
