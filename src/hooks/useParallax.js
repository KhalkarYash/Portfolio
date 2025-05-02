'use client'
import { useScroll, useTransform, MotionValue } from 'framer-motion'
import { useRef } from 'react'

export function useParallax(distance = 50, direction = 'up') {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })

  const transformMap = {
    up: [distance, -distance],
    down: [-distance, distance],
    left: [distance, -distance],
    right: [-distance, distance]
  }

  const yRange = transformMap[direction] || transformMap.up
  const y = useTransform(scrollYProgress, [0, 1], yRange)

  return { ref, y }
}