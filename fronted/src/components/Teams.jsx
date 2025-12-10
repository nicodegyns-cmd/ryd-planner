import React, { useState, useEffect } from 'react'

export default function Teams() {
  const [equipes, setEquipes] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ 
    nom: '', 
    chauffeur1_nom: '', 
    chauffeur1_telephone: '',
    chauffeur2_nom: '', 
    chauffeur2_telephone: '',
    vehicule_marque: '',
    vehicule_modele: '',
    vehicule_immatriculation: '',
    province_initiale: ''
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        // Modification
        const res = await fetch(`http://localhost:3000/api/equipes/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        })
        const updated = await res.json()
        setEquipes(equipes.map(eq => eq.id === editingId ? updated : eq))
        setEditingId(null)
      } else {
        // Création
        const res = await fetch('http://localhost:3000/api/equipes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        })
        const newTeam = await res.json()
        setEquipes([newTeam, ...equipes])
      }
      setForm({ 
        nom: '', 
        chauffeur1_nom: '', 
        chauffeur1_telephone: '',
        chauffeur2_nom: '', 
        chauffeur2_telephone: '',
        vehicule_marque: '',
        vehicule_modele: '',
        vehicule_immatriculation: '',
        province_initiale: ''
      })
      setShowForm(false)
    } catch (err) {
      console.error('Erreur:', err)
    }
  }

  const handleEdit = (equipe) => {
    setForm(equipe)
    setEditingId(equipe.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Supprimer cette équipe ?')) {
      try {
        await fetch(`http://localhost:3000/api/equipes/${id}`, {
          method: 'DELETE'
        })
        setEquipes(equipes.filter(eq => eq.id !== id))
      } catch (err) {
        console.error('Erreur:', err)
      }
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setForm({ 
      nom: '', 
      chauffeur1_nom: '', 
      chauffeur1_telephone: '',
      chauffeur2_nom: '', 
      chauffeur2_telephone: '',
      vehicule_marque: '',
      vehicule_modele: '',
      vehicule_immatriculation: '',
      province_initiale: ''
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">👥 Équipes</h2>
        <button
          onClick={() => {
            setEditingId(null)
            setShowForm(!showForm)
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Nouvelle Équipe
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
          <input
            type="text"
            placeholder="Nom de l'équipe"
            value={form.nom}
            onChange={(e) => setForm({...form, nom: e.target.value})}
            required
            className="w-full p-3 border-2 border-gray-300 rounded-lg"
          />
          
          <div className="border-t-2 pt-4">
            <h4 className="font-bold mb-3">🚗 Chauffeur 1</h4>
            <input
              type="text"
              placeholder="Nom du chauffeur 1"
              value={form.chauffeur1_nom}
              onChange={(e) => setForm({...form, chauffeur1_nom: e.target.value})}
              className="w-full p-3 border-2 border-gray-300 rounded-lg mb-2"
            />
            <input
              type="tel"
              placeholder="Téléphone chauffeur 1"
              value={form.chauffeur1_telephone}
              onChange={(e) => setForm({...form, chauffeur1_telephone: e.target.value})}
              className="w-full p-3 border-2 border-gray-300 rounded-lg"
            />
          </div>

          <div className="border-t-2 pt-4">
            <h4 className="font-bold mb-3">🚗 Chauffeur 2</h4>
            <input
              type="text"
              placeholder="Nom du chauffeur 2"
              value={form.chauffeur2_nom}
              onChange={(e) => setForm({...form, chauffeur2_nom: e.target.value})}
              className="w-full p-3 border-2 border-gray-300 rounded-lg mb-2"
            />
            <input
              type="tel"
              placeholder="Téléphone chauffeur 2"
              value={form.chauffeur2_telephone}
              onChange={(e) => setForm({...form, chauffeur2_telephone: e.target.value})}
              className="w-full p-3 border-2 border-gray-300 rounded-lg"
            />
          </div>

          <div className="border-t-2 pt-4">
            <h4 className="font-bold mb-3">🚙 Véhicule</h4>
            <input
              type="text"
              placeholder="Marque"
              value={form.vehicule_marque}
              onChange={(e) => setForm({...form, vehicule_marque: e.target.value})}
              className="w-full p-3 border-2 border-gray-300 rounded-lg mb-2"
            />
            <input
              type="text"
              placeholder="Modèle"
              value={form.vehicule_modele}
              onChange={(e) => setForm({...form, vehicule_modele: e.target.value})}
              className="w-full p-3 border-2 border-gray-300 rounded-lg mb-2"
            />
            <input
              type="text"
              placeholder="Plaque d'immatriculation"
              value={form.vehicule_immatriculation}
              onChange={(e) => setForm({...form, vehicule_immatriculation: e.target.value})}
              className="w-full p-3 border-2 border-gray-300 rounded-lg"
            />
          </div>

          <div className="border-t-2 pt-4">
            <h4 className="font-bold mb-3">📍 Province de base</h4>
            <select
              value={form.province_initiale}
              onChange={(e) => setForm({...form, province_initiale: e.target.value})}
              className="w-full p-3 border-2 border-gray-300 rounded-lg font-semibold"
            >
              <option value="">-- Sélectionner une province --</option>
              <option value="Bruxelles">🔴 Bruxelles</option>
              <option value="Liège">🔵 Liège</option>
              <option value="Hainaut">🟠 Hainaut</option>
              <option value="Namur">🟣 Namur</option>
              <option value="Brabant Wallon">🟡 Brabant Wallon</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              {editingId ? '✓ Modifier' : '✓ Ajouter l\'équipe'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              ✕ Annuler
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {equipes.map(equipe => (
          <div key={equipe.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-lg">{equipe.nom}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(equipe)}
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                >
                  ✏️ Modifier
                </button>
                <button
                  onClick={() => handleDelete(equipe.id)}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                >
                  🗑️ Supprimer
                </button>
              </div>
            </div>
            
            {equipe.chauffeur1_nom && (
              <div className="mb-3 pb-3 border-b">
                <p className="text-sm font-semibold text-gray-700">🚗 Chauffeur 1</p>
                <p className="text-sm text-gray-600">{equipe.chauffeur1_nom}</p>
                <p className="text-sm text-blue-600">📱 {equipe.chauffeur1_telephone || 'N/A'}</p>
              </div>
            )}
            
            {equipe.chauffeur2_nom && (
              <div className="mb-3 pb-3 border-b">
                <p className="text-sm font-semibold text-gray-700">🚗 Chauffeur 2</p>
                <p className="text-sm text-gray-600">{equipe.chauffeur2_nom}</p>
                <p className="text-sm text-blue-600">📱 {equipe.chauffeur2_telephone || 'N/A'}</p>
              </div>
            )}

            {equipe.vehicule_marque && (
              <div>
                <p className="text-sm font-semibold text-gray-700">🚙 Véhicule</p>
                <p className="text-sm text-gray-600">{equipe.vehicule_marque} {equipe.vehicule_modele}</p>
                <p className="text-sm text-gray-600">📋 {equipe.vehicule_immatriculation || 'N/A'}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
