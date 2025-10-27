'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ExampleItem } from '@/types/example';
import PdfViewer from '../pdf-viewer';
import CodeBlock from '../code-viewer';
import { LoadingSpinner } from '../ui/spinner';
import { Navbar } from '../navbar';

interface ExampleDetailViewProps {
  example: ExampleItem;
}

export default function ExampleDetailView({ example }: ExampleDetailViewProps) {
  const [typstCode, setTypstCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTypstCode = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(example.codeUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        setTypstCode(text.replace("/src/export.typ", "@example/modern-g7-32:0.1.0"));
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(`Не удалось загрузить код: ${e.message}`);
        } else {
          setError("Не удалось загрузить код");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTypstCode();
  }, [example.codeUrl]);

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-900 to-gray-950">
      <div className="container pb-4 mx-auto px-4 pt-24 sm:pt-28 md:pt-32">
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            {example.title}
          </h1>
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-3xl" />
          <div className="relative bg-gray-800/50 border border-gray-800/50 rounded-3xl p-4 sm:p-6 backdrop-blur-xs">
            <div className="flex flex-col xl:flex-row gap-6 items-stretch">
              <div className="w-full xl:w-1/2 h-[70vh] min-h-[480px]">
                {loading ? (
                  <div className="flex h-full items-center justify-center">
                    <LoadingSpinner size={48} />
                  </div>
                ) : error ? (
                  <div className="flex h-full items-center justify-center text-red-400">
                    {error}
                  </div>
                ) : (
                  <div className="h-full overflow-hidden rounded-xl">
                    <CodeBlock codeType="typst" codeContent={typstCode || ""} />
                  </div>
                )}
              </div>

              <div className="w-full xl:w-1/2 h-[70vh] min-h-[480px] overflow-hidden rounded-xl">
                <PdfViewer pdfUrl={example.pdfUrl} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
