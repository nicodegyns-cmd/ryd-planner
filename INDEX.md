# 📚 Index des Fichiers et Documentation

## 📖 Commencez par Ici

Si vous êtes nouveau, lisez dans cet ordre:

1. **START HERE** → `README.md` (Vue d'ensemble)
2. **Getting Started** → `GUIDE_DEMARRAGE.md` (Comment commencer)
3. **Example** → `EXEMPLE_UTILISATION.md` (Cas réel)
4. **Questions** → `FAQ.md` (Réponses rapides)

---

## 📚 Documentation Complète

### Documentation Générale
| Fichier | Contenu | Pour Qui |
|---------|---------|----------|
| **README.md** | Vue complète du projet | Tous |
| **GUIDE_DEMARRAGE.md** | Getting started étape-à-étape | Débutants |
| **EXEMPLE_UTILISATION.md** | Scénario complet réaliste | Utilisateurs |
| **FAQ.md** | Questions & réponses | Tous |
| **RESUME_IMPLEMENTATION.md** | Ce qui a été fait | Développeurs |
| **COMMANDES_RAPIDES.md** | Commandes utiles | Développeurs |

### Documentation Technique
| Fichier | Contenu | Pour Qui |
|---------|---------|----------|
| **BASE_DONNEES.md** | Schéma SQLite & relations | Développeurs |
| **INDEX.md** | Ce fichier | Navigation |

---

## 🗂️ Structure du Projet

```
mission-planner/
│
├── 📄 Documentation (LISEZ-MOI)
│   ├── README.md                    ← LIRE EN PREMIER
│   ├── GUIDE_DEMARRAGE.md           ← Puis ça
│   ├── EXEMPLE_UTILISATION.md       ← Puis ça
│   ├── FAQ.md                       ← Questions?
│   ├── RESUME_IMPLEMENTATION.md     ← Pour devs
│   ├── COMMANDES_RAPIDES.md         ← Commandes
│   ├── BASE_DONNEES.md              ← Schema DB
│   └── INDEX.md                     ← Ce fichier
│
├── 🚀 Scripts de Démarrage
│   ├── start.bat                    ← Windows (double-clic)
│   └── start.sh                     ← Linux/Mac
│
├── 📦 Backend (Node.js/Express)
│   ├── server.js                    ← API principale
│   ├── init_db.js                   ← Initialisation BD
│   ├── package.json                 ← Dépendances
│   ├── .env.example                 ← Config d'exemple
│   ├── data.db                      ← Base SQLite (créée auto)
│   └── archives/                    ← PDFs générés (créé auto)
│
└── 🎨 Frontend (React/Vite)
    ├── src/
    │   ├── App.jsx                  ← Composant principal
    │   ├── main.jsx                 ← Entry point
    │   ├── index.css                ← Styles globaux
    │   └── components/
    │       ├── CallForm.jsx         ← 📞 Appel entrant
    │       ├── Missions.jsx         ← 📋 Missions
    │       ├── Teams.jsx            ← 👥 Équipes
    │       ├── Clients.jsx          ← 👤 Clients
    │       └── Vehicles.jsx         ← 🚙 Véhicules
    ├── package.json                 ← Dépendances
    ├── vite.config.js               ← Config Vite
    ├── tailwind.config.cjs          ← Config Tailwind
    ├── postcss.config.cjs           ← Config PostCSS
    └── .env.example                 ← Config d'exemple
```

---

## 🎯 Guide de Lecture par Profil

### 👤 Utilisateur Final (Non-technique)
Lire dans cet ordre:
1. `README.md` - Comprendre ce que c'est
2. `GUIDE_DEMARRAGE.md` - Comment ça marche
3. `EXEMPLE_UTILISATION.md` - Voir un exemple
4. `FAQ.md` - Questions fréquentes

**Temps total:** 30 minutes

---

### 👨‍💻 Développeur (Veut comprendre le code)
Lire dans cet ordre:
1. `README.md` - Vue ensemble
2. `RESUME_IMPLEMENTATION.md` - Ce qui a été fait
3. `BASE_DONNEES.md` - Schéma DB
4. `backend/server.js` - API code
5. `fronted/src/App.jsx` - React code
6. `COMMANDES_RAPIDES.md` - Commandes utiles

**Temps total:** 1 heure

---

### 🛠️ Administrateur Système
Lire dans cet ordre:
1. `GUIDE_DEMARRAGE.md` - Installation
2. `COMMANDES_RAPIDES.md` - Commandes
3. `BASE_DONNEES.md` - Backup/Restore
4. `FAQ.md` - Troubleshooting

**Temps total:** 20 minutes

---

### 🔧 DevOps (Veut déployer)
Lire dans cet ordre:
1. `README.md` - Comprendre l'archi
2. `RESUME_IMPLEMENTATION.md` - Stack tech
3. `COMMANDES_RAPIDES.md` - Build/Deploy
4. `BASE_DONNEES.md` - Persistence

**Temps total:** 20 minutes

---

## 🔍 Trouver une Information Spécifique

### "Comment je..."

| Question | Fichier | Section |
|----------|---------|---------|
| ...démarre l'app? | GUIDE_DEMARRAGE.md | Démarrage |
| ...crée une mission? | EXEMPLE_UTILISATION.md | Étape 3 |
| ...génère un PDF? | EXEMPLE_UTILISATION.md | Étape 5 |
| ...ajoute un véhicule? | EXEMPLE_UTILISATION.md | Étape 2.1 |
| ...ajoute une équipe? | EXEMPLE_UTILISATION.md | Étape 2.2 |
| ...répare un bug? | COMMANDES_RAPIDES.md | Troubleshooting |
| ...backup mes données? | COMMANDES_RAPIDES.md | Maintenance |
| ...comprends la BD? | BASE_DONNEES.md | Tables |
| ...utilise l'API? | COMMANDES_RAPIDES.md | Testes manuels |
| ...déploie en prod? | COMMANDES_RAPIDES.md | Production |

---

## 📊 Statistiques du Projet

**Fichiers créés/modifiés:**
- ✅ 7 fichiers de documentation
- ✅ 2 scripts de démarrage
- ✅ 1 backend Node.js complet
- ✅ 1 frontend React complet
- ✅ Total: ~10 fichiers

**Lignes de code:**
- Backend: ~350 lignes (server.js + init_db.js)
- Frontend: ~800 lignes (composants React)
- Total: ~1150 lignes

**Dépendances backend:**
- express, cors, body-parser, sqlite3, pdfkit

**Dépendances frontend:**
- react, react-dom, vite, tailwind, postcss

---

## 🎓 Points Clés à Retenir

### Architecture
```
Frontend (React) ←→ Backend API ←→ SQLite Database
```

### Flux Utilisateur
```
Appel Entrant → Créer Mission → Générer PDF → Archiver → Terminer
```

### Données Principales
```
Clients → Missions ← Véhicules
              ↓
           Équipes
```

### Fichiers Importants
```
Frontend:  App.jsx + CallForm.jsx + Missions.jsx
Backend:   server.js + init_db.js
Database:  data.db + archives/
```

---

## 🚀 Commandes Essentielles

### Démarrer
```bash
# Windows
start.bat

# Linux/Mac
./start.sh
```

### Développement
```bash
# Terminal 1 - Backend
cd backend && npm start

# Terminal 2 - Frontend
cd fronted && npm run dev
```

### Maintenance
```bash
# Réinitialiser DB
cd backend && npm run init-db

# Builder pour production
cd fronted && npm run build
```

---

## 📞 Guide Rapide des Composants React

| Composant | Fichier | Fonction |
|-----------|---------|----------|
| **App** | App.jsx | Navigation principale |
| **CallForm** | CallForm.jsx | 📞 Recevoir appel |
| **Missions** | Missions.jsx | 📋 Gérer missions |
| **Teams** | Teams.jsx | 👥 Gérer équipes |
| **Clients** | Clients.jsx | 👤 Gérer clients |
| **Vehicles** | Vehicles.jsx | 🚙 Gérer véhicules |

---

## 🔌 Guide Rapide de l'API

| Méthode | Route | Faire |
|---------|-------|-------|
| **GET** | /api/clients | Liste clients |
| **POST** | /api/clients | Ajouter client |
| **GET** | /api/vehicules | Liste véhicules |
| **POST** | /api/vehicules | Ajouter véhicule |
| **GET** | /api/equipes | Liste équipes |
| **POST** | /api/equipes | Ajouter équipe |
| **GET** | /api/missions | Liste missions |
| **POST** | /api/missions | Créer mission |
| **PUT** | /api/missions/:id/status | Changer statut |
| **POST** | /api/missions/:id/generer-pdf | Générer PDF |

---

## 💾 Guide Rapide de la Base de Données

| Table | Colonnes | Clé |
|-------|----------|-----|
| **clients** | id, nom, prenom, telephone, email | id |
| **vehicules** | id, marque, modele, immatriculation, statut | id |
| **equipes** | id, nom, chauffeur_principal, contact | id |
| **missions** | id, client_id, vehicule_id, equipe_id, lieu_depart, lieu_arrivee, heure_depart, heure_arrivee, notes, statut, date_creation, pdf_path | id |

---

## 🎯 Prochaines Lectures

Une fois familiarisé, explorez:

- **Modification UI**: Regardez Tailwind classes dans `fronted/src/components/`
- **Modification API**: Regardez Express routes dans `backend/server.js`
- **Modification BD**: Regardez SQL dans `backend/init_db.js`
- **Déploiement**: Regardez guide de production sur leur site respectif

---

## 📝 Notes

- ✅ Vous pouvez modifier n'importe quel fichier
- ✅ Faites des backups réguliers de `backend/data.db`
- ✅ Gardez `backend/archives/` propre (supprimez anciens PDFs)
- ✅ Mettez à jour npm dependencies régulièrement: `npm update`

---

## 🆘 En Cas de Doute

1. Vérifier que backend fonctionne: `http://localhost:3000/api/missions`
2. Vérifier que frontend démarre: `http://localhost:5173`
3. Vérifier les logs dans les terminaux
4. Consulter `FAQ.md`
5. Consulter `COMMANDES_RAPIDES.md` → Troubleshooting

---

**Bon courage dans votre utilisation !** 🚀

*Dernier update: 2 décembre 2024*
*Mission Planner Pro v1.0*
