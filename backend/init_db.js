const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT,
    prenom TEXT,
    telephone TEXT,
    email TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS vehicules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    marque TEXT,
    modele TEXT,
    immatriculation TEXT,
    statut TEXT DEFAULT 'disponible'
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS equipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT,
    chauffeur1_nom TEXT,
    chauffeur1_telephone TEXT,
    chauffeur2_nom TEXT,
    chauffeur2_telephone TEXT,
    vehicule_marque TEXT,
    vehicule_modele TEXT,
    vehicule_immatriculation TEXT,
    province_initiale TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS missions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER,
    vehicule_id INTEGER,
    equipe_id INTEGER,
    heure_depart TEXT,
    heure_arrivee TEXT,
    lieu_depart TEXT,
    lieu_arrivee TEXT,
    province TEXT,
    notes TEXT,
    statut TEXT DEFAULT 'planifiée',
    date_creation DATETIME,
    date_cloture DATETIME,
    pdf_appel TEXT,
    pdf_cloture TEXT,
    signature_debut LONGTEXT,
    signature_fin LONGTEXT,
    FOREIGN KEY(client_id) REFERENCES clients(id),
    FOREIGN KEY(vehicule_id) REFERENCES vehicules(id),
    FOREIGN KEY(equipe_id) REFERENCES equipes(id)
  )`);
});

db.close(() => {
  console.log('Base de données initialisée: data.db');
});
