import type { SkillContent } from '@/types'

const repositoryPattern: SkillContent = {
  tagline: 'Abstrair o acesso a dados por trás de uma interface que parece uma coleção de objetos de domínio.',
  why: 'Repository aparece em toda discussão de DDD, Clean Architecture e testabilidade. Entrevistador testa se você entende o propósito (isolar domínio de persistência) ou se só decorou o nome.',
  summary: 'Repository pattern expõe uma interface para salvar e recuperar aggregates sem revelar como são persistidos. O consumidor (use case, service) vê uma "coleção" — OrderRepository.findById(id), OrderRepository.save(order). A implementação concreta usa ORM, SQL, HTTP, memória — o domínio não sabe. Isso habilita: teste com fake/mock sem banco, troca de ORM sem tocar domínio, e clareza de onde vivem queries. O perigo é o Repository virar DAO gigante com 50 métodos de query — aí o padrão perdeu o propósito.',
  gotchas: [
    'Repository com 50 métodos de query personalizados — virou DAO disfarçado. Queries complexas devem ir para um read model separado (CQRS) ou query service.',
    'Um Repository por tabela em vez de por aggregate — Order e OrderItem não têm repositórios separados; Repository cuida do aggregate root.',
    'Expor IQueryable/Criteria ao domínio — o consumidor controla a query, o Repository perde a abstração. Exponha métodos com intenção de domínio, não mecanismos de filtro.',
    'Achar que Repository substitui CQRS — para leitura complexa (dashboards, relatórios), um read model denormalizado é mais adequado que um Repository cheio de projeções especiais.',
  ],
}

export default repositoryPattern
