"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { useMDXPath } from "@/lib/mdx-path-context"

import { DynamicCodeBlock } from "./fumadocs/dynamic-codeblock"

interface TypstRenderProps {
  code: string
  image: string
  layout?: "horizontal" | "vertical"
  title?: string
  wordWrap?: boolean
}

const HIDE_START = "// hide-start"
const HIDE_END = "// hide-end"

function filterCode(code: string): string {
  const lines = code.split("\n")
  const result: string[] = []
  let hideActive = false

  for (const line of lines) {
    console.log(line)
    if (line.includes(HIDE_START)) {
      hideActive = true
      continue
    }

    if (line.includes(HIDE_END)) {
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
  wordWrap = true
}: TypstRenderProps) {
  const [imageError, setImageError] = useState(false)
  const { docPath } = useMDXPath()

  const displayCode = useMemo(() => filterCode(code), [code])

  const imagePath = useMemo(() => {
    if (image.startsWith('/')) {
      return image
    }
    return `/docs/attachments/${docPath}/${image}`
  }, [image, docPath])

  const containerClass = layout === "horizontal"
    ? "flex flex-row gap-8 items-stretch"
    : "flex flex-col gap-8"

  const codeBlockClass = layout === "horizontal"
    ? "w-1/2"
    : "w-full"

  const outputBlockClass = layout === "horizontal"
    ? "w-1/2 flex items-center justify-center p-4 bg-gray-200 rounded-lg"
    : "w-full flex items-center justify-center p-4 bg-gray-200 rounded-lg"

  return (
    <div className="typst-render-container my-6">
      {title && <h4 className="text-sm font-medium mb-3 text-fd-foreground">{title}</h4>}

      <div className={containerClass}>
        <div className={codeBlockClass}>
          <DynamicCodeBlock
            code={displayCode}
            lang="typst"
            wordWrap={wordWrap}
            codeblock={{
              className: "h-full"
            }}
          />


        </div>

        <div className={outputBlockClass}>
          {imagePath && !imageError ? (
            <div className="w-full h-auto">
              <Image
                src={imagePath}
                alt="Typst rendered output"
                width={800}
                height={600}
                className="w-full h-auto object-contain"
                onError={() => setImageError(true)}
                unoptimized
              />
            </div>
          ) : (
            <div className="text-fd-muted-foreground text-sm text-center p-4">
              <div>Failed to load image</div>
              {imagePath && <div className="text-xs mt-2 opacity-70 break-all font-mono">{imagePath}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
