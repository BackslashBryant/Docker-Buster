"use client"

import { useState, FormEvent } from "react"
import { Logo } from "./logo"
import { Zap } from "lucide-react"

type DockerScanProps = {
  status: string
  progress: number
  error: string | null
  report: any
  scanImage: (imageName: string) => Promise<any>
  downloadPdf: (reportId: string) => Promise<boolean>
  downloadJson: (reportId: string) => Promise<boolean>
  reset: () => void
  simulateScan: () => void
}

type LeftPanelProps = {
  dockerScan: DockerScanProps
}

export function LeftPanel({ dockerScan }: LeftPanelProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [containerImage, setContainerImage] = useState("")

  const handleScan = async (e: FormEvent) => {
    e.preventDefault()
    if (containerImage.trim()) {
      await dockerScan.scanImage(containerImage.trim())
    } else {
      // If no image is provided, run a demo scan
      dockerScan.simulateScan()
    }
  }

  return (
    <div className="w-full md:w-[35%] bg-[#1e1e2f] px-4 sm:px-6 md:px-12 py-8 md:py-16 flex flex-col items-center">
      <div className="flex flex-col items-center mb-8 md:mb-16">
        <Logo />
        <h1 className="text-2xl md:text-3xl font-bold mt-6 text-white">DOCKER BUSTER</h1>
        <p className="text-gray-300 mt-2">Container security at lightning speed</p>
      </div>

      <div className="w-full max-w-md">
        <form onSubmit={handleScan} className="space-y-6 md:space-y-8">
          <div className="space-y-3">
            <label htmlFor="container" className="block text-sm uppercase tracking-wide font-medium text-gray-400">
              Container to Analyze
            </label>
            <input
              type="text"
              id="container"
              value={containerImage}
              onChange={(e) => setContainerImage(e.target.value)}
              placeholder="nginx:1.19 or docker.io/library/alpine:latest"
              className="w-full px-4 py-3 bg-[#2a2a3d] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#1e1e2f] text-white transition-all duration-200"
              tabIndex={0}
              disabled={dockerScan.status === "scanning"}
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center px-4 py-3 bg-[#3B82F6] hover:bg-[#2563EB] rounded-md font-medium transition-all duration-200 hover:shadow-[0_0_10px_rgba(59,130,246,0.4)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#1e1e2f] group disabled:opacity-50 disabled:cursor-not-allowed"
            tabIndex={0}
            disabled={dockerScan.status === "scanning"}
          >
            <Zap className="mr-2 h-5 w-5 group-hover:animate-spin group-hover:animate-once group-hover:animate-duration-[500ms] group-hover:animate-ease-in-out" />
            {containerImage.trim() ? "Bust Container" : "Run Demo Scan"}
          </button>
        </form>

        {dockerScan.error && (
          <div className="mt-4 p-4 bg-red-900/20 border border-red-800 rounded-md">
            <p className="text-sm font-medium text-red-400">Error: {dockerScan.error}</p>
          </div>
        )}

        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="mt-6 md:mt-8 text-gray-400 hover:text-white text-sm flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#1e1e2f] rounded-md px-2 py-1"
          tabIndex={0}
        >
          {showAdvanced ? "Hide" : "Show"} advanced options
        </button>

        {showAdvanced && (
          <div className="mt-4 p-4 bg-[#252538] rounded-md border border-gray-700">
            <p className="text-sm font-medium text-gray-400 mb-2">Upcoming features:</p>
            <ul className="text-sm text-gray-400 space-y-2 list-disc pl-5">
              <li>Custom scanning profiles</li>
              <li>Compliance policy enforcement</li>
              <li>Automated remediation</li>
              <li>CI/CD pipeline integration</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
