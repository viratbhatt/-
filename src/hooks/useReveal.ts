import { useState, useEffect, useRef } from 'react'

export function useReveal(options?: IntersectionObserverInit) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Disconnect after revealing so animation only happens once
          observer.disconnect()
        }
      },
      {
        threshold: options?.threshold || 0.1,
        rootMargin: options?.rootMargin || '0px 0px -50px 0px',
        ...options,
      }
    )

    observer.observe(ref.current)
    
    return () => observer.disconnect()
  }, [])

  return { ref, isVisible }
}
