'use client'
import { useEffect } from 'react'
import { useScrollTo } from './useScrollTo'

export function useKeyboardShortcuts(sections) {
  const scrollTo = useScrollTo()

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Handle key combinations with Alt key
      if (e.altKey) {
        switch (e.key) {
          case 'h':
            e.preventDefault()
            scrollTo('home')
            break
          case 'a':
            e.preventDefault()
            scrollTo('about')
            break
          case 'p':
            e.preventDefault()
            scrollTo('projects')
            break
          case 'c':
            e.preventDefault()
            scrollTo('contact')
            break
          case 'm':
            e.preventDefault()
            // Toggle mobile menu if exists
            break
          default:
            break
        }
      }

      // Handle focus management with Tab
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation')
      }
    }

    const handleMouseMove = () => {
      document.body.classList.remove('keyboard-navigation')
    }

    window.addEventListener('keydown', handleKeyPress)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [scrollTo])
}