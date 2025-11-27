import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase, VehicleImage, Specifications } from '@/lib/supabase'
import { groqChatCompletion } from '@/lib/groq'
import type { GroqMessage } from '@/lib/groq'
import { Upload, X, Sparkles } from 'lucide-react'
import Combobox from '@/components/Combobox'
import { getCarBrandNames, getMotorcycleBrandNames, getModelsForBrand } from '@/lib/brazilianVehicles'

export default function VehicleForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    fuel_type: 'gasoline' as const,
    category: 'sedan' as const,
    featured: false,
    featured_order: 0,
    description: '',
    specifications: {}
  })
  
  const [images, setImages] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<VehicleImage[]>([])
  const [uploading, setUploading] = useState(false)
  const [generating, setGenerating] = useState(false)

  // Get brand options with visual separation
  const getBrandOptions = (): string[] => {
    const carBrands = getCarBrandNames()
    const motorcycleBrands = getMotorcycleBrandNames()
    
    // Create a combined list with separators for visual distinction
    const options: string[] = []
    
    // Add car brands with a prefix for grouping
    carBrands.forEach(brand => options.push(brand))
    
    // Add motorcycle brands
    motorcycleBrands.forEach(brand => options.push(brand))
    
    return options
  }

  // Get model options based on selected brand
  const getModelOptions = (): string[] => {
    if (!formData.brand) {
      return []
    }
    return getModelsForBrand(formData.brand)
  }

  // Handle brand change and clear model field
  const handleBrandChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      brand: value,
      model: '' // Clear model when brand changes
    }))
  }

  // Fuel types and categories from the technical architecture
  const fuelTypes = [
    { value: 'gasoline', label: 'Gasolina' },
    { value: 'diesel', label: 'Diesel' },
    { value: 'electric', label: 'Elétrico' },
    { value: 'flex', label: 'Flex' }
  ]

  const categories = [
    { value: 'sedan', label: 'Sedan' },
    { value: 'suv', label: 'SUV' },
    { value: 'hatchback', label: 'Hatchback' },
    { value: 'pickup', label: 'Pick-up' },
    { value: 'coupe', label: 'Cupê' },
    { value: 'convertible', label: 'Conversível' },
    { value: 'wagon', label: 'Wagon' },
    { value: 'utility', label: 'Utilitários' },
    { value: 'motorcycle', label: 'Moto' }
  ]

  // Common specification fields
  const specificationFields = [
    { key: 'engine', label: 'Motor', placeholder: '2.0 Turbo' },
    { key: 'power', label: 'Potência', placeholder: '250 cv' },
    { key: 'transmission', label: 'Câmbio', placeholder: '' }
  ]

  useEffect(() => {
    if (id) {
      fetchVehicle()
    }
  }, [id])

  const fetchVehicle = async () => {
    setLoading(true)
    try {
      const { data: vehicle, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      setFormData({
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        price: vehicle.price,
        mileage: vehicle.mileage,
        fuel_type: vehicle.fuel_type,
        category: vehicle.category,
        featured: vehicle.featured,
        featured_order: vehicle.featured_order,
        description: vehicle.description || '',
        specifications: vehicle.specifications || {}
      })

      // Fetch existing images
      const { data: images } = await supabase
        .from('vehicle_images')
        .select('*')
        .eq('vehicle_id', id)
        .order('order_index', { ascending: true })

      setExistingImages(images || [])
    } catch (error) {
      console.error('Error fetching vehicle:', error)
      alert('Erro ao carregar veículo')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    // Skip price field as it has custom onChange handler
    if (name === 'price') return
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else if (name === 'year' || name === 'mileage' || name === 'featured_order') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSpecificationChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value
      }
    }))
  }

  const generateDescription = async () => {
    setGenerating(true)
    try {
      const specs = formData.specifications as Specifications
      const messages: GroqMessage[] = [
        {
          role: 'system',
          content:
            'Você é um redator automotivo brasileiro especializado em descrições comerciais. IMPORTANTE: Retorne APENAS o texto da descrição, sem introduções como "Segue a descrição", "Aqui está", ou qualquer outro texto adicional. Gere uma descrição comercial concisa (120–180 palavras), clara e atrativa em pt-BR. Evite superlativos excessivos, foque em benefícios e destaque itens relevantes. Inclua pontos sobre desempenho, conforto, tecnologia e segurança quando aplicável. Comece diretamente descrevendo o veículo.',
        },
        {
          role: 'user',
          content: `Crie uma descrição para: \nMarca: ${formData.brand}\nModelo: ${formData.model}\nAno: ${formData.year}\nPreço: R$ ${formData.price}\nQuilometragem: ${formData.mileage} km\nCombustível: ${formData.fuel_type}\nCategoria: ${formData.category}\nEspecificações: ${JSON.stringify(specs)}\nContexto: loja Neon Multimarcas, estilo premium, linguagem objetiva e confiável. Evite repetir números sem necessidade; use frases naturais. LEMBRE-SE: Retorne SOMENTE a descrição do veículo, sem textos introdutórios ou explicações.`,
        },
      ]
      const text = await groqChatCompletion(messages)
      if (text) {
        // Remove possíveis textos introdutórios que a IA possa ter adicionado
        const cleanText = text
          .replace(/^(Segue a descrição|Aqui está|Descrição|Veja|Confira)[:\s]*/i, '')
          .replace(/^["']|["']$/g, '')
          .trim()
        setFormData(prev => ({ ...prev, description: cleanText }))
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      alert(`Falha ao gerar descrição: ${msg}`)
    } finally {
      setGenerating(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setImages(prev => [...prev, ...files])
      // Reset input to allow selecting the same file again
      e.target.value = ''
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== index)
      // Clean up object URL to prevent memory leak
      const file = prev[index]
      if (file) {
        URL.revokeObjectURL(URL.createObjectURL(file))
      }
      return newImages
    })
  }

  const removeExistingImage = async (imageId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta imagem?')) return

    try {
      const { error } = await supabase
        .from('vehicle_images')
        .delete()
        .eq('id', imageId)

      if (error) throw error

      setExistingImages(prev => prev.filter(img => img.id !== imageId))
    } catch (error) {
      console.error('Error deleting image:', error)
      alert('Erro ao excluir imagem')
    }
  }

  const uploadImages = async (vehicleId: string) => {
    if (images.length === 0) return

    setUploading(true)
    try {
      for (let i = 0; i < images.length; i++) {
        const file = images[i]
        
        // Sanitize filename: remove special characters, spaces, and accents
        const sanitizedName = file.name
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Remove accents
          .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars with underscore
          .replace(/_{2,}/g, '_') // Replace multiple underscores with single
          .toLowerCase()
        
        const fileName = `${vehicleId}/${Date.now()}-${sanitizedName}`
        
        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('vehicle-images')
          .upload(fileName, file)

        if (uploadError) throw uploadError

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('vehicle-images')
          .getPublicUrl(fileName)

        // Save to database
        const { error: dbError } = await supabase
          .from('vehicle_images')
          .insert({
            vehicle_id: vehicleId,
            image_url: publicUrl,
            order_index: existingImages.length + i,
            is_primary: i === 0 && existingImages.length === 0
          })

        if (dbError) throw dbError
      }
    } catch (error) {
      console.error('Error uploading images:', error)
      throw error
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Validate data before submitting
      const dataToSubmit = {
        ...formData,
        // Ensure numeric fields are valid numbers
        year: Number(formData.year) || new Date().getFullYear(),
        price: Number(formData.price) || 0,
        mileage: Number(formData.mileage) || 0,
        featured_order: Number(formData.featured_order) || 0,
        // Ensure boolean is proper boolean
        featured: Boolean(formData.featured),
        // Ensure strings are not empty
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        fuel_type: formData.fuel_type || 'gasoline',
        category: formData.category || 'sedan',
        description: formData.description?.trim() || '',
        specifications: formData.specifications || {}
      }

      // Additional validation
      if (!dataToSubmit.brand || !dataToSubmit.model) {
        alert('Marca e modelo são obrigatórios')
        return
      }

      if (dataToSubmit.price < 0 || dataToSubmit.mileage < 0) {
        alert('Preço e quilometragem devem ser valores positivos')
        return
      }

      let vehicleId = id

      if (id) {
        // Update existing vehicle
        const { error } = await supabase
          .from('vehicles')
          .update({
            ...dataToSubmit,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)

        if (error) throw error
      } else {
        // Create new vehicle
        const { data, error } = await supabase
          .from('vehicles')
          .insert([dataToSubmit])
          .select()
          .single()

        if (error) throw error
        vehicleId = data.id
      }

      // Upload images if any
      if (images.length > 0) {
        await uploadImages(vehicleId!)
      }

      alert(id ? 'Veículo atualizado com sucesso!' : 'Veículo criado com sucesso!')
      navigate('/admin/vehicles')
    } catch (error: any) {
      console.error('Error saving vehicle:', error)
      const errorMessage = error?.message || 'Erro desconhecido'
      alert(`Erro ao salvar veículo: ${errorMessage}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">
            {id ? 'Editar Veículo' : 'Adicionar Novo Veículo'}
          </h1>
          <p className="text-gray-600 mt-1">
            {id ? 'Atualize as informações do veículo' : 'Preencha os dados do novo veículo'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6" autoComplete="off">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Combobox
                  label="Marca"
                  value={formData.brand}
                  onChange={handleBrandChange}
                  options={getBrandOptions()}
                  placeholder="Selecione ou digite a marca..."
                  required={true}
                  allowCustom={true}
                />
              </div>

              <div>
                <Combobox
                  label="Modelo"
                  value={formData.model}
                  onChange={(value) => setFormData(prev => ({ ...prev, model: value }))}
                  options={getModelOptions()}
                  placeholder="Selecione ou digite o modelo..."
                  required={true}
                  disabled={!formData.brand}
                  allowCustom={true}
                />
              </div>

              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                  Ano *
                </label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  required
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={formData.year}
                  onChange={handleInputChange}
                  autoComplete="off"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Preço (R$) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    required
                    value={formData.price ? new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(formData.price) : ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '')
                      const numValue = parseInt(value || '0') / 100
                      setFormData(prev => ({ ...prev, price: numValue }))
                    }}
                    placeholder="0,00"
                    autoComplete="off"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="mileage" className="block text-sm font-medium text-gray-700 mb-2">
                  Quilometragem (km) *
                </label>
                <input
                  type="number"
                  id="mileage"
                  name="mileage"
                  required
                  min="0"
                  step="1000"
                  value={formData.mileage}
                  onChange={handleInputChange}
                  autoComplete="off"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Combustível *</label>
                <div className="flex flex-wrap gap-3">
                  {fuelTypes.map(type => (
                    <label key={type.value} className="inline-flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="fuel_type"
                        value={type.value}
                        checked={formData.fuel_type === type.value}
                        onChange={handleInputChange}
                      />
                      <span className="text-sm">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  autoComplete="off"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>{category.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <div 
                  onClick={() => setFormData(prev => ({ ...prev, featured: !prev.featured }))}
                  className={`relative flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.featured 
                      ? 'border-primary bg-primary/5 shadow-sm' 
                      : 'border-border hover:border-primary/50 bg-card'
                  }`}
                >
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      id="featured"
                      name="featured"
                      checked={formData.featured}
                      onChange={() => {}}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <label htmlFor="featured" className="font-medium text-sm cursor-pointer">
                      Veículo em Destaque
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Exibir este veículo na página inicial
                    </p>
                  </div>
                  {formData.featured && (
                    <div className="absolute top-2 right-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary text-primary-foreground">
                        Ativo
                      </span>
                    </div>
                  )}
                </div>

                {formData.featured && (
                  <div className="pl-4 border-l-2 border-primary/20">
                    <label htmlFor="featured_order" className="block text-sm font-medium mb-2">
                      Ordem de Exibição
                    </label>
                    <input
                      type="number"
                      id="featured_order"
                      name="featured_order"
                      min="0"
                      value={formData.featured_order}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-input"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Menor número aparece primeiro
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Descrição
              </label>
              <button
                type="button"
                onClick={generateDescription}
                disabled={generating}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-medium rounded-md shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
              >
                {generating ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Gerando mágica...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    Gerar com IA
                  </>
                )}
              </button>
            </div>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              autoComplete="off"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
              placeholder="Descrição detalhada do veículo..."
            />
          </div>

          {/* Specifications */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Especificações Técnicas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {specificationFields.map(field => (
                <div key={field.key}>
                  <label htmlFor={`spec_${field.key}`} className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                  </label>
                  {field.key === 'transmission' ? (
                    <select
                      id={`spec_${field.key}`}
                      value={(formData.specifications as Specifications)[field.key] || ''}
                      onChange={(e) => handleSpecificationChange(field.key, e.target.value)}
                      autoComplete="off"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                    >
                      <option value="">Selecione</option>
                      <option value="Automático">Automático</option>
                      <option value="Manual">Manual</option>
                      <option value="Semi-automático">Semi-automático</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      id={`spec_${field.key}`}
                      value={(formData.specifications as Specifications)[field.key] || ''}
                      onChange={(e) => handleSpecificationChange(field.key, e.target.value)}
                      autoComplete="off"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                      placeholder={field.placeholder}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Imagens do Veículo</h2>
            
            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Imagens Existentes</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {existingImages.map((image, index) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.image_url}
                        alt={`Imagem ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(image.id)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="image-upload" className="cursor-pointer inline-block">
                    <span className="mt-2 block text-sm font-medium text-gray-900 px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                      📸 Adicionar Fotos
                    </span>
                    <input
                      id="image-upload"
                      type="file"
                      multiple
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      capture="environment"
                      onChange={handleImageUpload}
                      className="sr-only"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  PNG, JPG, GIF, WEBP até 10MB cada
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Toque para usar a câmera ou galeria
                </p>
              </div>
            </div>

            {/* Preview of new images */}
            {images.length > 0 && (
              <div className="mt-4 mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Novas Imagens ({images.length})</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((file, index) => {
                    const imageUrl = URL.createObjectURL(file)
                    return (
                      <div key={`${file.name}-${index}`} className="relative group aspect-square">
                        <img
                          src={imageUrl}
                          alt={`Nova imagem ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg border border-gray-200"
                          onLoad={() => URL.revokeObjectURL(imageUrl)}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg transition-all"
                          title="Remover imagem"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/admin/vehicles')}
              className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="px-6 py-2 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {uploading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enviando imagens...
                </div>
              ) : saving ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </div>
              ) : (
                id ? 'Atualizar Veículo' : 'Criar Veículo'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
