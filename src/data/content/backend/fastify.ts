import type { SkillContent } from '@/types'

const fastify: SkillContent = {
  tagline: "Framework Node.js de alta performance com schema validation e plugin system.",
  why: "Fastify e 2-3x mais rápido que Express em benchmarks e tem validação de schema integrada. Adocao crescente como alternativa ao Express em novos projetos Node.",
  summary: "Fastify e um framework Node.js focado em performance e DX. Válida request/response automaticamente com JSON Schema (via ajv), tem sistema de plugins com encapsulamento (contexto de decorators por escopo), hooks para ciclo de vida (onRequest, preHandler, onSend) e suporte first-class a TypeScript.",
  keypoints: [
    { title: "JSON Schema validation", body: "Schemas definem estrutura de body, params, query, headers, response. ajv válida e compila para código nativo. Rejeita automaticamente requests inválidos com 400." },
    { title: "Plugin system", body: "fastify.register(plugin, opts). Cada plugin tem escopo encapsulado (decorators, hooks não vazam para fora sem fastify-plugin). Permite DI via decorators." },
    { title: "Hooks", body: "onRequest, preParsing, preValidation, preHandler, preSerialization, onSend, onResponse. Granularidade máxima no ciclo de vida." },
    { title: "Serialization", body: "Response schema acelera serialização JSON (fast-json-stringify vs JSON.stringify). 2-10x mais rápido para objetos grandes." },
    { title: "TypeScript support", body: "Types gerados automaticamente a partir de schemas. @fastify/type-provider-typebox ou zod para tipos ainda mais precisos." },
    { title: "Decorators", body: "fastify.decorate('db', dbInstance). Disponivel em todo handler como fastify.db. Encapsulado por escopo de plugin." },
  ],
  gotchas: [
    "Plugin sem fastify-plugin wrapper -- decorators não vazam para o scope pai.",
    "Schema de response sem 200 -- fastify não válida/serializa response sem schema definido.",
    "async handler sem return -- response fica pendente.",
    "Misturar reply.send() e return -- comportamento imprevisivel.",
  ],
  interview: [
    { q: "Por que Fastify e mais rápido que Express?", a: "<p>Serialização JSON com fast-json-stringify (2-10x vs JSON.stringify para schemas conhecidos), validação compilada com ajv (JIT), routing com find-my-way (radix tree vs Express linear), ausencia de overhead de middleware legado.</p><p>Em benchmarks: ~77k req/s vs Express ~28k req/s em hello world. Diferenca real em produção depende do bottleneck (geralmente DB, não framework).</p>" },
  ],
  resources: [
    { title: "Fastify docs", url: "https://www.fastify.io/docs/", kind: "docs" },
    { title: "Fastify benchmarks", url: "https://www.fastify.io/benchmarks/", kind: "artigo" },
  ],
}

export default fastify
