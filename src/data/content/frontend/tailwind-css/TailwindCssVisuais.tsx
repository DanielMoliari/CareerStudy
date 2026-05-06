'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'
import { DecisionTree } from '@/components/visuals/DecisionTree'
import type { DTNode } from '@/components/visuals/DecisionTree'
import { FeaturesCarousel } from '@/components/visuals/FeaturesCarousel'
import type { Feature } from '@/components/visuals/FeaturesCarousel'
import { CardCarousel } from '@/components/visuals/CardCarousel'
import type { CarouselCard } from '@/components/visuals/CardCarousel'
import { CodeStepper } from '@/components/visuals/CodeStepper'
import type { CodeStepperScenario } from '@/components/visuals/CodeStepper'
import { DiffViewer } from '@/components/visuals/DiffViewer'
import type { DiffExample } from '@/components/visuals/DiffViewer'

// ── Paleta Tailwind CSS ─────────────────────────────────────────────────────────
const C      = '#38BDF8'   // tailwind sky
const SEC    = '#0ea5e9'
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#4ade80'
const AMB    = '#f59e0b'
const RED    = '#ef4444'
const PRP    = '#a78bfa'
const PINK   = '#f472b6'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Classes por categoria (LayerStack clicável)
// Justificativa: Tailwind tem centenas de classes. Ver as categorias com
// exemplos reais e o código que geram é a forma mais rápida de entender o que
// existe — texto plano vira lista inutilizável sem a âncora visual.
// ═══════════════════════════════════════════════════════════════════════════════

const UTILITY_LAYERS: Layer[] = [
  {
    id: 'layout',
    label: 'Layout & Grid',
    sublabel: 'Estrutura e posicionamento',
    description: 'Classes que definem a estrutura do layout. flex, grid, container e position formam a espinha dorsal de qualquer página.',
    code: 'flex flex-col items-center justify-between gap-4 grid grid-cols-3 col-span-2',
    color: C,
    icon: '🏗️',
    examples: ['flex', 'grid', 'flex-col', 'items-center', 'justify-between', 'gap-4', 'grid-cols-3', 'col-span-2', 'container', 'relative', 'absolute', 'fixed', 'sticky'],
  },
  {
    id: 'spacing',
    label: 'Spacing',
    sublabel: 'Escala × 0.25rem (base 4px)',
    description: 'Sistema de espaçamento baseado em escala consistente. p-1=4px, p-2=8px, p-4=16px, p-8=32px. A escala 4px garante alinhamento perfeito em qualquer contexto.',
    code: 'p-4 px-6 py-2 mt-4 mb-8 mx-auto space-y-4',
    color: SEC,
    icon: '📏',
    examples: ['p-1 (4px)', 'p-2 (8px)', 'p-4 (16px)', 'p-6 (24px)', 'p-8 (32px)', 'p-12 (48px)', 'p-16 (64px)', 'mx-auto', 'space-y-4'],
  },
  {
    id: 'typography',
    label: 'Typography',
    sublabel: 'Texto e fontes',
    description: 'Sistema tipográfico completo com escala de tamanhos, pesos e line heights. text-base=1rem, text-lg=1.125rem, text-xl=1.25rem. Font weights: font-normal=400, font-medium=500, font-bold=700.',
    code: 'text-xl font-bold leading-relaxed tracking-tight truncate',
    color: PRP,
    icon: '✍️',
    examples: ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'font-medium', 'font-semibold', 'font-bold', 'leading-relaxed', 'truncate', 'line-clamp-2'],
  },
  {
    id: 'colors',
    label: 'Colors & Backgrounds',
    sublabel: 'Sistema de cores com paleta de 11 tons',
    description: 'Paleta de cores com escala 50-950. Cada cor tem 11 variações. Cores para text-, bg-, border- e ring-. Suporte a opacity: bg-blue-500/50 = 50% de opacidade.',
    code: 'bg-slate-900 text-sky-400 border-indigo-500/30 ring-2 ring-blue-500',
    color: AMB,
    icon: '🎨',
    examples: ['bg-white/dark/slate-900', 'text-slate-900', 'text-sky-500', 'border-slate-200', 'bg-blue-500/50 (opacity)', 'from-sky-400 to-indigo-500 (gradient)'],
  },
  {
    id: 'effects',
    label: 'Effects & Decorations',
    sublabel: 'Sombras, bordas e efeitos visuais',
    description: 'Classes para sombras (shadow-*), bordas arredondadas (rounded-*), opacidade, blur e transforms. Combinadas com hover: criam interatividade completa sem JavaScript.',
    code: 'shadow-lg rounded-xl border border-slate-200 hover:shadow-xl hover:scale-105 transition-all',
    color: GRN,
    icon: '✨',
    examples: ['shadow-sm', 'shadow-lg', 'rounded', 'rounded-lg', 'rounded-full', 'border', 'border-2', 'opacity-50', 'blur-sm', 'transition-all', 'duration-200'],
  },
  {
    id: 'states',
    label: 'Variants & States',
    sublabel: 'hover:, focus:, dark:, group, peer',
    description: 'Prefixos que geram CSS para estados interativos. hover:, focus:, active:, disabled:, dark:. Variantes avançadas: group-hover: (filho reage ao hover do pai), peer-checked: (elemento reage ao irmão).',
    code: 'hover:bg-sky-600 focus:ring-2 disabled:opacity-50 dark:bg-slate-800 group-hover:opacity-100',
    color: RED,
    icon: '🎛️',
    examples: ['hover:bg-*', 'focus:ring-*', 'active:scale-95', 'disabled:opacity-50', 'dark:bg-*', 'group-hover:*', 'peer-checked:*', 'md:flex', 'lg:grid-cols-3'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Responsive design (custom visual com breakpoints)
// Justificativa: o conceito mobile-first (sem prefixo = todos, com prefixo =
// a partir de) é contraintuitivo para devs vindos de CSS tradicional. O visual
// com a régua de breakpoints e o exemplo colorido torna o padrão imediato.
// ═══════════════════════════════════════════════════════════════════════════════

interface Breakpoint {
  prefix: string
  px: number
  rem: string
  label: string
  color: string
  example: string
  mobileFirst: string
}

const BREAKPOINTS: Breakpoint[] = [
  { prefix: '(sem prefixo)', px: 0,    rem: '0',     label: 'Mobile (base)',   color: GRN,   example: 'text-sm flex-col',     mobileFirst: 'Aplica em todos os tamanhos — mobile base' },
  { prefix: 'sm:',           px: 640,  rem: '40rem',  label: 'Small (≥640px)',  color: C,     example: 'sm:text-base',         mobileFirst: 'Aplica a partir de 640px' },
  { prefix: 'md:',           px: 768,  rem: '48rem',  label: 'Medium (≥768px)', color: SEC,   example: 'md:flex-row',          mobileFirst: 'Aplica a partir de 768px — tablet' },
  { prefix: 'lg:',           px: 1024, rem: '64rem',  label: 'Large (≥1024px)', color: PRP,   example: 'lg:grid-cols-3',       mobileFirst: 'Aplica a partir de 1024px — laptop' },
  { prefix: 'xl:',           px: 1280, rem: '80rem',  label: 'XL (≥1280px)',    color: AMB,   example: 'xl:max-w-7xl',         mobileFirst: 'Aplica a partir de 1280px — desktop' },
  { prefix: '2xl:',          px: 1536, rem: '96rem',  label: '2XL (≥1536px)',   color: PINK,  example: '2xl:text-2xl',         mobileFirst: 'Aplica a partir de 1536px — wide' },
]

function ResponsiveBreakpointsVisual() {
  const [active, setActive] = useState(0)
  const bp = BREAKPOINTS[active]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%' }}>
      {/* Régua de breakpoints */}
      <div style={{
        position: 'relative',
        background: CARD,
        borderRadius: 12,
        padding: '20px 16px',
        border: `1px solid ${LINE}`,
      }}>
        <div style={{ fontSize: 10, color: FGMUTE, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 16, fontWeight: 700 }}>
          Breakpoints — mobile-first (min-width)
        </div>
        {/* Barra de progresso representando os breakpoints */}
        <div style={{ position: 'relative', height: 40, borderRadius: 6, overflow: 'hidden', background: `${LINE}50` }}>
          {BREAKPOINTS.slice(1).map((b, i) => (
            <div
              key={b.prefix}
              style={{
                position: 'absolute',
                left: `${(i / 5) * 100}%`,
                height: '100%',
                width: `${100 / 5}%`,
                background: active === i + 1 ? `${b.color}30` : 'transparent',
                borderLeft: `2px solid ${b.color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background .2s',
              }}
              onClick={() => setActive(i + 1)}
            >
              <span style={{ fontSize: 10, color: b.color, fontWeight: 700 }}>{b.prefix}</span>
            </div>
          ))}
        </div>

        {/* Botões de breakpoint */}
        <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
          {BREAKPOINTS.map((b, i) => (
            <button
              key={b.prefix}
              onClick={() => setActive(i)}
              style={{
                padding: '4px 12px',
                borderRadius: 20,
                border: `1.5px solid ${active === i ? b.color : LINE}`,
                background: active === i ? `${b.color}20` : 'transparent',
                color: active === i ? b.color : FGMUTE,
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all .2s',
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {b.prefix === '(sem prefixo)' ? 'base' : b.prefix}
            </button>
          ))}
        </div>
      </div>

      {/* Painel de detalhes */}
      <div style={{ background: CARD, borderRadius: 12, padding: 24, border: `1px solid ${bp.color}40`, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: bp.color, fontFamily: "'JetBrains Mono', monospace" }}>{bp.prefix}</div>
            <div style={{ fontSize: 14, color: FG, fontWeight: 600, marginTop: 2 }}>{bp.label}</div>
          </div>
          {bp.px > 0 && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: bp.color }}>{bp.px}px</div>
              <div style={{ fontSize: 12, color: FGMUTE }}>{bp.rem}</div>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div style={{ background: BG, borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 10, color: C, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Comportamento</div>
            <p style={{ fontSize: 12, color: FG, margin: 0, lineHeight: 1.6 }}>{bp.mobileFirst}</p>
          </div>
          <div style={{ background: BG, borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 10, color: GRN, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Exemplo</div>
            <code style={{ fontSize: 12, color: GRN, fontFamily: "'JetBrains Mono', monospace" }}>{bp.example}</code>
          </div>
        </div>

        <div style={{ background: BG, borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 10, color: AMB, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>Exemplo mobile-first</div>
          <code style={{ fontSize: 12, color: FG, fontFamily: "'JetBrains Mono', monospace", lineHeight: 2 }}>
            {'<div class="'}
            <span style={{ color: GRN }}>text-sm flex-col</span>
            {' '}
            <span style={{ color: C }}>sm:text-base</span>
            {' '}
            <span style={{ color: SEC }}>md:flex-row</span>
            {' '}
            <span style={{ color: PRP }}>lg:grid</span>
            {' '}
            <span style={{ color: AMB }}>xl:max-w-7xl</span>
            {'">'}
          </code>
        </div>
      </div>

      {/* Dica mobile-first */}
      <div style={{ background: `${AMB}15`, border: `1px solid ${AMB}40`, borderRadius: 8, padding: 14, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 16 }}>💡</span>
        <span style={{ fontSize: 12, color: FG }}>
          <strong style={{ color: AMB }}>Mobile-first:</strong> sem prefixo = todos os tamanhos. Com prefixo = a partir daquele tamanho para cima. Para desktops primeiro:{' '}
          <code style={{ color: C, fontFamily: "'JetBrains Mono', monospace" }}>max-lg:</code> aplica até lg.
        </span>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Pipeline JIT: scan → generate → purge (custom)
// Justificativa: entender POR QUE classes dinâmicas não funcionam, por que o
// content[] é obrigatório e por que classes somem em produção requer
// visualizar o pipeline de build. Nenhum texto explica isso tão rápido quanto
// o fluxo interativo por fase.
// ═══════════════════════════════════════════════════════════════════════════════

interface JitPhase {
  id: string
  step: string
  label: string
  color: string
  icon: string
  what: string
  howItWorks: string
  gotcha: string
  example: string
}

const JIT_PHASES: JitPhase[] = [
  {
    id: 'scan',
    step: '01',
    label: 'Scan',
    color: C,
    icon: '🔍',
    what: 'O scanner lê todos os arquivos listados em content[] usando expressões regulares buscando strings completas de classes Tailwind.',
    howItWorks: 'O Tailwind analisa cada arquivo linha por linha procurando padrões como "bg-red-500", "flex", "hover:text-blue-600". Ele NÃO executa JavaScript — só lê texto.',
    gotcha: 'O scanner não consegue detectar classes construídas por interpolação: `bg-${color}-500` nunca aparece como string completa no código.',
    example: "content: ['./src/**/*.{ts,tsx}'] → escaneia app/, components/, lib/",
  },
  {
    id: 'collect',
    step: '02',
    label: 'Collect',
    color: AMB,
    icon: '📋',
    what: 'Todas as strings encontradas são coletadas em um Set de classes únicas a gerar.',
    howItWorks: 'Se "flex" aparece em 100 arquivos, ainda assim gera apenas 1 linha de CSS. A deduplicação é automática — não há CSS duplicado por uso repetido.',
    gotcha: 'Arquivos fora do content[] não são escaneados. Classes nesses arquivos existem em dev (JIT mais agressivo) mas somem em produção.',
    example: "Set coletado: { 'flex', 'bg-sky-500', 'text-sm', 'hover:bg-sky-600', ... }",
  },
  {
    id: 'generate',
    step: '03',
    label: 'Generate',
    color: GRN,
    icon: '⚙️',
    what: 'Para cada classe coletada, o Tailwind gera exatamente o CSS correspondente.',
    howItWorks: 'Cada classe tem um mapeamento determinístico para CSS. "p-4" → "padding: 1rem". "hover:bg-sky-600" → ".hover\\:bg-sky-600:hover { background-color: #0284c7 }". Arbitrary values como w-[327px] também são gerados aqui.',
    gotcha: 'Arbitrary values que se repetem geram CSS duplicado. Se bg-[#1a2b3c] aparece em 10 lugares, gera 1 regra CSS mas só por ser a mesma string literal.',
    example: "flex → display: flex; bg-sky-500 → background-color: #0ea5e9; p-4 → padding: 1rem",
  },
  {
    id: 'output',
    step: '04',
    label: 'Output',
    color: PRP,
    icon: '📦',
    what: 'CSS final gerado é inserido na saída — somente as classes efetivamente usadas.',
    howItWorks: 'O bundle CSS final contém apenas as classes encontradas pelo scanner. Um app típico gera 5-15KB de CSS — contra centenas de KB de um framework CSS tradicional que inclui tudo.',
    gotcha: 'Sempre teste com npm run build — dev usa um cache mais permissivo. Bugs de "funciona em dev, some em produção" são quase sempre content[] incompleto.',
    example: "Output: ~8KB CSS (apenas classes usadas) vs ~300KB CSS (framework completo)",
  },
]

function JitPipelineVisual() {
  const [active, setActive] = useState(0)
  const phase = JIT_PHASES[active]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, height: '100%' }}>
      {/* Steps */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, borderRadius: 10, overflow: 'hidden', border: `1px solid ${LINE}` }}>
        {JIT_PHASES.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setActive(i)}
            style={{
              flex: 1,
              padding: '14px 8px',
              background: active === i ? `${p.color}20` : CARD,
              border: 'none',
              borderRight: i < JIT_PHASES.length - 1 ? `1px solid ${LINE}` : 'none',
              borderBottom: active === i ? `3px solid ${p.color}` : '3px solid transparent',
              cursor: 'pointer',
              transition: 'all .2s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span style={{ fontSize: 20 }}>{p.icon}</span>
            <span style={{
              fontSize: 10, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
              color: active === i ? p.color : FGMUTE,
            }}>{p.step}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: active === i ? p.color : FG }}>{p.label}</span>
          </button>
        ))}
      </div>

      {/* Detalhe da fase */}
      <div style={{ background: CARD, borderRadius: 12, padding: 22, border: `1px solid ${phase.color}40`, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <span style={{ fontSize: 28 }}>{phase.icon}</span>
          <div>
            <span style={{ fontSize: 10, color: phase.color, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '.08em' }}>FASE {phase.step}</span>
            <div style={{ fontSize: 18, fontWeight: 800, color: phase.color }}>{phase.label}</div>
          </div>
        </div>

        <p style={{ fontSize: 13, color: FG, lineHeight: 1.65, margin: '0 0 16px' }}>{phase.what}</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          <div style={{ background: BG, borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 10, color: C, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Como funciona</div>
            <p style={{ fontSize: 12, color: FG, margin: 0, lineHeight: 1.6 }}>{phase.howItWorks}</p>
          </div>
          <div style={{ background: BG, borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 10, color: RED, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Gotcha comum</div>
            <p style={{ fontSize: 12, color: FG, margin: 0, lineHeight: 1.6 }}>{phase.gotcha}</p>
          </div>
        </div>

        <div style={{ background: `${phase.color}12`, border: `1px solid ${phase.color}40`, borderRadius: 8, padding: 12 }}>
          <span style={{ fontSize: 10, color: phase.color, fontWeight: 700, marginRight: 8 }}>Exemplo:</span>
          <code style={{ fontSize: 11, color: FG, fontFamily: "'JetBrains Mono', monospace" }}>{phase.example}</code>
        </div>
      </div>

      {/* Fluxo linear */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
        {JIT_PHASES.map((p, i) => (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{
              padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600,
              background: `${p.color}20`, color: p.color, border: `1px solid ${p.color}60`,
            }}>{p.label}</div>
            {i < JIT_PHASES.length - 1 && <span style={{ color: LINE, fontSize: 16 }}>→</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — cva + cn() passo a passo (CodeStepper)
// Justificativa: cva + cn() é O padrão de componentes profissionais em Tailwind.
// Ver a evolução de "classes brutas" → "cn()" → "cva" → "VariantProps tipados"
// passo a passo torna o padrão memorável e defensável em entrevista.
// ═══════════════════════════════════════════════════════════════════════════════

const CVA_SCENARIOS: CodeStepperScenario[] = [
  {
    id: 'cva-pattern',
    label: 'Button: de classes brutas até cva tipado',
    code: `// Passo 1 — classes brutas repetidas (problemático)
// <button className="rounded bg-sky-600 px-4 py-2 text-white hover:bg-sky-700">

// Passo 2 — cn() resolve conflitos de override
import { cn } from '@/lib/utils'
function Button({ className, ...props }) {
  return (
    <button
      className={cn(
        'rounded bg-sky-600 px-4 py-2 text-white',
        'hover:bg-sky-700 transition-colors',
        className  // className externo sempre vence
      )}
      {...props}
    />
  )
}

// Passo 3 — cva adiciona variantes type-safe
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'rounded px-4 py-2 font-medium transition-colors',
  {
    variants: {
      variant: {
        primary:   'bg-sky-600 text-white hover:bg-sky-700',
        secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
        ghost:     'text-slate-600 hover:bg-slate-100',
      },
      size: {
        sm: 'text-sm px-3 py-1.5',
        md: 'text-base px-4 py-2',
        lg: 'text-lg px-6 py-3',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>
  & VariantProps<typeof buttonVariants>

function Button({ variant, size, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}`,
    language: 'typescript',
    steps: [
      {
        lineStart: 1,
        lineEnd: 2,
        title: 'Passo 1 — O problema',
        explanation: 'Classes Tailwind inline sem abstração: não há variantes, não há type safety, e concatenar className externo causa conflito de especificidade (px-4 vs px-8 vence quem veio primeiro no CSS gerado — imprevisível).',
      },
      {
        lineStart: 4,
        lineEnd: 15,
        title: 'Passo 2 — cn() resolve conflitos',
        explanation: 'cn() = clsx (classes condicionais) + tailwind-merge (resolve conflitos). Quando o usuário passa className="px-8", tailwind-merge remove px-4 do base e mantém px-8. O override sempre funciona corretamente.',
        output: 'cn("px-4", "px-8") → "px-8" (px-4 removido pelo tailwind-merge)',
      },
      {
        lineStart: 18,
        lineEnd: 20,
        title: 'Passo 3 — cva declara variantes',
        explanation: 'cva recebe as classes base (aplicadas sempre) e um objeto variants. Cada variante tem chave (variant, size) e valores possíveis (primary, secondary, ghost). cva retorna uma função que gera a string de classes.',
        output: 'buttonVariants({ variant: "primary", size: "md" }) → "rounded px-4 py-2 ... bg-sky-600 text-white hover:bg-sky-700"',
      },
      {
        lineStart: 21,
        lineEnd: 36,
        title: 'Variantes definidas',
        explanation: 'Cada variante tem um conjunto de classes. O objeto variants mapeia cada combinação possível de props para classes Tailwind concretas. defaultVariants define o que usar quando nenhum valor for passado.',
      },
      {
        lineStart: 38,
        lineEnd: 39,
        title: 'VariantProps — tipos automáticos',
        explanation: 'VariantProps<typeof buttonVariants> extrai automaticamente o tipo { variant?: "primary" | "secondary" | "ghost"; size?: "sm" | "md" | "lg" }. TypeScript tipa os props sem escrever o tipo manualmente.',
        output: 'Erro TypeScript: variant="invalid" — "invalid" não existe em "primary" | "secondary" | "ghost"',
      },
      {
        lineStart: 41,
        lineEnd: 47,
        title: 'Componente final tipado',
        explanation: 'cn(buttonVariants({ variant, size }), className): primeiro resolve as variantes, depois aplica o className externo — que sempre vence conflitos via tailwind-merge. Padrão usado em shadcn/ui.',
        output: '<Button variant="secondary" size="sm" className="w-full" /> → funciona com autocomplete e type safety',
      },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — Dark mode (FeaturesCarousel)
// Justificativa: class vs media é um gotcha frequente. CSS variables vs
// dark: em cada elemento é a diferença entre um design system escalável e um
// que vira impossível de manter. O before/after lado a lado é insubstituível.
// ═══════════════════════════════════════════════════════════════════════════════

const DARK_MODE_FEATURES: Feature[] = [
  {
    tag: 'estratégia',
    name: 'class vs media',
    color: C,
    before: 'darkMode: "media"\n\n/* Segue prefers-color-scheme do SO */\n/* Sem controle manual do usuário */\nbg-white dark:bg-gray-900',
    after: 'darkMode: "class"\n\n/* Toggle via .dark no <html> */\n/* Botão de alternância de tema */\nbg-white dark:bg-gray-900',
    beforeLabel: 'media strategy',
    afterLabel: 'class strategy (recomendado)',
    desc: '"class" dá controle total ao usuário. Salve o tema no localStorage e aplique via document.documentElement.classList.',
  },
  {
    tag: 'padrão básico',
    name: 'Prefixo dark: em classes',
    color: SEC,
    before: '/* Sem dark mode */\n<div class="bg-white text-gray-900">\n  <h1 class="text-2xl font-bold">Título</h1>\n  <p class="text-gray-600">Texto</p>\n</div>',
    after: '/* Com dark mode */\n<div class="bg-white dark:bg-gray-900\n    text-gray-900 dark:text-gray-100">\n  <h1 class="text-2xl font-bold">Título</h1>\n  <p class="text-gray-600 dark:text-gray-400">Texto</p>\n</div>',
    beforeLabel: 'sem dark:',
    afterLabel: 'com dark: prefix',
    desc: 'Adicione dark: prefix em cada elemento. Funciona mas fica verboso em projetos grandes. Melhor abordagem: CSS variables.',
  },
  {
    tag: 'padrão profissional',
    name: 'CSS variables + shadcn/ui',
    color: PRP,
    before: '/* globals.css — sem variables */\nbody {\n  background: #ffffff;\n  color: #0f172a;\n}\n\n/* Sem controle de tema */\n/* Sem suporte a multi-theme */\nbg-white text-slate-900',
    after: '/* globals.css — com variables */\n:root {\n  --background: 0 0% 100%;\n  --foreground: 222 84% 5%;\n}\n.dark {\n  --background: 222 84% 5%;\n  --foreground: 210 40% 98%;\n}\n\nbg-background text-foreground',
    beforeLabel: 'valores diretos (limitado)',
    afterLabel: 'CSS variables (shadcn/ui)',
    desc: 'CSS variables permitem trocar tema em runtime sem rebuild. bg-background usa a variável e muda automaticamente com .dark. Padrão do shadcn/ui.',
  },
  {
    tag: 'toggle de tema',
    name: 'ThemeProvider',
    color: GRN,
    before: '// Sem controle de tema\n// Tudo depende do SO\n// Usuário não consegue forçar\n// Nenhuma persistência\nwindow.matchMedia("(prefers-color-scheme: dark)")',
    after: '// ThemeProvider com localStorage\nfunction ThemeProvider({ children }) {\n  const [theme, setTheme] = useState(\n    () => localStorage.getItem("theme") ?? "light"\n  )\n  useEffect(() => {\n    document.documentElement.classList\n      .toggle("dark", theme === "dark")\n    localStorage.setItem("theme", theme)\n  }, [theme])\n  return <ctx.Provider value={{ theme, setTheme }}>\n    {children}\n  </ctx.Provider>\n}',
    beforeLabel: 'dependência do SO',
    afterLabel: 'controle total via localStorage',
    desc: 'ThemeProvider centraliza o toggle. Leia o localStorage no mount, aplique a classe .dark no html e persista a escolha do usuário.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — Variants (hover, focus, group-hover, peer, dark, aria) — CardCarousel
// Justificativa: group-hover e peer são recursos pouco conhecidos mas muito
// poderosos. Nenhum texto memoriza melhor do que ver o "o que é, como usar,
// quando não usar" lado a lado para cada variant.
// ═══════════════════════════════════════════════════════════════════════════════

const VARIANTS_CARDS: CarouselCard[] = [
  {
    name: 'hover: / focus: / active:',
    signature: 'hover:bg-sky-600 focus:ring-2 active:scale-95',
    emoji: '🖱️',
    color: C,
    use: [
      'hover: → ao passar o mouse sobre o elemento',
      'focus: → ao focar via teclado ou click',
      'active: → durante o clique',
      'focus-visible: → foco visível apenas no teclado (melhor a11y)',
    ],
    dontUse: 'Não usar hover: para informação crítica — touchscreens não têm hover',
    difficulty: 1,
  },
  {
    name: 'group / group-hover:',
    signature: '<div class="group"> <child class="group-hover:opacity-100">',
    emoji: '👨‍👩‍👧',
    color: GRN,
    use: [
      'Filho reage ao hover do PAI (ou ancestral .group)',
      'group-hover:, group-focus:, group-active:',
      'Revelar overlay, ações, tooltips ao hover do card',
      'group/{name} para grupos nomeados (múltiplos grupos)',
    ],
    dontUse: 'Não usar sem a classe group no pai — o variant não terá efeito',
    difficulty: 2,
  },
  {
    name: 'peer / peer-checked:',
    signature: '<input class="peer"> <label class="peer-checked:text-sky-500">',
    emoji: '🔗',
    color: AMB,
    use: [
      'Elemento reage ao estado de um IRMÃO com classe peer',
      'peer-checked: (checkbox), peer-focus:, peer-invalid:',
      'Custom toggle/switch sem JavaScript',
      'peer/{name} para múltiplos peers na mesma hierarquia',
    ],
    dontUse: 'O peer deve ser um irmão ANTERIOR no DOM — não funciona com filho ou pai',
    difficulty: 2,
  },
  {
    name: 'dark:',
    signature: 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white',
    emoji: '🌙',
    color: PRP,
    use: [
      'Aplicar estilo apenas em dark mode',
      'Funciona com darkMode: "class" (.dark no html) ou "media"',
      'Combine com CSS variables para evitar dark: em cada elemento',
      'dark:hidden / dark:block para mostrar/ocultar por tema',
    ],
    dontUse: 'Abordagem de CSS variables é mais escalável — evita dark: em cada elemento individualmente',
    difficulty: 1,
  },
  {
    name: 'aria-* variants',
    signature: 'aria-checked:bg-sky-500 data-[state=open]:opacity-100',
    emoji: '♿',
    color: RED,
    use: [
      'Estilizar com base em atributos ARIA: aria-checked, aria-selected',
      'data-[state=open]: para estilizar estados de componentes Radix UI',
      'Funciona com qualquer atributo HTML/data-*',
      'Melhor que JS para interatividade declarativa acessível',
    ],
    dontUse: 'Não usar em substituição a CSS semântico — para componentes headless (Radix, Headless UI)',
    difficulty: 3,
  },
  {
    name: 'Responsive variants',
    signature: 'text-sm md:text-base lg:text-lg xl:text-xl',
    emoji: '📱',
    color: SEC,
    use: [
      'Mobile-first: sem prefixo = todos os tamanhos',
      'sm:, md:, lg:, xl:, 2xl: — a partir daquele breakpoint',
      'Combine com qualquer outra variant: md:hover:bg-sky-600',
      'max-md: para estilizar até md (containers, max-width)',
    ],
    dontUse: 'max-[500px]: (arbitrary breakpoints) deve ir para o theme.screens se se repetir',
    difficulty: 1,
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 7 — Anti-patterns
// Justificativa: classe dinâmica por interpolação, @apply em componentes e
// arquivos fora do content[] são os bugs mais dolorosos em produção — aparecem
// em dev e somem no build. O diff visual cria reconhecimento imediato.
// ═══════════════════════════════════════════════════════════════════════════════

const TW_ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'Classes dinâmicas por interpolação de string',
    wrong: [
      [{ text: '// Scanner do Tailwind não detecta string interpolada', color: FGMUTE }],
      [{ text: 'const color = "red"', color: FG }],
      [{ text: '<div className={`bg-${color}-500`}>', color: RED }],
      [{ text: '// Tailwind não inclui bg-red-500 no CSS de produção', color: FGMUTE }],
    ],
    right: [
      [{ text: '// Mapa de classes completas — scanner detecta', color: FGMUTE }],
      [{ text: 'const colorMap = {', color: FG }],
      [{ text: "  red: 'bg-red-500',", color: GRN }],
      [{ text: "  blue: 'bg-blue-500',", color: GRN }],
      [{ text: "  green: 'bg-green-500',", color: GRN }],
      [{ text: '} as const', color: FG }],
      [{ text: '<div className={colorMap[color]}>', color: GRN }],
    ],
    why: 'Tailwind escaneia o código em build time via regex buscando strings completas. Interpolação cria "bg-" + "red" + "-500" — nunca aparece como string completa. Produção fica sem a classe.',
  },
  {
    title: '@apply em componentes React em vez de criar componente',
    wrong: [
      [{ text: '/* globals.css — @apply desnecessário */', color: FGMUTE }],
      [{ text: '.btn-primary {', color: RED }],
      [{ text: '  @apply rounded bg-sky-600 px-4 py-2 text-white;', color: RED }],
      [{ text: '  @apply hover:bg-sky-700 transition-colors;', color: RED }],
      [{ text: '}', color: RED }],
      [{ text: '// Perde o utility-first, cria abstrações de CSS', color: FGMUTE }],
    ],
    right: [
      [{ text: '// Componente React — melhor em todos os aspectos', color: FGMUTE }],
      [{ text: 'function Button({ className, ...props }) {', color: GRN }],
      [{ text: "  return <button className={cn(", color: GRN }],
      [{ text: "    'rounded bg-sky-600 px-4 py-2 text-white',", color: GRN }],
      [{ text: "    'hover:bg-sky-700 transition-colors',", color: GRN }],
      [{ text: '    className', color: GRN }],
      [{ text: '  )} {...props} />', color: GRN }],
      [{ text: '}', color: GRN }],
    ],
    why: '@apply é para HTML que você não controla (CMS, markdown). Componentes React são a abstração correta — tree-shakeable, colocação de código, type-safe com cva.',
  },
  {
    title: 'Concatenar classes sem tailwind-merge',
    wrong: [
      [{ text: '// Qual classe vence? Depende da ordem no CSS gerado', color: FGMUTE }],
      [{ text: "function Button({ className }) {", color: FG }],
      [{ text: "  return <button className={'px-4 py-2 ' + className}>", color: RED }],
      [{ text: '  // Se className="px-8", ambas ficam: px-4 px-8', color: FGMUTE }],
      [{ text: '  // Vencedor imprevisível — depende do CSS gerado', color: FGMUTE }],
      [{ text: '}', color: FG }],
    ],
    right: [
      [{ text: '// cn() resolve conflitos deterministicamente', color: FGMUTE }],
      [{ text: "function Button({ className }) {", color: GRN }],
      [{ text: "  return <button className={cn('px-4 py-2', className)}>", color: GRN }],
      [{ text: '  // Se className="px-8" → resultado: "py-2 px-8"', color: FGMUTE }],
      [{ text: '  // tailwind-merge remove px-4 — px-8 vence sempre', color: FGMUTE }],
      [{ text: '}', color: GRN }],
    ],
    why: 'Quando duas classes Tailwind afetam a mesma propriedade (px-4 e px-8), quem vence depende da ordem no CSS gerado — não da ordem no JSX. tailwind-merge resolve deterministicamente: a última sempre vence.',
  },
  {
    title: 'Arquivos fora do content[] — classes somem em produção',
    wrong: [
      [{ text: '// tailwind.config.ts', color: FGMUTE }],
      [{ text: 'content: [', color: FG }],
      [{ text: "  './src/app/**/*.{ts,tsx}',", color: RED }],
      [{ text: '  // esqueceu os componentes!', color: RED }],
      [{ text: ']', color: FG }],
      [{ text: '// Classes em src/components/ funcionam em dev', color: FGMUTE }],
      [{ text: '// mas somem em produção (JIT de dev é mais agressivo)', color: RED }],
    ],
    right: [
      [{ text: '// tailwind.config.ts', color: FGMUTE }],
      [{ text: 'content: [', color: GRN }],
      [{ text: "  './src/**/*.{ts,tsx}',", color: GRN }],
      [{ text: '  // glob abrange app/, components/, lib/', color: FGMUTE }],
      [{ text: ']', color: GRN }],
      [{ text: '// Sempre teste: npm run build + inspecione o CSS', color: FGMUTE }],
    ],
    why: 'Em dev, o JIT é mais agressivo e inclui mais classes. Em produção, apenas o content[] é escaneado. Classes de arquivos fora do glob desaparecem em produção — bug silencioso e difícil de debugar.',
  },
  {
    title: 'Usar !important em vez de cn() / ordem correta',
    wrong: [
      [{ text: '// !important é sinal de especificidade mal gerenciada', color: FGMUTE }],
      [{ text: "<Button className='!bg-red-500 !text-white'>", color: RED }],
      [{ text: '// Funciona mas cria cascata de !important', color: FGMUTE }],
      [{ text: '// Difícil de sobrescrever depois', color: RED }],
    ],
    right: [
      [{ text: '// cn() resolve conflitos sem !important', color: FGMUTE }],
      [{ text: "function Button({ className, variant }) {", color: GRN }],
      [{ text: "  return <button className={cn(", color: GRN }],
      [{ text: "    buttonVariants({ variant }),", color: GRN }],
      [{ text: '    className   // className externo sempre vence', color: GRN }],
      [{ text: '  )}>...', color: GRN }],
      [{ text: '}', color: GRN }],
    ],
    why: 'Tailwind tem o prefixo ! para !important mas é raramente necessário. cn() com tailwind-merge resolve conflitos de forma determinística sem precisar de !important. Guarde ! para last resort.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 8 — DecisionTree: usar utilitário ou extrair componente?
// Justificativa: "quando extrair para componente?" é a pergunta mais frequente
// ao trabalhar com Tailwind em time. A árvore de decisão resolve isso de forma
// objetiva — e é exatamente o tipo de questão cobrada em entrevista sênior.
// ═══════════════════════════════════════════════════════════════════════════════

const DECISION_ROOT: DTNode = {
  id: 'root',
  question: 'Esse conjunto de classes Tailwind aparece em quantos lugares?',
  children: [
    { label: '1 lugar único', nodeId: 'once', color: GRN },
    { label: '2-3 lugares', nodeId: 'few', color: AMB },
    { label: '4+ lugares no mesmo projeto', nodeId: 'many', color: C },
    { label: 'Em vários projetos diferentes', nodeId: 'cross', color: PRP },
  ],
}

const DECISION_NODES: Record<string, DTNode> = {
  once: {
    id: 'once',
    recommendation: 'Use classes Tailwind diretamente',
    detail: 'Utilitários inline são perfeitos para estilos únicos. Não crie abstração prematura — a vantagem do utility-first é a colocação de código.',
    color: GRN,
    icon: '✅',
  },
  few: {
    id: 'few',
    question: 'Tem lógica de variantes (hover, size, color)?',
    children: [
      { label: 'Sim — variantes diferentes por contexto', nodeId: 'cva', color: C },
      { label: 'Não — mesmas classes sempre', nodeId: 'maybe-component', color: AMB },
    ],
  },
  cva: {
    id: 'cva',
    recommendation: 'Componente React com cva',
    detail: 'cva (class-variance-authority) cria variantes type-safe. VariantProps extrai os tipos automaticamente. cn() combina com className externo sem conflitos.',
    color: C,
    icon: '🎯',
  },
  'maybe-component': {
    id: 'maybe-component',
    recommendation: 'Componente simples ou cn() helper',
    detail: 'Se são as mesmas classes sem variantes, um componente React simples resolve. Se é só uma combinação de utilitários usada em poucos lugares, uma constante string com cn() pode bastar.',
    color: AMB,
    icon: '🔧',
  },
  many: {
    id: 'many',
    recommendation: 'Componente React com cva + design system',
    detail: 'Com 4+ usos, crie um componente em src/components/ui/. Use cva para variantes, cn() para composição com className externo. Documente com Storybook se necessário.',
    color: C,
    icon: '🏗️',
  },
  cross: {
    id: 'cross',
    question: 'É visual (styling) ou comportamental?',
    children: [
      { label: 'Só visual — classes Tailwind', nodeId: 'npm-tw', color: GRN },
      { label: 'Comportamento + estilo', nodeId: 'npm-full', color: PRP },
    ],
  },
  'npm-tw': {
    id: 'npm-tw',
    recommendation: 'npm package com classes Tailwind',
    detail: 'Crie um package que exporta os componentes com as classes Tailwind inline. Quem instalar precisa ter Tailwind configurado. Documente no README.',
    color: GRN,
    icon: '📦',
  },
  'npm-full': {
    id: 'npm-full',
    recommendation: 'npm package com CSS próprio ou shadcn-style',
    detail: 'Para componentes cross-project com comportamento (dropdowns, modais), considere shadcn-style: o usuário copia o código. Ou use CSS Modules como fallback para quem não usa Tailwind.',
    color: PRP,
    icon: '📦',
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 9 — Tailwind v4 (DiffViewer)
// Justificativa: Tailwind v4 é uma mudança de paradigma — a configuração migra
// de JS para CSS puro (@theme), o engine troca para Rust, o content[] some.
// Ver exatamente o que muda linha a linha (v3 → v4) é a forma mais eficiente
// de estudar essa migração antes de uma entrevista sênior.
// ═══════════════════════════════════════════════════════════════════════════════

const TW_V4_DIFFS: DiffExample[] = [
  {
    id: 'config',
    label: 'Arquivo de configuração',
    description: 'tailwind.config.ts (v3) → @theme em CSS puro (v4)',
    beforeLabel: 'Tailwind v3 — tailwind.config.ts',
    afterLabel: 'Tailwind v4 — globals.css com @theme',
    before: `// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--color-primary) / <alpha-value>)',
        surface: 'hsl(var(--color-surface) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
} satisfies Config`,
    after: `/* globals.css — sem arquivo .ts de config */
@import "tailwindcss";

@theme {
  /* Tokens diretos em CSS — sem JS */
  --color-primary: oklch(0.6 0.15 200);
  --color-surface: oklch(0.15 0.02 240);
  --font-sans: 'Inter', sans-serif;

  /* content[] automático — sem configurar */
  /* darkMode: 'class' ainda via .dark no HTML */
}

/* Plugins como @utility */
@utility container-query {
  container-type: inline-size;
}`,
    explanation: 'v4 elimina o arquivo JS de configuração. @theme no CSS define tokens diretamente com sintaxe CSS nativa (oklch). Automatic content detection remove a necessidade de listar arquivos.',
    tags: ['configuração', 'migração', 'v4'],
  },
  {
    id: 'import',
    label: 'Importação do framework',
    description: 'Diretivas @tailwind (v3) → @import único (v4)',
    beforeLabel: 'Tailwind v3 — globals.css',
    afterLabel: 'Tailwind v4 — globals.css',
    before: `/* globals.css — v3 */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Configurações custom depois */
@layer base {
  :root {
    --color-primary: 187 100% 42%;
  }
}`,
    after: `/* globals.css — v4 */
@import "tailwindcss";

/* @theme substitui @layer base para tokens */
@theme {
  --color-primary: oklch(0.6 0.15 200);
}

/* @layer ainda funciona para CSS custom */
@layer base {
  * { box-sizing: border-box; }
}`,
    explanation: '@import "tailwindcss" substitui as três diretivas @tailwind. Sintaxe de cores muda: HSL "187 100% 42%" → OKLCH nativo do CSS moderno.',
    tags: ['importação', 'sintaxe', 'v4'],
  },
  {
    id: 'content',
    label: 'Content detection',
    description: 'content[] manual (v3) → automático (v4)',
    beforeLabel: 'Tailwind v3 — content manual obrigatório',
    afterLabel: 'Tailwind v4 — detecção automática',
    before: `// tailwind.config.ts — v3
export default {
  // OBRIGATÓRIO em v3:
  content: [
    './src/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    // Esquecer um diretório = classes somem em produção
  ],
  // ...
}`,
    after: `/* globals.css — v4 */
@import "tailwindcss";

/* Sem content[] — Tailwind v4 detecta
   automaticamente todos os arquivos
   relevantes do projeto.

   Para forçar inclusão de um path:
   @source "../node_modules/minha-lib";
*/

@theme {
  /* apenas tokens custom aqui */
}`,
    explanation: 'O gotcha mais doloroso do v3 (funciona em dev, some em produção por content[] incompleto) foi eliminado no v4 com detecção automática. @source para forçar inclusão de dependências externas.',
    tags: ['content', 'gotcha eliminado', 'v4'],
  },
  {
    id: 'arbitrary-custom',
    label: 'Valores arbitrários e utilitários custom',
    description: 'plugin() em JS (v3) → @utility em CSS (v4)',
    beforeLabel: 'Tailwind v3 — plugin em JS',
    afterLabel: 'Tailwind v4 — @utility em CSS',
    before: `// tailwind.config.ts — v3
import plugin from 'tailwindcss/plugin'

export default {
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        },
      })
    }),
  ],
}`,
    after: `/* globals.css — v4 */
@import "tailwindcss";

/* Utilitários custom em CSS puro — sem plugin() */
@utility scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

/* Uso: <div class="scrollbar-hide"> */`,
    explanation: 'Plugins que adicionavam utilitários em JS viram @utility em CSS. Menos indireção, mais alinhado com CSS nativo. A função plugin() ainda existe para plugins complexos.',
    tags: ['plugins', 'utilitários', 'v4'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export default function TailwindCssVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'utility-classes',
      title: 'Classes por Categoria',
      subtitle: 'Layout, Spacing, Typography, Colors, Effects e Variants — as 6 categorias que cobrem 95% do uso',
      accent: C,
      component: (
        <LayerStack
          layers={UTILITY_LAYERS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'responsive',
      title: 'Responsive Design',
      subtitle: 'Breakpoints sm/md/lg/xl/2xl — mobile-first e como combinar variantes',
      accent: SEC,
      component: <ResponsiveBreakpointsVisual />,
    },
    {
      id: 'jit-pipeline',
      title: 'Pipeline JIT',
      subtitle: 'Scan → Collect → Generate → Output — por que classes dinâmicas falham e content[] importa',
      accent: AMB,
      component: <JitPipelineVisual />,
    },
    {
      id: 'cva-pattern',
      title: 'cva + cn() passo a passo',
      subtitle: 'De classes brutas até variantes type-safe com VariantProps — o padrão profissional',
      accent: GRN,
      component: (
        <CodeStepper
          scenarios={CVA_SCENARIOS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'dark-mode',
      title: 'Dark Mode',
      subtitle: 'class vs media, dark: prefix, CSS variables e ThemeProvider',
      accent: PRP,
      component: (
        <FeaturesCarousel
          features={DARK_MODE_FEATURES}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'variants',
      title: 'Variants & States',
      subtitle: 'hover:, focus:, group-hover:, peer, dark:, aria-* — interatividade sem JavaScript',
      accent: RED,
      component: (
        <CardCarousel
          cards={VARIANTS_CARDS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'antipatterns',
      title: 'Anti-patterns do Tailwind',
      subtitle: 'Classes dinâmicas, @apply, tailwind-merge, content[] e !important',
      accent: RED,
      component: (
        <AntiPatternsGallery
          patterns={TW_ANTIPATTERNS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'decision',
      title: 'Utilitário ou Componente?',
      subtitle: 'Quando usar classes inline, extrair componente ou criar abstração com cva',
      accent: AMB,
      component: (
        <DecisionTree
          root={DECISION_ROOT}
          nodes={DECISION_NODES}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'tailwind-v4',
      title: 'Tailwind v4 — Migração',
      subtitle: 'tailwind.config.ts → @theme CSS, @tailwind → @import, content[] → automático',
      accent: PINK,
      component: (
        <DiffViewer
          examples={TW_V4_DIFFS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
  ]

  return (
    <VisuaisShell
      visuals={visuals}
      active={active}
      onChange={setActive}
    />
  )
}
