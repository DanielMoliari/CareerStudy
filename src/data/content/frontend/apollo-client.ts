import type { SkillContent } from '@/types'

const apolloClient: SkillContent = {
    tagline: "Cliente GraphQL com cache normalizado para React — padrão em stacks GraphQL.",
    why: "Apollo Client aparece em qualquer stack com GraphQL. Entender o cache normalizado, queries/mutations/subscriptions e políticas de fetch é necessário.",
    gotchas: [
      "O cache normalizado do Apollo pode servir dados obsoletos após mutations. Use refetchQueries ou update no cache manualmente.",
      "Apollo InMemoryCache normaliza por __typename + id — se sua API não retorna id consistentemente, o cache não funciona corretamente.",
      "Apollo adiciona peso considerável ao bundle (~30KB). Para queries simples, urql ou fetch direto são alternativas mais leves.",
    ],
}

export default apolloClient
