import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/buttons/button"
import { DonateButton } from "./ui/buttons/donate-button"
import { cn } from "@/lib/utils"
import { NAVIGATION_LINKS } from "@/lib/navigation"

const footerLinks = [
  { label: "Документация", href: NAVIGATION_LINKS.DOCS, disabled: true },
  { label: "Примеры", href: NAVIGATION_LINKS.GITHUB_EXAMPLES_REPO, disabled: true, external: true },
]

export function Footer() {
  return (
    <footer className="border-t border-gray-800/40 bg-gray-950/60 backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 lg:gap-8">
          <Link 
            href="/" 
            className="shrink-0 hover:opacity-80 transition-opacity"
          >
            <Image 
              src="/logo.svg" 
              alt="Typst GOST" 
              width={32} 
              height={32} 
              className="w-8 h-8"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-4 lg:gap-8">
            {footerLinks.map((link) => (
              <FooterLink key={link.label} {...link} />
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <DonateButton className="h-9 px-4 text-sm" />
          <Button 
            className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium" 
            asChild
          >
            <a href={NAVIGATION_LINKS.TYPST_UNIVERSE_PACKAGE} target="_blank" rel="noopener noreferrer">
              Начать
            </a>
          </Button>
        </div>
      </div>

      <div className="md:hidden border-t border-gray-800/40 px-4 py-4">
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-3">
           {footerLinks.map((link) => (
              <FooterLink key={link.label} {...link} />
            ))}
        </nav>
      </div>
    </footer>
  )
}

function FooterLink({
  label,
  href,
  disabled = false,
  external = false,
}: {
  label: string
  href: string
  disabled?: boolean
  external?: boolean
}) {
  const baseStyles = "text-sm text-gray-400 hover:text-white transition-colors duration-200"

  if (disabled) {
    return (
      <span className={cn(baseStyles, "opacity-50 cursor-not-allowed hover:text-gray-400")}>
        {label}
      </span>
    )
  }

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={baseStyles}
      >
        {label}
      </a>
    )
  }

  return (
    <Link href={href} className={baseStyles}>
      {label}
    </Link>
  )
}
