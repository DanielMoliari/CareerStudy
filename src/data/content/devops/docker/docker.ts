import type { SkillContent } from '@/types'

const docker: SkillContent = {
  tagline: "Container runtime que padronizou empacotar e rodar aplicação em qualquer lugar.",
  why: "Docker é a língua comum entre dev e ops. Sênior precisa entender layers, build cache, multi-stage, networking, volumes, e como evitar imagem de 2 GB que demora 5 minutos para subir. Cai pergunta de segurança (root user, secrets em layer), de otimização (multi-stage, alpine, distroless) e de arquitetura interna (namespaces, cgroups, containerd). Entender o stack completo — do runc ao Compose — diferencia sênior de pleno em entrevistas técnicas de DevOps e backend.",
  prerequisite: "Linux básico (processos, permissões, filesystem, rede), noção de como um processo roda no SO. Ter rodado pelo menos docker run e docker build uma vez — não precisa ser expert, mas precisa sentir o fluxo antes de estudar os internos.",
  summary: "Docker empacota aplicação + dependências em uma imagem (filesystem em camadas imutáveis) que vira container (processo isolado via namespaces + cgroups do Linux). O Dockerfile descreve a imagem em etapas; cada instrução RUN, COPY e ADD gera uma layer cacheada. Imagem boa é pequena, específica e reproduzível: base alpine ou distroless, multi-stage build para separar toolchain do runtime, .dockerignore para excluir lixo, USER não-root, HEALTHCHECK declarado. Em produção, ninguém usa Docker Engine direto: um orquestrador (Kubernetes, ECS, Nomad) chama via runtime (containerd, CRI-O) que delega ao runc. Docker Compose é o orquestrador local — sobe pilha inteira com um arquivo YAML.",
  howToStudy: "<strong>Tem 30 minutos antes de uma entrevista?</strong> Revise o diagrama de arquitetura (layers de abstração), varra os gotchas e treine as Q&As de nível pleno em voz alta. Se sobrar tempo, passe pelas de <strong>nível sênior</strong> sobre namespaces, cgroups e segurança.<br><br><strong>Tem um fim de semana?</strong> Leia o mapa mental, depois os 3 diagramas em ordem. Com o terminal aberto ao lado, reproduza cada exemplo do Cookbook: crie um Dockerfile multi-stage do zero, rode um Compose com healthcheck, inspecione redes e volumes com comandos do cheatsheet.<br><br><strong>Tem uma semana?</strong> Siga a sequência completa desta aba do topo ao fundo. Ao terminar o Cookbook, construa uma imagem Node.js + Go de produção do zero sem consultar — depois compare com as boas práticas do diagrama 2.",
  diagrams: [
    {
      title: "Arquitetura Docker — do daemon ao runc, namespaces e cgroups",
      html: `<style>
.dk1-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.dk1-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(100,116,139,.5);display:inline}
.dk1-tip:hover .dk1-tb{display:block}
.dk1-tb{display:none;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:230px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.dk1-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
.dk1-layer{border-radius:8px;padding:11px 14px;margin-bottom:8px;border:1px solid}
.dk1-arrow{text-align:center;color:#334155;font-size:13px;margin:0 0 8px}
</style>
<div class="dk1-wrap">
<p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Arquitetura Docker — stack de abstração</p>
<p style="color:#475569;font-size:10px;margin:0 0 18px">Passe o mouse nos termos <span style="border-bottom:1px dashed rgba(100,116,139,.5)">sublinhados</span> para ver a explicação</p>

<!-- CLI -->
<div class="dk1-layer" style="background:rgba(36,150,237,.08);border-color:rgba(36,150,237,.3)">
  <div style="font-size:10px;color:#2496ED;font-weight:700;letter-spacing:.08em;margin-bottom:6px">VOCÊ — CLI / SDK / Compose</div>
  <div style="font-size:11px;color:#94a3b8;line-height:1.7">
    <span class="dk1-tip">docker build<span class="dk1-tb">Chama o Docker daemon via socket Unix (/var/run/docker.sock). O daemon ou o BuildKit daemon constrói a imagem layer por layer seguindo o Dockerfile.</span></span> &nbsp;·&nbsp;
    <span class="dk1-tip">docker run<span class="dk1-tb">Cria e inicia um container: puxa a imagem (se não tiver), cria o filesystem, configura namespaces e cgroups, e inicia o processo via runc.</span></span> &nbsp;·&nbsp;
    <span class="dk1-tip">docker compose up<span class="dk1-tb">Lê o compose.yaml, cria redes e volumes, e chama docker run para cada serviço na ordem correta (respeitando depends_on).</span></span>
  </div>
</div>
<div class="dk1-arrow">▼</div>

<!-- Docker daemon -->
<div class="dk1-layer" style="background:rgba(36,150,237,.06);border-color:rgba(36,150,237,.2)">
  <div style="font-size:10px;color:#2496ED;font-weight:700;letter-spacing:.08em;margin-bottom:6px">DOCKER DAEMON (dockerd)</div>
  <div style="font-size:11px;color:#94a3b8;line-height:1.7">
    <span class="dk1-tip">API REST<span class="dk1-tb">O daemon expõe API REST via socket Unix. A CLI, SDKs e ferramentas como Portainer conversam via esse socket. Em produção esse socket é protegido — acesso a ele equivale a root no host.</span></span> &nbsp;·&nbsp;
    <span class="dk1-tip">Image store<span class="dk1-tb">Gerencia layers em /var/lib/docker/overlay2/ usando overlay2 filesystem. Cada layer é um diretório diff. Containers compartilham layers read-only da imagem base.</span></span> &nbsp;·&nbsp;
    <span class="dk1-tip">Volume/Network mgmt<span class="dk1-tb">Gerencia volumes nomeados e redes (bridge, overlay, macvlan). A criação de rede bridge cria uma interface virtual (docker0) no host com NAT via iptables.</span></span>
  </div>
</div>
<div class="dk1-arrow">▼</div>

<!-- containerd -->
<div class="dk1-layer" style="background:rgba(100,116,139,.06);border-color:#334155">
  <div style="font-size:10px;color:#94a3b8;font-weight:700;letter-spacing:.08em;margin-bottom:6px">CONTAINERD (runtime de alto nível)</div>
  <div style="font-size:11px;color:#64748b;line-height:1.7">
    <span class="dk1-tip">CRI<span class="dk1-tb">Container Runtime Interface — a API que o Kubernetes usa para falar com containerd diretamente, sem o Docker daemon. Em clusters K8s modernos, dockerd não existe mais na cadeia.</span></span> &nbsp;·&nbsp;
    <span class="dk1-tip">Snapshotter<span class="dk1-tb">Gerencia snapshots de filesystem (layers) de forma plugável. Suporta overlayfs, btrfs, zfs. Em produção Linux usa overlayfs2 que é copy-on-write eficiente.</span></span> &nbsp;·&nbsp;
    <span class="dk1-tip">Image pull/push<span class="dk1-tb">Gerencia download de imagens de registries (Docker Hub, ECR, GCR) via protocolo OCI Distribution Spec. Verifica assinaturas e digests.</span></span>
  </div>
</div>
<div class="dk1-arrow">▼</div>

<!-- runc -->
<div class="dk1-layer" style="background:rgba(74,222,128,.04);border-color:rgba(74,222,128,.2)">
  <div style="font-size:10px;color:#4ade80;font-weight:700;letter-spacing:.08em;margin-bottom:6px">RUNC (runtime de baixo nível — OCI Runtime)</div>
  <div style="font-size:11px;color:#64748b;line-height:1.7">
    <span class="dk1-tip">namespaces<span class="dk1-tb">Linux namespaces isolam visibilidade: PID (processo vê só si mesmo), NET (interface de rede própria), MNT (filesystem isolado), UTS (hostname próprio), IPC (memória compartilhada isolada), USER (mapeamento de UID). É por isso que dentro do container você parece root mesmo não sendo root no host.</span></span> &nbsp;·&nbsp;
    <span class="dk1-tip">cgroups<span class="dk1-tb">Control Groups limitam recursos: CPU (--cpus=0.5 usa cgroup cpu.max), memória (--memory=256m usa memory.limit_in_bytes), I/O de disco, rede. Sem cgroup limit, um container pode consumir todos os recursos do host e derrubar outros.</span></span> &nbsp;·&nbsp;
    <span class="dk1-tip">seccomp / AppArmor<span class="dk1-tb">Seccomp filtra syscalls permitidas pelo container (perfil padrão bloqueia ~44 syscalls perigosas). AppArmor (Ubuntu) ou SELinux (RHEL) adiciona controle de acesso mandatório. Ambos reduzem superfície de ataque mesmo se o processo escapar do namespace.</span></span>
  </div>
</div>
<div class="dk1-arrow">▼</div>

<!-- Kernel -->
<div class="dk1-layer" style="background:rgba(239,68,68,.04);border-color:rgba(239,68,68,.15)">
  <div style="font-size:10px;color:#ef4444;font-weight:700;letter-spacing:.08em;margin-bottom:6px">KERNEL LINUX (compartilhado por todos os containers)</div>
  <div style="font-size:11px;color:#64748b;line-height:1.7">Todos os containers compartilham o mesmo kernel do host. Isso é a principal diferença de VM. Se o kernel cair, todos caem. Por isso em multi-tenant não confiável (SaaS compartilhado) usa-se <span class="dk1-tip">gVisor<span class="dk1-tb">gVisor (Google) é um kernel em userspace que intercepta syscalls do container antes de chegar ao kernel real. Isolamento próximo ao de VM com performance próxima a container. Usado no Cloud Run e GKE Sandbox.</span></span> ou <span class="dk1-tip">Kata Containers<span class="dk1-tb">Kata Containers coloca cada container dentro de uma VM leve (QEMU/KVM). Kernel próprio por container — isolamento forte de VM com gerenciamento de container. Overhead maior que gVisor.</span></span> para isolamento mais forte.</div>
</div>

<div style="margin-top:14px;background:#1e293b;border-radius:8px;padding:12px 14px;border:1px solid #1e3a5f">
  <div style="font-size:9px;color:#3b82f6;letter-spacing:.1em;font-weight:600;margin-bottom:8px;text-transform:uppercase">Container vs VM — diferença fundamental</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:11px;color:#64748b;line-height:1.6">
    <div><span style="color:#4ade80;font-weight:700">Container:</span> processo isolado via namespaces/cgroups. Kernel compartilhado. Boot em ms. Imagem em MB. Densidade alta (100+ por host).</div>
    <div><span style="color:#f59e0b;font-weight:700">VM:</span> sistema operacional completo com kernel próprio via hypervisor. Boot em segundos. Imagem em GB. Isolamento mais forte. Em prod: container DENTRO de VM.</div>
  </div>
</div>
</div>`,
      caption: "O Docker daemon não é o runtime — ele delega ao containerd que delega ao runc. Em Kubernetes, o daemon some da cadeia: kubelet fala direto com containerd via CRI. Entender essa stack responde 'o que acontece quando você faz docker run'.",
    },
    {
      title: "Image layers — como o cache funciona e copy-on-write",
      html: `<style>
.dk2-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.dk2-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(100,116,139,.5);display:inline}
.dk2-tip:hover .dk2-tb{display:block}
.dk2-tb{display:none;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:220px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.dk2-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
.dk2-layer-box{border-radius:6px;padding:9px 13px;margin-bottom:5px;font-size:11px;border:1px solid}
@keyframes dk2-invalidate{0%,100%{background:rgba(239,68,68,.04);border-color:rgba(239,68,68,.2)}50%{background:rgba(239,68,68,.15);border-color:rgba(239,68,68,.5)}}
.dk2-invalid{animation:dk2-invalidate 2s ease-in-out infinite}
</style>
<div class="dk2-wrap">
<p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Image layers — cache, invalidação e copy-on-write</p>
<p style="color:#475569;font-size:10px;margin:0 0 16px">Cada instrução Dockerfile vira uma layer. A ordem importa para o cache.</p>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
  <!-- Coluna esquerda: Dockerfile -->
  <div>
    <div style="font-size:9px;color:#64748b;letter-spacing:.1em;margin-bottom:8px;text-transform:uppercase">Dockerfile — ordem otimizada</div>
    <div class="dk2-layer-box" style="background:rgba(100,116,139,.08);border-color:#334155;color:#64748b">
      <span style="color:#4ade80">FROM</span> node:20-alpine
      <div style="font-size:9px;color:#475569;margin-top:3px">← base puxada do registry uma vez</div>
    </div>
    <div class="dk2-layer-box" style="background:rgba(100,116,139,.08);border-color:#334155;color:#64748b">
      <span style="color:#4ade80">RUN</span> apk add --no-cache dumb-init
      <div style="font-size:9px;color:#475569;margin-top:3px">← muda raramente → cache estável</div>
    </div>
    <div class="dk2-layer-box" style="background:rgba(36,150,237,.06);border-color:rgba(36,150,237,.25);color:#94a3b8">
      <span class="dk2-tip"><span style="color:#2496ED">COPY</span> package*.json ./<span class="dk2-tb">Copia SOMENTE o manifesto de dependências. Se o código-fonte mudar mas o package.json não mudar, esta layer é reutilizada do cache — npm install não roda de novo.</span></span>
      <div style="font-size:9px;color:#475569;margin-top:3px">← manifesto separado = cache inteligente</div>
    </div>
    <div class="dk2-layer-box" style="background:rgba(36,150,237,.06);border-color:rgba(36,150,237,.25);color:#94a3b8">
      <span style="color:#2496ED">RUN</span> npm ci --only=production
      <div style="font-size:9px;color:#475569;margin-top:3px">← só roda quando package.json muda</div>
    </div>
    <div class="dk2-layer-box dk2-invalid" style="color:#f87171">
      <span style="color:#ef4444">COPY</span> . .
      <div style="font-size:9px;color:#f87171;margin-top:3px">← qualquer mudança de código invalida daqui pra baixo</div>
    </div>
    <div class="dk2-layer-box dk2-invalid" style="color:#f87171">
      <span style="color:#ef4444">CMD</span> ["node", "server.js"]
      <div style="font-size:9px;color:#f87171;margin-top:3px">← rebuilda junto com COPY . .</div>
    </div>
  </div>

  <!-- Coluna direita: layers no disco -->
  <div>
    <div style="font-size:9px;color:#64748b;letter-spacing:.1em;margin-bottom:8px;text-transform:uppercase">Layers no disco (overlay2)</div>
    <div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px;font-size:11px;color:#64748b;line-height:1.8;margin-bottom:10px">
      <div style="color:#4ade80;font-weight:700;margin-bottom:4px">Imagem A (node:20-alpine)</div>
      <div>layer-sha256:aa11 &nbsp;<span style="color:#334155">read-only</span></div>
      <div>layer-sha256:bb22 &nbsp;<span style="color:#334155">read-only</span></div>
      <div style="margin-top:8px;color:#2496ED;font-weight:700">Imagem B (minha-app)</div>
      <div>layer-sha256:aa11 &nbsp;<span style="color:#2496ED">compartilhada ↑</span></div>
      <div>layer-sha256:bb22 &nbsp;<span style="color:#2496ED">compartilhada ↑</span></div>
      <div>layer-sha256:cc33 &nbsp;<span style="color:#334155">apk add</span></div>
      <div>layer-sha256:dd44 &nbsp;<span style="color:#334155">npm ci</span></div>
      <div>layer-sha256:ee55 &nbsp;<span style="color:#ef4444">código fonte</span></div>
    </div>
    <div style="background:rgba(74,222,128,.05);border:1px solid rgba(74,222,128,.2);border-radius:8px;padding:10px 12px;font-size:10.5px;color:#4ade80;line-height:1.6">
      <strong>Copy-on-write:</strong> <span style="color:#64748b">quando o container escreve em um arquivo read-only da imagem, o overlay2 copia o arquivo para a <span class="dk2-tip">writable layer<span class="dk2-tb">A layer de escrita (container layer) existe apenas enquanto o container está rodando. É destruída quando o container é removido — dados não salvos em volume se perdem. É por isso que dados persistentes devem ir para volumes Docker.</span></span> do container antes de modificar. As layers da imagem nunca são alteradas — múltiplos containers compartilham o mesmo filesystem base sem conflito.</span>
    </div>
  </div>
</div>

<div style="margin-top:14px;background:#1e293b;border:1px solid #1e3a5f;border-radius:8px;padding:12px 14px">
  <div style="font-size:9px;color:#f59e0b;letter-spacing:.1em;font-weight:600;margin-bottom:8px;text-transform:uppercase">Antipadrão vs padrão de cache</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:11px;line-height:1.6">
    <div style="border:1px solid rgba(239,68,68,.3);border-radius:6px;padding:9px 11px;background:rgba(239,68,68,.04)">
      <div style="color:#ef4444;font-weight:700;margin-bottom:4px">✗ Errado — cache sempre invalida</div>
      <div style="color:#64748b">
        COPY . . <span style="color:#ef4444">&nbsp;← primeiro</span><br>
        RUN npm install &nbsp;<span style="color:#ef4444">← rebuilda sempre</span>
      </div>
    </div>
    <div style="border:1px solid rgba(74,222,128,.3);border-radius:6px;padding:9px 11px;background:rgba(74,222,128,.04)">
      <div style="color:#4ade80;font-weight:700;margin-bottom:4px">✓ Certo — npm install cacheado</div>
      <div style="color:#64748b">
        COPY package*.json ./ &nbsp;<span style="color:#4ade80">← manifesto</span><br>
        RUN npm ci &nbsp;<span style="color:#4ade80">← só quando muda</span><br>
        COPY . . &nbsp;<span style="color:#4ade80">← código por último</span>
      </div>
    </div>
  </div>
</div>
</div>`,
      caption: "A ordem das instruções no Dockerfile é o principal fator de performance de build. Coloque o que muda menos primeiro, o código-fonte por último. Com BuildKit, use --mount=type=cache para caches de pacotes que nem aparecem nas layers.",
    },
    {
      title: "Networking Docker — bridge, host, overlay e como containers se comunicam",
      html: `<style>
.dk3-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.dk3-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(100,116,139,.5);display:inline}
.dk3-tip:hover .dk3-tb{display:block}
.dk3-tb{display:none;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:230px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.dk3-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
.dk3-host{background:#1e293b;border:2px solid #334155;border-radius:10px;padding:14px}
.dk3-net{border-radius:8px;padding:10px 12px;margin-top:10px;border:1px solid}
.dk3-container{background:#0f172a;border:1px solid;border-radius:6px;padding:7px 10px;font-size:10px;display:inline-block;margin:3px}
</style>
<div class="dk3-wrap">
<p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Networking Docker — modos e comunicação entre containers</p>
<p style="color:#475569;font-size:10px;margin:0 0 16px">Passe o mouse nos termos <span style="border-bottom:1px dashed rgba(100,116,139,.5)">sublinhados</span></p>

<div class="dk3-host">
  <div style="font-size:9px;color:#64748b;letter-spacing:.1em;font-weight:700;margin-bottom:10px">HOST LINUX (172.17.0.1 = docker0)</div>

  <!-- Bridge network -->
  <div class="dk3-net" style="background:rgba(36,150,237,.06);border-color:rgba(36,150,237,.3)">
    <div style="font-size:10px;color:#2496ED;font-weight:700;margin-bottom:6px">
      <span class="dk3-tip">Bridge network (user-defined)<span class="dk3-tb">Rede virtual isolada criada pelo Docker. Containers na mesma bridge se enxergam por nome via DNS interno. Containers em bridges diferentes não se comunicam sem roteamento explícito. Prefira user-defined bridge em vez da bridge padrão (docker0) — a padrão não tem DNS por nome.</span></span>
      &nbsp;<span style="color:#334155;font-size:9px">— recomendado para Compose</span>
    </div>
    <div>
      <div class="dk3-container" style="border-color:rgba(36,150,237,.4);color:#94a3b8">
        <div style="color:#2496ED">api</div>
        <div>172.20.0.2</div>
        <div style="color:#475569;font-size:9px">porta 3000 interna</div>
      </div>
      <span style="color:#2496ED;margin:0 5px">←→ DNS</span>
      <div class="dk3-container" style="border-color:rgba(36,150,237,.4);color:#94a3b8">
        <div style="color:#2496ED">db</div>
        <div>172.20.0.3</div>
        <div style="color:#475569;font-size:9px">porta 5432 interna</div>
      </div>
      <div style="font-size:9px;color:#475569;margin-top:5px">api conecta em <span style="color:#4ade80">db:5432</span> — sem IP fixo, só o nome do serviço</div>
    </div>
  </div>

  <!-- Host network -->
  <div class="dk3-net" style="background:rgba(239,68,68,.04);border-color:rgba(239,68,68,.2)">
    <div style="font-size:10px;color:#ef4444;font-weight:700;margin-bottom:6px">
      <span class="dk3-tip">Host network<span class="dk3-tb">Container compartilha a pilha de rede do host diretamente — sem NAT, sem namespace de rede. Máxima performance de rede. Risco: porta do container fica exposta no host sem -p explícito. Comum em monitoring (Prometheus node exporter) que precisa ver a rede real do host.</span></span>
    </div>
    <div class="dk3-container" style="border-color:rgba(239,68,68,.3);color:#94a3b8">
      <div style="color:#ef4444">monitor</div>
      <div style="color:#475569;font-size:9px">usa eth0 do host diretamente</div>
      <div style="color:#475569;font-size:9px">sem NAT, sem isolamento de rede</div>
    </div>
  </div>

  <!-- Overlay -->
  <div class="dk3-net" style="background:rgba(74,222,128,.04);border-color:rgba(74,222,128,.2)">
    <div style="font-size:10px;color:#4ade80;font-weight:700;margin-bottom:6px">
      <span class="dk3-tip">Overlay network (multi-host)<span class="dk3-tb">Rede virtual que conecta containers em hosts diferentes via encapsulamento VXLAN. Necessário em Docker Swarm ou K8s. Os containers se enxergam por nome mesmo estando em máquinas físicas distintas. Em K8s é implementado pelo CNI plugin (Calico, Flannel, Cilium).</span></span>
      &nbsp;<span style="color:#334155;font-size:9px">— Swarm / multi-host</span>
    </div>
    <div style="font-size:11px;color:#64748b;line-height:1.6">
      Host A: <div class="dk3-container" style="border-color:rgba(74,222,128,.3);color:#94a3b8;display:inline-flex">app (10.0.0.2)</div>
      <span style="color:#4ade80;margin:0 5px">─ VXLAN ─</span>
      Host B: <div class="dk3-container" style="border-color:rgba(74,222,128,.3);color:#94a3b8;display:inline-flex">cache (10.0.0.5)</div>
    </div>
  </div>
</div>

<!-- Port mapping -->
<div style="margin-top:12px;background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px 14px">
  <div style="font-size:9px;color:#f59e0b;letter-spacing:.1em;font-weight:600;margin-bottom:8px;text-transform:uppercase">Port mapping — como o mundo externo acessa o container</div>
  <div style="font-size:11px;color:#64748b;line-height:1.8">
    <span style="color:#94a3b8">docker run -p <span class="dk3-tip">8080<span class="dk3-tb">Porta no HOST — é o que o mundo externo acessa. Pode ser qualquer porta livre no host.</span></span>:<span class="dk3-tip">3000<span class="dk3-tb">Porta DENTRO do container — a que a aplicação escuta internamente. EXPOSE no Dockerfile apenas documenta; não abre a porta automaticamente.</span></span> minha-api</span>
    <br>
    <span style="color:#475569;font-size:10px">NAT via iptables: tráfego em :8080 do host é redirecionado para :3000 do container via regra DNAT</span><br>
    <span style="color:#475569;font-size:10px">Entre containers na mesma rede bridge: comunicam diretamente por nome, sem passar pelo host</span>
  </div>
</div>

<!-- Tabela de modos -->
<div style="margin-top:10px;display:grid;grid-template-columns:repeat(4,1fr);gap:6px">
  <div style="background:#1e293b;border:1px solid #334155;border-radius:6px;padding:8px 10px;font-size:10px">
    <div style="color:#2496ED;font-weight:700;margin-bottom:3px">bridge</div>
    <div style="color:#64748b">Isolado, DNS por nome, NAT. Padrão e recomendado.</div>
  </div>
  <div style="background:#1e293b;border:1px solid #334155;border-radius:6px;padding:8px 10px;font-size:10px">
    <div style="color:#ef4444;font-weight:700;margin-bottom:3px">host</div>
    <div style="color:#64748b">Sem isolamento de rede. Máxima performance. Uso específico.</div>
  </div>
  <div style="background:#1e293b;border:1px solid #334155;border-radius:6px;padding:8px 10px;font-size:10px">
    <div style="color:#4ade80;font-weight:700;margin-bottom:3px">overlay</div>
    <div style="color:#64748b">Multi-host via VXLAN. Swarm e K8s CNI.</div>
  </div>
  <div style="background:#1e293b;border:1px solid #334155;border-radius:6px;padding:8px 10px;font-size:10px">
    <div style="color:#64748b;font-weight:700;margin-bottom:3px">none</div>
    <div style="color:#64748b">Sem rede. Container completamente isolado da rede.</div>
  </div>
</div>
</div>`,
      caption: "Containers na mesma user-defined bridge se enxergam por nome de serviço via DNS interno do Docker. Containers em redes diferentes não se comunicam sem roteamento explícito — use isso para separar frontend da rede do banco de dados.",
    },
  ],
  keypoints: [
    {
      title: "Imagem vs container — blueprint e instância",
      body: "Imagem é o blueprint imutável: sistema de arquivos em camadas read-only mais metadados (CMD, ENTRYPOINT, ENV, EXPOSE). Container é a instância em execução: processo isolado com as layers da imagem + uma writable layer no topo (overlay2 copy-on-write). Mesma imagem pode rodar N containers idênticos em paralelo — todos compartilham as mesmas layers read-only, economizando disco.",
      code: `# ver layers de uma imagem e seus tamanhos
docker history node:20-alpine
# ver diff entre imagem e container em execução
docker diff meu-container
# inspecionar metadados da imagem
docker inspect minha-imagem | jq '.[0].Config'`,
    },
    {
      title: "Layer cache — a ordem das instruções é performance",
      body: "Cada instrução RUN, COPY, ADD gera uma layer com hash baseado no conteúdo. Se o hash é o mesmo da build anterior, Docker reutiliza do cache. A primeira instrução que invalida o cache invalida todas as seguintes. Regra de ouro: ordem crescente de volatilidade — o que muda menos vem primeiro (base, sistema, dependências), o que muda mais vem por último (código-fonte). BuildKit adiciona cache mounts (--mount=type=cache) que não aparecem nas layers.",
      code: `# BuildKit cache mount — não aparece na layer final
RUN --mount=type=cache,target=/root/.npm \\
  npm ci

# verificar cache hit no build
DOCKER_BUILDKIT=1 docker build --progress=plain .`,
    },
    {
      title: "Multi-stage build — separe toolchain de runtime",
      body: "Multi-stage usa vários FROM no mesmo Dockerfile. O estágio de build tem compiladores, bundlers, test runners — tudo que é necessário para produzir o artefato. O estágio final copia só o artefato e tem apenas o runtime necessário. Imagem cai de 1+ GB para 20-100 MB. Disponível desde Docker 17.05.",
      code: `# Exemplo Node.js — estágio de build vs runtime
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runtime
RUN addgroup -S app && adduser -S app -G app
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
USER app
EXPOSE 3000
HEALTHCHECK CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["node", "dist/server.js"]`,
    },
    {
      title: "Segurança — root, secrets, scan",
      body: "Rodar como root dentro do container é o antipadrão mais perigoso: se houver escape do namespace, o processo tem root no host. Sempre declare USER com UID numérico. Secrets nunca em ENV ou ARG — ficam gravados na layer para sempre e qualquer um com acesso à imagem extrai com docker history. Use BuildKit secret mount durante o build e variáveis de ambiente em runtime vindas de Vault/Secrets Manager. Escaneie imagens com trivy ou docker scout antes de publicar.",
      code: `# BuildKit secret mount — segredo não aparece em nenhuma layer
RUN --mount=type=secret,id=npmrc \\
  cp /run/secrets/npmrc ~/.npmrc && npm ci && rm ~/.npmrc

# Build com secret
docker build --secret id=npmrc,src=$HOME/.npmrc .

# Scan de vulnerabilidades
trivy image minha-imagem:latest
docker scout cves minha-imagem:latest`,
    },
    {
      title: "Volumes vs bind mounts — persistência e dev workflow",
      body: "Volume Docker é gerenciado pelo daemon — dados ficam em /var/lib/docker/volumes/ e sobrevivem ao container. É portável e funciona em qualquer host. Bind mount mapeia um path do host para dentro do container — ideal em desenvolvimento para hot-reload (mudança no source reflete imediatamente). tmpfs é efêmero (em memória) — útil para dados sensíveis que não devem tocar disco. Em produção: volume para dados persistentes (banco), bind para desenvolvimento.",
      code: `# Volume nomeado — banco de dados em prod
docker run -v postgres_data:/var/lib/postgresql/data postgres:16

# Bind mount — hot-reload em dev
docker run -v $(pwd)/src:/app/src -p 3000:3000 minha-app

# tmpfs — dado sensível não toca disco
docker run --tmpfs /tmp minha-app

# inspecionar volume
docker volume inspect postgres_data`,
    },
    {
      title: "HEALTHCHECK — container sabe se está saudável",
      body: "HEALTHCHECK define um comando que o daemon executa periodicamente para avaliar se o container está saudável. Estados: starting, healthy, unhealthy. Docker Compose usa isso no depends_on com condition: service_healthy. Kubernetes usa readiness/liveness probes que substituem o HEALTHCHECK do Docker. Um container unhealthy permanece rodando — é o orquestrador que decide reiniciar ou tirar do pool.",
      code: `# No Dockerfile
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \\
CMD wget -qO- http://localhost:3000/health || exit 1

# No Compose — depends_on aguarda healthy
services:
api:
  depends_on:
    db:
      condition: service_healthy
db:
  healthcheck:
    test: ["CMD", "pg_isready", "-U", "postgres"]
    interval: 10s
    timeout: 5s
    retries: 5`,
    },
    {
      title: "BuildKit — build engine moderno",
      body: "BuildKit é o build engine padrão desde Docker 23.x. Vantagens sobre o builder legado: paralelismo real entre estágios independentes, cache mounts que aceleram npm/pip/cargo sem aparecer em layers, secret mounts para credenciais sem rastro, SSH mounts para clonar repos privados durante o build, e saídas alternativas (exportar filesystem diretamente para o host). Habilite com DOCKER_BUILDKIT=1 em versões antigas.",
      code: `# Cache mount para npm — node_modules persiste entre builds
RUN --mount=type=cache,target=/root/.npm \\
  npm ci --prefer-offline

# Cache mount para pip
RUN --mount=type=cache,target=/root/.cache/pip \\
  pip install -r requirements.txt

# SSH mount para repo privado
RUN --mount=type=ssh git clone git@github.com:org/repo.git

# Build paralelo de stages — BuildKit roda stages independentes em paralelo
FROM base AS test-stage
FROM base AS lint-stage
# ambos rodam ao mesmo tempo`,
    },
  ],
  gotchas: [
    "Rodar como root no container — se houver escape do namespace (exploit de kernel), o processo tem root no host. Sempre declare USER com UID numérico (não root, não nome) no Dockerfile.",
    "Colocar segredo em ENV ou ARG — fica gravado na layer para sempre. docker history minha-imagem revela o valor. Use BuildKit --mount=type=secret ou injete em runtime via Vault/Secrets Manager.",
    "Usar latest em produção — não é reproduzível. latest muda quando o mantenedor publica nova versão. Pin por digest (node@sha256:abc123...) ou tag semântica imutável.",
    "Cache de pacotes inflando a imagem — em apt, sempre combine update + install + rm -rf /var/lib/apt/lists/* em um único RUN. Cada RUN separado cria uma layer e o cache não pode ser removido depois.",
    "COPY . . antes de instalar dependências — invalida o cache de npm/pip em toda mudança de código. Copie o manifesto (package.json, requirements.txt) primeiro, instale, depois copie o código.",
    "PID 1 sem tratamento de signals — Node.js e Python como PID 1 não fazem reaping de zumbis e podem não tratar SIGTERM corretamente. Use tini (ENTRYPOINT [\"/sbin/tini\", \"--\"]) ou docker run --init.",
    "Sem .dockerignore — COPY . . copia node_modules, .git, .env, arquivos de teste para dentro da imagem. Sempre crie .dockerignore com node_modules, .git, *.log, .env, dist antigo.",
    "Imagem base mutable (node:20 sem digest) — o mantenedor pode publicar um patch com regressão. Em CI/CD, pin por digest e rode renovate/dependabot para atualizações controladas.",
  ],
  interview: [
    {
      q: "Qual a diferença entre container e VM? Quando usar cada um em produção?",
      level: "pleno",
      a: "<p>VM virtualiza hardware via hypervisor: cada VM tem kernel próprio, boot em segundos a minutos, imagem em GB. Container compartilha o kernel do host e isola via namespaces (PID, NET, MNT, UTS, IPC, USER) + cgroups (CPU, memória, I/O). Boot em milissegundos, imagem em MB.</p><p><strong>Tradeoffs:</strong> VM tem isolamento mais forte — kernel separado significa que uma VM comprometida não afeta as demais no hypervisor. Container é mais leve, mais denso (centenas por host vs dezenas de VMs), mas se o kernel Linux cair, todos os containers caem juntos.</p><p><strong>Em produção moderna:</strong> container dentro de VM (EKS rodando em EC2, GKE em GCE). Você tem a densidade do container com o isolamento perimetral da VM. Para multi-tenant não confiável (código de clientes diferentes rodando no mesmo hardware), adiciona gVisor ou Kata Containers.</p>",
      tip: "Mencione namespaces e cgroups pelo nome — demonstra que você entende o mecanismo, não só o conceito. Depois fale do modelo containers-dentro-de-VMs que é o padrão de produção. Candidatos que falam só de containers flutuando no hardware mostram que nunca operaram em cloud.",
    },
    {
      q: "Como você reduziria uma imagem Docker de 2 GB para menos de 200 MB?",
      level: "pleno",
      a: "<p>Ataco em ordem de impacto:</p><ol><li><strong>Multi-stage build:</strong> stage com toolchain (npm, gcc, maven) e stage final só com runtime + artefato compilado</li><li><strong>Base menor:</strong> trocar node:20 (~1 GB) por node:20-alpine (~65 MB) ou node:20-slim (~200 MB). Para Go/Rust com binário estático: stage final em scratch (0 bytes de SO)</li><li><strong>.dockerignore:</strong> excluir node_modules (reinstala no build), .git, tests, arquivos temporários do COPY . .</li><li><strong>Limpeza em apt:</strong> sempre --no-install-recommends + rm -rf /var/lib/apt/lists/* no mesmo RUN</li><li><strong>Combinar RUNs:</strong> cada RUN separado cria uma layer — cache temporário de uma operação some na mesma layer</li></ol><p>Para medir: docker history mostra peso por layer; ferramenta dive da treemap visual interativo de cada layer.</p>",
    },
    {
      q: "Como você protege um segredo durante o build de imagem?",
      level: "pleno",
      a: "<p><strong>Três abordagens erradas:</strong></p><ul><li>ENV SECRET=valor — gravado na layer, qualquer um com docker history extrai</li><li>ARG SECRET — mesma coisa, persiste no layer history</li><li>COPY .env . — arquivo fica dentro da imagem</li></ul><p><strong>Abordagem correta: BuildKit secret mount.</strong></p><pre style='font-size:10px;color:#4ade80'>RUN --mount=type=secret,id=npmrc \\<br>    cp /run/secrets/npmrc ~/.npmrc && npm ci && rm ~/.npmrc</pre><p>O segredo é montado como arquivo temporário durante o RUN e não persiste em nenhuma layer. Em CI: <code>docker build --secret id=npmrc,src=$HOME/.npmrc .</code></p><p>Em runtime, segredos vêm de Vault, AWS Secrets Manager ou variáveis de ambiente injetadas pelo orquestrador — nunca embutidos na imagem.</p>",
    },
    {
      q: "Explique como o layer cache funciona e por que a ordem das instruções no Dockerfile importa.",
      level: "pleno",
      a: "<p>Docker calcula um hash para cada instrução baseado no conteúdo da instrução + conteúdo dos arquivos copiados + hash da layer anterior. Se o hash bate com o da build anterior, Docker reutiliza a layer do cache. Se o hash muda, essa layer é reconstruída e <strong>todas as layers seguintes são invalidadas</strong> — mesmo que não tenham mudado.</p><p>Por isso a ordem importa: coloque o que muda menos primeiro. Exemplo clássico:</p><ul><li>COPY package.json ./ (muda só quando deps mudam) — layer cacheada</li><li>RUN npm ci — só roda quando package.json muda</li><li>COPY . . (muda a cada commit) — invalida daqui pra baixo</li></ul><p>Se você fizer COPY . . primeiro, npm ci rebuilda em todo commit. Com a ordem certa, só rebuilda quando package.json mudar. Em projeto ativo isso pode economizar 3-5 minutos por build no CI.</p>",
      tip: "Desenhe mentalmente ou explique verbalmente a cadeia: hash(instrução) + hash(contexto) = hash(layer). Se hash difere do cache, invalida. Candidatos que só sabem 'colocar dependencies antes do código' sem explicar o mecanismo de hash demonstram conhecimento superficial.",
    },
    {
      q: "O que são namespaces e cgroups e como o Docker os usa?",
      level: "senior",
      a: "<p>São recursos do kernel Linux que o Docker usa via runc para criar isolamento.</p><p><strong>Namespaces</strong> controlam visibilidade — o que o processo vê:</p><ul><li>PID namespace: processo vê apenas seus próprios filhos (PID 1 dentro do container)</li><li>NET namespace: interface de rede própria, tabela de rotas própria</li><li>MNT namespace: filesystem próprio (baseado nas layers da imagem)</li><li>UTS namespace: hostname e domainname próprios</li><li>IPC namespace: System V IPC e POSIX message queues isolados</li><li>USER namespace (opcional): mapeamento de UID — root (0) dentro do container vira UID 65534 no host</li></ul><p><strong>Cgroups</strong> controlam recursos — o quanto o processo pode consumir:</p><ul><li>cpu.max: limite de CPU (--cpus=0.5 = 50% de um core)</li><li>memory.limit_in_bytes: limite de memória (--memory=256m)</li><li>blkio: rate limit de I/O de disco</li></ul><p>Sem cgroups, um container poderia consumir todos os recursos do host e derrubar todos os outros. A combinação namespace (isolamento de visibilidade) + cgroup (isolamento de recursos) é o que torna containers seguros o suficiente para produção.</p>",
    },
    {
      q: "Como você debugaria um container que reinicia constantemente (CrashLoopBackOff em K8s ou Restarting em Docker)?",
      level: "pleno",
      a: "<p>Roteiro prático em Docker:</p><ol><li><code>docker ps -a</code> — ver status e exit code</li><li><code>docker logs --tail=100 container-id</code> — log da aplicação</li><li><code>docker inspect container-id | jq '.[0].State'</code> — exit code, OOMKilled, error</li></ol><p>Exit codes importantes: 137 = OOMKilled (aumentar --memory), 139 = segfault, 1 = erro da aplicação, 143 = SIGTERM (graceful shutdown ok, mas algo reiniciou).</p><p>Se o container sai imediatamente e não tem log: <code>docker run --rm -it --entrypoint sh minha-imagem</code> para inspecionar interativamente.</p><p>Se OOMKilled: <code>docker stats</code> para ver consumo em tempo real. Aumentar --memory ou ajustar heap da aplicação.</p><p>Se problema de startup: checar se ENTRYPOINT/CMD está correto com <code>docker inspect</code>. Liveness probe muito agressiva em K8s mata antes de subir — adicionar initialDelaySeconds ou startup probe.</p>",
    },
    {
      q: "Qual a diferença entre ENTRYPOINT e CMD? Quando usar cada um?",
      level: "pleno",
      a: "<p>ENTRYPOINT define o processo principal — o executável que o container roda. CMD define os argumentos padrão para o ENTRYPOINT, ou o comando completo se não houver ENTRYPOINT.</p><p>Quando você faz <code>docker run minha-imagem arg1</code>, arg1 <strong>substitui</strong> o CMD mas não o ENTRYPOINT. O ENTRYPOINT só é substituído com --entrypoint.</p><pre style='font-size:10px;color:#4ade80'>ENTRYPOINT [\"node\", \"server.js\"]\nCMD [\"--port=3000\"]  # padrão substituível</pre><p><code>docker run minha-imagem --port=8080</code> → executa <code>node server.js --port=8080</code></p><p><strong>Forma exec (array) vs shell:</strong> sempre prefira a forma exec ([\"node\", \"server.js\"]) — o processo recebe PID 1 e signals (SIGTERM) diretamente. A forma shell (node server.js) cria um shell como PID 1 que geralmente não repassa signals para o processo filho — causa problemas de graceful shutdown.</p><p><strong>Pattern com tini:</strong> ENTRYPOINT [\"/sbin/tini\", \"--\", \"node\", \"server.js\"] — tini vira PID 1, repassa signals corretamente e faz reaping de zumbis.</p>",
    },
    {
      q: "Como funciona o copy-on-write do overlay2? Por que é eficiente?",
      level: "senior",
      a: "<p>overlay2 é o storage driver padrão do Docker no Linux. Ele monta múltiplas camadas (layers) de filesystem usando o <strong>OverlayFS</strong> do kernel.</p><p>A estrutura: uma camada lower (read-only, layers da imagem) + uma camada upper (writable, exclusiva do container) + um merged (view unificada que o container vê).</p><p><strong>Copy-on-write:</strong> quando o container tenta escrever em um arquivo que existe na camada lower (imagem), o kernel primeiro copia o arquivo inteiro para a camada upper, depois modifica a cópia. O arquivo original na camada lower permanece intacto. Isso permite que centenas de containers compartilhem as mesmas layers da imagem sem conflito.</p><p><strong>Por que é eficiente:</strong></p><ul><li>Disco: 100 containers da mesma imagem compartilham as layers — sem duplicação</li><li>Pull: se você já tem node:20-alpine, um novo projeto que usa a mesma base não baixa de novo — layers são compartilhadas por hash</li><li>Escrita: cópia ocorre apenas no primeiro write a cada arquivo — reads subsequentes pegam da camada upper diretamente</li></ul><p>Limitação: containers com alto volume de writes criam camadas upper grandes. Para I/O intensivo (banco de dados), use volumes Docker — eles bypassam o overlay2 completamente.</p>",
    },
    {
      q: "Como configurar Docker Compose para produção? Quais as diferenças em relação ao ambiente de dev?",
      level: "pleno",
      a: "<p>Em desenvolvimento, Compose prioriza produtividade: bind mounts para hot-reload, serviços de debug (adminer, mailhog), sem restart policies, logs verbosos, variáveis de ambiente em .env.</p><p>Para produção single-host com Compose (legítimo para apps menores), as diferenças principais:</p><ol><li><strong>restart: unless-stopped</strong> em todos os serviços — sobrevive a reboot do host</li><li><strong>Sem bind mounts</strong> — volumes nomeados para dados persistentes</li><li><strong>Sem portas expostas desnecessariamente</strong> — banco não precisa de 5432 no host, só internamente</li><li><strong>Healthchecks em todos os serviços</strong> + depends_on com condition: service_healthy</li><li><strong>Resource limits</strong>: deploy.resources.limits.memory e cpus</li><li><strong>Imagens tagueadas por versão</strong>, não latest</li><li><strong>Secrets via variáveis de ambiente</strong> injetadas externamente, não .env commitado</li></ol><p>Override files: compose.yaml base + compose.override.yaml para dev + compose.prod.yaml via -f para prod. Mantém DRY sem duplicar.</p>",
    },
    {
      q: "O que é distroless e quando usar em vez de alpine?",
      level: "senior",
      a: "<p><strong>Alpine Linux</strong> usa musl libc em vez de glibc — extremamente pequeno (~5 MB). A maioria das linguagens roda bem, mas há edge cases: binários compilados para glibc, extensões C em Python, compatibilidade com algumas libs de criptografia.</p><p><strong>Distroless</strong> (Google) são imagens sem shell, package manager ou utilitários Unix — só o runtime mínimo. Variantes: gcr.io/distroless/nodejs20-debian12 (~50 MB), gcr.io/distroless/static-debian12 (~2 MB para binários estáticos).</p><p><strong>Quando usar cada:</strong></p><ul><li>Alpine: linguagens interpretadas (Python, Ruby, Node.js), libs C que suportam musl, quando você precisa de /bin/sh para debug</li><li>Distroless: quando a superfície de ataque importa mais que debugabilidade. Sem shell = sem execução de comandos arbitrários se o container for comprometido. Ideal para serviços de alta criticidade em prod</li><li>scratch: binários totalmente estáticos (Go com CGO_ENABLED=0, Rust com musl target). Imagem de 5-15 MB que é literalmente só o binário</li></ul><p>Em K8s, distroless + seccomp profile + read-only root filesystem + non-root user é o baseline de segurança que qualquer sênior de plataforma espera.</p>",
    },
    {
      q: "Como funciona a rede bridge do Docker? Por que containers na rede padrão não se enxergam por nome?",
      level: "senior",
      a: "<p>Quando o Docker inicia, cria uma interface virtual <strong>docker0</strong> no host (geralmente 172.17.0.1). Cada container conectado à bridge padrão recebe um IP nessa sub-rede e uma interface veth (virtual ethernet pair) — uma ponta dentro do container, outra conectada ao docker0.</p><p>Tráfego entre containers: pacote sai do container via veth → chega ao docker0 → Docker encaminha para a veth do container destino. NAT via iptables para tráfego externo (-p mapeia porta).</p><p><strong>Por que a bridge padrão não tem DNS por nome:</strong> a bridge padrão (docker0) é legada e não implementa embedded DNS. Containers se enxergam só por IP — imprático porque IPs mudam.</p><p><strong>User-defined bridge</strong> (criada via docker network create ou Compose) tem DNS interno: o daemon Docker serve um resolver em 127.0.0.11 que mapeia nome do container/serviço para o IP atual. É por isso que no Compose você escreve db:5432 — 'db' resolve via DNS interno mesmo que o IP do container mude.</p>",
    },
    {
      q: "Como implementar um Dockerfile multi-stage eficiente para uma aplicação Go?",
      level: "pleno",
      a: "<p>Go é o caso mais limpo de multi-stage: o compilador produz um binário estático que não precisa de runtime, SO, ou shared libraries.</p><pre style='font-size:10px;color:#4ade80'>FROM golang:1.22-alpine AS build\nWORKDIR /app\n# Deps separadas do código — cache inteligente\nCOPY go.mod go.sum ./\nRUN go mod download\nCOPY . .\n# CGO_ENABLED=0: binário estático sem dependência de libc\nRUN CGO_ENABLED=0 GOOS=linux go build -ldflags='-s -w' -o server ./cmd/server\n\n# Stage final: scratch = só o binário\nFROM scratch\n# Certificados TLS — necessário para HTTPS\nCOPY --from=build /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/\n# Usuário não-root em scratch (sem adduser, define numericamente)\nUSER 1000:1000\nCOPY --from=build /app/server /server\nEXPOSE 8080\nENTRYPOINT [\"/server\"]</pre><p>Resultado: imagem de 8-15 MB com zero superfície de ataque (sem shell, sem utilitários, sem SO). Flags -ldflags='-s -w' removem debug info e tabela de símbolos, reduzindo 30-40% do tamanho do binário.</p>",
      tip: "Mencionar CGO_ENABLED=0 e scratch demonstra que você conhece o ecossistema Go além do básico. Muitos candidatos esquecem os certificados TLS — sem eles, qualquer chamada HTTPS falha com certificate error.",
    },
    {
      q: "Como você faria security scanning de imagens no pipeline de CI?",
      level: "senior",
      a: "<p>Pipeline de segurança de imagens tem três camadas:</p><p><strong>1. Build-time — Dockerfile lint:</strong> hadolint valida instruções (USER declarado, sem ADD com URL, apt sem --no-install-recommends). Roda em segundos, bloqueia antipadrões antes de buildar.</p><p><strong>2. Image scan — CVEs:</strong> após o build, escanear com trivy ou grype. Trivy verifica OS packages, linguagem deps (npm, pip, go modules) e Dockerfile misconfigurations. Configure threshold: CRITICAL bloqueia o pipeline, HIGH vira aviso, MEDIUM é acompanhado.</p><pre style='font-size:10px;color:#4ade80'>trivy image --exit-code 1 --severity CRITICAL minha-imagem:latest</pre><p><strong>3. Registry scan contínuo:</strong> ECR, GCR e Docker Hub têm scan integrado que re-analisa imagens já publicadas quando novas CVEs são reportadas. Configure alertas para imagens em produção.</p><p><strong>SBOM (Software Bill of Materials):</strong> gere com syft ou docker sbom. Documenta todos os componentes da imagem — necessário para compliance (SOC 2, ISO 27001) e para resposta a incidentes quando uma CVE nova aparece.</p>",
    },
    {
      q: "O que é o problema do PID 1 e como resolvê-lo?",
      level: "senior",
      a: "<p>No Linux, o processo com PID 1 tem responsabilidades especiais: receber signals do kernel, fazer reaping de processos zumbis (filhos que terminaram mas não foram wait()ed). O init do SO cuida disso normalmente.</p><p>Dentro de um container, seu processo principal vira PID 1. Node.js, Python e a maioria dos runtimes <strong>não implementam reaping de zumbis</strong>. Problemas:</p><ul><li>SIGTERM enviado pelo Docker (docker stop) pode não ser repassado para processos filhos — graceful shutdown não funciona</li><li>Processos zumbis acumulam (leakam PIDs)</li></ul><p><strong>Soluções:</strong></p><ol><li><strong>tini</strong>: processo init leve (1 KB) feito para containers. <code>ENTRYPOINT [\"/sbin/tini\", \"--\", \"node\", \"server.js\"]</code> ou adicione RUN apk add tini na imagem</li><li><strong>--init flag</strong>: <code>docker run --init</code> injeta tini automaticamente sem precisar no Dockerfile</li><li><strong>exec form de ENTRYPOINT</strong>: garante que seu processo seja PID 1 diretamente (sem shell intermediário) — mas você ainda precisa tratar SIGTERM no código</li><li><strong>Para Node.js</strong>: além de tini, adicione tratamento de SIGTERM: <code>process.on('SIGTERM', () => { server.close() })</code></li></ol>",
    },
    {
      q: "Como o Docker Compose resolve o problema de depends_on? O que 'service_healthy' realmente garante?",
      level: "pleno",
      a: "<p><code>depends_on</code> simples apenas garante que o container alvo foi <strong>iniciado</strong> — não que a aplicação dentro dele está pronta para receber conexões. Postgres pode levar 2-5 segundos para aceitar conexões após o processo iniciar.</p><p><strong>Com condition: service_healthy</strong>: o Compose aguarda o healthcheck do serviço dependente retornar exit code 0 antes de iniciar o serviço dependente. O healthcheck deve testar a <em>capacidade</em> de servir, não apenas existência do processo.</p><pre style='font-size:10px;color:#4ade80'>db:\n  healthcheck:\n    test: [\"CMD\", \"pg_isready\", \"-U\", \"postgres\", \"-d\", \"mydb\"]\n    interval: 5s\n    timeout: 3s\n    retries: 10\n    start_period: 10s\napi:\n  depends_on:\n    db:\n      condition: service_healthy</pre><p><strong>start_period</strong> é crítico: durante esse tempo, falhas de healthcheck não contam como retries — dá margem para o processo subir sem matar antes de estar pronto.</p><p>Lição importante: mesmo com isso, a aplicação deve implementar retry com backoff na conexão com o banco — em produção, o banco pode reiniciar a qualquer momento.</p>",
    },
    {
      q: "Qual a diferença entre COPY e ADD no Dockerfile? Quando usar cada um?",
      level: "pleno",
      a: "<p>COPY é a instrução simples e previsível: copia arquivos/diretórios do contexto de build para o filesystem da imagem. Faz exatamente o que parece — nada mais.</p><p>ADD tem comportamentos extras que raramente você quer:</p><ul><li>Extrai automaticamente arquivos tar.gz para o destino (parece conveniente, mas obscurece o que está na imagem)</li><li>Aceita URLs como fonte (baixa o arquivo durante o build — não passa por cache, não é reproduzível, pode mudar silenciosamente)</li></ul><p><strong>Regra prática: sempre use COPY.</strong> Use ADD apenas para o único caso legítimo: ADD --chown=user:group arquivo.tar.gz /destino/ quando você quer extrair e mudar ownership atomicamente.</p><p>O uso de ADD com URL é um antipadrão explicitamente listado nas boas práticas do Docker: viola reprodutibilidade, pode baixar código malicioso, não é cacheado corretamente. Use RUN curl/wget + extraia explicitamente se precisar baixar algo.</p>",
    },
    {
      q: "Como funciona o buildx e builds multi-arquitetura?",
      level: "senior",
      a: "<p><strong>docker buildx</strong> é o cliente estendido de build que usa BuildKit como backend. Sua principal capacidade além do build padrão é criar imagens <strong>multi-plataforma</strong> (multi-arch) em uma única tag.</p><p>Com QEMU emulando CPUs diferentes no host, o buildx pode compilar para linux/amd64, linux/arm64 e linux/arm/v7 ao mesmo tempo:</p><pre style='font-size:10px;color:#4ade80'>docker buildx create --name builder --bootstrap --use\ndocker buildx build --platform linux/amd64,linux/arm64 \\\n  -t minha-org/minha-app:latest --push .</pre><p>O resultado é um <strong>manifest list</strong> no registry: quando um cliente faz docker pull, o daemon escolhe automaticamente a imagem correta para a arquitetura do host. ARM Macs, servidores Graviton (AWS), Raspberry Pi — todos recebem a imagem nativa sem flag adicional.</p><p><strong>Por que importa:</strong> AWS Graviton3 oferece 40% melhor custo-benefício que instâncias x86. Em produção heterogênea (dev no Mac M1, CI em x86, prod em Graviton), imagens multi-arch eliminam diferenças de plataforma.</p>",
      tip: "Mencionar manifest list e que o cliente escolhe automaticamente a arch é o diferencial. A maioria sabe usar --platform mas não entende o mecanismo de distribuição.",
    },
    {
      q: "Como você implementaria graceful shutdown em um container?",
      level: "pleno",
      a: "<p>Graceful shutdown garante que o container termine conexões ativas antes de encerrar. A cadeia completa envolve três pontos:</p><p><strong>1. O processo recebe SIGTERM:</strong> docker stop envia SIGTERM e aguarda 10 segundos (configurável com --stop-timeout). Se o processo não terminar, Docker envia SIGKILL.</p><p><strong>2. PID 1 deve receber e repassar o sinal:</strong> se o ENTRYPOINT usa forma shell (CMD node server.js), o shell vira PID 1 e geralmente não repassa SIGTERM ao processo filho. Use sempre a forma exec: ENTRYPOINT [\"node\", \"server.js\"] — ou use tini.</p><p><strong>3. A aplicação deve tratar SIGTERM:</strong></p><pre style='font-size:10px;color:#4ade80'>// Node.js\nprocess.on('SIGTERM', async () => {\n  console.log('SIGTERM recebido — encerrando...')\n  await server.close()        // para de aceitar novas conexões\n  await dbPool.end()          // fecha pool do banco\n  process.exit(0)             // exit limpo\n})</pre><p>Em K8s, o pod recebe SIGTERM quando é removido. O preStop hook adiciona um sleep para dar tempo ao load balancer de tirar o pod do pool antes do processo receber o sinal — evita 502s durante deploy.</p>",
      tip: "A sequência SIGTERM → processo → resposta é a base. Mencionar o problema do shell como PID 1 e o preStop hook do K8s mostra que você já operou isso em produção.",
    },
    {
      q: "O que é um container rootless e por que usar?",
      level: "senior",
      a: "<p>No modo padrão, o Docker daemon roda como root no host — criar containers requer privilégio root no daemon. Se alguém comprometer o socket Docker (/var/run/docker.sock), tem root no host.</p><p><strong>Rootless Docker</strong> (disponível desde Docker 20.10) executa o daemon e os containers completamente no espaço de usuário — sem nenhum processo root:</p><pre style='font-size:10px;color:#4ade80'>dockerd-rootless-setuptool.sh install\nexport DOCKER_HOST=unix://$XDG_RUNTIME_DIR/docker.sock\ndocker run hello-world</pre><p><strong>Vantagens de segurança:</strong></p><ul><li>Daemon comprometido não tem root no host</li><li>Containers já usam USER namespace por padrão (root dentro = usuário no host)</li><li>Perfeito para ambientes CI sem root (Dagger, Kaniko como alternativas)</li></ul><p><strong>Limitações:</strong> alguns recursos não estão disponíveis sem root: overlay2 precisa de kernel 5.11+ para rootless, portas abaixo de 1024 não funcionam diretamente, cgroups v1 não são suportados.</p><p>Em K8s, o equivalente é rodar pods com runAsNonRoot: true + allowPrivilegeEscalation: false no SecurityContext.</p>",
      tip: "Diferenciar rootless (daemon sem root) de simplesmente USER não-root no container é o ponto que filtra candidatos superficiais.",
    },
    {
      q: "Como você configuraria health check em um container Docker e no Compose?",
      level: "pleno",
      a: "<p>O <strong>HEALTHCHECK</strong> instrui o Docker daemon a testar periodicamente se o container ainda está funcional — diferente de apenas 'rodando'. Um container pode estar de pé mas não aceitar requisições; o health check detecta isso.</p><p><strong>No Dockerfile:</strong></p><pre style='font-size:10px;color:#4ade80'>HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \\\n  CMD curl -f http://localhost:3000/health || exit 1</pre><p><strong>No Compose:</strong></p><pre style='font-size:10px;color:#4ade80'>services:\n  api:\n    image: minha-api\n    healthcheck:\n      test: [\"CMD\", \"curl\", \"-f\", \"http://localhost:3000/health\"]\n      interval: 30s\n      timeout: 5s\n      start_period: 15s\n      retries: 3</pre><p><strong>Estados possíveis:</strong> starting (durante start_period), healthy, unhealthy. O campo <code>depends_on</code> com <code>condition: service_healthy</code> aguarda o serviço ficar healthy antes de iniciar o dependente — resolve a maioria dos race conditions de startup.</p><p>Em K8s, readinessProbe e livenessProbe fazem papéis similares mas com semânticas distintas: readiness controla se o pod entra no pool do Service; liveness determina se o kubelet reinicia o container.</p>",
      tip: "A diferença entre start_period e interval é frequente em entrevistas: start_period dá uma janela inicial sem contar falhas, ideal para apps que demoram para inicializar.",
    },
  ],
  exercises: [
    {
      level: "iniciante",
      title: "Primeiro Dockerfile — Node.js sem boas práticas",
      description: "Crie um Dockerfile básico para uma aplicação Node.js Express que escuta na porta 3000. Use node:20 como base, copie todos os arquivos, instale dependências e defina o CMD. Não se preocupe com otimizações ainda — o objetivo é entender o fluxo básico.",
      concepts: ["FROM", "COPY", "RUN", "CMD", "EXPOSE"],
      hint: "Ordem sugerida: FROM → WORKDIR → COPY . . → RUN npm install → EXPOSE → CMD",
    },
    {
      level: "iniciante",
      title: "Rodar e inspecionar containers",
      description: "Construa a imagem do exercício anterior. Depois: rode em background (-d), veja os logs com docker logs, inspecione o IP do container com docker inspect, entre no container com docker exec -it e instale o curl para testar o endpoint. Encerre o container com docker stop.",
      concepts: ["docker build", "docker run", "docker logs", "docker inspect", "docker exec", "docker stop"],
      hint: "docker inspect <id> | jq '.[0].NetworkSettings.Networks' para ver o IP",
    },
    {
      level: "iniciante",
      title: "Volumes e persistência",
      description: "Rode um container PostgreSQL 16 com volume nomeado para persistir os dados. Crie uma tabela e insira dados. Pare e remova o container. Suba um novo container com o mesmo volume e verifique se os dados persistiram.",
      concepts: ["volumes nomeados", "persistência de dados", "docker volume"],
      hint: "Use -v postgres_data:/var/lib/postgresql/data. docker volume inspect postgres_data mostra onde está no host.",
    },
    {
      level: "intermediario",
      title: "Otimizar Dockerfile — cache inteligente",
      description: "Pegue o Dockerfile básico do exercício 1. Meça o tempo de build. Agora reestruture: copie package.json separado, instale deps, depois copie o código. Faça uma mudança só no código e meça o tempo novamente. Confirme que npm install não rodou de novo. Use dive para inspecionar as layers.",
      concepts: ["layer cache", "ordem de instruções", "npm ci", "COPY seletivo", "dive"],
      hint: "docker build --progress=plain 2>&1 | grep 'CACHED' mostra as layers cacheadas.",
    },
    {
      level: "intermediario",
      title: "Multi-stage build — reduzir imagem de produção",
      description: "Converta um Dockerfile Node.js TypeScript em multi-stage: stage 'deps' para instalar só prod deps, stage 'build' para compilar o TypeScript, stage 'runtime' com node:20-alpine copiando só dist/ e node_modules. Meça o tamanho antes e depois com docker images.",
      concepts: ["multi-stage build", "FROM AS", "COPY --from", "node:20-alpine", "tamanho de imagem"],
      hint: "COPY --from=build /app/dist ./dist copia artefatos de stages anteriores.",
    },
    {
      level: "intermediario",
      title: "Docker Compose com healthchecks",
      description: "Crie um compose.yaml com uma API Node.js e um PostgreSQL. Configure healthcheck no postgres (pg_isready), depends_on com condition: service_healthy na API. Adicione restart: unless-stopped e resource limits. Suba e verifique que a API só inicia após o banco estar healthy.",
      concepts: ["healthcheck", "depends_on", "condition: service_healthy", "restart policy", "resource limits"],
      hint: "docker compose ps mostra o health status de cada serviço.",
    },
    {
      level: "intermediario",
      title: "Networking — containers em redes isoladas",
      description: "Crie duas redes: 'frontend' e 'backend'. Suba um container nginx na rede frontend, um container Node.js nas duas redes, e um container PostgreSQL só na backend. Verifique que o nginx não consegue alcançar o postgres diretamente (ping por nome). O Node.js deve servir de intermediário.",
      concepts: ["docker network", "isolamento de rede", "multi-network", "user-defined bridge", "DNS interno"],
      hint: "docker network connect adiciona um container a uma rede existente.",
    },
    {
      level: "senior",
      title: "BuildKit secrets — sem rastro em layers",
      description: "Crie um Dockerfile que instala um pacote npm privado (simule com um token no .npmrc). Use BuildKit --mount=type=secret para injetar o .npmrc durante o RUN sem que apareça em nenhuma layer. Verifique com docker history que nenhum token está visível. Compare com a abordagem errada de COPY .npmrc e ARG.",
      concepts: ["BuildKit", "--mount=type=secret", "npm private registry", "docker history", "layer security"],
      hint: "docker build --secret id=npmrc,src=$HOME/.npmrc . — o arquivo não aparece na imagem.",
    },
    {
      level: "senior",
      title: "Imagem distroless — Go com binário estático",
      description: "Escreva um servidor HTTP simples em Go. Crie um Dockerfile multi-stage: stage de build com golang:1.22-alpine (CGO_ENABLED=0, ldflags -s -w), stage final em gcr.io/distroless/static-debian12. Meça o tamanho final. Tente executar shell no container e confirme que não é possível.",
      concepts: ["distroless", "binário estático", "CGO_ENABLED=0", "scratch", "superfície de ataque"],
      hint: "docker run --rm -it --entrypoint sh minha-imagem deve falhar — distroless não tem shell.",
    },
    {
      level: "senior",
      title: "Security scanning no pipeline CI",
      description: "Configure um workflow GitHub Actions que: (1) builda a imagem, (2) roda hadolint no Dockerfile, (3) roda trivy com exit-code 1 em severidade CRITICAL, (4) gera SBOM com syft. O pipeline deve falhar se houver CVE crítica. Documente como atualizar a base image quando um CVE aparecer.",
      concepts: ["trivy", "hadolint", "SBOM", "syft", "GitHub Actions", "pipeline de segurança"],
      hint: "trivy image --exit-code 1 --severity CRITICAL --ignore-unfixed minha-imagem",
    },
    {
      level: "senior",
      title: "Debug de container — CrashLoop e OOMKill",
      description: "Recrie dois cenários de falha: (1) um container que sai imediatamente com exit code 1 (erro de config), (2) um container que é OOMKilled (limite de memória muito baixo). Para cada um: diagnostique com docker ps -a, docker inspect e docker logs. Resolva o problema e documente o roteiro de debug.",
      concepts: ["exit codes", "OOMKilled", "docker inspect", "docker stats", "CrashLoopBackOff", "debug de container"],
      hint: "docker inspect <id> | jq '.[0].State.OOMKilled' retorna true se foi OOMKill.",
    },
  ],
  codeExamples: [
    {
      title: "Dockerfile Node.js — produção com todas as boas práticas",
      language: "dockerfile",
      code: `# syntax=docker/dockerfile:1.6
ARG NODE_VERSION=20

# ─── Dependências ───────────────────────────────────────────────
FROM node:\${NODE_VERSION}-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \\
  npm ci --only=production

# ─── Build ──────────────────────────────────────────────────────
FROM node:\${NODE_VERSION}-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY . .
RUN npm run build

# ─── Runtime ────────────────────────────────────────────────────
FROM node:\${NODE_VERSION}-alpine AS runtime
RUN apk add --no-cache dumb-init
# Usuário não-root
RUN addgroup --system --gid 1001 nodejs && \\
  adduser --system --uid 1001 nodeapp
WORKDIR /app
COPY --from=deps --chown=nodeapp:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nodeapp:nodejs /app/dist ./dist
USER nodeapp
EXPOSE 3000
ENV NODE_ENV=production
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \\
CMD wget -qO- http://localhost:3000/health || exit 1
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "dist/server.js"]`,
      description: "Multi-stage com BuildKit cache mount, usuário não-root, dumb-init como PID 1 e healthcheck.",
    },
    {
      title: "Docker Compose — stack completa com healthchecks",
      language: "yaml",
      code: `name: minha-app
services:
api:
  build:
    context: .
    target: runtime
  ports:
    - "3000:3000"
  environment:
    DATABASE_URL: postgres://postgres:senha@db:5432/mydb
    REDIS_URL: redis://cache:6379
  depends_on:
    db:
      condition: service_healthy
    cache:
      condition: service_healthy
  restart: unless-stopped
  deploy:
    resources:
      limits:
        cpus: '1'
        memory: 512M

db:
  image: postgres:16-alpine
  volumes:
    - postgres_data:/var/lib/postgresql/data
  environment:
    POSTGRES_DB: mydb
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: senha
  healthcheck:
    test: ["CMD", "pg_isready", "-U", "postgres", "-d", "mydb"]
    interval: 10s
    timeout: 5s
    retries: 5
    start_period: 10s
  restart: unless-stopped

cache:
  image: redis:7-alpine
  volumes:
    - redis_data:/data
  command: redis-server --appendonly yes
  healthcheck:
    test: ["CMD", "redis-cli", "ping"]
    interval: 10s
    timeout: 3s
    retries: 3
  restart: unless-stopped

volumes:
postgres_data:
redis_data:`,
      description: "Stack de produção com healthchecks, depends_on condicional, resource limits e volumes nomeados.",
    },
    {
      title: "Dockerfile Go — multi-stage com scratch e segurança completa",
      language: "dockerfile",
      code: `# syntax=docker/dockerfile:1.6
ARG GO_VERSION=1.22

# ─── Build ──────────────────────────────────────────────────────────────────────
FROM golang:\${GO_VERSION}-alpine AS build
WORKDIR /app

# Dependências separadas — cache inteligente
COPY go.mod go.sum ./
RUN --mount=type=cache,target=/root/go/pkg/mod go mod download

COPY . .

# Binário estático sem dependência de libc
# -ldflags='-s -w': remove debug info e tabela de símbolos (30-40% menor)
RUN --mount=type=cache,target=/root/.cache/go-build \\
  CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \\
  go build -ldflags='-s -w -extldflags=-static' \\
  -o /server ./cmd/server

# ─── Security scan do binário ──────────────────────────────────────────────────
FROM golang:\${GO_VERSION}-alpine AS scan
COPY --from=build /server /server
RUN go install golang.org/x/vuln/cmd/govulncheck@latest && \\
  govulncheck /server || true

# ─── Runtime: scratch = apenas o binário ──────────────────────────────────────
FROM scratch AS runtime

# Certificados TLS — sem isso, chamadas HTTPS falham
COPY --from=build /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

# /etc/passwd para USER não-root em scratch
COPY --from=build /etc/passwd /etc/passwd

# Usuário não-root (definido numericamente — sem shell, sem adduser)
USER 65532:65532

COPY --from=build /server /server

EXPOSE 8080

# Metadados de rastreabilidade
LABEL org.opencontainers.image.source="https://github.com/org/repo" \\
      org.opencontainers.image.revision="git-sha"

ENTRYPOINT ["/server"]`,
      description: "Imagem Go com binário estático em scratch: zero SO, zero shell, ~10 MB. Inclui BuildKit cache mounts e usuário não-root definido numericamente.",
    },
  ],
  mnemonics: [
    {
      label: "Ordem do Dockerfile — COLD",
      trick: "C-O-L-D: Config (FROM/ENV), OS (RUN install), Libs (COPY manifesto + install), Data (COPY código)",
      explanation: "O que muda menos vem primeiro para maximizar o cache. Config da base praticamente nunca muda. Packages do OS mudam com patches. Libs (deps) mudam menos que o código. Código muda a todo commit.",
    },
    {
      label: "Segurança Docker — SNUR",
      trick: "S-N-U-R: Scan (trivy), Non-root (USER 1001), no URL (sem ADD http://), Read-only (--read-only filesystem)",
      explanation: "Os quatro pilares de segurança de imagem Docker. Scan detecta CVEs. Non-root evita escalada de privilégio. No URL evita downloads não reproduzíveis. Read-only filesystem impede que malware grave no container.",
    },
    {
      label: "Tipos de volume Docker — BNT",
      trick: "B-N-T: Bind (dev, hot-reload), Named (prod, persistência), Tmpfs (sensível, em memória)",
      explanation: "Cada tipo tem seu caso de uso. Bind mount = desenvolvimento com código ao vivo. Named volume = banco de dados em produção. Tmpfs = segredos ou cache que não devem tocar o disco em hipótese alguma.",
    },
    {
      label: "Modos de rede Docker — BOHN",
      trick: "B-O-H-N: Bridge (padrão, isolado), Overlay (multi-host, Swarm), Host (sem NAT, máx perf), None (totalmente isolado)",
      explanation: "Bridge é o padrão — cria rede virtual com DNS interno. Overlay conecta containers em hosts diferentes via VXLAN. Host compartilha a pilha de rede do host. None remove toda a rede — para processos sem necessidade de rede.",
    },
  ],
  cheatsheet: {
    title: "Docker — Cheat Sheet completo",
    html: `<style>
.dkcs-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:20px}
.dkcs-head{font-size:9px;color:#64748b;letter-spacing:.14em;text-transform:uppercase;margin:14px 0 8px;padding-bottom:6px;border-bottom:1px solid #1e3a5f}
.dkcs-grid{display:grid;gap:6px}
.dkcs-grid-2{grid-template-columns:1fr 1fr}
.dkcs-grid-3{grid-template-columns:1fr 1fr 1fr}
.dkcs-card{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:10px 12px}
.dkcs-cmd{color:#2496ED;font-size:11px;font-weight:700;margin-bottom:4px}
.dkcs-desc{color:#64748b;font-size:10px;line-height:1.5}
.dkcs-flag{color:#f59e0b;font-size:9.5px}
.dkcs-kw{color:#4ade80}
</style>
<div class="dkcs-wrap">
<p style="color:#e2e8f0;font-size:11px;font-weight:700;margin:0 0 4px;letter-spacing:.06em">DOCKER — CHEAT SHEET</p>

<div class="dkcs-head">CONTAINERS — CICLO DE VIDA</div>
<div class="dkcs-grid dkcs-grid-2">
  <div class="dkcs-card">
    <div class="dkcs-cmd">docker run</div>
    <div class="dkcs-desc">
      <span class="dkcs-flag">-d</span> daemon &nbsp;<span class="dkcs-flag">-it</span> interativo<br>
      <span class="dkcs-flag">-p 8080:3000</span> port map<br>
      <span class="dkcs-flag">-e VAR=val</span> env var<br>
      <span class="dkcs-flag">-v nome:/path</span> volume<br>
      <span class="dkcs-flag">--rm</span> apaga ao sair<br>
      <span class="dkcs-flag">--init</span> tini como PID 1<br>
      <span class="dkcs-flag">--memory=256m --cpus=0.5</span>
    </div>
  </div>
  <div class="dkcs-card">
    <div class="dkcs-cmd">docker exec</div>
    <div class="dkcs-desc">
      <span style="color:#94a3b8">docker exec -it id sh</span> &nbsp;shell<br>
      <span style="color:#94a3b8">docker exec id cmd</span> &nbsp;comando<br><br>
      <div class="dkcs-cmd" style="margin-top:6px">docker logs</div>
      <span class="dkcs-flag">-f</span> follow &nbsp;<span class="dkcs-flag">--tail=100</span><br>
      <span class="dkcs-flag">--since=10m</span> filtro de tempo
    </div>
  </div>
  <div class="dkcs-card">
    <div class="dkcs-cmd">docker inspect</div>
    <div class="dkcs-desc">
      JSON completo de config<br>
      <span style="color:#94a3b8">| jq '.[0].State'</span> &nbsp;status<br>
      <span style="color:#94a3b8">| jq '.[0].NetworkSettings'</span>
    </div>
  </div>
  <div class="dkcs-card">
    <div class="dkcs-cmd">docker stats</div>
    <div class="dkcs-desc">
      CPU%, MEM usage, NET I/O em tempo real<br>
      <span class="dkcs-flag">--no-stream</span> snapshot único<br><br>
      <div class="dkcs-cmd" style="margin-top:6px">docker top</div>
      Processos dentro do container
    </div>
  </div>
</div>

<div class="dkcs-head">BUILD</div>
<div class="dkcs-grid dkcs-grid-2">
  <div class="dkcs-card">
    <div class="dkcs-cmd">docker build</div>
    <div class="dkcs-desc">
      <span class="dkcs-flag">-t nome:tag</span> tag da imagem<br>
      <span class="dkcs-flag">-f Dockerfile.prod</span> arquivo custom<br>
      <span class="dkcs-flag">--no-cache</span> ignora cache<br>
      <span class="dkcs-flag">--target=stage</span> para multi-stage<br>
      <span class="dkcs-flag">--build-arg KEY=val</span> ARG<br>
      <span class="dkcs-flag">--secret id=key,src=file</span> BuildKit
    </div>
  </div>
  <div class="dkcs-card">
    <div class="dkcs-cmd">docker history</div>
    <div class="dkcs-desc">
      Layers e tamanhos de uma imagem<br>
      <span class="dkcs-flag">--no-trunc</span> layer ID completo<br><br>
      <div class="dkcs-cmd" style="margin-top:6px">docker image ls</div>
      <span class="dkcs-flag">--filter dangling=true</span> layers órfãs<br>
      <span style="color:#94a3b8">docker image prune</span> limpa orphans
    </div>
  </div>
</div>

<div class="dkcs-head">REGISTRY</div>
<div class="dkcs-grid dkcs-grid-3">
  <div class="dkcs-card">
    <div class="dkcs-cmd">docker pull</div>
    <div class="dkcs-desc">Puxa imagem do registry<br><span class="dkcs-flag">:tag</span> ou <span class="dkcs-flag">@sha256:...</span></div>
  </div>
  <div class="dkcs-card">
    <div class="dkcs-cmd">docker push</div>
    <div class="dkcs-desc">Envia imagem para registry<br>Precisa de docker login antes</div>
  </div>
  <div class="dkcs-card">
    <div class="dkcs-cmd">docker tag</div>
    <div class="dkcs-desc">Cria alias de tag<br><span style="color:#94a3b8">img:old registry/img:new</span></div>
  </div>
</div>

<div class="dkcs-head">NETWORK</div>
<div class="dkcs-grid dkcs-grid-2">
  <div class="dkcs-card">
    <div class="dkcs-cmd">docker network</div>
    <div class="dkcs-desc">
      <span style="color:#94a3b8">ls</span> &nbsp;listar redes<br>
      <span style="color:#94a3b8">create mynet</span> &nbsp;criar bridge<br>
      <span style="color:#94a3b8">inspect mynet</span> &nbsp;IPs, containers<br>
      <span style="color:#94a3b8">connect mynet container</span>
    </div>
  </div>
  <div class="dkcs-card">
    <div class="dkcs-cmd">Modos de rede</div>
    <div class="dkcs-desc">
      <span class="dkcs-kw">bridge</span> &nbsp;isolado + NAT (padrão)<br>
      <span class="dkcs-kw">host</span> &nbsp;sem isolamento, máx perf<br>
      <span class="dkcs-kw">overlay</span> &nbsp;multi-host (Swarm/K8s)<br>
      <span class="dkcs-kw">none</span> &nbsp;sem rede
    </div>
  </div>
</div>

<div class="dkcs-head">VOLUMES</div>
<div class="dkcs-grid dkcs-grid-2">
  <div class="dkcs-card">
    <div class="dkcs-cmd">docker volume</div>
    <div class="dkcs-desc">
      <span style="color:#94a3b8">ls</span> &nbsp;listar volumes<br>
      <span style="color:#94a3b8">create nome</span> &nbsp;criar<br>
      <span style="color:#94a3b8">inspect nome</span> &nbsp;path no host<br>
      <span style="color:#94a3b8">prune</span> &nbsp;limpar não usados
    </div>
  </div>
  <div class="dkcs-card">
    <div class="dkcs-cmd">Tipos</div>
    <div class="dkcs-desc">
      <span class="dkcs-kw">-v nome:/path</span> &nbsp;volume nomeado<br>
      <span class="dkcs-kw">-v /host:/cont</span> &nbsp;bind mount<br>
      <span class="dkcs-kw">--tmpfs /path</span> &nbsp;em memória
    </div>
  </div>
</div>

<div class="dkcs-head">COMPOSE</div>
<div class="dkcs-grid dkcs-grid-2">
  <div class="dkcs-card">
    <div class="dkcs-cmd">docker compose</div>
    <div class="dkcs-desc">
      <span style="color:#94a3b8">up -d</span> &nbsp;sobe em background<br>
      <span style="color:#94a3b8">up --build</span> &nbsp;rebuilda imagens<br>
      <span style="color:#94a3b8">down -v</span> &nbsp;para + remove volumes<br>
      <span style="color:#94a3b8">logs -f serviço</span> &nbsp;follow log<br>
      <span style="color:#94a3b8">exec serviço cmd</span><br>
      <span style="color:#94a3b8">ps</span> &nbsp;status dos serviços
    </div>
  </div>
  <div class="dkcs-card">
    <div class="dkcs-cmd">Overrides</div>
    <div class="dkcs-desc">
      compose.yaml &nbsp;base<br>
      compose.override.yaml &nbsp;dev (auto)<br>
      <span class="dkcs-flag">-f compose.prod.yaml</span> prod<br><br>
      <span class="dkcs-flag">--profile debug up</span> &nbsp;perfis
    </div>
  </div>
</div>

<div class="dkcs-head">DOCKERFILE — INSTRUÇÕES ESSENCIAIS</div>
<div class="dkcs-grid dkcs-grid-2">
  <div class="dkcs-card">
    <div style="font-size:10px;color:#64748b;line-height:1.9">
      <span class="dkcs-kw">FROM</span> &nbsp;imagem base (sempre fixa a tag)<br>
      <span class="dkcs-kw">RUN</span> &nbsp;executa comando (cria layer)<br>
      <span class="dkcs-kw">COPY</span> &nbsp;copia arquivos (prefira sobre ADD)<br>
      <span class="dkcs-kw">ADD</span> &nbsp;COPY + tar extract (use com cuidado)<br>
      <span class="dkcs-kw">ENV</span> &nbsp;variável de ambiente persistente<br>
      <span class="dkcs-kw">ARG</span> &nbsp;variável só no build (não sobrevive)<br>
      <span class="dkcs-kw">WORKDIR</span> &nbsp;diretório de trabalho (cria se não existe)
    </div>
  </div>
  <div class="dkcs-card">
    <div style="font-size:10px;color:#64748b;line-height:1.9">
      <span class="dkcs-kw">EXPOSE</span> &nbsp;documenta porta (não abre no host)<br>
      <span class="dkcs-kw">USER</span> &nbsp;define usuário não-root (uid numérico)<br>
      <span class="dkcs-kw">ENTRYPOINT</span> &nbsp;processo principal (exec form)<br>
      <span class="dkcs-kw">CMD</span> &nbsp;args padrão (substituível no run)<br>
      <span class="dkcs-kw">HEALTHCHECK</span> &nbsp;comando de saúde do container<br>
      <span class="dkcs-kw">VOLUME</span> &nbsp;declara ponto de montagem<br>
      <span class="dkcs-kw">LABEL</span> &nbsp;metadados (versão, maintainer)
    </div>
  </div>
</div>

<div class="dkcs-head">BUILDKIT — MOUNTS ESPECIAIS</div>
<div class="dkcs-grid dkcs-grid-3">
  <div class="dkcs-card">
    <div class="dkcs-cmd">--mount=type=cache</div>
    <div class="dkcs-desc">Cache de pacotes entre builds. Não aparece nas layers. Acelera npm/pip/cargo no CI.</div>
  </div>
  <div class="dkcs-card">
    <div class="dkcs-cmd">--mount=type=secret</div>
    <div class="dkcs-desc">Segredo montado durante RUN. Zero rastro em layers. Para .npmrc, tokens, etc.</div>
  </div>
  <div class="dkcs-card">
    <div class="dkcs-cmd">--mount=type=ssh</div>
    <div class="dkcs-desc">Chave SSH disponível no build. Para git clone de repo privado sem colocar chave na imagem.</div>
  </div>
</div>
</div>`,
  },
  mindmap: {
    title: "Docker — Mapa Mental completo",
    html: `<style>
.dkmm-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.dkmm-center{background:rgba(36,150,237,.18);border:2px solid #2496ED;border-radius:12px;padding:10px 18px;font-size:13px;font-weight:700;color:#2496ED;text-align:center;display:inline-block;margin:0 auto}
.dkmm-branch{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:8px 12px;font-size:10px;margin:4px 0}
.dkmm-leaf{color:#64748b;font-size:9.5px;padding:2px 0 2px 12px;border-left:2px solid #1e3a5f;margin:2px 0}
.dkmm-col{display:flex;flex-direction:column;gap:6px}
.dkmm-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-top:14px}
.dkmm-b1{border-left:3px solid #2496ED}
.dkmm-b2{border-left:3px solid #4ade80}
.dkmm-b3{border-left:3px solid #f59e0b}
.dkmm-b4{border-left:3px solid #ef4444}
.dkmm-b5{border-left:3px solid #a78bfa}
.dkmm-b6{border-left:3px solid #38bdf8}
.dkmm-label{font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:4px}
</style>
<div class="dkmm-wrap">
<div style="text-align:center;margin-bottom:16px">
  <div class="dkmm-center">🐳 DOCKER</div>
</div>
<div class="dkmm-grid">
  <!-- Coluna 1 -->
  <div class="dkmm-col">
    <div class="dkmm-branch dkmm-b1">
      <div class="dkmm-label" style="color:#2496ED">Arquitetura interna</div>
      <div class="dkmm-leaf">dockerd (daemon API REST)</div>
      <div class="dkmm-leaf">containerd (runtime alto nível)</div>
      <div class="dkmm-leaf">runc (OCI runtime)</div>
      <div class="dkmm-leaf">namespaces (PID,NET,MNT,UTS,IPC)</div>
      <div class="dkmm-leaf">cgroups (CPU, memória, I/O)</div>
      <div class="dkmm-leaf">overlay2 (copy-on-write)</div>
    </div>
    <div class="dkmm-branch dkmm-b2">
      <div class="dkmm-label" style="color:#4ade80">Imagem</div>
      <div class="dkmm-leaf">layers read-only empilhadas</div>
      <div class="dkmm-leaf">Dockerfile → instrução = layer</div>
      <div class="dkmm-leaf">cache por hash de conteúdo</div>
      <div class="dkmm-leaf">multi-stage (toolchain vs runtime)</div>
      <div class="dkmm-leaf">base: alpine / slim / distroless / scratch</div>
      <div class="dkmm-leaf">OCI Image Spec (portável)</div>
    </div>
    <div class="dkmm-branch dkmm-b3">
      <div class="dkmm-label" style="color:#f59e0b">Dockerfile</div>
      <div class="dkmm-leaf">FROM → base da imagem</div>
      <div class="dkmm-leaf">COPY (simples, previsível)</div>
      <div class="dkmm-leaf">RUN → executa e cria layer</div>
      <div class="dkmm-leaf">ENTRYPOINT exec form (PID 1)</div>
      <div class="dkmm-leaf">CMD = args padrão substituíveis</div>
      <div class="dkmm-leaf">USER UID numérico (não root)</div>
      <div class="dkmm-leaf">HEALTHCHECK para orquestrador</div>
    </div>
  </div>
  <!-- Coluna 2 -->
  <div class="dkmm-col">
    <div class="dkmm-branch dkmm-b4">
      <div class="dkmm-label" style="color:#ef4444">Segurança</div>
      <div class="dkmm-leaf">USER não-root (UID numérico)</div>
      <div class="dkmm-leaf">--mount=type=secret (sem rastro)</div>
      <div class="dkmm-leaf">trivy / grype — CVE scan</div>
      <div class="dkmm-leaf">hadolint — Dockerfile lint</div>
      <div class="dkmm-leaf">SBOM (syft, docker sbom)</div>
      <div class="dkmm-leaf">--read-only + tmpfs</div>
      <div class="dkmm-leaf">seccomp + AppArmor</div>
    </div>
    <div class="dkmm-branch dkmm-b5">
      <div class="dkmm-label" style="color:#a78bfa">BuildKit</div>
      <div class="dkmm-leaf">--mount=type=cache (npm/pip)</div>
      <div class="dkmm-leaf">--mount=type=secret</div>
      <div class="dkmm-leaf">--mount=type=ssh</div>
      <div class="dkmm-leaf">stages paralelos independentes</div>
      <div class="dkmm-leaf">syntax=docker/dockerfile:1.6</div>
      <div class="dkmm-leaf">buildx (multi-arch, ARM/AMD64)</div>
    </div>
    <div class="dkmm-branch dkmm-b6">
      <div class="dkmm-label" style="color:#38bdf8">Rede</div>
      <div class="dkmm-leaf">bridge (user-defined + DNS)</div>
      <div class="dkmm-leaf">host (sem NAT, máx perf)</div>
      <div class="dkmm-leaf">overlay (multi-host, VXLAN)</div>
      <div class="dkmm-leaf">none (sem rede)</div>
      <div class="dkmm-leaf">port mapping (-p host:container)</div>
      <div class="dkmm-leaf">DNS interno: 127.0.0.11</div>
    </div>
  </div>
  <!-- Coluna 3 -->
  <div class="dkmm-col">
    <div class="dkmm-branch dkmm-b1">
      <div class="dkmm-label" style="color:#2496ED">Volumes</div>
      <div class="dkmm-leaf">named volume (prod, persistente)</div>
      <div class="dkmm-leaf">bind mount (dev, hot-reload)</div>
      <div class="dkmm-leaf">tmpfs (memória, sensível)</div>
      <div class="dkmm-leaf">bypass overlay2 (I/O intensivo)</div>
      <div class="dkmm-leaf">docker volume inspect/prune</div>
    </div>
    <div class="dkmm-branch dkmm-b2">
      <div class="dkmm-label" style="color:#4ade80">Docker Compose</div>
      <div class="dkmm-leaf">healthcheck + depends_on</div>
      <div class="dkmm-leaf">condition: service_healthy</div>
      <div class="dkmm-leaf">restart: unless-stopped</div>
      <div class="dkmm-leaf">deploy.resources (CPU/mem limit)</div>
      <div class="dkmm-leaf">override files (dev/prod)</div>
      <div class="dkmm-leaf">profiles (subsets de serviços)</div>
    </div>
    <div class="dkmm-branch dkmm-b3">
      <div class="dkmm-label" style="color:#f59e0b">Debug &amp; Operação</div>
      <div class="dkmm-leaf">docker logs -f --tail=100</div>
      <div class="dkmm-leaf">docker stats (CPU/MEM tempo real)</div>
      <div class="dkmm-leaf">docker inspect (JSON completo)</div>
      <div class="dkmm-leaf">exit code 137 = OOMKill</div>
      <div class="dkmm-leaf">docker exec -it id sh</div>
      <div class="dkmm-leaf">dive (layers visualmente)</div>
    </div>
    <div class="dkmm-branch dkmm-b4">
      <div class="dkmm-label" style="color:#ef4444">Runtime Stack</div>
      <div class="dkmm-leaf">K8s usa containerd via CRI</div>
      <div class="dkmm-leaf">gVisor (sandbox de kernel)</div>
      <div class="dkmm-leaf">Kata Containers (VM por container)</div>
      <div class="dkmm-leaf">tini / dumb-init (PID 1)</div>
      <div class="dkmm-leaf">Docker vs container runtime</div>
    </div>
  </div>
</div>
</div>`,
    caption: "Ecossistema Docker do daemon ao runtime. Em produção: K8s usa containerd diretamente — o dockerd some da cadeia. Segurança é multicamada: não-root + secret mount + scan + seccomp.",
  },
  resources: [
    { title: "Docker Documentation", url: "https://docs.docker.com/", kind: "docs" },
    { title: "Dockerfile Best Practices", url: "https://docs.docker.com/build/building/best-practices/", kind: "docs" },
    { title: "BuildKit — Dockerfile reference", url: "https://docs.docker.com/build/buildkit/", kind: "docs" },
    { title: "dive — explorar layers visualmente", url: "https://github.com/wagoodman/dive", kind: "pratica" },
    { title: "trivy — security scanner", url: "https://trivy.dev/", kind: "pratica" },
    { title: "Play with Docker (lab gratuito)", url: "https://labs.play-with-docker.com/", kind: "pratica" },
    { title: "Docker Deep Dive — Nigel Poulton", url: "https://nigelpoulton.com/books/", kind: "livro" },
    { title: "TechWorld with Nana — Docker completo", url: "https://www.youtube.com/watch?v=3c-iBn73dDE", kind: "video" },
    { title: "Containers from Scratch — Liz Rice (GOTO 2018)", url: "https://www.youtube.com/watch?v=8fi7uSYlOdc", kind: "video" },
    { title: "distroless images — Google", url: "https://github.com/GoogleContainerTools/distroless", kind: "docs" },
  ],
  videos: [
    { title: "Docker in 100 Seconds", channel: "Fireship", url: "https://www.youtube.com/watch?v=Gjnup-PuquQ", topic: "visão geral", note: "Melhor introdução visual ao conceito de container. Assista antes de qualquer coisa." },
    { title: "Containers from Scratch — Liz Rice", channel: "GOTO Conferences", url: "https://www.youtube.com/watch?v=8fi7uSYlOdc", topic: "namespaces / cgroups", note: "Implementa um container no Go do zero usando namespaces e cgroups. A melhor demonstração de como containers funcionam internamente. Assistir uma vez transforma o entendimento." },
    { title: "Docker Tutorial for Beginners — completo", channel: "TechWorld with Nana", url: "https://www.youtube.com/watch?v=3c-iBn73dDE", topic: "tutorial completo", note: "Cobertura completa da prática: run, build, compose, volumes, networks. O melhor tutorial longo disponível." },
    { title: "Docker Security Best Practices", channel: "Snyk", url: "https://www.youtube.com/watch?v=JE2PJbbpjsM", topic: "segurança", note: "Non-root user, secrets, scan de vulnerabilidades, seccomp. Essencial para qualquer deploy em produção." },
  ],
}

export default docker
