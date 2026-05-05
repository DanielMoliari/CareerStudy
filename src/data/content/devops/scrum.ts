import type { SkillContent } from '@/types'

const scrum: SkillContent = {
  tagline: "Framework ágil com sprints, cerimônias e papéis definidos — o processo mais adotado em times de produto.",
  why: "Scrum aparece em toda entrevista de processo e cultura. Não precisa virar Scrum Master, mas senior precisa saber explicar as cerimônias, os papéis (PO, SM, Dev Team), e principalmente quando Scrum é sobre-processo para o contexto.",
  gotchas: [
    "Sprint planning sem refinement prévio vira caos — estimativas sem contexto, stories mal definidas, sprint que falha.",
    "Daily Scrum como status meeting para o manager é antipattern — é sincronização entre devs, não relatório.",
    "Velocity não é produtividade — comparar velocity entre times ou usar para pressionar é sinal de mal uso do Scrum.",
    "Scrum sem Product Owner ativo vira 'Scrum' no nome mas waterfall na prática — backlog sem priorização real.",
  ],
  resources: [
    { title: "Scrum Guide (oficial)", url: "https://scrumguides.org/scrum-guide.html", kind: "docs" },
  ],
}

export default scrum
