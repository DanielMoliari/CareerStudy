/* CareerStudy — gerenciador de progresso por skill (localStorage)
 *
 * Estados (cycle ao clicar):
 *   pendente    — ainda nao tocou
 *   lendo       — estudando teoria, vendo videos, lendo docs
 *   praticando  — aplicando em codigo / exercicios
 *   domino      — sei explicar e defender em entrevista
 *   revisar     — sabia, mas precisa revisitar
 *
 * Schema localStorage:
 *   key: 'careerstudy.progress.v1'
 *   value: { [slug]: { state, updatedAt, notes? } }
 */

const STORAGE_KEY = 'careerstudy.progress.v1'

const STATE_ORDER = ['pendente', 'lendo', 'praticando', 'domino', 'revisar']
const STATE_LABELS = {
  pendente:   'pendente',
  lendo:      'lendo',
  praticando: 'praticando',
  domino:     'domino',
  revisar:    'revisar',
}
const STATE_FULL = {
  pendente:   'Pendente — ainda nao comecei',
  lendo:      'Lendo — estudando teoria',
  praticando: 'Praticando — aplicando em codigo',
  domino:     'Domino — sei explicar em entrevista',
  revisar:    'Revisar — preciso revisitar',
}
const STATE_COLOR = {
  pendente:   '#64748b',
  lendo:      '#eab308',
  praticando: '#3b82f6',
  domino:     '#22c55e',
  revisar:    '#a855f7',
}

function loadAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch { return {} }
}

function saveAll(map) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
}

function getState(slug) {
  const all = loadAll()
  return (all[slug] && all[slug].state) || 'pendente'
}

function setState(slug, state) {
  const all = loadAll()
  if (state === 'pendente') {
    delete all[slug]
  } else {
    all[slug] = { state, updatedAt: Date.now() }
  }
  saveAll(all)
  document.dispatchEvent(new CustomEvent('progress-change', { detail: { slug, state } }))
}

function cycleState(slug) {
  const cur = getState(slug)
  const idx = STATE_ORDER.indexOf(cur)
  const next = STATE_ORDER[(idx + 1) % STATE_ORDER.length]
  setState(slug, next)
  return next
}

function getNote(slug) {
  const all = loadAll()
  return (all[slug] && all[slug].notes) || ''
}

function setNote(slug, notes) {
  const all = loadAll()
  if (!all[slug]) all[slug] = { state: 'pendente', updatedAt: Date.now() }
  all[slug].notes = notes
  all[slug].updatedAt = Date.now()
  saveAll(all)
  document.dispatchEvent(new CustomEvent('progress-change', { detail: { slug } }))
}

function stats(skills) {
  const list = skills || (window.SKILLS && window.SKILLS.ALL_SKILLS) || []
  const counts = { pendente: 0, lendo: 0, praticando: 0, domino: 0, revisar: 0 }
  list.forEach(s => { counts[getState(s.slug)]++ })
  const total = list.length
  const done = counts.domino
  const active = counts.lendo + counts.praticando + counts.revisar
  const pct = total ? Math.round((done / total) * 100) : 0
  return { counts, total, done, active, pct }
}

function statsByPriority(p) {
  const list = (window.SKILLS && window.SKILLS.ALL_SKILLS || []).filter(s => s.p === p)
  return stats(list)
}

function exportJSON() {
  return JSON.stringify(loadAll(), null, 2)
}

function importJSON(json) {
  try {
    const obj = JSON.parse(json)
    if (typeof obj !== 'object' || obj === null) throw new Error('invalid')
    saveAll(obj)
    document.dispatchEvent(new CustomEvent('progress-change', { detail: {} }))
    return true
  } catch { return false }
}

function reset() {
  localStorage.removeItem(STORAGE_KEY)
  document.dispatchEvent(new CustomEvent('progress-change', { detail: {} }))
}

window.PROGRESS = {
  STATE_ORDER, STATE_LABELS, STATE_FULL, STATE_COLOR,
  getState, setState, cycleState, getNote, setNote,
  stats, statsByPriority, exportJSON, importJSON, reset, loadAll,
}
