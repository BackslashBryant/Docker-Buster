@echo off
REM Start Docker Buster Backend, Frontend, and open UI in browser

REM Start backend (FastAPI/Uvicorn) in new window
start "Docker Buster Backend" cmd /k "cd ../backend && uvicorn main:app --reload"

REM Start frontend (Next.js) in new window
start "Docker Buster Frontend" cmd /k "cd ../frontend && npm run dev"

REM Wait a few seconds for frontend to start
ping 127.0.0.1 -n 6 > nul

REM Open frontend in default browser
start http://localhost:3000 