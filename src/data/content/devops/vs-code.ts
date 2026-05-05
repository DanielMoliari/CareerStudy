import type { SkillContent } from '@/types'

const vsCode: SkillContent = {
  tagline: "Editor de código da Microsoft — extensível, leve, dominante em desenvolvimento web.",
  why: "VS Code é a ferramenta de trabalho diária. Dominar atalhos, extensões e configurações aumenta produtividade absurdamente. Saber configurar workspace settings, debug launch configs e tasks é diferencial.",
  gotchas: [
    "Instalar dezenas de extensões degrada performance — mantenha só as essenciais ativas por workspace.",
    "settings.json de usuário pode sobrescrever workspace settings de forma inesperada — separe config global de config de projeto.",
    "Usar o terminal integrado do VS Code sem entender que cada aba é um processo separado causa confusão de contexto (CWD diferente, variáveis de ambiente diferentes).",
    "Remote SSH / Dev Containers são funcionalidades subutilizadas que eliminam problemas de 'funciona na minha máquina'.",
  ],
  resources: [
    { title: "VS Code Documentation", url: "https://code.visualstudio.com/docs", kind: "docs" },
    { title: "VS Code Tips and Tricks", url: "https://code.visualstudio.com/docs/getstarted/tips-and-tricks", kind: "docs" },
  ],
}

export default vsCode
