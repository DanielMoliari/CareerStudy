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
import { buildAntipatternsPdf } from '@/components/pdfs/AntipatternsPdf'
import type { AntiPatternItem } from '@/components/pdfs/AntipatternsPdf'
import { buildQuickRefPdf } from '@/components/pdfs/QuickRefPdf'
import type { QuickRefColumn } from '@/components/pdfs/QuickRefPdf'

// ── Paleta Linux ──────────────────────────────────────────────────────────────
const C = '#f97316'  // Linux orange

// ── Metadados dos PDFs ────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'quick-ref',
    title: 'Quick Ref — Comandos',
    subtitle: 'Diagnóstico de produção Linux numa página',
    type: 'quick-ref',
    pages: 2,
    description: 'Processos (ps, top, kill, signals), Rede (ss, ip, dig, curl, tcpdump), Disco (df, du, lsof, find), Performance (vmstat, iostat, sar), systemd (systemctl, journalctl), Shell scripting.',
    icon: '01',
    goal: 'Consulta rápida',
    featured: true,
  },
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas sobre Linux em entrevista',
    type: 'qa',
    pages: 10,
    description: 'SIGTERM vs SIGKILL, graceful shutdown, permissões, FHS, inodes, USE method, systemd, cgroups, namespaces, awk/sed, diagnóstico de produção e muito mais.',
    icon: '02',
    goal: 'Recuperação ativa',
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet',
    subtitle: 'Shell scripting seguro e regras de ouro',
    type: 'cheatsheet',
    pages: 2,
    description: 'set -euo pipefail, aspas duplas, readonly, validação, pipes e redirects, cron syntax, systemd unit file, comandos de diagnóstico por categoria.',
    icon: '03',
    goal: 'Referência de scripting',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'Truques para fixar Linux na memória',
    type: 'mnemonics',
    pages: 2,
    description: 'EUP para set -euo pipefail, exit codes (137/139/143/1), USE method (Utilization + Saturation + Errors). Os mnemônicos que grudam os pontos mais cobrados.',
    icon: '04',
    goal: 'Memória de longo prazo',
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns',
    subtitle: 'Os 5 erros mais comuns com Linux em produção',
    type: 'antipatterns',
    pages: 3,
    description: 'rm -rf com variável vazia, script sem set -e, chmod 777, rodar serviço como root, kill -9 sem SIGTERM primeiro.',
    icon: '05',
    goal: 'Reconhecimento de padrão',
  },
]

// ── Dados: Q&A ────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'Container não sobe em produção — qual é o roteiro de diagnóstico?',
    a: '<strong>Por camadas:</strong> (1) <strong>Status + exit code:</strong> docker ps -a / kubectl get pod. <strong>137=OOM, 139=segfault, 143=SIGTERM, 1=app error</strong>. (2) <strong>Logs:</strong> docker logs ID --tail 100 / kubectl logs pod --previous. (3) <strong>Recursos do host:</strong> df -h (disco), free -m (memória), top (CPU). (4) <strong>Rede:</strong> curl localhost:porta, ss -tlnp — porta escuta? (5) <strong>Permissão:</strong> container roda como user que não tem acesso ao volume? (6) <strong>K8s describe:</strong> kubectl describe pod — eventos de image pull, schedule, probe.',
    tip: 'Exit code é o diagnóstico mais rápido: 137 (OOM) = aumentar memory limit. 143 (SIGTERM) = Kubernetes parou o container voluntariamente.',
  },
  {
    level: 'Pleno',
    q: 'O que é SIGTERM vs SIGKILL e como implementar graceful shutdown?',
    a: '<strong>SIGTERM (15):</strong> pedido de término — processo pode capturar, finalizar requests, fechar conexões, fazer flush de buffers. Docker/Kubernetes enviam SIGTERM primeiro. <strong>SIGKILL (9):</strong> kernel mata imediatamente — não pode ser capturado, sem cleanup, dados em buffer perdidos. <strong>Protocolo correto:</strong> SIGTERM → aguardar timeout (30s no K8s) → SIGKILL se ainda vivo. <strong>Node.js:</strong> <code>process.on("SIGTERM", () => { server.close(); process.exit(0) })</code>. Sem handler de SIGTERM, a app perde requests em andamento no deploy.',
    tip: 'Todo serviço em produção DEVE ter handler de SIGTERM — sem isso, deploys causam requests perdidos.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona o sistema de permissões Linux?',
    a: '<strong>3 grupos:</strong> owner, group, others. <strong>3 bits:</strong> r(4)=ler, w(2)=escrever, x(1)=executar. chmod 755 = rwxr-xr-x. <strong>Em diretórios:</strong> x=entrar (cd), r=listar (ls), w=criar/deletar arquivos. <strong>Bits especiais:</strong> SUID (4) = executa como owner, SGID (2) = herda grupo do dir, sticky (1) = só owner pode deletar em /tmp. <strong>Valores comuns:</strong> 600 (chave SSH), 644 (arquivo web), 755 (binário/dir), 700 (dir privado).',
    tip: 'Decorar: 600=chave SSH, 644=arquivo web, 755=binário/dir, 777=jamais em produção.',
  },
  {
    level: 'Pleno',
    q: 'CPU em 100% em produção — como você diagnostica?',
    a: '<strong>Fluxo:</strong> (1) top ou htop — qual processo. (2) vmstat 1: wa alto (>20%) = I/O bound, não CPU — investigar com iostat -x 1. us alto = userspace, sy alto = muitas syscalls. (3) top -H -p PID — qual thread. (4) perf top -p PID — hot code paths (qual função queima cycles). (5) strace -p PID -c — summary de syscalls por frequência. <strong>Armadilha:</strong> wa alto parece CPU mas é I/O — diagnóstico errado = solução errada.',
    tip: 'Sempre cheque wa no vmstat antes de pular para perf top. wa=50% significa que o gargalo é disco, não CPU.',
  },
  {
    level: 'Senior',
    q: 'O que é o USE method e como aplicar?',
    a: '<strong>USE method (Brendan Gregg):</strong> para cada recurso, checar Utilization + Saturation + Errors. <strong>CPU:</strong> top (util), vmstat r (run queue = saturation), dmesg (errors). <strong>Memória:</strong> free -m (util), vmstat si/so (swap = saturation), dmesg OOM. <strong>Disco:</strong> iostat -x 1 util% (util), await ms (saturation), dmesg I/O errors. <strong>Rede:</strong> sar -n DEV 1 (util), ss -s retransmits (saturation), ip -s link errors. Sequência: vmstat 1 → iostat -x 1 → sar → ferramentas específicas.',
    tip: 'USE method garante que você diagnóstica o recurso correto antes de ir para ferramentas específicas. Sem método = pula para perf top quando o problema é disco.',
  },
  {
    level: 'Senior',
    q: 'Disco "cheio" mas df -h mostra espaço livre — como diagnostica?',
    a: '<strong>Dois tipos de "cheio":</strong> (1) <strong>Inodes esgotados:</strong> df -i mostra Use%=100%. Acontece com muitos arquivos pequenos (node_modules, cache de sessões). Solução: deletar muitos arquivos pequenos. (2) <strong>Arquivo deletado mas processo ainda aberto:</strong> lsof | grep deleted — o espaço fica preso até o processo fechar o FD. Solução: reiniciar o processo. <strong>Verificação rápida:</strong> df -h (blocos) + df -i (inodes) + lsof | grep deleted.',
    tip: 'Os três diagnósticos são completamente diferentes — bloquear em apenas um é o erro mais comum.',
  },
  {
    level: 'Pleno',
    q: 'O que é systemd e como criar um unit file para um serviço?',
    a: '<strong>systemd</strong> é o init system (PID 1) de distros modernas. Gerencia serviços, logs (journald), mounts, timers. Unit file mínimo em /etc/systemd/system/meuapp.service: <code>[Unit] Description=Meu App After=network.target [Service] User=meuapp ExecStart=/usr/bin/node /opt/app/index.js Restart=on-failure TimeoutStopSec=30 [Install] WantedBy=multi-user.target</code>. Após criar: <code>systemctl daemon-reload && systemctl enable --now meuapp</code>. Logs: <code>journalctl -u meuapp -f</code>.',
    tip: 'Após qualquer edição de unit file: systemctl daemon-reload antes de restart — sem isso, systemd ignora as mudanças.',
  },
  {
    level: 'Senior',
    q: 'O que é cgroups e como Docker/Kubernetes usam?',
    a: '<strong>cgroups (control groups):</strong> mecanismo kernel para limitar recursos por grupo de processos. Docker: <code>--memory=512m</code> → cgroup memory.limit_in_bytes. <code>--cpus=0.5</code> → cgroup cpu quota. Kubernetes: resources.limits traduzidos para cgroup limits. OOMKiller vem do cgroup de memória — <code>dmesg | grep OOM</code> mostra o processo morto. <code>cat /proc/PID/cgroup</code> mostra a qual cgroup pertence. cgroups v2 (moderno): /sys/fs/cgroup/ é hierarquia unificada.',
    tip: 'K8s resources.limits são cgroup limits — OOMKill no container = limit de memória atingido, não falta de RAM no host.',
  },
  {
    level: 'Senior',
    q: 'O que são namespaces Linux e como containers os usam?',
    a: '<strong>Namespaces</strong> isolam visões de recursos do kernel por grupo de processos: <strong>pid</strong> (container vê apenas seus processos, PID 1 é o principal), <strong>net</strong> (interface de rede isolada), <strong>mnt</strong> (filesystem isolado), <strong>uts</strong> (hostname isolado), <strong>ipc</strong> (IPC isolado), <strong>user</strong> (UID isolado — rootless containers). Namespaces + cgroups = base de containers. O kernel não conhece "Docker" — só namespaces e cgroups. Rootless: UID 0 no container ≠ root no host.',
    tip: 'Namespaces isolam visibilidade; cgroups limitam recursos. Juntos formam a base de containers — Docker é apenas uma API.',
  },
  {
    level: 'Senior',
    q: 'Como depurar rede em Linux — roteiro completo?',
    a: '<strong>Sequência:</strong> (1) <code>ss -tlnp</code> — porta escutando? Em qual interface (0.0.0.0 vs 127.0.0.1)? (2) <code>ip a</code> — interfaces e IPs corretos? (3) <code>ip r</code> — rota padrão ok? (4) <code>ping host</code> — ICMP alcança? (5) <code>dig +short host</code> — DNS resolve? (6) <code>curl -v URL</code> — onde falha (DNS, TCP, TLS, HTTP)? (7) <code>tcpdump -i any port N -n</code> — pacotes chegam? (8) <code>iptables -L -n -v</code> — regra bloqueando? Siga a ordem — diagnóstico por camada.',
    tip: 'Sempre começar por ss -tlnp: se a porta não escuta, todo o resto é irrelevante. Layer-by-layer evita diagnóstico errado.',
  },
  {
    level: 'Senior',
    q: 'Como funciona um pipe Linux internamente?',
    a: '<strong>Pipe (|)</strong> conecta stdout de um processo ao stdin do próximo via buffer no kernel (64KB por padrão). Os dois processos rodam em paralelo, não sequencialmente. <strong>Internamente:</strong> pipe() syscall cria par de FDs (read end, write end). Escritor bloqueia quando buffer cheio; leitor bloqueia quando vazio. Se consumer morre, produtor recebe SIGPIPE e também morre (evita processar dados inúteis). <strong>set -o pipefail:</strong> propaga exit code do primeiro comando com falha no pipe — sem isso, <code>cmd_fail | grep ok</code> retorna 0 (sucesso de grep).',
    tip: 'set -o pipefail é crítico: sem ele, falha no meio do pipe é silenciosa — o exit code do último comando mascara o erro anterior.',
  },
  {
    level: 'Pleno',
    q: 'Quais são os estados de processo e o que é processo Zombie?',
    a: '<strong>Estados:</strong> R (Running/runnable), S (Sleeping — aguarda I/O ou evento), D (Uninterruptible sleep — aguarda I/O de disco, não pode ser morto), T (Stopped via SIGSTOP), Z (Zombie). <strong>Zombie (Z):</strong> processo terminou mas o pai ainda não leu o exit status via wait(). Ocupa uma linha em ps, sem recursos alocados, NÃO pode ser morto com kill. O problema é no processo pai (não faz wait). Solução: matar o processo pai para herdar e limpar os zombies. <strong>D state:</strong> muitos processos em D = problema de I/O — iostat -x 1 para investigar.',
    tip: 'Zombie não pode ser morto com kill — o problema é o processo pai. Muitos processos em D state = gargalo de I/O, não CPU.',
  },
  {
    level: 'Senior',
    q: 'O que é OOMKiller e como prevenir kills indesejados?',
    a: '<strong>OOMKiller</strong> é invocado pelo kernel quando memória esgota. Calcula oom_score (0–1000) para cada processo e mata o com maior score. <strong>Diagnóstico:</strong> <code>dmesg | grep -i "oom kill"</code> — mostra processo morto e memória usada. <strong>Prevenção:</strong> (1) Configurar memory limits em containers (K8s: resources.limits.memory). (2) <code>echo -1000 > /proc/PID/oom_score_adj</code> para proteger processo crítico. (3) Monitorar used_memory e alertar antes de 90% do limite. (4) Sem swap = OOM acontece mais cedo; com swap = degrada antes de matar.',
    tip: 'dmesg | grep -i "oom kill" é o primeiro diagnóstico para processos mortos inesperadamente — mostra o processo e quanto usava.',
  },
  {
    level: 'Pleno',
    q: 'Como usar find e xargs para operações em massa?',
    a: '<strong>find + xargs:</strong> <code>find /tmp -name "*.tmp" -mtime +7 -delete</code> (arquivos com >7 dias). <code>find . -name "*.sh" -exec chmod +x {} \\;</code> (chmod em todos). <code>find . -name "*.log" | xargs -P4 gzip</code> (comprimir em paralelo). <strong>Com espaços em paths:</strong> sempre use -print0 + xargs -0: <code>find . -name "*.txt" -print0 | xargs -0 wc -l</code>. <strong>-exec {} + vs -exec {} \\;:</strong> {} + passa múltiplos args por chamada (mais eficiente), \\; chama uma vez por arquivo.',
    tip: 'Sempre use -print0 | xargs -0 quando paths podem ter espaços — a versão sem -0 quebra silenciosamente com nomes de arquivo incomuns.',
  },
  {
    level: 'Senior',
    q: 'Como configurar SSH com hardening básico?',
    a: '<strong>Gerar chave:</strong> <code>ssh-keygen -t ed25519</code>. Copiar: <code>ssh-copy-id user@servidor</code>. <strong>Hardening em /etc/ssh/sshd_config:</strong> <code>PasswordAuthentication no</code>, <code>PermitRootLogin no</code>, <code>AllowUsers deploy</code>, <code>MaxAuthTries 3</code>. Após editar: <code>systemctl reload sshd</code>. <strong>NUNCA feche a sessão atual antes de testar em outra janela</strong> — pode se trancar para fora. authorized_keys: chmod 600, .ssh: chmod 700.',
    tip: 'Sempre teste a nova config SSH em uma segunda sessão antes de fechar a atual — erro aqui = servidor inacessível.',
  },
  {
    level: 'Pleno',
    q: 'Como usar awk e sed para processar logs?',
    a: '<strong>sed:</strong> <code>sed "s/ERROR/[ERROR]/g"</code> (substituição). <code>sed -n "100,200p"</code> (linhas 100–200). <code>sed "/DEBUG/d"</code> (deletar linhas). <strong>awk:</strong> <code>awk "{print $1, $4}"</code> (colunas). <code>awk "/ERROR/ {count++} END {print count}"</code> (contar). <code>awk "{sum += $10} END {print sum/1024/1024 \"MB\"}"</code> (somar bytes). <strong>Top 10 IPs:</strong> <code>awk "{print $1}" access.log | sort | uniq -c | sort -rn | head 10</code>. Para JSON: use jq.',
    tip: 'awk para colunas e agregações; sed para substituições e filtragem de linhas. Para JSON em shell, sempre jq — nunca grep/sed.',
  },
  {
    level: 'Senior',
    q: 'Como usar strace e lsof para debug avançado?',
    a: '<strong>strace:</strong> intercepta syscalls. <code>strace -p PID -c</code> (summary de syscalls por frequência). <code>strace -p PID -e trace=file</code> (só syscalls de arquivo). Revela: arquivos que o processo abre, onde está bloqueado, por que está lento. <strong>lsof:</strong> lista file descriptors abertos. <code>lsof -i :3000</code> (quem usa porta). <code>lsof -p PID</code> (tudo aberto por processo). <code>lsof | grep deleted</code> (espaço preso). <code>lsof -p PID -i</code> (conexões de rede). Combinação: strace revela o quê, lsof revela quem tem o quê aberto.',
    tip: 'strace -p PID -c sem -c pode gerar output enorme — sempre use -c para summary primeiro, depois filtre com -e trace=network ou -e trace=file.',
  },
  {
    level: 'Senior',
    q: 'Como escrever um shell script seguro? Quais são os padrões obrigatórios?',
    a: '<strong>Padrões:</strong> (1) <code>set -euo pipefail</code> no início: -e=sai em erro, -u=undefined var=erro, -o pipefail=falha no pipe propaga. (2) <strong>Aspas duplas sempre:</strong> <code>"$VAR"</code> — previne word splitting e glob expansion. (3) <code>readonly VAR=valor</code> para constantes. (4) <strong>Validação de input:</strong> <code>[[ -d "$SRC" ]] || { echo "error" >&2; exit 1; }</code>. (5) <code>[[ ]]</code> em vez de <code>[ ]</code> para testes. (6) Redirecionar erros para stderr: <code>>&2</code>.',
    tip: 'Em entrevista de SRE/infra: "set -euo pipefail + aspas duplas + validação de variáveis" é a resposta esperada para script bash seguro.',
  },
  {
    level: 'Senior',
    q: 'Como funciona o processo de boot Linux moderno?',
    a: '<strong>Sequência UEFI + systemd:</strong> (1) UEFI: POST, seleciona boot device. (2) GRUB: carrega kernel vmlinuz + initramfs. (3) Kernel: inicializa hardware, drivers, monta initramfs. (4) initramfs: monta filesystem raiz real (pode precisar de módulos de disco, LVM, crypto). (5) systemd (PID 1): inicia units em paralelo por dependências. (6) Target atingido: multi-user.target (servidor) ou graphical.target. <code>systemctl list-dependencies graphical.target</code> mostra a árvore. <code>systemd-analyze blame</code> mostra tempos de boot por unit.',
    tip: 'systemd-analyze blame identifica qual unit atrasa o boot. After=network.target garante que o serviço aguarda a rede antes de iniciar.',
  },
  {
    level: 'Pleno',
    q: 'Diferença entre hard link e symbolic link?',
    a: '<strong>Hard link (<code>ln source link</code>):</strong> outro nome para o mesmo inode. Mesmo conteúdo, mesmo inode number. Deletar source não apaga o arquivo — persiste até o último hard link ser removido. Só funciona no mesmo filesystem, não funciona para diretórios. <strong>Symbolic link (<code>ln -s source link</code>):</strong> arquivo que contém um caminho (string). Pode atravessar filesystems e apontar para diretórios. Se o alvo é deletado, symlink fica dangling. <strong>Uso prático:</strong> symlinks para versionar binários, hard links em backup incremental (rsync --link-dest).',
    tip: 'Hard link = mesmo inode (não pode ser apagado enquanto existir). Symlink = ponteiro de caminho (quebra se o alvo sumir).',
  },
  {
    level: 'Senior',
    q: 'Como agendar tarefas com cron e qual é a sintaxe?',
    a: '<strong>Sintaxe crontab:</strong> <code>minuto hora dia-mês mês dia-semana comando</code>. Campos: 0-59, 0-23, 1-31, 1-12, 0-7 (0=Dom). <code>*/15 * * * * cmd</code> = a cada 15min. <code>0 2 * * *</code> = 02:00 todo dia. <code>0 9 * * 1</code> = 09:00 toda segunda. <code>@reboot</code> = no boot. <strong>Sempre redirecionar saída:</strong> <code>cmd >> /var/log/myjob.log 2>&1</code> (cron não tem terminal). <code>crontab -e</code> para editar, <code>crontab -l</code> para listar. Para tasks mais robustas: systemd timers (tem restart, log no journald, sem CRON_TZ issue).',
    tip: 'Cron não tem terminal — sempre redirecionar stdout e stderr para arquivo. Preferir systemd timers em produção: têm log automático no journald.',
  },
]

// ── Dados: CheatSheet ─────────────────────────────────────────────────────────

const CHEATSHEET_HOOKS: HookItem[] = [
  { name: 'set -euo pipefail', sig: '#!/usr/bin/env bash\nset -euo pipefail', desc: 'Trio de segurança obrigatório: -e=sai em erro, -u=undefined var=erro, -o pipefail=propaga falha no pipe.' },
  { name: 'aspas duplas em variáveis', sig: 'tar -czf "$DEST/backup_${TS}.tar.gz" "$SRC"', desc: 'Sempre quote variáveis com aspas duplas — previne word splitting e glob. Nunca $VAR sem aspas em paths.' },
  { name: 'validação de entrada', sig: '[[ -d "$SRC" ]] || { echo "ERROR" >&2; exit 1; }', desc: 'Validar antes de usar. [[ ]] em vez de [ ]. Redirecionar erros para stderr (>&2). Sair com código não-zero.' },
  { name: 'readonly e constantes', sig: 'readonly SRC="${1:-/default}"\nreadonly TS=$(date +%Y%m%d)', desc: 'Constantes imutáveis com readonly. ${1:-default} para parâmetro com fallback.' },
  { name: 'find + mtime', sig: 'find "$DIR" -name "*.log" -mtime +7 -delete', desc: 'Deletar arquivos com mais de 7 dias. -print primeiro para verificar. -exec {} + mais eficiente que \\;.' },
  { name: 'heredoc em scripts', sig: 'cat > /etc/systemd/system/app.service << EOF\n[Service]\nExecStart=...\nEOF', desc: 'Heredoc para criar arquivos multi-linha em scripts. Funciona com sudo tee para arquivos root.' },
  { name: 'trap para cleanup', sig: 'TMP=$(mktemp)\ntrap "rm -f $TMP" EXIT\n# ... uso do $TMP', desc: 'trap EXIT garante limpeza de arquivos temporários mesmo em caso de erro. Padrão seguro para mktemp.' },
  { name: 'logging com timestamp', sig: 'log() { echo "[$(date "+%Y-%m-%d %H:%M:%S")] $*" >> "$LOG"; }', desc: 'Função de log com timestamp. Redirecionar para arquivo + stdout com tee -a.' },
]

const CHEATSHEET_RULES: RuleItem[] = [
  { ok: false, t: 'rm -rf "$DIR/" sem validar que $DIR está definido — pode apagar tudo' },
  { ok: false, t: 'Script sem set -e — falha silenciosa, danos compostos' },
  { ok: false, t: 'chmod 777 — use o mínimo necessário (755/644/600)' },
  { ok: false, t: 'Rodar serviço como root — bug vira RCE total' },
  { ok: false, t: 'kill -9 antes de tentar SIGTERM — sem cleanup, possível corrupção' },
  { ok: false, t: 'Variável sem aspas: cp $SRC $DST — quebra com espaços no path' },
  { ok: true,  t: 'set -euo pipefail + aspas duplas + validação = script seguro' },
  { ok: true,  t: 'SIGTERM → 30s wait → SIGKILL = protocolo correto de shutdown' },
  { ok: true,  t: 'ss -tlnp em vez de netstat (deprecated) para portas escutando' },
  { ok: true,  t: 'vmstat 1 como primeiro diagnóstico: CPU, memória, swap, wa' },
]

// ── Dados: Mnemônicos ─────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'EUP — set -euo pipefail',
    trick: 'Erros Undefined Pipefail',
    expansion: [
      ['E — set -e', 'Exit on error: script para na primeira falha (sem -e, continua silenciosamente)'],
      ['U — set -u', 'Undefined: variável não declarada = erro (previne rm -rf "$VAZIA/")'],
      ['P — set -o pipefail', 'Pipefail: propaga falha de qualquer parte do pipe, não só do último comando'],
    ],
    explanation: 'Os três flags que transformam um script frágil em seguro para produção.',
    example: '#!/usr/bin/env bash\nset -euo pipefail\nSRC=${1:-}\n[[ -n "$SRC" ]] || { echo "SRC obrigatório" >&2; exit 1; }\ntar -czf backup.tgz "$SRC"',
    why: 'Em entrevista de SRE/infra, "como você escreve script bash seguro?" tem como resposta esperada: set -euo pipefail + aspas duplas + validação.',
  },
  {
    label: 'Exit Codes de containers mortos',
    trick: '137=OOM, 139=SIGSEGV, 143=SIGTERM, 1=app',
    expansion: [
      ['137 = 128+9', 'SIGKILL: OOMKilled pelo kernel. dmesg | grep OOM para confirmar.'],
      ['139 = 128+11', 'SIGSEGV: segmentation fault — bug de memória, acesso inválido'],
      ['143 = 128+15', 'SIGTERM: container foi parado graciosamente (deploy, scale down)'],
      ['1 = exit(1)', 'Erro da aplicação — verificar logs para mensagem de erro'],
      ['0 = sucesso', 'Processo terminou sem erro (voluntariamente)'],
    ],
    explanation: 'Exit codes de processo terminado por sinal = 128 + número do sinal. Os mais importantes para containers.',
    example: 'docker ps -a → Exit 137 → OOMKilled → kubectl top pod → aumentar resources.limits.memory.',
    why: 'Exit code é o diagnóstico mais rápido de um container morto. Sem precisar de logs — o número já diz o que aconteceu.',
  },
  {
    label: 'USE Method — triage de performance',
    trick: 'Usa Saturação Erros — para cada recurso',
    expansion: [
      ['U — Utilization', 'Quanto % do recurso está sendo usado: CPU%, bytes/s de rede, iops de disco'],
      ['S — Saturation', 'Fila de espera: run queue (vmstat r), await de I/O, swap in/out, retransmits'],
      ['E — Errors', 'Erros do hardware/SO: dmesg | grep error, OOM, disk I/O errors'],
    ],
    explanation: 'Para cada recurso (CPU, memória, disco, rede), checar U→S→E antes de ir para ferramentas específicas.',
    example: 'Produção lenta: vmstat 1 → wa=60 (I/O saturation) → iostat -x 1 → await=200ms, util=98% → não é CPU, é disco saturado.',
    why: 'Sem método, você pode gastar 1h em perf top quando o problema é disco. USE method garante diagnóstico correto antes de agir.',
  },
]

// ── Dados: Anti-patterns ──────────────────────────────────────────────────────

const ANTIPATTERNS: AntiPatternItem[] = [
  {
    title: 'rm -rf com variável vazia',
    badDesc: 'Deletar tudo por não validar variável antes do rm -rf',
    badCode: [
      { t: '#!/usr/bin/env bash\n' },
      { t: '# SEM set -u — variável pode ser vazia\n' },
      { t: 'DIR=' },
      { t: '/tmp/build', c: '#94a3b8' },
      { t: '\n' },
      { t: 'rm -rf ' },
      { t: '"$DIR/"', c: '#ef4444' },
      { t: '  # Se DIR="" → rm -rf "/" → apaga tudo!\n' },
      { t: '# Exit code: 0 (sucesso horrível)' },
    ],
    goodDesc: 'Usar set -u + validação explícita antes de rm -rf',
    goodCode: [
      { t: '#!/usr/bin/env bash\n' },
      { t: 'set -euo pipefail\n\n' },
      { t: 'readonly DIR=' },
      { t: '"${1:-}"', c: '#4ade80' },
      { t: '\n' },
      { t: '[[ -n "$DIR" ]] || ' },
      { t: '{ echo "ERROR: DIR obrigatório" >&2; exit 1; }', c: '#4ade80' },
      { t: '\n' },
      { t: '[[ -d "$DIR" ]] || ' },
      { t: '{ echo "ERROR: $DIR não existe" >&2; exit 1; }', c: '#4ade80' },
      { t: '\n' },
      { t: 'rm -rf "$DIR/"  # Seguro: DIR validado e não-vazio' },
    ],
    why: 'rm -rf "$VAR_VAZIA/" apaga o diretório atual ou a raiz. set -u + validação explícita previne o desastre.',
  },
  {
    title: 'Script sem set -e (falha silenciosa)',
    badDesc: 'Comando falha, script continua, danos compostos',
    badCode: [
      { t: '#!/usr/bin/env bash\n' },
      { t: '# Sem set -e\n' },
      { t: 'git pull origin main     # Falha (conflito)\n' },
      { t: '# NÃO para aqui! Continua:\n' },
      { t: 'npm install              # Instala com código desatualizado\n' },
      { t: 'npm run build            # Builda versão errada\n' },
      { t: 'systemctl restart app    # Reinicia com build errado em prod\n' },
      { t: '# Incidente silencioso — o script reportou sucesso (exit 0)' },
    ],
    goodDesc: 'set -euo pipefail para no primeiro erro',
    goodCode: [
      { t: '#!/usr/bin/env bash\n' },
      { t: 'set -euo pipefail\n\n' },
      { t: 'git pull origin main\n' },
      { t: '# ← git falha → script para AQUI com exit != 0\n' },
      { t: '# npm install não executa\n' },
      { t: '# Script relata falha para o CI/CD\n\n' },
      { t: '# Alertas disparam, ninguém faz deploy com código errado' },
    ],
    why: 'Sem set -e, erros passam silenciosamente e o script continua causando danos compostos. set -e faz o script parar no primeiro sinal de problema.',
  },
  {
    title: 'chmod 777 — permissão preguiçosa',
    badDesc: 'chmod 777 como "solução rápida" que vira buraco de segurança',
    badCode: [
      { t: '# App não consegue escrever no diretório\n' },
      { t: '# "Solução rápida":\n' },
      { t: 'chmod ' },
      { t: '777', c: '#ef4444' },
      { t: ' /var/app/uploads\n' },
      { t: '# Qualquer processo no servidor pode escrever aqui:\n' },
      { t: '# - Script malicioso pode sobrescrever qualquer arquivo\n' },
      { t: '# - Upload de arquivo .php para RCE\n' },
      { t: '# - Log injection, path traversal' },
    ],
    goodDesc: 'Conceder o mínimo necessário: owner correto + permissão mínima',
    goodCode: [
      { t: '# Identifique o usuário que precisa escrever\n' },
      { t: 'sudo chown ' },
      { t: 'www-data:www-data', c: '#4ade80' },
      { t: ' /var/app/uploads\n' },
      { t: '# Owner escreve, grupo lê, outros nada\n' },
      { t: 'sudo chmod ' },
      { t: '750', c: '#4ade80' },
      { t: ' /var/app/uploads\n' },
      { t: '# Se precisar de grupo: adduser app www-data\n' },
      { t: '# Regra: pense no mínimo necessário, não no máximo fácil' },
    ],
    why: '777 dá escrita para todos os processos no sistema. Em servidor web, qualquer usuário pode sobrescrever arquivos ou fazer upload de código malicioso.',
  },
  {
    title: 'kill -9 sem tentar SIGTERM antes',
    badDesc: 'Matar processo com SIGKILL sem chance de cleanup',
    badCode: [
      { t: '# App está "travada" (na verdade processando algo pesado)\n' },
      { t: 'kill ' },
      { t: '-9', c: '#ef4444' },
      { t: ' $(pgrep node)\n' },
      { t: '# Consequências:\n' },
      { t: '# - Requests em andamento dropados\n' },
      { t: '# - Buffer de escrita não flushed (log corrompido)\n' },
      { t: '# - Arquivos temporários não deletados\n' },
      { t: '# - Conexões de banco não fechadas (hold locks)' },
    ],
    goodDesc: 'SIGTERM com timeout, SIGKILL apenas como último recurso',
    goodCode: [
      { t: 'PID=$(pgrep node)\n\n' },
      { t: '# 1. Pedido gracioso\n' },
      { t: 'kill ' },
      { t: '-TERM', c: '#4ade80' },
      { t: ' "$PID"\n\n' },
      { t: '# 2. Aguardar até 30s\n' },
      { t: 'for i in $(seq 1 30); do\n' },
      { t: '    ps -p "$PID" &>/dev/null || break\n' },
      { t: '    sleep 1\n' },
      { t: 'done\n\n' },
      { t: '# 3. SIGKILL só se ainda vivo\n' },
      { t: 'ps -p "$PID" &>/dev/null && kill ' },
      { t: '-KILL', c: '#f59e0b' },
      { t: ' "$PID"' },
    ],
    why: 'SIGKILL não dá oportunidade de cleanup. SIGTERM permite graceful shutdown — finalizar requests, flush de buffers, fechar conexões, apagar temporários.',
  },
  {
    title: 'Rodar serviço como root',
    badDesc: 'Daemon rodando como root — qualquer exploit = RCE total',
    badCode: [
      { t: '# Dockerfile ou unit file rodando como root (default)\n' },
      { t: 'FROM node:18\n' },
      { t: 'COPY . .\n' },
      { t: '# Sem USER — roda como root!\n' },
      { t: 'CMD ["node", "index.js"]\n\n' },
      { t: '# Se há RCE no app: atacante tem root no container\n' },
      { t: '# Container escape + root no host = catástrofe' },
    ],
    goodDesc: 'Criar usuário dedicado e rodar como usuário não-privilegiado',
    goodCode: [
      { t: 'FROM node:18-alpine\n' },
      { t: '# Criar usuário dedicado\n' },
      { t: 'RUN addgroup -S app && adduser -S app -G app\n\n' },
      { t: 'WORKDIR /app\n' },
      { t: 'COPY --chown=app:app . .\n' },
      { t: 'RUN npm ci --only=production\n\n' },
      { t: '# Trocar para usuário não-privilegiado\n' },
      { t: 'USER ' },
      { t: 'app', c: '#4ade80' },
      { t: '\nCMD ["node", "index.js"]\n\n' },
      { t: '# systemd unit: User=meuapp (não root)' },
    ],
    why: 'Processo como root: qualquer bug de segurança = RCE com root no host. Usuário dedicado + Least Privilege limita o raio de blast de um exploit.',
  },
]

// ── Dados: Quick Reference ────────────────────────────────────────────────────

const QUICK_REF_COLUMNS: QuickRefColumn[] = [
  {
    sections: [
      {
        title: 'Processos',
        entries: [
          { key: 'ps aux | grep nome', value: 'Listar processos com CPU%, MEM%' },
          { key: 'top -H -p PID', value: 'Threads de um processo específico' },
          { key: 'kill -TERM PID', value: 'Graceful shutdown (sinal 15)' },
          { key: 'kill -KILL PID', value: 'Força — último recurso (sinal 9)', badge: 'cuidado', badgeColor: '#ef4444' },
          { key: 'pgrep -f nome', value: 'Encontrar PID por nome' },
          { key: 'dmesg | grep OOM', value: 'Verificar OOMKills recentes' },
        ],
      },
      {
        title: 'Exit Codes',
        entries: [
          { key: '137', value: 'OOMKilled (128+9 SIGKILL)', badge: 'mem', badgeColor: '#ef4444' },
          { key: '139', value: 'Segmentation fault (128+11)', badge: 'bug', badgeColor: '#ef4444' },
          { key: '143', value: 'SIGTERM — parado graciosamente', badge: 'ok', badgeColor: '#4ade80' },
          { key: '1', value: 'Erro da aplicação (ver logs)' },
          { key: '0', value: 'Sucesso' },
        ],
      },
      {
        title: 'systemd',
        entries: [
          { key: 'systemctl status svc', value: 'Estado + últimas linhas de log' },
          { key: 'systemctl start/stop/restart', value: 'Controlar serviço' },
          { key: 'systemctl enable --now svc', value: 'Habilitar + iniciar agora' },
          { key: 'systemctl daemon-reload', value: 'Recarregar unit files' },
          { key: 'journalctl -u svc -f', value: 'Log em tempo real' },
          { key: 'journalctl -u svc -n 100', value: 'Últimas 100 linhas' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Rede',
        entries: [
          { key: 'ss -tlnp', value: 'Portas TCP escutando + processo', badge: 'essencial', badgeColor: '#38bdf8' },
          { key: 'ip a', value: 'Interfaces e IPs' },
          { key: 'ip r', value: 'Tabela de rotas' },
          { key: 'dig +short host', value: 'DNS lookup rápido' },
          { key: 'curl -v URL', value: 'Debug HTTP (DNS, TCP, TLS, headers)' },
          { key: 'tcpdump -i any port N -n', value: 'Captura de pacotes' },
        ],
      },
      {
        title: 'Disco e Filesystem',
        entries: [
          { key: 'df -h', value: 'Uso de disco por filesystem' },
          { key: 'df -i', value: 'Uso de inodes (disco "cheio" sem espaço)' },
          { key: 'du -sh /var/log/*', value: 'Tamanho de diretórios' },
          { key: 'lsof | grep deleted', value: 'Arquivos deletados mas abertos' },
          { key: 'find / -size +100M -type f', value: 'Arquivos grandes' },
        ],
      },
      {
        title: 'Performance (USE Method)',
        entries: [
          { key: 'vmstat 1', value: 'CPU (us/sy/wa), mem, swap, run queue', badge: 'início', badgeColor: '#f97316' },
          { key: 'iostat -x 1', value: 'I/O: util%, await por disco' },
          { key: 'sar -n DEV 1', value: 'Bytes/s por interface de rede' },
          { key: 'free -m', value: 'Memória: used, free, available' },
          { key: 'iotop', value: 'I/O por processo (requer root)' },
          { key: 'perf top -p PID', value: 'Hot code paths (CPU profiling)' },
        ],
      },
    ],
  },
]

// ── PDF Builders ──────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  'quick-ref': () =>
    buildQuickRefPdf({
      columns: QUICK_REF_COLUMNS,
      skillName: 'Linux',
      accentColor: C,
      stackLabel: 'DevOps / Infraestrutura',
      tagline: 'Diagnóstico de produção — processos, rede, disco, performance, systemd',
    }),
  qa: () =>
    buildQAReviewPdf({
      qa: QAS,
      accentColor: C,
      skillName: 'Linux',
      stackLabel: 'DevOps / Infraestrutura',
    }),
  cheatsheet: () =>
    buildCheatsheetPdf({
      skillName: 'Linux',
      accentColor: C,
      stackLabel: 'DevOps / Infraestrutura',
      sections: {
        hooks: CHEATSHEET_HOOKS,
        depRows: [],
        rules: CHEATSHEET_RULES,
        performanceTips: [
          'vmstat 1 como primeiro olhar: CPU (us/sy/wa), memória (si/so), run queue',
          'wa alto no vmstat = I/O bound — investigar com iostat -x 1, não perf top',
          'df -h + df -i + lsof | grep deleted = diagnóstico completo de "disco cheio"',
          'ss -tlnp em vez de netstat (deprecated) para portas escutando',
          'set -euo pipefail no início de todo script bash — sem exceções',
        ],
        patterns: [],
        mentalModels: [
          'USE Method: Utilization → Saturation → Errors para cada recurso antes de ferramentas específicas',
          'SIGTERM (gracioso, capturável) → timeout → SIGKILL (imediato, não capturável)',
          'Exit code 128+N = terminado por sinal N. 137=OOM, 139=SIGSEGV, 143=SIGTERM',
        ],
      },
    }),
  mnemonics: () =>
    buildMnemonicsPdf({
      mnemonics: MNEMONICS,
      accentColor: C,
      skillName: 'Linux',
      stackLabel: 'DevOps / Infraestrutura',
    }),
  antipatterns: () =>
    buildAntipatternsPdf({
      antipatterns: ANTIPATTERNS,
      accentColor: C,
      skillName: 'Linux',
      stackLabel: 'DevOps / Infraestrutura',
    }),
}

// ── Componente ────────────────────────────────────────────────────────────────

export default function LinuxPdfs() {
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
