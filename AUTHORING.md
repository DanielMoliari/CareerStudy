# Guia de Autoria de Skills — CareerStudy

Documento vivo. Nasceu do que aprendemos construindo o conteúdo de React.
Não é um template rígido — é um conjunto de perguntas e princípios editoriais.

---

## Orquestração em paralelo — como implementar as 219 skills

### Estratégia

11 agentes independentes, um por categoria. Cada agente toca **somente seu arquivo**. Sem exceção. Rodar todos em paralelo numa única mensagem com múltiplas chamadas de Agent tool.

React (`frontend.ts`) já está implementado — não reescrever.

**Rodada 1** → todos os agentes, foco em P1  
**Rodada 2** → repetir os agentes que têm P2 relevante  
**P3** → tratamento mínimo (tagline + why + gotchas) — não desperdiçar contexto

### Tabela de agentes

| Agente | Arquivo | P1 | P2 | P3 | Obs |
|--------|---------|----|----|-----|-----|
| `frontend-agent` | `src/data/content/frontend.ts` | 11 | 10 | 22 | React já feito — pular |
| `backend-agent` | `src/data/content/backend.ts` | 9 | 17 | 16 | |
| `database-agent` | `src/data/content/database.ts` | 4 | 4 | 4 | |
| `cloud-agent` | `src/data/content/cloud.ts` | 8 | 1 | 0 | |
| `devops-agent` | `src/data/content/devops.ts` | 5 | 8 | 14 | |
| `obs-agent` | `src/data/content/obs.ts` | 4 | 0 | 0 | |
| `ai-agent` | `src/data/content/ai.ts` | 8 | 11 | 4 | |
| `arch-agent` | `src/data/content/arch.ts` | 9 | 5 | 7 | |
| `cs-agent` | `src/data/content/cs.ts` | 9 | 5 | 0 | |
| `soft-agent` | `src/data/content/soft.ts` | 3 | 3 | 0 | |
| `sec-agent` | `src/data/content/sec.ts` (**criar**) | 3 | 5 | 0 | Criar arquivo + importar em `index.ts` |

### Skills por agente (com slugs exatos)

Os slugs são gerados por `slugify()` em `src/data/skills.ts`. Use exatamente estes como chaves no mapa de conteúdo.

**frontend-agent** — pular `react` (já feito)
```
P1: typescript, next-js, vue, tailwind-css, zod, react-query,
    server-components-rsc, trpc, web-vitals, accessibility-a11y
P2: nuxt, vite, shadcn-ui, zustand, radix-ui, framer-motion,
    redux, formik, yup, design-systems
P3: javascript, html, css, mui, styled-components, vuetify, scss,
    bootstrap, responsive-design, jotai, vuex, pinia, swr,
    apollo-client, axios, recharts, apexcharts, echarts,
    tanstack-table, mui-datagrid, exceljs, jspdf, vuelidate,
    svelte, angularjs, react-native, webpack, seo
```

**backend-agent**
```
P1: node-js, typeorm, nestjs, postgresql, graphql, prisma,
    concurrency, caching-strategies, api-versioning
P2: laravel, express, python, fastify, rest-apis, websocket,
    swagger, drizzle, sequelize, jwt, oauth-2-0,
    nextauth-auth-js, bullmq, rabbitmq, apache-kafka,
    cdc-debezium, bash
P3: php, eloquent, sanctum, firebase-auth, socket-io, webhooks,
    apache-thrift, fhir-hl7, agora-io, stripe, mercado-pago,
    resend, leaflet, openstreetmap, revit-python, go, rust
```

**database-agent**
```
P1: postgresql, explain-analyze, mvcc, b-tree-lsm-tree
P2: redis, elasticsearch, pgvector, qdrant
P3: mysql, mariadb, sqlite, firebase
```

**cloud-agent**
```
P1: aws, ec2, s3, lambda, rds, iam, vpc, terraform
P2: pulumi
```

**devops-agent**
```
P1: docker, docker-compose, github-actions, tdd, playwright
P2: kubernetes, linux, nginx, gitlab-ci-cd, jest, vitest,
    turborepo, feature-flags, k6-load-testing
P3: git, pm2, github, gitlab, azure-devops, gitflow,
    phpunit, pest, cypress, sonarqube, nx,
    scrum, kanban, vs-code, cursor, figma
```

**obs-agent**
```
P1: opentelemetry, prometheus, grafana, slis-slos-slas
```

**ai-agent**
```
P1: agentic-workflows, rag, function-calling, mcp, langgraph,
    fine-tuning-lora, llmops, ragas
P2: anthropic-sdk, openai-sdk, prompt-engineering, multimodal,
    crewai, hugging-face, quantizacao-gguf, vllm,
    langsmith, ai-guardrails, hnsw-ivf
P3: ollama, telegram-bots, gramjs-telethon, cheerio
```

**arch-agent**
```
P1: system-design, solid, clean-architecture, ddd,
    microservices, cqrs, circuit-breakers, rate-limiting,
    tradeoff-analysis
P2: event-driven, design-patterns, dependency-injection,
    sharding, chaos-engineering
P3: hmvc, mvc, soa, repository-pattern, multi-tenant,
    clean-code, code-review
```

**cs-agent**
```
P1: algoritmos-ds, big-o, dynamic-programming, grafos,
    tcp-ip-dns, tls-https, event-loop, memory-management,
    cap-theorem
P2: http-2-http-3, processos-threads, raft-paxos,
    crdts, consistent-hashing
```

**soft-agent**
```
P1: ingles, technical-writing, adrs-rfcs
P2: espanhol, comunicacao, lideranca
```

**sec-agent** — criar `src/data/content/sec.ts` e adicionar import em `src/data/content/index.ts`
```
P1: owasp-top-10, owasp-api-top-10, threat-modeling
P2: sast-semgrep, dast-zap, snyk-dependabot,
    secrets-management, gitleaks
```

### Piso de qualidade por prioridade

| Prioridade | Mínimo obrigatório | Permitido adicionar |
|------------|-------------------|---------------------|
| **P1** | `tagline`, `why`, `summary`, `keypoints` (≥5), `interview` (≥6 Q&As com levels), `diagrams` (≥1), `gotchas` (≥3) | Tudo do SkillContent |
| **P2** | `tagline`, `why`, `summary`, `keypoints` (≥3), `interview` (≥4 Q&As), `gotchas` (≥2) | diagrams, cheatsheet, mnemonics se fizer sentido |
| **P3** | `tagline`, `why`, `gotchas` (≥2) | `summary` se for skill importante no mercado |

### Regras absolutas (nunca violar)

1. **Tocar apenas o arquivo atribuído** — backend-agent não escreve em frontend.ts, nunca
2. **Não sobrescrever conteúdo existente rico com conteúdo raso** — ler o arquivo antes de escrever, preservar o que já está bom
3. **Slug deve ser a chave exata** — usar a lista acima, não inventar variações
4. **Nenhum campo com string vazia ou placeholder** — se não tiver conteúdo real, omitir o campo
5. **Português correto** — acentuação completa: "não", "você", "também", "função" — nunca sem acento
6. **Cor dos diagramas = cor da tech** — não usar azul React `#61DAFB` para outras techs (ver tabela de cores)
7. **P3 = mínimo** — não gastar contexto escrevendo diagramas animados para skills P3
8. **sec-agent**: criar o arquivo com `export default { ... } satisfies SkillContentMap` e adicionar `import sec from './sec'` + `...sec` no `index.ts`

### Prompt template para invocar cada agente

Copie, substitua os campos entre `<>`, e dispare todos de uma vez numa única mensagem com múltiplas chamadas de Agent:

```
Você é o <NOME>-agent do CareerStudy. Sua única responsabilidade é escrever
conteúdo de skills para o arquivo <ARQUIVO>.

LEIA ESSES ARQUIVOS PRIMEIRO (nessa ordem, antes de escrever qualquer coisa):
1. /Users/daniel-moliari/CareerStudy/AUTHORING.md  — filosofia, tipos, regras
2. /Users/daniel-moliari/CareerStudy/src/types/index.ts  — contrato SkillContent
3. /Users/daniel-moliari/CareerStudy/src/data/content/frontend.ts  — referência de qualidade
4. /Users/daniel-moliari/CareerStudy/<ARQUIVO>  — veja o que já existe antes de escrever

SKILLS A COBRIR (em ordem de prioridade):
P1: <lista de slugs P1>
P2: <lista de slugs P2>
P3: <lista de slugs P3>

REGRAS:
- Toque SOMENTE <ARQUIVO>. Nenhum outro arquivo. (Exceto sec-agent: também editar index.ts)
- Não sobrescreva conteúdo já existente e rico com conteúdo mais raso
- Use o piso de qualidade do AUTHORING.md por prioridade
- Slug como chave = exatamente o que está na lista acima
- Cor dos diagramas = cor da tech (não o azul React)
- Português com acentuação correta sempre
- Comece pelos P1, depois P2, P3 por último
- Ao terminar, confirme quais skills foram escritas e quais ficaram rasas/omitidas por limite de contexto
```

---

## Filosofia central

**Conteúdo primeiro. Estrutura depois.**

A pergunta não é "quais seções essa skill tem?" — é "o que um dev precisa entender e lembrar dessa tech para ir bem em entrevista e no dia a dia?". A resposta dita o que entra.

Nem toda skill precisa de todo bloco. SQL não precisa de Cookbook. Soft skills não precisam de terminal. TypeScript provavelmente não precisa de QuizMode com dezenas de questões, mas precisa de um diagrama do sistema de tipos melhor do que qualquer explicação em texto.

A estética e a cor seguem a identidade visual da própria tech — não o padrão React.

---

## Perguntas editoriais antes de escrever qualquer conteúdo

Antes de abrir o arquivo da skill, responda:

1. **Qual é o modelo mental central?** O conceito sem o qual o dev vai errar sistematicamente. Para React foi "UI = f(estado)". Para TypeScript é "tipos são conjuntos". Para Node.js é "event loop — I/O não bloqueia a thread".

2. **Qual é o diagrama mais esclarecedor?** Um único diagrama que, se o dev entender, destranca o resto. Não precisa ser animado — precisa ser honesto com o que o conceito pede. Um fluxo pede animação. Uma hierarquia pede layout estático com hover.

3. **Quais são os 3–5 erros que mais aparecem em entrevista?** Anti-patterns reais, não teóricos. Para React: mutação direta de estado, useEffect com deps erradas, prop drilling desnecessário.

4. **Existe um mnemônico genuíno?** Não force. SPCK (State, Props, Context, Key) emergiu naturalmente do que mais cai em entrevista React. Se não existe equivalente real para a tech, não invente um acrônimo vazio.

5. **Precisa de terminal interativo?** Node.js, Python, SQL, Shell — sim, faz sentido ter um REPL embutido onde o dev digita e vê o resultado. TypeScript puro — talvez. CSS — não.

6. **Precisa de grafo de conexões?** Arquitetura de sistemas, microserviços, dependências entre módulos, fluxo de dados distribuído — grafos conectores visuais fazem mais sentido que texto. Uma skill de algoritmos pode precisar de grafo de adjacência interativo.

7. **Qual é o nível de split pleno/sênior que faz sentido?** Para React há diferença clara: pleno conhece os hooks, sênior conhece Fiber, reconciliação, otimização de re-renders. Para uma lib menor a distinção pode não existir.

---

## Blocos disponíveis (implementados)

Cada bloco é opcional. Use só o que a tech pede.

### `quiz` — Questões de entrevista
- Estrutura: pergunta, resposta, tip de entrevista, level (pleno | senior)
- Suporta filtragem por nível no QuizMode com shuffle e rate (ok / parcial / não soube)
- Keyboard shortcuts: Espaço/→ revela, 1/2/3 avalia
- Bom para: qualquer tech com diferença clara entre níveis

### `diagrams` — Diagramas interativos
- HTML/CSS puro dentro de um template string — liberdade total
- Tooltips via hover em termos sublinhados
- Animações CSS/JS para ciclos e fluxos
- A cor dos nós, fundo e destaques deve ser a cor da tech, não o azul React
- Bom para: qualquer conceito que seja melhor mostrado do que descrito

### `mnemonics` — Truques de memorização
- Estrutura: trick (o acrônimo/frase), label (nome do conceito), explanation
- PDF de Mnemônicos gera cards visuais + páginas full-page de modelo mental
- Só inclua se o mnemônico é genuíno e útil em entrevista

### `cheatsheet` — Referência rápida
- Estrutura livre: hooks, métodos, flags, comandos — o que fizer sentido
- PDF CheatSheet gera tabelas e cards de regras
- Bom para: APIs grandes (React, TypeScript utility types, Git, Docker flags)

### `entrevista` — Q&A estruturado por nível
- Mais detalhado que quiz: inclui contexto, resposta completa, red flags e diferencial sênior
- PDF de Entrevista Rápida + PDF de Entrevista Completa
- Bom para: skills com peso alto em entrevistas técnicas

### `comparisons` — Comparativos lado a lado
- Estrutura: dois conceitos, quando usar cada um, decisão
- Exemplos: useState vs useReducer, useMemo vs useCallback, REST vs GraphQL
- Bom para: techs onde a escolha entre alternativas é uma armadilha frequente

### `antiPatterns` — O que não fazer
- Estrutura: nome do anti-pattern, por que acontece, como corrigir
- PDF de Anti-patterns com páginas dramáticas por anti-pattern
- Bom para: qualquer tech onde erros específicos custam caro em produção

### `cookbook` — Receitas de código
- Estrutura: problema, solução, notas de implementação
- PDF Cookbook com páginas por receita
- Bom para: techs onde a pergunta frequente é "como faz X?" — Node.js, SQL, Docker

### `guia` — Visão geral + como estudar
- PDF Guia gera uma visão de 30.000 pés: keypoints, gotchas, recursos, exercícios
- Bom para: skills densas onde o dev precisa de um mapa antes de mergulhar

---

## Blocos futuros (não implementados ainda)

Listados para não perder de vista. Cada um faz sentido para techs específicas.

### Terminal interativo (REPL embutido)
- Node.js, Python, SQL, Bash — o dev digita no diagrama e vê o output
- Para SQL: queries reais contra um banco SQLite in-memory no browser (via sql.js)
- Para Node/Python: iframe sandboxado ou WebAssembly
- Impacto alto para linguagens onde "rodar e ver" ensina mais que texto

### Grafo de conexões
- Nós arrastáveis conectados por arestas, com hover explicando cada conexão
- Casos de uso: arquitetura de microserviços, árvore de dependências de um monorepo, fluxo de dados entre serviços, grafo de tipos TypeScript
- Diferente dos diagramas estáticos atuais — o usuário pode reorganizar e explorar

### Playground de código inline
- Editor Monaco/CodeMirror embutido com output ao lado
- Para TypeScript: type checking em tempo real
- Para CSS: preview instantâneo
- Mais pesado que REPL simples, mas mais poderoso para techs visuais ou tipadas

### Flashcards offline (PWA)
- Modo offline dos mnemonics + quiz para revisar no celular sem conexão

---

## Identidade visual por tech

A cor dos diagramas, destaques e PDFs deve seguir a cor da tech.
Não use o azul React (#61DAFB) para outras techs — é a identidade dela.

| Tech | Cor primária | Hex | Observação |
|---|---|---|---|
| React | Cyan | `#61DAFB` | Marca oficial |
| TypeScript | Azul royal | `#3178C6` | Marca oficial |
| Node.js | Verde | `#417e38` / `#68A063` | Tom escuro preferível |
| Next.js | Branco/cinza | `#ffffff` | Tema dark → usar `#e2e8f0` |
| PostgreSQL | Azul elefante | `#336791` | Marca oficial |
| Docker | Azul oceano | `#2496ED` | Marca oficial |
| Python | Amarelo/azul | `#FFD43B` + `#3776AB` | Dual-tone |
| Git | Laranja-vermelho | `#F05032` | Marca oficial |
| Linux/Bash | Amarelo terminal | `#F5C518` ou `#4EAA25` | Depende do contexto |
| GraphQL | Rosa | `#E10098` | Marca oficial |
| Redis | Vermelho | `#DC382D` | Marca oficial |
| Kubernetes | Azul | `#326CE5` | Marca oficial |
| AWS | Laranja | `#FF9900` | Marca oficial |

---

## O que React nos ensinou (lições que viajam)

- **O diagrama que anima o fluxo** funciona porque o conceito *é* um fluxo. Não toda tech tem isso — não force animação onde o conceito é estático.
- **Level split pleno/sênior** agrega valor real quando a diferença de profundidade é genuína. Se a tech é pequena ou a diferença não é clara, não fragmente.
- **Mnemônicos só valem se emergem do conteúdo** — SPCK apareceu porque esses 4 conceitos realmente dominam as entrevistas React. Forçar acrônimos para techs que não têm esse padrão é ruído.
- **Tooltip em termos técnicos** dentro do diagrama é um dos recursos de maior retorno: o dev aprende o termo enquanto vê o conceito, sem sair do contexto visual.
- **PDFs com identidade visual** melhoram a experiência de revisão offline — mas só têm valor se o conteúdo dentro deles é editorial e curado, não apenas dump de dados.
- **Menos seções bem feitas > mais seções rasas.** O React tem conteúdo bom porque focamos no que realmente importa em entrevista. Uma skill com 3 blocos excelentes é melhor do que uma com 8 blocos mediocres.

---

## Para implementar: leia esses arquivos primeiro

Antes de escrever qualquer conteúdo novo, leia esses arquivos na ordem. Não para copiar — para calibrar o nível de qualidade e entender o contrato de dados.

### 1. `src/types/index.ts` — o contrato de dados

É o único arquivo obrigatório de ler. Define tudo que o sistema aceita.
Os tipos mais importantes para autoria de conteúdo:

```ts
// Cada campo é opcional — só inclua o que a tech pede
interface SkillContent {
  tagline?:      string                // Uma linha. O que é e por que importa agora.
  why?:          string                // Por que essa tech vale o investimento de tempo
  prerequisite?: string               // O que o dev precisa saber antes de começar
  summary?:      string               // Visão geral densa — 3 a 5 parágrafos
  howToStudy?:   string               // ⚠ aceita HTML (<strong>, <em>, <br>) — único campo texto com essa liberdade
                                      // Os demais (tagline, why, summary, prerequisite) são texto puro — sem tags

  diagrams?:     DiagramBlock[]       // Lista de diagramas interativos
  keypoints?:    KeyPoint[]           // Conceitos fundamentais com código opcional
  cheatsheet?:   DiagramBlock         // Referência rápida (único bloco, não array)
  mnemonics?:    Mnemonic[]           // Truques de memorização genuínos
  interview?:    InterviewQA[]        // Q&A de entrevista por nível
  exercises?:    Exercise[]           // Exercícios práticos por nível
  gotchas?:      string[]             // Armadilhas — frases curtas, direto ao ponto
  resources?:    Resource[]           // Links externos curados
  videos?:       VideoRef[]           // Vídeos de referência
  codeExamples?: CodeExample[]        // Exemplos de código standalone
}

interface DiagramBlock {
  title:    string   // Aparece como cabeçalho do diagrama
  html:     string   // HTML/CSS/JS puro em template string — liberdade total
  caption?: string   // Texto explicativo abaixo do diagrama
}

interface InterviewQA {
  q:      string
  a:      string
  tip?:   string              // Dica de postura/enquadramento na entrevista
  level?: 'pleno' | 'senior' // Omitir = aparece nos dois filtros
}

interface Mnemonic {
  trick:       string  // O acrônimo, frase ou símbolo para memorizar
  label:       string  // Nome do conceito que ele representa
  explanation: string  // O que cada letra/parte significa
}

interface KeyPoint {
  title: string
  body:  string
  code?: string  // Snippet de código (opcional)
}

interface Exercise {
  level:             'iniciante' | 'intermediario' | 'senior'
  title:             string
  description:       string
  concepts:          string[]    // Tags de conceitos cobertos
  hint?:             string
  relatedKeypoints?: number[]    // Índices dos keypoints relacionados
}

interface Resource {
  title: string
  url:   string
  kind:  'docs' | 'video' | 'curso' | 'artigo' | 'livro' | 'pratica'
}
```

### 2. `src/data/skills.ts` — onde vivem os slugs e prioridades

Antes de escrever conteúdo para qualquer skill, confirme o slug exato neste arquivo. A chave do objeto de conteúdo **deve ser idêntica** ao campo `slug` da skill — caso contrário o conteúdo não aparece.

```ts
// Exemplo de como localizar o slug correto:
// Procure pela skill em CATEGORIES ou ALL_SKILLS e copie o slug exato.
// Ex: slug 'typescript' → chave no mapa de conteúdo deve ser 'typescript'
//     slug 'node-js'    → chave deve ser 'node-js'  (não 'nodejs', não 'node')
```

Este arquivo também mostra as prioridades (P1 = essencial, P2 = importante, P3 = bônus) e as categorias — útil para decidir qual skill implementar primeiro.

### 3. `src/data/content/frontend.ts` — referência de qualidade e formato

O conteúdo React é a régua. Leia para calibrar:
- A profundidade das respostas de `interview` (não são rasas — têm contexto, nuance, tip de entrevista)
- Como os diagramas são estruturados: HTML com `<style>` inline, tooltip via hover, animação CSS/JS
- O volume de `keypoints` (React tem 13 — não é preciso chegar lá, mas é o teto de qualidade)
- O tom do `summary` e do `howToStudy` — direto, opinativo, sem floreios

Não copie a estrutura — leia para sentir o nível de detalhe que vale a pena.

### 3. `src/data/content/` — as outras skills existentes

Outros arquivos de conteúdo estão lá mas ainda são rasos comparado ao React. Não tome como referência de qualidade — tome como referência de estrutura mínima.

Os arquivos: `frontend.ts`, `backend.ts`, `database.ts`, `cloud.ts`, `devops.ts`, `cs.ts`, `ai.ts`, `arch.ts`, `obs.ts`, `soft.ts`

### 4. `src/lib/pdf/utils.ts` — paleta de cores e helpers para PDFs

Se for escrever ou ajustar um PDF, este arquivo tem:
- `C` — paleta completa (bg, card, border, accent, amber, blue, violet, green, teal, indigo + variantes Bg)
- `border(color, width)` — helper para bordas (react-pdf exige as 3 props separadas: `borderWidth`, `borderColor`, `borderStyle`)
- `today()` — data formatada em pt-BR

### 5. Constraints do @react-pdf/renderer (para quem for escrever PDFs)

O react-pdf não é um browser. Estas limitações quebram silenciosamente:

```
✗  overflow: 'hidden'          → não existe. Use borderRadius nas extremidades separadamente
✗  gap: N                       → não existe. Use marginBottom em cada item
✗  background: 'linear-gradient(...)' → não existe nos estilos — só em SVG
✗  border: '1px solid #ccc'     → não funciona como shorthand
✓  borderWidth + borderColor + borderStyle: 'solid'  → sempre separados, sempre com borderStyle

Para arredondar só o topo de um card (top bar colorida):
  borderTopLeftRadius: N, borderTopRightRadius: N  (no próprio elemento — não no pai)

Usar wrap={false} em cards que não devem quebrar entre páginas.
```

### 6. Como os diagramas são renderizados

O campo `html` de um `DiagramBlock` é injetado via `dangerouslySetInnerHTML` no browser — então é HTML/CSS/JS real, sem restrições de react-pdf. Use:
- `<style>` inline para estilos e `@keyframes`
- `onclick` / `<script>` para interatividade
- Fontes disponíveis via CSS: `'JetBrains Mono'`, `'Space Grotesk'`, `'Plus Jakarta Sans'`
- Fundo padrão dos diagramas: `#0f172a` (um tom acima do fundo da página `#020817`)
- Tooltips via `position:absolute` + `display:none` → `display:block` no hover (sem JS)

Veja os diagramas do React em `frontend.ts` como referência de como estruturar o HTML.

---

## Checklist antes de marcar uma skill como "pronta"

- [ ] O modelo mental central está articulado em algum lugar (diagrama, guia ou mnemônico)
- [ ] Os blocos incluídos são os que fazem sentido para essa tech — não foram copiados do React por inércia
- [ ] A cor visual dos diagramas é a cor da tech, não o azul React
- [ ] As questões do quiz têm level correto e tips genuinamente úteis em entrevista
- [ ] Os anti-patterns cobrem erros reais que você já viu ou que aparecem em entrevista
- [ ] Não tem seção vazia ou com conteúdo placeholder
