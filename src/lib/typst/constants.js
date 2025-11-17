/**
 * Стандартный префикс для Typst кода.
 * Добавляется перед пользовательским кодом при компиляции.
 */
export const DEFAULT_HIDDEN_PREFIX = `#import "@preview/modern-g7-32:0.2.0": gost, abstract

#set page(width: 500pt, height: auto, fill: color.white)

#show: gost.with(
  hide-title: true,
)

#set page(footer: none, margin: 30pt)

`

/**
 * Стандартный суффикс для Typst кода.
 * Добавляется после пользовательского кода при компиляции.
 */
export const DEFAULT_HIDDEN_SUFFIX = null
