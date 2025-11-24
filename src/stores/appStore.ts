import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { Vehicle, VehicleWithImages, ContactInterest } from '../lib/supabase'
import { generateSampleVehicles, generateFeaturedVehicles } from '@/lib/externalVehicles'

export type VehicleFilters = {
  brand?: string
  model?: string
  year_min?: number
  year_max?: number
  price_min?: number
  price_max?: number
  fuel_type?: Vehicle['fuel_type']
  category?: Vehicle['category']
  featured?: boolean
  sort_by?: 'price_asc' | 'price_desc' | 'year_asc' | 'year_desc' | 'created_at_desc'
  page?: number
  limit?: number
}

export type ContactInterestInsert = Omit<ContactInterest, 'id' | 'created_at'>

interface AppState {
  // Authentication
  isAuthenticated: boolean
  user: unknown | null
  
  // Vehicles
  vehicles: Vehicle[]
  featuredVehicles: VehicleWithImages[]
  selectedVehicle: VehicleWithImages | null
  loading: boolean
  error: string | null
  
  // Actions
  setAuth: (authenticated: boolean, user: unknown | null) => void
  fetchVehicles: (filters?: VehicleFilters) => Promise<void>
  fetchFeaturedVehicles: () => Promise<void>
  fetchVehicleById: (id: string) => Promise<void>
  submitContactInterest: (data: ContactInterestInsert) => Promise<void>
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  isAuthenticated: false,
  user: null,
  vehicles: [],
  featuredVehicles: [],
  selectedVehicle: null,
  loading: false,
  error: null,

  // Actions
  setAuth: (authenticated, user) => set({ isAuthenticated: authenticated, user }),

  fetchVehicles: async (filters = {}) => {
    set({ loading: true, error: null })
    try {
      let query = supabase
        .from('vehicles')
        .select('*')

      // Apply filters
      if (filters.brand) query = query.eq('brand', filters.brand)
      if (filters.model) query = query.eq('model', filters.model)
      if (filters.year_min) query = query.gte('year', filters.year_min)
      if (filters.year_max) query = query.lte('year', filters.year_max)
      if (filters.price_min) query = query.gte('price', filters.price_min)
      if (filters.price_max) query = query.lte('price', filters.price_max)
      if (filters.fuel_type) query = query.eq('fuel_type', filters.fuel_type)
      if (filters.category) query = query.eq('category', filters.category)
      if (filters.featured) query = query.eq('featured', true)

      // Apply sorting
      if (filters.sort_by === 'price_asc') query = query.order('price', { ascending: true })
      else if (filters.sort_by === 'price_desc') query = query.order('price', { ascending: false })
      else if (filters.sort_by === 'year_asc') query = query.order('year', { ascending: true })
      else if (filters.sort_by === 'year_desc') query = query.order('year', { ascending: false })
      else query = query.order('created_at', { ascending: false })

      // Apply pagination
      const page = filters.page ?? 1
      const limit = filters.limit ?? 12
      const start = (page - 1) * limit
      
      query = query.range(start, start + limit - 1)

      const { data, error } = await query

      if (error) throw error

      if (data && data.length > 0) {
        set({ vehicles: data, loading: false })
      } else {
        const external = await generateSampleVehicles({ brand: filters.brand, model: filters.model }, filters.limit || 12)
        // map to Vehicle shape
        const mapped: Vehicle[] = external.map(v => ({
          id: v.id,
          brand: v.brand,
          model: v.model,
          year: v.year,
          price: v.price,
          mileage: v.mileage,
          fuel_type: v.fuel_type,
          category: v.category,
          featured: v.featured,
          featured_order: v.featured_order,
          specifications: v.specifications,
          description: v.description,
          created_by: v.created_by,
          created_at: v.created_at,
          updated_at: v.updated_at,
        }))
        set({ vehicles: mapped, loading: false })
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error)
      set({ error: 'Erro ao carregar veículos', loading: false })
    }
  },

  fetchFeaturedVehicles: async () => {
    set({ loading: true, error: null })
    try {
      const { data: vehicles, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('featured', true)
        .order('featured_order', { ascending: true })
        .limit(6)

      if (error) throw error

      if (vehicles && vehicles.length > 0) {
        // Fetch images for featured vehicles
        const featuredVehiclesWithImages = await Promise.all(
          (vehicles || []).map(async (vehicle) => {
            const { data: images } = await supabase
              .from('vehicle_images')
              .select('*')
              .eq('vehicle_id', vehicle.id)
              .order('order_index', { ascending: true })

            return {
              ...vehicle,
              images: images || []
            }
          })
        )
        set({ featuredVehicles: featuredVehiclesWithImages, loading: false })
      } else {
        const external = await generateFeaturedVehicles(6)
        const mapped: VehicleWithImages[] = external.map(v => ({
          id: v.id,
          brand: v.brand,
          model: v.model,
          year: v.year,
          price: v.price,
          mileage: v.mileage,
          fuel_type: v.fuel_type,
          category: v.category,
          featured: v.featured,
          featured_order: v.featured_order,
          specifications: v.specifications,
          description: v.description,
          created_by: v.created_by,
          created_at: v.created_at,
          updated_at: v.updated_at,
          images: (v.images || [])
        }))
        set({ featuredVehicles: mapped, loading: false })
      }
    } catch (error) {
      console.error('Error fetching featured vehicles:', error)
      set({ error: 'Erro ao carregar veículos em destaque', loading: false })
    }
  },

  fetchVehicleById: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const { data: vehicle, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      const { data: images } = await supabase
        .from('vehicle_images')
        .select('*')
        .eq('vehicle_id', id)
        .order('order_index', { ascending: true })

      set({ 
        selectedVehicle: {
          ...vehicle,
          images: images || []
        }, 
        loading: false 
      })
    } catch (error) {
      console.error('Error fetching vehicle:', error)
      set({ error: 'Erro ao carregar detalhes do veículo', loading: false })
    }
  },

  submitContactInterest: async (data: ContactInterestInsert) => {
    set({ loading: true, error: null })
    try {
      const { error } = await supabase
        .from('contact_interests')
        .insert([data])

      if (error) throw error

      set({ loading: false })
    } catch (error) {
      console.error('Error submitting contact interest:', error)
      set({ error: 'Erro ao enviar interesse', loading: false })
      throw error
    }
  },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error })
}))
