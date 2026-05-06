'use client'
import { useState, useMemo } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────────

export type ScalingStrategy = {
  id: string
  label: string
  description: string
  instances: Array<{
    label: string
    cpu: number
    memory: number
    color?: string
  }>
  maxLoad: number
  cost?: string
  tradeoffs?: { pro: string; con: string }[]
}

interface ScalingSimulatorProps {
  strategies: ScalingStrategy[]
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

// ── Helpers ───────────────────────────────────────────────────────────────────────

function barColor(val: number) {
  if (val >= 85) return '#ef4444'
  if (val >= 60) return '#f59e0b'
  return '#22c55e'
}

function scaleInstance(
  inst: ScalingStrategy['instances'][number],
  load: number,
  maxLoad: number,
): { cpu: number; memory: number } {
  const factor = Math.min(load / Math.max(maxLoad, 1), 1)
  return {
    cpu:    Math.min(100, Math.round(inst.cpu * factor * 1.4)),
    memory: Math.min(100, Math.round(inst.memory * factor * 1.2)),
  }
}

// ── Bar component ─────────────────────────────────────────────────────────────────

function MiniBar({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ color: FGMUTE_DEFAULT, fontSize: 9 }}>{label}</span>
        <span style={{ color: barColor(value), fontSize: 9, fontWeight: 700 }}>{value}%</span>
      </div>
      <div style={{ height: 5, background: LINE_DEFAULT, borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${value}%`, background: barColor(value), borderRadius: 3, transition: 'width .4s, background .4s' }} />
      </div>
    </div>
  )
}

// ── Component ────────────────────────────────────────────────────────────────────

export function ScalingSimulator({
  strategies,
  accentColor = '#ef4444',
  bgColor = BG_DEFAULT,
  cardColor = CARD_DEFAULT,
  title,
  description,
}: ScalingSimulatorProps) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [load, setLoad] = useState(30)

  const strategy = strategies[activeIdx]

  const scaledInstances = useMemo(() => {
    const overloaded = load > strategy.maxLoad
    const extraCount = overloaded
      ? Math.ceil((load - strategy.maxLoad) / Math.max(strategy.maxLoad, 1))
      : 0
    const base = strategy.instances.map(inst => ({
      ...inst,
      ...scaleInstance(inst, load, strategy.maxLoad),
    }))
    const extra = Array.from({ length: extraCount }).map((_, i) => ({
      label: `+inst-${i + 1}`,
      cpu:    Math.round(20 + Math.random() * 30),
      memory: Math.round(20 + Math.random() * 25),
      color: '#22c55e',
      _new: true,
    }))
    return [...base, ...extra]
  }, [strategy, load])

  const loadColor = load >= 85 ? '#ef4444' : load >= 60 ? '#f59e0b' : '#22c55e'

  return (
    <div style={{ fontFamily: MONO }}>
      {(title || description) && (
        <div style={{ marginBottom: 16 }}>
          {title && <h3 style={{ color: FG_DEFAULT, fontSize: 20, fontWeight: 800, margin: '0 0 6px' }}>{title}</h3>}
          {description && <p style={{ color: FGMUTE_DEFAULT, fontSize: 12, margin: 0 }}>{description}</p>}
        </div>
      )}

      {/* tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${LINE_DEFAULT}`, marginBottom: 20 }}>
        {strategies.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setActiveIdx(i)}
            style={{
              padding: '8px 18px', border: 'none',
              borderBottom: activeIdx === i ? `2px solid ${accentColor}` : '2px solid transparent',
              background: 'transparent',
              color: activeIdx === i ? FG_DEFAULT : FGMUTE_DEFAULT,
              fontSize: 12, fontWeight: activeIdx === i ? 700 : 400,
              cursor: 'pointer', fontFamily: MONO,
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div style={{ background: bgColor, border: `1px solid ${LINE_DEFAULT}`, borderRadius: 14, padding: 20 }}>
        <p style={{ color: FGMUTE_DEFAULT, fontSize: 12, margin: '0 0 20px', lineHeight: 1.5 }}>{strategy.description}</p>

        {/* load slider */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ color: FG_DEFAULT, fontSize: 13, fontWeight: 700 }}>Carga do sistema</span>
            <span style={{ color: loadColor, fontSize: 18, fontWeight: 900 }}>{load}%</span>
          </div>
          <input
            type="range" min={0} max={100} value={load}
            onChange={e => setLoad(Number(e.target.value))}
            style={{ width: '100%', accentColor }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ color: FGMUTE_DEFAULT, fontSize: 9 }}>0%</span>
            <span style={{ color: FGMUTE_DEFAULT, fontSize: 9 }}>Limite: {strategy.maxLoad}%</span>
            <span style={{ color: FGMUTE_DEFAULT, fontSize: 9 }}>100%</span>
          </div>
        </div>

        {/* instances */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          {scaledInstances.map((inst, i) => {
            const isNew = '_new' in inst && inst._new
            const col = inst.color ?? accentColor
            return (
              <div
                key={i}
                style={{
                  background: cardColor,
                  border: `1px solid ${isNew ? '#22c55e' : LINE_DEFAULT}`,
                  borderRadius: 10, padding: 12, minWidth: 120, flex: '1 1 120px',
                  boxShadow: isNew ? '0 0 12px #22c55e30' : 'none',
                  transition: 'all .3s',
                  opacity: isNew ? 0.9 : 1,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: barColor(inst.cpu) }} />
                  <span style={{ color: isNew ? '#22c55e' : FG_DEFAULT, fontSize: 10, fontWeight: 700 }}>
                    {inst.label}{isNew ? ' (novo)' : ''}
                  </span>
                </div>
                <MiniBar label="CPU" value={inst.cpu} />
                <MiniBar label="RAM" value={inst.memory} />
              </div>
            )
          })}
        </div>

        {/* cost + tradeoffs */}
        <div style={{ display: 'grid', gridTemplateColumns: strategy.cost ? '1fr 1fr' : '1fr', gap: 16 }}>
          {strategy.cost && (
            <div style={{ background: cardColor, borderRadius: 8, padding: 12 }}>
              <div style={{ color: FGMUTE_DEFAULT, fontSize: 10, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.08em' }}>Custo estimado</div>
              <div style={{ color: '#22c55e', fontSize: 14, fontWeight: 800 }}>{strategy.cost}</div>
            </div>
          )}
          {strategy.tradeoffs && strategy.tradeoffs.length > 0 && (
            <div style={{ background: cardColor, borderRadius: 8, padding: 12 }}>
              <div style={{ color: FGMUTE_DEFAULT, fontSize: 10, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.08em' }}>Trade-offs</div>
              {strategy.tradeoffs.map((t, i) => (
                <div key={i} style={{ marginBottom: 4 }}>
                  <span style={{ color: '#22c55e', fontSize: 11 }}>✓ {t.pro}</span>
                  <br />
                  <span style={{ color: '#f87171', fontSize: 11 }}>✗ {t.con}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
