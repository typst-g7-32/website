'use client';

import { createContext, useContext, ReactNode } from 'react';
import { quotesMap, QuoteMetadata } from '@/lib/quotes-registry';

interface QuoteContextType {
  getQuote: (id: string) => QuoteMetadata | undefined;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export function QuoteProvider({ children }: { children: ReactNode }) {
  const getQuote = (id: string): QuoteMetadata | undefined => {
    return quotesMap.get(id);
  };

  return (
    <QuoteContext.Provider value={{ getQuote }}>
      {children}
    </QuoteContext.Provider>
  );
}

export function useQuotes() {
  const context = useContext(QuoteContext);
  if (!context) throw new Error('useQuotes must be used within QuoteProvider');
  return context;
}
