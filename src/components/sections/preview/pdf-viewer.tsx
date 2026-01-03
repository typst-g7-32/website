"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { ArrowLeft, ArrowRight, Download } from "lucide-react"
import { Button } from "@/components/ui/buttons/button"
import { LoadingSpinner } from "@/components/ui/spinner"
import Link from "next/link"

import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.mjs'

interface PdfViewerProps {
  pdfUrl: string
  showControls?: boolean
}

const PAGE_BUFFER = 2

export default function PdfViewer({
  pdfUrl,
  showControls = true
}: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [containerWidth, setContainerWidth] = useState<number | null>(null)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const pageRefs = useRef<Map<number, HTMLDivElement>>(new Map())
  
  const isProgrammaticScroll = useRef(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width
        setContainerWidth(prev => {
          if (!prev || Math.abs(prev - width) > 15) {
            return width
          }
          return prev
        })
      }
    })

    resizeObserver.observe(container)
    return () => resizeObserver.disconnect()
  }, [])

  useEffect(() => {
    if (isLoading || !numPages || !containerRef.current) return

    const options = {
      root: containerRef.current,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0
    }

    observerRef.current = new IntersectionObserver((entries) => {
      if (isProgrammaticScroll.current) return

      const visibleEntries = entries.filter(entry => entry.isIntersecting)
      
      if (visibleEntries.length > 0) {
        const entry = visibleEntries[0]
        const pageNum = Number(entry.target.getAttribute('data-page-number'))
        if (!isNaN(pageNum)) {
          setPageNumber(pageNum)
        }
      }
    }, options)

    pageRefs.current.forEach((element) => {
      if (element) observerRef.current?.observe(element)
    })

    return () => {
      observerRef.current?.disconnect()
    }
  }, [isLoading, numPages, pageNumber])

  const handleScroll = () => {
    if (isProgrammaticScroll.current || !containerRef.current || !numPages) return

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 5
    
    if (isAtBottom && pageNumber !== numPages) {
      setPageNumber(numPages)
    }
  }

  const scrollToPage = (targetPage: number) => {
    const element = pageRefs.current.get(targetPage)
    const container = containerRef.current

    if (element && container) {
      isProgrammaticScroll.current = true
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)

      setPageNumber(targetPage)

      const containerRect = container.getBoundingClientRect()
      const elementRect = element.getBoundingClientRect()
      const relativeTop = elementRect.top - containerRect.top + container.scrollTop
      
      const targetScrollTop = relativeTop - 16

      container.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth'
      })

      scrollTimeoutRef.current = setTimeout(() => {
        isProgrammaticScroll.current = false
        handleScroll()
      }, 800)
    } else {
      setPageNumber(targetPage)
    }
  }

  const goToPreviousPage = () => scrollToPage(Math.max(pageNumber - 1, 1))
  const goToNextPage = () => scrollToPage(Math.min(pageNumber + 1, numPages || 1))

  const shouldRenderPage = (index: number) => {
    const pageIndex = index + 1
    return pageIndex >= pageNumber - PAGE_BUFFER && pageIndex <= pageNumber + PAGE_BUFFER
  }

  return (
    <div className="group relative w-full h-full bg-gray-50 flex flex-col overflow-hidden">
      
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 w-full overflow-y-auto overflow-x-hidden custom-scrollbar px-2 md:px-10 scroll-smooth overscroll-y-contain relative"
      >
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex h-full items-center justify-center min-h-[50vh]">
              <LoadingSpinner size={48} />
            </div>
          }
          error={
            <div className="flex h-full items-center justify-center text-red-500 font-medium">
              Не удалось загрузить документ
            </div>
          }
          className="flex flex-col items-center gap-4"
        >
          {numPages && Array.from(new Array(numPages), (_, index) => {
            const pageIndex = index + 1
            const isRendered = shouldRenderPage(index)
            
            return (
              <div
                key={`page-wrapper-${pageIndex}`}
                data-page-number={pageIndex}
                ref={(el) => {
                  if (el) {
                    pageRefs.current.set(pageIndex, el)
                    observerRef.current?.observe(el)
                  } else {
                    pageRefs.current.delete(pageIndex)
                  }
                }}
                className="shadow-md rounded-sm bg-white transition-opacity duration-300"
                style={{
                  width: containerWidth || '100%',
                  minHeight: containerWidth ? containerWidth * 1.414 : '300px', 
                  opacity: isRendered ? 1 : 0.5 
                }}
              >
                {isRendered ? (
                  <Page 
                    pageNumber={pageIndex} 
                    width={containerWidth || undefined} 
                    loading={
                      <div 
                        className="bg-gray-100 animate-pulse" 
                        style={{ 
                          width: '100%',
                          aspectRatio: '1 / 1.414'
                        }} 
                      />
                    }
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    error={<div className="p-4 text-xs text-red-400">Ошибка страницы</div>}
                  />
                ) : (
                  <div 
                    className="flex items-center justify-center text-gray-300 text-sm font-medium"
                    style={{ 
                      width: '100%', 
                      height: containerWidth ? containerWidth * 1.414 : '300px' 
                    }}
                  >
                    Страница {pageIndex}
                  </div>
                )}
              </div>
            )
          })}
        </Document>
      </div>

      {!isLoading && showControls && (
        <div className="pointer-events-none absolute inset-0 z-50 flex flex-col justify-between p-4">
          
          <div className="flex justify-end pointer-events-auto">
            <Link href={pdfUrl} target="_blank">
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-10 rounded-full bg-gray-900/80 text-white shadow-lg backdrop-blur-md hover:bg-gray-800"
              >
                <Download className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="hidden md:flex justify-center w-full pointer-events-auto">
            <div className="flex items-center gap-3 rounded-full bg-gray-900/90 px-4 py-2 shadow-xl backdrop-blur-md border border-white/10">
              <Button
                variant="ghost"
                size="sm"
                disabled={pageNumber <= 1}
                className="h-9 w-9 rounded-full p-0 text-white hover:bg-white/20 disabled:opacity-30"
                onClick={goToPreviousPage}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>

              <span className="min-w-16 text-center text-sm font-medium text-gray-100 tabular-nums">
                {pageNumber} / {numPages || "-"}
              </span>

              <Button
                variant="ghost"
                size="sm"
                disabled={numPages !== null && pageNumber >= numPages}
                className="h-9 w-9 rounded-full p-0 text-white hover:bg-white/20 disabled:opacity-30"
                onClick={goToNextPage}
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
