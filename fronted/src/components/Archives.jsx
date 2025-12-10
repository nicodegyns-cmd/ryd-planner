import React, { useState, useEffect } from 'react'

export default function Archives() {
  const [missions, setMissions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMissionsWithPDFs()
  }, [])

  const fetchMissionsWithPDFs = async () => {
    try {
      setLoading(true)
      const res = await fetch('http://localhost:3000/api/missions-archives')
      const data = await res.json()
      setMissions(data)
    } catch (err) {
      console.error('Erreur:', err)
    } finally {
      setLoading(false)
    }
  }

  const downloadPDF = (fileName) => {
    window.open(`http://localhost:3000/archives/${fileName}`, '_blank')
  }

  const deletePDF = async (missionId, fileName) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce PDF ?')) return
    
    try {
      const res = await fetch(`http://localhost:3000/api/missions/${missionId}/delete-pdf`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName })
      })
      
      if (res.ok) {
        fetchMissionsWithPDFs()
      }
    } catch (err) {
      console.error('Erreur:', err)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Chargement des archives...</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">📁 Archives - PDFs des Missions</h2>

      {missions.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
          Aucune mission archivée pour le moment
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-sm">N° Mission</th>
                <th className="px-6 py-3 text-left font-semibold text-sm">Client</th>
                <th className="px-6 py-3 text-left font-semibold text-sm">Date Création</th>
                <th className="px-6 py-3 text-left font-semibold text-sm">Statut</th>
                <th className="px-6 py-3 text-left font-semibold text-sm">PDFs</th>
              </tr>
            </thead>
            <tbody>
              {missions.map((mission, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-bold text-blue-600">#{mission.id}</td>
                  <td className="px-6 py-4">{mission.client_nom} {mission.client_prenom}</td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(mission.date_creation).toLocaleDateString('fr-FR')}
                    <br/>
                    {new Date(mission.date_creation).toLocaleTimeString('fr-FR')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      mission.statut === 'terminée' ? 'bg-green-100 text-green-800' :
                      mission.statut === 'en cours' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {mission.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 space-y-2">
                    {mission.pdf_appel ? (
                      <div className="space-x-2 mb-2">
                        <button
                          onClick={() => downloadPDF(mission.pdf_appel)}
                          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                          title="Prise d'appel"
                        >
                          📥 Appel
                        </button>
                        <span className="text-xs text-gray-500">Prise d'appel</span>
                      </div>
                    ) : null}
                    {mission.pdf_cloture ? (
                      <div className="space-x-2">
                        <button
                          onClick={() => downloadPDF(mission.pdf_cloture)}
                          className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                          title="Fin de mission"
                        >
                          📥 Clôture
                        </button>
                        <span className="text-xs text-gray-500">Fin de mission</span>
                      </div>
                    ) : null}
                    {!mission.pdf_appel && !mission.pdf_cloture ? (
                      <span className="text-gray-400 text-xs">Aucun PDF</span>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
