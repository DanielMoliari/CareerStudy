'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { SequenceDiagram } from '@/components/visuals/SequenceDiagram'
import type { SeqActor, SeqMessage, SeqGroup } from '@/components/visuals/SequenceDiagram'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'
import { DecisionTree } from '@/components/visuals/DecisionTree'
import type { DTNode } from '@/components/visuals/DecisionTree'
import { ProgressionMap } from '@/components/visuals/ProgressionMap'
import type { ProgressionLevel, Concept } from '@/components/visuals/ProgressionMap'

// ── Paleta Threat Modeling (Security) ─────────────────────────────────────────
const C      = '#ef4444'   // vermelho — segurança/alerta
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#22c55e'
const AMB    = '#f59e0b'
const ORG    = '#f97316'
const PRP    = '#a855f7'
const SKY    = '#38bdf8'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Sequência de Ataque STRIDE em um Endpoint
// Ensina como cada categoria do STRIDE manifesta-se como fluxo temporal
// ═══════════════════════════════════════════════════════════════════════════════

const STRIDE_ACTORS: SeqActor[] = [
  { id: 'attacker', label: 'Atacante', color: C, icon: '🎯' },
  { id: 'client',   label: 'Cliente Legítimo', color: SKY, icon: '👤' },
  { id: 'api',      label: 'API Service', color: AMB, icon: '⚙️' },
  { id: 'db',       label: 'Database', color: GRN, icon: '🗄️' },
  { id: 'logger',   label: 'Audit Log', color: PRP, icon: '📋' },
]

const STRIDE_MESSAGES: SeqMessage[] = [
  // Spoofing
  { from: 'attacker', to: 'api', label: 'POST /login com JWT forjado (alg: none)', type: 'sync', note: '[S] Spoofing — sem verificação de assinatura' },
  { from: 'api', to: 'attacker', label: '200 OK — sessão criada', type: 'return', note: '❌ Falha: JWT aceito sem verificação RS256' },
  // Tampering
  { from: 'attacker', to: 'api', label: 'POST /payment {amount: -100} via MITM', type: 'sync', note: '[T] Tampering — payload modificado em trânsito' },
  { from: 'api', to: 'db', label: 'INSERT payment (amount: -100)', type: 'sync', note: '❌ Falha: sem HMAC/TLS enforce, sem validação de amount > 0' },
  // Repudiation
  { from: 'client', to: 'api', label: 'DELETE /account/{id}', type: 'sync', note: '[R] Repudiation — ação crítica sem log' },
  { from: 'api', to: 'db', label: 'DELETE users WHERE id=X', type: 'sync', note: '❌ Falha: sem log de auditoria com userId + timestamp + IP' },
  // Info Disclosure
  { from: 'attacker', to: 'api', label: 'GET /user/999 (não dono)', type: 'sync', note: '[I] Information Disclosure' },
  { from: 'api', to: 'db', label: 'SELECT * FROM users WHERE id=999', type: 'sync' },
  { from: 'db', to: 'api', label: '{id, email, phone, cpf, password_hash}', type: 'return', note: '❌ Falha: sem BOLA check, resposta expõe campos sensíveis' },
  // DoS
  { from: 'attacker', to: 'api', label: '10.000 requests/s em POST /search', type: 'async', note: '[D] Denial of Service — sem rate limiting' },
  { from: 'api', to: 'db', label: 'SELECT * FROM products WHERE name LIKE %term%', type: 'sync', note: '❌ Falha: query sem índice, sem rate limit → DB sobrecarga' },
  // Elevation
  { from: 'attacker', to: 'api', label: 'POST /admin/users/ban {userId: X}', type: 'sync', note: '[E] Elevation of Privilege' },
  { from: 'api', to: 'db', label: 'UPDATE users SET banned=true WHERE id=X', type: 'sync', note: '❌ Falha: sem verificação de role server-side (BFLA)' },
  // Mitigated flow
  { from: 'client', to: 'api', label: 'POST /login com JWT RS256 válido', type: 'sync', note: '✅ Mitigado: assinatura verificada' },
  { from: 'api', to: 'logger', label: 'LOG {userId, action:login, ip, timestamp}', type: 'async', note: '✅ Repudiation mitigada: log imutável' },
  { from: 'api', to: 'client', label: '200 OK', type: 'return' },
]

const STRIDE_GROUPS: SeqGroup[] = [
  { label: 'S — Spoofing', kind: 'alt', fromMsg: 0, toMsg: 1, color: `${C}20` },
  { label: 'T — Tampering', kind: 'alt', fromMsg: 2, toMsg: 3, color: `${ORG}20` },
  { label: 'R — Repudiation', kind: 'alt', fromMsg: 4, toMsg: 5, color: `${PRP}20` },
  { label: 'I — Info Disclosure', kind: 'alt', fromMsg: 6, toMsg: 8, color: `${SKY}20` },
  { label: 'D — Denial of Service', kind: 'alt', fromMsg: 9, toMsg: 10, color: `${AMB}20` },
  { label: 'E — Elevation of Privilege', kind: 'alt', fromMsg: 11, toMsg: 12, color: `${C}20` },
  { label: 'Fluxo mitigado (após controles)', kind: 'opt', fromMsg: 13, toMsg: 15, color: `${GRN}20` },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Trust Boundaries como LayerStack
// Ensina a hierarquia de confiança em um sistema — impossível de entender só por texto
// ═══════════════════════════════════════════════════════════════════════════════

const TRUST_LAYERS: Layer[] = [
  {
    id: 'internet',
    label: 'Internet — Zona Não Confiável',
    sublabel: 'Qualquer ator pode se conectar',
    description: 'Tudo que vem da internet deve ser tratado como potencialmente malicioso. Nenhum dado é confiável sem validação e autenticação. Esta zona inclui usuários, crawlers, atacantes e sistemas de terceiros não gerenciados.',
    code: '// Nunca confiar em dados desta zona\n// Validar schema, autenticar, sanitizar antes de processar',
    color: C,
    icon: '🌐',
    examples: ['Usuários do browser', 'Webhooks de parceiros', 'APIs de terceiros', 'Bots e crawlers'],
  },
  {
    id: 'dmz',
    label: 'DMZ — Borda da Aplicação',
    sublabel: 'Trust boundary crítico: valide tudo que entra',
    description: 'A DMZ é onde a internet encontra sua aplicação. Aqui ficam load balancers, API gateway, WAF. É o ponto onde autenticação e validação de entrada acontecem. Dados que passam este ponto devem estar validados e autenticados.',
    code: '// Responsabilidades da DMZ:\n// - TLS termination\n// - Rate limiting\n// - JWT verification\n// - Input schema validation',
    color: AMB,
    icon: '🛡️',
    examples: ['API Gateway (Kong, AWS API GW)', 'Load balancer (nginx)', 'WAF (CloudFlare)', 'Auth middleware'],
  },
  {
    id: 'services',
    label: 'Serviços — Lógica de Negócio',
    sublabel: 'Confiança parcial — ainda validar ownership',
    description: 'Microserviços e serviços internos. Mesmo aqui, não assumir que todos os serviços são confiáveis — um serviço comprometido pode fazer chamadas maliciosas. Verificar que o chamador tem autorização para a operação específica (não só estar na rede interna).',
    code: '// Verificar ownership em cada operação\n// user.id === resource.ownerId (BOLA prevention)\n// Checar role para operações privilegiadas (BFLA)',
    color: PRP,
    icon: '⚙️',
    examples: ['Auth Service', 'Payment Service', 'User Service', 'Notification Service'],
  },
  {
    id: 'data',
    label: 'Datastores — Persistência',
    sublabel: 'Acesso apenas por serviços autorizados',
    description: 'Bancos de dados, caches, filas e object storage. Esta zona deve ser inacessível diretamente da internet. Apenas serviços da camada anterior devem ter acesso, com permissões mínimas necessárias (least privilege). Dados em repouso criptografados para dados sensíveis.',
    code: '// Least privilege: cada serviço usa usuário DB com só as permissões que precisa\n// Criptografia em repouso para dados PII/financeiros\n// Network policy: apenas service layer pode conectar',
    color: GRN,
    icon: '🗄️',
    examples: ['PostgreSQL (dados de negócio)', 'Redis (cache/sessão)', 'S3 (arquivos)', 'SQS (filas)'],
  },
  {
    id: 'audit',
    label: 'Audit & Monitoring — Camada Transversal',
    sublabel: 'Observa todas as outras camadas',
    description: 'Logs de auditoria imutáveis, métricas, alertas. Esta camada é a mitigação primária para Repudiation (R do STRIDE). Deve ser append-only e inacessível para modificação por qualquer serviço. Inclui correlation IDs para rastrear requests entre serviços.',
    code: '// Append-only: sem UPDATE/DELETE na tabela de auditoria\n// Correlation ID propagado entre todos os serviços\n// Alertas para anomalias (picos de 4xx, padrões de brute force)',
    color: SKY,
    icon: '📋',
    examples: ['Audit log DB (append-only)', 'CloudTrail / Datadog', 'SIEM (Splunk, ELK)', 'Alertas de anomalia'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Árvore de Decisão: Qual categoria STRIDE aplicar?
// Ensina a classificação de ameaças como processo de decisão — não decoreba
// ═══════════════════════════════════════════════════════════════════════════════

const ROOT_NODE: DTNode = {
  id: 'root',
  question: 'Que tipo de ameaça você está analisando?',
  children: [
    { label: 'Autoria / Identidade', nodeId: 'identity', color: C },
    { label: 'Dados / Integridade', nodeId: 'data', color: ORG },
    { label: 'Ações / Responsabilidade', nodeId: 'actions', color: PRP },
    { label: 'Disponibilidade / Acesso', nodeId: 'access', color: AMB },
  ],
}

const DECISION_NODES: Record<string, DTNode> = {
  identity: {
    id: 'identity',
    question: 'O ator pode se passar por outro ou obter mais permissões?',
    children: [
      { label: 'Fingir ser outro usuário/serviço', nodeId: 'spoofing', color: C },
      { label: 'Acessar funções não autorizadas', nodeId: 'elevation', color: AMB },
    ],
  },
  spoofing: {
    id: 'spoofing',
    recommendation: '[S] SPOOFING',
    detail: 'Atacante finge ser outro ator do sistema. Controles: autenticação forte (MFA), verificação de assinatura de tokens (JWT RS256, não HS256 com segredo compartilhado), mTLS entre microserviços, renovação de tokens comprometidos.',
    color: C,
    icon: '🎭',
  },
  elevation: {
    id: 'elevation',
    recommendation: '[E] ELEVATION OF PRIVILEGE',
    detail: 'Atacante obtém mais permissões do que o autorizado. Controles: verificação de role server-side em CADA endpoint, BFLA prevention (verificar que o usuário pode executar AQUELA função), BOLA prevention (verificar que o usuário é dono daquele objeto), least privilege em IAM/DB.',
    color: AMB,
    icon: '⬆️',
  },
  data: {
    id: 'data',
    question: 'A ameaça envolve modificar ou expor dados?',
    children: [
      { label: 'Modificar dados (escrita indevida)', nodeId: 'tampering', color: ORG },
      { label: 'Expor dados (leitura não autorizada)', nodeId: 'info_disclosure', color: SKY },
    ],
  },
  tampering: {
    id: 'tampering',
    recommendation: '[T] TAMPERING',
    detail: 'Atacante modifica dados em trânsito ou em repouso. Controles: TLS obrigatório (sem HTTP), HMAC/assinatura de payloads críticos (webhooks, filas), constraints de integridade no banco, verificação de origem em eventos (webhook signature do Stripe/GitHub), WAF para injection.',
    color: ORG,
    icon: '✏️',
  },
  info_disclosure: {
    id: 'info_disclosure',
    recommendation: '[I] INFORMATION DISCLOSURE',
    detail: 'Atacante acessa dados não autorizados. Controles: BOLA verification (resource.ownerId === user.id), DTOs explícitos na resposta (nunca retornar objeto completo do banco), erros genéricos em produção (sem stack trace, sem internals), não logar dados sensíveis (PII, senhas, tokens), criptografia em repouso.',
    color: SKY,
    icon: '👁️',
  },
  actions: {
    id: 'actions',
    question: 'O problema é que ações críticas não são rastreadas?',
    children: [
      { label: 'Sim — sem log de auditoria', nodeId: 'repudiation', color: PRP },
      { label: 'Não — é outra coisa', nodeId: 'root', color: LINE },
    ],
  },
  repudiation: {
    id: 'repudiation',
    recommendation: '[R] REPUDIATION',
    detail: 'Usuário pode negar ter executado uma ação crítica. Controles: logs de auditoria imutáveis (append-only) com userId + ação + timestamp + IP + correlation ID, assinatura digital para operações financeiras/legais, correlation IDs para rastrear através de microserviços, SIEM para análise forense.',
    color: PRP,
    icon: '📋',
  },
  access: {
    id: 'access',
    question: 'Qual aspecto de disponibilidade/acesso está ameaçado?',
    children: [
      { label: 'Sistema pode ficar indisponível', nodeId: 'dos', color: AMB },
      { label: 'Tenho outra ameaça não classificada', nodeId: 'root', color: LINE },
    ],
  },
  dos: {
    id: 'dos',
    recommendation: '[D] DENIAL OF SERVICE',
    detail: 'Atacante torna o sistema indisponível para usuários legítimos. Controles: rate limiting por IP e por usuário autenticado, throttling em endpoints custosos, limite de tamanho de payload, paginação obrigatória, timeouts em queries e chamadas externas, circuit breakers, autoscaling com limites, GraphQL depth/complexity limiting.',
    color: AMB,
    icon: '⚡',
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Maturidade em Threat Modeling: Jornada do Iniciante ao Sênior
// ═══════════════════════════════════════════════════════════════════════════════

const PROGRESSION_LEVELS: ProgressionLevel[] = [
  {
    id: 'junior',
    name: 'Nível 1',
    label: 'Iniciante',
    emoji: '🌱',
    concepts: [
      { name: 'O que é STRIDE', tip: 'As 6 categorias: S-T-R-I-D-E. Cada letra é um tipo de ameaça.' },
      { name: 'O que é um DFD', tip: '4 elementos: Ator, Processo, Datastore, Fluxo de dados.' },
      { name: 'O que é trust boundary', tip: 'Linha entre zonas com diferentes níveis de confiança.' },
      { name: 'HTTPS e TLS', tip: 'Mitigação primária para Tampering — dados em trânsito.' },
      { name: 'Autenticação vs Autorização', tip: 'Autenticação = quem você é. Autorização = o que você pode fazer.' },
    ],
  },
  {
    id: 'pleno',
    name: 'Nível 2',
    label: 'Pleno',
    emoji: '🌿',
    concepts: [
      { name: 'Aplicar STRIDE por componente', tip: 'Para cada processo e datastore no DFD, percorrer as 6 letras.' },
      { name: 'BOLA e BFLA', tip: 'BOLA = objeto errado (I+E). BFLA = função errada (E). Checks server-side.' },
      { name: 'Logs de auditoria imutáveis', tip: 'Mitigação de Repudiation. Append-only com userId+ação+timestamp+IP.' },
      { name: 'Rate limiting por dimensão', tip: 'Por IP (DoS bruto) + por usuário autenticado (abuso legítimo).' },
      { name: 'Information Disclosure por design', tip: 'Mensagem de erro diferente para "usuário não existe" vs "senha errada" é I disclosure.' },
      { name: 'Likelihood × Impact', tip: 'Matriz de priorização simples: alto × alto = corrigir agora.' },
    ],
  },
  {
    id: 'senior',
    name: 'Nível 3',
    label: 'Sênior',
    emoji: '🌳',
    concepts: [
      { name: 'Threat model incremental em times ágeis', tip: '30-60 min por feature com trigger claro. Ameaças viram critérios de DoD.' },
      { name: 'Attack Trees para objetivos complexos', tip: 'Nós AND = múltiplos controles devem falhar. Priorize nós OR (bastam sozinhos).' },
      { name: 'ADR de segurança', tip: 'Documentar decisões de mitigação com alternativas rejeitadas e critério de revisita.' },
      { name: 'Defense in depth via AND nodes', tip: 'Multiple independent controls = attacker needs all to fail simultaneously.' },
      { name: 'Threat model de sistemas com LLM', tip: 'Prompt injection = Tampering+Elevation. Sistema prompt não deve ter segredos.' },
      { name: 'SSRF e metadados de cloud', tip: '169.254.169.254 retorna credenciais IAM. Allowlist de domínios + bloquear IPs privados.' },
    ],
  },
  {
    id: 'expert',
    name: 'Nível 4',
    label: 'Expert',
    emoji: '🏔️',
    concepts: [
      { name: 'Integrar threat model com conformidade', tip: 'LGPD/RIPD, PCI-DSS Req 12.3.1, SOC 2 — DFD gera escopo e evidências de controles.' },
      { name: 'PASTA framework', tip: '7 estágios com perspectiva de negócio. Para organizações com AppSec dedicado.' },
      { name: 'Threat model de legado', tip: 'Descoberta incremental por módulo de alto risco. Não fazer o sistema inteiro de uma vez.' },
      { name: 'Threat model de sistemas distribuídos', tip: 'Correlation ID para rastrear ações cross-service. Repudiation é mais complexa com events.' },
      { name: 'Integração com SAST e code review', tip: 'Threat model informa onde SAST e reviewer devem focar. Camadas complementares, não substitutas.' },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export default function ThreatModelingVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'stride-sequence',
      title: 'STRIDE em Ação — Sequência de Ataque',
      subtitle: 'Como cada categoria do STRIDE manifesta-se como fluxo temporal em um sistema real',
      accent: C,
      component: (
        <SequenceDiagram
          actors={STRIDE_ACTORS}
          messages={STRIDE_MESSAGES}
          groups={STRIDE_GROUPS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'trust-boundaries',
      title: 'Trust Boundaries — Zonas de Confiança',
      subtitle: 'A hierarquia de confiança de um sistema em produção — do que nunca confiar ao que proteger mais',
      accent: C,
      component: (
        <LayerStack
          layers={TRUST_LAYERS}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'stride-decision',
      title: 'Classificador STRIDE — Qual Categoria Aplicar',
      subtitle: 'Árvore de decisão para identificar a categoria STRIDE certa para cada ameaça',
      accent: C,
      component: (
        <DecisionTree
          root={ROOT_NODE}
          nodes={DECISION_NODES}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'progression',
      title: 'Jornada — Do Iniciante ao Expert em Threat Modeling',
      subtitle: 'Os conceitos que definem cada nível de maturidade — do STRIDE básico ao threat model de LLMs',
      accent: C,
      component: (
        <ProgressionMap
          levels={PROGRESSION_LEVELS}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
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
