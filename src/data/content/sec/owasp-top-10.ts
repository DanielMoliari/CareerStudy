import type { SkillContent } from '@/types'

const owaspTop10: SkillContent = {
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
  }

export default owaspTop10
