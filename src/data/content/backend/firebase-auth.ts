import type { SkillContent } from '@/types'

const firebaseAuth: SkillContent = {
  tagline: "Autenticação gerenciada do Firebase — OAuth social, email/senha, phone, sem backend.",
  why: "Firebase Auth é a escolha comum em protótipos e apps mobile React Native. Elimina a necessidade de implementar auth do zero.",
  gotchas: [
    "Token Firebase válido por 1h — verificar no backend com Admin SDK a cada request crítica.",
    "Sem controle sobre dados do usuário — Firebase guarda no projeto Google, não em seu banco.",
    "Vendor lock-in — migrar de Firebase Auth para outro provider exige migrar todos os usuários.",
  ],
}

export default firebaseAuth
