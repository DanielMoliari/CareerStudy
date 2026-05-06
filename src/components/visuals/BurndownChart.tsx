'use client'
import { useState, useMemo } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────────

export type BurndownSeries = {
  id: string
  label: string
  color: string
  data: Array<{ x: number; y: number }>
  style?: 'solid' | 'dashed'
}

export type BurndownAnnotation = {
  x: number
  label: string
  color?: string
  description?: string
}

interface BurndownChartProps {
  series: BurndownSeries[]
  annotations?: BurndownAnnotation[]
  accentColor?: string
  bgColor?: string
  cardColor?: string
  title?: string
  description?: string
  xLabel?: string
  yLabel?: string
}

// ── Palette ──────────────────────────────────────────────────────────────────────

const BG_DEFAULT     = '#0f172a'
const CARD_DEFAULT   = '#1e293b'
const LINE_DEFAULT   = '#334155'
const FG_DEFAULT     = '#e2e8f0'
const FGMUTE_DEFAULT = '#94a3b8'
const MONO           = "'JetBrains Mono', monospace"

// ── Component ────────────────────────────────────────────────────────────────────

export function BurndownChart({
  series,
  annotations = [],
  accentColor = '#ef4444',
  bgColor = BG_DEFAULT,
  cardColor = CARD_DEFAULT,
  title,
  description,
  xLabel = 'Dias',
  yLabel = 'Pontos',
}: BurndownChartProps) {
  const [hidden, setHidden] = useState<Set<string>>(new Set())
  const [hoverPoint, setHoverPoint] = useState<{ series: BurndownSeries; point: { x: number; y: number }; px: number; py: number } | null>(null)
  const [hoverAnnotation, setHoverAnnotation] = useState<BurndownAnnotation | null>(null)

  const PAD = { top: 20, right: 30, bottom: 50, left: 60 }
  const SVG_W = 640
  const SVG_H = 340
  const CHART_W = SVG_W - PAD.left - PAD.right
  const CHART_H = SVG_H - PAD.top - PAD.bottom

  const allPoints = series.flatMap(s => s.data)
  const xMin = Math.min(...allPoints.map(p => p.x))
  const xMax = Math.max(...allPoints.map(p => p.x))
  const yMin = 0
  const yMax = Math.max(...allPoints.map(p => p.y)) * 1.1

  const toSvgX = (x: number) => PAD.left + ((x - xMin) / (xMax - xMin || 1)) * CHART_W
  const toSvgY = (y: number) => PAD.top + CHART_H - ((y - yMin) / (yMax - yMin || 1)) * CHART_H

  const xTicks = useMemo(() => {
    const count = Math.min(xMax - xMin + 1, 10)
    const step = Math.ceil((xMax - xMin + 1) / count)
    const ticks: number[] = []
    for (let x = xMin; x <= xMax; x += step) ticks.push(x)
    return ticks
  }, [xMin, xMax])

  const yTicks = useMemo(() => {
    const count = 5
    const step = Math.ceil(yMax / count / 5) * 5
    const ticks: number[] = []
    for (let y = 0; y <= yMax; y += step) ticks.push(y)
    return ticks
  }, [yMax])

  const polyline = (s: BurndownSeries) =>
    s.data.map(p => `${toSvgX(p.x)},${toSvgY(p.y)}`).join(' ')

  return (
    <div style={{ fontFamily: MONO }}>
      {(title || description) && (
        <div style={{ marginBottom: 16 }}>
          {title && <h3 style={{ color: FG_DEFAULT, fontSize: 20, fontWeight: 800, margin: '0 0 6px' }}>{title}</h3>}
          {description && <p style={{ color: FGMUTE_DEFAULT, fontSize: 12, margin: 0 }}>{description}</p>}
        </div>
      )}

      {/* legend */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 12 }}>
        {series.map(s => {
          const isHidden = hidden.has(s.id)
          return (
            <button
              key={s.id}
              onClick={() => setHidden(prev => {
                const next = new Set(prev)
                if (next.has(s.id)) next.delete(s.id)
                else next.add(s.id)
                return next
              })}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'transparent', border: 'none', cursor: 'pointer',
                opacity: isHidden ? 0.4 : 1, fontFamily: MONO, padding: 0,
              }}
            >
              <svg width={24} height={8}>
                <line
                  x1={0} y1={4} x2={24} y2={4}
                  stroke={s.color} strokeWidth={2}
                  strokeDasharray={s.style === 'dashed' ? '4 2' : 'none'}
                />
              </svg>
              <span style={{ color: FG_DEFAULT, fontSize: 11 }}>{s.label}</span>
            </button>
          )
        })}
      </div>

      <div style={{ position: 'relative', background: bgColor, borderRadius: 14, border: `1px solid ${LINE_DEFAULT}`, overflow: 'hidden' }}>
        <svg width="100%" viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ display: 'block' }}>
          {/* grid */}
          {yTicks.map(y => (
            <line
              key={`gy-${y}`}
              x1={PAD.left} y1={toSvgY(y)}
              x2={SVG_W - PAD.right} y2={toSvgY(y)}
              stroke={LINE_DEFAULT} strokeWidth={0.8} strokeDasharray="3 3"
            />
          ))}

          {/* axes */}
          <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + CHART_H} stroke={LINE_DEFAULT} strokeWidth={1.5} />
          <line x1={PAD.left} y1={PAD.top + CHART_H} x2={SVG_W - PAD.right} y2={PAD.top + CHART_H} stroke={LINE_DEFAULT} strokeWidth={1.5} />

          {/* x ticks */}
          {xTicks.map(x => (
            <g key={`xt-${x}`}>
              <line x1={toSvgX(x)} y1={PAD.top + CHART_H} x2={toSvgX(x)} y2={PAD.top + CHART_H + 5} stroke={LINE_DEFAULT} strokeWidth={1} />
              <text x={toSvgX(x)} y={PAD.top + CHART_H + 18} textAnchor="middle" fontSize={9} fill={FGMUTE_DEFAULT} fontFamily={MONO}>{x}</text>
            </g>
          ))}

          {/* y ticks */}
          {yTicks.map(y => (
            <g key={`yt-${y}`}>
              <line x1={PAD.left - 5} y1={toSvgY(y)} x2={PAD.left} y2={toSvgY(y)} stroke={LINE_DEFAULT} strokeWidth={1} />
              <text x={PAD.left - 8} y={toSvgY(y)} textAnchor="end" dominantBaseline="middle" fontSize={9} fill={FGMUTE_DEFAULT} fontFamily={MONO}>{y}</text>
            </g>
          ))}

          {/* axis labels */}
          <text x={PAD.left + CHART_W / 2} y={SVG_H - 4} textAnchor="middle" fontSize={10} fill={FGMUTE_DEFAULT} fontFamily={MONO}>{xLabel}</text>
          <text x={12} y={PAD.top + CHART_H / 2} textAnchor="middle" fontSize={10} fill={FGMUTE_DEFAULT} fontFamily={MONO} transform={`rotate(-90, 12, ${PAD.top + CHART_H / 2})`}>{yLabel}</text>

          {/* annotations */}
          {annotations.map((ann, i) => {
            const ax = toSvgX(ann.x)
            const col = ann.color ?? accentColor
            return (
              <g key={i}>
                <line x1={ax} y1={PAD.top} x2={ax} y2={PAD.top + CHART_H} stroke={col} strokeWidth={1.5} strokeDasharray="5 3" />
                <text x={ax + 4} y={PAD.top + 14} fontSize={9} fill={col} fontFamily={MONO} fontWeight={700}>{ann.label}</text>
                {/* invisible hit area */}
                <rect
                  x={ax - 8} y={PAD.top} width={16} height={CHART_H}
                  fill="transparent"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoverAnnotation(ann)}
                  onMouseLeave={() => setHoverAnnotation(null)}
                />
              </g>
            )
          })}

          {/* series */}
          {series.filter(s => !hidden.has(s.id)).map(s => (
            <g key={s.id}>
              <polyline
                points={polyline(s)}
                fill="none"
                stroke={s.color}
                strokeWidth={2}
                strokeDasharray={s.style === 'dashed' ? '6 3' : 'none'}
              />
              {/* area fill */}
              <polygon
                points={`${toSvgX(s.data[0].x)},${PAD.top + CHART_H} ${polyline(s)} ${toSvgX(s.data[s.data.length - 1].x)},${PAD.top + CHART_H}`}
                fill={s.color + '12'}
              />
              {/* hover dots */}
              {s.data.map((p, i) => (
                <circle
                  key={i}
                  cx={toSvgX(p.x)} cy={toSvgY(p.y)} r={5}
                  fill={s.color} stroke={bgColor} strokeWidth={2}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={e => {
                    const rect = (e.target as SVGCircleElement).closest('svg')!.getBoundingClientRect()
                    const scaleX = SVG_W / rect.width
                    const scaleY = SVG_H / rect.height
                    setHoverPoint({
                      series: s, point: p,
                      px: (e.clientX - rect.left) * scaleX,
                      py: (e.clientY - rect.top) * scaleY,
                    })
                  }}
                  onMouseLeave={() => setHoverPoint(null)}
                />
              ))}
            </g>
          ))}
        </svg>

        {/* hover tooltip for point */}
        {hoverPoint && (
          <div style={{
            position: 'absolute',
            left: `${(hoverPoint.px / SVG_W) * 100}%`,
            top: `${(hoverPoint.py / SVG_H) * 100}%`,
            transform: 'translate(8px, -50%)',
            background: cardColor, border: `1px solid ${hoverPoint.series.color}60`,
            borderRadius: 8, padding: '8px 12px', pointerEvents: 'none', zIndex: 10,
          }}>
            <div style={{ color: hoverPoint.series.color, fontSize: 10, fontWeight: 700, marginBottom: 3 }}>{hoverPoint.series.label}</div>
            <div style={{ color: FGMUTE_DEFAULT, fontSize: 10 }}>{xLabel}: <span style={{ color: FG_DEFAULT, fontWeight: 700 }}>{hoverPoint.point.x}</span></div>
            <div style={{ color: FGMUTE_DEFAULT, fontSize: 10 }}>{yLabel}: <span style={{ color: FG_DEFAULT, fontWeight: 700 }}>{hoverPoint.point.y}</span></div>
          </div>
        )}

        {/* annotation tooltip */}
        {hoverAnnotation && hoverAnnotation.description && (
          <div style={{
            position: 'absolute', left: `${((toSvgX(hoverAnnotation.x) + 10) / SVG_W) * 100}%`, top: '10%',
            background: cardColor, border: `1px solid ${hoverAnnotation.color ?? accentColor}60`,
            borderRadius: 8, padding: '8px 12px', maxWidth: 200, pointerEvents: 'none', zIndex: 10,
          }}>
            <div style={{ color: hoverAnnotation.color ?? accentColor, fontSize: 11, fontWeight: 700, marginBottom: 4 }}>{hoverAnnotation.label}</div>
            <div style={{ color: FGMUTE_DEFAULT, fontSize: 11, lineHeight: 1.4 }}>{hoverAnnotation.description}</div>
          </div>
        )}
      </div>
    </div>
  )
}
