import type { SkillContent } from '@/types'

const iam: SkillContent = {
  tagline: "Controle de acesso da AWS — users, roles, policies e princípio do menor privilégio.",
  why: "IAM mal configurado é a causa de 90% dos incidents de segurança na AWS. Sênior precisa entender roles, policies, SCP, permission boundaries e como implementar least privilege de forma escalável.",
  summary: "AWS IAM (Identity and Access Management) controla quem pode fazer o que na AWS. Componentes: Users (pessoas), Groups (conjunto de users), Roles (identidade assumível por serviço ou usuário), Policies (documento JSON de permissões). Princípio do menor privilégio: conceda só o necessário. SCPs controlam os limites de toda a Organization. IAM Access Analyzer detecta acessos não intencionais.",
  keypoints: [
    { title: "Policies", body: "JSON com Statement[]: Effect (Allow/Deny), Action (serviço:operação), Resource (ARN), Condition opcional. Identity-based: anexada ao principal (user, group, role). Resource-based: anexada ao recurso (S3 bucket policy, Lambda resource policy). Deny explícito sempre prevalece sobre Allow." },
    { title: "Roles", body: "Identidade sem credencial permanente. Assumida por EC2 (instance profile), Lambda (execution role), ECS (task role), serviços AWS e usuários federated (SSO/SAML). Credenciais temporárias rotacionadas automaticamente (15 min–12 h). Nunca use access keys em serviços — sempre roles." },
    { title: "Least Privilege", body: "Comece sem nenhuma permissão, adicione só o necessário. IAM Access Analyzer identifica permissões não usadas nos últimos 90 dias. Policy Generation analisa CloudTrail e gera policy com o mínimo necessário. Revisar permissões periodicamente." },
    { title: "SCP (Service Control Policy)", body: "Política de AWS Organizations que define o limite máximo de permissões para contas e OUs inteiras. Mesmo AdministratorAccess não pode fazer o que um SCP nega. Guardrail organizacional: bloquear regiões não aprovadas, serviços fora do escopo, ações críticas sem MFA." },
    { title: "Permission Boundaries", body: "Define o limite máximo de permissões que um user ou role pode ter, independentemente das policies anexadas. Útil para delegar criação de IAM a times sem risco de privilege escalation: o time pode criar roles, mas nunca com mais permissões do que o boundary permite." },
    { title: "Assume Role / STS", body: "aws sts assume-role retorna credenciais temporárias (AccessKeyId + SecretAccessKey + SessionToken). Fluxo cross-account: conta A assume role na conta B com trust policy que permite a conta A. Base para acesso multi-conta seguro." },
    { title: "ABAC vs RBAC", body: "RBAC: permissões baseadas em roles fixas (ex: role 'developer' tem acesso ao ambiente 'dev'). ABAC: permissões baseadas em atributos/tags (ex: tag 'env=prod' no recurso + tag 'env=prod' na sessão = acesso permitido). ABAC escala melhor em organizações grandes — uma policy com condição em tag substitui centenas de roles." },
    { title: "Service-Linked Roles", body: "Roles pré-definidas pela AWS para serviços específicos (ex: AWSServiceRoleForECS, AWSServiceRoleForRDS). Criadas automaticamente pelo serviço na primeira vez. Trust policy não editável. Permissões gerenciadas pela AWS — você não pode alterar. Facilitam configuração de serviços sem precisar criar roles manualmente." },
  ],
  diagrams: [
    {
      title: "Avaliação de permissão IAM — ordem de decisão",
      html: `<style>
.iam-flow{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.iam-step{display:flex;align-items:flex-start;gap:10px;margin-bottom:10px}
.iam-num{background:#1e293b;border:1.5px solid #334155;border-radius:50%;width:26px;height:26px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;color:#94a3b8}
.iam-box{background:#1e293b;border-radius:8px;padding:9px 13px;font-size:11px;flex:1}
.iam-deny{border-left:3px solid #ef4444}
.iam-allow{border-left:3px solid #4ade80}
.iam-neutral{border-left:3px solid #475569}
.iam-result{border-radius:8px;padding:10px 14px;font-size:12px;font-weight:700;text-align:center;margin-top:8px}
</style>
<div class="iam-flow">
<p style="font-size:10px;color:#64748b;margin:0 0 14px">Quando um principal faz uma chamada à API AWS, esta sequência é avaliada em ordem:</p>
<div class="iam-step">
  <div class="iam-num" style="border-color:#ef4444;color:#ef4444">1</div>
  <div class="iam-box iam-deny">
    <strong style="color:#ef4444">Deny explícito?</strong>
    <span style="color:#94a3b8"> — Qualquer Deny em qualquer policy (SCP, resource-based, identity-based, permissions boundary) encerra imediatamente.</span>
    <div style="margin-top:4px;font-size:10px;color:#ef4444">→ DENY (sem exceção)</div>
  </div>
</div>
<div class="iam-step">
  <div class="iam-num" style="border-color:#f59e0b;color:#f59e0b">2</div>
  <div class="iam-box iam-neutral" style="border-color:#f59e0b">
    <strong style="color:#f59e0b">SCP permite?</strong>
    <span style="color:#94a3b8"> — Se há SCP (AWS Organizations), a ação deve estar dentro do que o SCP permite.</span>
    <div style="margin-top:4px;font-size:10px;color:#f59e0b">→ Não permite: DENY</div>
  </div>
</div>
<div class="iam-step">
  <div class="iam-num" style="border-color:#f59e0b;color:#f59e0b">3</div>
  <div class="iam-box iam-neutral" style="border-color:#f59e0b">
    <strong style="color:#f59e0b">Permissions boundary permite?</strong>
    <span style="color:#94a3b8"> — Se o principal tem boundary definido, a ação deve estar dentro do boundary.</span>
    <div style="margin-top:4px;font-size:10px;color:#f59e0b">→ Não permite: DENY</div>
  </div>
</div>
<div class="iam-step">
  <div class="iam-num" style="border-color:#4ade80;color:#4ade80">4</div>
  <div class="iam-box iam-allow">
    <strong style="color:#4ade80">Allow em alguma policy?</strong>
    <span style="color:#94a3b8"> — Identity-based ou resource-based policy permite explicitamente.</span>
    <div style="margin-top:4px;font-size:10px;color:#4ade80">→ Sim: ALLOW | Não: DENY implícito</div>
  </div>
</div>
<div style="background:#1e293b;border-radius:8px;padding:10px 14px;margin-top:4px;font-size:11px;color:#94a3b8">
  <strong style="color:#e2e8f0">Regra de ouro:</strong> IAM começa negando tudo. Você precisa de Allow explícito em todos os níveis aplicáveis. Um único Deny explícito encerra — sem exceção.
</div>
</div>`,
      caption: "A avaliação de permissão percorre essa ordem. Um Deny explícito em qualquer camada é definitivo. O Allow só é concedido quando todas as camadas aplicáveis permitem.",
    },
    {
      title: "Assume Role cross-account — fluxo completo",
      html: `<style>
.iam-cross{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0;font-size:11px}
.iam-cross-row{display:flex;gap:12px;align-items:stretch;margin-bottom:12px}
.iam-cross-box{background:#1e293b;border-radius:8px;padding:12px;flex:1;border-top:2px solid #334155}
.iam-cross-title{font-weight:700;margin-bottom:6px;font-size:10px;letter-spacing:.05em;text-transform:uppercase;color:#64748b}
.iam-cross-arrow{display:flex;align-items:center;color:#475569;font-size:18px;padding:0 4px}
.iam-cross-step{display:flex;gap:8px;align-items:flex-start;margin:4px 0}
.iam-cross-badge{background:#1e40af;color:#93c5fd;border-radius:4px;padding:1px 6px;font-size:9px;font-weight:700;flex-shrink:0}
.iam-cross-sts{background:#7c3aed;color:#c4b5fd;border-radius:4px;padding:1px 6px;font-size:9px;font-weight:700;flex-shrink:0}
</style>
<div class="iam-cross">
<div style="font-size:10px;color:#64748b;margin-bottom:14px">Fluxo de acesso cross-account via AssumeRole — sem compartilhamento de credenciais permanentes</div>
<div class="iam-cross-row">
  <div class="iam-cross-box" style="border-color:#3b82f6">
    <div class="iam-cross-title" style="color:#60a5fa">Conta A — Developer (111111)</div>
    <div class="iam-cross-step"><span class="iam-cross-badge">PRINCIPAL</span><span style="color:#94a3b8">IAM User ou Role com permissão <code style="color:#7dd3fc">sts:AssumeRole</code> no ARN da role destino</span></div>
  </div>
  <div class="iam-cross-arrow">→</div>
  <div class="iam-cross-box" style="border-color:#7c3aed">
    <div class="iam-cross-title" style="color:#a78bfa">AWS STS (Security Token Service)</div>
    <div class="iam-cross-step"><span class="iam-cross-sts">STS</span><span style="color:#94a3b8">Valida trust policy, gera credenciais temporárias: <code style="color:#c4b5fd">AccessKeyId + SecretAccessKey + SessionToken</code> — válidas 1–12 h</span></div>
  </div>
  <div class="iam-cross-arrow">→</div>
  <div class="iam-cross-box" style="border-color:#10b981">
    <div class="iam-cross-title" style="color:#34d399">Conta B — Produção (222222)</div>
    <div class="iam-cross-step"><span style="background:#064e3b;color:#34d399;border-radius:4px;padding:1px 6px;font-size:9px;font-weight:700;flex-shrink:0">ROLE</span><span style="color:#94a3b8">Trust policy: <code style="color:#6ee7b7">Principal: {AWS: "arn:aws:iam::111111:root"}</code>. Permissions policy define o que a role pode fazer na Conta B.</span></div>
  </div>
</div>
<div style="background:#1e293b;border-radius:8px;padding:10px 14px;font-size:11px;color:#94a3b8">
  <strong style="color:#e2e8f0">Auditoria:</strong> CloudTrail da Conta A registra <code>AssumeRole</code>. CloudTrail da Conta B registra as ações com a identidade <em>assumed-role/NomeRole/SessionName</em>. Rastreável em ambas as contas.
</div>
</div>`,
      caption: "AssumeRole separa as credenciais permanentes (Conta A) das temporárias (Conta B). A trust policy define quem pode assumir, a permissions policy define o que pode fazer.",
    },
    {
      title: "ABAC vs RBAC — escalabilidade de permissões",
      html: `<style>
.iam-abac{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0;font-size:11px}
.iam-abac-cols{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:12px}
.iam-abac-card{background:#1e293b;border-radius:8px;padding:12px}
.iam-abac-h{font-weight:700;font-size:10px;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px}
.iam-abac-item{display:flex;gap:6px;margin:5px 0;align-items:flex-start;color:#94a3b8}
.iam-abac-dot{width:6px;height:6px;border-radius:50%;margin-top:4px;flex-shrink:0}
.iam-abac-code{background:#0f172a;border-radius:6px;padding:8px 10px;font-size:9.5px;font-family:'JetBrains Mono',monospace;color:#7dd3fc;margin-top:8px;line-height:1.6}
</style>
<div class="iam-abac">
<div class="iam-abac-cols">
  <div class="iam-abac-card" style="border-top:2px solid #3b82f6">
    <div class="iam-abac-h" style="color:#60a5fa">RBAC — Role-Based</div>
    <div class="iam-abac-item"><div class="iam-abac-dot" style="background:#3b82f6"></div>Uma role por combinação de time × ambiente</div>
    <div class="iam-abac-item"><div class="iam-abac-dot" style="background:#3b82f6"></div>10 times × 3 ambientes = 30 roles</div>
    <div class="iam-abac-item"><div class="iam-abac-dot" style="background:#ef4444"></div>Cresce exponencialmente com a organização</div>
    <div class="iam-abac-item"><div class="iam-abac-dot" style="background:#ef4444"></div>Cada nova combinação exige nova role + policy</div>
    <div class="iam-abac-code">role: developer-prod-team-a<br/>role: developer-dev-team-a<br/>role: developer-prod-team-b<br/><span style="color:#475569">... (n × m roles)</span></div>
  </div>
  <div class="iam-abac-card" style="border-top:2px solid #10b981">
    <div class="iam-abac-h" style="color:#34d399">ABAC — Attribute-Based</div>
    <div class="iam-abac-item"><div class="iam-abac-dot" style="background:#10b981"></div>Uma policy, condições em tags</div>
    <div class="iam-abac-item"><div class="iam-abac-dot" style="background:#10b981"></div>Tag na sessão deve igualar tag do recurso</div>
    <div class="iam-abac-item"><div class="iam-abac-dot" style="background:#10b981"></div>Adicionar time/ambiente = só adicionar tags</div>
    <div class="iam-abac-item"><div class="iam-abac-dot" style="background:#10b981"></div>Auditoria por tag, não por role</div>
    <div class="iam-abac-code">Condition: StringEquals:<br/>  aws:ResourceTag/team:<br/>    "${"\${aws:PrincipalTag/team}"}"<br/>  aws:ResourceTag/env:<br/>    "${"\${aws:PrincipalTag/env}"}"</div>
  </div>
</div>
<div style="background:#1e293b;border-radius:8px;padding:10px 14px;font-size:11px;color:#94a3b8">
  <strong style="color:#e2e8f0">Quando usar ABAC:</strong> organizações grandes com muitos times/ambientes. Tags no recurso (S3, EC2, RDS) e na sessão (via role tag / Identity Center attribute) são comparadas pela policy — sem criar nova role para cada combinação.
</div>
</div>`,
      caption: "ABAC substitui explosão de roles por condições em tags. Uma policy cobre toda a organização; basta etiquetar recursos e sessões corretamente.",
    },
    {
      title: "Permission Boundaries — delegação segura",
      html: `<style>
.iam-pb{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0;font-size:11px}
.iam-pb-ring{position:relative;margin:0 auto 14px;max-width:380px}
.iam-pb-outer{border:2px dashed #f59e0b;border-radius:10px;padding:16px;text-align:center;color:#f59e0b;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em}
.iam-pb-inner{border:2px solid #3b82f6;border-radius:8px;padding:12px;margin:10px 0;color:#60a5fa;font-size:10px;font-weight:700}
.iam-pb-actual{background:#1e3a5f;border-radius:6px;padding:8px;margin:8px 0;color:#93c5fd;font-size:10px}
.iam-pb-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px}
.iam-pb-col{background:#1e293b;border-radius:8px;padding:10px}
.iam-pb-colh{font-weight:700;font-size:9px;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px}
.iam-pb-li{color:#94a3b8;margin:3px 0}
</style>
<div class="iam-pb">
<div class="iam-pb-ring">
  <div class="iam-pb-outer">
    Permissions Boundary (limite máximo definido pelo admin)
    <div class="iam-pb-inner">
      Identity Policy (permissões concedidas ao principal)
      <div class="iam-pb-actual">Permissões efetivas = interseção entre boundary e identity policy</div>
    </div>
    Ações dentro do boundary mas fora da identity policy → DENY<br/>Ações fora do boundary (mesmo na identity policy) → DENY
  </div>
</div>
<div class="iam-pb-row">
  <div class="iam-pb-col">
    <div class="iam-pb-colh" style="color:#f59e0b">Sem Boundary</div>
    <div class="iam-pb-li">Time cria role com <code>iam:*</code></div>
    <div class="iam-pb-li">Role criada pode escalar para AdministratorAccess</div>
    <div class="iam-pb-li">Privilege escalation descontrolado</div>
  </div>
  <div class="iam-pb-col">
    <div class="iam-pb-colh" style="color:#4ade80">Com Boundary</div>
    <div class="iam-pb-li">Admin define boundary = escopo máximo</div>
    <div class="iam-pb-li">Time cria roles livremente dentro do escopo</div>
    <div class="iam-pb-li">Nenhuma role criada excede o boundary</div>
  </div>
</div>
</div>`,
      caption: "Permission Boundary define o teto. As permissões efetivas são sempre a interseção entre boundary e identity policy — nunca a união.",
    },
  ],
  mnemonics: [
    {
      label: "DEAR — ordem de avaliação de policies",
      trick: "D-E-A-R: Deny explícito → Evaluate SCP → Assess boundary → Resource/identity Allow",
      explanation: "Deny explícito vem primeiro e é imediato. Em seguida SCP (Organizations), depois Permissions Boundary, por último verifica se há Allow na identity ou resource policy. Sem Allow explícito em todos os níveis = DENY implícito.",
    },
    {
      label: "3T das Roles — Temporária, Transferível, Tratável",
      trick: "Role = credencial Temporária, assumida por qualquer Tipo de principal, auditável via CloudTrail (Tratável).",
      explanation: "Temporária: expira automaticamente (15 min–12 h), sem necessidade de rotação manual. Transferível: qualquer serviço AWS, usuário, ou conta pode assumir (conforme trust policy). Tratável: CloudTrail registra quem assumiu, quando e por quanto tempo — rastreabilidade completa.",
    },
    {
      label: "SCP = Safety Ceiling Policy",
      trick: "SCP é o teto de segurança da organização — ninguém ultrapassa, nem o admin da conta.",
      explanation: "Mesmo uma conta com AdministratorAccess ou um root user não pode fazer o que um SCP nega. O SCP é o guardrail da organização inteira. Diferente de permission boundary (por principal), SCP se aplica a toda a conta ou OU.",
    },
    {
      label: "ABAC = Tag-Match = Escala",
      trick: "ABAC: se as tags batem, o acesso é concedido. Tags no principal = tags no recurso → Allow.",
      explanation: "Attribute-Based Access Control usa condição StringEquals em tags de sessão vs tags de recurso. Uma única policy serve toda a organização: adicionar novo time = adicionar tags, não criar nova role. Elimina a explosão de roles do modelo RBAC.",
    },
  ],
  cheatsheet: {
    title: "IAM — Cheatsheet de referência rápida",
    html: `<style>
.iam-cs{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0;font-size:11px}
.iam-cs-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px}
.iam-cs-card{background:#1e293b;border-radius:8px;padding:11px}
.iam-cs-h{font-weight:700;font-size:10px;text-transform:uppercase;letter-spacing:.04em;margin-bottom:7px;padding-bottom:5px;border-bottom:1px solid #334155}
.iam-cs-row{display:flex;justify-content:space-between;align-items:baseline;margin:4px 0;gap:8px}
.iam-cs-k{color:#94a3b8;flex-shrink:0}
.iam-cs-v{color:#e2e8f0;font-weight:600;text-align:right;font-size:10px}
.iam-cs-badge{display:inline-block;border-radius:3px;padding:1px 5px;font-size:9px;font-weight:700}
.iam-cs-code{background:#0f172a;border-radius:6px;padding:8px 10px;font-family:'JetBrains Mono',monospace;font-size:9.5px;color:#7dd3fc;margin-top:8px;line-height:1.65}
</style>
<div class="iam-cs">
<div class="iam-cs-grid">
  <div class="iam-cs-card">
    <div class="iam-cs-h" style="color:#60a5fa">Componentes IAM</div>
    <div class="iam-cs-row"><span class="iam-cs-k">User</span><span class="iam-cs-v">Pessoa / access key permanente</span></div>
    <div class="iam-cs-row"><span class="iam-cs-k">Group</span><span class="iam-cs-v">Conjunto de users (sem nesting)</span></div>
    <div class="iam-cs-row"><span class="iam-cs-k">Role</span><span class="iam-cs-v">Identidade temporária assumível</span></div>
    <div class="iam-cs-row"><span class="iam-cs-k">Policy</span><span class="iam-cs-v">JSON de permissões</span></div>
    <div class="iam-cs-row"><span class="iam-cs-k">Instance Profile</span><span class="iam-cs-v">Role para EC2</span></div>
    <div class="iam-cs-row"><span class="iam-cs-k">STS duration</span><span class="iam-cs-v">15 min – 12 h</span></div>
  </div>
  <div class="iam-cs-card">
    <div class="iam-cs-h" style="color:#a78bfa">Camadas de controle</div>
    <div class="iam-cs-row"><span class="iam-cs-k">SCP</span><span class="iam-cs-v">Toda conta/OU (Organizations)</span></div>
    <div class="iam-cs-row"><span class="iam-cs-k">Perm. Boundary</span><span class="iam-cs-v">User ou role individual</span></div>
    <div class="iam-cs-row"><span class="iam-cs-k">Identity policy</span><span class="iam-cs-v">Anexada ao principal</span></div>
    <div class="iam-cs-row"><span class="iam-cs-k">Resource policy</span><span class="iam-cs-v">Anexada ao recurso</span></div>
    <div class="iam-cs-row"><span class="iam-cs-k">Session policy</span><span class="iam-cs-v">Passada no AssumeRole</span></div>
    <div class="iam-cs-row"><span class="iam-cs-k">ACL</span><span class="iam-cs-v">S3 legacy (evitar)</span></div>
  </div>
  <div class="iam-cs-card">
    <div class="iam-cs-h" style="color:#34d399">Condition keys comuns</div>
    <div class="iam-cs-row"><span class="iam-cs-k">aws:MultiFactorAuthPresent</span><span class="iam-cs-v" style="color:#34d399">true</span></div>
    <div class="iam-cs-row"><span class="iam-cs-k">aws:RequestedRegion</span><span class="iam-cs-v">us-east-1,...</span></div>
    <div class="iam-cs-row"><span class="iam-cs-k">aws:PrincipalOrgID</span><span class="iam-cs-v">o-xxxx</span></div>
    <div class="iam-cs-row"><span class="iam-cs-k">aws:PrincipalTag/env</span><span class="iam-cs-v">prod</span></div>
    <div class="iam-cs-row"><span class="iam-cs-k">aws:SourceIp</span><span class="iam-cs-v">CIDR restrito</span></div>
    <div class="iam-cs-row"><span class="iam-cs-k">s3:prefix</span><span class="iam-cs-v">tenants/${"\${aws:username}"}/</span></div>
  </div>
  <div class="iam-cs-card">
    <div class="iam-cs-h" style="color:#fb923c">Ferramentas de análise</div>
    <div class="iam-cs-row"><span class="iam-cs-k">Access Analyzer</span><span class="iam-cs-v">Acesso externo / não-usado</span></div>
    <div class="iam-cs-row"><span class="iam-cs-k">Policy Generator</span><span class="iam-cs-v">Analisa CloudTrail → policy mínima</span></div>
    <div class="iam-cs-row"><span class="iam-cs-k">Policy Simulator</span><span class="iam-cs-v">Testa policy antes de aplicar</span></div>
    <div class="iam-cs-row"><span class="iam-cs-k">CloudTrail</span><span class="iam-cs-v">Auditoria de todas as ações IAM</span></div>
    <div class="iam-cs-row"><span class="iam-cs-k">Credential Report</span><span class="iam-cs-v">Status de todos os usuários</span></div>
  </div>
</div>
<div class="iam-cs-code">
# Avaliação resumida: DENY implícito é o padrão<br/>
# Allow só acontece se: SCP ✓ + boundary ✓ + identity/resource policy Allow ✓<br/>
# Deny explícito em qualquer camada: DENY imediato, sem exceção<br/>
<br/>
aws sts assume-role \\<br/>
  --role-arn arn:aws:iam::222222:role/CrossAccountRole \\<br/>
  --role-session-name MySession \\<br/>
  --duration-seconds 3600
</div>
</div>`,
    caption: "Referência rápida dos componentes, camadas de controle, condition keys mais usadas e ferramentas de análise de permissões IAM.",
  },
  mindmap: {
    title: "IAM — Mapa mental de conceitos",
    html: `<style>
.iam-mm{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0;font-size:11px}
.iam-mm-center{background:#ef4444;color:#fff;border-radius:10px;padding:8px 18px;font-weight:700;font-size:13px;text-align:center;display:inline-block;margin-bottom:16px}
.iam-mm-branches{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}
.iam-mm-branch{background:#1e293b;border-radius:8px;padding:11px}
.iam-mm-bh{font-weight:700;font-size:10px;text-transform:uppercase;letter-spacing:.04em;margin-bottom:7px}
.iam-mm-leaf{color:#94a3b8;margin:3px 0;padding-left:8px;border-left:2px solid #334155;font-size:10px}
.iam-mm-leaf strong{color:#e2e8f0}
</style>
<div class="iam-mm">
<div style="text-align:center"><div class="iam-mm-center">AWS IAM</div></div>
<div class="iam-mm-branches">
  <div class="iam-mm-branch">
    <div class="iam-mm-bh" style="color:#60a5fa">Identidades</div>
    <div class="iam-mm-leaf"><strong>User</strong> — pessoa, access key</div>
    <div class="iam-mm-leaf"><strong>Group</strong> — conjunto de users</div>
    <div class="iam-mm-leaf"><strong>Role</strong> — temporária, assumível</div>
    <div class="iam-mm-leaf"><strong>Root</strong> — evitar uso diário</div>
    <div class="iam-mm-leaf"><strong>Federated</strong> — SSO/SAML/OIDC</div>
  </div>
  <div class="iam-mm-branch">
    <div class="iam-mm-bh" style="color:#a78bfa">Policies</div>
    <div class="iam-mm-leaf"><strong>Identity-based</strong> — no principal</div>
    <div class="iam-mm-leaf"><strong>Resource-based</strong> — no recurso</div>
    <div class="iam-mm-leaf"><strong>SCP</strong> — toda a OU/conta</div>
    <div class="iam-mm-leaf"><strong>Boundary</strong> — teto por principal</div>
    <div class="iam-mm-leaf"><strong>Session</strong> — passada no AssumeRole</div>
  </div>
  <div class="iam-mm-branch">
    <div class="iam-mm-bh" style="color:#34d399">Fluxo de avaliação</div>
    <div class="iam-mm-leaf"><strong>1.</strong> Deny explícito → DENY</div>
    <div class="iam-mm-leaf"><strong>2.</strong> SCP não permite → DENY</div>
    <div class="iam-mm-leaf"><strong>3.</strong> Boundary não permite → DENY</div>
    <div class="iam-mm-leaf"><strong>4.</strong> Allow presente → ALLOW</div>
    <div class="iam-mm-leaf"><strong>5.</strong> Sem Allow → DENY implícito</div>
  </div>
  <div class="iam-mm-branch">
    <div class="iam-mm-bh" style="color:#fb923c">Serviços relacionados</div>
    <div class="iam-mm-leaf"><strong>STS</strong> — credenciais temporárias</div>
    <div class="iam-mm-leaf"><strong>Access Analyzer</strong> — findings</div>
    <div class="iam-mm-leaf"><strong>CloudTrail</strong> — auditoria</div>
    <div class="iam-mm-leaf"><strong>Organizations</strong> — SCPs</div>
    <div class="iam-mm-leaf"><strong>IAM Identity Center</strong> — SSO</div>
  </div>
  <div class="iam-mm-branch">
    <div class="iam-mm-bh" style="color:#f87171">Segurança</div>
    <div class="iam-mm-leaf"><strong>Least privilege</strong> — mínimo necessário</div>
    <div class="iam-mm-leaf"><strong>MFA</strong> — obrigatório no root</div>
    <div class="iam-mm-leaf"><strong>Rotation</strong> — access keys 90 dias</div>
    <div class="iam-mm-leaf"><strong>No hardcoded keys</strong> — usar roles</div>
    <div class="iam-mm-leaf"><strong>Credential report</strong> — auditoria</div>
  </div>
  <div class="iam-mm-branch">
    <div class="iam-mm-bh" style="color:#fbbf24">Padrões avançados</div>
    <div class="iam-mm-leaf"><strong>ABAC</strong> — controle por tags</div>
    <div class="iam-mm-leaf"><strong>Cross-account</strong> — trust policy</div>
    <div class="iam-mm-leaf"><strong>Service-linked roles</strong> — por serviço</div>
    <div class="iam-mm-leaf"><strong>Permission boundary</strong> — delegação</div>
    <div class="iam-mm-leaf"><strong>Policy Generator</strong> — CloudTrail → policy</div>
  </div>
</div>
</div>`,
    caption: "Visão panorâmica do IAM: identidades, policies, fluxo de avaliação, serviços auxiliares, práticas de segurança e padrões avançados.",
  },
  codeExamples: [
    {
      title: "Policy com least privilege — S3 prefixo por usuário",
      language: "json",
      code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::meu-bucket/usuarios/\${aws:username}/*"
    },
    {
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::meu-bucket",
      "Condition": {
        "StringLike": {
          "s3:prefix": ["usuarios/\${aws:username}/*"]
        }
      }
    }
  ]
}`,
    },
    {
      title: "Trust policy para cross-account AssumeRole",
      language: "json",
      code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::111111111111:role/CIRole"
      },
      "Action": "sts:AssumeRole",
      "Condition": {
        "StringEquals": {
          "sts:ExternalId": "meu-external-id-secreto"
        },
        "Bool": {
          "aws:MultiFactorAuthPresent": "true"
        }
      }
    }
  ]
}`,
    },
    {
      title: "SCP — bloquear regiões não aprovadas",
      language: "json",
      code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Deny",
      "NotAction": [
        "iam:*",
        "organizations:*",
        "support:*",
        "sts:*"
      ],
      "Resource": "*",
      "Condition": {
        "StringNotEquals": {
          "aws:RequestedRegion": [
            "us-east-1",
            "sa-east-1"
          ]
        }
      }
    }
  ]
}`,
    },
    {
      title: "ABAC — policy por tags de sessão (time × ambiente)",
      language: "json",
      code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["ec2:StartInstances", "ec2:StopInstances", "ec2:DescribeInstances"],
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "aws:ResourceTag/team": "\${aws:PrincipalTag/team}",
          "aws:ResourceTag/env":  "\${aws:PrincipalTag/env}"
        }
      }
    }
  ]
}`,
    },
    {
      title: "AssumeRole via CLI e uso das credenciais temporárias",
      language: "bash",
      code: `# Assumir role cross-account
CREDS=$(aws sts assume-role \\
  --role-arn arn:aws:iam::222222222222:role/DeployRole \\
  --role-session-name ci-deploy-$(date +%s) \\
  --duration-seconds 3600 \\
  --output json)

# Exportar credenciais temporárias
export AWS_ACCESS_KEY_ID=$(echo $CREDS | jq -r .Credentials.AccessKeyId)
export AWS_SECRET_ACCESS_KEY=$(echo $CREDS | jq -r .Credentials.SecretAccessKey)
export AWS_SESSION_TOKEN=$(echo $CREDS | jq -r .Credentials.SessionToken)

# Verificar identidade assumida
aws sts get-caller-identity
# Output: arn:aws:sts::222222222222:assumed-role/DeployRole/ci-deploy-...`,
    },
  ],
  gotchas: [
    "AdministratorAccess para tudo — viola least privilege. Em caso de comprometimento, blast radius é total.",
    "Access keys de usuário em código ou repositório — rotacionar imediatamente, usar roles em serviços. Ferramentas como git-secrets ou gitleaks detectam antes do commit.",
    "Role com trust policy aberta (Principal: '*') — qualquer conta AWS pode assumir a role. Sempre especifique o principal exato.",
    "Root account sem MFA — a conta root pode fazer qualquer coisa, inclusive deletar a própria conta. MFA é obrigatório.",
    "Policy com Resource: '*' quando deveria ser ARN específico — acesso a todos os recursos do tipo, não apenas os necessários.",
    "Inline policies em vez de managed — inline policies são invisíveis ao IAM Access Analyzer e difíceis de auditar em escala. Prefira customer managed policies.",
    "Esquecer ExternalId em trust policies cross-account para terceiros — sem ExternalId, qualquer conta que souber o ARN pode tentar assumir a role (confused deputy attack).",
    "Permission boundary sem condição iam:PassedToService — a role pode ser criada com permissão total passada a outro serviço, contornando o boundary.",
  ],
  interview: [
    {
      q: "Por que usar roles em vez de access keys para serviços AWS?",
      a: "<p>Roles fornecem credenciais temporárias rotacionadas automaticamente (15 min–12 h). Access keys são permanentes — se vazadas comprometem indefinidamente até rotação manual.</p><p>EC2 com instance profile, Lambda com execution role, ECS com task role — todos usam roles. A credencial nunca precisa ser gerenciada ou rotacionada manualmente. Em caso de comprometimento, a credencial temporária expira sozinha.</p>",
      tip: "Resposta de nível: mencionar que STS também registra no CloudTrail, tornando o acesso rastreável — diferente de access key onde é difícil saber quem usou se a chave foi compartilhada.",
      level: "pleno",
    },
    {
      q: "Como implementaria least privilege na prática?",
      a: "<p>1. Negar tudo por padrão (IAM faz isso automaticamente).</p><p>2. <strong>Policy Generation:</strong> IAM analisa CloudTrail dos últimos 90 dias e gera policy com as ações realmente usadas pelo principal.</p><p>3. <strong>IAM Access Analyzer:</strong> identifica permissões concedidas mas não utilizadas, recursos acessíveis de fora da conta, e acessos cross-account não intencionais.</p><p>4. <strong>SCPs:</strong> guardrails no nível organizacional — bloquear regiões não aprovadas, serviços fora do escopo, ações destrutivas sem condição MFA.</p><p>5. Revisão periódica — permissões crescem por acréscimo, raramente por remoção.</p>",
      tip: "Citar o Credential Report para auditoria de usuários inativos e a ferramente aws iam generate-service-last-accessed-details para ver quais serviços foram acessados por uma policy mostra domínio prático.",
      level: "pleno",
    },
    {
      q: "Explique como funciona Assume Role entre contas.",
      a: "<p>Cenário: Conta A (developer) precisa acessar recurso na Conta B (produção).</p><p>1. Conta B cria uma role com trust policy que permite <code>sts:AssumeRole</code> para a Conta A (ou principal específico).</p><p>2. Principal na Conta A chama <code>aws sts assume-role --role-arn arn:aws:iam::CONTA-B:role/NomeRole</code>.</p><p>3. STS retorna credenciais temporárias (access key + secret + session token) válidas por 1–12 h.</p><p>4. Principal usa essas credenciais para chamar APIs da Conta B com as permissões da role.</p><p>Auditável via CloudTrail em ambas as contas. Base para acesso multi-conta seguro sem compartilhamento de credenciais.</p>",
      tip: "Mencionar ExternalId para proteção contra confused deputy attack quando terceiros assumem roles: a conta B passa ExternalId que só a conta A conhece.",
      level: "senior",
    },
    {
      q: "Qual a diferença entre SCP e permissions boundary?",
      a: "<p><strong>SCP (Service Control Policy):</strong> aplica-se a toda uma conta ou OU no AWS Organizations. Define o teto máximo de permissões para <em>todos</em> os principals da conta. Não concede permissões — apenas restringe. Configurado pelo administrador da organização.</p><p><strong>Permissions Boundary:</strong> aplica-se a um user ou role específico. Define o teto máximo de permissões daquele principal. Útil para delegação segura: um time pode criar roles para sua aplicação, mas o boundary garante que nenhuma role criada exceda o que o boundary permite — sem risco de escalada de privilégio.</p>",
      tip: "A diferença de escopo é a chave: SCP é organizacional (cobertura ampla, configurado pelo admin central), boundary é por-principal (cobertura cirúrgica, usado para delegação). Ambos apenas restringem — nunca concedem.",
      level: "senior",
    },
    {
      q: "Como o IAM Access Analyzer ajuda na segurança?",
      a: "<p>Access Analyzer analisa resource-based policies (S3, KMS, Lambda, SQS, IAM roles) e identifica recursos acessíveis de fora da zona de confiança definida (conta ou organização).</p><p>Exemplos de findings: bucket S3 com policy que permite acesso público ou cross-account não intencional; role IAM com trust policy que permite AssumeRole de conta externa; chave KMS compartilhada com principal fora da organização.</p><p>Além disso, o módulo de análise de acessos não utilizados (IAM Access Analyzer for unused access) identifica roles e access keys que não foram usados nos últimos 90 dias — candidatos a remoção ou redução de permissões.</p>",
      tip: "Mencionar que o Access Analyzer pode ser configurado com múltiplos analyzers: um com escopo de conta (findings de acesso externo à conta) e outro com escopo de organização (findings de acesso externo à org). Isso dá granularidade ao monitoramento.",
      level: "senior",
    },
    {
      q: "O que é uma condition em uma IAM policy e cite exemplos práticos?",
      a: "<p>Condition adiciona lógica condicional à avaliação do statement. Sintaxe: operador de condição → chave de condição → valor.</p><p>Exemplos práticos:</p><ul><li><code>aws:MultiFactorAuthPresent: true</code> — exige MFA para ações destrutivas (DeleteBucket, TerminateInstances).</li><li><code>aws:RequestedRegion</code> — restringe chamadas a regiões aprovadas.</li><li><code>s3:prefix</code> — limita acesso a prefixo específico no bucket (multi-tenant com prefixo por cliente).</li><li><code>aws:PrincipalOrgID</code> — permite acesso apenas a principals da própria organização AWS (resource-based policies).</li><li><code>aws:SourceVpc</code> — restringe acesso de S3 apenas a partir de VPC específica (endpoint de VPC).</li></ul>",
      tip: "Condition operators importam: StringEquals vs StringLike (wildcard), ArnLike vs ArnEquals, Bool vs BoolIfExists (quando a chave pode não estar presente). Usar operador errado é bug silencioso.",
      level: "senior",
    },
    {
      q: "O que é ABAC e quando ele escala melhor que RBAC?",
      a: "<p>ABAC (Attribute-Based Access Control) usa atributos (tags) de sessão e de recurso para determinar acesso, em vez de roles fixas.</p><p>Exemplo: uma policy com <code>Condition: {StringEquals: {'aws:ResourceTag/team': '${aws:PrincipalTag/team}'}}</code> permite acesso a qualquer recurso com a mesma tag de time do principal — sem criar roles por combinação.</p><p>RBAC com 10 times × 3 ambientes × 4 serviços = 120 roles. ABAC: 1 policy, tags nos recursos e nas sessões.</p><p>ABAC escala bem quando: times crescem dinamicamente; recursos têm lifecycle curto (ECS tasks, Lambda); o IdP (Identity Center) já emite atributos de time e departamento via SAML/OIDC.</p>",
      tip: "O ponto fraco do ABAC é auditoria: saber 'quais recursos o time X pode acessar' requer consulta ao AWS Config + Resource Groups, não uma lista simples de ARNs. RBAC é mais legível para auditorias pontuais.",
      level: "senior",
    },
    {
      q: "Como você delegaria criação de IAM roles para um time de desenvolvimento sem risco de privilege escalation?",
      a: "<p>Combinação de dois controles:</p><p>1. <strong>Permissions Boundary obrigatório:</strong> o admin cria uma boundary policy que define o teto máximo (ex: apenas acesso aos serviços do time, sem iam:CreateRole irrestrito). O time só pode criar roles se o código incluir <code>iam:PassedToService</code> com boundary obrigatório na policy de criação de role.</p><p>2. <strong>Condition na permissão iam:CreateRole:</strong> <code>Condition: {StringEquals: {'iam:PermissionsBoundary': 'arn:aws:iam::ACCOUNT:policy/DevBoundary'}}</code> — impede criar role sem a boundary.</p><p>Resultado: o time cria roles livremente para suas aplicações, mas nenhuma role criada pode exceder o boundary definido pelo admin.</p>",
      tip: "Esse padrão é clássico em plataformas de engenharia (platform teams). A boundary vira o 'contrato' entre platform e dev teams. Sem isso, qualquer dev com iam:CreateRole pode criar uma role com AdministratorAccess.",
      level: "senior",
    },
    {
      q: "Explique o que é uma service-linked role e por que você não pode editá-la.",
      a: "<p>Service-linked role é uma role IAM pré-configurada pela AWS vinculada a um serviço específico (ex: <code>AWSServiceRoleForECS</code>, <code>AWSServiceRoleForRDS</code>). A trust policy é gerenciada pela AWS e aponta para o endpoint do serviço — você não pode alterar quem pode assumir.</p><p>A permissions policy também é gerenciada pela AWS — garante que o serviço tenha exatamente o que precisa, nem mais nem menos. Isso evita que configuração incorreta quebre o serviço.</p><p>Criadas automaticamente quando você habilita o serviço. Só deletáveis quando o serviço não usa mais a role (o serviço verifica dependências antes de deixar deletar).</p>",
      tip: "Sabendo disso, quando aparecer um finding de 'role não utilizada' no Access Analyzer apontando para uma service-linked role, não delete automaticamente — pode quebrar o serviço. Verifique se o serviço ainda está ativo.",
      level: "pleno",
    },
    {
      q: "Como auditar quais permissões uma policy concede na prática sem documentação?",
      a: "<p>Ferramentas para análise de policies:</p><ul><li><strong>IAM Policy Simulator:</strong> simula chamadas de API com a policy e mostra Allow/Deny sem fazer chamadas reais. Útil para testar antes de aplicar.</li><li><strong>aws iam simulate-principal-policy:</strong> CLI do simulator, útil em pipelines de segurança.</li><li><strong>aws iam get-policy / get-policy-version:</strong> recupera o JSON da policy gerenciada.</li><li><strong>aws iam generate-service-last-accessed-details:</strong> mostra quais serviços foram acessados pelo principal nos últimos 90 dias — identifica permissões desnecessárias.</li><li><strong>aws iam list-policies-granting-service-access:</strong> dado um serviço, lista quais policies concedem acesso.</li></ul>",
      tip: "Em um cenário de incident response, a sequência é: get-caller-identity → list-attached-user/role-policies → get-policy-version para ver o JSON → simulate-principal-policy para confirmar o acesso que o atacante tinha.",
      level: "senior",
    },
    {
      q: "O que é o confused deputy problem e como o ExternalId resolve?",
      a: "<p><strong>Cenário:</strong> empresa A usa SaaS de monitoramento (empresa B). A empresa A cria role e passa o ARN ao SaaS. Um atacante descobre o ARN e cria uma conta própria no mesmo SaaS — o SaaS (B) agora pode assumir a role da empresa A <em>em nome do atacante</em>.</p><p><strong>Solução:</strong> ExternalId. A empresa A define um valor secreto na trust policy: <code>Condition: {StringEquals: {'sts:ExternalId': 'uuid-secreto-so-a-empresa-A-sabe'}}</code>. O SaaS só pode assumir a role se passar esse ExternalId — que o atacante não conhece, mesmo sabendo o ARN.</p><p>ExternalId é como uma senha para a trust policy: não substitui boas práticas, mas bloqueia o confused deputy.</p>",
      tip: "Esse problema é comum em integrações SaaS (DataDog, Splunk, third-party security tools). Sempre exigir ExternalId quando terceiros assumem roles na sua conta.",
      level: "senior",
    },
    {
      q: "Como estruturar IAM para uma organização multi-conta (AWS Organizations)?",
      a: "<p>Estrutura recomendada:</p><p><strong>1. Account Structure:</strong> conta Management (apenas Organizations/Billing), conta Security (CloudTrail, Config, GuardDuty centralizado), conta Log Archive (S3 de logs imutáveis), contas de workload por ambiente (dev/staging/prod) ou por time.</p><p><strong>2. SCPs por OU:</strong> OU Sandbox sem restrições de serviço. OU Prod com SCP bloqueando regiões não aprovadas, ações destrutivas sem MFA, criação de VPCs que quebrem design.</p><p><strong>3. Acesso centralizado via IAM Identity Center (SSO):</strong> usuários em um único IdP, permission sets propagam para todas as contas. Sem usuários IAM diretos nas contas filhas — só roles assumidas via SSO.</p><p><strong>4. Break-glass:</strong> role de emergência em cada conta prod, assumível apenas pelo admin da conta Management com MFA, auditada por alertas CloudTrail.</p>",
      tip: "O ponto que separa junior de sênior: saber que IAM Identity Center (SSO) é a forma correta de gerenciar acesso humano multi-conta — não criar usuários IAM em cada conta. Usuários IAM diretos em contas filhas são antipadrão em organizações.",
      level: "senior",
    },
    {
      q: "Como funciona federação com SAML e OIDC no IAM?",
      a: "<p><strong>SAML 2.0:</strong> IdP corporativo (Okta, Azure AD, ADFS) emite SAML assertion. O usuário chama <code>sts:AssumeRoleWithSAML</code> passando a assertion. STS valida contra o IdP configurado no IAM e retorna credenciais temporárias. Comum para acesso humano ao Console e CLI.</p><p><strong>OIDC (Web Identity):</strong> usado para workloads (EKS pods, GitHub Actions, GitLab CI). O token JWT do OIDC provider é trocado por credenciais AWS via <code>sts:AssumeRoleWithWebIdentity</code>. Trust policy valida o issuer e o sub (subject) do token — ex: apenas o repositório github.com/empresa/repo pode assumir a role.</p><p>OIDC elimina secrets em CI/CD: o GitHub Actions token é efêmero e assinado pelo GitHub — nunca precisa armazenar AWS credentials no repositório.</p>",
      tip: "GitHub Actions com OIDC é o padrão atual para deploy seguro. Sem OIDC: AWS_ACCESS_KEY_ID e AWS_SECRET_ACCESS_KEY em secrets do repo — rotação manual, risco de leak. Com OIDC: zero secrets, credenciais temporárias por job.",
      level: "senior",
    },
    {
      q: "Qual a diferença entre identity-based e resource-based policy, e quando cada uma é suficiente?",
      a: "<p><strong>Identity-based:</strong> anexada ao principal (user, group, role). Define o que aquele principal pode fazer. Necessária para a maioria das ações.</p><p><strong>Resource-based:</strong> anexada ao recurso (S3, KMS, Lambda, SQS, Secrets Manager, ECR, etc.). Define quem pode acessar aquele recurso. Permite acesso cross-account sem AssumeRole — o principal da outra conta não precisa ter a permissão na identity policy (basta a resource policy permitir).</p><p><strong>Para acesso cross-account:</strong> resource-based policy é o caminho mais simples — a conta B adiciona a conta A na bucket policy do S3, sem necessitar de role. Mas não funciona para todos os serviços (EC2, DynamoDB não têm resource-based policy).</p>",
      tip: "A armadilha: S3 cross-account com bucket policy — o principal da conta A precisa TAMBÉM ter permissão S3 na identity policy. IAM exige Allow nos dois lados (identity + resource) para cross-account, exceto quando é a mesma conta (resource policy Allow basta).",
      level: "senior",
    },
    {
      q: "Como você investigaria um acesso não autorizado detectado no CloudTrail?",
      a: "<p>Passos de incident response para IAM:</p><p>1. <strong>Identificar o principal:</strong> campo <code>userIdentity</code> no evento CloudTrail — tipo (IAMUser, AssumedRole, Root), ARN, account.</p><p>2. <strong>Traçar a origem:</strong> <code>sourceIPAddress</code>, <code>userAgent</code>, região. IP inesperado ou user agent de cloud provider diferente é red flag.</p><p>3. <strong>Revogar imediatamente:</strong> se access key → desativar/deletar. Se role → adicionar deny policy inline na role (<code>Effect: Deny, Action: *, Resource: *</code>) para invalidar sessões ativas (STS tokens ainda válidos).</p><p>4. <strong>Escopo do comprometimento:</strong> quais ações foram feitas? Novos users/roles criados? Policies modificadas? Buckets S3 exfiltrados? Recursos novos criados (cryptomining).</p><p>5. <strong>Remediar:</strong> remover recursos criados pelo atacante, rotacionar credenciais, habilitar GuardDuty (detecta padrões de comprometimento IAM).</p>",
      tip: "A ação mais crítica e contra-intuitiva: para revogar sessões ativas de uma role comprometida, não basta desanexar a role ou deletar — as credenciais STS já emitidas continuam válidas até expirar. Adicionar uma deny policy inline na role invalida toda sessão ativa imediatamente.",
      level: "senior",
    },
    {
      q: "O que é o IAM Policy Simulator e como usá-lo em pipelines?",
      a: "<p>O IAM Policy Simulator permite simular o resultado de permissões IAM sem executar ações reais. Recebe: principal, actions e resources — retorna Allow/Deny com explicação de qual statement tomou a decisão.</p><p>Via CLI em pipelines de segurança:</p><p><code>aws iam simulate-principal-policy --policy-source-arn arn:aws:iam::ACCOUNT:role/MinhaRole --action-names s3:GetObject --resource-arns arn:aws:s3:::meu-bucket/arquivo.txt</code></p><p>Uso em CI/CD: antes de aplicar mudanças de policy (Terraform plan), rodar o simulator para verificar se o novo estado concede apenas o esperado. Integrar com Open Policy Agent (OPA) ou Checkov para validação automatizada de policies.</p>",
      tip: "Simulator não simula SCPs por padrão — precisa passar as SCPs explicitamente. Em organizações grandes com SCPs, o resultado do simulator pode diferir do comportamento real se as SCPs não estiverem no contexto da simulação.",
      level: "pleno",
    },
    {
      q: "Como configurar MFA obrigatório para ações sensíveis sem bloquear o restante do acesso?",
      a: "<p>Usar condition <code>aws:MultiFactorAuthPresent</code> apenas nos statements das ações sensíveis, não em toda a policy.</p><p>Exemplo: uma policy que permite operações gerais de leitura sem MFA, mas exige MFA para deletar ou modificar:</p><p>Statement 1 (sem MFA): <code>Effect: Allow, Action: ['s3:GetObject', 'ec2:Describe*'], Resource: *</code></p><p>Statement 2 (com MFA): <code>Effect: Deny, Action: ['s3:DeleteBucket', 'ec2:TerminateInstances'], Condition: {BoolIfExists: {'aws:MultiFactorAuthPresent': false}}</code></p><p>Usar <code>BoolIfExists</code> em vez de <code>Bool</code> para cobrir o caso de chamadas sem suporte a MFA (access keys programáticas não têm contexto MFA).</p>",
      tip: "A armadilha: usar Bool em vez de BoolIfExists. Se o contexto não inclui a chave MultiFactorAuthPresent (ex: chamadas de role assumida), Bool avalia como false e bloqueia tudo. BoolIfExists só avalia se a chave existir.",
      level: "senior",
    },
    {
      q: "Quais são as melhores práticas para gerenciar access keys de longo prazo?",
      a: "<p>Access keys são necessárias apenas para acesso programático por usuários humanos fora do contexto AWS (ex: desenvolvedor local sem SSO). Para serviços, nunca use — use roles.</p><p><strong>Práticas:</strong></p><ul><li>Rotacionar a cada 90 dias (automatizável via Lambda + EventBridge).</li><li>Nunca usar as access keys do root account.</li><li>Uma access key por usuário — nunca compartilhar.</li><li>Monitorar com Credential Report: <code>aws iam generate-credential-report</code> — mostra last_used, age, rotation date.</li><li>Desativar keys inativas por 45+ dias, deletar por 90+ dias.</li><li>Usar AWS Secrets Manager ou SSM Parameter Store para armazenar, nunca variáveis de ambiente em produção.</li></ul><p>Futuro: migrar para IAM Identity Center com OIDC/SAML — elimina access keys completamente para acesso humano.</p>",
      tip: "Em 2024, a AWS passou a recomendar ativamente a descontinuação de access keys de longo prazo. IAM Identity Center com browser SSO é o padrão para humanos; OIDC é o padrão para CI/CD. Access keys viram exceção.",
      level: "pleno",
    },
    {
      q: "Como funciona a condição aws:PrincipalOrgID e quando usá-la?",
      a: "<p><code>aws:PrincipalOrgID</code> é uma condition key de contexto global que retorna o ID da organização AWS do principal que faz a chamada (ex: <code>o-ab12cd34ef</code>).</p><p>Uso principal: resource-based policies que devem ser acessíveis a <em>qualquer conta da organização</em>, mas não a contas externas.</p><p>Exemplo em bucket policy S3: <code>Condition: {StringEquals: {'aws:PrincipalOrgID': 'o-ab12cd34ef'}}</code> — qualquer role/user de qualquer conta da org pode acessar, ninguém de fora.</p><p>Vantagem: não precisa listar ARNs de todas as contas. Quando adiciona nova conta à org, automaticamente herda o acesso sem alterar a policy.</p>",
      tip: "Alternativa ao aws:PrincipalOrgID: listar cada aws:PrincipalAccount individualmente — funciona mas não escala. Quando a organização tem 50+ contas, aws:PrincipalOrgID é a única abordagem prática.",
      level: "senior",
    },
    {
      q: "Qual a diferença entre AWS managed policies, customer managed policies e inline policies?",
      a: "<p><strong>AWS managed policies:</strong> criadas e gerenciadas pela AWS (ex: <code>ReadOnlyAccess</code>, <code>AmazonS3FullAccess</code>). Atualizadas automaticamente quando novos serviços/features são lançados. Fáceis de aplicar, mas frequentemente mais permissivas do que o necessário (violam least privilege).</p><p><strong>Customer managed policies:</strong> criadas e gerenciadas por você. Versionadas (até 5 versões). Reutilizáveis em múltiplos principals. Visíveis ao IAM Access Analyzer. Recomendadas para produção.</p><p><strong>Inline policies:</strong> embutidas diretamente no user/group/role. Não reutilizáveis. Não versionadas. Deletadas junto com o principal. Invisíveis ao Access Analyzer. Usar apenas para casos excepcionais (ex: policy de emergência temporária).</p>",
      tip: "Antipadrão comum: usar AWS managed policies 'por conveniência' em produção (ex: AmazonDynamoDBFullAccess para lambda que só lê uma tabela). Melhor prática: gerar com Policy Generator baseado em CloudTrail e usar customer managed policy com least privilege real.",
      level: "pleno",
    },
    {
      q: "O que é o IAM Identity Center (antigo AWS SSO) e como substitui usuários IAM?",
      a: "<p>IAM Identity Center é o serviço de Single Sign-On da AWS. Conecta um IdP externo (Okta, Azure AD, Google Workspace, Active Directory) ou usa o diretório interno. Gerencia acesso de usuários humanos a múltiplas contas AWS via permission sets.</p><p>Fluxo: usuário faz login no portal do SSO → escolhe conta e role → recebe credenciais temporárias (access key + secret + session token) válidas por até 8 horas → usa normalmente via CLI (aws configure sso) ou Console.</p><p>Substitui: criação de usuários IAM em cada conta, grupos IAM manuais, rotação de access keys. Centraliza identidade e auditoria — um único lugar para revogar acesso a todas as contas.</p><p>Permission sets são templates de permissão (uma ou mais policies) que são provisionados como roles nas contas target automaticamente.</p>",
      tip: "Em 2024, a AWS renomeou de AWS SSO para IAM Identity Center. É a abordagem recomendada para qualquer organização com mais de 1 conta. A principal vantagem: revogar acesso de um usuário que saiu da empresa em um clique — sem varrer 20 contas deletando usuários IAM.",
      level: "senior",
    },
  ],
  exercises: [
    {
      level: "iniciante",
      title: "Criar policy de least privilege para Lambda que lê S3",
      description: "Sua Lambda precisa apenas ler objetos de um bucket S3 específico. Escreva uma IAM policy JSON com o mínimo de permissões necessárias. Depois, anote por que cada action foi incluída e se alguma pode ser removida.",
      concepts: ["least-privilege", "identity-based-policy", "s3-actions", "resource-arn"],
      hint: "s3:GetObject é para ler objetos. s3:ListBucket (com condition de prefix) pode ser necessário dependendo do código. Nenhuma ação de escrita deve estar presente.",
    },
    {
      level: "iniciante",
      title: "Configurar MFA obrigatório para ações destrutivas",
      description: "Crie uma IAM policy que permita ao usuário realizar operações normais de leitura (EC2 Describe, S3 GetObject), mas exija MFA para ações destrutivas (EC2 TerminateInstances, S3 DeleteBucket). Use BoolIfExists corretamente.",
      concepts: ["mfa", "condition-keys", "boolIfExists", "deny-override"],
    },
    {
      level: "intermediario",
      title: "Implementar AssumeRole cross-account com ExternalId",
      description: "Conta A (dev) precisa fazer deploy em Conta B (prod). Configure: (1) role na Conta B com trust policy que permite AssumeRole apenas da role CI da Conta A, com ExternalId obrigatório; (2) policy na role CI da Conta A para chamar sts:AssumeRole no ARN correto; (3) script bash que assume a role e verifica a identidade. Explique por que o ExternalId protege contra confused deputy.",
      concepts: ["cross-account", "assume-role", "external-id", "confused-deputy", "trust-policy"],
    },
    {
      level: "intermediario",
      title: "Implementar ABAC para 3 times acessando recursos próprios",
      description: "Três times (frontend, backend, data) têm recursos EC2 e S3 com tag team=<nome>. Crie uma única IAM policy que permita cada time acessar apenas seus próprios recursos usando condições em tags de sessão. Teste criando tags diferentes nos recursos e na sessão para verificar o isolamento.",
      concepts: ["abac", "attribute-based-access", "tag-conditions", "session-tags", "scalability"],
    },
    {
      level: "intermediario",
      title: "Auditar permissões não utilizadas com IAM Access Analyzer",
      description: "Habilite IAM Access Analyzer em uma conta AWS e configure análise de acessos não utilizados. Identifique: (1) roles sem uso nos últimos 90 dias; (2) recursos com acesso cross-account não intencional; (3) access keys antigas. Documente o processo de remediação para cada finding.",
      concepts: ["access-analyzer", "unused-access", "least-privilege", "findings", "remediation"],
    },
    {
      level: "senior",
      title: "Criar permission boundary para delegação segura de IAM a time de dev",
      description: "Configure um sistema onde o time de desenvolvimento pode criar roles para suas aplicações, mas não pode criar roles com mais permissões do que o boundary permite. Implemente: (1) boundary policy que limita ações ao serviço S3 e DynamoDB; (2) policy para o time com iam:CreateRole condicionada a passar o boundary; (3) teste tentando criar role sem boundary (deve falhar) e com boundary (deve funcionar).",
      concepts: ["permission-boundary", "privilege-escalation-prevention", "iam-delegation", "condition-keys"],
    },
  ],
  videos: [
    {
      title: "AWS IAM Deep Dive — Policies, Roles, and Permissions",
      channel: "AWS re:Invent",
      url: "https://www.youtube.com/watch?v=YQsK4MtsELU",
    },
    {
      title: "Becoming an IAM Policy Ninja",
      channel: "AWS Online Tech Talks",
      url: "https://www.youtube.com/watch?v=y7-fAT3z8Lo",
    },
    {
      title: "Security Best Practices with IAM — AWS re:Inforce",
      channel: "AWS Events",
      url: "https://www.youtube.com/watch?v=sTaoQaSqCmg",
    },
    {
      title: "IAM Access Analyzer Deep Dive",
      channel: "AWS re:Invent",
      url: "https://www.youtube.com/watch?v=I6uiJBBBBkw",
    },
    {
      title: "Attribute-Based Access Control with IAM (ABAC)",
      channel: "AWS Online Tech Talks",
      url: "https://www.youtube.com/watch?v=Iq_hDc385t4",
    },
  ],
  resources: [
    { title: "AWS IAM User Guide", url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/", kind: "docs" },
    { title: "IAM Access Analyzer", url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html", kind: "docs" },
    { title: "IAM Policy Evaluation Logic", url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html", kind: "docs" },
    { title: "AWS Security Best Practices — IAM", url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html", kind: "docs" },
    { title: "ABAC for AWS — Tutorial", url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/tutorial_attribute-based-access-control.html", kind: "docs" },
    { title: "IAM Identity Center (SSO) User Guide", url: "https://docs.aws.amazon.com/singlesignon/latest/userguide/", kind: "docs" },
    { title: "AWS Well-Architected — Security Pillar", url: "https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/", kind: "docs" },
    { title: "GitHub OIDC with AWS IAM — Configuração sem secrets", url: "https://docs.github.com/en/actions/security-for-github-actions/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services", kind: "docs" },
  ],
}

export default iam
