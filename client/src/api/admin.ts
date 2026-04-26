import { apiFetch } from './client';
import type {
  CityAbout,
  CityTransportation,
  NewsItem,
  Zone,
} from '../../../shared/types';

export function updateCityAbout(slug: string, about: CityAbout) {
  return apiFetch<{ about: CityAbout }>(`/admin/cities/${slug}/about`, {
    method: 'PUT',
    body: JSON.stringify({ about }),
  });
}

export function updateTransportation(
  slug: string,
  transportation: Omit<CityTransportation, 'citySlug'>
) {
  return apiFetch<{ transportation: CityTransportation }>(
    `/admin/cities/${slug}/transportation`,
    {
      method: 'PUT',
      body: JSON.stringify({ transportation }),
    }
  );
}

export function updateZones(slug: string, zones: Zone[]) {
  return apiFetch<{ zones: Zone[] }>(`/admin/cities/${slug}/zones`, {
    method: 'PUT',
    body: JSON.stringify({ zones }),
  });
}

export function updateNews(slug: string, news: NewsItem[]) {
  return apiFetch<{ news: NewsItem[] }>(`/admin/cities/${slug}/news`, {
    method: 'PUT',
    body: JSON.stringify({ news }),
  });
}
