'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildSecurityChecklistPdf } from '@/components/pdfs/SecurityChecklistPdf'
import type { SecurityCheck } from '@/components/pdfs/SecurityChecklistPdf'
import { buildCheatsheetPdf } from '@/components/pdfs/CheatsheetPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'

// ── Paleta OWASP API Top 10 ────────────────────────────────────────────────────
const C = '#EF4444'

// ── Metadados dos PDFs ─────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas de OWASP mais cobradas em entrevista sênior',
    type: 'qa',
    pages: 10,
    description: 'Recuperação ativa: BOLA vs BFLA vs BOPLA, Mass Assignment, SSRF em APIs, rate limiting, shadow APIs, multi-tenancy e mais — respostas em nível pleno/sênior com exemplos de código.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'security',
    title: 'Security Checklist',
    subtitle: 'Checklist de auditoria para APIs REST com OWASP API Top 10',
    type: 'security',
    pages: 4,
    description: 'Checklist agrupado por categoria (Controle de Acesso, Autenticação, Rate Limiting, Validação, Configuração) para auditar qualquer API contra o OWASP API Top 10 2023.',
    icon: '02',
    goal: 'Auditoria de segurança',
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet',
    subtitle: 'As 10 vulnerabilidades com vetor de ataque e mitigação resumida',
    type: 'cheatsheet',
    pages: 2,
    description: 'Referência rápida: nome, categoria, vetor de ataque e mitigação central de cada uma das 10 categorias do OWASP API Top 10 2023. Uma página para levar para entrevista.',
    icon: '03',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'Como lembrar as 10 categorias e não confundir BOLA com BFLA',
    type: 'mnemonics',
    pages: 2,
    description: 'Truques para fixar as categorias do API Top 10: BOLA = "objeto errado via função certa", BFLA = "função errada", SSRF = "servidor vira fantoche". Associações que grudam.',
    icon: '04',
    goal: 'Memória de longo prazo',
  },
]

// ── Dados Q&A ──────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    q: 'O que é BOLA e por que é a vulnerabilidade #1 do OWASP API Top 10?',
    a: '<p><strong>BOLA (Broken Object Level Authorization)</strong> é o equivalente de IDOR para APIs: o endpoint aceita um ID no request e retorna ou modifica o recurso <strong>sem verificar se aquele recurso pertence ao usuário logado</strong>.</p><p>Exemplo clássico: <code>GET /api/orders/999</code> — se o usuário A está logado mas o pedido 999 é do usuário B, e a API retorna sem checar ownership, é BOLA explorado.</p><p>É #1 porque praticamente toda API REST usa IDs em URLs e a verificação de ownership é facilmente esquecida, especialmente quando há frameworks que automatizam o fetch pelo ID sem adicionar filtro de usuário.</p>',
    tip: 'Comece pelo exemplo concreto de GET /orders/ID, depois explique por que é a mais comum (toda API REST usa IDs), depois mostre a correção: if (obj.userId !== req.user.id) → 403.',
    level: 'Pleno',
  },
  {
    q: 'Qual a diferença entre BOLA (API1) e BFLA (API5)? Como não confundir os dois?',
    a: '<p><strong>BOLA</strong> = objeto errado via função certa. O usuário acessa um endpoint legítimo (GET /orders/:id), mas o objeto retornado pertence a outro usuário. A pergunta ausente: "este objeto pertence ao usuário logado?"</p><p><strong>BFLA</strong> = função errada, independente do objeto. O usuário acessa um endpoint que não deveria nem existir para seu role — ex: <code>DELETE /admin/users/:id</code> acessível por usuário comum. A pergunta ausente: "este usuário tem role para esta operação?"</p><p>Regra mnemônica: <strong>B-O-LA = objeto</strong>, <strong>B-F-LA = função</strong>. São independentes: um endpoint pode ter BOLA sem BFLA (verificou role mas não verificou ownership) ou vice-versa.</p>',
    tip: 'Desenhe dois exemplos lado a lado: BOLA com URL que muda só o ID, BFLA com URL de endpoint de admin acessível sem role. A diferença fica clara visualmente.',
    level: 'Pleno',
  },
  {
    q: 'O que é Mass Assignment (API3/BOPLA) e como prevenir em ORMs como TypeORM ou Mongoose?',
    a: '<p><strong>Mass Assignment</strong> acontece quando a API aceita campos no body que não deveria. O atacante envia <code>{ "name": "João", "role": "admin" }</code> e o ORM salva todos os campos automaticamente, incluindo <code>role</code>.</p><p><strong>Como prevenir:</strong></p><ul><li>Nunca passe <code>req.body</code> diretamente ao ORM (<code>User.update(id, req.body)</code>)</li><li>Desestruture os campos permitidos explicitamente: <code>const { name, email } = req.body</code></li><li>Use DTOs com class-validator (NestJS) ou Zod para validar shape + tipos</li><li>TypeORM: use <code>@Column({ select: false })</code> para campos sensíveis no select; use DTOs separados para create vs update</li></ul><p>BOPLA inclui também <strong>excesso de dados no response</strong>: retornar o objeto completo quando só alguns campos eram necessários.</p>',
    tip: 'Mostre o código errado (req.body direto) vs correto (desestruturação + DTO). Mencione que BOPLA = Mass Assignment (write) + Excessive Data Exposure (read) juntos.',
    level: 'Pleno',
  },
  {
    q: 'Como implementar proteção contra BOLA em uma API multi-tenant?',
    a: '<p>Em multi-tenant, BOLA pode vazar dados entre organizações além de entre usuários. Estratégias:</p><ul><li><strong>Row-level security no banco</strong>: PostgreSQL RLS filtra automaticamente por <code>tenant_id</code> com <code>SET app.current_tenant_id = X</code> — o banco rejeita acessos cross-tenant antes mesmo do código</li><li><strong>Service layer ownership check</strong>: todo método que recebe um ID deve verificar: <code>if (obj.tenantId !== ctx.tenantId || obj.userId !== ctx.userId) → 403</code></li><li><strong>Scoped queries</strong>: sempre incluir <code>WHERE tenant_id = ?</code> como condição base — nunca confiar só no ID fornecido</li><li><strong>Testes de isolamento</strong>: criar dois tenants nos testes e verificar que um não consegue acessar recursos do outro com IDs válidos</li></ul><p>A armadilha mais comum: verificar ownership mas esquecer de verificar o tenant — o usuário A do tenant 1 não pode acessar recursos do usuário A do tenant 2 mesmo que os IDs de usuário sejam iguais.</p>',
    tip: 'Mencione Row-level security do PostgreSQL como a solução mais robusta — delega a verificação ao banco. Mostre o padrão de "scoped query" como alternativa.',
    level: 'Senior',
  },
  {
    q: 'O que é SSRF em contexto de APIs e quais são os vetores de ataque mais comuns?',
    a: '<p><strong>SSRF (Server-Side Request Forgery)</strong> acontece quando a API aceita uma URL fornecida pelo usuário e faz uma requisição server-side sem validar o destino.</p><p><strong>Vetores comuns:</strong></p><ul><li><strong>Webhook URLs</strong>: endpoints que testam webhooks apontados para <code>http://169.254.169.254/latest/meta-data/</code> (metadados EC2) ou <code>http://localhost:8080/admin</code></li><li><strong>Import de arquivo por URL</strong>: "importe o CSV deste link"</li><li><strong>Preview de link</strong>: geração de thumbnail ou extração de metadata de URL</li><li><strong>Redirecionamentos</strong>: URL externa que redireciona para IP privado</li></ul><p><strong>Mitigação em camadas:</strong> allowlist de domínios permitidos → resolução de DNS antes do fetch → bloqueio de IPs privados (RFC 1918: 10.x, 172.16-31.x, 192.168.x) → desabilitar redirects automáticos → usar biblioteca com proteção anti-SSRF.</p>',
    tip: 'Comece pelo exemplo dos metadados AWS (169.254.169.254) — é o ataque mais famoso e fácil de visualizar. Mostre por que resolver o DNS antes do fetch é necessário (DNS rebinding attack).',
    level: 'Senior',
  },
  {
    q: 'Como implementar rate limiting eficaz em uma API que precisa distinguir usuários legítimos de bots?',
    a: '<p>Rate limiting em múltiplas camadas:</p><ul><li><strong>Por IP</strong>: proteção base contra IPs desconhecidos — mas bots usam proxies rotacionados</li><li><strong>Por usuário autenticado</strong>: limite por conta, independente de IP — detecta abuso por conta comprometida</li><li><strong>Por endpoint específico</strong>: /login, /forgot-password, /send-otp têm limites muito mais restritivos (5-10 req/15min) do que endpoints de leitura (100 req/min)</li><li><strong>Sliding window</strong> vs fixed window: sliding window evita burst no início de cada janela</li></ul><p><strong>Para distinguir bots:</strong></p><ul><li>Fingerprinting de client (headers, TLS fingerprint) além do IP</li><li>CAPTCHA após N falhas consecutivas</li><li>Honeypot endpoints que bots chamariam mas usuários legítimos nunca veriam</li><li>Análise comportamental: padrão de acesso muito regular em ms = bot</li></ul>',
    tip: 'Estruture a resposta em três níveis: rate limit por IP (fácil de burlar), por usuário (mais robusto), por comportamento (mais sofisticado). Mencione o tradeoff entre segurança e UX.',
    level: 'Senior',
  },
  {
    q: 'O que são Shadow APIs e APIs zumbis? Por que são um risco de segurança maior que outras categorias?',
    a: '<p><strong>Shadow APIs</strong> são endpoints criados sem passar pelo processo formal de segurança — criados por desenvolvedores diretamente em produção, via ferramentas de terceiros não auditadas, ou em ambientes de desenvolvimento acessíveis externamente.</p><p><strong>APIs zumbis</strong> são versões antigas (/api/v1, /api/v2) que continuaram acessíveis depois que a versão nova foi lançada — sem autenticação atualizada, sem patches de segurança, e frequentemente esquecidas nos logs de monitoramento.</p><p><strong>Por que são mais perigosas:</strong></p><ul><li>Não passaram por revisão de segurança</li><li>Não aparecem nos alertas e dashboards de monitoramento</li><li>Podem ter vulnerabilidades já corrigidas na versão atual mas presentes na antiga</li><li>Os atacantes as encontram via enumeração de endpoints e Google dorking</li></ul><p><strong>Mitigação:</strong> inventário automático de endpoints (API gateway logs), sunset headers com data de deprecação, remoção ativa ou exigência de auth nas versões antigas.</p>',
    tip: 'Dê o exemplo real: /api/v1 sem auth enquanto /api/v2 tem OAuth2. Os dados são os mesmos, mas a versão antiga é uma porta aberta. Mencione que scanners de API (Burp Suite, Postman) encontram essas versões facilmente.',
    level: 'Senior',
  },
  {
    q: 'Como validar adequadamente respostas de APIs de terceiros para evitar a API10 (Unsafe Consumption)?',
    a: '<p>Princípio fundamental: <strong>não confie em APIs externas mais do que em input do usuário</strong>. Uma API de terceiro comprometida ou comportando-se inesperadamente pode causar injection, crashes ou lógica de negócio incorreta.</p><p><strong>Camadas de validação:</strong></p><ul><li><strong>Schema validation</strong>: Zod ou Joi validam shape + tipos antes de usar qualquer campo — rejeitam se o schema mudou inesperadamente</li><li><strong>Verificar Content-Type</strong>: não parsear como JSON uma resposta com Content-Type text/html</li><li><strong>Limite de tamanho</strong>: respostas muito grandes podem ser injeção de dados ou DoS</li><li><strong>Sanitização</strong>: se campos da resposta externa chegam ao frontend ou banco de dados, sanitize como faria com input de usuário</li><li><strong>Timeout e circuit breaker</strong>: defina timeout curto; use circuit breaker para não travar quando a API de terceiro estiver lenta</li></ul><p>Exemplo: <code>const safe = externalSchema.parse(await fetch(url).then(r =&gt; r.json()))</code> — o parse lança exceção se o schema divergiu.</p>',
    tip: 'Dê o exemplo de uma API de pagamento retornando um campo amount inesperado como string em vez de number. Zod teria rejeitado; o código sem validação teria causado bug silencioso.',
    level: 'Pleno',
  },
  {
    q: 'Qual é a diferença entre autenticação e autorização no contexto do OWASP API Top 10?',
    a: '<p><strong>Autenticação</strong> (API2): "Quem é você?" — verificar identidade. JWT válido, sessão ativa, credenciais corretas. A falha aqui é: tokens fracos, sem expiração, não invalidados, ou JWTs com algoritmo <code>alg: none</code>.</p><p><strong>Autorização</strong> (API1, API3, API5): "O que você pode fazer?" — verificar permissão. São três camadas:</p><ul><li><strong>BOLA (API1)</strong>: "Você pode acessar ESTE objeto específico?" — ownership check</li><li><strong>BFLA (API5)</strong>: "Você pode executar ESTA função?" — role check</li><li><strong>BOPLA (API3)</strong>: "Quais campos você pode ler/escrever?" — field-level authorization</li></ul><p>A falha conceitual mais comum: implementar autenticação corretamente mas assumir que "se está autenticado, pode fazer tudo". As quatro verificações são independentes — precisa de todas.</p>',
    tip: 'Use a analogia do hotel: autenticação = verificar que você tem uma chave válida; BOLA = sua chave abre só o seu quarto; BFLA = sua chave não abre a sala de máquinas; BOPLA = você pode ler o menu do quarto mas não modificar a conta.',
    level: 'Pleno',
  },
  {
    q: 'Como detectar e explorar BOLA em um pentest de API? Quais ferramentas e técnicas usar?',
    a: '<p><strong>Técnica básica de detecção:</strong></p><ol><li>Criar dois usuários (userA e userB)</li><li>userB cria um recurso (pedido, documento, perfil)</li><li>Pegar o ID do recurso de B</li><li>Autenticar como userA e tentar acessar o recurso com o ID de B</li><li>Se a API retornar 200, BOLA confirmado</li></ol><p><strong>Ferramentas:</strong></p><ul><li><strong>Burp Suite</strong>: interceptar requests e modificar IDs manualmente ou via Intruder para enumerar</li><li><strong>OWASP ZAP</strong>: scanner automático com módulo de IDOR</li><li><strong>Postman</strong>: criar dois environments (userA e userB) e trocar tokens facilmente</li><li><strong>ffuf</strong>: fuzzing de IDs numéricos ou UUIDs</li></ul><p><strong>Técnicas avançadas:</strong> GUIDs/ULIDs ainda são vulneráveis — o ID pode ser previsível ou vazar em outro endpoint. Testar também: IDs em query params, headers customizados, payloads JSON aninhados.</p>',
    tip: 'Estruture: como detectar manualmente (dois usuários) → como automatizar (Burp Intruder) → o que testar além de IDs numéricos (UUIDs, IDs em headers). Mostre que BOLA não depende de IDs sequenciais.',
    level: 'Senior',
  },
  {
    q: 'O que é GraphQL e quais vulnerabilidades OWASP API Top 10 são mais relevantes para APIs GraphQL?',
    a: '<p>GraphQL introduz vetores de ataque únicos que mapeiam para categorias do OWASP API Top 10:</p><ul><li><strong>API1 — BOLA</strong>: resolvers que buscam objetos por ID sem verificar ownership do usuário logado</li><li><strong>API4 — Resource Consumption</strong>: <strong>introspection queries</strong> expostas em produção revelam o schema completo; queries aninhadas profundas (query depth explosion) que consomem CPU/memória exponencialmente sem depth limiting</li><li><strong>API3 — Mass Assignment</strong>: mutations que aceitam campos extras não filtrados</li><li><strong>API8 — Misconfiguration</strong>: playground de desenvolvimento exposto em produção, introspection sem auth</li></ul><p><strong>Mitigações específicas de GraphQL:</strong></p><ul><li>Desabilitar introspection em produção</li><li>Implementar query complexity limit e depth limit (ex: max depth 5)</li><li>Rate limiting por query complexity, não só por requisição</li><li>Persisted queries em vez de queries ad-hoc para produção</li></ul>',
    tip: 'A questão "consulta recursiva que derruba o servidor" é um clássico de GraphQL — mostre o exemplo de query aninhada infinita e o depth limiting como solução.',
    level: 'Senior',
  },
  {
    q: 'Como implementar JWT de forma segura para evitar a API2 (Broken Authentication)?',
    a: '<p><strong>Falhas comuns de JWT que causam API2:</strong></p><ul><li><code>alg: none</code>: verificar se a biblioteca aceita e rejeitar explicitamente</li><li>HS256 com secret fraco ou previsível: use RS256 (assimétrico) em produção</li><li>Sem verificação de <code>exp</code>: tokens nunca expiram — use access tokens de curta duração (15min)</li><li>Refresh tokens sem rotação: cada uso deve gerar um novo refresh token e invalidar o anterior</li><li>Sem invalidação no logout: armazene tokens revogados (blocklist) ou use sessões server-side</li></ul><p><strong>Implementação segura:</strong></p><ul><li>Access token: curta duração (15min), armazenado em memória (não localStorage)</li><li>Refresh token: longa duração (7-30d), httpOnly cookie, rotação a cada uso, one-time use</li><li>Família de tokens: detectar reuso de refresh token revogado → invalidar toda a família (detecta roubo)</li></ul>',
    tip: 'Estruture em dois blocos: "o que não fazer" (alg: none, HS256 fraco, sem expiração) e "implementação correta" (RS256, access curto, refresh rotacionado, família de tokens).',
    level: 'Senior',
  },
  {
    q: 'O que é error budget policy em APIs e como conectar violações de SLO com patches de segurança?',
    a: '<p>Uma <strong>error budget policy de segurança</strong> define gatilhos para ação quando incidentes de segurança consomem o budget de confiabilidade:</p><ul><li>Budget 50% consumido por incidente de segurança → revisão obrigatória das mitigações implementadas</li><li>Budget 80% consumido → feature freeze, sprint de hardening de segurança</li><li>Violação de SLA por incidente de segurança → post-mortem com análise de qual categoria OWASP foi responsável</li></ul><p>Na prática: mapeie incidentes para categorias OWASP. Se 3 incidentes consecutivos são BOLA, o sprint de segurança foca em ownership checks sistemáticos + testes de autorização automatizados.</p><p>Ferramentas: SAST (Semgrep com regras de OWASP) no CI/CD para detectar padrões vulneráveis antes do deploy. Cada PR com mudança em endpoints de API deveria rodar verificações automáticas de autorização.</p>',
    tip: 'Esta pergunta conecta SRE com segurança — mostre que você pensa em confiabilidade e segurança como um sistema integrado, não duas áreas separadas.',
    level: 'Senior',
  },
  {
    q: 'Como proteger endpoints de upload de arquivo contra vulnerabilidades de segurança?',
    a: '<p>Upload de arquivo é uma superfície de ataque com múltiplas categorias OWASP:</p><ul><li><strong>BOLA</strong>: verificar que o usuário tem permissão para fazer upload naquele contexto (não só estar autenticado)</li><li><strong>API4</strong>: limite de tamanho de arquivo, limite de taxa de upload por usuário</li><li><strong>API7 — SSRF via URL</strong>: se aceitar upload por URL, validar o destino antes do fetch</li><li><strong>API8 — Misconfiguration</strong>: nunca servir uploads diretamente do servidor de app; usar CDN/S3 com URL pré-assinada</li></ul><p><strong>Checklist de segurança para upload:</strong></p><ul><li>Validar MIME type real (magic bytes), não só extensão ou Content-Type do cliente</li><li>Renomear arquivo no servidor — nunca usar o nome original do usuário</li><li>Armazenar fora do webroot — nunca no diretório público</li><li>Escanear com antivírus/ClamAV antes de aceitar</li><li>Usar S3 com URLs pré-assinadas de curta duração para download</li><li>Sem execução de código: servidor nunca deve executar arquivos recebidos</li></ul>',
    tip: 'Cubra os dois lados: proteção no recebimento (MIME validation, rename, scan) e no servimento (S3, URLs assinadas, fora do webroot). Mostre que upload é uma das superfícies mais complexas.',
    level: 'Senior',
  },
  {
    q: 'O que é a vulnerabilidade API6 (Unrestricted Access to Sensitive Business Flows) e como difere de rate limiting?',
    a: '<p><strong>API4 (Rate Limiting)</strong>: limita volume genérico de requisições — proteção contra DoS e força bruta. Não entende semântica de negócio.</p><p><strong>API6 (Business Flows)</strong>: fluxos específicos que a lógica de negócio permite mas que podem ser abusados de formas não previstas mesmo dentro dos limites de rate:</p><ul><li>Comprar item com quantidade negativa para gerar crédito</li><li>Aplicar o mesmo cupom de desconto 1000 vezes (uma por request, dentro do rate limit)</li><li>Fazer scraping sistemático de catálogo de preços (uma requisição por minuto durante meses)</li><li>Abuso de sistema de referral: criar contas falsas para ganhar bônus</li></ul><p><strong>Mitigação requer modelagem de casos de abuso:</strong> durante o design, perguntar "quem tentaria abusar disso e como?" Para cada fluxo sensível, definir limites de negócio (máx. N cupons por usuário, quantidade mínima 1, verificação de unicidade de conta).</p>',
    tip: 'A distinção chave: rate limiting é técnico (requests/segundo), business flow é semântico (o que a operação faz). Um bot pode operar dentro do rate limit e ainda assim abusar a lógica de negócio.',
    level: 'Senior',
  },
  {
    q: 'Como auditar uma API existente contra o OWASP API Top 10? Por onde começar?',
    a: '<p><strong>Framework de auditoria em 5 etapas:</strong></p><ol><li><strong>Inventário de endpoints</strong>: API spec (OpenAPI/Swagger), logs do API gateway, testes de enumeração. Detecta APIs zumbis (API9)</li><li><strong>Teste de autenticação</strong>: cada endpoint acessível sem token? Tokens expiram? Logout invalida? (API2)</li><li><strong>Teste de BOLA</strong>: com dois usuários, tentar acessar recursos um do outro em todos os endpoints que aceitam IDs (API1)</li><li><strong>Teste de BFLA</strong>: listar todos os endpoints privilegiados; tentar acessá-los com token de usuário comum (API5)</li><li><strong>Teste de Mass Assignment</strong>: enviar campos extras no body e verificar se são aceitos/persistidos (API3)</li></ol><p><strong>Ferramentas:</strong> Burp Suite Pro para interceptação e automação; OWASP ZAP com OpenAPI plugin; Semgrep com regras de OWASP para SAST; Trivy para dependências vulneráveis.</p><p><strong>Prioridade de risco</strong>: começar pelos endpoints que expõem dados de múltiplos usuários (BOLA) e pelos endpoints de admin sem verificação de role (BFLA) — máximo impacto se explorados.</p>',
    tip: 'Mostre que auditoria tem sequência lógica: primeiro entender o inventário (API9), depois autenticação (API2), depois autorização em dois níveis (BOLA, BFLA). Mencione automação com CI/CD.',
    level: 'Senior',
  },
  {
    q: 'Como configurar CORS de forma segura em uma API?',
    a: '<p>CORS mal configurado é uma das falhas de API8 (Security Misconfiguration) mais frequentes:</p><p><strong>Configurações inseguras comuns:</strong></p><ul><li><code>Access-Control-Allow-Origin: *</code> em endpoint autenticado — permite qualquer site fazer requests com credenciais</li><li>Refletir o header <code>Origin</code> sem validação: <code>Access-Control-Allow-Origin: req.headers.origin</code> — equivale a permitir tudo</li><li><code>Access-Control-Allow-Credentials: true</code> com wildcard — rejeitado pelo browser mas indica má config</li></ul><p><strong>Configuração segura:</strong></p><ul><li>Allowlist explícita de origens: <code>const ALLOWED_ORIGINS = ["https://app.empresa.com", "https://admin.empresa.com"]</code></li><li>Validar origin contra a allowlist antes de setar o header</li><li>Methods e headers restritos ao necessário</li><li>Preflight cache razoável: <code>Access-Control-Max-Age: 86400</code></li><li>Ambiente de desenvolvimento separado: nunca usar config de dev em produção</li></ul>',
    tip: 'Mostre o antipadrão de refletir o Origin sem validar — parece "dinâmico e seguro" mas equivale a Access-Control-Allow-Origin: *. É um erro muito comum em APIs Node.js com CORS npm.',
    level: 'Pleno',
  },
  {
    q: 'O que é excessive data exposure e como diferenciá-lo de BOLA?',
    a: '<p><strong>Excessive Data Exposure</strong> (parte de API3/BOPLA na versão 2023) acontece quando a API retorna mais campos do que o cliente precisa, esperando que o cliente filtre os dados. Ex: endpoint de perfil público retorna hash da senha, número de CPF, tokens internos.</p><p><strong>Diferença de BOLA:</strong></p><ul><li><strong>BOLA</strong>: acesso ao objeto de OUTRO usuário — o recurso não deveria ser acessível de forma alguma</li><li><strong>Excessive Data Exposure</strong>: acesso ao próprio objeto (ou objeto autorizado) mas com campos a mais — o recurso é acessível, mas expõe internals desnecessários</li></ul><p><strong>Como prevenir:</strong></p><ul><li>DTOs de resposta explícitos — mapear apenas os campos necessários antes de enviar</li><li>Revisar cada resposta de API: "o cliente precisa de todos esses campos?"</li><li>Nunca serializar o objeto ORM diretamente: transformar para DTO</li><li>GraphQL: ainda pode vazar se o schema expõe campos sensíveis sem resolver guard</li></ul>',
    tip: 'O exemplo mais forte: endpoint de GET /users/me retornando { password_hash, salt, recovery_token } porque o ORM serializou o objeto completo. DTO seria: { id, name, email, avatar_url }.',
    level: 'Pleno',
  },
  {
    q: 'Como implementar logging de segurança em APIs para detectar tentativas de exploração OWASP?',
    a: '<p>Logging de segurança serve dois propósitos: detecção em tempo real (SIEM) e forensics pós-incidente.</p><p><strong>O que logar por categoria OWASP:</strong></p><ul><li><strong>BOLA</strong>: resposta 403 em endpoints de objeto — padrão de muitos 403 em sequência indica enumeração</li><li><strong>BFLA</strong>: tentativa de acessar endpoint privilegiado com role insuficiente</li><li><strong>Auth (API2)</strong>: falhas de login por IP e por conta, uso de tokens expirados</li><li><strong>Rate limit (API4)</strong>: violações de rate limit por IP e por usuário</li><li><strong>Mass Assignment</strong>: campos não permitidos rejeitados — logar quais campos foram tentados</li></ul><p><strong>O que NÃO logar (risco de vazamento):</strong></p><ul><li>Senhas, tokens, dados de cartão mesmo que "mascarados" — nunca no log</li><li>Stack traces completos em produção — somente em logs internos com acesso restrito</li><li>PII desnecessário — logar user ID, não e-mail nem CPF</li></ul><p>Ferramentas: structured logging (JSON) → ElasticSearch/Datadog → alertas de anomalia (5+ BOLA 403 em 60s do mesmo IP).</p>',
    tip: 'Mostre o padrão de detecção: um 403 em BOLA pode ser legítimo; 50 403s em 30 segundos em endpoints diferentes com o mesmo IP é claramente enumeração. O log é o que permite distinguir.',
    level: 'Senior',
  },
  {
    q: 'Como criar testes automatizados de segurança para as principais categorias OWASP API Top 10?',
    a: '<p>Testes de segurança no CI/CD transformam o OWASP API Top 10 em código verificável:</p><p><strong>Testes de BOLA (automated):</strong></p><ul><li>Criar userA e userB no setup do teste</li><li>userB cria recurso → pegar ID</li><li>Autenticar como userA → GET /resources/:id_do_recurso_de_B</li><li>Assertion: esperar 403 ou 404, nunca 200</li></ul><p><strong>Testes de BFLA:</strong></p><ul><li>Mapear endpoints admin no OpenAPI spec</li><li>Autenticar como usuário comum</li><li>Tentar cada endpoint admin → assertion: 403</li></ul><p><strong>Testes de Mass Assignment:</strong></p><ul><li>POST/PATCH com campos extras ({ role: "admin" })</li><li>Verificar no banco que o campo extra não foi persistido</li></ul><p><strong>Ferramentas:</strong></p><ul><li>Jest/Vitest para testes de integração com supertest</li><li>OWASP ZAP API scan no CI (modo daemon + scan headless)</li><li>Semgrep com regras OWASP para análise estática nos PRs</li></ul><p>Esses testes devem rodar em ambiente de staging com banco real, não mocks.</p>',
    tip: 'O teste de BOLA com dois usuários é o mais valioso de implementar — é simples, reproduzível e detecta a vulnerabilidade #1 do OWASP automaticamente em cada PR.',
    level: 'Senior',
  },
]

// ── Security Checklist ─────────────────────────────────────────────────────────

const SEC_CHECKS: SecurityCheck[] = [
  // Controle de Acesso
  { category: 'Controle de Acesso — BOLA (API1)', severity: 'critical', item: 'Todo endpoint que acessa um recurso por ID verifica se o recurso pertence ao usuário logado', cwe: 'CWE-639', testable: true },
  { category: 'Controle de Acesso — BOLA (API1)', severity: 'critical', item: 'A verificação de ownership está no service layer, não apenas no middleware', cwe: 'CWE-639', testable: true },
  { category: 'Controle de Acesso — BOLA (API1)', severity: 'critical', item: 'Existe teste automatizado com dois usuários tentando acessar recursos um do outro', cwe: 'CWE-639', testable: true },
  { category: 'Controle de Acesso — BFLA (API5)', severity: 'critical', item: 'Endpoints de admin verificam role server-side em cada request', cwe: 'CWE-285', testable: true },
  { category: 'Controle de Acesso — BFLA (API5)', severity: 'critical', item: 'Nenhuma verificação de role está apenas no frontend', cwe: 'CWE-285', testable: false },
  { category: 'Validação de Dados — BOPLA (API3)', severity: 'high', item: 'req.body nunca é passado diretamente ao ORM — há allowlist de campos aceitos', cwe: 'CWE-915', testable: true },
  { category: 'Validação de Dados — BOPLA (API3)', severity: 'high', item: 'Respostas da API retornam apenas campos necessários (DTOs de resposta)', cwe: 'CWE-359', testable: true },
  // Autenticação
  { category: 'Autenticação (API2)', severity: 'critical', item: 'JWT usa algoritmo assimétrico (RS256) ou secret forte com verificação de assinatura', cwe: 'CWE-287', testable: true },
  { category: 'Autenticação (API2)', severity: 'critical', item: 'Access tokens expiram em ≤15 minutos', cwe: 'CWE-613', testable: true },
  { category: 'Autenticação (API2)', severity: 'critical', item: 'Refresh tokens são de uso único (rotação a cada uso)', cwe: 'CWE-613', testable: true },
  { category: 'Autenticação (API2)', severity: 'critical', item: 'Logout invalida o token/sessão server-side', cwe: 'CWE-613', testable: true },
  // Rate Limiting
  { category: 'Rate Limiting (API4)', severity: 'high', item: 'Endpoint de login tem rate limit por IP (≤10 req/15min)', cwe: 'CWE-307', testable: true },
  { category: 'Rate Limiting (API4)', severity: 'high', item: 'Endpoints de criação de recurso têm rate limit por usuário', cwe: 'CWE-770', testable: true },
  { category: 'Rate Limiting (API4)', severity: 'medium', item: 'Payloads têm tamanho máximo configurado', cwe: 'CWE-770', testable: true },
  // SSRF
  { category: 'SSRF (API7)', severity: 'high', item: 'Endpoints que aceitam URLs de usuário têm allowlist de domínios', cwe: 'CWE-918', testable: true },
  { category: 'SSRF (API7)', severity: 'high', item: 'IPs privados são bloqueados antes de fazer fetch de URL fornecida pelo usuário', cwe: 'CWE-918', testable: true },
  // Configuração
  { category: 'Configuração (API8)', severity: 'medium', item: 'CORS tem allowlist explícita de origens — não usa Access-Control-Allow-Origin: *', cwe: 'CWE-942', testable: true },
  { category: 'Configuração (API8)', severity: 'medium', item: 'Stack traces e mensagens de erro internas não aparecem em produção', cwe: 'CWE-209', testable: true },
  { category: 'Configuração (API8)', severity: 'medium', item: 'Headers de segurança estão configurados (Strict-Transport-Security, X-Content-Type-Options)', cwe: 'CWE-16', testable: true },
  // Inventário
  { category: 'Inventário (API9)', severity: 'medium', item: 'Há inventário centralizado de todos os endpoints de API', cwe: 'CWE-1059', testable: false },
  { category: 'Inventário (API9)', severity: 'high', item: 'Versões antigas da API (/v1, /v2) estão desativadas ou exigem autenticação atual', cwe: 'CWE-1059', testable: true },
]

// ── Mnemônicos ────────────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'BOLA = Objeto | BFLA = Função',
    trick: '"B-O-LA acessa o objeto errado. B-F-LA acessa a função errada."',
    explanation: 'BOLA: usuário acessa o recurso de outro (objeto) via endpoint legítimo. BFLA: usuário acessa endpoint que não deveria (função) independente do objeto. São verificações independentes: ownership (BOLA) + role (BFLA).',
    expansion: [],
    example: "",
    why: "",
  },
  {
    label: 'SSRF = Servidor Vira Fantoche',
    trick: '"SSRF: o Servidor faz Seus Requests Favoritos."',
    explanation: 'No SSRF, o atacante não faz o request diretamente — ele convence o servidor a fazer por ele. O servidor acessa IPs internos inacessíveis externamente, como metadados EC2 (169.254.169.254). O servidor virou um fantoche do atacante.',
    expansion: [],
    example: "",
    why: "",
  },
  {
    label: 'Mass Assignment = req.body mata',
    trick: '"req.body direto no ORM é arma carregada — dispara campo proibido."',
    explanation: 'Passar req.body direto ao ORM sem filtrar é como salvar tudo que o cliente mandar, incluindo role: "admin". A solução é simples: desestruture apenas os campos permitidos. DTOs explícitos são a armadura contra Mass Assignment.',
    expansion: [],
    example: "",
    why: "",
  },
  {
    label: 'API9 = Zumbi Invade | API Shadow = Fantasma',
    trick: '"Zumbis (APIs antigas) e Fantasmas (APIs shadow) atacam quando você não está olhando."',
    explanation: 'APIs zumbi são versões antigas que continuam acessíveis sem atualização de segurança. Shadow APIs são endpoints criados sem processo formal. Ambas aparecem na superfície de ataque mas somem dos dashboards de monitoramento. Inventário ativo é a única defesa.',
    expansion: [],
    example: "",
    why: "",
  },
  {
    label: 'OWASP API Top 10 — Ordem de Prioridade Crítica',
    trick: '"Os 3 primeiros matam: BOLA mata dados, Auth mata sessão, Mass Assignment mata integridade."',
    explanation: 'API1 (BOLA), API2 (Auth), API3 (BOPLA) são sempre os mais explorados porque são diretos, fáceis de testar e têm alto impacto. Priorize implementar verificação de ownership, autenticação robusta e DTOs explícitos antes de qualquer outra medida de segurança de API.',
    expansion: [],
    example: "",
    why: "",
  },
]

// ── Builders ──────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'OWASP API Top 10',
    stackLabel: 'Segurança de APIs',
  }),
  security: () => buildSecurityChecklistPdf({
    checks: SEC_CHECKS,
    skillName: 'OWASP API Top 10',
    accentColor: C,
    stackLabel: 'Segurança de APIs — 2023',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'OWASP API Top 10',
    accentColor: C,
    stackLabel: 'Segurança de APIs',
    sections: {
      hooks: [
        { name: 'API1 — BOLA', sig: 'if (obj.userId !== req.user.id) → 403', desc: 'Quando: Todo endpoint que acessa objeto por ID. Evitar: Retornar sem verificar ownership.' },
        { name: 'API2 — Broken Auth', sig: 'JWT RS256 + rotação refresh + invalidação logout', desc: 'Quando: Toda autenticação de API. Evitar: alg:none, HS256 fraco, sem expiração.' },
        { name: 'API3 — Mass Assignment', sig: 'const { name, email } = req.body', desc: 'Quando: Todo endpoint que recebe body. Evitar: User.update(id, req.body).' },
        { name: 'API4 — Rate Limit', sig: 'rateLimit({ windowMs, max })', desc: 'Quando: /login, /register, endpoints públicos. Evitar: Endpoints sem throttling.' },
        { name: 'API5 — BFLA', sig: 'if (!user.roles.includes("admin")) → 403', desc: 'Quando: Todo endpoint com restrição de role. Evitar: Verificar role só no frontend.' },
        { name: 'API6 — Business Flow', sig: 'Limites de negócio: qty >= 1, max coupons = 1', desc: 'Quando: Fluxos de compra, cupons, referrals. Evitar: Confiar em rate limit genérico para semântica de negócio.' },
        { name: 'API7 — SSRF', sig: 'ALLOWED_DOMAINS.has(host) + isPrivateIP check', desc: 'Quando: Endpoints que aceitam URLs de usuário. Evitar: fetch(userProvidedUrl) sem validação.' },
        { name: 'API8 — Misc Config', sig: 'CORS allowlist + security headers + no stack traces', desc: 'Quando: Toda API em produção. Evitar: Access-Control-Allow-Origin: * com credentials.' },
        { name: 'API9 — Shadow APIs', sig: 'Inventário + sunset headers + remover v1/v2 legacy', desc: 'Quando: Versionamento de API. Evitar: Deixar versões antigas acessíveis sem auth.' },
        { name: 'API10 — 3rd Party', sig: 'schema.parse(await fetch(url).then(r => r.json()))', desc: 'Quando: Toda integração com API externa. Evitar: Usar resposta de API externa sem validação de schema.' },
      ],
      depRows: [],
      rules: [
        { ok: true, t: 'Autenticação + Autorização são independentes — ambas server-side' },
        { ok: true, t: 'Verificar ownership (BOLA) E role (BFLA) em cada operação sensível' },
        { ok: true, t: 'Nunca confiar em controle de acesso do cliente' },
        { ok: true, t: 'DTOs explícitos de entrada E saída — nunca serializar ORM direto' },
        { ok: true, t: 'Rate limiting em endpoints de autenticação é obrigatório' },
      ],
      performanceTips: [
        'Cache de verificações de autorização frequentes (com TTL curto)',
        'Use RLS do PostgreSQL para multi-tenant — delega verificação ao banco',
        'Persisted queries no GraphQL reduzem superfície de ataque e melhoram performance',
        'Circuit breaker em chamadas a APIs externas protege contra cascata e SSRF indireto',
      ],
      patterns: [],
      mentalModels: [
        'Hotel: autenticação = chave válida; BOLA = só abre seu quarto; BFLA = não abre a sala de máquinas',
        'BOLA = objeto errado | BFLA = função errada | BOPLA = campo errado',
        'SSRF: servidor virou fantoche — acessa o que o atacante quer via rede interna',
        'req.body direto no ORM é arma carregada — sempre desestruturar campos permitidos',
      ],
    },
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'OWASP API Top 10',
    stackLabel: 'Segurança de APIs',
  }),
}

// ── Componente principal ───────────────────────────────────────────────────────

export default function OwaspPdfs() {
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
