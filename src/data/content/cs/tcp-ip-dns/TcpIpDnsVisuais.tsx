'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { SequenceDiagram } from '@/components/visuals/SequenceDiagram'
import type { SeqActor, SeqMessage, SeqGroup } from '@/components/visuals/SequenceDiagram'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { ProgressionMap } from '@/components/visuals/ProgressionMap'
import type { ProgressionLevel } from '@/components/visuals/ProgressionMap'

// ── Paleta TCP/IP/DNS ─────────────────────────────────────────────────────────
const C      = '#3b82f6'   // azul — networking
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#4ade80'
const AMB    = '#f59e0b'
const PRP    = '#a78bfa'
const RED    = '#ef4444'

void LINE; void FG; void FGMUTE

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — DNS Resolution completa (SequenceDiagram)
// ═══════════════════════════════════════════════════════════════════════════════

const DNS_ACTORS: SeqActor[] = [
  { id: 'browser',  label: 'Browser / App', color: C },
  { id: 'resolver', label: 'Resolver Recursivo (8.8.8.8)', color: AMB },
  { id: 'root',     label: 'Root Nameserver (.)', color: GRN },
  { id: 'tld',      label: 'TLD Nameserver (.com)', color: PRP },
  { id: 'auth',     label: 'Authoritative (google.com)', color: RED },
]

const DNS_MESSAGES: SeqMessage[] = [
  // Cache hit fast path
  { from: 'browser',  to: 'resolver', label: 'Query A google.com (UDP porta 53)', note: 'Mensagem binária de 30 bytes. TTL controla por quanto tempo a resposta é cacheada.', type: 'sync' },
  // Cache miss: full recursive
  { from: 'resolver', to: 'root',     label: 'Query: quem é responsável por .com?', note: 'Root servers sabem quais nameservers gerenciam cada TLD. Existem 13 clusters anycast.', type: 'sync' },
  { from: 'root',     to: 'resolver', label: 'Referral: a.gtld-servers.net gerencia .com', type: 'return' },
  { from: 'resolver', to: 'tld',      label: 'Query: quem é responsável por google.com?', note: 'TLD nameserver sabe qual nameserver é autoritativo para cada domínio registrado.', type: 'sync' },
  { from: 'tld',      to: 'resolver', label: 'Referral: ns1.google.com é o autoritativo', type: 'return' },
  { from: 'resolver', to: 'auth',     label: 'Query: qual o A record de google.com?', note: 'Nameserver autoritativo tem os registros reais. É a fonte da verdade.', type: 'sync' },
  { from: 'auth',     to: 'resolver', label: 'Resposta: 142.250.190.14 (TTL: 300s)', note: 'TTL 300s = resposta cacheada pelo resolver por 5 minutos.', type: 'return' },
  { from: 'resolver', to: 'resolver', label: 'Cacheia resposta por TTL (300s)', type: 'create' },
  { from: 'resolver', to: 'browser',  label: 'Resposta: 142.250.190.14', type: 'return' },
  // Segunda query — cache hit
  { from: 'browser',  to: 'resolver', label: '[Segunda query] google.com?', note: 'Cache hit! O resolver responde sem consultar nenhum nameserver.', type: 'sync' },
  { from: 'resolver', to: 'browser',  label: 'Cache HIT: 142.250.190.14 (TTL restante: 280s)', note: 'Enquanto TTL > 0, não há overhead de lookups. É por isso que mudar DNS não propaga instantaneamente.', type: 'return' },
]

const DNS_GROUPS: SeqGroup[] = [
  { label: 'Resolução recursiva completa (cache miss) — ~50-200ms', kind: 'alt', fromMsg: 1, toMsg: 7, color: `${AMB}15` },
  { label: 'Cache hit — <1ms', kind: 'loop', fromMsg: 9, toMsg: 10, color: `${GRN}15` },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — TCP 3-way handshake + dados + encerramento (SequenceDiagram)
// ═══════════════════════════════════════════════════════════════════════════════

const TCP_ACTORS: SeqActor[] = [
  { id: 'client', label: 'Cliente (porta 54321)', color: C },
  { id: 'server', label: 'Servidor (porta 443)', color: GRN },
]

const TCP_MESSAGES: SeqMessage[] = [
  // 3-way handshake
  { from: 'client', to: 'server', label: 'SYN  seq=1000', note: 'ISN aleatório — previne confusão com conexões antigas. Syn Flood: enviar muitos SYNs sem completar.', type: 'sync' },
  { from: 'server', to: 'client', label: 'SYN-ACK  seq=5000, ack=1001', note: 'Servidor confirma seq do cliente (ack=ISN_cliente+1) e anuncia seu próprio ISN. 1 RTT.', type: 'return' },
  { from: 'client', to: 'server', label: 'ACK  ack=5001', note: 'Confirma ISN do servidor. Conexão bidirecional estabelecida. Ambos sincronizaram seq numbers.', type: 'sync' },
  // Dados
  { from: 'client', to: 'server', label: 'DATA  seq=1001, len=500 bytes', note: 'Window size anuncia quanto o receiver pode absorver. Flow control.', type: 'sync' },
  { from: 'server', to: 'client', label: 'ACK  ack=1501 (recebeu 500 bytes)', type: 'return' },
  { from: 'server', to: 'client', label: 'DATA  seq=5001, len=1000 bytes', type: 'sync' },
  { from: 'client', to: 'server', label: 'ACK  ack=6001', type: 'return' },
  // 4-way termination
  { from: 'client', to: 'server', label: 'FIN  seq=1501', note: 'Half-close: cliente terminou de enviar mas ainda pode receber.', type: 'sync' },
  { from: 'server', to: 'client', label: 'ACK  ack=1502', note: 'Servidor confirma FIN. Pode ainda ter dados para enviar.', type: 'return' },
  { from: 'server', to: 'client', label: 'FIN  seq=6001', type: 'sync' },
  { from: 'client', to: 'server', label: 'ACK  ack=6002 → TIME_WAIT (60s)', note: 'Porta bloqueada por 2×MSL ≈ 60s. Evita que dados atrasados poluam nova conexão no mesmo 4-tuple.', type: 'return' },
]

const TCP_GROUPS: SeqGroup[] = [
  { label: '3-way handshake (1 RTT)', kind: 'alt', fromMsg: 0, toMsg: 2, color: `${C}20` },
  { label: 'Transferência de dados — confiável e ordenada', kind: 'loop', fromMsg: 3, toMsg: 6, color: `${GRN}15` },
  { label: '4-way termination — graceful close', kind: 'opt', fromMsg: 7, toMsg: 10, color: `${AMB}15` },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Stack TCP/IP em camadas (LayerStack)
// ═══════════════════════════════════════════════════════════════════════════════

const TCPIP_LAYERS: Layer[] = [
  {
    id: 'app',
    label: 'HTTP/2 · gRPC · DNS · SMTP · SSH',
    sublabel: 'Camada de Aplicação',
    description: 'Protocolos que os desenvolvedores usam diretamente. Formatos de mensagem, semântica de requests/responses. HTTP/2 multiplexing, gRPC streaming, DNS queries.',
    color: C,
    examples: ['HTTP GET /', 'DNS query A google.com', 'SMTP EHLO'],
  },
  {
    id: 'transport',
    label: 'TCP · UDP · QUIC',
    sublabel: 'Camada de Transporte',
    description: 'TCP: confiável, ordenado, flow control, congestion control. UDP: best-effort, cabeçalho mínimo 8 bytes. QUIC: UDP com TLS integrado, sem TCP HOL blocking.',
    color: GRN,
    code: 'TCP: SYN/SYN-ACK/ACK | UDP: envia e espera',
    examples: ['TCP porta 443', 'UDP porta 53', 'QUIC porta 443'],
  },
  {
    id: 'network',
    label: 'IPv4 · IPv6 · ICMP',
    sublabel: 'Camada de Rede (Internet)',
    description: 'Endereçamento e roteamento entre redes. Best-effort: IP não garante entrega nem ordem. Roteadores tomam decisões por hop baseado em tabelas de roteamento.',
    color: AMB,
    code: 'IPv4: 32 bits | IPv6: 128 bits',
    examples: ['192.168.1.1', '2001:db8::1', 'traceroute (ICMP TTL exceeded)'],
  },
  {
    id: 'link',
    label: 'Ethernet · Wi-Fi · ARP',
    sublabel: 'Camada de Link (Network Access)',
    description: 'Transmissão de frames entre nós na mesma rede local. MAC address. ARP resolve IP → MAC. WPA2/WPA3 criptografa o Wi-Fi.',
    color: FGMUTE,
    examples: ['MAC: 00:1B:44:11:3A:B7', 'ARP who-has 192.168.1.1', 'Ethernet frame'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — TCP vs UDP vs QUIC (ComparisonTable)
// ═══════════════════════════════════════════════════════════════════════════════

const TRANSPORT_OPTIONS: ComparisonOption[] = [
  { id: 'tcp',  label: 'TCP',  color: C },
  { id: 'udp',  label: 'UDP',  color: AMB },
  { id: 'quic', label: 'QUIC', color: GRN },
]

const TRANSPORT_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'reliability',
    label: 'Confiabilidade',
    category: 'Garantias',
    description: 'Garante que dados chegam completos e em ordem?',
    values: {
      tcp:  { rating: 'excellent', note: 'ACK + retransmissão + ordenação por seq number' },
      udp:  { rating: 'poor',      note: 'Best-effort: pacotes podem perder, duplicar, chegar fora de ordem' },
      quic: { rating: 'excellent', note: 'Confiabilidade por stream, independente entre streams' },
    },
  },
  {
    id: 'latency',
    label: 'Latência de conexão',
    category: 'Performance',
    description: 'RTTs antes de enviar o primeiro dado',
    values: {
      tcp:  { rating: 'fair',      note: '1 RTT de handshake antes de qualquer dado' },
      udp:  { rating: 'excellent', note: '0 RTT — envia direto sem handshake' },
      quic: { rating: 'good',      note: '1 RTT (0-RTT em resumption). TLS integrado — sem 2 RTTs separados' },
    },
  },
  {
    id: 'hol',
    label: 'Head-of-line blocking',
    category: 'Performance',
    description: 'Pacote perdido bloqueia outros streams?',
    values: {
      tcp:  { rating: 'poor',      note: 'HOL blocking: 1 pacote perdido bloqueia tudo que vem depois' },
      udp:  { rating: 'excellent', note: 'Sem ordenação — sem HOL blocking por definição' },
      quic: { rating: 'excellent', note: 'Streams independentes: perda em stream A não bloqueia stream B' },
    },
  },
  {
    id: 'overhead',
    label: 'Overhead de header',
    category: 'Eficiência',
    values: {
      tcp:  { rating: 'fair',      note: '20+ bytes de header + opções (timestamps, SACK, etc.)' },
      udp:  { rating: 'excellent', note: 'Apenas 8 bytes: src port, dst port, length, checksum' },
      quic: { rating: 'good',      note: 'Variable header + QUIC overhead, mas TLS integrado economiza 1 RTT' },
    },
  },
  {
    id: 'migration',
    label: 'Connection migration',
    category: 'Mobile/Robustez',
    description: 'Conexão sobrevive mudança de IP (Wi-Fi → 4G)?',
    values: {
      tcp:  { rating: 'poor',      note: 'Conexão identificada por 4-tuple — mudar IP = nova conexão' },
      udp:  { rating: 'na',        note: 'Sem conexão — sem migration por definição' },
      quic: { rating: 'excellent', note: 'Connection ID: conexão sobrevive mudança de IP/porta' },
    },
  },
  {
    id: 'use-cases',
    label: 'Casos de uso',
    category: 'Aplicações',
    values: {
      tcp:  { rating: 'good',      note: 'HTTP/HTTPS, SSH, banco de dados, SMTP, FTP' },
      udp:  { rating: 'good',      note: 'DNS, video streaming, gaming, VoIP, multicast' },
      quic: { rating: 'excellent', note: 'HTTP/3, WebRTC, mobile apps, latência crítica' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — Jornada de domínio TCP/IP/DNS (ProgressionMap)
// ═══════════════════════════════════════════════════════════════════════════════

const NETWORKING_PROGRESSION: ProgressionLevel[] = [
  {
    id: 'basico',
    name: 'Básico',
    label: 'Iniciante',
    emoji: '🌐',
    concepts: [
      { name: 'IP = endereço na internet', tip: 'Como CEP de uma casa. IPv4 = 32 bits, IPv6 = 128 bits.' },
      { name: 'TCP = confiável, UDP = rápido', tip: 'TCP garante entrega; UDP não garante mas é mais leve.' },
      { name: 'DNS = lista telefônica', tip: 'Traduz google.com em 142.250.190.14' },
      { name: 'Portas bem conhecidas', tip: '80=HTTP, 443=HTTPS, 22=SSH, 53=DNS, 5432=PostgreSQL' },
    ],
  },
  {
    id: 'pleno',
    name: 'Pleno',
    label: 'Pleno',
    emoji: '🔗',
    concepts: [
      { name: 'TCP 3-way handshake SYN/SYN-ACK/ACK', tip: 'ISN aleatório previne conflito com conexões antigas' },
      { name: 'DNS hierarquia: Root → TLD → Autoritativo', tip: 'Cache por TTL — mudar A record não propaga instantaneamente' },
      { name: 'NAT — IP privado compartilha IP público', tip: 'Quebra P2P — precisa de hole punching (STUN/ICE) para WebRTC' },
      { name: 'TCP vs UDP — quando usar cada', tip: 'TCP para corretude; UDP para latência quando app tolera perda' },
      { name: 'HTTP/2 multiplexing sobre TCP', tip: 'Múltiplos streams na mesma conexão — evita 6-8 conexões paralelas do HTTP/1.1' },
    ],
  },
  {
    id: 'senior',
    name: 'Sênior',
    label: 'Sênior',
    emoji: '⚡',
    concepts: [
      { name: 'TCP congestion control: slow start + AIMD', tip: 'BBR mede BW+RTT sem esperar perda — YouTube, GCP usam BBR' },
      { name: 'TIME_WAIT — porta bloqueada 60s', tip: 'Em alta carga esgota portas ephemeral; SO_REUSEADDR resolve' },
      { name: 'DNS recursivo vs autoritativo', tip: 'Resolver faz o trabalho iterativo; autoritativo tem a resposta final' },
      { name: 'QUIC: UDP + TLS integrado + 1 RTT', tip: 'Sem TCP HOL blocking; connection migration para mobile' },
      { name: 'Window scaling e BDP', tip: 'BDP = bandwidth × RTT. Janela TCP limitada sem window scaling.' },
    ],
  },
  {
    id: 'especialista',
    name: 'Especialista',
    label: 'Especialista',
    emoji: '🏆',
    concepts: [
      { name: 'BGP e ASNs — roteamento inter-domínio', tip: 'BGP hijacking: Pakistan Telecom/YouTube 2008. RPKI mitiga.' },
      { name: 'Anycast — CDN e DNS global', tip: 'Cloudflare 1.1.1.1: centenas de PoPs anunciam mesmo IP via BGP' },
      { name: 'DNSSEC — assinatura criptográfica de zones', tip: 'Não criptografa — só autentica. DNS amplification DDoS como side effect.' },
      { name: 'TCP BBR vs CUBIC — métricas de congestionamento', tip: 'BBR modela o link; CUBIC reage à perda. BBR melhor em redes com buffer grande.' },
      { name: 'QUIC connection migration e 0-RTT', tip: 'Connection ID sobrevive mudança de IP. 0-RTT para GETs idempotentes.' },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export default function TcpIpDnsVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'dns-resolution',
      title: 'Resolução DNS Completa',
      subtitle: 'De google.com ao IP — hierarquia de nameservers e cache',
      accent: AMB,
      component: (
        <SequenceDiagram
          actors={DNS_ACTORS}
          messages={DNS_MESSAGES}
          groups={DNS_GROUPS}
          accentColor={AMB}
          bgColor={BG}
          title="DNS Resolution — cache miss e cache hit"
          description="Uma resolução completa passa por 4 nameservers em ~50-200ms. Com cache hit, resposta em menos de 1ms. TTL controla quando o cache expira — por isso mudar um A record não é instantâneo."
        />
      ),
    },
    {
      id: 'tcp-handshake',
      title: 'TCP — Handshake e Encerramento',
      subtitle: 'SYN/SYN-ACK/ACK + transferência + FIN/ACK/FIN/ACK + TIME_WAIT',
      accent: C,
      component: (
        <SequenceDiagram
          actors={TCP_ACTORS}
          messages={TCP_MESSAGES}
          groups={TCP_GROUPS}
          accentColor={C}
          bgColor={BG}
          title="TCP — ciclo de vida completo de uma conexão"
          description="3-way handshake sincroniza seq numbers — base do mecanismo de confiabilidade. TIME_WAIT de 60s após fechar previne que dados atrasados poluam novas conexões no mesmo 4-tuple."
        />
      ),
    },
    {
      id: 'tcpip-stack',
      title: 'Stack TCP/IP — Camadas',
      subtitle: 'Aplicação → Transporte → Rede → Link — responsabilidades de cada camada',
      accent: C,
      component: (
        <LayerStack
          layers={TCPIP_LAYERS}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          direction="top-down"
          title="Stack TCP/IP — 4 camadas"
          description="Cada camada encapsula a anterior: HTTP dentro de TCP, TCP dentro de IP, IP dentro de Ethernet frame. Descendo ao enviar, subindo ao receber."
        />
      ),
    },
    {
      id: 'tcp-udp-quic',
      title: 'TCP vs UDP vs QUIC',
      subtitle: 'Quando usar cada protocolo de transporte — trade-offs reais',
      accent: C,
      component: (
        <ComparisonTable
          options={TRANSPORT_OPTIONS}
          criteria={TRANSPORT_CRITERIA}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          title="TCP vs UDP vs QUIC — comparação completa"
          description="QUIC combina o melhor dos dois: confiabilidade sem TCP HOL blocking, integração com TLS, e connection migration para mobile. É o futuro do transporte na web."
        />
      ),
    },
    {
      id: 'networking-progression',
      title: 'Jornada de Domínio em Networking',
      subtitle: 'Do IP ao BGP anycast — conceitos por nível de experiência',
      accent: C,
      component: (
        <ProgressionMap
          levels={NETWORKING_PROGRESSION}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          heading="Jornada de domínio em TCP/IP e DNS"
          description="Para entrevista pleno: domínio dos níveis 1 e 2. Para sênior: incluindo nível 3 (congestion control, TIME_WAIT, QUIC)."
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
