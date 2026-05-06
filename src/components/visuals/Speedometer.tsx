'use client'
import { useState, useRef } from 'react'

// ── Paleta padrão ────────────────────────────────────────────────────────────

const BG_DEFAULT     = '#0f172a'
const CARD_DEFAULT   = '#1e293b'
const LINE_DEFAULT   = '#334155'
const FG_DEFAULT     = '#e2e8f0'
const FGMUTE_DEFAULT = '#94a3b8'
const MONO           = "'JetBrains Mono', monospace"

// ── Tipos ────────────────────────────────────────────────────────────────────

export type SpeedometerDimension = {
  id: string
  label: string
  description?: string
  unit?: string
  higherIsBetter?: boolean
}

export type SpeedometerOption = {
  id: string
  label: string
  color: string
  icon?: string
  scores: Record<string, number>
  notes?: Record<string, string>
}

interface SpeedometerProps {
  dimensions: SpeedometerDimension[]
  options: SpeedometerOption[]
  accentColor?: string
  bgColor?: string
  cardColor?: string
  title?: string
  description?: string
  mode?: 'gauge' | 'radar' | 'bar'
}

// ── Gauge SVG ────────────────────────────────────────────────────────────────

function polarToXY(cx: number, cy: number, r: number, angleDeg: number): [number, number] {
  const rad = (angleDeg - 90) * (Math.PI / 180)
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)]
}

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const [sx, sy] = polarToXY(cx, cy, r, startDeg)
  const [ex, ey] = polarToXY(cx, cy, r, endDeg)
  const large = endDeg - startDeg > 180 ? 1 : 0
  return `M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey}`
}

function GaugeChart({
  dim,
  options,
  cardColor,
}: {
  dim: SpeedometerDimension
  options: SpeedometerOption[]
  cardColor: string
}) {
  const [hovered, setHovered] = useState<string | null>(null)
  const SIZE = 160
  const CX = SIZE / 2
  const CY = SIZE / 2 + 10
  const R_OUTER = 62
  const R_INNER = 44
  const START = -150
  const END   = 150

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: FG_DEFAULT, textAlign: 'center' }}>{dim.label}</div>
      {dim.description && (
        <div style={{ fontSize: 10, color: FGMUTE_DEFAULT, textAlign: 'center', maxWidth: 120 }}>{dim.description}</div>
      )}
      <svg width={SIZE} height={SIZE * 0.75} viewBox={`0 0 ${SIZE} ${SIZE * 0.75}`} style={{ overflow: 'visible' }}>
        {/* Trilha de fundo */}
        <path
          d={arcPath(CX, CY, R_OUTER, START, END)}
          fill="none"
          stroke={LINE_DEFAULT}
          strokeWidth={R_OUTER - R_INNER}
        />
        {/* Arcos por opção */}
        {options.map((opt, i) => {
          const score = Math.max(0, Math.min(100, opt.scores[dim.id] ?? 0))
          const angleFill = START + (score / 100) * (END - START)
          const offset = i * 2 // leve separação visual
          const rMid = R_INNER + (R_OUTER - R_INNER) / 2
          const rOpt = rMid - i * ((R_OUTER - R_INNER) / options.length)
          const rW = Math.max(4, (R_OUTER - R_INNER) / options.length - 2)
          return (
            <g key={opt.id}>
              <path
                d={arcPath(CX, CY, R_INNER + i * ((R_OUTER - R_INNER) / options.length) + rW / 2 + offset, START, angleFill)}
                fill="none"
                stroke={opt.color}
                strokeWidth={rW}
                strokeLinecap="round"
                opacity={hovered === null || hovered === opt.id ? 1 : 0.3}
                onMouseEnter={() => setHovered(opt.id)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'default', transition: 'opacity .2s' }}
              />
            </g>
          )
        })}
        {/* Valor central — opção hovered ou média */}
        {hovered ? (() => {
          const opt = options.find(o => o.id === hovered)!
          const score = opt?.scores[dim.id] ?? 0
          return (
            <>
              <text x={CX} y={CY + 4} textAnchor="middle" fill={opt.color} fontSize={20} fontWeight={900} fontFamily={MONO}>
                {score}
              </text>
              <text x={CX} y={CY + 18} textAnchor="middle" fill={FGMUTE_DEFAULT} fontSize={9} fontFamily={MONO}>
                {dim.unit ?? 'pts'}
              </text>
            </>
          )
        })() : (
          <>
            <text x={CX} y={CY + 4} textAnchor="middle" fill={FGMUTE_DEFAULT} fontSize={12} fontFamily={MONO}>
              —
            </text>
          </>
        )}
      </svg>
      {/* Notas do hover */}
      {hovered && (() => {
        const opt = options.find(o => o.id === hovered)
        const note = opt?.notes?.[dim.id]
        if (!note) return null
        return (
          <div style={{
            fontSize: 10,
            color: FGMUTE_DEFAULT,
            background: cardColor,
            border: `1px solid ${LINE_DEFAULT}`,
            borderRadius: 6,
            padding: '4px 8px',
            maxWidth: 140,
            textAlign: 'center',
          }}>
            {note}
          </div>
        )
      })()}
    </div>
  )
}

// ── Bar Chart ─────────────────────────────────────────────────────────────────

function BarChart({
  dimensions,
  options,
  cardColor,
}: {
  dimensions: SpeedometerDimension[]
  options: SpeedometerOption[]
  cardColor: string
}) {
  const [hoveredCell, setHoveredCell] = useState<{ dim: string; opt: string } | null>(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {dimensions.map(dim => (
        <div key={dim.id}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: FG_DEFAULT }}>{dim.label}</span>
            {dim.unit && <span style={{ fontSize: 10, color: FGMUTE_DEFAULT }}>({dim.unit})</span>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {options.map(opt => {
              const score = Math.max(0, Math.min(100, opt.scores[dim.id] ?? 0))
              const isHov = hoveredCell?.dim === dim.id && hoveredCell?.opt === opt.id
              return (
                <div
                  key={opt.id}
                  style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                  onMouseEnter={() => setHoveredCell({ dim: dim.id, opt: opt.id })}
                  onMouseLeave={() => setHoveredCell(null)}
                >
                  <div style={{ width: 90, fontSize: 11, color: opt.color, fontWeight: 700, flexShrink: 0, textAlign: 'right' }}>
                    {opt.label}
                  </div>
                  <div style={{
                    flex: 1,
                    height: 20,
                    background: LINE_DEFAULT,
                    borderRadius: 10,
                    overflow: 'hidden',
                    position: 'relative',
                  }}>
                    <div style={{
                      width: `${score}%`,
                      height: '100%',
                      background: opt.color,
                      borderRadius: 10,
                      transition: 'width .6s cubic-bezier(.22,1,.36,1)',
                    }} />
                  </div>
                  <div style={{ width: 36, fontSize: 11, color: FG_DEFAULT, fontWeight: 800, flexShrink: 0 }}>
                    {score}
                  </div>
                  {isHov && opt.notes?.[dim.id] && (
                    <div style={{
                      position: 'fixed',
                      zIndex: 20,
                      background: cardColor,
                      border: `1px solid ${LINE_DEFAULT}`,
                      borderRadius: 8,
                      padding: '6px 10px',
                      fontSize: 11,
                      color: FGMUTE_DEFAULT,
                      maxWidth: 200,
                      pointerEvents: 'none',
                    }}>
                      {opt.notes[dim.id]}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Radar Chart ───────────────────────────────────────────────────────────────

function RadarChart({
  dimensions,
  options,
  cardColor,
}: {
  dimensions: SpeedometerDimension[]
  options: SpeedometerOption[]
  cardColor: string
}) {
  const [hovered, setHovered] = useState<string | null>(null)
  const SIZE  = 280
  const CX    = SIZE / 2
  const CY    = SIZE / 2
  const R     = 100
  const N     = dimensions.length
  const levels = [20, 40, 60, 80, 100]

  function angleOf(i: number) { return (2 * Math.PI * i) / N - Math.PI / 2 }
  function pt(i: number, r: number): [number, number] {
    return [CX + r * Math.cos(angleOf(i)), CY + r * Math.sin(angleOf(i))]
  }

  function polygon(scores: Record<string, number>): string {
    return dimensions
      .map((d, i) => {
        const s = Math.max(0, Math.min(100, scores[d.id] ?? 0))
        const [x, y] = pt(i, (s / 100) * R)
        return `${x},${y}`
      })
      .join(' ')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        {/* Grades */}
        {levels.map(lv => (
          <polygon
            key={lv}
            points={dimensions.map((_, i) => {
              const [x, y] = pt(i, (lv / 100) * R)
              return `${x},${y}`
            }).join(' ')}
            fill="none"
            stroke={LINE_DEFAULT}
            strokeWidth={1}
            opacity={.6}
          />
        ))}
        {/* Eixos */}
        {dimensions.map((_, i) => {
          const [x, y] = pt(i, R)
          return <line key={i} x1={CX} y1={CY} x2={x} y2={y} stroke={LINE_DEFAULT} strokeWidth={1} />
        })}
        {/* Rótulos dos eixos */}
        {dimensions.map((dim, i) => {
          const [x, y] = pt(i, R + 18)
          return (
            <text
              key={dim.id}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={9}
              fill={FGMUTE_DEFAULT}
              fontFamily={MONO}
            >
              {dim.label}
            </text>
          )
        })}
        {/* Polígonos por opção */}
        {options.map(opt => (
          <polygon
            key={opt.id}
            points={polygon(opt.scores)}
            fill={`${opt.color}25`}
            stroke={opt.color}
            strokeWidth={hovered === null || hovered === opt.id ? 2 : 1}
            opacity={hovered === null || hovered === opt.id ? 1 : 0.3}
            onMouseEnter={() => setHovered(opt.id)}
            onMouseLeave={() => setHovered(null)}
            style={{ cursor: 'default', transition: 'opacity .2s' }}
          />
        ))}
        {/* Pontos */}
        {options.map(opt =>
          dimensions.map((dim, i) => {
            const s = Math.max(0, Math.min(100, opt.scores[dim.id] ?? 0))
            const [x, y] = pt(i, (s / 100) * R)
            return (
              <circle
                key={`${opt.id}-${dim.id}`}
                cx={x}
                cy={y}
                r={3}
                fill={opt.color}
                opacity={hovered === null || hovered === opt.id ? 1 : 0.2}
              />
            )
          })
        )}
      </svg>

      {/* Nota do hover */}
      {hovered && (() => {
        const opt = options.find(o => o.id === hovered)
        if (!opt) return null
        const noteDim = dimensions.find(d => opt.notes?.[d.id])
        const note = noteDim ? opt.notes?.[noteDim.id] : null
        if (!note) return null
        return (
          <div style={{
            fontSize: 10,
            color: FGMUTE_DEFAULT,
            background: cardColor,
            border: `1px solid ${LINE_DEFAULT}`,
            borderRadius: 6,
            padding: '4px 10px',
          }}>
            {opt.label}: {note}
          </div>
        )
      })()}
    </div>
  )
}

// ── Componente principal ──────────────────────────────────────────────────────

export function Speedometer({
  dimensions,
  options,
  accentColor = '#ef4444',
  bgColor = BG_DEFAULT,
  cardColor = CARD_DEFAULT,
  title,
  description,
  mode: initialMode = 'bar',
}: SpeedometerProps) {
  const [mode, setMode] = useState<'gauge' | 'radar' | 'bar'>(initialMode)

  const MODES: Array<{ id: 'gauge' | 'radar' | 'bar'; label: string }> = [
    { id: 'bar',   label: 'Barras' },
    { id: 'gauge', label: 'Gauge' },
    { id: 'radar', label: 'Radar' },
  ]

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

      {/* Toggle de modo */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        {MODES.map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            style={{
              padding: '5px 14px',
              borderRadius: 20,
              border: `1px solid ${mode === m.id ? accentColor : LINE_DEFAULT}`,
              background: mode === m.id ? `${accentColor}22` : 'transparent',
              color: mode === m.id ? accentColor : FGMUTE_DEFAULT,
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: MONO,
              transition: 'all .2s',
            }}
          >
            {m.label}
          </button>
        ))}

        {/* Legenda de opções */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {options.map(opt => (
            <div key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: opt.color, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: FG_DEFAULT, fontWeight: 600 }}>{opt.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Visualização */}
      <div style={{
        background: bgColor,
        border: `1px solid ${LINE_DEFAULT}`,
        borderRadius: 14,
        padding: 24,
      }}>
        {mode === 'bar' && (
          <BarChart dimensions={dimensions} options={options} cardColor={cardColor} />
        )}

        {mode === 'gauge' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(dimensions.length, 4)}, 1fr)`,
            gap: 16,
            justifyItems: 'center',
          }}>
            {dimensions.map(dim => (
              <GaugeChart key={dim.id} dim={dim} options={options} cardColor={cardColor} />
            ))}
          </div>
        )}

        {mode === 'radar' && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <RadarChart dimensions={dimensions} options={options} cardColor={cardColor} />
          </div>
        )}
      </div>
    </div>
  )
}
