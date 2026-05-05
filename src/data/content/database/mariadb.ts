import type { SkillContent } from '@/types'

const mariadb: SkillContent = {
  tagline: "Fork do MySQL com features extras, open-source 100% e compatível na maioria dos casos.",
  why: "MariaDB é drop-in replacement para MySQL em muitos casos mas com divergências crescentes. Saber as diferenças evita surpresas ao migrar.",
  gotchas: [
    "MariaDB e MySQL divergiram significativamente a partir da versão 10.x — nem toda feature do MySQL 8 existe no MariaDB e vice-versa.",
    "Columnstore engine (para analytics) é exclusivo do MariaDB — não existe no MySQL.",
    "JSON no MariaDB é implementado como LONGTEXT com funções, não tipo nativo binário como no MySQL 8+ — performance diferente em queries JSON.",
    "Replicação MySQL → MariaDB geralmente funciona; MariaDB → MySQL pode ter incompatibilidades em versões novas.",
  ],
}

export default mariadb
