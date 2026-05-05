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
  ],
  gotchas: [
    "AdministratorAccess para tudo — viola least privilege. Em caso de comprometimento, blast radius é total.",
    "Access keys de usuário em código ou repositório — rotacionar imediatamente, usar roles em serviços. Ferramentas como git-secrets ou gitleaks detectam antes do commit.",
    "Role com trust policy aberta (Principal: '*') — qualquer conta AWS pode assumir a role. Sempre especifique o principal exato.",
    "Root account sem MFA — a conta root pode fazer qualquer coisa, inclusive deletar a própria conta. MFA é obrigatório.",
    "Policy com Resource: '*' quando deveria ser ARN específico — acesso a todos os recursos do tipo, não apenas os necessários.",
    "Inline policies em vez de managed — inline policies são invisíveis ao IAM Access Analyzer e difíceis de auditar em escala. Prefira customer managed policies.",
  ],
  interview: [
    { q: "Por que usar roles em vez de access keys para serviços AWS?", a: "<p>Roles fornecem credenciais temporárias rotacionadas automaticamente (15 min–12 h). Access keys são permanentes — se vazadas comprometem indefinidamente até rotação manual.</p><p>EC2 com instance profile, Lambda com execution role, ECS com task role — todos usam roles. A credencial nunca precisa ser gerenciada ou rotacionada manualmente. Em caso de comprometimento, a credencial temporária expira sozinha.</p>", level: "pleno" },
    { q: "Como implementaria least privilege na prática?", a: "<p>1. Negar tudo por padrão (IAM faz isso automaticamente).</p><p>2. <strong>Policy Generation:</strong> IAM analisa CloudTrail dos últimos 90 dias e gera policy com as ações realmente usadas pelo principal.</p><p>3. <strong>IAM Access Analyzer:</strong> identifica permissões concedidas mas não utilizadas, recursos acessíveis de fora da conta, e acessos cross-account não intencionais.</p><p>4. <strong>SCPs:</strong> guardrails no nível organizacional — bloquear regiões não aprovadas, serviços fora do escopo, ações destrutivas sem condição MFA.</p><p>5. Revisão periódica — permissões crescem por acréscimo, raramente por remoção.</p>", level: "pleno" },
    { q: "Explique como funciona Assume Role entre contas.", a: "<p>Cenário: Conta A (developer) precisa acessar recurso na Conta B (produção).</p><p>1. Conta B cria uma role com trust policy que permite <code>sts:AssumeRole</code> para a Conta A (ou principal específico).</p><p>2. Principal na Conta A chama <code>aws sts assume-role --role-arn arn:aws:iam::CONTA-B:role/NomeRole</code>.</p><p>3. STS retorna credenciais temporárias (access key + secret + session token) válidas por 1–12 h.</p><p>4. Principal usa essas credenciais para chamar APIs da Conta B com as permissões da role.</p><p>Auditável via CloudTrail em ambas as contas. Base para acesso multi-conta seguro sem compartilhamento de credenciais.</p>", level: "senior" },
    { q: "Qual a diferença entre SCP e permissions boundary?", a: "<p><strong>SCP (Service Control Policy):</strong> aplica-se a toda uma conta ou OU no AWS Organizations. Define o teto máximo de permissões para <em>todos</em> os principals da conta. Não concede permissões — apenas restringe. Configurado pelo administrador da organização.</p><p><strong>Permissions Boundary:</strong> aplica-se a um user ou role específico. Define o teto máximo de permissões daquele principal. Útil para delegação segura: um time pode criar roles para sua aplicação, mas o boundary garante que nenhuma role criada exceda o que o boundary permite — sem risco de escalada de privilégio.</p>", level: "senior" },
    { q: "Como o IAM Access Analyzer ajuda na segurança?", a: "<p>Access Analyzer analisa resource-based policies (S3, KMS, Lambda, SQS, IAM roles) e identifica recursos acessíveis de fora da zona de confiança definida (conta ou organização).</p><p>Exemplos de findings: bucket S3 com policy que permite acesso público ou cross-account não intencional; role IAM com trust policy que permite AssumeRole de conta externa; chave KMS compartilhada com principal fora da organização.</p><p>Além disso, o módulo de análise de acessos não utilizados (IAM Access Analyzer for unused access) identifica roles e access keys que não foram usados nos últimos 90 dias — candidatos a remoção ou redução de permissões.</p>", level: "senior" },
    { q: "O que é uma condition em uma IAM policy e cite exemplos práticos?", a: "<p>Condition adiciona lógica condicional à avaliação do statement. Sintaxe: operador de condição → chave de condição → valor.</p><p>Exemplos práticos:</p><p><code>aws:MultiFactorAuthPresent: true</code> — exige MFA para ações destrutivas (DeleteBucket, TerminateInstances).</p><p><code>aws:RequestedRegion</code> — restringe chamadas a regiões aprovadas (SCP alternativo).</p><p><code>s3:prefix</code> — limita acesso a prefixo específico no bucket (multi-tenant com prefixo por cliente).</p><p><code>aws:PrincipalOrgID</code> — permite acesso apenas a principals da própria organização AWS (resource-based policies).</p>", level: "senior" },
  ],
  resources: [
    { title: "AWS IAM docs", url: "https://docs.aws.amazon.com/iam/", kind: "docs" },
    { title: "AWS Security Best Practices", url: "https://docs.aws.amazon.com/security/", kind: "docs" },
    { title: "IAM Access Analyzer", url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html", kind: "docs" },
  ],
}

export default iam
