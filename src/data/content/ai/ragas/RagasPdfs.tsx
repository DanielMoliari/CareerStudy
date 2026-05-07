'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildCheatsheetPdf } from '@/components/pdfs/CheatsheetPdf'
import type { HookItem, RuleItem } from '@/components/pdfs/CheatsheetPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'
import { buildMindmapPdf } from '@/components/pdfs/MindmapPdf'
import type { MindmapCategory } from '@/components/pdfs/MindmapPdf'

// ── Paleta RAGAS ──────────────────────────────────────────────────────────────
const C = '#06b6d4'   // cyan — identidade RAGAS/eval

// ── Metadados dos PDFs ────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas sobre RAGAS em entrevista sênior de AI Engineering',
    type: 'qa',
    pages: 10,
    description: 'Métricas FARC completas, diagnóstico por combinação de scores, integração em CI/CD, LLM-as-judge, synthetic test set, alternativas (TruLens, ARES), edge cases e questões avançadas sobre multi-turn e multi-doc.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet',
    subtitle: 'FARC, diagnóstico e integração CI em uma página',
    type: 'cheatsheet',
    pages: 3,
    description: 'Referência densa: 4 métricas com threshold alvo, tabela de diagnóstico por combinação, regras críticas de uso e exemplos de código de integração.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'FARC, regra do judge e gate FP80 — fixados na memória',
    type: 'mnemonics',
    pages: 2,
    description: 'Três mnemônicos que cobrem as 4 métricas, a regra mais crítica do LLM-judge e os thresholds de gate de qualidade.',
    icon: '03',
    goal: 'Memória de longo prazo',
  },
  {
    id: 'mindmap',
    title: 'Mind Map',
    subtitle: 'RAGAS do eval básico ao monitoramento em produção',
    type: 'mindmap',
    pages: 2,
    description: 'Mapa mental com 6 categorias (Métricas, CI/CD, LLM Judge, Eval Set, Diagnóstico, Alternativas) e checklist de auto-avaliação pré-entrevista.',
    icon: '04',
    goal: 'Mapeamento mental',
  },
]

// ── Dados: Q&A ────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'Quais são as 4 métricas core do RAGAS e o que cada uma mede?',
    a: 'FARC — Faithfulness, Answer Relevancy, Context Recall, Context Precision.\n\nFaithfulness: claims da resposta estão apoiadas no contexto? LLM-judge decompõe em afirmações atômicas. Score baixo = alucinação.\n\nAnswer Relevancy: resposta foca na pergunta? Gera perguntas reversas + similaridade. Score baixo = off-topic.\n\nContext Recall: recuperou todos os docs necessários? Requer ground truth. Score baixo = retrieval incompleto.\n\nContext Precision: top-K tem docs relevantes? Score baixo = retrieval com ruído.\n\nFaithfulness e Relevancy são referenceless (sem ground truth). Recall exige anotação.',
    tip: 'Mnemônico FARC. Cada métrica aponta para um componente diferente: F,A → prompt; R → chunking; C → retrieval.',
  },
  {
    level: 'Pleno',
    q: 'Como integraria RAGAS em CI/CD?',
    a: 'Pipeline:\n1. Eval set de 50–200 Q&As versionado (Git LFS ou S3).\n2. Job CI roda RAGAS em sample a cada PR relevante.\n3. Compara delta vs. baseline do branch main.\n4. Gate: Faithfulness > 0.80 && Context Precision > 0.75.\n5. PR bloqueado automaticamente. Score como comentário no PR.\n6. Monitore online: sample 1–5% dos requests em produção com LLM-judge.\n\nDelta vs. baseline é mais importante que valor absoluto — um score de 0.78 pode ser ótimo se o baseline era 0.60.',
    tip: 'Gate de qualidade em CI/CD é o que diferencia RAG amador de produção.',
  },
  {
    level: 'Pleno',
    q: 'O que é LLM-as-judge e por que nunca usar o mesmo modelo para gerar e julgar?',
    a: 'LLM-as-judge usa um LLM separado para avaliar a qualidade das respostas — verificando cada claim contra o contexto, classificando relevância dos chunks, etc.\n\nPor que não usar o mesmo modelo: viés de auto-favorecimento. Modelos tendem a dar scores mais altos para respostas no seu próprio estilo, mesmo quando incorretas. Pode inflar Faithfulness em 15–20 pontos percentuais.\n\nPrática: se você usa GPT-4o para gerar, use Claude Haiku ou GPT-4o-mini como judge. Para calibrar: compare judge barato vs. caro em 50 exemplos — se concordância > 85%, use o barato.',
    tip: 'Calibrar judge barato vs. caro em amostra pequena antes de escalar é a abordagem profissional.',
  },
  {
    level: 'Pleno',
    q: 'Como gerar um test set sintético e quais cuidados tomar?',
    a: 'RAGAS Testset Generator processa o corpus e gera perguntas de múltiplos tipos:\n- Simple (50%): fato direto do doc.\n- Reasoning (30%): requer inferência.\n- Multi-context (20%): resposta em múltiplos chunks.\n\nO gerador usa LLM para criar perguntas + ground truth.\n\nCuidados obrigatórios:\n1. Revise manualmente 10–20 exemplos antes de usar — o LLM pode gerar perguntas sem sentido.\n2. Verifique se os tipos de pergunta representam o seu caso de uso real.\n3. Inclua manualmente edge cases (perguntas sem resposta no corpus, perguntas ambíguas).',
    tip: 'Revisão manual de amostra diferencia quem faz RAG real de quem segue tutorial.',
  },
  {
    level: 'Pleno',
    q: 'Como interpretaria Faithfulness = 0.60 em um pipeline RAG?',
    a: 'Score 0.60 significa que 40% das claims da resposta não estão apoiadas no contexto recuperado — alucinação significativa.\n\nDiagnóstico em camadas:\n1. Context Precision alto? → Contexto tem docs relevantes mas LLM não segue. Bug de prompt. Fix: instrução explícita.\n2. Context Precision baixo? → Chunks irrelevantes confundem o LLM. Fix: reranking.\n3. Modelo pequeno? → Modelos menores seguem menos instruções de grounding.\n4. Temperatura alta? → Reduzir temperatura (usar 0 para RAG).\n5. Contexto muito longo? → Lost in the Middle: chunks relevantes no meio são ignorados.',
    tip: 'Sempre veja Context Precision antes de culpar o prompt — diagnóstico por exclusão evita fixes errados.',
  },
  {
    level: 'Pleno',
    q: 'Quais as limitações do RAGAS como framework de avaliação?',
    a: 'Limitações principais:\n1. Custo: 5–15 LLM calls por exemplo × 1000 exemplos = custo real a planejar.\n2. Viés do judge: modelos tendem a preferir estilo similar ao próprio treinamento.\n3. Context Recall requer ground truth anotado — sem ele, a métrica retorna NaN ou resultado inválido.\n4. Scores absolutos não comparáveis entre modelos de judge diferentes — compare sempre deltas.\n5. Não mede latência, custo por query, UX ou satisfação do usuário.\n6. Faithfulness pode falhar em raciocínio multi-step complexo.\n\nSolução: combine RAGAS com human eval amostral para calibrar o judge.',
    tip: 'Scores não comparáveis cross-model é o detalhe que a maioria não menciona e que demonstra profundidade.',
  },
  {
    level: 'Senior',
    q: 'Como diagnosticar um pipeline onde Context Precision é alto mas Faithfulness é baixo?',
    a: 'Padrão específico: contexto tem docs relevantes (Precision OK) mas o LLM não usa esses docs.\n\nCausas e fixes:\n1. Instrução de prompt fraca — adicione "Responda SOMENTE com base no contexto. Se não souber, diga que não tem informação."\n2. Lost in the Middle — chunks relevantes no meio do contexto são ignorados. Fix: coloque os mais relevantes no início e no fim.\n3. Temperatura alta — LLM "criativo" desvia do contexto. Use temperatura 0 para RAG.\n4. Modelo pequeno — modelos menores seguem menos instruções de grounding.\n5. Contexto muito longo — revise se todos os K chunks são necessários.',
    tip: 'Precision alto + Faithfulness baixo = sempre problema de prompt, não de retrieval. O candidato que sabe disso demonstra maturidade.',
  },
  {
    level: 'Senior',
    q: 'Como estruturar um eval set robusto para RAG?',
    a: 'Quatro dimensões:\n1. Cobertura: perguntas sobre cada seção/domínio do corpus — não só perguntas fáceis.\n2. Dificuldade: Simple (50%) + Reasoning (30%) + Multi-context (20%).\n3. Edge cases obrigatórios: perguntas sem resposta no corpus, ambíguas, multi-hop.\n4. Ground truth: para Context Recall, anote os source_ids dos chunks esperados.\n\nTamanho: 50 mínimo para gate CI (significância estatística básica). 200+ para análise de regressão confiável.\n\nVersionar junto ao código do pipeline — cada mudança no eval set deve ser revisada como código.',
    tip: 'Edge cases (perguntas sem resposta) são onde RAG mais falha e onde os candidatos mais provam experiência real.',
  },
  {
    level: 'Senior',
    q: 'Como RAGAS se diferencia de TruLens e ARES?',
    a: 'RAGAS: métricas estandardizadas, fácil integração com LangChain/LlamaIndex, referenceless para F e A. Mais usado na comunidade. Ponto fraco: sem trace detalhado.\n\nTruLens: trace completo de cada etapa com logging do raciocínio do judge. Mais orientado a observability — você vê não só o score mas também por que o judge deu aquele score. Integra com OpenTelemetry.\n\nARES (Stanford): classificadores fine-tuned no domínio. Mais determinístico, menos custo por sample (sem LLM call), mais preciso em domínios específicos. Requer dados de treinamento.\n\nEstratégia ideal: RAGAS para eval set offline em CI/CD + TruLens para monitoramento online com trace.',
    tip: 'A combinação RAGAS offline + TruLens online demonstra visão de sistema de avaliação completo.',
  },
  {
    level: 'Senior',
    q: 'Como implementar monitoramento online de qualidade RAG em produção?',
    a: 'Dois níveis complementares:\n\nOffline (CI/CD): eval set fixo + gate automático em PRs. Cobre regressões conhecidas.\n\nOnline:\n1. Log 100% de inputs, contextos e respostas (com sampling se volume > 10K/dia).\n2. LLM-judge amostral: 1–5% dos requests em tempo real com RAGAS ou TruLens.\n3. Thumbs up/down do usuário como ground truth humano — correlacione com métricas automáticas.\n4. Alertas: se Faithfulness média em janela de 1h cair abaixo de threshold → pager.\n5. Dashboard: tendências de score ao longo do tempo, correlação com mudanças de corpus ou prompt.\n\nO feedback do usuário é o sinal de qualidade mais valioso e frequentemente ignorado.',
    tip: 'Correlacionar métricas automáticas com thumbs do usuário demonstra maturidade de product engineering.',
  },
  {
    level: 'Senior',
    q: 'O que é Answer Similarity e como difere de Answer Relevancy?',
    a: 'Answer Relevancy: mede se a resposta é sobre a pergunta. Usa perguntas reversas + similaridade semântica. Referenceless.\n\nAnswer Similarity: mede quão próxima a resposta gerada está da ground truth (resposta de referência). Usa similaridade de embedding entre resposta gerada e resposta anotada. Requer ground truth.\n\nDistinção importante:\n- Relevancy mede FOCO (resposta fala sobre a pergunta?)\n- Similarity mede CORREÇÃO SEMÂNTICA (resposta está perto da certa?)\n\nLimitação do Similarity: não verifica se a resposta é factualmente correta — só se é semanticamente similar à referência. Use junto com Faithfulness para cobertura completa.',
    tip: 'Distinguir as duas métricas claramente demonstra leitura do paper original, não só uso da biblioteca.',
  },
  {
    level: 'Senior',
    q: 'Como calcular Context Precision sem LLM externo?',
    a: 'Context Precision padrão usa LLM-as-judge para classificar relevância de cada chunk. Alternativas sem LLM:\n\n1. Cross-encoder local: modelos como bge-reranker-v2-m3 ou cross-encoder/ms-marco-MiniLM retornam score de relevância por par (query, chunk). Threshold > 0.5 = relevante. Determinístico e barato.\n\n2. BM25 score como proxy: relevância por termos exatos. Funciona para queries com vocabulário específico.\n\n3. Click-through feedback: em sistemas com UI, clique na fonte citada como sinal de relevância.\n\nTrade-off: cross-encoder local é menos sofisticado que LLM para semântica mas totalmente determinístico, sem custo de API e privado.',
    tip: 'Cross-encoder local como judge substitute demonstra que você pensa em custo, privacidade e dependências externas.',
  },
  {
    level: 'Senior',
    q: 'Qual é a relação entre Context Precision e Context Recall e como otimizá-los?',
    a: 'Tensão natural: chunking fino melhora Recall (mais chances de ter a informação) mas degrada Precision (mais chunks = mais ruído). Chunking grosso melhora Precision mas degrada Recall.\n\nSolução: chunking hierárquico. Chunk filho pequeno para retrieval preciso (melhora Precision). Chunk pai injetado no LLM para contexto rico (melhora Recall).\n\nPriorização:\n- Priorize Precision quando erros de alucinação são custosos (aplicações jurídicas, médicas).\n- Priorize Recall quando perder informação é pior (compliance, auditoria).\n\nAlternativas para Recall: hybrid search (dense + BM25), aumento de K no retrieval, Contextual Retrieval.',
    tip: 'Articular a tensão como decisão de design, não como falha, demonstra pensamento de engenheiro.',
  },
  {
    level: 'Senior',
    q: 'Como o mecanismo interno de Faithfulness funciona no RAGAS?',
    a: 'Processo passo a passo:\n1. LLM-judge recebe a resposta gerada e o contexto recuperado.\n2. Judge decompõe a resposta em N claims atômicas (ex: "O preço é R$500", "A entrega é em 3 dias").\n3. Para cada claim, judge verifica se ela pode ser inferida do contexto recuperado.\n4. Score = N_claims_suportadas / N_total_claims.\n\nImplicação: uma resposta longa com muitas claims tem mais superfície de risco de Faithfulness baixo.\n\nLimitação: o LLM-judge pode falhar em raciocínio multi-step — "A + B implica C" pode ser julgado incorretamente se A e B estão em chunks separados.',
    tip: 'Saber o mecanismo de decomposição em claims demonstra entendimento profundo, não só uso da biblioteca.',
  },
  {
    level: 'Pleno',
    q: 'Quais são as boas práticas para prompt de instrução em RAG para maximizar Faithfulness?',
    a: 'Instruções que maximizam Faithfulness:\n1. Instrução explícita: "Responda SOMENTE com base no contexto abaixo. Se a resposta não estiver no contexto, diga: Não tenho informação sobre isso."\n2. Proibição de suposição: "Nunca assuma informações além do que está explicitamente no contexto."\n3. Context-first: coloque o contexto ANTES da pergunta — o modelo presta mais atenção ao que vem antes da query.\n4. Force citations: "Cite a fonte no formato [Fonte: X] ao responder."\n5. Temperatura 0: sem criatividade para RAG de factualidade.\n\nTeste: calcule Faithfulness com e sem a instrução explícita — diferença geralmente > 15 pontos percentuais.',
    tip: 'Context-first no prompt é o detalhe de ordering que a maioria não menciona mas que faz diferença real.',
  },
  {
    level: 'Pleno',
    q: 'Por que o tamanho do eval set importa para a validade do gate de CI?',
    a: 'Um eval set muito pequeno tem ruído estatístico alto — um único exemplo diferente pode mudar o score em vários pontos.\n\nExemplo: com 10 exemplos, 1 exemplo diferente = delta de 10 pontos. Com 100 exemplos, = 1 ponto.\n\nRegra prática:\n- 10 exemplos: sem significância estatística. Não use como gate.\n- 50 exemplos: mínimo para gate CI. Detecta regressões de 5+ pontos.\n- 200 exemplos: para análise de regressão confiável e identificação de sub-categorias de falha.\n\nTambém: exemplos muito similares reduzem a diversidade do eval set — prefira 50 exemplos diversos a 200 parecidos.',
    tip: 'A distinção entre tamanho de eval set e diversidade demonstra entendimento estatístico.',
  },
  {
    level: 'Senior',
    q: 'Como RAGAS avalia pipelines multi-turn (conversacional)?',
    a: 'RAGAS padrão é single-turn. Para multi-turn, desafios:\n1. O contexto da conversa muda — cada turn depende dos anteriores.\n2. Métricas padrão avaliam cada resposta isoladamente sem considerar coerência da conversa.\n\nAbordagem prática:\n1. Avalie cada turn individualmente incluindo o histórico como parte do contexto.\n2. Métricas adicionais para conversação: coherence (coerência com turns anteriores) e context adherence.\n3. RAGAS tem suporte experimental a conversational evaluation — verifique a versão instalada.\n4. TruLens com métricas custom é mais maduro para multi-turn.\n\nEval set multi-turn: crie cenários de conversa completos com 3–5 turns, não só perguntas isoladas.',
    tip: 'Saber que RAGAS é primariamente single-turn e como contornar demonstra maturidade prática.',
  },
  {
    level: 'Senior',
    q: 'Como versionar e gerenciar o eval set ao longo do tempo?',
    a: 'Tratamento como código:\n1. Versione o eval set junto ao código do pipeline (Git LFS para arquivos grandes).\n2. Cada adição ou modificação de exemplos é revisada como PR — com justificativa.\n3. Nunca remova exemplos por "conveniência" — se o pipeline falha neles, o pipeline tem bug.\n4. Adicione novos exemplos quando encontrar bugs em produção (test-driven debugging).\n5. Separe o eval set em subconjuntos: core (sempre roda em CI), extended (roda periodicamente), regression (bugs históricos).\n\nTracking: registre o score histórico por exemplo, não só o agregado — permite ver quais exemplos estão degradando.',
    tip: 'Adicionar novos exemplos quando encontrar bugs em produção (test-driven debugging) é a prática mais madura que existe.',
  },
  {
    level: 'Senior',
    q: 'O que é Noise Robustness e como testar em pipelines RAG?',
    a: 'Noise Robustness mede se o pipeline mantém qualidade quando o corpus tem documentos irrelevantes ou contraditórios.\n\nPor que importa: em produção, corpus raramente é limpo. PDFs mal formatados, chunks com ruído, documentos desatualizados e informações conflitantes são realidade.\n\nComo testar:\n1. Construa um eval set limpo (baseline).\n2. Injete 20% de documentos adversariais no corpus (irrelevantes, contraditórios).\n3. Meça degradação de Faithfulness e Context Precision.\n4. Threshold de robustez: degradação < 10 pontos percentuais é aceitável.\n\nRAGAS não tem métrica nativa — construa a comparação você mesmo.',
    tip: 'Propor testes adversariais com corpus ruidoso demonstra que você pensa em robustez, não só em benchmarks limpos.',
  },
  {
    level: 'Senior',
    q: 'Como escolher entre RAGAS, TruLens e ARES para um projeto específico?',
    a: 'Framework de decisão:\n\nEscolha RAGAS quando:\n- Você quer integração rápida com LangChain/LlamaIndex.\n- Precisa de métricas padronizadas comparáveis com outros projetos.\n- O eval set é offline e roda em CI.\n\nEscolha TruLens quando:\n- Observability é crítica — você precisa entender O PORQUÊ de cada score.\n- Monitoramento online com trace completo é necessário.\n- Integração com OpenTelemetry é requisito.\n\nEscolha ARES quando:\n- Domínio muito específico onde LLM-judge geral não é preciso o suficiente.\n- Volume altíssimo onde custo de LLM calls por avaliação é proibitivo.\n- Você tem dados de treinamento para o classificador.\n\nNa prática: RAGAS + TruLens são complementares, não excludentes.',
    tip: 'Articular que RAGAS e TruLens são complementares demonstra visão de sistema completo de avaliação.',
  },
  {
    level: 'Senior',
    q: 'Quais métricas novas o RAGAS adicionou além das 4 core?',
    a: 'Principais adições além de FARC:\n\nAnswer Correctness: combina factual correctness (compara fatos com ground truth) + semantic similarity. Requer ground truth. Mais rigorosa que Faithfulness.\n\nAspect Critique: critique customizável — você define o critério (ex: conciseness, harmlessness, completeness). Útil para avaliar aspectos específicos do seu domínio.\n\nSummarization Score: para pipelines de sumarização, não só Q&A.\n\nSQL Semantic Equivalence: para pipelines Text-to-SQL.\n\nAtenção: API do RAGAS muda entre versões. Sempre verifique ragas.__version__ e a documentação da versão instalada antes de depender de uma métrica nova.',
    tip: 'Mencionar que a API muda entre versões e checar ragas.__version__ demonstra maturidade prática com ferramentas em evolução.',
  },
]

// ── Dados: CheatSheet ─────────────────────────────────────────────────────────

const CHEATSHEET_HOOKS: HookItem[] = [
  { name: 'FARC', sig: 'Faithfulness · Answer · Recall · Context', desc: 'As 4 métricas core. Cada letra aponta para um componente diferente: F,A → prompt; R → chunking; C → retrieval.' },
  { name: 'Faithfulness', sig: 'claims na resposta ∈ contexto?', desc: 'LLM-judge decompõe resposta em claims atômicas. Score = claims_suportadas / N_total. Baixo = alucinação.' },
  { name: 'Answer Relevancy', sig: 'perguntas reversas → similaridade', desc: 'Gera perguntas a partir da resposta, mede similaridade com a pergunta original. Referenceless.' },
  { name: 'Context Precision', sig: 'top-K tem ruído?', desc: 'Verifica se chunks no top-K são relevantes. Score baixo = retrieval impreciso. Fix: reranking.' },
  { name: 'Context Recall', sig: 'recuperou todos os docs?', desc: 'Requer ground truth anotado (source_ids). Score baixo = retrieval incompleto. Fix: hybrid search.' },
  { name: 'Gate CI/CD', sig: 'F > 0.80 && P > 0.75', desc: 'Threshold prático. Delta vs. baseline mais importante que valor absoluto. PR bloqueado se cair.' },
  { name: 'Eval set', sig: '50 mínimo, 200 ideal', desc: '50 Q&As: significância básica para gate. 200+: análise de regressão confiável. Versionar no repo.' },
  { name: 'LLM judge', sig: 'modelo ≠ gerador', desc: 'Nunca use o mesmo modelo. Viés de auto-favorecimento infla scores em 15–20pp. Use Haiku ou 4o-mini.' },
  { name: 'Synthetic test set', sig: 'simple 50% + reasoning 30% + multi 20%', desc: 'Geração automática a partir do corpus. Revisar 10–20 exemplos manualmente antes de usar.' },
  { name: 'Diagnóstico', sig: 'Faith+Prec+Recall → causa raiz', desc: 'Combinations: Faith↓+Prec↑ → prompt. Faith↓+Prec↓ → retrieval ruído. Recall↓+Prec↑ → hybrid search.' },
]

const CHEATSHEET_RULES: RuleItem[] = [
  { ok: false, t: 'Nunca use o mesmo modelo LLM para gerar respostas e julgar — viés de auto-favorecimento' },
  { ok: false, t: 'Eval set < 50 exemplos não tem significância estatística — não use como gate de CI' },
  { ok: false, t: 'Comparar scores absolutos entre modelos de judge diferentes — compare sempre deltas' },
  { ok: false, t: 'Context Recall sem ground truth retorna NaN — não interprete como "100%"' },
  { ok: true, t: 'Gate de qualidade: Faithfulness > 0.80 && Context Precision > 0.75 por PR' },
  { ok: true, t: 'Diagnóstico: mude um componente por vez e re-rode o eval — ciência, não tentativa e erro' },
  { ok: true, t: 'Combine avaliação offline (CI/CD) com monitoramento online amostral (1–5%)' },
]

// ── Dados: Mnemônicos ─────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'As 4 métricas RAGAS',
    trick: 'FARC',
    expansion: [
      ['F — Faithfulness', 'Claims da resposta estão apoiadas no contexto?'],
      ['A — Answer Relevancy', 'A resposta é sobre a pergunta? (perguntas reversas)'],
      ['R — Context Recall', 'Recuperou todos os docs necessários? (requer ground truth)'],
      ['C — Context Precision', 'Top-K tem docs relevantes ou é ruído?'],
    ],
    explanation: 'Cada letra mapeia para um componente diferente. F e A → problema no prompt. R → problema no chunking. C → problema no retrieval.',
    example: 'Faithfulness 0.55 + Context Precision 0.90 = contexto bom, LLM não segue = bug no prompt. Faith 0.80 + Precision 0.50 = ruído no retrieval.',
    why: 'FARC é a base de qualquer conversa sobre RAG evaluation em entrevista sênior. Saber as 4 métricas, seu mecanismo e o que cada score baixo significa é obrigatório.',
  },
  {
    label: 'A regra de ouro do LLM judge',
    trick: 'Nunca julga quem gerou',
    expansion: [
      ['Judge ≠ Gerador', 'O modelo que avalia deve ser diferente do que gerou as respostas'],
      ['Viés de auto-favorecimento', 'Modelos preferem estilo similar ao próprio treinamento'],
      ['Magnitude do viés', '15–20 pontos percentuais de inflação são comuns'],
      ['Solução prática', 'Gerador: GPT-4o → Judge: Claude Haiku ou GPT-4o-mini'],
    ],
    explanation: 'Usar o mesmo modelo como judge é o erro mais frequente ao implementar RAGAS pela primeira vez. O score inflado dá falsa sensação de qualidade.',
    example: 'Pipeline usa GPT-4o para gerar → usa GPT-4o como judge → Faithfulness reportado: 0.92. Troca o judge para Claude Haiku → Faithfulness real: 0.74. O bug estava mascarado.',
    why: 'Este é o gotcha que mais reprova candidatos que "sabem RAGAS" mas nunca implementaram em produção. Mencionar este detalhe demonstra experiência prática.',
  },
  {
    label: 'Thresholds do gate de qualidade',
    trick: 'FP80 — Faith e Precision acima de 80',
    expansion: [
      ['F — Faithfulness > 0.80', 'Alucinação controlada. Abaixo: instruções de prompt'],
      ['P — Context Precision > 0.75', 'Retrieval com pouco ruído. Abaixo: adicione reranking'],
      ['8 — Score mínimo aceitável', '0.60–0.79: problema real. Abaixo de 0.60: crítico'],
      ['0 — Zero tolerância para regressão', 'Qualquer queda de 5+ pontos vs. baseline → investigar'],
    ],
    explanation: 'FP80 como âncora mental para os dois thresholds mais importantes no gate de CI. O "0" representa tolerância zero para regressão silenciosa.',
    example: 'PR muda o prompt → CI roda RAGAS → Faith cai de 0.84 para 0.72 (FP80 threshold) → PR bloqueado → dev reverte remoção da instrução de grounding.',
    why: 'Ter thresholds específicos de memória demonstra que você já implementou gates de CI, não só avaliação ad hoc.',
  },
]

// ── Dados: Mindmap ────────────────────────────────────────────────────────────

const MINDMAP_CATEGORIES: MindmapCategory[] = [
  {
    label: 'Métricas — FARC',
    color: '#06b6d4',
    items: [
      { t: 'Faithfulness: claims no contexto?', k: true },
      { t: 'Answer Relevancy: foco na pergunta?', k: true },
      { t: 'Context Recall: recuperou todos?', k: true },
      { t: 'Context Precision: top-K tem ruído?', k: true },
      { t: 'Answer Similarity (requer ground truth)', a: true },
      { t: 'Answer Correctness (factual + semantic)', a: true },
    ],
  },
  {
    label: 'CI/CD & Gate',
    color: '#22c55e',
    items: [
      { t: 'Gate: Faith > 0.80 && Prec > 0.75', k: true },
      { t: 'Eval set: 50 mínimo, 200 ideal', k: true },
      { t: 'Delta vs. baseline, não absoluto', k: true },
      { t: 'PR bloqueado + score como comentário', k: true },
      { t: 'Monitoramento online: 1–5% dos requests', a: true },
      { t: 'Alertas por janela temporal (1h)', a: true },
    ],
  },
  {
    label: 'LLM Judge',
    color: '#f59e0b',
    items: [
      { t: 'Modelo ≠ gerador (viés auto-favorecimento)', k: true },
      { t: 'Haiku / GPT-4o-mini para volume', k: true },
      { t: 'Calibre judge barato vs. caro em 50 ex.', k: true },
      { t: 'Scores não comparáveis cross-model', k: true },
      { t: 'Cross-encoder como judge local (sem API)', a: true },
      { t: 'NLI para Context Recall internamente', a: true },
    ],
  },
  {
    label: 'Eval Set',
    color: '#a855f7',
    items: [
      { t: 'Simple (50%) + Reasoning (30%) + Multi (20%)', k: true },
      { t: 'Edge cases obrigatórios (sem resposta, ambíguos)', k: true },
      { t: 'Versionar junto ao código do pipeline', k: true },
      { t: 'Revisar manualmente 10–20 do synthetic', k: true },
      { t: 'source_ids no ground truth para multi-doc', a: true },
      { t: 'Test-driven debugging: novo exemplo por bug', a: true },
    ],
  },
  {
    label: 'Diagnóstico',
    color: '#ef4444',
    items: [
      { t: 'Faith↓ + Prec↑ → bug de prompt', k: true },
      { t: 'Faith↓ + Prec↓ → retrieval com ruído', k: true },
      { t: 'Recall↓ + Prec↑ → hybrid search', k: true },
      { t: 'Mude um componente por vez', k: true },
      { t: 'Context-first no prompt (+15pp Faith)', a: true },
      { t: 'Temperatura 0 para RAG de factualidade', a: true },
    ],
  },
  {
    label: 'Alternativas',
    color: '#6366f1',
    items: [
      { t: 'TruLens: trace completo + observability', k: true },
      { t: 'ARES: classificador fine-tuned (Stanford)', k: true },
      { t: 'LangSmith: integrado ao trace LangChain', k: true },
      { t: 'RAGAS + TruLens: complementares', k: true },
      { t: 'ARES: melhor para domínios específicos', a: true },
      { t: 'Human eval amostral para calibrar judge', a: true },
    ],
  },
]

const MINDMAP_CHECKLIST = [
  'Sei explicar as 4 métricas FARC sem hesitar?',
  'Sei quando cada métrica requer ground truth?',
  'Consigo diagnosticar Faith↓+Prec↑ vs. Faith↓+Prec↓?',
  'Entendo por que não usar o mesmo modelo como judge?',
  'Sei configurar um gate de CI com thresholds?',
  'Consigo estruturar um eval set com edge cases?',
  'Sei a diferença entre RAGAS, TruLens e ARES?',
  'Entendo o mecanismo interno de Faithfulness (claims)?',
  'Sei combinar avaliação offline com monitoramento online?',
  'Conheço o comando para calibrar o judge barato vs. caro?',
]

// ── Builders ──────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'RAGAS',
    stackLabel: 'RAG Evaluation',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'RAGAS',
    accentColor: C,
    stackLabel: 'FARC · CI/CD · LLM Judge',
    sections: {
      hooks: CHEATSHEET_HOOKS,
      depRows: [
        ['ragas', 'pip install ragas — eval framework principal'],
        ['trulens-eval', 'Observability + trace completo do pipeline'],
        ['langchain', 'Integração nativa com ragas.integrations.langchain'],
        ['GPT-4o-mini / Claude Haiku', 'Judge barato para volume alto de avaliação'],
        ['bge-reranker-v2-m3', 'Cross-encoder local como judge sem LLM API'],
      ],
      rules: CHEATSHEET_RULES,
      performanceTips: [
        'Use GPT-4o-mini ou Claude Haiku como judge — 20x mais barato que modelos grandes',
        'Batch de 50 exemplos por job CI — não avalie um por um para evitar rate limits',
        'Cache o eval set em S3 ou Git LFS — não regenere a cada run',
        'Paralelize chamadas LLM do judge com asyncio para reduzir tempo total',
        'Cross-encoder local (bge-reranker) como judge gratuito para Context Precision',
      ],
      patterns: [
        {
          name: 'Avaliação básica com RAGAS',
          code: `from datasets import Dataset
from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy, context_precision

dataset = Dataset.from_dict({
    "question": [...],
    "answer": [...],
    "contexts": [[...], [...]],  # lista de listas de chunks
})

result = evaluate(
    dataset=dataset,
    metrics=[faithfulness, answer_relevancy, context_precision],
)
print(result)  # {'faithfulness': 0.87, ...}`,
          desc: 'Ponto de partida. contexts é lista de listas (um array de chunks por exemplo).',
        },
        {
          name: 'Gate de qualidade em CI',
          code: `import sys
from ragas import evaluate

THRESHOLDS = {"faithfulness": 0.80, "context_precision": 0.75}

scores = evaluate(dataset, metrics=[...])
failed = any(scores[m] < THRESHOLDS[m] for m in THRESHOLDS)

if failed:
    print("❌ Quality gate failed")
    sys.exit(1)  # Falha o job CI`,
          desc: 'sys.exit(1) falha o job de CI. GitHub Actions bloqueia o merge automaticamente.',
        },
        {
          name: 'Synthetic test set',
          code: `from ragas.testset.generator import TestsetGenerator
from ragas.testset.evolutions import simple, reasoning, multi_context

generator = TestsetGenerator.from_langchain(
    generator_llm, critic_llm, embeddings
)
testset = generator.generate_with_langchain_docs(
    documents,
    test_size=50,
    distributions={simple: 0.5, reasoning: 0.3, multi_context: 0.2},
)
# SEMPRE revisar 10-20 exemplos antes de usar!`,
          desc: 'Bootstrap de eval set quando não há anotação manual. Revisar manualmente é obrigatório.',
        },
      ],
      mentalModels: [
        'FARC: F,A → prompt. R → chunking. C → retrieval. Diagnóstico sistemático.',
        'Nunca julga quem gerou — judge != gerador. Viés de auto-favorecimento = scores inflados.',
        'FP80: Faithfulness > 0.80 + Precision > 0.75 = thresholds de gate de CI.',
        'Faith↓+Prec↑ = bug de prompt (não de retrieval). Faith↓+Prec↓ = ruído no retrieval.',
        'Delta vs. baseline é mais importante que valor absoluto — compare mudanças, não estados.',
      ],
    },
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'RAGAS',
    stackLabel: 'RAG Evaluation Framework',
  }),
  mindmap: () => buildMindmapPdf({
    categories: MINDMAP_CATEGORIES,
    checklist: MINDMAP_CHECKLIST,
    accentColor: C,
    skillName: 'RAGAS',
    stackLabel: 'RAG Evaluation Framework',
    checklistTitle: 'Auto-avaliação pré-entrevista',
    checklistDesc: 'Responda SIM para pelo menos 8 antes de ir a uma entrevista de AI Engineering.',
  }),
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function RagasPdfs() {
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
