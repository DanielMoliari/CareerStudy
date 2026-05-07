'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { DecisionTree } from '@/components/visuals/DecisionTree'
import type { DTNode } from '@/components/visuals/DecisionTree'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'
import { ProgressionMap } from '@/components/visuals/ProgressionMap'
import type { ProgressionLevel } from '@/components/visuals/ProgressionMap'

// ── Paleta Kubernetes ─────────────────────────────────────────────────────────
const C      = '#326ce5'   // K8s blue
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'

void LINE; void FG; void FGMUTE

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Arquitetura em camadas do cluster (LayerStack)
// Ensina: a hierarquia control plane → node → pod → container não é óbvia;
//         ver as camadas e o que cada uma faz é superior a texto
// ═══════════════════════════════════════════════════════════════════════════════

const CLUSTER_LAYERS: Layer[] = [
  {
    id: 'control-plane',
    label: 'Control Plane',
    sublabel: 'Cérebro do cluster — estado desejado vs real',
    color: '#ef4444',
    description: 'O control plane mantém o estado do cluster no etcd e reconcilia continuamente. Nenhum componente acessa etcd diretamente — tudo passa pelo kube-apiserver.',
    examples: [
      'kube-apiserver: REST API, valida e persiste no etcd',
      'etcd: BD distribuído Raft — estado completo do cluster',
      'kube-scheduler: escolhe node para cada pod pendente',
      'controller-manager: loops de reconciliação (Deployment, Node, etc.)',
    ],
  },
  {
    id: 'node',
    label: 'Worker Node',
    sublabel: 'Máquina que executa os pods',
    color: '#38bdf8',
    description: 'Cada node executa o kubelet (garante pods do node), kube-proxy (iptables para Services) e o container runtime (containerd, CRI-O). O CNI plugin gerencia a rede dos pods.',
    examples: [
      'kubelet: reconcilia pods com as specs do control plane',
      'kube-proxy: regras iptables/ipvs para Service ClusterIP/NodePort',
      'containerd: executa e gerencia containers',
      'CNI (Calico, Cilium, Flannel): rede dos pods',
    ],
  },
  {
    id: 'pod',
    label: 'Pod',
    sublabel: 'Unidade mínima — compartilha rede e volumes',
    color: '#10b981',
    description: 'Pod = um ou mais containers que compartilham namespace de rede (mesmo IP, loopback) e volumes. Containers no mesmo pod se comunicam via localhost. Pod é efêmero — nunca edite em produção.',
    examples: [
      'Containers compartilham o mesmo IP do pod',
      'Comunicação intra-pod: localhost:porta',
      'Volumes montados em todos os containers do pod',
      'Labels: chave para seleção por Services, Deployments e NetworkPolicies',
    ],
  },
  {
    id: 'workload',
    label: 'Workload Controller',
    sublabel: 'Deployment, StatefulSet, DaemonSet, Job',
    color: C,
    description: 'Controllers gerenciam ReplicaSets de pods com diferentes garantias. Deployment = stateless. StatefulSet = identidade estável (db-0, db-1, PVC por pod). DaemonSet = 1 pod por node. Job/CronJob = batch.',
    examples: [
      'Deployment: rolling update, rollback, pods substituíveis',
      'StatefulSet: nome ordinal, PVC próprio, start/stop ordenado',
      'DaemonSet: agentes de log, monitoring, CNI por node',
      'Job: executa até completar. CronJob: agendado.',
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Probes: liveness, readiness, startup (ComparisonTable)
// Ensina: os 3 tipos de probe com ação, propósito e erros comuns — simultâneos
// ═══════════════════════════════════════════════════════════════════════════════

const PROBE_OPTIONS: ComparisonOption[] = [
  { id: 'startup', label: 'Startup Probe', sublabel: 'Boot lento', color: '#f59e0b' },
  { id: 'readiness', label: 'Readiness Probe', sublabel: 'Pronto para tráfego?', color: '#10b981' },
  { id: 'liveness', label: 'Liveness Probe', sublabel: 'Está vivo?', color: '#ef4444' },
]

const PROBE_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'when',
    label: 'Quando ativa',
    values: {
      startup: { rating: 'good', note: 'Apenas durante o boot — substitui liveness' },
      readiness: { rating: 'good', note: 'Continuamente durante toda a vida do pod' },
      liveness: { rating: 'good', note: 'Após startup concluída (initialDelay)' },
    },
  },
  {
    id: 'action',
    label: 'Ação em falha',
    values: {
      startup: { rating: 'fair', note: 'Reinicia container (mata se failureThreshold atingido)' },
      readiness: { rating: 'excellent', note: 'Remove pod dos endpoints do Service (sem reiniciar)' },
      liveness: { rating: 'poor', note: 'Reinicia container (mata e recria)' },
    },
  },
  {
    id: 'use-case',
    label: 'Caso de uso',
    values: {
      startup: { rating: 'good', note: 'JVM, apps com warmup de 30–120 s' },
      readiness: { rating: 'excellent', note: 'Warmup de cache, dep externa indisponível, graceful shutdown' },
      liveness: { rating: 'good', note: 'Deadlock, loop infinito, travamento irrecuperável' },
    },
  },
  {
    id: 'external-deps',
    label: 'Checar dependências externas?',
    values: {
      startup: { rating: 'na', note: 'N/A — é sobre o próprio processo subir' },
      readiness: { rating: 'excellent', note: 'SIM — DB indsponível → sair do Service até recuperar' },
      liveness: { rating: 'poor', note: 'NUNCA — DB cai → liveness falha → K8s mata todos os pods' },
    },
  },
  {
    id: 'typical-config',
    label: 'Configuração típica',
    values: {
      startup: { rating: 'good', note: 'failureThreshold: 30, periodSeconds: 10 → 5 min max' },
      readiness: { rating: 'good', note: 'initialDelay: 10s, period: 5s, failureThreshold: 3' },
      liveness: { rating: 'good', note: 'initialDelay: 60s, period: 15s, failureThreshold: 3' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Service type decision tree
// Ensina: escolher ClusterIP, NodePort, LoadBalancer ou Headless tem contextos
//         específicos não-óbvios em texto
// ═══════════════════════════════════════════════════════════════════════════════

const SVC_ROOT: DTNode = {
  id: 'root',
  question: 'Quem precisa acessar o serviço?',
  children: [
    { label: 'Apenas outros pods dentro do cluster', nodeId: 'internal', color: C },
    { label: 'Tráfego externo HTTP/HTTPS', nodeId: 'external-http', color: '#10b981' },
    { label: 'Tráfego externo não-HTTP (TCP/UDP)', nodeId: 'external-tcp', color: '#f59e0b' },
    { label: 'Pods precisam descobrir peers (StatefulSet)', nodeId: 'peers', color: '#a78bfa' },
  ],
}

const SVC_NODES: Record<string, DTNode> = {
  internal: {
    id: 'internal',
    recommendation: 'ClusterIP (padrão)',
    detail: 'IP virtual acessível apenas dentro do cluster. DNS estável: svc-name.namespace.svc.cluster.local. Dentro do mesmo namespace, basta svc-name. kube-proxy implementa via iptables/ipvs.',
    color: C,
    icon: '✅',
  },
  'external-http': {
    id: 'external-http',
    question: 'Um ou múltiplos serviços com roteamento por host/path?',
    children: [
      { label: 'Múltiplos serviços (economizar LBs)', nodeId: 'ingress', color: '#10b981' },
      { label: 'Apenas 1 serviço por IP externo', nodeId: 'loadbalancer', color: '#f59e0b' },
    ],
  },
  ingress: {
    id: 'ingress',
    recommendation: 'Ingress + Ingress Controller',
    detail: 'Um único LB para múltiplos serviços com roteamento por host (api.domain.com) e path (/api, /admin). Requer Ingress Controller instalado (NGINX, Traefik, AWS ALB). TLS termination no controller.',
    color: '#10b981',
    icon: '✅',
  },
  loadbalancer: {
    id: 'loadbalancer',
    recommendation: 'Service LoadBalancer',
    detail: 'Provisiona LB do cloud provider (AWS ELB, GCP LB). Ideal para serviço único de missão crítica. Mais caro que Ingress para múltiplos serviços — cada Service LoadBalancer aloca 1 LB.',
    color: '#f59e0b',
    icon: '⚠️',
  },
  'external-tcp': {
    id: 'external-tcp',
    recommendation: 'Service NodePort ou LoadBalancer',
    detail: 'Para protocolos não-HTTP (banco de dados, gRPC externo, UDP). NodePort expõe porta 30000–32767 em cada node. LoadBalancer para produção com IP estável. Ingress não suporta TCP/UDP genérico.',
    color: '#f59e0b',
    icon: '⚠️',
  },
  peers: {
    id: 'peers',
    recommendation: 'Headless Service (clusterIP: None)',
    detail: 'DNS retorna IPs dos pods diretamente (sem IP virtual). Pods do StatefulSet se descobrem: db-0.postgres-headless.ns.svc. Usado por Kafka, Elasticsearch, bancos de dados para descoberta de peers.',
    color: '#a78bfa',
    icon: '✅',
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Anti-patterns K8s (AntiPatternsGallery)
// Ensina: os erros que causam incidents reais ficam claros com diff errado × certo
// ═══════════════════════════════════════════════════════════════════════════════

const K8S_ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'Liveness probe checando dependências externas',
    wrong: [
      [{ text: '# ❌ liveness checa banco de dados', color: '#ef4444' }],
      [{ text: 'livenessProbe:', color: '#e2e8f0' }],
      [{ text: '  httpGet:', color: '#e2e8f0' }],
      [{ text: '    path: /health/deep  # checa DB, Redis, etc.', color: '#ef4444' }],
      [{ text: '    port: 3000', color: '#e2e8f0' }],
      [{ text: '  failureThreshold: 3', color: '#e2e8f0' }],
      [{ text: '# DB pisca → liveness falha → K8s mata TODOS os pods', color: '#ef4444' }],
      [{ text: '# Downtime amplificado por K8s, não pelo DB', color: '#ef4444' }],
    ],
    right: [
      [{ text: '# ✅ liveness só checa o processo em si (deadlock, travamento)', color: '#4ade80' }],
      [{ text: 'livenessProbe:', color: '#e2e8f0' }],
      [{ text: '  httpGet:', color: '#e2e8f0' }],
      [{ text: '    path: /health  # processo vivo? sem deps externas', color: '#4ade80' }],
      [{ text: '    port: 3000', color: '#e2e8f0' }],
      [{ text: 'readinessProbe:', color: '#e2e8f0' }],
      [{ text: '  httpGet:', color: '#e2e8f0' }],
      [{ text: '    path: /ready  # readiness checa deps — sai do Service', color: '#4ade80' }],
      [{ text: '    port: 3000', color: '#e2e8f0' }],
    ],
    why: 'Liveness falha → K8s reinicia o container. DB cai → liveness falha em todos os pods → K8s mata todos simultaneamente → downtime ampliado. Readiness para tráfego, liveness para travamento.',
  },
  {
    title: 'Pod sem resource requests (scheduling caótico)',
    wrong: [
      [{ text: '# ❌ Sem requests — scheduler não sabe alocar', color: '#ef4444' }],
      [{ text: 'containers:', color: '#e2e8f0' }],
      [{ text: '  - name: api', color: '#e2e8f0' }],
      [{ text: '    image: my-api:latest  # ❌ latest também', color: '#ef4444' }],
      [{ text: '    # sem resources — scheduler chuta', color: '#ef4444' }],
      [{ text: '    # pod pode ser scheduled em node sem memória', color: '#ef4444' }],
      [{ text: '    # OOMKilled em horário de pico sem aviso', color: '#ef4444' }],
    ],
    right: [
      [{ text: '# ✅ requests = garantia mínima. limits = teto do kernel', color: '#4ade80' }],
      [{ text: 'containers:', color: '#e2e8f0' }],
      [{ text: '  - name: api', color: '#e2e8f0' }],
      [{ text: '    image: my-api:1.4.2  # ✅ pin por semver', color: '#4ade80' }],
      [{ text: '    resources:', color: '#4ade80' }],
      [{ text: '      requests:', color: '#4ade80' }],
      [{ text: '        cpu: "100m"    # scheduler usa para alocar', color: '#4ade80' }],
      [{ text: '        memory: "128Mi"', color: '#4ade80' }],
      [{ text: '      limits:', color: '#4ade80' }],
      [{ text: '        cpu: "500m"    # throttle se exceder', color: '#4ade80' }],
      [{ text: '        memory: "256Mi"  # OOMKilled se exceder', color: '#4ade80' }],
    ],
    why: 'Sem requests: scheduler agenda em nodes sem capacidade → OOMKilled em pico. Sem limits: um pod consome todo o node. Sem tag fixa: rollout pega imagem diferente silenciosamente.',
  },
  {
    title: 'Rolling update sem PodDisruptionBudget',
    wrong: [
      [{ text: '# ❌ Sem PDB — drain/upgrade pode matar todos os pods', color: '#ef4444' }],
      [{ text: 'apiVersion: apps/v1', color: '#e2e8f0' }],
      [{ text: 'kind: Deployment', color: '#e2e8f0' }],
      [{ text: 'spec:', color: '#e2e8f0' }],
      [{ text: '  replicas: 3', color: '#e2e8f0' }],
      [{ text: '  strategy:', color: '#e2e8f0' }],
      [{ text: '    rollingUpdate:', color: '#e2e8f0' }],
      [{ text: '      maxUnavailable: 1  # até 2 pods em paralelo', color: '#ef4444' }],
      [{ text: '  # Sem PDB → kubectl drain pode evictar os 3 juntos', color: '#ef4444' }],
    ],
    right: [
      [{ text: '# ✅ PDB garante mínimo disponível durante drain/upgrade', color: '#4ade80' }],
      [{ text: 'apiVersion: policy/v1', color: '#4ade80' }],
      [{ text: 'kind: PodDisruptionBudget', color: '#4ade80' }],
      [{ text: 'spec:', color: '#4ade80' }],
      [{ text: '  minAvailable: 2  # sempre 2 pods disponíveis', color: '#4ade80' }],
      [{ text: '  selector:', color: '#4ade80' }],
      [{ text: '    matchLabels: { app: api }', color: '#4ade80' }],
      [{ text: '---', color: '#475569' }],
      [{ text: '# Deployment: maxUnavailable: 0 para zero-downtime', color: '#4ade80' }],
    ],
    why: 'Sem PDB, kubectl drain pode evictar todos os pods de um Deployment simultaneamente → downtime. PDB garante que o drain só prossegue quando minAvailable pods estão disponíveis.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — Progressão kubectl e conceitos por nível
// Ensina: o que aprender em cada estágio da jornada K8s
// ═══════════════════════════════════════════════════════════════════════════════

const K8S_PROGRESSION: ProgressionLevel[] = [
  {
    id: 'iniciante',
    name: 'Iniciante',
    label: 'Fundamentos',
    emoji: '🌱',
    concepts: [
      { name: 'Pod, Container, Image', tip: 'Pod é a unidade mínima — não é o container' },
      { name: 'kubectl apply/get/describe/logs', tip: 'Comandos mais usados no dia a dia' },
      { name: 'Deployment + ReplicaSet', tip: 'Deployment gerencia ReplicaSet — nunca edite pods diretamente' },
      { name: 'Service ClusterIP', tip: 'DNS interno: nome.namespace.svc.cluster.local' },
      { name: 'ConfigMap e Secret', tip: 'Secret é base64, não criptografia — use External Secrets em produção' },
      { name: 'Resource requests e limits', tip: 'Request = garantia, Limit = teto do kernel' },
    ],
  },
  {
    id: 'pleno',
    name: 'Pleno',
    label: 'Operação',
    emoji: '⚙️',
    concepts: [
      { name: 'Probes: liveness, readiness, startup', tip: 'Liveness NUNCA checa deps externas — mata todos os pods' },
      { name: 'Rolling update: maxSurge, maxUnavailable', tip: 'maxUnavailable: 0 = zero-downtime garantido' },
      { name: 'StatefulSet vs Deployment', tip: 'StatefulSet: nome ordinal + PVC por pod. Para DBs, Kafka.' },
      { name: 'Ingress + Ingress Controller', tip: 'Ingress não é nativo — precisa de controller instalado' },
      { name: 'HPA por CPU/memória', tip: 'Metrics Server obrigatório. Scale-to-zero: usar KEDA.' },
      { name: 'RBAC: Role, ClusterRole, Binding', tip: 'Criar SA específico por workload — nunca usar default' },
    ],
  },
  {
    id: 'senior',
    name: 'Sênior',
    label: 'Produção',
    emoji: '🚀',
    concepts: [
      { name: 'PodDisruptionBudget', tip: 'Obrigatório antes de habilitar auto-upgrades de nodes' },
      { name: 'NetworkPolicy (zero-trust)', tip: 'Requer CNI compatível (Calico, Cilium) — Flannel não implementa' },
      { name: 'etcd backup e restore', tip: 'etcd é o único componente stateful — sem backup, sem recovery' },
      { name: 'Taints, tolerations, affinity', tip: 'Anti-affinity: réplicas em nodes diferentes para HA real' },
      { name: 'HPA com KEDA (custom metrics)', tip: 'KEDA: escala por Kafka lag, SQS depth, Prometheus query' },
      { name: 'Operators e CRDs', tip: 'Operator = SRE codificado — PostgreSQL Operator, Cert-Manager' },
    ],
  },
  {
    id: 'especialista',
    name: 'Especialista',
    label: 'Plataforma',
    emoji: '🏗️',
    concepts: [
      { name: 'Service Mesh (Istio, Linkerd)', tip: 'mTLS, canary, circuit breaker no nível de rede' },
      { name: 'Gateway API (successor do Ingress)', tip: 'GatewayClass → Gateway → HTTPRoute — mais expressivo' },
      { name: 'Velero para backup de PVCs', tip: 'GitOps cobre configs, Velero cobre dados dos volumes' },
      { name: 'Cluster autoscaler (node scaling)', tip: 'HPA escala pods, Cluster Autoscaler escala nodes' },
      { name: 'OPA/Kyverno para policy enforcement', tip: 'Admission webhooks — valida e muta recursos antes de criar' },
      { name: 'eBPF networking (Cilium)', tip: 'Substitui iptables, observabilidade nativa, melhor performance' },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export default function KubernetesVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'cluster-layers',
      title: 'Arquitetura do Cluster',
      subtitle: 'Control plane → Node → Pod → Workload Controller — camadas e responsabilidades',
      accent: C,
      component: (
        <LayerStack
          layers={CLUSTER_LAYERS}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          direction="top-down"
        />
      ),
    },
    {
      id: 'probes-comparison',
      title: 'Probes: Liveness, Readiness, Startup',
      subtitle: 'Quando cada probe atua, o que faz em falha e os erros mais comuns',
      accent: C,
      component: (
        <ComparisonTable
          options={PROBE_OPTIONS}
          criteria={PROBE_CRITERIA}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'service-decision',
      title: 'Qual tipo de Service usar?',
      subtitle: 'ClusterIP, NodePort, LoadBalancer, Ingress ou Headless?',
      accent: C,
      component: (
        <DecisionTree
          root={SVC_ROOT}
          nodes={SVC_NODES}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'k8s-antipatterns',
      title: 'Anti-patterns Kubernetes',
      subtitle: 'Os 3 erros que causam a maioria dos incidents de produção',
      accent: C,
      component: (
        <AntiPatternsGallery
          patterns={K8S_ANTIPATTERNS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'k8s-progression',
      title: 'Jornada de Aprendizado',
      subtitle: 'Do iniciante ao especialista — conceitos por estágio',
      accent: C,
      component: (
        <ProgressionMap
          levels={K8S_PROGRESSION}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
  ]

  return (
    <VisuaisShell
      visuals={visuals}
      active={active}
      onChange={setActive}
    />
  )
}
