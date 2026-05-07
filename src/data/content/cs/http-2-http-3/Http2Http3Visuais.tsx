'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { SequenceDiagram } from '@/components/visuals/SequenceDiagram'
import type { SeqActor, SeqMessage, SeqGroup } from '@/components/visuals/SequenceDiagram'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'
import { ProgressionMap } from '@/components/visuals/ProgressionMap'
import type { ProgressionLevel } from '@/components/visuals/ProgressionMap'

// ── Paleta HTTP Versions ──────────────────────────────────────────────────────
const C      = '#06b6d4'   // cyan — protocolos de rede
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#4ade80'
const RED    = '#ef4444'
const AMB    = '#f59e0b'
const PRP    = '#a78bfa'

void LINE; void FGMUTE; void FG

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — HTTP/2 Multiplexing vs HTTP/1.1 (SequenceDiagram)
// Mostra o contraste temporal entre os dois protocolos — impossível explicar
// só com texto a diferença de "fila serial" vs "streams intercalados"
// ═══════════════════════════════════════════════════════════════════════════════

const H2_ACTORS: SeqActor[] = [
  { id: 'browser', label: 'Browser', color: C },
  { id: 'server',  label: 'Servidor (HTTP/2)', color: GRN },
]

const H2_MESSAGES: SeqMessage[] = [
  { from: 'browser', to: 'server', label: 'HEADERS frame — stream 1 (GET /html)', note: 'Todos os streams iniciam imediatamente — sem esperar', type: 'sync' },
  { from: 'browser', to: 'server', label: 'HEADERS frame — stream 3 (GET /style.css)', type: 'sync' },
  { from: 'browser', to: 'server', label: 'HEADERS frame — stream 5 (GET /app.js)', type: 'sync' },
  { from: 'server',  to: 'browser', label: 'DATA frame — stream 1 parcial (HTML chunk 1)', note: 'Frames de streams diferentes chegam intercalados', type: 'return' },
  { from: 'server',  to: 'browser', label: 'DATA frame — stream 3 (CSS completo)', type: 'return' },
  { from: 'server',  to: 'browser', label: 'DATA frame — stream 1 parcial (HTML chunk 2)', note: 'HTML é maior — stream 1 tem mais frames DATA', type: 'return' },
  { from: 'server',  to: 'browser', label: 'DATA frame — stream 5 (JS completo)', type: 'return' },
  { from: 'server',  to: 'browser', label: 'DATA frame — stream 1 (HTML final)', type: 'return' },
]

const H2_GROUPS: SeqGroup[] = [
  { label: '1 conexão TCP — múltiplos streams intercalados', kind: 'alt', fromMsg: 0, toMsg: 7, color: `${C}18` },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — QUIC Handshake vs TCP+TLS (SequenceDiagram)
// A economia de RTT só fica clara quando você vê os passos um a um
// ═══════════════════════════════════════════════════════════════════════════════

const QUIC_ACTORS: SeqActor[] = [
  { id: 'client', label: 'Client (Browser)', color: C },
  { id: 'server', label: 'Server (HTTP/3)', color: AMB },
]

const QUIC_MESSAGES: SeqMessage[] = [
  // Nova conexão QUIC — 1-RTT
  { from: 'client', to: 'server', label: 'Initial Packet: QUIC handshake + TLS ClientHello', note: 'TCP + TLS juntos em 1 pacote — diferença fundamental do QUIC', type: 'sync' },
  { from: 'server', to: 'client', label: 'Initial + Handshake: TLS ServerHello + cert + Finished', note: '1 RTT total para estabelecer conexão segura', type: 'return' },
  { from: 'client', to: 'server', label: 'Handshake: TLS Finished + primeira request HTTP/3', note: 'Dados já na finalização do handshake', type: 'sync' },
  { from: 'server', to: 'client', label: 'Resposta HTTP/3 (stream 0)', type: 'return' },
  // Reconexão com 0-RTT
  { from: 'client', to: 'server', label: '0-RTT: Request com session ticket da conexão anterior', note: '0-RTT: dados na PRIMEIRA mensagem — sem aguardar handshake', type: 'async' },
  { from: 'server', to: 'client', label: 'Resposta imediata (0-RTT aceito)', note: 'Atenção: 0-RTT vulnerável a replay — usar só em GET/idempotente', type: 'return' },
  // Migração de IP
  { from: 'client', to: 'server', label: 'PATH_CHALLENGE (novo IP — trocou wifi → 4G)', note: 'Connection ID permanece o mesmo — identificação independente de IP', type: 'sync' },
  { from: 'server', to: 'client', label: 'PATH_RESPONSE — conexão continua, IP novo reconhecido', note: 'Sem reconexão, sem interrupção — TCP precisaria abrir nova conexão', type: 'return' },
]

const QUIC_GROUPS: SeqGroup[] = [
  { label: 'Nova conexão: 1 RTT (TCP+TLS integrados)', kind: 'alt', fromMsg: 0, toMsg: 3, color: `${C}18` },
  { label: 'Reconexão: 0 RTT com session ticket', kind: 'opt', fromMsg: 4, toMsg: 5, color: `${GRN}15` },
  { label: 'Migração de IP via Connection ID', kind: 'ref', fromMsg: 6, toMsg: 7, color: `${AMB}15` },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Comparação HTTP/1.1 vs HTTP/2 vs HTTP/3
// Múltiplas dimensões simultâneas — ComparisonTable é ideal
// ═══════════════════════════════════════════════════════════════════════════════

const CMP_OPTIONS: ComparisonOption[] = [
  { id: 'h1', label: 'HTTP/1.1', sublabel: 'RFC 7230', color: FGMUTE },
  { id: 'h2', label: 'HTTP/2',   sublabel: 'RFC 7540', color: C },
  { id: 'h3', label: 'HTTP/3',   sublabel: 'RFC 9114', color: GRN },
]

const CMP_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'transport',
    label: 'Protocolo de Transporte',
    category: 'Fundamentos',
    description: 'Qual protocolo de transporte é usado na camada abaixo',
    values: {
      h1: { rating: 'fair',      note: 'TCP (1-conexão-por-request ou keep-alive serial)' },
      h2: { rating: 'good',      note: 'TCP (com multiplexing em camada de app)' },
      h3: { rating: 'excellent', note: 'QUIC sobre UDP (streams independentes na camada de transporte)' },
    },
  },
  {
    id: 'multiplexing',
    label: 'Multiplexing',
    category: 'Performance',
    description: 'Capacidade de processar múltiplas requisições simultaneamente',
    values: {
      h1: { rating: 'poor',      note: 'Sem multiplexing — uma request por vez por conexão' },
      h2: { rating: 'good',      note: 'Multiplexing em camada de aplicação — N streams em 1 TCP' },
      h3: { rating: 'excellent', note: 'Multiplexing nativo em QUIC — streams realmente independentes' },
    },
  },
  {
    id: 'hol',
    label: 'Head-of-Line Blocking',
    category: 'Performance',
    description: 'Impacto de perda de pacote ou delay em requests paralelos',
    values: {
      h1: { rating: 'poor',      note: 'HoL em app E em TCP — duplo problema' },
      h2: { rating: 'fair',      note: 'HoL resolvido na app, mas TCP HoL persiste com packet loss' },
      h3: { rating: 'excellent', note: 'Sem HoL — loss em stream 3 não bloqueia stream 5' },
    },
  },
  {
    id: 'handshake',
    label: 'Latência de Handshake',
    category: 'Performance',
    description: 'RTTs necessários antes da primeira troca de dados',
    values: {
      h1: { rating: 'poor',      note: '3.5 RTT (TCP 1-RTT + TLS 1.2 2-RTT + 0.5 RTT)' },
      h2: { rating: 'fair',      note: '2 RTT (TCP 1-RTT + TLS 1.3 1-RTT)' },
      h3: { rating: 'excellent', note: '1 RTT nova / 0-RTT reconexão (QUIC integra TCP+TLS)' },
    },
  },
  {
    id: 'headers',
    label: 'Compressão de Headers',
    category: 'Eficiência',
    description: 'Como os headers HTTP são transmitidos',
    values: {
      h1: { rating: 'poor',      note: 'Headers ASCII texto plano — repetidos em cada request' },
      h2: { rating: 'excellent', note: 'HPACK — dicionário dinâmico, headers repetidos viram 1 byte' },
      h3: { rating: 'excellent', note: 'QPACK — versão adaptada do HPACK para streams independentes QUIC' },
    },
  },
  {
    id: 'ip-migration',
    label: 'Migração de IP',
    category: 'Mobile',
    description: 'Comportamento ao trocar de rede (wifi → 4G)',
    values: {
      h1: { rating: 'poor',      note: 'Conexão cai — nova TCP+TLS necessária' },
      h2: { rating: 'poor',      note: 'Conexão cai — mesma limitação TCP' },
      h3: { rating: 'excellent', note: 'Connection ID mantém sessão através da troca de IP' },
    },
  },
  {
    id: 'adoption',
    label: 'Adoção (2026)',
    category: 'Ecossistema',
    description: 'Uso real em produção e suporte de ferramentas',
    values: {
      h1: { rating: 'good',      note: 'Legado universal — todo servidor suporta' },
      h2: { rating: 'excellent', note: '~80% dos sites, gRPC, todos os CDNs' },
      h3: { rating: 'good',      note: 'Cloudflare, Google, Fastly — backend origin ainda migrando' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Stack de Protocolos: HTTP/1.1 vs HTTP/2 vs HTTP/3 (LayerStack)
// Hierarquia de camadas é exatamente o que LayerStack comunica bem
// ═══════════════════════════════════════════════════════════════════════════════

const H3_LAYERS: Layer[] = [
  {
    id: 'app',
    label: 'HTTP/3 (Aplicação)',
    sublabel: 'RFC 9114',
    description: 'Semantics HTTP: métodos, status, headers. Idêntico ao HTTP/2 semanticamente, mas usa QPACK para headers e frames adaptados ao QUIC.',
    code: 'GET /api/users HTTP/3\n:method = GET\n:path = /api/users',
    color: C,
    examples: ['HEADERS frame', 'DATA frame', 'SETTINGS', 'GOAWAY'],
  },
  {
    id: 'quic',
    label: 'QUIC (Transporte)',
    sublabel: 'RFC 9000 — sobre UDP',
    description: 'Protocolo de transporte novo implementado em userspace. Streams independentes, controle de congestionamento, retransmissão por stream. TLS 1.3 integrado ao handshake.',
    code: 'Stream ID: 0, 4, 8...\nConnection ID: 64-bit\n0-RTT / 1-RTT handshake',
    color: AMB,
    examples: ['Stream frames', 'ACK frames', 'CRYPTO frames', 'PATH_CHALLENGE'],
  },
  {
    id: 'udp',
    label: 'UDP (Transporte)',
    sublabel: 'RFC 768 — sem conexão',
    description: 'UDP fornece apenas datagrams — sem garantia de entrega ou ordem. QUIC implementa todas as garantias que precisava em userspace, sem depender de mudanças no kernel.',
    code: 'Porta src → Porta dst\nSem handshake\nSem estado de conexão',
    color: PRP,
    examples: ['Datagram', 'Checksum opcional', 'Sem ACK nativo'],
  },
  {
    id: 'ip',
    label: 'IP (Rede)',
    sublabel: 'IPv4 / IPv6',
    description: 'Roteamento de pacotes. HTTP/3 via QUIC/UDP/IP. A troca de IP não quebra a conexão QUIC graças ao Connection ID.',
    color: FGMUTE,
    examples: ['Pacote IPv4/IPv6', 'Routing', 'TTL'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — Progression Map: Jornada de aprendizado HTTP
// ═══════════════════════════════════════════════════════════════════════════════

const PROGRESSION_LEVELS: ProgressionLevel[] = [
  {
    id: 'junior',
    name: 'Júnior',
    label: 'Fundamentos',
    emoji: '🌱',
    concepts: [
      { name: 'HTTP é request/response', tip: 'Client pergunta, server responde — o protocolo fundamental da web' },
      { name: 'HTTP/1.1 keep-alive', tip: 'Reuso de conexão TCP para múltiplos requests sem novo handshake' },
      { name: 'Status codes (2xx/4xx/5xx)', tip: '200 OK, 404 Not Found, 429 Too Many Requests, 503 Unavailable' },
      { name: 'Headers básicos', tip: 'Content-Type, Authorization, Cache-Control, Accept' },
    ],
  },
  {
    id: 'pleno',
    name: 'Pleno',
    label: 'HTTP/2',
    emoji: '⚡',
    concepts: [
      { name: 'Multiplexing em HTTP/2', tip: 'N streams em 1 TCP — sem fila serial por conexão' },
      { name: 'HPACK header compression', tip: 'Tabela dinâmica: headers repetidos (Authorization, User-Agent) viram 1 byte' },
      { name: 'Binary framing', tip: 'Frames binários (HEADERS, DATA, SETTINGS) em vez de ASCII' },
      { name: 'HoL blocking em TCP', tip: 'Perda de 1 pacote TCP bloqueia TODOS os streams HTTP/2' },
      { name: 'Server Push deprecated', tip: 'Foi removido dos browsers — use 103 Early Hints' },
    ],
  },
  {
    id: 'senior',
    name: 'Sênior',
    label: 'HTTP/3 / QUIC',
    emoji: '🚀',
    concepts: [
      { name: 'QUIC sobre UDP', tip: 'Userspace, streams independentes, TLS 1.3 integrado, Connection ID' },
      { name: 'Alt-Svc para negociação', tip: 'Alt-Svc: h3=":443" anuncia HTTP/3 — fallback automático para TCP' },
      { name: '0-RTT e replay risk', tip: '0-RTT só seguro em endpoints idempotentes (GET) — POST é vulnerável a replay' },
      { name: 'Connection ID e migração de IP', tip: 'Sessão persiste através de mudança wifi → 4G sem reconexão' },
      { name: 'Rate limit L7 obrigatório com HTTP/2', tip: 'Rate limit por conexão TCP não funciona — HTTP/2 faz N streams numa TCP' },
    ],
  },
  {
    id: 'especialista',
    name: 'Especialista',
    label: 'Internals e Trade-offs',
    emoji: '🔬',
    concepts: [
      { name: 'QPACK vs HPACK', tip: 'QPACK adaptado para streams independentes do QUIC — sem bloqueio entre streams de headers' },
      { name: 'QUIC congestion control', tip: 'BBR ou Cubic em userspace — pode ser atualizado sem mudança de kernel' },
      { name: 'HTTP/3 em gRPC', tip: 'gRPC usa HTTP/2 obrigatório — HTTP/3 ainda não é padrão em microsserviços internos' },
      { name: 'QUIC em firewall hostil', tip: 'UDP bloqueado em firewalls corporativos — fallback TCP é crítico' },
      { name: 'Sliding window e ACK em QUIC', tip: 'ACK por stream em QUIC vs ACK de byte-stream em TCP — evita HOL no kernel' },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// Componente principal
// ═══════════════════════════════════════════════════════════════════════════════

export default function HttpVersionsVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'h2-multiplexing',
      title: 'HTTP/2 Multiplexing',
      subtitle: 'Streams intercalados em uma única conexão TCP — sem fila serial',
      accent: C,
      component: (
        <SequenceDiagram
          actors={H2_ACTORS}
          messages={H2_MESSAGES}
          groups={H2_GROUPS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'quic-handshake',
      title: 'QUIC Handshake e Migração de IP',
      subtitle: '1-RTT nova conexão, 0-RTT retorno, migração de IP sem interrupção',
      accent: AMB,
      component: (
        <SequenceDiagram
          actors={QUIC_ACTORS}
          messages={QUIC_MESSAGES}
          groups={QUIC_GROUPS}
          accentColor={AMB}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'comparison',
      title: 'HTTP/1.1 vs HTTP/2 vs HTTP/3',
      subtitle: 'Comparação em 7 dimensões — performance, segurança e adoção',
      accent: C,
      component: (
        <ComparisonTable
          options={CMP_OPTIONS}
          criteria={CMP_CRITERIA}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'protocol-stack',
      title: 'Stack HTTP/3: QUIC sobre UDP',
      subtitle: 'Como HTTP/3 se encaixa nas camadas de rede — por que UDP e não TCP',
      accent: AMB,
      component: (
        <LayerStack
          layers={H3_LAYERS}
          accentColor={AMB}
          bgColor={BG}
          cardColor={CARD}
          direction="top-down"
        />
      ),
    },
    {
      id: 'progression',
      title: 'Jornada de Aprendizado',
      subtitle: 'Do básico HTTP/1.1 aos internals do QUIC — o que cada nível deve saber',
      accent: GRN,
      component: (
        <ProgressionMap
          levels={PROGRESSION_LEVELS}
          accentColor={GRN}
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
