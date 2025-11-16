"use client"

import Image from "next/image"

interface TypstOutputProps {
  compiledSvg: string | null
  imagePath: string | null
  compileError: string | null
  imageError: boolean
  onImageError: () => void
  layout?: "horizontal" | "vertical"
}

export function TypstOutput({
  compiledSvg,
  imagePath,
  compileError,
  imageError,
  onImageError,
  layout = "horizontal",
}: TypstOutputProps) {
  const outputBlockClass =
    layout === "horizontal"
      ? "w-1/2 flex items-center justify-center p-4 bg-gray-200 dark:bg-gray-800 rounded-lg relative overflow-auto"
      : "w-full flex items-center justify-center p-4 bg-gray-200 dark:bg-gray-800 rounded-lg relative overflow-auto"

  return (
    <div className={outputBlockClass}>
      {compiledSvg ? (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ maxWidth: '800px', maxHeight: '600px' }}
          dangerouslySetInnerHTML={{ __html: compiledSvg }}
        />
      ) : imagePath && !imageError ? (
        <Image
          src={imagePath}
          alt="Typst rendered output"
          width={800}
          height={600}
          className="w-full h-auto object mt-0 mb-0"
          onError={onImageError}
          unoptimized
        />
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

      {compileError && (
        <div className="absolute top-4 left-4 right-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md shadow-lg">
          <div className="text-amber-700 dark:text-amber-400 text-sm font-medium mb-1">
            Ошибка компиляции
          </div>
          <div className="text-amber-600 dark:text-amber-500 text-xs font-mono break-all">
            {compileError}
          </div>
        </div>
      )}
    </div>
  )
}
