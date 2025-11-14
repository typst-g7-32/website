"use client"

import { getTypstCompilerUrl, getTypstRendererUrl } from '@/lib/config/typst';
import { useEffect, useRef, useState, useCallback } from "react"

type TypstCompiler = any

export function useTypstCompiler() {
  const [compiler, setCompiler] = useState<TypstCompiler | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [compilerInitError, setCompilerInitError] = useState<string | null>(null)
  const [compileError, setCompileError] = useState<string | null>(null)
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

        typst.setCompilerInitOptions({ getModule: getTypstCompilerUrl });
        typst.setRendererInitOptions({ getModule: getTypstRendererUrl });

        setCompiler(typst)
        setCompilerInitError(null)
      } catch (err) {
        setCompilerInitError(
          err instanceof Error ? err.message : "Failed to load compiler"
        )
      } finally {
        setIsLoading(false)
      }
    }

    initCompiler()

    return () => {
      loadingRef.current = false
    }
  }, [])

  const compile = useCallback(
    async (code: string): Promise<string | null> => {
      if (!compiler) {
        setCompilerInitError("Compiler not initialized")
        return null
      }

      try {
        const svg = await compiler.svg({
          mainContent: code,
        })

        if (!svg || typeof svg !== "string") {
          throw new Error("Compiler returned invalid output")
        }

        setCompileError(null)
        return svg
      } catch (err) {
        const message = err instanceof Error ? err.message : "Compilation failed"
        setCompileError(message)
        console.error("Compilation error:", err)
        throw err;
      }
    },
    [compiler]
  )

  return { 
    compiler, 
    isLoading, 
    compilerInitError, 
    compileError, 
    compile 
  }
}
