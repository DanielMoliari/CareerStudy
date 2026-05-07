import type { SkillContent } from '@/types'

const dockerCompose: SkillContent = {
  tagline: "Orquestrador local que sobe pilha inteira de containers com um único arquivo YAML.",
  why: "Docker Compose é o 'Kubernetes do desenvolvedor' — todo time backend usa pra rodar app + db + redis + worker localmente sem subir cluster real. Sênior precisa explicar quando o Compose basta e quando precisa migrar pra Kubernetes, montar pilha completa com healthcheck e dependências corretas, separar dev de prod com override files, isolar redes pra emular VPC, usar profiles pra ambientes opcionais e debugar service discovery via DNS interno. Cai em entrevista de DevOps, backend e fullstack — quem não sabe Compose perde a primeira pergunta de infra local.",
  prerequisite: "Docker básico (run, build, image, container, volume, network), YAML básico (indentação correta, listas, mapas), terminal Linux/macOS (cd, ls, env vars), entender o conceito de processo isolado e port mapping. Se você sabe rodar um docker run com -p e -v, está pronto.",
  summary: "Docker Compose lê um compose.yaml que descreve serviços (containers), networks, volumes e dependências em formato declarativo. Um docker compose up sobe tudo em uma rede comum onde os serviços se enxergam por nome via DNS interno (api fala com db usando hostname db). Suporta variáveis de ambiente via .env, override files (compose.override.yaml carregado automático), healthchecks pra orquestrar dependências reais, profiles pra ligar/desligar partes opcionais (debug, monitoring), e múltiplas networks pra isolamento. Em dev é onipresente; em prod single-host ainda aparece (sites pequenos, ambientes de staging); pra multi-host vira Swarm (em desuso), Kubernetes ou ECS. O comando moderno é docker compose (com espaço, plugin Go v2) — docker-compose com hífen é a v1 Python deprecated.",
  howToStudy: "<strong>Tem 30 minutos antes de uma entrevista?</strong> Revise o diagrama de anatomia do compose.yaml, varra os gotchas e treine as Q&As de nível pleno em voz alta. Se sobrar tempo, passe pelas de <strong>nível sênior</strong> sobre networks, profiles e estratégia dev vs prod.<br><br><strong>Tem um fim de semana?</strong> Leia os 3 diagramas em ordem (anatomia → dev/prod → networks). Com o terminal aberto, suba uma pilha de exemplo do Cookbook (frontend + api + postgres + redis), inspecione com docker compose ps, exec, logs. Force um healthcheck pra falhar e veja como depends_on espera. Mude environment via .env e re-suba.<br><br><strong>Tem uma semana?</strong> Siga a sequência completa. Construa do zero uma stack full-stack com profiles (dev, debug, monitoring), override files separando dev e prod, healthchecks reais, redes isoladas (frontend-net, backend-net, db-net) e valide que o frontend não alcança o DB direto. Rode em CI pra testes integrados. Compare a complexidade com o equivalente em Kubernetes pra entender quando vale subir.",
  diagrams: [
    {
      title: "Anatomia do compose.yaml — services, networks, volumes, profiles, depends_on",
      html: `<style>
.dc1-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.dc1-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(100,116,139,.5);display:inline}
.dc1-tip:hover .dc1-tb{display:block}
.dc1-tb{display:none;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:240px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.dc1-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
.dc1-key{color:#2496ED}
.dc1-str{color:#86efac}
.dc1-num{color:#fbbf24}
.dc1-com{color:#475569;font-style:italic}
</style>
<div class="dc1-wrap">
<p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">compose.yaml — anatomia comentada</p>
<p style="color:#475569;font-size:10px;margin:0 0 16px">Passe o mouse nos termos <span style="border-bottom:1px dashed rgba(100,116,139,.5)">sublinhados</span> para ver o que cada chave faz.</p>

<div style="background:#020617;border:1px solid #1e3a5f;border-radius:10px;padding:16px 18px;font-size:11.5px;line-height:1.85;color:#94a3b8">
  <span class="dc1-com"># compose.yaml — pilha completa</span><br>
  <span class="dc1-tip dc1-key">services<span class="dc1-tb">Bloco principal — cada chave aqui dentro é um container que será criado. O nome da chave (api, db, redis) vira o hostname DNS interno acessível pelos outros serviços na mesma rede.</span></span>:<br>
  &nbsp;&nbsp;<span class="dc1-key">api</span>:<br>
  &nbsp;&nbsp;&nbsp;&nbsp;<span class="dc1-tip dc1-key">build<span class="dc1-tb">Compila imagem local a partir de um Dockerfile. Pode ser caminho simples (./api) ou objeto detalhado com context, dockerfile, args, target. Use em dev; em prod pull de registry.</span></span>: <span class="dc1-str">./api</span><br>
  &nbsp;&nbsp;&nbsp;&nbsp;<span class="dc1-tip dc1-key">image<span class="dc1-tb">Nome da imagem — se build estiver presente, salva com este nome. Caso contrário, pull do registry. Sempre pin por SHA ou tag semver — nunca latest em prod.</span></span>: <span class="dc1-str">myorg/api:1.2.3</span><br>
  &nbsp;&nbsp;&nbsp;&nbsp;<span class="dc1-tip dc1-key">ports<span class="dc1-tb">Mapeia porta-do-host:porta-do-container. Só exponha o que precisa fora. Comunicação interna entre serviços não precisa de ports — DNS interno resolve direto.</span></span>:<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- <span class="dc1-str">"3000:3000"</span><br>
  &nbsp;&nbsp;&nbsp;&nbsp;<span class="dc1-tip dc1-key">environment<span class="dc1-tb">Variáveis de ambiente do container. Pode ser inline (KEY: value) ou ler de .env via \${VAR}. Para secrets sensíveis use a chave secrets, não environment direto.</span></span>:<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="dc1-key">DATABASE_URL</span>: <span class="dc1-str">postgres://app:app@db:5432/app</span><br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="dc1-key">REDIS_URL</span>: <span class="dc1-str">redis://redis:6379</span><br>
  &nbsp;&nbsp;&nbsp;&nbsp;<span class="dc1-tip dc1-key">depends_on<span class="dc1-tb">Define ordem de start E (com condition: service_healthy) espera o serviço ficar SAUDÁVEL antes de subir o dependente. Sem condition, só espera o container iniciar — não a app estar pronta.</span></span>:<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="dc1-key">db</span>:<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="dc1-key">condition</span>: <span class="dc1-str">service_healthy</span><br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="dc1-key">redis</span>:<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="dc1-key">condition</span>: <span class="dc1-str">service_started</span><br>
  &nbsp;&nbsp;&nbsp;&nbsp;<span class="dc1-tip dc1-key">networks<span class="dc1-tb">Lista de redes onde o serviço participa. Por padrão, todos os serviços estão na mesma rede default. Defina redes explícitas para isolar: frontend-net (web+api), backend-net (api+db) — db nunca toca frontend.</span></span>:<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- <span class="dc1-key">backend-net</span><br>
  &nbsp;&nbsp;&nbsp;&nbsp;<span class="dc1-tip dc1-key">restart<span class="dc1-tb">Política de reinício. unless-stopped (restart sempre exceto se você parar manualmente) é o padrão saudável. always reinicia até em parada manual; on-failure só em exit !=0; no nunca.</span></span>: <span class="dc1-str">unless-stopped</span><br>
  <br>
  &nbsp;&nbsp;<span class="dc1-key">db</span>:<br>
  &nbsp;&nbsp;&nbsp;&nbsp;<span class="dc1-key">image</span>: <span class="dc1-str">postgres:16-alpine</span><br>
  &nbsp;&nbsp;&nbsp;&nbsp;<span class="dc1-key">environment</span>:<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="dc1-key">POSTGRES_PASSWORD</span>: <span class="dc1-str">\${DB_PASSWORD:?obrigatório}</span><br>
  &nbsp;&nbsp;&nbsp;&nbsp;<span class="dc1-tip dc1-key">healthcheck<span class="dc1-tb">Comando que o Docker executa periodicamente para checar se o serviço está saudável. test, interval, timeout, retries, start_period. Usado por depends_on com condition: service_healthy. Sem isso, depends_on é teatro.</span></span>:<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="dc1-key">test</span>: [<span class="dc1-str">"CMD-SHELL"</span>, <span class="dc1-str">"pg_isready -U app"</span>]<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="dc1-key">interval</span>: <span class="dc1-str">5s</span><br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="dc1-key">timeout</span>: <span class="dc1-str">3s</span><br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="dc1-key">retries</span>: <span class="dc1-num">10</span><br>
  &nbsp;&nbsp;&nbsp;&nbsp;<span class="dc1-key">volumes</span>:<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- <span class="dc1-tip dc1-str">db_data<span class="dc1-tb">Volume nomeado — sobrevive ao docker compose down. Apaga só com -v explícito. Para dados que não podem morrer (postgres, mysql).</span></span>:/var/lib/postgresql/data<br>
  <br>
  &nbsp;&nbsp;<span class="dc1-key">redis</span>:<br>
  &nbsp;&nbsp;&nbsp;&nbsp;<span class="dc1-key">image</span>: <span class="dc1-str">redis:7-alpine</span><br>
  <br>
  &nbsp;&nbsp;<span class="dc1-key">adminer</span>:<br>
  &nbsp;&nbsp;&nbsp;&nbsp;<span class="dc1-key">image</span>: <span class="dc1-str">adminer</span><br>
  &nbsp;&nbsp;&nbsp;&nbsp;<span class="dc1-tip dc1-key">profiles<span class="dc1-tb">Marca um serviço como opcional. docker compose up só sobe serviços sem profile (ou com profile ativo). Use --profile debug para ligar adminer/jaeger/mailhog. Mantem dev rápido por padrão.</span></span>: [<span class="dc1-str">debug</span>]<br>
  &nbsp;&nbsp;&nbsp;&nbsp;<span class="dc1-key">ports</span>:<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- <span class="dc1-str">"8080:8080"</span><br>
  <br>
  <span class="dc1-tip dc1-key">networks<span class="dc1-tb">Bloco top-level que declara redes customizadas. Cada rede é uma bridge isolada. Use driver: bridge (default) para single-host. Para multi-host: overlay (Swarm). Em prod isolada com varias redes você consegue emular o que VPC faz no cloud.</span></span>:<br>
  &nbsp;&nbsp;<span class="dc1-key">backend-net</span>:<br>
  &nbsp;&nbsp;&nbsp;&nbsp;<span class="dc1-key">driver</span>: <span class="dc1-str">bridge</span><br>
  <br>
  <span class="dc1-tip dc1-key">volumes<span class="dc1-tb">Bloco top-level que declara volumes nomeados. Bind mount (./src:/app) é referência de path; volume nomeado é storage gerenciado pelo Docker em /var/lib/docker/volumes/. Volume nomeado é portável — bind depende do host.</span></span>:<br>
  &nbsp;&nbsp;<span class="dc1-key">db_data</span>:
</div>

<div style="margin-top:14px;background:#1e293b;border-radius:8px;padding:12px 14px;border:1px solid #1e3a5f">
  <div style="font-size:9px;color:#2496ED;letter-spacing:.1em;font-weight:600;margin-bottom:8px;text-transform:uppercase">Ordem de subida com healthcheck</div>
  <div style="font-size:11px;color:#64748b;line-height:1.7">
    <span style="color:#fbbf24">▶</span> redis sobe → fica <span style="color:#86efac">started</span> imediato &nbsp;·&nbsp;
    <span style="color:#fbbf24">▶</span> db sobe → healthcheck roda a cada 5s → fica <span style="color:#86efac">healthy</span> quando pg_isready retorna 0 &nbsp;·&nbsp;
    <span style="color:#fbbf24">▶</span> api só sobe quando <strong>db está healthy E redis está started</strong>. Sem healthcheck, api subiria antes do db aceitar conexão e crasharia.
  </div>
</div>
</div>`,
      caption: "compose.yaml é declarativo: você descreve o estado desejado e o Compose reconcilia. As 4 chaves de topo (services, networks, volumes, configs/secrets) cobrem 95% dos casos. profiles e healthcheck são o que separa setup amador de profissional.",
    },
    {
      title: "Dev vs Prod — override files e estratégia de ambientes",
      html: `<style>
.dc2-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.dc2-card{background:#1e293b;border-radius:10px;padding:14px 16px;border:1px solid #334155}
.dc2-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(100,116,139,.5)}
.dc2-tip:hover .dc2-tb{display:block}
.dc2-tb{display:none;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:240px;pointer-events:none;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.dc2-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
</style>
<div class="dc2-wrap">
<p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Estratégia: 1 base + overrides por ambiente</p>
<p style="color:#475569;font-size:10px;margin:0 0 16px">Mantém DRY (Don't Repeat Yourself) — o que é igual fica em compose.yaml; o que muda fica em arquivos sobrepostos.</p>

<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:14px">
  <div class="dc2-card" style="border-color:rgba(36,150,237,.3)">
    <div style="font-size:9px;color:#2496ED;letter-spacing:.1em;font-weight:600;margin-bottom:8px;text-transform:uppercase">compose.yaml (base)</div>
    <div style="font-size:10.5px;color:#94a3b8;line-height:1.7">
      <span style="color:#86efac">services:</span><br>
      &nbsp;&nbsp;<span style="color:#2496ED">api:</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#86efac">image:</span> myapp/api<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#86efac">environment:</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#86efac">PORT:</span> 3000<br>
      <br>
      <span style="color:#475569;font-style:italic"># o que é igual em<br>todos os ambientes</span>
    </div>
  </div>

  <div class="dc2-card" style="border-color:rgba(74,222,128,.3)">
    <div style="font-size:9px;color:#4ade80;letter-spacing:.1em;font-weight:600;margin-bottom:8px;text-transform:uppercase">compose.override.yaml (DEV)</div>
    <div style="font-size:10.5px;color:#94a3b8;line-height:1.7">
      <span style="color:#86efac">services:</span><br>
      &nbsp;&nbsp;<span style="color:#2496ED">api:</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span class="dc2-tip" style="color:#86efac">build: .<span class="dc2-tb">Em dev, build local para refletir mudanças. Em prod, image pull de registry.</span></span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span class="dc2-tip" style="color:#86efac">volumes:<span class="dc2-tb">Hot reload — bind mount do código. Mudança local recarrega sem rebuild.</span></span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- ./api:/app<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#86efac">environment:</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#86efac">NODE_ENV:</span> development<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#86efac">DEBUG:</span> "*"<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#86efac">command:</span> npm run dev<br>
      <br>
      <span style="color:#475569;font-style:italic"># carregado<br>automaticamente</span>
    </div>
  </div>

  <div class="dc2-card" style="border-color:rgba(239,68,68,.3)">
    <div style="font-size:9px;color:#ef4444;letter-spacing:.1em;font-weight:600;margin-bottom:8px;text-transform:uppercase">compose.prod.yaml (PROD)</div>
    <div style="font-size:10.5px;color:#94a3b8;line-height:1.7">
      <span style="color:#86efac">services:</span><br>
      &nbsp;&nbsp;<span style="color:#2496ED">api:</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span class="dc2-tip" style="color:#86efac">image:<span class="dc2-tb">Pull de registry com tag SHA — reproducível. Nunca latest.</span></span> myorg/api:abc1234<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span class="dc2-tip" style="color:#86efac">deploy:<span class="dc2-tb">replicas + resources funcionam em Swarm. Em Compose puro, replicas são ignoradas — sobe 1 só.</span></span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#86efac">replicas:</span> 3<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#86efac">resources:</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#86efac">limits:</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#86efac">cpus:</span> '0.5'<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#86efac">memory:</span> 256M<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#86efac">restart:</span> always<br>
      <br>
      <span style="color:#475569;font-style:italic"># explícito via -f</span>
    </div>
  </div>
</div>

<div style="background:#020617;border:1px solid #1e3a5f;border-radius:10px;padding:14px 16px;font-size:11px;color:#94a3b8;line-height:1.85">
  <div style="font-size:9px;color:#2496ED;letter-spacing:.1em;font-weight:600;margin-bottom:8px;text-transform:uppercase">Comandos por ambiente</div>
  <div style="margin-bottom:6px"><strong style="color:#4ade80">$ docker compose up</strong> &nbsp;<span style="color:#475569">→ carrega compose.yaml + compose.override.yaml automaticamente (dev)</span></div>
  <div style="margin-bottom:6px"><strong style="color:#ef4444">$ docker compose -f compose.yaml -f compose.prod.yaml up -d</strong> &nbsp;<span style="color:#475569">→ base + prod, em background</span></div>
  <div><strong style="color:#fbbf24">$ docker compose --profile debug up</strong> &nbsp;<span style="color:#475569">→ liga serviços com profile debug (adminer, jaeger, mailhog)</span></div>
</div>

<div style="margin-top:12px;background:rgba(36,150,237,.06);border:1px solid rgba(36,150,237,.2);border-radius:8px;padding:11px 14px;font-size:11px;color:#94a3b8;line-height:1.6">
  <strong style="color:#2496ED">Regra do override:</strong> chaves do override <em>mergem</em> com a base — listas (volumes, ports) são <em>concatenadas</em>; mapas (environment) são <em>fundidos</em>. Para sobrescrever totalmente uma lista, use !reset (Compose v2.24+).
</div>
</div>`,
      caption: "Override files mantêm a regra Don't Repeat Yourself: o que é igual fica na base; o que muda fica em arquivos por ambiente. compose.override.yaml é mágico — Compose carrega automaticamente sem -f. compose.prod.yaml precisa de -f explícito.",
    },
    {
      title: "Networks — service discovery e isolamento via DNS interno",
      html: `<style>
.dc3-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.dc3-net{border-radius:10px;padding:14px 16px;border:1.5px dashed;position:relative}
.dc3-svc{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:8px 12px;font-size:11px;color:#e2e8f0;display:inline-block;margin:4px}
.dc3-arr{color:#475569;font-size:14px;display:inline-block;margin:0 6px}
@keyframes dc3-flow{0%,100%{transform:translateX(0);opacity:.4}50%{transform:translateX(8px);opacity:1}}
.dc3-flow{animation:dc3-flow 1.6s ease-in-out infinite;color:#2496ED;font-size:14px}
</style>
<div class="dc3-wrap">
<p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Networks no Compose — DNS interno e isolamento</p>
<p style="color:#475569;font-size:10px;margin:0 0 18px">Cada serviço vira hostname. Múltiplas redes = isolamento estilo VPC.</p>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px">
  <div>
    <div style="font-size:10px;color:#94a3b8;letter-spacing:.1em;font-weight:600;margin-bottom:8px;text-transform:uppercase">❌ Cenário ruim — rede default</div>
    <div class="dc3-net" style="border-color:rgba(239,68,68,.3);background:rgba(239,68,68,.04)">
      <div style="font-size:9px;color:#ef4444;font-weight:700;letter-spacing:.08em;margin-bottom:6px">DEFAULT (uma rede só)</div>
      <div>
        <span class="dc3-svc">frontend</span>
        <span class="dc3-svc">api</span>
        <span class="dc3-svc">db</span>
        <span class="dc3-svc">redis</span>
      </div>
      <div style="font-size:10px;color:#ef4444;margin-top:8px;line-height:1.5">⚠ frontend alcança db direto — vazamento se SSRF, atacante consegue saltar.</div>
    </div>
  </div>

  <div>
    <div style="font-size:10px;color:#94a3b8;letter-spacing:.1em;font-weight:600;margin-bottom:8px;text-transform:uppercase">✓ Cenário bom — redes isoladas</div>
    <div class="dc3-net" style="border-color:rgba(74,222,128,.3);background:rgba(74,222,128,.04);margin-bottom:8px">
      <div style="font-size:9px;color:#4ade80;font-weight:700;letter-spacing:.08em;margin-bottom:6px">FRONTEND-NET</div>
      <span class="dc3-svc">frontend</span>
      <span class="dc3-svc">api</span>
    </div>
    <div class="dc3-net" style="border-color:rgba(74,222,128,.3);background:rgba(74,222,128,.04)">
      <div style="font-size:9px;color:#4ade80;font-weight:700;letter-spacing:.08em;margin-bottom:6px">BACKEND-NET</div>
      <span class="dc3-svc">api</span>
      <span class="dc3-svc">db</span>
      <span class="dc3-svc">redis</span>
    </div>
    <div style="font-size:10px;color:#4ade80;margin-top:8px;line-height:1.5">✓ api é a ponte. frontend nunca vê db.</div>
  </div>
</div>

<div style="background:#020617;border:1px solid #1e3a5f;border-radius:10px;padding:14px 16px">
  <div style="font-size:9px;color:#2496ED;letter-spacing:.1em;font-weight:600;margin-bottom:10px;text-transform:uppercase">Como o DNS interno funciona — Service discovery</div>
  <div style="font-size:11px;color:#94a3b8;line-height:1.85;font-family:'JetBrains Mono',monospace">
    <div style="margin-bottom:8px"><span style="color:#2496ED">api</span> faz <code style="color:#fbbf24">fetch('http://db:5432')</code></div>
    <div style="margin-bottom:8px"><span class="dc3-flow">▶</span> Linux do container resolve <strong>db</strong> via DNS embutido do Docker (127.0.0.11)</div>
    <div style="margin-bottom:8px"><span class="dc3-flow">▶</span> Docker mapeia <strong>db</strong> → IP interno do container do serviço db (ex: 172.18.0.3)</div>
    <div><span class="dc3-flow">▶</span> Pacote sai pela bridge <strong>backend-net</strong> e chega ao container do db</div>
  </div>
</div>

<div style="margin-top:12px;display:grid;grid-template-columns:1fr 1fr;gap:10px">
  <div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:11px 13px">
    <div style="font-size:10px;color:#fbbf24;font-weight:700;margin-bottom:4px">DNS aliases</div>
    <div style="font-size:10px;color:#64748b;line-height:1.6">networks.backend-net.aliases: [database, primary] — múltiplos hostnames para o mesmo serviço.</div>
  </div>
  <div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:11px 13px">
    <div style="font-size:10px;color:#fbbf24;font-weight:700;margin-bottom:4px">External networks</div>
    <div style="font-size:10px;color:#64748b;line-height:1.6">networks.shared.external: true — usa rede já existente. Permite stacks separadas conversarem.</div>
  </div>
</div>
</div>`,
      caption: "Service discovery do Compose é mágica gratuita: cada serviço vira hostname acessível por todos na mesma rede. Mas isolamento é responsabilidade sua — separe redes pra emular a postura de uma VPC e validar que sua arquitetura sobrevive a um movimento lateral.",
    },
  ],
  keypoints: [
    {
      title: "Service discovery via DNS interno",
      body: "Serviços na mesma rede se acham pelo nome do serviço — Docker rodam um DNS interno (127.0.0.11) que mapeia hostname → IP do container. db:5432 resolve sem você configurar nada. Não precisa de IP fixo, /etc/hosts ou variável.",
      code: `# api fala com db pelo nome do serviço — sem IP
services:
api:
  environment:
    DATABASE_URL: postgres://app:app@db:5432/app
    REDIS_URL: redis://redis:6379

db:
  image: postgres:16-alpine

redis:
  image: redis:7-alpine`,
    },
    {
      title: "depends_on com healthcheck — espera real",
      body: "depends_on sozinho só espera o container iniciar — não espera a app responder. Combine com condition: service_healthy e healthcheck no serviço dependido. Sem isso, a api sobe antes do Postgres aceitar conexão e crasha no primeiro insert.",
      code: `services:
api:
  depends_on:
    db:
      condition: service_healthy   # espera healthcheck OK
    redis:
      condition: service_started   # só espera container iniciar

db:
  image: postgres:16-alpine
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U app"]
    interval: 5s
    timeout: 3s
    retries: 10
    start_period: 30s   # graça inicial — sem contar como falha`,
    },
    {
      title: "Volumes nomeados vs bind mounts",
      body: "Bind mount (./src:/app) referencia path do host — ótimo em dev pra hot reload. Volume nomeado (db_data:/var/lib/postgresql/data) é storage gerenciado pelo Docker em /var/lib/docker/volumes/ — sobrevive a docker compose down sem -v, é portável e tem performance melhor no Docker Desktop. Em prod, volume nomeado pra dado persistente; bind só pra config read-only.",
      code: `services:
api:
  volumes:
    - ./api:/app                    # bind: hot reload em dev
    - /app/node_modules             # volume anônimo: não sobrescreve
    - ./config:/etc/api:ro          # bind read-only para config

db:
  volumes:
    - db_data:/var/lib/postgresql/data   # volume nomeado: persistente

volumes:
db_data:                            # declaração obrigatória do volume nomeado`,
    },
    {
      title: "Profiles — partes opcionais da pilha",
      body: "profiles: [debug] num serviço o exclui do up padrão. docker compose --profile debug up liga. Útil pra adminer, mailhog, jaeger, prometheus que você só quer às vezes. Mantém o dev rápido por padrão.",
      code: `services:
api:
  image: myapp/api    # sem profile = sempre sobe

adminer:
  image: adminer
  profiles: [debug]   # só sobe com --profile debug

jaeger:
  image: jaegertracing/all-in-one
  profiles: [tracing] # só sobe com --profile tracing

mailhog:
  image: mailhog/mailhog
  profiles: [debug, dev-tools]   # liga com qualquer um

# uso:
# docker compose up                          → só api
# docker compose --profile debug up          → api + adminer + mailhog
# docker compose --profile tracing up        → api + jaeger`,
    },
    {
      title: "Override files — DRY entre ambientes",
      body: "Estratégia padrão: compose.yaml (base) + compose.override.yaml (dev, carregado automático) + compose.prod.yaml (via -f explícito). Mantém DRY — o que muda fica nos overrides; o resto fica na base. Listas concatenam, mapas mergem por chave.",
      code: `# compose.yaml — base
services:
api:
  image: myapp/api
  environment:
    PORT: 3000

# compose.override.yaml — dev (auto)
services:
api:
  build: .                          # sobrescreve image quando build local
  volumes:
    - ./api:/app                    # hot reload
  environment:
    NODE_ENV: development
    DEBUG: "*"                      # merga com PORT do base

# compose.prod.yaml — prod (explícito)
services:
api:
  image: myorg/api:abc1234          # SHA pin
  deploy:
    replicas: 3
    resources:
      limits: { cpus: '0.5', memory: 256M }
  restart: always

# uso:
# dev:  docker compose up                                          (auto)
# prod: docker compose -f compose.yaml -f compose.prod.yaml up -d`,
    },
    {
      title: "Networks customizadas — isolamento estilo VPC",
      body: "Por padrão tudo numa rede default. Em pilha grande, separe redes (frontend-net, backend-net, db-net) — emula VPC e valida que API pública não alcança DB direto. API fica em 2 redes (ponte). DB fica só em backend-net — frontend não consegue alcançar nem se quiser.",
      code: `services:
frontend:
  networks: [frontend-net]

api:
  networks: [frontend-net, backend-net]   # ponte entre as duas

db:
  networks: [backend-net]                  # isolada — frontend não vê

redis:
  networks: [backend-net]

networks:
frontend-net:
  driver: bridge
backend-net:
  driver: bridge
  internal: true                           # sem acesso à internet — extra seguro`,
    },
    {
      title: "Variáveis de ambiente e .env",
      body: "Compose lê .env do mesmo diretório automaticamente — variáveis podem ser usadas em qualquer lugar via \\${VAR}. Use \\${VAR:?obrigatório} para falhar se não definida, \\${VAR:-default} para fallback. Para múltiplos ambientes, use --env-file .env.prod.",
      code: `# .env (mesma pasta do compose.yaml)
DB_PASSWORD=secret
API_PORT=3000
LOG_LEVEL=info

# compose.yaml
services:
api:
  image: myapp/api:\${VERSION:-latest}     # default latest se não vier
  ports:
    - "\${API_PORT}:3000"
  environment:
    DB_PASSWORD: \${DB_PASSWORD:?obrigatório}    # falha se não definida
    LOG_LEVEL: \${LOG_LEVEL:-warn}               # default warn

# uso com env file customizado:
# docker compose --env-file .env.staging up`,
    },
    {
      title: "Build avançado — context, args, target, cache",
      body: "build pode ser objeto com mais controle: context (pasta), dockerfile (caminho), args (build-time), target (multi-stage), cache_from (acelera CI). Em CI, cache_from de imagem do registry economiza minutos.",
      code: `services:
api:
  build:
    context: ./api                # raiz do build
    dockerfile: Dockerfile.prod   # arquivo customizado
    target: production            # stage do multi-stage
    args:
      NODE_VERSION: "20"          # ARG dentro do Dockerfile
    cache_from:
      - myorg/api:cache           # acelera CI: pull e usa como cache
    tags:
      - myorg/api:latest
      - myorg/api:\${VERSION}`,
    },
    {
      title: "Healthcheck — comando, interval, retries, start_period",
      body: "healthcheck.test é o comando: ['CMD', 'curl', '-f', 'http://localhost/health'] (CMD = exec) ou ['CMD-SHELL', 'pg_isready'] (shell). interval = frequência. timeout = limite por check. retries = falhas pra marcar unhealthy. start_period = tempo de graça inicial sem contar como falha.",
      code: `services:
api:
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
    interval: 10s         # check a cada 10s
    timeout: 3s           # cada check até 3s
    retries: 3            # 3 falhas = unhealthy
    start_period: 40s     # primeiros 40s não contam (warmup)

db:
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U \${POSTGRES_USER:-postgres}"]
    interval: 5s
    timeout: 3s
    retries: 10
    start_period: 30s`,
    },
    {
      title: "Logs e debug — logs, exec, ps, top",
      body: "docker compose logs -f api segue logs do serviço. exec roda comando num container existente (shell, debug). ps lista o status. top mostra processos do container. Saber esses comandos é o básico de debug — todo dev backend usa diariamente.",
      code: `# segue logs em tempo real, com timestamp
docker compose logs -f --timestamps api

# logs das ultimas 100 linhas dos 3 serviços
docker compose logs --tail 100 api db redis

# shell dentro do container da api
docker compose exec api sh

# rodar query no postgres rodando
docker compose exec db psql -U app -c "SELECT 1"

# status de todos os serviços
docker compose ps

# processos rodando dentro de cada container
docker compose top`,
    },
    {
      title: "Secrets — não em environment direto",
      body: "Nunca coloque secret em environment direto — vaza em ps, em logs, em commits. Use o bloco secrets (Compose v3+) que monta arquivo em /run/secrets/<name>. Em prod sério: use Docker secrets (Swarm), Vault, AWS Secrets Manager, ou external secrets operator.",
      code: `# anti-pattern — vaza em logs e ps
services:
api:
  environment:
    DB_PASSWORD: super_secret_here   # ❌ vaza

# pattern correto — secret como arquivo montado
services:
api:
  secrets:
    - db_password
  environment:
    DB_PASSWORD_FILE: /run/secrets/db_password   # app lê arquivo

secrets:
db_password:
  file: ./secrets/db_password.txt    # local
  # OR external: true                # vindo do Swarm/cloud secret manager`,
    },
    {
      title: "Resource limits — CPU e memória",
      body: "Sem limit, container pode consumir todo recurso do host e derrubar outros (noisy neighbor). Use mem_limit, cpus em Compose v3 (deploy.resources funciona apenas em Swarm). Em dev local não precisa, mas em CI ou prod single-host é obrigatório.",
      code: `services:
api:
  image: myapp/api
  mem_limit: 512m              # limite de memória
  mem_reservation: 256m        # garantia mínima
  cpus: 0.5                    # 50% de 1 core
  pids_limit: 100              # limite de processos
  ulimits:
    nofile:
      soft: 1024
      hard: 4096`,
    },
    {
      title: "restart policies — quando reiniciar",
      body: "no = nunca (default). on-failure = só em exit code !=0. always = sempre, até em parada manual. unless-stopped = sempre exceto quando você parou explicitamente — escolha mais saudável pra dev e prod single-host.",
      code: `services:
api:
  restart: unless-stopped     # ✓ recomendado

worker:
  restart: on-failure:5       # max 5 retries em failure

one-shot-job:
  restart: "no"               # script que roda 1 vez
  command: ./migrate.sh

monitoring:
  restart: always             # mesmo se você parar manualmente`,
    },
  ],
  cheatsheet: {
    title: "Docker Compose — Cheat Sheet",
    html: `<style>
.dccs-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.dccs-card{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px 14px}
.dccs-cmd{color:#2496ED;font-size:11.5px;font-weight:700;margin-bottom:4px;font-family:'JetBrains Mono',monospace}
.dccs-desc{color:#64748b;font-size:10.5px;line-height:1.55}
.dccs-head{font-size:9px;color:#64748b;letter-spacing:.14em;text-transform:uppercase;margin:14px 0 8px;padding-bottom:6px;border-bottom:1px solid #1e3a5f}
</style>
<div style="font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:20px">
<p style="color:#e2e8f0;font-size:11px;font-weight:700;margin:0 0 14px;letter-spacing:.06em">DOCKER COMPOSE — CHEAT SHEET</p>

<div class="dccs-head">CICLO DE VIDA</div>
<div class="dccs-grid">
  <div class="dccs-card">
    <div class="dccs-cmd">docker compose up</div>
    <div class="dccs-desc">Sobe a pilha (foreground). -d em background. --build força rebuild. --remove-orphans remove serviços que sumiram do yaml.</div>
  </div>
  <div class="dccs-card">
    <div class="dccs-cmd">docker compose down</div>
    <div class="dccs-desc">Para e remove containers + redes. -v também remove volumes (cuidado em prod). --rmi all remove imagens.</div>
  </div>
  <div class="dccs-card">
    <div class="dccs-cmd">docker compose stop</div>
    <div class="dccs-desc">Para containers sem remover. Usa pra pausar e retomar. start retoma. restart faz stop+start.</div>
  </div>
  <div class="dccs-card">
    <div class="dccs-cmd">docker compose restart [svc]</div>
    <div class="dccs-desc">Reinicia serviço específico ou todos. Útil quando .env mudou e precisa repassar.</div>
  </div>
</div>

<div class="dccs-head">DEBUG E INSPEÇÃO</div>
<div class="dccs-grid">
  <div class="dccs-card">
    <div class="dccs-cmd">docker compose ps</div>
    <div class="dccs-desc">Lista serviços com status, portas e healthcheck. -a inclui parados.</div>
  </div>
  <div class="dccs-card">
    <div class="dccs-cmd">docker compose logs -f [svc]</div>
    <div class="dccs-desc">Segue logs. --tail 100 últimas linhas. -t com timestamps. Múltiplos serviços ao mesmo tempo.</div>
  </div>
  <div class="dccs-card">
    <div class="dccs-cmd">docker compose exec [svc] [cmd]</div>
    <div class="dccs-desc">Roda comando num container existente. exec api sh para shell. -T para non-tty (CI).</div>
  </div>
  <div class="dccs-card">
    <div class="dccs-cmd">docker compose top</div>
    <div class="dccs-desc">Mostra processos rodando dentro de cada container. Diagnóstico rápido de zumbi/loop.</div>
  </div>
  <div class="dccs-card">
    <div class="dccs-cmd">docker compose config</div>
    <div class="dccs-desc">Mostra a configuração final após merge de overrides e expansão de variáveis. Indispensável pra debugar.</div>
  </div>
  <div class="dccs-card">
    <div class="dccs-cmd">docker compose port [svc] [port]</div>
    <div class="dccs-desc">Mostra mapping efetivo. Útil quando porta foi alocada dinâmica (sem :container_port).</div>
  </div>
</div>

<div class="dccs-head">BUILD E IMAGENS</div>
<div class="dccs-grid">
  <div class="dccs-card">
    <div class="dccs-cmd">docker compose build [svc]</div>
    <div class="dccs-desc">Build sem subir. --no-cache ignora cache. --pull atualiza imagem base antes.</div>
  </div>
  <div class="dccs-card">
    <div class="dccs-cmd">docker compose pull</div>
    <div class="dccs-desc">Pull de todas as imagens declaradas. Útil antes de up em prod.</div>
  </div>
  <div class="dccs-card">
    <div class="dccs-cmd">docker compose push</div>
    <div class="dccs-desc">Push das imagens declaradas para o registry. Usado em CI após build.</div>
  </div>
  <div class="dccs-card">
    <div class="dccs-cmd">docker compose images</div>
    <div class="dccs-desc">Lista imagens dos serviços com tag e tamanho.</div>
  </div>
</div>

<div class="dccs-head">FLAGS E OVERRIDES</div>
<div class="dccs-grid">
  <div class="dccs-card">
    <div class="dccs-cmd">-f file1.yaml -f file2.yaml</div>
    <div class="dccs-desc">Múltiplos arquivos. Ordem importa — arquivos posteriores sobrescrevem.</div>
  </div>
  <div class="dccs-card">
    <div class="dccs-cmd">--profile debug --profile mon</div>
    <div class="dccs-desc">Liga serviços marcados com profile. Múltiplos profiles aceitos.</div>
  </div>
  <div class="dccs-card">
    <div class="dccs-cmd">--env-file .env.prod</div>
    <div class="dccs-desc">Carrega arquivo .env customizado. Default é .env do diretório.</div>
  </div>
  <div class="dccs-card">
    <div class="dccs-cmd">-p projectname</div>
    <div class="dccs-desc">Nome do projeto (prefixo de containers/networks). Default é o nome da pasta.</div>
  </div>
</div>

<div class="dccs-head">YAML — REFERÊNCIA RÁPIDA</div>
<div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px 14px;font-size:10.5px;color:#64748b;line-height:1.85">
  <strong style="color:#2496ED">services.&lt;name&gt;:</strong> image | build | ports | environment | volumes | depends_on | networks | profiles | restart | healthcheck | command | entrypoint | working_dir | user | cap_add | tmpfs | secrets | mem_limit | cpus<br>
  <strong style="color:#2496ED">networks.&lt;name&gt;:</strong> driver (bridge/overlay/host) | internal: true | external: true | ipam<br>
  <strong style="color:#2496ED">volumes.&lt;name&gt;:</strong> driver (local) | external: true | driver_opts<br>
  <strong style="color:#2496ED">secrets.&lt;name&gt;:</strong> file: ./secret.txt | external: true
</div>
</div>`,
  },
  mindmap: {
    title: "Mapa mental — Docker Compose do zero ao sênior",
    html: `<style>
.dcmm-row{display:flex;align-items:flex-start;gap:0;padding:8px 0;border-bottom:1px solid #1e293b}
.dcmm-row:last-child{border-bottom:none}
.dcmm-cat{width:120px;flex-shrink:0;font-size:9px;letter-spacing:.08em;font-weight:700;text-transform:uppercase;padding-top:5px;line-height:1.4}
.dcmm-tags{display:flex;flex-wrap:wrap;gap:5px}
.dcmm-tag{font-size:10px;padding:3px 9px;border-radius:4px;background:#1e293b;border:1px solid #334155;color:#94a3b8;white-space:nowrap;line-height:1.4}
.dcmm-tag-key{background:rgba(36,150,237,.08);border-color:rgba(36,150,237,.28);color:#2496ED}
.dcmm-tag-adv{background:rgba(239,68,68,.06);border-color:rgba(239,68,68,.22);color:#f87171}
</style>
<div style="font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px">
<p style="color:#e2e8f0;font-size:11px;font-weight:700;margin:0 0 10px;letter-spacing:.04em">COMPOSE — MAPA DE CONCEITOS</p>
<p style="color:#475569;font-size:10px;margin:0 0 16px">Azul: essencial · Vermelho: nível sênior</p>
<div>
  <div class="dcmm-row">
    <div class="dcmm-cat" style="color:#2496ED">SERVIÇOS</div>
    <div class="dcmm-tags">
      <span class="dcmm-tag dcmm-tag-key">image / build</span>
      <span class="dcmm-tag dcmm-tag-key">ports</span>
      <span class="dcmm-tag dcmm-tag-key">environment</span>
      <span class="dcmm-tag dcmm-tag-key">command</span>
      <span class="dcmm-tag">entrypoint</span>
      <span class="dcmm-tag dcmm-tag-adv">build args / target</span>
    </div>
  </div>
  <div class="dcmm-row">
    <div class="dcmm-cat" style="color:#4ade80">DEPENDÊNCIAS</div>
    <div class="dcmm-tags">
      <span class="dcmm-tag dcmm-tag-key">depends_on</span>
      <span class="dcmm-tag dcmm-tag-key">healthcheck</span>
      <span class="dcmm-tag dcmm-tag-key">condition: service_healthy</span>
      <span class="dcmm-tag dcmm-tag-adv">retry com backoff na app</span>
    </div>
  </div>
  <div class="dcmm-row">
    <div class="dcmm-cat" style="color:#f59e0b">VOLUMES</div>
    <div class="dcmm-tags">
      <span class="dcmm-tag dcmm-tag-key">bind mount</span>
      <span class="dcmm-tag dcmm-tag-key">volume nomeado</span>
      <span class="dcmm-tag">read-only (:ro)</span>
      <span class="dcmm-tag dcmm-tag-adv">tmpfs</span>
      <span class="dcmm-tag dcmm-tag-adv">driver_opts</span>
    </div>
  </div>
  <div class="dcmm-row">
    <div class="dcmm-cat" style="color:#a78bfa">NETWORKS</div>
    <div class="dcmm-tags">
      <span class="dcmm-tag dcmm-tag-key">DNS interno</span>
      <span class="dcmm-tag dcmm-tag-key">bridge</span>
      <span class="dcmm-tag">aliases</span>
      <span class="dcmm-tag dcmm-tag-adv">internal: true</span>
      <span class="dcmm-tag dcmm-tag-adv">external networks</span>
      <span class="dcmm-tag dcmm-tag-adv">isolamento estilo VPC</span>
    </div>
  </div>
  <div class="dcmm-row">
    <div class="dcmm-cat" style="color:#38bdf8">CONFIG</div>
    <div class="dcmm-tags">
      <span class="dcmm-tag dcmm-tag-key">.env</span>
      <span class="dcmm-tag dcmm-tag-key">\${VAR:-default}</span>
      <span class="dcmm-tag dcmm-tag-adv">--env-file</span>
      <span class="dcmm-tag dcmm-tag-adv">secrets bloco</span>
      <span class="dcmm-tag dcmm-tag-adv">configs bloco</span>
    </div>
  </div>
  <div class="dcmm-row">
    <div class="dcmm-cat" style="color:#f97316">AMBIENTES</div>
    <div class="dcmm-tags">
      <span class="dcmm-tag dcmm-tag-key">override files</span>
      <span class="dcmm-tag dcmm-tag-key">profiles</span>
      <span class="dcmm-tag dcmm-tag-adv">-f múltiplos</span>
      <span class="dcmm-tag dcmm-tag-adv">!reset</span>
    </div>
  </div>
  <div class="dcmm-row">
    <div class="dcmm-cat" style="color:#e2e8f0">OPERAÇÃO</div>
    <div class="dcmm-tags">
      <span class="dcmm-tag dcmm-tag-key">up / down</span>
      <span class="dcmm-tag dcmm-tag-key">logs / exec</span>
      <span class="dcmm-tag dcmm-tag-key">ps / top</span>
      <span class="dcmm-tag dcmm-tag-adv">config (debug)</span>
      <span class="dcmm-tag dcmm-tag-adv">events</span>
    </div>
  </div>
  <div class="dcmm-row">
    <div class="dcmm-cat" style="color:#c084fc">PROD</div>
    <div class="dcmm-tags">
      <span class="dcmm-tag dcmm-tag-key">restart unless-stopped</span>
      <span class="dcmm-tag dcmm-tag-key">resource limits</span>
      <span class="dcmm-tag dcmm-tag-adv">SHA pin</span>
      <span class="dcmm-tag dcmm-tag-adv">read-only filesystem</span>
      <span class="dcmm-tag dcmm-tag-adv">user non-root</span>
    </div>
  </div>
</div>
</div>`,
    caption: "Use este mapa pra revisão rápida antes de entrevista — varra cada categoria e veja se consegue explicar em voz alta o que cada conceito faz e quando usar.",
  },
  codeExamples: [
    {
      title: "Stack full-stack dev — frontend + api + postgres + redis com hot reload",
      description: "Pilha de desenvolvimento completa: frontend Next.js, API Node, Postgres com healthcheck, Redis. Hot reload via bind mount, .env para credenciais, profiles para serviços opcionais.",
      language: 'yaml',
      code: `# compose.yaml
services:
frontend:
  build: ./frontend
  ports:
    - "3000:3000"
  volumes:
    - ./frontend:/app
    - /app/node_modules         # volume anônimo preserva node_modules do container
  environment:
    NEXT_PUBLIC_API_URL: http://localhost:4000
  depends_on:
    - api
  networks:
    - frontend-net

api:
  build: ./api
  ports:
    - "4000:4000"
  volumes:
    - ./api:/app
    - /app/node_modules
  environment:
    DATABASE_URL: postgres://app:\${DB_PASSWORD}@db:5432/app
    REDIS_URL: redis://redis:6379
    NODE_ENV: development
  depends_on:
    db:
      condition: service_healthy
    redis:
      condition: service_started
  networks:
    - frontend-net
    - backend-net

db:
  image: postgres:16-alpine
  environment:
    POSTGRES_USER: app
    POSTGRES_PASSWORD: \${DB_PASSWORD:?obrigatório}
    POSTGRES_DB: app
  volumes:
    - db_data:/var/lib/postgresql/data
    - ./db/init:/docker-entrypoint-initdb.d:ro    # SQL inicial
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U app"]
    interval: 5s
    timeout: 3s
    retries: 10
  networks:
    - backend-net

redis:
  image: redis:7-alpine
  command: redis-server --appendonly yes
  volumes:
    - redis_data:/data
  networks:
    - backend-net

adminer:
  image: adminer
  ports:
    - "8080:8080"
  profiles: [debug]
  networks:
    - backend-net

networks:
frontend-net:
backend-net:

volumes:
db_data:
redis_data:`,
    },
    {
      title: "Override files — separação dev / prod",
      description: "Estratégia recomendada: base + override automático para dev + arquivo prod explícito. Build local em dev, image SHA pin em prod, replicas e resource limits só em prod.",
      language: 'yaml',
      code: `# compose.yaml — base (igual em todo ambiente)
services:
api:
  image: myorg/api
  environment:
    PORT: 3000

# compose.override.yaml — DEV (carregado automaticamente)
services:
api:
  build: .                          # build local em vez de pull
  volumes:
    - ./api:/app                    # hot reload
    - /app/node_modules
  environment:
    NODE_ENV: development
    DEBUG: "*"
  command: npm run dev
  ports:
    - "3000:3000"

# compose.prod.yaml — PROD (via -f explícito)
services:
api:
  image: myorg/api:abc1234          # SHA pin
  deploy:
    replicas: 3
    resources:
      limits:
        cpus: '0.5'
        memory: 256M
      reservations:
        cpus: '0.25'
        memory: 128M
  restart: always
  logging:
    driver: json-file
    options:
      max-size: "10m"
      max-file: "3"
  environment:
    NODE_ENV: production
    LOG_LEVEL: warn

# uso:
# dev:  docker compose up                                    (carrega override auto)
# prod: docker compose -f compose.yaml -f compose.prod.yaml up -d`,
    },
    {
      title: "Profiles — ambientes opcionais (debug, monitoring)",
      description: "Profiles permitem ligar partes opcionais sem editar o yaml. Útil pra adminer, mailhog, jaeger, prometheus que você só quer às vezes — mantém docker compose up rápido por padrão.",
      language: 'yaml',
      code: `services:
# core — sempre sobe
api:
  image: myapp/api

db:
  image: postgres:16-alpine

# debug tools — só com --profile debug
adminer:
  image: adminer
  ports: ["8080:8080"]
  profiles: [debug]

mailhog:
  image: mailhog/mailhog
  ports: ["8025:8025"]
  profiles: [debug]

# tracing — só com --profile tracing
jaeger:
  image: jaegertracing/all-in-one
  ports: ["16686:16686"]
  profiles: [tracing]

# monitoring — só com --profile monitoring
prometheus:
  image: prom/prometheus
  profiles: [monitoring]

grafana:
  image: grafana/grafana
  profiles: [monitoring]

# uso:
# docker compose up                                  # só core (api + db)
# docker compose --profile debug up                  # core + adminer + mailhog
# docker compose --profile tracing up                # core + jaeger
# docker compose --profile monitoring up             # core + prometheus + grafana
# docker compose --profile debug --profile tracing up   # múltiplos`,
    },
    {
      title: "CI — Compose para testes integrados",
      description: "Em GitHub Actions, suba banco real via Compose para teste integrado. Mais fiel que mock e mais fácil que matrix de serviços. Cleanup garantido com down -v.",
      language: 'yaml',
      code: `# compose.test.yaml
services:
test:
  build: .
  command: npm test
  environment:
    DATABASE_URL: postgres://test:test@db:5432/test
    REDIS_URL: redis://redis:6379
  depends_on:
    db:
      condition: service_healthy
    redis:
      condition: service_started

db:
  image: postgres:16-alpine
  environment:
    POSTGRES_USER: test
    POSTGRES_PASSWORD: test
    POSTGRES_DB: test
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U test"]
    interval: 2s
    timeout: 2s
    retries: 15
  tmpfs:
    - /var/lib/postgresql/data    # ramdisk: rapidíssimo, não precisa volume

redis:
  image: redis:7-alpine

# .github/workflows/test.yml
# - run: docker compose -f compose.test.yaml up --abort-on-container-exit --exit-code-from test
# - run: docker compose -f compose.test.yaml down -v   # cleanup
`,
    },
    {
      title: "Multi-container com secrets — Node + Postgres + Redis sem vazar credenciais",
      description: "Pilha pronta pra produção single-host: backend Node, Postgres com healthcheck, Redis com password, secrets em arquivo montado em /run/secrets (não em environment), networks isoladas e restart unless-stopped.",
      language: 'yaml',
      code: `# compose.yaml — pilha com secrets corretos
services:
backend:
  image: myorg/backend:1.4.2
  ports:
    - "4000:4000"
  environment:
    NODE_ENV: production
    DATABASE_URL_FILE: /run/secrets/db_url        # app lê arquivo, não env
    REDIS_PASSWORD_FILE: /run/secrets/redis_pwd
    JWT_SECRET_FILE: /run/secrets/jwt_secret
  secrets:
    - db_url
    - redis_pwd
    - jwt_secret
  depends_on:
    db:
      condition: service_healthy
    redis:
      condition: service_started
  networks:
    - public-net
    - backend-net
  restart: unless-stopped

db:
  image: postgres:16-alpine
  environment:
    POSTGRES_USER: app
    POSTGRES_PASSWORD_FILE: /run/secrets/db_password   # postgres aceita _FILE nativo
    POSTGRES_DB: app
  secrets:
    - db_password
  volumes:
    - db_data:/var/lib/postgresql/data
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U app -d app"]
    interval: 5s
    timeout: 3s
    retries: 10
    start_period: 30s
  networks:
    - backend-net
  restart: unless-stopped

redis:
  image: redis:7-alpine
  command: >
    sh -c 'redis-server --requirepass "$$(cat /run/secrets/redis_pwd)" --appendonly yes'
  secrets:
    - redis_pwd
  volumes:
    - redis_data:/data
  healthcheck:
    test: ["CMD-SHELL", "redis-cli -a $$(cat /run/secrets/redis_pwd) ping | grep PONG"]
    interval: 5s
    timeout: 3s
    retries: 10
  networks:
    - backend-net
  restart: unless-stopped

networks:
public-net:
backend-net:
  internal: true              # sem saída pra internet — defesa em profundidade

volumes:
db_data:
redis_data:

secrets:
db_url:
  file: ./secrets/db_url.txt
db_password:
  file: ./secrets/db_password.txt
redis_pwd:
  file: ./secrets/redis_pwd.txt
jwt_secret:
  file: ./secrets/jwt_secret.txt
# em prod sério: external: true (vindo do Swarm/Vault/Cloud Secrets Manager)`,
    },
  ],
  gotchas: [
    "depends_on sem healthcheck não espera o serviço ficar pronto — só espera o container iniciar. App sobe antes do Postgres aceitar conexão e crasha no primeiro insert. Sempre combine com condition: service_healthy.",
    "Não use compose.yaml em prod com múltiplos hosts — Compose é single-host por design. Para multi-host: Swarm (em desuso), Kubernetes, ECS, Nomad. Compose em prod só vale single-host pequeno.",
    "Conflito de porta — se a porta 5432 já está ocupada no host, o map não acontece (erro: bind: address already in use). Use porta alta no host (15432:5432) ou pare o serviço local.",
    "Esquecer restart: unless-stopped — em reboot do host de dev ou prod single-host, container não volta sozinho. unless-stopped é o saudável; always reinicia até em stop manual.",
    "Volume bind no Docker Desktop (Mac/Windows) é lento — cruza VM. Use :cached ou :delegated em volumes pesados, ou volume nomeado pra node_modules em vez de deixar o bind cobrir o diretório.",
    "Comando docker-compose (com hífen) é v1 Python — deprecated. Use docker compose (espaço, plugin Go v2). v1 não suporta features novas como GPU, healthcheck moderno, profiles.",
    "Secrets em environment direto — vazam em ps, logs e em qualquer kubectl/docker inspect. Use o bloco secrets ou DATABASE_URL_FILE: /run/secrets/db apontando pra arquivo montado.",
    "Sem profiles — toda pilha sobe junto, dev fica lento. Marque adminer/jaeger/mailhog/prometheus com profiles: [debug] ou similar e ligue com --profile só quando precisar.",
    "Networks default sem isolamento — frontend alcança DB direto. Em pilha grande, separe redes (frontend-net, backend-net) pra emular VPC e validar que componente público não tem rota pra base de dados.",
    "image sem tag fixa (ou pior, latest) — pull pode trazer versão diferente entre máquinas, e em rebuild de produção quebra tudo. Pin SHA (postgres@sha256:...) ou semver fixo (postgres:16.2-alpine).",
    "compose.override.yaml em commit acidental — sobrescreve config de prod com config de dev de outro dev. Use .gitignore pra override local; arquivos commitados devem ser por ambiente (compose.staging.yaml).",
    "Não rodar docker compose config — esse comando expande variáveis e merge de overrides. Quando algo não funciona, rodar config primeiro mostra exatamente o YAML final que o Compose vai usar.",
  ],
  interview: [
    {
      q: "Quando você para no Docker Compose e quando precisa migrar pra Kubernetes?",
      level: 'pleno',
      a: "<p><strong>Compose ganha em:</strong> dev local (todo time tem), CI para testes integrados, ambiente de staging single-host, app pequena/média em 1 servidor (até 50-100 containers num host robusto), POC, demos e quando time não tem maturidade ops para K8s.</p><p><strong>Migra pra K8s quando:</strong> precisa multi-host (scheduler distribui pods em vários nós), precisa auto-scaling horizontal, precisa rolling update sem downtime com health gates, precisa multi-AZ, multi-tenant com isolamento, service mesh, canary/blue-green, ou time já tem maturidade pra operar (ou usa managed: EKS, GKE, AKS).</p><p>Para produto pequeno em 1 host, K8s é overkill — overhead operacional come a velocidade do time. Compose ainda é legítimo em prod single-host — não é dogma 'só K8s vale'.</p>",
      tip: "Comece pelas situações onde Compose ganha — entrevistador testa se você não está fazendo cargo cult de K8s. Mencione que time pequeno em 1 host com Compose entrega mais rápido que time pequeno tentando operar K8s.",
    },
    {
      q: "Como você garante que app só sobe depois do banco estar realmente pronto?",
      level: 'pleno',
      a: "<p>Não basta <code>depends_on: [db]</code> — esse default só espera o container iniciar (PID 1 começou), não o Postgres aceitar conexão.</p><p><strong>Solução 1 — healthcheck + condition:</strong></p><pre><code>services:\n  db:\n    healthcheck:\n      test: [\"CMD-SHELL\", \"pg_isready -U app\"]\n      interval: 5s\n      retries: 10\n      start_period: 30s\n  api:\n    depends_on:\n      db:\n        condition: service_healthy</code></pre><p><strong>Solução 2 (mais robusta) — retry com backoff na app:</strong> mesmo com healthcheck, em prod o DB pode reiniciar e a app precisa sobreviver. Implemente reconexão exponencial no driver/ORM. Healthcheck do Compose ajuda na inicialização; retry da app cobre runtime.</p><p>Em K8s o equivalente é <code>readinessProbe</code> + <code>initContainers</code> que esperam dependência externa.</p>",
    },
    {
      q: "Explique a estratégia de override files. Quando usar override automático vs -f explícito?",
      level: 'pleno',
      a: "<p>Compose carrega <strong>compose.yaml + compose.override.yaml automaticamente</strong> quando você roda <code>docker compose up</code> sem -f. É a convenção pra dev: base define o comum (image, ports, environment); override adiciona dev-specific (build local, volumes pra hot reload, NODE_ENV=development).</p><p>Para outros ambientes (prod, staging, test), use <strong>-f explícito</strong>: <code>docker compose -f compose.yaml -f compose.prod.yaml up -d</code>. A ordem importa — arquivos posteriores sobrescrevem anteriores. Listas (volumes, ports) concatenam; mapas (environment) mergem por chave.</p><p><strong>Boa prática:</strong> commitar compose.yaml e compose.prod.yaml; deixar compose.override.yaml fora do .gitignore se ele tem só dev settings comuns ao time, ou fora do versionamento se tem coisas pessoais. Em projetos com 3+ ambientes, prefiro nomes explícitos (compose.dev.yaml, compose.staging.yaml, compose.prod.yaml) e nunca usar o override automático — torna explícito qual arquivo está em uso.</p>",
    },
    {
      q: "O que muda entre docker-compose v1 (com hífen) e docker compose v2 (com espaço)?",
      a: "<p>v1 (docker-compose, com hífen) é uma ferramenta Python standalone — ficou deprecated em 2023. v2 (docker compose, com espaço) é um plugin Go integrado ao Docker CLI — instalado junto com Docker Desktop ou via apt install docker-compose-plugin.</p><p><strong>Diferenças práticas:</strong> v2 é mais rápido (Go vs Python), suporta features novas (GPU, profiles, healthcheck moderno, secrets sintaxe atual), tem flag --wait que espera serviços ficarem healthy antes de retornar (essencial em CI), suporta build com BuildKit nativo, e gerencia melhor sinais (Ctrl+C funciona consistente).</p><p>O comando docker-compose ainda funciona em alguns sistemas via shim — mas projetos novos sempre devem usar docker compose. Se um README usa docker-compose, é sinal de projeto desatualizado.</p>",
    },
    {
      q: "Como você isola networks pra emular uma VPC? Por que importa?",
      level: 'senior',
      a: "<p>Por padrão, todos os serviços do Compose ficam numa rede default — qualquer um conversa com qualquer um. Em pilha real isso é antipattern: frontend não deveria alcançar DB direto, mesmo que via DNS interno.</p><p><strong>Padrão recomendado:</strong></p><pre><code>services:\n  frontend:\n    networks: [frontend-net]\n  api:\n    networks: [frontend-net, backend-net]   # ponte\n  db:\n    networks: [backend-net]                  # isolada\n  redis:\n    networks: [backend-net]\n\nnetworks:\n  frontend-net:\n  backend-net:\n    internal: true                           # nem internet sai daqui</code></pre><p><strong>Por que importa:</strong> emula o que VPC faz no cloud (subnets públicas vs privadas). Se um SSRF na api permitir requisições arbitrárias, o atacante ainda só alcança o que a api alcança — não o frontend nem outras pilhas. Em audit de segurança você consegue argumentar arquitetura de rede explícita, não 'tudo numa rede default'.</p><p>Em K8s o equivalente é NetworkPolicy. Em ambos os mundos, o princípio é o mesmo: deny por padrão, permita explicitamente.</p>",
      tip: "Mencione que isolamento de rede é defesa em profundidade — não substitui auth, mas reduz blast radius. Quem vê isolamento como 'cosmético' perde pontos com entrevistador sênior de segurança.",
    },
    {
      q: "Qual a diferença entre bind mount e volume nomeado? Quando usar cada um?",
      a: "<p><strong>Bind mount</strong> (./src:/app) é referência de path do host. Mudança no host reflete no container imediato — ótimo pra hot reload em dev. Performance ruim no Docker Desktop (Mac/Windows) porque cruza VM. Não é portável — depende do path existir no host.</p><p><strong>Volume nomeado</strong> (db_data:/var/lib/postgresql/data) é storage gerenciado pelo Docker em /var/lib/docker/volumes/. Persistência via lifecycle: docker compose down preserva; -v destrói. Performance melhor em Docker Desktop, portável entre máquinas, suporta drivers (nfs, ceph, cloud).</p><p><strong>Regra:</strong></p><ul><li>Dev: bind mount no código (hot reload), volume anônimo no node_modules (não sobrescreve).</li><li>Dado persistente (DB, uploads): sempre volume nomeado.</li><li>Config read-only: bind mount com :ro (./nginx.conf:/etc/nginx/nginx.conf:ro).</li><li>Dado efêmero pesado: tmpfs (ramdisk) — não toca disco.</li></ul>",
    },
    {
      q: "Como debugar uma pilha onde o serviço não sobe?",
      level: 'pleno',
      a: "<p>Roteiro:</p><ol><li><strong>docker compose ps</strong> — qual serviço está em qual estado (Exit, Restarting, Created, Running)?</li><li><strong>docker compose logs nome-do-servico</strong> — última saída antes de morrer. --tail 200 pra mais contexto.</li><li><strong>docker compose config</strong> — confirma o YAML final após merge de overrides e expansão de variáveis. Bug clássico: variável não expandida porque .env não foi achada.</li><li><strong>docker compose events</strong> — stream de eventos (start, die, kill, restart) em tempo real.</li><li><strong>Inspeciona container que crashou:</strong> <code>docker compose logs --previous</code> ou <code>docker container inspect &lt;id&gt;</code> pra ver exit code (137 = OOM, 1 = erro normal, 139 = segfault).</li><li><strong>Roda interativo pra debugar:</strong> <code>docker compose run --rm api sh</code> sobe um one-shot do serviço com shell — você reproduz o erro manualmente.</li><li><strong>Healthcheck falhando:</strong> <code>docker compose ps</code> mostra (unhealthy). Veja log do healthcheck via <code>docker inspect</code>.</li></ol><p>Em CI, sempre rode <code>docker compose logs</code> num step de cleanup para artefato em caso de falha.</p>",
    },
    {
      q: "Como você passa secrets pro Compose sem vazar em logs?",
      level: 'senior',
      a: "<p><strong>Antipattern (vaza tudo):</strong></p><pre><code>environment:\n  DB_PASSWORD: super_secret_here   # vaza em ps, inspect, logs</code></pre><p><strong>Pattern correto — bloco secrets:</strong></p><pre><code>services:\n  api:\n    secrets:\n      - db_password\n    environment:\n      DB_PASSWORD_FILE: /run/secrets/db_password   # app lê arquivo\n\nsecrets:\n  db_password:\n    file: ./secrets/db_password.txt              # local em dev\n    # external: true                             # do Swarm/cloud em prod</code></pre><p>Compose monta o arquivo em /run/secrets/db_password (mode 0400, root). App lê via fs.readFileSync. Secret nunca aparece em ps, environment ou inspect.</p><p><strong>Em dev:</strong> arquivo .secrets/ no .gitignore. <strong>Em prod sério:</strong> Vault, AWS Secrets Manager, ou Sealed Secrets do K8s. Compose puro tem suporte limitado pra rotação — em prod com necessidade real de rotação, use stack Swarm ou migrate pra K8s com External Secrets Operator.</p>",
    },
    {
      q: "Por que o comando docker compose config é importante? Quando você o usa?",
      a: "<p><code>docker compose config</code> imprime o YAML <strong>final</strong> que o Compose vai usar — depois de fazer merge de todos os arquivos -f, expandir variáveis (.env e shell), aplicar profiles e validar a sintaxe.</p><p><strong>Quando uso:</strong></p><ul><li>Variável não expandiu como esperado — <code>docker compose config</code> mostra o resultado real.</li><li>Override não funcionou — vejo se o merge fundiu corretamente.</li><li>Profile não ativou — confirmo que --profile foi reconhecido.</li><li>CI quebrando localmente — comparo a saída do meu config com a do CI pra achar diferença de env.</li><li>Antes de qualquer mudança importante em prod — sempre rodo config pra garantir que entendo o que vai subir.</li></ul><p>Flags úteis: <code>--no-interpolate</code> mostra o YAML sem expandir variáveis (debug de origem); <code>--services</code> só lista os serviços que vão subir.</p>",
    },
    {
      q: "Compose v3 deploy.replicas funciona? Por que?",
      level: 'senior',
      a: "<p>Não no Compose puro — só funciona em Swarm (docker stack deploy). Em <code>docker compose up</code>, qualquer chave dentro de <code>deploy:</code> (replicas, resources, restart_policy, placement) é silenciosamente ignorada. Compose roda 1 instância só por serviço.</p><p><strong>Por que existe então:</strong> Compose v3 foi desenhado pra ser portável entre Compose e Swarm — o mesmo arquivo deveria rodar nos dois. Como Swarm caiu em desuso, essa promessa não vingou.</p><p><strong>Como rodar múltiplas réplicas em Compose:</strong></p><pre><code>docker compose up --scale api=3</code></pre><p>Mas isso tem limites — sem load balancer, todas as réplicas competem pelo mesmo port mapping (impossível). Em prod precisa de proxy (nginx, traefik) na frente. Pra prod multi-instância de verdade, use K8s ou ECS.</p><p>Em Compose <strong>resource limits</strong> usam mem_limit / cpus / pids_limit no nível do serviço (fora de deploy:) — esses funcionam.</p>",
    },
    {
      q: "Como você lida com hot reload de node_modules em volume bind?",
      level: 'pleno',
      a: "<p>Problema clássico: <code>volumes: ['./api:/app']</code> sobrescreve <code>/app/node_modules</code> do container com a pasta vazia (ou de outra arquitetura) do host. App quebra na importação.</p><p><strong>Solução 1 (mais comum) — volume anônimo cobrindo node_modules:</strong></p><pre><code>volumes:\n  - ./api:/app\n  - /app/node_modules   # volume anônimo: preserva o node_modules instalado no build</code></pre><p>Docker monta volumes em ordem — bind primeiro, depois volume anônimo cobre node_modules com o do container.</p><p><strong>Solução 2 — instalar deps no entrypoint:</strong> Dockerfile não copia node_modules; entrypoint roda npm install. Mais lento mas garante deps do host.</p><p><strong>Solução 3 — não usar bind, copiar pra container:</strong> dev em VM/container, sem hot reload via host. Útil se host é Mac/Windows e perf do bind é inaceitável.</p><p>Mesma lógica vale pra .next/ do Next, target/ do Rust, vendor/ do PHP — qualquer pasta gerada que não deve vir do host.</p>",
    },
    {
      q: "Como você roda Compose no CI pra teste integrado?",
      a: "<p>Compose é ideal pra CI porque sobe pilha real (DB, Redis, message queue) em vez de mock. Mais fiel que mock e mais simples que matrix de serviços.</p><p><strong>Padrão GitHub Actions:</strong></p><pre><code>- run: docker compose -f compose.test.yaml up -d --wait\n  # --wait espera healthchecks ficarem OK antes de retornar\n- run: docker compose -f compose.test.yaml exec -T app npm test\n- run: docker compose -f compose.test.yaml logs\n  if: failure()           # log só se falhou — pra debug\n- run: docker compose -f compose.test.yaml down -v\n  if: always()            # cleanup garantido</code></pre><p><strong>Otimizações:</strong></p><ul><li><code>tmpfs</code> em /var/lib/postgresql/data — ramdisk, sem disco, rapidíssimo.</li><li><code>cache_from</code> no build pra reusar layer entre runs.</li><li><code>--abort-on-container-exit --exit-code-from test</code> pra falhar o job quando o container de teste morre com erro.</li><li>Postgres com <code>POSTGRES_HOST_AUTH_METHOD=trust</code> em test pra não precisar passar senha.</li></ul>",
    },
    {
      q: "Compose suporta GPU? Como rodar workload de ML?",
      level: 'senior',
      a: "<p>Sim, desde Compose v2 com Docker Engine 19.03+. A chave é <code>deploy.resources.reservations.devices</code> — funciona em Compose também (apesar de estar dentro de deploy:).</p><pre><code>services:\n  ml:\n    image: nvidia/cuda:12.0-base\n    deploy:\n      resources:\n        reservations:\n          devices:\n            - driver: nvidia\n              count: 1                  # ou 'all'\n              capabilities: [gpu]\n    environment:\n      NVIDIA_VISIBLE_DEVICES: all\n      NVIDIA_DRIVER_CAPABILITIES: compute,utility</code></pre><p><strong>Pré-requisitos no host:</strong> NVIDIA driver instalado + nvidia-container-toolkit (apt install nvidia-container-toolkit + restart docker daemon). Em GPUs específicas use <code>device_ids: ['0', '1']</code> em vez de count.</p><p>Pra prod ML em escala, K8s com nvidia-device-plugin ou plataforma gerenciada (Kubeflow, SageMaker) é mais comum. Compose com GPU é pro dev local de modelo ou single-host de inference.</p>",
    },
    {
      q: "Como o DNS interno do Docker Compose funciona? Por que localhost não funciona entre containers?",
      level: 'senior',
      a: "<p>Cada container roda num <strong>network namespace isolado</strong> do kernel — tem sua própria interface lo (loopback). <code>localhost</code> dentro do container da api só alcança a própria api, nunca o db. Por isso <code>DATABASE_URL=postgres://localhost:5432</code> falha — está apontando pro localhost do próprio container.</p><p><strong>Como o Compose resolve service-name → IP</strong>:</p><ol><li>Compose cria uma bridge Linux por rede declarada (default = <code>nomeprojeto_default</code>).</li><li>Cada container conectado à rede recebe um IP da subnet (ex: 172.18.0.3) e uma entrada num <strong>DNS embutido</strong> que o Docker roda em <code>127.0.0.11</code> dentro de cada container.</li><li>O resolv.conf do container aponta pra esse DNS interno: <code>nameserver 127.0.0.11</code>.</li><li>Quando a api faz <code>fetch('http://db:5432')</code>, glibc consulta 127.0.0.11, que retorna o IP do container do serviço <code>db</code>.</li><li>Pacote sai pela bridge e chega no container do db — que aceita conexão na sua porta interna 5432 (sem precisar de <code>ports</code> mapeado pro host).</li></ol><p><strong>Implicações práticas</strong>: você não usa <code>ports:</code> pra comunicação interna — só pra expor pro host. Hostname é exatamente o nome do serviço (case sensitive em alguns casos). Aliases extras via <code>networks.&lt;net&gt;.aliases: [primary, master]</code>. Em K8s o equivalente é CoreDNS resolvendo <code>service.namespace.svc.cluster.local</code>.</p>",
      tip: "Mencione o IP 127.0.0.11 do DNS interno — diferencia candidato que decorou de quem realmente entende o mecanismo. Quem explica que cada container tem seu próprio loopback ganha pontos.",
    },
    {
      q: "Qual a diferença real entre depends_on com service_healthy e service_started?",
      level: 'senior',
      a: "<p>O <code>depends_on</code> simples (sem condition) e <code>service_started</code> são equivalentes — esperam só o <strong>container iniciar</strong> (PID 1 começou a rodar). Não esperam o processo dentro estar pronto. Postgres pode levar 5-15s entre o container subir e aceitar conexão. App que assume DB pronto crasha no primeiro insert.</p><p><strong><code>service_healthy</code></strong> espera o <strong>healthcheck retornar exit 0</strong>. Sem <code>healthcheck</code> declarado no serviço dependido, <code>service_healthy</code> bloqueia indefinidamente — Compose não inventa healthcheck. Então a regra é: healthcheck no dependido + condition no dependente, sempre em par.</p><p><strong>Exit codes do healthcheck</strong>: 0 = healthy, 1 = unhealthy, 2 = reservado (não use). Estados: <code>starting</code> (durante <code>start_period</code>), <code>healthy</code>, <code>unhealthy</code>.</p><p><strong>Por que healthcheck é obrigatório em produção</strong>:</p><ul><li>Auto-restart funciona com healthcheck — sem ele, container 'rodando' mas com app travada nunca reinicia.</li><li>Load balancer / proxy (traefik, nginx) descobre estado via healthcheck pra não rotear pra app morta.</li><li>Em rolling deploy (Swarm/K8s), readiness probe usa healthcheck pra decidir quando promover novo container.</li></ul><p><strong>Pegadinha</strong>: <code>service_healthy</code> só vale na inicialização. Se o DB ficar unhealthy depois que a api subiu, a api não morre junto — você precisa de retry com backoff no driver da app. Healthcheck do Compose é gate de start, não watchdog runtime.</p>",
    },
    {
      q: "Quando usar build vs image no Compose? E o que muda com build avançado (context, dockerfile, target)?",
      level: 'senior',
      a: "<p><strong>image apenas</strong>: pull do registry. Use em prod (imagem versionada por SHA), em dev quando a imagem é estável e você não toca no Dockerfile.</p><p><strong>build apenas</strong>: cria imagem local a cada <code>up --build</code>. Use em dev quando você muda o Dockerfile com frequência.</p><p><strong>build + image</strong>: build local mas salva com o nome declarado em <code>image</code>. Útil pra: (a) reusar a tag no <code>docker compose push</code>, (b) ter um nome estável pra outras stacks referenciarem.</p><p><strong>build avançado</strong> (objeto):</p><pre><code>build:\n  context: ./api              # raiz dos paths COPY/ADD\n  dockerfile: Dockerfile.dev  # arquivo customizado (default: Dockerfile)\n  target: development         # stage do multi-stage Dockerfile\n  args:\n    NODE_VERSION: '20'        # vira ARG dentro do Dockerfile\n  cache_from:\n    - myorg/api:cache         # acelera CI puxando layer cache\n  platforms:\n    - linux/amd64\n    - linux/arm64             # multi-arch (precisa de buildx)</code></pre><p><strong>Multi-stage no Compose</strong>: o mesmo Dockerfile pode ter <code>FROM node AS development</code> e <code>FROM node AS production</code>. No compose.override (dev) você usa <code>target: development</code> (com nodemon, sourcemaps); no compose.prod.yaml, <code>target: production</code> (build minificado, sem dev deps).</p><p><strong>Quando NÃO usar build em prod</strong>: nunca buildar no host de produção. Build em CI, push pra registry com SHA, prod só dá pull. Evita 'works on my machine' e permite rollback instantâneo (<code>image: myorg/api:abc1233</code> → SHA anterior).</p>",
    },
    {
      q: "Como funciona o merge de override files? Quando o merge não é o que você espera?",
      level: 'senior',
      a: "<p>Compose carrega arquivos na ordem dos <code>-f</code> e merge cada um sobre o anterior. <code>compose.yaml</code> + <code>compose.override.yaml</code> (auto) ou múltiplos <code>-f</code> explícitos.</p><p><strong>Regras de merge</strong>:</p><ul><li><strong>Mapas (environment, labels, build.args)</strong>: fundidos por chave. Override soma chaves novas, sobrescreve existentes.</li><li><strong>Listas (ports, volumes, networks, command como lista)</strong>: concatenadas. <strong>Não substituem</strong>.</li><li><strong>Strings/scalars (image, restart, user)</strong>: substituem completamente.</li></ul><p><strong>Pegadinha clássica</strong>: você quer trocar volumes em prod, mas o override <em>concatena</em> — fica com bind do dev + volume nomeado do prod, gerando conflito.</p><pre><code># base\nvolumes:\n  - ./src:/app   # dev hot reload\n\n# prod override\nvolumes:\n  - app_data:/app   # volume nomeado\n\n# resultado mergido (errado!):\nvolumes:\n  - ./src:/app\n  - app_data:/app   # conflito de mount</code></pre><p><strong>Soluções</strong>:</p><ol><li><strong><code>!reset</code></strong> (Compose v2.24+): <code>volumes: !reset []</code> limpa a chave herdada antes de adicionar.</li><li><strong>Inverter a estratégia</strong>: base mínima sem o volume; cada ambiente declara o seu.</li><li><strong>Sempre rodar <code>docker compose -f a.yaml -f b.yaml config</code></strong> antes de subir — mostra o YAML final mergido.</li></ol><p><strong>Variáveis</strong>: o merge acontece <strong>depois</strong> da expansão de <code>${VAR}</code>. Cada arquivo é expandido com o env atual, depois mergido. Use <code>--no-interpolate</code> em config pra ver os literais antes da expansão.</p>",
    },
    {
      q: "O que o Compose usa pra decidir se precisa recriar um container?",
      level: 'senior',
      a: "<p>Compose mantém um <strong>hash de configuração</strong> em label do container (<code>com.docker.compose.config-hash</code>). Em cada <code>docker compose up</code>, ele:</p><ol><li>Recalcula o hash da config atual (depois de merge de overrides + expansão de variáveis).</li><li>Compara com o hash salvo no container existente.</li><li>Se diferente: <strong>recria</strong> (down + up do serviço). Se igual: <strong>preserva</strong> (não toca).</li></ol><p><strong>O que entra no hash</strong>: image (incluindo digest após pull), command, environment, volumes, ports, networks, healthcheck, todas as chaves do serviço. Mudou .env? Hash muda → recria. Mesma config exata? Não recria.</p><p><strong>Flags úteis</strong>:</p><ul><li><code>--force-recreate</code>: recria mesmo sem mudança (útil quando você quer 'reset' do estado, sem mudar yaml).</li><li><code>--no-recreate</code>: nunca recria — preserva containers existentes mesmo com config mudada (raramente útil).</li><li><code>--renew-anon-volumes</code>: recria volumes anônimos (útil pra resetar node_modules em mount anônimo).</li><li><code>--remove-orphans</code>: remove containers de serviços que sumiram do yaml.</li></ul><p><strong>Pegadinha</strong>: pull de uma tag latest atualiza o digest, mas Compose só percebe se você roda <code>docker compose pull</code> antes do <code>up</code>. Sem pull, ele usa a image local (mesma tag, digest antigo). Em CI use <code>--pull always</code> pra forçar pull antes do up.</p>",
    },
    {
      q: "Como você modela retries e graceful shutdown em Compose?",
      level: 'senior',
      a: "<p><strong>Restart policies</strong> (chave <code>restart:</code>):</p><ul><li><strong><code>no</code></strong> (default): nunca reinicia. Use em jobs one-shot (migration).</li><li><strong><code>on-failure[:N]</code></strong>: reinicia só em exit code !=0, opcionalmente com max N tentativas. Sem N = infinito.</li><li><strong><code>always</code></strong>: reinicia sempre, mesmo em <code>docker compose stop</code>. Em reboot do host, sobe junto.</li><li><strong><code>unless-stopped</code></strong>: como always, MAS se você parou manualmente (<code>stop</code>), não reinicia em reboot. Geralmente o saudável pra prod single-host.</li></ul><p><strong>O que acontece em <code>docker compose down</code></strong>: para todos os containers (SIGTERM, espera <code>stop_grace_period</code> = 10s default, depois SIGKILL), remove containers e a rede default. <strong>Volumes nomeados são preservados</strong> a menos que use <code>-v</code>.</p><p><strong>Graceful shutdown</strong>:</p><pre><code>services:\n  api:\n    stop_signal: SIGTERM           # sinal pra avisar shutdown\n    stop_grace_period: 30s         # espera 30s antes de SIGKILL\n    init: true                     # tini como PID 1 (responde sinais)</code></pre><p><strong>Por que <code>init: true</code> importa</strong>: Node, Python, etc rodando como PID 1 não respondem SIGTERM padrão (Linux ignora sinais default em PID 1). Sem init, <code>compose stop</code> espera 10s e mata com SIGKILL — sem chance de fechar conexão DB, drenar fila, persistir cache. Com tini (init), os sinais são roteados corretamente e você consegue handler graceful no app.</p><p><strong>Em CI</strong>: <code>--abort-on-container-exit --exit-code-from test</code> derruba toda a stack assim que o container de teste sai, propagando seu exit code.</p>",
    },
    {
      q: "Profiles na prática — como você desenha quais serviços são opcionais?",
      level: 'senior',
      a: "<p><strong>Profiles</strong> marca um serviço como opcional. <code>docker compose up</code> sem <code>--profile</code> sobe só serviços <strong>sem profile</strong>. <code>--profile X</code> liga serviços marcados com X (além dos sem profile). Múltiplos profiles aceitos: <code>--profile debug --profile tracing</code>.</p><p><strong>Padrões que uso</strong>:</p><ul><li><strong>Sem profile (core)</strong>: api, db, redis, queue. O que TODO dev precisa pra rodar a app.</li><li><strong><code>profiles: [debug]</code></strong>: adminer, mailhog, redis-commander, swagger-ui. UIs de inspeção que comem RAM e dev nem sempre quer.</li><li><strong><code>profiles: [tracing]</code></strong>: jaeger, zipkin, otel-collector. Pra investigar perf ou rastrear flow distribuído.</li><li><strong><code>profiles: [monitoring]</code></strong>: prometheus, grafana, loki. Pra simular observabilidade local.</li><li><strong><code>profiles: [load-test]</code></strong>: k6, artillery. Pra testes de carga pontuais.</li></ul><p><strong>Casos avançados</strong>:</p><ul><li>Um serviço pode ter <strong>múltiplos profiles</strong>: <code>profiles: [debug, dev-tools]</code> — sobe se qualquer um estiver ativo.</li><li><strong>Profile via variável de ambiente</strong>: <code>COMPOSE_PROFILES=debug docker compose up</code> equivale a <code>--profile debug</code>. Útil em scripts.</li><li><strong>Dependências entre profiles</strong>: serviço com <code>depends_on: [jaeger]</code> pode falhar se jaeger não foi ativado. Faça depends_on só pra core; opcional via env var lida em runtime pelo app.</li></ul><p><strong>Por que importa</strong>: <code>docker compose up</code> de um repo grande sem profiles sobe 15 serviços e leva 3 minutos pra dev rodar 1 endpoint. Com profiles bem desenhados, dev novo digita <code>up</code>, sobe em 30 segundos, e adiciona <code>--profile debug</code> só quando precisar inspecionar DB.</p>",
      tip: "Cite o caso de COMPOSE_PROFILES como env var — diferencia quem leu doc completo. Fale do trade-off: profiles facilitam DX, mas torna setup menos óbvio pra novato — documente no README.",
    },
  ],
  videos: [
    { title: "Docker Compose in 12 Minutes", channel: "TechWorld with Nana", url: "https://www.youtube.com/watch?v=DM65_JyGxCo", topic: "fundamentos", note: "Tutorial direto que cobre o essencial de compose.yaml, networks, volumes e comandos. Boa primeira exposição." },
    { title: "Docker Compose vs Kubernetes", channel: "TechWorld with Nana", url: "https://www.youtube.com/watch?v=jU2B-ZIoyeI", topic: "comparação", note: "Quando vale Compose, quando precisa K8s — argumentos práticos pra entrevista." },
    { title: "Docker Compose Best Practices", channel: "Bret Fisher", url: "https://www.youtube.com/results?search_query=docker+compose+best+practices+bret+fisher", topic: "produção", note: "Bret Fisher (Docker Captain) cobre healthcheck, profiles, override files, networks isoladas. Padrões reais de produção." },
    { title: "Compose v2 New Features Walkthrough", channel: "Docker", url: "https://www.youtube.com/results?search_query=docker+compose+v2+features+walkthrough", topic: "v2 features", note: "Tour das features que diferenciam v2 do v1: profiles, --wait, GPU, healthcheck moderno." },
  ],
  resources: [
    { title: "Compose Specification — site oficial", url: "https://compose-spec.io/", kind: "docs" },
    { title: "Docker Compose Documentation", url: "https://docs.docker.com/compose/", kind: "docs" },
    { title: "Compose file reference (todas as chaves)", url: "https://docs.docker.com/reference/compose-file/", kind: "docs" },
    { title: "Awesome Compose (templates oficiais)", url: "https://github.com/docker/awesome-compose", kind: "pratica" },
    { title: "Bret Fisher — Docker Mastery course", url: "https://www.bretfisher.com/docker-mastery/", kind: "curso" },
    { title: "Compose profiles — guia completo", url: "https://docs.docker.com/compose/how-tos/profiles/", kind: "docs" },
    { title: "Compose networking — deep dive", url: "https://docs.docker.com/compose/how-tos/networking/", kind: "docs" },
    { title: "Compose secrets reference", url: "https://docs.docker.com/compose/how-tos/use-secrets/", kind: "docs" },
  ],
  exercises: [
    {
      level: 'iniciante',
      title: "Pilha mínima — API + Postgres com healthcheck",
      description: "Crie compose.yaml com API Node simples + Postgres. API deve esperar Postgres ficar saudável (healthcheck com pg_isready) antes de subir. Use volume nomeado pra persistir dados do DB. Conecte via DNS interno (postgres://user:pass@db:5432/app). Suba com docker compose up, derrube com docker compose down (volume persiste), suba de novo e confirme que dados continuam.",
      concepts: ["services", "depends_on", "healthcheck", "service_healthy", "volume nomeado", "DNS interno"],
      hint: "healthcheck.test: ['CMD-SHELL', 'pg_isready -U app'] no postgres. depends_on: db: condition: service_healthy na api. volumes top-level com db_data: {} declarado. Sem condition: service_healthy, api crasha porque sobe antes do Postgres aceitar conexão.",
      relatedKeypoints: [0, 1, 2],
    },
    {
      level: 'intermediario',
      title: "Override files — separar dev e prod",
      description: "Refatore um compose.yaml monolítico em compose.yaml (base) + compose.override.yaml (dev) + compose.prod.yaml (prod). Em dev: build local, bind mount pra hot reload, NODE_ENV=development. Em prod: image pull com tag SHA, restart always, mem_limit. Valide com docker compose config (mostra o YAML final mergido) e teste subir nos dois modos.",
      concepts: ["compose.override.yaml", "-f múltiplos", "merge de chaves", "config command", "ambientes"],
      hint: "compose.override.yaml é carregado automático com docker compose up. Pra prod, use docker compose -f compose.yaml -f compose.prod.yaml up. Listas (volumes, ports) concatenam; mapas (environment) mergem. Use docker compose -f compose.yaml -f compose.prod.yaml config pra ver o resultado.",
      relatedKeypoints: [4],
    },
    {
      level: 'intermediario',
      title: "Profiles e debug tools",
      description: "Em uma stack existente (api + db), adicione adminer (UI pra Postgres), mailhog (capture de SMTP) e jaeger (tracing) com profile debug. Por padrão docker compose up só sobe core. docker compose --profile debug up sobe tudo. Documente no README quais profiles existem e quando usar.",
      concepts: ["profiles", "ambientes opcionais", "debug tools", "DX local"],
      hint: "Adicione profiles: [debug] em adminer/mailhog/jaeger. Múltiplos profiles aceitos: --profile debug --profile tracing. Em CI, normalmente nenhum profile (core só). Em dev pesado, ligue conforme precisar.",
      relatedKeypoints: [3],
    },
    {
      level: 'senior',
      title: "Networks isoladas estilo VPC",
      description: "Refatore stack com 4 serviços (frontend, api, db, redis) pra usar 2 networks: frontend-net (frontend + api) e backend-net (api + db + redis). Confirme que: (1) frontend NÃO consegue alcançar db nem por nome nem por IP; (2) api funciona como ponte; (3) backend-net com internal: true não tem saída pra internet. Teste com docker compose exec frontend curl db:5432 (deve falhar) e docker compose exec api curl db:5432 (deve responder).",
      concepts: ["networks customizadas", "isolamento", "internal: true", "service discovery", "defesa em profundidade"],
      hint: "Cada serviço lista as networks em que participa. api participa de duas (ponte). db só backend-net. Pra testar isolamento: docker compose exec frontend nslookup db deve falhar (sem DNS resolution) — só serviços na mesma rede se enxergam.",
      relatedKeypoints: [5],
    },
    {
      level: 'senior',
      title: "Compose pra teste integrado em CI",
      description: "Configure compose.test.yaml otimizado pra CI: tmpfs em /var/lib/postgresql/data (ramdisk), healthcheck rápido (interval 2s), --abort-on-container-exit no comando, postgres trust auth, sem volumes persistentes. Adicione step no .github/workflows/ci.yml que sobe a pilha, roda testes, captura logs em failure, derruba tudo. Tempo total deve ser < 1 minuto.",
      concepts: ["tmpfs", "--wait", "--abort-on-container-exit", "exit-code-from", "CI optimization"],
      hint: "tmpfs: ['/var/lib/postgresql/data'] no service db pra ramdisk. POSTGRES_HOST_AUTH_METHOD=trust pra não precisar senha. docker compose -f compose.test.yaml up --abort-on-container-exit --exit-code-from test propaga exit code do test. Em failure, capture logs antes de down.",
      relatedKeypoints: [9],
    },
  ],
  mnemonics: [
    {
      label: "depends_on tem 3 níveis — 2 são teatro",
      trick: "started · healthy · completed",
      explanation: "depends_on sem condition espera só o container iniciar (PID 1 começou) — teatro de dependência. condition: service_started é o mesmo, mas explícito. condition: service_healthy espera healthcheck retornar OK — esse é o real. condition: service_completed_successfully espera serviço one-shot terminar com exit 0 (útil pra migrations). Regra: pra DB, sempre service_healthy + healthcheck no DB. Sem isso, app sobe antes do banco aceitar conexão.",
    },
    {
      label: "Override files — DRY · DEV · PROD",
      trick: "compose.yaml + compose.override.yaml (auto) + compose.prod.yaml (-f)",
      explanation: "Estratégia DRY: compose.yaml tem o comum. compose.override.yaml tem dev — Compose carrega automaticamente. compose.prod.yaml é explícito via -f. Listas (volumes, ports) concatenam; mapas (environment) mergem por chave. Pra ver o resultado mergido: docker compose -f compose.yaml -f compose.prod.yaml config. Quando merge não basta, !reset (Compose v2.24+) limpa a chave herdada.",
    },
    {
      label: "Bind vs Volume — HOST vs DOCKER",
      trick: "./path:/app (bind) vs name:/app (volume)",
      explanation: "Bind mount referencia path do host — mudança no host reflete no container imediato (ótimo pra hot reload), perf ruim no Docker Desktop, não portável. Volume nomeado é storage gerenciado pelo Docker em /var/lib/docker/volumes/, sobrevive a down sem -v, perf melhor, portável, suporta drivers (nfs, cloud). Regra: dev = bind no código + volume anônimo no node_modules; prod = volume nomeado pra dado persistente (DB, uploads); config = bind read-only.",
    },
    {
      label: "Networks — F.A.S.T (Frontend / API / Storage / Tracing)",
      trick: "rede por camada, não rede única",
      explanation: "Por default tudo numa rede — antipattern. Separe: frontend-net (frontend + api), backend-net (api + db + redis), tracing-net (apps + jaeger). Api é ponte (em duas redes), db isolado. internal: true em backend-net bloqueia saída pra internet — defesa em profundidade. Emula o que VPC faz: subnets públicas vs privadas. Reduz blast radius de SSRF e movimento lateral.",
    },
  ],
}

export default dockerCompose
