'use client'
import { useState, useEffect, useRef } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────────

export type TimelineEvent = {
  id: string
  timestamp: string
  title: string
  description: string
  type?: string
  color?: string
  payload?: string
  actor?: string
  tags?: string[]
}

export type EventGroup = {
  id: string
  label: string
  color?: string
  eventIds: string[]
}

interface EventTimelineProps {
  events: TimelineEvent[]
  groups?: EventGroup[]
  accentColor?: string
  bgColor?: string
  cardColor?: string
  title?: string
  description?: string
  orientation?: 'vertical' | 'horizontal'
}

// ── Paleta ───────────────────────────────────────────────────────────────────────

const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const MONO   = "'JetBrains Mono', monospace"

const TYPE_COLORS: Record<string, string> = {
  command : '#3b82f6',
  event   : '#22c55e',
  query   : '#a855f7',
  error   : '#ef4444',
}

// ── Component ────────────────────────────────────────────────────────────────────

export function EventTimeline({
  events,
  groups = [],
  accentColor = '#ef4444',
  bgColor = BG,
  cardColor = CARD,
  title,
  description,
  orientation = 'vertical',
}: EventTimelineProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [activeGroup, setActiveGroup] = useState<string | null>(null)
  const [replaying, setReplaying] = useState(false)
  const [replayIdx, setReplayIdx] = useState(-1)
  const replayRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const visibleIds = activeGroup
    ? groups.find(g => g.id === activeGroup)?.eventIds ?? events.map(e => e.id)
    : events.map(e => e.id)

  const visible = events.filter(e => visibleIds.includes(e.id))
  const selEvent = events.find(e => e.id === selected)

  const colorOf = (ev: TimelineEvent) =>
    ev.color ?? (ev.type ? (TYPE_COLORS[ev.type] ?? accentColor) : accentColor)

  const startReplay = () => {
    if (replayRef.current) clearInterval(replayRef.current)
    setReplaying(true)
    setReplayIdx(0)
    let i = 0
    replayRef.current = setInterval(() => {
      i++
      setReplayIdx(i)
      if (i >= visible.length - 1) {
        clearInterval(replayRef.current!)
        setReplaying(false)
      }
    }, 700)
  }

  useEffect(() => {
    return () => { if (replayRef.current) clearInterval(replayRef.current) }
  }, [])

  const isLit = (idx: number) => !replaying || idx <= replayIdx

  return (
    <div style={{ fontFamily: MONO, color: FG }}>
      {(title || description) && (
        <div style={{ marginBottom: 20 }}>
          {title && <h3 style={{ color: FG, fontSize: 22, fontWeight: 800, margin: '0 0 6px' }}>{title}</h3>}
          {description && <p style={{ color: FGMUTE, fontSize: 12, margin: 0, lineHeight: 1.6 }}>{description}</p>}
        </div>
      )}

      {/* Controles */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        {groups.map(g => (
          <button
            key={g.id}
            onClick={() => setActiveGroup(activeGroup === g.id ? null : g.id)}
            style={{
              padding: '4px 12px', borderRadius: 20, fontSize: 11, fontFamily: MONO,
              border: `1px solid ${activeGroup === g.id ? (g.color ?? accentColor) : LINE}`,
              background: activeGroup === g.id ? `${g.color ?? accentColor}20` : 'transparent',
              color: activeGroup === g.id ? (g.color ?? accentColor) : FGMUTE,
              cursor: 'pointer',
            }}
          >
            {g.label}
          </button>
        ))}
        <button
          onClick={startReplay}
          disabled={replaying}
          style={{
            padding: '4px 14px', borderRadius: 20, fontSize: 11, fontFamily: MONO,
            border: `1px solid ${accentColor}`,
            background: replaying ? `${accentColor}30` : `${accentColor}15`,
            color: accentColor, cursor: replaying ? 'not-allowed' : 'pointer',
            marginLeft: 'auto',
          }}
        >
          {replaying ? '▶ Reproduzindo…' : '▶ Replay'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selEvent ? '1fr 320px' : '1fr', gap: 16 }}>
        {/* Lista de eventos */}
        <div style={{
          background: bgColor,
          border: `1px solid ${LINE}`,
          borderRadius: 14,
          padding: 20,
          overflowY: 'auto',
          maxHeight: 500,
        }}>
          {orientation === 'vertical' ? (
            <div style={{ position: 'relative', paddingLeft: 32 }}>
              {/* Linha vertical */}
              <div style={{
                position: 'absolute', left: 10, top: 0, bottom: 0,
                width: 2, background: LINE,
              }} />

              {visible.map((ev, i) => {
                const col = colorOf(ev)
                const lit = isLit(i)
                return (
                  <div
                    key={ev.id}
                    onClick={() => setSelected(selected === ev.id ? null : ev.id)}
                    style={{
                      position: 'relative',
                      marginBottom: 24,
                      cursor: 'pointer',
                      opacity: lit ? 1 : 0.3,
                      transition: 'opacity .4s',
                    }}
                  >
                    {/* Ponto */}
                    <div style={{
                      position: 'absolute', left: -27, top: 2,
                      width: 14, height: 14, borderRadius: '50%',
                      background: selected === ev.id ? col : `${col}60`,
                      border: `2px solid ${col}`,
                      transition: 'all .3s',
                      boxShadow: lit ? `0 0 8px ${col}60` : 'none',
                    }} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 10, color: FGMUTE }}>{ev.timestamp}</span>
                      {ev.type && (
                        <span style={{
                          fontSize: 9, padding: '1px 6px', borderRadius: 4,
                          background: `${col}20`, color: col, fontWeight: 700,
                          textTransform: 'uppercase',
                        }}>
                          {ev.type}
                        </span>
                      )}
                      {ev.actor && (
                        <span style={{ fontSize: 10, color: FGMUTE }}>← {ev.actor}</span>
                      )}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: selected === ev.id ? col : FG }}>
                      {ev.title}
                    </div>
                    {ev.tags && ev.tags.length > 0 && (
                      <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
                        {ev.tags.map(tag => (
                          <span key={tag} style={{
                            fontSize: 9, padding: '1px 5px', borderRadius: 3,
                            background: LINE, color: FGMUTE,
                          }}>{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            /* Orientação horizontal */
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, overflowX: 'auto', paddingBottom: 20 }}>
              {visible.map((ev, i) => {
                const col = colorOf(ev)
                const lit = isLit(i)
                return (
                  <div
                    key={ev.id}
                    onClick={() => setSelected(selected === ev.id ? null : ev.id)}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 120, opacity: lit ? 1 : 0.3, cursor: 'pointer', transition: 'opacity .4s' }}
                  >
                    <div style={{ fontSize: 10, color: FGMUTE, marginBottom: 6, textAlign: 'center' }}>{ev.timestamp}</div>
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <div style={{ flex: 1, height: 2, background: i === 0 ? 'transparent' : LINE }} />
                      <div style={{
                        width: 14, height: 14, borderRadius: '50%', flexShrink: 0,
                        background: selected === ev.id ? col : `${col}60`,
                        border: `2px solid ${col}`,
                        boxShadow: lit ? `0 0 8px ${col}60` : 'none',
                      }} />
                      <div style={{ flex: 1, height: 2, background: i === visible.length - 1 ? 'transparent' : LINE }} />
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: FG, textAlign: 'center', marginTop: 8, padding: '0 6px' }}>{ev.title}</div>
                    {ev.type && (
                      <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 4, background: `${col}20`, color: col, marginTop: 4 }}>{ev.type}</span>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Painel de detalhes */}
        {selEvent && (
          <div style={{
            background: cardColor,
            border: `1px solid ${colorOf(selEvent)}50`,
            borderRadius: 14,
            padding: 20,
            fontSize: 12,
            overflowY: 'auto',
            maxHeight: 500,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ color: colorOf(selEvent), fontWeight: 700, fontSize: 14 }}>{selEvent.title}</div>
              <button
                onClick={() => setSelected(null)}
                style={{ background: 'none', border: 'none', color: FGMUTE, cursor: 'pointer', fontSize: 16, padding: 0 }}
              >
                ×
              </button>
            </div>

            <div style={{ color: FGMUTE, fontSize: 11, marginBottom: 10 }}>
              {selEvent.timestamp}
              {selEvent.actor && <span style={{ marginLeft: 8 }}>← {selEvent.actor}</span>}
            </div>

            <p style={{ color: FGMUTE, lineHeight: 1.7, marginBottom: 12, margin: '0 0 12px' }}>{selEvent.description}</p>

            {selEvent.payload && (
              <div>
                <div style={{ color: FG, fontSize: 11, fontWeight: 700, marginBottom: 6 }}>Payload</div>
                <pre style={{
                  background: BG, border: `1px solid ${LINE}`,
                  borderRadius: 8, padding: '10px 12px',
                  fontSize: 10, color: '#86efac',
                  overflowX: 'auto', margin: 0,
                  fontFamily: MONO,
                }}>
                  {selEvent.payload}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Legenda de tipos */}
      <div style={{ display: 'flex', gap: 12, marginTop: 14, flexWrap: 'wrap' }}>
        {Object.entries(TYPE_COLORS).map(([type, col]) => (
          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: col }} />
            <span style={{ color: FGMUTE, textTransform: 'capitalize' }}>{type}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
