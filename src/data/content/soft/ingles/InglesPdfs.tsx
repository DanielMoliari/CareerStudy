'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildCheatsheetPdf } from '@/components/pdfs/CheatsheetPdf'
import type { HookItem, RuleItem } from '@/components/pdfs/CheatsheetPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'
import { buildGlossaryPdf } from '@/components/pdfs/GlossaryPdf'
import type { GlossaryTerm } from '@/components/pdfs/GlossaryPdf'

// ── Paleta Inglês ─────────────────────────────────────────────────────────────
const C = '#22c55e'   // verde — identidade soft skill / inglês

// ── Metadados dos PDFs ────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas em entrevistas internacionais para devs brasileiros',
    type: 'qa',
    pages: 10,
    description: 'Respostas em inglês para situações reais: apresentar experiência, explicar decisões técnicas, dar/receber feedback, comunicar constraints, postmortem, disagreement, async updates e mais.',
    icon: '01',
    goal: 'Prática de fala',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet',
    subtitle: 'Templates de PR, Slack, code review e standup — copie e adapte',
    type: 'cheatsheet',
    pages: 3,
    description: 'Referência rápida: prefixos de code review (BSN), estrutura de PR description, template de Slack para incidentes, frases de reunião e regras de comunicação em times remotos.',
    icon: '02',
    goal: 'Templates prontos',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'REAL, BSN e BLUF — os três atalhos mentais para inglês técnico',
    type: 'mnemonics',
    pages: 2,
    description: 'Três mnemônicos: as quatro dimensões de desenvolvimento (REAL), os prefixos de code review (BSN) e a regra de comunicação assíncrona (BLUF).',
    icon: '03',
    goal: 'Memória de longo prazo',
  },
  {
    id: 'glossary',
    title: 'Glossário Técnico',
    subtitle: '30 termos essenciais que aparecem em toda entrevista ou reunião internacional',
    type: 'quick-ref',
    pages: 4,
    description: 'Vocabulário técnico de sistemas, performance, arquitetura e desenvolvimento — com contexto de uso e exemplos de frases para cada termo.',
    icon: '04',
    goal: 'Referência de vocabulário',
  },
]

// ── Dados: Q&A ────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'How would you describe your English proficiency for this role?',
    a: "I'm comfortable with technical English across reading, writing, and spoken communication. I read documentation, papers, and engineering blogs exclusively in English. In my current role I write all PRs, commit messages, and technical documents in English. In meetings I follow discussions well and contribute — I may occasionally ask for clarification on unfamiliar accents, but that's never been a blocker. My spoken English is functional and improving continuously through daily immersion.",
    tip: 'Seja honesto mas confiante. Foco no que consegue fazer, não no que não consegue. "Functional and improving" é a postura certa — ninguém espera perfeição.',
  },
  {
    level: 'Pleno',
    q: 'Can you walk me through a recent technical decision you made?',
    a: "Sure. We had an N+1 query problem in our listing endpoint — each item was triggering a separate database call, causing p99 latency to spike to 800ms under load. I identified it through query logging in staging. The fix was to replace lazy-loading with a single JOIN using our ORM's eager loading, which brought p99 down to 45ms. We added it to our test suite to prevent regression.",
    tip: 'Prepare 2–3 histórias de decisões técnicas reais com métricas concretas. Pratique em voz alta até fluir naturalmente.',
  },
  {
    level: 'Pleno',
    q: 'How do you handle technical disagreements with teammates?',
    a: "I try to separate the idea from the person — critique the approach, not the author. When I disagree, I make my reasoning explicit: what's the tradeoff I'm worried about, what's the evidence. If we can't reach consensus synchronously, I'll write up the options with explicit tradeoffs in an ADR and let the team decide asynchronously. I've learned that documenting the decision process matters as much as the decision itself.",
    tip: 'Demonstra maturidade. Entrevistador quer ver que você não evita conflito nem é combativo — você tem processo.',
  },
  {
    level: 'Pleno',
    q: "Tell me about a time your code caused a production incident.",
    a: "During a database migration, I missed that one of our services was still reading from the old column name. It caused a partial outage for about 15 minutes for a subset of users. We rolled back, added a compatibility layer to support both column names during transition, and redeployed over a weekend with proper monitoring. I then wrote a postmortem and we created a migration checklist that's now part of our deploy process.",
    tip: 'Ownership, ação concreta, aprendizado sistêmico. Nunca minimize ou culpe outros. Esta resposta demonstra maturidade de engenheiro.',
  },
  {
    level: 'Pleno',
    q: "Could you repeat that? / I didn't quite catch that.",
    a: "Of course — let me make sure I understood correctly. Are you asking about [restate what you understood]? I want to make sure I'm addressing the right question before diving in.",
    tip: 'Pedir para repetir ou confirmar é profissional, não fraqueza. Melhor confirmar do que responder a pergunta errada por 5 minutos.',
  },
  {
    level: 'Pleno',
    q: "What's your biggest weakness as an engineer?",
    a: "I tend to over-engineer solutions when I'm not under time pressure — I start seeing patterns and abstractions everywhere. I've been working on this by setting a rule for myself: I won't introduce an abstraction until I've seen the pattern at least three times in the actual codebase. It's made my code more pragmatic and my PRs easier to review.",
    tip: 'Fraqueza real + o que você faz para endereçar. Evite fraquezas fake ("sou perfeccionista"). Honestidade construtiva é valorizada.',
  },
  {
    level: 'Pleno',
    q: "How do you approach learning a new technology quickly?",
    a: "I start with the official docs to understand the core mental model — what problem it solves, what its constraints are. Then I build a minimal but real prototype that exercises the parts most relevant to my use case. I pay attention to what feels awkward or surprising — those are usually important design decisions. I also read the source code for any behavior that isn't clear from the docs.",
    tip: 'Demonstra autonomia e curiosidade de engenheiro. A menção a ler o source code é o detalhe que diferencia.',
  },
  {
    level: 'Pleno',
    q: "How do you introduce yourself to a new team?",
    a: "Hi everyone — I'm [Name], joining as [Role] on [Team]. I spent the last [X years] at [company] working primarily on [domain]. I'm particularly excited to work on [specific area] here because [genuine reason]. I'm still getting up to speed on the codebase, so I'll probably have a lot of questions — I'd love to schedule short 1:1s to understand each of your contexts. Looking forward to working together!",
    tip: 'Estrutura: quem sou → experiência relevante → o que me anima → postura de aprendizado → próximos passos. Natural e profissional.',
  },
  {
    level: 'Pleno',
    q: "How do you write a good PR description?",
    a: "A good PR description answers three questions before the reviewer looks at a single line: What changed? Why? How do I verify it? I add screenshots for UI changes, link to the issue or ADR, and call out the parts I'm most uncertain about. I also note what I've already considered and rejected, so reviewers don't spend time suggesting paths I've already evaluated.",
    tip: 'Proactively noting what you already considered and rejected is the detail that makes reviewers feel respected and saves everyone time.',
  },
  {
    level: 'Pleno',
    q: "How do you prioritize when you have multiple competing tasks?",
    a: "I use impact × urgency, but I also consider dependencies — what's blocking someone else is higher priority than what's blocking only me. I make my priority stack visible: 'working on X today, Y tomorrow — let me know if that doesn't match your expectations'. This surfaces misalignments early instead of discovering them at sprint end.",
    tip: 'Priorização visível e comunicada proativamente é o que os melhores colaboradores remotos fazem. Elimina surpresas.',
  },
  {
    level: 'Senior',
    q: "What's your approach to giving feedback in code reviews?",
    a: "I distinguish blockers from suggestions explicitly — 'Blocker: this will cause a data race under concurrent requests' vs 'Suggestion: consider extracting this for readability'. I explain the why, not just the what. I also recognize good patterns — 'nice approach here'. The goal is to make the author better, not just fix the PR. For bigger architectural concerns I start a separate conversation rather than burying it in inline comments.",
    tip: 'Em times remotos, review quality é visibilidade. Esta resposta demonstra que você eleva o time.',
  },
  {
    level: 'Senior',
    q: "How do you communicate technical constraints to non-technical stakeholders?",
    a: "I translate from technical to business impact. Instead of 'our database doesn't support horizontal writes', I say 'we can scale read capacity easily, but adding write capacity requires a 2-week migration'. I frame constraints as tradeoffs: 'we can ship in 2 weeks without caching, or in 4 weeks with caching that handles 10x the load'. I avoid jargon and use analogies when helpful.",
    tip: 'Habilidade que diferencia senior de staff. Você pensa em impacto, não só em implementação.',
  },
  {
    level: 'Senior',
    q: "How do you structure an async update about a production incident?",
    a: "TL;DR first with impact and status. Then: what happened, when, what we did, current status, next steps with owners and ETAs. The first message goes out within 15 minutes of detection, even if we don't fully understand the root cause — uncertainty is better communicated than silence. I use Slack for real-time updates and a doc for the full postmortem.",
    tip: 'TL;DR primeiro é o padrão universal em times globais. "Uncertainty is better than silence" demonstra maturidade em incidentes.',
  },
  {
    level: 'Senior',
    q: "Describe a situation where you had to push back on a product request.",
    a: "I was asked to ship a feature that required bypassing our input validation for speed. Instead of a flat no, I came back with: 'I can ship this in the timeline if we scope it to X, or I can ship the full version in Y weeks with proper validation. Here's what each means for security.' The team chose the slower path once they understood the risk.",
    tip: 'Pushback com opções e risco quantificado, não recusa. Demonstra ownership técnico e comunicação assertiva.',
  },
  {
    level: 'Senior',
    q: "How do you document architectural decisions for your team?",
    a: "I use ADRs — Architecture Decision Records. Each captures: context (what situation prompted the decision), the decision, alternatives considered, and consequences (what becomes easier and harder). I keep them short and in the repo alongside the code — no one reads a wiki that's three clicks away. The goal is for someone joining in a year to understand not just what we decided, but why.",
    tip: 'ADRs no repo (não em wiki separado) demonstra que você pensa em manutenibilidade e contexto para quem vem depois.',
  },
  {
    level: 'Senior',
    q: "How do you politely disagree with a proposal in a meeting?",
    a: "Depends on tone needed. Softly: 'That's an interesting approach — I wonder if we've considered [alternative].' Direct: 'I see it differently — my concern is [specific risk]. Can we explore [alternative]?' Escalating: 'I want to flag a concern before we commit — can we take 5 minutes on [tradeoff]?' The key is always being specific about the concern — 'I'm worried about X' lands much better than 'I don't think this is a good idea'.",
    tip: 'Específico sobre a preocupação. "I\'m worried about X" supera "I disagree". Sempre critique a ideia, não a pessoa.',
  },
  {
    level: 'Pleno',
    q: "How do you ensure your Slack messages are clear in an international team?",
    a: "BLUF — Bottom Line Up Front. I lead with the main point, not context. Bullet points for multi-part updates. Explicit about timezones ('by EOD my time — UTC-3'). I distinguish FYI from action-required, and name who needs to act ('Action needed: @john'). I avoid idioms that don't translate across cultures.",
    tip: 'BLUF é o padrão de comunicação assíncrona mais eficiente. Demonstra que você respeita o tempo dos colegas.',
  },
  {
    level: 'Pleno',
    q: "How do you ask for help without sounding incompetent?",
    a: "I lead with what I've already tried: 'I've been debugging this for 2 hours — I've ruled out X and Y, but I'm stuck on Z. Could you take a look?' This shows I've done the work and narrowed the problem. I also specify what kind of help I need: 'Not looking for a solution necessarily — just a second set of eyes to see if I'm missing something obvious.'",
    tip: 'Pedir ajuda eficientemente demonstra maturidade. "I\'ve ruled out X and Y" mostra que você trabalhou no problema.',
  },
  {
    level: 'Senior',
    q: "How do you handle receiving critical feedback from a senior engineer?",
    a: "I try to receive it as data, not judgment. First instinct: understand before defending — 'That's a fair point — could you help me understand why this approach is problematic?' If I genuinely disagree after understanding, I say so: 'I see where you're coming from. I went this route because X — does that change anything?' I've learned that how you receive feedback says more about your growth than the feedback itself.",
    tip: 'Curiosidade antes de defensividade. Esta resposta é muito valorizada em culturas de feedback direto (EUA/Europa).',
  },
  {
    level: 'Pleno',
    q: "Can you explain the concept of technical debt in simple terms?",
    a: "Technical debt is the cost you pay later for shortcuts taken now. Like financial debt, it accrues interest — the longer you carry it, the harder it becomes to change. Sometimes it's a deliberate, smart decision: 'let's ship fast now and refactor next quarter'. The problem is when it's untracked. I try to make debt explicit — either in ADRs with a plan to repay, or as TODOs linked to tracked issues.",
    tip: 'Mencionar que dívida técnica deliberada pode ser legítima (com plano) demonstra maturidade — não é perfeccionismo.',
  },
]

// ── Dados: CheatSheet ─────────────────────────────────────────────────────────

const CHEATSHEET_HOOKS: HookItem[] = [
  { name: 'Blocker:', sig: 'Deve mudar antes do merge', desc: 'Específico sobre o problema e por que importa. "Blocker: this will cause a race condition when two requests hit simultaneously."' },
  { name: 'Suggestion:', sig: 'Opcional mas valioso', desc: 'Sempre explique o porquê. "Suggestion: extracting this would make it easier to test in isolation."' },
  { name: 'nit:', sig: 'Detalhe menor de estilo', desc: 'Sem urgência. "nit: extra blank line on line 47." — nunca perca um merge por nit.' },
  { name: 'Question:', sig: 'Pergunta genuína, sem agenda', desc: '"Question: what\'s the expected behavior when retries is 0?" — abre diálogo, não acusa.' },
  { name: 'FYI:', sig: 'Informativo, não requer ação', desc: '"FYI: this pattern was deprecated in v3 — no action needed now but worth noting."' },
  { name: 'PR — What', sig: 'O que mudou', desc: 'Lista de mudanças concretas. Evite "various improvements". Seja específico: "Added retry logic with exponential backoff."' },
  { name: 'PR — Why', sig: 'Por que era necessário', desc: 'Contexto e motivação. "2% of transactions were failing due to transient 503s from the payment API."' },
  { name: 'PR — How to test', sig: 'Como verificar', desc: 'Passos numerados, comandos concretos. "Run npm test -- --grep \'payment retry\'."' },
  { name: 'BLUF', sig: 'Bottom Line Up Front', desc: 'Conclusão ou ação necessária na primeira linha. Contexto depois para quem quiser. Respeita o tempo dos colegas.' },
  { name: 'Incident TL;DR', sig: 'Impact + status em uma linha', desc: '"Users in EU experiencing 500 errors on login — mitigated as of 14:23 UTC." Primeiro update em 15 minutos.' },
]

const CHEATSHEET_RULES: RuleItem[] = [
  { ok: false, t: 'Começar mensagem longa com contexto antes de chegar ao ponto — use BLUF' },
  { ok: false, t: 'Usar idiomas que não traduzem bem: "bite the bullet", "under the weather", "it\'s raining cats and dogs"' },
  { ok: false, t: 'Dizer "my English is not very good" na entrevista — diga o que consegue fazer' },
  { ok: false, t: 'Responder a pergunta errada por medo de pedir para repetir — sempre confirme o entendimento' },
  { ok: true, t: 'Prefixos explícitos (Blocker, Suggestion, nit) eliminam ambiguidade sobre o que é obrigatório' },
  { ok: true, t: 'PR notes: mencione o que já considerou e rejeitou — poupa o tempo dos revisores' },
  { ok: true, t: 'Primeiro update de incidente em 15 minutos: incerteza comunicada é melhor que silêncio' },
]

// ── Dados: Mnemônicos ─────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'As 4 dimensões do inglês técnico',
    trick: 'REAL — Reading, Escrita, Audição, L (L para Listening/speaking)',
    expansion: [
      ['R — Reading (Leitura)', 'Docs, RFC, blogs de engenharia. Base de todo vocabulário técnico passivo.'],
      ['E — Escrita (Writing)', 'PRs, commits, ADRs, Slack. Vocabulário passivo se torna ativo.'],
      ['A — Audição (Listening)', 'Talks, meetings, podcasts. Exposição a sotaques variados em tempo real.'],
      ['L — L (Speaking/Fala)', 'Entrevistas, pair programming. Maior gap, requer prática deliberada e separada.'],
    ],
    explanation: 'Desenvolva nessa ordem. Cada dimensão alimenta a próxima. Não pule etapas — vocabulário da leitura é o combustível da escrita e da fala.',
    example: '6 meses de leitura diária move B1 para C1 em leitura. Fala leva mais — pratique falar sobre seus projetos em inglês 5 minutos por dia desde o início.',
    why: 'REAL é o mapa de desenvolvimento. Saber que há quatro dimensões distintas evita o erro de "estudar inglês geral" em vez de desenvolver cada dimensão com prática específica.',
  },
  {
    label: 'Prefixos de code review',
    trick: 'BSN — Blocker, Suggestion, Nit',
    expansion: [
      ['B — Blocker', 'Deve mudar antes do merge. Crítico para correção ou segurança.'],
      ['S — Suggestion', 'Opcional mas valioso. O autor pode aceitar ou rejeitar com justificativa.'],
      ['N — Nit', 'Detalhe menor de estilo. Nunca bloqueia merge. Pode ser ignorado.'],
    ],
    explanation: 'Prefixos explícitos eliminam ambiguidade. Sem eles, o autor não sabe se deve mudar obrigatoriamente ou apenas considerar. BSN são os três mais comuns; Question e FYI completam o toolkit.',
    example: '"This is wrong" → ambíguo. "Blocker: this will cause a null pointer exception when user.address is undefined" → específico e explícito sobre a urgência.',
    why: 'Em times remotos internacionais, a qualidade do code review define sua reputação. BSN é adotado por equipes de alta performance porque reduz idas e vindas desnecessárias.',
  },
  {
    label: 'Regra de comunicação assíncrona',
    trick: 'BLUF — Bottom Line Up Front',
    expansion: [
      ['B — Bottom', 'A conclusão, decisão ou ação necessária vem primeiro.'],
      ['L — Line', 'Em uma única frase direta — não um parágrafo.'],
      ['U — Up', 'No topo da mensagem, antes de qualquer contexto.'],
      ['F — Front', 'Antes de qualquer contexto, história ou justificativa.'],
    ],
    explanation: 'BLUF é o padrão de comunicação assíncrona de times remotos de alta performance. Respeita o tempo dos colegas em múltiplos fusos horários — eles decidem imediatamente se precisam ler o resto.',
    example: 'Anti-BLUF: "So yesterday I was reviewing the deployment pipeline and I noticed something that might be an issue with how we handle..." (o leitor ainda não sabe o que você quer). BLUF: "Action needed: please review PR #234 by 17:00 UTC — it\'s blocking the deploy." O contexto vem depois.',
    why: 'A comunicação assíncrona é a habilidade que mais diferencia engenheiros que trabalham em times globais. BLUF é a regra mais importante e a mais frequentemente violada.',
  },
]

// ── Dados: Glossário ──────────────────────────────────────────────────────────

const GLOSSARY: GlossaryTerm[] = [
  { term: 'trade-off', definition: 'A compromise where gaining one quality means losing another. "The trade-off of using a cache is eventual consistency."' },
  { term: 'bottleneck', definition: 'The component limiting overall system performance. "The database is the bottleneck at scale."' },
  { term: 'throughput', definition: 'Amount of data processed per unit of time. "We need to increase throughput from 1K to 10K RPS."' },
  { term: 'latency', definition: 'Time delay for a request to travel and receive a response. "p99 latency is 800ms under load."' },
  { term: 'backpressure', definition: 'Mechanism to slow producers when consumers can\'t keep up. "We need backpressure on the event stream."' },
  { term: 'idempotent', definition: 'Operation that produces the same result regardless of how many times it\'s executed. "POST /payment must be idempotent."' },
  { term: 'fault tolerance', definition: 'System\'s ability to continue operating when components fail. "We need fault tolerance for the payment gateway."' },
  { term: 'eventual consistency', definition: 'Model where replicas converge to the same state over time. "The shopping cart uses eventual consistency across regions."' },
  { term: 'race condition', definition: 'Bug where behavior depends on timing of concurrent operations. "There\'s a race condition in the cache invalidation."' },
  { term: 'deadlock', definition: 'State where two processes are each waiting for the other to release a resource. "The database has a deadlock on the orders table."' },
  { term: 'graceful degradation', definition: 'System continues operating with reduced functionality when components fail. "Show cached results instead of an error page."' },
  { term: 'separation of concerns', definition: 'Design principle to separate distinct responsibilities into different modules. "The auth logic shouldn\'t be mixed with business logic."' },
  { term: 'single source of truth', definition: 'One canonical location for a piece of data. "The database is the single source of truth for user state."' },
  { term: 'tight coupling', definition: 'High dependency between components, making changes difficult. "The services are too tightly coupled — changing one breaks others."' },
  { term: 'technical debt', definition: 'Accumulated cost of shortcuts taken to ship faster. "We\'re carrying significant technical debt in the auth module."' },
  { term: 'circuit breaker', definition: 'Pattern that stops calls to a failing service and allows recovery. "The circuit breaker opened after 5 consecutive failures."' },
  { term: 'dependency injection', definition: 'Providing a component with its dependencies rather than having it create them. "We use DI to make the service testable."' },
  { term: 'abstraction layer', definition: 'A level of indirection that hides implementation details. "The repository pattern is an abstraction layer over the database."' },
  { term: 'load shedding', definition: 'Intentionally dropping some requests to protect a system under high load. "We implemented load shedding for non-critical endpoints."' },
  { term: 'idempotency key', definition: 'A unique identifier to detect and handle duplicate requests. "Send an idempotency key with every payment request."' },
  { term: 'blue-green deployment', definition: 'Deployment strategy with two identical environments for zero-downtime releases. "We do blue-green deployments for all production releases."' },
  { term: 'canary release', definition: 'Gradually rolling out changes to a small subset of users. "We\'re doing a canary release to 5% of users first."' },
  { term: 'retry with backoff', definition: 'Retrying a failed operation with increasing delays. "We use exponential backoff with jitter for all external API calls."' },
  { term: 'consensus', definition: 'Agreement among distributed nodes on a single value. "Raft achieves consensus in a distributed system."' },
  { term: 'horizontal scaling', definition: 'Adding more machines to handle load. "We scale horizontally by adding more API server instances."' },
  { term: 'vertical scaling', definition: 'Adding more resources (CPU, RAM) to existing machines. "Vertical scaling has diminishing returns after a certain point."' },
  { term: 'hot path', definition: 'The code executed most frequently in a critical performance scenario. "The hot path must be lock-free."' },
  { term: 'ownership', definition: 'Taking full responsibility for a component or outcome. "The team has full ownership of the payment service."' },
  { term: 'postmortem', definition: 'Document analyzing an incident: what happened, why, and how to prevent it. "We wrote a postmortem after the outage."' },
  { term: 'runbook', definition: 'Documented procedures for handling common operational tasks or incidents. "Follow the runbook for database failover."' },
]

// ── Builders ──────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'Inglês Técnico',
    stackLabel: 'English for Engineers',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'Inglês Técnico',
    accentColor: C,
    stackLabel: 'Code Review · PRs · Async Communication',
    sections: {
      hooks: CHEATSHEET_HOOKS,
      depRows: [
        ['Grammarly', 'Revisão gramatical — use para aprender o porquê da correção'],
        ['Anki', 'Repetição espaçada para vocabulário técnico — 10 cards por dia'],
        ['Pramp', 'Mock interviews gratuitas — fundamental para praticar fala'],
        ['Software Engineering Daily', 'Podcast diário para audição em inglês técnico'],
        ['Hacker News', 'Leitura diária de artigos e comentários técnicos em inglês'],
      ],
      rules: CHEATSHEET_RULES,
      performanceTips: [
        'BLUF em toda mensagem assíncrona — conclusão primeiro, contexto depois',
        'Prefixos BSN em todo code review — elimina ambiguidade sobre o que é obrigatório',
        'PR description com What/Why/How to test — reviewers agradecem',
        'Pedir para repetir é profissional — melhor que responder a pergunta errada',
        'Primeiro update de incidente em 15 minutos — incerteza comunicada > silêncio',
      ],
      patterns: [
        {
          name: 'Template de PR Description',
          code: `## What
- Added retry logic with exponential backoff
- Configured max 3 retries, 1s base delay, with jitter

## Why
Payment API returns 503 under load. Without retries,
~2% of transactions fail unnecessarily.

## How to test
1. Run npm test -- --grep "payment retry"
2. Run npm run test:load`,
          desc: 'Três seções mínimas. Proativamente mencione o que já considerou e rejeitou.',
        },
        {
          name: 'Incident update em Slack',
          code: `🔴 INCIDENT — Login failure EU users
Status: Investigating (14:23 UTC)
Impact: ~15% EU users cannot log in.

TL;DR: Auth service returning 500. Root cause TBD.

Timeline:
- 14:10 UTC: First alert (error rate > 5%)
- 14:23 UTC: DB connection pool exhaustion found

Next update: in 15min or when status changes`,
          desc: 'TL;DR primeiro. Primeiro update em 15 minutos mesmo sem root cause.',
        },
        {
          name: 'Code review com prefixos BSN',
          code: `// Blocker: deve mudar antes do merge
Blocker: this will cause a race condition when
two requests hit simultaneously. The shared map
isn't thread-safe — use sync.Map or a mutex.

// Suggestion: opcional
Suggestion: extracting this into a helper would
make it easier to test in isolation.

// nit: detalhe menor
nit: extra blank line on line 47.`,
          desc: 'Prefixos explícitos eliminam ambiguidade. Explique o porquê, não só o quê.',
        },
      ],
      mentalModels: [
        'REAL: Reading → Escrita → Audição → L(Fala). Desenvolva nessa ordem.',
        'BSN: Blocker (deve mudar) / Suggestion (opcional) / Nit (estilo). Sempre explique o porquê.',
        'BLUF: Bottom Line Up Front — conclusão primeiro, contexto depois.',
        '"Functional and improving" — postura certa para falar sobre o próprio inglês em entrevista.',
        'Sotaque brasileiro é aceito — clareza e precisão técnica importam mais que pronúncia.',
      ],
    },
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'Inglês Técnico',
    stackLabel: 'English for Engineers',
  }),
  'quick-ref': () => buildGlossaryPdf({
    terms: GLOSSARY,
    accentColor: C,
    skillName: 'Inglês Técnico',
    stackLabel: 'Vocabulário Técnico Essencial',
  }),
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function InglesPdfs() {
  const [open, setOpen] = useState<PdfCard | null>(null)
  const hero = PDF_CARDS[0]
  const rest = PDF_CARDS.slice(1)
  return (
    <>
      <HeroCard card={hero} accent={C} onOpen={() => setOpen(hero)} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 16 }}>
        {rest.map(c => (
          <CollectionCard key={c.id} card={c} accent={C} onOpen={() => setOpen(c)} />
        ))}
      </div>
      {open && <PdfModal card={open} onClose={() => setOpen(null)} builders={PDF_BUILDERS} />}
    </>
  )
}
