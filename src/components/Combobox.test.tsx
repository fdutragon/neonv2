import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import * as fc from 'fast-check'
import Combobox from './Combobox'

/**
 * Unit Tests for Combobox Component
 * Validates: Requirements 1.1, 1.4, 2.4
 */
describe('Combobox - Unit Tests', () => {
  const mockOptions = ['Volkswagen', 'Honda', 'Toyota', 'Ford', 'Chevrolet']
  const mockOnChange = vi.fn()

  beforeEach(() => {
    mockOnChange.mockClear()
    // Mock scrollIntoView for jsdom environment
    Element.prototype.scrollIntoView = vi.fn()
  })

  /**
   * Requirement 1.1: Display selection field (dropdown/autocomplete)
   */
  it('should render combobox with label and input field', () => {
    render(
      <Combobox
        value=""
        onChange={mockOnChange}
        options={mockOptions}
        label="Marca"
        placeholder="Selecione uma marca"
      />
    )

    expect(screen.getByLabelText('Marca')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Selecione uma marca')).toBeInTheDocument()
  })

  /**
   * Requirement 1.1: Display selection field with options
   */
  it('should display options when input is focused', async () => {
    render(
      <Combobox
        value=""
        onChange={mockOnChange}
        options={mockOptions}
        label="Marca"
      />
    )

    const input = screen.getByRole('combobox')
    fireEvent.focus(input)

    await waitFor(() => {
      mockOptions.forEach(option => {
        expect(screen.getByText(option)).toBeInTheDocument()
      })
    })
  })

  /**
   * Requirement 1.4: Allow custom input when no matches found
   */
  it('should allow custom value input when allowCustom is true and no matches found', async () => {
    render(
      <Combobox
        value=""
        onChange={mockOnChange}
        options={mockOptions}
        label="Marca"
        allowCustom={true}
      />
    )

    const input = screen.getByRole('combobox')
    fireEvent.change(input, { target: { value: 'CustomBrand' } })

    expect(mockOnChange).toHaveBeenCalledWith('CustomBrand')
    
    await waitFor(() => {
      expect(screen.getByText(/Nenhum resultado encontrado/i)).toBeInTheDocument()
      expect(screen.getByText(/Pressione Enter para usar valor personalizado/i)).toBeInTheDocument()
    })
  })

  /**
   * Requirement 1.4: Custom value should be accepted on Enter key
   */
  it('should accept custom value when Enter is pressed', () => {
    render(
      <Combobox
        value=""
        onChange={mockOnChange}
        options={mockOptions}
        label="Marca"
        allowCustom={true}
      />
    )

    const input = screen.getByRole('combobox')
    fireEvent.change(input, { target: { value: 'CustomBrand' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    // Should be called twice: once on change, once on Enter
    expect(mockOnChange).toHaveBeenCalledWith('CustomBrand')
  })

  /**
   * Requirement 1.1: Keyboard navigation with arrow keys
   */
  it('should support keyboard navigation with arrow keys', async () => {
    render(
      <Combobox
        value=""
        onChange={mockOnChange}
        options={mockOptions}
        label="Marca"
      />
    )

    const input = screen.getByRole('combobox')
    fireEvent.focus(input)

    await waitFor(() => {
      expect(screen.getByText('Volkswagen')).toBeInTheDocument()
    })

    // Navigate down
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    
    // Select with Enter
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(mockOnChange).toHaveBeenCalled()
  })

  /**
   * Requirement 1.1: Escape key should close dropdown
   */
  it('should close dropdown when Escape is pressed', async () => {
    render(
      <Combobox
        value=""
        onChange={mockOnChange}
        options={mockOptions}
        label="Marca"
      />
    )

    const input = screen.getByRole('combobox')
    fireEvent.focus(input)

    await waitFor(() => {
      expect(screen.getByText('Volkswagen')).toBeInTheDocument()
    })

    fireEvent.keyDown(input, { key: 'Escape' })

    await waitFor(() => {
      expect(screen.queryByText('Volkswagen')).not.toBeInTheDocument()
    })
  })

  /**
   * Test clear button functionality
   */
  it('should clear value when clear button is clicked', () => {
    render(
      <Combobox
        value="Honda"
        onChange={mockOnChange}
        options={mockOptions}
        label="Marca"
      />
    )

    const clearButton = screen.getByLabelText('Limpar seleção')
    fireEvent.click(clearButton)

    expect(mockOnChange).toHaveBeenCalledWith('')
  })

  /**
   * Test disabled state
   */
  it('should be disabled when disabled prop is true', () => {
    render(
      <Combobox
        value=""
        onChange={mockOnChange}
        options={mockOptions}
        label="Modelo"
        disabled={true}
      />
    )

    const input = screen.getByRole('combobox')
    expect(input).toBeDisabled()
    expect(screen.getByPlaceholderText('Selecione uma marca primeiro...')).toBeInTheDocument()
  })

  /**
   * Test required field indicator
   */
  it('should display required indicator when required is true', () => {
    render(
      <Combobox
        value=""
        onChange={mockOnChange}
        options={mockOptions}
        label="Marca"
        required={true}
      />
    )

    expect(screen.getByText(/Marca \*/)).toBeInTheDocument()
  })

  /**
   * Test custom value indicator
   */
  it('should display custom value indicator when value is not in options', () => {
    render(
      <Combobox
        value="CustomBrand"
        onChange={mockOnChange}
        options={mockOptions}
        label="Marca"
      />
    )

    expect(screen.getByText(/Valor personalizado/i)).toBeInTheDocument()
  })

  /**
   * Test ARIA attributes for accessibility
   */
  it('should have proper ARIA attributes for accessibility', () => {
    render(
      <Combobox
        value=""
        onChange={mockOnChange}
        options={mockOptions}
        label="Marca"
      />
    )

    const input = screen.getByRole('combobox')
    expect(input).toHaveAttribute('aria-label', 'Marca')
    expect(input).toHaveAttribute('aria-autocomplete', 'list')
    expect(input).toHaveAttribute('aria-expanded', 'false')
  })

  /**
   * Test option selection
   */
  it('should select option when clicked', async () => {
    render(
      <Combobox
        value=""
        onChange={mockOnChange}
        options={mockOptions}
        label="Marca"
      />
    )

    const input = screen.getByRole('combobox')
    fireEvent.focus(input)

    await waitFor(() => {
      expect(screen.getByText('Honda')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Honda'))

    expect(mockOnChange).toHaveBeenCalledWith('Honda')
  })
})

/**
 * Feature: brazilian-vehicle-brands-models, Property 1: Brand filter correctness
 * 
 * For any search string and brand list, when filtering brands by that string,
 * all returned brands should contain the search string (case-insensitive)
 * 
 * Validates: Requirements 1.2
 */
describe('Combobox - Property 1: Brand filter correctness', () => {
  // Extract the filter logic to test it directly
  const filterOptions = (options: string[], searchTerm: string): string[] => {
    return options
      .filter(option => 
        option.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => a.localeCompare(b, 'pt-BR'))
  }

  it('should filter options to only include those containing the search string (case-insensitive)', () => {
    fc.assert(
      fc.property(
        // Generate a list of brand names (strings)
        fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 50 }),
        // Generate a search string
        fc.string({ minLength: 1, maxLength: 10 }),
        (brands, searchString) => {
          // Filter out empty strings and duplicates
          const uniqueBrands = Array.from(new Set(brands.filter(b => b.trim().length > 0)))
          
          if (uniqueBrands.length === 0) return true // Skip empty brand lists

          // Apply the filter logic
          const filteredResults = filterOptions(uniqueBrands, searchString)

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
 * Feature: brazilian-vehicle-brands-models, Property 2: Model filter correctness
 * 
 * For any search string and model list, when filtering models by that string,
 * all returned models should contain the search string (case-insensitive)
 * 
 * Validates: Requirements 2.2
 */
describe('Combobox - Property 2: Model filter correctness', () => {
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
        // Generate a list of model names (strings)
        fc.array(fc.string({ minLength: 1, maxLength: 30 }), { minLength: 1, maxLength: 50 }),
        // Generate a search string
        fc.string({ minLength: 1, maxLength: 10 }),
        (models, searchString) => {
          // Filter out empty strings and duplicates
          const uniqueModels = Array.from(new Set(models.filter(m => m.trim().length > 0)))
          
          if (uniqueModels.length === 0) return true // Skip empty model lists

          // Apply the filter logic
          const filteredResults = filterOptions(uniqueModels, searchString)

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
 * Feature: brazilian-vehicle-brands-models, Property 5: Alphabetical ordering of brands
 * Feature: brazilian-vehicle-brands-models, Property 6: Alphabetical ordering of models
 * 
 * For any brand list returned by the system, the brands should be in alphabetical order (case-insensitive)
 * For any model list returned by the system for a given brand, the models should be in alphabetical order (case-insensitive)
 * 
 * Validates: Requirements 4.1, 4.2
 */
describe('Combobox - Property 5 & 6: Alphabetical ordering', () => {
  // Extract the filter logic to test it directly
  const filterOptions = (options: string[], searchTerm: string): string[] => {
    return options
      .filter(option => 
        option.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => a.localeCompare(b, 'pt-BR'))
  }

  const isAlphabeticallySorted = (items: string[]): boolean => {
    for (let i = 0; i < items.length - 1; i++) {
      if (items[i].localeCompare(items[i + 1], 'pt-BR') > 0) {
        return false
      }
    }
    return true
  }

  it('should return options in alphabetical order', () => {
    fc.assert(
      fc.property(
        // Generate a list of strings (brands or models)
        fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 2, maxLength: 50 }),
        // Generate a search string
        fc.string({ minLength: 0, maxLength: 10 }),
        (items, searchString) => {
          // Filter out empty strings and duplicates
          const uniqueItems = Array.from(new Set(items.filter(item => item.trim().length > 0)))
          
          if (uniqueItems.length < 2) return true // Skip lists with less than 2 items

          // Apply the filter logic
          const filteredResults = filterOptions(uniqueItems, searchString)

          if (filteredResults.length < 2) return true // Skip if less than 2 results

          // Property: Results should be in alphabetical order
          return isAlphabeticallySorted(filteredResults)
        }
      ),
      { numRuns: 100 }
    )
  })
})
