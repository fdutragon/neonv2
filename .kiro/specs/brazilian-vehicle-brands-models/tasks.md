# Implementation Plan

- [x] 1. Create Brazilian vehicle data module
  - Create `src/lib/brazilianVehicles.ts` with TypeScript interfaces and data structuresNew Session
  
  
  
  
  
  Let's build
  Plan, search, or build anything
  
  Vibe
  Chat first, then build. Explore ideas and iterate as you discover needs.
  Spec
  Plan first, then build. Create requirements and design before coding starts.
  Great for:
  
  Rapid exploration and testing
  Building when requirements are unclear
  Implementing a task
  
  - Include minimum 30 car brands with 10+ models each
  - Include minimum 15 motorcycle brands with 8+ models each
  - Organize data alphabetically by brand name
  - _Requirements: 1.5, 2.5, 3.1, 3.3_

- [ ] 1.1 Write unit tests for data validation




  - **Validates: Requirements 1.5, 2.5, 3.1, 3.3**

- [x] 2. Create reusable Combobox component
  - Create `src/components/Combobox.tsx` with TypeScript props interface
  - Implement filter logic with case-insensitive search
  - Add support for custom value input when no matches found
  - Implement keyboard navigation (arrow keys, enter, escape)
  - Add ARIA labels and accessibility features
  - Style component consistent with existing design system
  - _Requirements: 1.1, 1.2, 1.4, 2.2, 2.4_

- [x] 2.1 Write property test for filter correctness
  - **Property 1: Brand filter correctness**
  - **Validates: Requirements 1.2**

- [x] 2.2 Write property test for alphabetical ordering
  - **Property 5: Alphabetical ordering of brands**
  - **Property 6: Alphabetical ordering of models**
  - **Validates: Requirements 4.1, 4.2**

- [-] 2.3 Write unit tests for Combobox component

















  - **Validates: Requirements 1.1, 1.4, 2.4**

- [x] 3. Update VehicleForm to use Combobox for brand selection
  - Replace brand text input with Combobox component
  - Pass car and motorcycle brands as options
  - Implement visual separation between car and motorcycle brands
  - Maintain support for custom brand values
  - Update form state management to handle brand selection
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 4.4_

- [x] 3.1 Write property test for brand selection
  - **Property 3: Brand selection updates model list**
  - **Validates: Requirements 2.1, 3.2**

- [x] 4. Add model selection with dynamic filtering
  - Add Combobox component for model field
  - Implement logic to filter models based on selected brand
  - Disable model field when no brand is selected
  - Enable model field when brand is selected
  - Clear model field when brand changes
  - Maintain support for custom model values
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.2, 3.4_

- [x] 4.1 Write property test for model filter correctness




  - **Property 2: Model filter correctness**
  - **Validates: Requirements 2.2**









- [x] 4.2 Write property test for brand change behavior
  - **Property 4: Brand change clears model**
  - **Validates: Requirements 2.3**

- [ ] 4.3 Write property test for model field enable/disable








  - **Property 8: Brand selection enables model field**

  - **Validates: Requirements 2.1**

- [x] 5. Implement custom value persistence




  - Ensure custom brand values are saved correctly to database
  - Ensure custom model values are saved correctly to database
  - When editing existing vehicle, display custom values if not in predefined list
  - Verify form validation still works with custom values
  - _Requirements: 5.1, 5.2, 5.3, 5.4_


- [x] 5.1 Write property test for custom value persistence









  - **Property 7: Custom value persistence**
  - **Validates: Requirements 5.1, 5.2, 5.3**

- [x] 6. Add visual polish and user feedback



  - Add loading states during filtering
  - Add "no results" message when filter returns empty
  - Add visual indicator for custom vs. predefined values
  - Improve placeholder text for better UX
  - Test responsive behavior on mobile devices
  - _Requirements: 4.3_

- [x] 7. Checkpoint - Ensure all tests pass




  - Ensure all tests pass, ask the user if questions arise.
