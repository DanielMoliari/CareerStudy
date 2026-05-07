import type { SkillContent } from '@/types'

const owaspTop10: SkillContent = {
    tagline: 'As 10 vulnerabilidades mais críticas de aplicações web — guia de referência para defesa e code review.',
    why: 'O OWASP Top 10 é a linguagem comum de segurança de aplicações. Entrevistas de backend e fullstack sênior cobram isso diretamente — e mais importante: as falhas listadas aparecem em produção toda semana. Saber nomear, reconhecer e mitigar cada categoria é pré-requisito para qualquer dev que cuida de dados de usuários.',
    prerequisite: 'HTTP/REST básico, conceitos de autenticação (cookies, JWT, sessões), banco de dados relacional, modelo cliente-servidor. Não precisa de conhecimento prévio de segurança ofensiva — o foco aqui é defesa.',
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
      {
        title: 'SQL Injection — anatomia de um ataque clássico',
        html: `<style>
.sqli-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.sqli-h{font-size:12px;font-weight:700;color:#ef4444;margin:0 0 3px}
.sqli-sub{font-size:10px;color:#475569;margin:0 0 14px}
.sqli-step{background:#1e293b;border-left:3px solid #ef4444;border-radius:6px;padding:10px 13px;margin-bottom:8px}
.sqli-step-title{font-size:11px;font-weight:700;color:#ef4444;margin-bottom:4px}
.sqli-step-body{font-size:9.5px;color:#94a3b8;line-height:1.6}
.sqli-code{font-family:'JetBrains Mono',monospace;font-size:9.5px;background:#020617;border:1px solid #334155;border-radius:4px;padding:6px 9px;margin-top:5px;color:#fbbf24;overflow-x:auto;white-space:pre}
.sqli-good{border-left-color:#22c55e}
.sqli-good .sqli-step-title{color:#22c55e}
.sqli-good .sqli-code{color:#86efac}
</style>
<div class="sqli-wrap">
  <p class="sqli-h">SQL Injection — fluxo passo a passo</p>
  <p class="sqli-sub">Como input do usuário vira execução de SQL arbitrário</p>

  <div class="sqli-step">
    <div class="sqli-step-title">1. Input malicioso do atacante</div>
    <div class="sqli-step-body">Em vez de digitar email normal, atacante envia payload com sintaxe SQL.</div>
    <div class="sqli-code">email = "x' OR '1'='1' --"</div>
  </div>

  <div class="sqli-step">
    <div class="sqli-step-title">2. Código vulnerável concatena na query</div>
    <div class="sqli-step-body">String literal mistura código (SQL) com dados (input). O parser do banco interpreta tudo como SQL.</div>
    <div class="sqli-code">// Codigo vulneravel
const q = "SELECT * FROM users WHERE email = '" + email + "'"
// Resulta em:
// SELECT * FROM users WHERE email = 'x' OR '1'='1' --'</div>
  </div>

  <div class="sqli-step">
    <div class="sqli-step-title">3. Banco executa SQL injetado</div>
    <div class="sqli-step-body">A condição "OR '1'='1'" sempre verdadeira faz com que retorne TODOS os usuários. O "--" comenta o resto da query, eliminando aspas restantes.</div>
    <div class="sqli-code">-- O banco ve:
SELECT * FROM users WHERE email = 'x' OR '1'='1'
-- Resultado: TODOS os usuarios. Bypass de autenticacao.</div>
  </div>

  <div class="sqli-step">
    <div class="sqli-step-title">4. Variantes mais perigosas</div>
    <div class="sqli-step-body">Blind SQLi (sem retornar dados, exfiltra via tempo); UNION SELECT (extrai colunas de outras tabelas); DROP TABLE; comando OS via xp_cmdshell.</div>
    <div class="sqli-code">// UNION para extrair senhas
email = "x' UNION SELECT password,2,3 FROM users--"

// Time-based blind: 5s de delay = condicao verdadeira
email = "x' AND IF(SUBSTR(password,1,1)='a', SLEEP(5), 0)--"</div>
  </div>

  <div class="sqli-step sqli-good">
    <div class="sqli-step-title">SOLUCAO: Prepared Statement</div>
    <div class="sqli-step-body">O banco recebe o template compilado primeiro, depois os valores como parametros. Os valores nunca sao interpretados como SQL — sao tratados como strings literais.</div>
    <div class="sqli-code">// Codigo seguro com prepared statement (PostgreSQL)
const q = 'SELECT * FROM users WHERE email = $1'
const { rows } = await pool.query(q, [email])

// Mesmo input "x' OR '1'='1'" sera tratado como string literal:
// procura email = "x' OR '1'='1'" — nao encontra nada.
// Banco e codigo separados — injecao impossivel.</div>
  </div>

  <div class="sqli-step sqli-good">
    <div class="sqli-step-title">SOLUCAO: ORM com parametrizacao automatica</div>
    <div class="sqli-step-body">ORMs modernos (Prisma, TypeORM, Drizzle) usam prepared statements internamente. Mas cuidado com raw queries e template literals!</div>
    <div class="sqli-code">// Prisma — automaticamente seguro
const user = await prisma.user.findUnique({
  where: { email: req.body.email }
})

// CUIDADO: $queryRawUnsafe ainda e vulneravel se concatenar
// USE: $queryRaw com tagged template — seguro
const result = await prisma.$queryRaw\`
  SELECT * FROM users WHERE email = \${email}
\`</div>
  </div>
</div>`,
        caption: 'Toda string concatenada com input do usuario em uma query e uma janela aberta. Prepared statements separam codigo de dados — a unica defesa real.',
      },
      {
        title: 'IDOR (Insecure Direct Object Reference) — verificacao de ownership',
        html: `<style>
.idor-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.idor-h{font-size:12px;font-weight:700;color:#ef4444;margin:0 0 3px}
.idor-sub{font-size:10px;color:#475569;margin:0 0 14px}
.idor-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px}
.idor-card{background:#1e293b;border-radius:8px;padding:11px 13px;border:1px solid #334155}
.idor-card-bad{border-color:rgba(239,68,68,.4)}
.idor-card-good{border-color:rgba(34,197,94,.4)}
.idor-title{font-size:11px;font-weight:700;margin-bottom:6px}
.idor-bad{color:#ef4444}
.idor-good{color:#22c55e}
.idor-code{font-family:'JetBrains Mono',monospace;font-size:9.5px;background:#020617;border-radius:4px;padding:8px 10px;color:#94a3b8;line-height:1.6;overflow-x:auto;white-space:pre}
.idor-flow{background:#1e293b;border-radius:8px;padding:12px;margin-top:10px;font-size:10px;color:#94a3b8;line-height:1.7}
.idor-flow strong{color:#ef4444}
.idor-flow .ok{color:#22c55e}
</style>
<div class="idor-wrap">
  <p class="idor-h">IDOR — Insecure Direct Object Reference</p>
  <p class="idor-sub">A vulnerabilidade #1 mais comum de acesso. Verificar ownership e mandatorio.</p>

  <div class="idor-grid">
    <div class="idor-card idor-card-bad">
      <div class="idor-title idor-bad">VULNERAVEL — sem ownership check</div>
      <div class="idor-code">// GET /api/orders/:id
app.get('/api/orders/:id', auth, async (req, res) =&gt; {
  const order = await Order.findById(req.params.id)
  // BUG: nao verifica se order.userId === req.user.id
  res.json(order)
})

// User A logado, request GET /api/orders/777
// Ordem 777 pertence a User B
// API retorna ordem de B para A — VAZAMENTO</div>
    </div>

    <div class="idor-card idor-card-good">
      <div class="idor-title idor-good">SEGURO — ownership check</div>
      <div class="idor-code">// GET /api/orders/:id
app.get('/api/orders/:id', auth, async (req, res) =&gt; {
  const order = await Order.findById(req.params.id)
  if (!order) return res.status(404).end()
  if (order.userId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' })
  }
  res.json(order)
})

// Ainda melhor: filtrar no proprio query
const order = await Order.findOne({
  where: { id: req.params.id, userId: req.user.id }
})</div>
    </div>
  </div>

  <div class="idor-flow">
    <strong>Por que UUIDs nao resolvem:</strong> trocar IDs sequenciais (1, 2, 3...) por UUIDs (550e8400-e29b-...) <em>dificulta</em> a enumeracao mas nao previne o ataque. Se o atacante descobrir um UUID valido (logs, URLs compartilhadas, leaks), o acesso ainda funciona. <span class="ok">A unica defesa real e a verificacao server-side de ownership.</span><br><br>
    <strong>Multi-tenant:</strong> em SaaS multi-tenant, ownership tem 2 niveis: <em>tenant</em> + <em>usuario</em>. User A do tenant 1 nao pode acessar recursos do tenant 2 mesmo que o user_id se repita. <span class="ok">Use Row-Level Security (RLS) do PostgreSQL: SET app.current_tenant_id = X — o banco rejeita cross-tenant antes do codigo.</span>
  </div>
</div>`,
        caption: 'IDOR e a manifestacao mais frequente de A01 Broken Access Control. Sempre verifique server-side: o usuario logado e dono deste recurso?',
      },
      {
        title: 'Defense in Depth — camadas de seguranca',
        html: `<style>
.def-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.def-h{font-size:12px;font-weight:700;color:#ef4444;margin:0 0 3px}
.def-sub{font-size:10px;color:#475569;margin:0 0 14px}
.def-layers{display:flex;flex-direction:column;gap:6px}
.def-layer{display:flex;gap:10px;background:#1e293b;border-radius:8px;padding:10px 13px;align-items:center;border-left:3px solid #ef4444}
.def-num{font-family:'JetBrains Mono',monospace;font-size:14px;font-weight:700;color:#ef4444;min-width:24px}
.def-info{flex:1}
.def-name{font-size:11px;font-weight:700;color:#e2e8f0;margin-bottom:3px}
.def-desc{font-size:9.5px;color:#94a3b8;line-height:1.55}
.def-tools{font-family:'JetBrains Mono',monospace;font-size:8.5px;color:#fbbf24;margin-top:4px}
</style>
<div class="def-wrap">
  <p class="def-h">Defense in Depth — multi-camadas</p>
  <p class="def-sub">Cada camada captura ataques que escaparam da anterior. Falha em uma camada nao compromete o sistema.</p>

  <div class="def-layers">
    <div class="def-layer">
      <div class="def-num">01</div>
      <div class="def-info">
        <div class="def-name">Network — Firewall, WAF, DDoS protection</div>
        <div class="def-desc">Bloqueia trafego malicioso antes de chegar a aplicacao. WAF detecta SQLi/XSS por assinatura. Rate limit no edge.</div>
        <div class="def-tools">Cloudflare WAF · AWS Shield · Nginx rate_limit</div>
      </div>
    </div>
    <div class="def-layer">
      <div class="def-num">02</div>
      <div class="def-info">
        <div class="def-name">Transport — TLS, HSTS, mTLS</div>
        <div class="def-desc">Tudo em HTTPS com TLS 1.3. HSTS para forcar sempre HTTPS. mTLS para servico-a-servico. Certificate pinning em apps mobile.</div>
        <div class="def-tools">Strict-Transport-Security · Let's Encrypt · ACM</div>
      </div>
    </div>
    <div class="def-layer">
      <div class="def-num">03</div>
      <div class="def-info">
        <div class="def-name">Authentication — MFA, secure session, password hashing</div>
        <div class="def-desc">MFA obrigatorio para admins. Argon2/bcrypt rounds altos para senhas. Sessoes httpOnly + Secure + SameSite=Strict.</div>
        <div class="def-tools">Auth0 · WebAuthn · bcrypt 12+ rounds</div>
      </div>
    </div>
    <div class="def-layer">
      <div class="def-num">04</div>
      <div class="def-info">
        <div class="def-name">Authorization — RBAC, ABAC, ownership checks</div>
        <div class="def-desc">Toda operacao em recurso verifica role + ownership. RLS no banco delega ao Postgres. Policy engines (OPA, Casbin).</div>
        <div class="def-tools">Postgres RLS · Casbin · Open Policy Agent</div>
      </div>
    </div>
    <div class="def-layer">
      <div class="def-num">05</div>
      <div class="def-info">
        <div class="def-name">Input validation — Zod, allowlist, sanitization</div>
        <div class="def-desc">Validar shape + tipo + range em TODA entrada. Allowlist e mais seguro que blocklist. Nunca confiar em input do cliente.</div>
        <div class="def-tools">Zod · Joi · class-validator · DOMPurify</div>
      </div>
    </div>
    <div class="def-layer">
      <div class="def-num">06</div>
      <div class="def-info">
        <div class="def-name">Output encoding — XSS prevention, CSP</div>
        <div class="def-desc">Escape HTML em outputs. CSP com nonces para mitigar XSS residual. Content-Type explicito (X-Content-Type-Options: nosniff).</div>
        <div class="def-tools">Content-Security-Policy · helmet · DOMPurify</div>
      </div>
    </div>
    <div class="def-layer">
      <div class="def-num">07</div>
      <div class="def-info">
        <div class="def-name">Database — Prepared statements, least privilege, encryption at rest</div>
        <div class="def-desc">SEMPRE prepared statements. User do app nao tem DROP/ALTER. Backups e dados sensiveis encriptados (AES-256).</div>
        <div class="def-tools">pgcrypto · TDE · IAM database auth</div>
      </div>
    </div>
    <div class="def-layer">
      <div class="def-num">08</div>
      <div class="def-info">
        <div class="def-name">Logging & Monitoring — SIEM, alertas, anomaly detection</div>
        <div class="def-desc">Log estruturado de eventos de seguranca. Alertas para padroes suspeitos (50 logins falhos/min). Retencao de logs por 90+ dias.</div>
        <div class="def-tools">Datadog · ELK · Splunk · Sentry</div>
      </div>
    </div>
  </div>
</div>`,
        caption: 'Nenhuma camada e perfeita sozinha. Um ataque que passe pelo WAF deve ainda ser barrado por validacao server-side. Cada camada e oportunidade de detectar e responder.',
      },
    ],
    cheatsheet: {
      title: 'Cheatsheet — OWASP Top 10 (2021): defesas por categoria',
      html: `<style>
.ow-cs-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.ow-cs-h{font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:700;color:#ef4444;margin:0 0 3px}
.ow-cs-sub{font-family:'Space Grotesk',sans-serif;font-size:10px;color:#475569;margin:0 0 14px}
.ow-cs-table{width:100%;border-collapse:collapse;font-size:9.5px;font-family:'Space Grotesk',sans-serif}
.ow-cs-table th{background:#1e293b;color:#94a3b8;padding:7px 9px;text-align:left;font-weight:700;border-bottom:2px solid #334155;font-size:9px;text-transform:uppercase;letter-spacing:.06em}
.ow-cs-table td{padding:8px 9px;border-bottom:1px solid #1e293b;color:#94a3b8;line-height:1.55;vertical-align:top}
.ow-cs-cat{font-weight:700;color:#ef4444;font-family:'JetBrains Mono',monospace;white-space:nowrap}
.ow-cs-name{font-weight:700;color:#e2e8f0}
.ow-cs-mit{font-family:'JetBrains Mono',monospace;font-size:9px;color:#86efac}
.ow-cs-rules{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px}
.ow-cs-card{background:#1e293b;border:1px solid #334155;border-radius:7px;padding:9px 11px}
.ow-cs-ct{font-family:'Space Grotesk',sans-serif;font-size:10px;font-weight:600;color:#ef4444;margin-bottom:4px}
.ow-cs-body{font-size:9.5px;color:#94a3b8;line-height:1.7;font-family:'Space Grotesk',sans-serif}
.ow-cs-rule{background:#ef444410;border:1px solid #ef444430;border-radius:5px;padding:6px 10px;font-family:'Space Grotesk',sans-serif;font-size:10px;color:#ef4444;margin-bottom:5px;line-height:1.5}
.ow-cs-sec{margin-bottom:14px}
.ow-cs-sec-title{font-family:'Space Grotesk',sans-serif;font-size:10px;font-weight:700;color:#ef4444;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px;padding-bottom:4px;border-bottom:1px solid #1e293b}
</style>
<div class="ow-cs-wrap">
  <p class="ow-cs-h">Cheatsheet — OWASP Top 10 2021</p>
  <p class="ow-cs-sub">Categoria, vetor de ataque tipico, mitigacao central</p>

  <div class="ow-cs-sec">
    <div class="ow-cs-sec-title">As 10 categorias e mitigacoes</div>
    <table class="ow-cs-table">
      <thead><tr><th>Cat</th><th>Nome</th><th>Vetor</th><th>Mitigacao central</th></tr></thead>
      <tbody>
        <tr><td class="ow-cs-cat">A01</td><td class="ow-cs-name">Broken Access Control</td><td>IDOR, escalada de privilegio, manipulacao de URL/JWT</td><td class="ow-cs-mit">Ownership check server-side em TODA op com ID</td></tr>
        <tr><td class="ow-cs-cat">A02</td><td class="ow-cs-name">Cryptographic Failures</td><td>MD5/SHA1, plaintext, TLS desativado, chave hardcoded</td><td class="ow-cs-mit">bcrypt/argon2 rounds 12+ · TLS 1.3 · Vault para secrets</td></tr>
        <tr><td class="ow-cs-cat">A03</td><td class="ow-cs-name">Injection</td><td>SQLi, NoSQLi, OS command, LDAP, XSS</td><td class="ow-cs-mit">Prepared statements · ORM · Zod validation · output encoding</td></tr>
        <tr><td class="ow-cs-cat">A04</td><td class="ow-cs-name">Insecure Design</td><td>Falha de logica, fluxo abusavel, rate limit ausente</td><td class="ow-cs-mit">Threat modeling (STRIDE) antes de codar · security review</td></tr>
        <tr><td class="ow-cs-cat">A05</td><td class="ow-cs-name">Security Misconfiguration</td><td>S3 publico, default creds, debug em prod, headers ausentes</td><td class="ow-cs-mit">helmet.js · IaC com baseline · security headers · principle of least privilege</td></tr>
        <tr><td class="ow-cs-cat">A06</td><td class="ow-cs-name">Vulnerable Components</td><td>npm/docker com CVE, Log4Shell, frameworks EOL</td><td class="ow-cs-mit">Snyk/Dependabot · npm audit · trivy scan · update policy</td></tr>
        <tr><td class="ow-cs-cat">A07</td><td class="ow-cs-name">Auth Failures</td><td>Credential stuffing, JWT alg:none, sessao infinita, sem MFA</td><td class="ow-cs-mit">JWT RS256 · MFA · rate limit /login · Argon2 · session expiration</td></tr>
        <tr><td class="ow-cs-cat">A08</td><td class="ow-cs-name">Integrity Failures</td><td>Deserializacao insegura, CI/CD sem verificacao, supply chain</td><td class="ow-cs-mit">Lock files · SLSA · package-lock integrity · signed releases · SBOM</td></tr>
        <tr><td class="ow-cs-cat">A09</td><td class="ow-cs-name">Logging Failures</td><td>Sem logs de auth, sem alertas, retencao curta</td><td class="ow-cs-mit">Logar login attempts, 4xx/5xx, mudancas de permissao · SIEM · 90d retencao</td></tr>
        <tr><td class="ow-cs-cat">A10</td><td class="ow-cs-name">SSRF</td><td>Webhook URL, fetch externo sem validar, metadados cloud</td><td class="ow-cs-mit">Allowlist de dominios · bloquear IPs privados · IMDSv2 · sem redirect</td></tr>
      </tbody>
    </table>
  </div>

  <div class="ow-cs-sec">
    <div class="ow-cs-sec-title">Regras de ouro de seguranca</div>
    <div class="ow-cs-rule">Nunca confie em input do cliente — valide TUDO server-side</div>
    <div class="ow-cs-rule">Authentication != Authorization — verificar AMBAS em cada operacao</div>
    <div class="ow-cs-rule">Default deny — explicitamente permitir, nao bloquear</div>
    <div class="ow-cs-rule">Principle of Least Privilege — minimum necessary access</div>
    <div class="ow-cs-rule">Defense in depth — multiplas camadas independentes</div>
    <div class="ow-cs-rule">Fail securely — erro nunca expoe stack trace ou dado interno</div>
  </div>

  <div class="ow-cs-sec">
    <div class="ow-cs-sec-title">Headers de seguranca essenciais</div>
    <div class="ow-cs-rules">
      <div class="ow-cs-card">
        <div class="ow-cs-ct">Strict-Transport-Security (HSTS)</div>
        <div class="ow-cs-body">Forca HTTPS por max-age. Inclua includeSubDomains. preload= so apos teste.<br><code style="color:#fbbf24">max-age=31536000; includeSubDomains</code></div>
      </div>
      <div class="ow-cs-card">
        <div class="ow-cs-ct">Content-Security-Policy</div>
        <div class="ow-cs-body">Mitiga XSS especificando origens permitidas. Use nonces, evite unsafe-inline.<br><code style="color:#fbbf24">default-src 'self'; script-src 'self' 'nonce-XYZ'</code></div>
      </div>
      <div class="ow-cs-card">
        <div class="ow-cs-ct">X-Content-Type-Options</div>
        <div class="ow-cs-body">Impede MIME sniffing — browser respeita Content-Type informado.<br><code style="color:#fbbf24">nosniff</code></div>
      </div>
      <div class="ow-cs-card">
        <div class="ow-cs-ct">X-Frame-Options / frame-ancestors</div>
        <div class="ow-cs-body">Anti-clickjacking. CSP frame-ancestors substitui o header antigo.<br><code style="color:#fbbf24">frame-ancestors 'none'</code></div>
      </div>
      <div class="ow-cs-card">
        <div class="ow-cs-ct">Referrer-Policy</div>
        <div class="ow-cs-body">Controla quanto da URL de origem e enviada. Reduz vazamento de tokens em URLs.<br><code style="color:#fbbf24">strict-origin-when-cross-origin</code></div>
      </div>
      <div class="ow-cs-card">
        <div class="ow-cs-ct">Permissions-Policy</div>
        <div class="ow-cs-body">Desabilita features sensiveis (camera, mic, geolocation) que o app nao usa.<br><code style="color:#fbbf24">camera=(), microphone=()</code></div>
      </div>
    </div>
  </div>
</div>`,
    },
    mindmap: {
      title: 'Mindmap OWASP Top 10 — atacantes, vetores e defesas',
      html: `<style>
.ow-mm-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.ow-mm-h{font-size:12px;font-weight:700;color:#ef4444;margin:0 0 3px}
.ow-mm-sub{font-size:10px;color:#475569;margin:0 0 16px}
.ow-mm-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.ow-mm-block{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:11px 13px}
.ow-mm-bt{font-size:11px;font-weight:700;color:#ef4444;margin-bottom:6px;padding-bottom:5px;border-bottom:1px solid #ef444440}
.ow-mm-list{font-size:9.5px;color:#94a3b8;line-height:1.8;list-style:none;padding:0;margin:0}
.ow-mm-list li{padding-left:14px;position:relative}
.ow-mm-list li::before{content:'▸';color:#ef4444;position:absolute;left:0}
.ow-mm-tag{display:inline-block;font-family:'JetBrains Mono',monospace;font-size:8.5px;background:#ef444415;color:#ef4444;padding:1px 6px;border-radius:3px;margin-left:5px}
</style>
<div class="ow-mm-wrap">
  <p class="ow-mm-h">Mindmap OWASP Top 10 2021</p>
  <p class="ow-mm-sub">Categorias, atacantes, ferramentas de detecao e ferramentas de defesa</p>
  <div class="ow-mm-grid">
    <div class="ow-mm-block">
      <div class="ow-mm-bt">A01 Broken Access Control</div>
      <ul class="ow-mm-list">
        <li>IDOR (objeto de outro usuario) <span class="ow-mm-tag">tipo</span></li>
        <li>Escalada vertical (user -&gt; admin)</li>
        <li>Escalada horizontal (entre users)</li>
        <li>Path traversal (../etc/passwd)</li>
        <li>Detecao: Burp Intruder, manual</li>
        <li>Defesa: ownership check server-side</li>
      </ul>
    </div>
    <div class="ow-mm-block">
      <div class="ow-mm-bt">A02 Cryptographic Failures</div>
      <ul class="ow-mm-list">
        <li>MD5/SHA1 para senhas</li>
        <li>TLS desativado ou TLS 1.0/1.1</li>
        <li>Chaves hardcoded em codigo</li>
        <li>IV previsivel/reutilizado</li>
        <li>Detecao: testssl.sh, gitleaks</li>
        <li>Defesa: bcrypt/argon2, AWS KMS, Vault</li>
      </ul>
    </div>
    <div class="ow-mm-block">
      <div class="ow-mm-bt">A03 Injection</div>
      <ul class="ow-mm-list">
        <li>SQL Injection (classic, blind, union) <span class="ow-mm-tag">comum</span></li>
        <li>NoSQL Injection ($where, regex)</li>
        <li>Command Injection (exec, eval)</li>
        <li>LDAP, XXE, SSTI, XPath</li>
        <li>XSS (reflected, stored, DOM)</li>
        <li>Defesa: prepared statements, ORMs, escape</li>
      </ul>
    </div>
    <div class="ow-mm-block">
      <div class="ow-mm-bt">A04 Insecure Design</div>
      <ul class="ow-mm-list">
        <li>Falta de threat modeling pre-dev</li>
        <li>Logica de negocio abusavel</li>
        <li>Rate limiting ausente no design</li>
        <li>Recovery flow vaza emails existentes</li>
        <li>Detecao: revisao de design, abuse cases</li>
        <li>Defesa: STRIDE, security stories</li>
      </ul>
    </div>
    <div class="ow-mm-block">
      <div class="ow-mm-bt">A05 Security Misconfiguration</div>
      <ul class="ow-mm-list">
        <li>S3 buckets publicos por engano</li>
        <li>Debug em producao</li>
        <li>Default credentials nao trocadas</li>
        <li>Headers de seguranca ausentes</li>
        <li>Detecao: nuclei, nmap, OWASP ZAP</li>
        <li>Defesa: helmet, IaC com baseline</li>
      </ul>
    </div>
    <div class="ow-mm-block">
      <div class="ow-mm-bt">A06 Vulnerable Components</div>
      <ul class="ow-mm-list">
        <li>npm packages com CVEs</li>
        <li>Imagens Docker outdated</li>
        <li>Frameworks EOL (sem patches)</li>
        <li>Log4Shell (CVE-2021-44228) <span class="ow-mm-tag">famoso</span></li>
        <li>Detecao: Snyk, Dependabot, trivy</li>
        <li>Defesa: SCA, lock files, update policy</li>
      </ul>
    </div>
    <div class="ow-mm-block">
      <div class="ow-mm-bt">A07 Auth Failures</div>
      <ul class="ow-mm-list">
        <li>Credential stuffing (sem rate limit)</li>
        <li>JWT alg:none ou HS256 fraco</li>
        <li>Session sem expiracao</li>
        <li>Senhas fracas aceitas</li>
        <li>Sem MFA para admins</li>
        <li>Defesa: MFA, rate limit, JWT RS256, Argon2</li>
      </ul>
    </div>
    <div class="ow-mm-block">
      <div class="ow-mm-bt">A08 Software & Data Integrity</div>
      <ul class="ow-mm-list">
        <li>Deserializacao insegura (Java, PHP, Python pickle)</li>
        <li>CI/CD sem verificacao de integridade</li>
        <li>Supply chain (event-stream npm 2018)</li>
        <li>Auto-update sem assinatura</li>
        <li>Defesa: SLSA, lock files, signed commits, SBOM</li>
      </ul>
    </div>
    <div class="ow-mm-block">
      <div class="ow-mm-bt">A09 Logging & Monitoring</div>
      <ul class="ow-mm-list">
        <li>Sem logs de eventos de auth</li>
        <li>Logs sem alertas (passa despercebido)</li>
        <li>Retencao curta &lt; 90 dias</li>
        <li>Logar PII/senhas (vazamento secundario)</li>
        <li>Defesa: SIEM, structured logs, anomaly detection</li>
      </ul>
    </div>
    <div class="ow-mm-block">
      <div class="ow-mm-bt">A10 SSRF</div>
      <ul class="ow-mm-list">
        <li>Webhook URLs fornecidas pelo user</li>
        <li>Import de arquivo por URL</li>
        <li>Preview de link / metadata extractor</li>
        <li>Cloud metadata (169.254.169.254)</li>
        <li>DNS rebinding bypass de allowlist</li>
        <li>Defesa: allowlist + bloqueio IP privado + IMDSv2</li>
      </ul>
    </div>
    <div class="ow-mm-block">
      <div class="ow-mm-bt">Ferramentas de defesa</div>
      <ul class="ow-mm-list">
        <li>SAST: Semgrep, SonarQube, CodeQL</li>
        <li>DAST: OWASP ZAP, Burp Suite</li>
        <li>SCA: Snyk, Dependabot, trivy</li>
        <li>Secrets: Vault, AWS Secrets Manager</li>
        <li>WAF: Cloudflare, AWS WAF, ModSecurity</li>
        <li>SIEM: Datadog, Splunk, ELK</li>
      </ul>
    </div>
    <div class="ow-mm-block">
      <div class="ow-mm-bt">Princípios de seguranca</div>
      <ul class="ow-mm-list">
        <li>Defense in depth (multi-camadas)</li>
        <li>Least privilege (acesso minimo)</li>
        <li>Default deny (whitelist &gt; blacklist)</li>
        <li>Fail securely (erros sem detalhes)</li>
        <li>Separation of duties</li>
        <li>Threat modeling antes de codar (STRIDE)</li>
      </ul>
    </div>
  </div>
</div>`,
      caption: 'Use este mindmap para revisao pre-entrevista: cada bloco cobre uma das 10 categorias mais ferramentas e principios.',
    },
    gotchas: [
      'Negar acesso no frontend (esconder botão, rota) não é controle de acesso — sempre validar no servidor.',
      'UUIDs no lugar de IDs sequenciais dificultam IDOR mas não substituem verificação de permissão server-side.',
      'JWT com algorithm: none ou sem verificar a assinatura (jwt.decode() em vez de jwt.verify()) é autenticação falsa.',
      'Stack traces em respostas de erro em produção são information disclosure — nunca expor.',
      'CORS mal configurado (Access-Control-Allow-Origin: *) não causa CSRF diretamente, mas permite que origens arbitrárias leiam respostas — entender a diferença é essencial.',
      'Rate limiting só no frontend é bypassável em segundos — deve ser server-side e por IP + por usuário.',
      'localStorage não é lugar para tokens — vulnerável a XSS. Use httpOnly cookies com SameSite=Strict.',
      'Validação só com regex pode ser bypassed — use Zod/Joi/class-validator que validam shape + tipo + range.',
      'bcrypt rounds &lt; 10 é insuficiente em 2024 — use 12+ para senhas. Argon2id é ainda melhor.',
      'Sanitizacao de output HTML com replace() manual quase sempre tem bypass — use DOMPurify.',
      'Confiar em headers como X-Forwarded-For sem validar — atacante pode forjar o header.',
      'Reusar o mesmo IV em AES-GCM rompe a confidencialidade — sempre gerar IV aleatorio por mensagem.',
    ],
    interview: [
      {
        q: 'O que é IDOR e como você previne?',
        a: '<p><strong>IDOR (Insecure Direct Object Reference)</strong> é quando a aplicação expõe referências internas (IDs numéricos sequenciais, slugs previsíveis) diretamente na URL ou body, e não verifica se o usuário logado tem permissão para aquele recurso.</p><p>Exemplo: <code>GET /api/orders/1234</code> retorna o pedido sem checar se pertence ao usuário da sessão.</p><p><strong>A prevenção</strong> é sempre verificar, no servidor, se <code>req.user.id</code> é dono do recurso buscado. Nunca confiar em IDs vindos do cliente. Usar UUIDs ajuda a dificultar adivinhação, mas não substitui a verificação de autorização.</p>',
        tip: 'Mencione que IDOR é a manifestação mais comum de Broken Access Control (A01) e que a validação deve ser server-side — nada no frontend previne isso.',
        level: 'pleno',
      },
      {
        q: 'Qual a diferença entre autenticação e autorização? Onde cada uma pode falhar?',
        a: '<p><strong>Autenticação</strong> responde "quem é você?" — verifica identidade (login, JWT, sessão). <strong>Autorização</strong> responde "o que você pode fazer?" — verifica permissões sobre recursos.</p><p><strong>Falhas de autenticação (A07)</strong>: JWT sem verificar assinatura, ausência de expiração de sessão, ausência de rate limiting em login, senhas fracas aceitas.</p><p><strong>Falhas de autorização (A01)</strong>: não checar se o usuário tem permissão para o recurso específico, checar permissão apenas no frontend, escalada de privilégio por manipulação de parâmetro.</p>',
        tip: 'Essa pergunta frequentemente vem com um cenário prático. Esteja pronto para identificar a falha numa URL hipotética.',
        level: 'pleno',
      },
      {
        q: 'O que é SQL Injection e por que prepared statements resolvem o problema?',
        a: '<p><strong>SQL Injection</strong> ocorre quando input do usuário é concatenado diretamente em uma query SQL, fazendo o banco interpretá-lo como código. Exemplo clássico: <code>WHERE email = \'${email}\'</code> — um email como <code>x\' OR 1=1--</code> transforma a query.</p><p><strong>Prepared statements</strong> resolvem porque separam o código SQL dos dados: o banco recebe o template compilado primeiro, depois os valores como parâmetros. Os parâmetros nunca são interpretados como SQL — são tratados como strings literais.</p><p>ORMs modernos (Prisma, TypeORM) usam prepared statements internamente, mas ainda é possível vulnerabilidades com raw queries mal usadas.</p>',
        tip: 'Se mencionar ORMs, o entrevistador pode perguntar sobre raw queries — esteja pronto para citar o risco de template literals com input não sanitizado mesmo dentro de um ORM.',
        level: 'pleno',
      },
      {
        q: 'Quais são os 3 principais tipos de SQL Injection?',
        a: '<p><strong>1. Classic / In-band</strong>: a aplicação retorna dados extraídos diretamente. Exemplo: <code>UNION SELECT username,password FROM users</code> — atacante vê a resposta.</p><p><strong>2. Blind</strong>: a aplicação não retorna dados, mas comportamento muda baseado em condições. Subtipos:</p><ul><li><strong>Boolean-based</strong>: páginas diferentes para condição true/false. Atacante extrai byte por byte.</li><li><strong>Time-based</strong>: <code>SLEEP(5)</code> se a condição for verdadeira. Atacante mede tempo de resposta.</li></ul><p><strong>3. Out-of-band</strong>: usa canais externos (DNS, HTTP) para exfiltrar dados. Útil quando blind é muito lento. Atacante força o servidor a fazer DNS lookup com dados extraídos no subdomínio.</p>',
        tip: 'Mencione blind time-based como o mais comum de detectar — basta um SLEEP() para confirmar. Ferramentas como sqlmap automatizam todos os tipos.',
        level: 'pleno',
      },
      {
        q: 'Como armazenar senhas corretamente em 2024?',
        a: '<p>Algoritmos de hash <strong>específicos para senhas</strong> com fator de trabalho ajustável:</p><ul><li><strong>Argon2id</strong> (recomendado RFC 9106): vencedor do PHC. Memory-hard (resiste a GPU/ASIC). Parâmetros: m=64MB, t=3, p=4.</li><li><strong>bcrypt</strong> (clássico, ainda OK): rounds 12+ em 2024 (era 10 há alguns anos). Limitação: 72 bytes de input máximo.</li><li><strong>scrypt</strong>: também memory-hard, padrão antes do Argon2.</li></ul><p><strong>Não use:</strong> MD5, SHA-1, SHA-256 (não tem custo configurável), PBKDF2 sem milhões de iterações.</p><p><strong>Sempre adicione:</strong></p><ul><li>Salt único por usuário (a maioria dos algos faz automaticamente)</li><li>Pepper (secret server-side adicionado antes do hash) — proteção extra contra dump do banco</li><li>Rate limiting em login para mitigar brute-force online</li></ul>',
        tip: 'Argon2id é o padrão moderno mas ainda raro em produção. Mencionar Argon2id mostra que está atualizado. bcrypt 12 rounds ainda é aceitável.',
        level: 'pleno',
      },
      {
        q: 'O que é SSRF e por que é especialmente perigoso em ambientes cloud?',
        a: '<p><strong>SSRF (Server-Side Request Forgery)</strong> permite ao atacante fazer o servidor realizar requisições HTTP a destinos arbitrários.</p><p>Em ambientes cloud (AWS, GCP, Azure), o endpoint de metadados de instância (<code>169.254.169.254</code> na AWS, GCP) retorna credenciais temporárias da role IAM da instância. Um atacante com SSRF pode extrair essas credenciais e assumir a role, obtendo acesso a toda a AWS do alvo.</p><p>A <strong>IMDSv2</strong> da AWS mitiga isso exigindo um token de sessão (request com PUT inicial), mas aplicações que constroem URLs a partir de input do usuário precisam de allowlist + bloqueio de IPs privados/link-local no nível da aplicação.</p><p><strong>Bypass comuns:</strong> DNS rebinding, redirects HTTP, IPv6 (<code>[::1]</code>), encoding de IP (<code>2130706433 = 127.0.0.1</code>), <code>0.0.0.0</code>.</p>',
        tip: 'Citar IMDSv2 e o endpoint 169.254.169.254 demonstra conhecimento aplicado a cloud — diferencial em entrevistas de backend/infra.',
        level: 'senior',
      },
      {
        q: 'Como você implementaria Content Security Policy (CSP) e qual problema ela resolve?',
        a: "<p><strong>CSP</strong> é um header HTTP que instrui o browser quais fontes de scripts, estilos, imagens e outros recursos são permitidos.</p><p>Resolve XSS mitigando a execução de scripts injetados — mesmo que o atacante consiga injetar uma tag <code>&lt;script&gt;</code>, o browser bloqueia se a origem não estiver na policy.</p><p>Uma CSP bem configurada usa <strong>nonces</strong> (valores aleatórios por request) em vez de <code>'unsafe-inline'</code>:</p><pre>res.setHeader('Content-Security-Policy', \"default-src 'self'; script-src 'self' 'nonce-XYZ'; style-src 'self' 'nonce-XYZ'; object-src 'none'; base-uri 'self';\")</pre><p>O <code>helmet.js</code> configura CSP com sensatos defaults. <strong>Importante:</strong> CSP é uma defesa em profundidade — não substitui sanitização server-side de output.</p>",
        tip: 'Mencionar que CSP é "defesa em profundidade" e não substitui sanitização server-side demonstra maturidade. XSS ainda é uma das falhas mais exploradas.',
        level: 'senior',
      },
      {
        q: 'O que é o princípio de "Insecure Design" (A04) e como threat modeling o previne?',
        a: '<p><strong>Insecure Design</strong> cobre falhas de segurança no design do sistema que nenhuma implementação perfeita resolve depois — são decisões arquiteturais que criam vetores de ataque intrinsecamente.</p><p><strong>Exemplos:</strong></p><ul><li>Fluxo de recuperação de senha que responde diferente para e-mails existentes vs. não existentes (revelando a base de usuários)</li><li>Ausência de rate limiting concebida no design (não apenas não implementada)</li><li>Lógica de negócio que permite comprar produto com quantidade negativa</li></ul><p><strong>Threat modeling</strong> usando <strong>STRIDE</strong> é feito antes de escrever código. Para cada componente, pergunta-se: quem pode abusar isso, com que vetor, com que impacto.</p><p><strong>STRIDE:</strong></p><ul><li><strong>S</strong>poofing — falsificação de identidade</li><li><strong>T</strong>ampering — modificação não autorizada</li><li><strong>R</strong>epudiation — negar uma ação</li><li><strong>I</strong>nformation Disclosure — vazamento de dados</li><li><strong>D</strong>enial of Service — indisponibilidade</li><li><strong>E</strong>levation of Privilege — ganhar permissões</li></ul><p>O resultado são requisitos de segurança que entram no design antes de qualquer linha de código.</p>',
        tip: 'STRIDE é o framework de threat modeling mais cobrado em entrevistas. Se souber DREAD (obsoleto mas ainda aparece), mencione que foi substituído por abordagens quantitativas mais robustas.',
        level: 'senior',
      },
      {
        q: 'Como implementar JWT de forma segura para evitar A07 (Broken Authentication)?',
        a: "<p><strong>Falhas comuns de JWT que causam A07:</strong></p><ul><li><code>alg: none</code>: algumas libs aceitam tokens sem assinatura — sempre rejeitar explicitamente</li><li>HS256 com secret fraco: vulnerável a brute-force offline. Use RS256 (assimétrico) em produção</li><li><strong>Algorithm confusion</strong>: ataque RS256→HS256 onde a chave pública vira \"secret\". Sempre fixar algoritmos aceitos</li><li>Sem verificação de <code>exp</code>: tokens nunca expiram</li><li>Refresh tokens sem rotação: cada uso deve gerar um novo refresh token e invalidar o anterior</li><li>Sem invalidação no logout: armazene tokens revogados (blocklist) ou use sessões server-side</li></ul><p><strong>Implementação segura:</strong></p><pre>const payload = jwt.verify(token, publicKey, { algorithms: ['RS256'], issuer: 'app.com', audience: 'api.app.com', maxAge: '15m' })</pre><ul><li>Access token: curta duração (15min), em memória ou httpOnly cookie</li><li>Refresh token: longa duração (7-30d), httpOnly cookie SameSite=Strict, rotação a cada uso</li><li>Família de tokens: detectar reuso de refresh revogado → invalidar toda a família</li></ul>",
        tip: 'Estruture em dois blocos: "o que não fazer" (alg: none, HS256 fraco, sem expiração) e "implementação correta" (RS256, access curto, refresh rotacionado, família de tokens).',
        level: 'senior',
      },
      {
        q: 'O que é CSRF e como SameSite cookies mitigam o ataque?',
        a: '<p><strong>CSRF (Cross-Site Request Forgery)</strong>: site malicioso faz o browser do usuário enviar requisições autenticadas para outro site onde ele está logado, abusando de cookies que o browser envia automaticamente.</p><p>Exemplo: usuário logado em <code>banco.com</code> visita <code>malicioso.com</code> que tem <code>&lt;form action="https://banco.com/transfer" method="POST"&gt;</code> com auto-submit. O browser envia o cookie de sessão automaticamente.</p><p><strong>Mitigações em camadas:</strong></p><ul><li><strong>SameSite cookies</strong>: <code>SameSite=Strict</code> bloqueia o envio de cookies em requests cross-site. <code>Lax</code> permite navegação top-level (default em browsers modernos)</li><li><strong>CSRF tokens</strong>: token aleatório por sessão, enviado em formulários e validado no servidor. Atacante não consegue ler porque está em outra origem</li><li><strong>Custom headers</strong>: APIs JSON exigem header customizado (ex: <code>X-Requested-With</code>) — não pode ser enviado cross-site sem CORS preflight</li><li><strong>Verificar Origin/Referer</strong>: rejeitar requests com Origin não esperado</li></ul><p>SameSite resolve a maioria dos casos modernos, mas defesa em profundidade exige tokens também.</p>',
        tip: 'Mencione que SameSite=Lax virou default em Chrome 80 (2020), reduzindo drasticamente CSRF. Mas ainda é necessário para old browsers e cross-subdomain.',
        level: 'pleno',
      },
      {
        q: 'O que é um ataque de Supply Chain e como o caso event-stream/SolarWinds ilustra o risco?',
        a: '<p><strong>Supply Chain Attack</strong>: comprometer um link da cadeia de fornecedores de software para atingir os usuários downstream.</p><p><strong>event-stream (npm, 2018)</strong>: o mantenedor original cedeu o pacote a um contribuidor desconhecido, que adicionou código malicioso para roubar wallets de Bitcoin de uma aplicação específica (Copay). Milhões de usuários foram afetados via dependência transitiva.</p><p><strong>SolarWinds Orion (2020)</strong>: atacantes (APT29) comprometeram o build server da SolarWinds, injetando backdoor no software de monitoramento usado por 18.000+ organizações, incluindo agências do governo dos EUA.</p><p><strong>Mitigações:</strong></p><ul><li><strong>Lock files</strong> + checksum verification (<code>npm ci</code>, <code>yarn --frozen-lockfile</code>)</li><li><strong>SCA tools</strong>: Snyk, Dependabot, npm audit detectam CVEs conhecidos</li><li><strong>SBOM</strong> (Software Bill of Materials): inventário completo de dependências, formato SPDX/CycloneDX</li><li><strong>SLSA framework</strong>: níveis de garantia de build integrity (Google)</li><li><strong>Signed commits</strong>: GPG/Sigstore para verificar autoria</li><li><strong>Reproducible builds</strong>: mesmo source = mesmo binário, em qualquer máquina</li><li><strong>Reduzir blast radius</strong>: dependências mínimas, audit de novos packages, evitar deps com 1 mantenedor</li></ul>',
        tip: 'Cite os dois eventos por nome — entrevistador valoriza memória factual. SLSA e SBOM são os termos mais "atuais" (2022+) que indicam estar acompanhando o estado da arte.',
        level: 'senior',
      },
      {
        q: 'Como configurar CORS de forma segura em uma API?',
        a: "<p>CORS mal configurado é uma das falhas de A05 (Security Misconfiguration) mais frequentes:</p><p><strong>Configurações inseguras comuns:</strong></p><ul><li><code>Access-Control-Allow-Origin: *</code> em endpoint autenticado — permite qualquer site fazer requests</li><li>Refletir o header <code>Origin</code> sem validação: <code>Access-Control-Allow-Origin: req.headers.origin</code> — equivale a permitir tudo</li><li><code>Access-Control-Allow-Credentials: true</code> com wildcard — rejeitado pelo browser mas indica má config</li></ul><p><strong>Configuração segura:</strong></p><pre>const ALLOWED = ['https://app.empresa.com', 'https://admin.empresa.com']; app.use((req, res, next) => { if (ALLOWED.includes(req.headers.origin)) { res.setHeader('Access-Control-Allow-Origin', req.headers.origin); res.setHeader('Access-Control-Allow-Credentials', 'true'); res.setHeader('Vary', 'Origin'); } next(); })</pre><p><strong>Pontos importantes:</strong></p><ul><li>Allowlist explícita — nunca refletir Origin sem validar</li><li>Header <code>Vary: Origin</code> para CDN/proxy não cachear errado</li><li>Methods e headers restritos ao necessário</li><li>Preflight cache razoável: <code>Access-Control-Max-Age: 86400</code></li><li>Ambiente de dev separado: nunca usar config de dev em produção</li></ul>",
        tip: 'Mostre o antipadrão de refletir o Origin sem validar — parece "dinâmico e seguro" mas equivale a Access-Control-Allow-Origin: *. É um erro muito comum em APIs Node.js com CORS npm.',
        level: 'pleno',
      },
      {
        q: 'O que é Hash Flooding Attack e como linguagens modernas mitigam?',
        a: '<p><strong>Hash flooding</strong> (algorithmic complexity attack): atacante envia inputs cuidadosamente escolhidos para fazer hash map degradar de O(1) amortizado para O(n) por colisões intencionais.</p><p><strong>Cenário:</strong> servidor web recebe POST com 1000 chaves no JSON. Se a hash function é determinística e conhecida (e.g., FNV-1a), atacante calcula 1000 chaves que colidem no mesmo bucket. Lookups viram lista ligada O(n) → DoS.</p><p><strong>CVE clássico</strong>: 2011, várias linguagens (PHP, Python, Java, Ruby) eram vulneráveis. Um POST malicioso de ~1MB causava 100% CPU por minutos.</p><p><strong>Mitigações modernas:</strong></p><ul><li><strong>Random hash seed</strong>: hash function recebe seed aleatório por processo. Atacante não pode pré-computar colisões. Implementado em Python 3.3+, Java 8+, Ruby 1.9+, JS V8.</li><li><strong>Treeify buckets</strong>: Java 8 HashMap converte buckets &gt; 8 itens para árvore (O(log n)) em vez de lista (O(n)).</li><li><strong>Limit input size</strong>: rejeitar JSONs com mais de N chaves antes de parsear.</li><li><strong>SipHash</strong>: hash function resistente a flooding mesmo com seed exposto.</li></ul>',
        tip: 'Hash flooding é exemplo perfeito de "complexidade na teoria != complexidade na prática com adversário". Mostra pensamento de seguranca + algoritmos juntos — diferencial sênior.',
        level: 'senior',
      },
      {
        q: 'Como você implementaria rate limiting eficaz em uma API?',
        a: "<p>Rate limiting em <strong>múltiplas camadas</strong>:</p><ul><li><strong>Por IP</strong>: proteção base contra IPs desconhecidos — mas bots usam proxies rotacionados</li><li><strong>Por usuário autenticado</strong>: limite por conta, independente de IP — detecta abuso por conta comprometida</li><li><strong>Por endpoint específico</strong>: <code>/login</code>, <code>/forgot-password</code>, <code>/send-otp</code> têm limites muito mais restritivos (5-10 req/15min) do que endpoints de leitura (100 req/min)</li></ul><p><strong>Algoritmos:</strong></p><ul><li><strong>Fixed window</strong>: simples mas permite burst no início de cada janela</li><li><strong>Sliding window</strong>: mais justo, sem burst</li><li><strong>Token bucket</strong>: permite bursts curtos com taxa média controlada</li><li><strong>Leaky bucket</strong>: garante taxa constante de saída</li></ul><p><strong>Implementação prática (Redis + token bucket):</strong></p><pre>async function rateLimit(key, max, windowSec) { const count = await redis.incr(key); if (count === 1) await redis.expire(key, windowSec); if (count > max) throw new TooManyRequests(); }</pre><p><strong>Headers padrão</strong> a retornar: <code>X-RateLimit-Limit</code>, <code>X-RateLimit-Remaining</code>, <code>X-RateLimit-Reset</code>, <code>Retry-After</code> (quando 429).</p>",
        tip: 'Mencione que rate limiting é defesa contra credential stuffing (A07). Combine com CAPTCHA/MFA após N falhas — abordagem em camadas.',
        level: 'pleno',
      },
      {
        q: 'Como auditar uma API existente contra o OWASP Top 10? Por onde começar?',
        a: '<p><strong>Framework de auditoria em 5 etapas:</strong></p><ol><li><strong>Inventário de endpoints</strong>: API spec (OpenAPI/Swagger), logs do API gateway, testes de enumeração. Detecta APIs zumbis.</li><li><strong>Teste de autenticação</strong>: cada endpoint acessível sem token? Tokens expiram? Logout invalida? (A07)</li><li><strong>Teste de Broken Access Control</strong>: com dois usuários, tentar acessar recursos um do outro em todos os endpoints com IDs (A01)</li><li><strong>Teste de Injection</strong>: payloads SQLi/XSS/SSRF em todos os campos de input (A03)</li><li><strong>Teste de Misconfiguration</strong>: headers de segurança, debug em prod, defaults (A05)</li></ol><p><strong>Ferramentas:</strong></p><ul><li><strong>Burp Suite Pro</strong> para interceptação e automação</li><li><strong>OWASP ZAP</strong> com OpenAPI plugin</li><li><strong>Semgrep</strong> com regras de OWASP para SAST</li><li><strong>Trivy</strong> para dependências vulneráveis</li><li><strong>nuclei</strong> para scan de misconfiguration</li></ul><p><strong>Prioridade de risco</strong>: começar pelos endpoints que expõem dados de múltiplos usuários (BOLA) e pelos endpoints de admin sem verificação de role — máximo impacto se explorados.</p>',
        tip: 'Mostre que auditoria tem sequência lógica: inventário → autenticação → autorização → injection → config. Mencione automação com CI/CD (Semgrep nos PRs).',
        level: 'senior',
      },
      {
        q: 'O que é XSS e quais são os 3 tipos? Como CSP mitiga cada um?',
        a: '<p><strong>XSS (Cross-Site Scripting)</strong>: injetar JavaScript que executa no browser de outros usuários, com privilégios da origem (cookies, localStorage, DOM).</p><p><strong>3 tipos:</strong></p><ul><li><strong>Reflected XSS</strong>: payload no request (URL, form), refletido na response sem sanitização. Vetor: link malicioso. Ex: <code>?search=&lt;script&gt;...&lt;/script&gt;</code></li><li><strong>Stored XSS</strong>: payload salvo no banco (comentário, perfil). Atinge todos os usuários que visualizam. Mais perigoso.</li><li><strong>DOM-based XSS</strong>: injeção feita pelo JavaScript do cliente, sem passar pelo servidor. Ex: <code>document.write(location.hash)</code></li></ul><p><strong>Como CSP mitiga:</strong></p><ul><li>CSP bloqueia execução de scripts inline: <code>script-src \'self\'</code> sem <code>\'unsafe-inline\'</code></li><li>Bloqueia scripts de origens externas não permitidas</li><li>Com <code>nonce</code>, só scripts marcados pelo servidor executam</li><li><code>strict-dynamic</code> permite scripts criados por scripts confiáveis (chains)</li></ul><p><strong>Defesa primária ainda é output encoding</strong>: escape HTML em outputs do servidor (<code>&amp;lt;</code> em vez de <code>&lt;</code>). CSP é defesa em profundidade.</p>',
        tip: 'O entrevistador pode pedir um exemplo de payload. Tenha algo simples: <code>&lt;img src=x onerror="fetch(\'/admin\')"&gt;</code>. Mostra que conhece além do alert().',
        level: 'pleno',
      },
      {
        q: 'Como prevenir XXE (XML External Entity)?',
        a: "<p><strong>XXE</strong>: parser XML processa entidades externas, permitindo:</p><ul><li>Ler arquivos do servidor: <code>&lt;!ENTITY xxe SYSTEM \"file:///etc/passwd\"&gt;</code></li><li>SSRF via XML: <code>&lt;!ENTITY xxe SYSTEM \"http://internal/admin\"&gt;</code></li><li>Billion laughs attack (DoS): entidades exponenciais</li></ul><p><strong>Prevenção (desabilitar entidades externas no parser):</strong></p><ul><li><strong>Java</strong>: <code>factory.setFeature('http://apache.org/xml/features/disallow-doctype-decl', true)</code></li><li><strong>Python</strong>: use <code>defusedxml.ElementTree</code> (recomendação oficial)</li><li><strong>PHP</strong>: <code>libxml_disable_entity_loader(true)</code></li><li><strong>Node.js</strong>: <code>libxmljs.parseXmlString(xml, { noent: false })</code></li></ul><p>Outros princípios:</p><ul><li><strong>Prefira JSON em vez de XML</strong> sempre que possível — JSON não tem entidades</li><li><strong>Whitelist de schemas</strong>: validar contra XSD restrito</li><li><strong>Limit de tamanho</strong>: rejeitar XML grande para mitigar billion laughs</li></ul><p>XXE caiu de A4 (2017) para subcategoria de A05 (2021) porque a maioria dos parsers modernos vem com entidades desabilitadas por padrão.</p>",
        tip: 'XXE não está mais entre os 10 isolados em 2021 — é parte de A05. Saber explicar isso (e mencionar defusedxml em Python) mostra atualização.',
        level: 'senior',
      },
      {
        q: 'O que são CWE e CVE? Qual a diferença e como você usa?',
        a: '<p><strong>CWE (Common Weakness Enumeration)</strong>: catálogo de <em>tipos</em> de fraqueza de segurança. Linguagem comum para classificar vulnerabilidades. Exemplo: CWE-89 = SQL Injection, CWE-79 = XSS, CWE-639 = IDOR.</p><p><strong>CVE (Common Vulnerabilities and Exposures)</strong>: identificador único de uma vulnerabilidade <em>específica</em> em um produto. Exemplo: CVE-2021-44228 = Log4Shell. Cada CVE referencia 1+ CWEs.</p><p><strong>Como usar:</strong></p><ul><li><strong>CWE</strong>: classificar bugs no SAST (Semgrep, SonarQube). Mapear para OWASP Top 10. Usar como linguagem em code review: "isso é CWE-89, vamos parametrizar"</li><li><strong>CVE</strong>: rastreamento de patches. Snyk/Dependabot avisam quando dep tem CVE conhecido. Score CVSS indica severidade (0-10)</li></ul><p><strong>OWASP Top 10 vs CWE Top 25:</strong></p><ul><li>OWASP Top 10: 10 categorias gerais de risco em apps web (alto nível)</li><li>CWE Top 25: 25 tipos específicos de bugs mais comuns (mais detalhado)</li><li>Use ambos: OWASP para discussão de risco, CWE para classificação técnica</li></ul>',
        tip: 'Saber a diferença entre CWE e CVE separa devs juniors de seniors. CVE mudou para "vulnerability" oficialmente em 2024 (mas a sigla ficou).',
        level: 'senior',
      },
      {
        q: 'Como implementar logging de segurança que detecta tentativas de exploração OWASP?',
        a: "<p>Logging de segurança serve dois propósitos: detecção em tempo real (SIEM) e forensics pós-incidente.</p><p><strong>O que logar por categoria OWASP:</strong></p><ul><li><strong>A01 (BOLA)</strong>: resposta 403 em endpoints de objeto — padrão de muitos 403 em sequência indica enumeração</li><li><strong>A03 (Injection)</strong>: payloads suspeitos rejeitados pela validação — <code>UNION SELECT</code>, <code>&lt;script</code>, <code>../</code></li><li><strong>A07 (Auth)</strong>: falhas de login por IP e por conta, uso de tokens expirados</li><li><strong>A05 (Misconfig)</strong>: requests para paths que não deveriam existir (<code>/admin</code>, <code>.env</code>, <code>/.git</code>)</li><li><strong>A10 (SSRF)</strong>: tentativas de acessar IPs privados rejeitadas pela allowlist</li></ul><p><strong>Formato estruturado</strong> (JSON exemplo): <code>{ ts, event: 'auth.login.failed', userId: null, email, ip, userAgent, reason: 'invalid_password', severity: 'warn' }</code></p><p><strong>O que NÃO logar (risco de vazamento):</strong></p><ul><li>Senhas, tokens, dados de cartão mesmo que \"mascarados\"</li><li>Stack traces completos em produção</li><li>PII desnecessário — logar user ID, não e-mail nem CPF</li></ul><p><strong>Alertas:</strong> 5+ logins falhos do mesmo IP em 60s; 50+ requests com payload SQLi-like; mudança de role para admin.</p>",
        tip: 'Mostre o padrão de detecção: um 403 em BOLA pode ser legítimo; 50 403s em 30 segundos com IDs sequenciais é claramente enumeração. O log é o que permite distinguir.',
        level: 'senior',
      },
      {
        q: 'O que é deserialização insegura e como mitigar?',
        a: '<p><strong>Deserialização insegura (A08)</strong>: aplicação aceita dados serializados do cliente e os deserializa sem validação. Em linguagens com format de serialização "rico" (Java, PHP, Python pickle), atacante pode injetar objetos que executam código durante a deserialização (gadget chains).</p><p><strong>Exemplos:</strong></p><ul><li><strong>Java</strong>: ObjectInputStream + classes vulneráveis (Apache Commons Collections) → RCE</li><li><strong>Python</strong>: <code>pickle.loads()</code> de input não confiável → RCE direto</li><li><strong>PHP</strong>: <code>unserialize()</code> com classes mágicas (__wakeup, __destruct) → RCE</li><li><strong>Node.js</strong>: <code>node-serialize</code> e similares — eval embutido</li></ul><p><strong>Casos famosos:</strong> Log4Shell (parcialmente), CVE-2017-9805 (Apache Struts → Equifax breach), JEP-290 (Java tentativa de mitigação).</p><p><strong>Mitigações:</strong></p><ul><li><strong>Não desserializar input não confiável</strong> — preferir formatos sem código (JSON, Protocol Buffers)</li><li><strong>Allowlist de classes</strong>: só permitir deserialização de tipos conhecidos</li><li><strong>HMAC ou assinatura</strong>: assinar payload no servidor; rejeitar se modificado</li><li><strong>Isolamento</strong>: deserialização em processo/container separado com permissões mínimas</li></ul>',
        tip: 'Em entrevista de Java/Python especificamente, conhecer pickle e ObjectInputStream é diferencial. Em Node.js, é menos comum mas vale citar JSON como mitigação natural.',
        level: 'senior',
      },
      {
        q: 'Como você gerenciaria secrets (chaves de API, credenciais de DB) em uma aplicação?',
        a: '<p><strong>O que NÃO fazer:</strong></p><ul><li>Hardcoded em código (descoberta via gitleaks, GitHub search)</li><li>Commitado em <code>.env</code> mesmo que git-ignored hoje (histórico permanece)</li><li>Em variáveis de ambiente expostas no <code>/proc/&lt;pid&gt;/environ</code> sem ACL</li><li>Em arquivos config plaintext no servidor</li></ul><p><strong>Estratégia em camadas:</strong></p><ul><li><strong>Secret manager dedicado</strong>: AWS Secrets Manager, HashiCorp Vault, GCP Secret Manager — busca em runtime, rotação automática</li><li><strong>IAM-based access</strong>: aplicação assume role da máquina/pod, sem chaves de API hardcoded (IRSA no EKS, Workload Identity no GKE)</li><li><strong>Encryption at rest</strong>: secrets sempre criptografados, KMS gerencia chave mestra</li><li><strong>Audit log</strong>: toda leitura de secret é logada (quem, quando, de onde)</li><li><strong>Rotação periódica</strong>: secrets longa duração rotacionados (DB passwords a cada 30d, API keys a cada 90d)</li><li><strong>Least privilege</strong>: cada serviço só lê os secrets que precisa</li></ul><p><strong>Detecção pré-commit:</strong></p><ul><li><code>gitleaks</code>, <code>truffleHog</code>: scan de histórico git</li><li>Pre-commit hooks bloqueiam commits com secrets</li><li>GitHub secret scanning: alerta automático se secret de provider conhecido vaza</li><li>Se um secret vazou: <strong>rotacionar imediatamente</strong>, não basta deletar do histórico</li></ul>',
        tip: 'Mencione o caso clássico de secret vazado: Uber 2016 (chave AWS no GitHub) — incidente que custou $148M. A rotação após vazamento é mais importante que esconder.',
        level: 'senior',
      },
    ],
    codeExamples: [
      {
        title: 'SQL Injection — vulnerável vs prepared statement vs ORM',
        language: 'typescript',
        code: `// === VULNERAVEL: concatenacao de string ===
// NUNCA faca isso — input do usuario vira parte do SQL.

import { Pool } from 'pg'
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function loginVulneravel(email: string, password: string) {
  // Atacante envia email = "admin' OR '1'='1' --"
  // Query final: SELECT * FROM users WHERE email = 'admin' OR '1'='1' --' AND password = '...'
  // O "--" comenta o resto. Retorna primeiro user. Bypass total.
  const q = \`SELECT * FROM users WHERE email = '\${email}' AND password = '\${password}'\`
  const { rows } = await pool.query(q)
  return rows[0]
}

// === SEGURO: Prepared Statement (PostgreSQL com pg) ===
// Os valores SAO PASSADOS SEPARADOS do template. O banco compila a query
// e depois aplica os valores como string literais — NUNCA como SQL.

async function loginSeguro(email: string, password: string) {
  const q = 'SELECT id, email, password_hash FROM users WHERE email = $1'
  const { rows } = await pool.query(q, [email])
  const user = rows[0]
  if (!user) return null

  // Verifica password com bcrypt — nunca comparar string direto
  const bcrypt = await import('bcrypt')
  const ok = await bcrypt.compare(password, user.password_hash)
  return ok ? user : null
}

// === SEGURO: ORM (Prisma) — automaticamente parametrizado ===
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function loginPrisma(email: string, password: string) {
  // Prisma usa prepared statements internamente — IMPOSSIVEL injetar
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return null

  const bcrypt = await import('bcrypt')
  const ok = await bcrypt.compare(password, user.passwordHash)
  return ok ? user : null
}

// === ATENCAO: Prisma raw queries ===
// $queryRawUnsafe AINDA e vulneravel se concatenar. Nunca use com input do user.

// VULNERAVEL:
// await prisma.$queryRawUnsafe(\`SELECT * FROM users WHERE email = '\${email}'\`)

// SEGURO: tagged template substitui parametros automaticamente
async function rawSeguro(email: string) {
  return prisma.$queryRaw\`SELECT * FROM users WHERE email = \${email}\`
}`,
      },
      {
        title: 'IDOR (A01) — endpoint vulnerável vs com ownership check',
        language: 'typescript',
        code: `// Cenario: API REST de pedidos. Usuarios devem ver APENAS seus proprios pedidos.

import express, { Request, Response, NextFunction } from 'express'
import { Order } from './models'

// Middleware que ja autenticou o usuario e populou req.user
declare module 'express' {
  interface Request {
    user?: { id: string; role: 'user' | 'admin' }
  }
}

const app = express()

// === VULNERAVEL: nao verifica ownership ===
// Qualquer usuario autenticado pode ver pedido de qualquer outro.

app.get('/api/orders/:id', async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' })

  // BUG: nao checa se order pertence ao req.user.id
  const order = await Order.findById(req.params.id)
  if (!order) return res.status(404).end()

  res.json(order)  // <- VAZAMENTO: retorna pedido de outro usuario
})

// === SEGURO: ownership check explicito ===

app.get('/api/orders/:id', async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' })

  const order = await Order.findById(req.params.id)
  if (!order) return res.status(404).end()

  // Admin pode ver tudo. Usuario comum so o proprio.
  if (order.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' })
  }

  res.json(order)
})

// === AINDA MELHOR: filtrar no proprio query ===
// Combina ownership com lookup — uma so query, sem chance de erro.

app.get('/api/orders/:id', async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' })

  const order = await Order.findOne({
    where: {
      id: req.params.id,
      userId: req.user.id,  // <- ownership embutido
    },
  })

  // Se nao achar, pode ser que (a) nao existe ou (b) e de outro user.
  // Retornar 404 (nao 403) para nao revelar existencia.
  if (!order) return res.status(404).end()

  res.json(order)
})

// === ESCALA: middleware reutilizavel para autorizacao ===

function authorize<T>(
  fetcher: (id: string) => Promise<(T & { userId: string }) | null>,
  resourceParam = 'id'
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).end()

    const resource = await fetcher(req.params[resourceParam])
    if (!resource) return res.status(404).end()

    if (resource.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' })
    }

    ;(req as any).resource = resource
    next()
  }
}

// Uso: nunca esquecer ownership check, e separado da logica de negocio
app.get(
  '/api/orders/:id',
  authorize<typeof Order.prototype>(id => Order.findById(id)),
  (req: Request, res: Response) => {
    res.json((req as any).resource)
  }
)`,
      },
      {
        title: 'SSRF (A10) — fetch de URL externa vulnerável vs com allowlist',
        language: 'typescript',
        code: `// Cenario: endpoint que aceita uma URL e busca seu conteudo
// (ex: webhook tester, link preview, image proxy)

import dns from 'dns/promises'
import { URL } from 'url'

// === VULNERAVEL: aceita qualquer URL ===
// Atacante envia http://169.254.169.254/latest/meta-data/iam/security-credentials/
// e extrai credenciais AWS da role da instancia.

async function fetchUrlVulneravel(userUrl: string) {
  const res = await fetch(userUrl)  // BUG: sem validacao
  return res.text()
}

// === SEGURO: allowlist + bloqueio de IP privado + sem redirect ===

const ALLOWED_DOMAINS = new Set([
  'api.parceiro.com',
  'webhook.cliente.com',
  'public-api.exemplo.com',
])

// IPs privados RFC 1918 + link-local + loopback + cloud metadata
const PRIVATE_RANGES = [
  /^127\\./,           // loopback
  /^10\\./,            // RFC 1918 classe A
  /^172\\.(1[6-9]|2\\d|3[01])\\./,  // RFC 1918 classe B
  /^192\\.168\\./,     // RFC 1918 classe C
  /^169\\.254\\./,     // link-local (cloud metadata!)
  /^0\\./,             // 0.0.0.0
  /^::1$/,            // IPv6 loopback
  /^fc[0-9a-f]{2}:/,  // IPv6 unique local
  /^fe80:/,           // IPv6 link-local
]

function isPrivateIP(ip: string): boolean {
  return PRIVATE_RANGES.some(rgx => rgx.test(ip))
}

async function fetchUrlSeguro(userUrl: string): Promise<string> {
  // 1. Parse e valida URL bem-formada
  let url: URL
  try {
    url = new URL(userUrl)
  } catch {
    throw new Error('URL invalida')
  }

  // 2. Apenas HTTP/HTTPS (bloqueia file://, ftp://, gopher://...)
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('Protocolo nao permitido')
  }

  // 3. Allowlist de dominios
  if (!ALLOWED_DOMAINS.has(url.hostname)) {
    throw new Error(\`Dominio nao permitido: \${url.hostname}\`)
  }

  // 4. Resolve DNS e bloqueia IPs privados
  // Importante: resolver ANTES de fazer o fetch para mitigar DNS rebinding.
  const records = await dns.lookup(url.hostname, { all: true })
  for (const r of records) {
    if (isPrivateIP(r.address)) {
      throw new Error(\`IP privado nao permitido: \${r.address}\`)
    }
  }

  // 5. Fetch com:
  //    - timeout (evita lentidao do alvo travar app)
  //    - redirect: 'manual' (evita redirect para IP privado)
  //    - tamanho maximo de resposta
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 5000)

  try {
    const res = await fetch(url.toString(), {
      redirect: 'manual',  // CRITICO: redirect pode ir para IP privado
      signal: controller.signal,
    })

    if (res.status >= 300 && res.status < 400) {
      throw new Error('Redirects nao permitidos')
    }

    // Limita tamanho da resposta (10 MB)
    const buf = await res.arrayBuffer()
    if (buf.byteLength > 10 * 1024 * 1024) {
      throw new Error('Resposta muito grande')
    }

    return new TextDecoder().decode(buf)
  } finally {
    clearTimeout(timeout)
  }
}

// === BONUS: na AWS, sempre habilitar IMDSv2 ===
// IMDSv2 exige token de sessao via PUT inicial — bloqueia SSRF basico
// que so faz GET. Configure via Launch Template ou Terraform:
//
// resource "aws_instance" "app" {
//   metadata_options {
//     http_tokens = "required"  // forca IMDSv2
//     http_endpoint = "enabled"
//   }
// }`,
      },
    ],
    mnemonics: [
      {
        label: 'BC-IIS-VAS-IL — As 10 categorias OWASP 2021 em ordem',
        trick: '"Broken Crypto Injections — Insecure Security, Vulnerable Auth Software — Logs Surrendered"',
        explanation: 'Acrônimo das primeiras letras: A01 Broken Access · A02 Cryptographic · A03 Injection · A04 Insecure Design · A05 Security Misconfig · A06 Vulnerable Components · A07 Auth Failures · A08 Software Integrity · A09 Logging · A10 SSRF. Memorize a frase como rima — em entrevista, conseguir listar os 10 em ordem demonstra fluência no framework.',
      },
      {
        label: 'AAA — Authentication, Authorization, Accounting',
        trick: '"AAA: Quem você é, O que você pode, O que você fez"',
        explanation: 'Os 3 pilares de segurança de aplicação. Authentication = autenticação (A07): provar identidade. Authorization = autorização (A01): permissões sobre recursos. Accounting = logging (A09): rastreabilidade. Falhas de qualquer um aparecem no Top 10. Em design: implementar todos os 3, nunca confiar só em um.',
      },
      {
        label: 'CIA — Confidentiality, Integrity, Availability',
        trick: '"CIA: Esconder, Não-modificar, Estar-disponível"',
        explanation: 'Os 3 objetivos clássicos de segurança. Confidentiality (A02 Crypto + A01 Access Control): só quem deveria, vê. Integrity (A08): dados não modificados não-autorizadamente. Availability (A04 Design + A05 Misconfig): sistema disponível para usuários legítimos. Cada categoria do OWASP ataca 1+ destes objetivos. Em threat modeling, classifique o impacto por C-I-A.',
      },
      {
        label: 'STRIDE — categorias de ameaça em threat modeling',
        trick: '"STRIDE: Spoof, Tamper, Repudiate, Info-leak, DoS, Escalate"',
        explanation: 'Framework Microsoft para identificar ameaças durante design (A04 Insecure Design). Spoofing = autenticação. Tampering = integridade. Repudiation = não-repúdio (logs). Information Disclosure = confidencialidade. Denial of Service = disponibilidade. Elevation of Privilege = autorização. Para cada componente do sistema, pergunte "como STRIDE pode ser explorado aqui?" — gera os requisitos de segurança.',
      },
      {
        label: 'IDOR = "Outro user, mesmo path"',
        trick: '"Se trocar o ID na URL traz dado de outro user, é IDOR"',
        explanation: 'Teste mental para IDOR (A01): tem um endpoint que aceita ID? Logue como user A. Pegue ID de recurso de user B. Tente acessar com a sessão de A. Se voltar 200, IDOR confirmado. Defesa: ownership check server-side em TODA operação que recebe ID — incluindo queries que parecem inocentes (GET).',
      },
      {
        label: 'SQLi prevenção: PARE — Prepared, Allowlist, Reject, Escape',
        trick: '"PARE de concatenar: Prepared statements, Allowlist input, Rejeite suspeito, Escape último recurso"',
        explanation: 'Quatro camadas anti-SQLi (A03). (P) Prepared statements/parametrização — defesa principal. (A) Allowlist de valores possíveis (ex: ORDER BY: só aceitar nomes de coluna conhecidos). (R) Reject input com caracteres impossíveis para o tipo (numero deve ser numero). (E) Escape como último recurso quando parametrização não é possível (ex: nome de tabela dinâmico). Aplicar em ordem — começar pelo P sempre.',
      },
      {
        label: 'JWT seguro: REVE — Rs256, Expiração, Verify, Encrypt',
        trick: '"REVE para JWT: RS256 algoritmo, Expiração curta, Verify obrigatório, Encrypt se sensível"',
        explanation: 'Quatro requisitos para JWT seguro (A07). (R) RS256 (assimétrico) > HS256 (simétrico): chave pública para verificar, privada só no servidor. Bloqueia algorithm confusion. (E) Expiração: access ≤15min, refresh com rotação. (V) Verify, nunca decode: jwt.verify() valida assinatura; jwt.decode() não. (E) Encrypt (JWE) se o payload contém PII — JWT padrão é só encoded, não criptografado. Quem ler o token vê o conteúdo.',
      },
      {
        label: 'Headers de segurança: HCXFRP',
        trick: '"HCXFRP: Hsts, Csp, X-content-type, Frame-options, Referrer, Permissions"',
        explanation: 'Os 6 headers obrigatórios (A05 Misconfig). HSTS — força HTTPS. CSP — bloqueia XSS. X-Content-Type-Options: nosniff — bloqueia MIME sniffing. X-Frame-Options/frame-ancestors — anti-clickjacking. Referrer-Policy — limita vazamento de URL. Permissions-Policy — desabilita features sensíveis (camera, mic). Use helmet.js no Express — vem com defaults sensatos. Verifique com securityheaders.com.',
      },
    ],
    exercises: [
      {
        level: 'iniciante',
        title: 'Identifique a categoria OWASP em 10 cenários de código',
        description: 'Para cada trecho de código abaixo, identifique a categoria OWASP afetada (A01-A10) e descreva como mitigar: (1) endpoint que retorna pedido sem checar dono; (2) senha armazenada com MD5; (3) query SQL com template literal; (4) endpoint /forgot-password que retorna mensagens diferentes para email existente vs não; (5) S3 bucket com acl=public-read; (6) package.json com lodash@3.x (que tem CVE); (7) login sem rate limiting; (8) pipeline CI que executa código de PRs externos; (9) erro 500 que retorna stack trace ao cliente; (10) endpoint de webhook que aceita qualquer URL. Para cada um, escreva 2-3 linhas: qual categoria, por que é problema, mitigação principal.',
        concepts: ['OWASP Top 10 categorias', 'identificação de vulnerabilidade', 'mitigação básica', 'classificação de risco'],
        hint: 'Para cada cenário, pergunte: "Que tipo de ataque isso permite?" e "Em qual A0X do OWASP isso se encaixa?". Senha em MD5 → A02 Crypto. Webhook URL → A10 SSRF. Etc.',
      },
      {
        level: 'iniciante',
        title: 'Implemente SQL injection em sandbox e depois conserte',
        description: 'Configure um Express + PostgreSQL local (ou use sqlite). Crie tabela users com colunas id, email, password, role. Implemente: (1) endpoint POST /login VULNERÁVEL com concatenação de string; (2) script atacante que usa o input "admin\' OR \'1\'=\'1\' --" e demonstra bypass; (3) UNION SELECT para extrair role de outro usuário; (4) versão SEGURA com prepared statements; (5) versão com Prisma/Drizzle ORM. Documente em README: que payload funcionou e por quê, qual fix elimina cada classe de payload. Bônus: tente blind SQLi com SLEEP() na versão vulnerável.',
        concepts: ['SQL Injection classic', 'UNION-based', 'blind/time-based', 'prepared statements', 'ORM safety'],
        hint: 'sqlite3 + node tem o mais simples setup. Para UNION você precisa do mesmo número de colunas — descobrir com ORDER BY numero. Documente cada step para conseguir explicar em entrevista.',
      },
      {
        level: 'intermediario',
        title: 'Faça threat model STRIDE de uma feature real',
        description: 'Pegue uma feature da sua aplicação (ou imagine uma: "delete account", "transfer funds", "upload profile pic"). Faça threat modeling completo: (1) desenhe o data flow diagram (DFD) da feature mostrando atores, processos, data stores, trust boundaries; (2) para cada componente, aplique STRIDE (Spoofing, Tampering, Repudiation, Information Disclosure, DoS, Elevation of Privilege) e identifique 2+ ameaças por categoria; (3) para cada ameaça, descreva o vetor de ataque e a mitigação proposta; (4) priorize por DREAD-like (impacto × facilidade); (5) escreva 5 "abuse cases" (histórias do atacante) que vão para o backlog como user stories invertidas. Resultado deve ter ~20-30 ameaças identificadas.',
        concepts: ['STRIDE', 'threat modeling', 'DFD', 'trust boundaries', 'abuse cases', 'risk prioritization'],
        hint: 'Use Microsoft Threat Modeling Tool ou desenhe no draw.io. Para cada componente: "Como um atacante poderia spoofear isso?", "Como tamperar?". Pelo menos 2 ameaças por letra do STRIDE por componente — força a pensar em todas as superfícies.',
      },
      {
        level: 'intermediario',
        title: 'Audite uma API existente com OWASP ZAP',
        description: 'Pegue uma API real sua (ou pode ser open-source) e rode auditoria completa: (1) instale OWASP ZAP localmente; (2) importe o OpenAPI spec ou faça spider; (3) rode active scan completo; (4) categorize cada finding em uma das 10 categorias OWASP; (5) verifique manualmente os top 5 findings — falsos positivos vs verdadeiros; (6) escreva relatório executivo (1 pagina) e técnico (3-5 paginas) com priorização e plano de remediação por sprint. Bônus: configure ZAP no CI como API scan headless e crie regra de bloqueio de PR para findings high/critical.',
        concepts: ['DAST', 'OWASP ZAP', 'API scanning', 'falso positivo vs verdadeiro', 'CI/CD security gates', 'priorização'],
        hint: 'Comece pequena — uma API com 5-10 endpoints. ZAP gera ruído inicial; aprenda a filtrar. Rule de PR: bloquear High+ por padrão, Medium configurável.',
      },
      {
        level: 'senior',
        title: 'Construa CSP que mitiga XSS sem quebrar a app',
        description: 'Pegue uma app web real com inline scripts/styles e implemente CSP estrito. Tarefa: (1) audit inicial — quais inline scripts/styles existem e por quê; (2) gere nonces aleatórios por request no servidor (express middleware); (3) injete nonce em todos scripts/styles legítimos; (4) configure CSP com script-src \'self\' \'nonce-XYZ\' e strict-dynamic; (5) configure CSP em modo report-only primeiro e analise reports por 7 dias; (6) refaça scripts inline problemáticos para arquivos externos quando possível; (7) habilite enforcement; (8) escreva análise de cobertura: quais XSS são bloqueadas por essa CSP vs quais ainda passariam. Bônus: integrar com Sentry para receber CSP reports.',
        concepts: ['Content Security Policy', 'nonces', 'strict-dynamic', 'report-only', 'CSP reporting endpoint', 'XSS mitigation'],
        hint: 'helmet.js facilita mas você precisa entender o que faz. Test scripts inline com ferramenta como CSP Evaluator do Google. Comece com report-only para não quebrar prod.',
      },
      {
        level: 'senior',
        title: 'Implemente Defense in Depth completo em uma rota crítica',
        description: 'Pegue uma rota crítica (ex: POST /api/funds/transfer ou POST /api/admin/user/delete) e implemente todas as 8 camadas de defesa: (1) WAF rule no edge (Cloudflare/AWS WAF) bloqueando padrões de injection; (2) rate limiting por IP + por user; (3) auth com JWT RS256 + verificação de assinatura + expiração; (4) authorization com role + ownership check; (5) input validation com Zod schema; (6) prepared statements para qualquer query; (7) audit log estruturado com user, action, IP, timestamp, outcome; (8) alerta no SIEM se threshold de falhas exceder. Para cada camada, escreva: o que ela bloqueia que outras não bloqueiam, qual é o pior caso se ela falhar, como testar que ela funciona. Resultado: documento + código rodando.',
        concepts: ['defense in depth', 'WAF', 'rate limiting', 'auth', 'authz', 'input validation', 'audit log', 'SIEM alerting'],
        hint: 'A pergunta-chave: "se eu remover essa camada, o que acontece?". Cada camada deve adicionar valor único. Documentar facilita entrevista futura.',
      },
    ],
    videos: [
      { title: 'OWASP Top 10 Web Application Security Risks', channel: 'F5 DevCentral', url: 'https://www.youtube.com/watch?v=avFR_Af0KGk' },
      { title: 'OWASP Top 10 (2021) Explained', channel: 'IppSec', url: 'https://www.youtube.com/watch?v=hryt-7ufjmI' },
      { title: 'Web Security Crash Course — freeCodeCamp', channel: 'freeCodeCamp', url: 'https://www.youtube.com/watch?v=F-sFp_AvHc8' },
      { title: 'SQL Injection Tutorial — PortSwigger', channel: 'PortSwigger', url: 'https://www.youtube.com/watch?v=ciNHn38EyRc' },
      { title: 'Cross-site scripting (XSS) explained', channel: 'PortSwigger', url: 'https://www.youtube.com/watch?v=EoaDgUgS6QA' },
      { title: 'SSRF Explained', channel: 'STÖK', url: 'https://www.youtube.com/watch?v=66ni2BTIjS8' },
    ],
    resources: [
      { title: 'OWASP Top 10 — Documentação oficial 2021', url: 'https://owasp.org/Top10/', kind: 'docs' },
      { title: 'OWASP Cheat Sheet Series', url: 'https://cheatsheetseries.owasp.org/', kind: 'docs' },
      { title: 'PortSwigger Web Security Academy (free)', url: 'https://portswigger.net/web-security', kind: 'curso' },
      { title: 'OWASP ASVS — Application Security Verification Standard', url: 'https://owasp.org/www-project-application-security-verification-standard/', kind: 'docs' },
      { title: 'Mozilla Web Security Guidelines', url: 'https://infosec.mozilla.org/guidelines/web_security', kind: 'docs' },
      { title: 'SecurityHeaders.com — scanner online', url: 'https://securityheaders.com/', kind: 'pratica' },
      { title: 'CWE Top 25 — Common Weakness Enumeration', url: 'https://cwe.mitre.org/top25/', kind: 'docs' },
      { title: 'Crypto101 — livro gratuito de criptografia', url: 'https://www.crypto101.io/', kind: 'livro' },
      { title: 'The Web Application Hacker\'s Handbook', url: 'https://portswigger.net/web-security/web-application-hackers-handbook', kind: 'livro' },
    ],
  }

export default owaspTop10
