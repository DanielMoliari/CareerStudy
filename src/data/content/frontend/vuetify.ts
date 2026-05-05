import type { SkillContent } from '@/types'

const vuetify: SkillContent = {
    tagline: "Biblioteca Vue de componentes Material Design — ecossistema Vue equivalente ao MUI.",
    why: "Vuetify domina projetos Vue corporativos. Se você trabalha com Vue, eventualmente vai encontrar Vuetify.",
    gotchas: [
      "Vuetify 3 é específico para Vue 3 — não confunda com Vuetify 2 (Vue 2). APIs são diferentes.",
      "Customização via variáveis SASS requer configuração do build. Simples no Vite com vite-plugin-vuetify.",
      "Componentes Vuetify são pesados em bundle. Usar tree-shaking via Vite plugin é necessário para bundle razoável.",
    ],
}

export default vuetify
