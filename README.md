# 🚗 Mission Planner Pro

Système complet de gestion de missions de transport avec génération de fiches PDF pour archivage.

## 📋 Fonctionnalités

### 1. **Réception d'Appels** 📞
- Formulaire dédié pour les appels entrants
- Saisie rapide des données client (nom, prénom, téléphone, email)
- Possibilité d'ajouter des clients existants ou nouveaux directement
- Saisie des itinéraires (adresse départ/arrivée, horaires)
- Notes/remarques spéciales

### 2. **Gestion des Missions** 📋
- Création de missions via le formulaire d'appel
- Attribution de véhicules (disponibles uniquement)
- Attribution d'équipes
- Suivi du statut (Planifiée → En cours → Terminée)
- Filtrage par statut
- Affichage complet avec toutes les informations liées

### 3. **Génération de PDF** 📄
- Génération automatique de fiches de mission
- Contient : numéro mission, infos client, itinéraire, véhicule, équipe, notes
- Archivage dans `/backend/archives/`
- Téléchargement direct depuis l'interface

### 4. **Gestion des Équipes** 👥
- Création de nouvelles équipes
- Attribution d'un chauffeur principal
- Conservation des contacts
- Affichage de la liste des équipes

### 5. **Gestion des Clients** 👤
- Liste complète des clients
- Création de nouveaux clients
- Téléphone et email stockés

### 6. **Gestion des Véhicules** 🚙
- Liste des véhicules disponibles
- Statut en temps réel (disponible/en mission)
- Marque, modèle, immatriculation

---

## 🚀 Installation et Démarrage

### Prérequis
- Node.js (v14+)
- npm ou yarn

### Backend
```bash
cd backend
npm install
npm run init-db   # Initialiser la base de données
npm start         # Démarre sur http://localhost:3000
```

### Frontend
```bash
cd fronted
npm install
npm run dev       # Démarre sur http://localhost:5173
```

Ouvrez votre navigateur sur `http://localhost:5173`

---

## 🏗️ Structure du Projet

```
mission-planner/
├── backend/
│   ├── server.js          # Serveur Express avec routes API
│   ├── init_db.js         # Initialisation SQLite
│   ├── data.db            # Base de données (créée automatiquement)
│   ├── archives/          # PDFs générés
│   └── package.json
│
└── fronted/
    ├── src/
    │   ├── App.jsx        # Composant principal
    │   ├── components/
    │   │   ├── CallForm.jsx    # Formulaire réception d'appel
    │   │   ├── Missions.jsx    # Affichage et gestion missions
    │   │   ├── Teams.jsx       # Gestion équipes
    │   │   ├── Clients.jsx     # Gestion clients
    │   │   └── Vehicles.jsx    # Gestion véhicules
    │   ├── index.css
    │   └── main.jsx
    ├── package.json
    └── tailwind.config.cjs
```

---

## 📡 API Endpoints

### Clients
- `GET /api/clients` - Lister tous les clients
- `POST /api/clients` - Créer un client

### Véhicules
- `GET /api/vehicules` - Lister tous les véhicules
- `POST /api/vehicules` - Créer un véhicule
- `PUT /api/vehicules/:id/status` - Changer le statut

### Équipes
- `GET /api/equipes` - Lister toutes les équipes
- `POST /api/equipes` - Créer une équipe

### Missions
- `GET /api/missions` - Lister toutes les missions (avec infos liées)
- `POST /api/missions` - Créer une mission
- `PUT /api/missions/:id/status` - Changer le statut
- `POST /api/missions/:id/generer-pdf` - Générer PDF et archiver

---

## 💾 Base de Données

### Tables SQLite

**clients**
- id (INTEGER PRIMARY KEY)
- nom, prenom, telephone, email

**vehicules**
- id (INTEGER PRIMARY KEY)
- marque, modele, immatriculation
- statut (disponible/en mission)

**equipes**
- id (INTEGER PRIMARY KEY)
- nom, chauffeur_principal, contact

**missions**
- id (INTEGER PRIMARY KEY)
- client_id, vehicule_id, equipe_id
- heure_depart, heure_arrivee
- lieu_depart, lieu_arrivee
- notes, statut, date_creation, pdf_path

---

## 🎯 Flux d'Utilisation Typique

1. **Appel entrant** → Allez à "📞 Appel Entrant"
2. **Saisissez les infos** → Client, itinéraire, horaires, équipe et véhicule
3. **Créez la mission** → La mission est enregistrée
4. **Suiverez le statut** → Allez à "📋 Missions" pour voir et mettre à jour
5. **Générez un PDF** → Cliquez sur "📄 PDF" pour archiver automatiquement
6. **Marquez comme terminée** → Met à jour le véhicule en "disponible"

---

## 🔧 Personnalisations Possibles

- Ajouter des statuts personnalisés
- Intégrer Google Maps pour les itinéraires
- SMS/Email de notification à l'équipe
- Historique complet des missions
- Rapports et statistiques
- Gestion des coûts par mission
- Interface mobile responsive

---

## 📦 Dépendances Principales

**Backend:**
- Express.js - Framework web
- SQLite3 - Base de données
- PDFKit - Génération PDF
- CORS - Partage entre domaines

**Frontend:**
- React - Interface
- Vite - Bundler
- Tailwind CSS - Styling

---

## 🐛 Troubleshooting

### Port 3000 déjà utilisé
```bash
# Changer le port dans backend/server.js
const PORT = process.env.PORT || 3001
```

### Base de données corrompue
```bash
# Supprimer et recréer
rm backend/data.db
cd backend && npm run init-db
```

### Frontend ne se connecte pas au backend
- Vérifier que le backend est démarré sur `http://localhost:3000`
- Vérifier les logs CORS

---

## 📝 Notes

- Les PDFs sont archivés dans `backend/archives/`
- Les véhicules en mission ne peuvent pas être sélectionnés
- Les statuts utilisent des couleurs : 🔵 Planifiée, 🟡 En cours, 🟢 Terminée
- L'API accepte JSON, tous les champs date utilisent le format ISO

---

**Développé pour une gestion efficace des missions de transport** ✨
