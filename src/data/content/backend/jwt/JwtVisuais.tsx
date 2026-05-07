'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { SequenceDiagram } from '@/components/visuals/SequenceDiagram'
import type { SeqActor, SeqMessage } from '@/components/visuals/SequenceDiagram'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern, CodeLine } from '@/components/visuals/AntiPatternsGallery'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'
import { ProgressionMap } from '@/components/visuals/ProgressionMap'
import type { ProgressionLevel } from '@/components/visuals/ProgressionMap'

// ── Paleta JWT ────────────────────────────────────────────────────────────────
const C      = '#f59e0b'  // amber — security/tokens
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#4ade80'
const RED    = '#ef4444'
const SKY    = '#38bdf8'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — JWT Anatomy (custom interativo)
// Justificativa: a anatomia header.payload.signature é o fundamento de tudo.
// Ver as três partes destacadas, decodificar em tempo real e entender que
// Base64url ≠ criptografia ancora o conceito mais rápido que qualquer texto.
// ═══════════════════════════════════════════════════════════════════════════════

const SAMPLE_HEADER = { alg: 'HS256', typ: 'JWT' }
const SAMPLE_PAYLOAD = {
  sub: 'usr_abc123',
  iss: 'auth.myapp.com',
  aud: 'api.myapp.com',
  iat: 1700000000,
  exp: 1700000900,
  roles: ['admin'],
}

function b64url(obj: object): string {
  return btoa(JSON.stringify(obj, null, 2))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

function JwtAnatomyVisual() {
  const [active, setActive] = useState<'header' | 'payload' | 'signature'>('header')

  const headerB64    = b64url(SAMPLE_HEADER)
  const payloadB64   = b64url(SAMPLE_PAYLOAD)
  const signatureB64 = 'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

  const parts: Array<{ id: 'header' | 'payload' | 'signature'; label: string; color: string; value: string; decoded: object | string; warn?: string }> = [
    {
      id: 'header',
      label: 'Header',
      color: '#ef4444',
      value: headerB64,
      decoded: SAMPLE_HEADER,
    },
    {
      id: 'payload',
      label: 'Payload (Claims)',
      color: '#8b5cf6',
      value: payloadB64,
      decoded: SAMPLE_PAYLOAD,
      warn: 'Base64url apenas — qualquer pessoa pode decodificar!',
    },
    {
      id: 'signature',
      label: 'Signature',
      color: '#10b981',
      value: signatureB64,
      decoded: 'HMAC-SHA256(\n  base64url(header) + "." + base64url(payload),\n  secret\n)',
    },
  ]

  const activePart = parts.find(p => p.id === active)!

  return (
    <div style={{ background: BG, border: `1px solid ${LINE}`, borderRadius: 14, padding: 24, fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ marginBottom: 18 }}>
        <h3 style={{ color: FG, margin: 0, fontSize: 16, fontWeight: 800 }}>Anatomia do JWT — header.payload.signature</h3>
        <p style={{ color: FGMUTE, fontSize: 12, margin: '4px 0 0' }}>Clique em cada parte para ver o conteúdo decodificado. O payload é Base64url — não é cifrado.</p>
      </div>

      {/* Token visual */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2, marginBottom: 20, background: CARD, borderRadius: 10, padding: 14, alignItems: 'center' }}>
        {parts.map((part, i) => (
          <div key={part.id} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <button
              onClick={() => setActive(part.id)}
              style={{
                background: active === part.id ? part.color : `${part.color}30`,
                color: active === part.id ? '#fff' : part.color,
                border: `2px solid ${active === part.id ? part.color : `${part.color}50`}`,
                borderRadius: 6,
                padding: '6px 10px',
                fontSize: 11,
                fontFamily: 'inherit',
                cursor: 'pointer',
                fontWeight: 700,
                maxWidth: 200,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                transition: 'all .2s',
              }}
              title={part.value}
            >
              {part.value.slice(0, 28)}…
            </button>
            {i < parts.length - 1 && (
              <span style={{ color: '#64748b', fontSize: 20, fontWeight: 700, lineHeight: 1 }}>.</span>
            )}
          </div>
        ))}
      </div>

      {/* Decoded panel */}
      <div style={{
        background: CARD,
        border: `2px solid ${activePart.color}60`,
        borderRadius: 12,
        padding: 18,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ color: activePart.color, fontSize: 14, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.05em' }}>
            {activePart.label}
          </div>
          {activePart.warn && (
            <div style={{
              background: `${RED}20`,
              border: `1px solid ${RED}50`,
              color: RED,
              borderRadius: 6,
              padding: '4px 10px',
              fontSize: 10,
              fontWeight: 600,
            }}>
              {activePart.warn}
            </div>
          )}
        </div>

        <pre style={{
          background: BG,
          border: `1px solid ${LINE}`,
          borderRadius: 8,
          padding: 14,
          fontSize: 12,
          color: FG,
          overflow: 'auto',
          margin: 0,
          lineHeight: 1.8,
        }}>
          {typeof activePart.decoded === 'string'
            ? activePart.decoded
            : JSON.stringify(activePart.decoded, null, 2)}
        </pre>

        {activePart.id === 'payload' && (
          <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {[
              { claim: 'sub', desc: 'Subject (user ID)' },
              { claim: 'iss', desc: 'Issuer (quem emitiu)' },
              { claim: 'aud', desc: 'Audience (destinatário)' },
              { claim: 'iat', desc: 'Issued At (timestamp)' },
              { claim: 'exp', desc: 'Expiration (expiração)' },
              { claim: 'roles', desc: 'Custom claim' },
            ].map(({ claim, desc }) => (
              <div key={claim} style={{ background: BG, border: `1px solid ${LINE}`, borderRadius: 6, padding: '6px 10px' }}>
                <div style={{ color: activePart.color, fontSize: 11, fontWeight: 700, fontFamily: 'monospace' }}>{claim}</div>
                <div style={{ color: FGMUTE, fontSize: 10, marginTop: 2 }}>{desc}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — OAuth 2.0 + JWT Sequence Flow
// Justificativa: o fluxo Authorization Code + token exchange é o que todos
// precisam entender mas poucos conseguem explicar sem errar a ordem.
// SequenceDiagram mostra a sequência perfeita com timing e atores.
// ═══════════════════════════════════════════════════════════════════════════════

const OAUTH_ACTORS: SeqActor[] = [
  { id: 'browser', label: 'Browser', color: SKY },
  { id: 'app', label: 'App Server', color: C },
  { id: 'auth', label: 'Auth Server', color: GRN },
  { id: 'api', label: 'Resource API', color: '#a78bfa' },
]

const OAUTH_MESSAGES: SeqMessage[] = [
  { from: 'browser', to: 'auth', label: 'GET /authorize?response_type=code&client_id=...' },
  { from: 'auth', to: 'browser', label: 'Login UI + consent screen', type: 'return' },
  { from: 'browser', to: 'app', label: 'Callback: GET /callback?code=AUTH_CODE' },
  { from: 'app', to: 'auth', label: 'POST /token { code, client_secret }' },
  { from: 'auth', to: 'app', label: '{ access_token (JWT), refresh_token, expires_in }', type: 'return' },
  { from: 'app', to: 'browser', label: 'Set-Cookie: access_token=... (httpOnly)', type: 'return' },
  { from: 'browser', to: 'api', label: 'GET /data — Authorization: Bearer <jwt>' },
  { from: 'api', to: 'api', label: 'Verifica assinatura + exp + iss + aud (stateless)', type: 'async' },
  { from: 'api', to: 'browser', label: '200 OK — dados protegidos', type: 'return' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Refresh Token Rotation Flow
// Justificativa: rotation é o conceito mais mal-entendido de JWT.
// Ver o fluxo "access expira → refresh → novo par → antigo invalidado" e
// o caso de detecção de replay é o que destrava o entendimento.
// ═══════════════════════════════════════════════════════════════════════════════

const REFRESH_ACTORS: SeqActor[] = [
  { id: 'client', label: 'Client', color: SKY },
  { id: 'api', label: 'API Server', color: C },
  { id: 'redis', label: 'Redis/DB', color: GRN },
]

const REFRESH_MESSAGES_NORMAL: SeqMessage[] = [
  { from: 'client', to: 'api', label: 'GET /api/data — Bearer access_token (expirado)' },
  { from: 'api', to: 'client', label: '401 Unauthorized — token expirado', type: 'return' },
  { from: 'client', to: 'api', label: 'POST /refresh — Cookie: refresh_token' },
  { from: 'api', to: 'redis', label: 'GET refresh:TOKEN → { userId, familyId }' },
  { from: 'redis', to: 'api', label: '{ userId: "usr_abc", familyId: "fam_xyz" }', type: 'return' },
  { from: 'api', to: 'redis', label: 'DEL refresh:TOKEN_ANTIGO (invalidar)', type: 'async' },
  { from: 'api', to: 'redis', label: 'SET refresh:TOKEN_NOVO { userId, familyId } EX 2592000', type: 'async' },
  { from: 'api', to: 'client', label: 'novo access_token (15min) + Set-Cookie: novo refresh_token', type: 'return' },
]

const REPLAY_ACTORS: SeqActor[] = [
  { id: 'atacante', label: 'Atacante', color: RED },
  { id: 'api', label: 'API Server', color: C },
  { id: 'redis', label: 'Redis/DB', color: GRN },
]

const REPLAY_MESSAGES: SeqMessage[] = [
  { from: 'atacante', to: 'api', label: 'POST /refresh — Cookie: refresh_token_ANTIGO (já usado!)' },
  { from: 'api', to: 'redis', label: 'GET refresh:TOKEN_ANTIGO → null (não existe!)' },
  { from: 'redis', to: 'api', label: 'null — token já foi invalidado na rotation anterior', type: 'return' },
  { from: 'api', to: 'redis', label: 'DEL refresh:* WHERE familyId = "fam_xyz" (revogar TODA família)', type: 'async' },
  { from: 'api', to: 'atacante', label: '401 — refresh token inválido. Família revogada.', type: 'return' },
  { from: 'api', to: 'api', label: 'Usuário legítimo forçado a fazer login novamente', type: 'async' },
]

function RefreshFlowVisual() {
  const [scenario, setScenario] = useState<'normal' | 'replay'>('normal')

  const messages = scenario === 'normal' ? REFRESH_MESSAGES_NORMAL : REPLAY_MESSAGES
  const actors   = scenario === 'normal' ? REFRESH_ACTORS : REPLAY_ACTORS

  return (
    <div style={{ background: BG, border: `1px solid ${LINE}`, borderRadius: 14, padding: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ color: FG, margin: 0, fontSize: 16, fontWeight: 800 }}>Refresh Token Rotation</h3>
        <p style={{ color: FGMUTE, fontSize: 12, margin: '4px 0 0' }}>Cada uso do refresh token emite um novo par e invalida o antigo. Reuso do antigo sinaliza roubo → revoga a família inteira.</p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {([['normal', 'Fluxo normal'], ['replay', 'Replay attack detectado']] as const).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setScenario(id)}
            style={{
              background: scenario === id ? C : 'transparent',
              color: scenario === id ? '#000' : C,
              border: `1.5px solid ${C}`,
              borderRadius: 6,
              padding: '6px 14px',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all .2s',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <SequenceDiagram
        actors={actors}
        messages={messages}
        accentColor={scenario === 'normal' ? C : RED}
        bgColor={BG}
        title=""
      />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — HS256 vs RS256 vs ES256 (ComparisonTable)
// Justificativa: a escolha de algoritmo afeta a arquitetura inteira.
// ═══════════════════════════════════════════════════════════════════════════════

const ALG_OPTIONS: ComparisonOption[] = [
  { id: 'hs256', label: 'HS256', sublabel: 'HMAC-SHA256 simétrico', color: C },
  { id: 'rs256', label: 'RS256', sublabel: 'RSA assimétrico', color: SKY },
  { id: 'es256', label: 'ES256', sublabel: 'ECDSA assimétrico', color: GRN },
]

const ALG_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'type',
    label: 'Tipo de chave',
    category: 'Fundamentos',
    description: 'Simétrico vs assimétrico',
    values: {
      hs256: { rating: 'good', note: '1 secret compartilhado — quem verifica também pode assinar.' },
      rs256: { rating: 'excellent', note: 'Par RSA (privada assina, pública verifica). 2048+ bits.' },
      es256: { rating: 'excellent', note: 'Par EC curva P-256 (privada assina, pública verifica). ~256 bits.' },
    },
  },
  {
    id: 'distribution',
    label: 'Distribuição para microserviços',
    category: 'Arquitetura',
    description: 'Quem precisa de qual chave',
    values: {
      hs256: { rating: 'poor', note: 'Todos os serviços precisam do secret → maior surface de ataque.' },
      rs256: { rating: 'excellent', note: 'Serviços recebem só chave pública (seguro distribuir). Assina só o Auth Server.' },
      es256: { rating: 'excellent', note: 'Mesmo que RS256 — chave pública pode ser publicada via JWKS.' },
    },
  },
  {
    id: 'jwks',
    label: 'Suporte a JWKS endpoint',
    category: 'Arquitetura',
    description: 'Permite publicação pública de chaves',
    values: {
      hs256: { rating: 'poor', note: 'Secret nunca pode ser publicado — sem JWKS.' },
      rs256: { rating: 'excellent', note: 'Padrão OAuth 2.0 + OIDC. Chave pública em /.well-known/jwks.json.' },
      es256: { rating: 'excellent', note: 'Suporte completo a JWKS. Preferido em novos projetos.' },
    },
  },
  {
    id: 'performance',
    label: 'Performance',
    category: 'Performance',
    description: 'Velocidade de assinatura/verificação',
    values: {
      hs256: { rating: 'excellent', note: 'HMAC é muito rápido — operação simples de hash.' },
      rs256: { rating: 'fair', note: 'Operações RSA são lentas — chaves 2048-bit têm overhead significativo.' },
      es256: { rating: 'good', note: 'ECDSA mais rápido que RSA com mesma segurança. Verificação eficiente.' },
    },
  },
  {
    id: 'key-size',
    label: 'Tamanho da chave',
    category: 'Performance',
    description: 'Impacto no tamanho do token e rede',
    values: {
      hs256: { rating: 'excellent', note: '256 bits — mínimo impacto no token.' },
      rs256: { rating: 'fair', note: '256 bytes (2048 bits) — signature maior no token.' },
      es256: { rating: 'excellent', note: '~64 bytes — chave pequena, signature compacta.' },
    },
  },
  {
    id: 'key-rotation',
    label: 'Rotação de chaves',
    category: 'Segurança',
    description: 'Facilidade de trocar chaves sem downtime',
    values: {
      hs256: { rating: 'poor', note: 'Rotation requer coordenação com todos os serviços que têm o secret.' },
      rs256: { rating: 'excellent', note: 'Adiciona novo kid ao JWKS. Tokens antigos validados com chave antiga até exp.' },
      es256: { rating: 'excellent', note: 'Mesmo que RS256 — zero downtime via JWKS + kid.' },
    },
  },
  {
    id: 'use-case',
    label: 'Quando usar',
    category: 'Decisão',
    description: 'Cenário ideal para cada algoritmo',
    values: {
      hs256: { rating: 'good', note: 'Monolito ou microserviços totalmente controlados e confiáveis.' },
      rs256: { rating: 'good', note: 'OAuth 2.0/OIDC, terceiros precisam verificar tokens, edge computing.' },
      es256: { rating: 'excellent', note: 'Novos projetos — melhor custo-benefício: performance + segurança + JWKS.' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — JWT Security Anti-patterns
// Justificativa: erros de segurança com JWT são o que custa caro em produção.
// ═══════════════════════════════════════════════════════════════════════════════

const JWT_ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'alg:none attack',
    why: 'Não fixar o algoritmo esperado na verificação permite que atacante troque alg para "none" e remova a assinatura. O servidor aceita o token forjado sem verificar nada.',
    wrong: [
      [{ text: '// ERRADO: lê algoritmo do header do token', color: '#94a3b8' }],
      [{ text: 'const payload = jwt.verify(token, secret)', color: '#ef4444' }],
      [{ text: '// Atacante envia: { alg: "none" } — sem assinatura!', color: '#f87171' }],
    ],
    right: [
      [{ text: '// CORRETO: fixar algoritmo no código', color: '#94a3b8' }],
      [{ text: 'const payload = jwt.verify(token, secret, {', color: '#4ade80' }],
      [{ text: "  algorithms: ['HS256'],  // nunca leia do header", color: '#4ade80' }],
      [{ text: "  issuer: 'auth.myapp.com',", color: '#4ade80' }],
      [{ text: "  audience: 'api.myapp.com',", color: '#4ade80' }],
      [{ text: '})', color: '#4ade80' }],
    ],
  },
  {
    title: 'JWT em localStorage (vulnerável a XSS)',
    why: 'localStorage é acessível por qualquer JavaScript na página. Um único script XSS rouba o token e pode se autenticar como o usuário. httpOnly cookies são imunes a esse vetor.',
    wrong: [
      [{ text: '// ERRADO: localStorage acessível por qualquer JS', color: '#94a3b8' }],
      [{ text: "localStorage.setItem('jwt', accessToken)", color: '#ef4444' }],
      [{ text: "// XSS: localStorage.getItem('jwt') — FUNCIONA!", color: '#f87171' }],
    ],
    right: [
      [{ text: '// CORRETO: httpOnly cookie — JS não acessa', color: '#94a3b8' }],
      [{ text: "res.cookie('access_token', token, {", color: '#4ade80' }],
      [{ text: '  httpOnly: true,    // bloqueado para JS', color: '#4ade80' }],
      [{ text: "  sameSite: 'lax',   // proteção CSRF", color: '#4ade80' }],
      [{ text: '  secure: true,      // só HTTPS', color: '#4ade80' }],
      [{ text: '  maxAge: 900,       // 15min (access token)', color: '#4ade80' }],
      [{ text: '})', color: '#4ade80' }],
    ],
  },
  {
    title: 'Dados sensíveis no payload',
    why: 'O payload do JWT é Base64url — não cifrado. Qualquer pessoa com o token pode decodificar e ler o conteúdo. Para dados sensíveis no token, use JWE (JSON Web Encryption).',
    wrong: [
      [{ text: '// ERRADO: payload com dados sensíveis', color: '#94a3b8' }],
      [{ text: 'jwt.sign({', color: '#ef4444' }],
      [{ text: "  sub: userId,", color: '#ef4444' }],
      [{ text: "  password: hashedPassword,  // NUNCA!", color: '#f87171' }],
      [{ text: "  cpf: '123.456.789-00',     // PII desnecessário", color: '#f87171' }],
      [{ text: "}, secret)", color: '#ef4444' }],
    ],
    right: [
      [{ text: '// CORRETO: só o mínimo necessário no payload', color: '#94a3b8' }],
      [{ text: 'jwt.sign({', color: '#4ade80' }],
      [{ text: "  sub: userId,         // ID de referência", color: '#4ade80' }],
      [{ text: "  roles: ['admin'],    // autorização", color: '#4ade80' }],
      [{ text: "  iss: 'auth.myapp.com',", color: '#4ade80' }],
      [{ text: "  aud: 'api.myapp.com',", color: '#4ade80' }],
      [{ text: "}, secret, { expiresIn: '15m' })", color: '#4ade80' }],
    ],
  },
  {
    title: 'Secret fraco ou hardcoded',
    why: 'Secrets curtos ou hardcoded podem ser descobertos por brute-force ou vazados em repositórios públicos. Um secret comprometido permite forjar qualquer token do sistema.',
    wrong: [
      [{ text: '// ERRADO: secret fraco ou hardcoded', color: '#94a3b8' }],
      [{ text: "const SECRET = 'mySecret'", color: '#ef4444' }],
      [{ text: "const SECRET = 'secret123'", color: '#ef4444' }],
      [{ text: '// Commitado no git → vazado → tokens forjáveis!', color: '#f87171' }],
    ],
    right: [
      [{ text: '// CORRETO: secret longo, aleatório, via env', color: '#94a3b8' }],
      [{ text: 'const SECRET = process.env.JWT_SECRET!', color: '#4ade80' }],
      [{ text: "// Gerar: node -e \"console.log(require('crypto')", color: '#94a3b8' }],
      [{ text: "//   .randomBytes(64).toString('hex'))", color: '#94a3b8' }],
      [{ text: '// 128 chars hex — brute-force inviável', color: '#4ade80' }],
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — JWT Security Layers (LayerStack)
// Justificativa: defesa em profundidade de JWT tem camadas bem definidas.
// ═══════════════════════════════════════════════════════════════════════════════

const JWT_SECURITY_LAYERS: Layer[] = [
  {
    id: 'transport',
    label: 'Transporte (HTTPS)',
    description: 'TLS obrigatório — token em plaintext HTTP é inaceitável. Evita man-in-the-middle.',
    color: '#ef4444',
    examples: ['TLS 1.2+ obrigatório', 'HSTS header', 'Sem downgrade HTTP'],
  },
  {
    id: 'storage',
    label: 'Armazenamento (httpOnly Cookie)',
    description: 'httpOnly + SameSite=Lax impede XSS de roubar o token. Cookie é preferido a localStorage.',
    color: '#f59e0b',
    examples: ['httpOnly=true', 'SameSite=Lax', 'Secure=true', 'Domain restrito'],
  },
  {
    id: 'algorithm',
    label: 'Algoritmo (RS256/ES256 fixado)',
    description: 'Fixar algoritmo no código previne alg:none e RS256→HS256 downgrade attacks.',
    color: '#f59e0b',
    examples: ['algorithms: ["RS256"]', 'Sem ler alg do header', 'ES256 para novos projetos'],
  },
  {
    id: 'claims',
    label: 'Validação de Claims',
    description: 'Validar todos os claims críticos — assinatura, exp, iss, aud — não apenas a assinatura.',
    color: '#a78bfa',
    examples: ['Verificar assinatura', 'exp (não expirado)', 'iss (issuer correto)', 'aud (audience correto)'],
  },
  {
    id: 'lifetime',
    label: 'Tempo de Vida Curto',
    description: 'Access token de 15min limita a janela de exploração de token roubado. Refresh token em httpOnly.',
    color: '#38bdf8',
    examples: ['Access: 15min', 'Refresh: 7-30d', 'Clock skew: 30-60s'],
  },
  {
    id: 'revocation',
    label: 'Revogação (JTI Blocklist)',
    description: 'JTI único por token + blocklist Redis com TTL permite revogação imediata sem perder stateless.',
    color: '#4ade80',
    examples: ['jti UUID em todo token', 'Redis blocklist', 'TTL = tempo restante do exp'],
  },
  {
    id: 'rotation',
    label: 'Refresh Token Rotation + Família',
    description: 'Cada uso do refresh emite novo par. Reuso do antigo revoga família inteira — detecta roubo.',
    color: '#4ade80',
    examples: ['familyId no refresh token', 'Invalidar antigo no use', 'Replay → revogar família'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 7 — Iniciante → Sênior: JWT Progression Map
// Justificativa: o mapa de progressão orienta o estudo de forma focada.
// ═══════════════════════════════════════════════════════════════════════════════

const JWT_PROGRESSION: ProgressionLevel[] = [
  {
    id: 'iniciante',
    name: 'Iniciante',
    label: 'Iniciante',
    emoji: '🔑',
    concepts: [
      { name: 'JWT tem 3 partes', tip: 'header.payload.signature separados por ponto' },
      { name: 'jwt.verify() e jwt.sign()', tip: 'API básica da biblioteca jsonwebtoken' },
      { name: 'Claim exp', tip: 'Token expira automaticamente — nunca use tokens sem expiração' },
      { name: 'Bearer token', tip: 'Authorization: Bearer <jwt> no header HTTP' },
    ],
  },
  {
    id: 'junior',
    name: 'Júnior',
    label: 'Júnior',
    emoji: '🔐',
    concepts: [
      { name: 'Base64url ≠ criptografia', tip: 'Payload é decodificável por qualquer pessoa — nunca coloque dados sensíveis' },
      { name: 'Refresh token', tip: 'Access curto (15min) + refresh longo (30d) — renovação transparente' },
      { name: 'httpOnly cookie', tip: 'JS não acessa — imune a XSS, diferente de localStorage' },
      { name: 'HS256 vs RS256 básico', tip: 'HS256 simétrico, RS256 assimétrico com par de chaves' },
    ],
  },
  {
    id: 'pleno',
    name: 'Pleno',
    label: 'Pleno',
    emoji: '🛡️',
    concepts: [
      { name: 'algorithms[] fixo no verify', tip: 'Previne alg:none attack — nunca leia algoritmo do header do token' },
      { name: 'Validar iss e aud', tip: 'Além de exp — token pode ser válido mas emitido para outra audiência' },
      { name: 'Refresh token rotation + família', tip: 'Cada uso gera novo par, reuso do antigo revoga a família' },
      { name: 'jose para Edge Runtime', tip: 'Next.js middleware roda no Edge — jose funciona, jsonwebtoken não' },
      { name: 'JWKS e kid', tip: 'kid no header identifica qual chave pública verificar no /.well-known/jwks.json' },
    ],
  },
  {
    id: 'senior',
    name: 'Sênior',
    label: 'Sênior',
    emoji: '⚔️',
    concepts: [
      { name: 'JTI blocklist no Redis', tip: 'jti UUID + blocklist com TTL = revogação imediata sem perder stateless' },
      { name: 'Key rotation sem downtime', tip: 'Adicionar novo kid ao JWKS, tokens antigos validam com chave antiga até exp' },
      { name: 'JWE vs JWS', tip: 'JWS = assinado (payload visível), JWE = cifrado (payload opaco)' },
      { name: 'kid injection', tip: 'Atacante manipula kid para apontar para chave controlada por ele — whitelist de kids' },
      { name: 'RS256→HS256 downgrade', tip: 'Atacante usa chave pública RS256 como secret HS256 — fixar algoritmos previne' },
      { name: 'Clock skew tolerance', tip: '30-60s de tolerância em iat/exp para servidores com relógios levemente dessincronizados' },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export default function JwtVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'anatomy',
      title: 'Anatomia do JWT',
      subtitle: 'header.payload.signature — decodifique cada parte e entenda que payload não é cifrado',
      accent: C,
      component: <JwtAnatomyVisual />,
    },
    {
      id: 'oauth-flow',
      title: 'OAuth 2.0 + JWT',
      subtitle: 'Fluxo Authorization Code completo — do browser ao Resource API',
      accent: C,
      component: (
        <SequenceDiagram
          actors={OAUTH_ACTORS}
          messages={OAUTH_MESSAGES}
          accentColor={C}
          bgColor={BG}
          title="OAuth 2.0 Authorization Code Flow com JWT"
          description="Fluxo padrão OAuth 2.0: browser → auth server → troca de code por token → uso do Bearer JWT na API"
        />
      ),
    },
    {
      id: 'refresh-rotation',
      title: 'Refresh Token Rotation',
      subtitle: 'Fluxo normal e detecção de replay attack — veja a diferença entre os cenários',
      accent: C,
      component: <RefreshFlowVisual />,
    },
    {
      id: 'algorithms',
      title: 'HS256 vs RS256 vs ES256',
      subtitle: 'Comparativo completo de algoritmos — quando usar cada um em 7 critérios',
      accent: C,
      component: (
        <ComparisonTable
          options={ALG_OPTIONS}
          criteria={ALG_CRITERIA}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          title="Algoritmos de assinatura JWT — escolha pelo cenário"
          description="HS256 para simplicidade, RS256/ES256 para microserviços e JWKS. ES256 é o preferido em novos projetos."
        />
      ),
    },
    {
      id: 'antipatterns',
      title: 'Anti-patterns de Segurança',
      subtitle: 'Os erros mais comuns com JWT — errado vs correto lado a lado',
      accent: C,
      component: (
        <AntiPatternsGallery
          patterns={JWT_ANTIPATTERNS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'security-layers',
      title: 'Camadas de Segurança JWT',
      subtitle: 'Defesa em profundidade — do transporte até refresh token rotation',
      accent: C,
      component: (
        <LayerStack
          layers={JWT_SECURITY_LAYERS}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          title="JWT Security Layers — defesa em profundidade"
          description="Cada camada adiciona uma barreira. Nenhuma camada sozinha é suficiente — todas são necessárias em produção."
        />
      ),
    },
    {
      id: 'progression',
      title: 'Progressão: Iniciante → Sênior',
      subtitle: 'O que você precisa saber em cada nível — roadmap focado de JWT',
      accent: C,
      component: (
        <ProgressionMap
          levels={JWT_PROGRESSION}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          heading="JWT — Progressão de conhecimento"
          description="Do básico jwt.sign() até arquitetura de auth com rotação de chaves e zero-downtime."
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
