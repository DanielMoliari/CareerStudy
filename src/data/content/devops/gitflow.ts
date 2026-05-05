import type { SkillContent } from '@/types'

const gitflow: SkillContent = {
  tagline: "Modelo de branching com branches dedicadas por tipo — main, develop, feature, release, hotfix.",
  why: "GitFlow foi o padrão durante anos. Hoje a tendência é trunk-based development (branch curta + feature flags), mas GitFlow ainda aparece em contextos de release cíclico (mobile, firmware, enterprise). Vale entender pra saber quando aplicar e quando evitar.",
  gotchas: [
    "GitFlow cria conflitos massivos quando features vivem em branches longas — quanto mais tempo fora do main, mais difícil o merge.",
    "Para times com deploy contínuo, GitFlow é over-engineered. Trunk-based + feature flags entrega mais rápido com menos risco.",
    "Hotfix em GitFlow deve ser mergeado tanto no main quanto no develop — esquecer o develop vira bug que ressurge na próxima release.",
    "Muitos times 'usam GitFlow' mas na prática abandonam o develop branch — vira GitFlow parcial que confunde mais do que ajuda.",
  ],
  resources: [
    { title: "Gitflow Workflow (Atlassian)", url: "https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow", kind: "artigo" },
    { title: "A successful branching model (post original)", url: "https://nvie.com/posts/a-successful-git-branching-model/", kind: "artigo" },
  ],
}

export default gitflow
