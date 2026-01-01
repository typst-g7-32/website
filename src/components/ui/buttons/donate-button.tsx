import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Heart } from "lucide-react"
import Link from "next/link"
import { NAVIGATION_LINKS } from "@/lib/navigation"

export function DonateButton({
  className = "",
  onClick,
  isMobile = false,
}: {
  className?: string
  onClick?: () => void
  isMobile?: boolean
}) {
  return (
    <Button
      variant="outline"
      size="default"
      className={cn(
        "border-pink-500/30 bg-pink-500/5 hover:bg-pink-500/10 hover:border-pink-500/50 text-gray-200 hover:text-pink-100",
        isMobile && "w-full bg-pink-500/10 hover:bg-pink-500/20 text-pink-200",
        className
      )}
      asChild
    >
      <Link
        href={NAVIGATION_LINKS.DONATE}
        onClick={onClick}
      >
        <Heart className={cn(
          "w-4 h-4 text-pink-500 transition-colors",
          !isMobile && "group-hover:text-pink-400 group-hover:scale-110"
        )} />
        Пожертвовать
      </Link>
    </Button>
  )
}