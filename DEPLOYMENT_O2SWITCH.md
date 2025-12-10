# 🚀 Déploiement RYD Planner sur O2Switch

## Étapes de déploiement

### 1. **Préparation du code**

Le projet est structuré pour O2Switch :
- `/backend/` - Serveur Node.js Express
- `/fronted/` - Application React (sera compilée)
- Tout est servi par un seul serveur sur port 3000

### 2. **Sur O2Switch Control Panel**

#### A. Créer une base de données MySQL
1. Aller dans **Bases de données → MySQL**
2. Créer une nouvelle DB :
   - Nom : `ryd_planner`
   - Utilisateur : `ryd_user`
   - Mot de passe : (générer un fort)
3. Noter les identifiants

#### B. Configurer le déploiement Node.js
1. Aller dans **Hébergement → Node.js** (ou demander au support si indisponible)
2. Uploader le code du projet
3. Ou utiliser Git (si disponible sur O2Switch)

### 3. **Configuration des variables d'environnement**

Sur le serveur O2Switch, créer un fichier `.env` :

```env
DB_HOST=localhost
DB_USER=ryd_user
DB_PASSWORD=votreMotDePasse
DB_NAME=ryd_planner
PORT=3000
NODE_ENV=production
```

### 4. **Installation et démarrage**

```bash
# Aller dans le dossier backend
cd backend

# Installer les dépendances
npm install

# Initialiser la base de données
npm run init-db

# Lancer le serveur avec le nouveau fichier
node server_o2switch.js
```

### 5. **Build du frontend**

```bash
# Aller dans le dossier frontend
cd fronted

# Installer les dépendances
npm install

# Compiler le React
npm run build

# Les fichiers compilés iront dans `fronted/dist/`
```

### 6. **Configurer le domaine**

1. Pointer le domaine `ryd.tondomaine.com` vers le serveur Node.js
2. Le serveur servira automatiquement :
   - `/` → Application React (fronted/dist)
   - `/api/*` → API REST

### 7. **Accès à l'app**

```
https://ryd.tondomaine.com → Application complète
https://ryd.tondomaine.com/api/missions → Données API
https://ryd.tondomaine.com/signature → Page de signature
```

## Avantages de cette approche

✅ Un seul serveur à gérer
✅ Une seule URL (`ryd.tondomaine.com`)
✅ Pas de configuration CORS compliquée
✅ Signatures fonctionnent correctement
✅ PDFs stockés localement sur le serveur

## Déploiement ultérieur

Pour mettre à jour le code :
```bash
# Pull les changements
git pull origin main

# Rebuild le frontend
cd fronted && npm run build && cd ..

# Redémarrer le serveur
pm2 restart server_o2switch
# ou
node backend/server_o2switch.js
```

## Contact & Support

Si problèmes d'accès MySQL sur O2Switch, contacter le support O2Switch.
Ils fourniront l'host MySQL exact (peut ne pas être `localhost`).

## Notes supplémentaires

- Les signatures sont sauvegardées en base64 dans MySQL
- Les PDFs sont générés dans `/backend/archives/`
- Tout est servi par Express directement
- Aucune dépendance externe (Vercel, Railway) nécessaire

