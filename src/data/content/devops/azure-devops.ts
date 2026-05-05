import type { SkillContent } from '@/types'

const azureDevops: SkillContent = {
  tagline: "Suite Microsoft de DevOps — Boards, Repos, Pipelines, Artifacts e Test Plans integrados.",
  why: "Azure DevOps é onipresente em empresas Microsoft/enterprise. Se o cliente usa Azure, provavelmente usa ADO para pipelines e boards. Vale entender o ecossistema mesmo que não seja a escolha pessoal.",
  gotchas: [
    "YAML pipelines vs Classic pipelines — Classic está sendo descontinuado. Todo projeto novo deve usar YAML (azure-pipelines.yml).",
    "Service Connections mal configurados com permissão ampla demais são vetor de risco. Use managed identity quando possível.",
    "Azure Boards tem hierarquia rígida (Epic > Feature > User Story > Task) — impor sem adaptação ao processo do time cria resistência.",
    "Artifacts feed deve ter upstream sources configurados senão pacotes públicos não são resolvidos.",
  ],
  resources: [
    { title: "Azure DevOps Documentation", url: "https://learn.microsoft.com/en-us/azure/devops/", kind: "docs" },
  ],
}

export default azureDevops
