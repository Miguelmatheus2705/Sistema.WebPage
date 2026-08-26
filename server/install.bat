@echo off
title Instalador - Sistema Cadastro Server
color 0B
echo.
echo ============================================
echo   INSTALADOR - SISTEMA CADASTRO SERVER
echo ============================================
echo.

:: Verificar Node.js
echo [1/5] Verificando Node.js...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo     Node.js nao encontrado! Baixando...
    powershell -Command "Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.11.0/node-v20.11.0-x64.msi' -OutFile '%TEMP%\node-install.msi'"
    echo     Instalando Node.js (pode pedir permissao de admin)...
    msiexec /i "%TEMP%\node-install.msi" /quiet
    timeout /t 30 /nobreak >nul
    echo     Node.js instalado!
) else (
    echo     Node.js encontrado: 
    node -v
)
echo.

:: Verificar npm
echo [2/5] Verificando npm...
npm -v >nul 2>&1
if %errorlevel% neq 0 (
    echo     ERRO: npm nao encontrado. Reinstale o Node.js.
    pause
    exit /b 1
)
echo     npm encontrado:
npm -v
echo.

:: Instalar dependencias
echo [3/5] Instalando dependencias do servidor...
cd /d "%~dp0"
call npm install
echo     Dependencias instaladas!
echo.

:: Verificar Cloudflare Tunnel
echo [4/5] Verificando Cloudflare Tunnel...
cloudflared -v >nul 2>&1
if %errorlevel% neq 0 (
    echo     Cloudflare Tunnel nao encontrado! Baixando...
    powershell -Command "Invoke-WebRequest -Uri 'https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe' -OutFile '%~dp0\cloudflared.exe'"
    echo     Cloudflare Tunnel baixado!
) else (
    echo     Cloudflare Tunnel encontrado.
)
echo.

:: Criar atalho de inicializacao
echo [5/5] Criando script de inicializacao...
echo     Pronto!
echo.
echo ============================================
echo   INSTALACAO CONCLUIDA!
echo ============================================
echo.
echo   Para iniciar o servidor, execute:
echo     start.bat
echo.
echo   Para configurar inicio automatico, execute:
echo     setup-service.bat
echo.
pause
