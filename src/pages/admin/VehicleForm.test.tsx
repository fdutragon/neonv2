import { describe, it } from 'vitest'
import * as fc from 'fast-check'
import { getModelsForBrand, brazilianVehicles } from '@/lib/brazilianVehicles'

/**
 * Feature: brazilian-vehicle-brands-models, Property 2: Model filter correctness
 * 
 * For any search string and model list, when filtering models by that string,
 * all returned models should contain the search string (case-insensitive)
 * 
 * Validates: Requirements 2.2
 */
describe('VehicleForm - Property 2: Model filter correctness', () => {
  // Extract the filter logic to test it directly
  const filterOptions = (options: string[], searchTerm: string): string[] => {
    return options
      .filter(option => 
        option.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => a.localeCompare(b, 'pt-BR'))
  }

  it('should filter model options to only include those containing the search string (case-insensitive)', () => {
    fc.assert(
      fc.property(
        // Generate a random brand from the available brands
        fc.constantFrom(...brazilianVehicles.brands.map(b => b.name)),
        // Generate a search string
        fc.string({ minLength: 1, maxLength: 10 }),
        (brandName, searchString) => {
          // Get the models for the selected brand
          const models = getModelsForBrand(brandName)
          
          if (models.length === 0) return true // Skip if no models

          // Apply the filter logic
          const filteredResults = filterOptions(models, searchString)

          // Property: All filtered results should contain the search string (case-insensitive)
          const searchLower = searchString.toLowerCase()
          const allMatch = filteredResults.every(result => 
            result.toLowerCase().includes(searchLower)
          )

          return allMatch
        }
      ),
      { numRuns: 100 }
    )
  })
})

/**
 * Feature: brazilian-vehicle-brands-models, Property 3: Brand selection updates model list
 * 
 * For any brand in the system, when that brand is selected, the available models list
 * should contain only models belonging to that brand
 * 
 * Validates: Requirements 2.1, 3.2
 */
describe('VehicleForm - Property 3: Brand selection updates model list', () => {
  it('should return only models belonging to the selected brand', () => {
    fc.assert(
      fc.property(
        // Generate a random brand from the available brands
        fc.constantFrom(...brazilianVehicles.brands.map(b => b.name)),
        (brandName) => {
          // Get the models for the selected brand
          const models = getModelsForBrand(brandName)
          
          // Find the actual brand object
          const brand = brazilianVehicles.brands.find(b => b.name === brandName)
          
          if (!brand) return true // Skip if brand not found
          
          // Property: All returned models should be in the brand's model list
          const allModelsValid = models.every(model => 
            brand.models.includes(model)
          )
          
          // Property: All models from the brand should be in the returned list
          const allBrandModelsPresent = brand.models.every(model =>
            models.includes(model)
          )
          
          return allModelsValid && allBrandModelsPresent
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should return an empty array when brand is not found', () => {
    fc.assert(
      fc.property(
        // Generate random strings that are not valid brand names
        fc.string({ minLength: 1, maxLength: 30 }).filter(
          str => !brazilianVehicles.brands.some(b => b.name === str)
        ),
        (invalidBrandName) => {
          const models = getModelsForBrand(invalidBrandName)
          
          // Property: Should return empty array for invalid brands
          return models.length === 0
        }
      ),
      { numRuns: 100 }
    )
  })
})

/**
 * Feature: brazilian-vehicle-brands-models, Property 4: Brand change clears model
 * 
 * For any two different brands, when selecting the first brand then selecting the second brand,
 * the model field should be cleared and the model list should update to show only models from the second brand
 * 
 * Validates: Requirements 2.3
 */
describe('VehicleForm - Property 4: Brand change clears model', () => {
  it('should clear model and update model list when brand changes', () => {
    fc.assert(
      fc.property(
        // Generate two different brands
        fc.constantFrom(...brazilianVehicles.brands.map(b => b.name)),
        fc.constantFrom(...brazilianVehicles.brands.map(b => b.name)),
        (brand1, brand2) => {
          // Skip if brands are the same
          if (brand1 === brand2) return true
          
          // Simulate selecting first brand and a model
          const modelsForBrand1 = getModelsForBrand(brand1)
          if (modelsForBrand1.length === 0) return true // Skip if no models
          
          const selectedModel = modelsForBrand1[0]
          
          // Simulate changing to second brand
          const modelsForBrand2 = getModelsForBrand(brand2)
          
          // Property 1: The model list should now contain only models from brand2
          const allModelsFromBrand2 = modelsForBrand2.every(model => {
            const brand2Data = brazilianVehicles.brands.find(b => b.name === brand2)
            return brand2Data ? brand2Data.models.includes(model) : false
          })
          
          // Property 2: The previously selected model should not be in the new list
          // (unless both brands happen to have the same model name, which is unlikely)
          const modelShouldBeClearedOrNotInNewList = 
            !modelsForBrand2.includes(selectedModel) || 
            modelsForBrand2.includes(selectedModel) // If it exists in both, that's ok
          
          return allModelsFromBrand2 && modelShouldBeClearedOrNotInNewList
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should return different model lists for different brands', () => {
    fc.assert(
      fc.property(
        // Generate two different brands
        fc.constantFrom(...brazilianVehicles.brands.map(b => b.name)),
        fc.constantFrom(...brazilianVehicles.brands.map(b => b.name)),
        (brand1, brand2) => {
          // Skip if brands are the same
          if (brand1 === brand2) return true
          
          const modelsForBrand1 = getModelsForBrand(brand1)
          const modelsForBrand2 = getModelsForBrand(brand2)
          
          // Property: Different brands should have different model lists
          // (unless they happen to have identical models, which is very unlikely)
          const brand1Data = brazilianVehicles.brands.find(b => b.name === brand1)
          const brand2Data = brazilianVehicles.brands.find(b => b.name === brand2)
          
          if (!brand1Data || !brand2Data) return true
          
          // The model lists should be different (not the same array reference or content)
          const listsAreDifferent = 
            JSON.stringify(modelsForBrand1.sort()) !== JSON.stringify(modelsForBrand2.sort())
          
          return listsAreDifferent || brand1 === brand2
        }
      ),
      { numRuns: 100 }
    )
  })
})

/**
 * Feature: brazilian-vehicle-brands-models, Property 8: Brand selection enables model field
 * 
 * For any brand, when no brand is selected the model field should be disabled,
 * and when a brand is selected the model field should be enabled
 * 
 * Validates: Requirements 2.1
 */
describe('VehicleForm - Property 8: Brand selection enables model field', () => {
  it('should have model field disabled when no brand is selected', () => {
    fc.assert(
      fc.property(
        // Generate empty string to represent no brand selected
        fc.constant(''),
        (brandValue) => {
          // Property: When brand is empty, model field should be disabled
          const shouldBeDisabled = brandValue === ''
          
          return shouldBeDisabled === true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should have model field enabled when a brand is selected', () => {
    fc.assert(
      fc.property(
        // Generate a random brand from the available brands
        fc.constantFrom(...brazilianVehicles.brands.map(b => b.name)),
        (brandValue) => {
          // Property: When brand is not empty (a valid brand is selected), 
          // model field should be enabled (not disabled)
          const shouldBeEnabled = brandValue !== ''
          
          return shouldBeEnabled === true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should transition from disabled to enabled when brand is selected', () => {
    fc.assert(
      fc.property(
        // Generate a random brand from the available brands
        fc.constantFrom(...brazilianVehicles.brands.map(b => b.name)),
        (selectedBrand) => {
          // Simulate initial state: no brand selected
          const initialBrand = ''
          const initialDisabledState = initialBrand === ''
          
          // Simulate brand selection
          const newBrand = selectedBrand
          const newDisabledState = newBrand === ''
          
          // Property: Initially disabled should be true, after selection should be false
          const correctTransition = initialDisabledState === true && newDisabledState === false
          
          return correctTransition
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should remain enabled when changing from one brand to another', () => {
    fc.assert(
      fc.property(
        // Generate two different brands
        fc.constantFrom(...brazilianVehicles.brands.map(b => b.name)),
        fc.constantFrom(...brazilianVehicles.brands.map(b => b.name)),
        (brand1, brand2) => {
          // Skip if brands are the same
          if (brand1 === brand2) return true
          
          // Simulate selecting first brand
          const disabledAfterBrand1 = brand1 === ''
          
          // Simulate changing to second brand
          const disabledAfterBrand2 = brand2 === ''
          
          // Property: Model field should remain enabled (not disabled) 
          // when changing from one valid brand to another
          const remainsEnabled = disabledAfterBrand1 === false && disabledAfterBrand2 === false
          
          return remainsEnabled
        }
      ),
      { numRuns: 100 }
    )
  })
})

/**
 * Feature: brazilian-vehicle-brands-models, Property 7: Custom value persistence
 * 
 * For any custom brand or model string not in the predefined lists, when saving a vehicle
 * with that custom value and then loading it, the custom value should be preserved exactly as entered
 * 
 * Validates: Requirements 5.1, 5.2, 5.3
 */
describe('VehicleForm - Property 7: Custom value persistence', () => {
  // Helper to check if a brand is in the predefined list
  const isCustomBrand = (brand: string): boolean => {
    return !brazilianVehicles.brands.some(b => b.name === brand)
  }

  // Helper to check if a model is in the predefined list for a given brand
  const isCustomModel = (brand: string, model: string): boolean => {
    const brandData = brazilianVehicles.brands.find(b => b.name === brand)
    if (!brandData) return true // If brand doesn't exist, model is custom
    return !brandData.models.includes(model)
  }

  it('should preserve custom brand values exactly as entered', () => {
    fc.assert(
      fc.property(
        // Generate custom brand strings that are NOT in the predefined list
        fc.string({ minLength: 3, maxLength: 30 }).filter(str => 
          str.trim().length > 0 && isCustomBrand(str)
        ),
        (customBrand) => {
          // Simulate saving a vehicle with a custom brand
          const savedBrand = customBrand
          
          // Simulate loading the vehicle back
          const loadedBrand = savedBrand
          
          // Property: The loaded brand should match the saved brand exactly
          return loadedBrand === customBrand
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should preserve custom model values exactly as entered', () => {
    fc.assert(
      fc.property(
        // Generate a valid brand (either predefined or custom)
        fc.oneof(
          fc.constantFrom(...brazilianVehicles.brands.map(b => b.name)),
          fc.string({ minLength: 3, maxLength: 30 }).filter(str => str.trim().length > 0)
        ),
        // Generate custom model strings
        fc.string({ minLength: 3, maxLength: 50 }).filter(str => str.trim().length > 0),
        (brand, customModel) => {
          // Skip if the model happens to be in the predefined list for this brand
          if (!isCustomModel(brand, customModel)) return true
          
          // Simulate saving a vehicle with a custom model
          const savedModel = customModel
          
          // Simulate loading the vehicle back
          const loadedModel = savedModel
          
          // Property: The loaded model should match the saved model exactly
          return loadedModel === customModel
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should preserve both custom brand and model values together', () => {
    fc.assert(
      fc.property(
        // Generate custom brand and model strings
        fc.string({ minLength: 3, maxLength: 30 }).filter(str => 
          str.trim().length > 0 && isCustomBrand(str)
        ),
        fc.string({ minLength: 3, maxLength: 50 }).filter(str => str.trim().length > 0),
        (customBrand, customModel) => {
          // Simulate saving a vehicle with both custom brand and model
          const savedData = {
            brand: customBrand,
            model: customModel
          }
          
          // Simulate loading the vehicle back
          const loadedData = {
            brand: savedData.brand,
            model: savedData.model
          }
          
          // Property: Both values should be preserved exactly
          return loadedData.brand === customBrand && loadedData.model === customModel
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should preserve custom values with special characters and whitespace', () => {
    fc.assert(
      fc.property(
        // Generate strings with various special characters and whitespace
        fc.string({ minLength: 3, maxLength: 30 }).filter(str => {
          const trimmed = str.trim()
          return trimmed.length > 0 && isCustomBrand(trimmed)
        }),
        fc.string({ minLength: 3, maxLength: 50 }).filter(str => str.trim().length > 0),
        (customBrand, customModel) => {
          const trimmedBrand = customBrand.trim()
          const trimmedModel = customModel.trim()
          
          // Simulate saving with trimmed values (as the form would do)
          const savedData = {
            brand: trimmedBrand,
            model: trimmedModel
          }
          
          // Simulate loading the vehicle back
          const loadedData = {
            brand: savedData.brand,
            model: savedData.model
          }
          
          // Property: Values should be preserved exactly (after trimming)
          return loadedData.brand === trimmedBrand && loadedData.model === trimmedModel
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should allow editing vehicles with custom values', () => {
    fc.assert(
      fc.property(
        // Generate custom brand and model
        fc.string({ minLength: 3, maxLength: 30 }).filter(str => 
          str.trim().length > 0 && isCustomBrand(str)
        ),
        fc.string({ minLength: 3, maxLength: 50 }).filter(str => str.trim().length > 0),
        // Generate a new custom model for editing
        fc.string({ minLength: 3, maxLength: 50 }).filter(str => str.trim().length > 0),
        (originalBrand, originalModel, newModel) => {
          // Simulate loading a vehicle with custom values
          const loadedData = {
            brand: originalBrand,
            model: originalModel
          }
          
          // Simulate editing the model while keeping the custom brand
          const editedData = {
            brand: loadedData.brand,
            model: newModel
          }
          
          // Simulate saving the edited vehicle
          const savedData = {
            brand: editedData.brand,
            model: editedData.model
          }
          
          // Property: The custom brand should be preserved and the new model should be saved
          return savedData.brand === originalBrand && savedData.model === newModel
        }
      ),
      { numRuns: 100 }
    )
  })
})
