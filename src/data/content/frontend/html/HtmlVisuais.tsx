'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { ConceptCarousel } from '@/components/visuals/ConceptCarousel'
import type { Slide } from '@/components/visuals/ConceptCarousel'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'
import { CardCarousel } from '@/components/visuals/CardCarousel'
import type { CarouselCard } from '@/components/visuals/CardCarousel'
import { DecisionTree } from '@/components/visuals/DecisionTree'
import type { DTNode } from '@/components/visuals/DecisionTree'

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
// VISUAL 3 — DOM vs Accessibility Tree (componente customizado)
// ═══════════════════════════════════════════════════════════════════════════════

type ATNode = {
  tag: string
  text?: string
  attrs?: string
  // Como aparece no Accessibility Tree
  role?: string
  name?: string
  // Se está exposto no AT
  inAT: boolean
  // Por que não está exposto (se inAT=false)
  hiddenReason?: string
  children?: ATNode[]
}

const SEMANTIC_TREE: ATNode = {
  tag: 'html',
  inAT: true,
  role: 'document',
  attrs: 'lang="pt-BR"',
  children: [
    {
      tag: 'header',
      inAT: true,
      role: 'banner',
      name: 'cabeçalho do site',
      children: [
        { tag: 'h1', text: 'Meu Blog', inAT: true, role: 'heading level=1', name: 'Meu Blog' },
      ],
    },
    {
      tag: 'nav',
      inAT: true,
      role: 'navigation',
      name: 'principal',
      attrs: 'aria-label="principal"',
      children: [
        { tag: 'a', text: 'Home', inAT: true, role: 'link', name: 'Home', attrs: 'href="/"' },
        { tag: 'a', text: 'Sobre', inAT: true, role: 'link', name: 'Sobre', attrs: 'href="/sobre"' },
      ],
    },
    {
      tag: 'main',
      inAT: true,
      role: 'main',
      children: [
        { tag: 'h2', text: 'Posts recentes', inAT: true, role: 'heading level=2', name: 'Posts recentes' },
        {
          tag: 'article',
          inAT: true,
          role: 'article',
          children: [
            { tag: 'button', text: 'Curtir', inAT: true, role: 'button', name: 'Curtir' },
            { tag: 'span', text: '(decoração)', inAT: false, hiddenReason: 'span sem semântica + sem texto significativo' },
          ],
        },
      ],
    },
    {
      tag: 'div',
      attrs: 'aria-hidden="true"',
      inAT: false,
      hiddenReason: 'aria-hidden="true" — esconde do AT',
      children: [
        { tag: 'svg', text: '★', inAT: false, hiddenReason: 'pai com aria-hidden' },
      ],
    },
  ],
}

const SOUP_TREE: ATNode = {
  tag: 'html',
  inAT: true,
  role: 'document',
  children: [
    {
      tag: 'div',
      attrs: 'class="header"',
      inAT: false,
      hiddenReason: 'div sem role — não é landmark',
      children: [
        { tag: 'div', text: 'Meu Blog', inAT: false, hiddenReason: 'div sem heading — sem outline' },
      ],
    },
    {
      tag: 'div',
      attrs: 'class="nav"',
      inAT: false,
      hiddenReason: 'div sem role — não é landmark',
      children: [
        { tag: 'span', text: 'Home', attrs: 'onclick=...', inAT: false, hiddenReason: 'span sem role — não focável' },
        { tag: 'span', text: 'Sobre', attrs: 'onclick=...', inAT: false, hiddenReason: 'span sem role — não focável' },
      ],
    },
    {
      tag: 'div',
      attrs: 'class="content"',
      inAT: false,
      hiddenReason: 'div sem role — não é landmark',
      children: [
        { tag: 'div', text: 'Posts recentes', inAT: false, hiddenReason: 'sem heading semântico' },
        {
          tag: 'div',
          attrs: 'class="post"',
          inAT: false,
          hiddenReason: 'div sem role — não é article',
          children: [
            { tag: 'div', text: 'Curtir', attrs: 'onclick=...', inAT: false, hiddenReason: 'div com onclick não é botão' },
          ],
        },
      ],
    },
  ],
}

function ATNodeRow({ node, depth, side }: { node: ATNode; depth: number; side: 'dom' | 'at' }) {
  const indent = depth * 18
  const isHidden = side === 'at' && !node.inAT

  if (side === 'at' && !node.inAT) {
    // No AT, nodes não expostos colapsam para um marcador visual
    return null
  }

  const tagColor = node.inAT ? (side === 'at' ? GRN : C) : MUTE
  const textColor = isHidden ? MUTE : FG

  return (
    <div>
      <div style={{
        paddingLeft: indent + 8,
        paddingRight: 8,
        paddingTop: 3,
        paddingBottom: 3,
        fontSize: 11,
        fontFamily: "'JetBrains Mono',monospace",
        color: textColor,
        background: side === 'at' && node.role ? `${GRN}08` : 'transparent',
        borderLeft: side === 'at' && node.role ? `2px solid ${GRN}40` : '2px solid transparent',
        opacity: isHidden ? 0.5 : 1,
      }}>
        <span style={{ color: tagColor, fontWeight: 700 }}>&lt;{node.tag}</span>
        {node.attrs && (
          <span style={{ color: SKY, marginLeft: 4, fontSize: 10 }}>{' '}{node.attrs}</span>
        )}
        <span style={{ color: tagColor, fontWeight: 700 }}>&gt;</span>
        {node.text && (
          <span style={{ marginLeft: 6, color: FGMUTE }}>{node.text}</span>
        )}
        {side === 'at' && node.role && (
          <span style={{ marginLeft: 8, fontSize: 10, color: GRN, fontWeight: 700 }}>
            {'→ '}role=&quot;{node.role}&quot;{node.name && ` · name="${node.name}"`}
          </span>
        )}
      </div>
      {node.children?.map((child, i) => (
        <ATNodeRow key={i} node={child} depth={depth + 1} side={side} />
      ))}
    </div>
  )
}

function DOMHiddenSummary({ tree }: { tree: ATNode }) {
  // Coletar todos os nodes ocultos para listá-los como motivo
  const hidden: { tag: string; reason: string }[] = []
  function walk(n: ATNode) {
    if (!n.inAT && n.hiddenReason) {
      hidden.push({ tag: n.tag, reason: n.hiddenReason })
    }
    n.children?.forEach(walk)
  }
  walk(tree)

  if (hidden.length === 0) return null

  return (
    <div style={{ marginTop: 12, padding: 10, background: `${RED}10`, border: `1px solid ${RED}40`, borderRadius: 6 }}>
      <div style={{ fontSize: 9, color: RED, fontWeight: 700, marginBottom: 6, fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.1em', textTransform: 'uppercase' }}>
        {hidden.length} {hidden.length === 1 ? 'nó oculto' : 'nós ocultos'} do AT
      </div>
      {hidden.slice(0, 5).map((h, i) => (
        <div key={i} style={{ fontSize: 9, color: FGMUTE, fontFamily: "'JetBrains Mono',monospace", marginBottom: 2 }}>
          <span style={{ color: RED }}>&lt;{h.tag}&gt;</span>
          <span style={{ color: MUTE }}> — {h.reason}</span>
        </div>
      ))}
    </div>
  )
}

function AccessibilityTreeVisual() {
  const [mode, setMode] = useState<'semantic' | 'soup'>('semantic')
  const tree = mode === 'semantic' ? SEMANTIC_TREE : SOUP_TREE

  return (
    <div style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10, color: C, fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono',monospace", marginBottom: 6 }}>
          VISUAL 3 — DOM vs ACCESSIBILITY TREE
        </div>
        <div style={{ fontSize: 18, fontWeight: 800, color: FG, marginBottom: 4 }}>O que o leitor de tela realmente vê</div>
        <div style={{ fontSize: 12, color: FGMUTE, lineHeight: 1.5 }}>
          O Accessibility Tree é uma estrutura paralela ao DOM, derivada da semântica. Screen readers, Googlebot e tab navigation usam o AT — não o DOM. Compare HTML semântico vs div soup lado a lado.
        </div>
      </div>

      {/* Toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button onClick={() => setMode('semantic')} style={{
          padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
          fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700,
          background: mode === 'semantic' ? `${GRN}25` : BG,
          color: mode === 'semantic' ? GRN : FGMUTE,
          borderWidth: 1, borderStyle: 'solid',
          borderColor: mode === 'semantic' ? `${GRN}80` : LINE,
        }}>
          ✓ HTML Semântico
        </button>
        <button onClick={() => setMode('soup')} style={{
          padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
          fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700,
          background: mode === 'soup' ? `${RED}25` : BG,
          color: mode === 'soup' ? RED : FGMUTE,
          borderWidth: 1, borderStyle: 'solid',
          borderColor: mode === 'soup' ? `${RED}80` : LINE,
        }}>
          ✗ Div Soup
        </button>
      </div>

      {/* Lado a lado */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* DOM */}
        <div style={{ background: BG, border: `1px solid ${LINE}`, borderRadius: 10, padding: 16, minHeight: 320 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
            <span style={{ fontSize: 10, color: SKY, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.1em' }}>DOM TREE</span>
            <span style={{ fontSize: 9, color: FGMUTE, fontFamily: "'JetBrains Mono',monospace" }}>document.querySelector(...)</span>
          </div>
          <div style={{ overflowY: 'auto', maxHeight: 380 }}>
            <ATNodeRow node={tree} depth={0} side="dom" />
          </div>
        </div>

        {/* Accessibility Tree */}
        <div style={{ background: BG, border: `1px solid ${mode === 'semantic' ? GRN : RED}40`, borderRadius: 10, padding: 16, minHeight: 320 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
            <span style={{ fontSize: 10, color: GRN, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.1em' }}>ACCESSIBILITY TREE</span>
            <span style={{ fontSize: 9, color: FGMUTE, fontFamily: "'JetBrains Mono',monospace" }}>VoiceOver / NVDA / JAWS / Googlebot</span>
          </div>
          <div style={{ overflowY: 'auto', maxHeight: 380 }}>
            <ATNodeRow node={tree} depth={0} side="at" />
          </div>
          <DOMHiddenSummary tree={tree} />
        </div>
      </div>

      {/* Conclusão dinâmica */}
      <div style={{
        marginTop: 16, padding: 14, borderRadius: 8,
        background: mode === 'semantic' ? `${GRN}10` : `${RED}10`,
        border: `1px solid ${mode === 'semantic' ? GRN : RED}40`,
      }}>
        <div style={{ fontSize: 10, color: mode === 'semantic' ? GRN : RED, fontWeight: 700, marginBottom: 4, fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.1em', textTransform: 'uppercase' }}>
          {mode === 'semantic' ? 'Leitor de tela narra' : 'Leitor de tela diz'}
        </div>
        <div style={{ fontSize: 12, color: FG, lineHeight: 1.6 }}>
          {mode === 'semantic'
            ? '"banner — Meu Blog, heading nível 1. navegação principal, link Home, link Sobre. main, heading nível 2 Posts recentes. article, botão Curtir."'
            : '"clickable, Meu Blog. clickable, Home. clickable, Sobre. clickable, Posts recentes. clickable, Curtir." Sem landmarks, sem headings, sem botões — todos viram texto genérico clicável.'}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Acessibilidade Checklist (componente customizado)
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
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10, color: C, fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono',monospace", marginBottom: 6 }}>
          VISUAL 4 — ACESSIBILIDADE
        </div>
        <div style={{ fontSize: 18, fontWeight: 800, color: FG, marginBottom: 4 }}>Checklist de Acessibilidade HTML</div>
        <div style={{ fontSize: 12, color: FGMUTE }}>Marque os itens que você já implementou. {A11Y_CHECKLIST.length} verificações no total.</div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: FGMUTE, fontFamily: "'JetBrains Mono',monospace" }}>{checked.size}/{A11Y_CHECKLIST.length} completos</span>
          <span style={{ fontSize: 11, color: C, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>{pct}%</span>
        </div>
        <div style={{ background: LINE, borderRadius: 999, height: 6, overflow: 'hidden' }}>
          <div style={{ background: C, height: '100%', width: `${pct}%`, borderRadius: 999, transition: 'width .3s' }} />
        </div>
      </div>

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
// VISUAL 5 — Anatomia do <head> (componente customizado)
// Específico de HTML: a ordem CORRETA dos elementos do head e por que cada um vai onde
// ═══════════════════════════════════════════════════════════════════════════════

type HeadElement = {
  id: string
  order: number
  tag: string
  category: 'critical' | 'seo' | 'social' | 'hint' | 'asset' | 'data'
  why: string
  warning?: string
}

const HEAD_ELEMENTS: HeadElement[] = [
  {
    id: 'charset',
    order: 1,
    tag: '<meta charset="utf-8" />',
    category: 'critical',
    why: 'PRIMEIRO elemento absoluto. O browser começa a parsear o HTML antes de saber o charset — se não for definido nos primeiros 1024 bytes, ele pode escolher a codificação errada e re-parsear tudo.',
    warning: 'Se vier depois de outros elementos com texto, caracteres especiais antes dele podem ser corrompidos.',
  },
  {
    id: 'viewport',
    order: 2,
    tag: '<meta name="viewport" content="width=device-width, initial-scale=1" />',
    category: 'critical',
    why: 'Logo após o charset. Sem ele, browsers mobile usam viewport virtual de 980px e encolhem a página — quebra qualquer media query e responsive design.',
    warning: 'Nunca use maximum-scale=1 ou user-scalable=no. Viola WCAG 1.4.4 (zoom é direito do usuário).',
  },
  {
    id: 'title',
    order: 3,
    tag: '<title>Página · Site</title>',
    category: 'seo',
    why: 'Aparece na aba do browser, nos resultados de busca e nos compartilhamentos sociais (fallback). Precisa ser único por página, descritivo e ter < 60 caracteres para não ser truncado no SERP.',
  },
  {
    id: 'description',
    order: 4,
    tag: '<meta name="description" content="..." />',
    category: 'seo',
    why: 'Snippet de 150-160 caracteres que aparece no resultado de busca. Não afeta ranking diretamente mas afeta CTR. Se ausente, o Google escolhe um trecho da página.',
  },
  {
    id: 'canonical',
    order: 5,
    tag: '<link rel="canonical" href="https://..." />',
    category: 'seo',
    why: 'Indica ao Google a URL preferencial quando há duplicatas (parâmetros UTM, paginação, mobile/desktop). Sem canonical, o Google pode indexar a versão errada.',
  },
  {
    id: 'preconnect',
    order: 6,
    tag: '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />',
    category: 'hint',
    why: 'ANTES de qualquer request à origem. Estabelece TCP+TLS handshake antecipado (economiza 150-300ms). Use para Google Fonts, CDNs, APIs externas que serão acessadas depois.',
    warning: 'Para fontes cross-origin, sempre use crossorigin="anonymous" — sem isso o browser baixa a fonte duas vezes.',
  },
  {
    id: 'preload',
    order: 7,
    tag: '<link rel="preload" as="font" href="..." crossorigin />',
    category: 'hint',
    why: 'Recursos críticos para o render inicial (fonte hero, imagem LCP, CSS crítico). Browser baixa em paralelo ao parsing com alta prioridade. SEMPRE use o atributo as="..." para priorização correta.',
    warning: 'preload sem usar o recurso na mesma página gera warning no console. Use cirurgicamente.',
  },
  {
    id: 'css',
    order: 8,
    tag: '<link rel="stylesheet" href="/main.css" />',
    category: 'asset',
    why: 'CSS bloqueia o RENDER — a tela fica branca até o CSSOM estar pronto. Por isso vem após preconnect e preload (que rodam em paralelo) e antes dos scripts (que ficam com defer).',
  },
  {
    id: 'og',
    order: 9,
    tag: '<meta property="og:title|description|image|url" />',
    category: 'social',
    why: 'Open Graph controla o card de compartilhamento em redes sociais (Facebook, LinkedIn, WhatsApp, Telegram). Sem og:image, o link compartilhado fica sem preview visual — CTR cai drasticamente.',
    warning: 'og:image deve ser ≥ 1200×630px e < 1MB. Caches agressivos de redes sociais — use cache-busting na URL ao atualizar.',
  },
  {
    id: 'twitter',
    order: 10,
    tag: '<meta name="twitter:card" content="summary_large_image" />',
    category: 'social',
    why: 'Twitter tem namespace próprio mas lê og: como fallback. summary_large_image faz o card ocupar a largura total com imagem proeminente.',
  },
  {
    id: 'jsonld',
    order: 11,
    tag: '<script type="application/ld+json">{ ... }</script>',
    category: 'data',
    why: 'Structured Data em JSON-LD comunica o significado semântico ao Google. Habilita rich results no SERP (estrelas, FAQs, breadcrumbs, eventos). Schema.org define os tipos.',
  },
  {
    id: 'script',
    order: 12,
    tag: '<script src="/app.js" defer></script>',
    category: 'asset',
    why: 'POR ÚLTIMO no head, com defer. defer = baixa em paralelo, executa após o parse, ordem preservada. Sem defer/async, o parser para até o script terminar — pior cenário de performance.',
    warning: 'NUNCA coloque <script> síncrono no head. Use defer (ou async para scripts independentes como analytics).',
  },
]

const HEAD_CAT_COLOR: Record<HeadElement['category'], string> = {
  critical: RED,
  seo: AMB,
  social: SKY,
  hint: PRP,
  asset: GRN,
  data: C,
}

const HEAD_CAT_LABEL: Record<HeadElement['category'], string> = {
  critical: 'crítico',
  seo: 'SEO',
  social: 'social',
  hint: 'resource hint',
  asset: 'asset',
  data: 'structured data',
}

function HeadAnatomy() {
  const [active, setActive] = useState(0)
  const [filter, setFilter] = useState<HeadElement['category'] | 'all'>('all')

  const filtered = filter === 'all' ? HEAD_ELEMENTS : HEAD_ELEMENTS.filter(e => e.category === filter)
  const cats: Array<HeadElement['category'] | 'all'> = ['all', 'critical', 'seo', 'hint', 'social', 'asset', 'data']
  const item = filtered[active] ?? filtered[0]

  return (
    <div style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10, color: C, fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono',monospace", marginBottom: 6 }}>
          VISUAL 5 — ANATOMIA DO &lt;head&gt;
        </div>
        <div style={{ fontSize: 18, fontWeight: 800, color: FG, marginBottom: 4 }}>A ordem CERTA dos elementos do head</div>
        <div style={{ fontSize: 12, color: FGMUTE, lineHeight: 1.5 }}>
          A ordem do head não é arbitrária. charset precisa vir antes para o browser não re-parsear o HTML. preconnect antes do preload. CSS antes de scripts defer. Cada decisão tem impacto mensurável no Critical Rendering Path.
        </div>
      </div>

      {/* Filtros por categoria */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
        {cats.map(cat => {
          const color = cat === 'all' ? C : HEAD_CAT_COLOR[cat]
          const label = cat === 'all' ? 'Todos' : HEAD_CAT_LABEL[cat]
          const isActive = filter === cat
          return (
            <button key={cat} onClick={() => { setFilter(cat); setActive(0) }} style={{
              padding: '4px 12px', borderRadius: 999, border: 'none', cursor: 'pointer',
              fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700,
              background: isActive ? `${color}25` : 'transparent',
              color: isActive ? color : FGMUTE,
              borderWidth: 1, borderStyle: 'solid',
              borderColor: isActive ? `${color}60` : LINE,
            }}>
              {label}
            </button>
          )
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        {/* Lista ordenada de elementos */}
        <div style={{ background: BG, border: `1px solid ${LINE}`, borderRadius: 10, padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 10, color: SKY, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.1em' }}>&lt;head&gt;</span>
            <span style={{ fontSize: 9, color: FGMUTE, fontFamily: "'JetBrains Mono',monospace" }}>ordem importa</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {filtered.map((el, i) => {
              const isActive = i === active
              const color = HEAD_CAT_COLOR[el.category]
              return (
                <button key={el.id} onClick={() => setActive(i)} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 10px', borderRadius: 6, cursor: 'pointer',
                  background: isActive ? `${color}18` : 'transparent',
                  border: `1px solid ${isActive ? color + '70' : 'transparent'}`,
                  textAlign: 'left' as const, width: '100%',
                  fontFamily: "'JetBrains Mono',monospace",
                  transition: 'all .15s',
                }}>
                  <span style={{
                    fontSize: 10, color: isActive ? color : MUTE, fontWeight: 700,
                    minWidth: 22, textAlign: 'right' as const,
                  }}>
                    {String(el.order).padStart(2, '0')}
                  </span>
                  <span style={{
                    width: 6, height: 6, borderRadius: 999,
                    background: color, flexShrink: 0,
                  }} />
                  <span style={{
                    fontSize: 10.5, color: isActive ? FG : FGMUTE,
                    fontWeight: isActive ? 700 : 500,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    flex: 1,
                  }}>
                    {el.tag.length > 50 ? el.tag.slice(0, 47) + '...' : el.tag}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Detalhe do elemento selecionado */}
        {item && (() => {
          const color = HEAD_CAT_COLOR[item.category]
          return (
            <div style={{ background: BG, border: `1px solid ${color}50`, borderRadius: 10, padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{
                  fontSize: 9, color, fontWeight: 700,
                  fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.12em',
                  textTransform: 'uppercase' as const,
                  padding: '3px 8px', borderRadius: 4,
                  background: `${color}20`, border: `1px solid ${color}40`,
                }}>
                  {HEAD_CAT_LABEL[item.category]}
                </span>
                <span style={{ fontSize: 9, color: FGMUTE, fontFamily: "'JetBrains Mono',monospace" }}>posição #{item.order}</span>
              </div>

              <pre style={{
                background: CARD, border: `1px solid ${LINE}`, borderRadius: 6,
                padding: '10px 12px', margin: '0 0 14px',
                fontSize: 11, color: SKY, fontFamily: "'JetBrains Mono',monospace",
                overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all',
              }}>
                {item.tag}
              </pre>

              <div style={{ marginBottom: 14 }}>
                <div style={{
                  fontSize: 9, color: FGMUTE, fontWeight: 700,
                  fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.12em',
                  textTransform: 'uppercase' as const, marginBottom: 6,
                }}>
                  Por que aqui?
                </div>
                <div style={{ fontSize: 12, color: FG, lineHeight: 1.65 }}>{item.why}</div>
              </div>

              {item.warning && (
                <div style={{
                  background: `${AMB}15`, border: `1px solid ${AMB}50`,
                  borderRadius: 6, padding: '10px 12px',
                }}>
                  <div style={{
                    fontSize: 9, color: AMB, fontWeight: 700,
                    fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.12em',
                    marginBottom: 4,
                  }}>
                    ATENÇÃO
                  </div>
                  <div style={{ fontSize: 11, color: FGMUTE, lineHeight: 1.55 }}>{item.warning}</div>
                </div>
              )}
            </div>
          )
        })()}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — Meta Tags Builder
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
        <div style={{ fontSize: 10, color: C, fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono',monospace", marginBottom: 6 }}>VISUAL 6 — META TAGS BUILDER</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: FG, marginBottom: 4 }}>Gerador de Meta Tags</div>
        <div style={{ fontSize: 12, color: FGMUTE }}>Preencha os campos e veja o código gerado em tempo real.</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
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
// VISUAL 7 — Formulários Live + Constraint Validation API
// ═══════════════════════════════════════════════════════════════════════════════

const INPUT_TYPES = [
  { type: 'text', label: 'text', color: C, desc: 'Texto livre', attrs: 'minlength="3" maxlength="50"', note: 'Base — sempre use placeholder descritivo' },
  { type: 'email', label: 'email', color: SKY, desc: 'Valida formato de e-mail', attrs: 'required', note: 'Validação nativa — "x@y" não passa' },
  { type: 'password', label: 'password', color: PRP, desc: 'Obscurece o texto', attrs: 'minlength="8"', note: 'Sempre use autocomplete="new-password" em cadastro' },
  { type: 'number', label: 'number', color: GRN, desc: 'Teclado numérico + setas', attrs: 'min="0" max="100" step="5"', note: 'Use inputmode="numeric" para formato livre' },
  { type: 'date', label: 'date', color: AMB, desc: 'Picker nativo de data', attrs: 'min="2020-01-01"', note: 'Formato ISO — comportamento varia entre browsers' },
  { type: 'range', label: 'range', color: RED, desc: 'Slider', attrs: 'min="0" max="10" step="1"', note: 'Combine com output para mostrar valor atual' },
  { type: 'checkbox', label: 'checkbox', color: AMB, desc: 'Boolean — múltipla escolha', attrs: '', note: 'Use fieldset+legend para grupos de checkboxes' },
  { type: 'radio', label: 'radio', color: GRN, desc: 'Escolha única do grupo', attrs: 'name="opcao"', note: 'Mesmo name = mesmo grupo. Use fieldset+legend.' },
  { type: 'file', label: 'file', color: SKY, desc: 'Upload de arquivo', attrs: 'accept=".pdf,.jpg"', note: 'accept filtra o seletor mas não impede upload de outros' },
  { type: 'color', label: 'color', color: PRP, desc: 'Color picker nativo', attrs: '', note: 'Combina com datalist para paleta de sugestões' },
  { type: 'search', label: 'search', color: C, desc: 'Campo de busca', attrs: '', note: 'Adiciona botão X para limpar em alguns browsers' },
  { type: 'tel', label: 'tel', color: RED, desc: 'Teclado telefônico mobile', attrs: 'pattern="[0-9]{10,11}"', note: 'Não valida formato — use pattern' },
]

const VALIDITY_STATES = [
  { key: 'valueMissing', desc: 'Campo required vazio', trigger: 'required + valor vazio' },
  { key: 'typeMismatch', desc: 'Formato errado para o type', trigger: 'type="email" com "abc"' },
  { key: 'patternMismatch', desc: 'Não bate com o pattern regex', trigger: 'pattern="[A-Z]{3}" com "ab"' },
  { key: 'tooShort', desc: 'Menor que minlength', trigger: 'minlength="8" com 5 chars' },
  { key: 'tooLong', desc: 'Maior que maxlength', trigger: 'maxlength="10" com 15 chars' },
  { key: 'rangeUnderflow', desc: 'Menor que min', trigger: 'type="number" min="0" com -5' },
  { key: 'rangeOverflow', desc: 'Maior que max', trigger: 'type="number" max="100" com 200' },
  { key: 'stepMismatch', desc: 'Não é múltiplo de step', trigger: 'step="5" com 7' },
  { key: 'badInput', desc: 'Browser não consegue converter', trigger: 'type="number" com "abc"' },
  { key: 'customError', desc: 'setCustomValidity() foi usado', trigger: 'input.setCustomValidity("erro")' },
]

function FormInputsGallery() {
  const [selected, setSelected] = useState(0)
  const [tab, setTab] = useState<'types' | 'validation'>('types')
  const item = INPUT_TYPES[selected]
  const [demoValue, setDemoValue] = useState('')
  const [demoInfo, setDemoInfo] = useState<{ valid: boolean; states: string[] }>({ valid: true, states: [] })

  const handleDemoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDemoValue(e.target.value)
    const inp = e.target
    const v = inp.validity
    const active: string[] = []
    if (v.valueMissing) active.push('valueMissing')
    if (v.typeMismatch) active.push('typeMismatch')
    if (v.patternMismatch) active.push('patternMismatch')
    if (v.tooShort) active.push('tooShort')
    if (v.tooLong) active.push('tooLong')
    if (v.rangeUnderflow) active.push('rangeUnderflow')
    if (v.rangeOverflow) active.push('rangeOverflow')
    if (v.stepMismatch) active.push('stepMismatch')
    if (v.badInput) active.push('badInput')
    setDemoInfo({ valid: v.valid, states: active })
  }

  return (
    <div style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10, color: C, fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono',monospace", marginBottom: 6 }}>VISUAL 7 — FORMULÁRIOS</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: FG, marginBottom: 4 }}>Input Types + Constraint Validation API</div>
        <div style={{ fontSize: 12, color: FGMUTE }}>Tipos nativos com preview ao vivo e os 10 estados da ValidityState que o browser expõe sem JS.</div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 18, borderBottom: `1px solid ${LINE}` }}>
        {[
          { id: 'types', label: 'Input Types' },
          { id: 'validation', label: 'Constraint Validation API' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as 'types' | 'validation')} style={{
            padding: '10px 16px', border: 'none', cursor: 'pointer',
            background: 'transparent',
            color: tab === t.id ? C : FGMUTE,
            borderBottom: `2px solid ${tab === t.id ? C : 'transparent'}`,
            fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700,
            marginBottom: -1,
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'types' ? (
        <>
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={{ background: BG, border: `2px solid ${item.color}50`, borderRadius: 10, padding: 20 }}>
              <div style={{ fontSize: 12, color: item.color, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", marginBottom: 12 }}>type=&quot;{item.type}&quot;</div>
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
        </>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Coluna esquerda: tabela ValidityState */}
          <div>
            <div style={{ fontSize: 10, color: FGMUTE, fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 8 }}>
              ValidityState — propriedades
            </div>
            <div style={{ background: BG, border: `1px solid ${LINE}`, borderRadius: 10, padding: 12 }}>
              {VALIDITY_STATES.map(v => {
                const isActive = demoInfo.states.includes(v.key)
                return (
                  <div key={v.key} style={{
                    padding: '8px 10px', borderRadius: 6, marginBottom: 4,
                    background: isActive ? `${RED}15` : 'transparent',
                    border: `1px solid ${isActive ? RED + '60' : 'transparent'}`,
                    transition: 'all .15s',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{
                        fontSize: 11, fontWeight: 700,
                        color: isActive ? RED : SKY,
                        fontFamily: "'JetBrains Mono',monospace",
                      }}>
                        {v.key}
                      </span>
                      <span style={{
                        fontSize: 9, color: isActive ? RED : MUTE, fontWeight: 700,
                        fontFamily: "'JetBrains Mono',monospace",
                      }}>
                        {isActive ? '● ATIVO' : '○'}
                      </span>
                    </div>
                    <div style={{ fontSize: 10, color: FGMUTE, marginTop: 2 }}>{v.desc}</div>
                    <div style={{ fontSize: 9, color: MUTE, marginTop: 2, fontFamily: "'JetBrains Mono',monospace" }}>{v.trigger}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Coluna direita: campo demo */}
          <div>
            <div style={{ fontSize: 10, color: FGMUTE, fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 8 }}>
              Demo ao vivo
            </div>
            <div style={{ background: BG, border: `1px solid ${LINE}`, borderRadius: 10, padding: 18 }}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 11, color: FGMUTE, fontFamily: "'JetBrains Mono',monospace", display: 'block', marginBottom: 6 }}>
                  type=&quot;email&quot; required minlength=&quot;6&quot; pattern=&quot;.+@empresa\.com&quot;
                </label>
                <input
                  type="email"
                  required
                  minLength={6}
                  pattern=".+@empresa\.com"
                  value={demoValue}
                  onChange={handleDemoChange}
                  placeholder="seu@empresa.com"
                  style={{
                    padding: '10px 14px', borderRadius: 6,
                    background: CARD,
                    border: `2px solid ${demoInfo.valid ? GRN + '60' : RED + '60'}`,
                    color: FG, fontSize: 13, fontFamily: 'inherit',
                    outline: 'none', width: '100%', boxSizing: 'border-box' as const,
                  }}
                />
              </div>

              <div style={{
                background: demoInfo.valid ? `${GRN}10` : `${RED}10`,
                border: `1px solid ${demoInfo.valid ? GRN : RED}40`,
                borderRadius: 6, padding: '10px 12px', marginBottom: 14,
              }}>
                <div style={{ fontSize: 10, color: demoInfo.valid ? GRN : RED, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>
                  input.validity.valid = {String(demoInfo.valid)}
                </div>
                {demoInfo.states.length > 0 && (
                  <div style={{ fontSize: 9, color: FGMUTE, marginTop: 6, fontFamily: "'JetBrains Mono',monospace" }}>
                    Estados ativos: {demoInfo.states.join(', ')}
                  </div>
                )}
              </div>

              <div style={{ fontSize: 10, color: FGMUTE, fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                API completa
              </div>
              <pre style={{
                background: CARD, border: `1px solid ${LINE}`, borderRadius: 6,
                padding: '10px 12px', margin: 0,
                fontSize: 10, color: SKY, fontFamily: "'JetBrains Mono',monospace",
                lineHeight: 1.65,
              }}>{`input.validity         // ValidityState
input.validationMessage // string
input.checkValidity()  // dispara invalid event
input.reportValidity() // mostra tooltip nativo
input.setCustomValidity("erro")
                       // marca como inválido`}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 8 — Anti-patterns HTML (AntiPatternsGallery)
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
// VISUAL 9 — Imagens Otimizadas (DecisionTree)
// ═══════════════════════════════════════════════════════════════════════════════

const IMG_DECISION_NODES: Record<string, DTNode> = {
  start: {
    id: 'start',
    question: 'Onde a imagem aparece na página?',
    detail: 'A primeira pergunta é sempre sobre a posição: above-the-fold (visível no carregamento) ou below-the-fold (precisa rolar para ver).',
    icon: '🖼',
    children: [
      { label: 'Hero / above-the-fold (LCP)', nodeId: 'hero', color: C },
      { label: 'Below-the-fold (precisa rolar)', nodeId: 'below', color: SKY },
    ],
  },
  hero: {
    id: 'hero',
    question: 'É a maior imagem visível inicialmente (provável LCP)?',
    detail: 'O LCP (Largest Contentful Paint) é o elemento maior visível ao carregar — geralmente é a imagem hero. Receber prioridade máxima é essencial para Core Web Vitals.',
    icon: '🎯',
    children: [
      { label: 'Sim — é o elemento LCP', nodeId: 'lcp', color: C },
      { label: 'Não — é uma imagem above-the-fold mas pequena', nodeId: 'aboveSmall', color: AMB },
    ],
  },
  lcp: {
    id: 'lcp',
    recommendation: 'fetchpriority="high" + preload no <head>',
    detail: 'Para imagem LCP: NUNCA loading="lazy". Use fetchpriority="high" para alta prioridade. Adicione <link rel="preload" as="image"> no head para download paralelo ao parser. Defina width/height para evitar CLS.',
    color: GRN,
    icon: '🚀',
  },
  aboveSmall: {
    id: 'aboveSmall',
    recommendation: 'loading="eager" (default) + width/height',
    detail: 'Use loading="eager" (que é o default — basta não colocar lazy). Defina width e height para evitar layout shift. Não precisa de fetchpriority="high" — reservado para o LCP.',
    color: SKY,
    icon: '✓',
  },
  below: {
    id: 'below',
    question: 'Quantas variações de tamanho/formato você precisa?',
    detail: 'A escolha entre srcset e <picture> depende da intenção: o browser decide ou você decide?',
    icon: '📐',
    children: [
      { label: 'Mesma imagem em diferentes resoluções', nodeId: 'srcset', color: SKY },
      { label: 'Imagens diferentes por viewport (art direction)', nodeId: 'picture', color: PRP },
      { label: 'Uma única imagem', nodeId: 'lazy', color: GRN },
    ],
  },
  srcset: {
    id: 'srcset',
    recommendation: '<img srcset="..." sizes="..." loading="lazy">',
    detail: 'srcset declara múltiplas resoluções (ex: "img-480w.jpg 480w, img-800w.jpg 800w"). sizes informa qual será o tamanho exibido em cada viewport (ex: "(max-width: 600px) 100vw, 50vw"). O BROWSER decide qual baixar com base em densidade de pixel e largura.',
    color: SKY,
    icon: '🔁',
  },
  picture: {
    id: 'picture',
    recommendation: '<picture> com múltiplos <source>',
    detail: 'Use <picture> para art direction: imagens com composições diferentes por viewport (ex: foto larga no desktop, retrato no mobile). Você decide qual carregar via media queries em <source>. O <img> dentro é o fallback obrigatório com alt.',
    color: PRP,
    icon: '🎨',
  },
  lazy: {
    id: 'lazy',
    recommendation: '<img loading="lazy" decoding="async">',
    detail: 'Para imagens below-the-fold: loading="lazy" adia o download até estarem próximas da viewport. decoding="async" decodifica fora do main thread. Sempre defina width e height para evitar CLS quando a imagem aparecer.',
    color: GRN,
    icon: '⚡',
  },
}

const IMG_ROOT = IMG_DECISION_NODES.start

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 10 — Resource Hints (DecisionTree)
// ═══════════════════════════════════════════════════════════════════════════════

const HINT_DECISION_NODES: Record<string, DTNode> = {
  start: {
    id: 'start',
    question: 'O recurso é necessário para esta página ou para a próxima?',
    detail: 'A primeira divisão é temporal: o recurso é usado AGORA (página atual) ou DEPOIS (próxima navegação)?',
    icon: '🌐',
    children: [
      { label: 'Esta página (atual)', nodeId: 'now', color: C },
      { label: 'Próxima navegação (futura)', nodeId: 'future', color: PRP },
      { label: 'Apenas conexão a uma origem', nodeId: 'origin', color: AMB },
    ],
  },
  now: {
    id: 'now',
    question: 'É um recurso crítico do render inicial?',
    detail: 'Recursos críticos: fonte que aparece na hero, CSS above-the-fold, imagem LCP, scripts essenciais.',
    icon: '⏱',
    children: [
      { label: 'Sim — fonte/imagem/script crítico', nodeId: 'preload', color: GRN },
      { label: 'Não — pode esperar', nodeId: 'noHint', color: FGMUTE },
    ],
  },
  preload: {
    id: 'preload',
    recommendation: '<link rel="preload" as="..." href="...">',
    detail: 'preload força download imediato com alta prioridade. SEMPRE use o atributo as="..." (font, image, script, style) para o browser priorizar corretamente. Para fontes cross-origin, use crossorigin="anonymous" — sem isso o browser baixa duas vezes.',
    color: GRN,
    icon: '🚀',
  },
  noHint: {
    id: 'noHint',
    recommendation: 'Sem hint — deixe o browser priorizar',
    detail: 'Não use hints para tudo. preload em recursos não críticos rouba banda dos críticos. Se não há urgência, deixe o browser usar sua heurística padrão. Hints são bisturis, não martelos.',
    color: FGMUTE,
    icon: '✋',
  },
  future: {
    id: 'future',
    question: 'É uma rota completa ou um recurso específico?',
    detail: 'O alvo do prefetch pode ser uma página inteira (HTML) ou um asset específico (script, image).',
    icon: '🔮',
    children: [
      { label: 'Próxima página/rota provável', nodeId: 'prefetch', color: PRP },
      { label: 'Asset específico para próxima rota', nodeId: 'prefetchAsset', color: SKY },
    ],
  },
  prefetch: {
    id: 'prefetch',
    recommendation: '<link rel="prefetch" href="/proxima-pagina">',
    detail: 'prefetch baixa em prioridade BAIXA, durante idle do browser. Ideal para rotas que o usuário provavelmente acessará (ex: próximo passo de um wizard, link em destaque). Sem warning se não usar — diferente de preload.',
    color: PRP,
    icon: '🔮',
  },
  prefetchAsset: {
    id: 'prefetchAsset',
    recommendation: '<link rel="prefetch" as="script" href="/next-bundle.js">',
    detail: 'Mesmo conceito: baixa em idle para a próxima rota. Use as="..." quando souber o tipo. Útil para chunks de rotas específicas (ex: bundle do checkout em e-commerce, baixado quando o usuário está no carrinho).',
    color: SKY,
    icon: '📦',
  },
  origin: {
    id: 'origin',
    question: 'Quão certo você está que vai usar essa origem?',
    detail: 'preconnect estabelece TCP+TLS antecipadamente (custa recursos). dns-prefetch é mais leve, só resolve DNS.',
    icon: '🌐',
    children: [
      { label: 'Certo — usarei recursos dessa origem', nodeId: 'preconnect', color: AMB },
      { label: 'Possível — só por garantia', nodeId: 'dnsPrefetch', color: SKY },
    ],
  },
  preconnect: {
    id: 'preconnect',
    recommendation: '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">',
    detail: 'preconnect faz handshake TCP + TLS sem baixar recurso. Economiza 150-300ms por origem. Use para Google Fonts (gstatic), CDN da app, APIs de terceiros. Para origens cross-origin com credentials, adicione crossorigin.',
    color: AMB,
    icon: '🤝',
  },
  dnsPrefetch: {
    id: 'dnsPrefetch',
    recommendation: '<link rel="dns-prefetch" href="https://...">',
    detail: 'Apenas resolve o DNS — sem TCP nem TLS. Mais leve que preconnect. Use para origens menos prioritárias ou que talvez sejam usadas. Combine com preconnect como fallback para browsers que não suportam preconnect.',
    color: SKY,
    icon: '📡',
  },
}

const HINT_ROOT = HINT_DECISION_NODES.start

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 11 — Web Components (componente customizado)
// Específico de HTML: template + slot + shadow DOM e o que fica encapsulado
// ═══════════════════════════════════════════════════════════════════════════════

type WCStep = {
  id: string
  title: string
  caption: string
  template: string
  consumer: string
  rendered: string
  highlightTemplate?: number[]
  highlightConsumer?: number[]
  encapsulationNote: string
}

const WC_STEPS: WCStep[] = [
  {
    id: 'template',
    title: '1. <template> — A planta do componente',
    caption: 'O template é parsed pelo browser, mas seu conteúdo NÃO é renderizado. Estilos não aplicam, scripts não executam, imagens não baixam — fica inerte até ser instanciado.',
    template: `<template id="user-card">
  <style>
    .card { padding: 16px; background: #1e293b; }
    .name { color: #ef4444; font-weight: bold; }
  </style>
  <div class="card">
    <span class="name">Nome do usuário</span>
  </div>
</template>`,
    consumer: '',
    rendered: '(nada visível — template é inerte)',
    encapsulationNote: 'O conteúdo do <template> existe no DOM mas não é renderizado. Você precisa cloneNode(true) e attach a algum lugar para ele aparecer.',
  },
  {
    id: 'custom-element',
    title: '2. customElements.define() — Registrar o tag novo',
    caption: 'Custom Element é uma classe que estende HTMLElement. O nome registrado precisa ter um hífen (kebab-case). connectedCallback dispara quando o elemento é inserido no DOM.',
    template: `<template id="user-card">
  <style>:host { display: block; }</style>
  <div class="card">
    <slot name="name">Anônimo</slot>
  </div>
</template>`,
    consumer: `class UserCard extends HTMLElement {
  connectedCallback() {
    const tmpl = document
      .getElementById('user-card')
    const clone = tmpl.content
      .cloneNode(true)
    this.attachShadow({ mode: 'open' })
      .appendChild(clone)
  }
}
customElements.define(
  'user-card', UserCard
)`,
    rendered: `<user-card></user-card>
→ "Anônimo" (slot fallback)`,
    encapsulationNote: 'customElements.define associa o nome <user-card> à classe UserCard. Toda vez que o browser encontra essa tag no HTML, instancia a classe e chama connectedCallback.',
  },
  {
    id: 'shadow-dom',
    title: '3. Shadow DOM — Encapsulamento total',
    caption: 'attachShadow({mode: "open"}) cria uma árvore DOM PARALELA dentro do elemento. CSS interno não vaza para fora. CSS externo não entra. document.querySelector NÃO acessa elementos do shadow DOM.',
    template: `<template id="user-card">
  <style>
    .name { color: #ef4444; }
  </style>
  <div class="card">
    <span class="name">
      <slot name="name"></slot>
    </span>
  </div>
</template>`,
    consumer: `// Página principal
<style>
  .name { color: blue; } /* não afeta */
</style>

<user-card>
  <span slot="name">Daniel</span>
</user-card>`,
    rendered: `Daniel
(em vermelho, não azul —
 CSS externo não atravessa
 o shadow boundary)`,
    encapsulationNote: 'Shadow DOM é um boundary real. CSS externo não entra (use ::part ou custom properties para customização). CSS interno não vaza. Por isso Web Components funcionam em qualquer framework.',
  },
  {
    id: 'slots',
    title: '4. <slot> — Composição com children',
    caption: 'Slots permitem que o consumidor injete conteúdo dentro do shadow DOM, mantendo o encapsulamento. Análogo a children no React. Slots têm fallback — se nada for passado, mostra o conteúdo padrão.',
    template: `<template id="user-card">
  <div class="card">
    <slot name="avatar">👤</slot>
    <h3>
      <slot name="name">Anônimo</slot>
    </h3>
    <slot>(sem bio)</slot>
  </div>
</template>`,
    consumer: `<user-card>
  <img slot="avatar" src="me.jpg">
  <span slot="name">Daniel</span>
  Engenheiro full-stack.
</user-card>`,
    rendered: `[me.jpg]
Daniel
Engenheiro full-stack.`,
    encapsulationNote: 'O conteúdo passado pelo consumer continua no light DOM (acessível via querySelector externo). O slot apenas o renderiza dentro do shadow DOM no local onde foi declarado.',
  },
]

function WebComponentsVisual() {
  const [step, setStep] = useState(0)
  const current = WC_STEPS[step]

  return (
    <div style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10, color: C, fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono',monospace", marginBottom: 6 }}>
          VISUAL 11 — WEB COMPONENTS
        </div>
        <div style={{ fontSize: 18, fontWeight: 800, color: FG, marginBottom: 4 }}>template + custom element + shadow DOM + slot</div>
        <div style={{ fontSize: 12, color: FGMUTE, lineHeight: 1.5 }}>
          As 4 APIs nativas que formam Web Components. Acompanhe a construção de um {'<user-card>'} do zero — template inerte, registro do custom element, encapsulamento via shadow DOM e composição via slots.
        </div>
      </div>

      {/* Stepper */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 18, overflowX: 'auto' }}>
        {WC_STEPS.map((s, i) => (
          <button key={s.id} onClick={() => setStep(i)} style={{
            padding: '8px 14px', borderRadius: 6, border: 'none', cursor: 'pointer',
            background: i === step ? `${C}25` : BG,
            borderWidth: 1, borderStyle: 'solid',
            borderColor: i === step ? `${C}60` : LINE,
            color: i === step ? C : FGMUTE,
            fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700,
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}>
            {s.title.split('—')[0].trim()}
          </button>
        ))}
      </div>

      {/* Caption */}
      <div style={{
        background: `${C}10`, border: `1px solid ${C}40`, borderRadius: 8,
        padding: '12px 16px', marginBottom: 16,
      }}>
        <div style={{ fontSize: 13, color: FG, fontWeight: 700, marginBottom: 4 }}>{current.title}</div>
        <div style={{ fontSize: 12, color: FGMUTE, lineHeight: 1.55 }}>{current.caption}</div>
      </div>

      {/* 3 colunas: Template | Consumer | Rendered */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
        {[
          { label: 'TEMPLATE / DEFINIÇÃO', color: SKY, content: current.template },
          { label: 'CONSUMER (uso)', color: AMB, content: current.consumer || '(nenhum consumer ainda)' },
          { label: 'O QUE RENDERIZA', color: GRN, content: current.rendered },
        ].map(col => (
          <div key={col.label} style={{
            background: BG, border: `1px solid ${col.color}40`, borderRadius: 8,
            padding: 14, minHeight: 220,
          }}>
            <div style={{
              fontSize: 9, color: col.color, fontWeight: 700,
              fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.12em',
              marginBottom: 10,
            }}>
              {col.label}
            </div>
            <pre style={{
              margin: 0, fontSize: 10, lineHeight: 1.55,
              color: FG, fontFamily: "'JetBrains Mono',monospace",
              whiteSpace: 'pre-wrap', wordBreak: 'break-word',
            }}>
              {col.content}
            </pre>
          </div>
        ))}
      </div>

      {/* Nota sobre encapsulamento */}
      <div style={{
        background: `${PRP}10`, border: `1px solid ${PRP}50`, borderRadius: 8,
        padding: '12px 16px',
      }}>
        <div style={{
          fontSize: 9, color: PRP, fontWeight: 700,
          fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.12em',
          marginBottom: 6,
        }}>
          ENCAPSULAMENTO
        </div>
        <div style={{ fontSize: 12, color: FGMUTE, lineHeight: 1.6 }}>{current.encapsulationNote}</div>
      </div>
    </div>
  )
}

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
          description="Três slides sobre o caminho do HTML bruto até os pixels na tela."
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
      id: 'a11y-tree',
      title: 'Accessibility Tree',
      subtitle: 'DOM vs AT',
      accent: GRN,
      component: <AccessibilityTreeVisual />,
    },
    {
      id: 'a11y',
      title: 'Acessibilidade',
      subtitle: 'Checklist',
      accent: GRN,
      component: <A11YChecklist />,
    },
    {
      id: 'head',
      title: 'Anatomia do <head>',
      subtitle: 'Ordem certa',
      accent: C,
      component: <HeadAnatomy />,
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
      subtitle: 'Inputs + Validação',
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
          label="VISUAL 8 — ANTI-PATTERNS HTML"
          heading="Os 8 Erros Mais Comuns de HTML"
          description="Div soup, imagens sem alt, labels desconectados, headings fora de ordem e mais."
          wrongLabel="Errado"
          rightLabel="Correto"
          whyLabel="Por que importa"
        />
      ),
    },
    {
      id: 'imagens',
      title: 'Imagens Otimizadas',
      subtitle: 'Decision Tree',
      accent: SKY,
      component: (
        <DecisionTree
          root={IMG_ROOT}
          nodes={IMG_DECISION_NODES}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          title="VISUAL 9 — Imagens Otimizadas"
          description="Quando usar fetchpriority, srcset, picture, loading='lazy' e decoding. Responda às perguntas para chegar à recomendação."
        />
      ),
    },
    {
      id: 'hints',
      title: 'Resource Hints',
      subtitle: 'preload / prefetch',
      accent: AMB,
      component: (
        <DecisionTree
          root={HINT_ROOT}
          nodes={HINT_DECISION_NODES}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          title="VISUAL 10 — Resource Hints"
          description="Quando usar preload, prefetch, preconnect ou dns-prefetch. Pergunte se o recurso é AGORA ou DEPOIS, e qual a urgência."
        />
      ),
    },
    {
      id: 'web-components',
      title: 'Web Components',
      subtitle: 'template + shadow DOM',
      accent: PRP,
      component: <WebComponentsVisual />,
    },
  ]

  return <VisuaisShell visuals={visuals} active={active} onChange={setActive} />
}
