"use client"

import Image from "next/image"

interface TypstOutputProps {
  compiledSvg: string | null
  imagePath: string | null
  isCompiling: boolean
  compileError: string | null
  imageError: boolean
  onImageError: () => void
  layout?: "horizontal" | "vertical"
}

export function TypstOutput({
  compiledSvg,
  imagePath,
  isCompiling,
  compileError,
  imageError,
  onImageError,
  layout = "horizontal",
}: TypstOutputProps) {
  const outputBlockClass =
    layout === "horizontal"
      ? "w-1/2 flex items-center justify-center p-4 bg-gray-200 rounded-lg relative overflow-auto"
      : "w-full flex items-center justify-center p-4 bg-gray-200 rounded-lg relative overflow-auto"

  return (
    <div className={outputBlockClass}>
      {compiledSvg ? (
        <div
          className="w-full h-auto"
          dangerouslySetInnerHTML={{ __html: compiledSvg }}
        />
      ) : imagePath && !imageError ? (
        <div className="w-full h-auto">
          <Image
            src={imagePath}
            alt="Typst rendered output"
            width={800}
            height={600}
            className="w-full h-auto object-contain"
            onError={onImageError}
            unoptimized
          />
        </div>
      ) : (
        <div className="text-fd-muted-foreground text-sm text-center p-4">
          <div>No output</div>
          {imagePath && (
            <div className="text-xs mt-2 opacity-70 break-all font-mono">
              {imagePath}
            </div>
          )}
        </div>
      )}

      {isCompiling && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded">
          <div className="text-fd-muted-foreground text-sm text-center animate-pulse">
            Compiling...
          </div>
        </div>
      )}

      {compileError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-500/80 rounded p-4">
          <div className="text-white text-sm text-center">
            <div className="font-medium">Compilation error</div>
            <div className="text-xs mt-2 opacity-90 break-all font-mono">
              {compileError}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
