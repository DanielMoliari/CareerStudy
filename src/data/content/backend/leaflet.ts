import type { SkillContent } from '@/types'

const leaflet: SkillContent = {
  tagline: "Biblioteca JavaScript de mapas interativos — leve, open-source, sem Google Maps.",
  why: "Leaflet é a alternativa open-source ao Google Maps. Aparece em projetos com geolocalização que querem evitar custo de APIs proprietárias.",
  gotchas: [
    "Leaflet sem SSR — inicialização requer window. Use dynamic import no Next.js.",
    "Tiles sem cache — requests repetidas ao tile server. Configure cache headers.",
  ],
}

export default leaflet
