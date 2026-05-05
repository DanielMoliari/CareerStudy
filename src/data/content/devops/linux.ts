import type { SkillContent } from '@/types'

const linux: SkillContent = {
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
}

export default linux
