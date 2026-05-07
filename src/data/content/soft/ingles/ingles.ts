import type { SkillContent } from '@/types'

const ingles: SkillContent = {
  tagline: 'Inglês técnico fluente — pré-requisito para documentação, vagas internacionais e comunicação com times globais.',
  why: 'Inglês é o único idioma que desbloqueia 100% do mercado tech: documentação oficial, conferências, vagas remotas globais e os melhores blogs de engenharia. Devs sem inglês funcional têm acesso à versão traduzida e atrasada do conhecimento — e ficam de fora de vagas que pagam 3–5x mais. Prioridade máxima.',
  summary: 'Inglês em tech tem quatro dimensões com pesos diferentes no dia a dia de um engenheiro: leitura de documentação e artigos (uso quase diário), escrita técnica em PRs, ADRs e Slack (diário em times remotos), compreensão auditiva em talks e reuniões (frequente), e fala em entrevistas e pair programming (crucial). Para a maioria dos devs brasileiros, leitura é a mais desenvolvida e fala é o maior gap. O caminho mais eficiente é imersão total: mudar o idioma de todos os apps para inglês, consumir conteúdo tech exclusivamente em inglês, e praticar escrita técnica nos próprios PRs e commits. C1 funcional — não perfeito — já é suficiente para vagas internacionais. Sotaque brasileiro é totalmente aceito; clareza e precisão importam mais que pronúncia.',
  keypoints: [
    {
      title: 'As quatro dimensões do inglês técnico',
      body: 'Leitura (documentação, RFC, papers), escrita (PRs, ADRs, Slack, e-mail), compreensão auditiva (talks, reuniões, podcasts) e fala (entrevistas, pair programming, standups). Desenvolva nessa ordem — leitura é base para tudo mais. Um dev que lê bem e escreve bem já cobre 80% das situações de trabalho remoto.',
    },
    {
      title: 'Leitura: imersão total em inglês',
      body: 'Nunca leia documentação em português quando existe a versão original em inglês. Docs traduzidas ficam desatualizadas. Leia Hacker News, blogs de engenharia das big techs (Stripe, Netflix, Cloudflare, Uber Eng), RFC originais. Use dicionário inline no browser — seleciona, traduz, aprende no contexto, não sai da página.',
    },
    {
      title: 'Escrita técnica em inglês',
      body: 'Escreva todos os seus commits, PRs e comentários de código em inglês desde agora. Use Grammarly ou Claude para revisar rascunhos antes de enviar. Padrão de escrita técnica em inglês: direto ao ponto, concreto, sem rodeios culturais. "Fixed race condition in cache invalidation" supera "I made some improvements to handle the situation where...".',
      code: '# Commits em inglês, imperativo, específicos\ngit commit -m "fix: prevent duplicate events in webhook handler"\ngit commit -m "feat: add retry logic with exponential backoff"\ngit commit -m "refactor: extract auth middleware to shared module"\n\n# PR description template\n## What\n- Changed X to Y\n- Added Z\n\n## Why\nThis fixes the race condition when two requests hit simultaneously.\n\n## How to test\n1. Run `npm test`\n2. Hit endpoint with concurrent requests',
    },
    {
      title: 'Compreensão auditiva: progressão de velocidade',
      body: 'Comece com legendas em inglês (nunca em português). Depois assista sem legenda em velocidade 0.75x, progredindo para 1x e 1.25x. Podcasts tech são ótimos porque o áudio é limpo e o vocabulário é repetitivo. Software Engineering Daily, The Changelog, Syntax FM, Lex Fridman. Reuniões são mais difíceis — sotaques variados, sem legenda, tempo real.',
    },
    {
      title: 'Fala: prática deliberada para entrevistas',
      body: 'O maior gap da maioria dos devs brasileiros. Pratique falar sobre seus projetos em inglês em voz alta — literalmente fale sozinho explicando uma decisão técnica. Grave e ouça. Faça mock interviews com plataformas como Pramp ou Interviewing.io. Em entrevistas reais: pace mais lento, frases mais curtas, não há problema em pedir para repetir ("Could you repeat that please?").',
    },
    {
      title: 'Vocabulário técnico essencial',
      body: 'Termos que aparecem em toda entrevista técnica em inglês: trade-off, bottleneck, throughput, latency, fault tolerance, idempotent, eventual consistency, graceful degradation, separation of concerns, single source of truth, race condition, deadlock, backpressure. Conhecer os termos na língua original evita confusão na hora de explicar conceitos.',
    },
    {
      title: 'Escrita assíncrona em times remotos',
      body: 'Em times distribuídos globalmente, a maior parte da comunicação é escrita e assíncrona. Habilidades críticas: escrever atualizações de status claras, formular perguntas técnicas sem ambiguidade, dar feedback em code review de forma construtiva, e documentar decisões em ADRs que o time vai ler meses depois.',
    },
    {
      title: 'Imersão contínua no dia a dia',
      body: 'Mude o idioma do celular, computador e todos os apps para inglês. Pense em inglês ao nomear variáveis e funções. Escreva notas técnicas e rascunhos em inglês. Interaja com AI models (Claude, ChatGPT) em inglês para discussões técnicas — você força o uso ativo do vocabulário em contexto real.',
    },
  ],
  gotchas: [
    'Estudar inglês geral em vez de inglês técnico — vocabulário de soap opera não ajuda em entrevista de sistemas distribuídos.',
    'Consumir qualquer conteúdo técnico em português quando existe a versão original em inglês — tradução atrasa o aprendizado e perde nuances.',
    'Não falar por medo de cometer erros — fluência vem de erros corrigidos, não de silêncio perfeito.',
    'Esperar atingir C2 para aplicar para vaga internacional — C1 funcional já abre a maioria das portas; não existe dev nativo perfeito.',
    'Grammarly como muleta em vez de ferramenta de aprendizado — use-o para entender o porquê da correção, não só para aceitar automaticamente.',
    'Traduzir mentalmente do português antes de falar — desacelera a fala e cria construções não naturais. Treine pensar diretamente em inglês.',
    'Confundir sotaque com competência — clareza e precisão técnica importam mais. Sotaque brasileiro é aceito e respeitado.',
  ],
  diagrams: [
    {
      title: 'Os quatro eixos do inglês técnico — onde você está e onde ir',
      html: `<style>
.eng-wrap{font-family:'Plus Jakarta Sans',sans-serif;background:#0f172a;border-radius:12px;padding:24px;color:#e2e8f0}
.eng-axis{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:16px}
.eng-card{background:#1e293b;border-radius:10px;padding:16px;border:1.5px solid #334155;transition:border-color .2s}
.eng-card:hover{border-color:#22c55e}
.eng-badge{display:inline-block;font-size:9px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;border-radius:4px;padding:2px 8px;margin-bottom:10px}
.eng-title{font-size:13px;font-weight:700;color:#e2e8f0;margin-bottom:6px}
.eng-desc{font-size:11px;color:#64748b;line-height:1.7;margin-bottom:10px}
.eng-bar-bg{background:#0f172a;border-radius:4px;height:6px;overflow:hidden;margin-bottom:4px}
.eng-bar{height:6px;border-radius:4px;transition:width .4s}
.eng-bar-label{display:flex;justify-content:space-between;font-size:9px;color:#475569}
.eng-tip{background:#1e293b;border:1px solid #1e3a5f;border-radius:8px;padding:12px 16px;margin-top:16px;font-size:11px;color:#94a3b8;line-height:1.7}
</style>
<div class="eng-wrap">
  <p style="font-size:13px;font-weight:700;margin:0 0 4px">Quatro dimensões do inglês em tech</p>
  <p style="font-size:10px;color:#475569;margin:0">Desenvolva nessa ordem — cada uma alimenta a próxima</p>
  <div class="eng-axis">
    <div class="eng-card">
      <div class="eng-badge" style="background:rgba(34,197,94,.15);color:#22c55e">1 — Base</div>
      <div class="eng-title">Leitura</div>
      <div class="eng-desc">Docs oficiais, RFC, blogs de engenharia, Hacker News. Vocabulário técnico passivo.</div>
      <div class="eng-bar-bg"><div class="eng-bar" style="width:75%;background:#22c55e"></div></div>
      <div class="eng-bar-label"><span>Maioria dos devs BR</span><span>75%</span></div>
    </div>
    <div class="eng-card">
      <div class="eng-badge" style="background:rgba(34,197,94,.15);color:#22c55e">2 — Diário</div>
      <div class="eng-title">Escrita</div>
      <div class="eng-desc">PRs, commits, ADRs, Slack, e-mail técnico. Vocabulário técnico ativo.</div>
      <div class="eng-bar-bg"><div class="eng-bar" style="width:55%;background:#22c55e"></div></div>
      <div class="eng-bar-label"><span>Gap médio</span><span>55%</span></div>
    </div>
    <div class="eng-card">
      <div class="eng-badge" style="background:rgba(34,197,94,.15);color:#22c55e">3 — Reuniões</div>
      <div class="eng-title">Audição</div>
      <div class="eng-desc">Talks, meetings, podcasts. Sotaques variados, sem legenda, tempo real.</div>
      <div class="eng-bar-bg"><div class="eng-bar" style="width:45%;background:#22c55e"></div></div>
      <div class="eng-bar-label"><span>Gap grande</span><span>45%</span></div>
    </div>
    <div class="eng-card">
      <div class="eng-badge" style="background:rgba(249,115,22,.15);color:#f97316">4 — Crítico</div>
      <div class="eng-title">Fala</div>
      <div class="eng-desc">Entrevistas técnicas, pair programming, standups. Maior gap da maioria.</div>
      <div class="eng-bar-bg"><div class="eng-bar" style="width:30%;background:#f97316"></div></div>
      <div class="eng-bar-label"><span>Maior gap BR</span><span>30%</span></div>
    </div>
  </div>
  <div class="eng-tip">
    <strong style="color:#22c55e">Caminho eficiente:</strong> Leitura → Escrita → Audição → Fala. Não pule etapas. Vocabulário passivo (leitura) alimenta vocabulário ativo (escrita), que alimenta a fala.
    Progresso médio: 6 meses de imersão diária move leitura de B1 para C1. Fala leva mais — pratique em voz alta desde o início.
  </div>
</div>`,
      caption: 'O gap mais comum em devs brasileiros é fala, mas é desenvolvida por último — leitura e escrita primeiro porque têm retorno imediato no trabalho.',
    },
    {
      title: 'Frases de código review — do tóxico ao construtivo',
      html: `<style>
.cr-wrap{font-family:'Plus Jakarta Sans',sans-serif;background:#0f172a;border-radius:12px;padding:24px;color:#e2e8f0}
.cr-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px}
.cr-card{background:#1e293b;border-radius:8px;padding:14px;border:1.5px solid #334155}
.cr-label{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px;display:block}
.cr-item{font-size:11px;color:#e2e8f0;padding:6px 0;border-bottom:1px solid #0f172a;line-height:1.5;font-family:'JetBrains Mono',monospace}
.cr-item:last-child{border-bottom:none}
.cr-note{font-size:10px;color:#475569;margin-top:4px;font-family:'Plus Jakarta Sans',sans-serif}
</style>
<div class="cr-wrap">
  <p style="font-size:13px;font-weight:700;margin:0 0 4px">Frases de Code Review — do tóxico ao construtivo</p>
  <p style="font-size:10px;color:#475569;margin:0">Em times internacionais, a qualidade da escrita no code review define sua reputação</p>
  <div class="cr-row">
    <div class="cr-card">
      <span class="cr-label" style="color:#ef4444">❌ Evitar</span>
      <div class="cr-item">This is wrong.</div>
      <div class="cr-item">Why did you do this?</div>
      <div class="cr-item">This doesn't make sense.</div>
      <div class="cr-item">You should have used X.</div>
      <div class="cr-item">This is bad code.</div>
    </div>
    <div class="cr-card">
      <span class="cr-label" style="color:#22c55e">✓ Preferir</span>
      <div class="cr-item">Blocker: this will cause a race condition under concurrent load.</div>
      <div class="cr-item">Could you help me understand the reasoning here? I want to make sure I'm not missing context.</div>
      <div class="cr-item">Suggestion: extracting this into a separate function would make it easier to test.</div>
      <div class="cr-item">nit: consider using X — slightly more idiomatic in Go.</div>
      <div class="cr-item">Nice approach here! Hadn't considered this pattern.</div>
    </div>
  </div>
  <div style="margin-top:14px;padding:10px 14px;background:#1e293b;border-radius:8px;font-size:11px;color:#94a3b8;border-left:3px solid #22c55e;line-height:1.7">
    <strong style="color:#22c55e">Prefixos padrão:</strong> <strong style="color:#e2e8f0">Blocker:</strong> (deve mudar), <strong style="color:#e2e8f0">Suggestion:</strong> (opcional), <strong style="color:#e2e8f0">nit:</strong> (detalhe menor), <strong style="color:#e2e8f0">Question:</strong> (pergunta genuína), <strong style="color:#e2e8f0">FYI:</strong> (informativo). Explicar sempre o porquê, não só o quê.
  </div>
</div>`,
      caption: 'Prefixos explícitos (Blocker, Suggestion, nit) eliminam ambiguidade sobre o que é obrigatório e o que é opcional.',
    },
    {
      title: 'Vocabulário técnico por contexto de uso',
      html: `<style>
.voc-wrap{font-family:'Plus Jakarta Sans',sans-serif;background:#0f172a;border-radius:12px;padding:24px;color:#e2e8f0}
.voc-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-top:16px}
.voc-cat{background:#1e293b;border-radius:8px;padding:14px;border-top:3px solid}
.voc-cat-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px}
.voc-term{display:flex;justify-content:space-between;font-size:11px;padding:5px 0;border-bottom:1px solid #0f172a}
.voc-en{color:#e2e8f0;font-family:'JetBrains Mono',monospace;font-size:10px}
.voc-context{color:#64748b;font-size:10px}
</style>
<div class="voc-wrap">
  <p style="font-size:13px;font-weight:700;margin:0 0 4px">Vocabulário técnico essencial por contexto</p>
  <p style="font-size:10px;color:#475569;margin:0">Termos que aparecem em toda entrevista técnica ou reunião internacional</p>
  <div class="voc-grid">
    <div class="voc-cat" style="border-color:#22c55e">
      <div class="voc-cat-title" style="color:#22c55e">Sistemas e Performance</div>
      <div class="voc-term"><span class="voc-en">trade-off</span><span class="voc-context">compensação</span></div>
      <div class="voc-term"><span class="voc-en">bottleneck</span><span class="voc-context">gargalo</span></div>
      <div class="voc-term"><span class="voc-en">throughput</span><span class="voc-context">vazão</span></div>
      <div class="voc-term"><span class="voc-en">latency</span><span class="voc-context">latência</span></div>
      <div class="voc-term"><span class="voc-en">backpressure</span><span class="voc-context">contrapressão</span></div>
      <div class="voc-term"><span class="voc-en">graceful degradation</span><span class="voc-context">degradação elegante</span></div>
    </div>
    <div class="voc-cat" style="border-color:#06b6d4">
      <div class="voc-cat-title" style="color:#06b6d4">Confiabilidade</div>
      <div class="voc-term"><span class="voc-en">fault tolerance</span><span class="voc-context">tolerância a falhas</span></div>
      <div class="voc-term"><span class="voc-en">idempotent</span><span class="voc-context">idempotente</span></div>
      <div class="voc-term"><span class="voc-en">eventual consistency</span><span class="voc-context">consistência eventual</span></div>
      <div class="voc-term"><span class="voc-en">race condition</span><span class="voc-context">condição de corrida</span></div>
      <div class="voc-term"><span class="voc-en">deadlock</span><span class="voc-context">impasse</span></div>
      <div class="voc-term"><span class="voc-en">circuit breaker</span><span class="voc-context">disjuntor</span></div>
    </div>
    <div class="voc-cat" style="border-color:#a855f7">
      <div class="voc-cat-title" style="color:#a855f7">Design e Arquitetura</div>
      <div class="voc-term"><span class="voc-en">separation of concerns</span><span class="voc-context">separação de responsabilidades</span></div>
      <div class="voc-term"><span class="voc-en">single source of truth</span><span class="voc-context">fonte única de verdade</span></div>
      <div class="voc-term"><span class="voc-en">tight coupling</span><span class="voc-context">alto acoplamento</span></div>
      <div class="voc-term"><span class="voc-en">dependency injection</span><span class="voc-context">injeção de dependência</span></div>
      <div class="voc-term"><span class="voc-en">abstraction layer</span><span class="voc-context">camada de abstração</span></div>
      <div class="voc-term"><span class="voc-en">technical debt</span><span class="voc-context">dívida técnica</span></div>
    </div>
  </div>
</div>`,
      caption: 'Conhecer os termos na língua original elimina a hesitação ao explicar conceitos em entrevistas — não é preciso traduzir mentalmente.',
    },
  ],
  interview: [
    {
      q: 'How would you describe your English proficiency for this role?',
      a: "I'm comfortable with technical English across reading, writing, and spoken communication. I read documentation, papers, and engineering blogs exclusively in English. In my current role I write all PRs, commit messages, and technical documents in English. In meetings I follow discussions well and contribute — I may ask for clarification on unfamiliar accents occasionally, but that's never been a blocker. My spoken English is functional and improving continuously through daily immersion.",
      tip: 'Seja honesto mas confiante. Nunca diga "my English is not very good" — diga o que você consegue fazer. Focar no funcional, não no perfeito.',
      level: 'pleno',
    },
    {
      q: 'Can you walk me through a technical decision you made recently?',
      a: "Sure. We had an N+1 query problem in our listing endpoint — each item was triggering a separate database call, which caused p99 latency to spike to 800ms under load. I identified it through query logging in our staging environment. The fix was to replace the lazy-loading with a single JOIN query using our ORM's eager loading, which brought p99 down to 45ms. We added the query to our test suite to prevent regression.",
      tip: 'Esta pergunta testa dois skills de uma vez: comunicação técnica e capacidade de articular tradeoffs. Prepare 2–3 histórias de decisões técnicas reais e pratique em voz alta.',
      level: 'pleno',
    },
    {
      q: 'How do you handle technical disagreements with teammates?',
      a: "I try to separate the idea from the person — critique the approach, not the author. When I disagree, I make my reasoning explicit: what's the tradeoff I'm worried about, what's the evidence. If we can't reach consensus synchronously, I'll write up the options with explicit tradeoffs in a doc or ADR and let the team decide asynchronously. I've learned that documenting the decision process matters as much as the decision itself.",
      tip: 'Mostra maturidade técnica e comunicação. Entrevistador quer ver que você não evita conflito mas também não é combativo.',
      level: 'pleno',
    },
    {
      q: 'Tell me about a time your code caused a production incident.',
      a: "During a database migration, I missed that one of our services was still reading from the old column name. It caused a partial outage for about 15 minutes for a subset of users. We rolled back, added a compatibility layer to support both column names during transition, and deployed the migration again over a weekend with proper monitoring. Afterwards I wrote a postmortem and we created a checklist for schema migrations that's now part of our deploy process.",
      tip: 'Nunca minta ou minimize. Mostre ownership, ação clara, e o que melhorou depois. Entrevistadores adoram candidatos que aprenderam com falhas reais.',
      level: 'pleno',
    },
    {
      q: 'How do you approach learning a new technology or framework quickly?',
      a: "I start with the official documentation to understand the core mental model — what problem does it solve, what are its constraints. Then I build a minimal but real prototype that exercises the parts most relevant to my use case. I pay attention to what feels awkward or surprising — those are usually important design decisions I should understand. I also read the source code for any behavior that isn't clear from the docs.",
      tip: 'Resposta que demonstra autonomia e pensamento de engenheiro, não de tutorial-follower.',
      level: 'senior',
    },
    {
      q: "What's your approach to giving feedback in code reviews?",
      a: "I distinguish between blockers and suggestions explicitly — 'Blocker: this will cause a data race under concurrent requests' vs 'Suggestion: consider extracting this into a separate function for readability'. I explain the why, not just the what. I also recognize good patterns — 'nice approach here, hadn't considered this'. The goal is to make the author better, not just fix the PR. For bigger architectural concerns I'll start a separate conversation rather than burying it in inline comments.",
      tip: 'Em times remotos internacionais, review quality é visibilidade. Resposta que mostra como você eleva o time.',
      level: 'senior',
    },
    {
      q: 'How do you communicate technical constraints to non-technical stakeholders?',
      a: "I translate from technical to business impact. Instead of 'our database doesn't support horizontal writes', I say 'we can scale our read capacity easily, but adding more write capacity requires a 2-week migration — here's what that means for our roadmap'. I use analogies when helpful and avoid jargon. I also frame constraints as tradeoffs, not blockers — 'we can ship this in 2 weeks without caching, or in 4 weeks with caching that handles 10x the load'.",
      tip: 'Habilidade que diferencia senior de staff. Mostra que você pensa em impacto, não só em implementação.',
      level: 'senior',
    },
    {
      q: "Could you repeat that, please? / I'm not sure I follow — could you elaborate?",
      a: "Absolutely. Let me make sure I understood correctly — are you asking about [restate what you understood]? I want to make sure I'm addressing the right question before diving in.",
      tip: 'Pedir para repetir ou confirmar entendimento é profissional, não fraqueza. É preferível a responder a pergunta errada por 5 minutos.',
      level: 'pleno',
    },
    {
      q: 'How would you structure an async update to a distributed team about a production incident?',
      a: "I'd follow a structured template: first a TL;DR with the impact and current status ('Users in EU region are experiencing 500 errors on login — mitigated as of 14:23 UTC'). Then: what happened, when, what we did, current status, next steps with owners and ETAs. I keep it factual and avoid blame. The first message goes out within 15 minutes of detection, even if we don't fully understand the root cause yet — uncertainty is better communicated than silence.",
      tip: 'A estrutura TL;DR primeiro em mensagens de incidente é padrão universal em times globais — demonstra que você conhece a prática.',
      level: 'senior',
    },
    {
      q: "Describe a situation where you had to push back on a product request. How did you communicate it?",
      a: "I was once asked to ship a feature that would have required bypassing our input validation layer for speed. Instead of a flat no, I came back with: 'I can ship this in the timeline you need if we scope it to X, or I can ship the full version in Y weeks with proper validation. Here's what each approach means for security.' I always try to come with options, not just problems. The product team chose the slower path once they understood the risk.",
      tip: 'Pushback com opções e contexto de risco, não recusa. Esta resposta demonstra ownership técnico e comunicação assertiva.',
      level: 'senior',
    },
    {
      q: "What does 'asynchronous' mean in the context of distributed systems?",
      a: "In distributed systems, asynchronous means that a component sends a message or makes a request without waiting for an immediate response. The sender continues processing and the receiver handles it in its own time. This decouples components and improves resilience — if the receiver is temporarily unavailable, the message can be queued. The trade-off is added complexity: you need to handle delivery guarantees, ordering, and eventual consistency.",
      tip: 'Esta pergunta pode parecer básica, mas testa se você consegue explicar conceitos técnicos com clareza — essencial em entrevistas em inglês.',
      level: 'pleno',
    },
    {
      q: 'How do you handle receiving critical feedback from a senior engineer?',
      a: "I try to receive it as data, not judgment. My first instinct is to understand: 'That's a fair point — could you help me understand why this approach is problematic? I want to make sure I'm not repeating this mistake.' I separate my ego from the code. If I genuinely disagree, I'll say so after I've understood their perspective fully: 'I see where you're coming from. I initially went this route because X — does that change anything?' I've learned that how you receive feedback says more about your growth than the feedback itself.",
      tip: 'Resposta que demonstra crescimento, não defensividade. Muito valorizada em culturas de feedback direto (EU/US).',
      level: 'pleno',
    },
    {
      q: "Can you explain what you mean by 'technical debt'?",
      a: "Technical debt is the accumulated cost of shortcuts, suboptimal decisions, or deferred refactoring in a codebase. Like financial debt, it accrues interest — the longer you carry it, the harder it becomes to change. It's not always bad: sometimes deliberately taking on debt to ship faster is the right business decision. The problem is when it's untracked and unmanaged. I try to make debt explicit — either in ADRs with a clear plan to repay, or as TODO comments linked to a tracked issue.",
      tip: 'Mencionar que dívida técnica deliberada pode ser legítima (com plano de pagamento) demonstra maturidade de engenharia, não perfeccionismo.',
      level: 'pleno',
    },
    {
      q: 'How do you document architectural decisions for your team?',
      a: "I use ADRs — Architecture Decision Records. Each one captures: the context (what situation prompted the decision), the decision itself, the alternatives we considered, and the consequences (what becomes easier and what becomes harder). I keep them short and in the repo alongside the code they relate to — no one reads a wiki that's three clicks away. The goal is for someone joining the team in a year to understand not just what we decided, but why.",
      tip: 'ADRs no repo (não em wiki separado) é a prática que demonstra que você pensa em manutenibilidade real.',
      level: 'senior',
    },
    {
      q: "What's your biggest weakness as an engineer?",
      a: "I tend to over-engineer solutions when I'm not under time pressure — I start seeing patterns and abstractions everywhere. I've been working on this by setting a rule for myself: I won't introduce an abstraction until I've seen the pattern at least three times in the actual codebase. It's made my code more pragmatic and my PRs easier for teammates to review.",
      tip: 'A fraqueza real + o que você está fazendo para endereçá-la. Evite fraquezas que não são realmente fraquezas ("sou perfeccionista").',
      level: 'pleno',
    },
    {
      q: 'How do you prioritize when you have multiple competing tasks?',
      a: "I use a simple framework: impact × urgency. But I also consider dependencies — what's blocking someone else is higher priority than what's blocking only me. I make my priority stack visible: I'll post in Slack 'working on X today, Y tomorrow — let me know if that doesn't match your expectations'. This surfaces misalignments early instead of discovering them at the end of the sprint.",
      tip: 'Priorização visível e comunicada proativamente é valorizada em times remotos — elimina surpresas.',
      level: 'pleno',
    },
    {
      q: 'How do you ensure your Slack messages are clear in an international team?',
      a: "A few practices: I lead with the main point, not context (BLUF — Bottom Line Up Front). I use bullet points for multi-part updates. I'm explicit about time zones ('by EOD my time — that's UTC-3'). I distinguish between FYI messages and action-required ones, and I name who needs to act ('Action needed: @john — can you approve the PR?'). I also avoid idioms that don't translate well across cultures.",
      tip: 'BLUF (Bottom Line Up Front) é o padrão de comunicação assíncrona mais eficiente. Demonstra que você pensa no tempo dos outros.',
      level: 'senior',
    },
    {
      q: 'How do you write a PR description that sets up reviewers for success?',
      a: "A good PR description answers three questions before the reviewer looks at a single line of code: What changed? Why? How do I verify it? I add screenshots or recordings for UI changes, link to the relevant issue or ADR, and call out the parts I'm most uncertain about — 'I'd love feedback on the error handling strategy in X'. I also note what I've already considered and rejected, so reviewers don't spend time suggesting paths I've already evaluated.",
      tip: 'Proactively noting what you already considered and rejected saves reviewers significant time and demonstrates thoughtfulness.',
      level: 'senior',
    },
    {
      q: 'In English, how would you politely disagree with a proposal in a meeting?',
      a: "A few approaches depending on tone needed:\n\nSoftly: 'That's an interesting approach. I wonder if we've considered [alternative]...'\n\nDirect: 'I see it differently — my concern is [specific risk]. Can we explore [alternative]?'\n\nEscalating: 'I want to flag a concern about this direction before we commit. Can we take 5 minutes to look at [tradeoff]?'\n\nThe key is to always be specific about the concern — 'I'm worried about X' lands better than 'I don't think this is a good idea'.",
      tip: 'Específico sobre o que preocupa ("I\'m worried about X") supera vago ("I disagree"). Sempre em inglês: critique a ideia, não a pessoa.',
      level: 'pleno',
    },
    {
      q: 'How do you introduce yourself in a first meeting with a new team?',
      a: "Hi everyone — I'm [Name], joining as a [Role] on [Team]. Before this, I spent [X years] at [previous company] working primarily on [domain]. I'm particularly excited to work on [specific area] here because [genuine reason]. I'm still getting up to speed on the codebase, so I'll probably have a lot of questions in the first weeks — I'd love to schedule short 1:1s with each of you to understand your context better. Looking forward to working together!",
      tip: 'Estrutura: quem é você → experiência relevante → o que te anima → postura de aprendizado → próximos passos concretos. Natural e profissional.',
      level: 'pleno',
    },
  ],
  mnemonics: [
    {
      label: 'As 4 dimensões do inglês técnico',
      trick: 'REAL — Reading, Escrita, Audição, L (fala)',
      explanation: 'Desenvolva nessa ordem: Leitura alimenta vocabulário passivo, Escrita ativa o vocabulário, Audição expõe sotaques, Fala integra tudo. Exemplo: 6 meses de leitura diária move B1 para C1. Fala requer prática deliberada separada.',
    },
    {
      label: 'Prefixos de code review',
      trick: 'BSN — Blocker, Suggestion, Nit',
      explanation: 'Todo comentário deve ter prefixo: Blocker (deve mudar antes do merge), Suggestion (opcional mas valioso), Nit (detalhe menor). Elimina ambiguidade sobre o que é obrigatório. Ex: "Blocker: this causes a null pointer exception."',
    },
    {
      label: 'Comunicação assíncrona',
      trick: 'BLUF — Bottom Line Up Front',
      explanation: 'Em times remotos, coloque a conclusão ou ação na primeira linha. Contexto vem depois. Respeita fusos horários — o leitor decide imediatamente se precisa ler o resto. Ex: "Action needed by EOD: review PR #234."',
    },
  ],
  cheatsheet: {
    title: 'Inglês Técnico — Referência Rápida',
    html: `<style>
.engcs-wrap{font-family:'Plus Jakarta Sans',sans-serif;background:#0f172a;border-radius:12px;padding:24px;color:#e2e8f0;display:grid;grid-template-columns:1fr 1fr;gap:20px}
.engcs-section{background:#1e293b;border-radius:10px;padding:16px}
.engcs-title{font-size:11px;font-weight:700;color:#22c55e;text-transform:uppercase;letter-spacing:.06em;margin-bottom:12px;border-bottom:1px solid #334155;padding-bottom:8px}
.engcs-row{padding:6px 0;border-bottom:1px solid #0f172a;font-size:11px;line-height:1.5}
.engcs-key{color:#94a3b8;font-size:10px;font-weight:600;display:block;margin-bottom:2px}
.engcs-val{color:#e2e8f0;font-family:'JetBrains Mono',monospace}
.engcs-rule{display:flex;align-items:flex-start;gap:8px;padding:5px 0;font-size:11px;border-bottom:1px solid #0f172a}
.engcs-full{grid-column:span 2}
</style>
<div class="engcs-wrap">
  <div class="engcs-section">
    <div class="engcs-title">Code Review — Prefixos padrão</div>
    <div class="engcs-row"><span class="engcs-key" style="color:#ef4444">Blocker:</span><span class="engcs-val">deve mudar antes do merge</span></div>
    <div class="engcs-row"><span class="engcs-key" style="color:#22c55e">Suggestion:</span><span class="engcs-val">opcional mas valioso</span></div>
    <div class="engcs-row"><span class="engcs-key" style="color:#64748b">nit:</span><span class="engcs-val">detalhe menor de estilo</span></div>
    <div class="engcs-row"><span class="engcs-key" style="color:#06b6d4">Question:</span><span class="engcs-val">pergunta genuína, sem agenda</span></div>
    <div class="engcs-row"><span class="engcs-key" style="color:#94a3b8">FYI:</span><span class="engcs-val">informativo, não requer ação</span></div>
  </div>
  <div class="engcs-section">
    <div class="engcs-title">Frases essenciais em reuniões</div>
    <div class="engcs-row"><span class="engcs-val">Could you repeat that, please?</span></div>
    <div class="engcs-row"><span class="engcs-val">Let me make sure I understood...</span></div>
    <div class="engcs-row"><span class="engcs-val">I see it differently — my concern is...</span></div>
    <div class="engcs-row"><span class="engcs-val">That's an interesting point. Building on that...</span></div>
    <div class="engcs-row"><span class="engcs-val">Could we take 5 minutes to explore...</span></div>
  </div>
  <div class="engcs-section engcs-full">
    <div class="engcs-title">Templates de escrita técnica</div>
    <div class="engcs-rule"><span style="color:#22c55e;font-size:12px">✓</span><span><strong style="color:#e2e8f0">PR:</strong> What / Why / How to test — três seções mínimas</span></div>
    <div class="engcs-rule"><span style="color:#22c55e;font-size:12px">✓</span><span><strong style="color:#e2e8f0">Slack incident:</strong> TL;DR → what → when → status → next steps + owner</span></div>
    <div class="engcs-rule"><span style="color:#22c55e;font-size:12px">✓</span><span><strong style="color:#e2e8f0">Status update:</strong> BLUF primeiro, contexto depois — "Done: X. Blocked by: Y. Next: Z."</span></div>
    <div class="engcs-rule"><span style="color:#22c55e;font-size:12px">✓</span><span><strong style="color:#e2e8f0">Commits:</strong> verbo imperativo + escopo específico — "fix: prevent null pointer in auth middleware"</span></div>
    <div class="engcs-rule"><span style="color:#ef4444;font-size:12px">✗</span><span>Começar mensagem com contexto longo antes de chegar ao ponto principal</span></div>
    <div class="engcs-rule"><span style="color:#ef4444;font-size:12px">✗</span><span>Usar idiomas ou expressões culturais que não traduzem bem ("bite the bullet", "it's raining cats and dogs")</span></div>
  </div>
</div>`,
    caption: 'Templates e prefixos padrão para escrita técnica em times internacionais — aplicar imediatamente no trabalho.',
  },
  mindmap: {
    title: 'Inglês Técnico — Mapa Mental',
    html: `<style>
.engmm-wrap{font-family:'Plus Jakarta Sans',sans-serif;background:#0f172a;border-radius:12px;padding:24px;color:#e2e8f0}
.engmm-center{text-align:center;padding:12px 20px;background:#1e293b;border-radius:10px;display:inline-block;border:2px solid #22c55e;font-size:14px;font-weight:700}
.engmm-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-top:20px}
.engmm-cat{background:#1e293b;border-radius:10px;padding:14px;border-top:3px solid}
.engmm-cat-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px}
.engmm-item{font-size:11px;color:#94a3b8;padding:3px 0;border-bottom:1px solid #0f172a;line-height:1.5}
.engmm-item.key{color:#e2e8f0}
</style>
<div class="engmm-wrap">
  <div style="text-align:center;margin-bottom:20px">
    <div class="engmm-center">Inglês Técnico<br><span style="font-size:10px;font-weight:400;color:#64748b">Para Engenheiros de Software</span></div>
  </div>
  <div class="engmm-grid">
    <div class="engmm-cat" style="border-color:#22c55e">
      <div class="engmm-cat-title" style="color:#22c55e">Leitura</div>
      <div class="engmm-item key">Docs oficiais sempre em inglês</div>
      <div class="engmm-item key">Hacker News diário</div>
      <div class="engmm-item key">Blogs: Stripe, Netflix, Cloudflare</div>
      <div class="engmm-item">RFC originais, papers de sistemas</div>
      <div class="engmm-item">Dicionário inline no browser</div>
    </div>
    <div class="engmm-cat" style="border-color:#06b6d4">
      <div class="engmm-cat-title" style="color:#06b6d4">Escrita</div>
      <div class="engmm-item key">Commits em inglês, imperativo</div>
      <div class="engmm-item key">PRs: What / Why / How to test</div>
      <div class="engmm-item key">Slack: BLUF + bullet points</div>
      <div class="engmm-item">Code review: BSN (Blocker/Suggestion/Nit)</div>
      <div class="engmm-item">ADRs: context, decision, consequences</div>
    </div>
    <div class="engmm-cat" style="border-color:#f59e0b">
      <div class="engmm-cat-title" style="color:#f59e0b">Audição</div>
      <div class="engmm-item key">Legendas em inglês (nunca em PT)</div>
      <div class="engmm-item key">Software Engineering Daily</div>
      <div class="engmm-item key">Progressão: 0.75x → 1x → 1.25x</div>
      <div class="engmm-item">The Changelog, Syntax FM</div>
      <div class="engmm-item">Reuniões: sotaques variados, real-time</div>
    </div>
    <div class="engmm-cat" style="border-color:#f97316">
      <div class="engmm-cat-title" style="color:#f97316">Fala</div>
      <div class="engmm-item key">Fale sozinho sobre seus projetos</div>
      <div class="engmm-item key">Mock interviews: Pramp, Interviewing.io</div>
      <div class="engmm-item key">Pace mais lento, frases curtas</div>
      <div class="engmm-item">Grave e ouça a si mesmo</div>
      <div class="engmm-item">Sotaque BR é aceito — clareza importa mais</div>
    </div>
    <div class="engmm-cat" style="border-color:#a855f7">
      <div class="engmm-cat-title" style="color:#a855f7">Vocabulário Essencial</div>
      <div class="engmm-item key">trade-off, bottleneck, throughput</div>
      <div class="engmm-item key">latency, fault tolerance, idempotent</div>
      <div class="engmm-item key">race condition, deadlock, backpressure</div>
      <div class="engmm-item">eventual consistency, graceful degradation</div>
      <div class="engmm-item">separation of concerns, technical debt</div>
    </div>
    <div class="engmm-cat" style="border-color:#ef4444">
      <div class="engmm-cat-title" style="color:#ef4444">Armadilhas</div>
      <div class="engmm-item key">Inglês geral ≠ inglês técnico</div>
      <div class="engmm-item key">Não espere C2 para aplicar</div>
      <div class="engmm-item key">Silêncio por medo não gera fluência</div>
      <div class="engmm-item">Traduzir mentalmente desacelera a fala</div>
      <div class="engmm-item">Confundir sotaque com competência</div>
    </div>
  </div>
</div>`,
    caption: 'Mapa mental em seis dimensões: as quatro habilidades (REAL), vocabulário essencial e armadilhas frequentes.',
  },
  exercises: [
    {
      level: 'iniciante',
      title: 'Escrever 10 commits em inglês com mensagens específicas',
      description: 'Durante uma semana, escreva todos os seus commits em inglês usando o padrão convencional (feat, fix, refactor, chore). Cada commit deve ser específico e no imperativo. Evite mensagens genéricas como "update code" ou "fix stuff". Após a semana, revise as mensagens e identifique quais poderiam ser mais precisas.',
      concepts: ['Conventional Commits', 'Imperativo em inglês', 'Especificidade técnica', 'Vocabulário de sistemas'],
      hint: 'Use o template: [tipo]: [verbo imperativo] [o quê] [em que contexto]. Ex: "fix: prevent null pointer in auth token validation".',
    },
    {
      level: 'intermediario',
      title: 'Escrever um postmortem em inglês de um bug real',
      description: 'Escolha um bug ou incidente que você viveu (pode ser pequeno). Escreva um postmortem completo em inglês com: (1) TL;DR de uma frase, (2) Timeline do incidente, (3) Root cause analysis, (4) Impact, (5) Actions taken, (6) Next steps para prevenir recorrência. Use Grammarly para revisar e anote as correções para aprender.',
      concepts: ['Estrutura de postmortem', 'Vocabulário de incidentes', 'Root cause analysis', 'Escrita técnica formal'],
      hint: 'Fórmula do TL;DR: "On [date], [what happened] due to [root cause], affecting [impact]. Mitigated by [action] at [time]."',
    },
    {
      level: 'senior',
      title: 'Mock interview em inglês explicando uma arquitetura',
      description: 'Grave (áudio ou vídeo) uma explicação de 10 minutos em inglês sobre uma decisão arquitetural que você já tomou. Explique: o contexto, as alternativas consideradas, a decisão e os trade-offs. Ouça a gravação e identifique: (1) hesitações longas (mais de 3 segundos), (2) termos em português que apareceram, (3) frases que soaram não naturais. Refaça a gravação corrigindo esses pontos.',
      concepts: ['Comunicação de trade-offs', 'Estrutura STAR em inglês', 'Vocabulário de sistemas distribuídos', 'Auto-avaliação de fala'],
      hint: 'Estrutura: "The context was [situação]. We had three options: [A, B, C]. We chose B because [razão]. The trade-offs were [X ganhou, Y perdemos]."',
    },
  ],
  videos: [
    {
      title: 'English for Software Developers',
      channel: 'Academind',
      url: 'https://www.youtube.com/watch?v=kEEKs6Mu3B0',
      topic: 'Vocabulário técnico e frases essenciais para devs',
    },
    {
      title: 'How to Sound Confident in English Interviews',
      channel: 'Speak English with Vanessa',
      url: 'https://www.youtube.com/watch?v=7jlC6_xoX8A',
      topic: 'Técnicas de confiança e comunicação em entrevistas técnicas',
    },
    {
      title: 'Technical English for IT Professionals',
      channel: 'Business English Pod',
      url: 'https://www.businessenglishpod.com/category/technology/',
      topic: 'Inglês de negócios técnico para profissionais de TI',
    },
    {
      title: 'Software Engineering Daily — podcasts',
      channel: 'Software Engineering Daily',
      url: 'https://softwareengineeringdaily.com/',
      topic: 'Inglês técnico real em conversas com engenheiros sênior',
    },
    {
      title: 'Staff Engineer talks — Gergely Orosz',
      channel: 'The Pragmatic Engineer',
      url: 'https://www.youtube.com/c/mrgergelyorosz',
      topic: 'Comunicação sênior em inglês sobre carreira e decisões técnicas',
    },
  ],
  resources: [
    { title: 'Anki (repetição espaçada)', url: 'https://apps.ankiweb.net/', kind: 'pratica' },
    { title: 'Software Engineering Daily', url: 'https://softwareengineeringdaily.com/', kind: 'video' },
    { title: 'Grammarly', url: 'https://www.grammarly.com/', kind: 'pratica' },
    { title: 'Pramp — mock interviews grátis', url: 'https://www.pramp.com/', kind: 'pratica' },
    { title: 'Hacker News', url: 'https://news.ycombinator.com/', kind: 'artigo' },
    { title: 'Conventional Commits spec', url: 'https://www.conventionalcommits.org/', kind: 'docs' },
    { title: 'The Changelog (podcast)', url: 'https://changelog.com/podcast', kind: 'video' },
    { title: 'Syntax FM (podcast para devs JS)', url: 'https://syntax.fm/', kind: 'video' },
  ],
  codeExamples: [
    {
      title: 'Template de PR Description em inglês',
      language: 'markdown',
      code: `## What

- Added retry logic with exponential backoff to the payment service client
- Configured max 3 retries with 1s base delay and jitter
- Wrapped existing error handling to preserve original error messages

## Why

Payment API intermittently returns 503 under high load. Without retries,
~2% of transactions were failing unnecessarily. This brings that rate to
near zero while staying within the API's rate limits.

Closes #482

## How to test

1. Run \`npm test -- --grep "payment retry"\`
2. Set PAYMENT_API_URL to the staging endpoint
3. Run the concurrent load test: \`npm run test:load\`

## Notes for reviewers

- I chose exponential backoff with jitter over fixed intervals to avoid
  thundering herd. See RFC for the retry budget logic.
- The 3-retry limit was chosen based on p99 latency data — see the
  attached Grafana dashboard link.`,
      description: 'Template completo de PR description com as 3 seções mínimas (What, Why, How to test) e notas proativas para revisores.',
    },
    {
      title: 'Mensagem de incidente em Slack (template)',
      language: 'markdown',
      code: `🔴 INCIDENT — Login failure for EU users

**Status:** Investigating (as of 14:23 UTC)
**Impact:** ~15% of EU users unable to log in. US/APAC unaffected.
**Severity:** P1

**TL;DR:** Auth service returning 500 on login attempts. Root cause TBD.

**Timeline:**
- 14:10 UTC — First alert triggered (error rate > 5%)
- 14:15 UTC — On-call acknowledged, started investigation
- 14:23 UTC — Identified spike in DB connection pool exhaustion

**Current actions:**
- @alice investigating connection pool config
- @bob checking recent deploys (last deploy: 13:45 UTC)

**Next update:** in 15 minutes or when status changes

---
📊 Dashboard: [link]
🔗 Runbook: [link]
📄 Incident doc: [link]`,
      description: 'Template de mensagem de incidente com estrutura TL;DR + timeline + ações + próxima atualização. Padrão universal em times globais.',
    },
    {
      title: 'ADR — Architecture Decision Record em inglês',
      language: 'markdown',
      code: `# ADR-042: Use event sourcing for order state management

## Status
Accepted

## Context
Our order service currently uses a mutable state model — we store only the
current state of each order. This has led to two recurring problems:
1. No audit trail for regulatory compliance
2. Race conditions when multiple services update the same order

## Decision
We will adopt event sourcing for the order aggregate. All state changes will
be represented as immutable events (OrderPlaced, PaymentReceived, Shipped).
Current state is derived by replaying the event log.

## Alternatives considered
1. **Optimistic locking on current state** — simpler, but doesn't solve
   the audit trail requirement.
2. **Change data capture (CDC)** — gives audit trail but adds infra complexity
   and doesn't eliminate race conditions at the domain level.

## Consequences
**Positive:**
- Complete audit log for compliance (regulatorily required by Q2)
- Race conditions eliminated at the domain model level
- Enables event-driven downstream consumers without polling

**Negative:**
- Increased read complexity (requires projection/read models)
- Team needs to learn event sourcing patterns (estimated 2-week ramp-up)
- Harder to query current state directly (mitigated by projections)

## References
- Greg Young — Event Sourcing (2010)
- Martin Fowler — Event Sourcing pattern`,
      description: 'ADR completo em inglês com todas as seções: Status, Context, Decision, Alternatives considered, Consequences (positive e negative).',
    },
    {
      title: 'Frases prontas para Code Review em inglês',
      language: 'markdown',
      code: `# Blocker — deve mudar antes do merge
Blocker: this will cause a data race when two requests hit simultaneously.
The shared map isn't thread-safe. Consider sync.Map or a mutex here.

Blocker: this endpoint is missing authentication. Any unauthenticated
request can access user data.

# Suggestion — opcional mas valioso
Suggestion: consider extracting this validation logic into a separate
function — it's used in three places now and would be easier to test.

Suggestion: the error message here could be more specific. "invalid input"
doesn't help the caller understand what's wrong.

# nit — detalhe menor
nit: extra blank line on line 47.
nit: \`userId\` would be more consistent with the rest of the codebase than \`user_id\`.

# Question — sem agenda
Question: what's the expected behavior when \`retries\` is 0?
I want to make sure I understand the intent before suggesting anything.

# Positive feedback — sempre inclua
Nice catch — I hadn't considered the case where the session expires
mid-request. This is a clean fix.

Love this pattern — much more readable than the nested if-else it replaces.`,
      description: 'Banco de frases completo para code review: Blocker, Suggestion, nit, Question e feedback positivo — com exemplos reais.',
    },
  ],
}

export default ingles
