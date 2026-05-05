import type { SkillContent } from '@/types'

const svelte: SkillContent = {
    tagline: "Framework JavaScript que compila para JS vanilla — sem runtime, reatividade no compilador.",
    why: "Svelte tem crescimento constante e abordagem única: compila componentes para JS imperativo otimizado. Alternativa a React/Vue para projetos que priorizam bundle mínimo.",
    gotchas: [
      "Svelte usa reatividade baseada em atribuição — reatribuir um array/objeto dispara update. Mutação direta (.push(), .x = y) não é reativa (sem reatribuição).",
      "Stores Svelte são diferentes de Pinia/Zustand — use writable(), readable(), derived(). Acesso com $ é açúcar sintático do compilador.",
      "Ecossistema menor que React/Vue. Muitas libs React não têm equivalente Svelte.",
    ],
}

export default svelte
