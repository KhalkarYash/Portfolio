'use client'
import { useCallback } from 'react'

export function useScrollTo() {
  const scrollTo = useCallback((elementId) => {
    const element = document.getElementById(elementId)
    if (!element) return

    const elementPosition = element.getBoundingClientRect().top + window.scrollY
    const startPosition = window.scrollY
    const distance = elementPosition - startPosition
    
    let start = null
    const duration = 1000 // Duration in ms
    
    // Spring animation parameters
    const tension = 0.8
    const dampening = 0.5
    
    function animation(currentTime) {
      if (start === null) start = currentTime
      const timeElapsed = currentTime - start
      const progress = Math.min(timeElapsed / duration, 1)
      
      // Spring easing function
      const springProgress = 1 - Math.cos((progress * Math.PI) / 2)
      const easedProgress = 1 - (Math.cos(springProgress * Math.PI) * Math.exp(-dampening * progress))
      
      window.scrollTo(0, startPosition + distance * (easedProgress * tension))
      
      if (progress < 1) {
        requestAnimationFrame(animation)
      }
    }
    
    requestAnimationFrame(animation)
  }, [])

  return scrollTo
}