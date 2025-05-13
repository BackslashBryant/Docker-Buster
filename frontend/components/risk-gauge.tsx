"use client"

import { useEffect, useState } from "react"

interface RiskGaugeProps {
  score: number
}

export function RiskGauge({ score }: RiskGaugeProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Calculate color based on score
  const getColor = (score: number) => {
    if (score < 40) return "#22c55e" // green
    if (score < 70) return "#f59e0b" // amber
    return "#ef4444" // red
  }

  const color = getColor(score)
  const rotation = (score / 100) * 180 // Convert score to degrees (half circle)

  return (
    <div className="p-6">
      <div className="relative w-full h-40 flex flex-col items-center justify-center">
        <svg width="160" height="90" viewBox="0 0 160 90">
          {/* Background arc */}
          <path d="M 10 80 A 70 70 0 0 1 150 80" stroke="#374151" strokeWidth="10" fill="none" />

          {/* Foreground arc (score) */}
          <path
            d="M 10 80 A 70 70 0 0 1 150 80"
            stroke={color}
            strokeWidth="10"
            strokeDasharray="220"
            strokeDashoffset={220 - (220 * score) / 100}
            fill="none"
          />

          {/* Needle */}
          <g transform={`rotate(${rotation} 80 80)`}>
            <line x1="80" y1="80" x2="80" y2="30" stroke={color} strokeWidth="2" />
            <circle cx="80" cy="80" r="5" fill={color} />
          </g>
        </svg>

        <div className="absolute bottom-0 text-center">
          <div className="text-4xl font-bold text-white leading-tight mb-2">{score}</div>
          <div className="text-sm text-gray-400">RISK SCORE</div>
        </div>
      </div>
    </div>
  )
}
