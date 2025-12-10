import React, { useState, useEffect } from 'react'

export default function CallForm() {
  const [equipes, setEquipes] = useState([])
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    // Propriétaire
    proprietaire_nom: '',
    proprietaire_prenom: '',
    proprietaire_adresse: '',
    proprietaire_codepostal: '',
    proprietaire_commune: '',
    proprietaire_telephone: '',
    
    // Véhicule
    vehicule_marque: '',
    vehicule_modele: '',
    vehicule_immatriculation: '',
    
    // Assurance
    assurance_compagnie: '',
    assurance_numero: '',
    assurance_validite_fin: '',
    
    // Contrôle technique
    controle_technique_date: '',
    controle_technique_exempt: false,
    
    // Mission
    nb_passagers: '',
    adresse_pec: '',
    adresse_dest: '',
    lieu_depart: '',
    lieu_arrivee: '',
    province: '',
    equipe_id: '',
    notes: ''
  })

  useEffect(() => {
    fetchEquipes()
  }, [])

  const fetchEquipes = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/equipes')
      setEquipes(await res.json())
    } catch (err) {
      console.error('Erreur:', err)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({...formData, [name]: value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Créer le client
      const clientRes = await fetch('http://localhost:3000/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: formData.proprietaire_nom,
          prenom: formData.proprietaire_prenom,
          telephone: formData.proprietaire_telephone,
          email: ''
        })
      })
      const client = await clientRes.json()

      // Créer la mission
      const missionRes = await fetch('http://localhost:3000/api/missions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: client.id,
          vehicule_id: '',
          equipe_id: '', // L'équipe sera assignée plus tard par l'opérateur
          province: formData.province,
          lieu_depart: formData.lieu_depart,
          lieu_arrivee: formData.lieu_arrivee,
          notes: `
PROPRIÉTAIRE:
Nom: ${formData.proprietaire_nom} ${formData.proprietaire_prenom}
Adresse: ${formData.proprietaire_adresse}, ${formData.proprietaire_codepostal} ${formData.proprietaire_commune}
Téléphone: ${formData.proprietaire_telephone}

VÉHICULE:
Marque: ${formData.vehicule_marque}
Modèle: ${formData.vehicule_modele}
Immatriculation: ${formData.vehicule_immatriculation}

ASSURANCE:
Compagnie: ${formData.assurance_compagnie}
N° Police: ${formData.assurance_numero}
Validité jusqu'au: ${formData.assurance_validite_fin}

CONTRÔLE TECHNIQUE:
${formData.controle_technique_exempt ? 'Véhicule neuf - 4 ans (Exempt)' : 'Date: ' + formData.controle_technique_date}

ADRESSES DE MISSION:
PEC (Point d'Enlèvement): ${formData.adresse_pec}
DEST (Destination): ${formData.adresse_dest}

ITINÉRAIRE:
Départ: ${formData.lieu_depart}
Arrivée: ${formData.lieu_arrivee}

INFORMATIONS:
Passagers: ${formData.nb_passagers}
Remarques: ${formData.notes}
          `
        })
      })

      if (missionRes.ok) {
        const mission = await missionRes.json()
        
        // Générer PDF "Prise d'appel" immédiatement après création
        fetch(`http://localhost:3000/api/missions/${mission.id}/generer-pdf-appel`, {
          method: 'POST'
        }).then(r => r.json()).then(data => {
          if (data.success) {
            setMessage('✓ Mission créée et PDF Prise d\'appel généré avec succès!')
            window.open(`http://localhost:3000/archives/${data.fileName}`, '_blank')
          } else {
            setMessage('✓ Mission créée avec succès! (PDF non généré)')
          }
        }).catch(err => {
          console.error('Erreur PDF:', err)
          setMessage('✓ Mission créée! (Erreur lors de la génération du PDF)')
        })

        // Réinitialiser le formulaire
        setFormData({
          proprietaire_nom: '',
          proprietaire_prenom: '',
          proprietaire_adresse: '',
          proprietaire_codepostal: '',
          proprietaire_commune: '',
          proprietaire_telephone: '',
          vehicule_marque: '',
          vehicule_modele: '',
          vehicule_immatriculation: '',
          assurance_compagnie: '',
          assurance_numero: '',
          assurance_validite_fin: '',
          controle_technique_date: '',
          controle_technique_exempt: false,
          nb_passagers: '',
          adresse_pec: '',
          adresse_dest: '',
          lieu_depart: '',
          lieu_arrivee: '',
          province: '',
          equipe_id: '',
          notes: ''
        })
      }
    } catch (err) {
      console.error('Erreur:', err)
      setMessage('✗ Erreur lors de la création de la mission')
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">📞 Appel Entrant - Déclaration du Propriétaire</h2>

      {message && (
        <div className={`p-4 rounded-lg ${message.includes('✓') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* PROPRIÉTAIRE */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4 border-b pb-2">👤 Propriétaire du Véhicule</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="proprietaire_nom"
              placeholder="Nom"
              value={formData.proprietaire_nom}
              onChange={handleChange}
              required
              className="p-3 border-2 border-gray-300 rounded-lg"
            />
            <input
              type="text"
              name="proprietaire_prenom"
              placeholder="Prénom"
              value={formData.proprietaire_prenom}
              onChange={handleChange}
              required
              className="p-3 border-2 border-gray-300 rounded-lg"
            />
            <input
              type="tel"
              name="proprietaire_telephone"
              placeholder="Téléphone"
              value={formData.proprietaire_telephone}
              onChange={handleChange}
              required
              className="p-3 border-2 border-gray-300 rounded-lg"
            />
            <input
              type="text"
              name="proprietaire_adresse"
              placeholder="Adresse de domicile"
              value={formData.proprietaire_adresse}
              onChange={handleChange}
              className="p-3 border-2 border-gray-300 rounded-lg md:col-span-2"
            />
            <input
              type="text"
              name="proprietaire_codepostal"
              placeholder="Code Postal"
              value={formData.proprietaire_codepostal}
              onChange={handleChange}
              className="p-3 border-2 border-gray-300 rounded-lg"
            />
            <input
              type="text"
              name="proprietaire_commune"
              placeholder="Commune"
              value={formData.proprietaire_commune}
              onChange={handleChange}
              className="p-3 border-2 border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* VÉHICULE */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4 border-b pb-2">🚗 Véhicule à Rapatrier</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="vehicule_marque"
              placeholder="Marque du véhicule"
              value={formData.vehicule_marque}
              onChange={handleChange}
              required
              className="p-3 border-2 border-gray-300 rounded-lg"
            />
            <input
              type="text"
              name="vehicule_modele"
              placeholder="Modèle du véhicule"
              value={formData.vehicule_modele}
              onChange={handleChange}
              required
              className="p-3 border-2 border-gray-300 rounded-lg"
            />
            <input
              type="text"
              name="vehicule_immatriculation"
              placeholder="Plaque d'immatriculation"
              value={formData.vehicule_immatriculation}
              onChange={handleChange}
              required
              className="p-3 border-2 border-gray-300 rounded-lg"
            />
            <input
              type="number"
              name="nb_passagers"
              placeholder="Nombre de passagers"
              value={formData.nb_passagers}
              onChange={handleChange}
              className="p-3 border-2 border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* ASSURANCE */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4 border-b pb-2">📋 Assurance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="assurance_compagnie"
              placeholder="Compagnie d'assurance"
              value={formData.assurance_compagnie}
              onChange={handleChange}
              className="p-3 border-2 border-gray-300 rounded-lg"
            />
            <input
              type="text"
              name="assurance_numero"
              placeholder="Numéro de police d'assurance"
              value={formData.assurance_numero}
              onChange={handleChange}
              className="p-3 border-2 border-gray-300 rounded-lg"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">📅 Validité jusqu'au</label>
            <input
              type="date"
              name="assurance_validite_fin"
              value={formData.assurance_validite_fin}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* CONTRÔLE TECHNIQUE */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4 border-b pb-2">✓ Contrôle Technique</h3>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="controle_technique_exempt"
                checked={formData.controle_technique_exempt}
                onChange={(e) => setFormData({...formData, controle_technique_exempt: e.target.checked})}
                className="w-5 h-5 border-2 border-gray-300 rounded"
              />
              <span className="font-medium">🚗 Véhicule neuf - 4 ans (Exempt de contrôle)</span>
            </label>
            
            {!formData.controle_technique_exempt && (
              <div>
                <label className="block text-sm font-medium mb-2">Date du dernier contrôle technique</label>
                <input
                  type="date"
                  name="controle_technique_date"
                  value={formData.controle_technique_date}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg"
                />
              </div>
            )}
          </div>
        </div>

        {/* MISSION */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4 border-b pb-2">🗺️ Détails de la Mission</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="adresse_pec"
              placeholder="Adresse de PEC (Point d'Enlèvement/Collecte)"
              value={formData.adresse_pec}
              onChange={handleChange}
              required
              className="p-3 border-2 border-gray-300 rounded-lg md:col-span-2"
            />
            <input
              type="text"
              name="adresse_dest"
              placeholder="Adresse de DEST (Destination)"
              value={formData.adresse_dest}
              onChange={handleChange}
              required
              className="p-3 border-2 border-gray-300 rounded-lg md:col-span-2"
            />
            <input
              type="text"
              name="lieu_depart"
              placeholder="Lieu de départ"
              value={formData.lieu_depart}
              onChange={handleChange}
              className="p-3 border-2 border-gray-300 rounded-lg"
            />
            <input
              type="text"
              name="lieu_arrivee"
              placeholder="Lieu d'arrivée"
              value={formData.lieu_arrivee}
              onChange={handleChange}
              className="p-3 border-2 border-gray-300 rounded-lg"
            />
            <select
              name="province"
              value={formData.province}
              onChange={handleChange}
              required
              className="p-3 border-2 border-gray-300 rounded-lg font-semibold"
            >
              <option value="">📍 Sélectionner la province de destination</option>
              <option value="Bruxelles">🔴 Bruxelles</option>
              <option value="Liège">🔵 Liège</option>
              <option value="Hainaut">🟠 Hainaut</option>
              <option value="Namur">🟣 Namur</option>
              <option value="Brabant Wallon">🟡 Brabant Wallon</option>
            </select>
            <textarea
              name="notes"
              placeholder="Remarques complémentaires"
              value={formData.notes}
              onChange={handleChange}
              className="p-3 border-2 border-gray-300 rounded-lg md:col-span-2 h-20"
            />
          </div>
        </div>

        {/* BOUTON SUBMIT */}
        <button
          type="submit"
          className="w-full py-3 bg-green-600 text-white font-bold text-lg rounded-lg hover:bg-green-700"
        >
          ✓ Créer la Mission & Générer PDF
        </button>
      </form>
    </div>
  )
}
