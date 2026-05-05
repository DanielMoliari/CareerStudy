import type { SkillContent } from '@/types'

const jotai: SkillContent = {
    tagline: "Gerenciamento de estado atômico para React — alternativa minimalista ao Zustand.",
    why: "Jotai adota o modelo de átomos (inspirado em Recoil) — bom para estado derivado complexo. Aparece em projetos que precisam de granularidade fina.",
    gotchas: [
      "Átomos são globais por padrão — sem Provider, o estado é compartilhado entre todas as instâncias. Use Provider para isolar estado por subárvore.",
      "Átomos derivados (atom(get => get(baseAtom) * 2)) são calculados sob demanda — não armazenam valor até serem lidos.",
      "Não use Jotai e Zustand juntos sem motivo — resolvem o mesmo problema com modelos diferentes.",
    ],
}

export default jotai
