# 📚 Exemple d'Utilisation Complet

## Scénario: Mission de Transport Réelle

Imaginez que vous recevez un appel d'une personne qui doit se rendre de Paris à Versailles demain à 9h.

---

## 🔄 Étape par Étape

### Étape 1: Lancer l'application

```bash
cd mission-planner
start.bat          # Windows
# ou
./start.sh         # Linux/Mac
```

**Attendre 3-5 secondes**

- Backend démarre: `http://localhost:3000`
- Frontend démarre: `http://localhost:5173`
- Ouvrir le navigateur: `http://localhost:5173`

---

### Étape 2: Préparer les données (une seule fois)

#### 2.1 Ajouter des véhicules

**Navigation → 🚙 Véhicules**

Cliquez "➕ Nouveau Véhicule" et ajoutez:

**Véhicule 1:**
- Marque: `Renault`
- Modèle: `Espace`
- Immatriculation: `AB-123-CD`

**Véhicule 2:**
- Marque: `Mercedes`
- Modèle: `Classe V`
- Immatriculation: `XY-789-ZW`

#### 2.2 Ajouter des équipes

**Navigation → 👥 Équipes**

Cliquez "➕ Nouvelle Équipe" et ajoutez:

**Équipe 1:**
- Nom: `Équipe Nord`
- Chauffeur Principal: `Pierre Martin`
- Contact: `06 12 34 56 78`

**Équipe 2:**
- Nom: `Équipe Sud`
- Chauffeur Principal: `Sophie Bernard`
- Contact: `06 98 76 54 32`

---

### Étape 3: Recevoir l'Appel 📞

**Navigation → 📞 Appel Entrant**

Vous recevez un appel:
> "Bonjour, je m'appelle Jean Dupont, j'habite 123 Rue de Paris à Paris et je dois aller à Versailles demain à 9h du matin. Mon numéro est 06 87 65 43 21"

#### 3.1 Saisir le client

Dans le formulaire "👤 Client":

- Sélectionner "➕ Nouveau Client"

Remplir:
```
Nom: Dupont
Prénom: Jean
Téléphone: 06 87 65 43 21
Email: jean.dupont@email.com
```

Cliquer "✓ Ajouter"

#### 3.2 Saisir l'itinéraire

Section "🗺️ Itinéraire":

**Départ:**
```
Lieu: 123 Rue de Paris, 75000 Paris
Heure: 09:00
```

**Arrivée:**
```
Lieu: Château de Versailles, 78000 Versailles
Heure: 09:45
```

#### 3.3 Sélectionner les ressources

Section "🚗 Ressources":

```
Véhicule: Renault Espace (AB-123-CD)
Équipe: Équipe Nord (Pierre Martin)
```

#### 3.4 Ajouter des notes

Section "📝 Notes":

```
Client VIP préférant musique classique.
Allergique aux arachides.
Arrêt à mi-chemin pour hydratation.
```

#### 3.5 Créer la Mission

Cliquer **"✓ Créer la Mission"**

Message de confirmation: `✓ Mission créée #1`

---

### Étape 4: Voir et Gérer la Mission

**Navigation → 📋 Missions**

Vous voyez maintenant:

```
┌─────────────────────────────────────────────────────────────┐
│ #1 — Jean Dupont                                            │
│ 📱 06 87 65 43 21                                           │
│ 📍 123 Rue de Paris, 75000 Paris → Château de Versailles   │
│ 🕐 09:00 — 09:45                                           │
│                                                             │
│ Ressources                                                  │
│ 🚗 Renault Espace (AB-123-CD)                              │
│ 👥 Équipe Nord (Pierre Martin)                             │
│                                                             │
│ Status: 🔵 Planifiée                                       │
│ [En cours] [Terminée] [📄 PDF]                             │
│                                                             │
│ Notes: Client VIP préférant musique classique...           │
└─────────────────────────────────────────────────────────────┘
```

---

### Étape 5: Archiver en PDF

Cliquez sur **"📄 PDF"**

**Ce qui se passe:**
1. Génération d'une fiche PDF professionnelle
2. Archivage dans `backend/archives/mission_1_xxxxx.pdf`
3. Ouverture du PDF dans le navigateur

**Le PDF contient:**
```
═══════════════════════════════════
FICHE DE MISSION
═══════════════════════════════════

Numéro: #1
Date: 02/12/2024

INFORMATIONS CLIENT
───────────────────
Nom: Jean Dupont
Téléphone: 06 87 65 43 21
Email: jean.dupont@email.com

ITINÉRAIRE
───────────
Départ: 123 Rue de Paris, 75000 Paris
À: 09:00
Arrivée: Château de Versailles, 78000 Versailles
À: 09:45

RESSOURCES
───────────
Véhicule: Renault Espace (AB-123-CD)
Équipe: Équipe Nord
Chauffeur: Pierre Martin

NOTES
─────
Client VIP préférant musique classique.
Allergique aux arachides.
Arrêt à mi-chemin pour hydratation.

Statut: planifiée

Signature: ___________________
Date: ___________________
```

**Imprimer ou archiver ce PDF** ✓

---

### Étape 6: Jour du Trajet (Lendemain)

**Navigation → 📋 Missions**

#### 6.1 Marquer comme "En cours"

Cliquer sur **"En cours"** pour la mission #1

État change: 🔵 Planifiée → 🟡 En cours

Pierre Martin et son équipe commencent le trajet.

#### 6.2 Suivi

Vous voyez l'équipe "Équipe Nord" dans le filtre "En cours".

Le véhicule "Renault Espace" a son statut "en mission".

---

### Étape 7: Fin du Trajet

Dès que le trajet est terminé:

**Navigation → 📋 Missions → Terminée**

Cliquer sur **"Terminée"** pour la mission #1

**Automatiquement:**
- État change: 🟡 En cours → 🟢 Terminée
- Véhicule "Renault Espace" → statut "disponible" ✓
- Équipe peut prendre une nouvelle mission

---

## 🔁 Deuxième Mission Rapide

Vous recevez un autre appel quelques heures plus tard.

**Navigation → 📞 Appel Entrant**

Cette fois plus rapide car:

1. **Client existant:**
   - Sélectionner "Sophie Martin" (client existant)
   - Pas besoin de recréer

2. **Itinéraire rapide:**
   - Départ: `10 Boulevard Voltaire, 75011 Paris`
   - Arrivée: `Tour Eiffel, 5 Avenue Anatole France, 75007 Paris`
   - Heure: `14:00 - 14:30`

3. **Ressources:**
   - Véhicule: `Mercedes Classe V` ✓ (maintenant disponible)
   - Équipe: `Équipe Sud`

4. **Créer → Mission #2 créée**

---

## 📊 Exemple avec Plusieurs Missions

Voici à quoi ressemblerait votre écran après plusieurs missions:

```
FILTRES: [Tous (15)] [Planifiées (3)] [En cours (2)] [Terminées (10)]

┌─────────────────────────────────────────────────────────┐
│ #15 — Marie Leclerc                         🟡 En cours │
│ Équipe Sud • Mercedes (XY-789-ZW)                       │
│ Paris → Lyon • 14:00 - 16:30                            │
│ [Terminée] [📄 PDF]                                     │
├─────────────────────────────────────────────────────────┤
│ #14 — Jacques Moreau                     🔵 Planifiée │
│ Équipe Nord • Renault (AB-123-CD)                       │
│ Paris → Fontainebleau • 11:00 - 12:00                   │
│ [En cours] [Terminée] [📄 PDF]                         │
├─────────────────────────────────────────────────────────┤
│ #13 — Catherine Durand                    🟢 Terminée  │
│ Équipe Sud • Mercedes (XY-789-ZW)                       │
│ Orly → CDG • 10:00 - 10:45                              │
│ PDF généré: mission_13_xxxxx.pdf                        │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Données Créées au Total

### Clients (5)
```
1. Jean Dupont (06 87 65 43 21)
2. Sophie Martin (06 11 22 33 44)
3. Marie Leclerc (06 55 66 77 88)
4. Jacques Moreau (06 99 88 77 66)
5. Catherine Durand (06 44 55 66 77)
```

### Véhicules (2)
```
1. Renault Espace - AB-123-CD - Disponible
2. Mercedes Classe V - XY-789-ZW - Disponible
```

### Équipes (2)
```
1. Équipe Nord - Pierre Martin (06 12 34 56 78)
2. Équipe Sud - Sophie Bernard (06 98 76 54 32)
```

### Missions (15)
```
1. ✓ Terminée - Jean Dupont - Renault - Équipe Nord
2. ✓ Terminée - Sophie Martin - Mercedes - Équipe Sud
3. ✓ Terminée - Marie Leclerc - Renault - Équipe Nord
4. ✓ Terminée - Jacques Moreau - Mercedes - Équipe Sud
...
15. 🟡 En cours - Marie Leclerc - Mercedes - Équipe Sud
```

### PDFs Archivés (15)
```
mission_1_1733143200000.pdf
mission_2_1733143500000.pdf
mission_3_1733143800000.pdf
...
mission_15_1733147200000.pdf
```

---

## 🔍 Vérifications Utiles

### Vérifier les PDFs générés
```bash
# Windows
dir backend\archives\

# Résultat:
# 15 mission_X_*.pdf (files)
```

### Vérifier la base de données
```bash
# Voir toutes les missions:
http://localhost:3000/api/missions

# Résultat (JSON):
[
  {
    "id": 1,
    "client_nom": "Dupont",
    "client_prenom": "Jean",
    "lieu_depart": "123 Rue de Paris, 75000 Paris",
    "lieu_arrivee": "Château de Versailles, 78000 Versailles",
    "equipe_nom": "Équipe Nord",
    "veh_marque": "Renault",
    "statut": "terminée"
  },
  ...
]
```

---

## 💡 Conseils Pratiques

### Gestion Efficace

1. **Créer les équipes et véhicules le premier jour**
   - Puis réutiliser à chaque mission

2. **Créer les clients au fur et à mesure**
   - Ou importer une liste au démarrage

3. **Générer PDF immédiatement**
   - Ou en fin de journée par batch

4. **Archiver régulièrement**
   - Exporter dossier `archives/` en fin de mois

### Optimisations

- ✓ Filtrer les missions "En cours" le matin
- ✓ Voir les missions "Planifiées" pour anticipation
- ✓ Classer les PDFs par date/client

---

## 🎓 Ce que vous Avez Appris

✓ Ajouter des véhicules et équipes
✓ Recevoir un appel via formulaire
✓ Créer une mission en quelques clics
✓ Générer un PDF pour archivage
✓ Suivre le statut d'une mission
✓ Gérer plusieurs missions simultanées
✓ Récupérer les données archivées

---

## 🚀 Prochaines Étapes

- Intégrer SMS de notification
- Ajouter géolocalisation
- Créer un dashboard statistiques
- Implémenter multi-user avec login

---

**Bon management de missions !** 🎉
