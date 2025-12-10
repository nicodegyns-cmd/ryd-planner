import React, { useEffect, useState } from 'react'
const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function Missions(){
  const [missions, setMissions] = useState([])
  const [equipes, setEquipes] = useState([])
  const [filter, setFilter] = useState('all')
  const [generatingPdf, setGeneratingPdf] = useState(null)
  const [editingMission, setEditingMission] = useState(null)
  const [editFormData, setEditFormData] = useState({})

  useEffect(()=>{ fetchMissions(); fetchEquipes() },[])

  function fetchMissions(){
    fetch(`${API}/api/missions`).then(r=>r.json()).then(setMissions)
  }

  function fetchEquipes(){
    fetch(`${API}/api/equipes`).then(r=>r.json()).then(setEquipes)
  }

  function setStatus(id, statut){
    fetch(`${API}/api/missions/${id}/status`, {
      method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({statut})
    }).then(fetchMissions)
  }

  async function generatePDF(id) {
    setGeneratingPdf(id)
    try {
      const res = await fetch(`${API}/api/missions/${id}/generer-pdf`, {method:'POST'})
      const data = await res.json()
      if (data.success) {
        window.open(`${API}/archives/${data.fileName}`, '_blank')
      }
    } catch (err) {
      console.error('Erreur génération PDF:', err)
    }
    setGeneratingPdf(null)
  }

  function assignTeam(id, equipeId) {
    // Cette fonction pourrait être utilisée si vous voulez changer l'équipe
    // Pour l'instant, l'équipe est assignée à la création
  }

  function openEditModal(mission) {
    setEditingMission(mission)
    setEditFormData({...mission})
  }

  function closeEditModal() {
    setEditingMission(null)
    setEditFormData({})
  }

  async function saveMissionEdit() {
    try {
      console.log('Sauvegarde mission:', editFormData)
      const res = await fetch(`${API}/api/missions/${editingMission.id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(editFormData)
      })
      const data = await res.json()
      console.log('Réponse serveur:', data)
      
      if (res.ok) {
        alert('Mission sauvegardée avec succès ✅')
        fetchMissions()
        closeEditModal()
      } else {
        alert('Erreur: ' + (data.error || 'Impossible de sauvegarder'))
      }
    } catch (err) {
      console.error('Erreur sauvegarde mission:', err)
      alert('Erreur: ' + err.message)
    }
  }

  const filteredMissions = missions.filter(m => {
    if (filter === 'all') return true
    return m.statut === filter
  })

  const statusColors = {
    'planifiée': 'bg-blue-100 text-blue-800',
    'en cours': 'bg-yellow-100 text-yellow-800',
    'terminée': 'bg-green-100 text-green-800'
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">📋 Missions en Cours</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setFilter('all')}
            className={"px-4 py-2 rounded-lg " + (filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200')}
          >
            Tous ({missions.length})
          </button>
          <button 
            onClick={() => setFilter('planifiée')}
            className={"px-4 py-2 rounded-lg " + (filter === 'planifiée' ? 'bg-blue-600 text-white' : 'bg-gray-200')}
          >
            Planifiées
          </button>
          <button 
            onClick={() => setFilter('en cours')}
            className={"px-4 py-2 rounded-lg " + (filter === 'en cours' ? 'bg-blue-600 text-white' : 'bg-gray-200')}
          >
            En cours
          </button>
          <button 
            onClick={() => setFilter('terminée')}
            className={"px-4 py-2 rounded-lg " + (filter === 'terminée' ? 'bg-blue-600 text-white' : 'bg-gray-200')}
          >
            Terminées
          </button>
        </div>
      </div>

      {/* Liste des missions */}
      <div className="space-y-3">
        {filteredMissions.map(m => (
          <div 
            key={m.id} 
            onClick={() => openEditModal(m)}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer hover:bg-gray-50"
          >
            <div className="grid grid-cols-12 gap-4 items-center">
              {/* Info principales */}
              <div className="col-span-5">
                <div className="font-bold text-lg">#{m.id} — {m.client_prenom} {m.client_nom}</div>
                <div className="text-sm text-gray-600 mt-1">📱 {m.telephone}</div>
                <div className="text-sm text-gray-600 mt-2">📍 {m.lieu_depart} → {m.lieu_arrivee}</div>
                <div className="text-sm text-gray-600">🕐 {m.heure_depart} — {m.heure_arrivee}</div>
              </div>

              {/* Ressources */}
              <div className="col-span-3">
                <div className="text-sm font-medium text-gray-700">Ressources</div>
                <div className="text-sm mt-1">
                  <div>🚗 {m.veh_marque} {m.veh_modele}</div>
                  <div className="text-gray-600">{m.veh_immat}</div>
                </div>
                <div className="text-sm mt-2">
                  <div>👥 {m.equipe_nom || 'Non assignée'}</div>
                  <div className="text-gray-600">{m.chauffeur1_nom || ''}</div>
                </div>
              </div>

              {/* Statut et actions */}
              <div className="col-span-4 text-right space-y-2">
                <div className={"inline-block px-3 py-1 rounded-full text-sm font-medium " + statusColors[m.statut]}>
                  {m.statut}
                </div>
                <div className="flex gap-2 justify-end flex-wrap">
                  {m.statut !== 'en cours' && (
                    <button 
                      onClick={() => setStatus(m.id, 'en cours')}
                      className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      En cours
                    </button>
                  )}
                  {m.statut !== 'terminée' && (
                    <button 
                      onClick={() => setStatus(m.id, 'terminée')}
                      className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Terminée
                    </button>
                  )}
                  <button 
                    onClick={() => generatePDF(m.id)}
                    disabled={generatingPdf === m.id}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                  >
                    {generatingPdf === m.id ? '⏳ PDF...' : '📄 PDF'}
                  </button>
                </div>
              </div>
            </div>

            {/* Notes si présentes */}
            {m.notes && (
              <div className="mt-3 pt-3 border-t text-sm text-gray-600">
                <strong>Notes:</strong> {m.notes}
              </div>
            )}
          </div>
        ))}

        {filteredMissions.length === 0 && (
          <div className="bg-gray-100 p-6 rounded-lg text-center text-gray-600">
            Aucune mission dans cette catégorie
          </div>
        )}
      </div>

      {/* Modal d'édition */}
      {editingMission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h3 className="text-xl font-bold">Éditer Mission #{editingMission.id}</h3>
              <button 
                onClick={closeEditModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Informations Client */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom Client</label>
                <input 
                  type="text"
                  value={editFormData.client_nom || ''}
                  onChange={(e) => setEditFormData({...editFormData, client_nom: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prénom Client</label>
                <input 
                  type="text"
                  value={editFormData.client_prenom || ''}
                  onChange={(e) => setEditFormData({...editFormData, client_prenom: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                <input 
                  type="tel"
                  value={editFormData.telephone || ''}
                  onChange={(e) => setEditFormData({...editFormData, telephone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Lieux */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lieu de Départ</label>
                <input 
                  type="text"
                  value={editFormData.lieu_depart || ''}
                  onChange={(e) => setEditFormData({...editFormData, lieu_depart: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lieu d'Arrivée</label>
                <input 
                  type="text"
                  value={editFormData.lieu_arrivee || ''}
                  onChange={(e) => setEditFormData({...editFormData, lieu_arrivee: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Horaires */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Heure Départ</label>
                  <input 
                    type="time"
                    value={editFormData.heure_depart || ''}
                    onChange={(e) => setEditFormData({...editFormData, heure_depart: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Heure Arrivée</label>
                  <input 
                    type="time"
                    value={editFormData.heure_arrivee || ''}
                    onChange={(e) => setEditFormData({...editFormData, heure_arrivee: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Véhicule */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Marque Véhicule</label>
                <input 
                  type="text"
                  value={editFormData.veh_marque || ''}
                  onChange={(e) => setEditFormData({...editFormData, veh_marque: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Modèle Véhicule</label>
                <input 
                  type="text"
                  value={editFormData.veh_modele || ''}
                  onChange={(e) => setEditFormData({...editFormData, veh_modele: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Immatriculation</label>
                <input 
                  type="text"
                  value={editFormData.veh_immat || ''}
                  onChange={(e) => setEditFormData({...editFormData, veh_immat: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea 
                  value={editFormData.notes || ''}
                  onChange={(e) => setEditFormData({...editFormData, notes: e.target.value})}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Province de Destination */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Province de Destination</label>
                <select 
                  value={editFormData.province || ''}
                  onChange={(e) => setEditFormData({...editFormData, province: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">-- Sélectionner une province --</option>
                  <option value="Bruxelles">🔴 Bruxelles</option>
                  <option value="Liège">🔵 Liège</option>
                  <option value="Hainaut">🟠 Hainaut</option>
                  <option value="Namur">🟣 Namur</option>
                  <option value="Brabant Wallon">🟡 Brabant Wallon</option>
                </select>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t p-6 flex gap-3 justify-end">
              <button 
                onClick={closeEditModal}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
              >
                Annuler
              </button>
              <button 
                onClick={saveMissionEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                💾 Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
