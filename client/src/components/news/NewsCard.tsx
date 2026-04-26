import { Link, useLocation } from 'react-router';
import { useCity } from '../../context/CityContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import type { NewsItem } from '../../../../shared/types';

export function NewsCard({ item }: { item: NewsItem }) {
  const { citySlug } = useCity();
  const location = useLocation();
  const isCityPath = location.pathname.startsWith('/cities/');
  const linkTo = isCityPath
    ? `/cities/${citySlug}/news/${item.id}`
    : `/news/${item.id}`;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{item.title}</CardTitle>
          {item.pinned && <Badge>Pinned</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">{item.excerpt}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{item.author}</span>
          <span>{new Date(item.timestamp).toLocaleDateString()}</span>
        </div>
        <Link
          to={linkTo}
          className="text-sm text-primary hover:underline mt-2 inline-block"
        >
          Read more →
        </Link>
      </CardContent>
    </Card>
  );
}
