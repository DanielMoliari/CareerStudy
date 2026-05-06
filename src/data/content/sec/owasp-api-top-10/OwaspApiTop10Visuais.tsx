'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'
import { SequenceDiagram } from '@/components/visuals/SequenceDiagram'
import type { SeqActor, SeqMessage, SeqGroup } from '@/components/visuals/SequenceDiagram'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'
import { DecisionTree } from '@/components/visuals/DecisionTree'
import type { DTNode } from '@/components/visuals/DecisionTree'

// ── Paleta OWASP API Top 10 ────────────────────────────────────────────────────
const C      = '#EF4444'   // vermelho segurança/alerta (primaryColor do tech-identity)
const C2     = '#dc2626'   // secondary
const BG     = '#0f172a'
const CARD   = '#1e293b'
const CARD2  = '#243044'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#22c55e'
const AMB    = '#f59e0b'
const ORG    = '#f97316'
const PRP    = '#a78bfa'
const SKY    = '#38bdf8'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Mapa das 10 vulnerabilidades (componente custom)
// Permite clicar em cada categoria para ver detalhes
// ═══════════════════════════════════════════════════════════════════════════════

const VULNS = [
  { id: 'API1', label: 'BOLA', full: 'Broken Object Level Authorization', color: '#ef4444', icon: '🔓', severity: 'Crítico', desc: 'Usuário acessa objetos de outros usuários alterando IDs. A falha mais prevalente em APIs REST. Falta verificação de ownership server-side.', fix: 'Verifique sempre se o objeto pertence ao usuário logado antes de retornar ou modificar.' },
  { id: 'API2', label: 'Broken Auth', full: 'Broken Authentication', color: '#dc2626', icon: '🪪', severity: 'Crítico', desc: 'Tokens fracos, sem expiração, não invalidados no logout. JWTs sem verificação de assinatura. Refresh tokens que nunca rotacionam.', fix: 'Implemente rotação de refresh tokens, rate limiting de login, e invalidação de sessão no logout.' },
  { id: 'API3', label: 'Mass Assign.', full: 'Broken Object Property Level Auth', color: '#f97316', icon: '📦', severity: 'Alto', desc: 'API aceita campos que não deveria. Cliente envia { role: "admin" } e o ORM salva sem filtrar. Também inclui excesso de dados retornados.', fix: 'Use allowlist explícita de campos aceitos. Nunca passe req.body direto ao ORM.' },
  { id: 'API4', label: 'Rate Limit', full: 'Unrestricted Resource Consumption', color: '#f59e0b', icon: '⚡', severity: 'Alto', desc: 'Sem rate limiting, sem limite de payload, sem paginação obrigatória. GraphQL sem depth limiting. Permite DoS ou custos abusivos.', fix: 'Implemente throttling por IP/usuário, limite de tamanho de payload e paginação obrigatória.' },
  { id: 'API5', label: 'BFLA', full: 'Broken Function Level Authorization', color: '#f97316', icon: '⚙️', severity: 'Alto', desc: 'Usuário comum acessa endpoints de admin. A verificação de role está ausente ou só no frontend. Diferente de BOLA: é sobre qual função, não qual objeto.', fix: 'Verifique roles server-side em cada endpoint. Nunca confie em controle de acesso do cliente.' },
  { id: 'API6', label: 'Business Flow', full: 'Unrestricted Access to Sensitive Business Flows', color: '#eab308', icon: '🏪', severity: 'Médio', desc: 'Fluxos de negócio sem controle: cupons ilimitados, compra com quantidade negativa, scraping de catálogo. Requer modelagem de casos de abuso.', fix: 'Modele casos de abuso durante design. Implemente limites de negócio (ex: máx. 5 cupons/usuário/dia).' },
  { id: 'API7', label: 'SSRF', full: 'Server-Side Request Forgery', color: '#a78bfa', icon: '🌐', severity: 'Alto', desc: 'APIs que aceitam URLs de usuário e fazem fetch sem validar destino. Atacante aponta para metadados de cloud (169.254.169.254) ou serviços internos.', fix: 'Allowlist de domínios + bloqueio de IPs privados. Nunca faça fetch de URL fornecida pelo usuário sem validação.' },
  { id: 'API8', label: 'Misc Config', full: 'Security Misconfiguration', color: '#6366f1', icon: '⚙', severity: 'Médio', desc: 'Headers de segurança ausentes, CORS aberto demais, stack traces em produção, mensagens de erro verbosas que revelam internals.', fix: 'Configure headers de segurança, restrinja CORS, desative detalhes de erro em produção.' },
  { id: 'API9', label: 'Shadow APIs', full: 'Improper Inventory Management', color: '#06b6d4', icon: '👻', severity: 'Médio', desc: 'Versões antigas (v1, v2) esquecidas sem deprecação ou autenticação, expostas na internet. APIs zumbis com vulnerabilidades antigas.', fix: 'Mantenha inventário de endpoints, use sunset headers, remova versões antigas ou adicione auth.' },
  { id: 'API10', label: '3rd Party', full: 'Unsafe Consumption of APIs', color: '#10b981', icon: '🔌', severity: 'Médio', desc: 'Confiar cegamente em respostas de APIs de terceiros sem validar schema, Content-Type ou tamanho. Pode levar a injection ou crashes.', fix: 'Valide sempre a resposta de APIs externas com schema (ex: Zod). Não confie no Content-Type.' },
]

function VulnMapVisual() {
  const [selected, setSelected] = useState<string | null>('API1')
  const sel = VULNS.find(v => v.id === selected)

  return (
    <div style={{ display: 'flex', gap: 20, height: '100%', minHeight: 520 }}>
      {/* Grid de vulnerabilidades */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 260, flexShrink: 0 }}>
        <div style={{ fontSize: 10, color: FGMUTE, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 4, paddingLeft: 4 }}>
          OWASP API Top 10 — 2023
        </div>
        {VULNS.map(v => (
          <button
            key={v.id}
            onClick={() => setSelected(v.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 12px', borderRadius: 8, cursor: 'pointer',
              background: selected === v.id ? `${v.color}20` : CARD,
              border: `1.5px solid ${selected === v.id ? v.color : LINE}`,
              color: FG, textAlign: 'left', transition: 'all 0.15s',
            }}
          >
            <span style={{ fontSize: 16, flexShrink: 0 }}>{v.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: v.color, fontFamily: "'JetBrains Mono', monospace" }}>{v.id}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: selected === v.id ? FG : FGMUTE, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.label}</span>
              </div>
            </div>
            <span style={{
              fontSize: 8, fontWeight: 700, padding: '2px 5px', borderRadius: 4,
              background: v.severity === 'Crítico' ? '#ef444420' : v.severity === 'Alto' ? '#f9731620' : '#eab30820',
              color: v.severity === 'Crítico' ? '#ef4444' : v.severity === 'Alto' ? '#f97316' : '#eab308',
              flexShrink: 0,
            }}>{v.severity}</span>
          </button>
        ))}
      </div>

      {/* Painel de detalhes */}
      {sel && (
        <div style={{ flex: 1, background: CARD, borderRadius: 12, padding: 24, border: `1px solid ${LINE}`, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: 32 }}>{sel.icon}</span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: sel.color, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '.05em' }}>{sel.id}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: FG }}>{sel.full}</div>
              </div>
            </div>
            <span style={{
              display: 'inline-block', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 5,
              background: sel.severity === 'Crítico' ? '#ef444420' : sel.severity === 'Alto' ? '#f9731620' : '#eab30820',
              color: sel.severity === 'Crítico' ? '#ef4444' : sel.severity === 'Alto' ? '#f97316' : '#eab308',
              border: `1px solid ${sel.severity === 'Crítico' ? '#ef444440' : sel.severity === 'Alto' ? '#f9731640' : '#eab30840'}`,
            }}>Severidade: {sel.severity}</span>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: FGMUTE, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 8 }}>O que é</div>
            <div style={{ fontSize: 13, color: FG, lineHeight: 1.7, background: BG, borderRadius: 8, padding: '12px 14px', borderLeft: `3px solid ${C}` }}>
              {sel.desc}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: FGMUTE, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 8 }}>Mitigação</div>
            <div style={{ fontSize: 13, color: FG, lineHeight: 1.7, background: BG, borderRadius: 8, padding: '12px 14px', borderLeft: `3px solid ${GRN}` }}>
              {sel.fix}
            </div>
          </div>

          <div style={{ marginTop: 'auto', padding: '10px 14px', background: `${sel.color}10`, borderRadius: 8, border: `1px solid ${sel.color}30` }}>
            <div style={{ fontSize: 10, color: FGMUTE, marginBottom: 4 }}>Categoria de ataque</div>
            <div style={{ fontSize: 12, color: sel.color, fontWeight: 600 }}>
              {['API1', 'API2', 'API5'].includes(sel.id) ? '🔐 Controle de Acesso e Autenticação' :
               ['API3'].includes(sel.id) ? '📋 Validação de Dados de Entrada' :
               ['API4'].includes(sel.id) ? '⚡ Disponibilidade e Consumo de Recursos' :
               ['API6'].includes(sel.id) ? '🏪 Lógica de Negócio' :
               ['API7'].includes(sel.id) ? '🌐 Injeção e SSRF' :
               '⚙ Configuração e Inventário'}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — BOLA: fluxo de ataque IDOR via SequenceDiagram
// ═══════════════════════════════════════════════════════════════════════════════

const BOLA_ACTORS: SeqActor[] = [
  { id: 'att', label: 'Atacante', color: C, icon: '🦹' },
  { id: 'api', label: 'API Server', color: SKY, icon: '🖥' },
  { id: 'db',  label: 'Banco de Dados', color: AMB, icon: '🗄' },
]

const BOLA_MESSAGES: SeqMessage[] = [
  { from: 'att', to: 'api', label: 'Login com credenciais próprias', type: 'sync' },
  { from: 'api', to: 'att', label: 'JWT: userId=42', type: 'return' },
  { from: 'att', to: 'api', label: 'GET /api/orders/999  (token userId=42)', type: 'sync', note: 'Atacante troca o ID para acessar pedido de outro usuário' },
  { from: 'api', to: 'db',  label: 'SELECT * FROM orders WHERE id=999', type: 'sync', note: 'Sem verificar se order.userId === 42 !' },
  { from: 'db',  to: 'api', label: 'order { userId: 87, card: "****1234", total: 899 }', type: 'return' },
  { from: 'api', to: 'att', label: '200 OK — dados do cliente 87 expostos', type: 'return', note: '💀 BOLA explorado com sucesso' },
]

const BOLA_GROUPS: SeqGroup[] = [
  { label: 'Autenticação legítima', fromMsg: 0, toMsg: 1, kind: 'opt', color: GRN },
  { label: 'Exploração BOLA — IDOR', fromMsg: 2, toMsg: 5, kind: 'alt', color: C },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — BOLA vs BFLA vs Mass Assignment — ComparisonTable
// As três falhas de autorização que os devs mais confundem
// ═══════════════════════════════════════════════════════════════════════════════

const AUTHZ_OPTIONS: ComparisonOption[] = [
  { id: 'bola',  label: 'BOLA (API1)',  sublabel: 'Broken Object Level Auth',    color: C },
  { id: 'bfla',  label: 'BFLA (API5)',  sublabel: 'Broken Function Level Auth',  color: ORG },
  { id: 'bopla', label: 'BOPLA (API3)', sublabel: 'Broken Property Level Auth',  color: AMB },
]

const AUTHZ_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'pergunta', label: 'Pergunta ausente', category: 'Essência da falha',
    description: 'Qual verificação está faltando?',
    values: {
      bola:  { rating: 'poor', note: '"Este objeto pertence ao usuário logado?"' },
      bfla:  { rating: 'poor', note: '"Este usuário tem role para esta função?"' },
      bopla: { rating: 'poor', note: '"Quais campos posso aceitar/retornar aqui?"' },
    },
  },
  {
    id: 'vetor', label: 'Vetor de ataque', category: 'Essência da falha',
    values: {
      bola:  { rating: 'poor', note: 'Trocar ID no URL: /orders/42 → /orders/999' },
      bfla:  { rating: 'poor', note: 'Acessar endpoint proibido: DELETE /admin/users/1' },
      bopla: { rating: 'poor', note: 'Enviar campos extras: { role: "admin" } no body' },
    },
  },
  {
    id: 'detectar', label: 'Como detectar', category: 'Diagnóstico',
    values: {
      bola:  { rating: 'fair', note: 'Teste com dois usuários: um acessa recursos do outro' },
      bfla:  { rating: 'fair', note: 'Teste chamando endpoints admin sem role de admin' },
      bopla: { rating: 'fair', note: 'Envie campos extras no body e veja o que é salvo/retornado' },
    },
  },
  {
    id: 'mitigar', label: 'Mitigação central', category: 'Solução',
    values: {
      bola:  { rating: 'good', note: 'Verificar ownership: if (obj.userId !== req.user.id) 403' },
      bfla:  { rating: 'good', note: 'Verificar role: if (!user.roles.includes("admin")) 403' },
      bopla: { rating: 'good', note: 'Allowlist de campos aceitos; DTOs explícitos no input e output' },
    },
  },
  {
    id: 'frequencia', label: 'Prevalência real', category: 'Impacto',
    values: {
      bola:  { rating: 'poor', note: '#1 mais reportada — quase toda API REST tem algum BOLA' },
      bfla:  { rating: 'fair', note: 'Comum em sistemas com múltiplos papéis (admin/user/superadmin)' },
      bopla: { rating: 'fair', note: 'Comum em ORMs com update automático (Sequelize, TypeORM, Mongoose)' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Anti-patterns de implementação (código errado × correto)
// ═══════════════════════════════════════════════════════════════════════════════

const OWASP_ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'BOLA — passar ID sem verificar ownership',
    wrong: [
      [{ text: '// ❌ qualquer usuário logado acessa qualquer pedido', color: '#64748b' }],
      [{ text: 'async function getOrder(orderId: string) {', color: FG }],
      [{ text: '  return db.orders.findById(orderId)', color: C }],
      [{ text: '}', color: FG }],
    ],
    right: [
      [{ text: '// ✅ verificar se o objeto pertence ao usuário', color: '#64748b' }],
      [{ text: 'async function getOrder(orderId: string, userId: string) {', color: FG }],
      [{ text: '  const order = await db.orders.findById(orderId)', color: FG }],
      [{ text: '  if (!order || order.userId !== userId)', color: GRN }],
      [{ text: '    throw new ForbiddenError()', color: GRN }],
      [{ text: '  return order', color: FG }],
      [{ text: '}', color: FG }],
    ],
    why: 'Falta verificar ownership antes de retornar o objeto. O endpoint usa o ID diretamente sem checar se pertence ao usuário autenticado — permite acesso a dados de qualquer usuário só trocando o ID na URL.',
  },
  {
    title: 'Mass Assignment — salvar req.body direto no ORM',
    wrong: [
      [{ text: '// ❌ ORM salva tudo que veio no body — incluindo role: "admin"', color: '#64748b' }],
      [{ text: 'app.patch("/users/:id", async (req, res) =&gt; {', color: FG }],
      [{ text: '  await User.update(req.params.id, req.body)', color: C }],
      [{ text: '  res.json({ ok: true })', color: FG }],
      [{ text: '})', color: FG }],
    ],
    right: [
      [{ text: '// ✅ allowlist explícita dos campos permitidos', color: '#64748b' }],
      [{ text: 'app.patch("/users/:id", async (req, res) =&gt; {', color: FG }],
      [{ text: '  const { name, email, bio } = req.body', color: GRN }],
      [{ text: '  await User.update(req.params.id, { name, email, bio })', color: GRN }],
      [{ text: '  res.json({ ok: true })', color: FG }],
      [{ text: '})', color: FG }],
    ],
    why: 'Passar req.body diretamente ao ORM permite que o cliente envie campos arbitrários (role, isAdmin, credits) que serão persistidos. Desestruture sempre os campos permitidos explicitamente ou use DTOs com validação de schema.',
  },
  {
    title: 'SSRF — fetch de URL fornecida pelo usuário sem validação',
    wrong: [
      [{ text: '// ❌ atacante aponta para 169.254.169.254 (metadados AWS)', color: '#64748b' }],
      [{ text: 'async function testWebhook(url: string) {', color: FG }],
      [{ text: '  const res = await fetch(url)', color: C }],
      [{ text: '  return res.json()', color: FG }],
      [{ text: '}', color: FG }],
    ],
    right: [
      [{ text: '// ✅ allowlist de domínios + bloqueio de IPs privados', color: '#64748b' }],
      [{ text: 'async function testWebhook(url: string) {', color: FG }],
      [{ text: '  const parsed = new URL(url)', color: FG }],
      [{ text: '  if (!ALLOWED_DOMAINS.has(parsed.hostname))', color: GRN }],
      [{ text: '    throw new Error("Domínio não permitido")', color: GRN }],
      [{ text: '  const { address } = await dns.lookup(parsed.hostname)', color: GRN }],
      [{ text: '  if (isPrivateIP(address)) throw new Error("IP privado")', color: GRN }],
      [{ text: '  return fetch(url)', color: FG }],
      [{ text: '}', color: FG }],
    ],
    why: 'Fazer fetch de URLs fornecidas pelo usuário sem validação permite SSRF: atacante aponta para o endpoint de metadados da instância EC2 (169.254.169.254) e extrai credenciais IAM, ou acessa serviços internos da VPC inacessíveis externamente.',
  },
  {
    title: 'Rate Limiting — endpoint sem throttling',
    wrong: [
      [{ text: '// ❌ sem rate limit — qualquer um pode fazer milhões de requests', color: '#64748b' }],
      [{ text: 'app.post("/api/login", async (req, res) =&gt; {', color: FG }],
      [{ text: '  const user = await auth.verify(req.body.email, req.body.pass)', color: C }],
      [{ text: '  res.json({ token: user.generateToken() })', color: FG }],
      [{ text: '})', color: FG }],
    ],
    right: [
      [{ text: '// ✅ rate limit por IP + por conta', color: '#64748b' }],
      [{ text: 'const loginLimiter = rateLimit({', color: GRN }],
      [{ text: '  windowMs: 15 * 60 * 1000, // 15 min', color: GRN }],
      [{ text: '  max: 10, // 10 tentativas por IP', color: GRN }],
      [{ text: '  message: "Muitas tentativas — tente em 15 minutos"', color: GRN }],
      [{ text: '})', color: GRN }],
      [{ text: 'app.post("/api/login", loginLimiter, async (req, res) =&gt; {', color: FG }],
      [{ text: '  // ... mesma lógica ...', color: '#64748b' }],
      [{ text: '})', color: FG }],
    ],
    why: 'Endpoints de autenticação sem rate limiting são vulneráveis a ataques de força bruta e credential stuffing. Implemente throttling por IP, bloqueio temporário após N falhas, e CAPTCHA para tentativas suspeitas.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — Hierarquia de defesa: camadas de segurança de API
// ═══════════════════════════════════════════════════════════════════════════════

const DEFENSE_LAYERS: Layer[] = [
  {
    id: 'perim',
    label: 'Perímetro e Rede',
    sublabel: 'Primeira linha de defesa',
    description: 'WAF, API Gateway com rate limiting global, TLS obrigatório, bloqueio de IPs maliciosos, CORS restritivo. Reduz superfície de ataque antes do código.',
    color: '#6366f1',
    examples: ['WAF (ModSecurity, AWS WAF)', 'API Gateway rate limit', 'TLS 1.2+ obrigatório', 'CORS allowlist explícita'],
  },
  {
    id: 'authn',
    label: 'Autenticação',
    sublabel: 'Quem é você?',
    description: 'JWT com verificação de assinatura, rotação de refresh tokens, invalidação no logout, MFA para funções sensíveis. Sem auth, nenhuma outra camada importa.',
    color: C,
    examples: ['JWT + RS256 (não HS256 com secret fraco)', 'Refresh token rotation', 'Rate limit de login', 'Invalidação de sessão no logout'],
  },
  {
    id: 'authz',
    label: 'Autorização de Objeto (BOLA)',
    sublabel: 'Você pode acessar ESTE objeto?',
    description: 'Verificação de ownership em cada acesso: o recurso pertence ao usuário logado? Deve ser feita no service layer, não só no middleware.',
    color: '#ef4444',
    examples: ['if (obj.userId !== req.user.id) → 403', 'Service layer verifica sempre', 'Nunca confiar no ID do frontend'],
  },
  {
    id: 'funcauth',
    label: 'Autorização de Função (BFLA)',
    sublabel: 'Você pode executar ESTA operação?',
    description: 'Verificação de roles/permissões por endpoint. Admin? Moderador? Usuário? Cada endpoint verifica server-side, nunca delegando ao cliente.',
    color: ORG,
    examples: ['RBAC: roles explícitas por endpoint', 'ABAC para regras complexas', 'Nunca verificar apenas no frontend'],
  },
  {
    id: 'input',
    label: 'Validação de Entrada',
    sublabel: 'O que você pode enviar?',
    description: 'Schema validation (Zod, Joi, class-validator), allowlist de campos aceitos, sanitização de strings, limite de tamanho de payload. Previne BOPLA e injection.',
    color: AMB,
    examples: ['Zod/Joi: validar shape e tipos', 'Allowlist explícita de campos', 'Max payload size', 'Sanitizar HTML/SQL antes de persistir'],
  },
  {
    id: 'output',
    label: 'Controle de Saída',
    sublabel: 'O que você pode receber?',
    description: 'Retornar apenas os campos necessários. DTOs de resposta explícitos. Nunca expor internals: senhas hashadas, tokens, campos de auditoria, outros usuários.',
    color: GRN,
    examples: ['DTOs de resposta: apenas campos necessários', 'Remover password, salt, auditFields', 'Sem stack traces em produção', 'Sensitive data masking'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — Árvore de decisão: "Minha API está segura?"
// ═══════════════════════════════════════════════════════════════════════════════

const SECURE_ROOT: DTNode = {
  id: 'start',
  question: 'O endpoint verifica se o usuário está autenticado?',
  children: [
    { label: 'Não', nodeId: 'no-auth', color: C },
    { label: 'Sim', nodeId: 'has-auth', color: GRN },
  ],
}

const SECURE_NODES: Record<string, DTNode> = {
  'no-auth': {
    id: 'no-auth',
    recommendation: 'Vulnerável: API2 — Broken Authentication',
    detail: 'Todo endpoint que expõe dados ou executa ações deve exigir autenticação. Adicione middleware de auth antes de qualquer handler de negócio.',
    color: C,
    icon: '🚨',
  },
  'has-auth': {
    id: 'has-auth',
    question: 'O endpoint acessa um objeto pelo ID?',
    children: [
      { label: 'Sim', nodeId: 'has-object', color: AMB },
      { label: 'Não', nodeId: 'no-object', color: GRN },
    ],
  },
  'has-object': {
    id: 'has-object',
    question: 'Você verifica se o objeto pertence ao usuário logado?',
    children: [
      { label: 'Não', nodeId: 'bola-vuln', color: C },
      { label: 'Sim', nodeId: 'check-func', color: GRN },
    ],
  },
  'bola-vuln': {
    id: 'bola-vuln',
    recommendation: 'Vulnerável: API1 — BOLA (Broken Object Level Authorization)',
    detail: 'Adicione verificação de ownership: if (obj.userId !== req.user.id) throw ForbiddenError(). Faça isso no service layer, não apenas no middleware.',
    color: C,
    icon: '🔓',
  },
  'no-object': {
    id: 'no-object',
    question: 'A função é restrita a um role específico (admin, moderador)?',
    children: [
      { label: 'Sim', nodeId: 'check-role', color: AMB },
      { label: 'Não', nodeId: 'check-input', color: GRN },
    ],
  },
  'check-func': {
    id: 'check-func',
    question: 'A função é restrita a um role específico (admin, moderador)?',
    children: [
      { label: 'Sim', nodeId: 'check-role', color: AMB },
      { label: 'Não', nodeId: 'check-input', color: GRN },
    ],
  },
  'check-role': {
    id: 'check-role',
    question: 'Você verifica o role server-side em cada request?',
    children: [
      { label: 'Não', nodeId: 'bfla-vuln', color: C },
      { label: 'Sim', nodeId: 'check-input', color: GRN },
    ],
  },
  'bfla-vuln': {
    id: 'bfla-vuln',
    recommendation: 'Vulnerável: API5 — BFLA (Broken Function Level Authorization)',
    detail: 'A verificação de role deve estar no middleware ou service layer server-side. Nunca confie em flags de role enviadas pelo cliente.',
    color: ORG,
    icon: '⚙️',
  },
  'check-input': {
    id: 'check-input',
    question: 'O endpoint usa allowlist de campos aceitos no body?',
    children: [
      { label: 'Não', nodeId: 'bopla-vuln', color: AMB },
      { label: 'Sim', nodeId: 'check-rate', color: GRN },
    ],
  },
  'bopla-vuln': {
    id: 'bopla-vuln',
    recommendation: 'Vulnerável: API3 — Mass Assignment',
    detail: 'Nunca passe req.body direto ao ORM. Desestruture os campos permitidos explicitamente ou use DTOs com schema validation (Zod, class-validator).',
    color: AMB,
    icon: '📦',
  },
  'check-rate': {
    id: 'check-rate',
    question: 'Há rate limiting configurado para este endpoint?',
    children: [
      { label: 'Não', nodeId: 'rate-vuln', color: AMB },
      { label: 'Sim', nodeId: 'secure', color: GRN },
    ],
  },
  'rate-vuln': {
    id: 'rate-vuln',
    recommendation: 'Risco: API4 — Sem Rate Limiting',
    detail: 'Endpoints sem rate limiting são vulneráveis a força bruta, DoS e credential stuffing. Adicione throttling por IP e por usuário.',
    color: AMB,
    icon: '⚡',
  },
  'secure': {
    id: 'secure',
    recommendation: 'Boas práticas de segurança de API verificadas!',
    detail: 'Autenticação, autorização de objeto, autorização de função, validação de entrada e rate limiting estão presentes. Continue monitorando com logs de segurança e revise periodicamente.',
    color: GRN,
    icon: '✅',
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 7 — JWT: estrutura e armadilhas
// ═══════════════════════════════════════════════════════════════════════════════

function JWTVisual() {
  const parts = [
    {
      label: 'HEADER (base64url)',
      encoded: 'eyJhbGciOiJIUzI1NiJ9',
      decoded: '{\n  "alg": "HS256",\n  "typ": "JWT"\n}',
      bg: `${C}12`,
      border: `${C}50`,
      labelColor: C,
    },
    {
      label: 'PAYLOAD (claims) — NÃO criptografado!',
      encoded: 'eyJzdWIiOiIxMjMiLCJleHAiOjE3MDB9',
      decoded: '{\n  "sub": "1234567890",\n  "name": "Daniel",\n  "iat": 1716239022,\n  "exp": 1716242622,\n  "iss": "https://auth.x",\n  "aud": "api.x"\n}',
      bg: `${PRP}12`,
      border: `${PRP}50`,
      labelColor: PRP,
    },
    {
      label: 'SIGNATURE (HMAC ou RSA)',
      encoded: null,
      decoded: 'HMACSHA256(\n  base64UrlEncode(header) + "." +\n  base64UrlEncode(payload),\n  SECRET_KEY\n)',
      bg: `${GRN}12`,
      border: `${GRN}50`,
      labelColor: GRN,
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, flexWrap: 'wrap' }}>
        {parts.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ padding: '14px 16px', borderRadius: 10, background: p.bg, border: `2px solid ${p.border}`, minWidth: 200, flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: p.labelColor, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.04em' }}>{p.label}</div>
              {p.encoded && (
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: p.labelColor, background: BG, padding: '6px 8px', borderRadius: 6, marginBottom: 8, wordBreak: 'break-all' }}>{p.encoded}</div>
              )}
              <pre style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: FG, background: BG, padding: '8px 10px', borderRadius: 6, margin: 0, overflowX: 'auto', lineHeight: 1.6 }}>{p.decoded}</pre>
            </div>
            {i < parts.length - 1 && (
              <div style={{ fontSize: 28, fontWeight: 700, color: FGMUTE, padding: '40px 6px 0', alignSelf: 'flex-start' }}>.</div>
            )}
          </div>
        ))}
      </div>

      <div style={{ padding: '10px 16px', borderRadius: 8, background: CARD, border: `1px solid ${LINE}`, fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: FG, textAlign: 'center' }}>
        {'HMAC( base64url(header) + "." + base64url(payload), secret ) === signature?'}
      </div>

      <div style={{ padding: '12px 16px', borderRadius: 8, background: `${AMB}10`, border: `1.5px solid ${AMB}50`, fontSize: 13, color: FG, lineHeight: 1.7 }}
        dangerouslySetInnerHTML={{ __html: 'Payload é só base64 — <strong>não é criptografado</strong>. Qualquer um que tiver o token consegue ler todos os claims. Nunca coloque senhas, dados sensíveis ou PII no payload. Se precisar esconder dados, use JWE ou mantenha referências (IDs) em vez de dados.' }}
      />

      <div style={{ padding: '12px 16px', borderRadius: 8, background: `${C}10`, border: `1.5px solid ${C}50`, fontSize: 13, color: FG, lineHeight: 1.7 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.04em' }}>Armadilhas clássicas</div>
        {[
          '<code>alg: "none"</code> attack — sempre valide o algoritmo explicitamente no servidor',
          'Confusão HS256 vs RS256 — servidor pode aceitar HMAC com a chave pública como secret',
          'Sem revogação fácil — token válido até exp; use allowlist ou curto TTL',
          '<code>exp</code> obrigatório — token sem expiração é válido para sempre',
        ].map((t, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
            <span style={{ color: C, flexShrink: 0 }}>•</span>
            <span dangerouslySetInnerHTML={{ __html: t }} />
          </div>
        ))}
      </div>

      <div style={{ padding: '12px 16px', borderRadius: 8, background: BG, border: `1px solid ${LINE}`, fontSize: 12, color: FGMUTE, lineHeight: 1.7 }}
        dangerouslySetInnerHTML={{ __html: 'JWT é stateless: o servidor não guarda sessão. Cliente manda <code>Authorization: Bearer eyJhbGc...</code>, server valida assinatura. Desvantagens reais: <strong>não dá pra revogar</strong> fácil (use refresh token + allowlist ou TTL curto), <strong>algoritmo "none"</strong> é CVE clássico (sempre valide alg explicitamente), confusão <strong>HS vs RS</strong> pode deixar qualquer um forjar token, e <strong>payload visível</strong> — qualquer um faz <code>atob(token.split(".")[1])</code>.' }}
      />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// Componente principal
// ═══════════════════════════════════════════════════════════════════════════════

export default function OwaspVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'vuln-map',
      title: 'Mapa das 10 Vulnerabilidades',
      subtitle: 'Clique em cada API1–API10 para ver descrição, vetor de ataque e mitigação',
      accent: C,
      component: <VulnMapVisual />,
    },
    {
      id: 'bola-attack',
      title: 'Ataque BOLA — Fluxo Completo',
      subtitle: 'Sequência de mensagens de um ataque IDOR em API REST (API1)',
      accent: C,
      component: (
        <SequenceDiagram
          actors={BOLA_ACTORS}
          messages={BOLA_MESSAGES}
          groups={BOLA_GROUPS}
          accentColor={C}
          bgColor={BG}
          title="API1 — BOLA: exploração IDOR passo a passo"
          description="Usuário autenticado como userId=42 troca o ID no request para acessar dados de outro usuário. A API não verifica ownership — retorna dados confidenciais."
        />
      ),
    },
    {
      id: 'authz-comparison',
      title: 'BOLA vs BFLA vs Mass Assignment',
      subtitle: 'As três falhas de autorização que os devs mais confundem — lado a lado',
      accent: C,
      component: (
        <ComparisonTable
          options={AUTHZ_OPTIONS}
          criteria={AUTHZ_CRITERIA}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'antipatterns',
      title: 'Anti-patterns de Implementação',
      subtitle: 'Código vulnerável × código seguro para os erros mais comuns',
      accent: C,
      component: (
        <AntiPatternsGallery
          patterns={OWASP_ANTIPATTERNS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'defense-layers',
      title: 'Camadas de Defesa de API',
      subtitle: 'Hierarquia de segurança: do perímetro ao controle de saída',
      accent: C,
      component: (
        <LayerStack
          layers={DEFENSE_LAYERS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'security-checklist',
      title: 'Diagnóstico: Minha API está segura?',
      subtitle: 'Árvore de decisão interativa que identifica vulnerabilidades OWASP API Top 10',
      accent: C,
      component: (
        <DecisionTree
          root={SECURE_ROOT}
          nodes={SECURE_NODES}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'jwt-structure',
      title: 'JWT — Estrutura e Armadilhas',
      subtitle: 'Header, payload, signature — o que cada parte faz e como atacar',
      accent: C,
      component: <JWTVisual />,
    },
  ]

  return (
    <VisuaisShell
      visuals={visuals}
      active={active}
      onChange={setActive}
    />
  )
}
