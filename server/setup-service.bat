@echo off
title Configurar Inicio Automatico
color 0B
echo.
echo ============================================
echo   CONFIGURAR INICIO AUTOMATICO
echo ============================================
echo.
echo   Isso vai criar um servico do Windows que
echo   inicia automaticamente quando o PC ligar.
echo   Precisa de permissao de ADMINISTRADOR.
echo.

:: Verificar admin
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo   [!] Executando como administrador...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

cd /d "%~dp0"

:: Criar script PowerShell para o servico
echo [1/3] Criando script do servico...

(
echo $projectPath = '%~dp0'
echo $nodePath = where.exe node 2^>nul
echo if ^(-not $nodePath^) { $nodePath = 'C:\Program Files\nodejs\node.exe' }
echo.
echo $action = New-ScheduledTaskAction -Execute $nodePath -Argument 'server.js' -WorkingDirectory $projectPath
echo $trigger = New-ScheduledTaskTrigger -AtStartup
echo $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -RestartCount 3 -RestartInterval ^(New-TimeSpan -Minutes 1^)
echo $principal = New-ScheduledTaskPrincipal -UserId 'SYSTEM' -LogonType ServiceAccount -RunLevel Highest
echo.
echo Register-ScheduledTask -TaskName 'SistemaCadastroServer' -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Force -Description 'Servidor Sistema Cadastro WhatsApp'
) > "%~dp0\create-task.ps1"

echo [2/3] Registrando tarefa agendada...
powershell -ExecutionPolicy Bypass -File "%~dp0\create-task.ps1"

echo [3/3] Iniciando o servico agora...
schtasks /run /tn "SistemaCadastroServer" >nul 2>&1

echo.
echo ============================================
echo   CONFIGURADO COM SUCESSO!
echo ============================================
echo.
echo   O servidor ira iniciar automaticamente
echo   toda vez que o PC ligar.
echo.
echo   Para verificar: taskschd.msc
echo   Para remover: schtasks /delete /tn "SistemaCadastroServer" /f
echo.
pause
