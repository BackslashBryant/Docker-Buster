# Docker Buster

## Overview
Docker Buster is a portable desktop/web tool for analyzing Docker images. It auto-generates a signed SBOM, runs CVE & license scans, evaluates config/secrets hygiene, and outputs a tamper-evident PDF+JSON report with an overall risk score and prioritized fixes—no CI/CD integration required.

## Quickstart

### Prerequisites
- Python 3.8+
- Node.js 18+
- Docker (for image analysis)

### Backend
```sh
cd backend
pip install -r requirements.txt
python main.py
```

### Frontend
```sh
cd frontend
npm install
npm run dev
```

### Scripts
See the `scripts/` directory for automation scripts:
- `start_docker_buster.bat`: Launches both backend and frontend (Windows)

## Directory Structure
```
backend/     # Python backend API and report generation
frontend/    # Next.js/React frontend UI
scripts/     # Automation and launch scripts
docs/        # Documentation, PRD, tickets, changelog, contributing
tests/       # Integration/e2e tests
```

## API Endpoints
- `POST /sbom` — Generate SBOM from image name
- `POST /sbom/upload` — Generate SBOM from Docker image tarball
- `POST /cve-scan` — List CVEs for image
- `POST /license-scan` — List licenses for image
- `POST /risk-score` — Calculate risk score for image
- `POST /report` — Generate full report (PDF, JSON, signature)
- `GET /download/report/{report_id}` — Download PDF report
- `GET /download/json/{report_id}` — Download JSON report

## Testing
- Backend: `cd backend && python -m pytest`
- Frontend: `cd frontend && npm test` (if tests present)
- All backend tests pass 100% as of latest commit.

## Known Issues
See [docs/tickets.md](docs/tickets.md) for open bugs and roadmap.

## Contributing
See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

## References
- [Product Requirements: docs/prd.yaml](docs/prd.yaml)
- [Tickets & Roadmap: docs/tickets.md](docs/tickets.md)
- [Changelog: docs/CHANGELOG.md](docs/CHANGELOG.md)

---
For more details, see the full [Restructuring Plan](docs/RESTRUCTURE_PLAN.md).
