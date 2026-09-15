import { useState, useEffect } from 'react'

/**
 * SAMADHANSETU INTRO ANIMATION CONFIGURATION
 * 
 * - ONCE_PER_SESSION: true (default) -> Plays once per browser session via sessionStorage.
 * - ONCE_PER_SESSION: false -> Plays on every page load.
 * - STORAGE_KEY: Key used in sessionStorage to track intro playback.
 */
export const INTRO_CONFIG = {
  ONCE_PER_SESSION: true,
  STORAGE_KEY: 'samadhansetu_intro_seen'
}

export default function IntroAnimation({ forcePlay = false, onComplete }) {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false

    // Check reduced motion preference - skip animation immediately
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return false

    // Respect replay configuration
    if (forcePlay || !INTRO_CONFIG.ONCE_PER_SESSION) return true

    const alreadySeen = sessionStorage.getItem(INTRO_CONFIG.STORAGE_KEY)
    return !alreadySeen
  })

  useEffect(() => {
    if (!visible) return

    // Mark as seen in sessionStorage for session-based replay
    try {
      sessionStorage.setItem(INTRO_CONFIG.STORAGE_KEY, 'true')
    } catch {
      // Ignore quota/access errors
    }

    // Unmount overlay after total duration (2000ms)
    const timer = setTimeout(() => {
      setVisible(false)
      if (onComplete) onComplete()
    }, 2000)

    return () => clearTimeout(timer)
  }, [visible, onComplete])

  if (!visible) return null

  return (
    <div
      aria-label="SamadhanSetu Intro Animation"
      role="region"
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#FAFAF8] select-none pointer-events-none"
      style={{
        animation: 'ss-intro-container-fade 2.0s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}
    >
      <style>{`
        @keyframes ss-intro-container-fade {
          0% { opacity: 1; transform: translateY(0); }
          77.5% { opacity: 1; transform: translateY(0); } /* 1.55s */
          100% { opacity: 0; transform: translateY(-10px); } /* 2.00s */
        }

        @keyframes ss-intro-logo-settle {
          0% { transform: scale(0.985); }
          60% { transform: scale(1.005); }
          77.5% { transform: scale(1); }
          100% { transform: scale(1); }
        }

        /* Phase 1a: Teal/blue wave portion reveals left-to-right (0.00s -> 0.35s) */
        @keyframes ss-intro-wave-reveal {
          0% { clip-path: inset(0 100% 0 0); opacity: 0; }
          15% { opacity: 1; }
          100% { clip-path: inset(0 0% 0 0); opacity: 1; }
        }

        /* Phase 1b: Bridge structure fades + scales up subtly (0.15s -> 0.42s) */
        @keyframes ss-intro-bridge-reveal {
          0% { opacity: 0; transform: translateY(8px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Phase 1c: People markers scale-in sequentially without bounce */
        @keyframes ss-intro-dot-reveal {
          0% { opacity: 0; transform: scale(0); }
          100% { opacity: 1; transform: scale(1); }
        }

        /* Phase 2: Wordmark smooth horizontal clip reveal (0.35s -> 0.92s) */
        @keyframes ss-intro-wordmark-reveal {
          0% { clip-path: inset(0 100% 0 0); opacity: 0; }
          15% { opacity: 1; }
          100% { clip-path: inset(0 0% 0 0); opacity: 1; }
        }

        /* Phase 3: Tagline fade + subtle 8px upward movement (0.75s -> 1.20s) */
        @keyframes ss-intro-tagline-reveal {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Centered logo container with responsive widths */}
      <div
        className="w-[260px] sm:w-[340px] md:w-[420px] max-w-[90vw] h-auto flex items-center justify-center p-2"
        style={{
          animation: 'ss-intro-logo-settle 2.0s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
      >
        <svg
          viewBox="0 0 837 435"
          className="w-full h-auto block overflow-visible"
        >
          <defs>
            {/* Wave clip region (bottom of symbol) */}
            <clipPath id="intro-clip-wave">
              <rect x="0" y="218" width="260" height="150" />
            </clipPath>

            {/* Bridge clip region (middle of symbol) */}
            <clipPath id="intro-clip-bridge">
              <rect x="0" y="168" width="260" height="52" />
            </clipPath>

            {/* Left Dot clip region */}
            <clipPath id="intro-clip-dot-left">
              <rect x="55" y="145" width="50" height="37" />
            </clipPath>

            {/* Center Dot clip region */}
            <clipPath id="intro-clip-dot-center">
              <rect x="115" y="120" width="60" height="28" />
            </clipPath>

            {/* Right Dot clip region */}
            <clipPath id="intro-clip-dot-right">
              <rect x="185" y="145" width="50" height="37" />
            </clipPath>

            {/* Wordmark clip region */}
            <clipPath id="intro-clip-wordmark">
              <rect x="255" y="170" width="582" height="85" />
            </clipPath>

            {/* Tagline clip region */}
            <clipPath id="intro-clip-tagline">
              <rect x="255" y="255" width="582" height="55" />
            </clipPath>
          </defs>

          {/* Phase 1a: Flowing Teal/Blue Wave */}
          <g
            style={{
              animation: 'ss-intro-wave-reveal 0.35s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both'
            }}
          >
            <image
              href="/assests/logo.png"
              width="837"
              height="435"
              clipPath="url(#intro-clip-wave)"
            />
          </g>

          {/* Phase 1b: Bridge Structure */}
          <g
            style={{
              animation: 'ss-intro-bridge-reveal 0.28s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both',
              transformOrigin: '144px 195px'
            }}
          >
            <image
              href="/assests/logo.png"
              width="837"
              height="435"
              clipPath="url(#intro-clip-bridge)"
            />
          </g>

          {/* Phase 1c: Left Person Marker */}
          <g
            style={{
              animation: 'ss-intro-dot-reveal 0.14s cubic-bezier(0.16, 1, 0.3, 1) 0.24s both',
              transformOrigin: '79.5px 166px'
            }}
          >
            <image
              href="/assests/logo.png"
              width="837"
              height="435"
              clipPath="url(#intro-clip-dot-left)"
            />
          </g>

          {/* Phase 1c: Center Person Marker */}
          <g
            style={{
              animation: 'ss-intro-dot-reveal 0.14s cubic-bezier(0.16, 1, 0.3, 1) 0.30s both',
              transformOrigin: '144.5px 134px'
            }}
          >
            <image
              href="/assests/logo.png"
              width="837"
              height="435"
              clipPath="url(#intro-clip-dot-center)"
            />
          </g>

          {/* Phase 1c: Right Person Marker */}
          <g
            style={{
              animation: 'ss-intro-dot-reveal 0.14s cubic-bezier(0.16, 1, 0.3, 1) 0.36s both',
              transformOrigin: '210px 166px'
            }}
          >
            <image
              href="/assests/logo.png"
              width="837"
              height="435"
              clipPath="url(#intro-clip-dot-right)"
            />
          </g>

          {/* Phase 2: "SamadhanSetu" Wordmark */}
          <g
            style={{
              animation: 'ss-intro-wordmark-reveal 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.36s both'
            }}
          >
            <image
              href="/assests/logo.png"
              width="837"
              height="435"
              clipPath="url(#intro-clip-wordmark)"
            />
          </g>

          {/* Phase 3: "Bridging Problems. Building Solutions." Tagline */}
          <g
            style={{
              animation: 'ss-intro-tagline-reveal 0.45s cubic-bezier(0.16, 1, 0.3, 1) 0.75s both'
            }}
          >
            <image
              href="/assests/logo.png"
              width="837"
              height="435"
              clipPath="url(#intro-clip-tagline)"
            />
          </g>
        </svg>
      </div>
    </div>
  )
}
