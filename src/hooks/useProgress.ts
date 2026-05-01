'use client'
import { useState, useEffect, useCallback } from 'react'
import type { ProgressState, SkillStats, Skill } from '@/types'

const STORAGE_KEY = 'careerstudy.progress.v1'

export const STATE_ORDER: ProgressState[] = ['pendente', 'lendo', 'praticando', 'domino', 'revisar']

export const STATE_LABELS: Record<ProgressState, string> = {
  pendente:   'pendente',
  lendo:      'lendo',
  praticando: 'praticando',
  domino:     'domino',
  revisar:    'revisar',
}

export const STATE_FULL: Record<ProgressState, string> = {
  pendente:   'Pendente — ainda não comecei',
  lendo:      'Lendo — estudando teoria',
  praticando: 'Praticando — aplicando em código',
  domino:     'Domino — sei explicar em entrevista',
  revisar:    'Revisar — preciso revisitar',
}

export const STATE_COLORS: Record<ProgressState, string> = {
  pendente:   '#64748b',
  lendo:      '#eab308',
  praticando: '#3b82f6',
  domino:     '#22c55e',
  revisar:    '#a855f7',
}

type StoreEntry = { state: ProgressState; updatedAt: number; notes?: string }
type Store = Record<string, StoreEntry>

function loadAll(): Store {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch { return {} }
}

function saveAll(map: Store) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  window.dispatchEvent(new CustomEvent('progress-change'))
}

export function useProgress(skillList?: Skill[]) {
  const [, forceUpdate] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handler = () => forceUpdate(n => n + 1)
    window.addEventListener('progress-change', handler)
    return () => window.removeEventListener('progress-change', handler)
  }, [])

  const getState = useCallback((slug: string): ProgressState => {
    const all = loadAll()
    return (all[slug]?.state) ?? 'pendente'
  }, [])

  const setState = useCallback((slug: string, state: ProgressState) => {
    const all = loadAll()
    if (state === 'pendente') {
      const { notes } = all[slug] ?? {}
      if (notes) {
        all[slug] = { state: 'pendente', updatedAt: Date.now(), notes }
      } else {
        delete all[slug]
      }
    } else {
      all[slug] = { ...(all[slug] ?? {}), state, updatedAt: Date.now() }
    }
    saveAll(all)
  }, [])

  const cycleState = useCallback((slug: string): ProgressState => {
    const cur = getState(slug)
    const idx = STATE_ORDER.indexOf(cur)
    const next = STATE_ORDER[(idx + 1) % STATE_ORDER.length]
    setState(slug, next)
    return next
  }, [getState, setState])

  const getNote = useCallback((slug: string): string => {
    const all = loadAll()
    return all[slug]?.notes ?? ''
  }, [])

  const setNote = useCallback((slug: string, notes: string) => {
    const all = loadAll()
    if (!all[slug]) all[slug] = { state: 'pendente', updatedAt: Date.now() }
    all[slug].notes = notes
    all[slug].updatedAt = Date.now()
    saveAll(all)
  }, [])

  const stats = useCallback((skills?: Skill[]): SkillStats => {
    const list = skills ?? skillList ?? []
    const counts: Record<ProgressState, number> = {
      pendente: 0, lendo: 0, praticando: 0, domino: 0, revisar: 0,
    }
    list.forEach(s => { counts[getState(s.slug)]++ })
    const total = list.length
    const done = counts.domino
    const active = counts.lendo + counts.praticando + counts.revisar
    const pct = total ? Math.round((done / total) * 100) : 0
    return { counts, total, done, active, pct }
  }, [skillList, getState])

  const exportJSON = useCallback((): string => {
    return JSON.stringify(loadAll(), null, 2)
  }, [])

  const importJSON = useCallback((json: string): boolean => {
    try {
      const obj = JSON.parse(json)
      if (typeof obj !== 'object' || obj === null) throw new Error('invalid')
      saveAll(obj as Store)
      return true
    } catch { return false }
  }, [])

  const reset = useCallback(() => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new CustomEvent('progress-change'))
  }, [])

  return {
    mounted,
    getState,
    setState,
    cycleState,
    getNote,
    setNote,
    stats,
    exportJSON,
    importJSON,
    reset,
  }
}
