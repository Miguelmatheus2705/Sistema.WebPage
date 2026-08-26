@echo off
title Instalador - Pericia Cantareli Server
color 0B
echo.
echo ============================================
echo   INSTALADOR - PERICIA CANTARELI
echo ============================================
echo.

:: Verificar Node.js
echo [1/6] Verificando Node.js...
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
echo [2/6] Verificando npm...
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
echo [3/6] Instalando dependencias do servidor...
cd /d "%~dp0"
call npm install
echo     Dependencias instaladas!
echo.

:: Verificar/Instalar Cloudflare Tunnel
echo [4/6] Verificando Cloudflare Tunnel...
if not exist "%~dp0\cloudflared.exe" (
    echo     Baixando Cloudflare Tunnel...
    powershell -Command "Invoke-WebRequest -Uri 'https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe' -OutFile '%~dp0\cloudflared.exe'"
    echo     Cloudflare Tunnel baixado!
) else (
    echo     Cloudflare Tunnel encontrado.
)
echo.

:: Login no Cloudflare
echo [5/6] Login no Cloudflare...
echo.
echo   ╔══════════════════════════════════════════════╗
echo   ║  IMPORTANTE: Voce precisa de uma conta       ║
echo   ║  gratuita no Cloudflare e um dominio.        ║
echo   ║                                               ║
echo   ║  Se nao tem conta, crie em:                   ║
echo   ║  https://dash.cloudflare.com/sign-up          ║
echo   ║                                               ║
echo   ║  Se ja tem, faça login quando o navegador     ║
echo   ║  abrir abaixo.                                ║
echo   ╚══════════════════════════════════════════════╝
echo.
"%~dp0\cloudflared.exe" tunnel login
echo.

:: Perguntar dominio
echo [6/6] Configurando dominio personalizado...
echo.
set /p DOMAIN="Digite seu dominio (ex: periciacantareli.com.br): "
echo.

:: Criar arquivo de configuracao do tunnel
echo Criando configuracao do tunnel...

(
echo tunnel: 
echo credentials-file: %USERPROFILE%\.cloudflared\credentials.json
echo.
echo ingress:
echo   - hostname: %DOMAIN%
echo     service: http://localhost:3000
echo     originRequest:
echo       noTLSVerify: true
echo   - service: http_status:404
) > "%~dp0\config-tunnel.yml"

echo.
echo ============================================
echo   INSTALACAO CONCLUIDA!
echo ============================================
echo.
echo   Dominio configurado: %DOMAIN%
echo.
echo   Proximos passos:
echo   1. Execute: start.bat
echo   2. O site estara em: https://%DOMAIN%
echo   3. Para inicio automatico: setup-service.bat
echo.
echo   Salve este dominio! Voce precisara dele.
echo.
echo %DOMAIN% > "%~dp0\domain.txt"
pause
