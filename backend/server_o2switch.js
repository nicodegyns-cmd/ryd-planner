const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');

const app = express();
const archivesDir = path.join(__dirname, 'archives');

// Configuration MySQL
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ryd_planner',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool;

// Initialiser le pool de connexions
async function initDB() {
  try {
    pool = await mysql.createPool(dbConfig);
    console.log('✓ Connecté à MySQL');
  } catch (error) {
    console.error('✗ Erreur de connexion MySQL:', error);
    process.exit(1);
  }
}

// Helper pour exécuter les requêtes
async function query(sql, values = []) {
  const connection = await pool.getConnection();
  try {
    const [results] = await connection.execute(sql, values);
    return results;
  } finally {
    connection.release();
  }
}

// Créer dossier archives s'il n'existe pas
if (!fs.existsSync(archivesDir)) {
  fs.mkdirSync(archivesDir, { recursive: true });
}

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// --- SERVIR LE FRONTEND COMPILÉ ---
const frontendBuildPath = path.join(__dirname, '..', 'fronted', 'dist');
app.use(express.static(frontendBuildPath));

// --- Clients ---
app.get('/api/clients', async (req, res) => {
  try {
    const clients = await query('SELECT * FROM clients ORDER BY id DESC');
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/clients', async (req, res) => {
  try {
    const { nom, prenom, telephone, email } = req.body;
    const result = await query(
      'INSERT INTO clients (nom, prenom, telephone, email) VALUES (?, ?, ?, ?)',
      [nom, prenom, telephone, email]
    );
    const client = await query('SELECT * FROM clients WHERE id = ?', [result.insertId]);
    res.json(client[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Véhicules ---
app.get('/api/vehicules', async (req, res) => {
  try {
    const vehicules = await query('SELECT * FROM vehicules ORDER BY id DESC');
    res.json(vehicules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/vehicules', async (req, res) => {
  try {
    const { marque, modele, immatriculation } = req.body;
    const result = await query(
      'INSERT INTO vehicules (marque, modele, immatriculation) VALUES (?, ?, ?)',
      [marque, modele, immatriculation]
    );
    const vehicule = await query('SELECT * FROM vehicules WHERE id = ?', [result.insertId]);
    res.json(vehicule[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/vehicules/:id/status', async (req, res) => {
  try {
    const { statut } = req.body;
    await query('UPDATE vehicules SET statut = ? WHERE id = ?', [statut, req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Équipes ---
app.get('/api/equipes', async (req, res) => {
  try {
    const equipes = await query('SELECT * FROM equipes ORDER BY id DESC');
    res.json(equipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/equipes', async (req, res) => {
  try {
    const { nom, chauffeur1_nom, chauffeur1_telephone, chauffeur2_nom, chauffeur2_telephone, vehicule_marque, vehicule_modele, vehicule_immatriculation, province_initiale } = req.body;
    const result = await query(
      'INSERT INTO equipes (nom, chauffeur1_nom, chauffeur1_telephone, chauffeur2_nom, chauffeur2_telephone, vehicule_marque, vehicule_modele, vehicule_immatriculation, province_initiale) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [nom, chauffeur1_nom, chauffeur1_telephone, chauffeur2_nom, chauffeur2_telephone, vehicule_marque, vehicule_modele, vehicule_immatriculation, province_initiale]
    );
    const equipe = await query('SELECT * FROM equipes WHERE id = ?', [result.insertId]);
    res.json(equipe[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/equipes/:id', async (req, res) => {
  try {
    const { nom, chauffeur1_nom, chauffeur1_telephone, chauffeur2_nom, chauffeur2_telephone, vehicule_marque, vehicule_modele, vehicule_immatriculation, province_initiale } = req.body;
    await query(
      'UPDATE equipes SET nom = ?, chauffeur1_nom = ?, chauffeur1_telephone = ?, chauffeur2_nom = ?, chauffeur2_telephone = ?, vehicule_marque = ?, vehicule_modele = ?, vehicule_immatriculation = ?, province_initiale = ? WHERE id = ?',
      [nom, chauffeur1_nom, chauffeur1_telephone, chauffeur2_nom, chauffeur2_telephone, vehicule_marque, vehicule_modele, vehicule_immatriculation, province_initiale, req.params.id]
    );
    const equipe = await query('SELECT * FROM equipes WHERE id = ?', [req.params.id]);
    res.json(equipe[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/equipes/:id', async (req, res) => {
  try {
    await query('DELETE FROM equipes WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Missions ---
app.get('/api/missions', async (req, res) => {
  try {
    const sql = `SELECT m.*, c.nom AS client_nom, c.prenom AS client_prenom, c.telephone, c.email,
                 v.marque AS veh_marque, v.modele AS veh_modele, v.immatriculation AS veh_immat,
                 e.nom AS equipe_nom, e.chauffeur1_nom, e.chauffeur1_telephone, e.chauffeur2_nom, e.chauffeur2_telephone
                 FROM missions m
                 LEFT JOIN clients c ON m.client_id = c.id
                 LEFT JOIN vehicules v ON m.vehicule_id = v.id
                 LEFT JOIN equipes e ON m.equipe_id = e.id
                 ORDER BY m.id DESC`;
    const missions = await query(sql);
    res.json(missions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/missions/:id', async (req, res) => {
  try {
    const sql = `SELECT m.*, c.nom AS client_nom, c.prenom AS client_prenom, c.telephone, c.email,
                 v.marque AS veh_marque, v.modele AS veh_modele, v.immatriculation AS veh_immat,
                 e.nom AS equipe_nom, e.chauffeur1_nom, e.chauffeur1_telephone, e.chauffeur2_nom, e.chauffeur2_telephone
                 FROM missions m
                 LEFT JOIN clients c ON m.client_id = c.id
                 LEFT JOIN vehicules v ON m.vehicule_id = v.id
                 LEFT JOIN equipes e ON m.equipe_id = e.id
                 WHERE m.id = ?`;
    const missions = await query(sql, [req.params.id]);
    if (!missions.length) {
      return res.status(404).json({ error: 'Mission non trouvée' });
    }
    res.json(missions[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/missions', async (req, res) => {
  try {
    const { client_id, vehicule_id, equipe_id, lieu_depart, lieu_arrivee, notes } = req.body;
    const result = await query(
      `INSERT INTO missions (client_id, vehicule_id, equipe_id, lieu_depart, lieu_arrivee, notes, statut, date_creation)
       VALUES (?, ?, ?, ?, ?, ?, 'planifiée', NOW())`,
      [client_id, vehicule_id, equipe_id, lieu_depart, lieu_arrivee, notes]
    );
    await query('UPDATE vehicules SET statut = ? WHERE id = ?', ['en mission', vehicule_id]);
    const mission = await query('SELECT * FROM missions WHERE id = ?', [result.insertId]);
    res.json(mission[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/missions/:id/status', async (req, res) => {
  try {
    const { statut, equipe_id } = req.body;
    const id = req.params.id;
    const missions = await query('SELECT * FROM missions WHERE id = ?', [id]);
    const mission = missions[0];
    
    if (!mission) {
      return res.status(404).json({ error: 'Mission non trouvée' });
    }

    if (statut === 'terminée' && mission.statut !== 'terminée') {
      const updateSQL = equipe_id 
        ? 'UPDATE missions SET statut = ?, equipe_id = ?, date_cloture = NOW() WHERE id = ?'
        : 'UPDATE missions SET statut = ?, date_cloture = NOW() WHERE id = ?';
      const params = equipe_id 
        ? [statut, equipe_id, id]
        : [statut, id];
      
      await query(updateSQL, params);
      
      // Générer le PDF de clôture
      setTimeout(() => {
        generateClosurePDF(id);
      }, 100);
      
      res.json({ success: true });
    } else {
      const updateSQL = equipe_id 
        ? 'UPDATE missions SET statut = ?, equipe_id = ? WHERE id = ?'
        : 'UPDATE missions SET statut = ? WHERE id = ?';
      const params = equipe_id 
        ? [statut, equipe_id, id]
        : [statut, id];
      
      await query(updateSQL, params);
      res.json({ success: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/missions/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { client_nom, client_prenom, telephone, lieu_depart, lieu_arrivee, heure_depart, heure_arrivee, veh_marque, veh_modele, veh_immat, notes, province } = req.body;
    
    await query(
      `UPDATE missions SET lieu_depart = ?, lieu_arrivee = ?, notes = ?, province = ? WHERE id = ?`,
      [lieu_depart, lieu_arrivee, notes, province, id]
    );
    
    const missions = await query('SELECT * FROM missions WHERE id = ?', [id]);
    const mission = missions[0];
    
    if (mission && mission.client_id && (client_nom || client_prenom || telephone)) {
      await query(
        `UPDATE clients SET nom = ?, prenom = ?, telephone = ? WHERE id = ?`,
        [client_nom, client_prenom, telephone, mission.client_id]
      );
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Génération PDF PRISE D'APPEL ---
app.post('/api/missions/:id/generer-pdf-appel', async (req, res) => {
  try {
    const id = req.params.id;
    const fileName = await generateCallPDF(id);
    res.json({ success: true, fileName, url: `/archives/${fileName}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Génération PDF FIN DE MISSION ---
app.post('/api/missions/:id/generer-pdf-cloture', async (req, res) => {
  try {
    const id = req.params.id;
    const fileName = await generateClosurePDF(id);
    res.json({ success: true, fileName, url: `/archives/${fileName}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fonction pour générer PDF d'appel
async function generateCallPDF(missionId) {
  const missions = await query(
    `SELECT m.*, c.nom AS client_nom, c.prenom AS client_prenom, c.telephone, c.email
     FROM missions m
     LEFT JOIN clients c ON m.client_id = c.id
     WHERE m.id = ?`,
    [missionId]
  );
  
  if (!missions.length) throw new Error('Mission non trouvée');
  
  const mission = missions[0];
  const fileName = `appel_mission_${missionId}_${Date.now()}.pdf`;
  const filePath = path.join(archivesDir, fileName);
  const logoPath = path.join(__dirname, '..', 'fronted', 'public', 'logo-ryd.png');
  
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);
    
    doc.pipe(stream);
    
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 30, { width: 60, height: 60 });
    }
    
    doc.fontSize(24).font('Helvetica-Bold').text('PRISE D\'APPEL', 130, 45);
    doc.fontSize(14).font('Helvetica-Bold').text(`Mission N° ${mission.id}`, 130, 80);
    
    const creationDate = new Date(mission.date_creation);
    const formattedDate = creationDate.toLocaleDateString('fr-FR');
    const formattedTime = creationDate.toLocaleTimeString('fr-FR');
    doc.fontSize(10).font('Helvetica').text(`Créée le: ${formattedDate} à ${formattedTime}`, 130, 105);
    
    doc.moveTo(50, 130).lineTo(550, 130).stroke();
    
    doc.fontSize(12).font('Helvetica-Bold').text('PROPRIÉTAIRE DU VÉHICULE', 50, 150);
    doc.fontSize(10).font('Helvetica');
    doc.text(`Nom: ${mission.client_nom} ${mission.client_prenom}`, 50, 170);
    doc.text(`Téléphone: ${mission.telephone || 'N/A'}`, 50, 185);
    
    if (mission.notes) {
      doc.fontSize(12).font('Helvetica-Bold').text('DÉTAILS DE LA DÉCLARATION', 50, 215);
      doc.fontSize(9).font('Helvetica').text(mission.notes, 50, 235, { width: 500, align: 'left' });
    }
    
    const pageHeight = doc.page.height;
    doc.moveTo(50, pageHeight - 60).lineTo(550, pageHeight - 60).stroke();
    doc.fontSize(9).font('Helvetica').text('RYD Planner - Système de Gestion de Missions', 50, pageHeight - 50, { align: 'center' });
    doc.fontSize(8).font('Helvetica').text(`Page 1 - Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 50, pageHeight - 35, { align: 'center' });
    doc.text('Confidentiel - Document d\'archivage', 50, pageHeight - 20, { align: 'center' });
    
    doc.end();
    
    stream.on('finish', async () => {
      await query('UPDATE missions SET pdf_appel = ? WHERE id = ?', [fileName, missionId]);
      resolve(fileName);
    });
    
    stream.on('error', reject);
  });
}

// Fonction pour générer PDF de clôture
async function generateClosurePDF(missionId) {
  const missions = await query(
    `SELECT m.*, c.nom AS client_nom, c.prenom AS client_prenom, c.telephone,
     e.nom AS equipe_nom, e.chauffeur1_nom, e.chauffeur1_telephone
     FROM missions m
     LEFT JOIN clients c ON m.client_id = c.id
     LEFT JOIN equipes e ON m.equipe_id = e.id
     WHERE m.id = ?`,
    [missionId]
  );
  
  if (!missions.length) throw new Error('Mission non trouvée');
  
  const mission = missions[0];
  const fileName = `cloture_mission_${missionId}_${Date.now()}.pdf`;
  const filePath = path.join(archivesDir, fileName);
  const logoPath = path.join(__dirname, '..', 'fronted', 'public', 'logo-ryd.png');
  
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);
    
    doc.pipe(stream);
    
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 30, { width: 60, height: 60 });
    }
    
    doc.fontSize(24).font('Helvetica-Bold').text('FIN DE MISSION', 130, 45);
    doc.fontSize(14).font('Helvetica-Bold').text(`Mission N° ${mission.id}`, 130, 80);
    
    const closureDate = new Date(mission.date_cloture);
    const formattedCloseDate = closureDate.toLocaleDateString('fr-FR');
    const formattedCloseTime = closureDate.toLocaleTimeString('fr-FR');
    doc.fontSize(10).font('Helvetica').text(`Clôturée le: ${formattedCloseDate} à ${formattedCloseTime}`, 130, 105);
    
    doc.moveTo(50, 130).lineTo(550, 130).stroke();
    
    doc.fontSize(12).font('Helvetica-Bold').text('PROPRIÉTAIRE', 50, 150);
    doc.fontSize(10).font('Helvetica');
    doc.text(`${mission.client_nom} ${mission.client_prenom}`, 50, 170);
    doc.text(`Téléphone: ${mission.telephone || 'N/A'}`, 50, 185);
    
    doc.fontSize(12).font('Helvetica-Bold').text('ÉQUIPE AFFECTÉE', 50, 215);
    doc.fontSize(10).font('Helvetica');
    doc.text(`Équipe: ${mission.equipe_nom || 'Non assignée'}`, 50, 235);
    doc.text(`Chauffeur: ${mission.chauffeur1_nom || 'N/A'}`, 50, 250);
    
    doc.fontSize(12).font('Helvetica-Bold').text('VALIDATION', 50, 285);
    doc.fontSize(10).font('Helvetica');
    doc.text('Signature: _____________________', 50, 310);
    doc.text('Observations:', 50, 335);
    doc.rect(50, 345, 500, 80).stroke();
    
    const pageHeight = doc.page.height;
    doc.moveTo(50, pageHeight - 60).lineTo(550, pageHeight - 60).stroke();
    doc.fontSize(9).font('Helvetica').text('RYD Planner - Système de Gestion de Missions', 50, pageHeight - 50, { align: 'center' });
    doc.fontSize(8).font('Helvetica').text(`Page 1 - Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 50, pageHeight - 35, { align: 'center' });
    doc.text('Confidentiel - Document d\'archivage', 50, pageHeight - 20, { align: 'center' });
    
    doc.end();
    
    stream.on('finish', async () => {
      await query('UPDATE missions SET pdf_cloture = ? WHERE id = ?', [fileName, missionId]);
      resolve(fileName);
    });
    
    stream.on('error', reject);
  });
}

// Servir les archives
app.use('/archives', express.static(archivesDir));

// --- Signatures ---
app.post('/api/missions/:id/signature', async (req, res) => {
  try {
    const id = req.params.id;
    const { stage, signature } = req.body;
    const column = stage === 'debut' ? 'signature_debut' : 'signature_fin';
    
    await query(`UPDATE missions SET ${column} = ? WHERE id = ?`, [signature, id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/missions-archives', async (req, res) => {
  try {
    const sql = `SELECT m.*, c.nom AS client_nom, c.prenom AS client_prenom, c.telephone, c.email,
                 v.marque AS veh_marque, v.modele AS veh_modele, v.immatriculation AS veh_immat,
                 e.nom AS equipe_nom, e.chauffeur1_nom, e.chauffeur1_telephone, e.chauffeur2_nom, e.chauffeur2_telephone
                 FROM missions m
                 LEFT JOIN clients c ON m.client_id = c.id
                 LEFT JOIN vehicules v ON m.vehicule_id = v.id
                 LEFT JOIN equipes e ON m.equipe_id = e.id
                 WHERE m.pdf_appel IS NOT NULL OR m.pdf_cloture IS NOT NULL
                 ORDER BY m.id DESC`;
    const missions = await query(sql);
    res.json(missions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/missions/:id/delete-pdf', async (req, res) => {
  try {
    const { fileName } = req.body;
    const filePath = path.join(archivesDir, fileName);
    
    fs.unlink(filePath, (err) => {
      if (err && err.code !== 'ENOENT') {
        return res.status(500).json({ error: 'Erreur lors de la suppression du fichier' });
      }
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- SPA fallback - Serve index.html for unknown routes ---
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

// --- Démarrage ---
const PORT = process.env.PORT || 3000;

async function start() {
  await initDB();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✓ Serveur RYD Planner démarré sur http://0.0.0.0:${PORT}`);
  });
}

start().catch(error => {
  console.error('Erreur au démarrage:', error);
  process.exit(1);
});
