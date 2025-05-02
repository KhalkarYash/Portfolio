'use client'
import { motion, useScroll } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useScrollTo } from '@/hooks/useScrollTo'

export default function NavigationDots({ sections }) {
  const { scrollYProgress } = useScroll()
  const [activeSection, setActiveSection] = useState('home')
  const scrollTo = useScrollTo()

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map(section => ({
        id: section,
        element: document.getElementById(section)
      }))

      const viewportHeight = window.innerHeight
      const currentPosition = window.scrollY + viewportHeight / 2

      for (const { id, element } of sectionElements) {
        if (element) {
          const { top, bottom } = element.getBoundingClientRect()
          const elementTop = top + window.scrollY
          const elementBottom = bottom + window.scrollY

          if (currentPosition >= elementTop && currentPosition <= elementBottom) {
            setActiveSection(id)
            break
          }
        }
      }
    }

    const handleKeyPress = (e) => {
      const currentIndex = sections.indexOf(activeSection)
      
      if (e.key === 'ArrowUp' && currentIndex > 0) {
        e.preventDefault()
        scrollTo(sections[currentIndex - 1])
      } else if (e.key === 'ArrowDown' && currentIndex < sections.length - 1) {
        e.preventDefault()
        scrollTo(sections[currentIndex + 1])
      }
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('keydown', handleKeyPress)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [sections, activeSection, scrollTo])

  return (
    <nav 
      className="hidden lg:block fixed right-8 top-1/2 transform -translate-y-1/2 z-50"
      role="navigation"
      aria-label="Section Navigation"
    >
      <div className="flex flex-col gap-4">
        {sections.map((section) => (
          <motion.div
            key={section}
            className="group relative flex items-center"
            whileHover="hover"
          >
            <motion.button
              className={`mr-2 w-3 h-3 rounded-full cursor-pointer transition-all duration-300 focus:outline-none 
                focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-dark
                ${activeSection === section 
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 scale-125' 
                  : 'bg-white'}`}
              whileHover={{ scale: 1.5 }}
              onClick={() => scrollTo(section)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  scrollTo(section)
                }
              }}
              aria-label={`Navigate to ${section} section`}
              aria-current={activeSection === section ? 'true' : 'false'}
              tabIndex={0}
            />
            <motion.div
              className={`hidden lg:block absolute right-0 h-8 w-1 rounded-full -z-10 origin-right
                ${activeSection === section ? 'bg-gradient-to-b from-purple-500 to-blue-500' : ''}`}
              initial={{ scaleX: 0 }}
              animate={{ 
                scaleX: activeSection === section ? 1 : 0,
                opacity: activeSection === section ? 1 : 0
              }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="absolute right-6 text-white text-sm whitespace-nowrap opacity-0 pointer-events-none"
              variants={{
                hover: {
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.2 }
                }
              }}
              initial={{ opacity: 0, x: 20 }}
              role="tooltip"
            ></motion.span>
              {section.charAt(0).toUpperCase() + section.slice(1)}
          </motion.div>
        ))}
      </div>
    </nav>
  )
}