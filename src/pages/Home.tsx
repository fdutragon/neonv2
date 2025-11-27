import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAppStore } from '@/stores/appStore'
import { Car, Search, Award, Shield, Clock, ArrowRight } from 'lucide-react'
import { VehicleImage } from '@/components/VehicleImage'
import { ParticlesBackground } from '@/components/ParticlesBackground'

interface Vehicle {
  id: string
  brand: string
  model: string
  year: number
  price: number
  mileage: number
  fuel_type: string
  category: string
  images: { image_url: string }[]
}

export default function Home() {
  const { featuredVehicles, loading, fetchFeaturedVehicles } = useAppStore()
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Vehicle[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    fetchFeaturedVehicles()
  }, [])

  // Busca dinâmica conforme o usuário digita
  useEffect(() => {
    const searchVehicles = async () => {
      const query = searchQuery.trim()
      
      if (!query) {
        setSearchResults([])
        setShowResults(false)
        return
      }

      setIsSearching(true)
      setShowResults(true)

      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('id, brand, model, year, price, mileage, fuel_type, category, images:vehicle_images(image_url)')
          .or(`brand.ilike.%${query}%,model.ilike.%${query}%,category.ilike.%${query}%,fuel_type.ilike.%${query}%`)
          .order('created_at', { ascending: false })
          .limit(8)

        if (error) throw error

        setSearchResults((data as any) || [])
      } catch (error) {
        console.error('Erro ao buscar veículos:', error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }

    const debounce = setTimeout(searchVehicles, 300)
    return () => clearTimeout(debounce)
  }, [searchQuery])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        {/* Efeito de luz elegante */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-blue-500/10 to-transparent rounded-full blur-2xl"></div>
        </div>
        
        {/* Partículas elegantes */}
        <ParticlesBackground />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 pb-32">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <span className="text-sm font-semibold tracking-wider uppercase text-yellow-400/80 bg-yellow-400/10 px-4 py-2 rounded-full border border-yellow-400/20">
                Neon Multimarcas
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
              Seu Próximo Veículo
              <span className="block bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent mt-2">
                Está Aqui
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Encontre carros e motos de todas as marcas com qualidade garantida e atendimento especializado
            </p>
          </div>

          {/* Busca Única e Dinâmica */}
          <div className="max-w-3xl mx-auto min-h-[80px]">
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 z-10" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery && setShowResults(true)}
                  onBlur={() => setTimeout(() => setShowResults(false), 200)}
                  placeholder="Digite marca, modelo, categoria..."
                  className="w-full pl-14 pr-4 py-5 text-lg rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:ring-4 focus:ring-yellow-400/50 focus:outline-none shadow-2xl"
                />
              </div>

              {/* Resultados da Busca */}
              {showResults && searchQuery && (
                <div className="absolute z-[60] w-full mt-2 bg-white rounded-xl shadow-2xl max-h-[400px] overflow-auto">
                  {isSearching ? (
                    <div className="p-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto"></div>
                      <p className="text-gray-600 mt-3">Buscando...</p>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="p-2">
                      <div className="px-4 py-2 text-sm text-gray-500 border-b">
                        {searchResults.length} veículo(s) encontrado(s)
                      </div>
                      {searchResults.map((vehicle) => (
                        <Link
                          key={vehicle.id}
                          to={`/vehicle/${vehicle.id}`}
                          className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors"
                          onClick={() => {
                            setShowResults(false)
                            setSearchQuery('')
                          }}
                        >
                          <div className="w-20 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {vehicle.images?.[0]?.image_url ? (
                              <img
                                src={vehicle.images[0].image_url}
                                alt={`${vehicle.brand} ${vehicle.model}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                <Car className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-gray-900 font-semibold truncate">
                              {vehicle.brand} {vehicle.model}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {vehicle.year} • {vehicle.mileage.toLocaleString('pt-BR')} km
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-yellow-600">
                              {formatPrice(vehicle.price)}
                            </p>
                          </div>
                        </Link>
                      ))}
                      <div className="p-4 border-t">
                        <button
                          onClick={() => {
                            navigate(`/search?q=${searchQuery}`)
                            setShowResults(false)
                          }}
                          className="w-full py-2 text-center text-yellow-600 hover:text-yellow-700 font-medium"
                        >
                          Ver todos os resultados →
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <Car className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-600">Nenhum veículo encontrado</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Tente buscar por marca, modelo ou categoria
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sugestões de Busca */}
            <div className="mt-6">
              {!searchQuery && (
                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    { label: 'BMW', value: 'BMW' },
                    { label: 'Mercedes-Benz', value: 'Mercedes-Benz' },
                    { label: 'Audi', value: 'Audi' },
                    { label: 'SUV', value: 'SUV' },
                    { label: 'Sedan', value: 'Sedan' },
                    { label: 'Elétrico', value: 'electric' },
                    { label: 'Flex', value: 'flex' },
                    { label: 'Moto', value: 'motorcycle' },
                    { label: 'Pick-up', value: 'pickup' }
                  ].map((suggestion) => (
                    <button
                      key={suggestion.value}
                      onClick={() => setSearchQuery(suggestion.value)}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg border border-white/20 hover:border-white/40 backdrop-blur-sm transition-all duration-200 hover:scale-105"
                    >
                      {suggestion.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Por que escolher a Neon?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Compromisso com excelência em cada detalhe
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 - Qualidade Premium */}
            <div className="group relative bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-xl hover:border-blue-200 transition-all duration-300">
              {/* Efeito de brilho sutil */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative">
                {/* Ícone com fundo elegante */}
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 mb-6 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                  <Award className="h-7 w-7 text-white" />
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-gray-900">Qualidade Premium</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Veículos selecionados com rigorosos padrões de qualidade e inspeção completa
                </p>
                
                {/* Linha decorativa */}
                <div className="mt-6 h-1 w-12 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full"></div>
              </div>
            </div>

            {/* Card 2 - Garantia Estendida */}
            <div className="group relative bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-xl hover:border-green-200 transition-all duration-300">
              {/* Efeito de brilho sutil */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative">
                {/* Ícone com fundo elegante */}
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 mb-6 shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-gray-900">Garantia Estendida</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Opções de garantia flexíveis para sua total tranquilidade e segurança
                </p>
                
                {/* Linha decorativa */}
                <div className="mt-6 h-1 w-12 bg-gradient-to-r from-green-500 to-green-300 rounded-full"></div>
              </div>
            </div>

            {/* Card 3 - Atendimento Ágil */}
            <div className="group relative bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-xl hover:border-yellow-200 transition-all duration-300">
              {/* Efeito de brilho sutil */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative">
                {/* Ícone com fundo elegante */}
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 mb-6 shadow-lg shadow-yellow-500/30 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="h-7 w-7 text-white" />
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-gray-900">Atendimento Ágil</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Equipe especializada pronta para atender com rapidez e eficiência
                </p>
                
                {/* Linha decorativa */}
                <div className="mt-6 h-1 w-12 bg-gradient-to-r from-yellow-500 to-yellow-300 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Veículos em Destaque
            </h2>
            <p className="text-lg text-gray-600">
              Seleção especial dos nossos veículos mais procurados
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredVehicles.map((vehicle) => (
                <Link
                  key={vehicle.id}
                  to={`/vehicle/${vehicle.id}`}
                  className="group bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="relative aspect-video bg-muted overflow-hidden">
                    <VehicleImage
                      src={vehicle.images[0]?.image_url}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      brand={vehicle.brand}
                      model={vehicle.model}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 shadow-lg shadow-yellow-500/50 backdrop-blur-sm">
                        <Award className="h-3.5 w-3.5" />
                        Destaque
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground mb-1">{vehicle.year}</p>
                        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                          {vehicle.brand} {vehicle.model}
                        </h3>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                      <div className="flex flex-col">
                        <span className="text-muted-foreground">Km</span>
                        <span className="font-medium">{vehicle.mileage.toLocaleString('pt-BR')}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground">Combustível</span>
                        <span className="font-medium">{fuelLabel[vehicle.fuel_type] || vehicle.fuel_type}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <p className="text-xs text-muted-foreground">Preço</p>
                        <span className="text-xl font-bold">
                          {formatPrice(vehicle.price)}
                        </span>
                      </div>
                      
                      <div className="inline-flex items-center text-sm font-medium text-primary">
                        Ver mais
                        <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {featuredVehicles.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                <Car className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Nenhum veículo em destaque
              </h3>
              <p className="text-gray-600">
                Em breve teremos veículos especiais para você!
              </p>
            </div>
          )}

          {/* View All Button */}
          {featuredVehicles.length > 0 && (
            <div className="text-center mt-12">
              <Link
                to="/search"
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
              >
                Ver Todos os Veículos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
