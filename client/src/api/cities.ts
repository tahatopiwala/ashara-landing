import { apiFetch } from './client';
import type {
  ConfigResponse,
  CitiesListResponse,
  CityResponse,
  CityAbout,
} from '../../../shared/types';

export function fetchConfig() {
  return apiFetch<ConfigResponse>('/config');
}

export function fetchCities() {
  return apiFetch<CitiesListResponse>('/cities');
}

export function fetchCity(slug: string) {
  return apiFetch<CityResponse>(`/cities/${slug}`);
}

export function fetchCityAbout(slug: string) {
  return apiFetch<{ about: CityAbout }>(`/cities/${slug}/about`);
}
