export type ExternalVehicle = {
  id: string
  brand: string
  model: string
  year: number
  price: number
  mileage: number
  fuel_type: 'gasoline' | 'diesel' | 'electric' | 'flex'
  category: 'sedan' | 'suv' | 'hatchback' | 'pickup' | 'coupe' | 'convertible' | 'wagon' | 'utility'
  featured: boolean
  featured_order: number
  specifications: Record<string, string>
  description: string | null
  created_by: string | null
  created_at: string
  updated_at: string
  images?: { id: string; vehicle_id: string; image_url: string; order_index: number; is_primary: boolean; created_at: string }[]
}

const NHTSA_BASE = 'https://vpic.nhtsa.dot.gov/api/vehicles'

export async function getAllMakes(limit = 50): Promise<string[]> {
  const res = await fetch(`${NHTSA_BASE}/getallmakes?format=json`)
  const data = await res.json()
  const makes: string[] = (data?.Results || []).map((r: any) => r.Make_Name).filter(Boolean)
  const top = ['Audi','BMW','Mercedes-Benz','Porsche','Jaguar','Land Rover','Volvo','Toyota','Honda','Ford','Chevrolet','Volkswagen']
  const unique = Array.from(new Set([...top, ...makes]))
  return unique.slice(0, limit)
}

export async function getModelsForMake(make: string, limit = 50): Promise<string[]> {
  const res = await fetch(`${NHTSA_BASE}/GetModelsForMake/${encodeURIComponent(make)}?format=json`)
  const data = await res.json()
  const models: string[] = (data?.Results || []).map((r: any) => r.Model_Name).filter(Boolean)
  return models.slice(0, limit)
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function placeholderImage(brand: string, model: string): string {
  const query = encodeURIComponent(`${brand} ${model} car`)
  return `https://source.unsplash.com/featured/800x450?${query}`
}

export async function generateSampleVehicles(filters: { brand?: string; model?: string }, count = 12): Promise<ExternalVehicle[]> {
  const brands = filters.brand ? [filters.brand] : await getAllMakes(20)
  const categories: ExternalVehicle['category'][] = ['sedan','suv','hatchback','pickup','coupe','convertible','wagon','utility']
  const fuelTypes: ExternalVehicle['fuel_type'][] = ['gasoline','diesel','electric','flex']
  const out: ExternalVehicle[] = []

  for (const b of brands) {
    const models = filters.model ? [filters.model] : await getModelsForMake(b, 15)
    for (const m of models.slice(0, 3)) {
      const id = crypto.randomUUID()
      const year = randomInt(2018, new Date().getFullYear())
      const price = randomInt(80000, 700000)
      const mileage = randomInt(0, 80000)
      const fuel_type = randomChoice(fuelTypes)
      const category = randomChoice(categories)
      const imageUrl = placeholderImage(b, m)
      const now = new Date().toISOString()
      out.push({
        id,
        brand: b,
        model: m,
        year,
        price,
        mileage,
        fuel_type,
        category,
        featured: Math.random() < 0.3,
        featured_order: 0,
        specifications: { engine: '2.0', power: '200 cv', transmission: 'Automático' },
        description: null,
        created_by: null,
        created_at: now,
        updated_at: now,
        images: [
          { id: crypto.randomUUID(), vehicle_id: id, image_url: imageUrl, order_index: 0, is_primary: true, created_at: now },
        ],
      })
      if (out.length >= count) return out
    }
    if (out.length >= count) break
  }
  return out
}

export async function generateFeaturedVehicles(count = 6): Promise<ExternalVehicle[]> {
  const vehicles = await generateSampleVehicles({}, 20)
  const featured = vehicles.filter(v => v.images && v.images.length > 0).slice(0, count)
  return featured
}
