import React, { useState } from 'react'

export default function Logo({ size = 'medium', showText = true }) {
  const [imageError, setImageError] = useState(false)

  const sizeMap = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  }

  const textMap = {
    small: 'text-lg',
    medium: 'text-2xl',
    large: 'text-4xl'
  }

  return (
    <div className="flex items-center gap-2">
      {/* Logo Image PNG - avec fallback emoji */}
      {!imageError ? (
        <img 
          src="/logo-ryd.png" 
          alt="RYD Logo" 
          className={`${sizeMap[size]} object-contain`}
          onError={() => setImageError(true)}
        />
      ) : (
        <div className={`${sizeMap[size]} flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white font-bold text-xl`}>
          🚗
        </div>
      )}
      
      {/* Texte RYD Planner */}
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold ${textMap[size]} text-gray-900 leading-none`}>RYD</span>
          <span className="text-xs font-semibold text-blue-600 leading-none">Planner</span>
        </div>
      )}
    </div>
  )
}
