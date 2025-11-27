export interface VehicleBrand {
  name: string
  type: 'car' | 'motorcycle'
  models: string[]
}

export interface BrazilianVehicleData {
  brands: VehicleBrand[]
}

export const brazilianVehicles: BrazilianVehicleData = {
  brands: [
    // Car Brands (30+)
    {
      name: 'Audi',
      type: 'car',
      models: ['A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'RS3', 'RS5']
    },
    {
      name: 'BMW',
      type: 'car',
      models: ['118i', '120i', '320i', '330i', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'Z4']
    },
    {
      name: 'BYD',
      type: 'car',
      models: ['Dolphin', 'Dolphin Mini', 'King', 'Song Plus', 'Song Pro', 'Tan', 'Yuan Plus', 'Han', 'Seal', 'Shark']
    },
    {
      name: 'Caoa Chery',
      type: 'car',
      models: ['Arrizo 5', 'Arrizo 6', 'Tiggo 2', 'Tiggo 3X', 'Tiggo 5X', 'Tiggo 7', 'Tiggo 8', 'Tiggo 8 Pro', 'Tiggo 8 Max', 'iCar']
    },
    {
      name: 'Chevrolet',
      type: 'car',
      models: ['Cruze', 'Equinox', 'Montana', 'Onix', 'Onix Plus', 'S10', 'Spin', 'Tracker', 'TrailBlazer', 'Trailblazer']
    },
    {
      name: 'Citroën',
      type: 'car',
      models: ['C3', 'C3 Aircross', 'C4 Cactus', 'Berlingo', 'Jumper', 'Jumpy', 'Spacetourer', 'C5 Aircross', 'Ami', 'ë-Jumpy']
    },
    {
      name: 'Dodge',
      type: 'car',
      models: ['Challenger', 'Charger', 'Durango', 'Journey', 'RAM 1500', 'RAM 2500', 'RAM 3500', 'Viper', 'Dart', 'Grand Caravan']
    },
    {
      name: 'Fiat',
      type: 'car',
      models: ['Argo', 'Cronos', 'Ducato', 'Fastback', 'Fiorino', 'Mobi', 'Pulse', 'Strada', 'Toro', 'Uno']
    },
    {
      name: 'Ford',
      type: 'car',
      models: ['Bronco', 'Bronco Sport', 'EcoSport', 'Edge', 'Escape', 'Explorer', 'F-150', 'Mustang', 'Ranger', 'Territory']
    },
    {
      name: 'GWM',
      type: 'car',
      models: ['Haval H6', 'Haval Jolion', 'Ora 03', 'Poer', 'Tank 300', 'Tank 500', 'Wey Coffee 01', 'Wey Mocha', 'Haval H6 GT', 'Haval Dargo']
    },
    {
      name: 'Honda',
      type: 'car',
      models: ['Accord', 'City', 'Civic', 'CR-V', 'Fit', 'HR-V', 'WR-V', 'Civic Type R', 'City Hatchback', 'ZR-V']
    },
    {
      name: 'Hyundai',
      type: 'car',
      models: ['Azera', 'Creta', 'Elantra', 'HB20', 'HB20S', 'i30', 'Ioniq 5', 'Palisade', 'Santa Fe', 'Tucson']
    },
    {
      name: 'Jaguar',
      type: 'car',
      models: ['E-Pace', 'F-Pace', 'F-Type', 'I-Pace', 'XE', 'XF', 'XJ', 'F-Type R', 'F-Pace SVR', 'XE SV Project 8']
    },
    {
      name: 'Jeep',
      type: 'car',
      models: ['Commander', 'Compass', 'Grand Cherokee', 'Renegade', 'Wrangler', 'Gladiator', 'Cherokee', 'Wrangler Rubicon', 'Grand Cherokee L', 'Compass Trailhawk']
    },
    {
      name: 'Kia',
      type: 'car',
      models: ['Carnival', 'Cerato', 'EV6', 'Niro', 'Picanto', 'Seltos', 'Sorento', 'Sportage', 'Stinger', 'Soul']
    },
    {
      name: 'Land Rover',
      type: 'car',
      models: ['Defender', 'Discovery', 'Discovery Sport', 'Evoque', 'Range Rover', 'Range Rover Sport', 'Range Rover Velar', 'Defender 90', 'Defender 110', 'Range Rover Vogue']
    },
    {
      name: 'Lexus',
      type: 'car',
      models: ['ES', 'GX', 'IS', 'LC', 'LS', 'LX', 'NX', 'RC', 'RX', 'UX']
    },
    {
      name: 'Mazda',
      type: 'car',
      models: ['CX-3', 'CX-30', 'CX-5', 'CX-50', 'CX-9', 'Mazda2', 'Mazda3', 'Mazda6', 'MX-5', 'MX-30']
    },
    {
      name: 'Mercedes-Benz',
      type: 'car',
      models: ['A 200', 'C 180', 'C 200', 'CLA 200', 'E 200', 'GLA 200', 'GLB 200', 'GLC 300', 'GLE 450', 'S 500']
    },
    {
      name: 'Mini',
      type: 'car',
      models: ['Clubman', 'Countryman', 'Cooper', 'Cooper S', 'John Cooper Works', 'Paceman', 'Roadster', 'Convertible', 'Electric', 'Hardtop']
    },
    {
      name: 'Mitsubishi',
      type: 'car',
      models: ['ASX', 'Eclipse Cross', 'L200', 'L200 Triton', 'Outlander', 'Pajero', 'Pajero Sport', 'Pajero Full', 'Lancer', 'Mirage']
    },
    {
      name: 'Nissan',
      type: 'car',
      models: ['Altima', 'Frontier', 'Kicks', 'Leaf', 'March', 'Sentra', 'Versa', 'X-Trail', 'GT-R', '370Z']
    },
    {
      name: 'Peugeot',
      type: 'car',
      models: ['2008', '208', '3008', '308', '5008', 'Expert', 'Landtrek', 'Partner', 'Rifter', 'Traveller']
    },
    {
      name: 'Porsche',
      type: 'car',
      models: ['718 Boxster', '718 Cayman', '911', 'Cayenne', 'Macan', 'Panamera', 'Taycan', '911 Turbo', 'Cayenne Turbo', 'Macan GTS']
    },
    {
      name: 'RAM',
      type: 'car',
      models: ['1500', '2500', '3500', 'Rampage', '1500 Rebel', '2500 Power Wagon', '3500 Laramie', '1500 TRX', '2500 Limited', '1500 Laramie']
    },
    {
      name: 'Renault',
      type: 'car',
      models: ['Captur', 'Duster', 'Kardian', 'Kwid', 'Logan', 'Master', 'Oroch', 'Sandero', 'Stepway', 'Zoe']
    },
    {
      name: 'Subaru',
      type: 'car',
      models: ['BRZ', 'Crosstrek', 'Forester', 'Impreza', 'Legacy', 'Outback', 'WRX', 'WRX STI', 'Ascent', 'Levorg']
    },
    {
      name: 'Suzuki',
      type: 'car',
      models: ['Baleno', 'Celerio', 'Ciaz', 'Ertiga', 'Ignis', 'Jimny', 'S-Cross', 'Swift', 'Vitara', 'XL7']
    },
    {
      name: 'Toyota',
      type: 'car',
      models: ['Camry', 'Corolla', 'Corolla Cross', 'Hilux', 'Prius', 'RAV4', 'SW4', 'Yaris', 'Yaris Sedan', 'Land Cruiser']
    },
    {
      name: 'Volkswagen',
      type: 'car',
      models: ['Amarok', 'Gol', 'Jetta', 'Nivus', 'Passat', 'Polo', 'Saveiro', 'T-Cross', 'Taos', 'Tiguan', 'Virtus']
    },
    {
      name: 'Volvo',
      type: 'car',
      models: ['C40', 'S60', 'S90', 'V60', 'V90', 'XC40', 'XC60', 'XC90', 'XC40 Recharge', 'C40 Recharge']
    },

    // Motorcycle Brands (15+)
    {
      name: 'BMW Motorrad',
      type: 'motorcycle',
      models: ['F 750 GS', 'F 850 GS', 'F 900 R', 'F 900 XR', 'G 310 GS', 'G 310 R', 'R 1250 GS', 'S 1000 RR', 'R 1250 RT', 'K 1600 GTL']
    },
    {
      name: 'Dafra',
      type: 'motorcycle',
      models: ['Apache RTR 200', 'Citycom 300i', 'Cruisym 150', 'Horizon 150', 'Maxsym 400i', 'NH 190', 'Next 250', 'Sym Cruisym', 'Cityclass 200i', 'Fiddle III']
    },
    {
      name: 'Ducati',
      type: 'motorcycle',
      models: ['Diavel', 'Hypermotard', 'Monster', 'Multistrada', 'Panigale V2', 'Panigale V4', 'Scrambler', 'SuperSport', 'DesertX', 'Streetfighter V4']
    },
    {
      name: 'Haojue',
      type: 'motorcycle',
      models: ['Chopper Road 150', 'DK 150', 'DR 160', 'Lindy 125', 'Master Ride 150', 'NK 150', 'Nex 115', 'TR 150', 'VR 150', 'Cool 150']
    },
    {
      name: 'Harley-Davidson',
      type: 'motorcycle',
      models: ['Fat Boy', 'Fat Bob', 'Heritage Classic', 'Iron 883', 'Low Rider', 'Road Glide', 'Road King', 'Softail', 'Street Glide', 'Sportster S']
    },
    {
      name: 'Honda',
      type: 'motorcycle',
      models: ['Africa Twin', 'Biz 125', 'CB 500F', 'CB 500X', 'CB 650R', 'CBR 1000RR', 'CG 160', 'Elite 125', 'NC 750X', 'PCX', 'Pop 110i', 'XRE 300']
    },
    {
      name: 'Kasinski',
      type: 'motorcycle',
      models: ['Comet 250', 'Cruise 125', 'Flash 150', 'Mirage 150', 'Prima 150', 'Seta 125', 'Soft 125', 'Super Cab', 'Win 110', 'Rx 125']
    },
    {
      name: 'Kawasaki',
      type: 'motorcycle',
      models: ['Ninja 300', 'Ninja 400', 'Ninja 650', 'Ninja ZX-6R', 'Ninja ZX-10R', 'Versys 650', 'Versys 1000', 'Z400', 'Z650', 'Z900']
    },
    {
      name: 'KTM',
      type: 'motorcycle',
      models: ['1290 Super Adventure', '1290 Super Duke', '390 Adventure', '390 Duke', '790 Adventure', '790 Duke', '890 Adventure', '890 Duke', 'RC 390', 'RC 200']
    },
    {
      name: 'Royal Enfield',
      type: 'motorcycle',
      models: ['Classic 350', 'Classic 500', 'Continental GT 650', 'Himalayan', 'Interceptor 650', 'Meteor 350', 'Scram 411', 'Super Meteor 650', 'Hunter 350', 'Bullet 350']
    },
    {
      name: 'Shineray',
      type: 'motorcycle',
      models: ['Discover 125', 'Explorer 150', 'Jet 50', 'Phoenix 50', 'Retro 50', 'Rocket 50', 'Sport 50', 'XY 150-10B', 'XY 200-5A', 'XY 250GY']
    },
    {
      name: 'Suzuki',
      type: 'motorcycle',
      models: ['Burgman 125', 'Burgman 400', 'DL 650 V-Strom', 'DL 1000 V-Strom', 'GSX-R1000', 'GSX-S750', 'GSX-S1000', 'Hayabusa', 'Intruder 150', 'SV650']
    },
    {
      name: 'Traxx',
      type: 'motorcycle',
      models: ['JH 150', 'JH 250', 'JL 50Q', 'Sky 125', 'Star 50', 'TS 50', 'TX 200', 'TXR 200', 'Fly 125', 'JH 150-8']
    },
    {
      name: 'Triumph',
      type: 'motorcycle',
      models: ['Bonneville', 'Daytona', 'Rocket 3', 'Speed Triple', 'Street Triple', 'Tiger 900', 'Tiger 1200', 'Trident 660', 'Scrambler 1200', 'Thruxton']
    },
    {
      name: 'Yamaha',
      type: 'motorcycle',
      models: ['Crosser 150', 'Factor 150', 'Fazer 250', 'FZ25', 'Lander 250', 'MT-03', 'MT-07', 'MT-09', 'Neo 125', 'NMAX 160', 'R3', 'XTZ 150']
    }
  ]
}

// Helper functions to get brands and models
export function getCarBrands(): VehicleBrand[] {
  return brazilianVehicles.brands
    .filter(brand => brand.type === 'car')
    .sort((a, b) => a.name.localeCompare(b.name))
}

export function getMotorcycleBrands(): VehicleBrand[] {
  return brazilianVehicles.brands
    .filter(brand => brand.type === 'motorcycle')
    .sort((a, b) => a.name.localeCompare(b.name))
}

export function getAllBrands(): VehicleBrand[] {
  return [...brazilianVehicles.brands].sort((a, b) => a.name.localeCompare(b.name))
}

export function getModelsForBrand(brandName: string): string[] {
  const brand = brazilianVehicles.brands.find(b => b.name === brandName)
  return brand ? [...brand.models].sort((a, b) => a.localeCompare(b)) : []
}

export function getBrandNames(): string[] {
  return getAllBrands().map(brand => brand.name)
}

export function getCarBrandNames(): string[] {
  return getCarBrands().map(brand => brand.name)
}

export function getMotorcycleBrandNames(): string[] {
  return getMotorcycleBrands().map(brand => brand.name)
}
