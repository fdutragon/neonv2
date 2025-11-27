import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Car, Grid, List, Search as SearchIcon, ArrowRight } from 'lucide-react'
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
  featured: boolean
  images: { image_url: string }[]
}

export default function VehicleSearch() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [sortBy, setSortBy] = useState(searchParams.get('sort_by') || 'created_at_desc')

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

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true)
      try {
        let query = supabase
          .from('vehicles')
          .select('id, brand, model, year, price, mileage, fuel_type, category, featured, images:vehicle_images(image_url)')

        // Aplicar busca por texto
        if (searchQuery) {
          query = query.or(`brand.ilike.%${searchQuery}%,model.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%,fuel_type.ilike.%${searchQuery}%`)
        }

        // Aplicar ordenação
        switch (sortBy) {
          case 'price_asc':
            query = query.order('price', { ascending: true })
            break
          case 'price_desc':
            query = query.order('price', { ascending: false })
            break
          case 'year_desc':
            query = query.order('year', { ascending: false })
            break
          case 'year_asc':
            query = query.order('year', { ascending: true })
            break
          default:
            query = query.order('created_at', { ascending: false })
        }

        const { data, error } = await query

        if (error) throw error
        setVehicles((data as any) || [])
      } catch (error) {
        console.error('Erro ao buscar veículos:', error)
        setVehicles([])
      } finally {
        setLoading(false)
      }
    }

    const debounce = setTimeout(fetchVehicles, 300)
    return () => clearTimeout(debounce)
  }, [searchQuery, sortBy])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    const params = new URLSearchParams()
    if (value) params.set('q', value)
    if (sortBy !== 'created_at_desc') params.set('sort_by', sortBy)
    setSearchParams(params)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (value !== 'created_at_desc') params.set('sort_by', value)
    setSearchParams(params)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Buscar Veículos
          </h1>
          <p className="text-lg text-gray-600">
            Encontre o veículo perfeito para você
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-3xl">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Digite marca, modelo, categoria... (ex: BMW, 320i, SUV, Diesel)"
              className="w-full pl-12 pr-4 py-4 text-lg rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:ring-4 focus:ring-yellow-400/50 focus:outline-none shadow-lg"
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="text-sm text-gray-600">
            {loading ? 'Buscando...' : `${vehicles.length} veículo(s) encontrado(s)`}
          </div>

          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-white"
            >
              <option value="created_at_desc">Mais Recentes</option>
              <option value="price_asc">Preço: Menor para Maior</option>
              <option value="price_desc">Preço: Maior para Menor</option>
              <option value="year_desc">Ano: Mais Novo</option>
              <option value="year_asc">Ano: Mais Antigo</option>
            </select>

            <div className="flex border border-gray-300 rounded-lg overflow-hidden bg-white">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-yellow-400 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-yellow-400 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map((vehicle) => (
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
                      {vehicle.featured && (
                        <div className="absolute top-3 right-3">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-black text-white">
                            Destaque
                          </span>
                        </div>
                      )}
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
            ) : (
              <div className="space-y-4">
                {vehicles.map((vehicle) => (
                  <Link
                    key={vehicle.id}
                    to={`/vehicle/${vehicle.id}`}
                    className="group block bg-card rounded-lg border border-border p-5 hover:shadow-lg transition-all"
                  >
                    <div className="flex flex-col sm:flex-row gap-5">
                      <div className="sm:w-48 h-32 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                        <VehicleImage
                          src={vehicle.images?.[0]?.image_url}
                          alt={`${vehicle.brand} ${vehicle.model}`}
                          brand={vehicle.brand}
                          model={vehicle.model}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors truncate">
                              {vehicle.brand} {vehicle.model}
                            </h3>
                            <p className="text-sm text-muted-foreground">{vehicle.year}</p>
                          </div>
                          {vehicle.featured && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-black text-white ml-2">
                              Destaque
                            </span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-sm">
                          <div>
                            <span className="block text-xs text-muted-foreground">Km</span>
                            <span className="font-medium">{vehicle.mileage.toLocaleString('pt-BR')}</span>
                          </div>
                          <div>
                            <span className="block text-xs text-muted-foreground">Combustível</span>
                            <span className="font-medium">{fuelLabel[vehicle.fuel_type] || vehicle.fuel_type}</span>
                          </div>
                          <div>
                            <span className="block text-xs text-muted-foreground">Categoria</span>
                            <span className="font-medium">{categoryLabel[vehicle.category] || vehicle.category}</span>
                          </div>
                          <div>
                            <span className="block text-xs text-muted-foreground">Preço</span>
                            <span className="text-lg font-bold">
                              {formatPrice(vehicle.price)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <div className="inline-flex items-center text-sm font-medium text-primary">
                            Ver mais
                            <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {vehicles.length === 0 && (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                  <SearchIcon className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Nenhum veículo encontrado
                </h3>
                <p className="text-gray-600 mb-6">
                  Tente buscar por marca, modelo ou categoria
                </p>
                <button
                  onClick={() => handleSearch('')}
                  className="inline-flex items-center px-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-xl hover:bg-yellow-500 transition-colors"
                >
                  Ver Todos os Veículos
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
