import type { SkillContent } from '@/types'

const responsiveDesign: SkillContent = {
    tagline: "Técnica de design que adapta o layout para diferentes tamanhos de tela com CSS.",
    why: "Responsividade é esperada em todo projeto web. Entender breakpoints, unidades relativas e container queries é necessário.",
    gotchas: [
      "Media queries mobile-first (min-width) são mais manuteníveis que desktop-first (max-width). Tailwind usa mobile-first por padrão.",
      "100vw inclui a largura da scrollbar — pode causar overflow horizontal. Use 100% em elementos que devem preencher o container.",
      "Fontes em px não escalam com preferências de acessibilidade do usuário. Use rem (relativo ao font-size do root) para tipografia.",
    ],
}

export default responsiveDesign
