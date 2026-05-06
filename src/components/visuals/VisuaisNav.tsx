'use client'

// Paleta — duplicada intencionalmente (cada arquivo mantém sua própria cópia)
const LINE   = '#334155'
const MUTE   = '#475569'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'

export type VisualDef = {
  id: string
  title: string
  subtitle: string
  accent: string
  component: React.ReactNode
}

export interface VisuaisNavProps {
  visuals: VisualDef[]
  active: number
  onChange: (i: number) => void
  currentAccent: string
  currentSubtitle: string
}

export function VisuaisNav({ visuals, active, onChange }: VisuaisNavProps) {
  return (
    <div className="scrollbar-thin" style={{
      display: 'flex', gap: 2, marginBottom: 28,
      borderBottom: `1px solid ${LINE}`,
      overflowX: 'auto', paddingBottom: 0,
    }}>
      {visuals.map((v, i) => {
        const isActive = active === i
        return (
          <button key={v.id}
            onClick={() => onChange(i)}
            style={{
              padding: '10px 16px 11px',
              border: 'none',
              borderBottom: `2px solid ${isActive ? v.accent : 'transparent'}`,
              background: 'transparent',
              color: isActive ? FG : FGMUTE,
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 13,
              fontWeight: isActive ? 600 : 400,
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap' as const,
              transition: 'color .15s, border-color .15s',
              outline: 'none',
              flexShrink: 0,
            }}
          >
            <span style={{
              display: 'inline-block',
              width: 18, height: 18, lineHeight: '18px',
              textAlign: 'center' as const,
              fontSize: 10, fontWeight: 700,
              color: isActive ? v.accent : MUTE,
              marginRight: 8,
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            {v.title}
          </button>
        )
      })}
    </div>
  )
}
