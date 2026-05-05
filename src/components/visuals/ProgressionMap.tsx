'use client'
import { useState } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────────

export type Concept = {
  name: string
  tip: string
}

export type ProgressionLevel = {
  id: string
  name: string
  label: string
  emoji: string
  concepts: Concept[]
}

interface ProgressionMapProps {
  levels: ProgressionLevel[]
  accentColor: string
  bgColor: string
  cardColor: string
  label?: string
  heading?: string
  description?: string
  knownLabel?: string
  hintText?: string
}

// ── Paleta padrão ────────────────────────────────────────────────────────────────

const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const MUTE   = '#475569'
const MONO   = "'JetBrains Mono', monospace"

// ── Main Component ────────────────────────────────────────────────────────────────

export function ProgressionMap({
  levels,
  accentColor,
  bgColor: _bg,
  cardColor,
  label,
  heading,
  description,
  knownLabel = 'VOCÊ DOMINA',
  hintText,
}: ProgressionMapProps) {
  const [known, setKnown] = useState<Set<string>>(new Set())
  const [tooltip, setTooltip] = useState<{ levelId: string; concept: string } | null>(null)

  const totalConcepts = levels.reduce((acc, l) => acc + l.concepts.length, 0)

  function toggle(key: string) {
    setKnown(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const BG_DARK = '#0f172a'

  return (
    <div style={{ fontFamily: MONO }}>
      {(label || heading || description) && (
        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
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

          <div style={{
            padding: '14px 22px', borderRadius: 12,
            background: `${accentColor}12`,
            border: `1px solid ${LINE}`,
            textAlign: 'center', minWidth: 200,
          }}>
            <div style={{ fontSize: 9, color: accentColor, fontWeight: 800, letterSpacing: '.15em', marginBottom: 4 }}>
              {knownLabel}
            </div>
            <div style={{ fontSize: 28, color: FG, fontWeight: 900, lineHeight: 1 }}>
              {known.size} <span style={{ fontSize: 16, color: FGMUTE }}>/ {totalConcepts}</span>
            </div>
            <div style={{
              marginTop: 8, height: 4, background: BG_DARK,
              borderRadius: 2, overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', width: `${(known.size / totalConcepts) * 100}%`,
                background: accentColor,
                transition: 'width .3s',
              }} />
            </div>
          </div>
        </div>
      )}

      <div style={{ position: 'relative', overflowX: 'auto', paddingBottom: 8 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${levels.length}, minmax(200px, 1fr))`,
          gap: 12, position: 'relative', zIndex: 1,
        }}>
          {levels.map((lvl) => {
            const knownInLevel = lvl.concepts.filter(c => known.has(`${lvl.id}.${c.name}`)).length
            const allKnown = knownInLevel === lvl.concepts.length

            return (
              <div key={lvl.id} style={{
                background: cardColor,
                border: `1px solid ${allKnown ? accentColor : LINE}`,
                borderTop: `2px solid ${allKnown ? accentColor : LINE}`,
                borderRadius: 10, padding: 16,
                paddingTop: 40,
                marginTop: 28,
                transition: 'border-color .3s',
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', top: -24, left: '50%',
                  transform: 'translateX(-50%)',
                  width: 44, height: 44, borderRadius: '50%',
                  background: cardColor,
                  border: `1px solid ${allKnown ? accentColor : LINE}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22,
                }}>
                  {lvl.emoji}
                </div>

                <div style={{ marginBottom: 14, textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{
                      fontSize: 9, fontWeight: 700, color: allKnown ? accentColor : MUTE,
                      fontFamily: MONO, letterSpacing: '.1em',
                    }}>{lvl.label}</span>
                  </div>
                  <div style={{ color: allKnown ? accentColor : FG, fontSize: 14, fontWeight: 700, lineHeight: 1 }}>
                    {lvl.name}
                  </div>
                  <div style={{ color: FGMUTE, fontSize: 10, marginTop: 4 }}>
                    {knownInLevel} / {lvl.concepts.length} dominados
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {lvl.concepts.map(c => {
                    const key = `${lvl.id}.${c.name}`
                    const isKnown = known.has(key)
                    const isHovered = tooltip?.levelId === lvl.id && tooltip?.concept === c.name

                    return (
                      <div key={c.name} style={{ position: 'relative' }}>
                        <button
                          onClick={() => toggle(key)}
                          onMouseEnter={() => setTooltip({ levelId: lvl.id, concept: c.name })}
                          onMouseLeave={() => setTooltip(null)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            width: '100%', textAlign: 'left',
                            padding: '7px 10px', borderRadius: 6,
                            border: `1px solid ${isKnown ? `${accentColor}60` : LINE}`,
                            background: isKnown ? `${accentColor}12` : 'transparent',
                            color: isKnown ? accentColor : FGMUTE,
                            fontSize: 11, fontWeight: isKnown ? 600 : 400,
                            cursor: 'pointer', fontFamily: 'inherit',
                            transition: 'all .15s',
                          }}
                        >
                          <span style={{
                            width: 12, height: 12, borderRadius: 3,
                            border: `1px solid ${isKnown ? accentColor : LINE}`,
                            background: isKnown ? accentColor : 'transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 8, color: BG_DARK, fontWeight: 900,
                            flexShrink: 0,
                          }}>
                            {isKnown ? '✓' : ''}
                          </span>
                          <span>{c.name}</span>
                        </button>

                        {isHovered && (
                          <div style={{
                            position: 'absolute', top: '100%', left: '50%',
                            transform: 'translateX(-50%)',
                            marginTop: 6, zIndex: 10,
                            background: cardColor, border: `1px solid ${LINE}`,
                            borderTop: `2px solid ${accentColor}`,
                            borderRadius: 8, padding: '8px 12px',
                            fontSize: 11, color: FGMUTE, lineHeight: 1.5,
                            width: 210,
                            boxShadow: '0 4px 16px rgba(0,0,0,.4)',
                            pointerEvents: 'none',
                          }}>
                            {c.tip}
                            <div style={{
                              position: 'absolute', top: -6, left: '50%',
                              transform: 'translateX(-50%) rotate(45deg)',
                              width: 10, height: 10,
                              background: cardColor,
                              borderTop: `1px solid ${LINE}`,
                              borderLeft: `1px solid ${LINE}`,
                            }} />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {hintText && (
        <div style={{
          marginTop: 20, padding: '12px 16px',
          background: `${accentColor}08`, border: `1px solid ${LINE}`,
          borderLeft: `2px solid ${accentColor}`,
          borderRadius: 6,
          display: 'flex', alignItems: 'flex-start', gap: 12,
        }}>
          <p style={{ color: FGMUTE, fontSize: 12, lineHeight: 1.7, margin: 0 }}>
            {hintText}
          </p>
        </div>
      )}
    </div>
  )
}
