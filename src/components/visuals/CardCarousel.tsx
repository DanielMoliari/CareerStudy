'use client'
import { useState } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────────

export type CarouselCard = {
  name: string
  signature: string
  emoji: string
  color: string
  /** Bullet points for "when to use" */
  use: string[]
  /** Single string for "when NOT to use" */
  dontUse: string
  /** 1–3 difficulty level */
  difficulty?: 1 | 2 | 3
}

interface CardCarouselProps {
  cards: CarouselCard[]
  bgColor: string
  accentColor: string
  label?: string
  heading?: string
  description?: string
  useLabel?: string
  dontUseLabel?: string
  difficultyIcon?: string
}

// ── Paleta padrão ────────────────────────────────────────────────────────────────

const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const MUTE   = '#475569'
const GRN    = '#4ade80'
const RED    = '#ef4444'
const MONO   = "'JetBrains Mono', monospace"

// ── Main Component ────────────────────────────────────────────────────────────────

export function CardCarousel({
  cards,
  bgColor,
  accentColor,
  label,
  heading,
  description,
  useLabel = '✓ QUANDO USAR',
  dontUseLabel = '✗ QUANDO NÃO USAR',
  difficultyIcon = '🔥',
}: CardCarouselProps) {
  const [idx, setIdx] = useState(0)
  const card = cards[idx]
  const next = () => setIdx(i => (i + 1) % cards.length)
  const prev = () => setIdx(i => (i - 1 + cards.length) % cards.length)

  return (
    <div style={{ fontFamily: MONO }}>
      {(label || heading || description) && (
        <div style={{ marginBottom: 24 }}>
          {label && (
            <div style={{ fontSize: 11, letterSpacing: '.15em', color: accentColor, textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>
              {label}
            </div>
          )}
          {heading && (
            <h3 style={{ color: FG, fontSize: 26, fontWeight: 800, margin: '0 0 8px', lineHeight: 1 }}>
              {heading}
            </h3>
          )}
          {description && (
            <p style={{ color: FGMUTE, fontSize: 13, margin: 0 }}>
              {description}
            </p>
          )}
        </div>
      )}

      <div style={{
        display: 'flex', alignItems: 'center', gap: 18,
        justifyContent: 'center',
      }}>
        <button onClick={prev} style={{
          width: 52, height: 52, borderRadius: '50%',
          border: `2px solid ${card.color}50`, background: `${card.color}15`,
          color: card.color, fontSize: 22, fontWeight: 700,
          cursor: 'pointer', fontFamily: 'inherit',
          flexShrink: 0,
        }}>
          ◀
        </button>

        <div style={{
          width: 420, height: 360,
          background: `linear-gradient(160deg, ${card.color}18 0%, ${bgColor} 70%)`,
          border: `2px solid ${card.color}60`,
          borderRadius: 18, padding: 28,
          boxShadow: `0 0 40px ${card.color}25`,
          display: 'flex', flexDirection: 'column',
          position: 'relative',
          transition: 'all .3s',
        }}>
          {card.difficulty !== undefined && (
            <div style={{
              position: 'absolute', top: 18, right: 22,
              display: 'flex', gap: 4,
            }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} style={{
                  fontSize: 16,
                  opacity: i < (card.difficulty ?? 0) ? 1 : 0.2,
                  filter: i < (card.difficulty ?? 0) ? 'none' : 'grayscale(1)',
                }}>
                  {difficultyIcon}
                </span>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 60, lineHeight: 1 }}>{card.emoji}</div>
            <div>
              <div style={{ fontSize: 32, fontWeight: 900, color: card.color, lineHeight: 1, fontFamily: MONO }}>
                {card.name}
              </div>
            </div>
          </div>

          <div style={{
            background: bgColor, border: `1px solid ${LINE}`,
            borderRadius: 8, padding: '10px 14px',
            fontSize: 11.5, color: FG,
            fontFamily: MONO,
            marginBottom: 16,
            overflowX: 'auto',
            whiteSpace: 'nowrap',
          }}>
            {card.signature}
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 9, color: GRN, fontWeight: 800, letterSpacing: '.15em', marginBottom: 8 }}>
              {useLabel}
            </div>
            {card.use.map((u, i) => (
              <div key={i} style={{ color: FG, fontSize: 12, lineHeight: 1.6, paddingLeft: 4 }}>
                • {u}
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontSize: 9, color: RED, fontWeight: 800, letterSpacing: '.15em', marginBottom: 6 }}>
              {dontUseLabel}
            </div>
            <div style={{ color: '#fca5a5', fontSize: 12, lineHeight: 1.6, paddingLeft: 4 }}>
              • {card.dontUse}
            </div>
          </div>

          <div style={{
            position: 'absolute', bottom: 14, right: 22,
            fontSize: 11, color: MUTE, fontWeight: 700,
            letterSpacing: '.15em',
          }}>
            {String(idx + 1).padStart(2, '0')} / {String(cards.length).padStart(2, '0')}
          </div>
        </div>

        <button onClick={next} style={{
          width: 52, height: 52, borderRadius: '50%',
          border: `2px solid ${card.color}50`, background: `${card.color}15`,
          color: card.color, fontSize: 22, fontWeight: 700,
          cursor: 'pointer', fontFamily: 'inherit',
          flexShrink: 0,
        }}>
          ▶
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 24, flexWrap: 'wrap' }}>
        {cards.map((h, i) => (
          <button key={i}
            onClick={() => setIdx(i)}
            style={{
              padding: '6px 12px', fontSize: 11,
              border: `1.5px solid ${i === idx ? h.color : LINE}`,
              background: i === idx ? `${h.color}25` : 'transparent',
              color: i === idx ? h.color : FGMUTE,
              borderRadius: 6, cursor: 'pointer',
              fontFamily: 'inherit', fontWeight: 700,
              transition: 'all .15s',
            }}
          >
            {h.name}
          </button>
        ))}
      </div>
    </div>
  )
}
