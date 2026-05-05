'use client'
import { useState } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────────

export type Feature = {
  tag: string
  name: string
  color: string
  before: string
  after: string
  desc: string
  /** Optional: label for "before" panel (default: "ANTES") */
  beforeLabel?: string
  /** Optional: label for "after" panel (default: "DEPOIS") */
  afterLabel?: string
}

interface FeaturesCarouselProps {
  features: Feature[]
  accentColor: string
  bgColor: string
  label?: string
  heading?: string
  description?: string
  /** Color used for the "before" panel border (default: '#f87171') */
  beforeColor?: string
}

// ── Paleta padrão ────────────────────────────────────────────────────────────────

const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const MONO   = "'JetBrains Mono', monospace"

// ── Main Component ────────────────────────────────────────────────────────────────

export function FeaturesCarousel({
  features,
  accentColor,
  bgColor,
  label,
  heading,
  description,
  beforeColor = '#f87171',
}: FeaturesCarouselProps) {
  const [selected, setSelected] = useState(0)
  const feat = features[selected]

  return (
    <div style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      {(label || heading || description) && (
        <div style={{ marginBottom: 20 }}>
          {label && (
            <div style={{ fontSize: 11, letterSpacing: '.15em', color: accentColor, textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>
              {label}
            </div>
          )}
          {heading && (
            <h3 style={{ color: FG, fontSize: 24, fontWeight: 800, margin: '0 0 6px', lineHeight: 1 }}>
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

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
        {features.map((f, i) => (
          <button
            key={f.name}
            onClick={() => setSelected(i)}
            style={{
              padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: selected === i ? 700 : 400,
              border: `1px solid ${selected === i ? f.color : LINE}`,
              background: selected === i ? `${f.color}18` : 'transparent',
              color: selected === i ? f.color : FGMUTE,
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s',
            }}
          >
            {f.name}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={{
          background: bgColor, border: `1px solid ${LINE}`, borderLeft: `3px solid ${beforeColor}`,
          borderRadius: 8, padding: 16,
        }}>
          <div style={{ fontSize: 9, color: beforeColor, fontWeight: 700, letterSpacing: '.12em', marginBottom: 10 }}>
            {feat.beforeLabel ?? 'ANTES'}
          </div>
          <pre style={{
            fontFamily: MONO, fontSize: 11.5,
            color: FGMUTE, lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all',
          }}>{feat.before}</pre>
        </div>
        <div style={{
          background: bgColor, border: `1px solid ${LINE}`, borderLeft: `3px solid ${feat.color}`,
          borderRadius: 8, padding: 16,
        }}>
          <div style={{ fontSize: 9, color: feat.color, fontWeight: 700, letterSpacing: '.12em', marginBottom: 10 }}>
            {feat.afterLabel ?? 'DEPOIS'}
          </div>
          <pre style={{
            fontFamily: MONO, fontSize: 11.5,
            color: FG, lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all',
          }}>{feat.after}</pre>
        </div>
      </div>

      <div style={{
        padding: '12px 16px', background: `${feat.color}10`,
        border: `1px solid ${feat.color}40`, borderRadius: 8,
        display: 'flex', alignItems: 'flex-start', gap: 12,
      }}>
        <div style={{
          fontSize: 9, fontWeight: 800, color: feat.color, letterSpacing: '.12em',
          background: `${feat.color}20`, padding: '3px 8px', borderRadius: 4, flexShrink: 0, marginTop: 2,
        }}>{feat.tag}</div>
        <p style={{ color: FGMUTE, fontSize: 13, lineHeight: 1.65, margin: 0 }}>{feat.desc}</p>
      </div>
    </div>
  )
}
