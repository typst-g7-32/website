"use client"
import { useState, useRef, useCallback } from "react";
import { Viewer, Worker, PageChangeEvent, DocumentLoadEvent } from '@react-pdf-viewer/core';
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';
import { ArrowLeft, ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/spinner";

interface PdfViewerProps {
  pdfUrl: string;
}

export function PdfViewer({ pdfUrl }: PdfViewerProps) {
  const [pageNumber, setPageNumber] = useState(0);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const viewerRef = useRef<Viewer | null>(null);

  const pageNavPluginInstance = pageNavigationPlugin();
  const { jumpToPage } = pageNavPluginInstance;

  const toolbarPluginInstance = toolbarPlugin();
  const zoomPluginInstance = zoomPlugin({ enableShortcuts: false });

  const onDocumentLoadSuccess = useCallback((e: DocumentLoadEvent) => {
    setNumPages(e.doc.numPages);
    zoomPluginInstance.zoomTo(1);
    setIsLoaded(true);
  }, [zoomPluginInstance]);

  const handlePageChange = useCallback((e: PageChangeEvent) => {
    setPageNumber(e.currentPage);
  }, []);

  const goToPreviousPage = useCallback(() => {
    if (pageNumber > 0) {
      jumpToPage(pageNumber - 1);
    }
  }, [pageNumber, jumpToPage]);

  const goToNextPage = useCallback(() => {
    if (numPages && pageNumber < numPages - 1) {
      jumpToPage(pageNumber + 1);
    }
  }, [pageNumber, numPages, jumpToPage]);

  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
      <div className="h-full relative">
        <Viewer
          ref={viewerRef}
          fileUrl={pdfUrl}
          plugins={[toolbarPluginInstance, pageNavPluginInstance, zoomPluginInstance]}
          onDocumentLoad={onDocumentLoadSuccess}
          onPageChange={handlePageChange}
        />

        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-20">
            <LoadingSpinner size={48} />
          </div>
        )}

        {isLoaded && (
          <>
            <div className="absolute top-4 right-4 z-10 bg-white shadow-lg">
              <a href={pdfUrl} download>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <Download className="h-4 w-4" />
                  <span className="sr-only">Скачать документ</span>
                </Button>
              </a>
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center bg-white shadow-lg rounded-lg p-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={pageNumber <= 0}
                className="h-8 w-8 p-0 hover:bg-gray-100"
                onClick={goToPreviousPage}
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Предыдущая страница</span>
              </Button>

              <div className="mx-3 text-sm font-medium text-gray-700">
                {pageNumber + 1}/{numPages || '-'}
              </div>

              <Button
                variant="ghost"
                size="sm"
                disabled={numPages !== null && pageNumber >= numPages - 1}
                className="h-8 w-8 p-0 hover:bg-gray-100"
                onClick={goToNextPage}
              >
                <ArrowRight className="h-4 w-4" />
                <span className="sr-only">Следующая страница</span>
              </Button>
            </div>
          </>
        )}
      </div>
    </Worker>
  );
}
