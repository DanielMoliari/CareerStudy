import type { SkillContent } from '@/types'

const vuex: SkillContent = {
    tagline: "Gerenciamento de estado oficial do Vue 2 — substituído pelo Pinia no Vue 3.",
    why: "Vuex ainda aparece em projetos Vue 2 em manutenção. Entender state/getters/mutations/actions é necessário.",
    gotchas: [
      "Vuex é específico para Vue 2 — no Vue 3, use Pinia. Tentar usar Vuex 4 no Vue 3 funciona mas é caminho sem futuro.",
      "Mutations devem ser síncronas. Async vai em actions. Violação não gera erro mas quebra o DevTools de state tracking.",
      "Namespaced modules são necessários em apps grandes mas adicionam boilerplate na chamada (store.dispatch('module/action')).",
    ],
}

export default vuex
