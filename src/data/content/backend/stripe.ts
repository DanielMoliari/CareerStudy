import type { SkillContent } from '@/types'

const stripe: SkillContent = {
  tagline: "Plataforma de pagamentos developer-first — APIs para cobranças, assinaturas e marketplace.",
  why: "Stripe é o padrão para pagamentos em produtos digitais globais. Implementar checkout seguro e webhooks de Stripe é skill valorizada.",
  gotchas: [
    "Processar pagamento sem verificar webhook signature — fraude possível com evento forjado.",
    "Usar amount em float — Stripe usa inteiros em centavos. 10.00 BRL = 1000 (centavos).",
    "Não lidar com idempotency keys — retries de pagamento podem cobrar duas vezes.",
  ],
}

export default stripe
