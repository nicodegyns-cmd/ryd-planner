const mysql = require('mysql2/promise');

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ryd_planner',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

async function initDB() {
  try {
    // Connexion sans DB pour la créer
    const connection = await mysql.createConnection({
      host: config.host,
      user: config.user,
      password: config.password
    });

    // Créer la DB
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${config.database}`);
    console.log(`Database ${config.database} created or already exists`);
    await connection.end();

    // Reconnexion à la DB
    const pool = await mysql.createPool(config);
    const conn = await pool.getConnection();

    // Créer les tables
    const tables = [
      `CREATE TABLE IF NOT EXISTS clients (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nom VARCHAR(255),
        prenom VARCHAR(255),
        telephone VARCHAR(20),
        email VARCHAR(255)
      )`,

      `CREATE TABLE IF NOT EXISTS vehicules (
        id INT AUTO_INCREMENT PRIMARY KEY,
        marque VARCHAR(255),
        modele VARCHAR(255),
        immatriculation VARCHAR(20),
        statut VARCHAR(50) DEFAULT 'disponible'
      )`,

      `CREATE TABLE IF NOT EXISTS equipes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nom VARCHAR(255),
        chauffeur1_nom VARCHAR(255),
        chauffeur1_telephone VARCHAR(20),
        chauffeur2_nom VARCHAR(255),
        chauffeur2_telephone VARCHAR(20),
        vehicule_marque VARCHAR(255),
        vehicule_modele VARCHAR(255),
        vehicule_immatriculation VARCHAR(20),
        province_initiale VARCHAR(255)
      )`,

      `CREATE TABLE IF NOT EXISTS missions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        client_id INT,
        vehicule_id INT,
        equipe_id INT,
        heure_depart VARCHAR(5),
        heure_arrivee VARCHAR(5),
        lieu_depart VARCHAR(255),
        lieu_arrivee VARCHAR(255),
        province VARCHAR(255),
        notes LONGTEXT,
        statut VARCHAR(50) DEFAULT 'planifiée',
        date_creation DATETIME,
        date_cloture DATETIME,
        pdf_appel LONGTEXT,
        pdf_cloture LONGTEXT,
        signature_debut LONGTEXT,
        signature_fin LONGTEXT,
        FOREIGN KEY(client_id) REFERENCES clients(id),
        FOREIGN KEY(vehicule_id) REFERENCES vehicules(id),
        FOREIGN KEY(equipe_id) REFERENCES equipes(id)
      )`
    ];

    for (const sql of tables) {
      await conn.execute(sql);
    }

    console.log('Toutes les tables ont été créées avec succès !');
    await conn.end();
    process.exit(0);

  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la DB:', error);
    process.exit(1);
  }
}

initDB();
