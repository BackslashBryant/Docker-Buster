"use client"

import { useState } from "react"
import { LeftPanel } from "@/components/left-panel"
import { RightPanel } from "@/components/right-panel"
import { useDockerScan } from "@/hooks/use-docker-scan"

export default function Home() {
  const dockerScan = useDockerScan()

  return (
    <main className="flex flex-col md:flex-row min-h-screen bg-[#0c0f1a] text-white overflow-hidden container mx-auto">
      <LeftPanel dockerScan={dockerScan} />
      <RightPanel dockerScan={dockerScan} />
    </main>
  )
}
