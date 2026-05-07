import type { SkillContent } from '@/types'

const threatModeling: SkillContent = {
  tagline: 'Processo estruturado para identificar e mitigar riscos de segurança antes de escrever código.',
  why: 'Threat modeling é a diferença entre "segurança bolada depois" e "segurança embutida no design". É a skill que justifica o A04 (Insecure Design) no OWASP Top 10 existir como categoria separada. Em entrevistas sênior de backend e arquitetura, saber STRIDE e conseguir fazer threat modeling de um sistema real demonstra maturidade de engenharia que vai além de conhecer as ferramentas.',
  summary: 'Threat modeling é o processo de identificar sistematicamente ameaças, vulnerabilidades e contramedidas de um sistema antes de construí-lo. O framework mais usado é o STRIDE (desenvolvido na Microsoft): Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege. Cada letra corresponde a uma categoria de ameaça; cada componente do sistema é analisado contra todas as categorias. O processo começa com um diagrama de fluxo de dados (DFD): atores externos, processos, datastores e os fluxos entre eles. Para cada fluxo e componente, pergunta-se: quem pode atacar isso? Como? Com que impacto? A saída são requisitos de segurança que entram no design antes de qualquer linha de código.',
  keypoints: [
    {
      title: 'STRIDE — as 6 categorias de ameaça',
      body: 'S = Spoofing (fingir ser outro ator), T = Tampering (modificar dados em trânsito ou em repouso), R = Repudiation (negar que uma ação ocorreu), I = Information Disclosure (exposição de dados confidenciais), D = Denial of Service (tornar o sistema indisponível), E = Elevation of Privilege (obter mais permissões do que o autorizado). Cada componente do sistema é analisado contra todas as 6 categorias.',
      code: `// Análise STRIDE para POST /api/payments
// S - Spoofing: autenticação JWT verificada? mTLS entre serviços?
// T - Tampering: payload assinado? HTTPS obrigatório? webhook signature?
// R - Repudiation: log com userId + valor + timestamp + IP?
// I - Info Disclosure: resposta expõe PAN/CVV? erro expõe stack trace?
// D - DoS: rate limit por usuário? idempotency key? limite de payload?
// E - Elevation: usuário comum aciona reembolso? BFLA check server-side?`,
    },
    {
      title: 'Data Flow Diagram (DFD) — o mapa do sistema',
      body: 'O threat modeling começa com um DFD de 4 elementos: Atores externos (usuários, sistemas de terceiros), Processos (serviços, funções), Data Stores (bancos, filas, caches) e Fluxos de dados (conexões entre os anteriores). Os limites de trust (trust boundaries) separam zonas de confiança diferente. Ameaças geralmente cruzam trust boundaries.',
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
      body: 'Em times ágeis: threat model incremental por feature (30-60 min com engenheiro + alguém de segurança), revisitar quando o DFD muda significativamente (novo serviço, nova integração, mudança de autenticação). Ferramentas: OWASP Threat Dragon, Microsoft Threat Modeling Tool, draw.io para DFDs.',
    },
    {
      title: 'PASTA — Process for Attack Simulation and Threat Analysis',
      body: 'Framework mais elaborado que STRIDE: 7 estágios incluindo definição de objetivos de negócio, decomposição técnica do sistema, análise de ameaças, análise de vulnerabilidades, análise de ataque, análise de risco/impacto e contramedidas. Mais usado em organizações com equipes de segurança dedicadas. STRIDE é preferível para times menores por ser mais rápido.',
    },
  ],
  diagrams: [
    {
      title: 'STRIDE — Modelo mental por componente de sistema',
      html: `<style>
.tm-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;max-width:680px}
.tm-row{display:grid;grid-template-columns:28px 110px 1fr;gap:10px;align-items:start;padding:9px 10px;border-radius:8px;margin-bottom:4px;cursor:default;transition:background .15s}
.tm-row:hover{background:#1e293b}
.tm-letter{width:24px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;flex-shrink:0}
.tm-threat{font-size:10px;font-weight:700;color:#94a3b8;letter-spacing:.06em;padding-top:2px}
.tm-desc{font-size:10.5px;color:#64748b;line-height:1.55}
.tm-control{font-size:9.5px;color:#22c55e;margin-top:3px}
</style>
<div class="tm-wrap">
  <p style="color:#e2e8f0;font-size:13px;font-weight:700;margin:0 0 4px">STRIDE — Framework de Threat Modeling</p>
  <p style="color:#475569;font-size:10px;margin:0 0 16px">Cada letra = uma categoria de ameaça. Aplicar a cada componente do DFD.</p>
  <div class="tm-row">
    <div class="tm-letter" style="background:rgba(239,68,68,.15);color:#ef4444">S</div>
    <div class="tm-threat">Spoofing</div>
    <div><div class="tm-desc">Fingir ser outro ator. Ex: forjar JWT, roubar sessão, DNS spoofing.</div><div class="tm-control">→ Autenticação forte, MFA, verificação de assinatura, mTLS entre serviços</div></div>
  </div>
  <div class="tm-row">
    <div class="tm-letter" style="background:rgba(249,115,22,.15);color:#f97316">T</div>
    <div class="tm-threat">Tampering</div>
    <div><div class="tm-desc">Modificar dados em trânsito ou em repouso. Ex: man-in-the-middle, alterar payload.</div><div class="tm-control">→ TLS obrigatório, assinatura de dados, checksums, constraints de integridade</div></div>
  </div>
  <div class="tm-row">
    <div class="tm-letter" style="background:rgba(168,85,247,.15);color:#a855f7">R</div>
    <div class="tm-threat">Repudiation</div>
    <div><div class="tm-desc">Negar que uma ação ocorreu. Ex: usuário nega transação sem log que prove.</div><div class="tm-control">→ Logs de auditoria imutáveis com userId + timestamp, assinatura digital</div></div>
  </div>
  <div class="tm-row">
    <div class="tm-letter" style="background:rgba(59,130,246,.15);color:#3b82f6">I</div>
    <div class="tm-threat">Info Disclosure</div>
    <div><div class="tm-desc">Exposição de dados não autorizados. Ex: stack trace em erro, endpoint retorna dados extras.</div><div class="tm-control">→ DTOs explícitos, erros genéricos em produção, não logar dados sensíveis</div></div>
  </div>
  <div class="tm-row">
    <div class="tm-letter" style="background:rgba(234,179,8,.15);color:#eab308">D</div>
    <div class="tm-threat">Denial of Service</div>
    <div><div class="tm-desc">Tornar o sistema indisponível. Ex: flood de requests, query sem índice, upload gigante.</div><div class="tm-control">→ Rate limiting, timeouts, circuit breakers, paginação, limite de payload</div></div>
  </div>
  <div class="tm-row">
    <div class="tm-letter" style="background:rgba(239,68,68,.15);color:#ef4444">E</div>
    <div class="tm-threat">Elevation of Privilege</div>
    <div><div class="tm-desc">Obter mais permissões do que o autorizado. Ex: usuário comum acessa endpoint admin, SSRF → credenciais IAM.</div><div class="tm-control">→ Least privilege, verificação de role server-side, BFLA prevention</div></div>
  </div>
  <div style="background:#1e293b;border-radius:8px;padding:12px;margin-top:14px;border:1px solid #1e3a5f">
    <div style="font-size:10px;color:#94a3b8;line-height:1.7"><strong style="color:#e2e8f0">Como usar:</strong> para cada processo, datastore e fluxo de dados do seu sistema, percorra as 6 letras e pergunte: "alguém pode fazer isso aqui?". A resposta "sim" vira um requisito de segurança. Comece pelos trust boundaries.</div>
  </div>
</div>`,
      caption: 'STRIDE é aplicado a cada elemento do Data Flow Diagram. Foque nos trust boundaries e nos fluxos que tocam dados sensíveis.',
    },
    {
      title: 'DFD — Data Flow Diagram com Trust Boundaries',
      html: `<style>
.dfd-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:24px;max-width:680px}
.dfd-zone{border-radius:10px;padding:14px;margin-bottom:12px;position:relative}
.dfd-zone-label{font-size:9px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;margin-bottom:10px}
.dfd-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.dfd-node{display:inline-flex;flex-direction:column;align-items:center;gap:4px;padding:8px 12px;border-radius:8px;min-width:80px;cursor:default}
.dfd-node-label{font-size:9px;color:#94a3b8;text-align:center;max-width:80px}
.dfd-arrow{color:#475569;font-size:14px;flex-shrink:0}
.dfd-legend{display:flex;gap:16px;flex-wrap:wrap;margin-top:14px;padding-top:12px;border-top:1px solid #1e293b}
.dfd-legend-item{display:flex;align-items:center;gap:6px;font-size:9px;color:#64748b}
</style>
<div class="dfd-wrap">
  <p style="color:#e2e8f0;font-size:13px;font-weight:700;margin:0 0 16px">DFD — Data Flow Diagram com Trust Boundaries</p>

  <!-- Zona: Internet (não confiável) -->
  <div class="dfd-zone" style="background:rgba(239,68,68,.05);border:1.5px dashed rgba(239,68,68,.3)">
    <div class="dfd-zone-label" style="color:#ef4444">⚠ Zona Não Confiável — Internet</div>
    <div class="dfd-row">
      <div class="dfd-node" style="background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3)">
        <span style="font-size:20px">👤</span>
        <span style="font-size:10px;font-weight:700;color:#ef4444">Ator Externo</span>
        <span class="dfd-node-label">Usuário / Browser</span>
      </div>
      <div class="dfd-arrow">→</div>
      <div style="font-size:10px;color:#64748b;background:#1e293b;padding:6px 10px;border-radius:6px;border:1px dashed #334155">
        <div style="color:#ef4444;font-weight:700;font-size:9px">TRUST BOUNDARY</div>
        <div style="font-size:9px;margin-top:2px">Todo dado que cruza aqui<br/>deve ser validado e autenticado</div>
      </div>
    </div>
  </div>

  <!-- Zona: DMZ / API -->
  <div class="dfd-zone" style="background:rgba(234,179,8,.05);border:1.5px dashed rgba(234,179,8,.3)">
    <div class="dfd-zone-label" style="color:#eab308">⚙ DMZ — Processos da Aplicação</div>
    <div class="dfd-row">
      <div class="dfd-node" style="background:rgba(234,179,8,.1);border:1px solid rgba(234,179,8,.3)">
        <span style="font-size:20px">⚙️</span>
        <span style="font-size:10px;font-weight:700;color:#eab308">Processo</span>
        <span class="dfd-node-label">API Gateway</span>
      </div>
      <div class="dfd-arrow">→</div>
      <div class="dfd-node" style="background:rgba(234,179,8,.1);border:1px solid rgba(234,179,8,.3)">
        <span style="font-size:20px">⚙️</span>
        <span style="font-size:10px;font-weight:700;color:#eab308">Processo</span>
        <span class="dfd-node-label">Auth Service</span>
      </div>
      <div class="dfd-arrow">→</div>
      <div class="dfd-node" style="background:rgba(234,179,8,.1);border:1px solid rgba(234,179,8,.3)">
        <span style="font-size:20px">⚙️</span>
        <span style="font-size:10px;font-weight:700;color:#eab308">Processo</span>
        <span class="dfd-node-label">Orders Service</span>
      </div>
    </div>
  </div>

  <!-- Zona: Rede Interna -->
  <div class="dfd-zone" style="background:rgba(34,197,94,.05);border:1.5px dashed rgba(34,197,94,.3)">
    <div class="dfd-zone-label" style="color:#22c55e">🔒 Rede Interna — Datastores</div>
    <div class="dfd-row">
      <div class="dfd-node" style="background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.3)">
        <span style="font-size:20px">🗄️</span>
        <span style="font-size:10px;font-weight:700;color:#22c55e">Datastore</span>
        <span class="dfd-node-label">PostgreSQL</span>
      </div>
      <div class="dfd-node" style="background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.3)">
        <span style="font-size:20px">🗄️</span>
        <span style="font-size:10px;font-weight:700;color:#22c55e">Datastore</span>
        <span class="dfd-node-label">Redis Cache</span>
      </div>
      <div class="dfd-node" style="background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.3)">
        <span style="font-size:20px">🗄️</span>
        <span style="font-size:10px;font-weight:700;color:#22c55e">Datastore</span>
        <span class="dfd-node-label">S3 / Files</span>
      </div>
    </div>
  </div>

  <div class="dfd-legend">
    <div class="dfd-legend-item"><span style="color:#ef4444">⚠</span> Zona não confiável (internet)</div>
    <div class="dfd-legend-item"><span style="color:#eab308">⚙</span> Processos (lógica)</div>
    <div class="dfd-legend-item"><span style="color:#22c55e">🗄</span> Datastores (persistência)</div>
    <div class="dfd-legend-item"><span>---</span> Trust boundary (validar tudo que cruza)</div>
  </div>
</div>`,
      caption: 'Ameaças geralmente cruzam trust boundaries. Um microserviço interno ainda precisa validar input de outros microserviços — rede interna não é sinônimo de confiável.',
    },
    {
      title: 'Threat Modeling Ágil — Processo Incremental por Feature',
      html: `<style>
.tm-flow{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:24px;max-width:680px}
.tm-step{display:flex;gap:14px;align-items:flex-start;padding:12px 14px;border-radius:10px;margin-bottom:8px;border:1px solid #1e293b;transition:border-color .15s}
.tm-step:hover{border-color:#374151}
.tm-step-num{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;flex-shrink:0;margin-top:2px}
.tm-step-content{}
.tm-step-title{font-size:12px;font-weight:700;color:#e2e8f0;margin-bottom:4px}
.tm-step-body{font-size:10.5px;color:#64748b;line-height:1.6}
.tm-step-tip{font-size:9.5px;color:#22c55e;margin-top:6px;padding:5px 8px;background:rgba(34,197,94,.08);border-radius:5px}
</style>
<div class="tm-flow">
  <p style="color:#e2e8f0;font-size:13px;font-weight:700;margin:0 0 4px">Threat Modeling Ágil — Processo por Feature</p>
  <p style="color:#475569;font-size:10px;margin:0 0 16px">30-60 minutos antes de codar vale mais que semanas de auditoria depois.</p>

  <div class="tm-step">
    <div class="tm-step-num" style="background:rgba(239,68,68,.15);color:#ef4444">1</div>
    <div class="tm-step-content">
      <div class="tm-step-title">Trigger — quando fazer</div>
      <div class="tm-step-body">Nova feature com implicações de segurança: novo endpoint, nova integração externa, mudança de autenticação/autorização, dados sensíveis envolvidos. Revisitar quando o DFD muda significativamente.</div>
      <div class="tm-step-tip">Gatilho prático: "isso toca autenticação, dados de usuário ou integração externa?" → faça o threat model antes de escrever código.</div>
    </div>
  </div>

  <div class="tm-step">
    <div class="tm-step-num" style="background:rgba(249,115,22,.15);color:#f97316">2</div>
    <div class="tm-step-content">
      <div class="tm-step-title">DFD mínimo da feature</div>
      <div class="tm-step-body">Desenhe apenas os novos fluxos: atores envolvidos, processos, datastores tocados, trust boundaries cruzados. Não precisa ser exaustivo — foque no que é novo e potencialmente arriscado.</div>
      <div class="tm-step-tip">Ferramenta: OWASP Threat Dragon (free) ou draw.io com formas de DFD. 15 minutos de desenho.</div>
    </div>
  </div>

  <div class="tm-step">
    <div class="tm-step-num" style="background:rgba(168,85,247,.15);color:#a855f7">3</div>
    <div class="tm-step-content">
      <div class="tm-step-title">STRIDE nos trust boundaries</div>
      <div class="tm-step-body">Para cada fluxo que cruza um trust boundary, percorra as 6 letras do STRIDE. Foque onde há: dados de usuário, chamadas externas, mudanças de permissão, armazenamento de dados sensíveis.</div>
      <div class="tm-step-tip">Em 30 minutos com um dev sênior você cobre os riscos de 80% das features.</div>
    </div>
  </div>

  <div class="tm-step">
    <div class="tm-step-num" style="background:rgba(59,130,246,.15);color:#3b82f6">4</div>
    <div class="tm-step-content">
      <div class="tm-step-title">Ameaças viram requisitos</div>
      <div class="tm-step-body">Cada ameaça identificada vira um critério de aceitação da story (DoD) ou um bug de segurança no backlog. Não são "melhorias futuras" — são requisitos para a feature ser considerada pronta.</div>
      <div class="tm-step-tip">Exemplo: "S — Spoofing: JWT deve ser verificado server-side" vira AC da história, não débito técnico.</div>
    </div>
  </div>

  <div class="tm-step">
    <div class="tm-step-num" style="background:rgba(34,197,94,.15);color:#22c55e">5</div>
    <div class="tm-step-content">
      <div class="tm-step-title">ADR — registrar decisões</div>
      <div class="tm-step-body">Documentar em Architecture Decision Record: contexto, decisão tomada, alternativas consideradas, consequências. Permite revisitar quando o contexto muda sem perder o raciocínio original.</div>
      <div class="tm-step-tip">ADR simples basta: "Por que usamos X e não Y" em 5 linhas já é infinitamente melhor que silêncio.</div>
    </div>
  </div>
</div>`,
      caption: 'Threat modeling não é uma auditoria de segurança separada — é parte do processo de design. Integrar ao fluxo ágil garante que os resultados entrem na definição de pronto.',
    },
    {
      title: 'Attack Tree — Modelando Objetivos do Atacante',
      html: `<style>
.at-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:24px;max-width:680px}
.at-root{text-align:center;padding:12px 20px;border-radius:10px;display:inline-block;font-size:12px;font-weight:700;background:rgba(239,68,68,.15);border:2px solid #ef4444;color:#ef4444;margin-bottom:20px}
.at-row{display:flex;justify-content:center;gap:12px;margin-bottom:12px;flex-wrap:wrap}
.at-node{padding:8px 12px;border-radius:8px;font-size:10px;font-weight:600;text-align:center;min-width:120px;cursor:default}
.at-or{font-size:9px;color:#64748b;padding:4px 8px;border:1px solid #334155;border-radius:4px;display:inline-block;margin:0 4px}
.at-and{font-size:9px;color:#a855f7;padding:4px 8px;border:1px solid rgba(168,85,247,.4);border-radius:4px;display:inline-block;margin:0 4px}
.at-arrow{text-align:center;color:#334155;font-size:16px;margin:4px 0}
.at-legend{display:flex;gap:16px;margin-top:16px;padding-top:12px;border-top:1px solid #1e293b;flex-wrap:wrap}
.at-legend-item{font-size:9px;color:#64748b;display:flex;align-items:center;gap:6px}
</style>
<div class="at-wrap">
  <p style="color:#e2e8f0;font-size:13px;font-weight:700;margin:0 0 4px">Attack Tree — Comprometer Conta Admin</p>
  <p style="color:#475569;font-size:10px;margin:0 0 16px">Modela os caminhos de ataque; AND = múltiplos controles devem falhar; OR = qualquer um é suficiente.</p>

  <div style="text-align:center">
    <div class="at-root">🎯 Comprometer conta de admin</div>
  </div>
  <div class="at-arrow">↓ OR</div>
  <div class="at-row">
    <div class="at-node" style="background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);color:#ef4444">🔑 Credenciais vazadas<br/><span style="font-size:8px;color:#64748b">phishing / breach</span></div>
    <div class="at-node" style="background:rgba(249,115,22,.1);border:1px solid rgba(249,115,22,.3);color:#f97316">🍪 Session hijacking<br/><span style="font-size:8px;color:#64748b">XSS / cookie theft</span></div>
    <div class="at-node" style="background:rgba(168,85,247,.1);border:1px solid rgba(168,85,247,.3);color:#a855f7">🌐 SSRF<br/><span style="font-size:8px;color:#64748b">URL injection</span></div>
  </div>

  <div style="text-align:center;margin-top:8px">
    <span class="at-and">AND — para SSRF funcionar, os dois devem falhar:</span>
  </div>
  <div class="at-row" style="margin-top:8px">
    <div class="at-node" style="background:rgba(168,85,247,.08);border:1px solid rgba(168,85,247,.2);color:#c084fc">SSRF → rede interna<br/><span style="font-size:8px;color:#64748b">sem allowlist de domínio</span></div>
    <span style="color:#a855f7;font-size:18px;display:flex;align-items:center">+</span>
    <div class="at-node" style="background:rgba(168,85,247,.08);border:1px solid rgba(168,85,247,.2);color:#c084fc">Metadados de cloud<br/><span style="font-size:8px;color:#64748b">169.254.169.254 acessível</span></div>
  </div>

  <div style="background:#1e293b;border-radius:8px;padding:12px;margin-top:14px">
    <div style="font-size:10.5px;color:#94a3b8;line-height:1.7">
      <strong style="color:#e2e8f0">Insight:</strong> nós AND revelam onde múltiplos controles devem falhar simultaneamente. Implementar qualquer um deles quebra o caminho de ataque. Priorize os nós OR — qualquer um é caminho suficiente para o atacante.
    </div>
  </div>

  <div class="at-legend">
    <div class="at-legend-item"><span style="color:#ef4444">OR</span> Qualquer filho é caminho suficiente</div>
    <div class="at-legend-item"><span style="color:#a855f7">AND</span> Todos os filhos devem falhar</div>
    <div class="at-legend-item"><span>🎯</span> Objetivo do atacante (raiz)</div>
  </div>
</div>`,
      caption: 'Attack Trees são úteis para entender onde múltiplos controles precisam falhar simultaneamente (AND) versus onde qualquer falha basta (OR). Complementam o STRIDE na análise de ameaças complexas.',
    },
  ],
  mnemonics: [
    {
      label: 'STRIDE — "Sei Tudo Rir Incomoda Defensores Experientes"',
      trick: 'S-T-R-I-D-E',
      explanation: 'S = Spoofing (fingir ser outro), T = Tampering (modificar dados), R = Repudiation (negar ação), I = Information Disclosure (vazar dados), D = Denial of Service (derrubar sistema), E = Elevation of Privilege (subir permissão). As 6 categorias de ameaça do framework Microsoft.',
    },
    {
      label: 'Trust Boundaries — "Toda Fronteira Exige Inspeção"',
      trick: 'TFEI — fronteiras exigem inspeção',
      explanation: 'Toda vez que dados cruzam uma trust boundary (internet → servidor, usuário → admin, serviço externo → serviço interno) eles DEVEM ser validados e autenticados. Ameaças geralmente cruzam fronteiras de confiança — é onde focar a análise STRIDE.',
    },
    {
      label: 'DFD — "Atores Processam Dados Fluindo"',
      trick: 'APDF — os 4 elementos do DFD',
      explanation: 'A = Atores externos (usuários, sistemas de terceiros), P = Processos (serviços, funções), D = Datastores (bancos, filas, caches), F = Fluxos de dados (conexões entre os anteriores). Mais as trust boundaries como linhas pontilhadas. Todo DFD tem esses 4 elementos.',
    },
    {
      label: 'Priorização de ameaças — "Probabilidade x Impacto = Prioridade"',
      trick: 'P × I = Pr',
      explanation: 'Após identificar ameaças com STRIDE, priorize pela matriz Likelihood × Impact. Alta probabilidade + alto impacto = corrigir agora. Baixa probabilidade + baixo impacto = aceitar o risco. DREAD foi descontinuado por criar falsa precisão numérica — a matriz simples é mais honesta.',
    },
    {
      label: 'Custo de segurança — "Design Barato, Deploy Caro"',
      trick: 'DBDC — design < deploy < produção',
      explanation: 'Custo de corrigir uma vulnerabilidade no design = 1x. No desenvolvimento = 10x. Em produção = 100x. Threat modeling antes de codar é sempre o investimento mais eficiente. Essa é a justificativa de negócio para 30 minutos de análise por feature.',
    },
  ],
  cheatsheet: {
    title: 'Threat Modeling — Cheatsheet',
    html: `<style>
.tmc-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;max-width:700px}
.tmc-section{margin-bottom:16px}
.tmc-section-title{font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#ef4444;margin-bottom:8px;padding-bottom:4px;border-bottom:1px solid #1e293b}
.tmc-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.tmc-item{background:#1e293b;border-radius:6px;padding:8px 10px;border-left:3px solid transparent}
.tmc-item-key{font-size:10px;font-weight:700;color:#e2e8f0;margin-bottom:2px}
.tmc-item-val{font-size:9.5px;color:#64748b;line-height:1.5}
.tmc-check{display:flex;flex-direction:column;gap:4px}
.tmc-check-item{display:flex;gap:8px;align-items:flex-start;font-size:9.5px;color:#64748b}
.tmc-stride{display:grid;grid-template-columns:repeat(6,1fr);gap:4px}
.tmc-stride-cell{text-align:center;padding:6px 4px;border-radius:6px;background:#1e293b}
.tmc-stride-letter{font-size:14px;font-weight:800;display:block}
.tmc-stride-word{font-size:7.5px;color:#64748b;display:block;margin-top:1px}
.tmc-stride-mitig{font-size:7px;color:#475569;display:block;margin-top:3px}
</style>
<div class="tmc-wrap">
  <p style="color:#e2e8f0;font-size:13px;font-weight:700;margin:0 0 16px">Threat Modeling — Referência Rápida</p>

  <!-- STRIDE -->
  <div class="tmc-section">
    <div class="tmc-section-title">STRIDE — 6 categorias de ameaça</div>
    <div class="tmc-stride">
      <div class="tmc-stride-cell" style="border:1px solid rgba(239,68,68,.3)">
        <span class="tmc-stride-letter" style="color:#ef4444">S</span>
        <span class="tmc-stride-word">Spoofing</span>
        <span class="tmc-stride-mitig">Auth + MFA</span>
      </div>
      <div class="tmc-stride-cell" style="border:1px solid rgba(249,115,22,.3)">
        <span class="tmc-stride-letter" style="color:#f97316">T</span>
        <span class="tmc-stride-word">Tampering</span>
        <span class="tmc-stride-mitig">TLS + HMAC</span>
      </div>
      <div class="tmc-stride-cell" style="border:1px solid rgba(168,85,247,.3)">
        <span class="tmc-stride-letter" style="color:#a855f7">R</span>
        <span class="tmc-stride-word">Repudiation</span>
        <span class="tmc-stride-mitig">Audit logs</span>
      </div>
      <div class="tmc-stride-cell" style="border:1px solid rgba(59,130,246,.3)">
        <span class="tmc-stride-letter" style="color:#3b82f6">I</span>
        <span class="tmc-stride-word">Info Discl.</span>
        <span class="tmc-stride-mitig">Encrypt + DTO</span>
      </div>
      <div class="tmc-stride-cell" style="border:1px solid rgba(234,179,8,.3)">
        <span class="tmc-stride-letter" style="color:#eab308">D</span>
        <span class="tmc-stride-word">DoS</span>
        <span class="tmc-stride-mitig">Rate limit</span>
      </div>
      <div class="tmc-stride-cell" style="border:1px solid rgba(239,68,68,.3)">
        <span class="tmc-stride-letter" style="color:#ef4444">E</span>
        <span class="tmc-stride-word">Elevation</span>
        <span class="tmc-stride-mitig">Least priv.</span>
      </div>
    </div>
  </div>

  <!-- DFD Elements -->
  <div class="tmc-section">
    <div class="tmc-section-title">DFD — 4 elementos + trust boundaries</div>
    <div class="tmc-grid">
      <div class="tmc-item" style="border-left-color:#ef4444">
        <div class="tmc-item-key">👤 Ator Externo</div>
        <div class="tmc-item-val">Usuários, sistemas de terceiros, integrações. Sempre fora de qualquer trust boundary.</div>
      </div>
      <div class="tmc-item" style="border-left-color:#f97316">
        <div class="tmc-item-key">⚙️ Processo</div>
        <div class="tmc-item-val">Serviços, funções, microserviços. Transforma e processa dados.</div>
      </div>
      <div class="tmc-item" style="border-left-color:#3b82f6">
        <div class="tmc-item-key">🗄️ Datastore</div>
        <div class="tmc-item-val">Banco, fila, cache, arquivo. Persiste dados — verificar quem pode ler/escrever.</div>
      </div>
      <div class="tmc-item" style="border-left-color:#a855f7">
        <div class="tmc-item-key">⚡ Fluxo de dados</div>
        <div class="tmc-item-val">Conexões entre os elementos. Que cruza trust boundary → analisar com STRIDE.</div>
      </div>
    </div>
  </div>

  <!-- Processo ágil -->
  <div class="tmc-section">
    <div class="tmc-section-title">Processo ágil por feature (30-60 min)</div>
    <div class="tmc-check">
      <div class="tmc-check-item"><span style="color:#22c55e">1.</span><span>Feature toca auth, dados sensíveis ou integração externa? → fazer threat model</span></div>
      <div class="tmc-check-item"><span style="color:#22c55e">2.</span><span>Desenhar DFD mínimo dos novos fluxos (OWASP Threat Dragon ou draw.io)</span></div>
      <div class="tmc-check-item"><span style="color:#22c55e">3.</span><span>Percorrer STRIDE em cada trust boundary do DFD</span></div>
      <div class="tmc-check-item"><span style="color:#22c55e">4.</span><span>Ameaças viram critérios de aceitação da story ou bugs de segurança</span></div>
      <div class="tmc-check-item"><span style="color:#22c55e">5.</span><span>Documentar em ADR: contexto + decisão + alternativas + consequências</span></div>
    </div>
  </div>

  <!-- Riscos -->
  <div class="tmc-section">
    <div class="tmc-section-title">Priorização — Likelihood × Impact</div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px">
      <div style="background:rgba(239,68,68,.15);border:1px solid rgba(239,68,68,.3);border-radius:6px;padding:6px;text-align:center;font-size:9px;color:#ef4444;font-weight:700">Alta × Alto<br/><span style="color:#64748b;font-weight:400">Corrigir imediatamente</span></div>
      <div style="background:rgba(249,115,22,.1);border:1px solid rgba(249,115,22,.3);border-radius:6px;padding:6px;text-align:center;font-size:9px;color:#f97316;font-weight:700">Média × Alto<br/><span style="color:#64748b;font-weight:400">Próximo sprint</span></div>
      <div style="background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.2);border-radius:6px;padding:6px;text-align:center;font-size:9px;color:#22c55e;font-weight:700">Baixa × Baixo<br/><span style="color:#64748b;font-weight:400">Aceitar / monitorar</span></div>
    </div>
  </div>
</div>`,
    caption: 'Use esta referência durante sessões de threat modeling. STRIDE para classificar, DFD para mapear, likelihood × impact para priorizar.',
  },
  mindmap: {
    title: 'Threat Modeling — Mapa Mental',
    html: `<style>
.tmm-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:24px;max-width:720px}
.tmm-center{text-align:center;padding:14px 24px;border-radius:12px;font-size:13px;font-weight:800;color:#ef4444;background:rgba(239,68,68,.1);border:2px solid #ef4444;display:inline-block;margin-bottom:20px}
.tmm-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
.tmm-cat{background:#1e293b;border-radius:10px;padding:12px;border-top:3px solid transparent}
.tmm-cat-title{font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;margin-bottom:8px}
.tmm-item{font-size:9.5px;color:#64748b;padding:3px 0 3px 12px;position:relative;line-height:1.5}
.tmm-item::before{content:'·';position:absolute;left:4px;color:#475569}
.tmm-item.key{color:#94a3b8}
.tmm-item.adv{color:#475569;font-style:italic}
</style>
<div class="tmm-wrap">
  <div style="text-align:center;margin-bottom:20px">
    <div class="tmm-center">🛡️ Threat Modeling</div>
  </div>

  <div class="tmm-grid">
    <div class="tmm-cat" style="border-top-color:#ef4444">
      <div class="tmm-cat-title" style="color:#ef4444">STRIDE</div>
      <div class="tmm-item key">Spoofing → Auth / MFA</div>
      <div class="tmm-item key">Tampering → TLS + HMAC</div>
      <div class="tmm-item key">Repudiation → Audit logs</div>
      <div class="tmm-item key">Info Disclosure → DTOs</div>
      <div class="tmm-item key">Denial of Service → Rate limit</div>
      <div class="tmm-item key">Elevation → Least privilege</div>
    </div>
    <div class="tmm-cat" style="border-top-color:#f97316">
      <div class="tmm-cat-title" style="color:#f97316">DFD</div>
      <div class="tmm-item key">Atores externos</div>
      <div class="tmm-item key">Processos / serviços</div>
      <div class="tmm-item key">Datastores</div>
      <div class="tmm-item key">Fluxos de dados</div>
      <div class="tmm-item key">Trust boundaries</div>
      <div class="tmm-item adv">Ferramentas: Threat Dragon, draw.io</div>
    </div>
    <div class="tmm-cat" style="border-top-color:#a855f7">
      <div class="tmm-cat-title" style="color:#a855f7">Attack Trees</div>
      <div class="tmm-item key">Raiz = objetivo do atacante</div>
      <div class="tmm-item key">OR = qualquer caminho basta</div>
      <div class="tmm-item key">AND = múltiplos devem falhar</div>
      <div class="tmm-item adv">Complementa STRIDE</div>
      <div class="tmm-item adv">Mostra defesa em profundidade</div>
    </div>
    <div class="tmm-cat" style="border-top-color:#eab308">
      <div class="tmm-cat-title" style="color:#eab308">Priorização</div>
      <div class="tmm-item key">Likelihood × Impact</div>
      <div class="tmm-item key">Alto × Alto → corrigir agora</div>
      <div class="tmm-item adv">DREAD descontinuado (subjetivo)</div>
      <div class="tmm-item adv">Matriz simples &gt; falsa precisão</div>
    </div>
    <div class="tmm-cat" style="border-top-color:#22c55e">
      <div class="tmm-cat-title" style="color:#22c55e">Processo Ágil</div>
      <div class="tmm-item key">Trigger: feature com auth/dados</div>
      <div class="tmm-item key">30-60 min por feature</div>
      <div class="tmm-item key">Ameaças viram critérios de DoD</div>
      <div class="tmm-item key">ADR documenta decisões</div>
      <div class="tmm-item adv">Incremental &gt; big bang anual</div>
    </div>
    <div class="tmm-cat" style="border-top-color:#3b82f6">
      <div class="tmm-cat-title" style="color:#3b82f6">Contexto OWASP</div>
      <div class="tmm-item key">A04 Insecure Design (2021)</div>
      <div class="tmm-item key">Falhas de design &gt; bugs de código</div>
      <div class="tmm-item adv">Threat modeling previne A04</div>
      <div class="tmm-item adv">PASTA: alternativa mais formal</div>
      <div class="tmm-item adv">Custo: design &lt;&lt; produção</div>
    </div>
  </div>
</div>`,
    caption: 'Mapa mental completo de threat modeling — use como checklist de revisão antes de uma entrevista sênior de segurança.',
  },
  exercises: [
    {
      level: 'iniciante',
      title: 'STRIDE em um endpoint de login',
      description: 'Dado o endpoint POST /auth/login que recebe email e senha, aplique STRIDE completo: para cada uma das 6 categorias, escreva (1) uma ameaça concreta, (2) como um atacante poderia explorá-la, e (3) uma contramedida. Não pule nenhuma letra.',
      concepts: ['STRIDE', 'autenticação', 'rate-limiting', 'information-disclosure'],
    },
    {
      level: 'intermediario',
      title: 'DFD de um sistema de pagamento',
      description: 'Desenhe (no papel ou em ferramenta) o DFD de um sistema de pagamento com: usuário → API → banco de dados + gateway de pagamento externo. Identifique: (1) todos os atores externos, (2) todos os processos, (3) todos os datastores, (4) todas as trust boundaries. Em seguida, aplique STRIDE nos 3 principais fluxos que cruzam trust boundaries e liste as ameaças encontradas.',
      concepts: ['DFD', 'trust-boundaries', 'STRIDE', 'sistemas-de-pagamento', 'PCI-DSS'],
    },
    {
      level: 'senior',
      title: 'Threat model completo de um sistema de autenticação com MFA',
      description: 'Faça o threat model completo de um sistema de autenticação que inclui: login com senha, MFA via TOTP, refresh token rotation, e endpoint de revogação de sessão. Entregue: (1) DFD com todos os elementos e trust boundaries, (2) lista de ameaças STRIDE por componente, (3) Attack Tree para "comprometer conta de usuário", (4) lista priorizada de mitigações com Likelihood × Impact, (5) mini-ADR documentando as decisões mais importantes. Compare com o que o OWASP ASVS exige para autenticação nível 2.',
      concepts: ['DFD', 'STRIDE', 'attack-tree', 'priorização', 'ADR', 'ASVS', 'MFA', 'refresh-tokens'],
    },
    {
      level: 'senior',
      title: 'Integrar threat modeling em um time ágil',
      description: 'Você é o engenheiro sênior de um time de 5 devs que nunca fez threat modeling. Proponha um processo que: (1) defina triggers claros para quando fazer threat modeling, (2) descreva o fluxo em ≤60 minutos por feature, (3) explique como ameaças viram itens rastreáveis (critérios de DoD ou bugs), (4) mostre como ADRs seriam usados, (5) justifique o ROI para o product manager usando o argumento de custo de correção por fase.',
      concepts: ['processo-ágil', 'ADR', 'custo-de-segurança', 'threat-modeling-incremental', 'justificativa-de-negócio'],
    },
  ],
  codeExamples: [
    {
      title: 'Análise STRIDE em código — comentários de threat model por endpoint',
      code: `// THREAT MODEL: POST /api/v1/payments
// Data: 2024-01-15 | Autor: time de segurança + backend

// === DFD ===
// Ator: Usuário autenticado (browser)
// Processo: PaymentController → PaymentService
// Datastore: PostgreSQL (orders), Redis (idempotency), Gateway externo (Stripe)
// Trust boundaries: internet → API, API → banco, API → Stripe

// === STRIDE por endpoint ===

// [S] SPOOFING
// Ameaça: token JWT forjado ou de usuário diferente
// Mitigação: verificar assinatura RS256 no guard; não aceitar alg:none
// Status: ✅ JwtAuthGuard global no AppModule

// [T] TAMPERING
// Ameaça: payload alterado em trânsito (amount, currency, recipient)
// Mitigação: HTTPS obrigatório; webhook signature do Stripe verificada
// Status: ✅ TLS enforced; Stripe signature validada no webhook handler

// [R] REPUDIATION
// Ameaça: usuário nega ter feito pagamento
// Mitigação: log imutável com userId, amount, timestamp, IP, idempotencyKey
// Status: ⚠️ TODO: logs de auditoria em tabela separada (imutável)

// [I] INFORMATION DISCLOSURE
// Ameaça: resposta retorna dados de cartão, PAN, CVV
// Mitigação: apenas token Stripe na resposta; PCI-DSS proíbe armazenar PAN
// Status: ✅ PaymentResponseDto expõe apenas paymentId e status

// [D] DENIAL OF SERVICE
// Ameaça: flood de requests cria cobranças em cascata no Stripe
// Mitigação: rate limit 10/min por usuário; idempotency key obrigatória
// Status: ✅ ThrottlerGuard + idempotencyKey header required

// [E] ELEVATION OF PRIVILEGE
// Ameaça: usuário aciona endpoint de reembolso sem ser admin ou dono
// Mitigação: verificar ownership (payment.userId === req.user.id) server-side
// Status: ✅ OwnershipGuard verifica antes de processar

export class PaymentController {
  @Post()
  @UseGuards(JwtAuthGuard, ThrottlerGuard)
  async createPayment(
    @Body() dto: CreatePaymentDto,
    @CurrentUser() user: User,
    @Headers('idempotency-key') idempotencyKey: string,
  ): Promise<PaymentResponseDto> {
    // Idempotency key obrigatória — previne double-charge (DoS via duplicação)
    if (!idempotencyKey) throw new BadRequestException('Idempotency-Key header required')
    return this.paymentService.create(dto, user.id, idempotencyKey)
  }
}`,
      language: 'typescript',
    },
    {
      title: 'DFD como código — representação estruturada de um sistema',
      code: `// Threat Model: Sistema de autenticação com MFA
// Formato estruturado para versionamento em código

const THREAT_MODEL = {
  system: 'Auth Service v2.0',
  date: '2024-01-15',
  scope: 'Login, MFA, refresh token rotation',

  actors: [
    { id: 'user', label: 'Usuário final', trust: 'untrusted', zone: 'internet' },
    { id: 'admin', label: 'Admin interno', trust: 'low', zone: 'vpn' },
    { id: 'email-provider', label: 'SendGrid (MFA email)', trust: 'external', zone: 'internet' },
  ],

  processes: [
    { id: 'auth-api', label: 'Auth API', zone: 'dmz' },
    { id: 'totp-service', label: 'TOTP Service', zone: 'internal' },
    { id: 'session-store', label: 'Session Manager', zone: 'internal' },
  ],

  datastores: [
    { id: 'user-db', label: 'User DB (PostgreSQL)', zone: 'internal', sensitivity: 'high' },
    { id: 'session-cache', label: 'Session Cache (Redis)', zone: 'internal', sensitivity: 'high' },
    { id: 'audit-log', label: 'Audit Log (append-only)', zone: 'internal', sensitivity: 'medium' },
  ],

  trustBoundaries: [
    { id: 'internet-dmz', label: 'Internet → DMZ', between: ['user', 'auth-api'] },
    { id: 'dmz-internal', label: 'DMZ → Internal', between: ['auth-api', 'user-db'] },
  ],

  threats: [
    {
      id: 'T001',
      category: 'Spoofing',
      component: 'auth-api',
      description: 'JWT forjado ou assinatura não verificada',
      likelihood: 'medium',
      impact: 'high',
      priority: 'high',
      mitigations: ['Verificar assinatura RS256', 'Rejeitar alg:none', 'Curta expiração de access token'],
      status: 'mitigated',
    },
    {
      id: 'T002',
      category: 'Repudiation',
      component: 'auth-api',
      description: 'Usuário nega login — sem log de auditoria imutável',
      likelihood: 'low',
      impact: 'high',
      priority: 'medium',
      mitigations: ['Audit log append-only com userId + IP + timestamp + userAgent'],
      status: 'in-progress',
    },
    {
      id: 'T003',
      category: 'Elevation of Privilege',
      component: 'totp-service',
      description: 'Race condition no TOTP — mesmo código aceito duas vezes',
      likelihood: 'medium',
      impact: 'high',
      priority: 'high',
      mitigations: ['Marcar código como usado em Redis com TTL = window TOTP'],
      status: 'open',
    },
  ],
} as const`,
      language: 'typescript',
    },
    {
      title: 'ADR — Architecture Decision Record de segurança',
      code: `# ADR-012: Estratégia de rotação de refresh tokens

## Status
Accepted

## Contexto
O sistema de autenticação usa access tokens (15 min) + refresh tokens (30 dias).
Threat model identificou [T007] session hijacking via refresh token roubado.
Se um atacante rouba o refresh token, tem 30 dias de acesso silencioso.

## Ameaças mapeadas (STRIDE)
- [S] Spoofing: refresh token roubado → sessão falsificada
- [I] Info Disclosure: refresh token em log ou URL → vaza para terceiros
- [E] Elevation: refresh token com escopo amplo permite acessar qualquer endpoint

## Decisão
Implementar refresh token rotation com detecção de reuso:
1. Cada uso do refresh token gera um NOVO refresh token e invalida o anterior
2. Se o mesmo refresh token for usado 2x → invalidar TODA a família de sessão
3. Armazenar token hash (sha256) no banco — nunca o token em claro
4. Refresh tokens em httpOnly cookie — não acessível por JavaScript (XSS mitigation)

## Alternativas consideradas
- Short-lived refresh tokens (1h): mais seguro, pior UX — usuário reautentica constantemente
- Refresh tokens de uso único sem detecção de família: mitiga reuso mas não detecta ataque em andamento

## Consequências
- (+) Sessão roubada invalida o atacante automaticamente ao próximo uso legítimo
- (+) Detecta ataque ativo (reuso do token antigo) → invalida toda a família
- (-) Refresh simultâneo de dois devices pode causar falso positivo
- Mitigação: janela de graça de 30s para requisições simultâneas legítimas

## Referências
- OWASP Session Management Cheat Sheet
- RFC 6749 (OAuth 2.0) — Token Refresh
- Threat model: security/auth-service-v2-threat-model.md#T007`,
      language: 'markdown',
    },
    {
      title: 'Checklist de threat model por feature em PR template',
      code: `## Checklist de Segurança (Threat Model)

### Esta mudança afeta segurança?
- [ ] Adiciona novo endpoint público
- [ ] Muda lógica de autenticação ou autorização
- [ ] Toca dados sensíveis (PII, financeiro, credenciais)
- [ ] Adiciona integração com serviço externo
- [ ] Muda schema do banco (novos campos, novas tabelas)

### Se marcou qualquer checkbox acima, complete o STRIDE:

**[S] Spoofing** — Quem pode se passar por outro nesta mudança?
<!-- Mitigação implementada: -->

**[T] Tampering** — Dados podem ser modificados em trânsito ou em repouso?
<!-- Mitigação implementada: -->

**[R] Repudiation** — Ações críticas são logadas com contexto suficiente?
<!-- Log implementado: userId + ação + timestamp + IP -->

**[I] Information Disclosure** — A resposta pode vazar dados não autorizados?
<!-- DTO explícito? Erros genéricos em produção? -->

**[D] Denial of Service** — Rate limiting? Limite de payload? Timeout?
<!-- Configuração: -->

**[E] Elevation of Privilege** — Verificação de role/ownership é server-side?
<!-- Guard/check implementado: -->

### ADR necessário?
- [ ] Não — mudança sem impacto arquitetural de segurança
- [ ] Sim — link para ADR: <!-- docs/adrs/ADR-XXX.md -->`,
      language: 'markdown',
    },
  ],
  interview: [
    {
      q: 'Explique STRIDE e como você o aplicaria a um endpoint de login.',
      a: '<p>STRIDE é o framework da Microsoft para classificar ameaças: <strong>S</strong>poofing (fingir ser outro), <strong>T</strong>ampering (modificar dados), <strong>R</strong>epudiation (negar ações), <strong>I</strong>nformation Disclosure (expor dados), <strong>D</strong>enial of Service (indisponibilidade), <strong>E</strong>levation of Privilege (obter mais permissões).</p><p>Para <code>POST /auth/login</code>:<br/>S = alguém pode forjar credenciais ou roubar sessão? → bcrypt, JWT assinado RS256, MFA<br/>T = payload pode ser interceptado? → HTTPS obrigatório<br/>R = há log da tentativa com IP e timestamp? → auditoria imutável<br/>I = a resposta diferencia "usuário não existe" de "senha errada"? → não deveria<br/>D = há rate limiting por IP e por usuário? → brute force prevention<br/>E = o login pode dar acesso a funções admin sem verificação de role? → BFLA check</p>',
      tip: 'Aplicar STRIDE a um exemplo concreto demonstra que você realmente usa o framework, não só conhece a sigla. Mencionar a diferença de mensagem de erro (information disclosure by design) é o detalhe que diferencia o nível sênior.',
      level: 'senior',
    },
    {
      q: 'O que é um trust boundary em um DFD e por que ele é importante para threat modeling?',
      a: '<p>Trust boundary é o limite entre zonas com diferentes níveis de confiança — ex: internet vs. DMZ, DMZ vs. rede interna, processo com privilege vs. processo sem privilege, browser vs. servidor.</p><p>A importância: <strong>ameaças geralmente cruzam trust boundaries</strong>. Um dado que vai de "internet" para "processo do servidor" precisa ser validado e autenticado porque vem de uma zona não confiável. Identificar todas as trust boundaries no DFD e garantir que todo dado que cruza seja validado é o núcleo do threat modeling.</p><p>Erro comum: assumir que rede interna = confiável. Um microserviço interno também precisa validar input de outros microserviços — não por desconfiança de equipe, mas porque qualquer um deles pode ser comprometido.</p>',
      tip: 'Exemplos concretos de trust boundaries do dia a dia (browser/servidor, usuário/admin, serviço externo/serviço interno) demonstram maturidade. O ponto sobre rede interna ≠ confiável é o que diferencia o raciocínio sênior.',
      level: 'senior',
    },
    {
      q: 'Como você integraria threat modeling em um time ágil sem criar um processo pesado?',
      a: '<p>Em times ágeis, o threat model não precisa ser uma sessão de 2 dias antes do lançamento. A abordagem incremental funciona melhor:</p><ul><li>Definir triggers claros: feature com novo endpoint, nova integração, mudança de auth → 30-60 minutos antes de codar</li><li>DFD mínimo da feature — só os fluxos novos</li><li>STRIDE nos trust boundaries do DFD</li><li>Ameaças viram critérios de aceitação da story (DoD) ou bugs de segurança com prioridade</li></ul><p>Ferramentas: <code>OWASP Threat Dragon</code> para DFDs, GitHub Issues/Jira para rastrear mitigações, ADR para documentar decisões. O ponto-chave: threat modeling antes de codar é 10x mais barato que corrigir depois de deployar.</p>',
      tip: 'Mostrar que você entende o custo de corrigir segurança após o fato e consegue justificar o investimento de 30-60 min por feature é o argumento que convence times de negócio. Mencionar que ameaças viram DoD (não backlog) é o detalhe de processo maduro.',
      level: 'senior',
    },
    {
      q: 'Qual a diferença entre STRIDE e DREAD?',
      a: '<p><strong>STRIDE</strong> classifica o <em>tipo</em> de ameaça (o que pode acontecer). <strong>DREAD</strong> era um modelo de scoring numérico para priorizar ameaças: Damage potential, Reproducibility, Exploitability, Affected users, Discoverability — cada critério de 0-10 e a média determinava a prioridade.</p><p>A Microsoft descontinuou o DREAD porque era excessivamente subjetivo (dois engenheiros davam notas completamente diferentes para a mesma ameaça) e criava falsa precisão numérica. Hoje o mais comum é uma matriz simples de risco (<strong>Likelihood × Impact</strong>: alto/médio/baixo) para priorizar as ameaças identificadas pelo STRIDE.</p>',
      tip: 'Saber que DREAD foi descontinuado e por quê demonstra que seu conhecimento é atualizado. A crítica de "falsa precisão" é sofisticada e impressiona — mostra pensamento crítico sobre metodologias, não só conhecimento delas.',
      level: 'senior',
    },
    {
      q: 'Como threat modeling se relaciona com o A04 do OWASP Top 10?',
      a: '<p>O <strong>A04 (Insecure Design)</strong> foi criado na versão 2021 para capturar falhas que não são bugs de implementação — são decisões de design que criam vetores de ataque que nenhuma correção de código resolve depois. Exemplos: fluxo de "esqueci a senha" que confirma se o e-mail existe (information disclosure by design), API que por design retorna o objeto completo do banco.</p><p>Threat modeling é a prática que previne o A04 porque força a análise de segurança antes de codificar — você modela os fluxos, aplica STRIDE, e os requisitos de segurança entram no design, não como itens de backlog que nunca chegam à frente. Sem threat modeling, A04 é praticamente inevitável em sistemas de qualquer complexidade.</p>',
      tip: 'Conectar threat modeling ao A04 demonstra visão sistêmica — você entende a relação entre processo e resultado. Dar um exemplo concreto de Insecure Design (o fluxo de "esqueci a senha") é o que transforma a resposta de boa para excelente.',
      level: 'senior',
    },
    {
      q: 'Descreva um threat model básico para um sistema de pagamento com usuário → API → processador externo.',
      a: '<p>DFD: ator externo (usuário/browser) → trust boundary → processo (API de pagamento) → trust boundary → datastore (banco de pedidos) + ator externo (gateway de pagamento).</p><p>Principais ameaças STRIDE:<br/>S: usuário forja identidade de outro? → JWT verificado + 3DS no gateway<br/>T: payload interceptado ou alterado? → HTTPS + webhook signature verification<br/>R: log imutável de cada tentativa com userId, valor, timestamp, IP? → necessário para chargebacks<br/>I: resposta inclui dados de cartão? → PCI-DSS proíbe — armazenar apenas token do gateway<br/>D: requests ilimitados criam cobranças em cascata? → rate limit + idempotency keys<br/>E: usuário aciona reembolso sem ser dono? → BFLA verification com ownership check</p>',
      tip: 'Mencionar PCI-DSS e idempotency keys em pagamentos demonstra experiência real com domínio financeiro. Idempotency keys são item de segurança (evita double-charge), não só de UX — esse insight é de nível sênior.',
      level: 'senior',
    },
    {
      q: 'O que é um Attack Tree e quando usá-lo junto com STRIDE?',
      a: '<p>Attack Tree modela o objetivo do atacante como raiz de uma árvore, com os caminhos para alcançá-lo como nós filhos. Nós <strong>OR</strong>: qualquer caminho filho é suficiente para o ataque. Nós <strong>AND</strong>: todos os caminhos filhos devem falhar simultaneamente.</p><p>Quando usar junto com STRIDE: STRIDE identifica categorias de ameaça por componente. Attack Tree mostra como múltiplas ameaças se combinam para atingir um objetivo maior. Exemplo: raiz = "comprometer conta admin" → OR → credenciais vazadas / session hijacking / SSRF → AND (para SSRF) → sem allowlist de domínio + metadados de cloud acessíveis.</p><p>O insight dos nós AND é valioso: implanta qualquer controle do AND e o caminho de ataque está bloqueado — ajuda a priorizar onde implementar defesas.</p>',
      tip: 'A explicação dos nós AND é o que diferencia o sênior: mostra que você entende defesa em profundidade. Se múltiplos controles devem falhar (AND), implementar qualquer um bloqueia o caminho.',
      level: 'senior',
    },
    {
      q: 'Como você documenta ameaças de forma que o time possa rastrear e revisitar?',
      a: '<p>Duas camadas de documentação que funcionam juntas:</p><ul><li><strong>ADR (Architecture Decision Record):</strong> documenta contexto, decisão de mitigação, alternativas consideradas, consequências. Permite revisitar quando o contexto muda sem perder o raciocínio original. Formato simples em markdown, versionado no repositório.</li><li><strong>Registro de ameaças:</strong> tabela com ID, categoria STRIDE, componente afetado, descrição, likelihood, impact, prioridade, mitigações, status (open/in-progress/mitigated). Pode ser Issues do GitHub/Jira com label "security".</li></ul><p>Critério de revisita: DFD muda significativamente (novo serviço, nova integração, mudança de auth) → reabrir o threat model da área afetada. ADR é o artefato que explica "por que escolhemos esta mitigação em vez de outra".</p>',
      tip: 'A combinação ADR + registro de ameaças mostra processo maduro. Muitos times fazem o threat model mas não documentam — 6 meses depois ninguém sabe por que certas decisões foram tomadas.',
      level: 'senior',
    },
    {
      q: 'Qual a diferença entre ameaça, vulnerabilidade e risco em threat modeling?',
      a: '<p><strong>Ameaça (Threat):</strong> o que pode acontecer de ruim — ação de um agente malicioso ou evento. Ex: "atacante intercepta token JWT". É o que o STRIDE categoriza.</p><p><strong>Vulnerabilidade:</strong> a fraqueza que torna a ameaça possível. Ex: "token transmitido via HTTP sem TLS". É a causa técnica da ameaça.</p><p><strong>Risco:</strong> combinação de probabilidade + impacto. Ex: "alta probabilidade de interceptação em ambiente público (sem TLS) × impacto alto (acesso à conta)". É o que a matriz Likelihood × Impact quantifica.</p><p>Uma ameaça pode ter múltiplas vulnerabilidades subjacentes. O threat modeling identifica ameaças; a análise de vulnerabilidades detalha as causas; o scoring de risco prioriza qual mitigar primeiro.</p>',
      tip: 'A distinção ameaça/vulnerabilidade/risco é fundamental e muitos candidatos confundem os três. Dar exemplos concretos da mesma situação em três camadas demonstra clareza conceitual.',
      level: 'pleno',
    },
    {
      q: 'Como o princípio de least privilege se aplica no contexto de threat modeling?',
      a: '<p>Least privilege é a mitigação primária para a categoria <strong>E (Elevation of Privilege)</strong> do STRIDE. O princípio: cada componente, serviço ou usuário deve ter exatamente as permissões necessárias para sua função — nem mais, nem menos.</p><p>Na prática:<br/><code>IAM roles</code>: Lambda que só lê do S3 não precisa de permissão de write nem de acesso a outros buckets<br/><code>DB users</code>: serviço de leitura usa usuário com SELECT only — não o user de migrations<br/><code>Microserviços</code>: serviço A não acessa direto o banco do serviço B — apenas via API do serviço B<br/><code>API endpoints</code>: verificação de role e ownership server-side em cada operação privilegiada</p><p>Em threat modeling: quando mapeamos fluxos, verificamos se o nível de acesso de cada componente é o mínimo necessário. Se um componente tem acesso maior que o necessário, é uma ameaça de Elevation latente.</p>',
      tip: 'Exemplos práticos de least privilege em infraestrutura (IAM, DB users, microserviços) mostram que você aplica o conceito, não só o conhece. Conectar ao STRIDE (categoria E) é o que faz a resposta coesa.',
      level: 'pleno',
    },
    {
      q: 'O que é PASTA e quando usá-lo em vez de STRIDE?',
      a: '<p><strong>PASTA (Process for Attack Simulation and Threat Analysis)</strong> é um framework de 7 estágios, orientado a risco de negócio: (1) definição de objetivos de negócio e segurança, (2) definição do escopo técnico, (3) decomposição da aplicação, (4) análise de ameaças, (5) análise de vulnerabilidades, (6) análise e emulação de ataque, (7) análise de risco e impacto.</p><p>Diferença: STRIDE é focado em ameaças técnicas por componente — mais rápido, ideal para times de desenvolvimento. PASTA integra perspectiva de negócio, análise de vulnerabilidades reais e emulação de ataques — mais adequado para organizações com equipes de segurança dedicadas (AppSec, Red Team).</p><p>Escolha: time pequeno + security champion = STRIDE. Organização grande + equipe de segurança dedicada + sistemas críticos = PASTA ou combinação dos dois.</p>',
      tip: 'Saber que PASTA existe e quando usá-lo em vez de STRIDE demonstra amplitude. A maioria dos candidatos conhece só STRIDE — mencionar PASTA com critério claro de escolha mostra pesquisa além do básico.',
      level: 'senior',
    },
    {
      q: 'Como você lida com ameaças de Repudiation em sistemas distribuídos?',
      a: '<p>Repudiation é frequentemente esquecida no STRIDE — é a <strong>R</strong> que menos atenção recebe. Em sistemas distribuídos, é especialmente complexa porque uma ação pode passar por múltiplos serviços.</p><p>Mitigações em camadas:<br/><strong>1. Logs de auditoria imutáveis:</strong> tabela separada com append-only (sem UPDATE, sem DELETE), contendo userId, ação, timestamp, IP, contexto suficiente para reproduzir o estado<br/><strong>2. Correlação entre serviços:</strong> correlation ID propagado por todos os serviços — permite reconstruir a chain de eventos de uma ação<br/><strong>3. Assinatura digital:</strong> para operações críticas (transferências financeiras), assinar o log com chave privada do serviço<br/><strong>4. Consistência eventual:</strong> garantir que logs cheguem ao sistema de auditoria mesmo em falhas parciais (outbox pattern)</p><p>Tooling: ElasticSearch + Kibana ou AWS CloudTrail para auditoria centralizada.</p>',
      tip: 'A R do STRIDE é a mais esquecida — mencionar que você a leva a sério diferencia. O outbox pattern para garantir que logs de auditoria não se percam em falhas parciais é um detalhe de produção que impressiona.',
      level: 'senior',
    },
    {
      q: 'Como threat modeling interage com code review e análise estática (SAST)?',
      a: '<p>São camadas complementares, não substitutas:<br/><strong>Threat modeling</strong> acontece no design — identifica ameaças de arquitetura e fluxo de dados antes de qualquer código. Detecta Insecure Design (OWASP A04).<br/><strong>SAST</strong> acontece durante/após o desenvolvimento — detecta vulnerabilidades de implementação: SQL injection, XSS, hardcoded secrets, unsafe deserialization.<br/><strong>Code review</strong> detecta lógica incorreta, validação ausente, edge cases.</p><p>O threat model informa o que o code reviewer e o SAST devem prestar atenção: "nosso threat model identificou risco de BOLA — revisor, verifique se há ownership check em cada endpoint de leitura".</p><p>Sem threat model: SAST e code review são cegos para ameaças de design. Com threat model: você sabe onde olhar — análise mais focada, menos falsos negativos.</p>',
      tip: 'A explicação de que cada camada detecta problemas em fases diferentes é o insight-chave. SAST não substitui threat modeling nem vice-versa — threat model informa o que SAST e code review devem priorizar.',
      level: 'senior',
    },
    {
      q: 'O que é SSRF e como você o identificaria em um threat model?',
      a: '<p><strong>SSRF (Server-Side Request Forgery)</strong> é a ameaça API7 do OWASP API Top 10. Ocorre quando a API aceita URLs fornecidas pelo usuário e faz requisições sem validar o destino.</p><p>No threat model: aparece como ameaça no componente "Processo" quando há um fluxo de dados do tipo "Ator externo → fornece URL → Processo faz fetch". Trust boundary: o processo está na rede interna e pode alcançar serviços internos ou metadados de cloud.</p><p>Ameaças do SSRF:<br/>• Acesso a metadados de cloud: <code>http://169.254.169.254/</code> em AWS retorna credenciais IAM temporárias<br/>• Varredura de serviços internos: banco, Redis, serviços sem autenticação interna<br/>• Bypass de firewall: processo no servidor acessa o que o cliente externo não pode</p><p>Mitigações: allowlist de domínios externos permitidos; bloqueio de IPs privados (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.169.254); nunca resolver URL fornecida pelo usuário sem sanitização.</p>',
      tip: 'Mencionar o IP 169.254.169.254 específico de metadados AWS demonstra conhecimento prático. SSRF em cloud é devastador — esse detalhe mostra experiência real.',
      level: 'senior',
    },
    {
      q: 'Como você avalia o nível de cobertura de um threat model? Quando é "bom o suficiente"?',
      a: '<p>Threat model não precisa ser perfeito — precisa ser útil. Critérios de cobertura adequada:<br/><strong>1. Trust boundaries mapeadas:</strong> todos os pontos onde dados cruzam zonas de confiança foram identificados e analisados<br/><strong>2. STRIDE aplicado nos fluxos de risco:</strong> endpoints com dados sensíveis, autenticação, autorização, integrações externas<br/><strong>3. Ameaças de alto impacto rastreadas:</strong> cada ameaça com likelihood × impact ≥ médio tem status no registro<br/><strong>4. Mitigações verificáveis:</strong> cada mitigação pode ser testada ou verificada em code review</p><p>Quando parar: um modelo de 60% de cobertura feito antes de codar é infinitamente mais valioso que um de 100% feito 6 meses depois do lançamento. O objetivo não é exaustividade — é capturar os riscos que importam antes de codar.</p>',
      tip: 'A afirmação "60% antes > 100% depois" é poderosa e verdadeira. Mostra que você entende o ROI real do threat modeling versus o perfeccionismo que paralisa times.',
      level: 'pleno',
    },
    {
      q: 'Como threat modeling se aplica a sistemas com IA/LLM?',
      a: '<p>Sistemas com LLM têm superfície de ataque nova que o STRIDE tradicional cobre parcialmente:</p><p>Ameaças novas:<br/><strong>Prompt injection</strong> (análogo a SQL injection): input do usuário manipula o comportamento do modelo — classificar como Tampering + Elevation<br/><strong>Data exfiltration via LLM</strong>: modelo pode ser manipulado a revelar dados do contexto/sistema prompt — Information Disclosure<br/><strong>Jailbreak</strong>: bypass de guardrails do modelo — Elevation of Privilege<br/><strong>Training data poisoning</strong>: se o sistema usa fine-tuning com dados de usuário — Tampering</p><p>No DFD: o LLM é um processo com trust boundary especial — recebe input não estruturado do ator externo (usuário), e o output é não-determinístico. Trust boundary para dados injetados no contexto do sistema é crítica.</p><p>Mitigações: separação clara de dados estruturados vs. unstructured input do LLM; output parsing com schema validation; não incluir credenciais ou dados sensíveis no contexto do sistema prompt.</p>',
      tip: 'Saber aplicar threat modeling a LLMs é raro e demonstra que você está antenado na evolução da segurança. Prompt injection como Tampering + Elevation é a categorização correta no STRIDE.',
      level: 'senior',
    },
    {
      q: 'O que é o princípio de "defense in depth" e como ele se manifesta no threat modeling?',
      a: '<p>Defense in depth (defesa em profundidade) é o princípio de implementar múltiplas camadas de controle independentes, de forma que a falha de qualquer controle individual não comprometa o sistema.</p><p>No threat modeling, manifesta-se nos nós AND dos Attack Trees: se o caminho para o ataque requer que múltiplos controles falhem simultaneamente, você tem defesa em profundidade. Se qualquer nó OR sozinho é suficiente para o ataque, você tem um ponto único de falha de segurança.</p><p>Exemplo prático para credenciais:<br/>Layer 1: senha forte (bcrypt, política de complexidade)<br/>Layer 2: MFA (TOTP ou hardware key)<br/>Layer 3: rate limiting em login (brute force prevention)<br/>Layer 4: alertas de login de nova localização<br/>Layer 5: sessões com expiração e rotação de refresh tokens</p><p>No threat model: para cada ameaça de alto impacto, verificar se há pelo menos 2 controles independentes. Se há apenas 1, é single point of failure de segurança.</p>',
      tip: 'Conectar defense in depth com os nós AND do Attack Tree é o insight elegante: múltiplos controles = múltiplos nós AND = o atacante precisa que todos falhem. Essa ligação conceitual demonstra pensamento integrado.',
      level: 'senior',
    },
    {
      q: 'Como você faria threat modeling de uma API de upload de arquivos?',
      a: '<p>DFD: Ator externo (usuário) → trust boundary → Processo (Upload API) → Datastore (S3/storage) + Processo (File processor).</p><p>STRIDE nos fluxos principais:<br/><strong>S:</strong> upload feito em nome de outro usuário? → JWT + verificação de quota por userId<br/><strong>T:</strong> arquivo modificado em trânsito? → HTTPS + hash de integridade na resposta<br/><strong>R:</strong> usuário nega ter feito upload malicioso? → log com userId + hash do arquivo + timestamp<br/><strong>I:</strong> arquivo de outro usuário acessível? → URLs pré-assinadas do S3 com expiração + verificação de ownership<br/><strong>D:</strong> upload de arquivo gigante esgota storage ou banda? → limite de tamanho, throttling por usuário, limite de quota total<br/><strong>E:</strong> arquivo .exe renomeado como .jpg é processado? → validação de MIME type real (magic bytes), não só extensão</p><p>Ameaças adicionais: path traversal nos nomes de arquivo; zip bomb se descompressão for feita no servidor; malware em arquivos que são processados.</p>',
      tip: 'A validação de MIME type via magic bytes (não só extensão) é um detalhe de segurança importante. Mencionar zip bomb para uploads com descompressão é o que diferencia alguém que pensou nos edge cases.',
      level: 'pleno',
    },
    {
      q: 'Como threat modeling se relaciona com conformidade (PCI-DSS, LGPD, SOC 2)?',
      a: '<p>Threat modeling é uma prática técnica; conformidade é um framework legal/regulatório. A relação é complementar:</p><p><strong>Threat modeling alimenta conformidade:</strong> identificar onde dados sensíveis fluem (DFD) é o primeiro passo para mapear o escopo de PCI-DSS (dados de cartão) ou LGPD (dados pessoais). As mitigações STRIDE geram evidências de controles de segurança exigidos por SOC 2.</p><p><strong>Conformidade direciona threat modeling:</strong> PCI-DSS exige análise de ameaças periódica (Requirement 12.3.1). LGPD exige relatório de impacto à proteção de dados (RIPD) — similar a um threat model focado em privacidade. SOC 2 Type II exige demonstração de controles em operação.</p><p>Prática: use o threat model para gerar evidências de conformidade. O DFD do sistema mostra onde dados de cartão fluem (PCI-DSS scope). As mitigações implementadas são os controles do SOC 2.</p>',
      tip: 'Conectar threat modeling com LGPD (RIPD) é especialmente relevante no Brasil. Mostrar que você entende tanto a prática técnica quanto o contexto regulatório é o que define maturidade de engenheiro sênior que trabalha com produtos reais.',
      level: 'senior',
    },
    {
      q: 'Como você priorizaria ameaças quando há muitas identificadas?',
      a: '<p>Processo de priorização em 3 passos:</p><p><strong>1. Scoring por Likelihood × Impact:</strong><br/>Likelihood (probabilidade): existe exploit público? É fácil de explorar? O atacante precisa de acesso privilegiado?<br/>Impact (impacto): o que acontece se explorado? Dados de quantos usuários? Financeiro? Reputação?<br/>Matriz: Alta × Alto = prioridade crítica; Alta × Baixo ou Baixa × Alto = prioridade média; Baixa × Baixo = aceitar ou monitorar.</p><p><strong>2. Ordenar por custo de mitigação:</strong> ameaças de alto risco com mitigação barata vêm primeiro. Ex: "rate limiting faltando" (alta prioridade, 1 sprint) antes de "criptografia de dados em repouso" (alta prioridade, 3 sprints).</p><p><strong>3. Considerar dependências:</strong> algumas mitigações bloqueiam múltiplas ameaças. Ex: implementar JWT correto mitiga Spoofing, Elevation e parcialmente Information Disclosure simultaneamente.</p><p>Anti-padrão: tentar mitigar tudo de uma vez. Aceitar riscos baixos explicitamente (com registro) é decisão de engenharia válida.</p>',
      tip: 'O ponto sobre aceitar riscos explicitamente com registro é sofisticado — mostra que você entende que segurança é gestão de risco, não eliminação de risco. Risco zero não existe.',
      level: 'pleno',
    },
    {
      q: 'Quais ferramentas você usa para threat modeling e quais as diferenças entre elas?',
      a: '<p>Principais ferramentas com casos de uso:<br/><strong>OWASP Threat Dragon:</strong> open source, web e desktop, suporta DFDs com trust boundaries, STRIDE por fluxo, exporta JSON. Ideal para times com budget limitado e quem quer integrar ao repositório.<br/><strong>Microsoft Threat Modeling Tool:</strong> gratuito, desktop Windows, templates para Azure e GenAI (STRIDE-LM), gera lista de ameaças automaticamente por tipo de componente. Melhor quando o time já está no ecossistema Microsoft/Azure.<br/><strong>IriusRisk:</strong> pago, enterprise, integra com Jira, suporta múltiplos frameworks (STRIDE, PASTA, LINDDUN). Faz sentido para organizações com equipe de segurança dedicada e processos de conformidade.</p><p>Para DFDs simples sem ferramenta dedicada: <strong>draw.io</strong> com formas de DFD (processo = elipse, datastore = cilindro, trust boundary = linha pontilhada). Funciona bem para threat models de feature (30-60 min) sem overhead de ferramenta.</p>',
      tip: 'Mencionar draw.io como opção para threat models de feature é prático — mostra que você prioriza velocidade quando adequado. Não é sobre usar a ferramenta certa, é sobre fazer o threat model.',
      level: 'pleno',
    },
    {
      q: 'Como o threat modeling é diferente para sistemas legados vs. sistemas novos?',
      a: '<p><strong>Sistemas novos:</strong> threat modeling no design é o caso ideal. DFD emergente conforme o design evolui, STRIDE por componente antes de implementar. Mitigações entram como requisitos, não débito técnico. Custo mínimo — segurança é embutida.</p><p><strong>Sistemas legados:</strong> mais complexo. Passos recomendados:<br/>1. Descoberta: mapear o DFD a partir do código e documentação existente (frequentemente inexistente → entrevistar quem sabe)<br/>2. Priorização: não fazer threat model do sistema inteiro — identificar as partes de maior risco (dados sensíveis, autenticação, integrações externas) e começar por elas<br/>3. Threat model incremental: analisar um módulo por vez, priorizando os que recebem mudanças frequentes<br/>4. Débito de segurança: registrar ameaças identificadas como débito técnico com prioridade, não esconder</p><p>Armadilha: tentar fazer o threat model completo do legado de uma vez é paralisante. Incremental por módulo de alto risco é pragmático e entrega valor rapidamente.</p>',
      tip: 'A abordagem incremental para legados é o que times reais precisam. Mostrar que você sabe como iniciar sem informação completa (entrevistar quem sabe) é sinal de experiência prática.',
      level: 'senior',
    },
  ],
  gotchas: [
    'Threat modeling não é uma atividade de segurança isolada — é parte do design de software. Tratar como "auditoria de segurança separada" é o motivo pelo qual os resultados viram backlog ignorado.',
    'STRIDE classifica ameaças, não vulnerabilidades. Uma ameaça de Tampering pode ter múltiplas vulnerabilidades subjacentes (TLS ausente, sem validação de payload, sem constraints no banco).',
    'Trust boundaries são definidos pelo nível de confiança, não pela topologia de rede. Um microserviço interno também precisa validar input de outros microserviços.',
    'Ameaças de Repudiation (R no STRIDE) são frequentemente esquecidas — logs de auditoria imutáveis são um controle crítico que precisa ser planejado antes de ir para produção.',
    'Threat model não precisa ser perfeito — 60% de cobertura antes de codar é infinitamente mais valioso que 100% feito depois do lançamento.',
    'DREAD foi descontinuado — usar a matriz Likelihood × Impact em vez de scoring numérico que cria falsa precisão.',
    'Rede interna não é sinônimo de confiável — ameaças de movimento lateral entre serviços internos devem ser consideradas.',
  ],
  resources: [
    { title: 'OWASP Threat Modeling — Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html', kind: 'docs' },
    { title: 'Microsoft Threat Modeling Tool', url: 'https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool', kind: 'docs' },
    { title: 'OWASP Threat Dragon (ferramenta open source)', url: 'https://owasp.org/www-project-threat-dragon/', kind: 'pratica' },
    { title: 'STRIDE Threat Modeling — Adam Shostack', url: 'https://shostack.org/resources/threat-modeling', kind: 'artigo' },
    { title: 'Threat Modeling: Designing for Security — livro de Adam Shostack', url: 'https://www.wiley.com/en-us/Threat+Modeling%3A+Designing+for+Security-p-9781118809990', kind: 'livro' },
    { title: 'OWASP A04 Insecure Design', url: 'https://owasp.org/Top10/A04_2021-Insecure_Design/', kind: 'docs' },
    { title: 'STRIDE vs DREAD vs PASTA — comparação de frameworks', url: 'https://www.microsoft.com/en-us/security/blog/2009/07/21/the-stride-per-element-chart/', kind: 'artigo' },
    { title: 'Attack Trees — Bruce Schneier', url: 'https://www.schneier.com/academic/archives/1999/12/attack_trees.html', kind: 'artigo' },
    { title: 'Threat Modeling Manifesto', url: 'https://www.threatmodelingmanifesto.org/', kind: 'docs' },
  ],
  videos: [
    { title: 'Threat Modeling in 2023: Avoiding Pitfalls', channel: 'OWASP Global', url: 'https://www.youtube.com/watch?v=ZoxHIpzaZ6U' },
    { title: 'What is Threat Modeling? — STRIDE walkthrough', channel: 'IBM Technology', url: 'https://www.youtube.com/watch?v=ql8LLZX3oCY' },
    { title: 'Threat Modeling Every Story — Agile Security', channel: 'SANS Institute', url: 'https://www.youtube.com/watch?v=VbW-X0j35gw' },
    { title: 'OWASP Threat Dragon Demo', channel: 'OWASP Foundation', url: 'https://www.youtube.com/watch?v=e4Lq0SXTwHU' },
    { title: 'Practical Threat Modeling for Developers', channel: 'NDC Conferences', url: 'https://www.youtube.com/watch?v=5rsbAtlS40Q' },
  ],
}

export default threatModeling
