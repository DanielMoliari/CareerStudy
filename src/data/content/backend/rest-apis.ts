import type { SkillContent } from '@/types'

const restApis: SkillContent = {
  tagline: "Princípios REST: recursos, verbos HTTP, stateless, HATEOAS e boas práticas de design.",
  why: "REST e o baseline de toda vaga backend. Senior sabe design de recurso, idempotencia, status codes corretos e os tradeoffs com GraphQL e gRPC.",
  summary: "REST (Representational State Transfer) e um estilo arquitetural para APIs baseado em recursos identificados por URIs, operações com verbos HTTP semanticos (GET, POST, PUT, PATCH, DELETE), statelessness, e interface uniforme. Richardson Maturity Model mede adoção: nível 0 (RPC), nível 1 (recursos), nível 2 (verbos HTTP), nível 3 (HATEOAS).",
  keypoints: [
    { title: "Resources e URIs", body: "Substantivos no plural: /users, /orders. Hierarquia: /users/{id}/orders. Evite verbos na URI (/getUser -- errado; GET /users/{id} -- certo)." },
    { title: "Verbos HTTP", body: "GET (leitura idempotente), POST (criação, não idempotente), PUT (replace total, idempotente), PATCH (update parcial, idempotente se bem definido), DELETE (idempotente)." },
    { title: "Status codes", body: "200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable Entity, 429 Too Many Requests, 500 Internal Server Error." },
    { title: "Idempotencia", body: "Mesma operação múltiplas vezes produz mesmo resultado. GET, PUT, DELETE são idempotentes. POST não e (cria novo a cada chamada). Importante para retry seguro." },
    { title: "Paginação", body: "cursor-based (mais estável pra dados mutáveis), offset/limit (simples mas instavel em inserção), keyset. Inclui links de navegação (next, prev) no response." },
    { title: "Versioning", body: "URI (/v1/, /v2/), header (X-API-Version), Accept header. Sunset para deprecação. Breaking changes só em major version." },
    { title: "HATEOAS", body: "Respostas incluem links para próximas ações possíveis. Nível 3 do Richardson. Raramente implementado completamente na prática." },
  ],
  gotchas: [
    "POST para tudo (RPC style) -- perde semantica HTTP e cacheabilidade.",
    "200 OK para todo erro -- cliente não sabe que falhou. Use status codes corretos.",
    "Body em GET request -- undefined em HTTP, alguns proxies descartam.",
    "Não versionar API pública -- breaking change quebra cliente.",
    "Paginação offset em tabela que muda frequentemente -- itens duplicados ou perdidos.",
  ],
  interview: [
    { q: "Diferença entre PUT e PATCH?", a: "<p>PUT faz replace completo do recurso: você envia a representação inteira. Campos omitidos são removidos/resetados. Idempotente.</p><p>PATCH faz update parcial: só os campos enviados são atualizados. Idempotente se bem definido (aplicar mesmo patch múltiplas vezes da mesmo resultado). Use PATCH para updates parciais -- mais eficiente e seguro.</p>" },
    { q: "REST vs GraphQL vs gRPC -- quando usar cada?", a: "<p>REST: API pública, cacheavel, consumida por terceiros. Simples de documentar e testar.</p><p>GraphQL: múltiplos clientes com necessidades diferentes, schema como contrato, overfetching problema real.</p><p>gRPC: comunicação interna microservicos, performance crítica, streaming bidirecional, contratos fortes com Protobuf.</p>" },
  ],
  resources: [
    { title: "REST API Design Rulebook", url: "https://www.oreilly.com/library/view/rest-api-design/9781449317904/", kind: "livro" },
    { title: "Richardson Maturity Model (Fowler)", url: "https://martinfowler.com/articles/richardsonMaturityModel.html", kind: "artigo" },
  ],
  diagram: "osi-layers",
}

export default restApis
