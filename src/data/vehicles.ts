export type Vehicle = {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  colors: string[];
  engine: string;
  seating: number;
  transmission: "Manual" | "Automatic";
  fuel: "Petrol" | "Diesel" | "CNG" | "Electric";
  inStock: boolean;
  description: string;
};

// Placeholder — replace with real inventory.
export const autoRickshaws: Vehicle[] = [
  {
    id: "ar-1",
    name: "Bajaj RE Compact",
    brand: "Bajaj",
    price: 235000,
    image:
      "https://images.unsplash.com/photo-1580494767050-8b3a2f0e0b0f?auto=format&fit=crop&w=1200&q=80",
    colors: ["Yellow", "Green", "Black"],
    engine: "236cc / 10.2 bhp",
    seating: 4,
    transmission: "Manual",
    fuel: "CNG",
    inStock: true,
    description:
      "Reliable city auto rickshaw with strong pickup and low running cost.",
  },
  {
    id: "ar-2",
    name: "Piaggio Ape City+",
    brand: "Piaggio",
    price: 215000,
    image:
      "https://images.unsplash.com/photo-1519055548599-6d4d129508c4?auto=format&fit=crop&w=1200&q=80",
    colors: ["Yellow", "White"],
    engine: "230cc / 8.7 bhp",
    seating: 4,
    transmission: "Manual",
    fuel: "Diesel",
    inStock: true,
    description:
      "Compact, fuel-efficient auto — a favourite for local passenger routes.",
  },
  {
    id: "ar-3",
    name: "Mahindra Treo",
    brand: "Mahindra",
    price: 285000,
    image:
      "https://images.unsplash.com/photo-1617196701539-e88ae67f0f6f?auto=format&fit=crop&w=1200&q=80",
    colors: ["White", "Blue"],
    engine: "8 kW Electric",
    seating: 4,
    transmission: "Automatic",
    fuel: "Electric",
    inStock: false,
    description:
      "Zero-emission electric auto rickshaw with low maintenance cost.",
  },
  {
    id: "ar-4",
    name: "TVS King Deluxe",
    brand: "TVS",
    price: 205000,
    image:
      "https://images.unsplash.com/photo-1597007519071-c1a5aebc4a44?auto=format&fit=crop&w=1200&q=80",
    colors: ["Yellow", "Red"],
    engine: "199cc / 7.4 bhp",
    seating: 4,
    transmission: "Manual",
    fuel: "Petrol",
    inStock: true,
    description:
      "Smooth ride and refined engine — well-suited for daily commercial use.",
  },
];

export const cars: Vehicle[] = [
  {
    id: "c-1",
    name: "Maruti Suzuki Swift VXi",
    brand: "Maruti Suzuki",
    price: 585000,
    image:
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80",
    colors: ["White", "Red", "Silver"],
    engine: "1.2L / 89 bhp",
    seating: 5,
    transmission: "Manual",
    fuel: "Petrol",
    inStock: true,
    description:
      "Popular hatchback with excellent mileage and easy service network.",
  },
  {
    id: "c-2",
    name: "Hyundai Creta SX",
    brand: "Hyundai",
    price: 1250000,
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
    colors: ["Black", "White", "Blue"],
    engine: "1.5L / 113 bhp",
    seating: 5,
    transmission: "Automatic",
    fuel: "Diesel",
    inStock: true,
    description:
      "Feature-rich compact SUV with premium interiors and strong performance.",
  },
  {
    id: "c-3",
    name: "Tata Nexon EV",
    brand: "Tata",
    price: 1450000,
    image:
      "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=1200&q=80",
    colors: ["White", "Blue", "Grey"],
    engine: "129 bhp Electric",
    seating: 5,
    transmission: "Automatic",
    fuel: "Electric",
    inStock: true,
    description:
      "India's popular electric SUV — long range and zero running fuel cost.",
  },
  {
    id: "c-4",
    name: "Honda City ZX",
    brand: "Honda",
    price: 1180000,
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    colors: ["Silver", "White", "Black"],
    engine: "1.5L / 119 bhp",
    seating: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    inStock: false,
    description:
      "Premium sedan with refined ride quality and a spacious cabin.",
  },
  {
    id: "c-5",
    name: "Mahindra Bolero",
    brand: "Mahindra",
    price: 895000,
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
    colors: ["White", "Beige"],
    engine: "1.5L / 74 bhp",
    seating: 7,
    transmission: "Manual",
    fuel: "Diesel",
    inStock: true,
    description:
      "Rugged, dependable utility vehicle — built for rural and semi-urban roads.",
  },
  {
    id: "c-6",
    name: "Maruti Suzuki WagonR CNG",
    brand: "Maruti Suzuki",
    price: 620000,
    image:
      "https://images.unsplash.com/photo-1541348263662-e068662d82af?auto=format&fit=crop&w=1200&q=80",
    colors: ["Silver", "White"],
    engine: "1.0L / 67 bhp",
    seating: 5,
    transmission: "Manual",
    fuel: "CNG",
    inStock: true,
    description:
      "Spacious tall-boy hatchback with factory-fitted CNG for very low running cost.",
  },
];

export const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
