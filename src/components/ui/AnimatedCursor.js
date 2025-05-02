'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function AnimatedCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [cursorVariant, setCursorVariant] = useState('default')

  useEffect(() => {
    const mouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      })
    }

    window.addEventListener('mousemove', mouseMove)

    return () => {
      window.removeEventListener('mousemove', mouseMove)
    }
  }, [])

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      scale: 1
    },
    hover: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      scale: 1.5
    }
  }

  useEffect(() => {
    const handleHover = () => setCursorVariant('hover')
    const handleLeave = () => setCursorVariant('default')

    const elements = document.querySelectorAll('a, button')
    elements.forEach(el => {
      el.addEventListener('mouseenter', handleHover)
      el.addEventListener('mouseleave', handleLeave)
    })

    return () => {
      elements.forEach(el => {
        el.removeEventListener('mouseenter', handleHover)
        el.removeEventListener('mouseleave', handleLeave)
      })
    }
  }, [])

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 
        rounded-full pointer-events-none mix-blend-screen z-50 opacity-50"
      animate={cursorVariant}
      variants={variants}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
    />
  )
}