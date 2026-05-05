import type { SkillContent } from '@/types'

const gitleaks: SkillContent = {
    tagline: 'Scanner de segredos em repositórios git — encontra chaves, tokens e credenciais hardcodadas antes que vazem.',
    why: 'Segredos em repositórios git são um dos vetores de ataque mais explorados — scanners automatizados vasculham o GitHub publico em tempo real. Gitleaks é a ferramenta open source padrão para detectar isso, tanto como pre-commit hook quanto no CI. Saber configurar e customizar é item de checklist em DevSecOps.',
    summary: 'Gitleaks analisa o histórico de commits git em busca de padrões que correspondam a segredos conhecidos: chaves AWS, tokens GitHub, API keys de Stripe, SendGrid, Twilio, etc. A ferramenta vem com um banco de regras pré-configurado (via regex) para centenas de serviços e permite regras customizadas em TOML. O uso principal é como pre-commit hook (bloquear o commit antes de chegar ao repositório) e como scan no CI (varrer o histórico completo ou apenas o diff de um PR). Em repos com histórico comprometido, o gitleaks também faz scan retroativo para identificar quais segredos já existiram no histórico.',
    keypoints: [
      {
        title: 'Uso básico — scan de repositório',
        body: 'O comando detect faz scan do histórico git completo. O comando protect escaneia apenas arquivos staged (ideal para pre-commit hook).',
        code: `# Scan completo do repositório (histórico de commits)
gitleaks detect --source . --report-path gitleaks-report.json

# Scan apenas de arquivos staged (pre-commit hook)
gitleaks protect --staged

# Scan de um intervalo de commits (útil em CI para apenas o PR)
gitleaks detect --log-opts="HEAD~20..HEAD"`,
      },
      {
        title: 'Integração como pre-commit hook',
        body: 'Usando a ferramenta pre-commit (Python), o gitleaks pode ser adicionado ao .pre-commit-config.yaml e rodará automaticamente antes de cada commit.',
        code: `# .pre-commit-config.yaml
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.4
    hooks:
      - id: gitleaks`,
      },
      {
        title: 'Regras customizadas e allowlist',
        body: 'O arquivo de configuração .gitleaks.toml permite definir regras customizadas para segredos específicos do projeto (ex: padrão de API key proprietária) e allowlist para falsos positivos (ex: chaves de exemplo em documentação).',
        code: `# .gitleaks.toml
[allowlist]
  description = "Allowlist global"
  regexes = [
    '''EXAMPLE_KEY_123''',  # chave de exemplo em docs — não é real
  ]
  paths = [
    '''docs/.*''',          # documentação pode ter exemplos de formato
  ]

[[rules]]
  id = "myapp-api-key"
  description = "Chave de API do MyApp"
  regex = '''myapp_[0-9a-f]{32}'''
  severity = "CRITICAL"`,
      },
    ],
    interview: [
      {
        q: 'O que fazer quando um segredo é encontrado no histórico git?',
        a: 'Em ordem: (1) revogar o segredo imediatamente no serviço de origem (AWS, GitHub, Stripe, etc.) — essa é a ação mais importante, independente de qualquer outra; (2) gerar novo segredo e atualizar nos ambientes; (3) analisar logs de acesso do serviço para ver se o segredo foi usado por alguém não autorizado; (4) limpar o histórico git com BFG Repo Cleaner ou git filter-repo para remover o segredo dos commits históricos; (5) forçar todos os colaboradores a rebaser — o histórico local deles ainda tem o segredo. Importante: mesmo após o cleanup, assumir que o segredo foi comprometido — qualquer clone ou fork anterior ainda tem o histórico original.',
        tip: 'A resposta correta começa sempre com "revogar primeiro" — não com "limpar o histórico". Limpar sem revogar não resolve nada.',
        level: 'pleno',
      },
      {
        q: 'Como o gitleaks complementa o GitHub Secret Scanning nativo?',
        a: 'GitHub Secret Scanning (gratuito em repos públicos, pago em privados) varre automaticamente cada push por segredos de parceiros registrados (AWS, GitHub, Stripe, etc.) e alerta o mantenedor. Gitleaks complementa com: scan local antes do push (pre-commit — detecta antes de chegar ao GitHub), regras customizadas para segredos proprietários que o GitHub não conhece, scan retroativo de histórico completo, integração em CI para repos hospedados fora do GitHub (GitLab, Bitbucket, self-hosted). Para máxima cobertura: gitleaks no pre-commit + gitleaks no CI + GitHub Secret Scanning.',
        level: 'pleno',
      },
      {
        q: 'Como você configuraria um pipeline de secrets scanning em uma organização com 50 repositórios?',
        a: 'Três camadas: (1) pre-commit hook com gitleaks em template de hook compartilhado — novo dev clona e já tem o hook (usando core.hooksPath apontando para um diretório versionado); (2) GitHub Actions workflow reutilizável (reusable workflow) com gitleaks que todos os repositórios chamam em seus CI — centraliza a versão e configuração; (3) GitHub Advanced Security / GitHub Secret Scanning ativo na organização toda (alert automático para mantenedores). Para segredos customizados: repositório central de .gitleaks.toml que todos os repositórios incluem via extends. Métricas: dashboard de findings por repositório, SLA de 24h para revogar segredos críticos encontrados.',
        level: 'senior',
      },
    ],
    gotchas: [
      'Falsos positivos são comuns em código de exemplo, testes e documentação — configure allowlist por path para não criar alert fatigue no time.',
      'Gitleaks no CI com --no-git mode pode varrer arquivos standalone — útil para detectar segredos em arquivos de configuração que não são commitados mas estão no workspace do CI.',
      'Mesmo com gitleaks instalado, desenvolvedores podem usar git commit --no-verify para pular o pre-commit hook — controlar isso no CI é a camada de garantia final.',
      'Scanner de segredos baseado em regex tem falsos negativos para segredos customizados ou ofuscados — é uma camada de defesa, não uma garantia absoluta.',
    ],
    resources: [
      { title: 'Gitleaks — Documentação e GitHub', url: 'https://github.com/gitleaks/gitleaks', kind: 'docs' },
      { title: 'pre-commit framework', url: 'https://pre-commit.com/', kind: 'pratica' },
    ],
  }

export default gitleaks
