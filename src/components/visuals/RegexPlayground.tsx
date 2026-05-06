'use client'
import { useState, useMemo } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────────

export type RegexExample = {
  id: string
  label: string
  pattern: string
  flags?: string
  description: string
  testTexts: string[]
  explanation?: Array<{
    part: string
    meaning: string
  }>
}

interface RegexPlaygroundProps {
  examples: RegexExample[]
  accentColor?: string
  bgColor?: string
  cardColor?: string
  title?: string
  description?: string
}

// ── Paleta ───────────────────────────────────────────────────────────────────────

const BG_DEFAULT     = '#0f172a'
const CARD_DEFAULT   = '#1e293b'
const LINE_DEFAULT   = '#334155'
const FG_DEFAULT     = '#e2e8f0'
const FGMUTE_DEFAULT = '#94a3b8'
const MONO           = "'JetBrains Mono', monospace"

// Paleta de cores para grupos de captura
const CAPTURE_COLORS = [
  { bg: '#fbbf2430', border: '#fbbf2460', text: '#fbbf24' },
  { bg: '#86efac30', border: '#86efac60', text: '#86efac' },
  { bg: '#93c5fd30', border: '#93c5fd60', text: '#93c5fd' },
  { bg: '#f9a8d430', border: '#f9a8d460', text: '#f9a8d4' },
  { bg: '#a78bfa30', border: '#a78bfa60', text: '#a78bfa' },
]
const MATCH_COLOR = { bg: '#ef444420', border: '#ef444450', text: '#ef4444' }

// ── Helpers ───────────────────────────────────────────────────────────────────────

type MatchSegment = {
  text: string
  matchIndex: number      // -1 = sem match, ≥0 = índice do match
  groupIndex?: number     // índice do grupo de captura (0-based), undefined = match completo
}

function buildSegments(text: string, pattern: string, flags: string): MatchSegment[] {
  let rx: RegExp
  try {
    // Garante que 'd' não é incluído (só suportado em ambientes mais novos)
    const safeFlags = flags.replace(/d/g, '')
    // Adiciona 'g' se não estiver
    const finalFlags = safeFlags.includes('g') ? safeFlags : safeFlags + 'g'
    rx = new RegExp(pattern, finalFlags)
  } catch {
    return [{ text, matchIndex: -1 }]
  }

  const segments: MatchSegment[] = []
  let pos = 0
  let matchIdx = 0

  try {
    const allMatches = [...text.matchAll(rx)]
    for (const match of allMatches) {
      const start = match.index ?? 0
      const end   = start + match[0].length

      // Trecho antes do match
      if (start > pos) {
        segments.push({ text: text.slice(pos, start), matchIndex: -1 })
      }

      // Se não há grupos de captura, anota match completo
      if (match.length <= 1) {
        segments.push({ text: match[0], matchIndex: matchIdx })
      } else {
        // Tentar mapear grupos (pode não ser preciso se grupos se sobrepõem)
        // Abordagem: marcar o match completo e ignorar grupos individuais no highlighting
        segments.push({ text: match[0], matchIndex: matchIdx })
      }

      pos = end
      matchIdx++
    }
  } catch {
    return [{ text, matchIndex: -1 }]
  }

  // Resto do texto
  if (pos < text.length) {
    segments.push({ text: text.slice(pos), matchIndex: -1 })
  }

  return segments
}

function getMatches(text: string, pattern: string, flags: string): RegExpMatchArray[] {
  try {
    const safeFlags  = flags.replace(/d/g, '')
    const finalFlags = safeFlags.includes('g') ? safeFlags : safeFlags + 'g'
    const rx         = new RegExp(pattern, finalFlags)
    return [...text.matchAll(rx)]
  } catch {
    return []
  }
}

function isValidRegex(pattern: string, flags: string): boolean {
  try {
    new RegExp(pattern, flags.replace(/d/g, ''))
    return true
  } catch {
    return false
  }
}

// ── Componente ───────────────────────────────────────────────────────────────────

export function RegexPlayground({
  examples,
  accentColor = '#ef4444',
  bgColor     = BG_DEFAULT,
  cardColor   = CARD_DEFAULT,
  title,
  description,
}: RegexPlaygroundProps) {
  const [exIdx, setExIdx]     = useState(0)
  const ex                    = examples[exIdx]

  const [pattern, setPattern] = useState(ex.pattern)
  const [flags, setFlags]     = useState(ex.flags ?? 'g')
  const [textInput, setTextInput] = useState(ex.testTexts[0] ?? '')
  const [textIdx, setTextIdx] = useState(0)

  const handleExample = (i: number) => {
    setExIdx(i)
    setPattern(examples[i].pattern)
    setFlags(examples[i].flags ?? 'g')
    setTextInput(examples[i].testTexts[0] ?? '')
    setTextIdx(0)
  }

  const handleTextPreset = (i: number) => {
    setTextIdx(i)
    setTextInput(ex.testTexts[i])
  }

  const valid    = useMemo(() => isValidRegex(pattern, flags), [pattern, flags])
  const segments = useMemo(() => valid ? buildSegments(textInput, pattern, flags) : [{ text: textInput, matchIndex: -1 }], [valid, textInput, pattern, flags])
  const matches  = useMemo(() => valid ? getMatches(textInput, pattern, flags) : [], [valid, textInput, pattern, flags])

  return (
    <div style={{ fontFamily: MONO, color: FG_DEFAULT }}>
      {(title || description) && (
        <div style={{ marginBottom: 20 }}>
          {title && (
            <h3 style={{ color: FG_DEFAULT, fontSize: 22, fontWeight: 800, margin: '0 0 6px' }}>
              {title}
            </h3>
          )}
          {description && (
            <p style={{ color: FGMUTE_DEFAULT, fontSize: 13, margin: 0 }}>
              {description}
            </p>
          )}
        </div>
      )}

      {/* Seletor de exemplo */}
      {examples.length > 1 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {examples.map((e, i) => (
            <button
              key={e.id}
              onClick={() => handleExample(i)}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                border: `1px solid ${i === exIdx ? accentColor : LINE_DEFAULT}`,
                background: i === exIdx ? `${accentColor}20` : `${cardColor}80`,
                color: i === exIdx ? accentColor : FGMUTE_DEFAULT,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all .2s',
              }}
            >
              {e.label}
            </button>
          ))}
        </div>
      )}

      <div style={{
        background: bgColor,
        border: `1px solid ${LINE_DEFAULT}`,
        borderRadius: 14,
        overflow: 'hidden',
      }}>
        {/* Editor de regex */}
        <div style={{
          padding: '16px 20px',
          borderBottom: `1px solid ${LINE_DEFAULT}`,
          background: '#0a0f1e',
        }}>
          <div style={{
            fontSize: 11,
            color: FGMUTE_DEFAULT,
            fontWeight: 700,
            letterSpacing: '.1em',
            textTransform: 'uppercase',
            marginBottom: 10,
          }}>
            Expressão Regular
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: FGMUTE_DEFAULT, fontSize: 18, fontWeight: 700 }}>/</span>
            <input
              value={pattern}
              onChange={e => setPattern(e.target.value)}
              spellCheck={false}
              style={{
                flex: 1,
                background: 'transparent',
                border: `1px solid ${valid ? LINE_DEFAULT : '#ef444460'}`,
                borderRadius: 6,
                padding: '8px 12px',
                color: valid ? accentColor : '#ef4444',
                fontSize: 14,
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />
            <span style={{ color: FGMUTE_DEFAULT, fontSize: 18, fontWeight: 700 }}>/</span>
            <input
              value={flags}
              onChange={e => setFlags(e.target.value.replace(/[^gimsuy]/g, ''))}
              spellCheck={false}
              maxLength={6}
              style={{
                width: 64,
                background: 'transparent',
                border: `1px solid ${LINE_DEFAULT}`,
                borderRadius: 6,
                padding: '8px 10px',
                color: FGMUTE_DEFAULT,
                fontSize: 14,
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />
            {/* Badge de status */}
            <div style={{
              padding: '4px 10px',
              borderRadius: 6,
              background: valid ? '#86efac15' : '#ef444415',
              border: `1px solid ${valid ? '#86efac40' : '#ef444440'}`,
              fontSize: 11,
              fontWeight: 700,
              color: valid ? '#86efac' : '#ef4444',
              whiteSpace: 'nowrap',
            }}>
              {valid ? `${matches.length} match${matches.length !== 1 ? 'es' : ''}` : 'inválido'}
            </div>
          </div>
          {ex.description && (
            <div style={{ fontSize: 12, color: FGMUTE_DEFAULT, marginTop: 10, lineHeight: 1.6 }}>
              {ex.description}
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
          {/* Painel esquerdo: texto de teste + highlighting */}
          <div style={{ padding: '20px', borderRight: `1px solid ${LINE_DEFAULT}` }}>
            {/* Presets de texto */}
            {ex.testTexts.length > 1 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: FGMUTE_DEFAULT, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                  Textos de Teste
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {ex.testTexts.map((t, i) => (
                    <button
                      key={i}
                      onClick={() => handleTextPreset(i)}
                      style={{
                        padding: '3px 10px',
                        borderRadius: 6,
                        border: `1px solid ${i === textIdx ? accentColor + '60' : LINE_DEFAULT}`,
                        background: i === textIdx ? `${accentColor}15` : 'transparent',
                        color: i === textIdx ? accentColor : FGMUTE_DEFAULT,
                        fontSize: 11,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        transition: 'all .2s',
                      }}
                    >
                      Exemplo {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Campo de texto editável */}
            <div style={{
              fontSize: 11,
              color: FGMUTE_DEFAULT,
              fontWeight: 700,
              letterSpacing: '.1em',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}>
              Texto de Entrada
            </div>
            <textarea
              value={textInput}
              onChange={e => setTextInput(e.target.value)}
              rows={4}
              spellCheck={false}
              style={{
                width: '100%',
                background: '#0a0f1e',
                border: `1px solid ${LINE_DEFAULT}`,
                borderRadius: 8,
                padding: '10px 12px',
                color: FG_DEFAULT,
                fontSize: 12.5,
                fontFamily: 'inherit',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box',
                lineHeight: 1.7,
              }}
            />

            {/* Visualização com highlighting */}
            <div style={{
              fontSize: 11,
              color: FGMUTE_DEFAULT,
              fontWeight: 700,
              letterSpacing: '.1em',
              textTransform: 'uppercase',
              marginTop: 14,
              marginBottom: 8,
            }}>
              Visualização com Highlighting
            </div>
            <div style={{
              background: '#0a0f1e',
              border: `1px solid ${LINE_DEFAULT}`,
              borderRadius: 8,
              padding: '10px 12px',
              fontSize: 12.5,
              lineHeight: 1.9,
              wordBreak: 'break-all',
              whiteSpace: 'pre-wrap',
              minHeight: 56,
            }}>
              {segments.map((seg, i) => {
                if (seg.matchIndex < 0) {
                  return <span key={i} style={{ color: FG_DEFAULT }}>{seg.text}</span>
                }
                const color = CAPTURE_COLORS[seg.matchIndex % CAPTURE_COLORS.length]
                return (
                  <span
                    key={i}
                    title={`Match #${seg.matchIndex + 1}`}
                    style={{
                      background: color.bg,
                      border: `1px solid ${color.border}`,
                      borderRadius: 3,
                      color: color.text,
                      padding: '1px 2px',
                      fontWeight: 600,
                    }}
                  >
                    {seg.text}
                  </span>
                )
              })}
            </div>
          </div>

          {/* Painel direito: lista de matches + explicação */}
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Lista de matches */}
            <div>
              <div style={{
                fontSize: 11,
                color: FGMUTE_DEFAULT,
                fontWeight: 700,
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                marginBottom: 10,
              }}>
                Matches Encontrados {matches.length > 0 && `(${matches.length})`}
              </div>
              {matches.length === 0 && valid && (
                <div style={{ fontSize: 12, color: '#475569', fontStyle: 'italic' }}>
                  Nenhum match encontrado.
                </div>
              )}
              {!valid && (
                <div style={{ fontSize: 12, color: '#ef4444' }}>
                  Regex inválida — verifique o padrão.
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 160, overflowY: 'auto' }}>
                {matches.map((m, i) => {
                  const color = CAPTURE_COLORS[i % CAPTURE_COLORS.length]
                  return (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10,
                        padding: '8px 12px',
                        background: color.bg,
                        border: `1px solid ${color.border}`,
                        borderRadius: 8,
                      }}
                    >
                      <span style={{ fontSize: 10, color: color.text, fontWeight: 700, marginTop: 2, flexShrink: 0 }}>
                        #{i + 1}
                      </span>
                      <div>
                        <div style={{ fontSize: 12.5, color: color.text, fontWeight: 600, wordBreak: 'break-all' }}>
                          {m[0]}
                        </div>
                        {m.length > 1 && (
                          <div style={{ fontSize: 11, color: FGMUTE_DEFAULT, marginTop: 3 }}>
                            Grupos: {m.slice(1).map((g, gi) => (
                              <span key={gi} style={{ marginRight: 6, color: FG_DEFAULT }}>
                                [{gi + 1}] {g ?? 'undefined'}
                              </span>
                            ))}
                          </div>
                        )}
                        <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>
                          pos {m.index} → {(m.index ?? 0) + m[0].length}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Explicação da regex */}
            {ex.explanation && ex.explanation.length > 0 && (
              <div>
                <div style={{
                  fontSize: 11,
                  color: FGMUTE_DEFAULT,
                  fontWeight: 700,
                  letterSpacing: '.1em',
                  textTransform: 'uppercase',
                  marginBottom: 10,
                }}>
                  Anatomia da Regex
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {ex.explanation.map((e, i) => {
                    const color = CAPTURE_COLORS[i % CAPTURE_COLORS.length]
                    return (
                      <div key={i} style={{
                        display: 'grid',
                        gridTemplateColumns: 'auto 1fr',
                        gap: 10,
                        alignItems: 'baseline',
                      }}>
                        <code style={{
                          fontSize: 12,
                          color: color.text,
                          background: color.bg,
                          border: `1px solid ${color.border}`,
                          padding: '2px 6px',
                          borderRadius: 4,
                          whiteSpace: 'nowrap',
                          fontFamily: 'inherit',
                        }}>
                          {e.part}
                        </code>
                        <span style={{ fontSize: 12, color: FGMUTE_DEFAULT, lineHeight: 1.5 }}>
                          {e.meaning}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
