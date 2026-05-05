import type { SkillContent } from '@/types'

const turborepo: SkillContent = {
  tagline: "Build system pra monorepo JS/TS — cache compartilhado, execução paralela, only-affected.",
  why: "Turborepo (Vercel) virou padrão em monorepo Next.js/React. Senior precisa explicar pipeline declarativo, remote cache, filtragem por affected, e comparar com Nx.",
  summary: "Turborepo orquestra tarefas (build, test, lint) em monorepo Yarn/PNPM/NPM workspaces. Você declara pipeline em turbo.json com dependsOn (topologico) e outputs (pra cache). Turbo executa só o que mudou via grafo de dependências e cacheia outputs local e remoto.",
  keypoints: [
    { title: "Pipeline declarativo", body: "turbo.json: { tasks: { build: { dependsOn: ['^build'], outputs: ['dist/**'] } } }. ^build = build de deps antes da minha. Outputs são o que o cache guarda." },
    { title: "Local cache", body: "Hash dos inputs (código, deps, env) -> cache em .turbo/cache. Re-run com mesmo input vira cache hit em ms. Apaga cache: --force." },
    { title: "Remote cache", body: "Time compartilha cache via Vercel ou self-hosted (S3 + bucket adapter). Dev local pega artifact buildado em CI." },
    { title: "Filtragem", body: "turbo build --filter=app1 roda só o pacote. --filter=...^app1 roda app1 e dependentes. --filter=[main] só afetados desde main." },
    { title: "Pruning", body: "turbo prune --scope=app1 gera subset do monorepo só com app1 + deps. Otimiza imagem Docker. Imagem cai drastico." },
  ],
  gotchas: [
    "outputs não listando arquivo gerado — próximo run não restaura, refaz tudo. Cheque que dist/**, .next/** etc estao listados.",
    "Esquecer env vars no env — build com API_URL=prod vira cache hit em API_URL=staging, deploy de coisa errada.",
    "--filter mal feito em PR — pula CI de pacote dependente. Sempre filtre incluindo dependentes (...).",
    "Remote cache público aberto = vazamento. Sempre auth (token, IAM).",
  ],
  interview: [
    { q: "Turborepo vs Nx — quando escolher cada?", a: "<p>Turborepo ganha em: simplicidade, learning curve baixa, time pequeno-medio, JS/TS puro, pipeline simples. Vercel o adquiriu e integra com Next.js perfeitamente.</p><p>Nx ganha em: monorepo gigante (50+ apps/libs), suporte a multilang (Java, Go, Python, .NET), generators ricos, dep graph visualizer, plugins de framework.</p><p>Time pequeno escolhe Turbo. Empresa grande com varios stacks vai pra Nx.</p>" },
  ],
  resources: [
    { title: "Turborepo Documentation", url: "https://turbo.build/repo/docs", kind: "docs" },
    { title: "Vercel Monorepo Handbook", url: "https://vercel.com/docs/monorepos", kind: "docs" },
  ],
}

export default turborepo
