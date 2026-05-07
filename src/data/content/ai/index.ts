import type { SkillContentMap } from '@/types'
import agenticWorkflows from './agentic-workflows/agentic-workflows'
import rag from './rag/rag'
import functionCalling from './function-calling'
import mcp from './mcp/mcp'
import langgraph from './langgraph/langgraph'
import fineTuningLora from './fine-tuning-lora/fine-tuning-lora'
import llmops from './llmops/llmops'
import ragas from './ragas/ragas'
import anthropicSdk from './anthropic-sdk/anthropic-sdk'
import openaiSdk from './openai-sdk/openai-sdk'
import promptEngineering from './prompt-engineering/prompt-engineering'
import multimodal from './multimodal'
import crewai from './crewai'
import huggingFace from './hugging-face/hugging-face'
import quantizacaoGguf from './quantizacao-gguf'
import vllm from './vllm'
import langsmith from './langsmith'
import aiGuardrails from './ai-guardrails/ai-guardrails'
import hnswIvf from './hnsw-ivf/hnsw-ivf'
import ollama from './ollama'
import telegramBots from './telegram-bots'
import gramjsTelethon from './gramjs-telethon'
import cheerio from './cheerio'

const ai: SkillContentMap = {
  'agentic-workflows': agenticWorkflows,
  'rag': rag,
  'function-calling': functionCalling,
  'mcp': mcp,
  'langgraph': langgraph,
  'fine-tuning-lora': fineTuningLora,
  'llmops': llmops,
  'ragas': ragas,
  'anthropic-sdk': anthropicSdk,
  'openai-sdk': openaiSdk,
  'prompt-engineering': promptEngineering,
  'multimodal': multimodal,
  'crewai': crewai,
  'hugging-face': huggingFace,
  'quantizacao-gguf': quantizacaoGguf,
  'vllm': vllm,
  'langsmith': langsmith,
  'ai-guardrails': aiGuardrails,
  'hnsw-ivf': hnswIvf,
  'ollama': ollama,
  'telegram-bots': telegramBots,
  'gramjs-telethon': gramjsTelethon,
  'cheerio': cheerio,
}

export default ai
