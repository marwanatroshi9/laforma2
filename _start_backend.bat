@echo off
title Architecture Backend (API)
cd /d "%~dp0backend"
set DATABASE_URL=sqlite:///./dev.db
set BACKEND_CORS_ORIGINS=http://localhost:3000
echo ============================================================
echo  Backend (API) running on http://localhost:8000
echo  Keep this window open. Close it to stop the API.
echo ============================================================
echo.
.venv\Scripts\python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
echo.
echo Backend stopped. Press any key to close.
pause >nul
