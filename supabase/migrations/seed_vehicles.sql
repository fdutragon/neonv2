-- Seed 10 example vehicles and images

with admin as (
  select id from auth.users where email = 'admin@neonmultimarcas.com' limit 1
)
insert into vehicles (id, brand, model, year, price, mileage, fuel_type, category, featured, featured_order, specifications, description, created_by)
values
  (gen_random_uuid(), 'BMW', '320i M Sport', 2022, 239900.00, 12000, 'gasoline', 'sedan', true, 1, '{"engine":"2.0 Turbo","power":"184 cv","transmission":"Automática","drivetrain":"RWD"}', 'Sedã premium com pacote M Sport e tecnologia BMW.', (select id from admin)),
  (gen_random_uuid(), 'Mercedes-Benz', 'C 200 AMG Line', 2021, 249900.00, 15000, 'gasoline', 'sedan', true, 2, '{"engine":"1.5 Turbo","power":"204 cv","transmission":"Automática","drivetrain":"RWD"}', 'Elegância e desempenho com pacote AMG Line.', (select id from admin)),
  (gen_random_uuid(), 'Audi', 'A4 Prestige', 2020, 219900.00, 22000, 'gasoline', 'sedan', true, 3, '{"engine":"2.0 TFSI","power":"190 cv","transmission":"Automática","drivetrain":"AWD"}', 'Conforto e tecnologia com tração quattro.', (select id from admin)),
  (gen_random_uuid(), 'BMW', 'X5 xDrive45e', 2021, 469900.00, 18000, 'hybrid', 'suv', true, 4, '{"engine":"Híbrido 3.0","power":"394 cv","transmission":"Automática","drivetrain":"AWD"}', 'SUV híbrido plug-in com alto desempenho.', (select id from admin)),
  (gen_random_uuid(), 'Mercedes-Benz', 'GLE 450', 2020, 439900.00, 24000, 'gasoline', 'suv', true, 5, '{"engine":"3.0 Turbo","power":"367 cv","transmission":"Automática","drivetrain":"AWD"}', 'SUV espaçoso com pacote tecnológico avançado.', (select id from admin)),
  (gen_random_uuid(), 'Porsche', '911 Carrera', 2019, 729900.00, 30000, 'gasoline', 'coupe', true, 6, '{"engine":"3.0 Boxer","power":"379 cv","transmission":"PDK","drivetrain":"RWD"}', 'Ícone esportivo com engenharia de ponta.', (select id from admin)),
  (gen_random_uuid(), 'Jaguar', 'F-PACE R-Dynamic', 2020, 329900.00, 26000, 'diesel', 'suv', false, 0, '{"engine":"2.0 Turbo","power":"180 cv","transmission":"Automática","drivetrain":"AWD"}', 'SUV britânico com design marcante.', (select id from admin)),
  (gen_random_uuid(), 'Land Rover', 'Discovery Sport', 2019, 289900.00, 35000, 'diesel', 'suv', false, 0, '{"engine":"2.0 Turbo","power":"180 cv","transmission":"Automática","drivetrain":"AWD"}', 'Versatilidade e capacidade off-road.', (select id from admin)),
  (gen_random_uuid(), 'Volvo', 'XC60 Inscription', 2021, 349900.00, 20000, 'hybrid', 'suv', false, 0, '{"engine":"T8 Híbrido","power":"407 cv","transmission":"Automática","drivetrain":"AWD"}', 'Segurança e conforto escandinavo.', (select id from admin)),
  (gen_random_uuid(), 'BMW', 'M3 Competition', 2022, 699900.00, 8000, 'gasoline', 'sedan', false, 0, '{"engine":"3.0 TwinTurbo","power":"510 cv","transmission":"Automática","drivetrain":"RWD"}', 'Sedã esportivo com performance extrema.', (select id from admin));

-- Insert images for each vehicle (3 images each, external sample URLs)
insert into vehicle_images (id, vehicle_id, image_url, order_index, is_primary)
select gen_random_uuid(), v.id, img.url, img.idx, img.idx = 0
from vehicles v
join (
  values
    (0, 'https://images.unsplash.com/photo-1600526723450-1f9c3f4d9df7'),
    (1, 'https://images.unsplash.com/photo-1549923746-3f4b1e2c9fcb'),
    (2, 'https://images.unsplash.com/photo-1511910849309-0f48f1e0aa3b')
) as img(idx, url) on true
where v.brand in ('BMW','Mercedes-Benz','Audi','Porsche','Jaguar','Land Rover','Volvo')
order by v.created_at;
