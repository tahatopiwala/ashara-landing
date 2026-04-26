import { useCity } from '../../context/CityContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function WeatherWidget() {
  const { city } = useCity();

  if (!city) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Weather — {city.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Coordinates: {city.coordinates.lat}°N, {city.coordinates.lon}°E
        </p>
        <p className="text-sm text-muted-foreground mt-2 italic">
          Weather integration coming soon
        </p>
      </CardContent>
    </Card>
  );
}
