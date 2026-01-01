"use client"

import { useEffect, useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/buttons/button"
import Link from "next/link"
import { NAVIGATION_LINKS } from "@/lib/navigation"

export function GitHubButton() {
  const [stars, setStars] = useState<string>("0")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("https://api.github.com/repos/typst-g7-32/modern-g7-32")
      .then((res) => res.json())
      .then((data) => {
        const starCount = data.stargazers_count
        setStars(starCount >= 1000 ? `${(starCount / 1000).toFixed(1)}K` : starCount.toString())
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [])

  return (
    <Button
      variant="outline"
      asChild
    >
      <Link
        href={NAVIGATION_LINKS.GITHUB_REPO}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2"
      >
        GitHub
        <span className="flex items-center gap-0.5">
          <Star className="h-4 w-4 text-blue-500" />
          {!isLoading && <span className="text-gray-400">{stars}</span>}
        </span>
      </Link>
    </Button>
  )
}
