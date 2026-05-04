import type { SkillContentMap } from '@/types'

const sec: SkillContentMap = {

  'owasp-top-10': {
    tagline: 'As 10 vulnerabilidades mais críticas de aplicações web — guia de referência para defesa e code review.',
    why: 'O OWASP Top 10 é a linguagem comum de segurança de aplicações. Entrevistas de backend e fullstack sênior cobram isso diretamente — e mais importante: as falhas listadas aparecem em produção toda semana. Saber nomear, reconhecer e mitigar cada categoria é pré-requisito para qualquer dev que cuida de dados de usuários.',
    summary: 'O OWASP (Open Worldwide Application Security Project) publica desde 2003 uma lista das 10 categorias de risco mais críticas em aplicações web, baseada em dados reais de vulnerabilidades reportadas. A versão mais recente (2021) reorganizou categorias históricas e adicionou três novas: Insecure Design (A04), Software and Data Integrity Failures (A08) e Server-Side Request Forgery (A10). O Top 10 não é uma lista de bugs individuais — é um mapa de classes de risco. Cada categoria tem um vetor de ataque típico, fraquezas que o habilitam e impacto potencial. A ideia é usar a lista como guia de revisão de design, code review e testes de segurança. Conhecer o Top 10 não significa saber explorar cada falha — significa saber onde o código está exposto e como fechar os vetores antes de ir para produção.',
    howToStudy: '<strong>Tem 30 minutos antes de uma entrevista?</strong> Vá direto ao Diagrama 1 — percorra os 10 cards e releia a mitigação de cada um. Depois treine as Q&As de <strong>nível pleno</strong> em voz alta. <br><br><strong>Tem um fim de semana?</strong> Leia o mapa interativo das 10 categorias, depois vá para o Diagrama 2 (código vulnerável vs. seguro) e reproduza cada snippet do zero no editor. Termine com os gotchas e o cookbook.<br><br><strong>Tem uma semana?</strong> Percorra todos os keypoints com código, implemente as receitas do cookbook em um projeto sandbox, e treine todas as Q&As até responder sem consultar.',
    keypoints: [
      {
        title: 'A01 — Broken Access Control',
        body: 'Controle de acesso mal implementado: usuário acessa recursos que não deveria. É a categoria #1 desde 2021, subindo de #5. Inclui IDOR (Insecure Direct Object Reference), escalada de privilégio horizontal/vertical, e bypass de restrições por manipulação de URL, cookie ou parâmetro.',
        code: `// Vulnerável: assume que o userId da sessão == userId da rota
app.get('/api/users/:id/orders', async (req, res) => {
  const orders = await db.orders.findByUserId(req.params.id) // qualquer id passa
  res.json(orders)
})

// Seguro: verifica que o recurso pertence ao usuário autenticado
app.get('/api/users/:id/orders', authMiddleware, async (req, res) => {
  if (req.user.id !== req.params.id && !req.user.isAdmin) {
    return res.status(403).json({ error: 'Acesso negado' })
  }
  const orders = await db.orders.findByUserId(req.params.id)
  res.json(orders)
})`,
      },
      {
        title: 'A02 — Cryptographic Failures',
        body: 'Dados sensíveis expostos por falhas criptográficas: dados em trânsito sem TLS, senhas armazenadas em texto plano ou com MD5/SHA1, chaves hardcodadas, uso de algoritmos fracos (RC4, DES), IVs previsíveis. A categoria anterior se chamava "Sensitive Data Exposure" — o foco agora é na causa raiz (cripto), não no sintoma.',
        code: `// Vulnerável: bcrypt rounds muito baixo; senha logada
const hash = await bcrypt.hash(password, 4)  // rounds mínimos = 10-12
console.log('senha recebida:', password)       // NUNCA logar dado sensível

// Seguro
const hash = await bcrypt.hash(password, 12)
// Nunca loga senha, token, cartão — apenas IDs e timestamps`,
      },
      {
        title: 'A03 — Injection',
        body: 'SQL Injection, NoSQL Injection, Command Injection, LDAP Injection — quando dados não confiáveis são enviados para um interpretador. A causa raiz é misturar código e dados. A defesa universal: nunca concatenar input do usuário em queries ou comandos. Usar prepared statements, ORMs com parametrização, ou input validation estrita.',
        code: `// Vulnerável: SQL Injection clássico
const q = \`SELECT * FROM users WHERE email = '\${req.body.email}'\`

// Seguro com prepared statement
const q = 'SELECT * FROM users WHERE email = $1'
const { rows } = await pool.query(q, [req.body.email])

// Seguro com ORM (prisma)
const user = await prisma.user.findUnique({ where: { email: req.body.email } })`,
      },
      {
        title: 'A04 — Insecure Design',
        body: 'Categoria nova em 2021: falhas de design de segurança que nenhum controle de implementação resolve depois. Exemplos: fluxo de recuperação de senha que revela se o e-mail existe, rate limiting ausente em endpoint de autenticação, lógica de negócio que permite abusos (comprar item com preço negativo, pular etapas de checkout). A defesa é threat modeling antes de codar.',
      },
      {
        title: 'A05 — Security Misconfiguration',
        body: 'Configurações inseguras: portas desnecessárias abertas, headers de segurança ausentes, credenciais padrão, stack traces expostos em produção, S3 buckets públicos. É a categoria mais fácil de detectar com ferramentas automatizadas e uma das mais prevalentes. Princípio: least privilege, default-deny, e hardening de toda a stack.',
        code: `// Headers de segurança com helmet (Express)
import helmet from 'helmet'
app.use(helmet()) // CSP, X-Frame-Options, HSTS, X-Content-Type, etc.

// Nunca expor stack trace em produção
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Erro interno' }) // sem err.stack no body
})`,
      },
      {
        title: 'A06 — Vulnerable and Outdated Components',
        body: 'Dependências com CVEs conhecidas: libs npm, imagens Docker, frameworks com versões sem suporte. O ataque SolarWinds e o Log4Shell são exemplos reais de devastação via componentes de terceiros. Mitigação: lock de versões, SCA (Software Composition Analysis) com Snyk ou Dependabot, política de atualização.',
      },
      {
        title: 'A07 — Identification and Authentication Failures',
        body: 'Falhas de autenticação: ausência de MFA, senhas fracas aceitas, sessões que não expiram, tokens previsíveis, credential stuffing sem rate limiting, JWTs sem verificação de assinatura. Inclui session fixation e broken logout.',
        code: `// Vulnerável: aceita JWT sem verificar assinatura (algorithm: none)
const payload = jwt.decode(token) // só decodifica, não verifica!

// Seguro: sempre verify com secret/chave pública
const payload = jwt.verify(token, process.env.JWT_SECRET, {
  algorithms: ['HS256'], // nunca aceitar 'none'
})`,
      },
      {
        title: 'A08 — Software and Data Integrity Failures',
        body: 'Categoria nova 2021: inclui deserialização insegura e CI/CD sem verificação de integridade. Exemplos: pipeline que executa código de PRs externos sem revisão, dependências carregadas sem checksum, atualizações automáticas de plugins sem assinatura. O ataque de supply chain a NPM (event-stream 2018) é o exemplo canônico.',
      },
      {
        title: 'A09 — Security Logging and Monitoring Failures',
        body: 'Ausência de logs de segurança ou monitoramento inadequado. Sem logs: ataques de força bruta passam despercebidos, incidentes não têm forensics, SLAs de detecção violados. Mínimo: logar tentativas de login (sucesso/falha), acessos a dados sensíveis, mudanças de permissão, erros 4xx/5xx — com timestamp, IP e userId. Nunca logar dados sensíveis (senha, token, CPF).',
      },
      {
        title: 'A10 — Server-Side Request Forgery (SSRF)',
        body: 'Servidor faz requisição a URL controlada pelo atacante: acesso a metadados de cloud (http://169.254.169.254/), varredura de rede interna, exfiltração de dados. Mitigação: allowlist de domínios/IPs, bloquear IPs privados e link-local (127.x, 10.x, 172.16-31.x, 169.254.x), desabilitar redirects em requisições server-side.',
        code: `// Vulnerável: aceita qualquer URL do usuário
const res = await fetch(req.body.webhookUrl)

// Seguro: valida contra allowlist e bloqueia IPs internos
import { isPrivateIP } from 'is-private-ip'
const url = new URL(req.body.webhookUrl)
if (!ALLOWED_DOMAINS.includes(url.hostname)) throw new Error('Domínio não permitido')
const resolved = await dns.lookup(url.hostname)
if (isPrivateIP(resolved.address)) throw new Error('IP privado não permitido')`,
      },
    ],
    diagrams: [
      {
        title: 'OWASP Top 10 (2021) — Mapa de Risco',
        html: `<style>
.ow10-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;max-width:680px}
.ow10-row{display:flex;align-items:center;gap:10px;padding:7px 10px;border-radius:8px;margin-bottom:5px;cursor:pointer;transition:background .18s}
.ow10-row:hover{background:#1e293b}
.ow10-badge{min-width:36px;height:22px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;letter-spacing:.06em;flex-shrink:0}
.ow10-code{min-width:48px;font-size:10px;color:#64748b;font-family:'JetBrains Mono',monospace;flex-shrink:0}
.ow10-name{flex:1;font-size:11.5px;color:#e2e8f0;font-weight:600}
.ow10-new{font-size:8px;background:rgba(239,68,68,.15);border:1px solid rgba(239,68,68,.3);color:#ef4444;border-radius:3px;padding:1px 5px;flex-shrink:0}
.ow10-bar-wrap{width:90px;flex-shrink:0}
.ow10-bar{height:7px;border-radius:4px;transition:width .4s}
.ow10-tip{position:relative}
.ow10-tip:hover .ow10-tb{display:block}
.ow10-tb{display:none;position:absolute;right:0;top:calc(100% + 6px);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:10px;line-height:1.6;z-index:30;color:#94a3b8;width:260px;pointer-events:none;box-shadow:0 4px 16px rgba(0,0,0,.8)}
</style>
<div class="ow10-wrap">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
    <div>
      <p style="color:#ef4444;font-size:13px;font-weight:700;margin:0">OWASP Top 10 — 2021</p>
      <p style="color:#475569;font-size:10px;margin:4px 0 0">Passe o mouse em cada item para ver a descrição. Barra = prevalência relativa.</p>
    </div>
  </div>
  <div class="ow10-tip ow10-row">
    <div class="ow10-badge" style="background:rgba(239,68,68,.2);color:#ef4444">A01</div>
    <div class="ow10-code">Broken</div>
    <div class="ow10-name">Broken Access Control</div>
    <div class="ow10-bar-wrap"><div class="ow10-bar" style="width:90%;background:#ef4444"></div></div>
    <div class="ow10-tb">94% das aplicações testadas. IDOR, escalada de privilégio, bypass de autenticação por URL ou parâmetro.</div>
  </div>
  <div class="ow10-tip ow10-row">
    <div class="ow10-badge" style="background:rgba(249,115,22,.2);color:#f97316">A02</div>
    <div class="ow10-code">Crypto</div>
    <div class="ow10-name">Cryptographic Failures</div>
    <div class="ow10-bar-wrap"><div class="ow10-bar" style="width:75%;background:#f97316"></div></div>
    <div class="ow10-tb">Senhas em MD5/plaintext, dados sensíveis sem TLS, algoritmos fracos, chaves hardcodadas. Causa raiz de muitos vazamentos.</div>
  </div>
  <div class="ow10-tip ow10-row">
    <div class="ow10-badge" style="background:rgba(239,68,68,.2);color:#ef4444">A03</div>
    <div class="ow10-code">Inject</div>
    <div class="ow10-name">Injection</div>
    <div class="ow10-bar-wrap"><div class="ow10-bar" style="width:72%;background:#ef4444"></div></div>
    <div class="ow10-tb">SQL, NoSQL, Command, LDAP. Dados do usuário interpretados como código. Solução: prepared statements e ORMs.</div>
  </div>
  <div class="ow10-tip ow10-row">
    <div class="ow10-badge" style="background:rgba(239,68,68,.15);color:#ef4444">A04</div>
    <div class="ow10-code">Design</div>
    <div class="ow10-name">Insecure Design <span class="ow10-new">NOVO</span></div>
    <div class="ow10-bar-wrap"><div class="ow10-bar" style="width:55%;background:#ef4444"></div></div>
    <div class="ow10-tb">Falhas que nenhuma implementação resolve pós-design. Exige threat modeling antes de codar. Ex: fluxo de recuperação que revela e-mails.</div>
  </div>
  <div class="ow10-tip ow10-row">
    <div class="ow10-badge" style="background:rgba(249,115,22,.2);color:#f97316">A05</div>
    <div class="ow10-code">Misconf</div>
    <div class="ow10-name">Security Misconfiguration</div>
    <div class="ow10-bar-wrap"><div class="ow10-bar" style="width:80%;background:#f97316"></div></div>
    <div class="ow10-tb">90% dos apps testados. Portas abertas, headers ausentes, stack traces visíveis, credenciais padrão não alteradas.</div>
  </div>
  <div class="ow10-tip ow10-row">
    <div class="ow10-badge" style="background:rgba(249,115,22,.2);color:#f97316">A06</div>
    <div class="ow10-code">Vulns</div>
    <div class="ow10-name">Vulnerable Components</div>
    <div class="ow10-bar-wrap"><div class="ow10-bar" style="width:65%;background:#f97316"></div></div>
    <div class="ow10-tb">Dependências npm, imagens Docker, plugins com CVEs. Detectável com Snyk, Dependabot, Trivy. Log4Shell é o exemplo.</div>
  </div>
  <div class="ow10-tip ow10-row">
    <div class="ow10-badge" style="background:rgba(239,68,68,.2);color:#ef4444">A07</div>
    <div class="ow10-code">Auth</div>
    <div class="ow10-name">Auth Failures</div>
    <div class="ow10-bar-wrap"><div class="ow10-bar" style="width:62%;background:#ef4444"></div></div>
    <div class="ow10-tb">Ausência de MFA, senhas fracas aceitas, JWTs sem verificação, sessões sem expiração, credential stuffing sem rate limit.</div>
  </div>
  <div class="ow10-tip ow10-row">
    <div class="ow10-badge" style="background:rgba(239,68,68,.15);color:#ef4444">A08</div>
    <div class="ow10-code">Integ</div>
    <div class="ow10-name">Integrity Failures <span class="ow10-new">NOVO</span></div>
    <div class="ow10-bar-wrap"><div class="ow10-bar" style="width:45%;background:#ef4444"></div></div>
    <div class="ow10-tb">Deserialização insegura, CI/CD sem verificação de integridade, supply chain attacks. Inclui o ataque event-stream (npm 2018).</div>
  </div>
  <div class="ow10-tip ow10-row">
    <div class="ow10-badge" style="background:rgba(249,115,22,.2);color:#f97316">A09</div>
    <div class="ow10-code">Logs</div>
    <div class="ow10-name">Logging Failures</div>
    <div class="ow10-bar-wrap"><div class="ow10-bar" style="width:50%;background:#f97316"></div></div>
    <div class="ow10-tb">Sem logs de segurança, ataques passam despercebidos. Logar: login attempts, acessos a dados sensíveis, erros 4xx/5xx — nunca a senha.</div>
  </div>
  <div class="ow10-tip ow10-row">
    <div class="ow10-badge" style="background:rgba(239,68,68,.15);color:#ef4444">A10</div>
    <div class="ow10-code">SSRF</div>
    <div class="ow10-name">Server-Side Request Forgery <span class="ow10-new">NOVO</span></div>
    <div class="ow10-bar-wrap"><div class="ow10-bar" style="width:38%;background:#ef4444"></div></div>
    <div class="ow10-tb">Servidor acessa URL do atacante: metadados AWS, rede interna, exfiltração. Bloquear IPs privados + allowlist de domínios.</div>
  </div>
</div>`,
        caption: 'As 3 categorias marcadas como NOVO foram introduzidas na versão 2021. Prevalência relativa baseada nos dados do relatório OWASP 2021.',
      },
    ],
    interview: [
      {
        q: 'O que é IDOR e como você previne?',
        a: 'IDOR (Insecure Direct Object Reference) é quando a aplicação expõe referências internas (IDs numéricos sequenciais, slugs previsíveis) diretamente na URL ou body, e não verifica se o usuário logado tem permissão para aquele recurso. Exemplo: GET /api/orders/1234 retorna o pedido sem checar se pertence ao usuário da sessão. A prevenção é sempre verificar, no servidor, se req.user.id é dono do recurso buscado. Nunca confiar em IDs vindos do cliente. Usar UUIDs ajuda a dificultar adivinhação, mas não substitui a verificação de autorização.',
        tip: 'Mencione que IDOR é a manifestação mais comum de Broken Access Control (A01) e que a validação deve ser server-side — nada no frontend previne isso.',
        level: 'pleno',
      },
      {
        q: 'Qual a diferença entre autenticação e autorização? Onde cada uma pode falhar?',
        a: 'Autenticação responde "quem é você?" — verifica identidade (login, JWT, sessão). Autorização responde "o que você pode fazer?" — verifica permissões sobre recursos. Falhas de autenticação (A07): JWT sem verificar assinatura, ausência de expiração de sessão, ausência de rate limiting em login, senhas fracas aceitas. Falhas de autorização (A01): não checar se o usuário tem permissão para o recurso específico, checar permissão apenas no frontend, escalada de privilégio por manipulação de parâmetro.',
        tip: 'Essa pergunta frequentemente vem com um cenário prático. Esteja pronto para identificar a falha numa URL hipotética.',
        level: 'pleno',
      },
      {
        q: 'O que é SQL Injection e por que prepared statements resolvem o problema?',
        a: 'SQL Injection ocorre quando input do usuário é concatenado diretamente em uma query SQL, fazendo o banco interpretá-lo como código. Exemplo clássico: WHERE email = \'${email}\' — um email como x\' OR 1=1-- transforma a query. Prepared statements resolvem porque separam o código SQL dos dados: o banco recebe o template compilado primeiro, depois os valores como parâmetros. Os parâmetros nunca são interpretados como SQL — são tratados como strings literais. ORMs modernos (Prisma, TypeORM) usam prepared statements internamente, mas ainda é possível vulnerabilidades com raw queries mal usadas.',
        tip: 'Se mencionar ORMs, o entrevistador pode perguntar sobre raw queries — esteja pronto para citar o risco de template literals com input não sanitizado mesmo dentro de um ORM.',
        level: 'pleno',
      },
      {
        q: 'O que é SSRF e por que é especialmente perigoso em ambientes cloud?',
        a: 'SSRF (Server-Side Request Forgery) permite ao atacante fazer o servidor realizar requisições HTTP a destinos arbitrários. Em ambientes cloud (AWS, GCP, Azure), o endpoint de metadados de instância (169.254.169.254 na AWS, 169.254.169.254/computeMetadata no GCP) retorna credenciais temporárias da role IAM da instância. Um atacante com SSRF pode extrair essas credenciais e assumir a role, obtendo acesso a toda a AWS do alvo. A IMDSv2 da AWS mitiga isso exigindo um token de sessão, mas aplicações que constroem URLs a partir de input do usuário precisam de allowlist + bloqueio de IPs privados/link-local no nível da aplicação.',
        tip: 'Citar IMDSv2 e o endpoint 169.254.169.254 demonstra conhecimento aplicado a cloud — diferencial em entrevistas de backend/infra.',
        level: 'senior',
      },
      {
        q: 'Como você implementaria Content Security Policy (CSP) e qual problema ela resolve?',
        a: 'CSP é um header HTTP que instrui o browser quais fontes de scripts, estilos, imagens e outros recursos são permitidos. Resolve XSS mitigando a execução de scripts injetados — mesmo que o atacante consiga injetar uma tag <script>, o browser bloqueia se a origem não estiver na policy. Uma CSP bem configurada usa nonces (valores aleatórios por request) em vez de "unsafe-inline". Implementação no Express: res.setHeader("Content-Security-Policy", "default-src \'self\'; script-src \'self\' \'nonce-{NONCE}\'"). O helmet.js configura CSP com sensatos defaults. Importante: CSP é uma defesa em profundidade — não substitui sanitização server-side de output.',
        tip: 'Mencionar que CSP é "defesa em profundidade" e não substitui sanitização server-side demonstra maturidade. XSS (A03 em versões antigas) ainda é uma das falhas mais exploradas.',
        level: 'senior',
      },
      {
        q: 'O que é o princípio de "Insecure Design" (A04) e como threat modeling o previne?',
        a: 'Insecure Design cobre falhas de segurança no design do sistema que nenhuma implementação perfeita resolve depois — são decisões arquiteturais que criam vetores de ataque intrinsecamente. Exemplos: fluxo de recuperação de senha que responde diferente para e-mails existentes vs. não existentes (revelando a base de usuários), ausência de rate limiting concebida no design (não apenas não implementada), ou lógica de negócio que permite comprar produto com quantidade negativa. Threat modeling (STRIDE: Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege) é feito antes de escrever código — para cada componente, pergunta-se: quem pode abusar isso, com que vetor, com que impacto. O resultado são requisitos de segurança que entram no design antes de qualquer linha de código.',
        tip: 'STRIDE é o framework de threat modeling mais cobrado em entrevistas. Se souber DREAD (obsoleto mas ainda aparece), mencione que foi substituído por abordagens quantitativas mais robustas.',
        level: 'senior',
      },
    ],
    gotchas: [
      'Negar acesso no frontend (esconder botão, rota) não é controle de acesso — sempre validar no servidor.',
      'UUIDs no lugar de IDs sequenciais dificultam IDOR mas não substituem verificação de permissão server-side.',
      'JWT com algorithm: none ou sem verificar a assinatura (jwt.decode() em vez de jwt.verify()) é autenticação falsa.',
      'Stack traces em respostas de erro em produção são information disclosure — nunca expor.',
      'CORS mal configurado (Access-Control-Allow-Origin: *) não causa CSRF diretamente, mas permite que origens arbitrárias leiam respostas — entender a diferença é essencial.',
      'Rate limiting só no frontend é bypassável em segundos — deve ser server-side e por IP + por usuário.',
    ],
    mnemonics: [
      {
        trick: 'BC-IIS-VAS-IL',
        label: 'OWASP Top 10 2021 — ordem das categorias',
        explanation: 'A01 Broken Access Control, A02 Cryptographic Failures, A03 Injection, A04 Insecure Design, A05 Security Misconfiguration, A06 Vulnerable Components, A07 Auth Failures, A08 Software Integrity Failures, A09 Logging Failures, A10 SSRF. Lembre como: "Broken Crypto Injections — Insecure Security, Vulnerable Auth Software — Logs Surrendered".',
      },
    ],
    resources: [
      { title: 'OWASP Top 10 — Documentação oficial 2021', url: 'https://owasp.org/Top10/', kind: 'docs' },
      { title: 'OWASP Cheat Sheet Series', url: 'https://cheatsheetseries.owasp.org/', kind: 'docs' },
    ],
  },

  'owasp-api-top-10': {
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
    ],
    gotchas: [
      'BOLA e Broken Access Control (A01 do Top 10 web) são a mesma classe de falha — BOLA é o nome específico para APIs.',
      'Mass Assignment não é só para PUT/PATCH — POST de criação também pode ter campos extras indesejados (ex: role).',
      'Rate limiting só por IP é bypassável com rotação de IPs — combinar com rate limit por usuário autenticado.',
      'GraphQL sem query depth limit é um DoS esperando acontecer — fieldCount e complexidade também precisam de teto.',
      'Retornar 404 vs 403 para objetos não autorizados é uma escolha de tradeoff: 403 confirma que o objeto existe; 404 adiciona obscuridade (prefira 403 por clareza, mas entenda o tradeoff).',
    ],
    resources: [
      { title: 'OWASP API Security Top 10 — 2023', url: 'https://owasp.org/API-Security/editions/2023/en/0x00-header/', kind: 'docs' },
    ],
  },

  'threat-modeling': {
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
  },

  // ─── P2 ────────────────────────────────────────────────────────────────────

  'sast-semgrep': {
    tagline: 'Análise estática de código para encontrar vulnerabilidades antes de executar — Semgrep como padrão open source.',
    why: 'SAST (Static Application Security Testing) encontra vulnerabilidades no código fonte sem executar a aplicação — ideal para integrar em CI/CD. Semgrep se tornou o padrão open source por ter regras específicas por framework (React, Express, Django) e permitir escrever regras customizadas em YAML. Saber configurar SAST em pipeline é diferencial em posições DevSecOps e backend sênior.',
    summary: 'SAST analisa o código fonte (ou bytecode) em busca de padrões de vulnerabilidade sem executar a aplicação. Ao contrário de linters de qualidade, SAST tem regras orientadas a segurança: SQL injection por concatenação, XSS por innerHTML, hardcoded secrets, uso de funções criptográficas fracas. O Semgrep usa uma sintaxe de pattern matching que espelha a sintaxe da linguagem alvo — para Node.js/TypeScript, os padrões são escritos em JavaScript-like. Regras do Semgrep Registry cobrem OWASP Top 10 para as principais linguagens. A integração em CI bloqueia o merge se vulnerabilidades críticas são encontradas, criando um "shift left" real de segurança.',
    keypoints: [
      {
        title: 'Como o Semgrep funciona',
        body: 'Semgrep analisa o AST (Abstract Syntax Tree) do código, não o texto em si. Isso permite patterns como "qualquer chamada à função eval() com argumento não literal" — sem falsos positivos de strings em comentários. Os patterns são escritos em YAML e podem usar metavariáveis ($X, $FUNC) para capturar qualquer expressão.',
        code: `# Regra Semgrep: detectar SQL injection por concatenação em Node.js
rules:
  - id: sql-injection-concat
    patterns:
      - pattern: |
          $DB.query($QUERY + $INPUT)
      - pattern-not: |
          $DB.query($QUERY, [$SAFE])
    message: "Possível SQL injection: concatenação em query SQL"
    languages: [javascript, typescript]
    severity: ERROR`,
      },
      {
        title: 'Integração em CI/CD (GitHub Actions)',
        body: 'Semgrep tem action oficial no GitHub Actions Marketplace. O padrão é rodar em PRs e bloquear merge em findings críticos ou altos. O modo diff (--diff-only) analisa apenas as linhas modificadas no PR — mais rápido e menos ruído.',
        code: `# .github/workflows/semgrep.yml
name: Semgrep SAST
on:
  pull_request: {}
jobs:
  semgrep:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: semgrep/semgrep-action@v1
        with:
          config: >-
            p/owasp-top-ten
            p/typescript
            p/nodejs
          auditOn: push
          generateSarif: "1"`,
      },
      {
        title: 'Falsos positivos e supressão',
        body: 'Todo SAST gera falsos positivos. Semgrep permite suprimir individualmente com comentário inline (nosemgrep) ou por metadados de regra. O objetivo é manter a relação sinal/ruído alta — suppressing uma regra que gera 90% de falsos positivos é preferível a fazer o time ignorar todos os alerts.',
        code: `// Suprimir um finding específico com justificativa
const query = 'SELECT * FROM users WHERE id = ' + userId // nosemgrep: sql-injection-concat
// Motivo: userId é um integer validado pelo Zod antes deste ponto — parseInt seguro`,
      },
    ],
    interview: [
      {
        q: 'Qual a diferença entre SAST, DAST e SCA? Quando usar cada um?',
        a: 'SAST (Static): analisa código fonte sem executar — roda no CI, detecta injection, hardcoded secrets, uso de APIs inseguras. DAST (Dynamic): executa a aplicação e testa como atacante — detecta falhas que só aparecem em runtime (configuração de servidor, headers, lógica de estado). SCA (Software Composition Analysis): analisa dependências de terceiros em busca de CVEs conhecidas — complementar ao SAST. Em uma pipeline de DevSecOps completa, os três rodam em paralelo: SAST/SCA em todo PR, DAST em staging antes de promover para produção.',
        tip: 'Saber que os três são complementares e não substitutos é o que demonstra visão de pipeline de segurança, não apenas conhecimento de ferramentas.',
        level: 'pleno',
      },
      {
        q: 'Como você reduziria o ruído de falsos positivos em SAST sem desabilitar regras importantes?',
        a: 'Primeiro: separar findings por severidade — só bloquear CI em CRITICAL/HIGH, reportar MEDIUM/LOW como informação. Segundo: usar modo diff em PRs (analisar só linhas modificadas). Terceiro: criar regras com pattern-not para excluir os casos seguros conhecidos (ex: query parametrizada que o Semgrep não reconhece como segura). Quarto: revisão periódica dos falsos positivos acumulados para ajustar ou criar supressões com justificativa documentada. O objetivo é uma taxa de falsos positivos baixa o suficiente para que o time não desenvolva "alert fatigue".',
        tip: 'Alert fatigue (ignorar todos os alerts por excesso de ruído) é o maior risco de um SAST mal calibrado. Mencionar isso demonstra que você pensa na adoção do processo, não só na ferramenta.',
        level: 'pleno',
      },
      {
        q: 'O que é "shift left security" e como SAST viabiliza isso?',
        a: 'Shift left significa mover a detecção e correção de problemas para as fases mais cedo do desenvolvimento — quanto mais tarde uma vulnerabilidade é descoberta, mais cara é para corrigir. SAST viabiliza shift left porque roda no momento do commit/PR, antes do code review humano, antes de qualquer deploy. O dev recebe o feedback imediatamente, no contexto do código que acabou de escrever, e pode corrigir antes de a mudança ir para qualquer ambiente. Comparado com um pentest antes do lançamento (shift right extremo), SAST é ordens de magnitude mais barato por vulnerabilidade encontrada.',
        level: 'senior',
      },
      {
        q: 'Como você escreveria uma regra Semgrep customizada para detectar logging de dados sensíveis?',
        a: 'A regra precisa capturar chamadas a logger com argumentos que contenham campos sensíveis. No Semgrep: pattern-either para cobrir os nomes comuns de campos sensíveis (password, token, secret, cpf, card), combinado com qualquer chamada de logging (console.log, logger.info, etc.). A metavariável $SENSITIVE captura o valor e a regra verifica se ele veio de um objeto com key sensível. Importante incluir uma mensagem clara e exemplos de como corrigir (logar apenas { userId } em vez do objeto inteiro).',
        level: 'senior',
      },
    ],
    gotchas: [
      'SAST não substitui code review de segurança humano — detecta padrões conhecidos, não lógica de negócio insegura.',
      'Regras muito permissivas geram alert fatigue e o time para de olhar os reports — calibrar severidade é tão importante quanto ter as regras.',
      'Semgrep analisa um arquivo por vez por padrão — para data flow inter-procedural (taint analysis), usar o modo "taint" ou ferramentas mais pesadas como CodeQL.',
      'Não instalar semgrep localmente sem revisar as regras que você adiciona — algumas regras do Registry são experimentais e geram muitos falsos positivos.',
    ],
    resources: [
      { title: 'Semgrep — Documentação oficial', url: 'https://semgrep.dev/docs/', kind: 'docs' },
      { title: 'Semgrep Registry — OWASP rules', url: 'https://semgrep.dev/p/owasp-top-ten', kind: 'pratica' },
    ],
  },

  'dast-zap': {
    tagline: 'Teste dinâmico de segurança — OWASP ZAP para encontrar vulnerabilidades em aplicações em execução.',
    why: 'DAST (Dynamic Application Security Testing) encontra vulnerabilidades que só aparecem em runtime: headers de segurança ausentes, CORS mal configurado, endpoints não documentados expostos, respostas com dados vazados. O OWASP ZAP é o padrão open source para DAST — gratuito, com API REST e modo de automação para CI/CD. Saber integrá-lo em staging é diferencial em DevSecOps.',
    summary: 'DAST testa a aplicação como um atacante faria: faz requests HTTP reais contra a aplicação em execução, analisa as respostas, e tenta explorar padrões de vulnerabilidade. O ZAP (Zed Attack Proxy) funciona como proxy entre o cliente e o servidor — captura todo o tráfego, permite análise passiva (observar requests sem modificar) e ativa (tentar exploits automáticos). Em modo de automação, o ZAP pode fazer baseline scan (checa configurações e headers em minutos), spider (mapeia endpoints) e active scan (tenta exploits). A integração em CI/CD roda o baseline scan em staging antes de promover para produção — alertas críticos bloqueiam a promoção.',
    keypoints: [
      {
        title: 'ZAP Baseline Scan — o mais rápido para CI',
        body: 'O baseline scan verifica configurações de segurança básicas em poucos minutos: headers HTTP ausentes (CSP, HSTS, X-Frame-Options), cookies sem atributos Secure/HttpOnly/SameSite, CORS muito aberto, informações de versão de servidor expostas. É o modo ideal para CI/CD porque não faz ataques ativos — apenas análise passiva.',
        code: `# Docker: baseline scan contra staging
docker run --rm owasp/zap2docker-stable zap-baseline.py \\
  -t https://staging.meuapp.com \\
  -r zap-report.html \\
  -J zap-report.json \\
  -I  # não falhar em alertas de nível INFO`,
      },
      {
        title: 'Integração em GitHub Actions',
        body: 'O ZAP tem action oficial no GitHub Actions. O padrão é rodar em deployments de staging — após o deploy, antes de criar a release tag. Alertas HIGH bloqueam o workflow; MEDIUM são reportados como warnings.',
        code: `# .github/workflows/dast.yml
- name: ZAP Baseline Scan
  uses: zaproxy/action-baseline@v0.12.0
  with:
    target: 'https://staging.meuapp.com'
    rules_file_name: '.zap/rules.tsv'
    cmd_options: '-I'`,
      },
      {
        title: 'Diferença entre scan passivo e ativo',
        body: 'Passivo: ZAP observa requests sem modificar — detecta headers ausentes, cookies inseguros, informações vazadas. Ativo: ZAP envia payloads maliciosos (SQL injection strings, XSS payloads, path traversal) e analisa se a aplicação é vulnerável. Scan ativo nunca deve rodar contra produção — apenas staging com dados de teste.',
      },
    ],
    interview: [
      {
        q: 'Por que DAST complementa SAST em vez de substituí-lo?',
        a: 'SAST analisa o código sem executar — encontra padrões de vulnerabilidade no source (injection por concatenação, crypto fraca, hardcoded secrets). DAST executa a aplicação e testa como atacante — encontra problemas de configuração (headers ausentes, CORS), lógica de runtime, e vulnerabilidades em dependências que não aparecem no source code. SAST dá falsos negativos para problemas de configuração; DAST dá falsos negativos para código nunca executado nos testes. Juntos, cobrem superfícies diferentes — a pirâmide de DevSecOps usa os dois.',
        level: 'pleno',
      },
      {
        q: 'Quais são os riscos de rodar DAST com active scan em produção?',
        a: 'Active scan dispara payloads de ataque reais contra a aplicação: SQL injection strings, XSS payloads, tentativas de path traversal, fuzzing de parâmetros. Em produção, isso pode corromper dados reais (se a aplicação for vulnerável a injection), gerar entradas inválidas em bancos, disparar alertas de segurança que acordam o time de plantão, e impactar performance durante o scan. A regra absoluta é: active scan apenas em staging com dados de teste, nunca em produção. Baseline scan (passivo) pode rodar em produção com segurança.',
        tip: 'Demonstrar consciência dos riscos do active scan é o que mostra que você não é só teórico — pensa nas consequências operacionais.',
        level: 'pleno',
      },
      {
        q: 'O que os headers de segurança HTTP verificados pelo ZAP protegem?',
        a: 'Content-Security-Policy (CSP): limita quais scripts, estilos e recursos podem ser carregados — mitiga XSS. HTTP Strict-Transport-Security (HSTS): força HTTPS em futuras conexões — previne downgrade attacks. X-Frame-Options / frame-ancestors: previne clickjacking (embeber o site em iframe malicioso). X-Content-Type-Options: nosniff — previne MIME sniffing que pode levar a execução de scripts. Referrer-Policy: controla quais informações são enviadas no header Referer — previne vazamento de URLs internas. Permissions-Policy: controla acesso a features do browser (câmera, microfone, geolocalização).',
        level: 'senior',
      },
      {
        q: 'Como você configuraria um pipeline de segurança completo com SAST + DAST + SCA?',
        a: 'Em cada PR: SAST (Semgrep) roda em diff-only nos arquivos modificados; SCA (Snyk ou Dependabot) checa novas dependências por CVEs. Em deploy para staging: DAST baseline scan (ZAP) roda após o deploy antes de promover. Em merge para main com deploy: DAST full scan (com active scan configurado cuidadosamente) em staging. Findings HIGH/CRITICAL em qualquer etapa bloqueiam o workflow. Findings MEDIUM são reportados como comentários no PR. O resultado é um "security gate" automatizado que não depende de lembrança humana — a pipeline garante que nenhum código com vulnerabilidade crítica conhecida chega a produção.',
        level: 'senior',
      },
    ],
    gotchas: [
      'Active scan nunca em produção — apenas staging com dados de teste. Parece óbvio até alguém configurar o CI apontando para a URL errada.',
      'ZAP autenticado (logado como usuário) encontra muito mais vulnerabilidades que não-autenticado — configurar sessão de autenticação no scan é essencial para cobrir APIs protegidas.',
      'Rate limiting muito agressivo no servidor pode fazer o ZAP parecer que não encontrou vulnerabilidades — o scan foi bloqueado antes de testar.',
    ],
    resources: [
      { title: 'OWASP ZAP — Documentação oficial', url: 'https://www.zaproxy.org/docs/', kind: 'docs' },
      { title: 'ZAP GitHub Actions', url: 'https://github.com/zaproxy/action-baseline', kind: 'pratica' },
    ],
  },

  'snyk-dependabot': {
    tagline: 'SCA automatizado — detectar e corrigir vulnerabilidades em dependências de terceiros no CI/CD.',
    why: 'Dependências npm, pip e Docker são vetores de ataque crescentes (Log4Shell, event-stream, polyfill.io). Snyk e Dependabot automatizam a detecção de CVEs em dependências e abrem PRs de atualização automaticamente. Saber configurar SCA em pipeline é item de checklist em posições sênior com responsabilidade de produção.',
    summary: 'SCA (Software Composition Analysis) analisa o grafo de dependências do projeto (package-lock.json, yarn.lock, Pipfile.lock, etc.) em busca de pacotes com CVEs conhecidas no banco de dados de vulnerabilidades (NVD, GitHub Advisory Database, Snyk DB). Snyk tem mais cobertura de CVEs (especialmente em linguagens menos populares), alertas em tempo real e PR automáticos. Dependabot está integrado nativamente no GitHub e é gratuito sem limites. Em produção, o fluxo ideal é: Dependabot abre PR de patch automaticamente → CI roda testes → se passa, auto-merge em patches sem breaking changes.',
    keypoints: [
      {
        title: 'Dependabot — configuração básica',
        body: 'O arquivo .github/dependabot.yml ativa o Dependabot para npm, Docker e GitHub Actions. Configurar groupUpdates para agrupar updates de patches numa PR única evita dezenas de PRs por semana.',
        code: `# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    groups:
      production-dependencies:
        dependency-type: "production"
        update-types: ["patch", "minor"]
  - package-ecosystem: "docker"
    directory: "/"
    schedule:
      interval: "weekly"`,
      },
      {
        title: 'Snyk CLI no CI',
        body: 'Snyk CLI pode ser instalado em pipelines para bloquear builds com vulnerabilidades CRITICAL ou HIGH em dependências. O --severity-threshold permite configurar o nível mínimo de alerta que bloqueia o build.',
        code: `# GitHub Actions com Snyk
- name: Snyk — verificar vulnerabilidades
  uses: snyk/actions/node@master
  env:
    SNYK_TOKEN: \${{ secrets.SNYK_TOKEN }}
  with:
    args: --severity-threshold=high --fail-on=upgradable`,
      },
      {
        title: 'Diferença entre Snyk e Dependabot',
        body: 'Dependabot: gratuito, integrado ao GitHub, foca em abrir PRs de atualização. Snyk: banco de dados de CVEs maior (especialmente para containers e IaC), análise de reachability (a vulnerabilidade é realmente atingível no seu código?), dashboard de risco, suporte a mais ecossistemas. Para projetos simples: Dependabot basta. Para projetos com compliance e múltiplas linguagens: Snyk agrega valor.',
      },
    ],
    interview: [
      {
        q: 'O que é SCA e como difere de SAST?',
        a: 'SCA (Software Composition Analysis) analisa dependências de terceiros em busca de CVEs conhecidas — não analisa o código que você escreveu. SAST analisa o código fonte que você escreveu em busca de padrões de vulnerabilidade — não analisa dependências. SCA detecta: "sua versão do lodash tem CVE-2021-XXXX". SAST detecta: "você concatenou input do usuário em query SQL". Ambos são complementares e devem rodar no CI — nenhum substitui o outro.',
        level: 'pleno',
      },
      {
        q: 'Como você priorizaria qual dependência vulnerável corrigir primeiro?',
        a: 'Três fatores: severidade do CVE (CVSS score), reachability (a vulnerabilidade é explorável no caminho de código que você usa?), e availabilidade de fix (existe versão sem CVE?). Snyk tem análise de reachability que identifica se a função vulnerável é realmente chamada pelo seu código. CVE CRITICAL com função vulnerável chamada no hot path = fix imediato. CVE HIGH em dependência transitiva de dev-only (ex: jest) = menor prioridade.',
        level: 'pleno',
      },
      {
        q: 'Como o ataque de supply chain do event-stream (2018) poderia ter sido detectado?',
        a: 'O evento: o mantenedor do event-stream (npm) transferiu o pacote para um contribuidor que adicionou um módulo malicioso (flatmap-stream) que roubava carteiras de Bitcoin. Detecção possível: (1) Snyk/Dependabot teria alertado quando a versão com o módulo malicioso foi publicada (após a comunidade reportar e o Advisory ser criado); (2) auditoria de integridade de lockfile (package-lock.json) no CI teria detectado mudança de hash inesperada numa versão sem bump; (3) npm audit roda isso nativamente. A lição: fixar versões de dependências com lockfile e verificar integridade de pacotes em CI são controles fundamentais de supply chain security.',
        level: 'senior',
      },
      {
        q: 'Como você configuraria auto-merge de PRs do Dependabot de forma segura?',
        a: 'Auto-merge seguro requer três condições: (1) apenas patches e minors de dependências de produção (major nunca auto-merge — pode ter breaking changes); (2) CI completo passa (testes unitários + integração + SAST); (3) as dependências com auto-merge são apenas de produção (não dev — jest e tools de build merecem mais revisão). Configuração no GitHub: criar workflow que detecta PR do Dependabot, verifica se é patch/minor, aguarda CI passar, e usa gh pr merge --auto. Para pacotes críticos (auth libs, crypto), nunca auto-merge independente de semver.',
        level: 'senior',
      },
    ],
    gotchas: [
      'CVE em dependência transitiva (dependência da sua dependência) não aparece no package.json — apenas no lockfile. SCA precisa analisar o grafo completo, não só as dependências diretas.',
      'npm audit --fix pode fazer downgrade de versões de forma não intencional — sempre revisar o lockfile diff após o fix.',
      'Fixar versão exata (\"lodash\": \"4.17.21\") vs. usar range (\"^4.17.21\") é um tradeoff: exata = reproducibilidade, mas sem patches automáticos; range = patches automáticos, mas risco de mudança inesperada.',
      'Dependabot abre muitos PRs simultâneos em projetos com muitas dependências — usar groupUpdates para reduzir o ruído ou o time para de revisar.',
    ],
    resources: [
      { title: 'Snyk — Documentação', url: 'https://docs.snyk.io/', kind: 'docs' },
      { title: 'GitHub Dependabot — Configuração', url: 'https://docs.github.com/en/code-security/dependabot/dependabot-version-updates', kind: 'docs' },
    ],
  },

  'secrets-management': {
    tagline: 'Gestão segura de segredos — nunca hardcodar, rotacionar automaticamente, auditar acesso.',
    why: 'Segredos hardcodados (chaves de API, senhas de banco, tokens) no código fonte são uma das causas mais comuns de incidentes de segurança em produção. Saber usar AWS Secrets Manager, HashiCorp Vault ou Doppler, e integrar rotação automática de segredos, é diferencial imediato em posições de backend e DevOps.',
    summary: 'Secrets management cobre o ciclo de vida completo de segredos: geração, armazenamento, distribuição, rotação e revogação. O princípio fundamental é que segredos nunca devem estar em código fonte, variáveis de ambiente de build, ou logs. As ferramentas de secrets manager (AWS Secrets Manager, HashiCorp Vault, Doppler) centralizam o armazenamento com criptografia em repouso e em trânsito, auditoria de acesso (quem acessou qual segredo, quando), e rotação automática. Em CI/CD, os segredos são injetados como variáveis de ambiente em runtime — nunca commitados no repositório.',
    keypoints: [
      {
        title: 'Tipos de segredos e onde vão',
        body: 'Database credentials: AWS Secrets Manager ou Vault com rotação automática. API keys de terceiros: Doppler ou 1Password Secrets Automation. JWT secrets e encryption keys: gerados com alta entropia, rotacionados periodicamente, nunca em .env commitado. Chaves SSH e certificados TLS: gerenciados por ferramentas de PKI (Vault PKI, AWS ACM).',
        code: `// Buscar segredo do AWS Secrets Manager em runtime
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager'

const client = new SecretsManagerClient({ region: 'us-east-1' })

async function getDbCredentials() {
  const cmd = new GetSecretValueCommand({ SecretId: 'prod/myapp/db' })
  const secret = await client.send(cmd)
  return JSON.parse(secret.SecretString!) as { username: string; password: string }
}
// Credenciais nunca ficam em variáveis de ambiente — buscadas em runtime`,
      },
      {
        title: 'Rotação automática de segredos',
        body: 'Segredos não rotacionados são um risco crescente: se vazarem, ficam válidos indefinidamente. AWS Secrets Manager suporta rotação automática com Lambda — a cada N dias, uma Lambda gera nova senha no banco, atualiza o segredo no Secrets Manager, e a aplicação busca o novo valor na próxima chamada. O padrão é manter o segredo anterior válido por um período de "grace" para zero-downtime rotation.',
      },
      {
        title: 'GitHub Secrets para CI/CD',
        body: 'GitHub Actions criptografa segredos em repouso e os injeta como variáveis de ambiente apenas durante a execução. Nunca imprimir segredos em logs (GitHub mascara automaticamente, mas é uma garantia frágil). Usar OIDC (OpenID Connect) para autenticar pipelines com AWS sem segredo algum — o token é temporário e gerado automaticamente.',
        code: `# GitHub Actions com OIDC para AWS — zero secrets no repositório
- name: Configure AWS credentials via OIDC
  uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: arn:aws:iam::123456789:role/github-actions-deploy
    aws-region: us-east-1
# Nenhuma AWS_ACCESS_KEY ou AWS_SECRET_KEY hardcodada — token temporário via OIDC`,
      },
    ],
    interview: [
      {
        q: 'Como você garantiria que nenhuma chave de API seja commitada no repositório?',
        a: 'Três camadas: (1) pré-commit hook com gitleaks ou git-secrets para bloquear commits com padrões de segredos antes de chegarem ao repositório; (2) SAST com regras de hardcoded secrets (Semgrep tem p/secrets) no CI para detectar o que escapou do pre-commit; (3) GitHub Secret Scanning (nativo no GitHub) que varre commits históricos e futuros automaticamente. Se um segredo vazar: revogar imediatamente (não basta deletar o commit — o histórico git é imutável e pode ter sido clonado); rotar; auditoria de acesso para avaliar impacto.',
        tip: 'A ordem importa: bloquear no pre-commit é mais barato que detectar no CI, que é mais barato que detectar em produção.',
        level: 'pleno',
      },
      {
        q: 'Qual a diferença entre .env local e um secrets manager? Quando usar cada um?',
        a: '.env local: para desenvolvimento local, nunca commitado (no .gitignore), valores de desenvolvimento (banco local, API keys de sandbox). Secrets manager (AWS Secrets Manager, Vault, Doppler): para produção e staging — criptografia em repouso, auditoria de acesso, rotação automática, ACL por ambiente e serviço. A distinção crítica: .env em produção é uma antipattern porque fica em disco, não tem auditoria de acesso, e é difícil de rotacionar. Em produção, variáveis de ambiente devem ser injetadas pela plataforma (ECS task definition, Kubernetes Secret, etc.) a partir de um secrets manager — nunca um arquivo .env no servidor.',
        level: 'pleno',
      },
      {
        q: 'O que é OIDC e como elimina segredos hardcodados em pipelines de CI/CD?',
        a: 'OIDC (OpenID Connect) é um protocolo de identidade federada. No contexto de CI/CD: GitHub Actions pode se autenticar na AWS apresentando um token JWT temporário assinado pelo GitHub. A AWS verifica a assinatura e, se o token for válido e corresponder a uma IAM role configurada, retorna credenciais temporárias (STS). O resultado: nenhuma AWS_ACCESS_KEY ou AWS_SECRET_KEY no repositório. As credenciais duram minutos (tempo do job), não são armazenadas em nenhum lugar, e a permissão é controlada pela IAM role. GCP e Azure têm implementações equivalentes de Workload Identity Federation.',
        level: 'senior',
      },
      {
        q: 'Como funciona a rotação automática de segredos com zero downtime?',
        a: 'O padrão de rotação com zero downtime tem 4 fases: (1) Create new — gerar nova credencial no sistema de destino (ex: nova senha no banco); (2) Test — verificar que a nova credencial funciona; (3) Set current — atualizar o segredo no secrets manager para a nova credencial; (4) Finalize — revogar a credencial antiga após um período de "grace" (ex: 15 min) para que instâncias em execução com a credencial antiga possam renovar sem erro. O AWS Secrets Manager com Lambda faz esse ciclo nativamente para RDS. A aplicação, ao receber um erro de autenticação de banco, deve tentar renovar o segredo e reconectar — circuit breaker com refresh de credenciais.',
        level: 'senior',
      },
    ],
    gotchas: [
      'Deletar um commit com segredo não remove do histórico git — o git é imutável. O segredo permanece em git reflog, forks, e qualquer clone já feito. Revogar é sempre o primeiro passo.',
      '.env em produção (arquivo físico no servidor) não tem auditoria de acesso — qualquer pessoa com shell no servidor lê. Usar variáveis injetadas pela plataforma.',
      'Segredos em variáveis de ambiente podem vazar via /proc/pid/environ, stack traces que dumpeiam o ambiente, ou logs de debugging. Minimizar o número de segredos no ambiente de runtime.',
      'Rotação de segredos sem atualizar todas as instâncias simultaneamente causa falha de autenticação intermitente — o padrão de "grace period" com credencial dupla durante a transição é essencial.',
    ],
    resources: [
      { title: 'AWS Secrets Manager — Guia de boas práticas', url: 'https://docs.aws.amazon.com/secretsmanager/latest/userguide/best-practices.html', kind: 'docs' },
      { title: 'HashiCorp Vault — Documentação', url: 'https://developer.hashicorp.com/vault/docs', kind: 'docs' },
    ],
  },

  'gitleaks': {
    tagline: 'Scanner de segredos em repositórios git — encontra chaves, tokens e credenciais hardcodadas antes que vazem.',
    why: 'Segredos em repositórios git são um dos vetores de ataque mais explorados — scanners automatizados vasculham o GitHub publico em tempo real. Gitleaks é a ferramenta open source padrão para detectar isso, tanto como pre-commit hook quanto no CI. Saber configurar e customizar é item de checklist em DevSecOps.',
    summary: 'Gitleaks analisa o histórico de commits git em busca de padrões que correspondam a segredos conhecidos: chaves AWS, tokens GitHub, API keys de Stripe, SendGrid, Twilio, etc. A ferramenta vem com um banco de regras pré-configurado (via regex) para centenas de serviços e permite regras customizadas em TOML. O uso principal é como pre-commit hook (bloquear o commit antes de chegar ao repositório) e como scan no CI (varrer o histórico completo ou apenas o diff de um PR). Em repos com histórico comprometido, o gitleaks também faz scan retroativo para identificar quais segredos já existiram no histórico.',
    keypoints: [
      {
        title: 'Uso básico — scan de repositório',
        body: 'O comando detect faz scan do histórico git completo. O comando protect escaneia apenas arquivos staged (ideal para pre-commit hook).',
        code: `# Scan completo do repositório (histórico de commits)
gitleaks detect --source . --report-path gitleaks-report.json

# Scan apenas de arquivos staged (pre-commit hook)
gitleaks protect --staged

# Scan de um intervalo de commits (útil em CI para apenas o PR)
gitleaks detect --log-opts="HEAD~20..HEAD"`,
      },
      {
        title: 'Integração como pre-commit hook',
        body: 'Usando a ferramenta pre-commit (Python), o gitleaks pode ser adicionado ao .pre-commit-config.yaml e rodará automaticamente antes de cada commit.',
        code: `# .pre-commit-config.yaml
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.4
    hooks:
      - id: gitleaks`,
      },
      {
        title: 'Regras customizadas e allowlist',
        body: 'O arquivo de configuração .gitleaks.toml permite definir regras customizadas para segredos específicos do projeto (ex: padrão de API key proprietária) e allowlist para falsos positivos (ex: chaves de exemplo em documentação).',
        code: `# .gitleaks.toml
[allowlist]
  description = "Allowlist global"
  regexes = [
    '''EXAMPLE_KEY_123''',  # chave de exemplo em docs — não é real
  ]
  paths = [
    '''docs/.*''',          # documentação pode ter exemplos de formato
  ]

[[rules]]
  id = "myapp-api-key"
  description = "Chave de API do MyApp"
  regex = '''myapp_[0-9a-f]{32}'''
  severity = "CRITICAL"`,
      },
    ],
    interview: [
      {
        q: 'O que fazer quando um segredo é encontrado no histórico git?',
        a: 'Em ordem: (1) revogar o segredo imediatamente no serviço de origem (AWS, GitHub, Stripe, etc.) — essa é a ação mais importante, independente de qualquer outra; (2) gerar novo segredo e atualizar nos ambientes; (3) analisar logs de acesso do serviço para ver se o segredo foi usado por alguém não autorizado; (4) limpar o histórico git com BFG Repo Cleaner ou git filter-repo para remover o segredo dos commits históricos; (5) forçar todos os colaboradores a rebaser — o histórico local deles ainda tem o segredo. Importante: mesmo após o cleanup, assumir que o segredo foi comprometido — qualquer clone ou fork anterior ainda tem o histórico original.',
        tip: 'A resposta correta começa sempre com "revogar primeiro" — não com "limpar o histórico". Limpar sem revogar não resolve nada.',
        level: 'pleno',
      },
      {
        q: 'Como o gitleaks complementa o GitHub Secret Scanning nativo?',
        a: 'GitHub Secret Scanning (gratuito em repos públicos, pago em privados) varre automaticamente cada push por segredos de parceiros registrados (AWS, GitHub, Stripe, etc.) e alerta o mantenedor. Gitleaks complementa com: scan local antes do push (pre-commit — detecta antes de chegar ao GitHub), regras customizadas para segredos proprietários que o GitHub não conhece, scan retroativo de histórico completo, integração em CI para repos hospedados fora do GitHub (GitLab, Bitbucket, self-hosted). Para máxima cobertura: gitleaks no pre-commit + gitleaks no CI + GitHub Secret Scanning.',
        level: 'pleno',
      },
      {
        q: 'Como você configuraria um pipeline de secrets scanning em uma organização com 50 repositórios?',
        a: 'Três camadas: (1) pre-commit hook com gitleaks em template de hook compartilhado — novo dev clona e já tem o hook (usando core.hooksPath apontando para um diretório versionado); (2) GitHub Actions workflow reutilizável (reusable workflow) com gitleaks que todos os repositórios chamam em seus CI — centraliza a versão e configuração; (3) GitHub Advanced Security / GitHub Secret Scanning ativo na organização toda (alert automático para mantenedores). Para segredos customizados: repositório central de .gitleaks.toml que todos os repositórios incluem via extends. Métricas: dashboard de findings por repositório, SLA de 24h para revogar segredos críticos encontrados.',
        level: 'senior',
      },
    ],
    gotchas: [
      'Falsos positivos são comuns em código de exemplo, testes e documentação — configure allowlist por path para não criar alert fatigue no time.',
      'Gitleaks no CI com --no-git mode pode varrer arquivos standalone — útil para detectar segredos em arquivos de configuração que não são commitados mas estão no workspace do CI.',
      'Mesmo com gitleaks instalado, desenvolvedores podem usar git commit --no-verify para pular o pre-commit hook — controlar isso no CI é a camada de garantia final.',
      'Scanner de segredos baseado em regex tem falsos negativos para segredos customizados ou ofuscados — é uma camada de defesa, não uma garantia absoluta.',
    ],
    resources: [
      { title: 'Gitleaks — Documentação e GitHub', url: 'https://github.com/gitleaks/gitleaks', kind: 'docs' },
      { title: 'pre-commit framework', url: 'https://pre-commit.com/', kind: 'pratica' },
    ],
  },

}

export default sec
