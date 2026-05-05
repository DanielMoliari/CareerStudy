import type { SkillContent } from '@/types'

const figma: SkillContent = {
  tagline: "Ferramenta de design colaborativo na web — padrão de fato para UI/UX de produto.",
  why: "Dev precisa ler Figma com fluência: inspecionar medidas, tokens de cor/tipografia, exportar assets, entender componentes e variants. Comunicação com design é gargalo quando o dev não sabe navegar no arquivo.",
  gotchas: [
    "Medidas no Figma são em pixels lógicos (densidade 1x) — exportar @2x ou @3x para assets em telas retina.",
    "Componentes com variants no Figma não necessariamente mapeiam 1:1 para componentes de código — traduza o conceito, não o nome.",
    "Auto layout no Figma é análogo ao Flexbox — entender os parâmetros (direction, spacing, padding, alignment) ajuda a implementar fielmente.",
    "Handoff via Dev Mode mostra CSS gerado mas pode sugerir posicionamento absoluto — não copie cegamente, adapte para o layout system do projeto.",
  ],
  resources: [
    { title: "Figma Help Center", url: "https://help.figma.com/", kind: "docs" },
    { title: "Figma for Developers (curso oficial)", url: "https://help.figma.com/hc/en-us/articles/14563756057239", kind: "curso" },
  ],
}


export default figma
