import type { SkillContent } from '@/types'

const kanban: SkillContent = {
  tagline: "Sistema de fluxo visual com WIP limits — mais simples que Scrum, foco em throughput e lead time.",
  why: "Kanban é melhor que Scrum para times de operação, suporte, DevOps e manutenção onde o trabalho chega de forma contínua e imprevisível. Combina bem com times maduros que não precisam do andaime estrutural do Scrum.",
  gotchas: [
    "Kanban sem WIP limit não é Kanban — é apenas um board. O limite de WIP é o mecanismo principal de melhoria de fluxo.",
    "Colunas demais no board criam ilusão de processo — 3 a 5 colunas são suficientes na maioria dos contextos.",
    "Lead time e cycle time são métricas diferentes — lead time inclui tempo de espera antes do início, cycle time começa quando o trabalho inicia de fato.",
    "Kanban não tem cerimônias obrigatórias mas precisa de cadência de revisão (replenishment meeting, retrospectiva de fluxo) para melhorar.",
  ],
  resources: [
    { title: "Kanban Guide (Scrum.org)", url: "https://www.scrum.org/resources/kanban-guide-scrum-teams", kind: "docs" },
  ],
}

export default kanban
