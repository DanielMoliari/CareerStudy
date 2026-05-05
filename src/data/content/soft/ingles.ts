import type { SkillContent } from "@/types"

const ingles: SkillContent = {
    tagline: "Inglês técnico fluente — pré-requisito para documentação, vagas internacionais e comunicação com times globais.",
    why: "Inglês é o único idioma que desbloqueia 100% do mercado tech: documentação oficial, conferências, vagas remotas globais e os melhores blogs de engenharia. Devs sem inglês funcional têm acesso à versão traduzida e atrasada do conhecimento — e ficam de fora de vagas que pagam 3–5x mais. Prioridade máxima.",
    summary: "Inglês em tech tem quatro dimensões com pesos diferentes no dia a dia de um engenheiro: leitura de documentação e artigos (uso quase diário), escrita técnica em PRs, ADRs e Slack (diário em times remotos), compreensão auditiva em talks e reuniões (frequente), e fala em entrevistas e pair programming (crucial nas entrevistas). Para a maioria dos devs brasileiros, leitura é a mais desenvolvida e fala é o maior gap. O caminho mais eficiente é imersão total: mudar o idioma de todos os apps para inglês, consumir conteúdo tech exclusivamente em inglês, e praticar escrita técnica nos próprios PRs e commits. C1 funcional — não perfeito — já é suficiente para vagas internacionais. Sotaque brasileiro é totalmente aceito; clareza e precisão importam mais que pronúncia.",
    keypoints: [
      {
        title: "As quatro dimensões do inglês técnico",
        body: "Leitura (documentação, RFC, papers), escrita (PRs, ADRs, Slack, e-mail), compreensão auditiva (talks, reuniões, podcasts) e fala (entrevistas, pair programming, standups). Desenvolva nessa ordem — leitura é base para tudo mais. Um dev que lê bem e escreve bem já cobre 80% das situações de trabalho remoto.",
      },
      {
        title: "Leitura: imersão total em inglês",
        body: "Nunca leia documentação em PT quando existe a versão original em inglês. Docs traduzidas ficam desatualizadas. Leia Hacker News, blogs de engenharia das big techs (Stripe, Netflix, Cloudflare, Uber Eng), RFC originais. Use dicionário inline no browser — seleciona, traduz, aprende no contexto, não sai da página.",
      },
      {
        title: "Escrita técnica em inglês",
        body: "Escreva todos os seus commits, PRs e comentários de código em inglês desde agora. Use Grammarly ou Claude para revisar rascunhos antes de enviar. Padrão de escrita técnica em inglês: direto ao ponto, concreto, sem rodeios culturais. 'Fixed race condition in cache invalidation' > 'I made some improvements to handle the situation where...'",
        code: "# Convenção: commits em inglês, imperativo\ngit commit -m \"fix: prevent duplicate events in webhook handler\"\ngit commit -m \"feat: add retry logic with exponential backoff\"\ngit commit -m \"refactor: extract auth middleware to shared module\"\n\n# PR description template (inglês)\n## What\n- Changed X to Y\n- Added Z\n\n## Why\nThis fixes the race condition when two requests hit simultaneously.\n\n## How to test\n1. Run `npm test`\n2. Hit endpoint with concurrent requests",
      },
      {
        title: "Compreensão auditiva: progressão de velocidade",
        body: "Comece com legendas em inglês (nunca em PT). Depois assista sem legenda em velocidade 0.75x, progredindo para 1x e 1.25x. Podcasts tech são ótimos porque o áudio é limpo e o vocabulário é repetitivo. Software Engineering Daily, The Changelog, Syntax FM, Lex Fridman. Reuniões são mais difíceis — sotaques variados, sem legenda, tempo real.",
      },
      {
        title: "Fala: prática deliberada para entrevistas",
        body: "O maior gap da maioria dos devs brasileiros. Pratique falar sobre seus projetos em inglês em voz alta — literalmente fale sozinho explicando uma decisão técnica. Grave e ouça. Faça mock interviews com plataformas como Pramp ou Interviewing.io. Em entrevistas reais: pace mais lento, frases mais curtas, não há problema em pedir para repetir ('Could you repeat that please?').",
      },
      {
        title: "Vocabulário técnico essencial",
        body: "Termos que aparecem em toda entrevista técnica em inglês: trade-off, bottleneck, throughput, latency, fault tolerance, idempotent, eventual consistency, graceful degradation, separation of concerns, single source of truth, race condition, deadlock, backpressure. Conhecer os termos na língua original evita confusão na hora de explicar conceitos.",
      },
      {
        title: "Imersão contínua no dia a dia",
        body: "Mude o idioma do celular, computador e todos os apps para inglês. Pense em inglês ao nomear variáveis e funções. Escreva notas técnicas e rascunhos em inglês. Interaja com AI models (Claude, ChatGPT) em inglês para discussões técnicas — você força o uso ativo do vocabulário em contexto real.",
      },
    ],
    diagrams: [
      {
        title: "Os quatro eixos do inglês técnico — onde você está e onde ir",
        html: `<style>
.eng-wrap{font-family:'Plus Jakarta Sans',sans-serif;background:#0f172a;border-radius:12px;padding:24px;color:#e2e8f0}
.eng-axis{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:16px}
.eng-card{background:#1e293b;border-radius:10px;padding:16px;border:1.5px solid #334155;transition:border-color .2s}
.eng-card:hover{border-color:#8B5CF6}
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
      <div class="eng-badge" style="background:rgba(139,92,246,.15);color:#8B5CF6">1 — Base</div>
      <div class="eng-title">Leitura</div>
      <div class="eng-desc">Docs oficiais, RFC, blogs de engenharia, Hacker News. Vocabulário técnico passivo.</div>
      <div class="eng-bar-bg"><div class="eng-bar" style="width:75%;background:#8B5CF6"></div></div>
      <div class="eng-bar-label"><span>Maioria dos devs BR</span><span>75%</span></div>
    </div>
    <div class="eng-card">
      <div class="eng-badge" style="background:rgba(139,92,246,.15);color:#8B5CF6">2 — Diário</div>
      <div class="eng-title">Escrita</div>
      <div class="eng-desc">PRs, commits, ADRs, Slack, e-mail técnico. Vocabulário técnico ativo.</div>
      <div class="eng-bar-bg"><div class="eng-bar" style="width:55%;background:#8B5CF6"></div></div>
      <div class="eng-bar-label"><span>Gap médio</span><span>55%</span></div>
    </div>
    <div class="eng-card">
      <div class="eng-badge" style="background:rgba(139,92,246,.15);color:#8B5CF6">3 — Reuniões</div>
      <div class="eng-title">Audição</div>
      <div class="eng-desc">Talks, meetings, podcasts. Sotaques variados, sem legenda, tempo real.</div>
      <div class="eng-bar-bg"><div class="eng-bar" style="width:45%;background:#8B5CF6"></div></div>
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
    <strong style="color:#8B5CF6">Caminho eficiente:</strong> Leitura → Escrita → Audição → Fala. Não pule etapas. Vocabulário passivo (leitura) alimenta vocabulário ativo (escrita), que alimenta a fala.
    Progresso médio: 6 meses de imersão diária move leitura de B1 para C1. Fala leva mais — pratique em voz alta desde o início.
  </div>
</div>`,
        caption: "O gap mais comum em devs brasileiros é fala, mas é desenvolvida last — leitura e escrita primeiro porque têm retorno imediato no trabalho.",
      },
    ],
    interview: [
      {
        q: "How would you describe your English proficiency for this role?",
        a: "I'm comfortable with technical English across reading, writing, and spoken communication. I read documentation, papers, and engineering blogs exclusively in English. In my current role I write all PRs, commit messages, and technical documents in English. In meetings I follow discussions well and contribute — I may ask for clarification on unfamiliar accents occasionally, but that's never been a blocker. My spoken English is functional and improving continuously through daily immersion.",
        tip: "Seja honesto mas confiante. Nunca diga 'my English is not very good' — diga o que você *consegue* fazer. Focar no funcional, não no perfeito.",
        level: "pleno",
      },
      {
        q: "Can you walk me through a technical decision you made recently?",
        a: "Sure. We had an N+1 query problem in our listing endpoint — each item was triggering a separate database call, which caused p99 latency to spike to 800ms under load. I identified it through query logging in our staging environment. The fix was to replace the lazy-loading with a single JOIN query using our ORM's eager loading, which brought p99 down to 45ms. We added the query to our test suite to prevent regression.",
        tip: "Esta pergunta em inglês testa dois skills de uma vez: comunicação técnica e capacidade de articular tradeoffs. Prepare 2–3 histórias de decisões técnicas reais e pratique em voz alta.",
        level: "pleno",
      },
      {
        q: "How do you handle technical disagreements with teammates?",
        a: "I try to separate the idea from the person — critique the approach, not the author. When I disagree, I make my reasoning explicit: what's the tradeoff I'm worried about, what's the evidence. If we can't reach consensus synchronously, I'll write up the options with explicit tradeoffs in a doc or ADR and let the team decide asynchronously. I've learned that documenting the decision process matters as much as the decision itself.",
        tip: "Mostra maturidade técnica e comunicação. Entrevistador quer ver que você não evita conflito mas também não é combativo.",
        level: "pleno",
      },
      {
        q: "Tell me about a time your code caused a production incident.",
        a: "During a database migration, I missed that one of our services was still reading from the old column name. It caused a partial outage for about 15 minutes for a subset of users. We rolled back, added a compatibility layer to support both column names during transition, and deployed the migration again over a weekend with proper monitoring. Afterwards I wrote a postmortem and we created a checklist for schema migrations that's now part of our deploy process.",
        tip: "Nunca minta ou minimize. Mostre ownership, ação clara, e o que melhorou depois. Entrevistadores adoram candidatos que aprenderam com falhas reais.",
        level: "pleno",
      },
      {
        q: "How do you approach learning a new technology or framework quickly?",
        a: "I start with the official documentation to understand the core mental model — what problem does it solve, what are its constraints. Then I build a minimal but real prototype that exercises the parts most relevant to my use case. I pay attention to what feels awkward or surprising — those are usually important design decisions I should understand. I also read the source code for any behavior that isn't clear from the docs. For example, when I learned how our ORM handled transactions, reading the source revealed isolation level defaults that weren't documented.",
        tip: "Resposta que demonstra autonomia e pensamento de engenheiro, não de tutorial-follower.",
        level: "senior",
      },
      {
        q: "What's your approach to giving feedback in code reviews?",
        a: "I distinguish between blockers and suggestions explicitly — 'Blocker: this will cause a data race under concurrent requests' vs 'Suggestion: consider extracting this into a separate function for readability'. I explain the why, not just the what. I also recognize good patterns — 'nice approach here, hadn't considered this'. The goal is to make the author better, not just fix the PR. For bigger architectural concerns I'll start a separate conversation rather than burying it in inline comments.",
        tip: "Em times remotos internacionais, review quality é visibilidade. Resposta que mostra como você eleva o time, não só aprova código.",
        level: "senior",
      },
      {
        q: "How do you communicate technical constraints to non-technical stakeholders?",
        a: "I translate from technical to business impact. Instead of 'our database doesn't support horizontal writes', I say 'we can scale our read capacity easily, but adding more write capacity requires a 2-week migration — here's what that means for our roadmap'. I use analogies when helpful and avoid jargon. I also frame constraints as tradeoffs, not blockers — 'we can ship this in 2 weeks without caching, or in 4 weeks with caching that handles 10x the load'.",
        tip: "Habilidade que diferencia senior de staff. Mostra que você pensa em impacto, não só em implementação.",
        level: "senior",
      },
    ],
    gotchas: [
      "Estudar inglês geral em vez de inglês técnico — vocabulário de soap opera não ajuda em entrevista de sistemas distribuídos.",
      "Consumir qualquer conteúdo técnico em PT quando existe a versão original em inglês — tradução atrasa o aprendizado e perde nuances.",
      "Não falar por medo de cometer erros — fluência vem de erros corrigidos, não de silêncio perfeito.",
      "Esperar atingir C2 para aplicar para vaga internacional — C1 funcional já abre a maioria das portas; não existe dev nativo perfeito.",
      "Grammarly como muleta em vez de ferramenta de aprendizado — use-o para entender o *porquê* da correção, não só para aceitar automaticamente.",
    ],
    resources: [
      { title: "Anki (repetição espaçada)", url: "https://apps.ankiweb.net/", kind: "pratica" },
      { title: "Software Engineering Daily", url: "https://softwareengineeringdaily.com/", kind: "video" },
      { title: "Grammarly", url: "https://www.grammarly.com/", kind: "pratica" },
      { title: "Pramp — mock interviews grátis", url: "https://www.pramp.com/", kind: "pratica" },
      { title: "Hacker News", url: "https://news.ycombinator.com/", kind: "artigo" },
    ],
  }

export default ingles
