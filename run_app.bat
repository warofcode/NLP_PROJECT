@echo off
cd /d "%~dp0"
echo ========================================================
echo Launching Legal Document Classifier Full-Stack System
echo ========================================================
echo.
echo [1/2] Starting Backend API Server (FastAPI)...
start "Legal NLP Backend (FastAPI)" cmd /k "cd /d "%~dp0" && python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload"

echo [2/2] Starting Frontend UI (Vite + React)...
start "Legal NLP Frontend (Vite + React)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ========================================================
echo Both servers are launching in separate windows!
echo - Backend API:  http://127.0.0.1:8000 (Docs at /docs)
echo - Frontend UI:  http://localhost:5173
echo ========================================================
pause
