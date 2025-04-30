"use client"
import { PdfViewer } from "@/components/pdf-viewer"
import CodeBlock from "@/components/code-viewer"
import { useEffect, useState } from "react"
import { LoadingSpinner } from "@/components/ui/spinner"

export function PreviewSection() {
  const [typstCode, setTypstCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTypstCode = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch("https://raw.githubusercontent.com/typst-g7-32/typst-g7-32/refs/heads/main/tests/documents/preview/test.typ")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const text = await response.text()
        setTypstCode(text)
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(`Failed to load Typst code: ${e.message}`)
          console.error("Error fetching Typst code:", e)
        } else {
          setError("Failed to load Typst code")
          console.error("Error fetching Typst code:", e)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchTypstCode()
  }, [])

  return (
    <section>
      <div className="container mx-auto">
        <div className="relative mx-auto max-w-7xl mt-16">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg blur-3xl"></div>
          <div className="relative bg-gray-800/50 border border-gray-800/50 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row gap-4 items-stretch">
              <div className="w-full md:w-1/2">
                <div className="h-full">
                  {loading ? (
                    <div className="flex h-full items-center justify-center">
                      <LoadingSpinner size={48} />
                    </div>
                  ) : error ? (
                    <div>Error: {error}</div>
                  ) : (
                    <div className="h-[53rem]">
                      <CodeBlock codeType="typst" codeContent={typstCode || ""} />
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <div className="h-[53rem]">
                  <PdfViewer pdfUrl="https://raw.githubusercontent.com/typst-g7-32/typst-g7-32/refs/heads/preview/main.pdf" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
