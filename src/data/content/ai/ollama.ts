import type { SkillContent } from '@/types'

const ollama: SkillContent = {
    tagline: 'Roda LLMs open source localmente com um comando — sem GPU obrigatória.',
    why: 'Viabiliza desenvolvimento offline, privacidade total e custo zero por token. Padrão para protótipos e ambientes corporativos com restrição de dados.',
    gotchas: [
      'Desempenho em CPU é muito lento para modelos grandes (> 13B) — use GPU via Metal (Mac) ou CUDA (Linux/Windows).',
      'Ollama não substitui vLLM em produção com múltiplos usuários — é single-user por design.',
      'Modelos baixados ficam em ~/.ollama/models — disco enche rápido. Use `ollama list` e `ollama rm` para gerenciar.',
      'API compatível com OpenAI, mas não 100% — alguns parâmetros são ignorados silenciosamente.',
    ],
    summary: 'Ollama empacota llama.cpp com gerenciador de modelos, servidor HTTP e CLI. Um `ollama pull llama3.2` baixa o modelo GGUF; `ollama serve` sobe API OpenAI-compatible em localhost:11434. Suporta Modelfile para customizar system prompt e parâmetros. Base para LM Studio e jan.ai.',
    resources: [
      { title: 'Ollama — site oficial', url: 'https://ollama.com/', kind: 'docs' },
      { title: 'Ollama — GitHub', url: 'https://github.com/ollama/ollama', kind: 'docs' },
      { title: 'Ollama — Modelfile reference', url: 'https://github.com/ollama/ollama/blob/main/docs/modelfile.md', kind: 'docs' },
    ],
  }

export default ollama
