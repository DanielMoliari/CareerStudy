'use client'
import { useState } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────────

export type Slide = {
  title: string
  paragraphs: string[]
  gradient: [string, string]
  illustration: React.ReactNode
}

interface ConceptCarouselProps {
  slides: Slide[]
  accentColor: string
  bgColor: string
  cardColor: string
  /** Label shown above the title (e.g. "VISUAL 1 — CONCEITOS FUNDAMENTAIS") */
  label?: string
  /** Main heading */
  heading?: string
  /** Subtitle below heading */
  description?: string
}

// ── Component ────────────────────────────────────────────────────────────────────

const MONO = "'JetBrains Mono', monospace"

const BG_DEFAULT     = '#0f172a'
const CARD_DEFAULT   = '#1e293b'
const LINE_DEFAULT   = '#334155'
const MUTE_DEFAULT   = '#475569'
const FG_DEFAULT     = '#e2e8f0'
const FGMUTE_DEFAULT = '#94a3b8'

export function ConceptCarousel({
  slides,
  accentColor,
  bgColor = BG_DEFAULT,
  cardColor = CARD_DEFAULT,
  label,
  heading,
  description,
}: ConceptCarouselProps) {
  const [idx, setIdx] = useState(0)
  const slide = slides[idx]
  const next = () => setIdx(i => (i + 1) % slides.length)
  const prev = () => setIdx(i => (i - 1 + slides.length) % slides.length)

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
            <h3 style={{ color: FG_DEFAULT, fontSize: 26, fontWeight: 800, margin: '0 0 8px', lineHeight: 1 }}>
              {heading}
            </h3>
          )}
          {description && (
            <p style={{ color: FGMUTE_DEFAULT, fontSize: 13, margin: 0 }}>
              {description}
            </p>
          )}
        </div>
      )}

      <div style={{
        position: 'relative',
        height: 460,
        background: bgColor,
        border: `1px solid ${slide.gradient[0]}30`,
        borderRadius: 18,
        padding: 36,
        backgroundImage: `radial-gradient(ellipse at top right, ${slide.gradient[0]}10 0%, transparent 60%), radial-gradient(ellipse at bottom left, ${slide.gradient[1]}08 0%, transparent 60%)`,
        boxShadow: `0 0 50px ${slide.gradient[0]}15`,
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 24, right: 36,
          fontSize: 13, fontWeight: 700, color: MUTE_DEFAULT,
          letterSpacing: '.2em',
        }}>
          {String(idx + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36, height: '100%', alignItems: 'center' }}>
          <div>
            <h2 style={{
              fontSize: 30, fontWeight: 900, lineHeight: 1.1,
              margin: '0 0 22px',
              background: `linear-gradient(135deg, ${slide.gradient[0]}, ${slide.gradient[1]})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {slide.title}
            </h2>
            {slide.paragraphs.map((p, i) => (
              <p key={i} style={{
                color: FGMUTE_DEFAULT, fontSize: 12.5, lineHeight: 1.75,
                margin: '0 0 12px',
              }}>
                {p}
              </p>
            ))}
          </div>

          <div style={{
            background: `${cardColor}80`,
            borderRadius: 14, padding: 24,
            border: `1px solid ${LINE_DEFAULT}80`,
            backdropFilter: 'blur(8px)',
          }}>
            {slide.illustration}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
        <button onClick={prev} style={{
          width: 52, height: 52, borderRadius: '50%',
          border: `2px solid ${accentColor}50`, background: `${accentColor}15`,
          color: accentColor, fontSize: 22, fontWeight: 700,
          cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all .2s',
        }}>
          ◀
        </button>

        <div style={{ display: 'flex', gap: 8 }}>
          {slides.map((_, i) => (
            <button key={i}
              onClick={() => setIdx(i)}
              style={{
                width: i === idx ? 32 : 10, height: 10, borderRadius: 5,
                border: 'none', background: i === idx ? accentColor : LINE_DEFAULT,
                cursor: 'pointer', transition: 'all .3s',
                padding: 0,
              }}
            />
          ))}
        </div>

        <button onClick={next} style={{
          width: 52, height: 52, borderRadius: '50%',
          border: `2px solid ${accentColor}50`, background: `${accentColor}15`,
          color: accentColor, fontSize: 22, fontWeight: 700,
          cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all .2s',
        }}>
          ▶
        </button>
      </div>
    </div>
  )
}
