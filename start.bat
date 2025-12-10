@echo off
REM Script de démarrage rapide pour Mission Planner Pro

echo.
echo 🚀 Démarrage de Mission Planner Pro...
echo.

REM Backend
echo 📦 Installation backend...
cd backend
call npm install
echo ✓ Backend installé
echo.

echo 💾 Initialisation base de données...
call npm run init-db
echo ✓ Base de données créée
echo.

echo 🔌 Démarrage du serveur API...
start "Mission Planner - API" cmd /k npm start
timeout /t 2
echo ✓ Serveur API démarré sur http://localhost:3000
echo.

REM Frontend
cd ..\fronted
echo 📦 Installation frontend...
call npm install
echo ✓ Frontend installé
echo.

echo 🎨 Démarrage du développement...
echo.
echo ✨ Application disponible sur http://localhost:5173
echo.

call npm run dev

pause
