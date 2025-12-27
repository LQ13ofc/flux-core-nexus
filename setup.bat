@echo off
:: Solicita Admin
net session >nul 2>&1
if %errorLevel% neq 0 (
    powershell -Command "Start-Process '%0' -Verb RunAs"
    exit /b
)

:: FORÇA O TERMINAL A IR PARA A PASTA DO SCRIPT
cd /d "%~dp0"

title FLUX CORE NEXUS - REPARO FINAL
echo =====================================================
echo    CORRECAO DE AMBIENTE - NEXUS v4.0
echo =====================================================

echo [1/2] Rodando instalador de dependencias...
powershell -File "install_env.ps1"

echo.
echo [2/2] Instalando pacotes do projeto...
:: Aqui ele ja estara na pasta correta, nao no System32
call npm install

echo.
echo =====================================================
echo    PROCESSO FINALIZADO!
echo =====================================================
pause
