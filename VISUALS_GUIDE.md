# VISUALS_GUIDE — Processo Completo de Criação de Skill

Leia este arquivo **inteiro** antes de tocar em qualquer arquivo.
É a fonte de verdade do processo — do zero à entrega verificada.

---

## Filosofia central

**Objetivo:** do zero ao perito, ou do zero à entrevista pleno/sênior, só com esse conteúdo.

Antes de entregar qualquer skill, responda mentalmente:
- "Alguém aprendendo do zero ficaria perito nisto só com esse conteúdo?" → deve ser SIM
- "Alguém aprendendo do zero passaria numa entrevista pleno/sênior só com esse conteúdo?" → deve ser SIM

**Não existem números certos.** Uma skill pode ter 3 visuais ou 15. Um PDF pode não existir ou ser o ponto alto da skill. O que define a quantidade é o que a tecnologia precisa — não um template.

### ⚠️ Anti-padrão crítico: âncora numérica

O erro mais comum ao criar visuais e PDFs é **deixar o número anterior ou o número sugerido ancorar a decisão**. Se você viu "mínimo 6 visuais" ou a skill anterior tinha 8, seu cérebro vai tender a criar 6-8 — independente do que a skill precisa.

**Isso é errado.** O número correto é uma consequência da análise, não uma meta.

- AWS tem dezenas de serviços com comportamentos não-óbvios → pode precisar de 12-15 visuais
- Clean Architecture tem 5 conceitos centrais profundos → pode precisar de 4-5 visuais muito densos
- Docker é ferramenta CLI com muita superfície → pode precisar de 10 visuais E 6 PDFs de referência
- Um conceito abstrato de CS pode precisar de 2 visuais perfeitos

**Como evitar a âncora:** enumere os conceitos da skill que visuais ajudariam, crie um visual para cada um que mereça — e pare. Não olhe para o total até terminar.

### Decisão editorial por visual

Para cada visual potencial, pergunte: **"isso ensina algo que texto não ensina?"**

Se a resposta não for um "sim" claro, não crie.

- Um diagrama de estados de container Docker *ensina* — ver transições é melhor que ler sobre elas
- Um CarouselCard de "o que é ref()" repetindo o texto *não ensina* — é redundância com estilo
- Um CodeStepper de optimistic update *ensina* — o estado mutando em tempo real não existe em texto
- Um SequenceDiagram de fluxo OAuth *ensina* — a sequência temporal entre atores não é óbvia em texto

**Sinais de visual desnecessário:**
- Repete o que já está nos `diagrams` do .ts
- É uma lista com ícones — texto com estilo, não visualização
- Poderia ser substituído por um parágrafo sem perda de compreensão
- Existe só para "ter um visual de X" sem que X precise de visualização

**Sinais de visual essencial:**
- Mostra fluxo temporal (ciclo de vida, sequência, estados e transições)
- Compara opções em múltiplas dimensões simultaneamente
- Permite exploração interativa que revela detalhes progressivamente
- Mostra algo que só existe em hierarquia, rede ou espaço

**Perguntas para calibrar quantidade:**
- Quantos conceitos desta skill são genuinamente difíceis de entender em texto?
- Para quais desses conceitos um visual interativo faria diferença real na compreensão?
- Quantos desses conceitos já estão cobertos pelos `diagrams` do .ts?
- O número que sobrar é o número certo — pode ser 3, pode ser 14.

### Decisão editorial por PDF

Para cada PDF potencial, pergunte: **"alguém tiraria isso para estudar no papel ou revisar antes de entrevista?"**

Se a resposta não for um "sim" claro, não crie.

- Q&A Review: sempre faz sentido se o conteúdo tem ≥15 Q&As boas
- Cheatsheet: faz sentido para ferramentas com sintaxe extensa (Docker, kubectl, git, SQL)
- Quick Ref: faz sentido para CLIs com muitos subcomandos (aws, docker, terraform) — é o PDF mais valioso para ferramentas
- Mnemonics: faz sentido se a skill tem conceitos abstratos difíceis de memorizar (Vue reatividade, Clean Arch camadas)
- Antipatterns: faz sentido se os erros são frequentes e têm consequências graves
- Comparative: faz sentido se há trade-offs reais entre opções que o dev vai precisar defender em entrevista
- Mindmap: faz sentido como revisão de ecossistema para skills **muito amplas** (AWS, React) — não para ferramentas

**Sinais de PDF desnecessário:**
- É uma cópia do conteúdo da skill page com outra formatação
- O tipo não encaixa na natureza da skill (Mnemonics para Docker que é prática, Mindmap para biblioteca pequena)
- Outro PDF da mesma skill já cobre o mesmo terreno
- Seria substituído por uma busca no Google em 5 segundos

**A pergunta final:** *"Se eu fosse estudar essa skill do zero até a entrevista, eu usaria isso?"* Se a resposta for "talvez", corte.

---

## Visão geral do processo

O processo tem 5 fases sequenciais. **Não pule nenhuma e não inverta a ordem.**

```
1. LEITURA       → entender o estado atual antes de escrever qualquer linha
2. CONTEÚDO      → enriquecer o .ts até score 10/10 — OBRIGATÓRIO antes de visuais
3. VISUAIS       → criar *Visuais.tsx com os visuais interativos premium
4. PDFs          → criar *Pdfs.tsx com os guias de bolso offline
5. VERIFICAÇÃO   → TypeScript + atualização de registros + generate-meta.js
```

### ⚠️ REGRA CRÍTICA: conteúdo antes de visuais

**Nunca crie Visuais.tsx ou Pdfs.tsx para uma skill com score < 10.**

Visuais e PDFs são camadas premium em cima de conteúdo rico. Sem conteúdo rico, os visuais ficam sem contexto e os PDFs ficam rasos. A ordem é inegociável:

1. Verifique o score no `meta.ts`
2. Se score < 10: complete o `.ts` primeiro (FASE 2 completa)
3. Só depois avance para FASE 3 (Visuais) e FASE 4 (PDFs)

**Score 10/10 significa todos estes campos presentes e completos:**
- `interview`: ≥20 Q&As com `level`, `a` em HTML rico, `tip` acionável — mínimo metade `senior`
- `diagrams`: ≥3 diagramas HTML/CSS inline com prefix CSS único por skill
- `mnemonics`: ≥3 itens `{ label, trick, explanation }`
- `cheatsheet`: presente — DiagramBlock denso e escaneável
- `mindmap`: presente — DiagramBlock mostrando o ecossistema completo da skill
- `exercises`: ≥3 itens com `level` e `concepts: string[]`
- `videos`: ≥4 itens com URLs reais
- `resources`: ≥5 itens com URLs reais
- `codeExamples`: ≥3 itens com código real e útil

**Qualidade dos Q&As — padrão mínimo:**
- Resposta em HTML rico: `<strong>`, `<code>`, `<ul><li>`, `<br>` conforme necessário
- Profundidade real: trade-offs, edge cases, comportamento interno — não definições básicas
- `tip` acionável: "Comece pelo problema X, mencione Y, demonstre conhecimento de Z"
- Perguntas nível `senior` devem cobrir: performance, segurança, casos extremos, decisões arquiteturais

---

## FASE 1 — Leitura obrigatória antes de qualquer código

Leia nesta ordem, sem pular:

### 1.1 — meta.ts
```
src/data/content/meta.ts
```
Entenda o estado atual da skill: `score`, `qaCount`, `diagrams`, `mnemonics`, `hasCheatsheet`, `hasMindmap`, `exercises`, `videos`, `resources`, `codeExamples`, `hasVisuais`, `visualsCount`, `hasPdfs`, `pdfsCount`.

Isso diz o que já existe e o que falta.

### 1.2 — skills.ts
```
src/data/skills.ts
```
Verifique: nome exato da skill, domínio, prioridade (P1/P2/P3), ícone CDN, cor. Se a skill não tiver entrada, adicione antes de prosseguir (ver seção "Adicionar skill ao skills.ts").

### 1.3 — tech-identity.ts
```
src/data/tech-identity.ts
```
Leia `primaryColor`, `secondaryColor`, `bgTint`, `personality`, `visualStyle` da skill. Esses valores definem a paleta de cores de todos os visuais e PDFs.

### 1.4 — Este arquivo inteiro
Você está fazendo isso agora.

### 1.5 — Arquivo de conteúdo atual da skill
```
src/data/content/{domain}/{slug}.ts          ← skill flat
src/data/content/{domain}/{slug}/{slug}.ts   ← skill em pasta
```
Leia o que já existe. Entenda o que está incompleto.

### 1.6 — src/types/index.ts
Leia os tipos TypeScript do projeto. Especialmente `SkillContent`, `InterviewQA`, `Exercise`, `AntiPatternItem`, `MnemonicItem`. Isso evita erros de tipo que travam o build.

---

## FASE 2 — Conteúdo da skill (.ts)

O objetivo desta fase é levar o `.ts` a score 10/10 antes de qualquer visual ou PDF. Leia o que já existe, identifique o que está faltando ou fraco, e complete/reescreva com profundidade real. Conteúdo mediano não vira score 10 — reescreva Q&As rasos, substitua diagramas genéricos, aprofunde exercícios superficiais.

### O que fazer em cada campo

**`interview` — Q&As de entrevista**
- Alvo: ≥20 perguntas, mínimo metade `senior`
- Cada `a` em HTML rico: `<strong>`, `<code>`, `<ul><li>`, `<br>` — não texto plano
- `tip` sempre presente e acionável: o que mencionar primeiro, o que aprofundar, o que demonstra senioridade
- Perguntas devem cobrir: conceitos fundamentais (pleno), trade-offs e decisões arquiteturais (sênior), edge cases e comportamento interno (sênior), erros comuns e como evitar (ambos)
- **`InterviewQA` NÃO tem campo `bullets`** — todo conteúdo vai dentro de `a` como HTML

**`diagrams` — diagramas HTML/CSS**
- Alvo: ≥3 diagramas interativos ou ilustrativos
- HTML/CSS inline dentro de DiagramBlock — não SVG externo
- Usar prefix CSS único por skill (`.ec2-`, `.prisma-`) para não vazar estilos globais
- Cada diagrama deve mostrar algo que texto não mostra bem: fluxos, hierarquias, comparações visuais

**`mnemonics` — mnemônicos de memorização**
- Alvo: ≥3 itens `{ label, trick, explanation }`
- `trick`: a âncora verbal (acrônimo, rima, analogia)
- `explanation`: o que cada letra/parte representa com contexto real

**`cheatsheet` — referência densa**
- Uma `DiagramBlock` com HTML/CSS compacto e escaneável
- Deve substituir a consulta à documentação para os 80% dos casos mais comuns
- Sintaxes, comandos, padrões, regras — tudo numa tela

**`mindmap` — ecossistema visual**
- Uma `DiagramBlock` mostrando o mapa mental completo da skill
- Categorias, subcategorias, relações entre conceitos
- Útil para revisão rápida antes de entrevista

**`exercises` — exercícios práticos**
- Alvo: ≥3 itens com `level: 'iniciante' | 'intermediario' | 'senior'`
- **`concepts: string[]` é obrigatório** — lista os conceitos exercitados
- Exercícios reais que alguém pode fazer: não "leia sobre X", mas "implemente Y que faz Z"

**`codeExamples` — exemplos de código**
- Alvo: ≥3 itens `{ title, code, language }`
- Código real, comentado quando necessário, que demonstra o conceito com contexto
- Preferir exemplos que mostram padrão correto + por que funciona

**`videos` e `resources`**
- ≥4 vídeos e ≥5 recursos com URLs reais e verificadas
- Priorizar: documentação oficial, canais reconhecidos, artigos técnicos profundos

### Armadilhas de tipo comuns

```ts
// ❌ InterviewQA não tem bullets
{ q: '...', a: '...', bullets: ['...'] }

// ✅ correto — bullets como HTML dentro de a
{ q: '...', a: '<p>...</p><ul><li>...</li></ul>', tip: '...' }

// ❌ Exercise sem concepts
{ title: '...', description: '...', level: 'senior' }

// ✅ correto
{ title: '...', description: '...', level: 'senior', concepts: ['hooks', 'closure'] }

// ❌ AntiPatternItem com string
{ name: '...', badCode: 'const x = 1', goodCode: 'const x = 1' }

// ✅ correto — CodeToken[]
{ name: '...', badCode: [{ text: 'const x = 1', color: '#ef4444' }], goodCode: [...] }
```

### Adicionar skill ao skills.ts

Se a skill ainda não tem entrada em `src/data/skills.ts`:
- Definir `slug`, `name`, `domain`, `priority` (P1/P2/P3)
- Definir `icon`: `[slugSimpleIcons, hexColor]` — o slug **deve existir** no Simple Icons CDN (`https://cdn.simpleicons.org/{slug}`)
- Verificar o slug antes: slugs que não existem causam 404 silencioso. Alternativas comuns: `nodedotjs` (não `nodejs`), `sonar` (não `sonarqube`), `testinglibrary` (não `playwright`)
- Colocar `onError` em toda `<img>` de ícone para esconder 404s

### Estrutura de arquivos por skill

**Skill flat** (sem visuais/PDFs ainda):
```
src/data/content/{domain}/{slug}.ts
```

**Skill com visuais/PDFs** — converter para pasta:
```bash
mkdir src/data/content/{domain}/{slug}
mv src/data/content/{domain}/{slug}.ts src/data/content/{domain}/{slug}/{slug}.ts
```
Atualizar import em `src/data/content/{domain}/index.ts`:
```ts
// antes:
export { skill } from './{slug}'
// depois:
export { skill } from './{slug}/{slug}'
```

---

## FASE 3 — Visuais (*Visuais.tsx)

### O que são os visuais

São peças premium de aprendizado visual na rota `/skill/{slug}/visuais`. São **diferentes** dos `diagrams` da skill page — não são HTML/CSS estático, são componentes React interativos com hover, click, animação, estado local.

Desktop only — sem preocupação com mobile.

### Estrutura do arquivo

```tsx
'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { ConceptCarousel } from '@/components/visuals/ConceptCarousel'
import type { Slide } from '@/components/visuals/ConceptCarousel'
// ... outros imports

// ── Paleta da tech ─────────────────────────────────────────────────────────────
const C      = '#HEXCOR'   // cor primária — puxar de tech-identity.ts
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'

export default function NomeSkillVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'visual-1',
      title: 'Título',
      subtitle: 'Subtítulo descritivo',
      accent: C,
      component: (
        <ConceptCarousel slides={SLIDES} accentColor={C} bgColor={BG} cardColor={CARD} />
      ),
    },
    // ...
  ]

  return (
    <VisuaisShell
      visuals={visuals}
      active={active}
      onChange={setActive}
      currentAccent={visuals[active].accent}
      currentSubtitle={visuals[active].subtitle}
    />
  )
}
```

### Visuais 100% custom

Quando nenhum componente genérico serve, criar funções internas no próprio arquivo:

```tsx
function AccessibilityTreeVisual() {
  const [selected, setSelected] = useState<string | null>(null)
  // implementação local, sem exportar
  return <div>...</div>
}
```

Ver `HtmlVisuais.tsx` como referência — usa vários componentes locais custom.

### Critério de qualidade por visual

Cada visual deve:
- Ter interatividade (hover, click, seleção) — visuais puramente estáticos não valem
- Ser auto-explicativo — tooltip ou painel de detalhes que explica o que o usuário vê
- Usar exclusivamente as cores da paleta da tech (`C`, `BG`, `CARD`, etc.) — nunca importar cores de outra skill
- Ser didático antes de ser bonito — o aprendizado vem primeiro
- Ter `id` único dentro da skill (string sem espaços, estilo kebab-case)

### Componentes de visuais disponíveis

Todos em `src/components/visuals/`. Catálogo completo com props em `src/components/index.ts`.

**Mais usados (battle-tested):**

| Componente | Melhor para |
|-----------|-------------|
| `VisuaisShell` | Wrapper obrigatório — nav de tabs + painel ativo |
| `ConceptCarousel` | Conceitos encadeados com ilustração ReactNode + texto estruturado |
| `LayerStack` | Arquitetura em camadas, cascade, hierarquias verticais |
| `StateMachineExplorer` | Estados e transições interativas (lifecycle, conexões, flexbox) |
| `CardCarousel` | Comparar APIs: nome, assinatura, quando usar / não usar |
| `CodeStepper` | Execução passo a passo com estado de variáveis visível |
| `AntiPatternsGallery` | Diff visual errado × correto com explicação técnica |
| `DecisionTree` | "Qual opção usar?" — árvore sim/não com recomendação final |
| `VersionTimeline` | Evolução de versões com mudanças por release |
| `ComparisonTable` | Tabela X vs Y com destaque de vencedor por critério |
| `ProConMatrix` | Prós e contras ponderados com pontuação final |
| `FeaturesCarousel` | Novidades before/after, migrações, comparações de API |
| `HookTimeline` | Timeline horizontal de fases com código por fase |
| `DiffViewer` | Diff lado a lado com highlight de linhas +/- |
| `TreeExplorer` | Árvore clicável com painel de detalhes (Fiber, DOM, AST) |
| `ReRenderSimulator` | Propagação animada de re-renders por cenário |
| `PriorityPanel` | Conceitos agrupados por prioridade (essencial/importante/bônus) |
| `ProgressionMap` | Jornada em níveis (junior → especialista) com conceitos por nível |

**Disponíveis e não usados ainda — prontos para usar:**

| Componente | Melhor para |
|-----------|-------------|
| `SequenceDiagram` | Trocas de mensagens entre atores no tempo — UML sequence (GraphQL, WebSocket, auth flows, TCP) |
| `HeatMap` | Grid de intensidade — complexidade por operação, custo de query, distribuição de métricas |
| `FlowDiagram` | Processos, pipelines, sequências de decisão com nós e arestas |
| `RequestResponseFlow` | HTTP/REST simples — request/response animado entre cliente/servidor |
| `ArchitectureDiagram` | Microservices, monolitos, sistemas distribuídos |
| `Speedometer` | Métricas de performance, benchmarks, limites de SLO |
| `DataFlowSankey` | Transformações de dados, ETL, volume entre nós |
| `QueryVisualizer` | Plano de execução SQL/NoSQL com custo por nó |
| `CommandPalette` | Referência de CLI estilo VS Code com busca e categorias |
| `RegexPlayground` | Regex interativo com highlight de matches em tempo real |
| `GanttTimeline` | Planos de projeto, releases, roadmaps |
| `EventTimeline` | Histórico cronológico com cards de detalhes |
| `MemoryDiagram` | Heap e stack animados, garbage collection, closures |
| `DataStructureAnimator` | Array, linked list, stack, queue, tree, graph animados |
| `BigOChart` | Curvas de complexidade Big-O com algoritmos marcados |
| `MindMap` | Mind map interativo com pan/zoom e nós expansíveis |
| `ConceptWeb` | Grafo force-directed de dependências entre conceitos |
| `WordCloud` | Nuvem de termos por importância/frequência |
| `AttackVectorDiagram` | Vetores de ataque, CVSS, fluxo de exploração |
| `AuthFlowAnimator` | OAuth2, JWT, SAML — fluxo de autenticação passo a passo |
| `NetworkTopology` | VPCs, firewalls, zonas de rede, topologia de infra |
| `CloudArchitecture` | Serviços AWS/GCP/Azure com regiões e conexões |
| `ScalingSimulator` | Escalonamento horizontal vs vertical com gráficos |
| `PipelineVisualizer` | CI/CD com estágios, jobs, artefatos e tempo de execução |
| `ContainerDiagram` | Docker Compose, Kubernetes — containers, volumes, redes |
| `IndexExplorer` | B-tree animado com busca para índices de banco |
| `BurndownChart` | Progresso de estudo: linha ideal vs real |

**Se nenhum serve:** criar novo componente em `src/components/visuals/`, parametrizar completamente (sem hardcode da skill), adicionar no `VISUAL_CATALOG` de `src/components/index.ts`. Fica disponível para todas as skills a partir daí.

---

## FASE 4 — PDFs (*Pdfs.tsx)

### O que são os PDFs

São guias de bolso offline na rota `/skill/{slug}/pdfs`. Não são cópia da skill page — são artefatos de revisão cognitiva pensados para estudo espaçado, memorização e revisão rápida fora do computador.

Gerados via `@react-pdf/renderer` para download real como `.pdf`.

### Estrutura do arquivo

```tsx
'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
// ... outros builders

const C = '#HEXCOR'  // cor da tech — NUNCA omitir, o default é cyan React

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As N perguntas mais cobradas em entrevista',
    type: 'qa',
    pages: 9,
    description: 'Descrição do que o PDF cobre...',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  // ... outros cards
]

const QAS: QAItem[] = [ /* dados das perguntas */ ]

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({ qa: QAS, accentColor: C, skillName: 'Nome', stackLabel: 'Domínio' }),
  // ...
}

export default function NomeSkillPdfs() {
  const [open, setOpen] = useState<PdfCard | null>(null)
  const hero = PDF_CARDS[0]
  const rest = PDF_CARDS.slice(1)
  return (
    <>
      <HeroCard card={hero} accent={C} onClick={() => setOpen(hero)} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 16 }}>
        {rest.map(c => <CollectionCard key={c.id} card={c} accent={C} onClick={() => setOpen(c)} />)}
      </div>
      {open && <PdfModal card={open} onClose={() => setOpen(null)} builders={PDF_BUILDERS} />}
    </>
  )
}
```

### Regra crítica de cores

**Sempre** passe `accent={C}` explicitamente. O default `'#61DAFB'` (cyan React) vaza para qualquer skill que omitir:

```tsx
// ❌ errado — herda cyan do React
<HeroCard card={hero} onClick={() => setOpen(hero)} />

// ✅ correto
<HeroCard card={hero} accent={C} onClick={() => setOpen(hero)} />
```

### Builders de PDF disponíveis

**Usados nas skills de referência:**

| Builder | `PdfType` | Melhor para |
|---------|-----------|-------------|
| `buildQAReviewPdf` | `'qa'` | Q&As de entrevista: nível pleno/sênior, HTML rico, dica |
| `buildCheatsheetPdf` | `'cheatsheet'` | Referência densa — sintaxes, comandos, patterns numa página |
| `buildMnemonicsPdf` | `'mnemonics'` | Cartões: truque verbal + expansão + âncora cognitiva |
| `buildAntipatternsPdf` | `'antipatterns'` | Diff errado × correto com `CodeToken[]` para highlight |
| `buildMindmapPdf` | `'mindmap'` | Mind map com categorias (essencial/avançado) + checklist |
| `buildComparativeRefPdf` | `'comparative'` | Tabela X vs Y com critérios e cenários recomendados |
| `buildPatternsPdf` | `'patterns'` | Catálogo de design patterns: intent, quando usar, código |
| `buildCommandRefPdf` | `'commands'` | Referência de CLI por categoria com flags e exemplos |
| `buildErrorRefPdf` | `'errors'` | Erros comuns: mensagem, causa, solução, diff |
| `buildRecipeBookPdf` | `'recipe'` | Cookbook: receitas práticas com passos e variações |
| `buildQuickRefPdf` | `'quick-ref'` | Cartão de bolso ultra-compacto — A4 landscape, 2-3 colunas (ótimo para CLIs e ferramentas) |

**Disponíveis e não usados ainda:**

| Builder | `PdfType` | Melhor para |
|---------|-----------|-------------|
| `buildGlossaryPdf` | `'glossary'` | Termos A-Z com pronúncia, definição e relacionados |
| `buildInterviewSimPdf` | `'interview-sim'` | Simulado sem resposta visível — espaço para escrever à mão |
| `buildStudyPlanPdf` | `'study-plan'` | Plano de estudos por semanas com checkpoints |
| `buildSecurityChecklistPdf` | `'security'` | Checklist CWE/OWASP com severidade e testabilidade |

### Critério de quais PDFs incluir

Não é automático — decidir com base em:
- O conteúdo da skill justifica? (se `mnemonics` são fracos, não inclua Mnemônicos PDF)
- A complexidade da skill pede? (skill simples pode ter só CheatSheet + Q&A)
- O que faria mais diferença pra quem está revisando aquela skill especificamente?

---

## FASE 5 — Verificação completa

Esta fase é **obrigatória e não pode ser abreviada**. Cada passo deve passar antes de considerar a skill entregue.

### 5.1 — TypeScript

```bash
npx tsc --noEmit
```

Zero erros. Qualquer erro deve ser corrigido antes de prosseguir. Erros mais comuns:
- `bullets` em `InterviewQA` — não existe, mover para `a` como HTML
- `concepts` faltando em `Exercise`
- `badCode`/`goodCode` como string em `AntiPatternItem` — deve ser `CodeToken[]`
- Tipos de PDF inexistentes na union `PdfType` — adicionar em `src/components/pdfs/types.ts`

### 5.2 — Atualizar registros (OBRIGATÓRIO)

Após criar os arquivos, atualizar **todos** os registros abaixo. Nenhum é opcional:

#### src/data/skill-components.ts
Adicionar a skill nos dois registries:
```ts
export const VISUAL_REGISTRY = {
  // ...existentes...
  'nome-skill': dynamic(() => import('@/data/content/{domain}/{slug}/{Slug}Visuais'), { ssr: false }),
}
export const PDF_REGISTRY = {
  // ...existentes...
  'nome-skill': dynamic(() => import('@/data/content/{domain}/{slug}/{Slug}Pdfs'), { ssr: false }),
}
```

#### src/components/index.ts
Para cada componente genérico usado nos `*Visuais.tsx` e `*Pdfs.tsx`, adicionar o slug da skill no array `usedBy`:
```ts
ConceptCarousel: {
  // ...
  usedBy: ['react', 'typescript', 'css', 'html', 'typeorm', 'nome-skill'],  // ← adicionar aqui
},
```

#### src/data/content/meta.ts (via script)
```bash
node scripts/generate-meta.js
```
Verificar que a skill aparece com `hasVisuais: true`, `hasPdfs: true`, `visualsCount` e `pdfsCount` corretos.

### 5.3 — Playwright (testes automatizados)

Criar (ou atualizar) o arquivo de testes em `tests/skill-{slug}.spec.ts`.

**Estrutura base:**

```ts
import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:3000'
const SLUG = 'nome-skill'

test.describe('skill/{slug}', () => {

  // ── Página principal ───────────────────────────────────────────────────────
  test('página principal carrega', async ({ page }) => {
    await page.goto(`${BASE}/skill/${SLUG}`)
    await expect(page).not.toHaveURL(/error/)
    await expect(page.locator('h1')).toBeVisible()
  })

  test('aba Interview tem Q&As', async ({ page }) => {
    await page.goto(`${BASE}/skill/${SLUG}`)
    await page.getByRole('button', { name: /interview/i }).click()
    const questions = page.locator('[data-qa-item]')
    await expect(questions.first()).toBeVisible()
  })

  test('aba Diagrams tem itens', async ({ page }) => {
    await page.goto(`${BASE}/skill/${SLUG}`)
    await page.getByRole('button', { name: /diagram/i }).click()
    await expect(page.locator('[data-diagram]').first()).toBeVisible()
  })

  test('aba Exercises tem exercícios', async ({ page }) => {
    await page.goto(`${BASE}/skill/${SLUG}`)
    await page.getByRole('button', { name: /exerc/i }).click()
    await expect(page.locator('[data-exercise]').first()).toBeVisible()
  })

  // ── Visuais ────────────────────────────────────────────────────────────────
  test('página /visuais carrega sem erro', async ({ page }) => {
    await page.goto(`${BASE}/skill/${SLUG}/visuais`)
    await expect(page).not.toHaveURL(/error/)
    await expect(page.locator('[data-visuais-shell]')).toBeVisible()
  })

  test('todos os visuais navegam sem erro', async ({ page }) => {
    await page.goto(`${BASE}/skill/${SLUG}/visuais`)
    const tabs = page.locator('[data-visual-tab]')
    const count = await tabs.count()
    expect(count).toBeGreaterThan(0)
    for (let i = 0; i < count; i++) {
      await tabs.nth(i).click()
      await expect(page.locator('[data-visual-panel]')).toBeVisible()
      // sem console errors críticos
    }
  })

  test('visuais não têm overflow visível', async ({ page }) => {
    await page.goto(`${BASE}/skill/${SLUG}/visuais`)
    const panel = page.locator('[data-visual-panel]')
    const box = await panel.boundingBox()
    expect(box).not.toBeNull()
    // painel tem altura razoável (não colapsou)
    expect(box!.height).toBeGreaterThan(100)
  })

  // ── PDFs ───────────────────────────────────────────────────────────────────
  test('página /pdfs carrega sem erro', async ({ page }) => {
    await page.goto(`${BASE}/skill/${SLUG}/pdfs`)
    await expect(page).not.toHaveURL(/error/)
    await expect(page.locator('[data-hero-card]')).toBeVisible()
  })

  test('abrir modal de PDF não quebra', async ({ page }) => {
    await page.goto(`${BASE}/skill/${SLUG}/pdfs`)
    await page.locator('[data-hero-card]').click()
    await expect(page.locator('[data-pdf-modal]')).toBeVisible()
    // modal fecha
    await page.keyboard.press('Escape')
    await expect(page.locator('[data-pdf-modal]')).not.toBeVisible()
  })

  test('todos os PDF cards abrem modal', async ({ page }) => {
    await page.goto(`${BASE}/skill/${SLUG}/pdfs`)
    const cards = page.locator('[data-collection-card]')
    const count = await cards.count()
    for (let i = 0; i < count; i++) {
      await cards.nth(i).click()
      await expect(page.locator('[data-pdf-modal]')).toBeVisible()
      await page.keyboard.press('Escape')
    }
  })

})
```

**Rodar os testes:**
```bash
# garantir que o dev server está rodando
npm run dev &

# rodar os testes da skill
npx playwright test tests/skill-{slug}.spec.ts

# se houver falhas, corrigir o código e re-rodar até passar
npx playwright test tests/skill-{slug}.spec.ts --reporter=list
```

**Ciclo de correção Playwright:**
1. Rodar os testes
2. Para cada falha, identificar a causa (elemento não encontrado, overflow, erro de JS, etc.)
3. Corrigir no código-fonte
4. Re-rodar **todos** os testes da skill (não só o que falhou — uma correção pode quebrar outro)
5. Repetir até zero falhas

**Não entregue com testes falhando.** Se um teste for impossível de fazer passar por limitação do ambiente (ex: PDF rendering só funciona em browser real), documente com `test.skip()` e comentário explicando.

### 5.4 — Verificação visual no browser

Com o dev server rodando (`npm run dev`), verificar manualmente:

**Página principal** (`/skill/{slug}`):
- [ ] Título e subtítulo corretos, sem texto truncado
- [ ] Ícone da tech aparece (ou está escondido corretamente via `onError`)
- [ ] Aba Interview: Q&As expandem, nível (pleno/sênior) aparece, tip visível
- [ ] Aba Diagrams: diagramas renderizam sem overflow, CSS não vaza para outros elementos
- [ ] Aba Cheatsheet: conteúdo denso e legível
- [ ] Aba Mindmap: mapa mental renderiza corretamente
- [ ] Aba Exercises: exercícios listados com nível visível
- [ ] Aba Resources: links abrem corretamente
- [ ] Aba Code Examples: código com syntax highlight

**Página de visuais** (`/skill/{slug}/visuais`):
- [ ] Nav de tabs carrega com todos os títulos
- [ ] Cada visual renderiza sem overflow ou layout quebrado
- [ ] Interatividade funciona (hover, click, seleção)
- [ ] Scrollbar fino e discreto (não ocupa espaço visual)
- [ ] Cores da tech usadas — não há cyan React `#61DAFB` ou vermelho React em skills que não são React
- [ ] Tooltips aparecem no hover quando aplicável

**Página de PDFs** (`/skill/{slug}/pdfs`):
- [ ] HeroCard aparece com cor correta da tech
- [ ] CollectionCards aparecem com cor correta
- [ ] Clicar no HeroCard abre modal
- [ ] Clicar nos CollectionCards abre modal
- [ ] Modal renderiza o PDF (pode demorar alguns segundos — é normal)
- [ ] Botão de download funciona
- [ ] Fechar modal (ESC ou X) funciona sem deixar overlay preso

### 5.5 — Checklist final de arquivos atualizados

Antes de considerar entregue, confirmar que **todos** estes arquivos foram atualizados:

```
[ ] src/data/content/{domain}/{slug}/{slug}.ts       ← conteúdo enriquecido, score 10/10
[ ] src/data/content/{domain}/{slug}/{Slug}Visuais.tsx  ← visuais criados
[ ] src/data/content/{domain}/{slug}/{Slug}Pdfs.tsx     ← PDFs criados
[ ] src/data/content/{domain}/index.ts               ← import atualizado se skill virou pasta
[ ] src/data/skill-components.ts                     ← VISUAL_REGISTRY e PDF_REGISTRY
[ ] src/components/index.ts                          ← usedBy de cada componente genérico usado
[ ] src/data/content/meta.ts                         ← regenerado via node scripts/generate-meta.js
[ ] tests/skill-{slug}.spec.ts                       ← testes Playwright passando
```

---

## Skills de referência — calibrar o nível

Cinco skills estão completamente implementadas. Use-as para entender o nível esperado:

| Skill | Visuais | PDFs | Conteúdo |
|-------|---------|------|----------|
| React | 9 | 5 | 141KB |
| TypeScript | 11 | 8 | 73KB |
| CSS | 12 | 6 | 82KB |
| HTML | 11 | 5 | 71KB |
| TypeORM | 9 | 7 | 87KB |

**React** (`src/data/content/frontend/react/`) — referência de visuais de componente/runtime  
**TypeScript** — referência de visuais de linguagem/tipos com CodeStepper intensivo  
**CSS** — referência de skill com muitos visuais de conceitos abstratos  
**HTML** — referência de visuais custom (componentes locais, sem genérico)  
**TypeORM** — referência de skill de ferramenta/ORM com Recipe Book e CLI ref  

---

## Identidade visual por tech

Definida em `src/data/tech-identity.ts`. Sempre consultar antes de criar visuais/PDFs.

- `primaryColor` → usar como `C` e `accent` em todos os componentes
- `secondaryColor` → cor de suporte para destaques secundários
- `bgTint` → tint de fundo sutil
- `personality` → tipo: `component | server | data | infra | language | protocol | tool | concept`
- `visualStyle` → estilo sugerido: `cards | flow | tree | graph | layers | timeline | grid`

Cada skill deve ter paleta própria. Nunca copiar as constantes de cor de outra skill.

---

## Regras críticas — bugs que já aconteceram

- **`InterviewQA` não tem `bullets`** — conteúdo vai em `a` como HTML
- **`Exercise` exige `concepts: string[]`** — nunca omitir
- **`AntiPattern.wrong/right` são `CodeLine[][]`** (array de linhas, cada linha é `{text, color?}[]`) — não strings simples
- **`HeroCard`/`CollectionCard` exigem `accent={C}` explícito** — default é `#61DAFB` (cyan React)
- **`PdfType` union completa:** `'qa' | 'cheatsheet' | 'mnemonics' | 'antipatterns' | 'mindmap' | 'comparative' | 'patterns' | 'commands' | 'errors' | 'recipe' | 'quick-ref' | 'glossary' | 'interview-sim' | 'study-plan' | 'security'`
- **Ícones CDN** `https://cdn.simpleicons.org/{slug}/{hex}` — verificar slug antes; `onError` obrigatório em toda `<img>` de ícone
- **Pan/zoom SVG** — usar refs mutáveis + `setAttribute` direto no DOM, nunca React state para transform
- **CSS em diagrams** — usar prefixo único por skill (`.ts-`, `.css-`, `.html-`) para não vazar estilos globais
- **`'use client'`** em todo arquivo de visuais e PDFs — usam `useState`
- **Português com acentuação completa** — "não" nunca "nao", "você" nunca "voce", "função" nunca "funcao"
- **Layout de páginas** — `<Nav />` deve ficar FORA do div `.shell` ou `.shell-wide`
- **Caracteres especiais em JSX** — `<`, `>`, `{`, `}` dentro de texto JSX devem ser escapados: `&lt;`, `&gt;`, `{'{'}`, `{'}'}`. Nunca escrever `=>` literal em JSX — usar `=&gt;` ou mover para string fora do JSX
- **`unknown` em JSX** — a palavra reservada `unknown` do TypeScript não pode aparecer como texto JSX direto — usar `{'unknown'}`

---

## Referência de tipos — shapes exatos de cada componente visual

Leia esta seção antes de usar qualquer componente. Os erros de TypeScript mais comuns vêm de shapes errados.

### AntiPatternsGallery

```ts
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'
// CodeLine = { text: string; color?: string }[]   (uma linha = array de tokens)

type AntiPattern = {
  title: string
  wrong: CodeLine[]   // array de linhas; cada linha é array de tokens coloridos
  right: CodeLine[]
  why: string
}

// Exemplo correto:
const PATTERNS: AntiPattern[] = [{
  title: 'Não usar índice como key',
  wrong: [
    [{ text: 'items.map((item, i) =&gt; &lt;Li key={i} /&gt;)', color: '#ef4444' }],
  ],
  right: [
    [{ text: 'items.map(item =&gt; &lt;Li key={item.id} /&gt;)', color: '#22c55e' }],
  ],
  why: 'Índice como key quebra reconciliação quando a lista muda de ordem.',
}]
```

> **ATENÇÃO:** `wrong` e `right` são `CodeLine[][]` — não strings, não `CodeToken[]`. Cada item do array externo é uma linha; cada linha é um array de `{text, color?}`.

### ComparisonTable

```ts
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'

type ComparisonOption = {
  id: string
  label: string       // ← LABEL, não "name"
  sublabel?: string
  color?: string
  icon?: string
}

type ComparisonCriterion = {
  id: string
  label: string
  category?: string
  description?: string
  values: Record<string, {
    rating: 'excellent' | 'good' | 'fair' | 'poor' | 'na'
    note?: string
  }>
}

// Exemplo correto:
const OPTIONS: ComparisonOption[] = [
  { id: 'a', label: 'Opção A', color: '#3b82f6' },
  { id: 'b', label: 'Opção B', color: '#f59e0b' },
]
const CRITERIA: ComparisonCriterion[] = [{
  id: 'perf', label: 'Performance',
  values: {
    a: { rating: 'excellent', note: 'Zero overhead' },
    b: { rating: 'fair', note: 'Overhead de serialização' },
  },
}]
```

> **ATENÇÃO:** `ComparisonOption` usa `label` — nunca `name`. `values` é `Record<string, {rating, note?}>` — nunca string simples.

### HookTimeline (e CodeToken)

```ts
import { HookTimeline } from '@/components/visuals/HookTimeline'
import type { TimelinePhase, CodeToken } from '@/components/visuals/HookTimeline'

type CodeToken = { text: string; color?: string }

type TimelinePhase = {
  id: string
  emoji: string
  name: string
  color: string
  short: string
  detail: string
  code: CodeToken[][]   // array de linhas; cada linha é array de tokens
}
```

### ConceptCarousel

```ts
import { ConceptCarousel } from '@/components/visuals/ConceptCarousel'
import type { Slide } from '@/components/visuals/ConceptCarousel'

type Slide = {
  title: string
  paragraphs: string[]
  gradient: [string, string]
  illustration: React.ReactNode
}
```

### CardCarousel

```ts
import { CardCarousel } from '@/components/visuals/CardCarousel'
import type { CarouselCard } from '@/components/visuals/CardCarousel'

type CarouselCard = {
  name: string
  signature: string
  emoji: string
  color: string
  use: string[]
  dontUse: string
  difficulty?: 1 | 2 | 3
}
```

### LayerStack

```ts
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'

type Layer = {
  id: string
  label: string
  sublabel?: string
  description: string
  code?: string
  color: string
  icon?: string
  examples?: string[]
}
```

### StateMachineExplorer

```ts
import { StateMachineExplorer } from '@/components/visuals/StateMachineExplorer'
import type { SMState, SMTransition } from '@/components/visuals/StateMachineExplorer'

type SMState = {
  id: string
  label: string
  description?: string
  color?: string
  isInitial?: boolean
  isFinal?: boolean
}
type SMTransition = {
  from: string
  to: string
  event: string
  guard?: string
  code?: string
}
```

### DecisionTree

```ts
import { DecisionTree } from '@/components/visuals/DecisionTree'
import type { DTNode } from '@/components/visuals/DecisionTree'

type DTNode = {
  id: string
  question?: string
  recommendation?: string
  detail?: string
  children?: Array<{ label: string; nodeId: string; color?: string }>
  color?: string
  icon?: string
}
// uso: <DecisionTree root={ROOT_NODE} nodes={NODE_MAP} accentColor={C} ... />
// NODE_MAP é Record<string, DTNode> — inclui TODOS os nós exceto o root
```

### FeaturesCarousel

```ts
import { FeaturesCarousel } from '@/components/visuals/FeaturesCarousel'
import type { Feature } from '@/components/visuals/FeaturesCarousel'

type Feature = {
  tag: string
  name: string
  color: string
  before: string
  after: string
  desc: string
  beforeLabel?: string
  afterLabel?: string
}
```

### CodeStepper

```ts
import { CodeStepper } from '@/components/visuals/CodeStepper'
import type { CodeStepperScenario, CodeStep } from '@/components/visuals/CodeStepper'

type CodeStep = {
  lineStart: number
  lineEnd?: number
  title: string
  explanation: string
  output?: string
  callStack?: string[]
  memory?: Record<string, string>
}
type CodeStepperScenario = {
  id: string
  label: string
  code: string
  language?: string
  steps: CodeStep[]
}
```

### VersionTimeline

```ts
import { VersionTimeline } from '@/components/visuals/VersionTimeline'
import type { VersionMilestone } from '@/components/visuals/VersionTimeline'

type VersionMilestone = {
  id: string
  version: string
  year: string
  title: string
  description: string
  highlights: string[]
  breakingChanges?: string[]
  color?: string
  isLTS?: boolean
  isCurrent?: boolean
}
```

### DiffViewer

```ts
import { DiffViewer } from '@/components/visuals/DiffViewer'
import type { DiffExample } from '@/components/visuals/DiffViewer'

type DiffExample = {
  id: string
  label: string
  description?: string
  beforeLabel?: string
  afterLabel?: string
  before: string
  after: string
  explanation?: string
  tags?: string[]
}
```

### ProConMatrix

```ts
import { ProConMatrix } from '@/components/visuals/ProConMatrix'
import type { ProConOption, ProConItem } from '@/components/visuals/ProConMatrix'

type ProConItem = {
  text: string
  weight?: 'high' | 'medium' | 'low'
  context?: string[]
}
type ProConOption = {
  id: string
  label: string
  sublabel?: string
  color: string
  icon?: string
  pros: ProConItem[]
  cons: ProConItem[]
  bestFor?: string[]
  avoidWhen?: string[]
}
```

### TreeExplorer

```ts
import { TreeExplorer } from '@/components/visuals/TreeExplorer'
import type { TreeNode, TreeNodeTypeMeta } from '@/components/visuals/TreeExplorer'

type TreeNode = {
  id: string
  name: string
  type: string          // chave em typeMap
  props?: string[]
  state?: string[]
  children?: TreeNode[]
  tooltip: string
  tip?: string
}
type TreeNodeTypeMeta = {
  color: string
  label: string
  icon: string
  desc: string
}
// uso: <TreeExplorer tree={ROOT} typeMap={TYPE_MAP} accentColor={C} bgColor={BG} cardColor={CARD} card2Color={CARD2} />
```

### ProgressionMap

```ts
import { ProgressionMap } from '@/components/visuals/ProgressionMap'
import type { ProgressionLevel, Concept } from '@/components/visuals/ProgressionMap'

type Concept = { name: string; tip: string }
type ProgressionLevel = {
  id: string
  name: string
  label: string
  emoji: string
  concepts: Concept[]
}
```

### SequenceDiagram

```ts
import { SequenceDiagram } from '@/components/visuals/SequenceDiagram'
import type { SeqActor, SeqMessage, SeqGroup } from '@/components/visuals/SequenceDiagram'

type SeqActor  = { id: string; label: string; color?: string; icon?: string }
type SeqMessage = {
  from: string; to: string; label: string; note?: string
  type?: 'sync' | 'async' | 'return' | 'create' | 'destroy'
}
type SeqGroup  = { label: string; kind?: 'loop'|'alt'|'opt'|'par'|'ref'; fromMsg: number; toMsg: number; color?: string }
```

### HeatMap

```ts
import { HeatMap } from '@/components/visuals/HeatMap'
import type { HeatCell, HeatRowGroup } from '@/components/visuals/HeatMap'

type HeatCell    = { value: number; note?: string }
type HeatRowGroup = { label: string; rows: string[] }
// data[rowIndex][colIndex] = HeatCell
```
