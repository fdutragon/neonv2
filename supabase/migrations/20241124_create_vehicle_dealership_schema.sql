-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create vehicles table
CREATE TABLE vehicles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1),
  price DECIMAL(12, 2) NOT NULL CHECK (price >= 0),
  mileage INTEGER NOT NULL CHECK (mileage >= 0),
  fuel_type TEXT NOT NULL CHECK (fuel_type IN ('gasoline', 'diesel', 'electric', 'hybrid')),
  category TEXT NOT NULL CHECK (category IN ('sedan', 'suv', 'hatchback', 'pickup', 'coupe', 'convertible', 'wagon')),
  featured BOOLEAN DEFAULT FALSE,
  featured_order INTEGER DEFAULT 0,
  specifications JSONB DEFAULT '{}',
  description TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vehicle_images table
CREATE TABLE vehicle_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact_interests table
CREATE TABLE contact_interests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_vehicles_featured ON vehicles(featured);
CREATE INDEX idx_vehicles_brand ON vehicles(brand);
CREATE INDEX idx_vehicles_model ON vehicles(model);
CREATE INDEX idx_vehicles_year ON vehicles(year);
CREATE INDEX idx_vehicles_price ON vehicles(price);
CREATE INDEX idx_vehicles_category ON vehicles(category);
CREATE INDEX idx_vehicles_fuel_type ON vehicles(fuel_type);
CREATE INDEX idx_vehicle_images_vehicle_id ON vehicle_images(vehicle_id);
CREATE INDEX idx_vehicle_images_order ON vehicle_images(order_index);
CREATE INDEX idx_contact_interests_vehicle_id ON contact_interests(vehicle_id);
CREATE INDEX idx_contact_interests_created_at ON contact_interests(created_at);

-- Enable Row Level Security
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_interests ENABLE ROW LEVEL SECURITY;

-- Create policies for vehicles table
CREATE POLICY "Allow public read access" ON vehicles
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users full access" ON vehicles
  FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for vehicle_images table
CREATE POLICY "Allow public read access" ON vehicle_images
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users full access" ON vehicle_images
  FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for contact_interests table
CREATE POLICY "Allow public insert" ON contact_interests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access" ON contact_interests
  FOR ALL USING (auth.role() = 'authenticated');

-- Grant permissions to anon and authenticated roles
GRANT SELECT ON vehicles TO anon;
GRANT ALL ON vehicles TO authenticated;
GRANT SELECT ON vehicle_images TO anon;
GRANT ALL ON vehicle_images TO authenticated;
GRANT INSERT ON contact_interests TO anon;
GRANT ALL ON contact_interests TO authenticated;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_vehicles_updated_at
  BEFORE UPDATE ON vehicles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();