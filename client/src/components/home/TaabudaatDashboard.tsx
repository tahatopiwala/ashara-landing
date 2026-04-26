import { useState, useEffect } from 'react';
import { useCity } from '../../context/CityContext';
import { fetchTaabudaat } from '../../api/taabudaat';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { TaabudaatMetric } from '../../../../shared/types';

export function TaabudaatDashboard() {
  const { citySlug } = useCity();
  const [metrics, setMetrics] = useState<TaabudaatMetric[]>([]);

  useEffect(() => {
    if (!citySlug) return;
    fetchTaabudaat(citySlug)
      .then((res) => setMetrics(res.taabudaat.metrics))
      .catch(() => {});
  }, [citySlug]);

  const categories = ['quran', 'tasbeeh', 'dua', 'ziyarat'] as const;
  const totals = categories.map((cat) => ({
    category: cat,
    total: metrics.filter((m) => m.category === cat).reduce((s, m) => s + m.count, 0),
  }));

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Ashara Taabudaat
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {totals.map(({ category, total }) => (
            <Card key={category}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm capitalize">{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{total}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
