'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface QuoteData {
  text: string;
  page: number;
  children: ReactNode;
}

interface QuoteContextType {
  registerQuote: (id: string, text: string, page: number, children: ReactNode) => void;
  getQuote: (id: string) => QuoteData | undefined;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [quotes, setQuotes] = useState<Map<string, QuoteData>>(new Map());

  const registerQuote = (id: string, text: string, page: number, children: ReactNode) => {
    setQuotes(prev => {
      if (prev.has(id)) return prev;
      const next = new Map(prev);
      next.set(id, { text, page, children });
      return next;
    });
  };

  const getQuote = (id: string) => quotes.get(id);

  return (
    <QuoteContext.Provider value={{ registerQuote, getQuote }}>
      {children}
    </QuoteContext.Provider>
  );
}

export function useQuotes() {
  const context = useContext(QuoteContext);
  if (!context) throw new Error('useQuotes must be used within QuoteProvider');
  return context;
}
