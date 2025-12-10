import React, { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function SignaturePage() {
  const [searchParams] = useSearchParams()
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [missionData, setMissionData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  const missionId = searchParams.get('mission')
  const stage = searchParams.get('stage') // 'debut' ou 'fin'
  const token = searchParams.get('token')

  useEffect(() => {
    fetchMissionData()
  }, [missionId, stage, token])

  async function fetchMissionData() {
    try {
      const res = await fetch(`${API}/api/missions/${missionId}`)
      if (!res.ok) throw new Error('Mission non trouvée')
      const data = await res.json()
      setMissionData(data)
      setLoading(false)
    } catch (err) {
      setError('Erreur: ' + err.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = 2
    ctx.strokeStyle = '#000'
  }, [])

  function startDrawing(e) {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext('2d')
    
    ctx.beginPath()
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
    setIsDrawing(true)
  }

  function draw(e) {
    if (!isDrawing) return
    
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext('2d')
    
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
    ctx.stroke()
  }

  function stopDrawing() {
    setIsDrawing(false)
  }

  function clearSignature() {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  async function submitSignature() {
    try {
      const canvas = canvasRef.current
      const signatureData = canvas.toDataURL('image/png')

      const res = await fetch(`${API}/api/missions/${missionId}/signature`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage,
          signature: signatureData,
          token
        })
      })

      const data = await res.json()
      
      if (res.ok) {
        setSubmitted(true)
      } else {
        setError('Erreur: ' + (data.error || 'Impossible de sauvegarder'))
      }
    } catch (err) {
      setError('Erreur: ' + err.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-4xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erreur</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-green-600 mb-4">
            Signature enregistrée !
          </h1>
          <p className="text-gray-600 mb-6">
            {stage === 'debut' ? 'Mission débutée avec succès' : 'Mission terminée avec succès'}
          </p>
          <p className="text-sm text-gray-500">
            Vous pouvez fermer cette page
          </p>
        </div>
      </div>
    )
  }

  const stageLabel = stage === 'debut' ? 'Début de Mission' : 'Fin de Mission'
  const stageIcon = stage === 'debut' ? '🚗' : '✓'

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-lg shadow-lg p-6 border-b-4 border-blue-600">
          <div className="flex items-center gap-3 mb-4">
            <img 
              src="/logo-ryd.png" 
              alt="RYD Logo" 
              className="h-10 w-10 object-contain"
              onError={(e) => {e.target.style.display = 'none'}}
            />
            <h1 className="text-3xl font-bold text-gray-900">RYD Planner</h1>
          </div>
          <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            {stageIcon} {stageLabel}
          </h2>
        </div>

        {/* Mission Details */}
        <div className="bg-white shadow-lg p-6 space-y-3 border-l-4 border-blue-600">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Mission N°</p>
              <p className="text-xl font-bold text-gray-900">#{missionData?.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Client</p>
              <p className="text-lg font-semibold text-gray-900">
                {missionData?.client_prenom} {missionData?.client_nom}
              </p>
            </div>
          </div>
          <div className="bg-blue-50 p-3 rounded">
            <p className="text-sm text-gray-600">Itinéraire</p>
            <p className="font-semibold text-gray-900">
              📍 {missionData?.lieu_depart} → {missionData?.lieu_arrivee}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm text-gray-600">Véhicule</p>
            <p className="font-semibold text-gray-900">
              🚗 {missionData?.veh_marque} {missionData?.veh_modele} ({missionData?.veh_immat})
            </p>
          </div>
        </div>

        {/* Signature Canvas */}
        <div className="bg-white shadow-lg p-6 space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Signature du client</h3>
          <p className="text-sm text-gray-600">
            Veuillez signer ci-dessous avec votre doigt ou votre souris
          </p>
          
          <canvas
            ref={canvasRef}
            width={500}
            height={250}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="w-full border-2 border-gray-300 rounded-lg cursor-crosshair bg-white"
            style={{touchAction: 'none'}}
          />

          <div className="flex gap-3">
            <button
              onClick={clearSignature}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-medium"
            >
              🗑️ Effacer
            </button>
            <button
              onClick={submitSignature}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              ✅ Confirmer
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-blue-600 rounded-b-lg shadow-lg p-4 text-white text-center text-sm">
          <p>🔒 Signature sécurisée et enregistrée</p>
        </div>
      </div>
    </div>
  )
}
