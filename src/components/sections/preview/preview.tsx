"use client"

import { useEffect, useState } from "react"
import PdfViewer from "@/components/sections/preview/pdf-viewer"
import CodeBlock from "@/components/sections/preview/code-viewer"
import { LoadingSpinner } from "@/components/ui/spinner"
import ExpandableContentBlock from "@/components/ui/expandable"
import { Code, FileText } from "lucide-react"

export default function PreviewSection() {
  const [typstCode, setTypstCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTypstCode = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/typst-g7-32/examples/refs/heads/main/documents/preview/main.typ",
        )
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        setTypstCode(await response.text())
      } catch (e: unknown) {
        if (e instanceof Error) setError(`Failed to load Typst code: ${e.message}`)
        else setError("Failed to load Typst code")
      } finally {
        setLoading(false)
      }
    }
    fetchTypstCode()
  }, [])

  return (
    <section className="py-4 container mx-auto">
      <h2 className="text-white text-3xl sm:text-4xl font-bold mb-4 text-center md:text-left md:hidden">
        Пример
      </h2>
      <div className="container mx-auto px-4">
        <div className="relative mx-auto max-w-7xl">
          <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-3xl" />
          <div className="relative bg-gray-800/50 border border-gray-800/50 rounded-3xl p-4 sm:p-6 backdrop-blur-xs">
            <div className="hidden xl:flex gap-6 items-stretch">
              <div className="w-1/2 h-[70vh] min-h-[480px]">
                {loading ? (
                  <div className="flex h-full items-center justify-center">
                    <LoadingSpinner size={48} />
                  </div>
                ) : error ? (
                  <div className="flex h-full items-center justify-center text-red-400">{error}</div>
                ) : (
                  <div className="h-full overflow-hidden rounded-xl">
                    <CodeBlock codeType="typst" codeContent={typstCode || ""} />
                  </div>
                )}
              </div>
              <div className="w-1/2 h-[70vh] min-h-[480px] overflow-hidden rounded-xl">
                <PdfViewer pdfUrl="https://raw.githubusercontent.com/typst-g7-32/examples/refs/heads/preview/preview/preview/preview.pdf" />
              </div>
            </div>

            <div className="xl:hidden space-y-4">
              <ExpandableContentBlock title="Код" icon={<Code size={16} />}>
                {loading ? (
                  <div className="flex h-full items-center justify-center">
                    <LoadingSpinner size={48} />
                  </div>
                ) : error ? (
                  <div className="flex h-full items-center justify-center text-red-400">{error}</div>
                ) : (
                  <CodeBlock codeType="typst" codeContent={typstCode || ""} />
                )}
              </ExpandableContentBlock>

              <ExpandableContentBlock title="Документ" icon={<FileText size={16} />}>
                <PdfViewer pdfUrl="https://raw.githubusercontent.com/typst-g7-32/examples/refs/heads/preview/preview/preview/preview.pdf" />
              </ExpandableContentBlock>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
