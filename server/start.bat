@echo off
title Sistema Cadastro Server - ONLINE
color 0A
echo.
echo ============================================
echo   SISTEMA CADASTRO - SERVIDOR
echo ============================================
echo.

cd /d "%~dp0"

:: Iniciar servidor
echo [*] Iniciando servidor na porta 3000...
start "Servidor Local" cmd /c "node server.js"

timeout /t 2 /nobreak >nul

:: Iniciar Cloudflare Tunnel
echo [*] Iniciando Cloudflare Tunnel...
echo [*] O link publico aparecera abaixo:
echo.
if exist "%~dp0\cloudflared.exe" (
    "%~dp0\cloudflared.exe" --url http://localhost:3000
) else (
    cloudflared --url http://localhost:3000
)

pause
