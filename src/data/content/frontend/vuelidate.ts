import type { SkillContent } from '@/types'

const vuelidate: SkillContent = {
    tagline: "Biblioteca de validação de formulários para Vue 3 — baseada em composables.",
    why: "Vuelidate é o equivalente Vue do Formik/React Hook Form. Aparece em projetos Vue que precisam de validação declarativa.",
    gotchas: [
      "Vuelidate valida em tempo real por padrão — para validar apenas no submit, use $dirty flag.",
      "Regras customizadas devem retornar boolean ou Promise<boolean>. Não lançar exceção.",
      "useVuelidate() deve ser chamado no setup — não dentro de event handlers ou computed.",
    ],
}

export default vuelidate
