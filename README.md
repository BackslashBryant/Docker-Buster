# Docker Buster

A portable desktop/web tool that ingests Docker images, generates SBOMs, scans for vulnerabilities, and produces tamper-evident reports.

## Prerequisites

Before running Docker Buster, ensure you have the following installed:

- Python 3.8 or higher
- Node.js 16 or higher
- pip
- npm

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

## License

This project is open source and available under the MIT License. 