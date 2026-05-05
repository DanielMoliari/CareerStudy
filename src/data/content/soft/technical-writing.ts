import type { SkillContent } from "@/types"

const technicalWriting: SkillContent = {
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
  }

export default technicalWriting
