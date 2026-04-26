import { apiFetch } from './client';
import type { CityAbout } from '../../../shared/types';

export function updateCityAbout(slug: string, about: CityAbout) {
  return apiFetch<{ about: CityAbout }>(`/admin/cities/${slug}/about`, {
    method: 'PUT',
    body: JSON.stringify({ about }),
  });
}
