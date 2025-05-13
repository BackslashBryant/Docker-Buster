"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileJson, FileText, Zap } from "lucide-react"
import { RiskBar } from "./risk-bar"
import { MetricCard } from "./metric-card"
import { VulnerabilityTable } from "./vulnerability-table"

type DockerScanProps = {
  status: string
  progress: number
  error: string | null
  report: any
  downloadStatus: { pdf: boolean; json: boolean }
  scanImage: (imageName: string) => Promise<any>
  downloadPdf: (reportId: string) => Promise<boolean>
  downloadJson: (reportId: string) => Promise<boolean>
  reset: () => void
  simulateScan: () => void
}

type RightPanelProps = {
  dockerScan: DockerScanProps
}

export function RightPanel({ dockerScan }: RightPanelProps) {
  // Determine risk score color based on value
  const getRiskScoreStatus = (score: number) => {
    if (score < 33) return "success"
    if (score < 66) return "warning"
    return "danger"
  }

  const handleDownloadPdf = () => {
    if (dockerScan.report?.report_id) {
      dockerScan.downloadPdf(dockerScan.report.report_id)
    }
  }

  const handleDownloadJson = () => {
    if (dockerScan.report?.report_id) {
      dockerScan.downloadJson(dockerScan.report.report_id)
    }
  }

  return (
    <div className="w-full md:w-[65%] bg-[#2a2a3d] px-4 sm:px-6 md:px-12 py-8 overflow-y-auto min-h-screen">
      {dockerScan.status === "idle" && (
        <div className="h-full flex flex-col items-center justify-center text-center p-6 min-h-[calc(100vh-4rem)]">
          <div className="relative w-24 h-24 mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="96"
              height="96"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-500"
            >
              <path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1Z" />
              <path d="M4 9h16" />
              <path d="M9 9v12" />
              <path d="M15 9v12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No Container Analysis Yet</h2>
          <p className="text-gray-400 max-w-md">
            Enter a container image in the form and click "Bust Container" to start analyzing for security
            vulnerabilities.
          </p>
          <Button
            className="mt-8 bg-[#3B82F6] hover:bg-[#2563EB] hover:shadow-[0_0_10px_rgba(59,130,246,0.4)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#2a2a3d] w-full sm:w-auto transition-all duration-200"
            onClick={dockerScan.simulateScan}
            tabIndex={0}
          >
            <Zap className="mr-2 h-4 w-4 group-hover:animate-spin group-hover:animate-once group-hover:animate-duration-[500ms] group-hover:animate-ease-in-out" />
            Run Demo Scan
          </Button>
        </div>
      )}

      {dockerScan.status === "scanning" && (
        <div className="h-full flex flex-col items-center justify-center p-6 min-h-[calc(100vh-4rem)]">
          <div className="w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4 text-center">Analyzing Container...</h2>
            <Progress value={dockerScan.progress} className="h-2 mb-2" />
            <p className="text-gray-400 text-center text-sm">
              {dockerScan.progress < 30 && "Pulling container layers..."}
              {dockerScan.progress >= 30 && dockerScan.progress < 60 && "Scanning for vulnerabilities..."}
              {dockerScan.progress >= 60 && dockerScan.progress < 90 && "Analyzing dependencies..."}
              {dockerScan.progress >= 90 && "Generating report..."}
            </p>
            <div className="flex justify-center mt-8">
              <Zap className="h-12 w-12 text-[#3B82F6] animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {dockerScan.status === "error" && (
        <div className="h-full flex flex-col items-center justify-center p-6 min-h-[calc(100vh-4rem)]">
          <div className="w-full max-w-md">
            <div className="p-6 bg-red-900/20 border border-red-800 rounded-md text-center">
              <h2 className="text-xl font-bold text-red-400 mb-4">Scan Failed</h2>
              <p className="text-gray-300 mb-6">{dockerScan.error || "An unknown error occurred during the scan."}</p>
              <Button
                className="bg-[#3B82F6] hover:bg-[#2563EB] hover:shadow-[0_0_10px_rgba(59,130,246,0.4)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#2a2a3d] transition-all duration-200"
                onClick={dockerScan.reset}
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      )}

      {dockerScan.status === "complete" && dockerScan.report && (
        <section className="space-y-8">
          <Tabs defaultValue="summary" className="custom-tabs">
            <TabsList className="bg-[#252538] border-b border-gray-700 w-full justify-start rounded-none">
              <TabsTrigger
                value="summary"
                className="px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#2a2a3d] transition-all duration-200"
                tabIndex={0}
              >
                Executive Summary
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className="px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#2a2a3d] transition-all duration-200"
                tabIndex={0}
              >
                Component Details
              </TabsTrigger>
              <TabsTrigger
                value="insights"
                className="px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#2a2a3d] transition-all duration-200"
                tabIndex={0}
              >
                Actionable Insights
              </TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-8 pt-8">
              <div>
                <h2 className="text-xl font-bold mb-4">Security Risk Assessment</h2>
                <RiskBar score={dockerScan.report.risk_score * 10 || 0} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard 
                  title="Risk Score" 
                  value={dockerScan.report.risk_score?.toFixed(1) || "0"} 
                  status={getRiskScoreStatus(dockerScan.report.risk_score * 10 || 0)} 
                />
                <MetricCard 
                  title="Critical CVEs" 
                  value={dockerScan.report.cve_count?.toString() || "0"} 
                  status={dockerScan.report.cve_count > 0 ? "danger" : "success"} 
                />
                <MetricCard 
                  title="License Issues" 
                  value={dockerScan.report.license_violations?.toString() || "0"} 
                  status={dockerScan.report.license_violations > 0 ? "warning" : "success"} 
                />
              </div>

              <Card className="bg-[#252538] border-gray-700">
                <CardHeader className="pb-0">
                  <CardTitle>Report Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-400 mb-2">Image Name</p>
                      <p className="text-sm font-mono text-white break-words">
                        {dockerScan.report.image?.name || "nginx:1.19"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-400 mb-2">Report ID</p>
                      <p className="text-sm font-mono text-white break-all" title={dockerScan.report.report_id}>
                        {dockerScan.report.report_id || "DB-20230615-8F4D2"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-400 mb-2">Scan Time</p>
                      <p className="text-sm font-mono text-white break-words">
                        {dockerScan.report.generated_at ? 
                          new Date(dockerScan.report.generated_at).toLocaleString() : 
                          "May 13, 2025 15:09:09"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-400 mb-2">Scan Duration</p>
                      <p className="text-sm font-mono text-white">
                        {dockerScan.report.scan_duration || "42 seconds"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-4">
                    <Button
                      variant="outline"
                      className="bg-transparent border-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#2a2a3d] w-full sm:w-auto transition-all duration-200"
                      onClick={handleDownloadPdf}
                      disabled={dockerScan.downloadStatus.pdf}
                      tabIndex={0}
                    >
                      {dockerScan.downloadStatus.pdf ? (
                        <>
                          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-2" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <FileText className="mr-2 h-4 w-4" />
                          Download PDF
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-transparent border-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#2a2a3d] w-full sm:w-auto transition-all duration-200"
                      onClick={handleDownloadJson}
                      disabled={dockerScan.downloadStatus.json}
                      tabIndex={0}
                    >
                      {dockerScan.downloadStatus.json ? (
                        <>
                          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-2" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <FileJson className="mr-2 h-4 w-4" />
                          Download JSON
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#252538] border-gray-700">
                <CardHeader className="pb-0">
                  <CardTitle>Image Signature</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="bg-[#1e1e2f] p-4 rounded-md font-mono text-sm overflow-x-auto">
                    <p className="text-sm font-medium text-gray-400 mb-2">SHA-256:</p>
                    <p className="text-green-400 break-all">
                      {dockerScan.report.manifest_sha256 || "8bd7a36a2b196d88d2c8b7282aa6e217f3d2a8b86d4285ff98c1f0be0b60e9a4"}
                    </p>
                    <p className="text-sm font-medium text-gray-400 mt-4 mb-2">Signature:</p>
                    <p className="text-blue-400 break-all">
                      {dockerScan.report.signature?.substring(0, 50) + "..." || "MEUCIQDKZokqnCB0+PiVxr+3FWsJTJJuI/ZCCwgkIZ4MUmXA0QIgE2YzA7QpQCOl..."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="pt-8">
              <VulnerabilityTable 
                vulnerabilities={dockerScan.report.components?.flatMap((c: any) => 
                  (c.vulnerabilities || []).map((v: any) => ({
                    ...v,
                    component: c.name,
                    version: c.version
                  }))
                ) || []}
              />
            </TabsContent>

            <TabsContent value="insights" className="pt-8">
              <Card className="bg-[#252538] border-gray-700">
                <CardHeader className="pb-0">
                  <CardTitle>Actionable Insights</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {dockerScan.report.remediation?.upgrade_recommendations?.map((rec: any, index: number) => (
                    <div key={index} className="p-4 bg-red-900/20 border border-red-800 rounded-md">
                      <h3 className="font-bold text-red-400">Critical: {rec.component} Vulnerability</h3>
                      <p className="text-gray-300 mt-2">
                        Update {rec.component} from version {rec.current_version} to {rec.recommended_version}.
                      </p>
                      <div className="mt-3">
                        <Button
                          size="sm"
                          variant="destructive"
                          className="bg-red-800 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#2a2a3d] transition-all duration-200"
                          tabIndex={0}
                        >
                          Apply Fix
                        </Button>
                      </div>
                    </div>
                  )) || (
                    <div className="p-4 bg-red-900/20 border border-red-800 rounded-md">
                      <h3 className="font-bold text-red-400">Critical: OpenSSL Vulnerability</h3>
                      <p className="text-gray-300 mt-2">
                        CVE-2023-0286 affects the OpenSSL package (version 1.1.1k-1). Update to version 1.1.1t-1 or later.
                      </p>
                      <div className="mt-3">
                        <Button
                          size="sm"
                          variant="destructive"
                          className="bg-red-800 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#2a2a3d] transition-all duration-200"
                          tabIndex={0}
                        >
                          Apply Fix
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-yellow-900/20 border border-yellow-800 rounded-md">
                    <h3 className="font-bold text-yellow-400">Warning: Outdated Base Image</h3>
                    <p className="text-gray-300 mt-2">
                      The base image is 267 days old. Consider updating to the latest version for security improvements.
                    </p>
                    <div className="mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-transparent border-yellow-800 hover:bg-yellow-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#2a2a3d] transition-all duration-200"
                        tabIndex={0}
                      >
                        View Recommendation
                      </Button>
                    </div>
                  </div>

                  {dockerScan.report.remediation?.best_practices?.map((practice: any, index: number) => (
                    <div key={index} className="p-4 bg-blue-900/20 border border-blue-800 rounded-md">
                      <h3 className="font-bold text-blue-400">Info: Best Practice</h3>
                      <p className="text-gray-300 mt-2">{practice}</p>
                      <div className="mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-transparent border-blue-800 hover:bg-blue-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#2a2a3d] transition-all duration-200"
                          tabIndex={0}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  )) || (
                    <div className="p-4 bg-blue-900/20 border border-blue-800 rounded-md">
                      <h3 className="font-bold text-blue-400">Info: Optimize Container Size</h3>
                      <p className="text-gray-300 mt-2">
                        Container size can be reduced by 76MB by removing unnecessary packages and using multi-stage
                        builds.
                      </p>
                      <div className="mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-transparent border-blue-800 hover:bg-blue-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#2a2a3d] transition-all duration-200"
                          tabIndex={0}
                        >
                          View Optimization Guide
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      )}
    </div>
  )
}
