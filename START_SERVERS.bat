@echo off
REM Script de démarrage des serveurs RYD Planner
REM Double-clic pour lancer Backend + Frontend

color 0A
title RYD Planner - Démarrage des serveurs

cls
echo.
echo ===============================================
echo     RYD Planner - Démarrage des serveurs
echo ===============================================
echo.
echo Arrêt des anciens processus Node...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak

echo.
echo Démarrage du Backend (API)...
cd /d "%~dp0backend"
start "RYD Backend - API Server" cmd /k node server.js

timeout /t 3 /nobreak

echo.
echo Démarrage du Frontend (React)...
cd /d "%~dp0fronted"
start "RYD Frontend - React Dev Server" cmd /k npm run dev

echo.
echo ===============================================
echo     ✓ Les deux serveurs sont en cours de démarrage!
echo ===============================================
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:3000
echo.
echo Réseau LAN:
echo http://192.168.1.101:5173
echo.
echo Ferme cette fenêtre pour continuer...
echo.
pause
