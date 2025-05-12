# About

This project provides a modern baseline for full-stack development using Next.js (TypeScript) for the frontend and FastAPI (Python) for the backend. It is designed for rapid prototyping and scalable production deployments.

## Quick-Start

### Windows PowerShell
```powershell
# Clone repo
git clone <REPO_URL>
cd "1. Projects"
# (Optional) Setup Python venv
python -m venv .venv
.venv\Scripts\Activate.ps1
# Install backend deps
pip install -r requirements.txt
```

### Bash
```bash
# Clone repo
git clone <REPO_URL>
cd "1. Projects"
# (Optional) Setup Python venv
python3 -m venv .venv
source .venv/bin/activate
# Install backend deps
pip install -r requirements.txt
```

## Tech Stack
- **Frontend:** Next.js (TypeScript), Tailwind CSS, shadcn/ui
- **Backend:** FastAPI (Python)
- **Design:** Figma, shadcn/ui
- **CI/CD:** GitHub Actions
- **Testing:** Pytest, Jest, React Testing Library

## Folder Map
- `.cursor/` — Editor & automation configs
- `.memory/` — Project memory & key facts
- `apps/` — App entrypoints (FE/BE)
- `docs/` — Documentation
- `docs/decision-log/` — Architecture Decision Records
- `labs/` — Experiments & prototypes
- `lib/` — Shared libraries
- `scripts/` — Automation scripts
