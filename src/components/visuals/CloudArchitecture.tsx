'use client'
import { useState } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────────

export type CloudService = {
  id: string
  label: string
  provider?: 'aws' | 'gcp' | 'azure' | 'generic'
  serviceType: string
  description?: string
  region?: string
  cost?: string
  x: number
  y: number
  color?: string
  icon?: string
}

export type CloudConnection = {
  from: string
  to: string
  label?: string
  style?: 'public' | 'private' | 'peering'
  port?: string
}

export type CloudRegion = {
  id: string
  label: string
  color?: string
  serviceIds: string[]
}

interface CloudArchitectureProps {
  services: CloudService[]
  connections: CloudConnection[]
  regions?: CloudRegion[]
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

const PROVIDER_COLOR: Record<string, string> = {
  aws:     '#f97316',
  gcp:     '#3b82f6',
  azure:   '#0ea5e9',
  generic: '#8b5cf6',
}

const CONN_DASH: Record<NonNullable<CloudConnection['style']>, string> = {
  public:  'none',
  private: '6 3',
  peering: '2 4',
}

// ── Component ────────────────────────────────────────────────────────────────────

export function CloudArchitecture({
  services,
  connections,
  regions = [],
  accentColor = '#ef4444',
  bgColor = BG_DEFAULT,
  cardColor = CARD_DEFAULT,
  title,
  description,
}: CloudArchitectureProps) {
  const [hovered, setHovered] = useState<CloudService | null>(null)
  const [tooltip, setTooltip] = useState<{ px: number; py: number } | null>(null)

  const CELL = 110
  const OFFSET_X = 50
  const OFFSET_Y = 50
  const W = 680
  const H = 440

  const svcMap = Object.fromEntries(services.map(s => [s.id, s]))
  const svcPos = (s: CloudService) => ({ x: OFFSET_X + s.x * CELL, y: OFFSET_Y + s.y * CELL })

  const regionBounds = (region: CloudRegion) => {
    const svcs = region.serviceIds.map(id => svcMap[id]).filter(Boolean)
    if (!svcs.length) return null
    const xs = svcs.map(s => svcPos(s).x)
    const ys = svcs.map(s => svcPos(s).y)
    const pad = 36
    return {
      x: Math.min(...xs) - pad,
      y: Math.min(...ys) - pad - 14,
      w: Math.max(...xs) - Math.min(...xs) + pad * 2 + 24,
      h: Math.max(...ys) - Math.min(...ys) + pad * 2 + 28,
    }
  }

  const connDash = (c: CloudConnection) => CONN_DASH[c.style ?? 'public']
  const connColor = (c: CloudConnection) => {
    if (c.style === 'private') return '#22c55e'
    if (c.style === 'peering') return '#8b5cf6'
    return LINE_DEFAULT
  }

  const svcColor = (s: CloudService) => s.color ?? PROVIDER_COLOR[s.provider ?? 'generic'] ?? accentColor

  return (
    <div style={{ fontFamily: MONO }}>
      {(title || description) && (
        <div style={{ marginBottom: 16 }}>
          {title && <h3 style={{ color: FG_DEFAULT, fontSize: 20, fontWeight: 800, margin: '0 0 6px' }}>{title}</h3>}
          {description && <p style={{ color: FGMUTE_DEFAULT, fontSize: 12, margin: 0 }}>{description}</p>}
        </div>
      )}

      {/* legend */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
        {[
          { label: 'Pública (sólido)', dash: 'none', col: LINE_DEFAULT },
          { label: 'Privada (tracejado)', dash: '6 3', col: '#22c55e' },
          { label: 'Peering (pontilhado)', dash: '2 4', col: '#8b5cf6' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width={28} height={6}>
              <line x1={0} y1={3} x2={28} y2={3} stroke={l.col} strokeWidth={1.5} strokeDasharray={l.dash} />
            </svg>
            <span style={{ color: FGMUTE_DEFAULT, fontSize: 10 }}>{l.label}</span>
          </div>
        ))}
      </div>

      <div style={{ position: 'relative', background: bgColor, borderRadius: 14, border: `1px solid ${LINE_DEFAULT}`, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <svg width={W} height={H} style={{ display: 'block' }}>
            {/* regions */}
            {regions.map(region => {
              const bounds = regionBounds(region)
              if (!bounds) return null
              const col = region.color ?? accentColor
              return (
                <g key={region.id}>
                  <rect
                    x={bounds.x} y={bounds.y} width={bounds.w} height={bounds.h}
                    rx={12} fill={col + '0d'} stroke={col + '50'} strokeWidth={1.5}
                  />
                  <text x={bounds.x + 10} y={bounds.y + 16} fontSize={9} fontWeight={700} fill={col} fontFamily={MONO}>
                    {region.label}
                  </text>
                </g>
              )
            })}

            {/* connections */}
            {connections.map((c, i) => {
              const from = svcMap[c.from]
              const to = svcMap[c.to]
              if (!from || !to) return null
              const p1 = svcPos(from)
              const p2 = svcPos(to)
              const mx = (p1.x + p2.x) / 2
              const my = (p1.y + p2.y) / 2
              return (
                <g key={i}>
                  <line
                    x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                    stroke={connColor(c)} strokeWidth={1.5} strokeDasharray={connDash(c)}
                  />
                  {(c.label || c.port) && (
                    <text x={mx} y={my - 6} textAnchor="middle" fontSize={8} fill={FGMUTE_DEFAULT} fontFamily={MONO}>
                      {[c.label, c.port].filter(Boolean).join(' · ')}
                    </text>
                  )}
                </g>
              )
            })}

            {/* services */}
            {services.map(s => {
              const { x, y } = svcPos(s)
              const col = svcColor(s)
              const isHovered = hovered?.id === s.id
              return (
                <g
                  key={s.id}
                  transform={`translate(${x},${y})`}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={e => {
                    setHovered(s)
                    setTooltip({ px: e.nativeEvent.offsetX + x, py: e.nativeEvent.offsetY + y })
                  }}
                  onMouseLeave={() => { setHovered(null); setTooltip(null) }}
                >
                  <rect x={-30} y={-26} width={60} height={52} rx={8} fill={cardColor} stroke={isHovered ? col : LINE_DEFAULT} strokeWidth={isHovered ? 2 : 1} />
                  <circle cx={0} cy={-10} r={13} fill={col + '25'} />
                  {s.icon
                    ? <text textAnchor="middle" y={-6} fontSize={14} dominantBaseline="middle">{s.icon}</text>
                    : <text textAnchor="middle" y={-6} fontSize={9} fontWeight={800} fill={col} dominantBaseline="middle" fontFamily={MONO}>{s.serviceType.slice(0, 4)}</text>
                  }
                  <text textAnchor="middle" y={16} fontSize={8} fontWeight={700} fill={FG_DEFAULT} fontFamily={MONO}>{s.label}</text>
                  {s.provider && s.provider !== 'generic' && (
                    <text textAnchor="middle" y={24} fontSize={7} fill={col} fontFamily={MONO}>{s.provider.toUpperCase()}</text>
                  )}
                </g>
              )
            })}
          </svg>
        </div>

        {/* tooltip */}
        {hovered && tooltip && (
          <div style={{
            position: 'absolute',
            left: Math.min(tooltip.px + 12, W - 240),
            top: Math.max(tooltip.py - 70, 10),
            background: cardColor, border: `1px solid ${svcColor(hovered)}60`,
            borderRadius: 8, padding: '10px 14px', maxWidth: 230, pointerEvents: 'none', zIndex: 10,
          }}>
            <div style={{ color: svcColor(hovered), fontSize: 11, fontWeight: 800, marginBottom: 2 }}>{hovered.serviceType}</div>
            <div style={{ color: FG_DEFAULT, fontSize: 12, fontWeight: 700, marginBottom: 6 }}>{hovered.label}</div>
            {hovered.description && <div style={{ color: FGMUTE_DEFAULT, fontSize: 11, lineHeight: 1.4, marginBottom: 6 }}>{hovered.description}</div>}
            {hovered.cost && <div style={{ color: '#22c55e', fontSize: 10 }}>💰 {hovered.cost}</div>}
            {hovered.region && <div style={{ color: FGMUTE_DEFAULT, fontSize: 10 }}>📍 {hovered.region}</div>}
          </div>
        )}
      </div>
    </div>
  )
}
