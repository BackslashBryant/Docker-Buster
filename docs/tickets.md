## Backlog

- [ ] **SBOM Generation: Support local images**
  - Use `syft -o cyclonedx-json` to generate SBOM from local Docker images.
  - Sub-tasks:
    - [ ] Integrate Syft CLI invocation
    - [ ] Parse and validate CycloneDX JSON output

- [ ] **Vulnerability & License Scan: CVE listing**
  - Use `grype` to scan for Critical & High CVEs.
  - Sub-tasks:
    - [ ] Integrate Grype CLI invocation
    - [ ] Parse CVE results, filter by severity

- [ ] **Vulnerability & License Scan: SPDX license detection**
  - Detect and list SPDX licenses from image contents.
  - Sub-tasks:
    - [ ] Extract license info from SBOM
    - [ ] Display license summary in report

- [ ] **Risk Scoring Engine**
  - Implement weighted risk scoring (CVE severity, secrets presence).
  - Sub-tasks:
    - [ ] Define scoring algorithm
    - [ ] Integrate secrets/config hygiene checks

- [ ] **Report Builder: PDF + JSON + signature**
  - Combine SBOM and scan results into HTML, convert to PDF (WeasyPrint), and generate JSON.
  - Sub-tasks:
    - [ ] HTML report template
    - [ ] PDF export via WeasyPrint
    - [ ] JSON report structure
    - [ ] SHA-256 manifest + detached signature

- [ ] **UI: Image input, progress, download**
  - Simple React/Tailwind UI for image name input, progress bar, and download link.
  - Sub-tasks:
    - [ ] Image name input form
    - [ ] Progress indicator
    - [ ] Download link for report bundle
