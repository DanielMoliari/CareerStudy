'use client'
import { useState } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────────

export type NetworkNode = {
  id: string
  label: string
  type: 'load-balancer' | 'server' | 'database' | 'cache' | 'cdn' | 'firewall' | 'client' | 'gateway' | 'pod' | 'node'
  ip?: string
  port?: string
  description?: string
  status?: 'healthy' | 'degraded' | 'down'
  specs?: string[]
  x: number
  y: number
}

export type NetworkLink = {
  from: string
  to: string
  protocol?: string
  bandwidth?: string
  encrypted?: boolean
  description?: string
}

export type NetworkZone = {
  label: string
  nodeIds: string[]
  color?: string
  description?: string
}

interface NetworkTopologyProps {
  nodes: NetworkNode[]
  links: NetworkLink[]
  zones?: NetworkZone[]
  accentColor?: string
  bgColor?: string
  cardColor?: string
  title?: string
  description?: string
}

// ── Palette ──────────────────────────────────────────────────────────────────────

const BG_DEFAULT     = '#0f172a'
const CARD_DEFAULT   = '#1e293b'
const LINE_DEFAULT   = '#334155'
const FG_DEFAULT     = '#e2e8f0'
const FGMUTE_DEFAULT = '#94a3b8'
const MONO           = "'JetBrains Mono', monospace"

const STATUS_COLOR: Record<NonNullable<NetworkNode['status']>, string> = {
  healthy:  '#22c55e',
  degraded: '#f59e0b',
  down:     '#ef4444',
}

const TYPE_ICON: Record<NetworkNode['type'], string> = {
  'load-balancer': '⚖️',
  server:          '🖥️',
  database:        '🗄️',
  cache:           '⚡',
  cdn:             '🌐',
  firewall:        '🛡️',
  client:          '💻',
  gateway:         '🚪',
  pod:             '📦',
  node:            '⬡',
}

// ── Component ────────────────────────────────────────────────────────────────────

export function NetworkTopology({
  nodes,
  links,
  zones = [],
  accentColor = '#ef4444',
  bgColor = BG_DEFAULT,
  cardColor = CARD_DEFAULT,
  title,
  description,
}: NetworkTopologyProps) {
  const [hoveredNode, setHoveredNode] = useState<NetworkNode | null>(null)
  const [hoveredLink, setHoveredLink] = useState<NetworkLink | null>(null)
  const [tooltip, setTooltip] = useState<{ px: number; py: number } | null>(null)
  const [linkTooltip, setLinkTooltip] = useState<{ link: NetworkLink; px: number; py: number } | null>(null)

  const CELL = 100
  const W = 640
  const H = 420
  const OFFSET_X = 60
  const OFFSET_Y = 60

  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]))
  const nodePos = (n: NetworkNode) => ({
    x: OFFSET_X + n.x * CELL,
    y: OFFSET_Y + n.y * CELL,
  })

  // compute bounding box for each zone
  const zoneBounds = (zone: NetworkZone) => {
    const zNodes = zone.nodeIds.map(id => nodeMap[id]).filter(Boolean)
    if (zNodes.length === 0) return null
    const xs = zNodes.map(n => nodePos(n).x)
    const ys = zNodes.map(n => nodePos(n).y)
    const pad = 34
    return {
      x: Math.min(...xs) - pad,
      y: Math.min(...ys) - pad,
      w: Math.max(...xs) - Math.min(...xs) + pad * 2 + 20,
      h: Math.max(...ys) - Math.min(...ys) + pad * 2 + 20,
    }
  }

  return (
    <div style={{ fontFamily: MONO }}>
      {(title || description) && (
        <div style={{ marginBottom: 16 }}>
          {title && <h3 style={{ color: FG_DEFAULT, fontSize: 20, fontWeight: 800, margin: '0 0 6px' }}>{title}</h3>}
          {description && <p style={{ color: FGMUTE_DEFAULT, fontSize: 12, margin: 0 }}>{description}</p>}
        </div>
      )}

      <div style={{ position: 'relative', background: bgColor, borderRadius: 14, border: `1px solid ${LINE_DEFAULT}`, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <svg width={W} height={H} style={{ display: 'block' }}>
            {/* zones */}
            {zones.map((zone, i) => {
              const bounds = zoneBounds(zone)
              if (!bounds) return null
              const col = zone.color ?? accentColor
              return (
                <g key={i}>
                  <rect
                    x={bounds.x} y={bounds.y} width={bounds.w} height={bounds.h}
                    rx={12} fill={col + '10'} stroke={col + '40'} strokeWidth={1.5} strokeDasharray="6 3"
                  />
                  <text x={bounds.x + 10} y={bounds.y + 16} fontSize={9} fontWeight={700} fill={col} fontFamily={MONO}>
                    {zone.label}
                  </text>
                </g>
              )
            })}

            {/* links */}
            {links.map((link, i) => {
              const from = nodeMap[link.from]
              const to = nodeMap[link.to]
              if (!from || !to) return null
              const p1 = nodePos(from)
              const p2 = nodePos(to)
              const isHovered = hoveredLink === link
              return (
                <g key={i}>
                  <line
                    x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                    stroke={isHovered ? accentColor : LINE_DEFAULT}
                    strokeWidth={isHovered ? 2.5 : 1.5}
                    strokeDasharray={link.encrypted ? 'none' : '5 3'}
                  />
                  {/* invisible wider hit area */}
                  <line
                    x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                    stroke="transparent" strokeWidth={14}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={e => {
                      setHoveredLink(link)
                      setLinkTooltip({ link, px: e.nativeEvent.offsetX, py: e.nativeEvent.offsetY })
                    }}
                    onMouseLeave={() => { setHoveredLink(null); setLinkTooltip(null) }}
                  />
                  {link.protocol && (
                    <text
                      x={(p1.x + p2.x) / 2}
                      y={(p1.y + p2.y) / 2 - 6}
                      textAnchor="middle"
                      fontSize={8}
                      fill={isHovered ? FG_DEFAULT : FGMUTE_DEFAULT}
                      fontFamily={MONO}
                    >
                      {link.protocol}{link.encrypted ? ' 🔒' : ''}
                    </text>
                  )}
                </g>
              )
            })}

            {/* nodes */}
            {nodes.map(n => {
              const { x, y } = nodePos(n)
              const statusCol = n.status ? STATUS_COLOR[n.status] : '#22c55e'
              const isHovered = hoveredNode?.id === n.id
              return (
                <g
                  key={n.id}
                  transform={`translate(${x}, ${y})`}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={e => {
                    setHoveredNode(n)
                    setTooltip({ px: e.nativeEvent.offsetX + x, py: e.nativeEvent.offsetY + y })
                  }}
                  onMouseLeave={() => { setHoveredNode(null); setTooltip(null) }}
                >
                  <rect
                    x={-28} y={-22} width={56} height={44}
                    rx={8} fill={cardColor}
                    stroke={isHovered ? accentColor : LINE_DEFAULT}
                    strokeWidth={isHovered ? 2 : 1}
                  />
                  <text textAnchor="middle" y={-5} fontSize={18} dominantBaseline="middle">{TYPE_ICON[n.type]}</text>
                  <text textAnchor="middle" y={12} fontSize={8} fontWeight={700} fill={FG_DEFAULT} fontFamily={MONO}>{n.label}</text>
                  {/* status dot */}
                  <circle cx={22} cy={-16} r={5} fill={statusCol} />
                </g>
              )
            })}
          </svg>
        </div>

        {/* node tooltip */}
        {hoveredNode && tooltip && (
          <div style={{
            position: 'absolute', left: Math.min(tooltip.px + 10, W - 230), top: Math.max(tooltip.py - 60, 10),
            background: CARD_DEFAULT, border: `1px solid ${LINE_DEFAULT}`, borderRadius: 8,
            padding: '10px 14px', maxWidth: 220, pointerEvents: 'none', zIndex: 10,
          }}>
            <div style={{ color: FG_DEFAULT, fontSize: 12, fontWeight: 700, marginBottom: 4 }}>{TYPE_ICON[hoveredNode.type]} {hoveredNode.label}</div>
            {hoveredNode.ip && <div style={{ color: FGMUTE_DEFAULT, fontSize: 10, marginBottom: 2 }}>IP: {hoveredNode.ip}{hoveredNode.port ? `:${hoveredNode.port}` : ''}</div>}
            {hoveredNode.description && <div style={{ color: FG_DEFAULT, fontSize: 11, lineHeight: 1.4, marginBottom: 6 }}>{hoveredNode.description}</div>}
            {hoveredNode.specs && hoveredNode.specs.map(s => (
              <div key={s} style={{ color: FGMUTE_DEFAULT, fontSize: 10 }}>· {s}</div>
            ))}
          </div>
        )}

        {/* link tooltip */}
        {linkTooltip && (
          <div style={{
            position: 'absolute', left: linkTooltip.px + 10, top: linkTooltip.py - 40,
            background: CARD_DEFAULT, border: `1px solid ${LINE_DEFAULT}`, borderRadius: 8,
            padding: '8px 12px', maxWidth: 200, pointerEvents: 'none', zIndex: 10,
          }}>
            {linkTooltip.link.protocol && <div style={{ color: accentColor, fontSize: 11, fontWeight: 700, marginBottom: 2 }}>{linkTooltip.link.protocol}</div>}
            {linkTooltip.link.bandwidth && <div style={{ color: FGMUTE_DEFAULT, fontSize: 10 }}>Banda: {linkTooltip.link.bandwidth}</div>}
            <div style={{ color: FGMUTE_DEFAULT, fontSize: 10 }}>{linkTooltip.link.encrypted ? '🔒 Criptografado' : '⚠ Não criptografado'}</div>
            {linkTooltip.link.description && <div style={{ color: FG_DEFAULT, fontSize: 11, marginTop: 4 }}>{linkTooltip.link.description}</div>}
          </div>
        )}
      </div>
    </div>
  )
}
