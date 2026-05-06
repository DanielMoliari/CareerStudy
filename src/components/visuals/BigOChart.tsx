'use client'
import { useState } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────────

export type ComplexityClass = {
  id: string
  label: string
  color: string
  description: string
  examples: string[]
  isHighlighted?: boolean
}

export type AlgorithmEntry = {
  id: string
  label: string
  category?: string
  timeComplexity: string
  spaceComplexity: string
  description?: string
  bestCase?: string
  worstCase?: string
  notes?: string
}

interface BigOChartProps {
  complexities: ComplexityClass[]
  algorithms?: AlgorithmEntry[]
  accentColor?: string
  bgColor?: string
  cardColor?: string
  title?: string
  description?: string
  nMax?: number
}

// ── Paleta ───────────────────────────────────────────────────────────────────────

const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const MONO   = "'JetBrains Mono', monospace"

// ── Funções de complexidade ───────────────────────────────────────────────────────

function computeY(classId: string, n: number): number {
  if (n <= 0) return 0
  switch (classId) {
    case 'O1'     : return 1
    case 'Ologn'  : return Math.log2(n)
    case 'On'     : return n
    case 'Onlogn' : return n * Math.log2(n)
    case 'On2'    : return n * n
    case 'O2n'    : return Math.pow(2, Math.min(n, 20))
    default       : return n
  }
}

// ── SVG chart ────────────────────────────────────────────────────────────────────

const CHART_W  = 500
const CHART_H  = 260
const PAD_L    = 40
const PAD_B    = 36
const PAD_T    = 16
const PAD_R    = 16

function BigOSvg({
  complexities,
  visible,
  hovered,
  nMax,
  onHover,
}: {
  complexities: ComplexityClass[]
  visible: Set<string>
  hovered: string | null
  nMax: number
  onHover: (id: string | null) => void
}) {
  const W = CHART_W - PAD_L - PAD_R
  const H = CHART_H - PAD_T - PAD_B

  // Calcula yMax para normalizar (excluindo exponencial)
  const safeMax = complexities
    .filter(c => c.id !== 'O2n')
    .reduce((m, c) => {
      const v = computeY(c.id, nMax)
      return v > m ? v : m
    }, 1)

  const toSvgX = (n: number) => PAD_L + (n / nMax) * W
  const toSvgY = (val: number) => PAD_T + H - Math.min((val / safeMax) * H, H)

  const buildPath = (classId: string): string => {
    const steps = 60
    const pts: string[] = []
    for (let i = 0; i <= steps; i++) {
      const n = (i / steps) * nMax
      const v = computeY(classId, n)
      const x = toSvgX(n)
      const y = toSvgY(v)
      pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`)
    }
    return pts.join(' ')
  }

  const ticks = [0, Math.round(nMax / 4), Math.round(nMax / 2), Math.round((3 * nMax) / 4), nMax]

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${CHART_W} ${CHART_H}`}
      style={{ display: 'block' }}
    >
      {/* Grid */}
      {ticks.map(t => (
        <g key={t}>
          <line
            x1={toSvgX(t)} y1={PAD_T}
            x2={toSvgX(t)} y2={PAD_T + H}
            stroke={LINE} strokeWidth={1} strokeDasharray="4 4"
          />
          <text
            x={toSvgX(t)} y={PAD_T + H + 16}
            textAnchor="middle"
            fill={FGMUTE} fontSize={9} fontFamily={MONO}
          >
            {t}
          </text>
        </g>
      ))}
      {[0, 0.25, 0.5, 0.75, 1].map(f => (
        <line
          key={f}
          x1={PAD_L} y1={PAD_T + H * (1 - f)}
          x2={PAD_L + W} y2={PAD_T + H * (1 - f)}
          stroke={LINE} strokeWidth={1} strokeDasharray="4 4"
        />
      ))}

      {/* Eixos */}
      <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={PAD_T + H} stroke={FG} strokeWidth={1.5} />
      <line x1={PAD_L} y1={PAD_T + H} x2={PAD_L + W} y2={PAD_T + H} stroke={FG} strokeWidth={1.5} />

      {/* Labels */}
      <text x={PAD_L + W / 2} y={CHART_H - 2} textAnchor="middle" fill={FGMUTE} fontSize={9} fontFamily={MONO}>n (entrada)</text>
      <text x={10} y={PAD_T + H / 2} textAnchor="middle" fill={FGMUTE} fontSize={9} fontFamily={MONO} transform={`rotate(-90,10,${PAD_T + H / 2})`}>operações</text>

      {/* Curvas */}
      {complexities.map(c => {
        if (!visible.has(c.id)) return null
        const isHov = hovered === c.id
        return (
          <path
            key={c.id}
            d={buildPath(c.id)}
            fill="none"
            stroke={c.color}
            strokeWidth={isHov ? 3 : 1.5}
            opacity={hovered === null || isHov ? 1 : 0.2}
            style={{ cursor: 'pointer', transition: 'opacity .2s, stroke-width .2s' }}
            onMouseEnter={() => onHover(c.id)}
            onMouseLeave={() => onHover(null)}
          />
        )
      })}

      {/* Labels de curva no final */}
      {complexities.map(c => {
        if (!visible.has(c.id)) return null
        const isHov = hovered === c.id || hovered === null
        const yVal = computeY(c.id, nMax)
        const svgY = Math.max(PAD_T + 8, Math.min(toSvgY(yVal), PAD_T + H - 6))
        return (
          <text
            key={c.id}
            x={PAD_L + W + 4}
            y={svgY}
            fill={c.color}
            fontSize={8}
            fontWeight={700}
            fontFamily={MONO}
            opacity={isHov ? 1 : 0.2}
            style={{ transition: 'opacity .2s' }}
          >
            {c.label}
          </text>
        )
      })}
    </svg>
  )
}

// ── Component principal ───────────────────────────────────────────────────────────

export function BigOChart({
  complexities,
  algorithms = [],
  accentColor = '#ef4444',
  bgColor = BG,
  cardColor = CARD,
  title,
  description,
  nMax = 20,
}: BigOChartProps) {
  const [visible, setVisible] = useState<Set<string>>(new Set(complexities.map(c => c.id)))
  const [hovered, setHovered] = useState<string | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [complexityFilter, setComplexityFilter] = useState<string | null>(null)
  const [selectedAlgo, setSelectedAlgo] = useState<string | null>(null)

  const toggleVisible = (id: string) => {
    setVisible(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const categories = Array.from(new Set(algorithms.map(a => a.category).filter(Boolean))) as string[]

  const filteredAlgos = algorithms.filter(a => {
    if (categoryFilter && a.category !== categoryFilter) return false
    if (complexityFilter && a.timeComplexity !== complexityFilter) return false
    return true
  })

  const selAlgo = algorithms.find(a => a.id === selectedAlgo)

  return (
    <div style={{ fontFamily: MONO, color: FG }}>
      {(title || description) && (
        <div style={{ marginBottom: 20 }}>
          {title && <h3 style={{ color: FG, fontSize: 22, fontWeight: 800, margin: '0 0 6px' }}>{title}</h3>}
          {description && <p style={{ color: FGMUTE, fontSize: 12, margin: 0, lineHeight: 1.6 }}>{description}</p>}
        </div>
      )}

      <div style={{ background: bgColor, border: `1px solid ${LINE}`, borderRadius: 14, padding: 20 }}>
        {/* Gráfico */}
        <div style={{ border: `1px solid ${LINE}`, borderRadius: 10, background: `${CARD}80`, padding: '8px 0', marginBottom: 16 }}>
          <BigOSvg
            complexities={complexities}
            visible={visible}
            hovered={hovered}
            nMax={nMax}
            onHover={setHovered}
          />
        </div>

        {/* Toggles de curva */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {complexities.map(c => {
            const isOn = visible.has(c.id)
            return (
              <button
                key={c.id}
                onClick={() => toggleVisible(c.id)}
                onMouseEnter={() => setHovered(c.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  padding: '4px 12px', borderRadius: 20, fontSize: 11, fontFamily: MONO,
                  border: `1.5px solid ${isOn ? c.color : LINE}`,
                  background: isOn ? `${c.color}20` : 'transparent',
                  color: isOn ? c.color : FGMUTE,
                  cursor: 'pointer', transition: 'all .2s',
                  fontWeight: isOn ? 700 : 400,
                }}
              >
                {c.label}
              </button>
            )
          })}
        </div>

        {/* Painel da curva em hover */}
        {hovered && (() => {
          const c = complexities.find(x => x.id === hovered)
          if (!c) return null
          const algosThisClass = algorithms.filter(a => a.timeComplexity === c.id)
          return (
            <div style={{
              background: `${c.color}10`, border: `1px solid ${c.color}40`,
              borderRadius: 10, padding: '12px 16px', marginBottom: 14,
              fontSize: 12,
            }}>
              <div style={{ color: c.color, fontWeight: 800, fontSize: 14, marginBottom: 4 }}>{c.label}</div>
              <div style={{ color: FGMUTE, lineHeight: 1.6, marginBottom: 8 }}>{c.description}</div>
              {algosThisClass.length > 0 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {algosThisClass.map(a => (
                    <span key={a.id} style={{
                      fontSize: 10, padding: '2px 8px', borderRadius: 4,
                      background: `${c.color}20`, color: c.color,
                    }}>{a.label}</span>
                  ))}
                </div>
              )}
            </div>
          )
        })()}

        {/* Tabela de algoritmos */}
        {algorithms.length > 0 && (
          <div>
            {/* Filtros */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12, alignItems: 'center' }}>
              <span style={{ color: FGMUTE, fontSize: 11 }}>Filtrar:</span>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(categoryFilter === cat ? null : cat)}
                  style={{
                    padding: '3px 10px', borderRadius: 6, fontSize: 10, fontFamily: MONO,
                    border: `1px solid ${categoryFilter === cat ? accentColor : LINE}`,
                    background: categoryFilter === cat ? `${accentColor}20` : 'transparent',
                    color: categoryFilter === cat ? accentColor : FGMUTE,
                    cursor: 'pointer',
                  }}
                >
                  {cat}
                </button>
              ))}
              {complexities.map(c => (
                <button
                  key={c.id}
                  onClick={() => setComplexityFilter(complexityFilter === c.id ? null : c.id)}
                  style={{
                    padding: '3px 10px', borderRadius: 6, fontSize: 10, fontFamily: MONO,
                    border: `1px solid ${complexityFilter === c.id ? c.color : LINE}`,
                    background: complexityFilter === c.id ? `${c.color}20` : 'transparent',
                    color: complexityFilter === c.id ? c.color : FGMUTE,
                    cursor: 'pointer',
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Tabela */}
            <div style={{ border: `1px solid ${LINE}`, borderRadius: 10, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                <thead>
                  <tr style={{ background: cardColor }}>
                    {['Algoritmo', 'Categoria', 'Tempo', 'Espaço', 'Melhor caso', 'Pior caso'].map(h => (
                      <th key={h} style={{
                        padding: '8px 12px', textAlign: 'left',
                        color: FGMUTE, fontWeight: 700, fontSize: 10,
                        borderBottom: `1px solid ${LINE}`,
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredAlgos.map((a, i) => {
                    const timeClass = complexities.find(c => c.id === a.timeComplexity)
                    const spaceClass = complexities.find(c => c.id === a.spaceComplexity)
                    const isSel = selectedAlgo === a.id
                    return (
                      <tr
                        key={a.id}
                        onClick={() => setSelectedAlgo(isSel ? null : a.id)}
                        style={{
                          background: isSel ? `${accentColor}10` : i % 2 === 0 ? 'transparent' : `${cardColor}60`,
                          cursor: 'pointer', transition: 'background .2s',
                          borderBottom: `1px solid ${LINE}40`,
                        }}
                      >
                        <td style={{ padding: '8px 12px', color: FG, fontWeight: isSel ? 700 : 400 }}>{a.label}</td>
                        <td style={{ padding: '8px 12px', color: FGMUTE }}>{a.category ?? '—'}</td>
                        <td style={{ padding: '8px 12px' }}>
                          <span style={{
                            color: timeClass?.color ?? accentColor, fontWeight: 700,
                            background: `${timeClass?.color ?? accentColor}15`,
                            padding: '2px 6px', borderRadius: 4,
                          }}>
                            {timeClass?.label ?? a.timeComplexity}
                          </span>
                        </td>
                        <td style={{ padding: '8px 12px' }}>
                          <span style={{
                            color: spaceClass?.color ?? FGMUTE,
                            background: `${spaceClass?.color ?? LINE}20`,
                            padding: '2px 6px', borderRadius: 4,
                          }}>
                            {spaceClass?.label ?? a.spaceComplexity}
                          </span>
                        </td>
                        <td style={{ padding: '8px 12px', color: FGMUTE }}>{a.bestCase ?? '—'}</td>
                        <td style={{ padding: '8px 12px', color: FGMUTE }}>{a.worstCase ?? '—'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Detalhe do algoritmo selecionado */}
            {selAlgo && (
              <div style={{
                marginTop: 12, background: cardColor, border: `1px solid ${LINE}`,
                borderRadius: 10, padding: '12px 16px', fontSize: 12,
              }}>
                <div style={{ color: accentColor, fontWeight: 700, marginBottom: 6 }}>{selAlgo.label}</div>
                {selAlgo.description && (
                  <p style={{ color: FGMUTE, margin: '0 0 8px', lineHeight: 1.6 }}>{selAlgo.description}</p>
                )}
                {selAlgo.notes && (
                  <p style={{ color: FG, margin: 0, lineHeight: 1.6, fontSize: 11 }}>{selAlgo.notes}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
