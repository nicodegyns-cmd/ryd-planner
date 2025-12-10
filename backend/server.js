const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');

const app = express();
const dbFile = path.join(__dirname, 'data.db');
const archivesDir = path.join(__dirname, 'archives');
const db = new sqlite3.Database(dbFile);

// Créer dossier archives s'il n'existe pas
if (!fs.existsSync(archivesDir)) {
  fs.mkdirSync(archivesDir, { recursive: true });
}

app.use(cors());
app.use(bodyParser.json());

// --- Clients ---
app.get('/api/clients', (req, res) => {
  db.all('SELECT * FROM clients ORDER BY id DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/clients', (req, res) => {
  const { nom, prenom, telephone, email } = req.body;
  db.run(
    'INSERT INTO clients (nom, prenom, telephone, email) VALUES (?, ?, ?, ?)',
    [nom, prenom, telephone, email],
    function(err){
      if (err) return res.status(500).json({ error: err.message });
      db.get('SELECT * FROM clients WHERE id = ?', [this.lastID], (e, row) => {
        res.json(row);
      });
    }
  );
});

// --- Véhicules ---
app.get('/api/vehicules', (req, res) => {
  db.all('SELECT * FROM vehicules ORDER BY id DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/vehicules', (req, res) => {
  const { marque, modele, immatriculation } = req.body;
  db.run(
    'INSERT INTO vehicules (marque, modele, immatriculation) VALUES (?, ?, ?)',
    [marque, modele, immatriculation],
    function(err){
      if (err) return res.status(500).json({ error: err.message });
      db.get('SELECT * FROM vehicules WHERE id = ?', [this.lastID], (e, row) => {
        res.json(row);
      });
    }
  );
});

app.put('/api/vehicules/:id/status', (req, res) => {
  const id = req.params.id;
  const { statut } = req.body;
  db.run('UPDATE vehicules SET statut = ? WHERE id = ?', [statut, id], function(err){
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// --- Équipes ---
app.get('/api/equipes', (req, res) => {
  db.all('SELECT * FROM equipes ORDER BY id DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/equipes', (req, res) => {
  const { nom, chauffeur1_nom, chauffeur1_telephone, chauffeur2_nom, chauffeur2_telephone, vehicule_marque, vehicule_modele, vehicule_immatriculation, province_initiale } = req.body;
  db.run(
    'INSERT INTO equipes (nom, chauffeur1_nom, chauffeur1_telephone, chauffeur2_nom, chauffeur2_telephone, vehicule_marque, vehicule_modele, vehicule_immatriculation, province_initiale) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [nom, chauffeur1_nom, chauffeur1_telephone, chauffeur2_nom, chauffeur2_telephone, vehicule_marque, vehicule_modele, vehicule_immatriculation, province_initiale],
    function(err){
      if (err) return res.status(500).json({ error: err.message });
      db.get('SELECT * FROM equipes WHERE id = ?', [this.lastID], (e, row) => {
        res.json(row);
      });
    }
  );
});

app.put('/api/equipes/:id', (req, res) => {
  const { nom, chauffeur1_nom, chauffeur1_telephone, chauffeur2_nom, chauffeur2_telephone, vehicule_marque, vehicule_modele, vehicule_immatriculation, province_initiale } = req.body;
  db.run(
    'UPDATE equipes SET nom = ?, chauffeur1_nom = ?, chauffeur1_telephone = ?, chauffeur2_nom = ?, chauffeur2_telephone = ?, vehicule_marque = ?, vehicule_modele = ?, vehicule_immatriculation = ?, province_initiale = ? WHERE id = ?',
    [nom, chauffeur1_nom, chauffeur1_telephone, chauffeur2_nom, chauffeur2_telephone, vehicule_marque, vehicule_modele, vehicule_immatriculation, province_initiale, req.params.id],
    function(err){
      if (err) return res.status(500).json({ error: err.message });
      db.get('SELECT * FROM equipes WHERE id = ?', [req.params.id], (e, row) => {
        res.json(row);
      });
    }
  );
});

app.delete('/api/equipes/:id', (req, res) => {
  db.run('DELETE FROM equipes WHERE id = ?', [req.params.id], function(err){
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// --- Missions ---
app.get('/api/missions', (req, res) => {
  const sql = `SELECT m.*, c.nom AS client_nom, c.prenom AS client_prenom, c.telephone, c.email,
               v.marque AS veh_marque, v.modele AS veh_modele, v.immatriculation AS veh_immat,
               e.nom AS equipe_nom, e.chauffeur1_nom, e.chauffeur1_telephone, e.chauffeur2_nom, e.chauffeur2_telephone
               FROM missions m
               LEFT JOIN clients c ON m.client_id = c.id
               LEFT JOIN vehicules v ON m.vehicule_id = v.id
               LEFT JOIN equipes e ON m.equipe_id = e.id
               ORDER BY m.id DESC`;
  db.all(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Récupérer une mission par ID (pour la page de signature)
app.get('/api/missions/:id', (req, res) => {
  const sql = `SELECT m.*, c.nom AS client_nom, c.prenom AS client_prenom, c.telephone, c.email,
               v.marque AS veh_marque, v.modele AS veh_modele, v.immatriculation AS veh_immat,
               e.nom AS equipe_nom, e.chauffeur1_nom, e.chauffeur1_telephone, e.chauffeur2_nom, e.chauffeur2_telephone
               FROM missions m
               LEFT JOIN clients c ON m.client_id = c.id
               LEFT JOIN vehicules v ON m.vehicule_id = v.id
               LEFT JOIN equipes e ON m.equipe_id = e.id
               WHERE m.id = ?`;
  db.get(sql, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Mission non trouvée' });
    res.json(row);
  });
});

app.post('/api/missions', (req, res) => {
  const { client_id, vehicule_id, equipe_id, lieu_depart, lieu_arrivee, notes } = req.body;
  db.run(
    `INSERT INTO missions (client_id, vehicule_id, equipe_id, lieu_depart, lieu_arrivee, notes, statut, date_creation)
     VALUES (?, ?, ?, ?, ?, ?, 'planifiée', datetime('now'))`,
    [client_id, vehicule_id, equipe_id, lieu_depart, lieu_arrivee, notes],
    function(err){
      if (err) return res.status(500).json({ error: err.message });
      // set vehicle status to 'en mission'
      db.run('UPDATE vehicules SET statut = ? WHERE id = ?', ['en mission', vehicule_id]);
      db.get('SELECT * FROM missions WHERE id = ?', [this.lastID], (e, row) => res.json(row));
    }
  );
});

app.put('/api/missions/:id/status', (req, res) => {
  const id = req.params.id;
  const { statut, equipe_id } = req.body;
  db.get('SELECT * FROM missions WHERE id = ?', [id], (err, mission) => {
    if (err || !mission) return res.status(404).json({ error: 'Mission non trouvée' });
    
    // Si on passe à "terminée", générer le PDF de clôture
    if (statut === 'terminée' && mission.statut !== 'terminée') {
      const updateSQL = equipe_id 
        ? 'UPDATE missions SET statut = ?, equipe_id = ?, date_cloture = datetime("now") WHERE id = ?'
        : 'UPDATE missions SET statut = ?, date_cloture = datetime("now") WHERE id = ?';
      const params = equipe_id 
        ? [statut, equipe_id, id]
        : [statut, id];
      
      db.run(updateSQL, params, function(e){
        if (e) return res.status(500).json({ error: e.message });
        // Générer automatiquement le PDF de clôture
        setTimeout(() => {
          fetch(`http://localhost:3000/api/missions/${id}/generer-pdf-cloture`, {
            method: 'POST'
          }).then(r => r.json()).then(data => {
            console.log(`[STATUS] PDF cloture généré pour mission #${id}`);
          }).catch(err => {
            console.error(`[STATUS] Erreur génération PDF cloture:`, err);
          });
        }, 100);
        res.json({ success: true });
      });
    } else {
      const updateSQL = equipe_id 
        ? 'UPDATE missions SET statut = ?, equipe_id = ? WHERE id = ?'
        : 'UPDATE missions SET statut = ? WHERE id = ?';
      const params = equipe_id 
        ? [statut, equipe_id, id]
        : [statut, id];
      
      db.run(updateSQL, params, function(e){
        if (e) return res.status(500).json({ error: e.message });
        res.json({ success: true });
      });
    }
  });
});

// --- Édition d'une mission ---
app.put('/api/missions/:id', (req, res) => {
  const id = req.params.id;
  const { client_nom, client_prenom, telephone, lieu_depart, lieu_arrivee, heure_depart, heure_arrivee, veh_marque, veh_modele, veh_immat, notes, province } = req.body;
  
  db.run(
    `UPDATE missions SET 
      lieu_depart = ?, lieu_arrivee = ?, notes = ?, province = ?
     WHERE id = ?`,
    [lieu_depart, lieu_arrivee, notes, province, id],
    function(err){
      if (err) return res.status(500).json({ error: err.message });
      
      // Aussi mettre à jour le client si fourni
      if (client_nom || client_prenom || telephone) {
        db.get('SELECT client_id FROM missions WHERE id = ?', [id], (e, mission) => {
          if (mission && mission.client_id) {
            db.run(
              `UPDATE clients SET nom = ?, prenom = ?, telephone = ? WHERE id = ?`,
              [client_nom, client_prenom, telephone, mission.client_id],
              (err) => {
                if (err) console.error('Erreur update client:', err);
              }
            );
          }
        });
      }
      
      res.json({ success: true });
    }
  );
});

// --- Génération PDF PRISE D'APPEL (à la création) ---
app.post('/api/missions/:id/generer-pdf-appel', (req, res) => {
  const id = req.params.id;
  console.log(`[PDF APPEL] Génération du PDF Prise d'appel pour la mission #${id}...`);
  const sql = `SELECT m.*, c.nom AS client_nom, c.prenom AS client_prenom, c.telephone, c.email
               FROM missions m
               LEFT JOIN clients c ON m.client_id = c.id
               WHERE m.id = ?`;
  
  db.get(sql, [id], (err, mission) => {
    if (err) {
      console.error(`[PDF APPEL] Erreur SQL: ${err.message}`);
      return res.status(500).json({ error: 'Erreur base de données' });
    }
    if (!mission) {
      console.error(`[PDF APPEL] Mission #${id} non trouvée en base`);
      return res.status(404).json({ error: 'Mission non trouvée' });
    }
    
    console.log(`[PDF APPEL] Mission trouvée, client: ${mission.client_nom} ${mission.client_prenom}`);
    
    // Créer le PDF
    const fileName = `appel_mission_${id}_${Date.now()}.pdf`;
    const filePath = path.join(archivesDir, fileName);
    const logoPath = path.join(__dirname, '..', 'fronted', 'public', 'logo-ryd.png');
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);
    
    console.log(`[PDF APPEL] Création du fichier: ${filePath}`);
    
    doc.pipe(stream);
    
    // Logo en haut à gauche
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 30, { width: 60, height: 60 });
    }
    
    // En-tête avec titre
    doc.fontSize(24).font('Helvetica-Bold').text('PRISE D\'APPEL', 130, 45);
    doc.fontSize(14).font('Helvetica-Bold').text(`Mission N° ${mission.id}`, 130, 80);
    
    const creationDate = new Date(mission.date_creation);
    const formattedDate = creationDate.toLocaleDateString('fr-FR');
    const formattedTime = creationDate.toLocaleTimeString('fr-FR');
    doc.fontSize(10).font('Helvetica').text(`Créée le: ${formattedDate} à ${formattedTime}`, 130, 105);
    
    // Ligne de séparation
    doc.moveTo(50, 130).lineTo(550, 130).stroke();
    
    // Infos client
    doc.fontSize(12).font('Helvetica-Bold').text('PROPRIÉTAIRE DU VÉHICULE', 50, 150);
    doc.fontSize(10).font('Helvetica');
    doc.text(`Nom: ${mission.client_nom} ${mission.client_prenom}`, 50, 170);
    doc.text(`Téléphone: ${mission.telephone || 'N/A'}`, 50, 185);
    
    // Notes (contiennent toutes les données collectées)
    if (mission.notes) {
      doc.fontSize(12).font('Helvetica-Bold').text('DÉTAILS DE LA DÉCLARATION', 50, 215);
      doc.fontSize(9).font('Helvetica').text(mission.notes, 50, 235, { width: 500, align: 'left' });
    }
    
    // Pied de page
    const pageHeight = doc.page.height;
    doc.moveTo(50, pageHeight - 60).lineTo(550, pageHeight - 60).stroke();
    doc.fontSize(9).font('Helvetica').text('RYD Planner - Système de Gestion de Missions', 50, pageHeight - 50, { align: 'center' });
    doc.fontSize(8).font('Helvetica').text(`Page 1 - Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 50, pageHeight - 35, { align: 'center' });
    doc.text('Confidentiel - Document d\'archivage', 50, pageHeight - 20, { align: 'center' });
    
    doc.end();
    
    stream.on('finish', () => {
      console.log(`[PDF APPEL] Fichier créé avec succès: ${fileName}`);
      // Sauvegarder le nom du fichier PDF dans la base de données
      db.run('UPDATE missions SET pdf_appel = ? WHERE id = ?', [fileName, id], (err) => {
        if (err) {
          console.error(`[PDF APPEL] Erreur lors de la sauvegarde:`, err);
        } else {
          console.log(`[PDF APPEL] Mission #${id} mise à jour: ${fileName}`);
        }
      });
      res.json({ success: true, fileName, url: `/archives/${fileName}` });
    });
    
    stream.on('error', (err) => {
      console.error(`[PDF APPEL] Erreur lors de la création du stream:`, err);
      res.status(500).json({ error: err.message });
    });
  });
});

// --- Génération PDF FIN DE MISSION (à la clôture) ---
app.post('/api/missions/:id/generer-pdf-cloture', (req, res) => {
  const id = req.params.id;
  console.log(`[PDF CLOTURE] Génération du PDF Fin de mission pour la mission #${id}...`);
  const sql = `SELECT m.*, c.nom AS client_nom, c.prenom AS client_prenom, c.telephone,
               e.nom AS equipe_nom, e.chauffeur1_nom, e.chauffeur1_telephone
               FROM missions m
               LEFT JOIN clients c ON m.client_id = c.id
               LEFT JOIN equipes e ON m.equipe_id = e.id
               WHERE m.id = ?`;
  
  db.get(sql, [id], (err, mission) => {
    if (err) {
      console.error(`[PDF CLOTURE] Erreur SQL: ${err.message}`);
      return res.status(500).json({ error: 'Erreur base de données' });
    }
    if (!mission) {
      console.error(`[PDF CLOTURE] Mission #${id} non trouvée en base`);
      return res.status(404).json({ error: 'Mission non trouvée' });
    }
    
    console.log(`[PDF CLOTURE] Mission trouvée, client: ${mission.client_nom} ${mission.client_prenom}`);
    
    // Créer le PDF
    const fileName = `cloture_mission_${id}_${Date.now()}.pdf`;
    const filePath = path.join(archivesDir, fileName);
    const logoPath = path.join(__dirname, '..', 'fronted', 'public', 'logo-ryd.png');
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);
    
    console.log(`[PDF CLOTURE] Création du fichier: ${filePath}`);
    
    doc.pipe(stream);
    
    // Logo en haut à gauche
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 30, { width: 60, height: 60 });
    }
    
    // En-tête avec titre
    doc.fontSize(24).font('Helvetica-Bold').text('FIN DE MISSION', 130, 45);
    doc.fontSize(14).font('Helvetica-Bold').text(`Mission N° ${mission.id}`, 130, 80);
    
    const closureDate = new Date(mission.date_cloture);
    const formattedCloseDate = closureDate.toLocaleDateString('fr-FR');
    const formattedCloseTime = closureDate.toLocaleTimeString('fr-FR');
    doc.fontSize(10).font('Helvetica').text(`Clôturée le: ${formattedCloseDate} à ${formattedCloseTime}`, 130, 105);
    
    // Ligne de séparation
    doc.moveTo(50, 130).lineTo(550, 130).stroke();
    
    // Infos client
    doc.fontSize(12).font('Helvetica-Bold').text('PROPRIÉTAIRE', 50, 150);
    doc.fontSize(10).font('Helvetica');
    doc.text(`${mission.client_nom} ${mission.client_prenom}`, 50, 170);
    doc.text(`Téléphone: ${mission.telephone || 'N/A'}`, 50, 185);
    
    // Équipe
    doc.fontSize(12).font('Helvetica-Bold').text('ÉQUIPE AFFECTÉE', 50, 215);
    doc.fontSize(10).font('Helvetica');
    doc.text(`Équipe: ${mission.equipe_nom || 'Non assignée'}`, 50, 235);
    doc.text(`Chauffeur: ${mission.chauffeur1_nom || 'N/A'}`, 50, 250);
    
    // Signature et observations
    doc.fontSize(12).font('Helvetica-Bold').text('VALIDATION', 50, 285);
    doc.fontSize(10).font('Helvetica');
    doc.text('Signature: _____________________', 50, 310);
    doc.text('Observations:', 50, 335);
    doc.rect(50, 345, 500, 80).stroke();
    
    // Pied de page
    const pageHeight = doc.page.height;
    doc.moveTo(50, pageHeight - 60).lineTo(550, pageHeight - 60).stroke();
    doc.fontSize(9).font('Helvetica').text('RYD Planner - Système de Gestion de Missions', 50, pageHeight - 50, { align: 'center' });
    doc.fontSize(8).font('Helvetica').text(`Page 1 - Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 50, pageHeight - 35, { align: 'center' });
    doc.text('Confidentiel - Document d\'archivage', 50, pageHeight - 20, { align: 'center' });
    
    doc.end();
    
    stream.on('finish', () => {
      console.log(`[PDF CLOTURE] Fichier créé avec succès: ${fileName}`);
      // Sauvegarder le nom du fichier PDF dans la base de données
      db.run('UPDATE missions SET pdf_cloture = ? WHERE id = ?', [fileName, id], (err) => {
        if (err) {
          console.error(`[PDF CLOTURE] Erreur lors de la sauvegarde:`, err);
        } else {
          console.log(`[PDF CLOTURE] Mission #${id} mise à jour: ${fileName}`);
        }
      });
      res.json({ success: true, fileName, url: `/archives/${fileName}` });
    });
    
    stream.on('error', (err) => {
      console.error(`[PDF CLOTURE] Erreur lors de la création du stream:`, err);
      res.status(500).json({ error: err.message });
    });
  });
});

// Servir les archives
app.use('/archives', express.static(archivesDir));

// --- Endpoint pour les signatures ---
app.post('/api/missions/:id/signature', (req, res) => {
  const id = req.params.id;
  const { stage, signature, token } = req.body;
  
  // stage = 'debut' ou 'fin'
  const column = stage === 'debut' ? 'signature_debut' : 'signature_fin';
  
  db.run(
    `UPDATE missions SET ${column} = ? WHERE id = ?`,
    [signature, id],
    function(err){
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// --- Route pour récupérer les missions avec PDFs ---
app.get('/api/missions-archives', (req, res) => {
  const sql = `SELECT m.*, c.nom AS client_nom, c.prenom AS client_prenom, c.telephone, c.email,
               v.marque AS veh_marque, v.modele AS veh_modele, v.immatriculation AS veh_immat,
               e.nom AS equipe_nom, e.chauffeur1_nom, e.chauffeur1_telephone, e.chauffeur2_nom, e.chauffeur2_telephone
               FROM missions m
               LEFT JOIN clients c ON m.client_id = c.id
               LEFT JOIN vehicules v ON m.vehicule_id = v.id
               LEFT JOIN equipes e ON m.equipe_id = e.id
               WHERE m.pdf_appel IS NOT NULL OR m.pdf_cloture IS NOT NULL
               ORDER BY m.id DESC`;
  db.all(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// --- Route pour supprimer un PDF ---
app.delete('/api/missions/:id/delete-pdf', (req, res) => {
  const { fileName } = req.body;
  const filePath = path.join(archivesDir, fileName);
  
  // Supprimer le fichier du système de fichiers
  fs.unlink(filePath, (err) => {
    if (err && err.code !== 'ENOENT') {
      return res.status(500).json({ error: 'Erreur lors de la suppression du fichier' });
    }
    
    // Supprimer la référence dans la base de données
    db.run('UPDATE missions SET pdf_path = NULL WHERE id = ?', [req.params.id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    });
  });
});

// --- démarrage ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API serveur démarré sur http://0.0.0.0:${PORT}`);
});
