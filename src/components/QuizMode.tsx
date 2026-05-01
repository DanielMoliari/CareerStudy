'use client'
import { useState, useCallback, useEffect } from 'react'
import type { InterviewQA } from '@/types'

type Rating = 'ok' | 'partial' | 'no'
type LevelFilter = 'all' | 'pleno' | 'senior'

interface QuizResult {
  score: number
  total: number
  date: string
  ratings: Record<number, Rating>
}

interface Props {
  questions: InterviewQA[]
  skillName: string
  onClose: () => void
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-')
}

function loadResult(slug: string): QuizResult | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(`careerstudy.quiz.v1.${slug}`)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function saveResult(slug: string, result: QuizResult) {
  if (typeof window === 'undefined') return
  localStorage.setItem(`careerstudy.quiz.v1.${slug}`, JSON.stringify(result))
}

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export default function QuizMode({ questions, skillName, onClose }: Props) {
  const slug = slugify(skillName)
  const [levelFilter, setLevelFilter] = useState<LevelFilter | null>(null)
  const [order, setOrder] = useState<number[]>([])
  const [cursor, setCursor] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [ratings, setRatings] = useState<Record<number, Rating>>({})
  const [done, setDone] = useState(false)
  const [expandedRevisit, setExpandedRevisit] = useState<Record<number, boolean>>({})
  const [advancing, setAdvancing] = useState(false)

  const plenoCount = questions.filter(q => !q.level || q.level === 'pleno').length
  const seniorCount = questions.filter(q => q.level === 'senior').length

  // Filter + shuffle when level is chosen
  useEffect(() => {
    if (levelFilter === null) return
    const filtered = questions
      .map((q, i) => ({ q, i }))
      .filter(({ q }) =>
        levelFilter === 'all' ? true :
        levelFilter === 'pleno' ? (!q.level || q.level === 'pleno') :
        q.level === 'senior'
      )
    setOrder(shuffleArray(filtered.map(({ i }) => i)))
    setCursor(0)
    setRevealed(false)
    setRatings({})
    setDone(false)
    setExpandedRevisit({})
    setAdvancing(false)
  }, [levelFilter, questions])

  // Trap scroll
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  // ESC to close, keyboard shortcuts during quiz
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }
      if (levelFilter === null || done) return
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        if (!revealed) setRevealed(true)
      }
      if (revealed && !advancing) {
        if (e.key === '1') rate('ok')
        if (e.key === '2') rate('partial')
        if (e.key === '3') rate('no')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, levelFilter, done, revealed, advancing])

  const currentIndex = order[cursor]
  const currentQ = questions[currentIndex]
  const total = order.length
  const pct = total > 0 ? Math.round((cursor / total) * 100) : 0

  function rate(r: Rating) {
    if (advancing) return
    const next = { ...ratings, [currentIndex]: r }
    setRatings(next)
    setAdvancing(true)
    setTimeout(() => {
      if (cursor + 1 >= total) {
        const score = Object.values(next).filter(v => v === 'ok').length
        const result: QuizResult = { score, total, date: new Date().toISOString(), ratings: next }
        saveResult(slug, result)
        setDone(true)
      } else {
        setCursor(c => c + 1)
        setRevealed(false)
      }
      setAdvancing(false)
    }, 400)
  }

  const restart = useCallback(() => {
    setLevelFilter(null)
  }, [])

  const ratingColor = (r: Rating): string => {
    if (r === 'ok') return 'var(--green)'
    if (r === 'partial') return 'var(--amber)'
    return 'var(--scarlet)'
  }

  // ── INTRO / LEVEL SELECTOR ──
  if (levelFilter === null) {
    return (
      <div style={overlayStyle}>
        <div style={panelStyle}>
          <button onClick={onClose} style={closeBtnStyle} aria-label="Fechar">×</button>

          <p style={monoLabel}>{skillName}</p>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(22px, 3vw, 28px)',
            fontWeight: 800,
            color: 'var(--fg)',
            marginTop: 10,
            marginBottom: 8,
            letterSpacing: '-.02em',
          }}>Mock Interview</h2>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            color: 'var(--fg-mute)',
            lineHeight: 1.65,
            marginBottom: 32,
          }}>
            Responda em voz alta antes de revelar.{'\n'}
            Use ← espaço → para revelar · 1 soube · 2 parcial · 3 não soube.
          </p>

          <p style={{ ...monoLabel, marginBottom: 16 }}>escolha o nível</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
            {[
              {
                key: 'pleno' as LevelFilter,
                label: 'Pleno',
                count: plenoCount,
                color: 'var(--blue)',
                border: 'rgba(59,130,246,.4)',
                bg: 'rgba(59,130,246,.08)',
                desc: 'Fundamentos, hooks essenciais, composição',
              },
              {
                key: 'senior' as LevelFilter,
                label: 'Sênior',
                count: seniorCount,
                color: '#f87171',
                border: 'rgba(239,68,68,.4)',
                bg: 'rgba(239,68,68,.08)',
                desc: 'Fiber, Concurrent Mode, RSC, patterns avançados',
              },
              {
                key: 'all' as LevelFilter,
                label: 'Todas',
                count: questions.length,
                color: 'var(--fg-mute)',
                border: 'var(--line-2)',
                bg: 'var(--bg-elev)',
                desc: 'Pleno + sênior misturados — simulação completa',
              },
            ].map(opt => (
              <button
                key={opt.key}
                onClick={() => setLevelFilter(opt.key)}
                style={{
                  padding: '16px 20px',
                  background: opt.bg,
                  border: `1px solid ${opt.border}`,
                  borderRadius: 10,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  textAlign: 'left',
                  transition: 'all .15s',
                }}
                onMouseEnter={e => {
                  const b = e.currentTarget as HTMLButtonElement
                  b.style.borderColor = opt.color
                  b.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={e => {
                  const b = e.currentTarget as HTMLButtonElement
                  b.style.borderColor = opt.border
                  b.style.transform = ''
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 8,
                  background: `${opt.color}18`,
                  border: `1px solid ${opt.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 14, fontWeight: 700,
                    color: opt.color,
                  }}>{opt.count}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 15, fontWeight: 700,
                    color: opt.color, marginBottom: 3,
                  }}>{opt.label}</p>
                  <p style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11, color: 'var(--fg-dim)',
                  }}>{opt.desc}</p>
                </div>
                <span style={{ color: opt.color, fontSize: 16, flexShrink: 0 }}>→</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── FINAL SCREEN ──
  if (done) {
    const score = Object.values(ratings).filter(v => v === 'ok').length
    const revisit = order.filter(idx => ratings[idx] === 'no' || ratings[idx] === 'partial')

    return (
      <div style={overlayStyle}>
        <div style={panelStyle}>
          <button onClick={onClose} style={closeBtnStyle} aria-label="Fechar">×</button>

          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <p style={monoLabel}>resultado final</p>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(48px, 8vw, 72px)',
              fontWeight: 900,
              letterSpacing: '-.03em',
              color: score === total ? 'var(--green)' : score >= total / 2 ? 'var(--amber)' : 'var(--scarlet)',
              lineHeight: 1,
            }}>
              {score}<span style={{ fontSize: '0.45em', color: 'var(--fg-dim)', fontWeight: 600 }}>/{total}</span>
            </div>
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 16,
              color: 'var(--fg-mute)',
              marginTop: 10,
            }}>
              {score === total
                ? 'Perfeito! Você domina essa skill.'
                : score >= total / 2
                  ? 'Bom trabalho! Revise os pontos fracos.'
                  : 'Ainda há espaço para melhorar — revisite as respostas.'}
            </p>

            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 18 }}>
              {(['ok', 'partial', 'no'] as Rating[]).map(r => {
                const cnt = Object.values(ratings).filter(v => v === r).length
                if (cnt === 0) return null
                return (
                  <div key={r} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11, color: ratingColor(r),
                    background: `${ratingColor(r)}18`,
                    border: `1px solid ${ratingColor(r)}44`,
                    borderRadius: 6, padding: '4px 10px',
                  }}>
                    <span>{r === 'ok' ? '✓' : r === 'partial' ? '~' : '✗'}</span>
                    {cnt} {r === 'ok' ? 'soube' : r === 'partial' ? 'parcial' : 'não soube'}
                  </div>
                )
              })}
            </div>
          </div>

          {revisit.length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <p style={{ ...monoLabel, marginBottom: 14 }}>revisar ({revisit.length})</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {revisit.map(idx => {
                  const qa = questions[idx]
                  const r = ratings[idx]
                  const expanded = expandedRevisit[idx] ?? false
                  return (
                    <div key={idx} style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--line)',
                      borderRadius: 10, overflow: 'hidden',
                    }}>
                      <button
                        onClick={() => setExpandedRevisit(prev => ({ ...prev, [idx]: !expanded }))}
                        style={{
                          width: '100%', padding: '14px 18px',
                          background: 'transparent', border: 'none',
                          cursor: 'pointer', display: 'flex',
                          alignItems: 'flex-start', gap: 12, textAlign: 'left',
                        }}
                      >
                        <span style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 9, padding: '3px 6px', borderRadius: 4,
                          background: `${ratingColor(r)}18`, color: ratingColor(r),
                          border: `1px solid ${ratingColor(r)}44`,
                          flexShrink: 0, marginTop: 2,
                        }}>{r === 'partial' ? '~' : '✗'}</span>
                        <span style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: 14, fontWeight: 600,
                          color: 'var(--fg)', flex: 1, lineHeight: 1.5,
                        }}>{qa.q}</span>
                        <span style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 11, color: 'var(--fg-dim)',
                          flexShrink: 0, marginTop: 2,
                        }}>{expanded ? '▲' : '▼'}</span>
                      </button>
                      {expanded && (
                        <div
                          style={{
                            padding: '14px 18px 16px 18px',
                            fontSize: 13.5, color: 'var(--fg)',
                            lineHeight: 1.7,
                            borderTop: '1px solid var(--line)',
                          }}
                          dangerouslySetInnerHTML={{ __html: qa.a }}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button onClick={restart} style={primaryBtnStyle}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#dc2626' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--scarlet)' }}
            >
              escolher nível
            </button>
            <button onClick={onClose} style={ghostBtnStyle}
              onMouseEnter={e => {
                const b = e.currentTarget as HTMLButtonElement
                b.style.borderColor = 'var(--fg-dim)'; b.style.color = 'var(--fg)'
              }}
              onMouseLeave={e => {
                const b = e.currentTarget as HTMLButtonElement
                b.style.borderColor = 'var(--line-2)'; b.style.color = 'var(--fg-mute)'
              }}
            >
              fechar
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── QUESTION SCREEN ──
  const currentRating = ratings[currentIndex]
  const levelLabel = levelFilter === 'pleno' ? 'PLENO' : levelFilter === 'senior' ? 'SÊNIOR' : 'TODAS'
  const levelColor = levelFilter === 'pleno' ? 'var(--blue)' : levelFilter === 'senior' ? '#f87171' : 'var(--scarlet)'

  return (
    <div style={overlayStyle}>
      <div style={panelStyle}>
        <button onClick={onClose} style={closeBtnStyle} aria-label="Fechar">×</button>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <p style={monoLabel}>{skillName}</p>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9, padding: '2px 8px', borderRadius: 4,
              background: `${levelColor}18`,
              color: levelColor,
              border: `1px solid ${levelColor}44`,
              letterSpacing: '.08em',
            }}>{levelLabel}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--fg-dim)' }}>
              Pergunta {cursor + 1} de {total}
            </p>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--fg-dim)' }}>
              {pct}%
            </p>
          </div>
          <div style={{ width: '100%', height: 3, background: 'var(--bg-elev)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${pct}%`,
              background: `linear-gradient(90deg, ${levelColor}, var(--amber))`,
              borderRadius: 3, transition: 'width .4s ease',
            }} />
          </div>
        </div>

        {/* Level of current question */}
        {currentQ && (
          <>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10, color: levelColor,
              letterSpacing: '.18em', marginBottom: 12,
            }}>
              Q{(cursor + 1).toString().padStart(2, '0')} ·{' '}
              {currentQ.level === 'senior' ? 'sênior' : 'pleno'}
            </p>

            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(18px, 2.8vw, 24px)',
              fontWeight: 700, color: 'var(--fg)',
              lineHeight: 1.45, marginBottom: 32, letterSpacing: '-.01em',
            }}>
              {currentQ.q}
            </p>

            {!revealed ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--fg-dim)', lineHeight: 1.6 }}>
                  Pense na resposta antes de revelar… (espaço ou →)
                </p>
                <button
                  onClick={() => setRevealed(true)}
                  style={primaryBtnStyle}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#dc2626' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--scarlet)' }}
                >
                  Ver resposta →
                </button>
              </div>
            ) : (
              <div>
                <div style={{
                  background: 'var(--bg-card)',
                  border: `1px solid ${levelColor}50`,
                  borderRadius: 10,
                  padding: '16px 20px',
                  fontSize: 14, color: 'var(--fg)',
                  lineHeight: 1.75, marginBottom: 24,
                }}
                  dangerouslySetInnerHTML={{ __html: currentQ.a }}
                />

                {currentQ.tip && (
                  <div style={{
                    background: 'rgba(234,179,8,.06)',
                    border: '1px solid rgba(234,179,8,.25)',
                    borderRadius: 8,
                    padding: '12px 16px',
                    marginBottom: 20,
                  }}>
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'var(--amber)', letterSpacing: '.12em', marginBottom: 6 }}>
                      TIP DE ENTREVISTA
                    </p>
                    <p style={{ fontSize: 13, color: 'var(--fg-mute)', lineHeight: 1.6 }}>{currentQ.tip}</p>
                  </div>
                )}

                <div>
                  <p style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10, color: 'var(--fg-dim)',
                    letterSpacing: '.12em', marginBottom: 12,
                  }}>Como você se saiu? <span style={{ opacity: .5 }}>(1 · 2 · 3)</span></p>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {(
                      [
                        { r: 'ok' as Rating, label: '✓  Soube', color: 'var(--green)', border: 'rgba(34,197,94,.4)', bg: 'rgba(34,197,94,.1)', key: '1' },
                        { r: 'partial' as Rating, label: '~  Parcialmente', color: 'var(--amber)', border: 'rgba(234,179,8,.4)', bg: 'rgba(234,179,8,.1)', key: '2' },
                        { r: 'no' as Rating, label: '✗  Não soube', color: 'var(--scarlet)', border: 'rgba(239,68,68,.4)', bg: 'rgba(239,68,68,.1)', key: '3' },
                      ]
                    ).map(({ r, label, color, border, bg, key: kbKey }) => {
                      const isSelected = currentRating === r
                      return (
                        <button
                          key={r}
                          onClick={() => rate(r)}
                          disabled={advancing}
                          style={{
                            padding: '11px 20px',
                            background: isSelected ? bg : 'var(--bg-card)',
                            border: `1px solid ${isSelected ? border : 'var(--line-2)'}`,
                            borderRadius: 8, color: isSelected ? color : 'var(--fg-mute)',
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: 12, cursor: advancing ? 'default' : 'pointer',
                            letterSpacing: '.04em', transition: 'all .15s',
                            opacity: advancing && !isSelected ? 0.5 : 1,
                            transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                          }}
                          onMouseEnter={e => {
                            if (advancing) return
                            const b = e.currentTarget as HTMLButtonElement
                            b.style.borderColor = border; b.style.color = color; b.style.background = bg
                          }}
                          onMouseLeave={e => {
                            if (isSelected) return
                            const b = e.currentTarget as HTMLButtonElement
                            b.style.borderColor = 'var(--line-2)'; b.style.color = 'var(--fg-mute)'; b.style.background = 'var(--bg-card)'
                          }}
                        >
                          <span style={{ opacity: .4, marginRight: 6, fontSize: 9 }}>{kbKey}</span>
                          {label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ── Shared styles ──

const overlayStyle: React.CSSProperties = {
  position: 'fixed', inset: 0, zIndex: 1000,
  background: 'rgba(10,10,15,.88)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: '20px 16px', overflowY: 'auto',
}

const panelStyle: React.CSSProperties = {
  position: 'relative', width: '100%', maxWidth: 680,
  background: 'var(--bg-card)',
  border: '1px solid var(--line-2)',
  borderRadius: 16,
  padding: 'clamp(24px, 4vw, 44px)',
  boxShadow: '0 32px 64px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.04)',
}

const closeBtnStyle: React.CSSProperties = {
  position: 'absolute', top: 16, right: 16,
  width: 32, height: 32,
  background: 'var(--bg-elev)', border: '1px solid var(--line)',
  borderRadius: 8, color: 'var(--fg-dim)',
  fontSize: 18, cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  lineHeight: 1, transition: 'color .15s, border-color .15s',
}

const primaryBtnStyle: React.CSSProperties = {
  padding: '12px 24px',
  background: 'var(--scarlet)', border: '1px solid var(--scarlet)',
  borderRadius: 8, color: '#fff',
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 12, cursor: 'pointer',
  letterSpacing: '.06em', transition: 'background .15s',
}

const ghostBtnStyle: React.CSSProperties = {
  padding: '12px 24px',
  background: 'transparent', border: '1px solid var(--line-2)',
  borderRadius: 8, color: 'var(--fg-mute)',
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 12, cursor: 'pointer',
  letterSpacing: '.06em', transition: 'border-color .15s, color .15s',
}

const monoLabel: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 10, color: 'var(--scarlet)',
  letterSpacing: '.18em', textTransform: 'uppercase', margin: 0,
}
