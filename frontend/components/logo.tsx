"use client"

import { useEffect, useState } from "react"

export function Logo() {
  const [randomDelay, setRandomDelay] = useState(0)

  useEffect(() => {
    // Generate a random delay between 4000 and 12000ms
    setRandomDelay(Math.floor(Math.random() * 8000) + 4000)
  }, [])

  return (
    <div className="relative transition-transform hover:scale-105 group">
      <div
        className="absolute inset-0 rounded-full soft-pulse opacity-40 bg-[#3B82F6] blur-xl group-hover:opacity-60 transition-opacity duration-700"
        style={{
          animationDelay: `${randomDelay}ms`,
        }}
      ></div>
      <img
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-kLPanL9l7bxDPLUeTvmuL2VfCzttGy.png"
        alt="Docker Buster Logo"
        className="relative w-32 h-32 drop-shadow-lg"
      />
    </div>
  )
}
