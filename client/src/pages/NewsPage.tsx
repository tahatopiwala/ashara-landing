import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useCity } from '../context/CityContext';
import { fetchNews } from '../api/news';
import { NewsCard } from '../components/news/NewsCard';
import { Button } from '../components/ui/button';
import type { NewsItem } from '../../../shared/types';

export function NewsPage() {
  const { citySlug, city, loading: cityLoading } = useCity();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!citySlug) return;
    setLoading(true);
    fetchNews(citySlug)
      .then((res) => setNews(res.news))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [citySlug]);

  if (cityLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Loading news...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h1 className="text-3xl font-bold">Latest News</h1>
        {citySlug && (
          <Button
            variant="outline"
            size="sm"
            render={<Link to={`/admin/cities/${citySlug}/news`} />}
          >
            Edit
          </Button>
        )}
      </div>
      <p className="text-muted-foreground mb-6">
        Updates & announcements for {city?.name || 'the city'}
      </p>
      {news.length === 0 ? (
        <p className="text-muted-foreground">No news items yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {news.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
