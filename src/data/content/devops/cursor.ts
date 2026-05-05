import type { SkillContent } from '@/types'

const cursor: SkillContent = {
  tagline: "Editor com AI nativa (Claude/GPT) — fork do VS Code com chat, autocomplete e agent mode integrados.",
  why: "Cursor virou o editor preferido de quem usa AI no desenvolvimento. Diferencial sobre Copilot: contexto de codebase inteira no chat, agent mode que edita múltiplos arquivos, Apply rápido. Vale entender o modelo de uso (quando deixar o agent rodar, quando revisar cada passo).",
  gotchas: [
    "Agent mode pode apagar ou refatorar código em cadeia sem pedir confirmação se você não revisar os diffs — sempre revise antes de aceitar.",
    "Cursor envia código para API externa (Anthropic/OpenAI) — avaliar política de privacidade antes de usar em projetos com dados sensíveis ou NDA.",
    "Autocomplete agressivo pode sugerir código funcional mas com padrões ruins — não aceitar sem leitura, especialmente em segurança.",
    "Modelos mudam de versão silenciosamente — o que funcionava com Claude 3.5 pode se comportar diferente com Claude 4.x.",
  ],
  resources: [
    { title: "Cursor Documentation", url: "https://docs.cursor.com/", kind: "docs" },
  ],
}

export default cursor
