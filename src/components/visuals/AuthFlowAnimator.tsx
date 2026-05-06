'use client'
import { useState, useEffect, useRef } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────────

export type AuthActor = {
  id: string
  label: string
  sublabel?: string
  icon?: string
  color?: string
  type: 'client' | 'server' | 'provider' | 'database' | 'user'
}

export type AuthStep = {
  id: string
  from: string
  to: string
  label: string
  description: string
  data?: string
  type?: 'request' | 'response' | 'redirect' | 'token' | 'error'
}

export type AuthFlow = {
  id: string
  label: string
  description?: string
  actors: AuthActor[]
  steps: AuthStep[]
}

interface AuthFlowAnimatorProps {
  flows: AuthFlow[]
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

const ACTOR_ICONS: Record<AuthActor['type'], string> = {
  client:   '💻',
  server:   '⚙️',
  provider: '🔑',
  database: '🗄️',
  user:     '👤',
}

const STEP_COLORS: Record<NonNullable<AuthStep['type']>, string> = {
  request:  '#3b82f6',
  response: '#22c55e',
  redirect: '#f59e0b',
  token:    '#8b5cf6',
  error:    '#ef4444',
}

// ── Component ────────────────────────────────────────────────────────────────────

export function AuthFlowAnimator({
  flows,
  accentColor = '#ef4444',
  bgColor = BG_DEFAULT,
  cardColor = CARD_DEFAULT,
  title,
  description,
}: AuthFlowAnimatorProps) {
  const [flowIdx, setFlowIdx] = useState(0)
  const [currentStep, setCurrentStep] = useState(-1)
  const [playing, setPlaying] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const flow = flows[flowIdx]

  const stop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setPlaying(false)
  }

  const play = () => {
    setPlaying(true)
    setCurrentStep(0)
  }

  useEffect(() => {
    if (!playing) return
    intervalRef.current = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= flow.steps.length - 1) {
          stop()
          return prev
        }
        return prev + 1
      })
    }, 1400)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [playing, flow.steps.length])

  const reset = () => { stop(); setCurrentStep(-1) }

  const actorIndex = (id: string) => flow.actors.findIndex(a => a.id === id)

  const ACTOR_W = 90
  const ACTOR_GAP = 80
  const totalW = flow.actors.length * (ACTOR_W + ACTOR_GAP) - ACTOR_GAP
  const actorX = (id: string) => {
    const i = actorIndex(id)
    return i * (ACTOR_W + ACTOR_GAP) + ACTOR_W / 2
  }
  const H_BASE = 60
  const STEP_H = 52

  const svgH = H_BASE + flow.steps.length * STEP_H + 40

  const stepColor = (step: AuthStep) =>
    step.type ? STEP_COLORS[step.type] : accentColor

  const activeStep = currentStep >= 0 && currentStep < flow.steps.length
    ? flow.steps[currentStep]
    : null

  return (
    <div style={{ fontFamily: MONO }}>
      {(title || description) && (
        <div style={{ marginBottom: 16 }}>
          {title && <h3 style={{ color: FG_DEFAULT, fontSize: 20, fontWeight: 800, margin: '0 0 6px' }}>{title}</h3>}
          {description && <p style={{ color: FGMUTE_DEFAULT, fontSize: 12, margin: 0 }}>{description}</p>}
        </div>
      )}

      {/* flow selector */}
      {flows.length > 1 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {flows.map((f, i) => (
            <button
              key={f.id}
              onClick={() => { reset(); setFlowIdx(i) }}
              style={{
                padding: '5px 14px', borderRadius: 20, border: `1px solid ${LINE_DEFAULT}`,
                background: flowIdx === i ? accentColor : 'transparent',
                color: flowIdx === i ? '#fff' : FGMUTE_DEFAULT,
                fontSize: 11, cursor: 'pointer', fontFamily: MONO,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {flow.description && (
        <p style={{ color: FGMUTE_DEFAULT, fontSize: 11, margin: '0 0 12px' }}>{flow.description}</p>
      )}

      <div style={{ background: bgColor, border: `1px solid ${LINE_DEFAULT}`, borderRadius: 14, overflow: 'hidden' }}>
        {/* SVG sequence diagram */}
        <div style={{ overflowX: 'auto' }}>
          <svg
            width={Math.max(totalW + 40, 400)}
            height={svgH}
            style={{ display: 'block', minWidth: '100%' }}
          >
            {/* lifelines */}
            {flow.actors.map(a => {
              const x = actorX(a.id)
              return (
                <line
                  key={`ll-${a.id}`}
                  x1={x} y1={H_BASE - 10}
                  x2={x} y2={svgH - 20}
                  stroke={LINE_DEFAULT} strokeWidth={1} strokeDasharray="4 4"
                />
              )
            })}

            {/* actors */}
            {flow.actors.map(a => {
              const x = actorX(a.id)
              const col = a.color ?? accentColor
              return (
                <g key={a.id} transform={`translate(${x - ACTOR_W / 2}, 0)`}>
                  <rect width={ACTOR_W} height={44} rx={8} fill={CARD_DEFAULT} stroke={col} strokeWidth={1.5} />
                  <text x={ACTOR_W / 2} y={18} textAnchor="middle" fontSize={16} dominantBaseline="middle">{ACTOR_ICONS[a.type]}</text>
                  <text x={ACTOR_W / 2} y={32} textAnchor="middle" fontSize={9} fontWeight={700} fill={FG_DEFAULT} dominantBaseline="middle" fontFamily={MONO}>{a.label}</text>
                  {a.sublabel && <text x={ACTOR_W / 2} y={42} textAnchor="middle" fontSize={7.5} fill={FGMUTE_DEFAULT} dominantBaseline="middle" fontFamily={MONO}>{a.sublabel}</text>}
                </g>
              )
            })}

            {/* steps */}
            {flow.steps.map((step, i) => {
              const y = H_BASE + i * STEP_H + STEP_H / 2
              const x1 = actorX(step.from)
              const x2 = actorX(step.to)
              const isActive = i === currentStep
              const isPast = i < currentStep
              const col = stepColor(step)
              const opacity = currentStep === -1 ? 0.6 : (isActive || isPast ? 1 : 0.25)
              const dir = x2 > x1 ? 1 : -1

              return (
                <g key={step.id} opacity={opacity}>
                  <line
                    x1={x1 + dir * 4} y1={y}
                    x2={x2 - dir * 4} y2={y}
                    stroke={col} strokeWidth={isActive ? 2.5 : 1.5}
                  />
                  {/* arrowhead */}
                  <polygon
                    points={`${x2 - dir * 10},${y - 5} ${x2 - dir * 4},${y} ${x2 - dir * 10},${y + 5}`}
                    fill={col}
                  />
                  <text
                    x={(x1 + x2) / 2}
                    y={y - 8}
                    textAnchor="middle"
                    fontSize={isActive ? 10 : 9}
                    fontWeight={isActive ? 700 : 500}
                    fill={isActive ? FG_DEFAULT : FGMUTE_DEFAULT}
                    fontFamily={MONO}
                  >
                    {step.label}
                  </text>
                  {isPast && (
                    <text x={x1 + 6} y={y + 14} fontSize={8} fill={FGMUTE_DEFAULT} fontFamily={MONO}>✓</text>
                  )}
                </g>
              )
            })}
          </svg>
        </div>

        {/* controls */}
        <div style={{ padding: '12px 20px', borderTop: `1px solid ${LINE_DEFAULT}`, display: 'flex', alignItems: 'center', gap: 12 }}>
          {!playing && currentStep === -1 && (
            <button
              onClick={play}
              style={{
                padding: '6px 18px', borderRadius: 8,
                background: accentColor, border: 'none',
                color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: MONO,
              }}
            >
              ▶ Play
            </button>
          )}
          {playing && (
            <button
              onClick={stop}
              style={{
                padding: '6px 18px', borderRadius: 8,
                background: LINE_DEFAULT, border: 'none',
                color: FG_DEFAULT, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: MONO,
              }}
            >
              ⏸ Pausar
            </button>
          )}
          {!playing && currentStep >= 0 && (
            <>
              <button
                onClick={play}
                style={{
                  padding: '6px 18px', borderRadius: 8,
                  background: accentColor, border: 'none',
                  color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: MONO,
                }}
              >
                ▶ Continuar
              </button>
              <button
                onClick={reset}
                style={{
                  padding: '6px 18px', borderRadius: 8,
                  background: 'transparent', border: `1px solid ${LINE_DEFAULT}`,
                  color: FGMUTE_DEFAULT, fontSize: 12, cursor: 'pointer', fontFamily: MONO,
                }}
              >
                ↺ Reiniciar
              </button>
            </>
          )}
          {currentStep >= 0 && (
            <span style={{ color: FGMUTE_DEFAULT, fontSize: 11, marginLeft: 'auto' }}>
              {currentStep + 1} / {flow.steps.length}
            </span>
          )}
        </div>

        {/* active step detail */}
        {activeStep && (
          <div style={{ padding: '16px 20px', borderTop: `1px solid ${LINE_DEFAULT}`, background: cardColor }}>
            <div style={{ color: stepColor(activeStep), fontSize: 12, fontWeight: 700, marginBottom: 6 }}>{activeStep.label}</div>
            <div style={{ color: FG_DEFAULT, fontSize: 12, lineHeight: 1.5, marginBottom: activeStep.data ? 10 : 0 }}>{activeStep.description}</div>
            {activeStep.data && (
              <pre style={{ background: BG_DEFAULT, borderRadius: 6, padding: 10, margin: 0, fontSize: 10, color: '#86efac', overflowX: 'auto' }}>
                <code>{activeStep.data}</code>
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
