interface ConfettiBurstProps {
  trigger: number
}

export function ConfettiBurst({ trigger }: ConfettiBurstProps) {
  if (trigger === 0) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {Array.from({ length: 36 }).map((_, index) => {
        const left = (index % 12) * 8 + Math.random() * 4
        const delay = (index % 10) * 0.03
        const duration = 1 + (index % 6) * 0.1
        const color = ['#7C5DFA', '#33D69F', '#FF8F00', '#EC5757'][index % 4]

        return (
          <span
            key={`${trigger}-${index}`}
            className="absolute top-0 h-2 w-2 animate-[confetti_1.4s_ease-out_forwards] rounded-sm"
            style={{
              left: `${left}%`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              backgroundColor: color,
              transform: `translateY(-20px) rotate(${Math.random() * 180}deg)`,
            }}
          />
        )
      })}
    </div>
  )
}
