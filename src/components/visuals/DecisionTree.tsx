'use client'
import { useState, useCallback } from 'react'

// ── Paleta padrão ────────────────────────────────────────────────────────────

const BG_DEFAULT     = '#0f172a'
const CARD_DEFAULT   = '#1e293b'
const LINE_DEFAULT   = '#334155'
const FG_DEFAULT     = '#e2e8f0'
const FGMUTE_DEFAULT = '#94a3b8'
const MONO           = "'JetBrains Mono', monospace"

// ── Tipos ────────────────────────────────────────────────────────────────────

export type DTNode = {
  id: string
  question?: string
  recommendation?: string
  detail?: string
  children?: Array<{
    label: string
    nodeId: string
    color?: string
  }>
  color?: string
  icon?: string
}

interface DecisionTreeProps {
  root: DTNode
  nodes: Record<string, DTNode>
  accentColor?: string
  bgColor?: string
  cardColor?: string
  title?: string
  description?: string
}

// ── Componente ───────────────────────────────────────────────────────────────

export function DecisionTree({
  root,
  nodes,
  accentColor = '#ef4444',
  bgColor = BG_DEFAULT,
  cardColor = CARD_DEFAULT,
  title,
  description,
}: DecisionTreeProps) {
  const [history, setHistory] = useState<Array<{ node: DTNode; choiceLabel: string }>>([])
  const [current, setCurrent] = useState<DTNode>(root)
  const [animating, setAnimating] = useState(false)
  const [visible, setVisible] = useState(true)

  const choose = useCallback((childNodeId: string, choiceLabel: string) => {
    const next = nodes[childNodeId]
    if (!next || animating) return
    setAnimating(true)
    setVisible(false)
    setTimeout(() => {
      setHistory(h => [...h, { node: current, choiceLabel }])
      setCurrent(next)
      setVisible(true)
      setAnimating(false)
    }, 200)
  }, [current, nodes, animating])

  const restart = useCallback(() => {
    if (animating) return
    setAnimating(true)
    setVisible(false)
    setTimeout(() => {
      setHistory([])
      setCurrent(root)
      setVisible(true)
      setAnimating(false)
    }, 200)
  }, [root, animating])

  const goBack = useCallback(() => {
    if (animating || history.length === 0) return
    setAnimating(true)
    setVisible(false)
    setTimeout(() => {
      const prev = [...history]
      const last = prev.pop()!
      setHistory(prev)
      setCurrent(last.node)
      setVisible(true)
      setAnimating(false)
    }, 200)
  }, [history, animating])

  const isLeaf = !current.children || current.children.length === 0

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

      {/* Breadcrumb / histórico */}
      {history.length > 0 && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 4,
          alignItems: 'center',
          marginBottom: 16,
          padding: '8px 12px',
          background: `${cardColor}80`,
          borderRadius: 8,
          border: `1px solid ${LINE_DEFAULT}`,
        }}>
          <span style={{ fontSize: 10, color: FGMUTE_DEFAULT, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', marginRight: 4 }}>
            Caminho:
          </span>
          {history.map((h, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {i > 0 && <span style={{ color: LINE_DEFAULT }}>›</span>}
              <span style={{ fontSize: 11, color: accentColor, fontWeight: 600 }}>{h.choiceLabel}</span>
            </span>
          ))}
        </div>
      )}

      {/* Nó atual */}
      <div style={{
        background: bgColor,
        border: `1px solid ${current.color ? `${current.color}40` : LINE_DEFAULT}`,
        borderRadius: 16,
        padding: 28,
        boxShadow: current.color ? `0 0 40px ${current.color}18` : 'none',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity .2s ease, transform .2s ease',
      }}>
        {isLeaf ? (
          /* Nó folha — recomendação */
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 12px',
              borderRadius: 20,
              background: `${accentColor}22`,
              border: `1px solid ${accentColor}50`,
              marginBottom: 14,
            }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: accentColor, letterSpacing: '.1em', textTransform: 'uppercase' }}>
                Recomendação
              </span>
            </div>

            <h2 style={{
              fontSize: 24,
              fontWeight: 900,
              color: current.color ?? accentColor,
              margin: '0 0 16px',
              lineHeight: 1.2,
            }}>
              {current.icon && <span style={{ marginRight: 8 }}>{current.icon}</span>}
              {current.recommendation}
            </h2>

            {current.detail && (
              <p style={{
                fontSize: 13,
                color: FGMUTE_DEFAULT,
                lineHeight: 1.75,
                margin: '0 0 24px',
                padding: '14px 16px',
                background: `${cardColor}80`,
                borderRadius: 10,
                border: `1px solid ${LINE_DEFAULT}`,
              }}>
                {current.detail}
              </p>
            )}

            <button
              onClick={restart}
              style={{
                padding: '10px 20px',
                borderRadius: 10,
                border: `2px solid ${accentColor}50`,
                background: `${accentColor}18`,
                color: accentColor,
                fontSize: 12,
                fontWeight: 800,
                cursor: 'pointer',
                fontFamily: MONO,
                letterSpacing: '.05em',
                transition: 'all .2s',
              }}
            >
              ↩ Recomeçar
            </button>
          </div>
        ) : (
          /* Nó pergunta */
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 20,
            }}>
              {current.icon && (
                <div style={{
                  fontSize: 24,
                  lineHeight: 1,
                }}>
                  {current.icon}
                </div>
              )}
              <h2 style={{
                fontSize: 20,
                fontWeight: 800,
                color: FG_DEFAULT,
                margin: 0,
                lineHeight: 1.3,
              }}>
                {current.question}
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {current.children!.map((child, i) => (
                <button
                  key={i}
                  onClick={() => choose(child.nodeId, child.label)}
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    borderRadius: 10,
                    border: `1px solid ${child.color ? `${child.color}50` : LINE_DEFAULT}`,
                    background: child.color ? `${child.color}10` : cardColor,
                    color: child.color ?? FG_DEFAULT,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: MONO,
                    textAlign: 'left',
                    transition: 'all .2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                  onMouseEnter={e => {
                    ;(e.currentTarget as HTMLButtonElement).style.background = child.color ? `${child.color}22` : `${LINE_DEFAULT}60`
                    ;(e.currentTarget as HTMLButtonElement).style.borderColor = child.color ?? accentColor
                  }}
                  onMouseLeave={e => {
                    ;(e.currentTarget as HTMLButtonElement).style.background = child.color ? `${child.color}10` : cardColor
                    ;(e.currentTarget as HTMLButtonElement).style.borderColor = child.color ? `${child.color}50` : LINE_DEFAULT
                  }}
                >
                  <span style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    border: `1px solid ${child.color ? `${child.color}60` : LINE_DEFAULT}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10,
                    fontWeight: 800,
                    color: child.color ?? FGMUTE_DEFAULT,
                    flexShrink: 0,
                  }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {child.label}
                  <span style={{ marginLeft: 'auto', fontSize: 16, opacity: .5 }}>›</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Botão voltar */}
      {history.length > 0 && (
        <button
          onClick={goBack}
          style={{
            marginTop: 12,
            padding: '6px 14px',
            borderRadius: 8,
            border: `1px solid ${LINE_DEFAULT}`,
            background: 'transparent',
            color: FGMUTE_DEFAULT,
            fontSize: 11,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: MONO,
            transition: 'all .2s',
          }}
        >
          ← Voltar
        </button>
      )}

      {/* Progresso */}
      <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{
          flex: 1,
          height: 3,
          background: LINE_DEFAULT,
          borderRadius: 2,
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            background: accentColor,
            borderRadius: 2,
            width: isLeaf ? '100%' : `${(history.length / (history.length + 1)) * 80}%`,
            transition: 'width .3s ease',
          }} />
        </div>
        <span style={{ fontSize: 10, color: FGMUTE_DEFAULT, whiteSpace: 'nowrap' }}>
          {history.length} {history.length === 1 ? 'passo' : 'passos'}
          {isLeaf ? ' — concluído' : ''}
        </span>
      </div>
    </div>
  )
}
