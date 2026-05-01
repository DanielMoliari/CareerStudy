/* CareerStudy — conteudo didatico por skill.
 *
 * Cada entrada (key = slug):
 * {
 *   tagline: frase curta resumindo a skill em uma linha
 *   why:     por que importa pro mercado / pra entrevista
 *   summary: paragrafo introdutorio (3-6 linhas)
 *   keypoints: [{ title, body }] — conceitos-chave que precisa dominar
 *   gotchas:  [string] — armadilhas comuns / coisas que pegam em entrevista
 *   interview: [{ q, a }] — perguntas tipicas com resposta-modelo
 *   resources: [{ title, url, kind }] — kind: 'docs' | 'video' | 'artigo' | 'curso' | 'livro' | 'pratica'
 *   diagram?: id de diagrama em concepts.html
 * }
 */

window.SKILL_CONTENT = window.SKILL_CONTENT || {}

window.SKILL_CONTENT_HELPERS = {
  // merge content batches (para os agentes injetarem em paralelo)
  register(batch) {
    Object.assign(window.SKILL_CONTENT, batch)
  },
  has(slug) { return !!window.SKILL_CONTENT[slug] },
  get(slug) { return window.SKILL_CONTENT[slug] || null },
}
