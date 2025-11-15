'use client';

import innerText from 'react-innertext';

interface QuoteProps {
  page: number;
  children: React.ReactNode;
}

const PDF_URL = "/gost-7.32-2017.pdf";

export function GostQuote({ children, page }: QuoteProps) {
  const pdfLink = `${PDF_URL}#page=${page}`;
  
  if (!children) {
    console.error(`Quote text is not defined`);
  }

  if (!page) {
    console.error(`Page number is not defined for quote`);
  }
  
  return (
    <blockquote className="not-italic">
      <div
        className="relative pl-6 py-4 rounded-r-lg transition-all hover:border-l-primary/60"
        style={{
          background: "linear-gradient(to right, color-mix(in srgb, var(--color-fd-border) 30%, transparent), transparent)"
        }}
      >
        
        {/* Quote text */}
        <p className="text-foreground/85 leading-relaxed italic font-medium hyphens-auto">
          {innerText(children)}
        </p>
        
        {/* Footer with GOST reference */}
        <footer className="text-xs text-muted-foreground mt-3 flex items-center justify-between">
          <span className="text-primary/60 font-semibold">ГОСТ 7.32-2017</span>
          <a 
            href={pdfLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 hover:underline transition-colors font-medium"
          >
            страница {page} →
          </a>
        </footer>
      </div>
    </blockquote>
  );
}
