@echo off
title Pericia Cantareli - Servidor ONLINE
color 0A
echo.
echo ============================================
echo   PERICIA CANTARELI - SERVIDOR
echo ============================================
echo.

cd /d "%~dp0"

:: Iniciar servidor
echo [*] Iniciando servidor local na porta 3000...
start "Servidor Local" cmd /c "node server.js"
timeout /t 2 /nobreak >nul
echo     Servidor OK!
echo.

:: Verificar se tem dominio salvo
if exist "%~dp0\domain.txt" (
    set /p DOMAIN=<"%~dp0\domain.txt"
    echo [*] Dominio personalizado encontrado: !DOMAIN!
    echo [*] Iniciando tunnel com dominio...
    if exist "%~dp0\config-tunnel.yml" (
        "%~dp0\cloudflared.exe" tunnel run --config "%~dp0\config-tunnel.yml" pericia-cantareli
    ) else (
        "%~dp0\cloudflared.exe" tunnel run --url http://localhost:3000
    )
) else (
    echo [*] Dominio pessoal: usando link automatico do Cloudflare
    echo [*] O link HTTPS aparecera abaixo:
    echo.
    echo ============================================
    echo   COPIE O LINK QUE APARECER E ABRA NO NAVEGADOR
    echo ============================================
    echo.
    if exist "%~dp0\cloudflared.exe" (
        "%~dp0\cloudflared.exe" --url http://localhost:3000
    ) else (
        cloudflared --url http://localhost:3000
    )
)

pause
