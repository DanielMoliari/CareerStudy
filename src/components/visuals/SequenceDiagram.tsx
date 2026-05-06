'use client'
import { useState, useMemo } from 'react'

// ── Paleta padrão ─────────────────────────────────────────────────────────────

const BG_DEFAULT     = '#0f172a'
const CARD_DEFAULT   = '#1e293b'
const LINE_DEFAULT   = '#334155'
const FG_DEFAULT     = '#e2e8f0'
const FGMUTE_DEFAULT = '#94a3b8'
const MONO           = "'JetBrains Mono', monospace"

// ── Types ─────────────────────────────────────────────────────────────────────

export type SeqActor = {
  id: string
  label: string
  color?: string
  icon?: string
}

export type SeqMessage = {
  from: string
  to: string
  label: string
  note?: string
  type?: 'sync' | 'async' | 'return' | 'create' | 'destroy'
}

export type SeqGroup = {
  label: string
  kind?: 'loop' | 'alt' | 'opt' | 'par' | 'ref'
  fromMsg: number
  toMsg: number
  color?: string
}

interface SequenceDiagramProps {
  actors: SeqActor[]
  messages: SeqMessage[]
  groups?: SeqGroup[]
  accentColor: string
  bgColor: string
  title?: string
  description?: string
}

// ── Constantes de layout ───────────────────────────────────────────────────────

const ACTOR_BOX_W  = 120
const ACTOR_BOX_H  = 44
const ACTOR_GAP    = 160   // distância entre centros de actores
const PAD_LEFT     = 56    // espaço para numeração à esquerda
const PAD_TOP      = 72    // espaço abaixo do cabeçalho antes da 1ª mensagem
const PAD_BOTTOM   = 36
const MSG_ROW_H    = 52    // altura por linha de mensagem
const LIFELINE_EXTRA = 20  // extensão abaixo da última mensagem
const ACT_BAR_W    = 10    // largura da barra de ativação
const GROUP_LABEL_H = 22   // espaço extra para label do grupo

// ── Cores dos tipos de grupo ───────────────────────────────────────────────────

const GROUP_KIND_COLORS: Record<string, string> = {
  loop:  '#6366f1',
  alt:   '#f59e0b',
  opt:   '#22c55e',
  par:   '#06b6d4',
  ref:   '#8b5cf6',
}

const GROUP_KIND_LABELS: Record<string, string> = {
  loop: 'loop',
  alt:  'alt',
  opt:  'opt',
  par:  'par',
  ref:  'ref',
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function actorColor(actor: SeqActor, accentColor: string): string {
  return actor.color ?? accentColor
}

function msgTypeLabel(type: SeqMessage['type']): string {
  switch (type) {
    case 'sync':    return 'sync'
    case 'async':   return 'async'
    case 'return':  return 'return'
    case 'create':  return 'create'
    case 'destroy': return 'destroy'
    default:        return 'sync'
  }
}

function msgTypeBadgeColor(type: SeqMessage['type'], accent: string): string {
  switch (type) {
    case 'async':   return '#06b6d4'
    case 'return':  return '#94a3b8'
    case 'create':  return '#22c55e'
    case 'destroy': return '#ef4444'
    default:        return accent
  }
}

// ── Infere barras de ativação ──────────────────────────────────────────────────
// Heurística: um actor fica ativo do momento em que recebe uma mensagem sync
// até o momento em que envia um return. Se não houver return explícito,
// desativa após o último sync recebido.
function inferActivationBars(
  actors: SeqActor[],
  messages: SeqMessage[],
): Map<string, Array<{ start: number; end: number }>> {
  const result = new Map<string, Array<{ start: number; end: number }>>()
  actors.forEach(a => result.set(a.id, []))

  // Pilha por actor: índice da mensagem que iniciou ativação
  const stack = new Map<string, number[]>()
  actors.forEach(a => stack.set(a.id, []))

  messages.forEach((msg, idx) => {
    const type = msg.type ?? 'sync'

    if (type === 'sync' || type === 'create') {
      // Ativa o receptor
      stack.get(msg.to)?.push(idx)
    }

    if (type === 'return' || type === 'destroy') {
      // Fecha a ativação do remetente
      const s = stack.get(msg.from)
      if (s && s.length > 0) {
        const start = s.pop()!
        result.get(msg.from)!.push({ start, end: idx })
      }
    }
  })

  // Fecha ativações que ficaram abertas
  stack.forEach((s, actorId) => {
    while (s.length > 0) {
      const start = s.pop()!
      result.get(actorId)!.push({ start, end: messages.length - 1 })
    }
  })

  return result
}

// ── Renderiza a seta de acordo com o tipo ─────────────────────────────────────

function ArrowLine({
  x1, y1, x2, y2,
  type,
  accentColor,
  isSelected,
}: {
  x1: number; y1: number; x2: number; y2: number
  type: SeqMessage['type']
  accentColor: string
  isSelected: boolean
}) {
  const t = type ?? 'sync'
  const color = isSelected ? accentColor : LINE_DEFAULT
  const markerId = `seq-arrow-${t}-${isSelected ? 'sel' : 'def'}`

  const isDashed = t === 'async' || t === 'return'
  const strokeDash = isDashed ? '6 3' : undefined

  // Para 'return': arrowhead aberto (apenas linhas, sem fill)
  const arrowOpen = t === 'return'

  return (
    <>
      <defs>
        <marker id={markerId} markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
          {arrowOpen
            ? <polyline points="0,0 7,3 0,6" fill="none" stroke={color} strokeWidth="1.5" />
            : <path d="M0,0 L0,6 L8,3 z" fill={color} />
          }
        </marker>
      </defs>
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color}
        strokeWidth={isSelected ? 2 : 1.5}
        strokeDasharray={strokeDash}
        markerEnd={`url(#${markerId})`}
      />
    </>
  )
}

// ── Componente principal ───────────────────────────────────────────────────────

export function SequenceDiagram({
  actors,
  messages,
  groups = [],
  accentColor,
  bgColor,
  title,
  description,
}: SequenceDiagramProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)

  // ── Dimensões do SVG ───────────────────────────────────────────────────────
  const totalWidth  = PAD_LEFT + actors.length * ACTOR_GAP + 40
  const totalHeight = PAD_TOP + messages.length * MSG_ROW_H + LIFELINE_EXTRA + PAD_BOTTOM

  // X central de cada actor (no sistema de coordenadas do SVG, após PAD_LEFT)
  const actorX = useMemo(() =>
    actors.map((_, i) => PAD_LEFT + i * ACTOR_GAP + ACTOR_GAP / 2),
    [actors],
  )

  const actorIndex = useMemo(() => {
    const m = new Map<string, number>()
    actors.forEach((a, i) => m.set(a.id, i))
    return m
  }, [actors])

  // Y da linha de mensagem i
  const msgY = (i: number) => PAD_TOP + i * MSG_ROW_H + MSG_ROW_H / 2

  // Barras de ativação
  const activationBars = useMemo(
    () => inferActivationBars(actors, messages),
    [actors, messages],
  )

  // ── Grupos: calcular bounding box ─────────────────────────────────────────
  const groupRects = useMemo(() =>
    groups.map(g => {
      const fromY = PAD_TOP + g.fromMsg * MSG_ROW_H - GROUP_LABEL_H
      const toY   = PAD_TOP + g.toMsg * MSG_ROW_H + MSG_ROW_H / 2 + 12
      const color = g.color ?? GROUP_KIND_COLORS[g.kind ?? 'ref'] ?? '#475569'
      return { ...g, fromY, toY, color }
    }),
    [groups],
  )

  // ── Interação ─────────────────────────────────────────────────────────────
  const selected = selectedIdx !== null ? messages[selectedIdx] : null

  function handleMsgClick(i: number) {
    setSelectedIdx(prev => (prev === i ? null : i))
  }

  return (
    <div style={{ fontFamily: MONO }}>
      {/* Cabeçalho */}
      {(title || description) && (
        <div style={{ marginBottom: 16 }}>
          {title && (
            <h3 style={{ color: FG_DEFAULT, fontSize: 18, fontWeight: 800, margin: '0 0 6px' }}>
              {title}
            </h3>
          )}
          {description && (
            <p style={{ color: FGMUTE_DEFAULT, fontSize: 12, margin: 0, lineHeight: 1.6 }}>
              {description}
            </p>
          )}
        </div>
      )}

      {/* Container principal */}
      <div style={{
        background: bgColor,
        border: `1px solid ${LINE_DEFAULT}`,
        borderRadius: 14,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}>

        {/* Diagrama SVG com scroll horizontal se necessário */}
        <div style={{
          background: CARD_DEFAULT,
          border: `1px solid ${LINE_DEFAULT}`,
          borderRadius: 12,
          overflowX: 'auto',
          overflowY: 'hidden',
        }}>
          <svg
            width={totalWidth}
            height={totalHeight}
            style={{ display: 'block', fontFamily: MONO }}
          >
            {/* ── Defs: marcadores de seta (base — sobrescritos inline por ArrowLine) ── */}
            <defs>
              <marker id="seq-dot" markerWidth="4" markerHeight="4" refX="2" refY="2">
                <circle cx="2" cy="2" r="1.5" fill={FGMUTE_DEFAULT} />
              </marker>
            </defs>

            {/* ── Grupos (fundo) ─────────────────────────────────────────────── */}
            {groupRects.map((g, gi) => (
              <g key={gi}>
                <rect
                  x={PAD_LEFT + 4}
                  y={g.fromY}
                  width={actors.length * ACTOR_GAP - 8}
                  height={g.toY - g.fromY}
                  rx={6}
                  fill={`${g.color}10`}
                  stroke={`${g.color}60`}
                  strokeWidth={1.5}
                  strokeDasharray="6 3"
                />
                {/* Badge de tipo */}
                <rect
                  x={PAD_LEFT + 4}
                  y={g.fromY}
                  width={54}
                  height={20}
                  rx={4}
                  fill={g.color}
                />
                <text
                  x={PAD_LEFT + 8}
                  y={g.fromY + 14}
                  fill="#fff"
                  fontSize={10}
                  fontWeight={700}
                  fontFamily={MONO}
                >
                  {GROUP_KIND_LABELS[g.kind ?? 'ref'] ?? 'ref'}
                </text>
                {/* Label do grupo */}
                <text
                  x={PAD_LEFT + 64}
                  y={g.fromY + 14}
                  fill={g.color}
                  fontSize={10}
                  fontWeight={600}
                  fontFamily={MONO}
                >
                  {g.label}
                </text>
              </g>
            ))}

            {/* ── Cabeçalhos dos actores ─────────────────────────────────────── */}
            {actors.map((actor, i) => {
              const cx = actorX[i]
              const color = actorColor(actor, accentColor)
              return (
                <g key={actor.id}>
                  {/* Caixa do actor */}
                  <rect
                    x={cx - ACTOR_BOX_W / 2}
                    y={10}
                    width={ACTOR_BOX_W}
                    height={ACTOR_BOX_H}
                    rx={8}
                    fill={`${color}20`}
                    stroke={color}
                    strokeWidth={1.5}
                  />
                  {/* Ícone (se existir) */}
                  {actor.icon && (
                    <text
                      x={cx - ACTOR_BOX_W / 2 + 14}
                      y={10 + ACTOR_BOX_H / 2 + 5}
                      fontSize={16}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{ userSelect: 'none' }}
                    >
                      {actor.icon}
                    </text>
                  )}
                  {/* Label do actor */}
                  <text
                    x={actor.icon ? cx + 4 : cx}
                    y={10 + ACTOR_BOX_H / 2 + 1}
                    fill={FG_DEFAULT}
                    fontSize={11}
                    fontWeight={700}
                    fontFamily={MONO}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ pointerEvents: 'none' }}
                  >
                    {actor.label}
                  </text>
                </g>
              )
            })}

            {/* ── Lifelines (linhas tracejadas verticais) ────────────────────── */}
            {actors.map((actor, i) => {
              const cx = actorX[i]
              const lifelineY1 = 10 + ACTOR_BOX_H
              const lifelineY2 = totalHeight - PAD_BOTTOM
              return (
                <line
                  key={`lifeline-${actor.id}`}
                  x1={cx} y1={lifelineY1}
                  x2={cx} y2={lifelineY2}
                  stroke={LINE_DEFAULT}
                  strokeWidth={1}
                  strokeDasharray="5 4"
                />
              )
            })}

            {/* ── Barras de ativação ─────────────────────────────────────────── */}
            {actors.map(actor => {
              const bars = activationBars.get(actor.id) ?? []
              const i = actorIndex.get(actor.id) ?? 0
              const cx = actorX[i]
              const color = actorColor(actor, accentColor)
              return bars.map((bar, bi) => {
                const y1 = msgY(bar.start) - 2
                const y2 = msgY(bar.end) + MSG_ROW_H / 2 - 4
                return (
                  <rect
                    key={`bar-${actor.id}-${bi}`}
                    x={cx - ACT_BAR_W / 2}
                    y={y1}
                    width={ACT_BAR_W}
                    height={Math.max(8, y2 - y1)}
                    rx={3}
                    fill={`${color}35`}
                    stroke={color}
                    strokeWidth={1}
                  />
                )
              })
            })}

            {/* ── Mensagens ─────────────────────────────────────────────────── */}
            {messages.map((msg, idx) => {
              const fromIdx = actorIndex.get(msg.from) ?? 0
              const toIdx   = actorIndex.get(msg.to)   ?? 0
              const x1      = actorX[fromIdx]
              const x2      = actorX[toIdx]
              const y       = msgY(idx)
              const isSelected = selectedIdx === idx
              const isSelfMsg  = msg.from === msg.to
              const type       = msg.type ?? 'sync'
              const msgColor   = isSelected ? accentColor : FG_DEFAULT

              // Ajuste: a seta parte/chega na borda da barra de ativação (se ativa)
              const fromBars = activationBars.get(msg.from) ?? []
              const toBars   = activationBars.get(msg.to) ?? []
              const fromActive = fromBars.some(b => idx >= b.start && idx <= b.end)
              const toActive   = toBars.some(b => idx >= b.start && idx <= b.end)

              const fromOffset = fromActive ? (x1 < x2 ? ACT_BAR_W / 2 : -ACT_BAR_W / 2) : 0
              const toOffset   = toActive   ? (x1 < x2 ? -ACT_BAR_W / 2 : ACT_BAR_W / 2) : 0

              // Pequena margem para a ponta da seta não tocar o centro exato
              const ARROW_GAP = 6
              const lx1 = x1 + fromOffset + (x1 < x2 ? ARROW_GAP : -ARROW_GAP)
              const lx2 = x2 + toOffset   + (x1 < x2 ? -ARROW_GAP : ARROW_GAP)

              return (
                <g
                  key={idx}
                  onClick={() => handleMsgClick(idx)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Faixa de hover / seleção */}
                  <rect
                    x={PAD_LEFT}
                    y={y - MSG_ROW_H / 2 + 4}
                    width={actors.length * ACTOR_GAP - 8}
                    height={MSG_ROW_H - 8}
                    rx={6}
                    fill={isSelected ? `${accentColor}15` : 'transparent'}
                    stroke={isSelected ? `${accentColor}40` : 'transparent'}
                    strokeWidth={1}
                  />

                  {/* Número da mensagem */}
                  <text
                    x={PAD_LEFT - 8}
                    y={y + 1}
                    fill={isSelected ? accentColor : FGMUTE_DEFAULT}
                    fontSize={9}
                    fontWeight={700}
                    fontFamily={MONO}
                    textAnchor="end"
                    dominantBaseline="middle"
                  >
                    {idx + 1}
                  </text>

                  {/* Self-message: loop */}
                  {isSelfMsg ? (
                    <>
                      <path
                        d={`M${x1},${y - 10} L${x1 + 44},${y - 10} L${x1 + 44},${y + 10} L${x1 + 6},${y + 10}`}
                        fill="none"
                        stroke={isSelected ? accentColor : LINE_DEFAULT}
                        strokeWidth={isSelected ? 2 : 1.5}
                        strokeDasharray={type === 'async' || type === 'return' ? '5 3' : undefined}
                        markerEnd={`url(#seq-arrow-self-${isSelected ? 'sel' : 'def'})`}
                      />
                      <defs>
                        <marker
                          id={`seq-arrow-self-${isSelected ? 'sel' : 'def'}`}
                          markerWidth="8" markerHeight="8"
                          refX="7" refY="3" orient="auto"
                        >
                          <path
                            d="M0,0 L0,6 L8,3 z"
                            fill={isSelected ? accentColor : LINE_DEFAULT}
                          />
                        </marker>
                      </defs>
                      <text
                        x={x1 + 50}
                        y={y + 1}
                        fill={msgColor}
                        fontSize={10}
                        fontWeight={isSelected ? 700 : 500}
                        fontFamily={MONO}
                        dominantBaseline="middle"
                      >
                        {type === 'create' ? `«create» ${msg.label}` : msg.label}
                      </text>
                    </>
                  ) : (
                    <>
                      {/* Seta principal */}
                      <ArrowLine
                        x1={lx1} y1={y}
                        x2={lx2} y2={y}
                        type={type}
                        accentColor={accentColor}
                        isSelected={isSelected}
                      />

                      {/* X de destroy no destino */}
                      {type === 'destroy' && (
                        <g>
                          <line
                            x1={x2 - 8} y1={y - 8}
                            x2={x2 + 8} y2={y + 8}
                            stroke="#ef4444" strokeWidth={2}
                          />
                          <line
                            x1={x2 + 8} y1={y - 8}
                            x2={x2 - 8} y2={y + 8}
                            stroke="#ef4444" strokeWidth={2}
                          />
                        </g>
                      )}

                      {/* Label da mensagem — centralizada no meio da seta */}
                      <text
                        x={(lx1 + lx2) / 2}
                        y={y - 8}
                        fill={msgColor}
                        fontSize={10}
                        fontWeight={isSelected ? 700 : 500}
                        fontFamily={MONO}
                        textAnchor="middle"
                        style={{ pointerEvents: 'none' }}
                      >
                        {type === 'create' ? `«create» ${msg.label}` : msg.label}
                      </text>
                    </>
                  )}
                </g>
              )
            })}

            {/* ── Caixas dos actores no rodapé (espelho do cabeçalho) ────────── */}
            {actors.map((actor, i) => {
              const cx = actorX[i]
              const color = actorColor(actor, accentColor)
              const footerY = totalHeight - PAD_BOTTOM - ACTOR_BOX_H + 4
              return (
                <g key={`footer-${actor.id}`}>
                  <rect
                    x={cx - ACTOR_BOX_W / 2}
                    y={footerY}
                    width={ACTOR_BOX_W}
                    height={ACTOR_BOX_H}
                    rx={8}
                    fill={`${color}20`}
                    stroke={color}
                    strokeWidth={1.5}
                  />
                  {actor.icon && (
                    <text
                      x={cx - ACTOR_BOX_W / 2 + 14}
                      y={footerY + ACTOR_BOX_H / 2 + 5}
                      fontSize={16}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{ userSelect: 'none' }}
                    >
                      {actor.icon}
                    </text>
                  )}
                  <text
                    x={actor.icon ? cx + 4 : cx}
                    y={footerY + ACTOR_BOX_H / 2 + 1}
                    fill={FG_DEFAULT}
                    fontSize={11}
                    fontWeight={700}
                    fontFamily={MONO}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ pointerEvents: 'none' }}
                  >
                    {actor.label}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* ── Painel de detalhe (mensagem selecionada) ──────────────────────── */}
        {selected !== null ? (
          <div style={{
            background: `${accentColor}12`,
            border: `1.5px solid ${accentColor}50`,
            borderRadius: 12,
            padding: '14px 18px',
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '10px 20px',
            alignItems: 'start',
          }}>
            {/* Número + badge de tipo */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
              <div style={{
                width: 32, height: 32,
                borderRadius: '50%',
                background: `${accentColor}25`,
                border: `2px solid ${accentColor}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: accentColor, fontSize: 11, fontWeight: 800, fontFamily: MONO,
              }}>
                {selectedIdx! + 1}
              </div>
              <span style={{
                background: `${msgTypeBadgeColor(selected.type, accentColor)}25`,
                border: `1px solid ${msgTypeBadgeColor(selected.type, accentColor)}70`,
                color: msgTypeBadgeColor(selected.type, accentColor),
                borderRadius: 6, padding: '2px 7px',
                fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '.1em', whiteSpace: 'nowrap',
              }}>
                {msgTypeLabel(selected.type)}
              </span>
            </div>

            {/* Detalhes */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{
                  color: actors.find(a => a.id === selected.from)?.color ?? accentColor,
                  fontWeight: 700, fontSize: 12,
                }}>
                  {actors.find(a => a.id === selected.from)?.label ?? selected.from}
                </span>
                <span style={{ color: FGMUTE_DEFAULT, fontSize: 11 }}>→</span>
                <span style={{
                  color: actors.find(a => a.id === selected.to)?.color ?? accentColor,
                  fontWeight: 700, fontSize: 12,
                }}>
                  {actors.find(a => a.id === selected.to)?.label ?? selected.to}
                </span>
                <span style={{
                  color: FG_DEFAULT, fontSize: 12, fontWeight: 600,
                  marginLeft: 4,
                }}>
                  — {selected.label}
                </span>
              </div>
              {selected.note ? (
                <p style={{
                  color: FGMUTE_DEFAULT, fontSize: 12,
                  margin: 0, lineHeight: 1.7,
                  borderLeft: `2px solid ${accentColor}50`,
                  paddingLeft: 10,
                }}>
                  {selected.note}
                </p>
              ) : (
                <p style={{ color: FGMUTE_DEFAULT, fontSize: 11, margin: 0, fontStyle: 'italic' }}>
                  Sem nota para esta mensagem.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div style={{
            background: CARD_DEFAULT,
            border: `1px dashed ${LINE_DEFAULT}`,
            borderRadius: 10,
            padding: '12px 16px',
            textAlign: 'center',
          }}>
            <p style={{ color: FGMUTE_DEFAULT, fontSize: 11, margin: 0 }}>
              Clique em uma mensagem para ver detalhes e notas.
            </p>
          </div>
        )}

        {/* ── Legenda de tipos de seta ──────────────────────────────────────── */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '8px 20px',
          padding: '10px 14px',
          background: CARD_DEFAULT,
          border: `1px solid ${LINE_DEFAULT}`,
          borderRadius: 10,
        }}>
          {([
            { type: 'sync' as const,    label: 'sync — chamada síncrona' },
            { type: 'async' as const,   label: 'async — mensagem assíncrona' },
            { type: 'return' as const,  label: 'return — resposta' },
            { type: 'create' as const,  label: 'create — criação de objeto' },
            { type: 'destroy' as const, label: 'destroy — destruição de objeto' },
          ] as const).map(({ type, label }) => (
            <LegendItem key={type} type={type} label={label} accentColor={accentColor} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Legenda ────────────────────────────────────────────────────────────────────

function LegendItem({
  type,
  label,
  accentColor,
}: {
  type: SeqMessage['type']
  label: string
  accentColor: string
}) {
  const color   = msgTypeBadgeColor(type, accentColor)
  const isDashed = type === 'async' || type === 'return'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <svg width={40} height={14} style={{ flexShrink: 0 }}>
        <defs>
          <marker
            id={`leg-${type}`}
            markerWidth="6" markerHeight="6"
            refX="5" refY="2.5" orient="auto"
          >
            {type === 'return'
              ? <polyline points="0,0 5,2.5 0,5" fill="none" stroke={color} strokeWidth="1.2" />
              : <path d="M0,0 L0,5 L6,2.5 z" fill={color} />
            }
          </marker>
        </defs>
        {type === 'destroy' ? (
          <>
            <line x1={0} y1={7} x2={30} y2={7} stroke={color} strokeWidth={1.5} markerEnd={`url(#leg-${type})`} />
            <line x1={32} y1={2} x2={40} y2={12} stroke="#ef4444" strokeWidth={1.5} />
            <line x1={40} y1={2} x2={32} y2={12} stroke="#ef4444" strokeWidth={1.5} />
          </>
        ) : (
          <line
            x1={0} y1={7} x2={34} y2={7}
            stroke={color}
            strokeWidth={1.5}
            strokeDasharray={isDashed ? '5 3' : undefined}
            markerEnd={`url(#leg-${type})`}
          />
        )}
      </svg>
      <span style={{ color: FGMUTE_DEFAULT, fontSize: 10 }}>{label}</span>
    </div>
  )
}
