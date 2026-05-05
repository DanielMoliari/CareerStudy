import type { SkillContent } from '@/types'

const revitPython: SkillContent = {
  tagline: "Automação de modelagem BIM no Revit via Python — scripts para AEC e engenharia.",
  why: "Nicho de AEC/engenharia civil. Aparece em vagas de digital twin e automação de projetos de construção.",
  gotchas: [
    "API do Revit só roda em processo do Revit — não é um servidor comum.",
    "RevitPythonShell e pyRevit têm diferenças de ambiente — scripts podem não ser portáveis.",
  ],
}

export default revitPython
