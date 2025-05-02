'use client'
import { motion, useMotionTemplate } from 'framer-motion'
import { useHoverEffect } from '@/hooks/useHoverEffect'

export default function MagneticCard({ children, className = '', intensity = 0.2 }) {
  const { x, y, scale, handlers } = useHoverEffect(intensity)

  return (
    <motion.div
      className={`relative ${className}`}
      style={{
        transform: useMotionTemplate`translateX(${x}px) translateY(${y}px) scale(${scale})`
      }}
      {...handlers}
    >
      {children}
      <motion.div
        className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 
          opacity-0 transition-opacity group-hover:opacity-100 -z-10 blur-sm"
        style={{
          transform: useMotionTemplate`translateX(${x}px) translateY(${y}px)`
        }}
      />
    </motion.div>
  )
}