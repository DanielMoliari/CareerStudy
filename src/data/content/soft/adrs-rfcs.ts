import type { SkillContent } from "@/types"

const adrsRfcs: SkillContent = {
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
  }

  /* ─────────────────────────────────────────── P2 ─────────────────────────── */

export default adrsRfcs
