import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { useCity } from '../../context/CityContext';
import { fetchZones } from '../../api/zones';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { Zone } from '../../../../shared/types';

export function ZoneOverview() {
  const { citySlug } = useCity();
  const location = useLocation();
  const [zones, setZones] = useState<Zone[]>([]);

  useEffect(() => {
    if (!citySlug) return;
    fetchZones(citySlug)
      .then((res) => setZones(res.zones))
      .catch(() => {});
  }, [citySlug]);

  const isCityPath = location.pathname.startsWith('/cities/');
  const zonesPath = isCityPath ? `/cities/${citySlug}/zones` : '/zones';

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Zones</h2>
          <Link
            to={zonesPath}
            className="text-sm text-primary hover:underline"
          >
            View All →
          </Link>
        </div>
        {zones.length === 0 ? (
          <p className="text-muted-foreground">No zones to display.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {zones.map((zone) => (
              <Card key={zone.zoneId}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{zone.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {zone.location}
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
