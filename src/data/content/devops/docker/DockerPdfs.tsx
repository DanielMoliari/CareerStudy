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
import { buildAntipatternsPdf } from '@/components/pdfs/AntipatternsPdf'
import type { AntiPatternItem } from '@/components/pdfs/AntipatternsPdf'
import { buildQuickRefPdf } from '@/components/pdfs/QuickRefPdf'
import type { QuickRefColumn } from '@/components/pdfs/QuickRefPdf'

// ── Paleta Docker ─────────────────────────────────────────────────────────────
const C = '#2496ED'

// ── Metadados dos PDFs ────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas em entrevista',
    type: 'qa',
    pages: 8,
    description: 'Recuperação ativa: 20 perguntas de Docker — namespaces, cgroups, overlay2, multi-stage, secrets, PID 1, healthcheck, redes, distroless e rootless. Nível pleno e sênior, com dica de apresentação para cada resposta.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet',
    subtitle: 'Todos os comandos + Dockerfile + Compose numa página',
    type: 'cheatsheet',
    pages: 3,
    description: 'Referência densa: comandos docker run/build/push/network/volume, instruções Dockerfile com efeitos, BuildKit mounts, Compose keywords e flags mais usadas. Tudo que você precisa consultar rapidamente.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'quick-ref',
    title: 'Quick Ref',
    subtitle: 'Cartão ultra-compacto de comandos Docker',
    type: 'quick-ref',
    pages: 1,
    description: 'A4 landscape com os comandos essenciais em 3 colunas: containers, imagens, redes, volumes e Compose. Para imprimir e deixar na mesa durante estudos.',
    icon: '03',
    goal: 'Referência de bolso',
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns',
    subtitle: 'O que não fazer — e por quê',
    type: 'antipatterns',
    pages: 3,
    description: 'Os 8 anti-patterns mais perigosos: root no container, secrets em ENV, COPY . . antes de deps, latest em produção, PID 1 sem signals, sem .dockerignore, apt sem limpeza e sem HEALTHCHECK.',
    icon: '04',
    goal: 'Reconhecimento de padrão',
  },
]

// ── Dados: Q&A ────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'Qual a diferença entre container e VM?',
    a: 'Container compartilha o kernel do host e isola via namespaces + cgroups. Boot em ms, imagem em MB. VM tem kernel próprio via hypervisor: boot em segundos, imagem em GB. Em produção: container dentro de VM (EKS em EC2).',
    tip: 'Cite namespaces e cgroups pelo nome. Mencione o modelo containers-dentro-de-VMs que é o padrão real.',
  },
  {
    level: 'Pleno',
    q: 'Como você reduziria uma imagem de 2 GB para 200 MB?',
    a: '1. Multi-stage build: toolchain no build, só runtime no final. 2. Base menor: alpine (~65 MB) ou slim. 3. .dockerignore: excluir node_modules, .git, tests. 4. apt: --no-install-recommends + rm -rf /var/lib/apt/lists/*. 5. Combinar RUNs para não criar layers com cache temporário.',
    tip: 'Atacar em ordem de impacto. Multi-stage é geralmente o maior ganho. dive para inspecionar.',
  },
  {
    level: 'Pleno',
    q: 'Como proteger um segredo durante o build?',
    a: 'ENV e ARG ficam gravados no layer history — qualquer um com acesso à imagem extrai com docker history. Use BuildKit --mount=type=secret: o arquivo é montado temporariamente no RUN e não persiste em nenhuma layer. Em runtime: Vault ou Secrets Manager.',
    tip: 'Demonstrar que você sabe que ENV/ARG são inseguros é o diferencial. Mostrar a sintaxe BuildKit.',
  },
  {
    level: 'Pleno',
    q: 'Por que a ordem das instruções no Dockerfile importa?',
    a: 'Docker calcula hash por instrução + contexto. Se o hash bate com build anterior, reutiliza do cache. A primeira instrução que invalida o cache invalida todas as seguintes. Regra: o que muda menos vem primeiro (base → OS → deps → código).',
    tip: 'Explicar o mecanismo de hash diferencia de quem só sabe a regra sem entender o porquê.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre ENTRYPOINT e CMD?',
    a: 'ENTRYPOINT define o processo principal — não é substituído por argumentos no docker run. CMD define os args padrão que SÃO substituíveis. "docker run img arg" substitui CMD, não ENTRYPOINT. Sempre use exec form (array) — a form shell cria um shell como PID 1 que não repassa SIGTERM.',
    tip: 'O gotcha da form shell como PID 1 é a parte que candidatos erram. Demonstre com exemplo.',
  },
  {
    level: 'Pleno',
    q: 'Como debugar um container que reinicia constantemente?',
    a: 'docker ps -a (exit code), docker logs --tail=100 (log da app), docker inspect | jq State (OOMKilled, error). Exit 137 = OOMKill (aumentar --memory). Sem log: docker run --rm -it --entrypoint sh img para inspecionar interativamente.',
    tip: 'Ter um roteiro sequencial de debug demonstra experiência real em produção.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona depends_on com condition: service_healthy?',
    a: 'depends_on simples garante apenas que o container foi iniciado, não que a app está pronta. Com condition: service_healthy, o Compose aguarda o healthcheck retornar exit 0 antes de iniciar o serviço dependente. start_period é crítico: falhas durante esse período não contam como retries.',
    tip: 'Diferenciar "container iniciado" de "app pronta para servir" é o ponto que a maioria erra.',
  },
  {
    level: 'Pleno',
    q: 'Como configurar Docker Compose para produção?',
    a: 'restart: unless-stopped, sem bind mounts (volumes nomeados), sem portas desnecessárias, healthchecks + depends_on condicional, resource limits (deploy.resources.limits), imagens tagueadas por versão, secrets via variáveis injetadas externamente (não .env commitado).',
    tip: 'A lista de diferenças dev vs prod é o que o entrevistador quer. Não é só "adicionar restart".',
  },
  {
    level: 'Senior',
    q: 'O que são namespaces e cgroups?',
    a: 'Namespaces controlam VISIBILIDADE: PID (processo vê só seus filhos), NET (interface própria), MNT (filesystem isolado), UTS (hostname próprio), IPC, USER (mapeamento de UID). Cgroups controlam RECURSOS: cpu.max, memory.limit, blkio. Combinação: isolamento de visibilidade + isolamento de recursos.',
    tip: 'Citar cada namespace pelo nome e diferenciar "visibilidade" de "recursos" mostra domínio do mecanismo.',
  },
  {
    level: 'Senior',
    q: 'Como funciona o copy-on-write do overlay2?',
    a: 'overlay2 monta layers: lower (read-only, imagem) + upper (writable, container) + merged (view unificada). Quando o container escreve em arquivo da lower, o kernel copia o arquivo inteiro para a upper antes de modificar. Layers da imagem nunca são alteradas — múltiplos containers compartilham sem conflito.',
    tip: 'A estrutura lower/upper/merged e explicar por que é eficiente (compartilhamento sem conflito) é o nível sênior.',
  },
  {
    level: 'Senior',
    q: 'O que é o problema do PID 1 e como resolver?',
    a: 'PID 1 tem responsabilidades especiais: receber signals e fazer reaping de zumbis. Runtimes (Node.js, Python) não implementam reaping. Solução: tini como PID 1 (ENTRYPOINT ["/sbin/tini", "--", "node", "server.js"]) ou --init flag. A form exec de ENTRYPOINT faz o processo ser PID 1 direto.',
    tip: 'A parte dos zumbis é o que candidatos não sabem. Mencionar tini e o flag --init.',
  },
  {
    level: 'Senior',
    q: 'O que é distroless e quando usar em vez de alpine?',
    a: 'Alpine usa musl libc — pequeno mas com edge cases em binários compilados para glibc. Distroless: sem shell, sem package manager — só runtime mínimo. Distroless: máxima segurança (sem shell = sem execução arbitrária se comprometido). scratch: binários estáticos Go/Rust.',
    tip: 'A distinção alpine (debugável) vs distroless (seguro) vs scratch (binário puro) é o que qualifica sênior.',
  },
  {
    level: 'Senior',
    q: 'Como funciona a rede bridge e por que a padrão não tem DNS por nome?',
    a: 'Docker cria interface docker0 (172.17.0.1). Cada container recebe veth pair — uma ponta dentro, outra no docker0. NAT via iptables. Bridge PADRÃO (docker0): legada, sem DNS por nome, comunicação só por IP. User-defined bridge: DNS interno em 127.0.0.11 resolve nomes de serviço.',
    tip: 'A diferença entre bridge padrão (sem DNS) e user-defined (com DNS) é o que sempre cai.',
  },
  {
    level: 'Senior',
    q: 'Como fazer security scanning no pipeline CI?',
    a: '1. hadolint: lint do Dockerfile (USER, ADD sem URL, apt). 2. trivy: CVEs em OS packages e deps de linguagem (trivy image --exit-code 1 --severity CRITICAL). 3. Registry scan contínuo: ECR/GCR re-analisam imagens publicadas. 4. SBOM (syft): documenta componentes para compliance.',
    tip: 'A sequência de três camadas (lint → scan → registry) mostra que você pensa em defesa em profundidade.',
  },
  {
    level: 'Senior',
    q: 'Como funciona o buildx e builds multi-arquitetura?',
    a: 'docker buildx usa BuildKit para criar imagens multi-plataforma (manifest list): linux/amd64, linux/arm64 em uma única tag. QEMU emula CPUs diferentes no host. Quando o cliente faz pull, o daemon escolhe automaticamente a arch correta. Graviton (AWS) oferece 40% melhor custo que x86.',
    tip: 'Mencionar manifest list e a escolha automática pelo cliente é o mecanismo que diferencia.',
  },
  {
    level: 'Senior',
    q: 'Como implementar graceful shutdown em um container?',
    a: 'docker stop envia SIGTERM (aguarda --stop-timeout, depois SIGKILL). ENTRYPOINT exec form garante que o processo recebe SIGTERM direto (não via shell). A app deve tratar: process.on("SIGTERM", () => { server.close(); dbPool.end() }). Em K8s: preStop hook para dar tempo ao LB antes do SIGTERM.',
    tip: 'A cadeia completa: SIGTERM → PID 1 recebe → app trata → conexões fecham. O preStop hook K8s para os 502s.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre COPY e ADD?',
    a: 'COPY é simples e previsível — copia arquivos do contexto. ADD tem extras que raramente você quer: extrai tar.gz automaticamente, aceita URLs (não reproduzível, não cacheado corretamente). Regra: sempre use COPY. ADD só para extrair tar + mudar ownership atomicamente.',
    tip: 'O problema de URL com ADD é o que o entrevistador quer ouvir — viola reprodutibilidade.',
  },
  {
    level: 'Senior',
    q: 'O que é container rootless e por que usar?',
    a: 'Rootless Docker: daemon roda completamente no userspace — sem nenhum processo root. Socket comprometido não tem root no host. Limitações: portas abaixo de 1024, overlay2 precisa kernel 5.11+. Em K8s: equivalente é runAsNonRoot + allowPrivilegeEscalation: false.',
    tip: 'Diferenciar rootless (daemon sem root) de apenas USER não-root no container é o ponto que qualifica.',
  },
  {
    level: 'Pleno',
    q: 'O que é HEALTHCHECK e como o orquestrador usa?',
    a: 'HEALTHCHECK define um comando que o daemon executa periodicamente. Estados: starting, healthy, unhealthy. Compose usa em depends_on com condition: service_healthy. K8s usa readiness/liveness probes em vez do HEALTHCHECK do Docker. Container unhealthy continua rodando — o orquestrador decide reiniciar.',
    tip: 'A distinção entre HEALTHCHECK do Docker vs probes do K8s mostra que você sabe ambos os mundos.',
  },
  {
    level: 'Pleno',
    q: 'O que é multi-stage build e qual o principal benefício?',
    a: 'Multi-stage usa múltiplos FROM no mesmo Dockerfile. Stage de build tem compiladores e bundlers. Stage final copia só o artefato e tem apenas o runtime. Imagem cai de 1+ GB para 20-100 MB. O stage intermediário é descartado — não aparece na imagem final. Disponível desde Docker 17.05.',
    tip: 'O ponto chave: o stage intermediário com toolchain não aparece na imagem final — ninguém tem acesso ao código-fonte pelo qual a imagem foi construída.',
  },
]

// ── Dados: Cheatsheet ─────────────────────────────────────────────────────────

const CHEATSHEET_HOOKS: HookItem[] = [
  { name: 'docker run',     sig: '-d -p 8080:3000 -e VAR=val -v nome:/path --rm --init img',     desc: 'Criar e iniciar container' },
  { name: 'docker build',   sig: '-t nome:tag -f Dockerfile.prod --no-cache --target=stage .',   desc: 'Construir imagem a partir do Dockerfile' },
  { name: 'docker exec',    sig: '-it <id> sh',                                                   desc: 'Entrar no container em execução' },
  { name: 'docker logs',    sig: '-f --tail=100 --since=10m <id>',                               desc: 'Ver logs do container' },
  { name: 'docker inspect', sig: '<id> | jq .[0].State',                                          desc: 'Inspecionar metadados completos' },
  { name: 'docker stats',   sig: '--no-stream',                                                   desc: 'CPU%, MEM, NET I/O em tempo real' },
  { name: 'docker stop',    sig: '--time=30 <id>',                                                desc: 'Parar container (SIGTERM → SIGKILL)' },
  { name: 'docker rm',      sig: '-f <id>',                                                       desc: 'Remover container (SIGKILL se rodando)' },
  { name: 'docker ps',      sig: '-a --format "table {{.ID}}\\t{{.Status}}"',                    desc: 'Listar containers (todos com -a)' },
  { name: 'docker pull',    sig: 'org/img:tag ou @sha256:...',                                   desc: 'Baixar imagem do registry' },
  { name: 'docker push',    sig: 'org/img:tag (após docker login)',                              desc: 'Enviar imagem ao registry' },
  { name: 'docker tag',     sig: 'img:old registry/img:new',                                    desc: 'Criar alias de tag' },
  { name: 'docker history', sig: '--no-trunc img',                                               desc: 'Ver layers e tamanhos da imagem' },
  { name: 'docker network', sig: 'create mynet / inspect / ls / connect',                       desc: 'Gerenciar redes Docker' },
  { name: 'docker volume',  sig: 'create / inspect / ls / prune',                               desc: 'Gerenciar volumes Docker' },
  { name: 'compose up',     sig: '-d --build / down -v / logs -f / exec svc cmd',               desc: 'Orquestrar stack com Compose' },
]

const CHEATSHEET_RULES: RuleItem[] = [
  { ok: true,  t: 'FROM: Sempre fixe versão e use alpine/slim. Pin por digest em prod.' },
  { ok: true,  t: 'COPY vs ADD: Sempre COPY. ADD só para tar.gz + chown em uma instrução.' },
  { ok: true,  t: 'RUN apt: apt update + install + rm -rf /var/lib/apt/lists/* no MESMO RUN.' },
  { ok: true,  t: 'USER: UID numérico não-root (1001). Nunca root, nunca "app" sem criar.' },
  { ok: true,  t: 'ENTRYPOINT: Exec form ["node", "server.js"] — nunca form shell. Tini para reaping.' },
  { ok: true,  t: 'HEALTHCHECK: Teste real de capacidade (pg_isready, wget /health). start_period obrigatório.' },
  { ok: false, t: 'Secrets: Nunca ENV, ARG ou COPY .env — use --mount=type=secret (BuildKit).' },
  { ok: false, t: '.dockerignore: Nunca omitir — node_modules, .git, *.log, .env, dist antigo.' },
]

// ── Dados: Mnemônicos ─────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'Ordem do Dockerfile — COLD',
    trick: 'C-O-L-D',
    expansion: [
      ['C', 'Config — FROM + ENV + ARG (base da imagem)'],
      ['O', 'OS — RUN apt/apk install (dependências do sistema)'],
      ['L', 'Libs — COPY package*.json + RUN npm ci (dependências do app)'],
      ['D', 'Data — COPY . . (código-fonte, muda com frequência)'],
    ],
    explanation: 'Dockerfile frio = código por último. O que muda menos (config, dependências do SO) vem primeiro para maximizar o cache de layers.',
    example: 'FROM node:20-alpine\nRUN apk add --no-cache curl\nCOPY package*.json ./\nRUN npm ci\nCOPY . .',
    why: 'Sem COLD, cada commit invalida o cache de npm install — builds 3-5× mais lentos.',
  },
  {
    label: 'Segurança Docker — SNUR',
    trick: 'S-N-U-R',
    expansion: [
      ['S', 'Scan — trivy ou docker scout antes de push'],
      ['N', 'Non-root — USER 1001:1001 ou adduser dedicado'],
      ['U', 'no URL — nunca ADD http:// (usa camada opaca, sem cache)'],
      ['R', 'Read-only — --read-only filesystem + tmpfs para /tmp'],
    ],
    explanation: 'SNUR soa como "sneaker" — calçado que protege o pé. Docker SNUR protege o container de ataques de fora.',
    example: 'RUN adduser -S app\nUSER app\ndocker run --read-only --tmpfs /tmp myimg',
    why: 'Root dentro do container + kernel vuln = escape de namespace. Non-root é a primeira linha de defesa.',
  },
  {
    label: 'Tipos de volume — BNT',
    trick: 'B-N-T',
    expansion: [
      ['B', 'Bind mount — caminho do host mapeado (-v ./src:/app/src), dev only'],
      ['N', 'Named volume — gerenciado pelo Docker, persiste entre containers, prod'],
      ['T', 'Tmpfs — existe só em memória, nunca em disco, para dados sensíveis'],
    ],
    explanation: 'BNT = "bind na dev, named no prod, tmpfs para segredos". Ordem crescente de isolamento e segurança.',
    example: 'docker run -v ./src:/app/src dev  # bind\ndocker run -v pgdata:/var/lib/postgresql prod  # named',
    why: 'Bind mounts em prod criam acoplamento ao host. Named volumes sobrevivem a docker rm. Tmpfs some no restart.',
  },
  {
    label: 'Modos de rede — BOHN',
    trick: 'B-O-H-N',
    expansion: [
      ['B', 'Bridge — rede padrão, DNS automático por nome de container'],
      ['O', 'Overlay — multi-host (Docker Swarm / Kubernetes overlay network)'],
      ['H', 'Host — sem NAT, processo escuta direto na interface do host'],
      ['N', 'None — sem rede, container completamente isolado'],
    ],
    explanation: 'BOHN = "bone" — a estrutura óssea da rede Docker. Bridge é o osso principal do dia a dia.',
    example: 'docker network create mynet\ndocker run --network mynet api\ndocker run --network mynet db',
    why: 'Na rede padrão (bridge sem nome), containers não se alcançam por hostname. Rede nomeada = DNS grátis.',
  },
]

// ── Dados: Anti-patterns ──────────────────────────────────────────────────────

const ANTIPATTERNS: AntiPatternItem[] = [
  {
    title: 'Rodar como root',
    badDesc: 'Sem USER — processo roda como root dentro do container',
    badCode: [
      { t:'FROM node:20-alpine' },
      { t:'# sem USER — root por padrão!', c:'#ef4444' },
      { t:'CMD ["node", "server.js"]', c:'#ef4444' },
    ],
    goodDesc: 'Criar usuário não-root dedicado com UID numérico',
    goodCode: [
      { t:'FROM node:20-alpine' },
      { t:'RUN addgroup -S app && adduser -S app -G app', c:'#4ade80' },
      { t:'USER app', c:'#4ade80' },
      { t:'CMD ["node", "server.js"]' },
    ],
    why: 'Root dentro do container pode se tornar root no host se houver exploit de kernel (escape de namespace).',
  },
  {
    title: 'Segredo em ENV ou ARG',
    badDesc: 'ENV expõe segredo em todas as layers — visível via docker history',
    badCode: [
      { t:'ENV NPM_TOKEN=ghp_secret123', c:'#ef4444' },
      { t:'# docker history mostra o valor!', c:'#ef4444' },
    ],
    goodDesc: 'BuildKit secret mount — zero traces na imagem final',
    goodCode: [
      { t:'RUN --mount=type=secret,id=npmrc \\', c:'#4ade80' },
      { t:'    cp /run/secrets/npmrc ~/.npmrc && npm ci', c:'#4ade80' },
    ],
    why: 'ENV/ARG ficam em todas as layers para sempre. docker history --no-trunc revela qualquer valor.',
  },
  {
    title: 'COPY . . antes das dependências',
    badDesc: 'Código copiado antes do npm install invalida cache a cada commit',
    badCode: [
      { t:'COPY . .', c:'#ef4444' },
      { t:'RUN npm install', c:'#ef4444' },
      { t:'# rebuilda tudo a cada commit!', c:'#ef4444' },
    ],
    goodDesc: 'Copiar manifesto primeiro — npm ci só roda quando package.json mudar',
    goodCode: [
      { t:'COPY package*.json ./', c:'#4ade80' },
      { t:'RUN npm ci', c:'#4ade80' },
      { t:'COPY . .', c:'#4ade80' },
    ],
    why: 'Mudança de código invalida o cache de npm install. Com a ordem correta, npm ci roda só quando package.json mudar.',
  },
  {
    title: 'Tag latest em produção',
    badDesc: 'latest muda sem aviso — builds não reproduzíveis',
    badCode: [
      { t:'FROM node:latest', c:'#ef4444' },
      { t:'image: minha-app:latest', c:'#ef4444' },
    ],
    goodDesc: 'Pin por versão exata ou digest SHA256',
    goodCode: [
      { t:'FROM node:20.11.1-alpine3.19', c:'#4ade80' },
      { t:'# ou por digest:', c:'#94a3b8' },
      { t:'FROM node:20-alpine@sha256:abc...', c:'#4ade80' },
    ],
    why: '"latest" muda sem aviso. Em CI/CD, pin por digest + Dependabot para atualizações controladas.',
  },
  {
    title: 'PID 1 em form shell',
    badDesc: 'CMD shell form — /bin/sh vira PID 1 e não repassa SIGTERM',
    badCode: [
      { t:'CMD node server.js', c:'#ef4444' },
      { t:'# /bin/sh vira PID 1 — não repassa SIGTERM!', c:'#ef4444' },
    ],
    goodDesc: 'ENTRYPOINT exec form — node é PID 1 e recebe SIGTERM diretamente',
    goodCode: [
      { t:'ENTRYPOINT ["node", "server.js"]', c:'#4ade80' },
      { t:'# exec form — node é PID 1, recebe SIGTERM', c:'#4ade80' },
    ],
    why: 'Form shell cria shell como PID 1. SIGTERM não é repassado ao processo filho — graceful shutdown quebra silenciosamente.',
  },
  {
    title: 'Sem .dockerignore',
    badDesc: 'COPY . . sem .dockerignore envia node_modules e .env ao daemon',
    badCode: [
      { t:'COPY . .', c:'#ef4444' },
      { t:'# copia node_modules, .git, .env, testes!', c:'#ef4444' },
    ],
    goodDesc: '.dockerignore exclui artefatos desnecessários e segredos',
    goodCode: [
      { t:'# .dockerignore:', c:'#94a3b8' },
      { t:'node_modules', c:'#4ade80' },
      { t:'.git', c:'#4ade80' },
      { t:'.env', c:'#4ade80' },
      { t:'**/*.log', c:'#4ade80' },
    ],
    why: 'Sem .dockerignore, COPY . . envia tudo ao daemon — aumenta o contexto de build e pode vazar segredos na imagem.',
  },
  {
    title: 'apt sem limpeza na mesma layer',
    badDesc: 'RUNs separados deixam cache de apt permanente em layers distintas',
    badCode: [
      { t:'RUN apt update', c:'#ef4444' },
      { t:'RUN apt install -y curl', c:'#ef4444' },
      { t:'# cache fica em layers separadas!', c:'#ef4444' },
    ],
    goodDesc: 'Um único RUN com &&, --no-install-recommends e limpeza de listas',
    goodCode: [
      { t:'RUN apt-get update && \\', c:'#4ade80' },
      { t:'    apt-get install -y --no-install-recommends curl && \\', c:'#4ade80' },
      { t:'    rm -rf /var/lib/apt/lists/*', c:'#4ade80' },
    ],
    why: 'Cada RUN cria uma layer. O cache de apt em layers separadas não pode ser removido depois — fica na imagem para sempre.',
  },
  {
    title: 'Sem HEALTHCHECK',
    badDesc: 'Container "running" mas sem health check — orquestrador não detecta falha',
    badCode: [
      { t:'FROM node:20-alpine' },
      { t:'# sem HEALTHCHECK — orquestrador não sabe se está ok!', c:'#ef4444' },
      { t:'CMD ["node", "server.js"]', c:'#ef4444' },
    ],
    goodDesc: 'HEALTHCHECK com start_period — Compose depends_on pode usar service_healthy',
    goodCode: [
      { t:'HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \\', c:'#4ade80' },
      { t:'  CMD wget -qO- http://localhost:3000/health || exit 1', c:'#4ade80' },
    ],
    why: 'Sem HEALTHCHECK, container em estado unhealthy aparece como "running". Compose depends_on não pode usar condition: service_healthy.',
  },
]

// ── Dados: Quick Ref ──────────────────────────────────────────────────────────

const QUICKREF_COLUMNS: QuickRefColumn[] = [
  {
    sections: [
      {
        title: 'Containers',
        entries: [
          { key: 'docker run -d -p 8080:3000 img',     value: 'Criar e iniciar (background)' },
          { key: 'docker run --rm -it img sh',          value: 'Interativo, remove ao sair' },
          { key: 'docker stop --time=30 <id>',          value: 'Parar gracefully (SIGTERM)' },
          { key: 'docker rm -f <id>',                   value: 'Forçar remoção (SIGKILL)', badge: '⚠ destrutivo' },
          { key: 'docker ps -a',                        value: 'Listar todos os containers' },
          { key: 'docker logs -f --tail=100 <id>',      value: 'Seguir logs' },
          { key: 'docker exec -it <id> sh',             value: 'Entrar no container' },
          { key: 'docker stats --no-stream',            value: 'Snapshot de CPU/MEM' },
          { key: 'docker inspect <id>',                 value: 'Metadados completos (JSON)' },
        ],
      },
      {
        title: 'Registry',
        entries: [
          { key: 'docker login registry.io',            value: 'Autenticar no registry' },
          { key: 'docker pull org/img:tag',             value: 'Baixar imagem' },
          { key: 'docker push org/img:tag',             value: 'Publicar imagem' },
          { key: 'docker tag img:old org/img:new',      value: 'Criar alias de tag' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Build & Imagens',
        entries: [
          { key: 'docker build -t org/app:1.0 .',       value: 'Build com tag' },
          { key: 'docker build --no-cache .',           value: 'Ignorar cache' },
          { key: 'docker build --target=stage .',       value: 'Até stage específico' },
          { key: 'docker build --secret id=k,src=f .', value: 'BuildKit secret (zero rastro)', badge: '★ essencial' },
          { key: 'docker history --no-trunc img',       value: 'Layers e tamanhos' },
          { key: 'docker image prune',                  value: 'Remover imagens órfãs', badge: '⚠ destrutivo' },
          { key: 'docker buildx build --platform ...',  value: 'Multi-arch (manifest list)' },
        ],
      },
      {
        title: 'Rede & Volume',
        entries: [
          { key: 'docker network create mynet',         value: 'Criar bridge user-defined' },
          { key: 'docker network inspect mynet',        value: 'IPs e containers na rede' },
          { key: 'docker volume create pgdata',         value: 'Criar volume nomeado' },
          { key: 'docker volume inspect pgdata',        value: 'Path no host' },
          { key: 'docker volume prune',                 value: 'Remover volumes não usados', badge: '⚠ destrutivo' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Compose',
        entries: [
          { key: 'docker compose up -d',                value: 'Subir stack em background' },
          { key: 'docker compose up --build',           value: 'Rebuildar e subir' },
          { key: 'docker compose down -v',              value: 'Parar e remover volumes', badge: '⚠ destrutivo' },
          { key: 'docker compose logs -f svc',          value: 'Seguir log de serviço' },
          { key: 'docker compose exec svc sh',          value: 'Entrar em serviço' },
          { key: 'docker compose ps',                   value: 'Status dos serviços' },
        ],
      },
      {
        title: 'Diagnóstico',
        entries: [
          { key: 'docker system df',                    value: 'Uso de disco por camada' },
          { key: 'docker system prune -af',             value: 'Limpar tudo não usado', badge: '⚠ destrutivo' },
          { key: 'docker events --since=1h',            value: 'Eventos do daemon em tempo real' },
          { key: 'docker top <id>',                     value: 'Processos dentro do container' },
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
    skillName: 'Docker',
    stackLabel: 'DevOps / Infraestrutura',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'Docker',
    accentColor: C,
    stackLabel: 'DevOps / Infraestrutura',
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
    skillName: 'Docker',
    accentColor: C,
    stackLabel: 'DevOps / Infraestrutura',
    columns: QUICKREF_COLUMNS,
  }),
  antipatterns: () => buildAntipatternsPdf({
    skillName: 'Docker',
    accentColor: C,
    stackLabel: 'DevOps / Infraestrutura',
    antipatterns: ANTIPATTERNS,
  }),
}

// ── Componente ────────────────────────────────────────────────────────────────

export default function DockerPdfs() {
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
