'use client'
import { useState, useCallback } from 'react'

// ── Paleta padrão ────────────────────────────────────────────────────────────

const BG_DEFAULT     = '#0f172a'
const CARD_DEFAULT   = '#1e293b'
const LINE_DEFAULT   = '#334155'
const FG_DEFAULT     = '#e2e8f0'
const FGMUTE_DEFAULT = '#94a3b8'
const MONO           = "'JetBrains Mono', monospace"

// ── Tipos exportados ─────────────────────────────────────────────────────────

export type HeatCell = { value: number; note?: string }
export type HeatRowGroup = { label: string; rows: string[] }

// ── Props ────────────────────────────────────────────────────────────────────

interface HeatMapProps {
  rows: string[]
  cols: string[]
  data: HeatCell[][]          // data[rowIndex][colIndex]
  lowColor?: string            // default: '#1e3a5f' (dark blue)
  highColor?: string           // default: '#ef4444' (scarlet)
  accentColor: string
  bgColor: string
  title?: string
  description?: string
  highlighted?: { row: number; col: number }[]
  rowGroups?: HeatRowGroup[]
  valueFormatter?: (v: number) => string  // default: v.toFixed(1)
}

// ── Helpers de cor ───────────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '')
  const full = clean.length === 3
    ? clean.split('').map(c => c + c).join('')
    : clean
  const n = parseInt(full, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function interpolateColor(low: string, high: string, t: number): string {
  const [lr, lg, lb] = hexToRgb(low)
  const [hr, hg, hb] = hexToRgb(high)
  const r = Math.round(lr + (hr - lr) * t)
  const g = Math.round(lg + (hg - lg) * t)
  const b = Math.round(lb + (hb - lb) * t)
  return `rgb(${r},${g},${b})`
}

// Escolhe texto preto ou branco legível sobre a cor de fundo interpolada
function contrastText(low: string, high: string, t: number): string {
  const [r, g, b] = hexToRgb(low).map((lc, i) => {
    const hc = hexToRgb(high)[i]
    return Math.round(lc + (hc - lc) * t)
  }) as [number, number, number]
  // luminância relativa (fórmula WCAG)
  const lum = (x: number) => {
    const s = x / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }
  const L = 0.2126 * lum(r) + 0.7152 * lum(g) + 0.0722 * lum(b)
  return L > 0.3 ? '#0f172a' : '#e2e8f0'
}

// ── Componente ───────────────────────────────────────────────────────────────

export function HeatMap({
  rows,
  cols,
  data,
  lowColor  = '#1e3a5f',
  highColor = '#ef4444',
  accentColor,
  bgColor,
  title,
  description,
  highlighted = [],
  rowGroups,
  valueFormatter,
}: HeatMapProps) {
  const fmt = valueFormatter ?? ((v: number) => v.toFixed(1))

  // ── calcular min/max ───────────────────────────────────────────────────────

  let globalMin = Infinity
  let globalMax = -Infinity
  for (let ri = 0; ri < rows.length; ri++) {
    for (let ci = 0; ci < cols.length; ci++) {
      const v = data[ri]?.[ci]?.value
      if (v !== undefined) {
        if (v < globalMin) globalMin = v
        if (v > globalMax) globalMax = v
      }
    }
  }
  if (globalMin === globalMax) { globalMin -= 1; globalMax += 1 }
  const range = globalMax - globalMin

  const tValue = (v: number) => Math.max(0, Math.min(1, (v - globalMin) / range))

  // ── state ──────────────────────────────────────────────────────────────────

  type HoveredCell = { ri: number; ci: number; x: number; y: number } | null
  const [hovered, setHovered]     = useState<HoveredCell>(null)
  const [selected, setSelected]   = useState<{ ri: number; ci: number } | null>(null)

  const isHighlighted = useCallback(
    (ri: number, ci: number) => highlighted.some(h => h.row === ri && h.col === ci),
    [highlighted],
  )

  // ── layout de grupos ───────────────────────────────────────────────────────

  // Monta um mapa rowIndex → groupLabel
  const rowGroupLabel: Record<number, string | null> = {}
  const rowGroupStart: Record<number, boolean> = {}
  const rowGroupEnd:   Record<number, boolean> = {}

  if (rowGroups) {
    for (const group of rowGroups) {
      const indices = group.rows
        .map(r => rows.indexOf(r))
        .filter(i => i !== -1)
        .sort((a, b) => a - b)
      for (const idx of indices) {
        rowGroupLabel[idx] = group.label
      }
      if (indices.length) {
        rowGroupStart[indices[0]] = true
        rowGroupEnd[indices[indices.length - 1]] = true
      }
    }
  }

  // ── dimensões de células ───────────────────────────────────────────────────

  const CELL_H         = 36
  const CELL_W         = Math.max(48, Math.min(80, Math.floor(680 / cols.length)))
  const ROW_LABEL_W    = 140
  const GROUP_BADGE_W  = rowGroups ? 22 : 0
  const COL_LABEL_H    = cols.some(c => c.length > 6) ? 72 : 36

  // ── selected cell info ─────────────────────────────────────────────────────

  const selCell = selected
    ? {
        row:   rows[selected.ri],
        col:   cols[selected.ci],
        cell:  data[selected.ri]?.[selected.ci],
        t:     tValue(data[selected.ri]?.[selected.ci]?.value ?? globalMin),
      }
    : null

  return (
    <div style={{ fontFamily: MONO, color: FG_DEFAULT }}>

      {/* Título + descrição ──────────────────────────────────────────────── */}
      {(title || description) && (
        <div style={{ marginBottom: 20 }}>
          {title && (
            <h3 style={{ fontSize: 18, fontWeight: 800, color: FG_DEFAULT, margin: '0 0 6px' }}>
              {title}
            </h3>
          )}
          {description && (
            <p style={{ fontSize: 12, color: FGMUTE_DEFAULT, margin: 0, lineHeight: 1.6 }}>
              {description}
            </p>
          )}
        </div>
      )}

      {/* Wrapper externo ────────────────────────────────────────────────── */}
      <div style={{
        background: bgColor,
        border: `1px solid ${LINE_DEFAULT}`,
        borderRadius: 14,
        padding: '20px 20px 16px',
        overflowX: 'auto',
      }}>

        {/* Grid principal ─────────────────────────────────────────────── */}
        <div style={{ position: 'relative', display: 'inline-block', minWidth: '100%' }}>

          {/* Cabeçalho das colunas ───────────────────────────────────── */}
          <div style={{
            display: 'flex',
            marginLeft: ROW_LABEL_W + GROUP_BADGE_W,
            marginBottom: 2,
            height: COL_LABEL_H,
            alignItems: 'flex-end',
          }}>
            {cols.map((col, ci) => (
              <div
                key={ci}
                style={{
                  width: CELL_W,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  paddingBottom: 4,
                }}
              >
                <span style={{
                  fontSize: 10,
                  color: FGMUTE_DEFAULT,
                  fontWeight: 700,
                  letterSpacing: '.03em',
                  display: 'inline-block',
                  transformOrigin: 'bottom center',
                  transform: col.length > 6 ? 'rotate(-45deg) translateX(-4px)' : 'none',
                  whiteSpace: 'nowrap',
                  maxWidth: col.length > 6 ? 90 : undefined,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {col}
                </span>
              </div>
            ))}
          </div>

          {/* Linhas ──────────────────────────────────────────────────── */}
          {rows.map((row, ri) => {
            const groupLabel = rowGroupLabel[ri] ?? null
            const isGroupStart = rowGroupStart[ri] ?? false
            const isGroupEnd   = rowGroupEnd[ri]   ?? false

            return (
              <div
                key={ri}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: isGroupEnd && ri < rows.length - 1 ? 6 : 1,
                  borderTop: isGroupStart && ri > 0 ? `1px solid ${LINE_DEFAULT}40` : 'none',
                  paddingTop: isGroupStart && ri > 0 ? 6 : 0,
                }}
              >
                {/* Badge de grupo ────────────────────────────────────── */}
                {rowGroups && (
                  <div style={{
                    width: GROUP_BADGE_W,
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: CELL_H,
                    paddingRight: 2,
                  }}>
                    {isGroupStart && (
                      <div style={{
                        writingMode: 'vertical-rl',
                        transform: 'rotate(180deg)',
                        fontSize: 8,
                        color: accentColor,
                        fontWeight: 800,
                        letterSpacing: '.08em',
                        textTransform: 'uppercase',
                        whiteSpace: 'nowrap',
                        opacity: .85,
                      }}>
                        {groupLabel}
                      </div>
                    )}
                  </div>
                )}

                {/* Label da linha ─────────────────────────────────────── */}
                <div style={{
                  width: ROW_LABEL_W,
                  flexShrink: 0,
                  paddingRight: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  height: CELL_H,
                }}>
                  <span style={{
                    fontSize: 11,
                    color: FGMUTE_DEFAULT,
                    fontWeight: 600,
                    textAlign: 'right',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: ROW_LABEL_W - 10,
                  }}>
                    {row}
                  </span>
                </div>

                {/* Células ─────────────────────────────────────────────── */}
                {cols.map((_, ci) => {
                  const cell = data[ri]?.[ci]
                  const val  = cell?.value ?? globalMin
                  const t    = tValue(val)
                  const bg   = interpolateColor(lowColor, highColor, t)
                  const fg   = contrastText(lowColor, highColor, t)
                  const hl   = isHighlighted(ri, ci)
                  const isSel =
                    selected?.ri === ri && selected?.ci === ci
                  const isHov =
                    hovered?.ri === ri && hovered?.ci === ci

                  return (
                    <div
                      key={ci}
                      style={{
                        width: CELL_W,
                        height: CELL_H,
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: bg,
                        border: isSel
                          ? `2px solid ${accentColor}`
                          : hl
                            ? `2px solid #facc15`
                            : `1px solid ${LINE_DEFAULT}30`,
                        borderRadius: 4,
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'filter .12s, border .12s',
                        filter: isHov && !isSel ? 'brightness(1.25)' : 'none',
                        boxShadow: isSel ? `0 0 0 1px ${accentColor}` : hl ? '0 0 0 1px #facc15' : 'none',
                        margin: 1,
                      }}
                      onMouseEnter={e => {
                        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
                        setHovered({ ri, ci, x: rect.left, y: rect.top })
                      }}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => setSelected(isSel ? null : { ri, ci })}
                    >
                      {/* Valor na célula */}
                      <span style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: fg,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      }}>
                        {fmt(val)}
                      </span>

                      {/* Tooltip hover ──────────────────────────────── */}
                      {isHov && (
                        <div style={{
                          position: 'absolute',
                          bottom: '110%',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          zIndex: 30,
                          background: CARD_DEFAULT,
                          border: `1px solid ${LINE_DEFAULT}`,
                          borderRadius: 8,
                          padding: '8px 12px',
                          minWidth: 140,
                          maxWidth: 240,
                          boxShadow: '0 6px 24px rgba(0,0,0,.7)',
                          pointerEvents: 'none',
                        }}>
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
                            <div style={{
                              width: 10, height: 10, borderRadius: 2, flexShrink: 0,
                              background: bg, border: `1px solid ${LINE_DEFAULT}`,
                            }} />
                            <span style={{ fontSize: 11, color: FG_DEFAULT, fontWeight: 700 }}>
                              {fmt(val)}
                            </span>
                          </div>
                          <div style={{ fontSize: 10, color: FGMUTE_DEFAULT, marginBottom: 2 }}>
                            <span style={{ color: FG_DEFAULT }}>{row}</span>
                            {' × '}
                            <span style={{ color: FG_DEFAULT }}>{cols[ci]}</span>
                          </div>
                          {cell?.note && (
                            <div style={{
                              fontSize: 10, color: FGMUTE_DEFAULT, marginTop: 4,
                              lineHeight: 1.5, borderTop: `1px solid ${LINE_DEFAULT}40`,
                              paddingTop: 4,
                            }}>
                              {cell.note}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>

        {/* Legenda de gradiente ────────────────────────────────────── */}
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 10, color: FGMUTE_DEFAULT, fontWeight: 700, flexShrink: 0 }}>
            {fmt(globalMin)}
          </span>
          <div style={{
            flex: 1,
            height: 10,
            borderRadius: 5,
            background: `linear-gradient(to right, ${lowColor}, ${highColor})`,
            border: `1px solid ${LINE_DEFAULT}30`,
          }} />
          <span style={{ fontSize: 10, color: FGMUTE_DEFAULT, fontWeight: 700, flexShrink: 0 }}>
            {fmt(globalMax)}
          </span>
        </div>

        {/* Indicadores de destaque ─────────────────────────────────── */}
        {highlighted.length > 0 && (
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 12, height: 12, borderRadius: 2,
              border: '2px solid #facc15', flexShrink: 0,
            }} />
            <span style={{ fontSize: 10, color: FGMUTE_DEFAULT }}>Célula destacada</span>
          </div>
        )}

        {/* Painel de detalhe da célula selecionada ────────────────── */}
        {selCell && selCell.cell && (
          <div style={{
            marginTop: 16,
            background: CARD_DEFAULT,
            border: `1px solid ${LINE_DEFAULT}`,
            borderRadius: 10,
            padding: '14px 18px',
          }}>
            {/* Cabeçalho do painel */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: FG_DEFAULT, marginBottom: 2 }}>
                  {selCell.row}
                  <span style={{ color: FGMUTE_DEFAULT, fontWeight: 400, margin: '0 6px' }}>×</span>
                  {selCell.col}
                </div>
                <div style={{ fontSize: 11, color: FGMUTE_DEFAULT }}>
                  Valor:{' '}
                  <span style={{
                    fontWeight: 800,
                    color: interpolateColor(lowColor, highColor, selCell.t),
                  }}>
                    {fmt(selCell.cell.value)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                style={{
                  background: 'transparent',
                  border: `1px solid ${LINE_DEFAULT}`,
                  borderRadius: 6,
                  color: FGMUTE_DEFAULT,
                  fontSize: 11,
                  cursor: 'pointer',
                  padding: '3px 8px',
                  fontFamily: MONO,
                }}
              >
                ✕
              </button>
            </div>

            {/* Barra de posição no range */}
            <div style={{ marginBottom: selCell.cell.note ? 10 : 0 }}>
              <div style={{ fontSize: 10, color: FGMUTE_DEFAULT, marginBottom: 4 }}>
                Posição no intervalo [{fmt(globalMin)} → {fmt(globalMax)}]
              </div>
              <div style={{ position: 'relative', height: 14, borderRadius: 7, overflow: 'visible' }}>
                {/* trilho */}
                <div style={{
                  position: 'absolute', inset: 0,
                  borderRadius: 7,
                  background: `linear-gradient(to right, ${lowColor}, ${highColor})`,
                  opacity: .55,
                }} />
                {/* marcador */}
                <div style={{
                  position: 'absolute',
                  top: -3,
                  left: `clamp(0%, calc(${(selCell.t * 100).toFixed(1)}% - 4px), calc(100% - 8px))`,
                  width: 14,
                  height: 20,
                  borderRadius: 3,
                  background: interpolateColor(lowColor, highColor, selCell.t),
                  border: `2px solid ${FG_DEFAULT}`,
                  boxShadow: '0 2px 6px rgba(0,0,0,.6)',
                }} />
              </div>
            </div>

            {/* Nota opcional */}
            {selCell.cell.note && (
              <div style={{
                fontSize: 11, color: FGMUTE_DEFAULT, lineHeight: 1.7,
                borderTop: `1px solid ${LINE_DEFAULT}40`,
                paddingTop: 10,
              }}>
                {selCell.cell.note}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
