import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAppStore } from '@/stores/appStore'
import { Car, Calendar, Fuel, Gauge, Package, ChevronLeft, ChevronRight, MessageCircle, Phone, ArrowLeft, Cog } from 'lucide-react'
import { VehicleImage } from '@/components/VehicleImage'

export default function VehicleDetail() {
  const { id } = useParams<{ id: string }>()
  const { selectedVehicle, loading, fetchVehicleById } = useAppStore()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [relatedVehicles, setRelatedVehicles] = useState<any[]>([])
  

  useEffect(() => {
    if (id) {
      fetchVehicleById(id)
    }
  }, [id])

  useEffect(() => {
    const fetchRelated = async () => {
      if (!selectedVehicle) return
      
      try {
        const { data } = await import('@/lib/supabase').then(m => m.supabase
          .from('vehicles')
          .select('id, brand, model, year, price, mileage, fuel_type, category, images:vehicle_images(image_url)')
          .neq('id', selectedVehicle.id)
          .eq('category', selectedVehicle.category)
          .limit(3)
        )
        
        setRelatedVehicles(data || [])
      } catch (error) {
        console.error('Error fetching related vehicles:', error)
      }
    }
    
    fetchRelated()
  }, [selectedVehicle])

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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Veículo não encontrado</h2>
          <p className="text-sm text-muted-foreground">O veículo que você está procurando não está disponível.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            to="/search" 
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Galeria */}
          <div className="lg:col-span-2 space-y-4">
            {/* Imagem Principal */}
            <div className="relative bg-card rounded-lg border overflow-hidden group aspect-video">
              <VehicleImage
                src={selectedVehicle.images[currentImageIndex]?.image_url}
                alt={`${selectedVehicle.brand} ${selectedVehicle.model}`}
                brand={selectedVehicle.brand}
                model={selectedVehicle.model}
                className="w-full h-full object-cover"
                fallbackClassName="rounded-lg"
              />
              
              {selectedVehicle.featured && (
                <div className="absolute top-3 left-3 bg-black text-white px-3 py-1 rounded-md text-xs font-medium">
                  Destaque
                </div>
              )}

              {selectedVehicle.images.length > 1 && (
                <>
                  <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded-md text-xs">
                    {currentImageIndex + 1} / {selectedVehicle.images.length}
                  </div>
                  
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Miniaturas */}
            {selectedVehicle.images.length > 1 && (
              <div className="grid grid-cols-6 gap-2">
                {selectedVehicle.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative rounded-md overflow-hidden border-2 transition-all ${
                      currentImageIndex === index 
                        ? 'border-primary ring-1 ring-primary' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <VehicleImage
                      src={image.image_url}
                      alt={`${index + 1}`}
                      brand={selectedVehicle.brand}
                      model={selectedVehicle.model}
                      className="w-full aspect-video object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Descrição */}
            {selectedVehicle.description && (
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-3">Descrição</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{selectedVehicle.description}</p>
              </div>
            )}

            {/* Especificações */}
            {selectedVehicle.specifications && Object.keys(selectedVehicle.specifications).length > 0 && (
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Cog className="h-5 w-5 mr-2" />
                  Especificações
                </h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(selectedVehicle.specifications).map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <dt className="text-xs text-muted-foreground mb-1">{specLabel[key] || key.replace('_', ' ')}</dt>
                      <dd className="text-sm font-medium">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border p-6 sticky top-24 space-y-6">
              {/* Título */}
              <div>
                <h1 className="text-2xl font-bold mb-1">
                  {selectedVehicle.brand} {selectedVehicle.model}
                </h1>
                <p className="text-sm text-muted-foreground">{selectedVehicle.year}</p>
              </div>
              
              {/* Preço */}
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                <p className="text-xs text-muted-foreground mb-1">Preço</p>
                <p className="text-3xl font-bold text-primary">
                  {formatPrice(selectedVehicle.price)}
                </p>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center text-muted-foreground">
                    <Gauge className="h-4 w-4 mr-1.5" />
                    <span className="text-xs">Km</span>
                  </div>
                  <p className="text-sm font-medium">{selectedVehicle.mileage.toLocaleString('pt-BR')}</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center text-muted-foreground">
                    <Fuel className="h-4 w-4 mr-1.5" />
                    <span className="text-xs">Combustível</span>
                  </div>
                  <p className="text-sm font-medium">{fuelLabel[selectedVehicle.fuel_type] || selectedVehicle.fuel_type}</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center text-muted-foreground">
                    <Package className="h-4 w-4 mr-1.5" />
                    <span className="text-xs">Categoria</span>
                  </div>
                  <p className="text-sm font-medium">{categoryLabel[selectedVehicle.category] || selectedVehicle.category}</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1.5" />
                    <span className="text-xs">Ano</span>
                  </div>
                  <p className="text-sm font-medium">{selectedVehicle.year}</p>
                </div>
              </div>

              <div className="border-t pt-6 space-y-3">
                <a
                  href={whatsappLink(selectedVehicle as any)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  WhatsApp
                </a>

                <a
                  href="tel:+5511942618407"
                  className="flex items-center justify-center w-full px-4 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-colors"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Ligar
                </a>
              </div>

              <div className="text-center text-xs text-muted-foreground pt-2">
                <p>Segunda a sábado, 9h às 18h</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Vehicles Section */}
      {relatedVehicles.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold mb-6">Você também pode gostar</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedVehicles.map((vehicle) => (
              <Link
                key={vehicle.id}
                to={`/vehicle/${vehicle.id}`}
                className="group bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="relative aspect-video bg-muted overflow-hidden">
                  <VehicleImage
                    src={vehicle.images?.[0]?.image_url}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    brand={vehicle.brand}
                    model={vehicle.model}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">{vehicle.year}</p>
                  <h3 className="text-base font-semibold mb-2 group-hover:text-primary transition-colors">
                    {vehicle.brand} {vehicle.model}
                  </h3>
                  
                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="text-lg font-bold">
                      {formatPrice(vehicle.price)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {vehicle.mileage.toLocaleString('pt-BR')} km
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Botão Flutuante Mobile */}
      <a
        href={whatsappLink(selectedVehicle as any)}
        target="_blank"
        rel="noopener noreferrer"
        className="lg:hidden fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg transition-all"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
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
    utility: 'Utilitários',
    motorcycle: 'Moto'
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
