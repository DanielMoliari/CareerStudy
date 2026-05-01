'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Nav from '@/components/Nav'
import { CATEGORIES, ALL_SKILLS, iconUrl } from '@/data/skills'
import { useProgress, STATE_LABELS } from '@/hooks/useProgress'
import type { ProgressState } from '@/types'

type FilterKind = 'all' | 'p1' | 'p2' | 'p3' | ProgressState

const FILTER_PILLS: { key: FilterKind; label: string }[] = [
  { key: 'all',        label: 'todas' },
  { key: 'p1',         label: 'p1' },
  { key: 'p2',         label: 'p2' },
  { key: 'p3',         label: 'p3' },
  { key: 'pendente',   label: 'pendentes' },
  { key: 'lendo',      label: 'lendo' },
  { key: 'praticando', label: 'praticando' },
  { key: 'domino',     label: 'domino' },
  { key: 'revisar',    label: 'revisar' },
]

export default function SkillsPage() {
  const router = useRouter()
  const progress = useProgress(ALL_SKILLS)
  const { mounted, cycleState, getState, exportJSON, importJSON, reset } = progress

  const [filterKind, setFilterKind] = useState<FilterKind>('all')
  const [filterQ, setFilterQ] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const p1count = ALL_SKILLS.filter(s => s.p === 1).length
  const p2count = ALL_SKILLS.filter(s => s.p === 2).length
  const p3count = ALL_SKILLS.filter(s => s.p === 3).length

  function isVisible(skillSlug: string, skillPriority: number): boolean {
    const q = filterQ.toLowerCase()
    if (q) {
      const skill = ALL_SKILLS.find(s => s.slug === skillSlug)
      if (!skill || !skill.name.toLowerCase().includes(q)) return false
    }
    if (filterKind === 'all') return true
    if (filterKind === 'p1') return skillPriority === 1
    if (filterKind === 'p2') return skillPriority === 2
    if (filterKind === 'p3') return skillPriority === 3
    // state filter
    if (!mounted) return true
    return getState(skillSlug) === filterKind
  }

  function handleChipClick(e: React.MouseEvent, slug: string) {
    if (e.ctrlKey || e.shiftKey) {
      router.push(`/skill/${slug}`)
    } else {
      cycleState(slug)
    }
  }

  function handleExport() {
    const json = exportJSON()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'careerstudy-progress.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const text = ev.target?.result as string
      const ok = importJSON(text)
      if (!ok) alert('Arquivo inválido — verifique o formato JSON')
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
    reader.readAsText(file)
  }

  function handleReset() {
    if (confirm('Zerar todo o progresso? Esta ação não pode ser desfeita.')) {
      reset()
    }
  }

  return (
    <>
      <Nav />
      <div className="shell">
        <p className="hdr-label"><span className="ln" /> mapa de estudo</p>
        <h1>Tudo que preciso <em>estudar</em></h1>
        <p className="desc">
          Skills dos CVs, LinkedIn e gaps identificados no mercado 2025-2026.{' '}
          <strong style={{ color: 'var(--fg)' }}>Clique</strong> num chip cicla o estado de progresso.{' '}
          <strong style={{ color: 'var(--fg)' }}>Shift+clique</strong> abre o detalhe da skill com teoria,
          perguntas de entrevista e recursos.
        </p>

        {/* Legend */}
        <div className="legend">
          <div className="legend-item"><span className="dot p1" /> Essencial — estudar primeiro</div>
          <div className="legend-item"><span className="dot p2" /> Importante — complementa stack</div>
          <div className="legend-item"><span className="dot p3" /> Bonus — já sei ou baixa urgência</div>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '.68rem',
            color: 'var(--fg-dim)',
            letterSpacing: '.04em',
            marginLeft: 'auto',
          }}>
            {ALL_SKILLS.length} skills — {p1count} essenciais, {p2count} importantes, {p3count} bonus
          </span>
        </div>

        {/* Filter bar */}
        <div className="filterbar">
          <input
            type="text"
            className="search"
            placeholder="buscar skill — ex: react, postgres, kafka"
            value={filterQ}
            onChange={e => setFilterQ(e.target.value)}
          />
          {FILTER_PILLS.map(pill => (
            <span
              key={pill.key}
              className={`pill${filterKind === pill.key ? ' active' : ''}`}
              onClick={() => setFilterKind(pill.key)}
            >
              {pill.label}
            </span>
          ))}
        </div>

        {/* Tiers */}
        {CATEGORIES.map(cat => {
          const visibleSkills = cat.skills.filter(([name, p]) => {
            const slug = name.toLowerCase()
              .normalize('NFD').replace(/[̀-ͯ]/g, '')
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-|-$/g, '')
            return isVisible(slug, p)
          })
          if (visibleSkills.length === 0) return null

          return (
            <div key={cat.key} className="tier">
              <div className="tier-hd">
                <span className="tier-lbl">{cat.label}</span>
                <span className="tier-ln" />
                <span className="tier-ct">{visibleSkills.length}/{cat.skills.length}</span>
              </div>
              <div className="chips">
                {visibleSkills.map(([name, p]) => {
                  const slug = name.toLowerCase()
                    .normalize('NFD').replace(/[̀-ͯ]/g, '')
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-|-$/g, '')
                  const state = mounted ? getState(slug) : 'pendente'
                  const url = iconUrl(name)

                  return (
                    <span
                      key={slug}
                      className="chip"
                      data-state={state}
                      onClick={e => handleChipClick(e, slug)}
                      title="Clique = ciclar estado | Shift+clique = abrir detalhe"
                    >
                      <span className={`dot p${p}`} />
                      {url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={url} alt="" width={16} height={16} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                      )}
                      {name}
                      {state !== 'pendente' && (
                        <span className={`state-pill ${state}`}>
                          {STATE_LABELS[state as ProgressState]}
                        </span>
                      )}
                    </span>
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* Bottom bar */}
        <div style={{
          marginTop: 48,
          paddingTop: 24,
          borderTop: '1px solid var(--line)',
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          fontSize: 11,
          color: 'var(--fg-dim)',
          alignItems: 'center',
        }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>progresso:</span>
          <button className="btn ghost" onClick={handleExport}>exportar JSON</button>
          <button className="btn ghost" onClick={() => fileInputRef.current?.click()}>importar JSON</button>
          <button className="btn ghost" onClick={handleReset}>zerar tudo</button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={handleImport}
          />
        </div>
      </div>
    </>
  )
}
