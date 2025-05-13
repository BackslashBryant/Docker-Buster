# PowerShell script to start Docker Buster services
Write-Host "Docker Buster - Starting Services" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Starting Backend Server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit -Command `"cd ./backend; python -m uvicorn main:app --reload`""

Write-Host ""
Write-Host "Starting Frontend Server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit -Command `"cd ./frontend; npm run dev`""

Write-Host ""
Write-Host "Both servers should now be starting in separate windows." -ForegroundColor Yellow
Write-Host ""
Write-Host "Backend: http://127.0.0.1:8000" -ForegroundColor Magenta
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Magenta
Write-Host ""
Write-Host "Press Enter to exit this window..." -ForegroundColor Gray
Read-Host 