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
      <div className={`relative w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 ${fallbackClassName}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_50%)]"></div>
        
        {!logoError ? (
          <div className="relative flex flex-col items-center justify-center gap-4 p-6">
            <div className="w-24 h-24 flex items-center justify-center bg-white rounded-2xl shadow-lg p-4">
              <img
                src={logoSrc}
                alt={`${brand} logo`}
                className="w-full h-full object-contain"
                onError={() => setLogoError(true)}
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-white">{brand}</p>
              <p className="text-xs text-gray-400 mt-1">{model}</p>
            </div>
          </div>
        ) : (
          <div className="relative flex flex-col items-center justify-center gap-4">
            <div className="w-24 h-24 flex items-center justify-center bg-white rounded-2xl shadow-lg">
              <Car className="h-12 w-12 text-gray-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-white">{brand}</p>
              <p className="text-xs text-gray-400 mt-1">{model}</p>
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
