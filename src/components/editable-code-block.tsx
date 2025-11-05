"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Check, Clipboard } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCopyButton } from "@/lib/fumadocs/utils/use-copy-button"
import { buttonVariants } from "@/components/fumadocs/button"
import { DynamicCodeBlock } from "@/components/fumadocs/dynamic-codeblock"
import type { DynamicCodeblockProps } from "@/components/fumadocs/dynamic-codeblock"

export interface EditableCodeBlockProps extends Omit<DynamicCodeblockProps, "code"> {
  /**
   * Initial code content
   */
  code: string

  /**
   * Title/label for the code block
   */
  title?: string

  /**
   * Enable editing mode
   *
   * @defaultValue false
   */
  editable?: boolean

  /**
   * Callback when code is changed
   */
  onCodeChange?: (code: string) => void

  /**
   * Allow copying code
   *
   * @defaultValue true
   */
  allowCopy?: boolean

  /**
   * Show line numbers
   *
   * @defaultValue false
   */
  showLineNumbers?: boolean
}

export function EditableCodeBlock({
  code: initialCode,
  title,
  editable = false,
  onCodeChange,
  allowCopy = true,
  showLineNumbers = false,
  lang,
  ...props
}: EditableCodeBlockProps) {
  const [code, setCode] = useState(initialCode)
  const [checked, onCopy] = useCopyButton(() => {
    void navigator.clipboard.writeText(code)
  })

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const handleCodeChange = useCallback(
    (newCode: string) => {
      setCode(newCode)
      onCodeChange?.(newCode)
    },
    [onCodeChange],
  )

  // Синхронизация прокрутки и размеров
  const handleScroll = useCallback(() => {
    if (!textareaRef.current || !scrollContainerRef.current) return

    scrollContainerRef.current.scrollTop = textareaRef.current.scrollTop
    scrollContainerRef.current.scrollLeft = textareaRef.current.scrollLeft
  }, [])

  // Сброс значения при изменении initialCode
  useEffect(() => {
    setCode(initialCode)
  }, [initialCode])

  const containerClass = cn(
    "relative rounded-lg overflow-hidden h-[500px]",
    !title && "rounded-lg",
  )

  const textareaClass = cn(
    "absolute inset-0 w-full h-full p-4 font-mono text-sm bg-transparent text-transparent caret-white border-0 focus:outline-none focus:ring-0 resize-none overflow-auto z-10 text-sm my-0 shiki shiki-themes github-light github-dark"
  )

  const syntaxHighlightClass = cn(
    "absolute inset-0 overflow-auto pointer-events-none",
    "z-0",
  )

  return (
    <div className="space-y-3">
      {/* Header */}
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-card rounded-t-lg">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {allowCopy && (
            <button
              type="button"
              data-checked={checked || undefined}
              className={cn(
                buttonVariants({
                  className:
                    "hover:text-accent-foreground data-checked:text-accent-foreground",
                  size: "icon-xs",
                }),
              )}
              aria-label={checked ? "Copied" : "Copy code"}
              onClick={onCopy}
            >
              {checked ? (
                <Check className="w-4 h-4" />
              ) : (
                <Clipboard className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      )}

      {editable ? (
        <div className={containerClass}>
          <div ref={scrollContainerRef} className={syntaxHighlightClass}>
            <DynamicCodeBlock
              lang={lang}
              code={code}
              wrapInSuspense={true}
              codeblock={{
                "data-line-numbers": showLineNumbers,
                allowCopy: false,
                className: "min-h-full",
              }}
              {...props}
            />
          </div>

          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            onScroll={handleScroll}
            className={textareaClass}
            style={{
              tabSize: "2",
              fontFamily: "var(--default-mono-font-family)",
              fontFeatureSettings: "var(--default-mono-font-feature-settings, normal)",
              fontVariationSettings: "var(--default-mono-font-variation-settings, normal)",
              lineHeight: "var(--text-sm--line-height)",
              fontSize: "13px",
              letterSpacing: "0",
            }}
            spellCheck="false"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </div>
      ) : (
        <div className={cn(!title && "rounded-lg")}>
          <DynamicCodeBlock
            lang={lang}
            code={code}
            wrapInSuspense={true}
            codeblock={{
              "data-line-numbers": showLineNumbers,
              allowCopy: false,
              className: cn(!title && "rounded-lg"),
            }}
            {...props}
          />
        </div>
      )}
    </div>
  )
}