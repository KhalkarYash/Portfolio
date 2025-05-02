'use client'

// Initialize queue for events before analytics is loaded
let eventQueue = []
let isAnalyticsLoaded = false

// Analytics configuration
const config = {
  sampleRate: 0.1, // Sample 10% of performance data
  minimumTimeBetweenEvents: 1000, // Minimum time between similar events in ms
}

// Store last event timestamps to prevent spam
const lastEventTimestamps = new Map()

// Initialize analytics
export const initAnalytics = () => {
  if (typeof window === 'undefined') return

  // Here you would initialize your analytics service
  // Example: Google Analytics, Plausible, etc.
  isAnalyticsLoaded = true

  // Process any queued events
  while (eventQueue.length > 0) {
    const { name, data } = eventQueue.shift()
    trackEvent(name, data)
  }
}

// Track events with spam protection and sampling
export const trackEvent = (name, data = {}) => {
  // Don't track events during development
  if (process.env.NODE_ENV === 'development') return

  // Check if we should sample this event
  if (data.performance && Math.random() > config.sampleRate) return

  // Prevent event spam
  const now = Date.now()
  const lastTimestamp = lastEventTimestamps.get(name) || 0
  if (now - lastTimestamp < config.minimumTimeBetweenEvents) return
  lastEventTimestamps.set(name, now)

  // Add common data
  const eventData = {
    ...data,
    timestamp: new Date().toISOString(),
    url: window.location.pathname,
    userAgent: window.navigator.userAgent,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }

  // If analytics isn't loaded yet, queue the event
  if (!isAnalyticsLoaded) {
    eventQueue.push({ name, data: eventData })
    return
  }

  // Send to analytics service
  try {
    // Here you would send to your analytics service
    console.log(`[Analytics] ${name}:`, eventData)
  } catch (error) {
    console.error('[Analytics Error]:', error)
  }
}

// Track performance metrics
export const trackPerformance = (metric) => {
  trackEvent('performance_metric', {
    performance: true,
    name: metric.name,
    value: metric.value,
    rating: getRating(metric),
  })
}

// Get performance rating
const getRating = (metric) => {
  switch (metric.name) {
    case 'FCP':
      return metric.value < 1800 ? 'good' : metric.value < 3000 ? 'needs-improvement' : 'poor'
    case 'LCP':
      return metric.value < 2500 ? 'good' : metric.value < 4000 ? 'needs-improvement' : 'poor'
    case 'FID':
      return metric.value < 100 ? 'good' : metric.value < 300 ? 'needs-improvement' : 'poor'
    case 'CLS':
      return metric.value < 0.1 ? 'good' : metric.value < 0.25 ? 'needs-improvement' : 'poor'
    default:
      return 'unknown'
  }
}

// Track accessibility interactions
export const trackA11y = (action, element) => {
  trackEvent('accessibility_interaction', {
    action,
    element,
    timestamp: new Date().toISOString(),
  })
}

// Export common event types
export const EventTypes = {
  NAVIGATION: 'navigation',
  INTERACTION: 'interaction',
  PERFORMANCE: 'performance',
  ACCESSIBILITY: 'accessibility',
  ERROR: 'error',
}