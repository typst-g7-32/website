import { ExternalLink } from "lucide-react";

export function InlineLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center text-white underline hover:text-blue-400 transition-colors"
    >
      {children}
      <ExternalLink className="h-4 w-4 ml-1" />
    </a>
  )
}