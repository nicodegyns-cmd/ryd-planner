# 🗂️ Structure Complète du Projet

## 📦 Vue d'Ensemble Visuelle

```
mission-planner/
│
├─ 📋 FICHIERS ROOT
│  ├─ README.md                          [Vue d'ensemble - LIRE EN PREMIER]
│  ├─ GUIDE_DEMARRAGE.md                 [Getting started]
│  ├─ EXEMPLE_UTILISATION.md             [Cas réel complet]
│  ├─ FAQ.md                             [Questions fréquentes]
│  ├─ BASE_DONNEES.md                    [Schéma SQLite]
│  ├─ COMMANDES_RAPIDES.md               [Commandes utiles]
│  ├─ RESUME_IMPLEMENTATION.md           [Récapitulatif implémentation]
│  ├─ INDEX.md                           [Index documentation]
│  └─ FINAL.md                           [Résumé final]
│
├─ 🚀 SCRIPTS DE DÉMARRAGE
│  ├─ start.bat                          [Windows - Double-clic]
│  └─ start.sh                           [Linux/Mac - chmod +x puis ./]
│
├─ 🔌 BACKEND (Port 3000)
│  ├─ package.json                       [Dépendances Node]
│  ├─ server.js                          [🔴 API Express]
│  ├─ init_db.js                         [Initialisation BD SQLite]
│  ├─ .env.example                       [Variables d'environnement]
│  ├─ data.db                            [📊 Base SQLite - AUTO-CRÉÉE]
│  └─ archives/                          [📁 PDFs générés - AUTO-CRÉÉ]
│      ├─ mission_1_xxxxx.pdf
│      ├─ mission_2_xxxxx.pdf
│      └─ ... (PDFs générés automatiquement)
│
└─ 🎨 FRONTEND (Port 5173)
   ├─ package.json                       [Dépendances React]
   ├─ .env.example                       [Variables d'environnement]
   ├─ vite.config.js                     [Config Vite]
   ├─ tailwind.config.cjs                [Config Tailwind CSS]
   ├─ postcss.config.cjs                 [Config PostCSS]
   ├─ index.html                         [HTML principal]
   └─ src/
      ├─ main.jsx                        [Entry point React]
      ├─ index.css                       [Styles globaux]
      ├─ App.jsx                         [🔴 Composant principal]
      └─ components/
         ├─ CallForm.jsx                 [📞 Formulaire d'appel]
         ├─ Missions.jsx                 [📋 Gestion missions]
         ├─ Teams.jsx                    [👥 Gestion équipes]
         ├─ Clients.jsx                  [👤 Gestion clients]
         └─ Vehicles.jsx                 [🚙 Gestion véhicules]
```

---

## 🔄 Architecture Générale

```
┌─────────────────────────────────────────────────────────────┐
│                      NAVIGATEUR WEB                         │
│  http://localhost:5173                                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │          FRONTEND (React + Tailwind)                 │   │
│  │  ┌──────────────┐  ┌──────────────────────────┐      │   │
│  │  │  Navigation  │  │  Pages principales       │      │   │
│  │  ├─ 📞 Appel    │  ├─ CallForm.jsx            │      │   │
│  │  ├─ 📋 Missions │  ├─ Missions.jsx            │      │   │
│  │  ├─ 👥 Équipes  │  ├─ Teams.jsx               │      │   │
│  │  ├─ 👤 Clients  │  ├─ Clients.jsx             │      │   │
│  │  └─ 🚙 Véhicules│  └─ Vehicles.jsx            │      │   │
│  │                 │                              │      │   │
│  │  App.jsx (Conteneur)                          │      │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬──────────────────────────────────────┘
                         │ HTTP Request/Response
                         │ JSON
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKEND (Express.js + Node)                    │
│  http://localhost:3000                                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                API Routes                            │   │
│  │  ┌─────────────┐    ┌─────────────────────┐         │   │
│  │  │ /api/missions   │    POST/GET missions     │         │
│  │  ├─────────────┤    ├─────────────────────┤         │   │
│  │  │ /api/clients    │    POST/GET clients      │         │   │
│  │  ├─────────────┤    ├─────────────────────┤         │   │
│  │  │ /api/equipes    │    POST/GET equipes      │         │   │
│  │  ├─────────────┤    ├─────────────────────┤         │   │
│  │  │ /api/vehicules  │    POST/GET/PUT vehicules      │   │
│  │  └─────────────┘    ├─────────────────────┤         │   │
│  │  /api/missions/:id/ │  PDF generation      │         │   │
│  │  generer-pdf        └─────────────────────┘         │   │
│  │                                                      │   │
│  │  server.js (Express)                               │   │
│  └──────────────────────┬───────────────────────────────┘   │
└─────────────────────────┼───────────────────────────────────┘
                         │ SQL Queries
                         │ File System
                         ▼
    ┌────────────────────────────────────────┐
    │     DONNÉES PERSISTANTES                │
    │  ┌─────────────────────────────────┐   │
    │  │ backend/data.db (SQLite)        │   │
    │  │ ├─ Table: clients               │   │
    │  │ ├─ Table: vehicules             │   │
    │  │ ├─ Table: equipes               │   │
    │  │ └─ Table: missions              │   │
    │  └─────────────────────────────────┘   │
    │  ┌─────────────────────────────────┐   │
    │  │ backend/archives/ (PDFs)        │   │
    │  │ ├─ mission_1_xxxxx.pdf          │   │
    │  │ ├─ mission_2_xxxxx.pdf          │   │
    │  │ └─ ...                          │   │
    │  └─────────────────────────────────┘   │
    └────────────────────────────────────────┘
```

---

## 📊 Flux de Données

### Création d'une Mission

```
1. Utilisateur remplit CallForm
   ↓
2. Frontend POST /api/missions
   ├─ client_id
   ├─ vehicule_id
   ├─ equipe_id
   ├─ lieu_depart
   ├─ lieu_arrivee
   ├─ heure_depart
   ├─ heure_arrivee
   └─ notes
   ↓
3. Backend reçoit et valide
   ↓
4. INSERT dans Table missions
   ↓
5. UPDATE vehicules SET statut='en mission'
   ↓
6. Retour JSON mission créée
   ↓
7. Frontend affiche confirmation
```

### Génération d'un PDF

```
1. Utilisateur clique "📄 PDF"
   ↓
2. Frontend POST /api/missions/:id/generer-pdf
   ↓
3. Backend SELECT * FROM missions (avec JOIN)
   ↓
4. PDFKit génère fichier
   ├─ Infos client
   ├─ Itinéraire
   ├─ Équipe
   ├─ Véhicule
   └─ Notes
   ↓
5. Fichier sauvegardé dans archives/
   ↓
6. Retour JSON avec fileName
   ↓
7. Frontend télécharge/ouvre PDF
```

---

## 🗂️ Détail de Chaque Dossier

### Root (mission-planner/)
```
mission-planner/
├─ README.md              → Principal, vue d'ensemble
├─ GUIDE_DEMARRAGE.md     → Getting started complet
├─ EXEMPLE_UTILISATION.md → Cas d'usage réaliste
├─ FAQ.md                 → 50+ Q&A
├─ BASE_DONNEES.md        → Schéma SQLite complet
├─ COMMANDES_RAPIDES.md   → Commandes utiles
├─ RESUME_IMPLEMENTATION.md → Ce qui a été fait
├─ INDEX.md               → Guide documentation
├─ FINAL.md               → Résumé final
├─ start.bat              → Démarrage Windows
├─ start.sh               → Démarrage Linux/Mac
├─ backend/               → API & DB
├─ fronted/               → Interface Web
└─ .git/                  → (si git)
```

### Backend (backend/)
```
backend/
├─ package.json           → Dépendances (express, cors, pdfkit, etc.)
├─ server.js              → API Express (350 lignes)
│  ├─ GET /api/clients
│  ├─ POST /api/clients
│  ├─ GET /api/vehicules
│  ├─ POST /api/vehicules
│  ├─ PUT /api/vehicules/:id/status
│  ├─ GET /api/equipes
│  ├─ POST /api/equipes
│  ├─ GET /api/missions
│  ├─ POST /api/missions
│  ├─ PUT /api/missions/:id/status
│  └─ POST /api/missions/:id/generer-pdf
├─ init_db.js             → Initialisation SQLite
│  ├─ CREATE TABLE clients
│  ├─ CREATE TABLE vehicules
│  ├─ CREATE TABLE equipes
│  └─ CREATE TABLE missions
├─ .env.example           → Variables d'environnement
├─ data.db                → 📊 Base SQLite (auto-créée)
│  └─ Fichier SQLite contenant toutes les données
├─ archives/              → 📁 PDFs générés (auto-créé)
│  ├─ mission_1_1733143200000.pdf
│  ├─ mission_2_1733143500000.pdf
│  └─ ...
└─ node_modules/          → (npm install)
   └─ Dépendances installées
```

### Frontend (fronted/src/)
```
fronted/src/
├─ main.jsx               → Entry point React
│  └─ Charge App.jsx
├─ App.jsx                → 🔴 Composant principal (400 lignes)
│  ├─ Gère navigation
│  └─ Affiche vues
├─ index.css              → Styles globaux + Tailwind
├─ components/            → Composants React
│  ├─ CallForm.jsx        → 📞 Formulaire appel (180 lignes)
│  │  ├─ Créer/sélectionner client
│  │  ├─ Saisir itinéraire
│  │  ├─ Choisir équipe/véhicule
│  │  └─ Créer mission
│  │
│  ├─ Missions.jsx        → 📋 Gestion missions (200 lignes)
│  │  ├─ Lister missions
│  │  ├─ Filtrer par statut
│  │  ├─ Changer statut
│  │  └─ Générer PDF
│  │
│  ├─ Teams.jsx           → 👥 Gestion équipes (100 lignes)
│  │  ├─ Lister équipes
│  │  └─ Créer équipe
│  │
│  ├─ Clients.jsx         → 👤 Gestion clients (existant)
│  │  ├─ Lister clients
│  │  └─ Créer client
│  │
│  └─ Vehicles.jsx        → 🚙 Gestion véhicules (existant)
│     ├─ Lister véhicules
│     └─ Créer véhicule
│
├─ package.json           → Dépendances React (react, vite, tailwind)
├─ vite.config.js         → Config Vite
├─ tailwind.config.cjs    → Config Tailwind CSS
└─ postcss.config.cjs     → Config PostCSS
```

---

## 📈 Taille & Complexité

### Lignes de Code

```
Backend:
├─ server.js          ~350 lignes
├─ init_db.js         ~50 lignes
└─ Total: ~400 lignes

Frontend:
├─ App.jsx            ~100 lignes
├─ CallForm.jsx       ~180 lignes
├─ Missions.jsx       ~200 lignes
├─ Teams.jsx          ~100 lignes
├─ Clients.jsx        ~150 lignes (existant)
└─ Total: ~730 lignes

Documentation:
├─ README.md          ~400 lignes
├─ GUIDE_DEMARRAGE.md ~300 lignes
├─ FAQ.md             ~500 lignes
├─ ...                ...
└─ Total: ~2000 lignes

GRAND TOTAL: ~3130 lignes
```

### Fichiers

```
Créés: 9
Modifiés: 6
Total: 15 fichiers
```

### Dépendances

```
Backend:
├─ express@4.18.2
├─ cors@2.8.5
├─ body-parser@1.20.2
├─ sqlite3@5.1.6
└─ pdfkit@0.13.0

Frontend:
├─ react@18.2.0
├─ react-dom@18.2.0
├─ vite@5.0.0
└─ tailwindcss@3.4.7
```

---

## 🔄 Cycle de Vie d'un Fichier

### Un PDF créé

```
1. Utilisateur crée mission
   └─ INSERT dans missions table

2. Utilisateur clique "PDF"
   └─ POST /api/missions/:id/generer-pdf

3. Backend:
   ├─ SELECT * FROM missions (avec JOIN)
   ├─ PDFKit génère document
   ├─ Sauvegarde dans archives/
   └─ UPDATE pdf_path en DB

4. Frontend reçoit fileName
   ├─ Affiche confirmation
   └─ Ouvre PDF dans navigateur

5. PDF archivé
   ├─ Reste dans archives/
   ├─ Peut être téléchargé
   └─ Peut être zippé pour backup
```

---

## 🎯 Points de Connexion Clés

### Frontend → Backend
```
CallForm.jsx
  ├─ POST /api/clients (créer client)
  ├─ GET /api/clients (lister)
  ├─ GET /api/vehicules
  ├─ GET /api/equipes
  └─ POST /api/missions (créer mission)

Missions.jsx
  ├─ GET /api/missions
  ├─ PUT /api/missions/:id/status
  └─ POST /api/missions/:id/generer-pdf

Teams.jsx
  ├─ GET /api/equipes
  └─ POST /api/equipes

Clients.jsx, Vehicles.jsx
  └─ Connexions directes aux API respectifs
```

### Backend → Database
```
server.js
├─ db.run() → INSERT/UPDATE/DELETE
├─ db.get() → SELECT une ligne
├─ db.all() → SELECT plusieurs lignes
└─ db.serialize() → Transactions

init_db.js
└─ db.run() → CREATE TABLE
```

---

## 🔧 Points d'Extension

Pour ajouter une nouvelle fonctionnalité:

1. **Backend**: Modifier `backend/server.js`
   ```javascript
   app.post('/api/new-endpoint', (req, res) => {
     // Votre logique
   });
   ```

2. **Database**: Modifier `backend/init_db.js`
   ```sql
   CREATE TABLE new_table (...)
   ```

3. **Frontend**: Créer `fronted/src/components/NewComponent.jsx`
   ```jsx
   export default function NewComponent() {
     // Votre code React
   }
   ```

4. **Navigation**: Modifier `fronted/src/App.jsx`
   ```jsx
   <button onClick={() => setView('new')}>...</button>
   ```

---

## 📱 Ports Utilisés

```
Frontend:  http://localhost:5173
Backend:   http://localhost:3000
Database:  Local file (backend/data.db)
Archives:  File system (backend/archives/)
```

---

## 🆘 Localisation Rapide de Fonctionnalités

| Fonctionnalité | Fichier | Ligne |
|----------------|---------|-------|
| Formulaire appel | CallForm.jsx | ~50 |
| Création mission | server.js | ~100 |
| Génération PDF | server.js | ~180 |
| Vue missions | Missions.jsx | ~50 |
| Gestion équipes | Teams.jsx | ~10 |
| Navigation | App.jsx | ~30 |
| Styles | index.css | 0-50 |
| Base données | init_db.js | ~40 |

---

**Cette structure est claire, maintenable, et extensible!** 🚀
