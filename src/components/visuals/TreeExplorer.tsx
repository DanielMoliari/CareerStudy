'use client'
import { useState } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────────

export type TreeNodeType = string   // e.g. 'host' | 'component' | 'context' | 'memo'

export type TreeNode = {
  id: string
  name: string
  type: TreeNodeType
  props?: string[]
  state?: string[]
  children?: TreeNode[]
  tooltip: string
  tip?: string
}

export type TreeNodeTypeMeta = {
  color: string
  label: string
  icon: string
  desc: string
}

interface TreeExplorerProps {
  tree: TreeNode
  /** Map of type key → color/label/icon/desc */
  typeMap: Record<string, TreeNodeTypeMeta>
  accentColor: string
  bgColor: string
  cardColor: string
  card2Color: string
  /** Label shown above the title */
  label?: string
  heading?: string
  description?: string
  defaultSelected?: string
  goldColor?: string
}

// ── Paleta padrão ────────────────────────────────────────────────────────────────

const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const MUTE   = '#475569'
const GOLD   = '#fbbf24'
const RED    = '#ef4444'
const PRP    = '#a78bfa'
const MONO   = "'JetBrains Mono', monospace"

// ── Internal helpers ──────────────────────────────────────────────────────────────

function findNode(tree: TreeNode, id: string): TreeNode | null {
  if (tree.id === id) return tree
  for (const c of tree.children ?? []) {
    const r = findNode(c, id)
    if (r) return r
  }
  return null
}

function NodeBox({
  node,
  depth,
  selected,
  onSelect,
  typeMap,
}: {
  node: TreeNode
  depth: number
  selected: string | null
  onSelect: (id: string) => void
  typeMap: Record<string, TreeNodeTypeMeta>
}) {
  const meta = typeMap[node.type] ?? { color: MUTE, label: node.type, icon: '◆', desc: '' }
  const isSelected = selected === node.id
  const indent = depth * 28

  return (
    <div style={{ marginLeft: indent }}>
      <div
        onClick={() => onSelect(node.id)}
        style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '12px 18px', borderRadius: 12, marginBottom: 10,
          cursor: 'pointer', userSelect: 'none',
          border: `2px solid ${isSelected ? meta.color : LINE}`,
          background: isSelected ? `${meta.color}25` : '#243044',
          transition: 'all .2s',
          boxShadow: isSelected ? `0 0 16px ${meta.color}50` : 'none',
          minWidth: 240,
          minHeight: 48,
        }}
      >
        <span style={{ fontSize: 22, lineHeight: 1, filter: isSelected ? 'none' : 'grayscale(0.4)' }}>
          {meta.icon}
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ color: isSelected ? meta.color : FG, fontSize: 14, fontWeight: 800, lineHeight: 1.2 }}>
            {node.name}
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 5, flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 10, padding: '2px 7px', borderRadius: 4,
              background: `${meta.color}25`, border: `1px solid ${meta.color}60`, color: meta.color, fontWeight: 700,
            }}>
              {meta.label}
            </span>
            {node.state?.map(s => (
              <span key={s} style={{
                fontSize: 10, padding: '2px 7px', borderRadius: 4,
                background: 'rgba(239,68,68,.18)', border: '1px solid rgba(239,68,68,.5)',
                color: RED, fontWeight: 700,
              }}>
                state:{s}
              </span>
            ))}
            {node.props?.map(p => (
              <span key={p} style={{
                fontSize: 10, padding: '2px 7px', borderRadius: 4,
                background: 'rgba(167,139,250,.15)', border: '1px solid rgba(167,139,250,.4)',
                color: PRP, fontWeight: 700,
              }}>
                {p}
              </span>
            ))}
          </div>
        </div>
        {isSelected && <span style={{ fontSize: 22, color: meta.color }}>›</span>}
      </div>
      <div style={{ position: 'relative' }}>
        {node.children?.length ? (
          <div style={{
            position: 'absolute', left: 12, top: 0, bottom: 10,
            width: 2, background: LINE, borderRadius: 1,
          }} />
        ) : null}
        {node.children?.map(child => (
          <NodeBox
            key={child.id}
            node={child}
            depth={depth + 1}
            selected={selected}
            onSelect={onSelect}
            typeMap={typeMap}
          />
        ))}
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────────

export function TreeExplorer({
  tree,
  typeMap,
  accentColor,
  bgColor,
  cardColor: _cardColor,
  card2Color,
  label,
  heading,
  description,
  defaultSelected,
  goldColor = GOLD,
}: TreeExplorerProps) {
  const [selected, setSelected] = useState<string | null>(defaultSelected ?? null)
  const node = selected ? findNode(tree, selected) : null

  return (
    <div style={{ fontFamily: MONO }}>
      {(label || heading || description) && (
        <div style={{ marginBottom: 24 }}>
          {label && (
            <div style={{ fontSize: 11, letterSpacing: '.15em', color: accentColor, textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>
              {label}
            </div>
          )}
          {heading && (
            <h3 style={{ color: FG, fontSize: 26, fontWeight: 800, margin: '0 0 8px', lineHeight: 1 }}>
              {heading}
            </h3>
          )}
          {description && (
            <p style={{ color: FGMUTE, fontSize: 13, margin: 0 }}>
              {description}
            </p>
          )}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
        <div style={{
          background: bgColor, border: `1px solid ${LINE}`, borderRadius: 14,
          padding: 28, overflowX: 'auto',
          backgroundImage: `radial-gradient(circle at 20% 20%, ${accentColor}08 0%, transparent 50%)`,
          minHeight: 440,
        }}>
          <NodeBox node={tree} depth={0} selected={selected} onSelect={setSelected} typeMap={typeMap} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {node ? (
            <>
              <div style={{
                background: `${(typeMap[node.type] ?? { color: MUTE }).color}18`,
                border: `2px solid ${(typeMap[node.type] ?? { color: MUTE }).color}60`,
                borderRadius: 14, padding: 22,
                boxShadow: `0 0 24px ${(typeMap[node.type] ?? { color: MUTE }).color}22`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <span style={{ fontSize: 34 }}>{(typeMap[node.type] ?? { icon: '◆' }).icon}</span>
                  <div>
                    <div style={{ color: (typeMap[node.type] ?? { color: MUTE }).color, fontSize: 20, fontWeight: 800, lineHeight: 1 }}>{node.name}</div>
                    <span style={{
                      display: 'inline-block', marginTop: 6,
                      fontSize: 10, padding: '3px 10px', borderRadius: 6,
                      background: `${(typeMap[node.type] ?? { color: MUTE }).color}30`,
                      color: (typeMap[node.type] ?? { color: MUTE }).color, fontWeight: 800, letterSpacing: '.05em',
                    }}>
                      {(typeMap[node.type] ?? { label: node.type }).label.toUpperCase()}
                    </span>
                  </div>
                </div>
                <p style={{ color: FG, fontSize: 13, lineHeight: 1.8, margin: 0 }}>{node.tooltip}</p>
              </div>

              {node.tip && (
                <div style={{
                  background: `${goldColor}12`, border: `1.5px solid ${goldColor}50`,
                  borderRadius: 12, padding: 16,
                }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8,
                    color: goldColor, fontSize: 11, fontWeight: 800, letterSpacing: '.1em',
                  }}>
                    <span style={{ fontSize: 16 }}>💡</span>
                    DICA DE ENTREVISTA
                  </div>
                  <p style={{ color: FG, fontSize: 12, lineHeight: 1.7, margin: 0 }}>{node.tip}</p>
                </div>
              )}
            </>
          ) : (
            <div style={{ background: card2Color, border: `1px solid ${LINE}`, borderRadius: 14, padding: 20 }}>
              <p style={{ color: MUTE, fontSize: 13, margin: 0, textAlign: 'center' }}>
                ← Clique num componente para inspecionar
              </p>
            </div>
          )}

          <div style={{ background: card2Color, border: `1px solid ${LINE}`, borderRadius: 14, padding: 20 }}>
            <div style={{ color: FGMUTE, fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 14 }}>
              LEGENDA DE TIPOS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {Object.entries(typeMap).map(([k, meta]) => (
                <div key={k} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px', borderRadius: 10,
                  background: `${meta.color}12`,
                  border: `1.5px solid ${meta.color}40`,
                }}>
                  <span style={{ fontSize: 20 }}>{meta.icon}</span>
                  <div>
                    <div style={{ color: meta.color, fontSize: 13, fontWeight: 700 }}>{meta.label}</div>
                    <div style={{ color: FGMUTE, fontSize: 11, marginTop: 2 }}>{meta.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
