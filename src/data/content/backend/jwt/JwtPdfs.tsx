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
import { buildComparativeRefPdf } from '@/components/pdfs/ComparativeRefPdf'
import type { CompOption, CompCriterion, CompScenario } from '@/components/pdfs/ComparativeRefPdf'

// ── Paleta JWT ────────────────────────────────────────────────────────────────
const C = '#f59e0b'

// ── Cards de PDF ──────────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review — JWT',
    subtitle: 'As 22 perguntas mais cobradas em entrevista sobre autenticação com JWT',
    type: 'qa',
    pages: 11,
    description: 'Recuperação ativa nível pleno e sênior: estrutura JWT, algoritmos HS256/RS256/ES256, refresh token rotation, revogação com JTI blocklist, ataques (alg:none, kid injection, secret fraco), JWKS, OAuth 2.0, JWE vs JWS, clock skew, httpOnly cookie vs localStorage, Next.js middleware com jose.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet — JWT Security',
    subtitle: 'Claims obrigatórios, ataques, bibliotecas, TTLs e padrões de implementação',
    type: 'cheatsheet',
    pages: 2,
    description: 'Referência densa: claims padrão (iss, sub, aud, exp, iat, nbf, jti), validações obrigatórias, ataques e prevenções (alg:none, kid injection, RS256→HS256 downgrade), TTLs recomendados, bibliotecas (jsonwebtoken vs jose vs fast-jwt), padrões de código (verify com algorithms fixo, httpOnly cookie, JWKS lookup).',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos — JWT',
    subtitle: 'Âncoras verbais para estrutura, claims, ataques e algoritmos',
    type: 'mnemonics',
    pages: 4,
    description: 'Truques verbais: HPS (Header.Payload.Signature), IS AE IN para claims padrão, A-B-C para revogação, HS/RS distinção simétrico/assimétrico. Cartões de memorização para recall imediato em entrevista.',
    icon: '03',
    goal: 'Memorização ativa',
  },
  {
    id: 'comparative',
    title: 'Comparativo — HS256 vs RS256 vs ES256',
    subtitle: 'Algoritmos de assinatura JWT em 7 critérios com cenários de decisão',
    type: 'comparative',
    pages: 3,
    description: 'Tabela comparativa: tipo de chave, distribuição para microserviços, suporte JWKS, performance, tamanho de chave, rotação, caso de uso. Cenários: monolito, microserviços, OAuth provider, Edge Runtime, mobile SDK.',
    icon: '04',
    goal: 'Decisão de arquitetura',
  },
]

// ── Q&As ──────────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'Explique a estrutura de um JWT e por que o payload não é seguro para dados sensíveis.',
    a: 'JWT tem <strong>3 partes separadas por ponto</strong>: <code>header.payload.signature</code>.<br><br><strong>Header:</strong> JSON com alg (algoritmo) e typ ("JWT"), codificado em Base64url.<br><strong>Payload:</strong> JSON com claims (sub, exp, roles, etc.), codificado em Base64url — <strong>não cifrado</strong>.<br><strong>Signature:</strong> HMAC ou RSA/EC da concatenação header+payload com o secret/chave privada.<br><br><strong>Por que não é seguro:</strong> Base64url é apenas codificação, não criptografia. Qualquer pessoa com o token pode decodificar e ler o payload com <code>atob()</code>. Para dados sensíveis, use JWE (JSON Web Encryption).',
    tip: 'Demonstre ao vivo: cole qualquer JWT em jwt.io e mostre que o payload aparece em claro.',
  },
  {
    level: 'Pleno',
    q: 'Quais claims devo obrigatoriamente validar ao verificar um JWT?',
    a: '<strong>Validações obrigatórias (em todo request):</strong><br>• <strong>Assinatura</strong> — integridade e autenticidade<br>• <strong>exp</strong> — token não expirado<br>• <strong>iss</strong> — emitido pelo auth server correto (evita tokens de outro ambiente)<br>• <strong>aud</strong> — destinado a este serviço (evita token do app mobile aceito pela API admin)<br>• <strong>alg</strong> — fixado no código, nunca lido do header<br><br><strong>Opcionais recomendados:</strong><br>• <strong>nbf</strong> — se usado, verificar<br>• <strong>jti</strong> — checar na blocklist se revogação está implementada',
    tip: 'aud é a validação mais esquecida — sem ela, um token de outro serviço pode ser aceito.',
  },
  {
    level: 'Pleno',
    q: 'JWT vs Session — quando usar cada um?',
    a: '<strong>JWT:</strong> APIs stateless, microserviços, mobile (sem cookie nativo), múltiplos domínios, Edge Runtime. Sem necessidade de estado no servidor.<br><br><strong>Session:</strong> apps web tradicionais, quando revogação imediata é necessária (logout instantâneo), quando payload é grande (não quer carregar no token).<br><br><strong>Na prática:</strong> APIs modernas combinam — JWT access token (15min, stateless) + refresh token em httpOnly cookie (7-30d, revogável). Melhor dos dois mundos.',
    tip: 'O trade-off central é revogação: JWT não pode ser revogado sem estado server-side. Mencione isso.',
  },
  {
    level: 'Pleno',
    q: 'O que é o Bearer token scheme?',
    a: 'Bearer token é o scheme HTTP mais comum com JWT: <code>Authorization: Bearer eyJhbGci...</code><br><br><strong>Semântica:</strong> "Bearer" (portador) significa que quem possui o token tem acesso — sem prova adicional de identidade. Portanto, proteção do token é crítica.<br><br><strong>Fluxo:</strong> client inclui header em todo request; server extrai com <code>req.headers.authorization?.split(" ")[1]</code> e valida.<br><br><strong>Padrão:</strong> RFC 6750. Ao contrário de cookies, o client JS precisa gerenciar e enviar o header manualmente.',
    tip: 'Citar RFC 6750 mostra que você conhece os padrões formais.',
  },
  {
    level: 'Pleno',
    q: 'httpOnly cookie vs localStorage — qual recomenda para JWT?',
    a: '<strong>localStorage:</strong> vulnerável a XSS — qualquer script injetado lê o token com <code>localStorage.getItem("jwt")</code>.<br><br><strong>httpOnly cookie:</strong> imune a XSS (JS não acessa). Requer proteção CSRF: <code>SameSite=Lax</code> bloqueia a maioria dos ataques. Para mutação cross-origin, adicionar CSRF token.<br><br><strong>Recomendação:</strong> httpOnly cookie + SameSite=Lax para web apps. Para APIs públicas consumidas por mobile/third-party: Authorization Bearer header — o cliente é responsável pelo armazenamento seguro (Keychain no iOS, Keystore no Android).',
    tip: 'SameSite=Lax protege CSRF em browsers modernos mas ainda permite GET cross-site. Para APIs que não aceitam GET com side effects, é suficiente.',
  },
  {
    level: 'Pleno',
    q: 'O que são nbf e jti e quando usar cada um?',
    a: '<strong>nbf (not before):</strong> token não é válido antes do timestamp. Útil para tokens agendados (acesso liberado em horário futuro) ou para absorver clock skew entre servidores.<br><br><strong>jti (JWT ID):</strong> identificador único do token. Usado para:<br>• Implementar blocklist de tokens revogados (armazenar jti no Redis no logout, TTL = tempo restante)<br>• Prevenir replay attacks (servidor verifica se jti já foi visto)<br><br>jti é a chave para implementar revogação sem jogar fora o modelo stateless completamente.',
    tip: 'jti + Redis com TTL exato = revogação com custo O(1) por request. Esse é o padrão de produção.',
  },
  {
    level: 'Pleno',
    q: 'Explique autenticação vs autorização no contexto de JWT.',
    a: '<strong>Autenticação (AuthN):</strong> quem você é. JWT prova a identidade via assinatura verificável — o server confia que o sub do token identifica o usuário correto.<br><br><strong>Autorização (AuthZ):</strong> o que você pode fazer. Claims como <code>roles</code>, <code>scope</code>, <code>permissions</code> definem o que o usuário está autorizado a fazer.<br><br><strong>OAuth 2.0</strong> é um framework de autorização, não autenticação. <strong>OIDC</strong> adiciona autenticação sobre OAuth via ID Token (JWT com claims de identidade).<br><br>O JWT autentica (prova identidade) e autoriza (carrega permissões) numa única estrutura.',
    tip: 'Diferençar OAuth (authZ) de OIDC (authN) é clássico em entrevista — muitos confundem.',
  },
  {
    level: 'Senior',
    q: 'O que é o alg:none attack e como prevenir?',
    a: 'Implementações antigas aceitam <code>"alg": "none"</code> no header JWT. Um atacante pega token legítimo, modifica o payload, coloca <code>alg: "none"</code>, remove a assinatura — e o server aceita como válido.<br><br><strong>Variante:</strong> RS256→HS256 downgrade. Se o server aceita qualquer algoritmo, atacante muda RS256 para HS256 e usa a chave pública RSA como secret HMAC (chave pública é pública!) → token forjado aceito.<br><br><strong>Prevenção:</strong><br><code>jwt.verify(token, secret, { algorithms: ["HS256"] })</code><br>Fixar algoritmo no código, nunca ler do header. Bibliotecas modernas rejeitam alg:none por default.',
    tip: 'A variante RS256→HS256 é particularmente insidiosa porque a chave pública é mesmo pública. Mencionar isso diferencia.',
  },
  {
    level: 'Senior',
    q: 'Como implementar logout seguro com JWT?',
    a: 'JWT é stateless — não há como invalidar antes de expirar sem estado server-side.<br><br><strong>Solução 1 (recomendada):</strong> access token curto (5-15min) + refresh token revogável. No logout, revoga o refresh token. O access expira sozinho em breve.<br><br><strong>Solução 2 (revogação imediata):</strong> JTI blocklist no Redis.<br>1. Adicionar jti do access token na blocklist: <code>SET blocklist:{jti} 1 EX {ttl_restante}</code><br>2. Em todo request, verificar: <code>EXISTS blocklist:{jti}</code><br>3. Revogar também o refresh token<br><br>Trade-off: blocklist reintroduz estado — mas O(1) lookup e TTL automático minimiza o custo.',
    tip: 'A blocklist com TTL exato (exp - now()) é eficiente: limpa-se sozinha sem cron.',
  },
  {
    level: 'Senior',
    q: 'Qual a diferença entre HS256, RS256 e ES256? Quando usar cada um?',
    a: '<strong>HS256 (HMAC):</strong> 1 secret compartilhado. Simples, rápido. Problema: todos que verificam também podem assinar → maior surface de ataque em microserviços.<br><br><strong>RS256 (RSA):</strong> chave privada assina (só o auth server tem), chave pública verifica (distribuível). Padrão OAuth 2.0/OIDC. Suporta JWKS para rotação de chaves.<br><br><strong>ES256 (ECDSA P-256):</strong> mesmo modelo do RS256 mas com curvas elípticas — chaves menores (~64 bytes vs ~256 bytes RSA), mais rápido, mesma segurança. Preferido para novos projetos.<br><br><strong>Regra prática:</strong> HS256 para monolito controlado. RS256/ES256 para microserviços, OAuth providers, JWKS público.',
    tip: 'Citar o paper de curvas elípticas vs RSA com números concretos (64 vs 256 bytes de signature) impressiona.',
  },
  {
    level: 'Senior',
    q: 'O que é JWKS e como funciona rotação de chaves sem downtime?',
    a: '<strong>JWKS (JSON Web Key Set):</strong> endpoint público com chaves públicas do auth server em formato padronizado: <code>https://auth.example.com/.well-known/jwks.json</code><br><br><strong>Rotação sem downtime:</strong><br>1. Gerar novo par RS256/ES256, adicionar ao JWKS com <strong>novo kid</strong><br>2. Novos tokens assinados com nova chave (novo kid no header)<br>3. Tokens antigos (kid antigo) continuam sendo verificados com chave antiga — ainda no JWKS<br>4. Após 1 vida de access token (15-60min), remover chave antiga do JWKS<br><br>Resource servers cacheia JWKS. Ao encontrar kid desconhecido, refaz fetch — rotação transparente.',
    tip: 'Com HS256, rotação exige coordenação manual com todos os serviços. RS256/ES256 + JWKS elimina esse problema — argumento arquitetural forte.',
  },
  {
    level: 'Senior',
    q: 'Explique o refresh token rotation com detecção de replay attack.',
    a: 'Refresh token rotation: cada uso emite novo par, invalida o antigo. Adicionar <strong>família de tokens</strong> detecta roubo:<br><br>1. Emitir refresh token: armazenar no Redis com <code>{ userId, familyId }</code><br>2. Ao usar: deletar token antigo, emitir novo com mesmo familyId<br>3. Ao detectar uso de token já deletado (null no Redis): <strong>revogar TODOS os tokens da família</strong> → força novo login<br><br><strong>Por que funciona:</strong> se atacante roubar o refresh e usá-lo primeiro, o usuário legítimo tenta usar o antigo → sistema percebe replay → família revogada → atacante também perde acesso.<br><br>Auth0, Okta e Supabase implementam isso nativamente.',
    tip: 'O insight é que o sistema detecta replay MESMO quando o atacante age antes do usuário legítimo.',
  },
  {
    level: 'Senior',
    q: 'Como funciona o kid injection attack?',
    a: 'Quando o server usa o campo <code>kid</code> do header JWT para buscar a chave de verificação sem validar o kid:<br><br><strong>Cenário SQL injection:</strong> servidor faz <code>SELECT key FROM keys WHERE id = kid</code> → atacante injects SQL via kid → retorna chave controlada → forja token.<br><br><strong>Cenário path traversal:</strong> servidor lê chave de arquivo via <code>fs.readFile(kid)</code> → atacante aponta para arquivo previsível (/dev/null, /proc/sys/kernel/hostname) → comportamento inesperado.<br><br><strong>Prevenção:</strong><br>• Validar kid contra whitelist de kids conhecidos<br>• Nunca usar kid diretamente em queries ou paths sem sanitização<br>• Usar JWKS ao invés de lookup customizado',
    tip: 'kid injection é menos conhecida que alg:none mas igualmente crítica — demonstra que você lê CVEs.',
  },
  {
    level: 'Senior',
    q: 'Como tratar clock skew entre servidores ao validar JWT?',
    a: 'Servidores em cluster (especialmente Lambda/serverless) podem ter relógios com diferença de segundos. O claim <code>exp</code> pode rejeitar tokens válidos se o servidor receptor está atrasado.<br><br><strong>Soluções:</strong><br>• NTP sync — todos os servidores sincronizados (obrigatório, mas insuficiente por si só)<br>• <code>clockTolerance</code> na verificação: <code>jwtVerify(token, key, { clockTolerance: 30 })</code><br>• Margem de 30-60s é comum em produção serverless<br><br><strong>Atenção:</strong> tolerância excessiva (horas) abre janela para replay de tokens expirados. 30-60s é o equilíbrio correto.<br><br><code>nbf</code> sofre o problema inversamente — token pode ser "do futuro" para servidor adiantado.',
    tip: 'Lambda pode ter clock drift de vários segundos entre instâncias — clockTolerance de 30s é comum em produção real.',
  },
  {
    level: 'Senior',
    q: 'Como o JWT se encaixa em arquitetura de microserviços?',
    a: '<strong>Padrão:</strong> Auth Service central emite JWTs com RS256. Cada microserviço verifica independentemente usando chave pública (via JWKS).<br><br><strong>Benefícios:</strong><br>• Verificação sem chamada ao Auth Service em todo request (stateless)<br>• Claims úteis propagados no token (userId, roles, tenantId)<br><br><strong>Desafios:</strong><br>• Revogação: token comprometido válido até exp — mitigar com vida curta + JTI blocklist<br>• Stale claims: roles mudaram mas token antigo carrega os antigos<br>• Token propagation: não propagar tokens externos entre serviços internos — usar tokens de serviço com escopo mínimo<br><br>Serviço A recebeu token do cliente → ao chamar Serviço B, re-emite token interno com escopo de A→B.',
    tip: 'Token propagation (passar o token do usuário entre microserviços) é prática arriscada — re-emissão com escopo mínimo é o padrão correto.',
  },
  {
    level: 'Senior',
    q: 'Quais bibliotecas usar para JWT em Node.js e qual usar no Edge Runtime?',
    a: '<strong>jsonwebtoken:</strong> mais popular, madura, usa Node.js crypto. NÃO roda no Edge Runtime (Cloudflare Workers, Next.js middleware, Vercel Edge). API síncrona.<br><br><strong>jose:</strong> pure JavaScript, roda em qualquer runtime (Edge, Deno, browser, Node). Suporta JWS, JWE, JWKS. API Promise-based. Recomendada para projetos novos.<br><br><strong>fast-jwt:</strong> foco em performance. Compatível com Node. Mais rápido que jsonwebtoken em benchmarks.<br><br><strong>Regra:</strong> se o código roda no Edge Runtime (Next.js middleware, Cloudflare Workers, Deno Deploy), use <code>jose</code>. Para Node puro legado, <code>jsonwebtoken</code> funciona.',
    tip: 'A migração de jsonwebtoken para jose é necessária ao mover para Next.js App Router middleware — detalhe prático que diferencia.',
  },
  {
    level: 'Senior',
    q: 'Como implementar autenticação JWT no Next.js App Router?',
    a: '<strong>Abordagem recomendada:</strong> httpOnly cookie + middleware de verificação com jose.<br><br>1. <strong>Login:</strong> POST credentials → API Route valida → emite JWT em cookie httpOnly SameSite=Lax<br>2. <strong>Middleware</strong> (<code>middleware.ts</code>): intercepta rotas protegidas → <code>jwtVerify</code> com jose → redireciona se inválido → injeta userId em header<br>3. <strong>Server Components:</strong> leem cookie via <code>cookies()</code> do next/headers → decodificam payload para dados do usuário<br><br><strong>Por que jose e não jsonwebtoken:</strong> middleware roda no Edge Runtime — jsonwebtoken usa Node.js crypto que não existe lá.<br><br>Para refresh: App Route <code>/api/refresh</code> lê cookie, valida refresh token, emite novo par.',
    tip: 'jose é o único que roda em middleware Edge. Usar jsonwebtoken em middleware gera erro de runtime silencioso em alguns deploys.',
  },
  {
    level: 'Senior',
    q: 'O que é JWE e quando usar em vez de JWS?',
    a: '<strong>JWS (JSON Web Signature):</strong> token assinado. Payload visível (Base64url), apenas integridade garantida. É o "JWT comum".<br><br><strong>JWE (JSON Web Encryption):</strong> token cifrado. Payload está cifrado — nem quem intercepta consegue ler sem a chave. Garante confidencialidade.<br><br><strong>Estrutura JWE:</strong> 5 partes — header, encrypted key, IV, ciphertext, authentication tag.<br><br><strong>Quando usar JWE:</strong><br>• Payload com PII (CPF, endereço, dados financeiros)<br>• Claims internos que não devem vazar nem para o cliente<br>• Requisito de compliance (LGPD, PCI DSS sobre dados em trânsito)<br><br><strong>Trade-off:</strong> JWE tem maior custo computacional. Na maioria dos casos, JWS + HTTPS é suficiente.',
    tip: 'JWE tem custo 3-5× maior que JWS. Justifique apenas quando há requisito real de confidencialidade — não use por padrão.',
  },
  {
    level: 'Senior',
    q: 'Como estruturar claims customizados sem conflito com padrão?',
    a: 'Claims customizados devem usar namespacing para evitar colisão com claims RFC 7519:<br><br><strong>Opção 1 — URL namespace (Auth0 style):</strong><br><code>{ "https://myapp.com/roles": ["admin"], "https://myapp.com/tenant": "acme" }</code><br><br><strong>Opção 2 — prefixo simples (interno):</strong><br><code>{ "app_roles": ["admin"], "app_tenant": "acme" }</code><br><br><strong>Boas práticas:</strong><br>• Não incluir dados que mudam frequentemente (roles mutáveis → stale claims)<br>• Minimizar payload — JWT vai em todo request (HTTP header)<br>• Separar claims de identidade (sub, email) de autorização (roles, scopes)<br>• Documentar o contrato de claims e versionar se mudar',
    tip: 'Auth0 usa URL namespace por padrão. Estale claims (roles no token depois de remoção de permissão) são o gotcha mais comum em auth baseada em JWT.',
  },
  {
    level: 'Senior',
    q: 'Como detectar e mitigar JWT roubado?',
    a: '<strong>Detecção heurística:</strong><br>• Padrão geográfico inconsistente (IP diferente do padrão do usuário)<br>• User agent diferente do cadastrado<br>• Horário incomum de uso<br>• Refresh token rotation: reuso do antigo sinaliza possível roubo<br>• Fingerprinting: incluir device fingerprint como claim e verificar<br><br><strong>Mitigação:</strong><br>• Access token curto (15min) limita a janela de exploração<br>• Ao detectar: revogar toda a família de refresh tokens → força novo login<br>• Notificar usuário via email/push<br>• Bloquear IP temporariamente<br><br>Não há solução perfeita — defesa em camadas é o modelo correto.',
    tip: 'Refresh token family é o mecanismo mais robusto de detecção. Ao revogar a família, o atacante também perde acesso mesmo que tenha renovado.',
  },
  {
    level: 'Senior',
    q: 'Explique como implementar rotação de chaves em produção sem downtime.',
    a: 'O problema: trocar o secret HS256 invalida todos os tokens ativos. Com RS256/ES256 + JWKS, é possível rotar sem downtime:<br><br>1. <strong>Gerar nova chave:</strong> novo par ES256, novo kid (ex: "2024-12-01")<br>2. <strong>Publicar no JWKS:</strong> endpoint expõe nova chave + ainda mantém a antiga<br>3. <strong>Auth server emite novos tokens</strong> com a nova chave (novo kid no header)<br>4. <strong>Verificação:</strong> Resource servers buscam chave pelo kid do token — tokens antigos ainda validam com chave antiga<br>5. <strong>Após 1 vida de access token</strong> (ex: 15-60min): remover chave antiga do JWKS<br><br>Todo o processo é transparente — usuários não percebem.',
    tip: 'Esse é o argumento definitivo para RS256/ES256 sobre HS256 em produção. Key rotation zero-downtime é impossível com secret compartilhado.',
  },
  {
    level: 'Senior',
    q: 'Quais são os gotchas mais comuns em implementações JWT em produção?',
    a: '<strong>1. Não validar aud:</strong> token emitido para app mobile aceito pela API admin.<br><strong>2. Não fixar algorithms[]:</strong> alg:none ou RS256→HS256 downgrade.<br><strong>3. exp muito longo:</strong> token de 24h roubado → acesso por 24h.<br><strong>4. Secret no código:</strong> git blame revela secret → forja qualquer token.<br><strong>5. Payload com PII:</strong> Base64url legível → LGPD problema.<br><strong>6. jsonwebtoken em Edge Runtime:</strong> erro silencioso em alguns deploys.<br><strong>7. Clock skew não tratado:</strong> Lambda com drift rejeitando tokens válidos.<br><strong>8. Sem rotação de chaves:</strong> secret comprometido permanece válido indefinidamente.<br><strong>9. kid injection:</strong> buscar chave via kid sem sanitizar → SQL injection / path traversal.<br><strong>10. JTI não é UUID:</strong> JTI previsível → replay possível.',
    tip: 'Lista dos 10 gotchas é ótima resposta para "quais cuidados você teria ao implementar JWT?". Mostra experiência real.',
  },
]

// ── Mnemonics ─────────────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'HPS — Header.Payload.Signature',
    trick: 'Hoje Pago Seguro — as 3 partes do JWT',
    expansion: [
      ['H', 'Header — algoritmo e tipo (alg: "HS256", typ: "JWT")'],
      ['P', 'Payload — claims/dados em Base64url (NÃO cifrado)'],
      ['S', 'Signature — prova de integridade e autenticidade'],
      ['Base64url', 'Codificação ≠ criptografia — payload legível por qualquer um'],
    ],
    explanation: 'As três partes do JWT separadas por ponto. Header e Payload são apenas codificados em Base64url — não cifrados. A Signature garante que não foram alterados, mas não os esconde. Lembre: "Hoje Pago Seguro" = H.P.S.',
    example: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c3IifQ.SflKx — decodifique na jwt.io e veja o payload em claro.',
    why: 'O erro mais comum de iniciantes é achar que JWT "criptografa" os dados. HPS ancora a estrutura e o fato de que Payload é Base64url legível.',
  },
  {
    label: 'IS AE IN — Claims padrão RFC 7519',
    trick: '"I See A Expired Issue Now, Just Take It"',
    expansion: [
      ['ISS', 'Issuer — quem emitiu o token (auth.myapp.com)'],
      ['SUB', 'Subject — identificador do usuário (user ID)'],
      ['AUD', 'Audience — para quem é destinado (api.myapp.com)'],
      ['EXP', 'Expiration — timestamp de expiração (Unix)'],
      ['IAT', 'Issued At — timestamp de emissão'],
      ['NBF', 'Not Before — não válido antes de (timestamp)'],
      ['JTI', 'JWT ID — identificador único (para blocklist)'],
    ],
    explanation: 'Sete claims padrão definidos na RFC 7519. Mnemônico: cada palavra inicial de "I See A Expired Issue Now, Just Take It" mapeia para uma claim (I=iss, S=sub, A=aud, E=exp, I=iat, N=nbf, J=jti). iss + aud são as mais esquecidas — sem elas, token de outro serviço pode ser aceito.',
    example: 'Validar sem aud: token do app mobile (aud="mobile") aceito pela API admin (aud="api") — falha de autorização grave.',
    why: 'iss e aud são as validações mais esquecidas em implementações reais. A ordem ISS/SUB/AUD/EXP/IAT/NBF/JTI é memorável via mnemônico.',
  },
  {
    label: 'A-B-C — Revogação de JWT',
    trick: 'Access curto, Blocklist JTI, Cookie httpOnly',
    expansion: [
      ['A', 'Access token curto (15min) — limita janela de exploração'],
      ['B', 'Blocklist de JTI no Redis — revogação imediata'],
      ['C', 'Cookie httpOnly — imune a XSS'],
      ['Rotation', 'Refresh token rotation + família — detecta replay'],
    ],
    explanation: 'As três defesas complementares contra tokens roubados/comprometidos. A (access curto) limita o dano temporal. B (blocklist) permite revogação imediata quando necessário. C (cookie httpOnly) reduz o risco de roubo via XSS. Rotation adiciona detecção proativa.',
    example: 'Logout seguro: invalidar refresh token no banco (B) + marcar jti do access token na blocklist Redis com TTL = tempo restante.',
    why: 'A maioria das implementações implementa apenas "A" — short-lived tokens. Sem B e C, token roubado permanece válido por 15min sem nenhuma barreira.',
  },
  {
    label: 'HS/RS — Simétrico vs Assimétrico',
    trick: 'HS = H de Humilde (1 chave), RS = R de Repartir (2 chaves)',
    expansion: [
      ['HS256', 'HMAC-SHA256 — 1 secret compartilhado — simples mas todos podem assinar'],
      ['RS256', 'RSA — chave privada assina, chave pública verifica — distribuível'],
      ['ES256', 'ECDSA P-256 — mesmo modelo RS256 + chave menor + mais rápido'],
      ['JWKS', 'Chave pública publicável → rotação sem downtime → padrão OIDC'],
    ],
    explanation: 'HS256 é "humilde" — uma única chave serve para tudo, simples de configurar. RS256/ES256 "repartem" as chaves — privada fica com o auth server, pública é distribuída para quem precisa verificar. Em microserviços, repartir é seguro; compartilhar o secret é arriscado.',
    example: 'Auth service emite com RS256 (privada). 50 microserviços verificam com chave pública (seguro distribuir). Com HS256, os 50 teriam o secret — qualquer um comprometido pode forjar tokens.',
    why: 'A escolha HS256 vs RS256/ES256 é decisão arquitetural — afeta segurança, rotação de chaves e microserviços. Resposta correta para pleno/sênior é RS256/ES256.',
  },
]

// ── Comparative ───────────────────────────────────────────────────────────────

const COMP_OPTIONS: CompOption[] = [
  { name: 'HS256', color: '#f59e0b' },
  { name: 'RS256', color: '#38bdf8' },
  { name: 'ES256', color: '#4ade80' },
]

const COMP_CRITERIA: CompCriterion[] = [
  {
    criterion: 'Tipo de chave',
    category: 'Fundamentos',
    values: {
      HS256: '1 secret compartilhado (simétrico)',
      RS256: 'Par RSA: privada assina, pública verifica (assimétrico)',
      ES256: 'Par EC P-256: privada assina, pública verifica (assimétrico)',
    },
  },
  {
    criterion: 'Tamanho da chave/signature',
    category: 'Performance',
    values: {
      HS256: '256-bit secret; signature 32 bytes',
      RS256: '2048-bit+ RSA; signature 256 bytes',
      ES256: '256-bit EC; signature ~64 bytes',
    },
  },
  {
    criterion: 'Performance (sign + verify)',
    category: 'Performance',
    values: {
      HS256: 'Muito rápido — operação de hash simples',
      RS256: 'Lento — operações RSA com exponenciação modular',
      ES256: 'Rápido — ECDSA mais eficiente que RSA',
    },
  },
  {
    criterion: 'Distribuição em microserviços',
    category: 'Segurança',
    values: {
      HS256: 'Todos os serviços precisam do secret → maior surface de ataque',
      RS256: 'Serviços recebem só chave pública (seguro distribuir)',
      ES256: 'Mesmo que RS256 — chave pública pode ser publicada via JWKS',
    },
  },
  {
    criterion: 'Suporte a JWKS',
    category: 'Segurança',
    values: {
      HS256: 'Não suporta — secret nunca pode ser publicado',
      RS256: 'Sim — padrão OAuth 2.0 e OIDC',
      ES256: 'Sim — preferido em novos projetos',
    },
  },
  {
    criterion: 'Rotação de chaves zero-downtime',
    category: 'Operacional',
    values: {
      HS256: 'Impossível sem coordenação manual com todos os serviços',
      RS256: 'Sim — adicionar novo kid ao JWKS, tokens antigos ainda válidos',
      ES256: 'Sim — mesmo mecanismo do RS256',
    },
  },
  {
    criterion: 'Caso de uso ideal',
    category: 'Decisão',
    values: {
      HS256: 'Monolito ou microserviços totalmente controlados e internos',
      RS256: 'OAuth 2.0, OIDC, terceiros precisam verificar tokens',
      ES256: 'Novos projetos — melhor custo-benefício geral',
    },
  },
]

const COMP_SCENARIOS: CompScenario[] = [
  {
    scenario: 'Monolito Node.js com 1 serviço',
    recommendation: 'HS256',
    reason: 'Só um serviço = secret compartilhado não é problema. Simplicidade ganha.',
  },
  {
    scenario: 'Microserviços (10+ serviços)',
    recommendation: 'RS256 ou ES256',
    reason: 'Distribuir secret entre 10 serviços é arriscado. Chave pública é segura de distribuir.',
  },
  {
    scenario: 'OAuth 2.0 / OIDC Provider',
    recommendation: 'RS256 ou ES256',
    reason: 'JWKS é padrão do protocolo. Terceiros precisam verificar tokens publicamente.',
  },
  {
    scenario: 'Next.js com Edge Runtime (middleware)',
    recommendation: 'ES256 com jose',
    reason: 'Edge Runtime não suporta Node.js crypto. jose com ES256 é a combinação correta.',
  },
  {
    scenario: 'API consumida por mobile SDK de terceiros',
    recommendation: 'RS256 ou ES256',
    reason: 'SDK de terceiros verifica tokens com chave pública — sem acesso ao secret.',
  },
  {
    scenario: 'Sistema com requisito de FIPS 140-2',
    recommendation: 'RS256',
    reason: 'RSA é amplamente suportado em implementações FIPS certificadas.',
  },
]

// ── Builders ──────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'JWT',
    stackLabel: 'Autenticação & Segurança',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'JWT',
    accentColor: C,
    stackLabel: 'Autenticação & Segurança',
    sections: {
      hooks: [
        { name: 'jwt.sign()', sig: 'payload, secret, { algorithm, expiresIn, issuer, audience }', desc: 'Assina e emite token. Sempre definir expiresIn. Nunca colocar dados sensíveis no payload.' },
        { name: 'jwt.verify()', sig: 'token, secret, { algorithms, issuer, audience, clockTolerance }', desc: 'Verifica assinatura + valida claims. SEMPRE fixar algorithms[] — nunca ler do header.' },
        { name: 'jwtVerify() (jose)', sig: 'token, key, { algorithms, issuer, audience }', desc: 'Versão Edge Runtime compatible. Usar em Next.js middleware e Cloudflare Workers.' },
        { name: 'createRemoteJWKSet()', sig: 'new URL("https://auth.example.com/.well-known/jwks.json")', desc: 'Busca e cacheia chaves públicas automaticamente. Refaz fetch ao encontrar kid desconhecido.' },
        { name: 'JTI Blocklist', sig: 'SET blocklist:{jti} 1 EX {ttl_restante}', desc: 'Revogação instantânea: TTL = Math.ceil(payload.exp - Date.now() / 1000). Verificar no middleware.' },
        { name: 'Refresh Rotation', sig: 'DEL refresh:{old} → SET refresh:{new} { userId, familyId }', desc: 'Cada uso invalida o antigo. Reuso de token antigo (null no Redis) revoga toda a família.' },
        { name: 'httpOnly Cookie', sig: 'res.cookie("token", jwt, { httpOnly, sameSite: "lax", secure })', desc: 'Imune a XSS. SameSite=Lax protege CSRF em browsers modernos.' },
        { name: 'JWKS Rotation', sig: 'kid novo no JWKS → tokens novos assinam com nova chave → remover antiga após 1 TTL', desc: 'Zero-downtime key rotation com RS256/ES256. Tokens antigos (kid antigo) ainda válidos.' },
      ] as HookItem[],
      depRows: [
        ['Claims obrigatórios validar', 'assinatura, exp, iss, aud, alg (fixo no código)'],
        ['TTL access token', '5-15 minutos (típico: 15min)'],
        ['TTL refresh token', '7-30 dias (httpOnly cookie)'],
        ['TTL ID token (OIDC)', '1 hora'],
        ['Clock skew tolerance', '30-60 segundos (Lambda/serverless)'],
        ['Vnodes HS256', '256-bit secret (32 bytes aleatórios) — mínimo'],
        ['Secret seguro', 'crypto.randomBytes(64).toString("hex") — 128 chars hex'],
        ['Lib Edge Runtime', 'jose — única compatível com Edge/Deno/Workers'],
        ['Lib Node.js legado', 'jsonwebtoken — madura, síncrona'],
        ['Algoritmo recomendado', 'ES256 (novos projetos), RS256 (OAuth/OIDC), HS256 (monolito simples)'],
      ],
      rules: [
        { ok: true, t: 'Fixar algorithms[] no verify — nunca ler do header JWT' },
        { ok: true, t: 'Validar iss e aud além de exp' },
        { ok: true, t: 'httpOnly cookie + SameSite=Lax para access token no browser' },
        { ok: true, t: 'Access token: 15min. Refresh token: 7-30d' },
        { ok: true, t: 'Usar jose para Edge Runtime (Next.js middleware)' },
        { ok: true, t: 'RS256/ES256 + JWKS para microserviços e OAuth' },
        { ok: true, t: 'jti UUID + Redis blocklist para revogação imediata' },
        { ok: true, t: 'Refresh token rotation com família de tokens' },
        { ok: true, t: 'Secret via env var — nunca hardcoded' },
        { ok: false, t: 'Ler algoritmo do header JWT (alg:none attack)' },
        { ok: false, t: 'Armazenar JWT em localStorage (XSS risk)' },
        { ok: false, t: 'Dados sensíveis (senha, CPF, cartão) no payload' },
        { ok: false, t: 'exp muito longo (dias) em access token' },
        { ok: false, t: 'Secret fraco ou hardcoded no código' },
        { ok: false, t: 'Não validar aud — token de outro serviço aceito' },
        { ok: false, t: 'jsonwebtoken em Next.js middleware (não roda em Edge)' },
        { ok: false, t: 'kid diretamente em query SQL sem sanitização (kid injection)' },
      ] as RuleItem[],
      performanceTips: [
        'Cache do JWKS localmente — refetch só ao encontrar kid desconhecido',
        'JTI blocklist: SET com EX = ttl restante → sem cron de limpeza',
        'ES256 é 3-5× mais rápido que RS256 para sign/verify',
        'HS256 é mais rápido ainda — use quando não precisar de JWKS',
        'jwtVerify (jose) é Promise-based — não bloqueia event loop',
        'Middleware Edge: verificar token apenas nas rotas protegidas (matcher)',
        'Cookie httpOnly não precisa de JS para enviar — browser faz automaticamente',
      ],
      patterns: [
        { name: 'Verify seguro (Node.js)', code: "jwt.verify(token, secret, { algorithms: ['HS256'], issuer: 'auth', audience: 'api' })", desc: 'Fixa algoritmo, valida iss e aud. Lança erro em qualquer falha.' },
        { name: 'Middleware Next.js (jose)', code: "const { payload } = await jwtVerify(token, secret, { algorithms: ['HS256'], issuer: 'auth' })", desc: 'Edge Runtime compatible. Usar em middleware.ts para proteger rotas.' },
        { name: 'JTI blocklist no logout', code: 'await redis.setEx(`blocklist:${jti}`, Math.ceil(exp - Date.now()/1000), "1")', desc: 'TTL exato = tempo restante do token. Redis limpa automaticamente.' },
        { name: 'JWKS lookup', code: 'const JWKS = createRemoteJWKSet(new URL("https://auth.example.com/.well-known/jwks.json"))', desc: 'Cache automático de chaves públicas. Refetch em kid desconhecido.' },
        { name: 'httpOnly cookie', code: "res.cookie('access_token', token, { httpOnly: true, sameSite: 'lax', secure: true, maxAge: 900 })", desc: 'JS não acessa. SameSite=Lax protege CSRF. maxAge em segundos.' },
      ],
      mentalModels: [
        'JWT não é sessão — é prova de identidade portátil e verificável sem estado',
        'Payload Base64url = visível para qualquer pessoa com o token — nunca dado sensível',
        'alg:none e RS256→HS256 downgrade existem porque servers confiam no header — fixar o algoritmo',
        'Refresh token rotation: reuso do antigo sinaliza roubo → revogar família → detecta replay',
        'JWKS + RS256/ES256 = rotação de chaves zero-downtime — argumento definitivo vs HS256',
        'jose > jsonwebtoken para Edge Runtime — não é preferência, é requisito técnico',
        'Clock skew tolerance de 30-60s é necessário em serverless — relógios não sincronizam perfeitamente',
      ],
    },
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'JWT',
    stackLabel: 'Autenticação & Segurança',
    coverTitle: 'JWT — Mnemônicos de Autenticação',
  }),
  comparative: () => buildComparativeRefPdf({
    options: COMP_OPTIONS,
    criteria: COMP_CRITERIA,
    scenarios: COMP_SCENARIOS,
    skillName: 'Algoritmos JWT',
    accentColor: C,
    stackLabel: 'Autenticação & Segurança',
    coverTitle: 'HS256 vs RS256 vs ES256 — Guia de Decisão',
  }),
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function JwtPdfs() {
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
