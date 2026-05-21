// 📍 REAL BENI LOCATIONS - Update as needed
export const BENI_LOCATIONS = [
  { id: "beni_bazaar", name: "Beni Bazaar", lat: 28.3488, lng: 83.5752 },
  { id: "beni_bridge", name: "Beni Bridge", lat: 28.3502, lng: 83.5771 },
  { id: "baglung_gate", name: "Baglung Gate", lat: 28.3520, lng: 83.5790 },
  { id: "hospital", name: "Beni Hospital", lat: 28.3465, lng: 83.5740 },
  { id: "bus_park", name: "Bus Park", lat: 28.3510, lng: 83.5760 },
  { id: "myagdi_campus", name: "Myagdi Campus", lat: 28.3530, lng: 83.5800 },
  { id: "hospital_road", name: "Hospital Road", lat: 28.3470, lng: 83.5745 },
  { id: "police_office", name: "Police Office", lat: 28.3490, lng: 83.5755 },
  { id: "darbang", name: "Darbang", lat: 28.3800, lng: 83.5500 },
  { id: "tatopani", name: "Tatopani", lat: 28.4000, lng: 83.5200 },
];

// 💰 PRICING (in NPR)
export const PRICING = {
  bike: {
    base: 30,        // Base fare Rs.30
    perKm: 15,       // Rs.15 per km
    minFare: 50,     // Minimum Rs.50
  },
  car: {
    base: 80,
    perKm: 30,
    minFare: 120,
  },
  ebike: {
    perHour: 30,     // Rs.30 per hour rental
    deposit: 100,    // Refundable deposit
  },
};

// Calculate fare
export const calculateFare = (type, distanceKm) => {
  const p = PRICING[type];
  if (type === "ebike") return p.perHour;
  const fare = p.base + distanceKm * p.perKm;
  return Math.max(fare, p.minFare);
};

// 🚗 RIDE TYPES
export const RIDE_TYPES = [
  {
    id: "bike",
    name: "BeniMoto",
    icon: "🏍️",
    desc: "Fast motorcycle ride",
    seats: 1,
    eta: "2 min",
  },
  {
    id: "car",
    name: "BeniCar",
    icon: "🚗",
    desc: "Comfortable car ride",
    seats: 4,
    eta: "5 min",
  },
  {
    id: "ebike",
    name: "BeniEbike",
    icon: "⚡",
    desc: "Eco e-bike rental",
    seats: 1,
    eta: "Now",
    tag: "ECO",
  },
];

// 📞 SUPPORT
export const SUPPORT = {
  whatsapp: "977-9800000000", // ← Replace with your real number
  phone: "977-9800000000",    // ← Replace with your real number
  email: "support@beniride.com",
  hours: "6:00 AM – 10:00 PM",
};
