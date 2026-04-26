import { apiFetch } from './client';
import type { Zone } from '../../../shared/types';

export function fetchZones(slug: string) {
  return apiFetch<{ zones: Zone[] }>(`/cities/${slug}/zones`);
}
