import { useState, useEffect, useRef } from 'react'

interface BackgroundState {
  orbs: Array<{
    x: number
    y: number
    color: string
    scale: number
  }>
  mouseOffsetX: number
  mouseOffsetY: number
}

const ORB_CONFIGS = [
  { color1: '#6366f1', color2: '#8b5cf6', baseX: 0.2, baseY: 0.3, scale: 1.2 },
  { color1: '#06b6d4', color2: '#0ea5e9', baseX: 0.7, baseY: 0.5, scale: 1.0 },
  { color1: '#a855f7', color2: '#ec4899', baseX: 0.4, baseY: 0.8, scale: 1.1 },
  { color1: '#3b82f6', color2: '#6366f1', baseX: 0.8, baseY: 0.2, scale: 0.9 },
]

export function useScrollBackground() {
  const [background, setBackground] = useState<BackgroundState>({
    orbs: ORB_CONFIGS.map((config) => ({
      x: config.baseX * 100,
      y: config.baseY * 100,
      color: `${config.color1}40`,
      scale: config.scale,
    })),
    mouseOffsetX: 0,
    mouseOffsetY: 0,
  })

  const [scrollProgress, setScrollProgress] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? scrollTop / docHeight : 0
      setScrollProgress(progress)

      // Update orbs based on scroll progress with smooth interpolation
      setBackground((prev) => ({
        ...prev,
        orbs: ORB_CONFIGS.map((config, i) => {
          const scrollOffset = Math.sin(progress * Math.PI * 2 + i * 1.5) * 30
          const baseX = (config.baseX + Math.cos(scrollProgress * Math.PI * 4) * 0.1) * 100
          const baseY = (config.baseY + scrollOffset / 100) * 100
          
          return {
            x: baseX,
            y: baseY,
            color: config.color1 + '60',
            scale: config.scale + Math.sin(progress * Math.PI + i) * 0.2,
          }
        }),
      }))
    }

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20
      const y = (e.clientY / window.innerHeight - 0.5) * 20
      setBackground((prev) => ({
        ...prev,
        mouseOffsetX: x,
        mouseOffsetY: y,
      }))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [scrollProgress])

  return { background, containerRef }
}
