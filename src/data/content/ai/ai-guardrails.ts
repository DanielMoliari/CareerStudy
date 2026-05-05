import type { SkillContent } from '@/types'

const aiGuardrails: SkillContent = {
    tagline: 'Camadas de segurança em input/output de LLM: prompt injection, PII, toxicity, schema.',
    why: 'Em 2025-2026, com agentes em produção, guardrails saiu do nice-to-have. Saber prompt injection, PII redaction e validação de schema é esperado em qualquer entrevista AI senior.',
    summary: 'Guardrails são filtros antes (input) e depois (output) do LLM, mais checks dentro do loop do agente. Bloqueiam: prompt injection, PII, jailbreak, toxicity, hallucination, schema inválido, output off-topic. Frameworks: Guardrails AI, NeMo Guardrails, Llama Guard. Padrão: defesa em profundidade.',
    keypoints: [
      { title: 'Input guardrails', body: 'PII detection (Presidio), prompt injection (Lakera, Llama Guard), jailbreak (regex + classifier), idioma proibido.' },
      { title: 'Output guardrails', body: 'Toxicity (Perspective API, Llama Guard), schema validation (Zod, Pydantic), citation check, relevance.' },
      { title: 'Prompt injection', body: 'Atacante injeta instrução no input ("ignore tudo, faça X"). Mitigação: separar instrução de dado com tags, classifier dedicado, principle of least privilege em tools.' },
      { title: 'Jailbreak', body: 'Burlar restrições via roleplay, encoding (base64), DAN. Modelos modernos resistem mais; ainda assim use Llama Guard.' },
      { title: 'PII', body: 'Detecta CPF, email, telefone, cartao. Substitui por placeholder antes de enviar pro LLM. Re-injeta no output se necessário.' },
      { title: 'Hallucination check', body: 'Em RAG, válida se resposta esta no contexto (faithfulness). Se não, retorna "não sei".' },
      { title: 'Schema validation', body: 'Após structured output, válida com Zod/Pydantic. Falhou? Retry com erro como feedback.' },
      { title: 'Defense in depth', body: 'Não confie em uma camada. Combine: prompt design + input filter + LLM safe model + output filter + tool authz.' },
    ],
    gotchas: [
      'Confiar só no system prompt pra "não faça X" — fácil de quebrar com prompt injection.',
      'Tool de delete sem confirmação humana — agente jailbroken pode causar dano real.',
      'Guardrail muito restritivo gera falsos positivos e UX ruim.',
      'PII regex não captura tudo — use lib dedicada (Presidio).',
      'Esquecer que dados scraped da web são input não confiável — trate como adversarial.',
      'Output em múltiplos idiomas confunde classifier treinado só em inglês.',
    ],
    interview: [
      { q: 'Como evita prompt injection?', a: '<ul><li><strong>Separe</strong> instrução (system) de dados (user) com tags claras.</li><li><strong>Marque</strong> dados não confiáveis (web, email) como tal: <code>&lt;untrusted&gt;...&lt;/untrusted&gt;</code>.</li><li><strong>Filtre</strong> input com classifier (Lakera, Llama Guard).</li><li><strong>Privilegie</strong> tools: delete/payment exigem confirmação humana.</li><li><strong>Output filter</strong>: bloqueia se modelo "vazou" instrução do usuário.</li></ul><p>Defense in depth.</p>' },
      { q: 'Como detecta hallucination em RAG?', a: '<p>Faithfulness check: LLM-judge compara cada claim da resposta com o contexto recuperado. Se não apoiado, marca.</p><p>Adicionalmente, force citacao no prompt: "para cada afirmação, cite o doc". Válida que doc citado existe e contem o trecho.</p>' },
      { q: 'PII no input — o que faz?', a: '<p>Presidio (Microsoft) detecta + anonymiza. Substitui por placeholder (<code>&lt;CPF_1&gt;</code>). Mantem mapping pra reverter no output se preciso. Loga apenas anonymized.</p><p>Pra dados ultra-sensitive (saude, financeiro), só processa com modelo on-prem (Llama, etc).</p>' },
      { q: 'Como validaria output de schema JSON?', a: '<ul><li>structured output / strict mode na API.</li><li>Validação runtime com Zod/Pydantic.</li><li>Retry com erro como feedback (1-2 vezes).</li><li>Fallback: resposta padrão ou falha gracefull.</li><li>Log e monitora taxa de falha — sinaliza prompt ou modelo ruim.</li></ul>' },
      { q: 'Você confiaria só em Llama Guard?', a: '<p>Não. Llama Guard é bom pra toxicity/safety, mas não cobre tudo (PII, schema, prompt injection contextual). Defense in depth: combine guard model + heurísticas + privilege escalation em tools + human-in-the-loop pra alto risco.</p>' },
    ],
    resources: [
      { title: 'Guardrails AI docs', url: 'https://www.guardrailsai.com/docs/', kind: 'docs' },
      { title: 'NVIDIA NeMo Guardrails', url: 'https://docs.nvidia.com/nemo/guardrails/', kind: 'docs' },
      { title: 'Llama Guard (Meta)', url: 'https://huggingface.co/meta-llama/Llama-Guard-3-8B', kind: 'docs' },
      { title: 'Microsoft Presidio (PII)', url: 'https://microsoft.github.io/presidio/', kind: 'docs' },
      { title: 'OWASP Top 10 for LLM', url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/', kind: 'docs' },
      { title: 'Simon Willison — prompt injection', url: 'https://simonwillison.net/tags/prompt-injection/', kind: 'artigo' },
    ],
  }

export default aiGuardrails
