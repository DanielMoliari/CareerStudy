import type { SkillContent } from '@/types'

const githubActions: SkillContent = {
  tagline: "CI/CD nativo do GitHub — workflows YAML acionados por eventos do repositório.",
  why: "GitHub Actions é a CI/CD mais comum em repositórios open-source e em muito SaaS. Sênior precisa montar pipeline completo com cache, matrix, reusable workflow, OIDC para cloud sem secret estático, deployment environments com aprovação manual, e entender segurança (pin de SHA, permissões mínimas do GITHUB_TOKEN). Aparece em toda entrevista de DevOps e backend em empresas que usam GitHub.",
  prerequisite: "Git básico (commits, branches, pull requests), noção de YAML (indentação, chaves), ter rodado pelo menos um workflow básico. Não precisa saber K8s ou Docker para começar, mas ajuda muito entender o que os workflows geralmente fazem.",
  summary: "GitHub Actions roda workflows definidos em .github/workflows/*.yaml. Cada workflow é disparado por um evento (push, pull_request, schedule, workflow_dispatch). O workflow tem um ou mais jobs que rodam em paralelo por padrão em runners (máquinas Ubuntu/Windows/macOS gerenciadas pelo GitHub ou self-hosted). Cada job tem steps sequenciais: comandos shell (run:) ou actions reutilizáveis (uses:). O Marketplace tem milhares de actions prontas. Recursos avançados: matrix builds (testar em N versões/SOs), caching de dependências, reusable workflows, composite actions, environments com aprovação manual, e OIDC para autenticar em AWS/GCP/Azure sem guardar access key como secret.",
  howToStudy: "<strong>Tem 30 minutos antes de uma entrevista?</strong> Revise o diagrama de anatomia do workflow, varra os gotchas e treine as Q&As de nível pleno em voz alta. Foque em OIDC, cache, e matrix — são as mais cobradas.<br><br><strong>Tem um fim de semana?</strong> Leia os 3 diagramas em ordem. Com um repositório de teste no GitHub, monte um pipeline CI completo (lint → test → build → docker push) com cache de npm e matrix de Node.js. Configure um environment de staging com aprovação manual.<br><br><strong>Tem uma semana?</strong> Siga a sequência completa do topo ao fundo. Configure OIDC com AWS em um projeto de teste. Crie um reusable workflow e consuma de dois repositórios diferentes. Implemente release automatizado com semantic-release.",
  diagrams: [
    {
      title: "Anatomia do workflow — eventos, jobs, steps, actions",
      html: `<style>
.ga1-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.ga1-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(100,116,139,.5);display:inline}
.ga1-tip:hover .ga1-tb{display:block}
.ga1-tb{display:none;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:240px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.ga1-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
.ga1-level{border-radius:8px;padding:11px 14px;border:1px solid}
.ga1-step{background:#0f172a;border:1px solid #334155;border-radius:5px;padding:7px 10px;font-size:10px;margin-bottom:5px}
</style>
<div class="ga1-wrap">
<p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Anatomia do workflow GitHub Actions</p>
<p style="color:#475569;font-size:10px;margin:0 0 16px">Passe o mouse nos termos <span style="border-bottom:1px dashed rgba(100,116,139,.5)">sublinhados</span></p>

<!-- Evento -->
<div class="ga1-level" style="background:rgba(32,136,255,.07);border-color:rgba(32,136,255,.3);margin-bottom:8px">
  <div style="font-size:9px;color:#2088FF;font-weight:700;letter-spacing:.08em;margin-bottom:6px">① EVENTO (trigger)</div>
  <div style="display:flex;gap:6px;flex-wrap:wrap">
    <span style="background:#1e293b;border:1px solid #334155;border-radius:4px;padding:4px 8px;font-size:10px;color:#94a3b8">
      <span class="ga1-tip">push<span class="ga1-tb">Dispara quando código é empurrado para o repositório. Filtros: branches (main, release/**), paths (src/**), tags (v*).</span></span>
    </span>
    <span style="background:#1e293b;border:1px solid #334155;border-radius:4px;padding:4px 8px;font-size:10px;color:#94a3b8">
      <span class="ga1-tip">pull_request<span class="ga1-tb">Dispara em eventos de PR: opened, synchronize (novo commit), reopened. PRs de forks rodam sem secrets por segurança — use pull_request_target com extremo cuidado.</span></span>
    </span>
    <span style="background:#1e293b;border:1px solid #334155;border-radius:4px;padding:4px 8px;font-size:10px;color:#94a3b8">
      <span class="ga1-tip">schedule<span class="ga1-tb">Cron syntax. Útil para tasks noturnas: renovar caches, rodar testes de integração longos, enviar relatórios. Atenção: em repos com baixa atividade o GitHub pode desabilitar.</span></span>
    </span>
    <span style="background:#1e293b;border:1px solid #334155;border-radius:4px;padding:4px 8px;font-size:10px;color:#94a3b8">
      <span class="ga1-tip">workflow_dispatch<span class="ga1-tb">Trigger manual via UI do GitHub ou API. Aceita inputs (parâmetros) que o usuário preenche. Padrão para deploys manuais e operações pontuais.</span></span>
    </span>
    <span style="background:#1e293b;border:1px solid #334155;border-radius:4px;padding:4px 8px;font-size:10px;color:#94a3b8">
      <span class="ga1-tip">workflow_call<span class="ga1-tb">Permite que outro workflow chame este como reusable workflow. Aceita inputs e secrets passados pelo caller. Base para pipelines modulares em monorepo.</span></span>
    </span>
    <span style="background:#1e293b;border:1px solid #334155;border-radius:4px;padding:4px 8px;font-size:10px;color:#94a3b8">
      <span class="ga1-tip">release<span class="ga1-tb">Dispara quando uma release é criada/publicada. Padrão para publicação de pacotes no npm/PyPI e build de binários de release.</span></span>
    </span>
  </div>
</div>

<div style="text-align:center;color:#334155;margin:4px 0">▼</div>

<!-- Workflow -->
<div class="ga1-level" style="background:rgba(32,136,255,.05);border-color:rgba(32,136,255,.2);margin-bottom:8px">
  <div style="font-size:9px;color:#2088FF;font-weight:700;letter-spacing:.08em;margin-bottom:8px">② WORKFLOW (.github/workflows/ci.yaml)</div>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">

    <!-- Job 1 -->
    <div style="background:#1e293b;border:1px solid rgba(32,136,255,.3);border-radius:8px;padding:10px">
      <div style="font-size:10px;color:#2088FF;font-weight:700;margin-bottom:6px">
        <span class="ga1-tip">JOB: lint<span class="ga1-tb">Jobs rodam em paralelo por padrão em runners independentes. Cada job começa com um runner limpo — sem estado compartilhado entre jobs (use artifacts ou cache para passar dados).</span></span>
      </div>
      <div class="ga1-step">
        <span style="color:#4ade80">uses:</span>
        <span style="color:#64748b"> actions/checkout</span>
      </div>
      <div class="ga1-step">
        <span style="color:#f59e0b">run:</span>
        <span style="color:#64748b"> npm run lint</span>
      </div>
    </div>

    <!-- Job 2 -->
    <div style="background:#1e293b;border:1px solid rgba(32,136,255,.3);border-radius:8px;padding:10px">
      <div style="font-size:10px;color:#2088FF;font-weight:700;margin-bottom:6px">
        <span class="ga1-tip">JOB: test<span class="ga1-tb">Roda em paralelo com lint. Cada job declara runs-on (ubuntu-latest, windows-latest, macos-latest, ou self-hosted). Pode declarar needs: [outro-job] para criar dependência sequencial.</span></span>
      </div>
      <div class="ga1-step">
        <span style="color:#4ade80">uses:</span>
        <span style="color:#64748b"> actions/checkout</span>
      </div>
      <div class="ga1-step">
        <span style="color:#4ade80">uses:</span>
        <span style="color:#64748b"> actions/setup-node</span>
      </div>
      <div class="ga1-step">
        <span style="color:#4ade80">uses:</span>
        <span style="color:#64748b"> actions/cache</span>
      </div>
      <div class="ga1-step">
        <span style="color:#f59e0b">run:</span>
        <span style="color:#64748b"> npm test</span>
      </div>
    </div>

    <!-- Job 3 -->
    <div style="background:#1e293b;border:1px solid rgba(32,136,255,.3);border-radius:8px;padding:10px">
      <div style="font-size:10px;color:#2088FF;font-weight:700;margin-bottom:6px">
        <span class="ga1-tip">JOB: deploy<span class="ga1-tb">needs: [lint, test] — só roda se ambos passaram. environment: production adiciona proteção: aprovação manual obrigatória, branch policy (só main pode deployar), histórico de deploys.</span></span>
      </div>
      <div class="ga1-step" style="border-color:rgba(239,68,68,.3)">
        <span style="color:#ef4444;font-size:9px">needs: [lint, test]</span>
      </div>
      <div class="ga1-step" style="border-color:rgba(245,158,11,.3)">
        <span style="color:#f59e0b;font-size:9px">environment: production</span>
      </div>
      <div class="ga1-step">
        <span style="color:#f59e0b">run:</span>
        <span style="color:#64748b"> deploy.sh</span>
      </div>
    </div>
  </div>
</div>

<div style="text-align:center;color:#334155;margin:4px 0">▼</div>

<!-- Runner -->
<div class="ga1-level" style="background:rgba(74,222,128,.04);border-color:rgba(74,222,128,.2)">
  <div style="font-size:9px;color:#4ade80;font-weight:700;letter-spacing:.08em;margin-bottom:6px">③ RUNNER — onde o job executa</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:10px;color:#64748b">
    <div style="background:#1e293b;border:1px solid #334155;border-radius:6px;padding:8px 10px">
      <div style="color:#4ade80;font-weight:700;margin-bottom:3px">GitHub-hosted</div>
      Ubuntu 22.04 / Windows / macOS. VM limpa por job. Incluso no plano gratuito (2000 min/mês para repos privados). Ubuntu mais barato que Mac (2x) e Windows (2x).
    </div>
    <div style="background:#1e293b;border:1px solid #334155;border-radius:6px;padding:8px 10px">
      <div style="color:#f59e0b;font-weight:700;margin-bottom:3px">Self-hosted</div>
      Sua máquina ou VM. Sem custo de minutos. Para workload pesado (GPU, imagens Docker grandes), rede privada ou compliance. Cuidado: PR de fork em self-hosted = RCE potencial.
    </div>
  </div>
</div>
</div>`,
      caption: "O fluxo sempre é: evento → workflow → jobs (paralelos por padrão) → steps (sequenciais). needs: cria dependências entre jobs. environment: adiciona gates de aprovação para deploy.",
    },
    {
      title: "Concorrência de jobs, needs e deployment gates",
      html: `<style>
.ga2-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.ga2-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(100,116,139,.5);display:inline}
.ga2-tip:hover .ga2-tb{display:block}
.ga2-tb{display:none;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:230px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.ga2-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
.ga2-job{border-radius:7px;padding:9px 12px;border:1px solid;font-size:10px;min-width:100px;text-align:center}
.ga2-arrow{color:#334155;font-size:18px;display:flex;align-items:center}
</style>
<div class="ga2-wrap">
<p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Concorrência de jobs, needs e deployment gates</p>
<p style="color:#475569;font-size:10px;margin:0 0 16px">Jobs independentes rodam em paralelo. <code style="color:#2088FF">needs:</code> cria sequência. <code style="color:#f59e0b">environment:</code> adiciona aprovação.</p>

<!-- DAG de jobs -->
<div style="background:#1e293b;border:1px solid #334155;border-radius:10px;padding:16px;margin-bottom:12px">
  <div style="font-size:9px;color:#64748b;letter-spacing:.1em;margin-bottom:12px;text-transform:uppercase">Pipeline completo — grafo de dependências</div>

  <!-- Linha 1: paralelos -->
  <div style="display:flex;gap:8px;justify-content:center;margin-bottom:8px">
    <div class="ga2-job" style="background:rgba(32,136,255,.08);border-color:rgba(32,136,255,.3);color:#2088FF">
      <span class="ga2-tip">lint<span class="ga2-tb">Roda em paralelo com test e type-check. Se falhar, os jobs dependentes (build) não rodam — fail-fast por padrão. Use if: always() para jobs de relatório que devem rodar sempre.</span></span>
    </div>
    <div class="ga2-job" style="background:rgba(32,136,255,.08);border-color:rgba(32,136,255,.3);color:#2088FF">
      <span class="ga2-tip">test<span class="ga2-tb">Roda em paralelo com lint. Pode usar strategy.matrix para rodar em múltiplas versões de Node.js / múltiplos SOs simultaneamente. Gera coverage report como artifact.</span></span>
    </div>
    <div class="ga2-job" style="background:rgba(32,136,255,.08);border-color:rgba(32,136,255,.3);color:#2088FF">
      <span class="ga2-tip">type-check<span class="ga2-tb">Roda em paralelo. tsc --noEmit valida tipos sem gerar arquivos. Separar de build permite feedback mais rápido — type errors aparecem antes de npm run build terminar.</span></span>
    </div>
  </div>

  <!-- Seta convergindo -->
  <div style="text-align:center;color:#334155;font-size:16px;margin-bottom:8px">▼ &nbsp;<span style="font-size:10px;color:#475569">needs: [lint, test, type-check]</span></div>

  <!-- Build -->
  <div style="display:flex;justify-content:center;margin-bottom:8px">
    <div class="ga2-job" style="background:rgba(245,158,11,.07);border-color:rgba(245,158,11,.3);color:#f59e0b">
      <span class="ga2-tip">build &amp; push<span class="ga2-tb">Só roda se todos os jobs anteriores passaram. Faz docker build + push para o registry. Usa OIDC para autenticar em ECR sem access key estática. Gera a tag da imagem como output.</span></span>
    </div>
  </div>

  <!-- Deploy paralelo em staging / bifurcação -->
  <div style="text-align:center;color:#334155;font-size:16px;margin-bottom:8px">▼ &nbsp;<span style="font-size:10px;color:#475569">needs: [build]</span></div>

  <div style="display:flex;gap:8px;justify-content:center;margin-bottom:8px">
    <div class="ga2-job" style="background:rgba(74,222,128,.06);border-color:rgba(74,222,128,.25);color:#4ade80;flex:1;max-width:140px">
      <span class="ga2-tip">deploy-staging<span class="ga2-tb">Roda em paralelo com deploy-eu-staging. environment: staging sem aprovação manual — deploy automático em todo push para main. Roda smoke tests após deploy.</span></span>
    </div>
    <div class="ga2-job" style="background:rgba(74,222,128,.06);border-color:rgba(74,222,128,.25);color:#4ade80;flex:1;max-width:140px">
      <span class="ga2-tip">deploy-eu-staging<span class="ga2-tb">Deploy paralelo para região EU. needs: [build] — não precisa esperar deploy-staging. Ambos rodando ao mesmo tempo reduz o tempo total de pipeline.</span></span>
    </div>
  </div>

  <!-- Aprovação manual -->
  <div style="text-align:center;font-size:9px;color:#475569;margin-bottom:6px">▼ &nbsp;needs: [deploy-staging, deploy-eu-staging]</div>
  <div style="display:flex;justify-content:center;margin-bottom:8px">
    <div class="ga2-job" style="background:rgba(239,68,68,.06);border-color:rgba(239,68,68,.3);color:#ef4444">
      <span class="ga2-tip">deploy-production<span class="ga2-tb">environment: production com reviewers: [team-leads]. O job PARA aqui e aguarda aprovação manual dos revisores configurados. Tem timeout configurável (72h padrão). Após aprovação, usa OIDC para assumir role de prod.</span></span>
      <div style="font-size:9px;color:#f87171;margin-top:3px">⏸ aguarda aprovação manual</div>
    </div>
  </div>
</div>

<!-- Concurrency -->
<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
  <div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:11px 13px">
    <div style="font-size:10px;color:#2088FF;font-weight:700;margin-bottom:6px">
      <span class="ga2-tip">concurrency group<span class="ga2-tb">Agrupa workflows por grupo (ex: por branch). Quando um novo workflow do mesmo grupo inicia, o anterior pode ser cancelado (cancel-in-progress: true). Evita 5 runs paralelos de uma branch com vários pushes rápidos.</span></span>
    </div>
    <div style="font-size:10px;color:#64748b;line-height:1.8">
      <span style="color:#4ade80">concurrency:</span><br>
      &nbsp;&nbsp;<span style="color:#94a3b8">group:</span> <span style="color:#f59e0b">\${{ github.ref }}</span><br>
      &nbsp;&nbsp;<span style="color:#94a3b8">cancel-in-progress:</span> <span style="color:#4ade80">true</span>
    </div>
  </div>
  <div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:11px 13px">
    <div style="font-size:10px;color:#f59e0b;font-weight:700;margin-bottom:6px">
      <span class="ga2-tip">timeout-minutes<span class="ga2-tb">Sem timeout, um job travado (teste infinito, processo zombie) consume minutos indefinidamente. Padrão do GitHub é 6 horas — absurdo para a maioria dos jobs. Configure 15-30 min por job típico de CI.</span></span>
    </div>
    <div style="font-size:10px;color:#64748b;line-height:1.8">
      <span style="color:#4ade80">jobs:</span><br>
      &nbsp;&nbsp;<span style="color:#94a3b8">test:</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#ef4444">timeout-minutes: 20</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#64748b">runs-on: ubuntu-latest</span>
    </div>
  </div>
</div>
</div>`,
      caption: "O grafo de depends (needs:) determina o caminho crítico do pipeline. Jobs independentes rodam em paralelo — entender isso permite otimizar tempo total de CI significativamente.",
    },
    {
      title: "Contextos do GitHub Actions — o que cada um contém",
      html: `<style>
.ga3-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.ga3-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(100,116,139,.5);display:inline}
.ga3-tip:hover .ga3-tb{display:block}
.ga3-tb{display:none;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:230px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.ga3-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
.ga3-ctx{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:10px 12px}
.ga3-ctx-name{font-size:11px;font-weight:700;margin-bottom:6px}
.ga3-prop{font-size:9.5px;color:#475569;line-height:1.8}
.ga3-val{color:#94a3b8}
</style>
<div class="ga3-wrap">
<p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Contextos — o que cada um contém</p>
<p style="color:#475569;font-size:10px;margin:0 0 14px">Use <span style="color:#2088FF">\$&#123;&#123; contexto.propriedade &#125;&#125;</span> em qualquer lugar do YAML</p>

<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:8px">
  <div class="ga3-ctx">
    <div class="ga3-ctx-name" style="color:#2088FF">
      <span class="ga3-tip">github<span class="ga3-tb">Informações sobre o evento que disparou o workflow: repositório, branch, commit, autor, payload do evento. Disponível em qualquer step.</span></span>
    </div>
    <div class="ga3-prop">
      .ref &nbsp;<span class="ga3-val">refs/heads/main</span><br>
      .sha &nbsp;<span class="ga3-val">a1b2c3d4...</span><br>
      .event_name &nbsp;<span class="ga3-val">push</span><br>
      .actor &nbsp;<span class="ga3-val">username</span><br>
      .repository &nbsp;<span class="ga3-val">org/repo</span><br>
      .run_id &nbsp;<span class="ga3-val">1234567</span><br>
      .token &nbsp;<span class="ga3-val">GITHUB_TOKEN</span>
    </div>
  </div>
  <div class="ga3-ctx">
    <div class="ga3-ctx-name" style="color:#4ade80">
      <span class="ga3-tip">env<span class="ga3-tb">Variáveis de ambiente definidas no workflow via env: no nível de workflow, job ou step. Disponível no passo corrente e nos seguintes via $GITHUB_ENV. Para definir em runtime: echo "KEY=val" >> $GITHUB_ENV</span></span>
    </div>
    <div class="ga3-prop">
      .NODE_ENV &nbsp;<span class="ga3-val">production</span><br>
      .API_URL &nbsp;<span class="ga3-val">https://...</span><br><br>
      <span style="color:#4ade80"># definir em runtime:</span><br>
      echo "TAG=v1.2" &gt;&gt; $GITHUB_ENV
    </div>
  </div>
  <div class="ga3-ctx">
    <div class="ga3-ctx-name" style="color:#f59e0b">
      <span class="ga3-tip">secrets<span class="ga3-tb">Segredos criptografados configurados no repositório, organização ou environment. Nunca logados pelo GitHub. Acessíveis apenas em jobs que têm permissão para o environment. PRs de forks não têm acesso a secrets.</span></span>
    </div>
    <div class="ga3-prop">
      .AWS_ROLE_ARN<br>
      .REGISTRY_TOKEN<br>
      .SLACK_WEBHOOK<br><br>
      <span style="color:#f59e0b"># OIDC: sem secret</span><br>
      permissions:<br>
      &nbsp;id-token: write
    </div>
  </div>
</div>

<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:8px">
  <div class="ga3-ctx">
    <div class="ga3-ctx-name" style="color:#a78bfa">
      <span class="ga3-tip">vars<span class="ga3-tb">Variáveis não sensíveis configuradas no repositório, organização ou environment. Diferente de secrets: aparecem em logs, visíveis na UI. Para configuração de ambiente (URLs, feature flags, nomes de ambiente) que não são segredos.</span></span>
    </div>
    <div class="ga3-prop">
      .DEPLOY_REGION<br>
      .APP_NAME<br>
      .REGISTRY_URL<br><br>
      <span style="color:#a78bfa">Diferente de secrets:</span><br>
      visível em logs e UI
    </div>
  </div>
  <div class="ga3-ctx">
    <div class="ga3-ctx-name" style="color:#38bdf8">
      <span class="ga3-tip">runner<span class="ga3-tb">Informações sobre o runner que executa o job. Útil para paths e diagnóstico. runner.os permite scripts condicionais: if runner.os == 'Linux'.</span></span>
    </div>
    <div class="ga3-prop">
      .os &nbsp;<span class="ga3-val">Linux</span><br>
      .arch &nbsp;<span class="ga3-val">X64</span><br>
      .temp &nbsp;<span class="ga3-val">/tmp</span><br>
      .tool_cache &nbsp;<span class="ga3-val">/opt/...</span>
    </div>
  </div>
  <div class="ga3-ctx">
    <div class="ga3-ctx-name" style="color:#f97316">
      <span class="ga3-tip">steps<span class="ga3-tb">Outputs de steps anteriores no mesmo job. Steps precisam declarar id: para serem referenciados. steps.meu-step.outputs.resultado. Também: steps.meu-step.conclusion (success/failure/skipped).</span></span>
    </div>
    <div class="ga3-prop">
      .meu-step.outputs.tag<br>
      .meu-step.conclusion<br><br>
      <span style="color:#f97316"># no step produtor:</span><br>
      echo "tag=v1" &gt;&gt; $GITHUB_OUTPUT
    </div>
  </div>
</div>

<!-- jobs context -->
<div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:11px 13px">
  <div style="font-size:10px;color:#ef4444;font-weight:700;margin-bottom:6px">
    <span class="ga3-tip">jobs context (reusable workflows)<span class="ga3-tb">Disponível apenas em reusable workflows — acessa outputs de jobs do caller. No workflow normal, use needs.job-id.outputs.prop para acessar outputs de jobs anteriores.</span></span>
    &nbsp;+&nbsp;
    <span class="ga3-tip">needs context<span class="ga3-tb">Acessa outputs e status de jobs listados em needs:. needs.build.outputs.image-tag acessa o output 'image-tag' do job 'build'. needs.build.result retorna success/failure/cancelled/skipped.</span></span>
  </div>
  <div style="font-size:10px;color:#64748b;line-height:1.8">
    <span style="color:#94a3b8">needs.build.outputs.image-tag</span> &nbsp;← output do job anterior<br>
    <span style="color:#94a3b8">needs.build.result</span> &nbsp;← success / failure / cancelled<br>
    <span style="color:#94a3b8">if: needs.build.result == 'success'</span> &nbsp;← condicional de job
  </div>
</div>
</div>`,
      caption: "O contexto github.token é o GITHUB_TOKEN gerado automaticamente por execução — tem permissões configuráveis (mínimo: contents: read). Para cloud, substitua secrets estáticos por OIDC com id-token: write.",
    },
  ],
  keypoints: [
    {
      title: "Eventos e filtros — controle o que dispara o workflow",
      body: "O bloco on: define os gatilhos. Filtros reduzem execuções desnecessárias: branches filtra por nome de branch, paths filtra por arquivos alterados, tags filtra por pattern de tag. paths-ignore exclui mudanças em docs/**, *.md. A combinação certa evita rodar o pipeline de build por mudança de README.",
      code: `on:
push:
  branches: [main, 'release/**']
  paths:
    - 'src/**'
    - 'package*.json'
    - 'Dockerfile'
  paths-ignore:
    - 'docs/**'
    - '*.md'
pull_request:
  branches: [main]
schedule:
  - cron: '0 2 * * 1'   # segunda, 2h UTC
workflow_dispatch:
  inputs:
    environment:
      type: choice
      options: [staging, production]`,
    },
    {
      title: "Cache de dependências — o maior ganho de performance",
      body: "actions/cache salva e restaura diretórios entre runs. A chave determina quando o cache é invalidado: inclua o hash do lockfile para invalidar apenas quando as dependências mudarem. Setup actions modernas (setup-node, setup-python, setup-go) têm cache integrado via parâmetro cache. Um cache hit pode economizar 2-4 minutos em projetos com muitas dependências.",
      code: `- uses: actions/setup-node@v4
with:
  node-version: '20'
  cache: 'npm'           # cache integrado — mais simples

# Ou manualmente com mais controle:
- uses: actions/cache@v4
with:
  path: ~/.npm
  key: \${{ runner.os }}-node-\${{ hashFiles('**/package-lock.json') }}
  restore-keys: |
    \${{ runner.os }}-node-

# Python
- uses: actions/setup-python@v5
with:
  python-version: '3.12'
  cache: 'pip'

# Go
- uses: actions/setup-go@v5
with:
  go-version: '1.22'
  cache: true`,
    },
    {
      title: "Matrix strategy — testar em múltiplas configurações",
      body: "strategy.matrix roda o mesmo job em combinações configuráveis. Útil para testar compatibilidade com múltiplas versões de runtime ou sistemas operacionais. include adiciona configurações específicas, exclude remove combinações indesejadas. fail-fast: false garante que todas as combinações rodam mesmo se uma falha.",
      code: `jobs:
test:
  strategy:
    fail-fast: false    # mostra todas as falhas, não cancela ao primeiro erro
    matrix:
      node: [18, 20, 22]
      os: [ubuntu-latest, macos-latest]
      include:
        - node: 20
          os: ubuntu-latest
          coverage: true    # extra flag só nessa combinação
      exclude:
        - node: 18
          os: macos-latest  # remove combinação específica
  runs-on: \${{ matrix.os }}
  steps:
    - uses: actions/setup-node@v4
      with:
        node-version: \${{ matrix.node }}
    - run: npm test
    - if: matrix.coverage
      run: npm run coverage`,
    },
    {
      title: "OIDC — autenticar em cloud sem secret estático",
      body: "OIDC (OpenID Connect) permite que o GitHub emita um token JWT que AWS/GCP/Azure validam diretamente. Elimina access keys estáticas que vazam, expiram de forma inesperada e são difíceis de rotacionar. O token é válido apenas para o run atual, com escopo restrito a repo + branch declarados na trust policy.",
      code: `# No workflow — declarar permissão para emitir token OIDC
permissions:
id-token: write
contents: read

jobs:
deploy:
  runs-on: ubuntu-latest
  steps:
    - uses: aws-actions/configure-aws-credentials@v4
      with:
        role-to-assume: arn:aws:iam::123456789:role/github-actions-role
        aws-region: us-east-1
        # Sem secrets! GitHub troca OIDC token por credencial temporária AWS

    - run: aws s3 ls  # funciona com credencial temporária via STS`,
    },
    {
      title: "Reusable workflows — DRY para pipelines",
      body: "Um workflow pode ser chamado por outros via workflow_call. O workflow reutilizável declara inputs (parâmetros) e secrets (segredos passados pelo caller). Outputs permitem retornar valores para o caller. Use para pipeline inteiro (CI completo, deploy completo). Para bloco de steps, prefira composite action.",
      code: `# .github/workflows/reusable-ci.yaml
on:
workflow_call:
  inputs:
    service:
      type: string
      required: true
  secrets:
    REGISTRY_TOKEN:
      required: true
  outputs:
    image-tag:
      value: \${{ jobs.build.outputs.tag }}
jobs:
build:
  outputs:
    tag: \${{ steps.meta.outputs.tag }}
  runs-on: ubuntu-latest
  steps:
    - run: echo "building \${{ inputs.service }}"

# .github/workflows/ci.yaml — caller
jobs:
ci:
  uses: ./.github/workflows/reusable-ci.yaml
  with:
    service: api
  secrets:
    REGISTRY_TOKEN: \${{ secrets.REGISTRY_TOKEN }}`,
    },
    {
      title: "Outputs — passar dados entre steps e jobs",
      body: "Steps passam dados via GITHUB_OUTPUT (arquivo de environment). Jobs passam dados via outputs: declarado no job e acessado por jobs dependentes via needs.job-id.outputs.prop. Reusable workflows podem expor outputs do workflow inteiro para o caller.",
      code: `jobs:
build:
  runs-on: ubuntu-latest
  outputs:
    image-tag: \${{ steps.meta.outputs.tag }}
  steps:
    - name: Generate tag
      id: meta
      run: |
        TAG=\${{ github.sha }}
        echo "tag=\${TAG:0:7}" >> $GITHUB_OUTPUT

deploy:
  needs: [build]
  runs-on: ubuntu-latest
  steps:
    - run: echo "Deploying \${{ needs.build.outputs.image-tag }}"`,
    },
    {
      title: "Environments e aprovação manual",
      body: "Environments adicionam proteção aos deploys: revisores obrigatórios (time que deve aprovar antes do job continuar), branch policy (só main pode deployar para prod), variáveis e secrets escopados por ambiente, e histórico de deploys. O job pausa após declarar environment: e aguarda aprovação dos revisores configurados na UI do GitHub.",
      code: `jobs:
deploy-production:
  runs-on: ubuntu-latest
  environment:
    name: production
    url: https://minha-app.com
  permissions:
    id-token: write
  steps:
    - uses: aws-actions/configure-aws-credentials@v4
      with:
        role-to-assume: \${{ vars.AWS_PROD_ROLE_ARN }}
        aws-region: us-east-1
    - run: ./scripts/deploy.sh prod`,
    },
  ],
  gotchas: [
    "Actions de terceiros sem pin por SHA — o autor pode publicar versão maliciosa na tag v1 ou v2. Sempre use: org/action@sha256completo. Renovate/Dependabot atualiza SHAs automaticamente.",
    "Secrets em logs — echo $SECRET, print() com interpolação de string, ou debug verboso de ferramentas que loga argumentos. O GitHub mascara valores conhecidos, mas não é 100% confiável. Nunca logue secrets explicitamente.",
    "Sem concurrency group — múltiplos pushes rápidos criam dezenas de runs paralelos na mesma branch, causando condição de corrida em deploys e gastando minutos. Configure concurrency com cancel-in-progress.",
    "Cache key sem hash do lockfile — cache nunca invalida, deps desatualizadas são restauradas silenciosamente. A chave deve incluir hashFiles('**/package-lock.json') ou equivalente.",
    "GITHUB_TOKEN com permissões excessivas — o padrão histórico era write em tudo. Declare permissions: mínimo no início do workflow (contents: read para a maioria, id-token: write apenas onde usar OIDC).",
    "pull_request_target com code do fork — esse evento executa no contexto da branch base (tem acesso a secrets). Se o workflow faz checkout do código do PR (actions/checkout com ref: ${{ github.event.pull_request.head.sha }}), é RCE garantido. Use pull_request com ambientes isolados para código de forks.",
    "Self-hosted runner para PRs de forks — o runner tem acesso à rede interna e filesystem do host. Código malicioso em um fork pode exfiltrar segredos. Isole em containers descartáveis ou use GitHub-hosted runners para PRs externos.",
  ],
  interview: [
    {
      q: "Como você desenharia o CI de um monorepo com 10 serviços independentes?",
      level: "senior",
      a: "<p>Estratégia: change detection + matrix dinâmica para rodar CI apenas dos serviços afetados.</p><ol><li><strong>Job de detecção</strong>: usa dorny/paths-filter para identificar quais serviços tiveram arquivos alterados. Retorna um JSON com lista de serviços afetados como output.</li><li><strong>Matrix dinâmica</strong>: o job de CI usa fromJson(needs.detect.outputs.services) como matrix. Resultado: só os serviços tocados têm seu pipeline executado.</li><li><strong>Reusable workflow</strong>: um único service-ci.yaml chamado N vezes com o nome do serviço como input. Evita duplicação de 10 arquivos de workflow quase idênticos.</li><li><strong>Cache por serviço</strong>: a chave de cache inclui o nome do serviço — caches isolados evitam colisão entre dependências diferentes.</li><li><strong>Remote cache (Turborepo/Nx)</strong>: se o monorepo usa Turbo ou Nx, o remote cache elimina rebuilds de código não alterado mesmo entre runs diferentes.</li></ol>",
      tip: "A resposta que diferencia sênior de pleno é mencionar a matrix dinâmica (não estática) e o remote cache. Matrix estática roda CI de todos os 10 serviços em todo PR — desperdício. Matrix dinâmica roda só os afetados — escalável.",
    },
    {
      q: "Como autenticar em AWS sem guardar access key como secret?",
      level: "pleno",
      a: "<p>Usar OIDC federation. O fluxo:</p><ol><li>No AWS: criar IAM Identity Provider apontando para <code>token.actions.githubusercontent.com</code> com audience <code>sts.amazonaws.com</code></li><li>Criar IAM Role com trust policy que aceita tokens do OIDC provider e restringe ao repositório específico via condition: <code>StringLike: token.actions.githubusercontent.com:sub: repo:org/repo:ref:refs/heads/main</code></li><li>No workflow: declarar <code>permissions: id-token: write</code> e usar <code>aws-actions/configure-aws-credentials</code> com <code>role-to-assume</code></li></ol><p>Resultado: nenhuma access key é armazenada. O token é temporário (dura o run), gerado pelo GitHub, validado diretamente pelo AWS STS. Escopo restrito ao repositório e branch declarados na trust policy.</p>",
      tip: "Candidatos que sabem OIDC mas não sabem mencionar a trust policy condition (que restringe a repo+branch) demonstram conhecimento superficial. A restrição é o que torna seguro — sem ela, qualquer repositório poderia assumir a role.",
    },
    {
      q: "Qual a diferença entre reusable workflow e composite action? Quando usar cada um?",
      level: "pleno",
      a: "<p><strong>Reusable workflow</strong>: um workflow inteiro que pode ser chamado por outro via <code>uses: ./.github/workflows/ci.yaml</code> (mesmo repositório) ou <code>uses: org/repo/.github/workflows/ci.yaml@main</code> (externo). Roda em seu próprio runner, tem seus próprios jobs, secrets e outputs. Use para reutilizar pipelines completos — CI de serviço, deploy de infraestrutura.</p><p><strong>Composite action</strong>: um action definido em action.yaml que agrupa múltiplos steps. Roda no mesmo runner do job que o chama — acessa o mesmo workspace, as mesmas variáveis de ambiente. Use para reutilizar blocos de steps dentro de um job: setup de ambiente customizado, coleta de métricas, notificações.</p><p>Regra prática: se você quer reutilizar um <em>job inteiro ou pipeline</em>, use reusable workflow. Se quer reutilizar um <em>bloco de steps</em> dentro de um job existente, use composite action.</p>",
    },
    {
      q: "Como debugar um workflow que falha em CI mas passa localmente?",
      level: "pleno",
      a: "<p>Roteiro sistemático:</p><ol><li><strong>Adicionar debug</strong>: ativar debug logging com secret ACTIONS_RUNNER_DEBUG=true e ACTIONS_STEP_DEBUG=true. Mostra logs internos do runner e de cada step.</li><li><strong>Inspecionar o ambiente</strong>: adicionar step com <code>run: env | sort</code> e <code>run: node --version && npm --version</code> para comparar versões com local.</li><li><strong>Diferenças comuns</strong>: versão do Node.js/Python/Go diferente da local; variáveis de ambiente ausentes (HOME, PATH diferente); permissões de filesystem (o runner é um usuário sem privilégios); paths absolutos que existem localmente mas não no runner; rede (o runner não tem acesso à rede interna).</li><li><strong>Artifact de debug</strong>: fazer upload do diretório de trabalho como artifact após falha para inspecionar o estado dos arquivos.</li><li><strong>act (local)</strong>: ferramenta que roda GitHub Actions localmente via Docker. Útil para iterar sem fazer push.</li></ol>",
    },
    {
      q: "Como funciona o GITHUB_TOKEN e quais são suas limitações de permissão?",
      level: "pleno",
      a: "<p>O GITHUB_TOKEN é um token de acesso gerado automaticamente pelo GitHub para cada run de workflow. Scoped ao repositório onde o workflow roda — não pode acessar outros repositórios da organização.</p><p>Permissões padrão (configuráveis em Settings &gt; Actions): no modelo permissivo histórico, tem write em contents, pull-requests, issues, etc. No modelo restritivo (recomendado): read em tudo por padrão.</p><p>Declare explicitamente o mínimo necessário:</p><pre style='font-size:10px;color:#4ade80'>permissions:\n  contents: read          # checkout\n  pull-requests: write    # comentar em PRs\n  packages: write         # push para GitHub Packages\n  id-token: write         # OIDC</pre><p><strong>Limitações importantes:</strong></p><ul><li>Não pode disparar outros workflows — commits feitos com GITHUB_TOKEN não trigam on: push de outros workflows (loop infinito prevention)</li><li>Expira ao final do run</li><li>Não tem acesso a repositórios externos — use Personal Access Token (PAT) ou GitHub App token para isso</li></ul>",
    },
    {
      q: "Como configurar cache eficiente de Docker layers no GitHub Actions?",
      level: "pleno",
      a: "<p>Duas abordagens principais:</p><p><strong>1. GitHub Cache (actions/cache via BuildKit)</strong>: armazena layers na cache do Actions. Gratuito, sem configuração extra. Limite de 10 GB por repositório.</p><pre style='font-size:10px;color:#4ade80'>- uses: docker/setup-buildx-action@v3\n- uses: docker/build-push-action@v5\n  with:\n    cache-from: type=gha\n    cache-to: type=gha,mode=max</pre><p><strong>2. Registry cache (ECR, Docker Hub, GHCR)</strong>: armazena layers como manifesto no registry. Mais persistente, sem limite de 10 GB. Requer autenticação.</p><pre style='font-size:10px;color:#4ade80'>- uses: docker/build-push-action@v5\n  with:\n    cache-from: type=registry,ref=ghcr.io/org/app:cache\n    cache-to: type=registry,ref=ghcr.io/org/app:cache,mode=max</pre><p>mode=max armazena layers de todos os stages (incluindo intermediários de multi-stage) — mais espaço, mais cache hits. mode=min armazena só o stage final — menor espaço.</p>",
    },
    {
      q: "Como implementar deployment com rollback automático em GitHub Actions?",
      level: "senior",
      a: "<p>Estratégia com rollback via smoke test:</p><ol><li>Deploy nova versão em paralelo com a atual (blue/green ou canary)</li><li>Smoke test com retry: curl com --retry 3 verificando endpoints críticos</li><li>Se smoke test falha: step de rollback executa script que aponta tráfego de volta para versão anterior</li><li>Notificação via Slack/PagerDuty com link para o run de falha</li></ol><pre style='font-size:10px;color:#4ade80'>steps:\n  - name: Deploy\n    id: deploy\n    run: ./deploy.sh \${{ env.IMAGE_TAG }}\n\n  - name: Smoke test\n    id: smoke\n    run: |\n      for i in {1..5}; do\n        curl -f https://api.minha-app.com/health && exit 0\n        sleep 10\n      done\n      exit 1\n\n  - name: Rollback\n    if: failure() && steps.smoke.conclusion == 'failure'\n    run: ./rollback.sh \${{ env.PREVIOUS_TAG }}</pre><p>Para infra declarativa (Terraform, K8s): o rollback é reapplicar o estado anterior do repositório via commit de revert ou via variável de versão.</p>",
    },
    {
      q: "Explique o risco de pull_request_target e quando é seguro usar.",
      level: "senior",
      a: "<p><code>pull_request</code> (sem _target): executa no contexto do HEAD do PR (código do contribuidor). <strong>Não tem acesso a secrets</strong> para PRs de forks — design intencional de segurança. Problema: impossibilita deploy previews e comentários automatizados em PRs de forks.</p><p><code>pull_request_target</code>: executa no contexto da branch <em>base</em> (main), não do PR. <strong>Tem acesso a secrets</strong>. O perigo: se o workflow fizer checkout do código do PR e executar comandos com acesso a secrets, é RCE garantido — o contribuidor pode modificar scripts que o workflow vai executar.</p><p><strong>Quando é seguro:</strong></p><ul><li>Workflow que apenas lê metadados do PR (número, labels, autor) sem executar código do fork</li><li>Workflow que faz checkout do código do fork em um step isolado sem acesso a secrets, e usa secrets só em steps separados que não executam código do fork</li></ul><p><strong>Pattern seguro para comentar em PRs de forks:</strong> use pull_request para rodar testes (sem secrets) e fazer upload de resultado como artifact. Um segundo workflow com pull_request_target faz download do artifact e comenta — sem nunca executar código do fork com secrets disponíveis.</p>",
      tip: "Esse é o gotcha de segurança mais cobrado em entrevistas de segurança de CI/CD. Candidatos que sabem a diferença mas não sabem o pattern seguro demonstram conhecimento pela metade.",
    },
    {
      q: "Como implementar release automático com semantic-release?",
      level: "senior",
      a: "<p>semantic-release analisa commits no formato Conventional Commits e decide automaticamente a próxima versão (patch/minor/major), gera CHANGELOG, cria release no GitHub e publica no npm/PyPI.</p><pre style='font-size:10px;color:#4ade80'>on:\n  push:\n    branches: [main]\njobs:\n  release:\n    runs-on: ubuntu-latest\n    permissions:\n      contents: write      # criar releases e tags\n      issues: write        # comentar em issues\n      pull-requests: write # comentar em PRs\n      id-token: write      # npm provenance\n    steps:\n      - uses: actions/checkout@v4\n        with:\n          fetch-depth: 0       # histórico completo para análise de commits\n          persist-credentials: false  # semantic-release usa seu próprio token\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 20\n          registry-url: https://registry.npmjs.org\n      - run: npx semantic-release\n        env:\n          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}\n          NODE_AUTH_TOKEN: \${{ secrets.NPM_TOKEN }}</pre><p>Commits: feat: → minor, fix: → patch, feat!: ou BREAKING CHANGE → major. O workflow roda em todo push para main e só cria release se há commits que justificam — commits de docs/chore/refactor não geram release.</p>",
    },
    {
      q: "Como configurar self-hosted runners com segurança?",
      level: "senior",
      a: "<p>Self-hosted runners rodam código de workflows no seu hardware — riscos altos se mal configurados.</p><p><strong>Riscos principais:</strong></p><ul><li>PRs de forks com código malicioso executam no runner com acesso à rede interna</li><li>Persistência de estado entre jobs (arquivos, credenciais em disco)</li><li>Runner comprometido tem acesso ao host</li></ul><p><strong>Mitigações obrigatórias:</strong></p><ul><li><strong>Container mode</strong>: cada job roda em um container Docker descartável. Inicie runners com --container-hooks para usar docker containers efêmeros</li><li><strong>Restrict to private repos</strong>: runners só aceitam jobs de repositórios privados da org, nunca de forks públicos</li><li><strong>Sem secrets globais</strong>: use environments com secrets escopados — runner não deve ter acesso a credenciais de prod por padrão</li><li><strong>Rede isolada</strong>: runner em subnet sem acesso à internet pública quando possível; apenas egress necessário</li><li><strong>Monitoramento</strong>: alertas em anomalias de uso de CPU/rede, jobs com duração anômala</li></ul><p>Para Kubernetes: actions-runner-controller (ARC) gerencia pods de runner efêmeros — cria um pod por job e destroi ao finalizar. Padrão de fato para self-hosted em escala.</p>",
    },
    {
      q: "Como funciona o cache de Actions e quais são seus limites?",
      level: "pleno",
      a: "<p>O cache do GitHub Actions armazena arquivos entre runs usando o par (key, path). Em cada run:</p><ol><li>Restauração: procura por cache com key exata. Se não encontra, tenta restore-keys em ordem (busca por prefixo)</li><li>Uso do run normalmente</li><li>Salvamento: no final do job, salva o path como cache com a key, se não houve cache hit exato</li></ol><p><strong>Limites importantes:</strong></p><ul><li>10 GB por repositório — caches antigos são evitados automaticamente quando o limite é atingido</li><li>TTL de 7 dias sem uso — caches não acessados por 7 dias são removidos</li><li>Cache é scoped por branch: PR pode ler cache da branch base (main), mas não de outras PRs. Cache criado em PR fica disponível apenas para aquela PR e para a branch base após merge</li></ul><p><strong>Estratégia de chave:</strong></p><pre style='font-size:10px;color:#4ade80'>key: \${{ runner.os }}-npm-\${{ hashFiles('package-lock.json') }}\nrestore-keys: |\n  \${{ runner.os }}-npm-</pre><p>restore-keys é o fallback: se não tem cache exato, restaura o mais recente que começa com o prefixo — dependências desatualizadas, mas melhor que nenhum cache.</p>",
    },
    {
      q: "Como estruturar permissões mínimas no GITHUB_TOKEN?",
      level: "pleno",
      a: "<p>O princípio do menor privilégio aplicado ao GITHUB_TOKEN: declare apenas as permissões necessárias para o workflow funcionar.</p><p>No nível de repositório (Settings &gt; Actions &gt; Workflow permissions): mude de 'Read and write' para 'Read repository contents'. Isso obriga que cada workflow declare as permissões adicionais explicitamente.</p><pre style='font-size:10px;color:#4ade80'># Nível do workflow — se aplica a todos os jobs\npermissions:\n  contents: read\n\njobs:\n  # Job que comenta em PR precisa de permissão extra\n  pr-comment:\n    permissions:\n      contents: read\n      pull-requests: write  # só este job tem essa permissão\n    runs-on: ubuntu-latest\n\n  # Job que publica imagem Docker\n  publish:\n    permissions:\n      contents: read\n      packages: write       # GitHub Container Registry\n      id-token: write       # OIDC para cloud</pre><p><strong>Permissões por caso de uso:</strong></p><ul><li>Checkout simples: contents: read</li><li>Criar release/tag: contents: write</li><li>Comentar em PR: pull-requests: write</li><li>GitHub Packages (GHCR): packages: write</li><li>OIDC para cloud: id-token: write</li><li>Publicar em GitHub Pages: pages: write + id-token: write</li></ul>",
    },
  ],
  codeExamples: [
    {
      title: "CI completo — lint, test, build, docker push com OIDC",
      language: "yaml",
      code: `name: CI/CD

on:
push:
  branches: [main]
pull_request:
  branches: [main]

permissions:
contents: read

concurrency:
group: \${{ github.workflow }}-\${{ github.ref }}
cancel-in-progress: true

jobs:
lint-and-test:
  runs-on: ubuntu-latest
  timeout-minutes: 20
  steps:
    - uses: actions/checkout@v4

    - uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'

    - run: npm ci
    - run: npm run lint
    - run: npm test -- --coverage

    - uses: actions/upload-artifact@v4
      if: always()
      with:
        name: coverage
        path: coverage/

build-and-push:
  needs: [lint-and-test]
  runs-on: ubuntu-latest
  if: github.ref == 'refs/heads/main'
  permissions:
    contents: read
    id-token: write
    packages: write
  steps:
    - uses: actions/checkout@v4

    - uses: docker/setup-buildx-action@v3

    - uses: aws-actions/configure-aws-credentials@v4
      with:
        role-to-assume: \${{ vars.AWS_ROLE_ARN }}
        aws-region: us-east-1

    - run: |
        aws ecr get-login-password | docker login --username AWS \\
          --password-stdin \${{ vars.ECR_REGISTRY }}

    - uses: docker/build-push-action@v5
      with:
        push: true
        tags: \${{ vars.ECR_REGISTRY }}/app:\${{ github.sha }}
        cache-from: type=gha
        cache-to: type=gha,mode=max`,
      description: "Pipeline de produção com cache de npm, OIDC para ECR, concurrency e timeout.",
    },
  ],
  cheatsheet: {
    title: "GitHub Actions — Cheat Sheet completo",
    html: `<style>
.gacs-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:20px}
.gacs-head{font-size:9px;color:#64748b;letter-spacing:.14em;text-transform:uppercase;margin:14px 0 8px;padding-bottom:6px;border-bottom:1px solid #1e3a5f}
.gacs-grid{display:grid;gap:6px}
.gacs-grid-2{grid-template-columns:1fr 1fr}
.gacs-grid-3{grid-template-columns:1fr 1fr 1fr}
.gacs-card{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:10px 12px}
.gacs-title{color:#2088FF;font-size:11px;font-weight:700;margin-bottom:5px}
.gacs-code{font-size:10px;color:#64748b;line-height:1.8}
.gacs-kw{color:#4ade80}
.gacs-val{color:#f59e0b}
.gacs-comment{color:#475569}
</style>
<div class="gacs-wrap">
<p style="color:#e2e8f0;font-size:11px;font-weight:700;margin:0 0 4px;letter-spacing:.06em">GITHUB ACTIONS — CHEAT SHEET</p>

<div class="gacs-head">EVENTOS (on:)</div>
<div class="gacs-grid gacs-grid-3">
  <div class="gacs-card">
    <div class="gacs-title">push / pull_request</div>
    <div class="gacs-code">
      <span class="gacs-kw">on:</span><br>
      &nbsp;<span class="gacs-kw">push:</span><br>
      &nbsp;&nbsp;<span class="gacs-kw">branches:</span> [main]<br>
      &nbsp;&nbsp;<span class="gacs-kw">paths:</span> [src/**]<br>
      &nbsp;<span class="gacs-kw">pull_request:</span><br>
      &nbsp;&nbsp;<span class="gacs-kw">branches:</span> [main]
    </div>
  </div>
  <div class="gacs-card">
    <div class="gacs-title">schedule / dispatch</div>
    <div class="gacs-code">
      <span class="gacs-kw">on:</span><br>
      &nbsp;<span class="gacs-kw">schedule:</span><br>
      &nbsp;&nbsp;- cron: <span class="gacs-val">'0 2 * * 1'</span><br>
      &nbsp;<span class="gacs-kw">workflow_dispatch:</span><br>
      &nbsp;&nbsp;<span class="gacs-kw">inputs:</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span class="gacs-kw">env:</span> {type: choice}
    </div>
  </div>
  <div class="gacs-card">
    <div class="gacs-title">workflow_call</div>
    <div class="gacs-code">
      <span class="gacs-kw">on:</span><br>
      &nbsp;<span class="gacs-kw">workflow_call:</span><br>
      &nbsp;&nbsp;<span class="gacs-kw">inputs:</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span class="gacs-kw">service:</span> {type: string}<br>
      &nbsp;&nbsp;<span class="gacs-kw">secrets:</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span class="gacs-kw">TOKEN:</span> {required: true}
    </div>
  </div>
</div>

<div class="gacs-head">JOBS E STEPS</div>
<div class="gacs-grid gacs-grid-2">
  <div class="gacs-card">
    <div class="gacs-title">Job básico</div>
    <div class="gacs-code">
      <span class="gacs-kw">jobs:</span><br>
      &nbsp;<span class="gacs-kw">build:</span><br>
      &nbsp;&nbsp;<span class="gacs-kw">runs-on:</span> ubuntu-latest<br>
      &nbsp;&nbsp;<span class="gacs-kw">timeout-minutes:</span> 20<br>
      &nbsp;&nbsp;<span class="gacs-kw">needs:</span> [lint, test]<br>
      &nbsp;&nbsp;<span class="gacs-kw">if:</span> github.ref == 'refs/heads/main'<br>
      &nbsp;&nbsp;<span class="gacs-kw">environment:</span> production
    </div>
  </div>
  <div class="gacs-card">
    <div class="gacs-title">Steps — uses vs run</div>
    <div class="gacs-code">
      <span class="gacs-kw">steps:</span><br>
      &nbsp;- <span class="gacs-kw">uses:</span> actions/checkout@v4<br>
      &nbsp;- <span class="gacs-kw">uses:</span> actions/setup-node@v4<br>
      &nbsp;&nbsp;&nbsp;<span class="gacs-kw">with:</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="gacs-kw">node-version:</span> <span class="gacs-val">'20'</span><br>
      &nbsp;- <span class="gacs-kw">name:</span> Build<br>
      &nbsp;&nbsp;&nbsp;<span class="gacs-kw">id:</span> build-step<br>
      &nbsp;&nbsp;&nbsp;<span class="gacs-kw">run:</span> npm run build
    </div>
  </div>
</div>

<div class="gacs-head">MATRIX E CACHE</div>
<div class="gacs-grid gacs-grid-2">
  <div class="gacs-card">
    <div class="gacs-title">strategy.matrix</div>
    <div class="gacs-code">
      <span class="gacs-kw">strategy:</span><br>
      &nbsp;<span class="gacs-kw">fail-fast:</span> false<br>
      &nbsp;<span class="gacs-kw">matrix:</span><br>
      &nbsp;&nbsp;<span class="gacs-kw">node:</span> [18, 20, 22]<br>
      &nbsp;&nbsp;<span class="gacs-kw">os:</span> [ubuntu-latest, macos-latest]<br>
      <span class="gacs-kw">runs-on:</span> \${{ matrix.os }}<br>
      <span class="gacs-comment"># setup-node: matrix.node</span>
    </div>
  </div>
  <div class="gacs-card">
    <div class="gacs-title">Cache de dependências</div>
    <div class="gacs-code">
      <span class="gacs-kw">uses:</span> actions/setup-node@v4<br>
      <span class="gacs-kw">with:</span><br>
      &nbsp;<span class="gacs-kw">node-version:</span> <span class="gacs-val">'20'</span><br>
      &nbsp;<span class="gacs-kw">cache:</span> <span class="gacs-val">'npm'</span><br><br>
      <span class="gacs-comment"># cache chave manual:</span><br>
      hashFiles('**/package-lock.json')
    </div>
  </div>
</div>

<div class="gacs-head">SECRETS, VARS E OUTPUTS</div>
<div class="gacs-grid gacs-grid-3">
  <div class="gacs-card">
    <div class="gacs-title">Secrets</div>
    <div class="gacs-code">
      \${{ secrets.MY_SECRET }}<br><br>
      <span class="gacs-comment"># OIDC — sem secret:</span><br>
      <span class="gacs-kw">permissions:</span><br>
      &nbsp;<span class="gacs-kw">id-token:</span> write
    </div>
  </div>
  <div class="gacs-card">
    <div class="gacs-title">Vars (não sensíveis)</div>
    <div class="gacs-code">
      \${{ vars.APP_NAME }}<br>
      \${{ vars.REGISTRY_URL }}<br><br>
      <span class="gacs-comment"># env em runtime:</span><br>
      echo "K=V" &gt;&gt; $GITHUB_ENV
    </div>
  </div>
  <div class="gacs-card">
    <div class="gacs-title">Outputs entre jobs</div>
    <div class="gacs-code">
      <span class="gacs-comment"># step produtor:</span><br>
      echo "tag=v1" &gt;&gt; $GITHUB_OUTPUT<br><br>
      <span class="gacs-comment"># job consumidor:</span><br>
      needs.build.outputs.tag
    </div>
  </div>
</div>

<div class="gacs-head">CONDICIONAIS E CONTROLE</div>
<div class="gacs-grid gacs-grid-2">
  <div class="gacs-card">
    <div class="gacs-title">if: expressões</div>
    <div class="gacs-code">
      <span class="gacs-comment"># só na main</span><br>
      <span class="gacs-kw">if:</span> github.ref == 'refs/heads/main'<br><br>
      <span class="gacs-comment"># sempre (mesmo em falha)</span><br>
      <span class="gacs-kw">if:</span> always()<br><br>
      <span class="gacs-comment"># job anterior falhou</span><br>
      <span class="gacs-kw">if:</span> failure()
    </div>
  </div>
  <div class="gacs-card">
    <div class="gacs-title">Concorrência</div>
    <div class="gacs-code">
      <span class="gacs-kw">concurrency:</span><br>
      &nbsp;<span class="gacs-kw">group:</span> \${{ github.ref }}<br>
      &nbsp;<span class="gacs-kw">cancel-in-progress:</span> true<br><br>
      <span class="gacs-comment"># por workflow:</span><br>
      \${{ github.workflow }}-\${{ github.ref }}
    </div>
  </div>
</div>

<div class="gacs-head">PERMISSÕES — PRINCÍPIO DO MENOR PRIVILÉGIO</div>
<div class="gacs-grid gacs-grid-2">
  <div class="gacs-card">
    <div class="gacs-title">Permissões por caso de uso</div>
    <div class="gacs-code">
      <span class="gacs-kw">permissions:</span><br>
      &nbsp;<span class="gacs-kw">contents:</span> read &nbsp;&nbsp;&nbsp;&nbsp;<span class="gacs-comment"># checkout</span><br>
      &nbsp;<span class="gacs-kw">contents:</span> write &nbsp;&nbsp;&nbsp;<span class="gacs-comment"># release</span><br>
      &nbsp;<span class="gacs-kw">packages:</span> write &nbsp;&nbsp;&nbsp;<span class="gacs-comment"># GHCR</span><br>
      &nbsp;<span class="gacs-kw">id-token:</span> write &nbsp;&nbsp;&nbsp;<span class="gacs-comment"># OIDC</span><br>
      &nbsp;<span class="gacs-kw">pull-requests:</span> write <span class="gacs-comment"># PR comment</span>
    </div>
  </div>
  <div class="gacs-card">
    <div class="gacs-title">Contextos principais</div>
    <div class="gacs-code">
      \${{ github.sha }} &nbsp;&nbsp;<span class="gacs-comment"># commit hash</span><br>
      \${{ github.ref }} &nbsp;&nbsp;<span class="gacs-comment"># refs/heads/main</span><br>
      \${{ github.actor }} &nbsp;<span class="gacs-comment"># username</span><br>
      \${{ runner.os }} &nbsp;&nbsp;&nbsp;<span class="gacs-comment"># Linux/macOS</span><br>
      \${{ github.token }} &nbsp;<span class="gacs-comment"># GITHUB_TOKEN</span>
    </div>
  </div>
</div>
</div>`,
  },
  resources: [
    { title: "GitHub Actions Documentation", url: "https://docs.github.com/en/actions", kind: "docs" },
    { title: "Security hardening for Actions", url: "https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions", kind: "docs" },
    { title: "GitHub Actions — Contextos", url: "https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/accessing-contextual-information-about-workflow-runs", kind: "docs" },
    { title: "OIDC com AWS — tutorial completo", url: "https://docs.github.com/en/actions/security-for-github-actions/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services", kind: "docs" },
    { title: "actions-runner-controller (ARC) — K8s", url: "https://github.com/actions/actions-runner-controller", kind: "docs" },
    { title: "Awesome Actions", url: "https://github.com/sdras/awesome-actions", kind: "pratica" },
    { title: "act — rodar Actions localmente", url: "https://github.com/nektos/act", kind: "pratica" },
    { title: "semantic-release", url: "https://semantic-release.gitbook.io/", kind: "docs" },
  ],
  videos: [
    { title: "GitHub Actions in 100 Seconds", channel: "Fireship", url: "https://www.youtube.com/watch?v=eB0nUzAI7M8", topic: "visão geral", note: "Melhor introdução rápida ao conceito. Assista antes de qualquer coisa." },
    { title: "GitHub Actions Tutorial — Full Course", channel: "TechWorld with Nana", url: "https://www.youtube.com/watch?v=R8_veQiYBjI", topic: "tutorial completo", note: "Cobertura completa da prática: eventos, jobs, steps, secrets, artifacts, deploy." },
    { title: "Securing GitHub Actions — OIDC e permissões", channel: "GitHub", url: "https://www.youtube.com/watch?v=4IaNejZ1vKE", topic: "segurança / OIDC", note: "Demonstração oficial de OIDC com AWS, GCP e Azure. Essencial para eliminar access keys." },
  ],
}

export default githubActions
