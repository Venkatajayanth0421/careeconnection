@echo off
echo ==========================================================
echo    CareerConnect - Push to GitHub
echo ==========================================================
cd /d "%~dp0"
echo.
echo Remote repository: https://github.com/Venkatajayanth0421/careeconnection.git
echo Branch: main
echo.
echo Pushing commits to GitHub...
git push -u origin main
echo.
if %errorlevel% equ 0 (
    echo ==========================================================
    echo [SUCCESS] Code successfully pushed to GitHub!
    echo ==========================================================
) else (
    echo ==========================================================
    echo [NOTE] If this is your first push or authentication is required,
    echo Git Credential Manager will open a browser window to sign in.
    echo Please authenticate or verify your GitHub permissions.
    echo ==========================================================
)
pause
