import { useState, useEffect } from 'react';
import { useCity } from '../context/CityContext';
import { fetchZones } from '../api/zones';
import { ZoneCard } from '../components/zones/ZoneCard';
import type { Zone } from '../../../shared/types';

export function ZonesPage() {
  const { citySlug, city, loading: cityLoading } = useCity();
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!citySlug) return;
    setLoading(true);
    fetchZones(citySlug)
      .then((res) => setZones(res.zones))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [citySlug]);

  if (cityLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Loading zones...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Zones</h1>
      <p className="text-muted-foreground mb-6">
        Zones for {city?.name || 'the city'}
      </p>
      {zones.length === 0 ? (
        <p className="text-muted-foreground">
          There are currently no zones to display.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {zones.map((zone) => (
            <ZoneCard key={zone.zoneId} zone={zone} />
          ))}
        </div>
      )}
    </div>
  );
}
