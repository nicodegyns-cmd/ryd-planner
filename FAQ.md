# ❓ FAQ - Questions Fréquemment Posées

## 🚀 Installation & Démarrage

### Q: Comment je démarre l'application?
**R:** Double-cliquez sur `start.bat` (Windows) ou lancez `./start.sh` (Linux/Mac). Attendez 5 secondes, puis ouvrez `http://localhost:5173`.

### Q: Ça prend combien de temps à démarrer?
**R:** Environ 3-5 secondes. Si plus long, vérifier les logs du terminal.

### Q: Je peux démarrer juste le frontend ou backend?
**R:** Oui! Lancez les 2 commandes dans des terminaux différents:
- Backend: `cd backend && npm start`
- Frontend: `cd fronted && npm run dev`

### Q: Qu'est-ce que "CORS error"?
**R:** Généralement signifie que le backend n'est pas démarré. Vérifier que `http://localhost:3000` répond.

---

## 💾 Base de Données

### Q: Où est stockée ma base de données?
**R:** Dans `backend/data.db`. C'est un fichier SQLite.

### Q: Est-ce que je perds mes données si je redémarre?
**R:** Non! Les données sont sauvegardées dans `data.db`. Elles persistent.

### Q: Comment je sauvegarde mes données?
**R:** Copier le fichier `backend/data.db` ailleurs:
```bash
# Windows
copy backend\data.db backup_data.db

# Linux/Mac
cp backend/data.db backup_data.db
```

### Q: Je peux exporter mes données?
**R:** Pas encore d'export automatique, mais vous pouvez:
1. Accéder à l'API: `http://localhost:3000/api/missions`
2. Copier le JSON
3. Sauvegarder dans un fichier

### Q: La base de données peut-elle avoir un problème?
**R:** Rarement. Si erreur "database locked", arrêtez le backend et relancez.

### Q: Je peux utiliser PostgreSQL au lieu de SQLite?
**R:** Oui, en production. Modification du code nécessaire dans `server.js`.

---

## 📊 Missions & Données

### Q: Comment je crée une mission?
**R:** `📞 Appel Entrant` → Remplir formulaire → `✓ Créer la Mission`

### Q: Pourquoi je ne peux pas sélectionner un véhicule?
**R:** Probablement déjà "en mission". Changez son statut à "disponible" d'abord.

### Q: Comment je marque une mission comme terminée?
**R:** `📋 Missions` → Cliquez `Terminée` → Véhicule redevient disponible.

### Q: Je peux modifier une mission après création?
**R:** Pas de formulaire d'édition pour l'instant. Créer une nouvelle mission si erreur.

### Q: Comment je supprime une mission?
**R:** Actuellement impossible via l'interface. Contactez support ou modifiez la BD directement.

### Q: Mes clients sont enregistrés?
**R:** Oui! Allez à `👤 Clients` pour voir la liste.

### Q: Je peux ajouter plus d'infos au client?
**R:** Actuellement: nom, prénom, téléphone, email. Pour plus, modifier la base.

---

## 📄 PDFs & Archivage

### Q: Où sont stockés les PDFs?
**R:** Dans `backend/archives/` avec noms comme `mission_1_timestamp.pdf`

### Q: Comment je génère un PDF?
**R:** `📋 Missions` → Cliquez `📄 PDF` → Téléchargé/ouvert automatiquement.

### Q: Le PDF est en quelle langue?
**R:** Français! Contient toutes les infos de la mission.

### Q: Je peux personnaliser le PDF?
**R:** Oui, modifier `backend/server.js` section `POST /api/missions/:id/generer-pdf`

### Q: Les PDFs se suppriment automatiquement?
**R:** Non, ils restent indéfiniment. Supprimez manuellement si besoin.

### Q: Je peux télécharger tous les PDFs d'un coup?
**R:** Pas automatiquement. Zippez le dossier `backend/archives/` manuellement.

---

## 👥 Équipes & Ressources

### Q: Comment j'ajoute une équipe?
**R:** `👥 Équipes` → `➕ Nouvelle Équipe` → Remplir → `✓ Ajouter l'équipe`

### Q: Une équipe peut-elle gérer plusieurs missions?
**R:** Oui! Une même équipe peut être assignée à plusieurs missions.

### Q: Comment je change l'équipe d'une mission?
**R:** Actuellement pas possible. Créer une nouvelle mission si erreur.

### Q: Je peux voir combien de missions une équipe a?
**R:** Pas de dashboard pour ça. Filtrer manuellement par équipe.

### Q: Quelle est la différence entre Équipes et Chauffeurs?
**R:** Une équipe = groupe de chauffeurs. Le "Chauffeur principal" est le responsable.

---

## 🚗 Véhicules

### Q: Comment j'ajoute un véhicule?
**R:** `🚙 Véhicules` → `➕ Nouveau Véhicule` → Marque/Modèle/Immat → `✓ Ajouter`

### Q: Quel format pour l'immatriculation?
**R:** Libre! (ex: `AB-123-CD`, `ABC123DE`, `AB123CD`)

### Q: Le véhicule peut-être en plusieurs missions à la fois?
**R:** Non. Statut "en mission" = occupé jusqu'à "Terminée".

### Q: Je peux voir l'historique d'un véhicule?
**R:** Pas de rapport direct. Voir `📋 Missions` et filtrer manuellement.

### Q: Je peux ajouter des infos au véhicule (kilométrage, etc.)?
**R:** Actuellement non. Possible via modification de la base de données.

---

## 🔌 API & Technique

### Q: Je peux accéder à l'API directement?
**R:** Oui! Base: `http://localhost:3000/api/`

### Q: Quelle est l'adresse IP d'accès?
**R:** `localhost` (local) ou votre IP si accès réseau externe.

### Q: Je peux me connecter de mon téléphone?
**R:** Pas d'app mobile actuellement. Via navigateur sur `http://[IP-PC]:5173`

### Q: Les données sont en HTTP ou HTTPS?
**R:** HTTP pour local. HTTPS recommandé en production.

### Q: Je peux ajouter authentification?
**R:** Oui, à implémenter dans `server.js`. Voir réalisations futures.

---

## 🐛 Bugs & Problèmes

### Q: "Port 3000 already in use" - Que faire?
**R:** 
```bash
# Windows: taskkill /IM node.exe /F
# Linux: pkill -f node
# Ou changer port dans server.js
```

### Q: Le frontend affiche "Cannot GET /"
**R:** Frontend pas complètement démarré. Attendre 3 secondes et rafraîchir.

### Q: Les missions n'apparaissent pas
**R:** 
- Vérifier backend démarre: `http://localhost:3000/api/missions`
- Vérifier base créée: `backend/data.db` existe?
- Relancer: `npm run init-db` dans backend

### Q: Le PDF est vide
**R:** Probable bug. Vérifier que mission a infos client/équipe.

### Q: "File not found: archives"
**R:** Dossier créé automatiquement à premier PDF. Ou créer manuellement: `mkdir backend/archives`

### Q: Le site est très lent
**R:** Probable: PC bas de gamme. Fermer autres applications.

---

## 🎨 Interface & Utilisation

### Q: Pourquoi ça a cette couleur?
**R:** Design professionnel. Modifiable dans CSS/Tailwind si vous voulez.

### Q: Je peux changer la langue en anglais?
**R:** Actuellement français only. À traduire dans composants React.

### Q: Pourquoi j'ai pas d'onglet X?
**R:** Certain onglets que si équipes/clients/véhicules existent.

### Q: Comment je mets à jour la navigation?
**R:** Modifier `fronted/src/App.jsx` et ajouter nouveaux boutons.

---

## 🚀 Évolution & Personnalisation

### Q: Comment je l'héberge en ligne?
**R:** 
- Backend: Heroku, AWS, DigitalOcean, etc.
- Frontend: Vercel, Netlify, Surge, etc.

### Q: Je veux ajouter une feature
**R:** 
1. Modifier `backend/server.js` (API)
2. Modifier composants React (UI)
3. Ou créer nouveau composant

### Q: Je veux changer la couleur du bouton
**R:** Modifier Tailwind class dans composant React. Ex: `bg-blue-600` → `bg-red-600`

### Q: Quelle base de données pour production?
**R:** PostgreSQL, MySQL, ou Firebase. SQLite juste pour dev local.

### Q: Je peux avoir plusieurs utilisateurs?
**R:** Pas actuellement. À ajouter avec système de login/permissions.

---

## 📞 Contact & Support

### Q: Je ne trouve pas la réponse ici
**R:** Vérifiez:
1. `README.md` - Documentation principale
2. `GUIDE_DEMARRAGE.md` - Getting started
3. `EXEMPLE_UTILISATION.md` - Use case complet
4. `BASE_DONNEES.md` - Schéma DB
5. `COMMANDES_RAPIDES.md` - Commandes utiles

### Q: Je peux modifier le code?
**R:** Bien sûr! C'est votre logiciel. Faites-en ce que vous voulez.

### Q: Qui a créé ça?
**R:** Vous, avec assistance IA! ✨

### Q: C'est libre de droit?
**R:** Oui, c'est votre création.

---

## 🎯 Cas d'Usage Spécifiques

### Q: Je dois gérer 100+ missions/jour. Ça peut?
**R:** Oui, SQLite supporte ça. Mais lenteur possible. Passer à PostgreSQL en production.

### Q: Je dois créer des rapports?
**R:** Pas automatique. Exporter données JSON via API et traiter dans Excel/Python.

### Q: Je dois intégrer SMS/Email?
**R:** À ajouter dans `server.js` avec service (Twilio, SendGrid, etc.)

### Q: Je dois tracker GPS des véhicules?
**R:** À implémenter avec API Google Maps ou Mapbox.

### Q: Je dois suivre les coûts?
**R:** Ajouter colonne `cout` à table missions et calculer.

---

## ⚠️ Limitations Actuelles

- ❌ Pas de multi-user/authentification
- ❌ Pas de édition de missions après création
- ❌ Pas de suppression de données via UI
- ❌ Pas d'export/import automatique
- ❌ Pas de notifications temps réel
- ❌ Pas d'app mobile
- ❌ Pas de géolocalisation
- ❌ Pas de multi-langue

**Mais tout ça peut être ajouté!** 💪

---

## ✅ Points Forts

- ✅ Démarrage ultra-rapide
- ✅ Zéro dépendance externe (sauf Node/npm)
- ✅ Interface intuitive
- ✅ PDFs automatiques
- ✅ API RESTful propre
- ✅ Code extensible
- ✅ Documentation complète
- ✅ Prêt pour production locale

---

**Vous avez une autre question? Regardez les fichiers de doc ou modifiez le code!** 🚀
