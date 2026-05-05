'use client'
import { useState, useEffect, useRef } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────────

export type PriorityLevel = string   // e.g. 'urgent' | 'normal' | 'low'

export type PriorityInfo = {
  color: string
  emoji: string
  label: string
  /** How many progress units to add per tick (higher = faster) */
  weight: number
}

interface PriorityPanelProps {
  priorities: Record<PriorityLevel, PriorityInfo>
  /** Ordered array — first priority runs first */
  priorityOrder: PriorityLevel[]
  accentColor: string
  bgColor: string
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
const GRN    = '#4ade80'
const PRP    = '#a78bfa'
const MONO   = "'JetBrains Mono', monospace"

// ── Internal task type ────────────────────────────────────────────────────────────

type Task = {
  id: number
  priority: PriorityLevel
  label: string
  progress: number
  done: boolean
}

let TASK_ID = 0

// ── Main Component ────────────────────────────────────────────────────────────────

export function PriorityPanel({
  priorities,
  priorityOrder,
  accentColor = PRP,
  bgColor,
  label,
  heading,
  description,
}: PriorityPanelProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [log, setLog] = useState<string[]>([])
  const [running, setRunning] = useState(false)
  const runningRef = useRef(running)
  runningRef.current = running

  function addTask(priority: PriorityLevel) {
    TASK_ID += 1
    const info = priorities[priority]
    const newTask: Task = {
      id: TASK_ID,
      priority,
      label: `${info.label} #${TASK_ID}`,
      progress: 0,
      done: false,
    }
    setTasks(prev => [...prev, newTask])
    setLog(prev => [`+ Tarefa enfileirada: ${newTask.label}`, ...prev].slice(0, 8))
  }

  useEffect(() => {
    if (running) return
    if (tasks.some(t => !t.done)) {
      setRunning(true)
    }
  }, [tasks, running])

  useEffect(() => {
    if (!running) return
    const interval = setInterval(() => {
      setTasks(prev => {
        const pending = prev.filter(t => !t.done)
        if (pending.length === 0) {
          setRunning(false)
          return prev
        }
        let target: Task | null = null
        for (const p of priorityOrder) {
          const found = pending.find(t => t.priority === p)
          if (found) { target = found; break }
        }
        if (!target) return prev

        const t = target
        const inc = priorities[t.priority].weight
        return prev.map(x => {
          if (x.id !== t.id) return x
          const newProg = Math.min(100, x.progress + inc)
          if (newProg >= 100 && !x.done) {
            setLog(L => [`✓ Concluído: ${x.label}`, ...L].slice(0, 8))
            return { ...x, progress: 100, done: true }
          }
          return { ...x, progress: newProg }
        })
      })
    }, 180)
    return () => clearInterval(interval)
  }, [running, priorities, priorityOrder])

  function clear() {
    setTasks([])
    setLog([])
    setRunning(false)
  }

  const queues = priorityOrder.map(p => ({
    priority: p,
    tasks: tasks.filter(t => t.priority === p),
    info: priorities[p],
  }))

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

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        {priorityOrder.map(p => {
          const info = priorities[p]
          return (
            <button key={p}
              onClick={() => addTask(p)}
              style={{
                padding: '12px 20px', borderRadius: 10,
                border: `2px solid ${info.color}`,
                background: `${info.color}20`,
                color: info.color, fontSize: 13, fontWeight: 800,
                cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: `0 0 12px ${info.color}30`,
                display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              <span style={{ fontSize: 18 }}>{info.emoji}</span>
              <span>+ {info.label}</span>
            </button>
          )
        })}

        <button onClick={clear} style={{
          marginLeft: 'auto',
          padding: '10px 18px', borderRadius: 10,
          border: `1.5px solid ${LINE}`,
          background: 'transparent', color: FGMUTE,
          fontSize: 12, fontWeight: 700,
          cursor: 'pointer', fontFamily: 'inherit',
        }}>
          🗑 limpar
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${queues.length}, 1fr)`,
        gap: 14, marginBottom: 20,
      }}>
        {queues.map(q => (
          <div key={q.priority} style={{
            background: `${q.info.color}10`,
            border: `2px solid ${q.info.color}40`,
            borderRadius: 14, padding: 16,
            minHeight: 280,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 14, paddingBottom: 12,
              borderBottom: `1px solid ${q.info.color}30`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 22 }}>{q.info.emoji}</span>
                <div>
                  <div style={{ color: q.info.color, fontSize: 13, fontWeight: 800, letterSpacing: '.05em' }}>
                    {q.info.label}
                  </div>
                  <div style={{ color: FGMUTE, fontSize: 9 }}>peso: {q.info.weight}</div>
                </div>
              </div>
              <div style={{
                padding: '4px 10px', borderRadius: 6,
                background: `${q.info.color}25`,
                color: q.info.color, fontSize: 12, fontWeight: 800,
              }}>
                {q.tasks.filter(t => !t.done).length}
              </div>
            </div>

            {q.tasks.length === 0 ? (
              <div style={{
                padding: 24, textAlign: 'center',
                color: MUTE, fontSize: 11,
              }}>
                vazio
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {q.tasks.map(t => (
                  <div key={t.id} style={{
                    background: t.done ? `${GRN}10` : bgColor,
                    border: `1px solid ${t.done ? GRN : LINE}`,
                    borderRadius: 8, padding: 10,
                    transition: 'all .2s',
                    opacity: t.done ? 0.6 : 1,
                  }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      fontSize: 11, marginBottom: 6,
                    }}>
                      <span style={{ color: t.done ? GRN : FG, fontWeight: 700 }}>
                        {t.done ? '✓' : '○'} {t.label}
                      </span>
                      <span style={{ color: FGMUTE, fontSize: 10 }}>
                        {Math.round(t.progress)}%
                      </span>
                    </div>
                    <div style={{
                      height: 4, background: CARD2, borderRadius: 2,
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${t.progress}%`,
                        background: t.done ? GRN : q.info.color,
                        transition: 'width .15s linear',
                        boxShadow: `0 0 8px ${t.done ? GRN : q.info.color}60`,
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{
        background: bgColor, border: `1px solid ${LINE}`,
        borderRadius: 12, padding: 18,
      }}>
        <div style={{
          fontSize: 10, color: accentColor, letterSpacing: '.15em',
          textTransform: 'uppercase', fontWeight: 800, marginBottom: 10,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: running ? GRN : MUTE,
            boxShadow: running ? `0 0 8px ${GRN}` : 'none',
            animation: running ? 'pulse 1s ease-in-out infinite' : 'none',
          }} />
          SCHEDULER LOG
          {running && <span style={{ color: GRN, fontSize: 9 }}>processando...</span>}
        </div>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
        {log.length === 0 ? (
          <p style={{ color: MUTE, fontSize: 12, margin: 0 }}>
            Adicione tarefas para ver o scheduler em ação...
          </p>
        ) : (
          log.map((l, i) => (
            <div key={i} style={{
              fontSize: 11, lineHeight: 1.8,
              color: i === 0 ? FG : MUTE,
              fontWeight: i === 0 ? 700 : 400,
            }}>
              {l}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
