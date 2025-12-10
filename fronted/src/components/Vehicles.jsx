import React, { useEffect, useState } from 'react'
const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function Vehicles(){
  const [veh, setVeh] = useState([])
  const [form, setForm] = useState({marque:'', modele:'', immatriculation:''})

  useEffect(()=>fetchVehs(),[])

  function fetchVehs(){ fetch(`${API}/api/vehicules`).then(r=>r.json()).then(setVeh) }

  function submit(e){
    e.preventDefault()
    fetch(`${API}/api/vehicules`, {
      method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form)
    }).then(()=>{ setForm({marque:'', modele:'', immatriculation:''}); fetchVehs() })
  }

  function changeStatus(id, statut){
    fetch(`${API}/api/vehicules/${id}/status`, {
      method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({statut})
    }).then(fetchVehs)
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded card">
        <h2 className="font-semibold mb-2">Ajouter véhicule</h2>
        <form onSubmit={submit} className="space-y-2">
          <input required value={form.marque} onChange={e=>setForm({...form, marque:e.target.value})} placeholder="Marque" className="w-full p-2 border rounded"/>
          <input value={form.modele} onChange={e=>setForm({...form, modele:e.target.value})} placeholder="Modèle" className="w-full p-2 border rounded"/>
          <input required value={form.immatriculation} onChange={e=>setForm({...form, immatriculation:e.target.value})} placeholder="Immatriculation" className="w-full p-2 border rounded"/>
          <div>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded">Ajouter</button>
          </div>
        </form>
      </div>

      <div className="bg-white p-4 rounded card">
        <h2 className="font-semibold mb-2">Véhicules</h2>
        <div className="space-y-2">
          {veh.map(v=>(
            <div key={v.id} className="p-3 border rounded flex justify-between items-center">
              <div>
                <div className="font-medium">{v.marque} {v.modele}</div>
                <div className="text-sm text-gray-500">{v.immatriculation}</div>
              </div>
              <div className="text-right">
                <div className={"px-3 py-1 rounded text-sm " + (v.statut==='disponible' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800')}>
                  {v.statut}
                </div>
                <div className="mt-2 space-x-2">
                  <button onClick={()=>changeStatus(v.id,'disponible')} className="text-xs px-2 py-1 border rounded">dispo</button>
                  <button onClick={()=>changeStatus(v.id,'maintenance')} className="text-xs px-2 py-1 border rounded">maintenance</button>
                </div>
              </div>
            </div>
          ))}
          {veh.length===0 && <div className="text-sm text-gray-500">Aucun véhicule</div>}
        </div>
      </div>
    </div>
  )
}
