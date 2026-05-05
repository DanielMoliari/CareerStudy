import type { SkillContent } from '@/types'

const radixUi: SkillContent = {
    tagline: "Primitivos de UI headless, acessíveis e sem estilo — base do shadcn/ui.",
    why: "Radix UI resolve o problema mais difícil de componentes UI: acessibilidade e comportamento de teclado corretos em elementos complexos como Dialog, Select, Tooltip. Sem precisar implementar ARIA do zero.",
    summary: "Radix UI é uma coleção de componentes primitivos headless para React: sem estilo embutido, com comportamento, acessibilidade (ARIA) e teclado corretos. Você estiliza com Tailwind, CSS Modules ou qualquer abordagem. É a base de shadcn/ui, Radix Themes e outras design systems.",
    keypoints: [
      { title: "Headless = comportamento sem estilo", body: "Radix fornece o comportamento (focus trap em Dialog, navegação por teclado em Select, dismiss em Popover) sem CSS. Você aplica seu design em cima." },
      { title: "Composição com partes", body: "Cada componente é composto de partes exportadas (Root, Trigger, Content, etc.). Você monta a estrutura explicitamente — flexibilidade total de markup.", code: `<Dialog.Root>
  <Dialog.Trigger asChild>
    <Button>Abrir</Button>
  </Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content>...</Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>` },
      { title: "asChild prop", body: "asChild faz o componente Radix renderizar como o filho ao invés de um wrapper extra. Evita divs desnecessários e permite combinar com qualquer elemento.", code: `<Dialog.Trigger asChild>
  <button className="my-button">Clique</button>
</Dialog.Trigger>
// Renderiza: <button class="my-button" aria-haspopup="dialog">` },
      { title: "Acessibilidade embutida", body: "Radix implementa os padrões WAI-ARIA corretos: roles, aria-expanded, aria-controls, focus management, keyboard navigation. Você não precisa conhecer todos os padrões ARIA — o componente já faz certo." },
    ],
    interview: [
      { q: "Por que usar Radix UI em vez de construir seus próprios componentes?", a: "<p>Implementar corretamente componentes complexos como Dialog, Select ou Combobox leva semanas: focus trap, Esc para fechar, navegação por setas, ARIA correto, suporte a screen reader, scroll lock, z-index management. Radix resolve tudo isso — você foca no estilo.</p>", level: "pleno" },
      { q: "O que é o padrão de 'composição com partes' do Radix?", a: "<p>Ao invés de um componente monolítico com props para tudo, Radix exporta partes (Root, Trigger, Content, Title, etc.). Você monta a estrutura explicitamente no JSX. Isso dá controle total sobre o markup e permite inserir elementos customizados entre as partes.</p>", level: "pleno" },
      { q: "O que faz o prop 'asChild'?", a: "<p>asChild faz o componente Radix mesclar seu comportamento e ARIA no elemento filho ao invés de renderizar um wrapper. Evita o problema de 'div soup'. Implementado com a pattern do Slot — renderiza o filho com props mescladas do pai.</p>", tip: "Explicar que é implementado via Slot mostra que você entende o mecanismo, não só o efeito.", level: "senior" },
      { q: "Como Radix e shadcn/ui se relacionam?", a: "<p>shadcn/ui usa Radix UI como base de comportamento/acessibilidade e adiciona estilo Tailwind CSS em cima. Quando você adiciona um componente shadcn, você obtém: Radix (comportamento) + Tailwind (estilo) + cva (variantes). Você pode trocar o estilo — o comportamento vem do Radix.</p>", level: "pleno" },
    ],
    gotchas: [
      "Radix renderiza alguns componentes em Portal por padrão (Dialog, Tooltip) — isso pode causar problemas com z-index e contextos de CSS que não alcançam o body.",
      "asChild requer que o filho seja um único elemento React que aceite ref e props — não funciona com fragmentos ou componentes que não fazem forward de ref.",
      "O estilo de overlay e content são separados — estilizar o Dialog.Content não afeta o fundo escurecido (Dialog.Overlay).",
    ],
    resources: [
      { title: "Radix UI docs", url: "https://www.radix-ui.com/primitives/docs/overview/introduction", kind: "docs" },
      { title: "Radix UI — Accessibility", url: "https://www.radix-ui.com/primitives/docs/overview/accessibility", kind: "docs" },
    ],
}

export default radixUi
