import type { SkillContent } from '@/types'

const kubernetes: SkillContent = {
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
}

export default kubernetes
