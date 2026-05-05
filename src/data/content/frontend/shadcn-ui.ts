import type { SkillContent } from '@/types'

const shadcnUi: SkillContent = {
    tagline: "Coleção de componentes acessíveis baseados em Radix UI + Tailwind, copiados no projeto.",
    why: "shadcn/ui mudou como devs constroem UI: ao invés de instalar pacote, você copia o componente e é dono do código. Padrão em projetos Next.js modernos.",
    summary: "shadcn/ui não é uma biblioteca npm — é uma CLI que copia componentes para dentro do seu projeto. Componentes são construídos sobre Radix UI (acessibilidade) e estilizados com Tailwind CSS. Você pode editar livremente.",
    keypoints: [
      { title: "Filosofia copy-paste", body: "npx shadcn@latest add button copia o componente para components/ui/button.tsx. Você possui o código — atualiza manualmente, modifica como quiser, sem depender de versão de pacote.", code: `# Adicionar componente ao projeto:
npx shadcn@latest add button dialog select

# O código vai para components/ui/ — é seu, edite à vontade` },
      { title: "Radix UI como base", body: "Componentes complexos (Dialog, Select, DropdownMenu, Tooltip) são construídos sobre Radix UI — acessível, sem estilo, headless. shadcn adiciona estilo Tailwind em cima. Você herda toda a acessibilidade do Radix." },
      { title: "Variantes com cva", body: "Componentes usam class-variance-authority (cva) para variantes type-safe: variant='default'|'destructive'|'outline', size='sm'|'md'|'lg'. Extensível com novas variantes.", code: `const buttonVariants = cva(
  'inline-flex items-center rounded-md font-medium transition-colors',
  {
    variants: {
      variant: { default: 'bg-primary text-primary-foreground', destructive: 'bg-destructive ...' },
      size:    { sm: 'h-9 px-3', md: 'h-10 px-4', lg: 'h-11 px-8' },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
)` },
      { title: "Theme com CSS variables", body: "Cores definidas como CSS variables em :root e .dark. Tokens semânticos: --primary, --background, --foreground, --muted. Troca de tema dark/light via classe 'dark' no elemento html — zero re-render." },
    ],
    interview: [
      {
        q: "O que faz do shadcn/ui diferente de uma biblioteca de componentes como MUI?",
        a: "<p>shadcn/ui não é uma dependência npm — é uma CLI que copia o código dos componentes para dentro do seu projeto. Você é dono do código, pode editar livremente, sem esperar por versão da biblioteca ou abrir PR para a lib.</p><p>MUI e similares: instala como pacote, customiza via theme/styled override, depende do ciclo de release da lib para bugs e features. shadcn: o código é seu, mas você assume a responsabilidade por updates manuais.</p>",
        tip: "A distinção 'você possui o código' é o coração da resposta. É a inversão do modelo tradicional de biblioteca.",
        level: "pleno",
      },
      {
        q: "Como shadcn/ui lida com acessibilidade?",
        a: "<p>shadcn/ui usa Radix UI como base de comportamento para componentes complexos. Radix implementa os padrões WAI-ARIA corretos: focus trap em Dialog, navegação por setas em Select, dismiss com Esc em Popover, etc.</p><p>shadcn adiciona apenas estilo Tailwind em cima do Radix — a acessibilidade vem do Radix. Isso significa que ao usar um Dialog do shadcn, você herda automaticamente: foco preso no modal, Esc para fechar, aria-modal, aria-labelledby.</p>",
        level: "pleno",
      },
      {
        q: "Como você customizaria o tema do shadcn/ui para uma marca específica?",
        a: "<p>shadcn usa CSS variables para todas as cores: --primary, --background, --foreground, --muted, --accent. Para customizar: edite as variáveis em globals.css (modo :root para light, .dark para dark). Os componentes usam apenas tokens semânticos (bg-primary, text-foreground) — trocar a variável atualiza todos os componentes automaticamente.</p><p>Para cores além do tema padrão: adicione novas CSS variables e use via Tailwind com a configuração em tailwind.config.ts.</p>",
        level: "pleno",
      },
      {
        q: "Como você atualiza componentes shadcn quando a CLI lança melhorias?",
        a: "<p>shadcn não tem atualizações automáticas — você re-roda a CLI (npx shadcn@latest add button) e o componente é sobrescrito. Mudanças locais são perdidas.</p><p>Estratégia: use git para rastrear suas customizações. Antes de atualizar, veja o diff do que vai ser sobrescrito. Para projetos com muitas customizações, pode ser mais simples aplicar o patch manualmente do que re-rodar a CLI.</p>",
        level: "senior",
      },
    ],
    gotchas: [
      "Atualizar componentes shadcn requer re-run da CLI — mudanças locais são sobrescritas. Rastreie customizações em git antes de atualizar.",
      "Nem todo projeto precisa de shadcn — em projetos simples, adiciona complexidade e dependência de Radix UI desnecessariamente.",
    ],
    resources: [
      { title: "shadcn/ui docs", url: "https://ui.shadcn.com/", kind: "docs" },
      { title: "shadcn/ui components", url: "https://ui.shadcn.com/docs/components/button", kind: "docs" },
    ],
}

export default shadcnUi
