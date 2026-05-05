import type { SkillContent } from '@/types'

const css: SkillContent = {
    tagline: "Linguagem de estilos da web — box model, flexbox, grid, cascade, especificidade.",
    why: "CSS puro continua sendo necessário para entender o que frameworks como Tailwind geram. Debugging de layout requer conhecimento de box model, stacking context e cascade.",
    gotchas: [
      "Especificidade: id > class > tag. !important vence tudo mas cria dívida — evite. Prefira aumentar especificidade ou usar camadas (@layer).",
      "margin collapsing: margens verticais adjacentes de elementos em fluxo normal colapsam. Não acontece em flex/grid containers.",
      "position: fixed é relativo ao viewport, mas se um ancestral tiver transform, filter ou perspective, o contexto muda — o fixed vira relativo a esse ancestral.",
      "z-index só funciona em elementos com position diferente de static. Cria stacking context — elementos dentro de um contexto não concorrem com elementos fora.",
    ],
}

export default css
