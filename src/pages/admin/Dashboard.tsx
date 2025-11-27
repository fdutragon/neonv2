import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppStore } from '@/stores/appStore'
import { supabase, ContactInterest } from '@/lib/supabase'
import { Car, Users, Star, Eye, Plus, TrendingUp, Calendar, DollarSign } from 'lucide-react'

export default function AdminDashboard() {
  const { featuredVehicles, fetchFeaturedVehicles } = useAppStore()
  const [metrics, setMetrics] = useState({
    totalVehicles: 0,
    featuredVehicles: 0,
    totalContacts: 0,
    recentViews: 0
  })
  const [recentContacts, setRecentContacts] = useState<(ContactInterest & { vehicles?: { brand: string; model: string } })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMetrics()
    fetchRecentContacts()
    fetchFeaturedVehicles()
  }, [fetchFeaturedVehicles])

  const fetchMetrics = async () => {
    try {
      // Total vehicles
      const { count: totalVehicles } = await supabase
        .from('vehicles')
        .select('*', { count: 'exact', head: true })

      // Featured vehicles
      const { count: featuredVehiclesCount } = await supabase
        .from('vehicles')
        .select('*', { count: 'exact', head: true })
        .eq('featured', true)

      // Total contacts
      const { count: totalContacts } = await supabase
        .from('contact_interests')
        .select('*', { count: 'exact', head: true })

      // Recent contacts (last 30 days)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { count: recentContacts } = await supabase
        .from('contact_interests')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString())

      setMetrics({
        totalVehicles: totalVehicles || 0,
        featuredVehicles: featuredVehiclesCount || 0,
        totalContacts: totalContacts || 0,
        recentViews: recentContacts || 0
      })
    } catch (error) {
      console.error('Error fetching metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentContacts = async () => {
    try {
      const { data } = await supabase
        .from('contact_interests')
        .select(`
          *,
          vehicles!inner(brand, model)
        `)
        .order('created_at', { ascending: false })
        .limit(5)

      setRecentContacts(data || [])
    } catch (error) {
      console.error('Error fetching recent contacts:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const metricsCards = [
    {
      title: 'Total de Veículos',
      value: metrics.totalVehicles,
      icon: Car,
      color: 'blue',
      trend: '+12%',
      description: 'Este mês'
    },
    {
      title: 'Veículos em Destaque',
      value: metrics.featuredVehicles,
      icon: Star,
      color: 'yellow',
      trend: '+5%',
      description: 'Este mês'
    },
    {
      title: 'Interesses Recebidos',
      value: metrics.recentViews,
      icon: Users,
      color: 'green',
      trend: '+18%',
      description: 'Últimos 30 dias'
    },
    {
      title: 'Total de Contatos',
      value: metrics.totalContacts,
      icon: Eye,
      color: 'purple',
      trend: '+25%',
      description: 'Total geral'
    }
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Visão geral da concessionária</p>
        </div>
        <Link
          to="/admin/vehicles/new"
          className="inline-flex items-center px-4 py-2 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Veículo
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricsCards.map((card, index) => {
          const Icon = card.icon
          const colorClasses = {
            blue: 'bg-blue-100 text-blue-800',
            yellow: 'bg-yellow-100 text-yellow-800',
            green: 'bg-green-100 text-green-800',
            purple: 'bg-purple-100 text-purple-800'
          }[card.color]

          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-600">{card.trend}</span>
                <span className="text-sm text-gray-500 ml-2">{card.description}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/vehicles/new"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <Plus className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Adicionar Veículo</h3>
              <p className="text-sm text-gray-600">Cadastrar novo veículo</p>
            </div>
          </Link>

          <Link
            to="/admin/vehicles"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <Car className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Gerenciar Veículos</h3>
              <p className="text-sm text-gray-600">Ver e editar veículos</p>
            </div>
          </Link>

          <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="bg-yellow-100 p-3 rounded-lg mr-4">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Destaques</h3>
              <p className="text-sm text-gray-600">{metrics.featuredVehicles} veículos em destaque</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Contacts */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Interesses Recentes</h2>
          <p className="text-sm text-gray-600 mt-1">
            Últimos contatos recebidos de clientes interessados
          </p>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Veículo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Telefone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentContacts.length > 0 ? (
                recentContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {contact.customer_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {contact.customer_email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {contact.vehicles?.brand} {contact.vehicles?.model}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {contact.customer_phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(contact.created_at)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p>Nenhum interesse recebido recentemente</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Featured Vehicles Preview */}
      {featuredVehicles.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Veículos em Destaque</h2>
            <p className="text-sm text-gray-600 mt-1">
              Veículos atualmente em destaque na homepage
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredVehicles.slice(0, 3).map((vehicle) => (
                <div key={vehicle.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">{vehicle.year}</span>
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
                      Destaque #{vehicle.featured_order}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {vehicle.brand} {vehicle.model}
                  </h3>
                  <p className="text-lg font-bold text-blue-900">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(vehicle.price)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/admin/vehicles"
                className="inline-flex items-center text-blue-900 hover:text-blue-800 font-medium"
              >
                Ver todos os veículos
                <DollarSign className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
