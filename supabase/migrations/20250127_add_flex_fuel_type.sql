-- Add 'flex' as a valid fuel type option
-- This migration updates the check constraint to include 'flex' fuel type

-- Drop the existing constraint
ALTER TABLE vehicles DROP CONSTRAINT IF EXISTS vehicles_fuel_type_check;

-- Add the new constraint with 'flex' included
ALTER TABLE vehicles ADD CONSTRAINT vehicles_fuel_type_check 
  CHECK (fuel_type IN ('gasoline', 'diesel', 'electric', 'flex'));

-- Update any existing records if needed (optional)
-- UPDATE vehicles SET fuel_type = 'flex' WHERE fuel_type = 'gasoline' AND <some condition>;
