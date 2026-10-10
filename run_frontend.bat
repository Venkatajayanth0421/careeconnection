@echo off
echo ==========================================================
echo    Starting CareerConnect - React Frontend
echo ==========================================================
cd /d "%~dp0career-connect-frontend"
echo Starting Vite dev server on http://localhost:5173 ...
call npm run dev
pause
