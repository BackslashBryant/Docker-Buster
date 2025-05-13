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

# Docker Buster

A portable desktop/web tool that ingests Docker images, generates SBOMs, scans for vulnerabilities, and produces tamper-evident reports.

## Prerequisites

Before running Docker Buster, ensure you have the following installed:

- Python 3.8 or higher
- Node.js 16 or higher
- pip
- npm
- Docker (for scanning images)

## Installation

### Backend Dependencies

```powershell
cd backend
pip install -r requirements.txt
```

Additional requirements:
```powershell
pip install fastapi uvicorn weasyprint cryptography
```

For scanning tools (optional, mock data will be used if not available):
```powershell
# Install Syft for SBOM generation
curl -sSfL https://raw.githubusercontent.com/anchore/syft/main/install.sh | sh -s -- -b /usr/local/bin

# Install Grype for vulnerability scanning
curl -sSfL https://raw.githubusercontent.com/anchore/grype/main/install.sh | sh -s -- -b /usr/local/bin
```

### Frontend Dependencies

```powershell
cd frontend
npm install
```

## Running Docker Buster

### Option 1: Use the Start Scripts (Recommended)

The easiest way to start Docker Buster is to use the provided scripts:

1. **PowerShell Script** (Best for PowerShell users - from the project root):
   ```powershell
   # Execute the PowerShell script
   .\Start-DockerBuster.ps1
   
   # If you get execution policy errors, you might need to run:
   powershell -ExecutionPolicy Bypass -File .\Start-DockerBuster.ps1
   ```

2. **Batch File** (from the project root):
   ```powershell
   # In PowerShell, you must use .\ for local scripts
   .\start_docker_buster.bat
   
   # In Command Prompt (cmd.exe), you can use:
   start_docker_buster.bat
   ```

3. For backend only:
   ```powershell
   cd backend
   .\start_server.bat  # PowerShell requires .\ prefix
   ```

4. For frontend only:
   ```powershell
   cd frontend
   .\start_frontend.bat  # PowerShell requires .\ prefix
   ```

### Option 2: Manual Commands

If you prefer running commands manually:

**Backend Server:**
```powershell
cd backend
python -m uvicorn main:app --reload
```

**Frontend Server:**
```powershell
cd frontend
npm run dev
```

## Accessing the Application

- Frontend UI: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://127.0.0.1:8000](http://127.0.0.1:8000)

## Features

- SBOM Generation using Syft
- Vulnerability & License Scanning using Grype
- Risk Scoring Engine
- Report Builder with PDF + JSON + signature
- Modern React/Tailwind UI

## Input Types Supported

Docker Buster can analyze:
- Docker images (e.g., `nginx:1.19`)
- Full image URLs (e.g., `docker.io/library/alpine:latest`) 
- Git repositories (e.g., `github.com/user/repo`)

## Testing

A comprehensive testing plan is available in [docs/testing-plan.md](docs/testing-plan.md). This includes:

- Unit tests for backend components
- Integration tests for scanning tools
- End-to-end tests for the complete workflow
- A testing matrix for different Docker image sources

Run tests with:
```powershell
cd backend
pytest
```

## Troubleshooting

### Common Issues

1. **Missing modules/packages**: Ensure all required packages are installed
   ```
   pip install fastapi uvicorn weasyprint cryptography
   ```

2. **Commands must be run from the correct directory**:
   - Backend commands must be run from the `backend` directory
   - Frontend commands must be run from the `frontend` directory

3. **Windows PowerShell command syntax**:
   - Use quotes around paths with spaces: `cd "C:\path with spaces"`
   - Do not use `&&` for command chaining in PowerShell
   - When running local scripts or batch files, use the `.\` prefix:
     ```powershell
     # Correct (PowerShell)
     .\start_frontend.bat
     
     # Incorrect (PowerShell)
     start_frontend.bat
     ```

4. **PowerShell Execution Policy**:
   - If you get execution policy errors with the PowerShell script, run:
     ```powershell
     # Temporarily bypass the execution policy for this script
     powershell -ExecutionPolicy Bypass -File .\Start-DockerBuster.ps1
     ```

5. **Docker Daemon Not Running**:
   - If you see errors accessing Docker images, make sure Docker is running
   - Try running `docker ps` to verify Docker connectivity

6. **WeasyPrint GLib Warnings**:
   - These are non-critical warnings related to UWP apps on Windows
   - They don't affect the functionality of the application

7. **500 Internal Server Errors**:
   - Check backend logs for detailed error information
   - Verify Docker is running if scanning Docker images
   - Ensure you have sufficient disk space for report generation

## Project Structure

- `backend/` - FastAPI application for scanning and report generation
- `frontend/` - Next.js/React UI for user interaction
- `docs/` - Project documentation and architecture decisions
- `docs/decision-log/` - Architecture Decision Records (ADRs)
- `docs/tickets.md` - Development tickets and progress tracking

## License

This project is open source and available under the MIT License.

## Monorepo Testing

This project uses **Vitest** for all frontend (Next.js/TypeScript) code and **pytest** for the Python FastAPI backend.

### Run all frontend tests (Vitest)

```sh
npm --prefix frontend test
```

### Run all backend tests (pytest)

```sh
pytest backend/
```

### Run all tests (sequential)

```sh
npm --prefix frontend test && pytest backend/
```

### Troubleshooting
- If a test fails, check the output for details.
- Ensure all dependencies are installed in both `frontend/` and `backend/`.
- For backend: activate your Python virtual environment if needed.
