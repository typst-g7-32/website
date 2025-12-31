"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface HeroBackgroundProps {
  gridColor?: string
  gridOpacity?: number
  gridSize?: number
  particleCount?: number
  particleColor?: string
  fadeBottom?: boolean
  fadeStart?: number
}

function Particle({ color }: { color: string }) {
  const [mounted, setMounted] = useState(false)
  const [params, setParams] = useState({
    left: 0,
    top: 0,
    duration: 10,
    delay: 0,
  })

  useEffect(() => {
    setParams({
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 10 + Math.random() * 10,
      delay: Math.random() * 5,
    })
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full"
      style={{
        left: `${params.left}%`,
        top: `${params.top}%`,
        backgroundColor: color,
      }}
      animate={{ y: [0, -100, 0], opacity: [0.2, 0.5, 0.2] }}
      transition={{
        duration: params.duration,
        repeat: Number.POSITIVE_INFINITY,
        delay: params.delay,
        ease: "easeInOut",
      }}
    />
  )
}

export function HeroBackground({
  gridColor = "#2563E8",
  gridOpacity = 0.03,
  gridSize = 100,
  particleCount = 50,
  particleColor = "rgba(37, 99, 232, 0.3)",
  fadeBottom = true,
  fadeStart = 70,
}: HeroBackgroundProps) {
  const maskStyle = fadeBottom
    ? {
        WebkitMaskImage: `linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${fadeStart}%, rgba(0,0,0,0) 100%)`,
        maskImage: `linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${fadeStart}%, rgba(0,0,0,0) 100%)`,
      }
    : {}

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
      style={maskStyle}
    >
      {/* Grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          opacity: gridOpacity,
          backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
          backgroundSize: `${gridSize}px ${gridSize}px`,
        }}
      />

      {/* Floating particles */}
      {[...Array(particleCount)].map((_, i) => (
        <Particle key={i} color={particleColor} />
      ))}
    </div>
  )
}
