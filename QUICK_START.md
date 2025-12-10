# ⚡ DÉMARRAGE IMMÉDIAT (5 minutes)

## 🚀 Les 3 Étapes

### Étape 1: Lancer l'Application (2 min)

**Windows:**
```bash
cd c:\Users\nicod\OneDrive\Bureau\mission-planner
double-clic sur start.bat
```
Attendez 5 secondes...

**Linux/Mac:**
```bash
cd ~/Bureau/mission-planner
chmod +x start.sh
./start.sh
```

### Étape 2: Ouvrir dans le Navigateur (1 min)

Ouvrir: **http://localhost:5173**

Vous devriez voir l'interface avec la navigation en haut:
```
📞 Appel Entrant | 📋 Missions | 👥 Équipes | 👤 Clients | 🚙 Véhicules
```

### Étape 3: Créer une Mission (2 min)

1. Allez à **"📞 Appel Entrant"**
2. Cliquez **"+ Nouveau Client"**
3. Remplissez:
   ```
   Nom: Dupont
   Prénom: Jean
   Téléphone: 06 12 34 56 78
   Email: jean@email.com
   ```
4. Cliquez **"✓ Ajouter"**
5. Remplissez l'itinéraire:
   ```
   Départ: Paris
   Arrivée: Lyon
   Heure Départ: 09:00
   Heure Arrivée: 11:00
   ```
6. Sélectionnez un véhicule et une équipe
   ⚠️ **NOTE:** Vous n'en avez pas encore? Créez-les d'abord!

---

## 📝 Avant la Première Mission

### Créer des Véhicules (30 secondes)
1. Allez **"🚙 Véhicules"**
2. Cliquez **"+ Nouveau Véhicule"**
3. Remplissez:
   ```
   Marque: Renault
   Modèle: Espace
   Immatriculation: AB-123-CD
   ```
4. Cliquez **"✓ Ajouter"**

### Créer des Équipes (30 secondes)
1. Allez **"👥 Équipes"**
2. Cliquez **"+ Nouvelle Équipe"**
3. Remplissez:
   ```
   Nom: Équipe 1
   Chauffeur Principal: Pierre Martin
   Contact: 06 87 65 43 21
   ```
4. Cliquez **"✓ Ajouter l'équipe"**

**Maintenant vous pouvez créer une mission!**

---

## ✨ Votre Première Mission (3 minutes)

### Scénario
Vous recevez un appel: "Je dois aller de Paris à Versailles demain 9h, je m'appelle Jean Dupont"

### Action
1. Cliquez **"📞 Appel Entrant"**
2. **Client:** Créez Jean Dupont (1 min)
3. **Itinéraire:** Saisissez Paris → Versailles, 09:00 - 09:45 (30 sec)
4. **Ressources:** Choisissez votre véhicule et équipe (30 sec)
5. **Notes:** (optionnel)
6. Cliquez **"✓ Créer la Mission"**

**✅ Mission créée!**

---

## 📄 Générer un PDF (30 secondes)

1. Allez **"📋 Missions"**
2. Trouvez votre mission
3. Cliquez **"📄 PDF"**
4. Le PDF s'ouvre/télécharge automatiquement

**✅ PDF archivé dans backend/archives/**

---

## 📚 Documentation Principale

Ne lisez que si vous avez une question:

| Document | Raison |
|----------|--------|
| README.md | Vue d'ensemble |
| GUIDE_DEMARRAGE.md | Comment utiliser |
| FAQ.md | Questions fréquentes |
| COMMANDES_RAPIDES.md | Si ça ne marche pas |

---

## ⚠️ Problèmes Rapides

### "Port déjà utilisé"
```bash
# Windows
taskkill /IM node.exe /F

# Linux/Mac
pkill -f node

# Puis relancer start.bat ou start.sh
```

### "Backend ne marche pas"
Vérifier: http://localhost:3000/api/missions

Doit afficher `[]` ou JSON

### "Frontend blanc"
Attendre 10 secondes et rafraîchir (F5)

### "Pas de client/équipe/véhicule"
Vous devez les créer d'abord via les onglets respectifs

---

## 🎯 Points Clés à Retenir

✅ **Application en local** → Pas besoin d'internet
✅ **Données persistantes** → Elles restent après redémarrage
✅ **PDFs générés** → Archivés dans backend/archives/
✅ **Gratuit** → Zéro coût
✅ **Modifiable** → C'est votre code

---

## 🆘 SOS Rapides

**"Je ne sais pas quoi faire"**
→ Lire EXEMPLE_UTILISATION.md

**"Ça ne marche pas"**
→ Lire FAQ.md ou COMMANDES_RAPIDES.md

**"Comment je modifie l'interface"**
→ Lire ROADMAP.md → "Comment Ajouter une Fonctionnalité"

**"Comment je déploie en ligne"**
→ Lire ROADMAP.md → "Déploiement"

---

## 📞 Contacts Rapides

- 📱 Support: Lire FAQ.md
- 🐛 Bug: COMMANDES_RAPIDES.md → Troubleshooting
- 💻 Code: Voir commentaires dans server.js et App.jsx
- 📚 Learn: Voir liens dans ROADMAP.md

---

## ✅ Checklist avant Utilisation Réelle

- [ ] Application lance sans erreur
- [ ] Frontend accessible sur http://localhost:5173
- [ ] Véhicules créés (au moins 1)
- [ ] Équipes créées (au moins 1)
- [ ] Clients créés (au moins 1)
- [ ] Mission de test créée
- [ ] PDF généré et vérifié
- [ ] Statut mission changé (Planifiée → En cours → Terminée)

**Tout ✓? Vous êtes prêt!** 🚀

---

## 🚀 Maintenant...

```
1. Lancer l'app
2. Créer véhicules/équipes
3. Créer mission
4. Générer PDF
5. Utiliser!
```

**C'est aussi simple que ça!** ✨

---

**Bon usage!** 🎉

*Mis à jour: 2 décembre 2024*
*Version: 1.0*
