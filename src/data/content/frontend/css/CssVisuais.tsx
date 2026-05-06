'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'
import { ConceptCarousel } from '@/components/visuals/ConceptCarousel'
import type { Slide } from '@/components/visuals/ConceptCarousel'
import { StateMachineExplorer } from '@/components/visuals/StateMachineExplorer'
import type { SMState, SMTransition } from '@/components/visuals/StateMachineExplorer'
import { CodeStepper } from '@/components/visuals/CodeStepper'
import type { CodeStepperScenario } from '@/components/visuals/CodeStepper'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'
import { ProConMatrix } from '@/components/visuals/ProConMatrix'
import type { ProConOption } from '@/components/visuals/ProConMatrix'
import { FeaturesCarousel } from '@/components/visuals/FeaturesCarousel'
import type { Feature } from '@/components/visuals/FeaturesCarousel'

// ── Paleta CSS ───────────────────────────────────────────────────────────────────
const C      = '#264de4'   // CSS blue clássico
const BG     = '#0f172a'
const CARD   = '#1e293b'
const CARD2  = '#243044'
const LINE   = '#334155'
const MUTE   = '#475569'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const RED    = '#ef4444'
const GRN    = '#4ade80'
const AMB    = '#f59e0b'
const PRP    = '#a78bfa'
const SKY    = '#38bdf8'
const ORG    = '#fb923c'

void CARD2; void MUTE; void FG; void FGMUTE

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Cascade & Origem (LayerStack)
// ═══════════════════════════════════════════════════════════════════════════════

const CASCADE_LAYERS: Layer[] = [
  {
    id: 'ua',
    label: 'User-Agent stylesheet',
    sublabel: 'Estilos default do browser',
    description: 'Cada browser tem regras default para tags HTML — h1 em negrito, a sublinhado, body com margin 8px. É a base sobre a qual o resto cai. Você normalmente neutraliza com um reset (Normalize.css, modern-css-reset) ou redefinindo no @layer reset.',
    examples: ['h1 { font-size: 2em }', 'a { text-decoration: underline }', 'body { margin: 8px }'],
    color: '#64748b',
    icon: '🌐',
  },
  {
    id: 'user',
    label: 'User stylesheet',
    sublabel: 'Customização do usuário (raro hoje)',
    description: 'Usuários podem aplicar CSS próprio via extensão de browser ou configuração de acessibilidade. Em geral só aparece em casos de high-contrast mode ou leitores customizados. Perde para o author, exceto quando user usa !important.',
    examples: ['Stylish', 'Stylus', 'High-contrast mode'],
    color: '#94a3b8',
    icon: '👤',
  },
  {
    id: 'reset',
    label: 'Author @layer reset',
    sublabel: 'Layer mais baixo do projeto',
    description: 'Primeiro layer da arquitetura — neutraliza UA stylesheet. Box-sizing universal, margin/padding zerados, body sem margin. Ficar dentro de @layer permite que qualquer outro layer ganhe sem precisar de seletor mais específico.',
    code: `@layer reset {
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; }
  h1, h2, h3 { font-size: inherit; font-weight: inherit; }
}`,
    color: SKY,
    icon: '🧹',
  },
  {
    id: 'tokens',
    label: 'Author @layer tokens',
    sublabel: 'Variáveis e design tokens',
    description: 'Custom properties globais — paleta de cores, escala de espaçamento, breakpoints, radius, sombras. Definidas em :root, sobrescritas em [data-theme="dark"]. Não geram regras de estilo direto, alimentam todos os layers acima.',
    code: `@layer tokens {
  :root {
    --space-1: 0.25rem;
    --accent: #ef4444;
    --radius: 0.5rem;
  }
}`,
    color: PRP,
    icon: '🎨',
  },
  {
    id: 'components',
    label: 'Author @layer components',
    sublabel: 'Componentes reutilizáveis',
    description: 'Estilos de componentes do design system — .btn, .card, .input, .modal. Especificidade por classe. Vence reset e tokens automaticamente por estar em layer posterior, mesmo com seletor menos específico.',
    code: `@layer components {
  .btn {
    padding: var(--space-2) var(--space-4);
    background: var(--accent);
    border-radius: var(--radius);
  }
}`,
    color: C,
    icon: '🧩',
  },
  {
    id: 'utilities',
    label: 'Author @layer utilities',
    sublabel: 'Atomic / utility-first',
    description: 'Atomic CSS — Tailwind-style. Cada classe faz UMA coisa. .mt-4, .flex, .text-center. Vence components quando aplicado, permitindo overrides pontuais sem brigar com especificidade. Tailwind organiza tudo neste layer.',
    code: `@layer utilities {
  .hidden { display: none; }
  .flex { display: flex; }
  .text-center { text-align: center; }
}`,
    color: GRN,
    icon: '⚡',
  },
  {
    id: 'unlayered',
    label: 'Author sem layer',
    sublabel: 'Estilos que precisam ganhar sempre',
    description: 'Regras escritas FORA de qualquer @layer ficam acima de todos os layers — vencem mesmo regras de utilities. Use com moderação para overrides específicos do projeto que devem trumpar a biblioteca de design system.',
    code: `/* sem @layer — vence tudo dentro de layers */
.legal-text { color: #555 !important; }`,
    color: AMB,
    icon: '🎯',
  },
  {
    id: 'important',
    label: '!important do author',
    sublabel: 'Quebra-cabeças',
    description: 'Marca o último recurso. Vence cascade dentro do mesmo layer. Quando usado em layer baixo, ainda perde para !important em layer mais alto — INVERTE a ordem. Em produção, prefira aumentar especificidade ou usar @layer.',
    examples: ['.btn { color: red !important }', 'inline style="color: blue" PERDE para !important'],
    color: RED,
    icon: '⚠️',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Box Model conceitos (ConceptCarousel)
// ═══════════════════════════════════════════════════════════════════════════════

function SlideContentBoxBorderBox() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', height: 240, justifyContent: 'center' }}>
      <div style={{ display: 'flex', gap: 18 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{ fontSize: 9, color: SKY, fontWeight: 700, letterSpacing: '.1em' }}>CONTENT-BOX</div>
          <div style={{
            width: 130, padding: 14, border: `3px solid ${SKY}`,
            background: `${SKY}10`, fontSize: 10, color: FGMUTE, textAlign: 'center',
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            <div style={{ background: `${SKY}30`, color: SKY, padding: 8, borderRadius: 3 }}>w: 130 + p + b</div>
          </div>
          <div style={{ fontSize: 9, color: FGMUTE, textAlign: 'center' }}>total = 130 + 28 + 6 = <strong style={{ color: SKY }}>164px</strong></div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{ fontSize: 9, color: GRN, fontWeight: 700, letterSpacing: '.1em' }}>BORDER-BOX</div>
          <div style={{
            width: 130, padding: 14, border: `3px solid ${GRN}`,
            background: `${GRN}10`, fontSize: 10, color: FGMUTE, textAlign: 'center',
            fontFamily: "'JetBrains Mono', monospace", boxSizing: 'border-box',
          }}>
            <div style={{ background: `${GRN}30`, color: GRN, padding: 8, borderRadius: 3 }}>w: 130 (incluso)</div>
          </div>
          <div style={{ fontSize: 9, color: FGMUTE, textAlign: 'center' }}>total = <strong style={{ color: GRN }}>130px</strong> (sempre)</div>
        </div>
      </div>
      <div style={{ fontSize: 11, color: FGMUTE, textAlign: 'center', maxWidth: 380, lineHeight: 1.6 }}>
        Padrão moderno: <code style={{ color: GRN }}>* {'{'}box-sizing: border-box{'}'}</code> no reset.
      </div>
    </div>
  )
}

function SlideMarginCollapse() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', justifyContent: 'center', height: 240 }}>
      <div style={{ display: 'flex', gap: 18 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ fontSize: 9, color: RED, fontWeight: 700 }}>COLAPSA</div>
          <div style={{ width: 110, height: 36, background: `${C}30`, border: `1px solid ${C}` }} />
          <div style={{ height: 24, background: `${RED}25`, border: `1px dashed ${RED}50`, width: 60, color: RED, fontSize: 9, textAlign: 'center', lineHeight: '24px' }}>20px</div>
          <div style={{ width: 110, height: 36, background: `${C}30`, border: `1px solid ${C}` }} />
          <div style={{ fontSize: 9, color: FGMUTE, textAlign: 'center', maxWidth: 110, lineHeight: 1.4, marginTop: 4 }}>
            mb: 20 + mt: 30<br />→ <strong style={{ color: RED }}>30px</strong> (não 50!)
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ fontSize: 9, color: GRN, fontWeight: 700 }}>NÃO COLAPSA</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '4px', border: `1px dashed ${GRN}40`, borderRadius: 4 }}>
            <div style={{ width: 110, height: 28, background: `${C}30`, border: `1px solid ${C}` }} />
            <div style={{ width: 110, height: 28, background: `${C}30`, border: `1px solid ${C}` }} />
            <div style={{ width: 110, height: 28, background: `${C}30`, border: `1px solid ${C}` }} />
          </div>
          <div style={{ fontSize: 9, color: FGMUTE, textAlign: 'center', maxWidth: 110, lineHeight: 1.4, marginTop: 4 }}>
            display: flex<br />gap: 20px → <strong style={{ color: GRN }}>20px</strong> consistente
          </div>
        </div>
      </div>
    </div>
  )
}

function SlideBFC() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', justifyContent: 'center', height: 240 }}>
      <div style={{
        background: `${PRP}15`, border: `2px solid ${PRP}`, borderRadius: 8,
        padding: 14, position: 'relative', minWidth: 280,
      }}>
        <div style={{
          position: 'absolute', top: -10, left: 12, background: BG, padding: '0 6px',
          fontSize: 9, color: PRP, fontWeight: 700, letterSpacing: '.05em',
        }}>BFC ISOLADO</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div style={{ background: `${C}30`, border: `1px solid ${C}`, padding: 8, fontSize: 10, color: SKY, textAlign: 'center' }}>filho 1</div>
          <div style={{ background: `${C}30`, border: `1px solid ${C}`, padding: 8, fontSize: 10, color: SKY, textAlign: 'center' }}>filho 2</div>
        </div>
      </div>
      <div style={{ fontSize: 10.5, color: FGMUTE, textAlign: 'center', maxWidth: 360, lineHeight: 1.6 }}>
        BFC criado por: <code style={{ color: PRP }}>display: flow-root</code>, <code style={{ color: PRP }}>overflow: auto</code>, flex/grid, contain. Margens não vazam.
      </div>
    </div>
  )
}

function SlideOverflow() {
  const items = [
    { val: 'visible', desc: 'transborda (default)', col: SKY },
    { val: 'hidden', desc: 'corta sem scroll', col: AMB },
    { val: 'auto', desc: 'scroll se necessário', col: GRN },
    { val: 'scroll', desc: 'scrollbar sempre', col: PRP },
    { val: 'clip', desc: 'corta + sem scroll', col: ORG },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: 240, justifyContent: 'center' }}>
      {items.map(it => (
        <div key={it.val} style={{
          display: 'grid', gridTemplateColumns: '110px 1fr',
          alignItems: 'center', gap: 10,
          background: `${it.col}10`, border: `1px solid ${it.col}40`,
          borderRadius: 6, padding: '8px 12px',
        }}>
          <div style={{ color: it.col, fontWeight: 700, fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>{it.val}</div>
          <div style={{ color: FGMUTE, fontSize: 10.5 }}>{it.desc}</div>
        </div>
      ))}
    </div>
  )
}

function SlideLogical() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', justifyContent: 'center', height: 240 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, fontSize: 10.5, color: FGMUTE, lineHeight: 1.7 }}>
        <div style={{ background: CARD, padding: 14, borderRadius: 8, border: `1px solid ${LINE}` }}>
          <div style={{ color: SKY, fontWeight: 700, fontSize: 10, marginBottom: 8 }}>FÍSICAS (LTR)</div>
          <div><code style={{ color: '#fda4af' }}>margin-left: auto</code></div>
          <div><code style={{ color: '#fda4af' }}>padding-top: 1rem</code></div>
          <div><code style={{ color: '#fda4af' }}>top: 0; left: 0</code></div>
        </div>
        <div style={{ background: CARD, padding: 14, borderRadius: 8, border: `1px solid ${GRN}40` }}>
          <div style={{ color: GRN, fontWeight: 700, fontSize: 10, marginBottom: 8 }}>LÓGICAS (RTL-safe)</div>
          <div><code style={{ color: '#86efac' }}>margin-inline-start: auto</code></div>
          <div><code style={{ color: '#86efac' }}>padding-block-start: 1rem</code></div>
          <div><code style={{ color: '#86efac' }}>inset-block-start: 0</code></div>
        </div>
      </div>
      <div style={{ fontSize: 10.5, color: FGMUTE, textAlign: 'center', maxWidth: 380, lineHeight: 1.6 }}>
        Lógicas se adaptam à <code style={{ color: SKY }}>direction</code> e <code style={{ color: SKY }}>writing-mode</code>. Uso obrigatório em produtos globais (RTL).
      </div>
    </div>
  )
}

const BOX_SLIDES: Slide[] = [
  {
    title: 'Content-box vs Border-box',
    paragraphs: [
      'box-sizing controla como width e height são interpretados.',
      'content-box (padrão): width = só conteúdo. Padding e border AUMENTAM o tamanho total.',
      'border-box: width = conteúdo + padding + border. Padrão moderno em todo reset CSS.',
    ],
    gradient: [SKY, GRN],
    illustration: <SlideContentBoxBorderBox />,
  },
  {
    title: 'Margin Collapsing',
    paragraphs: [
      'Margens verticais adjacentes COLAPSAM na maior — não somam.',
      'Acontece em fluxo normal: irmãos block, pai e primeiro/último filho, bloco vazio.',
      'NÃO acontece em flex/grid containers, BFC, ou com padding/border separando.',
    ],
    gradient: [RED, AMB],
    illustration: <SlideMarginCollapse />,
  },
  {
    title: 'Block Formatting Context (BFC)',
    paragraphs: [
      'BFC é uma região de layout isolada — margens não vazam, floats são contidos.',
      'Criado por: flex, grid, flow-root, overflow ≠ visible, contain, position absolute/fixed.',
      'display: flow-root é o "clearfix moderno" — cria BFC sem efeitos colaterais.',
    ],
    gradient: [PRP, C],
    illustration: <SlideBFC />,
  },
  {
    title: 'Overflow — 5 valores',
    paragraphs: [
      'visible (default): conteúdo transborda. hidden: corta sem scroll.',
      'auto: scrollbar quando necessário. scroll: scrollbar sempre.',
      'clip: corta como hidden mas não cria scroll programático nem permite scroll por JS.',
    ],
    gradient: [GRN, SKY],
    illustration: <SlideOverflow />,
  },
  {
    title: 'Logical Properties',
    paragraphs: [
      'Substituem direções físicas (left/right) por lógicas (inline-start/end).',
      'Em RTL (árabe, hebraico) ou vertical-rl (japonês), se adaptam automaticamente.',
      'Atalhos: margin-inline: auto centraliza horizontal. inset: 0 = top/right/bottom/left.',
    ],
    gradient: [GRN, PRP],
    illustration: <SlideLogical />,
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Flexbox Vivo (StateMachineExplorer)
// ═══════════════════════════════════════════════════════════════════════════════

const FLEX_STATES: SMState[] = [
  { id: 'row-start',    label: 'row\\nstart',    description: 'Direção row (padrão), justify-content: flex-start. Itens encostados à esquerda. Default do flex.', color: SKY,  isInitial: true },
  { id: 'row-center',   label: 'row\\ncenter',   description: 'Direção row, justify-content: center. Todos os itens centralizados horizontalmente em uma linha.', color: GRN },
  { id: 'row-between',  label: 'row\\nbetween',  description: 'Direção row, justify-content: space-between. Primeiro item à esquerda, último à direita, gaps iguais entre.', color: AMB },
  { id: 'row-around',   label: 'row\\naround',   description: 'Direção row, justify-content: space-around. Espaços iguais em volta de cada item — gap das pontas é metade do gap interno.', color: PRP },
  { id: 'col-stretch',  label: 'col\\nstretch',  description: 'flex-direction: column, align-items: stretch (padrão). Filhos ocupam toda a largura disponível.', color: ORG },
  { id: 'col-center',   label: 'col\\ncenter',   description: 'flex-direction: column + align-items: center. Filhos centralizados horizontalmente, empilhados verticalmente.', color: RED },
  { id: 'wrap',         label: 'wrap',           description: 'flex-wrap: wrap. Quando os itens não cabem, quebram para próxima linha. Sem isso, ficam todos na mesma e estouram.', color: '#f472b6' },
]

const FLEX_TRANSITIONS: SMTransition[] = [
  { from: 'row-start',   to: 'row-center',  event: 'justify-center',         code: 'justify-content: center;' },
  { from: 'row-center',  to: 'row-between', event: 'justify-between',        code: 'justify-content: space-between;' },
  { from: 'row-between', to: 'row-around',  event: 'justify-around',         code: 'justify-content: space-around;' },
  { from: 'row-around',  to: 'row-start',   event: 'justify-start',          code: 'justify-content: flex-start;' },
  { from: 'row-start',   to: 'col-stretch', event: 'direction: column',      code: 'flex-direction: column;\nalign-items: stretch;' },
  { from: 'col-stretch', to: 'col-center',  event: 'align-center',           code: 'align-items: center;' },
  { from: 'col-center',  to: 'row-start',   event: 'voltar p/ row',          code: 'flex-direction: row;\nalign-items: stretch;' },
  { from: 'row-start',   to: 'wrap',        event: 'wrap',                   code: 'flex-wrap: wrap;' },
  { from: 'wrap',        to: 'row-start',   event: 'nowrap',                 code: 'flex-wrap: nowrap;' },
  { from: 'col-stretch', to: 'wrap',        event: 'wrap (col)',             code: 'flex-direction: row;\nflex-wrap: wrap;' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Grid Playground (CodeStepper)
// ═══════════════════════════════════════════════════════════════════════════════

const GRID_SCENARIOS: CodeStepperScenario[] = [
  {
    id: 'grid-build',
    label: 'Construindo um Grid',
    language: 'css',
    code: `.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 100px 100px;
  gap: 1rem;
  grid-template-areas:
    "hero hero side"
    "a    b    side";
  place-items: center;
}

.gallery > .hero { grid-area: hero; }
.gallery > .side { grid-area: side; }
.gallery > .card-a { grid-column: span 1; }
`,
    steps: [
      {
        lineStart: 2,
        title: 'display: grid',
        explanation: 'Transforma o container em grid. Filhos diretos viram grid items e participam da grade — perdem comportamento block/inline padrão.',
        output: 'Layout virou grid (mas ainda 1 coluna)',
        memory: { 'display': 'grid' },
      },
      {
        lineStart: 3,
        title: 'grid-template-columns: repeat(3, 1fr)',
        explanation: 'Define 3 colunas iguais (1fr cada = 1 fração disponível). repeat() é atalho para evitar repetir "1fr 1fr 1fr". fr distribui o espaço RESTANTE depois de gaps e tamanhos fixos.',
        output: '3 colunas iguais',
        memory: { 'columns': '3 × 1fr', 'rows': 'auto' },
      },
      {
        lineStart: 4,
        title: 'grid-template-rows: 100px 100px',
        explanation: 'Define 2 linhas explícitas de 100px. Itens além desse limite criam tracks IMPLÍCITOS, controlados por grid-auto-rows.',
        output: '2 linhas de 100px (3 + 2 itens)',
        memory: { 'columns': '3 × 1fr', 'rows': '2 × 100px' },
      },
      {
        lineStart: 5,
        title: 'gap: 1rem',
        explanation: 'Espaço entre células — substitui margin nos filhos. row-gap e column-gap separam se quiser valores diferentes. Funciona em flex e grid.',
        output: 'Espaço de 1rem entre células',
        memory: { 'gap': '1rem' },
      },
      {
        lineStart: 6,
        lineEnd: 8,
        title: 'grid-template-areas',
        explanation: 'Nomeia regiões do grid de forma visual. Cada string = uma linha. Áreas com mesmo nome devem formar um retângulo. Use ponto (.) para célula vazia.',
        output: 'Hero ocupa 2 colunas, side ocupa 2 linhas',
        memory: { 'areas': '"hero hero side" / "a b side"' },
      },
      {
        lineStart: 9,
        title: 'place-items: center',
        explanation: 'Atalho para align-items + justify-items: center. Centraliza CONTEÚDO de cada célula (não as células). Para alinhar células dentro do grid, use place-content.',
        output: 'Conteúdo centralizado em cada célula',
        memory: { 'place-items': 'center' },
      },
      {
        lineStart: 12,
        title: 'grid-area: hero (no item)',
        explanation: 'O item .hero é colocado na área "hero" definida em grid-template-areas. Sem isso, ele iria para auto-placement (próxima célula livre).',
        output: '.hero ocupa as duas células do topo',
        memory: { '.hero': 'grid-area: hero' },
      },
      {
        lineStart: 14,
        title: 'grid-column: span 1 (ou span N)',
        explanation: 'Faz o item ocupar N colunas. span 2 = 2 colunas. Pode usar números absolutos: grid-column: 1 / 3 (linha 1 até 3, exclusivo). -1 = última linha.',
        output: 'Item span N colunas',
        memory: { '.card-a': 'grid-column: span 1' },
      },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — Especificidade (ComparisonTable)
// ═══════════════════════════════════════════════════════════════════════════════

const SPEC_OPTIONS: ComparisonOption[] = [
  { id: 'tag',     label: 'tag',           sublabel: 'div, span, h1', color: '#94a3b8' },
  { id: 'class',   label: 'class',         sublabel: '.btn, [type]',  color: SKY },
  { id: 'id',      label: 'id',            sublabel: '#header',       color: AMB },
  { id: 'inline',  label: 'inline',        sublabel: 'style="..."',   color: ORG },
  { id: 'imp',     label: '!important',    sublabel: 'override',      color: RED },
  { id: 'where',   label: ':where()',      sublabel: 'spec ZERO',     color: GRN },
]

const SPEC_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'spec',
    label: 'Especificidade',
    category: 'peso',
    description: 'Pontuação na pilha. Compare DA ESQUERDA para a direita.',
    values: {
      tag:    { rating: 'poor',      note: '(0,0,0,1) — base 1' },
      class:  { rating: 'fair',      note: '(0,0,1,0) — base 10' },
      id:     { rating: 'good',      note: '(0,1,0,0) — base 100' },
      inline: { rating: 'excellent', note: '(1,0,0,0) — base 1000' },
      imp:    { rating: 'excellent', note: 'fora da contagem — sempre vence' },
      where:  { rating: 'na',        note: '0 — não compete' },
    },
  },
  {
    id: 'usage',
    label: 'Uso recomendado',
    category: 'prática',
    description: 'Quando faz sentido usar.',
    values: {
      tag:    { rating: 'good',      note: 'Reset, base styles, reset de defaults' },
      class:  { rating: 'excellent', note: 'Padrão para componentes — preferir sempre' },
      id:     { rating: 'poor',      note: 'Evite — cada id é único, não reutilizável; alta especificidade trava overrides' },
      inline: { rating: 'fair',      note: 'Apenas para valores dinâmicos do JS' },
      imp:    { rating: 'poor',      note: 'Último recurso — gera dívida técnica. Use @layer.' },
      where:  { rating: 'excellent', note: 'Resets, polyfills, libraries — não competem com seu CSS' },
    },
  },
  {
    id: 'override',
    label: 'Facilidade de override',
    category: 'manutenção',
    description: 'Quão fácil é sobrescrever depois.',
    values: {
      tag:    { rating: 'excellent', note: 'Qualquer classe vence' },
      class:  { rating: 'good',      note: 'Outra classe na mesma layer com ordem posterior vence' },
      id:     { rating: 'poor',      note: 'Precisa de outro id ou !important' },
      inline: { rating: 'poor',      note: 'Só !important vence (ou alterando o JS)' },
      imp:    { rating: 'poor',      note: 'Só outro !important com layer/ordem maior' },
      where:  { rating: 'excellent', note: 'Qualquer regra real vence — feito justamente para isso' },
    },
  },
  {
    id: 'layer',
    label: 'Comportamento em @layer',
    category: 'cascade',
    description: 'Como se comporta dentro de @layer.',
    values: {
      tag:    { rating: 'excellent', note: 'Layer posterior ganha' },
      class:  { rating: 'excellent', note: 'Layer posterior ganha' },
      id:     { rating: 'good',      note: 'Layer posterior ainda ganha — @layer mata o problema do id' },
      inline: { rating: 'fair',      note: 'Inline está fora dos layers — sempre acima' },
      imp:    { rating: 'fair',      note: '!important INVERTE ordem dos layers — primeiro layer com !important ganha' },
      where:  { rating: 'na',        note: 'Não interfere — perde para qualquer regra normal' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — Anti-patterns CSS (AntiPatternsGallery)
// ═══════════════════════════════════════════════════════════════════════════════

const KW   = '#f87171'
const KWG  = '#86efac'
const STR  = '#fcd34d'
const PROP = '#7dd3fc'
const COMM = '#64748b'

const CSS_ANTIPATTERNS: AntiPattern[] = [
  {
    title: '!important para vencer especificidade',
    wrong: [
      [{ text: '.btn { ' }, { text: 'background', color: PROP }, { text: ': red ' }, { text: '!important', color: KW }, { text: '; }' }],
      [{ text: '.modal .btn { ' }, { text: 'background', color: PROP }, { text: ': blue ' }, { text: '!important', color: KW }, { text: '; }' }],
      [{ text: '/* guerra de !important infinita */', color: COMM }],
    ],
    right: [
      [{ text: '@layer components { ' }],
      [{ text: '  .btn { ' }, { text: 'background', color: PROP }, { text: ': ', color: KWG }, { text: 'red', color: STR }, { text: '; }' }],
      [{ text: '}' }],
      [{ text: '@layer overrides { ' }],
      [{ text: '  .modal .btn { ' }, { text: 'background', color: PROP }, { text: ': ', color: KWG }, { text: 'blue', color: STR }, { text: '; }' }],
      [{ text: '}' }],
    ],
    why: '!important cria dívida — cada override exige novo !important. @layer permite ordem explícita SEM brigar com especificidade. Layer posterior ganha sempre.',
  },
  {
    title: 'px fixo para font-size',
    wrong: [
      [{ text: 'body { ' }, { text: 'font-size', color: PROP }, { text: ': ', color: KW }, { text: '16px', color: STR }, { text: '; }' }],
      [{ text: 'h1 { ' }, { text: 'font-size', color: PROP }, { text: ': ', color: KW }, { text: '32px', color: STR }, { text: '; }' }],
      [{ text: '/* usuário muda zoom no browser → ignora */', color: COMM }],
    ],
    right: [
      [{ text: 'html { ' }, { text: 'font-size', color: PROP }, { text: ': ', color: KWG }, { text: '100%', color: STR }, { text: '; } /* respeita user prefs */', color: COMM }],
      [{ text: 'body { ' }, { text: 'font-size', color: PROP }, { text: ': ', color: KWG }, { text: '1rem', color: STR }, { text: '; }' }],
      [{ text: 'h1 { ' }, { text: 'font-size', color: PROP }, { text: ': ', color: KWG }, { text: 'clamp(1.5rem, 3vw, 2rem)', color: STR }, { text: '; }' }],
    ],
    why: 'rem se baseia no font-size do html. Usuário com baixa visão aumenta no browser → tudo escala. px ignora a preferência. clamp() dá tipografia fluida sem media query.',
  },
  {
    title: 'margin: 0 auto em flex container',
    wrong: [
      [{ text: '.container { ' }, { text: 'display', color: PROP }, { text: ': flex; }' }],
      [{ text: '.item {' }],
      [{ text: '  ' }, { text: 'margin', color: PROP }, { text: ': ', color: KW }, { text: '0 auto', color: STR }, { text: '; /* não centraliza */', color: COMM }],
      [{ text: '}' }],
    ],
    right: [
      [{ text: '.container {' }],
      [{ text: '  ' }, { text: 'display', color: PROP }, { text: ': ', color: KWG }, { text: 'flex', color: STR }, { text: ';' }],
      [{ text: '  ' }, { text: 'justify-content', color: PROP }, { text: ': ', color: KWG }, { text: 'center', color: STR }, { text: ';' }],
      [{ text: '}' }],
      [{ text: '/* OU usar logical: margin-inline: auto */', color: COMM }],
    ],
    why: 'margin: 0 auto centraliza em block normal. Em flex, use justify-content (eixo principal) e align-items (eixo cruzado). margin-inline: auto também funciona em flex.',
  },
  {
    title: 'Margem negativa para "colar" elementos',
    wrong: [
      [{ text: '.list .item:not(:last-child) {' }],
      [{ text: '  ' }, { text: 'margin-right', color: PROP }, { text: ': ', color: KW }, { text: '-1px', color: STR }, { text: '; /* elimina border duplo */', color: COMM }],
      [{ text: '}' }],
    ],
    right: [
      [{ text: '.list {' }],
      [{ text: '  ' }, { text: 'display', color: PROP }, { text: ': ', color: KWG }, { text: 'flex', color: STR }, { text: ';' }],
      [{ text: '  ' }, { text: 'gap', color: PROP }, { text: ': ', color: KWG }, { text: '0', color: STR }, { text: '; /* ou valor desejado */', color: COMM }],
      [{ text: '}' }],
      [{ text: '.item + .item { ' }, { text: 'border-left', color: PROP }, { text: ': ', color: KWG }, { text: '0', color: STR }, { text: '; }' }],
    ],
    why: 'Margens negativas quebram em RTL e wrap. gap em flex/grid é controle direto do espaçamento. Para borders duplos, use sibling selector + border: 0 lateral.',
  },
  {
    title: 'float para layout',
    wrong: [
      [{ text: '.sidebar { ' }, { text: 'float', color: PROP }, { text: ': ', color: KW }, { text: 'left', color: STR }, { text: '; ' }, { text: 'width', color: PROP }, { text: ': 200px; }' }],
      [{ text: '.main { ' }, { text: 'margin-left', color: PROP }, { text: ': ', color: KW }, { text: '200px', color: STR }, { text: '; }' }],
      [{ text: '.clearfix::after { content: ""; clear: both; display: block; }' }],
    ],
    right: [
      [{ text: '.layout {' }],
      [{ text: '  ' }, { text: 'display', color: PROP }, { text: ': ', color: KWG }, { text: 'grid', color: STR }, { text: ';' }],
      [{ text: '  ' }, { text: 'grid-template-columns', color: PROP }, { text: ': ', color: KWG }, { text: '200px 1fr', color: STR }, { text: ';' }],
      [{ text: '  ' }, { text: 'gap', color: PROP }, { text: ': ', color: KWG }, { text: '1rem', color: STR }, { text: ';' }],
      [{ text: '}' }],
    ],
    why: 'float foi feito para texto fluindo em volta de imagens. Hijackearam para layout antes do flex/grid. Grid é declarativo, mantém ordem semântica e suporta gap nativo.',
  },
  {
    title: 'Seletores super-específicos',
    wrong: [
      [{ text: 'div.container > ul.list > li.item > a.link {' }],
      [{ text: '  ' }, { text: 'color', color: PROP }, { text: ': ', color: KW }, { text: 'red', color: STR }, { text: ';' }],
      [{ text: '}' }],
      [{ text: '/* especificidade (0,0,4,4) — quase impossível override */', color: COMM }],
    ],
    right: [
      [{ text: '.link {' }],
      [{ text: '  ' }, { text: 'color', color: PROP }, { text: ': ', color: KWG }, { text: 'red', color: STR }, { text: ';' }],
      [{ text: '}' }],
      [{ text: '/* especificidade (0,0,1,0) — fácil de override */', color: COMM }],
    ],
    why: 'Aninhamento profundo amarra o CSS à estrutura HTML. Mudou o HTML, quebrou o CSS. Use uma única classe semântica — BEM ou utility-first. Especificidade baixa, override trivial.',
  },
  {
    title: '@media com max-width (desktop-first)',
    wrong: [
      [{ text: '/* desktop padrão, mobile via max-width */', color: COMM }],
      [{ text: '.card { ' }, { text: 'display', color: PROP }, { text: ': ', color: KW }, { text: 'flex', color: STR }, { text: '; }' }],
      [{ text: '@media (' }, { text: 'max-width', color: KW }, { text: ': 768px) {' }],
      [{ text: '  .card { ' }, { text: 'display', color: PROP }, { text: ': block; }' }],
      [{ text: '}' }],
    ],
    right: [
      [{ text: '/* mobile padrão, desktop via min-width */', color: COMM }],
      [{ text: '.card { ' }, { text: 'display', color: PROP }, { text: ': ', color: KWG }, { text: 'block', color: STR }, { text: '; }' }],
      [{ text: '@media (' }, { text: 'min-width', color: KWG }, { text: ': 768px) {' }],
      [{ text: '  .card { ' }, { text: 'display', color: PROP }, { text: ': flex; }' }],
      [{ text: '}' }],
    ],
    why: 'Mobile-first é padrão moderno: layout simples cresce com min-width. Garante experiência rápida em mobile (a maioria do tráfego) e simplifica a cascata progressivamente.',
  },
  {
    title: 'CSS global sem @layer',
    wrong: [
      [{ text: '/* main.css — biblioteca + projeto misturados */', color: COMM }],
      [{ text: '@import ' }, { text: '"library.css"', color: STR }, { text: ';' }],
      [{ text: '.btn { ' }, { text: 'color', color: PROP }, { text: ': ', color: KW }, { text: 'red !important', color: STR }, { text: '; }' }],
      [{ text: '/* lib sobrescreve, projeto vira war zone */', color: COMM }],
    ],
    right: [
      [{ text: '@layer reset, vendor, base, components, utilities;' }],
      [{ text: '@import ' }, { text: '"library.css"', color: STR }, { text: ' layer(vendor);' }],
      [{ text: '@layer components {' }],
      [{ text: '  .btn { ' }, { text: 'color', color: PROP }, { text: ': ', color: KWG }, { text: 'red', color: STR }, { text: '; /* sem !important */', color: COMM }],
      [{ text: '}' }],
    ],
    why: 'Sem layers, biblioteca e projeto competem por especificidade. @layer impõe ordem explícita: vendor sempre perde para components, mesmo com seletor mais específico.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 7 — Flexbox vs Grid (ProConMatrix)
// ═══════════════════════════════════════════════════════════════════════════════

const FG_OPTIONS: ProConOption[] = [
  {
    id: 'flex',
    label: 'Flexbox',
    sublabel: '1D — linha OU coluna',
    color: SKY,
    pros: [
      { text: 'Distribuição linear em uma direção', weight: 'high' },
      { text: 'Tamanho dinâmico sem precisar definir tracks', weight: 'high' },
      { text: 'Reordenação visual com order', weight: 'medium' },
      { text: 'Alinhamento simples com justify/align', weight: 'high' },
      { text: 'flex-wrap para responsivo automático', weight: 'medium' },
      { text: 'Excelente para componentes UI (navbar, toolbar)', weight: 'high', context: ['componentes'] },
    ],
    cons: [
      { text: 'Não alinha entre LINHAS independentes', weight: 'high' },
      { text: 'Sem template areas — layout complexo vira código verboso', weight: 'medium' },
      { text: 'Não suporta overlapping intencional', weight: 'medium' },
      { text: 'Cada linha é independente — alturas variam', weight: 'medium', context: ['layout 2D'] },
    ],
    bestFor: ['navbars', 'toolbars', 'lista 1D', 'centralizar', 'wrap responsivo'],
    avoidWhen: ['layout 2D', 'alinhar entre linhas', 'overlapping'],
  },
  {
    id: 'grid',
    label: 'CSS Grid',
    sublabel: '2D — linhas E colunas',
    color: PRP,
    pros: [
      { text: 'Layout 2D — colunas e linhas simultâneas', weight: 'high' },
      { text: 'grid-template-areas — layout legível', weight: 'high' },
      { text: 'Alinhamento entre cards/células de linhas diferentes', weight: 'high' },
      { text: 'subgrid para alinhar elementos internos entre cards', weight: 'high', context: ['cards'] },
      { text: 'Overlapping com grid-area + z-index', weight: 'medium' },
      { text: 'auto-fit/auto-fill para layouts responsivos', weight: 'high' },
    ],
    cons: [
      { text: 'Mais verboso para casos simples 1D', weight: 'medium' },
      { text: 'Aprendizado mais íngreme', weight: 'medium' },
      { text: 'subgrid suporte só desde 2022 (Safari) e 2023 (Chrome)', weight: 'low' },
      { text: 'masonry ainda em draft', weight: 'low', context: ['layout especial'] },
    ],
    bestFor: ['layout de página', 'dashboards', 'galerias', 'cards alinhados', 'template areas'],
    avoidWhen: ['1D simples', 'navbar curta', 'lista linear'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL — Stacking Context 3D (LayerStack repurposed)
// ═══════════════════════════════════════════════════════════════════════════════

const STACKING_LAYERS: Layer[] = [
  {
    id: 'root',
    label: 'Contexto raiz (html)',
    sublabel: 'Stacking context base',
    description: 'O elemento html é a raiz do stacking context global. Tudo na página vive dentro dele. z-index aqui compete com qualquer elemento direto do body que não esteja dentro de outro contexto.',
    examples: ['html é sempre raiz', 'body é o primeiro filho', 'Sem position, z-index não funciona'],
    color: '#64748b',
    icon: '🌍',
  },
  {
    id: 'pos-z',
    label: 'position + z-index',
    sublabel: 'O gatilho clássico',
    description: 'Qualquer elemento com position diferente de static (relative, absolute, fixed, sticky) E com z-index diferente de auto cria um novo stacking context. Filhos competem entre si dentro deste contexto, isolados do mundo externo.',
    code: `.dropdown {
  position: relative;
  z-index: 10;
  /* novo stacking context */
}`,
    color: SKY,
    icon: '📦',
  },
  {
    id: 'opacity',
    label: 'opacity < 1',
    sublabel: 'Trigger silencioso',
    description: 'opacity menor que 1 cria stacking context AUTOMATICAMENTE — sem precisar de position. Bug clássico: card com opacity: 0.99 (animação de fade) prende o modal filho. Profissional reconhece que opacity isola.',
    code: `.fade-card {
  opacity: 0.95;
  /* SEM querer, criou contexto */
}
.modal-inside {
  position: fixed;
  z-index: 9999; /* não escapa! */
}`,
    color: AMB,
    icon: '👻',
  },
  {
    id: 'transform',
    label: 'transform / filter',
    sublabel: 'O bug do modal preso',
    description: 'transform, filter, perspective, backdrop-filter (qualquer valor diferente de none) criam stacking context. É o motivo número 1 de "modal com z-index 9999 atrás de outro elemento". Procure ancestrais com transform.',
    code: `.parent {
  transform: scale(1);
  /* contexto criado! */
}
.modal {
  position: fixed;
  z-index: 9999;
  /* preso dentro de .parent */
}`,
    color: RED,
    icon: '🚫',
  },
  {
    id: 'isolate',
    label: 'isolation: isolate',
    sublabel: 'A solução elegante',
    description: 'Criada justamente para isso: cria stacking context SEM efeito visual. Use em cards, components reutilizáveis para isolar z-index interno do externo. Não distorce, não muda opacidade, só isola.',
    code: `.card {
  isolation: isolate;
  /* contexto limpo */
  /* z-index interno não vaza */
}`,
    color: GRN,
    icon: '🛡️',
  },
  {
    id: 'flex-grid',
    label: 'flex/grid + z-index',
    sublabel: 'Filhos com z-index',
    description: 'Filhos diretos de flex ou grid containers com z-index criam stacking context — mesmo sem position! Útil para sobrepor itens em grid (banners, badges) sem precisar de position absolute.',
    code: `.grid {
  display: grid;
}
.banner {
  grid-area: 1 / 1 / -1 / -1;
  z-index: 1; /* contexto criado */
}`,
    color: PRP,
    icon: '🔢',
  },
  {
    id: 'fixed-sticky',
    label: 'position: fixed/sticky',
    sublabel: 'Sempre criam contexto',
    description: 'fixed e sticky SEMPRE criam stacking context — mesmo sem z-index. Por isso modais e headers fixos podem competir entre si. Para empilhar manualmente, use z-index explícito.',
    examples: ['header fixo + modal fixo', 'sticky tabs + sticky header', 'Use z-index para ordem explícita'],
    color: ORG,
    icon: '📌',
  },
  {
    id: 'will-change',
    label: 'will-change',
    sublabel: 'Promessa de mudança',
    description: 'will-change: transform, will-change: opacity (ou qualquer prop que cria contexto) criam stacking context ANTECIPADAMENTE. Use com cuidado — promove para layer GPU e cria contexto desnecessário se aplicado em todo lugar.',
    code: `.about-to-animate {
  will-change: transform;
  /* contexto + GPU layer */
}`,
    color: '#f472b6',
    icon: '⚡',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 10 — Unidades Comparadas (ConceptCarousel)
// ═══════════════════════════════════════════════════════════════════════════════

function SlidePxAbsolute() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', justifyContent: 'center', height: 240 }}>
      <div style={{ display: 'flex', gap: 18, alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 16, height: 16, background: SKY, borderRadius: 2 }} />
          <div style={{ fontSize: 10, color: SKY, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>16px</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 32, height: 32, background: SKY, borderRadius: 2 }} />
          <div style={{ fontSize: 10, color: SKY, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>32px</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 64, height: 64, background: SKY, borderRadius: 2 }} />
          <div style={{ fontSize: 10, color: SKY, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>64px</div>
        </div>
      </div>
      <div style={{ fontSize: 11, color: FGMUTE, textAlign: 'center', maxWidth: 380, lineHeight: 1.6 }}>
        <strong style={{ color: SKY }}>px</strong> é absoluto — sempre o mesmo tamanho. Ignora zoom acessível do browser. Bom para borders, shadows. Ruim para tipografia.
      </div>
    </div>
  )
}

function SlideEmRem() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', justifyContent: 'center', height: 240 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, width: '100%' }}>
        <div style={{ background: CARD, padding: 12, borderRadius: 8, border: `1px solid ${LINE}` }}>
          <div style={{ fontSize: 9, color: AMB, fontWeight: 700, marginBottom: 6 }}>EM — relativo ao PAI</div>
          <div style={{ fontSize: 10, color: FGMUTE, lineHeight: 1.7, fontFamily: "'JetBrains Mono', monospace" }}>
            <div>html {'{'} font-size: 16px {'}'}</div>
            <div>.outer {'{'} font-size: <span style={{ color: AMB }}>2em</span> {'}'}<span style={{ color: '#64748b' }}> /* 32px */</span></div>
            <div>.inner {'{'} font-size: <span style={{ color: AMB }}>2em</span> {'}'}<span style={{ color: '#64748b' }}> /* 64px! */</span></div>
            <div style={{ color: RED, marginTop: 6 }}>⚠ COMPOUNDS</div>
          </div>
        </div>
        <div style={{ background: CARD, padding: 12, borderRadius: 8, border: `1px solid ${GRN}40` }}>
          <div style={{ fontSize: 9, color: GRN, fontWeight: 700, marginBottom: 6 }}>REM — relativo ao HTML</div>
          <div style={{ fontSize: 10, color: FGMUTE, lineHeight: 1.7, fontFamily: "'JetBrains Mono', monospace" }}>
            <div>html {'{'} font-size: 16px {'}'}</div>
            <div>.outer {'{'} font-size: <span style={{ color: GRN }}>2rem</span> {'}'}<span style={{ color: '#64748b' }}> /* 32px */</span></div>
            <div>.inner {'{'} font-size: <span style={{ color: GRN }}>2rem</span> {'}'}<span style={{ color: '#64748b' }}> /* 32px */</span></div>
            <div style={{ color: GRN, marginTop: 6 }}>✓ Previsível</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SlideViewport() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', justifyContent: 'center', height: 240 }}>
      <div style={{
        background: CARD, border: `2px solid ${PRP}`, borderRadius: 6,
        width: 280, height: 90, position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: '50%', height: '50%', background: `${PRP}40`, border: `1px solid ${PRP}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: PRP, fontWeight: 700, fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
        }}>50vw × 50vh</div>
        <div style={{ position: 'absolute', top: 4, left: 8, fontSize: 9, color: FGMUTE, fontFamily: "'JetBrains Mono', monospace" }}>VIEWPORT</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 10, color: FGMUTE, lineHeight: 1.6, fontFamily: "'JetBrains Mono', monospace" }}>
        <div><strong style={{ color: PRP }}>vw/vh</strong> — % da viewport (1vw = 1% largura)</div>
        <div><strong style={{ color: PRP }}>vmin/vmax</strong> — menor/maior dimensão</div>
        <div><strong style={{ color: PRP }}>svh/lvh/dvh</strong> — small/large/dynamic (mobile address bar)</div>
        <div><strong style={{ color: PRP }}>cqw/cqh</strong> — % do container (com container-type)</div>
      </div>
    </div>
  )
}

function SlidePercentChars() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', justifyContent: 'center', height: 240 }}>
      <div style={{ background: CARD, padding: 14, borderRadius: 8, border: `1px solid ${LINE}`, width: '90%', maxWidth: 420 }}>
        <div style={{ fontSize: 9, color: ORG, fontWeight: 700, marginBottom: 8, letterSpacing: '.1em' }}>% — RELATIVO AO PAI</div>
        <div style={{ fontSize: 10, color: FGMUTE, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.7 }}>
          <div>.parent {'{'} width: 600px {'}'}</div>
          <div>.child {'{'} width: <span style={{ color: ORG }}>50%</span> {'}'}<span style={{ color: '#64748b' }}> /* = 300px */</span></div>
          <div style={{ color: RED, marginTop: 6 }}>⚠ height: 50% só funciona se PAI tiver height fixo</div>
        </div>
      </div>
      <div style={{ background: CARD, padding: 14, borderRadius: 8, border: `1px solid ${GRN}40`, width: '90%', maxWidth: 420 }}>
        <div style={{ fontSize: 9, color: GRN, fontWeight: 700, marginBottom: 8, letterSpacing: '.1em' }}>CH/EX — RELATIVOS À FONTE</div>
        <div style={{ fontSize: 10, color: FGMUTE, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.7 }}>
          <div>p {'{'} max-width: <span style={{ color: GRN }}>65ch</span> {'}'}<span style={{ color: '#64748b' }}> /* leitura confortável */</span></div>
          <div>icon {'{'} height: <span style={{ color: GRN }}>1ex</span> {'}'}<span style={{ color: '#64748b' }}> /* altura do x */</span></div>
        </div>
      </div>
    </div>
  )
}

function SlideClampUnits() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', justifyContent: 'center', height: 240 }}>
      <div style={{
        background: CARD, padding: 16, borderRadius: 8, border: `2px solid ${C}`,
        width: '95%', maxWidth: 460,
      }}>
        <div style={{ fontSize: 9, color: C, fontWeight: 700, marginBottom: 10, letterSpacing: '.1em' }}>CLAMP — TIPOGRAFIA FLUIDA</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: FGMUTE, lineHeight: 1.8 }}>
          <div><span style={{ color: SKY }}>font-size</span>: <span style={{ color: C }}>clamp</span>(</div>
          <div style={{ paddingLeft: 16 }}>
            <span style={{ color: GRN }}>1rem</span><span style={{ color: '#64748b' }}>,        /* mínimo */</span>
          </div>
          <div style={{ paddingLeft: 16 }}>
            <span style={{ color: PRP }}>2.5vw + 0.5rem</span><span style={{ color: '#64748b' }}>,  /* fluido */</span>
          </div>
          <div style={{ paddingLeft: 16 }}>
            <span style={{ color: GRN }}>2rem</span><span style={{ color: '#64748b' }}>         /* máximo */</span>
          </div>
          <div>)</div>
        </div>
      </div>
      <div style={{ fontSize: 11, color: FGMUTE, textAlign: 'center', maxWidth: 420, lineHeight: 1.6 }}>
        <strong style={{ color: C }}>clamp(min, ideal, max)</strong> escala suavemente — sem media query. Ideal: tipografia, espaçamentos, cards.
      </div>
    </div>
  )
}

const UNITS_SLIDES: Slide[] = [
  {
    title: 'px — absoluto e fixo',
    paragraphs: [
      'px é a unidade absoluta — 16px é sempre 16px, ignora zoom acessível do browser.',
      'Use para: borders (1px sharp), box-shadow, valores que não devem escalar.',
      'Evite em font-size — usuário com baixa visão aumenta zoom no browser e seu texto não escala.',
    ],
    gradient: [SKY, PRP],
    illustration: <SlidePxAbsolute />,
  },
  {
    title: 'em vs rem — herança vs raiz',
    paragraphs: [
      'em é relativo ao font-size do PAI. COMPOUNDS — aninhar 2em dentro de 2em vira 4em.',
      'rem é relativo ao font-size do html (raiz). Previsível, NÃO compounda.',
      'Padrão moderno: rem para tipografia e espaçamento, em apenas dentro de componentes que devem escalar com o pai.',
    ],
    gradient: [AMB, GRN],
    illustration: <SlideEmRem />,
  },
  {
    title: 'vw / vh / svh / dvh — viewport',
    paragraphs: [
      'vw/vh são % da viewport visível. 100vw = largura total, 100vh = altura total.',
      'svh/lvh/dvh resolvem o bug clássico do mobile com address bar — small (sem barra), large (com barra), dynamic (anima).',
      'cqw/cqh respondem ao container (precisa container-type: inline-size).',
    ],
    gradient: [PRP, '#f472b6'],
    illustration: <SlideViewport />,
  },
  {
    title: '% e ch — relativos especiais',
    paragraphs: [
      '% é relativo ao PAI — width: 50% = metade do pai. Já height: 50% só funciona se pai tem height fixo.',
      'ch é a largura do caractere "0" — 65ch é a medida ideal para texto legível.',
      'ex é a altura do "x" minúsculo — útil para alinhar ícones com texto.',
    ],
    gradient: [ORG, GRN],
    illustration: <SlidePercentChars />,
  },
  {
    title: 'clamp() — fluido sem media',
    paragraphs: [
      'clamp(min, ideal, max) define um valor fluido com limites superior e inferior.',
      'O ideal geralmente combina rem + vw: clamp(1rem, 2.5vw + 0.5rem, 2rem).',
      'Aplica em font-size, padding, gap — escala suave sem precisar de @media.',
    ],
    gradient: [C, SKY],
    illustration: <SlideClampUnits />,
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 11 — Pseudo-classes Modernas (FeaturesCarousel)
// ═══════════════════════════════════════════════════════════════════════════════

const MODERN_SELECTORS: Feature[] = [
  {
    tag: ':has()',
    name: ':has() — pai',
    color: GRN,
    beforeLabel: 'ANTES (com JS)',
    afterLabel: 'DEPOIS (CSS puro)',
    before: `// Detectar pai com filho img
document.querySelectorAll('.card').forEach(card => {
  if (card.querySelector('img')) {
    card.classList.add('card--with-image')
  }
})

// CSS dependia da classe extra
.card--with-image {
  display: grid;
  grid-template-columns: 200px 1fr;
}`,
    after: `/* Sem JS — CSS detecta pai com img */
.card:has(img) {
  display: grid;
  grid-template-columns: 200px 1fr;
}

/* Combinações poderosas */
.form:has(input:invalid) button {
  opacity: 0.5;
}

article:has(> h2 + p) { margin-block: 2rem; }`,
    desc: ':has() é o seletor de pai que CSS sempre faltou. Suporte total desde 2023 (Safari 15.4, Chrome 105, Firefox 121). Substitui dezenas de linhas de JavaScript em casos como "card com imagem", "form com erro", "lista vazia".',
  },
  {
    tag: ':is() :where()',
    name: ':is() vs :where()',
    color: SKY,
    beforeLabel: 'VERBOSO',
    afterLabel: 'AGRUPADO',
    before: `/* Repetir o mesmo seletor */
header h1, header h2, header h3,
header h4, header h5, header h6 {
  font-family: 'Display', sans-serif;
}

main h1, main h2, main h3,
main h4, main h5, main h6 {
  font-family: 'Display', sans-serif;
}`,
    after: `/* Agrupado com :is() */
:is(header, main) :is(h1,h2,h3,h4,h5,h6) {
  font-family: 'Display', sans-serif;
}

/* :where() = especificidade ZERO */
:where(h1,h2,h3) {
  margin: 0; /* override trivial */
}

/* :is() = maior especificidade do grupo */
:is(.theme-dark, [data-theme="dark"]) .btn {
  background: #0f172a;
}`,
    desc: ':is() agrupa seletores e usa a MAIOR especificidade dos argumentos. :where() faz o mesmo mas com especificidade ZERO — perfeito para resets e bibliotecas que não devem competir com o CSS do projeto.',
  },
  {
    tag: ':not()',
    name: ':not() — exclusão',
    color: AMB,
    beforeLabel: 'SEM :not()',
    afterLabel: 'COM :not()',
    before: `/* Aplicar a todos depois resetar último */
.list .item {
  border-bottom: 1px solid #ccc;
  padding-block: 1rem;
}

.list .item:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}`,
    after: `/* Direto ao ponto */
.list .item:not(:last-child) {
  border-bottom: 1px solid #ccc;
  padding-bottom: 1rem;
}

/* Múltiplos argumentos (CSS4) */
.btn:not(.disabled, .loading, [disabled]) {
  cursor: pointer;
}`,
    desc: ':not() exclui elementos do match. Suporta múltiplos argumentos desde 2022 — :not(.a, .b, .c). Especificidade vem do argumento mais pesado. Use para evitar overrides desnecessários.',
  },
  {
    tag: ':focus-visible',
    name: ':focus-visible — a11y',
    color: PRP,
    beforeLabel: 'PROBLEMA',
    afterLabel: 'SOLUÇÃO',
    before: `/* Outline em qualquer foco — ruim no mouse */
.btn:focus {
  outline: 2px solid blue;
}

/* Outline some pra todo mundo — ruim no teclado */
.btn:focus {
  outline: none;
}

/* Acessibilidade quebrada */`,
    after: `/* Outline só quando navegação é por teclado */
.btn:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

/* Mouse não vê outline, teclado SEMPRE vê */
.btn:focus:not(:focus-visible) {
  outline: none;
}`,
    desc: ':focus-visible aplica estilo APENAS quando o browser detecta navegação por teclado (Tab, setas). Resolve o conflito histórico entre "outline feio no clique" e "acessibilidade do teclado". Padrão moderno em design systems.',
  },
  {
    tag: ':nth-* moderno',
    name: ':nth-child(of S)',
    color: '#f472b6',
    beforeLabel: 'CSS 3 (limitado)',
    afterLabel: 'CSS 4 (poderoso)',
    before: `/* Pegar o 3º .card era impossível */
/* :nth-child(3) pega o 3º filho — qualquer tag */

.list :nth-child(3) {
  /* pega 3º item, mesmo que seja <hr> */
  background: yellow;
}

/* Filtragem só em JS */`,
    after: `/* Pega o 3º .card específico */
.list :nth-child(3 of .card) {
  background: yellow;
}

/* Combinado com :has() */
.list :nth-child(odd of :has(img)) {
  background: gray;
}

/* Range com :nth-child(an+b) */
.list :nth-child(n+5):nth-child(-n+10) {
  /* itens do 5 ao 10 */
}`,
    desc: ':nth-child(N of selector) permite filtrar antes de contar. Antes só dava para pegar "3º filho", agora "3º filho que match X". Combinado com :has(), substitui muitas queries JS sobre listas.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 12 — Container vs Media Queries (FeaturesCarousel)
// ═══════════════════════════════════════════════════════════════════════════════

const QUERIES_COMPARISON: Feature[] = [
  {
    tag: 'CASO REAL',
    name: 'Card em sidebar vs main',
    color: PRP,
    beforeLabel: 'MEDIA QUERY (limitado)',
    afterLabel: 'CONTAINER QUERY (correto)',
    before: `/* Layout depende da VIEWPORT */
.card { display: block }

@media (min-width: 768px) {
  .card {
    display: grid;
    grid-template-columns: 200px 1fr;
  }
}

/* Mas o card está numa SIDEBAR de 240px! */
/* No desktop, a media query ATIVA mas */
/* o card não tem espaço — quebra layout */`,
    after: `/* Container declara o tipo */
.card-container { container-type: inline-size; }

/* Card responde ao SEU container, não ao viewport */
.card { display: block }

@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 200px 1fr;
  }
}

/* Card vira horizontal em main (800px) */
/* Card fica vertical em sidebar (240px) */`,
    desc: 'Mesmo componente, contextos diferentes. Antes precisava prop ou classe extra. Container queries permitem que o componente seja AUTÔNOMO — responde ao espaço disponível, independente da viewport.',
  },
  {
    tag: 'WHEN MEDIA',
    name: 'Decisões de página',
    color: SKY,
    beforeLabel: 'MEDIA — quando usar',
    afterLabel: 'EXEMPLO',
    before: `Use @media para:

• Mudar layout GLOBAL da página
• Empilhar sidebar em mobile
• Mudar grid template do app inteiro
• Decisões baseadas em DEVICE
  - prefers-color-scheme: dark
  - prefers-reduced-motion
  - hover (mouse vs touch)
  - pointer (fine vs coarse)`,
    after: `/* Layout global da página */
.app {
  display: grid;
  grid-template-areas: "main" "side" "foot";
}

@media (min-width: 1024px) {
  .app {
    grid-template-areas:
      "side main"
      "side foot";
    grid-template-columns: 240px 1fr;
  }
}

/* Decisão de DEVICE, não de componente */`,
    desc: 'Media queries continuam sendo a ferramenta certa para decisões globais e baseadas em capacidades do dispositivo. Não foram substituídas — foram complementadas. Use para layout macro, color-scheme, reduced-motion.',
  },
  {
    tag: 'WHEN CONTAINER',
    name: 'Componentes autônomos',
    color: GRN,
    beforeLabel: 'CONTAINER — quando usar',
    afterLabel: 'EXEMPLO',
    before: `Use @container para:

• Componentes reutilizáveis
• Card que adapta ao espaço
• Widget em diferentes regiões
• Library/design system

Vantagens:
✓ Componente verdadeiramente reutilizável
✓ Sem prop drilling para size variants
✓ Sem JS de ResizeObserver`,
    after: `/* Container declarado no PAI */
.product-grid {
  container-type: inline-size;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

/* Card responde ao card-grid */
@container (min-width: 480px) {
  .product-card {
    display: grid;
    grid-template-columns: 120px 1fr;
  }
}

/* Mesmo card em qualquer página, qualquer largura */`,
    desc: 'Container queries são para decisões DO COMPONENTE. Bibliotecas (Material 3, IBM Carbon, Adobe Spectrum) já adotaram. O componente fica isolado da viewport — pode ir em sidebar, modal, main sem precisar de prop "size".',
  },
  {
    tag: 'UNIDADES',
    name: 'cqw/cqh/cqi/cqb',
    color: AMB,
    beforeLabel: 'VW/VH (viewport)',
    afterLabel: 'CQW/CQH (container)',
    before: `/* font-size baseado no viewport */
.title {
  font-size: 4vw;
  /* Em sidebar 240px ou viewport 1920px, */
  /* sempre vinculado ao viewport */
  /* Não tem como ajustar no componente */
}`,
    after: `/* font-size baseado no container */
.product-grid {
  container-type: inline-size;
}

.title {
  font-size: 4cqw;
  /* 4% da largura do container */
  /* Sidebar pequena → fonte pequena */
  /* Main larga → fonte grande */
  /* SEM media query */
}

/* cqi/cqb seguem direção do writing-mode */`,
    desc: 'cqw, cqh, cqi (inline), cqb (block) são % do container — análogas a vw/vh mas relativas ao container query parent. Combinadas com clamp(), permitem tipografia fluida que responde ao componente, não à página.',
  },
  {
    tag: 'GOTCHAS',
    name: 'Limitações',
    color: RED,
    beforeLabel: 'CUIDADOS',
    afterLabel: 'WORKAROUNDS',
    before: `Limitações de container queries:

• container-type: inline-size cria
  CONTAINMENT — afeta layout

• position: fixed dentro de um
  container vai para o container,
  não para o viewport

• Não pode aplicar @container no
  próprio container — só nos filhos

• container-name é opcional mas
  ajuda quando há aninhamento`,
    after: `/* Containment afeta width/height */
.container {
  container-type: inline-size;
  /* width agora é dependente do contexto */
}

/* Para fixed funcionar normal */
.modal {
  position: fixed;
  /* Mover para body via React Portal */
}

/* Aninhamento com nomes */
.outer { container: outer / inline-size; }
.inner { container: inner / inline-size; }

@container outer (min-width: 600px) { ... }
@container inner (min-width: 300px) { ... }`,
    desc: 'Container queries têm gotchas: criam containment (afeta cálculo de width), interferem em position fixed dentro deles. Use container-name em aninhamento e portal para modais que precisam viewport.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 13 — Animações & Easing (ConceptCarousel)
// ═══════════════════════════════════════════════════════════════════════════════

function SlideTransition() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', justifyContent: 'center', height: 240 }}>
      <div style={{
        background: CARD, padding: 14, borderRadius: 8, border: `1px solid ${LINE}`,
        width: '95%', maxWidth: 460, fontFamily: "'JetBrains Mono', monospace",
      }}>
        <div style={{ fontSize: 9, color: SKY, fontWeight: 700, marginBottom: 8, letterSpacing: '.1em' }}>SINTAXE TRANSITION</div>
        <div style={{ fontSize: 11, color: FGMUTE, lineHeight: 1.8 }}>
          <div><span style={{ color: '#7dd3fc' }}>transition</span>: <span style={{ color: '#86efac' }}>property duration timing-function delay</span>;</div>
          <div style={{ marginTop: 6 }}><span style={{ color: '#64748b' }}>// exemplos</span></div>
          <div><span style={{ color: '#7dd3fc' }}>transition</span>: <span style={{ color: '#86efac' }}>all 200ms ease</span>;</div>
          <div><span style={{ color: '#7dd3fc' }}>transition</span>: <span style={{ color: '#86efac' }}>transform 300ms cubic-bezier(.4,0,.2,1)</span>;</div>
          <div><span style={{ color: '#7dd3fc' }}>transition</span>: <span style={{ color: '#86efac' }}>opacity 150ms, transform 300ms</span>;</div>
        </div>
      </div>
      <div style={{ fontSize: 10.5, color: FGMUTE, textAlign: 'center', maxWidth: 420, lineHeight: 1.6 }}>
        Anima MUDANÇAS DE ESTADO (hover, focus, class). Use <code style={{ color: SKY }}>transform</code> e <code style={{ color: SKY }}>opacity</code> — gratuitos no compositor.
      </div>
    </div>
  )
}

function SlideEasing() {
  const easings = [
    { name: 'linear', curve: 'M0,40 L100,0', col: '#94a3b8', desc: 'sem aceleração' },
    { name: 'ease', curve: 'M0,40 C25,40 50,0 100,0', col: SKY, desc: 'padrão CSS' },
    { name: 'ease-in', curve: 'M0,40 C40,40 60,40 100,0', col: GRN, desc: 'devagar → rápido' },
    { name: 'ease-out', curve: 'M0,40 C0,0 40,0 100,0', col: AMB, desc: 'rápido → devagar (UI ideal)' },
    { name: 'ease-in-out', curve: 'M0,40 C30,40 70,0 100,0', col: PRP, desc: 'simétrico' },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center', justifyContent: 'center', height: 240, padding: '0 12px' }}>
      {easings.map(e => (
        <div key={e.name} style={{
          display: 'grid', gridTemplateColumns: '90px 110px 1fr',
          alignItems: 'center', gap: 10, width: '100%', maxWidth: 460,
        }}>
          <div style={{ fontSize: 10, color: e.col, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{e.name}</div>
          <svg width="110" height="40" viewBox="0 0 100 40" style={{ background: BG, borderRadius: 4 }}>
            <path d={e.curve} stroke={e.col} strokeWidth="2" fill="none" />
          </svg>
          <div style={{ fontSize: 10, color: FGMUTE }}>{e.desc}</div>
        </div>
      ))}
      <div style={{ fontSize: 10, color: FGMUTE, textAlign: 'center', marginTop: 6, fontStyle: 'italic' }}>
        cubic-bezier(.4,0,.2,1) é o "Material standard" — natural para UI.
      </div>
    </div>
  )
}

function SlideKeyframes() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', justifyContent: 'center', height: 240 }}>
      <div style={{
        background: CARD, padding: 14, borderRadius: 8, border: `1px solid ${LINE}`,
        width: '95%', maxWidth: 460, fontFamily: "'JetBrains Mono', monospace",
      }}>
        <div style={{ fontSize: 9, color: GRN, fontWeight: 700, marginBottom: 8, letterSpacing: '.1em' }}>@KEYFRAMES + ANIMATION</div>
        <div style={{ fontSize: 10.5, color: FGMUTE, lineHeight: 1.8 }}>
          <div><span style={{ color: '#7dd3fc' }}>@keyframes</span> <span style={{ color: '#fbbf24' }}>fadeUp</span> {'{'}</div>
          <div style={{ paddingLeft: 12 }}><span style={{ color: '#86efac' }}>from</span> {'{'} opacity: 0; transform: translateY(20px); {'}'}</div>
          <div style={{ paddingLeft: 12 }}><span style={{ color: '#86efac' }}>to</span>   {'{'} opacity: 1; transform: translateY(0); {'}'}</div>
          <div>{'}'}</div>
          <div style={{ marginTop: 8 }}>.card {'{'}</div>
          <div style={{ paddingLeft: 12 }}><span style={{ color: '#7dd3fc' }}>animation</span>: <span style={{ color: '#86efac' }}>fadeUp 400ms ease-out</span>;</div>
          <div>{'}'}</div>
        </div>
      </div>
      <div style={{ fontSize: 10, color: FGMUTE, textAlign: 'center', maxWidth: 420, lineHeight: 1.6 }}>
        animation: <code style={{ color: SKY }}>name duration easing delay iteration direction fill-mode</code>
      </div>
    </div>
  )
}

function SlideScrollDriven() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', justifyContent: 'center', height: 240 }}>
      <div style={{
        background: CARD, padding: 14, borderRadius: 8, border: `1px solid ${PRP}`,
        width: '95%', maxWidth: 460, fontFamily: "'JetBrains Mono', monospace",
      }}>
        <div style={{ fontSize: 9, color: PRP, fontWeight: 700, marginBottom: 8, letterSpacing: '.1em' }}>SCROLL-DRIVEN — SEM JS</div>
        <div style={{ fontSize: 10.5, color: FGMUTE, lineHeight: 1.8 }}>
          <div><span style={{ color: '#64748b' }}>/* progress bar do scroll */</span></div>
          <div>.progress {'{'}</div>
          <div style={{ paddingLeft: 12 }}><span style={{ color: '#7dd3fc' }}>animation</span>: <span style={{ color: '#86efac' }}>scale 1s linear</span>;</div>
          <div style={{ paddingLeft: 12 }}><span style={{ color: '#7dd3fc' }}>animation-timeline</span>: <span style={{ color: '#a78bfa' }}>scroll()</span>;</div>
          <div>{'}'}</div>
          <div style={{ marginTop: 8 }}><span style={{ color: '#64748b' }}>/* fade in quando entra na view */</span></div>
          <div>.card {'{'}</div>
          <div style={{ paddingLeft: 12 }}><span style={{ color: '#7dd3fc' }}>animation-timeline</span>: <span style={{ color: '#a78bfa' }}>view()</span>;</div>
          <div style={{ paddingLeft: 12 }}><span style={{ color: '#7dd3fc' }}>animation-range</span>: <span style={{ color: '#86efac' }}>entry 0% cover 30%</span>;</div>
          <div>{'}'}</div>
        </div>
      </div>
      <div style={{ fontSize: 10, color: FGMUTE, textAlign: 'center', maxWidth: 420, lineHeight: 1.6 }}>
        Chrome 115+, Edge 115+. Substitui IntersectionObserver para reveals e parallax.
      </div>
    </div>
  )
}

function SlideViewTransitions() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', justifyContent: 'center', height: 240 }}>
      <div style={{
        background: CARD, padding: 14, borderRadius: 8, border: `1px solid ${C}`,
        width: '95%', maxWidth: 460, fontFamily: "'JetBrains Mono', monospace",
      }}>
        <div style={{ fontSize: 9, color: C, fontWeight: 700, marginBottom: 8, letterSpacing: '.1em' }}>VIEW TRANSITIONS API</div>
        <div style={{ fontSize: 10, color: FGMUTE, lineHeight: 1.8 }}>
          <div><span style={{ color: '#64748b' }}>// JS: dispara transição</span></div>
          <div>document.<span style={{ color: '#7dd3fc' }}>startViewTransition</span>(() {'=>'} {'{'}</div>
          <div style={{ paddingLeft: 12 }}>updateDOM()</div>
          <div>{'}'})</div>
          <div style={{ marginTop: 8 }}><span style={{ color: '#64748b' }}>/* CSS: customiza animação */</span></div>
          <div>::<span style={{ color: '#a78bfa' }}>view-transition-old</span>(root) {'{'}</div>
          <div style={{ paddingLeft: 12 }}><span style={{ color: '#7dd3fc' }}>animation</span>: <span style={{ color: '#86efac' }}>200ms fade-out</span>;</div>
          <div>{'}'}</div>
          <div>::<span style={{ color: '#a78bfa' }}>view-transition-new</span>(root) {'{'}</div>
          <div style={{ paddingLeft: 12 }}><span style={{ color: '#7dd3fc' }}>animation</span>: <span style={{ color: '#86efac' }}>200ms fade-in</span>;</div>
          <div>{'}'}</div>
        </div>
      </div>
      <div style={{ fontSize: 10, color: FGMUTE, textAlign: 'center', maxWidth: 420, lineHeight: 1.6 }}>
        Transições nativas entre estados/páginas — substitui Framer Motion em casos simples. Same-document desde 2023.
      </div>
    </div>
  )
}

const ANIMATION_SLIDES: Slide[] = [
  {
    title: 'transition — entre estados',
    paragraphs: [
      'transition anima mudanças de propriedade entre dois estados (hover, focus, classe).',
      'Sintaxe: transition: property duration timing-function delay.',
      'Anime APENAS transform e opacity — são compositor-friendly. width/height/top disparam reflow.',
    ],
    gradient: [SKY, GRN],
    illustration: <SlideTransition />,
  },
  {
    title: 'easing — a alma da animação',
    paragraphs: [
      'A função de easing controla a velocidade da animação ao longo do tempo.',
      'ease-out (devagar no fim) é a melhor escolha para UI — sensação de "chegar suavemente".',
      'cubic-bezier(.4, 0, .2, 1) é o "Material standard" — uso em design systems modernos.',
    ],
    gradient: [PRP, AMB],
    illustration: <SlideEasing />,
  },
  {
    title: '@keyframes — animações multi-step',
    paragraphs: [
      '@keyframes define vários pontos no tempo (from/to ou 0%/50%/100%).',
      'animation aplica: name duration easing delay iteration direction fill-mode.',
      'Mais flexível que transition — não precisa de mudança de estado para começar.',
    ],
    gradient: [GRN, C],
    illustration: <SlideKeyframes />,
  },
  {
    title: 'scroll-driven animations',
    paragraphs: [
      'animation-timeline: scroll() vincula a animação ao scroll da página — sem JS.',
      'animation-timeline: view() dispara quando o elemento entra/sai do viewport.',
      'Substitui IntersectionObserver e bibliotecas de scroll para reveals e progress bars.',
    ],
    gradient: [PRP, '#f472b6'],
    illustration: <SlideScrollDriven />,
  },
  {
    title: 'view-transitions — entre estados de página',
    paragraphs: [
      'document.startViewTransition() captura snapshot, atualiza DOM, anima cross-fade.',
      'Customize via ::view-transition-old(name) e ::view-transition-new(name).',
      'Substitui muitas animações de Framer Motion para route changes em SPAs.',
    ],
    gradient: [C, SKY],
    illustration: <SlideViewTransitions />,
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// SHELL — monta os visuais com dados do CSS
// ═══════════════════════════════════════════════════════════════════════════════

export default function CssVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'cascade',
      title: 'Cascade & Origem',
      subtitle: 'Camadas e prioridade',
      accent: C,
      component: (
        <LayerStack
          layers={CASCADE_LAYERS}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          title="Pilha da Cascade — quem ganha quem"
          description="Camadas de baixo para cima. Cada layer ganha das anteriores. !important inverte a ordem dos layers."
          direction="bottom-up"
        />
      ),
    },
    {
      id: 'box',
      title: 'Box Model',
      subtitle: 'Conceitos fundamentais',
      accent: SKY,
      component: (
        <ConceptCarousel
          slides={BOX_SLIDES}
          accentColor={SKY}
          bgColor={BG}
          cardColor={CARD}
          label="VISUAL 2 — BOX MODEL"
          heading="A Caixa Que Tudo É"
          description="Cinco conceitos que toda entrevista de CSS testa: box-sizing, margin collapsing, BFC, overflow e logical properties."
        />
      ),
    },
    {
      id: 'units',
      title: 'Unidades CSS',
      subtitle: 'px, em, rem, vw, %, ch, clamp',
      accent: PRP,
      component: (
        <ConceptCarousel
          slides={UNITS_SLIDES}
          accentColor={PRP}
          bgColor={BG}
          cardColor={CARD}
          label="VISUAL — UNIDADES"
          heading="Cada Unidade Tem Seu Lugar"
          description="px é absoluto, em compounda, rem é raiz, vw/vh seguem viewport, % depende do pai, ch é caractere. clamp() une todas em valores fluidos."
        />
      ),
    },
    {
      id: 'flex',
      title: 'Flexbox Vivo',
      subtitle: 'Estados e transições',
      accent: SKY,
      component: (
        <StateMachineExplorer
          states={FLEX_STATES}
          transitions={FLEX_TRANSITIONS}
          initialState="row-start"
          accentColor={SKY}
          bgColor={BG}
          cardColor={CARD}
          title="Flexbox como máquina de estados"
          description="Cada estado é uma combinação de flex-direction, justify-content e align-items. Clique nas transições para ver o código."
        />
      ),
    },
    {
      id: 'grid',
      title: 'Grid Playground',
      subtitle: 'Construa passo a passo',
      accent: PRP,
      component: (
        <CodeStepper
          scenarios={GRID_SCENARIOS}
          accentColor={PRP}
          bgColor={BG}
          cardColor={CARD}
          title="CSS Grid — do display à área nomeada"
          description="Construa um grid completo passo a passo: display, columns, rows, gap, areas e item placement. Cada passo mostra o estado da memória."
        />
      ),
    },
    {
      id: 'spec',
      title: 'Especificidade',
      subtitle: 'Tabela comparativa',
      accent: AMB,
      component: (
        <ComparisonTable
          options={SPEC_OPTIONS}
          criteria={SPEC_CRITERIA}
          accentColor={AMB}
          bgColor={BG}
          cardColor={CARD}
          title="Selectores e seu peso"
          description="Compare especificidade, uso recomendado, override e comportamento em @layer entre os 6 tipos de seletor."
          highlightBest
        />
      ),
    },
    {
      id: 'modern-sel',
      title: 'Seletores Modernos',
      subtitle: ':has, :is, :where, :not',
      accent: GRN,
      component: (
        <FeaturesCarousel
          features={MODERN_SELECTORS}
          accentColor={GRN}
          bgColor={BG}
          label="VISUAL — SELETORES 2024+"
          heading="O CSS que substituiu JavaScript"
          description=":has() trouxe seletor de pai. :is()/:where() agrupam. :focus-visible resolve a11y. :nth-child(of) filtra antes de contar. Suporte total em todos os browsers modernos."
        />
      ),
    },
    {
      id: 'stacking',
      title: 'Stacking Context',
      subtitle: 'Quem cria, quem prende',
      accent: ORG,
      component: (
        <LayerStack
          layers={STACKING_LAYERS}
          accentColor={ORG}
          bgColor={BG}
          cardColor={CARD}
          title="Stacking Context — a árvore paralela do z-index"
          description="z-index só compete dentro do mesmo contexto. Cada gatilho cria uma 'caixa' isolada. Bug clássico do modal preso quase sempre é ancestral com transform/opacity."
          direction="top-down"
        />
      ),
    },
    {
      id: 'antipat',
      title: 'Anti-patterns',
      subtitle: 'Errado vs certo',
      accent: RED,
      component: (
        <AntiPatternsGallery
          patterns={CSS_ANTIPATTERNS}
          accentColor={RED}
          bgColor={BG}
          errorColor={RED}
          successColor={GRN}
          warningColor={AMB}
          label="VISUAL 6 — ANTI-PATTERNS"
          heading="Galeria do Horror CSS"
          description="Oito armadilhas clássicas. À esquerda o erro, à direita a versão correta. Reconheça em code review."
        />
      ),
    },
    {
      id: 'fg',
      title: 'Flexbox vs Grid',
      subtitle: 'Quando cada um vence',
      accent: PRP,
      component: (
        <ProConMatrix
          options={FG_OPTIONS}
          accentColor={PRP}
          bgColor={BG}
          cardColor={CARD}
          title="Flexbox vs Grid — pros e contras"
          description="Comparação direta. Flex distribui em 1D, Grid em 2D. Combine ambos: grid macro, flex micro."
        />
      ),
    },
    {
      id: 'queries',
      title: 'Container vs Media',
      subtitle: 'Componente vs página',
      accent: PRP,
      component: (
        <FeaturesCarousel
          features={QUERIES_COMPARISON}
          accentColor={PRP}
          bgColor={BG}
          label="VISUAL — RESPONSIVO MODERNO"
          heading="Onde cada query brilha"
          description="Media query decide pela viewport (página, device). Container query decide pelo container (componente reutilizável). Combine: media para layout macro, container para componentes autônomos."
        />
      ),
    },
    {
      id: 'animations',
      title: 'Animações',
      subtitle: 'transition, keyframes, scroll',
      accent: SKY,
      component: (
        <ConceptCarousel
          slides={ANIMATION_SLIDES}
          accentColor={SKY}
          bgColor={BG}
          cardColor={CARD}
          label="VISUAL — ANIMAÇÕES"
          heading="Do hover ao view-transition"
          description="transition para mudanças de estado, @keyframes para multi-step, scroll-driven para reveals sem JS, view-transitions para cross-fade entre páginas. Anime sempre transform e opacity."
        />
      ),
    },
  ]

  return <VisuaisShell visuals={visuals} active={active} onChange={setActive} />
}
