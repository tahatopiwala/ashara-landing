import { useState, useEffect } from 'react';
import { useCity } from '../context/CityContext';
import { fetchTaabudaat } from '../api/taabudaat';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import type { TaabudaatMetric } from '../../../shared/types';

const CATEGORY_LABELS: Record<string, string> = {
  quran: 'Quranic Acts',
  tasbeeh: 'Invocations & Remembrance',
  dua: 'Duas',
  ziyarat: 'Visitations',
};

export function TaabudaatPage() {
  const { citySlug, city, loading: cityLoading } = useCity();
  const [metrics, setMetrics] = useState<TaabudaatMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!citySlug) return;
    setLoading(true);
    fetchTaabudaat(citySlug)
      .then((res) => setMetrics(res.taabudaat.metrics))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [citySlug]);

  if (cityLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Loading taabudaat...</p>
      </div>
    );
  }

  const categories = ['quran', 'tasbeeh', 'dua', 'ziyarat'] as const;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Taabudaat Amal</h1>
      <p className="text-muted-foreground mb-6">
        Spiritual practices tracker for {city?.name || 'the city'}
      </p>
      <p className="text-sm text-muted-foreground mb-8">
        Visit this page regularly for updating your Taabudaat Amal counts.
      </p>

      {categories.map((cat) => {
        const catMetrics = metrics.filter((m) => m.category === cat);
        if (catMetrics.length === 0) return null;

        return (
          <div key={cat} className="mb-8">
            <h2 className="text-xl font-semibold mb-3">
              {CATEGORY_LABELS[cat] || cat}
            </h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Practice</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {catMetrics.map((metric) => (
                  <TableRow key={metric.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {metric.name}
                        <Badge variant="outline" className="text-xs">
                          {cat}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {metric.count}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        );
      })}
    </div>
  );
}
