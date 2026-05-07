import type { SkillContent } from '@/types'

const kubernetes: SkillContent = {
  tagline: "Orquestrador de containers de fato — escala, self-healing, declarativo.",
  why: "K8s é o sistema operacional do cloud-native. Sênior precisa explicar conceitos (Pod, Deployment, Service, Ingress), debugar com kubectl, entender networking (CNI, DNS interno), segurança (RBAC, PSA, NetworkPolicy) e saber quando não usar (complexidade demais para equipes pequenas).",
  summary: "Kubernetes orquestra containers em cluster de nodes. Você declara o desired state em YAML e o control plane reconcilia até alcançar. Pod é a unidade mínima (1+ containers que compartilham rede/storage). Deployment gerencia ReplicaSet de pods stateless com rolling update. StatefulSet gerencia pods com identidade estável. Service dá IP/DNS estável para grupo de pods. Ingress expõe HTTP externo com roteamento. ConfigMap/Secret para configuração. RBAC para autorização. HPA para escala automática por métricas.",
  keypoints: [
    { title: "Pod, ReplicaSet, Deployment", body: "Pod = um ou mais containers juntos compartilhando rede e volumes. ReplicaSet mantém N réplicas de um Pod template. Deployment gerencia ReplicaSet com rollout/rollback declarativo — você edita o Deployment, nunca um Pod diretamente em produção." },
    { title: "Service e DNS interno", body: "Service ClusterIP dá IP virtual estável + DNS (<nome>.<namespace>.svc.cluster.local). NodePort expõe em porta do node (30000–32767). LoadBalancer aloca LB do cloud. ExternalName aliasa para DNS externo. Endpoints selecionados via label selector." },
    { title: "StatefulSet", body: "Para apps com identidade (DBs, Kafka, Zookeeper). Pods têm nome estável (db-0, db-1), volume PVC único por pod, ordem de start/stop garantida. DaemonSet roda um pod por node (agentes, log collectors, CNI). Job/CronJob para tarefas batch." },
    { title: "Probes (liveness, readiness, startup)", body: "liveness = mata pod se travar (deadlock, loop infinito). readiness = tira do Service até estar pronto (warmup, dep externa). startup = substitui liveness durante boot longo. Erro clássico: liveness checando DB externo — DB cai, K8s mata todos os pods." },
    { title: "Resource requests/limits", body: "Request = garantia (scheduler usa para alocar). Limit = teto (kernel mata se passar memória — OOMKilled, throttle se passar CPU). LimitRange define defaults por namespace. ResourceQuota limita total do namespace. Sem request, scheduling vira caos em horário de pico." },
    { title: "RBAC e ServiceAccount", body: "Cada pod tem ServiceAccount. Role/ClusterRole definem permissões na API do K8s. RoleBinding/ClusterRoleBinding associam role a SA/user/group. Princípio do menor privilégio — nunca cluster-admin em workload de aplicação." },
    { title: "Ingress e Gateway API", body: "Ingress expõe HTTP/HTTPS com regras de host/path para Services internos. Requer Ingress Controller (NGINX, Traefik, AWS ALB). Gateway API (successor) é mais expressiva e tem separação de responsabilidades (GatewayClass, Gateway, HTTPRoute)." },
    { title: "HPA, VPA e KEDA", body: "HPA escala Deployment horizontalmente por CPU/memória ou custom metrics (via Metrics Server). VPA ajusta requests/limits verticalmente. KEDA escala por eventos externos (fila SQS, consumer lag Kafka, etc.) — ideal para workloads event-driven." },
  ],
  gotchas: [
    "Sem resource request — scheduler chuta, pod cai por OOMKilled em horário de pico sem aviso claro.",
    "Liveness probe agressiva — mata pod sob carga normal, cria restart loop. Liveness deve detectar travamento, não lentidão.",
    "Tag latest em imagem — pod recria, cluster pega versão diferente silenciosamente. Pin por SHA ou semver fixo.",
    "Secret em base64 (que é codificação, não criptografia) — use Sealed Secrets, External Secrets Operator + Vault, ou criptografia at-rest no etcd.",
    "PVC sem reclaim policy correto — delete de PVC apaga dado se policy é Delete. Use Retain em DB crítico.",
    "Subir K8s 'porque é cool' em time pequeno — overhead operacional de etcd, upgrades, networking come a velocidade de entrega.",
    "Rolling update sem PodDisruptionBudget — zero-downtime pode não ser garantido se todos os pods reiniciarem juntos.",
  ],
  interview: [
    {
      q: "K8s vs Docker Compose — quando vale a complexidade?",
      a: "<p>Compose ganha em: dev local, single-host, time pequeno, poucos serviços. K8s começa a valer quando você tem multi-host (precisa de scheduler), auto-scaling horizontal, rolling update sem downtime, multi-tenant com isolamento, service mesh / canary / blue-green.</p><p>Para produto pequeno em 1 host, K8s é overkill. Em escala média (20+ serviços, vários times), K8s vira indispensável pelo modelo declarativo e ecossistema de operadores.</p>",
      level: "pleno",
      tip: "Cite que K8s tem curva de operação alto (etcd backup, upgrades, networking). Managed K8s (EKS/GKE/AKS) reduz isso mas não elimina.",
    },
    {
      q: "Liveness vs readiness vs startup probe — quando usar cada uma?",
      a: "<p><b>liveness</b>: 'está vivo?' Se falha, kubelet mata e recria o pod. Pra detectar deadlock, loop infinito. Endpoint simples que NÃO checa dependências externas.</p><p><b>readiness</b>: 'pode receber tráfego?' Se falha, pod sai dos endpoints do Service mas continua rodando. Para warmup (cache aquecendo), graceful shutdown, dep externa indisponível.</p><p><b>startup</b>: substitui liveness durante startup longo (app Java que demora 30s). Previne que liveness mate o pod antes de subir.</p><p>Erro clássico: liveness checando banco de dados. DB pisca, K8s mata todos os pods, downtime amplificado.</p>",
      level: "pleno",
      tip: "A resposta completa menciona os três. Muitos candidatos plenos só conhecem liveness e readiness.",
    },
    {
      q: "Como você debuga um pod em CrashLoopBackOff?",
      a: "<ul><li><code>kubectl describe pod &lt;name&gt;</code> — veja Events: ImagePullBackOff, OOMKilled, FailedScheduling</li><li><code>kubectl logs &lt;pod&gt; --previous</code> — log do container que crashou</li><li>Exit code 137 = OOMKilled (memória), 1 = exit de erro de aplicação, 0 = saiu normalmente (probe mal configurada)</li><li>Checar se requests/limits estão adequados</li><li>Probe: liveness matando antes de subir? Aumentar <code>initialDelaySeconds</code> ou usar startup probe</li><li>Image: tag correta? Registry acessível? Credencial válida (imagePullSecret)?</li></ul>",
      level: "pleno",
      tip: "Demonstrar a sequência sistemática (describe → logs --previous → exit code) impressiona mais que listar possibilidades aleatórias.",
    },
    {
      q: "O que é um Deployment e como o rolling update funciona internamente?",
      a: "<p>Deployment gerencia ReplicaSet. Ao alterar a imagem/config, K8s cria um novo ReplicaSet e escala ele up enquanto escala o antigo down, respeitando <code>maxSurge</code> e <code>maxUnavailable</code>.</p><p>Por padrão: maxSurge=25%, maxUnavailable=25%. Com 4 replicas, pode subir até 5 pods novos e ter no mínimo 3 rodando em qualquer momento.</p><p>Rollback: <code>kubectl rollout undo deployment/&lt;name&gt;</code> — reverte para o ReplicaSet anterior. Histórico controlado por <code>revisionHistoryLimit</code>.</p>",
      level: "pleno",
      tip: "Explique que o ReplicaSet antigo não é deletado imediatamente — K8s mantém histórico para rollback.",
    },
    {
      q: "Explique a diferença entre Deployment, StatefulSet e DaemonSet.",
      a: "<p><b>Deployment</b>: pods stateless e intercambiáveis. Nomes aleatórios (app-7d4f8c9b). Escala horizontal simples. Para APIs, workers sem estado.</p><p><b>StatefulSet</b>: pods com identidade estável. Nomes ordinais (db-0, db-1). Cada pod tem seu próprio PVC. Start em ordem (db-0 antes de db-1). Para bancos de dados, Kafka, Elasticsearch.</p><p><b>DaemonSet</b>: garante exatamente um pod por node (ou por subset de nodes via nodeSelector). Para agentes de log (Fluentd), monitoring (Prometheus node-exporter), CNI plugins.</p>",
      level: "senior",
      tip: "Pergunte: 'Como você escalaria um banco de dados primário/réplica no K8s?' — StatefulSet com headless service é a resposta.",
    },
    {
      q: "Como funciona o RBAC no Kubernetes?",
      a: "<p>RBAC controla quem pode fazer o quê na API do K8s. Quatro objetos:</p><ul><li><b>Role</b>: permissões em um namespace (get pods, list services)</li><li><b>ClusterRole</b>: permissões cluster-wide ou agregadas</li><li><b>RoleBinding</b>: associa Role a ServiceAccount/User/Group no namespace</li><li><b>ClusterRoleBinding</b>: associa ClusterRole globalmente</li></ul><p>Cada Pod usa um ServiceAccount. Best practice: criar SA específico por workload com Role mínimo. Nunca usar <code>default</code> SA com poderes extras ou cluster-admin em aplicação.</p>",
      level: "senior",
      tip: "Citar 'princípio do menor privilégio' e dar exemplo concreto (SA que só pode ler ConfigMaps do próprio namespace) demonstra maturidade.",
    },
    {
      q: "O que é ConfigMap vs Secret e como você os injeta num Pod?",
      a: "<p><b>ConfigMap</b>: dados de configuração não sensíveis (URLs, feature flags). <b>Secret</b>: dados sensíveis armazenados em base64 (não criptografado por padrão — criptografia at-rest requer configuração no etcd).</p><p>Formas de injetar:</p><ul><li>Variável de ambiente: <code>envFrom: configMapRef</code> ou <code>secretRef</code></li><li>Volume montado: arquivo no filesystem do container (melhor para certificados, arquivos grandes)</li><li>Via <code>env[].valueFrom.secretKeyRef</code>: valor individual</li></ul><p>Para produção: use External Secrets Operator ou Vault Agent Injector — o Secret no etcd é apenas referência, o valor vem do Vault.</p>",
      level: "pleno",
      tip: "Diferenciar base64 (encoding) de criptografia é sinal de maturidade. Mencionar External Secrets demonstra conhecimento produção.",
    },
    {
      q: "Como o HPA funciona e quais são suas limitações?",
      a: "<p>HPA (Horizontal Pod Autoscaler) monitora métricas via Metrics Server e ajusta o número de réplicas entre <code>minReplicas</code> e <code>maxReplicas</code>.</p><p>Funciona: CPU > 80% → K8s adiciona pods. CPU < 20% por N minutos → remove pods.</p><p>Limitações:</p><ul><li>Latência de escala: novos pods demoram 30–90s para ficar ready (pull image, warmup)</li><li>Scale-to-zero: HPA não vai a zero por padrão (KEDA sim)</li><li>Métricas custom requerem Prometheus Adapter ou configuração extra</li><li>Não funciona bem com StatefulSet em DBs (escala não é simples)</li></ul>",
      level: "senior",
      tip: "Citar KEDA para workloads event-driven (scale by Kafka lag) diferencia candidato sênior de pleno.",
    },
    {
      q: "Explique PersistentVolume, PersistentVolumeClaim e StorageClass.",
      a: "<p><b>PersistentVolume (PV)</b>: recurso de storage provisionado no cluster (pode ser manual ou dinâmico). Tem capacidade, access mode, reclaim policy.</p><p><b>PersistentVolumeClaim (PVC)</b>: pedido de storage feito pelo Pod. K8s faz binding com PV compatível.</p><p><b>StorageClass</b>: define o provisionador (AWS EBS, GCP PD, NFS). PVC referencia a StorageClass → volume é provisionado dinamicamente.</p><p><b>Access Modes</b>: ReadWriteOnce (1 node), ReadOnlyMany (vários nodes, read), ReadWriteMany (vários nodes, write — NFS/EFS).</p><p><b>Reclaim Policy</b>: Retain (dado fica), Delete (dado some), Recycle (deprecated).</p>",
      level: "senior",
      tip: "Erro comum em entrevista: confundir PV com PVC. PV é o recurso real. PVC é o pedido. StorageClass automatiza a criação do PV.",
    },
    {
      q: "O que é um Namespace e para que serve?",
      a: "<p>Namespace é uma partição virtual do cluster. Recursos (Pods, Services, ConfigMaps) são namespaced. Nodes, PersistentVolumes e ClusterRoles são cluster-scoped.</p><p>Usos comuns: separar ambientes (dev/staging/prod no mesmo cluster), separar times (team-a/team-b), separar tenants com ResourceQuota e LimitRange por namespace.</p><p>DNS interno: <code>svc-name.namespace.svc.cluster.local</code>. Dentro do mesmo namespace, basta <code>svc-name</code>.</p><p>NetworkPolicy pode limitar comunicação entre namespaces — por padrão, todos se comunicam livremente.</p>",
      level: "pleno",
      tip: "Lembrar que alguns recursos são cluster-scoped (Nodes, CRDs, ClusterRole) demonstra profundidade.",
    },
    {
      q: "Como você implementa zero-downtime deployment no Kubernetes?",
      a: "<p>Estratégia de rolling update com configurações corretas:</p><ul><li><code>maxUnavailable: 0</code> garante que nenhum pod sai antes de novo estar ready</li><li>Readiness probe correta — pod só entra no Service quando realmente pronto</li><li><code>PodDisruptionBudget</code> — garante mínimo de pods disponíveis durante node drain/upgrade</li><li>Graceful shutdown: <code>terminationGracePeriodSeconds</code> suficiente para o app fechar conexões</li><li>PreStop hook: <code>sleep 5</code> antes de SIGTERM para dar tempo ao kube-proxy remover o endpoint</li></ul><p>Sem readiness probe correta, rolling update pode rotear tráfego para pod que ainda não subiu.</p>",
      level: "senior",
      tip: "O detalhe do PreStop hook + sleep impressiona: sem ele, kube-proxy pode ainda estar roteando para o pod quando ele recebe SIGTERM.",
    },
    {
      q: "O que é Ingress e como ele difere de um Service LoadBalancer?",
      a: "<p><b>Service LoadBalancer</b>: aloca um IP de load balancer no cloud para cada Service. Caro (1 LB por serviço) e sem roteamento HTTP.</p><p><b>Ingress</b>: único ponto de entrada HTTP/HTTPS com regras de roteamento por host e path. Um Ingress Controller (NGINX, Traefik, AWS ALB Ingress) implementa as regras. Muito mais econômico — 1 LB para muitos serviços.</p><p>Ingress permite TLS termination, redirecionamento, auth, rate limiting (dependendo do controller). Para UDP/TCP genérico, Ingress não serve — use Service NodePort ou LoadBalancer.</p>",
      level: "pleno",
      tip: "Mencionar que Ingress precisa de um Ingress Controller instalado — não é nativo ao K8s. Muitos candidatos esquecem isso.",
    },
    {
      q: "O que é NetworkPolicy e por que é importante?",
      a: "<p>Por padrão, todos os pods no K8s se comunicam livremente entre namespaces. NetworkPolicy define regras de rede (ingress/egress) com base em labels de pod e namespace.</p><p>Exemplo: database pod só aceita conexão de pods com label <code>app: backend</code> no namespace <code>production</code>. Outros pods que tentem conectar são bloqueados.</p><p>Importante: NetworkPolicy requer um CNI que suporte (Calico, Cilium, Weave). Flannel puro não implementa NetworkPolicy.</p><p>Zero-trust: comece negando tudo e abra apenas o necessário — princípio de menor privilégio na rede.</p>",
      level: "senior",
      tip: "Saber que o CNI precisa suportar NetworkPolicy é frequentemente esquecido — é um gotcha real de produção.",
    },
    {
      q: "Como o Kubernetes faz scheduling de um Pod?",
      a: "<p>O scheduler filtra nodes elegíveis e pontua para encontrar o melhor. Etapas:</p><ol><li><b>Filter</b>: nodes com recursos suficientes (requests), taints tolerados, nodeSelector/affinity respeitados, ports disponíveis</li><li><b>Score</b>: pontua nodes por recursos disponíveis (Least Allocated), preferências de affinity, spread topology</li><li><b>Bind</b>: scheduler atribui o Pod ao node vencedor</li></ol><p>Pod fica em <code>Pending</code> se nenhum node passa o filtro (sem CPU/mem, taint sem toleration, etc.). <code>kubectl describe pod</code> mostra o motivo no campo Events.</p>",
      level: "senior",
      tip: "Mencionar Pending + kubectl describe é prático. Citar pod affinity/anti-affinity para HA (não colocar réplicas no mesmo node) demonstra senioridade.",
    },
    {
      q: "O que são taints e tolerations?",
      a: "<p><b>Taint</b>: marca um node para repelir pods sem a toleration correspondente. Exemplo: nodes GPU têm taint <code>gpu=true:NoSchedule</code> — apenas pods que declaram tolerar esse taint são agendados lá.</p><p><b>Toleration</b>: declaração no Pod que permite ser agendado em node com taint específico.</p><p>Efeitos de taint: <code>NoSchedule</code> (não agenda novos), <code>PreferNoSchedule</code> (evita mas pode), <code>NoExecute</code> (evita E expulsa pods existentes).</p><p>Uso comum: reservar nodes dedicados (GPU, spot), isolar nodes de sistema (<code>node-role.kubernetes.io/master</code>), drenar node graciosamente.</p>",
      level: "senior",
      tip: "Diferenciar os três efeitos de taint é o que separa quem memorizou de quem usa no dia a dia.",
    },
    {
      q: "Como você faz backup e disaster recovery em Kubernetes?",
      a: "<p>Estratégia em camadas:</p><ul><li><b>etcd backup</b>: etcd é o banco de dados do cluster. Backup regular com <code>etcdctl snapshot save</code>. Sem backup do etcd, não há recovery de estado do cluster.</li><li><b>Velero</b>: backup de objetos K8s (YAMLs) e volumes persistentes. Suporta S3 como destino.</li><li><b>GitOps (ArgoCD/Flux)</b>: toda configuração do cluster está em Git. Cluster pode ser recriado do zero a partir do repositório.</li><li><b>Storage backup</b>: PVs críticos (DBs) com snapshots do volume (EBS Snapshot, GCP PD Snapshot).</li></ul><p>GitOps é a abordagem mais robusta para config — mas não cobre dados das PVCs.</p>",
      level: "senior",
      tip: "Separar backup de configuração (etcd/GitOps) de backup de dados (Velero/storage snapshots) demonstra clareza conceitual.",
    },
    {
      q: "O que é Helm e quando usá-lo?",
      a: "<p>Helm é o package manager do K8s. Um Chart é um conjunto de templates YAML parametrizados. <code>values.yaml</code> define os defaults que o usuário pode sobrescrever.</p><p>Vantagens: reutilização de manifests, versionamento de release, rollback (<code>helm rollback</code>), ecossistema de charts prontos (PostgreSQL, Prometheus, etc.).</p><p>Limitações: templates com Go template viram ilegíveis com muita lógica. Alternativas: Kustomize (sem template, apenas patches/overlays), CUE, Jsonnet.</p><p>Quando usar: para aplicações com múltiplos ambientes (dev/staging/prod) com valores diferentes, ou para distribuir software K8s.</p>",
      level: "pleno",
      tip: "Citar Kustomize como alternativa mais simples para overlays de ambiente demonstra que você conhece o ecossistema além do Helm.",
    },
    {
      q: "Como funciona o etcd e qual é seu papel no Kubernetes?",
      a: "<p>etcd é um banco de dados distribuído chave-valor baseado em Raft consensus. É o único componente stateful do control plane do K8s.</p><p>Armazena todo o estado do cluster: definições de Pod, Services, Secrets, ConfigMaps, status de nodes, etc. Todo acesso via kube-apiserver — nenhum componente acessa etcd diretamente.</p><p>Consistência: Raft garante que maioria dos membros concorde antes de commit (quorum). Para HA, etcd em número ímpar de membros (3 ou 5).</p><p>Impacto: etcd lento = API server lenta = todo o cluster lento. Monitorar latência de disk I/O e latência de operações etcd é crítico.</p>",
      level: "senior",
      tip: "Saber que kube-apiserver é o único cliente do etcd (outros componentes leem via apiserver) é detalhe que demonstra conhecimento do control plane.",
    },
    {
      q: "O que é um Operator no Kubernetes?",
      a: "<p>Operator é o padrão de extensão do K8s para automatizar operações de aplicações stateful. Usa CRD (Custom Resource Definition) para definir novos tipos de recurso e um controller que reconcilia o estado desejado.</p><p>Exemplo: PostgreSQL Operator. Você cria um objeto <code>PostgresCluster</code> com spec de réplicas, versão, backup schedule. O Operator gerencia: criação do StatefulSet, configuração de replicação, failover automático, backups periódicos.</p><p>É 'SRE codificado'. Operações que um DBA faria manualmente viram código declarativo. Exemplos reais: Prometheus Operator, Strimzi (Kafka), Cert-Manager, Vault Operator.</p>",
      level: "senior",
      tip: "A analogia 'Operator = SRE codificado' é memorável e demonstra entendimento do padrão, não só da mecânica.",
    },
    {
      q: "Como você monitora um cluster Kubernetes em produção?",
      a: "<p>Stack padrão: Prometheus + Grafana + Alertmanager.</p><ul><li><b>kube-state-metrics</b>: expõe métricas de objetos K8s (pod restarts, deployment desired vs available, PVC status)</li><li><b>node-exporter</b>: métricas de node (CPU, memória, disco, rede)</li><li><b>Metrics Server</b>: métricas in-memory para HPA e kubectl top</li><li><b>Alertas críticos</b>: pod restart loop (CrashLoopBackOff), node NotReady, PVC bound, deployment unavailable, etcd latência alta</li><li><b>Logs</b>: Loki ou ELK stack. Centralizar logs de todos os pods.</li><li><b>Tracing</b>: Jaeger ou Tempo para rastrear requests entre microserviços.</li></ul>",
      level: "senior",
      tip: "Separar as três camadas — métricas, logs, traces (observability pillars) — e nomear as ferramentas concretas é o esperado de um sênior.",
    },
    {
      q: "O que é um PodDisruptionBudget e quando é necessário?",
      a: "<p>PodDisruptionBudget (PDB) define quantos pods de um deployment podem ficar indisponíveis simultaneamente durante perturbações voluntárias (node drain, cluster upgrade, scale down).</p><p>Configuração: <code>minAvailable: 2</code> (sempre 2 pods disponíveis) ou <code>maxUnavailable: 1</code> (no máximo 1 pod fora por vez).</p><p>Sem PDB: durante um <code>kubectl drain node</code>, K8s pode evictar todos os pods de uma vez → downtime.</p><p>Quando usar: qualquer workload stateless com SLA. Obrigatório antes de habilitar auto-upgrades de nodes.</p>",
      level: "senior",
      tip: "Perguntar 'o que acontece sem PDB durante um cluster upgrade?' revela se o candidato entende o impacto operacional real.",
    },
    {
      q: "Quais são as diferenças entre os tipos de Service: ClusterIP, NodePort e LoadBalancer?",
      a: "<p><b>ClusterIP</b> (padrão): IP virtual acessível apenas dentro do cluster. Para comunicação interna entre serviços. DNS: <code>&lt;name&gt;.&lt;ns&gt;.svc.cluster.local</code>.</p><p><b>NodePort</b>: expõe em uma porta de cada node (30000–32767). Acessível externamente via <code>NodeIP:NodePort</code>. Útil para desenvolvimento, não recomendado para produção direta (sem TLS, sem load balancing avançado).</p><p><b>LoadBalancer</b>: provisiona load balancer no cloud (AWS ELB, GCP LB). Ideal para exposição externa em produção. Caro se usado para muitos serviços — prefira Ingress.</p><p><b>Headless</b> (<code>clusterIP: None</code>): sem IP virtual, DNS retorna IPs dos pods diretamente. Usado com StatefulSet para descoberta de peers.</p>",
      level: "pleno",
      tip: "O tipo Headless Service é frequentemente esquecido mas é essencial para StatefulSets entenderem quem são seus peers.",
    },
  ],
  diagrams: [
    {
      title: "Arquitetura do Cluster Kubernetes",
      caption: "Control plane (etcd, API Server, Scheduler, Controller Manager) + Worker Nodes (kubelet, kube-proxy, pods)",
      html: `<style>
.k8s-arch { font-family: 'Space Grotesk', sans-serif; color: #e2e8f0; padding: 16px; background: #0f172a; border-radius: 12px; }
.k8s-arch-title { font-size: 13px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 12px; }
.k8s-plane { display: flex; gap: 12px; margin-bottom: 12px; }
.k8s-cp { background: #1e293b; border: 1px solid #ef4444; border-radius: 10px; padding: 12px; flex: 1; }
.k8s-cp-label { font-size: 11px; font-weight: 700; color: #ef4444; text-transform: uppercase; margin-bottom: 8px; }
.k8s-box { background: #0f172a; border: 1px solid #334155; border-radius: 6px; padding: 6px 10px; margin-bottom: 6px; font-size: 12px; }
.k8s-box b { color: #f8fafc; }
.k8s-box span { color: #64748b; font-size: 11px; display: block; }
.k8s-nodes { display: flex; gap: 10px; }
.k8s-node { background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 12px; flex: 1; }
.k8s-node-label { font-size: 11px; font-weight: 700; color: #38bdf8; text-transform: uppercase; margin-bottom: 8px; }
.k8s-pod { background: #0f172a; border: 1px solid #10b981; border-radius: 6px; padding: 5px 8px; margin-bottom: 5px; font-size: 11px; color: #10b981; }
.k8s-arrow { text-align: center; color: #64748b; font-size: 18px; margin: 4px 0; }
</style>
<div class="k8s-arch">
  <div class="k8s-arch-title">Arquitetura do Cluster Kubernetes</div>
  <div class="k8s-plane">
    <div class="k8s-cp">
      <div class="k8s-cp-label">Control Plane</div>
      <div class="k8s-box"><b>kube-apiserver</b><span>Ponto de entrada REST. Valida e persiste no etcd.</span></div>
      <div class="k8s-box"><b>etcd</b><span>BD distribuído. Estado completo do cluster.</span></div>
      <div class="k8s-box"><b>kube-scheduler</b><span>Escolhe o node para cada Pod pendente.</span></div>
      <div class="k8s-box"><b>controller-manager</b><span>Loops de reconciliação (Deployment, Node, etc).</span></div>
    </div>
  </div>
  <div class="k8s-arrow">↕ API calls via kubeconfig / ServiceAccount</div>
  <div class="k8s-nodes">
    <div class="k8s-node">
      <div class="k8s-node-label">Worker Node 1</div>
      <div class="k8s-box"><b>kubelet</b><span>Garante pods do node rodando.</span></div>
      <div class="k8s-box"><b>kube-proxy</b><span>Regras iptables para Services.</span></div>
      <div class="k8s-pod">Pod: api-7d4f (2 containers)</div>
      <div class="k8s-pod">Pod: worker-3c9a</div>
    </div>
    <div class="k8s-node">
      <div class="k8s-node-label">Worker Node 2</div>
      <div class="k8s-box"><b>kubelet</b><span>Garante pods do node rodando.</span></div>
      <div class="k8s-box"><b>kube-proxy</b><span>Regras iptables para Services.</span></div>
      <div class="k8s-pod">Pod: api-8b2e (2 containers)</div>
      <div class="k8s-pod">Pod: cache-1f5d</div>
    </div>
  </div>
</div>`,
    },
    {
      title: "Pod Lifecycle e Probes",
      caption: "Estados do pod, ciclo de vida dos containers e quando cada probe atua",
      html: `<style>
.k8s-lc { font-family: 'Space Grotesk', sans-serif; color: #e2e8f0; padding: 16px; background: #0f172a; border-radius: 12px; }
.k8s-lc-states { display: flex; align-items: center; gap: 6px; margin-bottom: 16px; flex-wrap: wrap; }
.k8s-state { padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; }
.k8s-st-pending { background: #1e293b; border: 1px solid #f59e0b; color: #f59e0b; }
.k8s-st-init { background: #1e293b; border: 1px solid #8b5cf6; color: #8b5cf6; }
.k8s-st-running { background: #1e293b; border: 1px solid #10b981; color: #10b981; }
.k8s-st-term { background: #1e293b; border: 1px solid #ef4444; color: #ef4444; }
.k8s-arrow-sm { color: #64748b; font-size: 14px; }
.k8s-probes { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.k8s-probe { background: #1e293b; border-radius: 8px; padding: 10px; border: 1px solid #334155; }
.k8s-probe-name { font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 6px; }
.k8s-probe-live { color: #ef4444; }
.k8s-probe-ready { color: #10b981; }
.k8s-probe-start { color: #f59e0b; }
.k8s-probe-desc { font-size: 11px; color: #94a3b8; line-height: 1.4; }
.k8s-probe-action { font-size: 11px; color: #f8fafc; margin-top: 4px; font-weight: 600; }
</style>
<div class="k8s-lc">
  <div style="font-size:13px;font-weight:700;color:#94a3b8;text-transform:uppercase;margin-bottom:12px;">Pod Lifecycle</div>
  <div class="k8s-lc-states">
    <div class="k8s-state k8s-st-pending">Pending</div>
    <div class="k8s-arrow-sm">→</div>
    <div class="k8s-state k8s-st-init">Init Containers</div>
    <div class="k8s-arrow-sm">→</div>
    <div class="k8s-state k8s-st-running">Running</div>
    <div class="k8s-arrow-sm">→</div>
    <div class="k8s-state k8s-st-term">Terminating</div>
  </div>
  <div style="font-size:13px;font-weight:700;color:#94a3b8;text-transform:uppercase;margin-bottom:10px;">Probes</div>
  <div class="k8s-probes">
    <div class="k8s-probe">
      <div class="k8s-probe-name k8s-probe-start">Startup Probe</div>
      <div class="k8s-probe-desc">Ativa durante boot. Substitui liveness no início. Para apps lentos (JVM, warmup).</div>
      <div class="k8s-probe-action">Falha → Reinicia container</div>
    </div>
    <div class="k8s-probe">
      <div class="k8s-probe-name k8s-probe-ready">Readiness Probe</div>
      <div class="k8s-probe-desc">Pod ready = entra nos endpoints do Service. Falha = sai do Service, continua rodando.</div>
      <div class="k8s-probe-action">Falha → Remove do Service</div>
    </div>
    <div class="k8s-probe">
      <div class="k8s-probe-name k8s-probe-live">Liveness Probe</div>
      <div class="k8s-probe-desc">Pod vivo? Detecta deadlock, travamento. NÃO checar deps externas aqui.</div>
      <div class="k8s-probe-action">Falha → Reinicia container</div>
    </div>
  </div>
</div>`,
    },
    {
      title: "Services e Ingress — Tráfego de Rede",
      caption: "Como o tráfego flui do mundo externo até o Pod, passando por LoadBalancer, Ingress e Service",
      html: `<style>
.k8s-net { font-family: 'Space Grotesk', sans-serif; color: #e2e8f0; padding: 16px; background: #0f172a; border-radius: 12px; }
.k8s-net-row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.k8s-net-box { padding: 8px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; white-space: nowrap; }
.k8s-net-ext { background: #1e293b; border: 1px solid #f59e0b; color: #f59e0b; }
.k8s-net-lb { background: #1e293b; border: 1px solid #8b5cf6; color: #8b5cf6; }
.k8s-net-ing { background: #1e293b; border: 1px solid #38bdf8; color: #38bdf8; }
.k8s-net-svc { background: #1e293b; border: 1px solid #10b981; color: #10b981; }
.k8s-net-pod { background: #0f172a; border: 1px solid #10b981; color: #10b981; border-radius: 6px; padding: 5px 10px; font-size: 11px; }
.k8s-net-arr { color: #64748b; font-size: 16px; }
.k8s-net-label { font-size: 11px; color: #64748b; flex: 1; }
.k8s-svc-types { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 12px; }
.k8s-svc-type { background: #1e293b; border-radius: 8px; padding: 8px; border: 1px solid #334155; text-align: center; }
.k8s-svc-type-name { font-size: 11px; font-weight: 700; color: #f8fafc; }
.k8s-svc-type-desc { font-size: 10px; color: #94a3b8; margin-top: 4px; }
</style>
<div class="k8s-net">
  <div style="font-size:13px;font-weight:700;color:#94a3b8;text-transform:uppercase;margin-bottom:12px;">Fluxo de Tráfego Externo</div>
  <div class="k8s-net-row">
    <div class="k8s-net-box k8s-net-ext">Internet (user)</div>
    <div class="k8s-net-arr">→</div>
    <div class="k8s-net-box k8s-net-lb">LoadBalancer / NodePort</div>
    <div class="k8s-net-arr">→</div>
    <div class="k8s-net-box k8s-net-ing">Ingress Controller (NGINX)</div>
  </div>
  <div class="k8s-net-row" style="margin-left:40px;">
    <div class="k8s-net-arr">↓ roteamento por host/path</div>
  </div>
  <div class="k8s-net-row">
    <div class="k8s-net-box k8s-net-svc">Service: api (ClusterIP)</div>
    <div class="k8s-net-arr">→</div>
    <div class="k8s-net-pod">Pod api-1</div>
    <div class="k8s-net-arr">/</div>
    <div class="k8s-net-pod">Pod api-2</div>
    <div class="k8s-net-arr">/</div>
    <div class="k8s-net-pod">Pod api-3</div>
  </div>
  <div style="font-size:12px;font-weight:700;color:#94a3b8;text-transform:uppercase;margin-top:14px;margin-bottom:8px;">Tipos de Service</div>
  <div class="k8s-svc-types">
    <div class="k8s-svc-type">
      <div class="k8s-svc-type-name">ClusterIP</div>
      <div class="k8s-svc-type-desc">Interno ao cluster. DNS estável.</div>
    </div>
    <div class="k8s-svc-type">
      <div class="k8s-svc-type-name">NodePort</div>
      <div class="k8s-svc-type-desc">Porta em cada node. Externo simples.</div>
    </div>
    <div class="k8s-svc-type">
      <div class="k8s-svc-type-name">LoadBalancer</div>
      <div class="k8s-svc-type-desc">LB do cloud. 1 IP externo.</div>
    </div>
    <div class="k8s-svc-type">
      <div class="k8s-svc-type-name">Headless</div>
      <div class="k8s-svc-type-desc">DNS retorna IPs dos pods. StatefulSet.</div>
    </div>
  </div>
</div>`,
    },
  ],
  mnemonics: [
    {
      label: "L-R-S Probes",
      trick: "Liveness=Loop, Readiness=Route, Startup=Slow",
      explanation: "Liveness detecta loop/travamento e reinicia. Readiness controla roteamento de tráfego (entra ou sai do Service). Startup é para apps lentos (substitui liveness no boot).",
    },
    {
      label: "Requests vs Limits",
      trick: "Request = Reserva, Limit = Lei",
      explanation: "Request é o que o scheduler reserva no node (garantia mínima). Limit é a lei do kernel: passar da memória = OOMKilled, passar do CPU = throttle. Sem request, sem garantia.",
    },
    {
      label: "Deploy-State-Daemon",
      trick: "Stateless → Deployment, Stateful → StatefulSet, Sistema → DaemonSet",
      explanation: "APIs e workers sem estado usam Deployment. Bancos de dados e Kafka usam StatefulSet (identidade + volume próprio). Agentes por node (log, monitoring) usam DaemonSet.",
    },
    {
      label: "RBAC: Role Role Bind",
      trick: "Role define o QUÊ, Binding define o QUEM",
      explanation: "Role/ClusterRole define as permissões (verbs sobre recursos). RoleBinding/ClusterRoleBinding associa essas permissões a um sujeito (ServiceAccount, User, Group). Sempre separe os dois conceitos.",
    },
  ],
  cheatsheet: {
    title: "kubectl — Cheatsheet de Sobrevivência",
    caption: "Comandos essenciais organizados por categoria",
    html: `<style>
.k8s-cs { font-family: 'JetBrains Mono', monospace; background: #0f172a; border-radius: 12px; padding: 16px; color: #e2e8f0; }
.k8s-cs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.k8s-cs-section { background: #1e293b; border-radius: 8px; padding: 12px; border: 1px solid #334155; }
.k8s-cs-title { font-size: 11px; font-weight: 700; color: #ef4444; text-transform: uppercase; margin-bottom: 8px; letter-spacing: .08em; font-family: 'Space Grotesk', sans-serif; }
.k8s-cs-cmd { font-size: 11px; color: #10b981; margin-bottom: 4px; }
.k8s-cs-comment { color: #64748b; font-size: 10px; }
</style>
<div class="k8s-cs">
  <div style="font-size:13px;font-weight:700;font-family:'Space Grotesk',sans-serif;color:#f8fafc;margin-bottom:12px;">kubectl Cheatsheet</div>
  <div class="k8s-cs-grid">
    <div class="k8s-cs-section">
      <div class="k8s-cs-title">Debug</div>
      <div class="k8s-cs-cmd">kubectl describe pod &lt;name&gt; <span class="k8s-cs-comment"># eventos</span></div>
      <div class="k8s-cs-cmd">kubectl logs &lt;pod&gt; -f <span class="k8s-cs-comment"># follow</span></div>
      <div class="k8s-cs-cmd">kubectl logs &lt;pod&gt; --previous <span class="k8s-cs-comment"># crash</span></div>
      <div class="k8s-cs-cmd">kubectl exec -it &lt;pod&gt; -- sh</div>
      <div class="k8s-cs-cmd">kubectl top pod <span class="k8s-cs-comment"># CPU/mem atual</span></div>
    </div>
    <div class="k8s-cs-section">
      <div class="k8s-cs-title">Aplicar / Deletar</div>
      <div class="k8s-cs-cmd">kubectl apply -f manifest.yaml</div>
      <div class="k8s-cs-cmd">kubectl delete -f manifest.yaml</div>
      <div class="k8s-cs-cmd">kubectl delete pod &lt;name&gt; --force</div>
      <div class="k8s-cs-cmd">kubectl scale deploy/api --replicas=5</div>
      <div class="k8s-cs-cmd">kubectl rollout undo deploy/api</div>
    </div>
    <div class="k8s-cs-section">
      <div class="k8s-cs-title">Inspecionar</div>
      <div class="k8s-cs-cmd">kubectl get pods -A <span class="k8s-cs-comment"># todos ns</span></div>
      <div class="k8s-cs-cmd">kubectl get events --sort-by=.lastTimestamp</div>
      <div class="k8s-cs-cmd">kubectl get pod &lt;n&gt; -o yaml <span class="k8s-cs-comment"># full spec</span></div>
      <div class="k8s-cs-cmd">kubectl get nodes -o wide</div>
      <div class="k8s-cs-cmd">kubectl config get-contexts</div>
    </div>
    <div class="k8s-cs-section">
      <div class="k8s-cs-title">Port-forward / Proxy</div>
      <div class="k8s-cs-cmd">kubectl port-forward svc/api 8080:80</div>
      <div class="k8s-cs-cmd">kubectl port-forward pod/db-0 5432:5432</div>
      <div class="k8s-cs-cmd">kubectl proxy <span class="k8s-cs-comment"># dashboard local</span></div>
      <div class="k8s-cs-cmd">kubectl drain &lt;node&gt; --ignore-daemonsets</div>
    </div>
  </div>
</div>`,
  },
  mindmap: {
    title: "Mapa Mental — Kubernetes",
    html: `<style>
.k8s-mm { font-family: 'Space Grotesk', sans-serif; background: #0f172a; border-radius: 12px; padding: 20px; color: #e2e8f0; }
.k8s-mm-center { text-align: center; background: #ef4444; color: white; padding: 10px 20px; border-radius: 30px; font-weight: 800; font-size: 16px; display: inline-block; margin: 0 auto; }
.k8s-mm-wrap { display: flex; justify-content: center; margin-bottom: 16px; }
.k8s-mm-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.k8s-mm-node { background: #1e293b; border-radius: 10px; padding: 10px 12px; border: 1px solid #334155; }
.k8s-mm-node-title { font-size: 12px; font-weight: 700; margin-bottom: 6px; }
.k8s-mm-item { font-size: 11px; color: #94a3b8; margin-bottom: 2px; padding-left: 8px; position: relative; }
.k8s-mm-item::before { content: "·"; position: absolute; left: 0; color: #ef4444; }
.k8s-cp-c { color: #ef4444; }
.k8s-wk-c { color: #38bdf8; }
.k8s-wl-c { color: #10b981; }
.k8s-net-c { color: #f59e0b; }
.k8s-sec-c { color: #8b5cf6; }
.k8s-cfg-c { color: #06b6d4; }
</style>
<div class="k8s-mm">
  <div class="k8s-mm-wrap"><div class="k8s-mm-center">Kubernetes</div></div>
  <div class="k8s-mm-grid">
    <div class="k8s-mm-node">
      <div class="k8s-mm-node-title k8s-cp-c">Control Plane</div>
      <div class="k8s-mm-item">kube-apiserver</div>
      <div class="k8s-mm-item">etcd (estado)</div>
      <div class="k8s-mm-item">scheduler</div>
      <div class="k8s-mm-item">controller-manager</div>
    </div>
    <div class="k8s-mm-node">
      <div class="k8s-mm-node-title k8s-wk-c">Worker Node</div>
      <div class="k8s-mm-item">kubelet</div>
      <div class="k8s-mm-item">kube-proxy</div>
      <div class="k8s-mm-item">Container Runtime</div>
      <div class="k8s-mm-item">CNI plugin</div>
    </div>
    <div class="k8s-mm-node">
      <div class="k8s-mm-node-title k8s-wl-c">Workloads</div>
      <div class="k8s-mm-item">Deployment (stateless)</div>
      <div class="k8s-mm-item">StatefulSet (stateful)</div>
      <div class="k8s-mm-item">DaemonSet (por node)</div>
      <div class="k8s-mm-item">Job / CronJob</div>
    </div>
    <div class="k8s-mm-node">
      <div class="k8s-mm-node-title k8s-net-c">Networking</div>
      <div class="k8s-mm-item">Service (ClusterIP/NP/LB)</div>
      <div class="k8s-mm-item">Ingress + Controller</div>
      <div class="k8s-mm-item">NetworkPolicy</div>
      <div class="k8s-mm-item">DNS interno</div>
    </div>
    <div class="k8s-mm-node">
      <div class="k8s-mm-node-title k8s-sec-c">Segurança</div>
      <div class="k8s-mm-item">RBAC (Role + Binding)</div>
      <div class="k8s-mm-item">ServiceAccount</div>
      <div class="k8s-mm-item">Secret (+ External)</div>
      <div class="k8s-mm-item">PodSecurity Standards</div>
    </div>
    <div class="k8s-mm-node">
      <div class="k8s-mm-node-title k8s-cfg-c">Config / Storage</div>
      <div class="k8s-mm-item">ConfigMap / Secret</div>
      <div class="k8s-mm-item">PVC / PV / StorageClass</div>
      <div class="k8s-mm-item">HPA / VPA / KEDA</div>
      <div class="k8s-mm-item">Helm / Kustomize</div>
    </div>
  </div>
</div>`,
  },
  exercises: [
    {
      level: "iniciante",
      title: "Deploy de aplicação stateless com 3 réplicas",
      description: "Crie um Deployment para uma aplicação web (nginx:1.25) com 3 réplicas. Configure resource requests (CPU: 100m, memória: 128Mi) e limits (CPU: 250m, memória: 256Mi). Exponha via Service ClusterIP na porta 80. Verifique com kubectl get pods e kubectl describe service.",
      concepts: ["Deployment", "ReplicaSet", "Service ClusterIP", "resource requests/limits"],
    },
    {
      level: "intermediario",
      title: "Configurar probes e rolling update zero-downtime",
      description: "Adicione ao Deployment do exercício anterior: readiness probe (HTTP GET /health, initialDelay 10s, period 5s), liveness probe (HTTP GET /health, initialDelay 30s, period 10s) e startup probe (failureThreshold 30, period 10s). Configure maxUnavailable: 0 e maxSurge: 1 para garantir zero-downtime. Faça um rollout com nova versão da imagem e observe com kubectl rollout status.",
      concepts: ["readiness probe", "liveness probe", "startup probe", "rolling update", "maxUnavailable", "maxSurge"],
    },
    {
      level: "intermediario",
      title: "ConfigMap, Secret e injeção de configuração",
      description: "Crie um ConfigMap com variáveis de ambiente (APP_ENV=production, LOG_LEVEL=info) e um Secret com credenciais de banco (DB_PASSWORD). Injete o ConfigMap via envFrom e o Secret via env individual valueFrom.secretKeyRef. Monte também um ConfigMap como arquivo em /etc/app/config.yaml. Confirme os valores dentro do pod com kubectl exec.",
      concepts: ["ConfigMap", "Secret", "envFrom", "valueFrom.secretKeyRef", "volume mount"],
    },
    {
      level: "senior",
      title: "RBAC para ServiceAccount com permissões mínimas",
      description: "Crie um ServiceAccount chamado 'api-worker'. Crie um Role que permite apenas: get/list de ConfigMaps e Secrets no namespace 'production'. Crie um RoleBinding associando o Role ao ServiceAccount. Configure o Deployment para usar esse SA. Verifique com kubectl auth can-i get secrets --as=system:serviceaccount:production:api-worker. Tente fazer uma ação não permitida (delete pods) e confirme o erro.",
      concepts: ["ServiceAccount", "Role", "RoleBinding", "RBAC", "princípio do menor privilégio", "kubectl auth can-i"],
    },
    {
      level: "senior",
      title: "HPA com PodDisruptionBudget e simulação de carga",
      description: "Configure HPA para o Deployment: minReplicas=2, maxReplicas=10, targetCPUUtilizationPercentage=70. Crie um PodDisruptionBudget com minAvailable: 2. Gere carga com kubectl run load-test --image=busybox --rm -it -- sh -c 'while true; do wget -O- http://api-service; done'. Observe kubectl get hpa --watch escalar os pods. Teste kubectl drain em um node e verifique que o PDB mantém 2 pods disponíveis.",
      concepts: ["HPA", "PodDisruptionBudget", "Metrics Server", "auto-scaling", "node drain", "kubectl drain"],
    },
  ],
  codeExamples: [
    {
      title: "Deployment com probes, resources e rolling update",
      language: "yaml",
      code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0        # zero-downtime
  template:
    metadata:
      labels:
        app: api
    spec:
      serviceAccountName: api-worker  # SA com permissões mínimas
      terminationGracePeriodSeconds: 30
      containers:
        - name: api
          image: my-api:1.4.2          # pin por semver, nunca latest
          ports:
            - containerPort: 3000
          env:
            - name: NODE_ENV
              valueFrom:
                configMapKeyRef:
                  name: api-config
                  key: NODE_ENV
            - name: DB_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: api-secrets
                  key: DB_PASSWORD
          resources:
            requests:
              cpu: "100m"
              memory: "128Mi"
            limits:
              cpu: "500m"
              memory: "256Mi"
          startupProbe:               # evita liveness matar durante boot longo
            httpGet:
              path: /health
              port: 3000
            failureThreshold: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /ready
              port: 3000
            initialDelaySeconds: 10
            periodSeconds: 5
            failureThreshold: 3
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 60
            periodSeconds: 15
            failureThreshold: 3
          lifecycle:
            preStop:
              exec:
                command: ["sh", "-c", "sleep 5"]  # tempo para kube-proxy remover endpoint`,
    },
    {
      title: "RBAC — ServiceAccount com Role mínimo",
      language: "yaml",
      code: `# ServiceAccount para o workload
apiVersion: v1
kind: ServiceAccount
metadata:
  name: api-worker
  namespace: production
---
# Role: somente o que a aplicação precisa
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: api-role
  namespace: production
rules:
  - apiGroups: [""]
    resources: ["configmaps"]
    verbs: ["get", "list", "watch"]
  - apiGroups: [""]
    resources: ["secrets"]
    resourceNames: ["api-secrets"]  # apenas o Secret específico
    verbs: ["get"]
---
# RoleBinding: associa Role ao ServiceAccount
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: api-binding
  namespace: production
subjects:
  - kind: ServiceAccount
    name: api-worker
    namespace: production
roleRef:
  kind: Role
  apiGroup: rbac.authorization.k8s.io
  name: api-role`,
    },
    {
      title: "HPA + PodDisruptionBudget",
      language: "yaml",
      code: `# HPA: escala de 2 a 10 réplicas por CPU
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
  namespace: production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
---
# PDB: garante mínimo 2 pods durante drain/upgrade
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: api-pdb
  namespace: production
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: api`,
    },
    {
      title: "NetworkPolicy — zero-trust entre namespaces",
      language: "yaml",
      code: `# Nega todo tráfego por padrão no namespace
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all
  namespace: production
spec:
  podSelector: {}        # aplica a todos os pods
  policyTypes:
    - Ingress
    - Egress
---
# Permite apenas backend → database na porta 5432
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-backend-to-db
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: database
  policyTypes:
    - Ingress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: backend
          namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: production
      ports:
        - protocol: TCP
          port: 5432`,
    },
    {
      title: "StatefulSet para banco de dados com PVC",
      language: "yaml",
      code: `apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  namespace: production
spec:
  serviceName: postgres-headless   # headless service para DNS por pod
  replicas: 3
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
        - name: postgres
          image: postgres:16.2
          env:
            - name: POSTGRES_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: postgres-secret
                  key: password
          resources:
            requests:
              cpu: "500m"
              memory: "512Mi"
            limits:
              cpu: "2"
              memory: "2Gi"
          volumeMounts:
            - name: data
              mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:          # cada pod tem seu próprio PVC
    - metadata:
        name: data
      spec:
        accessModes: ["ReadWriteOnce"]
        storageClassName: gp3    # SSD na AWS
        resources:
          requests:
            storage: 50Gi
---
# Headless service: DNS postgres-0.postgres-headless.production.svc.cluster.local
apiVersion: v1
kind: Service
metadata:
  name: postgres-headless
  namespace: production
spec:
  clusterIP: None              # headless
  selector:
    app: postgres
  ports:
    - port: 5432`,
    },
  ],
  videos: [
    {
      title: "Kubernetes Tutorial for Beginners (Full Course 4 Hours)",
      channel: "TechWorld with Nana",
      url: "https://www.youtube.com/watch?v=X48VuDVv0do",
      topic: "Fundamentos completos do K8s",
    },
    {
      title: "Kubernetes Networking Explained",
      channel: "TechWorld with Nana",
      url: "https://www.youtube.com/watch?v=5cNrTU6o3Fw",
      topic: "CNI, Services, DNS, Ingress",
    },
    {
      title: "Kubernetes RBAC Explained",
      channel: "KodeKloud",
      url: "https://www.youtube.com/watch?v=BLktpM--0jA",
      topic: "Role, ClusterRole, Binding, ServiceAccount",
    },
    {
      title: "Kubernetes Production Best Practices",
      channel: "That DevOps Guy",
      url: "https://www.youtube.com/watch?v=Vuws4AKarMo",
      topic: "Probes, PDB, resources, segurança",
    },
    {
      title: "Helm Tutorial for Kubernetes",
      channel: "TechWorld with Nana",
      url: "https://www.youtube.com/watch?v=-ykwb1d0DXU",
      topic: "Charts, values, rollback, templating",
    },
  ],
  resources: [
    { title: "Kubernetes Documentation Oficial", url: "https://kubernetes.io/docs/home/", kind: "docs" },
    { title: "Kubernetes the Hard Way (Kelsey Hightower)", url: "https://github.com/kelseyhightower/kubernetes-the-hard-way", kind: "pratica" },
    { title: "Kubernetes Up and Running — O'Reilly", url: "https://www.oreilly.com/library/view/kubernetes-up-and/9781098110192/", kind: "livro" },
    { title: "KodeKloud — CKA/CKAD Practice Labs", url: "https://kodekloud.com/", kind: "pratica" },
    { title: "Awesome Kubernetes — Curated Resources", url: "https://github.com/ramitsurana/awesome-kubernetes", kind: "artigo" },
    { title: "Kubernetes Patterns — O'Reilly", url: "https://www.oreilly.com/library/view/kubernetes-patterns/9781492050278/", kind: "livro" },
  ],
}

export default kubernetes
