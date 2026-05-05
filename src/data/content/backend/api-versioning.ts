import type { SkillContent } from '@/types'

const apiVersioning: SkillContent = {
  tagline: "Evolucao de API sem quebrar clientes existentes: URL, header, query param, content negotiation.",
  why: "API pública sem strategy de versioning quebra cliente em produção. Senior sabe tradeoffs entre URL versioning, header versioning e deprecation graceful.",
  summary: "API versioning e como você evolui sua API sem quebrar clientes existentes. Estrategias: URL path (/v1/, /v2/), query parameter (?version=2), custom header (X-API-Version), Accept header (content negotiation). Cada tem tradeoffs de cacheabilidade, visibilidade e complexidade. Boa prática: suporte N versões por período definido, deprecation com aviso antecipado, sunset header.",
  keypoints: [
    { title: "URL versioning", body: "/v1/users, /v2/users. Mais visível, fácil de testar no browser, bom pra cache. Polui URLs. Padrão adotado por Stripe, GitHub, AWS." },
    { title: "Header versioning", body: "X-API-Version: 2. URL limpa. Invisivel no browser, dificulta share de link, precisa de middleware. Usado pela Microsoft Azure." },
    { title: "Query param", body: "?api-version=2023-01-01. Visivel na URL sem poluir path. Azure usa essa estrategia com data como versão." },
    { title: "Accept header (content negotiation)", body: "Accept: application/vnd.company.v2+json. REST puro segundo Fielding. Complexidade alta. Pouco adotado na prática." },
    { title: "Sunset e deprecation", body: "Header Sunset: data em que versão sera removida. Deprecation notice em docs e resposta. Mínimo 6-12 meses de aviso para API pública." },
    { title: "Estrategia de manutenção", body: "Suportar N versões com janela de obsolescencia. Versão nova não implica remover a velha. Versões internas podem ter ciclo mais curto." },
  ],
  gotchas: [
    "Versionar cada endpoint individualmente -- inconsistencia de versão por recurso confunde.",
    "Breaking change sem versão nova -- campo renomeado, tipo mudado, campo removido são breaking.",
    "Deprecar sem sunset -- cliente nunca migra sem deadline.",
    "Manter 10 versões vivas -- custo de manutenção explode. Defina janela e remova.",
  ],
  interview: [
    { q: "O que e uma breaking change?", a: "<p>Campo removido, campo renomeado, tipo de campo mudado, comportamento de erro mudado, autenticação requerida onde não havia, campo obrigatório adicionado.</p><p>Não-breaking: novo campo opcional adicionado, novo endpoint, novo valor em enum (cuidado com parsers strict), latência melhorada.</p>" },
    { q: "Qual estrategia de versioning você prefere?", a: "<p>URL versioning para API pública: visível, cacheavel, fácil de documentar. Clientes sabem exatamente o que estao consumindo.</p><p>Header versioning para API interna: URL limpa, versão negociada em middleware centralizado.</p><p>O mais importante e a política: sunset prazo, N versões suportadas, breaking change sempre em major.</p>" },
  ],
  resources: [
    { title: "Stripe -- API versioning", url: "https://stripe.com/blog/api-versioning", kind: "artigo" },
    { title: "RFC 8594 -- Sunset Header", url: "https://datatracker.ietf.org/doc/html/rfc8594", kind: "docs" },
  ],
}

export default apiVersioning
