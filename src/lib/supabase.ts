import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not configured')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Vehicle {
  id: string
  brand: string
  model: string
  year: number
  price: number
  mileage: number
  fuel_type: 'gasoline' | 'diesel' | 'electric' | 'hybrid'
  category: 'sedan' | 'suv' | 'hatchback' | 'pickup' | 'coupe' | 'convertible' | 'wagon'
  featured: boolean
  featured_order: number
  specifications: Record<string, any>
  description: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface VehicleImage {
  id: string
  vehicle_id: string
  image_url: string
  order_index: number
  is_primary: boolean
  created_at: string
}

export interface ContactInterest {
  id: string
  vehicle_id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  message: string | null
  created_at: string
}

export interface VehicleWithImages extends Vehicle {
  images: VehicleImage[]
}