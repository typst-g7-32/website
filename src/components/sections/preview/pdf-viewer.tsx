"use client"

import { useState, useCallback, useRef, useEffect, useLayoutEffect } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { ArrowLeft, ArrowRight, Download } from "lucide-react"
import { Button } from "@/components/ui/buttons/button"
import Link from "next/link"
import Image from "next/image"

import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.mjs'

interface PdfViewerProps {
  pdfUrl: string
  maxPagesApprox?: number
  showControls?: boolean
  previewImageSrc?: string
}

const PAGE_BUFFER = 2

export default function PdfViewer({
  pdfUrl,
  maxPagesApprox = 15,
  showControls = true,
  previewImageSrc = "/preview-document.png"
}: PdfViewerProps) {
  const [isActive, setIsActive] = useState(false)
  const [isPdfReady, setIsPdfReady] = useState(false)
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [containerWidth, setContainerWidth] = useState<number | null>(null)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const pageRefs = useRef<Map<number, HTMLDivElement>>(new Map())
  
  const targetPageRef = useRef<number>(1)
  const isProgrammaticScroll = useRef(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useLayoutEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0
    }
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
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

  const activateViewer = useCallback((targetPage: number = 1) => {
    if (isActive) return
    targetPageRef.current = targetPage
    setIsActive(true)
    setPageNumber(targetPage)
  }, [isActive])

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
  }, [])

  const onPageRenderSuccess = useCallback(() => {
    if (isPdfReady) return

    const targetPage = targetPageRef.current
    const element = pageRefs.current.get(targetPage)

    if (element && containerRef.current) {
      isProgrammaticScroll.current = true
      
      const container = containerRef.current
      const containerRect = container.getBoundingClientRect()
      const elementRect = element.getBoundingClientRect()
      
      const currentScrollTop = container.scrollTop
      const relativeTop = elementRect.top - containerRect.top
      const targetScrollTop = currentScrollTop + relativeTop - 16

      if (targetPage > 1) {
        container.scrollTop = targetScrollTop
      }

      setTimeout(() => {
        setIsPdfReady(true)
        setTimeout(() => {
            isProgrammaticScroll.current = false
        }, 100)
      }, 50)
    }
  }, [isPdfReady])

  useEffect(() => {
    if (!isPdfReady || !numPages || !containerRef.current) return

    const options = {
      root: containerRef.current,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0
    }

    observerRef.current = new IntersectionObserver((entries) => {
      if (isProgrammaticScroll.current || !isPdfReady) return

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
  }, [isPdfReady, numPages])

  const handleScroll = () => {
    if (!isActive && containerRef.current && containerRef.current.scrollTop > 50) {
      activateViewer(1)
      return
    }
    
    if (!isPdfReady || isProgrammaticScroll.current || !containerRef.current || !numPages) return

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 5
    
    if (isAtBottom && pageNumber !== numPages) {
      setPageNumber(numPages)
    }
  }

  const scrollToPage = (targetPage: number) => {
    if (!isActive) {
      activateViewer(targetPage)
      return
    }

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
      }, 800)
    } else {
      setPageNumber(targetPage)
    }
  }

  const goToPreviousPage = (e: React.MouseEvent) => {
    e.stopPropagation() 
    scrollToPage(Math.max(pageNumber - 1, 1))
  }

  const goToNextPage = (e: React.MouseEvent) => {
    e.stopPropagation()
    scrollToPage(Math.min(pageNumber + 1, numPages || maxPagesApprox))
  }

  const shouldRenderPage = (index: number) => {
    const pageIndex = index + 1
    if (!isPdfReady) {
        return pageIndex === targetPageRef.current || pageIndex === 1
    }
    return pageIndex >= pageNumber - PAGE_BUFFER && pageIndex <= pageNumber + PAGE_BUFFER
  }

  const estimatedPageHeight = containerWidth ? containerWidth * 1.414 : 500

  return (
    <div className="group relative w-full h-full bg-gray-50 flex flex-col overflow-hidden">
      
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className={`flex-1 w-full overflow-y-auto overflow-x-hidden custom-scrollbar px-2 md:px-10 scroll-smooth overscroll-y-contain relative`}
        onClick={() => !isActive && activateViewer(1)}
      >
        <div 
          className="w-full flex flex-col items-center gap-4 py-4 absolute top-0 left-0 right-0 z-10"
          style={{ 
             display: isPdfReady ? 'none' : 'flex',
             pointerEvents: 'none'
          }}
        >
          <div 
             className="relative shadow-md rounded-sm bg-white overflow-hidden"
             style={{
               width: containerWidth || '100%',
               minHeight: estimatedPageHeight,
               maxWidth: '100%'
             }}
          >
            <Image 
              src={previewImageSrc}
              alt="Document Preview"
              fill
              className="object-contain"
              priority
            />
          </div>

          {Array.from({ length: maxPagesApprox - 1 }).map((_, i) => (
             <div 
                key={`fake-page-${i}`}
                className="shadow-md rounded-sm bg-white relative flex items-center justify-center text-gray-300 text-sm font-medium"
                style={{
                    width: containerWidth || '100%',
                    minHeight: estimatedPageHeight, 
                }}
             >
             </div>
          ))}
        </div>

        {isActive && (
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={null}
            className={`flex flex-col items-center gap-4 py-4 relative z-0 ${isPdfReady ? 'opacity-100' : 'opacity-0'}`}
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
                      if (isPdfReady) observerRef.current?.observe(el)
                    } else {
                      pageRefs.current.delete(pageIndex)
                    }
                  }}
                  className="shadow-md rounded-sm bg-white relative"
                  style={{
                    width: containerWidth || '100%',
                    minHeight: estimatedPageHeight, 
                  }}
                >
                  {isRendered ? (
                    <Page 
                      pageNumber={pageIndex} 
                      width={containerWidth || undefined} 
                      onRenderSuccess={pageIndex === targetPageRef.current ? onPageRenderSuccess : undefined}
                      loading={
                        <div className="bg-white w-full h-full absolute inset-0" />
                      }
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                      error={null}
                    />
                  ) : (
                    <div className="flex items-center justify-center text-gray-300 text-sm font-medium absolute inset-0">
                      Страница {pageIndex}
                    </div>
                  )}
                </div>
              )
            })}
          </Document>
        )}
      </div>

      {showControls && (
        <div className="pointer-events-none absolute inset-0 z-40 flex flex-col justify-between p-4">
          <div className="flex justify-end pointer-events-auto">
            <Link 
              href={pdfUrl} 
              target="_blank" 
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-10 rounded-full bg-gray-900/80 text-white hover:bg-gray-900/60 hover:text-white shadow-sm backdrop-blur-sm"
              >
                <Download className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="hidden md:flex justify-center w-full pointer-events-auto">
            <div 
              className="flex items-center gap-3 rounded-full bg-gray-900/80 px-4 py-2 shadow-xl backdrop-blur-md border border-white/10 transition-opacity duration-300"
              onClick={(e) => e.stopPropagation()} 
            >
              <Button
                variant="ghost"
                size="sm"
                disabled={pageNumber <= 1}
                className="h-9 w-9 rounded-full p-0 text-white hover:bg-white/20 hover:text-white disabled:opacity-30"
                onClick={goToPreviousPage}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>

              <span className="min-w-16 text-center text-sm font-medium text-gray-100 tabular-nums">
                {pageNumber} / {numPages || maxPagesApprox}
              </span>

              <Button
                variant="ghost"
                size="sm"
                disabled={numPages !== null ? pageNumber >= numPages : pageNumber >= maxPagesApprox}
                className="h-9 w-9 rounded-full p-0 text-white hover:bg-white/20 hover:text-white disabled:opacity-30"
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