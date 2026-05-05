import type { SkillContent } from '@/types'

const eloquent: SkillContent = {
  tagline: "ORM ActiveRecord do Laravel — simples, expressivo e integrado ao ecossistema PHP.",
  why: "Eloquent é inseparável do Laravel. Saber relações, eager loading e scopes é obrigatório em qualquer vaga Laravel.",
  gotchas: [
    "N+1 sem with() — cada item da coleção faz uma query. Use with('relation') sempre.",
    "Mass assignment sem $fillable — create(request->all()) pode sobrescrever campos sensíveis como is_admin.",
    "Soft delete sem considerar nas queries — withTrashed() necessário para incluir deletados.",
  ],
}

export default eloquent
