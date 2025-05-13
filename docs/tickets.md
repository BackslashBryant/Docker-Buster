# Docker Buster Tickets

**All tickets must include or update tests as appropriate.**

## 1. TODO Items [CURRENT PRIORITIES]

1.1 [ ] **Restore Core Functionality Post-UI Rebuild [HIGHEST PRIORITY]**
  - 1.1.1 [x] **Fix Frontend Application Launch**
    - Resolve dependency issues preventing frontend from starting
    - Ensure proper Next.js configuration with v0.dev components
    - Test basic UI rendering without backend connectivity
    - Verify React component hierarchy is working correctly

  - 1.1.2 [x] **Implement Data Flow to New UI**
    - Connect form submit in left-panel to make API requests
    - Implement proper loading/scanning state in right-panel
    - Wire up progress indicators to reflect actual backend progress
    - Add error handling for failed API requests

  - 1.1.3 [x] **Restore Report Download Functionality**
    - Re-implement PDF and JSON download buttons 
    - Ensure report files are correctly retrieved from backend
    - Test download functionality with various Docker images
    - Add loading indicators during file retrieval

1.2 [ ] **Verify Core Feature Functionality [HIGH PRIORITY]**
  - 1.2.1 [ ] **SBOM Generation**
    - Confirm Syft integration still works (previously completed in 5.1)
    - Verify CycloneDX JSON parsing is correct 
    - Test with various Docker image formats
    - **Add file upload support for Docker image tarballs (user can upload .tar from `docker save`)**
    - **Implement multi-input handling: image name, registry link, or file upload**
    - **Update frontend: simple form for all input types (text, link, file upload)**
    - **Test all input types locally and document edge cases**
    - _Note: Supabase is not required for this feature; all processing is local and stateless._

  - 1.2.2 [ ] **Vulnerability & License Scanning**
    - Verify Grype integration for CVE scanning (previously completed in 5.2)
    - Confirm license detection works correctly (previously completed in 5.3)
    - Test results display correctly in new UI components

  - 1.2.3 [ ] **Risk Scoring & Report Building**
    - Confirm risk score calculation logic (previously completed in 5.4)
    - Verify PDF and JSON generation (previously completed in 5.5)
    - Ensure report signature generation is working

  - 1.2.4 [x] **Test Results Display in New UI**
    - Verify all tabs (Summary, Component Details, Insights) render correctly
    - Test risk gauge component with different score values
    - Ensure vulnerability table displays data correctly
    - Check responsive behavior at various screen sizes

1.3 [ ] **Critical Bug Fixes**
  - 1.3.1 [ ] Fix WeasyPrint GLib-GIO-WARNING messages in logs
    - Set `G_MESSAGES_DEBUG=none` environment variable
    - Add optional headless mode for PDF generation

  - 1.3.2 [x] Fix any backend connection issues
    - Verify CORS settings are correct for local development
    - Ensure backend endpoints are accessible to frontend
    - Test API responses with Postman or similar tool

  - 1.3.3 [x] Implement proper error handling
    - Add error states to UI for various failure modes
    - Ensure user feedback for failed operations
    - Add retry mechanisms for transient failures

1.4 [ ] **UX Refinements**
  - 1.4.1 [x] **Complete v0.dev Integration**
    - Ensure reports display correctly with v0.dev's styling
    - Validate accessibility compliance of v0.dev components
    - Fix any layout issues in the new component structure

  - 1.4.2 [x] **Verify Progress Indicator Accuracy**
    - Ensure progress bar reflects actual processing status
    - Display appropriate status messages during scan process
    - Prevent 100% indication until all report files are ready

1.5 [ ] **Portability Improvements**
  - 1.5.1 [ ] Add script for auto-installing dependencies (Python/Node)
  - 1.5.2 [ ] Package application as standalone executable
  - 1.5.3 [ ] Create offline mode with bundled scanning capabilities

## 2. Enhanced Report Format [PRIORITY]

2.1 [ ] **Executive Summary Section**
  - 2.1.1 [ ] Implement prominent risk score display with visual gauge
    - Add circular or slider gauge visualization
    - Display score with color-coded severity indicator
  - 2.1.2 [ ] Create critical findings count with severity breakdown
    - Add grouped bar chart or pie chart for severity distribution
    - Include count of vulnerabilities by category (critical, high, medium, low)
  - 2.1.3 [ ] Add license compliance status indicator
    - Design color-coded compliance indicator
    - Create tooltip explanations for license issues
  - 2.1.4 [ ] Design overview metrics dashboard
    - Create concise metrics cards for key indicators
    - Add visual representations for quick assessment

2.2 [ ] **Component Details Implementation**
  - 2.2.1 [ ] Build expandable/collapsible hierarchical view by severity
    - Create nested component structure
    - Implement expand/collapse functionality with animations
  - 2.2.2 [ ] Add component origin and provenance information
    - Display package source information
    - Show maintainer information where available
  - 2.2.3 [ ] Implement contextual explanations for findings
    - Add tooltips with detailed explanations
    - Include information on potential impact and vulnerability vectors
  - 2.2.4 [ ] Create filtering and sorting options
    - Add filter controls by severity, type, and component
    - Implement sorting by various metrics (severity, date, etc.)

2.3 [ ] **Actionable Insights Section**
  - 2.3.1 [ ] Design prioritized remediation steps section
    - Create ordered list of recommended actions
    - Add severity-based prioritization
  - 2.3.2 [ ] Implement upgrade recommendation cards
    - Show current vs. recommended versions
    - Include information on fixes in newer versions
  - 2.3.3 [ ] Add configuration suggestion blocks
    - Create code blocks with implementable fixes
    - Include copy functionality for easy implementation
  - 2.3.4 [ ] Incorporate security best practices
    - Add relevant security guidelines based on findings
    - Include links to documentation and resources

2.4 [ ] **Backend Integration**
  - 2.4.1 [ ] Update WeasyPrint templates
    - Redesign PDF output to match new web UI
    - Add table of contents for navigation
    - Implement proper page breaks and sections
  - 2.4.2 [ ] Improve report generation performance
    - Optimize HTML to PDF conversion
    - Add progress indicators during generation

## 3. Future Improvements

3.1 [ ] **Advanced Testing**
  - 3.1.1 [ ] Test various Docker image sources and formats
  - 3.1.2 [ ] Performance testing with large images
  - 3.1.3 [ ] Security testing for input validation
  - 3.1.4 [ ] Accessibility and usability testing

3.2 [ ] **Infrastructure**
  - 3.2.1 [ ] Report storage management and cleanup
  - 3.2.2 [ ] Disk space monitoring
  - 3.2.3 [ ] CI/CD integration for automated testing

3.3 [ ] **Feature Expansion**
  - 3.3.1 [ ] Support for comparing multiple images
  - 3.3.2 [ ] History/tracking of previously scanned images
  - 3.3.3 [ ] Integration with vulnerability databases
  - 3.3.4 [ ] Create Docker Compose setup for one-command deployment
  - 3.3.5 [ ] Integrate authoritative security best practices/config snippets from open source or official sources (e.g., OWASP, Docker docs, CIS Benchmarks)

## 4. Bug Tracking & QA

4.1 [ ] **Regression Testing [PRIORITY]**
  - 4.1.1 [ ] **Create Comprehensive Test Plan**
    - Document all core functionality to test after UI rebuild
    - Create test cases for each feature from the original PRD
    - Define success criteria for each test case

  - 4.1.2 [ ] **UI/UX Testing Suite**
    - Create Vitest component tests for new UI
    - Add end-to-end tests for primary user flows
    - Set up visual regression testing

  - 4.1.3 [ ] **Implement Automated Tests**
    - Add frontend unit tests for critical components
    - Implement end-to-end tests for main functionality
    - Create API tests for backend endpoints

4.2 [ ] **Bug Reporting & Review**
  - 4.2.1 [ ] Add a section in the docs or UI for users to report bugs
  - 4.2.2 [ ] Establish a process for reviewing, reproducing, and closing bugs
  - 4.2.3 [ ] Track scan failures and error messages for triage

4.3 [ ] **(Optional) In-App Bug Reporting**
  - 4.3.1 [ ] Add a simple bug report form to the UI for user feedback

## 5. Completed

5.1 [x] **SBOM Generation: Support local images**
  - Use `syft -o cyclonedx-json` to generate SBOM from local Docker images
  - Integrate Syft CLI invocation
  - Parse and validate CycloneDX JSON output

5.2 [x] **Vulnerability & License Scan: CVE listing**
  - Use `grype` to scan for Critical & High CVEs
  - Integrate Grype CLI invocation
  - Parse CVE results, filter by severity

5.3 [x] **Vulnerability & License Scan: SPDX license detection**
  - Detect and list SPDX licenses from image contents
  - Extract license info from SBOM
  - Display license summary in report

5.4 [x] **Risk Scoring Engine**
  - Implement weighted risk scoring (CVE severity, secrets presence)
  - Define scoring algorithm
  - Integrate secrets/config hygiene checks

5.5 [x] **Report Builder: PDF + JSON + signature**
  - Combine SBOM and scan results into HTML → PDF (WeasyPrint)
  - Generate HTML report
  - Export PDF and JSON
  - Add SHA-256 manifest + detached signature

5.6 [x] **UI Redesign with Security Focus (Docker Buster brand)**
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

5.7 [x] **UI/UX Refinement Improvements**
  - 5.7.1 [x] Implement correct shield logo consistently across all interfaces
    - Replace current pyramid/shield hybrid with official Docker Buster logo 
    - Ensure logo displays correctly at all sizes (favicon, header, reports)
  - 5.7.2 [x] Refine color scheme to match brand identity
    - Apply Navy blue (#0D1E2D), Docker blue (#0DB7ED), Lightning red (#FF3C38) consistently
    - Create accessible color variations for interactive elements
  - 5.7.3 [x] Modernize typography and voice
    - Implement Montserrat for headings, Inter for body text
    - Revise copy to be concise, action-oriented, and technically approachable
  - 5.7.4 [x] Refactor all UI components in frontend/src/components/ui/ to use Docker Buster brand color variables, modern font classes, and minimal, consistent spacing
    - Add/adjust variants for info, warning, success, and critical states using brand palette
    - Standardize spacing and minimalistic design across all UI components
    - All UI components now fully branded and modernized. Ready for main UI flow and accessibility review
  - 5.7.5 [x] Fix Layout Structure Issues
    - Flatten container hierarchy to reduce excessive nesting
    - Expand usable screen space with proper responsive constraints
    - Correct branding layout with proper logo and title positioning
    - Fix button and input elements to prevent truncation and clipping
  - 5.7.6 [x] Resolve Spacing & Alignment Problems
    - Standardize margins and padding throughout the interface
    - Increase whitespace between form elements and controls
    - Apply consistent spacing between content sections
    - Fix alignment of quick scan options and form elements
  - 5.7.7 [x] Improve Visual Hierarchy & Balance
    - Redesign content areas to reduce visual crowding
    - Fix right-side content layout with proper spacing
    - Balance feature badges and informational content
    - Implement improved information density

5.8 [x] **Error Handling Improvements**
  - 5.8.1 [x] Handle 500 Internal Server Error responses
    - Improve error handling in report generation
    - Add retry mechanism for transient failures
  - 5.8.2 [x] Fix startup script issues with PowerShell execution
    - Update batch files to use correct syntax
    - Add proper error handling in scripts

5.9 [x] **Progress Indicator Accuracy**
  - 5.9.1 [x] Ensure progress bar does not show 100% until report is fully built
    - Progress should only reach 100% when all report files (PDF/JSON) are ready for download
    - Prevent user confusion by accurately reflecting build status

5.10 [x] **Frontend UI Overhaul Foundation**
  - 5.10.1 [x] Setup Foundation and Brand Components
    - Download v0.dev design components using: `npx shadcn@2.3.0 add "https://v0.dev/chat/b/b_EbJNoyj4xI5?token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..ER89uPnr5SlAk3Ic.ffU6UDcVOuNhiCwWzhPssH1pRfFRPYkpdRhLixW0P1G1_Zj7g-0XgJTJ6mo.nPU9uOaZvdSFiepwFd7Tew"`
    - Organize components according to project structure
    - Ensure brand tokens are properly applied
    - Create unified globals.css with Docker Buster brand styling

5.11 [x] **Enhanced JSON output structure**
  - Add additional data points for detailed analysis
  - Create versioned API for backward compatibility
  - Include remediation data in JSON output

5.12 [x] **UI Data Flow Integration**
  - Create useDockerScan hook for API interaction
  - Connect frontend form to backend scan API
  - Implement proper data display in UI components
  - Add error handling and loading states
