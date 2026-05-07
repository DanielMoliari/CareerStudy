'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { ConceptCarousel } from '@/components/visuals/ConceptCarousel'
import type { Slide } from '@/components/visuals/ConceptCarousel'
import { ProgressionMap } from '@/components/visuals/ProgressionMap'
import type { ProgressionLevel } from '@/components/visuals/ProgressionMap'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'

// ── Paleta Design Systems ─────────────────────────────────────────────────────
const C      = '#3b82f6'   // blue accent
const BG     = '#0f172a'
const CARD   = '#1e293b'
const GRN    = '#22c55e'
const RED    = '#ef4444'
const AMB    = '#f59e0b'
const PRP    = '#a78bfa'
const SKY    = '#38bdf8'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Token layers (LayerStack)
// ═══════════════════════════════════════════════════════════════════════════════

const TOKEN_LAYERS: Layer[] = [
  {
    id: 'components',
    label: 'Camada 4 — Componentes',
    sublabel: 'Consomem apenas tokens semânticos',
    color: GRN,
    description: 'Componentes UI usam exclusivamente tokens semânticos via CSS variables. Nunca referenciam primitivos diretamente. Quando o tema muda, os componentes atualizam automaticamente via CSS cascade — sem re-render.',
    examples: [
      'Button: background: var(--color-primary)',
      'Alert: color: var(--color-error)',
      'Card: padding: var(--spacing-component)',
      'Input: border: 1px solid var(--color-border)',
    ],
  },
  {
    id: 'brand',
    label: 'Camada 3 — Multi-brand / Tema',
    sublabel: 'Override por marca ou tema via atributo de dados',
    color: AMB,
    description: 'A camada de override redefine tokens semânticos para contextos específicos. Os mesmos componentes da Camada 4 se adaptam automaticamente ao trocar o atributo data-brand ou data-theme no root.',
    examples: [
      '[data-brand="b"] --color-primary: var(--purple-500)',
      '[data-theme="dark"] --color-surface: var(--gray-900)',
      '[data-theme="dark"] --color-text: var(--gray-100)',
    ],
  },
  {
    id: 'semantic',
    label: 'Camada 2 — Semânticos',
    sublabel: 'Tokens com propósito — o que os componentes consomem',
    color: C,
    description: 'Tokens semânticos mapeiam primitivos com nomes de propósito. Essa indireção é o que permite dark mode e multi-brand: mudar qual primitivo um semântico aponta atualiza todos os componentes.',
    examples: [
      '--color-primary → {blue-500}',
      '--color-error → {red-600}',
      '--color-surface → {gray-100}',
      '--spacing-component → {space-4}',
    ],
  },
  {
    id: 'primitives',
    label: 'Camada 1 — Primitivos',
    sublabel: 'Valores brutos sem semântica — nunca usados diretamente',
    color: FGMUTE,
    description: 'Primitivos são os valores absolutos do design system. Não têm semântica de uso — apenas existem para serem referenciados pelos semânticos. Gerados a partir dos tokens do Figma via Token Studio / Style Dictionary.',
    examples: [
      '--blue-500: #3b82f6',
      '--red-600: #dc2626',
      '--gray-100: #f1f5f9',
      '--space-4: 16px',
      '--radius-md: 8px',
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Comparativo de ferramentas (ComparisonTable)
// ═══════════════════════════════════════════════════════════════════════════════

const TOOL_OPTIONS: ComparisonOption[] = [
  { id: 'radix',   label: 'Radix UI',       sublabel: 'primitivos acessíveis sem estilo', color: PRP },
  { id: 'shadcn',  label: 'shadcn/ui',      sublabel: 'Radix + Tailwind + cva',          color: C   },
  { id: 'mui',     label: 'MUI',            sublabel: 'Material Design',                  color: AMB },
  { id: 'custom',  label: 'DS Interno',     sublabel: 'tokens próprios + componentes',    color: GRN },
]

const TOOL_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'a11y',
    label: 'Acessibilidade embutida',
    category: 'Qualidade',
    description: 'ARIA, focus management, keyboard nav prontos',
    values: {
      radix:  { rating: 'excellent', note: 'Razão de existir do Radix — a11y first' },
      shadcn: { rating: 'excellent', note: 'Herda tudo do Radix' },
      mui:    { rating: 'good',      note: 'Boa, mas alguns componentes precisam ajuste' },
      custom: { rating: 'fair',      note: 'Depende do investimento — pode usar Radix como base' },
    },
  },
  {
    id: 'customization',
    label: 'Customização visual',
    category: 'Flexibilidade',
    description: 'Facilidade de aplicar o design próprio da empresa',
    values: {
      radix:  { rating: 'excellent', note: 'Sem estilo — você aplica o que quiser' },
      shadcn: { rating: 'good',      note: 'Código é seu — edita diretamente' },
      mui:    { rating: 'fair',      note: 'Theming system, mas tem opinião forte' },
      custom: { rating: 'excellent', note: 'Total controle' },
    },
  },
  {
    id: 'velocity',
    label: 'Velocidade de desenvolvimento',
    category: 'DX',
    description: 'Quão rápido você cria uma tela nova',
    values: {
      radix:  { rating: 'fair',      note: 'Você estiliza do zero — mais trabalho' },
      shadcn: { rating: 'excellent', note: 'Componentes prontos, copy-paste no projeto' },
      mui:    { rating: 'excellent', note: 'Tudo pronto, documentação extensa' },
      custom: { rating: 'good',      note: 'Rápido quando maduro, lento para construir' },
    },
  },
  {
    id: 'bundle',
    label: 'Bundle size',
    category: 'Performance',
    description: 'Impacto no tamanho do bundle JS',
    values: {
      radix:  { rating: 'good',      note: 'Primitivos leves, instala só o que usa' },
      shadcn: { rating: 'excellent', note: 'Só o que você copia — tree-shakeable perfeito' },
      mui:    { rating: 'fair',      note: 'Grande — mesmo com tree shaking' },
      custom: { rating: 'excellent', note: 'Controle total do bundle' },
    },
  },
  {
    id: 'typescript',
    label: 'TypeScript first',
    category: 'DX',
    description: 'Tipos robustos, autocomplete',
    values: {
      radix:  { rating: 'excellent', note: 'TypeScript nativo, tipos excelentes' },
      shadcn: { rating: 'excellent', note: 'TypeScript nativo + cva' },
      mui:    { rating: 'good',      note: 'TS suportado, mas alguns tipos verbosos' },
      custom: { rating: 'excellent', note: 'Você define — pode ser perfeito' },
    },
  },
  {
    id: 'multibrand',
    label: 'Suporte a multi-brand',
    category: 'Escala',
    description: 'Suportar múltiplas marcas visuais',
    values: {
      radix:  { rating: 'excellent', note: 'Sem estilo = sem opinião de marca' },
      shadcn: { rating: 'good',      note: 'CSS variables + override por marca' },
      mui:    { rating: 'fair',      note: 'Theme nesting funciona mas é trabalhoso' },
      custom: { rating: 'excellent', note: 'Token layers — built-in para isso' },
    },
  },
  {
    id: 'maintenance',
    label: 'Custo de manutenção',
    category: 'Operacional',
    description: 'Esforço para manter e evoluir',
    values: {
      radix:  { rating: 'excellent', note: 'Primitivos são estáveis — poucas breaking changes' },
      shadcn: { rating: 'good',      note: 'Código seu — sem dependência de versão de pacote' },
      mui:    { rating: 'fair',      note: 'Major versions com breaking changes' },
      custom: { rating: 'poor',      note: 'Alto custo — você mantém tudo' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Jornada token → componente (ConceptCarousel)
// ═══════════════════════════════════════════════════════════════════════════════

function TokenBox({ tokens, color }: { tokens: Array<{key: string; value: string}>; color: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {tokens.map((t, i) => (
        <div
          key={i}
          style={{
            background: CARD,
            border: `1px solid ${color}`,
            borderRadius: 6,
            padding: '8px 12px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ color }}>{t.key}</span>
          <span style={{ color: FGMUTE }}>{t.value}</span>
        </div>
      ))}
    </div>
  )
}

const TOKEN_SLIDES: Slide[] = [
  {
    title: 'Tokens primitivos — valores brutos',
    paragraphs: [
      'Tokens primitivos são as "matérias-primas" do design system: valores absolutos sem semântica de uso. São referenciados pelos tokens semânticos, nunca usados diretamente nos componentes.',
      'Exemplos: blue-500, gray-900, space-4, radius-md. Eles podem ser gerados por ferramentas como Token Studio no Figma e exportados em JSON.',
    ],
    gradient: ['rgba(100,116,139,0.18)', 'rgba(15,23,42,0.95)'],
    illustration: (
      <TokenBox
        color={FGMUTE}
        tokens={[
          { key: '--blue-500', value: '#3b82f6' },
          { key: '--red-600', value: '#dc2626' },
          { key: '--gray-100', value: '#f1f5f9' },
          { key: '--space-4', value: '16px' },
          { key: '--radius-md', value: '8px' },
        ]}
      />
    ),
  },
  {
    title: 'Tokens semânticos — propósito e contexto',
    paragraphs: [
      'Tokens semânticos mapeiam primitivos com nomes de propósito: color.primary aponta para blue-500. Os componentes sempre usam tokens semânticos — nunca primitivos.',
      'Isso cria a camada de indireção que permite dark mode e multi-brand: mudar qual primitivo um semântico referencia atualiza todos os componentes automaticamente, sem tocar em nenhum deles.',
    ],
    gradient: ['rgba(59,130,246,0.18)', 'rgba(15,23,42,0.95)'],
    illustration: (
      <TokenBox
        color={C}
        tokens={[
          { key: '--color-primary', value: '→ {blue-500}' },
          { key: '--color-error', value: '→ {red-600}' },
          { key: '--color-surface', value: '→ {gray-100}' },
          { key: '--spacing-component', value: '→ {space-4}' },
          { key: '--radius-default', value: '→ {radius-md}' },
        ]}
      />
    ),
  },
  {
    title: 'Override por marca ou tema',
    paragraphs: [
      'A camada de override aplica tokens semânticos diferentes por contexto (data-brand, data-theme). Os componentes continuam usando os mesmos tokens semânticos — apenas o mapeamento muda.',
      'Resultado: um Button com background var(--color-primary) automaticamente usa azul na Marca A, roxo na Marca B, e o tom correto no dark mode.',
    ],
    gradient: ['rgba(245,158,11,0.18)', 'rgba(15,23,42,0.95)'],
    illustration: (
      <TokenBox
        color={AMB}
        tokens={[
          { key: '[data-brand="b"] --color-primary', value: '→ {purple-500}' },
          { key: '[data-theme="dark"] --color-surface', value: '→ {gray-900}' },
          { key: '[data-theme="dark"] --color-text', value: '→ {gray-100}' },
        ]}
      />
    ),
  },
  {
    title: 'Componentes — consomem apenas semânticos',
    paragraphs: [
      'O componente nunca sabe qual primitivo está sendo usado. Usa apenas var(--color-primary), var(--spacing-component). Isso garante que o mesmo componente funciona em qualquer marca e tema sem modificação.',
      'Ao mudar os tokens semânticos (trocar o tema), todos os componentes atualizam instantaneamente via CSS cascade — sem re-render no React.',
    ],
    gradient: ['rgba(34,197,94,0.18)', 'rgba(15,23,42,0.95)'],
    illustration: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { label: 'Button', css: 'background: var(--color-primary)', show: '#3b82f6' },
          { label: 'Alert', css: 'border: var(--color-error)', show: '#dc2626' },
          { label: 'Card', css: 'padding: var(--spacing-component)', show: '16px' },
        ].map((comp, i) => (
          <div
            key={i}
            style={{
              background: CARD,
              border: `1px solid ${GRN}`,
              borderRadius: 6,
              padding: '8px 12px',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
            }}
          >
            <div style={{ color: GRN, fontWeight: 700, marginBottom: 4 }}>{comp.label}</div>
            <div style={{ color: FGMUTE }}>{comp.css}</div>
            <div style={{ color: FG, fontSize: 10, marginTop: 2 }}>→ compila para: {comp.show}</div>
          </div>
        ))}
      </div>
    ),
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Progression map
// ═══════════════════════════════════════════════════════════════════════════════

const DS_LEVELS: ProgressionLevel[] = [
  {
    id: 'iniciante',
    name: 'Iniciante',
    label: 'Consumidor do DS',
    emoji: 'IN',
    concepts: [
      { name: 'Usar componentes do DS',          tip: 'import { Button } from "@empresa/ui" — usar a API sem modificar' },
      { name: 'Tokens CSS variables',            tip: 'var(--color-primary) — usar variáveis em vez de valores hardcoded' },
      { name: 'Storybook como catálogo',         tip: 'Consultar stories para ver variantes disponíveis' },
      { name: 'Props tipadas TypeScript',         tip: 'Autocompletar no editor — variantes disponíveis aparecem' },
    ],
  },
  {
    id: 'pleno',
    name: 'Pleno',
    label: 'Contribuidor do DS',
    emoji: 'PL',
    concepts: [
      { name: 'Primitivos vs semânticos',        tip: 'Saber por que componentes usam semânticos, nunca primitivos' },
      { name: 'cva para variantes',              tip: 'class-variance-authority para variantes type-safe' },
      { name: 'Stories por variante',            tip: 'Escrever Stories cobrindo todos os estados do componente' },
      { name: 'Semver no DS',                    tip: 'Patch/minor/major — saber o que é cada tipo de mudança' },
      { name: 'a11y básico em componentes',      tip: 'aria-label, aria-disabled, role — pelo menos os obrigatórios' },
      { name: 'Radix UI como base',              tip: 'Usar primitivos Radix para a11y automática' },
    ],
  },
  {
    id: 'senior',
    name: 'Sênior',
    label: 'Arquiteto do DS',
    emoji: 'SR',
    concepts: [
      { name: 'Arquitetura de token layers',     tip: 'Primitivo → semântico → brand override — a cadeia completa' },
      { name: 'Multi-brand implementation',      tip: 'CSS variables + data-brand para marcas independentes' },
      { name: 'Chromatic para visual regression', tip: 'Configurar e interpretar diffs — o que aprovar vs rejeitar' },
      { name: 'Migration guide + codemods',      tip: 'jscodeshift para automatizar migração de breaking changes' },
      { name: 'Monorepo com Changesets',         tip: 'Versões coordenadas de múltiplos pacotes do DS' },
      { name: 'Métricas de adoção',              tip: 'Script de auditoria de codebase, npm downloads, coverage %' },
      { name: 'asChild pattern',                 tip: 'Polimorfismo semântico sem prop "as" — padrão Radix' },
      { name: 'Focus management complexo',       tip: 'Focus trap, retorno de foco, @radix-ui/react-focus-scope' },
      { name: 'Governança do DS',                tip: 'RFC process, DS team vs contributors, decisão de incluir/excluir' },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// Componente principal
// ═══════════════════════════════════════════════════════════════════════════════

export default function DesignSystemsVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'token-layers',
      title: 'Token layers',
      subtitle: 'Primitivos → Semânticos → Multi-brand → Componentes',
      accent: C,
      component: (
        <LayerStack
          layers={TOKEN_LAYERS}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'token-journey',
      title: 'Jornada do token',
      subtitle: 'Como um valor bruto vira consistência visual em todos os componentes',
      accent: AMB,
      component: (
        <ConceptCarousel
          slides={TOKEN_SLIDES}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'tools-comparison',
      title: 'Comparativo de ferramentas',
      subtitle: 'Radix UI vs shadcn/ui vs MUI vs DS interno — quando usar cada um',
      accent: PRP,
      component: (
        <ComparisonTable
          options={TOOL_OPTIONS}
          criteria={TOOL_CRITERIA}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'progression',
      title: 'Jornada — iniciante ao sênior',
      subtitle: 'Consumidor → Contribuidor → Arquiteto do DS',
      accent: GRN,
      component: (
        <ProgressionMap
          levels={DS_LEVELS}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
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
