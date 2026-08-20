@echo off
title CMFlow - Serveur Local
echo ===================================================
echo   Lancement de CMFlow sur http://localhost:8080/
echo ===================================================
echo.
start http://localhost:8080/
powershell -ExecutionPolicy Bypass -File .\serveur.ps1
pause
