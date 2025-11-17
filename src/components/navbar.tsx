'use client'

import { useState } from 'react'
import Link from 'next/link'
import { GitHubStars } from '@/components/github-stars'

export function Navbar() {
  const [open, setOpen] = useState(false)

  const closeMenu = () => setOpen(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-600/20 bg-gray-950/20 backdrop-blur-md">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" onClick={closeMenu} className="flex items-center">
            <span className="ml-2 text-2xl font-bold text-white">Typst 7.32</span>
          </Link>

          <div className="ml-8 hidden md:flex items-center space-x-8">
            <Link href="/docs" className="hover:text-white transition-colors" onClick={closeMenu}>
              Документация
            </Link>
            <Link
              href="/examples"
              className="pointer-events-none text-gray-500"
              onClick={closeMenu}
              aria-disabled="true"
            >
              Примеры (в работе)
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="hidden md:block">
            <GitHubStars />
          </div>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-300 hover:text-white hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 transition"
            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(prev => !prev)}
          >
            <svg
              className={`h-6 w-6 ${open ? 'hidden' : 'block'}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
            <svg
              className={`h-6 w-6 ${open ? 'block' : 'hidden'}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-200 ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-gray-600/20 bg-gray-950/80 backdrop-blur-md">
          <div className="container mx-auto px-4 py-3 space-y-2">
            <Link
              href="/docs"
              className="block rounded px-3 py-2 hover:text-white hover:bg-white/5 transition"
              onClick={closeMenu}
            >
              Документация
            </Link>
            <Link
              href="/examples"
              className="block rounded px-3 py-2 text-gray-500 pointer-events-none"
              onClick={closeMenu}
              aria-disabled="true"
            >
              Примеры (в работе)
            </Link>

            <div className="pt-2">
              <GitHubStars />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
