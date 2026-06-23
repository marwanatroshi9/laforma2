@echo off
title Architecture Frontend (Website)
cd /d "%~dp0frontend"
set BACKEND_INTERNAL_URL=http://localhost:8000
if not exist ".next\BUILD_ID" (
  echo First run - preparing the website, please wait a minute...
  call npm run build
)
echo ============================================================
echo  Website running on http://localhost:3000
echo  Keep this window open. Close it to stop the website.
echo ============================================================
echo.
call npm run start
echo.
echo Website stopped. Press any key to close.
pause >nul
