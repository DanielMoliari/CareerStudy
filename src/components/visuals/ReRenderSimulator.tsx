'use client'
import { useState, useCallback } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────────

export type RRNode = {
  id: string
  name: string
  isMemo?: boolean
  children?: string[]
}

export type Scenario = {
  label: string
  emoji: string
  trigger: string
  desc: string
  color: string
}

interface ReRenderSimulatorProps {
  nodes: RRNode[]
  scenarios: Scenario[]
  accentColor: string
  fireColor: string
  safeColor: string
  bgColor: string
  card2Color: string
  label?: string
  heading?: string
  description?: string
}

// ── Paleta padrão ────────────────────────────────────────────────────────────────

const LINE   = '#334155'
const CARD2  = '#243044'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const MUTE   = '#475569'
const MONO   = "'JetBrains Mono', monospace"

// ── Helper ────────────────────────────────────────────────────────────────────────

function getDescendants(id: string, nodes: RRNode[]): Set<string> {
  const map = new Map(nodes.map(n => [n.id, n]))
  const result = new Set<string>()
  function walk(nid: string) {
    const n = map.get(nid)
    if (!n) return
    for (const c of n.children ?? []) { result.add(c); walk(c) }
  }
  walk(id)
  return result
}

// ── Main Component ────────────────────────────────────────────────────────────────

export function ReRenderSimulator({
  nodes,
  scenarios,
  accentColor: _accent,
  fireColor,
  safeColor,
  bgColor,
  card2Color = CARD2,
  label,
  heading,
  description,
}: ReRenderSimulatorProps) {
  const [scenario, setScenario] = useState(0)
  const [highlighted, setHighlighted] = useState<Set<string>>(new Set())
  const [memoBlocked, setMemoBlocked] = useState<Set<string>>(new Set())
  const [running, setRunning] = useState(false)
  const [blockCount, setBlockCount] = useState(0)

  const runScenario = useCallback((idx: number) => {
    if (running) return
    setRunning(true)
    const sc = scenarios[idx]
    const desc = getDescendants(sc.trigger, nodes)

    const blocked = new Set<string>()
    for (const nid of desc) {
      const n = nodes.find(x => x.id === nid)
      if (n?.isMemo) {
        blocked.add(nid)
        const subDesc = getDescendants(nid, nodes)
        for (const s of subDesc) blocked.add(s)
      }
    }

    const finalTriggered = new Set([sc.trigger])
    for (const nid of desc) {
      if (!blocked.has(nid)) finalTriggered.add(nid)
    }

    setHighlighted(new Set())
    setMemoBlocked(new Set())

    setTimeout(() => {
      setHighlighted(finalTriggered)
      setMemoBlocked(blocked)
      setBlockCount(c => c + blocked.size)
      setRunning(false)
    }, 80)
  }, [running, nodes, scenarios])

  function RRBox({ node, depth }: { node: RRNode; depth: number }) {
    const isHit = highlighted.has(node.id)
    const isBlocked = memoBlocked.has(node.id)
    const borderColor = isHit ? fireColor : isBlocked ? safeColor : LINE
    const bgC = isHit ? `${fireColor}22` : isBlocked ? `${safeColor}14` : card2Color
    const textColor = isHit ? '#fca5a5' : isBlocked ? '#86efac' : FGMUTE
    const glow = isHit ? `0 0 22px ${fireColor}60` : isBlocked ? `0 0 18px ${safeColor}40` : 'none'

    return (
      <div style={{ marginLeft: depth * 26 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '12px 18px', borderRadius: 10, marginBottom: 8,
          border: `2px solid ${borderColor}`,
          background: bgC,
          transition: 'all .4s',
          boxShadow: glow,
          minWidth: 160,
        }}>
          {node.isMemo && (
            <span style={{
              fontSize: 10, fontWeight: 800,
              color: isBlocked ? safeColor : `${safeColor}99`,
              border: `1.5px solid ${isBlocked ? safeColor : `${safeColor}50`}`,
              borderRadius: 4, padding: '1px 6px',
            }}>memo</span>
          )}
          <span style={{ fontSize: 13, color: textColor, fontWeight: isHit ? 800 : 500 }}>
            {node.name}
          </span>
          {isHit && <span style={{ fontSize: 16, animation: 'spin .6s linear infinite' }}>🔥</span>}
          {isBlocked && <span style={{ fontSize: 14 }}>🛡️</span>}
        </div>
        {node.children?.map(cid => {
          const child = nodes.find(x => x.id === cid)
          return child ? <RRBox key={cid} node={child} depth={depth + 1} /> : null
        })}
      </div>
    )
  }

  const root = nodes[0]
  const sc = scenarios[scenario]

  return (
    <div style={{ fontFamily: MONO }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      {(label || heading || description) && (
        <div style={{ marginBottom: 24 }}>
          {label && (
            <div style={{ fontSize: 11, letterSpacing: '.15em', color: fireColor, textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>
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

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        {scenarios.map((s, i) => (
          <button key={i}
            onClick={() => { setScenario(i); runScenario(i) }}
            style={{
              padding: '12px 24px', borderRadius: 10, fontSize: 13, fontWeight: 700,
              border: `2px solid ${scenario === i ? s.color : LINE}`,
              background: scenario === i ? `${s.color}22` : card2Color,
              color: scenario === i ? s.color : FGMUTE,
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all .2s',
              boxShadow: scenario === i ? `0 0 16px ${s.color}40` : 'none',
            }}
          >
            {s.emoji} {s.label}
          </button>
        ))}

        <div style={{
          marginLeft: 'auto',
          padding: '10px 18px', borderRadius: 10,
          background: `${safeColor}12`, border: `2px solid ${safeColor}50`,
        }}>
          <div style={{ fontSize: 9, color: safeColor, fontWeight: 800, letterSpacing: '.1em', marginBottom: 2 }}>
            RE-RENDERS EVITADOS
          </div>
          <div style={{ fontSize: 22, color: safeColor, fontWeight: 900, fontFamily: MONO }}>
            🛡️ {blockCount}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24, alignItems: 'start' }}>
        <div style={{
          background: bgColor, border: `1px solid ${LINE}`, borderRadius: 14,
          padding: 28,
          backgroundImage: `radial-gradient(circle at 80% 80%, ${fireColor}08 0%, transparent 60%)`,
        }}>
          {root && <RRBox node={root} depth={0} />}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{
            background: `${sc.color}15`, border: `2px solid ${sc.color}50`,
            borderRadius: 14, padding: 20,
            boxShadow: `0 0 20px ${sc.color}20`,
          }}>
            <div style={{ color: sc.color, fontSize: 16, fontWeight: 800, marginBottom: 10 }}>
              {sc.emoji} {sc.label}
            </div>
            <p style={{ color: FG, fontSize: 13, lineHeight: 1.8, margin: 0 }}>{sc.desc}</p>
          </div>

          <div style={{ background: card2Color, border: `1px solid ${LINE}`, borderRadius: 14, padding: 20 }}>
            <div style={{ color: FGMUTE, fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 14 }}>LEGENDA</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36, height: 22, borderRadius: 6,
                  background: `${fireColor}22`, border: `2px solid ${fireColor}`,
                  boxShadow: `0 0 10px ${fireColor}55`, flexShrink: 0,
                }} />
                <span style={{ color: FG, fontSize: 12 }}>Re-renderizou</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36, height: 22, borderRadius: 6,
                  background: `${safeColor}14`, border: `2px solid ${safeColor}`,
                  boxShadow: `0 0 10px ${safeColor}44`, flexShrink: 0,
                }} />
                <span style={{ color: FG, fontSize: 12 }}>Bloqueado por memo</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36, height: 22, borderRadius: 6,
                  background: card2Color, border: `2px solid ${LINE}`, flexShrink: 0,
                }} />
                <span style={{ color: FG, fontSize: 12 }}>Não afetado</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        marginTop: 20,
        padding: '10px 18px', borderRadius: 10,
        background: `${MUTE}12`, border: `1px solid ${LINE}`,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: running ? safeColor : MUTE,
          boxShadow: running ? `0 0 8px ${safeColor}` : 'none',
        }} />
        <span style={{ color: FGMUTE, fontSize: 12 }}>
          {running ? 'simulando...' : 'pronto — clique num cenário para simular'}
        </span>
      </div>
    </div>
  )
}
