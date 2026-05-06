'use client'
import { useState } from 'react'

// ── Paleta padrão ────────────────────────────────────────────────────────────

const BG_DEFAULT     = '#0f172a'
const CARD_DEFAULT   = '#1e293b'
const LINE_DEFAULT   = '#334155'
const FG_DEFAULT     = '#e2e8f0'
const FGMUTE_DEFAULT = '#94a3b8'
const MONO           = "'JetBrains Mono', monospace"

// ── Tipos ────────────────────────────────────────────────────────────────────

export type ComparisonOption = {
  id: string
  label: string
  sublabel?: string
  color?: string
  icon?: string
}

export type ComparisonCriterion = {
  id: string
  label: string
  category?: string
  description?: string
  values: Record<string, {
    rating: 'excellent' | 'good' | 'fair' | 'poor' | 'na'
    note?: string
  }>
}

interface ComparisonTableProps {
  options: ComparisonOption[]
  criteria: ComparisonCriterion[]
  accentColor?: string
  bgColor?: string
  cardColor?: string
  title?: string
  description?: string
  highlightBest?: boolean
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const RATING_ORDER: Record<string, number> = {
  excellent: 4, good: 3, fair: 2, poor: 1, na: 0,
}

const RATING_COLOR: Record<string, string> = {
  excellent: '#22c55e',
  good:      '#84cc16',
  fair:      '#f59e0b',
  poor:      '#ef4444',
  na:        '#475569',
}

const RATING_LABEL: Record<string, string> = {
  excellent: 'Excelente',
  good:      'Bom',
  fair:      'Regular',
  poor:      'Fraco',
  na:        'N/A',
}

function RatingDots({ rating, size = 14 }: { rating: string; size?: number }) {
  const score = RATING_ORDER[rating] ?? 0
  const color = RATING_COLOR[rating] ?? FGMUTE_DEFAULT
  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
      {[1, 2, 3, 4].map(i => (
        <div
          key={i}
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            background: i <= score ? color : LINE_DEFAULT,
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  )
}

// ── Componente ───────────────────────────────────────────────────────────────

export function ComparisonTable({
  options,
  criteria,
  accentColor = '#ef4444',
  bgColor = BG_DEFAULT,
  cardColor = CARD_DEFAULT,
  title,
  description,
  highlightBest = false,
}: ComparisonTableProps) {
  const categories = Array.from(new Set(criteria.map(c => c.category ?? '').filter(Boolean)))
  const [activeCategory, setActiveCategory] = useState<string>('todas')
  const [highlight, setHighlight] = useState(highlightBest)
  const [hoveredCell, setHoveredCell] = useState<{ crit: string; opt: string } | null>(null)

  const filtered = activeCategory === 'todas'
    ? criteria
    : criteria.filter(c => c.category === activeCategory)

  function getBestOption(crit: ComparisonCriterion): string | null {
    let best: string | null = null
    let bestScore = -1
    for (const opt of options) {
      const score = RATING_ORDER[crit.values[opt.id]?.rating ?? 'na'] ?? 0
      if (score > bestScore) { bestScore = score; best = opt.id }
    }
    return best
  }

  const COL_W = `${Math.floor(60 / options.length)}%`

  return (
    <div style={{ fontFamily: MONO, color: FG_DEFAULT }}>
      {(title || description) && (
        <div style={{ marginBottom: 20 }}>
          {title && (
            <h3 style={{ fontSize: 18, fontWeight: 800, color: FG_DEFAULT, margin: '0 0 6px' }}>
              {title}
            </h3>
          )}
          {description && (
            <p style={{ fontSize: 12, color: FGMUTE_DEFAULT, margin: 0 }}>{description}</p>
          )}
        </div>
      )}

      {/* Barra de filtros */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
        {['todas', ...categories].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '4px 12px',
              borderRadius: 20,
              border: `1px solid ${activeCategory === cat ? accentColor : LINE_DEFAULT}`,
              background: activeCategory === cat ? `${accentColor}22` : 'transparent',
              color: activeCategory === cat ? accentColor : FGMUTE_DEFAULT,
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: MONO,
              textTransform: 'capitalize',
              letterSpacing: '.05em',
              transition: 'all .2s',
            }}
          >
            {cat === 'todas' ? 'Todas' : cat}
          </button>
        ))}
        {categories.length > 0 && (
          <button
            onClick={() => setHighlight(h => !h)}
            style={{
              marginLeft: 'auto',
              padding: '4px 12px',
              borderRadius: 20,
              border: `1px solid ${highlight ? accentColor : LINE_DEFAULT}`,
              background: highlight ? `${accentColor}22` : 'transparent',
              color: highlight ? accentColor : FGMUTE_DEFAULT,
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: MONO,
              transition: 'all .2s',
            }}
          >
            ★ Destacar melhor
          </button>
        )}
      </div>

      {/* Tabela */}
      <div style={{
        background: bgColor,
        border: `1px solid ${LINE_DEFAULT}`,
        borderRadius: 12,
        overflow: 'hidden',
      }}>
        {/* Cabeçalho */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `40% ${options.map(() => COL_W).join(' ')}`,
          background: cardColor,
          borderBottom: `1px solid ${LINE_DEFAULT}`,
        }}>
          <div style={{ padding: '12px 16px', fontSize: 11, color: FGMUTE_DEFAULT, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' }}>
            Critério
          </div>
          {options.map(opt => (
            <div
              key={opt.id}
              style={{
                padding: '12px 16px',
                borderLeft: `1px solid ${LINE_DEFAULT}`,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {opt.icon && (
                  <img
                    src={opt.icon}
                    alt=""
                    width={16}
                    height={16}
                    style={{ borderRadius: 3 }}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                  />
                )}
                <span style={{ fontSize: 13, fontWeight: 800, color: opt.color ?? FG_DEFAULT }}>
                  {opt.label}
                </span>
              </div>
              {opt.sublabel && (
                <span style={{ fontSize: 10, color: FGMUTE_DEFAULT }}>{opt.sublabel}</span>
              )}
            </div>
          ))}
        </div>

        {/* Linhas */}
        {filtered.map((crit, ri) => {
          const best = highlight ? getBestOption(crit) : null
          return (
            <div
              key={crit.id}
              style={{
                display: 'grid',
                gridTemplateColumns: `40% ${options.map(() => COL_W).join(' ')}`,
                borderBottom: ri < filtered.length - 1 ? `1px solid ${LINE_DEFAULT}40` : 'none',
                background: ri % 2 === 0 ? 'transparent' : `${cardColor}50`,
              }}
            >
              {/* Critério */}
              <div style={{ padding: '10px 16px' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: FG_DEFAULT }}>{crit.label}</div>
                {crit.category && (
                  <div style={{ fontSize: 10, color: accentColor, marginTop: 2, fontWeight: 600 }}>{crit.category}</div>
                )}
                {crit.description && (
                  <div style={{ fontSize: 10, color: FGMUTE_DEFAULT, marginTop: 3, lineHeight: 1.5 }}>{crit.description}</div>
                )}
              </div>

              {/* Valores */}
              {options.map(opt => {
                const val = crit.values[opt.id]
                const rating = val?.rating ?? 'na'
                const isBest = best === opt.id
                const isHovered = hoveredCell?.crit === crit.id && hoveredCell?.opt === opt.id
                return (
                  <div
                    key={opt.id}
                    onMouseEnter={() => setHoveredCell({ crit: crit.id, opt: opt.id })}
                    onMouseLeave={() => setHoveredCell(null)}
                    style={{
                      padding: '10px 16px',
                      borderLeft: `1px solid ${LINE_DEFAULT}40`,
                      background: isBest
                        ? `${opt.color ?? accentColor}15`
                        : isHovered
                          ? `${LINE_DEFAULT}40`
                          : 'transparent',
                      position: 'relative',
                      transition: 'background .15s',
                      cursor: val?.note ? 'help' : 'default',
                    }}
                  >
                    <RatingDots rating={rating} />
                    <div style={{ fontSize: 9, color: RATING_COLOR[rating], marginTop: 3, fontWeight: 700 }}>
                      {RATING_LABEL[rating]}
                    </div>
                    {isBest && (
                      <div style={{
                        position: 'absolute', top: 6, right: 6,
                        fontSize: 10, color: opt.color ?? accentColor,
                        fontWeight: 800,
                      }}>★</div>
                    )}
                    {isHovered && val?.note && (
                      <div style={{
                        position: 'absolute',
                        top: '110%',
                        left: 0,
                        zIndex: 10,
                        background: cardColor,
                        border: `1px solid ${LINE_DEFAULT}`,
                        borderRadius: 8,
                        padding: '8px 12px',
                        fontSize: 11,
                        color: FGMUTE_DEFAULT,
                        whiteSpace: 'normal' as 'normal',
                        maxWidth: 220,
                        boxShadow: '0 4px 20px rgba(0,0,0,.5)',
                      }}>
                        {val.note}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* Legenda */}
      <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
        {(['excellent', 'good', 'fair', 'poor', 'na'] as const).map(r => (
          <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <RatingDots rating={r} size={10} />
            <span style={{ fontSize: 10, color: FGMUTE_DEFAULT }}>{RATING_LABEL[r]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
