-- Allow new category value 'utility'
ALTER TABLE vehicles DROP CONSTRAINT IF EXISTS vehicles_category_check;
ALTER TABLE vehicles
  ADD CONSTRAINT vehicles_category_check
  CHECK (category IN ('sedan','suv','hatchback','pickup','coupe','convertible','wagon','utility'));
