'use client';

interface QuoteProps {
  page: number;
  id: string;
  children: React.ReactNode;
}

const PDF_URL = "/documents/gost-7.32-2017.pdf";

export function GostQuote({ children, page, id }: QuoteProps) {
  const pdfLink = `${PDF_URL}#page=${page}`;
  
  if (!children) {
    console.error(`Quote text is not defined for id: ${id}`);
  }

  if (!page) {
    console.error(`Page number is not defined for quote id: ${id}`);
  }
  
  return (
    <blockquote id={id} className="not-italic" style={{quotes: 'none'}}>
      <div
        className="relative pl-6 py-4 rounded-r-lg transition-all hover:border-l-primary/60"
        style={{
          background: "linear-gradient(to right, color-mix(in srgb, var(--color-fd-border) 30%, transparent), transparent)"
        }}
      >
        <div className="text-foreground/85 leading-relaxed italic font-medium hyphens-auto">
          {children}
        </div>
        
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
