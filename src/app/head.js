'use client'
import { usePathname } from 'next/navigation'

export default function Head() {
  const pathname = usePathname()
  
  const title = "Yash Khalkar - Full Stack Developer & Creative Coder"
  const description = "Portfolio of Yash Khalkar - A passionate Full Stack Developer specializing in React, Next.js, Three.js, and creative web development."
  const url = "https://yashkhalkar.vercel.app"
  
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      
      {/* PWA primary color */}
      <meta name="theme-color" content="#030014" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url + pathname} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${url}/og-image.jpg`} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url + pathname} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={`${url}/og-image.jpg`} />

      {/* Preload fonts */}
      <link
        rel="preload"
        href="/fonts/Inter-var.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />

      {/* Preconnect to required resources */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* PWA manifest and icons */}
      <link rel="manifest" href="/manifest.json" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />

      {/* Schema.org metadata */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Yash Khalkar",
          "url": url,
          "sameAs": [
            "https://github.com/KhalkarYash",
            "https://linkedin.com/in/yashkhalkar"
          ],
          "jobTitle": "Full Stack Developer",
          "description": description
        })}
      </script>
    </>
  )
}