import type { SkillContent } from '@/types'

const designSystems: SkillContent = {
    tagline: "Conjunto de componentes, tokens e guias que garantem consistência visual e de UX em escala.",
    why: "Design systems são o que diferencia empresas que escalam UI de empresas que têm inconsistência visual. Sênior precisa entender como construir, versionar e evoluir um design system — não só consumir.",
    summary: "Um design system é a combinação de: tokens de design (cores, espaçamento, tipografia), componentes UI reutilizáveis, documentação de uso e guias de acessibilidade. No código, são bibliotecas versionadas consumidas por múltiplos produtos. Ferramentas: Storybook para desenvolvimento/documentação, tokens via CSS variables ou JSON, publicação via npm.",
    keypoints: [
      { title: "Design tokens", body: "Variáveis que representam decisões de design: cores semânticas (color.primary, color.error), espaçamentos (spacing.4 = 16px), raios de borda, sombras. Definidos em JSON (Token Studio, Style Dictionary) e compilados para CSS variables, SCSS, JS.", code: `/* CSS variables geradas dos tokens */
:root {
  --color-primary: #3178C6;
  --spacing-4: 1rem;
  --radius-md: 0.5rem;
}` },
      { title: "Componentes com variantes type-safe", body: "Componentes do design system devem ter API consistente: variantes (variant, size, intent) tipadas com TypeScript, props documentadas com JSDoc. cva + TypeScript é o padrão atual para variantes type-safe." },
      { title: "Storybook", body: "Ambiente de desenvolvimento isolado para componentes. Cada componente tem Stories (cenários de uso). Permite desenvolver sem o app, documentar automaticamente props e testar visual automaticamente (Chromatic)." },
      { title: "Versionamento e breaking changes", body: "Design systems são APIs. Breaking changes (renomear prop, remover variante) precisam de major version. Use semantic versioning. Forneça changelogs detalhados e codemod quando possível." },
      { title: "Temas e multi-brand", body: "Design systems para múltiplas marcas usam token layers: tokens primitivos (azul-600: #2563eb) + tokens semânticos (color.primary: {azul-600}) + tokens por marca (marca-a.primary: {roxo-600}). CSS variables com troca de :root permitem tema dinâmico sem re-render." },
    ],
    interview: [
      { q: "Qual a diferença entre design tokens primitivos e semânticos?", a: "<p>Tokens primitivos são valores brutos: blue-500: '#3b82f6', spacing-4: '16px'. Não têm semântica de uso.</p><p>Tokens semânticos usam primitivos com nome de propósito: color.primary: '{blue-500}', color.error: '{red-600}'. Os componentes usam tokens semânticos — se você mudar qual primitivo mapeia para primary, todos os componentes atualizam automaticamente.</p><p>Essa separação é o que permite multi-brand e dark mode limpos.</p>", tip: "A maioria dos devs conhece tokens como 'variáveis de CSS'. Mostrar que você sabe a camada primitiva vs semântica é diferencial sênior.", level: "senior" },
      { q: "Como você gerencia breaking changes em um design system?", a: "<p>Semver: patch para bugfixes visuais, minor para adição de props, major para remoção/renomeação de props ou mudanças que quebram layouts. Forneça: CHANGELOG detalhado por versão, migration guide para majors, codemods automatizados quando possível (jscodeshift), período de deprecação antes de remover.</p><p>Versão com prefixo v2/ no pacote npm permite que consumidores migrem gradualmente coexistindo as versões.</p>", level: "senior" },
      { q: "Por que usar Storybook em um design system?", a: "<p>Storybook permite: desenvolvimento de componentes em isolamento (sem montar o app inteiro), documentação automática via JSDoc e prop types, teste visual com Chromatic (detecta diff de pixels entre PRs), catálogo navegável para designers e devs, stories como testes de acessibilidade automatizados (a11y addon).</p>", level: "pleno" },
      { q: "Como você implementaria suporte a dark mode em um design system?", a: "<p>A abordagem padrão: tokens semânticos via CSS variables, troca de tema via atributo no :root (data-theme='dark' ou .dark class). Os componentes usam apenas tokens semânticos (var(--color-surface)) — nunca valores primitivos diretos. Ao trocar o tema, as CSS variables são redefinidas e tudo atualiza sem re-render.</p>", level: "senior" },
    ],
    gotchas: [
      "Componentes com muita flexibilidade (muitas props, muitas variantes) tornam o design system inconsistente. Constraint é feature — design systems devem guiar, não só suportar tudo.",
      "Publicar sem Storybook é publicar sem documentação. Componentes sem stories tendem a ser usados errado.",
      "Versionamento lazy (publicar main direto, sem semver) destrói a confiança dos consumidores. Um breaking change silencioso pode quebrar múltiplos produtos.",
    ],
    resources: [
      { title: "Storybook docs", url: "https://storybook.js.org/docs", kind: "docs" },
      { title: "Token Studio", url: "https://tokens.studio/", kind: "pratica" },
      { title: "Style Dictionary", url: "https://amzn.github.io/style-dictionary/", kind: "docs" },
    ],
}

export default designSystems
