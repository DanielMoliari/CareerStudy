import type { SkillContent } from '@/types'

const snykDependabot: SkillContent = {
    tagline: 'SCA automatizado — detectar e corrigir vulnerabilidades em dependências de terceiros no CI/CD.',
    why: 'Dependências npm, pip e Docker são vetores de ataque crescentes (Log4Shell, event-stream, polyfill.io). Snyk e Dependabot automatizam a detecção de CVEs em dependências e abrem PRs de atualização automaticamente. Saber configurar SCA em pipeline é item de checklist em posições sênior com responsabilidade de produção.',
    summary: 'SCA (Software Composition Analysis) analisa o grafo de dependências do projeto (package-lock.json, yarn.lock, Pipfile.lock, etc.) em busca de pacotes com CVEs conhecidas no banco de dados de vulnerabilidades (NVD, GitHub Advisory Database, Snyk DB). Snyk tem mais cobertura de CVEs (especialmente em linguagens menos populares), alertas em tempo real e PR automáticos. Dependabot está integrado nativamente no GitHub e é gratuito sem limites. Em produção, o fluxo ideal é: Dependabot abre PR de patch automaticamente → CI roda testes → se passa, auto-merge em patches sem breaking changes.',
    keypoints: [
      {
        title: 'Dependabot — configuração básica',
        body: 'O arquivo .github/dependabot.yml ativa o Dependabot para npm, Docker e GitHub Actions. Configurar groupUpdates para agrupar updates de patches numa PR única evita dezenas de PRs por semana.',
        code: `# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    groups:
      production-dependencies:
        dependency-type: "production"
        update-types: ["patch", "minor"]
  - package-ecosystem: "docker"
    directory: "/"
    schedule:
      interval: "weekly"`,
      },
      {
        title: 'Snyk CLI no CI',
        body: 'Snyk CLI pode ser instalado em pipelines para bloquear builds com vulnerabilidades CRITICAL ou HIGH em dependências. O --severity-threshold permite configurar o nível mínimo de alerta que bloqueia o build.',
        code: `# GitHub Actions com Snyk
- name: Snyk — verificar vulnerabilidades
  uses: snyk/actions/node@master
  env:
    SNYK_TOKEN: \${{ secrets.SNYK_TOKEN }}
  with:
    args: --severity-threshold=high --fail-on=upgradable`,
      },
      {
        title: 'Diferença entre Snyk e Dependabot',
        body: 'Dependabot: gratuito, integrado ao GitHub, foca em abrir PRs de atualização. Snyk: banco de dados de CVEs maior (especialmente para containers e IaC), análise de reachability (a vulnerabilidade é realmente atingível no seu código?), dashboard de risco, suporte a mais ecossistemas. Para projetos simples: Dependabot basta. Para projetos com compliance e múltiplas linguagens: Snyk agrega valor.',
      },
    ],
    interview: [
      {
        q: 'O que é SCA e como difere de SAST?',
        a: 'SCA (Software Composition Analysis) analisa dependências de terceiros em busca de CVEs conhecidas — não analisa o código que você escreveu. SAST analisa o código fonte que você escreveu em busca de padrões de vulnerabilidade — não analisa dependências. SCA detecta: "sua versão do lodash tem CVE-2021-XXXX". SAST detecta: "você concatenou input do usuário em query SQL". Ambos são complementares e devem rodar no CI — nenhum substitui o outro.',
        level: 'pleno',
      },
      {
        q: 'Como você priorizaria qual dependência vulnerável corrigir primeiro?',
        a: 'Três fatores: severidade do CVE (CVSS score), reachability (a vulnerabilidade é explorável no caminho de código que você usa?), e availabilidade de fix (existe versão sem CVE?). Snyk tem análise de reachability que identifica se a função vulnerável é realmente chamada pelo seu código. CVE CRITICAL com função vulnerável chamada no hot path = fix imediato. CVE HIGH em dependência transitiva de dev-only (ex: jest) = menor prioridade.',
        level: 'pleno',
      },
      {
        q: 'Como o ataque de supply chain do event-stream (2018) poderia ter sido detectado?',
        a: 'O evento: o mantenedor do event-stream (npm) transferiu o pacote para um contribuidor que adicionou um módulo malicioso (flatmap-stream) que roubava carteiras de Bitcoin. Detecção possível: (1) Snyk/Dependabot teria alertado quando a versão com o módulo malicioso foi publicada (após a comunidade reportar e o Advisory ser criado); (2) auditoria de integridade de lockfile (package-lock.json) no CI teria detectado mudança de hash inesperada numa versão sem bump; (3) npm audit roda isso nativamente. A lição: fixar versões de dependências com lockfile e verificar integridade de pacotes em CI são controles fundamentais de supply chain security.',
        level: 'senior',
      },
      {
        q: 'Como você configuraria auto-merge de PRs do Dependabot de forma segura?',
        a: 'Auto-merge seguro requer três condições: (1) apenas patches e minors de dependências de produção (major nunca auto-merge — pode ter breaking changes); (2) CI completo passa (testes unitários + integração + SAST); (3) as dependências com auto-merge são apenas de produção (não dev — jest e tools de build merecem mais revisão). Configuração no GitHub: criar workflow que detecta PR do Dependabot, verifica se é patch/minor, aguarda CI passar, e usa gh pr merge --auto. Para pacotes críticos (auth libs, crypto), nunca auto-merge independente de semver.',
        level: 'senior',
      },
    ],
    gotchas: [
      'CVE em dependência transitiva (dependência da sua dependência) não aparece no package.json — apenas no lockfile. SCA precisa analisar o grafo completo, não só as dependências diretas.',
      'npm audit --fix pode fazer downgrade de versões de forma não intencional — sempre revisar o lockfile diff após o fix.',
      'Fixar versão exata (\"lodash\": \"4.17.21\") vs. usar range (\"^4.17.21\") é um tradeoff: exata = reproducibilidade, mas sem patches automáticos; range = patches automáticos, mas risco de mudança inesperada.',
      'Dependabot abre muitos PRs simultâneos em projetos com muitas dependências — usar groupUpdates para reduzir o ruído ou o time para de revisar.',
    ],
    resources: [
      { title: 'Snyk — Documentação', url: 'https://docs.snyk.io/', kind: 'docs' },
      { title: 'GitHub Dependabot — Configuração', url: 'https://docs.github.com/en/code-security/dependabot/dependabot-version-updates', kind: 'docs' },
    ],
  }

export default snykDependabot
