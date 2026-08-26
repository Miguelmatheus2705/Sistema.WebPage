@echo off
title Configurar Inicio Automatico - Pericia Cantareli
color 0B
echo.
echo ============================================
echo   CONFIGURAR INICIO AUTOMATICO
echo ============================================
echo.

net session >nul 2>&1
if %errorlevel% neq 0 (
    echo   Executando como administrador...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

cd /d "%~dp0"

if not exist "%~dp0\domain.txt" (
    echo   [!] Dominio nao configurado! Execute install.bat primeiro.
    pause
    exit /b 1
)

set /p DOMAIN=<"%~dp0\domain.txt"

echo   Criando servico para: %DOMAIN%
echo.

:: Criar script PowerShell
(
echo $projectPath = '%~dp0'
echo $nodePath = where.exe node 2^>nul
echo if ^(-not $nodePath^) { $nodePath = 'C:\Program Files\nodejs\node.exe' }
echo.
echo $action1 = New-ScheduledTaskAction -Execute $nodePath -Argument 'server.js' -WorkingDirectory $projectPath
echo $action2 = New-ScheduledTaskAction -Execute "$projectPath\cloudflared.exe" -Argument "tunnel run --config `"$projectPath\config-tunnel.yml`" pericia-cantareli" -WorkingDirectory $projectPath
echo $trigger = New-ScheduledTaskTrigger -AtStartup
echo $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -RestartCount 3 -RestartInterval ^(New-TimeSpan -Minutes 1^)
echo $principal = New-ScheduledTaskPrincipal -UserId 'SYSTEM' -LogonType ServiceAccount -RunLevel Highest
echo.
echo Register-ScheduledTask -TaskName 'PericiaCantareli-Server' -Action $action1 -Trigger $trigger -Settings $settings -Principal $principal -Force -Description 'Servidor Pericia Cantareli'
echo Register-ScheduledTask -TaskName 'PericiaCantareli-Tunnel' -Action $action2 -Trigger $trigger -Settings $settings -Principal $principal -Force -Description 'Tunnel Pericia Cantareli'
) > "%~dp0\create-service.ps1"

powershell -ExecutionPolicy Bypass -File "%~dp0\create-service.ps1"

echo.
echo   Iniciando servicos...
schtasks /run /tn "PericiaCantareli-Server" >nul 2>&1
schtasks /run /tn "PericiaCantareli-Tunnel" >nul 2>&1

echo.
echo ============================================
echo   CONFIGURADO COM SUCESSO!
echo ============================================
echo.
echo   O servidor + tunnel vao iniciar automaticamente.
echo   Site: https://%DOMAIN%
echo.
echo   Verificar tarefas: taskschd.msc
echo   Remover:
echo     schtasks /delete /tn "PericiaCantareli-Server" /f
echo     schtasks /delete /tn "PericiaCantareli-Tunnel" /f
echo.
pause
