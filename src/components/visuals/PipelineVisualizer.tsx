'use client'
import { useState, useEffect, useRef } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────────

export type PipelineStage = {
  id: string
  label: string
  description?: string
  duration?: string
  status?: 'success' | 'running' | 'failed' | 'pending' | 'skipped'
  steps?: Array<{
    label: string
    command?: string
    status?: 'success' | 'running' | 'failed' | 'pending'
    output?: string
  }>
  parallel?: boolean
}

export type Pipeline = {
  id: string
  label: string
  description?: string
  trigger?: string
  stages: PipelineStage[]
}

interface PipelineVisualizerProps {
  pipelines: Pipeline[]
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

type StageStatus = 'success' | 'running' | 'failed' | 'pending' | 'skipped'

const STATUS_COLOR: Record<StageStatus, string> = {
  success: '#22c55e',
  running: '#3b82f6',
  failed:  '#ef4444',
  pending: '#475569',
  skipped: '#94a3b8',
}

const STATUS_ICON: Record<StageStatus, string> = {
  success: '✓',
  running: '◌',
  failed:  '✗',
  pending: '○',
  skipped: '⊘',
}

// ── Component ────────────────────────────────────────────────────────────────────

export function PipelineVisualizer({
  pipelines,
  accentColor = '#ef4444',
  bgColor = BG_DEFAULT,
  cardColor = CARD_DEFAULT,
  title,
  description,
}: PipelineVisualizerProps) {
  const [pipelineIdx, setPipelineIdx] = useState(0)
  const [selectedStage, setSelectedStage] = useState<PipelineStage | null>(null)
  const [simStatuses, setSimStatuses] = useState<Record<string, StageStatus>>({})
  const [simRunning, setSimRunning] = useState(false)
  const simRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const pipeline = pipelines[pipelineIdx]

  const stageStatus = (stage: PipelineStage): StageStatus =>
    simStatuses[stage.id] ?? stage.status ?? 'pending'

  const resetSim = () => {
    if (simRef.current) clearTimeout(simRef.current)
    setSimStatuses({})
    setSimRunning(false)
  }

  const runSim = () => {
    resetSim()
    setSimRunning(true)
    const stages = pipeline.stages

    stages.forEach((stage, i) => {
      const delay = i * 1600
      // set running
      simRef.current = setTimeout(() => {
        setSimStatuses(prev => ({ ...prev, [stage.id]: 'running' }))
      }, delay)
      // set success (or random fail ~10%)
      simRef.current = setTimeout(() => {
        const result: StageStatus = Math.random() < 0.1 ? 'failed' : 'success'
        setSimStatuses(prev => ({ ...prev, [stage.id]: result }))
        if (i === stages.length - 1) setSimRunning(false)
      }, delay + 1400)
    })
  }

  useEffect(() => () => { if (simRef.current) clearTimeout(simRef.current) }, [])

  return (
    <div style={{ fontFamily: MONO }}>
      {(title || description) && (
        <div style={{ marginBottom: 16 }}>
          {title && <h3 style={{ color: FG_DEFAULT, fontSize: 20, fontWeight: 800, margin: '0 0 6px' }}>{title}</h3>}
          {description && <p style={{ color: FGMUTE_DEFAULT, fontSize: 12, margin: 0 }}>{description}</p>}
        </div>
      )}

      {/* pipeline selector */}
      {pipelines.length > 1 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {pipelines.map((p, i) => (
            <button
              key={p.id}
              onClick={() => { resetSim(); setPipelineIdx(i); setSelectedStage(null) }}
              style={{
                padding: '5px 14px', borderRadius: 20, border: `1px solid ${LINE_DEFAULT}`,
                background: pipelineIdx === i ? accentColor : 'transparent',
                color: pipelineIdx === i ? '#fff' : FGMUTE_DEFAULT,
                fontSize: 11, cursor: 'pointer', fontFamily: MONO,
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      {pipeline.trigger && (
        <div style={{ color: FGMUTE_DEFAULT, fontSize: 11, marginBottom: 12 }}>
          Disparador: <span style={{ color: accentColor }}>{pipeline.trigger}</span>
        </div>
      )}

      {pipeline.description && (
        <p style={{ color: FGMUTE_DEFAULT, fontSize: 11, margin: '0 0 16px' }}>{pipeline.description}</p>
      )}

      {/* pipeline visual */}
      <div style={{ background: bgColor, border: `1px solid ${LINE_DEFAULT}`, borderRadius: 14, padding: 20, overflowX: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, minWidth: 'max-content' }}>
          {pipeline.stages.map((stage, i) => {
            const status = stageStatus(stage)
            const col = STATUS_COLOR[status]
            const isSelected = selectedStage?.id === stage.id
            return (
              <div key={stage.id} style={{ display: 'flex', alignItems: 'center' }}>
                {i > 0 && (
                  <div style={{ width: 32, height: 2, background: LINE_DEFAULT, flexShrink: 0 }} />
                )}
                <div
                  onClick={() => setSelectedStage(isSelected ? null : stage)}
                  style={{
                    width: 110, cursor: 'pointer',
                    background: isSelected ? col + '20' : cardColor,
                    border: `1px solid ${isSelected ? col : LINE_DEFAULT}`,
                    borderRadius: 10, padding: '10px 8px',
                    transition: 'all .2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <span style={{
                      width: 18, height: 18, borderRadius: '50%',
                      background: col + '25', color: col,
                      fontSize: 10, fontWeight: 800,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {STATUS_ICON[status]}
                    </span>
                    <span style={{ color: FG_DEFAULT, fontSize: 10, fontWeight: 700, lineHeight: 1.2 }}>{stage.label}</span>
                  </div>
                  {stage.duration && (
                    <div style={{ color: FGMUTE_DEFAULT, fontSize: 9, marginBottom: 2 }}>{stage.duration}</div>
                  )}
                  {stage.parallel && (
                    <div style={{ color: '#8b5cf6', fontSize: 8 }}>∥ paralelo</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* controls */}
        <div style={{ marginTop: 20, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={runSim}
            disabled={simRunning}
            style={{
              padding: '7px 18px', borderRadius: 8,
              background: simRunning ? LINE_DEFAULT : accentColor,
              border: 'none', color: '#fff',
              fontSize: 12, fontWeight: 700, cursor: simRunning ? 'not-allowed' : 'pointer',
              fontFamily: MONO,
            }}
          >
            {simRunning ? '⟳ Executando...' : '▶ Simular execução'}
          </button>
          {Object.keys(simStatuses).length > 0 && !simRunning && (
            <button
              onClick={resetSim}
              style={{
                padding: '7px 18px', borderRadius: 8,
                background: 'transparent', border: `1px solid ${LINE_DEFAULT}`,
                color: FGMUTE_DEFAULT, fontSize: 12, cursor: 'pointer', fontFamily: MONO,
              }}
            >
              ↺ Limpar
            </button>
          )}
        </div>
      </div>

      {/* stage detail */}
      {selectedStage && (
        <div style={{ background: bgColor, border: `1px solid ${LINE_DEFAULT}`, borderRadius: 12, padding: 20, marginTop: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
            <div>
              <div style={{ color: FG_DEFAULT, fontSize: 14, fontWeight: 800, marginBottom: 4 }}>{selectedStage.label}</div>
              {selectedStage.description && <div style={{ color: FGMUTE_DEFAULT, fontSize: 12, lineHeight: 1.4 }}>{selectedStage.description}</div>}
            </div>
            <button
              onClick={() => setSelectedStage(null)}
              style={{ background: 'transparent', border: 'none', color: FGMUTE_DEFAULT, cursor: 'pointer', fontSize: 16 }}
            >
              ✕
            </button>
          </div>

          {selectedStage.steps && selectedStage.steps.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {selectedStage.steps.map((step, i) => {
                const sStatus = step.status ?? 'pending'
                const sCol = STATUS_COLOR[sStatus]
                return (
                  <div key={i} style={{ background: cardColor, borderRadius: 8, padding: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: step.command || step.output ? 8 : 0 }}>
                      <span style={{ color: sCol, fontSize: 12 }}>{STATUS_ICON[sStatus]}</span>
                      <span style={{ color: FG_DEFAULT, fontSize: 12, fontWeight: 600 }}>{step.label}</span>
                    </div>
                    {step.command && (
                      <pre style={{ background: BG_DEFAULT, borderRadius: 6, padding: '6px 10px', margin: '0 0 6px', fontSize: 10, color: '#93c5fd', overflowX: 'auto' }}>
                        <code>$ {step.command}</code>
                      </pre>
                    )}
                    {step.output && (
                      <pre style={{ background: BG_DEFAULT, borderRadius: 6, padding: '6px 10px', margin: 0, fontSize: 9, color: '#86efac', overflowX: 'auto' }}>
                        <code>{step.output}</code>
                      </pre>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
