# ⚡ Commandes Rapides

## 🚀 Démarrage

### Windows
```bash
# Automatisé (Recommandé)
cd c:\Users\nicod\OneDrive\Bureau\mission-planner
start.bat

# Manuel (2 terminaux)
# Terminal 1:
cd backend && npm install && npm run init-db && npm start

# Terminal 2:
cd fronted && npm install && npm run dev
```

### Linux/Mac
```bash
# Automatisé
cd ~/Bureau/mission-planner
chmod +x start.sh
./start.sh

# Manuel
cd backend && npm install && npm run init-db && npm start &
cd fronted && npm install && npm run dev
```

---

## 🧹 Nettoyage & Maintenance

### Réinitialiser la base de données
```bash
cd backend
rm data.db
npm run init-db
```

### Sauvegarder les PDFs archivés
```bash
# Windows
robocopy backend\archives archives_backup /E

# Linux/Mac
cp -r backend/archives archives_backup
```

### Supprimer les vieux PDFs
```bash
# Windows
del backend\archives\*

# Linux/Mac
rm backend/archives/*
```

---

## 🔍 Vérification

### Est-ce que ça marche ?

1. **Backend est actif ?**
   - Ouvrir: `http://localhost:3000/api/missions`
   - Doit retourner du JSON (même vide `[]`)

2. **Frontend démarre ?**
   - Ouvrir: `http://localhost:5173`
   - Doit voir l'interface

3. **PDFs générés ?**
   - Vérifier: `backend/archives/`
   - Doit voir des fichiers `.pdf`

---

## 🐛 Dépannage Rapide

### "Port 3000 déjà utilisé"
```bash
# Trouver ce qui utilise le port
# Windows
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :3000

# Tuer le processus
# Windows
taskkill /PID [PID] /F

# Linux/Mac
kill -9 [PID]
```

### "Module not found"
```bash
cd backend && npm install
cd ../fronted && npm install
```

### "Base de données vide"
```bash
cd backend && npm run init-db
```

### "Frontend ne voit pas le backend"
1. Vérifier que backend est démarré: `npm start` dans terminal
2. Vérifier CORS: voir `backend/server.js` (c'est OK par défaut)
3. Vérifier que port 3000 est libre

---

## 🎯 Tests Manuels

### Créer un test complet

**1. Ajouter un client:**
```bash
curl -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -d '{"nom":"Test","prenom":"Client","telephone":"0123456789","email":"test@test.com"}'
```

**2. Ajouter un véhicule:**
```bash
curl -X POST http://localhost:3000/api/vehicules \
  -H "Content-Type: application/json" \
  -d '{"marque":"Renault","modele":"Espace","immatriculation":"ABC-123"}'
```

**3. Ajouter une équipe:**
```bash
curl -X POST http://localhost:3000/api/equipes \
  -H "Content-Type: application/json" \
  -d '{"nom":"Équipe Test","chauffeur_principal":"Jean","contact":"0987654321"}'
```

**4. Créer une mission:**
```bash
curl -X POST http://localhost:3000/api/missions \
  -H "Content-Type: application/json" \
  -d '{
    "client_id":1,
    "vehicule_id":1,
    "equipe_id":1,
    "lieu_depart":"Paris",
    "lieu_arrivee":"Lyon",
    "heure_depart":"10:00",
    "heure_arrivee":"12:00",
    "notes":"Test"
  }'
```

**5. Générer un PDF:**
```bash
curl -X POST http://localhost:3000/api/missions/1/generer-pdf
```

**6. Vérifier le PDF:**
- Ouvrir: `http://localhost:3000/archives/mission_1_*.pdf`

---

## 📊 Vérifier les données

### Tous les clients
```bash
curl http://localhost:3000/api/clients
```

### Toutes les missions
```bash
curl http://localhost:3000/api/missions
```

### Tous les véhicules
```bash
curl http://localhost:3000/api/vehicules
```

### Toutes les équipes
```bash
curl http://localhost:3000/api/equipes
```

---

## 🔄 Mettre à jour un statut

### Marquer une mission "en cours"
```bash
curl -X PUT http://localhost:3000/api/missions/1/status \
  -H "Content-Type: application/json" \
  -d '{"statut":"en cours"}'
```

### Marquer une mission "terminée"
```bash
curl -X PUT http://localhost:3000/api/missions/1/status \
  -H "Content-Type: application/json" \
  -d '{"statut":"terminée"}'
```

---

## 📦 Production

### Build pour production

**Frontend:**
```bash
cd fronted
npm run build
# Résultat dans dist/
```

**Backend:**
```bash
# Juste lancer avec node
node backend/server.js
```

### Deploy Backend (simple)
```bash
# Sur serveur distant
scp -r backend/ user@server:/app/
ssh user@server "cd /app/backend && npm install && npm start"
```

### Deploy Frontend (simple)
```bash
# Générer
npm run build

# Upload dist/ sur hébergement/CDN
# Configurer VITE_API_URL vers backend distant
```

---

## 🆘 Aide Rapide

| Problème | Solution |
|----------|----------|
| "Cannot find module" | `npm install` dans le dossier |
| "Port already in use" | Changer port dans server.js |
| "Database locked" | Arrêter backend et relancer |
| "CORS error" | Vérifier cors config (OK par défaut) |
| "PDF not generated" | Vérifier dossier archives existe |
| "Mission not showing" | Refresh page (F5) |
| "Equipe not assigned" | Vérifier equipes créées d'abord |
| "Vehicle not available" | Marquer comme "disponible" |

---

## 📞 Support Rapide

**Les logs vous disent tout:**

**Terminal Backend - Erreur DB:**
```
Error: SQLITE_CANTOPEN: unable to open database file
→ Vérifier permissions dossier backend/
→ Ou run: npm run init-db
```

**Terminal Backend - Port occupé:**
```
Error: listen EADDRINUSE :::3000
→ Port 3000 déjà utilisé
→ Changer port dans server.js ligne: const PORT
```

**Terminal Frontend - Connexion:**
```
GET http://localhost:3000/api/missions 404
→ Backend pas démarré
→ Ou port wrong dans src/components
```

---

## ⌨️ Raccourcis Utiles

```bash
# Créer une base test rapidement
cd backend && npm run init-db

# Voir les process en cours
# Windows: tasklist
# Linux: ps aux | grep node

# Arrêter tous les node processes
# Windows: taskkill /IM node.exe /F
# Linux: pkill -f node

# Voir les logs en temps réel
# Backend: npm start (visible directement)
# Frontend: npm run dev (visible directement)
```

---

## 🎯 Checklist Santé du Système

```
□ Backend démarre sans erreur
□ Frontend accessible sur http://localhost:5173
□ API répond sur http://localhost:3000/api/clients
□ Base de données créée (backend/data.db existe)
□ Dossier archives créé (backend/archives/ existe)
□ Au moins 1 client en base
□ Au moins 1 véhicule en base
□ Au moins 1 équipe en base
□ Pouvoir créer une mission
□ Pouvoir générer un PDF
□ PDF téléchargeable
```

Si tout ✓ → Vous êtes prêt ! 🚀

---

**Besoin d'aide ? Consultez README.md ou GUIDE_DEMARRAGE.md** 📖
