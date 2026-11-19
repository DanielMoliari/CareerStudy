'use client'
import { useEffect, useMemo, useState } from 'react'
import Nav from '@/components/Nav'
import { SYSDESIGN_BLOCKS, LIVECODING_BLOCKS, NARRATIVA_BLOCKS } from '@/data/log/curriculum'
import { BLOCK_EXAMS } from '@/data/log/exams'
import type { CurriculumBlock, CurriculumLevel, CurriculumTopic, CurriculumTrack, TopicState } from '@/types'

/* ─── Storage ─── */

const STORAGE_KEY = 'careerstudy.gap-topics.v1'

function topicKey(track: CurriculumTrack, level: CurriculumLevel, slug: string) {
  return `${track}:${level}:${slug}`
}

function loadTopicStates(): Record<string, TopicState> {
  if (typeof window === 'undefined') return {}
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } catch { return {} }
}

function saveTopicStates(s: Record<string, TopicState>) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)) } catch {}
}

const NEXT_STATE: Record<TopicState, TopicState> = {
  pendente: 'estudando',
  estudando: 'dominado',
  dominado: 'pendente',
}

const STATE_META: Record<TopicState, { label: string; color: string }> = {
  pendente: { label: 'pendente', color: 'var(--fg-dim)' },
  estudando: { label: 'estudando', color: '#eab308' },
  dominado: { label: 'dominado', color: '#22c55e' },
}

/* ─── Meta ─── */

const TRACK_META: Record<CurriculumTrack, { label: string; color: string; blocks: CurriculumBlock[]; sub: string }> = {
  sysdesign: { label: 'System Design', color: 'var(--scarlet)', blocks: SYSDESIGN_BLOCKS, sub: 'do vocabulário básico ao desenho de sistemas com múltiplos componentes' },
  livecoding: { label: 'Live Coding', color: '#22c55e', blocks: LIVECODING_BLOCKS, sub: 'da fluência de sintaxe do zero até LeetCode Medium sob pressão' },
  narrativa: { label: 'Narrativa Técnica', color: '#3b82f6', blocks: NARRATIVA_BLOCKS, sub: 'contar sua própria experiência técnica com estrutura e fluência, em PT e EN' },
}

const TRACK_ORDER: CurriculumTrack[] = ['sysdesign', 'livecoding', 'narrativa']

const LEVEL_LABEL: Record<CurriculumLevel, string> = {
  iniciante: 'Iniciante',
  intermediario: 'Intermediário',
  avancado: 'Avançado',
}

const LEVEL_ORDER: CurriculumLevel[] = ['iniciante', 'intermediario', 'avancado']

/* ─── Progress helpers ─── */

function blockProgress(track: CurriculumTrack, block: CurriculumBlock, states: Record<string, TopicState>) {
  const total = block.topics.length
  let dominado = 0
  for (const t of block.topics) {
    const k = topicKey(track, block.level, t.slug)
    if (states[k] === 'dominado') dominado++
  }
  return { total, dominado, pct: total > 0 ? Math.round((dominado / total) * 100) : 0 }
}

function isBlockComplete(track: CurriculumTrack, block: CurriculumBlock, states: Record<string, TopicState>) {
  return block.topics.every(t => states[topicKey(track, block.level, t.slug)] === 'dominado')
}

/* ─── Components ─── */

function TopicChip({ topic, state, onCycle }: {
  topic: CurriculumTopic
  state: TopicState; onCycle: () => void
}) {
  const [open, setOpen] = useState(false)
  const meta = STATE_META[state]
  const hasSubtopics = topic.subtopics && topic.subtopics.length > 0

  return (
    <div className="card" style={{ padding: '12px 14px' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <button
          onClick={onCycle}
          title={`Estado: ${meta.label} — clique para avançar`}
          style={{
            width: 18, height: 18, borderRadius: 5, border: `1.5px solid ${meta.color}`,
            background: state === 'dominado' ? meta.color : 'transparent',
            cursor: 'pointer', flexShrink: 0, marginTop: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
          }}
        >
          {state === 'dominado' && <span style={{ color: '#fff', fontSize: 10, lineHeight: 1, fontWeight: 700 }}>✓</span>}
          {state === 'estudando' && <span style={{ width: 6, height: 6, borderRadius: '50%', background: meta.color, display: 'inline-block' }} />}
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13.5, fontWeight: 700, color: 'var(--fg)' }}>{topic.title}</span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: '.05em', textTransform: 'uppercase', color: meta.color }}>{meta.label}</span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--fg-mute)', lineHeight: 1.5, margin: '4px 0 0' }}>{topic.why}</p>
          {hasSubtopics && (
            <button
              onClick={() => setOpen(o => !o)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, marginTop: 6, fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: 'var(--fg-dim)', display: 'flex', alignItems: 'center', gap: 5 }}
            >
              <span style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .15s', display: 'inline-block' }}>▶</span>
              {open ? 'ocultar pontos de pesquisa' : `${topic.subtopics!.length} pontos de pesquisa`}
            </button>
          )}
          {hasSubtopics && open && (
            <ul style={{ margin: '8px 0 0', paddingLeft: 16, fontSize: 12, color: 'var(--fg-mute)', lineHeight: 1.7 }}>
              {topic.subtopics!.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

function PracticeQuestionCard({ q_pt, q_en, hint }: { q_pt: string; q_en: string; hint: string }) {
  return (
    <div className="card" style={{ padding: '14px 16px' }}>
      <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--fg-dim)', marginBottom: 6 }}>PT</p>
      <p style={{ fontSize: 13.5, color: 'var(--fg)', marginBottom: 10, lineHeight: 1.5 }}>{q_pt}</p>
      <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: '.06em', textTransform: 'uppercase', color: '#3b82f6', marginBottom: 6 }}>EN</p>
      <p style={{ fontSize: 13.5, color: 'var(--fg)', marginBottom: 10, lineHeight: 1.5, fontStyle: 'italic' }}>{q_en}</p>
      <div style={{ background: 'var(--bg-elev)', borderRadius: 6, padding: '8px 12px' }}>
        <p style={{ fontSize: 11.5, color: 'var(--fg-mute)', lineHeight: 1.6, margin: 0 }}><strong style={{ color: 'var(--fg-dim)' }}>estrutura esperada:</strong> {hint}</p>
      </div>
    </div>
  )
}

function BlockCard({ track, block, states, onCycleTopic }: {
  track: CurriculumTrack
  block: CurriculumBlock
  states: Record<string, TopicState>
  onCycleTopic: (slug: string) => void
}) {
  const { total, dominado, pct } = blockProgress(track, block, states)
  const complete = isBlockComplete(track, block, states)
  const trackColor = TRACK_META[track].color

  return (
    <div style={{ marginBottom: 14 }}>
      <div className="card" style={{ padding: '18px 20px', borderTop: `3px solid ${trackColor}` }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase', color: trackColor, background: trackColor + '1a', padding: '3px 8px', borderRadius: 5 }}>{LEVEL_LABEL[block.level]}</span>
          <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 16, fontWeight: 700, color: 'var(--fg)', flex: 1 }}>{block.title}</span>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: 'var(--fg-dim)' }}>{dominado}/{total}</span>
        </div>
        <p style={{ fontSize: 12.5, color: 'var(--fg-mute)', lineHeight: 1.6, marginBottom: 10 }}>{block.goal}</p>

        <div style={{ height: 5, background: 'var(--bg-elev)', borderRadius: 3, overflow: 'hidden', marginBottom: 8 }}>
          <div style={{ height: '100%', width: `${pct}%`, background: trackColor, transition: 'width .2s' }} />
        </div>

        {block.paceRef && (
          <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--fg-dim)', marginBottom: 14 }}>{block.paceRef}</p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {block.topics.map(t => (
            <TopicChip
              key={t.slug}
              topic={t}
              state={states[topicKey(track, block.level, t.slug)] ?? 'pendente'}
              onCycle={() => onCycleTopic(t.slug)}
            />
          ))}
        </div>

        {block.practiceQuestions && block.practiceQuestions.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--fg-dim)', marginBottom: 10 }}>perguntas de prática</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {block.practiceQuestions.map((q, i) => <PracticeQuestionCard key={i} {...q} />)}
            </div>
          </div>
        )}

        {complete && (
          <div style={{ marginTop: 14, background: 'rgba(34,197,94,.08)', border: '1px solid rgba(34,197,94,.25)', borderRadius: 8, padding: '10px 14px', fontSize: 12.5, color: 'var(--fg-mute)' }}>
            <strong style={{ color: '#22c55e' }}>Bloco cobrido.</strong> Avise no chat que terminou este bloco — a prova bilíngue (PT/EN, resposta em inglês) decide se o próximo nível libera.
          </div>
        )}
      </div>
    </div>
  )
}

function ExamHistory({ track }: { track: CurriculumTrack }) {
  const exams = BLOCK_EXAMS.filter(e => e.track === track).sort((a, b) => b.date.localeCompare(a.date))
  if (exams.length === 0) return null

  return (
    <div style={{ marginTop: 24 }}>
      <p className="hdr-label"><span className="ln" /> provas de bloco</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {exams.map(e => (
          <div key={e.id} className="card" style={{ padding: '14px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--fg-dim)' }}>{e.date}</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--fg-mute)', background: 'var(--bg-elev)', padding: '2px 7px', borderRadius: 4 }}>{LEVEL_LABEL[e.level]}</span>
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, fontWeight: 700 }}>{e.overallScore}/10</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: '.06em', textTransform: 'uppercase', color: e.verdict === 'aprovado' ? '#22c55e' : '#f59e0b' }}>{e.verdict}</span>
            </div>
            <p style={{ fontSize: 12.5, color: 'var(--fg-mute)', lineHeight: 1.6, margin: 0 }}>{e.summary}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Page ─── */

export default function GapPage() {
  const [track, setTrack] = useState<CurriculumTrack>('sysdesign')
  const [states, setStates] = useState<Record<string, TopicState>>({})
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setStates(loadTopicStates())
    setMounted(true)
  }, [])

  const handleCycle = (level: CurriculumLevel, slug: string) => {
    setStates(prev => {
      const k = topicKey(track, level, slug)
      const cur = prev[k] ?? 'pendente'
      const next = { ...prev, [k]: NEXT_STATE[cur] }
      saveTopicStates(next)
      return next
    })
  }

  const meta = TRACK_META[track]

  const overall = useMemo(() => {
    let total = 0, dominado = 0
    for (const b of meta.blocks) {
      const p = blockProgress(track, b, states)
      total += p.total
      dominado += p.dominado
    }
    return { total, dominado, pct: total > 0 ? Math.round((dominado / total) * 100) : 0 }
  }, [track, states, meta.blocks])

  return (
    <>
      <Nav />
      <div className="shell">

        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg,rgba(239,68,68,.06),rgba(168,85,247,.04))', border: '1px solid var(--scarlet-soft)', borderRadius: 16, padding: '26px 30px', marginBottom: 28, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 90% 10%,rgba(239,68,68,.14),transparent 55%)', pointerEvents: 'none' }} />
          <p className="hdr-label"><span className="ln" /> progressão por domínio, não por calendário</p>
          <h1>Fechando o gap entre <em>explicar</em> e construir.</h1>
          <p className="desc" style={{ marginBottom: 0, maxWidth: 720 }}>
            Três trilhas, três blocos cada — Iniciante, Intermediário, Avançado. Estuda os tópicos do bloco na ordem que quiser, mergulhando quando bater vontade em vez de hora fixa todo dia, numa trilha só por vez. Quando cobrir tudo, avisa no chat: uma prova bilíngue (você responde em inglês) decide se libera o próximo nível.
          </p>
        </div>

        {/* Track toggle */}
        <div style={{ display: 'flex', gap: 6, background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 12, padding: 5, marginBottom: 24, position: 'sticky', top: 80, zIndex: 30, backdropFilter: 'blur(10px)', flexWrap: 'wrap' }}>
          {TRACK_ORDER.map(t => (
            <button key={t} onClick={() => setTrack(t)} style={{
              flex: '1 1 140px', padding: '10px 16px', border: 'none', borderRadius: 8,
              fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: '.04em', cursor: 'pointer', transition: 'all .15s',
              background: track === t ? TRACK_META[t].color : 'transparent',
              color: track === t ? '#fff' : 'var(--fg-mute)',
              boxShadow: track === t ? `0 4px 14px ${TRACK_META[t].color}40` : 'none',
            }}>
              {TRACK_META[t].label}
            </button>
          ))}
        </div>

        {mounted && (
          <>
            <section style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6, flexWrap: 'wrap' }}>
                <p className="hdr-label" style={{ margin: 0 }}><span className="ln" /> {meta.label} · progresso geral</p>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: meta.color, fontWeight: 700 }}>{overall.dominado}/{overall.total} · {overall.pct}%</span>
              </div>
              <p className="desc" style={{ marginBottom: 0, maxWidth: 680 }}>{meta.sub}</p>
            </section>

            <section style={{ marginBottom: 40 }}>
              {LEVEL_ORDER.map(lvl => {
                const block = meta.blocks.find(b => b.level === lvl)
                if (!block) return null
                return (
                  <BlockCard
                    key={lvl}
                    track={track}
                    block={block}
                    states={states}
                    onCycleTopic={slug => handleCycle(lvl, slug)}
                  />
                )
              })}
              <ExamHistory track={track} />
            </section>
          </>
        )}

        {/* Sobre linguagens */}
        <section style={{ marginBottom: 24 }}>
          <p className="hdr-label"><span className="ln" /> sobre linguagens específicas</p>
          <p className="desc" style={{ maxWidth: 720 }}>
            React e Node (stack atual) ganham fluência de escrita como efeito colateral do bloco Iniciante de Live Coding — não têm trilha própria aqui. Laravel, PHP e frameworks fora da stack diária ficam <strong style={{ color: 'var(--fg)' }}>fora do escopo por enquanto</strong>: raramente são o filtro de entrada em vaga fullstack JS-first, e abrir essa frente agora dilui o foco nos gaps que de fato bloqueiam a aprovação.
          </p>
        </section>

        {/* Closing */}
        <div style={{ borderTop: '1px solid var(--line)', paddingTop: 20, marginTop: 8 }}>
          <p style={{ fontSize: 13, color: 'var(--fg-mute)', lineHeight: 1.7, maxWidth: 700 }}>
            Sem hora fixa por dia — mergulha quando a curiosidade estiver alta, numa trilha só por vez. O progresso registrado aqui, mais o <a href="/log" style={{ color: 'var(--scarlet)' }}>histórico de tentativas</a>, é o dado real que orienta cada prova de bloco.
          </p>
        </div>

      </div>
    </>
  )
}
