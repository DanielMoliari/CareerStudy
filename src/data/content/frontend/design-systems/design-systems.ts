import type { SkillContent } from '@/types'

const designSystems: SkillContent = {
  tagline: "Conjunto de componentes, tokens e guias que garantem consistência visual e de UX em escala.",
  why: "Design systems são o que diferencia empresas que escalam UI de empresas que têm inconsistência visual. Sênior precisa entender como construir, versionar e evoluir um design system — não só consumir.",
  summary: "Um design system é a combinação de: tokens de design (cores, espaçamento, tipografia), componentes UI reutilizáveis, documentação de uso e guias de acessibilidade. No código, são bibliotecas versionadas consumidas por múltiplos produtos. Ferramentas: Storybook para desenvolvimento/documentação, tokens via CSS variables ou JSON (Style Dictionary, Token Studio), publicação via npm. Empresas como Spotify, Airbnb e GitHub têm design systems maduros (Encore, Oxygen, Primer) que unificam dezenas de squads.",
  keypoints: [
    {
      title: "Design tokens",
      body: "Variáveis que representam decisões de design: cores semânticas (color.primary, color.error), espaçamentos (spacing.4 = 16px), raios de borda, sombras. Definidos em JSON (Token Studio, Style Dictionary) e compilados para CSS variables, SCSS, JS.",
      code: `/* CSS variables geradas dos tokens */
:root {
  --color-primary: #3178C6;
  --color-error: #ef4444;
  --spacing-4: 1rem;
  --radius-md: 0.5rem;
}

/* Uso no componente */
.button {
  background: var(--color-primary);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
}`
    },
    {
      title: "Componentes com variantes type-safe",
      body: "Componentes do design system devem ter API consistente: variantes (variant, size, intent) tipadas com TypeScript, props documentadas com JSDoc. cva (class-variance-authority) + TypeScript é o padrão atual para variantes type-safe.",
      code: `import { cva, type VariantProps } from 'class-variance-authority'

const button = cva('btn-base', {
  variants: {
    variant: { primary: 'btn-primary', ghost: 'btn-ghost' },
    size:    { sm: 'btn-sm', md: 'btn-md', lg: 'btn-lg' },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
})

type ButtonProps = VariantProps<typeof button> & { label: string }

export function Button({ variant, size, label }: ButtonProps) {
  return <button className={button({ variant, size })}>{label}</button>
}`
    },
    {
      title: "Storybook",
      body: "Ambiente de desenvolvimento isolado para componentes. Cada componente tem Stories (cenários de uso). Permite desenvolver sem o app, documentar automaticamente props e testar visual automaticamente (Chromatic).",
      code: `// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  component: Button,
  args: { label: 'Clique aqui' },
}
export default meta

type Story = StoryObj<typeof Button>

export const Primary: Story = { args: { variant: 'primary' } }
export const Ghost: Story   = { args: { variant: 'ghost' } }
export const Small: Story   = { args: { size: 'sm' } }`
    },
    {
      title: "Versionamento e breaking changes",
      body: "Design systems são APIs públicas. Breaking changes (renomear prop, remover variante) precisam de major version. Use semantic versioning. Forneça changelogs detalhados e codemods automatizados (jscodeshift) para grandes migrações.",
    },
    {
      title: "Temas e multi-brand",
      body: "Design systems para múltiplas marcas usam token layers: tokens primitivos (azul-600: #2563eb) + tokens semânticos (color.primary: {azul-600}) + tokens por marca (marca-a.primary: {roxo-600}). CSS variables com troca de :root permitem tema dinâmico sem re-render.",
      code: `/* Token layers para multi-brand */
/* Camada 1: primitivos */
:root { --blue-600: #2563eb; --purple-600: #7c3aed; }

/* Camada 2: semânticos (produto A) */
[data-brand="a"] { --color-primary: var(--blue-600); }

/* Camada 3: semânticos (produto B) */
[data-brand="b"] { --color-primary: var(--purple-600); }

/* Componente usa só semânticos — funciona com qualquer marca */
.btn { background: var(--color-primary); }`
    },
    {
      title: "Acessibilidade integrada",
      body: "Design systems são o lugar certo para garantir acessibilidade sistêmica: atributos ARIA nos componentes base, ratio de contraste mínimo 4.5:1 nos tokens de cor, suporte a navegação por teclado, focus visible styles. Fazer a11y no DS elimina retrabalho em cada produto.",
    },
    {
      title: "Publicação e adoção",
      body: "Design systems vivem como pacotes npm (ex: @empresa/ui). Monorepo com Turborepo/Nx. Cada produto consome como dep. Chromatic para diff visual em PRs. Documentação em Storybook publicada (Chromatic ou Vercel). Adoção medida via npm stats e cobertura de componentes.",
    },
  ],
  diagrams: [
    {
      title: "Arquitetura de token layers",
      html: `<style>
.ds-wrap { font-family: 'Space Grotesk', sans-serif; background: #0f172a; color: #e2e8f0; padding: 24px; border-radius: 12px; }
.ds-layers { display: flex; flex-direction: column; gap: 12px; }
.ds-layer { border-radius: 8px; padding: 14px 18px; border: 1.5px solid; position: relative; }
.ds-l1 { border-color: #64748b; background: #1e293b; }
.ds-l2 { border-color: #3b82f6; background: #172033; }
.ds-l3 { border-color: #8b5cf6; background: #1a1730; }
.ds-l4 { border-color: #22c55e; background: #0f2210; }
.ds-layer-title { font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; margin-bottom: 6px; }
.ds-l1 .ds-layer-title { color: #64748b; }
.ds-l2 .ds-layer-title { color: #3b82f6; }
.ds-l3 .ds-layer-title { color: #8b5cf6; }
.ds-l4 .ds-layer-title { color: #22c55e; }
.ds-tokens { display: flex; gap: 8px; flex-wrap: wrap; }
.ds-tok { font-family: 'JetBrains Mono', monospace; font-size: 11px; background: rgba(255,255,255,0.06); padding: 3px 8px; border-radius: 4px; color: #94a3b8; }
.ds-arr { text-align: center; font-size: 18px; color: #334155; margin: -2px 0; }
.ds-title { font-size: 13px; font-weight: 700; color: #4d9fcf; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; text-align: center; }
</style>
<div class="ds-wrap">
  <div class="ds-title">Token layers — do primitivo ao componente</div>
  <div class="ds-layers">
    <div class="ds-layer ds-l1">
      <div class="ds-layer-title">Camada 1 — Primitivos (sem semântica)</div>
      <div class="ds-tokens">
        <span class="ds-tok">blue-500: #3b82f6</span>
        <span class="ds-tok">blue-600: #2563eb</span>
        <span class="ds-tok">red-600: #dc2626</span>
        <span class="ds-tok">gray-100: #f1f5f9</span>
        <span class="ds-tok">space-4: 16px</span>
        <span class="ds-tok">radius-md: 8px</span>
      </div>
    </div>
    <div class="ds-arr">↓ referencia</div>
    <div class="ds-layer ds-l2">
      <div class="ds-layer-title">Camada 2 — Semânticos (propósito, não cor)</div>
      <div class="ds-tokens">
        <span class="ds-tok">color.primary → {blue-500}</span>
        <span class="ds-tok">color.error → {red-600}</span>
        <span class="ds-tok">color.surface → {gray-100}</span>
        <span class="ds-tok">spacing.component → {space-4}</span>
        <span class="ds-tok">radius.default → {radius-md}</span>
      </div>
    </div>
    <div class="ds-arr">↓ sobrescreve por marca</div>
    <div class="ds-layer ds-l3">
      <div class="ds-layer-title">Camada 3 — Multi-brand override</div>
      <div class="ds-tokens">
        <span class="ds-tok">[data-brand=b] color.primary → purple-500</span>
        <span class="ds-tok">[data-theme=dark] color.surface → gray-900</span>
      </div>
    </div>
    <div class="ds-arr">↓ consome apenas semânticos</div>
    <div class="ds-layer ds-l4">
      <div class="ds-layer-title">Camada 4 — Componentes (usam só semânticos)</div>
      <div class="ds-tokens">
        <span class="ds-tok">Button: background = var(--color-primary)</span>
        <span class="ds-tok">Alert: color = var(--color-error)</span>
        <span class="ds-tok">Card: padding = var(--spacing-component)</span>
      </div>
    </div>
  </div>
</div>`,
      caption: "A separação primitivo → semântico → componente permite trocar tema ou marca sem tocar nos componentes.",
    },
    {
      title: "Fluxo de contribuição e versionamento",
      html: `<style>
.dsv-wrap { font-family: 'Space Grotesk', sans-serif; background: #0f172a; color: #e2e8f0; padding: 24px; border-radius: 12px; }
.dsv-title { font-size: 13px; font-weight: 700; color: #4d9fcf; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; text-align: center; }
.dsv-flow { display: flex; align-items: center; gap: 0; flex-wrap: nowrap; overflow-x: auto; }
.dsv-step { background: #1e293b; border-radius: 8px; padding: 12px 14px; min-width: 120px; text-align: center; flex-shrink: 0; }
.dsv-step-num { font-size: 10px; font-weight: 700; color: #3b82f6; text-transform: uppercase; letter-spacing: .05em; margin-bottom: 4px; }
.dsv-step-name { font-size: 12px; font-weight: 600; color: #e2e8f0; margin-bottom: 4px; }
.dsv-step-sub { font-size: 10px; color: #64748b; }
.dsv-arr { color: #334155; font-size: 20px; flex-shrink: 0; padding: 0 6px; }
.dsv-semver { margin-top: 20px; background: #1e293b; border-radius: 8px; padding: 14px 18px; }
.dsv-sv-title { font-size: 11px; font-weight: 700; color: #4d9fcf; text-transform: uppercase; letter-spacing: .05em; margin-bottom: 10px; }
.dsv-sv-row { display: flex; gap: 12px; align-items: center; margin-bottom: 6px; font-size: 12px; color: #94a3b8; }
.dsv-sv-tag { font-family: 'JetBrains Mono', monospace; font-size: 11px; padding: 2px 8px; border-radius: 4px; font-weight: 700; }
.dsv-patch { background: rgba(34,197,94,0.15); color: #22c55e; }
.dsv-minor { background: rgba(245,158,11,0.15); color: #f59e0b; }
.dsv-major { background: rgba(239,68,68,0.15); color: #ef4444; }
</style>
<div class="dsv-wrap">
  <div class="dsv-title">Fluxo de contribuição e versão</div>
  <div class="dsv-flow">
    <div class="dsv-step">
      <div class="dsv-step-num">01</div>
      <div class="dsv-step-name">RFC / Issue</div>
      <div class="dsv-step-sub">proposta documentada</div>
    </div>
    <div class="dsv-arr">→</div>
    <div class="dsv-step">
      <div class="dsv-step-num">02</div>
      <div class="dsv-step-name">Design Review</div>
      <div class="dsv-step-sub">Figma + tokens</div>
    </div>
    <div class="dsv-arr">→</div>
    <div class="dsv-step">
      <div class="dsv-step-num">03</div>
      <div class="dsv-step-name">PR + Stories</div>
      <div class="dsv-step-sub">implementação</div>
    </div>
    <div class="dsv-arr">→</div>
    <div class="dsv-step">
      <div class="dsv-step-num">04</div>
      <div class="dsv-step-name">Chromatic</div>
      <div class="dsv-step-sub">visual diff</div>
    </div>
    <div class="dsv-arr">→</div>
    <div class="dsv-step">
      <div class="dsv-step-num">05</div>
      <div class="dsv-step-name">npm publish</div>
      <div class="dsv-step-sub">semver</div>
    </div>
    <div class="dsv-arr">→</div>
    <div class="dsv-step">
      <div class="dsv-step-num">06</div>
      <div class="dsv-step-name">Storybook live</div>
      <div class="dsv-step-sub">documentação</div>
    </div>
  </div>
  <div class="dsv-semver">
    <div class="dsv-sv-title">Semver no design system</div>
    <div class="dsv-sv-row"><span class="dsv-sv-tag dsv-patch">patch</span>Bug fix visual, typo em doc, ajuste de cor dentro do token</div>
    <div class="dsv-sv-row"><span class="dsv-sv-tag dsv-minor">minor</span>Nova prop, nova variante, novo componente — não quebra consumidores</div>
    <div class="dsv-sv-row"><span class="dsv-sv-tag dsv-major">major</span>Renomear prop, remover variante, mudar comportamento padrão — requer migration guide + codemod</div>
  </div>
</div>`,
      caption: "Contribuição controlada garante que o design system não vire um repositório de hacks de cada squad.",
    },
    {
      title: "Anatomia de um componente de design system",
      html: `<style>
.dsa-wrap { font-family: 'Space Grotesk', sans-serif; background: #0f172a; color: #e2e8f0; padding: 24px; border-radius: 12px; }
.dsa-title { font-size: 13px; font-weight: 700; color: #4d9fcf; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; text-align: center; }
.dsa-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.dsa-box { background: #1e293b; border-radius: 8px; padding: 14px; border-left: 3px solid; }
.dsa-b1 { border-color: #3b82f6; }
.dsa-b2 { border-color: #22c55e; }
.dsa-b3 { border-color: #f59e0b; }
.dsa-b4 { border-color: #a78bfa; }
.dsa-box-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 8px; }
.dsa-b1 .dsa-box-title { color: #3b82f6; }
.dsa-b2 .dsa-box-title { color: #22c55e; }
.dsa-b3 .dsa-box-title { color: #f59e0b; }
.dsa-b4 .dsa-box-title { color: #a78bfa; }
.dsa-item { font-size: 12px; color: #94a3b8; margin-bottom: 4px; padding-left: 10px; position: relative; }
.dsa-item::before { content: '·'; position: absolute; left: 0; color: #475569; }
.dsa-preview { margin-top: 16px; background: #1e293b; border-radius: 8px; padding: 16px; }
.dsa-prev-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #4d9fcf; margin-bottom: 12px; }
.dsa-btn-row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.dsa-btn { padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 600; border: none; cursor: pointer; }
.dsa-btn-pri { background: #3b82f6; color: #fff; }
.dsa-btn-ghost { background: transparent; color: #3b82f6; border: 1.5px solid #3b82f6; }
.dsa-btn-dest { background: #ef4444; color: #fff; }
.dsa-btn-sm { padding: 5px 10px; font-size: 11px; }
.dsa-btn-lg { padding: 12px 24px; font-size: 15px; }
</style>
<div class="dsa-wrap">
  <div class="dsa-title">Anatomia de um componente bem construído</div>
  <div class="dsa-grid">
    <div class="dsa-box dsa-b1">
      <div class="dsa-box-title">API (props)</div>
      <div class="dsa-item">variant: primary | ghost | destructive</div>
      <div class="dsa-item">size: sm | md | lg</div>
      <div class="dsa-item">disabled?: boolean</div>
      <div class="dsa-item">loading?: boolean</div>
      <div class="dsa-item">asChild?: boolean (Radix)</div>
    </div>
    <div class="dsa-box dsa-b2">
      <div class="dsa-box-title">Acessibilidade</div>
      <div class="dsa-item">role="button" (implícito)</div>
      <div class="dsa-item">aria-disabled quando disabled</div>
      <div class="dsa-item">aria-busy quando loading</div>
      <div class="dsa-item">focus-visible ring visível</div>
      <div class="dsa-item">Contraste mínimo 4.5:1</div>
    </div>
    <div class="dsa-box dsa-b3">
      <div class="dsa-box-title">Documentação</div>
      <div class="dsa-item">Stories para cada variante</div>
      <div class="dsa-item">JSDoc em cada prop</div>
      <div class="dsa-item">Argstable gerada pelo Storybook</div>
      <div class="dsa-item">Exemplo de uso no código</div>
    </div>
    <div class="dsa-box dsa-b4">
      <div class="dsa-box-title">Testes</div>
      <div class="dsa-item">Chromatic visual diff</div>
      <div class="dsa-item">a11y addon (axe-core)</div>
      <div class="dsa-item">Interaction tests (Storybook play)</div>
      <div class="dsa-item">Unit tests críticos</div>
    </div>
  </div>
  <div class="dsa-preview">
    <div class="dsa-prev-title">Prévia — variantes do botão</div>
    <div class="dsa-btn-row">
      <button class="dsa-btn dsa-btn-pri">Primary</button>
      <button class="dsa-btn dsa-btn-ghost">Ghost</button>
      <button class="dsa-btn dsa-btn-dest">Destructive</button>
      <button class="dsa-btn dsa-btn-pri dsa-btn-sm">Small</button>
      <button class="dsa-btn dsa-btn-pri dsa-btn-lg">Large</button>
    </div>
  </div>
</div>`,
      caption: "Cada componente precisa de API tipada, acessibilidade embutida, documentação e testes — não apenas o visual.",
    },
  ],
  mnemonics: [
    {
      label: "Token layers — PSC",
      trick: "P-rimitivos, S-emânticos, C-omponentes",
      explanation: "Os 3 níveis de token são a fundação de qualquer design system escalável. Primitivos são valores brutos (blue-500). Semânticos mapeiam com propósito (color.primary → {blue-500}). Componentes usam apenas semânticos — quando o tema muda, atualizam automaticamente via CSS cascade.",
    },
    {
      label: "Semver no DS — PMM",
      trick: "P-atch, M-inor, M-ajor",
      explanation: "Design system é uma API pública. Patch: fix visual sem quebrar. Minor: nova prop/variante, aditivo. Major: renomear/remover prop — requer migration guide + codemod. Sem semver disciplinado, uma PR de 'melhoria' quebra 12 produtos simultaneamente.",
    },
    {
      label: "Storybook — DIT",
      trick: "D-evelopment, I-solation, T-esting",
      explanation: "Storybook resolve 3 problemas: onde desenvolvimento acontece (isolado, sem montar o app), como é documentado (argstable auto + JSDoc), e como é testado (Chromatic diff visual, a11y addon axe-core, play() para interaction tests).",
    },
    {
      label: "Acessibilidade sistêmica — CAK",
      trick: "C-ontraste, A-RIA, K-eyboard",
      explanation: "A11y feita no DS multiplica o impacto — implementada uma vez, todos os produtos herdam. Contraste ≥ 4.5:1 nos tokens. ARIA correto nos componentes base (aria-expanded, role, aria-label). Keyboard: focus management, focus-visible ring, Tab order.",
    },
  ],
  cheatsheet: {
    title: "Design Systems — Referência rápida",
    html: `<style>
.dsc-wrap { font-family: 'Space Grotesk', sans-serif; background: #0f172a; color: #e2e8f0; padding: 20px; border-radius: 10px; }
.dsc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.dsc-sec { background: #1e293b; border-radius: 8px; padding: 14px; }
.dsc-sec-title { font-size: 10px; font-weight: 700; color: #3b82f6; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 8px; }
.dsc-row { display: flex; gap: 8px; align-items: flex-start; margin-bottom: 5px; font-size: 11px; }
.dsc-key { font-family: 'JetBrains Mono', monospace; color: #e2e8f0; min-width: 140px; flex-shrink: 0; }
.dsc-val { color: #94a3b8; }
.dsc-ok  { color: #22c55e; }
.dsc-bad { color: #ef4444; }
</style>
<div class="dsc-wrap">
  <div class="dsc-grid">
    <div class="dsc-sec">
      <div class="dsc-sec-title">Ferramentas chave</div>
      <div class="dsc-row"><span class="dsc-key">Style Dictionary</span><span class="dsc-val">tokens JSON → CSS/SCSS/JS</span></div>
      <div class="dsc-row"><span class="dsc-key">Token Studio</span><span class="dsc-val">editor visual de tokens no Figma</span></div>
      <div class="dsc-row"><span class="dsc-key">cva</span><span class="dsc-val">variantes type-safe com Tailwind</span></div>
      <div class="dsc-row"><span class="dsc-key">Storybook</span><span class="dsc-val">dev isolado + documentação</span></div>
      <div class="dsc-row"><span class="dsc-key">Chromatic</span><span class="dsc-val">diff visual em PRs</span></div>
      <div class="dsc-row"><span class="dsc-key">Radix UI</span><span class="dsc-val">primitivos acessíveis sem estilo</span></div>
      <div class="dsc-row"><span class="dsc-key">shadcn/ui</span><span class="dsc-val">Radix + Tailwind + cva</span></div>
    </div>
    <div class="dsc-sec">
      <div class="dsc-sec-title">Regras de ouro</div>
      <div class="dsc-row"><span class="dsc-ok">✓</span><span class="dsc-val">Componentes usam só tokens semânticos (nunca primitivos)</span></div>
      <div class="dsc-row"><span class="dsc-ok">✓</span><span class="dsc-val">Semver rigoroso — breaking change = major version</span></div>
      <div class="dsc-row"><span class="dsc-ok">✓</span><span class="dsc-val">Todo componente tem Stories no Storybook</span></div>
      <div class="dsc-row"><span class="dsc-ok">✓</span><span class="dsc-val">A11y embutida nos componentes base (ARIA, contraste, keyboard)</span></div>
      <div class="dsc-row"><span class="dsc-bad">✗</span><span class="dsc-val">Muitas variantes/props = inconsistência, não flexibilidade</span></div>
      <div class="dsc-row"><span class="dsc-bad">✗</span><span class="dsc-val">Publicar sem Story = publicar sem documentação</span></div>
    </div>
    <div class="dsc-sec">
      <div class="dsc-sec-title">Arquitetura de pacotes</div>
      <div class="dsc-row"><span class="dsc-key">@empresa/tokens</span><span class="dsc-val">CSS vars, JS constants dos tokens</span></div>
      <div class="dsc-row"><span class="dsc-key">@empresa/ui</span><span class="dsc-val">componentes React versionados</span></div>
      <div class="dsc-row"><span class="dsc-key">@empresa/icons</span><span class="dsc-val">biblioteca de ícones SVG</span></div>
      <div class="dsc-row"><span class="dsc-key">@empresa/hooks</span><span class="dsc-val">hooks de acessibilidade e UX</span></div>
    </div>
    <div class="dsc-sec">
      <div class="dsc-sec-title">Métricas de adoção</div>
      <div class="dsc-row"><span class="dsc-key">npm downloads</span><span class="dsc-val">quantas apps usam o DS</span></div>
      <div class="dsc-row"><span class="dsc-key">coverage %</span><span class="dsc-val">% componentes vindos do DS vs custom</span></div>
      <div class="dsc-row"><span class="dsc-key">Chromatic PRs</span><span class="dsc-val">freq. de diff visual detectado</span></div>
      <div class="dsc-row"><span class="dsc-key">a11y score</span><span class="dsc-val">lighthouse média nos produtos</span></div>
    </div>
  </div>
</div>`,
  },
  mindmap: {
    title: "Design Systems — Mapa mental",
    html: `<style>
.dsm-wrap { font-family: 'Space Grotesk', sans-serif; background: #0f172a; color: #e2e8f0; padding: 24px; border-radius: 12px; }
.dsm-center { text-align: center; font-size: 16px; font-weight: 700; color: #3b82f6; background: #1e3a5f; padding: 12px 24px; border-radius: 50px; display: inline-block; margin: 0 auto 24px; }
.dsm-container { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
.dsm-branch { background: #1e293b; border-radius: 10px; padding: 14px; border-top: 2.5px solid; }
.dsm-b1 { border-color: #3b82f6; }
.dsm-b2 { border-color: #22c55e; }
.dsm-b3 { border-color: #f59e0b; }
.dsm-b4 { border-color: #a78bfa; }
.dsm-b5 { border-color: #ef4444; }
.dsm-b6 { border-color: #38bdf8; }
.dsm-branch-title { font-size: 12px; font-weight: 700; margin-bottom: 8px; }
.dsm-b1 .dsm-branch-title { color: #3b82f6; }
.dsm-b2 .dsm-branch-title { color: #22c55e; }
.dsm-b3 .dsm-branch-title { color: #f59e0b; }
.dsm-b4 .dsm-branch-title { color: #a78bfa; }
.dsm-b5 .dsm-branch-title { color: #ef4444; }
.dsm-b6 .dsm-branch-title { color: #38bdf8; }
.dsm-leaf { font-size: 11px; color: #94a3b8; margin-bottom: 3px; padding-left: 10px; position: relative; }
.dsm-leaf::before { content: '·'; position: absolute; left: 0; color: #475569; }
.dsm-header { text-align: center; margin-bottom: 20px; }
</style>
<div class="dsm-wrap">
  <div class="dsm-header">
    <div class="dsm-center">Design Systems</div>
  </div>
  <div class="dsm-container">
    <div class="dsm-branch dsm-b1">
      <div class="dsm-branch-title">Tokens</div>
      <div class="dsm-leaf">Primitivos (valores brutos)</div>
      <div class="dsm-leaf">Semânticos (propósito)</div>
      <div class="dsm-leaf">Multi-brand override</div>
      <div class="dsm-leaf">Style Dictionary</div>
      <div class="dsm-leaf">CSS variables</div>
    </div>
    <div class="dsm-branch dsm-b2">
      <div class="dsm-branch-title">Componentes</div>
      <div class="dsm-leaf">API tipada (TypeScript)</div>
      <div class="dsm-leaf">cva — variantes type-safe</div>
      <div class="dsm-leaf">Radix UI (primitivos)</div>
      <div class="dsm-leaf">Compound components</div>
      <div class="dsm-leaf">asChild pattern</div>
    </div>
    <div class="dsm-branch dsm-b3">
      <div class="dsm-branch-title">Documentação</div>
      <div class="dsm-leaf">Storybook</div>
      <div class="dsm-leaf">Stories por variante</div>
      <div class="dsm-leaf">Argstable auto</div>
      <div class="dsm-leaf">JSDoc nas props</div>
      <div class="dsm-leaf">Chromatic visual diff</div>
    </div>
    <div class="dsm-branch dsm-b4">
      <div class="dsm-branch-title">Acessibilidade</div>
      <div class="dsm-leaf">Contraste ≥ 4.5:1</div>
      <div class="dsm-leaf">ARIA correto</div>
      <div class="dsm-leaf">Navegação por teclado</div>
      <div class="dsm-leaf">Focus visible</div>
      <div class="dsm-leaf">a11y addon (axe-core)</div>
    </div>
    <div class="dsm-branch dsm-b5">
      <div class="dsm-branch-title">Versionamento</div>
      <div class="dsm-leaf">Semver (patch/minor/major)</div>
      <div class="dsm-leaf">CHANGELOG por versão</div>
      <div class="dsm-leaf">Migration guide (major)</div>
      <div class="dsm-leaf">Codemod (jscodeshift)</div>
      <div class="dsm-leaf">Deprecation period</div>
    </div>
    <div class="dsm-branch dsm-b6">
      <div class="dsm-branch-title">Publicação</div>
      <div class="dsm-leaf">Monorepo (Turborepo/Nx)</div>
      <div class="dsm-leaf">npm publish</div>
      <div class="dsm-leaf">Storybook publicado</div>
      <div class="dsm-leaf">Métricas de adoção</div>
      <div class="dsm-leaf">Changelog automático</div>
    </div>
  </div>
</div>`,
  },
  exercises: [
    {
      title: "Criar token layer completo com Style Dictionary",
      description: "Implemente tokens primitivos e semânticos para um botão usando Style Dictionary. Gere CSS variables e um objeto JS tipado. Inclua suporte a dark mode via data-theme='dark'.",
      level: "iniciante",
      concepts: ["design-tokens", "style-dictionary", "css-variables", "dark-mode"],
    },
    {
      title: "Componente Button com cva e Storybook",
      description: "Construa um Button com as variantes primary, ghost, destructive e sizes sm, md, lg usando cva. Adicione Stories para cada combinação de variante + size. Configure Storybook a11y addon.",
      level: "intermediario",
      concepts: ["cva", "storybook", "typescript", "accessibility"],
    },
    {
      title: "Design system multi-brand com token override",
      description: "Implemente um design system para 2 marcas (A e B) onde a marca B sobrescreve tokens semânticos via [data-brand='b']. Mostre que os componentes funcionam sem modificação. Adicione dark mode independente de brand.",
      level: "senior",
      concepts: ["multi-brand", "token-layers", "css-custom-properties", "theming"],
    },
    {
      title: "Pipeline de contribuição com Chromatic",
      description: "Configure um monorepo com Turborepo para um design system. Adicione Chromatic para detecção automática de regressão visual em PRs. Crie um script de release que valide stories antes de publicar no npm.",
      level: "senior",
      concepts: ["monorepo", "turborepo", "chromatic", "ci-cd", "npm-publish"],
    },
  ],
  videos: [
    { title: "Design Systems with Storybook — Full Course", channel: "Traversy Media", url: "https://www.youtube.com/watch?v=WhCXiEwdU1A" },
    { title: "Building a Design System with Radix UI + Tailwind", channel: "Jack Herrington", url: "https://www.youtube.com/watch?v=T-Zv73yZ_QI" },
    { title: "Design Tokens explained", channel: "Kevin Powell", url: "https://www.youtube.com/watch?v=6Kd3YZNbRb8" },
    { title: "Compound Components Pattern in React", channel: "Academind", url: "https://www.youtube.com/watch?v=23gjiqacr9k" },
    { title: "Storybook 7 Crash Course", channel: "Traversy Media", url: "https://www.youtube.com/watch?v=gdlTFPebzAU" },
  ],
  resources: [
    { title: "Style Dictionary docs", url: "https://amzn.github.io/style-dictionary/", kind: "docs" },
    { title: "Storybook docs", url: "https://storybook.js.org/docs", kind: "docs" },
    { title: "Token Studio", url: "https://tokens.studio/", kind: "pratica" },
    { title: "cva (class-variance-authority)", url: "https://cva.style/docs", kind: "docs" },
    { title: "Radix UI — primitivos acessíveis", url: "https://www.radix-ui.com/", kind: "docs" },
    { title: "Chromatic — visual testing", url: "https://www.chromatic.com/", kind: "pratica" },
    { title: "Design Systems handbook (InVision)", url: "https://www.designbetter.co/design-systems-handbook", kind: "livro" },
  ],
  codeExamples: [
    {
      title: "Token layer completo — Style Dictionary config",
      language: "json",
      code: `// tokens/tokens.json
{
  "color": {
    "blue": {
      "500": { "value": "#3b82f6", "$type": "color" },
      "600": { "value": "#2563eb", "$type": "color" }
    },
    "red": {
      "600": { "value": "#dc2626", "$type": "color" }
    }
  },
  "semantic": {
    "color": {
      "primary":  { "value": "{color.blue.500}", "$type": "color" },
      "error":    { "value": "{color.red.600}",  "$type": "color" },
      "primaryHover": { "value": "{color.blue.600}", "$type": "color" }
    }
  }
}

// style-dictionary.config.mjs
export default {
  source: ['tokens/tokens.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: 'ds',
      files: [{ destination: 'dist/tokens.css', format: 'css/variables' }]
    },
    js: {
      transformGroup: 'js',
      files: [{ destination: 'dist/tokens.js', format: 'javascript/es6' }]
    }
  }
}`
    },
    {
      title: "Componente Button type-safe com cva",
      language: "tsx",
      code: `import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef } from 'react'

const button = cva(
  // base styles
  'inline-flex items-center justify-center rounded-md font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:     'bg-[var(--ds-color-primary)] text-white hover:bg-[var(--ds-color-primary-hover)]',
        ghost:       'bg-transparent text-[var(--ds-color-primary)] border border-[var(--ds-color-primary)] hover:bg-[var(--ds-color-primary)]/10',
        destructive: 'bg-[var(--ds-color-error)] text-white hover:opacity-90',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
)

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>
  & VariantProps<typeof button>
  & { loading?: boolean }

/** Botão base do design system. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, loading, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      className={button({ variant, size })}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? <span className="spinner" aria-hidden /> : null}
      {children}
    </button>
  )
)
Button.displayName = 'Button'`
    },
    {
      title: "Stories no Storybook com interaction test",
      language: "tsx",
      code: `import type { Meta, StoryObj } from '@storybook/react'
import { within, userEvent } from '@storybook/testing-library'
import { expect } from '@storybook/jest'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  component: Button,
  tags: ['autodocs'], // gera documentação automática
  args: { children: 'Salvar' },
}
export default meta

type Story = StoryObj<typeof Button>

export const Primary: Story   = { args: { variant: 'primary' } }
export const Ghost: Story     = { args: { variant: 'ghost' } }
export const Destructive: Story = { args: { variant: 'destructive' } }
export const Small: Story     = { args: { size: 'sm' } }
export const Loading: Story   = { args: { loading: true } }
export const Disabled: Story  = { args: { disabled: true } }

// Interaction test — roda no browser via play()
export const ClickInteraction: Story = {
  args: { onClick: () => {} },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button'))
    expect(args.onClick).toHaveBeenCalled()
  },
}`
    },
    {
      title: "Multi-brand com CSS custom properties",
      language: "css",
      code: `/* tokens.css — gerado pelo Style Dictionary */

/* Primitivos */
:root {
  --ds-blue-500:   #3b82f6;
  --ds-blue-600:   #2563eb;
  --ds-purple-500: #8b5cf6;
  --ds-gray-900:   #0f172a;
}

/* Semânticos — brand A (default) */
:root,
[data-brand="a"] {
  --ds-color-primary:       var(--ds-blue-500);
  --ds-color-primary-hover: var(--ds-blue-600);
  --ds-color-surface:       #ffffff;
  --ds-color-text:          #0f172a;
}

/* Brand B override */
[data-brand="b"] {
  --ds-color-primary:       var(--ds-purple-500);
  --ds-color-primary-hover: #7c3aed;
}

/* Dark mode — independente de brand */
[data-theme="dark"] {
  --ds-color-surface: var(--ds-gray-900);
  --ds-color-text:    #e2e8f0;
}

/* Componente usa só semânticos */
.ds-button {
  background: var(--ds-color-primary);
  color: #fff;
}
.ds-button:hover {
  background: var(--ds-color-primary-hover);
}`
    },
  ],
  interview: [
    {
      q: "Qual a diferença entre design tokens primitivos e semânticos?",
      a: "<p>Tokens primitivos são valores brutos: <code>blue-500: '#3b82f6'</code>, <code>spacing-4: '16px'</code>. Não têm semântica de uso.</p><p>Tokens semânticos mapeiam primitivos com nome de propósito: <code>color.primary: '{blue-500}'</code>, <code>color.error: '{red-600}'</code>. Os componentes usam tokens semânticos — se você mudar qual primitivo mapeia para primary, todos os componentes atualizam automaticamente.</p><p>Essa separação é o que permite multi-brand e dark mode limpos.</p>",
      tip: "A maioria dos devs conhece tokens como 'variáveis de CSS'. Mostrar que você sabe a camada primitiva vs semântica é diferencial sênior.",
      level: "senior",
    },
    {
      q: "Como você gerencia breaking changes em um design system?",
      a: "<p>Semver: patch para bugfixes visuais, minor para adição de props, major para remoção/renomeação de props ou mudanças que quebram layouts. Forneça: CHANGELOG detalhado por versão, migration guide para majors, codemods automatizados quando possível (jscodeshift), período de deprecação antes de remover.</p><p>Versão com prefixo v2/ no pacote npm permite que consumidores migrem gradualmente coexistindo as versões.</p>",
      tip: "Citar codemods (jscodeshift) mostra que você pensa no custo de migração dos consumidores — diferencial sênior.",
      level: "senior",
    },
    {
      q: "Por que usar Storybook em um design system?",
      a: "<p>Storybook permite: desenvolvimento de componentes em isolamento (sem montar o app inteiro), documentação automática via JSDoc e prop types, teste visual com Chromatic (detecta diff de pixels entre PRs), catálogo navegável para designers e devs, stories como testes de acessibilidade automatizados (a11y addon com axe-core).</p>",
      tip: "Mencionar Chromatic especificamente demonstra que você conhece o ecossistema de teste visual — não só o Storybook básico.",
      level: "pleno",
    },
    {
      q: "Como você implementaria suporte a dark mode em um design system?",
      a: "<p>A abordagem padrão: tokens semânticos via CSS variables, troca de tema via atributo no :root (<code>data-theme='dark'</code> ou <code>.dark</code> class). Os componentes usam apenas tokens semânticos (<code>var(--color-surface)</code>) — nunca valores primitivos diretos. Ao trocar o tema, as CSS variables são redefinidas e tudo atualiza sem re-render. Token Studio + Style Dictionary geram os tokens dark automaticamente.</p>",
      tip: "O ponto chave é 'componentes usam apenas semânticos'. Se um componente usa blue-500 diretamente, dark mode não funciona.",
      level: "senior",
    },
    {
      q: "O que é cva e por que usar para variantes de componentes?",
      a: "<p>cva (class-variance-authority) é uma biblioteca que define variantes type-safe para componentes com classes CSS. Em vez de condicionais manuais (<code>className={variant === 'primary' ? '...' : '...'}</code>), você declara as variantes de forma declarativa com TypeScript inferindo os tipos automaticamente.</p><p>Benefício: TypeScript avisa se você passar uma variante inválida em tempo de compilação — impossível passar <code>variant='inexistente'</code> sem erro de tipo. É o padrão de shadcn/ui.</p>",
      tip: "Conectar cva ao shadcn/ui mostra que você conhece o ecossistema atual — não só conceitos abstratos.",
      level: "pleno",
    },
    {
      q: "Como funciona o padrão Compound Components em um design system?",
      a: "<p>Compound components (ex: <code>Select.Root</code>, <code>Select.Trigger</code>, <code>Select.Content</code>) permitem que o consumidor componha o comportamento sem que todos os subcomponentes precisem ser props do componente pai. A comunicação acontece via React Context interno.</p><p>Radix UI usa esse padrão extensivamente. É ideal para componentes complexos como Dialog, Select, Tabs — onde o consumidor precisa de flexibilidade para customizar cada parte.</p>",
      tip: "Radix UI é a referência de compound components bem feito. Se você conhece o padrão, mencione que o Radix resolve os edge cases de acessibilidade (focus trap, ARIA) que implementação manual erra.",
      level: "senior",
    },
    {
      q: "Como você mediria a adoção e saúde de um design system?",
      a: "<p>Métricas quantitativas: downloads npm (quantas apps usam), coverage % (% de componentes vindos do DS vs custom feito por squads), Chromatic PRs aceitos/rejeitados (frequência de regressão visual), Lighthouse a11y score médio dos produtos.</p><p>Métricas qualitativas: NPS dos devs consumidores, tempo médio para um dev novo criar uma tela usando o DS vs sem o DS, número de bugs de inconsistência reportados.</p>",
      tip: "A pergunta 'como medir' é armadilha — devs focam em features, seniores medem impacto. Mencionar NPS dos devs consumidores diferencia quem pensa em produto vs quem pensa em tech.",
      level: "senior",
    },
    {
      q: "Qual a diferença entre Radix UI e shadcn/ui?",
      a: "<p>Radix UI fornece primitivos de componente com acessibilidade completa mas sem estilos — você aplica qualquer CSS. shadcn/ui são componentes pré-estilizados construídos em cima de Radix + Tailwind + cva, com a filosofia de que você copia o código para sua pasta (não instala como dependência) e personaliza.</p><p>Para um design system interno: Radix como base (acessibilidade gratuita) + seus próprios estilos via tokens. shadcn/ui é bom como ponto de partida mas não substitui um DS customizado.</p>",
      tip: "A distinção 'copia o código vs instala como dep' é o que define a filosofia shadcn. Entender isso mostra que você sabe quando usar cada um.",
      level: "pleno",
    },
    {
      q: "Como garantir acessibilidade sistematicamente em um design system?",
      a: "<p>Três frentes: (1) Tokens de cor — verificar contraste 4.5:1 (normal) e 3:1 (grande) no CI. Ferramentas: axe-core, Stark no Figma. (2) Componentes — implementar ARIA correto uma vez (aria-expanded, role, aria-label, focus management). Consumidores herdam. (3) Automação — a11y addon no Storybook roda axe-core em cada story automaticamente; qualquer violação quebra o PR.</p>",
      tip: "O multiplicador de impacto é o ponto chave: a11y feita uma vez no DS vale por todos os produtos. Mencionar o CI quebrando em violação mostra mentalidade de qualidade sistêmica.",
      level: "senior",
    },
    {
      q: "Como organizar um monorepo de design system?",
      a: "<p>Turborepo ou Nx como orchestrador. Estrutura típica: <code>packages/tokens</code> (CSS vars, JS constants), <code>packages/ui</code> (componentes React), <code>packages/icons</code> (SVGs), <code>packages/hooks</code> (hooks de a11y/UX), <code>apps/storybook</code> (documentação). Cada pacote tem seu próprio package.json e versão. Changesets para gerenciar versões coordenadas.</p>",
      tip: "Mencionar Changesets (vs manual semver) mostra que você conhece as ferramentas modernas de release em monorepo.",
      level: "senior",
    },
    {
      q: "O que é o padrão asChild e quando usar?",
      a: "<p>asChild (do Radix UI) permite que um componente delegue sua renderização para o filho em vez de renderizar seu próprio elemento. Ex: <code>&lt;Button asChild&gt;&lt;Link href='/a'&gt;Ir&lt;/Link&gt;&lt;/Button&gt;</code> — renderiza um &lt;a&gt; com os estilos do Button, não um &lt;button&gt; dentro de um &lt;a&gt;.</p><p>Resolve o problema de polimorfismo semântico sem a prop <code>as</code> (que tem problemas de tipos no TypeScript). É o padrão moderno para componentes que precisam mudar o elemento raiz.</p>",
      tip: "asChild é uma técnica de Radix que resolveu um problema de longa data em design systems. Citá-la mostra que você acompanha a evolução da área.",
      level: "senior",
    },
    {
      q: "Como você faria a migração de um design system para uma nova versão major?",
      a: "<p>Processo de major migration: (1) publicar versão com deprecation warnings para tudo que vai mudar (minor version com console.warn). (2) Criar migration guide detalhado por componente com antes/depois. (3) Criar codemods (jscodeshift) para transformações automáticas de props. (4) Publicar a major. (5) Oferecer suporte por N meses para a versão anterior. (6) Comunicar com antecedência (changelog, slack, email).</p>",
      tip: "Codemods são o diferencial: permitem que squads migrem com uma linha de comando em vez de tocar arquivo por arquivo — multiplica a velocidade de adoção.",
      level: "senior",
    },
    {
      q: "O que é token aliasing e por que importa?",
      a: "<p>Token aliasing é a capacidade de um token referenciar outro token em vez de um valor literal. Ex: <code>color.primary: '{blue.500}'</code> em vez de <code>color.primary: '#3b82f6'</code>. Quando você quer mudar o tom de azul, muda apenas o valor primitivo e todos os tokens que o referenciam atualizam automaticamente.</p><p>Ferramentas como Style Dictionary e Token Studio suportam aliasing com referências em <code>{}</code>. Sem aliasing, você mantém múltiplas cópias do mesmo valor — inconsistência garantida.</p>",
      tip: "A distinção entre ter o valor duplicado vs referenciado é sutil mas crítica — mostra que você entende o 'por que' do design token, não só o 'como'.",
      level: "pleno",
    },
    {
      q: "Como testar componentes de design system visualmente?",
      a: "<p>Chromatic: captura screenshots de todas as Stories em todos os viewports e compara com baseline via diff de pixels. Qualquer mudança visual gera um PR de revisão — humano aprova ou rejeita. Automático no CI.</p><p>Complementar: interaction tests com <code>play()</code> no Storybook, testes de acessibilidade com a11y addon, snapshot tests para API dos componentes (Jest + Testing Library).</p>",
      tip: "O valor do Chromatic está em capturar regressões INVOLUNTÁRIAS — quando uma mudança de CSS impacta um componente que você não tocou. Isso é o que testes unitários não pegam.",
      level: "pleno",
    },
    {
      q: "Design tokens vs CSS custom properties — qual a diferença?",
      a: "<p>Design tokens são o conceito — decisões de design armazenadas em formato agnóstico (JSON, YAML). CSS custom properties (CSS variables) são uma das formas de entrega. Style Dictionary transforma tokens em CSS variables, mas também pode gerar objetos JS, SCSS, Swift (para iOS), Kotlin (Android).</p><p>Um token pode ser entregue como CSS variable (<code>--color-primary: #3b82f6</code>), como constante JS (<code>export const colorPrimary = '#3b82f6'</code>) e como resource de cor no Android — todos a partir do mesmo token.</p>",
      tip: "Entender que tokens são agnósticos de plataforma é o que diferencia uma implementação de CSS variables de um token system real — relevante para empresas com produtos web + mobile.",
      level: "pleno",
    },
    {
      q: "Como você trataria a escalabilidade de um design system em uma empresa grande?",
      a: "<p>Modelo de governança: time dedicado ao DS (DS team) + contributors de cada squad. RFC (Request for Comment) para novas adições. Processo de contribution com revisão de design + code review + visual approval no Chromatic.</p><p>Tecnicamente: monorepo com Turborepo, releases coordenados com Changesets, Storybook publicado (Chromatic ou Vercel), métricas de adoção automatizadas (script que varre o codebase dos produtos e conta uso de componentes do DS vs custom).</p>",
      tip: "A questão de governança (quem decide, quem contribui) é frequentemente ignorada — e é a razão pela qual design systems falham em empresas grandes. Mencionar RFC e DS team mostra visão sistêmica.",
      level: "senior",
    },
    {
      q: "O que é um design system headless e quando usar?",
      a: "<p>Design system headless fornece comportamento e acessibilidade sem estilo — o consumidor aplica qualquer CSS. Exemplos: Radix UI, Headless UI, React Aria. Contrasta com um DS com estilos embutidos (MUI, Ant Design).</p><p>Quando usar headless: empresa com design próprio forte (não quer o visual padrão do MUI), múltiplas marcas com visuais distintos, precisão de controle total sobre CSS. Quando usar com estilos: equipe pequena, MVP rápido, boa com o visual padrão da biblioteca.</p>",
      tip: "A escolha headless vs estilizado é arquitetural — afeta quanto trabalho você tem no DS e quanto controle você tem no visual final. Saber quando é cada um é julgamento sênior.",
      level: "senior",
    },
    {
      q: "Como prevenir 'design system bloat' — quando o sistema fica grande demais?",
      a: "<p>Regras: (1) Constraint is a feature — DS deve opinar e restringir, não suportar tudo. Uma prop a mais é uma inconsistência a mais. (2) Composição > configuração — componentes simples compostos criam complexidade sem bloat. (3) Governe as adições — RFC obrigatório para novos componentes, métricas de uso antes de deprecar.</p><p>Sintomas de bloat: múltiplas formas de fazer a mesma coisa no DS, componentes com 15+ props, squads ignorando o DS e criando custom. Se acontece, é sinal de que o DS não atende a demanda real.</p>",
      tip: "'Constraint is a feature' é a frase que diferencia alguém que construiu um DS de alguém que só consumiu. Menos opções no DS = mais consistência nos produtos.",
      level: "senior",
    },
    {
      q: "Como funciona o focus management em componentes de DS?",
      a: "<p>Componentes complexos precisam de focus management explícito: Dialog deve fazer focus trap (Tab fica dentro do dialog, Esc fecha e retorna o foco). Menus devem responder a setas do teclado (ArrowUp, ArrowDown, Home, End). Modais devem focar o elemento certo ao abrir (geralmente o primeiro elemento focável ou um título).</p><p>Radix UI implementa tudo isso via @radix-ui/react-focus-scope. Implementar manualmente é trabalhoso e propenso a erros — por isso usar uma lib de primitivos acessíveis é vantajoso.</p>",
      tip: "Focus management é onde design systems caseiros falham mais. Mencionar focus trap e retorno de foco mostra que você conhece os requisitos WCAG 2.1 que auditores verificam.",
      level: "senior",
    },
    {
      q: "Como você documentaria um design system para maximizar adoção?",
      a: "<p>Documentação efetiva: (1) Storybook como catálogo de componentes com variantes e argstable — visual e interativo. (2) Guia de uso para cada componente: quando usar, quando NÃO usar, exemplos de código copy-paste. (3) Migration guides para major versions. (4) Changelog com exemplos de before/after.</p><p>Anti-padrão: documentação só em Confluence/Notion — fica desatualizada. Manter a documentação no código (Storybook + JSDoc) garante que ela acompanha o componente.</p>",
      tip: "A frase 'documentação no código' é o diferencial — Storybook auto-gera argstable a partir dos types, zero manutenção manual. Mencionar isso mostra que você pensa em sustentabilidade.",
      level: "pleno",
    },
    {
      q: "Qual é o papel do design system em garantir consistência de UX?",
      a: "<p>Design system garante consistência em 3 dimensões: visual (mesmas cores, espaçamentos, tipografia em todas as telas), comportamental (mesmo componente Button tem sempre o mesmo comportamento de hover, focus, loading), experiencial (mesma hierarquia de informação, mesmos padrões de feedback ao usuário).</p><p>Sem DS: cada squad implementa seu Button — 12 squads = 12 Buttons diferentes com comportamentos subtilmente distintos. Usuário nota como 'o produto parece amador'. Com DS: 1 Button, consistente em todos os 12 produtos.</p>",
      tip: "A resposta que conecta consistência técnica a experiência do usuário percebida é a resposta sênior. Muitos devs explicam só o lado técnico — o lado UX é o que justifica o investimento.",
      level: "pleno",
    },
  ],
  gotchas: [
    "Componentes com muita flexibilidade (muitas props, muitas variantes) tornam o design system inconsistente. Constraint é feature — design systems devem guiar, não só suportar tudo.",
    "Publicar sem Storybook é publicar sem documentação. Componentes sem stories tendem a ser usados errado.",
    "Versionamento lazy (publicar main direto, sem semver) destrói a confiança dos consumidores. Um breaking change silencioso pode quebrar múltiplos produtos.",
    "Tokens primitivos hardcoded nos componentes (em vez de semânticos) impedem dark mode e multi-brand de funcionar.",
    "Não medir adoção é não saber se o DS está sendo usado. Scripts de auditoria de codebase dos produtos são essenciais.",
  ],
}

export default designSystems
