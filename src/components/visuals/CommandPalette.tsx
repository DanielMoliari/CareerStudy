'use client'
import { useState, useRef, useEffect, useCallback } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────────

export type CLICommand = {
  command: string
  aliases?: string[]
  description: string
  output: string
  outputType?: 'text' | 'table' | 'json' | 'error'
  category?: string
  flags?: Array<{
    flag: string
    description: string
  }>
}

interface CommandPaletteProps {
  commands: CLICommand[]
  prompt?: string
  accentColor?: string
  bgColor?: string
  cardColor?: string
  title?: string
  description?: string
  placeholder?: string
}

// ── Paleta ───────────────────────────────────────────────────────────────────────

const BG_DEFAULT     = '#0f172a'
const CARD_DEFAULT   = '#1e293b'
const LINE_DEFAULT   = '#334155'
const FG_DEFAULT     = '#e2e8f0'
const FGMUTE_DEFAULT = '#94a3b8'
const MONO           = "'JetBrains Mono', monospace"

// ── Helpers de renderização de output ────────────────────────────────────────────

function renderJSON(text: string, accentColor: string): React.ReactNode {
  const lines = text.split('\n')
  return (
    <>
      {lines.map((line, i) => {
        // Coloração básica de JSON
        const keyMatch   = line.match(/^(\s*)"([^"]+)"\s*:/)
        const strVal     = line.match(/:\s*"([^"]*)"/)
        const numVal     = line.match(/:\s*(\d+(?:\.\d+)?)/)
        const boolVal    = line.match(/:\s*(true|false|null)/)

        let colored: React.ReactNode = line
        if (keyMatch) {
          const parts = line.split(keyMatch[2])
          colored = (
            <>
              <span style={{ color: FGMUTE_DEFAULT }}>{parts[0]}"</span>
              <span style={{ color: accentColor }}>{keyMatch[2]}</span>
              <span style={{ color: FGMUTE_DEFAULT }}>"</span>
              <span style={{ color: FG_DEFAULT }}>{line.slice(keyMatch[0].length - 0)}</span>
            </>
          )
        }
        if (strVal) colored = <span style={{ color: '#86efac' }}>{line}</span>
        if (numVal && !strVal) colored = <span style={{ color: '#fbbf24' }}>{line}</span>
        if (boolVal && !strVal) colored = <span style={{ color: '#93c5fd' }}>{line}</span>

        return <div key={i} style={{ minHeight: 18 }}>{colored}</div>
      })}
    </>
  )
}

function renderTable(text: string): React.ReactNode {
  const rows = text.split('\n').filter(Boolean)
  if (rows.length === 0) return <span style={{ color: FG_DEFAULT }}>{text}</span>

  return (
    <div style={{ overflowX: 'auto' }}>
      {rows.map((row, i) => {
        const isSeparator = /^[-|+\s]+$/.test(row)
        const cells = row.split(/\s{2,}|\t/).filter(Boolean)
        return (
          <div key={i} style={{
            display: 'flex',
            gap: 0,
            borderBottom: isSeparator ? `1px solid ${LINE_DEFAULT}` : 'none',
            padding: isSeparator ? '0' : '2px 0',
          }}>
            {isSeparator
              ? <span style={{ color: LINE_DEFAULT, letterSpacing: '.05em' }}>{row}</span>
              : cells.map((cell, ci) => (
                  <span key={ci} style={{
                    color: i === 0 ? FG_DEFAULT : FGMUTE_DEFAULT,
                    fontWeight: i === 0 ? 700 : 400,
                    minWidth: 120,
                    paddingRight: 16,
                    fontSize: 12,
                  }}>
                    {cell}
                  </span>
                ))
            }
          </div>
        )
      })}
    </div>
  )
}

// ── Componente ───────────────────────────────────────────────────────────────────

export function CommandPalette({
  commands,
  prompt      = '$ ',
  accentColor = '#ef4444',
  bgColor     = BG_DEFAULT,
  cardColor   = CARD_DEFAULT,
  title,
  description,
  placeholder = 'Digite um comando...',
}: CommandPaletteProps) {
  const [input, setInput]           = useState('')
  const [history, setHistory]       = useState<{ cmd: string; output: string; outputType: CLICommand['outputType']; description: string }[]>([])
  const [suggestions, setSuggestions] = useState<CLICommand[]>([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const [animating, setAnimating]   = useState(false)
  const [displayedOutput, setDisplayedOutput] = useState('')
  const inputRef                    = useRef<HTMLInputElement>(null)
  const bottomRef                   = useRef<HTMLDivElement>(null)

  const allMatchers = useCallback((cmd: CLICommand) => {
    return [cmd.command, ...(cmd.aliases ?? [])]
  }, [])

  const findCommand = useCallback((text: string): CLICommand | undefined => {
    const t = text.trim().toLowerCase()
    return commands.find(c => allMatchers(c).some(m => m.toLowerCase() === t))
  }, [commands, allMatchers])

  const getSuggestions = useCallback((text: string): CLICommand[] => {
    const t = text.trim().toLowerCase()
    if (!t) return []
    return commands.filter(c =>
      allMatchers(c).some(m => m.toLowerCase().startsWith(t)),
    ).slice(0, 6)
  }, [commands, allMatchers])

  useEffect(() => {
    setSuggestions(getSuggestions(input))
    setHistoryIdx(-1)
  }, [input, getSuggestions])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, displayedOutput])

  const animateOutput = useCallback((text: string, onDone: () => void) => {
    const lines = text.split('\n')
    let lineIdx = 0
    setDisplayedOutput('')
    setAnimating(true)

    const tick = () => {
      if (lineIdx >= lines.length) {
        setAnimating(false)
        setDisplayedOutput('')
        onDone()
        return
      }
      setDisplayedOutput(lines.slice(0, lineIdx + 1).join('\n'))
      lineIdx++
      setTimeout(tick, 40)
    }
    tick()
  }, [])

  const executeCommand = useCallback((cmdText: string) => {
    const text = cmdText.trim()
    if (!text) return
    const cmd = findCommand(text)

    if (text === 'clear') {
      setHistory([])
      setInput('')
      setCmdHistory(h => [text, ...h])
      return
    }

    if (text === 'help') {
      const helpOutput = commands.map(c => `${c.command.padEnd(28)} ${c.description}`).join('\n')
      animateOutput(helpOutput, () => {
        setHistory(h => [...h, { cmd: text, output: helpOutput, outputType: 'text', description: 'Comandos disponíveis' }])
      })
      setCmdHistory(h => [text, ...h])
      setInput('')
      return
    }

    if (!cmd) {
      const errOutput = `command not found: ${text}`
      setHistory(h => [...h, { cmd: text, output: errOutput, outputType: 'error', description: '' }])
      setCmdHistory(h => [text, ...h])
      setInput('')
      return
    }

    animateOutput(cmd.output, () => {
      setHistory(h => [...h, {
        cmd: text,
        output: cmd.output,
        outputType: cmd.outputType ?? 'text',
        description: cmd.description,
      }])
    })
    setCmdHistory(h => [text, ...h])
    setInput('')
    setSuggestions([])
  }, [commands, findCommand, animateOutput])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      executeCommand(input)
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const idx = Math.min(historyIdx + 1, cmdHistory.length - 1)
      setHistoryIdx(idx)
      setInput(cmdHistory[idx] ?? '')
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const idx = Math.max(historyIdx - 1, -1)
      setHistoryIdx(idx)
      setInput(idx === -1 ? '' : cmdHistory[idx] ?? '')
      return
    }
    if (e.key === 'Tab') {
      e.preventDefault()
      if (suggestions.length > 0) {
        setInput(suggestions[0].command)
        setSuggestions([])
      }
    }
    if (e.key === 'Escape') {
      setSuggestions([])
    }
  }

  const renderOutput = (out: string, type: CLICommand['outputType']): React.ReactNode => {
    if (type === 'json')  return renderJSON(out, accentColor)
    if (type === 'table') return renderTable(out)
    return (
      <>
        {out.split('\n').map((line, i) => (
          <div key={i} style={{ minHeight: 18 }}>{line || ' '}</div>
        ))}
      </>
    )
  }

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

      {/* Terminal */}
      <div style={{
        background: '#0a0f1e',
        borderRadius: 14,
        border: `1px solid ${LINE_DEFAULT}`,
        overflow: 'hidden',
      }}>
        {/* Barra de título */}
        <div style={{
          background: cardColor,
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          borderBottom: `1px solid ${LINE_DEFAULT}`,
        }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#fbbf24' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#86efac' }} />
          <span style={{ marginLeft: 12, fontSize: 11, color: FGMUTE_DEFAULT, fontWeight: 600, letterSpacing: '.08em' }}>
            Terminal
          </span>
          <span style={{ marginLeft: 'auto', fontSize: 10, color: '#475569' }}>
            ↑ histórico · Tab autocomplete · help · clear
          </span>
        </div>

        {/* Histórico de saídas */}
        <div
          onClick={() => inputRef.current?.focus()}
          style={{
            padding: '16px',
            minHeight: 220,
            maxHeight: 380,
            overflowY: 'auto',
            cursor: 'text',
          }}
        >
          {history.length === 0 && !animating && (
            <div style={{ color: '#475569', fontSize: 12, marginBottom: 8 }}>
              Digite um comando ou <span style={{ color: accentColor }}>help</span> para ver a lista.
            </div>
          )}

          {history.map((h, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 13, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: accentColor, fontWeight: 700 }}>{prompt}</span>
                <span style={{ color: FG_DEFAULT }}>{h.cmd}</span>
                {h.description && (
                  <span style={{ color: '#475569', fontSize: 11 }}>— {h.description}</span>
                )}
              </div>
              <div style={{
                fontSize: 12,
                lineHeight: 1.7,
                color: h.outputType === 'error' ? '#ef4444' : FGMUTE_DEFAULT,
                paddingLeft: 4,
                borderLeft: `2px solid ${h.outputType === 'error' ? '#ef444430' : LINE_DEFAULT}`,
                marginLeft: 4,
              }}>
                {renderOutput(h.output, h.outputType)}
              </div>
            </div>
          ))}

          {/* Output animado */}
          {animating && displayedOutput && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, lineHeight: 1.7, color: FGMUTE_DEFAULT, paddingLeft: 4 }}>
                {displayedOutput.split('\n').map((line, i) => (
                  <div key={i}>{line || ' '}</div>
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Campo de input */}
        <div style={{
          borderTop: `1px solid ${LINE_DEFAULT}`,
          padding: '12px 16px',
          position: 'relative',
        }}>
          {/* Sugestões de autocomplete */}
          {suggestions.length > 0 && (
            <div style={{
              position: 'absolute',
              bottom: '100%',
              left: 16,
              right: 16,
              background: cardColor,
              border: `1px solid ${LINE_DEFAULT}`,
              borderRadius: '8px 8px 0 0',
              overflow: 'hidden',
              marginBottom: -1,
            }}>
              {suggestions.map((s, i) => (
                <button
                  key={s.command}
                  onClick={() => { setInput(s.command); setSuggestions([]); inputRef.current?.focus() }}
                  style={{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    gap: 12,
                    padding: '8px 14px',
                    background: i === 0 ? `${accentColor}12` : 'transparent',
                    border: 'none',
                    borderBottom: `1px solid ${LINE_DEFAULT}30`,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: 12.5, color: i === 0 ? accentColor : FG_DEFAULT, fontWeight: 600 }}>
                    {s.command}
                  </span>
                  {s.category && (
                    <span style={{ fontSize: 10, color: '#475569', background: `${LINE_DEFAULT}60`, padding: '1px 6px', borderRadius: 4 }}>
                      {s.category}
                    </span>
                  )}
                  <span style={{ fontSize: 11, color: FGMUTE_DEFAULT, marginLeft: 'auto' }}>
                    {s.description}
                  </span>
                </button>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: accentColor, fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{prompt}</span>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={animating}
              placeholder={animating ? 'executando...' : placeholder}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: FG_DEFAULT,
                fontSize: 13,
                fontFamily: 'inherit',
                caretColor: accentColor,
              }}
            />
            <button
              onClick={() => executeCommand(input)}
              disabled={animating || !input.trim()}
              style={{
                padding: '5px 14px',
                borderRadius: 6,
                border: `1px solid ${accentColor}40`,
                background: `${accentColor}15`,
                color: accentColor,
                fontSize: 11,
                fontWeight: 700,
                cursor: animating || !input.trim() ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                opacity: animating || !input.trim() ? 0.4 : 1,
                transition: 'all .2s',
              }}
            >
              Executar ↵
            </button>
          </div>
        </div>
      </div>

      {/* Atalhos rápidos */}
      {commands.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 11, color: FGMUTE_DEFAULT, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 10 }}>
            Comandos rápidos
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {commands.slice(0, 8).map(c => (
              <button
                key={c.command}
                onClick={() => { setInput(c.command); inputRef.current?.focus() }}
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  border: `1px solid ${LINE_DEFAULT}`,
                  background: `${cardColor}60`,
                  color: FGMUTE_DEFAULT,
                  fontSize: 11,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all .2s',
                }}
              >
                {c.command}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
