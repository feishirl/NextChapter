import { useEffect, useState } from 'react'

const PHONE_W = 390, PHONE_H = 844, BEZEL = 13, MARGIN = 20

// On laptops the phone mockup shrinks to fit the window height, so the whole
// screen is always visible. On real phones (< 820px wide) CSS makes it full-screen.
function useFitScale() {
  const fit = () => Math.min(1, (window.innerHeight - 2 * (BEZEL + MARGIN)) / PHONE_H)
  const [scale, setScale] = useState(fit)
  useEffect(() => {
    const onResize = () => setScale(fit())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return scale
}

export default function PhoneFrame({ children }) {
  const s = useFitScale()
  const now = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).replace(/\s?[AP]M/, '')
  return (
    <div className="phone-wrap" style={{ width: PHONE_W * s, height: PHONE_H * s }}>
      <div className="phone" style={{ transform: `scale(${s})` }}>
        <div className="notch" />
        <div className="statusbar"><span>{now}</span><span>●●● ≈ ▮</span></div>
        <div className="app-inner">{children}</div>
      </div>
    </div>
  )
}
