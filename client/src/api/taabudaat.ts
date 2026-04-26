import { apiFetch } from './client';
import type { CityTaabudaat } from '../../../shared/types';

export function fetchTaabudaat(slug: string) {
  return apiFetch<{ taabudaat: CityTaabudaat }>(`/cities/${slug}/taabudaat`);
}
