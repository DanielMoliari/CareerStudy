'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildCheatsheetPdf } from '@/components/pdfs/CheatsheetPdf'
import type { HookItem, RuleItem } from '@/components/pdfs/CheatsheetPdf'
import { buildAntipatternsPdf } from '@/components/pdfs/AntipatternsPdf'
import type { AntiPatternItem } from '@/components/pdfs/AntipatternsPdf'
import { buildQuickRefPdf } from '@/components/pdfs/QuickRefPdf'
import type { QuickRefColumn } from '@/components/pdfs/QuickRefPdf'

// ── Paleta GitHub Actions ─────────────────────────────────────────────────────
const C = '#2088FF'

// ── Metadados dos PDFs ────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas em entrevista',
    type: 'qa',
    pages: 9,
    description: 'Recuperação ativa: 20 perguntas de GitHub Actions — eventos, jobs, OIDC, reusable workflows, monorepo, segurança, pull_request_target, cache, environments. Nível pleno e sênior, com dica de apresentação para cada resposta.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet',
    subtitle: 'Sintaxe completa de workflow YAML em uma página',
    type: 'cheatsheet',
    pages: 3,
    description: 'Referência densa: triggers (on:), jobs (runs-on, needs, strategy, environment), steps (uses, run, with, id), contextos (github, secrets, vars, needs, steps), permissions, concurrency e expressions. Tudo que você consulta na docs.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'quick-ref',
    title: 'Quick Ref',
    subtitle: 'Cartão ultra-compacto de YAML do workflow',
    type: 'quick-ref',
    pages: 1,
    description: 'A4 landscape com triggers, jobs, steps, actions oficiais e expressões em 3 colunas. Para imprimir e deixar na mesa enquanto escreve workflows.',
    icon: '03',
    goal: 'Referência de bolso',
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns',
    subtitle: 'Os 8 erros mais perigosos — segurança e operação',
    type: 'antipatterns',
    pages: 4,
    description: 'O que NÃO fazer: action sem pin SHA, pull_request_target com checkout do fork, GITHUB_TOKEN com permissões excessivas, secret em ENV/log, sem timeout-minutes, COPY do código no Docker antes de deps, runner self-hosted exposto a forks, sem concurrency.',
    icon: '04',
    goal: 'Reconhecimento de risco',
  },
]

// ── Dados: Q&A ────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'Qual a estrutura básica de um workflow do GitHub Actions?',
    a: 'Um arquivo YAML em .github/workflows/. Estrutura: name, on (triggers), permissions, jobs. Cada job tem runs-on (runner), needs (dependências), strategy (matrix), steps (sequenciais). Cada step é uses (action) ou run (shell).',
    tip: 'Citar a hierarquia Evento → Workflow → Jobs (paralelos) → Steps (sequenciais) → Runner mostra que você pensa estruturalmente.',
  },
  {
    level: 'Pleno',
    q: 'Como passar dados entre steps e entre jobs?',
    a: 'Entre steps do mesmo job: $GITHUB_OUTPUT + step com id (echo "key=val" >> $GITHUB_OUTPUT, depois ${{ steps.id.outputs.key }}). Entre jobs: declarar outputs: no job produtor + needs.JOB.outputs.NAME no consumidor. Entre runs: artifacts (upload-artifact + download-artifact).',
    tip: 'O step precisa de id: para ser referenciado. Sem id: outputs não acessíveis.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona o cache de actions/cache?',
    a: 'Par (key, path). No início do job, restaura cache se key bate exato; senão tenta restore-keys (busca por prefixo). No final do job, salva o path como cache se não houve hit exato. Limites: 10 GB por repo, TTL 7 dias sem uso, scoped por branch.',
    tip: 'Mencionar que setup-node@v4 tem cache integrado (cache: npm) é mais simples que actions/cache manual.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre needs: e if:?',
    a: 'needs: cria dependência ESTRUTURAL — job só roda se os jobs em needs terminaram (success por padrão). if: é condicional FILTRO — job pode rodar (needs satisfeito) mas a expressão decide se realmente executa. needs: aceita lista de jobs; if: aceita expressão booleana.',
    tip: 'if: always() força execução mesmo se needs falhou. if: failure() roda só se algum needs falhou — útil para notificações.',
  },
  {
    level: 'Pleno',
    q: 'Quando usar workflow_dispatch vs schedule vs repository_dispatch?',
    a: 'workflow_dispatch: trigger manual via UI ou API com inputs configuráveis — para deploys manuais e operações pontuais. schedule: cron — para tarefas periódicas (renovar caches, rodar relatórios). repository_dispatch: trigger via API externa, payload customizado — para integrar com sistemas externos disparando workflows.',
    tip: 'workflow_dispatch é o mais usado dos três. Citar uso real (deploy de hotfix manual) ajuda.',
  },
  {
    level: 'Pleno',
    q: 'O que é strategy.matrix e como usar fail-fast?',
    a: 'matrix multiplica o job em combinações (Node 18/20/22 × Linux/Mac = 6 jobs paralelos). fail-fast: false desativa o cancelamento ao primeiro erro — importante para ver TODAS as falhas, não só a primeira. include adiciona combinação extra; exclude remove combinação específica.',
    tip: 'fail-fast default é true — útil em CI rápido, mas em testes onde você quer ver tudo que quebrou, sempre fail-fast: false.',
  },
  {
    level: 'Pleno',
    q: 'Como configurar permissions corretamente?',
    a: 'Mude o default do repo para "Read repository contents" (Settings > Actions). Declare permissions explícitas no nível de workflow (mínimo) e adicione específicas por job que precisar (pull-requests: write, packages: write, id-token: write). Princípio do menor privilégio.',
    tip: 'Em organizações grandes, configure como org-wide policy. Required workflows força o padrão.',
  },
  {
    level: 'Pleno',
    q: 'O que muda com concurrency cancel-in-progress: true?',
    a: 'Sem cancel-in-progress: novos runs do mesmo grupo ficam em fila, esperam o atual terminar. Com cancel-in-progress: true: novo run cancela o anterior. Padrão para PRs (cancela run obsoleto). Para deploy de prod: SEM cancel — fila evita estado inconsistente se um deploy é interrompido no meio.',
    tip: 'Group por github.workflow + github.ref para PRs. Group fixo (deploy-prod) para deploys serializados.',
  },
  {
    level: 'Pleno',
    q: 'Como debugar um workflow que falha em CI mas passa localmente?',
    a: 'Ativar ACTIONS_RUNNER_DEBUG=true e ACTIONS_STEP_DEBUG=true (secrets). Adicionar step com env | sort para comparar variáveis. Verificar versões exatas de Node/Python (matrix.node vs nvm local). Upload do workspace como artifact após falha. Para iterar local: act (roda Actions via Docker).',
    tip: 'Roteiro sequencial mostra experiência. Mencionar act demonstra que você conhece ferramentas além do óbvio.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre secrets e vars?',
    a: 'secrets: criptografados, mascarados nos logs, scoped por repo/org/environment. Para tokens, chaves, senhas. vars: NÃO criptografados, visíveis em logs e UI. Para configuração de ambiente (URLs, nomes, feature flags). Ambos podem ser scoped por environment.',
    tip: 'Use vars para dados não-sensíveis. Secret só para o que precisa ser criptografado — facilita debug e auditoria.',
  },
  {
    level: 'Senior',
    q: 'Como autenticar em AWS sem armazenar access key?',
    a: 'OIDC federation. (1) AWS: criar IAM Identity Provider apontando para token.actions.githubusercontent.com com audience sts.amazonaws.com. (2) IAM Role com trust policy condicional via StringLike sub: repo:org/repo:ref:refs/heads/main. (3) Workflow: permissions: id-token: write + aws-actions/configure-aws-credentials com role-to-assume. STS valida o JWT, devolve credenciais temporárias.',
    tip: 'A trust policy condition é o ponto crítico — sem ela qualquer repo pode assumir o role. Mencionar isso diferencia.',
  },
  {
    level: 'Senior',
    q: 'Por que pinar actions de terceiros por SHA?',
    a: 'Tags em Git são MUTÁVEIS — o mantenedor pode mover v3 para qualquer commit. Já houve incidentes (tj-actions/changed-files em 2025). SHA de commit é imutável. Use Renovate ou Dependabot para atualizar SHAs automaticamente em PRs com release notes.',
    tip: 'Para actions oficiais (org actions/) algumas equipes aceitam tag major. Para third-party, sempre SHA.',
  },
  {
    level: 'Senior',
    q: 'Explique o risco do pull_request_target.',
    a: 'pull_request_target roda no contexto da branch BASE (main), não do PR. Tem acesso a secrets — diferente de pull_request em forks. Se você fizer checkout do código do PR e executar comandos com secrets, é RCE garantido. Pattern seguro: dois workflows — um sem secrets (pull_request) que roda código + upload artifact, outro com secrets (workflow_run) que processa o artifact sem checkout do fork.',
    tip: 'Saber o pattern dos dois workflows é o que diferencia. Quase ninguém lembra a solução completa.',
  },
  {
    level: 'Senior',
    q: 'Como desenhar o CI de um monorepo com 10 serviços?',
    a: 'Job de detecção (dorny/paths-filter) identifica serviços alterados, retorna JSON. Job de CI usa matrix dinâmica (fromJson(needs.detect.outputs.services)). Reusable workflow service-ci.yaml chamado N vezes via matrix. Cache por serviço (chave inclui nome do serviço). Para builds incrementais: remote cache do Turborepo/Nx.',
    tip: 'Matrix dinâmica vs estática é o ponto sênior. Estática roda CI dos 10 serviços sempre (desperdício); dinâmica roda só dos afetados.',
  },
  {
    level: 'Senior',
    q: 'Reusable workflow vs composite action — quando usar cada?',
    a: 'Reusable workflow (workflow_call): pipeline INTEIRO chamável — múltiplos jobs, runner próprio, secrets passados pelo caller. Use para pipeline padronizado (CI por serviço, deploy completo). Composite action (action.yaml): bloco de STEPS no mesmo runner — sem isolamento, encapsula sequência de comandos. Use para setup repetitivo.',
    tip: 'Mencionar que composite roda no mesmo runner (compartilha workspace) e reusable em runner próprio (sem estado compartilhado) demonstra entendimento profundo.',
  },
  {
    level: 'Senior',
    q: 'Como configurar self-hosted runners com segurança?',
    a: '(1) Container mode: cada job em container Docker descartável. (2) Restrict to private repos — nunca aceitar de forks públicos. (3) Sem secrets globais — usar environments para escopar. (4) Rede isolada — subnet sem acesso à internet pública quando possível. (5) Para K8s: actions-runner-controller (ARC) com pods efêmeros por job.',
    tip: 'O risco de PR de fork em runner persistente = RCE é o gotcha clássico. Sempre mencione ARC ou container mode.',
  },
  {
    level: 'Senior',
    q: 'Como implementar deployment com rollback automático?',
    a: 'Step de deploy com id, step de smoke test (curl com retry checando health), step de rollback com if: failure() && steps.smoke.conclusion == "failure". Para infra declarativa (Terraform, K8s): rollback via revert do commit ou variável de versão. Notificação via Slack/PagerDuty no failure.',
    tip: 'Mencionar curl --retry e o if condicional do rollback mostra que você implementou de verdade, não só leu.',
  },
  {
    level: 'Senior',
    q: 'Como funcionam Environments e quando usar?',
    a: 'Environments são namespaces de configuração com proteções: required reviewers (aprovação manual), branch policy (só main pode deployar), wait timer (cooldown), secrets/vars scoped, e histórico. Job declara environment: { name, url } e pausa antes de rodar aguardando aprovação. Use para qualquer deploy de prod/staging.',
    tip: 'Citar o url: é destaque visual no GitHub. Required reviewers + branch policy juntos são o gate de produção mínimo.',
  },
  {
    level: 'Senior',
    q: 'Como implementar testes paralelos com sharding?',
    a: 'Matrix com shard: [1, 2, 3, 4]. Frameworks como Jest, Playwright, Vitest têm flag --shard=N/total. Cada shard upload coverage como artifact. Job final faz download dos coverages e merge (nyc merge). Trade-off: cada shard paga overhead de checkout + setup; só vale para suítes grandes (>5min).',
    tip: 'Mencionar o merge final dos coverages mostra que você pensou na consequência (relatório consolidado).',
  },
  {
    level: 'Senior',
    q: 'Como gerenciar versões de actions internas em uma organização grande?',
    a: 'Repositório central org/.github ou org/actions. Versionamento por tag major (v1, v2) — com revisão controlada. Required workflows do GitHub Enterprise força pipelines obrigatórios. Renovate em todos repos atualiza actions internas. README.md com inputs/outputs/exemplos por action. Anti-pattern: copiar workflows entre repos — gera drift inevitável.',
    tip: 'Required workflows é feature recente — saber que existe diferencia. Para 50+ repos, é a forma de manter compliance.',
  },
]

// ── Dados: Cheatsheet ─────────────────────────────────────────────────────────

const CHEATSHEET_HOOKS: HookItem[] = [
  { name: 'on: push',                sig: 'branches: [main, release/**]\n  paths: [src/**]\n  paths-ignore: [docs/**]', desc: 'Trigger por push' },
  { name: 'on: pull_request',         sig: 'branches: [main]\n  types: [opened, synchronize]',                              desc: 'Trigger por PR' },
  { name: 'on: schedule',             sig: 'cron: "0 2 * * 1"  # toda segunda 2h UTC',                                       desc: 'Cron job' },
  { name: 'on: workflow_dispatch',    sig: 'inputs:\n    env: { type: choice, options: [dev, prod] }',                       desc: 'Manual trigger via UI' },
  { name: 'on: workflow_call',        sig: 'inputs:\n    service: { type: string, required: true }\n  secrets:\n    TOKEN:',  desc: 'Reusable workflow' },
  { name: 'jobs.<id>.runs-on',        sig: 'ubuntu-latest | windows-latest | macos-latest | self-hosted',                    desc: 'Runner' },
  { name: 'jobs.<id>.needs',          sig: '[lint, test]  # DAG de dependências',                                            desc: 'Dependência entre jobs' },
  { name: 'jobs.<id>.if',             sig: "github.ref == 'refs/heads/main' && github.event_name == 'push'",                 desc: 'Condicional' },
  { name: 'jobs.<id>.strategy.matrix', sig: 'matrix:\n    node: [18, 20, 22]\n    os: [ubuntu-latest, macos-latest]',         desc: 'Matrix de combinações' },
  { name: 'jobs.<id>.environment',    sig: 'name: production\n  url: https://app.com',                                       desc: 'Gate de aprovação' },
  { name: 'jobs.<id>.timeout-minutes', sig: '20  # mata o job após 20 min',                                                   desc: 'Limite de tempo' },
  { name: 'permissions',              sig: 'contents: read\n  id-token: write\n  pull-requests: write',                      desc: 'Permissões mínimas' },
  { name: 'concurrency',              sig: 'group: ${{ github.workflow }}-${{ github.ref }}\n  cancel-in-progress: true',     desc: 'Evita runs paralelos do mesmo grupo' },
  { name: 'steps[].uses',             sig: 'actions/checkout@a1b2c3d  # SEMPRE pin SHA em third-party',                       desc: 'Action reutilizável' },
  { name: 'steps[].run',              sig: '|\n  echo "Hello"\n  npm ci',                                                    desc: 'Comando shell' },
  { name: 'steps[].with',             sig: 'node-version: "20"\n  cache: "npm"',                                              desc: 'Inputs da action' },
  { name: '$GITHUB_OUTPUT',           sig: 'echo "tag=v1.2.3" >> $GITHUB_OUTPUT',                                            desc: 'Definir output do step' },
  { name: '$GITHUB_ENV',              sig: 'echo "TAG=v1.2.3" >> $GITHUB_ENV',                                                desc: 'Definir env var em runtime' },
  { name: '${{ github.sha }}',        sig: 'commit hash | github.ref | github.actor | github.repository',                    desc: 'Contexto github' },
  { name: '${{ secrets.X }}',         sig: 'GITHUB_TOKEN, AWS_ROLE_ARN, etc',                                                 desc: 'Secret criptografado' },
  { name: '${{ vars.X }}',            sig: 'APP_NAME, REGISTRY_URL, etc',                                                    desc: 'Var não-sensível' },
  { name: '${{ needs.X.outputs.Y }}', sig: 'output Y do job X anterior',                                                     desc: 'Output entre jobs' },
  { name: '${{ steps.X.outputs.Y }}', sig: 'output Y do step X (precisa id)',                                                desc: 'Output entre steps' },
  { name: 'fromJson() / toJson()',    sig: 'matrix: ${{ fromJson(needs.detect.outputs.services) }}',                         desc: 'Matrix dinâmica' },
  { name: 'success()/failure()/always()', sig: 'if: failure()  # roda se algum step anterior falhou',                         desc: 'Status check functions' },
]

const CHEATSHEET_RULES: RuleItem[] = [
  { ok: true,  t: 'Pin actions de terceiros por SHA completo (org/action@a1b2c3d4). Renovate atualiza.' },
  { ok: true,  t: 'permissions: contents: read no nível workflow + específicas por job que precisar.' },
  { ok: true,  t: 'OIDC para AWS/GCP/Azure — id-token: write + role-to-assume, sem long-lived secret.' },
  { ok: true,  t: 'concurrency com cancel-in-progress: true para PRs; SEM cancel para deploys.' },
  { ok: true,  t: 'timeout-minutes em todo job (15-30 min CI típico). Default é 6h — perigoso.' },
  { ok: true,  t: 'Cache de deps via setup-node cache: "npm" (mais simples) ou actions/cache + hashFiles.' },
  { ok: true,  t: 'environments para deploy de prod — required reviewers + branch policy + secrets escopados.' },
  { ok: false, t: 'Nunca: pull_request_target + actions/checkout do código do fork. RCE garantido.' },
  { ok: false, t: 'Nunca: secrets em ENV global ou logados em curl --verbose. Use ::add-mask::.' },
  { ok: false, t: 'Nunca: GITHUB_TOKEN com permissões padrão "Read and write". Configure restritivo.' },
  { ok: false, t: 'Nunca: copiar workflows entre repos. Use reusable workflows ou required workflows.' },
]

// ── Dados: Anti-patterns ──────────────────────────────────────────────────────

const ANTIPATTERNS: AntiPatternItem[] = [
  {
    title: 'Action de terceiro sem pin SHA',
    badDesc: 'Usar tag (v3, v4) — mantenedor pode mover para versão maliciosa',
    badCode: [
      { t: '- uses: org/some-action@v3' },
      { t: '  # tag move se mantenedor for comprometido', c: '#ef4444' },
    ],
    goodDesc: 'Pin por SHA completo + Renovate/Dependabot para atualizar',
    goodCode: [
      { t: '- uses: org/some-action@a1b2c3d4e5f6...  # v3.2.1', c: '#4ade80' },
      { t: '  # SHA imutável — atualização controlada via PR', c: '#4ade80' },
    ],
    why: 'Tags em Git são mutáveis. Já houve incidentes reais (tj-actions/changed-files 2025). SHA é imutável — supply chain protegida.',
  },
  {
    title: 'pull_request_target com checkout do fork',
    badDesc: 'pull_request_target tem acesso a secrets — checkout do código do fork = RCE',
    badCode: [
      { t: 'on: pull_request_target' },
      { t: '- uses: actions/checkout@v4', c: '#ef4444' },
      { t: '  with: { ref: ${{ github.event.pull_request.head.sha }} }', c: '#ef4444' },
      { t: '- run: npm test  # com secrets disponíveis = RCE!', c: '#ef4444' },
    ],
    goodDesc: 'Pattern de dois workflows: um sem secrets executa, outro processa artifact',
    goodCode: [
      { t: '# Workflow A: pull_request — sem secrets, roda código', c: '#4ade80' },
      { t: '# Workflow B: workflow_run — com secrets, baixa artifact', c: '#4ade80' },
      { t: '#   NUNCA faz checkout do fork em B', c: '#4ade80' },
    ],
    why: 'pull_request_target roda no contexto da base (tem secrets). Executar código do fork com secrets é RCE clássico — todo contribuidor pode comprometer.',
  },
  {
    title: 'GITHUB_TOKEN com permissões excessivas',
    badDesc: 'Sem permissions explícito + repo configurado como "Read and write"',
    badCode: [
      { t: 'name: CI' },
      { t: 'on: [push]' },
      { t: '# sem permissions:', c: '#ef4444' },
      { t: '# token tem write em contents, packages, issues, etc!', c: '#ef4444' },
    ],
    goodDesc: 'Workflow permissions = Read + permissions explícitas mínimas',
    goodCode: [
      { t: 'permissions:', c: '#4ade80' },
      { t: '  contents: read         # mínimo', c: '#4ade80' },
      { t: 'jobs:', c: '#4ade80' },
      { t: '  pr-comment:', c: '#4ade80' },
      { t: '    permissions:', c: '#4ade80' },
      { t: '      pull-requests: write  # só este job adiciona', c: '#4ade80' },
    ],
    why: 'Token comprometido pode fazer push, criar releases, modificar issues. Princípio do menor privilégio — declare apenas o necessário, scope por job quando possível.',
  },
  {
    title: 'Secret em ENV ou logado',
    badDesc: 'echo $SECRET, curl --verbose, log de variáveis com prefixo',
    badCode: [
      { t: 'env:' },
      { t: '  API_KEY: ${{ secrets.API_KEY }}' },
      { t: '- run: curl -H "Auth: $API_KEY" --verbose $URL', c: '#ef4444' },
      { t: '- run: env | grep API  # vaza nos logs!', c: '#ef4444' },
    ],
    goodDesc: 'Mask explícito + curl silencioso',
    goodCode: [
      { t: 'echo "::add-mask::${{ secrets.API_KEY }}"', c: '#4ade80' },
      { t: 'curl -sS -H "Auth: ${{ secrets.API_KEY }}" $URL', c: '#4ade80' },
      { t: '# -sS: silent mas mostra erros sem dump de headers', c: '#4ade80' },
    ],
    why: 'GitHub mascara valores conhecidos como secret, mas não 100% confiável (derivados podem escapar). Use ::add-mask:: para garantir mascaramento de valores derivados.',
  },
  {
    title: 'Sem timeout-minutes',
    badDesc: 'Job sem timeout — default é 6 horas',
    badCode: [
      { t: 'jobs:' },
      { t: '  e2e:' },
      { t: '    runs-on: ubuntu-latest' },
      { t: '    # sem timeout — 6h se travar!', c: '#ef4444' },
      { t: '    steps:' },
      { t: '      - run: npm run test:e2e', c: '#ef4444' },
    ],
    goodDesc: 'timeout-minutes razoável por job',
    goodCode: [
      { t: 'jobs:' },
      { t: '  e2e:' },
      { t: '    runs-on: ubuntu-latest' },
      { t: '    timeout-minutes: 30   # mata após 30 min', c: '#4ade80' },
      { t: '    steps:' },
      { t: '      - timeout-minutes: 5   # por step', c: '#4ade80' },
      { t: '        run: npm run test:e2e', c: '#4ade80' },
    ],
    why: 'Sem timeout, processo travado consome 6h de minutos pagos. Configure 15-30 min para CI típico, 5-10 min para steps específicos que podem travar.',
  },
  {
    title: 'Cache key sem hash do lockfile',
    badDesc: 'Key estática nunca invalida — restaura deps desatualizadas',
    badCode: [
      { t: '- uses: actions/cache@v4' },
      { t: '  with:' },
      { t: '    path: ~/.npm', c: '#ef4444' },
      { t: '    key: ${{ runner.os }}-npm  # nunca muda!', c: '#ef4444' },
    ],
    goodDesc: 'Hash do lockfile na key + restore-keys de fallback',
    goodCode: [
      { t: '- uses: actions/cache@v4', c: '#4ade80' },
      { t: '  with:', c: '#4ade80' },
      { t: '    path: ~/.npm', c: '#4ade80' },
      { t: "    key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}", c: '#4ade80' },
      { t: '    restore-keys: |', c: '#4ade80' },
      { t: '      ${{ runner.os }}-npm-', c: '#4ade80' },
    ],
    why: 'Sem hash do lockfile, cache nunca invalida — sua build fica usando deps antigas mesmo após npm install. restore-keys é fallback parcial quando não há cache exato.',
  },
  {
    title: 'Sem concurrency em PRs',
    badDesc: '5 pushes rápidos no PR criam 5 builds paralelas — desperdício',
    badCode: [
      { t: 'on: pull_request' },
      { t: '# sem concurrency — toda push roda novo build', c: '#ef4444' },
      { t: '# 5 pushes = 5 builds simultâneas', c: '#ef4444' },
    ],
    goodDesc: 'concurrency com cancel-in-progress por PR',
    goodCode: [
      { t: 'concurrency:', c: '#4ade80' },
      { t: '  group: ${{ github.workflow }}-${{ github.ref }}', c: '#4ade80' },
      { t: '  cancel-in-progress: true', c: '#4ade80' },
      { t: '# Novo push cancela run anterior — só o último importa', c: '#4ade80' },
    ],
    why: 'Sem concurrency, pushes rápidos consomem minutos pagando builds que serão descartados. Para deploys de produção, use concurrency SEM cancel — fila evita estado inconsistente.',
  },
  {
    title: 'Self-hosted runner aceitando PRs de fork',
    badDesc: 'Runner persistente expõe rede interna a código de fork',
    badCode: [
      { t: 'on: pull_request', c: '#ef4444' },
      { t: 'jobs:' },
      { t: '  test:' },
      { t: '    runs-on: [self-hosted, internal-network]', c: '#ef4444' },
      { t: '    # Código de fork rodando na sua rede!', c: '#ef4444' },
    ],
    goodDesc: 'GitHub-hosted para PRs externos, self-hosted só para internos',
    goodCode: [
      { t: 'jobs:', c: '#4ade80' },
      { t: '  test:', c: '#4ade80' },
      { t: '    # GitHub-hosted para PRs públicos', c: '#4ade80' },
      { t: '    runs-on: ubuntu-latest', c: '#4ade80' },
      { t: '  deploy:', c: '#4ade80' },
      { t: '    if: github.event_name == \'push\'  # só na main', c: '#4ade80' },
      { t: '    runs-on: [self-hosted, deploy]', c: '#4ade80' },
    ],
    why: 'Self-hosted runner com PRs de forks = RCE para qualquer contribuidor. Use ARC (actions-runner-controller) com pods efêmeros, ou separe runners — GitHub-hosted para PRs públicos, self-hosted só para jobs autorizados.',
  },
]

// ── Dados: Quick Ref ──────────────────────────────────────────────────────────

const QUICKREF_COLUMNS: QuickRefColumn[] = [
  {
    sections: [
      {
        title: 'Triggers (on:)',
        entries: [
          { key: 'push: branches: [main]',           value: 'Trigger por push' },
          { key: 'push: paths: [src/**]',            value: 'Filtro por arquivos' },
          { key: 'pull_request: branches: [main]',   value: 'Trigger por PR' },
          { key: 'pull_request_target',              value: 'PR no contexto base', badge: '⚠ RCE risk' },
          { key: 'schedule: cron: "0 2 * * 1"',      value: 'Cron job' },
          { key: 'workflow_dispatch: inputs:',       value: 'Manual via UI' },
          { key: 'workflow_call: inputs/secrets:',   value: 'Reusable workflow' },
          { key: 'repository_dispatch',              value: 'Trigger via API externa' },
        ],
      },
      {
        title: 'Estrutura de Job',
        entries: [
          { key: 'runs-on: ubuntu-latest',           value: 'Runner' },
          { key: 'needs: [lint, test]',              value: 'DAG de dependências' },
          { key: 'if: github.ref == ...',            value: 'Condicional' },
          { key: 'environment: production',          value: 'Gate de aprovação' },
          { key: 'timeout-minutes: 20',              value: 'Limite de tempo', badge: '★ obrigatório' },
          { key: 'strategy.matrix:',                 value: 'Combinações paralelas' },
          { key: 'strategy.fail-fast: false',        value: 'Não cancela ao 1º erro' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Steps',
        entries: [
          { key: 'uses: actions/checkout@SHA',       value: 'Checkout do repo', badge: '★ pin SHA' },
          { key: 'uses: actions/setup-node@v4',      value: 'Setup Node.js' },
          { key: 'with: { node-version: "20" }',     value: 'Inputs da action' },
          { key: 'with: cache: "npm"',               value: 'Cache integrado' },
          { key: 'run: npm ci && npm test',          value: 'Comando shell' },
          { key: 'id: build',                        value: 'Para referenciar outputs' },
          { key: 'continue-on-error: true',          value: 'Não falha o job' },
          { key: 'env: { KEY: value }',              value: 'Variáveis do step' },
        ],
      },
      {
        title: 'Outputs e contextos',
        entries: [
          { key: 'echo "k=v" >> $GITHUB_OUTPUT',     value: 'Output do step' },
          { key: 'echo "k=v" >> $GITHUB_ENV',        value: 'Env var em runtime' },
          { key: 'steps.id.outputs.k',               value: 'Acessa output do step' },
          { key: 'needs.JOB.outputs.k',              value: 'Output entre jobs' },
          { key: 'github.sha / ref / actor',         value: 'Contexto do evento' },
          { key: 'secrets.X',                        value: 'Secret criptografado' },
          { key: 'vars.X',                           value: 'Var não-sensível' },
          { key: 'runner.os / arch',                 value: 'Info do runner' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Permissions e segurança',
        entries: [
          { key: 'permissions: contents: read',      value: 'Mínimo recomendado' },
          { key: 'id-token: write',                  value: 'OIDC para cloud', badge: '★ AWS/GCP/Azure' },
          { key: 'pull-requests: write',             value: 'Comentar em PR' },
          { key: 'packages: write',                  value: 'Push para GHCR' },
          { key: 'contents: write',                  value: 'Criar release/tag' },
          { key: 'pages: write + id-token: write',   value: 'Deploy GitHub Pages' },
        ],
      },
      {
        title: 'Concurrency e expressions',
        entries: [
          { key: 'concurrency: { group: ..., cancel-in-progress: true }', value: 'Cancela run anterior' },
          { key: 'fromJson(needs.X.outputs.Y)',      value: 'Matrix dinâmica' },
          { key: 'hashFiles("**/lockfile")',         value: 'Hash de arquivos para cache' },
          { key: 'success() / failure() / always()', value: 'Status check funcs' },
          { key: 'contains() / startsWith()',        value: 'String functions' },
          { key: 'format("{0}-{1}", a, b)',          value: 'Formatação' },
          { key: '::add-mask::valor',                value: 'Mascarar em logs', badge: '★ secret deriv.' },
        ],
      },
    ],
  },
]

// ── Builders ──────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'GitHub Actions',
    stackLabel: 'DevOps / CI/CD',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'GitHub Actions',
    accentColor: C,
    stackLabel: 'DevOps / CI/CD',
    sections: {
      hooks: CHEATSHEET_HOOKS,
      depRows: [],
      rules: CHEATSHEET_RULES,
      performanceTips: [],
      patterns: [],
      mentalModels: [],
    },
  }),
  'quick-ref': () => buildQuickRefPdf({
    skillName: 'GitHub Actions',
    accentColor: C,
    stackLabel: 'DevOps / CI/CD',
    columns: QUICKREF_COLUMNS,
  }),
  antipatterns: () => buildAntipatternsPdf({
    skillName: 'GitHub Actions',
    accentColor: C,
    stackLabel: 'DevOps / CI/CD',
    antipatterns: ANTIPATTERNS,
  }),
}

// ── Componente ────────────────────────────────────────────────────────────────

export default function GithubActionsPdfs() {
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
      {open && (
        <PdfModal card={open} onClose={() => setOpen(null)} builders={PDF_BUILDERS} />
      )}
    </>
  )
}
