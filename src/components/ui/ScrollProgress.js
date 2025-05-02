'use client'
import { motion, useScroll, useSpring } from 'framer-motion'
import { trackEvent } from '@/utils/analytics'

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // Track significant scroll progress points
  const handleScrollProgress = () => {
    const progress = scrollYProgress.get()
    if (progress >= 0.25 && progress < 0.26) {
      trackEvent('scroll_milestone', { progress: '25%' })
    } else if (progress >= 0.5 && progress < 0.51) {
      trackEvent('scroll_milestone', { progress: '50%' })
    } else if (progress >= 0.75 && progress < 0.76) {
      trackEvent('scroll_milestone', { progress: '75%' })
    } else if (progress >= 0.98) {
      trackEvent('scroll_milestone', { progress: '100%' })
    }
  }

  // Add scroll event listener
  if (typeof window !== 'undefined') {
    scrollYProgress.onChange(handleScrollProgress)
  }

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 
          origin-left z-50"
        style={{ scaleX }}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={scrollYProgress.get() * 100}
        aria-label="Page scroll progress"
      />
      <div 
        className="fixed top-2 right-4 text-sm text-white/60 z-50"
        aria-hidden="true"
      >
        <motion.span>
          {Math.round(scrollYProgress.get() * 100)}%
        </motion.span>
      </div>
    </>
  )
}