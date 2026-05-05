import type { SkillContent } from '@/types'

const jwt: SkillContent = {
  tagline: "JSON Web Token — token stateless para autenticação e autorização em APIs.",
  why: "JWT é o mecanismo de auth mais comum em APIs REST. Saber estrutura, assinatura, validação, refresh tokens e os gotchas de segurança é obrigatório para qualquer backend.",
  summary: "JWT (JSON Web Token) é um token compacto e autocontido que carrega claims (dados) assinados. Composto por três partes em Base64url separadas por ponto: header (algoritmo), payload (claims) e assinatura. Stateless: o servidor não precisa armazenar sessões — valida apenas a assinatura. Riscos: token roubado é válido até expirar, alg:none attack, fraqueza no secret.",
  keypoints: [
    { title: "Estrutura", body: "header.payload.signature. Header: {alg: 'HS256', typ: 'JWT'}. Payload: {sub, iat, exp, roles}. Signature: HMAC-SHA256(base64(header)+'.'+base64(payload), secret)." },
    { title: "Claims padrão", body: "iss (issuer), sub (subject), aud (audience), exp (expiration), iat (issued at), nbf (not before). Adicione claims customizados no payload conforme necessário." },
    { title: "Algoritmos", body: "HS256 (HMAC com secret compartilhado): simples, mesmo secret para assinar e verificar. RS256 (RSA): chave privada assina, chave pública verifica. RS256 ideal para microserviços (share só a pública)." },
    { title: "Refresh token pattern", body: "Access token: vida curta (15min). Refresh token: vida longa (7-30d), armazenado em httpOnly cookie, usado só para gerar novo access token. Balanceia segurança e UX." },
    { title: "Revogação", body: "JWT stateless não pode ser revogado antes de expirar sem estado server-side. Soluções: access token curto, blocklist de JTI (JWT ID) no Redis, ou Session tokens." },
    { title: "Onde armazenar no cliente", body: "localStorage: simples mas vulnerável a XSS. httpOnly cookie: imune a XSS, mas requer CSRF protection (SameSite=Strict ou double-submit cookie). httpOnly cookie é o padrão recomendado." },
  ],
  gotchas: [
    "alg:none attack — biblioteca que aceita 'none' como algoritmo valida token sem assinatura. Use bibliotecas que rejeitam alg:none por default.",
    "Secret fraco ou hardcoded — brute-force possível. Use secrets longos e aleatórios, rotativos.",
    "Payload com dados sensíveis — payload é Base64, não cifrado. Qualquer um pode decodificar. Não coloque senha, PII desnecessário.",
    "exp muito longo — token roubado fica válido por horas/dias. Access token deve ter vida curta.",
    "Não validar aud e iss — token de outro serviço aceito como válido.",
  ],
  interview: [
    { q: "JWT vs Session — quando usar cada?", a: "<p>JWT: APIs stateless, microserviços, mobile (sem cookie nativo), múltiplos domínios. Sem necessidade de estado no servidor.</p><p>Session: apps web tradicionais, quando revogação imediata é necessária (logout instantâneo), quando payload é grande (não quer carregar no token).</p><p>Na prática: APIs usam JWT com access token curto + refresh token em httpOnly cookie. Isso combina stateless com capacidade de revogação.</p>", level: "pleno" },
    { q: "Como implementaria logout seguro com JWT?", a: "<p>Problema: JWT é stateless — não há como 'invalidar' um token antes de expirar.</p><p>Solução 1: access token com vida muito curta (5-15min) + refresh token revogável. No logout, revoga o refresh token. O access token expira sozinho em breve.</p><p>Solução 2: blocklist de JTI (JWT ID) no Redis. No logout, adiciona o JTI na blocklist. Cada request verifica se JTI está na blocklist. Reintroduz estado, mas permite revogação instantânea.</p>", level: "senior" },
    { q: "O que é o alg:none attack?", a: "<p>Algumas implementações antigas de JWT aceitam 'none' como algoritmo de assinatura. Um atacante pode pegar um token legítimo, modificar o payload, mudar o alg para 'none' e remover a assinatura — e o servidor aceita como válido.</p><p>Prevenção: use bibliotecas modernas (jsonwebtoken no Node) que rejeitam alg:none por default. Sempre especifique os algoritmos aceitos explicitamente na verificação.</p>", level: "senior" },
    { q: "Qual a diferença entre HS256 e RS256?", a: "<p>HS256 (HMAC): mesmo secret para assinar e verificar. Simples. Problema: todos os serviços que precisam verificar o token precisam ter o secret — mais surface de ataque.</p><p>RS256 (RSA): chave privada assina (só o auth server tem), chave pública verifica (qualquer serviço pode ter). Ideal para microserviços — distribuí a pública, protegeu a privada. Padrão para OAuth 2.0 e OIDC.</p>", level: "senior" },
  ],
  resources: [
    { title: "jwt.io — debugger e docs", url: "https://jwt.io/", kind: "docs" },
    { title: "Auth0 — JWT Security", url: "https://auth0.com/docs/secure/tokens/json-web-tokens", kind: "artigo" },
  ],
}

export default jwt
