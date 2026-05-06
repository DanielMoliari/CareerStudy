'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildQuickRefPdf } from '@/components/pdfs/QuickRefPdf'
import type { QuickRefColumn } from '@/components/pdfs/QuickRefPdf'
import { buildAntipatternsPdf } from '@/components/pdfs/AntipatternsPdf'
import type { AntiPatternItem } from '@/components/pdfs/AntipatternsPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'

// ── Paleta Terraform ──────────────────────────────────────────────────────────
const C = '#7B42BC'

// ── Cards de PDF ──────────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'quick-ref',
    title: 'Quick Reference',
    subtitle: 'Todos os comandos terraform + HCL num cartão A4',
    type: 'quick-ref',
    pages: 1,
    description: 'Cartão de bolso A4 landscape com 3 colunas: comandos CLI com flags essenciais, blocos HCL de referência (resource, variable, output, module, backend) e lifecycle/meta-arguments. O que você precisa ter na mesa ao escrever Terraform.',
    icon: '01',
    goal: 'Consulta rápida',
    featured: true,
  },
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas em entrevista',
    type: 'qa',
    pages: 8,
    description: 'Recuperação ativa: 20 perguntas nível pleno/sênior cobrindo state management, remote backend, módulos, lifecycle blocks, workspaces, drift, import, providers e boas práticas de CI/CD com Terraform. Respostas com profundidade de entrevista.',
    icon: '02',
    goal: 'Recuperação ativa',
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns',
    subtitle: 'O que não fazer — e o custo de cada erro',
    type: 'antipatterns',
    pages: 3,
    description: 'Os 6 anti-patterns mais destruidores em projetos Terraform: credenciais hardcoded, state local, sem pin de provider, -auto-approve em produção, workspaces como ambientes e módulos sem versão. Código errado × correto com explicação técnica.',
    icon: '03',
    goal: 'Reconhecimento de padrão',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'Truques para gravar os conceitos que mais confundem',
    type: 'mnemonics',
    pages: 2,
    description: 'IPAS para o fluxo init/plan/apply, LESS para lifecycle blocks, SBD para state commands e DLW para a regra de workspaces vs diretórios. Os conceitos de Terraform que ninguém consegue lembrar na entrevista.',
    icon: '04',
    goal: 'Memória de longo prazo',
  },
]

// ── Dados — Quick Reference ───────────────────────────────────────────────────

const QR_COLUMNS: QuickRefColumn[] = [
  {
    sections: [
      {
        title: 'Fluxo de trabalho',
        entries: [
          { key: 'terraform init', value: 'Baixa providers e configura backend' },
          { key: 'terraform plan', value: 'Calcula diff sem aplicar' },
          { key: 'terraform plan -out=p.tfplan', value: 'Salva plano para apply posterior' },
          { key: 'terraform apply', value: 'Aplica mudanças (pede confirmação)' },
          { key: 'terraform apply p.tfplan', value: 'Aplica plano salvo (sem prompt)' },
          { key: 'terraform apply -auto-approve', value: 'Sem confirmação — só em CI controlado', badge: '⚠ cuidado', badgeColor: '#f59e0b' },
          { key: 'terraform destroy', value: 'Destrói toda a infra gerenciada', badge: '⚠ destrutivo', badgeColor: '#ef4444' },
          { key: 'terraform validate', value: 'Valida sintaxe HCL sem conectar à cloud' },
          { key: 'terraform fmt -recursive', value: 'Formata todos os .tf recursivamente' },
        ],
      },
      {
        title: 'State',
        entries: [
          { key: 'terraform state list', value: 'Lista todos os recursos no state' },
          { key: 'terraform state show <addr>', value: 'Atributos de um recurso específico' },
          { key: 'terraform state mv <src> <dst>', value: 'Move recurso sem recriar na cloud' },
          { key: 'terraform state rm <addr>', value: 'Remove do state (não destrói na cloud)', badge: '⚠ cuidado', badgeColor: '#f59e0b' },
          { key: 'terraform import <addr> <id>', value: 'Importa recurso existente para o state' },
          { key: 'terraform refresh', value: 'Sincroniza state com a cloud (deprecated — use plan -refresh-only)' },
          { key: 'terraform plan -refresh-only', value: 'Detecta drift sem propor mudanças' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Bloco resource',
        entries: [
          { key: 'resource "aws_instance" "app" {}', value: 'Define recurso. Endereço: aws_instance.app' },
          { key: 'depends_on = [res.outro]', value: 'Dependência explícita (preferir implícita)' },
          { key: 'count = var.count', value: 'Cria N cópias. Endereço: res.app[0]' },
          { key: 'for_each = var.map', value: 'Cria por map/set. Endereço: res.app["key"]' },
          { key: 'lifecycle { prevent_destroy = true }', value: 'Falha se alguém tentar destruir', badge: '★ essencial', badgeColor: '#7B42BC' },
          { key: 'lifecycle { create_before_destroy = true }', value: 'Cria novo antes de destruir antigo' },
          { key: 'lifecycle { ignore_changes = [tags] }', value: 'Ignora mudanças em atributos específicos' },
        ],
      },
      {
        title: 'Variáveis e outputs',
        entries: [
          { key: 'variable "name" { type = string }', value: 'Declara input variable' },
          { key: 'var.name', value: 'Referencia a variável no código' },
          { key: 'output "ip" { value = res.app.public_ip }', value: 'Exporta valor após apply' },
          { key: 'terraform.tfvars', value: 'Arquivo com valores de variáveis (auto-loaded)' },
          { key: 'TF_VAR_nome=valor', value: 'Variável via env var — prioridade sobre .tfvars' },
          { key: 'locals { name = "..." }', value: 'Valor local calculado — reutilizável no módulo' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Módulos',
        entries: [
          { key: 'module "vpc" { source = "./modules/vpc" }', value: 'Chama módulo local' },
          { key: 'source = "terraform-aws-modules/vpc/aws"', value: 'Módulo do registry público' },
          { key: 'version = "~> 5.0"', value: 'Pin de versão — >= 5.0, < 6.0', badge: '★ obrigatório', badgeColor: '#7B42BC' },
          { key: 'module.vpc.vpc_id', value: 'Acessa output do módulo filho' },
          { key: 'terraform get', value: 'Baixa módulos sem fazer init completo' },
        ],
      },
      {
        title: 'Backend e providers',
        entries: [
          { key: 'backend "s3" { bucket = "..." }', value: 'State remoto em S3' },
          { key: 'dynamodb_table = "tf-lock"', value: 'Locking de state — evita apply simultâneo' },
          { key: 'encrypt = true', value: 'Criptografa state no S3 (ativar sempre)' },
          { key: 'required_providers { aws = { version = "~> 5.0" }}', value: 'Pin de provider' },
          { key: '.terraform.lock.hcl', value: 'Lock file — commitar no git', badge: '★ essencial', badgeColor: '#7B42BC' },
          { key: 'provider "aws" { alias = "us_east" }', value: 'Múltiplas instâncias do mesmo provider' },
        ],
      },
      {
        title: 'Workspaces',
        entries: [
          { key: 'terraform workspace list', value: 'Lista workspaces' },
          { key: 'terraform workspace new staging', value: 'Cria workspace' },
          { key: 'terraform workspace select prod', value: 'Troca de workspace' },
          { key: 'terraform.workspace', value: 'Variável com nome do workspace atual' },
        ],
      },
    ],
  },
]

// ── Dados — Q&A ───────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'O que é o terraform.tfstate e por que nunca deve ser editado manualmente?',
    a: 'O tfstate é o mapa entre os recursos declarados no HCL e os recursos reais na cloud. Para cada resource, armazena o ID do recurso real (i-0abc123), todos os atributos e metadados de dependências. Editar manualmente pode corromper o state — referências inconsistentes causam apply destrutivo. Para manipular o state, use os comandos oficiais: terraform state mv, terraform state rm, terraform import.',
    tip: 'Explique a trindade: código HCL (desejado) × state (rastreado) × cloud real. O plan é o diff entre os três.',
  },
  {
    level: 'Pleno',
    q: 'Por que usar backend remoto (S3 + DynamoDB) em vez de state local?',
    a: 'State local cria três problemas críticos em time: (1) não é compartilhado — cada dev tem um state diferente, levando a applies conflitantes; (2) sem locking — dois applies simultâneos corrompem o state; (3) risco de perda — deletar a máquina perde o rastreamento de toda a infra. Backend S3 centraliza o state, DynamoDB provê locking distribuído (terraform usa put-item/delete-item para lock/unlock) e o S3 com versioning permite rollback de state corrompido.',
    tip: 'Mencione o locking como diferencial do DynamoDB — não é só armazenamento, é consistência de operações concorrentes.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre count e for_each na criação de múltiplos recursos?',
    a: 'count = N cria N cópias indexadas por número (aws_instance.app[0], [1], [2]). Remover o elemento do meio reindexia tudo e pode causar destroy/recreate desnecessário. for_each = map/set cria recursos indexados por string (aws_instance.app["web"], ["api"]). Remover uma chave destrói apenas aquele recurso sem afetar os outros. Use for_each sempre que tiver identificadores únicos — é mais estável. Use count apenas quando a ordem numérica é semanticamente relevante.',
    tip: 'O bug clássico de count: remover o elemento [1] de [0, 1, 2] força o [2] a virar [1] — Terraform destrói [1] e atualiza [2]. Com for_each isso não acontece.',
  },
  {
    level: 'Pleno',
    q: 'O que é drift no contexto do Terraform e como detectar?',
    a: 'Drift é quando o estado real da infraestrutura diverge do que está no tfstate — causado por mudanças manuais no console AWS, via CLI, ou por outro time. Para detectar drift sem propor mudanças: terraform plan -refresh-only. Isso compara o state com a cloud real e mostra diferenças sem calcular o diff contra o HCL. Se você ignorar drift e rodar apply, Terraform vai revertê-lo. Para aceitar o drift (ex: tags adicionadas manualmente), use lifecycle { ignore_changes = [tags] }.',
    tip: 'A distinção entre -refresh-only e plan normal demonstra entendimento do ciclo de vida — muitos não conhecem o refresh-only.',
  },
  {
    level: 'Pleno',
    q: 'Como o terraform import funciona e quais suas limitações?',
    a: 'terraform import address id traz um recurso existente na cloud para o state do Terraform. Exemplo: terraform import aws_instance.web i-0abc123456. Após o import, o recurso está no state mas o código HCL ainda não existe — você precisa escrever o resource block manualmente com os atributos corretos. Limitações: (1) não gera HCL automaticamente (Terraform 1.5+ tem import block que gera código, mas é experimental); (2) nem todos os atributos são importáveis; (3) recursos com atributos sensíveis (senhas) podem não ser importados. Use terraform plan após import para verificar se há diff.',
    tip: 'Mencione o novo import block do Terraform 1.5 — importa e gera o código HCL. Demonstra que você acompanha a evolução da ferramenta.',
  },
  {
    level: 'Senior',
    q: 'Como você estruturaria um repositório Terraform para múltiplos ambientes e equipes?',
    a: 'Estrutura recomendada: monorepo com environments/ (prod/, staging/, dev/) e modules/ (vpc/, ecs-service/, rds/). Cada environment/ tem main.tf (chama módulos), backend.tf (state isolado), e terraform.tfvars (valores específicos). Módulos são versioned via git tags (source = "../../../modules/vpc?ref=v2.1.0"). Backends completamente separados — um bucket S3 por ambiente com prefixo no key. Para times grandes, considere Terraform Cloud com workspaces por ambiente e RBAC. O blast radius de um apply de staging é zero para produção.',
    tip: 'Resposta que diferencia: explique o motivo de não usar workspaces (state compartilhado, blast radius). Diretórios separados têm state completamente isolado.',
  },
  {
    level: 'Senior',
    q: 'Como implementar um pipeline de CD seguro com Terraform?',
    a: 'Pipeline de 3 estágios: (1) Plan — terraform init + plan -out=plan.tfplan, publica o plan como artifact para revisão humana, comentário no PR com o diff; (2) Aprovação — revisão do plan por engenheiro sênior ou automatizada com OPA/Sentinel para políticas (ex: nenhum security group com 0.0.0.0/0); (3) Apply — terraform apply plan.tfplan usando o artifact salvo (garante que o que foi aprovado é o que é aplicado). Credenciais via OIDC (sem secrets de longo prazo). Locking de state garante que apenas um apply roda por vez. Use -lock-timeout=5m para CI.',
    tip: 'OIDC para CI e a separação plan/approve/apply como artifact são os diferenciadores de sênior — evitam secrets de longa duração e garantem auditabilidade.',
  },
  {
    level: 'Senior',
    q: 'O que são lifecycle meta-arguments e quando usar cada um?',
    a: 'Quatro lifecycle blocks: (1) prevent_destroy = true — falha o apply se o recurso for marcado para destruição. Use em RDS, S3 com dados críticos. (2) create_before_destroy = true — inverte a ordem de substituição para zero downtime. Use em instâncias EC2, security groups, certificados. (3) ignore_changes = [attr] — ignora mudanças em atributos específicos no plan. Use quando outro sistema gerencia o atributo (ex: autoscaling gerencia desired_capacity). (4) replace_triggered_by = [res.outro] — força replace do recurso quando outro recurso muda. Use quando mudança de config externa deve forçar substituição.',
    tip: 'O caso de uso do ignore_changes é menos óbvio: quando o atributo é gerenciado por outra ferramenta (autoscaling, secrets manager), ignorar evita conflito com Terraform.',
  },
  {
    level: 'Senior',
    q: 'Como lidar com recursos que precisam de dados sensíveis (senhas, chaves) no Terraform?',
    a: 'Três abordagens por nível de segurança: (1) AWS Secrets Manager / Parameter Store — crie o secret fora do Terraform, referencie via data source: data.aws_secretsmanager_secret_version. O valor nunca fica no HCL ou state. (2) terraform-provider-vault — Vault injeta valores em tempo de apply via provider, nunca armazenados. (3) Se precisar passar no HCL, use variável sensível: variable "db_password" { sensitive = true }. Terraform oculta o valor nos logs mas ainda armazena no state — criptografe o state. O state com dados sensíveis deve ter bucket S3 com KMS encryption e acesso IAM restrito.',
    tip: 'A resposta sênior menciona que mesmo com sensitive = true o valor vai para o state. A solução correta é sempre criar o secret fora do Terraform e referenciar via data source.',
  },
  {
    level: 'Senior',
    q: 'O que é state locking e como o Terraform implementa com DynamoDB?',
    a: 'State locking garante que apenas uma operação de write (apply, state mv) ocorra por vez no mesmo state. Sem locking, dois applies simultâneos (CI paralelo) leem o state ao mesmo tempo, fazem mudanças conflitantes e um sobrescreve o outro — podendo deixar recursos órfãos ou corromper o state. Com DynamoDB: Terraform faz PutItem com LockID = "bucket/key.tfstate-md5" antes de qualquer write. Se o item já existe (outro process tem o lock), Terraform falha com lock error. Após o apply, DeleteItem libera o lock. Em CI, use -lock-timeout=5m para aguardar o lock ser liberado.',
    tip: 'O mecanismo PutItem/DeleteItem do DynamoDB é uma operação atômica — conditional write garante que apenas um processo adquire o lock. Isso é o coração da consistência distribuída do Terraform.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre variáveis de input, locals e outputs em Terraform?',
    a: 'Variables (variable) são inputs do módulo — definem a interface pública. Quem chama o módulo passa os valores. São obrigatórias (sem default) ou opcionais (com default). Podem ter validation blocks. Locals (locals) são valores calculados dentro do módulo — não são inputs nem outputs. Evitam repetição e centralizam lógica. Não são passados de fora. Outputs (output) exportam valores do módulo para quem o chamou (ou para o operador após apply). Outros módulos podem referenciar outputs: module.vpc.vpc_id. A hierarquia: variables são a boca do módulo, locals são a lógica interna, outputs são a saída.',
    tip: 'A analogia com função: variables = parâmetros, locals = variáveis locais, outputs = return value. Simples mas eficaz em entrevistas.',
  },
  {
    level: 'Pleno',
    q: 'O que é o .terraform.lock.hcl e por que commitar no git?',
    a: 'O lock file registra os hashes criptográficos (SHA256) de todos os binários de provider baixados — não apenas a versão, mas o binário exato. Isso garante que toda máquina (local dev, CI, novo membro do time) baixe exatamente o mesmo provider, impedindo que um provider atualizado silenciosamente introduza bugs. Commitar no git permite que o terraform init reproduza exatamente o mesmo ambiente. Se você não commitar, cada init pode baixar uma versão diferente — violando a reprodutibilidade. Para atualizar providers: terraform init -upgrade.',
    tip: 'O diferencial: não é só a versão, é o hash do binário. Isso é mais forte que semantic versioning — garante que nenhuma mudança silenciosa passe.',
  },
  {
    level: 'Senior',
    q: 'Como usar data sources para referenciar recursos não gerenciados pelo Terraform?',
    a: 'Data sources leem atributos de recursos existentes sem gerenciá-los. Exemplos: (1) data.aws_ami.latest — busca a AMI mais recente por filtro; (2) data.aws_vpc.default — pega a VPC padrão por ID ou tag; (3) data.aws_secretsmanager_secret_version — lê um secret existente. A diferença de resource: data não cria nem modifica nada — é somente leitura. Use data sources para integrar com infra gerenciada por outros times ou criada manualmente. Referência: data.aws_ami.latest.id.',
    tip: 'O caso de uso mais poderoso: data "aws_ami" com filtros — sempre usa a AMI mais recente sem hardcode. Demonstra uso real em vez de IDs hardcoded.',
  },
  {
    level: 'Senior',
    q: 'Como você testaria código Terraform antes de aplicar em produção?',
    a: 'Camadas de teste: (1) terraform validate — verifica sintaxe e configuração sem conectar à cloud; (2) terraform plan em ambiente de staging — verifica que o diff é o esperado; (3) Terratest (Go) — cria infra real em conta de teste, valida atributos via assertions, destroi ao final. É o teste de integração real; (4) tflint — linting de boas práticas e verificação de tipos de variáveis; (5) Checkov ou tfsec — análise estática de segurança (security groups abertos, buckets públicos, sem encryption). Em CI: validate + tflint + checkov na fase de PR, Terratest em staging antes de apply em prod.',
    tip: 'Mencionar Terratest por nome demonstra conhecimento avançado. Mas explique que é custo alto — use para módulos críticos e reutilizáveis, não para cada ambiente.',
  },
  {
    level: 'Senior',
    q: 'Qual a diferença entre workspaces e diretórios separados para gerenciar ambientes?',
    a: 'Workspaces compartilham o mesmo código e o mesmo backend — só o state key muda. Problema: blast radius total. Um erro no código afeta todos os workspaces. Não há separação real de configuração (uma tfvars por workspace é possível mas frágil). Diretórios separados (environments/prod/, environments/staging/) têm state completamente isolado, configurações independentes, podem usar versões diferentes dos módulos e têm blast radius zero entre ambientes. A recomendação oficial HashiCorp é diretórios separados para ambientes permanentes (prod/staging). Workspaces fazem sentido para recursos efêmeros (feature branches, ambientes de teste descartáveis).',
    tip: 'Cite a recomendação oficial da HashiCorp — ela mudou ao longo dos anos, e muitos seguem documentação antiga que recomendava workspaces para ambientes.',
  },
  {
    level: 'Pleno',
    q: 'Como o Terraform resolve dependências entre recursos?',
    a: 'Terraform constrói um grafo de dependências automaticamente: se o recurso A referencia um atributo de B (aws_subnet.main.id), ele sabe que B deve ser criado antes de A — dependência implícita. Para dependências que não envolvem referência de atributo, use depends_on = [resource.outro] — dependência explícita. O grafo é Directed Acyclic Graph (DAG). Terraform paralelize recursos sem dependência entre si, acelerando applies grandes. Para ver o grafo: terraform graph | dot -Tsvg > graph.svg.',
    tip: 'A resposta que diferencia sênior: preferir dependências implícitas (via referência de atributo) sobre depends_on. Dependências explícitas tornam o código mais frágil e menos paralelizável.',
  },
  {
    level: 'Senior',
    q: 'Como implementar Terraform em times grandes com múltiplos squads?',
    a: 'Quatro pilares: (1) Módulos versionados — biblioteca interna de módulos com git tags. Squads consomem módulos como dependências versionadas, não copy-paste. Mudanças passam por revisão e versionamento semântico. (2) State isolado por squad — nenhum squad acessa o state de outro. Modules como interfaces. (3) RBAC via Terraform Cloud ou IAM Roles — squads têm permissão só no seu state/ambiente. (4) Pipelines padronizados — template de CI com validate + plan + aprovação + apply. Todos usam o mesmo pipeline, squads customizam apenas as variáveis. O risco maior em times grandes é drift causado por mudanças manuais — CI que roda plan periódico (scheduled) detecta drift antes de virar incidente.',
    tip: 'Módulos como biblioteca interna versionada é o que diferencia times maduros de iniciantes. A analogia com npm packages resoa em entrevistas de tech lead.',
  },
  {
    level: 'Pleno',
    q: 'O que acontece quando você remove um resource block do HCL sem rodar destroy?',
    a: 'No próximo terraform plan, Terraform detecta que o recurso está no state mas não no HCL — e planeja destruí-lo. A remoção do código equivale a marcar o recurso para destruição. Para remover um recurso do gerenciamento do Terraform sem destruí-lo na cloud, use terraform state rm resource.nome — isso remove a entry do state sem afetar o recurso real. Após isso, você pode remover o block do HCL com segurança. O recurso continuará existindo na cloud, apenas não será mais gerenciado pelo Terraform.',
    tip: 'O comando terraform state rm é a saída elegante para "quero que o Terraform esqueça esse recurso sem deletar". Muito útil ao migrar recursos entre módulos ou state files.',
  },
  {
    level: 'Senior',
    q: 'Como usar o Terraform para gerenciar múltiplos providers (multi-region, multi-account)?',
    a: 'Para múltiplas regiões: provider "aws" com alias. provider "aws" { alias = "us_east_1"; region = "us-east-1" }. No resource, use provider = aws.us_east_1. Para múltiplas contas: provider "aws" com assume_role. provider "aws" { assume_role { role_arn = "arn:aws:iam::123456:role/Terraform" } }. Combine os dois para infra cross-region e cross-account. Em módulos, passe o provider como parâmetro: providers = { aws = aws.us_east_1 }. Nunca hardcode region no provider do módulo — deixe o chamador passar via providers map para reutilização.',
    tip: 'O providers map em módulos é avançado e pouco documentado — demonstra que você realmente escreveu módulos reutilizáveis multi-região.',
  },
  {
    level: 'Senior',
    q: 'O que é Terraform CDK (CDKTF) e quando escolher sobre HCL nativo?',
    a: 'CDKTF (CDK for Terraform) permite escrever Terraform em TypeScript, Python, Java ou C# — gerando HCL internamente. Vantagens: loops nativos da linguagem (sem for_each limitado), testes unitários com Jest/pytest, abstrações orientadas a objeto, NPM/pip para distribuir módulos. Desvantagens: camada de abstração adicional (debug mais complexo), HCL gerado pode ser verboso, comunidade menor, tooling menos maduro. Quando usar: times com forte cultura TypeScript/Python que precisam de lógica complexa (que HCL torna ilegível). Quando usar HCL: qualquer outro caso — é mais simples, mais debugável e tem mais recursos online.',
    tip: 'A resposta honesta: CDKTF é poderoso mas adiciona complexidade. HCL ainda é a escolha padrão. Use CDKTF quando a lógica de negócio na infra justifica uma linguagem de programação real.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona o terraform fmt e por que automatizar?',
    a: 'terraform fmt formata automaticamente arquivos .tf seguindo o estilo canônico do HCL: indentação de 2 espaços, alinhamento de = em blocos, ordenação de argumentos. É idempotente — formatar um arquivo já formatado não muda nada. Use -recursive para formatar todos os arquivos do diretório. Em CI, adicione terraform fmt -check (falha se algum arquivo não está formatado) como gate de PR — isso evita debates de style review e mantém o código consistente. Pre-commit hook: terraform fmt -recursive antes de cada commit.',
    tip: 'Mencionar o -check em CI como gate de PR demonstra maturidade de processo — não é apenas uma dica de estilo, é uma barreira de qualidade automatizada.',
  },
]

// ── Dados — Anti-patterns ─────────────────────────────────────────────────────

const ANTIPATTERNS: AntiPatternItem[] = [
  {
    title: 'Credenciais hardcoded no provider',
    badDesc: 'Chave de acesso AWS diretamente no código — vai para o git e é um vetor de comprometimento.',
    badCode: [
      { t: 'provider "aws" {' },
      { t: '\n  access_key = "', c: '#ef4444' }, { t: 'AKIAIOSFODNN7EXAMPLE', c: '#ef4444' }, { t: '"' },
      { t: '\n  secret_key = "', c: '#ef4444' }, { t: 'wJalrXUtnFEMI/K7MDENG...', c: '#ef4444' }, { t: '"' },
      { t: '\n}' },
    ],
    goodDesc: 'Provider sem credenciais explícitas — usa o credential chain do AWS SDK (IAM Role, env vars, ~/.aws/credentials).',
    goodCode: [
      { t: 'provider "aws" {' },
      { t: '\n  region = ', c: '#4ade80' }, { t: 'var.aws_region', c: '#4ade80' },
      { t: '\n  # Credenciais: IAM Role, env vars ou ~/.aws', c: '#475569' },
      { t: '\n}' },
    ],
    why: 'Credenciais hardcoded vão para o git e podem ser expostas. Use o credential chain: IAM Role para EC2/ECS/Lambda, OIDC para GitHub Actions CI, variáveis de ambiente para desenvolvimento local.',
  },
  {
    title: 'State local sem backend remoto',
    badDesc: 'Sem configuração de backend — state fica em arquivo local, sem compartilhamento nem locking.',
    badCode: [
      { t: '# Sem bloco terraform { backend ... }' },
      { t: '\n# State armazenado em: ./terraform.tfstate', c: '#ef4444' },
      { t: '\n# Problemas: sem locking, sem compartilhamento,', c: '#ef4444' },
      { t: '\n# dois applies simultâneos corrompem o state', c: '#ef4444' },
    ],
    goodDesc: 'Backend S3 + DynamoDB: state remoto compartilhado com locking distribuído.',
    goodCode: [
      { t: 'terraform {' },
      { t: '\n  backend "s3" {', c: '#4ade80' },
      { t: '\n    bucket         = "empresa-tfstate"', c: '#4ade80' },
      { t: '\n    key            = "prod/terraform.tfstate"', c: '#4ade80' },
      { t: '\n    dynamodb_table = "terraform-lock"', c: '#4ade80' },
      { t: '\n    encrypt        = true', c: '#4ade80' },
      { t: '\n  }' }, { t: '\n}' },
    ],
    why: 'Backend S3 centraliza o state para todo o time. DynamoDB provê locking atômico — impede dois applies simultâneos de corromper o state. Versioning no bucket permite rollback.',
  },
  {
    title: 'Provider sem versão travada',
    badDesc: 'Sem version no required_providers — baixa a versão mais recente, que pode ter breaking changes.',
    badCode: [
      { t: 'terraform {' },
      { t: '\n  required_providers {' },
      { t: '\n    aws = { source = "hashicorp/aws" }', c: '#ef4444' },
      { t: '\n    # Sem version — pega latest!', c: '#ef4444' },
      { t: '\n  }' }, { t: '\n}' },
    ],
    goodDesc: 'Versão travada com ~> para receber patches mas não major versions. Lock file commitado.',
    goodCode: [
      { t: 'terraform {' },
      { t: '\n  required_providers {' },
      { t: '\n    aws = {', c: '#4ade80' },
      { t: '\n      source  = "hashicorp/aws"', c: '#4ade80' },
      { t: '\n      version = "~> 5.0"', c: '#4ade80' },
      { t: '\n    }' }, { t: '\n  }' }, { t: '\n}' },
      { t: '\n# E commite .terraform.lock.hcl no git', c: '#4ade80' },
    ],
    why: 'Sem pin, um breaking change no provider pode quebrar o plan sem mudança no seu código. ~> 5.0 aceita 5.x mas rejeita 6.0. O lock file trava o hash do binário — mais forte que semantic versioning.',
  },
  {
    title: 'Usar count para recursos com identidade',
    badDesc: 'count = length(var.subnets) para criar subnets — indexação por número causa destroys desnecessários.',
    badCode: [
      { t: 'resource "aws_subnet" "app" {' },
      { t: '\n  count  = ', c: '#ef4444' }, { t: 'length(var.subnets)', c: '#ef4444' },
      { t: '\n  cidr_block = var.subnets[count.index]', c: '#ef4444' },
      { t: '\n}' },
      { t: '\n# Remover subnets[1] de [0,1,2] força destroy+recreate', c: '#ef4444' },
      { t: '\n# de [1] e update de [2] (era [2], vira [1])', c: '#ef4444' },
    ],
    goodDesc: 'for_each com map de string — cada subnet tem identidade estável, remoção não afeta as outras.',
    goodCode: [
      { t: 'resource "aws_subnet" "app" {' },
      { t: '\n  for_each   = ', c: '#4ade80' }, { t: 'var.subnets', c: '#4ade80' },
      { t: '\n  cidr_block = each.value', c: '#4ade80' },
      { t: '\n}' },
      { t: '\n# var.subnets = { "us-east-1a" = "10.0.1.0/24", ... }', c: '#475569' },
      { t: '\n# Remover "us-east-1b" destrói só ela — outros intactos', c: '#4ade80' },
    ],
    why: 'count indexa por número — reordenação ou remoção do meio causa reindexação e destroys desnecessários. for_each indexa por string (identidade estável) — remover uma chave destrói apenas aquele recurso.',
  },
  {
    title: '-auto-approve sem plan salvo em CI',
    badDesc: 'apply com -auto-approve diretamente — sem revisão do plan, sem rastreabilidade.',
    badCode: [
      { t: '# Pipeline de CI "rápido":' },
      { t: '\nterraform apply -auto-approve', c: '#ef4444' },
      { t: '\n# Sem plano salvo — o que foi revisado pode não ser', c: '#ef4444' },
      { t: '\n# o que é aplicado se a infra mudou entre plan e apply', c: '#ef4444' },
    ],
    goodDesc: 'Plan separado com -out, aprovação humana, apply com o arquivo de plano salvo.',
    goodCode: [
      { t: '# Stage 1 — Plan com artifact:' },
      { t: '\nterraform plan -out=plan.tfplan', c: '#4ade80' },
      { t: '\n# Stage 2 — Revisão humana do plan (PR / Atlantis)', c: '#475569' },
      { t: '\n# Stage 3 — Apply com o plano exato que foi revisado:', c: '#475569' },
      { t: '\nterraform apply plan.tfplan', c: '#4ade80' },
    ],
    why: 'O plano salvo garante que o que foi revisado é o que é aplicado — mesmo se a infra mudou entre plan e apply. Sem ele, um apply pode destruir recursos não antecipados. Em produção, nunca use -auto-approve.',
  },
  {
    title: 'Workspaces como substituto de ambientes',
    badDesc: 'terraform workspace new prod/staging — mesmo código, blast radius total entre ambientes.',
    badCode: [
      { t: 'terraform workspace new staging', c: '#ef4444' },
      { t: '\nterraform workspace new prod', c: '#ef4444' },
      { t: '\n# Problemas: mesmo state backend, mesmo código,', c: '#ef4444' },
      { t: '\n# bug no código afeta todos os workspaces,', c: '#ef4444' },
      { t: '\n# sem isolamento real de configuração', c: '#ef4444' },
    ],
    goodDesc: 'Diretórios separados por ambiente — state completamente isolado, blast radius zero.',
    goodCode: [
      { t: 'environments/', c: '#4ade80' },
      { t: '\n  staging/', c: '#4ade80' }, { t: '  # state key: staging/terraform.tfstate', c: '#475569' },
      { t: '\n    main.tf  terraform.tfvars  backend.tf', c: '#4ade80' },
      { t: '\n  prod/', c: '#4ade80' }, { t: '    # state key: prod/terraform.tfstate', c: '#475569' },
      { t: '\n    main.tf  terraform.tfvars  backend.tf', c: '#4ade80' },
      { t: '\n# Blast radius de staging = zero para prod', c: '#4ade80' },
    ],
    why: 'Workspaces compartilham o mesmo backend e código — um bug afeta todos os ambientes. Diretórios separados têm state completamente isolado, configurações independentes e podem usar versões de módulo diferentes.',
  },
]

// ── Dados — Mnemônicos ────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'IPAS — o fluxo de trabalho do Terraform',
    trick: 'Init → Plan → Apply → State',
    expansion: [
      ['I', 'Init — baixa providers e configura backend'],
      ['P', 'Plan — calcula diff sem aplicar nada'],
      ['A', 'Apply — chama APIs da cloud e aplica'],
      ['S', 'State — state atualizado ao final do apply'],
    ],
    explanation: 'Nunca pule o Plan — ele é a proteção mais importante do Terraform. Em CI, salve o plano com -out e só aplique após aprovação.',
    example: 'terraform init && terraform plan -out=p.tfplan && terraform apply p.tfplan',
    why: 'O ciclo IPAS garante rastreabilidade e segurança: cada fase tem responsabilidade clara e pode ser auditada separadamente.',
  },
  {
    label: 'LESS — os quatro lifecycle blocks',
    trick: 'Lock it → Exchange first → Skip changes → Swap trigger',
    expansion: [
      ['L', 'Lock — prevent_destroy = true (falha se tentar destruir)'],
      ['E', 'Exchange first — create_before_destroy (zero downtime)'],
      ['S', 'Skip — ignore_changes = [attr] (ignora o atributo)'],
      ['S', 'Swap — replace_triggered_by (substitui com outro recurso)'],
    ],
    explanation: 'Os quatro lifecycle blocks cobrem os casos mais comuns de controle fino de substituição e proteção de recursos críticos.',
    example: 'lifecycle { prevent_destroy = true\ncreate_before_destroy = true }',
    why: 'Lifecycle blocks evitam os dois cenários mais destrutivos: destruição acidental e downtime durante substituição de recursos.',
  },
  {
    label: 'SBM — comandos de manipulação de state',
    trick: 'Show → Block → Move',
    expansion: [
      ['S', 'Show — terraform state show addr (vê atributos)'],
      ['B', 'Block — terraform state rm addr (remove do rastreamento)'],
      ['M', 'Move — terraform state mv src dst (move sem recriar)'],
    ],
    explanation: 'Nunca edite o tfstate manualmente. Use esses três comandos para qualquer manipulação. Mais: terraform import addr id para trazer recurso existente.',
    example: 'terraform state mv aws_instance.old aws_instance.new',
    why: 'Manipular o state pelos comandos oficiais garante integridade das referências e evita corrupção que causa apply destrutivo.',
  },
  {
    label: 'DIR > WS — ambientes em diretórios, não workspaces',
    trick: 'Diretórios Isolam Realmente, Workspaces Só são Siglas',
    expansion: [
      ['D', 'Diretórios — state completamente isolado por ambiente'],
      ['I', 'Isolamento — blast radius zero entre prod e staging'],
      ['R', 'Realmente — configurações independentes por ambiente'],
      ['WS', 'Workspaces — mesmo código, mesmo backend, blast radius total'],
    ],
    explanation: 'Workspaces compartilham o mesmo backend e código — um bug afeta todos. Diretórios separados (environments/prod/, environments/staging/) têm state e config completamente isolados.',
    example: 'environments/prod/main.tf  # state: prod/terraform.tfstate\nenvironments/staging/main.tf  # state: staging/terraform.tfstate',
    why: 'Isolamento real de ambientes evita o cenário mais temido em IaC: um apply de staging destruir recursos de produção.',
  },
]

// ── Componente principal ──────────────────────────────────────────────────────

export default function TerraformPdfs() {
  const [open, setOpen] = useState<PdfCard | null>(null)

  const hero = PDF_CARDS[0]
  const rest = PDF_CARDS.slice(1)

  const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
    'quick-ref': () => buildQuickRefPdf({
      columns: QR_COLUMNS,
      skillName: 'Terraform',
      accentColor: C,
      stackLabel: 'IaC / Cloud',
      tagline: 'IaC declarativo multi-cloud — init → plan → apply',
      version: '1.x',
    }),
    qa: () => buildQAReviewPdf({
      qa: QAS,
      accentColor: C,
      skillName: 'Terraform',
      stackLabel: 'IaC / Cloud',
    }),
    antipatterns: () => buildAntipatternsPdf({
      antipatterns: ANTIPATTERNS,
      accentColor: C,
      skillName: 'Terraform',
      stackLabel: 'IaC / Cloud',
    }),
    mnemonics: () => buildMnemonicsPdf({
      mnemonics: MNEMONICS,
      accentColor: C,
      skillName: 'Terraform',
      stackLabel: 'IaC / Cloud',
    }),
  }

  return (
    <>
      <HeroCard card={hero} accent={C} onOpen={() => setOpen(hero)} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 16 }}>
        {rest.map(c => (
          <CollectionCard key={c.id} card={c} accent={C} onOpen={() => setOpen(c)} />
        ))}
      </div>
      {open && (
        <PdfModal card={open} onClose={() => setOpen(null)} builders={PDF_BUILDERS} />
      )}
    </>
  )
}
