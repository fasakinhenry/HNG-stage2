import { useEffect, useRef } from 'react'
import ReactCanvasConfetti from 'react-canvas-confetti'

interface ConfettiBurstProps {
  trigger: number
}

const ConfettiCanvas =
  (ReactCanvasConfetti as unknown as { default?: typeof ReactCanvasConfetti }).default ?? ReactCanvasConfetti

export function ConfettiBurst({ trigger }: ConfettiBurstProps) {
  const confettiRef = useRef<((options: Record<string, unknown>) => void) | null>(null)

  const makeShot = (particleRatio: number, options: Record<string, unknown>) => {
    if (!confettiRef.current) return

    confettiRef.current({
      ...options,
      origin: { y: 0.62 },
      particleCount: Math.floor(220 * particleRatio),
    })
  }

  useEffect(() => {
    if (trigger === 0) return

    makeShot(0.25, {
      spread: 26,
      startVelocity: 55,
    })
    makeShot(0.2, {
      spread: 60,
    })
    makeShot(0.35, {
      spread: 100,
      decay: 0.92,
      scalar: 0.95,
    })
    makeShot(0.2, {
      spread: 120,
      startVelocity: 24,
      decay: 0.94,
      scalar: 1.2,
    })
  }, [trigger])

  return (
    <div className="pointer-events-none fixed inset-0 z-60" aria-hidden="true">
      <ConfettiCanvas
        onInit={({ confetti }) => {
          confettiRef.current = confetti
        }}
        style={{ position: 'fixed', pointerEvents: 'none', width: '100%', height: '100%' }}
      />
    </div>
  )
}
