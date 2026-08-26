@echo off
title Parar Servidor
echo.
echo [*] Parando servidor...
taskkill /f /fi "WINDOWTITLE eq Servidor Local" >nul 2>&1
taskkill /f /fi "WINDOWTITLE eq Sistema Cadastro Server - ONLINE" >nul 2>&1
echo [*] Servidor parado.
pause
