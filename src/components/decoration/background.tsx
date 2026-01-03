'use client'

import { SnowfallDecoration } from "@/components/decoration/winter/snowfall"

export const PageBackground = () => {
  const isProduction = process.env.NODE_ENV === 'production'

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
      <div className="absolute inset-0 bg-linear-to-b from-gray-900 to-gray-950" />

      <div className="absolute inset-0 opacity-[0.1] mix-blend-overlay">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <filter id="noiseFilter">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.6"
              stitchTiles="stitch" 
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      <div
        className="absolute -right-50 -top-50 h-300 w-300 rounded-full blur-[250px] opacity-60"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0) 90%)'
        }}
      />

      <div
        className="absolute -bottom-75 -left-50 h-225 w-225 rounded-full blur-[250px] opacity-60"
        style={{
          background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, rgba(168,85,247,0) 90%)'
        }}
      />
      
      {isProduction && <SnowfallDecoration />}
    </div>
  )
}
