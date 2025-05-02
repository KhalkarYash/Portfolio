'use client'
import { useEffect } from 'react'

export default function ImagePreloader() {
  useEffect(() => {
    const images = [
      '/devLinkUp.jpg',
      '/bingeBrain.jpg',
      '/collegeMarkTracker.jpg',
      '/yash.jpg',
      '/icons/icon-72x72.png',
      '/icons/icon-96x96.png',
      '/icons/icon-128x128.png',
      '/icons/icon-144x144.png',
      '/icons/icon-152x152.png',
      '/icons/icon-192x192.png',
      '/icons/icon-384x384.png',
      '/icons/icon-512x512.png'
    ]

    const preloadImages = () => {
      const imagePromises = images.map(src => {
        return new Promise((resolve, reject) => {
          const img = new Image()
          img.src = src
          img.onload = resolve
          img.onerror = reject
        })
      })

      return Promise.all(imagePromises)
    }

    const preloadWithPriority = async () => {
      try {
        // First load critical images
        await Promise.all([
          new Promise((resolve) => {
            const img = new Image()
            img.src = '/yash.jpg'
            img.onload = resolve
          })
        ])

        // Then load the rest in the background
        preloadImages().catch(console.error)
      } catch (error) {
        console.error('Error preloading images:', error)
      }
    }

    if (document.readyState === 'complete') {
      preloadWithPriority()
    } else {
      window.addEventListener('load', preloadWithPriority)
      return () => window.removeEventListener('load', preloadWithPriority)
    }
  }, [])

  return null
}