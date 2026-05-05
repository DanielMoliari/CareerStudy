'use client'

// ── Types ────────────────────────────────────────────────────────────────────────

export type CodeLine = { text: string; color?: string }[]

export type AntiPattern = {
  title: string
  wrong: CodeLine[]
  right: CodeLine[]
  why: string
}

interface AntiPatternsGalleryProps {
  patterns: AntiPattern[]
  accentColor: string
  bgColor: string
  errorColor?: string
  successColor?: string
  warningColor?: string
  label?: string
  heading?: string
  description?: string
  wrongLabel?: string
  rightLabel?: string
  whyLabel?: string
}

// ── Paleta padrão ────────────────────────────────────────────────────────────────

const LINE   = '#334155'
const CARD2  = '#243044'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const AMB    = '#f59e0b'
const MONO   = "'JetBrains Mono', monospace"

// ── Internal helper ────────────────────────────────────────────────────────────────

function HighlightedCode({ code, bg, border }: { code: CodeLine[]; bg: string; border: string }) {
  return (
    <pre style={{
      background: bg, border: `1px solid ${border}`, borderRadius: 8,
      padding: 12, margin: 0, fontSize: 11, lineHeight: 1.7,
      fontFamily: MONO,
      color: FG, overflowX: 'auto', whiteSpace: 'pre',
    }}>
      {code.map((line, i) => (
        <div key={i}>
          {line.map((tok, j) => (
            <span key={j} style={{ color: tok.color || FG }}>{tok.text}</span>
          ))}
        </div>
      ))}
    </pre>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────────

export function AntiPatternsGallery({
  patterns,
  accentColor: _accent,
  bgColor,
  errorColor = '#ef4444',
  successColor = '#4ade80',
  warningColor = AMB,
  label,
  heading,
  description,
  wrongLabel = '✗ ERRADO',
  rightLabel = '✓ CERTO',
  whyLabel = 'POR QUE ISSO MATA PERFORMANCE?',
}: AntiPatternsGalleryProps) {
  return (
    <div style={{ fontFamily: MONO }}>
      {(label || heading || description) && (
        <div style={{ marginBottom: 24 }}>
          {label && (
            <div style={{ fontSize: 11, letterSpacing: '.15em', color: errorColor, textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 18 }}>
        {patterns.map((p, idx) => (
          <div key={idx} style={{
            background: CARD2, border: `1px solid ${LINE}`,
            borderRadius: 14, overflow: 'hidden',
          }}>
            <div style={{
              padding: '12px 18px',
              background: `linear-gradient(90deg, ${errorColor}30, ${errorColor}10)`,
              borderBottom: `1px solid ${errorColor}30`,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 18 }}>⚠️</span>
              <span style={{ color: '#fca5a5', fontSize: 13, fontWeight: 800, letterSpacing: '.02em' }}>
                {p.title}
              </span>
            </div>

            <div style={{ padding: 16 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                fontSize: 9, color: errorColor, fontWeight: 800,
                letterSpacing: '.15em', marginBottom: 8,
              }}>
                {wrongLabel}
              </div>
              <HighlightedCode code={p.wrong} bg={`${errorColor}09`} border={`${errorColor}30`} />

              <div style={{ textAlign: 'center', margin: '12px 0', color: successColor, fontSize: 18 }}>
                ↓
              </div>

              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                fontSize: 9, color: successColor, fontWeight: 800,
                letterSpacing: '.15em', marginBottom: 8,
              }}>
                {rightLabel}
              </div>
              <HighlightedCode code={p.right} bg={`${successColor}09`} border={`${successColor}30`} />

              <div style={{
                marginTop: 14, padding: '10px 14px',
                background: bgColor, border: `1px solid ${LINE}`,
                borderRadius: 8,
              }}>
                <div style={{
                  fontSize: 9, color: warningColor, fontWeight: 800,
                  letterSpacing: '.15em', marginBottom: 6,
                }}>
                  {whyLabel}
                </div>
                <p style={{ color: FGMUTE, fontSize: 11.5, lineHeight: 1.6, margin: 0 }}>
                  {p.why}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
