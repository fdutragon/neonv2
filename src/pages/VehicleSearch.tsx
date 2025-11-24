import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAppStore } from '@/stores/appStore'
import { Car, Filter, Grid, List, Search as SearchIcon, ChevronDown } from 'lucide-react'

export default function VehicleSearch() {
  const { vehicles, loading, fetchVehicles } = useAppStore()
  const [searchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filters, setFilters] = useState({
    brand: '',
    model: '',
    year_min: '',
    year_max: '',
    price_min: '',
    price_max: '',
    fuel_type: '',
    category: '',
    sort_by: 'created_at_desc'
  })
  const [showFilters, setShowFilters] = useState(false)

  const brands = ['Audi', 'BMW', 'Mercedes-Benz', 'Porsche', 'Jaguar', 'Land Rover', 'Volvo']
  const fuelTypes = [
    { value: 'gasoline', label: 'Gasolina' },
    { value: 'diesel', label: 'Diesel' },
    { value: 'electric', label: 'Elétrico' },
    { value: 'hybrid', label: 'Híbrido' }
  ]
  const categories = [
    { value: 'sedan', label: 'Sedan' },
    { value: 'suv', label: 'SUV' },
    { value: 'hatchback', label: 'Hatchback' },
    { value: 'pickup', label: 'Pick-up' },
    { value: 'coupe', label: 'Cupê' },
    { value: 'convertible', label: 'Conversível' },
    { value: 'wagon', label: 'Wagon' }
  ]

  useEffect(() => {
    fetchVehicles(filters)
  }, [filters])

  useEffect(() => {
    const qp = Object.fromEntries(searchParams.entries())
    setFilters((prev) => ({
      ...prev,
      brand: qp.brand || '',
      model: qp.model || '',
      year_min: qp.year_min || '',
      year_max: qp.year_max || '',
      price_min: qp.price_min || '',
      price_max: qp.price_max || '',
      fuel_type: qp.fuel_type || '',
      category: qp.category || '',
      sort_by: qp.sort_by || prev.sort_by
    }))
  }, [searchParams])

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      brand: '',
      model: '',
      year_min: '',
      year_max: '',
      price_min: '',
      price_max: '',
      fuel_type: '',
      category: '',
      sort_by: 'created_at_desc'
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const activeFiltersCount = Object.values(filters).filter(value => value !== '').length

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Buscar Veículos
          </h1>
          <p className="text-lg text-gray-600">
            Encontre o veículo premium perfeito para você
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
            {activeFiltersCount > 0 && (
              <span className="ml-2 bg-blue-900 text-white text-xs px-2 py-1 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-4">
            <select
              value={filters.sort_by}
              onChange={(e) => handleFilterChange('sort_by', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
            >
              <option value="created_at_desc">Mais Recentes</option>
              <option value="price_asc">Preço: Menor para Maior</option>
              <option value="price_desc">Preço: Maior para Menor</option>
              <option value="year_desc">Ano: Mais Novo</option>
              <option value="year_asc">Ano: Mais Antigo</option>
            </select>

            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Marca</label>
                <select
                  value={filters.brand}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                >
                  <option value="">Todas as Marcas</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Modelo</label>
                <input
                  type="text"
                  value={filters.model}
                  onChange={(e) => handleFilterChange('model', e.target.value)}
                  placeholder="Digite o modelo"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ano (mínimo)</label>
                <input
                  type="number"
                  value={filters.year_min}
                  onChange={(e) => handleFilterChange('year_min', e.target.value)}
                  placeholder="Ex: 2020"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ano (máximo)</label>
                <input
                  type="number"
                  value={filters.year_max}
                  onChange={(e) => handleFilterChange('year_max', e.target.value)}
                  placeholder="Ex: 2024"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preço (mínimo)</label>
                <input
                  type="number"
                  value={filters.price_min}
                  onChange={(e) => handleFilterChange('price_min', e.target.value)}
                  placeholder="Ex: 50000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preço (máximo)</label>
                <input
                  type="number"
                  value={filters.price_max}
                  onChange={(e) => handleFilterChange('price_max', e.target.value)}
                  placeholder="Ex: 500000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Combustível</label>
                <select
                  value={filters.fuel_type}
                  onChange={(e) => handleFilterChange('fuel_type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                >
                  <option value="">Todos os Combustíveis</option>
                  {fuelTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                >
                  <option value="">Todas as Categorias</option>
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>{category.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              {vehicles.length} veículo(s) encontrado(s)
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map((vehicle) => (
                  <div key={vehicle.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                      <div className="w-full h-48 flex items-center justify-center bg-gray-100">
                        <Car className="h-16 w-16 text-gray-400" />
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">{vehicle.year}</span>
                        {vehicle.featured && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
                            Destaque
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {vehicle.brand} {vehicle.model}
                      </h3>
                      
                      <div className="space-y-1 mb-4 text-sm text-gray-600">
                        <p>Quilometragem: {vehicle.mileage.toLocaleString('pt-BR')} km</p>
                        <p>Combustível: {vehicle.fuel_type}</p>
                        <p>Categoria: {vehicle.category}</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-blue-900">
                          {formatPrice(vehicle.price)}
                        </span>
                        
                        <Link
                          to={`/vehicle/${vehicle.id}`}
                          className="inline-flex items-center px-4 py-2 bg-blue-900 text-white text-sm font-medium rounded-md hover:bg-blue-800 transition-colors"
                        >
                          Ver Detalhes
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {vehicles.map((vehicle) => (
                  <div key={vehicle.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="sm:w-48 h-32 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Car className="h-12 w-12 text-gray-400" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {vehicle.brand} {vehicle.model}
                            </h3>
                            <p className="text-gray-600">{vehicle.year}</p>
                          </div>
                          {vehicle.featured && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
                              Destaque
                            </span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Quilometragem:</span>
                            <p>{vehicle.mileage.toLocaleString('pt-BR')} km</p>
                          </div>
                          <div>
                            <span className="font-medium">Combustível:</span>
                            <p>{vehicle.fuel_type}</p>
                          </div>
                          <div>
                            <span className="font-medium">Categoria:</span>
                            <p>{vehicle.category}</p>
                          </div>
                          <div>
                            <span className="font-medium">Preço:</span>
                            <p className="text-lg font-bold text-blue-900">
                              {formatPrice(vehicle.price)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <Link
                            to={`/vehicle/${vehicle.id}`}
                            className="inline-flex items-center px-6 py-2 bg-blue-900 text-white text-sm font-medium rounded-md hover:bg-blue-800 transition-colors"
                          >
                            Ver Detalhes
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {vehicles.length === 0 && (
              <div className="text-center py-12">
                <SearchIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhum veículo encontrado
                </h3>
                <p className="text-gray-600">
                  Tente ajustar seus filtros de busca para encontrar mais opções.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
