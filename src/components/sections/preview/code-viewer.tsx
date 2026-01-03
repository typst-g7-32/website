"use client"

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Copy, Check, X, Loader2 } from 'lucide-react';
import Prism from 'prismjs';
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
  const [copyStatus, setCopyStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleCopyClick = useCallback(async () => {
    setCopyStatus('loading');
    try {
      await navigator.clipboard.writeText(codeContent);
      setCopyStatus('success');
    } catch (err) {
      console.error("Failed to copy text: ", err);
      setCopyStatus('error');
    }
  }, [codeContent]);

  useEffect(() => {
    if (copyStatus !== 'idle') {
      const timer = setTimeout(() => setCopyStatus('idle'), copyStatus === 'success' ? 1000 : 2000);
      return () => clearTimeout(timer);
    }
  }, [copyStatus]);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [codeContent, codeType]);

  const icon = {
    idle: <Copy className="h-4 w-4" />,
    loading: <Loader2 className="h-4 w-4 animate-spin" />,
    success: <Check className="h-4 w-4" />,
    error: <X className="h-4 w-4" />
  }[copyStatus];

  return (
    <div className="flex flex-col h-full bg-gray-800 rounded-lg shadow-md">
      <div className="px-4 py-2 bg-gray-700 flex items-center justify-between shrink-0 sticky top-0 z-10">
        <span className="text-gray-300 font-semibold uppercase text-sm">
          {codeType}
        </span>
        {showControls && (
          <button
            onClick={handleCopyClick}
            disabled={copyStatus === 'loading'}
            className={cn(
              "p-1 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500",
              copyStatus === 'success' && "text-green-400 bg-green-500/20",
              copyStatus === 'error' && "text-red-400 bg-red-500/20",
              copyStatus === 'loading' && "text-blue-400"
            )}
            aria-label={copyStatus === 'success' ? 'Copied!' : copyStatus === 'error' ? 'Copy failed' : 'Copy code'}
          >
            {icon}
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
