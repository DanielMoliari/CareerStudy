import type { SkillContentMap } from "@/types"

const data: SkillContentMap = {
  "docker": {
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
        a: "<p>COPY é a instrução simples e previsível: copia arquivos/diretórios do contexto de build para o filesystem da imagem. Faz exatamente o que parece — nada mais.</p><p>ADD tem comportamentos extras que raramente você quer:</p><ul><li>Extrai automaticamente arquivos tar.gz para o destino (parece conveniente, mas obscurece o que está na imagem)</li><li>Aceita URLs como fonte (baixa o arquivo durante o build — não passa por cache, não é reproduzível, pode mudar silenciosamente)</li></ul><p><strong>Regra prática: sempre use COPY.</strong> Use ADD apenas para o único caso legítimo: ADD --chown=user:group arquivo.tar.gz /destino/ quando você quer extrair e mudar ownership atomicamente.</p><p>O uso de ADD com URL (ADD https://exemplo.com/arquivo.tar.gz /app/) é um antipadrão explicitamente listado nas boas práticas do Docker: viola reprodutibilidade, pode baixar código malicioso, não é cacheado corretamente. Use RUN curl/wget + extraia explicitamente se precisar baixar algo.</p>",
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
    ],
    mnemonics: [
      {
        label: "Ordem do Dockerfile — COLD",
        trick: "C-O-L-D: Config (FROM/ENV), OS (RUN install), Libs (COPY manifesto + install), Data (COPY código)",
        explanation: "O que muda menos vem primeiro para maximizar o cache. Config da base praticamente nunca muda. Packages do OS mudam com patches. Libs (deps) mudam menos que o código. Código muda a todo commit.",
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
  },

  "docker-compose": {
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
  },

  "github-actions": {
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
  },

  "tdd": {
    tagline: "Test-Driven Development — escrever o teste antes do código, ciclo Red-Green-Refactor.",
    why: "TDD aparece em entrevista como filtro de disciplina, design e maturidade. Sênior precisa explicar quando vale (lógica não trivial, refactor seguro, bug fix) e quando NÃO vale (UI exploratória, protótipo, integração com API desconhecida). É sobre design, não sobre cobertura — código testável tende a ser desacoplado, e o teste vira documentação executável. Em times maduros, TDD é cultura e diferencia quem entende design emergente de quem só clica 'verde'. Cai em entrevista de backend, fullstack e em qualquer vaga com expectativa de qualidade.",
    prerequisite: "Saber escrever teste unitário com qualquer framework (Jest, Vitest, JUnit, PyTest, RSpec). Conhecer fundamentos de OO ou programação funcional. Entender mock, stub e injeção de dependência. Se você nunca escreveu um teste em projeto profissional, faça isso primeiro — TDD é teste com timing diferente, não outra coisa.",
    summary: "TDD foi formalizado por Kent Beck no livro Test-Driven Development by Example (2002). O ciclo tem 3 fases curtas (1-5 minutos cada): RED (escreve um teste que falha porque o comportamento ainda não existe — o teste é o spec), GREEN (escreve o MÍNIMO de código para passar — pode ser feio, hardcoded, qualquer coisa), REFACTOR (limpa o código sem mudar comportamento, com a suite verde como rede de segurança). O ganho real não é cobertura — é design: código testável tende a ser desacoplado, com responsabilidades explícitas. A pirâmide de testes (Mike Cohn) orienta o mix: muitos unitários (base, rápidos), alguns de integração (meio, fronteiras), poucos E2E (topo, lentos e caros). Os princípios F.I.R.S.T (Fast, Independent, Repeatable, Self-validating, Timely) descrevem o que é um bom teste. Variantes: BDD (Cucumber/Gherkin com linguagem de negócio), ATDD (testes de aceitação primeiro), Property-Based Testing (gera centenas de inputs aleatórios validando invariantes).",
    howToStudy: "<strong>Tem 30 minutos antes de uma entrevista?</strong> Revise o ciclo Red-Green-Refactor, F.I.R.S.T, pirâmide de testes. Treine as Q&As de 'quando NÃO usar TDD' e 'mocks vs fakes' em voz alta. Esses são os filtros mais comuns.<br><br><strong>Tem um fim de semana?</strong> Faça os katas FizzBuzz, Bowling Game e String Calculator em TDD puro — escreva o teste primeiro, jamais antecipe código. Anote quantas vezes você quebrou a regra. Leia o capítulo 1 do TDD by Example (multi-currency money) — é o exemplo canônico.<br><br><strong>Tem uma semana?</strong> Implemente uma feature real (autenticação, parser de CSV, máquina de estados) só com TDD. Adicione mutation testing (Stryker para JS) e veja a qualidade dos seus asserts. Leia Working Effectively with Legacy Code (Feathers) para aprender a aplicar TDD em base sem testes — isso é o caso real do dia a dia.",
    diagrams: [
      {
        title: "Ciclo Red-Green-Refactor — passo a passo",
        html: `<style>
.tdd1-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.tdd1-step{border-radius:10px;padding:14px 16px;border:1.5px solid;margin-bottom:10px;position:relative}
.tdd1-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(100,116,139,.5)}
.tdd1-tip:hover .tdd1-tb{display:block}
.tdd1-tb{display:none;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:240px;pointer-events:none;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.tdd1-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
@keyframes tdd1-pulse-red{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.3)}50%{box-shadow:0 0 0 6px rgba(239,68,68,0)}}
@keyframes tdd1-pulse-grn{0%,100%{box-shadow:0 0 0 0 rgba(74,222,128,.3)}50%{box-shadow:0 0 0 6px rgba(74,222,128,0)}}
@keyframes tdd1-pulse-blu{0%,100%{box-shadow:0 0 0 0 rgba(36,150,237,.3)}50%{box-shadow:0 0 0 6px rgba(36,150,237,0)}}
.tdd1-pulse-red{animation:tdd1-pulse-red 2s ease-in-out infinite}
.tdd1-pulse-grn{animation:tdd1-pulse-grn 2s ease-in-out infinite}
.tdd1-pulse-blu{animation:tdd1-pulse-blu 2s ease-in-out infinite}
</style>
<div class="tdd1-wrap">
  <p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Ciclo Red-Green-Refactor — exemplo: implementar split(str, sep)</p>
  <p style="color:#475569;font-size:10px;margin:0 0 16px">Cada fase dura 1-5 minutos. Se passou disso, está fazendo errado — passos pequenos demais não doem; grandes demais perdem o feedback.</p>

  <div class="tdd1-step tdd1-pulse-red" style="border-color:rgba(239,68,68,.4);background:rgba(239,68,68,.04)">
    <div style="font-size:9px;color:#ef4444;letter-spacing:.12em;font-weight:700;margin-bottom:6px">① RED — escreva o teste que FALHA</div>
    <div style="font-size:11px;color:#94a3b8;line-height:1.7">
      <span class="tdd1-tip">Por que falhar primeiro?<span class="tdd1-tb">Garante que o teste mede algo real. Teste que passa antes de implementar pode estar testando errado, faltando assert, ou cobrindo um caminho que já existia. Veja o teste vermelho com seus olhos.</span></span> O teste é a especificação executável.
      <pre style="background:#020617;border:1px solid #334155;border-radius:6px;padding:10px 12px;margin:8px 0 0;font-size:10.5px;color:#94a3b8;overflow-x:auto">test('split divide por separador', () =&gt; {
  expect(split('a,b,c', ',')).toEqual(['a','b','c'])
})

// rodar: <span style="color:#ef4444">FAIL — split is not defined</span></pre>
    </div>
  </div>

  <div style="text-align:center;color:#475569;font-size:14px;margin:0 0 4px">▼</div>

  <div class="tdd1-step tdd1-pulse-grn" style="border-color:rgba(74,222,128,.4);background:rgba(74,222,128,.04)">
    <div style="font-size:9px;color:#4ade80;letter-spacing:.12em;font-weight:700;margin-bottom:6px">② GREEN — código MÍNIMO para passar (pode ser feio)</div>
    <div style="font-size:11px;color:#94a3b8;line-height:1.7">
      <span class="tdd1-tip">Mínimo de verdade<span class="tdd1-tb">Use return ['a','b','c'] hardcoded se for o suficiente. O próximo teste vai forçar generalização. 'Fake it till you make it' — Kent Beck. Tomada de decisão é guiada por testes, não por especulação.</span></span> Sem antecipar requisitos. Pode ser hardcoded.
      <pre style="background:#020617;border:1px solid #334155;border-radius:6px;padding:10px 12px;margin:8px 0 0;font-size:10.5px;color:#94a3b8;overflow-x:auto">function split(str, sep) {
  return str.split(sep)   // o mínimo — usa o split nativo
}

// rodar: <span style="color:#4ade80">PASS</span></pre>
    </div>
  </div>

  <div style="text-align:center;color:#475569;font-size:14px;margin:0 0 4px">▼</div>

  <div class="tdd1-step tdd1-pulse-blu" style="border-color:rgba(36,150,237,.4);background:rgba(36,150,237,.04)">
    <div style="font-size:9px;color:#2496ED;letter-spacing:.12em;font-weight:700;margin-bottom:6px">③ REFACTOR — limpa sem mudar comportamento (suite verde)</div>
    <div style="font-size:11px;color:#94a3b8;line-height:1.7">
      <span class="tdd1-tip">Refactor de duas direções<span class="tdd1-tb">Refatora código de produção (extract function, rename, simplify) E o teste (extract setup, rename, table-driven). Teste é código primeira classe — merece a mesma manutenção.</span></span> Só nesta fase você melhora estrutura.
      <pre style="background:#020617;border:1px solid #334155;border-radius:6px;padding:10px 12px;margin:8px 0 0;font-size:10.5px;color:#94a3b8;overflow-x:auto">// extrai constantes, renomeia, organiza casos
const SEP_DEFAULT = ','
function split(str, sep = SEP_DEFAULT) {
  return str.split(sep)
}

// rodar: <span style="color:#2496ED">ainda PASS — comportamento preservado</span></pre>
    </div>
  </div>

  <div style="text-align:center;color:#475569;font-size:14px;margin:0 0 4px">↻ próxima iteração</div>

  <div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:11px 14px;font-size:11px;color:#94a3b8;line-height:1.7">
    <strong style="color:#fbbf24">Próximo Red:</strong> teste de edge case (string vazia, sep ausente, múltiplos seps consecutivos). Cada novo Red expande o spec — Green generaliza — Refactor mantém limpo.
  </div>
</div>`,
        caption: "O ciclo é curto por design. Se RED dura mais de 5 minutos, o teste é grande demais — quebre. Se GREEN tem complexidade, você está antecipando requisito sem teste forçando — recue. REFACTOR sem suite verde é só edição perigosa. Os 3 passos juntos são o que dá o ganho de design.",
      },
      {
        title: "Pirâmide de testes — custo, velocidade, confiança",
        html: `<style>
.tdd2-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.tdd2-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(100,116,139,.5)}
.tdd2-tip:hover .tdd2-tb{display:block}
.tdd2-tb{display:none;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:230px;pointer-events:none;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.tdd2-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
.tdd2-row{display:flex;align-items:center;gap:12px;margin-bottom:6px}
</style>
<div class="tdd2-wrap">
  <p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Pirâmide de testes (Mike Cohn) — quanto vs onde</p>
  <p style="color:#475569;font-size:10px;margin:0 0 16px">Mais embaixo: rápidos, baratos, focados. Mais em cima: lentos, caros, fiéis.</p>

  <div style="display:grid;grid-template-columns:60px 1fr 100px 100px 90px;gap:8px;align-items:center;padding-bottom:8px;border-bottom:1px solid #1e293b;margin-bottom:8px">
    <div></div>
    <div style="font-size:9px;color:#64748b;letter-spacing:.1em;text-transform:uppercase;font-weight:600">camada</div>
    <div style="font-size:9px;color:#64748b;letter-spacing:.1em;text-transform:uppercase;text-align:center;font-weight:600">qtd</div>
    <div style="font-size:9px;color:#64748b;letter-spacing:.1em;text-transform:uppercase;text-align:center;font-weight:600">velocidade</div>
    <div style="font-size:9px;color:#64748b;letter-spacing:.1em;text-transform:uppercase;text-align:center;font-weight:600">custo</div>
  </div>

  <div class="tdd2-row" style="background:rgba(239,68,68,.06);border-radius:8px;padding:10px 12px">
    <div style="font-size:11px;color:#ef4444;font-weight:700">▲</div>
    <div>
      <div style="font-size:11px;color:#ef4444;font-weight:700">E2E / UI</div>
      <div style="font-size:10px;color:#64748b;line-height:1.5"><span class="tdd2-tip">Roda app real<span class="tdd2-tb">Browser real (Playwright, Cypress) ou app mobile real. Sobe banco, queue, todos os serviços. Lentos (segundos a minutos) e flaky se mal escritos.</span></span> end-to-end. Valida fluxo completo do usuário.</div>
    </div>
    <div style="font-size:11px;color:#94a3b8;text-align:center;font-weight:600">~10%</div>
    <div style="font-size:11px;color:#ef4444;text-align:center">⏱⏱⏱⏱</div>
    <div style="font-size:11px;color:#ef4444;text-align:center">$$$$</div>
  </div>

  <div class="tdd2-row" style="background:rgba(245,158,11,.06);border-radius:8px;padding:10px 12px">
    <div style="font-size:11px;color:#f59e0b;font-weight:700">▲</div>
    <div>
      <div style="font-size:11px;color:#f59e0b;font-weight:700">Integração</div>
      <div style="font-size:10px;color:#64748b;line-height:1.5"><span class="tdd2-tip">Fronteiras reais<span class="tdd2-tb">Banco real (testcontainers, sqlite in-memory), HTTP real para APIs internas, file system real. Mocka só recursos externos pagos (stripe, twilio).</span></span> — DB, HTTP, queue. Foca contratos.</div>
    </div>
    <div style="font-size:11px;color:#94a3b8;text-align:center;font-weight:600">~20%</div>
    <div style="font-size:11px;color:#f59e0b;text-align:center">⏱⏱⏱</div>
    <div style="font-size:11px;color:#f59e0b;text-align:center">$$$</div>
  </div>

  <div class="tdd2-row" style="background:rgba(74,222,128,.06);border-radius:8px;padding:10px 12px">
    <div style="font-size:11px;color:#4ade80;font-weight:700">▲▲</div>
    <div>
      <div style="font-size:11px;color:#4ade80;font-weight:700">Unitários</div>
      <div style="font-size:10px;color:#64748b;line-height:1.5"><span class="tdd2-tip">Funções/classes isoladas<span class="tdd2-tb">Mocka todas as dependências externas (DB, HTTP, clock). Roda em milissegundos. Valida lógica pura, regras de negócio, edge cases.</span></span> — lógica pura, regras de negócio.</div>
    </div>
    <div style="font-size:11px;color:#94a3b8;text-align:center;font-weight:600">~70%</div>
    <div style="font-size:11px;color:#4ade80;text-align:center">⏱</div>
    <div style="font-size:11px;color:#4ade80;text-align:center">$</div>
  </div>

  <div style="margin-top:14px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.2);border-radius:8px;padding:11px 14px">
    <div style="font-size:10px;color:#ef4444;font-weight:700;margin-bottom:5px">⚠ Antipattern: Ice Cream Cone (pirâmide invertida)</div>
    <div style="font-size:10px;color:#94a3b8;line-height:1.6">Muito E2E, pouco unitário. Suite leva 40min, falha aleatório, ninguém sabe onde olhar. Causa: equipe pula direto pra E2E porque não confia na lógica, ou usa E2E pra cobrir buracos do design.</div>
  </div>

  <div style="margin-top:8px;background:rgba(74,222,128,.04);border:1px solid rgba(74,222,128,.2);border-radius:8px;padding:11px 14px">
    <div style="font-size:10px;color:#4ade80;font-weight:700;margin-bottom:5px">✓ Variação: Testing Trophy (Kent C. Dodds)</div>
    <div style="font-size:10px;color:#94a3b8;line-height:1.6">Para frontend moderno: estática (TypeScript, ESLint) > unitário > <strong>integração (mais peso)</strong> > E2E. Argumento: integração testa unidade colaborando — pega bugs que unitários sozinhos perdem.</div>
  </div>
</div>`,
        caption: "A pirâmide é heurística, não dogma. Ratio 70/20/10 é orientação. O importante é o gradiente: muitos rápidos focados embaixo, poucos lentos abrangentes em cima. Inversão (ice cream cone) é o que vai atrasar seu CI e flake sua suite.",
      },
      {
        title: "F.I.R.S.T — princípios de um bom teste",
        html: `<style>
.tdd3-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.tdd3-card{background:#1e293b;border:1px solid #334155;border-radius:10px;padding:14px 16px}
.tdd3-letter{font-size:24px;font-weight:800;letter-spacing:.05em;display:inline-block;width:32px}
</style>
<div class="tdd3-wrap">
  <p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">F.I.R.S.T — checklist de qualidade de teste (Robert Martin)</p>
  <p style="color:#475569;font-size:10px;margin:0 0 16px">Cada letra é uma propriedade que separa teste útil de teste teatro.</p>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
    <div class="tdd3-card" style="border-color:rgba(74,222,128,.3)">
      <div><span class="tdd3-letter" style="color:#4ade80">F</span><span style="font-size:13px;color:#e2e8f0;font-weight:700">ast</span></div>
      <div style="font-size:11px;color:#94a3b8;line-height:1.65;margin-top:6px">Roda em milissegundos. Suite inteira em segundos. Teste lento não roda — vira ritual ignorado.</div>
      <div style="font-size:10px;color:#64748b;margin-top:6px;line-height:1.5"><strong style="color:#4ade80">Como:</strong> mocka I/O (DB, HTTP, fs), evita sleep/wait, não usa setTimeout em produção.</div>
    </div>

    <div class="tdd3-card" style="border-color:rgba(36,150,237,.3)">
      <div><span class="tdd3-letter" style="color:#2496ED">I</span><span style="font-size:13px;color:#e2e8f0;font-weight:700">ndependent</span></div>
      <div style="font-size:11px;color:#94a3b8;line-height:1.65;margin-top:6px">Não depende de outro teste, nem da ordem de execução. Pode rodar isolado ou em paralelo.</div>
      <div style="font-size:10px;color:#64748b;margin-top:6px;line-height:1.5"><strong style="color:#2496ED">Como:</strong> setup/teardown isolado (beforeEach), zero estado global compartilhado, dados próprios.</div>
    </div>

    <div class="tdd3-card" style="border-color:rgba(245,158,11,.3)">
      <div><span class="tdd3-letter" style="color:#f59e0b">R</span><span style="font-size:13px;color:#e2e8f0;font-weight:700">epeatable</span></div>
      <div style="font-size:11px;color:#94a3b8;line-height:1.65;margin-top:6px">Mesmo resultado em qualquer máquina, qualquer momento, mesmo offline. Sem flake.</div>
      <div style="font-size:10px;color:#64748b;margin-top:6px;line-height:1.5"><strong style="color:#f59e0b">Como:</strong> sem rede externa, sem clock real (mock Date.now), sem ordem dependente, sem dado de produção.</div>
    </div>

    <div class="tdd3-card" style="border-color:rgba(167,139,250,.3)">
      <div><span class="tdd3-letter" style="color:#a78bfa">S</span><span style="font-size:13px;color:#e2e8f0;font-weight:700">elf-validating</span></div>
      <div style="font-size:11px;color:#94a3b8;line-height:1.65;margin-top:6px">Resultado é boolean: passa ou falha. Sem 'olhar log e julgar'. Assert claro e específico.</div>
      <div style="font-size:10px;color:#64748b;margin-top:6px;line-height:1.5"><strong style="color:#a78bfa">Como:</strong> expect explícito, mensagens descritivas, sem console.log como verificação.</div>
    </div>

    <div class="tdd3-card" style="border-color:rgba(251,113,133,.3);grid-column:1/-1">
      <div><span class="tdd3-letter" style="color:#fb7185">T</span><span style="font-size:13px;color:#e2e8f0;font-weight:700">imely</span></div>
      <div style="font-size:11px;color:#94a3b8;line-height:1.65;margin-top:6px">Escrito JUNTO com o código (TDD) ou imediatamente depois — não no fim do sprint, não 'quando der tempo'.</div>
      <div style="font-size:10px;color:#64748b;margin-top:6px;line-height:1.5"><strong style="color:#fb7185">Como:</strong> regra do time: PR sem teste = revisão bloqueada. Teste velho cresce divida igual código velho.</div>
    </div>
  </div>

  <div style="background:#020617;border:1px solid #1e3a5f;border-radius:8px;padding:12px 14px">
    <div style="font-size:9px;color:#2496ED;letter-spacing:.1em;font-weight:600;margin-bottom:8px;text-transform:uppercase">AAA — estrutura de cada teste</div>
    <div style="font-size:11px;color:#94a3b8;line-height:1.85">
      <strong style="color:#4ade80">Arrange</strong> — prepara entrada e dependências (mocks, fakes, dados) <br>
      <strong style="color:#fbbf24">Act</strong> — executa a ação que está sendo testada (1 chamada) <br>
      <strong style="color:#2496ED">Assert</strong> — valida o resultado (1 conceito por teste, múltiplos asserts ok)
    </div>
  </div>
</div>`,
        caption: "F.I.R.S.T é checklist mental — antes de commitar um teste, varra as 5 propriedades. Falhar uma já é red flag. Falhar duas é teatro de teste — apaga e refaz.",
      },
    ],
    keypoints: [
      {
        title: "Red-Green-Refactor — o ciclo completo importa",
        body: "Sem o RED, você não garante que o teste falha pelo motivo certo (pode estar testando errado, faltando assert). Sem o REFACTOR, você acumula código feio com suite verde — 'green-without-refactor' é o pecado mais comum. O ciclo inteiro é que dá o ganho: design emergente vem da combinação dos 3.",
        code: `// 1. RED — teste falha
test('soma 2 números', () => {
  expect(somar(2, 3)).toBe(5)
})
// FAIL: somar is not defined

// 2. GREEN — código mínimo
function somar(a, b) { return a + b }
// PASS

// 3. REFACTOR — limpa, organiza, renomeia
// (neste caso já está bom — pula refactor explícito)

// REPETIR para próximo comportamento
test('soma trata negativos', () => {
  expect(somar(-2, 3)).toBe(1)
})`,
      },
      {
        title: "Teste como ferramenta de design",
        body: "Quando você escreve o teste primeiro, está usando o código antes dele existir. Se a API é ruim, você sente na hora — muitos parâmetros, dependência escondida, side effect difícil de mockar. Você ajusta antes de implementar. Código testável tende a ser desacoplado: dependências explícitas (passa por parâmetro/construtor, não import global), funções pequenas (assert focado), separação de I/O e lógica pura.",
        code: `// API ruim — difícil de testar (revela problema de design)
function processarPedido() {
  const user = getCurrentUser()              // global escondido
  const pedido = db.fetchPedido()            // I/O misturado com lógica
  const total = pedido.itens.reduce(...)     // lógica
  emailService.enviar(user, total)           // efeito colateral
}

// API boa — fácil de testar (design emergiu do TDD)
function calcularTotal(itens: Item[]): number {
  return itens.reduce((acc, item) => acc + item.preco * item.qtd, 0)
}
// fácil testar: passa array, verifica número. zero mock necessário.`,
      },
      {
        title: "F.I.R.S.T — propriedades de um bom teste",
        body: "Fast (ms, suite roda em segundos), Independent (sem ordem, sem estado compartilhado), Repeatable (mesmo resultado em qualquer ambiente), Self-validating (passa/falha booleano, sem 'inspecionar log'), Timely (escrito junto com o código, não no fim do sprint). Falhar uma propriedade é red flag — duas é teatro de teste.",
        code: `// ❌ violando F.I.R.S.T
test('processa user', async () => {
  await fetch('https://api.real.com')        // ❌ R: depende da rede
  await new Promise(r => setTimeout(r, 1000)) // ❌ F: lento
  console.log('check log')                   // ❌ S: não é self-validating
})

// ✓ respeitando F.I.R.S.T
test('processa user', () => {
  // Arrange — mock isolado
  const fakeApi = { get: vi.fn().mockResolvedValue({ id: 1 }) }
  // Act
  const result = processar(fakeApi, { id: 1 })
  // Assert — explícito
  expect(result.status).toBe('ok')
})`,
      },
      {
        title: "AAA — Arrange / Act / Assert",
        body: "Estrutura padrão de cada teste em 3 blocos visuais. Arrange prepara entradas e mocks. Act executa a ação testada (1 chamada principal). Assert valida o resultado (1 conceito por teste, múltiplos asserts ok). Separar com linha em branco torna o teste legível como spec executável.",
        code: `test('aplica desconto progressivo em pedido grande', () => {
  // Arrange
  const pedido = {
    itens: [{ preco: 100, qtd: 10 }],
    cliente: { tipo: 'gold' }
  }

  // Act
  const total = calcularTotalComDesconto(pedido)

  // Assert
  expect(total).toBe(850)         // 1000 - 15% gold
  expect(pedido.itens).toHaveLength(1)  // não mutou
})`,
      },
      {
        title: "Mocks vs Stubs vs Fakes vs Spies",
        body: "Stub = retorna valor canned (não verifica chamada). Mock = stub + verifica que foi chamado com X argumentos. Fake = implementação real simplificada (in-memory DB no lugar de Postgres). Spy = wrappa função real e registra chamadas (deixa executar normalmente). Use mock pra interação (notificou? chamou X?), fake pra estado (DB, cache), stub pra resposta simples, spy raramente.",
        code: `// Stub — só retorna valor
const stub = { fetchUser: () => ({ id: 1, name: 'Ana' }) }

// Mock — verifica chamada
const mock = vi.fn()
servico.processar(mock)
expect(mock).toHaveBeenCalledWith({ id: 1 })

// Fake — implementação simplificada (in-memory)
class InMemoryUserRepo {
  users = new Map()
  save(u) { this.users.set(u.id, u) }
  find(id) { return this.users.get(id) }
}

// Spy — observa função real
const spy = vi.spyOn(console, 'log')
runApp()
expect(spy).toHaveBeenCalledTimes(2)`,
      },
      {
        title: "Pirâmide de testes — mix saudável",
        body: "Base: muitos unitários (~70%, rápidos, isolados, validam lógica pura). Meio: alguns integração (~20%, DB real ou in-memory, HTTP, valida contratos). Topo: poucos E2E (~10%, browser real, fluxo crítico do usuário). Inversão (mais E2E que unitário) é o antipattern 'ice cream cone' — CI demora 40min, flaky, ninguém sabe onde olhar quando quebra.",
        code: `// Unitário — função pura, ms, isolado
test('formatarMoeda', () => {
  expect(formatarMoeda(1234.56)).toBe('R$ 1.234,56')
})

// Integração — DB real (testcontainers ou sqlite)
test('repositorio salva e recupera user', async () => {
  const repo = new UserRepository(db)
  await repo.save({ id: 1, name: 'Ana' })
  const found = await repo.findById(1)
  expect(found?.name).toBe('Ana')
})

// E2E — Playwright/Cypress, fluxo completo
test('checkout completo', async ({ page }) => {
  await page.goto('/produtos')
  await page.click('text=Adicionar ao carrinho')
  await page.click('text=Finalizar')
  await expect(page).toHaveURL('/sucesso')
})`,
      },
      {
        title: "Teste comportamento, não implementação",
        body: "Acoplar teste à implementação interna (verificar que método X chamou Y, ou que estado interno é Z) é receita de teste frágil — quebra a cada refactor mesmo sem mudar comportamento. Foque no contrato observável: dado entrada X, retorno é Y. Se você muda a implementação e o teste quebra mas o comportamento está igual, o teste é o bug.",
        code: `// ❌ Acoplado a implementação — quebra em refactor
test('login chama validateEmail e validatePassword', () => {
  const valEmail = vi.spyOn(svc, 'validateEmail')
  const valPwd = vi.spyOn(svc, 'validatePassword')
  svc.login('a@b.com', 'pwd')
  expect(valEmail).toHaveBeenCalled()      // ❌ teste de implementação
  expect(valPwd).toHaveBeenCalled()
})

// ✓ Testa comportamento — sobrevive a refactor
test('login retorna token para credenciais válidas', () => {
  const { token, error } = svc.login('a@b.com', 'pwd')
  expect(token).toMatch(/^jwt\\./)
  expect(error).toBeNull()
})

test('login retorna erro para email inválido', () => {
  const { token, error } = svc.login('invalido', 'pwd')
  expect(token).toBeNull()
  expect(error).toBe('email inválido')
})`,
      },
      {
        title: "Cobertura é enganosa — mutation testing é melhor",
        body: "90% de coverage com asserts vazios é teatro. 60% com asserts duros vale mais. Use mutation testing (Stryker para JS, Pitest para Java) pra medir QUALIDADE: a ferramenta muda seu código (= em !=, + em -) e checa se algum teste pega — se nenhum pega, seu teste é decorativo. Coverage como meta ('100% obrigatório') leva a fraude — dev escreve assert vazio só pra passar.",
        code: `// Coverage diz 100% — mutation testing reprova
function ehAdulto(idade: number) {
  return idade >= 18
}
// teste com 100% coverage mas péssimo
test('ehAdulto', () => {
  ehAdulto(20)   // ❌ executa mas não verifica
  ehAdulto(10)
})

// teste robusto
test.each([
  [17, false],
  [18, true],     // boundary
  [19, true],
  [0, false],
])('ehAdulto(%i) === %s', (idade, esperado) => {
  expect(ehAdulto(idade)).toBe(esperado)
})
// mutation: trocar >= por > → teste 18 falha → mutação detectada ✓`,
      },
      {
        title: "Quando NÃO usar TDD",
        body: "TDD não vale: código exploratório (protótipo, spike pra entender problema), UI muito visual (CSS, layout — teste visual com Chromatic é melhor), integração com API externa desconhecida (faz spike, joga fora, depois reescreve com TDD), one-off scripts. Em geral: faça spike sem teste pra entender, jogue fora, reescreva com TDD pra valer. Forçar TDD em tudo é dogma — perde tempo.",
        code: `// Spike — explorar API desconhecida (joga fora depois)
const r = await fetch('https://api-nova-pra-mim.com/v3/data')
const json = await r.json()
console.log(json)   // ok? estrutura?

// Depois de entender, REESCREVA com TDD:
test('parser extrai itens da resposta da API X', () => {
  const sample = { items: [{ id: 1, name: 'A' }] }
  const result = parseAPI(sample)
  expect(result).toEqual([{ id: 1, name: 'A' }])
})`,
      },
      {
        title: "Test doubles — fronteiras e injeção de dependência",
        body: "Mock só a fronteira (rede, DB, clock, fs, sistema externo) — o resto roda real. Mockar tudo cria 'teste de mock' que passa mas não testa nada útil. Para mockar com facilidade, projete com injeção de dependência: passe colaboradores via construtor/parâmetro, nunca import global. Isso emerge naturalmente em TDD.",
        code: `// ❌ Difícil testar — depende de globals
class Servico {
  processar(id) {
    const user = db.findUser(id)              // global
    const result = httpClient.post(...)       // global
    return result
  }
}

// ✓ Testável — DI permite mockar fronteiras
class Servico {
  constructor(
    private userRepo: UserRepository,    // interface
    private http: HttpClient             // interface
  ) {}
  processar(id) {
    const user = this.userRepo.find(id)
    return this.http.post(...)
  }
}
// teste:
const svc = new Servico(fakeUserRepo, mockHttp)`,
      },
      {
        title: "Refactor seguro — TDD para legacy code",
        body: "Em código sem teste, antes de refatorar, você precisa de RED de cobertura. Técnica do 'golden master': captura output atual da função (random inputs ou inputs reais) como snapshot, depois refatora — se o snapshot continua igual, você não quebrou nada. Útil pra função grande sem teste que precisa virar limpa.",
        code: `// Função legacy gigante e suspeita
function processarRelatorio(dados) { /* 500 linhas */ }

// Golden master — captura comportamento atual
test('golden master', () => {
  const inputs = loadFixtures('producao-real.json')
  const outputs = inputs.map(processarRelatorio)
  expect(outputs).toMatchSnapshot()   // primeira run salva
})

// Agora você pode refatorar com segurança:
// se snapshot mudar, é regressão — investiga
// se snapshot fica igual, refactor preservou comportamento`,
      },
      {
        title: "BDD e Property-Based Testing — variantes do TDD",
        body: "BDD (Behavior-Driven Development): usa linguagem natural (Given/When/Then) pra alinhar com negócio (Cucumber, Gherkin). Útil em times com PO/QA escrevendo specs. Property-Based Testing: gera centenas de inputs aleatórios e valida invariantes (fast-check no JS, QuickCheck no Haskell). Pega edge cases que dev humano não imagina (string vazia, null, números enormes).",
        code: `// Property-based com fast-check
import fc from 'fast-check'

test('reverse(reverse(x)) === x para qualquer string', () => {
  fc.assert(
    fc.property(fc.string(), (s) => {
      expect(reverse(reverse(s))).toBe(s)
    })
  )
})
// gera 100 strings aleatórias incluindo vazias, unicode, longas

// BDD com Cucumber
// Feature: Login
//   Scenario: Usuário válido
//     Given um usuário "ana@x.com" cadastrado
//     When ela faz login com senha correta
//     Then recebe um token JWT válido`,
      },
    ],
    cheatsheet: {
      title: "TDD — Cheat Sheet",
      html: `<style>
.tddcs-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.tddcs-card{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px 14px}
.tddcs-cmd{color:#2496ED;font-size:11.5px;font-weight:700;margin-bottom:4px;font-family:'JetBrains Mono',monospace}
.tddcs-desc{color:#64748b;font-size:10.5px;line-height:1.55}
.tddcs-head{font-size:9px;color:#64748b;letter-spacing:.14em;text-transform:uppercase;margin:14px 0 8px;padding-bottom:6px;border-bottom:1px solid #1e3a5f}
</style>
<div style="font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:20px">
  <p style="color:#e2e8f0;font-size:11px;font-weight:700;margin:0 0 14px;letter-spacing:.06em">TDD — CHEAT SHEET</p>

  <div class="tddcs-head">CICLO E ESTRUTURA</div>
  <div class="tddcs-grid">
    <div class="tddcs-card">
      <div class="tddcs-cmd">RED → GREEN → REFACTOR</div>
      <div class="tddcs-desc">1-5min cada fase. Vermelho = teste falha. Verde = mínimo pra passar (pode ser feio). Refactor = limpa com suite verde.</div>
    </div>
    <div class="tddcs-card">
      <div class="tddcs-cmd">AAA — Arrange/Act/Assert</div>
      <div class="tddcs-desc">3 blocos visuais separados por linha em branco. 1 Act por teste, múltiplos Asserts ok se mesmo conceito.</div>
    </div>
    <div class="tddcs-card">
      <div class="tddcs-cmd">F.I.R.S.T</div>
      <div class="tddcs-desc">Fast (ms), Independent (sem ordem), Repeatable (mesmo resultado), Self-validating (booleano), Timely (junto com código).</div>
    </div>
    <div class="tddcs-card">
      <div class="tddcs-cmd">Pirâmide 70/20/10</div>
      <div class="tddcs-desc">70% unitários, 20% integração, 10% E2E. Inversão = ice cream cone (antipattern).</div>
    </div>
  </div>

  <div class="tddcs-head">TEST DOUBLES</div>
  <div class="tddcs-grid">
    <div class="tddcs-card">
      <div class="tddcs-cmd">Stub</div>
      <div class="tddcs-desc">Retorna valor canned. Não verifica chamada. <code>{ get: () =&gt; ({id:1}) }</code></div>
    </div>
    <div class="tddcs-card">
      <div class="tddcs-cmd">Mock</div>
      <div class="tddcs-desc">Stub + verifica chamada. <code>vi.fn(); expect(m).toHaveBeenCalledWith(...)</code></div>
    </div>
    <div class="tddcs-card">
      <div class="tddcs-cmd">Fake</div>
      <div class="tddcs-desc">Implementação simplificada real (in-memory DB, fake clock). Para teste de estado.</div>
    </div>
    <div class="tddcs-card">
      <div class="tddcs-cmd">Spy</div>
      <div class="tddcs-desc">Wrappa real, registra chamadas, deixa executar. <code>vi.spyOn(obj, 'method')</code></div>
    </div>
  </div>

  <div class="tddcs-head">JEST/VITEST — ASSERTS COMUNS</div>
  <div class="tddcs-grid">
    <div class="tddcs-card">
      <div class="tddcs-cmd">expect(x).toBe(y)</div>
      <div class="tddcs-desc">Igualdade estrita (===). Pra primitivos.</div>
    </div>
    <div class="tddcs-card">
      <div class="tddcs-cmd">expect(x).toEqual(y)</div>
      <div class="tddcs-desc">Igualdade profunda. Pra objetos e arrays.</div>
    </div>
    <div class="tddcs-card">
      <div class="tddcs-cmd">expect(fn).toThrow(...)</div>
      <div class="tddcs-desc">Verifica que função lança erro (com mensagem opcional).</div>
    </div>
    <div class="tddcs-card">
      <div class="tddcs-cmd">expect(arr).toContain(x)</div>
      <div class="tddcs-desc">Item presente. toHaveLength(n) para tamanho.</div>
    </div>
    <div class="tddcs-card">
      <div class="tddcs-cmd">expect(mock).toHaveBeenCalled()</div>
      <div class="tddcs-desc">.toHaveBeenCalledWith(args), .toHaveBeenCalledTimes(n).</div>
    </div>
    <div class="tddcs-card">
      <div class="tddcs-cmd">test.each([...])</div>
      <div class="tddcs-desc">Table-driven test — mesmo teste com vários inputs.</div>
    </div>
  </div>

  <div class="tddcs-head">NAMING — BOAS PRÁTICAS</div>
  <div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px 14px;font-size:10.5px;color:#64748b;line-height:1.85">
    <strong style="color:#4ade80">✓ Bom:</strong> 'retorna 401 para token expirado' / 'aplica desconto de 15% para cliente gold' / 'lança erro quando email é inválido'<br>
    <strong style="color:#ef4444">✗ Ruim:</strong> 'testa funcao login' / 'método foo' / 'should work' / 'test 1'<br>
    <strong style="color:#fbbf24">Padrão:</strong> 'comportamento esperado dado contexto X' — descreve o que, não como
  </div>
</div>`,
    },
    mindmap: {
      title: "Mapa mental — TDD do iniciante ao sênior",
      html: `<style>
.tddmm-row{display:flex;align-items:flex-start;gap:0;padding:8px 0;border-bottom:1px solid #1e293b}
.tddmm-row:last-child{border-bottom:none}
.tddmm-cat{width:120px;flex-shrink:0;font-size:9px;letter-spacing:.08em;font-weight:700;text-transform:uppercase;padding-top:5px;line-height:1.4}
.tddmm-tags{display:flex;flex-wrap:wrap;gap:5px}
.tddmm-tag{font-size:10px;padding:3px 9px;border-radius:4px;background:#1e293b;border:1px solid #334155;color:#94a3b8;white-space:nowrap;line-height:1.4}
.tddmm-tag-key{background:rgba(36,150,237,.08);border-color:rgba(36,150,237,.28);color:#2496ED}
.tddmm-tag-adv{background:rgba(239,68,68,.06);border-color:rgba(239,68,68,.22);color:#f87171}
</style>
<div style="font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px">
  <p style="color:#e2e8f0;font-size:11px;font-weight:700;margin:0 0 10px;letter-spacing:.04em">TDD — MAPA DE CONCEITOS</p>
  <p style="color:#475569;font-size:10px;margin:0 0 16px">Azul: essencial · Vermelho: nível sênior</p>
  <div>
    <div class="tddmm-row">
      <div class="tddmm-cat" style="color:#2496ED">CICLO</div>
      <div class="tddmm-tags">
        <span class="tddmm-tag tddmm-tag-key">Red</span>
        <span class="tddmm-tag tddmm-tag-key">Green</span>
        <span class="tddmm-tag tddmm-tag-key">Refactor</span>
        <span class="tddmm-tag tddmm-tag-key">passos pequenos</span>
        <span class="tddmm-tag">fake it till you make it</span>
        <span class="tddmm-tag tddmm-tag-adv">triangulation</span>
      </div>
    </div>
    <div class="tddmm-row">
      <div class="tddmm-cat" style="color:#4ade80">PRINCÍPIOS</div>
      <div class="tddmm-tags">
        <span class="tddmm-tag tddmm-tag-key">F.I.R.S.T</span>
        <span class="tddmm-tag tddmm-tag-key">AAA</span>
        <span class="tddmm-tag tddmm-tag-key">testar comportamento</span>
        <span class="tddmm-tag tddmm-tag-adv">design emergente</span>
      </div>
    </div>
    <div class="tddmm-row">
      <div class="tddmm-cat" style="color:#f59e0b">PIRÂMIDE</div>
      <div class="tddmm-tags">
        <span class="tddmm-tag tddmm-tag-key">unitário</span>
        <span class="tddmm-tag tddmm-tag-key">integração</span>
        <span class="tddmm-tag tddmm-tag-key">E2E</span>
        <span class="tddmm-tag tddmm-tag-adv">testing trophy</span>
        <span class="tddmm-tag tddmm-tag-adv">ice cream cone</span>
      </div>
    </div>
    <div class="tddmm-row">
      <div class="tddmm-cat" style="color:#a78bfa">DOUBLES</div>
      <div class="tddmm-tags">
        <span class="tddmm-tag tddmm-tag-key">stub</span>
        <span class="tddmm-tag tddmm-tag-key">mock</span>
        <span class="tddmm-tag tddmm-tag-key">fake</span>
        <span class="tddmm-tag">spy</span>
        <span class="tddmm-tag tddmm-tag-adv">DI / IoC</span>
      </div>
    </div>
    <div class="tddmm-row">
      <div class="tddmm-cat" style="color:#38bdf8">FERRAMENTAS</div>
      <div class="tddmm-tags">
        <span class="tddmm-tag tddmm-tag-key">Jest / Vitest</span>
        <span class="tddmm-tag">JUnit / PyTest</span>
        <span class="tddmm-tag tddmm-tag-adv">Stryker (mutation)</span>
        <span class="tddmm-tag tddmm-tag-adv">fast-check (PBT)</span>
        <span class="tddmm-tag tddmm-tag-adv">Testcontainers</span>
      </div>
    </div>
    <div class="tddmm-row">
      <div class="tddmm-cat" style="color:#f97316">VARIANTES</div>
      <div class="tddmm-tags">
        <span class="tddmm-tag tddmm-tag-key">BDD</span>
        <span class="tddmm-tag tddmm-tag-key">ATDD</span>
        <span class="tddmm-tag tddmm-tag-adv">Property-Based</span>
        <span class="tddmm-tag tddmm-tag-adv">Approval Testing</span>
      </div>
    </div>
    <div class="tddmm-row">
      <div class="tddmm-cat" style="color:#e2e8f0">ANTIPATTERNS</div>
      <div class="tddmm-tags">
        <span class="tddmm-tag tddmm-tag-adv">teste implementação</span>
        <span class="tddmm-tag tddmm-tag-adv">mock excessivo</span>
        <span class="tddmm-tag tddmm-tag-adv">estado compartilhado</span>
        <span class="tddmm-tag tddmm-tag-adv">cobertura como meta</span>
        <span class="tddmm-tag tddmm-tag-adv">pular Red</span>
      </div>
    </div>
    <div class="tddmm-row">
      <div class="tddmm-cat" style="color:#c084fc">LEGADO</div>
      <div class="tddmm-tags">
        <span class="tddmm-tag tddmm-tag-key">golden master</span>
        <span class="tddmm-tag tddmm-tag-key">characterization test</span>
        <span class="tddmm-tag tddmm-tag-adv">seam (Feathers)</span>
        <span class="tddmm-tag tddmm-tag-adv">strangler fig</span>
      </div>
    </div>
  </div>
</div>`,
      caption: "Use o mapa pra varrer conceitos antes de entrevista — diga em voz alta o que cada termo significa. Não saber explicar 'mock vs fake' ou 'ice cream cone' pega mal em vaga sênior.",
    },
    codeExamples: [
      {
        title: "Kata FizzBuzz — TDD step-by-step com Vitest",
        description: "Implementação clássica passo a passo. Cada teste novo expande o spec. Note a progressão: hardcoded → if simples → generalização. Não antecipe — deixe o teste forçar.",
        code: `import { test, expect } from 'vitest'

// 1. RED — primeiro teste
test('numero comum retorna o numero como string', () => {
  expect(fizzbuzz(1)).toBe('1')
})

// GREEN — mínimo
function fizzbuzz(n: number): string {
  return String(n)
}

// 2. RED — múltiplo de 3
test('multiplo de 3 retorna Fizz', () => {
  expect(fizzbuzz(3)).toBe('Fizz')
})

// GREEN — adiciona caso
function fizzbuzz(n: number): string {
  if (n % 3 === 0) return 'Fizz'
  return String(n)
}

// 3. RED — múltiplo de 5
test('multiplo de 5 retorna Buzz', () => {
  expect(fizzbuzz(5)).toBe('Buzz')
})

// GREEN
function fizzbuzz(n: number): string {
  if (n % 3 === 0) return 'Fizz'
  if (n % 5 === 0) return 'Buzz'
  return String(n)
}

// 4. RED — múltiplo de 15 (combinação)
test('multiplo de 15 retorna FizzBuzz', () => {
  expect(fizzbuzz(15)).toBe('FizzBuzz')
})

// GREEN — primeiro caso, ordem importa
function fizzbuzz(n: number): string {
  if (n % 15 === 0) return 'FizzBuzz'
  if (n % 3 === 0) return 'Fizz'
  if (n % 5 === 0) return 'Buzz'
  return String(n)
}

// 5. REFACTOR — concatenação revela padrão
function fizzbuzz(n: number): string {
  let r = ''
  if (n % 3 === 0) r += 'Fizz'
  if (n % 5 === 0) r += 'Buzz'
  return r || String(n)
}

// 6. table-driven test
test.each([
  [1, '1'], [2, '2'], [3, 'Fizz'], [5, 'Buzz'],
  [9, 'Fizz'], [10, 'Buzz'], [15, 'FizzBuzz'], [30, 'FizzBuzz'],
])('fizzbuzz(%i) === %s', (input, expected) => {
  expect(fizzbuzz(input)).toBe(expected)
})`,
      },
      {
        title: "Setup Vitest — config, mocks, coverage",
        description: "Setup mínimo de Vitest pra projeto Node/TS com mocks parciais, coverage com v8 e UI interativa pro debug.",
        code: `// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,                      // describe/test/expect globais
    environment: 'node',                // ou 'jsdom' pra DOM
    setupFiles: ['./test/setup.ts'],    // roda antes de cada arquivo
    coverage: {
      provider: 'v8',                   // mais rápido que istanbul
      reporter: ['text', 'html', 'lcov'],
      exclude: ['**/*.test.ts', '**/types/**'],
      thresholds: {                     // coverage mínima — falha CI
        lines: 80,
        functions: 80,
        branches: 75,
      },
    },
    pool: 'threads',                    // paralelismo
  },
})

// test/setup.ts — limpeza global
import { afterEach, vi } from 'vitest'

afterEach(() => {
  vi.clearAllMocks()
  vi.useRealTimers()
})

// teste com mock parcial de módulo
import { vi, test, expect } from 'vitest'

vi.mock('./db', () => ({
  fetchUser: vi.fn().mockResolvedValue({ id: 1, name: 'Ana' }),
}))

test('processa user', async () => {
  const { processarUser } = await import('./service')
  const result = await processarUser(1)
  expect(result.name).toBe('Ana')
})`,
      },
      {
        title: "Refatorando legacy com Golden Master",
        description: "Função enorme sem teste. Estratégia: captura output atual como snapshot, depois refatora com suite verde. Preserva comportamento mesmo sem entender 100%.",
        code: `// 1. CARACTERIZA o comportamento atual
import { test, expect } from 'vitest'
import { processarRelatorio } from './legacy'
import { readFileSync } from 'fs'

test('golden master — relatório legacy', () => {
  const inputs = JSON.parse(readFileSync('./fixtures/inputs.json', 'utf-8'))

  const outputs = inputs.map(processarRelatorio)

  // primeira execução salva snapshot
  // execuções seguintes comparam — falha = regressão
  expect(outputs).toMatchSnapshot()
})

// 2. Agora com suite verde, refatora com confiança
// before:
function processarRelatorio(d) {
  let r = []
  for (let i = 0; i < d.itens.length; i++) {
    if (d.itens[i].ativo === true && d.itens[i].valor > 0) {
      r.push({
        id: d.itens[i].id,
        total: d.itens[i].valor * d.itens[i].qtd,
      })
    }
  }
  return r
}

// after — após refactor com snapshot intacto:
function processarRelatorio(d: Relatorio): Item[] {
  return d.itens
    .filter(item => item.ativo && item.valor > 0)
    .map(item => ({
      id: item.id,
      total: item.valor * item.qtd,
    }))
}

// se o snapshot continuar igual, refactor preservou comportamento ✓`,
      },
      {
        title: "Teste de integração com Testcontainers — Postgres real",
        description: "Em vez de mockar repositório, sobe Postgres real em container só pra teste. Mais fiel que mock, mais rápido que CI compartilhada.",
        code: `import { test, expect, beforeAll, afterAll } from 'vitest'
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql'
import { Pool } from 'pg'
import { UserRepository } from './user-repo'

let container: StartedPostgreSqlContainer
let repo: UserRepository

beforeAll(async () => {
  container = await new PostgreSqlContainer('postgres:16-alpine')
    .withDatabase('test')
    .withUsername('test')
    .withPassword('test')
    .start()

  const pool = new Pool({
    connectionString: container.getConnectionUri(),
  })

  await pool.query(\`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL
    )
  \`)

  repo = new UserRepository(pool)
}, 60_000)   // timeout maior pro container subir

afterAll(async () => {
  await container.stop()
})

test('salva e recupera user', async () => {
  const user = await repo.create({ email: 'a@b.com', name: 'Ana' })
  const found = await repo.findById(user.id)
  expect(found?.name).toBe('Ana')
})

test('email unique violation lança erro', async () => {
  await repo.create({ email: 'unico@x.com', name: 'A' })
  await expect(
    repo.create({ email: 'unico@x.com', name: 'B' })
  ).rejects.toThrow(/unique/i)
})`,
      },
    ],
    gotchas: [
      "Mockar tudo — teste passa mas não testa nada real. Mock só a fronteira (rede, DB, clock, fs); o resto roda real. Senão você está testando o mock, não o código.",
      "Teste acoplado a implementação — verifica que método X chamou Y interno. Quebra a cada refactor mesmo sem mudar comportamento. Teste comportamento (input → output observável), não detalhes internos.",
      "Compartilhar estado entre testes — flakiness garantida. Setup/teardown isolado em beforeEach (não beforeAll para estado mutável). Cada teste cria seus dados ou usa fixture imutável.",
      "Test pyramid invertida (ice cream cone) — mais E2E que unitário. CI demora 40min, flaky, ninguém entende onde quebrou. Causa: confiança baixa na lógica, design ruim que não permite testar unidade.",
      "Pular o RED — escrever teste depois do código. Vira 'test-after-development', perde o feedback de design. Sem RED, você não garante que o teste falha pelo motivo certo (pode estar testando sucesso falso).",
      "Cobertura como meta — gerência exige '100% coverage' e dev escreve assert vazio só pra passar. Use coverage como sinal de gap (linhas não cobertas existem?), não como KPI. Mutation testing (Stryker) mede qualidade real dos asserts.",
      "Nome de teste descrevendo implementação — 'testa que método foo chama bar duas vezes'. Não diz nada do que o sistema faz. Use linguagem de comportamento: 'aplica desconto de 15% para cliente gold' — o nome é parte do spec.",
      "Sem refactor depois do GREEN — código fica feio acumulado. Refactor é a fase mais subestimada — ela é o ganho de design do TDD. Suite verde é exatamente o momento de melhorar estrutura sem medo.",
      "Teste assíncrono mal escrito — esquecer await ou return em promise. O teste 'passa' porque acabou antes do assert rodar. Use await em assert assíncrono. expect(promise).resolves.toBe(...) ou rejects.toThrow().",
      "Snapshot grande/instável — gera 1000 linhas de JSON com timestamps. Falsos positivos a cada run. Filtre dados voláteis antes de matchSnapshot, ou prefira asserts explícitos pra estrutura crítica.",
      "Mock que mente — implementação do mock diverge da real. Teste passa, prod quebra. Use contract testing (Pact) ou shared fixture entre mock e implementação real, ou prefira fake (in-memory real) sobre mock.",
      "Tudo em um teste só (assert múltiplo de conceitos diferentes) — quando falha, você não sabe o que quebrou. Quebre em testes pequenos com nome descritivo. 1 conceito por teste, múltiplos asserts ok se mesmo conceito.",
    ],
    interview: [
      {
        q: "TDD vale sempre? Quando você NÃO usaria?",
        level: 'pleno',
        a: "<p>Não vale sempre. <strong>Vale</strong>: lógica não trivial (cálculo, regra de negócio, parser, state machine), refactor de código legado (com golden master primeiro), biblioteca compartilhada, bug fix (teste primeiro reproduzindo o bug, depois corrige).</p><p><strong>NÃO vale</strong>: protótipo descartável (você vai jogar fora), UI muito visual (CSS, layout — teste visual com Chromatic é melhor), exploração de API externa desconhecida (faça spike pra entender, jogue fora, depois reescreve com TDD), one-off scripts.</p><p>Em geral: faço spike sem teste pra entender o problema, jogo fora, reescrevo com TDD pra valer. Forçar TDD em tudo é dogma — perde tempo em código que você descobre que precisa jogar fora.</p>",
        tip: "Entrevistador testa pragmatismo — quem diz 'TDD sempre' é candidato dogmático. Mostre que conhece os limites e tem critério claro.",
      },
      {
        q: "Por que TDD melhora design e não só qualidade?",
        level: 'pleno',
        a: "<p>Quando você escreve teste primeiro, você usa o código antes de existir. Se a API é ruim, você sente na hora — muitos parâmetros, dependência escondida, side effect difícil de mockar. Você ajusta antes de implementar.</p><p>Código testável tende a ter:</p><ul><li><strong>Dependências explícitas</strong>: passa por construtor/parâmetro, não import global. Isso é Dependency Injection emergindo da disciplina de teste.</li><li><strong>Funções pequenas</strong>: assert focado força você a quebrar em unidades pequenas com responsabilidade única.</li><li><strong>Separação de I/O e lógica pura</strong>: lógica testa rápido em unitário, I/O testa em integração — você naturalmente separa.</li><li><strong>Coesão alta</strong>: o teste serve como cliente da API — APIs ruins ficam evidentes.</li></ul><p>Isso é basicamente SOLID emergindo da disciplina de teste. Não é coincidência — Kent Beck e Bob Martin descreveram esses princípios depois de anos praticando TDD.</p>",
      },
      {
        q: "Explique a pirâmide de testes. O que é o antipattern 'ice cream cone'?",
        level: 'pleno',
        a: "<p>A pirâmide (Mike Cohn) orienta o mix saudável de testes:</p><ul><li><strong>Base (~70%) — unitários</strong>: rápidos (ms), isolados, testam função/classe pura. Pegam regressão na lógica de negócio.</li><li><strong>Meio (~20%) — integração</strong>: testam fronteiras (DB, HTTP, queue). Mais lentos (centenas de ms), validam contratos entre componentes.</li><li><strong>Topo (~10%) — E2E</strong>: app real, browser real (Playwright/Cypress). Lentos (segundos a minutos), validam fluxo completo do usuário.</li></ul><p><strong>Ice cream cone</strong> é a pirâmide invertida: muito E2E, pouco unitário. Acontece quando time não confia na lógica isolada e prefere 'testar pelo navegador'. Sintomas: CI demora 40min, suite flaky, quando algo quebra ninguém sabe onde olhar (foi backend? frontend? infra?).</p><p>Causas: design acoplado que não permite testar unidade isolada, falta de disciplina de TDD, ou tentativa de cobrir buracos de design com E2E.</p><p>Variação moderna pra frontend: <strong>Testing Trophy</strong> (Kent C. Dodds) — peso maior em integração. Argumenta que integração pega bugs de colaboração que unitários puros perdem.</p>",
        tip: "Mencione que ratio é heurística — o importante é o gradiente (muitos rápidos focados embaixo, poucos lentos abrangentes em cima). Cite testing trophy como evolução pra ganhar pontos.",
      },
      {
        q: "Diferença entre mock, stub, fake e spy?",
        level: 'pleno',
        a: "<p>Quatro categorias de test doubles (Gerard Meszaros, xUnit Patterns):</p><ul><li><strong>Stub</strong>: retorna valor canned. Não verifica chamada. <code>{ get: () =&gt; ({id:1}) }</code>. Use pra prover dado de entrada.</li><li><strong>Mock</strong>: stub + verifica que foi chamado com certos argumentos. <code>vi.fn(); expect(m).toHaveBeenCalledWith(...)</code>. Use pra testar interação (notificou? chamou X?).</li><li><strong>Fake</strong>: implementação real simplificada. In-memory DB, fake clock, fake file system. Use pra teste de estado quando real é caro/lento.</li><li><strong>Spy</strong>: wrappa função real, registra chamadas, deixa executar normalmente. <code>vi.spyOn(obj, 'method')</code>. Use pra observar sem substituir comportamento.</li></ul><p><strong>Quando usar cada um</strong>:</p><ul><li>Mock para testar comunicação/protocolo (mandou email? chamou pagamento?)</li><li>Fake para testar estado (DB salvou? cache invalidou?)</li><li>Stub para fixture simples</li><li>Spy raramente — geralmente é sinal de teste de implementação</li></ul><p>Antipattern: <strong>mock excessivo</strong>. Quando você mocka 5 colaboradores num teste, você está testando o mock, não o código. Mock só a fronteira (rede, DB, clock); o resto roda real.</p>",
      },
      {
        q: "Como você testa código legacy sem teste?",
        level: 'senior',
        a: "<p>Estratégia clássica do livro Working Effectively with Legacy Code (Michael Feathers): você não pode refatorar com segurança sem rede de teste, mas não pode escrever teste em código que não foi desenhado pra isso. Sai do paradoxo com:</p><p><strong>1. Characterization Test (Golden Master)</strong>: captura o comportamento atual como spec. Roda a função com inputs reais (ou aleatórios), salva output como snapshot. Snapshot vira contrato — se mudar, você sabe que algo quebrou.</p><pre><code>test('golden master', () => {\n  const inputs = loadFixtures('producao.json')\n  const outputs = inputs.map(legacyFn)\n  expect(outputs).toMatchSnapshot()\n})</code></pre><p><strong>2. Encontre 'seams'</strong> (Feathers): pontos onde você pode mudar comportamento sem editar o código original — extract method, parameterize constructor, sprout method. Insere testabilidade aos poucos.</p><p><strong>3. Strangler Fig pattern</strong>: nova feature vai numa camada nova com TDD. Aos poucos, o código legacy é estrangulado e substituído.</p><p><strong>4. Testes de aproximação</strong>: se a função tem dependências horríveis, teste a saída observável (log, banco, response). Não é ideal, mas é melhor que nada — você ganha confiança pra refatorar e melhorar a testabilidade depois.</p><p>Importante: aceite que cobertura inicial vai ser baixa. Suba aos poucos, sem dogmatismo.</p>",
        tip: "Cite o livro do Feathers — sinal claro pra entrevistador sênior que você leu literatura clássica. Mencione golden master como técnica concreta — diferencia de candidato que só fala em abstrações.",
      },
      {
        q: "O que é mutation testing e por que é mais útil que coverage?",
        level: 'senior',
        a: "<p><strong>Coverage</strong> mede quantas linhas/branches o teste executa. Mas executar não é validar — você pode ter 100% coverage com asserts vazios.</p><p><strong>Mutation testing</strong> mede a QUALIDADE dos asserts. A ferramenta (Stryker pra JS, Pitest pra Java, mutmut pra Python) muda seu código levemente — troca <code>===</code> por <code>!==</code>, <code>&gt;</code> por <code>&gt;=</code>, <code>+</code> por <code>-</code>, remove return, etc. Cada mudança é uma 'mutação'. Depois roda sua suite. Se algum teste falha, a mutação foi 'morta' (good — sua suite pegou). Se todos passam, a mutação 'sobreviveu' — sinal de que sua suite não distingue o código original do mutante.</p><p><strong>Métrica</strong>: mutation score = mutações mortas / total. 80%+ é bom. 60% indica buracos sérios.</p><p><strong>Por que é melhor que coverage</strong>: coverage 100% pode coexistir com mutation score 30%. Você executou todas as linhas mas não validou nada interessante. Mutation testing força você a escrever asserts que diferenciam comportamentos parecidos.</p><p><strong>Tradeoff</strong>: mutation testing é lento (roda a suite N vezes). Use em CI nightly ou em código crítico (parser, regra de negócio, biblioteca compartilhada). Não em todo PR.</p>",
      },
      {
        q: "Como você lida com testes flaky?",
        level: 'senior',
        a: "<p>Teste flaky (passa às vezes, falha às vezes sem mudança no código) é dívida — equipe perde confiança na suite, ignora vermelho, deixa bug passar.</p><p><strong>Causas comuns</strong>:</p><ul><li><strong>Tempo</strong>: setTimeout, sleep, asserts dependentes de clock — use clock fake (vi.useFakeTimers).</li><li><strong>Ordem</strong>: teste depende de estado deixado por outro — isole com beforeEach, evite estado global.</li><li><strong>Concorrência</strong>: race condition em paralelismo — não compartilhe DB/recurso entre workers, use porta dinâmica, namespace por worker.</li><li><strong>Rede</strong>: fetch para serviço externo — mocka ou usa MSW.</li><li><strong>Não-determinismo</strong>: Math.random, Date.now, UUID — injete via DI.</li><li><strong>Seletor frágil</strong> (E2E): nth-child, classes geradas — use getByRole, getByTestId.</li></ul><p><strong>Processo</strong>: quando flake aparece, marca como quarentena (test.skip + issue), investiga causa raiz, corrige. NUNCA aumente retry count como solução — esconde o bug. Retry vale só pra rede inerentemente instável (E2E), não pra unitário.</p><p><strong>Prevenção</strong>: rodar suite com --shuffle (ordem aleatória) revela dependências de ordem. Rodar 100x em CI nightly captura flake antes de aparecer em PR.</p>",
      },
      {
        q: "Explique BDD. Quando usar em vez de TDD puro?",
        a: "<p><strong>BDD (Behavior-Driven Development)</strong> é evolução do TDD focada em colaboração com não-devs (PO, QA, negócio). Especificações são escritas em linguagem natural com a estrutura Given/When/Then (Gherkin), e ferramentas como Cucumber, SpecFlow ou Behave conectam essas specs a código de teste.</p><pre><code>Feature: Login\n  Scenario: Usuário válido\n    Given um usuário 'ana@x.com' cadastrado\n    When ela faz login com senha correta\n    Then recebe um token JWT</code></pre><p><strong>Quando usa BDD</strong>: time com PO/QA escrevendo specs em linguagem natural, domínio com regras de negócio complexas que precisam de validação humana, projeto regulado (financeiro, saúde) onde spec é documento auditável.</p><p><strong>Quando NÃO usa</strong>: time só de devs (overhead da linguagem natural não compensa), projeto técnico (lib, infra), startup com requisitos voláteis. Em time pequeno, escrever Gherkin pra cada feature pode ser teatro burocrático.</p><p><strong>Critério</strong>: vale BDD quando o cliente do teste é não-dev. Se só dev escreve e lê o teste, TDD com nomes descritivos é igual de bom e mais simples. ATDD (Acceptance Test-Driven Development) é primo — mesma ideia, foco em testes de aceitação primeiro.</p>",
      },
      {
        q: "Como você testa assíncrono e timing?",
        level: 'pleno',
        a: "<p>Erros comuns em teste assíncrono:</p><ul><li>Esquecer <code>await</code> — teste 'passa' porque acaba antes do assert rodar.</li><li>Não rejeitar promise — <code>expect(p).toBe(...)</code> compara a promise, não o valor.</li><li>setTimeout real torna teste lento.</li></ul><p><strong>Padrões corretos</strong>:</p><pre><code>// async/await\ntest('busca user', async () =&gt; {\n  const user = await fetchUser(1)\n  expect(user.name).toBe('Ana')\n})\n\n// promise direta\ntest('rejeita id inválido', () =&gt; {\n  return expect(fetchUser(-1)).rejects.toThrow('id inválido')\n})\n\n// mocking de timer\ntest('debounce dispara após 500ms', () =&gt; {\n  vi.useFakeTimers()\n  const fn = vi.fn()\n  const debounced = debounce(fn, 500)\n  debounced()\n  expect(fn).not.toHaveBeenCalled()\n  vi.advanceTimersByTime(500)\n  expect(fn).toHaveBeenCalled()\n  vi.useRealTimers()\n})</code></pre><p>Em E2E, use auto-wait (Playwright) e waitFor — nunca <code>page.waitForTimeout(2000)</code>, que assina flakiness.</p>",
      },
      {
        q: "Como TDD se relaciona com Clean Architecture / Hexagonal?",
        level: 'senior',
        a: "<p>Forte relação. Clean Architecture (Bob Martin) e Hexagonal (Alistair Cockburn) propõem que regras de negócio fiquem no centro, isoladas de framework e I/O. As fronteiras (UI, DB, HTTP) são plugadas via interfaces (ports).</p><p>TDD <strong>empurra você naturalmente nessa direção</strong>:</p><ul><li>Pra testar lógica de negócio sem subir DB/HTTP, você é forçado a separar lógica pura de I/O.</li><li>Pra mockar dependências, você é forçado a injetá-las via construtor (DI).</li><li>Pra testar use cases isolados, você é forçado a separá-los de detalhes de framework (Express, Next, NestJS).</li></ul><p><strong>Resultado prático</strong>: time que pratica TDD chega em arquitetura hexagonal sem ler livro nenhum — o design emerge da pressão dos testes.</p><p><strong>Camadas testadas</strong>:</p><ul><li>Domain (entities, value objects, regras puras): unitário, zero mock.</li><li>Use cases / Application: unitário com fakes/mocks de ports.</li><li>Adapters (DB repo, HTTP controller): integração com fronteira real.</li><li>Composição (main): smoke test E2E.</li></ul><p>Pirâmide de testes mapeia direto nas camadas — coincidência não, são abordagens convergentes.</p>",
      },
      {
        q: "Como você define quanto e onde testar? Existe 'teste demais'?",
        level: 'senior',
        a: "<p>Sim, existe teste demais. Sintomas: PR de feature pequena tem 500 linhas de teste e 50 de código; refactor trivial quebra 30 testes; suite roda 10 minutos; equipe tem medo de mexer porque 'vai quebrar testes'.</p><p><strong>Critérios pra decidir o que testar</strong>:</p><ul><li><strong>Risco x complexidade</strong>: lógica complexa (regra de negócio, parser, state machine) e/ou alto risco (financeiro, segurança) → muito teste, vários cenários, edge cases.</li><li><strong>Lógica trivial</strong>: getter/setter simples, mapeamento óbvio → pouco ou nenhum teste unitário (cobre via integração).</li><li><strong>Código de framework</strong>: configuração, glue code → não teste — é o framework que precisa testar.</li><li><strong>UI puramente visual</strong>: CSS, layout → teste visual (Chromatic), não unitário.</li></ul><p><strong>Heurística</strong>: 'teste o que dói se quebrar'. Se o método cair em prod silenciosamente, qual o impacto? Alto = teste. Baixo = pula ou faz integração superficial.</p><p><strong>Sinal de teste demais</strong>: você está testando getters de DTO, mapeamento 1:1 de campos, ou framework. Apaga. Confia no compilador (TS) pra estrutura, e em integração pra fluxo.</p><p>Coverage 100% como meta é antipattern — cria fraude (asserts vazios) e dá falsa segurança. Use coverage como sinal de gap, não como KPI.</p>",
      },
      {
        q: "Property-Based Testing — quando vale a pena?",
        level: 'senior',
        a: "<p><strong>Property-Based Testing (PBT)</strong>: em vez de exemplos manuais (input X → output Y), você define uma <em>invariante</em> que vale pra qualquer input, e a ferramenta (fast-check em JS, Hypothesis em Python, QuickCheck em Haskell) gera centenas de inputs aleatórios validando a invariante.</p><pre><code>import fc from 'fast-check'\n\ntest('reverse(reverse(x)) === x', () =&gt; {\n  fc.assert(\n    fc.property(fc.string(), s =&gt; {\n      expect(reverse(reverse(s))).toBe(s)\n    })\n  )\n})\n// gera 100 strings aleatórias incluindo vazias, unicode, longas, com espaços</code></pre><p><strong>Vantagens</strong>:</p><ul><li>Pega edge cases que dev humano não imagina (string vazia, null, números enormes, caracteres unicode).</li><li>Quando falha, faz <strong>shrinking</strong> — reduz o input ao mínimo que ainda falha (string '\\u0000' em vez de string aleatória de 100 chars).</li></ul><p><strong>Quando vale</strong>: parser, serializer, codificador, função matemática, algoritmo, qualquer função com invariantes claras (idempotência, comutatividade, round-trip).</p><p><strong>Quando não vale</strong>: lógica de negócio com casos discretos ('cliente gold ganha 15% desconto') — exemplo manual é mais claro. Side effects difíceis de testar como property.</p><p>É complementar a TDD por exemplo, não substituto. Em libs sérias (lodash, ramda, date-fns), PBT é padrão.</p>",
      },
    ],
    videos: [
      { title: "TDD — Live Coding em FizzBuzz Kata", channel: "Continuous Delivery (Dave Farley)", url: "https://www.youtube.com/results?search_query=tdd+kata+dave+farley", topic: "kata fundamentos", note: "Dave Farley (autor de Continuous Delivery) faz kata ao vivo mostrando o ciclo Red-Green-Refactor com disciplina exemplar." },
      { title: "Test-Driven Development by Example — Kent Beck", channel: "Various", url: "https://www.youtube.com/results?search_query=test+driven+development+kent+beck", topic: "criador do TDD", note: "Talks do Kent Beck explicando filosofia e práticas. O original — vale a hora gasta." },
      { title: "Why TDD?", channel: "Ian Cooper", url: "https://www.youtube.com/watch?v=EZ05e7EMOLM", topic: "filosofia", note: "Ian Cooper desconstrói mitos do TDD e mostra por que muita gente faz errado. Talk obrigatório pra sênior." },
      { title: "Mocks vs Fakes — Test Doubles Explained", channel: "Mark Seemann / TechWorld", url: "https://www.youtube.com/results?search_query=mocks+vs+fakes+test+doubles", topic: "test doubles", note: "Quando usar cada tipo de double, com exemplos concretos. Resolve confusão clássica de candidato." },
      { title: "Mutation Testing in Practice", channel: "Stryker / Various", url: "https://www.youtube.com/results?search_query=mutation+testing+stryker", topic: "qualidade de teste", note: "Demo de mutation testing pra mostrar como coverage 100% pode coexistir com asserts ruins." },
    ],
    resources: [
      { title: "Test-Driven Development by Example (Kent Beck) — livro fundador", url: "https://www.oreilly.com/library/view/test-driven-development/0321146530/", kind: "livro" },
      { title: "Working Effectively with Legacy Code (Michael Feathers)", url: "https://www.oreilly.com/library/view/working-effectively-with/0131177052/", kind: "livro" },
      { title: "Growing Object-Oriented Software, Guided by Tests (Freeman & Pryce)", url: "https://www.amazon.com/Growing-Object-Oriented-Software-Guided-Tests/dp/0321503627", kind: "livro" },
      { title: "Martin Fowler — TestPyramid", url: "https://martinfowler.com/bliki/TestPyramid.html", kind: "artigo" },
      { title: "Kent C. Dodds — Testing Trophy", url: "https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications", kind: "artigo" },
      { title: "Vitest documentation", url: "https://vitest.dev/", kind: "docs" },
      { title: "Stryker Mutator (mutation testing JS)", url: "https://stryker-mutator.io/", kind: "docs" },
      { title: "fast-check (property-based testing JS)", url: "https://fast-check.dev/", kind: "docs" },
      { title: "Cyber-Dojo (katas online)", url: "https://cyber-dojo.org/", kind: "pratica" },
    ],
    exercises: [
      {
        level: 'iniciante',
        title: "Kata FizzBuzz — TDD puro do zero",
        description: "Implemente FizzBuzz seguindo Red-Green-Refactor estritamente. Para cada caso (número comum, múltiplo de 3, múltiplo de 5, múltiplo de 15), escreva primeiro o teste que falha, depois o código mínimo, depois refatora. Documente cada commit como Red, Green ou Refactor. Não antecipe — deixe os testes forçarem a generalização.",
        concepts: ["Red-Green-Refactor", "passos pequenos", "fake it till you make it", "table-driven test"],
        hint: "Comece com return '1' hardcoded — só generalize quando o segundo teste forçar. Ordem importa: teste de FizzBuzz (15) deve vir antes do código que checa 15. Use test.each pra refatorar testes em tabela.",
        relatedKeypoints: [0, 3],
      },
      {
        level: 'iniciante',
        title: "AAA + F.I.R.S.T — refatorar suite ruim",
        description: "Pegue uma suite com 5-10 testes que violam F.I.R.S.T (testes lentos, dependentes de ordem, sem assert claro, com console.log). Refatore um a um aplicando AAA explicitamente, mockando I/O, isolando setup. Compare tempo da suite antes e depois.",
        concepts: ["AAA", "F.I.R.S.T", "mocks", "beforeEach", "isolamento"],
        hint: "Identifique o pecado de cada teste primeiro (Fast? Independent? Repeatable? Self-validating?). Mock fronteiras com vi.fn() ou MSW. Use beforeEach pra setup isolado. Adicione test.concurrent onde possível.",
        relatedKeypoints: [2, 3, 4],
      },
      {
        level: 'intermediario',
        title: "Calculadora de impostos — TDD com regras de negócio",
        description: "Implemente módulo de cálculo de imposto progressivo com 4-5 faixas, descontos por dependentes, faixa de isenção. Use TDD para cada regra. Inclua edge cases (renda zero, valores negativos, dependentes em faixa de isenção). Termine com mutation testing (Stryker) — atinja 80%+ de mutation score.",
        concepts: ["TDD", "regras de negócio", "table-driven", "mutation testing", "edge cases"],
        hint: "Modele as faixas como array de objetos { de, ate, aliquota }. Use test.each pra cobrir cada faixa. Edge cases primeiro: renda 0, renda negativa (lança erro), renda na fronteira da faixa. Stryker config: thresholds: { high: 80 }.",
        relatedKeypoints: [1, 7],
      },
      {
        level: 'intermediario',
        title: "Refatorar legacy com Golden Master",
        description: "Pegue uma função legacy de 100+ linhas com if-else aninhados e variáveis mutáveis. Capture comportamento atual com snapshot test (Golden Master) usando 50+ inputs reais. Depois refatore em pequenos passos (extract function, replace temp with query, decompose conditional) — snapshot deve permanecer verde em cada commit.",
        concepts: ["legacy code", "characterization test", "golden master", "refactoring"],
        hint: "Função sem teste primeiro recebe snapshot test. Use inputs reais ou property-based generation. Não tente entender 100% — confie no snapshot. Em cada refactor, rode suite — vermelho = você quebrou; verde = preservou. Commit por refactor.",
        relatedKeypoints: [10],
      },
      {
        level: 'senior',
        title: "TDD em hexagonal — domain isolado",
        description: "Construa um use case (ex: criar pedido) seguindo arquitetura hexagonal. Domain entities sem dependência externa, use case recebe ports (UserRepo, NotificationService) via DI. Teste o use case com fakes (in-memory repo, fake notification). Adicione adapter real (Postgres repo, SES email) testado em integração com Testcontainers.",
        concepts: ["arquitetura hexagonal", "ports & adapters", "DI", "fakes vs mocks", "Testcontainers"],
        hint: "Crie interfaces de ports na camada de application. Implementação fake do repo é classe com Map<id, entity>. Use case testa contra fakes — zero dependência externa. Adapter real testa contra Postgres em testcontainer. Pirâmide natural emerge.",
        relatedKeypoints: [9, 5],
      },
    ],
    mnemonics: [
      {
        label: "Ciclo TDD — RED · GREEN · REFACTOR",
        trick: "Red (testa falha) · Green (mínimo passa) · Refactor (limpa)",
        explanation: "1-5 minutos cada fase. RED: teste falha pelo motivo certo (você ve o vermelho). GREEN: código mínimo, pode ser feio/hardcoded. REFACTOR: limpa estrutura sem mudar comportamento, com suite verde como rede. Pular RED = não confia que teste mede algo. Pular REFACTOR = código vira espaguete verde. Os 3 juntos é o que dá design emergente.",
      },
      {
        label: "F.I.R.S.T — propriedades de bom teste",
        trick: "Fast · Independent · Repeatable · Self-validating · Timely",
        explanation: "Fast: ms, suite em segundos. Independent: sem ordem, sem estado compartilhado. Repeatable: mesmo resultado em qualquer ambiente, offline. Self-validating: passa/falha booleano, sem inspecionar log. Timely: escrito junto com código, não 'depois quando der tempo'. Falhar uma é red flag; falhar duas é teatro de teste — apaga e refaz.",
      },
      {
        label: "AAA — estrutura de cada teste",
        trick: "Arrange · Act · Assert (separados por linha em branco)",
        explanation: "Arrange prepara entradas, mocks, fixtures. Act executa a ação testada (1 chamada principal). Assert valida o resultado (1 conceito por teste, múltiplos asserts ok se mesmo conceito). Linha em branco entre os 3 blocos torna o teste legível como spec executável. Quem mistura os 3 escreve teste denso e difícil de debugar.",
      },
      {
        label: "Pirâmide — 70/20/10",
        trick: "muitos unitários · alguns integração · poucos E2E",
        explanation: "Base (~70%): unitários, ms, isolam lógica pura. Meio (~20%): integração, fronteiras (DB/HTTP), validam contratos. Topo (~10%): E2E, app/browser real, fluxo crítico. Inversão = ice cream cone (mais E2E que unitário) → CI demora 40min, suite flaky, ninguém sabe onde quebrou. Variação moderna pra frontend: testing trophy (peso maior em integração).",
      },
    ],
  },

  "playwright": {
    tagline: "Framework E2E moderno da Microsoft pra automatizar browser real (Chromium/Firefox/WebKit).",
    why: "Playwright virou o padrão de E2E moderno, substituindo Cypress em muitos times. Senior precisa montar suite estável (sem flakiness), com fixtures, auth reuso, network mock, e integrar em CI sem lentidao.",
    summary: "Playwright roda testes em Chromium, Firefox e WebKit com a mesma API. Diferenciais sobre Cypress: multi-browser real, multi-tab e multi-context, auto-wait em selectors (sem flake de timing), tracing com screenshots e DOM completos pra debug, paralelismo por padrão, suporte a mobile emulation.",
    keypoints: [
      { title: "Auto-wait", body: "Toda action (click, fill) espera até 30s pelo elemento estar visible/enabled/stable. Reduz flake drasticamente. Você raramente precisa de waitFor explícito." },
      { title: "Locators", body: "API moderna: page.getByRole('button', { name: 'Submit' }). Prefere semantica (role, label, text) sobre CSS/xpath. Resiliente a refactor visual." },
      { title: "Browser context", body: "Cada teste roda em context isolado (cookies, storage, cache separados). Multiplos contexts simulam usuários diferentes simultaneos." },
      { title: "storageState", body: "Login uma vez no globalSetup, salva cookies/localStorage em arquivo. Cada teste reusa via storageState: 'auth.json'. Acelera suite que precisa autenticar." },
      { title: "Tracing", body: "--trace on-first-retry grava screenshots, snapshots de DOM, network, console. Abre em npx playwright show-trace. Debug E2E de CI vira trivial." },
      { title: "Network mocking", body: "page.route('**/api/**', route => route.fulfill({...})). Mock de API instavel ou cenario raro (erro 500, timeout)." },
      { title: "Parallelism + sharding", body: "Roda em workers paralelos por padrão. Em CI: --shard=1/4 divide entre 4 maquinas. Suite de 30min vira 8min." },
    ],
    gotchas: [
      "Selector frágeis (CSS encadeado, nth-child) — quebra a cada refactor. Use getByRole, getByLabel, getByTestId.",
      "Compartilhar estado entre testes — depende de ordem, vira flake. Cada teste cria seus dados ou usa worker fixture.",
      "Rodar E2E pra tudo — piramide invertida, CI lenta. E2E e pra fluxo crítico, não pra validar campo de form (isso e unitario).",
      "page.waitForTimeout(2000) e antipattern — assina flakiness. Use waitFor com condição real.",
      "Esquecer de limpar dados de teste — base de staging fica suja, teste falha aleatorio.",
    ],
    interview: [
      { q: "Playwright vs Cypress — quando escolher cada?", a: "<p>Playwright: multi-browser real (Firefox/Safari de verdade, não emulado), multi-tab/popup, paralelismo melhor, tracing superior, suporte a TS/Python/Java/.NET. Mais novo, ecossistema cresceu rápido.</p><p>Cypress: DX historicamente ótimo (UI runner, time-travel debug), comunidade enorme, plugins maduros. Limitações: só Chromium-based historicamente.</p><p>Hoje em 2026 escolho Playwright em projeto novo. Cypress mantenho onde já existe e suite está madura.</p>" },
      { q: "Como reusar login entre testes sem logar 100 vezes?", a: "<p>Usar storageState. Em globalSetup, faz login uma vez, salva cookies/localStorage em auth.json. Em playwright.config.ts, define use: { storageState: 'auth.json' } — todo teste começa já autenticado.</p><p>Pra múltiplos roles (admin, user, guest), gera arquivos separados e usa via fixture: test.use({ storageState: 'admin.json' }) em describe específico.</p>" },
    ],
    resources: [
      { title: "Playwright Documentation", url: "https://playwright.dev/", kind: "docs" },
      { title: "Best Practices", url: "https://playwright.dev/docs/best-practices", kind: "docs" },
      { title: "Trace Viewer", url: "https://playwright.dev/docs/trace-viewer", kind: "docs" },
    ],
  },

  "kubernetes": {
    tagline: "Orquestrador de containers de fato — escala, self-healing, declarativo.",
    why: "K8s e o sistema operacional do cloud-native. Senior precisa explicar conceitos (pod, deployment, service, ingress), debugar (kubectl describe/logs), entender networking (CNI, service mesh), segurança (RBAC, PSA) e quando NÃO usar (complexidade demais).",
    summary: "Kubernetes orquestra containers em cluster de nodes. Você declara desired state em YAML e o control plane reconcilia até alcancar. Pod e a unidade minima (1+ containers que compartilham rede/storage). Deployment gerencia ReplicaSet de pods stateless com rolling update. Service da IP/DNS estável pra grupo de pods. Ingress expoe HTTP externo. ConfigMap/Secret pra config. RBAC pra autorização.",
    keypoints: [
      { title: "Pod, ReplicaSet, Deployment", body: "Pod = um ou mais containers juntos. ReplicaSet mantem N replicas. Deployment gerencia ReplicaSet com rollout/rollback declarativo. Você edita Deployment, nunca pod direto." },
      { title: "Service e DNS interno", body: "Service ClusterIP da IP virtual estável + DNS (svc-name.namespace.svc.cluster.local). NodePort expoe em porta do node. LoadBalancer aloca LB do cloud. ExternalName aliasa DNS externo." },
      { title: "StatefulSet", body: "Pra app com identidade (DBs, Kafka). Pod tem nome estável (db-0, db-1), volume persistente único, ordem de start/stop. Diferente de Deployment (pods são gado, sem identidade)." },
      { title: "Probes", body: "liveness = mata pod se travar (loop infinito). readiness = tira do service até estar pronto (warmup, dep externa). startup = liveness adiada pra app que demora pra subir." },
      { title: "Resource requests/limits", body: "Request = garantia (scheduler usa pra alocar). Limit = teto (kernel mata se passar mem, throttle se passar CPU). Sem request, scheduling vira chaos." },
      { title: "RBAC e ServiceAccount", body: "Cada pod tem ServiceAccount com Role/ClusterRole binding. App só tem permissão API que precisa. Nunca cluster-admin em workload." },
    ],
    gotchas: [
      "Sem resource request — scheduler chuta, pod cai por OOM em horario de pico.",
      "Liveness probe agressivo — mata pod sob carga normal, cria loop. Liveness deve detectar travamento, não lentidao.",
      "latest tag em image — pod recria, cluster pega versão diferente. Pin por SHA ou semver fixo.",
      "Secret em base64 (que e codificacao, não criptografia) — Use sealed-secrets, External Secrets Operator + Vault, ou criptografia at-rest no etcd.",
      "PVC sem reclaim policy correto — delete de PVC apaga dado se policy e Delete. Use Retain em DB crítico.",
      "Subir K8s 'porque e cool' em time pequeno — overhead operacional come a velocidade.",
    ],
    interview: [
      { q: "K8s vs Docker Compose — quando vale a complexidade?", a: "<p>Compose ganha em: dev local, single-host, time pequeno, poucos serviços. K8s começa a valer quando você tem: multi-host (precisa de scheduler), auto-scaling horizontal, rolling update sem downtime, multi-tenant com isolamento, service mesh / canary / blue-green.</p><p>Pra produto pequeno em 1 host, K8s e overkill. Em escala media (50+ serviços, varios times), K8s vira indispensavel pelo modelo declarativo e ecossistema.</p>" },
      { q: "Liveness vs readiness probe — quando usar cada?", a: "<p>Liveness: 'esta vivo?'. Se falha, kubelet mata e recria o pod. Pra detectar deadlock, loop infinito. Endpoint simples, NÃO checa dependências externas (DB cair não deve matar app).</p><p>Readiness: 'pode receber trafego?'. Se falha, pod sai do service endpoint mas continua rodando. Pra warmup (cache aquecendo), graceful shutdown, dep externa indisponível.</p><p>Erro clássico: liveness checando DB. DB pisca, K8s mata todos os pods, downtime amplificado.</p>" },
      { q: "Como você debuga um pod que está em CrashLoopBackOff?", a: "<p>Roteiro:</p><ul><li>kubectl describe pod X — ve eventos (image pull error, OOMKilled, FailedScheduling)</li><li>kubectl logs X --previous — log do container que crashou</li><li>Checar exit code: 137 = OOMKilled, 1 = exit normal de erro</li><li>Resource: pod tem request/limit suficiente?</li><li>Probe: liveness matando antes de subir? Aumentar initialDelaySeconds ou usar startup probe</li><li>Image: tag certa? Registry acessível?</li></ul>" },
    ],
    resources: [
      { title: "Kubernetes Documentation", url: "https://kubernetes.io/docs/home/", kind: "docs" },
      { title: "Kubernetes the Hard Way (Kelsey Hightower)", url: "https://github.com/kelseyhightower/kubernetes-the-hard-way", kind: "pratica" },
      { title: "TechWorld with Nana — K8s", url: "https://www.youtube.com/watch?v=X48VuDVv0do", kind: "video" },
      { title: "Kubernetes Up and Running (livro)", url: "https://www.oreilly.com/library/view/kubernetes-up-and/9781098110192/", kind: "livro" },
    ],
  },

  "linux": {
    tagline: "SO base de toda infra moderna — fundamento que separa dev de senior dev.",
    why: "Linux e onde tudo roda. Senior precisa debugar produção via SSH (logs, processos, rede, disco), escrever shell decente, entender permissões, systemd, e diagnosticar performance (CPU, mem, I/O).",
    summary: "Linux e um kernel + userland (GNU). Distribuições (Ubuntu, Debian, Alpine, RHEL/Fedora) empacotam diferente mas core e o mesmo. Areas que senior precisa: processos (ps, top, htop, kill, signals), filesystem (FHS, permissions rwx, owner/group, sudo), networking (ip, ss, netstat, tcpdump, iptables), logs (journalctl, /var/log), package mgmt (apt, apk, dnf), service mgmt (systemd: systemctl, journalctl), shell (bash básico, pipes, redirect, scripting), performance (vmstat, iostat, sar, perf).",
    keypoints: [
      { title: "Permissoes", body: "rwx pra owner/group/other. chmod 755 = rwxr-xr-x. chown user:group file. SUID/SGID/sticky bit existem mas raros. ACL via setfacl pra controle fino." },
      { title: "Processos e signals", body: "ps aux, top/htop, pgrep. kill -TERM (15) pede pra terminar (graceful), kill -KILL (9) mata sem cleanup. App em container deve tratar SIGTERM pra graceful shutdown." },
      { title: "systemd", body: "systemctl status/start/stop/restart svc. journalctl -u svc -f pra log live. Unit files em /etc/systemd/system/. Em distro moderna substituiu init.d." },
      { title: "Networking essencial", body: "ss -tlnp (sockets escutando), ip a (interfaces), ip r (rotas), dig/nslookup (DNS), curl -v (HTTP debug), tcpdump -i any port 80 (pacote raw)." },
      { title: "Performance triage", body: "USE method (Brendan Gregg): pra cada recurso (CPU, mem, disk, net), checa Utilization, Saturation, Errors. top, vmstat 1, iostat -x 1, sar, iotop, perf top." },
      { title: "Shell pipes e redirect", body: "cmd1 | cmd2 conecta stdout em stdin. > redireciona stdout, 2> stderr, &> ambos. tee duplica. Composicoes resolvem 80%% dos scripts ad-hoc." },
    ],
    gotchas: [
      "rm -rf / com variável vazia — rm -rf \"$DIR/*\" com DIR unset apaga tudo. Sempre set -u em script e validar.",
      "Esquecer set -e em script — comando falha silenciosamente, script continua, danos compostos. Padrão senior: set -euo pipefail.",
      "Permissao 777 — preguica vira buraco de segurança. Pense no mínimo: 755 pra dir, 644 pra arquivo lido.",
      "Rodar tudo como root — qualquer escapada e RCE total. Use user dedicado por serviço.",
      "Disco 'cheio' mas df diz que ha espaco — provavelmente inode esgotado (df -i) ou processo segurando arquivo deletado (lsof | grep deleted).",
    ],
    interview: [
      { q: "Container não sobe em prod, o que você checa?", a: "<p>Roteiro prático:</p><ul><li>docker ps -a ou kubectl get pod — status, exit code</li><li>docker logs ID ou kubectl logs pod — erro de aplicação</li><li>Exit code: 137 = OOMKilled (mem), 139 = segfault, 1 = exit erro app, 143 = SIGTERM (graceful)</li><li>describe pra eventos (image pull, schedule)</li><li>Recursos do host: df -h, free -m, top</li><li>Rede: curl localhost:porta, ss -tlnp pra ver se porta está escutando</li><li>Permissão: container rodando como user que não tem acesso ao volume?</li></ul>" },
      { q: "CPU em 100%% em prod — como diagnostica?", a: "<p>(1) top ou htop — qual processo. (2) top -H -p PID — qual thread. (3) Processo próprio? strace -p PID ou perf top -p PID pra ver onde ta queimando. (4) Em runtime gerenciado: tirar thread dump. (5) vmstat 1: muito us? userspace queima. Muito sy? syscalls demais. wa alto? I/O bound, não CPU.</p>" },
    ],
    resources: [
      { title: "Linux Documentation Project", url: "https://tldp.org/", kind: "docs" },
      { title: "Brendan Gregg — Linux Performance", url: "https://www.brendangregg.com/linuxperf.html", kind: "artigo" },
      { title: "The Linux Command Line (William Shotts)", url: "https://linuxcommand.org/tlcl.php", kind: "livro" },
      { title: "Linux Journey (curso interativo)", url: "https://linuxjourney.com/", kind: "curso" },
      { title: "Julia Evans — zines", url: "https://wizardzines.com/", kind: "artigo" },
    ],
  },

  "nginx": {
    tagline: "Reverse proxy e web server de alta performance — onipresente como entrada de trafego.",
    why: "Nginx aparece em quase toda arquitetura web: ingress de K8s, reverse proxy, TLS termination, load balancer L7. Senior precisa configurar upstream, cache, rate limit, gzip, headers de segurança.",
    summary: "Nginx e servidor web event-driven (epoll/kqueue), super eficiente. Funções principais: reverse proxy pra app backend, load balancer L7 (round robin, least conn, ip hash), TLS termination, static file serving, cache HTTP, rate limiting. Configuração em arquivos nginx.conf com blocos http -> server -> location. Em K8s, vira ingress controller.",
    keypoints: [
      { title: "Reverse proxy", body: "proxy_pass http://backend repassa request pro upstream. Ajuste proxy_set_header Host $host e X-Forwarded-For pra app saber IP real." },
      { title: "Upstream e load balancing", body: "upstream backend { server a:8080; server b:8080; }. Algoritmos: round robin (default), least_conn, ip_hash (sticky), random. max_fails + fail_timeout pra circuit breaker básico." },
      { title: "TLS termination", body: "Termina HTTPS no nginx, fala HTTP com app interno. ssl_certificate, ssl_protocols TLSv1.2 TLSv1.3, ssl_ciphers com lista forte (Mozilla SSL Config Generator). HSTS via add_header Strict-Transport-Security." },
      { title: "Rate limiting", body: "limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s e limit_req zone=api burst=20. Defesa básica contra abuso/DDoS L7." },
      { title: "Headers de segurança", body: "add_header X-Frame-Options DENY, X-Content-Type-Options nosniff, Content-Security-Policy, Referrer-Policy strict-origin-when-cross-origin. Defesa em camadas no proxy." },
    ],
    gotchas: [
      "Esquecer proxy_set_header Host $host — backend ve Host: backend:8080, quebra rotas baseadas em host.",
      "worker_connections baixo — em alta carga vira too many open files. Default 1024, sobe pra 10240+ e ajusta ulimit -n do SO.",
      "Cache sem chave certa — guarda response com Authorization e serve pra outro user.",
      "Rate limit no IP atras de proxy/CDN — todo trafego vem do mesmo IP. Use X-Forwarded-For via real_ip_module.",
      "Esquecer client_max_body_size — upload grande (>1MB default) volta 413.",
    ],
    interview: [
      { q: "Como diagnostica 502 Bad Gateway no nginx?", a: "<p>502 = nginx falou com upstream e o upstream falhou. Roteiro:</p><ul><li>tail -f /var/log/nginx/error.log — mensagem exata (connection refused, timed out, reset by peer)</li><li>Upstream está de pé? curl http://backend:8080 direto do host do nginx</li><li>Rede: firewall/security group bloqueando?</li><li>proxy_read_timeout baixo? App lenta vai dar 504; instavel da 502</li><li>Em K8s: kubectl get endpoints svc — service tem pod ready?</li></ul><p>502 = upstream falhou, 504 = upstream demorou, 499 = cliente desistiu antes do upstream responder.</p>" },
    ],
    resources: [
      { title: "Nginx Documentation", url: "https://nginx.org/en/docs/", kind: "docs" },
      { title: "Mozilla SSL Config Generator", url: "https://ssl-config.mozilla.org/", kind: "pratica" },
    ],
  },

  "gitlab-ci-cd": {
    tagline: "CI/CD nativo do GitLab — pipelines em YAML com runners distribuidos.",
    why: "GitLab CI domina em empresa que self-hospeda Git. Senior precisa montar pipeline com stages, cache, artifacts, child pipelines, dynamic environments e DAG.",
    summary: "GitLab CI le .gitlab-ci.yml na raiz. Pipeline tem stages (sequenciais por padrão, jobs em stage rodam paralelos) ou modelo DAG (needs:) pra paralelismo ótimo. Runner pode ser shared (GitLab.com), group, project, ou self-hosted (Docker, Kubernetes, shell). Recursos chave: artifacts entre stages, cache por chave, environments com deploy/rollback, review apps, parent-child pipelines pra modularizar, rules e only/except pra controlar quando job roda.",
    keypoints: [
      { title: "Stages e jobs", body: "Default: build -> test -> deploy. Jobs no mesmo stage rodam paralelos, stages são sequenciais. needs: quebra essa ordem pra DAG mais rápido." },
      { title: "Rules vs only/except", body: "rules e a sintaxe moderna, mais expressiva (combina if, changes, exists). only/except e legacy, ainda funciona mas em projeto novo: rules." },
      { title: "Cache vs artifacts", body: "Cache = pra acelerar (deps), key reutilizavel, pode perder. Artifacts = output de job consumido por outro job ou pra download (build, relatório de teste). Artifact tem expire_in." },
      { title: "Environments", body: "environment: name: production liga deploy a um environment com URL, histórico, rollback. on_stop: declara job pra teardown (review app de PR)." },
      { title: "Parent-child pipelines", body: "trigger: include: pipeline.yml dispara pipeline filha. Em monorepo, pipeline pai detecta paths alterados e dispara só as filhas relevantes." },
    ],
    gotchas: [
      "Cache muito amplo sem versionamento — inválida pouco, instala velho. Inclua hash do lockfile no key.",
      "Job sem image: — usa default do runner, não reproduzivel. Sempre fixe imagem com tag.",
      "Variaveis sensíveis em variables: do YAML — vai pro repo. Use UI: Settings > CI/CD > Variables, masked + protected.",
      "Esquecer interruptible: true — push novo não cancela pipeline antiga, gasta minuto/recurso.",
    ],
    interview: [
      { q: "GitLab CI vs GitHub Actions — quando preferir cada?", a: "<p>GitLab CI ganha em: empresa self-hosted (GitLab on-prem), suite integrada (CI + registry + security scans + package registry no mesmo lugar), modelo DAG maduro, environments com review app de fabrica.</p><p>GitHub Actions ganha em: ecossistema Marketplace gigante, repos open-source, integração com GitHub-only features (Codespaces, Copilot).</p>" },
    ],
    resources: [
      { title: "GitLab CI/CD Documentation", url: "https://docs.gitlab.com/ee/ci/", kind: "docs" },
      { title: "Pipeline architecture patterns", url: "https://docs.gitlab.com/ee/ci/pipelines/pipeline_architectures.html", kind: "docs" },
    ],
  },

  "jest": {
    tagline: "Test runner de JavaScript da Meta — padrão em projetos React e Node por anos.",
    why: "Jest dominou JS por uma decada. Mesmo com Vitest crescendo, Jest ainda está na maioria dos repos legados. Senior precisa configurar, mockar, debug, snapshot, e migrar pra Vitest quando faz sentido.",
    summary: "Jest e test runner + assertion + mocking integrado. Roda em Node, transforma TS/JSX via babel-jest ou ts-jest. Recursos: describe/it/expect familiar, matchers ricos (toEqual, toMatchObject, toThrow), mocks (jest.fn, jest.mock, automatic mocks de módulos), snapshots, coverage nativo via Istanbul, workers paralelos.",
    keypoints: [
      { title: "Estrutura básica", body: "describe agrupa, it/test roda, expect assert. beforeEach/afterEach pra setup/teardown isolado. beforeAll compartilha (cuidado com state)." },
      { title: "Mocking", body: "jest.fn() cria mock standalone. jest.mock('./module') auto-mocka todos exports. jest.spyOn(obj, 'method') espia sem substituir. mockImplementation customiza retorno." },
      { title: "Snapshots", body: "expect(component).toMatchSnapshot() grava na primeira vez, compara depois. Bom pra detectar mudança inesperada de UI/JSON. Ruim quando snapshot vira gigante e dev só faz -u sem revisar." },
      { title: "Coverage", body: "--coverage roda Istanbul, gera HTML. Threshold em config (coverageThreshold) bloqueia PR abaixo de %%. Cuidado: coverage alto != qualidade." },
    ],
    gotchas: [
      "jest.mock com path relativo — pega caminho do file que chama, não do que e mocked. Em monorepo gera bug.",
      "Esquecer jest.clearAllMocks() em beforeEach — mock de teste anterior vaza.",
      "Async sem await ou return — teste passa antes do assert rodar. Sempre await ou return na promise.",
      "Snapshot enorme (1000 linhas de JSON) — ninguem revisa, perde valor de assert.",
    ],
    interview: [
      { q: "Jest vs Vitest — vale migrar?", a: "<p>Vitest ganha: 5-10x mais rápido (esbuild + workers via vite), API quase compatível com Jest, ESM nativo, melhor DX (UI mode, watch incremental).</p><p>Jest ainda vale: ecossistema maior em React Native, projetos antigos onde migração não paga, integração com tools que só suportam Jest.</p><p>Em projeto novo (especialmente Vite/Next): Vitest. Em projeto Jest grande: migrar incremental.</p>" },
    ],
    resources: [
      { title: "Jest Documentation", url: "https://jestjs.io/", kind: "docs" },
      { title: "Testing Library", url: "https://testing-library.com/", kind: "docs" },
      { title: "MSW (Mock Service Worker)", url: "https://mswjs.io/", kind: "docs" },
    ],
  },

  "vitest": {
    tagline: "Test runner moderno baseado em Vite — rápido, ESM-first, API compatível com Jest.",
    why: "Vitest e o sucessor natural do Jest em projetos Vite/Next/SvelteKit/Vue. Senior precisa explicar por que e mais rápido (esbuild, workers, HMR de teste), config minima, e quando ainda escolher Jest.",
    summary: "Vitest reusa transform/resolve do Vite (esbuild + ESM nativo), o que da boot quase instantaneo e watch mode com hot reload de teste. API e quase 1:1 com Jest (describe/it/expect, vi.fn() em vez de jest.fn()). Recursos diferenciais: UI mode com browser dashboard, in-source testing (testes dentro do arquivo de source), browser mode (roda teste em browser real via Playwright/WebDriver), type testing (expectTypeOf), workspaces pra monorepo.",
    keypoints: [
      { title: "Vite-powered", body: "Reusa vite.config.ts, plugins, aliases, transforms. Se você já usa Vite no app, teste herda config. Boot em ms, watch incremental por arquivo afetado." },
      { title: "API compatível com Jest", body: "describe/it/expect identicos. vi substitui jest (vi.fn, vi.mock, vi.spyOn). Migração mecanica de codebase Jest e direta." },
      { title: "ESM nativo", body: "Sem hack de --experimental-vm-modules. import funciona, top-level await funciona, módulos dinâmicos funcionam." },
      { title: "In-source testing", body: "if (import.meta.vitest) { test(...) } dentro do arquivo de source. Stripped em build de prod. Ótimo pra utility functions." },
      { title: "Browser mode", body: "Roda teste em browser real via Playwright. Componente React/Vue testado em Chromium real, não JSDOM. Mais fiel pra interação de DOM." },
    ],
    gotchas: [
      "Esquecer globals: true em config — describe/it/expect não existem global, exige import. Time vindo de Jest estranha.",
      "Mocking de módulo não-hoisted — vi.mock precisa estar no topo (Vitest hoista, mas evite lógica antes).",
      "Browser mode adiciona setup pesado (Playwright) — vale só pra teste de componente.",
      "Vitest UI em CI — bonita pra dev, mas não roda em pipeline. Use vitest run --reporter=verbose em CI.",
    ],
    interview: [
      { q: "Por que Vitest é mais rápido que Jest?", a: "<p>Três motivos principais:</p><ul><li>esbuild/SWC faz transform de TS/JSX em ms; babel-jest faz em segundos</li><li>ESM nativo: sem CommonJS wrap e cache duplo de módulo</li><li>Vite dev server: arquivo só transforma quando muda, watch incremental, HMR de teste</li></ul><p>Em projeto medio: suite Jest de 30s vira Vitest de 3-5s.</p>" },
    ],
    resources: [
      { title: "Vitest Documentation", url: "https://vitest.dev/", kind: "docs" },
      { title: "Migrating from Jest", url: "https://vitest.dev/guide/migration.html", kind: "docs" },
      { title: "Vitest Browser Mode", url: "https://vitest.dev/guide/browser/", kind: "docs" },
    ],
  },

  "turborepo": {
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
  },

  "feature-flags": {
    tagline: "Toggles em runtime que separam deploy de release — base de continuous delivery moderno.",
    why: "Feature flags virou prática obrigatória em time que deploy varias vezes ao dia. Senior precisa explicar tipos de flag (release, experiment, ops, permission), tradeoff de tech debt (flag stale), integração com canary/A-B test.",
    summary: "Feature flag e um switch em runtime que liga/desliga código sem deploy. Quatro categorias (Pete Hodgson): release toggles (cobrir deploy incompleto), experiment toggles (A/B test), ops toggles (kill switch, circuit breaker), permission toggles (entitlement, feature pago). Implementação vai de simples (if config.feature_x) até plataformas (LaunchDarkly, Unleash, Flagsmith, ConfigCat).",
    keypoints: [
      { title: "Tipos de flag (Pete Hodgson)", body: "Release (curta, some após 100%% rollout), experiment (A/B, dura semanas), ops (kill switch, perm), permission (perm, parte do produto). Cada um tem ciclo de vida e dono diferente." },
      { title: "Targeting", body: "Avaliacao por user ID, segmento (paid, beta, country), porcentagem (rollout 5%%, 25%%, 50%%, 100%%). Hash determinista do user ID garante usuário sempre cai no mesmo bucket." },
      { title: "Kill switch", body: "Ops toggle pra desligar feature em incidente sem rollback de código. Toda feature crítica deveria ter um. Tempo de resposta cai de minutos (rollback) pra segundos (toggle)." },
      { title: "Flag debt", body: "Flag esquecida vira bomba. Cada flag e branch lógico = teste exponencial. Politica: flag de release tem TTL de 30 dias, ferramenta lista flags stale, sprint de cleanup mensal." },
      { title: "Trunk-based dev", body: "Flag permite merge continuo de código incompleto sem expor pro user. Combina com main protected, deploy continuo, rollback via flag." },
    ],
    gotchas: [
      "Flag stale acumulada — código cheio de if flag que sempre retorna true. Cleanup planeado e parte da feature.",
      "Flag em path crítico sem fallback — se serviço de flag cair, tudo cai. SDK precisa de cache local + default sane.",
      "Avaliacao em loop — chamar flags.is_on dentro de loop apertado. Avalie uma vez no inicio da request.",
      "Flag sem owner — ninguem sabe se da pra remover. Tag de owner + ticket no rollout.",
      "A/B sem rigor estatistico — 'vencedor' com p-value 0.3 e ruido.",
    ],
    interview: [
      { q: "Por que separar deploy de release?", a: "<p>Deploy = colocar código em prod. Release = expor feature pro user. Acoplar os dois força rollback completo (perigoso, lento) quando feature da problema, e impede merge incremental.</p><p>Com flag: deploy diario, feature mora em prod escondida, libera por porcentagem, rollback instantaneo via toggle. Continuous delivery de verdade depende disso.</p>" },
      { q: "Como faria rollout de 5%% -> 100%%?", a: "<p>(1) Deploy código com flag off. (2) Liga internal (só meu user, time de eng) — smoke test. (3) Liga 1%% — observa métricas. (4) Sobe gradual: 5%%, 25%%, 50%%, 100%% com janela de horas/dia entre cada. (5) Em cada step, alerta automático reverte se piora. (6) Após 100%% por dias estáveis, remove o código da flag.</p>" },
    ],
    resources: [
      { title: "Pete Hodgson — Feature Toggles", url: "https://martinfowler.com/articles/feature-toggles.html", kind: "artigo" },
      { title: "OpenFeature (CNCF)", url: "https://openfeature.dev/", kind: "docs" },
      { title: "Unleash (open-source)", url: "https://docs.getunleash.io/", kind: "docs" },
    ],
  },

  "k6-load-testing": {
    tagline: "Load test moderno em JS — escrita acessível, integra em CI, válida SLO antes de prod.",
    why: "k6 (Grafana) virou padrão em load test moderno. Senior precisa montar cenario realista (ramp-up, sustain, spike), definir thresholds vinculados a SLO, integrar em CI, e interpretar p95/p99 vs media.",
    summary: "k6 e load testing tool em Go com scripts em JS (ES6+). Escreve cenario como função default que cada VU (virtual user) executa em loop. Suporta scenarios com executores (constant-vus, ramping-vus, constant-arrival-rate, spike), thresholds (assert sobre metric, falha pipeline se quebra), checks (assert por iteracao), saida pra Prometheus/InfluxDB/Grafana Cloud.",
    keypoints: [
      { title: "VU (virtual user)", body: "Cada VU roda a função default em loop. vus: 100 = 100 loops paralelos. Diferente de '100 req/s' — depende da duracao de cada iteracao." },
      { title: "Executors", body: "constant-vus (N VUs por T tempo), ramping-vus (sobe e desce em estagios), constant-arrival-rate (X req/s independente da resposta), ramping-arrival-rate." },
      { title: "Thresholds", body: "thresholds: { http_req_duration: ['p(95)<200'] } — pipeline falha se 5%% das requests passam de 200ms. Vincule diretamente ao SLO." },
      { title: "Cenarios realistas", body: "Cenario simples (smoke), load (carga normal), stress (acima da capacidade pra ver onde quebra), spike (pico repentino), soak (durar horas pra detectar memory leak)." },
    ],
    gotchas: [
      "Testar com 1 VU e achar que e load test — não e teste, e smoke. Load test exige carga.",
      "p50 (mediana) e bom mas p95/p99 são os que importam — usuário do tail e quem reclama.",
      "Open vs closed model: VUs são closed model. Em prod o trafego e open. Use arrival-rate pra simular real.",
      "Rodar load test contra prod sem coordenacao — pode disparar incident, alertas, gastar fatura.",
    ],
    interview: [
      { q: "Como você desenharia load test pra uma API nova?", a: "<p>Roteiro:</p><ul><li>Definir SLO: p95 < 200ms, p99 < 500ms, error rate < 0.1%%, throughput alvo</li><li>Smoke test: 1-5 VUs, 1min, válida cenario funciona</li><li>Load test: carga esperada por 15-30min, válida SLO</li><li>Stress test: rampa até 2-3x esperado, até quebrar</li><li>Spike test: salto repentino pra validar auto-scaling</li><li>Soak test: carga normal por horas, detecta leak</li></ul>" },
    ],
    resources: [
      { title: "k6 Documentation", url: "https://k6.io/docs/", kind: "docs" },
      { title: "k6 Examples", url: "https://k6.io/docs/examples/", kind: "pratica" },
      { title: "Test types (smoke/load/stress/spike/soak)", url: "https://grafana.com/docs/k6/latest/testing-guides/test-types/", kind: "docs" },
    ],
  },

  // ─── P3 ────────────────────────────────────────────────────────────────────

  "git": {
    tagline: "Sistema de controle de versão distribuído — fundamento de todo fluxo de trabalho moderno.",
    why: "Git é a cola que une tudo em desenvolvimento. Senior sabe não só os comandos — sabe resolver conflito de merge, entender rebase vs merge, cherry-pick, bisect pra debugar, e explicar o modelo de objetos (commit, tree, blob).",
    gotchas: [
      "git pull --rebase é mais limpo que merge em branch pessoal, mas rebase em branch compartilhada reescreve histórico e quebra o trabalho do time.",
      "git reset --hard descarta mudanças sem confirmação — diferente de git revert (cria commit desfazendo) que é seguro em branch pública.",
      "Commits imensos com dezenas de arquivos dificultam code review e bisect. Prefira commits atômicos com mensagem descritiva.",
      "git add . captura arquivos não intencionais (.env, binários). Use git add -p para review linha a linha.",
      "Forçar push em main sem proteção apaga histórico para o time inteiro. Nunca --force, prefira --force-with-lease.",
    ],
    resources: [
      { title: "Pro Git (livro gratuito)", url: "https://git-scm.com/book/pt-br/v2", kind: "livro" },
      { title: "Oh Shit, Git!? (guia de recoveries)", url: "https://ohshitgit.com/pt_BR", kind: "artigo" },
    ],
  },

  "pm2": {
    tagline: "Process manager para Node.js — mantém app rodando em prod com cluster e zero-downtime reload.",
    why: "PM2 é o padrão de fato pra rodar Node.js em servidor sem orquestrador. Aparece em ambiente de VPS, EC2 sem K8s, projetos menores. Senior sabe a diferença entre PM2 e Docker/K8s, e quando cada um faz sentido.",
    gotchas: [
      "pm2 start app.js reinicia com a versão antiga se você não rodar pm2 reload após deploy. Use pm2 reload --update-env para garantir vars de ambiente atualizadas.",
      "PM2 cluster mode divide a porta entre workers via IPC — não funciona com WebSocket sticky session sem load balancer configurado corretamente.",
      "pm2 save + pm2 startup é necessário para sobreviver a reboot. Sem isso, server reinicia e a app não volta.",
      "Logs acumulam em ~/.pm2/logs sem rotação. Configure log_date_format e max_size no ecosystem.config.js ou use logrotate.",
    ],
    resources: [
      { title: "PM2 Documentation", url: "https://pm2.keymetrics.io/docs/", kind: "docs" },
    ],
  },

  "github": {
    tagline: "Plataforma Git de hospedagem e colaboração — hub central de código open-source e empresa.",
    why: "GitHub vai além do git remoto: Pull Requests como unidade de review, Issues para rastreamento, Actions para CI/CD, Packages para registry, Dependabot para segurança, Copilot para AI. Dominar o fluxo PR-review é obrigatório em qualquer time.",
    gotchas: [
      "PR sem description suficiente — revisor não tem contexto, review superficial. Descreva o problema, a solução e como testar.",
      "Merge sem squash em feature branch com 50 commits intermediários polui o histórico do main.",
      "GitHub Issues sem labels, milestone ou assignee se perdem — nunca resolvidos. Triage é disciplina, não optativa.",
      "Secrets em Settings > Actions são criptografados mas aparecem em logs se você fizer echo. Sempre mask secrets nos logs.",
    ],
    resources: [
      { title: "GitHub Docs", url: "https://docs.github.com/", kind: "docs" },
      { title: "GitHub Flow", url: "https://docs.github.com/en/get-started/quickstart/github-flow", kind: "docs" },
    ],
  },

  "gitlab": {
    tagline: "Plataforma DevSecOps completa — Git + CI/CD + registry + security em uma só ferramenta.",
    why: "GitLab domina em empresas que self-hospedam (on-prem, compliance). É a alternativa ao GitHub com CI/CD, container registry, security scanning e wikis integrados. Saber GitLab é diferencial em empresa enterprise.",
    gotchas: [
      "GitLab CE (Community) não tem SAML SSO — é uma armadilha ao comparar planos. Verifique features antes de propor self-hosted.",
      "Forking workflow no GitLab exige configuração de upstream remoto — diferente do GitHub que automatiza mais.",
      "Auto DevOps pode subir pipelines inesperados em repo novo. Desabilite se não está usando de propósito.",
      "Tokens pessoais têm escopo amplo por padrão — use deploy tokens ou project access tokens com escopo mínimo.",
    ],
    resources: [
      { title: "GitLab Documentation", url: "https://docs.gitlab.com/", kind: "docs" },
    ],
  },

  "azure-devops": {
    tagline: "Suite Microsoft de DevOps — Boards, Repos, Pipelines, Artifacts e Test Plans integrados.",
    why: "Azure DevOps é onipresente em empresas Microsoft/enterprise. Se o cliente usa Azure, provavelmente usa ADO para pipelines e boards. Vale entender o ecossistema mesmo que não seja a escolha pessoal.",
    gotchas: [
      "YAML pipelines vs Classic pipelines — Classic está sendo descontinuado. Todo projeto novo deve usar YAML (azure-pipelines.yml).",
      "Service Connections mal configurados com permissão ampla demais são vetor de risco. Use managed identity quando possível.",
      "Azure Boards tem hierarquia rígida (Epic > Feature > User Story > Task) — impor sem adaptação ao processo do time cria resistência.",
      "Artifacts feed deve ter upstream sources configurados senão pacotes públicos não são resolvidos.",
    ],
    resources: [
      { title: "Azure DevOps Documentation", url: "https://learn.microsoft.com/en-us/azure/devops/", kind: "docs" },
    ],
  },

  "gitflow": {
    tagline: "Modelo de branching com branches dedicadas por tipo — main, develop, feature, release, hotfix.",
    why: "GitFlow foi o padrão durante anos. Hoje a tendência é trunk-based development (branch curta + feature flags), mas GitFlow ainda aparece em contextos de release cíclico (mobile, firmware, enterprise). Vale entender pra saber quando aplicar e quando evitar.",
    gotchas: [
      "GitFlow cria conflitos massivos quando features vivem em branches longas — quanto mais tempo fora do main, mais difícil o merge.",
      "Para times com deploy contínuo, GitFlow é over-engineered. Trunk-based + feature flags entrega mais rápido com menos risco.",
      "Hotfix em GitFlow deve ser mergeado tanto no main quanto no develop — esquecer o develop vira bug que ressurge na próxima release.",
      "Muitos times 'usam GitFlow' mas na prática abandonam o develop branch — vira GitFlow parcial que confunde mais do que ajuda.",
    ],
    resources: [
      { title: "Gitflow Workflow (Atlassian)", url: "https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow", kind: "artigo" },
      { title: "A successful branching model (post original)", url: "https://nvie.com/posts/a-successful-git-branching-model/", kind: "artigo" },
    ],
  },

  "phpunit": {
    tagline: "Framework de testes unitários para PHP — padrão xUnit adaptado para o ecossistema PHP.",
    why: "PHPUnit é o test runner dominante em PHP/Laravel. Aparece em qualquer projeto PHP legado ou atual. Vale o mínimo para navegar em código PHP existente.",
    gotchas: [
      "setUp() e tearDown() rodam antes e depois de cada teste — não confundir com setUpBeforeClass() (uma vez por classe).",
      "Mocking via getMockBuilder é verboso comparado a frameworks modernos — Mockery é alternativa mais expressiva.",
      "Testes de integração lentos em PHPUnit sem isolamento de banco — use transactions com rollback (DatabaseTransactions no Laravel) para acelerar.",
    ],
    resources: [
      { title: "PHPUnit Documentation", url: "https://phpunit.de/documentation.html", kind: "docs" },
    ],
  },

  "pest": {
    tagline: "Test runner moderno para PHP com syntax elegante — alternativa expressiva ao PHPUnit.",
    why: "Pest (criado por Nuno Maduro) virou o padrão em projetos Laravel novos. Roda em cima do PHPUnit mas com syntax muito mais limpa — it(), expect(), dataset(). Vale preferir em projeto Laravel novo.",
    gotchas: [
      "Pest roda em cima do PHPUnit — se o projeto usa PHPUnit, Pest é zero custo de adoção. Mas misturar estilo nos dois é confuso.",
      "arch() helpers (Pest 2+) fazem validações de arquitetura (sem classes finais, sem uso de funções globais) — poderoso mas precisa ser calibrado para o projeto.",
      "Datasets em Pest são mais limpos que @dataProvider do PHPUnit mas a nomenclatura de test no output muda — ajuste CI se houver filtros por nome de teste.",
    ],
    resources: [
      { title: "Pest PHP Documentation", url: "https://pestphp.com/docs/", kind: "docs" },
    ],
  },

  "cypress": {
    tagline: "Framework E2E para browser — DX excelente, UI runner com time-travel debug.",
    why: "Cypress dominou E2E por anos com sua UI interativa e time-travel. Perdeu espaço para Playwright em 2024-2025 mas ainda está em milhares de repos. Vale saber navegar, entender limitações (só Chromium-based por padrão) e quando migrar.",
    gotchas: [
      "cy.wait(2000) é antipattern — use cy.intercept() + cy.wait('@alias') para esperar a requisição real.",
      "Cypress não suporta múltiplas abas nativamente — fluxos que abrem nova aba exigem workaround (cy.stub em window.open).",
      "Testes flaky por timing: cy.get() por padrão espera 4s, mas pode ser curto para app lenta. Ajuste defaultCommandTimeout globalmente.",
      "Cypress Component Testing e Cypress E2E são setups diferentes — não misturar cypress.config.ts sem separar as specs.",
    ],
    resources: [
      { title: "Cypress Documentation", url: "https://docs.cypress.io/", kind: "docs" },
      { title: "Cypress Best Practices", url: "https://docs.cypress.io/guides/references/best-practices", kind: "docs" },
    ],
  },

  "sonarqube": {
    tagline: "Plataforma de análise estática de qualidade de código — bugs, code smells, dívida técnica, cobertura.",
    why: "SonarQube é o padrão em empresa grande para gate de qualidade em CI. Bloqueia PR se quality gate falha. Senior precisa entender como integrar no pipeline, o que cada métrica significa, e como não deixar ruído de false-positive dominar.",
    gotchas: [
      "Quality gate muito restritivo no início paralisa time — comece com gate permissivo e aperte ao longo do tempo.",
      "Coverage no SonarQube é calculado a partir do relatório gerado pelo test runner (lcov, JaCoCo) — sem passar o relatório, coverage aparece como zero.",
      "False positives em regras de segurança (hotspot) precisam de review manual — marcar como 'won't fix' sem análise é negligência.",
      "SonarQube Community (gratuito) não tem análise de Pull Request — precisa da edição Developer ou usar SonarCloud.",
    ],
    resources: [
      { title: "SonarQube Documentation", url: "https://docs.sonarqube.org/", kind: "docs" },
      { title: "SonarCloud (SaaS gratuito para open-source)", url: "https://sonarcloud.io/", kind: "pratica" },
    ],
  },

  "nx": {
    tagline: "Build system avançado para monorepo — suporte multilíngue, plugins ricos, dep graph visual.",
    why: "Nx é a alternativa enterprise ao Turborepo — mais poderoso, mais complexo, melhor pra monorepo com múltiplos stacks (React + Node + Go + Java no mesmo repo). Saber a diferença com Turborepo é pergunta comum em entrevista de arquitetura.",
    gotchas: [
      "Nx tem curva de aprendizado bem mais alta que Turborepo — time sem experiência demora semanas pra produzir com fluência.",
      "Generators do Nx criam estrutura opinada — se você já tem estrutura diferente, conflito é certo na migração.",
      "nx affected só funciona corretamente se o nx.json e project.json estiverem bem configurados — misconfiguration silencioso faz testar tudo sempre.",
      "Cache remoto (Nx Cloud) é pago acima do free tier — avaliar antes de depender como core de CI.",
    ],
    resources: [
      { title: "Nx Documentation", url: "https://nx.dev/", kind: "docs" },
      { title: "Nx vs Turborepo comparison", url: "https://nx.dev/concepts/turbo-and-nx", kind: "artigo" },
    ],
  },

  "scrum": {
    tagline: "Framework ágil com sprints, cerimônias e papéis definidos — o processo mais adotado em times de produto.",
    why: "Scrum aparece em toda entrevista de processo e cultura. Não precisa virar Scrum Master, mas senior precisa saber explicar as cerimônias, os papéis (PO, SM, Dev Team), e principalmente quando Scrum é sobre-processo para o contexto.",
    gotchas: [
      "Sprint planning sem refinement prévio vira caos — estimativas sem contexto, stories mal definidas, sprint que falha.",
      "Daily Scrum como status meeting para o manager é antipattern — é sincronização entre devs, não relatório.",
      "Velocity não é produtividade — comparar velocity entre times ou usar para pressionar é sinal de mal uso do Scrum.",
      "Scrum sem Product Owner ativo vira 'Scrum' no nome mas waterfall na prática — backlog sem priorização real.",
    ],
    resources: [
      { title: "Scrum Guide (oficial)", url: "https://scrumguides.org/scrum-guide.html", kind: "docs" },
    ],
  },

  "kanban": {
    tagline: "Sistema de fluxo visual com WIP limits — mais simples que Scrum, foco em throughput e lead time.",
    why: "Kanban é melhor que Scrum para times de operação, suporte, DevOps e manutenção onde o trabalho chega de forma contínua e imprevisível. Combina bem com times maduros que não precisam do andaime estrutural do Scrum.",
    gotchas: [
      "Kanban sem WIP limit não é Kanban — é apenas um board. O limite de WIP é o mecanismo principal de melhoria de fluxo.",
      "Colunas demais no board criam ilusão de processo — 3 a 5 colunas são suficientes na maioria dos contextos.",
      "Lead time e cycle time são métricas diferentes — lead time inclui tempo de espera antes do início, cycle time começa quando o trabalho inicia de fato.",
      "Kanban não tem cerimônias obrigatórias mas precisa de cadência de revisão (replenishment meeting, retrospectiva de fluxo) para melhorar.",
    ],
    resources: [
      { title: "Kanban Guide (Scrum.org)", url: "https://www.scrum.org/resources/kanban-guide-scrum-teams", kind: "docs" },
    ],
  },

  "vs-code": {
    tagline: "Editor de código da Microsoft — extensível, leve, dominante em desenvolvimento web.",
    why: "VS Code é a ferramenta de trabalho diária. Dominar atalhos, extensões e configurações aumenta produtividade absurdamente. Saber configurar workspace settings, debug launch configs e tasks é diferencial.",
    gotchas: [
      "Instalar dezenas de extensões degrada performance — mantenha só as essenciais ativas por workspace.",
      "settings.json de usuário pode sobrescrever workspace settings de forma inesperada — separe config global de config de projeto.",
      "Usar o terminal integrado do VS Code sem entender que cada aba é um processo separado causa confusão de contexto (CWD diferente, variáveis de ambiente diferentes).",
      "Remote SSH / Dev Containers são funcionalidades subutilizadas que eliminam problemas de 'funciona na minha máquina'.",
    ],
    resources: [
      { title: "VS Code Documentation", url: "https://code.visualstudio.com/docs", kind: "docs" },
      { title: "VS Code Tips and Tricks", url: "https://code.visualstudio.com/docs/getstarted/tips-and-tricks", kind: "docs" },
    ],
  },

  "cursor": {
    tagline: "Editor com AI nativa (Claude/GPT) — fork do VS Code com chat, autocomplete e agent mode integrados.",
    why: "Cursor virou o editor preferido de quem usa AI no desenvolvimento. Diferencial sobre Copilot: contexto de codebase inteira no chat, agent mode que edita múltiplos arquivos, Apply rápido. Vale entender o modelo de uso (quando deixar o agent rodar, quando revisar cada passo).",
    gotchas: [
      "Agent mode pode apagar ou refatorar código em cadeia sem pedir confirmação se você não revisar os diffs — sempre revise antes de aceitar.",
      "Cursor envia código para API externa (Anthropic/OpenAI) — avaliar política de privacidade antes de usar em projetos com dados sensíveis ou NDA.",
      "Autocomplete agressivo pode sugerir código funcional mas com padrões ruins — não aceitar sem leitura, especialmente em segurança.",
      "Modelos mudam de versão silenciosamente — o que funcionava com Claude 3.5 pode se comportar diferente com Claude 4.x.",
    ],
    resources: [
      { title: "Cursor Documentation", url: "https://docs.cursor.com/", kind: "docs" },
    ],
  },

  "figma": {
    tagline: "Ferramenta de design colaborativo na web — padrão de fato para UI/UX de produto.",
    why: "Dev precisa ler Figma com fluência: inspecionar medidas, tokens de cor/tipografia, exportar assets, entender componentes e variants. Comunicação com design é gargalo quando o dev não sabe navegar no arquivo.",
    gotchas: [
      "Medidas no Figma são em pixels lógicos (densidade 1x) — exportar @2x ou @3x para assets em telas retina.",
      "Componentes com variants no Figma não necessariamente mapeiam 1:1 para componentes de código — traduza o conceito, não o nome.",
      "Auto layout no Figma é análogo ao Flexbox — entender os parâmetros (direction, spacing, padding, alignment) ajuda a implementar fielmente.",
      "Handoff via Dev Mode mostra CSS gerado mas pode sugerir posicionamento absoluto — não copie cegamente, adapte para o layout system do projeto.",
    ],
    resources: [
      { title: "Figma Help Center", url: "https://help.figma.com/", kind: "docs" },
      { title: "Figma for Developers (curso oficial)", url: "https://help.figma.com/hc/en-us/articles/14563756057239", kind: "curso" },
    ],
  },
}

export default data
