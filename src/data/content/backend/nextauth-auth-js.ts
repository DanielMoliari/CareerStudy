import type { SkillContent } from '@/types'

const nextauthAuthJs: SkillContent = {
  tagline: "Biblioteca de autenticação plug-and-play para Next.js com suporte a OAuth, email e credenciais.",
  why: "NextAuth (renomeado Auth.js) é o padrão de facto para autenticação em apps Next.js. Saber configurar providers, callbacks e adapters é esperado em vagas com Next.js no stack.",
  summary: "Auth.js (anteriormente NextAuth.js) é uma biblioteca de autenticação para frameworks JavaScript (Next.js, SvelteKit, Astro). Oferece integração simples com provedores OAuth (Google, GitHub, etc.), autenticação por email (magic link), e credenciais customizadas. Usa sessions (JWT ou database) com adapters para banco de dados (Prisma, Drizzle, etc.).",
  keypoints: [
    { title: "Providers", body: "OAuth providers prontos: Google, GitHub, Discord, etc. CredentialsProvider para login email/senha customizado. EmailProvider para magic link." },
    { title: "Session strategy", body: "jwt (default): session armazenada no token httpOnly — sem banco necessário. database: session armazenada no banco via adapter — mais segura, revogação imediata." },
    { title: "Callbacks", body: "jwt(): customizar o token JWT (adicionar claims). session(): customizar o objeto session (expor dados ao client). signIn(): controlar se login é permitido." },
    { title: "Adapters", body: "PrismaAdapter, DrizzleAdapter, etc. Persiste users, accounts, sessions e verification tokens no banco. Necessário para strategy database e para persistir perfis OAuth." },
    { title: "Proteção de rotas", body: "getServerSession() em Server Components/API routes. middleware.ts com auth() para proteger grupos de rotas no App Router." },
  ],
  gotchas: [
    "NEXTAUTH_SECRET fraco ou ausente em produção — sessões comprometidas.",
    "CredentialsProvider sem strategy database — logout não revoga sessão (JWT fica válido até expirar).",
    "Callbacks jwt e session desalinhados — dados adicionados em jwt não aparecem em session sem repassar.",
    "Adapter sem migrations rodando — tabelas de auth não criadas, erros em runtime.",
  ],
  interview: [
    { q: "Quando usar strategy jwt vs database no NextAuth?", a: "<p>jwt: simples, sem banco necessário para sessões, bom para apps pequenos e protótipos. Contras: logout não revoga sessão até o token expirar.</p><p>database: revogação imediata de sessão (logout real), audit log de sessões ativas, necessário quando segurança é prioridade. Requer adapter e banco de dados configurado.</p>" },
  ],
  resources: [
    { title: "Auth.js docs", url: "https://authjs.dev/", kind: "docs" },
    { title: "NextAuth.js docs (v4)", url: "https://next-auth.js.org/", kind: "docs" },
  ],
}

export default nextauthAuthJs
