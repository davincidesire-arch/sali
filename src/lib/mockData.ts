import { Provider, Location, ServiceType } from '../types';

const PROVIDER_NAMES = [
  'Quick Fix Plumbing',
  'Sparky Solutions',
  'The Pipe Doctor',
  'Current Events Electrical',
  'Flow Masters',
  'Bright Ideas Electric',
  'Drip Stop Services',
  'Voltage Pros',
  'Clear Water Plumbing',
  'Wire Wise',
  'Elite Electricians',
  'Pro Plumb',
  'Safe Circuit',
  'Aqua Tech',
  'Power Pulse',
];

const CITIES = ['Lahore', 'Karachi', 'Islamabad', 'Faisalabad', 'Multan'];

export const MOCK_PROVIDERS: Provider[] = [
  {
    id: '1',
    name: 'Lahore Plumb Pro',
    type: 'plumber',
    address: '123 Main St, Gulberg',
    city: 'Lahore',
    phone: '0300-1234567',
    location: { lat: 31.5204, lng: 74.3587 },
    rating: 4.8,
    ratingsCount: 124,
    isActive: true,
    imageUrl: 'https://picsum.photos/seed/plumber1/200/200',
  },
  {
    id: '2',
    name: 'Sparky Electric',
    type: 'electrician',
    address: '456 Oak Rd, DHA Phase 5',
    city: 'Lahore',
    phone: '0321-7654321',
    location: { lat: 31.4697, lng: 74.4084 },
    rating: 4.5,
    ratingsCount: 89,
    isActive: true,
    imageUrl: 'https://picsum.photos/seed/electrician1/200/200',
  },
];

export function generateDynamicProviders(center: Location, count: number = 20): Provider[] {
  const providers: Provider[] = [];
  
  for (let i = 0; i < count; i++) {
    const latOffset = (Math.random() - 0.5) * 0.1; // Approx 10km range
    const lngOffset = (Math.random() - 0.5) * 0.1;
    
    const type: ServiceType = Math.random() > 0.5 ? 'plumber' : 'electrician';
    const name = PROVIDER_NAMES[Math.floor(Math.random() * PROVIDER_NAMES.length)] + ` #${i + 1}`;
    
    providers.push({
      id: `dynamic-${i}`,
      name,
      type,
      address: `${Math.floor(Math.random() * 999)} Street, Area ${i + 1}`,
      city: CITIES[Math.floor(Math.random() * CITIES.length)],
      phone: `03${Math.floor(Math.random() * 99)}-${Math.floor(Math.random() * 9999999)}`,
      location: {
        lat: center.lat + latOffset,
        lng: center.lng + lngOffset,
      },
      rating: Number((Math.random() * 2 + 3).toFixed(1)), // 3.0 to 5.0
      ratingsCount: Math.floor(Math.random() * 200),
      isActive: true,
      imageUrl: `https://picsum.photos/seed/${type}${i}/200/200`,
    });
  }
  
  return providers;
}
