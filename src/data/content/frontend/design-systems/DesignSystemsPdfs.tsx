'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildCheatsheetPdf } from '@/components/pdfs/CheatsheetPdf'
import type { HookItem, RuleItem } from '@/components/pdfs/CheatsheetPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'

// ── Paleta Design Systems ─────────────────────────────────────────────────────
const C = '#3b82f6'

// ── Metadados dos PDFs ────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: '20 perguntas de entrevista sobre Design Systems',
    type: 'qa',
    pages: 8,
    description: 'Recuperação ativa: tokens primitivos vs semânticos, multi-brand, Storybook, cva, Radix UI, asChild, semver, codemods, acessibilidade sistêmica, métricas de adoção. Nível pleno e sênior com dicas de apresentação.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet',
    subtitle: 'Ferramentas, regras de ouro e arquitetura de pacotes',
    type: 'cheatsheet',
    pages: 2,
    description: 'Referência rápida: ferramentas (Style Dictionary, Storybook, Chromatic, cva, Radix), regras de ouro, arquitetura de pacotes npm e métricas de adoção.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'PSC, PMM, DIT, CAK — âncoras para memorizar',
    type: 'mnemonics',
    pages: 2,
    description: 'PSC (Primitivos/Semânticos/Componentes), PMM (Patch/Minor/Major), DIT (Development/Isolation/Testing), CAK (Contraste/ARIA/Keyboard).',
    icon: '03',
    goal: 'Memorização cognitiva',
  },
]

// ── Dados: Q&A ────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'Qual a diferença entre design tokens primitivos e semânticos?',
    a: 'Tokens primitivos são valores brutos: blue-500: "#3b82f6". Sem semântica de uso. Tokens semânticos mapeiam primitivos com propósito: color.primary: "{blue-500}". Componentes usam tokens semânticos — nunca primitivos. Ao mudar qual primitivo mapeia para primary, todos os componentes atualizam automaticamente.',
    tip: 'A separação primitivo → semântico é o que permite dark mode e multi-brand limpos. Quem só conhece CSS variables mas não os layers não sabe esse ponto.',
  },
  {
    level: 'Pleno',
    q: 'O que é cva e por que usar para variantes de componentes?',
    a: 'cva (class-variance-authority) define variantes type-safe para componentes com classes CSS. Você declara as variantes de forma declarativa e TypeScript infere os tipos automaticamente. TypeScript avisa se você passar uma variante inválida em tempo de compilação. É o padrão de shadcn/ui.',
    tip: 'Conectar cva ao shadcn/ui mostra que você conhece o ecossistema atual — não só conceitos abstratos.',
  },
  {
    level: 'Pleno',
    q: 'Por que usar Storybook em um design system?',
    a: 'Desenvolvimento isolado (sem montar o app), documentação automática via prop types, teste visual com Chromatic (diff de pixels entre PRs), catálogo navegável para designers e devs, a11y addon com axe-core automático em cada story.',
    tip: 'Mencionar Chromatic especificamente demonstra que você conhece o ecossistema de teste visual além do Storybook básico.',
  },
  {
    level: 'Pleno',
    q: 'Como implementar dark mode em um design system?',
    a: 'Tokens semânticos via CSS variables, troca via data-theme="dark" no :root. Componentes usam apenas semânticos (var(--color-surface)) — nunca primitivos diretos. Ao trocar o tema, CSS variables são redefinidas e tudo atualiza sem re-render.',
    tip: 'O ponto chave é "componentes usam apenas semânticos". Se usa blue-500 diretamente, dark mode não funciona.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre Radix UI e shadcn/ui?',
    a: 'Radix: primitivos com a11y completa mas sem estilos — você aplica qualquer CSS. shadcn: componentes pré-estilizados com Radix + Tailwind + cva, com filosofia de copiar o código para sua pasta (não instalar como dep). shadcn é bom ponto de partida, não substitui DS customizado.',
    tip: 'A distinção "copia o código vs instala como dep" define a filosofia shadcn — entender isso mostra que você sabe quando usar cada um.',
  },
  {
    level: 'Pleno',
    q: 'Como você mediria a adoção de um design system?',
    a: 'Métricas quantitativas: downloads npm, coverage % (componentes do DS vs custom), Chromatic PRs aprovados/rejeitados, Lighthouse a11y score médio. Qualitativas: NPS dos devs consumidores, tempo para criar tela nova com DS vs sem.',
    tip: 'Mencionar NPS dos devs consumidores diferencia quem pensa em produto vs quem só pensa em tech.',
  },
  {
    level: 'Pleno',
    q: 'O que é token aliasing e por que importa?',
    a: 'Token aliasing é referenciar outro token em vez de valor literal: color.primary: "{blue.500}". Ao mudar o tom de azul, só muda o primitivo — todos os semânticos que o referenciam atualizam. Sem aliasing, múltiplas cópias do mesmo valor garantem inconsistência.',
    tip: 'A diferença entre ter o valor duplicado vs referenciado é sutil mas crítica — mostra que você entende o "por que" do design token.',
  },
  {
    level: 'Pleno',
    q: 'Como testar componentes de design system visualmente?',
    a: 'Chromatic: screenshots de todas as Stories em todos os viewports, compara com baseline via diff de pixels. Qualquer mudança visual gera revisão no PR. O valor está em capturar regressões involuntárias — quando CSS de um componente impacta outro que você não tocou.',
    tip: 'Regressões involuntárias é o que testes unitários não pegam — o diferencial do Chromatic.',
  },
  {
    level: 'Pleno',
    q: 'Como garantir acessibilidade sistematicamente?',
    a: 'Três frentes: (1) Tokens de cor — verificar contraste 4.5:1 no CI. (2) Componentes — implementar ARIA correto uma vez (aria-expanded, role, aria-label). Consumidores herdam. (3) Automação — a11y addon no Storybook roda axe-core em cada story; violação quebra o PR.',
    tip: 'O multiplicador de impacto: a11y feita uma vez no DS vale por todos os produtos.',
  },
  {
    level: 'Pleno',
    q: 'O que é o padrão Compound Components?',
    a: 'Select.Root + Select.Trigger + Select.Content — consumer compõe o comportamento sem que todos os sub-componentes sejam props do pai. Comunicação via React Context interno. Radix UI usa extensivamente. Ideal para componentes complexos onde o consumidor precisa de flexibilidade para customizar cada parte.',
    tip: 'Radix é a referência de compound components — resolve edge cases de a11y que implementação manual erra.',
  },
  {
    level: 'Senior',
    q: 'Como você gerencia breaking changes em um design system?',
    a: 'Semver: patch para bugfixes, minor para adição, major para remoção/renomeação. Forneça: CHANGELOG detalhado, migration guide para majors, codemods (jscodeshift) para transformações automáticas, período de deprecação antes de remover, comunicação antecipada.',
    tip: 'Codemods são o diferencial: squads migram com uma linha de comando em vez de arquivo por arquivo.',
  },
  {
    level: 'Senior',
    q: 'O que é o padrão asChild e quando usar?',
    a: 'asChild (Radix) delega a renderização para o filho em vez de renderizar seu próprio elemento. Ex: <Button asChild><Link href="/a">Ir</Link></Button> — renderiza <a> com estilos do Button. Resolve polimorfismo semântico sem a prop "as" (que tem problemas de tipos no TS). Padrão moderno.',
    tip: 'asChild resolveu um problema de longa data em design systems — citá-lo mostra que você acompanha a evolução da área.',
  },
  {
    level: 'Senior',
    q: 'Como organizar um monorepo de design system?',
    a: 'Turborepo ou Nx. Estrutura: packages/tokens (CSS vars), packages/ui (componentes), packages/icons, packages/hooks, apps/storybook. Cada pacote tem versão própria. Changesets para releases coordenados. Storybook publicado (Chromatic ou Vercel).',
    tip: 'Changesets vs semver manual — quem usa Changesets sabe que é para monorepo com múltiplos pacotes.',
  },
  {
    level: 'Senior',
    q: 'O que é um design system headless e quando usar?',
    a: 'DS headless fornece comportamento e a11y sem estilo (Radix, Headless UI, React Aria). Contrasta com DS estilizado (MUI, Ant Design). Quando headless: empresa com design forte e múltiplas marcas. Quando estilizado: MVP, equipe pequena, visual padrão aceitável.',
    tip: 'A escolha headless vs estilizado é arquitetural — afeta quanto trabalho você tem no DS e o controle sobre o visual final.',
  },
  {
    level: 'Senior',
    q: 'Como funciona focus management em componentes de DS?',
    a: 'Dialog precisa de focus trap (Tab fica dentro, Esc fecha e retorna foco). Menus respondem a setas (ArrowUp, ArrowDown, Home, End). Radix implementa via @radix-ui/react-focus-scope. Sem isso, componentes falham em auditoria WCAG 2.1.',
    tip: 'Focus trap e retorno de foco são os requisitos WCAG 2.1 que auditores verificam — e onde DSs caseiros falham mais.',
  },
  {
    level: 'Senior',
    q: 'Como fazer migração de uma major version do DS?',
    a: 'Processo: (1) deprecation warnings na version anterior (console.warn). (2) Migration guide por componente com antes/depois. (3) Codemods com jscodeshift para transformações automáticas. (4) Publicar a major. (5) Suporte por N meses para a versão anterior. (6) Comunicar antecipadamente.',
    tip: 'Codemods permitem migração com uma linha de comando — multiplica a velocidade de adoção da major.',
  },
  {
    level: 'Senior',
    q: 'Como prevenir "design system bloat"?',
    a: 'Regras: (1) Constraint is a feature — DS deve opinar e restringir. Uma prop a mais = inconsistência a mais. (2) Composição > configuração. (3) RFC obrigatório para novos componentes, métricas de uso antes de deprecar. Sintoma de bloat: múltiplas formas de fazer a mesma coisa.',
    tip: '"Constraint is a feature" é a frase que diferencia quem construiu um DS de quem só consumiu.',
  },
  {
    level: 'Senior',
    q: 'Como documentar um DS para maximizar adoção?',
    a: 'Storybook como catálogo visual e interativo + argstable auto. Guia de uso por componente: quando usar, quando NÃO usar, exemplos copy-paste. Migration guides para majors. Anti-padrão: só Confluence/Notion — fica desatualizado. Documentação no código (JSDoc + Storybook) acompanha o componente.',
    tip: '"Documentação no código" é o diferencial — Storybook auto-gera argstable a partir dos types, zero manutenção manual.',
  },
  {
    level: 'Senior',
    q: 'Qual o papel do DS em consistência de UX?',
    a: '3 dimensões: visual (mesmas cores/espaços), comportamental (mesmo Button tem mesmo hover/focus), experiencial (mesma hierarquia/feedback). Sem DS: 12 squads = 12 Buttons diferentes — usuário percebe como "amador". Com DS: 1 Button, consistente em todos os produtos.',
    tip: 'Conectar consistência técnica a percepção do usuário é a resposta sênior — justifica o investimento no DS.',
  },
  {
    level: 'Senior',
    q: 'Como escalar governança do DS em empresa grande?',
    a: 'Time dedicado (DS team) + contributors de squads. RFC para novas adições. Design review + code review + Chromatic approval. Monorepo, Changesets, Storybook publicado, métricas de adoção automatizadas (script que conta uso de componentes do DS vs custom nos produtos).',
    tip: 'Governança é onde DSs falham em empresas grandes — RFC e DS team mostra visão sistêmica, não só técnica.',
  },
]

// ── Dados: Cheatsheet ─────────────────────────────────────────────────────────

const CHEATSHEET_HOOKS: HookItem[] = [
  { name: 'style-dictionary build',     sig: 'node style-dictionary.config.mjs',                   desc: 'Gera CSS/JS/SCSS a partir de tokens JSON' },
  { name: 'npx storybook dev',          sig: 'npx storybook dev -p 6006',                          desc: 'Inicia Storybook local' },
  { name: 'npx chromatic',              sig: 'npx chromatic --project-token=<token>',               desc: 'Roda visual tests no Chromatic' },
  { name: 'cva(base, { variants })',    sig: "const btn = cva('base', { variants: { size: {} } })", desc: 'Define variantes type-safe' },
  { name: '@radix-ui/react-dialog',     sig: 'Dialog.Root, Dialog.Trigger, Dialog.Content',         desc: 'Dialog acessível sem estilo' },
  { name: 'asChild prop',               sig: '<Button asChild><Link/></Button>',                    desc: 'Polimorfismo sem prop "as"' },
  { name: 'npx changeset',             sig: 'npx changeset — abre wizard de versão',               desc: 'Versionar mudança no monorepo' },
  { name: 'npx changeset version',      sig: 'npx changeset version — aplica bumps',               desc: 'Aplicar versões pendentes' },
  { name: 'npx changeset publish',      sig: 'npx changeset publish — publica no npm',             desc: 'Publicar pacotes atualizados' },
  { name: 'CSS variable override',      sig: "[data-brand='b'] { --color-primary: ... }",          desc: 'Override de token por marca' },
  { name: 'jscodeshift',                sig: 'jscodeshift -t migration.ts src/',                   desc: 'Codemod automático para major' },
  { name: 'a11y addon',                 sig: 'storybook/a11y — axe-core no Storybook',             desc: 'Testa a11y em todas as stories' },
]

const CHEATSHEET_RULES: RuleItem[] = [
  { ok: true,  t: 'Componentes usam SEMPRE tokens semânticos — nunca primitivos hardcoded.' },
  { ok: true,  t: 'Semver rigoroso: major para breaking changes, minor para adições.' },
  { ok: true,  t: 'Todo componente tem Stories no Storybook cobrindo todas as variantes.' },
  { ok: true,  t: 'A11y embutida: ARIA, contraste 4.5:1, focus visible — feito uma vez no DS.' },
  { ok: true,  t: 'Codemods para major versions: squads migram com uma linha de comando.' },
  { ok: false, t: 'Nunca: muitas variantes/props — constraint é feature, não limitação.' },
  { ok: false, t: 'Nunca: publicar sem Story — componente sem story não tem documentação.' },
  { ok: false, t: 'Nunca: breaking change silencioso — sempre major version + migration guide.' },
  { ok: false, t: 'Nunca: alterar semver global — cada pacote do monorepo versionado individualmente.' },
]

// ── Dados: Mnemônicos ─────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'Token layers — PSC',
    trick: 'P-rimitivos, S-emânticos, C-omponentes',
    expansion: [
      ['Primitivos', 'Valores brutos sem semântica: blue-500, space-4. Nunca usados diretamente nos componentes.'],
      ['Semânticos', 'Mapeiam primitivos com propósito: color.primary → {blue-500}. São o que componentes consomem.'],
      ['Componentes', 'Usam APENAS semânticos. Quando o tema muda, atualizam automaticamente via CSS cascade.'],
    ],
    explanation: 'PSC é a fundação de qualquer DS escalável. A separação garante que troca de tema ou marca não requer mudanças nos componentes.',
    example: 'Trocar dark mode:\n[data-theme=dark] {\n  --color-surface: {gray-900};\n}\n/* todos os componentes atualizam — sem código novo */',
    why: 'DS sem essa separação vira inconsistência em escala — cada componente com cor hardcoded que não muda com o tema.',
  },
  {
    label: 'Semver no DS — PMM',
    trick: 'P-atch, M-inor, M-ajor',
    expansion: [
      ['Patch', 'Fix de bug visual, typo em doc. Nenhum consumidor quebra.'],
      ['Minor', 'Nova prop, nova variante, novo componente. Aditivo — não quebra consumidores.'],
      ['Major', 'Renomear/remover prop ou variante. Requer migration guide + codemod.'],
    ],
    explanation: 'Design system é uma API pública. PMM é o contrato com consumidores: patch e minor são seguros de atualizar, major exige planejamento.',
    example: '1.2.3 → 1.2.4 (patch: fix de cor)\n1.2.4 → 1.3.0 (minor: novo size="xl")\n1.3.0 → 2.0.0 (major: renomear variant="contained"→"primary")',
    why: 'Sem semver disciplinado, uma PR de "melhoria" quebra 12 produtos simultaneamente.',
  },
  {
    label: 'Storybook — DIT',
    trick: 'D-evelopment, I-solation, T-esting',
    expansion: [
      ['Development', 'Desenvolve componentes sem precisar montar o app inteiro — muito mais rápido.'],
      ['Isolation', 'Cada componente em Stories isolados — força a API a ser bem definida e testável.'],
      ['Testing', 'Chromatic para diff visual, a11y addon (axe-core) automático, play() para interaction tests.'],
    ],
    explanation: 'DIT: Storybook resolve os 3 problemas clássicos de componente: onde desenvolvimento acontece, como é documentado e como é testado.',
    example: 'export const Primary: Story = {\n  args: { variant: "primary", label: "Salvar" }\n}\n// → catálogo, argstable, diff no Chromatic, a11y',
    why: 'Componente sem Story é componente sem documentação e sem teste visual — usado errado em escala.',
  },
  {
    label: 'Acessibilidade sistêmica — CAK',
    trick: 'C-ontraste, A-RIA, K-eyboard',
    expansion: [
      ['Contraste', 'Tokens de cor com ratio ≥ 4.5:1. Validado uma vez no DS, garantido em todos os produtos.'],
      ['ARIA', 'aria-expanded, role, aria-label nos componentes base. Consumidores herdam automaticamente.'],
      ['Keyboard', 'Focus management, focus-visible ring, Tab order. Base implementa — todos herdam.'],
    ],
    explanation: 'CAK: a11y feita no DS multiplica o impacto — implementada uma vez, todos os produtos herdam.',
    example: 'Button: aria-disabled, aria-busy\nDialog: focus trap, aria-modal\nSelect: aria-expanded\n→ 50 produtos, 0 retrabalho de a11y',
    why: 'A11y feita produto por produto é garantia de inconsistência. No DS é feita uma vez e auditoria passa em todos.',
  },
]

// ── Builders ──────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'Design Systems',
    stackLabel: 'Frontend / UI',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'Design Systems',
    accentColor: C,
    stackLabel: 'Frontend / UI',
    sections: {
      hooks: CHEATSHEET_HOOKS,
      depRows: [],
      rules: CHEATSHEET_RULES,
      performanceTips: [],
      patterns: [],
      mentalModels: [],
    },
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'Design Systems',
    stackLabel: 'Frontend / UI',
  }),
}

// ── Componente ────────────────────────────────────────────────────────────────

export default function DesignSystemsPdfs() {
  const [open, setOpen] = useState<PdfCard | null>(null)
  const hero = PDF_CARDS[0]
  const rest = PDF_CARDS.slice(1)

  return (
    <>
      <HeroCard card={hero} accent={C} onOpen={() => setOpen(hero)} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 16 }}>
        {rest.map(c => (
          <CollectionCard key={c.id} card={c} accent={C} onOpen={() => setOpen(c)} />
        ))}
      </div>
      {open && (
        <PdfModal card={open} onClose={() => setOpen(null)} builders={PDF_BUILDERS} />
      )}
    </>
  )
}
