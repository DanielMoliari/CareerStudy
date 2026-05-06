'use client'
import { useState, useMemo } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────────

export type DiffLine = {
  type: 'added' | 'removed' | 'unchanged' | 'header'
  content: string
  lineNum?: number
}

export type DiffExample = {
  id: string
  label: string
  description?: string
  beforeLabel?: string
  afterLabel?: string
  before: string
  after: string
  explanation?: string
  tags?: string[]
}

interface DiffViewerProps {
  examples: DiffExample[]
  accentColor?: string
  bgColor?: string
  cardColor?: string
  title?: string
  description?: string
  mode?: 'split' | 'unified'
}

// ── Paleta ───────────────────────────────────────────────────────────────────────

const BG_DEFAULT     = '#0f172a'
const CARD_DEFAULT   = '#1e293b'
const LINE_DEFAULT   = '#334155'
const FG_DEFAULT     = '#e2e8f0'
const FGMUTE_DEFAULT = '#94a3b8'
const MONO           = "'JetBrains Mono', monospace"

const COLOR_ADDED   = { bg: '#86efac10', border: '#86efac30', text: '#86efac', num: '#166534' }
const COLOR_REMOVED = { bg: '#ef444410', border: '#ef444430', text: '#ef4444', num: '#7f1d1d' }
const COLOR_HEADER  = { bg: '#1e3a5f20', border: '#1e3a5f60', text: '#93c5fd', num: '#1e3a5f' }

// ── Algoritmo de diff simples (LCS) ──────────────────────────────────────────────

function computeDiff(before: string, after: string): DiffLine[] {
  const bLines = before.split('\n')
  const aLines = after.split('\n')

  // LCS dinâmico
  const m = bLines.length
  const n = aLines.length
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (bLines[i - 1] === aLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }

  // Traceback
  const result: DiffLine[] = []
  let i = m, j = n
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && bLines[i - 1] === aLines[j - 1]) {
      result.unshift({ type: 'unchanged', content: bLines[i - 1] })
      i--; j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: 'added', content: aLines[j - 1] })
      j--
    } else {
      result.unshift({ type: 'removed', content: bLines[i - 1] })
      i--
    }
  }
  return result
}

function computeSplitLines(before: string, after: string) {
  const bLines = before.split('\n')
  const aLines = after.split('\n')
  const diff = computeDiff(before, after)

  // Construir linhas numeradas para cada lado
  const leftLines:  { content: string; type: DiffLine['type']; lineNum: number | null }[] = []
  const rightLines: { content: string; type: DiffLine['type']; lineNum: number | null }[] = []

  let lNum = 1, rNum = 1
  for (const d of diff) {
    if (d.type === 'unchanged') {
      leftLines.push({ content: d.content, type: 'unchanged', lineNum: lNum++ })
      rightLines.push({ content: d.content, type: 'unchanged', lineNum: rNum++ })
    } else if (d.type === 'removed') {
      leftLines.push({ content: d.content, type: 'removed', lineNum: lNum++ })
      rightLines.push({ content: '', type: 'unchanged', lineNum: null })
    } else {
      leftLines.push({ content: '', type: 'unchanged', lineNum: null })
      rightLines.push({ content: d.content, type: 'added', lineNum: rNum++ })
    }
  }

  // Silencia variáveis não usadas diretamente (usadas indiretamente via diff)
  void bLines; void aLines

  return { leftLines, rightLines }
}

// ── Sub-componente de linha ───────────────────────────────────────────────────────

function DiffLineRow({ content, type, lineNum }: {
  content: string
  type: DiffLine['type']
  lineNum: number | null
}) {
  const colors =
    type === 'added'   ? COLOR_ADDED   :
    type === 'removed' ? COLOR_REMOVED :
    type === 'header'  ? COLOR_HEADER  :
    null

  return (
    <div style={{
      display: 'flex',
      background: colors ? `${colors.bg}` : 'transparent',
      borderBottom: `1px solid ${colors ? colors.border : LINE_DEFAULT + '30'}`,
      minHeight: 22,
    }}>
      <div style={{
        width: 42,
        padding: '1px 8px',
        textAlign: 'right',
        color: colors ? colors.num : '#475569',
        fontSize: 11,
        userSelect: 'none',
        flexShrink: 0,
        borderRight: `1px solid ${LINE_DEFAULT}30`,
        background: '#00000020',
      }}>
        {lineNum ?? ''}
      </div>
      <div style={{
        width: 18,
        textAlign: 'center',
        fontSize: 12,
        color: colors ? colors.text : 'transparent',
        flexShrink: 0,
        fontWeight: 700,
      }}>
        {type === 'added' ? '+' : type === 'removed' ? '−' : type === 'header' ? '@' : ' '}
      </div>
      <div style={{
        flex: 1,
        padding: '1px 8px',
        fontSize: 12,
        color: colors ? colors.text : FGMUTE_DEFAULT,
        whiteSpace: 'pre',
        overflowX: 'auto',
      }}>
        {content}
      </div>
    </div>
  )
}

// ── Componente principal ──────────────────────────────────────────────────────────

export function DiffViewer({
  examples,
  accentColor = '#ef4444',
  bgColor     = BG_DEFAULT,
  cardColor   = CARD_DEFAULT,
  title,
  description,
  mode: modeProp = 'split',
}: DiffViewerProps) {
  const [exIdx, setExIdx] = useState(0)
  const [mode, setMode]   = useState<'split' | 'unified'>(modeProp)

  const ex = examples[exIdx]
  const diffLines = useMemo(() => computeDiff(ex.before, ex.after), [ex])
  const splitData = useMemo(() => computeSplitLines(ex.before, ex.after), [ex])

  const beforeLabel = ex.beforeLabel ?? 'Antes'
  const afterLabel  = ex.afterLabel  ?? 'Depois'

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

      {/* Controles superiores */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
        {/* Seletor de exemplo */}
        {examples.length > 1 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {examples.map((e, i) => (
              <button
                key={e.id}
                onClick={() => setExIdx(i)}
                style={{
                  padding: '5px 12px',
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

        {/* Toggle modo */}
        <div style={{ display: 'flex', gap: 4 }}>
          {(['split', 'unified'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                padding: '5px 12px',
                borderRadius: 6,
                border: `1px solid ${mode === m ? accentColor : LINE_DEFAULT}`,
                background: mode === m ? `${accentColor}20` : 'transparent',
                color: mode === m ? accentColor : FGMUTE_DEFAULT,
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all .2s',
              }}
            >
              {m === 'split' ? '⊟ Split' : '≡ Unified'}
            </button>
          ))}
        </div>
      </div>

      {/* Descrição do exemplo */}
      {ex.description && (
        <div style={{ fontSize: 13, color: FGMUTE_DEFAULT, marginBottom: 12, lineHeight: 1.6 }}>
          {ex.description}
        </div>
      )}

      {/* Diff */}
      <div style={{
        background: bgColor,
        border: `1px solid ${LINE_DEFAULT}`,
        borderRadius: 12,
        overflow: 'hidden',
      }}>
        {mode === 'split' ? (
          /* Modo side-by-side */
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            {/* Cabeçalho esquerdo */}
            <div style={{
              padding: '10px 16px',
              borderBottom: `1px solid ${LINE_DEFAULT}`,
              borderRight: `1px solid ${LINE_DEFAULT}`,
              background: '#ef444410',
              fontSize: 12,
              fontWeight: 700,
              color: '#ef4444',
            }}>
              − {beforeLabel}
            </div>
            {/* Cabeçalho direito */}
            <div style={{
              padding: '10px 16px',
              borderBottom: `1px solid ${LINE_DEFAULT}`,
              background: '#86efac10',
              fontSize: 12,
              fontWeight: 700,
              color: '#86efac',
            }}>
              + {afterLabel}
            </div>

            {/* Linhas lado esquerdo */}
            <div style={{ borderRight: `1px solid ${LINE_DEFAULT}`, overflowX: 'auto', maxHeight: 420, overflowY: 'auto' }}>
              {splitData.leftLines.map((l, i) => (
                <DiffLineRow key={i} content={l.content} type={l.type} lineNum={l.lineNum} />
              ))}
            </div>

            {/* Linhas lado direito */}
            <div style={{ overflowX: 'auto', maxHeight: 420, overflowY: 'auto' }}>
              {splitData.rightLines.map((l, i) => (
                <DiffLineRow
                  key={i}
                  content={l.content}
                  type={l.lineNum === null ? 'unchanged' : l.type}
                  lineNum={l.lineNum}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Modo unificado */
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '42px 42px 18px 1fr',
              padding: '10px 16px',
              borderBottom: `1px solid ${LINE_DEFAULT}`,
              background: cardColor,
              fontSize: 11,
              color: FGMUTE_DEFAULT,
              fontWeight: 700,
              letterSpacing: '.08em',
            }}>
              <span>{beforeLabel.slice(0, 3).toUpperCase()}</span>
              <span>{afterLabel.slice(0, 3).toUpperCase()}</span>
              <span />
              <span>Conteúdo</span>
            </div>
            <div style={{ maxHeight: 420, overflowY: 'auto' }}>
              {(() => {
                let lNum = 1, rNum = 1
                return diffLines.map((d, i) => {
                  const lN = d.type !== 'added'   ? lNum++ : null
                  const rN = d.type !== 'removed' ? rNum++ : null
                  const colors =
                    d.type === 'added'   ? COLOR_ADDED   :
                    d.type === 'removed' ? COLOR_REMOVED :
                    null
                  return (
                    <div key={i} style={{
                      display: 'grid',
                      gridTemplateColumns: '42px 42px 18px 1fr',
                      background: colors ? colors.bg : 'transparent',
                      borderBottom: `1px solid ${colors ? colors.border : LINE_DEFAULT + '20'}`,
                      minHeight: 22,
                    }}>
                      <div style={{ padding: '1px 8px', textAlign: 'right', fontSize: 11, color: '#475569', userSelect: 'none', borderRight: `1px solid ${LINE_DEFAULT}20` }}>
                        {d.type !== 'added' ? lN : ''}
                      </div>
                      <div style={{ padding: '1px 8px', textAlign: 'right', fontSize: 11, color: '#475569', userSelect: 'none', borderRight: `1px solid ${LINE_DEFAULT}20` }}>
                        {d.type !== 'removed' ? rN : ''}
                      </div>
                      <div style={{ textAlign: 'center', fontSize: 12, color: colors ? colors.text : 'transparent', fontWeight: 700 }}>
                        {d.type === 'added' ? '+' : d.type === 'removed' ? '−' : ' '}
                      </div>
                      <div style={{ padding: '1px 8px', fontSize: 12, color: colors ? colors.text : FGMUTE_DEFAULT, whiteSpace: 'pre', overflowX: 'auto' }}>
                        {d.content}
                      </div>
                    </div>
                  )
                })
              })()}
            </div>
          </div>
        )}
      </div>

      {/* Explicação e tags */}
      {(ex.explanation || (ex.tags && ex.tags.length > 0)) && (
        <div style={{
          marginTop: 14,
          padding: '14px 18px',
          background: `${cardColor}60`,
          border: `1px solid ${LINE_DEFAULT}`,
          borderRadius: 10,
        }}>
          {ex.tags && ex.tags.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: ex.explanation ? 10 : 0 }}>
              {ex.tags.map(tag => (
                <span key={tag} style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 4,
                  background: `${accentColor}20`,
                  color: accentColor,
                  letterSpacing: '.06em',
                  textTransform: 'uppercase',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          )}
          {ex.explanation && (
            <p style={{ fontSize: 13, color: FGMUTE_DEFAULT, margin: 0, lineHeight: 1.7 }}>
              {ex.explanation}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
