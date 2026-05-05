import type { SkillContent } from '@/types'

const terraform: SkillContent = {
  tagline: "IaC declarativo multi-cloud — o padrão de mercado para provisionar infraestrutura com código.",
  why: "Terraform é a ferramenta de IaC mais usada no mercado (mais de 1.000 providers, 14M+ downloads/semana). Qualquer vaga de DevOps, SRE ou backend sênior espera que você saiba escrever HCL, entender o ciclo de vida do state, organizar módulos e trabalhar com remote backend em time. Saber o que acontece em cada fase (init → plan → apply), como evitar destruição acidental de recursos críticos e como estruturar um repositório para múltiplos ambientes é o que diferencia quem 'usou Terraform alguma vez' de quem domina a ferramenta.",
  prerequisite: "Conceitos de cloud (pelo menos AWS básico — saber o que é EC2, S3, VPC), linha de comando Linux, git básico (commit, branch, PR). HCL é simples de aprender, mas para fazer sentido você precisa saber o que está sendo provisionado.",
  summary: "Terraform é uma ferramenta de IaC open source da HashiCorp que usa HCL (HashiCorp Configuration Language) para definir infraestrutura de forma declarativa. Você descreve o estado desejado — Terraform calcula o diff em relação ao estado atual (armazenado no tfstate) e aplica só as mudanças necessárias. Fluxo: terraform init (baixa providers e módulos) → terraform plan (calcula diff sem aplicar) → terraform apply (aplica as mudanças) → state atualizado. Suporta 1.000+ providers: AWS, GCP, Azure, Kubernetes, GitHub, Datadog, Cloudflare e muito mais.",
  howToStudy: "<strong>30 minutos antes de entrevista?</strong> Revise o Diagrama 1 (ciclo completo), memorize a estrutura de módulos (Diagrama 3) e treine as Q&As de nível pleno. Garanta que você consegue explicar state locking, create_before_destroy e a diferença entre workspace e diretório separado.<br><br><strong>Fim de semana?</strong> Configure uma conta AWS free tier e siga o Cookbook do início ao fim: backend remoto no S3, módulo de VPC, ECS service com ALB. Escreva o Terraform do zero — não copie e cole. A memória muscular do HCL importa em entrevistas de live coding.<br><br><strong>Uma semana?</strong> Leia 'Terraform: Up and Running' (Yevgeniy Brikman). Faça o Terraform Associate Certification. Contribua com um módulo público no Terraform Registry.",
  diagrams: [
    {
      title: "Ciclo de vida Terraform — write → init → plan → apply → state",
      html: `<style>
.tflc-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.tflc-phase{background:#1e293b;border-radius:10px;padding:12px 14px;flex:1;min-width:120px;position:relative}
.tflc-phase-title{font-size:9px;letter-spacing:.1em;text-transform:uppercase;font-weight:700;margin-bottom:6px}
.tflc-arr{color:#475569;font-size:18px;display:flex;align-items:center;justify-content:center;flex-shrink:0;padding:0 4px}
.tflc-row{display:flex;align-items:stretch;gap:4px;margin-bottom:12px;flex-wrap:wrap}
.tflc-cmd{font-size:10.5px;font-weight:700;margin-bottom:5px}
.tflc-detail{font-size:9.5px;color:#64748b;line-height:1.6}
.tflc-tag{display:inline-block;border-radius:4px;padding:2px 6px;font-size:8.5px;font-weight:700;margin-top:5px}
@keyframes tflc-pulse{0%,100%{opacity:.5}50%{opacity:1}}
.tflc-pulse{animation:tflc-pulse 2s ease-in-out infinite}
</style>
<div class="tflc-wrap">
<p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Ciclo de vida Terraform — do código à infraestrutura</p>
<p style="color:#475569;font-size:10px;margin:0 0 16px">Cada fase tem uma responsabilidade clara. Nunca pule o plan.</p>

<div class="tflc-row">
  <!-- WRITE -->
  <div class="tflc-phase" style="border:1.5px solid #7B42BC">
    <div class="tflc-phase-title" style="color:#7B42BC">① WRITE</div>
    <div class="tflc-cmd" style="color:#7B42BC">HCL / .tf files</div>
    <div class="tflc-detail">
      Você descreve o estado desejado.<br>
      resource, variable, output,<br>
      module, data source.
    </div>
    <div class="tflc-tag" style="background:rgba(123,66,188,.15);color:#7B42BC">estado desejado</div>
  </div>
  <div class="tflc-arr">→</div>

  <!-- INIT -->
  <div class="tflc-phase" style="border:1.5px solid #3b82f6">
    <div class="tflc-phase-title" style="color:#3b82f6">② INIT</div>
    <div class="tflc-cmd" style="color:#3b82f6">terraform init</div>
    <div class="tflc-detail">
      Baixa providers (.terraform/)<br>
      Configura backend remoto<br>
      Baixa módulos referenciados<br>
      Gera .terraform.lock.hcl
    </div>
    <div class="tflc-tag" style="background:rgba(59,130,246,.15);color:#3b82f6">roda uma vez por workspace</div>
  </div>
  <div class="tflc-arr">→</div>

  <!-- PLAN -->
  <div class="tflc-phase" style="border:1.5px solid #f59e0b">
    <div class="tflc-phase-title" style="color:#f59e0b">③ PLAN</div>
    <div class="tflc-cmd" style="color:#f59e0b">terraform plan</div>
    <div class="tflc-detail">
      Lê o state atual (S3)<br>
      Consulta a API da cloud<br>
      Calcula o diff:<br>
      <span style="color:#4ade80">+ create</span> <span style="color:#f59e0b">~ update</span> <span style="color:#ef4444">- destroy</span>
    </div>
    <div class="tflc-tag" style="background:rgba(245,158,11,.15);color:#f59e0b">não aplica nada</div>
  </div>
  <div class="tflc-arr">→</div>

  <!-- APPLY -->
  <div class="tflc-phase" style="border:1.5px solid #4ade80">
    <div class="tflc-phase-title" style="color:#4ade80">④ APPLY</div>
    <div class="tflc-cmd" style="color:#4ade80">terraform apply</div>
    <div class="tflc-detail">
      Exibe o plan novamente<br>
      Aguarda confirmação (yes)<br>
      Chama APIs da cloud<br>
      Atualiza o state
    </div>
    <div class="tflc-tag" style="background:rgba(74,222,128,.15);color:#4ade80">modifica infra real</div>
  </div>
</div>

<!-- State box -->
<div style="background:#1e293b;border:1.5px solid rgba(255,153,0,.4);border-radius:10px;padding:12px 14px;margin-bottom:12px">
  <div style="font-size:9px;color:#FF9900;letter-spacing:.1em;text-transform:uppercase;font-weight:700;margin-bottom:8px">⑤ STATE — terraform.tfstate</div>
  <div style="display:flex;gap:10px;flex-wrap:wrap">
    <div style="flex:1;min-width:160px">
      <div style="font-size:10px;color:#94a3b8;line-height:1.7">
        Mapeia: <span style="color:#7B42BC">aws_instance.app</span> → <span style="color:#4ade80">i-0abc123def456789</span><br>
        Mapeia: <span style="color:#7B42BC">aws_s3_bucket.data</span> → <span style="color:#4ade80">meu-bucket-prod</span><br>
        Armazena atributos e metadados dos recursos
      </div>
    </div>
    <div style="flex:1;min-width:160px">
      <div style="font-size:10px;color:#94a3b8;line-height:1.7">
        <span style="color:#ef4444">Nunca edite manualmente</span><br>
        Use <span style="color:#7B42BC">terraform state mv</span> para mover<br>
        Use <span style="color:#7B42BC">terraform import</span> para importar<br>
        Use <span style="color:#7B42BC">terraform state rm</span> para remover
      </div>
    </div>
  </div>
</div>

<!-- Terraform destroy -->
<div style="background:#1e293b;border:1.5px solid rgba(239,68,68,.3);border-radius:10px;padding:10px 14px">
  <div style="font-size:9px;color:#ef4444;letter-spacing:.1em;text-transform:uppercase;font-weight:700;margin-bottom:6px">⑥ DESTROY — use com cuidado</div>
  <div style="font-size:10px;color:#64748b;line-height:1.7">
    <span style="color:#ef4444">terraform destroy</span> remove TODOS os recursos gerenciados pelo state.<br>
    Proteção: <span style="color:#7B42BC">lifecycle { prevent_destroy = true }</span> bloqueia destroy em recursos críticos (bancos, buckets com dados).
  </div>
</div>
</div>`,
      caption: "O plan é a única porta de segurança antes de mudanças reais. Leia sempre o output — especialmente linhas marcadas com '-' (destroy) e '~' (update in-place vs replace).",
    },
    {
      title: "State management — local vs remote com S3 + DynamoDB",
      html: `<style>
.tfst-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.tfst-col{flex:1;min-width:200px;border-radius:10px;padding:12px 14px}
.tfst-badge{display:inline-block;font-size:8px;letter-spacing:.08em;font-weight:700;padding:2px 6px;border-radius:3px;text-transform:uppercase;margin-bottom:8px}
.tfst-title{font-size:11px;font-weight:700;margin-bottom:6px}
.tfst-item{font-size:9.5px;color:#64748b;padding:3px 0;border-bottom:1px solid #0f172a;line-height:1.5}
.tfst-item:last-child{border-bottom:none}
.tfst-item.bad{color:#ef4444}
.tfst-item.good{color:#4ade80}
.tfst-item::before{content:'▸ '}
.tfst-code{background:#0f172a;border-radius:6px;padding:10px 13px;font-size:9.5px;color:#94a3b8;line-height:1.9;margin-top:10px}
.tfst-code .kw{color:#7B42BC}
.tfst-code .str{color:#4ade80}
.tfst-code .cmt{color:#475569}
</style>
<div class="tfst-wrap">
<p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">State management — local vs remote</p>
<p style="color:#475569;font-size:10px;margin:0 0 14px">State remoto é obrigatório em qualquer time. State local só para testes individuais.</p>

<div style="display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap">
  <!-- Local state -->
  <div class="tfst-col" style="background:#1e293b;border:1.5px solid rgba(239,68,68,.3)">
    <div class="tfst-badge" style="background:rgba(239,68,68,.15);color:#ef4444">Evitar em time</div>
    <div class="tfst-title" style="color:#ef4444">State local (padrão)</div>
    <div class="tfst-item bad">terraform.tfstate no disco local</div>
    <div class="tfst-item bad">Perdido se máquina morre ou formato</div>
    <div class="tfst-item bad">Sem locking — dois applies simultâneos corrompem</div>
    <div class="tfst-item bad">Commitar no git vaza secrets (IPs, ARNs, passwords)</div>
    <div class="tfst-item bad">Nenhum histórico de versões auditável</div>
    <div class="tfst-item" style="color:#64748b">OK apenas para: aprendizado solo, módulos locais sem cloud</div>
  </div>

  <!-- Remote state -->
  <div class="tfst-col" style="background:#1e293b;border:1.5px solid rgba(74,222,128,.3)">
    <div class="tfst-badge" style="background:rgba(74,222,128,.15);color:#4ade80">Obrigatório em produção</div>
    <div class="tfst-title" style="color:#4ade80">State remoto (S3 + DynamoDB)</div>
    <div class="tfst-item good">State no S3 — durável, versionado, auditável</div>
    <div class="tfst-item good">Criptografado com SSE-KMS em repouso</div>
    <div class="tfst-item good">DynamoDB Lock — apenas 1 apply por vez</div>
    <div class="tfst-item good">IAM: apenas CI/CD e admins acessam o bucket</div>
    <div class="tfst-item good">terraform_remote_state: outputs compartilhados entre stacks</div>
    <div class="tfst-item good">Histórico de versões no S3 Versioning</div>
  </div>
</div>

<!-- Configuração -->
<div style="background:#1e293b;border-radius:10px;padding:12px 14px;margin-bottom:10px">
  <div style="font-size:9px;color:#7B42BC;letter-spacing:.1em;text-transform:uppercase;font-weight:700;margin-bottom:8px">Configuração do backend remoto</div>
  <div class="tfst-code">
<span class="cmt"># backend.tf — configurar antes do terraform init</span>
<span class="kw">terraform</span> {
<span class="kw">required_version</span> = <span class="str">"~> 1.7"</span>

<span class="kw">backend</span> <span class="str">"s3"</span> {
  bucket         = <span class="str">"minha-empresa-tf-state"</span>
  key            = <span class="str">"prod/ecs-app/terraform.tfstate"</span>
  region         = <span class="str">"us-east-1"</span>
  encrypt        = <span class="str">true</span>
  kms_key_id     = <span class="str">"arn:aws:kms:us-east-1:123:key/abc"</span>
  dynamodb_table = <span class="str">"terraform-locks"</span>  <span class="cmt"># LockID como partition key</span>
}
}
  </div>
</div>

<!-- Locking -->
<div style="background:#1e293b;border-radius:10px;padding:12px 14px">
  <div style="font-size:9px;color:#f59e0b;letter-spacing:.1em;text-transform:uppercase;font-weight:700;margin-bottom:8px">Como o locking funciona</div>
  <div style="display:flex;gap:8px;flex-wrap:wrap">
    <div style="flex:1;font-size:9.5px;color:#64748b;line-height:1.7">
      <span style="color:#4ade80">CI/CD #1</span> roda <span style="color:#7B42BC">terraform apply</span><br>
      → Cria item no DynamoDB: <span style="color:#94a3b8">LockID=state.tfstate</span><br>
      → Aplica mudanças na AWS<br>
      → Remove o lock após completar
    </div>
    <div style="flex:1;font-size:9.5px;color:#64748b;line-height:1.7">
      <span style="color:#ef4444">CI/CD #2</span> tenta <span style="color:#7B42BC">terraform apply</span> ao mesmo tempo<br>
      → Tenta criar item no DynamoDB<br>
      → DynamoDB retorna ConditionalCheckFailedException<br>
      → <span style="color:#ef4444">Terraform aborta</span>: "Error acquiring the state lock"
    </div>
  </div>
  <div style="margin-top:8px;font-size:9.5px;color:#475569">
    Se um apply travar e o lock não for liberado: <span style="color:#7B42BC">terraform force-unlock &lt;LockID&gt;</span> (use com cautela — confirme que nenhum apply está em execução)
  </div>
</div>
</div>`,
      caption: "State remoto é a primeira coisa a configurar antes de compartilhar o código com o time. Sem locking, dois applies simultâneos corrompem o state — e um state corrompido é muito trabalhoso de recuperar.",
    },
    {
      title: "Hierarquia de módulos — root module, child modules e providers",
      html: `<style>
.tfmod-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.tfmod-box{background:#1e293b;border-radius:8px;padding:10px 14px;font-size:10px;position:relative}
.tfmod-title{font-size:9px;letter-spacing:.1em;text-transform:uppercase;font-weight:700;margin-bottom:5px}
.tfmod-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(100,116,139,.5);display:inline}
.tfmod-tip:hover .tfmod-tb{display:block}
.tfmod-tb{display:none;position:absolute;bottom:calc(100% + 8px);left:0;background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:10px;line-height:1.6;z-index:40;color:#94a3b8;width:230px;pointer-events:none;white-space:normal;box-shadow:0 6px 24px rgba(0,0,0,.9)}
.tfmod-tb::after{content:'';position:absolute;top:100%;left:20px;border:5px solid transparent;border-top-color:#334155}
.tfmod-arr{color:#475569;font-size:13px;text-align:center;padding:3px 0}
.tfmod-code{background:#0f172a;border-radius:5px;padding:7px 10px;font-size:9.5px;color:#94a3b8;line-height:1.8;margin-top:6px}
.tfmod-code .kw{color:#7B42BC}
.tfmod-code .str{color:#4ade80}
.tfmod-code .ref{color:#61DAFB}
</style>
<div class="tfmod-wrap">
<p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Hierarquia de módulos — como inputs e outputs fluem</p>
<p style="color:#475569;font-size:10px;margin:0 0 14px">Passe o mouse nos termos <span style="border-bottom:1px dashed rgba(100,116,139,.5)">sublinhados</span></p>

<div style="display:flex;gap:10px;flex-wrap:wrap">
  <!-- Coluna esquerda: árvore visual -->
  <div style="flex:1;min-width:220px">
    <!-- Root module -->
    <div class="tfmod-box" style="border:1.5px solid #7B42BC;margin-bottom:6px">
      <div class="tfmod-title" style="color:#7B42BC">Root Module (envs/prod/)</div>
      <div style="color:#94a3b8;line-height:1.7;font-size:9.5px">
        <span class="tfmod-tip">main.tf<span class="tfmod-tb">Arquivo principal que chama os módulos child. Define os recursos de alto nível. Pode chamar múltiplos módulos.</span></span>,
        <span class="tfmod-tip">variables.tf<span class="tfmod-tb">Declara os inputs do root module — valores que vêm de .tfvars ou do CI/CD (TF_VAR_nome).</span></span>,
        <span class="tfmod-tip">outputs.tf<span class="tfmod-tb">Exporta valores do root — ex: ALB DNS name, RDS endpoint, VPC ID. Visíveis no terminal após apply e acessíveis via terraform_remote_state.</span></span><br>
        <span class="tfmod-tip">backend.tf<span class="tfmod-tb">Configura onde o state fica (S3 + DynamoDB). Deve ser o primeiro arquivo criado.</span></span>
      </div>
      <div class="tfmod-code">
<span class="kw">module</span> <span class="str">"vpc"</span> {
source  = <span class="str">"../modules/vpc"</span>
cidr    = <span class="ref">var.vpc_cidr</span>       <span style="color:#475569"># input</span>
azs     = <span class="ref">var.azs</span>
}
<span class="kw">module</span> <span class="str">"ecs"</span> {
source     = <span class="str">"../modules/ecs-service"</span>
vpc_id     = <span class="ref">module.vpc.vpc_id</span>   <span style="color:#475569"># output de vpc</span>
subnet_ids = <span class="ref">module.vpc.private_subnets</span>
}
      </div>
    </div>

    <!-- Seta -->
    <div class="tfmod-arr">↙ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ↘</div>

    <!-- Child modules -->
    <div style="display:flex;gap:8px;margin-bottom:6px">
      <div class="tfmod-box" style="flex:1;border:1.5px solid rgba(123,66,188,.5)">
        <div class="tfmod-title" style="color:#a78bfa">modules/vpc/</div>
        <div style="font-size:9px;color:#64748b;line-height:1.6">
          Cria: VPC, subnets, IGW, NAT GW, route tables<br>
          <span style="color:#61DAFB">output "vpc_id"</span><br>
          <span style="color:#61DAFB">output "private_subnets"</span>
        </div>
      </div>
      <div class="tfmod-box" style="flex:1;border:1.5px solid rgba(123,66,188,.5)">
        <div class="tfmod-title" style="color:#a78bfa">modules/ecs-service/</div>
        <div style="font-size:9px;color:#64748b;line-height:1.6">
          Cria: ECS Cluster, Task, Service, ALB, Target Group<br>
          <span style="color:#61DAFB">output "alb_dns"</span><br>
          <span style="color:#61DAFB">output "service_arn"</span>
        </div>
      </div>
    </div>

    <!-- Providers -->
    <div class="tfmod-arr">↓</div>
    <div class="tfmod-box" style="border:1.5px solid rgba(255,153,0,.4);margin-top:6px">
      <div class="tfmod-title" style="color:#FF9900">Providers (plugins)</div>
      <div style="font-size:9px;color:#64748b;line-height:1.6">
        Cada resource type pertence a um provider.<br>
        <span class="tfmod-tip" style="color:#94a3b8">aws_instance<span class="tfmod-tb">Resource do provider hashicorp/aws. Terraform baixa o plugin do Registry e usa as credenciais AWS para chamar a API EC2.</span></span>,
        <span class="tfmod-tip" style="color:#94a3b8">aws_s3_bucket<span class="tfmod-tb">Mesmo provider aws. Cada provider é um binário separado que implementa CRUD para os recursos daquele serviço.</span></span> → provider hashicorp/aws<br>
        kubernetes_deployment → provider hashicorp/kubernetes
      </div>
    </div>
  </div>

  <!-- Coluna direita: fluxo de variáveis -->
  <div style="flex:1;min-width:220px">
    <div class="tfmod-box" style="border:1.5px solid #334155;margin-bottom:8px">
      <div class="tfmod-title" style="color:#94a3b8">Variáveis — como fluem</div>
      <div class="tfmod-code" style="font-size:9px">
<span style="color:#475569"># 1. Declaração (variables.tf)</span>
<span class="kw">variable</span> <span class="str">"vpc_cidr"</span> {
type        = string
default     = <span class="str">"10.0.0.0/16"</span>
description = <span class="str">"CIDR da VPC"</span>
}

<span style="color:#475569"># 2. Valores (prod.tfvars)</span>
vpc_cidr = <span class="str">"10.1.0.0/16"</span>

<span style="color:#475569"># 3. Passagem para módulo</span>
<span class="kw">module</span> <span class="str">"vpc"</span> {
cidr = <span class="ref">var.vpc_cidr</span>
}

<span style="color:#475569"># 4. Dentro do módulo</span>
resource <span class="str">"aws_vpc" "main"</span> {
cidr_block = <span class="ref">var.cidr</span>  <span style="color:#475569"># local var</span>
}

<span style="color:#475569"># 5. Output do módulo</span>
<span class="kw">output</span> <span class="str">"vpc_id"</span> {
value = <span class="ref">aws_vpc.main.id</span>
}
      </div>
    </div>

    <div class="tfmod-box" style="border:1.5px solid #334155">
      <div class="tfmod-title" style="color:#94a3b8">Passagem de variáveis — 4 formas</div>
      <div style="font-size:9px;color:#64748b;line-height:1.8">
        <span style="color:#4ade80">1.</span> <span style="color:#94a3b8">-var="vpc_cidr=10.0.0.0/16"</span> (CLI)<br>
        <span style="color:#4ade80">2.</span> <span style="color:#94a3b8">prod.tfvars</span> (arquivo, -var-file)<br>
        <span style="color:#4ade80">3.</span> <span style="color:#94a3b8">TF_VAR_vpc_cidr</span> (env var — CI/CD)<br>
        <span style="color:#4ade80">4.</span> <span style="color:#94a3b8">default</span> na declaração (fallback)
      </div>
    </div>
  </div>
</div>
</div>`,
      caption: "Módulos são a unidade de reutilização do Terraform. Um bom módulo aceita inputs, esconde a complexidade interna e exporta só o que o chamador precisa via outputs.",
    },
  ],
  keypoints: [
    {
      title: "HCL — a linguagem do Terraform",
      body: "HCL (HashiCorp Configuration Language) é declarativo: você descreve o que quer, não como criar. Blocos principais: resource (o que criar), data (ler recurso existente), variable (input), output (exportar valor), local (valor computado interno), module (chamar outro módulo), provider (configurar o plugin), terraform (configurações globais — versão, backend). Expressões: referências com resource_type.resource_name.attribute, condicionais com condition ? a : b, loops com for_each e count.",
      code: `# resource — cria/gerencia um recurso
resource "aws_s3_bucket" "assets" {
bucket = "minha-empresa-assets-\${var.env}"
tags   = local.common_tags
}

# data — lê recurso existente sem gerenciar
data "aws_vpc" "default" {
default = true
}

# local — valor computado interno
locals {
common_tags = {
  Environment = var.env
  Project     = "minha-app"
  ManagedBy   = "terraform"
}
}

# output — exporta valores para outros módulos ou console
output "bucket_name" {
value       = aws_s3_bucket.assets.id
description = "Nome do bucket S3 de assets"
}`,
    },
    {
      title: "State — o coração do Terraform",
      body: "O state (terraform.tfstate) é o mapeamento entre o HCL e os recursos reais na cloud. Sem ele, Terraform não sabe o que já existe. Nunca edite manualmente — use comandos: terraform state list (listar recursos), terraform state show (ver detalhes), terraform state mv (renomear), terraform state rm (remover do state sem destruir), terraform import (adicionar recurso existente). State contém senhas, IPs e ARNs — nunca commite no git. Use remote backend com criptografia desde o primeiro dia.",
      code: `# Comandos de gerenciamento de state
terraform state list                          # lista todos os recursos
terraform state show aws_s3_bucket.assets     # detalhes de um recurso
terraform state mv aws_s3_bucket.old aws_s3_bucket.assets  # renomear
terraform state rm aws_security_group.legacy  # remove do state (NÃO destrói)

# Importar recurso criado manualmente
terraform import aws_s3_bucket.assets meu-bucket-existente

# Terraform 1.5+ — bloco import declarativo no HCL
import {
to = aws_s3_bucket.assets
id = "meu-bucket-existente"
}`,
    },
    {
      title: "Módulos — reutilização e organização",
      body: "Módulo é qualquer diretório com arquivos .tf. O módulo raiz é o diretório onde você roda terraform. Módulos child são chamados via bloco module com source apontando para caminho local, git ou Terraform Registry. Sempre versione módulos externos — uma mudança upstream sem version fixa quebra toda a infra. Variáveis de input e outputs são a interface pública do módulo — defina com description e type. Módulos bem desenhados são testáveis e reutilizáveis entre ambientes.",
      code: `# Chamando módulo local
module "vpc" {
source = "../modules/vpc"
cidr   = "10.0.0.0/16"
azs    = ["us-east-1a", "us-east-1b"]
}

# Módulo do Terraform Registry (sempre fixe versão!)
module "alb" {
source  = "terraform-aws-modules/alb/aws"
version = "~> 9.0"  # aceita 9.x, mas não 10.x

name    = "minha-app-alb"
vpc_id  = module.vpc.vpc_id
subnets = module.vpc.public_subnets
}

# Módulo do git (ref = tag ou commit hash)
module "ecs_service" {
source = "git::https://github.com/minha-empresa/tf-modules.git//ecs-service?ref=v2.3.1"
...
}`,
    },
    {
      title: "for_each e count — recursos dinâmicos",
      body: "count cria N cópias de um recurso. for_each cria uma instância por item de um map ou set. Prefira for_each quando os recursos têm identidade própria — remover um item de count[2] remove e recria o count[3], enquanto for_each remove só o item específico. dynamic block gera blocos internos de forma programática (ex: múltiplas regras de Security Group). locals e for expressions permitem transformar estruturas de dados antes de usar.",
      code: `# for_each com map — cada subnet tem nome e AZ
resource "aws_subnet" "private" {
for_each          = var.private_subnets  # map: { "us-east-1a" = "10.0.1.0/24" }
vpc_id            = aws_vpc.main.id
cidr_block        = each.value
availability_zone = each.key
tags = { Name = "private-\${each.key}" }
}

# dynamic block — regras de SG dinâmicas
resource "aws_security_group" "app" {
name   = "app-sg"
vpc_id = var.vpc_id

dynamic "ingress" {
  for_each = var.ingress_rules  # lista de { port, protocol, cidr }
  content {
    from_port   = ingress.value.port
    to_port     = ingress.value.port
    protocol    = ingress.value.protocol
    cidr_blocks = [ingress.value.cidr]
  }
}
}`,
    },
    {
      title: "Lifecycle rules — controle de criação e destruição",
      body: "lifecycle é um bloco dentro de resource que altera o comportamento padrão do Terraform. create_before_destroy: cria o novo antes de destruir o antigo — essencial para recursos com nome único (certificados ACM, target groups). prevent_destroy: impede terraform destroy — proteção para bancos e buckets de produção. ignore_changes: ignora campos específicos no diff (útil para tags gerenciadas externamente ou campos que mudam automaticamente pela AWS).",
      code: `resource "aws_acm_certificate" "api" {
domain_name       = "api.minha-empresa.com"
validation_method = "DNS"

lifecycle {
  # Cria o novo certificado antes de destruir o antigo
  # Necessário pois ALB deve sempre ter um certificado válido
  create_before_destroy = true
}
}

resource "aws_db_instance" "prod" {
identifier = "prod-postgres"
...

lifecycle {
  # Terraform destroy nesta resource vai FALHAR com erro explicativo
  prevent_destroy = true

  # Ignore mudanças de senha feitas fora do Terraform (Secrets Manager rotation)
  ignore_changes = [password]
}
}`,
    },
    {
      title: "Providers — configuração e versionamento",
      body: "Provider é um plugin que implementa o CRUD de recursos de um serviço específico. Versionado em required_providers — sempre fixe a versão com constraints. .terraform.lock.hcl armazena os hashes exatos dos providers baixados — commite esse arquivo no git para garantir reprodutibilidade em toda a equipe. Para AWS: configure credenciais via environment variables (AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY) ou IAM role (preferível em CI/CD).",
      code: `# versions.tf — configuração de providers
terraform {
required_version = ">= 1.7, < 2.0"

required_providers {
  aws = {
    source  = "hashicorp/aws"
    version = "~> 5.0"  # aceita 5.x, não 6.x
  }
  random = {
    source  = "hashicorp/random"
    version = "~> 3.6"
  }
}
}

provider "aws" {
region = var.aws_region

# Alias — múltiplas regiões no mesmo Terraform
alias = "us-east-1"
assume_role {
  role_arn = "arn:aws:iam::123456789012:role/TerraformDeployRole"
}

default_tags {
  tags = { ManagedBy = "terraform", Env = var.env }
}
}`,
    },
    {
      title: "Workspaces vs diretórios separados",
      body: "Workspaces permitem múltiplos states com o mesmo código (terraform workspace new staging). São úteis para ambientes efêmeros (PR environments). Para prod/staging/dev em empresas, prefira diretórios separados — cada ambiente tem seu próprio state e seu próprio conjunto de tfvars. Motivo: workspaces compartilham o mesmo backend S3 e é mais fácil fazer apply no ambiente errado acidentalmente. Módulos reutilizáveis são a ponte entre as abordagens.",
      code: `# Estrutura com diretórios separados (mais segura para prod)
infra/
modules/
  vpc/           # módulo reutilizável
  ecs-service/   # módulo reutilizável
  rds/           # módulo reutilizável
envs/
  dev/
    main.tf      # usa módulos, var env=dev
    dev.tfvars
    backend.tf   # state em s3://tf-state/dev/
  staging/
    main.tf
    staging.tfvars
    backend.tf   # state em s3://tf-state/staging/
  prod/
    main.tf
    prod.tfvars
    backend.tf   # state em s3://tf-state/prod/

# Cada diretório = state independente
# apply em dev NÃO toca staging ou prod`,
    },
    {
      title: "CI/CD com Terraform — fluxo seguro",
      body: "Em CI/CD, o Terraform deve rodar sem interação humana, mas com portões de segurança. Fluxo: PR → terraform plan (comentado no PR via GitHub Actions + tfcmt) → revisão humana → merge → terraform apply automático (ou manual com aprovação). Nunca automatize o apply sem o plan ter sido revisado em produção. Use OpenID Connect (OIDC) para que o CI/CD assuma uma IAM Role sem credenciais de longa duração armazenadas em secrets.",
      code: `# .github/workflows/terraform.yml (trecho)
jobs:
plan:
  runs-on: ubuntu-latest
  permissions:
    id-token: write  # OIDC
    contents: read
    pull-requests: write
  steps:
    - uses: aws-actions/configure-aws-credentials@v4
      with:
        role-to-assume: arn:aws:iam::123456789012:role/TerraformPlanRole
        aws-region: us-east-1
        # Sem AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY! Usa OIDC.

    - run: terraform init
    - run: terraform plan -out=tfplan -no-color > plan.txt
    - uses: actions/github-script@v7
      with:
        script: |
          const plan = require('fs').readFileSync('plan.txt', 'utf8')
          github.rest.issues.createComment({
            issue_number: context.issue.number,
            body: \`\\\`\\\`\\\`hcl\n\${plan}\n\\\`\\\`\\\`\`
          })`,
    },
    {
      title: "Testing — terratest e checkov",
      body: "Terratest é uma biblioteca Go para testes de integração de módulos Terraform: provisiona infra real, valida o comportamento com asserções Go, destrói. É lento (minutos) mas é o teste mais confiável. checkov é um linter de segurança estático para HCL — detecta S3 buckets públicos, SGs abertos, criptografia desabilitada, sem tags. Roda em segundos, integra no CI antes do plan. terraform validate verifica sintaxe HCL sem acessar a cloud.",
      code: `// Terratest — Go test para módulo de S3
func TestS3Module(t *testing.T) {
opts := &terraform.Options{
  TerraformDir: "../modules/s3",
  Vars: map[string]interface{}{
    "bucket_name": "test-" + random.UniqueId(),
    "env": "test",
  },
}
defer terraform.Destroy(t, opts)  // cleanup automático
terraform.InitAndApply(t, opts)

bucketName := terraform.Output(t, opts, "bucket_name")
assert.Equal(t, true, aws.DoesBucketExist(t, "us-east-1", bucketName))

// Verifica que o bucket não é público
aclOutput := aws.GetS3BucketPublicAccessBlock(t, "us-east-1", bucketName)
assert.Equal(t, true, *aclOutput.BlockPublicAcls)
}`,
    },
  ],
  cheatsheet: {
    title: "Terraform Cheatsheet — HCL syntax, CLI e boas práticas",
    html: `<style>
.tfcs-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.tfcs-h2{font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#7B42BC;font-weight:700;margin:16px 0 8px;padding-bottom:4px;border-bottom:1px solid rgba(123,66,188,.2)}
.tfcs-h2:first-child{margin-top:0}
.tfcs-code{background:#1e293b;border-radius:6px;padding:10px 14px;font-size:10px;color:#94a3b8;line-height:2;overflow-x:auto;margin-bottom:4px}
.tfcs-code .kw{color:#7B42BC}
.tfcs-code .str{color:#4ade80}
.tfcs-code .ref{color:#61DAFB}
.tfcs-code .cmt{color:#475569}
.tfcs-code .cmd{color:#FF9900;font-weight:700}
.tfcs-table{width:100%;border-collapse:collapse;font-size:10px}
.tfcs-table th{text-align:left;color:#64748b;font-weight:600;padding:4px 8px;border-bottom:1px solid #1e293b;font-size:9px;letter-spacing:.06em;text-transform:uppercase}
.tfcs-table td{padding:5px 8px;border-bottom:1px solid #0f172a;color:#94a3b8;vertical-align:top;line-height:1.5}
.tfcs-table tr:last-child td{border-bottom:none}
.tfcs-table td:first-child{color:#e2e8f0;white-space:nowrap;font-weight:500}
.tfcs-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
@media(max-width:500px){.tfcs-grid{grid-template-columns:1fr}}
</style>
<div class="tfcs-wrap">
<p style="font-size:12px;font-weight:600;color:#e2e8f0;margin:0 0 4px">Terraform Cheatsheet</p>
<p style="font-size:10px;color:#475569;margin:0 0 14px">HCL syntax, CLI commands e boas práticas</p>

<div class="tfcs-h2">HCL — blocos principais</div>
<div class="tfcs-grid">
  <div class="tfcs-code">
<span class="cmt"># resource — o que criar</span>
<span class="kw">resource</span> <span class="str">"aws_instance" "app"</span> {
ami           = <span class="ref">var.ami_id</span>
instance_type = <span class="str">"t3.micro"</span>
tags          = <span class="ref">local.common_tags</span>
}

<span class="cmt"># data — ler existente</span>
<span class="kw">data</span> <span class="str">"aws_ami" "ubuntu"</span> {
most_recent = <span class="str">true</span>
owners      = [<span class="str">"099720109477"</span>]
filter {
  name   = <span class="str">"name"</span>
  values = [<span class="str">"ubuntu/images/hvm-ssd/ubuntu-*"</span>]
}
}
  </div>
  <div class="tfcs-code">
<span class="cmt"># variable — input</span>
<span class="kw">variable</span> <span class="str">"env"</span> {
type        = string
description = <span class="str">"Ambiente: dev, staging, prod"</span>
validation {
  condition     = contains([<span class="str">"dev","staging","prod"</span>], <span class="ref">var.env</span>)
  error_message = <span class="str">"Valor inválido."</span>
}
}

<span class="cmt"># local — computado internamente</span>
<span class="kw">locals</span> {
name_prefix = <span class="str">"minha-app-\${var.env}"</span>
common_tags = {
  Env       = <span class="ref">var.env</span>
  ManagedBy = <span class="str">"terraform"</span>
}
}
  </div>
  <div class="tfcs-code">
<span class="cmt"># output — exportar valor</span>
<span class="kw">output</span> <span class="str">"alb_dns"</span> {
value       = <span class="ref">aws_lb.main.dns_name</span>
description = <span class="str">"DNS do ALB para configurar Route53"</span>
}

<span class="cmt"># module — chamar child module</span>
<span class="kw">module</span> <span class="str">"vpc"</span> {
source  = <span class="str">"terraform-aws-modules/vpc/aws"</span>
version = <span class="str">"~> 5.0"</span>
cidr    = <span class="str">"10.0.0.0/16"</span>
azs     = <span class="ref">var.azs</span>
}
  </div>
  <div class="tfcs-code">
<span class="cmt"># for_each — recursos dinâmicos</span>
resource <span class="str">"aws_subnet" "private"</span> {
for_each   = <span class="ref">var.subnets</span>  <span class="cmt"># map</span>
vpc_id     = <span class="ref">aws_vpc.main.id</span>
cidr_block = <span class="ref">each.value</span>
availability_zone = <span class="ref">each.key</span>
}

<span class="cmt"># count — N cópias</span>
resource <span class="str">"aws_instance" "worker"</span> {
count         = <span class="ref">var.worker_count</span>
instance_type = <span class="str">"t3.medium"</span>
tags = { Name = <span class="str">"worker-\${count.index}"</span> }
}
  </div>
</div>

<div class="tfcs-h2">CLI Commands</div>
<div class="tfcs-code">
<span class="cmd">terraform init</span>          <span class="cmt"># baixa providers e módulos, configura backend</span>
<span class="cmd">terraform init -upgrade</span> <span class="cmt"># atualiza providers dentro das constraints</span>
<span class="cmd">terraform validate</span>      <span class="cmt"># valida sintaxe HCL sem acessar a cloud</span>
<span class="cmd">terraform fmt</span>           <span class="cmt"># formata .tf files (use -recursive para diretórios)</span>
<span class="cmd">terraform plan</span>          <span class="cmt"># calcula diff, exibe, não aplica</span>
<span class="cmd">terraform plan -out=tfplan</span>       <span class="cmt"># salva plan para apply determinístico</span>
<span class="cmd">terraform plan -target=module.vpc</span> <span class="cmt"># plan só de um módulo/resource</span>
<span class="cmd">terraform apply</span>                   <span class="cmt"># pede confirmação antes de aplicar</span>
<span class="cmd">terraform apply tfplan</span>            <span class="cmt"># aplica plan salvo (sem confirmação)</span>
<span class="cmd">terraform apply -auto-approve</span>     <span class="cmt"># sem confirmação (CI apenas)</span>
<span class="cmd">terraform destroy</span>       <span class="cmt"># DESTRÓI todos os recursos — confirme o plan!</span>
<span class="cmd">terraform output</span>        <span class="cmt"># exibe outputs do state atual</span>
<span class="cmd">terraform output -json</span>  <span class="cmt"># outputs em JSON (para scripts)</span>
<span class="cmd">terraform state list</span>    <span class="cmt"># lista recursos no state</span>
<span class="cmd">terraform state show aws_instance.app</span>  <span class="cmt"># detalhes do recurso</span>
<span class="cmd">terraform import aws_s3_bucket.data meu-bucket</span>  <span class="cmt"># importar existente</span>
<span class="cmd">terraform workspace new staging</span>  <span class="cmt"># criar workspace</span>
<span class="cmd">terraform workspace select prod</span>  <span class="cmt"># mudar workspace</span>
</div>

<div class="tfcs-h2">Lifecycle rules</div>
<table class="tfcs-table">
  <tr><th>Rule</th><th>O que faz</th><th>Quando usar</th></tr>
  <tr><td>create_before_destroy</td><td>Cria o novo antes de destruir o antigo</td><td>Certificados ACM, Target Groups, SGs com dependências</td></tr>
  <tr><td>prevent_destroy</td><td>Bloqueia terraform destroy com erro</td><td>RDS de produção, S3 buckets com dados críticos</td></tr>
  <tr><td>ignore_changes</td><td>Ignora diff em campos específicos</td><td>Campos modificados por auto-scaling, senhas rotacionadas externamente</td></tr>
  <tr><td>replace_triggered_by</td><td>Força replace quando outro recurso muda</td><td>Forçar recriação de EC2 quando AMI base é atualizada</td></tr>
</table>

<div class="tfcs-h2">Boas práticas de estrutura</div>
<div class="tfcs-grid">
  <div>
    <table class="tfcs-table">
      <tr><th>Arquivo</th><th>Conteúdo</th></tr>
      <tr><td>main.tf</td><td>Resources e módulos principais</td></tr>
      <tr><td>variables.tf</td><td>Declarações de variáveis</td></tr>
      <tr><td>outputs.tf</td><td>Outputs exportados</td></tr>
      <tr><td>versions.tf</td><td>required_providers e terraform block</td></tr>
      <tr><td>backend.tf</td><td>Configuração do backend remoto</td></tr>
      <tr><td>*.tfvars</td><td>Valores por ambiente (NÃO commite secrets)</td></tr>
    </table>
  </div>
  <div>
    <table class="tfcs-table">
      <tr><th>Prática</th><th>Por quê</th></tr>
      <tr><td>Versione providers</td><td>Reprodutibilidade — sem surpresas em team</td></tr>
      <tr><td>Remote state desde o dia 1</td><td>State local = perda garantida em time</td></tr>
      <tr><td>Módulos com versão fixa</td><td>Upstream quebra = infra quebra</td></tr>
      <tr><td>prevent_destroy em prod DB</td><td>Terraform destroy em prod = desastre</td></tr>
      <tr><td>default_tags no provider AWS</td><td>Todos os recursos taggeados sem esforço</td></tr>
      <tr><td>OIDC no CI — sem access keys</td><td>Sem credenciais de longa duração em secrets</td></tr>
    </table>
  </div>
</div>
</div>`,
  },
  mnemonics: [
    {
      label: "IPADS — ciclo de vida Terraform",
      trick: "Init, Plan, Apply, Destroy, State",
      explanation: "Os 5 comandos fundamentais do Terraform em ordem de uso. Init uma vez por workspace. Plan antes de qualquer Apply. Destroy com muito cuidado. State é o que o Terraform lê para calcular o diff — sem ele, nada funciona.",
    },
    {
      label: "SG do State: S3 guarda, DynamoDB bloqueia",
      trick: "S3 = Storage do state. DynamoDB = trava (Lock).",
      explanation: "S3 armazena o arquivo terraform.tfstate (durável, versionado, criptografado). DynamoDB evita que dois applies rodem ao mesmo tempo com uma trava distribuída. Sempre os dois juntos — um sem o outro não é suficiente.",
    },
    {
      label: "MDF — quando usar módulos",
      trick: "Módulo = Duas ou mais vezes o mesmo padrão. Docs + For_each = poder.",
      explanation: "Extraia um módulo quando você perceber que está copiando e colando blocos HCL para ambientes diferentes. Um bom módulo tem: variáveis documentadas (description obrigatória), outputs úteis e for_each ou count no chamador para criar múltiplas instâncias. Sem for_each, o módulo perde metade do valor.",
    },
  ],
  gotchas: [
    "State em disco local em time — se dois devs rodam terraform apply ao mesmo tempo sem locking, o state é corrompido e a recuperação é manual e trabalhosa. Configure remote backend com DynamoDB locking antes do primeiro apply em time.",
    "terraform destroy sem revisar o plan — destroy sem -target destrói TUDO na stack, incluindo o banco de produção. Use prevent_destroy em recursos críticos e sempre revise o plan de destroy antes de confirmar.",
    "Módulos sem versionamento de fonte — source = 'git::url' sem ?ref= sempre pega a última versão. Uma breaking change upstream quebra toda a infra na próxima vez que alguém rodar terraform init -upgrade.",
    "Variáveis sensíveis visíveis no state — mesmo com sensitive=true, o valor fica em plaintext no tfstate. Nunca coloque passwords ou API keys como variáveis Terraform — use Secrets Manager e data sources para lê-los.",
    "apply sem revisar o plan em CI — automatize o plan (postar diff no PR), mas exija aprovação humana antes do apply em produção. Apply automático em main sem revisão é risco desnecessário.",
    "Hardcode de account ID e region no código — torna o código não-portável. Use data.aws_caller_identity.current.account_id e data.aws_region.current.name como data sources.",
    "for_each com lista em vez de map — for_each requer set ou map de strings, não list. Converter: toset(var.lista). Motivo: lista usa índice [0,1,2] — remover item do meio muda os índices e recria recursos errados.",
    "Ignorar o .terraform.lock.hcl — esse arquivo deve ser commitado no git. Ele garante que todos no time (e o CI) usam exatamente os mesmos hashes de providers, tornando o ambiente reprodutível.",
  ],
  interview: [
    {
      q: "Como gerenciaria o state do Terraform em um time com múltiplos desenvolvedores?",
      a: "<p><strong>Remote backend obrigatório:</strong> S3 com DynamoDB locking. State no S3 (versionado, criptografado com KMS). DynamoDB evita dois applies simultâneos com locking distribuído.</p><p><strong>IAM:</strong> bucket de state acessível apenas pela IAM Role do CI/CD e por admins. Devs não têm acesso direto — aplicam mudanças via PR → pipeline.</p><p><strong>CI/CD flow:</strong> PR → terraform plan (postado como comentário no PR via tfcmt) → revisão humana → merge → apply automático (staging) ou manual com aprovação (prod).</p><p><strong>State separado por ambiente:</strong> diretórios separados (infra/envs/dev, infra/envs/prod) cada um com seu backend.tf apontando para key diferente no S3. Apply em dev não pode tocar prod por construção.</p><p>Nunca commitar state no git — contém ARNs, IPs, e em casos descuidados, passwords.</p>",
      level: "pleno",
    },
    {
      q: "O que é state locking e o que acontece se o lock não for liberado?",
      a: "<p>State locking garante que apenas um terraform apply roda por vez para um dado state. Sem locking, dois applies simultâneos leem o mesmo state, fazem mudanças em paralelo e sobrescrevem o state um do outro — resultando em state corrompido.</p><p><strong>Com DynamoDB:</strong> antes de modificar o state, Terraform cria um item no DynamoDB com o LockID. Se outro process tentar criar o mesmo item, DynamoDB retorna ConditionalCheckFailedException e o Terraform aborta com 'Error acquiring the state lock'.</p><p><strong>Lock não liberado:</strong> pode acontecer se o processo for morto durante o apply (kill -9, instância CI crashou). O lock fica no DynamoDB indefinidamente. Solução: terraform force-unlock &lt;LockID&gt;. O LockID está na mensagem de erro e também pode ser lido diretamente no DynamoDB. Confirme antes que nenhum apply está em execução.</p>",
      level: "pleno",
    },
    {
      q: "Qual a diferença entre count e for_each? Quando usar cada um?",
      a: "<p><strong>count:</strong> cria N instâncias do recurso identificadas por índice (0, 1, 2...). Problema: se você remove um item do meio da lista, os índices subsequentes mudam e Terraform recria todos os recursos após o índice removido. Evite para recursos com identidade própria.</p><p><strong>for_each:</strong> cria uma instância por key de um map ou set. Cada instância é identificada pela key — remover uma key só remove aquela instância. Mais seguro e mais explícito.</p><p>Use count para: recursos homogêneos sem identidade própria (ex: 3 instâncias EC2 idênticas de um cluster). Use for_each para: qualquer recurso com nome, configuração ou identidade própria (subnets por AZ, DNS records por domínio, security groups por serviço).</p>",
      tip: "Se você usar uma lista com for_each, converta para set: for_each = toset(var.lista). Sets não têm índice — remoção de item remove só aquele.",
      level: "pleno",
    },
    {
      q: "Terraform vs CloudFormation vs CDK — quando usar cada?",
      a: "<p><strong>Terraform:</strong> HCL declarativo, multi-cloud (AWS, GCP, Azure, Kubernetes, GitHub, Datadog, etc.), 1.000+ providers, state próprio (S3). Padrão de mercado para times multi-cloud ou que querem portabilidade. Use como default.</p><p><strong>CloudFormation:</strong> nativo AWS, sem state separado (AWS gerencia), suporte imediato a novos serviços AWS (antes que o Terraform tenha o provider atualizado). Mais verboso (YAML/JSON). Use quando a integração AWS nativa importa mais que portabilidade.</p><p><strong>CDK:</strong> compila para CloudFormation. IaC em TypeScript/Python/Go. L2/L3 constructs reduzem drasticamente o código necessário. Times TypeScript que já usam a linguagem no app podem compartilhar tipos e utilitários. Use quando a expressividade da linguagem é necessária e o stack é 100% AWS.</p>",
      level: "pleno",
    },
    {
      q: "O que é terraform import e qual o fluxo correto para usá-lo?",
      a: "<p>terraform import associa um recurso existente na cloud (criado manualmente ou por outro sistema) ao state do Terraform, permitindo gerenciá-lo com IaC daqui em diante.</p><p><strong>Fluxo clássico (pré-1.5):</strong> (1) Escreva o bloco resource correspondente no HCL com a configuração que você acha que o recurso tem. (2) terraform import aws_s3_bucket.data meu-bucket-existente — Terraform adiciona o recurso ao state. (3) terraform plan — deve mostrar zero diff se o HCL está correto. Se houver diff, ajuste o HCL e repita o plan até zerar.</p><p><strong>Terraform 1.5+ — bloco import declarativo:</strong> adicione um bloco import { to = aws_s3_bucket.data; id = 'meu-bucket' } no HCL. terraform plan já mostra a importação. terraform generate-config-out=generated.tf gera o HCL automaticamente (experimental — revise antes de usar).</p><p>Armadilha: o ID do recurso no import é o ID real da cloud (bucket name para S3, instance-id para EC2, ARN para alguns serviços) — não é o nome do Terraform.</p>",
      level: "senior",
    },
    {
      q: "Como estruturaria um repositório Terraform para múltiplos ambientes e equipes?",
      a: "<p>Estrutura por diretório com módulos centralizados:</p><p><code>infra/<br>&nbsp;&nbsp;modules/<br>&nbsp;&nbsp;&nbsp;&nbsp;vpc/         # módulo VPC reutilizável<br>&nbsp;&nbsp;&nbsp;&nbsp;ecs-service/ # módulo ECS + ALB<br>&nbsp;&nbsp;&nbsp;&nbsp;rds/         # módulo RDS + Proxy<br>&nbsp;&nbsp;envs/<br>&nbsp;&nbsp;&nbsp;&nbsp;dev/main.tf  # usa módulos, state em s3://tf-state/dev/<br>&nbsp;&nbsp;&nbsp;&nbsp;staging/     # state em s3://tf-state/staging/<br>&nbsp;&nbsp;&nbsp;&nbsp;prod/        # state em s3://tf-state/prod/</code></p><p>Módulos versionados por git tag. Cada ambiente tem state isolado — apply em dev não pode afetar prod por construção. Módulos têm README, examples e testes (Terratest).</p><p>Para múltiplas equipes: cada time tem seu diretório de módulos e envs, com IAM Roles separadas por time/ambiente. Service Control Policies (SCPs) no AWS Organizations para guardrails centralizados.</p>",
      level: "senior",
    },
    {
      q: "Explique create_before_destroy e quando é necessário.",
      a: "<p>Por padrão, Terraform destrói o recurso antigo antes de criar o novo (destroy → create). Para recursos com nome único, isso causa erro (conflict) pois o nome já existe. Para recursos referenciados por outros, causa downtime.</p><p>create_before_destroy = true inverte: (1) cria o novo recurso. (2) atualiza todas as referências para o novo. (3) destrói o antigo. Zero downtime para substituições.</p><p><strong>Casos onde é necessário:</strong></p><p>- ACM Certificate: ALB sempre precisa de um certificado válido. Se o antigo for destruído primeiro, há gap de cobertura.</p><p>- Launch Template: novo template criado, ASG atualizado para usar o novo, antigo deletado.</p><p>- Security Groups com dependências circulares: SG-A referencia SG-B e vice-versa. Criar um antes de destruir o outro quebra o ciclo.</p><p><strong>Cuidado:</strong> create_before_destroy pode falhar se o recurso tem nome fixo sem suffixo aleatório — use random_pet ou random_id para names únicos.</p>",
      level: "senior",
    },
    {
      q: "Como lidar com drift de infraestrutura no Terraform?",
      a: "<p><strong>Drift</strong> = diferença entre o state do Terraform e o estado real da cloud. Causas: mudança manual no console AWS, outra ferramenta modificando o recurso, AWS modificando automaticamente campos.</p><p><strong>Detecção:</strong> terraform plan sempre detecta drift — mostra o que o Terraform faria para reconciliar. terraform refresh atualiza o state com o estado real sem aplicar mudanças (equivalente a um plan que só lê).</p><p><strong>Resolução:</strong></p><p>- Drift intencional (mudança manual válida): use ignore_changes no campo específico, ou importe o recurso atualizado.</p><p>- Drift indesejado (alguém mudou manualmente): o próximo apply reverte a mudança. Previna com IAM — bloqueie acesso manual em produção, só CI/CD pode aplicar mudanças.</p><p>- Drift em campos auto-modificados pela AWS (ex: AWS adiciona tags automaticamente): ignore_changes = [tags] resolve sem ruído nos plans.</p><p><strong>Prevenção com AWS Config:</strong> monitora compliance de configuração continuamente e alerta sobre mudanças não gerenciadas.</p>",
      level: "senior",
    },
    {
      q: "Como testaria módulos Terraform antes de aplicar em produção?",
      a: "<p><strong>Camadas de teste em ordem de velocidade:</strong></p><p><strong>1. terraform validate + fmt (segundos):</strong> valida sintaxe HCL e formatting. Integrar em pre-commit hook.</p><p><strong>2. checkov / tfsec / trivy (segundos):</strong> análise estática de segurança — detecta S3 públicos, SGs abertos, criptografia desabilitada, sem MFA. Roda no CI antes do plan.</p><p><strong>3. terraform plan (30s-2min):</strong> calcula diff real contra a cloud. Postado no PR como comentário. Se mostra 0 adds/changes/destroys no module isolado, a sintaxe e a lógica estão corretas.</p><p><strong>4. Terratest (minutos):</strong> testes de integração Go que provisionam infra real, fazem asserções (bucket existe? endpoint responde? SG correto?) e destroem. Roda em stacks efêmeras no CI — cada PR cria e destrói um ambiente temporário.</p><p><strong>5. Canary deploy:</strong> aplica em dev, verifica por 1h, aplica em staging, verifica, aplica em prod.</p>",
      level: "senior",
    },
    {
      q: "O que são workspaces e quando preferiria diretórios separados?",
      a: "<p><strong>Workspaces:</strong> múltiplos states com o mesmo código HCL. terraform workspace new staging cria um workspace — o state fica em s3://bucket/env:/staging/terraform.tfstate. Você usa ${terraform.workspace} no código para diferenciar ambientes.</p><p><strong>Quando usar workspaces:</strong> ambientes efêmeros de PR (criar e destruir por feature branch), ambientes muito similares sem variação de infraestrutura.</p><p><strong>Por que preferir diretórios separados para dev/staging/prod:</strong></p><p>- Workspaces compartilham o mesmo backend e código — é mais fácil fazer apply no workspace errado por acidente.</p><p>- Diretórios separados têm IAM policies separadas — CI/CD de dev não tem credenciais para tocar prod por construção.</p><p>- Diferenças entre prod e dev (tamanho de instância, Multi-AZ, número de réplicas) ficam em tfvars separados — mais explícito e revisável.</p><p>- Blast radius contido — um erro em dev não pode afetar o state de prod.</p>",
      level: "senior",
    },
    {
      q: "Como implementaria um módulo VPC reutilizável e bem documentado?",
      a: "<p>Interface do módulo (variables.tf): vpc_cidr (string), azs (list(string)), private_subnets (map(string)), public_subnets (map(string)), enable_nat_gateway (bool, default true), tags (map(string)).</p><p>Resources internos: aws_vpc, aws_subnet (public + private com for_each), aws_internet_gateway, aws_nat_gateway (por AZ se HA), aws_route_table (public + private), aws_route_table_association.</p><p>Outputs: vpc_id, public_subnet_ids, private_subnet_ids, nat_gateway_ids, vpc_cidr.</p><p>Qualidade: README com exemplo de uso, validation blocks nas variáveis, tags passadas para todos os recursos, lifecycle prevent_destroy no VPC, Terratest que verifica que subnets são criadas em AZs corretas e que NAT Gateway existe quando ativado.</p><p>Publicação: versionado com git tags (v1.0.0, v1.1.0), CHANGELOG.md, source no Terraform Registry ou repositório privado da empresa.</p>",
      tip: "O Terraform Registry tem módulos prontos (terraform-aws-modules/vpc/aws) — use como referência de API e implemente internamente para ganhar controle e confiança.",
      level: "senior",
    },
    {
      q: "Como configuraria CI/CD seguro para Terraform sem access keys hardcoded?",
      a: "<p><strong>OIDC (OpenID Connect):</strong> GitHub Actions (ou qualquer CI moderno) suporta OIDC — o CI prova para a AWS sua identidade sem credenciais de longa duração. A AWS assume uma IAM Role para o job, com credenciais temporárias (STS, válidas por 1h).</p><p><strong>Configuração:</strong> (1) Criar IAM OIDC Provider para token.actions.githubusercontent.com na conta AWS. (2) Criar IAM Role com trust policy que permite assumir só pelo repositório e branch corretos (condition: sub = repo:minha-empresa/infra:ref:refs/heads/main). (3) No GitHub Actions: permissions: id-token: write + uses: aws-actions/configure-aws-credentials@v4 com role-to-assume.</p><p><strong>Permissões mínimas:</strong> Role de plan com read-only. Role de apply com permissões para criar/modificar os recursos específicos. Nunca AdministratorAccess para CI.</p><p><strong>Separação de preocupações:</strong> plan roda em todo PR, apply roda só após merge em main com environment protection rules que exigem aprovação manual para prod.</p>",
      level: "senior",
    },
    {
      q: "O que é terraform taint e quando usaria terraform replace?",
      a: "<p><strong>terraform taint (depreciado no 1.5+):</strong> marcava um recurso no state como 'corrompido' — o próximo plan geraria um destroy + create desse recurso. Era usado quando uma instância EC2 ficava em estado inválido ou um certificado precisava ser forçosamente recriado.</p><p><strong>terraform apply -replace (1.5+):</strong> substituto moderno do taint. Força a recriação de um recurso específico em um único comando, sem alterar o state entre operações.</p><pre>terraform apply -replace=aws_instance.web</pre><p><strong>Diferenças importantes:</strong></p><p>- -replace gera um plan mostrando o destroy + create antes de executar — você confirma o que vai acontecer.</p><p>- -replace pode ser combinado com -target para substituir só o recurso específico sem tocar nos demais.</p><p>- taint alterava o state sem mostrar preview — era perigoso em times porque o próximo apply de qualquer pessoa destruía o recurso.</p><p><strong>Casos de uso válidos:</strong> forçar rotação de certificados, recriar instância EC2 que ficou corrompida sem mudar o código HCL, forçar recriação de secret no Secrets Manager após vazamento.</p>",
      level: "pleno",
    },
    {
      q: "Como funciona o terraform plan -out e por que é importante em CI/CD?",
      a: "<p><strong>terraform plan -out=tfplan</strong> salva o plano calculado em um arquivo binário. O <strong>terraform apply tfplan</strong> posterior aplica exatamente aquele plano — sem recalcular, sem surpresas.</p><p><strong>Por que isso importa em CI/CD:</strong></p><p>Sem -out: o pipeline faz plan na etapa 1, aguarda aprovação humana, faz apply na etapa 2. Mas entre plan e apply podem passar horas — alguém pode ter mudado a infra, o plano ficou stale. O apply recalcula um novo plano e aplica sem revisão humana.</p><p>Com -out: o plan é salvo como artefato do CI, revisado e aprovado. O apply consome exatamente esse artefato — sem recalcular. Zero divergência entre o que foi aprovado e o que foi aplicado.</p><p><strong>Fluxo seguro completo:</strong></p><p>1. PR → plan -out=tfplan → salvar tfplan como artefato de CI<br>2. Postar diff no PR (via tfcmt ou gh CLI)<br>3. Revisão e aprovação humana<br>4. Merge → apply tfplan (consome o artefato aprovado)</p><p>O arquivo tfplan contém credenciais implicitamente — não commite no git. Use o sistema de artefatos do CI (GitHub Actions artifacts, S3) com TTL curto.</p>",
      level: "pleno",
    },
    {
      q: "Como Terraform lida com dependências entre recursos?",
      a: "<p>Terraform constrói um grafo de dependências (DAG — Directed Acyclic Graph) automaticamente a partir das referências no HCL.</p><p><strong>Dependências implícitas</strong> (automáticas): quando você referencia o atributo de um recurso em outro, Terraform entende que o segundo depende do primeiro.</p><pre>resource \"aws_subnet\" \"private\" {\n  vpc_id = aws_vpc.main.id  # implica: vpc deve existir primeiro\n}</pre><p><strong>Dependências explícitas</strong> (depends_on): para dependências que não aparecem como referência direta — por exemplo, uma Lambda que precisa de uma IAM Role, mas a referência está no ARN passado como variável de ambiente, não como atributo direto.</p><pre>resource \"aws_lambda_function\" \"processor\" {\n  ...\n  depends_on = [aws_iam_role_policy_attachment.lambda_exec]\n}</pre><p><strong>Execução paralela:</strong> recursos sem dependência entre si são criados em paralelo (até 10 por padrão, configurável com terraform apply -parallelism=N). Isso reduz drasticamente o tempo de apply para stacks grandes.</p><p><strong>Ciclos:</strong> Terraform detecta dependências circulares e rejeita com erro. Se você se deparar com um ciclo (SG-A referencia SG-B e vice-versa), a solução é usar aws_security_group_rule em vez de regras inline, quebrando o ciclo.</p>",
      level: "pleno",
    },
    {
      q: "Como validar variáveis e garantir que o módulo receba inputs corretos?",
      a: "<p>Terraform oferece múltiplas camadas de validação de variáveis:</p><p><strong>1. Tipo (type):</strong> valida o tipo estático da variável — string, number, bool, list, map, object, set. Erros de tipo são detectados no plan, antes de qualquer chamada à API.</p><p><strong>2. Validation blocks (Terraform 0.13+):</strong> lógica customizada com condition (expressão booleana) e error_message. Roda durante plan e apply.</p><pre>variable \"env\" {\n  type = string\n  validation {\n    condition     = contains([\"dev\",\"staging\",\"prod\"], var.env)\n    error_message = \"env deve ser dev, staging ou prod.\"\n  }\n}\n\nvariable \"instance_count\" {\n  type = number\n  validation {\n    condition     = var.instance_count >= 1 && var.instance_count <= 10\n    error_message = \"Entre 1 e 10 instâncias.\"\n  }\n}</pre><p><strong>3. sensitive = true:</strong> marca variáveis que contêm secrets — o valor não aparece nos logs do plan/apply. Mas atenção: o valor ainda fica em plaintext no state.</p><p><strong>4. nullable = false:</strong> força que a variável nunca seja null, mesmo que o chamador passe null explicitamente.</p><p><strong>5. object com atributos tipados:</strong> para configurações complexas, defina o type como object({ campo = tipo }) — Terraform valida que todos os atributos obrigatórios estão presentes com os tipos corretos.</p>",
      level: "pleno",
    },
    {
      q: "O que é Terraform Cloud e Terraform Enterprise? Quando fazem sentido?",
      a: "<p><strong>Terraform Cloud (TFC):</strong> SaaS da HashiCorp que gerencia state, runs (plan/apply), variáveis sensíveis, RBAC por workspace, módulos privados e políticas (Sentinel). Plano gratuito cobre equipes pequenas. Pago a partir de 20 usuários ou recursos enterprise.</p><p><strong>Terraform Enterprise (TFE):</strong> versão self-hosted do TFC. Instalado na VPC da empresa. Para organizações com compliance estrito que não podem ter state em SaaS externo (HIPAA, PCI-DSS, financeiro).</p><p><strong>Quando TFC/TFE fazem sentido:</strong></p><p>- Times grandes sem capacidade de manter o pipeline de CI/CD Terraform internamente.</p><p>- Necessidade de VCS-driven workflows (push → plan automático) sem configurar GitHub Actions.</p><p>- Sentinel (Policy as Code enterprise) para guardrails centralizados e auditoria.</p><p>- Private Module Registry para compartilhar módulos entre times de forma governada.</p><p><strong>Alternativa open source:</strong> pipeline próprio com GitHub Actions + S3 backend + checkov + tfcmt cobre 90% dos casos sem custo de licença. Use TFC/TFE quando a complexidade de manutenção do pipeline próprio superar o custo da licença.</p>",
      level: "senior",
    },
    {
      q: "Como migrar infraestrutura existente (criada manualmente ou com CloudFormation) para Terraform?",
      a: "<p><strong>Estratégia geral: import incremental, não big bang.</strong></p><p><strong>1. Inventário:</strong> liste todos os recursos a migrar. Priorize por criticidade — comece pelos menos críticos (buckets S3 de logs, SGs auxiliares) para aprender o fluxo antes de tocar banco de produção.</p><p><strong>2. Escreva o HCL primeiro:</strong> crie os blocos resource correspondentes com os atributos que você acha que o recurso tem. Para CloudFormation: muitos atributos mapeiam diretamente.</p><p><strong>3. terraform import:</strong> associa o recurso ao state. Após o import, rode terraform plan — se houver diff, ajuste o HCL até o plan mostrar zero mudanças (No changes).</p><p><strong>4. Terraform 1.5+ — bloco import + generate-config:</strong></p><pre>import {\n  to = aws_s3_bucket.data\n  id = \"meu-bucket-prod\"\n}\n</pre><p>terraform plan -generate-config-out=generated.tf gera o HCL automaticamente. Revise, limpe e incorpore ao código real.</p><p><strong>5. Validação pós-import:</strong> após zerar o plan, rode um apply e confirme que mostra zero mudanças — infraestrutura está totalmente sob controle do Terraform.</p><p><strong>Armadilha CloudFormation:</strong> stacks CF e Terraform não se comunicam nativamente. Opções: usar data sources para ler outputs de stacks CF, ou migrar completamente (import todos os recursos, depois deletar a stack CF sem destruir os recursos — aws cloudformation delete-stack --retain-resources).</p>",
      level: "senior",
    },
    {
      q: "Explique o conceito de provider aliases e multiple provider configurations.",
      a: "<p>Por padrão, um provider tem uma única configuração (região, credenciais). Provider aliases permitem múltiplas configurações do mesmo provider no mesmo módulo — essencial para recursos multi-região ou multi-conta.</p><p><strong>Caso 1 — Multi-região:</strong> CloudFront exige certificado ACM em us-east-1, mas a aplicação roda em sa-east-1.</p><pre>provider \"aws\" {\n  region = \"sa-east-1\"         # provider default\n}\nprovider \"aws\" {\n  alias  = \"us-east-1\"\n  region = \"us-east-1\"         # provider alternativo\n}\nresource \"aws_acm_certificate\" \"cdn\" {\n  provider          = aws.us-east-1  # usa o alias\n  domain_name       = \"*.minha-app.com\"\n  validation_method = \"DNS\"\n}</pre><p><strong>Caso 2 — Multi-conta:</strong> recurso em conta de segurança diferente da conta de aplicação.</p><pre>provider \"aws\" {\n  alias      = \"security-account\"\n  assume_role { role_arn = \"arn:aws:iam::SECURITY_ACCOUNT:role/TerraformRole\" }\n}</pre><p><strong>Passagem para módulos:</strong> o root module passa o alias para o child module via providers = { aws = aws.us-east-1 }. Módulos recebem o provider como argumento — isso mantém o módulo portável e testável.</p>",
      level: "senior",
    },
    {
      q: "Como identificar e corrigir performance lenta em terraform plan ou apply?",
      a: "<p>Plans e applies lentos geralmente têm causas específicas e soluções diretas.</p><p><strong>1. Muitos recursos em um único state:</strong> Terraform lê o state e chama a API de cada recurso durante o refresh (para detectar drift). Com 500+ recursos, isso pode demorar minutos. Solução: fragmentar o state — separar infra de rede (VPC, subnets) de infra de aplicação (ECS, RDS). Cada state tem um scope menor e o plan é mais rápido.</p><p><strong>2. data sources lentos:</strong> data sources que consultam a API da AWS durante o plan adicionam latência. Use -refresh=false para planos em que você sabe que o state está atualizado (mas com cuidado — você pode perder drift). Alternativa: cachear outputs de módulos de rede em terraform_remote_state.</p><p><strong>3. -parallelism:</strong> o padrão é 10 operações paralelas. Aumentar para -parallelism=20 pode acelerar applies com muitos recursos independentes. Mas rate limits de API da AWS podem causar erros — teste com cautela.</p><p><strong>4. -target:</strong> plan/apply de um módulo ou recurso específico. Usar em desenvolvimento para iterar rápido, nunca em produção como prática regular (pode criar drift entre módulos).</p><p><strong>5. TF_LOG=JSON + timestamps:</strong> ativar logging detalhado ajuda a identificar qual chamada de API está demorando — frequentemente é um serviço específico com latência alta.</p>",
      level: "senior",
    },
  ],
  videos: [
    { title: "Terraform in 100 Seconds", channel: "Fireship", url: "https://www.youtube.com/watch?v=tomUWcQ0P3k", topic: "Visão geral rápida do conceito de IaC com Terraform" },
    { title: "Terraform Course — Automate your AWS cloud infrastructure", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=SLB_c_ayRMo", topic: "Curso completo do zero: providers, state, módulos, S3 backend" },
    { title: "Terraform Remote State & Backend S3 Tutorial", channel: "TechWorld with Nana", url: "https://www.youtube.com/watch?v=RA1mNClGYJ4", topic: "Configuração de backend remoto com S3 + DynamoDB locking passo a passo" },
    { title: "How to Structure Terraform Projects", channel: "Anton Babenko", url: "https://www.youtube.com/watch?v=mOsiLZGdXS4", topic: "Estrutura de repositório, módulos, multi-ambiente — boas práticas de autor de módulos AWS oficiais" },
    { title: "Terraform Modules Deep Dive", channel: "HashiCorp", url: "https://www.youtube.com/watch?v=Q3kbXAOAFSk", topic: "Módulos reutilizáveis, inputs, outputs, versioning, Registry" },
  ],
  exercises: [
    {
      level: "iniciante",
      title: "VPC + EC2 com Security Group em HCL do zero",
      description: "Provisione uma VPC com subnets pública e privada, Internet Gateway, Security Group e uma instância EC2 na subnet pública. Configure o backend remoto com S3 + DynamoDB antes de aplicar.",
      concepts: ["aws_vpc", "aws_subnet", "aws_internet_gateway", "aws_security_group", "aws_instance", "remote backend S3 + DynamoDB"],
      hint: "Comece criando o bucket S3 e a tabela DynamoDB manualmente ou via console, configure o backend.tf, rode terraform init. Use data.aws_ami para encontrar a AMI Ubuntu mais recente em vez de hardcodar o ID.",
      relatedKeypoints: [0, 1, 4],
    },
    {
      level: "intermediario",
      title: "Módulo VPC reutilizável com for_each e múltiplos ambientes",
      description: "Extraia a VPC do exercício anterior para um módulo reutilizável (modules/vpc/). Crie dois environments (envs/dev/ e envs/staging/) que chamam o módulo com CIDRs e números de AZs diferentes. Use for_each para criar subnets dinamicamente por AZ. Outputs do módulo: vpc_id, private_subnet_ids, public_subnet_ids.",
      concepts: ["módulos child", "for_each com map", "inputs/outputs de módulo", "diretórios separados por ambiente", "tfvars por ambiente"],
      hint: "Defina var.private_subnets como map(string) no módulo — chaves são AZs, valores são CIDRs. O root module passa o mapa e o for_each itera. Outputs do módulo devem usar values(aws_subnet.private) para retornar lista de IDs.",
      relatedKeypoints: [2, 3],
    },
    {
      level: "senior",
      title: "Pipeline GitOps com Terraform, GitHub Actions, OIDC e Checkov",
      description: "Configure um pipeline completo de GitOps para a infra do exercício anterior: (1) PR trigger: checkov para análise de segurança + terraform plan postado como comentário no PR. (2) Merge em main: terraform apply automático para dev, apply com aprovação manual para staging. (3) Autenticação via OIDC — sem AWS_ACCESS_KEY_ID em secrets. (4) Separação de roles: PlanRole (read-only) e ApplyRole (write restrito). Adicione prevent_destroy no VPC e no Security Group principal.",
      concepts: ["OIDC com GitHub Actions", "IAM Role trust policy por repositório/branch", "checkov no CI", "terraform plan -out + artefato", "environment protection rules", "prevent_destroy", "lifecycle rules"],
      hint: "A trust policy da IAM Role deve conter a condition: token.actions.githubusercontent.com:sub = repo:OWNER/REPO:ref:refs/heads/main para apply, e repo:OWNER/REPO:pull_request para plan. Use aws-actions/configure-aws-credentials@v4 com role-to-assume. Salve o tfplan como artifact e consuma no job de apply.",
      relatedKeypoints: [7, 8],
    },
  ],
  mindmap: {
    title: "Terraform — mapa mental completo",
    html: `<style>
.tfmm-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:24px 20px;color:#e2e8f0;overflow:auto}
.tfmm-center{background:linear-gradient(135deg,rgba(123,66,188,.25),rgba(123,66,188,.1));border:2px solid #7B42BC;border-radius:12px;padding:10px 18px;text-align:center;font-size:13px;font-weight:700;color:#c4b5fd;display:inline-block;margin:0 auto;white-space:nowrap}
.tfmm-root{display:flex;flex-direction:column;align-items:center;gap:20px}
.tfmm-ring{display:flex;flex-wrap:wrap;gap:14px;justify-content:center;margin-top:4px}
.tfmm-branch{background:#1e293b;border-radius:10px;padding:12px 14px;min-width:180px;max-width:220px;flex:1}
.tfmm-btitle{font-size:9px;letter-spacing:.12em;text-transform:uppercase;font-weight:700;margin-bottom:8px;padding-bottom:5px;border-bottom:1px solid rgba(255,255,255,.06)}
.tfmm-leaf{font-size:9.5px;color:#64748b;padding:3px 0;line-height:1.5;border-bottom:1px solid rgba(255,255,255,.03)}
.tfmm-leaf:last-child{border-bottom:none}
.tfmm-leaf::before{content:'▸ ';color:#475569}
.tfmm-leaf span{color:#94a3b8}
.tfmm-connector{color:#334155;font-size:11px;text-align:center;padding:2px 0}
</style>
<div class="tfmm-wrap">
<div class="tfmm-root">
  <div class="tfmm-center">TERRAFORM</div>
  <div class="tfmm-connector">↓ IaC declarativo multi-cloud — HCL → Estado → Infra Real</div>

  <div class="tfmm-ring">
    <!-- Fluxo -->
    <div class="tfmm-branch" style="border:1.5px solid #7B42BC">
      <div class="tfmm-btitle" style="color:#7B42BC">Ciclo de vida</div>
      <div class="tfmm-leaf"><span>terraform init</span> — providers + backend</div>
      <div class="tfmm-leaf"><span>terraform validate</span> — sintaxe HCL</div>
      <div class="tfmm-leaf"><span>terraform plan</span> — diff sem aplicar</div>
      <div class="tfmm-leaf"><span>terraform apply</span> — modifica infra</div>
      <div class="tfmm-leaf"><span>terraform destroy</span> — remove tudo</div>
      <div class="tfmm-leaf"><span>-replace</span> — recria recurso específico</div>
    </div>

    <!-- State -->
    <div class="tfmm-branch" style="border:1.5px solid #FF9900">
      <div class="tfmm-btitle" style="color:#FF9900">State</div>
      <div class="tfmm-leaf">terraform.tfstate — mapeamento HCL ↔ cloud</div>
      <div class="tfmm-leaf"><span>Remote backend:</span> S3 + DynamoDB</div>
      <div class="tfmm-leaf"><span>Locking:</span> DynamoDB ConditionalCheck</div>
      <div class="tfmm-leaf"><span>state list / show / mv / rm</span></div>
      <div class="tfmm-leaf"><span>terraform import</span> — adota existente</div>
      <div class="tfmm-leaf">Nunca edite manualmente!</div>
    </div>

    <!-- HCL Blocks -->
    <div class="tfmm-branch" style="border:1.5px solid #4ade80">
      <div class="tfmm-btitle" style="color:#4ade80">Blocos HCL</div>
      <div class="tfmm-leaf"><span>resource</span> — o que criar/gerenciar</div>
      <div class="tfmm-leaf"><span>data</span> — ler recurso existente</div>
      <div class="tfmm-leaf"><span>variable</span> — input com tipo + validação</div>
      <div class="tfmm-leaf"><span>output</span> — exportar valores</div>
      <div class="tfmm-leaf"><span>locals</span> — valores computados</div>
      <div class="tfmm-leaf"><span>module</span> — chamar child module</div>
    </div>

    <!-- Módulos -->
    <div class="tfmm-branch" style="border:1.5px solid #a78bfa">
      <div class="tfmm-btitle" style="color:#a78bfa">Módulos</div>
      <div class="tfmm-leaf">Root module — diretório de trabalho</div>
      <div class="tfmm-leaf">Child modules — source local/git/registry</div>
      <div class="tfmm-leaf"><span>Versione</span> sempre com version = "~> X.Y"</div>
      <div class="tfmm-leaf">Interface: variables.tf + outputs.tf</div>
      <div class="tfmm-leaf">terraform-aws-modules VPC / ECS / RDS</div>
      <div class="tfmm-leaf">Teste com Terratest (Go)</div>
    </div>

    <!-- Loops e Condicionais -->
    <div class="tfmm-branch" style="border:1.5px solid #f59e0b">
      <div class="tfmm-btitle" style="color:#f59e0b">Iteração e controle</div>
      <div class="tfmm-leaf"><span>for_each</span> map/set — identidade por key</div>
      <div class="tfmm-leaf"><span>count</span> — N cópias por índice</div>
      <div class="tfmm-leaf"><span>dynamic block</span> — blocos dinâmicos</div>
      <div class="tfmm-leaf"><span>condition ? a : b</span> — ternário</div>
      <div class="tfmm-leaf">toset() para converter lista → set</div>
      <div class="tfmm-leaf">for expr + locals para transformações</div>
    </div>

    <!-- Lifecycle -->
    <div class="tfmm-branch" style="border:1.5px solid #ef4444">
      <div class="tfmm-btitle" style="color:#ef4444">Lifecycle Rules</div>
      <div class="tfmm-leaf"><span>create_before_destroy</span> — zero downtime</div>
      <div class="tfmm-leaf"><span>prevent_destroy</span> — proteção prod</div>
      <div class="tfmm-leaf"><span>ignore_changes</span> — drift intencional</div>
      <div class="tfmm-leaf"><span>replace_triggered_by</span> — cascata</div>
      <div class="tfmm-leaf">Usar em ACM certs, RDS, SGs críticos</div>
      <div class="tfmm-leaf">depends_on para dependências implícitas</div>
    </div>

    <!-- CI/CD -->
    <div class="tfmm-branch" style="border:1.5px solid #38bdf8">
      <div class="tfmm-btitle" style="color:#38bdf8">CI/CD Seguro</div>
      <div class="tfmm-leaf"><span>OIDC</span> — sem access keys em secrets</div>
      <div class="tfmm-leaf">PR → plan -out → artefato → revisão</div>
      <div class="tfmm-leaf">Merge → apply artefato aprovado</div>
      <div class="tfmm-leaf"><span>checkov / tfsec</span> — linting de segurança</div>
      <div class="tfmm-leaf">PlanRole (read) vs ApplyRole (write)</div>
      <div class="tfmm-leaf">Environment protection rules para prod</div>
    </div>

    <!-- Multi-ambiente -->
    <div class="tfmm-branch" style="border:1.5px solid #34d399">
      <div class="tfmm-btitle" style="color:#34d399">Multi-ambiente</div>
      <div class="tfmm-leaf">Diretórios separados: envs/dev, envs/prod</div>
      <div class="tfmm-leaf">State isolado por ambiente no S3</div>
      <div class="tfmm-leaf">tfvars por ambiente (prod.tfvars)</div>
      <div class="tfmm-leaf">Workspaces — apenas ambientes efêmeros</div>
      <div class="tfmm-leaf">IAM roles separadas por ambiente</div>
      <div class="tfmm-leaf">terraform_remote_state para outputs cross-stack</div>
    </div>
  </div>
</div>
</div>`,
    caption: "Terraform como sistema: state conecta o HCL à realidade. Módulos organizam o código. Lifecycle protege produção. CI/CD com OIDC elimina credenciais de longa duração.",
  },
  resources: [
    { title: "Terraform docs", url: "https://developer.hashicorp.com/terraform/docs", kind: "docs" },
    { title: "Terraform: Up and Running — Yevgeniy Brikman (O'Reilly)", url: "https://www.terraformupandrunning.com/", kind: "livro" },
    { title: "Terraform Registry", url: "https://registry.terraform.io/", kind: "pratica" },
    { title: "terraform-aws-modules (VPC, ECS, RDS)", url: "https://github.com/terraform-aws-modules", kind: "pratica" },
    { title: "Terratest", url: "https://terratest.gruntwork.io/", kind: "docs" },
    { title: "checkov — static analysis", url: "https://www.checkov.io/", kind: "pratica" },
    { title: "Terraform Best Practices — Anton Babenko", url: "https://www.terraform-best-practices.com/", kind: "artigo" },
    { title: "HashiCorp Learn — Terraform", url: "https://developer.hashicorp.com/terraform/tutorials", kind: "curso" },
  ],
  codeExamples: [
    {
      title: "VPC completa com subnets públicas e privadas",
      language: "hcl",
      description: "Provisionamento de VPC completa com subnets públicas (internet gateway + route table) e privadas (NAT gateway) em duas availability zones.",
      code: `terraform {
required_providers {
  aws = {
    source  = "hashicorp/aws"
    version = "~> 5.0"
  }
}
required_version = ">= 1.5.0"
}

provider "aws" {
region = var.aws_region
}

variable "aws_region" {
default = "us-east-1"
}

# VPC principal
resource "aws_vpc" "main" {
cidr_block           = "10.0.0.0/16"
enable_dns_hostnames = true
enable_dns_support   = true

tags = { Name = "main-vpc" }
}

# Internet Gateway para subnets públicas
resource "aws_internet_gateway" "main" {
vpc_id = aws_vpc.main.id
tags   = { Name = "main-igw" }
}

# Subnets públicas (duas AZs)
resource "aws_subnet" "public_a" {
vpc_id                  = aws_vpc.main.id
cidr_block              = "10.0.1.0/24"
availability_zone       = "\${var.aws_region}a"
map_public_ip_on_launch = true
tags = { Name = "public-a", Tier = "public" }
}

resource "aws_subnet" "public_b" {
vpc_id                  = aws_vpc.main.id
cidr_block              = "10.0.2.0/24"
availability_zone       = "\${var.aws_region}b"
map_public_ip_on_launch = true
tags = { Name = "public-b", Tier = "public" }
}

# Subnets privadas (duas AZs)
resource "aws_subnet" "private_a" {
vpc_id            = aws_vpc.main.id
cidr_block        = "10.0.10.0/24"
availability_zone = "\${var.aws_region}a"
tags = { Name = "private-a", Tier = "private" }
}

resource "aws_subnet" "private_b" {
vpc_id            = aws_vpc.main.id
cidr_block        = "10.0.11.0/24"
availability_zone = "\${var.aws_region}b"
tags = { Name = "private-b", Tier = "private" }
}

# Route table pública + associações
resource "aws_route_table" "public" {
vpc_id = aws_vpc.main.id

route {
  cidr_block = "0.0.0.0/0"
  gateway_id = aws_internet_gateway.main.id
}

tags = { Name = "public-rt" }
}

resource "aws_route_table_association" "public_a" {
subnet_id      = aws_subnet.public_a.id
route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public_b" {
subnet_id      = aws_subnet.public_b.id
route_table_id = aws_route_table.public.id
}

# Elastic IP + NAT Gateway para subnets privadas
resource "aws_eip" "nat" {
domain     = "vpc"
depends_on = [aws_internet_gateway.main]
tags       = { Name = "nat-eip" }
}

resource "aws_nat_gateway" "main" {
allocation_id = aws_eip.nat.id
subnet_id     = aws_subnet.public_a.id
tags          = { Name = "main-nat" }
depends_on    = [aws_internet_gateway.main]
}

# Route table privada + associações
resource "aws_route_table" "private" {
vpc_id = aws_vpc.main.id

route {
  cidr_block     = "0.0.0.0/0"
  nat_gateway_id = aws_nat_gateway.main.id
}

tags = { Name = "private-rt" }
}

resource "aws_route_table_association" "private_a" {
subnet_id      = aws_subnet.private_a.id
route_table_id = aws_route_table.private.id
}

resource "aws_route_table_association" "private_b" {
subnet_id      = aws_subnet.private_b.id
route_table_id = aws_route_table.private.id
}

# Outputs
output "vpc_id" {
value = aws_vpc.main.id
}

output "public_subnet_ids" {
value = [aws_subnet.public_a.id, aws_subnet.public_b.id]
}

output "private_subnet_ids" {
value = [aws_subnet.private_a.id, aws_subnet.private_b.id]
}`,
    },
    {
      title: "Módulo reutilizável para Lambda + API Gateway",
      language: "hcl",
      description: "Estrutura de módulo Terraform que encapsula Lambda + API Gateway REST. O root module instancia duas vezes (api e worker) demonstrando reusabilidade.",
      code: `# ─── modules/lambda-api/variables.tf ───────────────────────────────────────
variable "function_name" {
description = "Nome da função Lambda"
type        = string
}

variable "runtime" {
description = "Runtime da Lambda (ex: nodejs20.x, python3.12)"
type        = string
default     = "nodejs20.x"
}

variable "handler" {
description = "Handler da Lambda (arquivo.função)"
type        = string
default     = "index.handler"
}

variable "environment_variables" {
description = "Variáveis de ambiente da Lambda"
type        = map(string)
default     = {}
}

variable "memory_size" {
description = "Memória em MB"
type        = number
default     = 256
}

variable "timeout" {
description = "Timeout em segundos"
type        = number
default     = 30
}

# ─── modules/lambda-api/main.tf ────────────────────────────────────────────
resource "aws_iam_role" "lambda" {
name = "\${var.function_name}-role"

assume_role_policy = jsonencode({
  Version = "2012-10-17"
  Statement = [{
    Action    = "sts:AssumeRole"
    Effect    = "Allow"
    Principal = { Service = "lambda.amazonaws.com" }
  }]
})
}

resource "aws_iam_role_policy_attachment" "basic" {
role       = aws_iam_role.lambda.name
policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "this" {
function_name = var.function_name
role          = aws_iam_role.lambda.arn
runtime       = var.runtime
handler       = var.handler
memory_size   = var.memory_size
timeout       = var.timeout
filename      = "\${path.module}/placeholder.zip"

environment {
  variables = var.environment_variables
}
}

resource "aws_api_gateway_rest_api" "this" {
name = "\${var.function_name}-api"
}

resource "aws_api_gateway_resource" "proxy" {
rest_api_id = aws_api_gateway_rest_api.this.id
parent_id   = aws_api_gateway_rest_api.this.root_resource_id
path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "proxy" {
rest_api_id   = aws_api_gateway_rest_api.this.id
resource_id   = aws_api_gateway_resource.proxy.id
http_method   = "ANY"
authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda" {
rest_api_id             = aws_api_gateway_rest_api.this.id
resource_id             = aws_api_gateway_resource.proxy.id
http_method             = aws_api_gateway_method.proxy.http_method
integration_http_method = "POST"
type                    = "AWS_PROXY"
uri                     = aws_lambda_function.this.invoke_arn
}

resource "aws_lambda_permission" "apigw" {
statement_id  = "AllowAPIGatewayInvoke"
action        = "lambda:InvokeFunction"
function_name = aws_lambda_function.this.function_name
principal     = "apigateway.amazonaws.com"
source_arn    = "\${aws_api_gateway_rest_api.this.execution_arn}/*/*"
}

output "api_endpoint" {
value = "https://\${aws_api_gateway_rest_api.this.id}.execute-api.\${data.aws_region.current.name}.amazonaws.com/prod"
}

data "aws_region" "current" {}

# ─── main.tf (root) ────────────────────────────────────────────────────────
module "api" {
source        = "./modules/lambda-api"
function_name = "meu-servico-api"
runtime       = "nodejs20.x"
memory_size   = 512
timeout       = 15
environment_variables = {
  NODE_ENV   = "production"
  LOG_LEVEL  = "info"
}
}

module "worker" {
source        = "./modules/lambda-api"
function_name = "meu-servico-worker"
runtime       = "python3.12"
handler       = "main.handler"
memory_size   = 1024
timeout       = 900
environment_variables = {
  QUEUE_URL = "https://sqs.us-east-1.amazonaws.com/123456789/minha-fila"
}
}

# ─── outputs.tf (root) ─────────────────────────────────────────────────────
output "api_endpoint" {
description = "URL pública da API Gateway"
value       = module.api.api_endpoint
}`,
    },
    {
      title: "Remote state com S3 + DynamoDB lock",
      language: "hcl",
      description: "Configuração completa de remote state: bucket S3 com versionamento e criptografia, tabela DynamoDB para state locking, backend block e exemplo de leitura cross-stack com terraform_remote_state.",
      code: `# ─── bootstrap/main.tf — rodar uma vez por conta AWS ──────────────────────
# Bucket S3 para armazenar o tfstate
resource "aws_s3_bucket" "tfstate" {
bucket = "minha-empresa-terraform-state"

lifecycle {
  prevent_destroy = true
}

tags = { Purpose = "terraform-state" }
}

resource "aws_s3_bucket_versioning" "tfstate" {
bucket = aws_s3_bucket.tfstate.id

versioning_configuration {
  status = "Enabled"
}
}

resource "aws_s3_bucket_server_side_encryption_configuration" "tfstate" {
bucket = aws_s3_bucket.tfstate.id

rule {
  apply_server_side_encryption_by_default {
    sse_algorithm = "AES256"
  }
}
}

# Bloquear todo acesso público ao bucket de state
resource "aws_s3_bucket_public_access_block" "tfstate" {
bucket                  = aws_s3_bucket.tfstate.id
block_public_acls       = true
block_public_policy     = true
ignore_public_acls      = true
restrict_public_buckets = true
}

# Tabela DynamoDB para state locking
resource "aws_dynamodb_table" "tflock" {
name         = "terraform-state-lock"
billing_mode = "PAY_PER_REQUEST"
hash_key     = "LockID"

attribute {
  name = "LockID"
  type = "S"
}

tags = { Purpose = "terraform-state-lock" }
}

# ─── backend.tf — configurar ANTES do terraform init ─────────────────────
terraform {
backend "s3" {
  bucket         = "minha-empresa-terraform-state"
  key            = "prod/vpc/terraform.tfstate"
  region         = "us-east-1"
  encrypt        = true
  dynamodb_table = "terraform-state-lock"
}
}

# ─── Leitura de outputs cross-stack com terraform_remote_state ───────────
# Em outro módulo que precisa dos IDs de VPC/subnets:
data "terraform_remote_state" "vpc" {
backend = "s3"

config = {
  bucket = "minha-empresa-terraform-state"
  key    = "prod/vpc/terraform.tfstate"
  region = "us-east-1"
}
}

# Usando os outputs do stack de VPC
resource "aws_ecs_service" "app" {
name    = "meu-servico"
cluster = aws_ecs_cluster.main.id

network_configuration {
  subnets         = data.terraform_remote_state.vpc.outputs.private_subnet_ids
  security_groups = [aws_security_group.app.id]
}

# ... demais configurações
}`,
    },
  ],
}

export default terraform
