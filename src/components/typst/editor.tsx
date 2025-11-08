"use client"

import { useEffect, useRef } from "react"
import { EditorView, keymap } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { history, historyKeymap } from '@codemirror/commands'
import shiki from 'codemirror-shiki'
import { createHighlighterCore } from 'shiki/core'
import { createOnigurumaEngine } from 'shiki/engine/oniguruma'
import { cn } from '@/lib/utils'
import { Check, Clipboard } from 'lucide-react'
import { useCopyButton } from '@/lib/fumadocs/utils/use-copy-button'
import { buttonVariants } from '@/components/fumadocs/button'

interface TypstEditorProps {
  code: string
  onChange: (code: string) => void
  wordWrap?: boolean
  title?: string
  icon?: React.ReactNode
  allowCopy?: boolean
  className?: string
}

const highlighterPromise = createHighlighterCore({
  langs: [
    import('@shikijs/langs/typst'),
    import('@shikijs/langs/javascript'),
  ],
  themes: [
    import('@shikijs/themes/github-dark'),
  ],
  engine: createOnigurumaEngine(import('shiki/wasm')),
})

function CopyButton({
  className,
  containerRef,
}: {
  className?: string
  containerRef: React.RefObject<HTMLElement | null>
}) {
  const [checked, onClick] = useCopyButton(() => {
    const codeBlock = containerRef.current?.querySelector('code')
    if (!codeBlock) return
    void navigator.clipboard.writeText(codeBlock.textContent ?? '')
  })

  return (
    <button
      type="button"
      data-checked={checked || undefined}
      className={cn(
        buttonVariants({
          className:
            'hover:text-fd-accent-foreground data-checked:text-fd-accent-foreground',
          size: 'icon-xs',
        }),
        className,
      )}
      aria-label={checked ? 'Copied Text' : 'Copy Text'}
      onClick={onClick}
    >
      {checked ? <Check /> : <Clipboard />}
    </button>
  )
}

export function TypstEditor({
  code,
  onChange,
  wordWrap = true,
  title,
  icon,
  allowCopy = true,
  className,
}: TypstEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Инициализация редактора
  useEffect(() => {
    if (!editorRef.current) return

    let mounted = true

    const init = async () => {
      const highlighter = await highlighterPromise

      if (!mounted) return

      const state = EditorState.create({
        doc: code,
        extensions: [
          history(),
          keymap.of(historyKeymap),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              const newCode = update.state.doc.toString()
              onChange(newCode)
            }
          }),
          EditorView.theme({
            '.cm-editor.cm-cursor': {
              borderLeftColor: 'white',
            }
          }),
          shiki({
            highlighter: highlighterPromise,
            language: 'typst',
            theme: 'github-dark',
          }),
        ],
      })

      if (mounted && editorRef.current && !viewRef.current) {
        viewRef.current = new EditorView({
          state,
          parent: editorRef.current,
        })
      }
    }

    init()

    return () => {
      mounted = false
      if (viewRef.current) {
        viewRef.current.destroy()
        viewRef.current = null
      }
    }
  }, [])

  // Синхронизация содержимого при изменении кода извне
  useEffect(() => {
    if (!viewRef.current) return

    const currentDoc = viewRef.current.state.doc.toString()
    if (code === currentDoc) return

    viewRef.current.dispatch({
      changes: {
        from: 0,
        to: currentDoc.length,
        insert: code,
      },
    })
  }, [code])

  return (
    <figure
      ref={containerRef}
      dir="ltr"
      className={cn(
        'my-4 bg-fd-card rounded-xl',
        'shiki relative border shadow-sm outline-none not-prose overflow-hidden text-sm',
        className,
      )}
    >
      {title ? (
        <div className="flex text-fd-muted-foreground items-center gap-2 h-9.5 border-b px-4">
          {typeof icon === 'string' ? (
            <div
              className="[&_svg]:size-3.5"
              dangerouslySetInnerHTML={{
                __html: icon,
              }}
            />
          ) : (
            icon
          )}
          <figcaption className="flex-1 truncate">{title}</figcaption>
          {allowCopy && (
            <CopyButton containerRef={containerRef} className="-me-2" />
          )}
        </div>
      ) : (
        allowCopy && (
          <div className="absolute top-2 right-2 z-2 backdrop-blur-lg rounded-lg text-fd-muted-foreground">
            <CopyButton containerRef={containerRef} />
          </div>
        )
      )}
      <div
        className={cn(
          'text-[13px] py-3.5 overflow-auto max-h-[600px] fd-scroll-container',
          !title && 'pr-8',
          wordWrap ? '[&_.cm-line]:whitespace-normal' : '[&_.cm-line]:whitespace-pre'
        )}
        style={
          {
            '--padding-right': !title ? 'calc(var(--spacing) * 8)' : undefined,
          } as object
        }
      >
        <div
          ref={editorRef}
          className="font-mono"
          style={{ fontSize: "14px" }}
        />
      </div>
    </figure>
  )
}
