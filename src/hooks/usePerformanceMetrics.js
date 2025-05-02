'use client'
import { useEffect } from 'react'

export function usePerformanceMetrics() {
  useEffect(() => {
    if (typeof window === 'undefined' || !window.performance || !window.performance.mark) {
      return
    }

    // Mark the start of performance measurement
    performance.mark('app-start')

    // Report Web Vitals
    const reportWebVitals = ({ name, delta, id }) => {
      // You can send these metrics to your analytics service
      console.log(`${name}: ${Math.round(delta)}ms (ID: ${id})`)
    }

    // Observe CLS
    let clsValue = 0
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      }
    }).observe({ type: 'layout-shift', buffered: true })

    // Observe LCP
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        reportWebVitals({
          name: 'LCP',
          delta: entry.startTime,
          id: entry.id
        })
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true })

    // Observe FID
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        reportWebVitals({
          name: 'FID',
          delta: entry.processingStart - entry.startTime,
          id: entry.id
        })
      }
    }).observe({ type: 'first-input', buffered: true })

    return () => {
      performance.mark('app-end')
      performance.measure('app-performance', 'app-start', 'app-end')
    }
  }, [])
}