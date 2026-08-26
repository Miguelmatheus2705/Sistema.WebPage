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

echo   Criando servico para inicio automatico...
echo.

:: Criar script PowerShell
(
echo $projectPath = '%~dp0'
echo $nodePath = where.exe node 2^>nul
echo if ^(-not $nodePath^) { $nodePath = 'C:\Program Files\nodejs\node.exe' }
echo.
echo $cloudflared = "$projectPath\cloudflared.exe"
echo if ^(-not ^(Test-Path $cloudflared^)^) { $cloudflared = 'cloudflared' }
echo.
echo $domainFile = "$projectPath\domain.txt"
echo $hasDomain = Test-Path $domainFile
echo.
echo if ^($hasDomain^) {
echo     $domain = Get-Content $domainFile
echo     $action2 = New-ScheduledTaskAction -Execute $cloudflared -Argument "tunnel run --config `"$projectPath\config-tunnel.yml`" pericia-cantareli" -WorkingDirectory $projectPath
echo } else {
echo     $action2 = New-ScheduledTaskAction -Execute $cloudflared -Argument "--url http://localhost:3000" -WorkingDirectory $projectPath
echo }
echo.
echo $action1 = New-ScheduledTaskAction -Execute $nodePath -Argument 'server.js' -WorkingDirectory $projectPath
echo $trigger = New-ScheduledTaskTrigger -AtStartup
echo $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -RestartCount 3 -RestartInterval ^(New-TimeSpan -Minutes 1^)
echo $principal = New-ScheduledTaskPrincipal -UserId 'SYSTEM' -LogonType ServiceAccount -RunLevel Highest
echo.
echo Register-ScheduledTask -TaskName 'PericiaCantareli-Server' -Action $action1 -Trigger $trigger -Settings $settings -Principal $principal -Force -Description 'Servidor Pericia Cantareli'
echo Register-ScheduledTask -TaskName 'PericiaCantareli-Tunnel' -Action $action2 -Trigger $trigger -Settings $settings -Principal $principal -Force -Description 'Tunnel Pericia Cantareli'
) > "%~dp0\create-service.ps1"

powershell -ExecutionPolicy Bypass -File "%~dp0\create-service.ps1"

echo.
echo   Iniciando servicos agora...
schtasks /run /tn "PericiaCantareli-Server" >nul 2>&1
schtasks /run /tn "PericiaCantareli-Tunnel" >nul 2>&1

echo.
echo ============================================
echo   CONFIGURADO COM SUCESSO!
echo ============================================
echo.
echo   O servidor + tunnel vao iniciar sozinhos
echo   toda vez que o PC ligar.
echo.
echo   Para remover, abra CMD como Admin:
echo     schtasks /delete /tn "PericiaCantareli-Server" /f
echo     schtasks /delete /tn "PericiaCantareli-Tunnel" /f
echo.
pause
