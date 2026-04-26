import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { useCity } from '../../context/CityContext';
import { fetchNews } from '../../api/news';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { NewsItem } from '../../../../shared/types';

export function LatestNews() {
  const { citySlug } = useCity();
  const location = useLocation();
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    if (!citySlug) return;
    fetchNews(citySlug)
      .then((res) => setNews(res.news.slice(0, 3)))
      .catch(() => {});
  }, [citySlug]);

  const isCityPath = location.pathname.startsWith('/cities/');
  const newsPath = isCityPath ? `/cities/${citySlug}/news` : '/news';

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Latest News</h2>
          <Link
            to={newsPath}
            className="text-sm text-primary hover:underline"
          >
            View All →
          </Link>
        </div>
        {news.length === 0 ? (
          <p className="text-muted-foreground">No news items yet.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {news.map((item) => (
              <Card key={item.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{item.excerpt}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
