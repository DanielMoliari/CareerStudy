'use client'
import { useState, useRef, useCallback } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────────

export type GanttTrack = {
  id: string
  label: string
  sublabel?: string
  color?: string
}

export type GanttTask = {
  id: string
  trackId: string
  label: string
  start: number
  duration: number
  color?: string
  description?: string
  dependencies?: string[]
}

export type GanttPhase = {
  label: string
  start: number
  end: number
  color?: string
}

interface GanttTimelineProps {
  tracks: GanttTrack[]
  tasks: GanttTask[]
  phases?: GanttPhase[]
  accentColor?: string
  bgColor?: string
  cardColor?: string
  title?: string
  description?: string
  timeUnit?: string
}

// ── Paleta ───────────────────────────────────────────────────────────────────────

const BG      = '#0f172a'
const CARD    = '#1e293b'
const LINE    = '#334155'
const FG      = '#e2e8f0'
const FGMUTE  = '#94a3b8'
const MONO    = "'JetBrains Mono', monospace"

const TRACK_H = 48
const HEADER_H = 36
const LABEL_W  = 130

// ── Component ────────────────────────────────────────────────────────────────────

export function GanttTimeline({
  tracks,
  tasks,
  phases = [],
  accentColor = '#ef4444',
  bgColor = BG,
  cardColor = CARD,
  title,
  description,
  timeUnit = 'u',
}: GanttTimelineProps) {
  const [hoveredTask, setHoveredTask] = useState<string | null>(null)
  const [cursorPos, setCursorPos] = useState(50)
  const isDragging = useRef(false)
  const chartRef = useRef<HTMLDivElement>(null)

  const chartW = 600
  const totalH = HEADER_H + tracks.length * TRACK_H

  const xOf = (val: number) => LABEL_W + (val / 100) * (chartW - LABEL_W)

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const raw = ((e.clientX - rect.left - LABEL_W) / (chartW - LABEL_W)) * 100
    setCursorPos(Math.max(0, Math.min(100, raw)))
  }, [chartW])

  const hovTask = tasks.find(t => t.id === hoveredTask)
  const depTasks = hovTask?.dependencies?.map(d => tasks.find(t => t.id === d)).filter(Boolean) ?? []

  return (
    <div style={{ fontFamily: MONO, color: FG }}>
      {(title || description) && (
        <div style={{ marginBottom: 20 }}>
          {title && (
            <h3 style={{ color: FG, fontSize: 22, fontWeight: 800, margin: '0 0 6px' }}>{title}</h3>
          )}
          {description && (
            <p style={{ color: FGMUTE, fontSize: 12, margin: 0, lineHeight: 1.6 }}>{description}</p>
          )}
        </div>
      )}

      <div ref={chartRef} style={{
        background: bgColor,
        border: `1px solid ${LINE}`,
        borderRadius: 14,
        padding: 20,
        overflowX: 'auto',
      }}>
        <svg
          width="100%"
          viewBox={`0 0 ${chartW} ${totalH}`}
          style={{ display: 'block', cursor: isDragging.current ? 'ew-resize' : 'default' }}
          onMouseMove={handleMouseMove}
          onMouseDown={() => { isDragging.current = true }}
          onMouseUp={() => { isDragging.current = false }}
          onMouseLeave={() => { isDragging.current = false }}
        >
          {/* Fases de fundo */}
          {phases.map((ph, i) => (
            <rect
              key={i}
              x={xOf(ph.start)}
              y={0}
              width={xOf(ph.end) - xOf(ph.start)}
              height={totalH}
              fill={ph.color ?? accentColor}
              opacity={0.07}
            />
          ))}

          {/* Header de tempo */}
          <rect x={0} y={0} width={chartW} height={HEADER_H} fill={cardColor} />
          <line x1={LABEL_W} y1={HEADER_H} x2={chartW} y2={HEADER_H} stroke={LINE} strokeWidth={1} />
          {[0, 25, 50, 75, 100].map(tick => (
            <g key={tick}>
              <line
                x1={xOf(tick)} y1={HEADER_H - 8}
                x2={xOf(tick)} y2={totalH}
                stroke={LINE} strokeWidth={1} strokeDasharray="4 4"
              />
              <text
                x={xOf(tick)} y={HEADER_H - 12}
                textAnchor="middle"
                fill={FGMUTE}
                fontSize={9}
                fontFamily={MONO}
              >
                {tick}{timeUnit}
              </text>
            </g>
          ))}

          {/* Labels de fase */}
          {phases.map((ph, i) => (
            <text
              key={i}
              x={(xOf(ph.start) + xOf(ph.end)) / 2}
              y={HEADER_H - 22}
              textAnchor="middle"
              fill={ph.color ?? accentColor}
              fontSize={9}
              fontWeight={700}
              fontFamily={MONO}
            >
              {ph.label}
            </text>
          ))}

          {/* Tracks */}
          {tracks.map((track, ti) => {
            const y = HEADER_H + ti * TRACK_H
            const trackTasks = tasks.filter(t => t.trackId === track.id)
            return (
              <g key={track.id}>
                <rect x={0} y={y} width={LABEL_W} height={TRACK_H} fill={cardColor} />
                <line x1={0} y1={y + TRACK_H} x2={chartW} y2={y + TRACK_H} stroke={LINE} strokeWidth={1} />
                <text x={12} y={y + TRACK_H / 2 - (track.sublabel ? 6 : 0)} fill={FG} fontSize={11} fontWeight={700} fontFamily={MONO} dominantBaseline="middle">
                  {track.label}
                </text>
                {track.sublabel && (
                  <text x={12} y={y + TRACK_H / 2 + 10} fill={FGMUTE} fontSize={9} fontFamily={MONO}>
                    {track.sublabel}
                  </text>
                )}
                {/* Tasks */}
                {trackTasks.map(task => {
                  const tx = xOf(task.start)
                  const tw = xOf(task.start + task.duration) - tx
                  const ty = y + 10
                  const th = TRACK_H - 20
                  const isHov = hoveredTask === task.id
                  const isDep = hovTask?.dependencies?.includes(task.id)
                  const col = task.color ?? track.color ?? accentColor
                  return (
                    <g
                      key={task.id}
                      onMouseEnter={() => setHoveredTask(task.id)}
                      onMouseLeave={() => setHoveredTask(null)}
                      style={{ cursor: 'pointer' }}
                    >
                      <rect
                        x={tx} y={ty} width={tw} height={th}
                        rx={5}
                        fill={col}
                        opacity={isHov ? 1 : isDep ? 0.9 : 0.75}
                        stroke={isHov ? FG : isDep ? '#fff' : 'none'}
                        strokeWidth={isHov ? 2 : 1}
                      />
                      {tw > 40 && (
                        <text
                          x={tx + tw / 2} y={ty + th / 2}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="#fff"
                          fontSize={9}
                          fontWeight={700}
                          fontFamily={MONO}
                        >
                          {task.label}
                        </text>
                      )}
                    </g>
                  )
                })}
              </g>
            )
          })}

          {/* Setas de dependência */}
          {hovTask && depTasks.map(dep => {
            if (!dep) return null
            const depTrackIdx = tracks.findIndex(t => t.id === dep.trackId)
            const hovTrackIdx = tracks.findIndex(t => t.id === hovTask.trackId)
            if (depTrackIdx < 0 || hovTrackIdx < 0) return null
            const x1 = xOf(dep.start + dep.duration)
            const y1 = HEADER_H + depTrackIdx * TRACK_H + TRACK_H / 2
            const x2 = xOf(hovTask.start)
            const y2 = HEADER_H + hovTrackIdx * TRACK_H + TRACK_H / 2
            return (
              <path
                key={dep.id}
                d={`M${x1},${y1} C${x1 + 20},${y1} ${x2 - 20},${y2} ${x2},${y2}`}
                fill="none"
                stroke={accentColor}
                strokeWidth={2}
                strokeDasharray="5 3"
                markerEnd="url(#arrow)"
              />
            )
          })}

          {/* Marcador de seta */}
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill={accentColor} />
            </marker>
          </defs>

          {/* Linha de cursor */}
          <line
            x1={xOf(cursorPos)} y1={0}
            x2={xOf(cursorPos)} y2={totalH}
            stroke={accentColor}
            strokeWidth={2}
            opacity={0.8}
            style={{ cursor: 'ew-resize' }}
          />
          <circle cx={xOf(cursorPos)} cy={HEADER_H / 2} r={5} fill={accentColor} />
          <text
            x={xOf(cursorPos) + 7} y={HEADER_H / 2 + 4}
            fill={accentColor} fontSize={9} fontWeight={700} fontFamily={MONO}
          >
            {Math.round(cursorPos)}{timeUnit}
          </text>
        </svg>

        {/* Painel de detalhes do hover */}
        {hovTask && (
          <div style={{
            marginTop: 16,
            background: cardColor,
            border: `1px solid ${accentColor}50`,
            borderRadius: 10,
            padding: '12px 16px',
            fontSize: 12,
          }}>
            <div style={{ color: accentColor, fontWeight: 700, marginBottom: 6 }}>{hovTask.label}</div>
            {hovTask.description && (
              <div style={{ color: FGMUTE, lineHeight: 1.6, marginBottom: 8 }}>{hovTask.description}</div>
            )}
            <div style={{ color: FGMUTE, fontSize: 11 }}>
              <span style={{ color: FG }}>Início:</span> {hovTask.start}{timeUnit} &nbsp;|&nbsp;
              <span style={{ color: FG }}>Duração:</span> {hovTask.duration}{timeUnit}
            </div>
            {depTasks.length > 0 && (
              <div style={{ marginTop: 8, fontSize: 11 }}>
                <span style={{ color: FG }}>Depende de:</span>{' '}
                {depTasks.map(d => (
                  <span key={d!.id} style={{
                    background: `${accentColor}20`, border: `1px solid ${accentColor}40`,
                    borderRadius: 4, padding: '2px 6px', marginRight: 4, color: accentColor,
                  }}>{d!.label}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Legenda de fases */}
        {phases.length > 0 && (
          <div style={{ display: 'flex', gap: 12, marginTop: 14, flexWrap: 'wrap' }}>
            {phases.map((ph, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: ph.color ?? accentColor, opacity: 0.7 }} />
                <span style={{ color: FGMUTE }}>{ph.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
