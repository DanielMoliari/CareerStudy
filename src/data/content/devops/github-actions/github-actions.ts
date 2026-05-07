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
    {
      title: "Reusable workflow para CI por serviço (chamado pelo monorepo)",
      language: "yaml",
      code: `# .github/workflows/service-ci.yaml — reusable workflow
name: Service CI

on:
workflow_call:
  inputs:
    service:
      type: string
      required: true
    node-version:
      type: string
      default: '20'
  secrets:
    NPM_TOKEN:
      required: false
  outputs:
    image-tag:
      description: 'Tag da imagem Docker construída'
      value: \${{ jobs.build.outputs.tag }}

permissions:
contents: read

jobs:
test:
  runs-on: ubuntu-latest
  timeout-minutes: 15
  defaults:
    run:
      working-directory: services/\${{ inputs.service }}
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: \${{ inputs.node-version }}
        cache: 'npm'
        cache-dependency-path: services/\${{ inputs.service }}/package-lock.json
    - run: npm ci
    - run: npm test

build:
  needs: [test]
  runs-on: ubuntu-latest
  outputs:
    tag: \${{ steps.meta.outputs.tag }}
  steps:
    - uses: actions/checkout@v4
    - id: meta
      run: |
        SHORT=\${GITHUB_SHA:0:7}
        echo "tag=\${{ inputs.service }}-\$SHORT" >> $GITHUB_OUTPUT

# .github/workflows/main.yaml — caller no monorepo
jobs:
detect:
  runs-on: ubuntu-latest
  outputs:
    services: \${{ steps.filter.outputs.changes }}
  steps:
    - uses: actions/checkout@v4
    - id: filter
      uses: dorny/paths-filter@v3
      with:
        filters: |
          api: 'services/api/**'
          worker: 'services/worker/**'
          web: 'services/web/**'

ci:
  needs: [detect]
  if: needs.detect.outputs.services != '[]'
  strategy:
    fail-fast: false
    matrix:
      service: \${{ fromJson(needs.detect.outputs.services) }}
  uses: ./.github/workflows/service-ci.yaml
  with:
    service: \${{ matrix.service }}`,
      description: "Padrão de monorepo: detecta serviços alterados via paths-filter e roda CI só dos afetados via reusable workflow + matrix dinâmica.",
    },
    {
      title: "OIDC com AWS — autenticação sem access key estática",
      language: "yaml",
      code: `# .github/workflows/deploy.yaml
name: Deploy

on:
push:
  branches: [main]

# Permissões mínimas no nível do workflow
permissions:
contents: read

jobs:
deploy:
  runs-on: ubuntu-latest
  environment: production       # gates de aprovação manual
  permissions:
    id-token: write             # emitir token OIDC
    contents: read
  steps:
    - uses: actions/checkout@v4

    # GitHub emite JWT, AWS STS valida e devolve credencial temporária
    - uses: aws-actions/configure-aws-credentials@v4
      with:
        role-to-assume: arn:aws:iam::123456789012:role/github-deploy
        role-session-name: github-actions-\${{ github.run_id }}
        aws-region: us-east-1
        # Sem secrets! Trust policy do role restringe ao repo:branch específicos

    - run: aws sts get-caller-identity   # confirma identidade
    - run: aws s3 sync ./dist s3://meu-bucket-prod/
    - run: aws cloudfront create-invalidation --distribution-id E123 --paths "/*"

# ─── Trust policy do IAM role no AWS (lado da AWS, não do workflow) ───
# {
#   "Version": "2012-10-17",
#   "Statement": [{
#     "Effect": "Allow",
#     "Principal": { "Federated": "arn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com" },
#     "Action": "sts:AssumeRoleWithWebIdentity",
#     "Condition": {
#       "StringEquals": {
#         "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
#       },
#       "StringLike": {
#         # ← restrição CRÍTICA: só este repo, só esta branch
#         "token.actions.githubusercontent.com:sub": "repo:minha-org/meu-repo:ref:refs/heads/main"
#       }
#     }
#   }]
# }`,
      description: "OIDC elimina access keys estáticas. A trust policy com `sub` restringe quem pode assumir o role — sem essa restrição, qualquer repositório poderia.",
    },
    {
      title: "Padrão seguro para PRs de fork — dois workflows isolados",
      language: "yaml",
      code: `# .github/workflows/pr-test.yaml
# Roda no contexto do fork — SEM acesso a secrets (seguro)
name: PR Test (sandboxed)

on:
pull_request:
  branches: [main]

permissions:
contents: read

jobs:
test:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4   # checkout do código DO PR (do fork)
    - uses: actions/setup-node@v4
      with: { node-version: '20', cache: 'npm' }
    - run: npm ci
    - run: npm test -- --json --outputFile=results.json
    # Upload do resultado como artifact — sem secrets necessários
    - uses: actions/upload-artifact@v4
      with:
        name: test-results-\${{ github.event.pull_request.number }}
        path: results.json

# .github/workflows/pr-comment.yaml
# Roda no contexto da BASE — TEM acesso a secrets
# NÃO faz checkout do código do fork — só processa o artifact gerado
name: PR Comment

on:
workflow_run:
  workflows: ['PR Test (sandboxed)']
  types: [completed]

permissions:
pull-requests: write
contents: read
actions: read

jobs:
comment:
  if: github.event.workflow_run.conclusion == 'success'
  runs-on: ubuntu-latest
  steps:
    # Baixa artifact do workflow anterior — sem executar código do fork
    - uses: actions/download-artifact@v4
      with:
        name: test-results-\${{ github.event.workflow_run.pull_request.number }}
        run-id: \${{ github.event.workflow_run.id }}
        github-token: \${{ secrets.GITHUB_TOKEN }}

    # Processa o JSON e comenta — código do mantenedor, não do fork
    - uses: actions/github-script@v7
      with:
        script: |
          const results = require('./results.json')
          const body = \`Tests: \${results.numPassedTests}/\${results.numTotalTests} passed\`
          github.rest.issues.createComment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: context.payload.workflow_run.pull_request.number,
            body
          })`,
      description: "Resolve o dilema do pull_request_target: o workflow que executa código do fork roda sem secrets; o que precisa de secrets nunca executa código do fork. Padrão recomendado pela equipe de segurança do GitHub.",
    },
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
    {
      q: "Por que pinar actions de terceiros por SHA em vez de tag (v3, v4)?",
      level: "senior",
      a: "<p>Tags em Git são mutáveis — o mantenedor pode mover <code>v3</code> para apontar para qualquer commit, incluindo um malicioso. Já aconteceu em incidentes reais (tj-actions/changed-files em 2025, vários outros). Quando você usa <code>uses: org/action@v3</code>, está confiando que o mantenedor nunca vai (1) ser comprometido, (2) ser malicioso, (3) errar.</p><p>SHA de commit é imutável: <code>uses: org/action@a1b2c3d4...</code> sempre aponta para o mesmo commit. Se o mantenedor for comprometido e push de uma versão maliciosa, sua build continua usando a versão antiga.</p><pre style='font-size:10px;color:#4ade80'># ❌ vulnerável\nuses: actions/checkout@v4\n\n# ✅ seguro\nuses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11  # v4.1.1</pre><p>Para gerenciar atualizações: Dependabot ou Renovate atualizam SHAs automaticamente em PRs (com release notes), mantendo a segurança sem manutenção manual.</p><p><strong>Exceções razoáveis</strong>: actions oficiais do GitHub (org actions/) têm processo de revisão mais rigoroso e autoriadade clara — algumas equipes aceitam pin por tag major nessas. Para qualquer action de terceiro, sempre SHA.</p>",
      tip: "Esse é o controle de segurança que separa equipes maduras de imaturas. Mencione Dependabot/Renovate para mostrar que entende o trade-off entre segurança e manutenção.",
    },
    {
      q: "Como usar matrix dinâmica para testar combinações geradas em runtime?",
      level: "senior",
      a: "<p>Matrix estática é declarada no YAML: <code>matrix: { node: [18, 20, 22] }</code>. Matrix dinâmica é gerada por um job anterior e consumida via <code>fromJson()</code> — útil quando as combinações dependem do que mudou no PR ou da configuração externa.</p><pre style='font-size:10px;color:#4ade80'>jobs:\n  # Job 1: produz a matrix\n  generate:\n    runs-on: ubuntu-latest\n    outputs:\n      matrix: \${{ steps.set.outputs.matrix }}\n    steps:\n      - uses: actions/checkout@v4\n      - id: set\n        run: |\n          # Lê config, detecta mudanças, etc\n          MATRIX=$(jq -nc '{include: [\n            {service: \"api\", node: \"20\"},\n            {service: \"worker\", node: \"22\"}\n          ]}')\n          echo \"matrix=$MATRIX\" >> $GITHUB_OUTPUT\n\n  # Job 2: consome a matrix\n  test:\n    needs: [generate]\n    strategy:\n      fail-fast: false\n      matrix: \${{ fromJson(needs.generate.outputs.matrix) }}\n    runs-on: ubuntu-latest\n    steps:\n      - run: echo \"\${{ matrix.service }} on Node \${{ matrix.node }}\"</pre><p><strong>Casos de uso reais:</strong> CI de monorepo (rodar só serviços alterados), teste de matriz de versões definida em arquivo de config, scaling de testes baseado no tamanho do PR, divisão de suite de testes em N shards paralelos.</p>",
    },
    {
      q: "O que muda entre concurrency simples e concurrency com cancel-in-progress?",
      level: "pleno",
      a: "<p><code>concurrency: { group: 'X' }</code> sem <code>cancel-in-progress</code>: quando um workflow do mesmo grupo está rodando, novos runs ficam em fila. Quando o atual termina, o próximo da fila começa. Útil quando você não quer cancelar trabalho em andamento (ex: deploy que está aplicando migrations).</p><p><code>concurrency: { group: 'X', cancel-in-progress: true }</code>: novo run cancela o anterior do mesmo grupo. Padrão para PRs — cada novo push deve cancelar o run anterior do mesmo PR (pushes rápidos não devem rodar 5 builds simultâneos).</p><pre style='font-size:10px;color:#4ade80'># Padrão para PRs — cancela runs anteriores\nconcurrency:\n  group: \${{ github.workflow }}-\${{ github.ref }}\n  cancel-in-progress: true\n\n# Padrão para deploy de produção — fila, não cancela\nconcurrency:\n  group: deploy-prod\n  # cancel-in-progress: false (default)</pre><p><strong>Gotcha:</strong> em workflows de deploy, cancel-in-progress pode deixar o sistema em estado inconsistente (deploy parou no meio). Para deploys, prefira fila com timeout — uma run espera a anterior acabar.</p>",
    },
    {
      q: "Como funciona o sistema de Environments e quando usar?",
      level: "pleno",
      a: "<p>Environments são namespaces de configuração com proteções específicas — projetados para deploy. Cada environment tem: secrets/vars próprios, regras de proteção (revisores obrigatórios, branch policy, wait timer) e histórico de deploys.</p><p><strong>O que ganha</strong>:</p><ul><li><strong>Aprovação manual</strong>: jobs com <code>environment: production</code> pausam e aguardam aprovação dos revisores configurados antes de rodar</li><li><strong>Branch policy</strong>: só permite deploy a partir de branches específicas (main, release/**)</li><li><strong>Secrets escopados</strong>: AWS_PROD_ROLE só está disponível em jobs do environment 'production'</li><li><strong>Wait timer</strong>: aguarda N minutos antes de rodar (cooldown entre deploys consecutivos)</li><li><strong>Histórico</strong>: UI do GitHub mostra cronologia de deploys por environment</li></ul><pre style='font-size:10px;color:#4ade80'>jobs:\n  deploy:\n    environment:\n      name: production\n      url: https://api.minha-app.com\n    steps:\n      - run: ./deploy.sh</pre><p>Use Environments para qualquer deploy de produção/staging — é o mecanismo nativo de gates de aprovação. Para staging sem aprovação, declare o environment mas sem reviewers — você ganha secrets escopados sem o gate.</p>",
    },
    {
      q: "Como implementar testes paralelos com sharding em GitHub Actions?",
      level: "senior",
      a: "<p>Para suítes de teste grandes (1000+ testes), rodar em um único job demora muito. Sharding divide a suite em N partes que rodam em paralelo, cortando tempo total quase linearmente.</p><pre style='font-size:10px;color:#4ade80'>jobs:\n  test:\n    strategy:\n      fail-fast: false\n      matrix:\n        shard: [1, 2, 3, 4]   # 4 shards paralelos\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n      - run: npm ci\n      # Jest: --shard=N/total\n      - run: npm test -- --shard=\${{ matrix.shard }}/4\n      \n      # Upload do resultado parcial como artifact\n      - uses: actions/upload-artifact@v4\n        if: always()\n        with:\n          name: coverage-\${{ matrix.shard }}\n          path: coverage/\n\n  # Job que merge os coverages parciais\n  coverage:\n    needs: [test]\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/download-artifact@v4\n      - run: npx nyc merge coverage merged.json\n      - run: npx nyc report -t merged --reporter=lcov</pre><p><strong>Frameworks que suportam sharding nativo</strong>: Jest (--shard), Playwright (--shard), Vitest (--shard), Mocha via plugin. Para custom: divida a lista de arquivos por hash do nome.</p><p><strong>Trade-off</strong>: cada shard paga overhead de checkout + setup-node + npm ci. Para suítes pequenas (&lt;5 min), sharding pode ser mais lento que rodar tudo junto.</p>",
    },
    {
      q: "Como gerenciar versões de actions internas em uma organização grande?",
      level: "senior",
      a: "<p>Em organizações com 50+ repositórios, manter actions reutilizáveis (composite ou reusable workflow) versionadas e atualizadas é desafio operacional.</p><p><strong>Estratégia recomendada</strong>:</p><ol><li><strong>Repositório central</strong>: <code>org/.github</code> ou <code>org/actions</code> com todas as composite actions e reusable workflows internos. Convenção: cada action em sua subpasta com versionamento próprio.</li><li><strong>Versionamento por tag major</strong>: actions internas usam tag <code>v1</code>, <code>v2</code> que aponta para o último commit dentro da major. Diferente de actions de terceiros (que devem ser SHA), actions internas com revisão controlada podem usar tag — você controla quem move a tag.</li><li><strong>Required workflows</strong>: usar a feature 'Required workflows' do GitHub Enterprise para forçar todos os repos da org a rodarem o pipeline padrão de security/compliance.</li><li><strong>Auto-update via Renovate</strong>: configure Renovate em todos os repos com regras para atualizar actions internas automaticamente — PRs abertos quando uma nova versão da action interna é tagueada.</li><li><strong>Documentação</strong>: cada action tem README.md no repo central com inputs, outputs, exemplos e changelog.</li></ol><pre style='font-size:10px;color:#4ade80'># Em qualquer repo da org\njobs:\n  ci:\n    uses: minhaorg/actions/.github/workflows/ci-padrao.yaml@v2\n    with:\n      service-name: api</pre><p><strong>Anti-pattern</strong>: copiar workflows entre repos. Quando você precisar atualizar (mudança de versão de Node, novo step de security), tem que abrir 50 PRs — fricção alta, drift inevitável.</p>",
    },
    {
      q: "Como passar dados entre jobs e como passar entre workflows diferentes?",
      level: "pleno",
      a: "<p>Existem mecanismos diferentes para cada caso.</p><p><strong>Entre steps do mesmo job</strong>: use <code>$GITHUB_OUTPUT</code> + step com <code>id</code>:</p><pre style='font-size:10px;color:#4ade80'>- id: meta\n  run: echo \"tag=v1.2.3\" &gt;&gt; $GITHUB_OUTPUT\n- run: echo \"Deploying \${{ steps.meta.outputs.tag }}\"</pre><p><strong>Entre jobs do mesmo workflow</strong>: declare <code>outputs:</code> no job produtor e acesse via <code>needs.JOB.outputs.NAME</code> no consumidor:</p><pre style='font-size:10px;color:#4ade80'>jobs:\n  build:\n    outputs:\n      tag: \${{ steps.meta.outputs.tag }}\n    steps:\n      - id: meta\n        run: echo \"tag=v1.2.3\" &gt;&gt; $GITHUB_OUTPUT\n  deploy:\n    needs: [build]\n    steps:\n      - run: echo \"\${{ needs.build.outputs.tag }}\"</pre><p><strong>Entre workflows diferentes (mesmo run)</strong>: reusable workflow declara <code>outputs:</code> no nível workflow_call. O caller consome via <code>needs.JOB.outputs.NAME</code>.</p><p><strong>Entre runs de workflows diferentes</strong>: artifacts (actions/upload-artifact + actions/download-artifact). Workflow A faz upload, workflow B (triggered por workflow_run) faz download. Útil para o pattern seguro de PR de fork.</p><p><strong>Entre executions distintas</strong>: usar repository variables (vars), repository dispatch, ou storage externo (S3, KV store). Para state que precisa persistir entre runs (ex: último deploy), uma issue do GitHub com label e body customizado funciona como 'banco de dados' simples.</p>",
    },
    {
      q: "O que são actions composite vs JS vs Docker e qual escolher?",
      level: "senior",
      a: "<p>Existem 3 tipos de actions, cada um com características diferentes.</p><p><strong>Composite action</strong>: declarada em <code>action.yaml</code> como uma sequência de steps (run: ou uses:). Roda no mesmo runner do job que a chama. Sem isolamento — acessa o mesmo workspace, env vars, etc. Mais leve e simples. Use para 80% dos casos: encapsular setup repetitivo, sequência de comandos.</p><pre style='font-size:10px;color:#4ade80'># action.yaml (composite)\nname: 'Setup Node Cache'\ninputs:\n  version: { default: '20' }\nruns:\n  using: 'composite'\n  steps:\n    - uses: actions/setup-node@v4\n      with: { node-version: \${{ inputs.version }}, cache: 'npm' }\n    - run: npm ci\n      shell: bash</pre><p><strong>JavaScript action</strong>: declarada em <code>action.yaml</code> com <code>runs: using: 'node20'</code>. Você compila um JS bundle (ncc) que executa diretamente no runner. Mais rápida (sem overhead de container). Use para lógica complexa que precisa de bibliotecas npm — interagir com APIs do GitHub, processar dados, etc.</p><pre style='font-size:10px;color:#4ade80'># action.yaml (JS)\nruns:\n  using: 'node20'\n  main: 'dist/index.js'</pre><p><strong>Docker action</strong>: declarada com <code>runs: using: 'docker'</code>. O runner builda ou pulla a imagem Docker e executa. Roda em container — isolamento completo, qualquer linguagem, qualquer toolchain. Use quando precisar de uma toolchain específica (Python, Go, ferramentas nativas) ou ambiente reproduzível.</p><pre style='font-size:10px;color:#4ade80'># action.yaml (Docker)\nruns:\n  using: 'docker'\n  image: 'Dockerfile'  # ou 'docker://alpine:3.18'</pre><p><strong>Trade-offs</strong>: Composite é mais simples e rápida (recomendada para a maioria). JS é a mais flexível para lógica programática. Docker é a mais isolada mas paga overhead de container — só para necessidade real.</p>",
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
    { title: "Reusable Workflows na prática", channel: "GitHub", url: "https://www.youtube.com/watch?v=pPyKMKMiyAA", topic: "reuso", note: "Diferenças práticas entre reusable workflow e composite action com exemplos reais de monorepo." },
    { title: "Supply Chain Security em GitHub Actions", channel: "Snyk", url: "https://www.youtube.com/watch?v=Z3Sc-1WgGmM", topic: "segurança", note: "Pin de SHA, pull_request_target, mitigation de actions comprometidas. Essencial pós-incidente tj-actions/changed-files." },
  ],
  exercises: [
    {
      level: "iniciante",
      title: "CI básico de Node.js com cache de npm",
      description: "Crie um workflow .github/workflows/ci.yaml que roda em push e pull_request para main. Use actions/setup-node@v4 com cache: 'npm'. Steps: checkout, setup-node, npm ci, npm run lint, npm test. Adicione timeout-minutes: 15 e permissions: contents: read. Verifique no UI do GitHub que o cache está sendo usado (segundo run deve ser >2x mais rápido).",
      concepts: ["workflow trigger", "actions/setup-node", "cache", "permissions"],
      hint: "Para o cache funcionar, é obrigatório existir package-lock.json. O segundo run deve mostrar 'Cache restored from key: ...' nos logs do step setup-node.",
    },
    {
      level: "intermediario",
      title: "Matrix de testes em múltiplas versões de Node.js",
      description: "Adapte seu workflow de CI para usar strategy.matrix testando em Node.js 18, 20 e 22 e em ubuntu-latest e macos-latest. Use fail-fast: false para que todas as combinações rodem mesmo se uma falhar. Use include para adicionar coverage: true apenas na combinação Node 20 + ubuntu-latest. Execute coverage só nessa combinação via if: matrix.coverage.",
      concepts: ["strategy.matrix", "include/exclude", "if conditional", "fail-fast"],
      hint: "matrix.os no runs-on: ${{ matrix.os }}. Para o cache funcionar com matrix, a chave deve incluir runner.os e matrix.node — caso contrário caches dos diferentes SOs colidem.",
    },
    {
      level: "intermediario",
      title: "OIDC com AWS — deploy sem access key",
      description: "Configure um IAM Identity Provider no AWS para o GitHub Actions OIDC. Crie um IAM role com trust policy que restringe a um repositório específico e à branch main. No workflow, declare permissions: id-token: write e use aws-actions/configure-aws-credentials@v4 com role-to-assume. Verifique com aws sts get-caller-identity que o assumed role aparece com session-name do GitHub.",
      concepts: ["OIDC federation", "IAM trust policy", "id-token permission", "STS"],
      hint: "Trust policy precisa de StringLike em token.actions.githubusercontent.com:sub para 'repo:org/repo:ref:refs/heads/main'. Sem essa restrição, qualquer repositório pode assumir o role. Use role-session-name: github-actions-${{ github.run_id }} para rastreabilidade.",
    },
    {
      level: "senior",
      title: "Monorepo CI com matrix dinâmica via paths-filter",
      description: "Em um monorepo com 3 serviços (services/api, services/worker, services/web), configure um workflow que: (1) job 'detect' usa dorny/paths-filter para identificar quais serviços mudaram; (2) job 'ci' depende de detect e usa matrix dinâmica via fromJson(needs.detect.outputs.services). Verifique que um PR que muda só services/api roda CI apenas para api — não para worker ou web.",
      concepts: ["change detection", "fromJson matrix", "reusable workflow", "monorepo"],
      hint: "paths-filter retorna uma lista JSON em outputs.changes. Combine com if: needs.detect.outputs.services != '[]' para pular o job inteiro quando nada relevante mudou. Para escalabilidade, refatore o ci em reusable workflow chamado por cada serviço.",
    },
    {
      level: "senior",
      title: "Pattern seguro para comentar em PRs de fork",
      description: "Implemente o pattern de dois workflows. Workflow 1 (pr-test.yaml): trigger pull_request, sem secrets, faz checkout do PR, roda testes, faz upload do resultado como artifact. Workflow 2 (pr-comment.yaml): trigger workflow_run com types: [completed], permissions pull-requests: write, faz download do artifact (sem checkout do código do fork) e comenta o resultado no PR. Demonstre que o segundo workflow nunca executa código do fork mesmo tendo acesso a secrets.",
      concepts: ["pull_request_target risk", "workflow_run trigger", "artifact pattern", "supply chain"],
      hint: "Use actions/upload-artifact e actions/download-artifact com a flag run-id para baixar de outro workflow run. O github-token no download deve ser passado explicitamente. NUNCA use actions/checkout no segundo workflow — esse é o ponto de RCE clássico do pull_request_target.",
    },
    {
      level: "senior",
      title: "Hardening completo de workflow de produção",
      description: "Audite e endureça um workflow de deploy de produção. Aplique: (1) permissions mínimas no nível do workflow (contents: read) e adições por job; (2) pin de TODAS as actions de terceiros por SHA completo; (3) environment: production com required reviewers configurados; (4) concurrency com group fixo (sem cancel-in-progress); (5) timeout-minutes razoável; (6) OIDC em vez de access keys; (7) Renovate ou Dependabot configurado para atualizar SHAs. Documente cada controle aplicado.",
      concepts: ["least privilege", "SHA pinning", "environments", "concurrency", "OIDC", "supply chain"],
      hint: "Para encontrar actions sem pin: grep -r 'uses:' .github/workflows | grep -v '@[a-f0-9]\\{40\\}' — qualquer linha com uses: que não tenha SHA de 40 caracteres é vulnerável. Renovate.json com 'pinDigests': true converte tags em SHAs automaticamente em PRs.",
    },
  ],
  mnemonics: [
    {
      label: "EJSR — anatomia do workflow",
      trick: "Evento → Job → Step → Runner",
      explanation: "A hierarquia completa de cima para baixo. Evento dispara o workflow (push, PR, schedule, workflow_dispatch). Workflow tem N Jobs (paralelos por padrão). Cada Job roda em um Runner (ubuntu-latest, self-hosted). Cada Job tem N Steps sequenciais (uses: action ou run: script). Lembrar essa cadeia evita confusão entre níveis — a maioria dos erros de configuração vem de não saber em qual nível declarar `if:`, `env:` ou `permissions:`.",
    },
    {
      label: "POPS — segurança mínima do workflow",
      trick: "Permissions, OIDC, Pin SHA, Secrets scoped",
      explanation: "Os 4 controles de segurança que TODO workflow de produção deve ter. Permissions: declarar `permissions: contents: read` no topo e adicionar só o necessário por job. OIDC: substituir access keys estáticos por federation com `id-token: write`. Pin SHA: actions de terceiros sempre com `@<sha-completo>`, nunca `@v1`. Secrets scoped: usar Environments para escopar segredos de produção e exigir aprovação manual.",
    },
    {
      label: "MCNT — performance de pipeline",
      trick: "Matrix, Cache, Needs, Timeout",
      explanation: "Os 4 controles para reduzir tempo e custo. Matrix: rodar em paralelo múltiplas versões/SOs com `strategy.matrix`. Cache: `actions/cache` com chave baseada em hashFiles do lockfile — economiza 2-4 min por build. Needs: orquestrar DAG de dependências para que jobs independentes rodem em paralelo. Timeout: `timeout-minutes: 20` — sem isso, jobs travados consomem 6h (default) de minutos pagos.",
    },
    {
      label: "PRT — risco do pull_request_target",
      trick: "PR contexto = base, Run com secrets, Token cuidado",
      explanation: "As 3 verdades sobre `pull_request_target` que candidatos confundem. PR contexto = base: roda no contexto da branch base (main), não do PR — diferente de `pull_request`. Run com secrets: tem acesso a secrets, ao contrário de `pull_request` em PRs de forks. Token cuidado: NUNCA fazer checkout do código do fork e executar nesse workflow — RCE garantido. Use o pattern de dois workflows: um sem secrets que roda o código + upload artifact, outro com secrets que processa o artifact.",
    },
    {
      label: "GES-VR-SN — contextos principais",
      trick: "Github Env Secrets, Vars Runner, Steps Needs",
      explanation: "Os 7 contextos principais agrupados para memorização. github.*: metadados do evento (repo, ref, sha, actor, run_id, token). env.*: variáveis declaradas via env: ou exportadas para $GITHUB_ENV. secrets.*: segredos criptografados scoped por repo/org/environment. vars.*: variáveis não-sensíveis, visíveis em logs. runner.*: dados do runner (os, arch, temp). steps.*: outputs e conclusion de steps anteriores no mesmo job (precisa id:). needs.*: outputs e result de jobs em needs:.",
    },
  ],
  mindmap: {
    title: "GitHub Actions — ecossistema completo",
    html: `<style>
.gamm-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.gamm-h{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:8px}
.gamm-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:12px}
.gamm-cat{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px 14px;border-top:3px solid}
.gamm-list{font-size:10px;color:#94a3b8;line-height:1.8}
.gamm-list strong{color:#e2e8f0}
.gamm-list span{color:#64748b}
.gamm-pill{display:inline-block;font-size:9px;background:#0f172a;border:1px solid #334155;border-radius:3px;padding:1px 6px;margin:2px 3px 0 0;color:#94a3b8}
</style>
<div class="gamm-wrap">
<p style="font-size:13px;font-weight:600;margin:0 0 4px">GitHub Actions — mapa mental completo</p>
<p style="font-size:10px;color:#64748b;margin:0 0 16px">Triggers, jobs, segurança e padrões avançados em uma visão única</p>

<div class="gamm-grid">
  <div class="gamm-cat" style="border-top-color:#2088FF">
    <div class="gamm-h" style="color:#2088FF">① Triggers</div>
    <div class="gamm-list">
      <strong>Code events</strong><br>
      <span class="gamm-pill">push</span><span class="gamm-pill">pull_request</span><span class="gamm-pill">pull_request_target</span><br>
      <strong style="display:block;margin-top:6px">Manual</strong>
      <span class="gamm-pill">workflow_dispatch</span><span class="gamm-pill">repository_dispatch</span><br>
      <strong style="display:block;margin-top:6px">Tempo</strong>
      <span class="gamm-pill">schedule (cron)</span><br>
      <strong style="display:block;margin-top:6px">Reuso</strong>
      <span class="gamm-pill">workflow_call</span><br>
      <strong style="display:block;margin-top:6px">Outros</strong>
      <span class="gamm-pill">release</span><span class="gamm-pill">issue</span><span class="gamm-pill">deployment_status</span>
    </div>
  </div>

  <div class="gamm-cat" style="border-top-color:#4ade80">
    <div class="gamm-h" style="color:#4ade80">② Estrutura</div>
    <div class="gamm-list">
      <strong>Workflow</strong> &mdash; .github/workflows/*.yaml<br>
      <span class="gamm-pill">on:</span><span class="gamm-pill">jobs:</span><span class="gamm-pill">env:</span><span class="gamm-pill">permissions:</span><br>
      <strong style="display:block;margin-top:6px">Job</strong>
      <span class="gamm-pill">runs-on</span><span class="gamm-pill">needs</span><span class="gamm-pill">if</span><span class="gamm-pill">strategy</span><span class="gamm-pill">environment</span><span class="gamm-pill">timeout-minutes</span><br>
      <strong style="display:block;margin-top:6px">Step</strong>
      <span class="gamm-pill">uses (action)</span><span class="gamm-pill">run (shell)</span><span class="gamm-pill">with (inputs)</span><span class="gamm-pill">id (output)</span>
    </div>
  </div>

  <div class="gamm-cat" style="border-top-color:#f59e0b">
    <div class="gamm-h" style="color:#f59e0b">③ Runners</div>
    <div class="gamm-list">
      <strong>GitHub-hosted</strong><br>
      <span class="gamm-pill">ubuntu-latest</span><span class="gamm-pill">windows-latest</span><span class="gamm-pill">macos-latest</span><br>
      <strong style="display:block;margin-top:6px">Larger runners</strong>
      <span class="gamm-pill">4/8/16/32 cores</span><span class="gamm-pill">ARM</span><span class="gamm-pill">GPU</span><br>
      <strong style="display:block;margin-top:6px">Self-hosted</strong>
      <span class="gamm-pill">ARC (K8s)</span><span class="gamm-pill">VM</span><span class="gamm-pill">EC2</span><br>
      <strong style="display:block;margin-top:6px">⚠ Risco</strong>
      <span style="color:#ef4444">PR de fork em self-hosted = RCE</span>
    </div>
  </div>

  <div class="gamm-cat" style="border-top-color:#a78bfa">
    <div class="gamm-h" style="color:#a78bfa">④ Reuso</div>
    <div class="gamm-list">
      <strong>Action types</strong><br>
      <span class="gamm-pill">JS action</span><span class="gamm-pill">Composite</span><span class="gamm-pill">Docker</span><br>
      <strong style="display:block;margin-top:6px">Reusable workflow</strong>
      <span style="color:#64748b">workflow_call — pipeline completo</span><br>
      <strong style="display:block;margin-top:6px">Composite action</strong>
      <span style="color:#64748b">action.yaml — bloco de steps</span><br>
      <strong style="display:block;margin-top:6px">Marketplace</strong>
      <span class="gamm-pill">actions/checkout</span><span class="gamm-pill">setup-node</span><span class="gamm-pill">cache</span>
    </div>
  </div>

  <div class="gamm-cat" style="border-top-color:#ef4444">
    <div class="gamm-h" style="color:#ef4444">⑤ Segurança</div>
    <div class="gamm-list">
      <strong>Permissions</strong><br>
      <span class="gamm-pill">contents</span><span class="gamm-pill">id-token</span><span class="gamm-pill">packages</span><span class="gamm-pill">pull-requests</span><br>
      <strong style="display:block;margin-top:6px">OIDC</strong>
      <span style="color:#64748b">AWS / GCP / Azure / HashiCorp Vault</span><br>
      <strong style="display:block;margin-top:6px">Hardening</strong>
      <span class="gamm-pill">Pin SHA</span><span class="gamm-pill">Environments</span><span class="gamm-pill">Branch policy</span><br>
      <strong style="display:block;margin-top:6px">⚠ Anti-pattern</strong>
      <span style="color:#ef4444">pull_request_target + checkout do fork</span>
    </div>
  </div>

  <div class="gamm-cat" style="border-top-color:#38bdf8">
    <div class="gamm-h" style="color:#38bdf8">⑥ Performance</div>
    <div class="gamm-list">
      <strong>Cache</strong><br>
      <span class="gamm-pill">actions/cache</span><span class="gamm-pill">setup-node cache</span><span class="gamm-pill">type=gha (Docker)</span><br>
      <strong style="display:block;margin-top:6px">Paralelismo</strong>
      <span class="gamm-pill">strategy.matrix</span><span class="gamm-pill">jobs sem needs</span><br>
      <strong style="display:block;margin-top:6px">Concurrency</strong>
      <span class="gamm-pill">cancel-in-progress</span><span class="gamm-pill">group: ref</span><br>
      <strong style="display:block;margin-top:6px">Limites</strong>
      <span class="gamm-pill">timeout-minutes</span>
    </div>
  </div>
</div>

<div class="gamm-grid" style="grid-template-columns:1fr 1fr">
  <div class="gamm-cat" style="border-top-color:#22c55e">
    <div class="gamm-h" style="color:#22c55e">⑦ Contextos &amp; expressões</div>
    <div class="gamm-list">
      <span class="gamm-pill">github.*</span> ref, sha, event, actor, run_id, token<br>
      <span class="gamm-pill">env.*</span> variáveis do workflow/job/step<br>
      <span class="gamm-pill">secrets.*</span> criptografados, scoped<br>
      <span class="gamm-pill">vars.*</span> não-sensíveis, visíveis<br>
      <span class="gamm-pill">runner.*</span> os, arch, temp, tool_cache<br>
      <span class="gamm-pill">steps.*</span> outputs, conclusion (precisa id)<br>
      <span class="gamm-pill">needs.*</span> outputs, result de jobs anteriores<br>
      <strong style="display:block;margin-top:6px">Funções</strong>
      <span class="gamm-pill">hashFiles()</span><span class="gamm-pill">contains()</span><span class="gamm-pill">startsWith()</span><span class="gamm-pill">fromJson()</span><span class="gamm-pill">toJson()</span><span class="gamm-pill">format()</span><br>
      <strong style="display:block;margin-top:6px">Status checks</strong>
      <span class="gamm-pill">success()</span><span class="gamm-pill">failure()</span><span class="gamm-pill">always()</span><span class="gamm-pill">cancelled()</span>
    </div>
  </div>

  <div class="gamm-cat" style="border-top-color:#f97316">
    <div class="gamm-h" style="color:#f97316">⑧ Padrões avançados</div>
    <div class="gamm-list">
      <strong>Monorepo CI</strong><br>
      <span style="color:#64748b">paths-filter + matrix dinâmica via fromJson</span><br>
      <strong style="display:block;margin-top:6px">Release automation</strong>
      <span class="gamm-pill">semantic-release</span><span class="gamm-pill">release-please</span><br>
      <strong style="display:block;margin-top:6px">Deploy &amp; rollback</strong>
      <span style="color:#64748b">smoke test + step de rollback com if: failure()</span><br>
      <strong style="display:block;margin-top:6px">Diagnóstico</strong>
      <span class="gamm-pill">ACTIONS_STEP_DEBUG=true</span><span class="gamm-pill">act (local)</span><br>
      <strong style="display:block;margin-top:6px">Compliance</strong>
      <span class="gamm-pill">Required workflows</span><span class="gamm-pill">CODEOWNERS</span><span class="gamm-pill">Branch protection</span>
    </div>
  </div>
</div>
</div>`,
    caption: "Os 8 grandes blocos do GitHub Actions: triggers, estrutura, runners, reuso, segurança, performance, contextos e padrões avançados. Use como índice mental antes de uma entrevista para garantir que você não esqueceu nenhuma área grande.",
  },
}

export default githubActions
