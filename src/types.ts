export type ServiceType = 'plumber' | 'electrician' | 'all';

export interface Location {
  lat: number;
  lng: number;
}

export interface Provider {
  id: string;
  name: string;
  type: ServiceType;
  address: string;
  city: string;
  phone: string;
  location: Location;
  rating: number;
  ratingsCount: number;
  isActive: boolean;
  distanceKm?: number;
  imageUrl?: string;
}

export interface FilterState {
  type: ServiceType;
  radiusKm: number;
  searchQuery: string;
}

export interface AIParseResult {
  type: ServiceType;
  radiusKm?: number;
  nameKeyword?: string;
  locationKeywords?: string;
}
