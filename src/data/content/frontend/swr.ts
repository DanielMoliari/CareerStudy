import type { SkillContent } from '@/types'

const swr: SkillContent = {
    tagline: "Biblioteca de data fetching para React com foco em stale-while-revalidate.",
    why: "SWR da Vercel é alternativa ao React Query, mais simples e menor. Aparece em projetos Next.js da Vercel ecosystem.",
    gotchas: [
      "SWR é mais simples que React Query mas tem menos features: sem mutations nativas, sem infinite queries nativas no mesmo nível.",
      "O fetcher precisa lançar erro para SWR detectar falha — um fetch que retorna 404 sem throw não marca como erro.",
      "Cache SWR é in-memory por padrão — não persiste entre reloads. Para persistência, use middleware de cache customizado.",
    ],
}

export default swr
