// ===== Event Config =====
export interface EventConfig {
  name: string;
  year: string;
  hijriYear: string;
  startDate: string;
  endDate: string;
  activeCitySlug: string;
}

// ===== City =====
export interface CityProfile {
  citySlug: string;
  name: string;
  tagline: string;
  subtitle: string;
  contactEmail: string;
  coordinates: Coordinates;
  mapEmbedUrl: string;
  heroImageKey: string;
  theme: CityTheme;
  about: CityAbout;
}

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface CityTheme {
  primaryColor: string;
  accentColor: string;
}

export interface CityAbout {
  population: string;
  altitude: string;
  keyFacts: string[];
  description: string;
  attractions: Attraction[];
  activities: Activity[];
}

export interface Attraction {
  id: string;
  name: string;
  distance: string;
  description: string;
  highlights: string[];
  imageKey: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  season: string;
  icon: string;
}

// ===== Zones =====
export interface Zone {
  citySlug: string;
  zoneId: string;
  name: string;
  description: string;
  location: string;
  imageKey: string;
  distanceFromAirport: string;
  distanceFromStation: string;
  contactPhone: string;
}

// ===== Transportation =====
export interface TransportHub {
  name: string;
  code: string;
  address: string;
  facilities: string[];
  transportOptions: string[];
}

export interface CityTransportation {
  citySlug: string;
  airports: TransportHub[];
  railwayStations: TransportHub[];
  travelTips: string[];
}

// ===== News =====
export interface NewsItem {
  citySlug: string;
  id: string;
  timestamp: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  imageKey: string;
  pinned: boolean;
}

// ===== Taabudaat =====
export interface TaabudaatMetric {
  id: string;
  name: string;
  category: 'quran' | 'tasbeeh' | 'dua' | 'ziyarat';
  icon: string;
  count: number;
}

export interface CityTaabudaat {
  citySlug: string;
  metrics: TaabudaatMetric[];
}

// ===== S3 Upload =====
export interface PresignRequest {
  citySlug: string;
  entityType: string;
  entityId: string;
  fileName: string;
  contentType: string;
}

export interface PresignResponse {
  uploadUrl: string;
  key: string;
}

// ===== API Responses =====
export interface ConfigResponse {
  event: EventConfig;
}

export interface CitiesListResponse {
  cities: CityProfile[];
}

export interface CityResponse {
  city: CityProfile;
}
