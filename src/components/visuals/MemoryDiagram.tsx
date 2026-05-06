'use client'
import { useState } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────────

export type MemoryRegion = {
  id: string
  label: string
  color: string
  description: string
}

export type MemorySlot = {
  id: string
  regionId: string
  address?: string
  label: string
  value: string
  type?: string
  pointsTo?: string
  color?: string
  isActive?: boolean
}

export type MemoryScenario = {
  id: string
  label: string
  description: string
  slots: MemorySlot[]
  explanation?: string
}

interface MemoryDiagramProps {
  regions: MemoryRegion[]
  scenarios: MemoryScenario[]
  accentColor?: string
  bgColor?: string
  cardColor?: string
  title?: string
  description?: string
}

// ── Paleta ───────────────────────────────────────────────────────────────────────

const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const MONO   = "'JetBrains Mono', monospace"

// ── Helpers ───────────────────────────────────────────────────────────────────────

const SLOT_H   = 52
const SLOT_W   = 160
const REG_PAD  = 16
const REG_GAP  = 24

// ── Component ────────────────────────────────────────────────────────────────────

export function MemoryDiagram({
  regions,
  scenarios,
  accentColor = '#ef4444',
  bgColor = BG,
  cardColor = CARD,
  title,
  description,
}: MemoryDiagramProps) {
  const [scenarioIdx, setScenarioIdx] = useState(0)
  const [hovSlot, setHovSlot] = useState<string | null>(null)
  const [prevIdx, setPrevIdx] = useState<number | null>(null)
  const [animating, setAnimating] = useState(false)

  const scenario = scenarios[scenarioIdx]

  const changeScenario = (idx: number) => {
    if (idx === scenarioIdx) return
    setPrevIdx(scenarioIdx)
    setAnimating(true)
    setTimeout(() => {
      setScenarioIdx(idx)
      setAnimating(false)
      setPrevIdx(null)
    }, 350)
  }

  // Agrupa slots por região, na ordem das regiões
  const slotsByRegion = regions.map(r => ({
    region: r,
    slots: scenario.slots.filter(s => s.regionId === r.id),
  }))

  // Calcula posições dos slots para desenhar setas
  // Cada região tem posição X = REG_PAD + regionIdx * (SLOT_W + REG_GAP)
  const regionX = (regId: string) => {
    const idx = regions.findIndex(r => r.id === regId)
    return idx * (SLOT_W + REG_GAP) + REG_PAD
  }

  const slotY = (slot: MemorySlot) => {
    const regionSlots = scenario.slots.filter(s => s.regionId === slot.regionId)
    const idx = regionSlots.findIndex(s => s.id === slot.id)
    return idx * (SLOT_H + 8) + REG_PAD + 36 // 36 = header da região
  }

  const svgW = regions.length * (SLOT_W + REG_GAP) + REG_PAD * 2 - REG_GAP + 40
  const maxSlots = Math.max(...slotsByRegion.map(r => r.slots.length), 1)
  const svgH = maxSlots * (SLOT_H + 8) + REG_PAD * 2 + 36 + 20

  const hovSlotObj = scenario.slots.find(s => s.id === hovSlot)

  return (
    <div style={{ fontFamily: MONO, color: FG }}>
      {(title || description) && (
        <div style={{ marginBottom: 20 }}>
          {title && <h3 style={{ color: FG, fontSize: 22, fontWeight: 800, margin: '0 0 6px' }}>{title}</h3>}
          {description && <p style={{ color: FGMUTE, fontSize: 12, margin: 0, lineHeight: 1.6 }}>{description}</p>}
        </div>
      )}

      {/* Seletor de cenário */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {scenarios.map((sc, i) => (
          <button
            key={sc.id}
            onClick={() => changeScenario(i)}
            style={{
              padding: '5px 14px', borderRadius: 8, fontSize: 11, fontFamily: MONO,
              border: `1px solid ${i === scenarioIdx ? accentColor : LINE}`,
              background: i === scenarioIdx ? `${accentColor}20` : 'transparent',
              color: i === scenarioIdx ? accentColor : FGMUTE,
              cursor: 'pointer', transition: 'all .2s',
            }}
          >
            {sc.label}
          </button>
        ))}
      </div>

      <div style={{
        background: bgColor, border: `1px solid ${LINE}`, borderRadius: 14, padding: 20,
        opacity: animating ? 0.4 : 1, transition: 'opacity .35s',
      }}>
        {/* Diagrama SVG */}
        <div style={{ overflowX: 'auto' }}>
          <svg
            width={svgW}
            height={svgH}
            style={{ display: 'block', minWidth: svgW }}
          >
            {/* Regiões */}
            {slotsByRegion.map(({ region, slots }) => {
              const rx = regionX(region.id)
              const regionH = slots.length * (SLOT_H + 8) + REG_PAD * 2 + 36
              return (
                <g key={region.id}>
                  {/* Borda da região */}
                  <rect
                    x={rx} y={REG_PAD}
                    width={SLOT_W}
                    height={regionH}
                    rx={10}
                    fill={`${region.color}08`}
                    stroke={`${region.color}40`}
                    strokeWidth={1.5}
                  />
                  {/* Label da região */}
                  <text
                    x={rx + SLOT_W / 2} y={REG_PAD + 22}
                    textAnchor="middle"
                    fill={region.color}
                    fontSize={11}
                    fontWeight={800}
                    fontFamily={MONO}
                  >
                    {region.label}
                  </text>

                  {/* Slots */}
                  {slots.map((slot) => {
                    const sy = slotY(slot)
                    const isHov = hovSlot === slot.id
                    const isTarget = hovSlotObj?.pointsTo === slot.id
                    const slotCol = slot.color ?? region.color
                    return (
                      <g
                        key={slot.id}
                        onMouseEnter={() => setHovSlot(slot.id)}
                        onMouseLeave={() => setHovSlot(null)}
                        style={{ cursor: 'pointer' }}
                      >
                        <rect
                          x={rx + 8} y={sy}
                          width={SLOT_W - 16} height={SLOT_H}
                          rx={6}
                          fill={slot.isActive === false ? `${LINE}40` : `${slotCol}20`}
                          stroke={isHov || isTarget ? slotCol : `${slotCol}30`}
                          strokeWidth={isHov || isTarget ? 2 : 1}
                        />
                        {/* Endereço */}
                        {slot.address && (
                          <text
                            x={rx + 16} y={sy + 14}
                            fill={`${slotCol}80`}
                            fontSize={8}
                            fontFamily={MONO}
                          >
                            {slot.address}
                          </text>
                        )}
                        {/* Label */}
                        <text
                          x={rx + 16} y={sy + (slot.address ? 28 : 20)}
                          fill={FG} fontSize={10} fontWeight={700} fontFamily={MONO}
                        >
                          {slot.label}
                        </text>
                        {/* Valor */}
                        <text
                          x={rx + 16} y={sy + (slot.address ? 42 : 38)}
                          fill={slotCol} fontSize={11} fontWeight={900} fontFamily={MONO}
                        >
                          {slot.value}
                        </text>
                        {/* Indicador de slot inativo */}
                        {slot.isActive === false && (
                          <text
                            x={rx + SLOT_W - 20} y={sy + SLOT_H / 2 + 4}
                            textAnchor="middle"
                            fill={FGMUTE} fontSize={16}
                          >
                            ✗
                          </text>
                        )}
                      </g>
                    )
                  })}
                </g>
              )
            })}

            {/* Setas de ponteiro */}
            {scenario.slots.filter(s => s.pointsTo).map(slot => {
              const target = scenario.slots.find(s => s.id === slot.pointsTo)
              if (!target) return null
              const x1 = regionX(slot.regionId) + SLOT_W - 8
              const y1 = slotY(slot) + SLOT_H / 2
              const x2 = regionX(target.regionId) + 8
              const y2 = slotY(target) + SLOT_H / 2
              const isHov = hovSlot === slot.id || hovSlot === target.id
              const col = slot.color ?? regions.find(r => r.id === slot.regionId)?.color ?? accentColor
              return (
                <g key={`ptr-${slot.id}`}>
                  <defs>
                    <marker id={`arrow-${slot.id}`} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L8,3 z" fill={col} />
                    </marker>
                  </defs>
                  <path
                    d={`M${x1},${y1} C${x1 + 30},${y1} ${x2 - 30},${y2} ${x2},${y2}`}
                    fill="none"
                    stroke={col}
                    strokeWidth={isHov ? 2.5 : 1.5}
                    opacity={isHov ? 1 : 0.5}
                    strokeDasharray={isHov ? 'none' : '4 3'}
                    markerEnd={`url(#arrow-${slot.id})`}
                  />
                </g>
              )
            })}
          </svg>
        </div>

        {/* Descrição do cenário */}
        <div style={{
          marginTop: 16, background: cardColor, borderRadius: 10,
          padding: '12px 16px', fontSize: 12, border: `1px solid ${LINE}`,
        }}>
          <div style={{ color: accentColor, fontWeight: 700, marginBottom: 4 }}>{scenario.label}</div>
          <p style={{ color: FGMUTE, margin: 0, lineHeight: 1.6 }}>{scenario.description}</p>
          {scenario.explanation && (
            <p style={{ color: FG, margin: '8px 0 0', lineHeight: 1.6, fontSize: 11 }}>{scenario.explanation}</p>
          )}
        </div>

        {/* Tooltip do slot em hover */}
        {hovSlotObj && (
          <div style={{
            marginTop: 12, background: `${regions.find(r => r.id === hovSlotObj.regionId)?.color ?? accentColor}10`,
            border: `1px solid ${regions.find(r => r.id === hovSlotObj.regionId)?.color ?? accentColor}40`,
            borderRadius: 8, padding: '10px 14px', fontSize: 11,
          }}>
            <span style={{ color: FG, fontWeight: 700 }}>{hovSlotObj.label}</span>
            {hovSlotObj.type && <span style={{ color: FGMUTE, marginLeft: 8 }}>{hovSlotObj.type}</span>}
            {hovSlotObj.address && <span style={{ color: FGMUTE, marginLeft: 8 }}>{hovSlotObj.address}</span>}
            {hovSlotObj.pointsTo && (
              <span style={{ color: accentColor, marginLeft: 8 }}>
                → {scenario.slots.find(s => s.id === hovSlotObj.pointsTo)?.label ?? hovSlotObj.pointsTo}
              </span>
            )}
          </div>
        )}

        {/* Legenda de regiões */}
        <div style={{ display: 'flex', gap: 16, marginTop: 14, flexWrap: 'wrap' }}>
          {regions.map(r => (
            <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: r.color, opacity: 0.8 }} />
              <span style={{ color: FG, fontWeight: 700 }}>{r.label}</span>
              <span style={{ color: FGMUTE }}>— {r.description}</span>
            </div>
          ))}
        </div>

        {/* Indicador prevIdx para suprimir aviso de variável não usada */}
        {prevIdx !== null && <></>}
      </div>
    </div>
  )
}
