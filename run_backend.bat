@echo off
cd /d "%~dp0"
echo ===================================================
echo Starting Legal Document Classifier - Backend API
echo ===================================================
echo Working Directory: %CD%
echo URL: http://127.0.0.1:8000
echo Swagger Docs: http://127.0.0.1:8000/docs
echo.
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
pause
