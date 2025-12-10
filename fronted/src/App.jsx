import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import CallForm from './components/CallForm'
import Clients from './components/Clients'
import Vehicles from './components/Vehicles'
import Teams from './components/Teams'
import Missions from './components/Missions'
import Archives from './components/Archives'
import Dispatch from './components/Dispatch'
import Availability from './components/Availability'
import SignaturePage from './components/SignaturePage'

function MainApp(){
  const [view, setView] = useState('call')
  const [showConfig, setShowConfig] = useState(false)
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
  const FRONTEND_URL = window.location.origin
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/logo-ryd.png" 
                alt="RYD Logo" 
                className="h-12 w-12 object-contain"
                onError={(e) => {e.target.style.display = 'none'}}
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">RYD Planner</h1>
                <p className="text-gray-600 text-sm">Système de gestion de missions de transport</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo à gauche */}
            <div className="py-3">
              <img 
                src="/logo-ryd.png" 
                alt="RYD Logo" 
                className="h-6 w-6 object-contain"
                onError={(e) => {e.target.style.display = 'none'}}
              />
            </div>
            
            {/* Menus au centre */}
            <div className="flex space-x-8">
              <button 
                onClick={()=>setView('call')} 
                className={"py-4 px-1 border-b-2 font-medium text-sm " + (view==='call' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300')}
              >
                📞 Appel Entrant
              </button>
              <button 
                onClick={()=>setView('dispatch')} 
                className={"py-4 px-1 border-b-2 font-medium text-sm " + (view==='dispatch' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300')}
              >
                🚚 Dispatch
              </button>
              <button 
                onClick={()=>setView('availability')} 
                className={"py-4 px-1 border-b-2 font-medium text-sm " + (view==='availability' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300')}
              >
                📍 Disponibilité
              </button>
              <button 
                onClick={()=>setView('missions')} 
                className={"py-4 px-1 border-b-2 font-medium text-sm " + (view==='missions' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300')}
              >
                📋 Missions
              </button>
              <button 
                onClick={()=>setView('teams')} 
                className={"py-4 px-1 border-b-2 font-medium text-sm " + (view==='teams' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300')}
              >
                👥 Équipes
              </button>
              <button 
                onClick={()=>setView('clients')} 
                className={"py-4 px-1 border-b-2 font-medium text-sm " + (view==='clients' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300')}
              >
                👤 Clients
              </button>
              <button 
                onClick={()=>setView('vehicles')} 
                className={"py-4 px-1 border-b-2 font-medium text-sm " + (view==='vehicles' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300')}
              >
                🚙 Véhicules
              </button>
              <button 
                onClick={()=>setView('archives')} 
                className={"py-4 px-1 border-b-2 font-medium text-sm " + (view==='archives' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300')}
              >
                📁 Archives
              </button>
            </div>

            {/* Bouton Config à droite */}
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium text-sm"
              title="Afficher les données opérationnelles"
            >
              ⚙️ Config
            </button>
          </div>
        </div>
      </nav>

      {/* Popup Config */}
      {showConfig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="border-b p-6 flex justify-between items-center">
              <h3 className="text-xl font-bold">⚙️ Données Opérationnelles</h3>
              <button 
                onClick={() => setShowConfig(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-600 mb-2">🖥️ Frontend</div>
                <div className="font-mono text-sm text-gray-900 break-all">{FRONTEND_URL}</div>
                <button
                  onClick={() => {navigator.clipboard.writeText(FRONTEND_URL); alert('Copié!')}}
                  className="mt-2 text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Copier
                </button>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-600 mb-2">🔌 Backend API</div>
                <div className="font-mono text-sm text-gray-900 break-all">{API_URL}</div>
                <button
                  onClick={() => {navigator.clipboard.writeText(API_URL); alert('Copié!')}}
                  className="mt-2 text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Copier
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <div className="text-sm font-medium text-blue-900 mb-2">📍 Réseau LAN</div>
                <div className="text-xs text-blue-800 space-y-2">
                  <div><strong>IP du serveur:</strong> 192.168.1.101</div>
                  <div><strong>Port Frontend:</strong> 5173</div>
                  <div><strong>Port Backend:</strong> 3000</div>
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <strong>URL autre ordinateur:</strong>
                    <div className="font-mono mt-1">http://192.168.1.101:5173</div>
                  </div>
                </div>
              </div>

              <div className="text-center text-xs text-gray-500">
                ✅ Tous les serveurs sont opérationnels
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 py-8">
        {view === 'call' && <CallForm />}
        {view === 'dispatch' && <Dispatch />}
        {view === 'availability' && <Availability />}
        {view === 'missions' && <Missions />}
        {view === 'teams' && <Teams />}
        {view === 'clients' && <Clients />}
        {view === 'vehicles' && <Vehicles />}
        {view === 'archives' && <Archives />}
      </main>
    </div>
  )
}

export default function App(){
  return (
    <Router>
      <Routes>
        <Route path="/signature" element={<SignaturePage />} />
        <Route path="/*" element={<MainApp />} />
      </Routes>
    </Router>
  )
}
