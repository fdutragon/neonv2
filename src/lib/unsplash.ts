// Vehicle fallback images using brand logos
// For production with real car photos, use Pexels API (free) or Unsplash API

export interface UnsplashImage {
  url: string
  photographer: string
  photographerUrl: string
}

/**
 * Map of brand names to their official domains for logo fetching
 */
const brandDomains: Record<string, string> = {
  'toyota': 'toyota.com',
  'honda': 'honda.com',
  'ford': 'ford.com',
  'chevrolet': 'chevrolet.com',
  'volkswagen': 'vw.com',
  'fiat': 'fiat.com',
  'hyundai': 'hyundai.com',
  'nissan': 'nissan.com',
  'renault': 'renault.com',
  'peugeot': 'peugeot.com',
  'citroen': 'citroen.com',
  'jeep': 'jeep.com',
  'bmw': 'bmw.com',
  'mercedes-benz': 'mercedes-benz.com',
  'audi': 'audi.com',
  'volvo': 'volvo.com',
  'mitsubishi': 'mitsubishi-motors.com',
  'kia': 'kia.com',
  'mazda': 'mazda.com',
  'subaru': 'subaru.com',
  'suzuki': 'suzuki.com',
  'yamaha': 'yamaha-motor.com',
  'kawasaki': 'kawasaki.com',
  'harley-davidson': 'harley-davidson.com',
  'ducati': 'ducati.com',
  'triumph': 'triumph.co.uk',
  'bmw motorrad': 'bmw-motorrad.com'
}

/**
 * Get brand domain for logo fetching
 */
function getBrandDomain(brand: string): string {
  const normalized = brand.toLowerCase().trim()
  return brandDomains[normalized] || `${normalized.replace(/\s+/g, '')}.com`
}

/**
 * Get a fallback image for a vehicle using brand logo
 * Uses Clearbit Logo API (free, no API key required)
 */
export function getVehicleFallbackImage(
  brand: string,
  model: string,
  width: number = 800,
  height: number = 600
): string {
  const domain = getBrandDomain(brand)
  
  // Using Clearbit Logo API with brand domain
  // Falls back to a placeholder if logo not found
  return `https://logo.clearbit.com/${domain}?size=200`
}

/**
 * Get multiple fallback images for a vehicle (for gallery)
 * Returns the same logo for consistency
 */
export function getVehicleFallbackImages(
  brand: string,
  model: string,
  count: number = 3
): string[] {
  const images: string[] = []
  const logoUrl = getVehicleFallbackImage(brand, model)
  
  for (let i = 0; i < count; i++) {
    images.push(logoUrl)
  }
  
  return images
}

/**
 * Alternative: Get a specific Unsplash photo URL
 * This can be used if you want to use the official Unsplash API
 */
export async function searchUnsplashVehicle(
  brand: string,
  model: string,
  apiKey?: string
): Promise<UnsplashImage | null> {
  if (!apiKey) {
    console.warn('Unsplash API key not provided, using fallback method')
    return null
  }

  try {
    const query = `${brand} ${model} car`
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${apiKey}`
        }
      }
    )

    if (!response.ok) {
      throw new Error('Unsplash API request failed')
    }

    const data = await response.json()
    
    if (data.results && data.results.length > 0) {
      const photo = data.results[0]
      return {
        url: photo.urls.regular,
        photographer: photo.user.name,
        photographerUrl: photo.user.links.html
      }
    }

    return null
  } catch (error) {
    console.error('Error fetching from Unsplash:', error)
    return null
  }
}
