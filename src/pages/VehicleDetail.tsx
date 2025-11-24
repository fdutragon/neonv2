import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAppStore } from '@/stores/appStore'
import { Car, Calendar, Fuel, Gauge, Package, ChevronLeft, ChevronRight } from 'lucide-react'

export default function VehicleDetail() {
  const { id } = useParams<{ id: string }>()
  const { selectedVehicle, loading, fetchVehicleById } = useAppStore()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  

  useEffect(() => {
    if (id) {
      fetchVehicleById(id)
    }
  }, [id])

  const whatsappLink = (v?: { brand: string; model: string; year: number; price: number }) => {
    const base = 'https://wa.me/5511942618407'
    if (!v) return base
    const text = `Olá! Tenho interesse no veículo ${v.brand} ${v.model} (${v.year}). Preço: ${formatPrice(v.price)}.`
    return `${base}?text=${encodeURIComponent(text)}`
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const nextImage = () => {
    if (selectedVehicle?.images && selectedVehicle.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === selectedVehicle.images.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (selectedVehicle?.images && selectedVehicle.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedVehicle.images.length - 1 : prev - 1
      )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    )
  }

  if (!selectedVehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Veículo não encontrado</h2>
          <p className="text-gray-600">O veículo que você está procurando não está disponível.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
              {selectedVehicle.images.length > 0 ? (
                <div className="relative">
                  <img
                    src={selectedVehicle.images[currentImageIndex].image_url}
                    alt={`${selectedVehicle.brand} ${selectedVehicle.model}`}
                    className="w-full h-96 object-cover"
                  />
                  {selectedVehicle.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="w-full h-96 flex items-center justify-center bg-gray-100">
                  <Car className="h-24 w-24 text-gray-400" />
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {selectedVehicle.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {selectedVehicle.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-w-16 aspect-h-9 rounded-lg overflow-hidden border-2 ${
                      currentImageIndex === index ? 'border-blue-900' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image.image_url}
                      alt={`${selectedVehicle.brand} ${selectedVehicle.model} ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Vehicle Information */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {selectedVehicle.brand} {selectedVehicle.model}
                  </h1>
                  <p className="text-lg text-gray-600">{selectedVehicle.year}</p>
                </div>
                {selectedVehicle.featured && (
                  <span className="bg-yellow-100 text-yellow-800 text-sm font-semibold px-3 py-1 rounded-full">
                    Destaque
                  </span>
                )}
              </div>
              
              <div className="text-4xl font-bold text-blue-900 mb-6">
                {formatPrice(selectedVehicle.price)}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Gauge className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-gray-600">Quilometragem</p>
                    <p className="font-semibold">{selectedVehicle.mileage.toLocaleString('pt-BR')} km</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Fuel className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-gray-600">Combustível</p>
                    <p className="font-semibold">{fuelLabel[selectedVehicle.fuel_type] || selectedVehicle.fuel_type}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-gray-600">Categoria</p>
                    <p className="font-semibold">{categoryLabel[selectedVehicle.category] || selectedVehicle.category}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-gray-600">Ano</p>
                    <p className="font-semibold">{selectedVehicle.year}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {selectedVehicle.description && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Descrição</h3>
                <p className="text-gray-700 leading-relaxed">{selectedVehicle.description}</p>
              </div>
            )}

            {/* Specifications */}
            {selectedVehicle.specifications && Object.keys(selectedVehicle.specifications).length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Especificações Técnicas</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(selectedVehicle.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">{specLabel[key] || key.replace('_', ' ')}</span>
                      <span className="font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* WhatsApp CTA */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Fale conosco no WhatsApp</h3>
          <a
            href={whatsappLink(selectedVehicle as any)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
          >
            <svg aria-hidden="true" focusable="false" width="22" height="22" viewBox="0 0 32 32" className="mr-2">
              <path fill="currentColor" d="M19.11 17.39c-.3-.15-1.77-.87-2.05-.97c-.28-.1-.48-.15-.68.15c-.2.3-.78.97-.95 1.17c-.17.2-.35.22-.65.07c-.3-.15-1.27-.47-2.42-1.5c-.89-.79-1.49-1.76-1.66-2.06c-.17-.3-.02-.47.13-.62c.13-.13.3-.35.45-.52c.15-.17.2-.3.3-.5c.1-.2.05-.37-.03-.52c-.08-.15-.68-1.63-.93-2.23c-.24-.58-.49-.5-.68-.5h-.58c-.2 0-.52.07-.79.37c-.27.3-1.04 1.02-1.04 2.48c0 1.46 1.07 2.87 1.22 3.07c.15.2 2.1 3.21 5.07 4.5c.71.31 1.26.49 1.69.62c.71.23 1.36.2 1.88.12c.58-.09 1.77-.72 2.02-1.42c.25-.7.25-1.3.17-1.42c-.08-.12-.27-.2-.57-.35z"/>
              <path fill="currentColor" d="M16.02 3C9.38 3 4 8.37 4 15c0 2.66.87 5.13 2.35 7.13L4 29l6.04-2.31C12 27.85 13.98 28 16.02 28C22.66 28 28 22.62 28 16c0-6.63-5.34-13-11.98-13zm0 22c-1.88 0-3.63-.49-5.15-1.36l-.37-.22l-3.59 1.37l1.35-3.5l-.24-.37C6.5 19.14 6 17.61 6 16c0-5.53 4.49-10 10.02-10C21.54 6 26 10.47 26 16c0 5.53-4.46 9-9.98 9z"/>
            </svg>
            Fale conosco no WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
  const fuelLabel: Record<string, string> = {
    gasoline: 'Gasolina',
    diesel: 'Diesel',
    electric: 'Elétrico',
    flex: 'Flex'
  }

  const categoryLabel: Record<string, string> = {
    sedan: 'Sedan',
    suv: 'SUV',
    hatchback: 'Hatchback',
    pickup: 'Pick-up',
    coupe: 'Cupê',
    convertible: 'Conversível',
    wagon: 'Wagon',
    utility: 'Utilitários'
  }

  const specLabel: Record<string, string> = {
    engine: 'Motor',
    power: 'Potência',
    torque: 'Torque',
    acceleration: 'Aceleração',
    top_speed: 'Velocidade Máxima',
    consumption: 'Consumo',
    transmission: 'Câmbio',
    traction: 'Tração',
    drivetrain: 'Tração'
  }
