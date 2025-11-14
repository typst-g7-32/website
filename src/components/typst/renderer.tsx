"use client"

import { useState, useMemo, useCallback } from "react"
import { useMDXPath } from "@/lib/mdx-path-context"
import { useTypstCompiler } from "@/hooks/use-typst-compiler"
import { TypstEditor } from "./editor"
import { TypstOutput } from "./output"
import { DynamicCodeBlock } from "@/components/fumadocs/dynamic-codeblock"
import { formatTypstError, parseTypstError } from "@/lib/typst/error-parser"

interface TypstRenderProps {
  code: string
  image: string
  layout?: "horizontal" | "vertical"
  title?: string
  wordWrap?: boolean
  editable?: boolean
}

const HIDE_START = "// hide-start"
const HIDE_END = "// hide-end"

function filterCode(code: string): string {
  const lines = code.split("\n")
  const result: string[] = []
  let hideActive = false

  for (const line of lines) {
    const trimmed = line.trim()

    if (trimmed.includes(HIDE_START)) {
      hideActive = true
      continue
    }

    if (trimmed.includes(HIDE_END)) {
      hideActive = false
      continue
    }

    if (!hideActive) {
      result.push(line)
    }
  }

  while (result.length > 0 && result[0].trim() === "") {
    result.shift()
  }
  while (result.length > 0 && result[result.length - 1].trim() === "") {
    result.pop()
  }

  return result.join("\n")
}

export function TypstRender({
  code,
  image,
  layout = "horizontal",
  title,
  wordWrap = true,
  editable = true,
}: TypstRenderProps) {
  const [imageError, setImageError] = useState(false)
  const [compiledSvg, setCompiledSvg] = useState<string | null>(null)
  const [localCompileError, setLocalCompileError] = useState<string | null>(null)

  const { docPath } = useMDXPath()
  const {
    compile,
    isLoading: compilerLoading,
    compilerInitError,
    compileError: hookCompileError
  } = useTypstCompiler()

  const displayCode = useMemo(() => filterCode(code), [code])

  const imagePath = useMemo(() => {
    if (image.startsWith("/")) {
      return image
    }
    return `/docs/attachments/${docPath}/${image}`
  }, [image, docPath])

  const isEditable = editable && !compilerLoading && !compilerInitError && !!compile

  const compileCode = useCallback(
    async (codeToCompile: string) => {
      if (!compile) {
        return
      }

      setLocalCompileError(null)

      try {
        const svg = await compile(codeToCompile)

        if (!svg) {
          throw new Error("Compiler returned empty result")
        }

        if (typeof svg !== "string") {
          throw new Error("Compiler returned invalid type of SVG")
        }

        const trimmedSvg = svg.trim()
        if (!trimmedSvg.startsWith("<svg")) {
          throw new Error("Invalid svg: does not start with <svg")
        }

        const processed = trimmedSvg
        .replace(/width="[^"]*"/g, '')
        .replace(/height="[^"]*"/g, '')
      

        setCompiledSvg(processed)
        setLocalCompileError(null)
      } catch (error: unknown) {
        const parsedError = parseTypstError(error)
        const message = formatTypstError(parsedError)
        setLocalCompileError(message)
        console.log("Compilation error:", error)
      }
    },
    [compile]
  )

  const handleEditorChange = useCallback(
    (newCode: string) => {
      compileCode(newCode)
    },
    [compileCode]
  )

  const containerClass =
    layout === "horizontal"
      ? "flex flex-row gap-8 items-stretch"
      : "flex flex-col gap-8"

  const codeBlockClass = layout === "horizontal" ? "w-1/2" : "w-full"

  const displayCompileError = localCompileError || hookCompileError

  return (
    <div className="typst-render-container my-6">
      {title && (
        <h4 className="text-sm font-medium mb-3 text-fd-foreground">{title}</h4>
      )}

      <div className={containerClass}>
        <div className={codeBlockClass}>
          {isEditable ? (
            <TypstEditor
              code={displayCode}
              onChange={handleEditorChange}
              wordWrap={wordWrap}
            />
          ) : (
            <DynamicCodeBlock
              code={displayCode}
              lang="typst"
              wordWrap={wordWrap}
              codeblock={{
                className: "h-full"
              }}
            />
          )}
        </div>

        <TypstOutput
          compiledSvg={compiledSvg}
          imagePath={imagePath}
          compileError={displayCompileError}
          imageError={imageError}
          onImageError={() => setImageError(true)}
          layout={layout}
        />
      </div>
    </div>
  )
}
