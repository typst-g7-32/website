"use client"

import { useEffect, useRef, useState, useCallback } from "react"

type TypstCompiler = any

export function useTypstCompiler() {
  const [compiler, setCompiler] = useState<TypstCompiler | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const loadingRef = useRef(false)

  useEffect(() => {
    if (loadingRef.current) return
    loadingRef.current = true

    const initCompiler = async () => {
      try {
        await import(
          "@myriaddreamin/typst.ts/dist/esm/contrib/all-in-one-lite.bundle.js"
        )

        const typst = (window as any).$typst

        if (!typst) {
          throw new Error("Typst module not loaded")
        }

        typst.setCompilerInitOptions({
          getModule: () =>
            "https://cdn.jsdelivr.net/npm/@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm",
        })

        typst.setRendererInitOptions({
          getModule: () =>
            "https://cdn.jsdelivr.net/npm/@myriaddreamin/typst-ts-renderer/pkg/typst_ts_renderer_bg.wasm",
        })

        setCompiler(typst)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load compiler")
      } finally {
        setIsLoading(false)
      }
    }

    initCompiler()
  }, [])

  const compile = useCallback(
    async (code: string): Promise<string | null> => {
      if (!compiler) {
        setError("Compiler not initialized")
        return null
      }

      try {
        const svg = await compiler.svg({
          mainContent: code,
        })

        if (!svg || typeof svg !== "string") {
          throw new Error("Compiler returned invalid output")
        }

        setError(null)
        return svg
      } catch (err) {
        const message = err instanceof Error ? err.message : "Compilation failed"
        setError(message)
        console.error("Compilation error:", err)
        return null
      }
    },
    [compiler]
  )

  return { compiler, isLoading, error, compile }
}
