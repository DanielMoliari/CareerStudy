'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'
import { buildMindmapPdf } from '@/components/pdfs/MindmapPdf'
import type { MindmapCategory } from '@/components/pdfs/MindmapPdf'
import { buildCheatsheetPdf } from '@/components/pdfs/CheatsheetPdf'
import type { HookItem, RuleItem } from '@/components/pdfs/CheatsheetPdf'

// ── Paleta Threat Modeling ─────────────────────────────────────────────────────
const C    = '#ef4444'   // vermelho segurança — NUNCA omitir, default seria cyan React
const PRP  = '#a855f7'
const SKY  = '#38bdf8'
const AMB  = '#f59e0b'
const GRN  = '#22c55e'
const ORG  = '#f97316'
const BLU  = '#3b82f6'

// ── Metadados dos PDFs ─────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas sobre Threat Modeling em entrevista',
    type: 'qa',
    pages: 10,
    description: 'Recuperação ativa: STRIDE completo, trust boundaries, attack trees, ADRs de segurança, processo ágil, priorização por Likelihood × Impact, SSRF, defense in depth, relação com OWASP A04 e tudo que entrevistadores sênior de segurança e arquitetura realmente perguntam.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet',
    subtitle: 'STRIDE, DFD, processo ágil e controles numa referência',
    type: 'cheatsheet',
    pages: 3,
    description: 'Referência densa: STRIDE com controles por categoria, os 4 elementos do DFD, processo incremental por feature (5 passos), matriz Likelihood × Impact, ferramentas (Threat Dragon, Microsoft TMT) e as regras críticas que times esquecem.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'Os 5 truques que grudam Threat Modeling na memória',
    type: 'mnemonics',
    pages: 2,
    description: 'STRIDE por âncora verbal, trust boundaries como "toda fronteira exige inspeção", os 4 elementos do DFD, custo de correção por fase (design < dev < produção) e a matriz de priorização.',
    icon: '03',
    goal: 'Memória de longo prazo',
  },
  {
    id: 'mindmap',
    title: 'Mind Map',
    subtitle: 'Threat Modeling do zero ao sênior em uma folha',
    type: 'mindmap',
    pages: 2,
    description: 'Mapa mental completo com 6 categorias (STRIDE, DFD, Attack Trees, Processo Ágil, Priorização, Ferramentas) e checklist de 10 perguntas para auto-avaliar o domínio antes de entrevista.',
    icon: '04',
    goal: 'Mapeamento mental',
  },
]

// ── Dados: Q&A ─────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Senior',
    q: 'Explique STRIDE e como você o aplicaria a um endpoint de login.',
    a: 'STRIDE: S = Spoofing (fingir ser outro), T = Tampering (modificar dados), R = Repudiation (negar ações), I = Information Disclosure (expor dados), D = Denial of Service (indisponibilidade), E = Elevation of Privilege (mais permissões). Para POST /auth/login: S = JWT forjado? → bcrypt + RS256 + MFA; T = payload interceptado? → HTTPS obrigatório; R = log com IP + timestamp? → auditoria imutável; I = erro diferencia "usuário não existe" de "senha errada"? → não deveria; D = rate limit por IP e usuário? → brute force prevention; E = login dá acesso admin sem verificação de role? → BFLA check.',
    tip: 'Aplicar a um exemplo concreto demonstra uso real. O detalhe de informação disclosure (mensagem diferente) é o que mostra nível sênior.',
  },
  {
    level: 'Senior',
    q: 'O que é um trust boundary em um DFD e por que é central ao threat modeling?',
    a: 'Trust boundary é o limite entre zonas com diferentes níveis de confiança: internet vs. DMZ, DMZ vs. rede interna, processo com privilege vs. sem privilege. No DFD é representado como linha pontilhada. Importância: ameaças geralmente cruzam trust boundaries — dados vindo da internet para um processo devem ser validados e autenticados porque vêm de zona não confiável. Erro comum: assumir que rede interna = confiável. Microserviços internos também precisam validar input de outros microserviços — movimento lateral existe.',
    tip: 'O ponto sobre rede interna não ser confiável é de nível sênior. Mencionar movimento lateral demonstra que você pensa em segurança de forma sistêmica.',
  },
  {
    level: 'Senior',
    q: 'Como você integraria threat modeling em um time ágil sem processo pesado?',
    a: 'Trigger claro: feature com novo endpoint, nova integração externa, mudança de auth → 30-60 min antes de codar. Processo: (1) DFD mínimo dos novos fluxos; (2) STRIDE nos trust boundaries; (3) ameaças viram critérios de DoD ou bugs de segurança com prioridade. Ferramentas: OWASP Threat Dragon para DFDs, GitHub Issues para rastrear. Ponto-chave: threat modeling antes de codar é 10x mais barato que corrigir depois. Ameaças como DoD garante que entrem no código — não viram backlog ignorado.',
    tip: 'Ameaças viram DoD (não backlog) é o detalhe de processo maduro. O argumento de 10x de custo justifica o investimento de 30-60 min para o PM.',
  },
  {
    level: 'Senior',
    q: 'Como threat modeling se relaciona com o A04 do OWASP Top 10?',
    a: 'A04 (Insecure Design, OWASP 2021) captura falhas de design que código correto não resolve. Exemplos: fluxo "esqueci a senha" confirma se e-mail existe (I disclosure by design), API retorna objeto completo do banco (I disclosure), lógica sem rate limiting no design. Threat modeling previne o A04 porque força análise de segurança antes de codificar — os requisitos de segurança entram no design como constraints, não como itens de backlog que nunca chegam à frente.',
    tip: 'Exemplo concreto de Insecure Design (fluxo de "esqueci a senha") transforma a resposta de teórica para experiencial. Essa conexão STRIDE → A04 é o que define visão sistêmica.',
  },
  {
    level: 'Senior',
    q: 'O que é um Attack Tree e quando usá-lo junto com STRIDE?',
    a: 'Attack Tree modela o objetivo do atacante como raiz, caminhos para alcançá-lo como nós. OR = qualquer caminho filho é suficiente. AND = todos devem falhar simultaneamente. Quando usar: STRIDE identifica categorias por componente; Attack Tree mostra como ameaças combinam para atingir objetivo maior. Exemplo: raiz = "comprometer conta admin" → OR → credenciais / session hijacking / SSRF. Insight de AND: implementar qualquer controle de um nó AND bloqueia aquele caminho — prioriza defesa em profundidade.',
    tip: 'A explicação de nós AND é o que diferencia sênior: mostra que você entende defesa em profundidade. Múltiplos controles AND = atacante precisa que todos falhem.',
  },
  {
    level: 'Senior',
    q: 'O que é SSRF e como você o identificaria em um threat model?',
    a: 'SSRF (Server-Side Request Forgery) ocorre quando a API aceita URLs do usuário e faz fetch sem validar o destino. No DFD: aparece como ameaça quando há fluxo "ator externo → fornece URL → processo faz fetch". Ameaças: acesso a metadados de cloud (169.254.169.254 em AWS retorna credenciais IAM temporárias), varredura de serviços internos sem autenticação, bypass de firewall. Mitigações: allowlist de domínios permitidos + bloquear IPs privados (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.169.254).',
    tip: 'O IP 169.254.169.254 específico de metadados AWS demonstra experiência prática. SSRF em cloud é devastador — esse detalhe mostra que você já trabalhou com infraestrutura AWS em produção.',
  },
  {
    level: 'Senior',
    q: 'Como você documenta ameaças para o time rastrear e revisitar?',
    a: 'Duas camadas: (1) ADR de segurança: contexto + decisão de mitigação + alternativas rejeitadas + consequências + quando revisitar. Versionado no repositório. Permite revisitar quando contexto muda. (2) Registro de ameaças: tabela com ID, categoria STRIDE, componente, descrição, likelihood, impact, status (open/in-progress/mitigated). GitHub Issues com label "security" funciona bem. Critério de revisita: DFD muda significativamente → reabrir threat model da área afetada.',
    tip: 'A combinação ADR + registro de ameaças mostra processo maduro. ADR captura o raciocínio; registro rastreia o status. Muitos times fazem o análise mas não documentam — sem isso, 6 meses depois ninguém sabe por que certas mitigações foram escolhidas.',
  },
  {
    level: 'Senior',
    q: 'Qual a diferença entre STRIDE e DREAD?',
    a: 'STRIDE classifica o tipo de ameaça (o que pode acontecer). DREAD era scoring numérico: Damage, Reproducibility, Exploitability, Affected users, Discoverability — nota 0-10, média = prioridade. A Microsoft descontinuou porque era excessivamente subjetivo (dois engenheiros davam notas completamente diferentes) e criava falsa precisão numérica. Hoje: matriz simples Likelihood × Impact (alto/médio/baixo) para priorizar ameaças identificadas pelo STRIDE.',
    tip: 'Saber que DREAD foi descontinuado e por quê demonstra conhecimento atualizado. A crítica de "falsa precisão" é o insight sofisticado que impressiona.',
  },
  {
    level: 'Senior',
    q: 'Como o princípio de "defense in depth" manifesta-se no threat modeling?',
    a: 'Defense in depth nos Attack Trees: se o caminho de ataque requer que múltiplos controles AND falhem simultaneamente, você tem defesa em profundidade. Se qualquer nó OR sozinho é suficiente, há ponto único de falha. Para credenciais: Layer 1 = senha + bcrypt, Layer 2 = MFA, Layer 3 = rate limiting, Layer 4 = alertas de novo dispositivo, Layer 5 = refresh token rotation. Para cada ameaça de alto impacto, verificar se há ≥2 controles independentes. Se apenas 1, é single point of failure de segurança.',
    tip: 'Conectar defense in depth com nós AND do Attack Tree é elegante — demonstra pensamento integrado entre conceitos. Essa ligação é o que define entendimento profundo versus decoreba.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre ameaça, vulnerabilidade e risco em threat modeling?',
    a: 'Ameaça: o que pode acontecer — ação de agente ou evento. Ex: "atacante intercepta JWT". É o que STRIDE categoriza. Vulnerabilidade: a fraqueza que torna a ameaça possível. Ex: "token transmitido sem TLS". É a causa técnica. Risco: probabilidade + impacto. Ex: "alta probabilidade × impacto alto = prioridade crítica". Uma ameaça pode ter múltiplas vulnerabilidades subjacentes. Threat modeling identifica ameaças; análise de vulnerabilidades detalha causas; scoring prioriza qual mitigar primeiro.',
    tip: 'A distinção em 3 camadas é fundamental e frequentemente confundida. Exemplos concretos da mesma situação em três níveis demonstram clareza conceitual.',
  },
  {
    level: 'Pleno',
    q: 'Como você priorizaria ameaças quando há muitas identificadas?',
    a: 'Processo em 3 passos: (1) Likelihood × Impact: Alta × Alto = prioridade crítica; Alta × Baixo ou Baixa × Alto = média; Baixa × Baixo = aceitar ou monitorar. (2) Custo de mitigação: ameaças de alto risco com mitigação barata vêm primeiro. "Rate limiting faltando" (1 sprint) antes de "criptografia em repouso" (3 sprints). (3) Dependências: algumas mitigações bloqueiam múltiplas ameaças. JWT correto mitiga Spoofing + Elevation + parcialmente Info Disclosure. Anti-padrão: tentar mitigar tudo de uma vez. Aceitar riscos baixos explicitamente com registro é decisão de engenharia válida.',
    tip: 'Aceitar riscos explicitamente com registro é sofisticado — mostra que você entende que segurança é gestão de risco, não eliminação de risco. Risco zero não existe.',
  },
  {
    level: 'Pleno',
    q: 'Descreva um threat model básico para um sistema de pagamento.',
    a: 'DFD: ator externo (usuário) → trust boundary → processo (API pagamento) → trust boundary → banco de dados + ator externo (gateway). STRIDE: S = forja identidade de outro para pagar? → JWT verificado + 3DS; T = payload interceptado/alterado? → HTTPS + webhook signature; R = log imutável com userId, valor, timestamp, IP? → chargebacks; I = resposta inclui dados de cartão? → PCI-DSS proíbe, apenas token do gateway; D = requests ilimitados criam cobranças em cascata? → rate limit + idempotency keys; E = usuário aciona reembolso sem ser dono? → BFLA com ownership check.',
    tip: 'Idempotency keys são item de segurança (evita double-charge), não só de UX — esse insight demonstra experiência com domínio financeiro. Mencionar PCI-DSS é o detalhe que diferencia.',
  },
  {
    level: 'Pleno',
    q: 'Como threat modeling interacts com code review e SAST?',
    a: 'São camadas complementares, não substitutas. Threat modeling: design — identifica ameaças de arquitetura e fluxo antes de qualquer código. Detecta Insecure Design (A04). SAST: durante/após desenvolvimento — vulnerabilidades de implementação: SQL injection, XSS, hardcoded secrets. Code review: lógica incorreta, validação ausente, edge cases. O threat model informa o que o code reviewer e SAST devem priorizar: "threat model identificou risco de BOLA → revisor, verifique ownership check em cada endpoint de leitura".',
    tip: 'A explicação de que cada camada detecta problemas em fases diferentes é o insight-chave. Threat model não substitui SAST nem vice-versa — mas informa onde cada um deve focar.',
  },
  {
    level: 'Senior',
    q: 'Como você avalia o nível de cobertura de um threat model?',
    a: 'Critérios de cobertura adequada: (1) trust boundaries todas mapeadas; (2) STRIDE aplicado nos fluxos de risco (dados sensíveis, autenticação, integrações externas); (3) ameaças de alto impacto rastreadas com status; (4) mitigações verificáveis em code review. Quando parar: 60% de cobertura antes de codar é infinitamente mais valioso que 100% feito após o lançamento. O objetivo não é exaustividade — é capturar os riscos que importam antes de codar.',
    tip: '"60% antes > 100% depois" é poderosa e verdadeira. Mostra que você entende o ROI real do threat modeling versus o perfeccionismo que paralisa times.',
  },
  {
    level: 'Senior',
    q: 'Como threat modeling se relaciona com conformidade (LGPD, PCI-DSS, SOC 2)?',
    a: 'Threat modeling alimenta conformidade: DFD mostra onde dados sensíveis fluem (escopo de PCI-DSS) ou dados pessoais (LGPD → RIPD). Mitigações STRIDE geram evidências de controles de segurança exigidos por SOC 2. Conformidade direciona threat modeling: PCI-DSS exige análise de ameaças periódica (Req 12.3.1). LGPD exige RIPD — similar a threat model focado em privacidade. SOC 2 Type II exige demonstração de controles em operação. Prática: use o threat model para gerar evidências de conformidade.',
    tip: 'Conectar com LGPD (RIPD) é especialmente relevante no Brasil. Mostrar que você entende tanto a prática técnica quanto o contexto regulatório define maturidade de sênior que trabalha com produtos reais.',
  },
  {
    level: 'Senior',
    q: 'Quais ferramentas você usa para threat modeling?',
    a: 'OWASP Threat Dragon: open source, web/desktop, DFDs com trust boundaries, STRIDE por fluxo, exporta JSON — ideal para times com budget limitado, integra ao repositório. Microsoft Threat Modeling Tool: gratuito, desktop Windows, templates Azure e GenAI (STRIDE-LM), gera lista automática por tipo de componente — melhor no ecossistema Microsoft/Azure. IriusRisk: pago, enterprise, integra Jira, múltiplos frameworks — para organizações com AppSec dedicado. Para threat models de feature (30-60 min): draw.io com formas DFD sem overhead de ferramenta especializada.',
    tip: 'Mencionar draw.io para threat models de feature é prático — mostra que você prioriza velocidade quando adequado. Não é sobre usar a ferramenta certa, é sobre fazer o threat model.',
  },
  {
    level: 'Senior',
    q: 'Como threat modeling se aplica a sistemas com IA/LLM?',
    a: 'Ameaças novas que STRIDE cobre parcialmente: Prompt injection = Tampering + Elevation (input manipula comportamento do modelo além do escopo autorizado). Data exfiltration via LLM = Information Disclosure (modelo pode revelar dados do contexto). Jailbreak = Elevation of Privilege. No DFD: LLM é processo com trust boundary especial — recebe input não estruturado do ator externo, output é não-determinístico. Mitigações: separar dados estruturados de input do LLM, nunca incluir credenciais no system prompt, validar output com schema validation (Zod), output sanitization.',
    tip: 'Saber aplicar threat modeling a LLMs é raro. Prompt injection como Tampering+Elevation é a categorização correta. Demonstra que você está antenado na evolução da segurança.',
  },
  {
    level: 'Pleno',
    q: 'O que é PASTA e quando usá-lo em vez de STRIDE?',
    a: 'PASTA (Process for Attack Simulation and Threat Analysis) é um framework de 7 estágios orientado a risco de negócio: (1) objetivos de negócio e segurança, (2) escopo técnico, (3) decomposição da aplicação, (4) análise de ameaças, (5) análise de vulnerabilidades, (6) emulação de ataque, (7) análise de risco e impacto. STRIDE: focado em ameaças técnicas por componente — rápido, ideal para times de desenvolvimento. PASTA: integra perspectiva de negócio e emulação — para organizações com AppSec dedicado. Regra: time pequeno + security champion = STRIDE. Org grande + equipe AppSec = PASTA.',
    tip: 'Conhecer PASTA com critério claro de quando usá-lo demonstra amplitude. A maioria dos candidatos só conhece STRIDE — mencionar PASTA mostra pesquisa além do básico.',
  },
  {
    level: 'Senior',
    q: 'Como você lida com Repudiation em sistemas distribuídos?',
    a: 'Repudiation é a R mais esquecida do STRIDE. Em sistemas distribuídos: (1) Logs de auditoria imutáveis: append-only, sem UPDATE/DELETE, com userId + ação + timestamp + IP + correlation ID; (2) Correlation ID propagado entre todos os serviços — reconstruir chain de eventos; (3) Assinatura digital para operações críticas (transferências financeiras); (4) Outbox pattern para garantir que logs cheguem ao sistema de auditoria mesmo em falhas parciais (consistency eventual do log é inaceitável para auditoria). Tooling: CloudTrail, Datadog, SIEM centralizado.',
    tip: 'O outbox pattern para logs de auditoria é um detalhe de produção que impressiona. Garantir que logs não se percam em falhas parciais é o que diferencia quem já operou sistemas distribuídos em produção.',
  },
  {
    level: 'Pleno',
    q: 'Como você faria threat model de uma API de upload de arquivos?',
    a: 'DFD: Ator externo → trust boundary → Processo (Upload API) → Datastore (S3) + Processo (File processor). STRIDE: S = upload em nome de outro? → JWT + quota por userId; T = arquivo modificado em trânsito? → HTTPS + hash de integridade; R = usuário nega upload malicioso? → log com userId + hash + timestamp; I = arquivo de outro usuário acessível? → URLs pré-assinadas S3 com expiração + ownership check; D = upload gigante esgota storage? → limite de tamanho, throttling, quota total; E = arquivo .exe renomeado como .jpg processado? → validação MIME type real (magic bytes, não extensão). Ameaças adicionais: path traversal em nomes de arquivo, zip bomb se descompressão server-side.',
    tip: 'Validação de MIME type via magic bytes (não extensão) é detalhe de segurança importante. Zip bomb para uploads com descompressão é o edge case que demonstra que você pensou nos casos não óbvios.',
  },
  {
    level: 'Pleno',
    q: 'Como você faria threat model de um sistema de autenticação com MFA?',
    a: 'DFD: Ator externo → trust boundary → Auth API → trust boundary → User DB + Session Cache + Audit Log. STRIDE: S = JWT forjado ou alg:none aceito? → RS256 verificado, rejeitar alg:none; T = credenciais em trânsito? → HTTPS; R = login não logado? → auditoria imutável userId+IP+timestamp+userAgent; I = resposta diferencia "usuário não existe"? → mensagem genérica; D = brute force? → rate limit por IP e por usuário; E = race condition no TOTP? → marcar código como usado em Redis com TTL = window TOTP. Attack Tree: raiz = "comprometer conta" → credenciais/session hijacking/TOTP bypass.',
    tip: 'Race condition no TOTP (mesmo código aceito duas vezes) é o edge case menos óbvio — demonstra análise profunda. Mencionar a solução (Redis TTL) mostra que você pensa em mitigação, não só em identificar ameaças.',
  },
]

// ── Dados: CheatSheet ───────────────────────────────────────────────────────────

const CHEATSHEET_HOOKS: HookItem[] = [
  { name: 'S — Spoofing', sig: 'Fingir ser outro ator (usuário, serviço, IP)', desc: 'Controles: autenticação forte, MFA, JWT RS256 (nunca HS256 com segredo compartilhado), mTLS entre microserviços, invalidação de token comprometido.' },
  { name: 'T — Tampering', sig: 'Modificar dados em trânsito ou em repouso', desc: 'Controles: TLS obrigatório, HMAC em webhooks/filas, constraints de integridade no banco, validação de schema de entrada, WAF para injection.' },
  { name: 'R — Repudiation', sig: 'Negar que uma ação ocorreu', desc: 'Controles: logs de auditoria imutáveis (append-only) com userId + ação + timestamp + IP + correlation ID, assinatura digital para operações críticas.' },
  { name: 'I — Info Disclosure', sig: 'Exposição de dados não autorizados', desc: 'Controles: BOLA verification, DTOs explícitos (nunca retornar objeto completo), erros genéricos em produção, não logar PII/tokens, criptografia em repouso.' },
  { name: 'D — Denial of Service', sig: 'Tornar o sistema indisponível', desc: 'Controles: rate limiting por IP e por usuário autenticado, limite de tamanho de payload, timeouts em queries e chamadas externas, circuit breakers, paginação obrigatória.' },
  { name: 'E — Elevation of Privilege', sig: 'Obter mais permissões do que o autorizado', desc: 'Controles: verificação de role server-side (BFLA), verificação de ownership (BOLA), least privilege em IAM/DB, deny-by-default em endpoints privilegiados.' },
  { name: 'DFD — Ator Externo', sig: 'Usuário, sistema de terceiro, parceiro', desc: 'Sempre fora de qualquer trust boundary. Nenhum dado vindo de ator externo é confiável sem validação e autenticação.' },
  { name: 'DFD — Processo', sig: 'Serviço, função, microserviço', desc: 'Transforma e processa dados. Verificar que cada processo tem apenas as permissões necessárias para sua função (least privilege).' },
  { name: 'DFD — Datastore', sig: 'Banco, fila, cache, arquivo', desc: 'Persiste dados. Verificar quem pode ler/escrever. Acessível apenas por processos autorizados — nunca diretamente da internet.' },
  { name: 'Trust Boundary', sig: 'Linha pontilhada no DFD entre zonas de confiança diferentes', desc: 'Ameaças geralmente cruzam trust boundaries. Todo dado que cruzar deve ser validado e autenticado. Rede interna não é sinônimo de confiável.' },
]

const CHEATSHEET_RULES: RuleItem[] = [
  { ok: false, t: 'Rede interna = confiável — microserviço interno também pode ser comprometido' },
  { ok: false, t: 'Threat model feito após o lançamento — 100x mais caro que no design' },
  { ok: false, t: 'DREAD para scoring — foi descontinuado por criar falsa precisão numérica' },
  { ok: false, t: 'Esquecer a R do STRIDE — Repudiation é a categoria mais ignorada' },
  { ok: false, t: 'Threat model perfeito em vez de 60% antes de codar — exaustividade paralisa' },
  { ok: true, t: 'STRIDE aplicado a cada trust boundary do DFD — foco onde ameaças cruzam' },
  { ok: true, t: 'Ameaças viram critérios de DoD — não backlog que nunca é implementado' },
  { ok: true, t: 'Likelihood × Impact para priorizar — simples e honesto' },
  { ok: true, t: 'ADR documenta decisões de mitigação com alternativas rejeitadas' },
  { ok: true, t: 'Logs de auditoria imutáveis (append-only) planejados antes de ir para produção' },
]

// ── Dados: Mnemônicos ──────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'STRIDE — "Sei Tudo Rir Incomoda Defensores Experientes"',
    trick: 'S-T-R-I-D-E',
    expansion: [
      ['S', 'Spoofing — fingir ser outro (auth + MFA)'],
      ['T', 'Tampering — modificar dados (TLS + HMAC)'],
      ['R', 'Repudiation — negar ação (audit logs imutáveis)'],
      ['I', 'Information Disclosure — vazar dados (DTOs + BOLA)'],
      ['D', 'Denial of Service — derrubar sistema (rate limit)'],
      ['E', 'Elevation of Privilege — subir permissão (BFLA + least priv)'],
    ],
    explanation: 'As 6 categorias do framework Microsoft de threat modeling. Aplicar a cada componente do DFD, especialmente nos trust boundaries.',
    example: 'POST /login: S = JWT forjado? T = HTTPS? R = log com IP? I = erro genérico? D = rate limit? E = role check?',
    why: 'STRIDE é A pergunta de threat modeling em entrevistas sênior de segurança e arquitetura. Saber aplicar a um exemplo concreto é o diferencial.',
  },
  {
    label: 'Trust Boundaries — "Toda Fronteira Exige Inspeção Total"',
    trick: 'TFEIT — fronteiras exigem inspeção total',
    expansion: [
      ['T = Toda', 'Toda trust boundary, sem exceção'],
      ['F = Fronteira', 'Onde dados cruzam entre zonas de confiança diferente'],
      ['E = Exige', 'Validação e autenticação são obrigatórias'],
      ['I = Inspeção', 'Schema validation, auth check, rate limit'],
      ['T = Total', 'Rede interna também é fronteira — microserviços internos também atacam'],
    ],
    explanation: 'Ameaças geralmente cruzam trust boundaries. Cada cruzamento é um ponto de análise obrigatório no STRIDE.',
    example: 'Internet → API = trust boundary: validar schema + autenticar JWT. API → Microserviço interno = trust boundary: mTLS ou service-to-service auth.',
    why: 'O erro mais comum de times é assumir que rede interna = confiável. Isso é o vetor de movimento lateral que compromete sistemas após o primeiro serviço ser comprometido.',
  },
  {
    label: 'DFD — "Atores Processam Dados Fluindo"',
    trick: 'APDF — os 4 elementos do DFD',
    expansion: [
      ['A = Atores externos', 'Usuários, sistemas de terceiros — sempre fora de trust boundary'],
      ['P = Processos', 'Serviços, funções — transforma dados'],
      ['D = Datastores', 'Banco, cache, fila — persiste dados'],
      ['F = Fluxos', 'Conexões entre os elementos — analisar os que cruzam trust boundaries'],
    ],
    explanation: 'Todo DFD tem 4 elementos mais trust boundaries (linhas pontilhadas). O threat model foca nos fluxos que cruzam trust boundaries.',
    example: 'Usuário (Ator) → POST /payment (Fluxo) → API (Processo) → Trust Boundary → PostgreSQL (Datastore)',
    why: 'O DFD é a base do threat model. Sem mapear os 4 elementos e as trust boundaries, você não sabe onde aplicar o STRIDE.',
  },
  {
    label: 'Custo de correção — "Design Barato, Deploy Médio, Produção Caro"',
    trick: 'D-D-P — custo 1x : 10x : 100x',
    expansion: [
      ['D = Design', '1x — requisito de segurança antes de codar. Gratuito quase.'],
      ['D = Deploy', '10x — bug encontrado em PR review ou QA. Dias de trabalho.'],
      ['P = Produção', '100x — vulnerabilidade explorada em produção. Semanas + reputação.'],
    ],
    explanation: 'O ROI do threat modeling: 30 min de análise antes de codar evita semanas de resposta a incidente. É o argumento para convencer PM e time.',
    example: 'SSRF não identificada no design → explorada em produção → credenciais IAM comprometidas → resposta de incidente de 2 semanas.',
    why: 'Justificar 30-60 min de threat model por feature para product managers e times resistentes. Número concreto (100x) é mais convincente que "é importante para segurança".',
  },
  {
    label: 'Priorização — "Alto Alto Agora, Baixo Baixo Aceita"',
    trick: 'AABA — Likelihood × Impact matrix',
    expansion: [
      ['AA = Alto × Alto', 'Prioridade crítica — corrigir antes do próximo deploy'],
      ['AM/MA = misto', 'Prioridade média — próximo sprint'],
      ['MB/BM = baixo', 'Prioridade baixa — backlog ou monitorar'],
      ['BB = Baixo × Baixo', 'Aceitar o risco explicitamente — documentar a decisão'],
    ],
    explanation: 'Substituiu DREAD (descontinuado por subjetividade). Simples, honesto, suficiente para priorizar 95% dos casos.',
    example: '"JWT sem verificação de assinatura" = Alta probabilidade × Alto impacto → corrigir agora. "Brute force em endpoint interno de métricas" = Baixa × Baixo → aceitar com monitoramento.',
    why: 'DREAD criava debates intermináveis sobre números. Likelihood × Impact com alto/médio/baixo é suficiente e mais rápido. A decisão de aceitar risco é tão importante quanto a de mitigar.',
  },
]

// ── Dados: Mind Map ─────────────────────────────────────────────────────────────

const MINDMAP_CATEGORIES: MindmapCategory[] = [
  {
    label: 'STRIDE',
    color: C,
    items: [
      { t: 'S = Spoofing → Auth + MFA + mTLS', k: true },
      { t: 'T = Tampering → TLS + HMAC', k: true },
      { t: 'R = Repudiation → Audit logs imutáveis', k: true },
      { t: 'I = Info Disclosure → DTO + BOLA', k: true },
      { t: 'D = DoS → Rate limit + circuit breaker', k: true },
      { t: 'E = Elevation → BFLA + least privilege', k: true },
    ],
  },
  {
    label: 'DFD',
    color: ORG,
    items: [
      { t: 'Ator Externo (usuários, terceiros)', k: true },
      { t: 'Processo (serviços, funções)', k: true },
      { t: 'Datastore (banco, cache, fila)', k: true },
      { t: 'Fluxo de dados (conexões)', k: true },
      { t: 'Trust Boundaries (linhas pontilhadas)', k: true },
      { t: 'Ferramentas: Threat Dragon, draw.io', a: true },
    ],
  },
  {
    label: 'Attack Trees',
    color: PRP,
    items: [
      { t: 'Raiz = objetivo do atacante', k: true },
      { t: 'OR = qualquer caminho basta', k: true },
      { t: 'AND = múltiplos devem falhar', k: true },
      { t: 'Complementa STRIDE (objetivos complexos)', a: true },
      { t: 'Defense in depth via AND nodes', a: true },
    ],
  },
  {
    label: 'Processo Ágil',
    color: GRN,
    items: [
      { t: 'Trigger: feature com auth/dados/integração', k: true },
      { t: '30-60 min antes de codar', k: true },
      { t: 'DFD mínimo da feature', k: true },
      { t: 'STRIDE nos trust boundaries', k: true },
      { t: 'Ameaças viram critérios de DoD', k: true },
      { t: 'ADR documenta decisões', a: true },
    ],
  },
  {
    label: 'Priorização',
    color: AMB,
    items: [
      { t: 'Likelihood × Impact (não DREAD)', k: true },
      { t: 'Alto × Alto → corrigir agora', k: true },
      { t: 'DREAD descontinuado (subjetivo)', a: true },
      { t: 'Aceitar risco baixo com registro', k: true },
    ],
  },
  {
    label: 'Contexto',
    color: BLU,
    items: [
      { t: 'OWASP A04 Insecure Design (2021)', k: true },
      { t: 'Falhas de design > bugs de código', k: true },
      { t: 'Custo: 1x design, 10x dev, 100x prod', k: true },
      { t: 'PASTA: alternativa enterprise', a: true },
      { t: 'SSRF → 169.254.169.254 (AWS creds)', a: true },
      { t: 'LGPD/PCI-DSS: threat model gera evidências', a: true },
    ],
  },
]

const MINDMAP_CHECKLIST = [
  'Consigo aplicar STRIDE a um endpoint qualquer de cabeça?',
  'Sei desenhar um DFD com os 4 elementos e trust boundaries?',
  'Entendo a diferença entre ameaça, vulnerabilidade e risco?',
  'Sei o que é BOLA e BFLA e como mitigar cada um?',
  'Consigo fazer threat model de um sistema de pagamento?',
  'Sei por que DREAD foi descontinuado e o que usa no lugar?',
  'Entendo como Attack Trees complementam STRIDE?',
  'Sei como integrar threat modeling em um time ágil (triggers, processo, DoD)?',
  'Consigo justificar o ROI de 30 min de threat model para um PM?',
  'Sei identificar SSRF em um DFD e quais IPs bloquear em AWS?',
]

// ── Builders ───────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'Threat Modeling',
    stackLabel: 'Security · Design',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'Threat Modeling',
    accentColor: C,
    stackLabel: 'Security · Design',
    sections: {
      hooks: CHEATSHEET_HOOKS,
      depRows: [
        ['STRIDE', '6 categorias: Spoofing, Tampering, Repudiation, Info Disclosure, DoS, Elevation'],
        ['DFD', '4 elementos: Ator, Processo, Datastore, Fluxo + Trust Boundaries'],
        ['Attack Tree', 'Raiz = objetivo, OR/AND = caminhos, defense in depth'],
        ['Likelihood × Impact', 'Matriz de priorização simples — Alto×Alto = corrigir agora'],
        ['ADR de Segurança', 'Contexto + Decisão + Alternativas + Quando Revisitar'],
      ],
      rules: CHEATSHEET_RULES,
      performanceTips: [
        'Threat model antes de codar: 1x custo. Em produção: 100x.',
        '30-60 min por feature com trigger claro vale mais que sessão de 2 dias anual',
        'Ameaças viram critérios de DoD — não backlog que fica parado',
        'Rede interna não é confiável — microserviços internos precisam de auth também',
        'Aceitar risco baixo explicitamente com registro é decisão de engenharia válida',
        'Logs de auditoria (R do STRIDE) são os mais esquecidos — planejar antes de produção',
      ],
      patterns: [
        {
          name: 'STRIDE em 60 minutos por feature',
          code: `// 1. Trigger identificado
feature = "endpoint de pagamento"

// 2. DFD mínimo (whiteboard/draw.io)
// Ator → [TRUST BOUNDARY] → API → DB + Gateway

// 3. STRIDE nos trust boundaries
// S: JWT verificado? | T: HTTPS? | R: log auditoria?
// I: DTO explícito? | D: rate limit? | E: ownership check?

// 4. Ameaças viram critérios de DoD
// AC: "POST /payment deve verificar JWT RS256"
// AC: "Rate limit: máx 10 tentativas/min por userId"`,
          desc: 'Processo incremental para times ágeis',
        },
        {
          name: 'Log de auditoria imutável (Repudiation)',
          code: `// Tabela append-only — sem UPDATE/DELETE
CREATE TABLE audit_log (
  id UUID DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  resource_id TEXT,
  ip INET NOT NULL,
  correlation_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Revogar DELETE e UPDATE do service user
REVOKE DELETE, UPDATE ON audit_log FROM app_user;`,
          desc: 'Mitigação de Repudiation — a R mais esquecida do STRIDE',
        },
        {
          name: 'SSRF mitigation',
          code: `// Allowlist de domínios + bloqueio de IPs privados
const ALLOWED_DOMAINS = ['api.parceiro.com', 'webhook.stripe.com']
const PRIVATE_IP_RANGES = [
  /^10\\./, /^172\\.(1[6-9]|2\\d|3[01])\\./,
  /^192\\.168\\./, /^127\\./, /^169\\.254\\./ // metadados AWS
]

function validateUrl(url: string): boolean {
  const parsed = new URL(url)
  if (!ALLOWED_DOMAINS.includes(parsed.hostname)) return false
  // resolver IP e verificar ranges privados
  return !PRIVATE_IP_RANGES.some(r => r.test(resolvedIp))
}`,
          desc: '169.254.169.254 = credenciais IAM temporárias em AWS',
        },
      ],
      mentalModels: [
        'STRIDE = 6 categorias. DFD = 4 elementos + trust boundaries. Attack Tree = OR/AND.',
        'Ameaças geralmente cruzam trust boundaries — é onde focar a análise',
        'R (Repudiation) é a letra mais esquecida — logs imutáveis são críticos',
        'Custo: 1x design, 10x desenvolvimento, 100x produção. Threat model = ROI claro.',
        'BOLA = objeto errado (I+E). BFLA = função errada (E). Ambos verificam server-side.',
      ],
    },
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'Threat Modeling',
    stackLabel: 'Security · Design',
  }),
  mindmap: () => buildMindmapPdf({
    categories: MINDMAP_CATEGORIES,
    checklist: MINDMAP_CHECKLIST,
    accentColor: C,
    skillName: 'Threat Modeling',
    stackLabel: 'Security · Design',
    checklistTitle: 'Auto-avaliação pré-entrevista',
    checklistDesc: 'Responda SIM para pelo menos 8 antes de ir a uma entrevista de segurança ou arquitetura sênior.',
  }),
}

// ── Componente principal ───────────────────────────────────────────────────────

export default function ThreatModelingPdfs() {
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
