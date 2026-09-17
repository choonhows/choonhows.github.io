import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'lenis/dist/lenis.css'
import App from './App'
import './styles.css'

const loaderStartedAt = performance.now()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

let revealScheduled = false

const revealSite = () => {
  if (revealScheduled) return
  revealScheduled = true

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const minimumDuration = prefersReducedMotion ? 0 : 700
  const remainingDuration = Math.max(0, minimumDuration - (performance.now() - loaderStartedAt))

  window.setTimeout(() => {
    requestAnimationFrame(() => {
      document.documentElement.classList.add('site-ready')
      document.getElementById('site-loader')?.setAttribute('aria-hidden', 'true')

      window.setTimeout(() => document.getElementById('site-loader')?.remove(), prefersReducedMotion ? 0 : 450)
    })
  }, remainingDuration)
}

const fallbackTimer = window.setTimeout(revealSite, 2500)

const revealAfterLoad = () => {
  window.clearTimeout(fallbackTimer)
  revealSite()
}

if (document.readyState === 'complete') revealAfterLoad()
else window.addEventListener('load', revealAfterLoad, { once: true })
