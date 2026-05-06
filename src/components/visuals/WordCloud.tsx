'use client'
import { useState, useMemo } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────────

export type WordItem = {
  text: string
  weight: number
  description?: string
  category?: string
  color?: string
}

interface WordCloudProps {
  words: WordItem[]
  accentColor?: string
  bgColor?: string
  title?: string
  description?: string
  colorMode?: 'accent' | 'category' | 'weight'
}

// ── Palette ──────────────────────────────────────────────────────────────────────

const BG_DEFAULT     = '#0f172a'
const CARD_DEFAULT   = '#1e293b'
const LINE_DEFAULT   = '#334155'
const FG_DEFAULT     = '#e2e8f0'
const FGMUTE_DEFAULT = '#94a3b8'
const MONO           = "'JetBrains Mono', monospace"

const CATEGORY_COLORS = [
  '#ef4444', '#3b82f6', '#10b981', '#f59e0b',
  '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
]

// ── Spiral placement ──────────────────────────────────────────────────────────────

function spiralPositions(count: number, W: number, H: number) {
  const positions: { x: number; y: number; angle: number }[] = []
  const cx = W / 2
  const cy = H / 2
  for (let i = 0; i < count; i++) {
    const t = i * 0.8
    const r = t * 14
    const angle = t * 2.4
    positions.push({
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r * 0.55,
      angle: (Math.random() - 0.5) * 30,
    })
  }
  return positions
}

// ── Component ────────────────────────────────────────────────────────────────────

export function WordCloud({
  words,
  accentColor = '#ef4444',
  bgColor = BG_DEFAULT,
  title,
  description,
  colorMode = 'weight',
}: WordCloudProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<{ word: WordItem; px: number; py: number } | null>(null)

  const categories = useMemo(
    () => Array.from(new Set(words.map(w => w.category).filter(Boolean))) as string[],
    [words],
  )

  const categoryColorMap = useMemo(() => {
    const map: Record<string, string> = {}
    categories.forEach((cat, i) => { map[cat] = CATEGORY_COLORS[i % CATEGORY_COLORS.length] })
    return map
  }, [categories])

  const visibleWords = activeCategory
    ? words.filter(w => w.category === activeCategory)
    : words

  const sorted = [...visibleWords].sort((a, b) => b.weight - a.weight)

  const W = 640
  const H = 380
  const positions = spiralPositions(sorted.length, W, H)

  const fontSize = (w: number) => 12 + (w - 1) * 4

  const wordColor = (word: WordItem) => {
    if (word.color) return word.color
    if (colorMode === 'accent') return accentColor
    if (colorMode === 'category' && word.category) return categoryColorMap[word.category] ?? accentColor
    // weight: interpolate from muted to accent
    const t = (word.weight - 1) / 9
    return `hsl(${Math.round(220 + t * 20)}, ${Math.round(30 + t * 70)}%, ${Math.round(45 + t * 30)}%)`
  }

  return (
    <div style={{ fontFamily: MONO }}>
      {(title || description) && (
        <div style={{ marginBottom: 16 }}>
          {title && <h3 style={{ color: FG_DEFAULT, fontSize: 20, fontWeight: 800, margin: '0 0 6px' }}>{title}</h3>}
          {description && <p style={{ color: FGMUTE_DEFAULT, fontSize: 12, margin: 0 }}>{description}</p>}
        </div>
      )}

      {categories.length > 1 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          <button
            onClick={() => setActiveCategory(null)}
            style={{
              padding: '4px 12px', borderRadius: 20, border: `1px solid ${LINE_DEFAULT}`,
              background: activeCategory === null ? accentColor : 'transparent',
              color: activeCategory === null ? '#fff' : FGMUTE_DEFAULT,
              fontSize: 11, cursor: 'pointer', fontFamily: MONO,
            }}
          >
            Todas
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
              style={{
                padding: '4px 12px', borderRadius: 20, border: `1px solid ${categoryColorMap[cat]}60`,
                background: activeCategory === cat ? categoryColorMap[cat] : 'transparent',
                color: activeCategory === cat ? '#fff' : categoryColorMap[cat],
                fontSize: 11, cursor: 'pointer', fontFamily: MONO,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div
        style={{ position: 'relative', background: bgColor, borderRadius: 14, border: `1px solid ${LINE_DEFAULT}`, overflow: 'hidden' }}
        onMouseLeave={() => setTooltip(null)}
      >
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
          {sorted.map((word, i) => {
            const pos = positions[i]
            const fs = fontSize(word.weight)
            const col = wordColor(word)
            return (
              <text
                key={word.text + i}
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={fs}
                fontWeight={word.weight >= 7 ? 800 : word.weight >= 4 ? 700 : 500}
                fill={col}
                style={{ cursor: word.description ? 'pointer' : 'default', transition: 'opacity .2s' }}
                transform={`rotate(${pos.angle}, ${pos.x}, ${pos.y})`}
                onMouseEnter={e => {
                  if (word.description) {
                    const rect = (e.target as SVGTextElement).closest('svg')!.getBoundingClientRect()
                    setTooltip({ word, px: e.clientX - rect.left, py: e.clientY - rect.top })
                  }
                }}
              >
                {word.text}
              </text>
            )
          })}
        </svg>

        {tooltip && (
          <div style={{
            position: 'absolute', left: Math.min(tooltip.px + 12, W - 230), top: tooltip.py - 8,
            background: CARD_DEFAULT, border: `1px solid ${LINE_DEFAULT}`,
            borderRadius: 8, padding: '8px 12px', maxWidth: 220, pointerEvents: 'none', zIndex: 10,
          }}>
            <div style={{ color: wordColor(tooltip.word), fontSize: 13, fontWeight: 800, marginBottom: 4 }}>{tooltip.word.text}</div>
            <div style={{ color: FGMUTE_DEFAULT, fontSize: 10, marginBottom: 6 }}>peso: {tooltip.word.weight}/10</div>
            <div style={{ color: FG_DEFAULT, fontSize: 11, lineHeight: 1.5 }}>{tooltip.word.description}</div>
          </div>
        )}
      </div>
    </div>
  )
}
