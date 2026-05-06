'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildCheatsheetPdf } from '@/components/pdfs/CheatsheetPdf'
import type { HookItem, PatternItem, DepRow, RuleItem } from '@/components/pdfs/CheatsheetPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'
import { buildAntipatternsPdf } from '@/components/pdfs/AntipatternsPdf'
import type { AntiPatternItem } from '@/components/pdfs/AntipatternsPdf'
import { buildMindmapPdf } from '@/components/pdfs/MindmapPdf'
import type { MindmapCategory } from '@/components/pdfs/MindmapPdf'
import { buildRecipeBookPdf } from '@/components/pdfs/RecipeBookPdf'
import type { Recipe } from '@/components/pdfs/RecipeBookPdf'

// ── Paleta CSS ───────────────────────────────────────────────────────────────────
const C      = '#264de4'
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const MUTE   = '#475569'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'

void BG; void CARD; void LINE; void MUTE

// ── Metadados dos PDFs ────────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 22 perguntas mais cobradas em entrevista CSS',
    type: 'qa',
    pages: 9,
    description: 'Recuperação ativa: 22 perguntas reais de CSS — box model, cascade, especificidade, flexbox, grid, stacking context, BFC, container queries, @layer, logical properties, will-change e performance — com resposta estruturada para nível pleno e sênior.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet',
    subtitle: 'Box, flex, grid, seletores, funções e modernidade',
    type: 'cheatsheet',
    pages: 3,
    description: 'Referência densa: propriedades essenciais por categoria — box model, flexbox, grid, posicionamento, tipografia, custom properties, funções (clamp/calc/min/max), seletores (combinadores e pseudo-classes modernas) e features 2024+ (logical, @layer, container).',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'Os 6 truques que grudam CSS na memória',
    type: 'mnemonics',
    pages: 2,
    description: 'OLEO para ordem da cascade, 1-10-100-1000 para especificidade, JADE para os 4 eixos do flexbox, FOG para quando NÃO há margin collapse, MaBoPaCo para box model, POTI para triggers de stacking context. Associações que grudam na memória de longo prazo.',
    icon: '03',
    goal: 'Memória de longo prazo',
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns',
    subtitle: 'O que não fazer — e por quê',
    type: 'antipatterns',
    pages: 3,
    description: 'Os 8 anti-patterns mais comuns: !important para vencer especificidade, px fixo em font-size, margin: 0 auto em flex, margem negativa para colar elementos, float para layout, seletores super-específicos, max-width em vez de mobile-first, e CSS global sem @layer. Com código errado x correto.',
    icon: '04',
    goal: 'Reconhecimento de padrão',
  },
  {
    id: 'mindmap',
    title: 'Mind Map',
    subtitle: 'CSS do zero ao sênior em uma folha',
    type: 'mindmap',
    pages: 2,
    description: 'Mapa mental completo com 12 categorias (fundação, layout, responsivo, seletores, variáveis, tipografia, visual, animações, performance, arquitetura, acessibilidade, moderno) e checklist de 20 perguntas que você deve conseguir responder de cabeça. Use para auto-avaliar gaps.',
    icon: '05',
    goal: 'Mapeamento mental',
  },
  {
    id: 'recipes',
    title: 'Receitas Modernas',
    subtitle: '8 receitas que todo dev de CSS deveria saber de cabeça',
    type: 'recipes',
    pages: 6,
    description: 'Livro de receitas: centralizar com flex/grid, sticky footer, grid responsivo sem media query, tipografia fluida com clamp, dark mode com tokens, container query em card, subgrid para cards alinhados, scroll-driven progress bar. Cada receita com objetivo, ingredientes, passos e armadilhas.',
    icon: '06',
    goal: 'Soluções prontas',
  },
]

const TYPE_COLOR: Partial<Record<PdfType, string>> = {
  qa:           '#a78bfa',
  cheatsheet:   C,
  mnemonics:    '#4ade80',
  antipatterns: '#ef4444',
  mindmap:      '#f59e0b',
  recipes:      '#fb923c',
}

void TYPE_COLOR

// ── Dados: Q&A ────────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'Explique o box model e a diferença entre content-box e border-box.',
    a: 'Toda caixa tem 4 áreas concêntricas: content (conteúdo), padding (espaço interno), border (linha) e margin (espaço externo). box-sizing controla como width e height são interpretados.',
    bullets: [
      'content-box (padrão): width = só conteúdo. Padding e border AUMENTAM o tamanho total.',
      'border-box: width = conteúdo + padding + border. Padrão moderno em todo reset.',
      'margin nunca entra no cálculo do box-sizing — sempre externo.',
    ],
    tip: 'Profissional usa border-box global no reset. É a "correção" que CSS deveria ter sido desde o início.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona a cascade e em que ordem as regras CSS são aplicadas?',
    a: 'A cascade é o algoritmo que decide qual regra ganha. Ordem: Origem (UA → User → Author → !important), depois Layers, depois Especificidade, depois Ordem de declaração.',
    bullets: [
      'Em !important a ordem das origens INVERTE — user !important ganha de author !important.',
      '@layer permite organizar especificidade explicitamente, sem !important.',
      'Inline tem especificidade 1000 mas ainda perde para !important.',
    ],
    tip: 'Mencione @layer como evolução moderna — substitui guerras de !important.',
  },
  {
    level: 'Pleno',
    q: 'O que é especificidade e como calcular?',
    a: 'Especificidade é um número de 4 dígitos que o browser calcula para cada seletor: inline (1000) > id (100) > class/attr/pseudo (10) > tag (1). NÃO use base 10 — compare pilha por pilha.',
    bullets: [
      '#a .b .c → (0,1,2,0) ganha de div div div → (0,0,0,3).',
      ':where() tem especificidade ZERO. :is() e :not() usam a maior dos argumentos.',
      '!important sai da contagem e vence — exceção: layers invertem ordem com !important.',
    ],
    tip: 'Faça o cálculo passo a passo num exemplo durante a entrevista.',
  },
  {
    level: 'Pleno',
    q: 'Quando usar Flexbox e quando usar Grid?',
    a: 'Heurística: Flex para 1 dimensão, Grid para 2. Flex distribui em UMA direção (linha ou coluna). Grid distribui em LINHAS E COLUNAS simultaneamente.',
    bullets: [
      'Flex: navbars, listas com altura/largura variável, alinhamento dentro de componente.',
      'Grid: layouts de página, dashboards, áreas nomeadas, alinhar entre cards (subgrid).',
      'Combinar é normal: grid no macro, flex em cada célula. gap funciona em ambos.',
    ],
    tip: 'Diga "1D vs 2D" como atalho. Mencione subgrid como recurso moderno que mata casos antes complicados.',
  },
  {
    level: 'Senior',
    q: 'O que é stacking context e como é criado?',
    a: 'Stacking context é uma árvore paralela de profundidade. Dentro de um contexto, z-index compete entre filhos. Entre contextos, o filho com maior z-index do contexto pai ganha.',
    bullets: [
      'Criado por: position + z-index, opacity < 1, transform, filter, isolation: isolate, position fixed/sticky, will-change.',
      'Bug clássico: modal com z-index: 9999 atrás de outro elemento. Quase sempre é ancestral com transform criando contexto.',
      'isolation: isolate cria stacking context sem efeito visual — solução limpa.',
    ],
    tip: 'Cite isolation: isolate como propriedade criada justamente para isso.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona position: sticky e quais são os gotchas?',
    a: 'sticky é híbrido entre relative e fixed. Age como relative até cruzar o threshold (top/right/bottom/left), e então fica fixed nesse offset, mas SOMENTE dentro do bloco pai.',
    bullets: [
      'Você precisa especificar pelo menos um top/right/bottom/left, senão não "gruda".',
      'overflow: hidden ou auto em algum ancestral mata o sticky silenciosamente.',
      'Em flex/grid, filho deve ter align-self: start (não stretch padrão).',
    ],
    tip: 'O gotcha do overflow no ancestral é o bug mais comum — mostra experiência real.',
  },
  {
    level: 'Pleno',
    q: 'O que é margin collapsing e quando NÃO acontece?',
    a: 'Margin collapsing é o comportamento em que margens VERTICAIS adjacentes se combinam usando o maior valor — não somam.',
    bullets: [
      'Acontece em: irmãos block adjacentes, pai/primeiro filho, blocos vazios.',
      'NÃO acontece em: flex/grid containers, BFC, com padding/border separando, position absolute/fixed.',
      'display: flow-root cria BFC sem efeitos colaterais — o "clearfix moderno".',
    ],
    tip: 'Cite display: flow-root como solução moderna para criar BFC.',
  },
  {
    level: 'Senior',
    q: 'Como funciona a propriedade contain e para que serve?',
    a: 'contain diz ao browser que um elemento é independente do resto, permitindo otimizações de render: pular layout/paint/style de subárvores não visíveis.',
    bullets: [
      'contain: layout — mudanças internas não afetam fora. paint — pintura limitada. size — tamanho não depende dos filhos.',
      'content = layout + paint + style. strict = tudo + size.',
      'content-visibility: auto + contain-intrinsic-size = lazy render para listas longas.',
    ],
    tip: 'content-visibility: auto pode acelerar render em 5-10x em listas — sinal de profundidade.',
  },
  {
    level: 'Pleno',
    q: 'O que são Custom Properties e como diferem de variáveis Sass?',
    a: 'Custom Properties (--var) são variáveis nativas do CSS. Diferem de Sass em três pontos: existem em runtime, seguem cascade, e podem ser alteradas via JS ou pseudo-classes.',
    bullets: [
      'Sass some após compilação. Custom properties existem no DOM.',
      'Você pode redefinir --bg em um filho e herdar apenas naquele subárvore.',
      '@property tipa custom property: <code>@property --x { syntax: "<color>" }</code> — habilita animação.',
    ],
    tip: 'Cite @property como evolução moderna que permite animar tipos não-numéricos.',
  },
  {
    level: 'Senior',
    q: 'Como usar @layer para organizar especificidade?',
    a: '@layer declara ordem explícita entre grupos de regras. Regras em layers POSTERIORES ganham, INDEPENDENTE de especificidade. Estilos sem layer ficam ACIMA de qualquer layer.',
    bullets: [
      'Estratégia comum: @layer reset, tokens, base, components, utilities;',
      'Importar bibliotecas em layer baixo: @import url(lib.css) layer(vendor) — você nunca mais sofre de "lib sobrescreve".',
      '!important em layer mais antigo ganha de layer mais novo — ordem INVERTE.',
    ],
    tip: 'Mencione importar libs em um layer (vendor) — caso real de produção.',
  },
  {
    level: 'Senior',
    q: 'Como funciona o auto-placement do Grid?',
    a: 'Itens sem posição explícita são colocados pelo auto-placement: row-first por padrão, da esquerda para direita, de cima para baixo. grid-auto-flow controla o modo.',
    bullets: [
      'grid-auto-flow: dense reordena para evitar buracos — mas pode atrapalhar tab order.',
      'minmax(0, 1fr) é o "fr seguro" — resolve overflow de texto longo em layouts com 1fr puro.',
      'auto-fit colapsa colunas vazias; auto-fill mantém. Use auto-fit para grid responsivo.',
    ],
    tip: 'Cite o "fr seguro" minmax(0, 1fr) — bug clássico que demonstra experiência.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona aspect-ratio e quando usar?',
    a: 'aspect-ratio declara a proporção entre largura e altura. Ex: aspect-ratio: 16/9. Browser calcula a dimensão ausente. Substitui o famoso "padding-bottom hack".',
    bullets: [
      'Útil para CLS (Cumulative Layout Shift): reserva espaço antes da imagem carregar.',
      'Combina com object-fit (cover, contain) para imagens preservarem proporção.',
      'Se largura E altura estão definidos, aspect-ratio é ignorado.',
    ],
    tip: 'Conecte com Web Vitals (CLS) — mostra entender impacto em performance.',
  },
  {
    level: 'Senior',
    q: 'O que é subgrid e quando usar?',
    a: 'subgrid permite que um filho de grid herde linhas/colunas do avô. Caso clássico: cards com header/body/footer que precisam alinhar EM TODOS os cards de uma linha.',
    bullets: [
      'Sem subgrid, cada card teria altura própria e elementos não alinhariam.',
      'Sintaxe: grid-template-columns: subgrid. Pode aplicar a rows também.',
      'Suporte: Firefox 2019, Safari 16+, Chrome 117+ — produção em 2024+.',
    ],
    tip: 'Cite o caso de cards alinhando entre si — antes precisava JS ou altura fixa.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona a herança no CSS?',
    a: 'Algumas propriedades fluem do pai para filhos automaticamente. Tipográficas (font-*, color, line-height, text-*) HERDAM. Layout/box (margin, padding, border, display) NÃO.',
    bullets: [
      'Use inherit, initial ou unset explicitamente quando precisar.',
      'Custom properties (--var) sempre herdam — base da estratégia de tema.',
      'all: unset zera tudo — útil para resetar um elemento por completo.',
    ],
    tip: 'Regra: tipografia herda, layout não. Facilita lembrar caso a caso.',
  },
  {
    level: 'Senior',
    q: 'O que é Block Formatting Context (BFC)?',
    a: 'BFC é uma região de layout independente onde block elements seguem regras isoladas: margens não vazam, floats são contidos, elementos block ficam empilhados sem influência externa.',
    bullets: [
      'Criado por: float, position absolute/fixed, inline-block, flex, grid, flow-root, overflow ≠ visible, contain.',
      'display: flow-root cria BFC sem efeitos colaterais — substitui clearfix antigo.',
      'Casos típicos: conter float, evitar margin collapse, ficar lado a lado de float.',
    ],
    tip: 'Mencione display: flow-root explicitamente — substitui o clearfix antigo.',
  },
  {
    level: 'Pleno',
    q: 'Como funcionam clip-path e mask?',
    a: 'Ambos recortam visualmente. clip-path define forma geométrica (circle, polygon, path). mask usa imagem/gradiente — canal alfa controla opacidade pixel a pixel.',
    bullets: [
      'clip-path é binário (visível ou não). mask suporta valores intermediários (fade out).',
      'clip-path tem melhor performance — compositor-friendly.',
      'mask precisa de -webkit-mask em Safari antigo.',
    ],
    tip: 'clip para "tesoura", mask para "tinta com transparência variável".',
  },
  {
    level: 'Senior',
    q: 'O que é will-change e quando usar?',
    a: 'will-change avisa o browser que uma propriedade vai mudar, promovendo o elemento para layer GPU antecipadamente. Otimização para animações.',
    bullets: [
      'transform e opacity são compositor-friendly — geralmente NÃO precisam de will-change.',
      'Aplicar via JS antes da animação e remover ao terminar é a estratégia ótima.',
      'Cria stacking context. Em excesso pode degradar performance (memory thrashing).',
    ],
    tip: 'will-change não é mágica — é dica que pode ferir performance se abusada.',
  },
  {
    level: 'Pleno',
    q: 'Como funcionam ::before e ::after?',
    a: '::before e ::after inserem conteúdo gerado antes/depois do conteúdo do elemento. Não são parte do DOM (não acessíveis via JS), mas existem para o browser.',
    bullets: [
      'content é obrigatório (mesmo vazio: content: ""). Sem isso, não renderiza.',
      'content: attr(data-tip) lê data-attribute para texto dinâmico.',
      'Não funciona em <img>, <input>, <br> — só em elementos que aceitam filhos.',
    ],
    tip: 'attr() em content para tooltips simples — exemplo concreto de uso real.',
  },
  {
    level: 'Senior',
    q: 'O que são logical properties e por que preferir margin-inline a margin-left?',
    a: 'Logical properties substituem direções FÍSICAS (left/right/top/bottom) por LÓGICAS (inline/block, start/end). Adaptam-se a writing-mode e direction.',
    bullets: [
      'margin-inline: auto centraliza horizontalmente em qualquer direção (LTR ou RTL).',
      'inset: 0 = top/right/bottom/left: 0. Atalho moderno.',
      'Padrão em design systems modernos: Material 3, Adobe Spectrum, IBM Carbon.',
    ],
    tip: 'Cite RTL como caso real (Airbnb global, e-commerce). Logical resolve sem if/else por idioma.',
  },
  {
    level: 'Senior',
    q: 'Como otimizar performance de CSS?',
    a: 'Performance impacta render do browser. Anime apenas transform/opacity (compositor-friendly). Evite animar width/height/top/left — disparam layout.',
    bullets: [
      'contain: layout style paint isola subárvores.',
      'content-visibility: auto pula render de elementos fora do viewport.',
      'CSS crítico inline no head; resto async. Reduzir CSS não usado (PurgeCSS, Tailwind JIT).',
    ],
    tip: '"transform e opacity são gratuitos, width e height são caros" — frase memorável.',
  },
  {
    level: 'Senior',
    q: 'O que são container queries e quando preferir a media queries?',
    a: 'Container queries respondem ao tamanho do CONTAINER, não do viewport. Permitem componente responsivo independente de onde é colocado.',
    bullets: [
      'Media query: layout global (sidebar empilha, navbar muda). Decisões de página.',
      'Container query: componente reutilizável (card em sidebar 200px vs main 800px).',
      'O container precisa de container-type: inline-size declarado.',
    ],
    tip: 'Cite o caso real: mesmo componente em sidebar e main com layouts diferentes — antes precisava prop.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona grid-template-areas e por que usar?',
    a: 'grid-template-areas nomeia regiões do grid e posiciona itens declarativamente. Layout fica VISUAL e legível no próprio CSS.',
    bullets: [
      'Reordenar layout em mobile: redefine grid-template-areas dentro de @media.',
      'Áreas vazias com ponto: "a . b" deixa célula intermediária vazia.',
      'Áreas devem ser retangulares — não L-shape.',
    ],
    tip: 'Demonstre numa entrevista escrevendo um layout completo — é a forma mais legível de apresentar grid.',
  },
]

// ── Dados: CheatSheet ─────────────────────────────────────────────────────────────

const HOOKS: HookItem[] = [
  { name: 'display',          sig: 'block | inline | flex | grid | none | contents',         desc: 'Como o elemento participa do layout. flex/grid criam contexto de formatação para filhos.' },
  { name: 'box-sizing',       sig: 'content-box | border-box',                                desc: 'border-box: width inclui padding e border. Padrão moderno em todo reset.' },
  { name: 'position',         sig: 'static | relative | absolute | fixed | sticky',           desc: 'static (default): no fluxo. absolute: relativo ao positioned mais próximo. sticky: híbrido.' },
  { name: 'flex',             sig: 'flex: <grow> <shrink> <basis>',                           desc: 'Atalho. flex: 1 → ocupa espaço disponível (1 1 0). flex: auto → 1 1 auto.' },
  { name: 'grid-template',    sig: 'columns: repeat(N, 1fr) / rows: auto',                    desc: 'Define tracks explícitos. fr distribui o espaço RESTANTE depois de gaps e tamanhos fixos.' },
  { name: 'gap',              sig: 'gap: <row> <column>',                                     desc: 'Espaço entre células — funciona em flex/grid. Substitui margin nos filhos.' },
  { name: 'aspect-ratio',     sig: 'aspect-ratio: 16 / 9',                                    desc: 'Mantém proporção. Browser calcula dimensão ausente. Útil para CLS.' },
  { name: 'overflow',         sig: 'visible | hidden | auto | scroll | clip',                 desc: 'Controla transbordamento. auto/hidden criam BFC. clip não permite scroll programático.' },
  { name: 'transform',        sig: 'translate() | rotate() | scale() | matrix()',             desc: 'Transformação visual. Compositor-friendly — animar é grátis. Cria stacking context.' },
  { name: 'transition',       sig: 'transition: <property> <duration> <easing>',              desc: 'Anima mudanças entre estados. all 200ms ease é comum. Evite animar width/height.' },
  { name: 'will-change',      sig: 'will-change: transform | opacity',                        desc: 'Promove para layer GPU. Use pontual antes de animar e remova depois.' },
  { name: 'contain',          sig: 'contain: layout | paint | style | content | strict',      desc: 'Isola subárvore para otimizar render. content = layout+paint+style.' },
]

const HOOKS_R19: HookItem[] = [
  { name: '@layer',           sig: '@layer reset, components, utilities;',                    desc: 'Ordem explícita de cascade. Layer posterior ganha. Mata guerras de !important.' },
  { name: '@container',       sig: '@container (min-width: 400px) { ... }',                   desc: 'Responde ao container, não viewport. Requer container-type no pai.' },
  { name: ':has()',           sig: '.card:has(> img) { ... }',                                desc: 'Seletor de pai. Suporte total desde 2023. Substitui muito JavaScript.' },
  { name: 'logical props',    sig: 'margin-inline | inset-block-start',                       desc: 'Direções lógicas. Adaptam-se a writing-mode e direction (RTL-safe).' },
  { name: '@property',        sig: '@property --x { syntax: "<color>"; ... }',                desc: 'Tipa custom property. Habilita animação de tipos não-numéricos.' },
  { name: 'color-mix',        sig: 'color-mix(in srgb, red 50%, blue)',                       desc: 'Mistura cores em runtime. Útil para overlays e shades dinâmicos.' },
]

const DEP_ROWS: DepRow[] = [
  ['justify-content', 'flex-start | center | flex-end | space-between | space-around | space-evenly. Distribui no eixo principal.'],
  ['align-items',     'stretch (default) | center | flex-start | flex-end | baseline. Alinha no eixo cruzado.'],
  ['flex-direction',  'row (default) | row-reverse | column | column-reverse. Define o eixo principal.'],
  ['flex-wrap',       'nowrap (default) | wrap | wrap-reverse. Quebra de linha quando não cabe.'],
  ['place-items',     'Atalho para align-items + justify-items (em grid). place-items: center centraliza tudo.'],
]

const HOOK_RULES: RuleItem[] = [
  { ok: true,  t: 'Use border-box global no reset: * { box-sizing: border-box }' },
  { ok: true,  t: 'Mobile-first: layout simples cresce com @media (min-width: ...)' },
  { ok: true,  t: 'Anime apenas transform e opacity — compositor-friendly, sem reflow' },
  { ok: true,  t: 'Use rem para tipografia e espaçamento — respeita preferência do usuário' },
  { ok: true,  t: 'Use @layer para organizar especificidade — mata guerras de !important' },
  { ok: false, t: 'Não use !important para vencer especificidade — gera dívida técnica' },
  { ok: false, t: 'Não use float para layout — flex/grid são declarativos e modernos' },
  { ok: false, t: 'Não use seletores super-específicos (div.x > ul.y > li.z) — amarra HTML/CSS' },
  { ok: false, t: 'Não use id como seletor de estilo — use class para reutilização' },
  { ok: false, t: 'Não use px fixo em font-size — quebra zoom acessível do browser' },
]

const PERFORMANCE_TIPS: string[] = [
  'Anime apenas transform e opacity — rodam na thread do compositor sem bloquear JS.',
  'will-change: transform pontual antes da animação, remover ao terminar — evita memory thrashing.',
  'content-visibility: auto + contain-intrinsic-size pula render de elementos fora do viewport.',
  'contain: layout style paint isola subárvores e permite browser pular cálculos.',
  'Reduzir CSS crítico — inline above-the-fold no <head>, resto carrega async.',
  'Tree-shake CSS não usado — PurgeCSS, Tailwind JIT, Critical CSS por rota.',
  'Seletores eficientes — browser lê DA DIREITA para esquerda. Último componente deve ser específico.',
  'Evitar animação de width/height/top/left — disparam reflow em toda a árvore.',
]

const PATTERNS: PatternItem[] = [
  { name: 'Centralizar com flex',         code: 'display: flex; place-items: center; place-content: center;',                                desc: 'Centraliza filho horizontal e verticalmente. place-items é atalho moderno.' },
  { name: 'Grid responsivo sem media',    code: 'grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));',                   desc: 'Layout que se adapta de 1 a N colunas automaticamente. min() previne overflow.' },
  { name: 'Tipografia fluida',            code: 'font-size: clamp(1rem, 2vw + 0.5rem, 1.5rem);',                                            desc: 'Escala suavemente entre min e max conforme viewport. Sem media query.' },
  { name: 'Dark mode com tokens',         code: '[data-theme="dark"] { --bg: #0f172a; --fg: #e2e8f0; }',                                    desc: 'Tema via custom properties. Toggle via attribute. Suporte a prefers-color-scheme.' },
  { name: 'BFC moderno (clearfix)',       code: 'display: flow-root;',                                                                      desc: 'Cria BFC sem efeitos colaterais. Substitui ::after { clear: both }.' },
  { name: 'Container query',              code: 'container-type: inline-size;\n@container (min-width: 400px) { ... }',                     desc: 'Componente responsivo ao container. O pai precisa declarar container-type.' },
]

const MENTAL_MODELS: string[] = [
  'CSS é função de pontuação — para cada elemento, a cascade calcula qual valor cada propriedade recebe.',
  'box-sizing: border-box — padrão moderno, torna width previsível.',
  'Flexbox = 1D, Grid = 2D — combine: grid macro, flex micro.',
  'Stacking context é árvore paralela — z-index só compete dentro do mesmo contexto.',
  'transform/opacity são gratuitos (compositor); width/height são caros (reflow).',
  'Tipografia herda, layout não — regra prática para lembrar herança.',
]

// ── Dados: Mnemônicos ─────────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'Ordem da Cascade',
    trick: 'OLEO',
    expansion: [
      ['O', 'Origem (UA → User → Author → !important inverte)'],
      ['L', 'Layers (@layer ordem declarada — depois ganha)'],
      ['E', 'Especificidade (inline > id > class > tag)'],
      ['O', 'Ordem de declaração (última ganha quando empata)'],
    ],
    explanation: 'A cascade resolve conflitos em camadas hierárquicas. Primeiro decide pela origem (browser default vs seu CSS), depois pelos layers explícitos, depois pela especificidade do seletor, e por último pela ordem em que a regra aparece. OLEO substitui decorar a tabela inteira do W3C.',
    example: '/* Mesmo elemento, regras conflitantes */\n@layer A { .btn { color: red } }\n@layer B { .btn { color: blue } }\n/* B ganha por ser layer posterior, ESPECIFICIDADE IGUAL */',
    why: 'Reduzir 4 níveis de cascade a uma palavra de 4 letras dá ferramenta de diagnóstico imediato. Você pergunta "qual nível resolve?" antes de mexer no CSS.',
  },
  {
    label: 'Especificidade — pilhas',
    trick: '1-10-100-1000',
    expansion: [
      ['1',    'tag e pseudo-elementos (div, ::before)'],
      ['10',   'class, attr, pseudo-class (.btn, [type], :hover)'],
      ['100',  'id (#header)'],
      ['1000', 'inline style (style="...")'],
    ],
    explanation: 'Cada categoria tem peso fixo de ordem de magnitude. Mas NÃO use base 10 na soma — compare pilha por pilha, da esquerda para direita. (0,0,2,0) ganha de (0,0,1,99). Memorizar 1-10-100-1000 ajuda visualizar que id sempre vence quantas classes tiver.',
    example: '#a .b   → (0,1,1,0)\n.a .b .c → (0,0,3,0)\n#a > .b ganha — id sempre supera classes.',
    why: 'Pesos como ordem de magnitude tornam óbvio que id pesa muito. Uma vez memorizado, calcular especificidade vira automático.',
  },
  {
    label: 'Eixos do Flexbox',
    trick: 'JADE',
    expansion: [
      ['J', 'Justify-content (eixo principal)'],
      ['A', 'Align-items (eixo cruzado)'],
      ['D', 'Direction (row ou column define o principal)'],
      ['E', 'Either (wrap = quebra de linha quando não cabe)'],
    ],
    explanation: 'Os 4 eixos de decisão do flexbox: como distribuir no eixo principal (J), como alinhar no cruzado (A), qual é o principal (D), e se quebra linha (E). Direction muda o significado dos outros — em column, justify-content alinha vertical e align-items horizontal.',
    example: 'display: flex;\nflex-direction: row;     /* D */\njustify-content: center; /* J - horizontal em row */\nalign-items: center;     /* A - vertical em row */\nflex-wrap: wrap;         /* E */',
    why: 'JADE força lembrar a ordem de decisão. Você não esquece de definir direction antes de ajustar justify/align — o que evita o bug de "estou alinhando mas não funciona".',
  },
  {
    label: 'Quando NÃO há margin collapse',
    trick: 'FOG',
    expansion: [
      ['F', 'Flex container (filhos não colapsam)'],
      ['O', 'Overflow ≠ visible (cria BFC)'],
      ['G', 'Grid container (filhos não colapsam)'],
    ],
    explanation: 'Margens verticais COLAPSAM em fluxo normal de elementos block. Os 3 cenários onde NÃO acontece: flex, grid, ou BFC criado por overflow auto/hidden/scroll. display: flow-root é o BFC moderno sem efeitos colaterais. Memorizar FOG dá ferramenta de diagnóstico — se você quer impedir collapse, crie um desses contextos.',
    example: '/* Margens colapsam */\n<div>\n  <p style="margin-bottom: 30px">A</p>\n  <p style="margin-top: 20px">B</p>\n</div>\n/* Espaço resultante: 30px (não 50px) */\n\n/* Não colapsa */\n<div style="display: flex; flex-direction: column"> ... </div>',
    why: 'FOG comprime 3 contextos de isolamento numa palavra. Em vez de pensar "quais containers criam BFC?", você lembra direto FOG e identifica em segundos.',
  },
  {
    label: 'Box Model',
    trick: 'MaBoPaCo',
    expansion: [
      ['Ma', 'Margin (espaço externo, pode colapsar)'],
      ['Bo', 'Border (linha visível)'],
      ['Pa', 'Padding (espaço interno até a borda)'],
      ['Co', 'Content (texto, imagem, filhos)'],
    ],
    explanation: 'A ordem de FORA para DENTRO: Margin → Border → Padding → Content. Decorar a sequência evita confundir margin (externo, separa caixas) com padding (interno, cresce a caixa). Em border-box, padding/border ENTRAM no width; em content-box, AUMENTAM o width total.',
    example: 'Margin: 10px de cada lado (separação)\nBorder: 2px (linha)\nPadding: 16px (respiro interno)\nContent: 200px (conteúdo)\n\nbox-sizing: content-box → total = 200 + 32 + 4 + 20 = 256px\nbox-sizing: border-box → total = 200px (incluindo padding e border)',
    why: 'Sequência fonética curta vira ritmo mental. Em vez de pensar abstratamente, você "lê" o box model como uma palavra.',
  },
  {
    label: 'Triggers de Stacking Context',
    trick: 'POTI',
    expansion: [
      ['P', 'Position não-static + z-index'],
      ['O', 'Opacity < 1'],
      ['T', 'Transform (qualquer valor diferente de none)'],
      ['I', 'Isolation: isolate (criado para isso, sem efeito visual)'],
    ],
    explanation: 'Stacking context é a árvore paralela de profundidade — z-index só compete dentro do mesmo contexto. POTI cobre 90% dos casos reais que criam novo contexto. Filter, perspective, will-change e position: fixed/sticky também criam, mas POTI já mata o bug clássico do "modal preso atrás".',
    example: '/* Bug clássico */\n.parent { transform: scale(1) }  /* T cria contexto! */\n.modal { position: fixed; z-index: 9999 }\n/* modal vira relativo ao parent, fica preso */\n\n/* Solução */\n.parent { isolation: isolate }  /* contexto sem efeito visual */',
    why: 'Quando um modal "some" ou fica atrás de outro elemento, você instintivamente percorre POTI nos ancestrais. A ferramenta diagnóstica vira reflexo.',
  },
]

// ── Dados: Anti-patterns ──────────────────────────────────────────────────────────

const KW   = '#f87171'
const KWG  = '#86efac'
const STR  = '#fcd34d'
const PROP = '#7dd3fc'
const COMM = '#64748b'

const ANTIPATTERNS: AntiPatternItem[] = [
  {
    title: '!important para vencer especificidade',
    badDesc: 'Adicionar !important para "ganhar" sem entender a cascade. Cada override exige novo !important — guerra infinita.',
    badCode: [
      { t: '.btn { ' }, { t: 'background', c: PROP }, { t: ': red ' }, { t: '!important', c: KW }, { t: '; }\n' },
      { t: '.modal .btn { ' }, { t: 'background', c: PROP }, { t: ': blue ' }, { t: '!important', c: KW }, { t: '; }\n' },
      { t: '/* outro componente vai precisar de outro !important */', c: COMM },
    ],
    goodDesc: 'Use @layer para definir ordem explícita. Layer posterior ganha SEM brigar com especificidade.',
    goodCode: [
      { t: '@layer ' }, { t: 'components', c: KWG }, { t: ', ' }, { t: 'overrides', c: KWG }, { t: ';\n' },
      { t: '@layer components { .btn { ' }, { t: 'background', c: PROP }, { t: ': red; } }\n' },
      { t: '@layer overrides { .modal .btn { ' }, { t: 'background', c: PROP }, { t: ': blue; } }' },
    ],
    why: '!important cria dívida técnica. @layer impõe ordem sem aumentar especificidade — qualquer regra do layer overrides ganha sem precisar de !important.',
  },
  {
    title: 'px fixo para font-size',
    badDesc: 'font-size: 16px em px ignora a preferência de zoom do usuário no browser. Acessibilidade quebrada.',
    badCode: [
      { t: 'body { ' }, { t: 'font-size', c: PROP }, { t: ': ' }, { t: '16px', c: KW }, { t: '; }\n' },
      { t: 'h1 { ' }, { t: 'font-size', c: PROP }, { t: ': ' }, { t: '32px', c: KW }, { t: '; }\n' },
      { t: '/* usuário com baixa visão aumenta zoom — ignora */', c: COMM },
    ],
    goodDesc: 'Use rem (relativo ao html). Tipografia fluida com clamp() escala entre min e max sem media query.',
    goodCode: [
      { t: 'html { ' }, { t: 'font-size', c: PROP }, { t: ': ' }, { t: '100%', c: KWG }, { t: '; }\n' },
      { t: 'body { ' }, { t: 'font-size', c: PROP }, { t: ': ' }, { t: '1rem', c: KWG }, { t: '; }\n' },
      { t: 'h1 { ' }, { t: 'font-size', c: PROP }, { t: ': ' }, { t: 'clamp(1.5rem, 3vw, 2rem)', c: KWG }, { t: '; }' },
    ],
    why: 'rem se baseia no font-size do html. Usuário aumenta zoom → todo CSS escala junto. clamp() dá tipografia fluida sem media query e respeita preferência do usuário.',
  },
  {
    title: 'margin: 0 auto em flex container',
    badDesc: 'Tentar centralizar item com margin: 0 auto dentro de flex — funciona em block, mas não é o padrão moderno em flex.',
    badCode: [
      { t: '.container { ' }, { t: 'display', c: PROP }, { t: ': flex; }\n' },
      { t: '.item {\n  ' }, { t: 'margin', c: PROP }, { t: ': ' }, { t: '0 auto', c: KW }, { t: '; ' }, { t: '/* menos claro */', c: COMM }, { t: '\n}' },
    ],
    goodDesc: 'Use justify-content (eixo principal) e align-items (eixo cruzado). Logical: margin-inline: auto também funciona.',
    goodCode: [
      { t: '.container {\n  ' }, { t: 'display', c: PROP }, { t: ': flex;\n  ' },
      { t: 'justify-content', c: PROP }, { t: ': ' }, { t: 'center', c: KWG }, { t: ';\n  ' },
      { t: 'align-items', c: PROP }, { t: ': ' }, { t: 'center', c: KWG }, { t: ';\n}\n' },
      { t: '/* OU em flex: margin-inline: auto no item */', c: COMM },
    ],
    why: 'Em flex, justify-content e align-items são as APIs corretas. margin: 0 auto funciona às vezes, mas é menos legível e inconsistente em column-direction. Use o que foi feito para flex.',
  },
  {
    title: 'Margem negativa para "colar" elementos',
    badDesc: 'Margens negativas para eliminar espaço entre elementos quebram em RTL e wrap. Hack frágil.',
    badCode: [
      { t: '.list .item:not(:last-child) {\n  ' },
      { t: 'margin-right', c: PROP }, { t: ': ' }, { t: '-1px', c: KW }, { t: '; ' }, { t: '/* elimina border duplo */', c: COMM }, { t: '\n}' },
    ],
    goodDesc: 'Use gap em flex/grid para controle direto. Para borders duplos, use sibling selector.',
    goodCode: [
      { t: '.list {\n  ' }, { t: 'display', c: PROP }, { t: ': ' }, { t: 'flex', c: KWG }, { t: ';\n  ' },
      { t: 'gap', c: PROP }, { t: ': ' }, { t: '0', c: KWG }, { t: ';\n}\n' },
      { t: '.item + .item { ' }, { t: 'border-left', c: PROP }, { t: ': ' }, { t: '0', c: KWG }, { t: '; }' },
    ],
    why: 'Margens negativas dependem de direção (left/right) e quebram em wrap. gap é declarativo e respeita logical properties.',
  },
  {
    title: 'float para layout',
    badDesc: 'float foi feito para texto fluindo em volta de imagens. Hijackearam para layout antes de flex/grid existirem.',
    badCode: [
      { t: '.sidebar { ' }, { t: 'float', c: PROP }, { t: ': ' }, { t: 'left', c: KW }, { t: '; ' }, { t: 'width', c: PROP }, { t: ': 200px; }\n' },
      { t: '.main { ' }, { t: 'margin-left', c: PROP }, { t: ': ' }, { t: '200px', c: KW }, { t: '; }\n' },
      { t: '.clearfix::after { content: ""; display: block; clear: both; }' },
    ],
    goodDesc: 'Grid é declarativo, mantém ordem semântica e suporta gap nativo. Substitui completamente layouts com float.',
    goodCode: [
      { t: '.layout {\n  ' }, { t: 'display', c: PROP }, { t: ': ' }, { t: 'grid', c: KWG }, { t: ';\n  ' },
      { t: 'grid-template-columns', c: PROP }, { t: ': ' }, { t: '200px 1fr', c: KWG }, { t: ';\n  ' },
      { t: 'gap', c: PROP }, { t: ': ' }, { t: '1rem', c: KWG }, { t: ';\n}' },
    ],
    why: 'Grid declara o layout em uma propriedade. Sem clearfix, sem margin-left contável, sem ordem visual divergente da semântica.',
  },
  {
    title: 'Seletores super-específicos',
    badDesc: 'div.container > ul.list > li.item > a.link amarra o CSS à estrutura do HTML. Mudou o HTML, quebrou o CSS.',
    badCode: [
      { t: 'div.container > ul.list > li.item > a.link {\n  ' },
      { t: 'color', c: PROP }, { t: ': ' }, { t: 'red', c: KW }, { t: ';\n}\n' },
      { t: '/* especificidade (0,0,4,4) — quase impossível overrride */', c: COMM },
    ],
    goodDesc: 'Use uma única classe semântica. BEM ou utility-first. Especificidade baixa, override trivial.',
    goodCode: [
      { t: '.link {\n  ' }, { t: 'color', c: PROP }, { t: ': ' }, { t: 'red', c: KWG }, { t: ';\n}\n' },
      { t: '/* especificidade (0,0,1,0) — fácil override em qualquer lugar */', c: COMM },
    ],
    why: 'Aninhamento profundo cria acoplamento. CSS deve responder à intenção (.link), não à estrutura. Classe única é portátil entre HTMLs.',
  },
  {
    title: 'max-width em vez de mobile-first',
    badDesc: 'Layout desktop padrão e mobile via max-width = desktop-first. Inverte o padrão moderno.',
    badCode: [
      { t: '.card { ' }, { t: 'display', c: PROP }, { t: ': ' }, { t: 'flex', c: KW }, { t: '; } ' }, { t: '/* desktop default */', c: COMM }, { t: '\n' },
      { t: '@media (' }, { t: 'max-width', c: KW }, { t: ': 768px) {\n  .card { ' }, { t: 'display', c: PROP }, { t: ': block; }\n}' },
    ],
    goodDesc: 'Mobile-first: layout simples padrão, complexidade cresce com min-width. Garante UX rápido em mobile (a maioria do tráfego).',
    goodCode: [
      { t: '.card { ' }, { t: 'display', c: PROP }, { t: ': ' }, { t: 'block', c: KWG }, { t: '; } ' }, { t: '/* mobile default */', c: COMM }, { t: '\n' },
      { t: '@media (' }, { t: 'min-width', c: KWG }, { t: ': 768px) {\n  .card { ' }, { t: 'display', c: PROP }, { t: ': flex; }\n}' },
    ],
    why: 'Mobile-first reduz complexidade no caso comum (mobile) e adiciona em casos específicos (desktop). Cascata flui naturalmente do simples ao complexo.',
  },
  {
    title: 'CSS global sem @layer',
    badDesc: 'Importar bibliotecas third-party e mexer no projeto sem layers — guerra de especificidade infinita.',
    badCode: [
      { t: '@import ' }, { t: '"library.css"', c: STR }, { t: ';\n' },
      { t: '.btn { ' }, { t: 'color', c: PROP }, { t: ': ' }, { t: 'red !important', c: KW }, { t: '; }\n' },
      { t: '/* lib sobrescreve, projeto vira war zone */', c: COMM },
    ],
    goodDesc: 'Use @layer para impor ordem explícita. Vendor sempre perde para components, mesmo com seletor mais específico.',
    goodCode: [
      { t: '@layer ' }, { t: 'reset, vendor, base, components, utilities', c: KWG }, { t: ';\n' },
      { t: '@import ' }, { t: '"library.css"', c: STR }, { t: ' layer(' }, { t: 'vendor', c: KWG }, { t: ');\n' },
      { t: '@layer components { .btn { ' }, { t: 'color', c: PROP }, { t: ': red; } }' },
    ],
    why: 'Sem layers, biblioteca compete com seu CSS por especificidade. @layer impõe ordem: vendor sempre perde para components, sem precisar !important.',
  },
]

// ── Dados: Mind Map ───────────────────────────────────────────────────────────────

const MINDMAP_CATEGORIES: MindmapCategory[] = [
  { label: 'FUNDAÇÃO',     color: C, items: [
    { t: 'box model', k: true }, { t: 'box-sizing', k: true }, { t: 'display', k: true },
    { t: 'cascade', k: true }, { t: 'especificidade', k: true }, { t: 'herança', k: true },
    { t: 'unidades (px/em/rem/%)' }, { t: 'cores (hex/rgb/hsl/oklch)' },
  ]},
  { label: 'LAYOUT',       color: C, items: [
    { t: 'flexbox', k: true }, { t: 'grid', k: true }, { t: 'position', k: true },
    { t: 'gap', k: true }, { t: 'grid-template-areas' },
    { t: 'subgrid', a: true }, { t: 'masonry', a: true }, { t: 'float (legado)' },
  ]},
  { label: 'RESPONSIVO',   color: C, items: [
    { t: 'media queries', k: true }, { t: 'mobile-first', k: true }, { t: 'clamp()', k: true },
    { t: 'aspect-ratio', k: true }, { t: 'prefers-color-scheme' }, { t: 'prefers-reduced-motion' },
    { t: 'container queries', a: true }, { t: 'cqw / cqh', a: true },
  ]},
  { label: 'SELETORES',    color: C, items: [
    { t: 'tag/class/id', k: true }, { t: 'combinadores (> ~ +)', k: true },
    { t: ':hover/:focus/:active' }, { t: ':nth-child' },
    { t: ':is() :where()', a: true }, { t: ':has()', a: true }, { t: ':focus-visible', a: true },
  ]},
  { label: 'VARIÁVEIS',    color: C, items: [
    { t: 'custom properties', k: true }, { t: 'var()', k: true },
    { t: 'cascata + escopo' }, { t: '@property (Houdini)', a: true },
    { t: 'temas via :root', a: true },
  ]},
  { label: 'TIPOGRAFIA',   color: C, items: [
    { t: 'font-family', k: true }, { t: 'font-size', k: true }, { t: 'line-height', k: true },
    { t: 'letter-spacing' }, { t: 'text-align' },
    { t: 'text-wrap: balance/pretty', a: true }, { t: 'font-display: swap', a: true }, { t: 'variable fonts', a: true },
  ]},
  { label: 'VISUAL',       color: C, items: [
    { t: 'background', k: true }, { t: 'border', k: true }, { t: 'box-shadow', k: true },
    { t: 'border-radius' }, { t: 'opacity' },
    { t: 'filter (blur, drop-shadow)' }, { t: 'backdrop-filter', a: true },
    { t: 'clip-path', a: true }, { t: 'mask', a: true },
  ]},
  { label: 'ANIMAÇÕES',    color: C, items: [
    { t: 'transition', k: true }, { t: '@keyframes', k: true }, { t: 'animation', k: true },
    { t: 'transform', k: true }, { t: 'cubic-bezier' },
    { t: 'scroll-driven', a: true }, { t: 'view-transitions', a: true },
  ]},
  { label: 'PERFORMANCE',  color: C, items: [
    { t: 'will-change', k: true }, { t: 'contain', k: true },
    { t: 'compositor (transform/opacity)' }, { t: 'paint vs layout' },
    { t: 'content-visibility: auto', a: true }, { t: 'contain-intrinsic-size', a: true },
  ]},
  { label: 'ARQUITETURA',  color: C, items: [
    { t: '@layer', k: true }, { t: 'BEM' }, { t: 'design tokens' },
    { t: 'CSS modules' }, { t: 'utility-first (Tailwind)' },
    { t: 'cascade layers em libs', a: true }, { t: 'design system completo', a: true },
  ]},
  { label: 'A11Y',         color: C, items: [
    { t: 'contrast ratio', k: true }, { t: ':focus-visible', k: true },
    { t: 'prefers-reduced-motion' }, { t: 'prefers-contrast' },
    { t: 'forced-colors mode', a: true }, { t: 'accent-color', a: true },
  ]},
  { label: 'MODERNO',      color: C, items: [
    { t: 'logical properties', a: true }, { t: 'color-mix()', a: true }, { t: 'oklch', a: true },
    { t: '@scope', a: true }, { t: '@starting-style', a: true }, { t: 'popover', a: true },
    { t: 'anchor positioning', a: true }, { t: 'field-sizing', a: true },
  ]},
]

const MINDMAP_CHECKLIST: string[] = [
  'Explique box-sizing — diferença entre content-box e border-box.',
  'Como funciona a cascade? Liste os 4 níveis de resolução de conflito.',
  'Como calcular especificidade? Exemplifique #a .b vs .a .b .c.',
  'Quando usar Flexbox vs Grid? Heurística da dimensão.',
  'O que é stacking context? Liste 4 triggers que criam um.',
  'Como funciona position: sticky? Quais são os gotchas comuns?',
  'O que é margin collapsing e em quais 3 cenários NÃO acontece?',
  'O que é Block Formatting Context (BFC)? Como criar?',
  'Diferença entre Custom Properties (CSS) e variáveis Sass.',
  'Como organizar @layer? Cite uma estratégia padrão.',
  'Como funciona o auto-placement do Grid? O que é o "fr seguro"?',
  'O que é aspect-ratio? Por que importa para CLS?',
  'O que é subgrid? Caso de uso real.',
  'Quais propriedades CSS HERDAM por padrão? E quais NÃO?',
  'Como funciona contain? E content-visibility: auto?',
  'Diferença entre clip-path e mask. Quando usar cada um?',
  'O que é will-change? Quando aplicar e quando NÃO?',
  'Como funcionam ::before e ::after? Limitações?',
  'Por que preferir margin-inline a margin-left? (logical properties)',
  'Quando usar container queries vs media queries?',
]

// ── Dados: Recipes ────────────────────────────────────────────────────────────────

const RECIPES: Recipe[] = [
  {
    title: 'Centralizar perfeitamente — flex e grid',
    category: 'Layout',
    goal: 'Centralizar um filho horizontal e verticalmente em qualquer container. Funciona com altura fixa ou dinâmica.',
    ingredients: [
      'Um container com altura definida (ou min-height)',
      'Um (ou mais) elementos filhos',
      'display: flex OU display: grid',
    ],
    steps: [
      {
        title: 'Versão flex',
        description: 'Tradicional, suporte universal. justify-content centra no eixo principal, align-items no cruzado.',
        code: `.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}`,
      },
      {
        title: 'Versão grid (mais curta)',
        description: 'place-items é atalho para align-items + justify-items. Uma linha resolve.',
        code: `.container {
  display: grid;
  place-items: center;
  min-height: 100vh;
}`,
      },
      {
        title: 'Centralizar texto inline',
        description: 'Quando o filho é texto/inline, text-align junto com flex centra perfeitamente.',
        code: `.container {
  display: grid;
  place-items: center;
  text-align: center; /* para texto que quebra linha */
}`,
      },
    ],
    pitfalls: [
      'min-height: 100vh quebra em mobile com address bar — use 100svh ou 100dvh.',
      'margin: 0 auto NÃO centraliza vertical em flex/grid — use align-items.',
    ],
  },
  {
    title: 'Sticky footer — footer no fim da página',
    category: 'Layout',
    goal: 'Footer fica grudado ao fim da janela quando o conteúdo é curto, e logo depois do conteúdo quando ele é longo. Sem JavaScript.',
    ingredients: [
      'body com display flex/grid',
      'Estrutura: header > main > footer',
      '100vh ou 100dvh no body',
    ],
    steps: [
      {
        title: 'Versão flex (suporte total)',
        description: 'main com flex: 1 ocupa todo espaço sobrando, empurrando footer para baixo.',
        code: `body {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  margin: 0;
}

main {
  flex: 1;
}`,
      },
      {
        title: 'Versão grid (mais explícita)',
        description: 'grid-template-rows: auto 1fr auto deixa só o main esticar.',
        code: `body {
  min-height: 100dvh;
  display: grid;
  grid-template-rows: auto 1fr auto;
  margin: 0;
}`,
      },
    ],
    pitfalls: [
      'Não esquecer min-height (não height) — height: 100vh corta conteúdo longo.',
      'margin: 0 no body é essencial — UA stylesheet adiciona 8px que vazam para fora.',
    ],
  },
  {
    title: 'Grid responsivo sem media queries',
    category: 'Layout',
    goal: 'Layout que se adapta de 1 a N colunas baseado no espaço disponível, sem escrever uma única @media.',
    ingredients: [
      'display: grid',
      'auto-fit + minmax + min()',
      'gap consistente',
    ],
    steps: [
      {
        title: 'A receita base',
        description: 'auto-fit colapsa colunas vazias. minmax define floor (200px) e fracional (1fr). min(100%, 200px) previne overflow em telas muito pequenas.',
        code: `.grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(min(100%, 240px), 1fr)
  );
  gap: 1rem;
}`,
      },
      {
        title: 'auto-fit vs auto-fill',
        description: 'auto-fit COLAPSA colunas vazias (estica os existentes). auto-fill MANTÉM colunas vazias (pode ter espaço sobrando).',
        code: `/* 4 itens em 1200px:
   auto-fit  → 4 colunas, cada uma cresce
   auto-fill → 4 colunas + 1 vazia */`,
      },
    ],
    pitfalls: [
      'Sem min(100%, 240px), em telas <240px o item estoura. min() previne.',
      'minmax(0, 1fr) é o "fr seguro" — resolve overflow de texto longo.',
    ],
    variations: [
      'auto-fill se quiser manter espaço para "futuros itens"',
      'masonry (em CSS Grid Level 3) para alturas variáveis sem JS',
    ],
  },
  {
    title: 'Tipografia fluida com clamp',
    category: 'Tipografia',
    goal: 'Tamanho de fonte que escala suavemente entre min e max conforme viewport. Sem media queries em escada.',
    ingredients: [
      'function clamp(min, ideal, max)',
      'Combinação de rem + vw para o ideal',
    ],
    steps: [
      {
        title: 'Headings fluidos',
        description: 'rem garante respeito a zoom acessível. vw faz escalar com viewport. clamp limita extremos.',
        code: `h1 {
  font-size: clamp(1.5rem, 4vw + 1rem, 3rem);
  line-height: 1.2;
  text-wrap: balance; /* equilibra quebras */
}

h2 {
  font-size: clamp(1.25rem, 2.5vw + 0.75rem, 2rem);
}

p {
  font-size: clamp(0.95rem, 1vw + 0.7rem, 1.1rem);
  max-width: 65ch; /* leitura confortável */
  text-wrap: pretty; /* evita órfãs */
}`,
      },
      {
        title: 'Padding e gap fluidos',
        description: 'Mesma técnica para spacing — cards, containers e gaps escalam juntos.',
        code: `.card {
  padding: clamp(1rem, 3vw, 2rem);
  border-radius: clamp(8px, 1vw, 16px);
}

.grid {
  gap: clamp(0.5rem, 2vw, 1.5rem);
}`,
      },
    ],
    pitfalls: [
      'Não use só vw — 5vw em mobile vira microscópico, em desktop gigantesco. Sempre clamp.',
      'min e max em rem (acessível). Ideal em vw + rem (escala mas tem floor).',
    ],
  },
  {
    title: 'Dark mode com Custom Properties',
    category: 'Theming',
    goal: 'Sistema de tema completo: tokens, toggle manual, fallback para preferência do sistema. Anima transição.',
    ingredients: [
      'CSS Custom Properties em :root',
      '[data-theme="dark"] como override',
      '@media (prefers-color-scheme: dark)',
    ],
    steps: [
      {
        title: 'Definir tokens light',
        description: 'Tokens semânticos (não nomes de cores). Use --bg, --fg, --muted — não --white, --black.',
        code: `:root {
  --bg:      #ffffff;
  --fg:      #0f172a;
  --muted:   #64748b;
  --accent:  #ef4444;
  --card:    #f8fafc;
  --border:  #e2e8f0;
}`,
      },
      {
        title: 'Override dark via attribute',
        description: 'Toggle manual via data-theme="dark" no html. JavaScript define o atributo.',
        code: `[data-theme="dark"] {
  --bg:     #0f172a;
  --fg:     #e2e8f0;
  --muted:  #94a3b8;
  --card:   #1e293b;
  --border: #334155;
}`,
      },
      {
        title: 'Fallback para sistema',
        description: 'Se o usuário não escolheu tema manual, segue prefers-color-scheme.',
        code: `@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg:     #0f172a;
    --fg:     #e2e8f0;
    --card:   #1e293b;
    --border: #334155;
  }
}`,
      },
      {
        title: 'Transição suave',
        description: 'Animar background e color faz a transição parecer instantânea (sem flash).',
        code: `body {
  background: var(--bg);
  color: var(--fg);
  transition: background 200ms, color 200ms;
}`,
      },
    ],
    pitfalls: [
      'FOUC (flash) ao recarregar — defina o tema ANTES do CSS carregar (no <head> via inline script).',
      'Não anime border-color de tudo — pode ficar "espumante".',
    ],
  },
  {
    title: 'Container query em card reutilizável',
    category: 'Responsivo',
    goal: 'Card que vira horizontal quando tem espaço (>400px) e vertical quando está apertado. Independe da viewport.',
    ingredients: [
      'container-type: inline-size no pai',
      '@container query no card',
      'Layout grid para o card',
    ],
    steps: [
      {
        title: 'Declarar o container',
        description: 'O PAI direto do card precisa container-type. inline-size = só largura (mais comum).',
        code: `.card-list {
  container-type: inline-size;
  /* opcional: container-name para queries nomeadas */
}`,
      },
      {
        title: 'Card vertical (default mobile)',
        description: 'Sem media query — começa simples para o caso pequeno.',
        code: `.card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.card img {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}`,
      },
      {
        title: 'Container query — vira horizontal',
        description: 'Quando o container tem >= 400px, vira grid horizontal. NÃO é viewport.',
        code: `@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 200px 1fr;
    align-items: center;
  }

  .card img {
    aspect-ratio: 1; /* quadrado quando horizontal */
  }
}`,
      },
    ],
    pitfalls: [
      'container-type: inline-size cria CONTAINMENT — afeta cálculo de width.',
      'position: fixed dentro do container ancora no container, não viewport.',
    ],
    variations: [
      'cqw/cqh para tipografia: font-size: 4cqw escala com o container',
      'container-name para múltiplos containers aninhados',
    ],
  },
  {
    title: 'Subgrid — cards alinhados como antes só com JS',
    category: 'Layout',
    goal: 'Header, body e footer de cada card alinham horizontalmente entre cards, mesmo com conteúdo variável.',
    ingredients: [
      'Grid pai com tracks definidos',
      'subgrid no card filho',
      'grid-row: span N',
    ],
    steps: [
      {
        title: 'Grid pai define tracks',
        description: 'O pai precisa ter rows explícitas — header, body, footer.',
        code: `.card-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  grid-template-rows: auto 1fr auto;
  gap: 1.5rem;
}`,
      },
      {
        title: 'Card herda tracks com subgrid',
        description: 'span 3 = ocupa as 3 rows do pai. subgrid em rows = herda os mesmos tracks.',
        code: `.card {
  display: grid;
  grid-row: span 3;
  grid-template-rows: subgrid;
  gap: 1rem;
  padding: 1rem;
}

.card-header { /* row 1 */ }
.card-body   { /* row 2 — flex: 1 implícito */ }
.card-footer { /* row 3 */ }`,
      },
    ],
    pitfalls: [
      'Suporte: Firefox 2019, Safari 16+, Chrome 117+. Para fallback, use altura mínima fixa.',
      'Subgrid em columns também funciona — útil para tabelas.',
    ],
  },
  {
    title: 'Scroll-driven progress bar — sem JavaScript',
    category: 'Animações',
    goal: 'Barra de progresso no topo da página que enche conforme o usuário rola. Performance perfeita, zero JS.',
    ingredients: [
      '@keyframes para o estado final',
      'animation-timeline: scroll()',
      'transform-origin para animar do começo',
    ],
    steps: [
      {
        title: 'HTML mínimo',
        description: 'Um único div fixo no topo. Sem inputs, sem listeners.',
        code: `<div class="progress"></div>`,
      },
      {
        title: 'CSS — barra fixa',
        description: 'Barra fina no topo, transforma origin à esquerda para escalar do início.',
        code: `.progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--accent);
  transform-origin: 0 50%;
  transform: scaleX(0);
  z-index: 999;
}`,
      },
      {
        title: 'Animação ligada ao scroll',
        description: 'animation-timeline: scroll() amarra a animação ao scroll do root. Linear é essencial — quer 1:1.',
        code: `@keyframes grow {
  to { transform: scaleX(1); }
}

.progress {
  animation: grow linear;
  animation-timeline: scroll();
}`,
      },
    ],
    pitfalls: [
      'Suporte: Chrome 115+, Edge 115+. Safari/Firefox ainda não — use feature query @supports.',
      'Sempre teste com prefers-reduced-motion — desativar para usuários sensíveis.',
    ],
    variations: [
      'animation-timeline: view() para revelar elementos quando entram no viewport',
      'animation-range: cover 0% cover 100% controla a "janela" da animação',
    ],
  },
]

// ── Registry de Builders ──────────────────────────────────────────────────────────

const PDF_BUILDERS: Record<string, PdfBuilderFn> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'CSS',
    stackLabel: 'CSS3 / 2024+',
    badgeLabel: 'Q&A Review',
    coverTitle: 'As 22 perguntas mais cobradas em entrevista CSS',
    coverSubtitle: 'Respostas estruturadas para nível pleno e sênior. Use para revisão ativa: leia a pergunta, tente responder de cabeça, depois confira.',
  }),

  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'CSS',
    accentColor: C,
    stackLabel: 'CSS3 / 2024+',
    coverTitle: 'CSS — propriedades, seletores, regras e modernidade',
    coverSubtitle: 'Referência densa em poucas páginas. Box, flex, grid, posicionamento, custom properties, funções, seletores e features de 2024+.',
    sections: {
      hooks: HOOKS,
      hooksExtra: HOOKS_R19,
      depRows: DEP_ROWS,
      rules: HOOK_RULES,
      performanceTips: PERFORMANCE_TIPS,
      patterns: PATTERNS,
      mentalModels: MENTAL_MODELS,
    },
  }),

  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'CSS',
    stackLabel: 'CSS3 / 2024+',
    coverTitle: 'Os 6 truques que grudam CSS na memória',
    coverSubtitle: 'OLEO para cascade, 1-10-100-1000 para especificidade, JADE para flex, FOG para margin collapse, MaBoPaCo para box model, POTI para stacking. Repita em voz alta.',
  }),

  antipatterns: () => buildAntipatternsPdf({
    antipatterns: ANTIPATTERNS,
    accentColor: C,
    skillName: 'CSS',
    stackLabel: 'CSS3 / 2024+',
    coverTitle: 'Os 8 erros que aparecem em code review de CSS',
    coverSubtitle: 'Cada anti-pattern com código errado x correto e a explicação técnica de por que quebra. Reconhecimento de padrão é mais rápido que pensar do zero.',
  }),

  mindmap: () => buildMindmapPdf({
    categories: MINDMAP_CATEGORIES,
    checklist: MINDMAP_CHECKLIST,
    accentColor: C,
    skillName: 'CSS',
    stackLabel: 'CSS3 / 2024+',
    coverTitle: 'CSS do zero ao sênior em uma folha',
    coverSubtitle: '12 categorias do ecossistema CSS e checklist de 20 perguntas para auto-avaliar o domínio. Use para identificar gaps antes de uma entrevista.',
  }),

  recipes: () => buildRecipeBookPdf({
    recipes: RECIPES,
    accentColor: C,
    skillName: 'CSS',
    stackLabel: 'CSS3 / 2024+',
    coverTitle: '8 receitas modernas que todo dev de CSS deveria saber de cabeça',
    coverSubtitle: 'Centralizar, sticky footer, grid responsivo, tipografia fluida com clamp, dark mode com tokens, container query em card, subgrid e scroll-driven progress bar. Soluções prontas com objetivo, ingredientes, passos e armadilhas.',
  }),
}

// ── Main Export ───────────────────────────────────────────────────────────────────

export default function CssPdfs() {
  const [open, setOpen] = useState<PdfCard | null>(null)

  const featured = PDF_CARDS.find(c => c.featured)
  const collection = PDF_CARDS.filter(c => !c.featured)

  return (
    <div style={{ fontFamily: "'JetBrains Mono',monospace" }}>
      {/* Cabeçalho */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
          <p style={{ color: FG, fontSize: 16, fontWeight: 800, margin: 0, letterSpacing: 0.3 }}>CSS — Guias de bolso</p>
          <span style={{ color: C, fontSize: 11, padding: '3px 9px', borderRadius: 999, background: `${C}15`, border: `1px solid ${C}44`, fontWeight: 700 }}>
            6 PDFs · 25 páginas
          </span>
        </div>
        <p style={{ color: FGMUTE, fontSize: 12, margin: 0, lineHeight: 1.65, maxWidth: 720 }}>
          Artefatos de revisão cognitiva para estudo espaçado. Cada PDF é pensado para um objetivo diferente — recuperação ativa, consulta rápida, memória de longo prazo, reconhecimento de padrão e mapeamento mental do ecossistema CSS inteiro.
        </p>
      </div>

      {/* Seção: Destaque */}
      {featured && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 10, color: C, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', fontFamily: "'JetBrains Mono',monospace" }}>
              Destaque
            </span>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${C}55, transparent)` }} />
          </div>
          <HeroCard card={featured} onOpen={() => setOpen(featured)} accent={C} />
        </div>
      )}

      {/* Seção: Coleção */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 10, color: C, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase' }}>
            Coleção · {collection.length} PDFs
          </span>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${C}55, transparent)` }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {collection.map(card => (
            <CollectionCard key={card.id} card={card} onOpen={() => setOpen(card)} accent={C} />
          ))}
        </div>
      </div>

      {open && <PdfModal card={open} onClose={() => setOpen(null)} builders={PDF_BUILDERS} />}
    </div>
  )
}
