'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildCheatsheetPdf } from '@/components/pdfs/CheatsheetPdf'
import type { HookItem, RuleItem } from '@/components/pdfs/CheatsheetPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'
import { buildMindmapPdf } from '@/components/pdfs/MindmapPdf'
import type { MindmapCategory } from '@/components/pdfs/MindmapPdf'

// ── Paleta Kubernetes ──────────────────────────────────────────────────────────
const C    = '#326ce5'  // K8s blue — NUNCA omitir, default seria cyan React
const GRN  = '#4ade80'
const AMB  = '#f59e0b'
const PRP  = '#8b5cf6'
const CYN  = '#06b6d4'
const RED  = '#ef4444'

void GRN; void AMB; void PRP; void CYN; void RED

// ── Metadados dos PDFs ────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas sobre Kubernetes em entrevista',
    type: 'qa',
    pages: 10,
    description: 'Recuperação ativa: probes (liveness/readiness/startup), Deployment vs StatefulSet vs DaemonSet, RBAC, rolling update zero-downtime, HPA, PersistentVolumes, etcd, Operators, PodDisruptionBudget — tudo que entrevistadores sênior de cloud-native realmente perguntam.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet',
    subtitle: 'kubectl, manifests e regras críticas numa página',
    type: 'cheatsheet',
    pages: 3,
    description: 'Referência densa: kubectl debug, apply, rollout, scale, exec, port-forward. Manifests essenciais (Deployment, Service, RBAC). Regras de ouro para probes, resources e segurança.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'Os 4 truques que grudam Kubernetes na memória',
    type: 'mnemonics',
    pages: 2,
    description: 'L-R-S Probes (Liveness=Loop, Readiness=Route, Startup=Slow), Requests vs Limits (Reserva vs Lei), Deploy-State-Daemon (Stateless/Stateful/Sistema) e RBAC Role Role Bind.',
    icon: '03',
    goal: 'Memória de longo prazo',
  },
  {
    id: 'mindmap',
    title: 'Mind Map',
    subtitle: 'Kubernetes do zero ao sênior em uma folha',
    type: 'mindmap',
    pages: 2,
    description: 'Mapa mental com 6 categorias (Control Plane, Worker Node, Workloads, Networking, Segurança, Config/Storage) e checklist de auto-avaliação para entrevistas sênior.',
    icon: '04',
    goal: 'Mapeamento mental',
  },
]

// ── Dados: Q&A ────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'K8s vs Docker Compose — quando vale a complexidade?',
    a: 'Compose ganha em dev local, single-host, time pequeno. K8s começa a valer com multi-host, auto-scaling horizontal, rolling update sem downtime, multi-tenant com isolamento. Para produto pequeno em 1 host, K8s é overkill. Em escala média (20+ serviços, vários times), K8s vira indispensável pelo modelo declarativo. Managed K8s (EKS/GKE/AKS) reduz o overhead operacional mas não elimina.',
    tip: 'Citar que K8s tem custo operacional real (etcd backup, upgrades, networking) demonstra experiência. Não é apenas "K8s é melhor que Compose".',
  },
  {
    level: 'Pleno',
    q: 'Liveness vs readiness vs startup probe — quando usar cada uma?',
    a: '<strong>liveness</strong>: "está vivo?" Falha → kubelet mata e recria o pod. Para deadlock, loop infinito. NÃO checar dependências externas. <strong>readiness</strong>: "pode receber tráfego?" Falha → pod sai dos endpoints do Service mas continua rodando. Para warmup, dep externa indisponível. <strong>startup</strong>: substitui liveness durante startup longo (JVM, warmup). Previne que liveness mate o pod antes de subir. Erro clássico: liveness checando banco de dados — DB pisca, K8s mata todos os pods, downtime amplificado.',
    tip: 'A resposta completa menciona os três. Muitos plenos só conhecem liveness e readiness. O erro clássico da liveness checando DB é frequentemente perguntado.',
  },
  {
    level: 'Pleno',
    q: 'Como você debuga um pod em CrashLoopBackOff?',
    a: '<code>kubectl describe pod &lt;name&gt;</code> — veja Events: ImagePullBackOff, OOMKilled, FailedScheduling. <code>kubectl logs &lt;pod&gt; --previous</code> — log do container que crashou. Exit code 137 = OOMKilled (memória), 1 = exit de erro de aplicação, 0 = saiu normalmente (probe mal configurada). Checar se requests/limits estão adequados. Probe: liveness matando antes de subir? Aumentar initialDelaySeconds ou usar startup probe. Image: tag correta? Registry acessível? Credencial válida (imagePullSecret)?',
    tip: 'Demonstrar a sequência sistemática (describe → logs --previous → exit code) impressiona mais que listar possibilidades aleatórias.',
  },
  {
    level: 'Pleno',
    q: 'O que é um Deployment e como o rolling update funciona internamente?',
    a: 'Deployment gerencia ReplicaSet. Ao alterar imagem/config, K8s cria novo ReplicaSet e escala ele up enquanto escala o antigo down, respeitando <code>maxSurge</code> e <code>maxUnavailable</code>. Padrão: maxSurge=25%, maxUnavailable=25%. Com 4 replicas, pode subir até 5 pods novos e ter no mínimo 3 rodando. Rollback: <code>kubectl rollout undo deployment/&lt;name&gt;</code> — reverte para o ReplicaSet anterior. Histórico controlado por <code>revisionHistoryLimit</code>.',
    tip: 'Explique que o ReplicaSet antigo não é deletado imediatamente — K8s mantém histórico para rollback.',
  },
  {
    level: 'Senior',
    q: 'Diferença entre Deployment, StatefulSet e DaemonSet.',
    a: '<strong>Deployment</strong>: pods stateless e intercambiáveis. Nomes aleatórios (app-7d4f8c9b). Para APIs, workers sem estado. <strong>StatefulSet</strong>: pods com identidade estável, nomes ordinais (db-0, db-1), cada pod tem seu próprio PVC, start em ordem. Para bancos de dados, Kafka, Elasticsearch. <strong>DaemonSet</strong>: garante exatamente um pod por node (ou subset via nodeSelector). Para agentes de log (Fluentd), monitoring (node-exporter), CNI plugins.',
    tip: '"Como você escalaria um banco de dados primário/réplica no K8s?" — StatefulSet com headless service é a resposta esperada de sênior.',
  },
  {
    level: 'Senior',
    q: 'Como funciona o RBAC no Kubernetes?',
    a: 'RBAC controla quem pode fazer o quê na API do K8s. Quatro objetos: <strong>Role</strong>: permissões em um namespace. <strong>ClusterRole</strong>: permissões cluster-wide. <strong>RoleBinding</strong>: associa Role a ServiceAccount/User/Group no namespace. <strong>ClusterRoleBinding</strong>: associa ClusterRole globalmente. Cada Pod usa um ServiceAccount. Best practice: criar SA específico por workload com Role mínimo. Nunca usar SA default com poderes extras ou cluster-admin em aplicação.',
    tip: 'Citar "princípio do menor privilégio" com exemplo concreto (SA que só pode ler ConfigMaps do próprio namespace) demonstra maturidade.',
  },
  {
    level: 'Pleno',
    q: 'O que é ConfigMap vs Secret e como você os injeta num Pod?',
    a: '<strong>ConfigMap</strong>: dados de configuração não sensíveis (URLs, feature flags). <strong>Secret</strong>: dados sensíveis em base64 — não criptografado por padrão (criptografia at-rest requer configuração no etcd). Formas de injetar: (1) variável de ambiente via <code>envFrom: configMapRef/secretRef</code>, (2) volume montado como arquivo no filesystem, (3) <code>env[].valueFrom.secretKeyRef</code> para valor individual. Para produção: External Secrets Operator ou Vault Agent Injector — o Secret no etcd é apenas referência, o valor vem do Vault.',
    tip: 'Diferenciar base64 (encoding) de criptografia é sinal de maturidade. Mencionar External Secrets demonstra conhecimento de produção.',
  },
  {
    level: 'Senior',
    q: 'Como o HPA funciona e quais são suas limitações?',
    a: 'HPA monitora métricas via Metrics Server e ajusta réplicas entre minReplicas e maxReplicas. CPU > 80% → adiciona pods. CPU < 20% por N minutos → remove pods. Limitações: (1) latência de escala (novos pods demoram 30–90s para ficar ready), (2) scale-to-zero: HPA não vai a zero por padrão — KEDA sim, (3) métricas custom requerem Prometheus Adapter ou configuração extra, (4) não funciona bem com StatefulSet em DBs.',
    tip: 'Citar KEDA para workloads event-driven (scale by Kafka lag) diferencia candidato sênior de pleno.',
  },
  {
    level: 'Senior',
    q: 'Explique PersistentVolume, PersistentVolumeClaim e StorageClass.',
    a: '<strong>PersistentVolume (PV)</strong>: recurso de storage no cluster — capacidade, access mode, reclaim policy. <strong>PersistentVolumeClaim (PVC)</strong>: pedido de storage feito pelo Pod. K8s faz binding com PV compatível. <strong>StorageClass</strong>: define o provisionador (AWS EBS, GCP PD, NFS). PVC referencia a StorageClass → volume provisionado dinamicamente. Access Modes: ReadWriteOnce (1 node), ReadOnlyMany (vários, leitura), ReadWriteMany (vários, escrita — NFS/EFS). Reclaim Policy: Retain (dado fica), Delete (dado some).',
    tip: 'Erro clássico: confundir PV com PVC. PV é o recurso real, PVC é o pedido. StorageClass automatiza a criação do PV.',
  },
  {
    level: 'Pleno',
    q: 'O que é um Namespace e para que serve?',
    a: 'Namespace é uma partição virtual do cluster. Recursos (Pods, Services, ConfigMaps) são namespaced. Nodes, PVs e ClusterRoles são cluster-scoped. Usos comuns: separar ambientes (dev/staging/prod no mesmo cluster), separar times, separar tenants com ResourceQuota e LimitRange por namespace. DNS interno: <code>svc-name.namespace.svc.cluster.local</code>. Por padrão, todos os namespaces se comunicam livremente — NetworkPolicy pode isolar.',
    tip: 'Lembrar que alguns recursos são cluster-scoped (Nodes, CRDs, ClusterRole) demonstra profundidade que muitos candidatos plenos não têm.',
  },
  {
    level: 'Senior',
    q: 'Como implementar zero-downtime deployment no Kubernetes?',
    a: 'Estratégia de rolling update: <code>maxUnavailable: 0</code> garante que nenhum pod sai antes do novo estar ready. Readiness probe correta — pod só entra no Service quando realmente pronto. PodDisruptionBudget — garante mínimo de pods durante node drain/upgrade. Graceful shutdown: <code>terminationGracePeriodSeconds</code> suficiente para fechar conexões. PreStop hook: <code>sleep 5</code> antes do SIGTERM para dar tempo ao kube-proxy remover o endpoint. Sem readiness probe correta, rolling update pode rotear tráfego para pod que ainda não subiu.',
    tip: 'O detalhe do PreStop hook + sleep impressiona entrevistadores: sem ele, kube-proxy pode ainda rotear para o pod quando ele recebe SIGTERM.',
  },
  {
    level: 'Pleno',
    q: 'O que é Ingress e como ele difere de um Service LoadBalancer?',
    a: '<strong>Service LoadBalancer</strong>: aloca um IP de load balancer no cloud para cada Service. Caro (1 LB por serviço) e sem roteamento HTTP. <strong>Ingress</strong>: único ponto de entrada HTTP/HTTPS com regras de roteamento por host e path. Um Ingress Controller (NGINX, Traefik, AWS ALB) implementa as regras. Muito mais econômico — 1 LB para muitos serviços. Ingress permite TLS termination, redirecionamento, auth, rate limiting. Para UDP/TCP genérico, Ingress não serve — use Service NodePort ou LoadBalancer.',
    tip: 'Mencionar que Ingress precisa de um Ingress Controller instalado (não é nativo ao K8s) é frequentemente esquecido por candidatos plenos.',
  },
  {
    level: 'Senior',
    q: 'O que é NetworkPolicy e por que é importante?',
    a: 'Por padrão, todos os pods se comunicam livremente. NetworkPolicy define regras de rede (ingress/egress) com base em labels de pod e namespace. Exemplo: database pod só aceita conexão de pods com label <code>app: backend</code> no namespace <code>production</code>. Importante: NetworkPolicy requer CNI que suporte (Calico, Cilium, Weave). Flannel puro não implementa NetworkPolicy. Zero-trust: comece negando tudo e abra apenas o necessário.',
    tip: 'Saber que o CNI precisa suportar NetworkPolicy é um gotcha real de produção — frequentemente esquecido.',
  },
  {
    level: 'Senior',
    q: 'Como o Kubernetes faz scheduling de um Pod?',
    a: 'O scheduler filtra nodes elegíveis e pontua para encontrar o melhor. Etapas: (1) Filter: nodes com recursos suficientes (requests), taints tolerados, nodeSelector/affinity respeitados. (2) Score: pontua por recursos disponíveis, preferências de affinity, spread topology. (3) Bind: scheduler atribui o Pod ao node vencedor. Pod fica em <code>Pending</code> se nenhum node passa o filtro — <code>kubectl describe pod</code> mostra o motivo em Events.',
    tip: 'Citar pod anti-affinity para HA (não colocar réplicas no mesmo node) demonstra senioridade. Muitos candidatos param no Filter sem mencionar Score.',
  },
  {
    level: 'Senior',
    q: 'O que são taints e tolerations?',
    a: '<strong>Taint</strong>: marca um node para repelir pods sem a toleration correspondente. <strong>Toleration</strong>: declaração no Pod que permite ser agendado em node com taint específico. Efeitos: <code>NoSchedule</code> (não agenda novos), <code>PreferNoSchedule</code> (evita mas pode), <code>NoExecute</code> (evita E expulsa pods existentes). Usos: reservar nodes dedicados (GPU, spot), isolar nodes de sistema, drenar node graciosamente.',
    tip: 'Diferenciar os três efeitos de taint é o que separa quem memorizou de quem usa no dia a dia em produção.',
  },
  {
    level: 'Senior',
    q: 'Como você faz backup e disaster recovery em Kubernetes?',
    a: 'Estratégia em camadas: (1) <strong>etcd backup</strong>: é o banco de dados do cluster. Backup com <code>etcdctl snapshot save</code>. Sem backup do etcd, não há recovery de estado. (2) <strong>Velero</strong>: backup de objetos K8s e volumes persistentes, suporta S3. (3) <strong>GitOps (ArgoCD/Flux)</strong>: configuração do cluster em Git — cluster pode ser recriado do zero. (4) <strong>Storage backup</strong>: PVs críticos com snapshots (EBS Snapshot, GCP PD Snapshot). GitOps é a abordagem mais robusta para config, mas não cobre dados das PVCs.',
    tip: 'Separar backup de configuração (etcd/GitOps) de backup de dados (Velero/storage snapshots) demonstra clareza conceitual que entrevistadores valorizam.',
  },
  {
    level: 'Pleno',
    q: 'O que é Helm e quando usá-lo?',
    a: 'Helm é o package manager do K8s. Um Chart é um conjunto de templates YAML parametrizados. <code>values.yaml</code> define defaults sobrescritíveis pelo usuário. Vantagens: reutilização de manifests, versionamento de release, rollback (<code>helm rollback</code>), ecossistema de charts prontos (PostgreSQL, Prometheus). Limitações: templates Go viram ilegíveis com muita lógica. Alternativa mais simples: Kustomize (sem template, apenas patches/overlays). Use Helm para apps com múltiplos ambientes ou para distribuir software K8s.',
    tip: 'Citar Kustomize como alternativa mais simples demonstra que você conhece o ecossistema além do Helm.',
  },
  {
    level: 'Senior',
    q: 'Como funciona o etcd e qual é seu papel no Kubernetes?',
    a: 'etcd é um banco de dados distribuído chave-valor baseado em Raft consensus. É o único componente stateful do control plane. Armazena todo o estado do cluster — todo acesso via kube-apiserver (nenhum componente acessa etcd diretamente). Raft garante que maioria dos membros concorde antes de commit (quorum). Para HA, etcd em número ímpar (3 ou 5). Impacto crítico: etcd lento = API server lenta = todo o cluster lento.',
    tip: 'Saber que kube-apiserver é o único cliente do etcd (outros componentes leem via apiserver) é detalhe que demonstra conhecimento profundo do control plane.',
  },
  {
    level: 'Senior',
    q: 'O que é um Operator no Kubernetes?',
    a: 'Operator automatiza operações de apps stateful usando CRD (Custom Resource Definition) + controller de reconciliação. Exemplo: PostgreSQL Operator — você cria um objeto <code>PostgresCluster</code> e o Operator gerencia StatefulSet, replicação, failover automático e backups periódicos. É "SRE codificado": operações manuais de DBA viram código declarativo. Exemplos reais: Prometheus Operator, Strimzi (Kafka), Cert-Manager, Vault Operator.',
    tip: 'A analogia "Operator = SRE codificado" é memorável e demonstra entendimento do padrão, não só da mecânica de CRD + controller.',
  },
  {
    level: 'Senior',
    q: 'O que é um PodDisruptionBudget e quando é necessário?',
    a: 'PodDisruptionBudget (PDB) define quantos pods podem ficar indisponíveis durante perturbações voluntárias (node drain, cluster upgrade, scale down). Configuração: <code>minAvailable: 2</code> (sempre 2 pods disponíveis) ou <code>maxUnavailable: 1</code> (no máximo 1 fora por vez). Sem PDB: durante <code>kubectl drain</code>, K8s pode evictar todos os pods de uma vez → downtime. Quando usar: qualquer workload stateless com SLA. Obrigatório antes de habilitar auto-upgrades de nodes.',
    tip: '"O que acontece sem PDB durante um cluster upgrade?" — K8s pode drenar 2+ pods do mesmo Deployment simultaneamente. É a pergunta prática que revela experiência real.',
  },
]

// ── Dados: CheatSheet ─────────────────────────────────────────────────────────

const CHEATSHEET_HOOKS: HookItem[] = [
  { name: 'kubectl get', sig: 'kubectl get pods/svc/deploy -n <ns> -o wide', desc: 'Lista recursos. -A para todos os namespaces. -o yaml para spec completa.' },
  { name: 'kubectl describe', sig: 'kubectl describe pod <name> -n <ns>', desc: 'Detalhes e Events do recurso. Primeiro comando ao debugar CrashLoopBackOff.' },
  { name: 'kubectl logs', sig: 'kubectl logs <pod> -f --previous', desc: '-f para follow em tempo real. --previous para log do container que crashou.' },
  { name: 'kubectl exec', sig: 'kubectl exec -it <pod> -- sh', desc: 'Shell interativo no container. Trocar sh por bash se disponível.' },
  { name: 'kubectl apply', sig: 'kubectl apply -f manifest.yaml', desc: 'Aplica ou atualiza recursos declarativamente. Usar sempre em vez de kubectl create.' },
  { name: 'kubectl rollout', sig: 'kubectl rollout status/undo deploy/<name>', desc: 'status: acompanha rolling update. undo: reverte para ReplicaSet anterior.' },
  { name: 'kubectl scale', sig: 'kubectl scale deploy/<name> --replicas=5', desc: 'Escala deployment manualmente. Não usar se HPA estiver ativo (conflito).' },
  { name: 'kubectl port-forward', sig: 'kubectl port-forward svc/<name> 8080:80', desc: 'Tunnel local para Service ou Pod. Útil para debug sem expor externamente.' },
  { name: 'kubectl auth can-i', sig: 'kubectl auth can-i get pods --as=system:serviceaccount:ns:sa', desc: 'Verifica permissão RBAC de um ServiceAccount. Essencial para debug de acesso.' },
  { name: 'kubectl top', sig: 'kubectl top pod/node', desc: 'Uso atual de CPU e memória. Requer Metrics Server instalado no cluster.' },
]

const CHEATSHEET_RULES: RuleItem[] = [
  { ok: false, t: 'Tag latest em imagem de produção — versão muda silenciosamente' },
  { ok: false, t: 'Sem resource requests — scheduling vira caos, OOMKilled sem aviso' },
  { ok: false, t: 'Liveness probe checando banco de dados — DB pisca, K8s mata todos os pods' },
  { ok: false, t: 'Secret apenas em base64 no etcd — habilite encryption at-rest ou use Vault' },
  { ok: false, t: 'Sem PodDisruptionBudget — node drain pode derrubar todas as réplicas juntas' },
  { ok: true, t: 'Pin de imagem por SHA ou semver fixo (my-api:1.4.2 ou sha256:abc…)' },
  { ok: true, t: 'requests E limits configurados: CPU throttle > OOMKilled é o trade-off aceitável' },
  { ok: true, t: 'Startup probe para apps lentos (JVM) — evita liveness matar durante boot' },
  { ok: true, t: 'PreStop hook com sleep 5 — dá tempo ao kube-proxy remover endpoint antes de SIGTERM' },
  { ok: true, t: 'ServiceAccount dedicado por workload com Role mínimo (princípio do menor privilégio)' },
]

// ── Dados: Mnemônicos ─────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'L-R-S Probes: "Liveness=Loop, Readiness=Route, Startup=Slow"',
    trick: 'L-R-S',
    expansion: [
      ['L = Liveness', 'Detecta loop/travamento — mata e reinicia o container'],
      ['R = Readiness', 'Controla roteamento — retira do Service sem matar'],
      ['S = Startup', 'Para apps lentos — substitui liveness durante o boot'],
    ],
    explanation: 'Liveness detecta travamento permanente. Readiness controla se o pod recebe tráfego. Startup protege o boot longo.',
    example: 'Erro clássico: Liveness checando DB externo → DB pisca → K8s mata todos os pods → downtime amplificado',
    why: 'A pergunta sobre probes aparece em quase toda entrevista de K8s. Distinguir os três corretamente e citar o anti-pattern da liveness checando DB é o que separa pleno de sênior.',
  },
  {
    label: 'Resources: "Request = Reserva, Limit = Lei"',
    trick: 'R=Reserva, L=Lei',
    expansion: [
      ['Request = Reserva', 'O que o scheduler reserva no node — garantia mínima para o pod'],
      ['Limit = Lei', 'Teto imposto pelo kernel: passar memória = OOMKilled, passar CPU = throttle'],
    ],
    explanation: 'Request é a promessa do scheduler. Limit é a execução pelo kernel. Sem request, o scheduler chuta e o pod cai em horário de pico.',
    example: 'Pod sem memory limit: consome toda a memória do node → OOM do node inteiro → múltiplos pods afetados',
    why: 'Requests/limits é o item mais frequentemente mal configurado em produção. Entender a diferença evita OOMKilled misterioso e scheduling caótico.',
  },
  {
    label: 'Workload Types: "Stateless → Deployment, Stateful → StatefulSet, Sistema → DaemonSet"',
    trick: 'D-S-D por estado',
    expansion: [
      ['Deployment (Stateless)', 'Pods intercambiáveis, nomes aleatórios — APIs, workers sem estado'],
      ['StatefulSet (Stateful)', 'Pods com identidade estável, PVC próprio por pod — DBs, Kafka'],
      ['DaemonSet (Sistema)', 'Um pod por node — agentes de log, monitoring, CNI plugins'],
    ],
    explanation: 'A escolha do workload type depende do estado e do escopo. StatefulSet garante ordem de start/stop e identidade estável.',
    example: 'PostgreSQL com StatefulSet: postgres-0, postgres-1, postgres-2 — cada um com seu PVC de 50Gi no gp3',
    why: 'Entrevistadores gostam de perguntar "como você rodaria um banco de dados no K8s?" — StatefulSet com headless service é a resposta correta.',
  },
  {
    label: 'RBAC: "Role define o QUÊ, Binding define o QUEM"',
    trick: 'Role=QUÊ, Binding=QUEM',
    expansion: [
      ['Role / ClusterRole', 'Define permissões: quais verbos (get, list, delete) sobre quais recursos (pods, secrets)'],
      ['RoleBinding / ClusterRoleBinding', 'Associa o Role a um sujeito: ServiceAccount, User ou Group'],
      ['Escopo', 'Role = namespace; ClusterRole = cluster-wide ou para ser usado em múltiplos namespaces'],
    ],
    explanation: 'Sempre separe os dois conceitos. Role é o conjunto de permissões. Binding é a atribuição desse conjunto a um sujeito.',
    example: 'api-worker SA + Role "configmaps:get,list" + RoleBinding = SA só lê ConfigMaps do namespace',
    why: 'RBAC é tema obrigatório em entrevistas sênior de K8s. Entender Role vs Binding e namespace vs cluster-wide é o mínimo esperado.',
  },
]

// ── Dados: Mind Map ───────────────────────────────────────────────────────────

const MINDMAP_CATEGORIES: MindmapCategory[] = [
  {
    label: 'Control Plane',
    color: RED,
    items: [
      { t: 'kube-apiserver (único cliente do etcd)', k: true },
      { t: 'etcd (estado completo do cluster)', k: true },
      { t: 'kube-scheduler (Filter → Score → Bind)', k: true },
      { t: 'controller-manager (loops de reconciliação)', k: true },
      { t: 'etcd backup obrigatório para DR', a: true },
    ],
  },
  {
    label: 'Worker Node',
    color: C,
    items: [
      { t: 'kubelet (garante pods rodando)', k: true },
      { t: 'kube-proxy (regras iptables/Services)', k: true },
      { t: 'Container Runtime (containerd)', k: true },
      { t: 'CNI plugin (rede entre pods)', k: true },
      { t: 'node-exporter (métricas de node)', a: true },
    ],
  },
  {
    label: 'Workloads',
    color: GRN,
    items: [
      { t: 'Deployment (stateless, rolling update)', k: true },
      { t: 'StatefulSet (stateful, identidade + PVC)', k: true },
      { t: 'DaemonSet (um pod por node)', k: true },
      { t: 'Job / CronJob (batch)', k: true },
      { t: 'Operator = SRE codificado (CRD + controller)', a: true },
    ],
  },
  {
    label: 'Networking',
    color: AMB,
    items: [
      { t: 'Service: ClusterIP / NodePort / LoadBalancer', k: true },
      { t: 'Headless Service (StatefulSet peer discovery)', k: true },
      { t: 'Ingress + Controller (NGINX, Traefik)', k: true },
      { t: 'NetworkPolicy (zero-trust, requer CNI)', a: true },
      { t: 'DNS: <svc>.<ns>.svc.cluster.local', k: true },
    ],
  },
  {
    label: 'Segurança',
    color: PRP,
    items: [
      { t: 'RBAC: Role + RoleBinding', k: true },
      { t: 'ServiceAccount por workload (menor privilégio)', k: true },
      { t: 'Secret base64 ≠ criptografia — use Vault/ESO', k: true },
      { t: 'PodSecurity Standards (restricted)', a: true },
      { t: 'Taints + Tolerations (nodes dedicados)', a: true },
    ],
  },
  {
    label: 'Config / Storage',
    color: CYN,
    items: [
      { t: 'ConfigMap (não-sensível) / Secret (sensível)', k: true },
      { t: 'PVC / PV / StorageClass (dynamic provisioning)', k: true },
      { t: 'HPA (CPU/mem) / KEDA (event-driven)', k: true },
      { t: 'PodDisruptionBudget (zero-downtime upgrade)', k: true },
      { t: 'Helm / Kustomize (templating/overlays)', a: true },
    ],
  },
]

const MINDMAP_CHECKLIST = [
  'Sei explicar a diferença entre liveness, readiness e startup probe?',
  'Consigo citar o anti-pattern da liveness checando banco de dados?',
  'Sei quando usar Deployment vs StatefulSet vs DaemonSet?',
  'Entendo como funciona RBAC (Role, ClusterRole, Binding) com ServiceAccount?',
  'Sei a diferença entre resource requests e limits (e o que é OOMKilled)?',
  'Consigo descrever como o rolling update funciona com maxSurge e maxUnavailable?',
  'Sei o que é um PodDisruptionBudget e por que é necessário?',
  'Entendo a diferença entre Service ClusterIP, NodePort, LoadBalancer e Headless?',
  'Sei que base64 de Secret não é criptografia e como mitigar?',
  'Consigo explicar o padrão Operator (CRD + controller de reconciliação)?',
]

// ── Builders ──────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'Kubernetes',
    stackLabel: 'DevOps · Orquestração',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'Kubernetes',
    accentColor: C,
    stackLabel: 'DevOps · Orquestração',
    sections: {
      hooks: CHEATSHEET_HOOKS,
      depRows: [
        ['kubectl get pods -A', 'Lista todos os pods em todos os namespaces'],
        ['kubectl describe pod', 'Mostra eventos — primeiro passo ao debugar'],
        ['kubectl logs --previous', 'Log do container que crashou antes'],
        ['kubectl rollout undo', 'Reverte Deployment para versão anterior'],
        ['kubectl auth can-i', 'Verifica permissão RBAC de um ServiceAccount'],
      ],
      rules: CHEATSHEET_RULES,
      performanceTips: [
        'Pin de imagem por semver fixo ou SHA — nunca tag latest em produção',
        'Resource requests obrigatórios — sem eles o scheduler não tem garantias',
        'Startup probe para JVM e apps com boot longo — evita CrashLoopBackOff',
        'PreStop hook sleep 5 — kube-proxy precisa de tempo para remover endpoint',
        'PodDisruptionBudget antes de habilitar auto-upgrades de nodes',
        'NetworkPolicy zero-trust: deny-all + allowlist explícito por necessidade',
      ],
      patterns: [
        {
          name: 'Deployment zero-downtime',
          code: `strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 1
    maxUnavailable: 0   # zero-downtime
lifecycle:
  preStop:
    exec:
      command: ["sh","-c","sleep 5"]`,
          desc: 'maxUnavailable: 0 + PreStop sleep garante zero-downtime real',
        },
        {
          name: 'Probes corretas',
          code: `startupProbe:
  httpGet: { path: /health, port: 3000 }
  failureThreshold: 30
  periodSeconds: 10
readinessProbe:
  httpGet: { path: /ready, port: 3000 }
  periodSeconds: 5
livenessProbe:
  httpGet: { path: /health, port: 3000 }
  initialDelaySeconds: 60`,
          desc: 'Startup cobre boot longo; readiness controla Service; liveness detecta travamento',
        },
        {
          name: 'RBAC mínimo com ServiceAccount',
          code: `# SA dedicado por workload
kind: ServiceAccount
metadata: { name: api-worker }
---
# Role com permissões mínimas
rules:
- apiGroups: [""]
  resources: ["configmaps"]
  verbs: ["get","list"]`,
          desc: 'SA dedicado + Role mínimo = princípio do menor privilégio',
        },
      ],
      mentalModels: [
        'L-R-S: Liveness=Loop, Readiness=Route, Startup=Slow',
        'Request = Reserva (scheduler), Limit = Lei (kernel) — sem request não há garantia',
        'Stateless → Deployment, Stateful → StatefulSet, Sistema → DaemonSet',
        'Role define o QUÊ (permissões), Binding define o QUEM (sujeito)',
        'Operator = SRE codificado (CRD + controller de reconciliação)',
      ],
    },
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'Kubernetes',
    stackLabel: 'DevOps · Orquestração',
  }),
  mindmap: () => buildMindmapPdf({
    categories: MINDMAP_CATEGORIES,
    checklist: MINDMAP_CHECKLIST,
    accentColor: C,
    skillName: 'Kubernetes',
    stackLabel: 'DevOps · Orquestração',
    checklistTitle: 'Auto-avaliação pré-entrevista',
    checklistDesc: 'Responda SIM para pelo menos 8 antes de ir a uma entrevista sênior de cloud-native.',
  }),
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function KubernetesPdfs() {
  const [open, setOpen] = useState<PdfCard | null>(null)
  const hero = PDF_CARDS[0]
  const rest = PDF_CARDS.slice(1)

  return (
    <>
      <HeroCard card={hero} accent={C} onOpen={() => setOpen(hero)} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 16 }}>
        {rest.map(c => (
          <CollectionCard key={c.id} card={c} accent={C} onOpen={() => setOpen(c)} />
        ))}
      </div>
      {open && <PdfModal card={open} onClose={() => setOpen(null)} builders={PDF_BUILDERS} />}
    </>
  )
}
