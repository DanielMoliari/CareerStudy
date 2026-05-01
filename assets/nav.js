/* CareerStudy — top nav compartilhado.
 * Usar: <div id="nav"></div> + <script src="assets/nav.js"></script>
 *       <script>renderNav('skills')</script>
 */

const NAV_ITEMS = [
  { key: 'index',    href: 'index.html',         label: 'inicio',    ico: '◆' },
  { key: 'skills',   href: 'skills-study.html',  label: 'mapa',      ico: '◇' },
  { key: 'graph',    href: 'graph.html',         label: 'grafo',     ico: '◯' },
  { key: 'concepts', href: 'concepts.html',      label: 'conceitos', ico: '◐' },
  { key: 'routine',  href: 'routine.html',       label: 'rotina',    ico: '◑' },
]

function renderNav(active) {
  const el = document.getElementById('nav')
  if (!el) return
  el.dataset.active = active || ''
  const links = NAV_ITEMS.map(i =>
    `<a href="${i.href}" class="${i.key === active ? 'active' : ''}"><span class="nav-ico">${i.ico}</span>${i.label}</a>`
  ).join('')

  let progressHtml = ''
  if (window.PROGRESS && window.SKILLS) {
    const s = window.PROGRESS.stats()
    progressHtml = `
      <div class="spacer"></div>
      <div class="progress-mini" title="${s.done}/${s.total} skills com domino">
        <span>${s.pct}%</span>
        <div class="bar"><div class="bar-fill" style="width:${s.pct}%"></div></div>
        <span>${s.done}/${s.total}</span>
      </div>`
  }

  el.className = 'topnav'
  el.innerHTML = links + progressHtml
}

document.addEventListener('progress-change', () => {
  const el = document.getElementById('nav')
  if (el) renderNav(el.dataset.active || null)
})
