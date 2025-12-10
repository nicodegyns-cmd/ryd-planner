import React, { useState, useEffect } from 'react'

export default function Dispatch() {
  const [equipes, setEquipes] = useState([])
  const [missions, setMissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedEquipe, setSelectedEquipe] = useState(null)
  const [selectedMission, setSelectedMission] = useState(null)
  const [showEquipePopup, setShowEquipePopup] = useState(false)
  const [showMissionPopup, setShowMissionPopup] = useState(false)
  const [showAssignPopup, setShowAssignPopup] = useState(false)
  const [missionToAssign, setMissionToAssign] = useState(null)

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5000) // Rafraîchir toutes les 5s
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [equipesRes, missionsRes] = await Promise.all([
        fetch('http://localhost:3000/api/equipes'),
        fetch('http://localhost:3000/api/missions')
      ])
      const equipesData = await equipesRes.json()
      const missionsData = await missionsRes.json()
      setEquipes(equipesData)
      setMissions(missionsData)
    } catch (err) {
      console.error('Erreur chargement données:', err)
    } finally {
      setLoading(false)
    }
  }

  // Compter les missions en cours pour un équipage
  const getEquipeStatus = (equipeId) => {
    const count = missions.filter(m => m.equipe_id === equipeId && m.statut === 'en cours').length
    return count === 0 ? 'disponible' : 'occupe'
  }

  // Compter toutes les missions assignées à un équipage
  const getEquipeMissionCount = (equipeId) => {
    return missions.filter(m => m.equipe_id === equipeId && m.statut !== 'terminée').length
  }

  // Missions en attente d'assignation
  const missionsAttente = missions.filter(m => !m.equipe_id && m.statut === 'planifiée')

  // Assigner une mission
  const assignMission = async (missionId, equipeId) => {
    try {
      const res = await fetch(`http://localhost:3000/api/missions/${missionId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statut: 'planifiée', equipe_id: equipeId })
      })
      if (res.ok) {
        await fetchData()
        setShowAssignPopup(false)
        setMissionToAssign(null)
      }
    } catch (err) {
      console.error('Erreur assignation:', err)
    }
  }

  // Générer lien Google Maps
  const generateMapsLink = (address) => {
    if (!address) return null
    return `https://www.google.com/maps/search/${encodeURIComponent(address)}`
  }

  // Générer lien WhatsApp
  const generateWhatsAppLink = (phone, message) => {
    if (!phone) return null
    const cleanPhone = phone.replace(/\D/g, '')
    const whatsappPhone = cleanPhone.startsWith('32') ? cleanPhone : '32' + cleanPhone
    return `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`
  }

  // Générer lien de signature
  const generateSignatureLink = (missionId, stage) => {
    const baseUrl = window.location.origin
    return `${baseUrl}/signature?mission=${missionId}&stage=${stage}&token=temp`
  }

  // Message WhatsApp pour signature début
  const getSignatureBeginMessage = (mission) => {
    const signatureLink = generateSignatureLink(mission.id, 'debut')
    return `Bonjour ${mission.client_prenom || 'Client'},

Votre mission RYD Planner N°${mission.id} va débuter.

📍 Itinéraire: ${mission.lieu_depart} → ${mission.lieu_arrivee}

Veuillez signer pour confirmer le début de mission:
${signatureLink}

Merci !`
  }

  // Message WhatsApp pour signature fin
  const getSignatureEndMessage = (mission) => {
    const signatureLink = generateSignatureLink(mission.id, 'fin')
    return `Bonjour ${mission.client_prenom || 'Client'},

Votre mission RYD Planner N°${mission.id} est terminée.

📍 Itinéraire: ${mission.lieu_depart} → ${mission.lieu_arrivee}

Veuillez signer pour confirmer la fin de mission:
${signatureLink}

Merci !`
  }

  // Message WhatsApp pour mission
  const getMissionWhatsAppMessage = (mission, equipe) => {
    const message = `Bonjour ${equipe.chauffeur1_nom},

Vous avez une nouvelle mission RYD Planner:

📋 Mission N°${mission.id}

👤 CLIENT:
• ${mission.client_nom || 'N/A'} ${mission.client_prenom || 'N/A'}
• ☎️ ${mission.telephone || 'N/A'}

📍 ITINÉRAIRE:
• Départ: ${mission.lieu_depart || 'N/A'}
• Arrivée: ${mission.lieu_arrivee || 'N/A'}

🚗 VÉHICULE CLIENT:
• ${mission.vehicule_marque || 'N/A'} ${mission.vehicule_modele || 'N/A'}
• Immat: ${mission.vehicule_immatriculation || 'N/A'}

Bonne route!`
    return message
  }

  if (loading) {
    return <div className="text-center py-8">Chargement du tableau de bord...</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">🚚 Tableau de Bord Opérationnel</h2>

      <div className="grid grid-cols-3 gap-4">
        {/* Statistiques */}
        <div className="bg-blue-100 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold text-blue-800">{equipes.length}</div>
          <div className="text-blue-600">Équipages</div>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold text-yellow-800">{missionsAttente.length}</div>
          <div className="text-yellow-600">Missions en attente</div>
        </div>
        <div className="bg-green-100 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold text-green-800">{equipes.filter(e => getEquipeStatus(e.id) === 'disponible').length}</div>
          <div className="text-green-600">Équipages disponibles</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* GAUCHE: Missions en attente */}
        <div className="col-span-1 bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4 border-b pb-2">📋 Missions en attente ({missionsAttente.length})</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {missionsAttente.length === 0 ? (
              <div className="text-gray-500 text-center py-8">Aucune mission en attente</div>
            ) : (
              missionsAttente.map(mission => (
                <button
                  key={mission.id}
                  onClick={() => {
                    setMissionToAssign(mission)
                    setShowAssignPopup(true)
                  }}
                  className="w-full text-left p-3 bg-yellow-50 border border-yellow-200 rounded hover:bg-yellow-100 transition"
                >
                  <div className="font-bold text-blue-600">Mission #{mission.id}</div>
                  <div className="text-sm text-gray-600 truncate">📍 {mission.lieu_depart || 'N/A'}</div>
                  <div className="text-sm text-gray-600 truncate">👤 {mission.client_nom} {mission.client_prenom}</div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* DROITE: Équipages */}
        <div className="col-span-2">
          <h3 className="text-xl font-bold mb-4 border-b pb-2">👥 Équipages Disponibles</h3>
          <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {equipes.map(equipe => {
              const status = getEquipeStatus(equipe.id)
              const missionCount = getEquipeMissionCount(equipe.id)
              const isAvailable = status === 'disponible'

              return (
                <button
                  key={equipe.id}
                  onClick={() => {
                    setSelectedEquipe(equipe)
                    setShowEquipePopup(true)
                  }}
                  className={`p-4 rounded-lg border-2 text-left transition ${
                    isAvailable
                      ? 'bg-green-50 border-green-300 hover:bg-green-100'
                      : 'bg-red-50 border-red-300 hover:bg-red-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-bold text-lg">{equipe.nom}</div>
                    <div className={`w-4 h-4 rounded-full ${isAvailable ? 'bg-green-600' : 'bg-red-600'}`}></div>
                  </div>
                  <div className="text-sm font-semibold">
                    {isAvailable ? '🟢 Disponible' : '🔴 Occupé'}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Missions: <span className="font-bold text-blue-600">{missionCount}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Cliquez pour plus d'infos</div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* POPUP ÉQUIPE */}
      {showEquipePopup && selectedEquipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-4">{selectedEquipe.nom}</h3>

            <div className="space-y-3 mb-6">
              <div>
                <div className="text-sm font-semibold text-gray-600">Statut</div>
                <div className={`px-3 py-1 rounded-full text-sm font-bold w-fit ${
                  getEquipeStatus(selectedEquipe.id) === 'disponible'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {getEquipeStatus(selectedEquipe.id) === 'disponible' ? '🟢 Disponible' : '🔴 Occupé'}
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-gray-600">Chauffeur 1</div>
                <div className="text-lg font-bold">{selectedEquipe.chauffeur1_nom || 'N/A'}</div>
                <div className="text-sm text-gray-600">☎️ {selectedEquipe.chauffeur1_telephone || 'N/A'}</div>
              </div>

              {selectedEquipe.chauffeur2_nom && (
                <div>
                  <div className="text-sm font-semibold text-gray-600">Chauffeur 2</div>
                  <div className="text-lg font-bold">{selectedEquipe.chauffeur2_nom}</div>
                  <div className="text-sm text-gray-600">☎️ {selectedEquipe.chauffeur2_telephone || 'N/A'}</div>
                </div>
              )}

              <div>
                <div className="text-sm font-semibold text-gray-600">Véhicule</div>
                <div className="text-lg font-bold">{selectedEquipe.vehicule_marque} {selectedEquipe.vehicule_modele}</div>
                <div className="text-sm text-gray-600">📋 {selectedEquipe.vehicule_immatriculation}</div>
              </div>

              <div>
                <div className="text-sm font-semibold text-gray-600">Missions prévues</div>
                <div className="text-lg font-bold text-blue-600">{getEquipeMissionCount(selectedEquipe.id)}</div>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  setShowEquipePopup(false)
                }}
                className="w-full py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 font-semibold"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP ASSIGNATION MISSION */}
      {showAssignPopup && missionToAssign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full mx-4">
            <h3 className="text-2xl font-bold mb-4">Assigner Mission #{missionToAssign.id}</h3>

            <div className="bg-gray-50 p-4 rounded mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-semibold text-gray-600">Départ</div>
                  {missionToAssign.lieu_depart ? (
                    <a
                      href={generateMapsLink(missionToAssign.lieu_depart)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-blue-600 hover:underline"
                    >
                      📍 {missionToAssign.lieu_depart}
                    </a>
                  ) : (
                    <div className="font-bold">N/A</div>
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-600">Arrivée</div>
                  {missionToAssign.lieu_arrivee ? (
                    <a
                      href={generateMapsLink(missionToAssign.lieu_arrivee)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-blue-600 hover:underline"
                    >
                      📍 {missionToAssign.lieu_arrivee}
                    </a>
                  ) : (
                    <div className="font-bold">N/A</div>
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-600">PEC</div>
                  {missionToAssign.adresse_pec ? (
                    <a
                      href={generateMapsLink(missionToAssign.adresse_pec)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-blue-600 hover:underline text-sm"
                    >
                      📍 {missionToAssign.adresse_pec}
                    </a>
                  ) : (
                    <div className="font-bold text-sm">N/A</div>
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-600">Destination</div>
                  {missionToAssign.adresse_dest ? (
                    <a
                      href={generateMapsLink(missionToAssign.adresse_dest)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-blue-600 hover:underline text-sm"
                    >
                      📍 {missionToAssign.adresse_dest}
                    </a>
                  ) : (
                    <div className="font-bold text-sm">N/A</div>
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-600">Véhicule</div>
                  <div className="font-bold text-sm">{missionToAssign.vehicule_marque} {missionToAssign.vehicule_modele}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-600">Immatriculation</div>
                  <div className="font-bold text-sm">{missionToAssign.vehicule_immatriculation || 'N/A'}</div>
                </div>
              </div>
            </div>

            <h4 className="font-bold mb-3">Sélectionner un équipage :</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto mb-6">
              {equipes.length === 0 ? (
                <div className="text-gray-500 text-center py-4">Aucun équipage disponible</div>
              ) : (
                equipes.map(equipe => {
                  const isAvailable = getEquipeStatus(equipe.id) === 'disponible'
                  return (
                    <div key={equipe.id} className={`p-3 rounded border-2 transition ${
                      isAvailable
                        ? 'bg-green-50 border-green-300 hover:bg-green-100'
                        : 'bg-gray-100 border-gray-300 opacity-60'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold">{equipe.nom}</div>
                          <div className="text-sm text-gray-600">
                            {isAvailable ? '🟢 Disponible' : '🔴 Occupé'} • {getEquipeMissionCount(equipe.id)} mission(s)
                          </div>
                        </div>
                        <div className="space-y-1">
                          <button
                            onClick={() => {
                              assignMission(missionToAssign.id, equipe.id)
                            }}
                            disabled={!isAvailable}
                            className="block px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
                          >
                            ✓ Assigner
                          </button>
                          {equipe.chauffeur1_telephone && (
                            <a
                              href={generateWhatsAppLink(
                                equipe.chauffeur1_telephone,
                                getMissionWhatsAppMessage(missionToAssign, equipe)
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 text-center"
                            >
                              💬 WhatsApp
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Boutons de signature pour le client */}
            <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
              <h4 className="font-bold mb-3 text-blue-900">📝 Signature du Client</h4>
              <div className="space-y-2">
                <a
                  href={`${generateWhatsAppLink(
                    missionToAssign.telephone,
                    getSignatureBeginMessage(missionToAssign)
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-center font-semibold"
                >
                  📱 Envoyer lien signature DÉBUT
                </a>
                <a
                  href={`${generateWhatsAppLink(
                    missionToAssign.telephone,
                    getSignatureEndMessage(missionToAssign)
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-center font-semibold"
                >
                  📱 Envoyer lien signature FIN
                </a>
              </div>
            </div>

            <button
              onClick={() => setShowAssignPopup(false)}
              className="w-full py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 font-semibold"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
