'use client'
import { useState } from 'react'

// ── Paleta padrão ────────────────────────────────────────────────────────────

const BG_DEFAULT     = '#0f172a'
const CARD_DEFAULT   = '#1e293b'
const LINE_DEFAULT   = '#334155'
const FG_DEFAULT     = '#e2e8f0'
const FGMUTE_DEFAULT = '#94a3b8'
const MONO           = "'JetBrains Mono', monospace"

const PRO_COLOR  = '#22c55e'
const CON_COLOR  = '#ef4444'

// ── Tipos ────────────────────────────────────────────────────────────────────

export type ProConItem = {
  text: string
  weight?: 'high' | 'medium' | 'low'
  context?: string[]
}

export type ProConOption = {
  id: string
  label: string
  sublabel?: string
  color: string
  icon?: string
  pros: ProConItem[]
  cons: ProConItem[]
  bestFor?: string[]
  avoidWhen?: string[]
}

interface ProConMatrixProps {
  options: ProConOption[]
  contexts?: string[]
  accentColor?: string
  bgColor?: string
  cardColor?: string
  title?: string
  description?: string
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const WEIGHT_ICON: Record<string, string> = {
  high:   '●●●',
  medium: '●●○',
  low:    '●○○',
}

const WEIGHT_COLOR: Record<string, string> = {
  high:   '#fbbf24',
  medium: '#94a3b8',
  low:    '#475569',
}

function WeightBadge({ weight }: { weight?: string }) {
  if (!weight) return null
  return (
    <span
      title={`Importância: ${weight === 'high' ? 'alta' : weight === 'medium' ? 'média' : 'baixa'}`}
      style={{
        fontSize: 8,
        fontWeight: 800,
        color: WEIGHT_COLOR[weight] ?? FGMUTE_DEFAULT,
        letterSpacing: '.05em',
        flexShrink: 0,
      }}
    >
      {WEIGHT_ICON[weight]}
    </span>
  )
}

function ItemList({
  items,
  kind,
  activeContext,
}: {
  items: ProConItem[]
  kind: 'pro' | 'con'
  activeContext: string
}) {
  const color = kind === 'pro' ? PRO_COLOR : CON_COLOR

  const filtered = activeContext === 'todos'
    ? items
    : items.filter(it =>
        !it.context || it.context.length === 0 || it.context.includes(activeContext)
      )

  if (filtered.length === 0) {
    return (
      <p style={{ fontSize: 11, color: FGMUTE_DEFAULT, fontStyle: 'italic', margin: 0 }}>
        Nenhum item para este contexto.
      </p>
    )
  }

  return (
    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
      {filtered.map((item, i) => (
        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
          <span style={{ fontSize: 10, color, flexShrink: 0, marginTop: 2, fontWeight: 800 }}>
            {kind === 'pro' ? '✓' : '✗'}
          </span>
          <span style={{ fontSize: 12, color: FG_DEFAULT, lineHeight: 1.5, flex: 1 }}>{item.text}</span>
          <WeightBadge weight={item.weight} />
        </li>
      ))}
    </ul>
  )
}

// ── Componente ───────────────────────────────────────────────────────────────

export function ProConMatrix({
  options,
  contexts = [],
  accentColor = '#ef4444',
  bgColor = BG_DEFAULT,
  cardColor = CARD_DEFAULT,
  title,
  description,
}: ProConMatrixProps) {
  const [activeContext, setActiveContext] = useState('todos')

  const allContexts = contexts.length > 0
    ? contexts
    : Array.from(
        new Set(
          [...options.flatMap(o => [...o.pros, ...o.cons])].flatMap(it => it.context ?? [])
        )
      )

  return (
    <div style={{ fontFamily: MONO, color: FG_DEFAULT }}>
      {(title || description) && (
        <div style={{ marginBottom: 20 }}>
          {title && (
            <h3 style={{ fontSize: 18, fontWeight: 800, color: FG_DEFAULT, margin: '0 0 6px' }}>
              {title}
            </h3>
          )}
          {description && (
            <p style={{ fontSize: 12, color: FGMUTE_DEFAULT, margin: 0 }}>{description}</p>
          )}
        </div>
      )}

      {/* Filtro de contexto */}
      {allContexts.length > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
          <span style={{ fontSize: 10, color: FGMUTE_DEFAULT, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', alignSelf: 'center' }}>
            Contexto:
          </span>
          {['todos', ...allContexts].map(ctx => (
            <button
              key={ctx}
              onClick={() => setActiveContext(ctx)}
              style={{
                padding: '4px 12px',
                borderRadius: 20,
                border: `1px solid ${activeContext === ctx ? accentColor : LINE_DEFAULT}`,
                background: activeContext === ctx ? `${accentColor}22` : 'transparent',
                color: activeContext === ctx ? accentColor : FGMUTE_DEFAULT,
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: MONO,
                textTransform: 'capitalize',
                transition: 'all .2s',
              }}
            >
              {ctx === 'todos' ? 'Todos' : ctx}
            </button>
          ))}
        </div>
      )}

      {/* Grid de cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.min(options.length, 3)}, 1fr)`,
        gap: 16,
      }}>
        {options.map(opt => (
          <div
            key={opt.id}
            style={{
              background: bgColor,
              border: `1px solid ${opt.color}30`,
              borderRadius: 14,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: `0 0 30px ${opt.color}10`,
            }}
          >
            {/* Cabeçalho do card */}
            <div style={{
              padding: '14px 16px',
              background: `${opt.color}15`,
              borderBottom: `1px solid ${opt.color}25`,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}>
              {opt.icon && (
                <img
                  src={opt.icon}
                  alt=""
                  width={20}
                  height={20}
                  style={{ borderRadius: 4 }}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                />
              )}
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: opt.color }}>{opt.label}</div>
                {opt.sublabel && (
                  <div style={{ fontSize: 10, color: FGMUTE_DEFAULT }}>{opt.sublabel}</div>
                )}
              </div>
            </div>

            {/* Corpo do card */}
            <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Prós */}
              <div>
                <div style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: PRO_COLOR,
                  letterSpacing: '.1em',
                  textTransform: 'uppercase',
                  marginBottom: 8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}>
                  <span style={{ fontSize: 12 }}>↑</span> Pontos positivos
                </div>
                <ItemList items={opt.pros} kind="pro" activeContext={activeContext} />
              </div>

              {/* Separador */}
              <div style={{ height: 1, background: LINE_DEFAULT }} />

              {/* Contras */}
              <div>
                <div style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: CON_COLOR,
                  letterSpacing: '.1em',
                  textTransform: 'uppercase',
                  marginBottom: 8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}>
                  <span style={{ fontSize: 12 }}>↓</span> Pontos negativos
                </div>
                <ItemList items={opt.cons} kind="con" activeContext={activeContext} />
              </div>
            </div>

            {/* Rodapé */}
            {((opt.bestFor && opt.bestFor.length > 0) || (opt.avoidWhen && opt.avoidWhen.length > 0)) && (
              <div style={{
                borderTop: `1px solid ${LINE_DEFAULT}`,
                padding: '12px 16px',
                background: cardColor,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}>
                {opt.bestFor && opt.bestFor.length > 0 && (
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 800, color: PRO_COLOR, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 4 }}>
                      Ideal para
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {opt.bestFor.map((b, i) => (
                        <span key={i} style={{
                          fontSize: 10,
                          color: PRO_COLOR,
                          background: `${PRO_COLOR}12`,
                          border: `1px solid ${PRO_COLOR}30`,
                          borderRadius: 4,
                          padding: '2px 6px',
                        }}>
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {opt.avoidWhen && opt.avoidWhen.length > 0 && (
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 800, color: CON_COLOR, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 4 }}>
                      Evite quando
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {opt.avoidWhen.map((a, i) => (
                        <span key={i} style={{
                          fontSize: 10,
                          color: CON_COLOR,
                          background: `${CON_COLOR}12`,
                          border: `1px solid ${CON_COLOR}30`,
                          borderRadius: 4,
                          padding: '2px 6px',
                        }}>
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Legenda de peso */}
      <div style={{ display: 'flex', gap: 16, marginTop: 14, flexWrap: 'wrap' }}>
        {(['high', 'medium', 'low'] as const).map(w => (
          <div key={w} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 9, color: WEIGHT_COLOR[w], fontWeight: 800 }}>{WEIGHT_ICON[w]}</span>
            <span style={{ fontSize: 10, color: FGMUTE_DEFAULT }}>
              {w === 'high' ? 'Alta importância' : w === 'medium' ? 'Média importância' : 'Baixa importância'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
