import type { SkillContent } from '@/types'

const pinia: SkillContent = {
    tagline: "Gerenciamento de estado oficial do Vue 3 — simples, type-safe e com DevTools.",
    why: "Pinia é o padrão atual para estado global em Vue 3. Substitui Vuex com API mais limpa e melhor TypeScript support.",
    gotchas: [
      "Não desestruture a store diretamente — perde reatividade. Use storeToRefs() para extrair propriedades reativas.",
      "Stores Pinia são lazy — criadas na primeira chamada de useStore(). Não confie na ordem de inicialização.",
      "Actions podem ser async — mas sem a separação mutation/action do Vuex. Tudo é action em Pinia.",
    ],
}

export default pinia
