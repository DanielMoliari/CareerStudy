import type { SkillContent } from '@/types'

const oauth20: SkillContent = {
  tagline: "Protocolo de autorização delegada — permite que apps acessem recursos em nome do usuário.",
  why: "OAuth 2.0 é a base de 'Login com Google/GitHub' e APIs de terceiros. Saber os fluxos (flows), tokens e as armadilhas de segurança é esperado em qualquer vaga com auth.",
  summary: "OAuth 2.0 é um framework de autorização (não autenticação) que permite que uma aplicação acesse recursos de outra em nome de um usuário, sem compartilhar a senha. Define roles (Resource Owner, Client, Authorization Server, Resource Server) e flows: Authorization Code (web/mobile), Client Credentials (server-to-server), Device Flow. OpenID Connect (OIDC) é uma camada de identidade sobre OAuth 2.0.",
  keypoints: [
    { title: "Roles", body: "Resource Owner: usuário. Client: aplicação que pede acesso. Authorization Server: emite tokens (Google, GitHub, Auth0). Resource Server: API que protege recursos." },
    { title: "Authorization Code Flow", body: "1. Client redireciona usuário para AS com client_id, redirect_uri, scope, state. 2. Usuário autentica e autoriza. 3. AS redireciona com code. 4. Client troca code por access_token (server-side, seguro). 5. Client usa access_token para acessar Resource Server." },
    { title: "PKCE", body: "Proof Key for Code Exchange: extensão do Authorization Code Flow para clientes públicos (mobile, SPA). code_verifier gerado pelo client, code_challenge (hash) enviado no início. Evita interception attack mesmo sem client_secret." },
    { title: "Client Credentials Flow", body: "Server-to-server: client envia client_id + client_secret, recebe access_token. Sem usuário envolvido. Ideal para microserviços e integrações M2M." },
    { title: "Scopes", body: "Permissões granulares que o client solicita: read:users, write:orders. Usuário aprova na tela de consentimento. Resource Server valida se token tem o scope necessário." },
    { title: "OpenID Connect", body: "OIDC adiciona autenticação sobre OAuth 2.0. Retorna ID Token (JWT com identidade do usuário) além do access_token. UserInfo endpoint para dados do perfil. Base do 'Login com Google'." },
  ],
  gotchas: [
    "Usar Implicit Flow em 2025 — obsoleto e inseguro. Use Authorization Code + PKCE.",
    "Não validar state — vulnerável a CSRF no fluxo OAuth.",
    "Client secret em código front-end — exposto. Use PKCE para clientes públicos.",
    "Confundir OAuth (autorização) com autenticação — OAuth não prova identidade. Use OIDC para identidade.",
    "Token sem escopo mínimo (least privilege) — client pede mais permissão do que precisa.",
  ],
  interview: [
    { q: "Qual a diferença entre OAuth 2.0 e OpenID Connect?", a: "<p>OAuth 2.0 é sobre autorização: permite que um client acesse recursos em nome de um usuário. O access_token é opaco — diz 'você pode fazer X', mas não 'quem é você'.</p><p>OpenID Connect (OIDC) é uma camada de identidade sobre OAuth 2.0. Adiciona o ID Token (JWT com claims de identidade: sub, email, name) e o UserInfo endpoint. OIDC responde 'quem é o usuário'. OAuth responde 'o que ele pode fazer'.</p>", level: "senior" },
    { q: "Por que usar PKCE mesmo em apps server-side?", a: "<p>PKCE foi criado para clientes públicos (mobile, SPA) que não podem guardar client_secret com segurança. Mas em 2023, as melhores práticas (OAuth 2.1 draft) recomendam PKCE para todos os flows, incluindo server-side.</p><p>Razão: PKCE protege contra authorization code interception mesmo que alguém intercepte o code de redirecionamento — sem o code_verifier original, o code é inútil.</p>", level: "senior" },
  ],
  resources: [
    { title: "OAuth 2.0 — RFC 6749", url: "https://datatracker.ietf.org/doc/html/rfc6749", kind: "docs" },
    { title: "Auth0 — OAuth 2.0 Flows", url: "https://auth0.com/docs/get-started/authentication-and-authorization-flow", kind: "artigo" },
    { title: "OAuth 2.1 Draft", url: "https://oauth.net/2.1/", kind: "docs" },
  ],
}

export default oauth20
