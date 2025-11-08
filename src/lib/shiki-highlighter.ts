import { createHighlighterCore } from 'shiki/core'
import { createOnigurumaEngine } from 'shiki/engine/oniguruma'
import type { Highlighter } from 'shiki'

let highlighterPromise: Promise<Highlighter> | null = null

export function getShikiHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      langs: [
        import('@shikijs/langs/typst'),
        import('@shikijs/langs/javascript'),
        import('@shikijs/langs/typescript'),
        // добавьте остальные языки которые использует FumaDocs
      ],
      themes: [import('@shikijs/themes/one-dark-pro')],
      engine: createOnigurumaEngine(import('shiki/wasm')),
    })
  }
  return highlighterPromise
}
