import type { SkillContent } from '@/types'

const mvc: SkillContent = {
  tagline: 'Padrão de separação Model-View-Controller — base de quase todo framework web.',
  why: 'MVC é linguagem universal em entrevista de arquitetura. Saber explicar fluxo, onde mora lógica de negócio, e quando sair do MVC é básico para qualquer cargo senior.',
  summary: 'MVC separa responsabilidades em três: Model (dados e regras), View (apresentação), Controller (coordena request, chama model, seleciona view). Rails, Laravel, Spring MVC, Django seguem esse padrão. Em frameworks modernos de frontend (React, Vue), o padrão evolui: Controller some ou vira hook, View é componente, Model fica em store. A dor clássica do MVC é o Fat Controller (lógica de negócio escorregando pro controller) e o Fat Model (tudo no model vira deus-objeto). A separação correta: Controller recebe HTTP e delega, Model contém regra de domínio, View só formata saída.',
  gotchas: [
    'Fat Controller — colocar lógica de negócio no controller transforma ele em procedimento gigante impossível de testar.',
    'Confundir Model com tabela de banco — Model é camada de domínio, não ORM direto. A relação 1:1 com tabela é anemia de domínio.',
    'View acessando banco diretamente — viola separação, dificulta cache e teste. View recebe dado pronto do controller.',
    'Usar MVC para justificar tudo numa pasta — em projeto grande, MVC sem modularização vira pasta de 300 controllers sem coesão.',
  ],
}

export default mvc
