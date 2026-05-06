'use client'
import { useState } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────────

export type AttackVector = {
  id: string
  name: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  description: string
  attackPath: string[]
  mitigations: string[]
  cweId?: string
  owaspId?: string
  codeExample?: {
    vulnerable: string
    secure: string
  }
}

interface AttackVectorDiagramProps {
  vectors: AttackVector[]
  accentColor?: string
  bgColor?: string
  cardColor?: string
  title?: string
  description?: string
  targetSystem?: string
}

// ── Palette ──────────────────────────────────────────────────────────────────────

const BG_DEFAULT     = '#0f172a'
const CARD_DEFAULT   = '#1e293b'
const LINE_DEFAULT   = '#334155'
const FG_DEFAULT     = '#e2e8f0'
const FGMUTE_DEFAULT = '#94a3b8'
const MONO           = "'JetBrains Mono', monospace"

const SEVERITY_COLOR: Record<AttackVector['severity'], string> = {
  critical: '#ef4444',
  high:     '#f97316',
  medium:   '#eab308',
  low:      '#22c55e',
}

const SEVERITY_LABEL: Record<AttackVector['severity'], string> = {
  critical: 'Crítico',
  high:     'Alto',
  medium:   'Médio',
  low:      'Baixo',
}

// ── Component ────────────────────────────────────────────────────────────────────

export function AttackVectorDiagram({
  vectors,
  accentColor = '#ef4444',
  bgColor = BG_DEFAULT,
  cardColor = CARD_DEFAULT,
  title,
  description,
  targetSystem,
}: AttackVectorDiagramProps) {
  const [activeFilter, setActiveFilter] = useState<AttackVector['severity'] | null>(null)
  const [selected, setSelected] = useState<AttackVector | null>(null)
  const [codeTab, setCodeTab] = useState<'vulnerable' | 'secure'>('vulnerable')

  const filters: AttackVector['severity'][] = ['critical', 'high', 'medium', 'low']
  const visible = activeFilter ? vectors.filter(v => v.severity === activeFilter) : vectors

  return (
    <div style={{ fontFamily: MONO }}>
      {(title || description) && (
        <div style={{ marginBottom: 16 }}>
          {title && <h3 style={{ color: FG_DEFAULT, fontSize: 20, fontWeight: 800, margin: '0 0 6px' }}>{title}</h3>}
          {description && <p style={{ color: FGMUTE_DEFAULT, fontSize: 12, margin: 0 }}>{description}</p>}
        </div>
      )}

      {targetSystem && (
        <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 20, border: `1px solid ${accentColor}60`, color: accentColor, fontSize: 11, marginBottom: 12 }}>
          Alvo: {targetSystem}
        </div>
      )}

      {/* filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <button
          onClick={() => setActiveFilter(null)}
          style={{
            padding: '4px 12px', borderRadius: 20, border: `1px solid ${LINE_DEFAULT}`,
            background: activeFilter === null ? accentColor : 'transparent',
            color: activeFilter === null ? '#fff' : FGMUTE_DEFAULT,
            fontSize: 11, cursor: 'pointer', fontFamily: MONO,
          }}
        >
          Todos
        </button>
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(activeFilter === f ? null : f)}
            style={{
              padding: '4px 12px', borderRadius: 20,
              border: `1px solid ${SEVERITY_COLOR[f]}60`,
              background: activeFilter === f ? SEVERITY_COLOR[f] : 'transparent',
              color: activeFilter === f ? '#fff' : SEVERITY_COLOR[f],
              fontSize: 11, cursor: 'pointer', fontFamily: MONO,
            }}
          >
            {SEVERITY_LABEL[f]}
          </button>
        ))}
      </div>

      {/* cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12, marginBottom: selected ? 20 : 0 }}>
        {visible.map(v => {
          const col = SEVERITY_COLOR[v.severity]
          const isSelected = selected?.id === v.id
          return (
            <div
              key={v.id}
              onClick={() => setSelected(isSelected ? null : v)}
              style={{
                background: bgColor,
                border: `1px solid ${isSelected ? col : LINE_DEFAULT}`,
                borderRadius: 12,
                padding: 16,
                cursor: 'pointer',
                transition: 'border-color .2s',
                boxShadow: isSelected ? `0 0 16px ${col}30` : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
                <div style={{ color: FG_DEFAULT, fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>{v.name}</div>
                <span style={{
                  display: 'inline-block', padding: '2px 8px', borderRadius: 10,
                  background: col + '25', color: col, fontSize: 10, fontWeight: 700,
                  whiteSpace: 'nowrap', flexShrink: 0,
                }}>
                  {SEVERITY_LABEL[v.severity]}
                </span>
              </div>
              <p style={{ color: FGMUTE_DEFAULT, fontSize: 11, lineHeight: 1.5, margin: 0 }}>{v.description}</p>
              {(v.owaspId || v.cweId) && (
                <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                  {v.owaspId && (
                    <span style={{ background: cardColor, color: col, fontSize: 9, padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
                      {v.owaspId}
                    </span>
                  )}
                  {v.cweId && (
                    <span style={{ background: cardColor, color: FGMUTE_DEFAULT, fontSize: 9, padding: '2px 6px', borderRadius: 4 }}>
                      {v.cweId}
                    </span>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* expanded panel */}
      {selected && (
        <div style={{ background: bgColor, border: `1px solid ${SEVERITY_COLOR[selected.severity]}40`, borderRadius: 14, padding: 24, marginTop: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h4 style={{ color: FG_DEFAULT, fontSize: 16, fontWeight: 800, margin: 0 }}>{selected.name}</h4>
            <button
              onClick={() => setSelected(null)}
              style={{ background: 'transparent', border: 'none', color: FGMUTE_DEFAULT, cursor: 'pointer', fontSize: 18 }}
            >
              ✕
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {/* attack path */}
            <div>
              <div style={{ color: FGMUTE_DEFAULT, fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12 }}>Caminho do ataque</div>
              {selected.attackPath.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                    background: SEVERITY_COLOR[selected.severity] + '25',
                    border: `1px solid ${SEVERITY_COLOR[selected.severity]}`,
                    color: SEVERITY_COLOR[selected.severity],
                    fontSize: 9, fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ color: FG_DEFAULT, fontSize: 12, lineHeight: 1.4, paddingTop: 2 }}>{step}</div>
                </div>
              ))}
            </div>

            {/* mitigations */}
            <div>
              <div style={{ color: FGMUTE_DEFAULT, fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12 }}>Mitigações</div>
              {selected.mitigations.map((m, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
                  <span style={{ color: '#22c55e', fontSize: 14, flexShrink: 0, lineHeight: 1.4 }}>✓</span>
                  <div style={{ color: FG_DEFAULT, fontSize: 12, lineHeight: 1.4 }}>{m}</div>
                </div>
              ))}
            </div>
          </div>

          {/* code example */}
          {selected.codeExample && (
            <div style={{ marginTop: 20 }}>
              <div style={{ display: 'flex', gap: 0, marginBottom: 0, borderBottom: `1px solid ${LINE_DEFAULT}` }}>
                {(['vulnerable', 'secure'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setCodeTab(tab)}
                    style={{
                      padding: '6px 16px',
                      border: 'none',
                      borderBottom: codeTab === tab ? `2px solid ${tab === 'vulnerable' ? SEVERITY_COLOR.critical : '#22c55e'}` : '2px solid transparent',
                      background: 'transparent',
                      color: codeTab === tab ? FG_DEFAULT : FGMUTE_DEFAULT,
                      fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: MONO,
                    }}
                  >
                    {tab === 'vulnerable' ? '⚠ Vulnerável' : '✓ Seguro'}
                  </button>
                ))}
              </div>
              <pre style={{
                background: cardColor, borderRadius: '0 0 8px 8px',
                padding: 16, margin: 0, fontSize: 11, lineHeight: 1.6,
                color: codeTab === 'vulnerable' ? '#fca5a5' : '#86efac',
                overflowX: 'auto',
              }}>
                <code>{codeTab === 'vulnerable' ? selected.codeExample.vulnerable : selected.codeExample.secure}</code>
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
