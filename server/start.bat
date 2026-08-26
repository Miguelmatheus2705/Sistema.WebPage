@echo off
title Pericia Cantareli - Servidor ONLINE
color 0A
echo.
echo ============================================
echo   PERICIA CANTARELI - SERVIDOR
echo ============================================
echo.

cd /d "%~dp0"

:: Verificar se tem dominio salvo
if not exist "%~dp0\domain.txt" (
    echo [!] Dominio nao configurado! Execute install.bat primeiro.
    pause
    exit /b 1
)

set /p DOMAIN=<"%~dp0\domain.txt"
echo [*] Dominio: %DOMAIN%
echo.

:: Iniciar servidor
echo [*] Iniciando servidor local...
start "Servidor Local" cmd /c "node server.js"
timeout /t 2 /nobreak >nul

:: Criar tunnel se nao existe
echo [*] Verificando tunnel...
"%~dp0\cloudflared.exe" tunnel list | findstr "pericia-cantareli" >nul 2>&1
if %errorlevel% neq 0 (
    echo [*] Criando tunnel...
    "%~dp0\cloudflared.exe" tunnel create pericia-cantareli
)

:: Roteamento DNS
echo [*] Configurando DNS...
"%~dp0\cloudflared.exe" tunnel route dns pericia-cantareli %DOMAIN% >nul 2>&1

:: Iniciar tunnel
echo.
echo ============================================
echo   SITE ATIVO EM: https://%DOMAIN%
echo ============================================
echo.
echo   Mantenha esta janela aberta!
echo   Para fechar, pressione Ctrl+C
echo.
"%~dp0\cloudflared.exe" tunnel run --config "%~dp0\config-tunnel.yml" pericia-cantareli

pause
