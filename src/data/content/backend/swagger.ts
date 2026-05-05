import type { SkillContent } from '@/types'

const swagger: SkillContent = {
  tagline: "Especificação OpenAPI + UI interativa para documentar e testar APIs REST.",
  why: "Toda empresa com API externa ou times separados de front/back espera documentação OpenAPI. Saber gerar, manter e versionar specs é expectativa básica de sênior backend.",
  summary: "Swagger é o conjunto de ferramentas ao redor do padrão OpenAPI Specification (OAS). O OAS é um formato YAML/JSON que descreve endpoints, parâmetros, schemas de request/response, autenticação e exemplos. Swagger UI renderiza a spec como UI interativa para testar. Em NestJS: @nestjs/swagger gera spec automaticamente via decorators. Em Express: swagger-jsdoc ou spec manual.",
  keypoints: [
    { title: "OpenAPI Specification", body: "Formato YAML/JSON com paths, components/schemas, securitySchemes. Versão 3.x é o padrão atual. Descreve contratos de API de forma legível por máquina e humanos." },
    { title: "NestJS + @nestjs/swagger", body: "@ApiProperty em DTOs gera schemas. @ApiResponse, @ApiOperation em controllers gera docs de endpoints. SwaggerModule.setup() sobe a UI em /api." },
    { title: "Code-first vs spec-first", body: "Code-first: decorators geram spec automaticamente (NestJS, FastAPI). Spec-first: escreve OAS manualmente e gera código (client SDKs, mocks). Spec-first tem contrato mais explícito." },
    { title: "Security schemes", body: "bearerAuth (JWT), apiKey, oauth2, openIdConnect. Definidos em components/securitySchemes e referenciados por endpoint ou globalmente." },
    { title: "Geração de client SDK", body: "openapi-generator-cli gera clientes em qualquer linguagem a partir da spec. Reduz integração manual entre times." },
  ],
  gotchas: [
    "Swagger UI em produção sem auth — expõe docs completos e permite testar a API. Proteja com auth ou desabilite em prod.",
    "DTO sem @ApiProperty — campos não aparecem no schema gerado.",
    "Spec desatualizada — code-first desatualiza automaticamente, spec manual fica stale. Adicione validação no CI.",
    "Exemplos sem dados realistas — torna a doc inútil para quem vai consumir.",
  ],
  interview: [
    { q: "Qual a diferença entre Swagger e OpenAPI?", a: "<p>OpenAPI Specification (OAS) é o padrão aberto que descreve APIs REST em YAML/JSON. Swagger era o nome original (criado pela SmartBear) antes de ser doado à Linux Foundation como OpenAPI.</p><p>Hoje 'Swagger' se refere às ferramentas (Swagger UI, Swagger Editor, Swagger Codegen) enquanto o padrão se chama OpenAPI.</p>" },
    { q: "Como garantiria que a documentação está sempre atualizada?", a: "<p>Code-first (NestJS + @nestjs/swagger, FastAPI): spec gerada automaticamente em build — nunca fica stale. Adicione um teste no CI que gera a spec e verifica diff contra a spec commitada.</p><p>Spec-first: use ferramentas como Spectral para lint da spec e openapi-diff para detectar breaking changes em PRs.</p>" },
  ],
  resources: [
    { title: "OpenAPI Specification", url: "https://spec.openapis.org/oas/latest.html", kind: "docs" },
    { title: "NestJS Swagger", url: "https://docs.nestjs.com/openapi/introduction", kind: "docs" },
  ],
}

export default swagger
