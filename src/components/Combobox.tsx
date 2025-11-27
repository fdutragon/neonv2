import { useState, useRef, useEffect } from 'react'
import { ChevronDown, X, Sparkles } from 'lucide-react'

export interface ComboboxProps {
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder?: string
  label: string
  required?: boolean
  disabled?: boolean
  allowCustom?: boolean
}

export default function Combobox({
  value,
  onChange,
  options,
  placeholder = 'Selecione ou digite...',
  label,
  required = false,
  disabled = false,
  allowCustom = true
}: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [isFiltering, setIsFiltering] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Check if current value is a custom value (not in predefined options)
  const isCustomValue = value && !options.includes(value)

  // Filter options based on search term (case-insensitive)
  const filteredOptions = options
    .filter(option => 
      option.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.localeCompare(b, 'pt-BR'))

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Reset highlighted index when filtered options change
  useEffect(() => {
    setHighlightedIndex(-1)
  }, [searchTerm])

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [highlightedIndex])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchTerm(newValue)
    setIsOpen(true)
    
    // Show loading state briefly during filtering
    setIsFiltering(true)
    setTimeout(() => setIsFiltering(false), 150)
    
    // If custom values are allowed, update the value immediately
    if (allowCustom) {
      onChange(newValue)
    }
  }

  const handleOptionSelect = (option: string) => {
    onChange(option)
    setSearchTerm('')
    setIsOpen(false)
    inputRef.current?.blur()
  }

  const handleClear = () => {
    onChange('')
    setSearchTerm('')
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setIsOpen(true)
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        )
        break
      
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleOptionSelect(filteredOptions[highlightedIndex])
        } else if (searchTerm && allowCustom) {
          // If no option is highlighted but there's a search term, use it as custom value
          onChange(searchTerm)
          setSearchTerm('')
          setIsOpen(false)
        } else if (filteredOptions.length === 1) {
          // If only one option matches, select it
          handleOptionSelect(filteredOptions[0])
        }
        break
      
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        setSearchTerm('')
        inputRef.current?.blur()
        break
      
      case 'Tab':
        setIsOpen(false)
        setSearchTerm('')
        break
    }
  }

  const displayValue = searchTerm || value

  return (
    <div ref={containerRef} className="relative">
      <label 
        htmlFor={`combobox-${label}`}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label} {required && '*'}
        {isCustomValue && (
          <span className="ml-2 inline-flex items-center gap-1 text-xs font-normal text-amber-600">
            <Sparkles className="h-3 w-3" />
            Valor personalizado
          </span>
        )}
      </label>
      
      <div className="relative">
        <input
          ref={inputRef}
          id={`combobox-${label}`}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          required={required}
          placeholder={disabled ? 'Selecione uma marca primeiro...' : placeholder}
          className={`w-full px-3 py-2 pr-20 border rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors ${
            isCustomValue 
              ? 'border-amber-300 bg-amber-50' 
              : 'border-gray-300'
          }`}
          aria-label={label}
          aria-expanded={isOpen}
          aria-controls={`combobox-list-${label}`}
          aria-autocomplete="list"
          aria-activedescendant={
            highlightedIndex >= 0 
              ? `combobox-option-${label}-${highlightedIndex}` 
              : undefined
          }
          role="combobox"
        />
        
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              aria-label="Limpar seleção"
              tabIndex={-1}
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          )}
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label={isOpen ? 'Fechar opções' : 'Abrir opções'}
            tabIndex={-1}
            disabled={disabled}
          >
            <ChevronDown 
              className={`h-4 w-4 text-gray-500 transition-transform ${
                isOpen ? 'rotate-180' : ''
              }`} 
            />
          </button>
        </div>
      </div>

      {/* Dropdown List */}
      {isOpen && !disabled && (
        <ul
          ref={listRef}
          id={`combobox-list-${label}`}
          role="listbox"
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
        >
          {isFiltering ? (
            <li className="px-3 py-2 text-gray-500 text-sm flex items-center gap-2">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-900"></div>
              Filtrando...
            </li>
          ) : filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={option}
                id={`combobox-option-${label}-${index}`}
                role="option"
                aria-selected={option === value}
                onClick={() => handleOptionSelect(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`px-3 py-2 cursor-pointer transition-colors ${
                  index === highlightedIndex
                    ? 'bg-blue-100'
                    : option === value
                    ? 'bg-blue-50'
                    : 'hover:bg-gray-50'
                }`}
              >
                {option}
              </li>
            ))
          ) : (
            <li className="px-3 py-3 text-center">
              <div className="text-gray-500 text-sm mb-1">
                {searchTerm ? (
                  <>
                    <span className="font-medium">Nenhum resultado encontrado</span>
                    <span className="block text-xs mt-1">
                      Buscando por: "{searchTerm}"
                    </span>
                  </>
                ) : (
                  'Nenhuma opção disponível'
                )}
              </div>
              {allowCustom && searchTerm && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-1 text-xs text-amber-600">
                    <Sparkles className="h-3 w-3" />
                    <span>Pressione Enter para usar valor personalizado</span>
                  </div>
                </div>
              )}
            </li>
          )}
        </ul>
      )}
    </div>
  )
}
