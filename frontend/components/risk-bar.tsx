"use client"

interface RiskBarProps {
  score: number
}

export function RiskBar({ score }: RiskBarProps) {
  // Calculate position based on score (0-100)
  const position = `${score}%`

  // Determine color based on score
  const getScoreColor = (score: number) => {
    if (score < 33) return "text-green-500"
    if (score < 66) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-gray-400">Low</span>
        <span className="text-sm font-medium text-gray-400">Medium</span>
        <span className="text-sm font-medium text-gray-400">High</span>
        <span className="text-sm font-medium text-gray-400">Critical</span>
      </div>

      <div className="relative h-4 rounded-full overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 to-red-500"></div>

        {/* Marker */}
        <div
          className="absolute top-0 h-full w-1 bg-white shadow-md transform -translate-x-1/2 transition-all duration-500 ease-in-out"
          style={{ left: position }}
        ></div>
      </div>

      {/* Segment markers */}
      <div className="relative h-1 mt-1">
        <div className="absolute left-0 w-[33%] border-r border-gray-500 h-2"></div>
        <div className="absolute left-[33%] w-[33%] border-r border-gray-500 h-2"></div>
        <div className="absolute left-[66%] w-[34%] h-2"></div>
      </div>
    </div>
  )
}
