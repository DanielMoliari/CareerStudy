import type { SkillContent } from '@/types'

const resend: SkillContent = {
  tagline: "API de email transacional moderna para desenvolvedores — React Email + entregabilidade.",
  why: "Resend é a opção moderna para email transacional em projetos Node/Next.js. Simples de integrar, melhor DX que SendGrid.",
  gotchas: [
    "Domínio sem SPF/DKIM configurado — emails caem em spam.",
    "Sem bounce handling — enviar para emails inválidos deteriora reputação do domínio.",
  ],
}

export default resend
