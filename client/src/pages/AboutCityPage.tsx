import { useCity } from '../context/CityContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

export function AboutCityPage() {
  const { city, loading, error } = useCity();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error || !city) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-destructive">
          {error || 'City information not available'}
        </p>
      </div>
    );
  }

  const { about } = city;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">About {city.name}</h1>
        {city.tagline && (
          <p className="text-lg text-muted-foreground">{city.tagline}</p>
        )}
        {city.subtitle && (
          <p className="text-muted-foreground">{city.subtitle}</p>
        )}
      </div>

      {/* Key Facts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{about.population}</div>
            <div className="text-xs text-muted-foreground">Population</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{about.altitude}</div>
            <div className="text-xs text-muted-foreground">Altitude</div>
          </CardContent>
        </Card>
        {about.keyFacts.slice(0, 2).map((fact, i) => (
          <Card key={i}>
            <CardContent className="p-4 text-center">
              <div className="text-sm">{fact}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Description */}
      {about.description && (
        <div className="mb-10">
          <p className="text-muted-foreground leading-relaxed">
            {about.description}
          </p>
        </div>
      )}

      {/* Attractions */}
      {about.attractions.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Nearby Attractions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {about.attractions.map((attraction) => (
              <Card key={attraction.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {attraction.name}
                    </CardTitle>
                    <Badge variant="secondary">{attraction.distance}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    {attraction.description}
                  </p>
                  {attraction.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {attraction.highlights.map((h, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {h}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Activities */}
      {about.activities.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Activities</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {about.activities.map((activity) => (
              <Card key={activity.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{activity.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
