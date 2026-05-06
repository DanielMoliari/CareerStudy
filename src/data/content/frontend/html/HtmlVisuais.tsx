'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { ConceptCarousel } from '@/components/visuals/ConceptCarousel'
import type { Slide } from '@/components/visuals/ConceptCarousel'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'
import { ProgressionMap } from '@/components/visuals/ProgressionMap'
import type { ProgressionLevel } from '@/components/visuals/ProgressionMap'
import { CardCarousel } from '@/components/visuals/CardCarousel'
import type { CarouselCard } from '@/components/visuals/CardCarousel'

// ── Paleta HTML ─────────────────────────────────────────────────────────────────
const C      = '#E44D26'   // laranja HTML5
const BG     = '#0f172a'
const CARD   = '#1e293b'
const CARD2  = '#243044'
const LINE   = '#334155'
const MUTE   = '#475569'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const RED    = '#f87171'
const GRN    = '#4ade80'
const AMB    = '#f59e0b'
const SKY    = '#38bdf8'
const PRP    = '#a78bfa'

void CARD2; void MUTE; void RED

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Critical Rendering Path (ConceptCarousel)
// ═══════════════════════════════════════════════════════════════════════════════

function CRPIllustration() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap', rowGap: 12, height: 200 }}>
      {[
        { label: 'HTML', sub: 'parse', color: C },
        { label: 'DOM', sub: 'tree', color: SKY },
        { label: 'CSS', sub: 'parse', color: PRP },
        { label: 'CSSOM', sub: 'tree', color: PRP },
        { label: 'Render Tree', sub: 'merge', color: AMB },
        { label: 'Layout', sub: 'geom', color: GRN },
        { label: 'Paint', sub: 'pixels', color: GRN },
      ].map((step, i) => (
        <div key={step.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            background: `${step.color}15`,
            border: `1.5px solid ${step.color}80`,
            borderRadius: 8,
            padding: '8px 12px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 11, color: step.color, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>{step.label}</div>
            <div style={{ fontSize: 9, color: FGMUTE }}>{step.sub}</div>
          </div>
          {i < 6 && <div style={{ fontSize: 16, color: FGMUTE }}>→</div>}
        </div>
      ))}
    </div>
  )
}

function DeferAsyncIllustration() {
  const bars = [
    { label: 'Sem attr', parse: [0, 40], download: [40, 65], exec: [65, 80], total: 80, color: RED },
    { label: 'async', parse1: [0, 40], download: [0, 30], exec: [40, 55], parse2: [55, 90], total: 90, color: AMB },
    { label: 'defer', parse: [0, 90], download: [0, 30], exec: [90, 105], total: 105, color: GRN },
  ]
  void bars
  return (
    <div style={{ height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 18 }}>
      {[
        { label: 'sync (sem attr)', items: [{x:0, w:40, c:C, t:'parse'},{x:40, w:28, c:RED, t:'download'},{x:68, w:20, c:AMB, t:'exec'}], color: RED },
        { label: 'async', items: [{x:0, w:90, c:C, t:'parse'},{x:0, w:28, c:PRP, t:'dl (paralelo)'},{x:28, w:20, c:AMB, t:'exec'}], color: AMB },
        { label: 'defer', items: [{x:0, w:90, c:C, t:'parse'},{x:0, w:28, c:SKY, t:'dl (paralelo)'},{x:90, w:20, c:GRN, t:'exec'}], color: GRN },
      ].map(row => (
        <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 10, color: row.color, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", minWidth: 80 }}>{row.label}</div>
          <div style={{ flex: 1, position: 'relative', height: 26 }}>
            {row.items.map((item, i) => (
              <div key={i} style={{
                position: 'absolute', left: `${item.x}%`, width: `${item.w}%`, height: '100%',
                background: `${item.c}30`, border: `1px solid ${item.c}80`,
                borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 8, color: item.c, fontFamily: "'JetBrains Mono',monospace",
              }}>{item.t}</div>
            ))}
          </div>
        </div>
      ))}
      <div style={{ fontSize: 9, color: FGMUTE, fontFamily: "'JetBrains Mono',monospace" }}>→ tempo (ms) — representação esquemática</div>
    </div>
  )
}

function PreloadIllustration() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, height: 200, alignItems: 'center' }}>
      {[
        { label: 'preload', color: GRN, desc: 'recurso ATUAL\nalta prioridade\ndownload imediato', use: 'fonte crítica, img hero, CSS above-fold' },
        { label: 'prefetch', color: SKY, desc: 'próxima ROTA\nbaixa prioridade\ndownload ocioso', use: 'próxima página do fluxo' },
        { label: 'preconnect', color: AMB, desc: 'TCP+TLS antecipado\nsem baixar recurso\n150-300ms economizados', use: 'Google Fonts, CDN, APIs externas' },
        { label: 'dns-prefetch', color: PRP, desc: 'só DNS\nmais leve\nsem TCP/TLS', use: 'origens menos prioritárias' },
      ].map(item => (
        <div key={item.label} style={{
          background: `${item.color}10`, border: `1px solid ${item.color}50`, borderRadius: 8, padding: 12,
        }}>
          <div style={{ fontSize: 11, color: item.color, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", marginBottom: 4 }}>{item.label}</div>
          <div style={{ fontSize: 9, color: FGMUTE, whiteSpace: 'pre-line', lineHeight: 1.5, marginBottom: 4 }}>{item.desc}</div>
          <div style={{ fontSize: 9, color: FG, fontStyle: 'italic' }}>{item.use}</div>
        </div>
      ))}
    </div>
  )
}

function BlockingIllustration() {
  return (
    <div style={{ height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16, padding: '0 20px' }}>
      <div style={{ fontSize: 10, color: AMB, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", marginBottom: 4 }}>Dois tipos de bloqueio diferentes:</div>
      <div style={{ background: `${RED}15`, border: `1px solid ${RED}50`, borderRadius: 8, padding: 12 }}>
        <div style={{ fontSize: 11, color: RED, fontWeight: 700, marginBottom: 4 }}>Parser block (scripts síncronos)</div>
        <div style={{ fontSize: 10, color: FGMUTE }}>O browser PARA de construir o DOM enquanto o script baixa e executa. A página não avança na construção da árvore.</div>
      </div>
      <div style={{ background: `${AMB}15`, border: `1px solid ${AMB}50`, borderRadius: 8, padding: 12 }}>
        <div style={{ fontSize: 11, color: AMB, fontWeight: 700, marginBottom: 4 }}>Render block (stylesheets)</div>
        <div style={{ fontSize: 10, color: FGMUTE }}>O DOM continua sendo construído, mas a tela fica BRANCA até o CSSOM estar completo. O browser não pinta sem o CSS.</div>
      </div>
    </div>
  )
}

const CONCEPT_SLIDES: Slide[] = [
  {
    title: 'O Critical Rendering Path',
    paragraphs: [
      'A sequência que o browser percorre do HTML bruto até os pixels na tela: parse HTML → DOM → CSSOM → Render Tree → Layout → Paint → Composite.',
      'Cada etapa depende da anterior. Otimizar o CRP significa reduzir o número de etapas bloqueadas e a duração de cada uma.',
      'FCP (First Contentful Paint) e LCP (Largest Contentful Paint) dependem diretamente da velocidade do CRP.',
    ],
    gradient: [C, '#ff8c00'],
    illustration: <CRPIllustration />,
  },
  {
    title: 'defer vs async — A Diferença Real',
    paragraphs: [
      'Ambos fazem download em paralelo com o parsing do HTML. A diferença é QUANDO executam.',
      'async executa assim que termina o download — pode interromper o parser a qualquer momento. Não garante ordem entre scripts.',
      'defer executa DEPOIS que o HTML foi completamente parseado, preservando a ordem. Use defer para scripts que dependem do DOM.',
    ],
    gradient: [AMB, '#f97316'],
    illustration: <DeferAsyncIllustration />,
  },
  {
    title: 'Resource Hints — preload, prefetch, preconnect',
    paragraphs: [
      'preload: recurso necessário AGORA, alta prioridade. Use para fontes críticas, CSS above-fold, imagem hero.',
      'prefetch: recurso para a PRÓXIMA navegação. O browser baixa quando estiver ocioso — não urgente.',
      'preconnect: estabelece TCP+TLS antecipadamente sem baixar recurso. Economiza 150-300ms de handshake.',
    ],
    gradient: [GRN, '#22c55e'],
    illustration: <PreloadIllustration />,
  },
  {
    title: 'Parser Block vs Render Block',
    paragraphs: [
      'Scripts síncronos bloqueiam o PARSER: o browser para de construir o DOM até o script terminar. A diferença entre uma página rápida e uma página lenta muitas vezes está aqui.',
      'Stylesheets bloqueiam o RENDER: o DOM é construído normalmente, mas a tela fica em branco até o CSSOM estar completo.',
      'Entender essa distinção é fundamental para diagnosticar problemas de performance no DevTools Network tab.',
    ],
    gradient: [PRP, '#7c3aed'],
    illustration: <BlockingIllustration />,
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Elementos Semânticos (CardCarousel)
// ═══════════════════════════════════════════════════════════════════════════════

const SEMANTIC_CARDS: CarouselCard[] = [
  {
    name: '<main>',
    signature: '<main>conteúdo principal</main>',
    emoji: '🏠',
    color: C,
    use: [
      'Conteúdo principal ÚNICO da página',
      'Landmark de acessibilidade — screen readers saltam para ele',
      'Deve haver apenas UM por página',
    ],
    dontUse: 'Múltiplas vezes na mesma página. Nunca inclua nav, header ou footer dentro de main.',
    difficulty: 1,
  },
  {
    name: '<article>',
    signature: '<article>conteúdo independente</article>',
    emoji: '📄',
    color: AMB,
    use: [
      'Conteúdo que faz sentido fora do contexto da página',
      'Post de blog, card de produto, comentário, tweet',
      'Pode ter seu próprio header, footer, section dentro',
    ],
    dontUse: 'Para agrupamento genérico de layout. Se o conteúdo não faz sentido fora da página, é section ou div.',
    difficulty: 2,
  },
  {
    name: '<section>',
    signature: '<section>agrupamento temático</section>',
    emoji: '📑',
    color: SKY,
    use: [
      'Agrupamento temático com heading (h1-h6)',
      'Quando o conteúdo é parte de algo maior (não independente)',
      'Aparece no outline do documento',
    ],
    dontUse: 'Sem heading filho (use div). Para conteúdo independente (use article). Para layout puro (use div).',
    difficulty: 2,
  },
  {
    name: '<nav>',
    signature: '<nav aria-label="principal">links</nav>',
    emoji: '🧭',
    color: GRN,
    use: [
      'Bloco de links de navegação principal',
      'Pode haver múltiplos (principal, paginação, breadcrumb)',
      'Use aria-label para distinguir quando há múltiplos navs',
    ],
    dontUse: 'Para links avulsos fora de um bloco de navegação. Nem todo grupo de links é um nav.',
    difficulty: 1,
  },
  {
    name: '<aside>',
    signature: '<aside>conteúdo relacionado</aside>',
    emoji: '📎',
    color: PRP,
    use: [
      'Conteúdo relacionado tangencialmente ao conteúdo principal',
      'Sidebar, callout box, publicidade relacionada',
      'Pull quotes, notas de rodapé laterais',
    ],
    dontUse: 'Para conteúdo principal da página. aside é complementar, não central.',
    difficulty: 2,
  },
  {
    name: '<figure>',
    signature: '<figure><img/><figcaption>legenda</figcaption></figure>',
    emoji: '🖼',
    color: AMB,
    use: [
      'Agrupa mídia auto-contida com legenda',
      'Não só imagens: também código, SVG, tabelas',
      'figcaption referenciado automaticamente por leitores de tela',
    ],
    dontUse: 'Para imagens decorativas sem relação com o conteúdo — use img diretamente ou background CSS.',
    difficulty: 1,
  },
  {
    name: '<time>',
    signature: '<time datetime="2024-06-15">15 de junho</time>',
    emoji: '🕐',
    color: SKY,
    use: [
      'Representar datas e horários de forma machine-readable',
      'datetime em formato ISO 8601 para interpretação correta',
      'Essencial para structured data e acessibilidade',
    ],
    dontUse: 'Para textos como "3 dias atrás" sem datetime — perde a semântica. Sempre inclua datetime.',
    difficulty: 1,
  },
  {
    name: '<details>/<summary>',
    signature: '<details><summary>Título</summary>conteúdo</details>',
    emoji: '▶',
    color: GRN,
    use: [
      'Accordion nativo sem JavaScript',
      'FAQs, termos e condições expansíveis, tooltips de contexto',
      'Acessível nativamente — teclado e screen reader sem ARIA extra',
    ],
    dontUse: 'Para UI complexa onde você precisa de animações ou controle preciso do estado — use JS com aria-expanded.',
    difficulty: 1,
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Acessibilidade Interativa (componente customizado)
// ═══════════════════════════════════════════════════════════════════════════════

const A11Y_CHECKLIST = [
  { id: 'alt', label: 'Imagens com alt descritivo (ou alt="" para decorativas)', category: 'Imagens', severity: 'crítico' },
  { id: 'label', label: 'Todo input tem <label> associado via for/id ou envolvendo o input', category: 'Formulários', severity: 'crítico' },
  { id: 'heading', label: 'Hierarquia de headings sem pular níveis (h1 → h2 → h3)', category: 'Estrutura', severity: 'crítico' },
  { id: 'contrast', label: 'Contraste mínimo 4.5:1 para texto normal, 3:1 para texto grande', category: 'Visual', severity: 'crítico' },
  { id: 'focus', label: 'Foco visível em todos os elementos interativos (não remover outline sem substituto)', category: 'Teclado', severity: 'crítico' },
  { id: 'keyboard', label: 'Toda funcionalidade acessível via teclado (Tab, Enter, Esc, setas)', category: 'Teclado', severity: 'crítico' },
  { id: 'landmark', label: 'Landmarks semânticos: main, nav, header, footer presentes', category: 'Estrutura', severity: 'importante' },
  { id: 'skip', label: 'Link "Pular para o conteúdo" como primeiro elemento focável', category: 'Teclado', severity: 'importante' },
  { id: 'lang', label: 'Atributo lang correto no <html> (ex: lang="pt-BR")', category: 'i18n', severity: 'importante' },
  { id: 'modal', label: 'Modais com focus trap — foco não escapa do modal aberto', category: 'Teclado', severity: 'importante' },
  { id: 'error', label: 'Mensagens de erro associadas via aria-describedby', category: 'Formulários', severity: 'importante' },
  { id: 'aria', label: 'ARIA apenas quando não há elemento HTML nativo equivalente', category: 'ARIA', severity: 'boas práticas' },
  { id: 'live', label: 'Regiões dinâmicas com aria-live para anúncios em tempo real', category: 'ARIA', severity: 'boas práticas' },
  { id: 'viewport', label: 'Viewport sem maximum-scale — usuários com baixa visão precisam de zoom', category: 'Mobile', severity: 'boas práticas' },
]

const SEVERITY_COLOR: Record<string, string> = {
  'crítico': RED,
  'importante': AMB,
  'boas práticas': GRN,
}

function A11YChecklist() {
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState<string>('all')

  const categories = ['all', ...Array.from(new Set(A11Y_CHECKLIST.map(i => i.category)))]
  const filtered = filter === 'all' ? A11Y_CHECKLIST : A11Y_CHECKLIST.filter(i => i.category === filter)
  const pct = Math.round((checked.size / A11Y_CHECKLIST.length) * 100)

  const toggle = (id: string) => setChecked(prev => {
    const next = new Set(prev)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    return next
  })

  return (
    <div style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10, color: C, fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono',monospace", marginBottom: 6 }}>
          VISUAL 3 — ACESSIBILIDADE
        </div>
        <div style={{ fontSize: 18, fontWeight: 800, color: FG, marginBottom: 4 }}>Checklist de Acessibilidade HTML</div>
        <div style={{ fontSize: 12, color: FGMUTE }}>Marque os itens que você já implementou. {A11Y_CHECKLIST.length} verificações no total.</div>
      </div>

      {/* Progresso */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: FGMUTE, fontFamily: "'JetBrains Mono',monospace" }}>{checked.size}/{A11Y_CHECKLIST.length} completos</span>
          <span style={{ fontSize: 11, color: C, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>{pct}%</span>
        </div>
        <div style={{ background: LINE, borderRadius: 999, height: 6, overflow: 'hidden' }}>
          <div style={{ background: C, height: '100%', width: `${pct}%`, borderRadius: 999, transition: 'width .3s' }} />
        </div>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} style={{
            padding: '4px 12px', borderRadius: 999, border: 'none', cursor: 'pointer',
            fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700,
            background: filter === cat ? `${C}25` : LINE,
            color: filter === cat ? C : FGMUTE,
            borderWidth: 1, borderStyle: 'solid',
            borderColor: filter === cat ? `${C}60` : 'transparent',
          }}>
            {cat === 'all' ? 'Todos' : cat}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map(item => {
          const done = checked.has(item.id)
          return (
            <div
              key={item.id}
              onClick={() => toggle(item.id)}
              style={{
                background: done ? `${GRN}10` : CARD,
                border: `1px solid ${done ? GRN + '50' : LINE}`,
                borderRadius: 8,
                padding: '10px 14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                transition: 'all .15s',
              }}
            >
              <div style={{
                width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 1,
                background: done ? GRN : 'transparent',
                border: `2px solid ${done ? GRN : MUTE}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {done && <span style={{ fontSize: 10, color: BG, fontWeight: 900 }}>✓</span>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: done ? FGMUTE : FG, textDecoration: done ? 'line-through' : 'none', lineHeight: 1.4 }}>{item.label}</div>
                <div style={{ marginTop: 4, display: 'flex', gap: 6 }}>
                  <span style={{ fontSize: 9, color: FGMUTE, fontFamily: "'JetBrains Mono',monospace" }}>{item.category}</span>
                  <span style={{ fontSize: 9, color: SEVERITY_COLOR[item.severity], fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>· {item.severity}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Meta Tags Builder
// ═══════════════════════════════════════════════════════════════════════════════

function MetaTagsBuilder() {
  const [title, setTitle] = useState('Título da Minha Página')
  const [description, setDescription] = useState('Descrição que aparece nos resultados de busca e no card de compartilhamento.')
  const [url, setUrl] = useState('https://exemplo.com/pagina')
  const [image, setImage] = useState('https://exemplo.com/og-image.jpg')

  const titleLen = title.length
  const descLen = description.length
  const titleOk = titleLen >= 30 && titleLen <= 60
  const descOk = descLen >= 120 && descLen <= 160

  const generated = `<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
<meta name="description" content="${description}" />
<link rel="canonical" href="${url}" />

<!-- Open Graph -->
<meta property="og:type"        content="website" />
<meta property="og:title"       content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image"       content="${image}" />
<meta property="og:url"         content="${url}" />

<!-- Twitter Card -->
<meta name="twitter:card"  content="summary_large_image" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:image" content="${image}" />`

  return (
    <div style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10, color: C, fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono',monospace", marginBottom: 6 }}>VISUAL 4 — META TAGS BUILDER</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: FG, marginBottom: 4 }}>Gerador de Meta Tags</div>
        <div style={{ fontSize: 12, color: FGMUTE }}>Preencha os campos e veja o código gerado em tempo real.</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Formulário */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { label: 'Título', val: title, set: setTitle, min: 30, max: 60, placeholder: 'Título da página (30-60 chars)' },
            { label: 'Descrição', val: description, set: setDescription, min: 120, max: 160, placeholder: 'Descrição (120-160 chars)' },
            { label: 'URL Canônica', val: url, set: setUrl, min: 0, max: 999, placeholder: 'https://...' },
            { label: 'Imagem OG (1200x630)', val: image, set: setImage, min: 0, max: 999, placeholder: 'https://...jpg' },
          ].map(field => {
            const len = field.val.length
            const ok = field.max < 999 ? len >= field.min && len <= field.max : true
            const color = field.max < 999 ? (ok ? GRN : len > field.max ? RED : AMB) : FGMUTE
            return (
              <div key={field.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <label style={{ fontSize: 11, color: FGMUTE, fontFamily: "'JetBrains Mono',monospace" }}>{field.label}</label>
                  {field.max < 999 && <span style={{ fontSize: 10, color, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>{len}/{field.max}</span>}
                </div>
                <input
                  value={field.val}
                  onChange={e => field.set(e.target.value)}
                  placeholder={field.placeholder}
                  style={{
                    width: '100%', padding: '8px 12px', borderRadius: 6,
                    background: BG, border: `1px solid ${field.max < 999 ? (ok ? GRN + '50' : RED + '50') : LINE}`,
                    color: FG, fontSize: 12, fontFamily: "'JetBrains Mono',monospace",
                    outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
            )
          })}

          {/* Preview do card social */}
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 10, color: FGMUTE, fontFamily: "'JetBrains Mono',monospace", marginBottom: 8, letterSpacing: '.1em', textTransform: 'uppercase' }}>Preview social card</div>
            <div style={{ background: CARD, borderRadius: 10, overflow: 'hidden', border: `1px solid ${LINE}` }}>
              <div style={{ height: 80, background: `${C}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 9, color: FGMUTE, fontFamily: "'JetBrains Mono',monospace" }}>imagem (1200×630)</span>
              </div>
              <div style={{ padding: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: FG, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>
                <div style={{ fontSize: 10, color: FGMUTE, lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{description}</div>
                <div style={{ fontSize: 9, color: MUTE, marginTop: 6, fontFamily: "'JetBrains Mono',monospace" }}>{url}</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, fontSize: 10, color: FGMUTE }}>
            <span style={{ color: titleOk ? GRN : RED }}>■ title: {titleOk ? 'ok' : `${titleLen < 30 ? 'curto' : 'longo'}`}</span>
            <span style={{ color: descOk ? GRN : RED }}>■ description: {descOk ? 'ok' : `${descLen < 120 ? 'curta' : 'longa'}`}</span>
          </div>
        </div>

        {/* Código gerado */}
        <div>
          <div style={{ fontSize: 10, color: FGMUTE, fontFamily: "'JetBrains Mono',monospace", marginBottom: 8, letterSpacing: '.1em', textTransform: 'uppercase' }}>Código gerado</div>
          <pre style={{
            background: BG, border: `1px solid ${LINE}`, borderRadius: 8,
            padding: 14, fontSize: 10, lineHeight: 1.7, color: SKY,
            fontFamily: "'JetBrains Mono',monospace", overflowX: 'auto',
            whiteSpace: 'pre', margin: 0, height: '100%', minHeight: 300,
          }}>
            {generated}
          </pre>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — Formulários Live Preview
// ═══════════════════════════════════════════════════════════════════════════════

const INPUT_TYPES = [
  { type: 'text', label: 'text', color: C, desc: 'Texto livre', attrs: 'minlength="3" maxlength="50"', note: 'Base — sempre use placeholder descriptivo' },
  { type: 'email', label: 'email', color: SKY, desc: 'Valida formato de e-mail', attrs: 'required', note: 'Validação nativa — "x@y" não passa' },
  { type: 'password', label: 'password', color: PRP, desc: 'Obscurece o texto', attrs: 'minlength="8"', note: 'Sempre use autocomplete="new-password" em cadastro' },
  { type: 'number', label: 'number', color: GRN, desc: 'Teclado numérico + setas', attrs: 'min="0" max="100" step="5"', note: 'Use inputmode="numeric" para formato livre' },
  { type: 'date', label: 'date', color: AMB, desc: 'Picker nativo de data', attrs: 'min="2020-01-01"', note: 'Formato ISO — behavior varia entre browsers' },
  { type: 'range', label: 'range', color: RED, desc: 'Slider', attrs: 'min="0" max="10" step="1"', note: 'Combine com output para mostrar valor atual' },
  { type: 'checkbox', label: 'checkbox', color: AMB, desc: 'Boolean — múltipla escolha', attrs: '', note: 'Use fieldset+legend para grupos de checkboxes' },
  { type: 'radio', label: 'radio', color: GRN, desc: 'Escolha única do grupo', attrs: 'name="opcao"', note: 'Mesmo name = mesmo grupo. Use fieldset+legend.' },
  { type: 'file', label: 'file', color: SKY, desc: 'Upload de arquivo', attrs: 'accept=".pdf,.jpg"', note: 'accept filtra o seletor mas não impede upload de outros' },
  { type: 'color', label: 'color', color: PRP, desc: 'Color picker nativo', attrs: '', note: 'Combina com datalist para paleta de sugestões' },
  { type: 'search', label: 'search', color: C, desc: 'Campo de busca', attrs: '', note: 'Adiciona botão X para limpar em alguns browsers' },
  { type: 'tel', label: 'tel', color: RED, desc: 'Teclado telefônico mobile', attrs: 'pattern="[0-9]{10,11}"', note: 'Não valida formato — use pattern' },
]

function FormInputsGallery() {
  const [selected, setSelected] = useState(0)
  const item = INPUT_TYPES[selected]

  return (
    <div style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10, color: C, fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono',monospace", marginBottom: 6 }}>VISUAL 5 — FORMULÁRIOS</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: FG, marginBottom: 4 }}>Galeria de Input Types</div>
        <div style={{ fontSize: 12, color: FGMUTE }}>Selecione um tipo para ver detalhes e preview ao vivo.</div>
      </div>

      {/* Grid de tipos */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
        {INPUT_TYPES.map((t, i) => (
          <button key={t.type} onClick={() => setSelected(i)} style={{
            padding: '5px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
            background: selected === i ? `${t.color}25` : BG,
            borderWidth: 1, borderStyle: 'solid',
            borderColor: selected === i ? `${t.color}80` : LINE,
            color: selected === i ? t.color : FGMUTE,
            fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700,
          }}>
            {t.type}
          </button>
        ))}
      </div>

      {/* Detalhe do selecionado */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ background: BG, border: `2px solid ${item.color}50`, borderRadius: 10, padding: 20 }}>
          <div style={{ fontSize: 12, color: item.color, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", marginBottom: 12 }}>type="{item.type}"</div>
          <div style={{ fontSize: 13, color: FG, marginBottom: 8 }}>{item.desc}</div>
          <div style={{ background: CARD, borderRadius: 6, padding: 10, marginBottom: 12 }}>
            <pre style={{ fontSize: 10, color: SKY, fontFamily: "'JetBrains Mono',monospace", margin: 0, whiteSpace: 'pre-wrap' }}>
              {`<input\n  type="${item.type}"\n  ${item.attrs ? item.attrs + '\n  ' : ''}name="${item.type}"\n/>`}
            </pre>
          </div>
          <div style={{ background: `${AMB}15`, border: `1px solid ${AMB}50`, borderRadius: 6, padding: 10 }}>
            <div style={{ fontSize: 9, color: AMB, fontWeight: 700, marginBottom: 4, fontFamily: "'JetBrains Mono',monospace" }}>NOTA</div>
            <div style={{ fontSize: 11, color: FGMUTE }}>{item.note}</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 10, color: FGMUTE, fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.1em', textTransform: 'uppercase' }}>Preview ao vivo</div>
          <div style={{
            background: BG, border: `1px solid ${LINE}`, borderRadius: 10, padding: 20,
            flex: 1, display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            <label style={{ fontSize: 11, color: FGMUTE, fontFamily: "'JetBrains Mono',monospace" }}>
              Campo {item.type}
            </label>
            <input
              type={item.type as React.HTMLInputTypeAttribute}
              name={item.type}
              placeholder={`type="${item.type}"`}
              style={{
                padding: '10px 14px', borderRadius: 6,
                background: CARD, border: `1px solid ${item.color}60`,
                color: FG, fontSize: 13, fontFamily: 'inherit',
                outline: 'none', width: '100%', boxSizing: 'border-box' as const,
                accentColor: item.color,
              }}
            />
            <div style={{ fontSize: 10, color: FGMUTE }}>Tente interagir com o campo acima — ele é funcional.</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — Anti-patterns HTML (AntiPatternsGallery)
// ═══════════════════════════════════════════════════════════════════════════════

const HTML_ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'Div soup — divs para tudo',
    wrong: [
      [{ text: '<div class="header">' }],
      [{ text: '  <div class="nav">' }],
      [{ text: '    <div class="link">Home</div>' }],
      [{ text: '  </div>' }],
      [{ text: '</div>' }],
      [{ text: '<div class="content">' }],
      [{ text: '  <div class="article">...</div>' }],
      [{ text: '</div>' }],
    ],
    right: [
      [{ text: '<header>' }],
      [{ text: '  <nav>' }],
      [{ text: '    <a href="/">Home</a>' }],
      [{ text: '  </nav>' }],
      [{ text: '</header>' }],
      [{ text: '<main>' }],
      [{ text: '  <article>...</article>' }],
      [{ text: '</main>' }],
    ],
    why: 'Divs sem semântica não criam landmarks de acessibilidade. Screen readers e mecanismos de busca dependem de header, nav, main, article para navegar e entender o conteúdo.',
  },
  {
    title: 'Imagem sem alt',
    wrong: [
      [{ text: '<img src="produto.jpg">' }],
      [{ text: '' }],
      [{ text: '<!-- ou pior: -->' }],
      [{ text: '<img src="foto.jpg" alt="imagem">' }],
    ],
    right: [
      [{ text: '<!-- Informativa: alt descritivo -->' }],
      [{ text: '<img src="produto.jpg"' }],
      [{ text: '     alt="Tênis Nike Air Max azul">' }],
      [{ text: '' }],
      [{ text: '<!-- Decorativa: alt vazio -->' }],
      [{ text: '<img src="linha-divisoria.svg" alt="">' }],
    ],
    why: 'Sem alt, leitores de tela leem o nome do arquivo ("foto.jpg"). alt="imagem" é inútil. Use alt descritivo para imagens informativas e alt="" para decorativas.',
  },
  {
    title: 'label desconectado do input',
    wrong: [
      [{ text: '<label>Nome</label>' }],
      [{ text: '<input type="text" name="nome">' }],
      [{ text: '' }],
      [{ text: '<!-- clicar no label não foca o input -->' }],
    ],
    right: [
      [{ text: '<!-- Opção 1: for + id -->' }],
      [{ text: '<label for="nome">Nome</label>' }],
      [{ text: '<input id="nome" type="text" name="nome">' }],
      [{ text: '' }],
      [{ text: '<!-- Opção 2: label como wrapper -->' }],
      [{ text: '<label>' }],
      [{ text: '  Nome <input type="text" name="nome">' }],
      [{ text: '</label>' }],
    ],
    why: 'label sem for/id não ativa o input ao ser clicado. Leitores de tela não associam o rótulo ao campo. A WCAG 1.3.1 exige que todo input tenha um nome acessível.',
  },
  {
    title: 'Headings fora de ordem',
    wrong: [
      [{ text: '<h1>Título Principal</h1>' }],
      [{ text: '<h3>Seção A</h3>' }, { text: '<!-- pulou h2! -->', color: RED }],
      [{ text: '<h5>Subseção</h5>' }, { text: '<!-- pulou h4! -->', color: RED }],
      [{ text: '<h2>Seção B</h2>' }, { text: '<!-- voltou? -->', color: RED }],
    ],
    right: [
      [{ text: '<h1>Título Principal</h1>' }],
      [{ text: '<h2>Seção A</h2>' }],
      [{ text: '<h3>Subseção</h3>' }],
      [{ text: '<h2>Seção B</h2>' }, { text: '  <!-- correto -->', color: GRN }],
      [{ text: '<h3>Outra Subseção</h3>' }],
    ],
    why: 'Headings criam o outline do documento. Pular níveis quebra a navegação por screen readers (usuários navegam por headings). Google usa a hierarquia para entender a estrutura do conteúdo.',
  },
  {
    title: 'tabindex positivo',
    wrong: [
      [{ text: '<button tabindex="3">Salvar</button>' }],
      [{ text: '<input tabindex="1" name="nome">' }],
      [{ text: '<a tabindex="2" href="/ajuda">Ajuda</a>' }],
      [{ text: '' }],
      [{ text: '<!-- ordem Tab: input → a → button -->', color: RED }],
    ],
    right: [
      [{ text: '<!-- Use a ordem natural do DOM -->' }],
      [{ text: '<input name="nome">' }],
      [{ text: '<a href="/ajuda">Ajuda</a>' }],
      [{ text: '<button>Salvar</button>' }],
      [{ text: '' }],
      [{ text: '<!-- Ou tabindex="0" para incluir não-interativos -->', color: GRN }],
    ],
    why: 'tabindex positivo cria uma ordem de foco paralela ao DOM que confunde usuários de teclado. WCAG 2.4.3: a ordem de foco deve ser lógica e previsível. Use sempre tabindex="0" ou reorganize o DOM.',
  },
  {
    title: 'viewport com user-scalable=no',
    wrong: [
      [{ text: '<meta name="viewport"' }],
      [{ text: '  content="width=device-width,' }],
      [{ text: '           initial-scale=1,' }],
      [{ text: '           maximum-scale=1,' }, { text: '  <!-- PROIBIDO -->', color: RED }],
      [{ text: '           user-scalable=no">' }, { text: ' <!-- PROIBIDO -->', color: RED }],
    ],
    right: [
      [{ text: '<meta name="viewport"' }],
      [{ text: '  content="width=device-width,' }],
      [{ text: '           initial-scale=1">' }],
      [{ text: '' }],
      [{ text: '<!-- Sem maximum-scale ou user-scalable -->', color: GRN }],
    ],
    why: 'WCAG 1.4.4 (Resize text): usuários com baixa visão PRECISAM fazer zoom. Bloquear o zoom é uma violação de acessibilidade que exclui usuários com deficiência visual.',
  },
  {
    title: 'Script síncrono no <head>',
    wrong: [
      [{ text: '<head>' }],
      [{ text: '  <title>Minha Página</title>' }],
      [{ text: '  <script src="app.js"></script>' }, { text: ' <!-- bloqueia! -->', color: RED }],
      [{ text: '  <link rel="stylesheet" href="style.css">' }],
      [{ text: '</head>' }],
    ],
    right: [
      [{ text: '<head>' }],
      [{ text: '  <title>Minha Página</title>' }],
      [{ text: '  <link rel="stylesheet" href="style.css">' }],
      [{ text: '  <script src="app.js" defer></script>' }, { text: ' <!-- ok -->', color: GRN }],
      [{ text: '</head>' }],
    ],
    why: 'Script síncrono no head bloqueia o parser — o browser para de construir o DOM até o script baixar e executar. defer é o padrão seguro para a maioria dos scripts.',
  },
  {
    title: 'loading="lazy" na imagem LCP',
    wrong: [
      [{ text: '<!-- Imagem hero, acima da dobra -->' }],
      [{ text: '<img' }],
      [{ text: '  src="hero.jpg"' }],
      [{ text: '  alt="Banner principal"' }],
      [{ text: '  loading="lazy"' }, { text: '  <!-- ERRO! -->', color: RED }],
      [{ text: '/>' }],
    ],
    right: [
      [{ text: '<!-- Imagem hero: sem lazy, com fetchpriority -->' }],
      [{ text: '<img' }],
      [{ text: '  src="hero.jpg"' }],
      [{ text: '  alt="Banner principal"' }],
      [{ text: '  fetchpriority="high"' }, { text: '  <!-- correto -->', color: GRN }],
      [{ text: '/>' }],
      [{ text: '' }],
      [{ text: '<!-- lazy apenas para imagens below-the-fold -->', color: GRN }],
    ],
    why: 'loading="lazy" na imagem LCP atrasa exatamente o recurso mais crítico para a pontuação de LCP. O browser carrega a imagem apenas quando ela se aproxima da viewport — mas ela JÁ está na viewport desde o início.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 7 — HTML5 APIs (CardCarousel adaptado)
// ═══════════════════════════════════════════════════════════════════════════════

const HTML5_API_CARDS: CarouselCard[] = [
  {
    name: 'Canvas API',
    signature: 'const ctx = canvas.getContext("2d")',
    emoji: '🎨',
    color: C,
    use: [
      'Jogos 2D e simulações de física',
      'Edição de imagens no browser (filtros, crop)',
      'Visualizações com 10k+ elementos dinâmicos',
      'Processamento de vídeo frame a frame',
    ],
    dontUse: 'Para gráficos de dados estáticos (use SVG — acessível) ou UI interativa (sem DOM interno, sem eventos nativos).',
    difficulty: 3,
  },
  {
    name: 'Web Storage',
    signature: 'localStorage.setItem(key, value)',
    emoji: '💾',
    color: SKY,
    use: [
      'localStorage: persistência entre sessões (preferências, carrinho)',
      'sessionStorage: dados da sessão atual (wizard de formulário)',
      'Ambos: apenas strings — JSON.stringify/parse para objetos',
    ],
    dontUse: 'Para dados sensíveis (tokens, senhas) — não é seguro. Para grandes volumes (limite ~5MB). Sempre sincronos — bloqueiam o main thread.',
    difficulty: 1,
  },
  {
    name: 'Geolocation API',
    signature: 'navigator.geolocation.getCurrentPosition(cb)',
    emoji: '📍',
    color: GRN,
    use: [
      'Apps de entrega e logística',
      'Busca de locais próximos',
      'Check-in e experiências baseadas em localização',
    ],
    dontUse: 'Sem tratamento de erro (permissão negada é frequente). Sem HTTPS (obrigatório em produção). Sem indicador de loading (GPS pode demorar).',
    difficulty: 2,
  },
  {
    name: 'Drag & Drop API',
    signature: 'el.addEventListener("dragstart", handler)',
    emoji: '🎯',
    color: PRP,
    use: [
      'Upload por drag de arquivo na área designada',
      'Reordenação de listas e kanban boards',
      'Construtores de UI drag-and-drop (low-code tools)',
    ],
    dontUse: 'Sem fallback para touch — a API nativa não funciona em mobile. Para UX crítica, use bibliotecas como dnd-kit que abstraem touch e mouse.',
    difficulty: 3,
  },
  {
    name: 'Web Workers',
    signature: 'const worker = new Worker("worker.js")',
    emoji: '⚙',
    color: AMB,
    use: [
      'Processamento pesado sem travar a UI (parsing de CSV, crypto)',
      'Cálculos científicos e de machine learning no browser',
      'Background sync e service worker patterns',
    ],
    dontUse: 'Para tarefas rápidas — overhead de criação do worker não compensa. Não têm acesso ao DOM — comunicação é via postMessage.',
    difficulty: 3,
  },
  {
    name: 'Intersection Observer',
    signature: 'new IntersectionObserver(callback, options)',
    emoji: '👁',
    color: GRN,
    use: [
      'Lazy loading de imagens (base do loading="lazy" nativo)',
      'Infinite scroll sem polling de scroll event',
      'Animações on-enter (revelar elementos ao rolar)',
      'Tracking de viewability de ads',
    ],
    dontUse: 'Quando você precisa de posição exata — retorna apenas se o elemento está ou não na viewport, não coordenadas.',
    difficulty: 2,
  },
  {
    name: 'Custom Elements (Web Components)',
    signature: 'customElements.define("my-el", MyClass)',
    emoji: '🧩',
    color: C,
    use: [
      'Criar elementos HTML reutilizáveis sem framework',
      'Design systems que funcionam em qualquer stack',
      'Widgets encapsulados com Shadow DOM',
    ],
    dontUse: 'Para SPAs onde um framework já gerencia o componente tree. Web Components brilham em design systems cross-framework, não em apps React/Vue.',
    difficulty: 3,
  },
  {
    name: 'Dialog nativo',
    signature: 'dialog.showModal() / dialog.close()',
    emoji: '💬',
    color: SKY,
    use: [
      'Modais e alertas — sem library, focus trap grátis',
      'showModal() bloqueia interação com fundo (inert)',
      'Acessível nativamente — role="dialog" implícito',
    ],
    dontUse: 'Para toasts ou notificações — dialog bloqueia o fundo. Para browser antigos sem polyfill (IE não suporta). Styling é limitado no Firefox.',
    difficulty: 1,
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 8 — Do Zero ao Sênior (ProgressionMap)
// ═══════════════════════════════════════════════════════════════════════════════

const HTML_PROGRESSION: ProgressionLevel[] = [
  {
    id: 'fundamentos',
    name: 'Fundamentos',
    label: 'Nível 1',
    emoji: '🌱',
    concepts: [
      { name: 'DOCTYPE e modos de renderização', tip: 'DOCTYPE html = modo padrão. Sem DOCTYPE = quirks mode com CSS box model do IE5.' },
      { name: 'Elementos block vs inline vs inline-block', tip: 'Block ocupa linha inteira. Inline flui no texto. Inline-block mistura os dois.' },
      { name: 'Hierarquia de headings h1-h6', tip: 'São estrutura de documento, não estilo. Nunca pule de h1 para h3.' },
      { name: 'Links e âncoras (href, target, rel)', tip: 'target="_blank" sem rel="noopener noreferrer" é vulnerabilidade de segurança.' },
      { name: 'Tabelas (thead, tbody, th scope)', tip: 'th com scope="col"/"row" conecta cabeçalho às células — essencial para leitores de tela.' },
      { name: 'Imagens (src, alt, width, height)', tip: 'width/height previne layout shift (CLS). alt="" para decorativas, descritivo para informativas.' },
    ],
  },
  {
    id: 'semantica',
    name: 'HTML Semântico',
    label: 'Nível 2',
    emoji: '🏗',
    concepts: [
      { name: 'main, article, section, aside, nav', tip: 'Landmarks que leitores de tela e crawlers usam para navegar a página.' },
      { name: 'header e footer (múltiplos por página)', tip: 'Não são únicos — podem aparecer em article, section, etc.' },
      { name: 'figure e figcaption', tip: 'Para qualquer mídia com legenda: imagem, código, gráfico SVG, tabela.' },
      { name: 'time com datetime ISO 8601', tip: 'Machine-readable. "há 3 dias" + datetime="2024-06-12" é a combinação certa.' },
      { name: 'details e summary (accordion nativo)', tip: 'Accordion sem JS. Acessível por padrão. Animate com CSS max-height.' },
      { name: 'address, mark, abbr, cite', tip: 'Elementos de texto semântico raramente usados mas que importam em contexto correto.' },
    ],
  },
  {
    id: 'formularios',
    name: 'Formulários',
    label: 'Nível 3',
    emoji: '📝',
    concepts: [
      { name: 'label for/id ou label wrapper', tip: 'Dois métodos de associar label ao input. Ambos criam clique no label = foco no input.' },
      { name: 'fieldset e legend para grupos', tip: 'Agrupa campos relacionados. Legend é o nome do grupo — lido por screen readers.' },
      { name: 'Validação nativa (required, pattern, min/max)', tip: 'Zero JS. Funciona com leitores de tela. Use novalidate só quando você mesmo gerencia erros.' },
      { name: 'Constraint Validation API', tip: 'input.validity, input.setCustomValidity(), form.reportValidity() — poder de JS com semântica nativa.' },
      { name: 'autocomplete e inputmode', tip: 'autocomplete melhora UX e é exigido pela WCAG. inputmode controla teclado mobile sem mudar tipo.' },
      { name: 'datalist para autocomplete livre', tip: 'Diferente de select: o usuário pode digitar qualquer valor, as opções são sugestões.' },
    ],
  },
  {
    id: 'a11y',
    name: 'Acessibilidade',
    label: 'Nível 4',
    emoji: '♿',
    concepts: [
      { name: 'Accessibility Tree vs DOM', tip: 'O AT é o que leitores de tela usam. ARIA modifica o AT sem mudar o DOM visual.' },
      { name: 'ARIA: roles, properties, states', tip: 'Role = o que é. Property = info estática. State = condição dinâmica (aria-expanded).' },
      { name: 'tabindex 0 e -1', tip: '0 = entra no Tab. -1 = focável via JS mas não via Tab. Nunca use valores positivos.' },
      { name: 'Focus management em SPAs', tip: 'Após navegação: mover foco ao h1 ou main. Ao abrir modal: mover para primeiro focável.' },
      { name: 'Focus trap em modais', tip: 'Tab e Shift+Tab devem ciclar dentro do modal. Escape fecha. devolver foco ao trigger.' },
      { name: 'aria-live para regiões dinâmicas', tip: 'assertive = interrompe. polite = anuncia na próxima pausa. Notificações de status.' },
    ],
  },
  {
    id: 'performance',
    name: 'Performance & APIs Avançadas',
    label: 'Nível 5',
    emoji: '🚀',
    concepts: [
      { name: 'Critical Rendering Path completo', tip: 'HTML → DOM → CSSOM → Render Tree → Layout → Paint → Composite.' },
      { name: 'defer vs async vs type="module"', tip: 'defer: após parse. async: assim que baixar. module: defer por padrão + strict mode.' },
      { name: 'preload, prefetch, preconnect', tip: 'preload = agora. prefetch = próxima rota. preconnect = TCP+TLS antecipado.' },
      { name: 'fetchpriority e loading="lazy"', tip: 'fetchpriority="high" na img LCP. loading="lazy" em tudo EXCETO above-the-fold.' },
      { name: 'Web Components (Custom Elements + Shadow DOM)', tip: 'customElements.define. shadowRoot.attachShadow. Slots para composição.' },
      { name: 'Structured data JSON-LD', tip: 'script type="application/ld+json". Schema.org. Rich results no Google.' },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// SHELL
// ═══════════════════════════════════════════════════════════════════════════════

export default function HtmlVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'crp',
      title: 'Critical Rendering Path',
      subtitle: 'Performance',
      accent: C,
      component: (
        <ConceptCarousel
          slides={CONCEPT_SLIDES}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          label="VISUAL 1 — CRITICAL RENDERING PATH"
          heading="Como o Browser Renderiza"
          description="Quatro slides sobre o caminho do HTML bruto até os pixels na tela."
        />
      ),
    },
    {
      id: 'semantica',
      title: 'Semântica HTML',
      subtitle: 'Elementos',
      accent: AMB,
      component: (
        <CardCarousel
          cards={SEMANTIC_CARDS}
          bgColor={BG}
          accentColor={AMB}
          label="VISUAL 2 — SEMÂNTICA HTML"
          heading="Elementos Semânticos em Detalhe"
          description="Selecione um elemento para ver quando usar, quando não usar e exemplos."
          useLabel="Quando usar"
          dontUseLabel="Não usar quando"
        />
      ),
    },
    {
      id: 'a11y',
      title: 'Acessibilidade',
      subtitle: 'Checklist',
      accent: GRN,
      component: <A11YChecklist />,
    },
    {
      id: 'meta',
      title: 'Meta Tags',
      subtitle: 'SEO Builder',
      accent: SKY,
      component: <MetaTagsBuilder />,
    },
    {
      id: 'forms',
      title: 'Formulários',
      subtitle: 'Input Types',
      accent: PRP,
      component: <FormInputsGallery />,
    },
    {
      id: 'antipat',
      title: 'Anti-patterns',
      subtitle: 'Errado vs certo',
      accent: RED,
      component: (
        <AntiPatternsGallery
          patterns={HTML_ANTIPATTERNS}
          accentColor={C}
          bgColor={BG}
          errorColor={RED}
          successColor={GRN}
          warningColor={AMB}
          label="VISUAL 6 — ANTI-PATTERNS HTML"
          heading="Os 8 Erros Mais Comuns de HTML"
          description="Div soup, imagens sem alt, labels desconectados, headings fora de ordem e mais."
          wrongLabel="Errado"
          rightLabel="Correto"
          whyLabel="Por que importa"
        />
      ),
    },
    {
      id: 'apis',
      title: 'HTML5 APIs',
      subtitle: 'APIs Modernas',
      accent: AMB,
      component: (
        <CardCarousel
          cards={HTML5_API_CARDS}
          bgColor={BG}
          accentColor={C}
          label="VISUAL 7 — HTML5 APIS"
          heading="APIs Nativas do Browser"
          description="Canvas, Web Storage, Geolocation, Web Workers, Intersection Observer e mais."
          useLabel="Quando usar"
          dontUseLabel="Cuidado"
        />
      ),
    },
    {
      id: 'roadmap',
      title: 'Do Zero ao Sênior',
      subtitle: 'Progressão',
      accent: AMB,
      component: (
        <ProgressionMap
          levels={HTML_PROGRESSION}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          label="VISUAL 8 — ROADMAP HTML"
          heading="Do Zero ao Sênior em HTML"
          description={`Cinco níveis de progressão. Marque o que você já domina. ${HTML_PROGRESSION.reduce((a, l) => a + l.concepts.length, 0)} conceitos no total.`}
          hintText="Marque conforme estuda. Não é uma checklist exaustiva — é um mapa para identificar sua próxima fronteira de aprendizado."
        />
      ),
    },
  ]

  return <VisuaisShell visuals={visuals} active={active} onChange={setActive} />
}
