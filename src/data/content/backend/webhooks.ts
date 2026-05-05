import type { SkillContent } from '@/types'

const webhooks: SkillContent = {
  tagline: "HTTP callbacks para notificar sistemas externos quando eventos ocorrem.",
  why: "Webhooks são a forma padrão de integração event-driven com terceiros (Stripe, GitHub, etc.). Saber implementar receptor seguro é expectativa básica.",
  gotchas: [
    "Não verificar assinatura HMAC do webhook — qualquer um pode forjar payloads.",
    "Processar webhook de forma síncrona — se demorar, o terceiro considera timeout e reenvia. Enfileire e responda 200 imediatamente.",
    "Sem idempotency — terceiro pode reenviar o mesmo evento. Use evento ID para deduplicar.",
  ],
}

export default webhooks
