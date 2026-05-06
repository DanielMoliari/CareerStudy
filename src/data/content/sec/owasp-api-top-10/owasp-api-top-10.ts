import type { SkillContent } from '@/types'

const owaspApiTop10: SkillContent = {
    tagline: 'As 10 vulnerabilidades mais críticas de APIs REST — versão especializada do Top 10 para backends modernos.',
    why: 'APIs são a superfície de ataque dominante na arquitetura moderna: SPAs, apps mobile, integrações B2B — tudo passa por APIs. O OWASP API Top 10 (publicado em 2019, atualizado em 2023) lista falhas específicas de APIs que não aparecem de forma adequada no Top 10 web. Saber a diferença entre BOLA e BFLA, entender Excessive Data Exposure e Mass Assignment é diferencial imediato em entrevistas backend sênior.',
    summary: 'O OWASP API Security Project publicou o API Top 10 em 2019 reconhecendo que APIs têm uma superfície de ataque distinta de aplicações web tradicionais. A versão 2023 reorganizou e renomeou várias categorias. As falhas mais impactantes continuam sendo as de controle de acesso: BOLA (Broken Object Level Authorization, equivalente ao IDOR do Top 10 web) e BFLA (Broken Function Level Authorization). Excessive Data Exposure e Mass Assignment são falhas que emergem diretamente de como APIs REST são construídas — retornar mais dados do que necessário ou aceitar mais campos do que deveria. Unrestricted Resource Consumption (ex-Lack of Resources and Rate Limiting) cobre DoS via API sem throttling. Conhecer essas categorias orienta o design de APIs seguras desde o início.',
    keypoints: [
      {
        title: 'API1 — Broken Object Level Authorization (BOLA)',
        body: 'O IDOR das APIs: endpoint aceita um ID do objeto no request sem verificar se o usuário autenticado tem permissão para aquele objeto específico. A falha mais prevalente em APIs.',
        code: `// Vulnerável: qualquer usuário logado acessa qualquer pedido
GET /api/orders/5678   // usuário A acessa pedido do usuário B

// Seguro: verifica ownership no service layer
async function getOrder(orderId: string, userId: string) {
  const order = await db.orders.findById(orderId)
  if (!order || order.userId !== userId) throw new ForbiddenError()
  return order
}`,
      },
      {
        title: 'API2 — Broken Authentication',
        body: 'Tokens fracos, sem expiração, não invalidados no logout, ou transmitidos por canais inseguros. Inclui refresh tokens que nunca rotacionam e JWTs sem verificação de assinatura.',
      },
      {
        title: 'API3 — Broken Object Property Level Authorization (Mass Assignment)',
        body: 'API aceita campos no body que não deveria — o cliente envia campos extras e o ORM os salva automaticamente. Exemplo: POST /users com { "name": "João", "role": "admin" } e o backend faz user.update(req.body) sem filtrar os campos.',
        code: `// Vulnerável: salva tudo que veio no body
await User.update(req.params.id, req.body) // req.body pode ter { role: 'admin' }

// Seguro: allowlist explícita dos campos aceitos
const { name, email, bio } = req.body
await User.update(req.params.id, { name, email, bio }) // role não entra`,
      },
      {
        title: 'API4 — Unrestricted Resource Consumption',
        body: 'APIs sem rate limiting, sem limite de tamanho de payload, sem paginação obrigatória — permitem DoS ou custos abusivos. Inclui GraphQL sem query depth limiting (query recursiva que explode o servidor).',
      },
      {
        title: 'API5 — Broken Function Level Authorization (BFLA)',
        body: 'Diferente de BOLA (objeto): aqui o usuário acessa funções/endpoints que não deveria — ex: endpoint de admin acessível por usuário comum porque a verificação de role está ausente ou só no frontend.',
      },
      {
        title: 'API6 — Unrestricted Access to Sensitive Business Flows',
        body: 'Fluxos de negócio sensíveis sem controle adequado: comprar item com quantidade negativa, abusar de cupons de desconto ilimitadamente, fazer scraping de catálogo sem throttle. Diferente de rate limiting genérico — é sobre lógica de negócio que permite abusos automatizados. Requer modelagem de casos de abuso durante o design.',
      },
      {
        title: 'API7 — Server-Side Request Forgery (SSRF) em APIs',
        body: 'APIs que aceitam URLs de usuário (webhooks, importação de arquivo, preview de link) e fazem fetch server-side sem validar o destino. Um atacante pode apontar para metadados de cloud (169.254.169.254), serviços internos ou exfiltrar dados. Mitigue com allowlist de domínios + bloqueio de IPs privados.',
        code: `// Vulnerável: aceita qualquer URL de webhook sem validação
async function testWebhook(url: string) {
  return fetch(url) // pode ser http://169.254.169.254/latest/meta-data/
}

// Seguro: allowlist + bloqueio de IPs privados
import { isPrivateIP } from 'is-private-ip'
async function testWebhook(url: string) {
  const parsed = new URL(url)
  if (!ALLOWED_DOMAINS.includes(parsed.hostname)) throw new Error('Domínio não permitido')
  const { address } = await dns.lookup(parsed.hostname)
  if (isPrivateIP(address)) throw new Error('IP privado bloqueado')
  return fetch(url)
}`,
      },
      {
        title: 'API8/9/10 — Security Misconfiguration, Improper Inventory, Unsafe Consumption',
        body: 'API8: headers de segurança ausentes, CORS aberto demais, stack traces em produção, verbose error messages. API9: shadow APIs e APIs zumbis — versões antigas (v1, v2) esquecidas sem deprecação ou autenticação, expostas na internet. API10: confiar cegamente em respostas de APIs de terceiros sem validar schema, Content-Type ou tamanho — pode levar a injection ou crashes.',
        code: `// API9: auditar versões de API expostas — remover ou autenticar versões antigas
// Ruim: /api/v1/users (sem auth) ainda acessível após lançar /api/v2
// Bom: manter inventário de endpoints, deprecar v1 com sunset header e remover

// API10: validar resposta de API externa antes de usar
const raw = await fetch('https://parceiro.com/api/dados').then(r => r.json())
const safe = externalDataSchema.parse(raw) // Zod valida shape + tipos antes de usar`,
      },
    ],
    diagrams: [
      {
        title: 'BOLA vs BFLA — Diferença fundamental',
        html: `<style>
.apitop-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px}
.apitop-card{background:#1e293b;border-radius:10px;padding:16px;border:1.5px solid #334155}
.apitop-label{font-size:9px;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px;font-weight:700}
.apitop-attack{background:#0f172a;border-radius:6px;padding:8px 11px;font-family:'JetBrains Mono',monospace;font-size:10.5px;color:#fca5a5;margin:8px 0;border-left:2px solid #ef4444}
.apitop-fix{background:#0f172a;border-radius:6px;padding:8px 11px;font-family:'JetBrains Mono',monospace;font-size:10.5px;color:#86efac;margin:8px 0;border-left:2px solid #22c55e}
</style>
<div class="apitop-wrap">
  <p style="color:#e2e8f0;font-size:13px;font-weight:700;margin:0 0 4px">BOLA vs BFLA</p>
  <p style="color:#475569;font-size:10px;margin:0 0 16px">As duas falhas de controle de acesso em APIs que mais causam incidentes reais</p>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
    <div class="apitop-card">
      <div class="apitop-label" style="color:#ef4444">API1 — BOLA</div>
      <div style="font-size:11.5px;color:#e2e8f0;font-weight:600;margin-bottom:6px">Broken Object Level Auth</div>
      <div style="font-size:10px;color:#94a3b8;margin-bottom:8px">O usuário acessa o <strong style="color:#fca5a5">objeto errado</strong> — mas via endpoint legítimo.</div>
      <div class="apitop-attack">GET /api/invoices/<strong>9999</strong>
← fatura de outro usuário</div>
      <div style="font-size:10px;color:#64748b;margin-bottom:6px">Pergunta que falta: "este objeto pertence ao usuário logado?"</div>
      <div class="apitop-fix">if (invoice.userId !== req.user.id)
  return 403</div>
    </div>
    <div class="apitop-card">
      <div class="apitop-label" style="color:#f97316">API5 — BFLA</div>
      <div style="font-size:11.5px;color:#e2e8f0;font-weight:600;margin-bottom:6px">Broken Function Level Auth</div>
      <div style="font-size:10px;color:#94a3b8;margin-bottom:8px">O usuário acessa a <strong style="color:#fdba74">função errada</strong> — endpoint que não deveria ser acessível.</div>
      <div class="apitop-attack">DELETE /api/admin/users/42
← usuário comum deleta conta</div>
      <div style="font-size:10px;color:#64748b;margin-bottom:6px">Pergunta que falta: "este usuário tem role para esta operação?"</div>
      <div class="apitop-fix">if (!req.user.roles.includes('admin'))
  return 403</div>
    </div>
  </div>
  <div style="background:#1e293b;border-radius:8px;padding:12px;margin-top:12px;border:1px solid #1e3a5f">
    <div style="font-size:10px;color:#94a3b8;line-height:1.7"><strong style="color:#e2e8f0">Regra de ouro:</strong> toda chamada de API precisa de duas verificações independentes: <span style="color:#ef4444">autenticação</span> (quem é você?) + <span style="color:#f97316">autorização</span> (você pode acessar este objeto? Você pode executar esta função?). As duas são server-side, nunca delegadas ao cliente.</div>
  </div>
</div>`,
        caption: 'BOLA e BFLA juntas respondem pela maioria dos incidentes reais de APIs. A diferença: BOLA = "objeto errado via função certa", BFLA = "função errada, independente do objeto".',
      },
      {
        title: 'OWASP API Top 10 (2023) — Mapa completo das 10 categorias',
        html: `<style>
.ow2-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;max-width:680px}
.ow2-row{display:flex;align-items:flex-start;gap:10px;padding:7px 10px;border-radius:8px;margin-bottom:4px;transition:background .15s;cursor:default;position:relative}
.ow2-row:hover{background:#1e293b}
.ow2-badge{min-width:42px;height:22px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;letter-spacing:.05em;flex-shrink:0;margin-top:1px}
.ow2-name{flex:1;font-size:11px;color:#e2e8f0;font-weight:600;line-height:1.4}
.ow2-tag{font-size:9px;font-weight:700;color:#0c8a9e;background:rgba(12,132,158,.12);border-radius:3px;padding:1px 5px;display:inline-block;margin-top:3px}
.ow2-tip{position:relative;flex-shrink:0}
.ow2-tip:hover .ow2-tb{display:block}
.ow2-tb{display:none;position:absolute;right:0;top:calc(100% + 4px);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:10px;line-height:1.65;z-index:40;color:#94a3b8;width:270px;pointer-events:none;box-shadow:0 4px 20px rgba(0,0,0,.85)}
.ow2-icon{font-size:12px;cursor:help;color:#475569}
.ow2-icon:hover{color:#0c8a9e}
.ow2-legend{display:flex;gap:16px;margin-top:14px;flex-wrap:wrap}
.ow2-leg{display:flex;align-items:center;gap:5px;font-size:9px;color:#64748b}
.ow2-dot{width:8px;height:8px;border-radius:2px}
</style>
<div class="ow2-wrap">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
    <div>
      <p style="color:#0c8a9e;font-size:13px;font-weight:700;margin:0">OWASP API Security Top 10 — 2023</p>
      <p style="color:#475569;font-size:10px;margin:4px 0 0">Passe o mouse no ? para ver o vetor de ataque e mitigação de cada categoria.</p>
    </div>
  </div>

  <div class="ow2-row">
    <div class="ow2-badge" style="background:rgba(239,68,68,.18);color:#ef4444">API1</div>
    <div class="ow2-name">Broken Object Level Authorization<br><span class="ow2-tag">BOLA / IDOR</span></div>
    <div class="ow2-tip"><span class="ow2-icon">?</span><div class="ow2-tb"><strong>Ataque:</strong> GET /orders/9999 retorna pedido de outro usuário sem checar ownership.<br><strong>Mitigue:</strong> sempre verificar no service layer se o objeto pertence ao usuário autenticado.</div></div>
  </div>

  <div class="ow2-row">
    <div class="ow2-badge" style="background:rgba(239,68,68,.18);color:#ef4444">API2</div>
    <div class="ow2-name">Broken Authentication</div>
    <div class="ow2-tip"><span class="ow2-icon">?</span><div class="ow2-tb"><strong>Ataque:</strong> tokens sem expiração, refresh tokens permanentes, JWTs sem verificar assinatura.<br><strong>Mitigue:</strong> expiração curta, rotação de refresh tokens, sempre jwt.verify() — nunca jwt.decode().</div></div>
  </div>

  <div class="ow2-row">
    <div class="ow2-badge" style="background:rgba(249,115,22,.18);color:#f97316">API3</div>
    <div class="ow2-name">Broken Object Property Level Auth<br><span class="ow2-tag">Mass Assignment + Over-exposure</span></div>
    <div class="ow2-tip"><span class="ow2-icon">?</span><div class="ow2-tb"><strong>Ataque:</strong> POST /users com {role:"admin"} e ORM salva sem filtrar. Ou GET /users retorna passwordHash.<br><strong>Mitigue:</strong> allowlist de campos aceitos (Zod/DTO) + DTOs de resposta explícitos.</div></div>
  </div>

  <div class="ow2-row">
    <div class="ow2-badge" style="background:rgba(249,115,22,.18);color:#f97316">API4</div>
    <div class="ow2-name">Unrestricted Resource Consumption</div>
    <div class="ow2-tip"><span class="ow2-icon">?</span><div class="ow2-tb"><strong>Ataque:</strong> flood de requests, GraphQL query recursiva, upload de arquivo sem limite de tamanho.<br><strong>Mitigue:</strong> rate limit por IP + por usuário, query depth limit, payload size limit, paginação obrigatória.</div></div>
  </div>

  <div class="ow2-row">
    <div class="ow2-badge" style="background:rgba(239,68,68,.18);color:#ef4444">API5</div>
    <div class="ow2-name">Broken Function Level Authorization<br><span class="ow2-tag">BFLA</span></div>
    <div class="ow2-tip"><span class="ow2-icon">?</span><div class="ow2-tb"><strong>Ataque:</strong> DELETE /admin/users/42 acessível por usuário sem role de admin.<br><strong>Mitigue:</strong> verificar role server-side em cada endpoint sensível; não esconder no frontend.</div></div>
  </div>

  <div class="ow2-row">
    <div class="ow2-badge" style="background:rgba(100,116,139,.18);color:#94a3b8">API6</div>
    <div class="ow2-name">Unrestricted Access to Sensitive Business Flows</div>
    <div class="ow2-tip"><span class="ow2-icon">?</span><div class="ow2-tb"><strong>Ataque:</strong> bot compra estoque inteiro, abusa cupons ilimitadamente, faz scraping sem throttle.<br><strong>Mitigue:</strong> modelar casos de abuso no design; CAPTCHA, rate limit por fluxo, device fingerprinting.</div></div>
  </div>

  <div class="ow2-row">
    <div class="ow2-badge" style="background:rgba(239,68,68,.18);color:#ef4444">API7</div>
    <div class="ow2-name">Server-Side Request Forgery<br><span class="ow2-tag">SSRF via webhook/URL</span></div>
    <div class="ow2-tip"><span class="ow2-icon">?</span><div class="ow2-tb"><strong>Ataque:</strong> webhook URL aponta para 169.254.169.254 — servidor faz fetch e retorna credenciais IAM.<br><strong>Mitigue:</strong> allowlist de domínios, bloquear IPs privados/link-local após resolução DNS.</div></div>
  </div>

  <div class="ow2-row">
    <div class="ow2-badge" style="background:rgba(100,116,139,.18);color:#94a3b8">API8</div>
    <div class="ow2-name">Security Misconfiguration</div>
    <div class="ow2-tip"><span class="ow2-icon">?</span><div class="ow2-tb"><strong>Ataque:</strong> CORS com Allow-Origin: *, stack traces em respostas de erro, headers de segurança ausentes.<br><strong>Mitigue:</strong> helmet.js, CORS restrito a origens conhecidas, erros genéricos em produção.</div></div>
  </div>

  <div class="ow2-row">
    <div class="ow2-badge" style="background:rgba(100,116,139,.18);color:#94a3b8">API9</div>
    <div class="ow2-name">Improper Inventory Management<br><span class="ow2-tag">APIs zumbi / shadow APIs</span></div>
    <div class="ow2-tip"><span class="ow2-icon">?</span><div class="ow2-tb"><strong>Ataque:</strong> /api/v1/users ainda acessível sem autenticação após lançar v2 com auth.<br><strong>Mitigue:</strong> inventário de todas as APIs expostas, sunset header em versões deprecated, remoção ativa.</div></div>
  </div>

  <div class="ow2-row">
    <div class="ow2-badge" style="background:rgba(100,116,139,.18);color:#94a3b8">API10</div>
    <div class="ow2-name">Unsafe Consumption of APIs</div>
    <div class="ow2-tip"><span class="ow2-icon">?</span><div class="ow2-tb"><strong>Ataque:</strong> parceiro comprometido retorna payload malicioso que causa injection ou crash no sistema.<br><strong>Mitigue:</strong> validar schema da resposta externa (Zod), não confiar em Content-Type, limitar tamanho.</div></div>
  </div>

  <div class="ow2-legend">
    <div class="ow2-leg"><div class="ow2-dot" style="background:#ef4444"></div>Controle de acesso (alto impacto)</div>
    <div class="ow2-leg"><div class="ow2-dot" style="background:#f97316"></div>Recursos e dados</div>
    <div class="ow2-leg"><div class="ow2-dot" style="background:#94a3b8"></div>Configuração e inventário</div>
  </div>
</div>`,
        caption: 'OWASP API Top 10 2023. API1, API2 e API5 (controle de acesso) são as categorias de maior impacto — juntas cobrem a maioria dos incidentes reais de APIs.',
      },
    ],
    interview: [
      {
        q: 'Qual a diferença entre BOLA e BFLA? Dê um exemplo de cada.',
        a: 'BOLA (Broken Object Level Authorization, equivalente a IDOR) ocorre quando o usuário acessa um objeto que não é dele via endpoint legítimo — ex: GET /api/orders/9999 retornando pedido de outro usuário sem checar ownership. BFLA (Broken Function Level Authorization) ocorre quando o usuário acessa uma função/operação que não deveria — ex: DELETE /api/admin/users/42 acessível por usuário sem role de admin porque a verificação de role está ausente. BOLA é "objeto errado", BFLA é "operação errada". Ambas precisam de verificação server-side independente.',
        tip: 'Esse é o par de falhas mais cobrado em entrevistas de segurança de API. Saber a diferença com exemplos concretos diferencia sênior de pleno.',
        level: 'pleno',
      },
      {
        q: 'O que é Mass Assignment e como você previne?',
        a: 'Mass Assignment ocorre quando a API aceita campos no body do request que não deveria — o atacante envia campos extras (ex: role, isAdmin, creditBalance) e o ORM os persiste automaticamente. Ocorre tipicamente com update(req.body) sem filtrar. A prevenção é usar uma allowlist explícita dos campos aceitos (destructuring ou DTO de validação com Zod/class-validator). Frameworks como Rails e Laravel têm proteção nativa via attr_accessible/fillable — em Node.js é responsabilidade do dev.',
        tip: 'Mencionar Zod ou class-validator como forma de declarar o schema aceito demonstra que você resolve isso de forma sistemática, não artesanal.',
        level: 'pleno',
      },
      {
        q: 'Como você protege uma API GraphQL de ataques de resource exhaustion?',
        a: 'APIs GraphQL são particularmente vulneráveis porque o cliente controla a query — uma query profundamente recursiva (friends { friends { friends { ... } } }) pode explodir o servidor. Defesas: 1) query depth limiting (ex: graphql-depth-limit — rejeitar queries acima de N níveis); 2) query complexity scoring (cada campo tem custo, rejeitar queries acima de um budget); 3) persistência de queries (apenas queries pré-aprovadas/hashed são aceitas em produção); 4) rate limiting por IP + por usuário; 5) paginação obrigatória em campos de lista (limite máximo de items por página). Sem essas proteções, GraphQL expõe naturalmente a API1:2023 (Unrestricted Resource Consumption).',
        tip: 'GraphQL é um tópico quente — mostrar conhecimento de depth limiting e complexity scoring distingue quem já operoum GraphQL em produção.',
        level: 'senior',
      },
      {
        q: 'O que é Excessive Data Exposure e por que "filtrar no frontend" é uma solução errada?',
        a: 'Excessive Data Exposure é quando a API retorna mais dados do que o cliente precisa — ex: serializar o objeto User inteiro (com passwordHash, internal notes, dados de outros usuários) esperando que o frontend mostre apenas nome e avatar. A solução errada é "o frontend não exibe os campos extra" — qualquer usuário com DevTools ou curl vê todos os campos retornados. A solução correta é projetar DTOs explícitos no servidor: a API retorna apenas os campos que o cliente precisa para aquele endpoint específico. Nunca serializar o objeto do banco diretamente como resposta.',
        tip: 'Essa pergunta frequentemente leva a uma discussão sobre DTOs vs. entidades de banco — mostrar que você pensa na separação de camadas é o diferencial.',
        level: 'pleno',
      },
      {
        q: 'Como um webhook pode se tornar um vetor de SSRF? Como você mitiga isso?',
        a: 'Quando a API aceita uma URL de callback de webhook configurada pelo usuário e faz uma requisição server-side para essa URL (para testar ou notificar), um atacante pode configurar a URL como http://169.254.169.254/latest/meta-data/ — o endpoint de metadados de instância EC2 que retorna credenciais IAM temporárias da role da máquina. O servidor faz o fetch e pode retornar as credenciais ao atacante. A mitigação tem quatro camadas: (1) allowlist de domínios permitidos para webhooks; (2) resolver o hostname via DNS antes do fetch e rejeitar se o IP resultar em range privado (10.x, 172.16-31.x, 192.168.x, 169.254.x) — fazer isso após a resolução DNS previne DNS rebinding; (3) desabilitar redirects no fetch para evitar redirecionamento para IPs internos; (4) em AWS, habilitar IMDSv2 que exige token de sessão — mitiga SSRF simples via metadados.',
        tip: 'Citar DNS rebinding e IMDSv2 demonstra conhecimento além do básico — diferencial em entrevistas de backend com foco em segurança cloud.',
        level: 'senior',
      },
      {
        q: 'Como você preveniria Mass Assignment em uma API NestJS com TypeORM?',
        a: 'Em NestJS, a abordagem canônica é usar DTOs com class-validator e class-transformer: criar um UpdateUserDto com apenas os campos que o usuário pode alterar (name, bio, avatarUrl), decorar com @IsString(), @IsOptional() etc., e usar @Body() updateDto: UpdateUserDto no controller. O TypeORM recebe apenas o objeto tipado, não o req.body completo. Complementar com a opção excludeExtraneousValues: true no ClassSerializerInterceptor para garantir que campos não declarados no DTO sejam descartados mesmo se o cliente os enviar. Para a camada de banco, usar QueryBuilder ou save() com o objeto DTO diretamente — nunca update(id, req.body). Em Express puro sem framework, o equivalente é destruturação explícita: const { name, bio } = req.body e salvar só esses campos.',
        tip: 'Mostrar o padrão completo NestJS (DTO + class-validator + excludeExtraneousValues) diferencia quem conhece o ecossistema de quem apenas descreve o conceito.',
        level: 'pleno',
      },
      {
        q: 'O que são "shadow APIs" e "zombie APIs"? Como você gerencia o inventário de APIs em produção?',
        a: '<strong>Shadow APIs</strong> são endpoints não documentados criados por devs sem passar pelo processo formal — às vezes sem autenticação adequada porque foram criados "só para testar". <strong>Zombie APIs</strong> (ou API zumbis) são versões antigas que deveriam ter sido desativadas mas continuam acessíveis: /api/v1/users ainda respondendo sem auth após a v2 ter implementado JWT. O gerenciamento de inventário envolve: (1) usar um API gateway que registra todos os endpoints em produção e alerta sobre rotas não documentadas; (2) manter um catálogo (OpenAPI/Swagger) atualizado como fonte de verdade; (3) implementar <code>Sunset</code> header em versões depreciadas com data de remoção; (4) auditar regularmente com ferramentas como AWS API Gateway logs ou Kong analytics para detectar rotas com tráfego que não estão no catálogo.',
        tip: 'Mencionar o header HTTP <code>Sunset</code> (RFC 8594) e API gateways demonstra conhecimento operacional além do teórico.',
        level: 'senior',
      },
      {
        q: 'O que é Unsafe Consumption of APIs (API10) e como você se protege de APIs de terceiros comprometidas?',
        a: '<strong>API10 — Unsafe Consumption</strong> cobre o risco de confiar cegamente em respostas de APIs externas. Se um parceiro for comprometido e devolver um payload malicioso, seu sistema pode sofrer injection, crash ou corrupção de dados — dependendo de como você processa a resposta. Defesas: (1) <strong>validação de schema</strong> da resposta com Zod ou JSON Schema — rejeitar respostas que não batem com o contrato esperado; (2) nunca confiar no Content-Type retornado — fazer parse explícito e seguro; (3) <strong>limitar o tamanho</strong> da resposta (max bytes antes de iniciar o parse); (4) tratar a API externa como dado não confiável — sanitizar antes de persistir ou renderizar; (5) usar <strong>circuit breaker</strong> para isolar falhas do parceiro. O ataque real: parceiro retorna <code>{"name": "&lt;script&gt;...&lt;/script&gt;"}</code> e você renderiza sem escapar.',
        tip: 'Citar Zod para validação de resposta externa e circuit breaker demonstra pensamento sistêmico — não só o happy path.',
        level: 'pleno',
      },
      {
        q: 'Como você implementaria rate limiting por usuário autenticado em uma API Express com Redis?',
        a: '<strong>Rate limiting por usuário autenticado</strong> é mais robusto que por IP porque não é bypassável por rotação de IPs. A implementação com Express + Redis: usar a lib <code>express-rate-limit</code> com store Redis (<code>rate-limit-redis</code>). A key do limiter deve ser baseada no userId do JWT (não o IP), extraída após a verificação do token. Exemplo: key = <code>ratelimit:userId:${req.user.id}</code>. Para endpoints sensíveis (login, redefinir senha, enviar OTP), usar limites muito mais baixos (ex: 5 req/15min) que endpoints normais (ex: 100 req/min). Combinar dois limiters em série: um por IP (contra bots não autenticados) e um por userId (contra abuso autenticado). Retornar header <code>Retry-After</code> e <code>X-RateLimit-Remaining</code> para UX adequada.',
        tip: 'Dois limiters em série (IP + userId) é o padrão de produção — mostrar isso diferencia de quem só conhece rate limiting básico.',
        level: 'pleno',
      },
      {
        q: 'Como você desenharia a autenticação entre microserviços internos para evitar BFLA interna?',
        a: '<strong>Comunicação entre microserviços</strong> não deve ser implicitamente confiável só porque está "dentro da rede". BFLA interna ocorre quando um serviço A chama um endpoint de admin do serviço B sem que B verifique a identidade de A. Abordagens: (1) <strong>mTLS</strong> (mutual TLS): cada serviço tem certificado; ambos autenticam um ao outro na camada de transporte — eliminam spoofing entre serviços; (2) <strong>Service tokens</strong>: cada serviço tem um JWT de serviço assinado (não o JWT do usuário) com claims de identidade (<code>{"sub":"payments-service","roles":["internal"]}</code>); o serviço receptor verifica o token antes de executar; (3) <strong>Zero trust</strong>: nenhuma chamada interna é automaticamente autorizada — todas passam por policy engine (ex: OPA — Open Policy Agent). Redes internas são violadas regularmente (lateral movement); a defesa em profundidade exige autenticação mesmo internamente.',
        tip: 'Zero trust interno e OPA são tópicos avançados que surgem em entrevistas de arquitetura de microserviços — citar OPA como policy engine demonstra conhecimento do ecossistema CNCF.',
        level: 'senior',
      },
      {
        q: 'O que é Broken Object Property Level Authorization? Como ele difere do Excessive Data Exposure clássico?',
        a: 'Na versão 2023 do OWASP API Top 10, o <strong>API3</strong> combinou duas falhas anteriores: <strong>Excessive Data Exposure</strong> (retornar mais campos do que necessário) e <strong>Mass Assignment</strong> (aceitar mais campos do que deveria). A combinação faz sentido porque ambas são falhas de <em>controle de acesso no nível de propriedades do objeto</em>. A diferença conceitual: Excessive Data Exposure é um problema de <em>output</em> (resposta da API); Mass Assignment é um problema de <em>input</em> (corpo do request). A mitigação é simétrica: para output, use DTOs explícitos que projetam apenas os campos necessários; para input, use DTOs de validação (Zod/class-validator) que declaram exatamente o que é aceito. Nunca serializar a entidade do banco diretamente, nem aceitar <code>req.body</code> diretamente no ORM.',
        tip: 'Entender que API3:2023 unifica duas falhas de versões anteriores (e por quê faz sentido) demonstra que você acompanha a evolução do OWASP, não apenas decorou a lista.',
        level: 'senior',
      },
      {
        q: 'Como você testaria uma API em busca de vulnerabilidades BOLA de forma sistemática?',
        a: '<strong>Testar BOLA sistematicamente</strong> requer criar pelo menos dois usuários de teste (A e B) e verificar que os recursos de A não são acessíveis por B. Metodologia: (1) listar todos os endpoints que aceitam um ID de objeto (GET /orders/:id, PUT /addresses/:id, DELETE /cards/:id); (2) para cada endpoint, autenticar como usuário A, capturar o ID de um recurso pertencente a A; (3) autenticar como usuário B e tentar acessar o mesmo ID — o esperado é 403 ou 404; (4) testar também IDs sequenciais (+1, -1 do ID conhecido) se a API usar inteiros; (5) automatizar com scripts que trocam o Authorization header entre dois tokens e comparam respostas. Ferramentas: Burp Suite (Autorize plugin automatiza isso), OWASP ZAP com scripts personalizados. Em CI, bibliotecas como <code>jest-supertest</code> permitem testar isolamento de recursos por usuário de forma unitária.',
        tip: 'Mencionar o plugin Autorize do Burp Suite é um sinal concreto de experiência com pentest — isso diferencia em entrevistas de AppSec.',
        level: 'senior',
      },
      {
        q: 'O que é API6 — Unrestricted Access to Sensitive Business Flows e como você modelaria os casos de abuso?',
        a: '<strong>API6</strong> cobre fluxos de negócio que, sem controles adequados, permitem automação de abusos: bots comprando estoque antes de usuários legítimos (scalping), uso ilimitado de cupons de desconto, scraping de catálogo com preços competitivos, criação massiva de contas para referrals fraudulentos. Diferente de rate limiting genérico, o controle aqui é específico ao fluxo de negócio. Para modelar casos de abuso: (1) listar as <strong>ações de valor</strong> da aplicação (compra, cupom, criação de conta, votação); (2) para cada uma, perguntar "o que acontece se alguém fizer isso 1000x por minuto com 1000 contas diferentes?"; (3) modelar a motivação econômica do atacante; (4) implementar controles específicos: device fingerprinting, CAPTCHA em fluxos sensíveis, verificação de e-mail antes de benefícios, limites de uso por CPF/cartão além do user_id. A diferença de API4 (resource consumption): API4 é sobre infraestrutura (DoS); API6 é sobre lógica de negócio (fraude).',
        tip: 'Distinguir API4 (infraestrutura) de API6 (negócio) demonstra entendimento preciso das categorias — erro comum em entrevistas é confundir os dois.',
        level: 'senior',
      },
      {
        q: 'Como você implementa rotação de refresh tokens em uma API REST para prevenir session fixation?',
        a: '<strong>Rotação de refresh tokens</strong> (refresh token rotation) é um padrão de segurança em que cada uso do refresh token gera um novo par (access + refresh), e o token anterior é imediatamente invalidado. Isso previne que um token roubado seja usado indefinidamente: se o atacante usar o token roubado, o token legítimo do usuário é invalidado na próxima tentativa (detecta uso duplo). Implementação: (1) armazenar os refresh tokens no banco com status (ativo/revogado) e <code>userId</code>; (2) ao receber o refresh token, verificar se está ativo — se revogado, <strong>revogar toda a família de tokens do usuário</strong> (sinal de compromisso); (3) gerar novo par, marcar o token anterior como revogado, retornar o novo par; (4) refresh token com expiração longa (7-30d) mas com rotação; access token com expiração curta (15min). Rejeitar o token como usado não invalida a sessão do legítimo — apenas gera novo par.',
        tip: 'Revogar a família inteira de tokens ao detectar uso de token revogado é a defesa avançada — demonstra que você conhece o RFC 6819 (OAuth 2.0 Threat Model).',
        level: 'senior',
      },
      {
        q: 'Qual a diferença entre autenticação de API com API Keys versus JWT? Quando usar cada uma?',
        a: '<strong>API Keys</strong> são tokens opacos (strings aleatórias) emitidos para identificar um client/aplicação — não carregam claims, exigem lookup no banco a cada request. Vantagens: simples de implementar, fáceis de revogar (deletar do banco), adequadas para comunicação machine-to-machine. Desvantagens: sem expiração automática, sem claims embutidos, lookup de banco em todo request (mitigado com cache). <strong>JWTs</strong> são tokens auto-contidos com claims verificáveis criptograficamente — não exigem lookup no banco para verificar autenticidade (apenas a chave pública/secreta). Vantagens: stateless, escala horizontalmente, carregam userId/roles sem consulta adicional. Desvantagens: mais complexos de revogar (exigem blocklist ou expiração curta), claims podem ficar obsoletos se o usuário mudar de role. <strong>Quando usar</strong>: API Keys para integrações B2B de longa duração (parceiros, SDKs); JWT para autenticação de usuários em SPAs e apps mobile com sessões de curta duração e rotação.',
        tip: 'A decisão entre API Key e JWT não é técnica — é operacional: quem é o caller? Com que frequência as permissões mudam? Qual o custo de revogação?',
        level: 'pleno',
      },
      {
        q: 'Como você protege uma API pública contra enumeração de objetos (ID guessing)?',
        a: '<strong>Enumeração de objetos</strong> é o ataque onde o atacante itera IDs sequenciais para descobrir recursos existentes: GET /users/1, /users/2, /users/3... Defesas em camadas: (1) <strong>UUIDs v4</strong> no lugar de IDs inteiros — dificulta adivinhação (mas não substitui verificação de autorização); (2) verificação de autorização em cada acesso (mesmo com UUID, validar que pertence ao usuário autenticado); (3) <strong>rate limiting</strong> por IP e por usuário autenticado em endpoints de busca; (4) respostas consistentes: retornar 404 para recursos não autorizados em vez de 403 é uma escolha de obscuridade — previne confirmar a existência; (5) logs de segurança com alertas para padrões de acesso sequencial (muitos 404s em sequência de um IP); (6) para recursos muito sensíveis, considerar <strong>tokens de acesso temporários</strong> (signed URLs) em vez de IDs permanentes. UUID não é segurança — é só uma camada de obscuridade. A verificação de autorização é obrigatória independentemente do formato do ID.',
        tip: 'Dizer "UUID não é segurança" e seguir com a verificação de autorização como controle real demonstra maturidade para não confundir obscuridade com segurança.',
        level: 'pleno',
      },
      {
        q: 'O que é DNS rebinding e como ele burla a proteção de SSRF baseada em allowlist de domínios?',
        a: '<strong>DNS rebinding</strong> é uma técnica de ataque que explora a janela entre a resolução DNS e a conexão TCP. O atacante registra um domínio malicioso (evil.com) com TTL muito baixo (0-1s). Na primeira resolução, evil.com retorna um IP legítimo que passa pela allowlist. Após o TTL expirar, o DNS é atualizado para retornar <code>169.254.169.254</code> (metadados AWS). Se a sua proteção SSRF valida o hostname mas não re-valida o IP resolvido imediatamente antes da conexão, o attack funciona: o servidor acha que está conectando ao IP legítimo mas na prática está conectando ao IP interno. <strong>Mitigação</strong>: (1) resolver o hostname via DNS <em>e imediatamente</em> verificar o IP resultante antes de fazer a conexão; (2) usar a mesma resolução para a conexão (não resolver novamente); (3) desabilitar redirects HTTP para evitar que um redirect leve a um IP diferente; (4) em ambientes AWS, habilitar IMDSv2 como defesa em profundidade.',
        tip: 'DNS rebinding é um ataque sutil e avançado — citar TTL e a janela de tempo entre resolução e conexão demonstra compreensão real do vetor, não só memorização.',
        level: 'senior',
      },
      {
        q: 'Como você lidaria com um endpoint GraphQL que está exposto publicamente sem autenticação por engano (API9 — Improper Inventory)?',
        a: '<strong>Resposta de incidente</strong> para API zumbi exposta: (1) <strong>imediatamente</strong>: adicionar autenticação ou bloquear o endpoint no gateway/nginx (retornar 401/403); (2) verificar os logs de acesso do endpoint desde quando ele foi exposto — quantos requests? Quais dados foram expostos? Há padrões de exploração (queries de enumeração, mutations anômalas)? (3) se dados sensíveis foram acessados, avaliar necessidade de notificação regulatória (LGPD/GDPR); (4) identificar como o endpoint ficou exposto: deployment sem revisão? CI/CD sem verificação de inventário de endpoints? Configuração de gateway faltando? (5) implementar preventivamente: auditoria regular de endpoints expostos, automação em CI para comparar endpoints contra catálogo aprovado, alertas de monitoramento para rotas novas sem documentação. A lição do API9 é que o problema não é técnico — é de processo: inventário e governança de APIs.',
        tip: 'Incluir LGPD/notificação regulatória na resposta demonstra que você pensa além do técnico — diferencial em posições sênior em empresas brasileiras.',
        level: 'senior',
      },
      {
        q: 'O que é query depth limiting em GraphQL e como você implementa em produção?',
        a: '<strong>Query depth limiting</strong> rejeita queries GraphQL que ultrapassam um nível máximo de aninhamento, prevenindo resource exhaustion. Exemplo de query maliciosa: <code>{ user { friends { friends { friends { posts { comments { author { friends { ... } } } } } } } } }</code> — pode gerar milhares de queries no banco. Implementação com <code>graphql-depth-limit</code> no Apollo Server: <br><code>import depthLimit from "graphql-depth-limit";</code><br><code>const server = new ApolloServer({ validationRules: [depthLimit(5)] });</code><br> Complementar com <strong>complexity scoring</strong> (cada field tem custo; reject se budget excedido), usando <code>graphql-query-complexity</code>. Em produção: depth limit de 5-7 é razoável para a maioria dos schemas; customizar limites por tipo de query se necessário. Para operações de alta confiança (queries internas/dashboards), usar <strong>persisted queries</strong> — apenas hashes de queries pré-aprovadas são aceitos.',
        tip: 'Mencionar persisted queries como solução para queries internas de alta confiança demonstra pensamento pragmático de produção.',
        level: 'senior',
      },
      {
        q: 'Como você usaria Zod para validar respostas de APIs externas e evitar API10 — Unsafe Consumption?',
        a: '<strong>Validar respostas de APIs externas com Zod</strong> cria um contrato explícito que protege contra payloads inesperados de parceiros comprometidos ou com schema quebrado. Padrão: (1) definir o schema esperado da resposta com Zod; (2) fazer o parse antes de usar os dados; (3) nunca confiar no tipo TypeScript inferido da resposta do fetch. <br><br>Exemplo:<br><code>const ExternalUserSchema = z.object({ id: z.string().uuid(), name: z.string().max(100), email: z.string().email() });</code><br><code>const raw = await fetch(url).then(r => r.json());</code><br><code>const user = ExternalUserSchema.parse(raw); // lança se inválido</code><br><br>Para respostas grandes ou arrays, usar <code>z.array(...).max(1000)</code> para limitar tamanho. Preferir <code>safeParse</code> em vez de <code>parse</code> para tratar erros sem throw. Combinar com limite de tamanho de resposta antes do parse (verificar <code>Content-Length</code> ou limitar via <code>response.slice</code>).',
        tip: 'Usar <code>safeParse</code> em vez de <code>parse</code> para evitar throw não tratado é um detalhe de produção que demonstra cuidado com error handling.',
        level: 'pleno',
      },
    ],
    gotchas: [
      'BOLA e Broken Access Control (A01 do Top 10 web) são a mesma classe de falha — BOLA é o nome específico para APIs.',
      'Mass Assignment não é só para PUT/PATCH — POST de criação também pode ter campos extras indesejados (ex: role).',
      'Rate limiting só por IP é bypassável com rotação de IPs — combinar com rate limit por usuário autenticado.',
      'GraphQL sem query depth limit é um DoS esperando acontecer — fieldCount e complexidade também precisam de teto.',
      'Retornar 404 vs 403 para objetos não autorizados é uma escolha de tradeoff: 403 confirma que o objeto existe; 404 adiciona obscuridade (prefira 403 por clareza, mas entenda o tradeoff).',
    ],
    mnemonics: [
      {
        label: 'BOLA vs BFLA — como não confundir',
        trick: '"BOLA é o Objeto, BFLA é a Função"',
        explanation: 'BOLA (API1) = você acessa o objeto errado via endpoint certo. Ex: GET /orders/9999 retorna pedido de outro usuário. BFLA (API5) = você acessa a função errada, independente do objeto. Ex: DELETE /admin/users/42 por usuário sem role de admin. Objeto = dado; Função = ação/endpoint.',
      },
      {
        label: 'Os 10 riscos de API — mnemônico BBUUBSSSIA',
        trick: '"Bola Boa Usa Uns Bois, Seis Sete Saltam Incrivelmente Alto"',
        explanation: 'B=BOLA (API1), B=Broken Auth (API2), U=Unsafe Property (API3), U=Unrestricted Consumption (API4), B=BFLA (API5), S=Sensitive Business Flows (API6), S=SSRF (API7), S=Security Misconfiguration (API8), I=Improper Inventory (API9), A=Unsafe Consumption of APIs (API10). Gravar a ordem e categoria simultâneas.',
      },
      {
        label: 'Input vs Output — Mass Assignment vs Excessive Data Exposure',
        trick: '"Input demais = Mass Assignment; Output demais = Excessive Data"',
        explanation: 'Mass Assignment: você aceita campos a mais no request (input). Excessive Data Exposure: você retorna campos a mais na resposta (output). A mitigação é simétrica: DTOs para controlar o que entra e o que sai. Se lembrar input/output, você lembra a distinção e a solução ao mesmo tempo.',
      },
      {
        label: 'SSRF em APIs — o alvo mais perigoso',
        trick: '"169 = a morte na cloud"',
        explanation: '169.254.169.254 é o IP do endpoint de metadados de instância na AWS (e equivalente em GCP/Azure). Se sua API faz fetch de URLs fornecidas pelo usuário e não bloqueia esse IP, um atacante obtém as credenciais IAM temporárias da instância — acesso total à conta AWS. Gravar o IP 169.254.169.254 como sinal de alerta imediato em qualquer revisão de código.',
      },
    ],
    cheatsheet: {
      title: 'OWASP API Top 10 — Cheatsheet de Referência Rápida',
      html: `<style>
.owasp1-wrap{font-family:'Space Grotesk',sans-serif;background:#0a0a0a;border-radius:14px;padding:22px;max-width:720px;color:#e2e8f0}
.owasp1-title{color:#ef4444;font-size:15px;font-weight:800;margin:0 0 4px}
.owasp1-sub{color:#475569;font-size:10px;margin:0 0 18px}
.owasp1-table{width:100%;border-collapse:collapse;font-size:10.5px}
.owasp1-table th{background:#1a1a1a;color:#94a3b8;font-size:9px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:7px 10px;text-align:left;border-bottom:1px solid #222}
.owasp1-table td{padding:8px 10px;border-bottom:1px solid #181818;vertical-align:top;line-height:1.5}
.owasp1-table tr:hover td{background:#111}
.owasp1-cat{display:flex;align-items:center;gap:6px}
.owasp1-badge{min-width:38px;height:20px;border-radius:3px;display:flex;align-items:center;justify-content:center;font-size:8.5px;font-weight:700;flex-shrink:0}
.owasp1-crit{color:#ef4444}.owasp1-high{color:#f97316}.owasp1-med{color:#eab308}
.owasp1-name{font-weight:600;color:#e2e8f0;font-size:10.5px}
.owasp1-aka{font-size:8.5px;color:#475569;margin-top:1px}
.owasp1-attack{color:#fca5a5;font-size:10px}
.owasp1-fix{color:#86efac;font-size:10px}
.owasp1-pill{display:inline-block;font-size:8px;padding:1px 6px;border-radius:3px;font-weight:700;margin-left:4px}
.owasp1-crit-pill{background:rgba(239,68,68,.15);color:#ef4444;border:1px solid rgba(239,68,68,.3)}
.owasp1-high-pill{background:rgba(249,115,22,.15);color:#f97316;border:1px solid rgba(249,115,22,.3)}
.owasp1-med-pill{background:rgba(234,179,8,.12);color:#eab308;border:1px solid rgba(234,179,8,.25)}
.owasp1-legend{display:flex;gap:16px;margin-top:14px;flex-wrap:wrap}
.owasp1-leg{display:flex;align-items:center;gap:5px;font-size:9px;color:#64748b}
.owasp1-dot{width:8px;height:8px;border-radius:2px}
</style>
<div class="owasp1-wrap">
  <p class="owasp1-title">OWASP API Security Top 10 — 2023</p>
  <p class="owasp1-sub">Referência rápida: categorias, vetores de ataque e mitigações essenciais</p>
  <table class="owasp1-table">
    <thead>
      <tr>
        <th>Categoria</th>
        <th>Vetor de Ataque</th>
        <th>Mitigação Principal</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><div class="owasp1-cat"><div class="owasp1-badge" style="background:rgba(239,68,68,.15)"><span class="owasp1-crit">API1</span></div><div><div class="owasp1-name">BOLA<span class="owasp1-pill owasp1-crit-pill">CRÍTICO</span></div><div class="owasp1-aka">Broken Object Level Auth</div></div></div></td>
        <td><span class="owasp1-attack">GET /orders/9999 retorna pedido de outro usuário</span></td>
        <td><span class="owasp1-fix">Verificar ownership no service layer: order.userId === req.user.id</span></td>
      </tr>
      <tr>
        <td><div class="owasp1-cat"><div class="owasp1-badge" style="background:rgba(239,68,68,.15)"><span class="owasp1-crit">API2</span></div><div><div class="owasp1-name">Broken Auth<span class="owasp1-pill owasp1-crit-pill">CRÍTICO</span></div><div class="owasp1-aka">Tokens fracos ou inválidos</div></div></div></td>
        <td><span class="owasp1-attack">JWT sem verificação de assinatura (jwt.decode vs jwt.verify); tokens sem expiração</span></td>
        <td><span class="owasp1-fix">jwt.verify() com algoritmo explícito; rotação de refresh tokens; expiração curta</span></td>
      </tr>
      <tr>
        <td><div class="owasp1-cat"><div class="owasp1-badge" style="background:rgba(249,115,22,.15)"><span class="owasp1-high">API3</span></div><div><div class="owasp1-name">Mass Assignment<span class="owasp1-pill owasp1-high-pill">ALTO</span></div><div class="owasp1-aka">Broken Object Property Level</div></div></div></td>
        <td><span class="owasp1-attack">POST /users com {"role":"admin"} → ORM persiste sem filtrar</span></td>
        <td><span class="owasp1-fix">DTOs com allowlist explícita (Zod/class-validator); nunca update(req.body)</span></td>
      </tr>
      <tr>
        <td><div class="owasp1-cat"><div class="owasp1-badge" style="background:rgba(249,115,22,.15)"><span class="owasp1-high">API4</span></div><div><div class="owasp1-name">Resource Exhaustion<span class="owasp1-pill owasp1-high-pill">ALTO</span></div><div class="owasp1-aka">Unrestricted Consumption</div></div></div></td>
        <td><span class="owasp1-attack">Flood de requests; GraphQL query recursiva; upload sem limite</span></td>
        <td><span class="owasp1-fix">Rate limit por IP + userId; depth limit GraphQL; payload size limit</span></td>
      </tr>
      <tr>
        <td><div class="owasp1-cat"><div class="owasp1-badge" style="background:rgba(239,68,68,.15)"><span class="owasp1-crit">API5</span></div><div><div class="owasp1-name">BFLA<span class="owasp1-pill owasp1-crit-pill">CRÍTICO</span></div><div class="owasp1-aka">Broken Function Level Auth</div></div></div></td>
        <td><span class="owasp1-attack">DELETE /admin/users/42 acessível por usuário sem role admin</span></td>
        <td><span class="owasp1-fix">Verificar role server-side em cada endpoint; nunca só no frontend</span></td>
      </tr>
      <tr>
        <td><div class="owasp1-cat"><div class="owasp1-badge" style="background:rgba(234,179,8,.12)"><span class="owasp1-med">API6</span></div><div><div class="owasp1-name">Business Flow Abuse<span class="owasp1-pill owasp1-med-pill">MÉDIO</span></div><div class="owasp1-aka">Sensitive Business Flows</div></div></div></td>
        <td><span class="owasp1-attack">Bot esgota estoque; abuso ilimitado de cupons; scraping automatizado</span></td>
        <td><span class="owasp1-fix">CAPTCHA em fluxos sensíveis; rate limit por fluxo; device fingerprinting</span></td>
      </tr>
      <tr>
        <td><div class="owasp1-cat"><div class="owasp1-badge" style="background:rgba(239,68,68,.15)"><span class="owasp1-crit">API7</span></div><div><div class="owasp1-name">SSRF<span class="owasp1-pill owasp1-crit-pill">CRÍTICO</span></div><div class="owasp1-aka">Server-Side Request Forgery</div></div></div></td>
        <td><span class="owasp1-attack">webhook URL aponta para 169.254.169.254 → credenciais IAM expostas</span></td>
        <td><span class="owasp1-fix">Allowlist de domínios; bloquear IPs privados pós-resolução DNS; sem redirects</span></td>
      </tr>
      <tr>
        <td><div class="owasp1-cat"><div class="owasp1-badge" style="background:rgba(234,179,8,.12)"><span class="owasp1-med">API8</span></div><div><div class="owasp1-name">Misconfiguration<span class="owasp1-pill owasp1-med-pill">MÉDIO</span></div><div class="owasp1-aka">Security Misconfiguration</div></div></div></td>
        <td><span class="owasp1-attack">CORS Allow-Origin:*; stack traces em produção; headers de segurança ausentes</span></td>
        <td><span class="owasp1-fix">helmet.js; CORS restrito; erros genéricos; auditoria de headers</span></td>
      </tr>
      <tr>
        <td><div class="owasp1-cat"><div class="owasp1-badge" style="background:rgba(234,179,8,.12)"><span class="owasp1-med">API9</span></div><div><div class="owasp1-name">Zombie APIs<span class="owasp1-pill owasp1-med-pill">MÉDIO</span></div><div class="owasp1-aka">Improper Inventory</div></div></div></td>
        <td><span class="owasp1-attack">/api/v1/ sem auth ainda ativo após lançar v2; shadow APIs não documentadas</span></td>
        <td><span class="owasp1-fix">Inventário de endpoints; Sunset header; remoção ativa de versões antigas</span></td>
      </tr>
      <tr>
        <td><div class="owasp1-cat"><div class="owasp1-badge" style="background:rgba(234,179,8,.12)"><span class="owasp1-med">API10</span></div><div><div class="owasp1-name">Unsafe Consumption<span class="owasp1-pill owasp1-med-pill">MÉDIO</span></div><div class="owasp1-aka">APIs de terceiros não validadas</div></div></div></td>
        <td><span class="owasp1-attack">Parceiro comprometido retorna payload malicioso; sem validação de schema externo</span></td>
        <td><span class="owasp1-fix">Zod/JSON Schema na resposta externa; limite de tamanho; nunca confiar no Content-Type</span></td>
      </tr>
    </tbody>
  </table>
  <div class="owasp1-legend">
    <div class="owasp1-leg"><div class="owasp1-dot" style="background:#ef4444"></div>Crítico — controle de acesso e autenticação</div>
    <div class="owasp1-leg"><div class="owasp1-dot" style="background:#f97316"></div>Alto — recursos e dados</div>
    <div class="owasp1-leg"><div class="owasp1-dot" style="background:#eab308"></div>Médio — configuração e inventário</div>
  </div>
</div>`,
      caption: 'Cheatsheet de referência rápida para revisão antes de entrevistas. OWASP API Top 10 versão 2023. API1, API5 e API7 são as categorias de maior impacto e mais cobradas em entrevistas.',
    },
    mindmap: {
      title: 'OWASP API Top 10 — Mindmap por domínio de risco',
      html: `<style>
.owasp2-wrap{font-family:'Space Grotesk',sans-serif;background:#0a0a0a;border-radius:14px;padding:24px;max-width:700px;min-height:460px;position:relative;color:#e2e8f0}
.owasp2-center{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:#ef4444;border-radius:12px;padding:10px 18px;font-size:12px;font-weight:800;color:#fff;text-align:center;z-index:10;line-height:1.4;min-width:120px;box-shadow:0 0 32px rgba(239,68,68,.4)}
.owasp2-branch{position:absolute;display:flex;flex-direction:column;gap:5px;z-index:5}
.owasp2-branch-title{font-size:9.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;margin-bottom:3px}
.owasp2-item{font-size:9px;color:#94a3b8;padding:4px 8px;border-radius:4px;border:1px solid #222;background:#111;line-height:1.4;cursor:default;transition:background .15s}
.owasp2-item:hover{background:#1a1a1a;color:#e2e8f0}
.owasp2-item strong{font-weight:700}
.owasp2-line{position:absolute;background:#1e293b;z-index:1}
</style>
<div class="owasp2-wrap" style="min-height:520px">
  <div class="owasp2-center">OWASP<br>API Top 10<br><span style="font-size:9px;opacity:.7">2023</span></div>

  <!-- Autenticação & Autorização — topo esquerdo -->
  <div class="owasp2-branch" style="top:18px;left:16px;max-width:180px">
    <div class="owasp2-branch-title" style="color:#ef4444">Autenticação &amp; Autorização</div>
    <div class="owasp2-item"><strong style="color:#ef4444">API1 — BOLA</strong><br>Acesso a objeto de outro usuário</div>
    <div class="owasp2-item"><strong style="color:#ef4444">API2 — Broken Auth</strong><br>Tokens fracos, sem expiração</div>
    <div class="owasp2-item"><strong style="color:#ef4444">API5 — BFLA</strong><br>Acesso a função sem role adequada</div>
  </div>

  <!-- Dados — topo direito -->
  <div class="owasp2-branch" style="top:18px;right:16px;max-width:180px;align-items:flex-end">
    <div class="owasp2-branch-title" style="color:#f97316;text-align:right">Exposição de Dados</div>
    <div class="owasp2-item" style="text-align:right"><strong style="color:#f97316">API3 — Mass Assignment</strong><br>Input: campos não autorizados aceitos</div>
    <div class="owasp2-item" style="text-align:right"><strong style="color:#f97316">API3 — Excessive Data</strong><br>Output: campos sensíveis retornados</div>
    <div class="owasp2-item" style="text-align:right"><strong style="color:#f97316">API10 — Unsafe Consumption</strong><br>APIs externas sem validação de schema</div>
  </div>

  <!-- Infraestrutura — baixo esquerdo -->
  <div class="owasp2-branch" style="bottom:18px;left:16px;max-width:180px">
    <div class="owasp2-item"><strong style="color:#eab308">API8 — Misconfiguration</strong><br>CORS aberto, stack traces, sem helmet</div>
    <div class="owasp2-item"><strong style="color:#eab308">API9 — Zombie APIs</strong><br>Versões antigas sem auth ativas</div>
    <div class="owasp2-branch-title" style="color:#eab308;margin-top:2px">Infraestrutura &amp; Configuração</div>
  </div>

  <!-- Input/Logic — baixo direito -->
  <div class="owasp2-branch" style="bottom:18px;right:16px;max-width:180px;align-items:flex-end">
    <div class="owasp2-item" style="text-align:right"><strong style="color:#a855f7">API4 — Resource Exhaustion</strong><br>Sem rate limit, sem depth limit</div>
    <div class="owasp2-item" style="text-align:right"><strong style="color:#a855f7">API6 — Business Flow Abuse</strong><br>Bots abusando fluxos de negócio</div>
    <div class="owasp2-item" style="text-align:right"><strong style="color:#a855f7">API7 — SSRF</strong><br>Fetch de URL do atacante no servidor</div>
    <div class="owasp2-branch-title" style="color:#a855f7;text-align:right;margin-top:2px">Input, Lógica &amp; Infraestrutura</div>
  </div>

  <!-- Legenda central inferior -->
  <div style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);display:flex;gap:14px;padding-bottom:6px;white-space:nowrap">
    <span style="font-size:8px;color:#ef4444">&#9632; Controle de Acesso</span>
    <span style="font-size:8px;color:#f97316">&#9632; Dados</span>
    <span style="font-size:8px;color:#eab308">&#9632; Infraestrutura</span>
    <span style="font-size:8px;color:#a855f7">&#9632; Lógica/Input</span>
  </div>
</div>`,
      caption: 'Mindmap organizado por domínio de risco. As categorias de controle de acesso (BOLA, Broken Auth, BFLA) têm o maior impacto real e são as mais cobradas em entrevistas de segurança de API.',
    },
    videos: [
      {
        title: 'OWASP API Security Top 10 — Explicação completa com demos',
        channel: 'PwnFunction',
        url: 'https://www.youtube.com/watch?v=TkHvF5sT8_A',
        topic: 'OWASP API Top 10 overview',
        note: 'Visão geral animada das 10 categorias com exemplos de ataque — ótimo para revisão rápida antes de entrevistas.',
      },
      {
        title: 'API Security — BOLA, BFLA e Mass Assignment na prática',
        channel: 'NetworkChuck',
        url: 'https://www.youtube.com/watch?v=7tmNDmKq6Xw',
        topic: 'BOLA, BFLA, Mass Assignment',
        note: 'Demo prático das três falhas de controle de acesso mais comuns em APIs REST com código real.',
      },
      {
        title: 'SSRF Explained — Server-Side Request Forgery em APIs cloud',
        channel: 'LiveOverflow',
        url: 'https://www.youtube.com/watch?v=aB4LZQfvGDo',
        topic: 'SSRF, cloud metadata, AWS IMDSv2',
        note: 'Demonstração de SSRF explorando metadados AWS (169.254.169.254) e como IMDSv2 mitiga o ataque.',
      },
      {
        title: 'Hacking APIs — Broken Authentication e JWT attacks',
        channel: 'John Hammond',
        url: 'https://www.youtube.com/watch?v=ocpFiV_jBgY',
        topic: 'Broken Auth, JWT, algorithm confusion',
        note: 'Ataque ao algoritmo "none" em JWTs e outros vetores de Broken Authentication em APIs — muito cobrado em CTFs e entrevistas.',
      },
      {
        title: 'GraphQL Security — Rate Limiting, Depth Limiting e Introspection',
        channel: 'Fireship',
        url: 'https://www.youtube.com/watch?v=viRl0fKB0q4',
        topic: 'GraphQL security, resource exhaustion',
        note: 'Como APIs GraphQL são vulneráveis a resource exhaustion e como implementar depth limiting e desabilitar introspection em produção.',
      },
    ],
    codeExamples: [
      {
        title: 'BOLA — Vulnerabilidade e correção em Express',
        description: 'Demonstra o padrão inseguro (sem verificação de ownership) e a correção correta com verificação server-side no service layer.',
        language: 'typescript',
        code: `// ❌ VULNERÁVEL: qualquer usuário autenticado acessa qualquer pedido
app.get('/api/orders/:id', authMiddleware, async (req, res) => {
  const order = await db.orders.findById(req.params.id)
  // BUG: não verifica se order pertence ao usuário logado!
  if (!order) return res.status(404).json({ error: 'Não encontrado' })
  return res.json(order)
})

// ✅ SEGURO: verifica ownership antes de retornar o recurso
app.get('/api/orders/:id', authMiddleware, async (req, res) => {
  const order = await db.orders.findById(req.params.id)
  if (!order) return res.status(404).json({ error: 'Não encontrado' })

  // Verificação de autorização no nível do objeto
  if (order.userId !== req.user.id && !req.user.roles.includes('admin')) {
    // Retorna 403 (não 404) para clareza — 404 esconde o problema
    return res.status(403).json({ error: 'Acesso negado' })
  }

  return res.json(order)
})

// ✅ Padrão recomendado: encapsular no service layer
async function getOrderForUser(orderId: string, userId: string) {
  const order = await db.orders.findById(orderId)
  if (!order) throw new NotFoundError('Pedido não encontrado')
  if (order.userId !== userId) throw new ForbiddenError('Acesso negado')
  return order
}`,
      },
      {
        title: 'Mass Assignment — Vulnerabilidade e correção com Zod',
        description: 'Mostra como req.body direto no ORM permite que o cliente escreva campos como "role" ou "isAdmin", e como DTOs com Zod previnem o ataque.',
        language: 'typescript',
        code: `import { z } from 'zod'

// ❌ VULNERÁVEL: aceita qualquer campo do body — incluindo role, isAdmin, creditBalance
app.patch('/api/users/:id', authMiddleware, async (req, res) => {
  // BUG: req.body pode conter { "role": "admin", "isAdmin": true }
  await User.update(req.params.id, req.body)
  return res.json({ success: true })
})

// ✅ SEGURO: allowlist explícita dos campos aceitos pelo usuário
const UpdateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
  // NÃO incluir: role, isAdmin, creditBalance, planId — campos privilegiados
})

app.patch('/api/users/:id', authMiddleware, async (req, res) => {
  // Valida e extrai apenas os campos permitidos
  const result = UpdateUserSchema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({ error: 'Dados inválidos', details: result.error.format() })
  }

  // Verificar também que o usuário só edita o próprio perfil
  if (req.params.id !== req.user.id && !req.user.roles.includes('admin')) {
    return res.status(403).json({ error: 'Acesso negado' })
  }

  // result.data contém APENAS name, bio, avatarUrl — nunca role ou isAdmin
  await User.update(req.params.id, result.data)
  return res.json({ success: true })
})`,
      },
      {
        title: 'SQL Injection em APIs — prepared statements e Prisma',
        description: 'Demonstra SQL Injection via concatenação em endpoint de busca de API e as três camadas de prevenção: prepared statement, ORM parametrizado e validação de input.',
        language: 'typescript',
        code: `// ❌ VULNERÁVEL: SQL Injection por concatenação em endpoint de busca
app.get('/api/products/search', async (req, res) => {
  const { q } = req.query
  // BUG: input do usuário concatenado diretamente na query
  // Payload: ?q='; DROP TABLE products; --
  const sql = \`SELECT * FROM products WHERE name ILIKE '%\${q}%'\`
  const result = await pool.query(sql)
  return res.json(result.rows)
})

// ✅ SEGURO opção 1: prepared statement com pg
app.get('/api/products/search', async (req, res) => {
  const { q } = req.query
  if (typeof q !== 'string' || q.length > 200) {
    return res.status(400).json({ error: 'Parâmetro de busca inválido' })
  }
  // Parâmetro $1 é tratado como dado, nunca como código SQL
  const sql = 'SELECT id, name, price FROM products WHERE name ILIKE $1 LIMIT 50'
  const result = await pool.query(sql, [\`%\${q}%\`])
  return res.json(result.rows)
})

// ✅ SEGURO opção 2: Prisma (parametrização automática)
app.get('/api/products/search', async (req, res) => {
  const { q } = req.query
  if (typeof q !== 'string' || q.length > 200) {
    return res.status(400).json({ error: 'Parâmetro de busca inválido' })
  }
  const products = await prisma.product.findMany({
    where: { name: { contains: q, mode: 'insensitive' } },
    select: { id: true, name: true, price: true }, // DTO explícito
    take: 50,
  })
  return res.json(products)
})

// ✅ SEGURO opção 3: raw query Prisma com parâmetros seguros (quando necessário)
// prisma.$queryRaw usa tagged template que parametriza automaticamente
// Equivalente a: SELECT ... WHERE name ILIKE $1 com ['%valor%'] como parâmetro
// NUNCA use prisma.$queryRawUnsafe() com interpolação de variáveis
const searchTerm = '%' + q + '%'
const results = await prisma.$queryRaw\`SELECT id, name FROM products WHERE name ILIKE \${searchTerm} LIMIT 50\``,
      },
    ],
    resources: [
      { title: 'OWASP API Security Top 10 — 2023', url: 'https://owasp.org/API-Security/editions/2023/en/0x00-header/', kind: 'docs' },
      { title: 'OWASP API Security Project — GitHub', url: 'https://github.com/OWASP/API-Security', kind: 'docs' },
      { title: 'OWASP API Security Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html', kind: 'docs' },
      { title: 'OWASP Mass Assignment Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html', kind: 'docs' },
      { title: 'PortSwigger Web Security Academy — API Testing', url: 'https://portswigger.net/web-security/api-testing', kind: 'pratica' },
      { title: 'OWASP crAPI — Completely Ridiculous API (lab prático)', url: 'https://github.com/OWASP/crAPI', kind: 'pratica' },
      { title: 'DVSA — Damn Vulnerable Serverless Application', url: 'https://github.com/OWASP/DVSA', kind: 'pratica' },
      { title: 'HackTricks — API Pentesting', url: 'https://book.hacktricks.xyz/network-services-pentesting/pentesting-web/api', kind: 'docs' },
      { title: 'RFC 6819 — OAuth 2.0 Threat Model (refresh token rotation)', url: 'https://datatracker.ietf.org/doc/html/rfc6819', kind: 'docs' },
    ],
  }

export default owaspApiTop10
