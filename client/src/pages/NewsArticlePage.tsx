import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router';
import { useCity } from '../context/CityContext';
import { fetchNewsItem } from '../api/news';
import { Badge } from '../components/ui/badge';
import type { NewsItem } from '../../../shared/types';

export function NewsArticlePage() {
  const { id } = useParams<{ id: string }>();
  const { citySlug } = useCity();
  const location = useLocation();
  const [article, setArticle] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isCityPath = location.pathname.startsWith('/cities/');
  const backTo = isCityPath ? `/cities/${citySlug}/news` : '/news';

  useEffect(() => {
    if (!citySlug || !id) return;
    setLoading(true);
    fetchNewsItem(citySlug, id)
      .then((res) => setArticle(res.newsItem))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [citySlug, id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Loading article...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-destructive">{error || 'Article not found'}</p>
        <Link to={backTo} className="text-primary hover:underline mt-4 inline-block">
          ← Back to News
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link
        to={backTo}
        className="text-sm text-primary hover:underline mb-4 inline-block"
      >
        ← Back to News
      </Link>
      <article>
        <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-6">
          {article.author && <span>By {article.author}</span>}
          <span>{new Date(article.timestamp).toLocaleDateString()}</span>
          {article.pinned && <Badge>Pinned</Badge>}
        </div>
        <div className="prose prose-neutral max-w-none">
          <p>{article.content}</p>
        </div>
      </article>
    </div>
  );
}
