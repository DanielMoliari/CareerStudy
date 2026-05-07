import type { SkillContent } from '@/types'

const jwt: SkillContent = {
  tagline: "JSON Web Token — token stateless para autenticação e autorização em APIs.",
  why: "JWT é o mecanismo de auth mais comum em APIs REST. Saber estrutura, assinatura, validação, refresh tokens e os gotchas de segurança é obrigatório para qualquer backend.",
  summary: "JWT (JSON Web Token) é um token compacto e autocontido que carrega claims (dados) assinados. Composto por três partes em Base64url separadas por ponto: header (algoritmo), payload (claims) e assinatura. Stateless: o servidor não precisa armazenar sessões — valida apenas a assinatura. Riscos: token roubado é válido até expirar, alg:none attack, fraqueza no secret.",
  keypoints: [
    { title: "Estrutura", body: "header.payload.signature. Header: {alg: 'HS256', typ: 'JWT'}. Payload: {sub, iat, exp, roles}. Signature: HMAC-SHA256(base64(header)+'.'+base64(payload), secret)." },
    { title: "Claims padrão", body: "iss (issuer), sub (subject), aud (audience), exp (expiration), iat (issued at), nbf (not before), jti (JWT ID). Adicione claims customizados no payload conforme necessário." },
    { title: "Algoritmos", body: "HS256 (HMAC com secret compartilhado): simples, mesmo secret para assinar e verificar. RS256 (RSA): chave privada assina, chave pública verifica. ES256 (ECDSA): menor chave, mesma segurança do RSA. RS256/ES256 ideais para microserviços (compartilha só a pública)." },
    { title: "Refresh token pattern", body: "Access token: vida curta (15min). Refresh token: vida longa (7-30d), armazenado em httpOnly cookie, usado só para gerar novo access token. Balanceia segurança e UX." },
    { title: "Revogação", body: "JWT stateless não pode ser revogado antes de expirar sem estado server-side. Soluções: access token curto, blocklist de JTI no Redis, ou Session tokens." },
    { title: "Onde armazenar no cliente", body: "localStorage: simples mas vulnerável a XSS. httpOnly cookie: imune a XSS, mas requer CSRF protection (SameSite=Strict ou double-submit cookie). httpOnly cookie é o padrão recomendado." },
    { title: "JWS vs JWE", body: "JWS (JSON Web Signature): payload assinado mas legível (apenas integridade). JWE (JSON Web Encryption): payload cifrado (confidencialidade). Use JWE quando payload tem dados sensíveis." },
    { title: "Clock skew", body: "Servers em cluster podem ter relógios levemente dessincronizados. Bibliotecas aceitam skew de alguns segundos (clockTolerance). Sincronize via NTP e use margem razoável." },
  ],
  gotchas: [
    "alg:none attack — biblioteca que aceita 'none' como algoritmo valida token sem assinatura. Use bibliotecas que rejeitam alg:none por default.",
    "Secret fraco ou hardcoded — brute-force possível. Use secrets longos e aleatórios, rotativos.",
    "Payload com dados sensíveis — payload é Base64, não cifrado. Qualquer um pode decodificar. Não coloque senha, PII desnecessário.",
    "exp muito longo — token roubado fica válido por horas/dias. Access token deve ter vida curta.",
    "Não validar aud e iss — token de outro serviço aceito como válido.",
    "kid injection — se o servidor busca a chave pelo kid do header sem validar, atacante pode apontar para chave própria.",
    "Confiar no algoritmo do header — sempre fixe o algoritmo esperado ao verificar, nunca leia do header.",
  ],
  interview: [
    {
      q: "JWT vs Session — quando usar cada?",
      a: "<p><b>JWT:</b> APIs stateless, microserviços, mobile (sem cookie nativo), múltiplos domínios. Sem necessidade de estado no servidor.</p><p><b>Session:</b> apps web tradicionais, quando revogação imediata é necessária (logout instantâneo), quando payload é grande (não quer carregar no token).</p><p>Na prática: APIs usam JWT com access token curto + refresh token em httpOnly cookie. Isso combina stateless com capacidade de revogação.</p>",
      level: "pleno",
      tip: "Mencione o trade-off de revogação: JWT stateless não tem revogação instantânea sem estado server-side."
    },
    {
      q: "Como implementaria logout seguro com JWT?",
      a: "<p>Problema: JWT é stateless — não há como 'invalidar' um token antes de expirar.</p><p><b>Solução 1:</b> access token com vida muito curta (5-15min) + refresh token revogável. No logout, revoga o refresh token. O access token expira sozinho em breve.</p><p><b>Solução 2:</b> blocklist de JTI no Redis. No logout, adiciona o JTI na blocklist. Cada request verifica se JTI está na blocklist. Reintroduz estado, mas permite revogação instantânea.</p>",
      level: "senior",
      tip: "A blocklist reintroduz estado server-side — o trade-off de JWT stateless é perdido parcialmente. Mencione isso."
    },
    {
      q: "O que é o alg:none attack?",
      a: "<p>Algumas implementações antigas de JWT aceitam 'none' como algoritmo de assinatura. Um atacante pode pegar um token legítimo, modificar o payload, mudar o alg para 'none' e remover a assinatura — e o servidor aceita como válido.</p><p><b>Prevenção:</b> use bibliotecas modernas que rejeitam alg:none por default. Sempre especifique os algoritmos aceitos explicitamente na verificação: <code>jwt.verify(token, secret, { algorithms: ['HS256'] })</code>.</p>",
      level: "senior",
      tip: "Demonstre que você lê as opções da biblioteca — muitos devs usam verify sem fixar o algoritmo."
    },
    {
      q: "Qual a diferença entre HS256 e RS256?",
      a: "<p><b>HS256 (HMAC):</b> mesmo secret para assinar e verificar. Simples. Problema: todos os serviços que precisam verificar o token precisam ter o secret — maior surface de ataque.</p><p><b>RS256 (RSA):</b> chave privada assina (só o auth server tem), chave pública verifica (qualquer serviço pode ter). Ideal para microserviços — distribuí a pública, protegeu a privada. Padrão para OAuth 2.0 e OIDC.</p><p><b>ES256 (ECDSA):</b> mesmo modelo do RS256 mas com curvas elípticas — chaves menores, performance melhor.</p>",
      level: "senior",
      tip: "RS256/ES256 são necessários quando você publica um JWKS endpoint para que terceiros verifiquem tokens."
    },
    {
      q: "Explique o fluxo OAuth 2.0 com JWT.",
      a: "<p>OAuth 2.0 define o <i>fluxo</i> de autorização; JWT é usado como formato do access token:</p><ol><li>Client redireciona usuário ao Authorization Server com <code>response_type=code</code>.</li><li>Usuário autentica e consente. AS emite authorization code.</li><li>Client troca o code por access token (JWT) + refresh token via POST seguro.</li><li>Client usa o access token como Bearer em cada request.</li><li>Resource Server valida o JWT (assinatura + exp + aud) sem consultar o AS.</li></ol><p>OIDC adiciona o <b>ID Token</b> (JWT com claims de identidade do usuário).</p>",
      level: "senior",
      tip: "Diferencie OAuth (autorização) de OIDC (autenticação/identidade). Muitos confundem."
    },
    {
      q: "O que é refresh token rotation e por que usar?",
      a: "<p>Refresh token rotation: cada vez que o refresh token é usado para obter um novo access token, um <b>novo refresh token</b> é emitido e o antigo é invalidado.</p><p><b>Benefícios:</b></p><ul><li>Detecta replay attacks: se o token antigo for reutilizado (por atacante), o sistema percebe e invalida todos os tokens da família.</li><li>Limita a janela de exploração de um token roubado.</li></ul><p><b>Implementação:</b> armazena família de refresh tokens; ao detectar reuso do antigo, revoga toda a família forçando novo login.</p>",
      level: "senior",
      tip: "Família de tokens é o conceito-chave para detecção de reuso — mencione que Auth0/Okta implementam isso nativamente."
    },
    {
      q: "Como o payload do JWT é codificado? É seguro armazenar dados sensíveis?",
      a: "<p>O payload é codificado em <b>Base64url</b> — não é cifrado, apenas codificado. Qualquer pessoa com o token pode decodificar e ler o payload usando uma simples chamada <code>atob()</code> ou <code>Buffer.from(payload, 'base64')</code>.</p><p><b>Não</b> armazene: senhas, tokens de terceiros, PII desnecessário (CPF, endereço).</p><p>Pode armazenar: sub (user ID), roles, email (se necessário para UX). Para dados realmente sensíveis use <b>JWE</b> (JSON Web Encryption).</p>",
      level: "pleno",
      tip: "Demonstre na prática: cole um JWT no jwt.io e mostre que qualquer um lê o payload."
    },
    {
      q: "O que são as claims nbf e jti e quando usar?",
      a: "<p><b>nbf (not before):</b> o token não é válido antes do timestamp especificado. Útil para tokens agendados (ex: acesso liberado em horário futuro) ou para lidar com clock skew entre serviços.</p><p><b>jti (JWT ID):</b> identificador único do token. Usado para implementar blocklist de tokens revogados (no logout, armazena o jti no Redis com TTL igual ao exp restante). Também previne replay attacks.</p>",
      level: "pleno",
      tip: "jti é a chave para implementar revogação sem jogar fora o modelo stateless completamente."
    },
    {
      q: "Como funciona o kid injection attack?",
      a: "<p>Quando o servidor usa o campo <code>kid</code> (key ID) do header JWT para buscar a chave de verificação, um atacante pode manipular esse campo.</p><p><b>Cenário 1:</b> servidor busca chave de um banco de dados usando o kid → atacante injeta SQL via kid, faz lookup retornar valor controlado → forja token.</p><p><b>Cenário 2:</b> servidor busca chave via path de arquivo → atacante aponta para arquivo previsível (/dev/null, etc.).</p><p><b>Prevenção:</b> validar que o kid está em um whitelist; nunca usar kid diretamente em queries ou paths sem sanitização.</p>",
      level: "senior",
      tip: "kid injection é menos conhecida que alg:none mas igualmente crítica — demonstra leitura de CVEs e análise de segurança."
    },
    {
      q: "httpOnly cookie vs localStorage para armazenar JWT — qual recomenda?",
      a: "<p><b>localStorage:</b></p><ul><li>Vulnerável a XSS — qualquer script injetado lê o token.</li><li>Simples de implementar em SPAs.</li></ul><p><b>httpOnly cookie:</b></p><ul><li>Imune a XSS (JS não acessa).</li><li>Requer proteção contra CSRF: <code>SameSite=Strict</code> ou <code>Lax</code> + CSRF token.</li><li>Funciona nativamente com SSR (Next.js, Remix).</li></ul><p><b>Recomendação:</b> httpOnly cookie + SameSite=Lax para a maioria dos casos. Para APIs públicas consumidas por mobile/third-party, Authorization Bearer header (mas o cliente é responsável pelo armazenamento seguro).</p>",
      level: "pleno",
      tip: "SameSite=Lax protege contra CSRF em navegadores modernos mas ainda permite GET cross-site. Para mutação, use CSRF token adicional."
    },
    {
      q: "O que é JWKS e como o servidor usa para verificar tokens?",
      a: "<p><b>JWKS (JSON Web Key Set):</b> endpoint público que expõe as chaves públicas do Authorization Server em formato padronizado.</p><p><b>Fluxo:</b></p><ol><li>Resource Server recebe JWT com <code>kid</code> no header.</li><li>Busca a chave pública correspondente no JWKS do AS (ex: <code>https://auth.example.com/.well-known/jwks.json</code>).</li><li>Verifica a assinatura com a chave pública.</li><li>Cacheia a chave localmente para evitar lookup em todo request.</li></ol><p>Padrão OIDC. Permite rotação de chaves sem coordenação manual entre serviços.</p>",
      level: "senior",
      tip: "Cache do JWKS é crítico para performance. Use TTL razoável e invalide ao receber token com kid desconhecido."
    },
    {
      q: "Como tratar clock skew entre servidores ao validar JWT?",
      a: "<p>Servidores em cluster podem ter relógios com diferença de segundos. O claim <code>exp</code> pode rejeitar tokens válidos se o servidor receptor está levemente atrasado.</p><p><b>Soluções:</b></p><ul><li>Sincronizar todos os servidores via NTP.</li><li>Usar <code>clockTolerance</code> na verificação (ex: 30s de tolerância): <code>jwt.verify(token, secret, { clockTolerance: 30 })</code>.</li><li>Não usar tolerância excessiva — abre janela para replay.</li></ul><p><b>nbf</b> sofre o mesmo problema inversamente (token emitido pode não ser válido ainda no receptor adiantado).</p>",
      level: "senior",
      tip: "Mencione que serverless/Lambda pode ter clock drift significativo — tolerância de 30-60s é comum em produção."
    },
    {
      q: "Quais claims devo validar obrigatoriamente ao verificar um JWT?",
      a: "<p>Validações obrigatórias:</p><ul><li><b>Assinatura:</b> integridade e autenticidade do token.</li><li><b>exp:</b> token não expirou.</li><li><b>iss:</b> emitido pelo servidor correto (evita tokens de outro ambiente/serviço).</li><li><b>aud:</b> destinado a este serviço (evita tokens de outros clientes).</li><li><b>alg:</b> algoritmo esperado (fixar no código, não confiar no header).</li></ul><p>Opcionais mas recomendados:</p><ul><li><b>nbf:</b> se usado, verificar.</li><li><b>jti:</b> verificar na blocklist se revogação está implementada.</li></ul>",
      level: "pleno",
      tip: "aud é a validação mais esquecida — sem ela, um token emitido para o app mobile pode ser aceito pela API admin."
    },
    {
      q: "Como implementar rotação de chaves (key rotation) sem downtime?",
      a: "<p><b>Problema:</b> trocar o secret/chave invalida todos os tokens ativos imediatamente.</p><p><b>Solução com RSA/EC + JWKS:</b></p><ol><li>Gere novo par de chaves, adicione ao JWKS com novo kid.</li><li>Novos tokens são assinados com a nova chave (novo kid).</li><li>Tokens antigos (kid antigo) continuam sendo verificados com a chave antiga.</li><li>Quando todos os tokens antigos expirarem (após 1 vida do access token), remova a chave antiga do JWKS.</li></ol><p>Com HS256 (secret compartilhado): só é possível rotacionar com downtime ou período de aceitação dupla.</p>",
      level: "senior",
      tip: "Esse é o motivo pelo qual RS256/ES256 são superiores ao HS256 em produção — permitem rotação suave."
    },
    {
      q: "Como o JWT se encaixa numa arquitetura de microserviços?",
      a: "<p><b>Padrão:</b> Auth Service central emite JWTs com RS256. Cada microserviço verifica independentemente usando a chave pública (ou JWKS).</p><p><b>Benefícios:</b></p><ul><li>Sem chamada ao Auth Service em todo request (stateless verification).</li><li>Claims úteis propagados no token (userId, roles, tenantId).</li></ul><p><b>Desafios:</b></p><ul><li>Revogação: token comprometido válido até exp — mitigar com vida curta.</li><li>Claims stale: roles mudaram mas token antigo ainda carrega os antigos.</li><li>Não propagar tokens internos como externos — use tokens de serviço separados.</li></ul>",
      level: "senior",
      tip: "Token propagation entre microserviços é arriscado — prefira re-emitir tokens de serviço internos com escopo mínimo."
    },
    {
      q: "Quais são as diferenças entre JWS e JWE?",
      a: "<p><b>JWS (JSON Web Signature):</b> token assinado. O payload é visível (Base64url), apenas a integridade é garantida. É o que chamamos comumente de JWT.</p><p><b>JWE (JSON Web Encryption):</b> token cifrado. O payload está cifrado — nem mesmo alguém com o token consegue ler sem a chave. Garante confidencialidade.</p><p><b>Quando usar JWE:</b> quando o payload contém dados sensíveis que não podem vazar (PII, dados financeiros, claims internos).</p><p><b>Estrutura JWE:</b> 5 partes separadas por ponto: header, encrypted key, IV, ciphertext, authentication tag.</p>",
      level: "senior",
      tip: "JWE tem custo computacional maior. Na maioria dos casos, JWS + HTTPS é suficiente. Justifique JWE apenas quando há requisito real de confidencialidade do payload."
    },
    {
      q: "Como implementar autenticação com JWT no Next.js (App Router)?",
      a: "<p><b>Abordagem recomendada:</b> httpOnly cookie + middleware de verificação.</p><ol><li>Login: POST credentials → API route valida → emite JWT em cookie httpOnly SameSite=Lax.</li><li>Middleware (<code>middleware.ts</code>): intercepta rotas protegidas → verifica JWT com <code>jose</code> (Edge Runtime compatível) → redireciona se inválido.</li><li>Server Components: leem cookie via <code>cookies()</code> do next/headers, decodificam payload para dados do usuário.</li></ol><p><b>Biblioteca:</b> use <code>jose</code> (não <code>jsonwebtoken</code> — não roda no Edge Runtime).</p>",
      level: "senior",
      tip: "jsonwebtoken usa Node crypto que não existe no Edge Runtime do Next.js. jose é o substituto padrão para middleware."
    },
    {
      q: "O que é o Bearer token scheme e como funciona?",
      a: "<p><b>Bearer token</b> é o scheme de autenticação HTTP mais comum com JWT:</p><code>Authorization: Bearer eyJhbGci...</code><p>O termo 'Bearer' significa que quem possui (bears) o token tem acesso — sem necessidade de prova adicional de identidade. Portanto, proteção do token é crítica.</p><p><b>Fluxo:</b></p><ol><li>Client inclui token no header Authorization de cada request.</li><li>Server extrai via: <code>const token = req.headers.authorization?.split(' ')[1]</code>.</li><li>Server valida o token e extrai claims.</li></ol><p>Padrão RFC 6750.</p>",
      level: "pleno",
      tip: "Ao contrário de cookies, o client JavaScript precisa gerenciar e enviar o header manualmente em cada request."
    },
    {
      q: "Como detectar e mitigar um JWT roubado?",
      a: "<p><b>Detecção:</b></p><ul><li>Analisar padrões de uso: IP geográfico inconsistente, user agent diferente, horário incomum.</li><li>Refresh token rotation: reuso do refresh antigo sinaliza possível roubo.</li><li>Fingerprinting: incluir device fingerprint como claim e verificar consistência.</li></ul><p><b>Mitigação:</b></p><ul><li>Access token curto (15min) limita janela de exploração.</li><li>Ao detectar, revogar toda a família de refresh tokens → força novo login.</li><li>Notificar usuário via email/push.</li><li>Bloquear IP suspeito temporariamente.</li></ul>",
      level: "senior",
      tip: "Não há solução perfeita para token roubado com JWT puro — a camada de defesa é múltipla e baseada em heurística."
    },
    {
      q: "Por que nunca deve aceitar o algoritmo do header JWT ao verificar?",
      a: "<p>O header JWT especifica qual algoritmo foi usado para assinar. Se o servidor lê esse valor e o usa para verificar, um atacante pode:</p><ul><li>Trocar para <code>none</code> e remover a assinatura (alg:none attack).</li><li>Trocar de RS256 para HS256 — se o servidor usar a chave pública como secret HMAC, aceita token forjado.</li></ul><p><b>Regra:</b> sempre <b>fixe</b> o algoritmo esperado no código de verificação. Nunca confie no algoritmo declarado no token.</p><p><code>jwt.verify(token, publicKey, { algorithms: ['RS256'] })</code></p>",
      level: "senior",
      tip: "O RS256→HS256 downgrade é particularmente insidioso porque a chave pública é pública — qualquer um pode usar como secret HMAC."
    },
    {
      q: "Como estruturar claims customizados no JWT de forma organizada?",
      a: "<p>Claims customizados devem usar namespacing para evitar colisão com claims padrão RFC:</p><p><b>Opção 1 — URL namespace:</b> <code>{ 'https://myapp.com/roles': ['admin'], 'https://myapp.com/tenant': 'acme' }</code></p><p><b>Opção 2 — prefixo simples:</b> <code>{ app_roles: ['admin'], app_tenant: 'acme' }</code></p><p><b>Boas práticas:</b></p><ul><li>Não inclua dados que mudam frequentemente (roles mutáveis geram claims stale).</li><li>Minimize o payload — JWT vai em todo request (HTTP header).</li><li>Separe dados de identidade (sub, email) de dados de autorização (roles, scopes).</li></ul>",
      level: "pleno",
      tip: "Auth0 usa URL namespace por padrão. Padronize internamente e documente o contrato de claims."
    },
    {
      q: "Qual é a diferença entre autenticação e autorização no contexto de JWT?",
      a: "<p><b>Autenticação:</b> quem você é. JWT prova a identidade do usuário via assinatura verificável — o servidor confia que o sub do token identifica o usuário correto.</p><p><b>Autorização:</b> o que você pode fazer. Claims como <code>roles</code>, <code>scope</code>, <code>permissions</code> no payload definem o que o usuário está autorizado a fazer.</p><p><b>Na prática:</b> o JWT autentica (prova identidade) e autoriza (carrega permissões) em uma única estrutura. O servidor valida a assinatura (auth) e verifica os claims (authz) sem estado server-side.</p>",
      level: "pleno",
      tip: "OAuth 2.0 é um framework de autorização, não de autenticação. OIDC adiciona autenticação sobre OAuth."
    },
    {
      q: "Quais bibliotecas usar para JWT em Node.js e qual o trade-off entre elas?",
      a: "<p><b>jsonwebtoken:</b> biblioteca mais popular. Usa Node.js crypto. Não roda no Edge Runtime. Síncrona (verify síncrono). Madura e amplamente testada.</p><p><b>jose:</b> puro JavaScript, roda em qualquer runtime (Edge, Deno, browser, Node). Suporta JWS, JWE, JWKS. API moderna (Promise-based). Recomendada para Next.js middleware e Cloudflare Workers.</p><p><b>fast-jwt:</b> foco em performance. Compatível com Node. Mais rápido que jsonwebtoken em benchmarks.</p><p><b>Recomendação:</b> <code>jose</code> para projetos novos, especialmente com Edge Runtime. <code>jsonwebtoken</code> para projetos legados Node puro.</p>",
      level: "senior",
      tip: "A migração de jsonwebtoken para jose é necessária ao mover para Next.js middleware ou qualquer Edge Runtime."
    },
  ],
  codeExamples: [
    {
      title: "Assinar e verificar JWT com jsonwebtoken (Node.js)",
      language: "typescript",
      code: `import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET! // nunca hardcode

// Assinar access token
function signAccessToken(userId: string, roles: string[]) {
  return jwt.sign(
    { sub: userId, roles, iss: 'auth.myapp.com', aud: 'api.myapp.com' },
    SECRET,
    { algorithm: 'HS256', expiresIn: '15m' }
  )
}

// Verificar com algoritmo fixo — nunca ler do header
function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET, {
      algorithms: ['HS256'], // fixar algoritmo obrigatório
      issuer: 'auth.myapp.com',
      audience: 'api.myapp.com',
    })
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) throw new Error('Token expirado')
    if (err instanceof jwt.JsonWebTokenError) throw new Error('Token inválido')
    throw err
  }
}`,
    },
    {
      title: "Refresh token rotation com Redis (Node.js)",
      language: "typescript",
      code: `import { createClient } from 'redis'
import jwt from 'jsonwebtoken'
import { randomUUID } from 'crypto'

const redis = createClient()

async function issueTokenPair(userId: string) {
  const familyId = randomUUID()
  const refreshToken = randomUUID()

  // Armazena família no Redis com TTL de 30 dias
  await redis.setEx(
    \`refresh:\${refreshToken}\`,
    30 * 24 * 3600,
    JSON.stringify({ userId, familyId })
  )

  const accessToken = jwt.sign({ sub: userId }, process.env.JWT_SECRET!, {
    expiresIn: '15m',
  })

  return { accessToken, refreshToken }
}

async function rotateRefreshToken(oldRefreshToken: string) {
  const data = await redis.get(\`refresh:\${oldRefreshToken}\`)

  if (!data) {
    // Token não existe — possível replay attack
    // Revogar toda a família seria ideal aqui
    throw new Error('Refresh token inválido ou já usado')
  }

  const { userId, familyId } = JSON.parse(data)

  // Invalidar token antigo imediatamente
  await redis.del(\`refresh:\${oldRefreshToken}\`)

  // Emitir novo par
  return issueTokenPair(userId)
}`,
    },
    {
      title: "Middleware JWT no Next.js App Router com jose",
      language: "typescript",
      code: `// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  try {
    const { payload } = await jwtVerify(token, SECRET, {
      algorithms: ['HS256'],
      issuer: 'auth.myapp.com',
      audience: 'api.myapp.com',
    })

    // Injetar userId no header para Server Components
    const res = NextResponse.next()
    res.headers.set('x-user-id', payload.sub as string)
    return res
  } catch {
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/protected/:path*'],
}`,
    },
    {
      title: "Verificação com JWKS (chave pública rotacionável)",
      language: "typescript",
      code: `import { createRemoteJWKSet, jwtVerify } from 'jose'

// Busca e cacheia chaves públicas automaticamente
const JWKS = createRemoteJWKSet(
  new URL('https://auth.myapp.com/.well-known/jwks.json')
)

async function verifyWithJwks(token: string) {
  const { payload } = await jwtVerify(token, JWKS, {
    algorithms: ['RS256'], // fixar algoritmo
    issuer: 'https://auth.myapp.com',
    audience: 'https://api.myapp.com',
  })
  return payload
}

// Se kid do token não for encontrado no cache, jose
// faz novo fetch do JWKS automaticamente (key rotation transparente)`,
    },
  ],
  diagrams: [
    {
      title: "Anatomia do JWT",
      caption: "As três partes do token e como se conectam.",
      html: `<style>
.jwt-wrap { font-family: 'JetBrains Mono', monospace; padding: 16px; background: #0f172a; border-radius: 10px; color: #e2e8f0; }
.jwt-token { display: flex; gap: 4px; margin-bottom: 20px; flex-wrap: wrap; }
.jwt-part { padding: 6px 12px; border-radius: 6px; font-size: 13px; font-weight: 700; letter-spacing: 0.5px; }
.jwt-h { background: #ef4444; color: #fff; }
.jwt-p { background: #8b5cf6; color: #fff; }
.jwt-s { background: #10b981; color: #fff; }
.jwt-sep { color: #64748b; font-size: 20px; display: flex; align-items: center; }
.jwt-detail { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.jwt-box { background: #1e293b; border-radius: 8px; padding: 12px; }
.jwt-box h4 { margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
.jwt-box.h h4 { color: #ef4444; }
.jwt-box.p h4 { color: #8b5cf6; }
.jwt-box.s h4 { color: #10b981; }
.jwt-field { font-size: 11px; color: #94a3b8; padding: 2px 0; }
.jwt-field b { color: #e2e8f0; }
</style>
<div class="jwt-wrap">
  <div class="jwt-token">
    <span class="jwt-part jwt-h">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9</span>
    <span class="jwt-sep">.</span>
    <span class="jwt-part jwt-p">eyJzdWIiOiIxMjM0NTY3ODkwIn0</span>
    <span class="jwt-sep">.</span>
    <span class="jwt-part jwt-s">SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c</span>
  </div>
  <div class="jwt-detail">
    <div class="jwt-box h">
      <h4>Header</h4>
      <div class="jwt-field"><b>alg:</b> "HS256"</div>
      <div class="jwt-field"><b>typ:</b> "JWT"</div>
    </div>
    <div class="jwt-box p">
      <h4>Payload (Claims)</h4>
      <div class="jwt-field"><b>sub:</b> "user-id"</div>
      <div class="jwt-field"><b>iat:</b> 1700000000</div>
      <div class="jwt-field"><b>exp:</b> 1700000900</div>
      <div class="jwt-field"><b>roles:</b> ["admin"]</div>
    </div>
    <div class="jwt-box s">
      <h4>Signature</h4>
      <div class="jwt-field">HMAC‑SHA256(</div>
      <div class="jwt-field">  base64(header) +</div>
      <div class="jwt-field">  "." +</div>
      <div class="jwt-field">  base64(payload),</div>
      <div class="jwt-field">  secret</div>
      <div class="jwt-field">)</div>
    </div>
  </div>
</div>`,
    },
    {
      title: "Fluxo Access Token + Refresh Token",
      caption: "Ciclo completo de autenticação com rotação de tokens.",
      html: `<style>
.jwtf-wrap { font-family: sans-serif; padding: 16px; background: #0f172a; border-radius: 10px; color: #e2e8f0; font-size: 13px; }
.jwtf-row { display: flex; align-items: center; gap: 8px; padding: 8px 0; border-bottom: 1px solid #1e293b; }
.jwtf-row:last-child { border-bottom: none; }
.jwtf-actor { min-width: 90px; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
.jwtf-client { color: #38bdf8; }
.jwtf-server { color: #a78bfa; }
.jwtf-arrow { color: #ef4444; font-size: 16px; }
.jwtf-desc { flex: 1; color: #cbd5e1; }
.jwtf-tag { font-size: 10px; background: #1e293b; color: #94a3b8; border-radius: 4px; padding: 2px 6px; margin-left: 4px; }
.jwtf-tag.green { background: #064e3b; color: #34d399; }
.jwtf-tag.red { background: #450a0a; color: #f87171; }
</style>
<div class="jwtf-wrap">
  <div class="jwtf-row">
    <span class="jwtf-actor jwtf-client">Client</span>
    <span class="jwtf-arrow">→</span>
    <span class="jwtf-actor jwtf-server">Server</span>
    <span class="jwtf-desc">POST /login { email, password }</span>
  </div>
  <div class="jwtf-row">
    <span class="jwtf-actor jwtf-server">Server</span>
    <span class="jwtf-arrow">→</span>
    <span class="jwtf-actor jwtf-client">Client</span>
    <span class="jwtf-desc">access_token (15min) + Set-Cookie: refresh_token (httpOnly, 30d)</span>
    <span class="jwtf-tag green">Sucesso</span>
  </div>
  <div class="jwtf-row">
    <span class="jwtf-actor jwtf-client">Client</span>
    <span class="jwtf-arrow">→</span>
    <span class="jwtf-actor jwtf-server">Server</span>
    <span class="jwtf-desc">GET /api/data — Authorization: Bearer access_token</span>
  </div>
  <div class="jwtf-row">
    <span class="jwtf-actor jwtf-server">Server</span>
    <span class="jwtf-arrow">→</span>
    <span class="jwtf-actor jwtf-client">Client</span>
    <span class="jwtf-desc">Valida assinatura, exp, iss, aud → responde com dados</span>
    <span class="jwtf-tag green">Stateless</span>
  </div>
  <div class="jwtf-row">
    <span class="jwtf-actor jwtf-client">Client</span>
    <span class="jwtf-arrow">→</span>
    <span class="jwtf-actor jwtf-server">Server</span>
    <span class="jwtf-desc">POST /refresh (cookie enviado automaticamente)</span>
    <span class="jwtf-tag red">access expirou</span>
  </div>
  <div class="jwtf-row">
    <span class="jwtf-actor jwtf-server">Server</span>
    <span class="jwtf-arrow">→</span>
    <span class="jwtf-actor jwtf-client">Client</span>
    <span class="jwtf-desc">Invalida refresh antigo → emite novo par (rotation)</span>
    <span class="jwtf-tag green">Rotation</span>
  </div>
</div>`,
    },
    {
      title: "HS256 vs RS256 vs ES256 — Comparação",
      caption: "Escolha do algoritmo de assinatura conforme o cenário.",
      html: `<style>
.jwta-wrap { font-family: sans-serif; background: #0f172a; border-radius: 10px; padding: 16px; color: #e2e8f0; font-size: 12px; }
.jwta-table { width: 100%; border-collapse: collapse; }
.jwta-table th { background: #1e293b; padding: 8px 10px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; color: #94a3b8; }
.jwta-table td { padding: 8px 10px; border-bottom: 1px solid #1e293b; vertical-align: top; }
.jwta-table tr:last-child td { border-bottom: none; }
.jwta-alg { font-weight: 700; color: #ef4444; font-family: 'JetBrains Mono', monospace; }
.jwta-good { color: #34d399; }
.jwta-bad { color: #f87171; }
.jwta-note { color: #94a3b8; font-style: italic; }
</style>
<div class="jwta-wrap">
  <table class="jwta-table">
    <tr>
      <th>Algoritmo</th><th>Tipo</th><th>Chaves</th><th>Use quando</th><th>Cuidados</th>
    </tr>
    <tr>
      <td class="jwta-alg">HS256</td>
      <td>Simétrico</td>
      <td>1 secret compartilhado</td>
      <td class="jwta-good">Monolito, serviços internos confiáveis</td>
      <td class="jwta-bad">Todos com acesso de verificação também podem forjar tokens</td>
    </tr>
    <tr>
      <td class="jwta-alg">RS256</td>
      <td>Assimétrico</td>
      <td>Par RSA (privada + pública)</td>
      <td class="jwta-good">Microserviços, OAuth, OIDC, JWKS público</td>
      <td class="jwta-note">Chaves maiores (~2048 bits), operação mais lenta</td>
    </tr>
    <tr>
      <td class="jwta-alg">ES256</td>
      <td>Assimétrico</td>
      <td>Par EC (privada + pública)</td>
      <td class="jwta-good">Mesmo casos do RS256 + dispositivos com recursos limitados</td>
      <td class="jwta-note">Curva P-256. Chaves menores, rápido, recomendado para novos projetos</td>
    </tr>
  </table>
</div>`,
    },
  ],
  mnemonics: [
    {
      label: "Estrutura JWT: HPS",
      trick: "H.P.S = Header.Payload.Signature",
      explanation: "As três partes do JWT separadas por ponto. Header (algoritmo), Payload (claims/dados), Signature (prova de integridade). Lembre: 'Hoje Pago Seguro'.",
    },
    {
      label: "Claims padrão: IS AE IN",
      trick: "ISS, SUB, AUD, EXP, IAT, NBF, JTI",
      explanation: "Issuer, Subject, Audience, Expiration, Issued At, Not Before, JWT ID. Mnemônico: 'I See A Expired Issue Now, Just Take It' — cada palavra inicial mapeia para uma claim.",
    },
    {
      label: "HS256 vs RS256: Simétrico vs Assimétrico",
      trick: "HS = H de Humilde (1 chave), RS = R de Repartir (2 chaves)",
      explanation: "HS256 usa um único secret compartilhado — humilde e simples. RS256 usa par de chaves — você reparte (distribui) a chave pública. Quando precisa distribuir verificação entre microserviços, use RS/ES.",
    },
    {
      label: "Revogação: A-B-C",
      trick: "Access curto, Blocklist JTI, Cookie httpOnly",
      explanation: "As três estratégias de mitigação para o problema de revogação JWT. Access token com vida curta limita o dano. Blocklist de JTI permite revogação. Cookie httpOnly protege de XSS.",
    },
  ],
  cheatsheet: {
    title: "JWT Cheatsheet",
    caption: "Referência rápida de segurança e implementação.",
    html: `<style>
.jwtcs-wrap { font-family: sans-serif; background: #0f172a; border-radius: 10px; padding: 16px; color: #e2e8f0; font-size: 12px; }
.jwtcs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.jwtcs-card { background: #1e293b; border-radius: 8px; padding: 12px; }
.jwtcs-card h4 { margin: 0 0 8px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; color: #ef4444; }
.jwtcs-item { padding: 3px 0; color: #cbd5e1; display: flex; gap: 6px; }
.jwtcs-item::before { content: '▸'; color: #ef4444; flex-shrink: 0; }
.jwtcs-code { font-family: 'JetBrains Mono', monospace; font-size: 11px; background: #0f172a; padding: 2px 5px; border-radius: 3px; color: #34d399; }
.jwtcs-warn { color: #f87171; }
</style>
<div class="jwtcs-wrap">
  <div class="jwtcs-grid">
    <div class="jwtcs-card">
      <h4>Claims Obrigatórios para Validar</h4>
      <div class="jwtcs-item">Assinatura (integridade)</div>
      <div class="jwtcs-item"><span class="jwtcs-code">exp</span> — não expirou</div>
      <div class="jwtcs-item"><span class="jwtcs-code">iss</span> — issuer correto</div>
      <div class="jwtcs-item"><span class="jwtcs-code">aud</span> — audience correto</div>
      <div class="jwtcs-item">Algoritmo fixo no código</div>
    </div>
    <div class="jwtcs-card">
      <h4>Ataques e Prevenções</h4>
      <div class="jwtcs-item"><span class="jwtcs-warn">alg:none</span> → fixar algorithms[]</div>
      <div class="jwtcs-item"><span class="jwtcs-warn">Secret fraco</span> → secret longo e aleatório</div>
      <div class="jwtcs-item"><span class="jwtcs-warn">kid injection</span> → whitelist de kids</div>
      <div class="jwtcs-item"><span class="jwtcs-warn">Payload visível</span> → JWE se dados sensíveis</div>
      <div class="jwtcs-item"><span class="jwtcs-warn">Token roubado</span> → access curto + rotation</div>
    </div>
    <div class="jwtcs-card">
      <h4>Tempo de Vida Recomendado</h4>
      <div class="jwtcs-item">Access token: <span class="jwtcs-code">15min</span></div>
      <div class="jwtcs-item">Refresh token: <span class="jwtcs-code">7-30 dias</span></div>
      <div class="jwtcs-item">ID token (OIDC): <span class="jwtcs-code">1h</span></div>
      <div class="jwtcs-item">Clock skew tolerância: <span class="jwtcs-code">30-60s</span></div>
    </div>
    <div class="jwtcs-card">
      <h4>Bibliotecas Node.js</h4>
      <div class="jwtcs-item"><span class="jwtcs-code">jsonwebtoken</span> — Node, legado</div>
      <div class="jwtcs-item"><span class="jwtcs-code">jose</span> — Edge Runtime, JWKS</div>
      <div class="jwtcs-item"><span class="jwtcs-code">fast-jwt</span> — performance</div>
      <div class="jwtcs-item">Next.js middleware → use <span class="jwtcs-code">jose</span></div>
    </div>
  </div>
</div>`,
  },
  mindmap: {
    title: "JWT — Mapa Mental",
    html: `<style>
.jwtmm-wrap { font-family: sans-serif; background: #0f172a; border-radius: 10px; padding: 20px; color: #e2e8f0; font-size: 12px; }
.jwtmm-center { text-align: center; background: #ef4444; color: #fff; border-radius: 50%; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; margin: 0 auto 20px; }
.jwtmm-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.jwtmm-node { background: #1e293b; border-radius: 8px; padding: 10px; }
.jwtmm-node h4 { margin: 0 0 6px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; color: #38bdf8; }
.jwtmm-leaf { font-size: 11px; color: #94a3b8; padding: 2px 0; }
</style>
<div class="jwtmm-wrap">
  <div class="jwtmm-center">JWT</div>
  <div class="jwtmm-grid">
    <div class="jwtmm-node">
      <h4>Estrutura</h4>
      <div class="jwtmm-leaf">Header (alg, typ)</div>
      <div class="jwtmm-leaf">Payload (claims)</div>
      <div class="jwtmm-leaf">Signature</div>
      <div class="jwtmm-leaf">Base64url encoding</div>
    </div>
    <div class="jwtmm-node">
      <h4>Algoritmos</h4>
      <div class="jwtmm-leaf">HS256 — simétrico</div>
      <div class="jwtmm-leaf">RS256 — RSA assimétrico</div>
      <div class="jwtmm-leaf">ES256 — ECDSA</div>
      <div class="jwtmm-leaf">JWKS — rotação</div>
    </div>
    <div class="jwtmm-node">
      <h4>Claims</h4>
      <div class="jwtmm-leaf">iss, sub, aud</div>
      <div class="jwtmm-leaf">exp, iat, nbf</div>
      <div class="jwtmm-leaf">jti (revogação)</div>
      <div class="jwtmm-leaf">Custom claims</div>
    </div>
    <div class="jwtmm-node">
      <h4>Segurança</h4>
      <div class="jwtmm-leaf">alg:none attack</div>
      <div class="jwtmm-leaf">kid injection</div>
      <div class="jwtmm-leaf">Secret fraco</div>
      <div class="jwtmm-leaf">Token roubado</div>
    </div>
    <div class="jwtmm-node">
      <h4>Armazenamento</h4>
      <div class="jwtmm-leaf">httpOnly cookie</div>
      <div class="jwtmm-leaf">localStorage (risco XSS)</div>
      <div class="jwtmm-leaf">SameSite=Lax</div>
      <div class="jwtmm-leaf">CSRF protection</div>
    </div>
    <div class="jwtmm-node">
      <h4>Revogação</h4>
      <div class="jwtmm-leaf">Access token curto</div>
      <div class="jwtmm-leaf">JTI blocklist Redis</div>
      <div class="jwtmm-leaf">Refresh rotation</div>
      <div class="jwtmm-leaf">Família de tokens</div>
    </div>
  </div>
</div>`,
  },
  exercises: [
    {
      level: "iniciante",
      title: "Decodificar e inspecionar um JWT",
      description: "Pegue qualquer JWT (pode gerar em jwt.io). Separe as três partes pelo '.'. Decodifique o header e payload com atob() no browser. Identifique todos os claims presentes. Explique por que isso prova que JWT não é criptografia.",
      concepts: ["estrutura JWT", "Base64url", "claims", "header", "payload"],
    },
    {
      level: "intermediario",
      title: "Implementar autenticação JWT com refresh token",
      description: "Crie uma API Express simples com: POST /login (emite access token 15min + refresh token em cookie httpOnly), GET /protected (valida access token via Bearer header), POST /refresh (valida refresh token do cookie, emite novo par com rotation). Armazene refresh tokens em um Map em memória simulando Redis. Teste o fluxo completo com curl ou Insomnia.",
      concepts: ["access token", "refresh token", "httpOnly cookie", "Bearer header", "token rotation"],
      hint: "Use jsonwebtoken para tokens e uuid para IDs de refresh token. O cookie deve ter httpOnly=true e sameSite='lax'.",
    },
    {
      level: "senior",
      title: "Implementar blocklist de JTI para revogação instantânea",
      description: "Expanda a API anterior: adicione o claim jti (UUID) a cada access token. Crie um endpoint POST /logout que adiciona o jti atual à blocklist no Redis (TTL = tempo restante do token via exp - Date.now()/1000). Atualize o middleware de verificação para checar o jti na blocklist antes de aceitar o token. Adicione também refresh token rotation com detecção de replay: ao reusar refresh token já invalidado, revogar toda a família (todos os refresh tokens do usuário). Escreva testes para: logout funciona, token após logout é rejeitado, replay de refresh token dispara revogação da família.",
      concepts: ["jti", "blocklist", "Redis TTL", "refresh token rotation", "família de tokens", "replay detection"],
      hint: "Use ioredis ou @redis/client. TTL do JTI na blocklist: Math.ceil(payload.exp - Date.now() / 1000) segundos.",
    },
  ],
  videos: [
    {
      title: "JWT Authentication Tutorial — Web Dev Simplified",
      channel: "Web Dev Simplified",
      url: "https://www.youtube.com/watch?v=mbsmsi7l3r4",
      topic: "Implementação prática de JWT com refresh tokens em Node.js",
    },
    {
      title: "JWT Security Best Practices — OWASP",
      channel: "OWASP Foundation",
      url: "https://www.youtube.com/watch?v=rCkDE2me_qk",
      topic: "Ataques comuns e como mitigá-los",
    },
    {
      title: "OAuth 2.0 and OpenID Connect — OktaDev",
      channel: "OktaDev",
      url: "https://www.youtube.com/watch?v=996OiexHze0",
      topic: "Fluxo OAuth 2.0 e OIDC com JWT",
    },
    {
      title: "JSON Web Tokens Explained — Fireship",
      channel: "Fireship",
      url: "https://www.youtube.com/watch?v=UBUNrFtufWo",
      topic: "Visão geral rápida de JWT em 100 segundos",
    },
    {
      title: "Stop using JWTs for sessions — Hussein Nasser",
      channel: "Hussein Nasser",
      url: "https://www.youtube.com/watch?v=GdI3pHd8yJU",
      topic: "Trade-offs de JWT vs sessions e quando não usar JWT",
    },
  ],
  resources: [
    { title: "jwt.io — debugger e docs oficiais", url: "https://jwt.io/", kind: "docs" },
    { title: "RFC 7519 — JSON Web Token", url: "https://tools.ietf.org/html/rfc7519", kind: "docs" },
    { title: "Auth0 — JWT Security Best Practices", url: "https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-token-best-practices", kind: "artigo" },
    { title: "PortSwigger — JWT Attacks (Web Security Academy)", url: "https://portswigger.net/web-security/jwt", kind: "artigo" },
    { title: "jose — biblioteca JWT para Edge Runtime", url: "https://github.com/panva/jose", kind: "docs" },
    { title: "OWASP — Session Management Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html", kind: "docs" },
    { title: "Hasura — JWT Security Vulnerabilities Guide", url: "https://hasura.io/blog/best-practices-of-using-jwt-with-graphql/", kind: "artigo" },
  ],
}

export default jwt
