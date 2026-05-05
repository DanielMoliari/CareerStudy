import type { SkillContent } from '@/types'

const nx: SkillContent = {
  tagline: "Build system avançado para monorepo — suporte multilíngue, plugins ricos, dep graph visual.",
  why: "Nx é a alternativa enterprise ao Turborepo — mais poderoso, mais complexo, melhor pra monorepo com múltiplos stacks (React + Node + Go + Java no mesmo repo). Saber a diferença com Turborepo é pergunta comum em entrevista de arquitetura.",
  gotchas: [
    "Nx tem curva de aprendizado bem mais alta que Turborepo — time sem experiência demora semanas pra produzir com fluência.",
    "Generators do Nx criam estrutura opinada — se você já tem estrutura diferente, conflito é certo na migração.",
    "nx affected só funciona corretamente se o nx.json e project.json estiverem bem configurados — misconfiguration silencioso faz testar tudo sempre.",
    "Cache remoto (Nx Cloud) é pago acima do free tier — avaliar antes de depender como core de CI.",
  ],
  resources: [
    { title: "Nx Documentation", url: "https://nx.dev/", kind: "docs" },
    { title: "Nx vs Turborepo comparison", url: "https://nx.dev/concepts/turbo-and-nx", kind: "artigo" },
  ],
}

export default nx
