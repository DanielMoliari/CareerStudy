'use client'
import { useState, useRef, useEffect } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────────

export type VersionMilestone = {
  id: string
  version: string
  year: string
  title: string
  description: string
  highlights: string[]
  breakingChanges?: string[]
  color?: string
  isLTS?: boolean
  isCurrent?: boolean
}

interface VersionTimelineProps {
  milestones: VersionMilestone[]
  techName: string
  accentColor?: string
  bgColor?: string
  cardColor?: string
  title?: string
  description?: string
}

// ── Paleta ───────────────────────────────────────────────────────────────────────

const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const MONO   = "'JetBrains Mono', monospace"
const LTS_COLOR     = '#22c55e'
const BREAKING_COLOR = '#ef4444'

// ── Component ────────────────────────────────────────────────────────────────────

export function VersionTimeline({
  milestones,
  techName,
  accentColor = '#ef4444',
  bgColor = BG,
  cardColor = CARD,
  title,
  description,
}: VersionTimelineProps) {
  const [selected, setSelected] = useState<string | null>(
    milestones.find(m => m.isCurrent)?.id ?? milestones[milestones.length - 1]?.id ?? null
  )
  const scrollRef = useRef<HTMLDivElement>(null)

  const selMilestone = milestones.find(m => m.id === selected)

  useEffect(() => {
    if (!scrollRef.current) return
    const el = scrollRef.current.querySelector<HTMLElement>('[data-selected="true"]')
    if (el) el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [selected])

  return (
    <div style={{ fontFamily: MONO, color: FG }}>
      {(title || description) && (
        <div style={{ marginBottom: 20 }}>
          {title && <h3 style={{ color: FG, fontSize: 22, fontWeight: 800, margin: '0 0 6px' }}>{title}</h3>}
          {description && <p style={{ color: FGMUTE, fontSize: 12, margin: 0, lineHeight: 1.6 }}>{description}</p>}
        </div>
      )}

      <div style={{ background: bgColor, border: `1px solid ${LINE}`, borderRadius: 14, overflow: 'hidden' }}>
        {/* Faixa de scroll horizontal */}
        <div
          ref={scrollRef}
          style={{
            overflowX: 'auto',
            padding: '32px 24px 20px',
            borderBottom: `1px solid ${LINE}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, minWidth: 'max-content', position: 'relative' }}>
            {/* Linha de base */}
            <div style={{
              position: 'absolute',
              top: '50%', left: 40, right: 40,
              height: 2, background: LINE,
              transform: 'translateY(-50%)',
              zIndex: 0,
            }} />

            {milestones.map((m, i) => {
              const col = m.isCurrent ? accentColor : m.isLTS ? LTS_COLOR : (m.color ?? FGMUTE)
              const isSel = selected === m.id
              return (
                <div
                  key={m.id}
                  data-selected={isSel}
                  onClick={() => setSelected(m.id)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    minWidth: 100, cursor: 'pointer', position: 'relative', zIndex: 1,
                    marginRight: i < milestones.length - 1 ? 0 : 0,
                  }}
                >
                  {/* Versão acima */}
                  <div style={{ fontSize: 10, fontWeight: 700, color: col, marginBottom: 8, textAlign: 'center' }}>
                    {m.version}
                  </div>

                  {/* Ponto */}
                  <div style={{
                    width: isSel ? 22 : 16,
                    height: isSel ? 22 : 16,
                    borderRadius: '50%',
                    background: isSel ? col : `${col}40`,
                    border: `3px solid ${col}`,
                    transition: 'all .25s',
                    boxShadow: isSel ? `0 0 16px ${col}80` : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {m.isCurrent && (
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />
                    )}
                  </div>

                  {/* Badges abaixo */}
                  <div style={{ display: 'flex', gap: 4, marginTop: 8, flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: 9, color: FGMUTE }}>{m.year}</span>
                    {m.isLTS && (
                      <span style={{
                        fontSize: 8, padding: '1px 5px', borderRadius: 3,
                        background: `${LTS_COLOR}20`, color: LTS_COLOR, fontWeight: 700,
                      }}>LTS</span>
                    )}
                    {m.isCurrent && (
                      <span style={{
                        fontSize: 8, padding: '1px 5px', borderRadius: 3,
                        background: `${accentColor}20`, color: accentColor, fontWeight: 700,
                      }}>ATUAL</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Painel de detalhes */}
        {selMilestone && (
          <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{
                  fontSize: 13, fontWeight: 900, color: FG,
                  background: `${selMilestone.isCurrent ? accentColor : selMilestone.isLTS ? LTS_COLOR : FGMUTE}20`,
                  border: `1px solid ${selMilestone.isCurrent ? accentColor : selMilestone.isLTS ? LTS_COLOR : LINE}`,
                  borderRadius: 6, padding: '3px 10px',
                }}>
                  {selMilestone.version}
                </span>
                <span style={{ color: FGMUTE, fontSize: 12 }}>{selMilestone.year}</span>
                {selMilestone.isLTS && (
                  <span style={{ fontSize: 10, color: LTS_COLOR, fontWeight: 700 }}>LTS</span>
                )}
                {selMilestone.isCurrent && (
                  <span style={{ fontSize: 10, color: accentColor, fontWeight: 700 }}>ATUAL</span>
                )}
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: FG, marginBottom: 8 }}>{selMilestone.title}</div>
              <p style={{ color: FGMUTE, fontSize: 12, lineHeight: 1.7, margin: 0 }}>{selMilestone.description}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Destaques */}
              <div>
                <div style={{ fontSize: 11, color: accentColor, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.1em' }}>
                  {techName} — Destaques
                </div>
                <ul style={{ margin: 0, padding: '0 0 0 16px' }}>
                  {selMilestone.highlights.map((h, i) => (
                    <li key={i} style={{ color: FGMUTE, fontSize: 12, lineHeight: 1.8 }}>{h}</li>
                  ))}
                </ul>
              </div>

              {/* Breaking changes */}
              {selMilestone.breakingChanges && selMilestone.breakingChanges.length > 0 && (
                <div>
                  <div style={{ fontSize: 11, color: BREAKING_COLOR, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.1em' }}>
                    Breaking Changes
                  </div>
                  <ul style={{ margin: 0, padding: '0 0 0 16px' }}>
                    {selMilestone.breakingChanges.map((bc, i) => (
                      <li key={i} style={{ color: FGMUTE, fontSize: 12, lineHeight: 1.8 }}>{bc}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Controles de navegação */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, padding: '12px 24px 16px', borderTop: `1px solid ${LINE}` }}>
          <button
            onClick={() => {
              const idx = milestones.findIndex(m => m.id === selected)
              if (idx > 0) setSelected(milestones[idx - 1].id)
            }}
            disabled={milestones[0]?.id === selected}
            style={{
              padding: '6px 16px', borderRadius: 8, fontSize: 11, fontFamily: MONO,
              border: `1px solid ${LINE}`, background: 'transparent', color: FGMUTE,
              cursor: milestones[0]?.id === selected ? 'not-allowed' : 'pointer',
              opacity: milestones[0]?.id === selected ? 0.4 : 1,
            }}
          >
            ◀ Anterior
          </button>
          <button
            onClick={() => {
              const idx = milestones.findIndex(m => m.id === selected)
              if (idx < milestones.length - 1) setSelected(milestones[idx + 1].id)
            }}
            disabled={milestones[milestones.length - 1]?.id === selected}
            style={{
              padding: '6px 16px', borderRadius: 8, fontSize: 11, fontFamily: MONO,
              border: `1px solid ${LINE}`, background: 'transparent', color: FGMUTE,
              cursor: milestones[milestones.length - 1]?.id === selected ? 'not-allowed' : 'pointer',
              opacity: milestones[milestones.length - 1]?.id === selected ? 0.4 : 1,
            }}
          >
            Próxima ▶
          </button>
        </div>
      </div>
    </div>
  )
}
