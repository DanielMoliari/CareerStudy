import type { SkillContent } from '@/types'

const threatModeling: SkillContent = {
    tagline: 'Processo estruturado para identificar e mitigar riscos de segurança antes de escrever código.',
    why: 'Threat modeling é a diferença entre "segurança bolada depois" e "segurança embutida no design". É a skill que justifica o A04 (Insecure Design) no OWASP Top 10 existir como categoria separada. Em entrevistas sênior de backend e arquitetura, saber STRIDE e conseguir fazer threat modeling de um sistema real demonstra maturidade de engenharia que vai além de conhecer as ferramentas.',
    summary: 'Threat modeling é o processo de identificar sistematicamente ameaças, vulnerabilidades e contramedidas de um sistema antes de construí-lo. O framework mais usado é o STRIDE (desenvolvido na Microsoft): Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege. Cada letra corresponde a uma categoria de ameaça; cada componente do sistema é analisado contra todas as categorias. O processo começa com um diagrama de fluxo de dados (DFD): atores externos, processos, datastores e os fluxos entre eles. Para cada fluxo e componente, pergunta-se: quem pode atacar isso? Como? Com que impacto? A saída são requisitos de segurança que entram no design antes de qualquer linha de código — não são tickets de "melhorias de segurança" que ninguém implementa depois.',
    keypoints: [
      {
        title: 'STRIDE — as 6 categorias de ameaça',
        body: 'S = Spoofing (fingir ser outro ator), T = Tampering (modificar dados em trânsito ou em repouso), R = Repudiation (negar que uma ação ocorreu), I = Information Disclosure (exposição de dados confidenciais), D = Denial of Service (tornar o sistema indisponível), E = Elevation of Privilege (obter mais permissões do que o autorizado). Cada componente do sistema é analisado contra todas as 6 categorias.',
        code: `// Exemplo de análise STRIDE para um endpoint de API:
// POST /api/payments

// S - Spoofing: autenticação JWT está presente? Assinatura verificada?
// T - Tampering: o payload é validado e assinado? HTTPS obrigatório?
// R - Repudiation: o request e o resultado são logados com userId + timestamp?
// I - Info Disclosure: a resposta retorna dados desnecessários? Erros expõem internals?
// D - DoS: há rate limiting? Limite de tamanho de payload?
// E - Elevation: um usuário comum pode acionar fluxos de admin via este endpoint?`,
      },
      {
        title: 'Data Flow Diagram (DFD) — o mapa do sistema',
        body: 'O threat modeling começa com um DFD de 4 elementos: Atores externos (usuários, sistemas de terceiros), Processos (serviços, funções), Data Stores (bancos, filas, caches) e Fluxos de dados (conexões entre os anteriores). Os limites de trust (trust boundaries) separam zonas de confiança diferente — ex: internet vs. DMZ vs. rede interna. Ameaças geralmente cruzam trust boundaries.',
      },
      {
        title: 'DREAD — modelo de scoring de risco (contexto histórico)',
        body: 'DREAD (Damage, Reproducibility, Exploitability, Affected Users, Discoverability) foi usado pela Microsoft para pontuar ameaças numericamente. Foi descontinuado por ser subjetivo e criar falsa precisão. Hoje o mais comum é usar uma matriz simples Likelihood × Impact (alto/médio/baixo) para priorizar, combinada com STRIDE para classificar.',
      },
      {
        title: 'Árvore de ameaças (Attack Tree)',
        body: 'Complemento ao STRIDE: modela o objetivo do atacante como raiz de uma árvore, e os caminhos para alcançá-lo como nós filhos (AND/OR). Útil para entender como múltiplos controles precisam falhar simultaneamente (AND) para o ataque funcionar. Exemplo: raiz = "comprometer conta de admin"; caminhos: credenciais vazadas OR session hijacking OR SSRF → acesso à rede interna → acesso ao admin panel.',
      },
      {
        title: 'Threat Modeling em equipes ágeis — quando fazer',
        body: 'A ideia não é uma sessão de 2 dias antes do launch. Em times ágeis: threat model incremental por feature (30-60 min com engenheiro + alguém de segurança), revisitar quando o DFD muda significativamente (novo serviço, nova integração, mudança de autenticação). Ferramentas: OWASP Threat Dragon, Microsoft Threat Modeling Tool, draw.io para DFDs.',
      },
    ],
    diagrams: [
      {
        title: 'STRIDE — Modelo mental por componente de sistema',
        html: `<style>
.tm-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;max-width:680px}
.tm-row{display:grid;grid-template-columns:28px 90px 1fr;gap:10px;align-items:start;padding:9px 10px;border-radius:8px;margin-bottom:4px;cursor:default;transition:background .15s}
.tm-row:hover{background:#1e293b}
.tm-letter{width:24px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;flex-shrink:0}
.tm-threat{font-size:10px;font-weight:700;color:#94a3b8;letter-spacing:.06em}
.tm-desc{font-size:10.5px;color:#64748b;line-height:1.55}
.tm-control{font-size:9.5px;color:#22c55e;margin-top:3px}
</style>
<div class="tm-wrap">
  <p style="color:#e2e8f0;font-size:13px;font-weight:700;margin:0 0 4px">STRIDE — Framework de Threat Modeling</p>
  <p style="color:#475569;font-size:10px;margin:0 0 16px">Cada letra = uma categoria de ameaça. Passe o mouse em cada linha para destacar.</p>

  <div class="tm-row">
    <div class="tm-letter" style="background:rgba(239,68,68,.15);color:#ef4444">S</div>
    <div class="tm-threat">Spoofing</div>
    <div><div class="tm-desc">Fingir ser outro ator (usuário, serviço, IP). Ex: forjar JWT, roubar sessão, DNS spoofing.</div><div class="tm-control">→ Autenticação forte, MFA, verificação de assinatura de tokens, mTLS entre serviços</div></div>
  </div>
  <div class="tm-row">
    <div class="tm-letter" style="background:rgba(249,115,22,.15);color:#f97316">T</div>
    <div class="tm-threat">Tampering</div>
    <div><div class="tm-desc">Modificar dados em trânsito ou em repouso. Ex: man-in-the-middle, modificar payload, alterar banco.</div><div class="tm-control">→ TLS obrigatório, assinatura de dados, checksums, integridade de DB via constraints</div></div>
  </div>
  <div class="tm-row">
    <div class="tm-letter" style="background:rgba(168,85,247,.15);color:#a855f7">R</div>
    <div class="tm-threat">Repudiation</div>
    <div><div class="tm-desc">Negar que uma ação ocorreu. Ex: usuário nega ter feito uma transação sem log que prove o contrário.</div><div class="tm-control">→ Logs de auditoria com userId + timestamp, assinatura digital, trilha imutável</div></div>
  </div>
  <div class="tm-row">
    <div class="tm-letter" style="background:rgba(59,130,246,.15);color:#3b82f6">I</div>
    <div class="tm-threat">Info Disclosure</div>
    <div><div class="tm-desc">Exposição de dados não autorizados. Ex: stack trace em erro, endpoint que retorna dados extras, logs com senha.</div><div class="tm-control">→ DTOs explícitos, erros genéricos em produção, não logar dados sensíveis</div></div>
  </div>
  <div class="tm-row">
    <div class="tm-letter" style="background:rgba(234,179,8,.15);color:#eab308">D</div>
    <div class="tm-threat">Denial of Service</div>
    <div><div class="tm-desc">Tornar o sistema indisponível. Ex: flood de requests, query sem índice que trava DB, upload de arquivo gigante.</div><div class="tm-control">→ Rate limiting, timeouts, circuit breakers, paginação, limite de payload</div></div>
  </div>
  <div class="tm-row">
    <div class="tm-letter" style="background:rgba(239,68,68,.15);color:#ef4444">E</div>
    <div class="tm-threat">Elevation of Privilege</div>
    <div><div class="tm-desc">Obter mais permissões do que o autorizado. Ex: usuário comum acessa endpoint admin, SSRF → credenciais IAM.</div><div class="tm-control">→ Least privilege, verificação de role server-side, BFLA prevention, IAM policies restritas</div></div>
  </div>

  <div style="background:#1e293b;border-radius:8px;padding:12px;margin-top:14px;border:1px solid #1e3a5f">
    <div style="font-size:10px;color:#94a3b8;line-height:1.7"><strong style="color:#e2e8f0">Como usar:</strong> para cada processo, datastore e fluxo de dados do seu sistema, percorra as 6 letras e pergunte: "alguém pode fazer isso aqui?". A resposta "sim" vira um requisito de segurança. Comece pelos trust boundaries — ameaças geralmente cruzam fronteiras de confiança.</div>
  </div>
</div>`,
        caption: 'STRIDE é aplicado a cada elemento do Data Flow Diagram do sistema. Não é necessário ser exaustivo — foque nos trust boundaries e nos fluxos que tocam dados sensíveis.',
      },
    ],
    interview: [
      {
        q: 'Explique STRIDE e como você o aplicaria a um endpoint de login.',
        a: 'STRIDE é o framework da Microsoft para classificar ameaças: Spoofing (fingir ser outro), Tampering (modificar dados), Repudiation (negar ações), Information Disclosure (expor dados), Denial of Service (indisponibilidade), Elevation of Privilege (obter mais permissões). Para POST /auth/login: S = alguém pode forjar credenciais ou roubar sessão? (mitigação: bcrypt, JWT assinado, MFA); T = o payload pode ser interceptado? (HTTPS obrigatório); R = há log da tentativa com IP e timestamp? (auditoria); I = a resposta de erro diferencia "usuário não existe" de "senha errada"? (não deveria); D = há rate limiting por IP e por usuário? (prevenção de brute force); E = o login pode dar acesso a funções de admin sem verificação de role? (BFLA).',
        tip: 'Aplicar STRIDE a um exemplo concreto em vez de só defini-lo demonstra que você realmente usa o framework, não só conhece a sigla.',
        level: 'senior',
      },
      {
        q: 'O que é um trust boundary em um DFD e por que ele é importante para threat modeling?',
        a: 'Trust boundary é o limite entre zonas com diferentes níveis de confiança — ex: internet vs. DMZ, DMZ vs. rede interna, processo com privilege vs. processo sem privilege, browser vs. servidor. Em um DFD, é representado como uma linha pontilhada. A importância: ameaças geralmente cruzam trust boundaries — um dado que vai de "internet" para "processo do servidor" precisa ser validado e autenticado porque vem de uma zona não confiável. Identificar todas as trust boundaries no DFD e garantir que todo dado que cruza seja validado é o núcleo do threat modeling.',
        tip: 'Mencionar exemplos concretos de trust boundaries do dia a dia (browser/servidor, usuário/admin, serviço externo/serviço interno) demonstra maturidade.',
        level: 'senior',
      },
      {
        q: 'Como você integraria threat modeling em um time ágil sem criar um processo pesado?',
        a: 'Em times ágeis, o threat model não precisa ser uma sessão de 2 dias antes do lançamento. A abordagem incremental funciona melhor: (1) ao iniciar uma feature com implicações de segurança (novo endpoint, nova integração, mudança de autenticação), reservar 30-60 minutos com o dev e um colega de segurança ou sênior; (2) desenhar o DFD mínimo da feature — só os fluxos novos; (3) percorrer STRIDE nos trust boundaries; (4) os itens encontrados viram critérios de aceitação da story ou bugs de segurança. Ferramentas: OWASP Threat Dragon ou draw.io para DFDs, GitHub Issues para rastrear mitigações. O ponto-chave é que threat modeling antes de codar é 10x mais barato do que corrigir depois de deployar.',
        tip: 'Mostrar que você entende o custo de corrigir segurança após o fato e consegue defender o investimento de 30-60 min por feature é o argumento que convence times de negócio.',
        level: 'senior',
      },
      {
        q: 'Qual a diferença entre STRIDE e DREAD?',
        a: 'STRIDE classifica o tipo de ameaça (o que pode acontecer). DREAD era um modelo de scoring numérico para priorizar ameaças: Damage potential, Reproducibility, Exploitability, Affected users, Discoverability — cada critério recebia nota de 0-10 e a média determinava a prioridade. A Microsoft descontinuou o DREAD porque era excessivamente subjetivo (dois engenheiros davam notas completamente diferentes para a mesma ameaça) e criava falsa precisão. Hoje o mais comum é usar uma matriz simples de risco (Likelihood × Impact: alto/médio/baixo) para priorizar as ameaças identificadas pelo STRIDE.',
        tip: 'Saber que DREAD foi descontinuado e por quê demonstra que seu conhecimento não é apenas teórico — é atualizado.',
        level: 'senior',
      },
      {
        q: 'Como threat modeling se relaciona com o A04 do OWASP Top 10?',
        a: 'O A04 (Insecure Design) foi criado na versão 2021 justamente para capturar falhas que não são bugs de implementação — são decisões de design que criam vetores de ataque que nenhuma correção de código resolve depois. Exemplos: fluxo de "esqueci a senha" que confirma se o e-mail existe (information disclosure by design), lógica de negócio que não tem conceito de rate limiting no design (só acrescenta depois como band-aid), API que por design retorna o objeto completo do banco. Threat modeling é a prática que previne o A04 porque força a análise de segurança antes de codificar — você modela os fluxos, aplica STRIDE, e os requisitos de segurança entram no design, não como itens de backlog que nunca chegam à frente.',
        tip: 'Conectar threat modeling ao A04 demonstra que você entende a conexão entre processo e resultado — esse nível de visão sistêmica é o que define sênior.',
        level: 'senior',
      },
      {
        q: 'Descreva um threat model básico para um sistema de pagamento com usuário → API → processador externo.',
        a: 'DFD: ator externo (usuário/browser) → trust boundary → processo (API de pagamento) → trust boundary → datastore (banco de pedidos) + ator externo (gateway de pagamento). Principais ameaças STRIDE: S: usuário pode forjar a identidade de outro para pagar com cartão alheio? (mitigação: JWT verificado + 3DS no gateway); T: o payload de pagamento pode ser interceptado ou alterado? (HTTPS + webhook signature verification do gateway); R: há log imutável de cada tentativa de pagamento com userId, valor, timestamp, IP? (necessário para chargebacks); I: a resposta inclui dados de cartão? (PCI-DSS proíbe — armazenar apenas token do gateway); D: o endpoint aceita requests ilimitados? (rate limit por usuário + idempotency keys para evitar double-charge); E: um usuário pode disparar o fluxo de reembolso sem verificação adicional? (BFLA — verificar role e ownership).',
        tip: 'Mencionar PCI-DSS e idempotency keys em pagamentos demonstra experiência real com domínio financeiro.',
        level: 'senior',
      },
    ],
    gotchas: [
      'Threat modeling não é uma atividade de segurança isolada — é parte do design de software. Tratar como "auditoria de segurança separada" é o motivo pelo qual os resultados viram backlog ignorado.',
      'STRIDE classifica ameaças, não vulnerabilidades. Uma ameaça de Tampering pode ter múltiplas vulnerabilidades subjacentes (TLS ausente, sem validação de payload, sem constraints no banco).',
      'Trust boundaries são definidos pelo nível de confiança, não pela topologia de rede. Um microserviço interno também precisa validar input de outros microserviços — não assumir que rede interna = confiável.',
      'Ameaças de Repudiation (R no STRIDE) são frequentemente esquecidas — logs de auditoria são um controle crítico que precisa ser planejado antes de IR para produção, não adicionado depois.',
      'Threat model não precisa ser perfeito ou exaustivo — um modelo de 60% de cobertura feito antes de codar é infinitamente mais valioso que um modelo de 100% feito 6 meses depois do lançamento.',
    ],
    resources: [
      { title: 'OWASP Threat Modeling — Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html', kind: 'docs' },
      { title: 'Microsoft Threat Modeling Tool', url: 'https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool', kind: 'docs' },
      { title: 'OWASP Threat Dragon (ferramenta open source)', url: 'https://owasp.org/www-project-threat-dragon/', kind: 'pratica' },
    ],
  }

  // ─── P2 ────────────────────────────────────────────────────────────────────

export default threatModeling
