'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const Snowfall = dynamic(() => import('react-snowfall'), { 
  ssr: false 
})

export const SnowfallDecoration = () => {
  const [mounted, setMounted] = useState(false)
  const [snowflakeCount, setSnowflakeCount] = useState(20)

  useEffect(() => {
    const isMobile = window.innerWidth < 768
    
    setSnowflakeCount(isMobile ? 20 : 50)
    
    const timer = setTimeout(() => setMounted(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) return null

  return (
    <Snowfall 
      style={{
        position: 'fixed',
        width: '100vw',
        height: '100vh',
        zIndex: 0,
      }}
      snowflakeCount={snowflakeCount}
      radius={[0.5, 2.5]}
      speed={[0.5, 1.5]}
    />
  )
}
