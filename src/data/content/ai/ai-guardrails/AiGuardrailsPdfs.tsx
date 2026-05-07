'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildQuickRefPdf } from '@/components/pdfs/QuickRefPdf'
import type { QuickRefColumn } from '@/components/pdfs/QuickRefPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'
import { buildMindmapPdf } from '@/components/pdfs/MindmapPdf'
import type { MindmapCategory } from '@/components/pdfs/MindmapPdf'

// ── Paleta AI Guardrails ───────────────────────────────────────────────────────
const C = '#ef4444'   // scarlet — segurança, risco

// ── Metadados dos PDFs ─────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A de Entrevista',
    subtitle: 'As 20 perguntas mais cobradas sobre AI Guardrails',
    type: 'qa',
    pages: 10,
    description: 'Recuperação ativa: prompt injection direta/indireta, PII pipeline, jailbreak, NeMo vs Guardrails AI vs Llama Guard, HITL, red-teaming, compliance LGPD, Constitutional AI. Cobre pleno e sênior.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'quick-ref',
    title: 'Quick Reference',
    subtitle: 'Guardrails por camada, ferramentas e checklist de segurança',
    type: 'quick-ref',
    pages: 2,
    description: 'Cartão de bolso: ferramentas por camada (input, agent loop, output), tipos de ataque com mitigation, compliance LGPD, red-teaming checklist.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: '3 truques para memorizar guardrails de forma permanente',
    type: 'mnemonics',
    pages: 3,
    description: 'IPO, STPO e DASL — os 3 acrônimos que cobrem camadas, mitigação de injection e pipeline de PII.',
    icon: '03',
    goal: 'Memorização',
  },
  {
    id: 'mindmap',
    title: 'Mind Map',
    subtitle: 'AI Guardrails do zero ao expert em uma folha',
    type: 'mindmap',
    pages: 2,
    description: 'Mapa mental com 6 domínios (Input Gate, Agent Loop, Output Gate, Ferramentas, Ataques, Compliance) e checklist de 10 perguntas para auto-avaliar a segurança do seu sistema LLM.',
    icon: '04',
    goal: 'Mapeamento mental',
  },
]

// ── Q&A Data ───────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Senior',
    q: 'Como você arquiteta guardrails para um agente em produção?',
    a: 'Três camadas: (1) Input gate: PII masking (Presidio), prompt injection detection (Lakera/NeMo), topic classifier. Executa antes de qualquer chamada ao LLM. (2) Agent loop: limite de iterações, allowlist de tools por contexto, human-in-the-loop para ações destrutivas (delete, pagamento), timeout por sessão. (3) Output gate: toxicity (LlamaGuard), schema validation (Zod/Pydantic), faithfulness check (RAGAS amostral) para RAG, PII re-check. Defense in depth — nenhuma camada sozinha é suficiente.',
    tip: 'Mencione as 3 camadas + "defense in depth". A maioria dos candidatos só fala input/output e esquece o agent loop — onde os maiores riscos ocorrem em sistemas autônomos.',
  },
  {
    level: 'Senior',
    q: 'Como evita prompt injection indireta?',
    a: 'Marque dados externos com tags XML: <user_input>, <document>, <email_content>. Instrua o modelo a nunca seguir instruções dentro dessas tags. Classifier de injeção (Lakera Guard) antes de enviar ao LLM. Principle of least privilege: tools só têm permissões mínimas. Output filter detecta se resposta indica que o modelo "seguiu" instrução do input externo. Sandboxing: cada tool call executa em contexto isolado.',
    tip: 'Prompt injection indireta (via RAG doc, email) é mais perigosa que direta porque o modelo processa sem saber que é adversarial. Mencionar esse ponto demonstra experiência real.',
  },
  {
    level: 'Senior',
    q: 'Como detecta hallucination em RAG em produção?',
    a: 'Faithfulness check (RAGAS): LLM-judge compara cada claim da resposta com os chunks recuperados. Roda em amostra de 1-5% das requests. Score abaixo de 0.8 → flag para revisão. Citation requirement: force o modelo a citar fonte para cada afirmação. Valida que a citação existe no contexto. Log-probabilities: tokens com log-prob muito baixo indicam geração especulativa. Casos de hallucination viram exemplos adversariais no eval set.',
    tip: 'Combinar faithfulness + citation + log-prob é abordagem sênior. Retroalimentar casos ruins no eval set demonstra loop de melhoria contínua.',
  },
  {
    level: 'Senior',
    q: 'PII no input — como trata ponta a ponta?',
    a: 'Pipeline: (1) Detection: Presidio detecta CPF, email, telefone, cartão, nome com NER + regex multilíngue. (2) Anonymization: substitui por placeholder (<CPF_1>). Mantém mapping reversível em memória/Redis com TTL curto. (3) Send to LLM: envia texto anonimizado. LLM nunca vê dados reais. (4) Reverse: se output contém placeholders, re-injeta dado original apenas para o usuário. (5) Log sanitization: logs armazenam apenas versão anonimizada com TTL de retenção.',
    tip: 'O mapping reversível com TTL é o que separa implementação real de teórica. Log sanitization é obrigatório para LGPD/GDPR — detalhe frequentemente esquecido.',
  },
  {
    level: 'Senior',
    q: 'Qual a diferença entre Guardrails AI, NeMo e Llama Guard?',
    a: 'Guardrails AI: schema/output validation com retry automático. Ideal para structured output e validação de tipo. NeMo Guardrails: fluxo conversacional declarativo (Colang), rails topical, jailbreak prevention. Ideal para chatbots enterprise com regras de negócio. Llama Guard: safety classifier fine-tuned (modelo Meta). Moderação de conteúdo input/output. Em produção real: combine os três — Llama Guard (safety) + Presidio (PII) + Guardrails AI (schema) + NeMo (topical/flow).',
    tip: 'A conclusão de que você combina as ferramentas é o que demonstra visão de sistema. Entrevistadores adoram quando candidatos não escolhem "um ou outro".',
  },
  {
    level: 'Senior',
    q: 'Como implementa human-in-the-loop em agentes de alto risco?',
    a: 'Padrão interrupt-and-wait: antes de ação irreversível, agente pausa e aguarda confirmação com timeout configurável. Async: serializa estado (LangGraph checkpointing) e aguarda evento humano. Autorização: confirmação precisa incluir autenticação — "ok" no mesmo canal vulnerável a injection é insuficiente. Allowlist de ações pré-aprovadas por role: só pede confirmação para ações fora da allowlist. Rollback capability: ações como soft delete ou draft antes de enviar.',
    tip: 'O detalhe da autenticação na confirmação humana é frequentemente ignorado. Um agente que aceita "ok" de qualquer input pode ser contornado por injection no canal de confirmação.',
  },
  {
    level: 'Senior',
    q: 'Como mede a eficácia dos guardrails?',
    a: 'False positive rate: % de requests legítimas bloqueadas — guardrail muito agressivo prejudica UX. False negative rate: % de ataques que passaram — monitorado via red-team periódico. Latência adicionada: cada guardrail adiciona p50/p99. Cost per guard: guardrails que chamam LLM (faithfulness check, LLM-as-judge) têm custo — rodar em amostra. Coverage: quais categorias de ataques estão no red-team set. Audit log: todo bloqueio logado com timestamp, guardrail ativado, input anonimizado.',
    tip: 'FP/FN trade-off é chave. Guardrails muito estritos têm alto FP, muito permissivos têm alto FN. Calibrar é trabalho contínuo — não é um set-and-forget.',
  },
  {
    level: 'Senior',
    q: 'Como você implementaria compliance LGPD em um pipeline de LLM?',
    a: 'Checklist LGPD para LLM: (1) Consentimento: usuário consente explicitamente com processamento via LLM. (2) PII masking: Presidio mascara antes de enviar ao provider externo. (3) DPA com provider: Anthropic/OpenAI assinaram DPA — verificar que dados de API não são usados para treino. (4) Log retention TTL: dados pessoais não ficam indefinidamente. (5) Right to erasure: pipeline de deletion em todos os stores (vetores, logs, caches). (6) On-prem: para saúde/financeiro, modelo local elimina risco de envio externo.',
    tip: 'DPA e right to erasure são frequentemente ignorados por devs. Mencionar demonstra visão de produto e compliance além do código.',
  },
  {
    level: 'Senior',
    q: 'Como você priorizaria guardrails em um MVP?',
    a: 'Prioridade por risco de negócio: (1) PII masking — risco legal imediato, Presidio setup em 1h. (2) Schema validation — evita crashes, Zod/Pydantic. (3) Prompt injection detection — especialmente com tools destrutivas. (4) Toxicity — risco de reputação. (5) Faithfulness RAG — se produto é RAG-based. (6) HITL para ações de alto risco. O que pode esperar pós-MVP: many-shot detection, red-teaming automatizado, constitutional AI fine-tuning.',
    tip: 'Priorizar por risco de negócio é abordagem sênior. PII e schema são sempre prioritários. Toxicity e faithfulness dependem do produto específico.',
  },
  {
    level: 'Senior',
    q: 'Como o Constitutional AI da Anthropic se relaciona com guardrails de runtime?',
    a: 'Constitutional AI é treinamento: o modelo aprende a auto-criticar e revisar respostas de acordo com princípios (constituição) via RLAIF. Reduz frequência de outputs problemáticos mas não os elimina. Guardrails de runtime (Llama Guard, Presidio, schema) são necessários para casos que escapam — modelo pode ser jailbroken, input pode ser adversarial, ou caso fora da distribuição de treino. Metáfora: CAI é o caráter do modelo; guardrails são as regras externas. Ambos são necessários.',
    tip: 'Concluir que CAI e guardrails são complementares (não substitutos) é a resposta correta. Entrevistadores da Anthropic adoram essa pergunta.',
  },
  {
    level: 'Pleno',
    q: 'O que é prompt injection e por que é perigosa?',
    a: 'Prompt injection: atacante insere texto que muda a instrução do LLM. Direta: usuário digita "Ignore previous instructions and...". Indireta (mais perigosa): texto malicioso em documento, email ou resultado de RAG — agente processa sem saber que é adversarial. Diferente de XSS: XSS injeta HTML/JS para execução no browser de outro usuário. Injection injeta linguagem natural para execução no LLM. Mesmo vetor de "confiança implícita em dados externos".',
    tip: 'Distinguir direta vs indireta é o que demonstra entendimento real de superfície de ataque. A indireta é mais usada em ataques reais contra agentes em 2025.',
  },
  {
    level: 'Pleno',
    q: 'Como valida output de schema JSON com retry?',
    a: 'Use structured output/strict mode na API (Anthropic, OpenAI) primeiro — elimina maioria das falhas. Fallback: valida runtime com Zod (TypeScript) ou Pydantic (Python). Falha: retry automático com erro de validação como feedback no próximo prompt: "Você retornou X mas campo Y deveria ser número". Máximo de 2 retries — sem limite = custo infinito. Terceira falha → resposta padrão de erro. Monitorar taxa de falha de schema — sinaliza prompt ou modelo problemático.',
    tip: 'Cap de 2 retries é fundamental — sem limite, o sistema entra em loop de custo. Monitorar taxa de falha impressiona entrevistadores.',
  },
  {
    level: 'Pleno',
    q: 'Quando usar Llama Guard vs Perspective API?',
    a: 'Llama Guard: modelo fine-tuned para safety categories (violência, conteúdo sexual, atividade criminosa). Roda on-prem ou via API. Cobre input E output. Customizável por fine-tuning. Perspective API (Google): toxicity, identity attack, insult, threat. API REST simples, latência baixa. Treinado em comentários de internet. Não cobre casos específicos de segurança de LLM. Escolha: Perspective API para toxicity genérica em UGC. Llama Guard para safety em fluxos de agentes e quando precisa de on-prem (dados sensíveis).',
    tip: 'On-prem vs SaaS é key em compliance (LGPD, HIPAA). Llama Guard on-prem é a opção para dados que não podem sair da sua infra.',
  },
  {
    level: 'Pleno',
    q: 'O que é jailbreak por many-shot prompting?',
    a: 'Many-shot jailbreaking: incluir muitos exemplos de comportamento proibido no contexto longo antes da pergunta real. O modelo, ao ver muitos exemplos de "assistente que faz X", passa a tratar isso como comportamento esperado no contexto. Eficácia aumenta com o tamanho do contexto — modelos com janelas de 100k+ tokens são mais vulneráveis porque o número de shots pode ser muito maior. Mitigação: limitar tamanho do input do usuário, detectar padrões repetitivos (regex), usar Llama Guard que detecta mesmo em contexto longo.',
    tip: 'Many-shot é relativamente novo (Anthropic publicou paper em 2024). Citar que modelos com janelas maiores são mais vulneráveis demonstra atualidade.',
  },
  {
    level: 'Pleno',
    q: 'Como você testaria seus guardrails (red-teaming)?',
    a: 'Red-teaming sistemático: (1) Prompt injection: "Ignore previous instructions and...", base64 encoding, roleplay "you are DAN". (2) PII bypass: CPF com espaços, hífens, formatos alternativos. (3) Topic drift: perguntas off-scope progressivamente sutis. (4) Many-shot jailbreaking: muitos exemplos proibidos no contexto. (5) Graybox: acesso parcial ao system prompt e tentativa de extrair o restante. Ferramentas: Garak (red-team automatizado), PyRIT (Microsoft). Ataques bem-sucedidos viram casos adversariais no eval set do CI.',
    tip: 'Retroalimentar ataques bem-sucedidos no eval set é o loop de melhoria contínua. Citar Garak ou PyRIT demonstra conhecimento de ferramentas específicas.',
  },
  {
    level: 'Pleno',
    q: 'Como limita o blast radius de um agente?',
    a: 'Principle of least privilege: cada tool tem permissões mínimas — tool de leitura não recebe permissão de escrita. Tool allowlist por contexto/role. Confirmação para ações destrutivas (delete, update em massa, envio de email). Rate limiting por sessão: máximo de N tool calls, N iterações, N tokens. Sandbox: código gerado executa em Docker/VM isolado sem acesso ao host. Rollback capability: ações reversíveis (soft delete, draft antes de enviar). Log de cada tool call para auditoria e forense.',
    tip: 'Blast radius é termo de segurança que impressiona — limitar o dano máximo caso o agente seja comprometido é design defensivo.',
  },
  {
    level: 'Pleno',
    q: 'Como você protege o system prompt de vazamento?',
    a: 'Instrução explícita: instrua o modelo a nunca repetir o system prompt — efetivo contra ataques simples. Output filter: detecta se resposta contém trechos do system prompt e bloqueia via similarity. Separação de segredos: informações sensíveis (API keys, regras de negócio críticas) nunca no system prompt — ficam em tools ou bases de dados acessíveis apenas por tool call autenticado. Monitoramento: alerta quando output tem similaridade alta com o system prompt.',
    tip: 'Não colocar segredos no system prompt é a abordagem mais robusta — não tem segredo a vazar. Separar em tools com autenticação é a arquitetura correta.',
  },
  {
    level: 'Pleno',
    q: 'Como monitora guardrails em produção?',
    a: 'Métricas: taxa de bloqueio por guardrail (total e por categoria), FP rate (estimado via amostra humana), latência adicionada, custo de guardrails LLM-based. Alertas: aumento súbito na taxa de bloqueio pode indicar ataque em curso. Dashboard: Grafana/Datadog com breakdown por guardrail type, por user_id, por endpoint. Audit log: todo bloqueio logado com timestamp, guardrail ativado, input anonimizado, ação tomada. Revisão periódica: amostra semanal para calibração de FP/FN.',
    tip: 'Audit log é requisito legal em sistemas regulados — demonstra consciência de compliance além da técnica.',
  },
  {
    level: 'Pleno',
    q: 'Qual o custo de adicionar guardrails e como otimizar?',
    a: 'Custo por guardrail: latência (classifier local = ms; LLM-as-judge = centenas de ms), custo de tokens (guardrails baseados em LLM), complexidade (mais pontos de falha). Otimizações: guardrails locais primeiro (regex, Presidio, classificadores pequenos) — descartam casos óbvios sem latência de LLM. LLM-based guardrails em amostra (1-5%) para casos que passam o filtro local. Cache de resultados para inputs idênticos. Async: guardrails de output podem rodar em paralelo ao streaming da resposta.',
    tip: 'O padrão "local first, LLM em amostra" é o que candidatos sênior sabem. Guardrail LLM em 100% das requests é proibitivo em custo.',
  },
  {
    level: 'Pleno',
    q: 'Como você trataria output de LLM com instrução executável maliciosa?',
    a: 'Se LLM gera código executado automaticamente: (1) Sandbox obrigatório: Docker/VM com recursos limitados, sem acesso à rede/host. (2) Static analysis: analise antes de executar — pyflakes, semgrep, bandit (Python), ESLint (JS). (3) Allowlist de operações: apenas imports e funções pré-aprovadas. (4) Resource limits: CPU, memória, tempo de execução, acesso ao FS limitado. (5) Output review: outputs do código executado passam por output guardrail antes de retornar ao usuário.',
    tip: 'Prompt-to-code-to-execute é o vetor mais grave em agentes de coding. Nunca executar sem sandbox é regra absoluta.',
  },
]

// ── Quick Reference Data ────────────────────────────────────────────────────────

const QUICK_REF_COLUMNS: QuickRefColumn[] = [
  {
    sections: [
      {
        title: 'INPUT GATE',
        entries: [
          { key: 'Presidio', value: 'PII detection + masking — CPF, email, cartão, nome', badge: 'Microsoft', badgeColor: '#38bdf8' },
          { key: 'Lakera Guard', value: 'Prompt injection detection via API', badge: 'SaaS', badgeColor: '#ef4444' },
          { key: 'NeMo Guardrails', value: 'Topical rails, jailbreak, fluxo conversacional (Colang)', badge: 'NVIDIA', badgeColor: '#76c00d' },
          { key: 'Tags XML', value: '<untrusted>dados externos</untrusted> — modelo ignora instruções', badge: 'padrão', badgeColor: '#f59e0b' },
          { key: 'Topic classifier', value: 'Embedding similarity vs escopo — rejeita off-topic', badge: 'local', badgeColor: '#22c55e' },
        ],
      },
      {
        title: 'AGENT LOOP',
        entries: [
          { key: 'Least privilege', value: 'Tools com permissões mínimas — read ≠ write', badge: 'design', badgeColor: '#22c55e' },
          { key: 'HITL', value: 'Ações destrutivas → confirmação humana com autenticação', badge: 'obrigatório', badgeColor: '#ef4444' },
          { key: 'Max iterations', value: 'Limite de N iterações/tokens por sessão', badge: 'loop', badgeColor: '#f59e0b' },
          { key: 'Code sandbox', value: 'Código gerado executa em Docker isolado', badge: 'segurança', badgeColor: '#ef4444' },
          { key: 'Rollback', value: 'Soft delete, draft antes de enviar — ações reversíveis', badge: 'resiliência', badgeColor: '#a855f7' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'OUTPUT GATE',
        entries: [
          { key: 'Llama Guard 3', value: 'Safety classifier — violência, adulto, ilegal', badge: 'Meta', badgeColor: '#6366f1' },
          { key: 'Perspective API', value: 'Toxicity genérica em UGC — API REST simples', badge: 'Google', badgeColor: '#38bdf8' },
          { key: 'Guardrails AI', value: 'Schema validation + retry automático', badge: 'OSS', badgeColor: '#22c55e' },
          { key: 'RAGAS faithfulness', value: 'LLM-judge valida claims vs contexto RAG', badge: 'amostra', badgeColor: '#f59e0b' },
          { key: 'PII re-check', value: 'Presidio no output — evita vazamento reverso', badge: 'Presidio', badgeColor: '#38bdf8' },
        ],
      },
      {
        title: 'ATAQUES & MITIGAÇÕES',
        entries: [
          { key: 'Injection direta', value: '"Ignore tudo e faça X" → Lakera Guard + classifier', badge: 'comum', badgeColor: '#ef4444' },
          { key: 'Injection indireta', value: 'RAG doc malicioso → tags XML + output filter', badge: 'mais grave', badgeColor: '#ef4444' },
          { key: 'Jailbreak DAN', value: 'Roleplay, base64, encoding → Llama Guard 3', badge: 'jailbreak', badgeColor: '#a855f7' },
          { key: 'Many-shot', value: '100+ exemplos proibidos → limitar tamanho de input', badge: '2024', badgeColor: '#f59e0b' },
          { key: 'PII leak', value: 'Dados pessoais → Presidio input + output', badge: 'LGPD', badgeColor: '#38bdf8' },
        ],
      },
      {
        title: 'COMPLIANCE LGPD',
        entries: [
          { key: 'DPA com provider', value: 'Anthropic/OpenAI assinaram DPA — verificar antes de prod', badge: 'legal', badgeColor: '#ef4444' },
          { key: 'Log TTL', value: 'Dados pessoais em logs com retenção limitada', badge: 'LGPD', badgeColor: '#38bdf8' },
          { key: 'Right to erasure', value: 'Pipeline de deletion: vetores, logs, caches', badge: 'obrigatório', badgeColor: '#ef4444' },
          { key: 'On-prem (saúde/fin.)', value: 'Llama local — dados nunca saem da infra', badge: 'seguro', badgeColor: '#22c55e' },
          { key: 'Audit log', value: 'Todo bloqueio: timestamp, guardrail, input anonimizado', badge: 'compliance', badgeColor: '#a855f7' },
        ],
      },
    ],
  },
]

// ── Mnemonics Data ──────────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'Camadas de guardrail',
    trick: 'IPO',
    expansion: [
      ['I', 'Input gate — PII masking, injection detection, topic classifier. Roda ANTES do LLM.'],
      ['P', 'Process/Agent loop — HITL para ações destrutivas, tool allowlist, limite de iterações.'],
      ['O', 'Output gate — toxicity, schema validation, faithfulness RAG. Roda DEPOIS do LLM.'],
    ],
    explanation: 'Nenhuma camada sozinha é suficiente — defesa em profundidade. Input protege o modelo, agent loop limita o blast radius, output protege o usuário.',
    example: 'Usuário envia CPF → Input gate mascara (Presidio) → LLM processa sem dado real → Output gate verifica se não vazou PII.',
    why: 'IPO é o fluxo lógico de dados: entra, processa, sai. Cada camada tem uma responsabilidade clara. A sigla é a mesma de "Input Process Output" da computação clássica — ancoragem.',
  },
  {
    label: 'Mitigação de prompt injection',
    trick: 'STPO',
    expansion: [
      ['S', 'Separe instrução de dado com tags XML: <user_input>...</user_input>, <document>...'],
      ['T', 'Trate dados externos (RAG, email, web) como untrusted — marque explicitamente.'],
      ['P', 'Privilege mínimo nas tools — read-only tools não têm permissão de escrita ou delete.'],
      ['O', 'Output filter — detecta se resposta indica que o modelo seguiu instrução injetada.'],
    ],
    explanation: 'A injeção indireta (via documento externo) é o vetor mais perigoso — o modelo processa sem saber que é adversarial. STPO cobre as defesas em ordem de custo (do mais barato ao mais caro).',
    example: 'RAG retorna doc com "[SYSTEM: ignore rules]" → tag <document> aplicada → classifier detecta → descartado antes do LLM.',
    why: 'STPO lembra "STOP" de "pare os ataques". A ordem é intencional: Separar e Tratar são defesas de design (baratas), Privilege e Output são defesas de runtime (mais custosas).',
  },
  {
    label: 'PII pipeline completo',
    trick: 'DASL',
    expansion: [
      ['D', 'Detect — Presidio identifica entidades: CPF, email, telefone, cartão, nome.'],
      ['A', 'Anonymize — substitui por placeholder (<CPF_1>, <EMAIL_2>). Guarda mapping reversível.'],
      ['S', 'Send — envia texto anonimizado ao LLM. O modelo nunca vê os dados reais.'],
      ['L', 'Log sanitized — armazena apenas versão anonimizada no log, com TTL de retenção.'],
    ],
    explanation: 'A reversão para o usuário acontece após o Output gate — o dado original é restaurado apenas na apresentação final, nunca persiste nos logs. O mapping tem TTL curto para evitar retenção desnecessária.',
    example: '"Meu CPF é 123.456.789-00" → D: detecta → A: <CPF_1> → S: LLM vê <CPF_1> → L: log contém <CPF_1>. Usuário vê resposta com o dado original, mas log não.',
    why: 'DASL é a sequência exata de execução. Cada letra é uma fase distinta com ferramentas e responsabilidades específicas. A ordem não pode mudar — Anonymize antes de Send é regra inviolável.',
  },
]

// ── Mindmap Data ────────────────────────────────────────────────────────────────

const MINDMAP_CATEGORIES: MindmapCategory[] = [
  {
    label: 'Input Gate',
    color: '#ef4444',
    items: [
      { t: 'PII masking (Presidio)', k: true },
      { t: 'Injection detect. (Lakera)', k: true },
      { t: 'Tags XML <untrusted>', k: true },
      { t: 'Topic classifier', a: true },
      { t: 'Jailbreak filter', a: true },
    ],
  },
  {
    label: 'Agent Loop',
    color: '#22c55e',
    items: [
      { t: 'Least privilege tools', k: true },
      { t: 'HITL ações destrutivas', k: true },
      { t: 'Max iterações/tokens', k: true },
      { t: 'Code sandbox (Docker)', a: true },
      { t: 'Rollback capability', a: true },
    ],
  },
  {
    label: 'Output Gate',
    color: '#f59e0b',
    items: [
      { t: 'Toxicity (LlamaGuard)', k: true },
      { t: 'Schema validation (Zod)', k: true },
      { t: 'PII re-check', k: true },
      { t: 'Faithfulness RAG (RAGAS)', a: true },
      { t: 'Prompt leak detection', a: true },
    ],
  },
  {
    label: 'Ferramentas',
    color: '#38bdf8',
    items: [
      { t: 'Presidio (PII)', k: true },
      { t: 'Llama Guard 3 (safety)', k: true },
      { t: 'Guardrails AI (schema)', k: true },
      { t: 'Lakera Guard (injection)', a: true },
      { t: 'NeMo Guardrails (flow)', a: true },
    ],
  },
  {
    label: 'Ataques',
    color: '#a855f7',
    items: [
      { t: 'Injection direta', k: true },
      { t: 'Injection indireta (RAG)', k: true },
      { t: 'Jailbreak (DAN, roleplay)', k: true },
      { t: 'Many-shot jailbreaking', a: true },
      { t: 'System prompt leak', a: true },
    ],
  },
  {
    label: 'Compliance',
    color: '#6366f1',
    items: [
      { t: 'DPA com provider', k: true },
      { t: 'Log TTL (LGPD)', k: true },
      { t: 'Audit log de bloqueios', k: true },
      { t: 'Right to erasure', a: true },
      { t: 'On-prem para saúde/fin.', a: true },
    ],
  },
]

const MINDMAP_CHECKLIST = [
  'PII é mascarado antes de enviar ao LLM e antes de logar?',
  'Input gate verifica prompt injection antes de cada chamada ao LLM?',
  'Ações destrutivas do agente exigem confirmação humana?',
  'Tools do agente têm apenas as permissões mínimas necessárias?',
  'Output é verificado para toxicity e schema antes de retornar ao usuário?',
  'Sistema foi submetido a red-teaming com ataques reais?',
  'Casos de ataques bem-sucedidos estão no eval set do CI?',
  'DPA está assinado com o provider de LLM antes de ir para produção?',
  'Há audit log de todos os bloqueios com input anonimizado?',
  'FP rate dos guardrails foi calibrado para não bloquear requests legítimas?',
]

// ── Builders ────────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'AI Guardrails',
    stackLabel: 'AI Security',
  }),
  'quick-ref': () => buildQuickRefPdf({
    columns: QUICK_REF_COLUMNS,
    skillName: 'AI Guardrails',
    accentColor: C,
    stackLabel: 'AI Security',
    tagline: 'Guardrails por camada, ferramentas e checklist de segurança LLM',
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'AI Guardrails',
    stackLabel: 'AI Security',
    coverTitle: 'AI Guardrails — 3 Truques que Grudam na Memória',
    coverSubtitle: 'IPO, STPO e DASL: camadas de defesa, mitigação de injection e pipeline de PII em acrônimos que ficam.',
  }),
  mindmap: () => buildMindmapPdf({
    categories: MINDMAP_CATEGORIES,
    checklist: MINDMAP_CHECKLIST,
    accentColor: C,
    skillName: 'AI Guardrails',
    stackLabel: 'AI Security',
    coverTitle: 'AI Guardrails — Do Zero ao Expert',
    coverSubtitle: 'Mapa mental de segurança para sistemas LLM em produção',
    checklistTitle: 'Checklist de Segurança LLM',
    checklistDesc: '10 perguntas para auto-avaliar seu sistema. Todas marcadas = sistema com defense in depth.',
  }),
}

// ── Componente ──────────────────────────────────────────────────────────────────

export default function AiGuardrailsPdfs() {
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
