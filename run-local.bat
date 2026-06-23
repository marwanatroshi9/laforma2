@echo off
title Architecture Platform - Launcher
cd /d "%~dp0"

echo ============================================================
echo  Starting your website...
echo ============================================================
echo.
echo  [1/2] Starting backend (API)...
start "Architecture Backend" cmd /k _start_backend.bat

echo  [2/2] Starting website...
start "Architecture Frontend" cmd /k _start_frontend.bat

echo.
echo  Waiting for the website to be ready (this can take up to a
echo  minute the first time)...

set /a tries=0
:waitloop
set /a tries+=1
if %tries% gtr 90 goto opennow
timeout /t 2 /nobreak >nul
curl -s -o nul http://localhost:3000 >nul 2>&1
if errorlevel 1 goto waitloop

:opennow
echo.
echo  Opening your website in the browser...
start http://localhost:3000

echo.
echo ============================================================
echo  Website:  http://localhost:3000
echo  Admin:    http://localhost:3000/admin
echo  Login:    admin@studio.com  /  admin1234
echo.
echo  TWO windows opened (Backend + Frontend) - keep them open
echo  while you use the site. To STOP, close those two windows.
echo ============================================================
echo.
pause
