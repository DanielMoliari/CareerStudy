import type { SkillContent } from '@/types'

const sonarqube: SkillContent = {
  tagline: "Plataforma de análise estática de qualidade de código — bugs, code smells, dívida técnica, cobertura.",
  why: "SonarQube é o padrão em empresa grande para gate de qualidade em CI. Bloqueia PR se quality gate falha. Senior precisa entender como integrar no pipeline, o que cada métrica significa, e como não deixar ruído de false-positive dominar.",
  gotchas: [
    "Quality gate muito restritivo no início paralisa time — comece com gate permissivo e aperte ao longo do tempo.",
    "Coverage no SonarQube é calculado a partir do relatório gerado pelo test runner (lcov, JaCoCo) — sem passar o relatório, coverage aparece como zero.",
    "False positives em regras de segurança (hotspot) precisam de review manual — marcar como 'won't fix' sem análise é negligência.",
    "SonarQube Community (gratuito) não tem análise de Pull Request — precisa da edição Developer ou usar SonarCloud.",
  ],
  resources: [
    { title: "SonarQube Documentation", url: "https://docs.sonarqube.org/", kind: "docs" },
    { title: "SonarCloud (SaaS gratuito para open-source)", url: "https://sonarcloud.io/", kind: "pratica" },
  ],
}

export default sonarqube
