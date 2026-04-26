import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useCity } from '../context/CityContext';
import { apiFetch } from '../api/client';
import { fetchZones } from '../api/zones';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import type { CityTransportation, Zone } from '../../../shared/types';

export function TransportationPage() {
  const { citySlug, city, loading: cityLoading } = useCity();
  const [transport, setTransport] = useState<CityTransportation | null>(null);
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!citySlug) return;
    setLoading(true);
    Promise.all([
      apiFetch<{ transportation: CityTransportation }>(
        `/cities/${citySlug}/transportation`
      ),
      fetchZones(citySlug),
    ])
      .then(([transportRes, zonesRes]) => {
        setTransport(transportRes.transportation);
        setZones(zonesRes.zones);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [citySlug]);

  if (cityLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Loading transportation...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h1 className="text-3xl font-bold">Transportation</h1>
        {citySlug && (
          <Button
            variant="outline"
            size="sm"
            render={<Link to={`/admin/cities/${citySlug}/transportation`} />}
          >
            Edit
          </Button>
        )}
      </div>
      <p className="text-muted-foreground mb-6">
        Getting to {city?.name || 'the city'}
      </p>

      {/* Transport Hubs */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {transport?.airports.map((hub, i) => (
          <Card key={`airport-${i}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {hub.name}
                <Badge>{hub.code}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{hub.address}</p>
              <div>
                <p className="text-sm font-medium mb-1">Facilities</p>
                <div className="flex flex-wrap gap-1">
                  {hub.facilities.map((f, j) => (
                    <Badge key={j} variant="outline" className="text-xs">
                      {f}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Transport Options</p>
                <div className="flex flex-wrap gap-1">
                  {hub.transportOptions.map((t, j) => (
                    <Badge key={j} variant="secondary" className="text-xs">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {transport?.railwayStations.map((hub, i) => (
          <Card key={`station-${i}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {hub.name}
                <Badge>{hub.code}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{hub.address}</p>
              <div>
                <p className="text-sm font-medium mb-1">Facilities</p>
                <div className="flex flex-wrap gap-1">
                  {hub.facilities.map((f, j) => (
                    <Badge key={j} variant="outline" className="text-xs">
                      {f}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Transport Options</p>
                <div className="flex flex-wrap gap-1">
                  {hub.transportOptions.map((t, j) => (
                    <Badge key={j} variant="secondary" className="text-xs">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Distance Table */}
      {zones.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">
            Zone Distances
          </h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Zone</TableHead>
                <TableHead>From Airport</TableHead>
                <TableHead>From Station</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {zones.map((zone) => (
                <TableRow key={zone.zoneId}>
                  <TableCell className="font-medium">{zone.name}</TableCell>
                  <TableCell>{zone.distanceFromAirport || '—'}</TableCell>
                  <TableCell>{zone.distanceFromStation || '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Travel Tips */}
      {transport?.travelTips && transport.travelTips.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Travel Tips</h2>
          <ol className="list-decimal list-inside space-y-2">
            {transport.travelTips.map((tip, i) => (
              <li key={i} className="text-muted-foreground">
                {tip}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
