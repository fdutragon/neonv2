import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAppStore } from '@/stores/appStore'
import { Car, Search, Award, Shield, Clock, ArrowRight } from 'lucide-react'

export default function Home() {
  const { featuredVehicles, loading, fetchFeaturedVehicles } = useAppStore()
  const navigate = useNavigate()

  const [brandQuery, setBrandQuery] = useState('')
  const [brands, setBrands] = useState<string[]>([])
  const [filteredBrands, setFilteredBrands] = useState<string[]>([])
  const [selectedBrand, setSelectedBrand] = useState<string>('')
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false)

  const [modelQuery, setModelQuery] = useState('')
  const [models, setModels] = useState<string[]>([])
  const [filteredModels, setFilteredModels] = useState<string[]>([])
  const [selectedModel, setSelectedModel] = useState<string>('')
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false)
  const topBrands = ['Audi','BMW','Mercedes-Benz','Porsche','Jaguar','Land Rover','Volvo']
  const topModels = ['320i M Sport','C 200 AMG Line','A4 Prestige','911 Carrera','M3 Competition']

  useEffect(() => {
    fetchFeaturedVehicles()
  }, [])

  useEffect(() => {
    const fetchModels = async () => {
      try {
    const { data, error } = await supabase
      .from('vehicles')
      .select('model')
      .order('model', { ascending: true })

        if (error) throw error

        let unique: string[]
        const modelsData = (data as { model: string }[] | null) ?? []
        if (modelsData.length > 0) {
          unique = Array.from(new Set(modelsData.map((v) => v.model))).filter(Boolean)
        } else {
          // Fallback to external API using brands top list
          const resp = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/BMW?format=json')
          const json = await resp.json()
          unique = (json?.Results || []).map((r: any) => r.Model_Name).filter(Boolean)
        }
        setModels(unique)
        setFilteredModels(unique)
      } catch (e) {
        console.error('Erro ao carregar modelos', e)
      }
    }
    fetchModels()
  }, [])

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('brand')
          .order('brand', { ascending: true })

        if (error) throw error

        let unique: string[]
        const brandsData = (data as { brand: string }[] | null) ?? []
        if (brandsData.length > 0) {
          unique = Array.from(new Set(brandsData.map((v) => v.brand))).filter(Boolean)
        } else {
          const resp = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json')
          const json = await resp.json()
          const makes: string[] = (json?.Results || []).map((r: any) => r.Make_Name).filter(Boolean)
          const top = ['Audi','BMW','Mercedes-Benz','Porsche','Jaguar','Land Rover','Volvo']
          unique = Array.from(new Set([...top, ...makes])).slice(0, 50)
        }
        setBrands(unique)
        setFilteredBrands(unique)
      } catch (e) {
        console.error('Erro ao carregar marcas', e)
      }
    }
    fetchBrands()
  }, [])

  useEffect(() => {
    const q = modelQuery.trim().toLowerCase()
    if (!q) {
      setFilteredModels(topModels)
      setSelectedModel('')
      setModelDropdownOpen(false)
      return
    }
    const filtered = models.filter((m) => m.toLowerCase().includes(q)).slice(0, 10)
    setFilteredModels(filtered)
    setModelDropdownOpen(filtered.length > 0)
    if (!filtered.includes(selectedModel)) setSelectedModel('')
  }, [modelQuery, models])

  useEffect(() => {
    const q = brandQuery.trim().toLowerCase()
    if (!q) {
      setFilteredBrands(topBrands)
      setSelectedBrand('')
      setBrandDropdownOpen(false)
      return
    }
    const filtered = brands.filter((b) => b.toLowerCase().includes(q)).slice(0, 10)
    setFilteredBrands(filtered)
    setBrandDropdownOpen(filtered.length > 0)
    if (!filtered.includes(selectedBrand)) setSelectedBrand('')
  }, [brandQuery, brands])

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
    utility: 'Utilitários'
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 to-gray-700 text-white">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Encontre Seu Veículo
              <span className="block text-yellow-400">Perfeito</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto">
              A maior seleção de veículos Perfeito com a qualidade e confiança que você merece.
              Concessionária especializada em carros de alto padrão.
            </p>
            {/* Quick Brand & Model Autosuggest */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const targetBrand = selectedBrand || (filteredBrands.includes(brandQuery) ? brandQuery : '')
                const targetModel = selectedModel || (filteredModels.includes(modelQuery) ? modelQuery : '')
                if (!targetBrand && !targetModel) return
                const params = new URLSearchParams()
                if (targetBrand) params.set('brand', targetBrand)
                if (targetModel) params.set('model', targetModel)
                params.set('sort_by', 'created_at_desc')
                navigate(`/search?${params.toString()}`)
              }}
              className="mt-10 bg-white/10 backdrop-blur rounded-lg p-4 md:p-6 max-w-3xl mx-auto"
            >
              <div className="text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Marca</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={brandQuery}
                        onChange={(e) => setBrandQuery(e.target.value)}
                        onFocus={() => setBrandDropdownOpen(brandQuery.trim().length >= 1 && filteredBrands.length > 0)}
                        onBlur={() => setTimeout(() => setBrandDropdownOpen(false), 100)}
                        placeholder="Digite a marca (ex: BMW, Audi)"
                        className="w-full px-4 py-3 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-yellow-400"
                      />
                      {brandDropdownOpen && filteredBrands.length > 0 && (
                        <ul className="absolute z-10 mt-2 w-full bg-white text-gray-900 rounded-md shadow-lg max-h-56 overflow-auto">
                          {filteredBrands.map((b) => (
                            <li
                              key={b}
                              className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${selectedBrand === b ? 'bg-gray-100' : ''}`}
                              onMouseDown={() => {
                                setSelectedBrand(b)
                                setBrandQuery(b)
                                setBrandDropdownOpen(false)
                                const params = new URLSearchParams()
                                params.set('brand', b)
                                params.set('sort_by', 'created_at_desc')
                                navigate(`/search?${params.toString()}`)
                              }}
                            >
                              {b}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Modelo</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={modelQuery}
                        onChange={(e) => setModelQuery(e.target.value)}
                        onFocus={() => setModelDropdownOpen(modelQuery.trim().length >= 1 && filteredModels.length > 0)}
                        onBlur={() => setTimeout(() => setModelDropdownOpen(false), 100)}
                        placeholder="Digite o modelo (ex: 320i, GLE 450, A4)"
                        className="w-full px-4 py-3 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-yellow-400"
                      />
                      {modelDropdownOpen && filteredModels.length > 0 && (
                        <ul className="absolute z-10 mt-2 w-full bg-white text-gray-900 rounded-md shadow-lg max-h-56 overflow-auto">
                          {filteredModels.map((m) => (
                            <li
                              key={m}
                              className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${selectedModel === m ? 'bg-gray-100' : ''}`}
                              onMouseDown={() => {
                                setSelectedModel(m)
                                setModelQuery(m)
                                setModelDropdownOpen(false)
                                const params = new URLSearchParams()
                                if (selectedBrand || brandQuery) {
                                  const b = selectedBrand || (filteredBrands.includes(brandQuery) ? brandQuery : '')
                                  if (b) params.set('brand', b)
                                }
                                params.set('model', m)
                                params.set('sort_by', 'created_at_desc')
                                navigate(`/search?${params.toString()}`)
                              }}
                            >
                              {m}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    {/* vazio apenas para manter alinhamento responsivo */}
                  </div>
                  <button
                    type="submit"
                    disabled={!(selectedBrand || filteredBrands.includes(brandQuery) || selectedModel || filteredModels.includes(modelQuery))}
                    className="inline-flex items-center px-6 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-md hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Search className="mr-2 h-5 w-5" />
                    Buscar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Por Que Escolher a Neon Multimarcas?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Compromisso com excelência e satisfação total do cliente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-gray-50">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-900 text-white rounded-full mb-4">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Qualidade Perfeito</h3>
              <p className="text-gray-600">
                Veículos selecionados com rigorosos padrões de qualidade e procedência garantida.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-gray-50">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-900 text-white rounded-full mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Garantia Estendida</h3>
              <p className="text-gray-600">
                Opções de garantia estendida para sua maior tranquilidade e segurança.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-gray-50">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-900 text-white rounded-full mb-4">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Atendimento Rápido</h3>
              <p className="text-gray-600">
                Equipe especializada pronta para atender suas necessidades com agilidade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Veículos em Destaque
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Seleção especial dos nossos veículos mais procurados
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredVehicles.map((vehicle) => (
                <div key={vehicle.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                    {vehicle.images.length > 0 ? (
                      <img
                        src={vehicle.images[0].image_url}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 flex items-center justify-center bg-gray-100">
                        <Car className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">{vehicle.year}</span>
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
                        Destaque
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {vehicle.brand} {vehicle.model}
                    </h3>
                    
                    <div className="space-y-1 mb-4 text-sm text-gray-600">
                      <p>Quilometragem: {vehicle.mileage.toLocaleString('pt-BR')} km</p>
                      <p>Combustível: {fuelLabel[vehicle.fuel_type] || vehicle.fuel_type}</p>
                      <p>Categoria: {categoryLabel[vehicle.category] || vehicle.category}</p>
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
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {featuredVehicles.length === 0 && !loading && (
            <div className="text-center py-12">
              <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum veículo em destaque
              </h3>
              <p className="text-gray-600">
                Em breve teremos veículos especiais para você!
              </p>
            </div>
          )}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            to="/search"
            className="inline-flex items-center px-8 py-3 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors"
          >
            Ver Todos os Veículos
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
