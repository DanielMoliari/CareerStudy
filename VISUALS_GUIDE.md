# VISUALS_GUIDE — Guia para Agentes de Conteúdo

Este arquivo é a fonte de verdade para qualquer agente que for criar ou enriquecer conteúdo de skills.
Leia antes de fazer qualquer coisa em `src/data/content/`.

---

## Filosofia central

O objetivo do projeto é: **do zero ao perito, ou do zero à entrevista pleno/senior, só com esse conteúdo**.
Antes de entregar qualquer skill, responda mentalmente:
- "Alguém aprendendo do zero ficaria perito nisto só com esse conteúdo?" → deve ser SIM
- "Alguém aprendendo do zero passaria numa entrevista pleno/senior só com esse conteúdo?" → deve ser SIM

---

## Fluxo obrigatório ao implementar uma skill

1. Ler `src/data/content/meta.ts` — entender o estado atual de todas as skills (score, campos)
2. Ler `src/data/skills.ts` — nome, categoria, prioridade da skill
3. Ler `src/data/tech-identity.ts` — cor primária, personalidade visual, estilo visual da tech
4. Ler este arquivo (`VISUALS_GUIDE.md`) — critérios e padrões
5. Ler o arquivo de conteúdo da skill (`content/{domain}/{slug}.ts`) — o que já existe
6. Criar/enriquecer tudo de uma vez: conteúdo + PDFs + visuais
7. Rodar `node scripts/generate-meta.js` para atualizar `meta.ts`
8. Rodar `npx tsc --noEmit` para confirmar zero erros TypeScript

---

## Estrutura de arquivos por skill (após reestruturação)

> ⚠️ A reestruturação ainda não foi feita para todas as skills — está em stand-by.
> Quando feita, cada skill terá uma pasta própria:

```
src/data/content/{domain}/{slug}/
  {slug}.ts          ← conteúdo textual (Q&As, mnemonics, cheatsheet, etc.)
  {Slug}Visuais.tsx  ← visuais premium específicos desta skill
  {Slug}Pdfs.tsx     ← PDFs específicos desta skill
```

Enquanto a reestruturação não acontece, os `.tsx` de visuais e PDFs ficam em:
```
src/components/visuals/{slug}/
src/components/pdfs/{slug}/
```

---

## Padrão de completude de conteúdo (score 10/10)

Campos obrigatórios no arquivo `.ts` da skill:
- `interview`: ≥20 Q&As com `level: 'pleno' | 'senior'`, resposta em HTML rico, `tip`
- `diagrams`: ≥3 itens HTML/CSS com prefix CSS único por skill
- `mnemonics`: ≥3 itens (`{label, trick, explanation}`)
- `cheatsheet`: presente (DiagramBlock com HTML/CSS)
- `mindmap`: presente (DiagramBlock com HTML/CSS)
- `exercises`: ≥3 itens (`level: iniciante | intermediario | senior`)
- `videos`: ≥4 itens (`{title, channel, url}`)
- `resources`: ≥5 itens (`{title, url, kind}`)
- `codeExamples`: ≥3 itens (`{title, code, language}`)

---

## PDFs — Guias de bolso para revisão offline

### Princípio
PDFs **não são cópia da skill page**. São artefatos de revisão cognitiva — pensados para estudo espaçado, memorização e revisão rápida fora do computador.

### Tipos disponíveis

| Tipo | Propósito cognitivo | Conteúdo |
|------|---------------------|----------|
| **Q&A Review** | Recuperação ativa | Os melhores Q&As da entrevista, bem estilizados — não como flashcard, mas como grade de perguntas com resposta estruturada visualmente |
| **CheatSheet** | Referência rápida | Comandos, padrões, sintaxes — tudo numa página densa e escaneável |
| **Mnemonics** | Não-esquecimento | Os truques e macetes com reforço visual — associações que grudam |
| **Anti-patterns** | Consolidação pelo negativo | O que não fazer, por quê, e o correto ao lado |
| **Mindmap** | Conexão de conceitos | O mapa mental da skill em alta qualidade visual |

### Critério de quais PDFs incluir
Não é automático por threshold. O agente decide com base em:
- O conteúdo disponível na skill (se tem mnemonics ricos, inclui Mnemonics PDF)
- A complexidade da skill (React tem todos; uma lib pequena pode ter só CheatSheet)
- O que faria mais diferença para quem está revisando aquela skill específica

### Implementação
- Renderizado via `@react-pdf/renderer` para download como `.pdf` real
- Acessado via página `/skill/[slug]/pdfs` — cards de PDFs disponíveis
- Clicar num card abre modal com preview do PDF + botão de download
- Visual rico, com identidade visual da tech (cores do `tech-identity.ts`)
- Amigável, característico, completo — não só texto corrido

---

## Visuais — Conteúdo premium de aprendizado

### Princípio
Os visuais da página `/skill/[slug]/visuais` são **diferentes** dos `diagrams` da skill page.
São peças premium de aprendizado visual — didáticas, interativas, com tooltips e explicações inline.
Desktop only — sem preocupação com mobile.

### Tipos possíveis (use o que fizer mais sentido para cada skill)
- **Grafo interativo** — conexões entre conceitos com pan/zoom
- **Árvore de componentes** — hierarquia visual (ótimo para React, Vue)
- **Diagrama de fluxo** — sequências, pipelines, ciclos de vida
- **Mapa mental** — conexões radiais entre conceitos
- **Camadas/stack** — arquitetura em camadas (ótimo para infra, auth)
- **Timeline** — evolução, lifecycle, sequência de eventos
- **Carrossel de slides** — passo a passo de um conceito
- **Comparação lado a lado** — bom vs ruim, antes vs depois
- **Animação de conceito** — CSS animation ou React state para mostrar algo acontecendo (ex: Event Loop)

### Componentes shared
Componentes genéricos e reutilizáveis ficam em:
```
src/components/visuals/shared/
src/components/pdfs/shared/
```

**Regra fundamental:** os componentes shared existentes (criados para o React) são ponto de partida, não limite.
Ao implementar uma nova skill, se ela precisar de um tipo de visual ou PDF que ainda não existe como shared:
1. Crie o novo componente shared genérico (parametrizado, sem hardcode da skill)
2. Use-o na skill nova
3. Retroativamente, qualquer skill que se beneficiar pode reutilizá-lo

A lista de shared cresce organicamente conforme novas skills são implementadas.
Nunca force uma skill a usar um componente que não se encaixa naturalmente no seu conteúdo.

Visuais específicos de uma skill ficam junto da skill (após reestruturação) ou em:
```
src/components/visuals/{slug}/
src/components/pdfs/{slug}/
```

### Critério de qualidade
Cada visual deve:
- Ter tooltips explicativos ao hover
- Ser auto-explicativo — alguém que não sabe o conceito deve entender olhando
- Usar as cores da identidade visual da tech (`tech-identity.ts`)
- Ser didático antes de ser bonito

---

## Identidade visual por tech

Cada skill tem uma identidade visual definida em `src/data/tech-identity.ts`:
- `primaryColor` — cor principal da tech
- `secondaryColor` — cor de suporte
- `bgTint` — tint de fundo sutil
- `textOnPrimary` — cor de texto sobre o fundo primário
- `personality` — tipo de tech (component, server, data, infra, language, protocol, tool, concept)
- `visualStyle` — estilo visual sugerido (cards, flow, tree, graph, layers, timeline, grid)

Use sempre ao criar visuais e PDFs para que cada skill tenha sua identidade visual própria.

---

## Nota sobre ChatGPT Image Generator

Possibilidade documentada mas não implementada:
- A OpenAI Images API (`gpt-image-1` / `dall-e-3`) poderia gerar ilustrações conceituais/metafóricas
- Fluxo: script Node local → chama API → salva PNGs em `public/visuals/{slug}/`
- Uso: apenas para ilustrações artísticas/metafóricas, NÃO para diagramas técnicos
- Diagramas técnicos (fluxos, grafos, arquitetura) devem ser feitos em SVG/HTML/React
- Implementar só se necessário após a estrutura manual estar madura

---

## React como skill de referência

React foi escolhido como a primeira skill a ter PDFs e visuais completos.
A estrutura e os padrões criados para o React servem de referência — não de limite.

Cada skill nova pode e deve:
- Criar novos tipos de visual que façam sentido para ela (não existe "apenas os tipos do React")
- Criar novos componentes shared que outras skills poderão reutilizar
- Ter uma quantidade diferente de PDFs (uma lib simples pode ter só 1, uma plataforma complexa pode ter 8)
- Ter um layout de página `/visuais` completamente diferente do React se o conteúdo pedir

O React é referência de **qualidade e profundidade**, não de estrutura rígida.
