'use client'
import { useState } from 'react'

// ── Paleta padrão ─────────────────────────────────────────────────────────────

const BG_DEFAULT     = '#0f172a'
const CARD_DEFAULT   = '#1e293b'
const LINE_DEFAULT   = '#334155'
const FG_DEFAULT     = '#e2e8f0'
const FGMUTE_DEFAULT = '#94a3b8'
const MONO           = "'JetBrains Mono', monospace"

// ── Types ─────────────────────────────────────────────────────────────────────

export type ArchBlock = {
  id: string
  label: string
  sublabel?: string
  type: 'service' | 'database' | 'queue' | 'frontend' | 'external' | 'gateway'
  color?: string
  x: number
  y: number
  description?: string
  tech?: string[]
}

export type ArchConnection = {
  from: string
  to: string
  label?: string
  style?: 'sync' | 'async' | 'event'
  protocol?: string
}

export type ArchZone = {
  label: string
  blockIds: string[]
  color?: string
}

interface ArchitectureDiagramProps {
  blocks: ArchBlock[]
  connections: ArchConnection[]
  zones?: ArchZone[]
  accentColor?: string
  bgColor?: string
  cardColor?: string
  title?: string
  description?: string
  gridCols?: number
  gridRows?: number
}

// ── Constantes de grid ────────────────────────────────────────────────────────

const CELL_W = 140
const CELL_H = 80
const PAD_X  = 40
const PAD_Y  = 40
const BLOCK_W = 120
const BLOCK_H = 60

// ── Ícones por tipo ───────────────────────────────────────────────────────────

const TYPE_ICONS: Record<ArchBlock['type'], string> = {
  service:  '⚙️',
  database: '🗄️',
  queue:    '📨',
  frontend: '🖥️',
  external: '🌐',
  gateway:  '🔀',
}

const TYPE_DEFAULT_COLORS: Record<ArchBlock['type'], string> = {
  service:  '#3b82f6',
  database: '#10b981',
  queue:    '#f59e0b',
  frontend: '#8b5cf6',
  external: '#6b7280',
  gateway:  '#ef4444',
}

// ── Componente ────────────────────────────────────────────────────────────────

type TooltipData = {
  clientX: number
  clientY: number
  block: ArchBlock
} | null

export function ArchitectureDiagram({
  blocks,
  connections,
  zones,
  accentColor = '#ef4444',
  bgColor     = BG_DEFAULT,
  cardColor   = CARD_DEFAULT,
  title,
  description,
  gridCols,
  gridRows,
}: ArchitectureDiagramProps) {
  const [tooltip, setTooltip] = useState<TooltipData>(null)

  const maxX = gridCols ?? (Math.max(...blocks.map(b => b.x)) + 1)
  const maxY = gridRows ?? (Math.max(...blocks.map(b => b.y)) + 1)
  const svgW = maxX * CELL_W + PAD_X * 2
  const svgH = maxY * CELL_H + PAD_Y * 2

  function blockCenter(b: ArchBlock): { x: number; y: number } {
    return {
      x: PAD_X + b.x * CELL_W + BLOCK_W / 2,
      y: PAD_Y + b.y * CELL_H + BLOCK_H / 2,
    }
  }

  function blockRect(b: ArchBlock) {
    return {
      x: PAD_X + b.x * CELL_W + (CELL_W - BLOCK_W) / 2,
      y: PAD_Y + b.y * CELL_H + (CELL_H - BLOCK_H) / 2,
    }
  }

  function blockColor(b: ArchBlock) {
    return b.color ?? TYPE_DEFAULT_COLORS[b.type] ?? accentColor
  }

  function connStrokeDasharray(style?: ArchConnection['style']) {
    if (style === 'async') return '6 3'
    if (style === 'event') return '2 3'
    return undefined
  }

  function connColor(style?: ArchConnection['style']) {
    if (style === 'async') return '#f59e0b'
    if (style === 'event') return '#8b5cf6'
    return LINE_DEFAULT
  }

  function connPath(from: ArchBlock, to: ArchBlock): string {
    const fc = blockCenter(from)
    const tc = blockCenter(to)
    const dx = tc.x - fc.x
    const dy = tc.y - fc.y
    const dist = Math.sqrt(dx * dx + dy * dy) || 1

    // Ponto de saída na borda do bloco
    const hw = BLOCK_W / 2
    const hh = BLOCK_H / 2
    const sx = fc.x + (dx / dist) * hw
    const sy = fc.y + (dy / dist) * hh
    const ex = tc.x - (dx / dist) * hw
    const ey = tc.y - (dy / dist) * hh

    // Curva suave via ponto de controle
    const mx = (sx + ex) / 2
    const my = (sy + ey) / 2
    return `M${sx},${sy} Q${mx},${my} ${ex},${ey}`
  }

  return (
    <div style={{ fontFamily: MONO, position: 'relative' }}>
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

      {/* Legenda de estilos de conexão */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
        {[
          { style: 'sync',  label: 'Síncrono',   color: LINE_DEFAULT, dash: undefined },
          { style: 'async', label: 'Assíncrono',  color: '#f59e0b',   dash: '6 3' },
          { style: 'event', label: 'Evento',      color: '#8b5cf6',   dash: '2 3' },
        ].map(item => (
          <div key={item.style} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width={28} height={12}>
              <line x1={2} y1={6} x2={26} y2={6}
                stroke={item.color} strokeWidth={1.5}
                strokeDasharray={item.dash} />
            </svg>
            <span style={{ color: FGMUTE_DEFAULT, fontSize: 10 }}>{item.label}</span>
          </div>
        ))}
      </div>

      <div style={{
        background: bgColor,
        border: `1px solid ${LINE_DEFAULT}`,
        borderRadius: 14,
        overflow: 'hidden',
      }}>
        <svg
          width="100%"
          viewBox={`0 0 ${svgW} ${svgH}`}
          style={{ display: 'block', minHeight: 200 }}
        >
          <defs>
            <marker id="ad-arr-sync" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill={LINE_DEFAULT} />
            </marker>
            <marker id="ad-arr-async" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#f59e0b" />
            </marker>
            <marker id="ad-arr-event" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#8b5cf6" />
            </marker>
          </defs>

          {/* Zonas */}
          {zones?.map((zone, zi) => {
            const zBlocks = blocks.filter(b => zone.blockIds.includes(b.id))
            if (zBlocks.length === 0) return null
            const xs = zBlocks.map(b => PAD_X + b.x * CELL_W)
            const ys = zBlocks.map(b => PAD_Y + b.y * CELL_H)
            const zx = Math.min(...xs) - 10
            const zy = Math.min(...ys) - 20
            const zw = Math.max(...xs) + BLOCK_W + (CELL_W - BLOCK_W) + 10 - zx
            const zh = Math.max(...ys) + BLOCK_H + (CELL_H - BLOCK_H) + 10 - zy
            const zc = zone.color ?? accentColor
            return (
              <g key={zi}>
                <rect x={zx} y={zy} width={zw} height={zh} rx={10}
                  fill={`${zc}08`} stroke={`${zc}40`} strokeWidth={1} strokeDasharray="8 4" />
                <text x={zx + 10} y={zy + 16} fill={zc} fontSize={10} fontWeight={700} fontFamily={MONO}>
                  {zone.label}
                </text>
              </g>
            )
          })}

          {/* Conexões */}
          {connections.map((conn, ci) => {
            const fb = blocks.find(b => b.id === conn.from)
            const tb = blocks.find(b => b.id === conn.to)
            if (!fb || !tb) return null
            const d     = connPath(fb, tb)
            const color = connColor(conn.style)
            const fc    = blockCenter(fb)
            const tc    = blockCenter(tb)
            const mx    = (fc.x + tc.x) / 2
            const my    = (fc.y + tc.y) / 2
            const arrId = `ad-arr-${conn.style ?? 'sync'}`
            return (
              <g key={ci}>
                <path d={d} fill="none" stroke={color} strokeWidth={1.5}
                  strokeDasharray={connStrokeDasharray(conn.style)}
                  markerEnd={`url(#${arrId})`} />
                {(conn.label || conn.protocol) && (
                  <text x={mx} y={my - 6}
                    fill={color} fontSize={8.5} textAnchor="middle" fontFamily={MONO}>
                    {conn.protocol ? `${conn.protocol}${conn.label ? ': ' + conn.label : ''}` : conn.label}
                  </text>
                )}
              </g>
            )
          })}

          {/* Blocos */}
          {blocks.map(block => {
            const r   = blockRect(block)
            const c   = blockCenter(block)
            const col = blockColor(block)
            return (
              <g key={block.id}
                style={{ cursor: block.description || (block.tech && block.tech.length > 0) ? 'pointer' : 'default' }}
                onMouseEnter={e => setTooltip({ clientX: e.clientX, clientY: e.clientY, block })}
                onMouseMove={e => setTooltip(t => t ? { ...t, clientX: e.clientX, clientY: e.clientY } : null)}
                onMouseLeave={() => setTooltip(null)}
              >
                <rect x={r.x} y={r.y} width={BLOCK_W} height={BLOCK_H} rx={8}
                  fill={`${col}20`} stroke={col} strokeWidth={1.5}
                />
                {/* Faixa de tipo no topo */}
                <rect x={r.x} y={r.y} width={BLOCK_W} height={16} rx={8}
                  fill={`${col}40`}
                />
                <rect x={r.x} y={r.y + 8} width={BLOCK_W} height={8}
                  fill={`${col}40`}
                />

                <text x={r.x + 10} y={r.y + 11}
                  fill={col} fontSize={8} fontWeight={700} fontFamily={MONO}
                  dominantBaseline="middle">
                  {TYPE_ICONS[block.type]} {block.type.toUpperCase()}
                </text>

                <text x={c.x} y={c.y + (block.sublabel ? 2 : 8)}
                  fill={FG_DEFAULT} fontSize={11} fontWeight={700}
                  textAnchor="middle" dominantBaseline="middle" fontFamily={MONO}>
                  {block.label}
                </text>
                {block.sublabel && (
                  <text x={c.x} y={c.y + 16}
                    fill={FGMUTE_DEFAULT} fontSize={8.5}
                    textAnchor="middle" dominantBaseline="middle" fontFamily={MONO}>
                    {block.sublabel}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div style={{
          position: 'fixed',
          left: tooltip.clientX + 14,
          top: tooltip.clientY - 10,
          background: CARD_DEFAULT,
          border: `1px solid ${blockColor(tooltip.block) + '80'}`,
          borderRadius: 10,
          padding: '10px 14px',
          fontSize: 11,
          color: FG_DEFAULT,
          fontFamily: MONO,
          maxWidth: 260,
          zIndex: 9999,
          pointerEvents: 'none',
          boxShadow: '0 8px 30px #00000070',
          lineHeight: 1.6,
        }}>
          <div style={{ color: blockColor(tooltip.block), fontWeight: 800, fontSize: 12, marginBottom: 6 }}>
            {TYPE_ICONS[tooltip.block.type]} {tooltip.block.label}
          </div>
          {tooltip.block.description && (
            <p style={{ color: FGMUTE_DEFAULT, margin: '0 0 8px', fontSize: 11, lineHeight: 1.6 }}>
              {tooltip.block.description}
            </p>
          )}
          {tooltip.block.tech && tooltip.block.tech.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {tooltip.block.tech.map((t, i) => (
                <span key={i} style={{
                  background: `${blockColor(tooltip.block)}20`,
                  border: `1px solid ${blockColor(tooltip.block)}40`,
                  color: blockColor(tooltip.block),
                  borderRadius: 6, padding: '1px 7px', fontSize: 10,
                }}>
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
