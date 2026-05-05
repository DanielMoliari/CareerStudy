import type { SkillContent } from '@/types'

const seo: SkillContent = {
    tagline: "Conjunto de práticas para melhorar visibilidade de páginas em mecanismos de busca.",
    why: "SEO técnico é responsabilidade do frontend. Entender meta tags, structured data, Core Web Vitals e crawlability é esperado em projetos public-facing.",
    gotchas: [
      "SPAs renderizadas no cliente têm SEO comprometido se o crawler não executa JavaScript. Use SSR ou SSG para conteúdo indexável.",
      "Cada página deve ter title e meta description únicos. Páginas com title duplicado competem entre si nos resultados.",
      "Core Web Vitals (LCP, INP, CLS) são fatores de ranking. LCP ruim penaliza visibilidade mesmo com conteúdo ótimo.",
    ],
}

export default seo
