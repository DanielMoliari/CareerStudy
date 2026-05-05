import type { SkillContent } from '@/types'

const openstreetmap: SkillContent = {
  tagline: "Mapa colaborativo open-source — dados geoespaciais livres usados como base pelo Leaflet.",
  why: "OpenStreetMap é a fonte de dados geoespaciais open-source mais completa. Complementa Leaflet para apps que precisam de mapas sem dependência de Google.",
  gotchas: [
    "Uso intensivo do tile server público do OSM viola os termos de uso — hospede seus próprios tiles ou use um CDN de tiles.",
    "Dados podem estar desatualizados em regiões menos mapeadas.",
  ],
}

export default openstreetmap
