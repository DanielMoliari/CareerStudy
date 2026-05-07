'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'
import { SequenceDiagram } from '@/components/visuals/SequenceDiagram'
import type { SeqActor, SeqMessage } from '@/components/visuals/SequenceDiagram'
import { StateMachineExplorer } from '@/components/visuals/StateMachineExplorer'
import type { SMState, SMTransition } from '@/components/visuals/StateMachineExplorer'
import { DecisionTree } from '@/components/visuals/DecisionTree'
import type { DTNode } from '@/components/visuals/DecisionTree'
import { ProgressionMap } from '@/components/visuals/ProgressionMap'
import type { ProgressionLevel } from '@/components/visuals/ProgressionMap'

// ── Paleta Docker Compose ─────────────────────────────────────────────────────
const C      = '#1F8FE0'   // Compose blue (Docker blue um pouco mais sóbrio)
const SEC    = '#7E57C2'   // roxo de orquestração
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#4ade80'
const RED    = '#ef4444'
const AMB    = '#f59e0b'
const SKY    = '#38bdf8'
const PRP    = '#a78bfa'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Networks: como serviços se enxergam (custom)
// ═══════════════════════════════════════════════════════════════════════════════

type NetScenario = {
  id: string
  label: string
  bad: boolean
  description: string
  reachable: Record<string, string[]>
}

const NET_SCENARIOS: NetScenario[] = [
  {
    id: 'default',
    label: 'Rede default (uma só)',
    bad: true,
    description: 'Sem redes declaradas. Todos os serviços ficam na mesma rede default e se enxergam — frontend alcança db direto, sem proteção alguma. Antipattern para qualquer pilha não-trivial.',
    reachable: {
      frontend: ['frontend', 'api', 'db', 'redis'],
      api:      ['frontend', 'api', 'db', 'redis'],
      db:       ['frontend', 'api', 'db', 'redis'],
      redis:    ['frontend', 'api', 'db', 'redis'],
    },
  },
  {
    id: 'isolated',
    label: 'Redes isoladas (estilo VPC)',
    bad: false,
    description: 'frontend-net (frontend + api) e backend-net (api + db + redis). api é a ponte. db e redis não existem para frontend — nem por DNS nem por IP. Padrão recomendado para qualquer pilha real.',
    reachable: {
      frontend: ['frontend', 'api'],
      api:      ['frontend', 'api', 'db', 'redis'],
      db:       ['api', 'db', 'redis'],
      redis:    ['api', 'db', 'redis'],
    },
  },
  {
    id: 'internal',
    label: 'backend-net com internal: true',
    bad: false,
    description: 'Igual a isolada, mas backend-net com internal: true bloqueia até saída para a internet. Defesa em profundidade extra: se db tentar sair (ex: pg_dump exfiltração), falha. Adequado para dados regulados.',
    reachable: {
      frontend: ['frontend', 'api'],
      api:      ['frontend', 'api', 'db', 'redis'],
      db:       ['api', 'db', 'redis'],
      redis:    ['api', 'db', 'redis'],
    },
  },
]

const NET_SERVICES = ['frontend', 'api', 'db', 'redis'] as const

function NetworkIsolationVisual() {
  const [scenarioId, setScenarioId] = useState<string>(NET_SCENARIOS[1].id)
  const [hovered, setHovered] = useState<string | null>(null)
  const scenario = NET_SCENARIOS.find(s => s.id === scenarioId)!

  const reachableFromHover = hovered ? scenario.reachable[hovered] || [] : []

  return (
    <div style={{ fontFamily: "'JetBrains Mono', monospace", color: FG }}>
      <div style={{ marginBottom: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {NET_SCENARIOS.map(s => (
          <button
            key={s.id}
            onClick={() => { setScenarioId(s.id); setHovered(null) }}
            style={{
              padding: '8px 14px',
              fontSize: 11,
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600,
              borderRadius: 8,
              border: `1px solid ${scenarioId === s.id ? (s.bad ? RED : GRN) : LINE}`,
              background: scenarioId === s.id ? (s.bad ? 'rgba(239,68,68,.1)' : 'rgba(74,222,128,.08)') : CARD,
              color: scenarioId === s.id ? (s.bad ? '#fca5a5' : '#86efac') : FGMUTE,
              cursor: 'pointer',
              transition: 'all .15s ease',
            }}
          >
            {s.bad ? 'X ' : 'OK '}{s.label}
          </button>
        ))}
      </div>

      <div style={{
        background: CARD,
        border: `1px solid ${LINE}`,
        borderRadius: 12,
        padding: 22,
        minHeight: 320,
      }}>
        <p style={{ fontSize: 12, color: FGMUTE, lineHeight: 1.6, margin: '0 0 18px' }}>
          <span style={{ color: scenario.bad ? '#fca5a5' : '#86efac', fontWeight: 700 }}>
            {scenario.bad ? 'Antipattern' : 'Padrao recomendado'}:
          </span>{' '}
          {scenario.description}
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 14,
          marginBottom: 18,
        }}>
          {NET_SERVICES.map(svc => {
            const isHovered = hovered === svc
            const isReachable = hovered && reachableFromHover.includes(svc) && hovered !== svc
            const isUnreachable = hovered && !reachableFromHover.includes(svc) && hovered !== svc
            return (
              <div
                key={svc}
                onMouseEnter={() => setHovered(svc)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: isHovered ? `${C}30` : isReachable ? 'rgba(74,222,128,.1)' : isUnreachable ? 'rgba(239,68,68,.05)' : BG,
                  border: `2px solid ${isHovered ? C : isReachable ? GRN : isUnreachable ? 'rgba(239,68,68,.25)' : LINE}`,
                  borderRadius: 10,
                  padding: '14px 12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all .2s ease',
                  opacity: isUnreachable ? 0.45 : 1,
                }}
              >
                <div style={{ fontSize: 18, marginBottom: 6 }}>
                  {svc === 'frontend' ? 'UI' : svc === 'api' ? 'API' : svc === 'db' ? 'DB' : 'CACHE'}
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: FG }}>{svc}</div>
                <div style={{ fontSize: 9, color: FGMUTE, marginTop: 4, letterSpacing: '.05em' }}>
                  {svc === 'frontend' ? 'Next.js :3000' :
                   svc === 'api' ? 'Node :4000' :
                   svc === 'db' ? 'Postgres :5432' : 'Redis :6379'}
                </div>
              </div>
            )
          })}
        </div>

        <div style={{
          background: BG,
          border: `1px solid ${LINE}`,
          borderRadius: 8,
          padding: '12px 14px',
          fontSize: 11,
          color: FGMUTE,
          lineHeight: 1.7,
          minHeight: 60,
        }}>
          {hovered ? (
            <>
              <div style={{ color: C, fontWeight: 700, marginBottom: 6, fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase' }}>
                {hovered} alcanca via DNS interno
              </div>
              <div>
                {reachableFromHover.filter(r => r !== hovered).length === 0 ? (
                  <span style={{ color: FGMUTE }}>nenhum outro servico</span>
                ) : (
                  reachableFromHover.filter(r => r !== hovered).map((svc, i) => (
                    <span key={svc}>
                      {i > 0 && <span style={{ color: LINE, margin: '0 6px' }}>|</span>}
                      <code style={{ color: GRN, fontSize: 11 }}>{svc}:porta</code>
                    </span>
                  ))
                )}
              </div>
              <div style={{ marginTop: 8, color: FGMUTE, fontSize: 10 }}>
                Verde = alcancavel pelo nome de servico via DNS embutido (127.0.0.11). Cinza = nao existe nessa rede.
              </div>
            </>
          ) : (
            <span style={{ color: FGMUTE, fontStyle: 'italic' }}>
              Passe o mouse em qualquer servico para ver o que ele alcanca pelo DNS interno do Compose.
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Volumes comparison (bind vs named vs tmpfs)
// ═══════════════════════════════════════════════════════════════════════════════

const VOL_OPTIONS: ComparisonOption[] = [
  { id: 'bind',  label: 'Bind mount',   sublabel: './host:/container', color: AMB },
  { id: 'named', label: 'Named volume', sublabel: 'gerenciado pelo Docker', color: C },
  { id: 'tmpfs', label: 'tmpfs',        sublabel: 'apenas em RAM', color: GRN },
]

const VOL_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'persistence',
    label: 'Persiste em down sem -v',
    category: 'Dados',
    description: 'O dado sobrevive a docker compose down (sem flag -v)?',
    values: {
      bind:  { rating: 'excellent', note: 'Mora no host — Compose nao toca' },
      named: { rating: 'excellent', note: 'Em /var/lib/docker/volumes — preservado' },
      tmpfs: { rating: 'na',        note: 'Some quando o container para' },
    },
  },
  {
    id: 'hotreload',
    label: 'Hot reload em dev',
    category: 'Dev',
    description: 'Mudanca no host reflete imediato no container?',
    values: {
      bind:  { rating: 'excellent', note: 'Mudanca local refletida na hora' },
      named: { rating: 'poor',      note: 'Disco interno do Docker — sem reflexo do host' },
      tmpfs: { rating: 'na',        note: 'Sem fonte no host' },
    },
  },
  {
    id: 'macperf',
    label: 'Performance no Mac/Win Desktop',
    category: 'Performance',
    description: 'I/O em volumes pesados (node_modules, postgres)',
    values: {
      bind:  { rating: 'fair',      note: 'Cruza VM — lento. Use :cached/:delegated' },
      named: { rating: 'good',      note: 'Disco virtual — bem mais rapido que bind' },
      tmpfs: { rating: 'excellent', note: 'RAM — o mais rapido possivel' },
    },
  },
  {
    id: 'portability',
    label: 'Portabilidade entre maquinas',
    category: 'Operacao',
    description: 'Funciona igual em qualquer host?',
    values: {
      bind:  { rating: 'fair',      note: 'Depende do path existir no host' },
      named: { rating: 'excellent', note: 'Abstracao do Docker — universal' },
      tmpfs: { rating: 'excellent', note: 'Nao depende de disco' },
    },
  },
  {
    id: 'security',
    label: 'Seguranca',
    category: 'Seguranca',
    description: 'Risco de vazar fora do container',
    values: {
      bind:  { rating: 'fair',      note: 'Expoe diretorio do host — cuidado com perm' },
      named: { rating: 'good',      note: 'Isolado em /var/lib/docker' },
      tmpfs: { rating: 'excellent', note: 'Nunca toca disco — ideal para secrets em runtime' },
    },
  },
  {
    id: 'usecase',
    label: 'Caso de uso ideal',
    category: 'Operacao',
    description: 'Onde cada um brilha',
    values: {
      bind:  { rating: 'good',      note: 'Codigo em dev, config read-only' },
      named: { rating: 'excellent', note: 'Postgres, MySQL, uploads, cache do Redis em prod' },
      tmpfs: { rating: 'good',      note: 'Postgres em CI (ramdisk), /tmp, /run' },
    },
  },
  {
    id: 'syntax',
    label: 'Sintaxe no compose.yaml',
    category: 'Sintaxe',
    description: 'Como declarar',
    values: {
      bind:  { rating: 'good', note: '- ./src:/app (volumes:)' },
      named: { rating: 'good', note: '- db_data:/var/lib/postgresql/data + top-level' },
      tmpfs: { rating: 'good', note: '- type: tmpfs ou tmpfs: [/var/run]' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Service startup sequence with healthcheck
// ═══════════════════════════════════════════════════════════════════════════════

const STARTUP_ACTORS: SeqActor[] = [
  { id: 'cli',     label: 'docker compose up', color: C },
  { id: 'engine',  label: 'Compose Engine',    color: SEC },
  { id: 'redis',   label: 'redis',             color: RED },
  { id: 'db',      label: 'db (postgres)',     color: AMB },
  { id: 'api',     label: 'api (node)',        color: GRN },
]

const STARTUP_MESSAGES: SeqMessage[] = [
  { from: 'cli',    to: 'engine', label: 'parse compose.yaml + .env',                type: 'sync' },
  { from: 'engine', to: 'engine', label: 'monta grafo de depends_on',                type: 'sync', note: 'redis e db antes da api' },
  { from: 'engine', to: 'redis',  label: 'create + start (sem deps)',                type: 'async' },
  { from: 'engine', to: 'db',     label: 'create + start (sem deps)',                type: 'async' },
  { from: 'redis',  to: 'engine', label: 'condition: service_started -> ok imediato', type: 'return', note: 'sem healthcheck = so espera PID 1' },
  { from: 'db',     to: 'db',     label: 'healthcheck: pg_isready a cada 5s',        type: 'sync', note: 'retries: 10, start_period: 30s' },
  { from: 'db',     to: 'engine', label: 'condition: service_healthy -> healthy',    type: 'return', note: 'so depois do healthcheck OK' },
  { from: 'engine', to: 'api',    label: 'create + start (deps prontas)',            type: 'async' },
  { from: 'api',    to: 'db',     label: 'connect via DATABASE_URL=postgres://db:5432', type: 'sync', note: 'DNS interno resolve "db"' },
  { from: 'api',    to: 'redis',  label: 'connect via REDIS_URL=redis://redis:6379', type: 'sync' },
  { from: 'api',    to: 'engine', label: 'healthcheck GET /health -> 200',           type: 'return' },
  { from: 'engine', to: 'cli',    label: 'all services healthy (--wait completo)',   type: 'return' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Override files merge (LayerStack mostrando ordem)
// ═══════════════════════════════════════════════════════════════════════════════

const OVERRIDE_LAYERS: Layer[] = [
  {
    id: 'base',
    label: 'compose.yaml (base)',
    sublabel: 'O que e igual em qualquer ambiente',
    description: 'Define a forma da pilha: lista de servicos, imagens base, dependencias entre servicos, networks declaradas. Nao deve ter detalhes de ambiente. Esta na base e nunca muda entre dev/staging/prod — so a forma.',
    code: 'services:\n  api:\n    image: myorg/api\n    environment:\n      PORT: 3000',
    color: C,
    icon: '01',
    examples: ['Lista de servicos', 'Dependencias (depends_on)', 'Networks declaradas', 'Volumes top-level'],
  },
  {
    id: 'override',
    label: 'compose.override.yaml (DEV — auto)',
    sublabel: 'Carregado automaticamente em docker compose up',
    description: 'Acrescenta o que dev precisa: build local em vez de pull, bind mount para hot reload, NODE_ENV=development, comandos de debug. Compose carrega esse arquivo automaticamente sem -f. Listas concatenam, mapas mergem por chave.',
    code: 'services:\n  api:\n    build: .\n    volumes: [./api:/app]\n    environment:\n      NODE_ENV: development',
    color: GRN,
    icon: '02',
    examples: ['build: . (em vez de image:)', 'volumes: [./src:/app]', 'NODE_ENV=development', 'comando: npm run dev'],
  },
  {
    id: 'prod',
    label: 'compose.prod.yaml (PROD — explicito)',
    sublabel: 'So carregado com -f explicito',
    description: 'Ativado via docker compose -f compose.yaml -f compose.prod.yaml up. Image com SHA pin, restart: always, mem_limit, cpus, logging com rotacao. Nunca carregado por engano em dev — explicito por design.',
    code: 'services:\n  api:\n    image: myorg/api:abc1234\n    mem_limit: 512m\n    restart: always',
    color: SEC,
    icon: '03',
    examples: ['image: org/app:SHA pin', 'restart: always', 'mem_limit + cpus', 'logging.options.max-size'],
  },
  {
    id: 'env',
    label: '.env (variaveis fora do YAML)',
    sublabel: 'Valores sensiveis que viram ${VAR}',
    description: 'Compose carrega .env do mesmo diretorio automaticamente. Variaveis viram ${VAR}, ${VAR:-default}, ${VAR:?obrigatorio}. Para ambientes diferentes: --env-file .env.staging. NUNCA commitar .env com secrets — gitignore.',
    code: 'DB_PASSWORD=secret\nAPI_PORT=3000\nVERSION=1.4.2',
    color: AMB,
    icon: '04',
    examples: ['${DB_PASSWORD}', '${VERSION:-latest}', '${VAR:?obrigatorio}', '--env-file .env.staging'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — Restart policies (state machine)
// ═══════════════════════════════════════════════════════════════════════════════

const RESTART_STATES: SMState[] = [
  { id: 'running',  label: 'running',          description: 'Container ativo, processo PID 1 rodando.', color: GRN, isInitial: true },
  { id: 'crashed',  label: 'crashed (exit !=0)', description: 'Processo terminou com erro. Bug, OOM, falha de IO.', color: RED },
  { id: 'exited',   label: 'exited (exit 0)',  description: 'Processo terminou normalmente. Comum em scripts one-shot.', color: AMB },
  { id: 'stopped',  label: 'stopped (manual)', description: 'Voce parou explicitamente: docker compose stop ou Ctrl+C.', color: SEC },
  { id: 'restarting', label: 'restarting',     description: 'Daemon esta esperando antes de subir de novo (backoff).', color: SKY },
]

const RESTART_TRANSITIONS: SMTransition[] = [
  { from: 'running',    to: 'crashed',    event: 'erro / OOM',        guard: 'exit code !=0' },
  { from: 'running',    to: 'exited',     event: 'fim normal',        guard: 'exit code 0 (script)' },
  { from: 'running',    to: 'stopped',    event: 'docker compose stop', guard: 'voce decide' },
  { from: 'crashed',    to: 'restarting', event: 'on-failure / always / unless-stopped' },
  { from: 'exited',     to: 'restarting', event: 'always (so essa)',  guard: 'exit 0 + always' },
  { from: 'stopped',    to: 'restarting', event: 'always (so essa)',  guard: 'reinicia ate em stop manual' },
  { from: 'restarting', to: 'running',    event: 'backoff terminou' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — Anti-patterns
// ═══════════════════════════════════════════════════════════════════════════════

const COMPOSE_ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'depends_on sem healthcheck = teatro',
    wrong: [
      [{ text: 'services:', color: FGMUTE }],
      [{ text: '  api:', color: FGMUTE }],
      [{ text: '    depends_on: [db]', color: RED }, { text: '   # so espera o container iniciar!', color: '#6b7280' }],
      [{ text: '  db:', color: FGMUTE }],
      [{ text: '    image: postgres:16-alpine', color: FGMUTE }],
      [{ text: '    # sem healthcheck — api sobe antes do pg aceitar conexao', color: RED }],
    ],
    right: [
      [{ text: 'services:', color: FGMUTE }],
      [{ text: '  api:', color: FGMUTE }],
      [{ text: '    depends_on:', color: GRN }],
      [{ text: '      db:', color: GRN }],
      [{ text: '        condition: service_healthy', color: GRN }, { text: '   # espera real', color: '#6b7280' }],
      [{ text: '  db:', color: FGMUTE }],
      [{ text: '    image: postgres:16-alpine', color: FGMUTE }],
      [{ text: '    healthcheck:', color: GRN }],
      [{ text: '      test: ["CMD-SHELL", "pg_isready -U app"]', color: GRN }],
      [{ text: '      interval: 5s', color: GRN }, { text: '   retries: 10', color: GRN }],
    ],
    why: 'depends_on sozinho so espera o container iniciar (PID 1 comecou). Nao espera o Postgres aceitar conexao. Sem healthcheck + condition: service_healthy, a api sobe antes do db estar pronto e crasha no primeiro insert.',
  },
  {
    title: 'image: latest em producao',
    wrong: [
      [{ text: 'services:', color: FGMUTE }],
      [{ text: '  api:', color: FGMUTE }],
      [{ text: '    image: myorg/api:latest', color: RED }, { text: '   # muda sem aviso!', color: '#6b7280' }],
      [{ text: '  db:', color: FGMUTE }],
      [{ text: '    image: postgres', color: RED }, { text: '   # tag implicita = latest', color: '#6b7280' }],
    ],
    right: [
      [{ text: 'services:', color: FGMUTE }],
      [{ text: '  api:', color: FGMUTE }],
      [{ text: '    image: myorg/api:1.4.2', color: GRN }, { text: '   # semver fixo', color: '#6b7280' }],
      [{ text: '    # melhor ainda — pin por digest:', color: FGMUTE }],
      [{ text: '    image: myorg/api@sha256:abc1234...', color: GRN }],
      [{ text: '  db:', color: FGMUTE }],
      [{ text: '    image: postgres:16.2-alpine', color: GRN }],
    ],
    why: 'latest nao e reproduzivel: pull pode trazer versao diferente entre builds, e em rebuild de prod quebra. Pin por digest SHA256 e o ouro — garante imagem identica para sempre. Use Dependabot ou Renovate para atualizar com PR controlado.',
  },
  {
    title: 'Secret em environment direto',
    wrong: [
      [{ text: 'services:', color: FGMUTE }],
      [{ text: '  api:', color: FGMUTE }],
      [{ text: '    environment:', color: FGMUTE }],
      [{ text: '      DB_PASSWORD: super_secret_value', color: RED }, { text: '   # vaza em ps, inspect, logs!', color: '#6b7280' }],
      [{ text: '      JWT_SECRET: hardcoded_key_123', color: RED }],
    ],
    right: [
      [{ text: 'services:', color: FGMUTE }],
      [{ text: '  api:', color: FGMUTE }],
      [{ text: '    secrets: [db_password]', color: GRN }],
      [{ text: '    environment:', color: FGMUTE }],
      [{ text: '      DB_PASSWORD_FILE: /run/secrets/db_password', color: GRN }, { text: '   # app le arquivo', color: '#6b7280' }],
      [{ text: '', color: FGMUTE }],
      [{ text: 'secrets:', color: GRN }],
      [{ text: '  db_password:', color: GRN }],
      [{ text: '    file: ./secrets/db_password.txt', color: GRN }],
    ],
    why: 'Variaveis em environment vazam em docker compose ps, docker inspect e ate em logs de erro. O bloco secrets monta arquivo em /run/secrets/<name> com mode 0400 — nunca aparece em ps ou inspect. Em prod serio: Vault, AWS Secrets Manager ou External Secrets Operator do K8s.',
  },
  {
    title: 'compose.override.yaml commitado em prod',
    wrong: [
      [{ text: '# .gitignore vazio — override.yaml versionado', color: RED }],
      [{ text: 'compose.yaml', color: FGMUTE }],
      [{ text: 'compose.override.yaml', color: RED }, { text: '   # config de DEV no repo!', color: '#6b7280' }],
      [{ text: '# em prod: docker compose up carrega override = explode', color: RED }],
    ],
    right: [
      [{ text: '# .gitignore explicito', color: FGMUTE }],
      [{ text: 'compose.override.yaml', color: GRN }, { text: '   # local, por dev', color: '#6b7280' }],
      [{ text: '', color: FGMUTE }],
      [{ text: '# arquivos versionados:', color: FGMUTE }],
      [{ text: 'compose.yaml', color: GRN }, { text: '          # base', color: '#6b7280' }],
      [{ text: 'compose.dev.yaml', color: GRN }, { text: '       # dev compartilhado', color: '#6b7280' }],
      [{ text: 'compose.prod.yaml', color: GRN }, { text: '      # prod', color: '#6b7280' }],
      [{ text: '# uso: docker compose -f compose.yaml -f compose.dev.yaml up', color: FGMUTE }],
    ],
    why: 'compose.override.yaml tem nome magico — Compose carrega automatico. Se commitado, pode ter config de dev (volumes locais, NODE_ENV=development) sendo aplicada em prod silenciosamente. Solucao: gitignore + nomes explicitos por ambiente, todos com -f.',
  },
  {
    title: 'sem profiles — pilha inteira sobe sempre',
    wrong: [
      [{ text: 'services:', color: FGMUTE }],
      [{ text: '  api: { image: myorg/api }', color: FGMUTE }],
      [{ text: '  db:  { image: postgres:16 }', color: FGMUTE }],
      [{ text: '  adminer: { image: adminer }', color: RED }, { text: '   # sobe sempre!', color: '#6b7280' }],
      [{ text: '  jaeger:  { image: jaegertracing/all-in-one }', color: RED }],
      [{ text: '  mailhog: { image: mailhog/mailhog }', color: RED }, { text: '   # dev fica lento', color: '#6b7280' }],
    ],
    right: [
      [{ text: 'services:', color: FGMUTE }],
      [{ text: '  api: { image: myorg/api }', color: FGMUTE }],
      [{ text: '  db:  { image: postgres:16 }', color: FGMUTE }],
      [{ text: '  adminer:', color: FGMUTE }],
      [{ text: '    image: adminer', color: FGMUTE }],
      [{ text: '    profiles: [debug]', color: GRN }, { text: '   # so com --profile debug', color: '#6b7280' }],
      [{ text: '  jaeger:', color: FGMUTE }],
      [{ text: '    image: jaegertracing/all-in-one', color: FGMUTE }],
      [{ text: '    profiles: [tracing]', color: GRN }],
      [{ text: '# uso: docker compose --profile debug up', color: FGMUTE }],
    ],
    why: 'Sem profiles, qualquer servico extra (adminer, mailhog, jaeger, prometheus) sobe junto e consome CPU/RAM ate em dev rapido. profiles: [debug] marca como opcional — so sobe com --profile debug. Mantem dev leve por padrao, e voce liga ferramentas extras quando precisa.',
  },
  {
    title: 'docker-compose (com hifen) — v1 deprecated',
    wrong: [
      [{ text: '# v1 Python — deprecated em 2023', color: RED }],
      [{ text: 'docker-compose up -d', color: RED }],
      [{ text: 'docker-compose logs api', color: RED }],
      [{ text: '# nao tem: profiles, --wait, GPU, healthcheck moderno', color: RED }],
    ],
    right: [
      [{ text: '# v2 Go plugin — atual e mantido', color: GRN }],
      [{ text: 'docker compose up -d', color: GRN }, { text: '   # espaco, nao hifen', color: '#6b7280' }],
      [{ text: 'docker compose logs api', color: GRN }],
      [{ text: 'docker compose up --wait', color: GRN }, { text: '   # espera healthchecks no CI', color: '#6b7280' }],
    ],
    why: 'docker-compose com hifen e a v1 Python — deprecated. docker compose com espaco e a v2 Go, plugin oficial do Docker CLI. v2 e mais rapido, suporta features modernas (profiles, --wait, GPU, secrets sintaxe atual) e gerencia signals melhor. Se README de projeto ainda usa hifen, e sinal de codigo desatualizado.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 7 — Decision tree: Compose vs Swarm vs K8s vs ECS
// ═══════════════════════════════════════════════════════════════════════════════

const DECISION_ROOT: DTNode = {
  id: 'root',
  question: 'Quantos hosts voce vai rodar a pilha?',
  detail: 'O numero de hosts determina o tipo de orquestrador. Compose e single-host por design — para multi-host voce precisa de outra coisa.',
  children: [
    { label: 'Single host', nodeId: 'single', color: C },
    { label: 'Multi host', nodeId: 'multi', color: SEC },
  ],
}

const DECISION_NODES: Record<string, DTNode> = {
  single: {
    id: 'single',
    question: 'O ambiente e dev, CI ou prod pequeno?',
    detail: 'Para single-host, a escolha vai ser quase sempre Docker Compose — variando so em casos onde a empresa ja tem orquestrador maior.',
    children: [
      { label: 'Dev local / time', nodeId: 'dev-compose', color: GRN },
      { label: 'CI / testes integrados', nodeId: 'ci-compose', color: SKY },
      { label: 'Prod pequeno (1 host)', nodeId: 'prod-single', color: AMB },
    ],
  },
  multi: {
    id: 'multi',
    question: 'O time tem maturidade e ferramenta para K8s?',
    detail: 'K8s e o padrao de mercado para multi-host, mas tem custo operacional alto. Para times menores, ECS/Fargate ou plataformas managed sao alternativas pragmaticas.',
    children: [
      { label: 'Sim — K8s e padrao na empresa', nodeId: 'k8s', color: SEC },
      { label: 'Time pequeno, AWS-first', nodeId: 'ecs', color: AMB },
      { label: 'Quero serverless puro', nodeId: 'serverless', color: GRN },
    ],
  },
  'dev-compose': {
    id: 'dev-compose',
    recommendation: 'Docker Compose',
    detail: 'Padrao da industria para dev local. Todo time backend usa. Override files (auto-loaded), profiles para debug tools, hot reload via bind mount, healthcheck para depends_on real. Setup em 1 minuto, sobe em segundos.',
    color: C,
    icon: 'dev',
  },
  'ci-compose': {
    id: 'ci-compose',
    recommendation: 'Docker Compose com tmpfs',
    detail: 'Compose em CI e oficial — GitHub Actions, GitLab, CircleCI suportam. Otimize com tmpfs em /var/lib/postgresql/data (ramdisk = sem disco), --abort-on-container-exit, --exit-code-from test, healthcheck rapido (interval 2s). Sub-pilha completa em < 60s.',
    color: SKY,
    icon: 'CI',
  },
  'prod-single': {
    id: 'prod-single',
    recommendation: 'Docker Compose ainda vale',
    detail: 'Prod single-host pequeno (site institucional, painel interno, app de empresa pequena) — Compose entrega. unless-stopped, healthchecks, mem_limit/cpus, secrets via bloco secrets, volumes nomeados, image com SHA pin. K8s seria overkill — overhead operacional come a velocidade.',
    color: AMB,
    icon: 'P1',
  },
  k8s: {
    id: 'k8s',
    recommendation: 'Kubernetes',
    detail: 'Multi-host, multi-AZ, rolling update sem downtime, auto-scaling horizontal, service mesh, networkpolicies. Use managed: EKS, GKE, AKS para evitar operar control plane. Compose em dev + K8s em prod e o padrao mais comum em empresa de tamanho medio para grande.',
    color: SEC,
    icon: 'K8s',
  },
  ecs: {
    id: 'ecs',
    recommendation: 'ECS / Fargate',
    detail: 'Tasks definidas em JSON parecido com Compose, scheduling pelo AWS, sem control plane para operar. Bom meio-termo entre Compose e K8s para times AWS-first. Limitacao: lock-in AWS, menos comunidade que K8s.',
    color: AMB,
    icon: 'ECS',
  },
  serverless: {
    id: 'serverless',
    recommendation: 'Lambda / Cloud Run / Fly Machines',
    detail: 'Sem container persistente — cada request sobe instancia. Otimo para APIs stateless, jobs sob demanda. Cuidado com cold start, time limit (15min Lambda), tamanho de imagem. Nao serve para state (DB) — combine com RDS/Dynamo.',
    color: GRN,
    icon: 'fn',
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 8 — Build vs Image: quando usar cada
// ═══════════════════════════════════════════════════════════════════════════════

const BUILD_LAYERS: Layer[] = [
  {
    id: 'image-only',
    label: 'image: org/app:tag (so)',
    sublabel: 'Pull de registry — sem build',
    description: 'Servico usa imagem pre-construida do registry. Compose so faz docker pull e roda. Padrao para servicos third-party (postgres, redis, nginx) e para o seu codigo em prod (ja construido pelo CI). Reproduzivel — todas as maquinas pegam a mesma imagem.',
    code: 'services:\n  db:\n    image: postgres:16-alpine\n  api:\n    image: myorg/api:1.4.2',
    color: C,
    icon: 'pull',
    examples: ['Servicos third-party (postgres, redis, nginx)', 'Seu codigo em prod (CI ja construiu)', 'Imagens pinadas por SHA', 'Reproducao perfeita entre maquinas'],
  },
  {
    id: 'build-only',
    label: 'build: ./api (sem image)',
    sublabel: 'Compila local, sem registry',
    description: 'Compose faz docker build a partir do Dockerfile do diretorio. Imagem fica so na maquina local — cada dev tem a sua. Otimo para dev quando a imagem ainda nao esta no registry. Em CI: build e push como passos separados, evite essa forma em pipelines.',
    code: 'services:\n  api:\n    build: ./api\n    # sem campo image — imagem fica anonima',
    color: AMB,
    icon: 'fwd',
    examples: ['Dev local sem registry', 'POC inicial', 'Imagens nunca publicadas', 'Codigo em monorepo dev'],
  },
  {
    id: 'build-and-image',
    label: 'build: + image: (combinado)',
    sublabel: 'Build local com nome explicito',
    description: 'Compose buildaa partir do Dockerfile E nomeia a imagem resultante. Util para: dar nome em dev (docker images mostra nome legivel), preparar imagem para push manual (docker compose push). E o padrao recomendado para development de servicos proprios.',
    code: 'services:\n  api:\n    build: ./api\n    image: myorg/api:dev',
    color: GRN,
    icon: 'tag',
    examples: ['Dev de servicos proprios', 'docker compose push para registry', 'Nomear imagens em ferramentas locais', 'Cache_from de imagem do registry'],
  },
  {
    id: 'build-advanced',
    label: 'build: { context, dockerfile, args, target }',
    sublabel: 'Forma objeto — controle fino',
    description: 'Quando precisa de mais controle: context (raiz do build, fora da pasta), dockerfile (arquivo customizado), args (build-time vars), target (stage do multi-stage), cache_from (acelera CI), tags (multiplos nomes). Em CI maduro essa forma e essencial.',
    code: 'build:\n  context: .\n  dockerfile: Dockerfile.prod\n  target: production\n  args: { NODE_VERSION: "20" }\n  cache_from: [myorg/api:cache]',
    color: SEC,
    icon: 'cfg',
    examples: ['Multi-stage com target', 'Args para versao do runtime', 'Dockerfile.prod separado', 'cache_from em CI (economiza minutos)'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 9 — Jornada Compose
// ═══════════════════════════════════════════════════════════════════════════════

const COMPOSE_LEVELS: ProgressionLevel[] = [
  {
    id: 'iniciante',
    name: 'Iniciante',
    label: 'Primeiros passos',
    emoji: '01',
    concepts: [
      { name: 'docker compose up / down', tip: 'Ciclo basico. -d para background. down -v remove volumes (cuidado).' },
      { name: 'services com image:', tip: 'Cada chave em services e um container. image: pull do registry, build: compila.' },
      { name: 'ports: "host:container"', tip: 'Mapeia porta do host para porta do container. So exponha o que precisa.' },
      { name: 'environment basico', tip: 'KEY: value inline. Para .env: ${VAR}. Nunca commit secrets em environment.' },
      { name: 'volumes nomeados basicos', tip: 'db_data:/var/lib/postgresql/data + declaracao em volumes top-level. Sobrevive a down.' },
      { name: 'depends_on simples', tip: 'Define ordem de start mas nao espera servico ficar pronto — so PID 1 iniciar.' },
    ],
  },
  {
    id: 'pleno',
    name: 'Pleno',
    label: 'Operacao real',
    emoji: '02',
    concepts: [
      { name: 'healthcheck + condition: service_healthy', tip: 'depends_on real — espera o servico aceitar conexao, nao so o container iniciar.' },
      { name: 'compose.override.yaml (auto)', tip: 'Carregado automatico em up. Padrao para dev: build local, hot reload, NODE_ENV.' },
      { name: 'profiles: [debug, monitoring]', tip: 'Servicos opcionais. So sobem com --profile debug. Mantem dev leve por padrao.' },
      { name: '.env e ${VAR:?obrigatorio}', tip: 'Compose carrega .env auto. ${VAR:?msg} falha se nao definida — feedback rapido.' },
      { name: 'docker compose config', tip: 'Mostra YAML final apos merge e expansao. Indispensavel para debugar override e .env.' },
      { name: 'docker compose logs / exec / ps', tip: 'Operacao diaria. logs -f para seguir, exec para shell, ps para status.' },
      { name: 'restart: unless-stopped', tip: 'Padrao saudavel. always reinicia ate em stop manual; on-failure so em exit !=0.' },
    ],
  },
  {
    id: 'senior',
    name: 'Senior',
    label: 'Producao e seguranca',
    emoji: '03',
    concepts: [
      { name: 'Networks isoladas estilo VPC', tip: 'frontend-net + backend-net. api e ponte. db so backend. internal: true bloqueia internet.' },
      { name: 'Override files por ambiente', tip: 'compose.yaml + compose.prod.yaml com -f explicito. SHA pin, mem_limit, restart: always.' },
      { name: 'Bloco secrets (nao environment)', tip: 'Monta arquivo em /run/secrets. Nao vaza em ps, inspect ou logs. Em prod serio: Vault.' },
      { name: 'Resource limits (mem_limit, cpus)', tip: 'Sem limit, container vira noisy neighbor. Em prod single-host obrigatorio.' },
      { name: 'tmpfs para CI', tip: 'tmpfs: [/var/lib/postgresql/data] = ramdisk. Postgres em CI sobe em segundos, sem disco.' },
      { name: '--wait no CI', tip: 'docker compose up --wait espera healthchecks ficarem OK antes de retornar. Essencial para CI.' },
      { name: 'logging: max-size + max-file', tip: 'Sem rotacao, log file cresce indefinidamente e enche disco. json-file driver com 10m/3 e seguro.' },
    ],
  },
  {
    id: 'especialista',
    name: 'Especialista',
    label: 'Profundidade e migracoes',
    emoji: '04',
    concepts: [
      { name: 'Compose -> K8s migration path', tip: 'Kompose converte compose.yaml em manifests K8s. Bom ponto de partida — refine com probes/HPA/configmap.' },
      { name: 'GPU em Compose (deploy.resources.devices)', tip: 'NVIDIA driver + nvidia-container-toolkit. count: 1 ou device_ids: ["0"]. Para ML local.' },
      { name: '!reset em override (Compose 2.24+)', tip: 'Limpa lista herdada da base. Util quando merge concatena algo que nao deveria.' },
      { name: 'External networks/volumes', tip: 'external: true reusa rede/volume criado fora. Permite stacks separadas conversarem.' },
      { name: 'docker compose watch (sync mode)', tip: 'v2.22+. Sincroniza arquivos do host para container sem bind mount — mais rapido em Mac/Win.' },
      { name: 'Multi-arch com buildx no compose', tip: 'platforms: [linux/amd64, linux/arm64] no build. Imagem unica para Mac M1 e Linux x86.' },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export default function DockerComposeVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'networks',
      title: 'Networks — quem alcanca quem',
      subtitle: 'Default vs isolada vs internal — DNS interno e isolamento estilo VPC',
      accent: C,
      component: <NetworkIsolationVisual />,
    },
    {
      id: 'volumes',
      title: 'Volumes: bind vs named vs tmpfs',
      subtitle: 'Persistencia, hot reload, performance e seguranca por tipo',
      accent: AMB,
      component: (
        <ComparisonTable
          options={VOL_OPTIONS}
          criteria={VOL_CRITERIA}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'startup-sequence',
      title: 'Sequencia de subida com healthcheck',
      subtitle: 'depends_on + healthcheck — quando a api realmente sobe',
      accent: GRN,
      component: (
        <SequenceDiagram
          actors={STARTUP_ACTORS}
          messages={STARTUP_MESSAGES}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'override-files',
      title: 'Override files — base + dev + prod',
      subtitle: 'Estrategia DRY: o que e igual fica na base; o que muda fica em arquivos sobrepostos',
      accent: SEC,
      component: (
        <LayerStack
          layers={OVERRIDE_LAYERS}
          accentColor={C}
          bgColor={BG}
          direction="top-down"
        />
      ),
    },
    {
      id: 'restart-policies',
      title: 'Restart policies — quando reiniciar',
      subtitle: 'no, on-failure, always, unless-stopped — o que cada uma faz em crash vs stop manual',
      accent: SKY,
      component: (
        <StateMachineExplorer
          states={RESTART_STATES}
          transitions={RESTART_TRANSITIONS}
          initialState="running"
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'antipatterns',
      title: 'Anti-patterns do Compose',
      subtitle: 'Os 6 erros mais comuns que aparecem em PR review e em entrevista',
      accent: RED,
      component: (
        <AntiPatternsGallery
          patterns={COMPOSE_ANTIPATTERNS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'orchestrator-decision',
      title: 'Compose vs K8s vs ECS — qual escolher?',
      subtitle: 'Arvore de decisao por numero de hosts, maturidade do time e ambiente',
      accent: PRP,
      component: (
        <DecisionTree
          root={DECISION_ROOT}
          nodes={DECISION_NODES}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'build-vs-image',
      title: 'build vs image — quando usar cada',
      subtitle: 'Pull do registry, compilacao local, combinacao e forma avancada com target/args',
      accent: AMB,
      component: (
        <LayerStack
          layers={BUILD_LAYERS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'progression',
      title: 'Jornada Compose — do iniciante ao especialista',
      subtitle: 'Primeiros passos -> operacao real -> producao e seguranca -> migracoes',
      accent: C,
      component: (
        <ProgressionMap
          levels={COMPOSE_LEVELS}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          heading="Dominio Docker Compose"
          description="Clique em qualquer conceito para ver a dica. Marque os que ja domina."
        />
      ),
    },
  ]

  // suppress unused warnings for shared palette consts
  void LINE; void FG; void FGMUTE; void SEC; void GRN; void RED; void AMB; void SKY; void PRP

  return (
    <VisuaisShell
      visuals={visuals}
      active={active}
      onChange={setActive}
    />
  )
}
