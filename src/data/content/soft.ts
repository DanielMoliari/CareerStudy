import type { SkillContentMap } from "@/types"

const data: SkillContentMap = {

  /* ─────────────────────────────────────────── P1 ─────────────────────────── */

  "ingles": {
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
  },

  "technical-writing": {
    tagline: "Comunicação escrita de alta qualidade: documentação, ADRs, RFCs, post-mortems, PRs que explicam decisões.",
    why: "Senior que escreve bem tem influência multiplicada. Uma boa documentação salva horas do time toda semana. Um ADR bem escrito evita a mesma discussão ser repetida em seis meses. Um post-mortem honesto e estruturado transforma um incidente em aprendizado institucional. É a habilidade que separa senior de staff engineer.",
    summary: "Technical writing é a capacidade de comunicar conceitos técnicos com clareza para uma audiência específica e com um objetivo claro. Em engenharia de software isso cobre: documentação de API e sistemas, Architecture Decision Records, RFCs de proposta de mudanças, runbooks operacionais, post-mortems de incidentes, e descrições de PRs. Os princípios fundamentais são: audiência primeiro (quem vai ler e o que precisa decidir), concreto sobre abstrato (números e exemplos reais valem mais que prosa genérica), formato escaneável (as pessoas não leem — elas escaneiam) e TL;DR no topo (resumo antes dos detalhes). Um engenheiro sênior que escreve bem produz artefatos que continuam tendo valor meses depois de criados — ao contrário de decisões tomadas em reunião que ninguém documentou.",
    keypoints: [
      {
        title: "Audiência e objetivo primeiro",
        body: "Antes de escrever qualquer coisa, responda: quem vai ler isso? O que eles precisam entender ou decidir? Um junior que precisa implementar precisa de passo a passo concreto. Um manager que precisa aprovar precisa de impacto e risco. Um time técnico lendo um post-mortem precisa de causa raiz e ações de followup. Ajuste nível de detalhe, vocabulário e formato para a audiência — não para mostrar o que você sabe.",
      },
      {
        title: "Estrutura: TL;DR no topo",
        body: "Todo documento técnico deve começar com o resumo. A estrutura clássica: TL;DR (2 linhas máximo, a essência do documento), Contexto (por que isso existe, qual problema resolve), Conteúdo principal, Alternativas consideradas (se for decisão), Próximos passos ou call to action. Quem só tem 30 segundos lê o TL;DR e já sabe do que se trata.",
      },
      {
        title: "Concreto e específico — números reais",
        body: "'Melhora performance' é ruim. 'Reduz latência p99 de 800ms para 120ms sob 5.000 RPS' é excelente. 'O sistema não estava escalando' é vago. 'Atingíamos o limite de conexões do banco (100 conexões) com 200 usuários simultâneos' é preciso. Números, exemplos reais e comportamentos observáveis superam descrições abstratas em toda situação.",
        code: "// ❌ Vago\n// Este componente lida com o estado de autenticação\n\n// ✅ Concreto\n// Gerencia o token JWT no localStorage e o estado de sessão do usuário.\n// Expira automaticamente após 24h (sem refresh token por ora).\n// Limitação: não suporta múltiplas abas — logout em uma aba não invalida as outras.\n// ADR-007 documenta a decisão de usar localStorage vs cookies.",
      },
      {
        title: "Formato escaneável",
        body: "Pessoas não leem documentos técnicos de cima a baixo como um livro — elas escaneiam buscando a informação que precisam. Use: headers hierárquicos (H2 para seções, H3 para subseções), bullets para listas, blocos de código para qualquer coisa que seja código ou comando, tabelas para comparações, **negrito** para termos críticos. Parágrafos de mais de 5 linhas geralmente devem ser quebrados.",
      },
      {
        title: "PR description: o que mudou e por quê",
        body: "O diff já mostra *o que* mudou — a descrição do PR deve explicar *por que* a mudança foi necessária e como testar. Inclua: contexto do problema, decisão tomada (e por que não a alternativa óbvia), como verificar que funciona, screenshots para mudanças visuais, e links para issues, specs ou ADRs relacionados.",
        code: "## O que\n- Substitui polling por WebSocket para notificações em tempo real\n- Adiciona reconexão automática com backoff exponencial\n\n## Por que\nO polling de 30s causava delay visível nas notificações e\ngerava ~50k requests desnecessários por hora no servidor.\n\n## Como testar\n1. Abra dois browsers com usuários diferentes\n2. Envie mensagem de A para B — deve aparecer em < 1s\n3. Simule queda de rede: a conexão deve se recuperar em até 30s\n\n## Notas\n- A UI mantém fallback para polling se WebSocket falhar (feature flag WS_ENABLED)\n- ADR-012 documenta por que usamos WebSocket nativo em vez de Socket.io",
      },
      {
        title: "Post-mortem: sem culpa, foco em sistema",
        body: "Post-mortem eficaz tem cinco partes: timeline objetiva do incidente (o que aconteceu, quando, quem detectou), impacto mensurável (quantos usuários, quanto tempo, custo estimado), causa raiz real usando 5 Whys (não pare no primeiro sintoma), ações de followup com dono e data específica, e lições aprendidas. A regra mais importante: sem culpa individual. A pergunta não é 'quem errou' mas 'por que o sistema permitiu esse erro acontecer'.",
      },
      {
        title: "Documentação como código — docs-as-code",
        body: "Documentação que não passa por review decai rapidamente (documentation rot). Solução: documentação vive no mesmo repositório que o código, em formato Markdown ou similar, e qualquer mudança de comportamento exige atualização do doc correspondente no mesmo PR. Code review inclui review de documentação. Para ADRs: são imutáveis — representam o passado. Decisão nova = ADR novo, nunca editar o antigo.",
      },
    ],
    diagrams: [
      {
        title: "Pirâmide invertida — estrutura de qualquer documento técnico",
        html: `<style>
.tw-wrap{font-family:'Plus Jakarta Sans',sans-serif;background:#0f172a;border-radius:12px;padding:24px;color:#e2e8f0}
.tw-pyramid{display:flex;flex-direction:column;align-items:center;gap:4px;margin:16px 0}
.tw-layer{border-radius:8px;padding:12px 20px;text-align:center;transition:opacity .2s;cursor:default}
.tw-layer:hover{opacity:.9}
.tw-lbl{font-size:12px;font-weight:700;color:#fff}
.tw-sub{font-size:10px;color:rgba(255,255,255,.65);margin-top:3px}
.tw-rule{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px 16px;margin-top:16px;font-size:11px;color:#94a3b8;line-height:1.7}
.tw-rule strong{color:#8B5CF6}
</style>
<div class="tw-wrap">
  <p style="font-size:13px;font-weight:700;margin:0 0 4px">Pirâmide invertida — informação mais importante primeiro</p>
  <p style="font-size:10px;color:#475569;margin:0">Estrutura usada em docs, ADRs, RFCs, post-mortems, PRs</p>
  <div class="tw-pyramid">
    <div class="tw-layer" style="background:#8B5CF6;width:100%;max-width:560px">
      <div class="tw-lbl">TL;DR — A Essência (2 linhas)</div>
      <div class="tw-sub">O que é isso? Qual a decisão ou conclusão? — Lido por 100% das pessoas</div>
    </div>
    <div class="tw-layer" style="background:#7C3AED;width:88%;max-width:500px">
      <div class="tw-lbl">Contexto — Por que existe?</div>
      <div class="tw-sub">Qual problema resolve? Qual era o estado anterior? Lido por ~80%</div>
    </div>
    <div class="tw-layer" style="background:#6D28D9;width:76%;max-width:440px">
      <div class="tw-lbl">Conteúdo principal</div>
      <div class="tw-sub">A proposta, a decisão, a análise detalhada. Lido por ~60%</div>
    </div>
    <div class="tw-layer" style="background:#5B21B6;width:62%;max-width:360px">
      <div class="tw-lbl">Alternativas consideradas</div>
      <div class="tw-sub">Por que não a solução óbvia? Lido por ~40% (engenheiros curiosos)</div>
    </div>
    <div class="tw-layer" style="background:#4C1D95;width:48%;max-width:280px">
      <div class="tw-lbl">Próximos passos / Referências</div>
      <div class="tw-sub">Action items, links, owners. Lido por quem precisa agir</div>
    </div>
  </div>
  <div class="tw-rule">
    <strong>Regra de ouro:</strong> quem tem 30 segundos deve conseguir entender a essência só pelo TL;DR.
    Quem tem 5 minutos entende o contexto e a decisão. Quem tem 30 minutos lê tudo.
    Estruture para os três — não sacrifique o leitor rápido pelo detalhista.
  </div>
</div>`,
        caption: "A pirâmide invertida vem do jornalismo mas se aplica perfeitamente a documentação técnica: a informação mais importante primeiro, detalhes depois.",
      },
    ],
    interview: [
      {
        q: "Como você garante que documentação fica atualizada?",
        a: "Docs-as-code: documentação vive no mesmo repositório que o código, em Markdown, e qualquer mudança de comportamento exige atualizar o doc correspondente no mesmo PR. Assim o code review também cobre o doc. Para ADRs especificamente, eles são imutáveis — representam o estado de conhecimento na época da decisão. Se a decisão muda, crio um ADR novo que supersede o anterior. Isso preserva o histórico de raciocínio que é valioso para onboarding.",
        tip: "Mostre que você pensa em docs como um sistema, não como uma tarefa manual pontual. 'Docs-as-code' é o sinal que entrevistadores de times maduros querem ouvir.",
        level: "pleno",
      },
      {
        q: "Qual a diferença entre documentar o 'o quê' e o 'por quê'? Qual é mais valioso?",
        a: "O 'o quê' está implícito no código — qualquer dev pode ler a implementação. O 'por quê' se perde com o tempo: por que escolhemos PostgreSQL em vez de MongoDB? Por que essa função tem esse comportamento aparentemente estranho? Por que abandonamos a abordagem A em favor da B? O porquê é o que tem valor meses depois quando o contexto original desapareceu. Código explica o que; comentários e ADRs explicam o porquê das decisões que não são óbvias pelo código.",
        tip: "Pergunta que separa quem pensa em manutenibilidade de longo prazo de quem pensa só na entrega imediata.",
        level: "pleno",
      },
      {
        q: "Como você estruturaria um post-mortem de um incidente de produção?",
        a: "Cinco partes: timeline objetiva (sem julgamento — o que aconteceu, quando, quem detectou), impacto mensurável (usuários afetados, tempo de degradação, custo estimado se aplicável), causa raiz usando 5 Whys (não para no primeiro sintoma — o sintoma é 'o servidor caiu', a causa raiz pode ser 'não tínhamos health check com restart automático'), ações de followup com dono e data específica, e lições aprendidas. A regra mais crítica: blameless — a pergunta não é quem errou mas por que o sistema permitiu o erro acontecer. Post-mortem com culpa individual desincentiva transparência futura.",
        tip: "A parte blameless é o que demonstra maturidade de engenharia. Times que culpam pessoas aprendem menos e têm mais problemas recorrentes.",
        level: "pleno",
      },
      {
        q: "O que faz uma boa descrição de PR?",
        a: "Uma boa PR description responde três perguntas: o que mudou (não o que o código faz — o diff já mostra isso — mas o que o sistema passa a fazer diferente), por que essa mudança era necessária (o problema que resolve, por que agora), e como verificar (passo a passo para testar, screenshots para mudanças visuais). Incluo também o que *não* mudou intencionalmente se isso pode causar dúvida, e links para issues, specs ou ADRs relacionados. O objetivo é que qualquer membro do time possa entender a PR sem precisar me perguntar nada.",
        tip: "Descrições de PR são documentação de decisões micro-arquiteturais. Times seniores levam isso a sério.",
        level: "pleno",
      },
      {
        q: "Como você escreveria documentação para uma API interna nova?",
        a: "Começo pelo overview: o que essa API faz, para quem, qual problema resolve. Depois autenticação e setup básico (o que o consumidor precisa configurar para fazer a primeira chamada funcionar). Depois cada endpoint com: método HTTP, path, parâmetros, body de request com tipos e exemplos reais, body de response com todos os campos, erros possíveis com significado de cada código. Por último, exemplos end-to-end de casos de uso reais. Uso OpenAPI/Swagger para a especificação técnica, mas mantenho um doc narrativo separado para os 'por quês' e fluxos de uso.",
        tip: "Mencionar OpenAPI e um doc narrativo separado demonstra que você sabe a diferença entre referência técnica e guia de integração.",
        level: "senior",
      },
      {
        q: "Como você lidaria com documentação para um sistema legado que ninguém documentou?",
        a: "Abordagem incremental: não tento documentar tudo de uma vez (projeto fantasma que nunca termina). Começo pelos pontos de mais dor — as partes que todo onboarding novo pergunta, os gotchas que causaram incidentes, as integrações não óbvias. Documento enquanto faço arqueologia do código — lendo, testando hipóteses, entrevistando quem construiu. Cada PR que toca código legado inclui pelo menos um aprimoramento de documentação daquela área. Depois de 3–6 meses, as partes mais críticas estão documentadas sem um projeto monumental.",
        tip: "Abordagem pragmática que funciona na prática. 'Vou documentar tudo' nunca acontece — incrementos reais acontecem.",
        level: "senior",
      },
    ],
    gotchas: [
      "Documentar o 'o quê' em vez do 'por quê' — o código já explica o que. O porquê das decisões é o que se perde com o tempo.",
      "Documentação escrita no momento da entrega, nunca atualizada — documentation rot. Docs que mentem são piores que ausência de docs.",
      "Jargão sem definição para audiência que não conhece o contexto — impede entendimento e cria barreira para novos membros.",
      "Post-mortem com culpa individual — desincentiva transparência e impede aprendizado sistêmico futuro.",
      "TL;DR ausente ou genérico — documentos que exigem leitura completa para entender o ponto principal são ignorados.",
    ],
    resources: [
      { title: "Google Technical Writing Courses", url: "https://developers.google.com/tech-writing", kind: "curso" },
      { title: "Write the Docs", url: "https://www.writethedocs.org/", kind: "docs" },
      { title: "The Documentation System (Diátaxis)", url: "https://diataxis.fr/", kind: "artigo" },
      { title: "Pyramid Principle (Minto)", url: "https://www.amazon.com/Minto-Pyramid-Principle-Writing-Thinking/dp/0960191038", kind: "livro" },
    ],
  },

  "adrs-rfcs": {
    tagline: "Documentar decisões arquiteturais (ADR) e propor mudanças significativas (RFC) de forma assíncrona e colaborativa.",
    why: "ADRs evitam que as mesmas decisões sejam rediscutidas a cada seis meses quando o contexto original foi embora. RFCs alinham times antes de implementar — não depois. São as práticas que separam times que escalam decisões técnicas de times que tomam as mesmas decisões ruins repetidamente.",
    summary: "ADR (Architecture Decision Record) documenta uma decisão arquitetural significativa capturando o contexto no momento da decisão, as alternativas consideradas, a decisão tomada e suas consequências esperadas. É imutável — representa o passado. Nunca se edita um ADR aceito: se a decisão muda, cria-se um novo ADR que supersede o anterior. RFC (Request for Comments) é uma proposta de mudança significativa aberta para revisão e feedback do time antes de implementar — o documento existe para colher perspectivas que o autor sozinho não teria. Ambos funcionam como mecanismo de decisão técnica assíncrona e distribuída, reduzindo a dependência de reuniões e preservando o raciocínio que guiou cada escolha.",
    keypoints: [
      {
        title: "ADR: estrutura mínima",
        body: "Título (ADR-001: Usar PostgreSQL como banco primário). Status (Proposto, Aceito, Deprecado, Substituído por ADR-N). Contexto: qual era o problema, quais eram os constraints, o que estava em jogo. Decisão: o que foi decidido e por quê. Consequências: o que fica mais fácil, o que fica mais difícil, o que foi aceito como tradeoff.",
        code: "# ADR-007: Usar localStorage para tokens de autenticação\n\n## Status\nAceito (2024-03-15)\n\n## Contexto\nPrecisamos persistir o token JWT entre recarregamentos de página.\nOpções consideradas: localStorage, sessionStorage, cookies HttpOnly.\n\n## Decisão\nUsamos localStorage para simplicidade de implementação no MVP.\n\n## Consequências\n+ Implementação simples, sem config de backend para cookies\n+ Funciona com qualquer domínio sem CORS adicional\n- Vulnerável a XSS (mitigado por nosso CSP rigoroso)\n- Não compartilha sessão entre abas (aceito como tradeoff no MVP)\n\nSubstituído por ADR-018 quando migrarmos para cookies HttpOnly.",
      },
      {
        title: "ADR: imutabilidade e histórico",
        body: "ADR representa o estado de conhecimento e contexto no momento da decisão. Nunca edite um ADR aceito — isso destrói a evidência histórica. Se a decisão muda, crie um novo ADR com 'Supersede: ADR-007' no cabeçalho e marque o ADR original com 'Status: Substituído por ADR-018'. O valor está exatamente nisso: 18 meses depois qualquer dev pode ler a sequência de ADRs e entender por que o sistema evoluiu.",
      },
      {
        title: "ADR: o que merece um ADR",
        body: "Reserve para decisões com impacto significativo e durável: escolha de banco de dados, linguagem ou framework principal, estratégia de autenticação, padrão de comunicação entre serviços, mudança de arquitetura, adoção de um novo padrão que toda a codebase seguirá. Não para cada decisão de implementação — ficaria inviável. Uma heurística: se a decisão vai gerar a pergunta 'por que fizemos assim?' nos próximos 12 meses, merece um ADR.",
      },
      {
        title: "RFC: estrutura e processo",
        body: "Sumário executivo (problema + proposta em 3 linhas). Motivação: qual problema exato está sendo resolvido, com dados. Proposta detalhada: como funciona, exemplos, casos de borda. Alternativas consideradas com prós e contras explícitos. Perguntas abertas para o time responder. Data de fechamento para feedback (sem data = debate eterno).",
        code: "# RFC-003: Migrar processamento de emails para fila assíncrona\n\n## Sumário\nEmails síncronos causam timeout em requests de checkout.\nProposta: usar BullMQ com Redis para processar emails em background.\n\n## Motivação\n- p99 do checkout endpoint: 3.2s (SLO: 800ms)\n- Profiling: 2.1s são gasto no envio de email de confirmação\n- 3 timeouts por hora em produção nas últimas 2 semanas\n\n## Proposta\n[detalhe técnico aqui]\n\n## Alternativas\n- SQS: mais robusto para escala, mas adiciona dependência AWS (+custo)\n- Fire-and-forget sem fila: simples mas sem retry em falha\n\n## Perguntas abertas\n1. Quantas workers precisamos para o volume atual?\n2. Qual estratégia de retry para bounces?\n\n## Feedback até: 2024-04-01",
      },
      {
        title: "Docs as code — ADRs no repositório",
        body: "ADRs e RFCs vivem em um diretório /docs/decisions/ no repositório. São revisados em PR como qualquer código. O histórico do git preserva quem propôs, quem revisou e quando foi aceito. Facilita busca (grep por tecnologia ou padrão), referência cruzada (links entre ADRs), e integra naturalmente ao fluxo de desenvolvimento.",
      },
      {
        title: "RFC vs ADR — quando usar cada um",
        body: "RFC é prospectivo — propõe algo que ainda não foi decidido, abre para debate, pode ser rejeitado. ADR é retrospectivo — documenta uma decisão já tomada (ou em processo de ser tomada). Uma RFC bem discutida geralmente resulta em um ADR quando aceita. Para mudanças simples e não controversas, pode-se ir direto ao ADR. Para mudanças com múltiplas alternativas ou alto impacto, comece com RFC para colher perspectivas antes de decidir.",
      },
    ],
    diagrams: [
      {
        title: "ADR vs RFC — ciclo de vida de uma decisão técnica",
        html: `<style>
.adr-wrap{font-family:'Plus Jakarta Sans',sans-serif;background:#0f172a;border-radius:12px;padding:24px;color:#e2e8f0}
.adr-flow{display:flex;align-items:center;gap:0;margin:16px 0;overflow-x:auto;padding-bottom:4px}
.adr-box{background:#1e293b;border-radius:10px;padding:14px 16px;min-width:130px;text-align:center;border:1.5px solid #334155;flex-shrink:0}
.adr-box:hover{border-color:#8B5CF6}
.adr-box-title{font-size:11px;font-weight:700;color:#e2e8f0;margin-bottom:4px}
.adr-box-sub{font-size:9px;color:#64748b;line-height:1.5}
.adr-arrow{color:#334155;font-size:20px;padding:0 6px;flex-shrink:0}
.adr-status{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
.adr-badge{font-size:9px;font-weight:700;border-radius:4px;padding:3px 8px;letter-spacing:.06em;text-transform:uppercase}
.adr-compare{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:16px}
.adr-col{background:#1e293b;border-radius:10px;padding:14px}
.adr-col-title{font-size:11px;font-weight:700;margin-bottom:8px}
.adr-col-item{font-size:10px;color:#94a3b8;line-height:1.7;display:flex;gap:6px;align-items:flex-start}
</style>
<div class="adr-wrap">
  <p style="font-size:13px;font-weight:700;margin:0 0 4px">Ciclo de vida de uma decisão técnica</p>
  <p style="font-size:10px;color:#475569;margin:0 0 16px">RFC para propor e debater → ADR para registrar e preservar</p>
  <div class="adr-flow">
    <div class="adr-box" style="border-color:rgba(139,92,246,.4)">
      <div class="adr-box-title" style="color:#8B5CF6">Problema</div>
      <div class="adr-box-sub">Situação que requer uma decisão arquitetural</div>
    </div>
    <div class="adr-arrow">→</div>
    <div class="adr-box">
      <div class="adr-box-title">RFC</div>
      <div class="adr-box-sub">Proposta aberta para feedback (1–2 semanas)</div>
    </div>
    <div class="adr-arrow">→</div>
    <div class="adr-box">
      <div class="adr-box-title">Revisão</div>
      <div class="adr-box-sub">Time comenta, questiona, sugere alternativas</div>
    </div>
    <div class="adr-arrow">→</div>
    <div class="adr-box" style="border-color:rgba(139,92,246,.4)">
      <div class="adr-box-title" style="color:#8B5CF6">ADR</div>
      <div class="adr-box-sub">Decisão final documentada (imutável)</div>
    </div>
    <div class="adr-arrow">→</div>
    <div class="adr-box">
      <div class="adr-box-title">Implementação</div>
      <div class="adr-box-sub">Código alinhado com a decisão documentada</div>
    </div>
  </div>
  <div class="adr-status">
    <span class="adr-badge" style="background:rgba(234,179,8,.15);color:#eab308">Proposto</span>
    <span style="font-size:10px;color:#475569;line-height:2">→</span>
    <span class="adr-badge" style="background:rgba(34,197,94,.15);color:#22c55e">Aceito</span>
    <span style="font-size:10px;color:#475569;line-height:2">ou</span>
    <span class="adr-badge" style="background:rgba(239,68,68,.15);color:#ef4444">Rejeitado</span>
    <span style="font-size:10px;color:#475569;line-height:2">→ no futuro →</span>
    <span class="adr-badge" style="background:rgba(100,116,139,.15);color:#94a3b8">Deprecado</span>
    <span style="font-size:10px;color:#475569;line-height:2">ou</span>
    <span class="adr-badge" style="background:rgba(139,92,246,.15);color:#8B5CF6">Substituído por ADR-N</span>
  </div>
  <div class="adr-compare">
    <div class="adr-col" style="border:1px solid #334155">
      <div class="adr-col-title" style="color:#8B5CF6">RFC — para propor</div>
      <div class="adr-col-item"><span style="color:#8B5CF6;margin-top:2px">▸</span>Prospectivo (futuro)</div>
      <div class="adr-col-item"><span style="color:#8B5CF6;margin-top:2px">▸</span>Pode ser rejeitado ou modificado</div>
      <div class="adr-col-item"><span style="color:#8B5CF6;margin-top:2px">▸</span>Inclui perguntas abertas</div>
      <div class="adr-col-item"><span style="color:#8B5CF6;margin-top:2px">▸</span>Tem data de fechamento de feedback</div>
    </div>
    <div class="adr-col" style="border:1px solid #334155">
      <div class="adr-col-title" style="color:#22c55e">ADR — para registrar</div>
      <div class="adr-col-item"><span style="color:#22c55e;margin-top:2px">▸</span>Retrospectivo (passado)</div>
      <div class="adr-col-item"><span style="color:#22c55e;margin-top:2px">▸</span>Imutável — representa o contexto da época</div>
      <div class="adr-col-item"><span style="color:#22c55e;margin-top:2px">▸</span>Inclui consequências e tradeoffs aceitos</div>
      <div class="adr-col-item"><span style="color:#22c55e;margin-top:2px">▸</span>Novo ADR para cada mudança de decisão</div>
    </div>
  </div>
</div>`,
        caption: "RFC e ADR têm papéis diferentes: RFC abre espaço para debate antes da decisão; ADR preserva o raciocínio depois. Usados juntos, eliminam a maior parte das reuniões de alinhamento técnico.",
      },
    ],
    interview: [
      {
        q: "Para que serve um ADR e quando você criaria um?",
        a: "ADR documenta o contexto e o raciocínio por trás de uma decisão arquitetural significativa. Serve para três coisas: novos membros entenderem por que o sistema é como está sem ter que perguntar, evitar rediscutir decisões que já foram tomadas com contexto completo, e revisar decisões quando o contexto original muda. Criaria para: escolha de banco de dados, estratégia de autenticação, padrão de comunicação entre serviços, framework principal, mudança de estratégia de deployment — qualquer decisão que vai gerar 'por que fizemos assim?' nos próximos 12 meses.",
        tip: "A pergunta testa se você sabe articular o valor — não só o formato. Foque no problema que o ADR resolve (decisões repetidas, contexto perdido) antes de descrever a estrutura.",
        level: "pleno",
      },
      {
        q: "Por que um ADR deve ser imutável? O que fazer quando a decisão muda?",
        a: "Um ADR documenta o estado de conhecimento no momento da decisão — inclusive os constraints e limitações que existiam naquele momento. Editar o ADR original 'para corrigir' apaga exatamente isso: a evidência de por que a decisão fazia sentido naquele contexto. Quando a decisão muda, crio um novo ADR que referencia explicitamente qual ADR anterior está sendo superado ('Supersede: ADR-007') e qual é o novo contexto que justifica a mudança. O ADR original recebe 'Status: Substituído por ADR-018'. Quem quiser entender a evolução lê a sequência.",
        tip: "Imutabilidade parece contraintuitivo mas é a propriedade mais importante. Resposta que demonstra que você entende o propósito — não só o formato.",
        level: "pleno",
      },
      {
        q: "Qual é a diferença entre RFC e ADR? Em que situações você usaria cada um?",
        a: "RFC é prospectivo: propõe uma mudança ainda não decidida, abre para feedback e pode ser rejeitado ou modificado. ADR é retrospectivo: documenta uma decisão já tomada de forma imutável. Para mudanças simples e não controversas, vou direto ao ADR. Para mudanças com múltiplas alternativas viáveis ou alto impacto — novo serviço, mudança de linguagem, padrão que vai afetar toda a codebase — começo com RFC para colher perspectivas que eu sozinho não teria. Uma RFC bem aceita normalmente resulta num ADR.",
        tip: "Mostre que você entende o propósito de cada um — RFC como ferramenta de alinhamento, ADR como ferramenta de memória institucional.",
        level: "pleno",
      },
      {
        q: "Como você evitaria que um processo de RFC virasse um debate infinito sem decisão?",
        a: "Três mecanismos: data de fechamento explícita no próprio RFC (sem data = debate eterno, isso é regra), decision owner claro — uma pessoa tem autoridade de decidir depois de colher o feedback (decisão por consenso de 10 pessoas raramente funciona), e perguntas abertas explícitas no RFC para focar o feedback no que realmente importa. Quando chega a data, o owner consolida o feedback, documenta as perspectivas consideradas, e fecha o RFC como aceito ou rejeitado — com justificativa.",
        tip: "Pergunta que testa se você sabe que processo sem estrutura não funciona. Decision owner explícito é a peça que a maioria esquece.",
        level: "pleno",
      },
      {
        q: "Como você introduziria a prática de ADRs em um time que nunca usou?",
        a: "Começo pequeno: próxima decisão técnica significativa que aparecer, escrevo o ADR e submeto junto com o PR. Explico o contexto para o time — não como processo obrigatório, mas como 'achei útil documentar o raciocínio desta decisão'. Se a prática mostrar valor (e geralmente mostra quando alguém novo chega e entende o sistema mais rápido), o time adota organicamente. Evito impor um novo processo de cima para baixo — adoção voluntária é mais sustentável. Crio um template simples e deixo em /docs/decisions/TEMPLATE.md.",
        tip: "Abordagem bottom-up demonstra liderança técnica madura — você mostra o valor antes de pedir adoção.",
        level: "senior",
      },
      {
        q: "Que decisões NÃO merecem um ADR?",
        a: "Decisões de implementação que não têm impacto duradouro ou que são facilmente reversíveis: nome de uma variável, estrutura de um módulo específico, biblioteca de utilitários minor, formatação de código (isso é config do linter). O critério que uso: 'se mudarmos isso em 6 meses, vai ser simples e sem impacto? Então não precisa de ADR.' ADR para cada decisão criaria overhead que desincentivaria a prática — o custo do processo precisa ser proporcional ao valor da decisão.",
        tip: "Saber quando NÃO usar uma ferramenta demonstra mais maturidade do que saber quando usar.",
        level: "senior",
      },
    ],
    gotchas: [
      "ADR escrito depois da decisão já tomada sem nenhum input do time — perde o valor de alinhar perspectivas antes de implementar.",
      "RFC sem data de fechamento de feedback — debate vira ad infinitum, decisão nunca acontece.",
      "ADR editado para 'corrigir' o passado — destrói exatamente o que tem valor: o contexto histórico da época da decisão.",
      "ADR para toda pequena decisão de implementação — overhead administrativo que desincentiva a prática e dilui o sinal.",
      "RFC sem decision owner claro — feedback acumulado sem síntese, responsabilidade difusa, ninguém fecha.",
    ],
    resources: [
      { title: "Michael Nygard — ADRs (artigo original)", url: "https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions", kind: "artigo" },
      { title: "ADR GitHub organization", url: "https://adr.github.io/", kind: "docs" },
      { title: "MADR — Markdown ADR template", url: "https://adr.github.io/madr/", kind: "docs" },
      { title: "RFC process da Rust Foundation (referência)", url: "https://github.com/rust-lang/rfcs", kind: "docs" },
    ],
  },

  /* ─────────────────────────────────────────── P2 ─────────────────────────── */

  "espanhol": {
    tagline: "Espanhol técnico funcional — abre mercado LATAM, Espanha e times hispânicos.",
    why: "Espanhol é o segundo idioma do mercado tech nas Américas. Dezenas de empresas brasileiras têm operações na LATAM, e o mercado remoto hispanófono cresce com muita demanda por devs com stack moderno. Com inglês já desenvolvido, espanhol é o complemento de maior ROI — a proximidade com português reduz o tempo de aprendizado em 60%.",
    summary: "Para carreira tech, espanhol funcional (B1–B2) já abre portas significativas: vagas remotas em empresas da Espanha e LATAM, comunicação com clientes hispânicos, e participação em comunidades técnicas de língua espanhola que são grandes e ativas. A proximidade linguística com o português é a maior vantagem: vocabulário técnico é em grande parte inglês de qualquer forma (deploy, framework, backend, commit), e o vocabulário geral compartilhado é de 70–80%. O caminho mais eficiente é imersão progressiva: séries e podcasts em espanhol, troca de idioma de alguns apps, e conversação com nativos via intercâmbio de idiomas.",
    keypoints: [
      {
        title: "Alavancagem do português",
        body: "70–80% de vocabulário compartilhado. Gramática similar (gênero, conjugação, preposições). Principais desafios: falsos cognatos ('embarazada' = grávida, não embaraçada), diferenças de pronuncia (especialmente s/z/c na Espanha vs LATAM), e vocabulário cotidiano específico. A estrutura mental de aprendizado é muito mais rápida do que inglês foi.",
      },
      {
        title: "Espanhol técnico tem muitos anglicismos",
        body: "No contexto tech, a maioria dos termos são iguais ao inglês: servidor, deploy, framework, backend, commit, merge, pull request, bug, feature, sprint, stakeholder. A comunicação técnica em espanhol é mais fácil do que parece porque o vocabulário especializado já é familiar. O trabalho é na comunicação geral: reuniões, Slack, e-mail, explicações não técnicas para clientes.",
      },
      {
        title: "Prática deliberada para B1 em 3–6 meses",
        body: "Com base em inglês já desenvolvida, B1 funcional em espanhol é atingível em 3–6 meses com prática diária consistente. Duolingo/Babbel para vocabulário base. Séries na Netflix em espanhol (La Casa de Papel, Club de Cuervos). Podcasts em espanhol lento (News in Slow Spanish). Conversação com nativo via Tandem ou italki. Leitura de notícias tech em espanhol (xataka.com, genbeta.com).",
      },
      {
        title: "Variação regional — Espanha vs LATAM",
        body: "Existem diferenças de vocabulário e pronúncia entre Espanha e LATAM — e entre países da LATAM entre si. Para tech, as diferenças são mínimas e o contexto resolve ambiguidade. Foque no espanhol neutro (LATAM padrão) se o objetivo for alcance máximo. Se o target for uma empresa específica da Espanha, adapte um pouco o vocabulário cotidiano.",
      },
    ],
    interview: [
      {
        q: "¿Cuál es tu nivel de español técnico?",
        a: "Mi español es funcional para comunicación técnica escrita — puedo leer documentación, escribir en Slack, participar en canales técnicos y entender reuniones en tiempo real. Lo estoy practicando activamente. Mi punto fuerte es el vocabulario técnico, que en gran parte es inglés. El mayor desafío es la conversación fluida en tiempo real, que estoy mejorando con práctica diaria.",
        tip: "Resposta honesta que mostra iniciativa. Não minta sobre o nível — um nativo vai perceber. Demonstre que você sabe exatamente onde está e tem um plano.",
        level: "pleno",
      },
      {
        q: "Como você aprenderia espanhol eficientemente dado que já tem inglês sólido?",
        a: "A proximidade com português é a maior vantagem — o vocabulário compartilhado é 70–80%. Minha estratégia: imersão progressiva com Duolingo para base, séries em espanhol na Netflix sem legendas em PT, intercâmbio de idioma com nativo via Tandem ou italki para conversação real, e leitura de conteúdo tech em espanhol (Xataka, Genbeta). O foco ativo é nos falsos cognatos e nas nuances de vocabulário cotidiano — o tech já é familiar.",
        tip: "Demonstra que você tem um método, não só uma intenção. Mencionar falsos cognatos mostra que você pesquisou os pontos críticos.",
        level: "pleno",
      },
      {
        q: "Quais são os maiores gaps de quem tenta falar espanhol com base em português?",
        a: "Três gaps principais: falsos cognatos (embarazada = grávida, no embaraçada; borracha = bêbada, no borracha), pronúncia — especialmente o 'll' e 'ñ' e a diferença entre Espanha e LATAM no 'c/z', e o vocabulário cotidiano informal que não tem equivalente óbvio do português. A gramática e o vocabulário técnico são fáceis — o cotidiano informal é onde o erro acontece.",
        tip: "Resposta que demonstra pesquisa e autoconhecimento do processo de aprendizado.",
        level: "pleno",
      },
      {
        q: "Por que você investiria em espanhol dado que já tem inglês?",
        a: "ROI complementar: inglês cobre o mercado global, espanhol cobre o mercado LATAM e Espanha especificamente. Com a tendência de trabalho remoto, muitas empresas da LATAM contratam devs brasileiros. Também há empresas brasileiras com operações em países hispânicos onde comunicar diretamente com clientes e times locais agrega valor. E o custo de aprendizado é muito menor do que inglês foi — com inglês consolidado, B1 em espanhol é 3–4 meses de prática consistente.",
        tip: "Mostre pensamento estratégico sobre carreira, não só habilidade linguística.",
        level: "pleno",
      },
    ],
    gotchas: [
      "Assumir que português + inglês resolve tudo — espanhol abre o mercado LATAM especificamente, que não fala inglês no dia a dia.",
      "Confundir falsos cognatos — 'embarazada', 'borracha', 'polvo' têm significados completamente diferentes em espanhol.",
      "Ignorar a variação regional — espanhol da Espanha vs México vs Argentina tem diferenças que podem causar confusão inicial.",
    ],
    resources: [
      { title: "Duolingo Espanhol", url: "https://www.duolingo.com/", kind: "pratica" },
      { title: "News in Slow Spanish (podcast)", url: "https://www.newsinslowspanish.com/", kind: "video" },
      { title: "Tandem — intercâmbio de idiomas", url: "https://www.tandem.net/", kind: "pratica" },
      { title: "Xataka — tech em espanhol", url: "https://www.xataka.com/", kind: "artigo" },
    ],
  },

  "comunicacao": {
    tagline: "Comunicação técnica eficaz para audiências diferentes — a habilidade que multiplica todo o restante.",
    why: "Senior mal comunicado tem impacto limitado ao próprio trabalho. Senior que comunica bem multiplica o impacto do time inteiro — clarifica o problema certo, alinha antes de implementar, comunica riscos antes de virarem incidentes, e traduz tecnologia para negócio. É a diferença entre um desenvolvedor de código e um engenheiro com influência.",
    summary: "Comunicação em engenharia tem dois eixos: audiência (técnico, produto, negócio, management) e canal (assíncrono escrito, síncrono reunião, apresentação formal). A habilidade central é calibrar a mensagem para a audiência — o que ela precisa entender para tomar a decisão certa, não o que você quer demonstrar que sabe. Comunicação assíncrona bem feita elimina a maioria das reuniões desnecessárias e escala melhor. Feedback técnico eficaz é específico, acionável e separa pessoa da ideia. Comunicação ascendente (para management) foca em impacto de negócio e riscos, não em detalhes de implementação.",
    keypoints: [
      {
        title: "Audiência primeiro — sempre",
        body: "Antes de escrever ou falar, responda: quem é essa pessoa? O que ela precisa entender? Qual é a decisão que ela vai tomar com essa informação? Um junior que precisa implementar precisa de clareza técnica e passo a passo. Um manager que precisa alocar recursos precisa de impacto em negócio e risco. Um cliente técnico precisa de evidência, não de promessa. A mensagem que serve a todos geralmente não serve bem a ninguém.",
      },
      {
        title: "Assíncrono por padrão",
        body: "Escreva para async primeiro: documenta, preserva histórico, escala, permite que a outra pessoa leia no melhor momento dela. Reserve reunião para o que genuinamente precisa de sincronia: debate complexo com múltiplas perspectivas, alinhamento emocional, decisão urgente que precisa de input imediato. 'Podemos resolver isso por texto?' deve ser a primeira pergunta antes de marcar qualquer reunião.",
      },
      {
        title: "Precisão: números e exemplos concretos",
        body: "'O sistema está lento' é comunicação ruim. 'A latência p99 do endpoint de checkout subiu de 180ms para 1.2s entre 14h e 16h de ontem, afetando ~3% das transações' é comunicação precisa. Quantifique impacto, especifique tempo e contexto, use exemplos reais. Abstração genérica protege quem fala mas não serve quem ouve.",
      },
      {
        title: "Feedback técnico eficaz",
        body: "Critique o código, não o autor. Seja específico e acionável: 'este trecho não tem tratamento de erro para quando o serviço externo retorna 503 — em produção isso causaria cascata de falha' é útil. 'Este código é ruim' não é. Explique o porquê — a pessoa precisa aprender, não só corrigir. Reconheça o que está bom — feedback 100% crítico desincentiva.",
      },
      {
        title: "Comunicação ascendente — o que management precisa",
        body: "Manager precisa de: status do que impacta o negócio, riscos antecipados com severidade e probabilidade, dependências externas que podem atrasar, o que você precisa de apoio. Não precisa de: detalhes de implementação, débito técnico sem impacto de negócio claro, problemas sem proposta de solução. Traduza: 'o ORM não suporta transações distribuídas' → 'migrar para múltiplos bancos vai exigir 4–6 semanas de refatoração ou teremos inconsistências de dados'.",
      },
    ],
    interview: [
      {
        q: "Como você se comunica de forma diferente com um engenheiro e com um stakeholder de negócio?",
        a: "Com o engenheiro: foco em causa raiz, tradeoffs técnicos, comportamento do sistema, decisões de implementação — posso usar jargão porque ele conhece o contexto. Com o stakeholder: foco em impacto de negócio (usuários afetados, receita impactada, prazo, risco), eliminando jargão técnico ou traduzindo quando necessário. 'Nossa instância RDS está com CPU a 95%' → 'o banco de dados está próximo do limite de capacidade — se o tráfego crescer 20% sem upgrade, teremos degradação de performance que afeta o checkout'. A mesma informação, enquadramentos completamente diferentes.",
        tip: "Pergunta clássica que separa devs que só falam com devs de engenheiros que influenciam toda a organização.",
        level: "pleno",
      },
      {
        q: "Como você dá feedback construtivo em code review sem criar atrito com o colega?",
        a: "Três princípios: critique o código, não a pessoa (use 'este bloco' em vez de 'você fez'); seja específico e explique o porquê (não só 'está errado', mas 'pode causar race condition quando duas requisições chegam simultaneamente porque o lock não cobre este trecho'); e sinalize claramente o que é blocker vs sugestão ('Blocker:', 'Sugestão:', 'Nitpick:'). Também reconheço quando vejo algo bem feito — review 100% crítico cria defensividade.",
        tip: "Demonstra maturidade de colaboração. Times seniores têm culture de review que eleva o nível sem criar atrito.",
        level: "pleno",
      },
      {
        q: "Como você comunicaria um risco técnico importante para um produto que está prestes a ser lançado?",
        a: "Direto e cedo — não espero o lançamento para revelar o risco. Formulo em termos de impacto e probabilidade: 'identificamos que o sistema de checkout não tem retry em caso de timeout no pagamento externo — probabilidade de falha silenciosa em ~2% das transações sob carga de lançamento'. Apresento junto com opções: 'podemos atrasar 2 dias para implementar o retry, ou lançar com monitoring intenso e rollback rápido se a taxa de falha superar X%'. A decisão é da liderança, mas com informação completa.",
        tip: "Senior comunica riscos cedo com opções, não esconde riscos com medo de ser o portador de más notícias.",
        level: "pleno",
      },
      {
        q: "Quando você prefere comunicação assíncrona versus uma reunião?",
        a: "Assíncrona por padrão para: atualizações de status, decisões com contexto que precisa ser lido cuidadosamente, propostas técnicas onde o time precisa de tempo para processar, e qualquer coisa que pode esperar até o fim do dia. Reunião quando genuinamente necessário: débate técnico complexo onde a conversa em tempo real resolve mais rápido que trocas de texto, alinhamento em situação de conflito ou tensão, e decisão urgente que precisa de input simultâneo. Minha regra: 'se consigo escrever isso num parágrafo claro, não precisa de reunião'.",
        tip: "Em times remotos, habilidade de comunicar bem assincronamente é o que diferencia produtividade real de ruído de reuniões.",
        level: "senior",
      },
    ],
    gotchas: [
      "Usar jargão técnico com audiência não técnica — impede entendimento e cria distância em vez de confiança.",
      "Marcar reunião para informação que deveria ser texto — interrompe flow, não escala, não preserva histórico.",
      "Feedback sem especificidade — 'esse código é ruim' não ensina e gera defensividade.",
      "Omitir riscos por medo de parecer negativo — senior comunica riscos cedo com opções, não esconde.",
    ],
    resources: [
      { title: "Nonviolent Communication (Rosenberg)", url: "https://www.nonviolentcommunication.com/", kind: "livro" },
      { title: "Pyramid Principle (Minto)", url: "https://www.amazon.com/Minto-Pyramid-Principle-Writing-Thinking/dp/0960191038", kind: "livro" },
      { title: "No Hello — guia de comunicação async", url: "https://nohello.net/", kind: "artigo" },
    ],
  },

  "lideranca": {
    tagline: "Liderança técnica sem autoridade formal — de sênior a tech lead que multiplica o time.",
    why: "A transição de sênior para staff ou tech lead é principalmente sobre liderança técnica. Entregar código excelente individualmente chega a um plateau — o próximo nível é multiplicar o output do time, clarificar direção técnica, elevar a qualidade via mentoria e review, e traduzir tecnologia para negócio. Habilidade que determina se você avança na carreira ou fica como individual contributor sênior.",
    summary: "Liderança técnica não é título — é comportamento. Um tech lead eficaz faz cinco coisas: clarifica a direção técnica do time (visão, padrões, decisões) para que todos trabalhem coerentemente; eleva a qualidade do time via code review, pair programming e mentoria — não só conserta o código mas ensina como pensar; faz tradeoffs explícitos com contexto completo em vez de decidir autoritariamente; comunica tecnologia para negócio traduzindo constraints técnicos em impacto e risco; e cria condições para o time entregar sem dependência de uma única pessoa. Tech lead que faz tudo sozinho é um individual contributor com título — o que multiplica é criar condições para que outros também deliveriem bem.",
    keypoints: [
      {
        title: "Liderança sem hierarquia — influência por expertise",
        body: "Você lidera sendo a referência técnica, documentando bem, fazendo reviews de alta qualidade, e propondo soluções claras — não por ter um título. Influência por autoridade é frágil e resistida; influência por expertise é respeitada e seguida organicamente. 'O que você faria aqui?' é a pergunta que você quer que o time faça naturalmente.",
      },
      {
        title: "Decisões técnicas: facilitar, não impor",
        body: "Tech lead eficaz clarifica constraints e contexto, propõe opções com tradeoffs explícitos, e facilita a decisão do time em vez de decidir sozinho. Quando a decisão é sua, explique o raciocínio completo — o time que entende o porquê implementa melhor e questiona quando o contexto muda. ADRs são a ferramenta que torna isso escalável.",
      },
      {
        title: "Mentoria técnica que eleva o time",
        body: "Code review com ensinamento, não só apontando erros — explique o princípio por trás da correção. Pair programming intencional em partes complexas do sistema onde o conhecimento precisa ser transferido. 1:1 técnico para entender onde a pessoa quer crescer e criar oportunidades alinhadas. O objetivo é que o time inteiro possa tomar boas decisões técnicas sem depender de você em cada uma.",
      },
      {
        title: "Visibilidade de riscos — ponte com o negócio",
        body: "Identifica e comunica dívida técnica, single points of failure, dependências críticas e riscos arquiteturais com impacto de negócio traduzido. Não 'temos débito técnico no módulo de pagamento' mas 'o módulo de pagamento tem lógica duplicada em três lugares — risco de inconsistência que pode causar cobranças incorretas, estimo 2 semanas para resolver antes de escalarmos para novos mercados'.",
      },
      {
        title: "Redução de bus factor — documentação e onboarding",
        body: "Tech lead bom reduz o bus factor do time. Documenta decisões arquiteturais (ADRs), escreve runbooks para operações críticas, cria guias de onboarding que permitem que um novo dev contribua em dias em vez de semanas. Quando você é o único que sabe como algo funciona, isso é um risco para o time — não um sinal de valor.",
      },
      {
        title: "O que tech lead NÃO é",
        body: "Tech lead não é gerente de pessoas — isso é papel do engineering manager. Não é o único que pode fazer code review — é quem eleva a qualidade geral do processo. Não é arquiteto que decide tudo sozinho — é facilitador de decisões técnicas. E definitivamente não é quem faz tudo sozinho para garantir que saia certo — isso cria dependência, esgota, e não escala.",
      },
    ],
    interview: [
      {
        q: "Como você lideraria tecnicamente sem ter autoridade formal?",
        a: "Através de expertise e consistência. Quando faço reviews de qualidade que ensinam em vez de só corrigir, o time passa a valorizar meu input naturalmente. Quando proponho soluções com tradeoffs explícitos em vez de apenas criticar, crio credibilidade. Quando documento decisões e raciocínio de forma que qualquer um possa entender, os outros passam a buscar minha perspectiva. Liderança técnica que precisa de autoridade formal para funcionar não é liderança — é gestão.",
        tip: "Resposta que demonstra modelo mental maduro sobre influência em engenharia.",
        level: "pleno",
      },
      {
        q: "Como você comunicaria débito técnico para um stakeholder de negócio que quer priorizar novas features?",
        a: "Traduzo para impacto de negócio e risco concreto. Não 'temos débito técnico no módulo de pagamentos' — mas 'o módulo de pagamentos tem lógica crítica sem cobertura de testes e duplicada em três lugares. Hoje isso significa que qualquer nova feature de pagamento leva 3x mais tempo e tem risco de regressão em produção. Estimativa: 3 semanas de refatoração agora reduzem o custo de cada feature de pagamento futura em ~50% e eliminam o risco de incidente de cobrança incorreta'. Apresento junto com opções e deixo a decisão com quem tem contexto de negócio.",
        tip: "Habilidade crítica de tech lead — transformar problema técnico em decisão de negócio informada.",
        level: "pleno",
      },
      {
        q: "Como você faria o onboarding de um novo engenheiro no time?",
        a: "Começo mapeando o que ele precisa saber nas primeiras duas semanas para ser autônomo nas tarefas básicas — não tudo de uma vez. Setup do ambiente com documentação atualizada (se não existe ou está desatualizada, esse é o primeiro sinal de um problema a resolver). Pair programming nas primeiras tasks para que ele veja como o time trabalha na prática. Apresentação das pessoas e seus papéis. Indicação dos documentos mais importantes: ADRs principais, runbooks, guia de arquitetura. E check-in no final da primeira semana para ver onde estão os bloqueios.",
        tip: "Onboarding eficaz é sinal de maturidade do time. Resposta que mostra que você pensa em documentação e autonomia, não em dependência.",
        level: "pleno",
      },
      {
        q: "Como você lidaria com um conflito técnico persistente no time?",
        a: "Primeiro separo o que é diferença de preferência (onde qualquer solução razoável serve) de diferença de princípio com impacto real. Para preferências: decisão rápida, seguimos em frente, ninguém morre. Para diferenças com impacto real: peço que os dois lados escrevam suas posições com tradeoffs explícitos — isso geralmente clarifica onde a discordância real está. Se ainda não há consenso, identifico quem tem mais contexto sobre o caso de uso e dou mais peso à perspectiva dessa pessoa. Se sou eu quem decide: explico o raciocínio completo, registro no ADR e garantimos que quem discordou entende por que essa foi a escolha.",
        tip: "Conflito técnico mal gerenciado cria rancor. A chave é tornar a discordância explícita e racional, não emocional.",
        level: "senior",
      },
      {
        q: "O que você faz diferente como tech lead para não se tornar um gargalo do time?",
        a: "Três princípios: evito ser o único ponto de aprovação para qualquer coisa (delegue autoridade de review, não só responsabilidade), invisto ativamente em distribuir conhecimento (pair programming, documentação, ADRs — para que o time possa tomar decisões sem mim), e crio critérios claros em vez de responder cada caso individualmente ('quando usar async messaging vs REST? quando o produtor e o consumidor têm ciclos de vida independentes ou carga diferente — aqui está o critério, decidam sem precisar me perguntar'). Tech lead que é gargalo falhou na missão principal.",
        tip: "A resposta que entrevistadores de staff level adoram ouvir — você pensa em escalabilidade do time, não só em execução.",
        level: "senior",
      },
    ],
    gotchas: [
      "Tech lead que faz tudo sozinho por não confiar no time — cria dependência, esgota e não escala.",
      "Decisão técnica sem explicar o raciocínio — resistência na implementação e o time repete os mesmos erros.",
      "Foco 100% em código, zero em comunicação e alinhamento — impacto limitado ao próprio trabalho.",
      "Evitar conflito técnico a todo custo — consenso falso é pior que decisão embasada com discordância documentada.",
      "Confundir tech lead com engineering manager — tech lead tem foco técnico e de qualidade, EM tem foco em pessoas e entregas.",
    ],
    resources: [
      { title: "The Staff Engineer's Path (Reilly)", url: "https://www.oreilly.com/library/view/the-staff-engineers/9781098118723/", kind: "livro" },
      { title: "Will Larson — Staff Engineer", url: "https://staffeng.com/", kind: "artigo" },
      { title: "Camille Fournier — The Manager's Path", url: "https://www.oreilly.com/library/view/the-managers-path/9781491973882/", kind: "livro" },
      { title: "Tanya Reilly — Being Glue", url: "https://noidea.dog/glue", kind: "artigo" },
    ],
  },
}

export default data
