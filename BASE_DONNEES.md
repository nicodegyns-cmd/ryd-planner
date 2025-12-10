# 💾 Architecture de la Base de Données

## Vue d'ensemble

La base de données SQLite stocke toutes les informations nécessaires au fonctionnement du système de gestion de missions.

---

## 📊 Tables

### 1. **clients** 👤
Stocke les informations des personnes transportées.

```sql
CREATE TABLE clients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT,
  prenom TEXT,
  telephone TEXT,
  email TEXT
)
```

| Champ | Type | Description |
|-------|------|-------------|
| `id` | INTEGER | Identifiant unique |
| `nom` | TEXT | Nom de famille |
| `prenom` | TEXT | Prénom |
| `telephone` | TEXT | Numéro de téléphone |
| `email` | TEXT | Adresse email |

**Exemple:**
```json
{
  "id": 1,
  "nom": "Dupont",
  "prenom": "Jean",
  "telephone": "06 12 34 56 78",
  "email": "jean.dupont@email.com"
}
```

---

### 2. **vehicules** 🚗
Parc automobile avec suivi du statut.

```sql
CREATE TABLE vehicules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  marque TEXT,
  modele TEXT,
  immatriculation TEXT,
  statut TEXT DEFAULT 'disponible'
)
```

| Champ | Type | Description |
|-------|------|-------------|
| `id` | INTEGER | Identifiant unique |
| `marque` | TEXT | Marque du véhicule (ex: Renault) |
| `modele` | TEXT | Modèle (ex: Espace) |
| `immatriculation` | TEXT | Plaque d'immatriculation |
| `statut` | TEXT | État du véhicule |

**Statuts possibles:**
- `disponible` - Prêt pour une nouvelle mission
- `en mission` - Actuellement en trajet

**Exemple:**
```json
{
  "id": 1,
  "marque": "Renault",
  "modele": "Espace",
  "immatriculation": "AB-123-CD",
  "statut": "disponible"
}
```

---

### 3. **equipes** 👥
Groupes de chauffeurs et ressources humaines.

```sql
CREATE TABLE equipes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT,
  chauffeur_principal TEXT,
  contact TEXT
)
```

| Champ | Type | Description |
|-------|------|-------------|
| `id` | INTEGER | Identifiant unique |
| `nom` | TEXT | Nom de l'équipe |
| `chauffeur_principal` | TEXT | Nom du chauffeur responsable |
| `contact` | TEXT | Téléphone ou email |

**Exemple:**
```json
{
  "id": 1,
  "nom": "Équipe Nord",
  "chauffeur_principal": "Pierre Martin",
  "contact": "06 87 65 43 21"
}
```

---

### 4. **missions** 📋
Les missions de transport avec toutes les informations liées.

```sql
CREATE TABLE missions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id INTEGER,
  vehicule_id INTEGER,
  equipe_id INTEGER,
  heure_depart TEXT,
  heure_arrivee TEXT,
  lieu_depart TEXT,
  lieu_arrivee TEXT,
  notes TEXT,
  statut TEXT DEFAULT 'planifiée',
  date_creation DATETIME,
  pdf_path TEXT,
  FOREIGN KEY(client_id) REFERENCES clients(id),
  FOREIGN KEY(vehicule_id) REFERENCES vehicules(id),
  FOREIGN KEY(equipe_id) REFERENCES equipes(id)
)
```

| Champ | Type | Description |
|-------|------|-------------|
| `id` | INTEGER | Identifiant unique |
| `client_id` | INTEGER | Référence au client |
| `vehicule_id` | INTEGER | Référence au véhicule |
| `equipe_id` | INTEGER | Référence à l'équipe |
| `heure_depart` | TEXT | Heure prévue du départ (HH:MM) |
| `heure_arrivee` | TEXT | Heure prévue d'arrivée (HH:MM) |
| `lieu_depart` | TEXT | Adresse de départ |
| `lieu_arrivee` | TEXT | Adresse d'arrivée |
| `notes` | TEXT | Remarques spéciales |
| `statut` | TEXT | État actuel |
| `date_creation` | DATETIME | Quand la mission a été créée |
| `pdf_path` | TEXT | Chemin du PDF archivé |

**Statuts possibles:**
- `planifiée` - Mission en attente
- `en cours` - Mission en cours d'exécution
- `terminée` - Mission accomplie

**Exemple complet:**
```json
{
  "id": 1,
  "client_id": 1,
  "vehicule_id": 1,
  "equipe_id": 1,
  "heure_depart": "14:00",
  "heure_arrivee": "15:30",
  "lieu_depart": "123 Rue de Paris, Paris",
  "lieu_arrivee": "456 Avenue Lyon, Lyon",
  "notes": "Client préfère musique douce, arrêt hydratation recommandé",
  "statut": "en cours",
  "date_creation": "2024-12-02T10:30:00",
  "pdf_path": "mission_1_1733143800000.pdf"
}
```

---

## 🔗 Relations Entre Tables

```
clients (1) ──────── (N) missions
vehicules (1) ──────── (N) missions
equipes (1) ──────── (N) missions
```

**Explication:**
- Un **client** peut avoir plusieurs **missions**
- Un **véhicule** peut être affecté à plusieurs **missions**
- Une **équipe** peut gérer plusieurs **missions**
- Une **mission** lié un et un seul client, véhicule et équipe

---

## 📈 Cycle de Vie d'une Mission

```
1. Création
   ├─ État: "planifiée"
   ├─ Statut véhicule: "en mission"
   └─ Date création: NOW

2. Pendant le trajet
   └─ État: "en cours"

3. Archivage
   ├─ Génération PDF
   ├─ Stockage dans archives/
   ├─ Sauvegarde du chemin PDF_path
   └─ État: "terminée"

4. Finalisation
   ├─ État: "terminée"
   └─ Statut véhicule: "disponible"
```

---

## 🔍 Requêtes Utiles

### Toutes les missions avec détails
```sql
SELECT m.*, 
       c.nom AS client_nom, c.prenom AS client_prenom,
       v.marque, v.immatriculation,
       e.nom AS equipe_nom
FROM missions m
LEFT JOIN clients c ON m.client_id = c.id
LEFT JOIN vehicules v ON m.vehicule_id = v.id
LEFT JOIN equipes e ON m.equipe_id = e.id
ORDER BY m.date_creation DESC;
```

### Missions en cours
```sql
SELECT * FROM missions WHERE statut = 'en cours';
```

### Missions par équipe
```sql
SELECT * FROM missions WHERE equipe_id = 1 ORDER BY date_creation DESC;
```

### Véhicules disponibles
```sql
SELECT * FROM vehicules WHERE statut = 'disponible';
```

### Missions d'aujourd'hui
```sql
SELECT * FROM missions 
WHERE DATE(date_creation) = DATE('now');
```

---

## 🛠️ Maintenance

### Réinitialiser la base de données
```bash
cd backend
rm data.db
npm run init-db
```

### Sauvegarder
```bash
# Windows
copy backend\data.db backend\data_backup.db

# Linux/Mac
cp backend/data.db backend/data_backup.db
```

### Restaurer depuis backup
```bash
# Windows
copy backend\data_backup.db backend\data.db

# Linux/Mac
cp backend/data_backup.db backend/data.db
```

---

## 📊 Statistiques Possibles

Avec cette structure, vous pouvez obtenir :

- **Missions par client** : Historique complet
- **Utilisation des véhicules** : Nombre de trajets par véhicule
- **Performance des équipes** : Missions complétées par équipe
- **Tendances temporelles** : Missions par jour/semaine
- **Revenue** : Ajouter un coût par mission et calculer le total

---

## 🔐 Sécurité

- ✓ Utilisation de paramètres liés (? placeholders) pour éviter les injections SQL
- ✓ Les clés étrangères assurent l'intégrité des données
- ✓ Backup réguliers recommandés
- ✓ Droits d'accès à la base restrictifs en production

---

## 🚀 Évolutions Futures

- Ajouter un `coût` à chaque mission pour facturation
- Ajouter une `durée_reelle` pour comparaison prévision/réalité
- Ajouter des `timestamps` pour audit trail
- Compartimenter les missions par type (transport, livraison, etc.)
- Ajouter une table `utilisateurs` pour multi-user
- Ajouter une table `historique_statut` pour traçabilité complète

---

**Vue complète du système de stockage des données** 💾✨
