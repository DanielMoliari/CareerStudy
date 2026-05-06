'use client'
import { useState, useRef, useEffect, useCallback } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────────

export type MindMapNode = {
  id: string
  label: string
  description?: string
  color?: string
  children?: MindMapNode[]
  level?: number
  icon?: string
  tags?: string[]
}

interface MindMapProps {
  root: MindMapNode
  accentColor?: string
  bgColor?: string
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

// ── Layout helpers ───────────────────────────────────────────────────────────────

type PositionedNode = MindMapNode & {
  x: number
  y: number
  level: number
  parentId?: string
}

function flattenTree(
  node: MindMapNode,
  cx: number,
  cy: number,
  level = 0,
  parentId?: string,
  angleStart = 0,
  angleSpan = Math.PI * 2,
  acc: PositionedNode[] = [],
): PositionedNode[] {
  const RADII = [0, 140, 260]
  const r = RADII[Math.min(level, RADII.length - 1)]
  const angle = angleStart + angleSpan / 2
  const x = level === 0 ? cx : cx + Math.cos(angle) * r
  const y = level === 0 ? cy : cy + Math.sin(angle) * r

  acc.push({ ...node, x, y, level, parentId })

  const children = node.children ?? []
  if (children.length > 0) {
    const slice = angleSpan / children.length
    children.forEach((child, i) => {
      flattenTree(child, cx, cy, level + 1, node.id, angleStart + i * slice, slice, acc)
    })
  }
  return acc
}

// ── Component ────────────────────────────────────────────────────────────────────

export function MindMap({
  root,
  accentColor = '#ef4444',
  bgColor = BG_DEFAULT,
  title,
  description,
}: MindMapProps) {
  const W = 640
  const H = 520
  const CX = W / 2
  const CY = H / 2

  const nodes = flattenTree(root, CX, CY)
  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]))

  const svgRef = useRef<SVGSVGElement>(null)
  const gRef   = useRef<SVGGElement>(null)
  const panRef = useRef({ x: 0, y: 0 })
  const zoomRef = useRef(1)
  const dragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })

  const [tooltip, setTooltip] = useState<{ node: PositionedNode; px: number; py: number } | null>(null)

  const applyTransform = useCallback(() => {
    if (!gRef.current) return
    gRef.current.setAttribute(
      'transform',
      `translate(${panRef.current.x},${panRef.current.y}) scale(${zoomRef.current})`,
    )
  }, [])

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      zoomRef.current = Math.max(0.4, Math.min(2.5, zoomRef.current - e.deltaY * 0.001))
      applyTransform()
    }
    const onMouseDown = (e: MouseEvent) => {
      dragging.current = true
      dragStart.current = { x: e.clientX - panRef.current.x, y: e.clientY - panRef.current.y }
    }
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return
      panRef.current = { x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y }
      applyTransform()
    }
    const onMouseUp = () => { dragging.current = false }

    svg.addEventListener('wheel', onWheel, { passive: false })
    svg.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      svg.removeEventListener('wheel', onWheel)
      svg.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [applyTransform])

  const nodeColor = (n: PositionedNode) =>
    n.color ?? (n.level === 0 ? accentColor : n.level === 1 ? '#3b82f6' : '#8b5cf6')

  return (
    <div style={{ fontFamily: MONO }}>
      {(title || description) && (
        <div style={{ marginBottom: 16 }}>
          {title && <h3 style={{ color: FG_DEFAULT, fontSize: 20, fontWeight: 800, margin: '0 0 6px' }}>{title}</h3>}
          {description && <p style={{ color: FGMUTE_DEFAULT, fontSize: 12, margin: 0 }}>{description}</p>}
        </div>
      )}

      <div style={{ position: 'relative', background: bgColor, borderRadius: 14, border: `1px solid ${LINE_DEFAULT}`, overflow: 'hidden' }}>
        <svg
          ref={svgRef}
          width="100%"
          viewBox={`0 0 ${W} ${H}`}
          style={{ display: 'block', cursor: 'grab', userSelect: 'none' }}
        >
          <g ref={gRef}>
            {/* edges */}
            {nodes.filter(n => n.parentId).map(n => {
              const parent = nodeMap[n.parentId!]
              if (!parent) return null
              const mx = (n.x + parent.x) / 2
              const my = (n.y + parent.y) / 2 - 30
              return (
                <path
                  key={`edge-${n.id}`}
                  d={`M${parent.x},${parent.y} Q${mx},${my} ${n.x},${n.y}`}
                  fill="none"
                  stroke={nodeColor(n) + '60'}
                  strokeWidth={n.level === 1 ? 2 : 1.5}
                />
              )
            })}

            {/* nodes */}
            {nodes.map(n => {
              const r = n.level === 0 ? 40 : n.level === 1 ? 28 : 22
              const fs = n.level === 0 ? 11 : n.level === 1 ? 9.5 : 8.5
              const col = nodeColor(n)
              return (
                <g
                  key={n.id}
                  transform={`translate(${n.x},${n.y})`}
                  style={{ cursor: n.description ? 'pointer' : 'default' }}
                  onMouseEnter={e => {
                    if (n.description) {
                      const rect = (e.target as SVGElement).closest('svg')!.getBoundingClientRect()
                      setTooltip({ node: n, px: e.clientX - rect.left, py: e.clientY - rect.top })
                    }
                  }}
                  onMouseLeave={() => setTooltip(null)}
                >
                  <circle r={r} fill={CARD_DEFAULT} stroke={col} strokeWidth={n.level === 0 ? 3 : 2} />
                  <circle r={r} fill={col + '18'} stroke="none" />
                  <foreignObject x={-r + 3} y={-r + 3} width={(r - 3) * 2} height={(r - 3) * 2}>
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        fontSize: fs,
                        fontWeight: n.level === 0 ? 800 : 700,
                        color: n.level === 0 ? col : FG_DEFAULT,
                        lineHeight: 1.25,
                        padding: 2,
                        wordBreak: 'break-word',
                        fontFamily: MONO,
                      }}
                    >
                      {n.label}
                    </div>
                  </foreignObject>
                </g>
              )
            })}
          </g>
        </svg>

        {/* tooltip */}
        {tooltip && (
          <div style={{
            position: 'absolute',
            left: tooltip.px + 12,
            top: tooltip.py - 8,
            background: CARD_DEFAULT,
            border: `1px solid ${LINE_DEFAULT}`,
            borderRadius: 8,
            padding: '8px 12px',
            maxWidth: 220,
            pointerEvents: 'none',
            zIndex: 10,
          }}>
            <div style={{ color: nodeColor(tooltip.node), fontSize: 11, fontWeight: 700, marginBottom: 4 }}>{tooltip.node.label}</div>
            <div style={{ color: FGMUTE_DEFAULT, fontSize: 11, lineHeight: 1.5 }}>{tooltip.node.description}</div>
            {tooltip.node.tags && tooltip.node.tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
                {tooltip.node.tags.map(t => (
                  <span key={t} style={{ background: LINE_DEFAULT, color: FGMUTE_DEFAULT, fontSize: 9, padding: '1px 5px', borderRadius: 4 }}>{t}</span>
                ))}
              </div>
            )}
          </div>
        )}

        <div style={{ position: 'absolute', bottom: 8, right: 12, color: FGMUTE_DEFAULT, fontSize: 10 }}>
          scroll para zoom · arrastar para pan
        </div>
      </div>
    </div>
  )
}
