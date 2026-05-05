import type { SkillContent } from '@/types'

const promptEngineering: SkillContent = {
    tagline: 'Disciplina de moldar prompts pra obter output confiável — alem de "diga por favor".',
    why: 'Em 2025-2026 ainda é skill base. Senior precisa saber técnicas (CoT, few-shot, role, decomposition) e quando deixar de gambiarra e ir pra fine-tuning ou RAG.',
    summary: 'Prompt engineering é design de input pra LLM produzir output desejado de forma estável. Técnicas vao de básico (instrução clara, formato, role) até avancado (chain-of-thought, decomposition, self-consistency, few-shot dinâmico, prompt chaining). Bom prompt engineer sabe quando não usar prompt — RAG ou fine-tuning resolvem melhor.',
    keypoints: [
      { title: 'Estrutura de prompt', body: 'Role + Task + Context + Format + Examples + Constraints. Cada secao clara. Use XML tags ou markdown pra delimitar.' },
      { title: 'Chain-of-thought', body: '"Pense passo a passo" antes de responder. Em modelos modernos (Sonnet, GPT-4o) já é quase automático, mas explicitar ajuda.' },
      { title: 'Few-shot', body: '2-5 exemplos input -> output no prompt. Modelo segue padrão. Diversifique exemplos pra cobrir edge cases.' },
      { title: 'Role e system prompt', body: 'System prompt define persona, regras, restrições. Mantenha-o estável; varie só user message.' },
      { title: 'Output format', body: 'Pede formato explícito (JSON, markdown, lista). Usa response_format/structured output quando possível.' },
      { title: 'Decomposition', body: 'Tarefa grande -> quebra em subtarefas, cada uma com prompt focado. Prompt chaining encadeia.' },
      { title: 'Self-consistency', body: 'Roda N vezes com temperatura > 0, pega resposta mais comum. Reduz erro em tarefas com raciocinio.' },
      { title: 'Anti-padrões', body: '"Por favor" não melhora. Excesso de instrução confunde. Negacoes ("não faça X") falham — diga o que fazer.' },
    ],
    gotchas: [
      'Prompt longo não é melhor. Modelos modernos perdem foco em prompt > 8k tokens; coloque o crítico no inicio e fim.',
      'Few-shot com exemplos enviesados — modelo replica o vies.',
      'Esquecer de testar prompt em modelos diferentes; o que funciona em GPT-4 falha em Haiku.',
      'Pedir negação ("não mencione X") frequentemente o modelo menciona — frase em positivo.',
      'Misturar instrução em múltiplas linguas — confunde.',
      'Prompt engineering virando muleta pro que deveria ser RAG/fine-tuning.',
      'Esquecer temperature: pra extracao use 0; pra criatividade use 0.7+.',
    ],
    interview: [
      { q: 'Quando prompt engineering não basta?', a: '<p>Quando você precisa de:</p><ul><li><strong>Conhecimento factual</strong> que muda — use RAG.</li><li><strong>Estilo/formato consistente</strong> alem do que prompt aguenta — fine-tune.</li><li><strong>Latência muito baixa</strong> — modelo menor fine-tuned.</li><li><strong>Tarefa muito específica</strong> com dataset (classificacao) — fine-tune barato vence prompting.</li></ul>' },
      { q: 'Estrutura de um bom prompt?', a: '<ul><li><strong>Role</strong>: "Você é especialista em X."</li><li><strong>Task</strong>: o que precisa fazer.</li><li><strong>Context</strong>: dados, constraints.</li><li><strong>Examples</strong>: 2-5 few-shot.</li><li><strong>Format</strong>: JSON schema, markdown.</li><li><strong>Constraints</strong>: o que evitar, limites.</li></ul><p>Use tags XML pra delimitar secoes (Anthropic recomenda).</p>' },
      { q: 'Como evita prompt injection?', a: '<p>Camadas:</p><ul><li>Separa instrução (system) de dados (user) com tags claras.</li><li>Dados não confiáveis (web scrape, email) sempre dentro de tag tipo <code>&lt;untrusted_input&gt;</code>.</li><li>Não executa instruções encontradas dentro de dados.</li><li>Output validation com guardrails (toxicity, secrets).</li><li>Privilege escalation: tool perigosa (delete) requer confirmação humana.</li></ul>' },
      { q: 'Quando usar few-shot?', a: '<p>Quando o output tem padrão específico que descrição não captura fácil. Ex: extrair entidades em formato próprio, classificar em taxonomia interna.</p><p>2-5 exemplos cobrindo casos tipicos e um edge case. Mais que isso só se precisa — gasta contexto.</p>' },
      { q: 'O que é chain-of-thought e quando ajuda?', a: '<p>CoT é forçar o modelo a explicitar passos antes da resposta. "Pense passo a passo" no prompt ou few-shot com raciocinio mostrado.</p><p>Ajuda em: math, raciocinio multi-step, debugging. Em modelos pequenos é enorme; em modelos modernos (Sonnet, GPT-4o) já vem implícito mas explicitar ainda ajuda em tasks dificeis.</p>' },
    ],
    resources: [
      { title: 'Anthropic — Prompt engineering', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview', kind: 'docs' },
      { title: 'OpenAI — Prompt engineering', url: 'https://platform.openai.com/docs/guides/prompt-engineering', kind: 'docs' },
      { title: 'Prompt Engineering Guide (Dair.AI)', url: 'https://www.promptingguide.ai/', kind: 'docs' },
      { title: 'Simon Willison — prompt engineering tag', url: 'https://simonwillison.net/tags/prompt-engineering/', kind: 'artigo' },
      { title: 'Lilian Weng — Prompt Engineering', url: 'https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/', kind: 'artigo' },
    ],
  }

export default promptEngineering
