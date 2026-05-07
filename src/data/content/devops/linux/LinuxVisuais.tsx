'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { CommandPalette } from '@/components/visuals/CommandPalette'
import type { CLICommand } from '@/components/visuals/CommandPalette'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'
import { SequenceDiagram } from '@/components/visuals/SequenceDiagram'
import type { SeqActor, SeqMessage } from '@/components/visuals/SequenceDiagram'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'

// ── Paleta Linux ──────────────────────────────────────────────────────────────
const C   = '#f97316'   // Linux orange
const GRN = '#4ade80'
const SKY = '#38bdf8'
const AMB = '#f59e0b'
const PRP = '#a78bfa'
const BG  = '#0f172a'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Command Palette: comandos Linux essenciais por categoria
// ═══════════════════════════════════════════════════════════════════════════════

const LINUX_COMMANDS: CLICommand[] = [
  // Processos
  {
    command: 'ps aux',
    category: 'Processos',
    description: 'Listar todos os processos com usuário, PID, CPU%, MEM%, comando',
    output: 'USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND\nroot         1  0.0  0.0 167512 11436 ?        Ss   09:00   0:01 /sbin/init\nnginx     1234  0.1  0.5 124956 42312 ?        S    09:01   0:00 nginx: worker\nnode      5678  2.3  3.2 987456 260240 ?       Sl   10:00   1:23 node /app/index.js',
    outputType: 'text',
    flags: [
      { flag: 'a', description: 'Processos de todos os usuários' },
      { flag: 'u', description: 'Formato orientado a usuário (CPU, MEM)' },
      { flag: 'x', description: 'Inclui processos sem terminal (daemons)' },
    ],
  },
  {
    command: 'top -H -p PID',
    category: 'Processos',
    description: 'Mostrar threads de um processo específico (substitua PID pelo número)',
    output: 'top - 14:32:01  PID: 5678\n   PID USER  PR  NI  VIRT  RES  SHR S %CPU %MEM     TIME+ COMMAND\n  5678 node  20   0  987m  260m  12m S  2.3  3.2   1:23.45 node\n  5679 node  20   0  987m  260m  12m S  0.1  3.2   0:01.23 V8 Worker\n  5680 node  20   0  987m  260m  12m S  0.0  3.2   0:00.01 uv_threadpool',
    outputType: 'text',
    flags: [
      { flag: '-H', description: 'Mostrar threads (H = Threads)' },
      { flag: '-p PID', description: 'Filtrar por PID específico' },
    ],
  },
  {
    command: 'kill -TERM PID',
    aliases: ['kill -15 PID'],
    category: 'Processos',
    description: 'Enviar SIGTERM para graceful shutdown (processo pode capturar e limpar)',
    output: '# Processo recebe SIGTERM, pode fazer cleanup antes de sair\n# Se não sair em 30s, use kill -KILL PID como último recurso\n\n# Para verificar se saiu:\nps -p PID  # Retorna "No such process" se morreu',
    outputType: 'text',
    flags: [
      { flag: '-TERM ou -15', description: 'SIGTERM — graceful (pode capturar)' },
      { flag: '-KILL ou -9', description: 'SIGKILL — força, sem cleanup (não pode capturar)' },
      { flag: '-HUP ou -1', description: 'SIGHUP — reload config (convensão daemons)' },
    ],
  },
  // Rede
  {
    command: 'ss -tlnp',
    aliases: ['netstat -tlnp'],
    category: 'Rede',
    description: 'Listar portas TCP escutando com o processo associado (moderno, substitui netstat)',
    output: 'Netid  State   Recv-Q  Send-Q  Local Address:Port  Process\ntcp    LISTEN  0       128     0.0.0.0:22         users:((\"sshd\",pid=1234))\ntcp    LISTEN  0       511     127.0.0.1:5432     users:((\"postgres\",pid=2345))\ntcp    LISTEN  0       511     0.0.0.0:80         users:((\"nginx\",pid=3456))\ntcp    LISTEN  0       511     0.0.0.0:3000       users:((\"node\",pid=5678))',
    outputType: 'text',
    flags: [
      { flag: '-t', description: 'Somente TCP' },
      { flag: '-l', description: 'Somente sockets em LISTEN' },
      { flag: '-n', description: 'Não resolver nomes (mais rápido)' },
      { flag: '-p', description: 'Mostrar processo (requer root para outros usuários)' },
    ],
  },
  {
    command: 'curl -v URL',
    category: 'Rede',
    description: 'Debug HTTP completo — mostra DNS, TCP, TLS handshake, headers de request e response',
    output: '* Trying 93.184.216.34:443...\n* Connected to example.com port 443\n* TLS handshake OK\n> GET / HTTP/2\n> Host: example.com\n>\n< HTTP/2 200\n< content-type: text/html\n<\n[body]',
    outputType: 'text',
    flags: [
      { flag: '-v', description: 'Verbose: DNS, TCP, TLS, headers' },
      { flag: '-I', description: 'Somente headers (HEAD request)' },
      { flag: '-X POST -d data', description: 'POST com body' },
      { flag: '-H Header:val', description: 'Adicionar header customizado' },
    ],
  },
  {
    command: 'tcpdump -i any port 80 -n',
    category: 'Rede',
    description: 'Capturar pacotes na porta 80 em todas as interfaces (requer root)',
    output: '14:32:01.123456 IP 10.0.0.1.54321 > 10.0.0.2.80: Flags [S] seq 0\n14:32:01.123789 IP 10.0.0.2.80 > 10.0.0.1.54321: Flags [S.] ack 1\n14:32:01.124000 IP 10.0.0.1.54321 > 10.0.0.2.80: Flags [.] ack 1\n# [S]=SYN [S.]=SYN-ACK [.]=ACK [P]=PSH [F]=FIN [R]=RST',
    outputType: 'text',
    flags: [
      { flag: '-i any', description: 'Capturar em todas as interfaces' },
      { flag: '-n', description: 'Não resolver nomes (mais rápido)' },
      { flag: '-w arquivo.pcap', description: 'Salvar para análise no Wireshark' },
    ],
  },
  // Disco e Filesystem
  {
    command: 'df -h',
    aliases: ['df -i'],
    category: 'Disco',
    description: 'Uso de disco por filesystem. Use -i para inodes (disco "cheio" com espaço livre)',
    output: '# df -h (espaço em disco)\nFilesystem      Size  Used Avail Use% Mounted on\n/dev/sda1        50G   38G   10G  79% /\n\n# df -i (inodes)\nFilesystem      Inodes  IUsed   IFree IUse% Mounted on\n/dev/sda1      3276800 3276798       2  100% /  <- ESGOTADO!',
    outputType: 'text',
    flags: [
      { flag: '-h', description: 'Human readable (GB, MB)' },
      { flag: '-i', description: 'Inodes em vez de blocos' },
    ],
  },
  {
    command: 'lsof | grep deleted',
    category: 'Disco',
    description: 'Encontrar arquivos deletados mas ainda abertos por algum processo (espaço preso)',
    output: 'COMMAND   PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME\nnginx    1234 root    4r   REG    8,1 10485760 1234 /var/log/nginx/access.log (deleted)\n# Arquivo deletado mas nginx ainda escreve nele\n# Solução: systemctl restart nginx',
    outputType: 'text',
  },
  // Performance
  {
    command: 'vmstat 1',
    category: 'Performance',
    description: 'Visão geral de CPU, memória, swap, I/O em intervalos de 1 segundo (USE method)',
    output: 'procs -----------memory---------- ---swap-- -----io---- ------cpu-----\n r  b   swpd   free  cache   si   so    bi    bo us sy id wa\n 2  1      0 512000 1200000   0    0   240   180 45 12 38  5\n# r=run queue  wa=wait I/O  us=userspace  sy=syscalls',
    outputType: 'text',
    flags: [
      { flag: '1', description: 'Intervalo de 1 segundo' },
      { flag: '-d', description: 'Estatísticas de disco' },
    ],
  },
  {
    command: 'iostat -x 1',
    category: 'Performance',
    description: 'Estatísticas estendidas de I/O por disco — util% e await são os mais importantes',
    output: 'Device  r/s   w/s  rMB/s  wMB/s  await  %util\nsda     2.5  45.2   0.12   1.82   32.4   87.5  <- saturado!\nnvme0n1 0.1   8.3   0.01   0.33    1.2    3.2  <- saudável\n\n# await > 20ms = latência alta. %util > 80% = saturado',
    outputType: 'text',
    flags: [
      { flag: '-x', description: 'Estatísticas estendidas (await, util%)' },
    ],
  },
  // systemd
  {
    command: 'journalctl -u svc -f',
    aliases: ['journalctl -u svc -n 100 --since 1h ago'],
    category: 'systemd',
    description: 'Log em tempo real de um serviço (-f = follow). -n 100 para últimas N linhas.',
    output: 'Jan 15 14:32:01 server meuapp[5678]: Server started on port 3000\nJan 15 14:32:05 server meuapp[5678]: GET /api/health 200 1ms\nJan 15 14:32:10 server meuapp[5678]: ERROR: connection refused 127.0.0.1:5432',
    outputType: 'text',
    flags: [
      { flag: '-u svc', description: 'Filtrar por unit (serviço)' },
      { flag: '-f', description: 'Follow — log em tempo real' },
      { flag: '-n 100', description: 'Últimas 100 linhas' },
      { flag: '--since 1h ago', description: 'Logs da última hora' },
    ],
  },
  {
    command: 'systemctl status svc',
    category: 'systemd',
    description: 'Estado do serviço com últimas linhas de log',
    output: 'meuapp.service - Meu App Node.js\n   Active: active (running) since Mon 2024-01-15 09:00:00 UTC; 5h ago\n Main PID: 5678 (node)\n\nJan 15 14:30:00 server meuapp[5678]: GET /api/users 200 12ms',
    outputType: 'text',
    flags: [
      { flag: 'start/stop/restart', description: 'Controlar serviço' },
      { flag: 'enable/disable', description: 'Iniciar/não iniciar no boot' },
      { flag: 'daemon-reload', description: 'Recarregar unit files após edição' },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Layer Stack: arquitetura Linux
// ═══════════════════════════════════════════════════════════════════════════════

const LINUX_LAYERS: Layer[] = [
  {
    id: 'hardware',
    label: 'Hardware',
    sublabel: 'CPU, RAM, Disco, Rede',
    color: '#475569',
    description: 'Recursos físicos do servidor. CPU (cores, frequência), memória RAM, discos (SSD/HDD), interfaces de rede (NICs).',
    examples: ['CPU: /proc/cpuinfo', 'RAM: /proc/meminfo', 'Disco: /dev/sda', 'Rede: eth0, ens3'],
  },
  {
    id: 'kernel',
    label: 'Kernel Linux',
    sublabel: 'Gerencia recursos via syscalls',
    color: C,
    description: 'Núcleo do SO. Gerencia processos (scheduler), memória virtual, drivers, sistema de arquivos VFS, networking stack (TCP/IP). Expõe /proc e /sys.',
    examples: ['Scheduler (CFS)', 'Virtual Memory Manager', 'VFS (ext4, xfs, btrfs)', 'Networking (tcp/ip, iptables)'],
  },
  {
    id: 'syscall',
    label: 'Interface de Syscalls',
    sublabel: 'Boundary user/kernel space',
    color: '#ef4444',
    description: 'Fronteira entre userspace e kernelspace. Processos fazem syscalls (read, write, fork, exec, socket) para acessar recursos via kernel. strace intercepta aqui.',
    examples: ['read(), write()', 'fork(), exec()', 'socket(), connect()', 'mmap(), brk()'],
  },
  {
    id: 'cgroups',
    label: 'cgroups + namespaces',
    sublabel: 'Isolamento e limites (Docker/K8s)',
    color: AMB,
    description: 'cgroups limitam recursos por grupo de processos (CPU, memória, I/O). Namespaces isolam visões (PID, net, mnt, user). Base de containers Linux.',
    examples: ['cgroup: memory.limit', 'namespace: pid, net, mnt', 'Docker cgroups v2', '/sys/fs/cgroup/'],
  },
  {
    id: 'systemd',
    label: 'systemd (PID 1)',
    sublabel: 'Init, services, logging',
    color: PRP,
    description: 'Init system moderno. Gerencia serviços (units), logging (journald), mounts (automount), sockets, timers.',
    examples: ['systemctl', 'journalctl', 'Unit files', '/etc/systemd/system/'],
  },
  {
    id: 'userspace',
    label: 'Userspace / Aplicações',
    sublabel: 'Processos, shell, apps',
    color: GRN,
    description: 'Processos do usuário. Shell (bash, zsh), daemons (nginx, postgres, node), ferramentas de sistema. Cada processo tem seu próprio virtual address space.',
    examples: ['bash, zsh', 'nginx, node, postgres', 'ps, top, awk, curl', 'Containers (Docker)'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Sequence Diagram: graceful shutdown em container
// ═══════════════════════════════════════════════════════════════════════════════

const GS_ACTORS: SeqActor[] = [
  { id: 'k8s',    label: 'Kubernetes',     color: SKY },
  { id: 'docker', label: 'Docker Runtime', color: AMB },
  { id: 'app',    label: 'Aplicação',      color: GRN },
  { id: 'os',     label: 'Kernel Linux',   color: C },
]

const GS_MESSAGES: SeqMessage[] = [
  {
    from: 'k8s',
    to: 'docker',
    label: 'kubectl delete pod / deploy stop',
    note: 'Inicia graceful shutdown',
  },
  {
    from: 'docker',
    to: 'app',
    label: 'SIGTERM (signal 15)',
    note: 'terminationGracePeriodSeconds inicia (default 30s)',
  },
  {
    from: 'app',
    to: 'app',
    label: 'process.on("SIGTERM") — fecha listener',
    note: 'Para de aceitar novas conexões',
  },
  {
    from: 'app',
    to: 'app',
    label: 'Aguarda requests em andamento (max 25s)',
    note: 'Deixa margem para o timeout do K8s',
  },
  {
    from: 'app',
    to: 'os',
    label: 'exit(0)',
    type: 'return' as const,
    note: 'Saída limpa antes do timeout',
  },
  {
    from: 'os',
    to: 'docker',
    label: 'Process exited (exit code 0)',
    type: 'return' as const,
  },
  {
    from: 'docker',
    to: 'k8s',
    label: 'Container stopped cleanly',
    type: 'return' as const,
    note: 'Se não sair em 30s: SIGKILL -> exit code 137',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Comparação de sinais (ComparisonTable)
// ═══════════════════════════════════════════════════════════════════════════════

const SIGNAL_OPTIONS: ComparisonOption[] = [
  { id: 'sigterm', label: 'SIGTERM (15)', color: GRN },
  { id: 'sigkill', label: 'SIGKILL (9)',  color: '#ef4444' },
  { id: 'sighup',  label: 'SIGHUP (1)',   color: AMB },
  { id: 'sigint',  label: 'SIGINT (2)',   color: SKY },
]

const SIGNAL_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'capturavel',
    label: 'Pode ser capturado pelo processo',
    values: {
      sigterm: { rating: 'excellent', note: 'Sim — process.on("SIGTERM", handler)' },
      sigkill: { rating: 'poor',      note: 'Não — kernel mata imediatamente, sem aviso' },
      sighup:  { rating: 'excellent', note: 'Sim — convensão: usar para reload de config' },
      sigint:  { rating: 'excellent', note: 'Sim — Ctrl+C. Pode capturar para cleanup.' },
    },
  },
  {
    id: 'cleanup',
    label: 'Permite cleanup antes de sair',
    values: {
      sigterm: { rating: 'excellent', note: 'Sim — fechar conexões, flush buffers, finalizar requests' },
      sigkill: { rating: 'poor',      note: 'Não — dados em buffer perdidos, arquivos temporários ficam' },
      sighup:  { rating: 'excellent', note: 'Sim — tipicamente faz reload, não mata o processo' },
      sigint:  { rating: 'good',      note: 'Sim, se capturado. Default: termina sem cleanup especial' },
    },
  },
  {
    id: 'uso',
    label: 'Quando usar',
    values: {
      sigterm: { rating: 'excellent', note: 'Sempre primeiro — deploy, scale down, restart de serviço' },
      sigkill: { rating: 'fair',      note: 'Último recurso após timeout de SIGTERM. Nunca primeiro.' },
      sighup:  { rating: 'good',      note: 'Reload de config (nginx, sshd). Evita restart completo.' },
      sigint:  { rating: 'good',      note: 'Interação manual no terminal. Equivale a Ctrl+C.' },
    },
  },
  {
    id: 'docker',
    label: 'Comportamento em container',
    values: {
      sigterm: { rating: 'excellent', note: 'docker stop envia SIGTERM. App deve ter handler. Exit code 143.' },
      sigkill: { rating: 'poor',      note: 'docker stop --time=0 ou após timeout. Exit code 137.' },
      sighup:  { rating: 'fair',      note: 'Raramente usado em containers. Depende da app.' },
      sigint:  { rating: 'fair',      note: 'Ctrl+C no terminal do container. Semelhante a SIGTERM.' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAIS REGISTRY
// ═══════════════════════════════════════════════════════════════════════════════

const VISUALS: VisualDef[] = [
  {
    id: 'comandos',
    title: 'Comandos Essenciais',
    subtitle: 'Processos, Rede, Disco, Performance, systemd',
    accent: C,
    component: (
      <CommandPalette
        commands={LINUX_COMMANDS}
        accentColor={C}
        title="Linux — Comandos de Diagnóstico"
        description="Comandos por categoria: Processos, Rede, Disco, Performance, systemd"
        prompt="$"
        placeholder="Buscar comando (ps, ss, df, vmstat...)"
      />
    ),
  },
  {
    id: 'arquitetura',
    title: 'Arquitetura do Sistema',
    subtitle: 'Hardware → Kernel → syscalls → cgroups → systemd → userspace',
    accent: AMB,
    component: (
      <LayerStack
        layers={LINUX_LAYERS}
        accentColor={C}
        title="Linux — Camadas do Sistema"
        direction="top-down"
      />
    ),
  },
  {
    id: 'graceful-shutdown',
    title: 'Graceful Shutdown',
    subtitle: 'SIGTERM → cleanup → exit(0) vs SIGKILL',
    accent: GRN,
    component: (
      <SequenceDiagram
        actors={GS_ACTORS}
        messages={GS_MESSAGES}
        accentColor={C}
        bgColor={BG}
        title="SIGTERM → Graceful Shutdown → Container Stop"
      />
    ),
  },
  {
    id: 'sinais',
    title: 'Sinais Linux Comparados',
    subtitle: 'SIGTERM vs SIGKILL vs SIGHUP vs SIGINT',
    accent: SKY,
    component: (
      <ComparisonTable
        options={SIGNAL_OPTIONS}
        criteria={SIGNAL_CRITERIA}
        accentColor={C}
        title="Linux Signals — Quando usar cada um"
      />
    ),
  },
]

export default function LinuxVisuais() {
  const [active, setActive] = useState(0)
  return <VisuaisShell visuals={VISUALS} active={active} onChange={setActive} />
}
