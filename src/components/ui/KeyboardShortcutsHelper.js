'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const shortcuts = [
  { key: 'Alt + H', description: 'Go to Home section' },
  { key: 'Alt + A', description: 'Go to About section' },
  { key: 'Alt + P', description: 'Go to Projects section' },
  { key: 'Alt + C', description: 'Go to Contact section' },
  { key: '↑/↓', description: 'Navigate between sections' },
  { key: 'Tab', description: 'Navigate focusable elements' },
  { key: '?', description: 'Toggle shortcuts menu' },
]

export default function KeyboardShortcutsHelper() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === '?' && !e.repeat) {
        e.preventDefault()
        setIsVisible(prev => !prev)
      }
      if (e.key === 'Escape') {
        setIsVisible(false)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 
            bg-dark-secondary/90 backdrop-blur-md rounded-lg p-6 shadow-xl 
            border border-gray-800 max-w-md w-full mx-4"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Keyboard Shortcuts</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close shortcuts menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <div className="space-y-3">
            {shortcuts.map(({ key, description }) => (
              <div key={key} className="flex justify-between items-center">
                <span className="text-gray-400">{description}</span>
                <kbd className="px-2 py-1 bg-gray-800 rounded text-sm font-mono text-gray-200">
                  {key}
                </kbd>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-800">
            <p className="text-sm text-gray-400">
              Press <kbd className="px-2 py-1 bg-gray-800 rounded text-sm font-mono">?</kbd> to
              toggle this menu
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}