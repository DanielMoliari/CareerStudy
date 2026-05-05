'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Nav from '@/components/Nav'
import QuizMode from '@/components/QuizMode'
import { SKILL_BY_SLUG, DEPENDENCIES, ALL_SKILLS, iconUrl } from '@/data/skills'
import { useProgress, STATE_COLORS, STATE_FULL, STATE_ORDER } from '@/hooks/useProgress'
import { getSkillContent } from '@/data/content/index'
import type { Resource, InterviewQA } from '@/types'

const KIND_STYLES: Record<Resource['kind'], { bg: string; color: string }> = {
  docs:    { bg: 'rgba(59,130,246,.15)',  color: 'var(--blue)' },
  video:   { bg: 'rgba(239,68,68,.15)',   color: 'var(--scarlet)' },
  curso:   { bg: 'rgba(168,85,247,.15)',  color: 'var(--violet)' },
  artigo:  { bg: 'rgba(34,197,94,.15)',   color: 'var(--green)' },
  livro:   { bg: 'rgba(234,179,8,.15)',   color: 'var(--amber)' },
  pratica: { bg: 'rgba(20,184,166,.15)',  color: '#14b8a6' },
}

function stripHtml(html: string): string {
  return html
    .replace(/<pre[\s\S]*?<\/pre>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ').trim()
}

function AudioBtn({ id, text, speakingId, onSpeak }: {
  id: string; text: string; speakingId: string | null; onSpeak: (id: string, text: string) => void
}) {
  const active = speakingId === id
  return (
    <button
      onClick={() => onSpeak(id, text)}
      title={active ? 'Parar' : 'Ouvir este trecho'}
      style={{
        width: 22, height: 22, borderRadius: '50%',
        border: `1px solid ${active ? 'rgba(239,68,68,.5)' : 'var(--line)'}`,
        background: active ? 'rgba(239,68,68,.1)' : 'transparent',
        color: active ? 'var(--scarlet)' : 'var(--fg-dim)',
        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 8, flexShrink: 0, transition: 'all .15s', padding: 0, lineHeight: 1,
      }}
    >{active ? '■' : '▶'}</button>
  )
}

export default function SkillPage() {
  const params = useParams()
  const slug = typeof params.slug === 'string' ? params.slug : Array.isArray(params.slug) ? params.slug[0] : ''
  const skill = SKILL_BY_SLUG[slug] ?? null

  const progress = useProgress(ALL_SKILLS)
  const { mounted, getState, setState, getNote, setNote } = progress

  const [quizOpen, setQuizOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'entrevista' | 'perito'>('entrevista')
  const [speakingId, setSpeakingId] = useState<string | null>(null)
  const uttRef = useRef<SpeechSynthesisUtterance | null>(null)
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)
  const noteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [noteText, setNoteText] = useState('')
  const [doneExercises, setDoneExercises] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (mounted && skill) setNoteText(getNote(slug))
  }, [mounted, slug, getNote, skill])

  useEffect(() => {
    if (!mounted || !skill) return
    try {
      const raw = localStorage.getItem(`careerstudy.exercises.v1.${slug}`)
      if (raw) setDoneExercises(new Set(JSON.parse(raw) as number[]))
    } catch {}
  }, [mounted, slug, skill])

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    function pickVoice() {
      const voices = speechSynthesis.getVoices()
      if (!voices.length) return
      voiceRef.current =
        voices.find(v => v.name === 'Luciana') ??
        voices.find(v => v.name.includes('Luciana')) ??
        voices.find(v => v.lang === 'pt-BR' && v.localService) ??
        voices.find(v => v.lang === 'pt-BR') ??
        null
    }
    pickVoice()
    speechSynthesis.addEventListener('voiceschanged', pickVoice)
    return () => speechSynthesis.removeEventListener('voiceschanged', pickVoice)
  }, [])

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) speechSynthesis.cancel()
    }
  }, [])

  function speak(id: string, text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text.trim()) return
    if (speakingId === id) { speechSynthesis.cancel(); setSpeakingId(null); return }
    speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    uttRef.current = utt
    if (voiceRef.current) utt.voice = voiceRef.current
    utt.lang = 'pt-BR'; utt.rate = 0.92; utt.pitch = 1.0
    setSpeakingId(id)
    utt.onend = () => setSpeakingId(null)
    utt.onerror = () => setSpeakingId(null)
    speechSynthesis.speak(utt)
  }

  function handleNoteChange(val: string) {
    setNoteText(val)
    if (noteTimerRef.current) clearTimeout(noteTimerRef.current)
    noteTimerRef.current = setTimeout(() => setNote(slug, val), 400)
  }

  function toggleExercise(idx: number) {
    setDoneExercises(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      localStorage.setItem(`careerstudy.exercises.v1.${slug}`, JSON.stringify([...next]))
      return next
    })
  }

  function getDependents(): string[] {
    const out: string[] = []
    for (const [k, deps] of Object.entries(DEPENDENCIES)) {
      if (deps.includes(slug) && SKILL_BY_SLUG[k]) out.push(k)
    }
    return out
  }

  if (!skill) {
    return (
      <>
        <Nav />
        <div className="shell">
          <Link href="/skills" className="back">← voltar pro mapa</Link>
          <div style={{
            background: 'var(--bg-card)', border: '1px dashed var(--line)',
            borderRadius: 12, padding: 36, textAlign: 'center',
            color: 'var(--fg-dim)', fontSize: 14,
          }}>
            <h2 style={{ color: 'var(--fg)', marginBottom: 8 }}>Skill não encontrada</h2>
            <p>
              Slug <code style={{
                fontFamily: "'JetBrains Mono', monospace",
                background: 'var(--bg-elev)', padding: '2px 6px',
                borderRadius: 4, color: 'var(--scarlet)',
              }}>{slug || '(vazio)'}</code> não existe no mapa.
            </p>
            <p style={{ marginTop: 12 }}>
              <Link href="/skills" style={{ color: 'var(--scarlet)' }}>← voltar pro mapa</Link>
            </p>
          </div>
        </div>
      </>
    )
  }

  const content = getSkillContent(slug)
  const currentState = mounted ? getState(slug) : 'pendente'
  const deps = (DEPENDENCIES[slug] ?? []).filter(d => SKILL_BY_SLUG[d])
  const dependents = getDependents()
  const url = iconUrl(skill.name)

  const sidebar = (
    <aside style={{ position: 'sticky', top: 80, alignSelf: 'start', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 12, padding: 18 }}>
        <h4 style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#475569',
          letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 12,
        }}>Progresso</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {STATE_ORDER.map(st => {
            const isActive = currentState === st
            const color = STATE_COLORS[st]
            const [primary, secondary] = STATE_FULL[st].split(' — ')
            return (
              <button
                key={st}
                onClick={() => mounted && setState(slug, st)}
                style={{
                  padding: '9px 12px', borderRadius: 6,
                  borderTop: 'none', borderRight: 'none', borderBottom: 'none',
                  borderLeft: `2px solid ${isActive ? color : 'transparent'}`,
                  background: isActive ? `${color}0d` : 'transparent',
                  fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, fontWeight: 500,
                  color: isActive ? 'var(--fg)' : 'var(--fg-mute)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                  transition: 'all .15s', textAlign: 'left',
                }}
                onMouseEnter={e => {
                  if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-card-2)'
                }}
                onMouseLeave={e => {
                  if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                }}
              >
                <span style={{ flex: 1 }}>{primary}</span>
                {secondary && (
                  <span style={{
                    fontSize: 10, color: '#475569',
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>{secondary}</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 12, padding: 18 }}>
        <h4 style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#475569',
          letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 12,
        }}>Notas pessoais</h4>
        <textarea
          value={noteText}
          onChange={e => handleNoteChange(e.target.value)}
          placeholder="Anotações, exemplos, links que você coletou..."
          style={{
            width: '100%', background: 'var(--bg-card-2)', border: '1px solid var(--line)',
            borderRadius: 8, color: 'var(--fg)', padding: '10px 12px',
            fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
            resize: 'vertical', minHeight: 90, outline: 'none',
          }}
          onFocus={e => { e.currentTarget.style.borderColor = 'var(--scarlet)' }}
          onBlur={e => { e.currentTarget.style.borderColor = 'var(--line)' }}
        />
      </div>

      {deps.length > 0 && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 12, padding: 18 }}>
          <h4 style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#475569',
            letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 12,
          }}>Pré-requisitos</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {deps.map(d => {
              const depSkill = SKILL_BY_SLUG[d]
              const depState = mounted ? getState(d) : 'pendente'
              const mastered = depState === 'domino'
              return (
                <Link key={d} href={`/skill/${d}`} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 12px', borderRadius: 6,
                  background: 'transparent',
                  borderTop: 'none', borderRight: 'none', borderBottom: 'none',
                  borderLeft: `2px solid ${mastered ? 'rgba(34,197,94,.5)' : 'transparent'}`,
                  fontFamily: "'Space Grotesk', sans-serif", fontSize: 12,
                  color: 'var(--fg-mute)', textDecoration: 'none',
                  transition: 'all .15s',
                }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.background = 'var(--bg-card-2)'
                    if (!mastered) el.style.borderLeftColor = 'rgba(239,68,68,.3)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.background = 'transparent'
                    if (!mastered) el.style.borderLeftColor = 'transparent'
                  }}
                >
                  <span style={{ flex: 1 }}>{depSkill.name}</span>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                    color: mastered ? '#22c55e' : '#475569', flexShrink: 0,
                  }}>{mastered ? '✓' : '→'}</span>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {dependents.length > 0 && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 12, padding: 18 }}>
          <h4 style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#475569',
            letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 12,
          }}>Habilita estudar</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {dependents.slice(0, 8).map(d => {
              const depSkill = SKILL_BY_SLUG[d]
              const depState = mounted ? getState(d) : 'pendente'
              const mastered = depState === 'domino'
              return (
                <Link key={d} href={`/skill/${d}`} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 12px', borderRadius: 6,
                  background: 'transparent',
                  borderTop: 'none', borderRight: 'none', borderBottom: 'none',
                  borderLeft: `2px solid ${mastered ? 'rgba(34,197,94,.5)' : 'transparent'}`,
                  fontFamily: "'Space Grotesk', sans-serif", fontSize: 12,
                  color: 'var(--fg-mute)', textDecoration: 'none',
                  transition: 'all .15s',
                }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.background = 'var(--bg-card-2)'
                    if (!mastered) el.style.borderLeftColor = 'rgba(239,68,68,.3)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.background = 'transparent'
                    if (!mastered) el.style.borderLeftColor = 'transparent'
                  }}
                >
                  <span style={{ flex: 1 }}>{depSkill.name}</span>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                    color: mastered ? '#22c55e' : '#475569', flexShrink: 0,
                  }}>{mastered ? '✓' : '→'}</span>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </aside>
  )

  const skillHeader = (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 22,
      marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid var(--line)',
    }}>
      <div style={{
        width: 72, height: 72, background: 'var(--bg-card)',
        border: '1px solid var(--line)', borderRadius: 14,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {url
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={url} alt="" width={40} height={40} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
          : <span style={{ fontSize: 24, color: 'var(--scarlet)' }}>◇</span>
        }
      </div>
      <div>
        <h1 style={{ marginBottom: 6 }}>{skill.name}</h1>
        {content?.tagline && (
          <p style={{ fontSize: 17, color: 'var(--fg-mute)', lineHeight: 1.5, maxWidth: 700 }}>
            {content.tagline}
          </p>
        )}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
          <span className={`tag p${skill.p}`}>P{skill.p}</span>
          <span className="tag">{skill.catLabel}</span>
          {content?.diagram && (
            <Link href={`/concepts#${content.diagram}`} className="tag" style={{ textDecoration: 'none' }}>
              ver diagrama →
            </Link>
          )}
          <Link
            href={`/skill/${slug}/pdfs`}
            className="tag"
            style={{ textDecoration: 'none' }}
          >
            baixar PDFs
          </Link>
          <Link
            href={`/skill/${slug}/visuais`}
            className="tag"
            style={{ textDecoration: 'none' }}
          >
            visuais
          </Link>
          <button
            className="tag"
            onClick={() => window.print()}
            style={{ cursor: 'pointer', border: 'none', background: 'none', font: 'inherit' }}
          >
            imprimir
          </button>
        </div>
      </div>
    </div>
  )

  if (!content) {
    return (
      <>
        <style>{`@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(.7)} }`}</style>
        <Nav />
        <div className="shell">
          <Link href="/skills" className="back">← voltar pro mapa</Link>
          {skillHeader}
          <div style={{ display: 'grid', gap: 32, gridTemplateColumns: '1fr 280px' }}>
            <div style={{
              background: 'var(--bg-card)', border: '1px dashed var(--line)',
              borderRadius: 12, padding: 36, textAlign: 'center',
              color: 'var(--fg-dim)', fontSize: 14,
            }}>
              <p>Sem conteúdo ainda — mas você já pode <strong style={{ color: 'var(--fg)' }}>marcar progresso</strong> no painel ao lado.</p>
              <p style={{ marginTop: 10, fontSize: 12 }}>
                Os agentes geram conteúdo em batches por categoria. Para esta skill ainda não rodou.
              </p>
            </div>
            {sidebar}
          </div>
        </div>
      </>
    )
  }

  const plenoQs = (content.interview ?? []).filter(qa => !qa.level || qa.level === 'pleno')
  const seniorQs = (content.interview ?? []).filter(qa => qa.level === 'senior')

  const peritoSections = [
    content.why                                        ? { id: 'sec-why',       label: 'por que importa' } : null,
    content.prerequisite                               ? { id: 'sec-prereq',    label: 'pré-requisitos' }  : null,
    content.mindmap                                    ? { id: 'sec-mindmap',   label: 'mapa mental' }     : null,
    (content.diagrams && content.diagrams.length > 1)  ? { id: 'sec-diagrams',  label: 'diagramas' }       : null,
    (content.keypoints?.length)                        ? { id: 'sec-keypoints', label: 'conceitos' }       : null,
    (content.codeExamples?.length)                     ? { id: 'sec-code',      label: 'código' }          : null,
    (content.exercises?.length)                        ? { id: 'sec-exercises', label: 'exercícios' }      : null,
    (content.videos?.length)                           ? { id: 'sec-videos',    label: 'vídeos' }          : null,
  ].filter(Boolean) as { id: string; label: string }[]

  const renderQA = (qa: InterviewQA, i: number, prefix: string) => {
    const qaId = `qa-${prefix}-${i}`
    const qaText = `${qa.q}. ${stripHtml(qa.a)}${qa.tip ? `. Dica: ${qa.tip}` : ''}`
    return (
      <details key={qaId} style={{ marginBottom: 10 }}>
        <summary style={{
          cursor: 'pointer', padding: '13px 18px',
          background: 'var(--bg-card)', border: '1px solid var(--line)',
          borderRadius: 10, fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 13.5, fontWeight: 600, listStyle: 'none',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
            color: 'var(--scarlet)', letterSpacing: '.12em', flexShrink: 0, opacity: .5,
          }}>Q{(i + 1).toString().padStart(2, '0')}</span>
          <span style={{ flex: 1 }}>{qa.q}</span>
          <AudioBtn id={qaId} text={qaText} speakingId={speakingId} onSpeak={speak} />
        </summary>
        <div style={{
          background: 'var(--bg-card-2)', border: '1px solid var(--scarlet)',
          borderTop: 'none', borderBottomLeftRadius: 10, borderBottomRightRadius: 10,
          padding: '16px 18px', fontSize: 13.5, color: 'var(--fg)', lineHeight: 1.7,
        }}>
          <div dangerouslySetInnerHTML={{ __html: qa.a }} />
          {qa.tip && (
            <div style={{
              background: 'rgba(97,218,251,.07)', border: '1px solid rgba(97,218,251,.2)',
              borderRadius: 7, padding: '10px 14px', marginTop: 14,
              fontSize: 12.5, color: '#61DAFB',
              fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.6,
            }}>
              <span style={{ opacity: .55, marginRight: 6 }}>framing:</span>{qa.tip}
            </div>
          )}
        </div>
      </details>
    )
  }

  const LevelHeader = ({ label, color, bg, border }: { label: string; color: string; bg: string; border: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '18px 0 12px' }}>
      <span style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
        padding: '3px 9px', borderRadius: 4, textTransform: 'uppercase',
        letterSpacing: '.12em', fontWeight: 700,
        background: bg, color, border: `1px solid ${border}`, flexShrink: 0,
      }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: border }} />
    </div>
  )

  return (
    <>
      <style>{`@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(.7)} }`}</style>
      <Nav />
      <div className="shell-wide">
        <Link href="/skills" className="back">← voltar pro mapa</Link>

        {skillHeader}

        {/* Two-column layout */}
        <div style={{ display: 'grid', gap: 32, gridTemplateColumns: '1fr 280px' }}>
          {/* Main column */}
          <div style={{ minWidth: 0 }}>

            {/* Tab switcher */}
            <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--line)', marginBottom: 28 }}>
              {(['entrevista', 'perito'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '11px 22px', background: 'transparent', border: 'none',
                    borderBottom: activeTab === tab ? '2px solid var(--scarlet)' : '2px solid transparent',
                    marginBottom: -1,
                    color: activeTab === tab ? 'var(--fg)' : 'var(--fg-dim)',
                    fontFamily: "'Space Grotesk', sans-serif", fontSize: 13,
                    fontWeight: activeTab === tab ? 700 : 500,
                    cursor: 'pointer', letterSpacing: '.02em', transition: 'color .15s',
                  }}
                >
                  {tab === 'entrevista' ? '◈ Do zero à entrevista' : '◎ Do zero a perito'}
                </button>
              ))}
            </div>

            {/* ══════════════════════════════════════════ */}
            {/* TAB: ENTREVISTA                           */}
            {/* ══════════════════════════════════════════ */}
            {activeTab === 'entrevista' && <>

              {/* Quiz CTA card */}
              {content.interview && content.interview.length > 0 && (
                <section style={{ marginBottom: 28 }}>
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(239,68,68,.08) 0%, rgba(239,68,68,.03) 100%)',
                    border: '1px solid rgba(239,68,68,.3)',
                    borderRadius: 12, padding: '20px 24px',
                    display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
                  }}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <p style={{
                        fontFamily: "'Space Grotesk', sans-serif", fontSize: 15,
                        fontWeight: 700, color: 'var(--fg)', marginBottom: 6,
                      }}>Modo quiz — simule a entrevista</p>
                      <p style={{ fontSize: 13, color: 'var(--fg-mute)', lineHeight: 1.55 }}>
                        {plenoQs.length > 0 && <span><strong style={{ color: '#61DAFB' }}>{plenoQs.length} perguntas pleno</strong></span>}
                        {plenoQs.length > 0 && seniorQs.length > 0 && <span style={{ margin: '0 6px', opacity: .4 }}>·</span>}
                        {seniorQs.length > 0 && <span><strong style={{ color: '#f87171' }}>{seniorQs.length} perguntas sênior</strong></span>}
                        {' '}— responda em voz alta ou mentalmente antes de revelar.
                      </p>
                    </div>
                    <button
                      onClick={() => setQuizOpen(true)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        padding: '11px 20px',
                        background: 'rgba(239,68,68,.12)', border: '1px solid rgba(239,68,68,.4)',
                        borderRadius: 8, color: 'var(--scarlet)',
                        fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
                        cursor: 'pointer', letterSpacing: '.04em', transition: 'all .15s',
                        flexShrink: 0,
                      }}
                      onMouseEnter={e => {
                        const b = e.currentTarget as HTMLButtonElement
                        b.style.background = 'rgba(239,68,68,.2)'
                        b.style.borderColor = 'var(--scarlet)'
                        b.style.boxShadow = '0 0 14px rgba(239,68,68,.2)'
                      }}
                      onMouseLeave={e => {
                        const b = e.currentTarget as HTMLButtonElement
                        b.style.background = 'rgba(239,68,68,.12)'
                        b.style.borderColor = 'rgba(239,68,68,.4)'
                        b.style.boxShadow = ''
                      }}
                    >
                      ◈ Iniciar Quiz →
                    </button>
                  </div>
                </section>
              )}

              {/* Visão geral / resumo */}
              {content.summary && (
                <section>
                  <SectionLabel
                    action={
                      <AudioBtn
                        id="summary" text={content.summary}
                        speakingId={speakingId} onSpeak={speak}
                      />
                    }
                  >visão geral</SectionLabel>
                  <p style={{ fontSize: 15, color: 'var(--fg)', lineHeight: 1.8 }}>{content.summary}</p>
                </section>
              )}

              {/* Modelo mental — primeiro diagrama */}
              {content.diagrams && content.diagrams[0] && (() => {
                const d = content.diagrams![0]
                const dText = [d.title, d.caption].filter(Boolean).join('. ')
                return (
                  <section>
                    <SectionLabel
                      action={dText ? <AudioBtn id="dia-0" text={dText} speakingId={speakingId} onSpeak={speak} /> : undefined}
                    >modelo mental</SectionLabel>
                    {d.title && (
                      <h4 style={{
                        fontFamily: "'Space Grotesk', sans-serif", fontSize: 13,
                        fontWeight: 600, color: 'var(--fg-mute)', marginBottom: 10, letterSpacing: '.02em',
                      }}>{d.title}</h4>
                    )}
                    <div style={{ overflowX: 'auto' }} dangerouslySetInnerHTML={{ __html: d.html }} />
                    {d.caption && (
                      <p style={{
                        fontSize: 11, color: 'var(--fg-dim)', marginTop: 8,
                        fontFamily: "'JetBrains Mono', monospace", fontStyle: 'italic',
                      }}>{d.caption}</p>
                    )}
                  </section>
                )
              })()}

              {/* Cheatsheet rápido */}
              {content.cheatsheet && (
                <section>
                  <SectionLabel>cheatsheet rápido</SectionLabel>
                  {content.cheatsheet.title && (
                    <h4 style={{
                      fontFamily: "'Space Grotesk', sans-serif", fontSize: 13,
                      fontWeight: 600, color: 'var(--fg-mute)', marginBottom: 12, letterSpacing: '.02em',
                    }}>{content.cheatsheet.title}</h4>
                  )}
                  <div style={{ overflowX: 'auto' }} dangerouslySetInnerHTML={{ __html: content.cheatsheet.html }} />
                </section>
              )}

              {/* Armadilhas comuns */}
              {content.gotchas && content.gotchas.length > 0 && (
                <section>
                  <SectionLabel>armadilhas</SectionLabel>
                  <div style={{
                    background: 'rgba(234,179,8,.05)', border: '1px solid rgba(234,179,8,.20)',
                    borderRadius: 10, padding: '18px 22px',
                  }}>
                    <h4 style={{
                      fontFamily: "'Space Grotesk', sans-serif", fontSize: 13,
                      color: 'var(--amber)', marginBottom: 12, fontWeight: 700, letterSpacing: '.02em',
                    }}>Pega-pega comum em entrevista</h4>
                    <ul style={{ listStyle: 'none' }}>
                      {content.gotchas.map((g, i) => (
                        <li key={i} style={{
                          fontSize: 13.5, color: 'var(--fg-mute)', lineHeight: 1.65,
                          padding: '6px 0 6px 20px', position: 'relative',
                          borderBottom: i < content.gotchas!.length - 1 ? '1px solid rgba(234,179,8,.08)' : 'none',
                        }}>
                          <span style={{
                            position: 'absolute', left: 0, top: 7,
                            color: 'var(--amber)', fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                          }}>!</span>
                          {g}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              )}

              {/* Dicas de memorização */}
              {content.mnemonics && content.mnemonics.length > 0 && (
                <section>
                  <SectionLabel>dicas de memorização</SectionLabel>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {content.mnemonics.map((m, i) => (
                      <details key={i} style={{
                        background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 10,
                        overflow: 'hidden',
                      }}>
                        <summary style={{
                          cursor: 'pointer', padding: '13px 18px', listStyle: 'none',
                          display: 'flex', alignItems: 'center', gap: 14,
                        }}>
                          <span style={{
                            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                            background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.25)',
                            color: 'var(--scarlet)', padding: '3px 10px', borderRadius: 6,
                            flexShrink: 0, letterSpacing: '.04em', fontWeight: 700,
                          }}>{m.trick}</span>
                          <span style={{
                            fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: 'var(--fg-mute)',
                          }}>{m.label}</span>
                        </summary>
                        <div style={{
                          padding: '12px 18px 14px', borderTop: '1px solid var(--line)',
                          fontSize: 13.5, color: 'var(--fg-mute)', lineHeight: 1.7,
                        }}>
                          {m.explanation}
                        </div>
                      </details>
                    ))}
                  </div>
                </section>
              )}

              {/* Perguntas de entrevista por nível */}
              {content.interview && content.interview.length > 0 && (
                <section>
                  <SectionLabel>perguntas de entrevista</SectionLabel>
                  {plenoQs.length > 0 && (
                    <>
                      <LevelHeader label="nível pleno" color="#61DAFB" bg="rgba(97,218,251,.08)" border="rgba(97,218,251,.18)" />
                      {plenoQs.map((qa, i) => renderQA(qa, i, 'p'))}
                    </>
                  )}
                  {seniorQs.length > 0 && (
                    <>
                      <LevelHeader label="nível sênior" color="#f87171" bg="rgba(239,68,68,.08)" border="rgba(239,68,68,.18)" />
                      {seniorQs.map((qa, i) => renderQA(qa, i, 's'))}
                    </>
                  )}
                </section>
              )}

              {/* Recursos para aprofundar */}
              {content.resources && content.resources.length > 0 && (
                <section>
                  <SectionLabel>recursos para aprofundar</SectionLabel>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {content.resources.map((r, i) => {
                      const kindStyle = KIND_STYLES[r.kind] ?? KIND_STYLES.artigo
                      return (
                        <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" style={{
                          display: 'flex', alignItems: 'center', gap: 12,
                          padding: '12px 16px', background: 'var(--bg-card)',
                          border: '1px solid var(--line)', borderRadius: 8,
                          transition: 'all .15s', textDecoration: 'none', color: 'inherit',
                        }}
                          onMouseEnter={e => {
                            const el = e.currentTarget as HTMLAnchorElement
                            el.style.borderColor = 'var(--scarlet)'; el.style.transform = 'translateX(2px)'
                          }}
                          onMouseLeave={e => {
                            const el = e.currentTarget as HTMLAnchorElement
                            el.style.borderColor = 'var(--line)'; el.style.transform = ''
                          }}
                        >
                          <span style={{
                            fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                            padding: '3px 7px', borderRadius: 4, textTransform: 'uppercase',
                            letterSpacing: '.1em', background: kindStyle.bg, color: kindStyle.color, flexShrink: 0,
                          }}>{r.kind}</span>
                          <span style={{ flex: 1, fontSize: 13.5 }}>{r.title}</span>
                          <span style={{ color: 'var(--fg-dim)', fontSize: 11 }}>↗</span>
                        </a>
                      )
                    })}
                  </div>
                </section>
              )}

            </>}

            {/* ══════════════════════════════════════════ */}
            {/* TAB: PERITO                               */}
            {/* ══════════════════════════════════════════ */}
            {activeTab === 'perito' && <>

              {/* TOC jump-chips */}
              {peritoSections.length > 1 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 28 }}>
                  {peritoSections.map(sec => (
                    <button
                      key={sec.id}
                      onClick={() => {
                        const el = document.getElementById(sec.id)
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }}
                      style={{
                        fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                        padding: '4px 12px', borderRadius: 999,
                        background: 'var(--bg-card-2)', border: '1px solid var(--line)',
                        color: 'var(--fg-dim)', cursor: 'pointer', letterSpacing: '.06em',
                        transition: 'all .15s',
                      }}
                      onMouseEnter={e => {
                        const b = e.currentTarget as HTMLButtonElement
                        b.style.borderColor = 'rgba(239,68,68,.35)'; b.style.color = 'var(--scarlet)'
                      }}
                      onMouseLeave={e => {
                        const b = e.currentTarget as HTMLButtonElement
                        b.style.borderColor = 'var(--line)'; b.style.color = 'var(--fg-dim)'
                      }}
                    >{sec.label}</button>
                  ))}
                </div>
              )}

              {/* Como usar — colapsável */}
              {content.howToStudy && (
                <section style={{ marginBottom: 24 }}>
                  <details style={{
                    background: 'rgba(97,218,251,.05)', border: '1px solid rgba(97,218,251,.15)',
                    borderRadius: 10,
                  }}>
                    <summary style={{
                      cursor: 'pointer', padding: '12px 20px', listStyle: 'none',
                      display: 'flex', alignItems: 'center', gap: 10,
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                      color: '#61DAFB', letterSpacing: '.14em', textTransform: 'uppercase', opacity: .8,
                    }}>
                      <span style={{ flex: 1 }}>como usar esta aba</span>
                      <span style={{ fontSize: 8, opacity: .5 }}>▾ expandir</span>
                    </summary>
                    <div style={{
                      padding: '0 20px 16px', fontSize: 13.5,
                      color: 'var(--fg-mute)', lineHeight: 1.75,
                    }}>
                      <div dangerouslySetInnerHTML={{ __html: content.howToStudy }} />
                    </div>
                  </details>
                </section>
              )}

              {/* Por que importa */}
              {content.why && (
                <section id="sec-why">
                  <SectionLabel
                    action={
                      <AudioBtn id="why" text={content.why} speakingId={speakingId} onSpeak={speak} />
                    }
                  >por que importa</SectionLabel>
                  <p style={{ fontSize: 15, color: 'var(--fg-mute)', lineHeight: 1.7 }}>{content.why}</p>
                </section>
              )}

              {/* Pré-requisitos de conhecimento */}
              {content.prerequisite && (
                <section id="sec-prereq">
                  <div style={{
                    background: 'rgba(59,130,246,.06)',
                    borderTop: '1px solid rgba(59,130,246,.2)',
                    borderRight: '1px solid rgba(59,130,246,.2)',
                    borderBottom: '1px solid rgba(59,130,246,.2)',
                    borderLeft: '2px solid #3b82f6',
                    borderRadius: 10, padding: '14px 18px',
                    display: 'flex', gap: 12, alignItems: 'flex-start',
                  }}>
                    <div style={{ flex: 1 }}>
                      <p style={{
                        fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                        color: '#3b82f6', letterSpacing: '.12em', textTransform: 'uppercase',
                        marginBottom: 5, fontWeight: 600,
                      }}>antes de começar</p>
                      <p style={{ fontSize: 13.5, color: 'var(--fg-mute)', lineHeight: 1.65 }}>{content.prerequisite}</p>
                    </div>
                    <AudioBtn id="prereq" text={content.prerequisite} speakingId={speakingId} onSpeak={speak} />
                  </div>
                </section>
              )}

              {/* Mapa mental */}
              {content.mindmap && (
                <section id="sec-mindmap">
                  <SectionLabel
                    action={
                      content.mindmap.caption
                        ? <AudioBtn id="mindmap" text={[content.mindmap.title, content.mindmap.caption].filter(Boolean).join('. ')} speakingId={speakingId} onSpeak={speak} />
                        : undefined
                    }
                  >mapa mental</SectionLabel>
                  {content.mindmap.title && (
                    <h4 style={{
                      fontFamily: "'Space Grotesk', sans-serif", fontSize: 13,
                      fontWeight: 600, color: 'var(--fg-mute)', marginBottom: 12, letterSpacing: '.02em',
                    }}>{content.mindmap.title}</h4>
                  )}
                  <div style={{ overflowX: 'auto' }} dangerouslySetInnerHTML={{ __html: content.mindmap.html }} />
                  {content.mindmap.caption && (
                    <p style={{
                      fontSize: 11, color: 'var(--fg-dim)', marginTop: 8,
                      fontFamily: "'JetBrains Mono', monospace', fontStyle: 'italic",
                    }}>{content.mindmap.caption}</p>
                  )}
                </section>
              )}

              {/* Diagramas didáticos */}
              {content.diagrams && content.diagrams.length > 1 && (
                <section id="sec-diagrams">
                  <SectionLabel>diagramas</SectionLabel>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                    {content.diagrams.slice(1).map((d, i) => (
                      <div key={i}>
                        {d.title && (
                          <h4 style={{
                            fontFamily: "'Space Grotesk', sans-serif", fontSize: 13,
                            fontWeight: 600, color: 'var(--fg-mute)', marginBottom: 10, letterSpacing: '.02em',
                          }}>{d.title}</h4>
                        )}
                        <div style={{ overflowX: 'auto' }} dangerouslySetInnerHTML={{ __html: d.html }} />
                        {d.caption && (
                          <p style={{
                            fontSize: 11, color: 'var(--fg-dim)', marginTop: 8,
                            fontFamily: "'JetBrains Mono', monospace", fontStyle: 'italic',
                          }}>{d.caption}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Conceitos-chave */}
              {content.keypoints && content.keypoints.length > 0 && (
                <section id="sec-keypoints">
                  <SectionLabel>conceitos-chave</SectionLabel>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {content.keypoints.map((kp, i) => {
                      const kpId = `kp-${i}`
                      const kpText = `${kp.title}. ${kp.body}`
                      return (
                        <div key={i} style={{
                          background: 'var(--bg-card)', border: '1px solid var(--line)',
                          borderRadius: 10, overflow: 'hidden',
                        }}>
                          <div style={{ padding: '16px 18px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                              <span style={{
                                fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                                color: 'var(--scarlet)', opacity: 0.5, letterSpacing: '.1em', flexShrink: 0,
                              }}>{String(i + 1).padStart(2, '0')}</span>
                              <h4 style={{
                                fontFamily: "'Space Grotesk', sans-serif", fontSize: 14,
                                fontWeight: 700, color: 'var(--scarlet)', margin: 0, flex: 1,
                              }}>{kp.title}</h4>
                              <AudioBtn id={kpId} text={kpText} speakingId={speakingId} onSpeak={speak} />
                            </div>
                            <p style={{ fontSize: 13.5, color: 'var(--fg-mute)', lineHeight: 1.7, margin: 0 }}>{kp.body}</p>
                          </div>
                          {kp.code && (
                            <pre style={{
                              background: '#080e1a', borderTop: '1px solid #1e293b',
                              padding: '14px 18px', margin: 0, fontSize: 12,
                              fontFamily: "'JetBrains Mono', monospace",
                              color: '#94a3b8', overflowX: 'auto', lineHeight: 1.8,
                            }}>
                              <code>{kp.code}</code>
                            </pre>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </section>
              )}

              {/* Padrões em código */}
              {content.codeExamples && content.codeExamples.length > 0 && (
                <section id="sec-code">
                  <SectionLabel>padrões em código</SectionLabel>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {content.codeExamples.map((ex, i) => {
                      const cxId = `cx-${i}`
                      const cxText = `${ex.title}${ex.description ? '. ' + ex.description : ''}`
                      return (
                        <div key={i} style={{
                          background: 'var(--bg-card)', border: '1px solid var(--line)',
                          borderRadius: 10, overflow: 'hidden',
                        }}>
                          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                            <div style={{ flex: 1 }}>
                              <h4 style={{
                                fontFamily: "'Space Grotesk', sans-serif", fontSize: 14,
                                fontWeight: 700, color: 'var(--fg)', margin: 0,
                              }}>{ex.title}</h4>
                              {ex.description && (
                                <p style={{ fontSize: 12.5, color: 'var(--fg-dim)', marginTop: 4, lineHeight: 1.55, marginBottom: 0 }}>{ex.description}</p>
                              )}
                            </div>
                            <AudioBtn id={cxId} text={cxText} speakingId={speakingId} onSpeak={speak} />
                          </div>
                          <pre style={{
                            background: '#080e1a', padding: '14px 16px', margin: 0,
                            fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
                            color: '#94a3b8', overflowX: 'auto', lineHeight: 1.8,
                          }}>
                            <code>{ex.code}</code>
                          </pre>
                        </div>
                      )
                    })}
                  </div>
                </section>
              )}

              {/* Exercícios práticos */}
              {content.exercises && content.exercises.length > 0 && (
                <section id="sec-exercises">
                  <SectionLabel>exercícios práticos</SectionLabel>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {content.exercises.map((ex, i) => {
                      const exId = `ex-${i}`
                      const exText = `${ex.title}. ${ex.description}${ex.hint ? '. Dica: ' + ex.hint : ''}`
                      const levelColor = ex.level === 'iniciante' ? '#22c55e' : ex.level === 'intermediario' ? '#f59e0b' : '#ef4444'
                      const levelLabel = ex.level === 'iniciante' ? 'iniciante' : ex.level === 'intermediario' ? 'intermediário' : 'sênior'
                      const done = doneExercises.has(i)
                      return (
                        <div key={i} style={{
                          background: done ? 'rgba(34,197,94,.04)' : 'var(--bg-card)',
                          border: `1px solid ${done ? 'rgba(34,197,94,.25)' : 'var(--line)'}`,
                          borderRadius: 10, overflow: 'hidden', transition: 'all .2s',
                        }}>
                          <div style={{ padding: '14px 18px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                              <span style={{
                                fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                                padding: '2px 8px', borderRadius: 4, textTransform: 'uppercase',
                                letterSpacing: '.1em', background: `${levelColor}18`, color: levelColor,
                                flexShrink: 0, border: `1px solid ${levelColor}30`,
                              }}>{levelLabel}</span>
                              <h4 style={{
                                fontFamily: "'Space Grotesk', sans-serif", fontSize: 14,
                                fontWeight: 700, color: 'var(--fg)', margin: 0, flex: 1,
                              }}>{ex.title}</h4>
                              <AudioBtn id={exId} text={exText} speakingId={speakingId} onSpeak={speak} />
                              <button
                                onClick={() => toggleExercise(i)}
                                style={{
                                  padding: '3px 10px', borderRadius: 4, flexShrink: 0,
                                  background: done ? 'rgba(34,197,94,.12)' : 'var(--bg-card-2)',
                                  border: `1px solid ${done ? 'rgba(34,197,94,.3)' : 'var(--line)'}`,
                                  color: done ? '#22c55e' : 'var(--fg-dim)',
                                  fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                                  cursor: 'pointer', transition: 'all .15s',
                                }}
                              >{done ? '✓ feito' : 'marcar feito'}</button>
                            </div>
                            <p style={{ fontSize: 13.5, color: 'var(--fg-mute)', lineHeight: 1.7, margin: '0 0 10px' }}>{ex.description}</p>
                            {ex.concepts.length > 0 && (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                {ex.concepts.map((c, ci) => (
                                  <span key={ci} style={{
                                    fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                                    padding: '2px 8px', borderRadius: 4,
                                    background: 'var(--bg-card-2)', color: 'var(--fg-dim)', border: '1px solid var(--line)',
                                  }}>{c}</span>
                                ))}
                              </div>
                            )}
                            {ex.relatedKeypoints && ex.relatedKeypoints.length > 0 && content.keypoints && (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8, alignItems: 'center' }}>
                                <span style={{
                                  fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                                  color: 'var(--fg-dim)', opacity: .6, letterSpacing: '.06em',
                                }}>prática →</span>
                                {ex.relatedKeypoints.map((idx, ki) => {
                                  const kp = content.keypoints![idx - 1]
                                  return kp ? (
                                    <span key={ki} style={{
                                      fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                                      padding: '2px 8px', borderRadius: 4,
                                      background: 'rgba(239,68,68,.08)', color: 'var(--scarlet)',
                                      border: '1px solid rgba(239,68,68,.2)',
                                    }}>
                                      {String(idx).padStart(2, '0')} {kp.title}
                                    </span>
                                  ) : null
                                })}
                              </div>
                            )}
                          </div>
                          {ex.hint && (
                            <div style={{
                              borderTop: '1px solid var(--line)', padding: '10px 18px',
                              background: 'rgba(97,218,251,.04)', fontSize: 12.5,
                              color: 'var(--fg-dim)', fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.6,
                            }}>
                              <span style={{ color: '#61DAFB', opacity: .7, marginRight: 6 }}>hint:</span>{ex.hint}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </section>
              )}

              {/* Vídeos de referência */}
              {content.videos && content.videos.length > 0 && (
                <section id="sec-videos">
                  <SectionLabel>vídeos de referência</SectionLabel>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {content.videos.map((v, i) => (
                      <a key={i} href={v.url} target="_blank" rel="noopener noreferrer" style={{
                        display: 'flex', flexDirection: 'column', gap: 5,
                        padding: '14px 16px', background: 'var(--bg-card)',
                        border: '1px solid var(--line)', borderRadius: 10,
                        transition: 'all .15s', textDecoration: 'none', color: 'inherit',
                      }}
                        onMouseEnter={e => {
                          const el = e.currentTarget as HTMLAnchorElement
                          el.style.borderColor = 'rgba(239,68,68,.35)'; el.style.transform = 'translateX(2px)'
                        }}
                        onMouseLeave={e => {
                          const el = e.currentTarget as HTMLAnchorElement
                          el.style.borderColor = 'var(--line)'; el.style.transform = ''
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{
                            fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                            padding: '2px 7px', borderRadius: 4, textTransform: 'uppercase',
                            letterSpacing: '.1em', background: 'rgba(239,68,68,.12)', color: 'var(--scarlet)', flexShrink: 0,
                          }}>▶ vídeo</span>
                          {v.topic && (
                            <span style={{
                              fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                              padding: '2px 7px', borderRadius: 4,
                              background: 'var(--bg-card-2)', color: 'var(--fg-dim)',
                              textTransform: 'uppercase', letterSpacing: '.08em',
                            }}>{v.topic}</span>
                          )}
                          <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--fg-dim)', fontFamily: "'JetBrains Mono', monospace" }}>
                            {v.channel} ↗
                          </span>
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg)' }}>{v.title}</span>
                        {v.note && (
                          <span style={{ fontSize: 12, color: 'var(--fg-dim)', lineHeight: 1.55 }}>{v.note}</span>
                        )}
                      </a>
                    ))}
                  </div>
                </section>
              )}

            </>}
          </div>

          {sidebar}
        </div>
      </div>

      {/* Floating stop pill */}
      {speakingId !== null && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 100,
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '9px 14px', background: 'var(--bg-card)',
          border: '1px solid rgba(239,68,68,.4)', borderRadius: 999,
          boxShadow: '0 8px 32px rgba(0,0,0,.5)', backdropFilter: 'blur(8px)',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%', background: 'var(--scarlet)',
            display: 'inline-block', animation: 'pulse 1s infinite',
          }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--fg)' }}>tocando</span>
          <button
            onClick={() => { speechSynthesis.cancel(); setSpeakingId(null) }}
            style={{
              padding: '4px 10px', background: 'rgba(239,68,68,.12)',
              border: '1px solid rgba(239,68,68,.3)', borderRadius: 6,
              color: 'var(--scarlet)', fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10, cursor: 'pointer',
            }}
          >■ parar</button>
        </div>
      )}

      {quizOpen && content.interview && (
        <QuizMode
          questions={content.interview}
          skillName={skill.name}
          onClose={() => setQuizOpen(false)}
        />
      )}
    </>
  )
}

function SectionLabel({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--scarlet)',
      letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 14,
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <span style={{ flex: 1, height: 1, background: 'var(--scarlet)', opacity: 0.15 }} />
      {children}
      {action}
    </p>
  )
}
