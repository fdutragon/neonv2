import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAppStore } from '@/stores/appStore'
import { Car, Search, Award, Shield, Clock, ArrowRight } from 'lucide-react'
import { VehicleImage } from '@/components/VehicleImage'

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
        
        {/* Padrão de fundo */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDI0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00ek0xMiAxNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMCAyNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40"></div>
        
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
                <div className="absolute z-30 w-full mt-2 bg-white rounded-xl shadow-2xl max-h-[400px] overflow-auto">
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

            {/* Sugestões de Busca - Altura fixa para não mudar o banner */}
            <div className="mt-6 h-10 flex flex-wrap justify-center gap-2">
              {!searchQuery && (
                <>
                  <span className="text-gray-400 text-sm">Sugestões:</span>
                  {['BMW', 'Mercedes-Benz', 'Audi', 'SUV', 'Sedan', 'Diesel'].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setSearchQuery(suggestion)}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-full transition-colors backdrop-blur h-10"
                    >
                      {suggestion}
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Por que escolher a Neon?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Compromisso com excelência em cada detalhe
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group text-center">
              <div className="mb-4">
                <Award className="h-8 w-8 mx-auto text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Qualidade Premium</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Veículos selecionados com rigorosos padrões de qualidade e inspeção completa
              </p>
            </div>

            <div className="group text-center">
              <div className="mb-4">
                <Shield className="h-8 w-8 mx-auto text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Garantia Estendida</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Opções de garantia flexíveis para sua total tranquilidade e segurança
              </p>
            </div>

            <div className="group text-center">
              <div className="mb-4">
                <Clock className="h-8 w-8 mx-auto text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Atendimento Ágil</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Equipe especializada pronta para atender com rapidez e eficiência
              </p>
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
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-black text-white">
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
