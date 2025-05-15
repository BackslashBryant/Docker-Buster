# 📝 `tickets.md` – Docker Buster Active Ticket Log

**Purpose:** Track active features, bugs, testing tasks, and future work. Completed items are removed and moved to changelog.  
**Updated:** 2024-06-09

---

## 🔧 feat(core) – Core Functionality

**DB-1002** [x] Verify core scanning & reporting features  
- All core scanning/reporting endpoints verified (manual & automated)
- Expanded backend tests: see backend/test_main.py
- Expanded Playwright E2E: see frontend/tests/example.spec.ts
- Coverage includes error handling, edge cases, and report downloads

**DB-1003** [ ] Fix WeasyPrint `GLib-GIO-WARNING` messages  
- Set `G_MESSAGES_DEBUG=none`  
- Enable optional headless mode for PDF generation

---

## 🎨 feat(ux) – UX Enhancements

**DB-2001** [ ] Normalize spacing and layout consistency  
**DB-2002** [ ] Improve upload experience (progress/error indicators)  
**DB-2003** [ ] Add first-run onboarding guide and error explanations  
**DB-2004** [ ] Validate scan completion flow for non-technical users (0-config, 1-click)

---

## 📆 feat(portability) – Deployment & Packaging

**DB-3001** [ ] Add auto-dependency install script (Python & Node)  
**DB-3002** [ ] Package app as standalone executable  
**DB-3003** [ ] Implement full offline mode with bundled tools  
**DB-3004** [ ] Enforce open-source-only runtime dependencies (MIT/Apache/BSD)  

---

## 📊 feat(reporting) – Report Format & Insights

**DB-4001** [ ] Executive Summary Enhancements  
- Prominent risk score (horizontal bar)  
- Severity breakdown (chart)  
- License compliance indicator  
- Dashboard card metrics

**DB-4002** [ ] Component Details View  
- Expand/collapse hierarchy  
- Origin/provenance details  
- Contextual tooltips  
- Filtering/sorting by severity, type, component

**DB-4003** [ ] Actionable Insights  
- Remediation steps list (prioritized)  
- Upgrade cards (current vs recommended)  
- Config code blocks w/ copy button  
- Best practice links

**DB-4004** [ ] Backend PDF/JSON Report Upgrade  
- Redesign templates to match UI  
- Table of contents and proper sectioning  
- Optimize HTML-to-PDF performance  
- Add progress indicators during build

**DB-4005** [ ] Unify SBOM + risk data into a single tamper-evident PDF

---

## 🔮 feat(test) – QA & Testing Infrastructure

**DB-5001** [ ] Regression test suite for UI rebuild validation  
**DB-5002** [ ] Vitest/UI component test suite + e2e flows  
**DB-5003** [ ] Backend API test coverage  
**DB-5004** [~] CI/CD test automation setup  
- Backend test automation implemented via GitHub Actions workflow (.github/workflows/backend-ci.yml)
**DB-5005** [ ] Validate output for known CVEs and flagged secrets in test images  
**DB-5006** [ ] Add test for detecting known CVE: CVE‑2021‑44228 in scanned images  
**DB-5007** [ ] Verify PDF manifest checksum matches generated SHA-256 hash  
**DB-5008** [ ] Validate secrets scanner flags common env vars (e.g., `AWS_SECRET_ACCESS_KEY`)  

---

## 🔧 fix(bugs) – Open Bugs

**DB-6001** [ ] Playwright E2E: Renders "v0 App" instead of Docker Buster UI  
**DB-6002** [ ] Playwright fails from root due to module resolution  
**DB-6003** [ ] Frontend/backend URL mismatch: `Failed to fetch` error  
**DB-6004** [x] Backend missing `httpx` for test client  
**DB-6005** [x] Backend missing `python-multipart` for form parsing

---

## 🧽 feat(intel) – Risk Intelligence

**DB-7003** [ ] Integrate vulnerability database sources (e.g. OSV, NVD)  
**DB-7005** [ ] Integrate best practices from OWASP, CIS, Docker security guidance  

---

## 🌐 feat(registry) – Remote Image Ingestion

**DB-7006** [ ] Support GitHub/Docker Hub URL input for remote image scanning  
**DB-7007** [ ] Auto-detect and normalize registry formats from user input  

---

## 🪠 feat(infra) – Constraints & Compliance

**DB-9001** [ ] Enforce offline-only runtime (disable outbound connections)  
**DB-9002** [ ] Validate all runtime dependencies use FOSS licenses (MIT, Apache 2.0, BSD)  
**DB-9003** [ ] Cap report bundle size to ≤ 10 MB and issue warning if exceeded  

---

## 📚 feat(docs) – Documentation & Release Notes

**DB-9501** [ ] Document image URL input flow and supported registry formats  
**DB-9502** [ ] Add onboarding and user help content for first-run experience  
**DB-9503** [ ] Publish PRD-aligned changelog and final release notes for v1.0  

---
