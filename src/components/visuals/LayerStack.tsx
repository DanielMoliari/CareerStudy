'use client'
import { useState } from 'react'

// ── Paleta padrão ─────────────────────────────────────────────────────────────

const BG_DEFAULT     = '#0f172a'
const CARD_DEFAULT   = '#1e293b'
const LINE_DEFAULT   = '#334155'
const FG_DEFAULT     = '#e2e8f0'
const FGMUTE_DEFAULT = '#94a3b8'
const MONO           = "'JetBrains Mono', monospace"

// ── Types ─────────────────────────────────────────────────────────────────────

export type Layer = {
  id: string
  label: string
  sublabel?: string
  description: string
  code?: string
  color: string
  icon?: string
  examples?: string[]
}

interface LayerStackProps {
  layers: Layer[]
  accentColor?: string
  bgColor?: string
  cardColor?: string
  title?: string
  description?: string
  direction?: 'bottom-up' | 'top-down'
}

// ── Componente ────────────────────────────────────────────────────────────────

export function LayerStack({
  layers,
  accentColor = '#ef4444',
  bgColor     = BG_DEFAULT,
  cardColor   = CARD_DEFAULT,
  title,
  description,
  direction = 'bottom-up',
}: LayerStackProps) {
  const [activeId, setActiveId] = useState<string | null>(null)

  // Reordena para renderização visual
  const ordered = direction === 'bottom-up' ? [...layers].reverse() : [...layers]
  const active  = layers.find(l => l.id === activeId) ?? null

  const SKEW    = -2
  const LAYER_H = 58

  return (
    <div style={{ fontFamily: MONO }}>
      {(title || description) && (
        <div style={{ marginBottom: 16 }}>
          {title && (
            <h3 style={{ color: FG_DEFAULT, fontSize: 18, fontWeight: 800, margin: '0 0 6px' }}>
              {title}
            </h3>
          )}
          {description && (
            <p style={{ color: FGMUTE_DEFAULT, fontSize: 12, margin: 0 }}>{description}</p>
          )}
        </div>
      )}

      <div style={{
        background: bgColor,
        border: `1px solid ${LINE_DEFAULT}`,
        borderRadius: 14,
        padding: 24,
        display: 'grid',
        gridTemplateColumns: active ? '1fr 1fr' : '1fr',
        gap: 24,
        alignItems: 'start',
        transition: 'grid-template-columns .3s',
      }}>
        {/* Pilha de camadas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {direction === 'top-down' && (
            <div style={{ fontSize: 10, color: FGMUTE_DEFAULT, letterSpacing: '.12em', marginBottom: 4, textTransform: 'uppercase' }}>
              Topo
            </div>
          )}
          {ordered.map((layer, i) => {
            const isActive = activeId === layer.id
            const depth    = direction === 'bottom-up' ? i : ordered.length - 1 - i
            return (
              <button
                key={layer.id}
                onClick={() => setActiveId(isActive ? null : layer.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: `0 20px`,
                  height: LAYER_H,
                  borderRadius: 8,
                  border: `1px solid ${isActive ? layer.color : layer.color + '50'}`,
                  background: isActive
                    ? `${layer.color}25`
                    : `${layer.color}10`,
                  cursor: 'pointer',
                  fontFamily: MONO,
                  transition: 'all .2s',
                  transform: `skewX(${SKEW}deg) translateX(${depth * 6}px)`,
                  position: 'relative',
                  overflow: 'hidden',
                  textAlign: 'left',
                  width: '100%',
                  boxShadow: isActive
                    ? `0 4px 20px ${layer.color}30`
                    : '0 2px 6px #00000030',
                }}
              >
                {/* Borda lateral colorida */}
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0,
                  width: 4, background: layer.color, borderRadius: '8px 0 0 8px',
                  opacity: isActive ? 1 : 0.5,
                  transition: 'opacity .2s',
                }} />

                {layer.icon && (
                  <span style={{
                    fontSize: 20,
                    transform: `skewX(${-SKEW}deg)`,
                    flexShrink: 0,
                  }}>
                    {layer.icon}
                  </span>
                )}

                <div style={{ transform: `skewX(${-SKEW}deg)`, flex: 1, minWidth: 0 }}>
                  <div style={{
                    color: isActive ? FG_DEFAULT : FGMUTE_DEFAULT,
                    fontSize: 13, fontWeight: 700,
                    transition: 'color .2s',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {layer.label}
                  </div>
                  {layer.sublabel && (
                    <div style={{ color: FGMUTE_DEFAULT, fontSize: 10, marginTop: 2 }}>
                      {layer.sublabel}
                    </div>
                  )}
                </div>

                <div style={{
                  transform: `skewX(${-SKEW}deg)`,
                  color: isActive ? layer.color : FGMUTE_DEFAULT + '80',
                  fontSize: 14,
                  transition: 'color .2s',
                  flexShrink: 0,
                }}>
                  {isActive ? '▼' : '▶'}
                </div>
              </button>
            )
          })}
          {direction === 'bottom-up' && (
            <div style={{ fontSize: 10, color: FGMUTE_DEFAULT, letterSpacing: '.12em', marginTop: 4, textTransform: 'uppercase' }}>
              Base
            </div>
          )}
        </div>

        {/* Painel lateral de detalhes */}
        {active && (
          <div style={{
            background: cardColor,
            border: `1px solid ${active.color}50`,
            borderRadius: 12,
            padding: 20,
            boxShadow: `0 0 24px ${active.color}20`,
            animation: 'ls-fadein .2s ease',
          }}>
            <style>{`@keyframes ls-fadein { from { opacity:0; transform:translateX(8px) } to { opacity:1; transform:translateX(0) } }`}</style>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              {active.icon && <span style={{ fontSize: 22 }}>{active.icon}</span>}
              <div>
                <div style={{ color: active.color, fontWeight: 800, fontSize: 14 }}>
                  {active.label}
                </div>
                {active.sublabel && (
                  <div style={{ color: FGMUTE_DEFAULT, fontSize: 10 }}>{active.sublabel}</div>
                )}
              </div>
            </div>

            <p style={{ color: FGMUTE_DEFAULT, fontSize: 12, lineHeight: 1.7, margin: '0 0 14px' }}>
              {active.description}
            </p>

            {active.examples && active.examples.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ color: FG_DEFAULT, fontSize: 11, fontWeight: 700, marginBottom: 6 }}>
                  Exemplos
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {active.examples.map((ex, i) => (
                    <span key={i} style={{
                      background: `${active.color}15`,
                      border: `1px solid ${active.color}40`,
                      color: active.color,
                      borderRadius: 6,
                      padding: '2px 8px',
                      fontSize: 11,
                    }}>
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {active.code && (
              <div>
                <div style={{ color: FG_DEFAULT, fontSize: 11, fontWeight: 700, marginBottom: 6 }}>
                  Código
                </div>
                <pre style={{
                  background: BG_DEFAULT,
                  border: `1px solid ${LINE_DEFAULT}`,
                  borderRadius: 8,
                  padding: '12px 14px',
                  fontSize: 11,
                  color: FG_DEFAULT,
                  overflowX: 'auto',
                  margin: 0,
                  lineHeight: 1.6,
                  fontFamily: MONO,
                }}>
                  <code>{active.code}</code>
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
