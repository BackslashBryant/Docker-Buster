@echo off
echo Starting Docker Buster Backend Server...
echo.
python -m uvicorn main:app --reload
echo.
pause
