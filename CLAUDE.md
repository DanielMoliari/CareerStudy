# CareerStudy

Repositório de estudo e evolução de carreira do Daniel Moliari.

## Contexto
- Ler `CONTEXT.md` para entender de onde vieram as skills e as decisões tomadas
- As fontes originais estão no repo irmão `Apex/career-dossier/` (CVs, LinkedIn plan, master-skills-bank.json)
- O projeto foi migrado de HTML estático para Next.js 14 App Router com TypeScript

## Stack atual
- **Next.js 14.2.29** com App Router (`src/app/`)
- **TypeScript** com `target: ES2017`, `downlevelIteration: true`, `ignoreDeprecations: "5.0"`
- **`next.config.mjs`** (não `.ts` — Next.js 14 não suporta config em TS)
- `'use client'` em todas as páginas (usam localStorage)
- Dev server: `npm run dev` → http://localhost:3000

## Estrutura
```
src/
  app/
    page.tsx          — Dashboard principal
    skills/page.tsx   — Mapa de skills com filtros e chips
    skill/[slug]/     — Detalhe da skill (áudio TTS, notas, prereqs)
    graph/page.tsx    — Grafo SVG de pré-requisitos com pan/zoom
    concepts/page.tsx — 12 diagramas SVG interativos
    routine/page.tsx  — Rotina de estudos
    globals.css       — Design system completo (dark theme)
    layout.tsx        — Root layout com Google Fonts
  components/
    Nav.tsx           — Navegação top (usa usePathname + useProgress)
    ProgressBar.tsx   — Barra multi-segmento de progresso
  data/
    skills.ts         — CATEGORIES, ALL_SKILLS, SKILL_BY_SLUG, DEPENDENCIES, iconUrl()
    content/
      index.ts        — Agrega todos os domínios (não alterar)
      meta.ts         — AUTO-GERADO: índice leve de todas as skills (score, campos presentes)
      frontend/       — Um arquivo .ts por skill (react.ts, vue.ts, next-js.ts, ...)
      backend/        — node-js.ts, nestjs.ts, graphql.ts, ...
      database/       — postgresql.ts, redis.ts, ...
      cloud/          — aws.ts, ec2.ts, lambda.ts, s3.ts, terraform.ts, ...
      devops/         — docker.ts, playwright.ts, kubernetes.ts, ...
      ai/             — agentic-workflows.ts, rag.ts, mcp.ts, ...
      arch/           — clean-architecture.ts, microservices.ts, ddd.ts, ...
      cs/             — algoritmos-ds.ts, dynamic-programming.ts, event-loop.ts, ...
      obs/            — slis-slos-slas.ts, prometheus.ts, grafana.ts, ...
      sec/            — owasp-api-top-10.ts, threat-modeling.ts, ...
      soft/           — ingles.ts, comunicacao.ts, ...
  hooks/
    useProgress.ts    — Hook localStorage (getState, setState, cycleState, notas, stats, export/import)
  types/
    index.ts          — Todos os tipos TypeScript do projeto

scripts/
  generate-meta.js    — Regenera meta.ts a partir dos arquivos individuais

skills-study.html     — Arquivo original (referência, não usar mais)
graph.html            — Arquivo original do grafo (referência)
CONTEXT.md            — Origem das skills, decisões, gaps identificados
```

## Fluxo obrigatório para edição de conteúdo de skill

**SEMPRE** seguir esse fluxo ao criar ou enriquecer qualquer skill:

1. **Ler `src/data/content/meta.ts`** — arquivo de ~10KB que mostra score/campos de todas as 218 skills. Use para entender o que está incompleto sem abrir arquivos grandes.
2. **Ler apenas o arquivo da skill alvo** — ex: `src/data/content/frontend/vue.ts` (~80KB) em vez de ler o arquivo monolítico inteiro.
3. **Editar o arquivo individual** da skill diretamente.
4. **Rodar `node scripts/generate-meta.js`** após qualquer criação ou enriquecimento de skill para manter o `meta.ts` atualizado.
5. **Rodar `npx tsc --noEmit`** para confirmar zero erros TypeScript.

> ⚠️ Nunca ler os arquivos `index.ts` das pastas para buscar conteúdo — eles só re-exportam. O conteúdo está nos arquivos individuais.

## Padrão de completude de skill (score 10/10)

Cada skill deve ter todos os campos abaixo para ser considerada completa:
- `interview`: ≥20 Q&As com `level: 'pleno'|'senior'`, `a` em HTML rico, `tip`
- `interview`: ≥10 Q&As (mínimo aceitável)
- `diagrams`: ≥3 itens (HTML/CSS com prefix CSS único por skill)
- `mnemonics`: ≥3 itens (`{label, trick, explanation}`)
- `cheatsheet`: presente (DiagramBlock com HTML/CSS)
- `mindmap`: presente (DiagramBlock com HTML/CSS)
- `exercises`: ≥3 itens (`level: iniciante|intermediario|senior`)
- `videos`: ≥4 itens (`{title, channel, url}`)
- `resources`: ≥5 itens (`{title, url, kind}`)
- `codeExamples`: ≥3 itens (`{title, code, language}`)

Ao criar skill nova: criar arquivo em `{domain}/{slug}.ts`, importar no `{domain}/index.ts`, rodar `generate-meta.js`.

## Design system
- Dark theme, scarlet accent `#ef4444`, fonts Space Grotesk + JetBrains Mono + Plus Jakarta Sans
- Ícones via Simple Icons CDN: `https://cdn.simpleicons.org/{slug}/{hex}`
- `onError` em todo `<img>` de ícone para esconder ícones quebrados (CDN 404)
- Prioridades: P1 (vermelho/essencial), P2 (amarelo/importante), P3 (cinza/bônus)
- Estados de progresso: `pendente | lendo | praticando | domino | revisar`

## Regras críticas
- **Layout de páginas**: `<Nav />` deve ficar FORA do div `.shell` ou `.shell-wide` (wrappado em `<>`)
- **Pan/zoom SVG** (graph/page.tsx): usar refs mutáveis + `setAttribute` direto no DOM — NÃO usar state do React para pan/zoom, pois re-renders de hover/filtro sobrescrevem o transform
  - `panRef`, `zoomRef`, `gRef` → `applyTransform()` → `gRef.current.setAttribute('transform', ...)`
  - `useLayoutEffect(() => applyTransform())` sem deps para re-aplicar após qualquer re-render
- **Ícones SVG `<image>`**: usar `<foreignObject><img onError=...></foreignObject>` em vez de `<image onError>` porque `error` events não bubbleiam no DOM (React não os capta via delegation)
- **Event listeners nativos**: para pan/zoom, usar `addEventListener` nativo (não React synthetic events) pois SVG + HTML boundary pode perder eventos sintéticos
- **Português correto é imprescindível** — todo texto em português deve usar acentuação completa e ortografia correta. Proibido escrever sem acento: "não" nunca "nao", "você" nunca "voce", "são" nunca "sao", "então" nunca "entao", "também" nunca "tambem", "função" nunca "funcao", etc. Isso vale para UI, conteúdo de skills, comentários e qualquer outro texto em português no projeto. Revisar sempre antes de escrever.

## localStorage
- Chave: `careerstudy.progress.v1`
- Formato: `Record<slug, { state, updatedAt, notes? }>`
