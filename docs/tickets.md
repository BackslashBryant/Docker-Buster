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

- [x] **Vulnerability & License Scan: SPDX license detection**
  - Detect and list SPDX licenses from image contents.
  - Sub-tasks:
    - [x] Extract license info from SBOM
    - [x] Display license summary in report

- [x] **Risk Scoring Engine**
  - Implement weighted risk scoring (CVE severity, secrets presence).
  - Sub-tasks:
    - [x] Define scoring algorithm
    - [x] Integrate secrets/config hygiene checks

- [x] **Report Builder: PDF + JSON + signature**
  - Combine SBOM and scan results into HTML → PDF (WeasyPrint).
  - Sub-tasks:
    - [x] Generate HTML report
    - [x] Export PDF and JSON
    - [x] Add SHA-256 manifest + detached signature

- [ ] **UI: Simple React/Tailwind**
  - Image name input, progress bar, download link.
  - Sub-tasks:
    - [ ] Scaffold Next.js + Tailwind frontend
    - [ ] Connect to backend endpoints
    - [ ] Implement progress and download UX
    - [ ] Responsive layout and accessibility polish
    - [ ] Minimal, professional styling (Tailwind + shadcn/ui)
    - [ ] Manual end-to-end test: scan and download report
    - [ ] **Branding & Visual Identity**: Custom logo/icon, bold type, animated background
    - [ ] **Layout & Flow**: Centered card, entrance animation, mobile-friendly
    - [ ] **Form & Interactions**: Floating label, animated button, keyboard-friendly
    - [ ] **Progress & Feedback**: Animated progress, playful microcopy, toasts
    - [ ] **Results & Downloads**: Risk badge, glassy download buttons, collapsible details
    - [ ] **Polish**: Subtle hover/focus, modern palette, minimal footer
    - [ ] **Catchy Language**: Memorable, playful, frictionless copy throughout
