import type { SkillContent } from '@/types'

const gitlabCiCd: SkillContent = {
  tagline: "CI/CD nativo do GitLab — pipelines em YAML com runners distribuidos.",
  why: "GitLab CI domina em empresa que self-hospeda Git. Senior precisa montar pipeline com stages, cache, artifacts, child pipelines, dynamic environments e DAG.",
  summary: "GitLab CI le .gitlab-ci.yml na raiz. Pipeline tem stages (sequenciais por padrão, jobs em stage rodam paralelos) ou modelo DAG (needs:) pra paralelismo ótimo. Runner pode ser shared (GitLab.com), group, project, ou self-hosted (Docker, Kubernetes, shell). Recursos chave: artifacts entre stages, cache por chave, environments com deploy/rollback, review apps, parent-child pipelines pra modularizar, rules e only/except pra controlar quando job roda.",
  keypoints: [
    { title: "Stages e jobs", body: "Default: build -> test -> deploy. Jobs no mesmo stage rodam paralelos, stages são sequenciais. needs: quebra essa ordem pra DAG mais rápido." },
    { title: "Rules vs only/except", body: "rules e a sintaxe moderna, mais expressiva (combina if, changes, exists). only/except e legacy, ainda funciona mas em projeto novo: rules." },
    { title: "Cache vs artifacts", body: "Cache = pra acelerar (deps), key reutilizavel, pode perder. Artifacts = output de job consumido por outro job ou pra download (build, relatório de teste). Artifact tem expire_in." },
    { title: "Environments", body: "environment: name: production liga deploy a um environment com URL, histórico, rollback. on_stop: declara job pra teardown (review app de PR)." },
    { title: "Parent-child pipelines", body: "trigger: include: pipeline.yml dispara pipeline filha. Em monorepo, pipeline pai detecta paths alterados e dispara só as filhas relevantes." },
  ],
  gotchas: [
    "Cache muito amplo sem versionamento — inválida pouco, instala velho. Inclua hash do lockfile no key.",
    "Job sem image: — usa default do runner, não reproduzivel. Sempre fixe imagem com tag.",
    "Variaveis sensíveis em variables: do YAML — vai pro repo. Use UI: Settings > CI/CD > Variables, masked + protected.",
    "Esquecer interruptible: true — push novo não cancela pipeline antiga, gasta minuto/recurso.",
  ],
  interview: [
    { q: "GitLab CI vs GitHub Actions — quando preferir cada?", a: "<p>GitLab CI ganha em: empresa self-hosted (GitLab on-prem), suite integrada (CI + registry + security scans + package registry no mesmo lugar), modelo DAG maduro, environments com review app de fabrica.</p><p>GitHub Actions ganha em: ecossistema Marketplace gigante, repos open-source, integração com GitHub-only features (Codespaces, Copilot).</p>" },
  ],
  resources: [
    { title: "GitLab CI/CD Documentation", url: "https://docs.gitlab.com/ee/ci/", kind: "docs" },
    { title: "Pipeline architecture patterns", url: "https://docs.gitlab.com/ee/ci/pipelines/pipeline_architectures.html", kind: "docs" },
  ],
}

export default gitlabCiCd
