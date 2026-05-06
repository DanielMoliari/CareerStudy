'use client'
import { useState, useEffect, useRef } from 'react'

// ── Paleta padrão ─────────────────────────────────────────────────────────────

const BG_DEFAULT     = '#0f172a'
const CARD_DEFAULT   = '#1e293b'
const LINE_DEFAULT   = '#334155'
const FG_DEFAULT     = '#e2e8f0'
const FGMUTE_DEFAULT = '#94a3b8'
const MONO           = "'JetBrains Mono', monospace"

// ── Types ─────────────────────────────────────────────────────────────────────

export type FlowStep = {
  id: string
  label: string
  sublabel?: string
  icon?: string
  color?: string
  latency?: string
  details?: string
  code?: string
}

export type FlowScenario = {
  id: string
  label: string
  description?: string
  steps: FlowStep[]
  edges?: Array<{ from: string; to: string; label?: string; reverse?: boolean }>
}

interface RequestResponseFlowProps {
  scenarios: FlowScenario[]
  accentColor?: string
  bgColor?: string
  cardColor?: string
  title?: string
  description?: string
}

// ── Componente ────────────────────────────────────────────────────────────────

export function RequestResponseFlow({
  scenarios,
  accentColor = '#ef4444',
  bgColor     = BG_DEFAULT,
  cardColor   = CARD_DEFAULT,
  title,
  description,
}: RequestResponseFlowProps) {
  const [scenarioIdx, setScenarioIdx]     = useState(0)
  const [activeStep,  setActiveStep]      = useState<string | null>(null)
  const [animStep,    setAnimStep]        = useState<number>(-1)
  const [isPlaying,   setIsPlaying]       = useState(false)
  const animRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const scenario = scenarios[scenarioIdx] ?? scenarios[0]
  const { steps } = scenario

  // Para animação
  useEffect(() => {
    if (!isPlaying) return
    if (animStep >= steps.length) {
      setIsPlaying(false)
      return
    }
    animRef.current = setTimeout(() => {
      setAnimStep(s => s + 1)
    }, 600)
    return () => { if (animRef.current) clearTimeout(animRef.current) }
  }, [isPlaying, animStep, steps.length])

  function startAnimation() {
    setAnimStep(0)
    setIsPlaying(true)
    setActiveStep(null)
  }

  function resetAnimation() {
    if (animRef.current) clearTimeout(animRef.current)
    setIsPlaying(false)
    setAnimStep(-1)
  }

  function handleScenarioChange(idx: number) {
    resetAnimation()
    setScenarioIdx(idx)
    setActiveStep(null)
  }

  const selectedStep = activeStep
    ? steps.find(s => s.id === activeStep) ?? null
    : animStep >= 0 && animStep < steps.length
    ? steps[animStep]
    : null

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
      }}>
        {/* Seletor de cenário */}
        {scenarios.length > 1 && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            {scenarios.map((sc, i) => (
              <button key={sc.id} onClick={() => handleScenarioChange(i)} style={{
                padding: '5px 14px',
                borderRadius: 20,
                border: `1px solid ${i === scenarioIdx ? accentColor : LINE_DEFAULT}`,
                background: i === scenarioIdx ? `${accentColor}20` : 'transparent',
                color: i === scenarioIdx ? accentColor : FGMUTE_DEFAULT,
                fontSize: 11, fontWeight: 600,
                cursor: 'pointer', fontFamily: MONO,
                transition: 'all .2s',
              }}>
                {sc.label}
              </button>
            ))}
          </div>
        )}

        {scenario.description && (
          <p style={{ color: FGMUTE_DEFAULT, fontSize: 12, margin: '0 0 20px', lineHeight: 1.6 }}>
            {scenario.description}
          </p>
        )}

        {/* Barra de steps */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          overflowX: 'auto',
          paddingBottom: 8,
          marginBottom: 20,
        }}>
          {steps.map((step, i) => {
            const isAnimActive = animStep === i
            const isAnimDone   = animStep > i
            const isSelected   = activeStep === step.id
            const color        = step.color ?? accentColor
            const highlight    = isAnimActive || isSelected

            return (
              <div key={step.id} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                {/* Nó do step */}
                <button
                  onClick={() => {
                    resetAnimation()
                    setActiveStep(prev => prev === step.id ? null : step.id)
                  }}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    gap: 6, padding: '12px 16px',
                    borderRadius: 12,
                    border: `1.5px solid ${highlight ? color : isAnimDone ? color + '60' : LINE_DEFAULT}`,
                    background: highlight
                      ? `${color}25`
                      : isAnimDone
                      ? `${color}10`
                      : CARD_DEFAULT,
                    cursor: 'pointer', fontFamily: MONO,
                    transition: 'all .25s',
                    minWidth: 90,
                    boxShadow: highlight ? `0 0 18px ${color}40` : 'none',
                  }}
                >
                  {step.icon && (
                    <span style={{ fontSize: 22, lineHeight: 1 }}>{step.icon}</span>
                  )}
                  <span style={{
                    color: highlight ? FG_DEFAULT : isAnimDone ? FG_DEFAULT + 'cc' : FGMUTE_DEFAULT,
                    fontSize: 11, fontWeight: 700, textAlign: 'center',
                    transition: 'color .25s',
                  }}>
                    {step.label}
                  </span>
                  {step.sublabel && (
                    <span style={{ color: FGMUTE_DEFAULT, fontSize: 9 }}>{step.sublabel}</span>
                  )}
                  {step.latency && (
                    <span style={{
                      background: `${color}20`,
                      border: `1px solid ${color}40`,
                      color: color,
                      borderRadius: 10, padding: '1px 6px', fontSize: 9, fontWeight: 700,
                    }}>
                      {step.latency}
                    </span>
                  )}
                </button>

                {/* Seta entre steps */}
                {i < steps.length - 1 && (
                  <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    padding: '0 2px', flexShrink: 0,
                  }}>
                    {/* Aresta de request */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                      <div style={{
                        width: 28, height: 1.5,
                        background: animStep > i ? accentColor : LINE_DEFAULT,
                        transition: 'background .3s',
                      }} />
                      <div style={{
                        width: 0, height: 0,
                        borderTop: '4px solid transparent',
                        borderBottom: '4px solid transparent',
                        borderLeft: `6px solid ${animStep > i ? accentColor : LINE_DEFAULT}`,
                        transition: 'border-color .3s',
                      }} />
                    </div>

                    {/* Aresta de resposta (reversa) */}
                    {(scenario.edges ?? []).some(
                      e => e.reverse && e.from === steps[i + 1]?.id && e.to === step.id
                    ) && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginTop: 4 }}>
                        <div style={{
                          width: 0, height: 0,
                          borderTop: '4px solid transparent',
                          borderBottom: '4px solid transparent',
                          borderRight: `6px solid ${LINE_DEFAULT}60`,
                        }} />
                        <div style={{ width: 28, height: 1.5, background: `${LINE_DEFAULT}60` }} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Controles de animação */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <button onClick={startAnimation} disabled={isPlaying} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 16px', borderRadius: 8,
            border: `1px solid ${accentColor}50`,
            background: isPlaying ? `${accentColor}10` : `${accentColor}20`,
            color: accentColor, fontSize: 12, fontWeight: 700,
            cursor: isPlaying ? 'not-allowed' : 'pointer',
            fontFamily: MONO, transition: 'all .2s',
            opacity: isPlaying ? 0.5 : 1,
          }}>
            ▶ Simular
          </button>
          <button onClick={resetAnimation} style={{
            padding: '7px 16px', borderRadius: 8,
            border: `1px solid ${LINE_DEFAULT}`,
            background: 'transparent',
            color: FGMUTE_DEFAULT, fontSize: 12, fontWeight: 600,
            cursor: 'pointer', fontFamily: MONO, transition: 'all .2s',
          }}>
            ↺ Resetar
          </button>
        </div>

        {/* Painel de detalhes do step selecionado */}
        {selectedStep && (
          <div style={{
            background: cardColor,
            border: `1px solid ${(selectedStep.color ?? accentColor) + '50'}`,
            borderRadius: 12, padding: 18,
            animation: 'rrf-fadein .2s ease',
            boxShadow: `0 0 20px ${(selectedStep.color ?? accentColor) + '20'}`,
          }}>
            <style>{`@keyframes rrf-fadein { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:translateY(0) } }`}</style>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              {selectedStep.icon && <span style={{ fontSize: 20 }}>{selectedStep.icon}</span>}
              <div>
                <span style={{ color: selectedStep.color ?? accentColor, fontWeight: 800, fontSize: 13 }}>
                  {selectedStep.label}
                </span>
                {selectedStep.latency && (
                  <span style={{
                    marginLeft: 10,
                    background: `${selectedStep.color ?? accentColor}20`,
                    color: selectedStep.color ?? accentColor,
                    borderRadius: 10, padding: '1px 8px', fontSize: 10, fontWeight: 700,
                  }}>
                    {selectedStep.latency}
                  </span>
                )}
              </div>
            </div>

            {selectedStep.details && (
              <p style={{ color: FGMUTE_DEFAULT, fontSize: 12, lineHeight: 1.7, margin: '0 0 12px' }}>
                {selectedStep.details}
              </p>
            )}

            {selectedStep.code && (
              <pre style={{
                background: BG_DEFAULT,
                border: `1px solid ${LINE_DEFAULT}`,
                borderRadius: 8, padding: '10px 14px',
                fontSize: 11, color: FG_DEFAULT,
                overflowX: 'auto', margin: 0, lineHeight: 1.6, fontFamily: MONO,
              }}>
                <code>{selectedStep.code}</code>
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
