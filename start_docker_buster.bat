@echo off
echo Docker Buster - Starting Services
echo ===============================
echo.

echo Starting Backend Server...
:: Using /c for cmd ensures it works regardless of whether run from PowerShell or CMD
start cmd /c "cd backend && python -m uvicorn main:app --reload"

echo.
echo Starting Frontend Server...
start cmd /c "cd frontend && npm run dev"

echo.
echo Both servers should now be starting in separate windows.
echo.
echo Backend: http://127.0.0.1:8000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this window...
pause > nul 