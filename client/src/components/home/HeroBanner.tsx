import { useCity } from '../../context/CityContext';

export function HeroBanner() {
  const { city, event } = useCity();

  return (
    <section className="relative bg-gradient-to-b from-primary/10 to-background py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {event?.name || 'Ashara Mubaraka'}
        </h1>
        <p className="text-xl text-muted-foreground mb-2">
          {event?.year || ''} — {event?.hijriYear || ''}
        </p>
        {city && (
          <p className="text-lg text-muted-foreground">{city.name}</p>
        )}
        {city?.tagline && (
          <p className="text-sm text-muted-foreground mt-2 italic">
            {city.tagline}
          </p>
        )}
      </div>
    </section>
  );
}
