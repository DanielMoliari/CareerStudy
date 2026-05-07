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
import { DecisionTree } from '@/components/visuals/DecisionTree'
import type { DTNode } from '@/components/visuals/DecisionTree'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'

// ── Paleta IAM (AWS orange) ───────────────────────────────────────────────────
const C      = '#ff9900'   // AWS orange
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'

void LINE; void FG; void FGMUTE

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Camadas de avaliação de policy (LayerStack)
// Ensina: a ordem e a hierarquia dos controles de acesso IAM não é óbvia em texto
// ═══════════════════════════════════════════════════════════════════════════════

const EVAL_LAYERS: Layer[] = [
  {
    id: 'deny-explicit',
    label: 'Deny explícito',
    sublabel: 'Qualquer policy em qualquer camada',
    color: '#ef4444',
    description: 'Deny explícito em qualquer policy (SCP, resource-based, identity-based, permissions boundary, session policy) encerra a avaliação imediatamente. Não há override possível.',
    examples: [
      'Deny em SCP da organização',
      'Deny em inline policy do user',
      'Deny em bucket policy do S3',
      '"Effect": "Deny" prevalece sobre qualquer Allow',
    ],
  },
  {
    id: 'scp',
    label: 'SCP (Organizations)',
    sublabel: 'Teto da conta ou OU inteira',
    color: '#f59e0b',
    description: 'Se a conta faz parte de uma AWS Organization, o SCP define o máximo de permissões possível para toda a conta. Mesmo AdministratorAccess não pode ultrapassar o SCP.',
    examples: [
      'Bloquear regiões não aprovadas',
      'Proibir desabilitar CloudTrail',
      'Exigir MFA para ações destrutivas',
      'Restringir criação de IAM users',
    ],
  },
  {
    id: 'boundary',
    label: 'Permissions Boundary',
    sublabel: 'Teto por user ou role individual',
    color: '#a78bfa',
    description: 'Define o teto máximo de permissões de um principal específico. Usado para delegação segura: o time pode criar roles dentro do boundary sem risco de privilege escalation.',
    examples: [
      'Limitar role criada por dev ao S3 e DynamoDB',
      'Condição iam:PermissionsBoundary obrigatória',
      'Permissões efetivas = interseção boundary ∩ identity policy',
      'Não concede permissões — só restringe',
    ],
  },
  {
    id: 'identity-resource',
    label: 'Identity / Resource Policy',
    sublabel: 'Allow explícito necessário',
    color: '#4ade80',
    description: 'Depois de passar por SCP e boundary, é necessário um Allow explícito em uma identity-based policy (no principal) ou resource-based policy (no recurso). Sem Allow = Deny implícito.',
    examples: [
      'Identity policy: Action: s3:GetObject, Effect: Allow',
      'Resource policy: bucket policy permitindo a role',
      'Cross-account: Allow nos dois lados (identity + resource)',
      'Deny implícito é o padrão — IAM nega tudo sem Allow',
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — AssumeRole cross-account (SequenceDiagram)
// Ensina: a sequência temporal entre conta A, STS e conta B não é óbvia em texto
// ═══════════════════════════════════════════════════════════════════════════════

const ACTORS: SeqActor[] = [
  { id: 'dev', label: 'Dev / CI\n(Conta A)', color: '#3b82f6' },
  { id: 'sts', label: 'AWS STS', color: '#a78bfa' },
  { id: 'role', label: 'Role\n(Conta B)', color: '#10b981' },
  { id: 'api', label: 'AWS API\n(Conta B)', color: C },
]

const MESSAGES: SeqMessage[] = [
  { from: 'dev', to: 'sts', label: 'sts:AssumeRole', note: 'role-arn + ExternalId (opcional)', type: 'sync' },
  { from: 'sts', to: 'role', label: 'Valida trust policy', note: 'Principal: Conta A permitido?', type: 'sync' },
  { from: 'role', to: 'sts', label: 'Trust policy OK', type: 'return' },
  { from: 'sts', to: 'dev', label: 'Credenciais temporárias', note: 'AccessKeyId + SecretKey + SessionToken (1–12h)', type: 'return' },
  { from: 'dev', to: 'api', label: 'Chamada com credenciais temporárias', note: 'Usa permissões da role da Conta B', type: 'sync' },
  { from: 'api', to: 'dev', label: 'Resposta', type: 'return' },
]

const GROUPS: SeqGroup[] = [
  { label: 'AssumeRole', kind: 'alt', fromMsg: 0, toMsg: 3, color: '#a78bfa22' },
  { label: 'Uso das credenciais temporárias', kind: 'loop', fromMsg: 4, toMsg: 5, color: '#10b98122' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — RBAC vs ABAC (ComparisonTable)
// Ensina: comparar as dimensões simultaneamente é muito mais claro que texto
// ═══════════════════════════════════════════════════════════════════════════════

const RBAC_ABAC_OPTIONS: ComparisonOption[] = [
  { id: 'rbac', label: 'RBAC', sublabel: 'Role-Based Access Control', color: '#3b82f6' },
  { id: 'abac', label: 'ABAC', sublabel: 'Attribute-Based (Tags)', color: '#10b981' },
]

const RBAC_ABAC_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'escalability',
    label: 'Escalabilidade',
    description: 'Com crescimento de times e ambientes',
    values: {
      rbac: { rating: 'poor', note: '10 times × 3 envs = 30 roles mínimo' },
      abac: { rating: 'excellent', note: '1 policy com condições em tags' },
    },
  },
  {
    id: 'readability',
    label: 'Legibilidade',
    description: 'Facilidade de entender quem tem acesso a quê',
    values: {
      rbac: { rating: 'excellent', note: 'Role = conjunto legível de permissões' },
      abac: { rating: 'fair', note: 'Condições em tags exigem consulta a recursos' },
    },
  },
  {
    id: 'audit',
    label: 'Auditoria',
    description: 'Verificar quais recursos uma identidade pode acessar',
    values: {
      rbac: { rating: 'good', note: 'Lista de ARNs na policy é explícita' },
      abac: { rating: 'fair', note: 'Exige consultar tags de todos os recursos' },
    },
  },
  {
    id: 'setup',
    label: 'Setup inicial',
    description: 'Esforço para configurar',
    values: {
      rbac: { rating: 'good', note: 'Roles e policies diretas' },
      abac: { rating: 'fair', note: 'Exige disciplina de tagging nos recursos' },
    },
  },
  {
    id: 'dynamic',
    label: 'Acesso dinâmico',
    description: 'Adicionar novo time ou ambiente',
    values: {
      rbac: { rating: 'poor', note: 'Nova role + policy + binding por combinação' },
      abac: { rating: 'excellent', note: 'Apenas adicionar tag no recurso e na sessão' },
    },
  },
  {
    id: 'saml',
    label: 'Integração com IdP (SSO/SAML)',
    description: 'Usar atributos do IdP',
    values: {
      rbac: { rating: 'good', note: 'Mapear grupo SAML → role IAM' },
      abac: { rating: 'excellent', note: 'Atributos SAML viram tags de sessão diretamente' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Credential type decision tree
// Ensina: a decisão entre roles, access keys, SSO e OIDC não é óbvia
// ═══════════════════════════════════════════════════════════════════════════════

const DT_ROOT: DTNode = {
  id: 'root',
  question: 'Quem precisa de acesso AWS?',
  children: [
    { label: 'Serviço AWS (Lambda, EC2, ECS...)', nodeId: 'service', color: C },
    { label: 'Humano (desenvolvedor, ops)', nodeId: 'human', color: '#3b82f6' },
    { label: 'CI/CD / pipeline externo', nodeId: 'cicd', color: '#10b981' },
    { label: 'Aplicação em servidor externo', nodeId: 'external-app', color: '#a78bfa' },
  ],
}

const DT_NODES: Record<string, DTNode> = {
  service: {
    id: 'service',
    recommendation: 'IAM Role (instance profile / execution role / task role)',
    detail: 'Nunca use access keys em serviços AWS. Roles fornecem credenciais temporárias rotacionadas automaticamente pelo STS. EC2 usa instance profile, Lambda usa execution role, ECS usa task role.',
    color: C,
    icon: '✅',
  },
  human: {
    id: 'human',
    question: 'Acesso a uma ou múltiplas contas?',
    children: [
      { label: 'Múltiplas contas / organização', nodeId: 'human-multi', color: '#3b82f6' },
      { label: 'Conta única, acesso local', nodeId: 'human-single', color: '#94a3b8' },
    ],
  },
  'human-multi': {
    id: 'human-multi',
    recommendation: 'IAM Identity Center (SSO)',
    detail: 'Centraliza identidade, acessa todas as contas via portal. Browser SSO emite credenciais temporárias. Sem IAM users nas contas filhas. Integra com Okta, Azure AD, Google Workspace.',
    color: '#3b82f6',
    icon: '✅',
  },
  'human-single': {
    id: 'human-single',
    recommendation: 'IAM User com access key (rotacionar ≤ 90 dias)',
    detail: 'Use access key apenas se IAM Identity Center não for viável. Rotacionar a cada 90 dias, nunca compartilhar, monitorar com Credential Report. Preferência: migrar para SSO.',
    color: '#f59e0b',
    icon: '⚠️',
  },
  cicd: {
    id: 'cicd',
    question: 'Provider suporta OIDC?',
    children: [
      { label: 'Sim (GitHub Actions, GitLab, CircleCI)', nodeId: 'cicd-oidc', color: '#10b981' },
      { label: 'Não suporta OIDC', nodeId: 'cicd-keys', color: '#ef4444' },
    ],
  },
  'cicd-oidc': {
    id: 'cicd-oidc',
    recommendation: 'OIDC + AssumeRoleWithWebIdentity',
    detail: 'Zero secrets no CI/CD. O token JWT do provider (ex: GitHub Actions GITHUB_TOKEN) é trocado por credenciais AWS temporárias. Trust policy valida o issuer e sub (repositório). Elimina access keys permanentes.',
    color: '#10b981',
    icon: '✅',
  },
  'cicd-keys': {
    id: 'cicd-keys',
    recommendation: 'Access key com rotação automática (Lambda + EventBridge)',
    detail: 'Último recurso. Armazenar no secrets manager do CI/CD, nunca em código. Criar IAM user dedicado com permissões mínimas. Automatizar rotação a cada 30–60 dias.',
    color: '#ef4444',
    icon: '⚠️',
  },
  'external-app': {
    id: 'external-app',
    recommendation: 'AssumeRole com ExternalId',
    detail: 'Aplicação externa (SaaS, servidor on-prem) assume uma role via STS. ExternalId na trust policy protege contra confused deputy attack — o SaaS só pode assumir se passar o ExternalId secreto conhecido por você.',
    color: '#a78bfa',
    icon: '✅',
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — Anti-patterns de IAM (AntiPatternsGallery)
// Ensina: ver errado × certo lado a lado é mais eficaz que descrever em texto
// ═══════════════════════════════════════════════════════════════════════════════

const IAM_ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'AdministratorAccess para tudo',
    wrong: [
      [{ text: '// IAM policy do serviço de pagamentos', color: '#475569' }],
      [{ text: '{', color: '#e2e8f0' }],
      [{ text: '  "Effect": "Allow",', color: '#e2e8f0' }],
      [{ text: '  "Action": "*",', color: '#ef4444' }],
      [{ text: '  "Resource": "*"', color: '#ef4444' }],
      [{ text: '}', color: '#e2e8f0' }],
      [{ text: '// blast radius total em caso de comprometimento', color: '#ef4444' }],
    ],
    right: [
      [{ text: '// Apenas o necessário para o serviço de pagamentos', color: '#475569' }],
      [{ text: '{', color: '#e2e8f0' }],
      [{ text: '  "Effect": "Allow",', color: '#e2e8f0' }],
      [{ text: '  "Action": [', color: '#e2e8f0' }],
      [{ text: '    "dynamodb:GetItem", "dynamodb:PutItem",', color: '#4ade80' }],
      [{ text: '    "sqs:SendMessage", "sqs:ReceiveMessage"', color: '#4ade80' }],
      [{ text: '  ],', color: '#e2e8f0' }],
      [{ text: '  "Resource": "arn:aws:dynamodb:*:*:table/payments-*"', color: '#4ade80' }],
      [{ text: '}', color: '#e2e8f0' }],
    ],
    why: 'Least privilege: se a role for comprometida, o atacante só acessa o que o serviço realmente precisa. AdministratorAccess = blast radius total.',
  },
  {
    title: 'Access key hardcoded no código',
    wrong: [
      [{ text: '// ❌ Nunca faça isso — vaza para git/logs/runtime', color: '#ef4444' }],
      [{ text: 'const s3 = new S3Client({', color: '#e2e8f0' }],
      [{ text: '  region: "us-east-1",', color: '#e2e8f0' }],
      [{ text: '  credentials: {', color: '#e2e8f0' }],
      [{ text: '    accessKeyId: "AKIAIOSFODNN7EXAMPLE",', color: '#ef4444' }],
      [{ text: '    secretAccessKey: "wJalrXUtnFEMI/K7MDENG/..."', color: '#ef4444' }],
      [{ text: '  }', color: '#e2e8f0' }],
      [{ text: '})', color: '#e2e8f0' }],
    ],
    right: [
      [{ text: '// ✅ Lambda/EC2/ECS: credenciais da role via SDK automaticamente', color: '#4ade80' }],
      [{ text: 'const s3 = new S3Client({', color: '#e2e8f0' }],
      [{ text: '  region: "us-east-1",', color: '#e2e8f0' }],
      [{ text: '  // SDK busca credenciais da role: instance profile,', color: '#4ade80' }],
      [{ text: '  // execution role ou task role automaticamente', color: '#4ade80' }],
      [{ text: '  // Nenhuma credential explícita necessária', color: '#4ade80' }],
      [{ text: '})', color: '#e2e8f0' }],
    ],
    why: 'Roles fornecem credenciais temporárias rotacionadas automaticamente. Access keys hardcoded comprometem indefinidamente se vazadas — e sempre vazam (git history, logs, variáveis de ambiente expostas).',
  },
  {
    title: 'Trust policy com Principal: * (aberta)',
    wrong: [
      [{ text: '// Trust policy da role — quem pode assumir', color: '#475569' }],
      [{ text: '{', color: '#e2e8f0' }],
      [{ text: '  "Effect": "Allow",', color: '#e2e8f0' }],
      [{ text: '  "Principal": "*",', color: '#ef4444' }],
      [{ text: '  "Action": "sts:AssumeRole"', color: '#e2e8f0' }],
      [{ text: '}', color: '#e2e8f0' }],
      [{ text: '// ❌ QUALQUER conta AWS pode assumir esta role', color: '#ef4444' }],
    ],
    right: [
      [{ text: '// Principal específico + ExternalId para terceiros', color: '#475569' }],
      [{ text: '{', color: '#e2e8f0' }],
      [{ text: '  "Effect": "Allow",', color: '#e2e8f0' }],
      [{ text: '  "Principal": {', color: '#e2e8f0' }],
      [{ text: '    "AWS": "arn:aws:iam::111111111111:role/CIRole"', color: '#4ade80' }],
      [{ text: '  },', color: '#e2e8f0' }],
      [{ text: '  "Action": "sts:AssumeRole",', color: '#e2e8f0' }],
      [{ text: '  "Condition": {', color: '#e2e8f0' }],
      [{ text: '    "StringEquals": {"sts:ExternalId": "uuid-secreto"}', color: '#4ade80' }],
      [{ text: '  }', color: '#e2e8f0' }],
      [{ text: '}', color: '#e2e8f0' }],
    ],
    why: 'Principal: * significa que qualquer conta AWS pode assumir a role. Especifique o ARN exato + ExternalId para terceiros (protege contra confused deputy attack).',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export default function IamVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'policy-eval-layers',
      title: 'Avaliação de Policy',
      subtitle: 'A hierarquia de controles que determina Allow ou Deny',
      accent: C,
      component: (
        <LayerStack
          layers={EVAL_LAYERS}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          direction="top-down"
        />
      ),
    },
    {
      id: 'assume-role-flow',
      title: 'AssumeRole Cross-Account',
      subtitle: 'Fluxo temporal entre Conta A, STS e Conta B',
      accent: C,
      component: (
        <SequenceDiagram
          actors={ACTORS}
          messages={MESSAGES}
          groups={GROUPS}
          accentColor={C}
          bgColor={BG}
          title="AssumeRole — fluxo de credenciais temporárias"
          description="A Conta A nunca vê credenciais permanentes da Conta B. O STS valida a trust policy e emite tokens com TTL de 1–12h."
        />
      ),
    },
    {
      id: 'rbac-vs-abac',
      title: 'RBAC vs ABAC',
      subtitle: 'Quando controle por roles escala e quando tags são melhores',
      accent: C,
      component: (
        <ComparisonTable
          options={RBAC_ABAC_OPTIONS}
          criteria={RBAC_ABAC_CRITERIA}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'credential-decision',
      title: 'Qual credencial usar?',
      subtitle: 'Árvore de decisão: roles, access keys, SSO ou OIDC',
      accent: C,
      component: (
        <DecisionTree
          root={DT_ROOT}
          nodes={DT_NODES}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'iam-antipatterns',
      title: 'Anti-patterns IAM',
      subtitle: 'Os 3 erros que causam 90% dos incidents de segurança AWS',
      accent: C,
      component: (
        <AntiPatternsGallery
          patterns={IAM_ANTIPATTERNS}
          accentColor={C}
          bgColor={BG}
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
