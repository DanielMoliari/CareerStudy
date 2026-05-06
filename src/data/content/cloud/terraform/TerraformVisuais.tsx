'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { HookTimeline } from '@/components/visuals/HookTimeline'
import type { TimelinePhase } from '@/components/visuals/HookTimeline'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'
import { StateMachineExplorer } from '@/components/visuals/StateMachineExplorer'
import type { SMState, SMTransition } from '@/components/visuals/StateMachineExplorer'
import { CodeStepper } from '@/components/visuals/CodeStepper'
import type { CodeStepperScenario } from '@/components/visuals/CodeStepper'

// ── Paleta Terraform ──────────────────────────────────────────────────────────
const C      = '#7B42BC'   // roxo Terraform
const C2     = '#5e3090'   // roxo secundário
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#4ade80'
const AMB    = '#f59e0b'
const RED    = '#ef4444'
const BLU    = '#60a5fa'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Ciclo init → plan → apply → destroy
// HookTimeline: cada fase é uma etapa com código representativo
// ═══════════════════════════════════════════════════════════════════════════════

const TF_PHASES: TimelinePhase[] = [
  {
    id: 'init',
    emoji: '⚙️',
    name: 'terraform init',
    color: BLU,
    short: 'Prepara o workspace',
    detail: 'Baixa os plugins de provider (.terraform/), configura o backend remoto (S3, TFC) e instala módulos referenciados. Gera .terraform.lock.hcl com hashes dos providers. Deve rodar uma vez por workspace e em toda pipeline de CI após clone.',
    code: [
      [{ text: '# Inicializa backend S3 + provider AWS', color: FGMUTE }],
      [{ text: 'terraform init', color: C }],
      [{ text: '' }],
      [{ text: '# Saída: Terraform has been successfully initialized!', color: GRN }],
      [{ text: '# .terraform/providers/registry.terraform.io/...', color: FGMUTE }],
      [{ text: '# .terraform.lock.hcl   ← commitar no git', color: AMB }],
    ],
  },
  {
    id: 'plan',
    emoji: '🔍',
    name: 'terraform plan',
    color: AMB,
    short: 'Calcula o diff sem aplicar',
    detail: 'Lê o state atual (tfstate no backend remoto), consulta as APIs da cloud para checar o estado real dos recursos, e calcula o diff contra o código HCL. Mostra o que será criado (+), atualizado (~) ou destruído (-). Nunca modifica nada. Salve o plano com -out=plan.tfplan para CI reproduzível.',
    code: [
      [{ text: 'terraform plan -out=plan.tfplan', color: C }],
      [{ text: '' }],
      [{ text: '# Terraform will perform the following actions:', color: FGMUTE }],
      [{ text: '  + aws_instance.app will be created', color: GRN }],
      [{ text: '  ~ aws_security_group.web will be updated', color: AMB }],
      [{ text: '  - aws_s3_bucket.old will be destroyed', color: RED }],
      [{ text: '' }],
      [{ text: 'Plan: 1 to add, 1 to change, 1 to destroy.', color: FG }],
    ],
  },
  {
    id: 'apply',
    emoji: '🚀',
    name: 'terraform apply',
    color: GRN,
    short: 'Aplica e atualiza o state',
    detail: 'Exibe o plan novamente, solicita confirmação (yes) e chama as APIs da cloud para criar/atualizar/destruir recursos. Ao final, atualiza o tfstate no backend remoto. Em CI, use terraform apply plan.tfplan (sem confirmação interativa) passando o arquivo gerado pelo plan.',
    code: [
      [{ text: '# Em CI: usa o plano salvo (sem prompt)', color: FGMUTE }],
      [{ text: 'terraform apply plan.tfplan', color: C }],
      [{ text: '' }],
      [{ text: '# Interativo (desenvolvimento local):', color: FGMUTE }],
      [{ text: 'terraform apply', color: C }],
      [{ text: '# Do you want to perform these actions?', color: FG }],
      [{ text: '#   Enter a value: yes', color: GRN }],
      [{ text: '' }],
      [{ text: 'Apply complete! Resources: 1 added, 1 changed, 1 destroyed.', color: GRN }],
    ],
  },
  {
    id: 'destroy',
    emoji: '🗑️',
    name: 'terraform destroy',
    color: RED,
    short: 'Remove toda a infraestrutura',
    detail: 'Destrói TODOS os recursos gerenciados pelo state atual. Equivale a terraform apply -destroy. Raramente usado em produção — prefira remover o resource do HCL e rodar plan/apply. Proteja recursos críticos com lifecycle { prevent_destroy = true } para evitar destruição acidental.',
    code: [
      [{ text: '# ⚠️  Destrói tudo — use com cautela', color: RED }],
      [{ text: 'terraform destroy', color: RED }],
      [{ text: '' }],
      [{ text: '# Proteger recurso crítico no HCL:', color: FGMUTE }],
      [{ text: 'resource "aws_rds_instance" "prod" {', color: FG }],
      [{ text: '  lifecycle {', color: FG }],
      [{ text: '    prevent_destroy = true  # destroy falha com erro', color: GRN }],
      [{ text: '  }', color: FG }],
      [{ text: '}', color: FG }],
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — State file: ciclo de vida do tfstate
// StateMachineExplorer: estados possíveis do recurso no tfstate
// ═══════════════════════════════════════════════════════════════════════════════

const STATE_STATES: SMState[] = [
  { id: 'nao-existe',   label: 'Não no state',    description: 'Recurso não existe no tfstate. Terraform não sabe nada sobre ele.', color: FGMUTE, isInitial: true },
  { id: 'planejado',   label: 'Plan pendente',    description: 'terraform plan identificou que o recurso deve ser criado. State ainda não atualizado.', color: AMB },
  { id: 'gerenciado',  label: 'Gerenciado',       description: 'Recurso existe na cloud E no tfstate. Terraform rastreia todos os atributos.', color: GRN },
  { id: 'drift',       label: 'Drift detectado',  description: 'Recurso existe na cloud mas foi modificado fora do Terraform (console, CLI, outro time). terraform plan mostra diff.', color: RED },
  { id: 'orfao',       label: 'Órfão no state',   description: 'Recurso existe no tfstate mas foi removido manualmente da cloud. terraform plan mostra "must be replaced".', color: '#f97316' },
  { id: 'removido',    label: 'Removido',         description: 'Recurso destruído. Entry removida do tfstate. Estado final antes de voltar a "Não no state".', color: '#94a3b8', isFinal: true },
]

const STATE_TRANSITIONS: SMTransition[] = [
  { from: 'nao-existe',  to: 'planejado',  event: 'terraform plan',   code: 'Plan: 1 to add' },
  { from: 'planejado',   to: 'gerenciado', event: 'terraform apply',  code: 'aws_instance.app: Creation complete' },
  { from: 'gerenciado',  to: 'drift',      event: 'modificação manual na cloud', guard: 'sem Terraform' },
  { from: 'drift',       to: 'gerenciado', event: 'terraform apply',  code: 'Reconcilia config vs cloud' },
  { from: 'gerenciado',  to: 'orfao',      event: 'delete manual na cloud', guard: 'sem Terraform' },
  { from: 'orfao',       to: 'gerenciado', event: 'terraform apply',  code: 'Resource must be replaced — recria' },
  { from: 'gerenciado',  to: 'removido',   event: 'terraform destroy', code: 'Destruction complete' },
  { from: 'removido',    to: 'nao-existe', event: 'entry removida do state', code: 'State limpo' },
  { from: 'gerenciado',  to: 'nao-existe', event: 'terraform state rm', code: 'Remove do state sem destruir na cloud' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Arquitetura de módulos
// LayerStack: camadas de composição de módulos
// ═══════════════════════════════════════════════════════════════════════════════

const MODULE_LAYERS: Layer[] = [
  {
    id: 'root',
    label: 'Root Module',
    sublabel: 'Ponto de entrada — environments/prod/',
    description: 'O módulo raiz é o diretório onde você roda terraform init/plan/apply. Contém main.tf, variables.tf e outputs.tf. Chama módulos filhos e define os valores específicos do ambiente (prod, staging).',
    code: 'module "vpc" {\n  source = "../../modules/vpc"\n  cidr   = var.vpc_cidr\n}',
    color: C,
    examples: ['environments/prod/main.tf', 'environments/staging/main.tf'],
  },
  {
    id: 'child',
    label: 'Módulos Filhos',
    sublabel: 'modules/ — reutilizáveis entre ambientes',
    description: 'Módulos filhos encapsulam recursos relacionados (VPC, ECS cluster, RDS). Recebem input via variables e expõem output values. São chamados pelo root module ou por outros módulos. Devem ser idempotentes e sem efeitos colaterais.',
    code: '# modules/ecs-service/variables.tf\nvariable "image_tag" {\n  type    = string\n  description = "Docker image tag"\n}',
    color: C2,
    examples: ['modules/vpc/', 'modules/ecs-service/', 'modules/rds/'],
  },
  {
    id: 'registry',
    label: 'Registry Público',
    sublabel: 'registry.terraform.io — módulos da comunidade',
    description: 'O Terraform Registry hospeda milhares de módulos públicos verificados. Módulos populares: terraform-aws-modules/vpc, terraform-aws-modules/ecs. Use com cautela — pin sempre a uma versão específica para não quebrar com breaking changes.',
    code: 'module "vpc" {\n  source  = "terraform-aws-modules/vpc/aws"\n  version = "5.1.0"   # ← sempre pin!\n}',
    color: '#3b82f6',
    examples: ['terraform-aws-modules/vpc/aws', 'terraform-aws-modules/ecs/aws'],
  },
  {
    id: 'provider',
    label: 'Providers',
    sublabel: 'Plugins que chamam APIs da cloud',
    description: 'Providers são plugins Go que traduzem recursos HCL em chamadas de API (AWS, GCP, Azure, K8s, Cloudflare, GitHub...). Definidos em required_providers com versão travada no lock file. O lock file (.terraform.lock.hcl) deve ser commitado no git.',
    code: 'terraform {\n  required_providers {\n    aws = {\n      source  = "hashicorp/aws"\n      version = "~> 5.0"  # >= 5.0, < 6.0\n    }\n  }\n}',
    color: '#f59e0b',
    examples: ['hashicorp/aws', 'hashicorp/google', 'hashicorp/kubernetes'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Anti-patterns
// AntiPatternsGallery: erros frequentes em IaC com Terraform
// ═══════════════════════════════════════════════════════════════════════════════

const TF_ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'Credenciais hardcoded no HCL',
    wrong: [
      [{ text: 'provider "aws" {', color: FG }],
      [{ text: '  access_key = "AKIAIOSFODNN7EXAMPLE"', color: RED }],
      [{ text: '  secret_key = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"', color: RED }],
      [{ text: '}', color: FG }],
    ],
    right: [
      [{ text: '# Provider sem credenciais — usa o chain padrão:', color: FGMUTE }],
      [{ text: 'provider "aws" {', color: FG }],
      [{ text: '  region = var.aws_region', color: GRN }],
      [{ text: '}', color: FG }],
      [{ text: '# Credenciais via: IAM Role (EC2/ECS), env vars,', color: FGMUTE }],
      [{ text: '# ~/.aws/credentials ou OIDC em CI', color: FGMUTE }],
    ],
    why: 'Credenciais no HCL vão para o git. Use o credential chain do AWS SDK: IAM Role para recursos EC2/ECS, OIDC (GitHub Actions) para CI, variáveis de ambiente para local. O provider AWS sem credentials usa o chain automaticamente.',
  },
  {
    title: 'State local em vez de backend remoto',
    wrong: [
      [{ text: '# Sem configuração de backend — state fica em:', color: FGMUTE }],
      [{ text: '# ./terraform.tfstate  (arquivo local)', color: RED }],
      [{ text: '' }],
      [{ text: '# Problemas:', color: FGMUTE }],
      [{ text: '#   - Não compartilha com o time', color: RED }],
      [{ text: '#   - Sem locking — dois applies simultâneos corrompem o state', color: RED }],
      [{ text: '#   - Perde ao deletar a máquina', color: RED }],
    ],
    right: [
      [{ text: 'terraform {', color: FG }],
      [{ text: '  backend "s3" {', color: FG }],
      [{ text: '    bucket         = "minha-empresa-tfstate"', color: GRN }],
      [{ text: '    key            = "prod/terraform.tfstate"', color: GRN }],
      [{ text: '    region         = "us-east-1"', color: GRN }],
      [{ text: '    dynamodb_table = "terraform-state-lock"', color: GRN }],
      [{ text: '    encrypt        = true', color: GRN }],
      [{ text: '  }', color: FG }],
      [{ text: '}', color: FG }],
    ],
    why: 'Backend S3 + DynamoDB é o padrão AWS para state remoto. O S3 guarda o state criptografado, o DynamoDB provê locking distribuído (evita applies simultâneos). Habilite versioning no bucket para rollback de state corrompido.',
  },
  {
    title: 'Sem pin de versão de provider',
    wrong: [
      [{ text: 'terraform {', color: FG }],
      [{ text: '  required_providers {', color: FG }],
      [{ text: '    aws = {', color: FG }],
      [{ text: '      source = "hashicorp/aws"', color: FG }],
      [{ text: '      # Sem version — pega a latest!', color: RED }],
      [{ text: '    }', color: FG }],
      [{ text: '  }', color: FG }],
      [{ text: '}', color: FG }],
    ],
    right: [
      [{ text: 'terraform {', color: FG }],
      [{ text: '  required_providers {', color: FG }],
      [{ text: '    aws = {', color: FG }],
      [{ text: '      source  = "hashicorp/aws"', color: GRN }],
      [{ text: '      version = "~> 5.0"  # >= 5.0, < 6.0', color: GRN }],
      [{ text: '    }', color: FG }],
      [{ text: '  }', color: FG }],
      [{ text: '}', color: FG }],
      [{ text: '# E commite .terraform.lock.hcl no git', color: GRN }],
    ],
    why: 'Sem pin, um breaking change no provider pode quebrar o plan sem qualquer mudança no seu código. Use "~> X.Y" para aceitar patches mas não major versions. O .terraform.lock.hcl trava o hash exato do binário — commite-o para builds reproduzíveis.',
  },
  {
    title: 'Ignorar terraform plan antes de apply',
    wrong: [
      [{ text: '# Pipeline de CD "rápido" — pula o plan:', color: FGMUTE }],
      [{ text: 'terraform apply -auto-approve', color: RED }],
      [{ text: '' }],
      [{ text: '# Riscos:', color: FGMUTE }],
      [{ text: '#   - Destruição de recursos não antecipada', color: RED }],
      [{ text: '#   - Sem revisão humana antes de mudar produção', color: RED }],
      [{ text: '#   - Sem artifact de plano para auditoria', color: RED }],
    ],
    right: [
      [{ text: '# CI/CD correto — plan separado do apply:', color: FGMUTE }],
      [{ text: '# Stage 1 — Plan:', color: GRN }],
      [{ text: 'terraform plan -out=plan.tfplan', color: GRN }],
      [{ text: '' }],
      [{ text: '# Stage 2 — Revisão humana (PR review)', color: GRN }],
      [{ text: '' }],
      [{ text: '# Stage 3 — Apply com o plano salvo:', color: GRN }],
      [{ text: 'terraform apply plan.tfplan', color: GRN }],
    ],
    why: 'O plan é a proteção mais importante do Terraform. Ele mostra exatamente o que vai mudar antes de mudar. Em pipelines de CD, salve o plano com -out e só aplique após aprovação. Nunca use -auto-approve em produção.',
  },
  {
    title: 'Workspace como substituto de ambientes',
    wrong: [
      [{ text: '# Usar workspaces para separar prod/staging:', color: FGMUTE }],
      [{ text: 'terraform workspace new staging', color: RED }],
      [{ text: 'terraform workspace new prod', color: RED }],
      [{ text: '' }],
      [{ text: '# Problemas: mesmo código, configuração misturada,', color: RED }],
      [{ text: '# blast radius enorme, sem isolamento real de state', color: RED }],
    ],
    right: [
      [{ text: '# Diretórios separados por ambiente:', color: FGMUTE }],
      [{ text: 'environments/', color: GRN }],
      [{ text: '  staging/   ← state isolado, config específica', color: GRN }],
      [{ text: '    main.tf  backend.tf  terraform.tfvars', color: GRN }],
      [{ text: '  prod/', color: GRN }],
      [{ text: '    main.tf  backend.tf  terraform.tfvars', color: GRN }],
      [{ text: '# Ou use Terraform Cloud com workspaces por ambiente', color: GRN }],
    ],
    why: 'Workspaces compartilham o mesmo código e backend — um bug no código afeta todos os ambientes. Diretórios separados têm state completamente isolado, configurações independentes e blast radius reduzido. Workspaces fazem sentido para testar recursos efêmeros, não para prod/staging.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — Terraform vs Pulumi vs CDK vs CloudFormation
// ComparisonTable: comparativo de ferramentas de IaC
// ═══════════════════════════════════════════════════════════════════════════════

const IaC_OPTIONS: ComparisonOption[] = [
  { id: 'tf',  label: 'Terraform',       sublabel: 'HashiCorp HCL', color: C },
  { id: 'pul', label: 'Pulumi',          sublabel: 'TS / Python / Go', color: '#8A2BE2' },
  { id: 'cdk', label: 'AWS CDK',         sublabel: 'TS / Python / Java', color: '#FF9900' },
  { id: 'cfn', label: 'CloudFormation',  sublabel: 'YAML / JSON', color: '#FF9900' },
]

const IaC_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'multicloud',
    label: 'Multi-cloud',
    category: 'Suporte',
    description: 'Provisionar recursos em múltiplos providers (AWS + GCP + Kubernetes + GitHub) no mesmo código',
    values: {
      tf:  { rating: 'excellent', note: '1.000+ providers nativos' },
      pul: { rating: 'excellent', note: 'Multi-cloud com SDKs' },
      cdk: { rating: 'poor',      note: 'Apenas AWS (CDK for TF expande)' },
      cfn: { rating: 'poor',      note: 'Apenas AWS' },
    },
  },
  {
    id: 'linguagem',
    label: 'Linguagem de programação',
    category: 'Experiência',
    description: 'Uso de loops, condicionais, abstrações e bibliotecas da linguagem host',
    values: {
      tf:  { rating: 'fair',      note: 'HCL declarativo — loops limitados (for_each, count)' },
      pul: { rating: 'excellent', note: 'TypeScript/Python real — loops, classes, npm/pip' },
      cdk: { rating: 'excellent', note: 'TypeScript/Python real — constructs reutilizáveis' },
      cfn: { rating: 'poor',      note: 'YAML puro — verbose, sem abstração real' },
    },
  },
  {
    id: 'state',
    label: 'Gestão de state',
    category: 'Operações',
    description: 'Como o estado atual da infraestrutura é rastreado e armazenado',
    values: {
      tf:  { rating: 'good',      note: 'tfstate explícito — backend S3/TFC, locking com DynamoDB' },
      pul: { rating: 'good',      note: 'State em backend Pulumi (SaaS) ou S3' },
      cdk: { rating: 'good',      note: 'Delegado ao CloudFormation (stacks)' },
      cfn: { rating: 'excellent', note: 'Gerenciado pela AWS — rollback automático em falha' },
    },
  },
  {
    id: 'ecossistema',
    label: 'Ecossistema e módulos',
    category: 'Suporte',
    description: 'Tamanho da comunidade, módulos disponíveis e suporte empresarial',
    values: {
      tf:  { rating: 'excellent', note: 'Registry com 10k+ módulos, maior comunidade' },
      pul: { rating: 'good',      note: 'Crescendo — suporte a módulos Terraform via bridge' },
      cdk: { rating: 'good',      note: 'Constructs Library da AWS, CDK Hub' },
      cfn: { rating: 'good',      note: 'Templates de referência da AWS, Service Catalog' },
    },
  },
  {
    id: 'drift',
    label: 'Detecção de drift',
    category: 'Operações',
    description: 'Detectar quando a infraestrutura divergiu do código (mudanças manuais no console)',
    values: {
      tf:  { rating: 'good',      note: 'terraform plan mostra drift; refresh explícito com -refresh-only' },
      pul: { rating: 'good',      note: 'pulumi refresh detecta drift' },
      cdk: { rating: 'fair',      note: 'Requer CloudFormation drift detection explícito' },
      cfn: { rating: 'good',      note: 'Drift detection nativo via console ou CLI' },
    },
  },
  {
    id: 'curva',
    label: 'Curva de aprendizado',
    category: 'Experiência',
    description: 'Tempo para atingir produtividade com a ferramenta',
    values: {
      tf:  { rating: 'good',      note: 'HCL simples de aprender; state e módulos levam mais tempo' },
      pul: { rating: 'good',      note: 'Fácil para devs que já conhecem TS/Python' },
      cdk: { rating: 'good',      note: 'Fácil para devs AWS com TypeScript' },
      cfn: { rating: 'fair',      note: 'YAML verbose e erro messages pobres' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — Lifecycle de recurso: create_before_destroy
// CodeStepper: entender o fluxo de substituição de recursos
// ═══════════════════════════════════════════════════════════════════════════════

const LIFECYCLE_SCENARIOS: CodeStepperScenario[] = [
  {
    id: 'default',
    label: 'Substituição padrão (destroy → create)',
    code: `# Mudança que força replace (ex: mudar o tipo de instância)
resource "aws_instance" "app" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.large"  # era t3.medium
}

# Sequência padrão:
# 1. Terraform destrói aws_instance.app (downtime!)
# 2. Terraform cria nova aws_instance.app
# 3. State atualizado`,
    steps: [
      {
        lineStart: 1,
        lineEnd: 5,
        title: 'Mudança que força replace',
        explanation: 'Mudar instance_type força a substituição da instância EC2 — não é possível mudar esse atributo in-place. Terraform detecta isso no plan e marca o recurso como "must be replaced".',
        output: '-/+ aws_instance.app must be replaced\n  ~ instance_type: "t3.medium" → "t3.large" (forces replacement)',
      },
      {
        lineStart: 8,
        lineEnd: 9,
        title: 'Destroy (downtime começa aqui)',
        explanation: 'Terraform destrói a instância antiga. Qualquer tráfego que dependia dela fica sem resposta durante o período entre o destroy e o create. Para instâncias atrás de ALB, o tempo de downtime é o deregistration delay + boot da nova instância.',
        output: 'aws_instance.app: Destroying... [id=i-0abc123]',
      },
      {
        lineStart: 9,
        lineEnd: 11,
        title: 'Create + atualização do state',
        explanation: 'Nova instância é criada com os novos atributos. O state é atualizado com o novo ID. O downtime encerra quando a nova instância está healthy e recebe tráfego — mas sem create_before_destroy, isso acontece depois do destroy.',
        output: 'aws_instance.app: Creation complete after 45s [id=i-0def456]\nApply complete! Resources: 1 added, 0 changed, 1 destroyed.',
      },
    ],
  },
  {
    id: 'create_before',
    label: 'create_before_destroy (zero downtime)',
    code: `resource "aws_instance" "app" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.large"

  lifecycle {
    create_before_destroy = true
  }
}

# Sequência com create_before_destroy:
# 1. Cria nova instância (nova entra no ALB)
# 2. Destrói instância antiga (tráfego já migrado)
# 3. Sem janela de downtime`,
    steps: [
      {
        lineStart: 5,
        lineEnd: 7,
        title: 'lifecycle.create_before_destroy = true',
        explanation: 'Com esse flag, Terraform inverte a ordem de substituição: cria o novo recurso ANTES de destruir o antigo. Essencial para recursos que servem tráfego ou têm dependências downstream.',
        output: 'Plan: 1 to add, 0 to change, 1 to destroy.\nNote: replace order — create first, then destroy.',
      },
      {
        lineStart: 10,
        lineEnd: 11,
        title: 'Create primeiro (zero downtime)',
        explanation: 'Nova instância é criada e, se estiver atrás de um ALB, é registrada e recebe tráfego enquanto a antiga ainda está rodando. Não há janela de downtime.',
        output: 'aws_instance.app: Creating...\naws_instance.app: Creation complete [id=i-0newid]',
      },
      {
        lineStart: 12,
        lineEnd: 14,
        title: 'Destroy depois (tráfego já migrado)',
        explanation: 'Apenas depois que o novo recurso está pronto, o antigo é destruído. O ALB já removeu a instância antiga do target group. Zero downtime para usuários.',
        output: 'aws_instance.app (deposed): Destroying... [id=i-0abc123]\nApply complete! Resources: 1 added, 0 changed, 1 destroyed.',
      },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// Componente principal
// ═══════════════════════════════════════════════════════════════════════════════

export default function TerraformVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'ciclo-de-vida',
      title: 'Ciclo init → apply',
      subtitle: 'O que acontece em cada fase — arquivos lidos, APIs chamadas, state atualizado',
      accent: C,
      component: (
        <HookTimeline
          phases={TF_PHASES}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'estado-do-recurso',
      title: 'Ciclo de vida do state',
      subtitle: 'Estados possíveis de um recurso no tfstate e como transitar entre eles',
      accent: GRN,
      component: (
        <StateMachineExplorer
          states={STATE_STATES}
          transitions={STATE_TRANSITIONS}
          initialState="nao-existe"
          accentColor={GRN}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'hierarquia-de-modulos',
      title: 'Hierarquia de módulos',
      subtitle: 'Root module → módulos filhos → registry público → providers: como as camadas se compõem',
      accent: C,
      component: (
        <LayerStack
          layers={MODULE_LAYERS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'antipatterns',
      title: 'Anti-patterns',
      subtitle: 'Os 5 erros mais comuns em projetos Terraform — e como evitá-los',
      accent: RED,
      component: (
        <AntiPatternsGallery
          patterns={TF_ANTIPATTERNS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'iac-comparativo',
      title: 'Terraform vs Pulumi vs CDK vs CloudFormation',
      subtitle: 'Comparativo de ferramentas de IaC por critérios objetivos — quando escolher cada uma',
      accent: C,
      component: (
        <ComparisonTable
          options={IaC_OPTIONS}
          criteria={IaC_CRITERIA}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'lifecycle-replace',
      title: 'create_before_destroy',
      subtitle: 'Como o Terraform substitui recursos e como evitar downtime com lifecycle blocks',
      accent: AMB,
      component: (
        <CodeStepper
          scenarios={LIFECYCLE_SCENARIOS}
          accentColor={AMB}
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
