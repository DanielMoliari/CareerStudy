import type { SkillContent } from '@/types'

const trpc: SkillContent = {
    tagline: "RPC type-safe end-to-end entre servidor e cliente sem schema separado.",
    why: "tRPC elimina o contrato manual entre frontend e backend TypeScript. Leve, sem codegen, integra com React Query. Popular em stacks Next.js + TypeScript. Entender quando tRPC vs REST/GraphQL é ponto de entrevista.",
    summary: "tRPC permite criar APIs type-safe sem schema definition language. O servidor define procedures (queries e mutations) e o cliente as consome com tipos automaticamente inferidos. Usa React Query no cliente para caching. Ideal para monorepos TypeScript onde frontend e backend compartilham tipos.",
    keypoints: [
      { title: "Router e procedures", body: "Router agrupa procedures. Procedure pode ser query (leitura) ou mutation (escrita). Input validado com Zod. Output inferido automaticamente.", code: `// server: router com procedures
const appRouter = router({
  user: router({
    getById: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return db.user.findUnique({ where: { id: input.id } })
      }),
    create: protectedProcedure
      .input(z.object({ name: z.string() }))
      .mutation(async ({ input, ctx }) => {
        return db.user.create({ data: { ...input, userId: ctx.userId } })
      }),
  }),
})
export type AppRouter = typeof appRouter` },
      { title: "Type safety end-to-end", body: "Cliente importa apenas o tipo AppRouter do servidor. Mudança no procedure — campo adicionado, tipo alterado — é refletida no cliente em tempo de compilação sem codegen.", code: `// client: tipos inferidos automaticamente
const user = trpc.user.getById.useQuery({ id: '123' })
// user.data é tipado com o retorno exato do servidor` },
      { title: "Middleware e contexto", body: "t.procedure.use(middleware) adiciona lógica antes de procedures. O contexto (ctx) é construído uma vez por request e passado para todos os procedures — padrão para autenticação e injeção de dependências.", code: `const protectedProcedure = publicProcedure.use(({ ctx, next }) => {
  if (!ctx.session) throw new TRPCError({ code: 'UNAUTHORIZED' })
  return next({ ctx: { ...ctx, userId: ctx.session.userId } })
})` },
      { title: "React Query integration", body: "tRPC usa React Query embaixo. Você tem acesso a useQuery, useMutation, useInfiniteQuery com types completos do servidor. Invalida queries via utils.invalidate().", code: `const utils = trpc.useUtils()
const mutation = trpc.post.create.useMutation({
  onSuccess: () => utils.post.list.invalidate(),
})` },
      { title: "Quando NÃO usar tRPC", body: "tRPC requer TypeScript no servidor e no cliente compartilhando código. Não funciona para APIs públicas consumidas por clientes não-TypeScript (mobile nativo, terceiros), webhooks recebidos de serviços externos, ou quando o backend é de uma equipe diferente com outra linguagem." },
    ],
    interview: [
      {
        q: "Como tRPC garante type safety sem codegen?",
        a: "<p>tRPC usa o sistema de tipos TypeScript diretamente. O servidor define um AppRouter — um tipo que descreve todas as procedures, inputs e outputs. O cliente importa apenas esse tipo (não o código — só o tipo, que é apagado em runtime) e usa para inferir os tipos de todas as chamadas.</p><p>Sem codegen porque TypeScript já consegue atravessar os tipos importados e inferir o que a procedure retorna. Mudou o servidor? O erro aparece no cliente em compile-time.</p>",
        tip: "Explicar que é o sistema de tipos do TS fazendo o trabalho — não geração de código — é o que diferencia quem entende de quem só usa.",
        level: "senior",
      },
      {
        q: "Quando usar tRPC vs REST vs GraphQL?",
        a: "<p><strong>tRPC</strong>: stack TypeScript full-stack no mesmo repositório ou monorepo. Cliente e servidor controlados pela mesma equipe. Sem clientes externos. DX máxima, zero contrato explícito.</p><p><strong>REST</strong>: API pública ou consumida por múltiplos clientes (mobile, terceiros). Versionável, cacheable por HTTP, sem dependência de TypeScript no cliente.</p><p><strong>GraphQL</strong>: cliente precisa de flexibilidade para compor queries (BFF pattern, múltiplos clientes com necessidades diferentes). Overhead de schema definition e codegen se justifica pela flexibilidade.</p>",
        tip: "Saber quando não usar tRPC é tão importante quanto saber usá-lo. Citar a limitação de clientes externos mostra maturidade.",
        level: "senior",
      },
      {
        q: "Como você implementa autenticação em procedures tRPC?",
        a: "<p>Via middleware e contexto. O contexto é construído uma vez por request (ex: decodifica o JWT do cookie/header). Um protectedProcedure estende publicProcedure com um middleware que verifica ctx.session — lança UNAUTHORIZED se ausente. Todas as procedures que requerem auth estendem protectedProcedure.</p><p>O contexto tipado garante que dentro de um protectedProcedure, ctx.userId existe — TypeScript sabe disso.</p>",
        level: "pleno",
      },
      {
        q: "Como tRPC se integra com React Query?",
        a: "<p>tRPC usa React Query como engine de caching no cliente. Queries mapeiam para useQuery, mutations para useMutation, paginação para useInfiniteQuery — todos com tipos inferidos do servidor.</p><p>Para invalidação: trpc.useUtils() expõe os mesmos helpers do queryClient mas com tipos tRPC. utils.post.list.invalidate() invalida todas as queries de post.list sem passar query keys manualmente.</p>",
        level: "pleno",
      },
      {
        q: "Como você versiona uma API tRPC?",
        a: "<p>Versionar é o maior ponto fraco do tRPC: breaking changes no servidor quebram o cliente imediatamente (em compile-time — o que é bom). Estratégias: (1) Deprecate fields com comentários JSDoc @deprecated antes de remover. (2) Manter procedures antigas por um período. (3) Para apps mobile que não atualizam instantaneamente, considere REST ou GraphQL.</p><p>tRPC é ideal quando o servidor e o cliente deployam juntos (monorepo, Next.js full-stack). Quando há clientes que não atualizam em sincronia, o acoplamento forte é um problema.</p>",
        tip: "Citar essa limitação honestamente é o que sênior faz. Entrevistador quer ver que você conhece os tradeoffs.",
        level: "senior",
      },
      {
        q: "O que são subscriptions no tRPC?",
        a: "<p>tRPC suporta subscriptions via WebSocket para comunicação em tempo real. O servidor emite eventos via async generators, o cliente recebe com useSubscription. Requer configuração do transport WebSocket além do HTTP padrão.</p><p>Alternativa mais simples para muitos casos: Server-Sent Events (SSE) ou polling com staleTime baixo no React Query. Subscriptions tRPC fazem sentido para notificações em tempo real, colaboração, chats.</p>",
        level: "senior",
      },
    ],
    diagrams: [
      {
        title: "tRPC — type safety end-to-end sem codegen",
        html: `<style>
.trpc-diag{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.trpc-box{background:#1e293b;border:1.5px solid #334155;border-radius:8px;padding:12px 14px;font-size:11px}
.trpc-arr{color:#398ccb;text-align:center;font-size:22px;line-height:1}
.trpc-label{font-size:9px;letter-spacing:.1em;text-transform:uppercase;font-weight:700;margin-bottom:8px}
</style>
<div class="trpc-diag">
  <p style="color:#e2e8f0;font-size:12px;font-weight:700;margin:0 0 16px">tRPC — um tipo viaja do servidor ao cliente</p>
  <div style="display:flex;gap:8px;align-items:center">
    <div class="trpc-box" style="flex:1;border-color:#398ccb">
      <div class="trpc-label" style="color:#398ccb">Servidor</div>
      <div style="color:#94a3b8;line-height:2">
        <span style="color:#475569">// define a procedure</span><br>
        <span style="color:#7c3aed">const</span> appRouter = router({<br>
        &nbsp; getUser: procedure<br>
        &nbsp;&nbsp; .input(z.object({ id: <span style="color:#38bdf8">string</span> }))<br>
        &nbsp;&nbsp; .query(<span style="color:#7c3aed">async</span> ({ input }) =&gt; {<br>
        &nbsp;&nbsp;&nbsp; <span style="color:#7c3aed">return</span> db.user.findUnique(...)<br>
        &nbsp;&nbsp; }),<br>
        })<br>
        <span style="color:#7c3aed">export type</span> AppRouter = <span style="color:#7c3aed">typeof</span> appRouter
      </div>
    </div>
    <div style="display:flex;flex-direction:column;align-items:center;gap:2px">
      <div style="font-size:9px;color:#398ccb;text-align:center;white-space:nowrap">só o tipo<br>viaja →</div>
      <div class="trpc-arr">→</div>
      <div style="font-size:9px;color:#475569;text-align:center">(sem codegen)</div>
    </div>
    <div class="trpc-box" style="flex:1;border-color:#4ade80">
      <div class="trpc-label" style="color:#4ade80">Cliente</div>
      <div style="color:#94a3b8;line-height:2">
        <span style="color:#475569">// tipos inferidos automaticamente</span><br>
        <span style="color:#7c3aed">const</span> { data } = trpc.getUser.useQuery(<br>
        &nbsp; { id: <span style="color:#4ade80">'123'</span> }<br>
        )<br>
        <span style="color:#475569">// data é tipado com o retorno exato</span><br>
        <span style="color:#475569">// do servidor — sem declarar nada</span>
      </div>
    </div>
  </div>
  <div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:10px 14px;margin-top:10px;font-size:11px;color:#475569;line-height:1.8">
    <strong style="color:#94a3b8">Sem codegen:</strong> TypeScript importa o tipo AppRouter e infere tudo a partir daí. Mudar o tipo de retorno no servidor → erro no cliente em compile-time.
  </div>
</div>`,
        caption: "O tipo AppRouter viaja do servidor ao cliente em tempo de compilação — sem gerar arquivos intermediários. Runtime: chamadas HTTP normais.",
      },
    ],
    gotchas: [
      "tRPC só funciona em stacks onde servidor e cliente compartilham código TypeScript. Não serve para APIs públicas ou clientes não-TypeScript.",
      "Versionar API com tRPC é difícil — breaking changes chegam ao cliente imediatamente. Use com cuidado em APIs que clientes externos consomem.",
      "Subscriptions requerem transporte WebSocket além do HTTP padrão — configuração adicional no servidor.",
    ],
    resources: [
      { title: "tRPC docs", url: "https://trpc.io/docs", kind: "docs" },
      { title: "tRPC + Next.js example", url: "https://trpc.io/docs/client/nextjs/setup", kind: "docs" },
    ],
}

export default trpc
