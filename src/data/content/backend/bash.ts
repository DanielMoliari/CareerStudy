import type { SkillContent } from '@/types'

const bash: SkillContent = {
  tagline: "Shell scripting Unix — automação de tarefas, pipelines e administração de servidores.",
  why: "Bash é indispensável para DevOps, CI/CD, automação de deploy e administração de servidores Linux. Qualquer backend sênior precisa escrever e ler scripts Bash com confiança.",
  summary: "Bash (Bourne Again Shell) é o shell padrão em Linux e macOS. Usado para scripting de automação: CI/CD pipelines, deploy scripts, cron jobs, manipulação de arquivos e texto, administração de servidor. Conceitos essenciais: variáveis, condicionais, loops, funções, pipes, redirecionamento, expressões regulares com grep/sed/awk.",
  keypoints: [
    { title: "Variáveis e expansão", body: "VAR=valor (sem espaço). $VAR para usar. ${VAR:-default} para fallback. $(comando) para substituição de comando. Aspas duplas preservam espaço, aspas simples são literais." },
    { title: "Exit codes e set -e", body: "0 = sucesso, não-zero = erro. $? captura último exit code. set -e: script para em qualquer erro. set -u: erro em variável não definida. set -o pipefail: erro em pipe capturado." },
    { title: "Condicionais", body: "if [ condição ]; then ... fi. [[ ]] é mais moderno e robusto. -f arquivo existe, -d diretório, -z string vazia, -n string não-vazia. Operadores: -eq, -ne, -lt para números." },
    { title: "Loops", body: "for item in lista; do ... done. while [ condição ]; do ... done. for f in *.log; do gzip $f; done. Iterar sobre output: while IFS= read -r line; do ..." },
    { title: "Pipes e redirecionamento", body: "cmd1 | cmd2: stdout de cmd1 é stdin de cmd2. > arquivo: redireciona stdout. >> appenda. 2>&1: redireciona stderr para stdout. /dev/null descarta output." },
    { title: "grep, sed, awk", body: "grep -E 'pattern' file: busca regex. sed 's/old/new/g' file: substituição. awk '{print $2}' file: processa colunas. Tríade de manipulação de texto." },
  ],
  gotchas: [
    "Espaço em volta do = em variável — VAR = valor causa erro. Deve ser VAR=valor.",
    "Sem set -euo pipefail — script continua após erro silenciosamente.",
    "Aspas esquecidas em variável — $VAR sem aspas causa word splitting. Sempre \"$VAR\".",
    "rm -rf $DIR quando $DIR está vazio — rm -rf / ou rm -rf /var/log/. Use set -u.",
    "Script sem shebang (#!/bin/bash) — comportamento depende do shell padrão do sistema.",
  ],
  interview: [
    { q: "O que faz set -euo pipefail e por que usar?", a: "<p>-e: interrompe o script em qualquer comando que retorne exit code não-zero. Evita continuar após erro silencioso.<br>-u: erro ao usar variável não definida. Previne bugs por typo em nome de variável.<br>-o pipefail: o exit code de um pipe é o do primeiro comando que falhou, não do último. Sem isso, grep -v | comando falha silenciosamente.<br>Coloque no início de todo script de produção.</p>" },
    { q: "Como depuraria um script Bash com falha intermitente?", a: "<p>bash -x script.sh: imprime cada comando antes de executar (xtrace). Adicionar set -x em seções específicas. Logar variáveis com echo ou printf para stderr. Verificar exit codes com $? após comandos suspeitos. Usar trap ERR para capturar onde o erro ocorre.</p>" },
  ],
  resources: [
    { title: "Bash Reference Manual", url: "https://www.gnu.org/software/bash/manual/bash.html", kind: "docs" },
    { title: "ShellCheck — linter de scripts", url: "https://www.shellcheck.net/", kind: "pratica" },
    { title: "The Art of Command Line", url: "https://github.com/jlevy/the-art-of-command-line", kind: "artigo" },
  ],
}

export default bash
