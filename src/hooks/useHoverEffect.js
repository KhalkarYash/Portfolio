'use client'
import { useState, useCallback } from 'react'
import { useSpring } from 'framer-motion'

export function useHoverEffect(intensity = 0.2) {
  const [isHovered, setIsHovered] = useState(false)
  const springConfig = { damping: 15, stiffness: 300 }
  
  const x = useSpring(0, springConfig)
  const y = useSpring(0, springConfig)
  const scale = useSpring(1, springConfig)

  const handleMouseMove = useCallback((event) => {
    if (!isHovered) return

    const bounds = event.currentTarget.getBoundingClientRect()
    const mouseX = event.clientX - bounds.left
    const mouseY = event.clientY - bounds.top
    const centerX = bounds.width / 2
    const centerY = bounds.height / 2

    const moveX = (mouseX - centerX) * intensity
    const moveY = (mouseY - centerY) * intensity

    x.set(moveX)
    y.set(moveY)
  }, [isHovered, intensity, x, y])

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
    scale.set(1.05)
  }, [scale])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
    scale.set(1)
  }, [x, y, scale])

  return {
    x,
    y,
    scale,
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave
    }
  }
}