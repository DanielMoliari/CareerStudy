import type { SkillContent } from '@/types'

const git: SkillContent = {
  tagline: "Sistema de controle de versão distribuído — fundamento de todo fluxo de trabalho moderno.",
  why: "Git é a cola que une tudo em desenvolvimento. Senior sabe não só os comandos — sabe resolver conflito de merge, entender rebase vs merge, cherry-pick, bisect pra debugar, e explicar o modelo de objetos (commit, tree, blob).",
  gotchas: [
    "git pull --rebase é mais limpo que merge em branch pessoal, mas rebase em branch compartilhada reescreve histórico e quebra o trabalho do time.",
    "git reset --hard descarta mudanças sem confirmação — diferente de git revert (cria commit desfazendo) que é seguro em branch pública.",
    "Commits imensos com dezenas de arquivos dificultam code review e bisect. Prefira commits atômicos com mensagem descritiva.",
    "git add . captura arquivos não intencionais (.env, binários). Use git add -p para review linha a linha.",
    "Forçar push em main sem proteção apaga histórico para o time inteiro. Nunca --force, prefira --force-with-lease.",
  ],
  resources: [
    { title: "Pro Git (livro gratuito)", url: "https://git-scm.com/book/pt-br/v2", kind: "livro" },
    { title: "Oh Shit, Git!? (guia de recoveries)", url: "https://ohshitgit.com/pt_BR", kind: "artigo" },
  ],
}

export default git
