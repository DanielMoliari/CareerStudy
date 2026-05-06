'use client'
import { useState } from 'react'
import type { PdfCard, PdfType } from './types'

// Paleta — duplicada intencionalmente (cada arquivo mantém sua própria cópia)
const BG      = '#0f172a'
const BG_DEEP = '#0a1220'
const CARD    = '#1e293b'
const LINE    = '#334155'
const FG      = '#e2e8f0'
const FGMUTE  = '#94a3b8'

// ─── Document Preview Mockup ─────────────────────────────────────────────────────

export function PreviewMockup({ type, color, size = 'large' }: { type: PdfType; color: string; size?: 'large' | 'small' }) {
  void type
  const w = size === 'large' ? 220 : 130
  const h = size === 'large' ? 170 : 100
  const pad = size === 'large' ? 14 : 9
  const gap = size === 'large' ? 7 : 4
  const lineH = size === 'large' ? 5 : 3

  const rows: Array<{ w: string; o: number; h?: number }> = [
    { w: '38%',  o: 0.40, h: lineH + 2 },
    { w: '92%',  o: 0.25 },
    { w: '88%',  o: 0.15 },
    { w: '70%',  o: 0.15 },
    { w: '32%',  o: 0.40, h: lineH + 2 },
    { w: '85%',  o: 0.25 },
    { w: '78%',  o: 0.15 },
    { w: '60%',  o: 0.08 },
  ]

  return (
    <div style={{
      width: w, height: h,
      background: BG_DEEP,
      borderRadius: 6,
      border: `1px solid ${LINE}`,
      padding: pad,
      display: 'flex', flexDirection: 'column', gap,
      overflow: 'hidden',
    }}>
      {rows.map((r, i) => (
        <div
          key={i}
          style={{
            width: r.w,
            height: r.h ?? lineH,
            background: color,
            opacity: r.o,
            borderRadius: 1,
          }}
        />
      ))}
    </div>
  )
}

// ─── Featured Hero Card ─────────────────────────────────────────────────────────

export function HeroCard({ card, onOpen, accent = '#61DAFB' }: { card: PdfCard; onOpen: () => void; accent?: string }) {
  const [hover, setHover] = useState(false)

  // Versão ligeiramente mais escura do accent para hover
  const accentHover = accent

  return (
    <div
      onClick={onOpen}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        background: CARD,
        borderStyle: 'solid',
        borderWidth: '2px 1px 1px 1px',
        borderColor: `${accent} ${hover ? '#475569' : LINE} ${hover ? '#475569' : LINE} ${hover ? '#475569' : LINE}`,
        borderRadius: 8,
        padding: 28,
        cursor: 'pointer',
        transition: 'border-color .2s ease, transform .2s ease',
        overflow: 'hidden',
        minHeight: 220,
        display: 'flex',
        alignItems: 'stretch',
        gap: 28,
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      {/* Badge "DESTAQUE" */}
      <div style={{
        position: 'absolute', top: 14, right: 20,
        color: accent, fontSize: 9, fontFamily: "'JetBrains Mono',monospace",
        letterSpacing: 2, fontWeight: 700,
      }}>DESTAQUE</div>

      {/* Lado esquerdo: número grande + conteúdo */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 22, flex: 1, minWidth: 0 }}>
        {/* Número ordinal grande */}
        <div style={{
          fontSize: 40,
          color: accent,
          fontFamily: "'JetBrains Mono',monospace",
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: 1,
          flexShrink: 0,
          paddingTop: 4,
        }}>{card.icon}</div>

        {/* Conteúdo */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
          <div>
            <div style={{
              color: FG, fontSize: 22, fontWeight: 700,
              fontFamily: "'Space Grotesk',sans-serif",
              letterSpacing: 0.2,
              marginBottom: 6,
            }}>
              {card.title}
            </div>
            <div style={{
              color: FGMUTE, fontSize: 13,
              fontFamily: "'Space Grotesk',sans-serif",
              marginBottom: 14,
              lineHeight: 1.5,
            }}>{card.subtitle}</div>
            <p style={{
              color: FGMUTE, fontSize: 13, lineHeight: 1.65,
              margin: '0 0 18px',
              maxWidth: 480,
              fontFamily: "'Space Grotesk',sans-serif",
            }}>
              {card.description}
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{
                fontSize: 10, color: FGMUTE, background: BG,
                padding: '5px 10px', borderRadius: 4,
                border: `1px solid ${LINE}`,
                fontFamily: "'JetBrains Mono',monospace",
              }}>
                {card.pages} páginas
              </span>
              <span style={{
                fontSize: 10, color: FGMUTE, background: BG,
                padding: '5px 10px', borderRadius: 4,
                border: `1px solid ${LINE}`,
                fontFamily: "'JetBrains Mono',monospace",
              }}>
                {card.goal}
              </span>
              <span style={{
                fontSize: 10, color: FGMUTE, background: BG,
                padding: '5px 10px', borderRadius: 4,
                border: `1px solid ${LINE}`,
                fontFamily: "'JetBrains Mono',monospace",
              }}>
                Pleno · Sênior
              </span>
            </div>
          </div>
          <div style={{
            marginTop: 22,
            alignSelf: 'flex-start',
            padding: '10px 20px',
            borderRadius: 6,
            background: hover ? accentHover : accent,
            color: BG,
            fontSize: 13,
            fontFamily: "'Space Grotesk',sans-serif",
            fontWeight: 700,
            letterSpacing: 0.2,
            transition: 'opacity .2s',
            opacity: hover ? 0.85 : 1,
          }}>
            Abrir PDF →
          </div>
        </div>
      </div>

      {/* Lado direito: preview mockup */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <PreviewMockup type={card.type} color={accent} size="large" />
      </div>
    </div>
  )
}

// ─── Collection Card ────────────────────────────────────────────────────────────

export function CollectionCard({ card, onOpen, accent = '#61DAFB' }: { card: PdfCard; onOpen: () => void; accent?: string }) {
  const [hover, setHover] = useState(false)

  return (
    <div
      onClick={onOpen}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        background: CARD,
        borderStyle: 'solid',
        borderWidth: '2px 1px 1px 1px',
        borderColor: `${accent} ${hover ? '#475569' : LINE} ${hover ? '#475569' : LINE} ${hover ? '#475569' : LINE}`,
        borderRadius: 8,
        padding: 24,
        cursor: 'pointer',
        transition: 'border-color .2s ease, transform .2s ease',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'stretch',
        gap: 22,
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      {/* Lado esquerdo: número + conteúdo */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18, flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 36,
          color: accent,
          fontFamily: "'JetBrains Mono',monospace",
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: 1,
          flexShrink: 0,
          paddingTop: 3,
        }}>{card.icon}</div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
          <div>
            <div style={{
              color: FG, fontSize: 18, fontWeight: 700,
              fontFamily: "'Space Grotesk',sans-serif",
              letterSpacing: 0.2, marginBottom: 4,
            }}>{card.title}</div>
            <div style={{
              color: FGMUTE, fontSize: 12,
              fontFamily: "'Space Grotesk',sans-serif",
              marginBottom: 10, lineHeight: 1.4,
            }}>{card.subtitle}</div>
            <p style={{
              color: FGMUTE, fontSize: 12, lineHeight: 1.6,
              margin: '0 0 14px',
              fontFamily: "'Space Grotesk',sans-serif",
            }}>{card.description}</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span style={{
                fontSize: 10, color: FGMUTE, background: BG,
                padding: '4px 9px', borderRadius: 4,
                border: `1px solid ${LINE}`,
                fontFamily: "'JetBrains Mono',monospace",
              }}>{card.pages} páginas</span>
              <span style={{
                fontSize: 10, color: FGMUTE, background: BG,
                padding: '4px 9px', borderRadius: 4,
                border: `1px solid ${LINE}`,
                fontFamily: "'JetBrains Mono',monospace",
              }}>{card.goal}</span>
            </div>
          </div>
          <div style={{
            marginTop: 18, alignSelf: 'flex-start',
            padding: '9px 18px', borderRadius: 6,
            background: accent,
            color: BG, fontSize: 12,
            fontFamily: "'Space Grotesk',sans-serif",
            fontWeight: 700, letterSpacing: 0.2,
            transition: 'opacity .2s',
            opacity: hover ? 0.85 : 1,
          }}>
            Abrir PDF →
          </div>
        </div>
      </div>

      {/* Lado direito: preview mockup */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <PreviewMockup type={card.type} color={accent} size="large" />
      </div>
    </div>
  )
}
