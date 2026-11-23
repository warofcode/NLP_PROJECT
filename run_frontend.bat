@echo off
cd /d "%~dp0frontend"
echo ===================================================
echo Starting Legal Document Classifier - React Frontend
echo ===================================================
echo Working Directory: %CD%
echo URL: http://localhost:5173
echo.
npm run dev
pause
