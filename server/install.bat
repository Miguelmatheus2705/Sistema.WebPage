@echo off
title Instalador - Pericia Cantareli Server
color 0B
echo.
echo ============================================
echo   INSTALADOR - PERICIA CANTARELI
echo ============================================
echo.

cd /d "%~dp0"

:: Verificar Node.js
echo [1/4] Verificando Node.js...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo     Node.js nao encontrado! Baixando...
    powershell -Command "Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.11.0/node-v20.11.0-x64.msi' -OutFile '%TEMP%\node-install.msi'"
    echo     Instalando Node.js...
    msiexec /i "%TEMP%\node-install.msi" /quiet
    timeout /t 30 /nobreak >nul
    echo     Node.js instalado!
) else (
    echo     Node.js encontrado:
    node -v
)
echo.

:: Verificar npm
echo [2/4] Verificando npm...
npm -v >nul 2>&1
if %errorlevel% neq 0 (
    echo     ERRO: npm nao encontrado.
    pause
    exit /b 1
)
echo     npm encontrado:
npm -v
echo.

:: Instalar dependencias
echo [3/4] Instalando dependencias do servidor...
call npm install
echo     Dependencias instaladas!
echo.

:: Baixar Cloudflare Tunnel
echo [4/4] Verificando Cloudflare Tunnel...
if not exist "%~dp0\cloudflared.exe" (
    echo     Baixando Cloudflare Tunnel...
    powershell -Command "Invoke-WebRequest -Uri 'https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe' -OutFile '%~dp0\cloudflared.exe'"
    echo     Cloudflare Tunnel baixado!
) else (
    echo     Cloudflare Tunnel encontrado.
)
echo.

echo ============================================
echo   INSTALACAO CONCLUIDA!
echo ============================================
echo.
echo   Para iniciar o servidor, execute:
echo     start.bat
echo.
echo   Para inicio automatico, execute:
echo     setup-service.bat
echo.
pause
