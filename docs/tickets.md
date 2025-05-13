# Docker Buster Tickets

## Completed

- [x] **SBOM Generation: Support local images**
  - Use `syft -o cyclonedx-json` to generate SBOM from local Docker images
  - Integrate Syft CLI invocation
  - Parse and validate CycloneDX JSON output

- [x] **Vulnerability & License Scan: CVE listing**
  - Use `grype` to scan for Critical & High CVEs
  - Integrate Grype CLI invocation
  - Parse CVE results, filter by severity

- [x] **Vulnerability & License Scan: SPDX license detection**
  - Detect and list SPDX licenses from image contents
  - Extract license info from SBOM
  - Display license summary in report

- [x] **Risk Scoring Engine**
  - Implement weighted risk scoring (CVE severity, secrets presence)
  - Define scoring algorithm
  - Integrate secrets/config hygiene checks

- [x] **Report Builder: PDF + JSON + signature**
  - Combine SBOM and scan results into HTML → PDF (WeasyPrint)
  - Generate HTML report
  - Export PDF and JSON
  - Add SHA-256 manifest + detached signature

- [x] **UI Redesign with Security Focus (Docker Buster brand)**
  - Visual Aesthetics:
    - Shield-inspired design with technical edge
    - Security-focused color palette (Navy blue, docker blue, lightning red)
    - Custom icons for security elements
  - Core Components:
    - Redesigned interface with shield motif
    - Improved scan progress indicators
    - Enhanced results display
  - User Experience:
    - Animated scanning effect for progress
    - Mobile-responsive design
    - Circuit patterns and lightning elements

## Current Sprint

- [ ] **Fix Critical Issues**
  - [ ] Fix WeasyPrint GLib-GIO-WARNING messages in logs
    - Set `G_MESSAGES_DEBUG=none` environment variable
    - Add optional headless mode for PDF generation
  - [x] Handle 500 Internal Server Error responses
    - Improve error handling in report generation
    - Add retry mechanism for transient failures
  - [x] Fix startup script issues with PowerShell execution
    - Update batch files to use correct syntax
    - Add proper error handling in scripts

- [ ] **Portability Improvements [PRIORITY]**
  - [ ] Add script for auto-installing dependencies (Python/Node)
  - [ ] Package application as standalone executable
  - [ ] Create offline mode with bundled scanning capabilities

## Enhanced Report Format [PRIORITY]

- [ ] **Executive Summary Section**
  - [ ] Implement prominent risk score display with visual gauge
    - Add circular or slider gauge visualization
    - Display score with color-coded severity indicator
  - [ ] Create critical findings count with severity breakdown
    - Add grouped bar chart or pie chart for severity distribution
    - Include count of vulnerabilities by category (critical, high, medium, low)
  - [ ] Add license compliance status indicator
    - Design color-coded compliance indicator
    - Create tooltip explanations for license issues
  - [ ] Design overview metrics dashboard
    - Create concise metrics cards for key indicators
    - Add visual representations for quick assessment

- [ ] **Component Details Implementation**
  - [ ] Build expandable/collapsible hierarchical view by severity
    - Create nested component structure
    - Implement expand/collapse functionality with animations
  - [ ] Add component origin and provenance information
    - Display package source information
    - Show maintainer information where available
  - [ ] Implement contextual explanations for findings
    - Add tooltips with detailed explanations
    - Include information on potential impact and vulnerability vectors
  - [ ] Create filtering and sorting options
    - Add filter controls by severity, type, and component
    - Implement sorting by various metrics (severity, date, etc.)

- [ ] **Actionable Insights Section**
  - [ ] Design prioritized remediation steps section
    - Create ordered list of recommended actions
    - Add severity-based prioritization
  - [ ] Implement upgrade recommendation cards
    - Show current vs. recommended versions
    - Include information on fixes in newer versions
  - [ ] Add configuration suggestion blocks
    - Create code blocks with implementable fixes
    - Include copy functionality for easy implementation
  - [ ] Incorporate security best practices
    - Add relevant security guidelines based on findings
    - Include links to documentation and resources

- [ ] **Backend Integration**
  - [ ] Update WeasyPrint templates
    - Redesign PDF output to match new web UI
    - Add table of contents for navigation
    - Implement proper page breaks and sections
  - [ ] Enhance JSON output structure
    - Add additional data points for detailed analysis
    - Create versioned API for backward compatibility
    - Include remediation data in JSON output
  - [ ] Improve report generation performance
    - Optimize HTML to PDF conversion
    - Add progress indicators during generation

## Future Improvements

- [ ] **Advanced Testing**
  - [ ] Test various Docker image sources and formats
  - [ ] Performance testing with large images
  - [ ] Security testing for input validation
  - [ ] Accessibility and usability testing

- [ ] **Infrastructure**
  - [ ] Report storage management and cleanup
  - [ ] Disk space monitoring
  - [ ] CI/CD integration for automated testing

- [ ] **Feature Expansion**
  - [ ] Support for comparing multiple images
  - [ ] History/tracking of previously scanned images
  - [ ] Integration with vulnerability databases
  - [ ] Create Docker Compose setup for one-command deployment
  - [ ] Integrate authoritative security best practices/config snippets from open source or official sources (e.g., OWASP, Docker docs, CIS Benchmarks)
