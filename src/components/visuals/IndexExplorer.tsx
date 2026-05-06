'use client'
import { useState, useEffect, useRef } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────────

export type IndexNode = {
  id: string
  keys: Array<string | number>
  isLeaf: boolean
  children?: string[]
  dataPointers?: string[]
}

export type IndexExample = {
  id: string
  label: string
  description: string
  indexType: 'btree' | 'hash' | 'gin' | 'gist' | 'brin'
  nodes: IndexNode[]
  rootId: string
  searchDemo?: {
    searchKey: string | number
    path: string[]
  }
  sqlExample?: string
}

interface IndexExplorerProps {
  examples: IndexExample[]
  accentColor?: string
  bgColor?: string
  cardColor?: string
  title?: string
  description?: string
}

// ── Palette ──────────────────────────────────────────────────────────────────────

const BG_DEFAULT     = '#0f172a'
const CARD_DEFAULT   = '#1e293b'
const LINE_DEFAULT   = '#334155'
const FG_DEFAULT     = '#e2e8f0'
const FGMUTE_DEFAULT = '#94a3b8'
const MONO           = "'JetBrains Mono', monospace"

const INDEX_TYPE_COLOR: Record<IndexExample['indexType'], string> = {
  btree: '#3b82f6',
  hash:  '#f59e0b',
  gin:   '#8b5cf6',
  gist:  '#10b981',
  brin:  '#ec4899',
}

// ── Layout ───────────────────────────────────────────────────────────────────────

type PositionedNode = IndexNode & { x: number; y: number; level: number }

function layoutTree(
  nodes: IndexNode[],
  rootId: string,
  W: number,
): PositionedNode[] {
  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]))
  const result: PositionedNode[] = []
  const LEVEL_H = 80
  const NODE_W = 100

  function place(id: string, level: number, xMin: number, xMax: number) {
    const n = nodeMap[id]
    if (!n) return
    const x = (xMin + xMax) / 2
    const y = 30 + level * LEVEL_H
    result.push({ ...n, x, y, level })
    if (n.children && n.children.length > 0) {
      const slice = (xMax - xMin) / n.children.length
      n.children.forEach((childId, i) => {
        place(childId, level + 1, xMin + i * slice, xMin + (i + 1) * slice)
      })
    }
  }

  place(rootId, 0, NODE_W / 2, W - NODE_W / 2)
  return result
}

// ── Component ────────────────────────────────────────────────────────────────────

export function IndexExplorer({
  examples,
  accentColor = '#ef4444',
  bgColor = BG_DEFAULT,
  cardColor = CARD_DEFAULT,
  title,
  description,
}: IndexExplorerProps) {
  const [exampleIdx, setExampleIdx] = useState(0)
  const [searchStep, setSearchStep] = useState(-1)
  const [isSearching, setIsSearching] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const example = examples[exampleIdx]
  const indexColor = INDEX_TYPE_COLOR[example.indexType]

  const W = 640
  const positioned = layoutTree(example.nodes, example.rootId, W)
  const nodeMap = Object.fromEntries(positioned.map(n => [n.id, n]))

  const maxY = Math.max(...positioned.map(n => n.y)) + 60
  const H = Math.max(maxY, 220)

  const stopSearch = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setIsSearching(false)
  }

  const startSearch = () => {
    if (!example.searchDemo) return
    stopSearch()
    setSearchStep(0)
    setIsSearching(true)
    let step = 0
    timerRef.current = setInterval(() => {
      step++
      if (step >= example.searchDemo!.path.length) {
        setSearchStep(example.searchDemo!.path.length - 1)
        stopSearch()
      } else {
        setSearchStep(step)
      }
    }, 900)
  }

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current) }, [])

  const highlightedPath = example.searchDemo?.path.slice(0, searchStep + 1) ?? []

  return (
    <div style={{ fontFamily: MONO }}>
      {(title || description) && (
        <div style={{ marginBottom: 16 }}>
          {title && <h3 style={{ color: FG_DEFAULT, fontSize: 20, fontWeight: 800, margin: '0 0 6px' }}>{title}</h3>}
          {description && <p style={{ color: FGMUTE_DEFAULT, fontSize: 12, margin: 0 }}>{description}</p>}
        </div>
      )}

      {/* example selector */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
        {examples.map((ex, i) => (
          <button
            key={ex.id}
            onClick={() => { stopSearch(); setSearchStep(-1); setExampleIdx(i) }}
            style={{
              padding: '5px 14px', borderRadius: 20, border: `1px solid ${INDEX_TYPE_COLOR[ex.indexType]}60`,
              background: exampleIdx === i ? INDEX_TYPE_COLOR[ex.indexType] : 'transparent',
              color: exampleIdx === i ? '#fff' : INDEX_TYPE_COLOR[ex.indexType],
              fontSize: 11, cursor: 'pointer', fontFamily: MONO,
            }}
          >
            {ex.label}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 12 }}>
        <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 10, background: indexColor + '25', color: indexColor, fontSize: 10, fontWeight: 700, marginRight: 8 }}>
          {example.indexType.toUpperCase()}
        </span>
        <span style={{ color: FGMUTE_DEFAULT, fontSize: 11 }}>{example.description}</span>
      </div>

      <div style={{ background: bgColor, border: `1px solid ${LINE_DEFAULT}`, borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <svg width={W} height={H} style={{ display: 'block' }}>
            {/* edges */}
            {positioned.filter(n => n.children && n.children.length > 0).flatMap(parent =>
              (parent.children ?? []).map(childId => {
                const child = nodeMap[childId]
                if (!child) return null
                return (
                  <line
                    key={`${parent.id}-${childId}`}
                    x1={parent.x} y1={parent.y + 14}
                    x2={child.x} y2={child.y - 14}
                    stroke={LINE_DEFAULT} strokeWidth={1.5}
                  />
                )
              })
            )}

            {/* nodes */}
            {positioned.map(n => {
              const isHighlighted = highlightedPath.includes(n.id)
              const isCurrentStep = highlightedPath[highlightedPath.length - 1] === n.id
              const col = isCurrentStep ? accentColor : isHighlighted ? indexColor : LINE_DEFAULT
              const nodeW = Math.max(80, n.keys.length * 38)
              return (
                <g key={n.id} transform={`translate(${n.x - nodeW / 2}, ${n.y - 14})`}>
                  <rect
                    width={nodeW} height={28}
                    rx={5}
                    fill={isHighlighted ? col + '20' : cardColor}
                    stroke={col}
                    strokeWidth={isHighlighted ? 2 : 1}
                  />
                  {n.keys.map((k, ki) => (
                    <g key={ki}>
                      {ki > 0 && (
                        <line
                          x1={ki * (nodeW / n.keys.length)} y1={0}
                          x2={ki * (nodeW / n.keys.length)} y2={28}
                          stroke={col + '60'} strokeWidth={1}
                        />
                      )}
                      <text
                        x={(ki + 0.5) * (nodeW / n.keys.length)}
                        y={15}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={10}
                        fontWeight={isHighlighted ? 800 : 600}
                        fill={isCurrentStep ? accentColor : FG_DEFAULT}
                        fontFamily={MONO}
                      >
                        {String(k)}
                      </text>
                    </g>
                  ))}
                  {n.isLeaf && (
                    <rect x={-2} y={-2} width={nodeW + 4} height={32} rx={6} fill="none" stroke={indexColor + '50'} strokeWidth={1} strokeDasharray="3 2" />
                  )}
                </g>
              )
            })}
          </svg>
        </div>

        {/* search controls */}
        {example.searchDemo && (
          <div style={{ padding: '12px 20px', borderTop: `1px solid ${LINE_DEFAULT}`, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={isSearching ? stopSearch : startSearch}
              style={{
                padding: '6px 16px', borderRadius: 8,
                background: isSearching ? LINE_DEFAULT : accentColor,
                border: 'none', color: '#fff',
                fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: MONO,
              }}
            >
              {isSearching ? '⏸ Pausar' : searchStep >= 0 ? '↺ Repetir busca' : `🔍 Buscar "${example.searchDemo.searchKey}"`}
            </button>
            {searchStep >= 0 && !isSearching && (
              <button
                onClick={() => setSearchStep(-1)}
                style={{ padding: '6px 14px', borderRadius: 8, background: 'transparent', border: `1px solid ${LINE_DEFAULT}`, color: FGMUTE_DEFAULT, fontSize: 11, cursor: 'pointer', fontFamily: MONO }}
              >
                Limpar
              </button>
            )}
            {searchStep >= 0 && (
              <span style={{ color: FGMUTE_DEFAULT, fontSize: 11 }}>
                Nível {searchStep + 1} de {example.searchDemo.path.length}
                {searchStep === example.searchDemo.path.length - 1 && !isSearching && (
                  <span style={{ color: '#22c55e', marginLeft: 8 }}>✓ Encontrado!</span>
                )}
              </span>
            )}
          </div>
        )}

        {/* SQL example */}
        {example.sqlExample && (
          <div style={{ padding: '0 20px 16px' }}>
            <div style={{ color: FGMUTE_DEFAULT, fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 6 }}>Exemplo SQL</div>
            <pre style={{ background: cardColor, borderRadius: 8, padding: '10px 14px', margin: 0, fontSize: 11, color: '#93c5fd', overflowX: 'auto', lineHeight: 1.6 }}>
              <code>{example.sqlExample}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
