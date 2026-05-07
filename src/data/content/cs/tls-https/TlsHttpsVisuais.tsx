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

// ── Paleta TLS/HTTPS ──────────────────────────────────────────────────────────
const C      = '#f59e0b'   // âmbar — segurança
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#4ade80'
const RED    = '#ef4444'
const SKY    = '#38bdf8'
const PRP    = '#a78bfa'

void LINE; void FGMUTE; void FG

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — TLS 1.3 Handshake (SequenceDiagram)
// ═══════════════════════════════════════════════════════════════════════════════

const TLS13_ACTORS: SeqActor[] = [
  { id: 'client', label: 'Cliente (Browser)', color: SKY },
  { id: 'server', label: 'Servidor (HTTPS)', color: C },
  { id: 'ca',     label: 'CA (Certificate Authority)', color: GRN },
]

const TLS13_MESSAGES: SeqMessage[] = [
  // TCP handshake
  { from: 'client', to: 'server', label: 'SYN', note: 'Camada TCP — precede o TLS', type: 'sync' },
  { from: 'server', to: 'client', label: 'SYN-ACK', type: 'return' },
  { from: 'client', to: 'server', label: 'ACK — conexão TCP estabelecida', type: 'sync' },
  // TLS 1.3
  { from: 'client', to: 'server', label: 'ClientHello + key_share (ECDHE pública)', note: 'Já inclui material criptográfico — diferencial do TLS 1.3', type: 'sync' },
  { from: 'server', to: 'server', label: 'Deriva chave de sessão via ECDHE', note: 'Ambos os lados derivam a mesma chave sem transmiti-la', type: 'create' },
  { from: 'server', to: 'client', label: 'ServerHello + key_share + Certificate (criptografado) + Finished', note: 'Cert já criptografado no TLS 1.3 — privacidade extra', type: 'return' },
  { from: 'client', to: 'ca',     label: 'Valida certificado (chain + SAN + expiração)', note: 'Opcionalmente via OCSP Stapling — sem round-trip extra', type: 'async' },
  { from: 'ca',     to: 'client', label: 'Cert válido ✓', type: 'return' },
  { from: 'client', to: 'server', label: 'Finished (MAC do handshake inteiro)', note: 'Autentica toda a negociação — previne downgrade attack', type: 'sync' },
  // Dados
  { from: 'client', to: 'server', label: 'HTTP GET / (encriptado com AES-GCM)', type: 'sync' },
  { from: 'server', to: 'client', label: '200 OK + HTML (encriptado)', type: 'return' },
]

const TLS13_GROUPS: SeqGroup[] = [
  { label: 'TCP 3-way handshake (1 RTT)', kind: 'loop', fromMsg: 0, toMsg: 2, color: '#334155' },
  { label: 'TLS 1.3 Handshake (1 RTT)', kind: 'alt', fromMsg: 3, toMsg: 8, color: `${C}20` },
  { label: 'Dados encriptados', kind: 'loop', fromMsg: 9, toMsg: 10, color: `${GRN}15` },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — mTLS Handshake (SequenceDiagram)
// ═══════════════════════════════════════════════════════════════════════════════

const MTLS_ACTORS: SeqActor[] = [
  { id: 'svc-a', label: 'Serviço A (cliente mTLS)', color: SKY },
  { id: 'svc-b', label: 'Serviço B (servidor mTLS)', color: C },
  { id: 'ca-int', label: 'CA Interna (Vault PKI)', color: PRP },
]

const MTLS_MESSAGES: SeqMessage[] = [
  { from: 'svc-a',  to: 'ca-int', label: 'Solicita cert com identidade spiffe://cluster/svc-a', type: 'sync' },
  { from: 'ca-int', to: 'svc-a',  label: 'Emite cert assinado (TTL: 24h)', type: 'return' },
  { from: 'svc-b',  to: 'ca-int', label: 'Solicita cert com identidade spiffe://cluster/svc-b', type: 'sync' },
  { from: 'ca-int', to: 'svc-b',  label: 'Emite cert assinado (TTL: 24h)', type: 'return' },
  { from: 'svc-a',  to: 'svc-b',  label: 'ClientHello + key_share + Certificate do cliente', note: 'mTLS: cliente apresenta seu próprio certificado', type: 'sync' },
  { from: 'svc-b',  to: 'svc-a',  label: 'ServerHello + key_share + Certificate do servidor + Finished', type: 'return' },
  { from: 'svc-a',  to: 'svc-a',  label: 'Valida cert do servidor (CA interna)', type: 'create' },
  { from: 'svc-b',  to: 'svc-b',  label: 'Valida cert do cliente (CA interna) — autenticação mútua', type: 'create' },
  { from: 'svc-a',  to: 'svc-b',  label: 'Finished', type: 'sync' },
  { from: 'svc-a',  to: 'svc-b',  label: 'gRPC request (encriptado + autenticado)', type: 'sync' },
  { from: 'svc-b',  to: 'svc-a',  label: 'gRPC response', type: 'return' },
]

const MTLS_GROUPS: SeqGroup[] = [
  { label: 'Emissão de certs (automatizada por cert-manager / Vault)', kind: 'alt', fromMsg: 0, toMsg: 3, color: `${PRP}15` },
  { label: 'mTLS Handshake — ambos autenticam', kind: 'alt', fromMsg: 4, toMsg: 8, color: `${C}20` },
  { label: 'Comunicação segura serviço-a-serviço', kind: 'loop', fromMsg: 9, toMsg: 10, color: `${GRN}15` },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Stack de camadas TLS/HTTPS (LayerStack)
// ═══════════════════════════════════════════════════════════════════════════════

const TLS_LAYERS: Layer[] = [
  {
    id: 'app',
    label: 'HTTP/2 · gRPC · WebSocket',
    sublabel: 'Camada de Aplicação',
    description: 'Protocolo de aplicação: métodos, headers, status codes. Não sabe nada de criptografia. Envia dados em claro para o TLS encriptar.',
    color: SKY,
    examples: ['GET /api/user', 'POST /graphql', 'SUBSCRIBE /events'],
  },
  {
    id: 'tls',
    label: 'TLS 1.3',
    sublabel: 'Camada de Segurança',
    description: 'Criptografia AEAD (AES-GCM/ChaCha20), autenticação via X.509, integridade via MAC. Handshake em 1 RTT. PFS obrigatório via ECDHE.',
    color: C,
    code: 'TLS_AES_128_GCM_SHA256',
    examples: ['ClientHello + key_share', 'Certificate (criptografado)', 'ECDHE key exchange'],
  },
  {
    id: 'tcp',
    label: 'TCP (porta 443)',
    sublabel: 'Camada de Transporte',
    description: 'Conexão confiável e ordenada via 3-way handshake. 1 RTT antes do TLS. Flow control, retransmissão, congestion control.',
    color: GRN,
    code: 'SYN → SYN-ACK → ACK',
    examples: ['Seq/ACK numbers', 'Sliding window', 'Congestion control'],
  },
  {
    id: 'ip',
    label: 'IP (IPv4 / IPv6)',
    sublabel: 'Camada de Rede',
    description: 'Endereçamento e roteamento. Best-effort: não garante entrega nem ordem. É o TCP que garante confiabilidade sobre IP.',
    color: PRP,
    examples: ['Routing tables', 'TTL', 'Fragmentation'],
  },
  {
    id: 'link',
    label: 'Ethernet / Wi-Fi',
    sublabel: 'Camada de Link',
    description: 'Transmissão física de frames. Endereço MAC. ARP resolve IP → MAC local. Sem criptografia por padrão (WPA2 no Wi-Fi).',
    color: FGMUTE,
    examples: ['MAC address', 'ARP', 'WPA2/WPA3'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Comparação TLS 1.2 vs 1.3 vs QUIC (ComparisonTable)
// ═══════════════════════════════════════════════════════════════════════════════

const TLS_OPTIONS: ComparisonOption[] = [
  { id: 'tls12', label: 'TLS 1.2',  color: RED },
  { id: 'tls13', label: 'TLS 1.3',  color: C },
  { id: 'quic',  label: 'QUIC/HTTP3', color: GRN },
]

const TLS_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'rtt',
    label: 'RTTs para handshake',
    category: 'Performance',
    description: 'Quantos round-trips antes de enviar dados HTTP',
    values: {
      tls12: { rating: 'poor',      note: '2 RTT TLS + 1 RTT TCP = 3 RTT' },
      tls13: { rating: 'good',      note: '1 RTT TLS + 1 RTT TCP = 2 RTT' },
      quic:  { rating: 'excellent', note: '1 RTT total (TCP+TLS integrados)' },
    },
  },
  {
    id: 'resumption',
    label: 'Session resumption',
    category: 'Performance',
    description: 'RTTs em reconexão de sessão',
    values: {
      tls12: { rating: 'fair',      note: 'Session ID ou tickets (1 RTT)' },
      tls13: { rating: 'good',      note: '0-RTT PSK (risco de replay)' },
      quic:  { rating: 'excellent', note: '0-RTT nativo sem TCP overhead' },
    },
  },
  {
    id: 'pfs',
    label: 'Perfect Forward Secrecy',
    category: 'Segurança',
    description: 'Sessões passadas seguras se chave privada vazar',
    values: {
      tls12: { rating: 'fair',      note: 'Opcional (ECDHE disponível mas não obrigatório)' },
      tls13: { rating: 'excellent', note: 'Obrigatório — apenas ECDHE' },
      quic:  { rating: 'excellent', note: 'Obrigatório (TLS 1.3 integrado)' },
    },
  },
  {
    id: 'ciphers',
    label: 'Cipher suites',
    category: 'Segurança',
    description: 'Qualidade dos algoritmos criptográficos disponíveis',
    values: {
      tls12: { rating: 'fair',      note: 'Inclui CBC, RC4, RSA KE (inseguros legados)' },
      tls13: { rating: 'excellent', note: 'Apenas AEAD (AES-GCM, ChaCha20)' },
      quic:  { rating: 'excellent', note: 'Apenas AEAD via TLS 1.3' },
    },
  },
  {
    id: 'cert-privacy',
    label: 'Privacidade do certificado',
    category: 'Segurança',
    description: 'Certificado enviado em claro ou criptografado',
    values: {
      tls12: { rating: 'poor',      note: 'Cert em claro — ISP/MITM vê o domínio' },
      tls13: { rating: 'good',      note: 'Cert criptografado com chave de sessão' },
      quic:  { rating: 'good',      note: 'Cert criptografado (TLS 1.3 integrado)' },
    },
  },
  {
    id: 'hol',
    label: 'Head-of-line blocking',
    category: 'Performance',
    description: 'Pacote perdido bloqueia outros streams?',
    values: {
      tls12: { rating: 'poor',      note: 'TCP HOL blocking (afeta todos streams HTTP/2)' },
      tls13: { rating: 'poor',      note: 'TCP HOL blocking (mesmo problema)' },
      quic:  { rating: 'excellent', note: 'Streams independentes — perda afeta só um stream' },
    },
  },
  {
    id: 'adoption',
    label: 'Adoção atual (2025)',
    category: 'Ecossistema',
    values: {
      tls12: { rating: 'fair',      note: 'Legado, ainda suportado. Deprecar ASAP.' },
      tls13: { rating: 'excellent', note: '~70% do tráfego web. Standard atual.' },
      quic:  { rating: 'good',      note: '~30% do tráfego web. Crescendo.' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — Jornada de domínio TLS (ProgressionMap)
// ═══════════════════════════════════════════════════════════════════════════════

const TLS_PROGRESSION: ProgressionLevel[] = [
  {
    id: 'basico',
    name: 'Básico',
    label: 'Iniciante',
    emoji: '🔒',
    concepts: [
      { name: 'HTTPS = HTTP + TLS', tip: 'TLS é a camada de segurança; HTTPS é HTTP sobre ela' },
      { name: 'Certificado X.509', tip: 'Prova identidade do servidor — assinado por uma CA confiável' },
      { name: 'Porta 443', tip: 'HTTPS usa 443; HTTP usa 80' },
      { name: 'Cadeado no browser', tip: 'Indica TLS ativo + certificado válido' },
    ],
  },
  {
    id: 'pleno',
    name: 'Pleno',
    label: 'Pleno',
    emoji: '🛡️',
    concepts: [
      { name: 'TLS 1.3 vs 1.2 (1 RTT vs 2)', tip: 'TLS 1.3 é mais rápido e mais seguro — padrão atual' },
      { name: 'Certificate chain (leaf → intermediário → root)', tip: 'Servidor deve enviar chain completa com intermediário' },
      { name: 'HSTS + preload', tip: 'Força HTTPS mesmo na primeira visita; preload é embutido nos browsers' },
      { name: 'SNI — virtual hosting HTTPS', tip: 'Permite múltiplos certs no mesmo IP' },
      { name: 'Let\'s Encrypt + Certbot', tip: 'DV grátis, automático, 90 dias, renovação por cron' },
    ],
  },
  {
    id: 'senior',
    name: 'Sênior',
    label: 'Sênior',
    emoji: '⚔️',
    concepts: [
      { name: 'Perfect Forward Secrecy via ECDHE', tip: 'Chave de sessão efêmera — comprometer servidor não desvenda passado' },
      { name: 'OCSP Stapling', tip: 'Servidor consulta CA e cola resposta no handshake — elimina round-trip e preserva privacidade' },
      { name: 'mTLS (Mutual TLS)', tip: 'Ambos apresentam cert — identidade de workload em zero trust / service mesh' },
      { name: '0-RTT e riscos de replay', tip: 'Session resumption sem RTT — apenas para GETs idempotentes' },
      { name: 'Cipher suites: AEAD vs CBC', tip: 'TLS 1.3 só AEAD; CBC tem ataques de padding oracle (POODLE, BEAST)' },
    ],
  },
  {
    id: 'especialista',
    name: 'Especialista',
    label: 'Especialista',
    emoji: '🏆',
    concepts: [
      { name: 'SPIFFE/SPIRE para identidade de workload', tip: 'URIs spiffe:// como identidade — base do zero trust moderno' },
      { name: 'TLS_FALLBACK_SCSV anti-downgrade', tip: 'Sinaliza ao servidor que é um retry — previne POODLE-style downgrade' },
      { name: 'Session tickets vs PSK', tip: 'TLS 1.2 tickets precisam de chave compartilhada entre nós; PSK do 1.3 é derivado da sessão' },
      { name: 'ESNI/ECH — SNI criptografado', tip: 'TLS 1.3 ainda expõe SNI; ECH (RFC em progresso) resolve a privacidade final' },
      { name: 'RPKI para BGP + TLS', tip: 'Validação criptográfica de anúncios BGP — complementa TLS em ataques de roteamento' },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export default function TlsHttpsVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'tls13-handshake',
      title: 'TLS 1.3 Handshake',
      subtitle: 'TCP + TLS + certificado + dados — sequência temporal completa',
      accent: C,
      component: (
        <SequenceDiagram
          actors={TLS13_ACTORS}
          messages={TLS13_MESSAGES}
          groups={TLS13_GROUPS}
          accentColor={C}
          bgColor={BG}
          title="TLS 1.3 Handshake — sequência completa"
          description="TCP + TLS somam 2 RTTs antes do primeiro byte HTTP. TLS 1.2 exigiria 3 RTTs. QUIC/HTTP3 comprime tudo em 1 RTT."
        />
      ),
    },
    {
      id: 'mtls-handshake',
      title: 'mTLS — Serviço a Serviço',
      subtitle: 'Autenticação mútua com certificados — zero trust na prática',
      accent: PRP,
      component: (
        <SequenceDiagram
          actors={MTLS_ACTORS}
          messages={MTLS_MESSAGES}
          groups={MTLS_GROUPS}
          accentColor={PRP}
          bgColor={BG}
          title="mTLS — autenticação mútua entre microserviços"
          description="Em service mesh (Istio/Linkerd), certs são emitidos e rotacionados automaticamente. O código da aplicação não sabe que TLS existe."
        />
      ),
    },
    {
      id: 'tls-stack',
      title: 'Stack HTTPS — Camadas',
      subtitle: 'TLS sobre TCP sobre IP — cada camada e sua responsabilidade',
      accent: C,
      component: (
        <LayerStack
          layers={TLS_LAYERS}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          direction="top-down"
          title="Stack HTTPS completo"
          description="Dois handshakes ocorrem antes de qualquer dado HTTP: TCP (1 RTT) depois TLS 1.3 (1 RTT). HTTP/3 une os dois em 1 RTT via QUIC."
        />
      ),
    },
    {
      id: 'tls-comparison',
      title: 'TLS 1.2 vs 1.3 vs QUIC',
      subtitle: 'Comparação multidimensional: performance, segurança e adoção',
      accent: C,
      component: (
        <ComparisonTable
          options={TLS_OPTIONS}
          criteria={TLS_CRITERIA}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          title="TLS 1.2 vs TLS 1.3 vs QUIC/HTTP3"
          description="Para sistemas novos: TLS 1.3 mínimo, QUIC para mobile/latência crítica. TLS 1.2 apenas para compatibilidade com clientes legados."
        />
      ),
    },
    {
      id: 'tls-progression',
      title: 'Jornada de Domínio TLS',
      subtitle: 'Do cadeado no browser à identidade SPIFFE em zero trust',
      accent: C,
      component: (
        <ProgressionMap
          levels={TLS_PROGRESSION}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          heading="Jornada de domínio em TLS/HTTPS"
          description="Cada nível adiciona profundidade. Para entrevista pleno: dominei até ProgressionLevel 2. Para sênior: até nível 3."
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
