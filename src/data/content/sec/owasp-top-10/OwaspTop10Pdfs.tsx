'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildSecurityChecklistPdf } from '@/components/pdfs/SecurityChecklistPdf'
import type { SecurityCheck } from '@/components/pdfs/SecurityChecklistPdf'
import { buildQuickRefPdf } from '@/components/pdfs/QuickRefPdf'
import type { QuickRefColumn } from '@/components/pdfs/QuickRefPdf'
import { buildAntipatternsPdf } from '@/components/pdfs/AntipatternsPdf'
import type { AntiPatternItem } from '@/components/pdfs/AntipatternsPdf'

// ── Paleta OWASP Top 10 ──────────────────────────────────────────────────────
const C = '#EF4444'
const RED = '#ef4444'
const GRN = '#22c55e'
const FG  = '#e2e8f0'
const COMMENT = '#475569'

// ── Metadados dos PDFs ────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 21 perguntas de OWASP Top 10 mais cobradas em entrevista',
    type: 'qa',
    pages: 12,
    description: 'Recuperação ativa: 21 Q&As nível pleno e sênior cobrindo IDOR, SQL Injection, SSRF em cloud, JWT seguro, CSP, threat modeling STRIDE, supply chain attacks, CSRF, XSS, deserialização, secrets management.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'security',
    title: 'Security Checklist',
    subtitle: 'Checklist de auditoria por categoria OWASP',
    type: 'security',
    pages: 5,
    description: 'Checklist agrupado por categoria (A01-A10) com severidade, CWE referenciado e ações concretas de mitigação. Use para auditar qualquer aplicação web contra OWASP Top 10 2021.',
    icon: '02',
    goal: 'Auditoria de segurança',
  },
  {
    id: 'quick-ref',
    title: 'Quick Reference',
    subtitle: 'Vetor → Impacto → Mitigação para cada categoria',
    type: 'quick-ref',
    pages: 2,
    description: 'Cartão de bolso A4 landscape: para cada A01-A10, a tabela de "vetor de ataque típico → impacto → mitigação central → ferramenta de detecção". Pronto para imprimir e levar para entrevista.',
    icon: '03',
    goal: 'Consulta rápida',
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns',
    subtitle: 'Código vulnerável vs seguro com explicação',
    type: 'antipatterns',
    pages: 4,
    description: 'Os 8 anti-patterns mais clássicos: SQLi com concatenação, IDOR sem ownership check, JWT sem verify, XSS sem escape, SSRF sem allowlist, MD5 para senhas, CORS com wildcard, deserialização insegura. Cada um com diff vermelho/verde.',
    icon: '04',
    goal: 'Reconhecimento de padrão',
  },
]

// ── Q&A data ──────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'O que é IDOR e como você previne?',
    a: 'IDOR (Insecure Direct Object Reference) é quando a aplicação expõe referências internas (IDs numéricos sequenciais, slugs previsíveis) diretamente na URL ou body, e não verifica se o usuário logado tem permissão para aquele recurso.\n\nExemplo: GET /api/orders/1234 retorna o pedido sem checar se pertence ao usuário da sessão.\n\nA prevenção é sempre verificar, no servidor, se req.user.id é dono do recurso buscado. Nunca confiar em IDs vindos do cliente. Usar UUIDs ajuda a dificultar adivinhação, mas não substitui a verificação de autorização.',
    tip: 'Mencione que IDOR é a manifestação mais comum de Broken Access Control (A01) e que a validação deve ser server-side — nada no frontend previne isso.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre autenticação e autorização?',
    a: 'Autenticação responde "quem é você?" — verifica identidade (login, JWT, sessão). Autorização responde "o que você pode fazer?" — verifica permissões sobre recursos.\n\nFalhas de autenticação (A07): JWT sem verificar assinatura, ausência de expiração de sessão, ausência de rate limiting em login, senhas fracas aceitas.\n\nFalhas de autorização (A01): não checar se o usuário tem permissão para o recurso específico, checar permissão apenas no frontend, escalada de privilégio por manipulação de parâmetro.',
    tip: 'Essa pergunta frequentemente vem com um cenário prático. Esteja pronto para identificar a falha numa URL hipotética.',
  },
  {
    level: 'Pleno',
    q: 'O que é SQL Injection e por que prepared statements resolvem?',
    a: 'SQL Injection ocorre quando input do usuário é concatenado diretamente em uma query SQL, fazendo o banco interpretá-lo como código. Exemplo clássico: WHERE email = \'${email}\' — um email como x\' OR 1=1-- transforma a query.\n\nPrepared statements resolvem porque separam o código SQL dos dados: o banco recebe o template compilado primeiro, depois os valores como parâmetros. Os parâmetros nunca são interpretados como SQL — são tratados como strings literais.\n\nORMs modernos (Prisma, TypeORM) usam prepared statements internamente, mas ainda é possível vulnerabilidades com raw queries mal usadas.',
    tip: 'Se mencionar ORMs, o entrevistador pode perguntar sobre raw queries — esteja pronto para citar o risco de template literals com input não sanitizado mesmo dentro de um ORM.',
  },
  {
    level: 'Pleno',
    q: 'Quais são os 3 principais tipos de SQL Injection?',
    a: '1. Classic / In-band: a aplicação retorna dados extraídos diretamente. Exemplo: UNION SELECT username, password FROM users — atacante vê a resposta.\n\n2. Blind: a aplicação não retorna dados, mas comportamento muda baseado em condições. Subtipos:\n  • Boolean-based: páginas diferentes para condição true/false. Atacante extrai byte por byte.\n  • Time-based: SLEEP(5) se a condição for verdadeira. Atacante mede tempo de resposta.\n\n3. Out-of-band: usa canais externos (DNS, HTTP) para exfiltrar dados. Útil quando blind é muito lento.',
    tip: 'Mencione blind time-based como o mais comum de detectar — basta um SLEEP() para confirmar. Ferramentas como sqlmap automatizam todos os tipos.',
  },
  {
    level: 'Pleno',
    q: 'Como armazenar senhas corretamente em 2024?',
    a: 'Algoritmos de hash específicos para senhas com fator de trabalho ajustável:\n\n• Argon2id (recomendado RFC 9106): vencedor do PHC. Memory-hard. Parâmetros: m=64MB, t=3, p=4.\n• bcrypt: rounds 12+ em 2024. Limitação: 72 bytes de input máximo.\n• scrypt: também memory-hard, padrão antes do Argon2.\n\nNão use: MD5, SHA-1, SHA-256 (não tem custo configurável), PBKDF2 sem milhões de iterações.\n\nSempre adicione: salt único por usuário, pepper (secret server-side), rate limiting em login.',
    tip: 'Argon2id é o padrão moderno mas ainda raro em produção. Mencionar Argon2id mostra que está atualizado. bcrypt 12 rounds ainda é aceitável.',
  },
  {
    level: 'Senior',
    q: 'O que é SSRF e por que é perigoso em cloud?',
    a: 'SSRF (Server-Side Request Forgery) permite ao atacante fazer o servidor realizar requisições HTTP a destinos arbitrários.\n\nEm ambientes cloud (AWS, GCP, Azure), o endpoint de metadados (169.254.169.254) retorna credenciais temporárias da role IAM da instância. Um atacante com SSRF pode extrair essas credenciais e assumir a role, obtendo acesso a toda a AWS do alvo.\n\nA IMDSv2 da AWS mitiga isso exigindo um token de sessão (request com PUT inicial), mas aplicações que constroem URLs a partir de input do usuário precisam de allowlist + bloqueio de IPs privados/link-local no nível da aplicação.\n\nBypass comuns: DNS rebinding, redirects HTTP, IPv6 ([::1]), encoding de IP (2130706433 = 127.0.0.1), 0.0.0.0.',
    tip: 'Citar IMDSv2 e o endpoint 169.254.169.254 demonstra conhecimento aplicado a cloud — diferencial em entrevistas de backend/infra.',
  },
  {
    level: 'Senior',
    q: 'Como você implementaria CSP para mitigar XSS?',
    a: 'CSP é um header HTTP que instrui o browser quais fontes de scripts, estilos, imagens e outros recursos são permitidos.\n\nResolve XSS mitigando a execução de scripts injetados — mesmo que o atacante consiga injetar uma tag <script>, o browser bloqueia se a origem não estiver na policy.\n\nUma CSP bem configurada usa nonces (valores aleatórios por request) em vez de \'unsafe-inline\':\n\nContent-Security-Policy:\n  default-src \'self\';\n  script-src \'self\' \'nonce-XYZ\';\n  style-src \'self\' \'nonce-XYZ\';\n  object-src \'none\';\n  base-uri \'self\';\n\nO helmet.js configura CSP com sensatos defaults. Importante: CSP é defesa em profundidade — não substitui sanitização server-side de output.',
    tip: 'Mencionar que CSP é "defesa em profundidade" e não substitui sanitização server-side demonstra maturidade. XSS ainda é uma das falhas mais exploradas.',
  },
  {
    level: 'Senior',
    q: 'O que é Insecure Design (A04) e como threat modeling previne?',
    a: 'Insecure Design cobre falhas de segurança no design do sistema que nenhuma implementação perfeita resolve depois — são decisões arquiteturais que criam vetores de ataque intrinsecamente.\n\nExemplos: fluxo de recuperação de senha que responde diferente para e-mails existentes vs. não existentes (revelando a base de usuários), ausência de rate limiting concebida no design, lógica de negócio que permite comprar produto com quantidade negativa.\n\nThreat modeling usando STRIDE é feito antes de escrever código:\n• Spoofing — falsificação de identidade\n• Tampering — modificação não autorizada\n• Repudiation — negar uma ação\n• Information Disclosure — vazamento de dados\n• Denial of Service — indisponibilidade\n• Elevation of Privilege — ganhar permissões',
    tip: 'STRIDE é o framework de threat modeling mais cobrado em entrevistas. Se souber DREAD (obsoleto mas ainda aparece), mencione que foi substituído por abordagens quantitativas mais robustas.',
  },
  {
    level: 'Senior',
    q: 'Como implementar JWT de forma segura?',
    a: 'Falhas comuns de JWT que causam A07:\n• alg: none aceito — sempre rejeitar explicitamente\n• HS256 com secret fraco: vulnerável a brute-force offline. Use RS256 em produção\n• Algorithm confusion: ataque RS256→HS256 onde a chave pública vira "secret"\n• Sem verificação de exp: tokens nunca expiram\n• Refresh tokens sem rotação\n• Sem invalidação no logout\n\nImplementação segura:\njwt.verify(token, publicKey, { algorithms: [\'RS256\'], issuer, audience, maxAge: \'15m\' })\n\nAccess token: ≤15min, em memória ou httpOnly cookie\nRefresh token: 7-30d, httpOnly cookie SameSite=Strict, rotação a cada uso\nFamília de tokens: detectar reuso de refresh revogado → invalidar família',
    tip: 'Estruture em dois blocos: "o que não fazer" e "implementação correta". RS256, access curto, refresh rotacionado, família de tokens.',
  },
  {
    level: 'Pleno',
    q: 'O que é CSRF e como SameSite cookies mitigam?',
    a: 'CSRF (Cross-Site Request Forgery): site malicioso faz o browser do usuário enviar requisições autenticadas para outro site onde ele está logado, abusando de cookies que o browser envia automaticamente.\n\nMitigações em camadas:\n• SameSite cookies: SameSite=Strict bloqueia o envio em requests cross-site. Lax permite navegação top-level (default em browsers modernos)\n• CSRF tokens: token aleatório por sessão, validado no servidor\n• Custom headers: APIs JSON exigem header customizado (X-Requested-With) — não pode ser enviado cross-site sem CORS preflight\n• Verificar Origin/Referer: rejeitar requests com Origin não esperado\n\nSameSite resolve a maioria dos casos modernos, mas defesa em profundidade exige tokens também.',
    tip: 'Mencione que SameSite=Lax virou default em Chrome 80 (2020), reduzindo drasticamente CSRF. Mas ainda é necessário para old browsers e cross-subdomain.',
  },
  {
    level: 'Senior',
    q: 'O que é Supply Chain Attack? event-stream e SolarWinds.',
    a: 'Supply Chain Attack: comprometer um link da cadeia de fornecedores de software para atingir os usuários downstream.\n\nevent-stream (npm, 2018): o mantenedor original cedeu o pacote a um contribuidor desconhecido, que adicionou código malicioso para roubar wallets de Bitcoin de uma aplicação específica (Copay). Milhões de usuários foram afetados via dependência transitiva.\n\nSolarWinds Orion (2020): atacantes (APT29) comprometeram o build server da SolarWinds, injetando backdoor no software de monitoramento usado por 18.000+ organizações.\n\nMitigações:\n• Lock files + checksum verification (npm ci, yarn --frozen-lockfile)\n• SCA tools: Snyk, Dependabot, npm audit\n• SBOM (Software Bill of Materials) — formato SPDX/CycloneDX\n• SLSA framework: níveis de garantia de build integrity\n• Signed commits: GPG/Sigstore\n• Reproducible builds',
    tip: 'Cite os dois eventos por nome — entrevistador valoriza memória factual. SLSA e SBOM são os termos mais "atuais" (2022+) que indicam estar acompanhando o estado da arte.',
  },
  {
    level: 'Pleno',
    q: 'Como configurar CORS de forma segura?',
    a: 'CORS mal configurado é uma das falhas de A05 mais frequentes:\n\nConfigurações inseguras:\n• Access-Control-Allow-Origin: * em endpoint autenticado\n• Refletir o header Origin sem validação — equivale a permitir tudo\n• Access-Control-Allow-Credentials: true com wildcard\n\nConfiguração segura:\nconst ALLOWED_ORIGINS = [\'https://app.empresa.com\']\nif (ALLOWED_ORIGINS.includes(req.headers.origin)) {\n  res.setHeader(\'Access-Control-Allow-Origin\', req.headers.origin)\n  res.setHeader(\'Access-Control-Allow-Credentials\', \'true\')\n  res.setHeader(\'Vary\', \'Origin\')\n}\n\nPontos importantes:\n• Allowlist explícita — nunca refletir Origin sem validar\n• Header Vary: Origin para CDN/proxy não cachear errado\n• Methods e headers restritos ao necessário',
    tip: 'Mostre o antipadrão de refletir o Origin sem validar — parece "dinâmico e seguro" mas equivale a Access-Control-Allow-Origin: *.',
  },
  {
    level: 'Senior',
    q: 'O que é Hash Flooding Attack?',
    a: 'Hash flooding (algorithmic complexity attack): atacante envia inputs cuidadosamente escolhidos para fazer hash map degradar de O(1) amortizado para O(n) por colisões intencionais.\n\nCenário: servidor web recebe POST com 1000 chaves no JSON. Se a hash function é determinística e conhecida (e.g., FNV-1a), atacante calcula 1000 chaves que colidem no mesmo bucket. Lookups viram lista ligada O(n) → DoS.\n\nCVE clássico (2011): várias linguagens (PHP, Python, Java, Ruby) eram vulneráveis. Um POST malicioso de ~1MB causava 100% CPU por minutos.\n\nMitigações modernas:\n• Random hash seed: hash function recebe seed aleatório por processo\n• Treeify buckets: Java 8 HashMap converte buckets > 8 itens para árvore (O(log n))\n• Limit input size\n• SipHash: hash function resistente a flooding',
    tip: 'Hash flooding é exemplo perfeito de "complexidade na teoria != complexidade na prática com adversário". Mostra pensamento de seguranca + algoritmos juntos — diferencial sênior.',
  },
  {
    level: 'Pleno',
    q: 'Como implementar rate limiting eficaz?',
    a: 'Rate limiting em múltiplas camadas:\n• Por IP: proteção base contra IPs desconhecidos\n• Por usuário autenticado: detecta abuso por conta comprometida\n• Por endpoint: /login, /forgot-password com limites mais restritivos\n\nAlgoritmos:\n• Fixed window: simples mas permite burst no início\n• Sliding window: mais justo, sem burst\n• Token bucket: permite bursts curtos com taxa média controlada\n• Leaky bucket: garante taxa constante\n\nImplementação prática (Redis + token bucket):\nasync function rateLimit(key, max, windowSec) {\n  const count = await redis.incr(key)\n  if (count === 1) await redis.expire(key, windowSec)\n  if (count > max) throw new TooManyRequests()\n}\n\nHeaders padrão: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, Retry-After.',
    tip: 'Mencione que rate limiting é defesa contra credential stuffing (A07). Combine com CAPTCHA/MFA após N falhas.',
  },
  {
    level: 'Senior',
    q: 'Como auditar API contra OWASP Top 10?',
    a: 'Framework de auditoria em 5 etapas:\n1. Inventário de endpoints: API spec (OpenAPI), logs do API gateway. Detecta APIs zumbis.\n2. Teste de autenticação: cada endpoint acessível sem token? Tokens expiram? Logout invalida? (A07)\n3. Teste de Broken Access Control: com dois usuários, tentar acessar recursos um do outro (A01)\n4. Teste de Injection: payloads SQLi/XSS/SSRF em todos os campos (A03)\n5. Teste de Misconfiguration: headers, debug em prod, defaults (A05)\n\nFerramentas:\n• Burp Suite Pro para interceptação e automação\n• OWASP ZAP com OpenAPI plugin\n• Semgrep com regras de OWASP para SAST\n• Trivy para dependências vulneráveis\n• nuclei para scan de misconfiguration\n\nPrioridade: começar pelos endpoints que expõem dados de múltiplos usuários (BOLA) e endpoints de admin sem verificação de role.',
    tip: 'Mostre que auditoria tem sequência lógica: inventário → autenticação → autorização → injection → config. Mencione automação com CI/CD.',
  },
  {
    level: 'Pleno',
    q: 'O que é XSS e quais são os 3 tipos?',
    a: 'XSS (Cross-Site Scripting): injetar JavaScript que executa no browser de outros usuários, com privilégios da origem (cookies, localStorage, DOM).\n\n3 tipos:\n1. Reflected XSS: payload no request (URL, form), refletido na response sem sanitização. Vetor: link malicioso. Ex: ?search=<script>...</script>\n2. Stored XSS: payload salvo no banco (comentário, perfil). Atinge todos os usuários. Mais perigoso.\n3. DOM-based XSS: injeção feita pelo JavaScript do cliente, sem passar pelo servidor. Ex: document.write(location.hash)\n\nComo CSP mitiga:\n• Bloqueia execução de scripts inline: script-src \'self\' sem \'unsafe-inline\'\n• Bloqueia scripts de origens externas não permitidas\n• Com nonce, só scripts marcados pelo servidor executam\n\nDefesa primária ainda é output encoding: escape HTML em outputs do servidor.',
    tip: 'O entrevistador pode pedir um exemplo de payload. Tenha algo simples: <img src=x onerror="fetch(\'/admin\')">. Mostra que conhece além do alert().',
  },
  {
    level: 'Senior',
    q: 'Como prevenir XXE (XML External Entity)?',
    a: 'XXE: parser XML processa entidades externas, permitindo:\n• Ler arquivos do servidor: <!ENTITY xxe SYSTEM "file:///etc/passwd">\n• SSRF via XML: <!ENTITY xxe SYSTEM "http://internal/admin">\n• Billion laughs attack (DoS): entidades exponenciais\n\nPrevenção (desabilitar entidades no parser):\n• Java: factory.setFeature(...disallow-doctype-decl, true)\n• Python: defusedxml.ElementTree (recomendado)\n• PHP: libxml_disable_entity_loader(true)\n• Node.js: libxmljs.parseXmlString(xml, { noent: false })\n\nOutros princípios:\n• Prefira JSON em vez de XML\n• Whitelist de schemas (XSD restrito)\n• Limit de tamanho contra billion laughs\n\nXXE caiu de A4 (2017) para subcategoria de A05 (2021) porque parsers modernos vêm com entidades desabilitadas por padrão.',
    tip: 'XXE não está mais entre os 10 isolados em 2021 — é parte de A05. Saber explicar isso (e mencionar defusedxml em Python) mostra atualização.',
  },
  {
    level: 'Senior',
    q: 'O que são CWE e CVE? Diferença?',
    a: 'CWE (Common Weakness Enumeration): catálogo de tipos de fraqueza de segurança. Linguagem comum para classificar vulnerabilidades. Exemplo: CWE-89 = SQL Injection, CWE-79 = XSS, CWE-639 = IDOR.\n\nCVE (Common Vulnerabilities and Exposures): identificador único de uma vulnerabilidade específica em um produto. Exemplo: CVE-2021-44228 = Log4Shell. Cada CVE referencia 1+ CWEs.\n\nComo usar:\n• CWE: classificar bugs no SAST (Semgrep, SonarQube). Mapear para OWASP Top 10. "Isso é CWE-89, vamos parametrizar".\n• CVE: rastreamento de patches. Snyk/Dependabot avisam quando dep tem CVE conhecido. Score CVSS indica severidade (0-10).\n\nOWASP Top 10 vs CWE Top 25:\n• OWASP Top 10: 10 categorias gerais de risco em apps web\n• CWE Top 25: 25 tipos específicos de bugs mais comuns\n• Use ambos: OWASP para discussão de risco, CWE para classificação técnica',
    tip: 'Saber a diferença entre CWE e CVE separa devs juniors de seniors.',
  },
  {
    level: 'Senior',
    q: 'Como implementar logging de segurança?',
    a: 'Logging de segurança serve dois propósitos: detecção em tempo real (SIEM) e forensics pós-incidente.\n\nO que logar por categoria OWASP:\n• A01 (BOLA): resposta 403 em endpoints de objeto\n• A03 (Injection): payloads suspeitos rejeitados (UNION SELECT, <script, ../)\n• A07 (Auth): falhas de login por IP e por conta, tokens expirados\n• A05 (Misconfig): paths que não deveriam existir (/admin, .env, /.git)\n• A10 (SSRF): tentativas de acessar IPs privados rejeitadas\n\nFormato estruturado (JSON):\n{ ts, event: "auth.login.failed", userId, email, ip, userAgent, reason, severity }\n\nO que NÃO logar (risco de vazamento):\n• Senhas, tokens, dados de cartão (mesmo "mascarados")\n• Stack traces completos em produção\n• PII desnecessário — logar user ID, não e-mail nem CPF\n\nAlertas: 5+ logins falhos do mesmo IP em 60s; 50+ requests com payload SQLi-like; mudança de role para admin.',
    tip: 'Mostre o padrão de detecção: um 403 em BOLA pode ser legítimo; 50 403s em 30 segundos com IDs sequenciais é claramente enumeração.',
  },
  {
    level: 'Senior',
    q: 'O que é deserialização insegura e como mitigar?',
    a: 'Deserialização insegura (A08): aplicação aceita dados serializados do cliente e os deserializa sem validação. Em linguagens com format de serialização "rico" (Java, PHP, Python pickle), atacante pode injetar objetos que executam código durante a deserialização (gadget chains).\n\nExemplos:\n• Java: ObjectInputStream + classes vulneráveis (Apache Commons Collections) → RCE\n• Python: pickle.loads() de input não confiável → RCE direto\n• PHP: unserialize() com classes mágicas (__wakeup, __destruct) → RCE\n• Node.js: node-serialize e similares — eval embutido\n\nCasos famosos: CVE-2017-9805 (Apache Struts → Equifax breach), JEP-290 (Java tentativa de mitigação).\n\nMitigações:\n• Não desserializar input não confiável — preferir formatos sem código (JSON, Protocol Buffers)\n• Allowlist de classes\n• HMAC ou assinatura: assinar payload no servidor; rejeitar se modificado\n• Isolamento: deserialização em processo/container separado',
    tip: 'Em entrevista de Java/Python especificamente, conhecer pickle e ObjectInputStream é diferencial.',
  },
  {
    level: 'Senior',
    q: 'Como gerenciar secrets em uma aplicação?',
    a: 'O que NÃO fazer:\n• Hardcoded em código (descoberta via gitleaks, GitHub search)\n• Commitado em .env mesmo que git-ignored hoje (histórico permanece)\n• Em variáveis de ambiente expostas no /proc/<pid>/environ sem ACL\n\nEstratégia em camadas:\n• Secret manager dedicado: AWS Secrets Manager, HashiCorp Vault, GCP Secret Manager\n• IAM-based access: aplicação assume role da máquina/pod (IRSA no EKS, Workload Identity no GKE)\n• Encryption at rest: secrets sempre criptografados, KMS gerencia chave mestra\n• Audit log: toda leitura de secret é logada\n• Rotação periódica: DB passwords a cada 30d, API keys a cada 90d\n• Least privilege: cada serviço só lê os secrets que precisa\n\nDetecção pré-commit:\n• gitleaks, truffleHog: scan de histórico git\n• Pre-commit hooks bloqueiam commits com secrets\n• GitHub secret scanning: alerta automático\n• Se um secret vazou: rotacionar imediatamente, não basta deletar do histórico',
    tip: 'Mencione o caso clássico de secret vazado: Uber 2016 (chave AWS no GitHub) — incidente que custou $148M.',
  },
]

// ── Security Checklist ────────────────────────────────────────────────────────

const SEC_CHECKS: SecurityCheck[] = [
  // A01 Broken Access Control
  { category: 'A01 — Broken Access Control', severity: 'critical', item: 'Todo endpoint que acessa recurso por ID verifica ownership server-side', cwe: 'CWE-639', testable: true },
  { category: 'A01 — Broken Access Control', severity: 'critical', item: 'A verificação de ownership está no service layer, não apenas no middleware', cwe: 'CWE-639', testable: true },
  { category: 'A01 — Broken Access Control', severity: 'critical', item: 'Existe teste automatizado com 2 usuários tentando acessar recursos um do outro', cwe: 'CWE-639', testable: true },
  { category: 'A01 — Broken Access Control', severity: 'critical', item: 'Endpoints de admin verificam role server-side em cada request', cwe: 'CWE-285', testable: true },
  { category: 'A01 — Broken Access Control', severity: 'high',     item: 'Verificações de permissão no frontend são duplicadas no backend', cwe: 'CWE-285', testable: false },
  // A02 Cryptographic Failures
  { category: 'A02 — Cryptographic Failures', severity: 'critical', item: 'Senhas armazenadas com bcrypt 12+ rounds, scrypt ou argon2id', cwe: 'CWE-916', testable: true },
  { category: 'A02 — Cryptographic Failures', severity: 'critical', item: 'TLS 1.2+ em todas as conexões; TLS 1.0/1.1 desabilitados', cwe: 'CWE-326', testable: true },
  { category: 'A02 — Cryptographic Failures', severity: 'critical', item: 'Nenhum algoritmo fraco (MD5, SHA-1, RC4, DES) em uso', cwe: 'CWE-327', testable: true },
  { category: 'A02 — Cryptographic Failures', severity: 'critical', item: 'Chaves e secrets em Vault/Secrets Manager — nunca hardcoded', cwe: 'CWE-798', testable: true },
  // A03 Injection
  { category: 'A03 — Injection', severity: 'critical', item: 'Todas as queries SQL usam prepared statements ou ORM com parametrização', cwe: 'CWE-89', testable: true },
  { category: 'A03 — Injection', severity: 'critical', item: 'Input do usuário validado server-side com Zod/class-validator/Joi', cwe: 'CWE-20', testable: true },
  { category: 'A03 — Injection', severity: 'high',     item: 'Output HTML escapado (textContent em vez de innerHTML, escape templates)', cwe: 'CWE-79', testable: true },
  { category: 'A03 — Injection', severity: 'high',     item: 'Comandos do sistema usam APIs estruturadas (sem shell), não exec/spawn com string', cwe: 'CWE-78', testable: true },
  // A04 Insecure Design
  { category: 'A04 — Insecure Design', severity: 'high',   item: 'Threat model STRIDE feito antes da implementação de features sensíveis', cwe: 'CWE-1059', testable: false },
  { category: 'A04 — Insecure Design', severity: 'high',   item: 'Recovery flow de senha não revela existência de email (resposta uniforme)', cwe: 'CWE-204', testable: true },
  { category: 'A04 — Insecure Design', severity: 'medium', item: 'Lógica de negócio testada com abuse cases (qty negativa, descontos repetidos)', cwe: 'CWE-840', testable: true },
  // A05 Security Misconfiguration
  { category: 'A05 — Misconfiguration', severity: 'high',     item: 'Headers de segurança configurados: HSTS, CSP, X-Content-Type-Options', cwe: 'CWE-16', testable: true },
  { category: 'A05 — Misconfiguration', severity: 'critical', item: 'Stack traces e mensagens de erro internas não aparecem em produção', cwe: 'CWE-209', testable: true },
  { category: 'A05 — Misconfiguration', severity: 'critical', item: 'CORS com allowlist explícita — não Access-Control-Allow-Origin: *', cwe: 'CWE-942', testable: true },
  { category: 'A05 — Misconfiguration', severity: 'critical', item: 'S3 buckets com IAM correto, sem ACL public-read indevido', cwe: 'CWE-732', testable: true },
  { category: 'A05 — Misconfiguration', severity: 'high',     item: 'Default credentials trocadas (DB, admin, services)', cwe: 'CWE-521', testable: true },
  // A06 Vulnerable Components
  { category: 'A06 — Vulnerable Components', severity: 'high',   item: 'Dependency scanning automatizado (Snyk/Dependabot) com PR auto-update', cwe: 'CWE-1104', testable: true },
  { category: 'A06 — Vulnerable Components', severity: 'high',   item: 'Lock files commitados (package-lock.json, yarn.lock, Cargo.lock)', cwe: 'CWE-829', testable: true },
  { category: 'A06 — Vulnerable Components', severity: 'medium', item: 'Imagens Docker base atualizadas, scan com trivy no CI', cwe: 'CWE-1104', testable: true },
  // A07 Auth Failures
  { category: 'A07 — Auth Failures', severity: 'critical', item: 'JWT usa RS256 (assimétrico) ou HS256 com secret forte e algoritmo fixado', cwe: 'CWE-287', testable: true },
  { category: 'A07 — Auth Failures', severity: 'critical', item: 'Access tokens expiram em ≤15 minutos', cwe: 'CWE-613', testable: true },
  { category: 'A07 — Auth Failures', severity: 'critical', item: 'Refresh tokens são de uso único (rotação a cada uso)', cwe: 'CWE-613', testable: true },
  { category: 'A07 — Auth Failures', severity: 'critical', item: 'Logout invalida o token/sessão server-side', cwe: 'CWE-613', testable: true },
  { category: 'A07 — Auth Failures', severity: 'critical', item: 'Endpoint de login tem rate limit por IP (≤10 req/15min)', cwe: 'CWE-307', testable: true },
  { category: 'A07 — Auth Failures', severity: 'high',     item: 'MFA disponível e obrigatório para usuários com acesso administrativo', cwe: 'CWE-308', testable: true },
  // A08 Integrity Failures
  { category: 'A08 — Integrity Failures', severity: 'high',   item: 'Pipelines CI/CD não executam código de PRs externos sem revisão', cwe: 'CWE-915', testable: false },
  { category: 'A08 — Integrity Failures', severity: 'high',   item: 'Deserialização de input não confiável usa allowlist de classes', cwe: 'CWE-502', testable: true },
  { category: 'A08 — Integrity Failures', severity: 'medium', item: 'SBOM gerado e armazenado para rastreamento de dependências', cwe: 'CWE-345', testable: false },
  // A09 Logging
  { category: 'A09 — Logging Failures', severity: 'medium', item: 'Eventos de segurança logados em formato estruturado (JSON)', cwe: 'CWE-778', testable: true },
  { category: 'A09 — Logging Failures', severity: 'medium', item: 'Senhas, tokens e dados sensíveis nunca aparecem em logs', cwe: 'CWE-532', testable: true },
  { category: 'A09 — Logging Failures', severity: 'medium', item: 'Logs centralizados em SIEM com retenção ≥90 dias', cwe: 'CWE-778', testable: false },
  { category: 'A09 — Logging Failures', severity: 'medium', item: 'Alertas configurados para padrões anômalos (login bruteforce, 50+ 403s)', cwe: 'CWE-778', testable: false },
  // A10 SSRF
  { category: 'A10 — SSRF', severity: 'critical', item: 'Endpoints que aceitam URLs do user têm allowlist de domínios', cwe: 'CWE-918', testable: true },
  { category: 'A10 — SSRF', severity: 'critical', item: 'IPs privados (RFC 1918, 169.254.x) são bloqueados antes de fetch', cwe: 'CWE-918', testable: true },
  { category: 'A10 — SSRF', severity: 'high',     item: 'Em AWS, IMDSv2 está habilitado em todas as instâncias', cwe: 'CWE-918', testable: true },
  { category: 'A10 — SSRF', severity: 'high',     item: 'Redirects HTTP em fetch server-side estão desabilitados (redirect: manual)', cwe: 'CWE-918', testable: true },
]

// ── Quick Reference ───────────────────────────────────────────────────────────

const QUICK_REF_COLUMNS: QuickRefColumn[] = [
  {
    sections: [
      {
        title: 'A01 — Broken Access Control',
        entries: [
          { key: 'Vetor',       value: 'IDOR, manipular IDs em URL/JWT' },
          { key: 'Impacto',     value: 'Vazamento de dados de outros users', badge: 'CRIT', badgeColor: '#ef4444' },
          { key: 'Mitigação',   value: 'Ownership check server-side em TODA op com ID' },
          { key: 'Detecção',    value: 'Burp Intruder, manual com 2 usuários' },
          { key: 'CWE',         value: 'CWE-639, CWE-285' },
        ],
      },
      {
        title: 'A02 — Cryptographic Failures',
        entries: [
          { key: 'Vetor',       value: 'MD5/SHA1, TLS off, chaves hardcoded' },
          { key: 'Impacto',     value: 'Vazamento de senhas, dados sensíveis', badge: 'CRIT', badgeColor: '#ef4444' },
          { key: 'Mitigação',   value: 'bcrypt 12+, TLS 1.3, Vault para secrets' },
          { key: 'Detecção',    value: 'testssl.sh, gitleaks, trivy' },
          { key: 'CWE',         value: 'CWE-327, CWE-329, CWE-798' },
        ],
      },
      {
        title: 'A03 — Injection',
        entries: [
          { key: 'Vetor',       value: 'SQLi, NoSQLi, Command, XSS, LDAP' },
          { key: 'Impacto',     value: 'RCE, dump de banco, bypass total', badge: 'CRIT', badgeColor: '#ef4444' },
          { key: 'Mitigação',   value: 'Prepared statements, ORM, Zod, output encoding' },
          { key: 'Detecção',    value: 'sqlmap, ZAP, Semgrep SAST' },
          { key: 'CWE',         value: 'CWE-89, CWE-79, CWE-78' },
        ],
      },
      {
        title: 'A04 — Insecure Design',
        entries: [
          { key: 'Vetor',       value: 'Lógica abusável, recovery vaza emails' },
          { key: 'Impacto',     value: 'Abuso de lógica, fraude', badge: 'HIGH', badgeColor: '#f97316' },
          { key: 'Mitigação',   value: 'Threat modeling STRIDE antes de codar' },
          { key: 'Detecção',    value: 'Manual — abuse cases, security review' },
          { key: 'CWE',         value: 'CWE-209, CWE-256' },
        ],
      },
      {
        title: 'A05 — Misconfiguration',
        entries: [
          { key: 'Vetor',       value: 'S3 público, debug em prod, default creds' },
          { key: 'Impacto',     value: 'Exposição de dados via misconfig', badge: 'CRIT', badgeColor: '#ef4444' },
          { key: 'Mitigação',   value: 'helmet.js, IaC, security headers, hardening' },
          { key: 'Detecção',    value: 'nuclei, securityheaders.com, ZAP' },
          { key: 'CWE',         value: 'CWE-16, CWE-200' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'A06 — Vulnerable Components',
        entries: [
          { key: 'Vetor',       value: 'npm/Docker com CVE, framework EOL' },
          { key: 'Impacto',     value: 'RCE via dependência (Log4Shell)', badge: 'CRIT', badgeColor: '#ef4444' },
          { key: 'Mitigação',   value: 'Snyk/Dependabot, npm audit, trivy' },
          { key: 'Detecção',    value: 'SCA tools no CI/CD' },
          { key: 'CWE',         value: 'CWE-1104, CWE-937' },
        ],
      },
      {
        title: 'A07 — Auth Failures',
        entries: [
          { key: 'Vetor',       value: 'Credential stuffing, JWT alg:none, sessão ∞' },
          { key: 'Impacto',     value: 'Takeover de conta', badge: 'CRIT', badgeColor: '#ef4444' },
          { key: 'Mitigação',   value: 'JWT RS256, MFA, rate limit /login' },
          { key: 'Detecção',    value: 'jwt_tool, Burp + brute force' },
          { key: 'CWE',         value: 'CWE-287, CWE-307, CWE-613' },
        ],
      },
      {
        title: 'A08 — Integrity Failures',
        entries: [
          { key: 'Vetor',       value: 'Deserialização insegura, supply chain' },
          { key: 'Impacto',     value: 'RCE via deserialização', badge: 'CRIT', badgeColor: '#ef4444' },
          { key: 'Mitigação',   value: 'Lock files, SLSA, SBOM, signed releases' },
          { key: 'Detecção',    value: 'Manual + SCA tools' },
          { key: 'CWE',         value: 'CWE-502, CWE-345' },
        ],
      },
      {
        title: 'A09 — Logging Failures',
        entries: [
          { key: 'Vetor',       value: 'Sem logs, sem alertas, retenção curta' },
          { key: 'Impacto',     value: 'Incidentes não detectados', badge: 'MED',  badgeColor: '#f59e0b' },
          { key: 'Mitigação',   value: 'SIEM, structured logs, retenção 90+d' },
          { key: 'Detecção',    value: 'Audit de logs, simulação' },
          { key: 'CWE',         value: 'CWE-778, CWE-117' },
        ],
      },
      {
        title: 'A10 — SSRF',
        entries: [
          { key: 'Vetor',       value: 'Webhook URL, fetch sem validar, metadata cloud' },
          { key: 'Impacto',     value: 'Pivot interno, exfiltração credentials', badge: 'CRIT', badgeColor: '#ef4444' },
          { key: 'Mitigação',   value: 'Allowlist + bloqueio IP privado + IMDSv2' },
          { key: 'Detecção',    value: 'Burp Collaborator, ZAP' },
          { key: 'CWE',         value: 'CWE-918' },
        ],
      },
    ],
  },
]

// ── Anti-patterns ─────────────────────────────────────────────────────────────

const ANTIPATTERNS: AntiPatternItem[] = [
  {
    title: 'A03 — SQL Injection: concatenação vs prepared statement',
    badDesc: 'Concatenação direta de input do usuário em query SQL — banco interpreta input como código.',
    badCode: [
      { t: '// VULNERAVEL\n', c: COMMENT },
      { t: 'const q = "SELECT * FROM users WHERE email = \'" + email + "\'"\n', c: RED },
      { t: 'const result = await pool.query(q)\n', c: FG },
      { t: '// Atacante envia: email = "x\' OR \'1\'=\'1\' --"\n', c: COMMENT },
      { t: '// Resultado: bypass total de auth\n', c: COMMENT },
    ],
    goodDesc: 'Prepared statement separa template (SQL) de valores (string literal). Banco nunca interpreta valores como SQL.',
    goodCode: [
      { t: '// SEGURO\n', c: COMMENT },
      { t: "const q = 'SELECT * FROM users WHERE email = $1'\n", c: GRN },
      { t: 'const result = await pool.query(q, [email])\n', c: GRN },
      { t: '// Mesmo input malicioso vira string literal\n', c: COMMENT },
      { t: '// Banco procura email = "x\' OR \'1\'=\'1\' --" — não encontra\n', c: COMMENT },
    ],
    why: 'Prepared statements são a defesa #1 contra SQL Injection. ORMs modernos (Prisma, TypeORM) usam internamente. Cuidado com $queryRawUnsafe e template literals concatenados.',
  },
  {
    title: 'A01 — IDOR: sem ownership check vs com verificação',
    badDesc: 'Endpoint retorna recurso por ID sem checar se pertence ao usuário logado.',
    badCode: [
      { t: '// VULNERAVEL\n', c: COMMENT },
      { t: "app.get('/api/orders/:id', auth, async (req, res) => {\n", c: FG },
      { t: '  const order = await Order.findById(req.params.id)\n', c: RED },
      { t: '  res.json(order)  // qualquer user ve qualquer pedido!\n', c: RED },
      { t: '})\n', c: FG },
    ],
    goodDesc: 'Filtra pelo userId do request — só retorna se for dono.',
    goodCode: [
      { t: '// SEGURO\n', c: COMMENT },
      { t: "app.get('/api/orders/:id', auth, async (req, res) => {\n", c: FG },
      { t: '  const order = await Order.findOne({\n', c: GRN },
      { t: '    where: { id: req.params.id, userId: req.user.id }\n', c: GRN },
      { t: '  })\n', c: GRN },
      { t: '  if (!order) return res.status(404).end()\n', c: GRN },
      { t: '  res.json(order)\n', c: FG },
      { t: '})\n', c: FG },
    ],
    why: 'IDOR é a manifestação mais comum de A01 Broken Access Control. UUIDs ajudam mas não substituem ownership check. Sempre filtrar por userId no query — não em middleware separado.',
  },
  {
    title: 'A07 — JWT: decode sem verificar vs verify estrito',
    badDesc: 'jwt.decode() apenas faz base64url decode — NÃO verifica assinatura. Atacante pode forjar tokens.',
    badCode: [
      { t: '// VULNERAVEL\n', c: COMMENT },
      { t: 'const payload = jwt.decode(token)\n', c: RED },
      { t: '// payload tem userId, mas SEM verificar se token e legitimo\n', c: COMMENT },
      { t: 'const user = await User.findById(payload.userId)\n', c: RED },
      { t: '// Atacante envia token forjado com userId=admin\n', c: COMMENT },
    ],
    goodDesc: 'jwt.verify() valida a assinatura usando a chave correta. Algorithm fixado bloqueia attack RS256→HS256.',
    goodCode: [
      { t: '// SEGURO\n', c: COMMENT },
      { t: 'const payload = jwt.verify(token, publicKey, {\n', c: GRN },
      { t: "  algorithms: ['RS256'],  // fixar algoritmos aceitos\n", c: GRN },
      { t: "  issuer: 'app.com',\n", c: GRN },
      { t: "  audience: 'api.app.com',\n", c: GRN },
      { t: "  maxAge: '15m',\n", c: GRN },
      { t: '})\n', c: GRN },
      { t: 'const user = await User.findById(payload.userId)\n', c: FG },
    ],
    why: 'jwt.decode é apenas parsing — nunca usar para autenticar. Sempre jwt.verify com algorithm fixado para evitar alg:none e algorithm confusion (RS256→HS256).',
  },
  {
    title: 'A03 — XSS: innerHTML vs textContent / escape',
    badDesc: 'innerHTML interpreta HTML — qualquer <script> em input do user executa.',
    badCode: [
      { t: '// VULNERAVEL\n', c: COMMENT },
      { t: 'const comment = await fetchComment(id)\n', c: FG },
      { t: 'document.getElementById("c").innerHTML = comment.body\n', c: RED },
      { t: '// Se comment.body contem "<img src=x onerror=alert(1)>"\n', c: COMMENT },
      { t: '// XSS executado!\n', c: COMMENT },
    ],
    goodDesc: 'textContent define apenas texto — não interpreta tags. DOMPurify para HTML legítimo.',
    goodCode: [
      { t: '// SEGURO — texto puro\n', c: COMMENT },
      { t: 'document.getElementById("c").textContent = comment.body\n', c: GRN },
      { t: '\n', c: FG },
      { t: '// SEGURO — HTML sanitizado\n', c: COMMENT },
      { t: 'import DOMPurify from "dompurify"\n', c: GRN },
      { t: 'el.innerHTML = DOMPurify.sanitize(comment.body)\n', c: GRN },
    ],
    why: 'Output encoding é a defesa #1 contra XSS. textContent é seguro por design. Para HTML rico, use DOMPurify (não regex). CSP é defesa em profundidade adicional.',
  },
  {
    title: 'A10 — SSRF: fetch sem validação vs com allowlist',
    badDesc: 'Servidor faz fetch de qualquer URL fornecida pelo user — atacante extrai metadata cloud.',
    badCode: [
      { t: '// VULNERAVEL\n', c: COMMENT },
      { t: 'const res = await fetch(req.body.webhookUrl)\n', c: RED },
      { t: '// Atacante envia: webhookUrl =\n', c: COMMENT },
      { t: '// http://169.254.169.254/latest/meta-data/iam/...\n', c: COMMENT },
      { t: '// Servidor retorna credenciais AWS!\n', c: COMMENT },
    ],
    goodDesc: 'Allowlist de domínios + bloqueio de IPs privados antes do fetch.',
    goodCode: [
      { t: '// SEGURO\n', c: COMMENT },
      { t: 'const url = new URL(req.body.webhookUrl)\n', c: GRN },
      { t: 'if (!ALLOWED_DOMAINS.has(url.hostname)) throw new Error()\n', c: GRN },
      { t: 'const ip = await dns.lookup(url.hostname)\n', c: GRN },
      { t: 'if (isPrivateIP(ip.address)) throw new Error()\n', c: GRN },
      { t: 'const res = await fetch(url, { redirect: "manual" })\n', c: GRN },
    ],
    why: 'SSRF é especialmente crítico em cloud (metadata service). Habilite IMDSv2 em AWS. Bloqueie redirects HTTP no fetch server-side. Resolva DNS antes para mitigar DNS rebinding.',
  },
  {
    title: 'A02 — Senha: MD5 vs bcrypt/argon2',
    badDesc: 'MD5 (e SHA1, SHA-256) são hashes rápidos — quebráveis por brute-force em GPU.',
    badCode: [
      { t: '// VULNERAVEL\n', c: COMMENT },
      { t: "import { createHash } from 'crypto'\n", c: FG },
      { t: "const hash = createHash('md5').update(password).digest('hex')\n", c: RED },
      { t: '// MD5 quebra com rainbow tables ou GPU em segundos\n', c: COMMENT },
    ],
    goodDesc: 'bcrypt/argon2 com fator de trabalho ajustável + salt automático.',
    goodCode: [
      { t: '// SEGURO — bcrypt\n', c: COMMENT },
      { t: "import bcrypt from 'bcrypt'\n", c: FG },
      { t: 'const hash = await bcrypt.hash(password, 12)\n', c: GRN },
      { t: '// 12 rounds: ~250ms — torna brute-force inviavel\n', c: COMMENT },
      { t: '\n', c: FG },
      { t: '// AINDA MELHOR — argon2id\n', c: COMMENT },
      { t: "import argon2 from 'argon2'\n", c: FG },
      { t: 'const hash = await argon2.hash(password, { type: argon2.argon2id })\n', c: GRN },
    ],
    why: 'Senhas exigem hash com custo configurável (work factor). bcrypt 12+ ainda OK em 2024. argon2id é o recomendado pelo OWASP. Nunca use MD5/SHA1/SHA256 puros para senha.',
  },
  {
    title: 'A05 — CORS: wildcard vs allowlist',
    badDesc: 'Access-Control-Allow-Origin: * com credentials = qualquer site lê suas APIs autenticadas.',
    badCode: [
      { t: '// VULNERAVEL\n', c: COMMENT },
      { t: "res.setHeader('Access-Control-Allow-Origin', '*')\n", c: RED },
      { t: "res.setHeader('Access-Control-Allow-Credentials', 'true')\n", c: RED },
      { t: '// Browser bloqueia, mas indica config errada\n', c: COMMENT },
      { t: '\n', c: FG },
      { t: '// PIOR — refletir Origin sem validar\n', c: COMMENT },
      { t: "res.setHeader('Access-Control-Allow-Origin', req.headers.origin)\n", c: RED },
    ],
    goodDesc: 'Allowlist explícita + Vary: Origin para cache correto.',
    goodCode: [
      { t: '// SEGURO\n', c: COMMENT },
      { t: "const ALLOWED = ['https://app.empresa.com']\n", c: GRN },
      { t: 'if (ALLOWED.includes(req.headers.origin)) {\n', c: GRN },
      { t: "  res.setHeader('Access-Control-Allow-Origin', req.headers.origin)\n", c: GRN },
      { t: "  res.setHeader('Access-Control-Allow-Credentials', 'true')\n", c: GRN },
      { t: "  res.setHeader('Vary', 'Origin')\n", c: GRN },
      { t: '}\n', c: FG },
    ],
    why: 'CORS é controle de acesso CROSS-ORIGIN — não substitui auth. Wildcard com credentials = anyone reads. Refletir Origin sem validar = mesma coisa que wildcard.',
  },
  {
    title: 'A08 — Deserialização: pickle/unserialize vs JSON',
    badDesc: 'Formats de serialização "ricos" (pickle, ObjectInputStream, unserialize) executam código durante deserialização.',
    badCode: [
      { t: '# VULNERAVEL — Python pickle\n', c: COMMENT },
      { t: 'import pickle\n', c: FG },
      { t: 'data = pickle.loads(request.body)\n', c: RED },
      { t: '# Atacante envia objeto malicioso → RCE direto\n', c: COMMENT },
      { t: '\n', c: FG },
      { t: '// VULNERAVEL — Java ObjectInputStream\n', c: COMMENT },
      { t: 'ObjectInputStream ois = new ObjectInputStream(input)\n', c: RED },
      { t: 'Object obj = ois.readObject()\n', c: RED },
    ],
    goodDesc: 'JSON/Protobuf são formatos sem código. Validar shape com schema.',
    goodCode: [
      { t: '# SEGURO — JSON com validacao\n', c: COMMENT },
      { t: 'import json\n', c: FG },
      { t: 'from pydantic import BaseModel\n', c: FG },
      { t: 'data = MySchema.parse_raw(request.body)\n', c: GRN },
      { t: '# JSON nao executa codigo. Pydantic valida shape.\n', c: COMMENT },
      { t: '\n', c: FG },
      { t: '// SEGURO — JSON com Zod\n', c: COMMENT },
      { t: 'const data = mySchema.parse(JSON.parse(req.body))\n', c: GRN },
    ],
    why: 'Nunca desserialize input não confiável com formats "ricos". Use JSON/Protobuf + schema validation. Para casos onde precisa: allowlist de classes + HMAC do payload.',
  },
]

// ── Builders ──────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'OWASP Top 10',
    stackLabel: 'Segurança Web',
  }),
  security: () => buildSecurityChecklistPdf({
    checks: SEC_CHECKS,
    skillName: 'OWASP Top 10',
    accentColor: C,
    stackLabel: 'Segurança Web — 2021',
  }),
  'quick-ref': () => buildQuickRefPdf({
    columns: QUICK_REF_COLUMNS,
    skillName: 'OWASP Top 10',
    accentColor: C,
    stackLabel: 'Segurança Web',
    tagline: 'Vetor → Impacto → Mitigação',
    version: '2021',
  }),
  antipatterns: () => buildAntipatternsPdf({
    antipatterns: ANTIPATTERNS,
    accentColor: C,
    skillName: 'OWASP Top 10',
    stackLabel: 'Segurança Web',
  }),
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function OwaspTop10Pdfs() {
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
      {open && (
        <PdfModal card={open} onClose={() => setOpen(null)} builders={PDF_BUILDERS} />
      )}
    </>
  )
}
