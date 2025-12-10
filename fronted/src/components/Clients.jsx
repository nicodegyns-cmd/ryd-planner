import React, { useEffect, useState } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function Clients(){
  const [clients, setClients] = useState([])
  const [form, setForm] = useState({nom:'', prenom:'', telephone:'', email:''})

  useEffect(()=>{ fetchClients() },[])

  function fetchClients(){
    fetch(`${API}/api/clients`).then(r=>r.json()).then(setClients)
  }
  function submit(e){
    e.preventDefault()
    fetch(`${API}/api/clients`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(form)
    }).then(()=>{ setForm({nom:'', prenom:'', telephone:'', email:''}); fetchClients() })
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded card">
        <h2 className="font-semibold mb-2">Ajouter un client</h2>
        <form onSubmit={submit} className="space-y-2">
          <input required value={form.nom} onChange={e=>setForm({...form, nom:e.target.value})} placeholder="Nom" className="w-full p-2 border rounded" />
          <input required value={form.prenom} onChange={e=>setForm({...form, prenom:e.target.value})} placeholder="Prénom" className="w-full p-2 border rounded" />
          <input value={form.telephone} onChange={e=>setForm({...form, telephone:e.target.value})} placeholder="Téléphone" className="w-full p-2 border rounded" />
          <input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} placeholder="Email" className="w-full p-2 border rounded" />
          <div>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded">Ajouter</button>
          </div>
        </form>
      </div>

      <div className="bg-white p-4 rounded card col-span-1">
        <h2 className="font-semibold mb-2">Liste des clients</h2>
        <div className="space-y-2">
          {clients.map(c => (
            <div key={c.id} className="p-2 border rounded flex justify-between items-center">
              <div>
                <div className="font-medium">{c.prenom} {c.nom}</div>
                <div className="text-sm text-gray-500">{c.telephone} — {c.email}</div>
              </div>
            </div>
          ))}
          {clients.length===0 && <div className="text-sm text-gray-500">Aucun client</div>}
        </div>
      </div>
    </div>
  )
}
