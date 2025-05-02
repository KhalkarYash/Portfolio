'use client'
import { useState, useEffect, useRef } from 'react'

export function useInView(options = {}) {
  const [isInView, setIsInView] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current || hasAnimated) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true)
        if (!options.repeat) {
          setHasAnimated(true)
          observer.disconnect()
        }
      } else if (options.repeat) {
        setIsInView(false)
      }
    }, {
      threshold: options.threshold || 0.1,
      rootMargin: options.rootMargin || '50px'
    })

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [options.threshold, options.rootMargin, options.repeat, hasAnimated])

  return [ref, isInView]
}