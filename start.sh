#!/bin/bash
# Script de démarrage rapide pour Mission Planner Pro

echo "🚀 Démarrage de Mission Planner Pro..."
echo ""

# Backend
echo "📦 Installation backend..."
cd backend
npm install
echo "✓ Backend installé"
echo ""

echo "💾 Initialisation base de données..."
npm run init-db
echo "✓ Base de données créée"
echo ""

echo "🔌 Démarrage du serveur API..."
npm start &
BACKEND_PID=$!
sleep 2
echo "✓ Serveur API démarré (PID: $BACKEND_PID) sur http://localhost:3000"
echo ""

# Frontend
cd ../fronted
echo "📦 Installation frontend..."
npm install
echo "✓ Frontend installé"
echo ""

echo "🎨 Démarrage du développement..."
echo ""
echo "✨ Application disponible sur http://localhost:5173"
echo ""
echo "Pour arrêter: Ctrl+C"
echo ""

npm run dev

# Cleanup
kill $BACKEND_PID 2>/dev/null
