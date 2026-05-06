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

export type SMState = {
  id: string
  label: string
  description?: string
  color?: string
  isInitial?: boolean
  isFinal?: boolean
}

export type SMTransition = {
  from: string
  to: string
  event: string
  guard?: string
  code?: string
}

interface StateMachineExplorerProps {
  states: SMState[]
  transitions: SMTransition[]
  initialState: string
  accentColor?: string
  bgColor?: string
  cardColor?: string
  title?: string
  description?: string
}

// ── Layout de nós em círculo ──────────────────────────────────────────────────

function circlePositions(count: number, cx: number, cy: number, r: number) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
  })
}

// ── Componente ────────────────────────────────────────────────────────────────

const NODE_R = 34
const SVG_W  = 520
const SVG_H  = 340

export function StateMachineExplorer({
  states,
  transitions,
  initialState,
  accentColor = '#ef4444',
  bgColor     = BG_DEFAULT,
  cardColor   = CARD_DEFAULT,
  title,
  description,
}: StateMachineExplorerProps) {
  const [current,  setCurrent]  = useState(initialState)
  const [selected, setSelected] = useState<SMTransition | null>(null)
  const [history,  setHistory]  = useState<string[]>([initialState])

  const svgRef  = useRef<SVGSVGElement>(null)
  const gRef    = useRef<SVGGElement>(null)
  const panRef  = useRef({ x: 0, y: 0 })
  const zoomRef = useRef(1)
  const dragging = useRef(false)
  const lastPt   = useRef({ x: 0, y: 0 })

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
      const f = e.deltaY < 0 ? 1.1 : 0.9
      zoomRef.current = Math.min(3, Math.max(0.3, zoomRef.current * f))
      applyTransform()
    }
    const onMD = (e: MouseEvent) => {
      if ((e.target as Element).closest('[data-sm-node]')) return
      dragging.current = true
      lastPt.current = { x: e.clientX, y: e.clientY }
      svg.style.cursor = 'grabbing'
    }
    const onMM = (e: MouseEvent) => {
      if (!dragging.current) return
      panRef.current.x += e.clientX - lastPt.current.x
      panRef.current.y += e.clientY - lastPt.current.y
      lastPt.current = { x: e.clientX, y: e.clientY }
      applyTransform()
    }
    const onMU = () => { dragging.current = false; svg.style.cursor = 'grab' }
    svg.addEventListener('wheel', onWheel, { passive: false })
    svg.addEventListener('mousedown', onMD)
    window.addEventListener('mousemove', onMM)
    window.addEventListener('mouseup', onMU)
    svg.style.cursor = 'grab'
    return () => {
      svg.removeEventListener('wheel', onWheel)
      svg.removeEventListener('mousedown', onMD)
      window.removeEventListener('mousemove', onMM)
      window.removeEventListener('mouseup', onMU)
    }
  }, [applyTransform])

  // Posições dos nós
  const cx = SVG_W / 2
  const cy = SVG_H / 2
  const r  = Math.min(cx, cy) - NODE_R - 20
  const positions = circlePositions(states.length, cx, cy, states.length === 1 ? 0 : r)
  const posMap = new Map(states.map((s, i) => [s.id, positions[i]]))

  // Transições disponíveis a partir do estado atual
  const availableTransitions = transitions.filter(t => t.from === current)

  function fireTransition(t: SMTransition) {
    setCurrent(t.to)
    setSelected(t)
    setHistory(h => [...h, t.to])
  }

  function reset() {
    setCurrent(initialState)
    setSelected(null)
    setHistory([initialState])
  }

  // Ângulo de seta para arestas curvas
  function edgePath(from: string, to: string): string {
    const fp = posMap.get(from)
    const tp = posMap.get(to)
    if (!fp || !tp) return ''
    if (from === to) {
      // Self-loop
      return `M${fp.x},${fp.y - NODE_R} A${NODE_R * 0.8},${NODE_R * 0.8} 0 1 1 ${fp.x + NODE_R * 0.01},${fp.y - NODE_R}`
    }
    const dx = tp.x - fp.x
    const dy = tp.y - fp.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    const offset = NODE_R
    const sx = fp.x + (dx / dist) * offset
    const sy = fp.y + (dy / dist) * offset
    const ex = tp.x - (dx / dist) * offset
    const ey = tp.y - (dy / dist) * offset
    // Arco curvo
    const bend = 30
    const mx   = (sx + ex) / 2 - (dy / dist) * bend
    const my   = (sy + ey) / 2 + (dx / dist) * bend
    return `M${sx},${sy} Q${mx},${my} ${ex},${ey}`
  }

  function labelMidpoint(from: string, to: string): { x: number; y: number } {
    const fp = posMap.get(from)
    const tp = posMap.get(to)
    if (!fp || !tp) return { x: 0, y: 0 }
    if (from === to) return { x: fp.x + NODE_R * 1.6, y: fp.y - NODE_R * 1.4 }
    const dx = tp.x - fp.x
    const dy = tp.y - fp.y
    const dist = Math.sqrt(dx * dx + dy * dy) || 1
    const bend = 30
    const mx   = (fp.x + tp.x) / 2 - (dy / dist) * bend
    const my   = (fp.y + tp.y) / 2 + (dx / dist) * bend
    return { x: mx, y: my - 8 }
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
        border: `1px solid ${LINE_DEFAULT}`,
        borderRadius: 14,
        padding: 24,
        display: 'grid',
        gridTemplateColumns: '1fr 280px',
        gap: 20,
        alignItems: 'start',
      }}>
        {/* SVG da máquina de estados */}
        <div style={{
          background: CARD_DEFAULT,
          border: `1px solid ${LINE_DEFAULT}`,
          borderRadius: 12,
          overflow: 'hidden',
        }}>
          <svg
            ref={svgRef}
            width="100%"
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            style={{ display: 'block', minHeight: 220 }}
          >
            <defs>
              <marker id="sme-arrow" markerWidth="8" markerHeight="8"
                refX="7" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill={LINE_DEFAULT} />
              </marker>
              <marker id="sme-arrow-active" markerWidth="8" markerHeight="8"
                refX="7" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill={accentColor} />
              </marker>
            </defs>

            <g ref={gRef}>
              {/* Arestas */}
              {transitions.map((t, i) => {
                const isActive   = t.from === current
                const isSelected = selected?.from === t.from && selected?.event === t.event
                const color      = isSelected ? accentColor : isActive ? (accentColor + 'aa') : LINE_DEFAULT
                const d = edgePath(t.from, t.to)
                const lm = labelMidpoint(t.from, t.to)
                return (
                  <g key={i}>
                    <path d={d} fill="none" stroke={color} strokeWidth={isSelected ? 2 : 1.5}
                      markerEnd={`url(#sme-arrow${isSelected ? '-active' : ''})`}
                      strokeDasharray={isActive && !isSelected ? '5 3' : undefined}
                    />
                    <text x={lm.x} y={lm.y}
                      fill={isSelected ? accentColor : FGMUTE_DEFAULT}
                      fontSize={9} textAnchor="middle" fontFamily={MONO}
                      style={{ pointerEvents: 'none' }}>
                      {t.event}
                    </text>
                  </g>
                )
              })}

              {/* Nós */}
              {states.map(state => {
                const p = posMap.get(state.id)
                if (!p) return null
                const isCurrent = state.id === current
                const color = state.color ?? accentColor
                return (
                  <g key={state.id} data-sm-node="1"
                    onClick={() => setCurrent(state.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {state.isInitial && (
                      <circle cx={p.x} cy={p.y} r={NODE_R + 5}
                        fill="none" stroke={color} strokeWidth={1} strokeDasharray="4 2" opacity={0.4} />
                    )}
                    <circle cx={p.x} cy={p.y} r={NODE_R}
                      fill={isCurrent ? `${color}30` : `${color}15`}
                      stroke={color}
                      strokeWidth={isCurrent ? 2.5 : 1.5}
                      style={{
                        filter: isCurrent ? `drop-shadow(0 0 8px ${color}80)` : 'none',
                        transition: 'all .25s',
                      }}
                    />
                    {state.isFinal && (
                      <circle cx={p.x} cy={p.y} r={NODE_R - 6}
                        fill="none" stroke={color} strokeWidth={1.5} />
                    )}
                    <text x={p.x} y={p.y + 1}
                      fill={isCurrent ? FG_DEFAULT : FGMUTE_DEFAULT}
                      fontSize={10} fontWeight={700}
                      textAnchor="middle" dominantBaseline="middle"
                      fontFamily={MONO}
                      style={{ pointerEvents: 'none', transition: 'fill .25s' }}>
                      {state.label}
                    </text>
                  </g>
                )
              })}
            </g>
          </svg>
        </div>

        {/* Painel lateral */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Estado atual */}
          <div style={{
            background: cardColor,
            border: `1px solid ${(states.find(s => s.id === current)?.color ?? accentColor) + '50'}`,
            borderRadius: 12, padding: 16,
          }}>
            <div style={{ fontSize: 10, color: FGMUTE_DEFAULT, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.1em' }}>
              Estado atual
            </div>
            <div style={{ color: states.find(s => s.id === current)?.color ?? accentColor, fontWeight: 800, fontSize: 15, marginBottom: 6 }}>
              {states.find(s => s.id === current)?.label ?? current}
            </div>
            {states.find(s => s.id === current)?.description && (
              <p style={{ color: FGMUTE_DEFAULT, fontSize: 11, margin: 0, lineHeight: 1.6 }}>
                {states.find(s => s.id === current)?.description}
              </p>
            )}
          </div>

          {/* Transições disponíveis */}
          <div style={{
            background: cardColor,
            border: `1px solid ${LINE_DEFAULT}`,
            borderRadius: 12, padding: 16,
          }}>
            <div style={{ fontSize: 10, color: FGMUTE_DEFAULT, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.1em' }}>
              Transições disponíveis
            </div>
            {availableTransitions.length === 0 ? (
              <p style={{ color: FGMUTE_DEFAULT, fontSize: 11, margin: 0 }}>
                Estado final — nenhuma transição disponível.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {availableTransitions.map((t, i) => (
                  <button key={i} onClick={() => fireTransition(t)} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 12px', borderRadius: 8,
                    border: `1px solid ${accentColor}50`,
                    background: `${accentColor}10`,
                    color: FG_DEFAULT, fontSize: 11, fontWeight: 600,
                    cursor: 'pointer', fontFamily: MONO, transition: 'all .2s',
                    textAlign: 'left',
                  }}>
                    <span>
                      <span style={{ color: accentColor }}>on: </span>
                      {t.event}
                      {t.guard && <span style={{ color: FGMUTE_DEFAULT }}> [{t.guard}]</span>}
                    </span>
                    <span style={{ color: FGMUTE_DEFAULT, fontSize: 10 }}>→ {t.to}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Código da última transição */}
          {selected?.code && (
            <div style={{
              background: cardColor,
              border: `1px solid ${LINE_DEFAULT}`,
              borderRadius: 12, padding: 16,
            }}>
              <div style={{ fontSize: 10, color: FGMUTE_DEFAULT, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.1em' }}>
                Código — {selected.event}
              </div>
              <pre style={{
                background: BG_DEFAULT, border: `1px solid ${LINE_DEFAULT}`,
                borderRadius: 8, padding: '10px 12px',
                fontSize: 10, color: FG_DEFAULT, overflowX: 'auto',
                margin: 0, lineHeight: 1.6, fontFamily: MONO,
              }}>
                <code>{selected.code}</code>
              </pre>
            </div>
          )}

          {/* Histórico + reset */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{
              background: cardColor, border: `1px solid ${LINE_DEFAULT}`,
              borderRadius: 12, padding: 14,
            }}>
              <div style={{ fontSize: 10, color: FGMUTE_DEFAULT, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.1em' }}>
                Histórico
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {history.map((h, i) => (
                  <span key={i} style={{
                    background: i === history.length - 1 ? `${accentColor}20` : `${LINE_DEFAULT}50`,
                    border: `1px solid ${i === history.length - 1 ? accentColor + '60' : LINE_DEFAULT}`,
                    color: i === history.length - 1 ? accentColor : FGMUTE_DEFAULT,
                    borderRadius: 6, padding: '2px 7px', fontSize: 10,
                  }}>
                    {states.find(s => s.id === h)?.label ?? h}
                  </span>
                ))}
              </div>
            </div>

            <button onClick={reset} style={{
              padding: '8px 16px', borderRadius: 8,
              border: `1px solid ${LINE_DEFAULT}`,
              background: 'transparent', color: FGMUTE_DEFAULT,
              fontSize: 11, fontWeight: 600, cursor: 'pointer',
              fontFamily: MONO, transition: 'all .2s',
            }}>
              ↺ Reiniciar máquina
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
