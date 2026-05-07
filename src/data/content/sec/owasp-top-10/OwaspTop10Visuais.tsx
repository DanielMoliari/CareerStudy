'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { CodeStepper } from '@/components/visuals/CodeStepper'
import type { CodeStepperScenario } from '@/components/visuals/CodeStepper'
import { SequenceDiagram } from '@/components/visuals/SequenceDiagram'
import type { SeqActor, SeqMessage, SeqGroup } from '@/components/visuals/SequenceDiagram'
import { StateMachineExplorer } from '@/components/visuals/StateMachineExplorer'
import type { SMState, SMTransition } from '@/components/visuals/StateMachineExplorer'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'

// ── Paleta OWASP Top 10 ──────────────────────────────────────────────────────
const C      = '#EF4444'    // vermelho — segurança/perigo
const C2     = '#b91c1c'
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#22c55e'
const RED    = '#ef4444'
const AMB    = '#f59e0b'
const PRP    = '#a78bfa'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — ComparisonTable: as 10 categorias com vetor × impacto × mitigação
// ═══════════════════════════════════════════════════════════════════════════════

const TOP10_OPTIONS: ComparisonOption[] = [
  { id: 'a01', label: 'A01 — Broken Access Control', sublabel: '94% das apps', color: '#ef4444' },
  { id: 'a02', label: 'A02 — Cryptographic Failures', sublabel: '77% das apps',  color: '#f97316' },
  { id: 'a03', label: 'A03 — Injection',              sublabel: '73% das apps',  color: '#ef4444' },
  { id: 'a04', label: 'A04 — Insecure Design',        sublabel: 'NOVO 2021',      color: '#dc2626' },
  { id: 'a05', label: 'A05 — Misconfiguration',       sublabel: '90% das apps',   color: '#f97316' },
  { id: 'a06', label: 'A06 — Vulnerable Components',  sublabel: '64% das apps',   color: '#f97316' },
  { id: 'a07', label: 'A07 — Auth Failures',          sublabel: '62% das apps',   color: '#ef4444' },
  { id: 'a08', label: 'A08 — Integrity Failures',     sublabel: 'NOVO 2021',      color: '#dc2626' },
  { id: 'a09', label: 'A09 — Logging Failures',       sublabel: '50% das apps',   color: '#f97316' },
  { id: 'a10', label: 'A10 — SSRF',                   sublabel: 'NOVO 2021',      color: '#dc2626' },
]

const TOP10_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'attack-vector',
    label: 'Vetor de ataque típico',
    category: 'Identificação',
    values: {
      a01: { rating: 'good', note: 'IDOR, manipular IDs em URL/JWT, escalada de privilégio' },
      a02: { rating: 'good', note: 'Senhas em MD5, TLS desativado, chaves em código' },
      a03: { rating: 'good', note: 'SQLi, NoSQLi, Command Injection, XSS, LDAP' },
      a04: { rating: 'good', note: 'Lógica de negócio abusável, recovery flow vaza emails' },
      a05: { rating: 'good', note: 'S3 público, debug em prod, default creds, headers ausentes' },
      a06: { rating: 'good', note: 'npm/Docker com CVE, Log4Shell, framework EOL' },
      a07: { rating: 'good', note: 'Credential stuffing, JWT alg:none, sessão infinita' },
      a08: { rating: 'good', note: 'Deserialização insegura, CI/CD comprometido, supply chain' },
      a09: { rating: 'good', note: 'Sem logs de auth, sem SIEM, retenção curta' },
      a10: { rating: 'good', note: 'Webhook URL, fetch externo sem validar, metadata cloud' },
    },
  },
  {
    id: 'impact',
    label: 'Impacto típico',
    category: 'Severidade',
    values: {
      a01: { rating: 'poor',      note: 'CRÍTICO — vazamento de dados de outros usuários' },
      a02: { rating: 'poor',      note: 'CRÍTICO — vazamento de senhas, dados sensíveis' },
      a03: { rating: 'poor',      note: 'CRÍTICO — RCE, dump de banco, bypass total' },
      a04: { rating: 'poor',      note: 'ALTO — abuso de lógica, fraude' },
      a05: { rating: 'poor',      note: 'CRÍTICO — exposição de dados via misconfig' },
      a06: { rating: 'poor',      note: 'CRÍTICO — RCE via dependência (Log4Shell)' },
      a07: { rating: 'poor',      note: 'CRÍTICO — takeover de conta' },
      a08: { rating: 'poor',      note: 'CRÍTICO — RCE via deserialização' },
      a09: { rating: 'fair',      note: 'MÉDIO — incidentes não detectados, sem forensics' },
      a10: { rating: 'poor',      note: 'CRÍTICO — pivot interno, exfiltração credentials' },
    },
  },
  {
    id: 'mitigation',
    label: 'Mitigação central',
    category: 'Defesa',
    values: {
      a01: { rating: 'excellent', note: 'Ownership check server-side em TODA op com ID' },
      a02: { rating: 'excellent', note: 'bcrypt/argon2 12+ rounds, TLS 1.3, Vault para secrets' },
      a03: { rating: 'excellent', note: 'Prepared statements, ORMs, Zod validation, output encoding' },
      a04: { rating: 'excellent', note: 'Threat modeling STRIDE antes de codar, security review' },
      a05: { rating: 'excellent', note: 'helmet.js, IaC com baseline, security headers' },
      a06: { rating: 'excellent', note: 'Snyk/Dependabot, npm audit, trivy, update policy' },
      a07: { rating: 'excellent', note: 'JWT RS256, MFA, rate limit /login, refresh rotation' },
      a08: { rating: 'excellent', note: 'Lock files, SLSA, SBOM, signed releases' },
      a09: { rating: 'excellent', note: 'SIEM, structured logs, alertas, retenção 90+ dias' },
      a10: { rating: 'excellent', note: 'Allowlist de domínios, bloquear IPs privados, IMDSv2' },
    },
  },
  {
    id: 'detection-tool',
    label: 'Ferramenta de detecção',
    category: 'Auditoria',
    values: {
      a01: { rating: 'good', note: 'Burp Suite Intruder, manual com 2 usuários' },
      a02: { rating: 'good', note: 'testssl.sh, gitleaks, trivy' },
      a03: { rating: 'good', note: 'sqlmap, OWASP ZAP, Semgrep SAST' },
      a04: { rating: 'fair', note: 'Manual — abuse cases, threat modeling' },
      a05: { rating: 'good', note: 'nuclei, securityheaders.com, OWASP ZAP' },
      a06: { rating: 'excellent', note: 'Snyk, Dependabot, trivy, npm audit' },
      a07: { rating: 'good', note: 'jwt_tool, Burp + brute force' },
      a08: { rating: 'fair', note: 'Manual code review, ferramentas de SCA' },
      a09: { rating: 'fair', note: 'Audit de logs, simulação de incidente' },
      a10: { rating: 'good', note: 'Burp Collaborator, OWASP ZAP, manual' },
    },
  },
  {
    id: 'cwe',
    label: 'CWE principal',
    category: 'Classificação',
    values: {
      a01: { rating: 'na', note: 'CWE-639, CWE-285' },
      a02: { rating: 'na', note: 'CWE-327, CWE-329, CWE-798' },
      a03: { rating: 'na', note: 'CWE-89, CWE-79, CWE-78' },
      a04: { rating: 'na', note: 'CWE-209, CWE-256' },
      a05: { rating: 'na', note: 'CWE-16, CWE-200, CWE-1059' },
      a06: { rating: 'na', note: 'CWE-1104, CWE-937' },
      a07: { rating: 'na', note: 'CWE-287, CWE-307, CWE-613' },
      a08: { rating: 'na', note: 'CWE-502, CWE-345' },
      a09: { rating: 'na', note: 'CWE-778, CWE-117' },
      a10: { rating: 'na', note: 'CWE-918' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — CodeStepper: SQL Injection passo a passo (vulnerável → fix)
// ═══════════════════════════════════════════════════════════════════════════════

const SQLI_SCENARIOS: CodeStepperScenario[] = [
  {
    id: 'sqli-classic',
    label: 'SQL Injection clássico — bypass de auth',
    language: 'javascript',
    code: `// VULNERAVEL — concatenacao de string
async function login(email, password) {
  const q = "SELECT * FROM users " +
            "WHERE email = '" + email + "' " +
            "AND password = '" + password + "'"
  const { rows } = await pool.query(q)
  return rows[0]
}

// Atacante envia:
// email = "admin' OR '1'='1' --"
// password = "qualquer"`,
    steps: [
      {
        lineStart: 1,
        lineEnd: 8,
        title: 'Setup — login function vulneravel',
        explanation: 'Função recebe email e password do usuário e concatena DIRETAMENTE em uma query SQL. Erro fatal: input vira código.',
        memory: { code: 'concatenacao', risco: 'alto' },
      },
      {
        lineStart: 11,
        lineEnd: 12,
        title: 'Atacante envia payload malicioso',
        explanation: "Em vez de email normal, atacante digita: admin' OR '1'='1' -- com password qualquer.",
        memory: { email: "admin' OR '1'='1' --", password: 'qualquer', tipo: 'attack payload' },
      },
      {
        lineStart: 3,
        lineEnd: 5,
        title: 'Query final — código injetado',
        explanation: 'O servidor concatena. Resultado: SELECT * FROM users WHERE email = \'admin\' OR \'1\'=\'1\' --\' AND password = \'qualquer\'. O OR \'1\'=\'1\' é sempre verdadeiro. O -- comenta o resto (incluindo password check).',
        memory: { 'query_executada': "SELECT * FROM users WHERE email = 'admin' OR '1'='1' --", 'condicao_email': 'TRUE (OR 1=1)', 'condicao_password': 'COMENTADA' },
      },
      {
        lineStart: 6,
        lineEnd: 7,
        title: 'Banco retorna PRIMEIRO usuário',
        explanation: 'Como o WHERE é sempre verdadeiro, banco retorna todos os usuários. rows[0] é o primeiro — geralmente o admin (id=1). Bypass total de autenticação.',
        memory: { resultado: 'TODOS os usuarios', 'rows[0]': 'admin (id=1)', autenticado: 'SIM (sem senha!)' },
        output: '✗ ATAQUE BEM-SUCEDIDO — login como admin sem senha',
      },
    ],
  },
  {
    id: 'sqli-fix',
    label: 'Mitigação — Prepared Statement',
    language: 'javascript',
    code: `// SEGURO — prepared statement
async function login(email, password) {
  // O '$1' e o '$2' sao placeholders
  const q = "SELECT * FROM users " +
            "WHERE email = $1"

  // Valores passados SEPARADOS — banco nunca interpreta como SQL
  const { rows } = await pool.query(q, [email])
  const user = rows[0]
  if (!user) return null

  // Verifica senha com bcrypt (nunca compare strings direto!)
  const ok = await bcrypt.compare(password, user.password_hash)
  return ok ? user : null
}

// Mesmo input malicioso:
// email = "admin' OR '1'='1' --"`,
    steps: [
      {
        lineStart: 1,
        lineEnd: 5,
        title: 'Query com placeholder $1',
        explanation: 'Em vez de concatenar, usamos $1 como placeholder. O template SQL e os dados são enviados SEPARADOS ao banco.',
        memory: { template: 'SELECT * FROM users WHERE email = $1', placeholder: '$1' },
      },
      {
        lineStart: 8,
        lineEnd: 9,
        title: 'Mesmo payload malicioso',
        explanation: 'Atacante envia o mesmo email = "admin\' OR \'1\'=\'1\' --". Mas agora vai ser tratado diferente!',
        memory: { email_input: "admin' OR '1'='1' --", parametros: "['admin OR 1=1 --']" },
      },
      {
        lineStart: 7,
        lineEnd: 8,
        title: 'Banco compila template ANTES dos dados',
        explanation: 'O Postgres recebe o template e compila o plano de execução. Depois, recebe os valores como STRINGS LITERAIS — não como SQL.',
        memory: { etapa: 'parser separa codigo de dados', 'email no banco': "string literal: \"admin' OR '1'='1' --\"" },
      },
      {
        lineStart: 7,
        lineEnd: 9,
        title: 'Busca por email literal',
        explanation: 'Banco procura usuário com email = "admin\' OR \'1\'=\'1\' --" (a string completa). Não existe esse email → rows = []. Login rejeitado.',
        memory: { 'WHERE': "email = literal_string", encontrou: 'NENHUM usuario', resultado: 'login falhou' },
      },
      {
        lineStart: 13,
        lineEnd: 15,
        title: 'bcrypt.compare em vez de string match',
        explanation: 'Mesmo se o user existisse, comparamos a senha com bcrypt.compare — nunca string == string. bcrypt usa hash com salt, resistente a timing attacks.',
        memory: { senha: 'comparada via bcrypt.compare', 'timing_safe': 'sim (bcrypt)' },
        output: '✓ ATAQUE NEUTRALIZADO — prepared statement separa código de dados',
      },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — SequenceDiagram: SSRF attack flow
// ═══════════════════════════════════════════════════════════════════════════════

const SSRF_ACTORS: SeqActor[] = [
  { id: 'attacker',  label: 'Atacante',           color: RED },
  { id: 'app',       label: 'App Server',         color: C },
  { id: 'metadata',  label: 'AWS IMDS\n(169.254.169.254)', color: AMB },
  { id: 'iam',       label: 'AWS IAM',            color: PRP },
]

const SSRF_MESSAGES: SeqMessage[] = [
  { from: 'attacker', to: 'app',      label: 'POST /webhook { url: "http://169.254.169.254/latest/meta-data/iam/security-credentials/" }', type: 'sync', note: 'App tem endpoint que faz fetch da URL fornecida pelo usuário' },
  { from: 'app',      to: 'metadata', label: 'GET /latest/meta-data/iam/security-credentials/', type: 'sync', note: 'App faz fetch SEM validar destino. IMDS é acessível só de dentro da instância EC2.' },
  { from: 'metadata', to: 'app',      label: '200 OK\n"my-app-role"', type: 'return', note: 'IMDS retorna nome da role IAM associada à instância.' },
  { from: 'app',      to: 'attacker', label: 'Response com nome da role', type: 'return' },
  { from: 'attacker', to: 'app',      label: 'POST /webhook { url: "http://169.254.169.254/latest/meta-data/iam/security-credentials/my-app-role" }', type: 'sync', note: 'Agora atacante busca AS CREDENCIAIS dessa role.' },
  { from: 'app',      to: 'metadata', label: 'GET /.../security-credentials/my-app-role', type: 'sync' },
  { from: 'metadata', to: 'app',      label: '{ AccessKeyId, SecretAccessKey, Token }', type: 'return', note: 'CRÍTICO: IMDS retorna credenciais TEMPORÁRIAS da role IAM.' },
  { from: 'app',      to: 'attacker', label: 'Response com credenciais AWS', type: 'return', note: 'Atacante agora tem credenciais válidas da role da instância!' },
  { from: 'attacker', to: 'iam',      label: 'aws s3 ls (com credenciais roubadas)', type: 'sync', note: 'Atacante usa as credenciais para qualquer ação que a role permite.' },
  { from: 'iam',      to: 'attacker', label: '200 OK — listou todos os buckets', type: 'return', note: 'Comprometeu toda a AWS account dependendo das permissões da role.' },
]

const SSRF_GROUPS: SeqGroup[] = [
  { label: 'Reconhecimento', kind: 'opt', fromMsg: 0, toMsg: 3, color: AMB },
  { label: 'Exfiltração de credenciais', kind: 'opt', fromMsg: 4, toMsg: 7, color: RED },
  { label: 'Pós-exploração', kind: 'opt', fromMsg: 8, toMsg: 9, color: PRP },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — StateMachineExplorer: estados de uma sessão e onde cada falha A07 ocorre
// ═══════════════════════════════════════════════════════════════════════════════

const SESSION_STATES: SMState[] = [
  { id: 'unauth',        label: 'Não autenticado',         description: 'Nenhuma sessão. Tem acesso só a páginas públicas.', color: FGMUTE, isInitial: true },
  { id: 'login',         label: 'Login (form)',            description: 'Usuário enviou credenciais. Servidor valida.', color: AMB },
  { id: 'mfa',           label: 'Aguardando MFA',          description: 'Senha OK, mas precisa do segundo fator.', color: PRP },
  { id: 'authed',        label: 'Autenticado',             description: 'Sessão ativa. Acesso a recursos próprios.', color: GRN },
  { id: 'expired',       label: 'Sessão expirada',         description: 'Token/cookie passou do exp. Precisa relogar.', color: FGMUTE },
  { id: 'compromised',   label: 'Conta comprometida',      description: 'Atacante ganhou acesso — credential stuffing, sessão sequestrada, MFA bypass.', color: RED, isFinal: true },
  { id: 'logout',        label: 'Logout',                  description: 'Sessão invalidada server-side.', color: FGMUTE },
]

const SESSION_TRANSITIONS: SMTransition[] = [
  { from: 'unauth',     to: 'login',       event: 'POST /login',                guard: 'credenciais válidas' },
  { from: 'login',      to: 'compromised', event: 'A07: alg:none JWT aceito',   guard: 'falha de autenticação',  code: 'jwt.decode(token) // sem verify!' },
  { from: 'login',      to: 'compromised', event: 'A07: senha fraca aceita',    guard: 'sem requisitos de força' },
  { from: 'login',      to: 'compromised', event: 'A07: credential stuffing',   guard: 'sem rate limit',         code: '50 requests/seg sem block' },
  { from: 'login',      to: 'mfa',         event: 'MFA habilitado',             guard: 'usuário com MFA' },
  { from: 'login',      to: 'authed',      event: 'login direto (sem MFA)',     guard: 'sem MFA — vulnerável' },
  { from: 'mfa',        to: 'authed',      event: 'OTP correto' },
  { from: 'mfa',        to: 'compromised', event: 'A07: MFA bypass',            guard: 'falha de implementação', code: 'aceita resposta vazia ou null' },
  { from: 'authed',     to: 'authed',      event: 'Request com token',          guard: 'token válido' },
  { from: 'authed',     to: 'compromised', event: 'A07: session fixation',      guard: 'session ID não rotaciona' },
  { from: 'authed',     to: 'compromised', event: 'A07: token vazado em log',   guard: 'log de URL completa' },
  { from: 'authed',     to: 'expired',     event: 'token expirou (exp)',        guard: 'JWT exp ou cookie maxAge' },
  { from: 'authed',     to: 'logout',      event: 'POST /logout' },
  { from: 'logout',     to: 'compromised', event: 'A07: logout não invalida',   guard: 'token segue valido server-side' },
  { from: 'expired',    to: 'login',       event: 'tenta refresh / relogin' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — LayerStack: defesa em profundidade (8 camadas)
// ═══════════════════════════════════════════════════════════════════════════════

const DEFENSE_LAYERS: Layer[] = [
  {
    id: 'l1',
    label: 'Network',
    sublabel: 'WAF, DDoS protection, rate limit no edge',
    description: 'Bloqueia tráfego malicioso antes de chegar à aplicação. WAF detecta SQLi/XSS por assinatura. CDN absorve DDoS. Bloqueia geo-IP indesejado.',
    examples: ['Cloudflare WAF', 'AWS Shield', 'Nginx rate_limit', 'Geo-blocking'],
    color: '#1e293b',
  },
  {
    id: 'l2',
    label: 'Transport',
    sublabel: 'TLS 1.3, HSTS, mTLS, cert pinning',
    description: 'Tudo em HTTPS. HSTS para forçar HTTPS sempre. mTLS para serviço-a-serviço. Certificate pinning em apps mobile.',
    examples: ['TLS 1.3', 'HSTS preload', 'Let\'s Encrypt', 'Mutual TLS'],
    color: '#1e293b',
  },
  {
    id: 'l3',
    label: 'Authentication',
    sublabel: 'MFA, secure session, password hashing',
    description: 'MFA obrigatório para admins. Argon2/bcrypt rounds altos. Sessões httpOnly + Secure + SameSite=Strict. JWT RS256 com expiração curta.',
    examples: ['Argon2id', 'WebAuthn', 'bcrypt 12+ rounds', 'JWT RS256'],
    color: '#1e293b',
  },
  {
    id: 'l4',
    label: 'Authorization',
    sublabel: 'RBAC, ABAC, ownership checks',
    description: 'Toda operação verifica role + ownership. Postgres RLS delega ao banco. Policy engines (OPA, Casbin) para regras complexas.',
    examples: ['Postgres RLS', 'Casbin', 'Open Policy Agent', 'Zanzibar-style'],
    color: '#1e293b',
  },
  {
    id: 'l5',
    label: 'Input Validation',
    sublabel: 'Zod, allowlist, sanitization',
    description: 'Validar shape + tipo + range em TODA entrada. Allowlist > blocklist. Nunca confiar em input do cliente.',
    examples: ['Zod', 'class-validator', 'Joi', 'DOMPurify (HTML)'],
    color: '#1e293b',
  },
  {
    id: 'l6',
    label: 'Output Encoding',
    sublabel: 'XSS prevention, CSP, content-type',
    description: 'Escape HTML em outputs. CSP com nonces. Content-Type explícito. Frame-options anti-clickjacking.',
    examples: ['CSP nonces', 'helmet', 'X-Content-Type-Options'],
    color: '#1e293b',
  },
  {
    id: 'l7',
    label: 'Database',
    sublabel: 'Prepared statements, least privilege, encryption at rest',
    description: 'SEMPRE prepared statements. User do app sem DROP/ALTER. Backups e PII encriptados (AES-256). Connection limits.',
    examples: ['pgcrypto', 'TDE', 'IAM auth', 'Connection pool limits'],
    color: '#1e293b',
  },
  {
    id: 'l8',
    label: 'Logging & Monitoring',
    sublabel: 'SIEM, alertas, anomaly detection',
    description: 'Log estruturado de eventos de segurança. Alertas para padrões suspeitos. Retenção 90+ dias para forensics.',
    examples: ['Datadog', 'Splunk', 'ELK', 'Sentry'],
    color: '#1e293b',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — Headers de segurança (ComparisonTable)
// ═══════════════════════════════════════════════════════════════════════════════

const HEADERS_OPTIONS: ComparisonOption[] = [
  { id: 'hsts',   label: 'Strict-Transport-Security',  sublabel: 'HSTS',                color: GRN },
  { id: 'csp',    label: 'Content-Security-Policy',    sublabel: 'CSP',                 color: C },
  { id: 'xcto',   label: 'X-Content-Type-Options',     sublabel: 'nosniff',             color: AMB },
  { id: 'xfo',    label: 'X-Frame-Options',            sublabel: 'anti-clickjack',      color: PRP },
  { id: 'rp',     label: 'Referrer-Policy',            sublabel: 'privacy',             color: '#06b6d4' },
  { id: 'pp',     label: 'Permissions-Policy',         sublabel: 'feature gating',      color: '#84cc16' },
]

const HEADERS_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'protect',
    label: 'O que protege',
    category: 'Função',
    values: {
      hsts: { rating: 'good', note: 'MITM, downgrade HTTP→HTTPS' },
      csp:  { rating: 'good', note: 'XSS (especialmente reflected e DOM)' },
      xcto: { rating: 'good', note: 'MIME sniffing → XSS via upload' },
      xfo:  { rating: 'good', note: 'Clickjacking (UI redress)' },
      rp:   { rating: 'good', note: 'Vazamento de URL com tokens em Referer' },
      pp:   { rating: 'good', note: 'Acesso indevido a camera, mic, geolocation' },
    },
  },
  {
    id: 'value',
    label: 'Valor recomendado',
    category: 'Configuração',
    values: {
      hsts: { rating: 'excellent', note: 'max-age=31536000; includeSubDomains; preload' },
      csp:  { rating: 'excellent', note: 'default-src \'self\'; script-src \'self\' \'nonce-XYZ\'' },
      xcto: { rating: 'excellent', note: 'nosniff' },
      xfo:  { rating: 'excellent', note: 'DENY (ou usar CSP frame-ancestors)' },
      rp:   { rating: 'excellent', note: 'strict-origin-when-cross-origin' },
      pp:   { rating: 'excellent', note: 'camera=(), microphone=(), geolocation=()' },
    },
  },
  {
    id: 'owasp',
    label: 'OWASP relacionado',
    category: 'Mapping',
    values: {
      hsts: { rating: 'na', note: 'A02 Cryptographic Failures' },
      csp:  { rating: 'na', note: 'A03 Injection (XSS)' },
      xcto: { rating: 'na', note: 'A03 Injection (XSS via upload)' },
      xfo:  { rating: 'na', note: 'A05 Security Misconfiguration' },
      rp:   { rating: 'na', note: 'A02 Cryptographic Failures (info leak)' },
      pp:   { rating: 'na', note: 'A05 Security Misconfiguration' },
    },
  },
  {
    id: 'gotcha',
    label: 'Pegadinha comum',
    category: 'Atenção',
    values: {
      hsts: { rating: 'fair', note: 'preload é IRREVERSÍVEL — teste muito antes' },
      csp:  { rating: 'fair', note: '\'unsafe-inline\' anula a proteção — use nonces' },
      xcto: { rating: 'good', note: 'Sem pegadinha — sempre habilite' },
      xfo:  { rating: 'fair', note: 'Substituído por CSP frame-ancestors em browsers modernos' },
      rp:   { rating: 'good', note: 'Default do browser ainda é unsafe-url em alguns casos' },
      pp:   { rating: 'good', note: 'Sintaxe nova — Permissions-Policy substitui Feature-Policy' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export default function OwaspTop10Visuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'top10-overview',
      title: 'Os 10 — vetor, impacto, mitigação',
      subtitle: 'Cada categoria mapeada com vetor de ataque típico, impacto, mitigação central e ferramentas de detecção',
      accent: C,
      component: (
        <ComparisonTable
          options={TOP10_OPTIONS}
          criteria={TOP10_CRITERIA}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'sqli-stepper',
      title: 'SQL Injection — exploit e mitigação',
      subtitle: 'Execução passo a passo: do payload malicioso até o bypass de auth, depois o fix com prepared statement',
      accent: C,
      component: (
        <CodeStepper
          scenarios={SQLI_SCENARIOS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'ssrf-flow',
      title: 'SSRF — extração de credenciais AWS',
      subtitle: 'Fluxo do ataque clássico em cloud: do webhook URL até roubar credenciais IAM via metadata service',
      accent: C,
      component: (
        <SequenceDiagram
          actors={SSRF_ACTORS}
          messages={SSRF_MESSAGES}
          groups={SSRF_GROUPS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'auth-state-machine',
      title: 'Sessão de autenticação — onde A07 falha',
      subtitle: 'Estados de uma sessão e onde cada vulnerabilidade A07 (Auth Failures) ocorre — clique nas transições',
      accent: C,
      component: (
        <StateMachineExplorer
          states={SESSION_STATES}
          transitions={SESSION_TRANSITIONS}
          initialState="unauth"
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'defense-in-depth',
      title: 'Defense in Depth — 8 camadas',
      subtitle: 'Cada camada captura ataques que escaparam da anterior. Falha em uma camada não compromete o sistema',
      accent: C,
      component: (
        <LayerStack
          layers={DEFENSE_LAYERS}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'security-headers',
      title: 'Headers de Segurança',
      subtitle: 'Os 6 headers obrigatórios — o que protege, valor recomendado e pegadinhas comuns',
      accent: C,
      component: (
        <ComparisonTable
          options={HEADERS_OPTIONS}
          criteria={HEADERS_CRITERIA}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
  ]

  void LINE; void FG; void C2

  return (
    <VisuaisShell
      visuals={visuals}
      active={active}
      onChange={setActive}
    />
  )
}
