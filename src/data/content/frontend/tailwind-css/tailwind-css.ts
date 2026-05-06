import type { SkillContent } from '@/types'

const tailwindCss: SkillContent = {
    tagline: "Framework CSS utility-first que gera apenas as classes usadas — sem CSS morto.",
    why: "Tailwind domina projetos modernos React/Vue. Saber configurar, usar variantes, criar componentes com cva/cn e entender o tradeoff de legibilidade e produtividade é esperado em entrevista sênior.",
    prerequisite: "CSS básico (flexbox, grid, posicionamento, box model). HTML. Ajuda ter visto outros frameworks CSS (Bootstrap, Bulma) para entender o contraste do utility-first.",
    summary: "Tailwind CSS é um framework utility-first: ao invés de escrever CSS, você aplica classes atômicas diretamente no HTML/JSX (flex, p-4, text-blue-500). O build final inclui apenas as classes usadas (JIT/purge). O sistema de cores, espaçamento e tipografia é baseado em escala consistente — p-4 = 1rem, text-lg = 1.125rem. Variantes (hover:, dark:, md:) geram seletores automaticamente sem media queries manuais. Ecossistema: shadcn/ui (componentes), tailwind-merge, cva para variantes type-safe, Tailwind Plugins para extensões.",
    howToStudy: "<strong>Modelo mental central:</strong> utility-first = cada classe faz <em>uma coisa</em>. Composição acontece no HTML/JSX, não no CSS. Isso inverte o fluxo: em vez de nomear elementos e estilizá-los no CSS, você compõe diretamente na marcação.<br><br><strong>Sequência recomendada:</strong><ol><li>Aprenda a escala de espaçamento (p-1 = 0.25rem, p-4 = 1rem, p-8 = 2rem) e breakpoints (sm, md, lg, xl, 2xl) de memória.</li><li>Aprenda Flexbox e Grid via classes Tailwind — é a melhor forma de entender ambos.</li><li>Instale a extensão Tailwind CSS IntelliSense no VS Code — autocomplete é essencial.</li><li>Implemente um card e um formulário do zero com Tailwind — sem usar shadcn ainda.</li><li>Depois: dark mode, cva para variantes, tailwind.config para tokens customizados.</li></ol><br><strong>Em 30 minutos:</strong> Tutorial oficial (tailwindcss.com/docs) — instalar e fazer um card responsivo.<br><strong>Em um fim de semana:</strong> Refazer uma página de landing que você já fez em CSS tradicional.<br><strong>Em uma semana:</strong> shadcn/ui, cva, tema customizado com CSS variables, Tailwind v4 (engine Oxide).",
    keypoints: [
      { title: "JIT (Just-in-Time) — zero CSS morto", body: "Modo JIT gera estilos sob demanda a cada save. Classes arbitrárias (w-[327px], text-[#1a2b3c], grid-cols-[1fr_2fr]) são geradas em tempo real. O CSS final contém apenas as classes usadas — independente de quantas existem no framework. Sem lista de safelist manual para o modo de desenvolvimento.", code: `<!-- Classes arbitrárias com [valor]: -->
<div class="w-[327px] bg-[#06B6D4] text-[clamp(1rem,2vw,2rem)]">

<!-- grid com colunas personalizadas: -->
<div class="grid grid-cols-[1fr_2fr_1fr] gap-4">

<!-- calc() arbitrário: -->
<div class="h-[calc(100vh-4rem)]">` },
      { title: "Sistema de espaçamento e breakpoints", body: "Tailwind usa escala de 4px (0.25rem): p-1=4px, p-2=8px, p-4=16px, p-8=32px. Breakpoints mobile-first: sm=640px, md=768px, lg=1024px, xl=1280px, 2xl=1536px. Prefixos de breakpoint aplicam a partir daquele tamanho.", code: `<!-- Mobile-first: full width, md e acima = 1/2, lg = 1/3: -->
<div class="w-full md:w-1/2 lg:w-1/3">

<!-- Padding diferente por breakpoint: -->
<div class="p-4 md:p-6 lg:p-8">

<!-- Ocultar em mobile, mostrar em md: -->
<nav class="hidden md:flex">` },
      { title: "Variantes — estados e responsive", body: "Prefixos de estado: hover:, focus:, active:, disabled:, focus-within:, focus-visible:. Prefixos de grupo: group (pai) + group-hover: (filho). Prefixos peer (input irmão) + peer-checked: (label). Dark mode: dark:. Permite interatividade complexa sem JavaScript.", code: `<!-- hover/focus/disabled: -->
<button class="bg-cyan-600 hover:bg-cyan-700 focus:ring-2 disabled:opacity-50">

<!-- group: filho reage ao hover do pai: -->
<div class="group">
  <p class="hidden group-hover:block">aparece no hover</p>
</div>

<!-- peer: label reage ao estado do input irmão: -->
<input type="checkbox" class="peer" id="cb" />
<label for="cb" class="peer-checked:text-cyan-500">Ativo</label>` },
      { title: "cn() e tailwind-merge — combinar classes sem conflito", body: "tailwind-merge resolve conflitos de classes Tailwind (duas classes que afetam a mesma propriedade CSS). clsx combina classes condicionalmente. cn() = clsx + twMerge — padrão em projetos profissionais. Essencial em componentes que aceitam className como prop.", code: `import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// bg-blue-500 substitui bg-red-500 (sem ambiguidade):
cn('bg-red-500 text-white', condition && 'bg-blue-500')
// → 'text-white bg-blue-500'

// Em componente — className externo sobrescreve interno:
function Button({ className, ...props }) {
  return <button className={cn('bg-cyan-600 rounded px-4 py-2', className)} {...props} />
}` },
      { title: "cva (class-variance-authority) — variantes type-safe", body: "Cria componentes com variantes tipadas: variant, size, intent. cva retorna uma função que gera a string de classes baseada nos props. Completamente integrado com TypeScript — autocomplete e type safety nas variantes. Padrão em design systems.", code: `import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center rounded font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-cyan-600 text-white hover:bg-cyan-700',
        ghost:   'bg-transparent hover:bg-cyan-50 text-cyan-700',
        danger:  'bg-red-600 text-white hover:bg-red-700',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-lg',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
)

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>
  & VariantProps<typeof buttonVariants>

function Button({ variant, size, className, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
}` },
      { title: "Design tokens via tailwind.config", body: "Customize via tailwind.config.ts: cores semânticas, spacing, fonts, breakpoints. Extend adiciona sem substituir o default. Cores com CSS variables permitem dark mode dinâmico e multi-theme sem rebuild.", code: `// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',           // toggle via classe .dark no <html>
  theme: {
    extend: {
      colors: {
        // CSS variable com suporte a opacity automático:
        primary: 'hsl(var(--color-primary) / <alpha-value>)',
        surface: 'hsl(var(--color-surface) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      borderRadius: { xl: '1rem', '2xl': '1.5rem' },
    },
  },
} satisfies Config` },
      { title: "@apply — quando e quando não usar", body: "@apply extrai classes para CSS semântico. Útil para HTML gerado por terceiros (markdown, CMS) onde você não controla a marcação. Evite em projetos baseados em componentes — você perde a vantagem de utility-first e cria duplicação desnecessária.", code: `/* globals.css — VÁLIDO: prose do markdown não tem componente React */
.prose h1 { @apply text-3xl font-bold text-slate-900 dark:text-white mb-4 }
.prose p  { @apply text-slate-700 dark:text-slate-300 leading-relaxed mb-4 }
.prose a  { @apply text-cyan-600 hover:text-cyan-700 underline }

/* ✗ RUIM: botão deveria ser componente, não @apply */
.btn-primary {
  @apply rounded bg-cyan-600 px-4 py-2 text-white;  /* evite isso */
}` },
      { title: "Tailwind v4 — engine Oxide e CSS-first config", body: "Tailwind v4 reescreve o engine em Rust (Oxide) com até 10x mais velocidade. A configuração migra de tailwind.config.ts para CSS puro com @theme. Zero arquivo de config JS necessário para projetos simples. Import automático de conteúdo — sem array content manual.", code: `/* tailwind v4 — @import e @theme em CSS puro: */
@import "tailwindcss";

@theme {
  --color-primary: oklch(0.6 0.15 200);
  --font-sans: 'Inter', sans-serif;
  --breakpoint-xs: 480px;
}

/* Plugins como utilidades CSS: */
@utility container-query {
  container-type: inline-size;
}` },
    ],
    interview: [
      {
        q: "O que é utility-first CSS e qual o tradeoff em relação ao CSS tradicional?",
        a: "<p><strong>Utility-first</strong>: classes atômicas de propósito único (flex, p-4, text-blue-500) aplicadas diretamente no HTML/JSX. Sem alternar entre arquivo HTML e CSS — o estilo vive junto com a marcação.</p><p><strong>Vantagens</strong>: sem naming de classes (adeus BEM e OOCSS), sem CSS morto (JIT gera só o que usa), hover/responsive/dark mode sem media queries manuais, consistência de design tokens automática, escala linear sem especificidade crescente.</p><p><strong>Tradeoffs</strong>: JSX/HTML fica verboso com muitas classes, legibilidade inicial mais baixa para quem não conhece as classes, semântica de 'o que este elemento faz' se perde no CSS. Resolvidos por: cn(), cva, componentes bem nomeados.</p>",
        tip: "Citar JIT como eliminador de CSS morto e mencionar os tradeoffs honestamente mostra maturidade — entrevistadores valorizam quem não evangeliza frameworks cegamente.",
        level: "pleno",
      },
      {
        q: "Por que usar tailwind-merge em vez de apenas concatenar strings de classes?",
        a: "<p>Quando duas classes Tailwind afetam a mesma propriedade CSS (ex: bg-red-500 e bg-blue-500), qual delas vence depende da ordem no CSS gerado pelo Tailwind — não da ordem no JSX. Isso é contraintuitivo e pode causar bugs visuais difíceis de depurar.</p><p>tailwind-merge resolve: dado 'bg-red-500 bg-blue-500', ele mantém apenas bg-blue-500 (a mais específica/última). Isso é essencial em componentes que aceitam className como prop e precisam combinar classes internas com externas de forma previsível.</p>",
        tip: "Demonstrar que você entende o problema de especificidade implícita no CSS gerado — não só a solução cn() — é diferencial real.",
        level: "pleno",
      },
      {
        q: "Como você cria componentes com variantes type-safe usando Tailwind?",
        a: "<p>Com cva (class-variance-authority): define variants (variant, size, intent) como objeto, e cva retorna uma função que recebe os props e gera a string de classes correta. Completamente integrado com TypeScript — autocomplete e type safety nas variantes.</p><p>Padrão profissional: Button, Badge, Input todos usam cva + cn(). cva gera as classes base+variante, cn() combina com className externo sem conflitos. VariantProps<typeof buttonVariants> extrai automaticamente os tipos das variantes para os props do componente.</p>",
        tip: "Mostrar o padrão cva + cn() + VariantProps é o que diferencia quem usa Tailwind profissionalmente de quem só conhece classes básicas.",
        level: "pleno",
      },
      {
        q: "Como Tailwind lida com dark mode?",
        a: "<p>Duas estratégias: <strong>class</strong> (padrão recomendado) e <strong>media</strong>. Com 'class': adicione dark: prefix nas classes e toggle a classe 'dark' no &lt;html&gt; via JavaScript. Com 'media': usa prefers-color-scheme automaticamente — sem controle manual do usuário.</p><p>Abordagem profissional com CSS variables: defina cores como variáveis (:root para light, .dark para dark), referencie com bg-primary, text-foreground. shadcn/ui usa essa abordagem — você troca temas trocando as CSS variables, sem precisar de dark: prefix em cada elemento.</p>",
        level: "pleno",
      },
      {
        q: "Por que classes dinâmicas como `bg-${color}-500` não funcionam com Tailwind?",
        a: "<p>Tailwind analisa o código em build time via regex para encontrar classes completas como strings. Classes construídas por interpolação ('bg-' + color + '-500') não aparecem como string completa — o scanner não as detecta e elas não são incluídas no CSS gerado.</p><p>Soluções: (1) mapa de classes completas: <code>const colorMap = { red: 'bg-red-500', blue: 'bg-blue-500' }</code> e use colorMap[color]. (2) safelist no tailwind.config para padrões que devem sempre estar presentes: <code>safelist: [{ pattern: /bg-(red|blue|green)-500/ }]</code>. (3) CSS inline como fallback para valores verdadeiramente dinâmicos.</p>",
        tip: "Esse é o gotcha mais comum de Tailwind em produção. Mostrar a solução com mapa de classes completas e citar safelist como alternativa é o que o entrevistador quer ouvir.",
        level: "pleno",
      },
      {
        q: "Quando usar @apply vs componentes React/Vue para reutilizar estilos Tailwind?",
        a: "<p><strong>@apply</strong>: HTML gerado por terceiros sem controle da marcação — prosa de markdown, conteúdo de CMS, bibliotecas que geram HTML puro. Também para resets globais de elementos (a, h1, h2) no prose plugin.</p><p><strong>Componentes</strong>: qualquer elemento que aparece mais de 2-3 vezes e tem variações de props. É a abordagem preferida — mantém o estilo junto com a lógica, é tree-shakeable, não escapa do JIT.</p><p>Regra prática: se você está copiando classes em múltiplos lugares → componente. Se o HTML vem de CMS ou markdown → @apply. Nunca use @apply para substituir naming de componente por preguiça.</p>",
        level: "senior",
      },
      {
        q: "Como você configuraria Tailwind para um design system com múltiplas marcas?",
        a: "<p>Abordagem com CSS variables em camadas: (1) tokens primitivos — valores brutos que não mudam de marca. (2) tokens semânticos via CSS variables (--color-primary, --color-surface) definidos no :root. (3) por marca: redefina as variáveis em um data-theme='marca-a' ou em um arquivo CSS por marca.</p><p>Tailwind fica genérico: usa apenas os nomes semânticos (bg-primary, text-foreground). Trocar tema = trocar as CSS variables. Zero rebuild necessário para troca de tema em runtime.</p>",
        tip: "A distinção primitivo vs semântico nos tokens de design é o que diferencia quem já construiu um design system de quem só consumiu.",
        level: "senior",
      },
      {
        q: "O que são valores arbitrários no Tailwind e quando usá-los?",
        a: "<p>Valores arbitrários com colchetes permitem usar qualquer valor CSS como classe Tailwind: w-[327px], text-[#1a2b3c], grid-cols-[1fr_2fr], h-[calc(100vh-4rem)]. JIT gera o CSS correspondente em tempo real.</p><p>Quando usar: valores que não estão na escala padrão e que são únicos no projeto (não se repetem). Quando evitar: se o valor se repete em mais de 2-3 lugares, adicione ao theme.extend no tailwind.config — cria um token reutilizável e dá semântica ao valor.</p><p>Sintaxe especial: underscores dentro de [] viram espaços: grid-cols-[1fr_2fr] → grid-template-columns: 1fr 2fr.</p>",
        level: "pleno",
      },
      {
        q: "Como funciona o content detection do Tailwind e quais arquivos incluir?",
        a: "<p>O campo content no tailwind.config define quais arquivos o scanner analisa. Deve incluir todos os arquivos que contêm classes Tailwind: .tsx, .jsx, .ts, .js, .vue, .html, .mdx. Também arquivos de libs de componentes que você usa com Tailwind.</p><p>Gotcha: se um arquivo com classes não está no content, as classes nunca são geradas — elas aparecem em dev (porque o JIT varre mais agressivamente) mas somem em produção. Sempre teste npm run build e inspecione o CSS gerado.</p><p>Tailwind v4 elimina esse problema: detecta automaticamente arquivos relevantes via análise do projeto sem config manual.</p>",
        level: "senior",
      },
      {
        q: "Como Tailwind se integra com shadcn/ui?",
        a: "<p>shadcn/ui usa Tailwind + Radix UI + cva. Componentes shadcn têm classes Tailwind diretamente no JSX, com cva para variantes. Os tokens são CSS variables no globals.css (--background, --foreground, --primary, --muted etc.) redefinidos em .dark para dark mode.</p><p>Customização: edite as CSS variables no globals.css para mudar as cores do tema inteiro. Edite o componente diretamente (shadcn é 'copy-paste', não dependência de npm) para mudanças estruturais. Use cn() ao chamar componentes shadcn para adicionar classes extras sem conflitos.</p>",
        level: "pleno",
      },
      {
        q: "Quais são os breakpoints padrão do Tailwind e como funcionam?",
        a: "<p>Breakpoints mobile-first no Tailwind: <strong>sm</strong>=640px, <strong>md</strong>=768px, <strong>lg</strong>=1024px, <strong>xl</strong>=1280px, <strong>2xl</strong>=1536px. Prefixo sem breakpoint = mobile (todos os tamanhos). Prefixo com breakpoint = aplica a partir daquele tamanho para cima.</p><p>Exemplo: text-sm md:text-base lg:text-lg — pequeno em mobile, base em tablet, grande em desktop. Para desktops primeiro, use max-: max-lg:hidden oculta até lg.</p><p>Adicionar breakpoints customizados: theme.extend.screens no tailwind.config. Usar container-queries com @: @lg:flex para queries no container pai, não na viewport.</p>",
        level: "pleno",
      },
      {
        q: "O que é utility-first CSS e quais as vantagens sobre CSS tradicional?",
        a: "<p>Utility-first CSS significa que cada classe faz exatamente uma coisa: <code>flex</code>, <code>pt-4</code>, <code>text-blue-600</code>. O estilo é composto diretamente no HTML/JSX sem criar classes semânticas intermediárias.</p><p><strong>Vantagens:</strong> sem problema de nomenclatura (adeus BEM e OOCSS), sem cascade inesperada (cada classe é atômica e independente), colocação de estilos junto ao markup (menos alternância de arquivos), design tokens embutidos (escala de espaçamento e paleta de cores consistentes), e o JIT elimina CSS não usado — bundle em produção contém apenas o que foi utilizado.</p><p><strong>Desvantagem honesta:</strong> HTML fica mais verboso e a leitura inicial é mais difícil para quem não conhece as classes. Resolvida com componentes bem nomeados e cn()/cva.</p>",
        tip: "Citar JIT como eliminador de CSS morto e mencionar a desvantagem honestamente demonstra maturidade — entrevistadores valorizam quem não evangeliza frameworks cegamente.",
        level: "pleno",
      },
      {
        q: "Como Tailwind elimina CSS não usado em produção?",
        a: "<p>O compilador JIT (Just-In-Time) do Tailwind escaneia todos os arquivos listados em <code>content</code> no <code>tailwind.config.js</code> usando regex para encontrar strings de classes completas. Apenas as classes encontradas são incluídas no CSS gerado — o resto é automaticamente removido.</p><p><strong>Gotcha crítico:</strong> classes construídas por interpolação de string (<code>text-${color}-500</code>) não aparecem como string completa — o scanner não as detecta e elas ficam fora do bundle. Soluções: usar um mapa de classes completas (<code>{ red: 'text-red-500', blue: 'text-blue-500' }</code>) ou adicionar ao <code>safelist</code> no config. Sempre teste <code>npm run build</code> e inspecione o CSS gerado para confirmar que as classes dinâmicas estão presentes.</p>",
        tip: "O gotcha das classes dinâmicas é o mais comum em produção com Tailwind. Mostrar a solução com mapa de classes e citar safelist é o que diferencia quem já usou em produção.",
        level: "pleno",
      },
      {
        q: "O que é @apply e quando usar vs não usar?",
        a: "<p><code>@apply</code> permite usar utilitários Tailwind dentro de CSS customizado. Casos válidos de uso: estilizar HTML gerado por terceiros que você não controla (conteúdo de CMS, markdown, libs que geram HTML puro), resets globais de elementos (<code>h1</code>, <code>a</code>, <code>code</code>) em um arquivo de prosa.</p><p><strong>Quando NÃO usar:</strong> para substituir componentes React/Vue por preguiça de criar um componente — o estilo fica desconectado da lógica. Para elementos que variam por contexto — as variantes ficam menos expressivas que props. Para contornar o sistema de design — viola o propósito do utility-first. A regra prática: se você está copiando as mesmas classes em mais de 2–3 lugares, crie um componente. Se o HTML vem de CMS/markdown, use <code>@apply</code>.</p>",
        tip: "Saber quando NÃO usar @apply é o que separa quem usa Tailwind profissionalmente de quem usa como CSS-in-CSS disfarçado.",
        level: "pleno",
      },
      {
        q: "Como implementar dark mode no Tailwind?",
        a: "<p>Tailwind suporta duas estratégias de dark mode: <code>darkMode: 'class'</code> (recomendado para controle manual) e <code>darkMode: 'media'</code> (segue prefers-color-scheme do sistema). Com <code>'class'</code>: adicione a classe <code>dark</code> no <code>&lt;html&gt;</code> via JavaScript e use o prefixo <code>dark:</code> nas classes: <code>bg-white dark:bg-gray-900</code>.</p><p><strong>Abordagem profissional com CSS variables:</strong> defina tokens semânticos como CSS variables (<code>--color-background</code>, <code>--color-foreground</code>) em <code>:root</code> para light e em <code>.dark</code> para dark. Configure o Tailwind para referenciar as variáveis. Resultado: troca de tema sem precisar de <code>dark:</code> em cada elemento — apenas as variáveis mudam. É o padrão do shadcn/ui.</p>",
        tip: "Apresentar a abordagem com CSS variables vs prefixos dark: mostra conhecimento da evolução do padrão. shadcn/ui usa CSS variables — mencioná-lo situa sua resposta no ecosistema moderno.",
        level: "pleno",
      },
      {
        q: "Como customizar o design system do Tailwind (cores, espaçamentos, fontes)?",
        a: "<p>No <code>tailwind.config.js</code>: use <code>theme.extend</code> para <em>adicionar</em> sem sobrescrever os defaults, ou <code>theme</code> para <em>substituir</em> completamente. <code>extend.colors: { brand: { DEFAULT: '#FF6B6B', dark: '#CC5252' } }</code> gera <code>text-brand</code>, <code>bg-brand</code>, <code>border-brand-dark</code>. <code>extend.spacing: { 18: '4.5rem' }</code> gera <code>p-18</code>, <code>m-18</code>.</p><p><strong>Para valores dinâmicos</strong> (que mudam por tema ou modo): use CSS custom properties como valor. <code>colors: { primary: 'rgb(var(--color-primary) / &lt;alpha-value&gt;)' }</code> — assim <code>bg-primary/50</code> (com opacidade) funciona corretamente. Isso é o padrão do shadcn/ui para suportar dark mode e múltiplos temas sem rebuild.</p>",
        tip: "A diferença entre extend (adiciona) e theme (substitui) é a pegadinha mais comum ao configurar o Tailwind. Mostrar a integração com CSS custom properties e alpha-value demonstra nível sênior.",
        level: "senior",
      },
      {
        q: "O que são arbitrary values e quando usar?",
        a: "<p>Arbitrary values usam colchetes para expressar qualquer valor CSS diretamente como classe Tailwind: <code>w-[327px]</code>, <code>bg-[#FF6B6B]</code>, <code>grid-cols-[1fr_2fr]</code>, <code>h-[calc(100vh-4rem)]</code>. O JIT gera o CSS correspondente em build time.</p><p><strong>Quando usar:</strong> valores únicos no projeto que não se repetem e não valem virar token no config. Permite usar Tailwind sem sair do HTML mesmo para valores excepcionais. <strong>Quando NÃO usar:</strong> se o valor aparece em 3 ou mais lugares — nesse caso crie um token no <code>theme.extend</code> para dar semântica e manutenibilidade. <em>Underscores dentro de colchetes viram espaços:</em> <code>grid-cols-[1fr_2fr]</code> → <code>grid-template-columns: 1fr 2fr</code>.</p>",
        tip: "A regra '2 vezes = ok, 3 vezes = token no config' mostra que você usa arbitrary values com critério, não como válvula de escape do sistema de design.",
        level: "senior",
      },
      {
        q: "Como funciona tailwind-merge e por que é necessário com componentes que aceitam className?",
        a: "<p>Quando um componente tem classes internas (<code>px-4</code>) e recebe <code>className</code> externo (<code>px-8</code>), a concatenação ingênua resulta em <code>px-4 px-8</code>. Qual delas vence depende da <em>ordem no CSS gerado pelo Tailwind</em> — não da ordem no JSX — tornando o comportamento imprevisível.</p><p><code>tailwind-merge</code> detecta conflitos entre utilitários Tailwind e mantém apenas a última declaração logicamente: <code>twMerge('px-4', 'px-8')</code> → <code>'px-8'</code>. Combinado com <code>clsx</code> na função <code>cn()</code>, é a base de qualquer component library que aceita className customizado. Sem ele, override de classes Tailwind em componentes é frágil e depende de ordem de importação CSS.</p>",
        tip: "Explicar o problema de especificidade implícita no CSS gerado — e não só a solução cn() — é o que diferencia quem entende o porquê de quem apenas copiou o padrão.",
        level: "senior",
      },
      {
        q: "Como integrar Tailwind com component libraries como shadcn/ui e Radix UI?",
        a: "<p><strong>shadcn/ui</strong> é construído especificamente para Tailwind: componentes com <code>className</code> que aceita classes adicionais, variantes via <code>cva</code> (class-variance-authority), e merge via <code>cn()</code> que combina <code>clsx</code> + <code>tailwind-merge</code> para resolver conflitos. O theming usa CSS variables (<code>--primary</code>, <code>--background</code>) mapeadas no <code>tailwind.config</code> — trocar tema significa só mudar as variáveis, sem alterar componentes.</p><p><strong>Radix UI puro</strong> (sem shadcn): use <code>className</code> normalmente para estilo base e variantes <code>data-[state=open]:opacity-100</code> para estilizar estados do Radix (<code>open</code>, <code>checked</code>, <code>disabled</code>). Tailwind JIT gera as classes <code>data-*:</code> automaticamente.</p>",
        tip: "Explicar o sistema de CSS variables do shadcn/ui — e não apenas que ele 'usa Tailwind' — mostra que você já integrou de verdade e entende o modelo de theming.",
        level: "senior",
      },
      {
        q: "Como funciona o content detection do Tailwind e quais arquivos incluir?",
        a: "<p>O campo <code>content</code> no <code>tailwind.config.js</code> define quais arquivos o scanner analisa para encontrar classes. Deve incluir todos os arquivos que contêm classes Tailwind: <code>.tsx</code>, <code>.jsx</code>, <code>.ts</code>, <code>.js</code>, <code>.vue</code>, <code>.html</code>, <code>.mdx</code>. Se uma component library que você usa também contém classes Tailwind (ex: shadcn copiado para <code>src/components/ui/</code>), esses arquivos já estão cobertos pelo glob padrão.</p><p><strong>Gotcha de produção:</strong> se um arquivo com classes não está no <code>content</code>, as classes aparecem em dev (o JIT é mais agressivo) mas somem em produção — o CSS de produção é gerado apenas a partir do <code>content</code>. Sempre teste <code>npm run build</code> e inspecione o CSS gerado para confirmar. Tailwind v4 elimina esse problema ao detectar arquivos automaticamente sem configuração manual.</p>",
        tip: "O gotcha de 'funciona em dev mas some em produção' é clássico e doloroso. Saber explicar por que acontece (JIT de dev vs build de produção) e como verificar demonstra experiência real.",
        level: "senior",
      },
    ],
    mnemonics: [
      {
        trick: "FLIPS",
        label: "Classes Tailwind mais usadas por categoria",
        explanation: "F = Flex (flex, flex-col, items-center, justify-between, gap-4). L = Layout (w-full, h-screen, container, grid, grid-cols-N, col-span-N). I = Interactive (hover:, focus:, active:, disabled:, group/group-hover:). P = Padding/Margin (p-4, px-6, py-2, mt-4, mb-8, mx-auto). S = Style (rounded, shadow, border, text-lg, font-bold, text-slate-700). Lembre 'FLIPS' como as 5 categorias que cobrem 90% do uso diário.",
      },
      {
        trick: "SM-MD-LG-XL-2XL",
        label: "Breakpoints Tailwind em pixels",
        explanation: "SM=640px (smartphone landscape). MD=768px (tablet). LG=1024px (laptop). XL=1280px (desktop). 2XL=1536px (wide screen). Dica de memorização: SM/MD/LG/XL/2XL = 640/768/1024/1280/1536. Diferença entre SM e MD = 128px. MD e LG = 256px. Sempre mobile-first: sem prefixo = todos os tamanhos, prefixo = a partir de.",
      },
      {
        trick: "PRCAS",
        label: "Quando NÃO usar Tailwind puro — abstraia quando:",
        explanation: "P = Padrão que se repete 3+ vezes sem componente. R = Reutilizar em projetos diferentes. C = Conflito de classes ao receber className externo (use cn()). A = Arbitrário repetido ([327px] aparece 5x → vira token no config). S = Semântica perdida (ninguém entende o que o elemento faz só pelo nome). Lembre 'PRCAS' — esses são os sinais de que você precisa criar um componente, token ou usar @apply.",
      },
    ],
    cheatsheet: {
      title: "Tailwind CSS — Classes por categoria e sistema de design",
      html: `<style>
.tw-cs{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.tw-cs-sec{margin-bottom:18px}
.tw-cs-title{font-size:9px;color:#06B6D4;letter-spacing:.1em;text-transform:uppercase;font-weight:700;margin-bottom:10px;padding-bottom:4px;border-bottom:1px solid #1e293b}
.tw-cs-table{width:100%;border-collapse:collapse;font-size:10.5px}
.tw-cs-table th{color:#475569;font-weight:500;text-align:left;padding:4px 8px;border-bottom:1px solid #1e293b}
.tw-cs-table td{padding:5px 8px;border-bottom:1px solid #0f172a;vertical-align:top}
.tw-cs-table tr:hover td{background:#1e293b}
.tw-cs-name{color:#06B6D4}
.tw-cs-val{color:#94a3b8;font-size:10px}
.tw-cs-note{color:#475569;font-size:10px}
</style>
<div class="tw-cs">
  <p style="color:#06B6D4;font-size:12px;font-weight:700;margin:0 0 18px">Tailwind CSS — Referência Rápida</p>
  <div class="tw-cs-sec">
    <div class="tw-cs-title">Layout e Flexbox</div>
    <table class="tw-cs-table">
      <tr><th>Classe</th><th>CSS equivalente</th></tr>
      <tr><td class="tw-cs-name">flex / flex-col</td><td class="tw-cs-val">display:flex / flex-direction:column</td></tr>
      <tr><td class="tw-cs-name">items-center / items-start</td><td class="tw-cs-val">align-items: center / flex-start</td></tr>
      <tr><td class="tw-cs-name">justify-between / justify-center</td><td class="tw-cs-val">justify-content: space-between / center</td></tr>
      <tr><td class="tw-cs-name">gap-4 / gap-x-4 / gap-y-2</td><td class="tw-cs-val">gap: 1rem / column-gap / row-gap</td></tr>
      <tr><td class="tw-cs-name">grid grid-cols-3</td><td class="tw-cs-val">display:grid; grid-template-columns: repeat(3, 1fr)</td></tr>
      <tr><td class="tw-cs-name">col-span-2</td><td class="tw-cs-val">grid-column: span 2</td></tr>
      <tr><td class="tw-cs-name">w-full / w-1/2 / w-[327px]</td><td class="tw-cs-val">width: 100% / 50% / 327px</td></tr>
    </table>
  </div>
  <div class="tw-cs-sec">
    <div class="tw-cs-title">Espaçamento (escala × 0.25rem)</div>
    <table class="tw-cs-table">
      <tr><th>Número</th><th>Valor</th><th>Classes</th></tr>
      <tr><td class="tw-cs-name">1</td><td class="tw-cs-val">0.25rem (4px)</td><td class="tw-cs-note">p-1, m-1, gap-1</td></tr>
      <tr><td class="tw-cs-name">2</td><td class="tw-cs-val">0.5rem (8px)</td><td class="tw-cs-note">p-2, mx-2, mb-2</td></tr>
      <tr><td class="tw-cs-name">4</td><td class="tw-cs-val">1rem (16px)</td><td class="tw-cs-note">p-4, gap-4, mt-4</td></tr>
      <tr><td class="tw-cs-name">6</td><td class="tw-cs-val">1.5rem (24px)</td><td class="tw-cs-note">px-6, py-6</td></tr>
      <tr><td class="tw-cs-name">8</td><td class="tw-cs-val">2rem (32px)</td><td class="tw-cs-note">p-8, mb-8</td></tr>
      <tr><td class="tw-cs-name">12 / 16</td><td class="tw-cs-val">3rem / 4rem</td><td class="tw-cs-note">mt-12, h-16</td></tr>
    </table>
  </div>
  <div class="tw-cs-sec">
    <div class="tw-cs-title">Tipografia</div>
    <table class="tw-cs-table">
      <tr><th>Classe</th><th>Valor</th></tr>
      <tr><td class="tw-cs-name">text-xs / sm / base / lg / xl / 2xl</td><td class="tw-cs-val">0.75 / 0.875 / 1 / 1.125 / 1.25 / 1.5rem</td></tr>
      <tr><td class="tw-cs-name">font-normal / medium / semibold / bold</td><td class="tw-cs-val">400 / 500 / 600 / 700</td></tr>
      <tr><td class="tw-cs-name">leading-none / tight / normal / relaxed</td><td class="tw-cs-val">1 / 1.25 / 1.5 / 1.625</td></tr>
      <tr><td class="tw-cs-name">tracking-tight / normal / wide</td><td class="tw-cs-val">letter-spacing negativo / 0 / positivo</td></tr>
      <tr><td class="tw-cs-name">truncate / line-clamp-2</td><td class="tw-cs-val">overflow ellipsis / WebkitLineClamp</td></tr>
    </table>
  </div>
  <div class="tw-cs-sec">
    <div class="tw-cs-title">Variantes de estado</div>
    <table class="tw-cs-table">
      <tr><th>Prefixo</th><th>Quando aplica</th></tr>
      <tr><td class="tw-cs-name">hover: / focus: / active:</td><td class="tw-cs-val">Interação do mouse/teclado</td></tr>
      <tr><td class="tw-cs-name">disabled:</td><td class="tw-cs-val">Elemento com atributo disabled</td></tr>
      <tr><td class="tw-cs-name">dark:</td><td class="tw-cs-val">Modo escuro (via classe .dark no html)</td></tr>
      <tr><td class="tw-cs-name">group / group-hover:</td><td class="tw-cs-val">Filho reage ao hover do ancestral .group</td></tr>
      <tr><td class="tw-cs-name">peer / peer-checked:</td><td class="tw-cs-val">Elemento reage ao estado do irmão .peer</td></tr>
      <tr><td class="tw-cs-name">sm: / md: / lg: / xl:</td><td class="tw-cs-val">Breakpoints 640/768/1024/1280px+</td></tr>
    </table>
  </div>
</div>`,
    },
    mindmap: {
      title: "Tailwind CSS — Mapa mental utility-first",
      html: `<style>
.tw-mm{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:24px;color:#e2e8f0}
.tw-mm-center{background:#082f49;border:2px solid #06B6D4;border-radius:10px;padding:10px 18px;text-align:center;font-weight:700;font-size:13px;color:#06B6D4;display:inline-block}
.tw-mm-node{background:#1e293b;border:1.5px solid #334155;border-radius:7px;padding:6px 12px;font-size:11px;color:#94a3b8;cursor:default;margin-bottom:5px}
.tw-mm-node:hover{border-color:#06B6D4;color:#e2e8f0}
.tw-mm-label{font-size:9px;color:#06B6D4;letter-spacing:.1em;text-transform:uppercase;font-weight:700;margin-bottom:6px}
.tw-mm-grid{display:grid;grid-template-columns:1fr auto 1fr;gap:16px;align-items:start}
.tw-mm-col{display:flex;flex-direction:column;gap:12px}
</style>
<div class="tw-mm">
  <p style="color:#06B6D4;font-size:12px;font-weight:700;margin:0 0 20px">Tailwind CSS — Mapa de Conceitos</p>
  <div class="tw-mm-grid">
    <div class="tw-mm-col">
      <div>
        <div class="tw-mm-label">Classes por categoria</div>
        <div class="tw-mm-node">Layout: flex, grid, container</div>
        <div class="tw-mm-node">Spacing: p-*, m-*, gap-*</div>
        <div class="tw-mm-node">Typography: text-*, font-*, leading-*</div>
        <div class="tw-mm-node">Colors: bg-*, text-*, border-*</div>
        <div class="tw-mm-node">Effects: shadow-*, rounded-*, opacity-*</div>
      </div>
      <div>
        <div class="tw-mm-label">Variantes</div>
        <div class="tw-mm-node">hover: / focus: / active:</div>
        <div class="tw-mm-node">sm: / md: / lg: / xl: — responsive</div>
        <div class="tw-mm-node">dark: — dark mode</div>
        <div class="tw-mm-node">group-hover: / peer-checked:</div>
        <div class="tw-mm-node">disabled: / focus-within:</div>
      </div>
    </div>
    <div style="display:flex;align-items:center;justify-content:center">
      <div class="tw-mm-center">Tailwind<br><span style="font-size:10px;opacity:.7">utility-first</span></div>
    </div>
    <div class="tw-mm-col">
      <div>
        <div class="tw-mm-label">Composição e componentes</div>
        <div class="tw-mm-node">cn() = clsx + tailwind-merge</div>
        <div class="tw-mm-node">cva — variantes type-safe</div>
        <div class="tw-mm-node">@apply — HTML sem controle</div>
        <div class="tw-mm-node">shadcn/ui — componentes prontos</div>
      </div>
      <div>
        <div class="tw-mm-label">Configuração</div>
        <div class="tw-mm-node">tailwind.config.ts — tokens e temas</div>
        <div class="tw-mm-node">CSS variables — dark mode dinâmico</div>
        <div class="tw-mm-node">content[] — quais arquivos escanear</div>
        <div class="tw-mm-node">safelist — classes dinâmicas garantidas</div>
      </div>
      <div>
        <div class="tw-mm-label">Ecossistema</div>
        <div class="tw-mm-node">Tailwind v4 — engine Oxide (Rust)</div>
        <div class="tw-mm-node">Headless UI / Radix — comportamento</div>
        <div class="tw-mm-node">Prettier plugin — ordena classes</div>
      </div>
    </div>
  </div>
</div>`,
      caption: "Visão geral do Tailwind CSS — das classes atômicas ao ecossistema de componentes (shadcn, cva, tailwind-merge).",
    },
    exercises: [
      {
        level: "iniciante",
        title: "Card de perfil responsivo",
        description: "Construa um card de perfil de usuário usando apenas classes Tailwind: avatar circular, nome, cargo, badges de skills, botão de contato. O card deve ser responsivo: empilhado em mobile (flex-col), lado a lado em md (flex-row). Use hover:shadow-lg no card e variantes de cor no botão.",
        concepts: ["flexbox", "grid", "responsive design", "hover:", "dark mode"],
        hint: "Use overflow-hidden rounded-full para avatar circular. md:flex-row no container principal para o layout responsivo. aspect-square para manter proporção do avatar.",
      },
      {
        level: "intermediario",
        title: "Componente Button com cva e variantes",
        description: "Implemente um componente Button TypeScript usando cva com: 3 variantes (default, ghost, danger), 3 tamanhos (sm, md, lg), estado disabled com opacity-50 e cursor-not-allowed, estado loading com spinner animado. Use cn() para combinar classes internas com className externo. Exporte o tipo ButtonProps usando VariantProps.",
        concepts: ["cva", "cn()", "VariantProps", "TypeScript", "variantes Tailwind"],
        hint: "VariantProps<typeof buttonVariants> extrai os tipos das variantes automaticamente. Use pointer-events-none no wrapper quando loading para evitar cliques.",
      },
      {
        level: "senior",
        title: "Sistema de temas com CSS variables e Tailwind",
        description: "Implemente suporte a múltiplos temas (light, dark, brand-a, brand-b) em um app Next.js: defina tokens semânticos como CSS variables em globals.css, configure o tailwind.config para usar as variáveis, implemente um ThemeProvider que salva o tema no localStorage e aplica a classe correta no html, e crie um ThemeToggle que alterna entre os temas. Os componentes devem usar apenas classes semânticas (bg-primary, text-foreground).",
        concepts: ["CSS variables", "dark mode", "tailwind.config", "localStorage", "design tokens"],
        hint: "Defina os tokens em :root (light), .dark (dark) e [data-theme='brand-a']. No tailwind.config, mapeie bg-primary para var(--color-primary). O ThemeProvider lê o localStorage no mount e aplica o atributo ao documentElement.",
      },
    ],
    videos: [
      { title: "Tailwind CSS Full Course for Beginners", channel: "Dave Gray", url: "https://www.youtube.com/watch?v=lCxcTsOHrjo", topic: "Tailwind do zero com projetos práticos" },
      { title: "Tailwind CSS Crash Course", channel: "Traversy Media", url: "https://www.youtube.com/watch?v=UBOj6rqRUME", topic: "Visão geral rápida e prática de Tailwind" },
      { title: "Tailwind CSS Tips, Tricks & Best Practices", channel: "Fireship", url: "", topic: "Patterns avançados e armadilhas comuns" },
      { title: "cva + shadcn Design System", channel: "Theo - t3.gg", url: "", topic: "Design system com cva, cn() e shadcn/ui" },
      { title: "Tailwind v4 — What Changed", channel: "Kevin Powell", url: "", topic: "Engine Oxide e CSS-first config no Tailwind v4" },
    ],
    codeExamples: [
      {
        title: "cn() + cva — Button component completo",
        description: "Componente Button production-ready com variantes type-safe, estado loading e integração com shadcn.",
        code: `import { cva, type VariantProps } from 'class-variance-authority'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Loader2 } from 'lucide-react'

// Utilitário cn() — combina e resolve conflitos:
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const buttonVariants = cva(
  // base — sempre presente:
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-cyan-600 text-white hover:bg-cyan-700 focus-visible:ring-cyan-600',
        ghost:   'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300',
        danger:  'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600',
        outline: 'border border-slate-300 bg-transparent hover:bg-slate-50 dark:border-slate-600',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 py-2 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
)

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>
  & VariantProps<typeof buttonVariants>
  & { loading?: boolean; leftIcon?: React.ReactNode }

function Button({ variant, size, loading, leftIcon, className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading
        ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        : leftIcon && <span className="mr-2">{leftIcon}</span>
      }
      {children}
    </button>
  )
}

// Uso:
// <Button variant="danger" size="lg">Excluir</Button>
// <Button loading>Salvando...</Button>
// <Button variant="ghost" className="w-full">Cancelar</Button>  ← className externo sem conflito`,
        language: "tsx",
      },
      {
        title: "Dark mode com CSS variables e Tailwind",
        description: "Sistema de temas com CSS variables — tokens semânticos que funcionam em qualquer componente Tailwind.",
        code: `/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Tokens semânticos light: */
    --background: 0 0% 100%;
    --foreground: 222 47% 11%;
    --primary: 187 100% 42%;        /* cyan-500 */
    --primary-foreground: 0 0% 100%;
    --muted: 210 40% 96%;
    --muted-foreground: 215 16% 47%;
    --border: 214 32% 91%;
    --radius: 0.5rem;
  }

  .dark {
    /* Tokens redefinidos para dark: */
    --background: 222 47% 7%;
    --foreground: 210 40% 98%;
    --primary: 187 100% 42%;
    --primary-foreground: 222 47% 7%;
    --muted: 217 33% 17%;
    --muted-foreground: 215 20% 65%;
    --border: 217 33% 17%;
  }
}

/* tailwind.config.ts — mapeia os tokens: */
/*
theme: {
  extend: {
    colors: {
      background:         'hsl(var(--background))',
      foreground:         'hsl(var(--foreground))',
      primary:            { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
      muted:              { DEFAULT: 'hsl(var(--muted))',   foreground: 'hsl(var(--muted-foreground))' },
      border:             'hsl(var(--border))',
    },
  },
}

// Componentes usam só tokens semânticos — funcionam em qualquer tema:
// <div className="bg-background text-foreground border border-border rounded-[var(--radius)]">
// <button className="bg-primary text-primary-foreground hover:bg-primary/90">
*/`,
        language: "css",
      },
      {
        title: "Layouts responsivos com Tailwind Grid",
        description: "Padrões de layout responsivo real — sidebar, card grid, hero section.",
        code: `// Layout com sidebar responsiva:
function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar: oculta em mobile, visível em lg */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-border bg-muted/40">
        <nav className="flex-1 p-4 space-y-1">
          {/* nav items */}
        </nav>
      </aside>

      {/* Main — margem para a sidebar em lg */}
      <main className="flex-1 lg:ml-64">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}

// Card grid responsivo — 1 col mobile, 2 md, 3 lg, 4 xl:
function CardGrid({ items }: { items: Item[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map(item => (
        <div
          key={item.id}
          className="group rounded-xl border border-border bg-background p-4 shadow-sm transition-shadow hover:shadow-md"
        >
          <img className="aspect-video w-full rounded-lg object-cover" src={item.image} alt={item.title} />
          <h3 className="mt-3 font-semibold text-foreground line-clamp-2">{item.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-3">{item.description}</p>
          {/* Botão aparece no hover via group */}
          <button className="mt-3 w-full opacity-0 group-hover:opacity-100 transition-opacity
            rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium">
            Ver mais
          </button>
        </div>
      ))}
    </div>
  )
}`,
        language: "tsx",
      },
    ],
    gotchas: [
      "Classes dinâmicas (bg-${color}-500) não funcionam — Tailwind não encontra classes parciais no scanner. Use mapa de classes completas: const colorMap = { red: 'bg-red-500' } ou safelist no config.",
      "Muitas classes no JSX prejudicam legibilidade. Extraia para cn() com quebras de linha, cva para variantes, ou componente React/Vue.",
      "Conflitos de classe (duas classes que afetam mesma propriedade CSS): a ordem no JSX não determina quem vence — a ordem no CSS gerado pelo Tailwind determina. Use tailwind-merge para resolver deterministicamente.",
      "Arquivo não listado em content[] = classes não geradas em produção. Classes aparecem em dev (JIT mais permissivo) e somem no build. Sempre teste npm run build.",
      "@apply em classe que não existe ainda gera erro silencioso em alguns setups. Certifique-se de que as classes @apply estão no CSS gerado antes de usá-las.",
      "dark: prefix não funciona sem configurar darkMode no tailwind.config. Padrão é 'media' (prefers-color-scheme) — para controle manual, configure como 'class'.",
      "cn() sem tailwind-merge: clsx puro não resolve conflitos de especificidade. Sempre combine clsx + twMerge na função cn().",
      "Pseudo-elementos (before:, after:) requerem content-[''] explícito para aparecer — Tailwind não adiciona content automaticamente.",
    ],
    resources: [
      { title: "Tailwind CSS docs", url: "https://tailwindcss.com/docs", kind: "docs" },
      { title: "Tailwind CSS — Utility Classes Reference", url: "https://tailwindcss.com/docs/utility-first", kind: "docs" },
      { title: "shadcn/ui", url: "https://ui.shadcn.com/", kind: "docs" },
      { title: "cva docs", url: "https://cva.style/docs", kind: "docs" },
      { title: "Tailwind CSS Cheat Sheet", url: "https://nerdcave.com/tailwind-cheat-sheet", kind: "pratica" },
      { title: "Tailwind v4 blog post", url: "https://tailwindcss.com/blog/tailwindcss-v4", kind: "artigo" },
      { title: "Heroicons — ícones gratuitos para Tailwind", url: "https://heroicons.com/", kind: "pratica" },
    ],
    diagrams: [
      {
        title: "Tailwind JIT — do JSX ao CSS gerado",
        html: `<style>
.tw-diag{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.tw-box{background:#1e293b;border:1.5px solid #334155;border-radius:8px;padding:12px 16px;font-size:11px}
.tw-arr{color:#06B6D4;font-size:18px;text-align:center;line-height:1}
.tw1-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(6,182,212,.4);display:inline}
.tw1-tip:hover .tw1-tb{display:block}
.tw1-tb{display:none;position:absolute;bottom:calc(100%+8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:210px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.tw1-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
</style>
<div class="tw-diag">
  <p style="color:#06B6D4;font-size:12px;font-weight:700;margin:0 0 16px">Tailwind JIT — só o que você usa vai pro CSS final</p>
  <div style="display:flex;gap:8px;align-items:center">
    <div class="tw-box" style="flex:1">
      <div style="font-size:9px;color:#06B6D4;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px">Seu JSX / HTML</div>
      <div style="color:#94a3b8;line-height:2.1">
        &lt;div class="<span class="tw1-tip">flex<span class="tw1-tb">display: flex — utilitário atômico. JIT só gera o CSS desta classe se ela aparecer em algum arquivo do seu projeto.</span></span> <span class="tw1-tip">p-4<span class="tw1-tb">padding: 1rem (4 × 0.25rem). O número segue a escala de spacing do tema.</span></span> <span class="tw1-tip">bg-cyan-600<span class="tw1-tb">background-color: #0891b2. Classes com cor+número — JIT gera só as que você usa.</span></span> <span class="tw1-tip">hover:bg-cyan-700<span class="tw1-tb">Aplica bg-cyan-700 no :hover. Variantes como hover:, dark:, md: geram seletores CSS completos automaticamente.</span></span>"&gt;
      </div>
    </div>
    <div class="tw-arr">→</div>
    <div style="display:flex;flex-direction:column;gap:6px;flex:0.6;text-align:center">
      <div style="font-size:10px;color:#475569">Scanner varre content[]</div>
      <div style="font-size:10px;color:#475569">Encontra classes completas</div>
      <div style="font-size:10px;color:#475569">Gera apenas o CSS delas</div>
    </div>
    <div class="tw-arr">→</div>
    <div class="tw-box" style="flex:1">
      <div style="font-size:9px;color:#4ade80;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px">CSS gerado (só isso)</div>
      <div style="color:#94a3b8;line-height:2.1">
        .flex { display: flex }<br>
        .p-4 { padding: 1rem }<br>
        .bg-cyan-600 { background-color: #0891b2 }<br>
        .hover\\:bg-cyan-700:hover { background-color: #0e7490 }
      </div>
    </div>
  </div>
  <div style="background:#1e293b;border:1px solid #082f49;border-radius:8px;padding:10px 14px;margin-top:10px;font-size:11px;color:#475569">
    <strong style="color:#94a3b8">Sem purge manual:</strong> JIT analisa em tempo real. CSS final tem apenas as classes que existem no código — zero CSS morto independente do número de utilitários Tailwind disponíveis.
  </div>
</div>`,
        caption: "JIT = zero CSS morto. O scanner lê os arquivos em content[], encontra classes completas e gera exatamente o CSS necessário.",
      },
      {
        title: "Variantes Tailwind — responsive, hover, dark, group e peer",
        html: `<style>
.tw2-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.tw2-card{background:#1e293b;border:1.5px solid #334155;border-radius:8px;padding:12px 14px;font-size:11px;margin-bottom:8px}
.tw2-label{font-size:9px;color:#06B6D4;letter-spacing:.1em;text-transform:uppercase;font-weight:700;margin-bottom:8px}
.tw2-code{color:#06B6D4;font-family:'JetBrains Mono',monospace}
.tw2-note{color:#475569;font-size:10px;margin-top:4px;line-height:1.5}
.tw2-result{color:#4ade80;font-size:10px;font-family:'JetBrains Mono',monospace}
</style>
<div class="tw2-wrap">
  <p style="color:#06B6D4;font-size:12px;font-weight:700;margin:0 0 14px">Variantes Tailwind — como funcionam</p>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
    <div class="tw2-card">
      <div class="tw2-label">Responsive (mobile-first)</div>
      <div class="tw2-code">text-sm md:text-base lg:text-xl</div>
      <div class="tw2-note">Sem prefixo = todos os tamanhos. Prefixo = a partir daquele breakpoint. sm=640, md=768, lg=1024px.</div>
    </div>
    <div class="tw2-card">
      <div class="tw2-label">Estado do elemento</div>
      <div class="tw2-code">hover:bg-cyan-700 focus:ring-2 active:scale-95</div>
      <div class="tw2-note">Gera seletor CSS com pseudo-classe. focus-visible: só ativa com teclado (melhor acessibilidade que focus:).</div>
    </div>
    <div class="tw2-card">
      <div class="tw2-label">Dark mode</div>
      <div class="tw2-code">bg-white dark:bg-slate-900<br>text-slate-900 dark:text-white</div>
      <div class="tw2-note">Aplica quando .dark está no html. Configure darkMode: 'class' no tailwind.config.</div>
    </div>
    <div class="tw2-card">
      <div class="tw2-label">group / group-hover:</div>
      <div class="tw2-code">&lt;div class="group"&gt;<br>&nbsp;&lt;p class="opacity-0 group-hover:opacity-100"&gt;</div>
      <div class="tw2-note">Filho reage ao hover do ancestral marcado com 'group'. Sem JS — puro CSS.</div>
    </div>
    <div class="tw2-card">
      <div class="tw2-label">peer / peer-checked:</div>
      <div class="tw2-code">&lt;input class="peer" /&gt;<br>&lt;label class="peer-checked:text-cyan-500"&gt;</div>
      <div class="tw2-note">Label reage ao estado do input irmão. Útil para toggles e checkboxes estilizados.</div>
    </div>
    <div class="tw2-card">
      <div class="tw2-label">Valores arbitrários</div>
      <div class="tw2-code">w-[327px] text-[#06B6D4]<br>grid-cols-[1fr_2fr]</div>
      <div class="tw2-note">Underline vira espaço dentro de []. JIT gera o CSS na hora — sem safelist manual.</div>
    </div>
  </div>
</div>`,
        caption: "Variantes Tailwind geram seletores CSS automaticamente — responsive (min-width), hover (:hover), dark (.dark), group e peer são os mais usados.",
      },
    ],
}

export default tailwindCss
