import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase, VehicleImage, Specifications } from '@/lib/supabase'
import { groqChatCompletion } from '@/lib/groq'
import type { GroqMessage } from '@/lib/groq'
import { Upload, X } from 'lucide-react'

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
    { value: 'utility', label: 'Utilitários' }
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
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else if (name === 'year' || name === 'price' || name === 'mileage' || name === 'featured_order') {
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
            'Você é um redator automotivo brasileiro. Gere uma descrição comercial concisa (120–180 palavras), clara e atrativa em pt-BR. Evite superlativos excessivos, foque em benefícios e destaque itens relevantes. Inclua pontos sobre desempenho, conforto, tecnologia e segurança quando aplicável.',
        },
        {
          role: 'user',
          content: `Crie uma descrição para: \nMarca: ${formData.brand}\nModelo: ${formData.model}\nAno: ${formData.year}\nPreço: R$ ${formData.price}\nQuilometragem: ${formData.mileage} km\nCombustível: ${formData.fuel_type}\nCategoria: ${formData.category}\nEspecificações: ${JSON.stringify(specs)}\nContexto: loja Neon Multimarcas, estilo premium Perfeito, linguagem objetiva e confiável. Evite repetir números sem necessidade; use frases naturais.`,
        },
      ]
      const text = await groqChatCompletion(messages)
      if (text) {
        setFormData(prev => ({ ...prev, description: text }))
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
    setImages(prev => [...prev, ...files])
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
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
        const fileName = `${vehicleId}/${Date.now()}-${file.name}`
        
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
      let vehicleId = id

      if (id) {
        // Update existing vehicle
        const { error } = await supabase
          .from('vehicles')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)

        if (error) throw error
      } else {
        // Create new vehicle
        const { data, error } = await supabase
          .from('vehicles')
          .insert([formData])
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
    } catch (error) {
      console.error('Error saving vehicle:', error)
      alert('Erro ao salvar veículo')
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
                  Marca *
                </label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  required
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  placeholder="Ex: BMW, Mercedes-Benz, Audi"
                />
              </div>

              <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
                  Modelo *
                </label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  required
                  value={formData.model}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  placeholder="Ex: X5, C-Class, A4"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Preço (R$) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  required
                  min="0"
                  step="1000"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                />
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>{category.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <label htmlFor="featured" className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-900 focus:ring-blue-900 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Veículo em Destaque</span>
                </label>
              </div>

              {formData.featured && (
                <div>
                  <label htmlFor="featured_order" className="block text-sm font-medium text-gray-700 mb-2">
                    Ordem de Destaque
                  </label>
                  <input
                    type="number"
                    id="featured_order"
                    name="featured_order"
                    min="0"
                    value={formData.featured_order}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <div className="flex gap-3 mb-3">
              <button
                type="button"
                onClick={generateDescription}
                disabled={generating}
                className="px-4 py-2 bg-yellow-400 text-gray-900 font-medium rounded-lg hover:bg-yellow-300 disabled:opacity-50"
              >
                {generating ? 'Gerando...' : 'Gerar automaticamente'}
              </button>
            </div>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
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
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Clique para adicionar imagens
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="sr-only"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  PNG, JPG, GIF até 10MB
                </p>
              </div>
            </div>

            {/* Preview of new images */}
            {images.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Novas Imagens</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Nova imagem ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
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
