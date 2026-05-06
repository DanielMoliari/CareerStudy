'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { StateMachineExplorer } from '@/components/visuals/StateMachineExplorer'
import type { SMState, SMTransition } from '@/components/visuals/StateMachineExplorer'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'
import { HookTimeline } from '@/components/visuals/HookTimeline'
import type { TimelinePhase } from '@/components/visuals/HookTimeline'
import { SequenceDiagram } from '@/components/visuals/SequenceDiagram'
import type { SeqActor, SeqMessage } from '@/components/visuals/SequenceDiagram'
import { CodeStepper } from '@/components/visuals/CodeStepper'
import type { CodeStepperScenario } from '@/components/visuals/CodeStepper'

// ── Paleta Docker ─────────────────────────────────────────────────────────────
const C      = '#2496ED'   // Docker blue
const SEC    = '#1778c4'   // secondary
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#4ade80'
const RED    = '#ef4444'
const AMB    = '#f59e0b'
const PRP    = '#a78bfa'
const SKY    = '#38bdf8'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Ciclo de vida de um container
// ═══════════════════════════════════════════════════════════════════════════════

const CONTAINER_STATES: SMState[] = [
  { id: 'created',   label: 'created',   description: 'Container criado mas não iniciado. Filesystem e configurações prontos, processo ainda não foi iniciado.', color: FGMUTE, isInitial: true },
  { id: 'running',   label: 'running',   description: 'Processo principal (PID 1) está rodando. Consome CPU e memória conforme cgroups limits configurados.', color: GRN },
  { id: 'paused',    label: 'paused',    description: 'Processo congelado via SIGSTOP. Continua consumindo memória mas não CPU. Útil para snapshots de estado.', color: AMB },
  { id: 'stopped',   label: 'stopped',   description: 'Processo encerrou (SIGTERM → SIGKILL após timeout). Filesystem preservado. Pode ser reiniciado com docker start.', color: RED },
  { id: 'removed',   label: 'removed',   description: 'Container e sua writable layer deletados permanentemente. Dados não salvos em volume são perdidos.', color: '#6b7280', isFinal: true },
]

const CONTAINER_TRANSITIONS: SMTransition[] = [
  { from: 'created', to: 'running', event: 'docker start',   code: 'docker start <id>' },
  { from: 'running', to: 'paused',  event: 'docker pause',   code: 'docker pause <id>' },
  { from: 'paused',  to: 'running', event: 'docker unpause', code: 'docker unpause <id>' },
  { from: 'running', to: 'stopped', event: 'docker stop',    code: 'docker stop --time=30 <id>', guard: 'SIGTERM → wait → SIGKILL' },
  { from: 'stopped', to: 'running', event: 'docker start',   code: 'docker start <id>' },
  { from: 'running', to: 'removed', event: 'docker rm -f',   code: 'docker rm -f <id>', guard: 'SIGKILL imediato' },
  { from: 'stopped', to: 'removed', event: 'docker rm',      code: 'docker rm <id>' },
  { from: 'created', to: 'removed', event: 'docker rm',      code: 'docker rm <id>' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Stack de abstração Docker (camadas de arquitetura)
// ═══════════════════════════════════════════════════════════════════════════════

const DOCKER_LAYERS: Layer[] = [
  {
    id: 'cli',
    label: 'CLI / SDK / Compose',
    sublabel: 'Interface do usuário',
    description: 'Ponto de entrada do desenvolvedor. A CLI converte comandos em chamadas REST para o daemon via socket Unix (/var/run/docker.sock). O Docker Compose orquestra múltiplos serviços a partir de um YAML.',
    code: 'docker build / run / compose up',
    color: C,
    icon: '🖥️',
    examples: ['docker CLI', 'Docker SDK (Go, Python)', 'Docker Compose', 'Portainer'],
  },
  {
    id: 'daemon',
    label: 'dockerd (Docker Daemon)',
    sublabel: 'API REST + gerenciamento',
    description: 'Processo de longa duração que expõe API REST. Gerencia o ciclo de vida de containers, imagens, redes e volumes. Em produção: o socket do daemon equivale a root no host — proteja-o.',
    code: '/var/run/docker.sock',
    color: SEC,
    icon: '⚙️',
    examples: ['REST API', 'Image store', 'Network manager', 'Volume manager'],
  },
  {
    id: 'containerd',
    label: 'containerd',
    sublabel: 'Runtime de alto nível (CRI)',
    description: 'Runtime que gerencia o ciclo de vida de containers independente do dockerd. Implementa a CRI (Container Runtime Interface) — o Kubernetes fala diretamente com containerd via CRI, sem o Docker daemon. Gerencia pulls de imagem, snapshots de filesystem e execução de containers.',
    code: 'containerd.sock',
    color: SKY,
    icon: '📦',
    examples: ['CRI (Kubernetes)', 'Snapshotter (overlayfs)', 'Image pull/push', 'containerd-shim'],
  },
  {
    id: 'runc',
    label: 'runc (OCI Runtime)',
    sublabel: 'Runtime de baixo nível',
    description: 'Implementação de referência da OCI Runtime Spec. Cria e inicia containers diretamente com chamadas ao kernel Linux: configura namespaces, cgroups, seccomp e monta o filesystem. É um binário que roda e termina — não é um daemon.',
    code: 'runc create / start / kill',
    color: GRN,
    icon: '🔧',
    examples: ['namespaces (PID, NET, MNT, UTS)', 'cgroups (CPU, memória)', 'seccomp (syscall filter)', 'AppArmor/SELinux'],
  },
  {
    id: 'kernel',
    label: 'Kernel Linux',
    sublabel: 'Compartilhado por todos os containers',
    description: 'Todos os containers compartilham o mesmo kernel do host. Não há virtualização de hardware — namespaces e cgroups são primitivas do kernel. Se o kernel cair, todos os containers caem. Para isolamento mais forte: gVisor (kernel em userspace) ou Kata Containers (VM por container).',
    code: 'namespaces + cgroups + overlayfs',
    color: RED,
    icon: '🐧',
    examples: ['OverlayFS (layers)', 'Netfilter/iptables (rede)', 'cgroups v2', 'Linux namespaces'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — VM vs Container vs Bare Metal
// ═══════════════════════════════════════════════════════════════════════════════

const COMP_OPTIONS: ComparisonOption[] = [
  { id: 'container', label: 'Container Docker', sublabel: 'namespaces + cgroups',  color: C },
  { id: 'vm',        label: 'VM (Hypervisor)',  sublabel: 'kernel isolado',        color: AMB },
  { id: 'baremetal', label: 'Bare Metal',       sublabel: 'sem virtualização',     color: GRN },
]

const COMP_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'boot',
    label: 'Tempo de boot',
    category: 'Performance',
    description: 'Quanto tempo leva para o ambiente estar disponível',
    values: {
      container: { rating: 'excellent', note: 'Milissegundos — processo Unix' },
      vm:        { rating: 'fair',      note: 'Segundos a minutos — boot de SO' },
      baremetal: { rating: 'poor',      note: 'Minutos — boot completo' },
    },
  },
  {
    id: 'isolation',
    label: 'Isolamento',
    category: 'Segurança',
    description: 'Grau de separação entre instâncias',
    values: {
      container: { rating: 'good',      note: 'Namespaces — kernel compartilhado' },
      vm:        { rating: 'excellent', note: 'Kernel separado por hypervisor' },
      baremetal: { rating: 'na',        note: 'Sem isolamento entre processos' },
    },
  },
  {
    id: 'density',
    label: 'Densidade',
    category: 'Performance',
    description: 'Quantas instâncias por host físico',
    values: {
      container: { rating: 'excellent', note: '100+ por host é comum' },
      vm:        { rating: 'fair',      note: 'Dezenas — overhead de SO' },
      baremetal: { rating: 'poor',      note: '1 — sem compartilhamento' },
    },
  },
  {
    id: 'overhead',
    label: 'Overhead de recursos',
    category: 'Performance',
    description: 'Recursos consumidos pela virtualização em si',
    values: {
      container: { rating: 'excellent', note: 'Quase zero — só o processo' },
      vm:        { rating: 'fair',      note: 'SO convidado + hypervisor' },
      baremetal: { rating: 'excellent', note: 'Zero — acesso direto ao hardware' },
    },
  },
  {
    id: 'imagesize',
    label: 'Tamanho da imagem',
    category: 'Operação',
    description: 'Espaço necessário por instância',
    values: {
      container: { rating: 'excellent', note: 'MB — só filesystem da app' },
      vm:        { rating: 'poor',      note: 'GB — SO completo' },
      baremetal: { rating: 'na',        note: 'N/A — sem imagem portável' },
    },
  },
  {
    id: 'portability',
    label: 'Portabilidade',
    category: 'Operação',
    description: 'Facilidade de mover entre ambientes',
    values: {
      container: { rating: 'excellent', note: 'OCI image roda em qualquer host' },
      vm:        { rating: 'good',      note: 'OVF/VMDK — menos universal' },
      baremetal: { rating: 'poor',      note: 'Preso ao hardware físico' },
    },
  },
  {
    id: 'security_multitenant',
    label: 'Multi-tenant seguro',
    category: 'Segurança',
    description: 'Adequado para rodar código de múltiplos clientes no mesmo host',
    values: {
      container: { rating: 'fair',      note: 'Kernel compartilhado — risco de escape' },
      vm:        { rating: 'excellent', note: 'Kernel separado — isolamento forte' },
      baremetal: { rating: 'poor',      note: 'Sem isolamento' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Dockerfile passo a passo (CodeStepper)
// ═══════════════════════════════════════════════════════════════════════════════

const DOCKERFILE_SCENARIO: CodeStepperScenario = {
  id: 'dockerfile-nodejs',
  label: 'Node.js — build otimizado',
  language: 'dockerfile',
  code: `# syntax=docker/dockerfile:1.6
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \\
  npm ci --only=production

FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runtime
RUN addgroup -S app && adduser -S app -G app
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
USER app
EXPOSE 3000
HEALTHCHECK CMD wget -qO- http://localhost:3000/health || exit 1
ENTRYPOINT ["node", "dist/server.js"]`,
  steps: [
    {
      lineStart: 1,
      lineEnd: 1,
      title: 'Habilitar sintaxe BuildKit 1.6',
      explanation: 'O comentário # syntax= ativa o frontend BuildKit mais recente. Desbloqueia --mount=type=cache, --mount=type=secret e builds paralelos. Deve ser a primeira linha.',
      output: 'BuildKit engine ativado',
    },
    {
      lineStart: 2,
      lineEnd: 5,
      title: 'Stage "deps" — instalar dependências de produção',
      explanation: 'Primeiro stage copia APENAS o manifesto (package*.json). O BuildKit cache mount persiste o cache do npm entre builds sem criar uma layer. Se package.json não mudar, este step é instantâneo no próximo build.',
      memory: { 'cache npm': '/root/.npm (persistente entre builds)', 'layers criadas': '2 (base + npm ci)' },
    },
    {
      lineStart: 7,
      lineEnd: 12,
      title: 'Stage "build" — compilar o projeto',
      explanation: 'Stage separado com devDependencies (TypeScript, bundler). Copia código-fonte e compila. Qualquer mudança de código invalida só a partir do COPY . . — as layers anteriores (deps) ficam no cache.',
      memory: { 'dist/': 'artefato compilado', 'node_modules': 'inclui devDeps (temporário)' },
    },
    {
      lineStart: 14,
      lineEnd: 16,
      title: 'Stage "runtime" — criar usuário não-root',
      explanation: 'Stage final começa com base limpa. Criamos um grupo e usuário sem shell (adduser -S). Nunca rode como root — se houver escape de namespace, o processo terá root no host.',
      memory: { 'USER': 'app (não root)', 'GID/UID': 'definido pelo SO (numérico)' },
    },
    {
      lineStart: 17,
      lineEnd: 19,
      title: 'Copiar artefatos dos stages anteriores',
      explanation: 'COPY --from=deps copia só as prod deps. COPY --from=build copia só o dist/. O stage de build com devDeps é descartado — não aparece na imagem final. Isso é o coração do multi-stage.',
      output: 'Imagem final: base alpine + prod deps + dist/ (sem devDeps, sem código fonte)',
    },
    {
      lineStart: 20,
      lineEnd: 23,
      title: 'Segurança e observabilidade',
      explanation: 'USER app: muda para usuário não-root antes de qualquer coisa. EXPOSE documenta (não abre porta). HEALTHCHECK permite que orquestradores (Compose, K8s) saibam se o processo está saudável. ENTRYPOINT em exec form garante PID 1 correto e recebe SIGTERM.',
      output: 'Imagem pronta: ~120 MB (vs ~1 GB sem multi-stage)',
      memory: { 'tamanho': '~120 MB', 'user': 'app (não root)', 'PID 1': 'node (recebe SIGTERM)' },
    },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — Redes Docker (LayerStack horizontal via cards custom)
// ═══════════════════════════════════════════════════════════════════════════════

const NETWORK_LAYERS: Layer[] = [
  {
    id: 'bridge',
    label: 'bridge (user-defined)',
    sublabel: 'Padrão recomendado — Compose',
    description: 'Rede virtual isolada com DNS interno (127.0.0.11). Containers se enxergam pelo nome do serviço. NAT via iptables para tráfego externo. Diferente da bridge padrão (docker0): a user-defined tem DNS por nome.',
    code: 'docker network create mynet\ndocker run --network mynet api\n# api e db se comunicam: db:5432',
    color: C,
    icon: '🌉',
    examples: ['Docker Compose (padrão)', 'Microservices isolados', 'DNS por nome de serviço'],
  },
  {
    id: 'host',
    label: 'host',
    sublabel: 'Sem isolamento de rede — máxima performance',
    description: 'Container compartilha a pilha de rede do host diretamente. Sem NAT, sem namespace de rede. Porta do container é porta do host. Máxima performance mas mínimo isolamento.',
    code: 'docker run --network host prometheus-exporter\n# expõe a porta 9090 diretamente no host',
    color: RED,
    icon: '🏠',
    examples: ['Prometheus node-exporter', 'Ferramentas de monitoring', 'Alta performance de rede'],
  },
  {
    id: 'overlay',
    label: 'overlay',
    sublabel: 'Multi-host — Docker Swarm / Kubernetes CNI',
    description: 'Conecta containers em hosts físicos diferentes via encapsulamento VXLAN. Containers se enxergam por nome mesmo em máquinas distintas. Em K8s, implementado pelo CNI plugin (Calico, Flannel, Cilium).',
    code: 'docker network create --driver overlay myswarm\n# containers em Host A e B comunicam-se por nome',
    color: GRN,
    icon: '🌐',
    examples: ['Docker Swarm', 'Kubernetes (CNI)', 'Calico / Cilium / Flannel'],
  },
  {
    id: 'none',
    label: 'none',
    sublabel: 'Sem rede — isolamento total',
    description: 'Remove toda interface de rede do container. Só tem loopback (127.0.0.1). Usado para processos batch que não precisam de rede e para segurança máxima.',
    code: 'docker run --network none meu-processo-batch\n# sem interface de rede — só loopback',
    color: FGMUTE,
    icon: '🔒',
    examples: ['Processamento batch isolado', 'Análise de malware', 'Compilação sem rede'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — Docker Compose multi-serviço (SequenceDiagram)
// ═══════════════════════════════════════════════════════════════════════════════

const SEQ_ACTORS: SeqActor[] = [
  { id: 'cli',     label: 'docker compose up', color: C },
  { id: 'compose', label: 'Compose Engine',    color: SEC },
  { id: 'db',      label: 'db (postgres)',      color: AMB },
  { id: 'cache',   label: 'cache (redis)',      color: RED },
  { id: 'api',     label: 'api (node)',         color: GRN },
]

const SEQ_MESSAGES: SeqMessage[] = [
  { from: 'cli',     to: 'compose', label: 'parse compose.yaml',                      type: 'sync' },
  { from: 'compose', to: 'compose', label: 'resolve depends_on graph',                type: 'sync', note: 'db e cache antes da api' },
  { from: 'compose', to: 'db',      label: 'docker create + start',                   type: 'async' },
  { from: 'compose', to: 'cache',   label: 'docker create + start',                   type: 'async' },
  { from: 'db',      to: 'compose', label: 'healthcheck: pg_isready → healthy',       type: 'return', note: 'interval: 5s, retries: 5' },
  { from: 'cache',   to: 'compose', label: 'healthcheck: redis-cli ping → healthy',   type: 'return' },
  { from: 'compose', to: 'api',     label: 'docker create + start',                   type: 'async', note: 'só após db e cache healthy' },
  { from: 'api',     to: 'db',      label: 'DATABASE_URL: postgres://db:5432/mydb',   type: 'sync', note: 'DNS interno resolve "db"' },
  { from: 'api',     to: 'cache',   label: 'REDIS_URL: redis://cache:6379',           type: 'sync' },
  { from: 'api',     to: 'compose', label: 'healthcheck: GET /health → 200',          type: 'return' },
  { from: 'compose', to: 'cli',     label: 'all services healthy ✓',                  type: 'return' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 7 — Anti-patterns do Docker
// ═══════════════════════════════════════════════════════════════════════════════

const DOCKER_ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'Rodar como root no container',
    wrong: [
      [{ text: 'FROM node:20-alpine', color: FGMUTE }],
      [{ text: 'WORKDIR /app', color: FGMUTE }],
      [{ text: 'COPY . .', color: FGMUTE }],
      [{ text: '# sem USER — roda como root!', color: RED }],
      [{ text: 'CMD ["node", "server.js"]', color: FGMUTE }],
    ],
    right: [
      [{ text: 'FROM node:20-alpine', color: FGMUTE }],
      [{ text: 'RUN addgroup -S app && adduser -S app -G app', color: GRN }],
      [{ text: 'WORKDIR /app', color: FGMUTE }],
      [{ text: 'COPY --chown=app:app . .', color: GRN }],
      [{ text: 'USER app', color: GRN }],
      [{ text: 'CMD ["node", "server.js"]', color: FGMUTE }],
    ],
    why: 'Root dentro do container = root no host se houver escape de namespace (vulnerabilidade de kernel). USER com UID numérico é obrigatório em produção.',
  },
  {
    title: 'Segredo em ENV ou ARG — vaza na layer',
    wrong: [
      [{ text: '# ERRADO — fica gravado para sempre em docker history', color: RED }],
      [{ text: 'ENV NPM_TOKEN=ghp_abc123secret', color: RED }],
      [{ text: 'ARG NPM_TOKEN', color: RED }],
      [{ text: 'RUN npm install', color: FGMUTE }],
    ],
    right: [
      [{ text: '# BuildKit secret mount — zero rastro em layers', color: GRN }],
      [{ text: 'RUN --mount=type=secret,id=npmrc \\', color: GRN }],
      [{ text: '    cp /run/secrets/npmrc ~/.npmrc && npm ci', color: GRN }],
      [{ text: '# Build:', color: FGMUTE }],
      [{ text: 'docker build --secret id=npmrc,src=$HOME/.npmrc .', color: GRN }],
    ],
    why: 'ENV e ARG ficam gravados no layer history para sempre. Qualquer um com acesso à imagem extrai o token com "docker history --no-trunc".',
  },
  {
    title: 'COPY . . antes de instalar dependências',
    wrong: [
      [{ text: 'COPY . .', color: RED }, { text: '           # código muda todo commit', color: '#6b7280' }],
      [{ text: 'RUN npm install', color: RED }, { text: '  # rebuilda SEMPRE', color: '#6b7280' }],
    ],
    right: [
      [{ text: 'COPY package*.json ./', color: GRN }, { text: '  # só manifesto', color: '#6b7280' }],
      [{ text: 'RUN npm ci', color: GRN }, { text: '             # cacheado até pkg mudar', color: '#6b7280' }],
      [{ text: 'COPY . .', color: GRN }, { text: '              # código por último', color: '#6b7280' }],
    ],
    why: 'COPY . . invalida todas as layers seguintes a cada mudança de código. Com a ordem correta, npm ci roda apenas quando package.json mudar — economiza 3-5 min por build em CI.',
  },
  {
    title: 'Tag "latest" em produção',
    wrong: [
      [{ text: 'FROM node:latest', color: RED }, { text: '   # muda sem aviso!', color: '#6b7280' }],
      [{ text: 'image: minha-app:latest', color: RED }, { text: '  # no compose', color: '#6b7280' }],
    ],
    right: [
      [{ text: 'FROM node:20.11.1-alpine3.19', color: GRN }, { text: '  # versão fixada', color: '#6b7280' }],
      [{ text: '# Ou melhor ainda — por digest imutável:', color: FGMUTE }],
      [{ text: 'FROM node:20-alpine@sha256:abc123...', color: GRN }],
      [{ text: 'image: minha-app:1.4.2', color: GRN }, { text: '  # semver no compose', color: '#6b7280' }],
    ],
    why: '"latest" não é reproduzível — o mantenedor pode publicar uma versão com regressão ou vulnerabilidade. Em CI/CD, pin por digest + Dependabot para atualizações controladas.',
  },
  {
    title: 'PID 1 sem tratamento de signals (forma shell)',
    wrong: [
      [{ text: '# ERRADO — shell como PID 1, não repassa SIGTERM', color: RED }],
      [{ text: 'CMD node server.js', color: RED }, { text: '  # forma shell', color: '#6b7280' }],
    ],
    right: [
      [{ text: '# Forma exec — processo recebe SIGTERM diretamente', color: GRN }],
      [{ text: 'ENTRYPOINT ["node", "server.js"]', color: GRN }, { text: '  # PID 1 = node', color: '#6b7280' }],
      [{ text: '# Ou com tini para reaping de zumbis:', color: FGMUTE }],
      [{ text: 'RUN apk add --no-cache tini', color: GRN }],
      [{ text: 'ENTRYPOINT ["/sbin/tini", "--", "node", "server.js"]', color: GRN }],
    ],
    why: 'A forma shell cria /bin/sh como PID 1. O shell geralmente ignora SIGTERM e não repassa ao processo filho — graceful shutdown quebra silenciosamente.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 8 — Ciclo de vida da imagem (HookTimeline)
// ═══════════════════════════════════════════════════════════════════════════════

const IMAGE_PHASES: TimelinePhase[] = [
  {
    id: 'write',
    emoji: '✍️',
    name: 'Dockerfile',
    color: C,
    short: 'Escrever',
    detail: 'O Dockerfile descreve como construir a imagem. Cada instrução vira uma layer. A ordem importa: coloque o que muda menos primeiro para maximizar o cache.',
    code: [
      [{ text: 'FROM', color: C }, { text: ' node:20-alpine', color: FG }],
      [{ text: 'COPY', color: C }, { text: ' package*.json ./', color: FG }],
      [{ text: 'RUN', color: C }, { text: ' npm ci', color: FG }],
      [{ text: 'COPY', color: C }, { text: ' . .', color: FG }],
      [{ text: 'CMD', color: C }, { text: ' ["node", "server.js"]', color: FG }],
    ],
  },
  {
    id: 'build',
    emoji: '🔨',
    name: 'docker build',
    color: AMB,
    short: 'Construir',
    detail: 'BuildKit processa o Dockerfile, executa cada instrução e cria layers. Cache é reutilizado quando o hash da instrução + contexto não mudou. Multi-stage descarta stages intermediários.',
    code: [
      [{ text: 'docker build', color: AMB }, { text: ' -t minha-app:1.0 .', color: FG }],
      [{ text: '# BuildKit paralelize stages independentes', color: FGMUTE }],
      [{ text: '# Cache hit:', color: FGMUTE }, { text: ' CACHED [2/5] RUN npm ci', color: GRN }],
    ],
  },
  {
    id: 'push',
    emoji: '📤',
    name: 'docker push',
    color: PRP,
    short: 'Publicar',
    detail: 'A imagem é enviada ao registry (Docker Hub, ECR, GCR, GHCR). Apenas as layers que não existem no registry são enviadas — layers compartilhadas são reutilizadas automaticamente.',
    code: [
      [{ text: 'docker tag', color: PRP }, { text: ' minha-app:1.0 org/minha-app:1.0', color: FG }],
      [{ text: 'docker push', color: PRP }, { text: ' org/minha-app:1.0', color: FG }],
      [{ text: '# Layers já no registry: LAYER ALREADY EXISTS', color: FGMUTE }],
    ],
  },
  {
    id: 'pull',
    emoji: '📥',
    name: 'docker pull',
    color: SKY,
    short: 'Baixar',
    detail: 'O runtime (containerd) baixa as layers que ainda não estão no host. Layers compartilhadas entre imagens são baixadas uma única vez. Em K8s, imagePullPolicy controla quando o pull acontece.',
    code: [
      [{ text: 'docker pull', color: SKY }, { text: ' org/minha-app:1.0', color: FG }],
      [{ text: '# Layers locais: Pull complete / Already exists', color: FGMUTE }],
      [{ text: '# K8s: imagePullPolicy: IfNotPresent', color: FGMUTE }],
    ],
  },
  {
    id: 'run',
    emoji: '🚀',
    name: 'docker run',
    color: GRN,
    short: 'Executar',
    detail: 'O containerd cria um snapshot do filesystem (layers da imagem + writable layer). O runc configura namespaces e cgroups e inicia o processo. O container está running.',
    code: [
      [{ text: 'docker run', color: GRN }, { text: ' -d -p 3000:3000 org/minha-app:1.0', color: FG }],
      [{ text: '# containerd:', color: FGMUTE }, { text: ' snapshot + runc create', color: GRN }],
      [{ text: '# runc:', color: FGMUTE }, { text: ' namespaces + cgroups + PID 1', color: GRN }],
    ],
  },
  {
    id: 'scan',
    emoji: '🔍',
    name: 'Security Scan',
    color: RED,
    short: 'Escanear',
    detail: 'trivy ou grype escaneiam a imagem em busca de CVEs em OS packages e dependências de linguagem. O SBOM (syft) documenta todos os componentes para compliance e rastreabilidade.',
    code: [
      [{ text: 'trivy image', color: RED }, { text: ' --exit-code 1 --severity CRITICAL org/minha-app:1.0', color: FG }],
      [{ text: 'syft', color: RED }, { text: ' org/minha-app:1.0 -o spdx-json > sbom.json', color: FG }],
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export default function DockerVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'container-lifecycle',
      title: 'Ciclo de vida do container',
      subtitle: 'Estados e transições: created → running → paused → stopped → removed',
      accent: C,
      component: (
        <StateMachineExplorer
          states={CONTAINER_STATES}
          transitions={CONTAINER_TRANSITIONS}
          initialState="created"
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'docker-stack',
      title: 'Stack de abstração Docker',
      subtitle: 'CLI → dockerd → containerd → runc → kernel Linux',
      accent: SEC,
      component: (
        <LayerStack
          layers={DOCKER_LAYERS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'vm-vs-container',
      title: 'Container vs VM vs Bare Metal',
      subtitle: 'Comparação por isolamento, performance e portabilidade',
      accent: AMB,
      component: (
        <ComparisonTable
          options={COMP_OPTIONS}
          criteria={COMP_CRITERIA}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'dockerfile-stepper',
      title: 'Dockerfile passo a passo',
      subtitle: 'Multi-stage Node.js — cache inteligente, non-root, healthcheck',
      accent: GRN,
      component: (
        <CodeStepper
          scenarios={[DOCKERFILE_SCENARIO]}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'docker-networks',
      title: 'Modos de rede Docker',
      subtitle: 'bridge (DNS), host (sem NAT), overlay (multi-host), none',
      accent: SKY,
      component: (
        <LayerStack
          layers={NETWORK_LAYERS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'compose-sequence',
      title: 'Docker Compose — orquestração multi-serviço',
      subtitle: 'Healthchecks, depends_on e DNS interno passo a passo',
      accent: GRN,
      component: (
        <SequenceDiagram
          actors={SEQ_ACTORS}
          messages={SEQ_MESSAGES}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'antipatterns',
      title: 'Anti-patterns do Docker',
      subtitle: 'Root, secrets em ENV, ordem de COPY, latest, PID 1 sem signals',
      accent: RED,
      component: (
        <AntiPatternsGallery
          patterns={DOCKER_ANTIPATTERNS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'image-lifecycle',
      title: 'Ciclo de vida da imagem',
      subtitle: 'Dockerfile → build → push → pull → run → scan',
      accent: PRP,
      component: (
        <HookTimeline
          phases={IMAGE_PHASES}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
  ]

  // suppress unused warnings
  void LINE; void FG; void FGMUTE; void PRP; void SKY; void AMB; void RED; void GRN; void SEC

  return (
    <VisuaisShell
      visuals={visuals}
      active={active}
      onChange={setActive}
    />
  )
}
