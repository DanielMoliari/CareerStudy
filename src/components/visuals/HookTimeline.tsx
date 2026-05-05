'use client'
import { useState } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────────

export type CodeToken = { text: string; color?: string }

export type TimelinePhase = {
  id: string
  emoji: string
  name: string
  color: string
  short: string
  detail: string
  code: CodeToken[][]
}

interface HookTimelineProps {
  phases: TimelinePhase[]
  accentColor: string
  bgColor: string
  /** Optional array of colors used for the timeline gradient bar. If omitted, phase colors are used. */
  gradientColors?: string[]
  label?: string
  heading?: string
  description?: string
  defaultActive?: string
}

// ── Paleta padrão ────────────────────────────────────────────────────────────────

const LINE   = '#334155'
const CARD2  = '#243044'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const MUTE   = '#475569'
const MONO   = "'JetBrains Mono', monospace"

// ── Main Component ────────────────────────────────────────────────────────────────

export function HookTimeline({
  phases,
  accentColor,
  bgColor,
  gradientColors,
  label,
  heading,
  description,
  defaultActive,
}: HookTimelineProps) {
  const [activeId, setActiveId] = useState<string | null>(defaultActive ?? (phases[0]?.id ?? null))
  const active = phases.find(s => s.id === activeId)

  const barColors = gradientColors ?? phases.map(p => p.color)
  const gradient = barColors.join(', ')

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
        position: 'relative', padding: '40px 0 60px',
        background: bgColor, borderRadius: 16, border: `1px solid ${LINE}`,
        backgroundImage: `radial-gradient(ellipse at center, ${accentColor}08 0%, transparent 70%)`,
        marginBottom: 24,
      }}>
        <div style={{
          position: 'absolute',
          left: '4%', right: '4%',
          top: '50%', height: 4,
          background: `linear-gradient(90deg, ${gradient})`,
          borderRadius: 2, transform: 'translateY(-2px)',
          boxShadow: `0 0 16px ${accentColor}40`,
        }} />

        <div style={{
          position: 'relative',
          display: 'flex', justifyContent: 'space-around',
          padding: '0 4%',
        }}>
          {phases.map((s) => {
            const isActive = activeId === s.id
            return (
              <div key={s.id}
                onClick={() => setActiveId(isActive ? null : s.id)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  cursor: 'pointer', position: 'relative',
                }}
              >
                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: isActive ? `${s.color}30` : CARD2,
                  border: `4px solid ${isActive ? s.color : `${s.color}70`}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 36,
                  transition: 'all .25s',
                  boxShadow: isActive ? `0 0 30px ${s.color}80` : `0 0 12px ${s.color}30`,
                  transform: isActive ? 'scale(1.1)' : 'scale(1)',
                  zIndex: 2,
                }}>
                  {s.emoji}
                </div>
                <div style={{
                  marginTop: 14, textAlign: 'center',
                  color: isActive ? s.color : FG,
                  fontSize: 14, fontWeight: 800,
                  transition: 'color .2s',
                }}>
                  {s.name}
                </div>
                <div style={{
                  marginTop: 4, fontSize: 10,
                  color: isActive ? s.color : FGMUTE,
                  textAlign: 'center', maxWidth: 90,
                }}>
                  {s.short}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {active ? (
        <div style={{
          background: `${active.color}10`, border: `2px solid ${active.color}50`,
          borderRadius: 14, padding: 24,
          boxShadow: `0 0 30px ${active.color}15`,
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <span style={{ fontSize: 38 }}>{active.emoji}</span>
              <div>
                <div style={{ color: active.color, fontSize: 22, fontWeight: 900, lineHeight: 1 }}>{active.name}</div>
                <div style={{ color: FGMUTE, fontSize: 12, marginTop: 4 }}>{active.short}</div>
              </div>
            </div>
            <p style={{ color: FG, fontSize: 13.5, lineHeight: 1.85, margin: 0 }}>{active.detail}</p>
          </div>

          <div style={{
            background: bgColor, border: `1px solid ${LINE}`, borderRadius: 10,
            padding: 18, fontSize: 12, lineHeight: 1.8,
            fontFamily: MONO,
            overflowX: 'auto',
          }}>
            <div style={{
              fontSize: 9, color: MUTE, letterSpacing: '.15em',
              marginBottom: 10, fontWeight: 700,
            }}>
              EXEMPLO DE CÓDIGO
            </div>
            {active.code.map((line, i) => (
              <div key={i} style={{ color: FG, whiteSpace: 'pre' }}>
                {line.map((tok, j) => (
                  <span key={j} style={{ color: tok.color || FG }}>{tok.text}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{
          background: CARD2, border: `1px dashed ${LINE}`,
          borderRadius: 14, padding: 24, textAlign: 'center',
        }}>
          <p style={{ color: MUTE, fontSize: 13, margin: 0 }}>
            Clique numa fase da timeline para ver explicação e código
          </p>
        </div>
      )}
    </div>
  )
}
