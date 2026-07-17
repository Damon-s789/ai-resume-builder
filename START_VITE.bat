@echo off
cd /d "%~dp0"
set "PATH=C:\Program Files\nodejs;%PATH%"
set "npm_config_cache=%USERPROFILE%\Desktop\npm-cache"

echo.
echo ========================================
echo   AI Resume Builder - React + Vite
echo ========================================
echo.
echo Starting at http://127.0.0.1:5173/
echo Keep this window open while using the app.
echo.

call npm.cmd run dev

echo.
echo Vite stopped. Read any message above.
pause
