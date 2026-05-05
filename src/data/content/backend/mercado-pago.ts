import type { SkillContent } from '@/types'

const mercadoPago: SkillContent = {
  tagline: "Gateway de pagamentos dominante no Brasil — PIX, boleto, cartão e checkout Pro.",
  why: "Mercado Pago é o gateway de pagamentos mais usado no Brasil. Integrar PIX e checkout é expectativa em vagas de e-commerce nacional.",
  gotchas: [
    "Webhook sem validação — qualquer um pode simular notificação de pagamento aprovado.",
    "Não tratar estados intermediários — pagamento 'pending' pode virar 'approved' ou 'rejected' depois.",
    "Sandbox com comportamentos diferentes da produção — testar em produção com valores mínimos antes do go-live.",
  ],
}

export default mercadoPago
