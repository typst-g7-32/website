"use client"

import { useEffect, useState } from "react"
import { Star } from "lucide-react"

export function GitHubStars() {
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
    <a
      href="https://github.com/typst-g7-32/modern-g7-32"
      className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Star className="h-5 w-5 group-hover:fill-current" />
      <span className="flex items-center gap-2">
        GitHub
        {!isLoading && <span className="text-gray-400">({stars})</span>}
      </span>
    </a>
  )
}

