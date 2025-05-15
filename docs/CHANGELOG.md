<!--
Purpose: Project changelog for Docker Buster
How to use: Log all notable changes, releases, and fixes. As tickets are completed or bugs are fixed, add them here and remove them from tickets.md. Follow Keep a Changelog format.
Last updated: 2024-06-09
-->
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0).

## [Unreleased]

## [2024-06-09]
### Added
- ✅ SBOM generation with Syft (CycloneDX JSON support)
- ✅ Grype-based vulnerability and license scanning
- ✅ Risk scoring engine with weighted severity
- ✅ Secure report builder (PDF + JSON + SHA-256 signature)
- ✅ Report download with frontend/backend integration
- ✅ UI/UX improvements: spacing, alignment, logo consistency, branding, accessibility
- ✅ Frontend data flow: form input, loading states, error feedback
- ✅ Accurate progress indicators (no premature 100%)
- ✅ JSON output structure enhancements
- ✅ Frontend UI overhaul foundation using v0.dev
- ✅ All tabs implemented in UI: Summary, Component Details, Insights

### Fixed
- ✅ Backend CORS and connection issues
- ✅ Layout and alignment inconsistencies
- ✅ Broken visual hierarchy and content spacing
- ✅ Inaccurate `/risk-score` HTTP response codes
- ✅ Dependency issues (httpx, python-multipart)
- ✅ Playwright E2E test reliability

### Changed
- Refactored all UI components to match Docker Buster branding
- Hardened error handling and retry logic in scripts and API
- Updated project documentation and contribution guide
- Cleared `tickets.md` of completed items for fresh planning
