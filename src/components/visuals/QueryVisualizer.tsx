'use client'
import { useState } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────────

export type QueryExample = {
  id: string
  label: string
  query: string
  description?: string
  planSteps: Array<{
    id: string
    operation: string
    target?: string
    cost?: string
    rows?: number
    width?: number
    tip?: string
    isBottleneck?: boolean
  }>
  optimizedQuery?: string
  optimizationTips?: string[]
}

interface QueryVisualizerProps {
  examples: QueryExample[]
  accentColor?: string
  bgColor?: string
  cardColor?: string
  title?: string
  description?: string
  dialect?: string
}

// ── Paleta ───────────────────────────────────────────────────────────────────────

const BG_DEFAULT     = '#0f172a'
const CARD_DEFAULT   = '#1e293b'
const LINE_DEFAULT   = '#334155'
const FG_DEFAULT     = '#e2e8f0'
const FGMUTE_DEFAULT = '#94a3b8'
const MONO           = "'JetBrains Mono', monospace"

// ── Helpers ───────────────────────────────────────────────────────────────────────

const SQL_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'FULL',
  'ON', 'AND', 'OR', 'NOT', 'IN', 'EXISTS', 'GROUP BY', 'ORDER BY', 'HAVING',
  'LIMIT', 'OFFSET', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE',
  'CREATE', 'TABLE', 'INDEX', 'EXPLAIN', 'ANALYZE', 'AS', 'DISTINCT', 'COUNT',
  'SUM', 'AVG', 'MAX', 'MIN', 'COALESCE', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
  'UNION', 'ALL', 'WITH', 'RETURNING',
]

function highlightSQL(query: string, accentColor: string): React.ReactNode {
  const lines = query.split('\n')
  return (
    <>
      {lines.map((line, li) => {
        let remaining = line
        const parts: { text: string; color: string }[] = []
        const pattern = new RegExp(`\\b(${SQL_KEYWORDS.join('|')})\\b`, 'gi')
        let pos = 0
        let m: RegExpExecArray | null
        pattern.lastIndex = 0
        while ((m = pattern.exec(line)) !== null) {
          if (m.index > pos) {
            parts.push({ text: line.slice(pos, m.index), color: FG_DEFAULT })
          }
          parts.push({ text: m[0], color: accentColor })
          pos = m.index + m[0].length
        }
        if (pos < line.length) {
          parts.push({ text: line.slice(pos), color: FG_DEFAULT })
        }
        remaining = ''
        return (
          <div key={li} style={{ minHeight: 20 }}>
            {parts.map((p, pi) => (
              <span key={pi} style={{ color: p.color }}>{p.text}</span>
            ))}
            {remaining}
          </div>
        )
      })}
    </>
  )
}

const OPERATION_ICONS: Record<string, string> = {
  'Seq Scan':       '⟳',
  'Index Scan':     '⚡',
  'Index Only Scan':'⚡',
  'Hash Join':      '⊕',
  'Nested Loop':    '↩',
  'Merge Join':     '⊗',
  'Sort':           '⇅',
  'Hash':           '#',
  'Aggregate':      '∑',
  'Bitmap Heap Scan': '⬛',
  'Bitmap Index Scan': '⬛',
  'Limit':          '⊢',
}

function opIcon(op: string): string {
  for (const [key, icon] of Object.entries(OPERATION_ICONS)) {
    if (op.toLowerCase().includes(key.toLowerCase())) return icon
  }
  return '○'
}

// ── Componente ───────────────────────────────────────────────────────────────────

export function QueryVisualizer({
  examples,
  accentColor = '#ef4444',
  bgColor     = BG_DEFAULT,
  cardColor   = CARD_DEFAULT,
  title,
  description,
  dialect     = 'PostgreSQL',
}: QueryVisualizerProps) {
  const [exIdx, setExIdx]       = useState(0)
  const [showOptimized, setShowOptimized] = useState(false)

  const ex = examples[exIdx]

  const handleExample = (i: number) => {
    setExIdx(i)
    setShowOptimized(false)
  }

  const displayQuery = showOptimized && ex.optimizedQuery ? ex.optimizedQuery : ex.query

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

      {/* Badge dialect + toggle otimizado */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{
          fontSize: 11,
          color: accentColor,
          fontWeight: 700,
          letterSpacing: '.12em',
          textTransform: 'uppercase',
        }}>
          {dialect} · EXPLAIN ANALYZE
        </span>
        {ex.optimizedQuery && (
          <button
            onClick={() => setShowOptimized(v => !v)}
            style={{
              padding: '5px 12px',
              borderRadius: 6,
              border: `1px solid ${showOptimized ? '#86efac60' : LINE_DEFAULT}`,
              background: showOptimized ? '#86efac20' : `${cardColor}80`,
              color: showOptimized ? '#86efac' : FGMUTE_DEFAULT,
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all .2s',
            }}
          >
            {showOptimized ? '← query original' : 'ver versão otimizada →'}
          </button>
        )}
      </div>

      <div style={{
        background: bgColor,
        border: `1px solid ${LINE_DEFAULT}`,
        borderRadius: 14,
        overflow: 'hidden',
      }}>
        {/* Query */}
        <div style={{
          background: '#0a0f1e',
          padding: '18px 20px',
          borderBottom: `1px solid ${LINE_DEFAULT}`,
          fontSize: 12.5,
          lineHeight: 1.75,
          overflowX: 'auto',
        }}>
          {highlightSQL(displayQuery, accentColor)}
        </div>

        {/* Descrição */}
        {ex.description && (
          <div style={{
            padding: '12px 20px',
            fontSize: 12.5,
            color: FGMUTE_DEFAULT,
            borderBottom: `1px solid ${LINE_DEFAULT}`,
            lineHeight: 1.6,
          }}>
            {ex.description}
          </div>
        )}

        {/* Plano de execução */}
        <div style={{ padding: '20px' }}>
          <div style={{
            fontSize: 11,
            color: FGMUTE_DEFAULT,
            fontWeight: 700,
            letterSpacing: '.12em',
            textTransform: 'uppercase',
            marginBottom: 14,
          }}>
            Plano de Execução
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ex.planSteps.map((ps, i) => (
              <div key={ps.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                {/* Linha vertical de conexão */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 4 }}>
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: ps.isBottleneck ? '#ef444420' : `${cardColor}`,
                    border: `2px solid ${ps.isBottleneck ? '#ef4444' : LINE_DEFAULT}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    flexShrink: 0,
                  }}>
                    {opIcon(ps.operation)}
                  </div>
                  {i < ex.planSteps.length - 1 && (
                    <div style={{ width: 2, flex: 1, minHeight: 12, background: LINE_DEFAULT, marginTop: 4 }} />
                  )}
                </div>

                {/* Bloco de operação */}
                <div style={{
                  flex: 1,
                  background: ps.isBottleneck ? '#ef444410' : `${cardColor}80`,
                  border: `1px solid ${ps.isBottleneck ? '#ef444440' : LINE_DEFAULT}`,
                  borderRadius: 8,
                  padding: '10px 14px',
                  marginBottom: i < ex.planSteps.length - 1 ? 4 : 0,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <div>
                      <span style={{
                        fontSize: 12.5,
                        fontWeight: 700,
                        color: ps.isBottleneck ? '#ef4444' : FG_DEFAULT,
                      }}>
                        {ps.operation}
                      </span>
                      {ps.target && (
                        <span style={{ fontSize: 12, color: accentColor, marginLeft: 8 }}>
                          on {ps.target}
                        </span>
                      )}
                      {ps.isBottleneck && (
                        <span style={{
                          marginLeft: 8,
                          fontSize: 10,
                          fontWeight: 700,
                          color: '#ef4444',
                          background: '#ef444420',
                          padding: '2px 6px',
                          borderRadius: 4,
                          letterSpacing: '.08em',
                        }}>
                          GARGALO
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 12, fontSize: 11, color: FGMUTE_DEFAULT }}>
                      {ps.cost && <span>custo: <strong style={{ color: ps.isBottleneck ? '#ef4444' : FG_DEFAULT }}>{ps.cost}</strong></span>}
                      {ps.rows !== undefined && <span>linhas: <strong style={{ color: FG_DEFAULT }}>{ps.rows.toLocaleString('pt-BR')}</strong></span>}
                      {ps.width !== undefined && <span>width: <strong style={{ color: FG_DEFAULT }}>{ps.width}</strong></span>}
                    </div>
                  </div>
                  {ps.tip && (
                    <div style={{ fontSize: 11.5, color: FGMUTE_DEFAULT, marginTop: 6, lineHeight: 1.5 }}>
                      💡 {ps.tip}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dicas de otimização */}
        {ex.optimizationTips && ex.optimizationTips.length > 0 && (
          <div style={{
            padding: '16px 20px',
            borderTop: `1px solid ${LINE_DEFAULT}`,
            background: '#86efac08',
          }}>
            <div style={{ fontSize: 11, color: '#86efac', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 10 }}>
              Dicas de Otimização
            </div>
            <ul style={{ margin: 0, padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {ex.optimizationTips.map((tip, i) => (
                <li key={i} style={{ fontSize: 12.5, color: FGMUTE_DEFAULT, lineHeight: 1.6 }}>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
