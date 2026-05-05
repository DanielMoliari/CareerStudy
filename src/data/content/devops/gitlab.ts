import type { SkillContent } from '@/types'

const gitlab: SkillContent = {
  tagline: "Plataforma DevSecOps completa — Git + CI/CD + registry + security em uma só ferramenta.",
  why: "GitLab domina em empresas que self-hospedam (on-prem, compliance). É a alternativa ao GitHub com CI/CD, container registry, security scanning e wikis integrados. Saber GitLab é diferencial em empresa enterprise.",
  gotchas: [
    "GitLab CE (Community) não tem SAML SSO — é uma armadilha ao comparar planos. Verifique features antes de propor self-hosted.",
    "Forking workflow no GitLab exige configuração de upstream remoto — diferente do GitHub que automatiza mais.",
    "Auto DevOps pode subir pipelines inesperados em repo novo. Desabilite se não está usando de propósito.",
    "Tokens pessoais têm escopo amplo por padrão — use deploy tokens ou project access tokens com escopo mínimo.",
  ],
  resources: [
    { title: "GitLab Documentation", url: "https://docs.gitlab.com/", kind: "docs" },
  ],
}

export default gitlab
