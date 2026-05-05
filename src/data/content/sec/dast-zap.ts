import type { SkillContent } from '@/types'

const dastZap: SkillContent = {
    tagline: 'Teste dinâmico de segurança — OWASP ZAP para encontrar vulnerabilidades em aplicações em execução.',
    why: 'DAST (Dynamic Application Security Testing) encontra vulnerabilidades que só aparecem em runtime: headers de segurança ausentes, CORS mal configurado, endpoints não documentados expostos, respostas com dados vazados. O OWASP ZAP é o padrão open source para DAST — gratuito, com API REST e modo de automação para CI/CD. Saber integrá-lo em staging é diferencial em DevSecOps.',
    summary: 'DAST testa a aplicação como um atacante faria: faz requests HTTP reais contra a aplicação em execução, analisa as respostas, e tenta explorar padrões de vulnerabilidade. O ZAP (Zed Attack Proxy) funciona como proxy entre o cliente e o servidor — captura todo o tráfego, permite análise passiva (observar requests sem modificar) e ativa (tentar exploits automáticos). Em modo de automação, o ZAP pode fazer baseline scan (checa configurações e headers em minutos), spider (mapeia endpoints) e active scan (tenta exploits). A integração em CI/CD roda o baseline scan em staging antes de promover para produção — alertas críticos bloqueiam a promoção.',
    keypoints: [
      {
        title: 'ZAP Baseline Scan — o mais rápido para CI',
        body: 'O baseline scan verifica configurações de segurança básicas em poucos minutos: headers HTTP ausentes (CSP, HSTS, X-Frame-Options), cookies sem atributos Secure/HttpOnly/SameSite, CORS muito aberto, informações de versão de servidor expostas. É o modo ideal para CI/CD porque não faz ataques ativos — apenas análise passiva.',
        code: `# Docker: baseline scan contra staging
docker run --rm owasp/zap2docker-stable zap-baseline.py \\
  -t https://staging.meuapp.com \\
  -r zap-report.html \\
  -J zap-report.json \\
  -I  # não falhar em alertas de nível INFO`,
      },
      {
        title: 'Integração em GitHub Actions',
        body: 'O ZAP tem action oficial no GitHub Actions. O padrão é rodar em deployments de staging — após o deploy, antes de criar a release tag. Alertas HIGH bloqueam o workflow; MEDIUM são reportados como warnings.',
        code: `# .github/workflows/dast.yml
- name: ZAP Baseline Scan
  uses: zaproxy/action-baseline@v0.12.0
  with:
    target: 'https://staging.meuapp.com'
    rules_file_name: '.zap/rules.tsv'
    cmd_options: '-I'`,
      },
      {
        title: 'Diferença entre scan passivo e ativo',
        body: 'Passivo: ZAP observa requests sem modificar — detecta headers ausentes, cookies inseguros, informações vazadas. Ativo: ZAP envia payloads maliciosos (SQL injection strings, XSS payloads, path traversal) e analisa se a aplicação é vulnerável. Scan ativo nunca deve rodar contra produção — apenas staging com dados de teste.',
      },
    ],
    interview: [
      {
        q: 'Por que DAST complementa SAST em vez de substituí-lo?',
        a: 'SAST analisa o código sem executar — encontra padrões de vulnerabilidade no source (injection por concatenação, crypto fraca, hardcoded secrets). DAST executa a aplicação e testa como atacante — encontra problemas de configuração (headers ausentes, CORS), lógica de runtime, e vulnerabilidades em dependências que não aparecem no source code. SAST dá falsos negativos para problemas de configuração; DAST dá falsos negativos para código nunca executado nos testes. Juntos, cobrem superfícies diferentes — a pirâmide de DevSecOps usa os dois.',
        level: 'pleno',
      },
      {
        q: 'Quais são os riscos de rodar DAST com active scan em produção?',
        a: 'Active scan dispara payloads de ataque reais contra a aplicação: SQL injection strings, XSS payloads, tentativas de path traversal, fuzzing de parâmetros. Em produção, isso pode corromper dados reais (se a aplicação for vulnerável a injection), gerar entradas inválidas em bancos, disparar alertas de segurança que acordam o time de plantão, e impactar performance durante o scan. A regra absoluta é: active scan apenas em staging com dados de teste, nunca em produção. Baseline scan (passivo) pode rodar em produção com segurança.',
        tip: 'Demonstrar consciência dos riscos do active scan é o que mostra que você não é só teórico — pensa nas consequências operacionais.',
        level: 'pleno',
      },
      {
        q: 'O que os headers de segurança HTTP verificados pelo ZAP protegem?',
        a: 'Content-Security-Policy (CSP): limita quais scripts, estilos e recursos podem ser carregados — mitiga XSS. HTTP Strict-Transport-Security (HSTS): força HTTPS em futuras conexões — previne downgrade attacks. X-Frame-Options / frame-ancestors: previne clickjacking (embeber o site em iframe malicioso). X-Content-Type-Options: nosniff — previne MIME sniffing que pode levar a execução de scripts. Referrer-Policy: controla quais informações são enviadas no header Referer — previne vazamento de URLs internas. Permissions-Policy: controla acesso a features do browser (câmera, microfone, geolocalização).',
        level: 'senior',
      },
      {
        q: 'Como você configuraria um pipeline de segurança completo com SAST + DAST + SCA?',
        a: 'Em cada PR: SAST (Semgrep) roda em diff-only nos arquivos modificados; SCA (Snyk ou Dependabot) checa novas dependências por CVEs. Em deploy para staging: DAST baseline scan (ZAP) roda após o deploy antes de promover. Em merge para main com deploy: DAST full scan (com active scan configurado cuidadosamente) em staging. Findings HIGH/CRITICAL em qualquer etapa bloqueiam o workflow. Findings MEDIUM são reportados como comentários no PR. O resultado é um "security gate" automatizado que não depende de lembrança humana — a pipeline garante que nenhum código com vulnerabilidade crítica conhecida chega a produção.',
        level: 'senior',
      },
    ],
    gotchas: [
      'Active scan nunca em produção — apenas staging com dados de teste. Parece óbvio até alguém configurar o CI apontando para a URL errada.',
      'ZAP autenticado (logado como usuário) encontra muito mais vulnerabilidades que não-autenticado — configurar sessão de autenticação no scan é essencial para cobrir APIs protegidas.',
      'Rate limiting muito agressivo no servidor pode fazer o ZAP parecer que não encontrou vulnerabilidades — o scan foi bloqueado antes de testar.',
    ],
    resources: [
      { title: 'OWASP ZAP — Documentação oficial', url: 'https://www.zaproxy.org/docs/', kind: 'docs' },
      { title: 'ZAP GitHub Actions', url: 'https://github.com/zaproxy/action-baseline', kind: 'pratica' },
    ],
  }

export default dastZap
