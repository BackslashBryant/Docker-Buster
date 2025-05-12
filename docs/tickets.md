## Backlog

- [x] **SBOM Generation: Support local images**
  - Use `syft -o cyclonedx-json` to generate SBOM from local Docker images.
  - Sub-tasks:
    - [x] Integrate Syft CLI invocation
    - [x] Parse and validate CycloneDX JSON output

- [x] **Vulnerability & License Scan: CVE listing**
  - Use `grype` to scan for Critical & High CVEs.
  - Sub-tasks:
    - [x] Integrate Grype CLI invocation
    - [x] Parse CVE results, filter by severity

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
  - Combine SBOM and scan results into HTML → PDF (WeasyPrint).
  - Sub-tasks:
    - [ ] Generate HTML report
    - [ ] Export PDF and JSON
    - [ ] Add SHA-256 manifest + detached signature

- [ ] **UI: Simple React/Tailwind**
  - Image name input, progress bar, download link.
  - Sub-tasks:
    - [ ] Scaffold Next.js + Tailwind frontend
    - [ ] Connect to backend endpoints
    - [ ] Implement progress and download UX
