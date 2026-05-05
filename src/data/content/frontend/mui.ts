import type { SkillContent } from '@/types'

const mui: SkillContent = {
    tagline: "Biblioteca React de componentes Material Design — completa e madura.",
    why: "MUI ainda domina codebases corporativas e projetos internos. Entender o sistema de tema (createTheme), sx prop e como customizar é necessário para manutenção.",
    gotchas: [
      "sx prop é conveniente mas gera CSS-in-JS em runtime — em apps muito grandes, considere o impacto de performance.",
      "Customizar componentes MUI via styled() ou theme.components é o caminho correto — sobrescrever classes CSS internas quebra com atualizações.",
      "MUI v5 mudou de JSS para Emotion. Migração de v4 para v5 é significativa — não assuma compatibilidade.",
    ],
}

export default mui
