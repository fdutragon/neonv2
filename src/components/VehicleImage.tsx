import { useState } from 'react'
import { Car } from 'lucide-react'
import { getVehicleFallbackImage } from '@/lib/unsplash'

interface VehicleImageProps {
  src?: string
  alt: string
  brand: string
  model: string
  className?: string
  fallbackClassName?: string
}

export function VehicleImage({ 
  src, 
  alt, 
  brand, 
  model, 
  className = '',
  fallbackClassName = ''
}: VehicleImageProps) {
  const [imageError, setImageError] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // If no src provided or image failed to load, use logo fallback
  const shouldUseFallback = !src || imageError
  const logoSrc = getVehicleFallbackImage(brand, model, 800, 600)

  if (shouldUseFallback) {
    return (
      <div className={`relative w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden ${fallbackClassName}`}>
        {/* Efeitos de fundo modernos */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(168,85,247,0.08),transparent_50%)]"></div>
        
        {/* Grid pattern sutil */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
        {/* Brilho animado */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/20 to-transparent"></div>
        
        {!logoError ? (
          <div className="relative flex flex-col items-center justify-center gap-4 p-6 z-10">
            {/* Logo container com efeito glassmorphism */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative w-24 h-24 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-4 border border-white/20 group-hover:scale-105 transition-transform duration-300">
                <img
                  src={logoSrc}
                  alt={`${brand} logo`}
                  className="w-full h-full object-contain"
                  onError={() => setLogoError(true)}
                />
              </div>
            </div>
            
            {/* Texto com efeito */}
            <div className="text-center">
              <p className="text-sm font-bold text-white tracking-wide drop-shadow-lg">{brand}</p>
              <p className="text-xs text-gray-300 mt-1 font-medium">{model}</p>
            </div>
          </div>
        ) : (
          <div className="relative flex flex-col items-center justify-center gap-4 z-10">
            {/* Fallback icon com efeito */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative w-24 h-24 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 group-hover:scale-105 transition-transform duration-300">
                <Car className="h-12 w-12 text-slate-600" />
              </div>
            </div>
            
            {/* Texto com efeito */}
            <div className="text-center">
              <p className="text-sm font-bold text-white tracking-wide drop-shadow-lg">{brand}</p>
              <p className="text-xs text-gray-300 mt-1 font-medium">{model}</p>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className={`absolute inset-0 flex items-center justify-center bg-muted ${fallbackClassName}`}>
          <Car className="h-12 w-12 text-muted-foreground animate-pulse" />
        </div>
      )}
      
      <img
        src={src}
        alt={alt}
        className={className}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImageError(true)
          setIsLoading(false)
        }}
      />
    </div>
  )
}
