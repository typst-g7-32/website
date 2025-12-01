  "use client"
  import { useState, useRef, useCallback, useEffect } from "react"
  import { Viewer, Worker, PageChangeEvent, DocumentLoadEvent, SpecialZoomLevel } from "@react-pdf-viewer/core"
  import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation"
  import { toolbarPlugin } from "@react-pdf-viewer/toolbar"
  import { zoomPlugin } from "@react-pdf-viewer/zoom"
  import { ArrowLeft, ArrowRight, Download } from "lucide-react"
  import { Button } from "@/components/ui/button"
  import { LoadingSpinner } from "@/components/ui/spinner"
  import { cn } from "@/lib/utils"

  import "@react-pdf-viewer/core/lib/styles/index.css"
  import "@react-pdf-viewer/default-layout/lib/styles/index.css"
  import "@react-pdf-viewer/toolbar/lib/styles/index.css"

  interface PdfViewerProps {
    pdfUrl: string
    isScrollable?: boolean
    showControls?: boolean
  }

  const zoomPluginOptions = { enableShortcuts: false }

  export default function PdfViewer({
    pdfUrl,
    isScrollable = true,
    showControls = true
  }: PdfViewerProps) {
    const [pageNumber, setPageNumber] = useState(0)
    const [numPages, setNumPages] = useState<number | null>(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const viewerRef = useRef<Viewer | null>(null)

    const pageNavPluginInstance = pageNavigationPlugin()
    const toolbarPluginInstance = toolbarPlugin()
    const zoomPluginInstance = zoomPlugin(zoomPluginOptions)

    const { jumpToPage } = pageNavPluginInstance

    const onDocumentLoadSuccess = useCallback((e: DocumentLoadEvent) => {
      setNumPages(e.doc.numPages)
      setIsLoaded(true)
    }, [])

    const handlePageChange = useCallback((e: PageChangeEvent) => {
      setPageNumber(e.currentPage)
    }, [])

    useEffect(() => {
      if (!isLoaded) return

      if (isScrollable) {
        zoomPluginInstance.zoomTo(SpecialZoomLevel.PageFit)
      } else {
        zoomPluginInstance.zoomTo(SpecialZoomLevel.PageWidth)
      }
    }, [isScrollable, isLoaded, zoomPluginInstance])

    const goToPreviousPage = useCallback(() => {
      if (pageNumber > 0) jumpToPage(pageNumber - 1)
    }, [pageNumber, jumpToPage])

    const goToNextPage = useCallback(() => {
      if (numPages && pageNumber < numPages - 1) jumpToPage(pageNumber + 1)
    }, [pageNumber, numPages, jumpToPage])

    return (
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <div className="group relative h-full w-full rounded-2xl border border-gray-700/30 bg-gray-900/20">
          <div 
            className={cn(
              "h-full w-full custom-scrollbar",
              isScrollable ? "overflow-auto" : "overflow-hidden pointer-events-none"
            )}
          >
            <Viewer
              ref={viewerRef}
              fileUrl={pdfUrl}
              plugins={[toolbarPluginInstance, pageNavPluginInstance, zoomPluginInstance]}
              defaultScale={SpecialZoomLevel.PageWidth}
              onDocumentLoad={onDocumentLoadSuccess}
              onPageChange={handlePageChange}
            />
          </div>

          {!isLoaded && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm">
              <LoadingSpinner size={48} />
            </div>
          )}

          {isLoaded && showControls && (
            <div className="pointer-events-none absolute inset-0 z-40 flex flex-col justify-between p-4">
              <div className="flex justify-end">
                <a href={pdfUrl} download className="pointer-events-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 rounded-full bg-gray-800/80 p-0 text-white shadow-sm backdrop-blur-md hover:bg-gray-700/90"
                  >
                    <Download className="h-5 w-5" />
                    <span className="sr-only">Скачать</span>
                  </Button>
                </a>
              </div>

              <div className="flex justify-center">
                <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-gray-800/80 px-4 py-1.5 shadow-lg backdrop-blur-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={pageNumber <= 0}
                    className="h-8 w-8 rounded-full p-0 hover:bg-gray-700/70"
                    onClick={goToPreviousPage}
                  >
                    <ArrowLeft className="h-4 w-4 text-white" />
                  </Button>

                  <span className="min-w-12 text-center text-sm font-medium text-gray-200">
                    {pageNumber + 1} / {numPages || "-"}
                  </span>

                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={numPages !== null && pageNumber >= numPages - 1}
                    className="h-8 w-8 rounded-full p-0 hover:bg-gray-700/70"
                    onClick={goToNextPage}
                  >
                    <ArrowRight className="h-4 w-4 text-white" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Worker>
    )
  }
