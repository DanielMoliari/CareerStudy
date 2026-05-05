import type { SkillContent } from '@/types'

const php: SkillContent = {
  tagline: "Linguagem server-side dominante na web por décadas — base do Laravel e WordPress.",
  why: "PHP ainda alimenta uma fração enorme da web. Saber o básico ajuda a manter sistemas legados e entender o ecossistema Laravel.",
  gotchas: [
    "Comparação com == em PHP tem coerção de tipos surpreendente — use === sempre.",
    "register_globals e magic_quotes eram vetores de injeção em PHP antigo — código legado pode ter essas vulnerabilidades.",
    "PHP tem estado compartilhado entre requests quando usando OPcache — variáveis globais e estáticas podem vazar.",
  ],
}

export default php
