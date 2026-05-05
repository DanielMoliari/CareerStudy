import type { SkillContent } from '@/types'

const recharts: SkillContent = {
    tagline: "Biblioteca de gráficos React baseada em D3 — declarativa e composável.",
    why: "Recharts é a opção mais popular para gráficos em projetos React. API declarativa com componentes React — sem aprender D3 do zero.",
    gotchas: [
      "Recharts requer que o container pai tenha height definido — sem height explícito, o gráfico não renderiza.",
      "Customização avançada (tooltips, labels customizados) requer renderProps e pode ficar verboso.",
      "Performance pode degradar com muitos pontos de dados — use data sampling ou virtualização para séries grandes.",
    ],
}

export default recharts
