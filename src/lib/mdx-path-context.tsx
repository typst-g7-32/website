"use client"

import { createContext, useContext, ReactNode } from 'react'

interface MDXPathContextType {
  docPath: string
}

const MDXPathContext = createContext<MDXPathContextType | undefined>(undefined)

export function MDXPathProvider({
  children,
  docPath,
}: {
  children: ReactNode
  docPath: string
}) {
  return (
    <MDXPathContext.Provider value={{ docPath }}>
      {children}
    </MDXPathContext.Provider>
  )
}

export function useMDXPath() {
  const context = useContext(MDXPathContext)
  if (!context) {
    throw new Error('useMDXPath must be used within MDXPathProvider')
  }
  return context
}
