import type { SkillContent } from '@/types'

const github: SkillContent = {
  tagline: "Plataforma Git de hospedagem e colaboração — hub central de código open-source e empresa.",
  why: "GitHub vai além do git remoto: Pull Requests como unidade de review, Issues para rastreamento, Actions para CI/CD, Packages para registry, Dependabot para segurança, Copilot para AI. Dominar o fluxo PR-review é obrigatório em qualquer time.",
  gotchas: [
    "PR sem description suficiente — revisor não tem contexto, review superficial. Descreva o problema, a solução e como testar.",
    "Merge sem squash em feature branch com 50 commits intermediários polui o histórico do main.",
    "GitHub Issues sem labels, milestone ou assignee se perdem — nunca resolvidos. Triage é disciplina, não optativa.",
    "Secrets em Settings > Actions são criptografados mas aparecem em logs se você fizer echo. Sempre mask secrets nos logs.",
  ],
  resources: [
    { title: "GitHub Docs", url: "https://docs.github.com/", kind: "docs" },
    { title: "GitHub Flow", url: "https://docs.github.com/en/get-started/quickstart/github-flow", kind: "docs" },
  ],
}

export default github
