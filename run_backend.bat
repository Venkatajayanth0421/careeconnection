@echo off
echo ==========================================================
echo    Starting CareerConnect - Spring Boot Backend
echo ==========================================================
cd /d "%~dp0career-connect-backend"
echo Checking Maven...
mvn -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [NOTE] 'mvn' command was not found in system PATH.
    echo Please install Apache Maven or open the backend folder in
    echo IntelliJ IDEA, Eclipse, or VS Code and click 'Run JobPortalApplication'.
    pause
    exit /b 1
)

echo Compiling and running Spring Boot application...
mvn spring-boot:run
pause
