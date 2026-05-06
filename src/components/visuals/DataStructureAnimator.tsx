'use client'
import { useState, useCallback } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────────

export type DSOperation = {
  id: string
  label: string
  description: string
  type: 'insert' | 'delete' | 'search' | 'traverse' | 'rotate'
  targetIndex?: number
  value?: string | number
}

export type DSExample = {
  id: string
  label: string
  type: 'array' | 'linkedlist' | 'tree' | 'hashmap' | 'stack' | 'queue' | 'graph'
  initialData: Array<string | number>
  operations: DSOperation[]
  description?: string
  complexity?: {
    time: string
    space: string
  }
}

interface DataStructureAnimatorProps {
  examples: DSExample[]
  accentColor?: string
  bgColor?: string
  cardColor?: string
  title?: string
  description?: string
}

// ── Paleta ───────────────────────────────────────────────────────────────────────

const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const MONO   = "'JetBrains Mono', monospace"

const OP_COLORS: Record<DSOperation['type'], string> = {
  insert  : '#22c55e',
  delete  : '#ef4444',
  search  : '#3b82f6',
  traverse: '#f59e0b',
  rotate  : '#a855f7',
}

// ── Renderizadores por tipo ───────────────────────────────────────────────────────

type RenderProps = {
  data: Array<string | number>
  highlighted: Set<number>
  accentColor: string
  cardColor: string
  opType: DSOperation['type'] | null
}

function RenderArray({ data, highlighted, accentColor, cardColor, opType }: RenderProps) {
  const col = opType ? OP_COLORS[opType] : accentColor
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', padding: '16px 0' }}>
      {data.map((v, i) => (
        <div key={i} style={{
          width: 52, height: 52, borderRadius: 8,
          background: highlighted.has(i) ? `${col}30` : cardColor,
          border: `2px solid ${highlighted.has(i) ? col : LINE}`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          transition: 'all .3s',
          boxShadow: highlighted.has(i) ? `0 0 12px ${col}60` : 'none',
        }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: highlighted.has(i) ? col : FG }}>{v}</span>
          <span style={{ fontSize: 9, color: FGMUTE }}>[{i}]</span>
        </div>
      ))}
    </div>
  )
}

function RenderStack({ data, highlighted, accentColor, cardColor, opType }: RenderProps) {
  const col = opType ? OP_COLORS[opType] : accentColor
  return (
    <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: 4, alignItems: 'center', padding: '16px 0', maxHeight: 280, overflowY: 'auto' }}>
      {data.map((v, i) => (
        <div key={i} style={{
          width: 140, height: 44, borderRadius: 6,
          background: highlighted.has(i) ? `${col}30` : cardColor,
          border: `1.5px solid ${highlighted.has(i) ? col : LINE}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700,
          color: highlighted.has(i) ? col : FG,
          transition: 'all .3s',
          boxShadow: i === data.length - 1 ? `0 0 8px ${col}40` : 'none',
        }}>
          {v} {i === data.length - 1 && <span style={{ fontSize: 9, color: FGMUTE, marginLeft: 6 }}>← TOP</span>}
        </div>
      ))}
    </div>
  )
}

function RenderQueue({ data, highlighted, accentColor, cardColor, opType }: RenderProps) {
  const col = opType ? OP_COLORS[opType] : accentColor
  return (
    <div style={{ overflowX: 'auto', padding: '16px 0' }}>
      <div style={{ display: 'flex', gap: 0, alignItems: 'center', justifyContent: 'center', minWidth: 'max-content' }}>
        <span style={{ fontSize: 10, color: FGMUTE, marginRight: 8 }}>FRONT →</span>
        {data.map((v, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              minWidth: 52, height: 48, borderRadius: 6,
              background: highlighted.has(i) ? `${col}30` : cardColor,
              border: `1.5px solid ${highlighted.has(i) ? col : LINE}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700,
              color: highlighted.has(i) ? col : FG,
              transition: 'all .3s', padding: '0 12px',
            }}>
              {v}
            </div>
            {i < data.length - 1 && (
              <div style={{ width: 20, textAlign: 'center', color: FGMUTE, fontSize: 14 }}>→</div>
            )}
          </div>
        ))}
        <span style={{ fontSize: 10, color: FGMUTE, marginLeft: 8 }}>→ BACK</span>
      </div>
    </div>
  )
}

function RenderLinkedList({ data, highlighted, accentColor, cardColor, opType }: RenderProps) {
  const col = opType ? OP_COLORS[opType] : accentColor
  return (
    <div style={{ overflowX: 'auto', padding: '16px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, minWidth: 'max-content' }}>
        <span style={{ fontSize: 10, color: FGMUTE, marginRight: 4 }}>HEAD</span>
        {data.map((v, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              borderRadius: 8,
              background: highlighted.has(i) ? `${col}20` : cardColor,
              border: `2px solid ${highlighted.has(i) ? col : LINE}`,
              display: 'flex', overflow: 'hidden',
              transition: 'all .3s',
            }}>
              <div style={{
                width: 44, height: 44,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 800, color: highlighted.has(i) ? col : FG,
                borderRight: `1px solid ${LINE}`,
              }}>
                {v}
              </div>
              <div style={{
                width: 28, height: 44,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16,
                color: i < data.length - 1 ? FGMUTE : `${FGMUTE}40`,
              }}>
                {i < data.length - 1 ? '→' : '∅'}
              </div>
            </div>
            {i < data.length - 1 && (
              <div style={{ width: 12, height: 2, background: LINE }} />
            )}
          </div>
        ))}
        <span style={{ fontSize: 10, color: FGMUTE, marginLeft: 4 }}>NULL</span>
      </div>
    </div>
  )
}

function RenderTree({ data, highlighted, accentColor, cardColor, opType }: RenderProps) {
  const col = opType ? OP_COLORS[opType] : accentColor
  // Renderiza árvore binária a partir do array (heap-like indexing)
  if (data.length === 0) return <div style={{ textAlign: 'center', color: FGMUTE, padding: 20 }}>Vazia</div>

  const SVG_W = 400
  const SVG_H = 200
  const nodeR = 20

  const nodeX = (idx: number, depth: number, totalDepth: number): number => {
    const level = Math.floor(Math.log2(idx + 1))
    const nodesInLevel = Math.pow(2, level)
    const posInLevel = idx - (nodesInLevel - 1)
    const segment = SVG_W / nodesInLevel
    return segment * posInLevel + segment / 2
  }

  const nodeY = (idx: number): number => {
    const level = Math.floor(Math.log2(idx + 1))
    return level * 56 + 30
  }

  const totalDepth = Math.floor(Math.log2(data.length))

  return (
    <div style={{ overflowX: 'auto', padding: '8px 0' }}>
      <svg width="100%" viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ display: 'block' }}>
        {data.map((v, i) => {
          const leftChild = 2 * i + 1
          const rightChild = 2 * i + 2
          const x = nodeX(i, Math.floor(Math.log2(i + 1)), totalDepth)
          const y = nodeY(i)
          const isHov = highlighted.has(i)
          return (
            <g key={i}>
              {leftChild < data.length && (
                <line
                  x1={x} y1={y + nodeR}
                  x2={nodeX(leftChild, 0, totalDepth)} y2={nodeY(leftChild) - nodeR}
                  stroke={LINE} strokeWidth={1.5}
                />
              )}
              {rightChild < data.length && (
                <line
                  x1={x} y1={y + nodeR}
                  x2={nodeX(rightChild, 0, totalDepth)} y2={nodeY(rightChild) - nodeR}
                  stroke={LINE} strokeWidth={1.5}
                />
              )}
              <circle
                cx={x} cy={y} r={nodeR}
                fill={isHov ? `${col}30` : cardColor}
                stroke={isHov ? col : LINE}
                strokeWidth={isHov ? 2.5 : 1.5}
              />
              <text
                x={x} y={y + 4}
                textAnchor="middle"
                fill={isHov ? col : FG}
                fontSize={11} fontWeight={800} fontFamily={MONO}
              >
                {v}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function RenderHashMap({ data, highlighted, accentColor, cardColor, opType }: RenderProps) {
  const col = opType ? OP_COLORS[opType] : accentColor
  const buckets = 6
  const distribution: Array<Array<{ v: string | number; i: number }>> = Array.from({ length: buckets }, () => [])
  data.forEach((v, i) => {
    const bucket = i % buckets
    distribution[bucket].push({ v, i })
  })
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', padding: '16px 0', flexWrap: 'wrap' }}>
      {distribution.map((bucket, bi) => (
        <div key={bi} style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
          <div style={{ fontSize: 9, color: FGMUTE }}>[{bi}]</div>
          <div style={{
            minWidth: 52, minHeight: 44, borderRadius: 6,
            border: `1.5px solid ${LINE}`, background: cardColor,
            display: 'flex', flexDirection: 'column', gap: 3, padding: 4, alignItems: 'center',
          }}>
            {bucket.length === 0
              ? <span style={{ color: `${FGMUTE}40`, fontSize: 12 }}>∅</span>
              : bucket.map(({ v, i }) => (
                <div key={i} style={{
                  width: 40, height: 28, borderRadius: 4,
                  background: highlighted.has(i) ? `${col}30` : `${LINE}50`,
                  border: `1px solid ${highlighted.has(i) ? col : LINE}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: highlighted.has(i) ? col : FG,
                  transition: 'all .3s',
                }}>
                  {v}
                </div>
              ))
            }
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Componente principal ──────────────────────────────────────────────────────────

export function DataStructureAnimator({
  examples,
  accentColor = '#ef4444',
  bgColor = BG,
  cardColor = CARD,
  title,
  description,
}: DataStructureAnimatorProps) {
  const [exampleIdx, setExampleIdx] = useState(0)
  const [data, setData] = useState<Array<string | number>>(examples[0]?.initialData ?? [])
  const [highlighted, setHighlighted] = useState<Set<number>>(new Set())
  const [activeOp, setActiveOp] = useState<DSOperation | null>(null)
  const [log, setLog] = useState<string>('')

  const example = examples[exampleIdx]

  const switchExample = (idx: number) => {
    setExampleIdx(idx)
    setData(examples[idx].initialData)
    setHighlighted(new Set())
    setActiveOp(null)
    setLog('')
  }

  const runOp = useCallback((op: DSOperation) => {
    setActiveOp(op)
    setLog(op.description)

    const newData = [...data]
    const newHighlighted = new Set<number>()

    switch (op.type) {
      case 'insert': {
        const val = op.value ?? '?'
        const idx = op.targetIndex !== undefined ? op.targetIndex : newData.length
        newData.splice(idx, 0, val)
        newHighlighted.add(idx)
        break
      }
      case 'delete': {
        const idx = op.targetIndex !== undefined ? op.targetIndex : newData.length - 1
        if (idx >= 0 && idx < newData.length) {
          newData.splice(idx, 1)
          if (newData.length > 0) newHighlighted.add(Math.min(idx, newData.length - 1))
        }
        break
      }
      case 'search': {
        const target = op.value
        newData.forEach((v, i) => { if (String(v) === String(target)) newHighlighted.add(i) })
        break
      }
      case 'traverse': {
        newData.forEach((_, i) => newHighlighted.add(i))
        break
      }
      case 'rotate': {
        if (newData.length > 0) {
          const first = newData.shift()!
          newData.push(first)
          newHighlighted.add(newData.length - 1)
        }
        break
      }
    }

    setData(newData)

    // Highlight temporário
    setHighlighted(newHighlighted)
    setTimeout(() => setHighlighted(new Set()), 1400)
  }, [data])

  const renderDS = () => {
    const props: RenderProps = {
      data, highlighted, accentColor, cardColor,
      opType: activeOp?.type ?? null,
    }
    switch (example.type) {
      case 'array'     : return <RenderArray {...props} />
      case 'stack'     : return <RenderStack {...props} />
      case 'queue'     : return <RenderQueue {...props} />
      case 'linkedlist': return <RenderLinkedList {...props} />
      case 'tree'      : return <RenderTree {...props} />
      case 'hashmap'   : return <RenderHashMap {...props} />
      case 'graph'     : return <RenderArray {...props} />
      default          : return <RenderArray {...props} />
    }
  }

  return (
    <div style={{ fontFamily: MONO, color: FG }}>
      {(title || description) && (
        <div style={{ marginBottom: 20 }}>
          {title && <h3 style={{ color: FG, fontSize: 22, fontWeight: 800, margin: '0 0 6px' }}>{title}</h3>}
          {description && <p style={{ color: FGMUTE, fontSize: 12, margin: 0, lineHeight: 1.6 }}>{description}</p>}
        </div>
      )}

      {/* Seletor de exemplo */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {examples.map((ex, i) => (
          <button
            key={ex.id}
            onClick={() => switchExample(i)}
            style={{
              padding: '5px 14px', borderRadius: 8, fontSize: 11, fontFamily: MONO,
              border: `1px solid ${i === exampleIdx ? accentColor : LINE}`,
              background: i === exampleIdx ? `${accentColor}20` : 'transparent',
              color: i === exampleIdx ? accentColor : FGMUTE,
              cursor: 'pointer',
            }}
          >
            {ex.label}
          </button>
        ))}
      </div>

      <div style={{ background: bgColor, border: `1px solid ${LINE}`, borderRadius: 14, padding: 20 }}>
        {/* Visualização */}
        <div style={{
          minHeight: 140,
          background: `${CARD}80`,
          border: `1px solid ${LINE}`,
          borderRadius: 10,
          marginBottom: 16,
          overflowX: 'auto',
        }}>
          {renderDS()}
        </div>

        {/* Operações */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
          {example.operations.map(op => {
            const col = OP_COLORS[op.type]
            return (
              <button
                key={op.id}
                onClick={() => runOp(op)}
                style={{
                  padding: '6px 14px', borderRadius: 8, fontSize: 11, fontFamily: MONO,
                  border: `1px solid ${col}60`,
                  background: activeOp?.id === op.id ? `${col}30` : `${col}10`,
                  color: col, cursor: 'pointer', transition: 'all .2s',
                  fontWeight: 700,
                }}
              >
                {op.label}
              </button>
            )
          })}
          <button
            onClick={() => { setData(example.initialData); setHighlighted(new Set()); setActiveOp(null); setLog('') }}
            style={{
              padding: '6px 14px', borderRadius: 8, fontSize: 11, fontFamily: MONO,
              border: `1px solid ${LINE}`,
              background: 'transparent', color: FGMUTE, cursor: 'pointer', marginLeft: 'auto',
            }}
          >
            ↺ Reset
          </button>
        </div>

        {/* Log de operação */}
        {log && (
          <div style={{
            background: cardColor, border: `1px solid ${activeOp ? OP_COLORS[activeOp.type] : LINE}40`,
            borderRadius: 8, padding: '8px 14px', fontSize: 11, color: FGMUTE, marginBottom: 12,
          }}>
            <span style={{ color: activeOp ? OP_COLORS[activeOp.type] : accentColor, fontWeight: 700, marginRight: 6 }}>
              {activeOp?.label}
            </span>
            {log}
          </div>
        )}

        {/* Complexidade + descrição */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {example.description && (
            <p style={{ color: FGMUTE, fontSize: 12, margin: 0, lineHeight: 1.6, flex: 1 }}>{example.description}</p>
          )}
          {example.complexity && (
            <div style={{
              background: cardColor, border: `1px solid ${LINE}`,
              borderRadius: 8, padding: '8px 14px', fontSize: 11, flexShrink: 0,
            }}>
              <div style={{ color: FGMUTE, marginBottom: 4 }}>
                <span style={{ color: FG, fontWeight: 700 }}>Tempo:</span> {example.complexity.time}
              </div>
              <div style={{ color: FGMUTE }}>
                <span style={{ color: FG, fontWeight: 700 }}>Espaço:</span> {example.complexity.space}
              </div>
            </div>
          )}
        </div>

        {/* Legenda de tipos de operação */}
        <div style={{ display: 'flex', gap: 12, marginTop: 14, flexWrap: 'wrap' }}>
          {(Object.entries(OP_COLORS) as Array<[DSOperation['type'], string]>).map(([type, col]) => (
            <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: col }} />
              <span style={{ color: FGMUTE, textTransform: 'capitalize' }}>{type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
