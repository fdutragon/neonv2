import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAppStore } from '@/stores/appStore'
import { Car, Phone, Mail, User, Calendar, Fuel, Gauge, Package, ChevronLeft, ChevronRight } from 'lucide-react'

export default function VehicleDetail() {
  const { id } = useParams<{ id: string }>()
  const { selectedVehicle, loading, fetchVehicleById, submitContactInterest } = useAppStore()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    if (id) {
      fetchVehicleById(id)
    }
  }, [id])

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return

    setSubmitting(true)
    try {
      await submitContactInterest({
        vehicle_id: id,
        customer_name: contactForm.name,
        customer_email: contactForm.email,
        customer_phone: contactForm.phone,
        message: contactForm.message
      })
      
      setSubmitSuccess(true)
      setContactForm({ name: '', email: '', phone: '', message: '' })
      
      setTimeout(() => {
        setSubmitSuccess(false)
      }, 5000)
    } catch (error) {
      console.error('Error submitting contact form:', error)
    } finally {
      setSubmitting(false)
    }
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

        {/* Contact Form */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Entre em Contato</h3>
          
          {submitSuccess && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              <p className="font-semibold">Obrigado pelo seu interesse!</p>
              <p>Entraremos em contato em breve para mais informações sobre este veículo.</p>
            </div>
          )}

          <form onSubmit={handleContactSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  placeholder="Seu nome"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Telefone *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  id="phone"
                  required
                  value={contactForm.phone}
                  onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  placeholder="(11) 12345-6789"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Mensagem
              </label>
              <textarea
                id="message"
                rows={4}
                value={contactForm.message}
                onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                placeholder="Tenho interesse neste veículo. Por favor, entre em contato."
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full md:w-auto px-8 py-3 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'Enviando...' : 'Enviar Interesse'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
  const fuelLabel: Record<string, string> = {
    gasoline: 'Gasolina',
    diesel: 'Diesel',
    electric: 'Elétrico',
    hybrid: 'Híbrido'
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
