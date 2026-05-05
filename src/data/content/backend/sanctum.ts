import type { SkillContent } from '@/types'

const sanctum: SkillContent = {
  tagline: "Autenticação leve do Laravel para SPAs e APIs mobile — tokens e cookies.",
  why: "Sanctum é o padrão de auth para SPAs e mobile em projetos Laravel moderno. Mais simples que Passport para maioria dos casos.",
  gotchas: [
    "Confundir Sanctum com Passport — Sanctum é para SPA/mobile simples, Passport é OAuth 2.0 completo.",
    "CORS não configurado para SPA — requisições bloqueadas pelo browser.",
    "Token sem revogação manual — tokens vivem até o usuário revogar ou expirar o TTL configurado.",
  ],
}

export default sanctum
