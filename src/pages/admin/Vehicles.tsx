import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Vehicle } from '@/lib/supabase'
import { Car, Edit, Trash2, Star, Plus, Search, Filter, Eye } from 'lucide-react'

export default function AdminVehicles() {
  const navigate = useNavigate()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterFeatured, setFilterFeatured] = useState<'all' | 'featured' | 'not-featured'>('all')

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false })

      if (filterFeatured === 'featured') {
        query = query.eq('featured', true)
      } else if (filterFeatured === 'not-featured') {
        query = query.eq('featured', false)
      }

      const { data, error } = await query

      if (error) throw error

      setVehicles(data || [])
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteVehicle = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este veículo?')) return

    try {
      // First delete all images associated with this vehicle
      await supabase
        .from('vehicle_images')
        .delete()
        .eq('vehicle_id', id)

      // Then delete the vehicle
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Refresh the list
      fetchVehicles()
    } catch (error) {
      console.error('Error deleting vehicle:', error)
      alert('Erro ao excluir veículo')
    }
  }

  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .update({ 
          featured: !currentFeatured,
          featured_order: !currentFeatured ? 0 : null
        })
        .eq('id', id)

      if (error) throw error

      // Refresh the list
      fetchVehicles()
    } catch (error) {
      console.error('Error updating featured status:', error)
      alert('Erro ao atualizar status de destaque')
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.year.toString().includes(searchTerm)

    const matchesFilter = 
      filterFeatured === 'all' ||
      (filterFeatured === 'featured' && vehicle.featured) ||
      (filterFeatured === 'not-featured' && !vehicle.featured)

    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Veículos</h1>
          <p className="text-gray-600 mt-1">
            Adicione, edite e gerencie os veículos do catálogo
          </p>
        </div>
        <Link
          to="/admin/vehicles/new"
          className="inline-flex items-center px-4 py-2 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Veículo
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por marca, modelo ou ano..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterFeatured}
              onChange={(e) => setFilterFeatured(e.target.value as 'all' | 'featured' | 'not-featured')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
            >
              <option value="all">Todos</option>
              <option value="featured">Em Destaque</option>
              <option value="not-featured">Sem Destaque</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vehicles List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Veículo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ano
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quilometragem
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Destaque
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVehicles.length > 0 ? (
                  filteredVehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {vehicle.brand} {vehicle.model}
                          </div>
                          <div className="text-sm text-gray-500">
                            {vehicle.fuel_type}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {vehicle.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatPrice(vehicle.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {vehicle.mileage.toLocaleString('pt-BR')} km
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                        {vehicle.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleFeatured(vehicle.id, vehicle.featured)}
                          className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                            vehicle.featured
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <Star className={`h-3 w-3 mr-1 ${vehicle.featured ? 'fill-current' : ''}`} />
                          {vehicle.featured ? 'Em Destaque' : 'Sem Destaque'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => navigate(`/vehicle/${vehicle.id}`)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Ver no site"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <Link
                            to={`/admin/vehicles/edit/${vehicle.id}`}
                            className="text-indigo-600 hover:text-indigo-900 p-1"
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => deleteVehicle(vehicle.id)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      <Car className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p>Nenhum veículo encontrado</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{vehicles.length}</div>
            <div className="text-sm text-gray-600">Total de Veículos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {vehicles.filter(v => v.featured).length}
            </div>
            <div className="text-sm text-gray-600">Em Destaque</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {vehicles.filter(v => v.fuel_type === 'electric').length}
            </div>
            <div className="text-sm text-gray-600">Elétricos</div>
          </div>
        </div>
      </div>
    </div>
  )
}
