import type { SkillContent } from '@/types'

const fhirHl7: SkillContent = {
  tagline: "Padrão de interoperabilidade de dados de saúde — FHIR é a versão moderna do HL7.",
  why: "Projetos de saúde digital no Brasil usam FHIR. Saber o básico do padrão é diferencial em vagas healthtech.",
  gotchas: [
    "FHIR tem versões incompatíveis (R4, R5) — confirme a versão suportada pela integração.",
    "Recursos FHIR são verbosos — performance pode ser problema em alto volume sem cache.",
  ],
}

export default fhirHl7
