@echo off
title Reset Admin Password
cd /d "%~dp0backend"
set DATABASE_URL=sqlite:///./dev.db

echo ============================================================
echo  Reset Admin Password (lockout recovery)
echo ============================================================
echo.
echo  Use this if you forgot your admin password.
echo  Make sure the website is NOT running, then follow the prompts.
echo.

.venv\Scripts\python reset_password.py

echo.
echo ============================================================
pause
