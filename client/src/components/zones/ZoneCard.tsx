import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import type { Zone } from '../../../../shared/types';

export function ZoneCard({ zone }: { zone: Zone }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{zone.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {zone.description && (
          <p className="text-sm text-muted-foreground">{zone.description}</p>
        )}
        {zone.location && (
          <p className="text-sm">
            <span className="text-muted-foreground">Location:</span>{' '}
            {zone.location}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          {zone.distanceFromAirport && (
            <Badge variant="secondary">Airport: {zone.distanceFromAirport}</Badge>
          )}
          {zone.distanceFromStation && (
            <Badge variant="secondary">Station: {zone.distanceFromStation}</Badge>
          )}
        </div>
        {zone.contactPhone && (
          <p className="text-xs text-muted-foreground">
            Phone: {zone.contactPhone}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
