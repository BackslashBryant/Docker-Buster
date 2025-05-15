"use client"

import { useState, FormEvent } from "react"
import { Logo } from "./logo"
import { Zap } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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
  setReport: (report: any) => void
}

type LeftPanelProps = {
  dockerScan: DockerScanProps
}

export function LeftPanel({ dockerScan }: LeftPanelProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [inputType, setInputType] = useState("image")
  const [containerImage, setContainerImage] = useState("")
  const [registryLink, setRegistryLink] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)

  const handleScan = async (e: FormEvent) => {
    e.preventDefault()
    if (inputType === "image" && containerImage.trim()) {
      await dockerScan.scanImage(containerImage.trim())
    } else if (inputType === "registry" && registryLink.trim()) {
      await dockerScan.scanImage(registryLink.trim())
    } else if (inputType === "file" && file) {
      setFileError(null)
      try {
        const formData = new FormData()
        formData.append("file", file)
        const apiBase = process.env.NEXT_PUBLIC_API_URL || ''
        const res = await fetch(`${apiBase}/sbom/upload`, {
          method: "POST",
          body: formData,
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          setFileError(err.detail || "Failed to generate SBOM from tarball.")
          return
        }
        const sbom = await res.json()
        dockerScan.setReport(sbom)
        if (dockerScan.status !== 'complete') {
          // If there's a way to set status, do it here; otherwise, the report UI will update on setReport
        }
      } catch (err: any) {
        setFileError(err?.message || "Failed to upload and scan tarball.")
      }
      return
    } else {
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
          <Tabs value={inputType} onValueChange={setInputType} className="w-full">
            <TabsList className="w-full grid grid-cols-3 mb-4">
              <TabsTrigger value="image">Image Name</TabsTrigger>
              <TabsTrigger value="registry">Registry Link</TabsTrigger>
              <TabsTrigger value="file">Upload .tar</TabsTrigger>
            </TabsList>
            <TabsContent value="image">
              <label htmlFor="container-image" className="block text-sm uppercase tracking-wide font-medium text-gray-400 mb-1">
                Docker Image Name
              </label>
              <Input
                type="text"
                id="container-image"
                value={containerImage}
                onChange={e => setContainerImage(e.target.value)}
                placeholder="nginx:1.19"
                disabled={dockerScan.status === "scanning"}
                autoComplete="off"
              />
            </TabsContent>
            <TabsContent value="registry">
              <label htmlFor="registry-link" className="block text-sm uppercase tracking-wide font-medium text-gray-400 mb-1">
                Registry Link
              </label>
              <Input
                type="text"
                id="registry-link"
                value={registryLink}
                onChange={e => setRegistryLink(e.target.value)}
                placeholder="docker.io/library/alpine:latest"
                disabled={dockerScan.status === "scanning"}
                autoComplete="off"
              />
            </TabsContent>
            <TabsContent value="file">
              <label htmlFor="image-tar" className="block text-sm uppercase tracking-wide font-medium text-gray-400 mb-1">
                Docker Image Tarball (.tar)
              </label>
              <Input
                type="file"
                id="image-tar"
                accept=".tar"
                onChange={e => {
                  setFileError(null)
                  if (e.target.files && e.target.files[0]) {
                    setFile(e.target.files[0])
                  } else {
                    setFile(null)
                  }
                }}
                disabled={dockerScan.status === "scanning"}
              />
              {file && <div className="text-xs text-gray-400 mt-1">Selected: {file.name}</div>}
              {fileError && <div className="text-xs text-red-400 mt-1">{fileError}</div>}
            </TabsContent>
          </Tabs>
          <Button
            type="submit"
            className="w-full flex items-center justify-center"
            disabled={dockerScan.status === "scanning"}
          >
            <Zap className="mr-2 h-5 w-5" />
            {inputType === "image" && containerImage.trim() ? "Bust Container" :
              inputType === "registry" && registryLink.trim() ? "Bust Registry" :
              inputType === "file" && file ? "Bust Tarball" : "Run Demo Scan"}
          </Button>
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
