import type { SkillContent } from '@/types'

const sastSemgrep: SkillContent = {
    tagline: 'Análise estática de código para encontrar vulnerabilidades antes de executar — Semgrep como padrão open source.',
    why: 'SAST (Static Application Security Testing) encontra vulnerabilidades no código fonte sem executar a aplicação — ideal para integrar em CI/CD. Semgrep se tornou o padrão open source por ter regras específicas por framework (React, Express, Django) e permitir escrever regras customizadas em YAML. Saber configurar SAST em pipeline é diferencial em posições DevSecOps e backend sênior.',
    summary: 'SAST analisa o código fonte (ou bytecode) em busca de padrões de vulnerabilidade sem executar a aplicação. Ao contrário de linters de qualidade, SAST tem regras orientadas a segurança: SQL injection por concatenação, XSS por innerHTML, hardcoded secrets, uso de funções criptográficas fracas. O Semgrep usa uma sintaxe de pattern matching que espelha a sintaxe da linguagem alvo — para Node.js/TypeScript, os padrões são escritos em JavaScript-like. Regras do Semgrep Registry cobrem OWASP Top 10 para as principais linguagens. A integração em CI bloqueia o merge se vulnerabilidades críticas são encontradas, criando um "shift left" real de segurança.',
    keypoints: [
      {
        title: 'Como o Semgrep funciona',
        body: 'Semgrep analisa o AST (Abstract Syntax Tree) do código, não o texto em si. Isso permite patterns como "qualquer chamada à função eval() com argumento não literal" — sem falsos positivos de strings em comentários. Os patterns são escritos em YAML e podem usar metavariáveis ($X, $FUNC) para capturar qualquer expressão.',
        code: `# Regra Semgrep: detectar SQL injection por concatenação em Node.js
rules:
  - id: sql-injection-concat
    patterns:
      - pattern: |
          $DB.query($QUERY + $INPUT)
      - pattern-not: |
          $DB.query($QUERY, [$SAFE])
    message: "Possível SQL injection: concatenação em query SQL"
    languages: [javascript, typescript]
    severity: ERROR`,
      },
      {
        title: 'Integração em CI/CD (GitHub Actions)',
        body: 'Semgrep tem action oficial no GitHub Actions Marketplace. O padrão é rodar em PRs e bloquear merge em findings críticos ou altos. O modo diff (--diff-only) analisa apenas as linhas modificadas no PR — mais rápido e menos ruído.',
        code: `# .github/workflows/semgrep.yml
name: Semgrep SAST
on:
  pull_request: {}
jobs:
  semgrep:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: semgrep/semgrep-action@v1
        with:
          config: >-
            p/owasp-top-ten
            p/typescript
            p/nodejs
          auditOn: push
          generateSarif: "1"`,
      },
      {
        title: 'Falsos positivos e supressão',
        body: 'Todo SAST gera falsos positivos. Semgrep permite suprimir individualmente com comentário inline (nosemgrep) ou por metadados de regra. O objetivo é manter a relação sinal/ruído alta — suppressing uma regra que gera 90% de falsos positivos é preferível a fazer o time ignorar todos os alerts.',
        code: `// Suprimir um finding específico com justificativa
const query = 'SELECT * FROM users WHERE id = ' + userId // nosemgrep: sql-injection-concat
// Motivo: userId é um integer validado pelo Zod antes deste ponto — parseInt seguro`,
      },
    ],
    interview: [
      {
        q: 'Qual a diferença entre SAST, DAST e SCA? Quando usar cada um?',
        a: 'SAST (Static): analisa código fonte sem executar — roda no CI, detecta injection, hardcoded secrets, uso de APIs inseguras. DAST (Dynamic): executa a aplicação e testa como atacante — detecta falhas que só aparecem em runtime (configuração de servidor, headers, lógica de estado). SCA (Software Composition Analysis): analisa dependências de terceiros em busca de CVEs conhecidas — complementar ao SAST. Em uma pipeline de DevSecOps completa, os três rodam em paralelo: SAST/SCA em todo PR, DAST em staging antes de promover para produção.',
        tip: 'Saber que os três são complementares e não substitutos é o que demonstra visão de pipeline de segurança, não apenas conhecimento de ferramentas.',
        level: 'pleno',
      },
      {
        q: 'Como você reduziria o ruído de falsos positivos em SAST sem desabilitar regras importantes?',
        a: 'Primeiro: separar findings por severidade — só bloquear CI em CRITICAL/HIGH, reportar MEDIUM/LOW como informação. Segundo: usar modo diff em PRs (analisar só linhas modificadas). Terceiro: criar regras com pattern-not para excluir os casos seguros conhecidos (ex: query parametrizada que o Semgrep não reconhece como segura). Quarto: revisão periódica dos falsos positivos acumulados para ajustar ou criar supressões com justificativa documentada. O objetivo é uma taxa de falsos positivos baixa o suficiente para que o time não desenvolva "alert fatigue".',
        tip: 'Alert fatigue (ignorar todos os alerts por excesso de ruído) é o maior risco de um SAST mal calibrado. Mencionar isso demonstra que você pensa na adoção do processo, não só na ferramenta.',
        level: 'pleno',
      },
      {
        q: 'O que é "shift left security" e como SAST viabiliza isso?',
        a: 'Shift left significa mover a detecção e correção de problemas para as fases mais cedo do desenvolvimento — quanto mais tarde uma vulnerabilidade é descoberta, mais cara é para corrigir. SAST viabiliza shift left porque roda no momento do commit/PR, antes do code review humano, antes de qualquer deploy. O dev recebe o feedback imediatamente, no contexto do código que acabou de escrever, e pode corrigir antes de a mudança ir para qualquer ambiente. Comparado com um pentest antes do lançamento (shift right extremo), SAST é ordens de magnitude mais barato por vulnerabilidade encontrada.',
        level: 'senior',
      },
      {
        q: 'Como você escreveria uma regra Semgrep customizada para detectar logging de dados sensíveis?',
        a: 'A regra precisa capturar chamadas a logger com argumentos que contenham campos sensíveis. No Semgrep: pattern-either para cobrir os nomes comuns de campos sensíveis (password, token, secret, cpf, card), combinado com qualquer chamada de logging (console.log, logger.info, etc.). A metavariável $SENSITIVE captura o valor e a regra verifica se ele veio de um objeto com key sensível. Importante incluir uma mensagem clara e exemplos de como corrigir (logar apenas { userId } em vez do objeto inteiro).',
        level: 'senior',
      },
    ],
    gotchas: [
      'SAST não substitui code review de segurança humano — detecta padrões conhecidos, não lógica de negócio insegura.',
      'Regras muito permissivas geram alert fatigue e o time para de olhar os reports — calibrar severidade é tão importante quanto ter as regras.',
      'Semgrep analisa um arquivo por vez por padrão — para data flow inter-procedural (taint analysis), usar o modo "taint" ou ferramentas mais pesadas como CodeQL.',
      'Não instalar semgrep localmente sem revisar as regras que você adiciona — algumas regras do Registry são experimentais e geram muitos falsos positivos.',
    ],
    resources: [
      { title: 'Semgrep — Documentação oficial', url: 'https://semgrep.dev/docs/', kind: 'docs' },
      { title: 'Semgrep Registry — OWASP rules', url: 'https://semgrep.dev/p/owasp-top-ten', kind: 'pratica' },
    ],
  }

export default sastSemgrep
