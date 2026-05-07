'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildCheatsheetPdf } from '@/components/pdfs/CheatsheetPdf'
import type { HookItem, RuleItem } from '@/components/pdfs/CheatsheetPdf'
import { buildQuickRefPdf } from '@/components/pdfs/QuickRefPdf'
import type { QuickRefColumn } from '@/components/pdfs/QuickRefPdf'
import { buildAntipatternsPdf } from '@/components/pdfs/AntipatternsPdf'
import type { AntiPatternItem } from '@/components/pdfs/AntipatternsPdf'

// ── Paleta Docker Compose ────────────────────────────────────────────────────
const C = '#1F8FE0'

// ── Metadados dos PDFs ───────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 16 perguntas mais cobradas em entrevista',
    type: 'qa',
    pages: 8,
    description: 'Recuperacao ativa: 16 perguntas pleno e senior cobrindo Compose vs K8s, depends_on com healthcheck, override files, networks isoladas, secrets, GPU, CI integrado, GPU e multi-arch. Cada resposta vem com dica de apresentacao.',
    icon: '01',
    goal: 'Recuperacao ativa',
    featured: true,
  },
  {
    id: 'quick-ref',
    title: 'Quick Ref — compose.yaml + CLI',
    subtitle: 'Cartao A4 landscape com sintaxe e comandos numa pagina',
    type: 'quick-ref',
    pages: 1,
    description: 'A4 landscape em 3 colunas: chaves do compose.yaml (services, networks, volumes, secrets), CLI (up/down/logs/exec/ps/config), flags e profiles. Para imprimir e deixar na mesa enquanto monta a pilha.',
    icon: '02',
    goal: 'Referencia de bolso',
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet completo',
    subtitle: 'Comandos + chaves YAML + regras de ouro numa folha densa',
    type: 'cheatsheet',
    pages: 3,
    description: 'Referencia densa: ciclo de vida (up/down/stop/restart), debug (logs/exec/config/ps), build (build/pull/push), flags importantes (-f, --profile, --env-file, -p, --wait) e regras de ouro com pratica recomendada.',
    icon: '03',
    goal: 'Consulta rapida',
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns',
    subtitle: 'Os 7 erros mais comuns em compose.yaml — e como corrigir',
    type: 'antipatterns',
    pages: 3,
    description: 'Os anti-patterns que aparecem em PR review: depends_on sem healthcheck, image: latest, secret em environment, override.yaml versionado em prod, ausencia de profiles, docker-compose v1, sem network isolation. Cada um com diff ruim x bom + explicacao.',
    icon: '04',
    goal: 'Reconhecimento de padrao',
  },
]

// ── Dados: Q&A ───────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'Quando usar Docker Compose e quando precisa migrar para Kubernetes?',
    a: 'Compose ganha em: dev local, CI para testes integrados, ambiente de staging single-host, app pequena/media em 1 servidor, POC e quando o time nao tem maturidade ops para K8s. Migra para K8s quando: precisa multi-host (scheduler distribui pods em varios nos), auto-scaling horizontal, rolling update sem downtime, multi-AZ, isolamento multi-tenant, service mesh ou canary/blue-green. Para produto pequeno em 1 host, K8s e overkill — overhead operacional come a velocidade do time.',
    tip: 'Comece pelas situacoes onde Compose ganha — entrevistador testa se voce nao esta fazendo cargo cult de K8s. Mencione que time pequeno em 1 host com Compose entrega mais rapido que time pequeno tentando operar K8s.',
  },
  {
    level: 'Pleno',
    q: 'Como garantir que app so sobe depois do banco estar realmente pronto?',
    a: 'depends_on sozinho so espera o container iniciar (PID 1 comecou) — nao espera o Postgres aceitar conexao. Solucao: combinar healthcheck no servico de banco com condition: service_healthy no dependente. db.healthcheck.test: ["CMD-SHELL", "pg_isready -U app"], interval: 5s, retries: 10, start_period: 30s. api.depends_on.db.condition: service_healthy. Em prod, ainda implemente retry com backoff na app — DB pode reiniciar e a app precisa sobreviver.',
    tip: 'Diferenciar "container iniciado" de "app pronta para servir" e o ponto que diferencia. Em K8s o equivalente e readinessProbe.',
  },
  {
    level: 'Pleno',
    q: 'Explique a estrategia de override files. Quando usar override automatico vs -f explicito?',
    a: 'Compose carrega compose.yaml + compose.override.yaml automaticamente em docker compose up. E a convencao para dev: base define o comum (image, ports, environment); override adiciona dev-specific (build local, volumes para hot reload, NODE_ENV=development). Para outros ambientes (prod, staging, test): -f explicito — docker compose -f compose.yaml -f compose.prod.yaml up -d. Ordem importa — arquivos posteriores sobrescrevem. Listas concatenam, mapas mergem por chave.',
    tip: 'Mencione a boa pratica: em projetos com 3+ ambientes, prefiro nomes explicitos (compose.dev.yaml, compose.prod.yaml) e nunca uso o override automatico — torna explicito qual arquivo esta em uso.',
  },
  {
    level: 'Pleno',
    q: 'Diferenca entre docker-compose v1 (com hifen) e docker compose v2 (com espaco)?',
    a: 'v1 (docker-compose) e Python standalone — deprecated em 2023. v2 (docker compose) e plugin Go integrado ao Docker CLI. v2 e mais rapido (Go vs Python), suporta features novas (GPU, profiles, healthcheck moderno, secrets sintaxe atual), tem flag --wait que espera servicos ficarem healthy antes de retornar (essencial em CI), suporta build com BuildKit nativo e gerencia melhor sinais. Se um README usa docker-compose, e sinal de projeto desatualizado.',
    tip: 'Citar a flag --wait diferencia — e um dos motivos mais praticos para preferir v2 em CI.',
  },
  {
    level: 'Senior',
    q: 'Como isolar networks para emular uma VPC? Por que isso importa?',
    a: 'Por padrao, todos os servicos ficam numa rede default — qualquer um conversa com qualquer um. Padrao recomendado: frontend-net (frontend + api), backend-net (api + db + redis com internal: true). api e a ponte. db e redis nunca sao alcancaveis pelo frontend. Por que importa: emula o que VPC faz no cloud (subnets publicas vs privadas). Se um SSRF na api permitir requisicoes arbitrarias, o atacante so alcanca o que a api alcanca. Defesa em profundidade — nao substitui auth, mas reduz blast radius. Em K8s o equivalente e NetworkPolicy.',
    tip: 'Mencione que isolamento de rede e defesa em profundidade — quem ve isolamento como cosmetico perde pontos com entrevistador senior de seguranca.',
  },
  {
    level: 'Pleno',
    q: 'Diferenca entre bind mount, volume nomeado e tmpfs?',
    a: 'Bind mount (./src:/app) referencia path do host — mudanca imediata no container, otimo para hot reload em dev. Performance ruim no Docker Desktop (cruza VM), nao portavel. Volume nomeado (db_data:/var/lib/postgresql/data) e storage gerenciado pelo Docker em /var/lib/docker/volumes/. Sobrevive a docker compose down (sem -v), portavel, performance melhor. tmpfs e RAM — efemero, perde tudo no restart, ideal para /tmp e secrets em runtime. Regra: dev = bind no codigo + volume anonimo no node_modules; prod = volume nomeado para dado persistente; CI = tmpfs no postgres para velocidade.',
    tip: 'Saber a regra por contexto (dev/prod/CI) e o que diferencia de candidato que so sabe a definicao tecnica.',
  },
  {
    level: 'Pleno',
    q: 'Como debugar uma pilha onde o servico nao sobe?',
    a: 'Roteiro: 1) docker compose ps — qual servico esta em qual estado (Exit, Restarting, Created, Running). 2) docker compose logs <svc> --tail=200 — ultima saida antes de morrer. 3) docker compose config — confirma o YAML final apos merge de overrides e expansao de variaveis (.env). 4) docker compose events — stream em tempo real. 5) docker container inspect <id> — exit code (137 = OOM, 1 = erro normal, 139 = segfault). 6) docker compose run --rm <svc> sh — sobe one-shot do servico com shell para reproduzir manualmente. Em CI, sempre rode logs num step de cleanup.',
    tip: 'Ter um roteiro sequencial demonstra experiencia real em producao. Mencionar exit codes especificos (137 OOM) e exit code maturidade.',
  },
  {
    level: 'Senior',
    q: 'Como passar secrets para o Compose sem vazar em logs?',
    a: 'Antipattern: environment.DB_PASSWORD: super_secret — vaza em ps, inspect e logs. Pattern correto: bloco secrets — Compose monta arquivo em /run/secrets/<name> com mode 0400. Sintaxe: services.api.secrets: [db_password] + environment.DB_PASSWORD_FILE: /run/secrets/db_password — app le via fs.readFileSync. secrets.db_password.file: ./secrets/db_password.txt (local) ou external: true (Swarm/cloud). Em prod serio: Vault, AWS Secrets Manager, External Secrets Operator do K8s.',
    tip: 'Demonstrar a sintaxe correta + mencionar que Compose puro tem suporte limitado para rotacao — em prod com necessidade real, migra para K8s + ESO.',
  },
  {
    level: 'Pleno',
    q: 'Por que o comando docker compose config e importante?',
    a: 'docker compose config imprime o YAML FINAL que o Compose vai usar — depois de merge de todos os arquivos -f, expansao de variaveis (.env e shell), aplicacao de profiles e validacao. Quando uso: variavel nao expandiu (mostra resultado real); override nao funcionou (vejo se merge fundiu corretamente); profile nao ativou (confirmo se --profile foi reconhecido); CI quebrando localmente (comparo saida com a do CI). Flags: --no-interpolate (sem expandir variaveis, debug de origem), --services (so lista servicos que vao subir).',
    tip: 'Mencionar config como primeiro passo de debug e maturidade. Quem nao usa config gasta horas adivinhando o que esta acontecendo.',
  },
  {
    level: 'Senior',
    q: 'Compose v3 deploy.replicas funciona? Por que?',
    a: 'Nao no Compose puro — so funciona em Swarm (docker stack deploy). Em docker compose up, qualquer chave dentro de deploy: (replicas, resources, restart_policy) e silenciosamente ignorada — Compose roda 1 instancia so. Por que existe: Compose v3 foi desenhado para ser portavel entre Compose e Swarm. Como Swarm caiu em desuso, a promessa nao vingou. Para rodar multiplas replicas em Compose: docker compose up --scale api=3, mas precisa de proxy (nginx, traefik) na frente. Para prod multi-instancia, use K8s ou ECS. Resource limits: use mem_limit, cpus, pids_limit no nivel do servico (fora de deploy:) — esses funcionam.',
    tip: 'Conhecer essa pegadinha distingue de quem so leu spec. mem_limit fora de deploy: funciona em Compose puro.',
  },
  {
    level: 'Pleno',
    q: 'Como lidar com hot reload de node_modules em volume bind?',
    a: 'Problema: volumes: ["./api:/app"] sobrescreve /app/node_modules do container com a pasta vazia (ou de outra arquitetura) do host. App quebra na importacao. Solucao mais comum: volume anonimo cobrindo node_modules — volumes: ["./api:/app", "/app/node_modules"]. Docker monta volumes em ordem — bind primeiro, depois volume anonimo cobre node_modules com o do container. Alternativas: instalar deps no entrypoint (npm install em vez de COPY) ou usar docker compose watch (v2.22+) que sincroniza arquivos sem bind. Mesma logica vale para .next/, target/, vendor/.',
    tip: 'Reconhecer o problema antes de ouvir a pergunta completa demonstra que ja passou por isso. docker compose watch e a solucao moderna que pouca gente conhece.',
  },
  {
    level: 'Pleno',
    q: 'Como rodar Compose no CI para teste integrado?',
    a: 'Compose e ideal para CI — sobe pilha real (DB, Redis, queue) em vez de mock. Padrao GitHub Actions: docker compose -f compose.test.yaml up -d --wait (espera healthchecks); docker compose exec -T app npm test; docker compose logs (if: failure() — para debug); docker compose down -v (if: always() — cleanup). Otimizacoes: tmpfs em /var/lib/postgresql/data (ramdisk, sem disco), cache_from no build (reusa layer entre runs), --abort-on-container-exit --exit-code-from test (propaga exit code), POSTGRES_HOST_AUTH_METHOD=trust (sem senha em test). Tempo total: < 60s.',
    tip: 'A combinacao --abort-on-container-exit + --exit-code-from e o segredo para o exit code do test propagar para o job do CI.',
  },
  {
    level: 'Senior',
    q: 'Compose suporta GPU? Como rodar workload de ML?',
    a: 'Sim, desde Compose v2 com Docker Engine 19.03+. Sintaxe: deploy.resources.reservations.devices: [{ driver: nvidia, count: 1, capabilities: [gpu] }]. Funciona em Compose tambem (apesar de estar dentro de deploy:). environment: NVIDIA_VISIBLE_DEVICES=all, NVIDIA_DRIVER_CAPABILITIES=compute,utility. Pre-requisitos: NVIDIA driver instalado + nvidia-container-toolkit (apt install) + restart docker daemon. Para GPUs especificas: device_ids: ["0", "1"] em vez de count. Para prod ML em escala, K8s com nvidia-device-plugin ou plataforma gerenciada (Kubeflow, SageMaker) e mais comum.',
    tip: 'Saber que deploy.resources.devices funciona em Compose (mas replicas nao) e o nivel de profundidade que separa senior.',
  },
  {
    level: 'Pleno',
    q: 'O que profiles fazem e quando vale usar?',
    a: 'profiles: [debug] num servico o exclui do up padrao. docker compose --profile debug up liga. Util para servicos opcionais como adminer (UI do Postgres), mailhog (capture SMTP), jaeger (tracing), prometheus + grafana (metricas) — voce so quer as vezes. Multiplos profiles aceitos: --profile debug --profile tracing. Em CI, normalmente nenhum profile (so core). Em dev pesado, liga conforme precisar. Sem profiles, toda a pilha sobe junto e dev fica lento. Ja foi feature de Compose v2 — v1 nao suporta.',
    tip: 'A regra "nenhum profile em CI, profile debug em dev pesado" e a heuristica que diferencia uso pratico de teorico.',
  },
  {
    level: 'Senior',
    q: 'Como monitorar uma pilha Compose em producao single-host?',
    a: 'Para single-host com Compose em prod, monte stack de monitoring com profile dedicado: prometheus (scrape de /metrics dos servicos), grafana (dashboards), node-exporter (metricas do host), cadvisor (metricas dos containers), loki + promtail (logs centralizados). profiles: [monitoring] em todos. Resource limits no compose.prod.yaml (mem_limit, cpus) para evitar noisy neighbor. logging.options.max-size + max-file para nao encher disco. Healthchecks reais em todos os servicos da app. docker events para audit trail. Em pilha maior: migrar para K8s + Datadog/New Relic.',
    tip: 'Mostrar que voce conhece o stack canonico (Prometheus + Grafana + Loki) e que sabe os limites do Compose em prod e diferencial.',
  },
  {
    level: 'Senior',
    q: 'O que e docker compose watch e quando usar?',
    a: 'Recurso de Compose v2.22+. Em vez de bind mount (que tem performance ruim no Docker Desktop), watch sincroniza arquivos do host para o container via inotify. Sintaxe: develop.watch: [{ action: sync, path: ./src, target: /app/src }, { action: rebuild, path: package.json }]. action: sync copia arquivo individual; action: rebuild dispara rebuild da imagem; action: sync+restart copia e reinicia o servico. Beneficios: 5-10x mais rapido em Mac/Windows que bind, nao tem o problema do node_modules ser sobrescrito. Padrao moderno para dev em Compose — substitui bind mount em projetos novos.',
    tip: 'Mencionar Compose watch como evolucao demonstra que voce acompanha versoes recentes — Compose v2.22 e relativamente novo e poucos conhecem.',
  },
]

// ── Dados: Cheatsheet ────────────────────────────────────────────────────────

const CHEATSHEET_HOOKS: HookItem[] = [
  { name: 'compose up',     sig: '-d / --build / --remove-orphans / --wait / --scale svc=3', desc: 'Subir a pilha (foreground por padrao)' },
  { name: 'compose down',   sig: '-v (remove volumes!) / --rmi all / --remove-orphans',       desc: 'Parar e remover containers + redes' },
  { name: 'compose stop',   sig: 'svc1 svc2',                                                 desc: 'Parar containers sem remover (start retoma)' },
  { name: 'compose restart',sig: '[svc] / -t 30',                                             desc: 'Reiniciar servico — util quando .env mudou' },
  { name: 'compose ps',     sig: '-a / --format json / --services',                           desc: 'Listar servicos com status, portas e healthcheck' },
  { name: 'compose logs',   sig: '-f / --tail=100 / --timestamps / svc1 svc2',                desc: 'Seguir logs (multi-servico OK)' },
  { name: 'compose exec',   sig: '-T svc cmd / -it svc sh',                                   desc: 'Comando em container existente (-T para CI)' },
  { name: 'compose run',    sig: '--rm svc cmd / --entrypoint sh',                            desc: 'Sobe one-shot com override de comando' },
  { name: 'compose top',    sig: '[svc]',                                                     desc: 'Processos rodando dentro de cada container' },
  { name: 'compose config', sig: '--no-interpolate / --services / --profiles',                desc: 'YAML final apos merge — debug essencial' },
  { name: 'compose port',   sig: 'svc 5432',                                                  desc: 'Mapping efetivo (porta dinamica)' },
  { name: 'compose build',  sig: '--no-cache / --pull / --build-arg KEY=val',                 desc: 'Build sem subir' },
  { name: 'compose pull',   sig: '--policy missing / --quiet',                                desc: 'Pull de todas as imagens declaradas' },
  { name: 'compose push',   sig: '[svc]',                                                     desc: 'Push das imagens para registry (CI)' },
  { name: 'compose images', sig: '',                                                          desc: 'Lista imagens dos servicos com tag e tamanho' },
  { name: 'compose events', sig: '--since=1h --until=now',                                    desc: 'Stream de eventos do daemon em tempo real' },
]

const CHEATSHEET_RULES: RuleItem[] = [
  { ok: true,  t: 'depends_on: SEMPRE com condition: service_healthy + healthcheck no servico de banco. Sem isso e teatro.' },
  { ok: true,  t: 'image: SEMPRE com tag fixa (semver) ou digest SHA256. Nunca latest em prod.' },
  { ok: true,  t: 'volumes: bind no codigo em dev, volume nomeado em prod, tmpfs em CI para postgres.' },
  { ok: true,  t: 'restart: unless-stopped por padrao. always so para monitoring que precisa subir ate em stop manual.' },
  { ok: true,  t: 'networks: separe em frontend-net + backend-net. internal: true em backend para defesa em profundidade.' },
  { ok: true,  t: 'profiles: [debug] em adminer/mailhog/jaeger. Mantem dev rapido por padrao.' },
  { ok: false, t: 'Secrets em environment direto: vaza em ps, inspect, logs. Use bloco secrets ou Vault.' },
  { ok: false, t: 'compose.override.yaml versionado em prod: pode aplicar config de dev silenciosamente. Use nomes explicitos por ambiente.' },
  { ok: false, t: 'docker-compose com hifen: deprecated v1 Python. Use docker compose com espaco (v2 Go plugin).' },
  { ok: false, t: 'mem_limit ausente em prod single-host: container vira noisy neighbor e derruba o host inteiro.' },
]

// ── Dados: Quick Ref ─────────────────────────────────────────────────────────

const QUICKREF_COLUMNS: QuickRefColumn[] = [
  {
    sections: [
      {
        title: 'Ciclo de vida',
        entries: [
          { key: 'docker compose up -d',                value: 'Subir em background' },
          { key: 'docker compose up --build',           value: 'Force rebuild' },
          { key: 'docker compose up --wait',            value: 'Espera healthchecks (CI)', badge: 'star CI' },
          { key: 'docker compose down',                 value: 'Para e remove containers + redes' },
          { key: 'docker compose down -v',              value: 'Inclui volumes', badge: 'destrutivo' },
          { key: 'docker compose stop',                 value: 'Para sem remover (start retoma)' },
          { key: 'docker compose restart [svc]',        value: 'Reinicia servico' },
        ],
      },
      {
        title: 'Debug e inspecao',
        entries: [
          { key: 'docker compose ps',                   value: 'Status, portas, health' },
          { key: 'docker compose logs -f svc',          value: 'Segue logs do servico' },
          { key: 'docker compose exec svc sh',          value: 'Shell no container' },
          { key: 'docker compose run --rm svc sh',      value: 'One-shot interativo' },
          { key: 'docker compose config',               value: 'YAML final apos merge', badge: 'debug 1' },
          { key: 'docker compose top',                  value: 'Processos por container' },
          { key: 'docker compose events',               value: 'Stream de eventos' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'compose.yaml — chaves',
        entries: [
          { key: 'services.<name>',                     value: 'image, build, ports, environment' },
          { key: 'depends_on.<svc>.condition',          value: 'service_healthy / service_started' },
          { key: 'healthcheck',                         value: 'test, interval, timeout, retries, start_period' },
          { key: 'volumes',                             value: '- ./src:/app  ou  - name:/path' },
          { key: 'profiles: [debug]',                   value: 'Servico opcional' },
          { key: 'restart',                             value: 'no/on-failure/always/unless-stopped' },
          { key: 'networks: [name]',                    value: 'Lista de redes do servico' },
          { key: 'mem_limit / cpus',                    value: 'Resource limits (Compose puro)' },
          { key: 'secrets: [db_pwd]',                   value: 'Monta /run/secrets/db_pwd' },
        ],
      },
      {
        title: 'Top-level',
        entries: [
          { key: 'volumes: { db_data: {} }',            value: 'Declara volume nomeado' },
          { key: 'networks: { backend-net: {...} }',    value: 'driver, internal: true, external: true' },
          { key: 'secrets: { name: { file: ... } }',    value: 'Arquivo local ou external: true' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Flags importantes',
        entries: [
          { key: '-f file1.yaml -f file2.yaml',         value: 'Multiplos arquivos (ordem importa)' },
          { key: '--profile debug',                     value: 'Liga servicos com profile debug' },
          { key: '--env-file .env.prod',                value: 'Env file customizado' },
          { key: '-p projectname',                      value: 'Nome do projeto (prefixo)' },
          { key: '--scale api=3',                       value: 'Multiplas instancias (precisa LB)' },
        ],
      },
      {
        title: 'CI patterns',
        entries: [
          { key: 'tmpfs: [/var/lib/postgresql/data]',   value: 'Postgres em ramdisk (rapido)', badge: 'star CI' },
          { key: 'POSTGRES_HOST_AUTH_METHOD=trust',     value: 'Sem senha em test' },
          { key: '--abort-on-container-exit',           value: 'Para tudo se um sair' },
          { key: '--exit-code-from svc',                value: 'Propaga exit code para CI' },
          { key: 'cache_from: [org/api:cache]',         value: 'Reusa layer entre runs' },
        ],
      },
      {
        title: 'Variaveis (.env)',
        entries: [
          { key: '${VAR}',                              value: 'Substitui pelo valor' },
          { key: '${VAR:-default}',                     value: 'Default se nao definida' },
          { key: '${VAR:?obrigatorio}',                 value: 'Falha se nao definida', badge: 'star CI' },
          { key: '${VAR:+presente}',                    value: 'So se VAR estiver definida' },
        ],
      },
    ],
  },
]

// ── Dados: Anti-patterns ─────────────────────────────────────────────────────

const ANTIPATTERNS: AntiPatternItem[] = [
  {
    title: 'depends_on sem healthcheck',
    badDesc: 'depends_on: [db] so espera o container iniciar — nao espera o Postgres aceitar conexao',
    badCode: [
      { t:'services:' },
      { t:'  api:' },
      { t:'    depends_on: [db]', c:'#ef4444' },
      { t:'    # api sobe antes do pg aceitar conexao!', c:'#ef4444' },
      { t:'  db:' },
      { t:'    image: postgres:16-alpine' },
    ],
    goodDesc: 'condition: service_healthy + healthcheck no banco — espera real',
    goodCode: [
      { t:'services:' },
      { t:'  api:' },
      { t:'    depends_on:', c:'#4ade80' },
      { t:'      db:', c:'#4ade80' },
      { t:'        condition: service_healthy', c:'#4ade80' },
      { t:'  db:' },
      { t:'    image: postgres:16-alpine' },
      { t:'    healthcheck:', c:'#4ade80' },
      { t:'      test: ["CMD-SHELL", "pg_isready -U app"]', c:'#4ade80' },
      { t:'      interval: 5s', c:'#4ade80' },
      { t:'      retries: 10', c:'#4ade80' },
      { t:'      start_period: 30s', c:'#4ade80' },
    ],
    why: 'depends_on simples espera apenas o PID 1 iniciar — Postgres ainda nao aceitou conexao. start_period e critico: falhas durante esse periodo nao contam como retries.',
  },
  {
    title: 'image: latest em producao',
    badDesc: 'latest muda sem aviso — builds nao reproduziveis',
    badCode: [
      { t:'services:' },
      { t:'  api:' },
      { t:'    image: myorg/api:latest', c:'#ef4444' },
      { t:'  db:' },
      { t:'    image: postgres', c:'#ef4444' },
      { t:'    # tag implicita = latest', c:'#ef4444' },
    ],
    goodDesc: 'Pin por semver fixo ou digest SHA256',
    goodCode: [
      { t:'services:' },
      { t:'  api:' },
      { t:'    image: myorg/api:1.4.2', c:'#4ade80' },
      { t:'    # melhor — pin por digest:', c:'#94a3b8' },
      { t:'    image: myorg/api@sha256:abc1234...', c:'#4ade80' },
      { t:'  db:' },
      { t:'    image: postgres:16.2-alpine', c:'#4ade80' },
    ],
    why: 'latest pode trazer versao com regressao ou vulnerabilidade. Pin por digest e o ouro — garante imagem identica para sempre. Use Dependabot para atualizar com PR controlado.',
  },
  {
    title: 'Secret em environment direto',
    badDesc: 'environment vaza em docker compose ps, inspect e logs',
    badCode: [
      { t:'services:' },
      { t:'  api:' },
      { t:'    environment:' },
      { t:'      DB_PASSWORD: super_secret', c:'#ef4444' },
      { t:'      JWT_SECRET: hardcoded_key_123', c:'#ef4444' },
      { t:'      # vaza em qualquer ps ou inspect!', c:'#ef4444' },
    ],
    goodDesc: 'Bloco secrets — monta arquivo em /run/secrets',
    goodCode: [
      { t:'services:' },
      { t:'  api:' },
      { t:'    secrets: [db_password]', c:'#4ade80' },
      { t:'    environment:' },
      { t:'      DB_PASSWORD_FILE: /run/secrets/db_password', c:'#4ade80' },
      { t:'' },
      { t:'secrets:', c:'#4ade80' },
      { t:'  db_password:', c:'#4ade80' },
      { t:'    file: ./secrets/db_password.txt', c:'#4ade80' },
    ],
    why: 'environment vaza em ps, inspect e ate em logs de erro. O bloco secrets monta arquivo com mode 0400 e nunca aparece em ps. Em prod serio: Vault ou AWS Secrets Manager.',
  },
  {
    title: 'compose.override.yaml versionado em prod',
    badDesc: 'override.yaml e magico — Compose carrega automatico, pode aplicar config de dev em prod',
    badCode: [
      { t:'# .gitignore vazio', c:'#ef4444' },
      { t:'compose.yaml' },
      { t:'compose.override.yaml', c:'#ef4444' },
      { t:'# em prod: docker compose up carrega override = dev config!', c:'#ef4444' },
    ],
    goodDesc: '.gitignore para override + nomes explicitos por ambiente',
    goodCode: [
      { t:'# .gitignore', c:'#94a3b8' },
      { t:'compose.override.yaml', c:'#4ade80' },
      { t:'' },
      { t:'# arquivos versionados:', c:'#94a3b8' },
      { t:'compose.yaml          # base', c:'#4ade80' },
      { t:'compose.dev.yaml      # dev compartilhado', c:'#4ade80' },
      { t:'compose.prod.yaml     # prod', c:'#4ade80' },
      { t:'# uso: docker compose -f compose.yaml -f compose.dev.yaml up', c:'#94a3b8' },
    ],
    why: 'compose.override.yaml e magico — carregado automatico sem -f. Se commitado, pode ter config de dev (NODE_ENV=development, volumes locais) sendo aplicada em prod silenciosamente.',
  },
  {
    title: 'Sem profiles — pilha inteira sobe sempre',
    badDesc: 'Toda ferramenta de debug sobe junto, dev lento por padrao',
    badCode: [
      { t:'services:' },
      { t:'  api: { image: myorg/api }' },
      { t:'  db:  { image: postgres:16 }' },
      { t:'  adminer: { image: adminer }', c:'#ef4444' },
      { t:'  jaeger:  { image: jaegertracing/all-in-one }', c:'#ef4444' },
      { t:'  mailhog: { image: mailhog/mailhog }', c:'#ef4444' },
    ],
    goodDesc: 'profiles: [debug] em servicos opcionais',
    goodCode: [
      { t:'services:' },
      { t:'  api: { image: myorg/api }' },
      { t:'  db:  { image: postgres:16 }' },
      { t:'  adminer:' },
      { t:'    image: adminer' },
      { t:'    profiles: [debug]', c:'#4ade80' },
      { t:'  jaeger:' },
      { t:'    image: jaegertracing/all-in-one' },
      { t:'    profiles: [tracing]', c:'#4ade80' },
      { t:'# uso: docker compose --profile debug up', c:'#94a3b8' },
    ],
    why: 'Sem profiles, qualquer servico extra sobe junto e consome CPU/RAM. profiles: [debug] mantem o core leve por padrao — voce liga ferramentas extras quando precisa.',
  },
  {
    title: 'docker-compose com hifen (v1 Python)',
    badDesc: 'v1 deprecated em 2023 — sem profiles, sem --wait, sem GPU moderno',
    badCode: [
      { t:'docker-compose up -d', c:'#ef4444' },
      { t:'docker-compose logs api', c:'#ef4444' },
      { t:'docker-compose exec api sh', c:'#ef4444' },
      { t:'# v1 Python — mais lento, sem features modernas', c:'#ef4444' },
    ],
    goodDesc: 'docker compose com espaco (v2 Go plugin)',
    goodCode: [
      { t:'docker compose up -d', c:'#4ade80' },
      { t:'docker compose logs api', c:'#4ade80' },
      { t:'docker compose exec api sh', c:'#4ade80' },
      { t:'docker compose up --wait', c:'#4ade80' },
      { t:'# v2 Go plugin — atual, suporta profiles, --wait, GPU', c:'#94a3b8' },
    ],
    why: 'v1 Python ficou deprecated em 2023. v2 Go plugin e mais rapido, suporta features novas e gerencia signals melhor. Se README usa hifen, projeto esta desatualizado.',
  },
  {
    title: 'Networks sem isolamento — frontend alcanca db',
    badDesc: 'Tudo na rede default — nenhuma defesa em profundidade',
    badCode: [
      { t:'services:' },
      { t:'  frontend: { image: web }', c:'#ef4444' },
      { t:'  api:      { image: api }', c:'#ef4444' },
      { t:'  db:       { image: postgres:16 }', c:'#ef4444' },
      { t:'  redis:    { image: redis:7 }', c:'#ef4444' },
      { t:'# tudo numa rede so — frontend alcanca db direto!', c:'#ef4444' },
    ],
    goodDesc: 'Redes separadas: frontend-net + backend-net (api e ponte)',
    goodCode: [
      { t:'services:' },
      { t:'  frontend:' },
      { t:'    networks: [frontend-net]', c:'#4ade80' },
      { t:'  api:' },
      { t:'    networks: [frontend-net, backend-net]', c:'#4ade80' },
      { t:'  db:' },
      { t:'    networks: [backend-net]', c:'#4ade80' },
      { t:'  redis:' },
      { t:'    networks: [backend-net]', c:'#4ade80' },
      { t:'' },
      { t:'networks:' },
      { t:'  frontend-net: {}', c:'#4ade80' },
      { t:'  backend-net:', c:'#4ade80' },
      { t:'    internal: true   # bloqueia internet', c:'#4ade80' },
    ],
    why: 'Sem isolamento, SSRF na api permite atacante alcancar db via DNS interno. Separar redes emula VPC — defesa em profundidade. internal: true bloqueia ate saida para internet.',
  },
]

// ── Builders ─────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'Docker Compose',
    stackLabel: 'DevOps / Orquestracao',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'Docker Compose',
    accentColor: C,
    stackLabel: 'DevOps / Orquestracao',
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
    skillName: 'Docker Compose',
    accentColor: C,
    stackLabel: 'DevOps / Orquestracao',
    columns: QUICKREF_COLUMNS,
  }),
  antipatterns: () => buildAntipatternsPdf({
    skillName: 'Docker Compose',
    accentColor: C,
    stackLabel: 'DevOps / Orquestracao',
    antipatterns: ANTIPATTERNS,
  }),
}

// ── Componente ───────────────────────────────────────────────────────────────

export default function DockerComposePdfs() {
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
