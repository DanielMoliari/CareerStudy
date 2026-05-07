import type { SkillContent } from '@/types'

const linux: SkillContent = {
  tagline: "SO base de toda infra moderna — fundamento que separa dev de senior dev.",
  why: "Linux é onde tudo roda. Senior precisa debugar produção via SSH (logs, processos, rede, disco), escrever shell decente, entender permissões, systemd, e diagnosticar performance (CPU, memória, I/O, rede). Sem isso, você depende de infra quando o prod cai às 3h.",
  summary: "Linux é um kernel + userland (GNU). Distribuições (Ubuntu/Debian, Alpine, RHEL/Fedora, Arch) empacotam diferente mas o core é o mesmo. Áreas que senior precisa dominar:\n\n- **Processos e signals**: ps, top, htop, kill, SIGTERM vs SIGKILL, graceful shutdown\n- **Filesystem**: FHS (Filesystem Hierarchy Standard), permissões rwx, owner/group, sudo, inodes\n- **Networking**: ip, ss, netstat, tcpdump, iptables, dig, curl\n- **Logs**: journalctl, /var/log, syslog\n- **Package management**: apt, apk, dnf/yum\n- **Service management**: systemd — systemctl, journalctl, unit files\n- **Shell scripting**: bash, pipes, redirect, variáveis, set -euo pipefail\n- **Performance triage**: USE method (Brendan Gregg), vmstat, iostat, sar, perf, iotop",

  keypoints: [
    { title: "Permissões e ownership", body: "rwx para owner/group/other. chmod 755 = rwxr-xr-x. chown user:group arquivo. SUID (4) executa como owner, SGID (2) executa como grupo, sticky bit (1) em diretórios impede deleção por outros. ACL via setfacl para controle fino." },
    { title: "Processos e signals", body: "ps aux, top, htop, pgrep/pkill. kill -TERM (15) pede término gracioso — app pode capturar e limpar. kill -KILL (9) mata imediatamente sem cleanup. SIGINT (2) = Ctrl+C. SIGHUP (1) = reload config sem restart. Container deve tratar SIGTERM para graceful shutdown com timeout." },
    { title: "systemd e unit files", body: "systemctl start/stop/restart/status/enable/disable serviço. journalctl -u serviço -f para log live. -n 100 para últimas 100 linhas. Unit files em /etc/systemd/system/ — Restart=on-failure, ExecStart, User, EnvironmentFile. Recarregar config: systemctl daemon-reload." },
    { title: "Networking essencial", body: "ss -tlnp: sockets TCP escutando com processo. ip a: interfaces e IPs. ip r: tabela de rotas. dig +short host: DNS lookup. curl -v URL: debug HTTP incluindo headers e TLS. tcpdump -i any port 80 -w arquivo.pcap: capturar pacotes. nmap -sV host: scan de portas/serviços." },
    { title: "Filesystem e inodes", body: "df -h: uso de disco por filesystem. df -i: uso de inodes (arquivo 'disco cheio' mas df normal). du -sh dir: tamanho de diretório. lsof | grep deleted: arquivos deletados mas ainda abertos (processo segurando). find / -name '*.log' -size +100M: localizar arquivos grandes. ln -s source link: symlink." },
    { title: "Performance — USE method", body: "Para cada recurso (CPU, memória, disco, rede): Utilization (quanto está sendo usado), Saturation (fila/espera), Errors. top/htop (CPU%), vmstat 1 (cpu: us/sy/wa, memoria), iostat -x 1 (await, util), sar -n DEV 1 (bytes/s por interface), iotop (I/O por processo), perf top (hot code paths)." },
    { title: "Shell scripting seguro", body: "set -euo pipefail no início de todo script: -e sai em erro, -u trata variável undefined como erro, -o pipefail propaga falha em pipe. Aspas duplas sempre: \"$VAR\" — previne word splitting. [[ ]] em vez de [ ] para testes. readonly para constantes." },
    { title: "Usuários e sudo", body: "adduser, usermod -aG grupo, id user. /etc/passwd (contas), /etc/shadow (hashes de senha), /etc/group. sudo -u user comando: executar como outro usuário. visudo para editar /etc/sudoers. Service accounts (UIDs < 1000) para daemons — nunca rodar serviço como root." },
  ],

  gotchas: [
    "rm -rf \"$DIR/\" com DIR vazio — apaga raiz ou cwd. Sempre set -u em script e validar que variável está definida antes.",
    "Esquecer set -e — comando falha silenciosamente, script continua, danos compostos. Padrão senior: set -euo pipefail.",
    "Permissão 777 — preguiça vira buraco de segurança. Pense no mínimo necessário: 755 para dir públicos, 644 para arquivos lidos, 600 para chaves privadas.",
    "Rodar serviço como root — qualquer exploit ou bug vira RCE total. Use usuário dedicado por serviço.",
    "Disco 'cheio' mas df -h mostra espaço — inodes esgotados (df -i) ou processo segurando arquivo deletado (lsof | grep deleted). Dois diagnósticos completamente diferentes.",
    "kill -9 sem tentar SIGTERM antes — mata processo sem flush de buffers, possível corrupção de dados, sem graceful shutdown. Sempre SIGTERM com timeout, SIGKILL como último recurso.",
  ],

  interview: [
    {
      q: "Container não sobe em prod — o que você verifica?",
      a: "<p>Roteiro sistemático por camadas:</p><ul><li><strong>Status e exit code:</strong> docker ps -a / kubectl get pod. Exit 137 = OOMKilled (sem memória), 139 = segfault, 143 = SIGTERM (graceful), 1 = erro de aplicação</li><li><strong>Logs da aplicação:</strong> docker logs &lt;id&gt; --tail 100 / kubectl logs &lt;pod&gt; --previous</li><li><strong>Recursos do host:</strong> df -h (disco), free -m (memória), top (CPU)</li><li><strong>Rede:</strong> curl localhost:&lt;porta&gt;, ss -tlnp para ver se porta escuta</li><li><strong>Permissão:</strong> container rodando como user que não tem acesso ao volume montado?</li><li><strong>Describe (K8s):</strong> kubectl describe pod — eventos: image pull failure, node sem recursos, probe failing</li></ul>",
      level: "pleno",
      tip: "Exit code é o diagnóstico mais rápido — memorize 137 (OOM), 139 (SIGSEGV), 143 (SIGTERM), 1 (app error).",
    },
    {
      q: "CPU em 100% em produção — como diagnostica?",
      a: "<p>Fluxo estruturado:</p><ol><li><strong>top ou htop</strong> — qual processo está consumindo. Ordenar por %CPU (P em top).</li><li><strong>top -H -p PID</strong> — qual thread dentro do processo. Thread dump se for JVM/Go.</li><li><strong>vmstat 1</strong> — coluna 'us' alto = userspace, 'sy' alto = muitas syscalls, 'wa' alto = I/O bound (não é CPU real).</li><li><strong>perf top -p PID</strong> — hot code paths. Qual função consome mais cycles.</li><li><strong>strace -p PID -c</strong> — syscalls por frequência. Confirma se é CPU ou I/O.</li></ol><p>Armadilha: wa alto parece CPU mas é I/O — solução completamente diferente (disco, não CPU).</p>",
      level: "pleno",
      tip: "Distinguish between us (userspace) e wa (wait I/O) antes de agir — diagnóstico errado = solução errada.",
    },
    {
      q: "O que é SIGTERM vs SIGKILL e quando usar cada um?",
      a: "<p><strong>SIGTERM (15):</strong> sinal 'por favor termine'. O processo pode capturar, finalizar conexões, fazer flush de buffers, escrever estado, e então sair. É o sinal correto para graceful shutdown. Docker/Kubernetes enviam SIGTERM quando param um container.</p><p><strong>SIGKILL (9):</strong> o kernel mata o processo imediatamente. Não pode ser capturado nem ignorado. Não há oportunidade para cleanup — dados em buffer podem ser perdidos, arquivos temporários ficam, conexões abertas dropam.</p><p><strong>Protocolo correto:</strong> SIGTERM → aguardar timeout (ex: 30s) → SIGKILL se ainda vivo. Em container: <code>STOPSIGNAL SIGTERM</code> no Dockerfile + <code>terminationGracePeriodSeconds</code> no K8s.</p>",
      level: "pleno",
      tip: "Todo serviço em produção DEVE ter handler de SIGTERM para graceful shutdown — sem isso, a aplicação perde requests em andamento no deploy.",
    },
    {
      q: "Como funciona o sistema de permissões do Linux?",
      a: "<p>Cada arquivo/diretório tem: <strong>owner</strong> (usuário), <strong>group</strong>, e permissões para <strong>owner / group / others</strong>.</p><p><strong>Permissões:</strong> r (4) = ler, w (2) = escrever, x (1) = executar (em dir: entrar). chmod 755 = rwxr-xr-x. chmod 600 para chaves privadas (só owner lê).</p><p><strong>Em diretórios</strong>: x = direito de entrar (cd). r = listar (ls). w = criar/deletar arquivos. Pode não conseguir listar mas conseguir acessar arquivo por path se souber o nome.</p><p><strong>Bits especiais:</strong> SUID (s em owner-x) = executa com permissões do owner. SGID em dir = novos arquivos herdam o grupo. Sticky bit em /tmp = só dono pode deletar.</p>",
      level: "pleno",
    },
    {
      q: "Explique o FHS (Filesystem Hierarchy Standard).",
      a: "<p>Organização padrão de diretórios no Linux:</p><ul><li><code>/bin, /sbin</code> → binários essenciais (ou links para /usr/bin em distros modernas)</li><li><code>/etc</code> → configurações do sistema</li><li><code>/var</code> → dados variáveis: logs (/var/log), spool, cache</li><li><code>/tmp</code> → temporários (limpos no boot, sticky bit)</li><li><code>/proc</code> → pseudo-filesystem: info de processos, kernel params (/proc/sys)</li><li><code>/sys</code> → interface com hardware via kernel</li><li><code>/home</code> → home dos usuários. <code>/root</code> → home do root</li><li><code>/opt</code> → software de terceiros autocontido</li><li><code>/usr</code> → binários, libs e man pages do sistema</li></ul><p>Em containers Alpine: /bin/sh é busybox. Muitos utilitários GNU não estão presentes.</p>",
      level: "pleno",
    },
    {
      q: "Como depurar problemas de rede em Linux?",
      a: "<p>Sequência de debug de rede:</p><ol><li><strong>ss -tlnp</strong> — é a porta escutando? Em qual interface? (0.0.0.0 vs 127.0.0.1)</li><li><strong>ip a</strong> — quais interfaces e IPs configurados</li><li><strong>ip r</strong> — rota padrão (gateway). Está correto?</li><li><strong>ping host</strong> — conectividade IP (ICMP)</li><li><strong>dig +short host</strong> — resolução DNS. dig @8.8.8.8 para testar DNS alternativo</li><li><strong>curl -v URL</strong> — debug completo: DNS, TCP, TLS, HTTP. Mostra onde falha</li><li><strong>tcpdump -i any port &lt;N&gt; -n</strong> — captura pacotes raw. Para quando curl não está suficiente</li><li><strong>iptables -L -n -v</strong> — alguma regra bloqueando?</li></ol>",
      level: "pleno",
      tip: "ss é moderno e mais rápido que netstat (deprecated). Memorize ss -tlnp para debug rápido de portas.",
    },
    {
      q: "O que é systemd e como gerenciar serviços?",
      a: "<p>systemd é o init system (PID 1) de distros modernas. Gerencia serviços, sockets, mounts e timers com paralelismo na inicialização.</p><p><strong>Comandos essenciais:</strong></p><ul><li><code>systemctl status svc</code> — estado + últimos logs</li><li><code>systemctl start/stop/restart/reload svc</code></li><li><code>systemctl enable svc</code> — inicia no boot</li><li><code>journalctl -u svc -f</code> — log em tempo real</li><li><code>journalctl -u svc -n 100 --since '1h ago'</code></li></ul><p><strong>Unit file mínimo</strong> em /etc/systemd/system/meuapp.service:</p><pre>[Unit]\nDescription=Meu App\n[Service]\nUser=meuapp\nExecStart=/opt/meuapp/bin\nRestart=on-failure\n[Install]\nWantedBy=multi-user.target</pre><p>Após criar: <code>systemctl daemon-reload && systemctl enable --now meuapp</code></p>",
      level: "pleno",
    },
    {
      q: "Como fazer triage de performance com o USE method?",
      a: "<p>Brendan Gregg's USE method: para cada recurso, checar <strong>Utilization</strong>, <strong>Saturation</strong>, <strong>Errors</strong>.</p><ul><li><strong>CPU:</strong> top (utilization %us+%sy), vmstat 1 (run queue = saturation), dmesg (errors)</li><li><strong>Memória:</strong> free -m (utilization), vmstat (si/so = swap = saturation), dmesg | grep OOM</li><li><strong>Disco I/O:</strong> iostat -x 1 (util%, await = saturation), dmesg (erros de hardware)</li><li><strong>Rede:</strong> sar -n DEV 1 (rxkB/s txkB/s), ss -s (retransmits = saturation)</li></ul><p><strong>Sequência rápida:</strong> vmstat 1 → iostat -x 1 → sar -n DEV 1 → verifica se o problema é CPU (us/sy), I/O (wa), memória (si/so) ou rede. Só depois vai para ferramentas específicas.</p>",
      level: "senior",
      tip: "USE method evita pular para perf top antes de saber se o problema é CPU, memória ou I/O — diagnóstico primeiro, profiling depois.",
    },
    {
      q: "Escreva um shell script seguro para fazer backup com rotação.",
      a: "<pre>#!/usr/bin/env bash\nset -euo pipefail\n\n# Constantes\nreadonly SRC=/var/www/app\nreadonly DEST=/backups\nreadonly KEEP=7  # dias de retenção\nreadonly TS=$(date +%Y%m%d_%H%M%S)\n\n# Validação\n[[ -d \"$SRC\" ]] || { echo \"ERROR: $SRC não existe\" >&2; exit 1; }\nmkdir -p \"$DEST\"\n\n# Backup\ntar -czf \"$DEST/backup_$TS.tar.gz\" \"$SRC\"\necho \"Backup criado: $DEST/backup_$TS.tar.gz\"\n\n# Rotação: manter só últimos KEEP arquivos\nfind \"$DEST\" -name 'backup_*.tar.gz' \\\n  -mtime +\"$KEEP\" -delete\necho \"Rotação: removidos backups com mais de $KEEP dias\"</pre><p>Pontos de segurança: set -euo pipefail, readonly, aspas duplas em paths, validação de diretório, stderr para erros.</p>",
      level: "senior",
      tip: "Em entrevista: mencione set -euo pipefail, aspas duplas e validação de variáveis — são os 3 itens mais esquecidos.",
    },
    {
      q: "Como funcionam inodes e por que disco pode estar 'cheio' com espaço livre?",
      a: "<p>Um <strong>inode</strong> armazena metadados de um arquivo (permissões, timestamps, tamanho, blocos de dados) mas não o nome. O nome é mapeado para o inode pelo diretório pai.</p><p><strong>Dois tipos de 'disco cheio':</strong></p><ul><li><strong>Blocos esgotados:</strong> df -h mostra 100% em algum filesystem. Solução: deletar arquivos ou expandir disco.</li><li><strong>Inodes esgotados:</strong> df -h mostra espaço disponível, mas df -i mostra Use% = 100%. Acontece com muitos arquivos pequenos (ex: diretório de sessões, node_modules). Solução: deletar arquivos ou usar filesystem com dynamic inodes.</li></ul><p><strong>Terceiro caso:</strong> arquivo deletado mas processo ainda aberto → o espaço não é liberado. lsof | grep deleted mostra o culpado. Reiniciar o processo libera o espaço.</p>",
      level: "senior",
    },
    {
      q: "O que é um pipe no Linux e como funciona internamente?",
      a: "<p>Pipe (|) conecta o stdout de um processo ao stdin do próximo via um buffer no kernel. Os dois processos rodam em paralelo — não sequencialmente.</p><p><strong>Internamente:</strong> pipe() syscall cria um par de file descriptors (read end, write end) no kernel buffer (64KB por default no Linux moderno). Processo da esquerda escreve no write end, processo da direita lê do read end. Quando o buffer está cheio, o escritor bloqueia. Quando está vazio, o leitor bloqueia.</p><p><strong>Implicação:</strong> em <code>cmd1 | cmd2</code>, se cmd2 morrer, cmd1 recebe SIGPIPE e (por default) também morre — não processa dados inúteis.</p><p><code>set -o pipefail</code> em scripts: propaga o exit code do primeiro comando com falha no pipe, não apenas o último.</p>",
      level: "senior",
    },
    {
      q: "Como usar find e xargs para operações em massa?",
      a: "<pre># Encontrar logs maiores que 100MB\nfind /var/log -name '*.log' -size +100M\n\n# Deletar arquivos .tmp com mais de 7 dias (seguro com -print para verificar primeiro)\nfind /tmp -name '*.tmp' -mtime +7 -print\nfind /tmp -name '*.tmp' -mtime +7 -delete\n\n# chmod em todos os arquivos .sh\nfind . -name '*.sh' -type f -exec chmod +x {} \\;\n\n# xargs com parallel para operações em múltiplos arquivos\nfind . -name '*.log' | xargs -P4 -I{} gzip {}\n\n# find com -0 e xargs -0 para paths com espaços\nfind . -name '*.txt' -print0 | xargs -0 wc -l</pre><p>Use -print0 / -0 sempre que paths podem ter espaços. -exec {} + é mais eficiente que -exec {} \\; (múltiplos args por chamada).</p>",
      level: "pleno",
    },
    {
      q: "Quais são os estados de um processo e o que significa Z (zombie)?",
      a: "<p><strong>Estados de processo:</strong></p><ul><li><strong>R (Running):</strong> em execução ou na fila de execução</li><li><strong>S (Sleeping):</strong> dormindo aguardando evento (I/O, signal)</li><li><strong>D (Uninterruptible sleep):</strong> aguardando I/O de disco. Não pode ser morto. CPU não pode interromper. Muitos processos D = problema de I/O.</li><li><strong>T (Stopped):</strong> pausado via SIGSTOP ou Ctrl+Z. Retoma com SIGCONT (fg/bg)</li><li><strong>Z (Zombie):</strong> processo terminou mas o pai ainda não leu o exit status via wait(). Linha em ps, sem recursos alocados, não pode ser morto. Problema é no processo pai (não faz wait). Mata o pai para limpar.</li></ul>",
      level: "senior",
    },
    {
      q: "O que é OOMKiller e como prevenir kills indesejados?",
      a: "<p>OOMKiller (Out Of Memory Killer) é invocado pelo kernel quando a memória disponível está esgotada. Ele calcula um <strong>oom_score</strong> para cada processo (0-1000, maior = mais provável de ser morto) e mata o processo com maior score.</p><p><strong>Como ver:</strong> dmesg | grep -i 'oom kill' → mostra o processo, PID e quanto de memória estava usando.</p><p><strong>Prevenção:</strong></p><ul><li>Configurar memory limits em containers (K8s: resources.limits.memory)</li><li><code>echo -1000 &gt; /proc/&lt;PID&gt;/oom_score_adj</code> para proteger processo crítico (-1000 = nunca matar, requer root)</li><li>Monitorar used_memory / limit_memory e alertar antes de atingir 90%</li><li>Swap: sem swap, OOM acontece mais cedo; com swap, pode degradar drasticamente antes de OOM</li></ul>",
      level: "senior",
    },
    {
      q: "Diferença entre hard link e symbolic link?",
      a: "<p><strong>Hard link:</strong> <code>ln source link</code>. Cria outro nome para o mesmo inode. Mesmo arquivo, mesmo conteúdo, mesmo inode number. Deletar source não apaga o conteúdo — o arquivo persiste até o último hard link ser removido. Só funciona no mesmo filesystem. Não funciona para diretórios.</p><p><strong>Symbolic link (symlink):</strong> <code>ln -s source link</code>. Arquivo especial que contém um caminho (string). Pode atravessar filesystems, pode apontar para diretórios. Se o alvo é deletado, o symlink fica 'dangling' (apontando para nada). ls -l mostra o arrow: link → target.</p><p><strong>Uso prático:</strong> symlinks para versionar binários (/usr/local/bin/python3 → python3.11), hard links em backup incremental (rsync --link-dest).</p>",
      level: "pleno",
    },
    {
      q: "Como configurar SSH com autenticação por chave e hardening básico?",
      a: "<pre># Gerar par de chaves (no cliente)\nssh-keygen -t ed25519 -C 'usuario@empresa'\n# Copiar chave pública para o servidor\nssh-copy-id -i ~/.ssh/id_ed25519.pub user@servidor\n# ou manualmente:\ncat ~/.ssh/id_ed25519.pub &gt;&gt; ~/.ssh/authorized_keys\nchmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys</pre><p><strong>Hardening em /etc/ssh/sshd_config:</strong></p><pre>PasswordAuthentication no       # desabilita login por senha\nPermitRootLogin no              # root nunca via SSH\nAllowUsers deploy               # apenas usuário específico\nPort 2222                       # porta não padrão (menor ruído)\nMaxAuthTries 3</pre><p>Após editar: <code>systemctl reload sshd</code>. Sempre testar em outra sessão antes de fechar a atual.</p>",
      level: "pleno",
      tip: "Nunca feche a sessão SSH atual antes de testar que nova config funciona — pode se trancar para fora.",
    },
    {
      q: "O que é cgroups e como o Docker/Kubernetes usam?",
      a: "<p><strong>cgroups (control groups)</strong>: mecanismo do kernel Linux para limitar, contabilizar e isolar recursos (CPU, memória, I/O, rede) por grupos de processos.</p><p><strong>Docker</strong> usa cgroups para: memory limit (<code>--memory=512m</code> → cgroup memory.limit_in_bytes), CPU limit (<code>--cpus=0.5</code>), pids limit (evitar fork bomb).</p><p><strong>Kubernetes</strong>: resources.requests e resources.limits no pod spec são traduzidos para cgroup limits. OOMKiller vem do cgroup de memória, não do host. <code>kubectl top pod</code> lê de cgroups via metrics-server.</p><p><code>cat /proc/&lt;PID&gt;/cgroup</code> mostra a qual cgroup um processo pertence. Em sistemas com cgroups v2 (moderno): /sys/fs/cgroup/ é uma hierarquia unificada.</p>",
      level: "senior",
    },
    {
      q: "Como agendar tarefas com cron e qual a sintaxe?",
      a: "<pre># Editar crontab do usuário atual\ncrontab -e\n\n# Sintaxe: minuto hora dia-do-mês mês dia-da-semana comando\n# Campos: 0-59  0-23  1-31         1-12  0-7 (0=Dom)\n\n# Exemplos:\n0 2 * * * /opt/backup.sh       # 02:00 todo dia\n*/15 * * * * /opt/health.sh    # a cada 15 minutos\n0 9 * * 1 /opt/report.sh       # 09:00 toda segunda-feira\n@reboot /opt/startup.sh        # no boot do sistema\n\n# Redirecionar saída (cron não tem terminal)\n0 2 * * * /opt/backup.sh >> /var/log/backup.log 2>&1\n\n# Crontabs do sistema: /etc/cron.d/ e /etc/crontab (tem campo de usuário)\n# Listar crontab atual:\ncrontab -l</pre><p>Para tarefas mais complexas ou com retry: considerar systemd timers (mais robusto que cron).</p>",
      level: "pleno",
    },
    {
      q: "O que é namespace no Linux e como o Docker usa?",
      a: "<p><strong>Namespaces</strong> isolam visões de recursos do kernel por grupo de processos. Cada container tem seu próprio conjunto de namespaces:</p><ul><li><strong>pid:</strong> processo vê apenas os processos do próprio container (PID 1 é o processo principal)</li><li><strong>net:</strong> interface de rede isolada — cada container tem seu eth0 próprio</li><li><strong>mnt:</strong> filesystem isolado — container vê apenas os mounts configurados</li><li><strong>uts:</strong> hostname isolado — container pode ter hostname próprio</li><li><strong>ipc:</strong> IPC (pipes, semáforos) isolados</li><li><strong>user:</strong> UIDs isolados — UID 0 no container ≠ root no host (rootless containers)</li></ul><p>Namespaces + cgroups = base de containers Linux. O kernel não tem 'Docker' — só namespaces e cgroups.</p>",
      level: "senior",
    },
    {
      q: "Como usar awk e sed para processar logs?",
      a: "<pre># sed: substituição em linha\nsed 's/ERROR/[ERROR]/g' app.log\n\n# sed: extrair linhas de um range\nsed -n '100,200p' app.log\n\n# sed: deletar linhas com padrão\nsed '/DEBUG/d' app.log\n\n# awk: imprimir coluna específica (whitespace delimiter)\nawk '{print $1, $4}' access.log  # IP e timestamp\n\n# awk: filtrar e somar\nawk '/ERROR/ {count++} END {print \"Erros:\", count}' app.log\n\n# awk: somar bytes de access log (coluna 10 = bytes)\nawk '{sum += $10} END {print sum/1024/1024 \"MB\"}' access.log\n\n# Combinação: top 10 IPs por requisições\nawk '{print $1}' access.log | sort | uniq -c | sort -rn | head 10</pre><p>Para logs JSON: use jq. Para CSV: use csvkit ou awk com -F','.</p>",
      level: "pleno",
    },
    {
      q: "Como usar strace e lsof para debug avançado?",
      a: "<p><strong>strace</strong>: intercepta syscalls de um processo.</p><pre># Rastrear syscalls de processo existente\nstrace -p PID -e trace=open,read,write\n\n# Contar syscalls (-c summary)\nstrace -p PID -c\n\n# Rastrear acesso a arquivos\nstrace -e trace=file ./meuapp</pre><p><strong>lsof</strong>: lista file descriptors abertos por processos.</p><pre># Quem está usando a porta 3000?\nlsof -i :3000\n\n# Todos os arquivos abertos por processo\nlsof -p PID\n\n# Arquivos deletados mas ainda abertos (espaço preso)\nlsof | grep deleted\n\n# Conexões de rede de um processo\nlsof -p PID -i</pre><p>Combinação poderosa para debug: strace revela syscalls (o quê), lsof revela recursos (quem tem o quê aberto).</p>",
      level: "senior",
    },
    {
      q: "Como funciona o processo de boot do Linux?",
      a: "<p>Sequência de boot moderna (UEFI + systemd):</p><ol><li><strong>UEFI/BIOS:</strong> firmware, POST (Power-On Self Test), seleciona boot device</li><li><strong>Bootloader (GRUB):</strong> /boot/grub2/ — apresenta menu, carrega kernel + initramfs</li><li><strong>Kernel:</strong> descomprime, inicializa hardware (drivers), monta initramfs temporário</li><li><strong>initramfs:</strong> sistema de arquivos temporário em RAM. Monta o filesystem raiz real (pode precisar de módulos de disco, crypto, etc)</li><li><strong>PID 1 (systemd):</strong> kernel passa controle para /sbin/init → systemd. Inicia units em paralelo seguindo dependências (Wants=, Requires=, After=)</li><li><strong>Targets:</strong> multi-user.target (sem GUI) ou graphical.target. Serviços são Units habilitadas.</li></ol><p>systemctl list-dependencies graphical.target — árvore de dependências de boot.</p>",
      level: "senior",
    },
  ],

  diagrams: [
    {
      title: "Anatomia de Permissões Linux",
      html: `
<style>
.lx-perm-wrap { font-family: 'JetBrains Mono', monospace; background: #0f172a; border-radius: 12px; padding: 24px; max-width: 620px; margin: 0 auto; }
.lx-perm-title { color: #f97316; font-size: 14px; font-weight: 700; margin-bottom: 16px; }
.lx-perm-str { font-size: 28px; letter-spacing: 4px; margin-bottom: 16px; }
.lx-perm-seg { display: flex; gap: 0; margin-bottom: 20px; }
.lx-perm-cell { flex: 1; text-align: center; padding: 8px 4px; font-size: 18px; font-weight: 700; border-bottom: 3px solid; }
.lx-perm-label { display: flex; gap: 0; margin-bottom: 8px; }
.lx-perm-lc { flex: 1; text-align: center; font-size: 10px; color: #64748b; padding: 4px; }
.lx-perm-type { color: #94a3b8; border-color: #334155; }
.lx-perm-owner { color: #4ade80; border-color: #4ade80; }
.lx-perm-group { color: #38bdf8; border-color: #38bdf8; }
.lx-perm-other { color: #f59e0b; border-color: #f59e0b; }
.lx-example-row { display: flex; gap: 16px; margin-bottom: 10px; align-items: center; }
.lx-ex-perm { font-size: 14px; min-width: 100px; }
.lx-ex-octal { font-size: 13px; color: #f59e0b; min-width: 40px; }
.lx-ex-desc { font-size: 12px; color: #94a3b8; }
</style>
<div class="lx-perm-wrap">
  <div class="lx-perm-title">chmod 754 = -rwxr-xr--</div>
  <div class="lx-perm-seg">
    <div class="lx-perm-cell lx-perm-type">-</div>
    <div class="lx-perm-cell lx-perm-owner">r</div>
    <div class="lx-perm-cell lx-perm-owner">w</div>
    <div class="lx-perm-cell lx-perm-owner">x</div>
    <div class="lx-perm-cell lx-perm-group">r</div>
    <div class="lx-perm-cell lx-perm-group">-</div>
    <div class="lx-perm-cell lx-perm-group">x</div>
    <div class="lx-perm-cell lx-perm-other">r</div>
    <div class="lx-perm-cell lx-perm-other">-</div>
    <div class="lx-perm-cell lx-perm-other">-</div>
  </div>
  <div class="lx-perm-label">
    <div class="lx-perm-lc" style="color:#94a3b8">tipo</div>
    <div class="lx-perm-lc" style="color:#4ade80">owner 7</div>
    <div class="lx-perm-lc" style="color:#4ade80"></div>
    <div class="lx-perm-lc" style="color:#4ade80"></div>
    <div class="lx-perm-lc" style="color:#38bdf8">group 5</div>
    <div class="lx-perm-lc" style="color:#38bdf8"></div>
    <div class="lx-perm-lc" style="color:#38bdf8"></div>
    <div class="lx-perm-lc" style="color:#f59e0b">other 4</div>
    <div class="lx-perm-lc" style="color:#f59e0b"></div>
    <div class="lx-perm-lc" style="color:#f59e0b"></div>
  </div>
  <div style="margin-top:16px;border-top:1px solid #334155;padding-top:12px">
    <div class="lx-example-row"><span class="lx-ex-perm" style="color:#4ade80">rwx------</span><span class="lx-ex-octal">700</span><span class="lx-ex-desc">Só owner pode tudo. Diretório privado.</span></div>
    <div class="lx-example-row"><span class="lx-ex-perm" style="color:#38bdf8">rw-r--r--</span><span class="lx-ex-octal">644</span><span class="lx-ex-desc">Owner edita, todos leem. Arquivo web.</span></div>
    <div class="lx-example-row"><span class="lx-ex-perm" style="color:#f59e0b">rwxr-xr-x</span><span class="lx-ex-octal">755</span><span class="lx-ex-desc">Owner edita, todos executam. Binário/diretório.</span></div>
    <div class="lx-example-row"><span class="lx-ex-perm" style="color:#ef4444">rw-------</span><span class="lx-ex-octal">600</span><span class="lx-ex-desc">Só owner lê/escreve. Chave SSH privada.</span></div>
  </div>
</div>
      `,
      caption: "Cada arquivo tem 10 chars de permissão: tipo + owner(3) + group(3) + other(3). Octal: r=4, w=2, x=1.",
    },
    {
      title: "Processo de Boot Linux (UEFI + systemd)",
      html: `
<style>
.lx-boot-wrap { font-family: 'Space Grotesk', sans-serif; background: #0f172a; border-radius: 12px; padding: 24px; max-width: 600px; margin: 0 auto; }
.lx-boot-step { display: flex; gap: 16px; margin-bottom: 8px; align-items: flex-start; }
.lx-boot-num { background: #f97316; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; flex-shrink: 0; }
.lx-boot-content { flex: 1; }
.lx-boot-name { font-weight: 700; font-size: 13px; color: #e2e8f0; }
.lx-boot-desc { font-size: 11px; color: #64748b; margin-top: 2px; }
.lx-boot-arrow { text-align: center; color: #334155; font-size: 18px; margin: 4px 0 4px 14px; }
</style>
<div class="lx-boot-wrap">
  <div class="lx-boot-step">
    <div class="lx-boot-num">1</div>
    <div class="lx-boot-content">
      <div class="lx-boot-name">UEFI / BIOS</div>
      <div class="lx-boot-desc">POST (Power-On Self Test), detecta hardware, seleciona boot device</div>
    </div>
  </div>
  <div class="lx-boot-arrow">↓</div>
  <div class="lx-boot-step">
    <div class="lx-boot-num">2</div>
    <div class="lx-boot-content">
      <div class="lx-boot-name">GRUB (Bootloader)</div>
      <div class="lx-boot-desc">/boot/grub2/ — apresenta menu, carrega kernel vmlinuz + initramfs</div>
    </div>
  </div>
  <div class="lx-boot-arrow">↓</div>
  <div class="lx-boot-step">
    <div class="lx-boot-num">3</div>
    <div class="lx-boot-content">
      <div class="lx-boot-name">Kernel (vmlinuz)</div>
      <div class="lx-boot-desc">Descomprime, inicializa drivers, monta initramfs (filesystem temporário em RAM)</div>
    </div>
  </div>
  <div class="lx-boot-arrow">↓</div>
  <div class="lx-boot-step">
    <div class="lx-boot-num">4</div>
    <div class="lx-boot-content">
      <div class="lx-boot-name">initramfs</div>
      <div class="lx-boot-desc">Monta o filesystem raiz real (carrega módulos de disco, LVM, crypto se necessário)</div>
    </div>
  </div>
  <div class="lx-boot-arrow">↓</div>
  <div class="lx-boot-step">
    <div class="lx-boot-num">5</div>
    <div class="lx-boot-content">
      <div class="lx-boot-name">systemd (PID 1)</div>
      <div class="lx-boot-desc">Kernel executa /sbin/init → systemd. Paraleliza inicialização de serviços por dependências</div>
    </div>
  </div>
  <div class="lx-boot-arrow">↓</div>
  <div class="lx-boot-step">
    <div class="lx-boot-num">6</div>
    <div class="lx-boot-content">
      <div class="lx-boot-name">Target atingido</div>
      <div class="lx-boot-desc">multi-user.target (servidor) ou graphical.target (desktop). Login disponível.</div>
    </div>
  </div>
</div>
      `,
      caption: "Sequência completa de boot moderno: firmware → bootloader → kernel → initramfs → systemd → targets.",
    },
    {
      title: "USE Method — Triage de Performance",
      html: `
<style>
.lx-use-wrap { font-family: 'Space Grotesk', sans-serif; background: #0f172a; border-radius: 12px; padding: 24px; max-width: 680px; margin: 0 auto; }
.lx-use-title { color: #f97316; font-size: 14px; font-weight: 700; margin-bottom: 16px; text-align: center; }
.lx-use-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.lx-use-card { background: #1e293b; border-radius: 8px; padding: 14px; }
.lx-use-card-title { font-weight: 700; font-size: 13px; margin-bottom: 10px; }
.lx-use-row { display: flex; flex-direction: column; gap: 3px; margin-bottom: 8px; }
.lx-use-label { font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
.lx-use-cmd { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #4ade80; }
.lx-use-legend { display: flex; gap: 16px; margin-top: 16px; justify-content: center; font-size: 11px; color: #94a3b8; }
</style>
<div class="lx-use-wrap">
  <div class="lx-use-title">USE Method: Utilization + Saturation + Errors</div>
  <div class="lx-use-grid">
    <div class="lx-use-card">
      <div class="lx-use-card-title" style="color:#ef4444">CPU</div>
      <div class="lx-use-row"><span class="lx-use-label">Utilização</span><span class="lx-use-cmd">top → %us %sy | mpstat 1</span></div>
      <div class="lx-use-row"><span class="lx-use-label">Saturação</span><span class="lx-use-cmd">vmstat 1 → r (run queue)</span></div>
      <div class="lx-use-row"><span class="lx-use-label">Erros</span><span class="lx-use-cmd">dmesg | grep -i error</span></div>
    </div>
    <div class="lx-use-card">
      <div class="lx-use-card-title" style="color:#38bdf8">Memória</div>
      <div class="lx-use-row"><span class="lx-use-label">Utilização</span><span class="lx-use-cmd">free -m → used/total</span></div>
      <div class="lx-use-row"><span class="lx-use-label">Saturação</span><span class="lx-use-cmd">vmstat 1 → si/so (swap I/O)</span></div>
      <div class="lx-use-row"><span class="lx-use-label">Erros</span><span class="lx-use-cmd">dmesg | grep -i OOM</span></div>
    </div>
    <div class="lx-use-card">
      <div class="lx-use-card-title" style="color:#f59e0b">Disco I/O</div>
      <div class="lx-use-row"><span class="lx-use-label">Utilização</span><span class="lx-use-cmd">iostat -x 1 → util%</span></div>
      <div class="lx-use-row"><span class="lx-use-label">Saturação</span><span class="lx-use-cmd">iostat -x 1 → await (ms)</span></div>
      <div class="lx-use-row"><span class="lx-use-label">Erros</span><span class="lx-use-cmd">dmesg | grep -i 'I/O error'</span></div>
    </div>
    <div class="lx-use-card">
      <div class="lx-use-card-title" style="color:#4ade80">Rede</div>
      <div class="lx-use-row"><span class="lx-use-label">Utilização</span><span class="lx-use-cmd">sar -n DEV 1 → rxkB/txkB</span></div>
      <div class="lx-use-row"><span class="lx-use-label">Saturação</span><span class="lx-use-cmd">ss -s → retransmits</span></div>
      <div class="lx-use-row"><span class="lx-use-label">Erros</span><span class="lx-use-cmd">ip -s link show eth0</span></div>
    </div>
  </div>
  <div class="lx-use-legend">
    <span>vmstat 1 → vision geral primeiro</span>
    <span>→ iostat -x → sar → perf top</span>
  </div>
</div>
      `,
      caption: "USE method: para cada recurso, cheque utilização, saturação e erros. vmstat 1 é o ponto de entrada.",
    },
    {
      title: "Sinais Linux: Signals e Graceful Shutdown",
      html: `
<style>
.lx-sig-wrap { font-family: 'Space Grotesk', sans-serif; background: #0f172a; border-radius: 12px; padding: 24px; max-width: 640px; margin: 0 auto; }
.lx-sig-title { color: #f97316; font-size: 14px; font-weight: 700; margin-bottom: 16px; }
.lx-sig-table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 16px; }
.lx-sig-table th { color: #64748b; font-weight: 600; padding: 8px; text-align: left; border-bottom: 1px solid #334155; }
.lx-sig-table td { padding: 8px; border-bottom: 1px solid #1e293b; }
.lx-sig-num { font-family: 'JetBrains Mono', monospace; color: #f59e0b; }
.lx-sig-name { font-family: 'JetBrains Mono', monospace; color: #4ade80; }
.lx-sig-key { color: #94a3b8; }
.lx-flow-box { background: #1e293b; border-radius: 8px; padding: 14px; }
.lx-flow-title { font-size: 12px; font-weight: 700; color: #a78bfa; margin-bottom: 10px; }
.lx-flow-step { display: flex; gap: 12px; align-items: center; margin-bottom: 8px; font-size: 12px; }
.lx-flow-tag { background: #0f172a; border: 1px solid #334155; border-radius: 4px; padding: 2px 8px; color: #94a3b8; min-width: 80px; text-align: center; }
.lx-flow-desc { color: #e2e8f0; }
</style>
<div class="lx-sig-wrap">
  <div class="lx-sig-title">Sinais Linux mais importantes</div>
  <table class="lx-sig-table">
    <thead><tr><th>Número</th><th>Nome</th><th>Atalho</th><th>Comportamento padrão</th></tr></thead>
    <tbody>
      <tr><td class="lx-sig-num">1</td><td class="lx-sig-name">SIGHUP</td><td class="lx-sig-key">—</td><td style="color:#94a3b8">Reload config (convensão daemons)</td></tr>
      <tr><td class="lx-sig-num">2</td><td class="lx-sig-name">SIGINT</td><td class="lx-sig-key">Ctrl+C</td><td style="color:#94a3b8">Interrompe (pode capturar)</td></tr>
      <tr><td class="lx-sig-num">9</td><td class="lx-sig-name">SIGKILL</td><td class="lx-sig-key">—</td><td style="color:#ef4444">Mata imediatamente. NÃO pode capturar</td></tr>
      <tr><td class="lx-sig-num">15</td><td class="lx-sig-name">SIGTERM</td><td class="lx-sig-key">kill PID</td><td style="color:#4ade80">Pedido de término gracioso (pode capturar)</td></tr>
      <tr><td class="lx-sig-num">18</td><td class="lx-sig-name">SIGCONT</td><td class="lx-sig-key">fg</td><td style="color:#94a3b8">Retoma processo pausado</td></tr>
      <tr><td class="lx-sig-num">19</td><td class="lx-sig-name">SIGSTOP</td><td class="lx-sig-key">Ctrl+Z</td><td style="color:#94a3b8">Pausa processo. NÃO pode capturar</td></tr>
    </tbody>
  </table>
  <div class="lx-flow-box">
    <div class="lx-flow-title">Protocolo de graceful shutdown (K8s/Docker)</div>
    <div class="lx-flow-step"><span class="lx-flow-tag">SIGTERM</span><span class="lx-flow-desc">Enviado para o container. App captura e começa shutdown.</span></div>
    <div class="lx-flow-step"><span class="lx-flow-tag">30s wait</span><span class="lx-flow-desc">terminationGracePeriodSeconds — app finaliza requests em andamento.</span></div>
    <div class="lx-flow-step"><span class="lx-flow-tag">SIGKILL</span><span class="lx-flow-desc">Se ainda vivo após timeout → kernel mata. Sem cleanup.</span></div>
  </div>
</div>
      `,
      caption: "SIGTERM pede saída graciosa (capturável), SIGKILL mata sem piedade (não capturável). Sempre SIGTERM primeiro.",
    },
  ],

  cheatsheet: {
    title: "Linux CheatSheet — Diagnóstico e Operação",
    html: `
<style>
.lx-cs-wrap { font-family: 'JetBrains Mono', monospace; background: #0f172a; border-radius: 12px; padding: 24px; max-width: 720px; margin: 0 auto; font-size: 12px; }
.lx-cs-section { margin-bottom: 20px; }
.lx-cs-title { color: #f97316; font-size: 13px; font-weight: 700; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #334155; padding-bottom: 6px; }
.lx-cs-row { display: flex; gap: 12px; margin-bottom: 6px; }
.lx-cs-cmd { color: #4ade80; min-width: 240px; }
.lx-cs-desc { color: #94a3b8; }
.lx-cs-warn { color: #ef4444; font-weight: 700; }
.lx-cs-ok { color: #4ade80; font-weight: 700; }
</style>
<div class="lx-cs-wrap">
  <div class="lx-cs-section">
    <div class="lx-cs-title">Processos</div>
    <div class="lx-cs-row"><span class="lx-cs-cmd">ps aux | grep processo</span><span class="lx-cs-desc">Listar todos os processos com PID, CPU%, MEM%</span></div>
    <div class="lx-cs-row"><span class="lx-cs-cmd">top -H -p PID</span><span class="lx-cs-desc">Threads de um processo específico</span></div>
    <div class="lx-cs-row"><span class="lx-cs-cmd">kill -TERM PID</span><span class="lx-cs-desc">Graceful shutdown (sinal 15)</span></div>
    <div class="lx-cs-row"><span class="lx-cs-cmd">kill -KILL PID</span><span class="lx-cs-desc">Kill imediato (sinal 9) — último recurso</span></div>
    <div class="lx-cs-row"><span class="lx-cs-cmd">pgrep -f nome</span><span class="lx-cs-desc">Encontrar PID por nome do processo</span></div>
  </div>
  <div class="lx-cs-section">
    <div class="lx-cs-title">Rede</div>
    <div class="lx-cs-row"><span class="lx-cs-cmd">ss -tlnp</span><span class="lx-cs-desc">Portas TCP escutando com processo (melhor que netstat)</span></div>
    <div class="lx-cs-row"><span class="lx-cs-cmd">ip a / ip r</span><span class="lx-cs-desc">Interfaces/IPs e tabela de rotas</span></div>
    <div class="lx-cs-row"><span class="lx-cs-cmd">dig +short host</span><span class="lx-cs-desc">Resolução DNS rápida</span></div>
    <div class="lx-cs-row"><span class="lx-cs-cmd">curl -v URL</span><span class="lx-cs-desc">Debug HTTP completo: DNS, TCP, TLS, headers</span></div>
    <div class="lx-cs-row"><span class="lx-cs-cmd">tcpdump -i any port 80 -n</span><span class="lx-cs-desc">Captura pacotes raw em porta</span></div>
  </div>
  <div class="lx-cs-section">
    <div class="lx-cs-title">Disco e Filesystem</div>
    <div class="lx-cs-row"><span class="lx-cs-cmd">df -h / df -i</span><span class="lx-cs-desc">Uso de disco / inodes por filesystem</span></div>
    <div class="lx-cs-row"><span class="lx-cs-cmd">du -sh /var/log/*</span><span class="lx-cs-desc">Tamanho de diretórios</span></div>
    <div class="lx-cs-row"><span class="lx-cs-cmd">lsof | grep deleted</span><span class="lx-cs-desc">Arquivos deletados mas ainda abertos (espaço preso)</span></div>
    <div class="lx-cs-row"><span class="lx-cs-cmd">find / -size +100M -type f</span><span class="lx-cs-desc">Localizar arquivos grandes</span></div>
  </div>
  <div class="lx-cs-section">
    <div class="lx-cs-title">systemd / Logs</div>
    <div class="lx-cs-row"><span class="lx-cs-cmd">systemctl status svc</span><span class="lx-cs-desc">Estado do serviço + últimos logs</span></div>
    <div class="lx-cs-row"><span class="lx-cs-cmd">journalctl -u svc -f</span><span class="lx-cs-desc">Log em tempo real</span></div>
    <div class="lx-cs-row"><span class="lx-cs-cmd">journalctl -u svc -n 100 --since '1h ago'</span><span class="lx-cs-desc">Logs recentes</span></div>
    <div class="lx-cs-row"><span class="lx-cs-cmd">systemctl daemon-reload</span><span class="lx-cs-desc">Recarregar unit files após edição</span></div>
  </div>
  <div class="lx-cs-section">
    <div class="lx-cs-title">Regras de ouro</div>
    <div class="lx-cs-row"><span class="lx-cs-warn">✗</span><span class="lx-cs-desc">rm -rf sem verificar variável. Sempre set -u em scripts.</span></div>
    <div class="lx-cs-row"><span class="lx-cs-warn">✗</span><span class="lx-cs-desc">chmod 777 — use o mínimo necessário (644/755/600).</span></div>
    <div class="lx-cs-row"><span class="lx-cs-warn">✗</span><span class="lx-cs-desc">kill -9 sem tentar SIGTERM antes.</span></div>
    <div class="lx-cs-row"><span class="lx-cs-warn">✗</span><span class="lx-cs-desc">Rodar serviço como root — use usuário dedicado.</span></div>
    <div class="lx-cs-row"><span class="lx-cs-ok">✓</span><span class="lx-cs-desc">set -euo pipefail em todo script bash.</span></div>
    <div class="lx-cs-row"><span class="lx-cs-ok">✓</span><span class="lx-cs-desc">USE method: Utilization → Saturation → Errors por recurso.</span></div>
  </div>
</div>
    `,
    caption: "Referência de diagnóstico Linux: processos, rede, disco, systemd e regras de ouro.",
  },

  mindmap: {
    title: "Mapa Mental: Linux para Senior Dev",
    html: `
<style>
.lx-mm-wrap { font-family: 'Space Grotesk', sans-serif; background: #0f172a; border-radius: 12px; padding: 28px; max-width: 680px; margin: 0 auto; }
.lx-mm-center { background: #f97316; color: white; border-radius: 8px; padding: 10px 20px; text-align: center; font-weight: 700; font-size: 15px; }
.lx-mm-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 20px; }
.lx-mm-branch { background: #1e293b; border-radius: 8px; padding: 14px; }
.lx-mm-branch-title { font-weight: 700; font-size: 13px; margin-bottom: 8px; }
.lx-mm-leaf { font-size: 11px; color: #94a3b8; margin-bottom: 4px; padding-left: 8px; border-left: 2px solid; }
</style>
<div class="lx-mm-wrap">
  <div class="lx-mm-center">Linux — Senior Dev Essentials</div>
  <div class="lx-mm-grid">
    <div class="lx-mm-branch">
      <div class="lx-mm-branch-title" style="color:#ef4444">Processos</div>
      <div class="lx-mm-leaf" style="border-color:#ef4444">ps aux, top, htop, pgrep</div>
      <div class="lx-mm-leaf" style="border-color:#ef4444">SIGTERM vs SIGKILL</div>
      <div class="lx-mm-leaf" style="border-color:#ef4444">Estados: R, S, D, Z (zombie)</div>
      <div class="lx-mm-leaf" style="border-color:#ef4444">cgroups: limites de recursos</div>
    </div>
    <div class="lx-mm-branch">
      <div class="lx-mm-branch-title" style="color:#38bdf8">Filesystem</div>
      <div class="lx-mm-leaf" style="border-color:#38bdf8">FHS: /etc /var /proc /sys</div>
      <div class="lx-mm-leaf" style="border-color:#38bdf8">chmod / chown / ACL</div>
      <div class="lx-mm-leaf" style="border-color:#38bdf8">df -h vs df -i (inodes)</div>
      <div class="lx-mm-leaf" style="border-color:#38bdf8">lsof | grep deleted</div>
    </div>
    <div class="lx-mm-branch">
      <div class="lx-mm-branch-title" style="color:#4ade80">Rede</div>
      <div class="lx-mm-leaf" style="border-color:#4ade80">ss -tlnp (portas)</div>
      <div class="lx-mm-leaf" style="border-color:#4ade80">ip a, ip r, dig</div>
      <div class="lx-mm-leaf" style="border-color:#4ade80">curl -v, tcpdump</div>
      <div class="lx-mm-leaf" style="border-color:#4ade80">iptables (regras)</div>
    </div>
    <div class="lx-mm-branch">
      <div class="lx-mm-branch-title" style="color:#f59e0b">Performance</div>
      <div class="lx-mm-leaf" style="border-color:#f59e0b">USE method (U+S+E)</div>
      <div class="lx-mm-leaf" style="border-color:#f59e0b">vmstat 1 (cpu,mem,swap)</div>
      <div class="lx-mm-leaf" style="border-color:#f59e0b">iostat -x 1 (I/O)</div>
      <div class="lx-mm-leaf" style="border-color:#f59e0b">perf top (hot code)</div>
    </div>
    <div class="lx-mm-branch">
      <div class="lx-mm-branch-title" style="color:#a78bfa">systemd</div>
      <div class="lx-mm-leaf" style="border-color:#a78bfa">systemctl start/stop/enable</div>
      <div class="lx-mm-leaf" style="border-color:#a78bfa">journalctl -u svc -f</div>
      <div class="lx-mm-leaf" style="border-color:#a78bfa">unit files (Restart=on-failure)</div>
      <div class="lx-mm-leaf" style="border-color:#a78bfa">daemon-reload após edição</div>
    </div>
    <div class="lx-mm-branch">
      <div class="lx-mm-branch-title" style="color:#f87171">Shell Scripting</div>
      <div class="lx-mm-leaf" style="border-color:#f87171">set -euo pipefail</div>
      <div class="lx-mm-leaf" style="border-color:#f87171">Aspas duplas em variáveis</div>
      <div class="lx-mm-leaf" style="border-color:#f87171">Pipes, redirect &gt; 2&gt; &amp;&gt;</div>
      <div class="lx-mm-leaf" style="border-color:#f87171">find + xargs para batch</div>
    </div>
  </div>
</div>
    `,
    caption: "Mapa completo: as 6 áreas que senior dev precisa dominar no Linux.",
  },

  mnemonics: [
    {
      label: "set -euo pipefail — o trio de segurança bash",
      trick: "EUP: Exit on error, Undefined var = erro, Pipefail propaga",
      explanation: "Os três flags obrigatórios: -e para na primeira falha (sem -e script continua silenciosamente), -u trata variável não declarada como erro (previne rm -rf \"$VAZIA/\"), -o pipefail propaga falha de qualquer parte do pipe. Em entrevista de SRE: 'como você escreve script bash seguro?' — resposta esperada: set -euo pipefail + aspas duplas + validação de variáveis.",
    },
    {
      label: "EXIT CODES: decifrar containers mortos",
      trick: "128+N = morto por sinal N. 137=OOM(9), 139=SIGSEGV(11), 143=SIGTERM(15), 1=app",
      explanation: "Exit code de processo terminado por sinal = 128 + número do sinal. 137 = OOMKilled pelo kernel (ver dmesg | grep OOM, aumentar memory limit). 139 = segmentation fault (bug de memória). 143 = SIGTERM gracioso (deploy, scale down). 1 = erro da aplicação (ver logs). Exit code é o diagnóstico mais rápido de um container morto — sem precisar de logs.",
    },
    {
      label: "USE Method — triage de performance",
      trick: "Usa Saturação Erros — para cada recurso na sequência: vmstat 1 → iostat -x → sar",
      explanation: "Para cada recurso (CPU, memória, disco, rede), checar Utilization (quanto está sendo usado), Saturation (fila de espera: run queue, await, swap) e Errors (dmesg, OOM). Sequência: vmstat 1 dá visão geral primeiro — wa alto = I/O bound (ir para iostat), si/so alto = swap (problema de memória), us alto = CPU real (ir para perf top). Sem método: pula para perf top quando o problema é disco.",
    },
  ],

  exercises: [
    {
      level: "iniciante",
      title: "Permissões e ownership",
      description: "Crie um diretório /tmp/seguro e configure: só o owner pode entrar e listar. Crie um arquivo config.env dentro com chmod 600. Adicione um usuário ao grupo www-data e configure um diretório onde só membros do grupo podem escrever. Verifique com ls -la e id.",
      concepts: ["chmod", "chown", "grupos", "permissions"],
    },
    {
      level: "intermediario",
      title: "Diagnóstico de processo problemático",
      description: "Simule um processo consumindo CPU (use stress --cpu 2 --timeout 60 & ou escreva um loop bash). Use top para identificar, top -H -p PID para ver threads, vmstat 1 para interpretar us/sy/wa. Depois simule I/O com dd if=/dev/zero of=/tmp/big bs=1M count=1000 e observe wa subir. Documente as diferenças.",
      concepts: ["top", "vmstat", "iostat", "USE method", "cpu vs io bound"],
    },
    {
      level: "intermediario",
      title: "Script bash seguro com rotação de logs",
      description: "Escreva um script que: (1) verifica se um diretório de origem existe, (2) comprime com tar + timestamp, (3) move para diretório de destino, (4) remove arquivos com mais de 7 dias. Use set -euo pipefail, variáveis com readonly, aspas duplas em paths. Adicione logging com timestamp para /var/log/backup.log.",
      concepts: ["bash", "set -euo pipefail", "find", "tar", "logging"],
    },
    {
      level: "senior",
      title: "Debug completo de serviço que não responde",
      description: "Simule um serviço web com python3 -m http.server 8080 & mas bloqueie a porta com iptables. Usando apenas ferramentas Linux, diagnostique por que a porta não responde: ss -tlnp, curl -v, tcpdump, iptables -L -n -v. Documente cada passo e o que você encontrou. Resolva e verifique.",
      concepts: ["ss", "tcpdump", "iptables", "curl -v", "diagnóstico de rede"],
    },
    {
      level: "senior",
      title: "Graceful shutdown em container",
      description: "Escreva uma aplicação Node.js simples (ou Python) que: captura SIGTERM, para de aceitar novas conexões, espera requests em andamento terminarem (timeout 30s), e sai com exit(0). Dockerize e teste: docker stop deve resultar em shutdown limpo em < 30s. Verifique o exit code e logs de shutdown.",
      concepts: ["SIGTERM", "graceful shutdown", "signals", "Docker stop", "exit codes"],
    },
  ],

  codeExamples: [
    {
      title: "Script bash seguro — backup com rotação",
      language: "bash",
      code:
        "#!/usr/bin/env bash\n" +
        "# Padrão senior: set -euo pipefail obrigatório\n" +
        "set -euo pipefail\n\n" +
        "# Constantes imutáveis com readonly\n" +
        'readonly SRC="${1:-/var/www/app}"\n' +
        'readonly DEST="${2:-/backups}"\n' +
        "readonly KEEP=7\n" +
        "readonly TS=$(date +%Y%m%d_%H%M%S)\n" +
        "readonly LOG=/var/log/backup.log\n\n" +
        "log() {\n" +
        "  echo \"[$(date '+%Y-%m-%d %H:%M:%S')] $*\" | tee -a \"$LOG\"\n" +
        "}\n\n" +
        "# Validação de entradas\n" +
        '[[ -d "$SRC" ]] || { log "ERROR: diretório source $SRC não existe"; exit 1; }\n' +
        'mkdir -p "$DEST"\n\n' +
        "# Backup com verificação de saída\n" +
        'log "Iniciando backup de $SRC -> $DEST"\n' +
        'tar -czf "$DEST/backup_${TS}.tar.gz" "$SRC" 2>&1 | tee -a "$LOG"\n' +
        'log "Backup criado: $DEST/backup_${TS}.tar.gz"\n\n' +
        "# Rotação: remove arquivos mais antigos que KEEP dias\n" +
        "REMOVED=$(find \"$DEST\" -name 'backup_*.tar.gz' -mtime +\"$KEEP\" -print -delete | wc -l)\n" +
        'log "Rotação: $REMOVED arquivo(s) removido(s) (> $KEEP dias)"',
    },
    {
      title: "Diagnóstico rápido de sistema em produção",
      language: "bash",
      code:
        "#!/usr/bin/env bash\n" +
        "# Script de primeiro diagnóstico (USE method automatizado)\n" +
        "set -euo pipefail\n\n" +
        'echo "=== CPU ==="\n' +
        "# Utilização + run queue (saturação)\n" +
        "vmstat 1 3 | tail -2\n\n" +
        'echo ""\necho "=== Top processos por CPU ==="\n' +
        "ps aux --sort=-%cpu | head -6\n\n" +
        'echo ""\necho "=== Memória ==="\n' +
        "free -m\n" +
        'echo "--- Swap atividade (si=swap-in, so=swap-out) ---"\n' +
        "vmstat 1 2 | tail -1 | awk '{print \"si=\"$7\" so=\"$8}'\n\n" +
        'echo ""\necho "=== I/O de disco ==="\n' +
        "# util% e await = indicadores de saturação\n" +
        "iostat -x 1 2 | tail -n +7 | head -5\n\n" +
        'echo ""\necho "=== Rede ==="\n' +
        "ss -s | grep -E 'TCP:|estab'\n" +
        "# Interfaces com mais tráfego\n" +
        "ip -s link show | grep -A3 'eth\\|ens\\|eno' | head -20\n\n" +
        'echo ""\necho "=== OOM recente? ==="\n' +
        "dmesg --time-format iso | grep -i 'oom\\|killed' | tail -5 || echo \"Nenhum OOM recente\"\n\n" +
        'echo ""\necho "=== Top 5 processos por memória ==="\n' +
        "ps aux --sort=-%mem | head -6",
    },
    {
      title: "Systemd unit file e graceful shutdown em Node.js",
      language: "bash",
      code:
        "# /etc/systemd/system/meuapp.service\n\n" +
        "[Unit]\n" +
        "Description=Meu App Node.js\n" +
        "After=network.target\n\n" +
        "[Service]\n" +
        "Type=simple\n" +
        "User=meuapp\n" +
        "WorkingDirectory=/opt/meuapp\n" +
        "ExecStart=/usr/bin/node /opt/meuapp/index.js\n" +
        "Restart=on-failure\n" +
        "TimeoutStopSec=30\n" +
        "EnvironmentFile=/etc/meuapp/env\n\n" +
        "[Install]\n" +
        "WantedBy=multi-user.target\n\n" +
        "# Após criar: systemctl daemon-reload && systemctl enable --now meuapp\n\n" +
        "# --- Node.js: handler de SIGTERM ---\n" +
        "const server = app.listen(3000)\n\n" +
        "process.on('SIGTERM', () => {\n" +
        "  console.log('SIGTERM recebido — iniciando graceful shutdown')\n" +
        "  server.close(() => {\n" +
        "    console.log('Servidor fechado')\n" +
        "    process.exit(0)\n" +
        "  })\n" +
        "  // Força saída após 25s\n" +
        "  setTimeout(() => process.exit(1), 25000)\n" +
        "})",
    },
  ],

  videos: [
    { title: "Linux for Developers — Full Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=sWbUDq4S6Y8", topic: "Fundamentos" },
    { title: "Linux Performance Analysis in 60s", channel: "Brendan Gregg", url: "https://www.youtube.com/watch?v=ZdVpKx6Wmc8", topic: "Performance" },
    { title: "Bash Scripting Crash Course", channel: "Traversy Media", url: "https://www.youtube.com/watch?v=v-F3YLd6oMw", topic: "Shell" },
    { title: "Linux File Permissions Explained", channel: "NetworkChuck", url: "https://www.youtube.com/watch?v=4e669hSjaX8", topic: "Permissões" },
    { title: "systemd Deep Dive", channel: "LearnLinuxTV", url: "https://www.youtube.com/watch?v=N1vgvhiyq0E", topic: "systemd" },
    { title: "Linux Networking — ss, ip, tcpdump", channel: "TechWorld with Nana", url: "https://www.youtube.com/watch?v=bj3qdEDbCD4", topic: "Rede" },
  ],

  resources: [
    { title: "Linux Documentation Project (TLDP)", url: "https://tldp.org/", kind: "docs" },
    { title: "Brendan Gregg — Linux Performance", url: "https://www.brendangregg.com/linuxperf.html", kind: "artigo" },
    { title: "The Linux Command Line (William Shotts — grátis online)", url: "https://linuxcommand.org/tlcl.php", kind: "livro" },
    { title: "Linux Journey (curso interativo, do básico ao avançado)", url: "https://linuxjourney.com/", kind: "curso" },
    { title: "Julia Evans — Wizard Zines (Linux, networking, debug)", url: "https://wizardzines.com/", kind: "artigo" },
    { title: "man pages online (man7.org)", url: "https://man7.org/linux/man-pages/", kind: "docs" },
    { title: "Linux Upskill Challenge (30 dias de labs práticos)", url: "https://linuxupskillchallenge.org/", kind: "pratica" },
    { title: "Explainshell — entenda qualquer comando shell", url: "https://explainshell.com/", kind: "pratica" },
  ],
}

export default linux
