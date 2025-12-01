"use client"

import React, { useEffect, useRef } from 'react';
import { Copy } from 'lucide-react';
import Prism from 'prismjs';
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

import '../../../lib/prism/prism-typst';
import '../../../lib/prism/typst-theme';
import '../../../lib/prism/onedark.css';

interface CodeBlockProps {
  codeType: string;
  codeContent: string;
  isScrollable?: boolean;
  showControls?: boolean;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ 
  codeType, 
  codeContent,
  isScrollable = true,
  showControls = true
}) => {
  const codeRef = useRef<HTMLPreElement>(null);
  const { toast } = useToast()

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(codeContent);
      toast({
        title: "Код скопирован!",
        description: "Код успешно скопирован в буфер обмена.",
      })
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось скопировать код.",
      })
    }
  };

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [codeContent, codeType]);

  return (
    <div className="flex flex-col h-full bg-gray-800 rounded-lg shadow-md">
      <div className="px-4 py-2 bg-gray-700 flex items-center justify-between shrink-0 sticky top-0 z-10">
        <span className="text-gray-300 font-semibold uppercase text-sm">
          {codeType}
        </span>
        {showControls && (
          <button
            onClick={handleCopyClick}
            className="text-gray-400 hover:text-white focus:outline-hidden"
            aria-label="Copy code"
          >
            <Copy className="h-4 w-4" />
          </button>
        )}
      </div>
      
      <div className={cn(
        'flex-1 min-h-0',
        isScrollable ? 'overflow-auto' : 'overflow-hidden'
      )}>
        <pre ref={codeRef} className={`language-${codeType} text-[9px] m-0`}>
          <code className={`language-${codeType}`}>{codeContent}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
