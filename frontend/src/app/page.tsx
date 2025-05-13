'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { CircularGauge } from "@/components/ui/gauge";
import { SeverityChart, getDefaultSeverityData } from "@/components/ui/severity-chart";
import { LicenseIndicator } from "@/components/ui/license-indicator";
import { MetricCard } from "@/components/ui/metric-card";
import { ExpandablePanel } from "@/components/ui/expandable-panel";
import { getSeverityColor } from "@/lib/utils";

interface ScanResult {
  report_id: string;
  risk_score: number;
  cve_count: number;
  license_violations: number;
  manifest_sha256: string;
  signature: string;
}

export default function Home() {
  const [image, setImage] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [scanStep, setScanStep] = useState(0);
  const [activeTab, setActiveTab] = useState('summary');

  const scanSteps = [
    "Pulling image data...",
    "Generating SBOM...",
    "Scanning for vulnerabilities...",
    "Checking licenses...",
    "Calculating risk score...",
    "Building your report..."
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Busting your container… Hang tight.");
    setLoading(true);
    setResult(null);
    setScanStep(0);

    // Simulate scanning steps with timeouts
    const stepInterval = setInterval(() => {
      setScanStep(prev => {
        if (prev >= scanSteps.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);

    try {
      const res = await fetch("http://localhost:8000/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });
      
      if (!res.ok) {
        clearInterval(stepInterval);
        throw new Error("Scan failed");
      }
      
      const data = await res.json();
      setResult(data);
      setStatus("Report's ready! Here's your security assessment:");
      clearInterval(stepInterval);
    } catch {
      clearInterval(stepInterval);
      setStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const SecurityMetric = ({ value, label, icon }: { value: number, label: string, icon: string }) => (
    <div className="db-card p-3 flex flex-col items-center">
      <div className="text-lg font-bold text-db-text-light">{value}</div>
      <div className="text-xs text-db-text-medium flex items-center gap-1">
        <span>{icon}</span> {label}
      </div>
    </div>
  );

  // Add mock data for demonstration
  const mockComponents = [
    {
      name: "openssl",
      version: "1.1.1k",
      severity: "Critical",
      origin: "Alpine base image",
      maintainer: "OpenSSL Project",
      impact: "Remote code execution",
      vector: "Network",
      description: "A critical vulnerability allowing remote code execution via crafted packets.",
    },
    {
      name: "log4j",
      version: "2.14.1",
      severity: "Critical",
      origin: "App dependency",
      maintainer: "Apache Foundation",
      impact: "Remote injection (Log4Shell)",
      vector: "Input data",
      description: "Log4Shell allows attackers to inject code via log messages.",
    },
    {
      name: "libxml2",
      version: "2.9.10",
      severity: "Medium",
      origin: "Alpine base image",
      maintainer: "GNOME Project",
      impact: "Denial of service",
      vector: "Malformed XML",
      description: "Malformed XML can cause resource exhaustion.",
    },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header with Logo */}
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-3 flex-shrink-0">
              <Image 
                src="/images/logo.png" 
                alt="Docker Buster Logo" 
                width={110} 
                height={110} 
                className="drop-shadow-glow"
                priority
              />
            </div>
            <div className="hidden sm:block ml-2">
              <h1 className="text-2xl font-bold text-db-text-light db-text-glow tracking-wide">CONTAINER SECURITY</h1>
              <p className="text-sm text-db-text-medium">Advanced vulnerability scanning & reporting</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            {/* Input Section */}
            <div className="db-card shield-card p-5 mb-6">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <label htmlFor="image" className="text-db-text-light font-medium mb-1">Analyze Container Image</label>
                <Input
                  id="image"
                  placeholder="docker.io/library/alpine:latest"
                  value={image}
                  autoFocus
                  onChange={e => setImage(e.target.value)}
                  disabled={loading}
                  className="text-base bg-gray-800 border-gray-700 text-db-text-light"
                  required
                />
                <div className="text-xs text-db-text-medium mt-1">
                  <p className="mb-1">Enter any of the following:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Image name (e.g., <span className="font-mono bg-gray-800 px-1 rounded">nginx:1.19</span>)</li>
                    <li>Full image URL (e.g., <span className="font-mono bg-gray-800 px-1 rounded">docker.io/library/alpine:latest</span>)</li>
                    <li>Git repository (e.g., <span className="font-mono bg-gray-800 px-1 rounded">github.com/user/repo</span>)</li>
                  </ul>
                </div>
                <button 
                  type="submit" 
                  disabled={loading || !image} 
                  className="db-button mt-2 text-sm font-bold flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="animate-spin mr-2">🔍</span>
                  ) : (
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 10V3L4 14H11V21L20 10H13Z" fill="var(--db-lightning-red)" stroke="var(--db-lightning-red)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Scan Now
                    </span>
                  )}
                  {loading && scanSteps[scanStep]}
                </button>
              </form>
            </div>

            {/* Scan Status Section */}
            {loading && (
              <div className="db-card p-5 mb-6 animate-scan">
                <h3 className="text-db-text-light font-medium mb-3">Scan in Progress</h3>
                <div className="w-full space-y-3">
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="bg-db-docker-blue h-full transition-all duration-500 ease-out"
                      style={{ width: `${((scanStep + 1) / scanSteps.length) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-db-text-medium">Step {scanStep + 1}/{scanSteps.length}</span>
                    <span className="text-db-text-light">{Math.round(((scanStep + 1) / scanSteps.length) * 100)}%</span>
                  </div>
                  <p className="text-sm text-db-text-light font-medium">
                    <span className="text-db-docker-blue mr-2">{`>`}</span>{scanSteps[scanStep]}
                  </p>
                </div>
              </div>
            )}

            {/* Status Display */}
            {status && !loading && (
              <div className="db-card p-4 mb-6">
                <p className="text-db-text-light text-center">{status}</p>
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            {!loading && !result && (
              <div className="db-card shield-card p-8 text-center h-full flex flex-col items-center justify-center relative">
                <div className="mb-6 security-indicator">
                  <svg className="lightning-effect" width="70" height="70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 10V3L4 14H11V21L20 10H13Z" fill="var(--db-lightning-red)" stroke="var(--db-lightning-red)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-db-text-light mb-2">Ready to Analyze</h2>
                <p className="text-db-text-medium max-w-md">
                  Enter a Docker image name or URL to scan for vulnerabilities, generate an SBOM, 
                  check licenses, and get a comprehensive security report.
                </p>
              </div>
            )}

            {/* Results Display */}
            {result && (
              <div className="db-card shield-card p-6 animate-fade-in relative">
                {/* Enhanced Executive Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="flex flex-col items-center justify-center">
                    <CircularGauge value={result.risk_score} maxValue={10} label="Risk Score" />
                  </div>
                  <div>
                    <SeverityChart data={getDefaultSeverityData(result.cve_count)} />
                  </div>
                  <div>
                    <LicenseIndicator violations={result.license_violations} />
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  <MetricCard value={result.cve_count} label="CVEs Detected" icon="🔍" />
                  <MetricCard value={result.license_violations} label="License Issues" icon="📝" />
                  <MetricCard value={result.cve_count > 0 ? Math.round(result.risk_score * 10) : 0} label="Critical Severity" icon="⚠️" />
                  <MetricCard value={5} label="Remediation Steps" icon="🛠️" />
                </div>

                {/* Image Information Card */}
                <div className="bg-db-card-highlight p-4 rounded-lg mb-6 db-border-highlight">
                  <h3 className="text-sm font-medium text-db-text-light mb-2">Container Image Details</h3>
                  <div className="text-xs text-db-text-medium space-y-1">
                    <div className="flex justify-between">
                      <span>Image:</span>
                      <span className="font-mono">{image}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Scan ID:</span>
                      <span className="font-mono">{result.report_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Scan Time:</span>
                      <span>{new Date().toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* License Compliance Status */}
                <div className="flex items-center mb-6 p-3 rounded-lg bg-db-card-highlight">
                  <div className={`w-3 h-3 rounded-full mr-2 ${result.license_violations > 0 ? 'bg-db-lightning-red' : 'bg-db-circuit-blue'}`}></div>
                  <div className="text-sm">
                    <span className="font-medium text-db-text-light">License Compliance: </span>
                    <span className={result.license_violations > 0 ? 'text-db-lightning-red' : 'text-db-circuit-blue'}>
                      {result.license_violations > 0 
                        ? `${result.license_violations} violation${result.license_violations > 1 ? 's' : ''} detected` 
                        : 'No issues detected'}
                    </span>
                  </div>
                </div>

                {/* Component Details Section */}
                <div className="mb-8">
                  <h2 className="text-lg font-bold text-db-text-light mb-4">Component Details</h2>
                  {/* Filter/Sort Controls */}
                  <div className="flex flex-wrap gap-3 mb-4">
                    <select className="bg-db-card-highlight text-db-text-light rounded px-2 py-1" defaultValue="all">
                      <option value="all">All Severities</option>
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                    <select className="bg-db-card-highlight text-db-text-light rounded px-2 py-1" defaultValue="name">
                      <option value="name">Sort by Name</option>
                      <option value="severity">Sort by Severity</option>
                    </select>
                  </div>
                  {/* Expandable Panels for Components */}
                  {mockComponents.map((comp, idx) => (
                    <ExpandablePanel
                      key={idx}
                      title={`${comp.name} (${comp.version})`}
                      level={(() => {
                        switch (comp.severity.toLowerCase()) {
                          case 'critical': return 'critical';
                          case 'high': return 'warning';
                          case 'medium': return 'info';
                          default: return 'none';
                        }
                      })()}
                      badge={<span style={{ color: getSeverityColor(comp.severity), fontWeight: 700 }}>{comp.severity}</span>}
                    >
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div><span className="font-medium text-db-text-light">Origin:</span> {comp.origin}</div>
                          <div><span className="font-medium text-db-text-light">Maintainer:</span> {comp.maintainer}</div>
                          <div><span className="font-medium text-db-text-light">Vector:</span> <span title={comp.vector}>{comp.vector}</span></div>
                        </div>
                        <div className="text-db-text-medium text-xs mt-2">
                          <span className="font-medium text-db-text-light">Impact:</span> <span title={comp.impact}>{comp.impact}</span>
                        </div>
                        <div className="text-db-text-medium text-xs mt-2">
                          <span className="font-medium text-db-text-light">Description:</span> {comp.description}
                        </div>
                      </div>
                    </ExpandablePanel>
                  ))}
                </div>

                {/* Tabbed Sections - Executive Summary, Component Details, Actionable Insights */}
                <div className="mb-6">
                  <div className="flex border-b border-db-card-highlight mb-6">
                    <button 
                      onClick={() => setActiveTab('summary')}
                      className={`px-4 py-2 text-sm font-medium ${activeTab === 'summary' ? 'border-b-2 border-db-docker-blue text-db-docker-blue' : 'text-db-text-medium'}`}
                    >
                      Executive Summary
                    </button>
                    <button 
                      onClick={() => setActiveTab('components')}
                      className={`px-4 py-2 text-sm font-medium ${activeTab === 'components' ? 'border-b-2 border-db-docker-blue text-db-docker-blue' : 'text-db-text-medium'}`}
                    >
                      Component Details
                    </button>
                    <button 
                      onClick={() => setActiveTab('insights')}
                      className={`px-4 py-2 text-sm font-medium ${activeTab === 'insights' ? 'border-b-2 border-db-docker-blue text-db-docker-blue' : 'text-db-text-medium'}`}
                    >
                      Actionable Insights
                    </button>
                  </div>

                  {/* Executive Summary Tab */}
                  {activeTab === 'summary' && (
                    <div className="animate-fade-in">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                        <SecurityMetric value={result.cve_count} label="CVEs Detected" icon="🔍" />
                        <SecurityMetric value={result.license_violations} label="License Issues" icon="📝" />
                        <SecurityMetric 
                          value={result.cve_count > 0 ? Math.round(result.risk_score * 10) : 0} 
                          label="Critical Severity" 
                          icon="⚠️" 
                        />
                        <SecurityMetric value={5} label="Remediation Steps" icon="🛠️" />
                      </div>

                      {/* Image Information Card */}
                      <div className="bg-db-card-highlight p-4 rounded-lg mb-6 db-border-highlight">
                        <h3 className="text-sm font-medium text-db-text-light mb-2">Container Image Details</h3>
                        <div className="text-xs text-db-text-medium space-y-1">
                          <div className="flex justify-between">
                            <span>Image:</span>
                            <span className="font-mono">{image}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Scan ID:</span>
                            <span className="font-mono">{result.report_id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Scan Time:</span>
                            <span>{new Date().toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* License Compliance Status */}
                      <div className="flex items-center mb-6 p-3 rounded-lg bg-db-card-highlight">
                        <div className={`w-3 h-3 rounded-full mr-2 ${result.license_violations > 0 ? 'bg-db-lightning-red' : 'bg-db-circuit-blue'}`}></div>
                        <div className="text-sm">
                          <span className="font-medium text-db-text-light">License Compliance: </span>
                          <span className={result.license_violations > 0 ? 'text-db-lightning-red' : 'text-db-circuit-blue'}>
                            {result.license_violations > 0 
                              ? `${result.license_violations} violation${result.license_violations > 1 ? 's' : ''} detected` 
                              : 'No issues detected'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Component Details Tab */}
                  {activeTab === 'components' && (
                    <div className="animate-fade-in">
                      <div className="bg-db-card-highlight p-4 rounded-lg mb-6">
                        <h3 className="text-sm font-medium text-db-text-light mb-2">Top Vulnerabilities</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="border-b border-gray-700">
                                <th className="px-2 py-2 text-left text-db-docker-blue">Component</th>
                                <th className="px-2 py-2 text-left text-db-docker-blue">Version</th>
                                <th className="px-2 py-2 text-left text-db-docker-blue">Severity</th>
                                <th className="px-2 py-2 text-left text-db-docker-blue">Impact</th>
                              </tr>
                            </thead>
                            <tbody>
                              {/* Example vulnerabilities */}
                              {result.cve_count > 0 ? (
                                <>
                                  <tr className="border-b border-gray-700">
                                    <td className="px-2 py-2">openssl</td>
                                    <td className="px-2 py-2">1.1.1k</td>
                                    <td className="px-2 py-2 text-db-lightning-red">Critical</td>
                                    <td className="px-2 py-2">Remote code execution</td>
                                  </tr>
                                  <tr className="border-b border-gray-700">
                                    <td className="px-2 py-2">log4j</td>
                                    <td className="px-2 py-2">2.14.1</td>
                                    <td className="px-2 py-2 text-db-lightning-red">Critical</td>
                                    <td className="px-2 py-2">Remote injection (Log4Shell)</td>
                                  </tr>
                                </>
                              ) : (
                                <tr>
                                  <td colSpan={4} className="px-2 py-2 text-center">No vulnerabilities detected</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="bg-db-card-highlight p-4 rounded-lg mb-6">
                        <h3 className="text-sm font-medium text-db-text-light mb-2">Severity Breakdown</h3>
                        <div className="grid grid-cols-4 gap-2 text-center text-xs mb-2">
                          <div className="p-2 rounded-lg bg-opacity-10 bg-red-500">
                            <div className="text-db-lightning-red font-bold">{Math.round(result.cve_count * 0.1)}</div>
                            <div className="text-db-text-medium">Critical</div>
                          </div>
                          <div className="p-2 rounded-lg bg-opacity-10 bg-amber-500">
                            <div className="text-amber-500 font-bold">{Math.round(result.cve_count * 0.2)}</div>
                            <div className="text-db-text-medium">High</div>
                          </div>
                          <div className="p-2 rounded-lg bg-opacity-10 bg-blue-500">
                            <div className="text-blue-500 font-bold">{Math.round(result.cve_count * 0.3)}</div>
                            <div className="text-db-text-medium">Medium</div>
                          </div>
                          <div className="p-2 rounded-lg bg-opacity-10 bg-green-500">
                            <div className="text-green-500 font-bold">{Math.round(result.cve_count * 0.4)}</div>
                            <div className="text-db-text-medium">Low</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actionable Insights Tab */}
                  {activeTab === 'insights' && (
                    <div className="animate-fade-in">
                      <div className="bg-db-card-highlight p-4 rounded-lg mb-6">
                        <h3 className="text-sm font-medium text-db-text-light mb-2">Remediation Priority</h3>
                        <ol className="list-decimal pl-5 text-sm text-db-text-light space-y-2">
                          <li>Update vulnerable packages to their latest versions</li>
                          <li>Review and address license compliance issues</li>
                          <li>Implement proper secrets management</li>
                          <li>Consider using minimal base images</li>
                          <li>Regularly scan your containers for new vulnerabilities</li>
                        </ol>
                      </div>

                      <div className="bg-db-card-highlight p-4 rounded-lg mb-6">
                        <h3 className="text-sm font-medium text-db-text-light mb-2">Security Best Practices</h3>
                        <ul className="list-disc pl-5 text-sm text-db-text-light space-y-2">
                          <li>Use multi-stage builds to reduce image size and attack surface</li>
                          <li>Avoid running containers as root when possible</li>
                          <li>Never hardcode secrets in Dockerfiles</li>
                          <li>Keep your base images updated with security patches</li>
                          <li>Implement image signing for supply chain security</li>
                        </ul>
                      </div>

                      <div className="bg-db-card-highlight p-4 rounded-lg mb-6">
                        <h3 className="text-sm font-medium text-db-text-light mb-2">Configuration Example</h3>
                        <pre className="bg-gray-800 text-xs p-3 rounded overflow-x-auto">
{`# Use a specific version tag instead of 'latest'
FROM alpine:3.15

# Run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Use multi-stage builds
FROM build AS final
COPY --from=build /app/binary /app/binary

# Scan your image regularly
# docker scan your-image-name`}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={`http://localhost:8000/download/report/${result.report_id}`}
                    className="db-button px-4 py-3 rounded-lg flex-1 text-center text-sm"
                    download
                  >
                    <span className="flex items-center justify-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2V15M12 15L18 9M12 15L6 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 17V20C2 21.1046 2.89543 22 4 22H20C21.1046 22 22 21.1046 22 20V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Download PDF Report
                    </span>
                  </a>
                  <a
                    href={`http://localhost:8000/download/json/${result.report_id}`}
                    className="bg-db-card-highlight text-db-text-light font-semibold shadow hover:bg-gray-700 transition px-4 py-3 rounded-lg flex-1 text-center text-sm db-border-highlight"
                    download
                  >
                    <span className="flex items-center justify-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 12V14C21 16.7614 18.7614 19 16 19H8C5.23858 19 3 16.7614 3 14V10C3 7.23858 5.23858 5 8 5H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M15 15L18 18M18 18L21 15M18 18V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Export JSON Data
                    </span>
                  </a>
                </div>

                {/* Technical Info */}
                <details className="mt-6 text-xs text-db-text-medium">
                  <summary className="cursor-pointer font-medium">Technical Details & Verification</summary>
                  <div className="mt-2 p-3 bg-db-card-highlight rounded-lg font-mono break-all">
                    <div className="mb-1"><span className="text-db-docker-blue">SHA-256:</span> {result.manifest_sha256}</div>
                    <div><span className="text-db-docker-blue">Signature:</span> {result.signature}</div>
                  </div>
                </details>
                
                {/* Decorative Lightning Element */}
                <div className="absolute right-0 top-1/4 bottom-1/4 lightning-border"></div>
              </div>
            )}
          </div>
        </div>

        <footer className="mt-10 text-xs text-db-text-medium text-center">
          <p>© {new Date().getFullYear()} Docker Buster • Powered by Advanced Container Security</p>
        </footer>
      </div>
    </div>
  );
}
