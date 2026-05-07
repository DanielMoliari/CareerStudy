'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildCheatsheetPdf } from '@/components/pdfs/CheatsheetPdf'
import type { HookItem, RuleItem } from '@/components/pdfs/CheatsheetPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'
import { buildMindmapPdf } from '@/components/pdfs/MindmapPdf'
import type { MindmapCategory } from '@/components/pdfs/MindmapPdf'

// ── Paleta IAM (AWS orange) ───────────────────────────────────────────────────
const C = '#ff9900'  // AWS orange — NUNCA omitir, default seria cyan React

// ── Metadados dos PDFs ────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas sobre IAM em entrevista sênior',
    type: 'qa',
    pages: 11,
    description: 'Recuperação ativa: avaliação de policy (DEAR), AssumeRole cross-account, SCP vs permissions boundary, ABAC vs RBAC, confused deputy, OIDC com GitHub Actions, IAM Identity Center e tudo que entrevistadores sênior de cloud realmente perguntam.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet',
    subtitle: 'Componentes, camadas de controle, condition keys e CLI numa página',
    type: 'cheatsheet',
    pages: 3,
    description: 'Referência densa: componentes IAM (User, Group, Role, Policy), camadas de avaliação (Deny explícito → SCP → Boundary → Allow), condition keys mais usadas (MFA, Region, OrgID, Tags), e comandos aws sts / iam mais comuns.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'Os 4 truques que grudam IAM na memória',
    type: 'mnemonics',
    pages: 2,
    description: 'DEAR (ordem de avaliação), 3T das Roles (Temporária, Transferível, Tratável), SCP = Safety Ceiling Policy, e ABAC = Tag-Match = Escala. Truques verbais para nunca errar as perguntas conceituais de entrevista.',
    icon: '03',
    goal: 'Memória de longo prazo',
  },
  {
    id: 'mindmap',
    title: 'Mind Map',
    subtitle: 'IAM do zero ao sênior em uma folha',
    type: 'mindmap',
    pages: 2,
    description: 'Mapa mental completo com 6 categorias (Identidades, Policies, Avaliação, Serviços relacionados, Segurança, Padrões avançados) e checklist de 10 perguntas para auto-avaliar o domínio antes de entrevista.',
    icon: '04',
    goal: 'Mapeamento mental',
  },
]

// ── Dados: Q&A ────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Senior',
    q: 'Explique a ordem de avaliação de uma policy IAM.',
    a: 'A ordem é: 1. Deny explícito em qualquer policy → DENY imediato. 2. SCP (Organizations) não permite → DENY. 3. Permissions boundary não permite → DENY. 4. Allow explícito em identity ou resource policy → ALLOW. Sem Allow explícito em todos os níveis aplicáveis = DENY implícito (padrão). Um único Deny explícito encerra a avaliação sem possibilidade de override.',
    tip: 'Use a sigla DEAR: Deny explícito → Evaluate SCP → Assess boundary → Resource/identity Allow. Mencione que o DENY implícito é o padrão — IAM começa negando tudo.',
  },
  {
    level: 'Senior',
    q: 'Por que usar roles em vez de access keys para serviços AWS?',
    a: 'Roles fornecem credenciais temporárias rotacionadas automaticamente pelo STS (15 min–12 h). Access keys são permanentes — se vazadas comprometem indefinidamente até rotação manual. EC2 com instance profile, Lambda com execution role, ECS com task role — a credencial nunca precisa ser gerenciada. CloudTrail registra quem usou a role, quando e por quanto tempo — rastreabilidade superior a access keys compartilhadas.',
    tip: 'Mencione que credenciais temporárias expiram sozinhas em caso de comprometimento. O SDK AWS busca credenciais automaticamente na cadeia: variáveis de ambiente → shared credentials file → instance metadata (role).',
  },
  {
    level: 'Senior',
    q: 'Qual a diferença entre SCP e permissions boundary?',
    a: 'SCP (Service Control Policy): aplica-se a toda uma conta ou OU no AWS Organizations. Define o teto máximo para TODOS os principals da conta. Não concede permissões — apenas restringe. Permissions Boundary: aplica-se a um user ou role específico. Define o teto máximo daquele principal. Ambos apenas restringem — nunca concedem. Diferença de escopo: SCP é organizacional, boundary é por-principal.',
    tip: 'A diferença de escopo é a chave: SCP cobre a conta inteira (configurado pelo admin da org), boundary é cirúrgico (por principal, usado para delegação). Ambos só restringem.',
  },
  {
    level: 'Senior',
    q: 'O que é o confused deputy problem e como o ExternalId resolve?',
    a: 'Cenário: empresa A usa SaaS (empresa B). A empresa A cria role e passa o ARN ao SaaS. Um atacante descobre o ARN e cria conta no mesmo SaaS — o SaaS pode assumir a role da empresa A em nome do atacante. Solução: ExternalId na trust policy. Condition: StringEquals: sts:ExternalId: uuid-secreto. O SaaS só assume a role se passar o ExternalId — que o atacante não conhece, mesmo sabendo o ARN.',
    tip: 'Esse problema é comum em integrações SaaS (DataDog, Splunk, security tools). Sempre exigir ExternalId quando terceiros assumem roles na sua conta.',
  },
  {
    level: 'Senior',
    q: 'Como implementaria permission boundary para delegação segura de IAM a times de dev?',
    a: 'Combinação de dois controles: 1. Boundary policy que define o teto máximo (ex: apenas S3 e DynamoDB do projeto). 2. Policy do time com iam:CreateRole condicionada a passar o boundary obrigatório: Condition: StringEquals: iam:PermissionsBoundary: arn:aws:iam::ACCOUNT:policy/DevBoundary. Resultado: o time cria roles livremente para suas aplicações, mas nenhuma role pode exceder o boundary. Sem o boundary obrigatório na condição, o time pode criar roles sem boundary — contornando o controle.',
    tip: 'Esse padrão é clássico em platform teams. A boundary vira o contrato entre platform e dev teams. Sem isso, qualquer dev com iam:CreateRole pode criar role com AdministratorAccess.',
  },
  {
    level: 'Senior',
    q: 'O que é ABAC e quando escala melhor que RBAC?',
    a: 'ABAC usa tags de sessão e de recurso para determinar acesso. Condition: StringEquals: aws:ResourceTag/team: ${aws:PrincipalTag/team}. RBAC com 10 times × 3 ambientes × 4 serviços = 120 roles. ABAC: 1 policy, tags nos recursos e nas sessões. ABAC escala quando: times crescem dinamicamente; recursos têm lifecycle curto; o IdP emite atributos via SAML/OIDC. Ponto fraco: auditoria — saber quais recursos o time X pode acessar exige consultar tags de todos os recursos.',
    tip: 'Mencione o ponto fraco do ABAC na auditoria — demonstra maturidade. RBAC é mais legível para compliance pontual. ABAC é mais eficiente para organizações grandes.',
  },
  {
    level: 'Senior',
    q: 'Como revogar sessões ativas de uma role comprometida?',
    a: 'Credenciais STS já emitidas continuam válidas até expirar, mesmo depois de modificar a role. Para revogar sessões ativas: adicionar uma Deny policy inline na role com Condition: DateLessThan: aws:TokenIssueTime: [timestamp do comprometimento]. Isso invalida todos os tokens emitidos antes do timestamp. Alternativa: adicionar Deny inline sem condição (Effect: Deny, Action: *, Resource: *) — invalida toda sessão ativa imediatamente.',
    tip: 'A ação contra-intuitiva: deletar a role ou desanexar policies NÃO revoga sessões ativas. O Deny inline é a única forma de revogar tokens STS já emitidos antes de expirar naturalmente.',
  },
  {
    level: 'Senior',
    q: 'Como funciona OIDC com GitHub Actions para deploy sem secrets?',
    a: 'GitHub Actions tem um OIDC provider que emite JWT tokens para cada job. Configuração: 1. Criar OIDC provider no IAM apontando para token.actions.githubusercontent.com. 2. Criar role com trust policy usando sts:AssumeRoleWithWebIdentity, validando o sub (repositório) e o aud. 3. No workflow: aws-actions/configure-aws-credentials com role-to-assume. Resultado: zero AWS secrets no repositório — o GitHub token efêmero é trocado por credenciais AWS temporárias.',
    tip: 'A trust policy deve validar o sub com StringLike: token.actions.githubusercontent.com:sub: repo:empresa/repo:ref:refs/heads/main. Sem validação do sub, qualquer repositório GitHub pode assumir a role.',
  },
  {
    level: 'Senior',
    q: 'O que é IAM Identity Center e como substitui usuários IAM diretos?',
    a: 'IAM Identity Center centraliza identidade para múltiplas contas AWS. Conecta ao IdP (Okta, Azure AD, Google Workspace). Gerencia permission sets — templates de permissão provisionados como roles nas contas target. Fluxo: login no portal SSO → escolhe conta/role → recebe credenciais temporárias (até 8h). Substitui: IAM users em cada conta, rotação manual de access keys, acesso direto ao console com usuário/senha. Revogar acesso de um funcionário que saiu = desativar no IdP — propagado a todas as contas automaticamente.',
    tip: 'O ponto que separa junior de sênior: IAM Identity Center (SSO) é a abordagem correta para acesso humano multi-conta. IAM users diretos em contas filhas são antipadrão em organizações.',
  },
  {
    level: 'Senior',
    q: 'Como estruturar IAM para uma organização multi-conta?',
    a: 'Estrutura: 1. Conta Management (apenas Organizations/Billing). 2. Conta Security (CloudTrail, Config, GuardDuty centralizados). 3. Conta Log Archive (S3 de logs imutáveis). 4. Contas de workload por ambiente (dev/staging/prod). SCPs por OU: Sandbox sem restrições; Prod com SCP bloqueando regiões não aprovadas, ações destrutivas sem MFA. Acesso via IAM Identity Center — sem usuários IAM em contas filhas. Break-glass: role de emergência em cada conta prod com MFA obrigatório, auditada por alertas CloudTrail.',
    tip: 'A estrutura de contas e o uso de IAM Identity Center são o que diferencia um arquiteto de cloud de alguém que apenas configura IAM. O break-glass é o detalhe que demonstra experiência em produção.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre identity-based e resource-based policy?',
    a: 'Identity-based: anexada ao principal (user, group, role). Define o que aquele principal pode fazer. Resource-based: anexada ao recurso (S3, KMS, Lambda, SQS). Define quem pode acessar aquele recurso. Permite acesso cross-account sem AssumeRole — a conta B adiciona a conta A na bucket policy do S3. Armadilha cross-account: S3 exige Allow nos DOIS lados (identity + resource) para cross-account. Mesma conta: resource policy Allow basta.',
    tip: 'A armadilha do cross-account S3 é frequentemente cobrada: sem a identity policy na conta A também permitindo S3, o acesso falha mesmo com bucket policy aberta.',
  },
  {
    level: 'Pleno',
    q: 'O que é condition em IAM policy e cite exemplos práticos?',
    a: 'Condition adiciona lógica condicional ao statement. Exemplos: aws:MultiFactorAuthPresent: true — exige MFA para ações destrutivas. aws:RequestedRegion — restringe a regiões aprovadas. s3:prefix — limita a prefixo por usuário (multi-tenant). aws:PrincipalOrgID — permite acesso apenas a contas da própria organização. aws:SourceVpc — restringe S3 a partir de VPC específica. Operadores: StringEquals vs StringLike (wildcard), Bool vs BoolIfExists (quando a chave pode não existir).',
    tip: 'Bool vs BoolIfExists: usar Bool sem suporte do contexto (chamadas programáticas sem MFA) avalia como false e bloqueia tudo. BoolIfExists só avalia se a chave existir no contexto.',
  },
  {
    level: 'Pleno',
    q: 'Como implementar least privilege na prática?',
    a: '1. Policy Generation: IAM analisa CloudTrail dos últimos 90 dias e gera policy com ações realmente usadas. 2. IAM Access Analyzer: identifica permissões não utilizadas, recursos acessíveis de fora da conta, acessos cross-account não intencionais. 3. SCPs: guardrails organizacionais. 4. Revisão periódica: Credential Report para usuários inativos; generate-service-last-accessed-details para serviços não acessados. 5. Aws managed policies violam least privilege — preferir customer managed geradas pelo Policy Generator.',
    tip: 'Citar Policy Generator (analisa CloudTrail → gera policy mínima) e generate-service-last-accessed-details mostra domínio de ferramentas reais de auditoria.',
  },
  {
    level: 'Pleno',
    q: 'Como usar MFA obrigatório para ações sensíveis sem bloquear o restante?',
    a: 'Condition BoolIfExists em apenas nos statements das ações sensíveis: Statement 1 (sem MFA): Effect: Allow, Action: [s3:GetObject, ec2:Describe*], Resource: *. Statement 2 (com MFA): Effect: Deny, Action: [s3:DeleteBucket, ec2:TerminateInstances], Condition: BoolIfExists: aws:MultiFactorAuthPresent: false. Usar BoolIfExists em vez de Bool para cobrir chamadas sem suporte a MFA (access keys programáticas não têm contexto MFA).',
    tip: 'A armadilha de Bool vs BoolIfExists: sem BoolIfExists, chamadas de roles assumidas (que não passam o contexto MFA) seriam bloqueadas mesmo em usuários autenticados com MFA.',
  },
  {
    level: 'Pleno',
    q: 'Quais são as melhores práticas para access keys de longo prazo?',
    a: 'Access keys são necessárias apenas para acesso programático por humanos fora do contexto AWS. Práticas: rotacionar a cada 90 dias (automatizável com Lambda + EventBridge); nunca usar root account; Credential Report para auditoria (aws iam generate-credential-report); desativar keys inativas por 45+ dias; armazenar em Secrets Manager, nunca em código; migrar para IAM Identity Center com OIDC/SAML — elimina access keys para humanos.',
    tip: 'Em 2024, AWS passou a recomendar ativamente a descontinuação de access keys de longo prazo. OIDC para CI/CD e SSO para humanos são os padrões atuais.',
  },
  {
    level: 'Pleno',
    q: 'O que é o IAM Access Analyzer e como usá-lo?',
    a: 'Access Analyzer analisa resource-based policies e identifica recursos acessíveis de fora da zona de confiança (conta ou organização). Findings: bucket S3 com acesso público; role com trust policy para conta externa; chave KMS compartilhada com principal fora da org. Módulo de acessos não utilizados: roles e access keys não usados nos últimos 90 dias. Configurar múltiplos analyzers: um com escopo de conta (acesso externo à conta) e outro com escopo de organização (acesso externo à org).',
    tip: 'Mencionar múltiplos analyzers (escopo conta + escopo organização) demonstra conhecimento avançado. O módulo de unused access é o que mais ajuda na implementação contínua de least privilege.',
  },
  {
    level: 'Senior',
    q: 'Como funciona federação com SAML e OIDC no IAM?',
    a: 'SAML 2.0: IdP corporativo emite assertion SAML. Usuário chama sts:AssumeRoleWithSAML. STS valida contra o IdP configurado e retorna credenciais temporárias. OIDC (Web Identity): token JWT do OIDC provider (GitHub, GitLab, EKS IRSA) é trocado por credenciais AWS via sts:AssumeRoleWithWebIdentity. Trust policy valida issuer e sub. EKS IRSA: pods assumem role via service account annotation — cada pod tem credenciais próprias, sem compartilhar a node role.',
    tip: 'EKS IRSA (IAM Roles for Service Accounts) é o equivalente de instance profile para pods. Sem IRSA, todos os pods de um node compartilham a mesma role do node — violação de least privilege.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre AWS managed, customer managed e inline policies?',
    a: 'AWS managed: criadas pela AWS (ReadOnlyAccess, AmazonS3FullAccess). Atualizadas automaticamente. Geralmente mais permissivas que o necessário — violam least privilege. Customer managed: criadas por você. Versionadas (até 5 versões). Reutilizáveis. Visíveis ao Access Analyzer. Recomendadas para produção. Inline policies: embutidas diretamente no principal. Não reutilizáveis, não versionadas, deletadas com o principal, invisíveis ao Access Analyzer. Usar apenas para casos excepcionais.',
    tip: 'Antipadrão comum: AmazonDynamoDBFullAccess para Lambda que só lê uma tabela. Melhor prática: gerar com Policy Generator baseado em CloudTrail.',
  },
  {
    level: 'Senior',
    q: 'Como investigar um acesso não autorizado detectado no CloudTrail?',
    a: 'Passos: 1. userIdentity no evento CloudTrail — tipo (IAMUser, AssumedRole, Root), ARN, account. 2. sourceIPAddress e userAgent — IP de cloud provider diferente é red flag. 3. Revogar: access key → desativar/deletar; role → Deny policy inline na role para invalidar sessões ativas. 4. Escopo: novas roles/users criados? Policies modificadas? Buckets exfiltrados? Recursos de cryptomining? 5. Remediar: remover recursos do atacante, rotacionar credenciais, habilitar GuardDuty.',
    tip: 'A ação mais crítica: para revogar sessões ativas de role comprometida, adicionar Deny inline (não deletar a role). Tokens STS já emitidos são válidos até expirar naturalmente sem essa ação.',
  },
  {
    level: 'Pleno',
    q: 'O que é o IAM Policy Simulator e como usá-lo em pipelines?',
    a: 'Policy Simulator simula o resultado de permissões IAM sem executar ações reais. Recebe: principal, actions, resources → retorna Allow/Deny com explicação de qual statement decidiu. Via CLI: aws iam simulate-principal-policy --policy-source-arn arn:...:role/MinhaRole --action-names s3:GetObject --resource-arns arn:aws:s3:::meu-bucket/arquivo.txt. Em pipelines: antes de apply Terraform, verificar que a nova policy concede apenas o esperado. Limitação: não simula SCPs por padrão.',
    tip: 'Mencionar a limitação de SCPs no simulator — em organizações com SCPs, o resultado pode diferir do comportamento real se as SCPs não estiverem incluídas na simulação.',
  },
]

// ── Dados: CheatSheet ─────────────────────────────────────────────────────────

const CHEATSHEET_HOOKS: HookItem[] = [
  { name: 'User', sig: 'Pessoa física com access key permanente', desc: 'Preferir IAM Identity Center para humanos. Access key é exception, não regra.' },
  { name: 'Group', sig: 'Conjunto de users (sem aninhamento)', desc: 'Policies anexadas ao grupo aplicam a todos os membros. Groups não podem assumir roles.' },
  { name: 'Role', sig: 'Identidade assumível com credenciais temporárias (STS)', desc: 'Preferir sempre. EC2 → instance profile. Lambda → execution role. ECS → task role.' },
  { name: 'Policy (JSON)', sig: 'Statement: Effect + Action + Resource + Condition', desc: 'Identity-based: no principal. Resource-based: no recurso. SCP: na conta/OU. Boundary: teto por principal.' },
  { name: 'sts:AssumeRole', sig: 'aws sts assume-role --role-arn ARN --role-session-name SESSION', desc: 'Retorna AccessKeyId + SecretAccessKey + SessionToken. TTL: 15 min–12 h.' },
  { name: 'Access Analyzer', sig: 'Achados de acesso externo não intencional', desc: 'Analisa resource-based policies. Módulo de unused access identifica permissões não usadas em 90 dias.' },
  { name: 'Policy Simulator', sig: 'aws iam simulate-principal-policy --policy-source-arn ARN', desc: 'Simula Allow/Deny sem executar ação real. Não simula SCPs por padrão.' },
  { name: 'Credential Report', sig: 'aws iam generate-credential-report', desc: 'Status de todos os usuários: last_used, key_age, mfa_active. Auditoria periódica.' },
]

const CHEATSHEET_RULES: RuleItem[] = [
  { ok: false, t: 'AdministratorAccess em workloads — blast radius total em comprometimento' },
  { ok: false, t: 'Access keys hardcoded em código — sempre vaza, compromete indefinidamente' },
  { ok: false, t: 'Principal: * em trust policy — qualquer conta AWS pode assumir a role' },
  { ok: false, t: 'Root account sem MFA — pode deletar a própria conta AWS' },
  { ok: false, t: 'Inline policies em produção — invisíveis ao Access Analyzer, não versionadas' },
  { ok: true, t: 'Roles em todos os serviços AWS — credenciais temporárias, rotação automática' },
  { ok: true, t: 'ExternalId em trust policies para terceiros — protege contra confused deputy' },
  { ok: true, t: 'BoolIfExists para MFA — Bool avalia false quando chave ausente no contexto' },
  { ok: true, t: 'IAM Identity Center para humanos — zero access keys em contas filhas' },
  { ok: true, t: 'OIDC para CI/CD — zero secrets no repositório, credenciais por job' },
]

// ── Dados: Mnemônicos ─────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'DEAR — ordem de avaliação de policies',
    trick: 'D-E-A-R',
    expansion: [
      ['D', 'Deny explícito — imediato, sem override'],
      ['E', 'Evaluate SCP (Organizations)'],
      ['A', 'Assess Permissions Boundary'],
      ['R', 'Resource/identity Allow necessário'],
    ],
    explanation: 'A ordem exata de avaliação. Sem Allow explícito em todos os níveis aplicáveis = DENY implícito.',
    example: 'Deny no SCP → DENY mesmo com Allow na identity policy. Boundary bloqueia → DENY mesmo com SCP permissivo.',
    why: 'Ordem de avaliação é a pergunta conceitual mais frequente sobre IAM em entrevistas sênior.',
  },
  {
    label: '3T das Roles — Temporária, Transferível, Tratável',
    trick: 'Role = credencial Temporária, assumida por qualquer Tipo, auditável (Tratável)',
    expansion: [
      ['Temporária', 'Expira automaticamente (15 min–12 h) — sem rotação manual'],
      ['Transferível', 'Qualquer serviço, usuário ou conta pode assumir (conforme trust policy)'],
      ['Tratável', 'CloudTrail registra quem assumiu, quando e por quanto tempo'],
    ],
    explanation: 'Roles são superiores a access keys em todos os três aspectos. Por isso, roles são a forma preferida de credencial AWS.',
    example: 'Lambda com execution role: credencial temporária, gerada pelo STS, rastreável via CloudTrail — sem access key no código.',
    why: 'A superioridade das roles sobre access keys é o argumento que justifica o esforço de configurar IAM corretamente.',
  },
  {
    label: 'SCP = Safety Ceiling Policy',
    trick: 'SCP é o teto de segurança da organização — ninguém ultrapassa, nem o admin',
    expansion: [
      ['Safety', 'Guardrail para toda a organização — não contornável'],
      ['Ceiling', 'Define o teto máximo, nunca concede permissões'],
      ['Policy', 'Aplicada a contas e OUs inteiras (não por principal)'],
    ],
    explanation: 'Mesmo AdministratorAccess ou root não pode fazer o que um SCP nega. Diferente de boundary (por principal), SCP cobre toda a conta ou OU.',
    example: 'SCP: Deny toda ação fora de us-east-1 e sa-east-1. Admin com AdministratorAccess tenta criar EC2 em eu-west-1 → DENY.',
    why: 'A confusão SCP vs Boundary é frequente. SCP é organizacional (amplo). Boundary é por-principal (cirúrgico).',
  },
  {
    label: 'ABAC = Tag-Match = Escala',
    trick: 'ABAC: se as tags batem, o acesso é concedido. Uma policy serve toda a organização.',
    expansion: [
      ['Tag-Match', 'aws:ResourceTag/team = ${aws:PrincipalTag/team} → Allow'],
      ['Escala', 'Novo time = nova tag, não nova role + policy + binding'],
      ['Vs RBAC', 'RBAC: N times × M ambientes = N×M roles. ABAC: 1 policy'],
    ],
    explanation: 'ABAC usa condições em tags de sessão vs tags de recurso. Escala com o crescimento da organização sem explosão de roles.',
    example: 'Time backend acessa EC2/S3 com tag team=backend. Novo time frontend: apenas adicionar tag team=frontend nos recursos — sem criar nova role.',
    why: 'ABAC vs RBAC é pergunta de design arquitetural frequente. Saber quando usar cada um e os trade-offs de auditoria é o esperado de um sênior.',
  },
]

// ── Dados: Mind Map ───────────────────────────────────────────────────────────

const MINDMAP_CATEGORIES: MindmapCategory[] = [
  {
    label: 'Identidades',
    color: '#3b82f6',
    items: [
      { t: 'User — pessoa, access key permanente', k: true },
      { t: 'Group — conjunto de users', k: true },
      { t: 'Role — identidade temporária assumível', k: true },
      { t: 'Root — evitar uso diário, MFA obrigatório', k: true },
      { t: 'Federated — SSO/SAML/OIDC', a: true },
    ],
  },
  {
    label: 'Políticas (Policies)',
    color: C,
    items: [
      { t: 'Identity-based — no principal', k: true },
      { t: 'Resource-based — no recurso', k: true },
      { t: 'SCP — toda a conta/OU (Organizations)', k: true },
      { t: 'Permissions Boundary — teto por principal', k: true },
      { t: 'Session Policy — passada no AssumeRole', a: true },
    ],
  },
  {
    label: 'Avaliação',
    color: '#ef4444',
    items: [
      { t: 'DEAR: Deny → SCP → Boundary → Allow', k: true },
      { t: 'Deny explícito: imediato, sem override', k: true },
      { t: 'Deny implícito: padrão sem Allow', k: true },
      { t: 'Cross-account: Allow nos 2 lados (S3)', a: true },
    ],
  },
  {
    label: 'Serviços relacionados',
    color: '#a78bfa',
    items: [
      { t: 'STS — credenciais temporárias', k: true },
      { t: 'Access Analyzer — findings de acesso', k: true },
      { t: 'CloudTrail — auditoria completa', k: true },
      { t: 'Organizations — SCPs', k: true },
      { t: 'IAM Identity Center — SSO multi-conta', a: true },
    ],
  },
  {
    label: 'Segurança',
    color: '#10b981',
    items: [
      { t: 'Least privilege — mínimo necessário', k: true },
      { t: 'MFA obrigatório no root', k: true },
      { t: 'Rotação de access keys — 90 dias', k: true },
      { t: 'ExternalId — confused deputy protection', k: true },
      { t: 'No hardcoded keys — usar roles', k: true },
    ],
  },
  {
    label: 'Padrões avançados',
    color: '#f59e0b',
    items: [
      { t: 'ABAC — controle por tags', a: true },
      { t: 'Cross-account — trust policy + ExternalId', a: true },
      { t: 'OIDC — GitHub Actions sem secrets', a: true },
      { t: 'Permission Boundary — delegação segura', a: true },
      { t: 'IAM Identity Center — acesso humano', a: true },
    ],
  },
]

const MINDMAP_CHECKLIST = [
  'Consigo descrever a ordem DEAR de avaliação de policy?',
  'Sei a diferença entre SCP (organizacional) e Permissions Boundary (por principal)?',
  'Entendo por que roles são superiores a access keys em serviços AWS?',
  'Sei o que é ExternalId e quando usar para proteger contra confused deputy?',
  'Consigo explicar ABAC vs RBAC e quando cada um escala melhor?',
  'Sei como revogar sessões ativas de uma role comprometida (Deny inline)?',
  'Entendo como OIDC elimina access keys em CI/CD (GitHub Actions)?',
  'Sei o que é IAM Identity Center e como substitui usuários IAM diretos?',
  'Consigo configurar MFA obrigatório usando BoolIfExists corretamente?',
  'Sei usar IAM Access Analyzer para identificar permissões não usadas?',
]

// ── Builders ──────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'AWS IAM',
    stackLabel: 'Cloud · Segurança',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'AWS IAM',
    accentColor: C,
    stackLabel: 'Cloud · Segurança',
    sections: {
      hooks: CHEATSHEET_HOOKS,
      depRows: [
        ['Effect: Allow/Deny', 'Allow concede; Deny nega (explícito prevalece)'],
        ['Action', 'serviço:operação (ex: s3:GetObject, iam:CreateRole)'],
        ['Resource', 'ARN específico ou * — preferir ARN para least privilege'],
        ['Condition', 'Lógica condicional — MFA, região, tags, org, IP'],
        ['Principal', 'Quem pode assumir a role (trust policy)'],
      ],
      rules: CHEATSHEET_RULES,
      performanceTips: [
        'Camadas de avaliação: Deny explícito → SCP → Boundary → Allow (DEAR)',
        'Roles em todos os serviços: credenciais temporárias = segurança superior',
        'ExternalId obrigatório quando terceiros assumem roles na sua conta',
        'BoolIfExists para MFA: evita bloqueio de chamadas sem contexto MFA',
        'IAM Identity Center para humanos: zero access keys em contas filhas',
        'OIDC para CI/CD: zero secrets, credenciais por job, auditável',
      ],
      patterns: [
        {
          name: 'AssumeRole cross-account',
          code: `# Trust policy na Conta B
{
  "Principal": {
    "AWS": "arn:aws:iam::111111:role/CIRole"
  },
  "Action": "sts:AssumeRole",
  "Condition": {
    "StringEquals": {
      "sts:ExternalId": "uuid-secreto"
    }
  }
}`,
          desc: 'Principal específico + ExternalId = proteção contra confused deputy',
        },
        {
          name: 'ABAC — controle por tags',
          code: `{
  "Effect": "Allow",
  "Action": ["ec2:*", "s3:*"],
  "Resource": "*",
  "Condition": {
    "StringEquals": {
      "aws:ResourceTag/team":
        "\${aws:PrincipalTag/team}"
    }
  }
}`,
          desc: 'Uma policy serve todos os times — apenas tags variam',
        },
        {
          name: 'MFA para ações destrutivas (BoolIfExists)',
          code: `{
  "Effect": "Deny",
  "Action": [
    "s3:DeleteBucket",
    "ec2:TerminateInstances"
  ],
  "Resource": "*",
  "Condition": {
    "BoolIfExists": {
      "aws:MultiFactorAuthPresent": "false"
    }
  }
}`,
          desc: 'BoolIfExists: só avalia se a chave existir no contexto',
        },
      ],
      mentalModels: [
        'DEAR: Deny → SCP → Boundary → Allow (ordem de avaliação)',
        'Roles = Temporária + Transferível + Tratável (superior a access keys)',
        'SCP = Safety Ceiling Policy (organizacional, teto da conta)',
        'ABAC = Tag-Match = Escala (uma policy serve toda a org)',
        'ExternalId = senha da trust policy para terceiros (confused deputy)',
      ],
    },
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'AWS IAM',
    stackLabel: 'Cloud · Segurança',
  }),
  mindmap: () => buildMindmapPdf({
    categories: MINDMAP_CATEGORIES,
    checklist: MINDMAP_CHECKLIST,
    accentColor: C,
    skillName: 'AWS IAM',
    stackLabel: 'Cloud · Segurança',
    checklistTitle: 'Auto-avaliação pré-entrevista',
    checklistDesc: 'Responda SIM para pelo menos 8 antes de ir a uma entrevista sênior de cloud.',
  }),
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function IamPdfs() {
  const [open, setOpen] = useState<PdfCard | null>(null)
  const hero = PDF_CARDS[0]
  const rest = PDF_CARDS.slice(1)

  return (
    <>
      <HeroCard card={hero} accent={C} onOpen={() => setOpen(hero)} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 16 }}>
        {rest.map(c => (
          <CollectionCard key={c.id} card={c} accent={C} onOpen={() => setOpen(c)} />
        ))}
      </div>
      {open && <PdfModal card={open} onClose={() => setOpen(null)} builders={PDF_BUILDERS} />}
    </>
  )
}
