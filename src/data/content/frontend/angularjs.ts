import type { SkillContent } from '@/types'

const angularjs: SkillContent = {
    tagline: "Framework JavaScript legado do Google (AngularJS 1.x) — não confunda com Angular moderno.",
    why: "AngularJS (1.x) ainda roda em sistemas legados. Não confunda com Angular (2+) que é completamente diferente.",
    gotchas: [
      "AngularJS atingiu End of Life em dezembro de 2021 — sem mais patches de segurança. Migre para Angular, React ou Vue.",
      "O two-way binding via $scope e $watch tem performance cara em apps com muitos watchers. Sintoma: digest cycle lento.",
      "Não misture AngularJS com ES modules nativos — o sistema de módulos do AngularJS é próprio e anterior aos ES modules.",
    ],
}

export default angularjs
