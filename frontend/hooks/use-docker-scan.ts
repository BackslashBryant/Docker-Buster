"use client"

import { useState } from 'react'

type ReportResult = {
  report_id: string
  risk_score: number
  cve_count: number
  license_violations: number
  manifest_sha256: string
  signature: string
}

type ScanStatus = "idle" | "scanning" | "complete" | "error"
type DownloadStatus = {
  pdf: boolean;
  json: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

export function useDockerScan() {
  const [status, setStatus] = useState<ScanStatus>("idle")
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [report, setReport] = useState<ReportResult | null>(null)
  const [isPolling, setIsPolling] = useState(false)
  const [downloadStatus, setDownloadStatus] = useState<DownloadStatus>({ pdf: false, json: false })

  // Function to check report status
  const checkReportStatus = async (reportId: string) => {
    try {
      const response = await fetch(`${API_URL}/report/${reportId}/status`)
      if (!response.ok) {
        throw new Error(`Error checking report status: ${response.status}`)
      }
      const data = await response.json()
      return data
    } catch (err) {
      console.error('Error checking report status:', err)
      return { status: 'error' }
    }
  }

  // Start polling for report status
  const pollReportStatus = async (reportId: string) => {
    setIsPolling(true)
    
    const checkStatus = async () => {
      if (!isPolling) return
      
      const statusData = await checkReportStatus(reportId)
      
      if (statusData.status === 'processing') {
        setProgress(statusData.progress || Math.min(progress + 5, 95))
        setTimeout(checkStatus, 1000)
      } else if (statusData.status === 'complete') {
        setProgress(100)
        setStatus('complete')
        setIsPolling(false)
      } else if (statusData.status === 'error') {
        setStatus('error')
        setError(statusData.error || 'Unknown error occurred')
        setIsPolling(false)
      }
    }
    
    checkStatus()
  }

  // Function to start scanning a Docker image
  const scanImage = async (imageName: string) => {
    setStatus('scanning')
    setProgress(0)
    setError(null)
    setReport(null)
    setDownloadStatus({ pdf: false, json: false })
    
    try {
      const response = await fetch(`${API_URL}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: imageName })
      })
      
      if (!response.ok) {
        throw new Error(`Error scanning image: ${response.statusText}`)
      }
      
      const result = await response.json()
      setReport(result)
      
      // Start polling for status updates
      if (result.report_id) {
        pollReportStatus(result.report_id)
      } else {
        setStatus('complete')
        setProgress(100)
      }
      
      return result
    } catch (err) {
      console.error('Error scanning Docker image:', err)
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      return null
    }
  }

  // Function to download report PDF
  const downloadPdf = async (reportId: string) => {
    try {
      setDownloadStatus(prev => ({ ...prev, pdf: true }))
      
      // Check if file is available before opening in new tab
      const checkResponse = await fetch(`${API_URL}/report/${reportId}/status`)
      if (!checkResponse.ok) {
        throw new Error(`Error checking report status: ${checkResponse.status}`)
      }
      
      const statusData = await checkResponse.json()
      if (!statusData.files?.pdf) {
        throw new Error("PDF report is not yet available")
      }
      
      window.open(`${API_URL}/download/report/${reportId}`, '_blank')
      setDownloadStatus(prev => ({ ...prev, pdf: false }))
      return true
    } catch (err) {
      console.error('Error downloading PDF:', err)
      setDownloadStatus(prev => ({ ...prev, pdf: false }))
      setError(err instanceof Error ? err.message : 'Error downloading PDF')
      return false
    }
  }

  // Function to download report JSON
  const downloadJson = async (reportId: string) => {
    try {
      setDownloadStatus(prev => ({ ...prev, json: true }))
      
      // Check if file is available before opening in new tab
      const checkResponse = await fetch(`${API_URL}/report/${reportId}/status`)
      if (!checkResponse.ok) {
        throw new Error(`Error checking report status: ${checkResponse.status}`)
      }
      
      const statusData = await checkResponse.json()
      if (!statusData.files?.json) {
        throw new Error("JSON report is not yet available")
      }
      
      window.open(`${API_URL}/download/json/${reportId}`, '_blank')
      setDownloadStatus(prev => ({ ...prev, json: false }))
      return true
    } catch (err) {
      console.error('Error downloading JSON:', err)
      setDownloadStatus(prev => ({ ...prev, json: false }))
      setError(err instanceof Error ? err.message : 'Error downloading JSON')
      return false
    }
  }

  // Function to reset the state
  const reset = () => {
    setStatus('idle')
    setProgress(0)
    setError(null)
    setReport(null)
    setIsPolling(false)
    setDownloadStatus({ pdf: false, json: false })
  }

  // Function to simulate a scan (for development/testing)
  const simulateScan = () => {
    setStatus('scanning')
    setProgress(0)
    setError(null)
    setReport(null)
    setDownloadStatus({ pdf: false, json: false })
    
    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += 10
      setProgress(currentProgress)
      
      if (currentProgress >= 100) {
        clearInterval(interval)
        setStatus('complete')
        setReport({
          report_id: 'mock-report-id',
          risk_score: 7.8,
          cve_count: 12,
          license_violations: 2,
          manifest_sha256: '8bd7a36a2b196d88d2c8b7282aa6e217f3d2a8b86d4285ff98c1f0be0b60e9a4',
          signature: 'MEUCIQDKZokqnCB0+PiVxr+3FWsJTJJuI/ZCCwgkIZ4MUmXA0QIgE2YzA7QpQCOl...'
        })
      }
    }, 500)
  }

  return {
    status,
    progress,
    error,
    report,
    downloadStatus,
    scanImage,
    downloadPdf,
    downloadJson,
    reset,
    simulateScan,
    setReport
  }
} 