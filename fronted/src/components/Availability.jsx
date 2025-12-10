import React, { useState, useEffect } from 'react'

export default function Availability() {
  const [equipes, setEquipes] = useState([])
  const [missions, setMissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [equipesParRegion, setEquipesParRegion] = useState({})

  const PROVINCES = [
    { name: 'Bruxelles', color: '#DC2626', emoji: '🔴' },
    { name: 'Liège', color: '#3B82F6', emoji: '🔵' },
    { name: 'Hainaut', color: '#F97316', emoji: '🟠' },
    { name: 'Namur', color: '#A855F7', emoji: '🟣' },
    { name: 'Brabant Wallon', color: '#EAB308', emoji: '🟡' }
  ]

  useEffect(() => {
    // Charger les données et rafraîchir toutes les 10 secondes
    fetchData()
    const interval = setInterval(fetchData, 10000)
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

  // Déterminer la province d'un équipage basée sur ses missions actives OU sa province initiale
  const getEquipeProvince = (equipeId) => {
    // D'abord vérifier s'il y a une mission active
    const activeMission = missions.find(
      m => m.equipe_id === equipeId && (m.statut === 'en cours' || m.statut === 'planifiée')
    )
    if (activeMission?.province) return activeMission.province
    
    // Sinon utiliser la province initiale
    const equipe = equipes.find(e => e.id === equipeId)
    return equipe?.province_initiale || null
  }

  // Déterminer le statut d'un équipage
  const getEquipeStatus = (equipeId) => {
    const count = missions.filter(m => m.equipe_id === equipeId && m.statut === 'en cours').length
    return count === 0 ? 'disponible' : 'occupe'
  }

  // Regrouper équipages par province
  useEffect(() => {
    if (equipes.length === 0) {
      setEquipesParRegion({})
      return
    }

    const groupedByProvince = {}
    PROVINCES.forEach(province => {
      groupedByProvince[province.name] = []
    })
    groupedByProvince['Non assigné'] = []

    equipes.forEach(equipe => {
      const province = getEquipeProvince(equipe.id)
      if (province && groupedByProvince[province]) {
        groupedByProvince[province].push({
          ...equipe,
          status: getEquipeStatus(equipe.id)
        })
      } else {
        // Équipages sans province assignée
        groupedByProvince['Non assigné'].push({
          ...equipe,
          status: getEquipeStatus(equipe.id)
        })
      }
    })

    setEquipesParRegion(groupedByProvince)
  }, [equipes, missions])

  if (loading) {
    return <div className="text-center py-8 text-xl">Chargement du tableau de bord...</div>
  }

  return (
    <div className="space-y-6 bg-gray-100 min-h-screen p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">📍 Tableau de Disponibilité</h2>
        <div className="text-sm text-gray-600">
          Actualisé : {new Date().toLocaleTimeString('fr-FR')}
        </div>
      </div>

      {/* Légende */}
      <div className="flex gap-8 bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-500 rounded-full border-4 border-green-600"></div>
          <span className="font-semibold">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-500 rounded-full border-4 border-red-600"></div>
          <span className="font-semibold">Occupé</span>
        </div>
      </div>

      {/* Provinces */}
      <div className="space-y-8">
        {Object.entries(equipesParRegion).map(([provinceName, equipesList]) => {
          if (equipesList.length === 0) return null

          // Trouver les infos de la province (couleur, emoji)
          const provinceInfo = PROVINCES.find(p => p.name === provinceName) || 
                              { name: provinceName, color: '#6B7280', emoji: '⚪' }

          return (
            <div key={provinceName} className="bg-white rounded-lg shadow p-6">
              <div
                className="text-2xl font-bold mb-6 pb-3 border-b-4"
                style={{ borderColor: provinceInfo.color }}
              >
                {provinceInfo.emoji} {provinceName} ({equipesList.length})
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {equipesList.map(equipe => {
                  const isAvailable = equipe.status === 'disponible'
                  const borderColor = isAvailable ? '#22C55E' : '#EF4444'
                  const bgColor = isAvailable ? '#F0FDF4' : '#FEF2F2'

                  return (
                    <div
                      key={equipe.id}
                      className="p-6 rounded-lg border-4 transition transform hover:scale-105"
                      style={{
                        borderColor: borderColor,
                        backgroundColor: bgColor
                      }}
                    >
                      {/* Statut indicateur */}
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-800">{equipe.nom}</h3>
                        <div
                          className="w-5 h-5 rounded-full border-2"
                          style={{
                            backgroundColor: isAvailable ? '#22C55E' : '#EF4444',
                            borderColor: isAvailable ? '#16A34A' : '#DC2626'
                          }}
                        ></div>
                      </div>

                      {/* Statut texte */}
                      <div
                        className="inline-block px-3 py-1 rounded-full text-sm font-bold mb-4"
                        style={{
                          backgroundColor: isAvailable ? '#DCFCE7' : '#FEE2E2',
                          color: isAvailable ? '#166534' : '#991B1B'
                        }}
                      >
                        {isAvailable ? '🟢 DISPONIBLE' : '🔴 OCCUPÉ'}
                      </div>

                      {/* Chauffeur */}
                      <div className="mt-4 space-y-2">
                        <div className="text-xs font-semibold text-gray-600">CHAUFFEUR:</div>
                        <div className="text-sm font-bold text-gray-800">
                          {equipe.chauffeur1_nom || 'N/A'}
                        </div>
                      </div>

                      {/* Véhicule */}
                      <div className="mt-3">
                        <div className="text-xs font-semibold text-gray-600">VÉHICULE:</div>
                        <div className="text-sm font-bold text-gray-800">
                          {equipe.vehicule_immatriculation}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Message au chargement */}
      {equipes.length === 0 && (
        <div className="text-center py-12 text-gray-500 text-xl">
          Aucun équipage enregistré
        </div>
      )}
    </div>
  )
}
