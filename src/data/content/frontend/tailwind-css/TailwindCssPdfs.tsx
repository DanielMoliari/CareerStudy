'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildCheatsheetPdf } from '@/components/pdfs/CheatsheetPdf'
import type { HookItem, PatternItem, DepRow, RuleItem } from '@/components/pdfs/CheatsheetPdf'
import { buildAntipatternsPdf } from '@/components/pdfs/AntipatternsPdf'
import type { AntiPatternItem } from '@/components/pdfs/AntipatternsPdf'
import { buildMindmapPdf } from '@/components/pdfs/MindmapPdf'
import type { MindmapCategory } from '@/components/pdfs/MindmapPdf'
import { buildQuickRefPdf } from '@/components/pdfs/QuickRefPdf'
import type { QuickRefColumn } from '@/components/pdfs/QuickRefPdf'

// ── Paleta Tailwind CSS ──────────────────────────────────────────────────────────
const C      = '#38BDF8'
const GRN    = '#4ade80'
const AMB    = '#f59e0b'
const PRP    = '#a78bfa'
const RED    = '#ef4444'
const PINK   = '#f472b6'

// ── Metadados dos PDFs ────────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas em entrevista',
    type: 'qa',
    pages: 9,
    description: 'Recuperação ativa: 20 perguntas de Tailwind CSS — utility-first, JIT, tailwind-merge, cva, dark mode, CSS variables, breakpoints, arbitrary values, content[], @apply, shadcn/ui e Tailwind v4 — com resposta estruturada para nível pleno e sênior.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet',
    subtitle: 'Classes por categoria, variantes e configuração',
    type: 'cheatsheet',
    pages: 3,
    description: 'Referência densa: classes de layout/spacing/typography/colors/effects, todos os prefixos de variantes (hover:, dark:, md:, group-hover:, peer), configuração do tailwind.config e padrões com cn()/cva. Tudo que você precisa sem abrir a documentação.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'quick-ref',
    title: 'Quick Ref',
    subtitle: 'Referência ultra-compacta das classes mais usadas',
    type: 'quick-ref',
    pages: 1,
    description: 'Cartão A4 landscape com as classes mais usadas organizadas por categoria: layout, spacing, typography, colors, borders, effects e variantes. Imprima e cole no monitor.',
    icon: '03',
    goal: 'Referência rápida',
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns',
    subtitle: 'Os 5 erros mais comuns — e como corrigir',
    type: 'antipatterns',
    pages: 3,
    description: 'Os anti-patterns mais comuns: classes dinâmicas por interpolação, @apply desnecessário, concatenar sem tailwind-merge, arquivos fora do content[], !important abuse. Com código errado × correto e explicação do porquê.',
    icon: '04',
    goal: 'Reconhecimento de padrão',
  },
  {
    id: 'mindmap',
    title: 'Mind Map',
    subtitle: 'Tailwind do zero ao sênior em uma folha',
    type: 'mindmap',
    pages: 2,
    description: 'Mapa mental completo com 8 categorias — classes utilitárias, variantes, configuração, dark mode, composição, ecossistema, performance e comparação — com checklist de 20 perguntas de entrevista.',
    icon: '05',
    goal: 'Mapeamento mental',
  },
]

// ── Dados: Q&A ────────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'O que é utility-first CSS e qual o tradeoff em relação ao CSS tradicional?',
    a: 'Utility-first: classes atômicas de propósito único (flex, p-4, text-blue-500) aplicadas diretamente no HTML/JSX. Sem naming de classes (adeus BEM), sem CSS morto (JIT gera só o que usa), hover/responsive sem media queries manuais. Tradeoffs: JSX verboso com muitas classes, legibilidade inicial menor. Resolvidos por cn(), cva e componentes bem nomeados.',
    bullets: [
      'JIT elimina CSS morto — bundle contém apenas classes usadas.',
      'Sem cascade inesperada — cada classe é atômica e independente.',
      'Desvantagem honesta: JSX verboso, legibilidade inicial menor para quem não conhece.',
    ],
    tip: 'Citar JIT como eliminador de CSS morto e mencionar os tradeoffs honestamente mostra maturidade.',
  },
  {
    level: 'Pleno',
    q: 'Por que usar tailwind-merge em vez de concatenar strings de classes?',
    a: 'Quando duas classes Tailwind afetam a mesma propriedade CSS (bg-red-500 e bg-blue-500), quem vence depende da ordem no CSS gerado pelo Tailwind — não da ordem no JSX. tailwind-merge detecta conflitos e mantém apenas a última: twMerge("px-4", "px-8") → "px-8". Essencial em componentes que aceitam className como prop.',
    bullets: [
      'O problema: ordem no CSS gerado, não no JSX — comportamento imprevisível.',
      'tailwind-merge resolve deterministicamente: a mais específica/última sempre vence.',
      'cn() = clsx + twMerge — padrão em qualquer component library com Tailwind.',
    ],
    tip: 'Demonstrar o problema de especificidade implícita — não só a solução cn() — é diferencial real.',
  },
  {
    level: 'Pleno',
    q: 'Como criar componentes com variantes type-safe usando Tailwind?',
    a: 'Com cva (class-variance-authority): define variants (variant, size, intent) como objeto, cva retorna função que recebe os props e gera a string de classes. Completamente integrado com TypeScript — VariantProps<typeof buttonVariants> extrai os tipos automaticamente. Padrão profissional para Button, Badge, Input.',
    bullets: [
      'cva + cn() + VariantProps é o padrão de qualquer design system moderno.',
      'cva gera classes base+variante; cn() combina com className externo sem conflitos.',
      'Autocomplete e type safety nas variantes — erra no compilador, não em runtime.',
    ],
    tip: 'Mostrar o padrão cva + cn() + VariantProps diferencia quem usa Tailwind profissionalmente.',
  },
  {
    level: 'Pleno',
    q: 'Por que classes dinâmicas como `bg-${color}-500` não funcionam?',
    a: 'Tailwind analisa o código em build time via regex buscando strings completas. Classes construídas por interpolação não aparecem como string completa — o scanner não as detecta e elas não são incluídas no CSS gerado. Solução: mapa de classes completas ou safelist no tailwind.config.',
    bullets: [
      'bg-" + color + "-500 nunca aparece como string completa para o scanner.',
      'Solução 1: mapa { red: "bg-red-500", blue: "bg-blue-500" }[color].',
      'Solução 2: safelist: [{ pattern: /bg-(red|blue)-500/ }] no config.',
    ],
    tip: 'O gotcha das classes dinâmicas é o mais comum em produção. Mostrar a solução com mapa é o diferencial.',
  },
  {
    level: 'Pleno',
    q: 'Como Tailwind lida com dark mode?',
    a: 'Duas estratégias: "class" (recomendado) e "media". Com "class": adicione dark: prefix nas classes e toggle a classe "dark" no html via JavaScript. Com "media": usa prefers-color-scheme automaticamente. Abordagem profissional: CSS variables em :root/.dark, tokens semânticos no tailwind.config — troca tema sem dark: em cada elemento.',
    bullets: [
      '"class" dá controle ao usuário — "media" segue o SO sem opção manual.',
      'CSS variables: bg-primary muda automaticamente com .dark — sem dark: em cada elemento.',
      'Padrão shadcn/ui: --background, --foreground como CSS variables mapeadas no config.',
    ],
    tip: 'Apresentar CSS variables vs prefixos dark: mostra conhecimento do padrão shadcn/ui moderno.',
  },
  {
    level: 'Pleno',
    q: 'Quais são os breakpoints padrão e como funciona o mobile-first?',
    a: 'sm=640px, md=768px, lg=1024px, xl=1280px, 2xl=1536px. Mobile-first: sem prefixo = todos os tamanhos. Com prefixo = a partir daquele tamanho para cima. Para desktops primeiro: max-lg:hidden aplica até lg. Combine breakpoints com qualquer variant: md:hover:bg-sky-600.',
    bullets: [
      'Sem prefixo = mobile (base). Prefixo = min-width query.',
      'max-: para desktop-first excepcional: max-md:hidden.',
      'Container queries: @lg:flex (baseado no pai, não na viewport).',
    ],
    tip: 'Decorar os 5 breakpoints em px é diferencial direto em entrevista.',
  },
  {
    level: 'Pleno',
    q: 'O que são arbitrary values e quando usar?',
    a: 'Colchetes permitem qualquer valor CSS como classe Tailwind: w-[327px], text-[#1a2b3c], grid-cols-[1fr_2fr], h-[calc(100vh-4rem)]. JIT gera o CSS em build time. Regra: use quando o valor é único. Se aparece 3+ vezes, crie token no theme.extend — dá semântica e manutenibilidade.',
    bullets: [
      'Underscores viram espaços: grid-cols-[1fr_2fr] → grid-template-columns: 1fr 2fr.',
      'Regra: 1-2 vezes = arbitrary value ok, 3+ vezes = token no config.',
      'Também funciona para propriedades CSS não cobertas pelo Tailwind padrão.',
    ],
    tip: 'A regra "2 vezes=ok, 3+=token" mostra que você usa arbitrary values com critério.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona o content detection e quais arquivos incluir?',
    a: 'O campo content no tailwind.config define quais arquivos o scanner analisa. Deve incluir todos os arquivos com classes Tailwind. Gotcha: arquivos fora do content aparecem em dev (JIT mais agressivo) mas somem em produção. Tailwind v4 elimina isso com detecção automática.',
    bullets: [
      'content: ["./src/**/*.{ts,tsx}"] cobre app/, components/, lib/.',
      'Gotcha: funciona em dev, some em produção — sempre teste npm run build.',
      'Tailwind v4: sem content manual — detecção automática pelo engine Oxide.',
    ],
    tip: '"Funciona em dev, some em produção" é o bug mais doloroso. Saber explicar o porquê demonstra experiência.',
  },
  {
    level: 'Pleno',
    q: 'Quando usar @apply vs componentes React?',
    a: '@apply: HTML gerado por terceiros que você não controla — markdown de CMS, libs que geram HTML puro, resets globais de elementos (h1, a, p) em arquivo de prosa. Componentes: qualquer elemento com variações de props. Regra: se você copia as mesmas classes em 2-3+ lugares → componente. Se HTML vem de CMS → @apply.',
    bullets: [
      '@apply válido para: .prose h1, .prose p em markdown/CMS.',
      '@apply inválido para: botões, cards, qualquer componente React/Vue.',
      'Saber quando NÃO usar @apply é o que separa uso profissional do amador.',
    ],
    tip: 'Saber quando NÃO usar @apply é o diferencial — entrevistadores testam exatamente isso.',
  },
  {
    level: 'Senior',
    q: 'Como você configuraria Tailwind para um design system com múltiplas marcas?',
    a: 'CSS variables em camadas: tokens primitivos (valores brutos), tokens semânticos (--color-primary, --color-surface) em :root, por marca: redefina as variáveis em data-theme="marca-a". Tailwind fica genérico: usa apenas nomes semânticos (bg-primary). Trocar tema = trocar as CSS variables. Zero rebuild.',
    bullets: [
      'Primitivos: --cyan-500: #06B6D4 (não mudam entre marcas).',
      'Semânticos: --color-primary mapeado para primitivo conforme o tema.',
      'Resultado: bg-primary funciona em qualquer tema sem rebuild.',
    ],
    tip: 'A distinção primitivo vs semântico é o que separa quem construiu um design system de quem só consumiu.',
  },
  {
    level: 'Senior',
    q: 'Como funciona tailwind-merge e por que é necessário com className?',
    a: 'Concatenação ingênua (px-4 + px-8 → "px-4 px-8") tem comportamento dependente da ordem no CSS gerado — não do JSX. tailwind-merge conhece todas as classes Tailwind e resolve conflitos: a mais específica/última vence. Sem ele, override de className em componentes é frágil e depende da ordem de importação.',
    bullets: [
      'twMerge("px-4 py-2", "px-8") → "py-2 px-8" — px-4 removido.',
      'Sem tailwind-merge: px-4 ou px-8 vence dependendo do CSS gerado — imprevisível.',
      'cn() = clsx (condições) + twMerge (conflitos) — as duas necessidades cobertas.',
    ],
    tip: 'O problema de especificidade implícita no CSS gerado — e não só a solução — é o que diferencia o entendimento profundo.',
  },
  {
    level: 'Senior',
    q: 'Como customizar o design system do Tailwind (cores, espaçamentos, fontes)?',
    a: 'theme.extend adiciona sem sobrescrever o padrão; theme substitui completamente. Para valores dinâmicos (dark mode, multi-theme): use CSS custom properties como valor. colors: { primary: "hsl(var(--color-primary) / <alpha-value>)" } gera bg-primary/50 com opacidade automática.',
    bullets: [
      'extend (adiciona) vs theme (substitui) — gotcha mais comum ao configurar.',
      '"hsl(var() / <alpha-value>)" habilita bg-primary/50 — opacidade funciona.',
      'satisfies Config para type safety completa no arquivo de config.',
    ],
    tip: 'A diferença extend vs theme e o padrão com alpha-value demonstram nível sênior.',
  },
  {
    level: 'Senior',
    q: 'Como integrar Tailwind com shadcn/ui e Radix UI?',
    a: 'shadcn/ui: componentes com cva + cn() + CSS variables no globals.css para theming. Customização: edite as CSS variables para mudar o tema inteiro, edite o componente diretamente (shadcn é copy-paste). Radix puro: estilize com className e use data-[state=open]: para estados do Radix — JIT gera as classes data-* automaticamente.',
    bullets: [
      'shadcn/ui theming: --primary, --background como CSS variables no :root/.dark.',
      'Radix puro: data-[state=open]:opacity-100 — JIT detecta data-* variants.',
      'cn() em todos os componentes que aceitam className — merge correto.',
    ],
    tip: 'Explicar o modelo de CSS variables do shadcn/ui mostra que você integrou de verdade.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona group e group-hover?',
    a: 'Adicione group no elemento pai. Filhos podem usar group-hover:, group-focus:, group-active:. O filho reage ao estado do ancestral com classe group. Para múltiplos grupos aninhados: group/{name} no pai e group-hover/{name}: no filho — especifica qual grupo disparou.',
    bullets: [
      'group no pai + group-hover: no filho — filho reage ao hover do pai.',
      'group/{name}: para múltiplos grupos aninhados sem conflito.',
      'Combinações: group-hover:opacity-100 group-hover:translate-x-1 simultâneos.',
    ],
    tip: 'Demonstrar group nomeado (group/{name}) mostra que você já usou em cenários complexos.',
  },
  {
    level: 'Pleno',
    q: 'O que é peer e como funciona?',
    a: 'peer no elemento irmão anterior. Outro elemento usa peer-checked:, peer-focus:, peer-invalid: para reagir ao estado do peer. O peer DEVE ser um irmão anterior no DOM — não funciona com filho, pai ou irmão posterior. Ideal para: custom checkboxes/toggles, validação de form visível sem JavaScript.',
    bullets: [
      'peer deve ser irmão ANTERIOR no DOM — irmão posterior não funciona.',
      'peer-checked: (checkbox), peer-focus:, peer-invalid: para validação.',
      'peer/{name}: para múltiplos peers na mesma hierarquia.',
    ],
    tip: 'A limitação "irmão anterior" é o gotcha do peer — quem já usou sabe na prática.',
  },
  {
    level: 'Senior',
    q: 'O que é Tailwind v4 e quais as principais mudanças?',
    a: 'Tailwind v4 reescreve o engine em Rust (Oxide) — até 10x mais rápido. A configuração migra de tailwind.config.ts para CSS puro com @theme. Zero arquivo JS necessário para projetos simples. @import "tailwindcss" substitui diretivas. Automatic content detection — sem array content manual.',
    bullets: [
      'Engine Oxide (Rust): 10x mais rápido que PostCSS puro.',
      '@theme em CSS: --color-primary: oklch(0.6 0.15 200) no lugar de tailwind.config.',
      'Automatic content detection: sem content[] manual.',
    ],
    tip: 'Citar Oxide (Rust) e @theme CSS-first mostra que você acompanha a evolução do framework.',
  },
  {
    level: 'Pleno',
    q: 'Como usar Tailwind com formulários e estados de validação?',
    a: 'Classes para estados de form: focus:ring-2 (foco visível), disabled:opacity-50 (desabilitado), peer-invalid:border-red-500 (campo inválido reagindo ao irmão). Para formulários complexos, use shadcn/ui Form + Zod — estados de erro gerenciados automaticamente.',
    bullets: [
      'focus-visible: para foco via teclado (melhor a11y que focus:).',
      'peer-invalid: no label/message reage ao estado de validação do input irmão.',
      'aria-invalid para estados de erro accessible com data-[state=invalid]:border-red-500.',
    ],
    tip: 'Mencionar focus-visible vs focus (a11y) e peer-invalid para validação mostra cuidado com acessibilidade.',
  },
  {
    level: 'Senior',
    q: 'Como otimizar o bundle de CSS do Tailwind para projetos grandes?',
    a: 'O JIT já é otimizado — apenas classes usadas. Boas práticas adicionais: evite arbitrary values que se repetem (use tokens), prefira variantes semânticas (bg-primary) sobre cores diretas, use safelist com moderação, analise o bundle com tailwind-bundle-size. Em monorepos: preset compartilhado com tokens comuns.',
    bullets: [
      'Arbitrary values repetidos geram CSS duplicado — use tokens no config.',
      'safelist conservador: apenas classes verdadeiramente dinâmicas que o scanner não detecta.',
      'Monorepo: preset Tailwind compartilhado garante tokens consistentes sem duplicação.',
    ],
    tip: 'O ponto sobre arbitrary values gerando duplicação é o detalhe de performance que separa iniciante de sênior.',
  },
  {
    level: 'Senior',
    q: 'Como fazer container queries com Tailwind?',
    a: 'Tailwind v3.2+ tem plugin de container queries: @lg:flex aplica quando o container pai é maior que lg. Diferente de breakpoints de viewport — reage ao tamanho do pai, não da janela. Ideal para componentes reutilizáveis em contextos de largura variada.',
    bullets: [
      '@container no pai + @lg:flex no filho — reage ao pai, não à viewport.',
      'Plugin oficial: tailwindcss-container-queries.',
      'Tailwind v4: container queries nativo sem plugin.',
    ],
    tip: 'Container queries é um diferencial real — poucos desenvolvedores sabem usar.',
  },
  {
    level: 'Senior',
    q: 'Como usar Tailwind em Server Components do Next.js App Router?',
    a: 'Tailwind é CSS estático — funciona perfeitamente em Server Components sem nenhuma mudança. Zero runtime no cliente, zero hydration overhead. Diferente de CSS-in-JS (Styled Components) que precisa de runtime e tem problemas com App Router. Essa é a vantagem competitiva do Tailwind em stacks Next.js modernas.',
    bullets: [
      'CSS estático: nenhum JavaScript no cliente — funciona em Server Components.',
      'Styled Components com App Router requer workarounds complexos.',
      'JIT gera o CSS em build time — sem overhead de runtime.',
    ],
    tip: 'A comparação com CSS-in-JS em Server Components é o diferencial que demonstra experiência com Next.js App Router.',
  },
]

// ── Dados: Cheatsheet ────────────────────────────────────────────────────────────

const CS_HOOKS: HookItem[] = [
  { name: 'flex / flex-col',           sig: 'display: flex / flex-direction: column',                    desc: 'Layout flexível — base de qualquer design responsivo' },
  { name: 'grid grid-cols-{n}',        sig: 'display: grid; grid-template-columns: repeat(n, 1fr)',       desc: 'Layout em grade — combine com col-span para estruturas complexas' },
  { name: 'p-{n} / px-{n} / py-{n}',  sig: 'padding: n×0.25rem / padding-x / padding-y',                desc: 'Escala de espaçamento: p-1=4px, p-2=8px, p-4=16px, p-8=32px' },
  { name: 'text-{size}',               sig: 'font-size: xs=0.75 / sm=0.875 / base=1 / lg=1.125 / xl=1.25rem', desc: 'Escala tipográfica — combine com font-{weight} e leading-{size}' },
  { name: 'hover: / focus: / dark:',   sig: 'Gera seletor condicional: :hover, :focus, .dark &',         desc: 'Variants de estado — combine com qualquer utility' },
]

const CS_PATTERNS: PatternItem[] = [
  {
    name: 'cn() helper',
    code: 'function cn(...i: ClassValue[]) { return twMerge(clsx(i)) }',
    desc: 'clsx para condições + tailwind-merge para conflitos — padrão em todo projeto profissional',
  },
  {
    name: 'cva com variantes',
    code: 'const btn = cva("base", { variants: { v: { a: "classes" } }, defaultVariants: { v: "a" } })',
    desc: 'Variantes type-safe com VariantProps<typeof btn> para type safety completa',
  },
  {
    name: 'Dark mode com CSS variables',
    code: ':root { --color-bg: 255 255 255 } .dark { --color-bg: 15 23 42 } → bg-[rgb(var(--color-bg))]',
    desc: 'Tokens semânticos via CSS variables — troca tema sem dark: em cada elemento',
  },
  {
    name: 'Responsive mobile-first',
    code: '<div class="text-sm md:text-base lg:text-lg xl:grid-cols-3">',
    desc: 'Sem prefixo = mobile base. Prefixo = a partir daquele breakpoint para cima',
  },
  {
    name: 'Arbitrary values para casos únicos',
    code: 'w-[327px] h-[calc(100vh-4rem)] grid-cols-[1fr_2fr] bg-[#1a2b3c]',
    desc: 'Underscores → espaços. Use para valores únicos — se repetir 3x, vira token no config',
  },
]

const CS_DEP_ROWS: DepRow[] = [
  ['sm: (≥640px)',   'Smartphone landscape, telas pequenas'],
  ['md: (≥768px)',   'Tablet — layout de 2 colunas geralmente começa aqui'],
  ['lg: (≥1024px)',  'Laptop — layout de 3 colunas, sidebars'],
  ['xl: (≥1280px)',  'Desktop — max-width containers'],
  ['2xl: (≥1536px)', 'Wide screens — conteúdo muito largo'],
  ['max-md:',        'Desktop-first excepcional — aplica até md (não acima)'],
  ['hover:',         'Mouse hover — não use para informação crítica (touchscreen)'],
  ['focus-visible:', 'Foco via teclado (melhor a11y que focus:)'],
  ['dark:',          'Dark mode — combine com CSS variables para escalabilidade'],
  ['group-hover:',   'Filho reage ao hover do pai com classe .group'],
  ['peer-checked:',  'Elemento reage ao estado do irmão anterior com classe .peer'],
  ['data-[state=*]:', 'Estiliza por atributo data-* — ideal para componentes Radix UI'],
]

const CS_RULES: RuleItem[] = [
  { ok: true,  t: 'Use mapa de classes completas para valores dinâmicos: { red: "bg-red-500" }[color]' },
  { ok: false, t: 'Interpolação de string: `bg-${color}-500` — scanner não detecta' },
  { ok: true,  t: 'cn() para combinar classes — resolve conflitos com tailwind-merge' },
  { ok: false, t: 'Concatenar strings de classes sem tailwind-merge — comportamento imprevisível' },
  { ok: true,  t: 'theme.extend para adicionar tokens sem sobrescrever o padrão' },
  { ok: false, t: 'Modificar theme (sem extend) — sobrescreve cores, spacing etc. do padrão' },
  { ok: true,  t: '@apply para HTML de terceiros (CMS, markdown) que você não controla' },
  { ok: false, t: '@apply em componentes React — use componente com cva ao invés' },
]

const CS_TIPS: string[] = [
  'Classes fora do content[] aparecem em dev mas somem em produção — sempre teste npm run build',
  'bg-primary/50 com opacity só funciona com hsl(var() / <alpha-value>) no config',
  'peer deve ser um irmão ANTERIOR no DOM — irmão posterior não funciona',
  'Tailwind IntelliSense no VS Code é obrigatório — instale antes de começar',
  'group/{name} para múltiplos grupos aninhados sem conflito de variants',
]

const CS_MENTAL_MODELS: string[] = [
  'Utility-first = composição no HTML, não no CSS. O estilo vai com o markup.',
  'JIT = scanner + geração sob demanda. Só existe no bundle o que o scanner encontrou.',
  'Tailwind não é CSS-in-JS. É CSS estático gerado em build time — funciona em Server Components.',
]

// ── Dados: Quick Ref ────────────────────────────────────────────────────────────

const QUICK_REF_COLUMNS: QuickRefColumn[] = [
  {
    sections: [
      {
        title: 'Layout',
        entries: [
          { key: 'flex',                value: 'display: flex' },
          { key: 'flex-col',            value: 'flex-direction: column' },
          { key: 'items-center',        value: 'align-items: center' },
          { key: 'justify-between',     value: 'justify-content: space-between' },
          { key: 'gap-4',               value: 'gap: 1rem' },
          { key: 'grid',                value: 'display: grid' },
          { key: 'grid-cols-3',         value: 'repeat(3, 1fr)' },
          { key: 'col-span-2',          value: 'grid-column: span 2' },
          { key: 'w-full / w-1/2',      value: '100% / 50%' },
          { key: 'h-screen',            value: 'height: 100vh' },
          { key: 'mx-auto',             value: 'margin: 0 auto' },
          { key: 'overflow-hidden',     value: 'overflow: hidden' },
          { key: 'relative / absolute', value: 'position: relative/absolute' },
          { key: 'z-10',                value: 'z-index: 10' },
        ],
      },
      {
        title: 'Spacing (×0.25rem)',
        entries: [
          { key: 'p-1',   value: '4px',  badge: '0.25rem', badgeColor: '#94a3b8' },
          { key: 'p-2',   value: '8px',  badge: '0.5rem',  badgeColor: '#94a3b8' },
          { key: 'p-4',   value: '16px', badge: '1rem',    badgeColor: '#38BDF8' },
          { key: 'p-6',   value: '24px', badge: '1.5rem',  badgeColor: '#38BDF8' },
          { key: 'p-8',   value: '32px', badge: '2rem',    badgeColor: '#38BDF8' },
          { key: 'p-12',  value: '48px', badge: '3rem',    badgeColor: '#94a3b8' },
          { key: 'p-16',  value: '64px', badge: '4rem',    badgeColor: '#94a3b8' },
          { key: 'px / py / pt / pb', value: 'inline / block / top / bottom' },
          { key: 'space-y-4',          value: 'gap vertical entre filhos' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Typography',
        entries: [
          { key: 'text-xs',       value: '0.75rem',   badge: '12px', badgeColor: '#94a3b8' },
          { key: 'text-sm',       value: '0.875rem',  badge: '14px', badgeColor: '#94a3b8' },
          { key: 'text-base',     value: '1rem',      badge: '16px', badgeColor: '#38BDF8' },
          { key: 'text-lg',       value: '1.125rem',  badge: '18px', badgeColor: '#38BDF8' },
          { key: 'text-xl',       value: '1.25rem',   badge: '20px', badgeColor: '#38BDF8' },
          { key: 'text-2xl',      value: '1.5rem',    badge: '24px', badgeColor: '#4ade80' },
          { key: 'font-medium',   value: '500',       badge: 'weight', badgeColor: '#94a3b8' },
          { key: 'font-semibold', value: '600',       badge: 'weight', badgeColor: '#94a3b8' },
          { key: 'font-bold',     value: '700',       badge: 'weight', badgeColor: '#38BDF8' },
          { key: 'leading-relaxed', value: 'line-height: 1.625' },
          { key: 'tracking-tight', value: 'letter-spacing: -0.025em' },
          { key: 'truncate',      value: 'overflow: hidden, ellipsis' },
          { key: 'line-clamp-2',  value: '-webkit-line-clamp: 2' },
        ],
      },
      {
        title: 'Breakpoints',
        entries: [
          { key: '(base)',  value: '0px+',   badge: 'mobile',  badgeColor: '#4ade80' },
          { key: 'sm:',     value: '≥640px', badge: 'sm phone', badgeColor: '#38BDF8' },
          { key: 'md:',     value: '≥768px', badge: 'tablet',  badgeColor: '#38BDF8' },
          { key: 'lg:',     value: '≥1024px', badge: 'laptop', badgeColor: '#a78bfa' },
          { key: 'xl:',     value: '≥1280px', badge: 'desktop', badgeColor: '#f59e0b' },
          { key: '2xl:',    value: '≥1536px', badge: 'wide',   badgeColor: '#f472b6' },
          { key: 'max-md:', value: 'até 768px — desktop-first' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Borders & Effects',
        entries: [
          { key: 'rounded / rounded-lg / rounded-full', value: '4px / 8px / 9999px' },
          { key: 'border',            value: '1px solid' },
          { key: 'border-2',          value: '2px solid' },
          { key: 'border-slate-200',  value: 'border-color slate-200' },
          { key: 'shadow',            value: 'box-shadow small' },
          { key: 'shadow-lg',         value: 'box-shadow large' },
          { key: 'shadow-xl',         value: 'box-shadow extra large' },
          { key: 'opacity-50',        value: 'opacity: 0.5' },
          { key: 'transition-all',    value: 'transition: all 150ms' },
          { key: 'duration-200',      value: 'transition-duration: 200ms' },
          { key: 'scale-105',         value: 'transform: scale(1.05)' },
          { key: 'ring-2',            value: 'outline ring 2px' },
          { key: 'blur-sm',           value: 'filter: blur(4px)' },
        ],
      },
      {
        title: 'Variants de estado',
        entries: [
          { key: 'hover:',         value: 'ao passar o mouse', badge: 'interação', badgeColor: '#38BDF8' },
          { key: 'focus:',         value: 'ao focar',          badge: 'a11y',      badgeColor: '#4ade80' },
          { key: 'focus-visible:', value: 'foco via teclado',  badge: 'a11y',      badgeColor: '#4ade80' },
          { key: 'active:',        value: 'durante o clique',  badge: 'interação', badgeColor: '#38BDF8' },
          { key: 'disabled:',      value: 'atributo disabled', badge: 'form',      badgeColor: '#f59e0b' },
          { key: 'dark:',          value: 'dark mode ativo',   badge: 'tema',      badgeColor: '#a78bfa' },
          { key: 'group-hover:',   value: 'hover no pai .group', badge: 'grupo',   badgeColor: '#f472b6' },
          { key: 'peer-checked:',  value: 'irmão anterior checked', badge: 'peer', badgeColor: '#f472b6' },
          { key: 'aria-checked:',  value: 'atributo aria-checked', badge: 'a11y',  badgeColor: '#4ade80' },
          { key: 'data-[state=*]:', value: 'atributo data-* (Radix)', badge: 'headless', badgeColor: '#94a3b8' },
        ],
      },
    ],
  },
]

// ── Dados: Anti-patterns ────────────────────────────────────────────────────────

const ANTIPATTERNS: AntiPatternItem[] = [
  {
    title: 'Classes dinâmicas por interpolação',
    badDesc: 'Interpolação impede o scanner — classe não aparece no bundle de produção',
    badCode: [
      { t: 'const color = "red"' },
      { t: `<div className={\`bg-\${color}-500\`}>`, c: '#ef4444' },
      { t: '// Scanner vê: bg-" + color + "-500', c: '#475569' },
      { t: '// Funciona em dev, some em produção', c: '#ef4444' },
    ],
    goodDesc: 'Mapa de classes completas — scanner detecta string literal',
    goodCode: [
      { t: 'const colorMap = {', c: '#4ade80' },
      { t: "  red: 'bg-red-500', blue: 'bg-blue-500',", c: '#4ade80' },
      { t: '} as const', c: '#4ade80' },
      { t: '<div className={colorMap[color]}>' },
    ],
    why: 'O scanner Tailwind analisa o código via regex buscando strings completas. Classes construídas por interpolação nunca aparecem como string completa. Resultado: classe ausente no CSS de produção.',
  },
  {
    title: '@apply em componentes React',
    badDesc: '@apply cria abstrações de CSS desnecessárias — perde utility-first',
    badCode: [
      { t: '/* globals.css */', c: '#475569' },
      { t: '.btn-primary {', c: '#ef4444' },
      { t: '  @apply rounded bg-sky-600 px-4 py-2 text-white;', c: '#ef4444' },
      { t: '  @apply hover:bg-sky-700;', c: '#ef4444' },
      { t: '}', c: '#ef4444' },
    ],
    goodDesc: 'Componente React com cn() — colocação de código, tree-shakeável',
    goodCode: [
      { t: 'function Button({ className, ...props }) {' },
      { t: "  return <button className={cn(", c: '#4ade80' },
      { t: "    'rounded bg-sky-600 px-4 py-2 text-white',", c: '#4ade80' },
      { t: "    'hover:bg-sky-700 transition-colors',", c: '#4ade80' },
      { t: '    className', c: '#4ade80' },
      { t: '  )} {...props} />' },
      { t: '}' },
    ],
    why: '@apply é para HTML que você não controla (CMS, markdown). Componentes React são a abstração correta — tree-shakeable, colocação de código, type-safe com cva.',
  },
  {
    title: 'Concatenar classes sem tailwind-merge',
    badDesc: 'Conflito de propriedades — comportamento dependente do CSS gerado, não do JSX',
    badCode: [
      { t: 'function Button({ className }) {' },
      { t: "  return <button className={'px-4 ' + className}>", c: '#ef4444' },
      { t: "  // className='px-8' → 'px-4 px-8'", c: '#475569' },
      { t: '  // Quem vence? Depende do CSS gerado', c: '#ef4444' },
      { t: '}' },
    ],
    goodDesc: 'cn() resolve conflitos deterministicamente',
    goodCode: [
      { t: 'function Button({ className }) {' },
      { t: "  return <button className={cn('px-4', className)}>", c: '#4ade80' },
      { t: "  // className='px-8' → 'px-8' (px-4 removido)", c: '#475569' },
      { t: '  // tailwind-merge resolve sempre corretamente', c: '#4ade80' },
      { t: '}' },
    ],
    why: 'Quando duas classes afetam a mesma propriedade, quem vence depende da ordem no CSS gerado pelo JIT — não da ordem no JSX. tailwind-merge conhece todas as classes e resolve deterministicamente.',
  },
  {
    title: 'Arquivos fora do content[] — classes somem em produção',
    badDesc: 'Dev funciona porque o JIT é mais agressivo. Produção usa só o content[].',
    badCode: [
      { t: '// tailwind.config.ts', c: '#475569' },
      { t: 'content: [', c: '#ef4444' },
      { t: "  './src/app/**/*.tsx',  // esqueceu components/", c: '#ef4444' },
      { t: ']', c: '#ef4444' },
      { t: '// Classes em components/ somem em npm run build', c: '#ef4444' },
    ],
    goodDesc: 'Glob abrangente cobre todos os diretórios — sempre teste npm run build',
    goodCode: [
      { t: '// tailwind.config.ts', c: '#475569' },
      { t: 'content: [', c: '#4ade80' },
      { t: "  './src/**/*.{ts,tsx}',  // glob cobre tudo", c: '#4ade80' },
      { t: ']', c: '#4ade80' },
      { t: '// Sempre teste: npm run build + cheque o CSS', c: '#475569' },
    ],
    why: 'Em dev, o JIT escaneia mais agressivamente. Em produção, apenas os arquivos em content[] são processados. Bug silencioso: funciona em desenvolvimento, quebra em produção.',
  },
  {
    title: 'theme sem extend — sobrescreve o padrão',
    badDesc: 'Substituir theme remove TODAS as cores, spacing e fonts do Tailwind',
    badCode: [
      { t: '// tailwind.config.ts', c: '#475569' },
      { t: 'theme: {', c: '#ef4444' },
      { t: "  colors: { primary: '#38BDF8' },", c: '#ef4444' },
      { t: '  // ❌ removeu blue-500, red-500, todos os outros', c: '#ef4444' },
      { t: '},', c: '#ef4444' },
    ],
    goodDesc: 'theme.extend adiciona tokens sem remover as cores e spacing padrão',
    goodCode: [
      { t: '// tailwind.config.ts', c: '#475569' },
      { t: 'theme: {', c: '#4ade80' },
      { t: '  extend: {', c: '#4ade80' },
      { t: "    colors: { primary: '#38BDF8' },", c: '#4ade80' },
      { t: '    // ✅ adiciona sem remover o padrão', c: '#475569' },
      { t: '  },', c: '#4ade80' },
      { t: '},', c: '#4ade80' },
    ],
    why: 'theme substitui completamente. extend adiciona sem remover. Use theme apenas quando você quer trocar TUDO (design system sem relação com o padrão Tailwind). 95% das vezes você quer extend.',
  },
]

// ── Dados: Mindmap ────────────────────────────────────────────────────────────────

const MINDMAP_CATEGORIES: MindmapCategory[] = [
  {
    label: 'Classes utilitárias',
    color: C,
    items: [
      { t: 'Layout: flex, grid, container', k: true },
      { t: 'Spacing: p-*, m-*, gap-*', k: true },
      { t: 'Typography: text-*, font-*', k: true },
      { t: 'Colors: bg-*, text-*, border-*', k: true },
      { t: 'Effects: shadow-*, rounded-*, opacity-*', k: true },
    ],
  },
  {
    label: 'Variants & States',
    color: RED,
    items: [
      { t: 'hover: / focus: / active:', k: true },
      { t: 'sm: / md: / lg: / xl: — responsive', k: true },
      { t: 'dark: — dark mode', k: true },
      { t: 'group / group-hover:', k: true },
      { t: 'peer / peer-checked:', k: true },
      { t: 'focus-visible: / disabled:', k: true },
      { t: 'aria-* / data-[state=*]:', a: true },
    ],
  },
  {
    label: 'Composição',
    color: GRN,
    items: [
      { t: 'cn() = clsx + tailwind-merge', k: true },
      { t: 'cva — variantes type-safe', k: true },
      { t: 'VariantProps — tipos automáticos', k: true },
      { t: '@apply — HTML de terceiros only', k: true },
    ],
  },
  {
    label: 'Dark Mode',
    color: PRP,
    items: [
      { t: 'darkMode: "class" (recomendado)', k: true },
      { t: 'dark: prefix por elemento', k: true },
      { t: 'CSS variables — sem dark: em tudo', k: true },
      { t: 'ThemeProvider + localStorage', k: true },
      { t: 'Multi-theme com data-theme=*', a: true },
    ],
  },
  {
    label: 'Configuração',
    color: AMB,
    items: [
      { t: 'tailwind.config.ts — tokens e temas', k: true },
      { t: 'theme.extend — adicionar sem substituir', k: true },
      { t: 'content[] — arquivos a escanear', k: true },
      { t: 'CSS variables + alpha-value', k: true },
      { t: 'safelist — classes dinâmicas garantidas', a: true },
      { t: 'preset — tokens compartilhados', a: true },
    ],
  },
  {
    label: 'Arbitrary Values',
    color: PINK,
    items: [
      { t: 'w-[327px] — valor fixo único', k: true },
      { t: 'bg-[#hex] — cor arbitrária', k: true },
      { t: 'grid-cols-[1fr_2fr] — underscore=espaço', k: true },
      { t: 'h-[calc(100vh-4rem)]', a: true },
    ],
  },
  {
    label: 'Ecossistema',
    color: '#fb923c',
    items: [
      { t: 'shadcn/ui — componentes prontos', k: true },
      { t: 'Radix UI — comportamento headless', k: true },
      { t: 'tailwind-merge — resolver conflitos', k: true },
      { t: 'clsx — classes condicionais', k: true },
      { t: 'Prettier plugin — ordenar classes', a: true },
      { t: 'Tailwind IntelliSense (VS Code)', k: true },
    ],
  },
  {
    label: 'Tailwind v4',
    color: '#a3e635',
    items: [
      { t: 'Engine Oxide (Rust) — 10x mais rápido', a: true },
      { t: '@theme em CSS — sem tailwind.config.ts', a: true },
      { t: 'Auto content detection — sem content[]', a: true },
      { t: '@import "tailwindcss" — sem diretivas', a: true },
      { t: 'Container queries nativo', a: true },
    ],
  },
]

const MINDMAP_CHECKLIST: string[] = [
  'O que é utility-first e qual o tradeoff em relação ao CSS tradicional?',
  'Como o JIT elimina CSS morto?',
  'Por que classes dinâmicas por interpolação não funcionam?',
  'Como usar tailwind-merge e por que é necessário?',
  'Como criar componentes com variantes type-safe usando cva?',
  'Quais são os 5 breakpoints padrão em pixels?',
  'Qual a diferença entre darkMode: "class" e "media"?',
  'Como usar CSS variables para theming dinâmico?',
  'O que são arbitrary values e quando usar?',
  'Quando usar @apply e quando NÃO usar?',
  'Como funciona group e group-hover?',
  'Como funciona peer e peer-checked?',
  'Como configurar tailwind.config com extend vs theme?',
  'O que acontece com arquivos fora do content[]?',
  'Como integrar Tailwind com shadcn/ui?',
  'Como usar data-[state=*] para componentes Radix?',
  'O que há de novo no Tailwind v4?',
  'Como usar Tailwind em Server Components do Next.js?',
  'Como fazer container queries com Tailwind?',
  'Como configurar Tailwind para múltiplas marcas/temas?',
]

// ── Builders ────────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'Tailwind CSS',
    stackLabel: 'Frontend — CSS Framework',
    coverTitle: 'Tailwind CSS Q&A Review',
    coverSubtitle: 'Utility-first — nível pleno/sênior',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'Tailwind CSS',
    accentColor: C,
    stackLabel: 'Frontend — CSS Framework',
    coverTitle: 'Tailwind CSS CheatSheet',
    coverSubtitle: 'Classes por categoria, variantes e configuração',
    sections: {
      hooks: CS_HOOKS,
      depRows: CS_DEP_ROWS,
      rules: CS_RULES,
      performanceTips: CS_TIPS,
      patterns: CS_PATTERNS,
      mentalModels: CS_MENTAL_MODELS,
    },
  }),
  'quick-ref': () => buildQuickRefPdf({
    columns: QUICK_REF_COLUMNS,
    skillName: 'Tailwind CSS',
    accentColor: C,
    stackLabel: 'Frontend — CSS Framework',
    tagline: 'Classes utilitárias, breakpoints e variants de estado',
    version: 'v3 / v4',
  }),
  antipatterns: () => buildAntipatternsPdf({
    antipatterns: ANTIPATTERNS,
    accentColor: C,
    skillName: 'Tailwind CSS',
    stackLabel: 'Frontend — CSS Framework',
    coverTitle: 'Tailwind CSS Anti-patterns',
    coverSubtitle: 'Os 5 erros mais comuns — e como corrigir',
  }),
  mindmap: () => buildMindmapPdf({
    categories: MINDMAP_CATEGORIES,
    checklist: MINDMAP_CHECKLIST,
    accentColor: C,
    skillName: 'Tailwind CSS',
    stackLabel: 'Frontend — CSS Framework',
    coverTitle: 'Tailwind CSS Mind Map',
    coverSubtitle: 'Das classes atômicas ao design system completo',
  }),
}

// ── Componente ────────────────────────────────────────────────────────────────────

export default function TailwindCssPdfs() {
  const [open, setOpen] = useState<PdfCard | null>(null)
  const hero = PDF_CARDS[0]
  const rest = PDF_CARDS.slice(1)

  return (
    <>
      <HeroCard card={hero} accent={C} onOpen={() => setOpen(hero)} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 16 }}>
        {rest.map(c => <CollectionCard key={c.id} card={c} accent={C} onOpen={() => setOpen(c)} />)}
      </div>
      {open && <PdfModal card={open} onClose={() => setOpen(null)} builders={PDF_BUILDERS} />}
    </>
  )
}
