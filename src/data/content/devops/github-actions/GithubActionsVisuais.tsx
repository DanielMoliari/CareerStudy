'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { SequenceDiagram } from '@/components/visuals/SequenceDiagram'
import type { SeqActor, SeqMessage } from '@/components/visuals/SequenceDiagram'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'
import { DecisionTree } from '@/components/visuals/DecisionTree'
import type { DTNode } from '@/components/visuals/DecisionTree'
import { ProgressionMap } from '@/components/visuals/ProgressionMap'
import type { ProgressionLevel } from '@/components/visuals/ProgressionMap'

// ── Paleta GitHub Actions ─────────────────────────────────────────────────────
const C      = '#2088FF'   // GitHub Actions blue
const SEC    = '#1666cc'
const BG     = '#0f172a'
const CARD   = '#1e293b'
const CARD2  = '#0f1e3a'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#4ade80'
const RED    = '#ef4444'
const AMB    = '#f59e0b'
const PRP    = '#a78bfa'
const SKY    = '#38bdf8'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Anatomia do workflow (LayerStack)
// ═══════════════════════════════════════════════════════════════════════════════

const ANATOMY_LAYERS: Layer[] = [
  {
    id: 'event',
    label: 'Evento (trigger)',
    sublabel: 'on: push / pull_request / schedule / workflow_dispatch',
    description: 'O ponto de entrada: o que faz o workflow rodar. Pode ser código (push, pull_request), tempo (schedule cron), manual (workflow_dispatch), ou outro workflow (workflow_call, workflow_run). Filtros como branches, paths e tags reduzem execuções desnecessárias.',
    code: 'on:\n  push:\n    branches: [main]\n    paths: [src/**]',
    color: C,
    icon: 'EVT',
    examples: ['push', 'pull_request', 'schedule (cron)', 'workflow_dispatch', 'workflow_call'],
  },
  {
    id: 'workflow',
    label: 'Workflow',
    sublabel: '.github/workflows/*.yaml',
    description: 'O arquivo YAML que define o pipeline. Tem env, permissions, concurrency e jobs no nível raiz. Múltiplos workflows podem coexistir no mesmo repositório — cada um disparado por seu próprio set de eventos. Permissions e concurrency declaradas aqui se aplicam a todos os jobs.',
    code: 'name: CI\npermissions: { contents: read }\nconcurrency:\n  group: ${{ github.ref }}\n  cancel-in-progress: true',
    color: SEC,
    icon: 'WF',
    examples: ['name', 'on', 'permissions', 'concurrency', 'env', 'jobs'],
  },
  {
    id: 'job',
    label: 'Jobs (paralelos por padrão)',
    sublabel: 'runs-on, needs, if, strategy.matrix, environment',
    description: 'Unidades de execução que rodam em paralelo por padrão. Cada job pega um runner próprio (VM limpa, sem estado compartilhado entre jobs). needs: cria DAG de dependências. environment: adiciona gates de aprovação. strategy.matrix multiplica o job em várias combinações.',
    code: 'jobs:\n  test:\n    runs-on: ubuntu-latest\n    needs: [lint]\n    timeout-minutes: 20\n    strategy:\n      matrix:\n        node: [18, 20, 22]',
    color: GRN,
    icon: 'JOB',
    examples: ['runs-on (runner)', 'needs (DAG)', 'strategy.matrix', 'environment', 'timeout-minutes', 'if (condicional)'],
  },
  {
    id: 'step',
    label: 'Steps (sequenciais dentro do job)',
    sublabel: 'uses (action) ou run (shell), id para outputs',
    description: 'A unidade mínima de execução. Cada step é uma action (uses:) ou um comando shell (run:). Rodam sequencialmente dentro do job — falha de um step encerra o job (a menos que continue-on-error). id permite referenciar outputs do step em steps posteriores.',
    code: 'steps:\n  - uses: actions/checkout@v4\n  - uses: actions/setup-node@v4\n    with: { node-version: 20, cache: npm }\n  - id: build\n    run: |\n      npm ci\n      echo "ver=1.0" >> $GITHUB_OUTPUT',
    color: AMB,
    icon: 'STP',
    examples: ['uses (action)', 'run (shell)', 'with (inputs)', 'id (outputs)', 'env (variáveis)'],
  },
  {
    id: 'runner',
    label: 'Runner',
    sublabel: 'ubuntu-latest / self-hosted / larger',
    description: 'A máquina (VM ou container) onde o job efetivamente roda. GitHub-hosted: VM limpa em cada run, descartada ao final. Self-hosted: seu hardware, persistente. Larger runners: mais cores/RAM, ARM, GPU. Cuidado: PR de fork em self-hosted é vetor de RCE — sempre use containers efêmeros.',
    code: 'runs-on: ubuntu-latest\n# ou\nruns-on: [self-hosted, linux, x64]\n# ou\nruns-on: ubuntu-latest-16-cores',
    color: PRP,
    icon: 'RNR',
    examples: ['ubuntu-latest', 'macos-latest', 'windows-latest', 'self-hosted', 'larger runners (cores)'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Tipos de Action (ComparisonTable)
// ═══════════════════════════════════════════════════════════════════════════════

const ACTION_OPTIONS: ComparisonOption[] = [
  { id: 'composite', label: 'Composite Action',     sublabel: 'sequência de steps em YAML', color: C },
  { id: 'js',        label: 'JavaScript Action',     sublabel: 'JS bundle no runner',        color: AMB },
  { id: 'docker',    label: 'Docker Action',         sublabel: 'container isolado',          color: PRP },
  { id: 'reusable',  label: 'Reusable Workflow',     sublabel: 'workflow inteiro',           color: GRN },
]

const ACTION_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'isolation',
    label: 'Isolamento do runner',
    category: 'Execução',
    description: 'Quanto a action compartilha estado com o job que a chama',
    values: {
      composite: { rating: 'poor',      note: 'Mesmo runner, workspace, env — sem isolamento' },
      js:        { rating: 'fair',      note: 'Mesmo runner, processo Node separado' },
      docker:    { rating: 'excellent', note: 'Container isolado — qualquer toolchain' },
      reusable:  { rating: 'excellent', note: 'Runner próprio, jobs próprios, sem compartilhamento' },
    },
  },
  {
    id: 'speed',
    label: 'Velocidade de execução',
    category: 'Performance',
    description: 'Overhead de inicialização',
    values: {
      composite: { rating: 'excellent', note: 'Zero overhead — só steps inline' },
      js:        { rating: 'excellent', note: 'Node já está no runner' },
      docker:    { rating: 'fair',      note: 'Build/pull da imagem antes de rodar' },
      reusable:  { rating: 'poor',      note: 'Nova VM, novo checkout, novo setup' },
    },
  },
  {
    id: 'flexibility',
    label: 'Flexibilidade de lógica',
    category: 'Capacidade',
    description: 'O que você consegue expressar',
    values: {
      composite: { rating: 'fair',      note: 'Sequência de comandos shell — limitado' },
      js:        { rating: 'excellent', note: 'JS completo + npm packages + GitHub API' },
      docker:    { rating: 'excellent', note: 'Qualquer linguagem, qualquer toolchain' },
      reusable:  { rating: 'excellent', note: 'Pipeline completo com múltiplos jobs' },
    },
  },
  {
    id: 'reuse',
    label: 'Granularidade de reuso',
    category: 'Composição',
    description: 'O que cada tipo encapsula',
    values: {
      composite: { rating: 'good',      note: 'Bloco de steps dentro de um job' },
      js:        { rating: 'good',      note: 'Lógica programática de um step' },
      docker:    { rating: 'good',      note: 'Step que precisa de toolchain isolada' },
      reusable:  { rating: 'excellent', note: 'Pipeline completo (CI, deploy, release)' },
    },
  },
  {
    id: 'distribution',
    label: 'Distribuição',
    category: 'Operação',
    description: 'Como você publica e versiona',
    values: {
      composite: { rating: 'excellent', note: 'Repo Git com action.yaml — Marketplace ou interno' },
      js:        { rating: 'good',      note: 'Repo Git + dist/ commitado (ou release)' },
      docker:    { rating: 'fair',      note: 'Imagem em registry (Dockerfile no repo)' },
      reusable:  { rating: 'excellent', note: 'Repo Git com .github/workflows/*.yaml' },
    },
  },
  {
    id: 'usecase',
    label: 'Quando usar',
    category: 'Decisão',
    description: 'Caso de uso ideal',
    values: {
      composite: { rating: 'excellent', note: 'Setup repetitivo, sequência de comandos (80% dos casos)' },
      js:        { rating: 'excellent', note: 'Lógica complexa, GitHub API, processamento de dados' },
      docker:    { rating: 'good',      note: 'Toolchain específica, ambiente reproduzível' },
      reusable:  { rating: 'excellent', note: 'Pipeline padrão da org, CI por serviço em monorepo' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Fluxo OIDC (SequenceDiagram)
// ═══════════════════════════════════════════════════════════════════════════════

const OIDC_ACTORS: SeqActor[] = [
  { id: 'wf',     label: 'Workflow Job',          color: C   },
  { id: 'gh',     label: 'GitHub OIDC Provider',  color: SEC },
  { id: 'sts',    label: 'AWS STS',               color: AMB },
  { id: 'iam',    label: 'IAM Role',              color: PRP },
  { id: 'aws',    label: 'AWS API (S3, etc)',     color: GRN },
]

const OIDC_MESSAGES: SeqMessage[] = [
  { from: 'wf',  to: 'gh',  label: 'request OIDC token (id-token: write)',            type: 'sync',   note: 'permissions: id-token: write declarado no workflow' },
  { from: 'gh',  to: 'gh',  label: 'gera JWT com claims (sub, aud, iss)',             type: 'sync',   note: 'sub = repo:org/repo:ref:refs/heads/main' },
  { from: 'gh',  to: 'wf',  label: 'JWT (válido só por este run)',                    type: 'return' },
  { from: 'wf',  to: 'sts', label: 'AssumeRoleWithWebIdentity(role-arn, JWT)',        type: 'sync' },
  { from: 'sts', to: 'gh',  label: 'verifica assinatura do JWT (JWKS público)',       type: 'sync',   note: 'STS busca chave pública do GitHub' },
  { from: 'gh',  to: 'sts', label: 'JWT válido — claims confirmadas',                 type: 'return' },
  { from: 'sts', to: 'iam', label: 'avalia trust policy do role',                     type: 'sync',   note: 'StringLike: sub matches "repo:org/repo:ref:refs/heads/main"' },
  { from: 'iam', to: 'sts', label: 'autorizado',                                      type: 'return' },
  { from: 'sts', to: 'wf',  label: 'credentials temporárias (1h por padrão)',         type: 'return', note: 'AccessKey + SecretKey + SessionToken' },
  { from: 'wf',  to: 'aws', label: 'aws s3 ls (com credentials temporárias)',         type: 'sync' },
  { from: 'aws', to: 'wf',  label: 'resposta da API',                                 type: 'return', note: 'Sem long-lived secret armazenado' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Cache strategy (DecisionTree)
// ═══════════════════════════════════════════════════════════════════════════════

const CACHE_ROOT: DTNode = {
  id: 'root',
  question: 'Que tipo de cache você precisa?',
  detail: 'Decida pelo que está cacheando — dependências, build artifacts ou layers Docker.',
  color: C,
  children: [
    { label: 'Dependências (npm, pip, go)', nodeId: 'deps' },
    { label: 'Build artifacts (dist, target)', nodeId: 'build' },
    { label: 'Docker layers', nodeId: 'docker' },
  ],
}

const CACHE_NODES: Record<string, DTNode> = {
  deps: {
    id: 'deps',
    question: 'Tem suporte nativo no setup-* action?',
    color: GRN,
    children: [
      { label: 'Sim (setup-node, setup-python, setup-go)', nodeId: 'deps-native' },
      { label: 'Não (linguagem rara, CLI custom)', nodeId: 'deps-manual' },
    ],
  },
  'deps-native': {
    id: 'deps-native',
    recommendation: 'Use o cache integrado do setup-* action',
    detail: 'Mais simples e bem testado. setup-node@v4 com cache: \'npm\' detecta package-lock.json automaticamente. Suporta yarn e pnpm também. Use cache-dependency-path em monorepos para apontar para lockfile específico.',
    color: GRN,
  },
  'deps-manual': {
    id: 'deps-manual',
    recommendation: 'actions/cache com chave hash do lockfile',
    detail: 'Use actions/cache@v4 com key incluindo runner.os e hashFiles do lockfile. Adicione restore-keys com prefixo para fallback parcial. Path deve ser o diretório de cache da ferramenta (~/.cargo, ~/.gradle, etc).',
    color: AMB,
  },
  build: {
    id: 'build',
    question: 'O artifact precisa atravessar jobs ou só steps?',
    color: AMB,
    children: [
      { label: 'Entre steps do mesmo job', nodeId: 'build-same-job' },
      { label: 'Entre jobs do mesmo workflow', nodeId: 'build-cross-job' },
      { label: 'Entre runs (build incremental)', nodeId: 'build-incremental' },
    ],
  },
  'build-same-job': {
    id: 'build-same-job',
    recommendation: 'Não precisa de cache — file system do runner persiste',
    detail: 'Steps do mesmo job compartilham o workspace. Use simplesmente com paths relativos. Cache só faz sentido se o trabalho de gerar o artifact for caro e for repetido entre runs.',
    color: GRN,
  },
  'build-cross-job': {
    id: 'build-cross-job',
    recommendation: 'actions/upload-artifact + download-artifact',
    detail: 'Artifacts são o mecanismo nativo para passar arquivos entre jobs do mesmo run. Persistem por 90 dias por padrão (configurável). Diferente de cache: artifacts são versionados por run, cache é compartilhado entre runs.',
    color: AMB,
  },
  'build-incremental': {
    id: 'build-incremental',
    recommendation: 'actions/cache com chave que inclui hash do código + remote cache (Turbo, Nx)',
    detail: 'Para builds incrementais reais (Turborepo, Nx, Bazel, sccache), o GitHub Cache funciona como backend. Para máxima eficiência em monorepos, configure remote cache do Turbo/Nx — restaura builds exatos baseado em hash de inputs.',
    color: SKY,
  },
  docker: {
    id: 'docker',
    question: 'Onde o cache de layers vive?',
    color: PRP,
    children: [
      { label: 'GitHub Cache (gratuito, 10 GB)', nodeId: 'docker-gha' },
      { label: 'Registry (ECR, GHCR, Docker Hub)', nodeId: 'docker-registry' },
      { label: 'Inline (na própria imagem)', nodeId: 'docker-inline' },
    ],
  },
  'docker-gha': {
    id: 'docker-gha',
    recommendation: 'cache-from/to: type=gha — para 80% dos casos',
    detail: 'docker/build-push-action com cache-from: type=gha e cache-to: type=gha,mode=max. mode=max armazena layers de stages intermediários. Limitado a 10 GB por repo. Caches expiram em 7 dias sem uso. Mais simples e gratuito.',
    color: GRN,
  },
  'docker-registry': {
    id: 'docker-registry',
    recommendation: 'cache-from/to: type=registry — para imagens grandes',
    detail: 'Layers vão para um registry (mesmo da imagem ou separado). Sem limite de 10 GB. Mais persistente. Custo: storage no registry. Use quando: imagens muito grandes (>5 GB), múltiplos workflows compartilhando cache, builds que rodam muito além das 7 days do GHA cache.',
    color: AMB,
  },
  'docker-inline': {
    id: 'docker-inline',
    recommendation: 'cache-to: type=inline — só com mode=max',
    detail: 'Inline cache embute as layers de cache na própria imagem final. Útil quando imagens já são distribuídas — qualquer pull já vem com cache pronto. Aumenta tamanho da imagem. Use só se conveniência > tamanho.',
    color: SKY,
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — Anti-patterns de segurança
// ═══════════════════════════════════════════════════════════════════════════════

const SECURITY_ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'Action de terceiro sem pin por SHA',
    wrong: [
      [{ text: 'jobs:', color: FGMUTE }],
      [{ text: '  build:', color: FGMUTE }],
      [{ text: '    steps:', color: FGMUTE }],
      [{ text: '      - uses: org/some-action@v3', color: RED }],
      [{ text: '      # tag move se mantenedor for comprometido!', color: RED }],
    ],
    right: [
      [{ text: 'jobs:', color: FGMUTE }],
      [{ text: '  build:', color: FGMUTE }],
      [{ text: '    steps:', color: FGMUTE }],
      [{ text: '      - uses: org/some-action@a1b2c3d4e5f6...  # v3.2.1', color: GRN }],
      [{ text: '      # SHA imutável — Renovate atualiza em PR controlado', color: GRN }],
    ],
    why: 'Tags em Git são mutáveis. Já houve incidentes reais (tj-actions/changed-files em 2025) onde tags foram movidas para versões maliciosas. SHA de commit é imutável — sua build fica protegida mesmo se o mantenedor for comprometido. Use Dependabot ou Renovate para atualizações controladas.',
  },
  {
    title: 'pull_request_target com checkout do código do fork',
    wrong: [
      [{ text: 'on: pull_request_target', color: FGMUTE }],
      [{ text: 'jobs:', color: FGMUTE }],
      [{ text: '  test:', color: FGMUTE }],
      [{ text: '    steps:', color: FGMUTE }],
      [{ text: '      - uses: actions/checkout@v4', color: RED }],
      [{ text: '        with:', color: RED }],
      [{ text: '          ref: ${{ github.event.pull_request.head.sha }}', color: RED }],
      [{ text: '      - run: npm test  # RCE GARANTIDO!', color: RED }],
      [{ text: '        env:', color: RED }],
      [{ text: '          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}', color: RED }],
    ],
    right: [
      [{ text: '# Workflow A: roda código do fork SEM secrets', color: GRN }],
      [{ text: 'on: pull_request', color: GRN }],
      [{ text: 'jobs:', color: FGMUTE }],
      [{ text: '  test:', color: FGMUTE }],
      [{ text: '    steps:', color: FGMUTE }],
      [{ text: '      - uses: actions/checkout@v4', color: GRN }],
      [{ text: '      - run: npm test', color: GRN }],
      [{ text: '      - uses: actions/upload-artifact@v4', color: GRN }],
      [{ text: '# Workflow B (workflow_run): comenta no PR COM secrets', color: GRN }],
      [{ text: '# mas NUNCA executa código do fork', color: GRN }],
    ],
    why: 'pull_request_target roda no contexto da branch base e tem acesso a secrets. Se você fizer checkout do código do PR e executar comandos com secrets disponíveis, o atacante (qualquer um que abra um PR) tem RCE. Pattern seguro: dois workflows — um sem secrets que roda código + upload artifact, outro com secrets que processa o artifact (sem checkout).',
  },
  {
    title: 'Permissões excessivas no GITHUB_TOKEN',
    wrong: [
      [{ text: '# Settings > Actions > Workflow permissions:', color: FGMUTE }],
      [{ text: '# "Read and write permissions"  (DEFAULT HISTÓRICO)', color: RED }],
      [{ text: '', color: FGMUTE }],
      [{ text: 'name: CI', color: FGMUTE }],
      [{ text: 'on: [push, pull_request]', color: FGMUTE }],
      [{ text: '# sem permissions: explícito', color: RED }],
      [{ text: 'jobs:', color: FGMUTE }],
      [{ text: '  test:', color: FGMUTE }],
      [{ text: '    runs-on: ubuntu-latest', color: FGMUTE }],
      [{ text: '    # GITHUB_TOKEN tem write em tudo!', color: RED }],
    ],
    right: [
      [{ text: '# Settings > Actions > Workflow permissions:', color: FGMUTE }],
      [{ text: '# "Read repository contents"  (RESTRITIVO)', color: GRN }],
      [{ text: '', color: FGMUTE }],
      [{ text: 'name: CI', color: FGMUTE }],
      [{ text: 'on: [push, pull_request]', color: FGMUTE }],
      [{ text: 'permissions:', color: GRN }],
      [{ text: '  contents: read         # mínimo possível', color: GRN }],
      [{ text: 'jobs:', color: FGMUTE }],
      [{ text: '  pr-comment:', color: FGMUTE }],
      [{ text: '    permissions:', color: GRN }],
      [{ text: '      pull-requests: write  # só este job adiciona', color: GRN }],
    ],
    why: 'Princípio do menor privilégio: o GITHUB_TOKEN deve ter só as permissões estritamente necessárias. Configure no nível do repositório para "Read" e adicione permissões específicas por workflow ou job. Um token comprometido pode fazer push de commits, criar releases, etc — limite o blast radius.',
  },
  {
    title: 'Secret em ENV ou logado em echo',
    wrong: [
      [{ text: 'jobs:', color: FGMUTE }],
      [{ text: '  deploy:', color: FGMUTE }],
      [{ text: '    env:', color: FGMUTE }],
      [{ text: '      API_KEY: ${{ secrets.API_KEY }}', color: FGMUTE }],
      [{ text: '    steps:', color: FGMUTE }],
      [{ text: '      - run: echo "Deploying with $API_KEY"', color: RED }],
      [{ text: '      - run: curl -H "Auth: $API_KEY" $URL --verbose', color: RED }],
      [{ text: '      # --verbose loga headers — secret aparece no log', color: RED }],
    ],
    right: [
      [{ text: 'jobs:', color: FGMUTE }],
      [{ text: '  deploy:', color: FGMUTE }],
      [{ text: '    steps:', color: FGMUTE }],
      [{ text: '      - run: |', color: GRN }],
      [{ text: '          echo "::add-mask::${{ secrets.API_KEY }}"', color: GRN }],
      [{ text: '          curl -sS -H "Auth: ${{ secrets.API_KEY }}" $URL', color: GRN }],
      [{ text: '      # add-mask garante mascaramento mesmo em derivados', color: GRN }],
      [{ text: '      # -sS no curl: silent mas mostra erros sem dump', color: GRN }],
    ],
    why: 'O GitHub mascara automaticamente valores conhecidos como secret nos logs, mas não é 100% confiável: derivados (base64, JSON wrapped, parte do secret) podem escapar. Nunca use --verbose, --debug, ou log explicitamente um secret. Use ::add-mask:: para garantir mascaramento de valores derivados.',
  },
  {
    title: 'Sem timeout-minutes — job travado consome 6h',
    wrong: [
      [{ text: 'jobs:', color: FGMUTE }],
      [{ text: '  e2e:', color: FGMUTE }],
      [{ text: '    runs-on: ubuntu-latest', color: FGMUTE }],
      [{ text: '    # sem timeout — default = 6 HORAS!', color: RED }],
      [{ text: '    steps:', color: FGMUTE }],
      [{ text: '      - run: npm run test:e2e', color: RED }],
      [{ text: '      # se travar (porta em uso, timeout sleep), 6h pagas', color: RED }],
    ],
    right: [
      [{ text: 'jobs:', color: FGMUTE }],
      [{ text: '  e2e:', color: FGMUTE }],
      [{ text: '    runs-on: ubuntu-latest', color: FGMUTE }],
      [{ text: '    timeout-minutes: 30   # mata se passar de 30 min', color: GRN }],
      [{ text: '    steps:', color: FGMUTE }],
      [{ text: '      - timeout-minutes: 5   # por step também', color: GRN }],
      [{ text: '        run: npm run test:e2e', color: GRN }],
    ],
    why: 'Sem timeout, um teste com sleep infinito, processo zumbi ou conexão pendurada consome 6h de minutos pagos antes do GitHub matar o job. Configure timeout-minutes razoável no job (15-30 min para CI típico) e em steps específicos que conhecidamente podem travar.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — Runner types (ComparisonTable)
// ═══════════════════════════════════════════════════════════════════════════════

const RUNNER_OPTIONS: ComparisonOption[] = [
  { id: 'github',      label: 'GitHub-hosted',    sublabel: 'ubuntu-latest, etc',      color: C   },
  { id: 'larger',      label: 'Larger runners',   sublabel: '4-32 cores, ARM, GPU',    color: AMB },
  { id: 'self',        label: 'Self-hosted',      sublabel: 'sua VM ou EC2',           color: PRP },
  { id: 'arc',         label: 'ARC (Kubernetes)', sublabel: 'pods efêmeros',           color: GRN },
]

const RUNNER_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'cost',
    label: 'Custo',
    category: 'Operação',
    description: 'Quanto você paga',
    values: {
      github: { rating: 'good',      note: '2000 min grátis / mês em repos privados, $0.008/min Linux' },
      larger: { rating: 'fair',      note: 'De 4 a 16x o preço base — escala com cores' },
      self:   { rating: 'excellent', note: '$0 de minutos — paga só infra (EC2, etc)' },
      arc:    { rating: 'excellent', note: '$0 de minutos — paga K8s cluster' },
    },
  },
  {
    id: 'setup',
    label: 'Setup',
    category: 'Operação',
    description: 'Esforço para começar a usar',
    values: {
      github: { rating: 'excellent', note: 'Zero — runs-on: ubuntu-latest' },
      larger: { rating: 'excellent', note: 'Pago por org, runs-on: ubuntu-latest-16-cores' },
      self:   { rating: 'fair',      note: 'Instalar runner em VM, registrar, manter' },
      arc:    { rating: 'poor',      note: 'Helm chart, K8s cluster, configurar autoscaling' },
    },
  },
  {
    id: 'security',
    label: 'Segurança em PRs externos',
    category: 'Segurança',
    description: 'Risco de RCE com PRs de fork',
    values: {
      github: { rating: 'excellent', note: 'VM efêmera, sem rede interna, sem secrets em fork PRs' },
      larger: { rating: 'excellent', note: 'Mesmas garantias do GitHub-hosted' },
      self:   { rating: 'poor',      note: 'PR de fork em runner persistente = RCE' },
      arc:    { rating: 'good',      note: 'Pods efêmeros, mas em sua rede — risco médio' },
    },
  },
  {
    id: 'performance',
    label: 'Performance bruta',
    category: 'Performance',
    description: 'CPU, RAM, disk I/O',
    values: {
      github: { rating: 'fair',      note: '4 cores, 16 GB RAM (Linux ubuntu-latest)' },
      larger: { rating: 'excellent', note: '4 a 96 cores, até 384 GB RAM' },
      self:   { rating: 'excellent', note: 'Limitado pela máquina física que você escolher' },
      arc:    { rating: 'excellent', note: 'Pods configuráveis, escalonamento automático' },
    },
  },
  {
    id: 'network',
    label: 'Acesso à rede privada',
    category: 'Capacidade',
    description: 'Pode acessar VPC, banco interno, etc',
    values: {
      github: { rating: 'poor',      note: 'IPs públicos GitHub — não acessa rede privada' },
      larger: { rating: 'fair',      note: 'IPs ranges fixos — pode whitelist na firewall' },
      self:   { rating: 'excellent', note: 'Roda dentro da sua VPC — acesso total' },
      arc:    { rating: 'excellent', note: 'Dentro do cluster K8s — qualquer service' },
    },
  },
  {
    id: 'tooling',
    label: 'Toolchain pré-instalada',
    category: 'Capacidade',
    description: 'O que vem por padrão',
    values: {
      github: { rating: 'excellent', note: 'Node, Python, Go, Java, Docker, ferramentas dev comuns' },
      larger: { rating: 'excellent', note: 'Mesma imagem do GitHub-hosted' },
      self:   { rating: 'fair',      note: 'O que você instalar — manutenção sua' },
      arc:    { rating: 'good',      note: 'Imagens customizadas — você controla' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 7 — Jornada do iniciante ao sênior (ProgressionMap)
// ═══════════════════════════════════════════════════════════════════════════════

const GA_LEVELS: ProgressionLevel[] = [
  {
    id: 'iniciante',
    name: 'Iniciante',
    label: 'Primeiros workflows',
    emoji: 'IN',
    concepts: [
      { name: 'on: push / pull_request',          tip: 'Os triggers mais comuns — disparam em código' },
      { name: 'jobs e steps',                      tip: 'Job tem N steps sequenciais; jobs rodam paralelos' },
      { name: 'uses: actions/checkout',            tip: 'Sempre o primeiro step — clona o repo no runner' },
      { name: 'uses: actions/setup-node',          tip: 'Instala Node + cache integrado de npm' },
      { name: 'run: comandos shell',               tip: 'Executa shell no runner — bash por padrão no Linux' },
      { name: 'GitHub Actions UI',                 tip: 'Aba Actions do repo — ver runs, logs, re-run jobs' },
    ],
  },
  {
    id: 'pleno',
    name: 'Pleno',
    label: 'Pipelines de produção',
    emoji: 'PL',
    concepts: [
      { name: 'permissions explícitas',            tip: 'contents: read no topo, adiciona específicas por job' },
      { name: 'cache de dependências',             tip: 'cache: npm no setup-node ou actions/cache com hashFiles' },
      { name: 'strategy.matrix',                   tip: 'Testar em múltiplas versões/SOs em paralelo' },
      { name: 'needs: [job1, job2]',               tip: 'Cria DAG de dependências entre jobs' },
      { name: 'concurrency + cancel-in-progress', tip: 'Cancela run anterior do mesmo PR em novo push' },
      { name: 'environments',                      tip: 'Aprovação manual e secrets escopados para deploy' },
      { name: 'composite actions',                 tip: 'Encapsula sequência de steps reutilizáveis' },
      { name: 'outputs entre steps e jobs',        tip: '$GITHUB_OUTPUT + needs.JOB.outputs.NAME' },
    ],
  },
  {
    id: 'senior',
    name: 'Sênior',
    label: 'Arquitetura e segurança',
    emoji: 'SR',
    concepts: [
      { name: 'OIDC para AWS/GCP/Azure',           tip: 'Sem long-lived secrets — JWT temporário com trust policy' },
      { name: 'reusable workflows',                tip: 'Pipeline inteiro chamável por workflow_call' },
      { name: 'matrix dinâmica via fromJson',      tip: 'Job 1 produz JSON, job 2 usa como matrix' },
      { name: 'paths-filter para monorepo',        tip: 'Detecta quais serviços mudaram, roda só os afetados' },
      { name: 'pin de actions por SHA',            tip: 'Imutabilidade — protege contra ataques de supply chain' },
      { name: 'pattern seguro PR de fork',         tip: 'Dois workflows: um sem secrets executa, outro com secrets processa' },
      { name: 'ARC para self-hosted em K8s',       tip: 'Pods efêmeros por job — sem persistência de estado' },
      { name: 'semantic-release automation',       tip: 'Conventional commits → release + changelog + publish' },
      { name: 'rollback automático',               tip: 'Smoke test após deploy + step de rollback com if: failure()' },
      { name: 'required workflows na org',         tip: 'GitHub Enterprise força pipeline padrão em todos repos' },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// Componente principal
// ═══════════════════════════════════════════════════════════════════════════════

export default function GithubActionsVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'anatomy',
      title: 'Anatomia do workflow',
      subtitle: 'Evento → Workflow → Jobs (paralelos) → Steps (sequenciais) → Runner',
      accent: C,
      component: (
        <LayerStack
          layers={ANATOMY_LAYERS}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'action-types',
      title: 'Tipos de Action',
      subtitle: 'Composite vs JS vs Docker vs Reusable — qual usar quando',
      accent: AMB,
      component: (
        <ComparisonTable
          options={ACTION_OPTIONS}
          criteria={ACTION_CRITERIA}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'oidc-flow',
      title: 'Fluxo OIDC com AWS',
      subtitle: 'Autenticação sem long-lived secrets — JWT temporário validado pelo STS',
      accent: SEC,
      component: (
        <SequenceDiagram
          actors={OIDC_ACTORS}
          messages={OIDC_MESSAGES}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'cache-strategy',
      title: 'Estratégia de cache',
      subtitle: 'Decidir o cache certo para dependências, build e Docker layers',
      accent: SKY,
      component: (
        <DecisionTree
          root={CACHE_ROOT}
          nodes={CACHE_NODES}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'runners',
      title: 'Tipos de runner',
      subtitle: 'GitHub-hosted vs Larger vs Self-hosted vs ARC — trade-offs reais',
      accent: PRP,
      component: (
        <ComparisonTable
          options={RUNNER_OPTIONS}
          criteria={RUNNER_CRITERIA}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'security-antipatterns',
      title: 'Anti-patterns de segurança',
      subtitle: 'Os 5 erros mais perigosos — pin SHA, pull_request_target, permissions, secrets, timeout',
      accent: RED,
      component: (
        <AntiPatternsGallery
          patterns={SECURITY_ANTIPATTERNS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'progression',
      title: 'Jornada — iniciante ao sênior',
      subtitle: 'Os conceitos por nível de senioridade',
      accent: GRN,
      component: (
        <ProgressionMap
          levels={GA_LEVELS}
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
