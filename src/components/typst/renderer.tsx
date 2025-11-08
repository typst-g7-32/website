"use client"

import { useState, useMemo, useCallback } from "react"
import { useMDXPath } from "@/lib/mdx-path-context"
import { useTypstCompiler } from "@/hooks/use-typst-compiler"
import { TypstEditor } from "./editor"
import { TypstOutput } from "./output"
import { DynamicCodeBlock } from "@/components/fumadocs/dynamic-codeblock"

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
  const [isCompiling, setIsCompiling] = useState(false)
  const [compileError, setCompileError] = useState<string | null>(null)

  const { docPath } = useMDXPath()
  const { compile, isLoading, error: compilerError } = useTypstCompiler()

  const displayCode = useMemo(() => filterCode(code), [code])

  const imagePath = useMemo(() => {
    if (image.startsWith("/")) {
      return image
    }
    return `/docs/attachments/${docPath}/${image}`
  }, [image, docPath])

  const compileCode = useCallback(
    async (codeToCompile: string) => {
      if (!compile) {
        setCompileError("Compiler not ready")
        return
      }

      setCompileError(null)
      setIsCompiling(true)

      try {
        const svg = await compile(codeToCompile)

        if (!svg) {
          throw new Error("Compiler returned empty output")
        }

        if (typeof svg !== "string") {
          throw new Error("Compiler returned invalid SVG type")
        }

        const trimmedSvg = svg.trim()
        if (!trimmedSvg.startsWith("<svg")) {
          throw new Error("Invalid SVG: does not start with <svg tag")
        }

        console.log("SVG compiled successfully, length:", svg.length)
        setCompiledSvg(trimmedSvg)
        setCompileError(null)
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Compilation failed"
        setCompileError(errorMessage)
        console.error("Compilation error:", error)
      } finally {
        setIsCompiling(false)
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

  return (
    <div className="typst-render-container my-6">
      {title && (
        <h4 className="text-sm font-medium mb-3 text-fd-foreground">{title}</h4>
      )}

      <div className={containerClass}>
        <div className={codeBlockClass}>
          {editable ? (
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

        {compilerError ? (
          <div className="flex-1 flex items-center justify-center p-4 bg-gray-200 rounded-lg">
            <div className="text-red-500 text-sm text-center">
              <div>Compiler initialization error</div>
              <div className="text-xs mt-2 opacity-70 break-all font-mono">
                {compilerError}
              </div>
            </div>
          </div>
        ) : isLoading ? (
          <div className="flex-1 flex items-center justify-center p-4 bg-gray-200 rounded-lg">
            <div className="text-fd-muted-foreground text-sm text-center">
              <div className="animate-pulse">Loading compiler...</div>
            </div>
          </div>
        ) : (
          <TypstOutput
            compiledSvg={compiledSvg}
            imagePath={imagePath}
            isCompiling={isCompiling}
            compileError={compileError}
            imageError={imageError}
            onImageError={() => setImageError(true)}
            layout={layout}
          />
        )}
      </div>
    </div>
  )
}
