import { apiFetch } from './client';
import type { NewsItem } from '../../../shared/types';

export function fetchNews(slug: string) {
  return apiFetch<{ news: NewsItem[] }>(`/cities/${slug}/news`);
}

export function fetchNewsItem(slug: string, id: string) {
  return apiFetch<{ newsItem: NewsItem }>(`/cities/${slug}/news/${id}`);
}
