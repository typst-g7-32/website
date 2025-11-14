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
      <p>{innerText(children)}</p>
      <footer className="text-sm -mt-5 text-right">
        <a 
          href={pdfLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:underline inline-block pl-4"
        >
          ГОСТ 7.32-2017, стр. {page}
        </a>
      </footer>
    </blockquote>
  );
}
