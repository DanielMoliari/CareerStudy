'use client'
import { useState, useRef, useEffect } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────────

export type CodeStep = {
  lineStart: number
  lineEnd?: number
  title: string
  explanation: string
  output?: string
  callStack?: string[]
  memory?: Record<string, string>
}

export type CodeStepperScenario = {
  id: string
  label: string
  code: string
  language?: string
  steps: CodeStep[]
}

interface CodeStepperProps {
  scenarios: CodeStepperScenario[]
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

// ── Helpers ───────────────────────────────────────────────────────────────────────

function highlightLine(line: string): React.ReactNode {
  // Coloração básica de syntax — keywords, strings, comentários, números
  const tokens: { text: string; color: string }[] = []
  const keywords = /\b(const|let|var|function|return|async|await|if|else|for|while|of|in|new|class|import|export|from|try|catch|throw|typeof|instanceof|true|false|null|undefined|Promise|setTimeout|console|void|type|interface|extends)\b/g
  const stringRx  = /(["'`][^"'`\n]*["'`])/g
  const commentRx = /(\/\/.*$)/
  const numberRx  = /\b(\d+(\.\d+)?)\b/g

  if (commentRx.test(line)) {
    const match = line.match(commentRx)!
    const before = line.slice(0, line.indexOf(match[0]))
    tokens.push({ text: before, color: FG_DEFAULT })
    tokens.push({ text: match[0], color: '#475569' })
    return tokens.map((t, i) => <span key={i} style={{ color: t.color }}>{t.text}</span>)
  }

  // Tokenização simples: split por fronteiras de palavras-chave / strings
  let remaining = line
  const parts: { text: string; color: string }[] = []
  let pos = 0

  // Combinar strings, keywords e números numa única passagem
  const combined = new RegExp(
    `${stringRx.source}|${keywords.source}|${numberRx.source}`,
    'g',
  )
  let m: RegExpExecArray | null
  combined.lastIndex = 0
  while ((m = combined.exec(line)) !== null) {
    if (m.index > pos) {
      parts.push({ text: line.slice(pos, m.index), color: FG_DEFAULT })
    }
    const word = m[0]
    if (/^["'`]/.test(word)) {
      parts.push({ text: word, color: '#86efac' })
    } else if (/^\d/.test(word)) {
      parts.push({ text: word, color: '#fbbf24' })
    } else {
      parts.push({ text: word, color: '#93c5fd' })
    }
    pos = m.index + word.length
    remaining = line.slice(pos)
  }
  if (pos < line.length) {
    parts.push({ text: line.slice(pos), color: FG_DEFAULT })
  }

  return parts.map((t, i) => <span key={i} style={{ color: t.color }}>{t.text}</span>)
}

// ── Componente ───────────────────────────────────────────────────────────────────

export function CodeStepper({
  scenarios,
  accentColor = '#ef4444',
  bgColor     = BG_DEFAULT,
  cardColor   = CARD_DEFAULT,
  title,
  description,
}: CodeStepperProps) {
  const [scenIdx, setScenIdx] = useState(0)
  const [stepIdx, setStepIdx] = useState(0)
  const lineRefs              = useRef<Record<number, HTMLDivElement | null>>({})

  const scenario = scenarios[scenIdx]
  const step     = scenario.steps[stepIdx]
  const lines    = scenario.code.split('\n')
  const lineEnd  = step.lineEnd ?? step.lineStart

  // Auto-scroll para a linha destacada
  useEffect(() => {
    const el = lineRefs.current[step.lineStart - 1]
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [stepIdx, scenIdx, step.lineStart])

  const prevStep = () => setStepIdx(i => Math.max(0, i - 1))
  const nextStep = () => setStepIdx(i => Math.min(scenario.steps.length - 1, i + 1))

  const handleScenario = (i: number) => {
    setScenIdx(i)
    setStepIdx(0)
    lineRefs.current = {}
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

      {/* Seletor de cenário */}
      {scenarios.length > 1 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {scenarios.map((s, i) => (
            <button
              key={s.id}
              onClick={() => handleScenario(i)}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                border: `1px solid ${i === scenIdx ? accentColor : LINE_DEFAULT}`,
                background: i === scenIdx ? `${accentColor}20` : `${cardColor}80`,
                color: i === scenIdx ? accentColor : FGMUTE_DEFAULT,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all .2s',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      {/* Corpo principal */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
        background: bgColor,
        border: `1px solid ${LINE_DEFAULT}`,
        borderRadius: 14,
        overflow: 'hidden',
      }}>
        {/* Painel esquerdo — código */}
        <div style={{
          background: '#0a0f1e',
          padding: '20px 0',
          overflowY: 'auto',
          maxHeight: 420,
        }}>
          <div style={{
            fontSize: 11,
            color: FGMUTE_DEFAULT,
            padding: '0 16px 12px',
            borderBottom: `1px solid ${LINE_DEFAULT}`,
            marginBottom: 8,
            fontWeight: 700,
            letterSpacing: '.1em',
            textTransform: 'uppercase',
          }}>
            {scenario.language ?? 'typescript'}
          </div>
          {lines.map((line, i) => {
            const lineNum    = i + 1
            const isActive   = lineNum >= step.lineStart && lineNum <= lineEnd
            return (
              <div
                key={i}
                ref={el => { lineRefs.current[i] = el }}
                style={{
                  display: 'flex',
                  background: isActive ? `${accentColor}18` : 'transparent',
                  borderLeft: isActive ? `3px solid ${accentColor}` : '3px solid transparent',
                  padding: '1px 16px 1px 12px',
                  transition: 'background .25s',
                  minHeight: 22,
                }}
              >
                <span style={{
                  width: 32,
                  color: isActive ? accentColor : '#475569',
                  fontSize: 11,
                  userSelect: 'none',
                  flexShrink: 0,
                  fontWeight: isActive ? 700 : 400,
                }}>
                  {lineNum}
                </span>
                <span style={{ fontSize: 12.5, whiteSpace: 'pre', tabSize: 2 }}>
                  {highlightLine(line)}
                </span>
              </div>
            )
          })}
        </div>

        {/* Painel direito — info */}
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Cabeçalho do passo */}
          <div>
            <div style={{
              fontSize: 11,
              color: accentColor,
              fontWeight: 700,
              letterSpacing: '.12em',
              textTransform: 'uppercase',
              marginBottom: 6,
            }}>
              Passo {stepIdx + 1} / {scenario.steps.length}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: FG_DEFAULT, marginBottom: 10 }}>
              {step.title}
            </div>
            <p style={{ fontSize: 12.5, color: FGMUTE_DEFAULT, lineHeight: 1.7, margin: 0 }}>
              {step.explanation}
            </p>
          </div>

          {/* Output */}
          {step.output && (
            <div style={{
              background: '#0a0f1e',
              borderRadius: 8,
              padding: '10px 14px',
              border: `1px solid ${LINE_DEFAULT}`,
            }}>
              <div style={{ fontSize: 10, color: FGMUTE_DEFAULT, fontWeight: 700, marginBottom: 6, letterSpacing: '.1em', textTransform: 'uppercase' }}>
                Output
              </div>
              <code style={{ fontSize: 12, color: '#86efac', whiteSpace: 'pre-wrap' }}>
                {step.output}
              </code>
            </div>
          )}

          {/* Call Stack */}
          {step.callStack && step.callStack.length > 0 && (
            <div>
              <div style={{ fontSize: 10, color: FGMUTE_DEFAULT, fontWeight: 700, marginBottom: 8, letterSpacing: '.1em', textTransform: 'uppercase' }}>
                Call Stack
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {[...step.callStack].reverse().map((frame, i) => (
                  <div key={i} style={{
                    padding: '6px 12px',
                    background: i === 0 ? `${accentColor}20` : `${cardColor}60`,
                    borderRadius: 6,
                    border: `1px solid ${i === 0 ? accentColor + '50' : LINE_DEFAULT}`,
                    fontSize: 11.5,
                    color: i === 0 ? accentColor : FGMUTE_DEFAULT,
                    fontWeight: i === 0 ? 700 : 400,
                  }}>
                    {i === 0 && '▶ '}{frame}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Memória */}
          {step.memory && Object.keys(step.memory).length > 0 && (
            <div>
              <div style={{ fontSize: 10, color: FGMUTE_DEFAULT, fontWeight: 700, marginBottom: 8, letterSpacing: '.1em', textTransform: 'uppercase' }}>
                Memória
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {Object.entries(step.memory).map(([k, v]) => (
                  <div key={k} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '5px 10px',
                    background: `${cardColor}60`,
                    borderRadius: 6,
                    fontSize: 11.5,
                  }}>
                    <span style={{ color: '#93c5fd', fontWeight: 600 }}>{k}</span>
                    <span style={{ color: '#86efac' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controles */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
        <button
          onClick={prevStep}
          disabled={stepIdx === 0}
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            border: `2px solid ${stepIdx === 0 ? LINE_DEFAULT : accentColor + '50'}`,
            background: stepIdx === 0 ? 'transparent' : `${accentColor}15`,
            color: stepIdx === 0 ? LINE_DEFAULT : accentColor,
            fontSize: 20,
            cursor: stepIdx === 0 ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all .2s',
          }}
        >
          ◀
        </button>

        <div style={{ display: 'flex', gap: 6 }}>
          {scenario.steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setStepIdx(i)}
              style={{
                width: i === stepIdx ? 28 : 8,
                height: 8,
                borderRadius: 4,
                border: 'none',
                background: i === stepIdx ? accentColor : LINE_DEFAULT,
                cursor: 'pointer',
                transition: 'all .3s',
                padding: 0,
              }}
            />
          ))}
        </div>

        <button
          onClick={nextStep}
          disabled={stepIdx === scenario.steps.length - 1}
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            border: `2px solid ${stepIdx === scenario.steps.length - 1 ? LINE_DEFAULT : accentColor + '50'}`,
            background: stepIdx === scenario.steps.length - 1 ? 'transparent' : `${accentColor}15`,
            color: stepIdx === scenario.steps.length - 1 ? LINE_DEFAULT : accentColor,
            fontSize: 20,
            cursor: stepIdx === scenario.steps.length - 1 ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all .2s',
          }}
        >
          ▶
        </button>
      </div>
    </div>
  )
}
