'use client'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Ensure minimum loading time of 2 seconds for smooth transition
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const containerVariants = {
    initial: { opacity: 1 },
    exit: {
      opacity: 0,
      transition: {
        when: "afterChildren",
      }
    }
  }

  const iconVariants = {
    initial: {
      scale: 0,
      opacity: 0
    },
    animate: {
      scale: [0, 1.2, 1],
      opacity: 1,
      transition: {
        duration: 1,
        ease: "easeOut"
      }
    },
    exit: {
      scale: 0,
      opacity: 0
    }
  }

  const progressVariants = {
    initial: { width: "0%" },
    animate: {
      width: "100%",
      transition: {
        duration: 1.5,
        ease: "easeInOut"
      }
    }
  }

  if (!loading) return null

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      exit="exit"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-dark"
    >
      <motion.div
        variants={iconVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative w-24 h-24"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-purple-500 opacity-20" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-blue-500 opacity-40" />
        </div>
        <motion.div
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 2,
            ease: "linear",
            repeat: Infinity
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-8 h-8 rounded-full border-4 border-white" />
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-white text-lg font-medium"
      >
        Loading
      </motion.div>
      <motion.div className="w-48 h-1 bg-gray-800 mt-4 rounded-full overflow-hidden">
        <motion.div
          variants={progressVariants}
          initial="initial"
          animate="animate"
          className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
        />
      </motion.div>
    </motion.div>
  )
}