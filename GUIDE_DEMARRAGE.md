# 📱 Guide de Démarrage - Mission Planner Pro

## ✅ Prêt à l'emploi

Votre application de gestion de missions est maintenant **prête à être utilisée**. Voici ce qui a été implémenté :

### ✨ Fonctionnalités Implémentées

#### 1. **Formulaire de Réception d'Appel** 📞
- Interface intuitive pour enregistrer un appel entrant
- Saisie directe des informations client
- Possibilité d'ajouter un client existant ou d'en créer un nouveau rapidement
- Sélection de l'adresse de départ et d'arrivée
- Choix du horaire (heure départ/arrivée)
- Notes optionnelles pour remarques spéciales

#### 2. **Génération Automatique de PDF** 📄
- Chaque mission peut être convertie en document PDF
- Les fiches contiennent : numéro, infos client, itinéraire, véhicule, équipe, notes
- Archivage automatique dans le dossier `backend/archives/`
- Un clic sur "📄 PDF" pour télécharger ou ouvrir

#### 3. **Attribution aux Équipes** 👥
- Création et gestion des équipes
- Chauffeur principal assigné par équipe
- Contact direct pour chaque équipe
- Attribution d'équipe lors de la création d'une mission

#### 4. **Suivi des Missions** 📋
- Vue complète de toutes les missions
- Filtrage par statut (Planifiée, En cours, Terminée)
- Mise à jour du statut en un clic
- Affichage des informations liées (client, équipe, véhicule)

#### 5. **Gestion des Ressources** 🚗
- Liste des véhicules disponibles (en temps réel)
- Création de nouveaux véhicules
- Statut automatiquement mis à jour (disponible/en mission)
- Gestion des clients avec téléphone et email

---

## 🚀 Comment Démarrer

### **Option 1 : Script Automatisé (Windows)**
```bash
cd c:\Users\nicod\OneDrive\Bureau\mission-planner
start.bat
```
Cela lancera automatiquement le backend et le frontend.

### **Option 2 : Manuel (Plus de contrôle)**

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run init-db
npm start
```
→ Le serveur API démarre sur `http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
cd fronted
npm install
npm run dev
```
→ L'application démarre sur `http://localhost:5173`

Ouvrez votre navigateur sur `http://localhost:5173`

---

## 🎯 Flux d'Utilisation

### **Scénario : Vous recevez un appel**

1. **Cliquez sur "📞 Appel Entrant"** dans la navigation
2. **Remplissez les informations** :
   - Client (existant ou nouveau)
   - Adresse départ
   - Adresse arrivée
   - Horaires
   - Équipe et véhicule
   - Notes si nécessaire
3. **Cliquez sur "✓ Créer la Mission"**
4. La mission apparaît dans **"📋 Missions"**
5. Vous pouvez alors :
   - Marquer comme "En cours"
   - Générer un PDF pour archivage
   - Marquer comme "Terminée" (véhicule redevient disponible)

---

## 📊 Interface Principale

### Navigation (en haut)
- 📞 **Appel Entrant** → Formulaire pour enregistrer un appel
- 📋 **Missions** → Vue complète avec filtres et statut
- 👥 **Équipes** → Gestion des équipes de chauffeurs
- 👤 **Clients** → Base de clients
- 🚙 **Véhicules** → Parc automobile

### Formulaire Appel Entrant
```
┌─────────────────────────────────┐
│ Client                          │
│ ├─ Sélectionner existant        │
│ └─ Ou créer nouveau             │
├─────────────────────────────────┤
│ Itinéraire                      │
│ ├─ Départ (adresse + heure)     │
│ └─ Arrivée (adresse + heure)    │
├─────────────────────────────────┤
│ Ressources                      │
│ ├─ Véhicule (disponibles)       │
│ └─ Équipe                       │
├─────────────────────────────────┤
│ Notes                           │
└─────────────────────────────────┘
```

---

## 📁 Où trouver quoi

| Élément | Localisation |
|--------|-------------|
| **Base de données** | `backend/data.db` |
| **PDFs archivés** | `backend/archives/` |
| **API Backend** | `backend/server.js` |
| **Interface Frontend** | `fronted/src/App.jsx` |
| **Formulaire d'appel** | `fronted/src/components/CallForm.jsx` |
| **Gestion missions** | `fronted/src/components/Missions.jsx` |

---

## 🔌 API - Points d'accès

### Créer une Mission
```bash
POST http://localhost:3000/api/missions
Body: {
  client_id: 1,
  vehicule_id: 2,
  equipe_id: 3,
  lieu_depart: "Adresse A",
  lieu_arrivee: "Adresse B",
  heure_depart: "14:00",
  heure_arrivee: "15:30",
  notes: "Client VIP"
}
```

### Générer un PDF
```bash
POST http://localhost:3000/api/missions/1/generer-pdf
Response: {
  success: true,
  fileName: "mission_1_1234567890.pdf",
  url: "/archives/mission_1_1234567890.pdf"
}
```

### Changer le statut
```bash
PUT http://localhost:3000/api/missions/1/status
Body: { statut: "en cours" }
```

---

## 🎨 Améliorations Suggérées (Futures)

- [ ] Intégration Google Maps pour visualiser les itinéraires
- [ ] Envoi SMS à l'équipe lors d'une nouvelle mission
- [ ] Notification email du PDF généré
- [ ] Rapport financier par mission
- [ ] Historique complet des missions réalisées
- [ ] Dashboard statistiques (missions/jour, utilisation véhicules, etc.)
- [ ] Module de facturation
- [ ] Application mobile
- [ ] Système de chat en direct avec les équipes
- [ ] Géolocalisation des véhicules en mission

---

## ⚠️ Dépannage Rapide

### **Frontend ne voit pas le backend**
Vérifier que :
- ✓ Backend est démarré sur `http://localhost:3000`
- ✓ CORS est activé (c'est le cas par défaut)
- ✓ Pas de firewall bloquant le port 3000

### **Base de données vide**
```bash
cd backend
npm run init-db
```

### **Port déjà utilisé**
Changer le port dans `backend/server.js` :
```javascript
const PORT = process.env.PORT || 3001  // Au lieu de 3000
```

### **Erreur lors de la génération PDF**
Vérifier que le dossier `backend/archives/` existe (créé automatiquement)

---

## 📞 Support

Pour toute question ou modification :
1. Vérifiez les logs du terminal (backend et frontend)
2. Consultez le README.md complet
3. Vérifiez les fichiers API dans `backend/server.js`

---

## 🎉 C'est prêt !

Votre logiciel de gestion de missions est fonctionnel et prêt à être utilisé.

**Bonne gestion de missions !** 🚗✨
